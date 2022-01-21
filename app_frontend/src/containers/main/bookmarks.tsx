
import React, { Component } from 'react';

import MainAppHoc from "containers/main/index-hoc";
import {AnswersComponent} from 'templates/answer';
import {PostComponent} from 'templates/post';
import  * as action  from 'actions/actionCreators';
import {store} from "store/index";
import {displaySuccessMessage} from 'utils/helpers';


class  BookmarkContainer extends Component  {
    public isFullyMounted = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Bookmarks",
            bookmarks: undefined,
            onAnswersBookmark:false,
            onPostsBookmark:false,
            answerListById: '',
            postListById:'',
        };       
    }

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }

    onStoreUpdate = ()=> {
 
        const onStoreChange = () => {
            let storeUpdate = store.getState();
            
            let {entities} = storeUpdate;
            let  index:object  = entities['index'];
            
            if (index['bookmarkRemoved']) {
                delete index['bookmarkRemoved']
                displaySuccessMessage(this, index['successMessage'])
                delete index['successMessage']
                store.dispatch<any>(action.getIndexSuccess(index))
                this.dispatchBookmarks(index['bookmarks'])
            }
        }

        this.unsubscribe = store.subscribe(onStoreChange);
    }

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    }


    componentDidMount() {
        this.isMounted = true;
      
        this.onStoreUpdate()
        console.log(this.props)
        let {cacheEntities} = this.props['cacheEntities'];
                
        let bookmarks = cacheEntities?.index?.bookmarks
        this.setState(
                {
                    bookmarks,
                    postListById:'bookmarkedPosts',
                    answerListById:'bookmarkedAnswers'
                }
            )

        this.dispatchBookmarks(bookmarks)
    }

    dispatchBookmarks = (bookmarks) => {
        console.log(bookmarks, 'dispatch bookmarks')
        let answers = bookmarks?.answers 
        let posts = bookmarks?.posts
        
        if (answers) {
            store.dispatch<any>(action.getAnswerListPending('bookmarkedAnswers'));
            store.dispatch<any>(action.getAnswerListSuccess('bookmarkedAnswers', answers));
            this.setState({onAnswersBookmark:true})
        }

        if (posts) {
            store.dispatch<any>(action.getPostListPending('bookmarkedPosts'));
            store.dispatch<any>(action.getPostListSuccess('bookmarkedPosts', answers));
        }

    }

    toogleBookmarkContents =(contents)=>{
        this.setState(contents)
    }

    render(){
        if (!this.isMounted) {
            return null;
        }

        let props = {
                ...this.props,
                ...this.state,
                toogleBookmarkContents:this.toogleBookmarkContents.bind(this)
            }

        let bookmarks = props['bookmarks'];
        
        let BookmarkBox = <Bookmark {...props}/>

        if (!bookmarks?.answers?.length && !bookmarks?.posts?.length ) {
            BookmarkBox = <ul className="empty-bookmark">
                                <li>Your bookmarks will appear here</li>
                            </ul>
        }


        return(
            <div className="bookmark-page">
                <div className="bookmark-container">
                    {BookmarkBox}
                </div>
            </div>
        )
    }
};

export default MainAppHoc(BookmarkContainer); 


export const BookmarkNavStles = {
        active : {
            color:'red',
            background:'#D5D7D5',
        },

        nonActive : {
        },
    
};

export const Bookmark = props => {
    let onAnswersStles = props.onAnswersBookmark && BookmarkNavStles.active || {};
    let onPostsStles = props.onPostsBookmark && BookmarkNavStles.active || {};

    let answersToggleProps = {
            onAnswersBookmark:true,
            onPostsBookmark:false
    }

    let postsToggleProps = {
            onAnswersBookmark:false,
            onPostsBookmark:true
    }

    return(
        <div className="bookmark-box">
            <div className="bookmark-title-box">
                <b className="bookmark-title">Bookmarks</b>
            </div>
            <div className="bookmark-nav">
                <div className="bookmark-nav-title-box">
                    <ul className="bookmark-nav-title">Contents</ul>  
                </div>  
                <div  className="bookmark-nav-contents">
                    <button 
                        style={onAnswersStles}
                        onClick={()=> props.toogleBookmarkContents(answersToggleProps)}
                        className="btn" 
                        type="button">
                        Answers
                    </button>
                    
                </div>
                <div className="bookmark-nav-contents">
                    <button 
                        style={onPostsStles}
                        onClick={()=> props.toogleBookmarkContents(postsToggleProps)}
                        className="btn" 
                        type="button">
                        Posts
                    </button>
                </div>
            </div>
            <div className="bookmark-contents-box">
                {props?.onAnswersBookmark &&
                    <AnswersBookmark {...props}/>
                }

                {props?.onPostsBookmark &&
                    <PostsBookmark {...props}/>

                }
            </div>
        </div>
    )
}


export const AnswersBookmark = props => {

    let answers = props?.entities.answers;
    answers = answers && answers[props.answerListById];
    let answerList = answers?.answerList;

    return(
        <div className="">
            {answerList?.map((answer, index) => {
                let answerProps = {...props, answer};
                
                return(
                    <div key={index} className="bookmark-contents">
                        <AnswersComponent {...answerProps}/>
                    </div>
                )
            })}
        </div>
    )
}

export const PostsBookmark = props => {
    let posts = props?.entities.posts;
    posts = posts && posts[props.answerListById];
    let postList = posts?.postList;

    
    return(
        <div>
            {postList?.map((post, index) => {
                let postProps = {...props, post};
                
                return(
                    <div key={index} className="bookmark-contents">
                        <PostComponent {...postProps}/>
                    </div>
                )
            })}
        </div>
    )
}
