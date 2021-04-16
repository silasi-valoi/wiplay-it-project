import React, { Component } from 'react';

import { PostComponent} from "templates/post";
import  * as action  from 'actions/actionCreators';
import {store} from "store/index";
import  MainAppHoc from "containers/main/index-hoc";
import { GetModalLinkProps } from "templates/component-props";
import { MatchMediaHOC } from 'react-match-media';
import { UnconfirmedUserWarning,PageErrorComponent, } from "templates/partials";
import {OpenEditorBtn}  from "templates/buttons";

import {PartalNavigationBar,
    NavigationBarBottom,
    NavigationBarBigScreen } from "templates/navBar";
import  AjaxLoader from "templates/ajax-loader";
 
import { getPostList } from 'dispatch/index';








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
            let posts          =  entities['posts'][postListById];

            if (this.isMounted && posts) {
                this.setState({
                            isReloading : posts.isLoading,
                            error : posts.error} ) 
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
            console.log(posts)
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
        //let style =  {border:'1px solid red',padding:'60px 0 0 0', margin:'100px 0 0 0'}
        var posts  = props['entities'].posts;
        console.log(posts)
        posts  = posts[props['postListById']];
        console.log(props, posts)

        return (
            <div>
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} /> 
                 <NavigationBarBottom {...props}/>
                
                { posts &&
                    <div className="app-box-container post-list-page" id="post-list-page">
                        <UnconfirmedUserWarning {...props}/>
                        
                        { posts.isLoading && 
                            <div  className="page-spin-loader-box partial-page-loader">
                                <AjaxLoader/>
                            </div>
                        }

                        { posts.error && posts.error &&
                            <PageErrorComponent {...props}/>
                        }
                          
                       <Posts {...props}/>
                    </div>
                }
            </div>
        );
    };

};


export default MainAppHoc(PostListPage);






let createPostProps = {
        objName     : 'Post',
        linkName    : 'Add Post',
        isPost      : true,
        className   : "btn",
    };

createPostProps = GetModalLinkProps.props(createPostProps);


const Posts = props => {
    let {entities, postListById} = props;
    let {posts} =  entities;
    posts       =  posts && posts[postListById];
    let postList = posts && posts.postList;
  
    return (
        <div>
            { postList && postList.length &&
                IteratePostList(props, postList)

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




const IteratePostList = (props, postList=[])=>{
    return postList.map(( post, index )  => {
    
        return (
            <div key={post.id}>
                <PostComponent {...{...props, post}}/>
            </div>
        )
    })
};

 