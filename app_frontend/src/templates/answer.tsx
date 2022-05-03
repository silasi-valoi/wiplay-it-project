'use strict'

import React from 'react';
import { Editor } from "draft-js";

import { 
        UpVoteAnswerBtn,
        DownVoteAnswerBtn,
        OpenEditorBtn,
        OpenOptionlBtn,
        LinkButton,
        OpenUsersModalBtn } from 'templates/buttons';

import  * as types  from 'actions/types';
import {pageMediaBlockRenderer} from 'templates/draft-editor';
import { convertFromRaw } from 'utils';
import {ButtonsBox, AuthorAvatar, AuthorDetails} from "templates/partials";
import {Apis} from 'api';


export const AnswersComponent = props => {
    //console.log(props)

    var {
        index,
        answer, 
        answerListById,
        isQuestionBox,
        isAuthenticated,
        currentUser } = props;

    if(!answer) return null;
   
   

    let editorState;

    let answerText:string = answer.answer ||  answer.add_answer

    if (answerText) {
        editorState  = convertFromRaw(answerText);
    }

    let usersById =  `answerUpVoters${answer.id}`;
    let apiUrl    =  Apis.getAnswerUpVotersListApi(answer.id);
    let linkName  =  answer.upvotes > 1
                     && `${answer.upvotes} Upvoters` 
                     || `${answer.upvotes} Upvoter`;
   
  
    let answerUpvotersProps:object = {
            apiUrl,
            byId      : usersById,
            obj       : answer,
            currentUser,
            linkName,
            isAuthenticated,
        };

    let editObjProps:object = {
        index,
        currentUser,
        isAuthenticated,
        objName     : 'Answer',
        isPut       : true,
        obj         : answer, 
        byId        : answerListById,
        actionType : types.UPDATE_ANSWER,
        editorPlaceHolder : `Edit Answer...`,
        apiUrl:Apis.updateAnswerApi(answer.id)
    };

    let newCommentsById:string = `newAnswerComments${answer.id}`;

    let createObjProps:object = {
        ...editObjProps,
        objName           : 'Comment',
        isPost            : true,
        isPut             : false,
        byId              : newCommentsById,
        className         : 'btn-sm edit-comment-btn',
        actionType : types.CREATE_COMMENT,
        editorPlaceHolder : `Add Comment...`,
        apiUrl:Apis.createAnswerCommentApi(answer.id)
    };
  
    let createBookmarkProps:object = {
        ...editObjProps,
        bookmarkType      : 'answers',
        byId              : `bookmarkedAnswers`,
        isPost            : true,
        isPut             : false,
        actionType : types.CREATE_BOOKMARK,
        apiUrl : Apis.addAnswerBookMarkApi(answer.id)
    };

    let deleteObjProps = {
        ...editObjProps,
        apiUrl : Apis.deleteAnswerApi(answer.id)
    };


    let EditorModalBtn = <OpenEditorBtn {...createObjProps}/>; 
    
    let AnswerUpVotersBtn = answer.upvotes !== 0 &&
                            <OpenUsersModalBtn {...answerUpvotersProps}/>; 

    let btnsProps = {
        ...props,
        editObjProps,
        deleteObjProps, 
        createBookmarkProps,
    }; 

    let UpVoteBtn = answer.upvoted? <DownVoteAnswerBtn {...btnsProps}/>
               : <UpVoteAnswerBtn {...btnsProps}/>
          
    let comments:object[] = answer?.comments;
    let itemsName:string = comments?.length > 1  && "Comments" ||
                        comments?.length == 1 && "Comment" || '';


    const btnsList   = { 
            authorCounter : AnswerUpVotersBtn,
            btn1   : UpVoteBtn,
            btn2   : EditorModalBtn,
            btn3   : <OpenOptionlBtn {...btnsProps}/>,
        };

    const authorProps:object  = {
            author : answer.author,
            data   : answer,
        };

    let question:object = answer.question;

    if (typeof question !== 'object') {
        question = props.question;
    }
    
    const linkProps:object = {
        linkPath:`/question/${question['slug']}/`,
        state:{id : question['id']},
    }

                                           
    return (
        <div className="answer-box">     
            <div className="autor-answer-details-box">
                <AuthorAvatar {...authorProps}/>
                <AuthorDetails {...authorProps}/>
            </div>

            {!isQuestionBox  &&
                <ul className="answer-question-box">
                    <li className="question">
                        <LinkButton {...linkProps}>
                            <span>{ question['question'] || question['question'] }</span>
                        </LinkButton>
                    </li>
                </ul>
            }

            <div className="answer">
                {editorState &&
                    <Editor
                        onChange={()=> void {}}
                        blockRendererFn={pageMediaBlockRenderer}
                        editorState={editorState}
                        readOnly={true}
                    />
                }
            </div>
            <div className="">
               <ButtonsBox {...btnsList}/>   
            </div>
        </div>
    );       
};

