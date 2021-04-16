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

import {ButtonsBox, Styles} from "templates/partials";
import Api from 'utils/api';
import  * as types  from 'actions/types';
import Helper from 'utils/helpers';
import RepliesBox from "containers/main/replies/reply-page";
import { UserComponentSmall } from "templates/profile";
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
       
    let editorState = helper.convertFromRaw(comment.comment)  

    let pathToUpvoters;

    let commentRepliesById = isAnswerBox && `answerReplies${comment.id}` || `postReplies${comment.id}`;
    
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
    let usersById =  comment && isAnswerBox && `answerCommentUpVoters${comment.id}` ||
                    comment &&  `postCommentUpVoters${comment.id}`;

    let apiUrl    = comment && isAnswerBox && api.getAnswerCommentUpVotersListApi(comment.id) ||
                    comment && api.getPostCommentUpVotersListApi(comment.id);
    let linkName  = comment.upvotes > 1 && `${comment.upvotes} Upvoters` || `${comment.upvotes} Upvoter`;

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
        objName     : 'Comment',
        isPut       : true,
        obj         : comment, 
        byId,
        currentUser,
        isAuthenticated,
    };



    let createObjProps = {
        objName           : 'Reply',
        obj               : comment,
        isPost            : true,
        currentUser,
        isAuthenticated,
        byId              : `newCommentsReplies${comment.id}`,
        className         : 'btn-sm edit-reply-btn',
    };

    editObjProps = GetModalLinkProps.props(editObjProps);
    createObjProps = GetModalLinkProps.props(createObjProps);
    
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

         
    let upvoteBtn =  props.comment.upvoted? <DownVoteCommentBtn {...btnsProps}/>
               : <UpVoteCommentBtn {...btnsProps}/>

   
              
    const btnsList  = {
        itemsCounter :  CommentUpVotersBtn,
        btn1         :  upvoteBtn,
        btn2         :  EditorModalBtn,
        btn3         :  <OpenOptionlBtn {...btnsProps}/>,
        Styles       : Styles,
      } 

      const userProps  = {
                obj    : comment,
                time   : 'Commented',
                currentUser ,

            };

    

    return(
      
        <div  className="comment-box" id="comment-box">
            <div className="autor-details-box comment-detail-box">
                <UserComponentSmall {...userProps}/>
            </div>
    
            <div className="comment">
                <Editor
                   blockRendererFn={pageMediaBlockRenderer}
                   editorState={editorState} 
                   readOnly={true}

                />
            </div>

            <ButtonsBox {...btnsList}/>
            
            <RepliesBox {...props}/>
            
        </div>
                               
    );
};


 