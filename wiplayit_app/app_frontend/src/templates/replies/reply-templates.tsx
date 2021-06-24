import React from 'react';
import { BrowserRouter,Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { Editor } from "draft-js";
import {pageMediaBlockRenderer} from 'templates/draft-editor';

import { UpVoteReplyBtn,
         DownVoteReplytBtn,
         OpenEditorBtn,
         OpenOptionlBtn,
         ChangeImageBtn,
         OpenUsersModalBtn,} from 'templates/buttons';

import {ButtonsBox, AuthorAvatar,AuthorDetails} from "templates/partials";
import Api from 'utils/api';
import  * as types  from 'actions/types';
import Helper from 'utils/helpers';
import { GetModalLinkProps } from "templates/component-props";

const api      = new Api();
const helper   = new Helper();


export const Reply = (props, replyProps, isNewReply:boolean) => {
  
    let optionsBtnStyles = {
              fontSize   : '11px',
              background : ' #F5F5F5',
              fontWeight : 'bold',
              width      : '40px',
              color      : '#4A4A4A',
              margin     : '0 0 2px'
    }
    
    let { answer,
         post,
         currentUser,
         isAnswerBox,
         isAuthenticated,
         isPostBox } = props;

   let {
        byId,
        newRepliesById, 
        reply,
        replyStyles } = replyProps && replyProps  

    if (!reply || !reply.reply) {
        return null;
    }
    
    const editorState  = helper.convertFromRaw(reply.reply);
  
    let state = {
            reply,
            usersIsFor : answer? 'answerReplyUpVoters' : 'postReplyUpVoters', 
        }

   let pathToUpvoters;

   var createApiUrl = '';
   var updateUrl    = ''; 

    if (answer) {

        pathToUpvoters =  `/answer/reply/${reply.id}/upvoters/`;
        updateUrl    = api.updateAnswerReplyApi(reply.id);
        createApiUrl = api.createAnswerReplyChildApi(reply.id);
      
    }
    else{
      pathToUpvoters =  `/post/reply/${reply.id}/upvoters/`;
      updateUrl    = api.updatePostReplyApi(reply.id);
      createApiUrl = api.createPostReplyChildApi(reply.id);
      
    }

    let usersById = reply && isAnswerBox && `answerReplyUpVoters${reply.id}` ||
                    reply &&  `postReplyUpVoters${reply.id}`;

    let apiUrl    = reply && isAnswerBox && api.getAnswerReplyUpVotersListApi(reply.id) ||
                    reply && api.getPostReplyUpVotersListApi(reply.id);

    let linkName = reply.upvotes > 1 && `${reply.upvotes} Upvoters`
                                     || `${reply.upvotes} Upvoter`;

    byId = isNewReply && newRepliesById || byId;


    let replyUpvotersProps = {
            apiUrl,
            byId      : usersById,
            obj       : reply,
            currentUser,
            isAuthenticated,
            linkName,
        };
   
     
    let editObjProps = {
        objName     : 'Reply',
        isPut       : true,
        obj         : reply, 
        byId,
        apiUrl      : updateUrl,
        currentUser,
        isAuthenticated,
    };



    let createObjProps = {
        objName           : 'Reply',
        obj               : reply,
        isPost            : true,
        byId              :  `newReplies${reply.id}`,
        currentUser,
        isAuthenticated,
        apiUrl            : createApiUrl,
        className         : 'btn-sm edit-reply-btn',
    };

    editObjProps = GetModalLinkProps.props(editObjProps);
    createObjProps = GetModalLinkProps.props(createObjProps);
   
    let EditorModalBtn   = <OpenEditorBtn {...createObjProps}/>; 
    
    
    let ReplyUpVotersBtn = reply.upvotes !== 0 &&
                           <OpenUsersModalBtn {...replyUpvotersProps}/> 

    

    let btnsProps = {
        ...props,
        editObjProps,
        createObjProps,
        btnStyles:optionsBtnStyles,
        btnText : 'More', 
    }; 

    
    let upvoteBtn =  reply.upvoted && <DownVoteReplytBtn {...btnsProps}/> ||
                                     <UpVoteReplyBtn {...btnsProps}/>

    const btnsList  = {
        authorCounter :  ReplyUpVotersBtn,
        btn1         :  upvoteBtn,
        btn2         :  EditorModalBtn,
        btn3         :  <OpenOptionlBtn {...btnsProps}/>,
    } 

    const userProps  = {
            obj   : reply,
            currentUser,
    };

    const authorProps:object  = {
            author : reply.author,
            data   : reply,
        };

    return (
        <div className="reply-contents">
            <AuthorAvatar {...authorProps}/>
            <div className="replies-container">
                <div className="reply-box" id="reply-box">
                    <div className="autor-details-box">
                        <AuthorDetails {...authorProps}/>
                    </div>         
                    <div className="reply-body">
                        <Editor
                            blockRendererFn={pageMediaBlockRenderer}
                            editorState={editorState} 
                            readOnly={true} />
                    </div>
                </div>
                <ButtonsBox {...btnsList}/>
            </div>
        </div>
    );
};


export const RepliesLink = (props:object) => {
   
    
   
   return (
        <div className="comments-link">
        <ul className="comments-loader">
            <li>
                Click to view {props['totalReplies'] - 1} more
            </li>
        </ul>
         
      </div>
   )
}


export const CommentRepliesLink = props => {
   const byId = props.repliesById;
   var replies   =  props.entities.replies;
   let linkData  =  replies[byId].linkData;
   let reply     =  linkData.reply;
  
    let apiUrl:string = '';
    if (props.isAnswerBox) { 
        apiUrl = api.getAnswerReplyListApi(reply.comment);
    }else{
        apiUrl = api.getPostReplyListApi(reply.comment);
    }

    const replyProps = {
        actionType: types.GET_REPLY_LIST,
        apiUrl    : apiUrl,
        byId,
    };

    return(
        <div  className="reply-link-box"
                  onClick={() => props.getReplyList(replyProps)}> 
            <RepliesLink {...linkData}/>
        </div> 
    );
};



export const ChildrenRepliesLink = (props:object, replies:object) => {
           
    let linkData:object = replies['linkData'];
    let reply:object   = linkData['reply'];
    
    var apiUrl = '';
    if (props['isAnswerBox']) { 
      apiUrl = api.getAnswerReplyChildrenListApi(reply['id']);
    }else{
      apiUrl = api.getPostReplyChildrenListApi(reply['id']);
    } 

    var replyProps:object = {
        apiUrl,
        byId : props['repliesById'],
        children : reply['children'],
        actionType : types.GET_REPLY_CHILD_LIST,
    };

    const getReplyList:Function = props['getReplyChildrenList'];
    
    return(
        <div onClick={ () => getReplyList(replyProps) }> 
            <RepliesLink {...linkData}/>
        </div> 
    );
};

