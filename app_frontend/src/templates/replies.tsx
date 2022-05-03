import React from 'react';
import { Editor } from "draft-js";
import {pageMediaBlockRenderer} from 'templates/draft-editor';

import { UpVoteReplyBtn,
         DownVoteReplytBtn,
         OpenEditorBtn,
         OpenOptionlBtn,
         OpenUsersModalBtn,} from 'templates/buttons';

import {ButtonsBox, AuthorAvatar,AuthorDetails} from "templates/partials";
import {Apis} from 'api';
import {convertFromRaw} from 'utils';
import  * as types  from 'actions/types';


export const Reply = (props, replyProps, isNewReply:boolean) => {
   
    
    let {currentUser,
         isAnswerBox,
         isAuthenticated,
         isPostBox } = props;

   let {byId, index, newRepliesById, reply} = replyProps && replyProps  

    if (!reply || !reply.reply) {
        return null;
    }
    
    const editorState  = convertFromRaw(reply.reply);
    
    let createApiUrl:string = '';
    let updateUrl:string  = ''; 

    if(isAnswerBox) {
        updateUrl    = Apis.updateAnswerReplyApi(reply.id);
        createApiUrl = Apis.createAnswerReplyChildApi(reply.id);
      
    }else if(isPostBox) {
        updateUrl    = Apis.updatePostReplyApi(reply.id);
        createApiUrl = Apis.createPostReplyChildApi(reply.id);
    }

    let usersById = reply && isAnswerBox && `answerReplyUpVoters${reply.id}` ||
                    reply &&  `postReplyUpVoters${reply.id}`;

    let apiUrl    = reply && isAnswerBox && Apis.getAnswerReplyUpVotersListApi(reply.id) ||
                    reply && Apis.getPostReplyUpVotersListApi(reply.id);

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
        index,
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
        index,
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

    let replyLevelOneProps:object = {
        ...props,
        parent : reply,
        parentId : reply['id'],
        newRepliesById,
        isRecusive:true,
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
                    {editorState &&
                        <Editor
                            onChange={()=> {}}
                            blockRendererFn={pageMediaBlockRenderer}
                            editorState={editorState} 
                            readOnly={true} />
                    }
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
        
    let count:number = linkData['repliesCount'];
    let repliesCount:string;

    if(linkData['totalReplies'] > 1){
        repliesCount = `${count} Replies`;

    }else {
        repliesCount = `${count} Reply`;
    }
   
    return (
        <div className="replies-link">
            <ul className="replies-loader">
                {replyAuthor &&
                    <li className="reply-author">
                        {replyAuthor['first_name']} 
                        {replyAuthor['last_name']} {' '} <span>{'- Replied'}</span>
                    </li>
                }
               
                <li className="replies-count">
                    {repliesCount}
                </li>
            </ul>
        </div>
    )
};


export const RepliesToggle = (props:object, replies:object) => {
    let replyList:object[] = replies['replyList'];
    let parent:object = props['parent'];
            
    const replyProps = {
        actionType : types.GET_REPLY_LIST,
        apiUrl : getRepliesApi(props),
        byId : props['repliesById'],
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
            apiUrl = Apis.getAnswerReplyChildrenListApi(parent['id'])
            
        }else {
            apiUrl = Apis.getAnswerReplyListApi(parent['id']);
        }

    }else {
        if(parent['has_children']){
            apiUrl = Apis.getPostReplyChildrenListApi(parent['id']);

        }else {
            apiUrl = Apis.getPostReplyListApi(parent['id']);
        }
    }
    return apiUrl;

}


