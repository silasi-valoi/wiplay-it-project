import React from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import {Editor} from 'draft-js';

import Apis from 'utils/api';
import  * as types  from 'actions/types';
import Helper from 'utils/helpers';
import {
        DownVotePostBtn,
        UpVotePostBtn,
        OpenOptionlBtn,
        OpenEditorBtn,
        ChangeImageBtn,
        LinkButton,
        OpenUsersModalBtn,} from 'templates/buttons';

import CommentsBox from "containers/main/comment-page";
import {pageMediaBlockRenderer} from 'templates/draft-editor';
import {ButtonsBox, AuthorAvatar, AuthorDetails} from "templates/partials";


const helper   = new Helper();


export const PostComponent = props => {

    let optionsBtnStyles = {
              fontSize   : '8px',
              background : 'white',
              fontWeight : 'bold',
              width      : '40px',
              color      : '#4A4A4A',
              margin     : '0 0 2px'
    }

    let {
        index,
        post,
        isAuthenticated,
        currentUser, 
        postById,
        postListById}     =    props;

    if(!post) return null;
    let postText:string = post.post || post.add_post;

    let editorState;
    if (postText) {
        editorState  = helper.convertFromRaw(postText);
    }
   
    let usersById       = post && `postUpVoters${post.id}`;
    let apiUrl          = post && Apis.getPostUpVotersListApi(post.id);
    let linkName = post.upvotes > 1 && `${post.upvotes} Upvoters`
                                    || `${post.upvotes} Upvoter`;

    let state = {
            post,
            usersIsFor : 'postUpVoters', 
        }

    let postUpvotersProps = {
            apiUrl,
            byId      : usersById,
            obj       : post,
            currentUser,
            linkName,
        };

    let editObjProps = {
        objName     : 'Post',
        isPut       : true,
        obj         : post, 
        byId        : postById || postListById,
        currentUser,
        isAuthenticated, 
        actionType : types.UPDATE_POST,
        editorPlaceHolder : `Edit Post...`,
        apiUrl:Apis.updatePostApi(post.id)
    };



    let createObjProps = {
        index,
        objName           : 'Comment',
        obj               : post,
        isPost            : true,
        currentUser,
        editorPlaceHolder : `Add Comment...`,
        byId        : `newPostComments${post.id}`,
        className   : 'btn-sm edit-comment-btn',
        isAuthenticated,
        actionType : types.CREATE_COMMENT,
        apiUrl:Apis.createPostCommentApi(post.id)
    };

    let createBookmarkProps = {
        objName           : `PostBookmark`,
        obj               : post,
        byId              : `bookmarkedPosts`,
        isPost            : true,
        currentUser,  
        isAuthenticated,
        actionType : types.CREATE_BOOKMARK,
        apiUrl : Apis.addPostBookMarkApi(post.id)
    };

    let EditorModalBtn     = <OpenEditorBtn {...createObjProps}/>; 

    let PostUpVotersBtn = post.upvotes !== 0 &&   
                    <OpenUsersModalBtn {...postUpvotersProps}/>; 
   
    

    let btnsProps = {
        ...props,
        createObjProps,
        editObjProps,
        createBookmarkProps
    }; 

    let UpVoteBtn =  post.upvoted? <DownVotePostBtn {...btnsProps}/>
               : <UpVotePostBtn {...btnsProps}/>

    let comments:object[] = post?.comments;
    let itemsName:string = comments?.length > 1  && "Comments" ||
                        comments?.length == 1 && "Comment" || '';

    let itemsProps:object = {
            itemsName,
            items: comments,
            itemsById : `commentsPost${post.id}`,
            getItemsList : props.getCommentList
        }
    

    const btnsList   = { 
            authorCounter : PostUpVotersBtn,
            btn1   : UpVoteBtn,
            btn2   : EditorModalBtn,
            btn3   : <OpenOptionlBtn {...btnsProps}/>,
        };

   const userProps  = {
            obj   : post,
            currentUser
        };
    
    const authorProps:object  = {
            author : post.author,
            data   : post,
        };

    const linkProps = {
        linkPath: `/post/${post.slug}/${post.id}/`,
        state:{post},
    }

    return (
        <div>
            {editorState?
                <div className="post-box">
                    <div className="post"> 
                        <div className="author-post-details-box">
                            <AuthorAvatar {...authorProps}/>
                            <AuthorDetails {...authorProps}/>           
                        </div>
                        <ul className="post-title">
                            {props.isPostBox && 
                                <li>
                                    {post.title || post.add_title}
                                </li>

                                ||

                                <li>
                                    <LinkButton {...linkProps}>
                                        <span>{post.title || post.add_title}</span>
                                    </LinkButton>
                                </li>
                            }
                        </ul>

                    </div>
                    <div className="post-body">
                        {editorState &&
                            <Editor
                                blockRendererFn={pageMediaBlockRenderer}
                                editorState={editorState}
                                readOnly={true}
                            />
                        }
                        
                    </div>
                    <ButtonsBox {...btnsList}/>
            </div>
                 
            :
            null
        }
        </div>
    );

};

