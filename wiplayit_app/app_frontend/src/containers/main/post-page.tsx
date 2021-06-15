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

            let storeUpdate   = store.getState();
            let {entities }   = storeUpdate;
            let postById    =  this.state['postById'];
            let post          =  entities['post'][postById];
            if (this.isMounted && post) {
                this.setState({
                            isReloading : post['isLoading'],
                            error : post['error']} ) 
                delete post['error'];
            }
            
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };

    componentWillUnmount() {
        this.isMounted = false;
        //this.unsubscribe();
    };
    
    componentDidMount() {
        this.isMounted = true;
        this.onPostUpdate()
        console.log(this.props)

        let entities = this.props['entities'];
          
        let {slug, id} =  this.props['match'].params;
        let {state}    =  this.props['location'];

        let postById      = `post${id}`;
        this.setState({postById, id})

        if (state && state.recentlyCreated) {
            let post = state.post;
            console.log('Post recently created')
            return this.dispatchToStore(postById, id);
        }

        let {post} = entities;
        post = post && post[postById]
        !post && this.updatePostStore(postById, id);

    };


    updatePostStore(postById:string, id?:number){

        let cacheEntities  = this.props['cacheEntities'];
        let post:object  = cacheEntities && cacheEntities['post'];
        post = post[postById]

        if (post) {
            let timeStamp:number = post['timeStamp'];
            const getTimeState:GetTimeStamp = new GetTimeStamp({timeStamp});
            let menDiff:number = parseInt(`${getTimeState.menutes()}`)
                                
            if (menDiff <= 2) {
                console.log('Post found from cachedEntyties')
                return this.dispatchToStore(postById, post['post'])
            }
        }

        console.log('Fetching post data form the server') 
        return store.dispatch<any>(getPost(id));
    }

    dispatchToStore(postById, post){
        if (postById && post) {
            store.dispatch<any>(action.getPostPending(postById));
            store.dispatch<any>(action.getPostSuccess(postById, post));
        }

    } 

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
        var postById = props['postById'];
        var post = props['entities']['post'];
        post = post && post[postById]
                       
        return (
            <div>
               <PartalNavigationBar {...props}/>
               <NavigationBarBigScreen {...props} />
                <NavigationBarBottom {...props}/>
                { post &&
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
                }           
         </div>

            
    );                   
      
    };
   
};


export default MainAppHoc(PostPage);


export const Post = props => {
	var postById = props.postById;
    var postState = props.entities.post[postById];
    let post      = postState.post;
    var postProps = {...props, post}

	return(
        <div className="post-page" id="post-page">
            <div className="post-container">
                <div className="post-contents"> 
                    <PostComponent {...postProps }  />
                </div>
                <CommentsBox {...postProps}/>
            </div>
        </div>
    );
};


