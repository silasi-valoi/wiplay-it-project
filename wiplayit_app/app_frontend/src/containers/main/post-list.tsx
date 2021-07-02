import React, { Component } from 'react';

import { PostComponent} from "templates/post";
import  * as action  from 'actions/actionCreators';
import {store} from "store/index";
import  MainAppHoc from "containers/main/index-hoc";
import { MatchMediaHOC } from 'react-match-media';
import { UnconfirmedUserWarning,PageErrorComponent, } from "templates/partials";
import {OpenEditorBtn}  from "templates/buttons";
import {CREATE_POST} from 'actions/types';
import Api from 'utils/api';

import {PartalNavigationBar,
        createPostProps,
        NavigationBarBottom,
        NavigationBarBigScreen } from "templates/navBar";
import  AjaxLoader from "templates/ajax-loader";
 
import { getPostList } from 'dispatch/index';


const api      = new Api();

class  PostListPage extends Component  {
    private isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;
    
    constructor(props) {
        super(props);

        this.state = {
            isPostListBox   : true,
            postListById    : 'filteredPosts',
             pageName       : "Posts", 
            isReloading     : false,
            
        }
     
    }

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 
    

    onPostListUpdate = () =>{

        const onStoreChange = () => {

            let storeUpdate    = store.getState();
            let {entities }    = storeUpdate;
            let postListById =  this.state['postListById'];
            let posts          =  entities['posts'];
            let postListData = posts[postListById];

            if (Object.keys(postListData)) {
                let isReloading = postListData['isLoading'];
                this.setState({isReloading}); 

                let error = postListData['error'];
                if (error) {
                    this.setState({error})
                    delete postListData['error']
                }
            }
            
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };
      

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };
      
    componentDidMount() {
        this.isMounted = true;
        this.onPostListUpdate();
        
        var postListById = this.state['postListById'];
        let cacheEntities = this.props['cacheEntities'];
        let { posts, currentUser } = cacheEntities;
        posts  =  posts[postListById]

        let postList = posts && posts.postList;

        if (postList) {
            store.dispatch<any>(action.getPostListPending(postListById));
            store.dispatch<any>(action.getPostListSuccess( postListById ,postList));
            return
        }

        store.dispatch<any>(getPostList(postListById));                           
    }

    reLoader =()=>{
        let postListById = this.state['postListById'];   
        this.isMounted && this.setState({isReloading : true})
        return store.dispatch<any>(getPostList(postListById));
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
        var posts  = props['entities'].posts;
        posts  = posts[props['postListById']];
        let postList = posts && posts.postList;
        
        return (
            <div>
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} /> 
                 <NavigationBarBottom {...props}/>
                <div className="app-box-container">
                    <div className="page-contents">
                    <UnconfirmedUserWarning {...props}/>
                        
                    { posts && posts.isLoading && 
                        <div  className="page-spin-loader-box partial-page-loader">
                            <AjaxLoader/>
                        </div>
                    }

                    { posts && posts.error &&
                        <PageErrorComponent {...props}/>
                    }
                       
                    
                    { postList && postList.map(( post, index )  => {
    
                        return (
                            <div key={post.id} 
                                 className="post-list-page" id="post-list-page">
                                <div className="post-container">
                                    <div className="post-contents">
                                        <PostComponent {...{...props, post}}/>
                                    </div>
                                </div>
                        </div>
                    )})
                    
            
                    ||
                
                    <div className="">
                        <ul className="empty-post-list-box">
                           <li className="">
                                No Posts Yet
                            </li>
                        </ul>

                        <div className="post-list-create-box">
                            <OpenEditorBtn {...createPostProps}/>
                        </div>
                    </div>
                }
                </div>
            </div>
            </div>
        );
    };

};


export default MainAppHoc(PostListPage);


const Posts = props => {
    let {entities, postListById} = props;
    let {posts} =  entities;
    posts       =  posts && posts[postListById];
    let postList = posts && posts.postList;
  
    return (
        <div className="post-list-page" id="post-list-page">
            {postList && postList.map(( post, index )  => {
    
                return (
                    <div key={post.id}>
                        <div className="post-container">
                            <div className="post-contents">
                                <PostComponent {...{...props, post}}/>
                            </div>
                        </div>
                    </div>
                )})
            
                ||

                <div className="">
                    <ul className="empty-post-list-box">
                        <li className="">
                            No Posts Yet
                        </li>
                    </ul>

                    <div className="post-list-create-box">
                        <OpenEditorBtn {...createPostProps}/>
                    </div>
                </div>
            }
    
        </div>        
    );
};




const PostList = (props, postList=[])=>{
    return postList.map(( post, index )  => {
    
        return (
            <div key={post.id}>
                <div className="post-container">
                    <div className="post-contents">
                        <PostComponent {...{...props, post}}/>
                    </div>
                </div>
            </div>
        )
    })
};

 