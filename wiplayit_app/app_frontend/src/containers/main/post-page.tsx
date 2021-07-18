import React, { Component } from 'react';

import {PartalNavigationBar,
    NavigationBarBottom,
    NavigationBarBigScreen } from 'templates/navBar';

import  AjaxLoader from 'templates/ajax-loader';
import CommentsBox from 'containers/main/comment-page';
import {PostComponent} from 'templates/post';
import  MainAppHoc from "containers/main/index-hoc";

import {UnconfirmedUserWarning, PageErrorComponent} from 'templates/partials';

import  * as action  from 'actions/actionCreators';
import { getPost } from 'dispatch/index';
import {store} from "store/index";
import GetTimeStamp from 'utils/timeStamp';
import {cacheExpired} from 'utils/helpers';


class  PostPage extends Component  {
    public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
      super(props);

        this.state = {
            isPostBox   : true,
            isReloading : false,
            pageName    : "Post", 
            postById    : '',
            postData    : null,
            error       : '',
        };
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 

    onPostUpdate = () =>{

        const onStoreChange = () => {
            if(!this.isMounted) return;

            let storeUpdate = store.getState();
            let {entities} = storeUpdate;
            let postById =  this.state['postById'];
            let post =  entities['post'];
            let postData = post && post[postById];

            if (postData) {
                
                let isReloading:string = postData['isLoading'];
                this.setState({isReloading, postData});

                let error:string = postData['error']; 
                if (error) {
                    this.setState({error});
                    delete postData['error'];
                }
            }
            
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    getPostFromCache(postById:string):object{
        let cache = this.props['cacheEntities'];
        let postCache = cache['post'];
        postCache = postCache && postCache[postById];
        return postCache;
    }
    
    componentDidMount() {
        this.isMounted = true;
        this.onPostUpdate()
        let entities = this.props['entities'];
        let {slug, id} =  this.props['match'].params;
        let postById      = `post${id}`;
        this.setState({postById, id})

        let postData = this.getPostFromCache(postById)
        let _cacheExpired:boolean = cacheExpired(postData);

        if(!_cacheExpired){
            return this.setState({postData});
        }

        let postStore:object = this.props['entities'].post;
        postData = postStore[postById];

        if (postData && postData['question']) {
            return this.setState({postData})
        }
        
        // Data might have expired or doesn't exist in store,
        // So we fech it from api. 
        store.dispatch<any>(getPost(id));
    };
   
    reLoader =()=>{
        let id = this.state['id'];   
        this.isMounted && this.setState({isReloading : true})
        return store.dispatch<any>(getPost(id));
    };
   
    getProps(){

        return {
            ...this.props,
        	...this.state,
            reLoader : this.reLoader.bind(this),
        };
    };

    render() {
        let props = this.getProps();
        const post = props['postData'];
        if (!post) {
            return null;
        }
                             
        return (
            <div>
               <PartalNavigationBar {...props}/>
               <NavigationBarBigScreen {...props} />
                <NavigationBarBottom {...props}/>
                <div  className="app-box-container">
                    <UnconfirmedUserWarning {...props}/>
                    { post.isLoading &&
                        <div className="page-spin-loader-box partial-page-loader">
                            <AjaxLoader/>
                        </div>
                    }

                    { post.error &&
                        <PageErrorComponent {...props}/>
                    }
                      
                    {!post.isLoading &&
                        <Post {...props}/>
                    }
                </div>
            </div>
        );                   
      
    };
   
};


export default MainAppHoc(PostPage);


export const Post = props => {
    const postData = props['postData'];
    let post      = postData.post;
    var postProps = {
            ...props,
            post
        }

	return(
        <div className="post-page" id="post-page">
            <div className="post-container">
                <div className="post-contents"> 
                    <PostComponent {...postProps }/>
                    <CommentsBox {...postProps}/>
                </div>
                
            </div>
        </div>
    );
};


