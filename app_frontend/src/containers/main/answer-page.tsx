import React, { Component } from 'react';
import { AnswersComponent } from 'templates/answer';
import CommentsBox from "containers/main/comment-page";
import  MainAppHoc from "containers/main/index-hoc";

import {store} from "store/index";
import  * as action  from 'actions/actionCreators';


class AnswerContainer extends Component {
    public isFullyMounted:boolean = false;

    constructor(props) {
        super(props);

        this.state = {
            pageName    : "Answer",
            isAnswerBox : true,
            question    : undefined,
        };
    };

    static pageName(){
        return "Answer"
    }

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }

    componentWillUnmount() {
        this.isMounted = false;
    };


    componentDidMount() {
        this.isMounted = true;
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
        if(!this.isMounted){
            return null;
        }

        let props = {...this.props, ...this.state}
                
        let {answers} = props['entities'];
        let question:object = props['question'];
        let answerListById:string = props['answerListById'];
        answers = answers   && answers[answerListById];
           
        return(
            <div className="page-contents" id="page-contents">
                <div className="answer-page" id="answer-page">
                    <div className="new-answer-container">
                        { OldAnswers(props, answers) }
                    </div>
                </div>
            </div>
        );
    };
}; 



export default MainAppHoc(AnswerContainer);

export class AnswersBox extends Component {
    public isFullyMounted:boolean = false;

    constructor(props) {
        super(props);

        this.state = {
            isAnswerBox       : true,
            question          : '',
            answerListById    : '', 
            newAnswerListById : '',
        };
    };

    //static pageName = () => {
    //    return "Answer"
    //};

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
   
   
    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        console.log(error, info);
    }

    componentWillUnmount() {
        this.isMounted = false;
    };


    componentDidMount() {
        this.isMounted = true;
        
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
          
        if (newAnswersNum) {
            currentAnswersNum = currentAnswersNum  + newAnswersNum;
        }

        return currentAnswersNum;
    }    


    render() { 
        if(!this.isMounted){
           return null;
        }

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


