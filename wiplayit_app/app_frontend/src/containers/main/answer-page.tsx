import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { AnswersComponent } from 'templates/answer';
import CommentsBox from "containers/main/comment-page";
import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";
import  MainAppHoc from "containers/main/index-hoc";
import { LinkButton } from "templates/buttons"; 

import {store} from "store/index";
import  * as action  from 'actions/actionCreators';


class AnswerContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pageName    : "Answer",
            isAnswerBox : true,
            question    : undefined,
            answer      : undefined,      
        };
    };


    componentDidMount() {
        console.log(this.props)

        let { slug, id }  = this.props['match'].params;
        let {state}       = this.props['location']; 
        let {answers}     = this.props['entities'];
        let {question, answer} = state;
       
        let answerListById   = question && `newAnswers${question.id}`;

        this.setState({answerListById, question});

        answers = answers[answerListById]
       
        if (!answers) {
            console.log('dispatch answers')
            store.dispatch<any>(action.getAnswerListPending(answerListById));
            store.dispatch<any>(action.getAnswerListSuccess(answerListById, [answer]));
        }
        
    }

    render() { 
        let props = {...this.props, ...this.state}
        console.log(props)
        
        let {answers}    = props['entities'];
        let question:object = props['question'];
        let answerListById:string = props['entities'];
        answers          = answers   && answers[answerListById];
        let linkPath = question && `/question/${question['slug']}/${question['id']}/`;
        
        let linkProps:object = {
                linkPath,
                state: {question},  
        } 
              
        return(
            <div className="app-box-container app-question-box">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                
                <div className="answer-page" id="answer-page">
                    <div className="answer-container">    
                        <div className="answer-contents"> 
                            <div className="answer-question-box">
                                <p className="question">
                                    <LinkButton {...linkProps}>
                                        <span>
                                            {question  && question['add_question'] }
                                        </span> 
                                    </LinkButton>
                                </p>
                            </div>
                            
                            <AvailableAnswers {...props}/>

                        </div>
                    </div>
                </div> 
            </div>
        )
    };
} 



export default MainAppHoc(AnswerContainer);

export class AnswersBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAnswerBox       : true,
            question          : '',
            answerListById    : '', 
            newAnswerListById : '',
        };
    };
   
   
    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        console.log(error, info);
    }


    componentDidMount() {
        
        let questionById:string = this.props['questionById'];
        let question:object = this.props['question'];
        
        let {answers} = this.props['entities'];
      
        let answerListById      = question && `answers${question['id']}`;
        let newAnswerListById   = question && `newAnswers${question['id']}`;

        this.setState({answerListById, newAnswerListById, question });

        answers = answers[answerListById]

        if (!answers) {
            if (question && question['answers']) {
                //console.log(question);
                store.dispatch<any>(
                    action.getAnswerListPending(answerListById)
                );
                
                store.dispatch<any>(
                    action.getAnswerListSuccess(answerListById, question['answers'])
                );
            }
        }
    };

       
    getProps() {
        return {...this.props, ...this.state};
    };

    getNumberOfAnswers(currentAnswers, newAnswers){
                    
        newAnswers            = newAnswers     && newAnswers.answerList;
        currentAnswers        = currentAnswers && currentAnswers.answerList;
        let newAnswersNum     = newAnswers     && newAnswers.length;
        let currentAnswersNum = currentAnswers && currentAnswers.length;

        let numberOfAnswers;
       
        if (newAnswersNum) {
            currentAnswersNum = currentAnswersNum  + newAnswersNum;
        }

        return currentAnswersNum;
    }    


    render() { 
        const props =  this.getProps();
       
        let newAnswerListById = props['newAnswerListById'];
        let answerListById = props['answerListById'];
        let isQuestionBox = props['newAnswerListById,'];

        let {answers}        = props['entities'];
        let currentAnswers   = answers        && answers[answerListById];
        let newAnswers       = answers        && answers[newAnswerListById];
        let numberOfAnswers  = this.getNumberOfAnswers(currentAnswers, newAnswers);
                 
        return (
            <div className="answer-list-container">
                <div>
                    {numberOfAnswers !== 0 && isQuestionBox &&
                        <ul className="number-answers-box">
                            { numberOfAnswers > 1 && 
                                <li className="number-of-answers">
                                    {numberOfAnswers}  Answers
                                </li>

                                ||

                                <li className="number-of-answers">
                                    {numberOfAnswers}  Answer
                                </li>
                            }
                        </ul>
                    }
                    <div>
                        <NewAddedAnswers {...props}/>
                        <AvailableAnswers {...props}/>
                    </div>
                </div>

                <div>
                    {!numberOfAnswers && isQuestionBox &&
                        <ul className="number-answers-box">
                            <li className="number-of-answers">No answer yet</li>
                        </ul>
                    }
                </div>
               
            </div>
        );        
    };
};


const NewAddedAnswers = props => {
   let {entities, newAnswerListById} = props;
   let answers = entities && entities.answers[newAnswerListById]; 
   answers     = answers && answers.answerList;
   let isNewAnswers = true;

   let answerList = answers && answers.length && answers;  
   return answerList && Answers(props, answerList, isNewAnswers) || null;
};

const AvailableAnswers = props => {
   let {entities, answerListById} = props;
   let answers = entities && entities.answers[answerListById];
   answers     = answers && answers.answerList; 
   
   let answerList = answers && answers.length && answers;  
   return answerList && Answers(props, answerList) || null;
};


export const Answers = (props, answerList, isNewAnswers=false) => {
             
    return(
        <div className="answer-container">
            {answerList?.map((answer, index) => {
                let answerProps = {answer, isNewAnswers };
                answerProps = {...props, ...answerProps}; 
      
                return ( 
                    <div key={index} className="answer-contents"> 
                        <AnswersComponent {...answerProps}/>
                        <CommentsBox {...answerProps}/>
                    </div>
                );
            })}
        </div> 
    )
};


