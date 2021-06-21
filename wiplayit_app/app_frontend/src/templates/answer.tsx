import React from 'react';
import { Link, BrowserRouter  } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';

import { GetModalLinkProps } from "templates/component-props";
import { 
        UpVoteAnswerBtn,
        DownVoteAnswerBtn,
        OpenEditorBtn,
        OpenOptionlBtn,
        LinkButton,
        OpenUsersModalBtn} from 'templates/buttons';

import { Editor } from "draft-js";
import  * as types  from 'actions/types';
import {pageMediaBlockRenderer} from 'templates/draft-editor';
import Helper from 'utils/helpers';
import {ButtonsBox, AuthorAvatar, AuthorDetails} from "templates/partials";
import Api from 'utils/api';


const api      = new Api();
const helper   = new Helper(); 


export const AnswersComponent = props => {
    //console.log(props)

    var {
        answer, 
        answerListById,
        newAnswerListById,
        isNewAnswers,
        isQuestionBox,
        isProfileBox, 
        isAuthenticated,
        currentUser } = props;

    if(!answer) return null;
   
   
    let optionsBtnStyles = {
         fontSize   : '8px',
         background : 'white',
         fontFamily : 'Mukta',
         fontWeight : 'bold',
         color      : '#4A4A4A',
         margin     : '0 0 2px'
    };
  
   const editorState  = helper.convertFromRaw(answer.add_answer);

    let usersById =  `answerUpVoters${answer.id}`;
    let apiUrl    =  api.getAnswerUpVotersListApi(answer.id);
    let linkName  =  answer.upvotes > 1
                     && `${answer.upvotes} Upvoters` 
                     || `${answer.upvotes} Upvoter`;
   
    let state = {
          answer,
          usersIsFor : 'answerUpVoters', 
        }
  
    let answerUpvotersProps = {
            apiUrl,
            byId      : usersById,
            obj       : answer,
            currentUser,
            linkName,
            isAuthenticated,
        };

    let editObjProps = {
        objName     : 'Answer',
        linkName    : 'Edit Answer',
        isPut       : true,
        obj         : answer, 
        byId        : answerListById,
        currentUser,
        isAuthenticated,
    };



    let createObjProps = {
        objName           : 'Comment',
        obj               : answer,
        isPost            : true,
        byId              : `newAnswerComments${answer.id}`,
        className         : 'btn-sm edit-comment-btn',
        currentUser,
        isAuthenticated,
    };
  
    let createBookmarkProps = {
        objName           : `AnswerBookmark`,
        bookmarkType      : 'answers',
        obj               : answer,
        byId              : `bookmarkedAnswers`,
        isPost            : true,
        currentUser,  
        isAuthenticated
    };

    createBookmarkProps = GetModalLinkProps.props(createBookmarkProps)
    editObjProps = GetModalLinkProps.props(editObjProps);
    createObjProps = GetModalLinkProps.props(createObjProps);

    let EditorModalBtn     = <OpenEditorBtn {...createObjProps}/>; 
    
    let AnswerUpVotersBtn = answer.upvotes !== 0 &&
                            <OpenUsersModalBtn {...answerUpvotersProps}/> 
   
    

    let btnsProps = {
            ...props,
            editObjProps,
            createObjProps, 
            createBookmarkProps,
    }; 
   
    
    let UpVoteBtn = answer.upvoted? <DownVoteAnswerBtn {...btnsProps}/>
               : <UpVoteAnswerBtn {...btnsProps}/>
          
   
    const btnsList   = { 
            itemsCounter : AnswerUpVotersBtn,
            btn1   : UpVoteBtn,
            btn2   : EditorModalBtn,
            btn3   : <OpenOptionlBtn {...btnsProps}/>,
        };

    const authorProps:object  = {
            author : answer.author,
            data   : answer,
        };

    let question = answer.question;
    
    const linkProps:object = {
        linkPath:`/question/${question.slug}/${question.id}/`,
        state:{question},
    }
                                        
    return (
        <div className="answer-box">     
            <div className="autor-answer-detail-box">
                <AuthorAvatar {...authorProps}/>
                <AuthorDetails {...authorProps}/>
            </div>

            { !isQuestionBox  &&
                <ul className="answer-question-box">
                <li className="question">
                    <LinkButton {...linkProps}>
                        <span>{ question.add_question }</span>
                    </LinkButton>
                </li>
                </ul>
            }

            <div className="answer">
                <Editor
                    blockRendererFn={pageMediaBlockRenderer}
                    editorState={editorState}
                    readOnly={true}
                />
            </div>
            <div className="">
               <ButtonsBox {...btnsList}/>   
            </div>
        </div>
    );       
};

