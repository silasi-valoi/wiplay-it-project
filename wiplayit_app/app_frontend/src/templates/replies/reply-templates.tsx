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
    
    let {currentUser,
         isAnswerBox,
         isAuthenticated,
         isPostBox } = props;

   let {byId, newRepliesById, reply,} = replyProps && replyProps  

    if (!reply || !reply.reply) {
        return null;
    }
    
    const editorState  = helper.convertFromRaw(reply.reply);
  
    

    var createApiUrl = '';
    var updateUrl    = ''; 

    if(isAnswerBox) {
        updateUrl    = api.updateAnswerReplyApi(reply.id);
        createApiUrl = api.createAnswerReplyChildApi(reply.id);
      
    }else if(isPostBox) {
        updateUrl    = api.updatePostReplyApi(reply.id);
        createApiUrl = api.createPostReplyChildApi(reply.id);
    }

    let usersById = reply && isAnswerBox && `answerReplyUpVoters${reply.id}` ||
                    reply &&  `postReplyUpVoters${reply.id}`;

    let apiUrl    = reply && isAnswerBox && api.getAnswerReplyUpVotersListApi(reply.id) ||
                    reply && api.getPostReplyUpVotersListApi(reply.id);

    let linkName = reply.upvotes > 1 && `${reply.upvotes} Upvoters`
                                     || `${reply.upvotes} Upvoter`;
    
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
        actionType : types.UPDATE_REPLY,
        editorPlaceHolder : `Edit Reply...`,
    };
    
    let createObjProps = {
        currentUser,
        isAuthenticated,
        objName           : 'Reply',
        obj               : reply,
        isPost            : true,
        byId              : newRepliesById,
        apiUrl            : createApiUrl,
        actionType        : types.CREATE_REPLY,
        editorPlaceHolder : `Add Reply...`,
        className         : 'btn-sm edit-reply-btn',
    };
   
   
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
    let linkData:object = props['linkData'];
    let reply:object = linkData['reply'];
    let replyAuthor:object = reply && reply['author'];
    let authorProfile:object = replyAuthor && replyAuthor['profile']; 
    const editorState  = helper.convertFromRaw(reply['reply']);
    let replyCount;
    if(linkData['totalReplies'] > 1){
        replyCount = `${linkData['totalReplies']}-Replies`;
    }else {
        replyCount = `${linkData['totalReplies']}-Reply`;
    }
   
    return (
        <div className="replies-link">
            <ul className="replies-loader">
                <li className="reply-author">
                    {replyAuthor['first_name']} 
                    {replyAuthor['last_name']} {' '} <span>{'- Replied'}</span>
                </li>
               
                <li className="replies-count">
                    {replyCount}
                </li>
            </ul>
        </div>
    )
};


export const RepliesToggle = (props:object, replies:object) => {
    let replyList:object[] = replies['replyList'];
    let parent:object = props['parent'];
    let linkData:object  =  replies['linkData'];
         
    const replyProps = {
        actionType : types.GET_REPLY_LIST,
        apiUrl : getRepliesApi(props),
        byId : props['repliesById'],
        replies : replies['replyList'],
    };

    const getReplyList:Function = props['getReplyList'];

    return(
        <div className="replies-toggle-box"
              onClick={() => getReplyList(replyProps)}> 
            <RepliesLink {...replies}/>
        </div> 
    );
};


const getRepliesApi = (params:object):string => {
    let apiUrl:string;
    const parent:object = params['parent'];

    if (params['isAnswerBox']) { 
        if (parent['has_children']) {
            apiUrl = api.getAnswerReplyChildrenListApi(parent['id'])
            
        }else {
            apiUrl = api.getAnswerReplyListApi(parent['id']);
        }

    }else {
        if(parent['has_children']){
            apiUrl = api.getPostReplyChildrenListApi(parent['id']);

        }else {
            apiUrl = api.getPostReplyListApi(parent['id']);
        }
    }
    return apiUrl;

}



export const ChildrenRepliesLink = (props:object, replies:object) => {
           
    let linkData:object = replies['linkData'];
    let reply:object   = linkData['reply'];
    let parent = props['parent'];
    
    var apiUrl = '';
    if (props['isAnswerBox']) { 
      apiUrl = api.getAnswerReplyChildrenListApi(parent['id']);
    }else{
      apiUrl = api.getPostReplyChildrenListApi(parent['id']);
    } 

    var replyProps:object = {
        apiUrl,
        byId : props['repliesById'],
        children : parent['children'],
        actionType : types.GET_REPLY_CHILD_LIST,
    };

    const getReplyList:Function = props['getReplyChildrenList'];
    
    return(
        <div className="reply-link-box"
             onClick={() => getReplyList(replyProps)}> 
            <RepliesLink {...replies}/>
        </div> 
    );
};

