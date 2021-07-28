import React from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { Editor } from "draft-js";

import {
         UpVoteCommentBtn,
         DownVoteCommentBtn,
         OpenEditorBtn,
         OpenOptionlBtn,
         ChangeImageBtn,
         OpenUsersModalBtn, } from 'templates/buttons';

import {ButtonsBox, AuthorAvatar, AuthorDetails} from "templates/partials";
import Apis from 'utils/api';
import  * as types  from 'actions/types';
import Helper from 'utils/helpers';
import RepliesConatiner from "containers/main/replies";
import {pageMediaBlockRenderer} from 'templates/draft-editor';


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
        index,
        isAnswerBox,
        post,
        answer,
        comment, 
        newCommentsById, 
        commentsById, 
        currentUser, 
        isAuthenticated,
        isNewComments, } = props;

    if (!comment || !comment.comment) {
        return null;
    }


    let editorState;
    if (comment.comment) {
        editorState = helper.convertFromRaw(comment.comment)  
    
    }
   

    let commentRepliesById = isAnswerBox && `answerReplies${comment.id}` 
                                         || `postReplies${comment.id}`;
        
    let usersById = isAnswerBox && `answerCommentUpVoters${comment.id}` 
                                || `postCommentUpVoters${comment.id}`;

    let apiUrl = isAnswerBox && Apis.getAnswerCommentUpVotersListApi(comment.id) 
                             || Apis.getPostCommentUpVotersListApi(comment.id);

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
        index,
        byId,
        currentUser,
        isAuthenticated,
        objName     : 'Comment',
        isPut       : true,
        obj         : comment, 
        actionType : types.UPDATE_COMMENT,
        editorPlaceHolder : `Edit Comment...`,
        apiUrl : answer && Apis.updateAnswerCommentApi(comment.id) ||
                 post && Apis.updatePostCommentApi(comment.id),
    };
        
    const newRepliesById = answer && `newAnswerCommentReplies$-${comment.id}`
                            || post && `newPostCommentReplies$-${comment.id}`;
    let createObjProps = {
        currentUser,
        isAuthenticated,
        objName           : 'Reply',
        obj               : comment,
        isPost            : true,
        byId              : newRepliesById,
        className         : 'btn-sm edit-reply-btn',
        actionType        :  types.CREATE_REPLY,
        editorPlaceHolder : `Add Reply...`,
        apiUrl : answer && Apis.createAnswerReplyApi(comment.id) || 
                post && Apis.createPostReplyApi(comment.id), 
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
        authorCounter :  CommentUpVotersBtn,
        btn1         :  upvoteBtn,
        btn2         :  EditorModalBtn,
        btn3         :  <OpenOptionlBtn {...btnsProps}/>,
    } 

    const authorProps:object  = {
            author : comment.author,
            data   : comment,
        };

    const replyProps = {
        ...props,
        parent : comment,
        parentId : comment.id,
        newRepliesById,
    };

    return(
        <div className="comment-container">
            
            <div className="comment-contents">
                <AuthorAvatar {...authorProps}/>
                <div className="comment-contents-box">
                    <div  className="comment-box" id="comment-box">
                        <AuthorDetails {...authorProps}/>
                      
                        <div className="comment-body">
                            { editorState &&
                                <Editor
                                    blockRendererFn={pageMediaBlockRenderer}
                                    editorState={editorState} 
                                    readOnly={true}
                                />
                            }
                        </div>
                    </div>
                    <ButtonsBox {...btnsList}/>
                    
                    <RepliesConatiner {...replyProps}/>
                </div>

            </div>
                        
        </div>
    );
};


 