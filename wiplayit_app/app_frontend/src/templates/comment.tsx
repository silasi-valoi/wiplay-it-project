import React from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import {
         UpVoteCommentBtn,
         DownVoteCommentBtn,
         OpenEditorBtn,
         OpenOptionlBtn,
         ChangeImageBtn,
         OpenUsersModalBtn, } from 'templates/buttons';


import { GetModalLinkProps } from "templates/component-props";

import {ButtonsBox,AuthorAvatar,AuthorDetails} from "templates/partials";
import Api from 'utils/api';
import  * as types  from 'actions/types';
import Helper from 'utils/helpers';
import RepliesLevelZero from "containers/main/replies/replies-level-0";
import { Editor } from "draft-js";
import {pageMediaBlockRenderer} from 'templates/draft-editor';

const api      = new Api();
const helper   = new Helper();

export const CommentsComponent = props => {
    
    let optionsBtnStyles = {
              fontSize   : '11px',
              background : ' #F5F5F5',
              fontWeight : 'bold',
              width      : '40px',
              color      : '#4A4A4A',
              margin     : '0 0 2px'
    }

    let { 
        isAnswerBox,
        post,
        answer,
        comment, 
        newCommentsById, 
        commentsById, 
        currentUser, 
        isAuthenticated,
        isNewComments, } = props;

    if (!comment) {
        return null;
    }
       
    let editorState = helper.convertFromRaw(comment.comment)  

    let pathToUpvoters;

    let commentRepliesById = isAnswerBox && `answerReplies${comment.id}` 
                                         || `postReplies${comment.id}`;
    
    let state = {
            comment,
            usersIsFor : isAnswerBox? 'answerCommentUpVoters' : 'postCommentUpVoters', 
        }
    if (comment.answer) {
        pathToUpvoters =  `/answer/comment/${comment.id}/upvoters/`;
        
    }

    else{
        
       pathToUpvoters =  `/post/comment/${comment.id}/upvoters/`;
    }
    let usersById = isAnswerBox && `answerCommentUpVoters${comment.id}` 
                                || `postCommentUpVoters${comment.id}`;

    let apiUrl = isAnswerBox && api.getAnswerCommentUpVotersListApi(comment.id) 
                             || api.getPostCommentUpVotersListApi(comment.id);

    let linkName  = comment.upvotes > 1 && `${comment.upvotes} Upvoters`
                                        || `${comment.upvotes} Upvoter`;

    let byId = isNewComments && newCommentsById || commentsById;

    let commentUpvotersProps = {
            apiUrl,
            byId      : usersById,
            obj       : comment,
            currentUser,
            linkName,
            isAuthenticated,
        };
   
    let editObjProps = {
        byId,
        currentUser,
        isAuthenticated,
        objName     : 'Comment',
        isPut       : true,
        obj         : comment, 
        actionType : types.UPDATE_COMMENT,
        apiUrl : answer && api.updateAnswerCommentApi(comment.id) ||
                 post && api.updatePostCommentApi(comment.id),
    };
        

    let createObjProps = {
        currentUser,
        isAuthenticated,
        objName           : 'Reply',
        obj               : comment,
        isPost            : true,
        byId              : `newCommentsReplies${comment.id}`,
        className         : 'btn-sm edit-reply-btn',
        actionType        :  types.CREATE_COMMENT,
        editorPlaceHolder : `Add Comment...,`,
        apiUrl : answer && api.createAnswerCommentApi(answer.id) || 
                post && api.createPostCommentApi(post.id), 
    };
    
    let EditorModalBtn     = <OpenEditorBtn {...createObjProps}/>; 
    
    let CommentUpVotersBtn = comment.upvotes !== 0 && 
                             <OpenUsersModalBtn {...commentUpvotersProps}/>; 
    
    
    let btnsProps = {
        ...props,
        createObjProps,
        editObjProps,
        btnStyles:optionsBtnStyles,
        btnText : 'More', 
    }; 

         
    let upvoteBtn =  comment.upvoted? <DownVoteCommentBtn {...btnsProps}/>
               : <UpVoteCommentBtn {...btnsProps}/>

   
              
    const btnsList  = {
        itemsCounter :  CommentUpVotersBtn,
        btn1         :  upvoteBtn,
        btn2         :  EditorModalBtn,
        btn3         :  <OpenOptionlBtn {...btnsProps}/>,
    } 

    const authorProps:object  = {
            author : comment.author,
            data   : comment,
        };

    

    return(
        <div className="comment-container">
            
            <div className="comment-contents">
                <AuthorAvatar {...authorProps}/>
                <div className="comment-contents-box">
                    <div  className="comment-box" id="comment-box">
                        <AuthorDetails {...authorProps}/>
                      
                        <div className="comment-body">
                            <Editor
                                blockRendererFn={pageMediaBlockRenderer}
                                editorState={editorState} 
                                readOnly={true}
                            />
                        </div>
                    </div>
                    <ButtonsBox {...btnsList}/>
                </div>
            </div>
            
            <RepliesLevelZero {...props}/>
        </div>
    );
};


 