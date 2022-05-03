import React, { Component } from 'react';

import  AjaxLoader from 'templates/ajax-loader';
import CommentsBox from 'containers/main/comment-page';
import {PostComponent} from 'templates/post';
import  MainAppHoc from "containers/main/index-hoc";

import {PageErrorComponent, UnconfirmedUserWarning} from 'templates/partials';

import { getPost } from 'dispatch/index';
import {store} from "store/index";
import {cacheExpired} from 'utils';


class  PostPage extends Component  {
    public isFullyMounted:boolean = false;
    private unsubscribe;

    constructor(props) {
      super(props);

        this.state = {
            isPostBox   : true,
            isReloading : false,
            postById    : '',
            postData    : null,
            error       : '',
        };
    };

    static pageName(){
        return "Post"
    }

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
        let postCache = cache && cache['post'];
        postCache = postCache && postCache[postById];
        
        return postCache;
    }
    
    componentDidMount() {
        this.isMounted = true;
        this.onPostUpdate()
        let state:object = this.props['location'].state;
        if (state) {
            let id  =  state['id'];
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
        }
    };
   
    reLoader =()=>{
        let id = this.state['id'];   
        this.isMounted && this.setState({isReloading : true, error:null})
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
        if(!this.isMounted){
            return null;
        }

        let props = this.getProps();
        const post = props['postData'];
       
        if (!post) {
            return null;
        }
                                  
        return (
            <div className="">
                <UnconfirmedUserWarning {...props}/>

                <div className="page-contents" id="page-contents">
                
                    {post.isLoading &&
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
    let post = postData.post;
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
    )
};


