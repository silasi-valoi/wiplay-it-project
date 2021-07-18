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
        };
    };


    componentDidMount() {
        console.log(this.props)

        let {slug, id}  = this.props['match'].params;
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
                
        let {answers} = props['entities'];
        let question:object = props['question'];
        let answerListById:string = props['answerListById'];
        answers = answers   && answers[answerListById];
           
        return(
            <div className="app-box-container app-question-box">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                
                <div className="answer-page" id="answer-page">
                    <div className="new-answer-container">
                        { OldAnswers(props, answers) }
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

    getAnswersCount(currentAnswers, newAnswers){
                    
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
        const isQuestionBox = props['isQuestionBox']
       
        let newAnswerListById = props['newAnswerListById'];
        let answerListById = props['answerListById'];

     
        let {answers}  = props['entities'];
        let oldAnswers = answers        && answers[answerListById];
        let newAnswers = answers        && answers[newAnswerListById];
        let answersCount  = this.getAnswersCount(oldAnswers, newAnswers);
                         
        return (
            <div className="">
                <div>
                    {answersCount !== 0 && isQuestionBox &&
                        <ul className="answers-count-box">
                            { answersCount > 1 && 
                                <li className="answers-count">
                                    {answersCount}  Answers
                                </li>

                                ||

                                <li className="answers-count">
                                    {answersCount}  Answer
                                </li>
                            }
                        </ul>
                    }
                    <div className="answer-list-container">
                        { NewAnswers(props, newAnswers) }
                        { OldAnswers(props, oldAnswers) }
                    </div>
                </div>

                <div>
                    {!answersCount && isQuestionBox &&
                        <ul className="answers-count-box">
                            <li className="answers-count">No answer yet</li>
                        </ul>
                    }
                </div>
               
            </div>
        );        
    };
};


const NewAnswers = (props:object, answers:object) => {
    let isNewAnswers = true;

    let answerList:object[] = answers && answers['answerList'];   
    return answerList && Answers(props, answerList, isNewAnswers) || null;
};

const OldAnswers = (props:object, answers:object) => {
   
    let answerList:object[] = answers && answers['answerList'];   
    return answerList && Answers(props, answerList) || null;
};


export const Answers = (props:object, answerList:object[], isNewAnswers=false) => {
             
    return(
        <div className="answer-list-box">
            {answerList?.map((answer, index) => {
                let answerProps = {index, answer, isNewAnswers};
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


