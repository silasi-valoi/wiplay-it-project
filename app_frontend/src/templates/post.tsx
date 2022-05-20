import React from 'react';
import {Editor} from 'draft-js';

import {Apis} from 'api';
import  * as types  from 'actions/types';
import { convertFromRaw } from 'utils';
import {
        DownVotePostBtn,
        UpVotePostBtn,
        OpenOptionlBtn,
        OpenEditorBtn,
        LinkButton,
        OpenUsersModalBtn,} from 'templates/buttons';

import {pageMediaBlockRenderer} from 'templates/draft-editor';
import {ButtonsBox, AuthorAvatar, AuthorDetails} from "templates/partials";


export const PostComponent = props => {


    let {
        index,
        post,
        isAuthenticated,
        currentUser, 
        postById,
        postListById} = props;

    if(!post) return null;

    let editorState;
    if (post.post) {
        editorState = convertFromRaw(post.post);
    }
       
    let usersById = post && `postUpVoters${post.id}`;
    let apiUrl = post && Apis.getPostUpVotersListApi(post.id);
    let linkName = post.upvotes > 1 && `${post.upvotes} Upvoters`
                                    || `${post.upvotes} Upvoter`;
    

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
        apiUrl : Apis.addPostBookmarkApi(post.id)
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

    const btnsList   = { 
            authorCounter : PostUpVotersBtn,
            btn1   : UpVoteBtn,
            btn2   : EditorModalBtn,
            btn3   : <OpenOptionlBtn {...btnsProps}/>,
        };

    
    const authorProps:object  = {
            author : post.author,
            data   : post,
        };

    const linkProps = {
        linkPath: `/post/${post.slug}/`,
        state:{id:post['id']},
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
                                onChange={()=> void {}}
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

