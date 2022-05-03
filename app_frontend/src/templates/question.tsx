import React from 'react';
import * as Icon from 'react-feather';

import { OpenOptionlBtn,
         FollowQuestionBtn,
         UnfollowQuestionBtn,
         OpenEditorBtn,
         LinkButton,
         OpenUsersModalBtn, } from 'templates/buttons';

import {ButtonsBox} from "templates/partials";

import  * as types  from 'actions/types';
import {Apis} from 'api';

export const QuestionComponent = props => {
    
    let { question,
          index,
          questionById,
          questionListById, 
          currentUser, 
          isAuthenticated}    = props;
    
    let getUserAnswer = ()=>{
            let questionEntitie  = props.entities.question;
            questionEntitie  = questionEntitie[questionById];
            return questionEntitie?.userAnswer;
    }

    let usersById =  question && `questionFollowers${question.id}`;
    let apiUrl    = question && Apis.getQuestionFollowersListApi(question.id);
    let linkName  = question.followers > 1 && 
                    `${question.followers} Followers` ||
                     `${question.followers} Follower`;
    

    let questionFollowersProps = {
            apiUrl,
            byId      : usersById,
            obj       : question,
            currentUser,
            linkName  : linkName,
           
        };


    let editObjProps = {
        index,
        objName     : 'Question',
        isPut       : true,
        obj         : question, 
        byId        : questionById || questionListById,
        currentUser,
        isAuthenticated,
        actionType : types.UPDATE_QUESTION,
        apiUrl : Apis.updateQuestionApi(question.id)
    };

    let answersById = ()=>{
        if (question.user_has_answer) {
            return `answers${question.id}`
        }
        return `newAnswers${question.id}`
    }

    let createObjProps = {
        objName           : 'Answer',
        obj               : question.user_has_answer && getUserAnswer() || question,
        byId              : answersById(),
        isPost            : !question.user_has_answer,
        isPut             : question.user_has_answer, 
        className         : 'btn-sm edit-answer-btn', 
        currentUser,  
        isAuthenticated,
        actionType : types.CREATE_ANSWER,
        editorPlaceHolder : `Add Answer...`,
        apiUrl : Apis.createAnswerApi(question.id),          
       
    };

    let EditorModalBtn = <OpenEditorBtn {...createObjProps}>
                            <Icon.Edit className="" size={20}/> 
                         </OpenEditorBtn> 

    let questionFollowersBtn = question.followers !== 0 && 
               <OpenUsersModalBtn {...questionFollowersProps}/> || null;
    
    let btnsProps = {
            ...props,
            editObjProps,
            createObjProps,
        }

    let unfollowOrFollowQuestionBtn =  question.user_is_following? 
                                        <UnfollowQuestionBtn {...btnsProps}/>
                                          :
                                        <FollowQuestionBtn {...btnsProps}/>;


    const btnsList  = {
            authorCounter : questionFollowersBtn,
            btn1         : EditorModalBtn,
            btn2         : unfollowOrFollowQuestionBtn,
            btn3         : <OpenOptionlBtn {...btnsProps}/>,
        }
    
    const linkProps = {
        linkPath: `/question/${question.slug}/`,
        state:{id:question['id']},
    }
  
    return(
        <div className="question-box ">
            <div className="question">
                {props.isQuestionBox?
                    <b className="">
                        {question.question || question.add_question }
                    </b>
                    :
                    <b className="">
                        <LinkButton {...linkProps}>
                            <span>{ question.question  || question.add_question }</span>
                        </LinkButton>
                    </b>
                }
                <ButtonsBox {...btnsList}/>
            </div>
        </div>
    );
};
