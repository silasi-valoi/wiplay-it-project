import React from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import Api from 'utils/api';
import { GetModalLinkProps } from "templates/component-props";

import  * as types  from 'actions/types';
import Helper from 'utils/helpers';

import {
        DownVotePostBtn,
        UpVotePostBtn,
        OpenOptionlBtn,
        OpenEditorBtn,
        ChangeImageBtn,
        LinkButton,
        ToggleItemsBtn,
        OpenUsersModalBtn,} from 'templates/buttons';

import CommentsBox from "containers/main/comment-page";
import {pageMediaBlockRenderer} from 'templates/draft-editor';
import {Editor} from 'draft-js';
import {ButtonsBox, AuthorAvatar, AuthorDetails} from "templates/partials";


const helper   = new Helper();

const api      = new Api();

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
        post,
        isAuthenticated,
        currentUser, 
        postById,
        postListById}     =    props;

    if(!post) return null;

    const editorState  = helper.convertFromRaw(post.add_post);
   
    let usersById       = post && `postUpVoters${post.id}`;
    let apiUrl          = post && api.getPostUpVotersListApi(post.id);
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
    };



    let createObjProps = {
        objName           : 'Comment',
        obj               : post,
        isPost            : true,
        currentUser,
        byId        : `newPostComments${post.id}`,
        className   : 'btn-sm edit-comment-btn',
        isAuthenticated,
    };

    let createBookmarkProps = {
        objName           : `PostBookmark`,
        obj               : post,
        byId              : `bookmarkedPosts`,
        isPost            : true,
        currentUser,  
        isAuthenticated,
    };

    createBookmarkProps = GetModalLinkProps.props(createBookmarkProps)
    editObjProps = GetModalLinkProps.props(editObjProps)
    createObjProps = GetModalLinkProps.props(createObjProps)

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

    let comments:object[] = post.comments;
    let itemsName:string = comments.length > 1  && "Comments" ||
                        comments.length == 1 && "Comment" || '';

    let itemsProps:object = {
            itemsName,
            items: comments,
            itemsById : `commentsPost${post.id}`,
            getItemsList : props.getCommentList
        }

    

    const btnsList   = { 
            itemsCounter : <ToggleItemsBtn {...itemsProps}/>,
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
                        <div className="author-post-detail-box">
                            <AuthorAvatar {...authorProps}/>
                            <AuthorDetails {...authorProps}/>           
                        </div>
                        <ul className="">
                            { props.isPostBox? 
                                <li className="post-title">
                                    { post.add_title }
                                </li>
                                :

                                <li className="post-title">
                                      <LinkButton {...linkProps}>
                                        <span>{  post.add_title }</span>
                                    </LinkButton>
                                </li>
                            }
                        </ul>

                    </div>
                    <div className="post-body">
                        <Editor
                            blockRendererFn={pageMediaBlockRenderer}
                            editorState={editorState} 
                            readOnly={true} 
                        />
                    </div>
                    <ButtonsBox {...btnsList}/>
            </div>
                 
            :
            null
        }
        </div>
    );

};

