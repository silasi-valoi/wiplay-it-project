import React, { Component } from 'react';

import  * as action  from 'actions/actionCreators';
import { getQuestion } from 'dispatch/index';
import {PartalNavigationBar,
    NavigationBarBottom,
        NavigationBarBigScreen } from 'templates/navBar';
import  AjaxLoader from 'templates/ajax-loader';
import { QuestionComponent} from 'templates/question';
import {store} from "store/index";
import { AnswersBox } from 'containers/main/answer-page';
import GetTimeStamp from 'utils/timeStamp';
import { UnconfirmedUserWarning, 
         PageErrorComponent } from 'templates/partials';
import  MainAppHoc from "containers/main/index-hoc";



class QuestionPage extends Component {
    private isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);
        

        this.state = {
            isQuestionBox : true, 
            pageName      : "Question", 
            questionById  : '',
            isNewQuestion : false,
            isReloading   : false,
        };

    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };


    onQuestionUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate  = store.getState();
            let {entities }  = storeUpdate;
            let question   = entities['question'];

            let questionById  = this.state['questionById'];
             question           = question && question[questionById]
                     
            //console.log(errors) 
            if (this.isMounted && question){
                this.setState({isReloading : question.isLoading, error: question.error})
                delete question.error;  
            }
                      
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
    


    componentDidMount() {
        this.isMounted = true;
        this.onQuestionUpdate();
                      
             let { slug, id }  =  this.props['match'].params;
        let {state}       =  this.props['location']; 
        let questionById  = `question${id}`;

        this.setState({questionById, id})
        
        if (state && state.recentlyCreated) {
            let question = state.question;
            this.dispatchToStore(questionById, question)
            return; 
        }

        let { question } = this.props['entities'];
        question = question && question[questionById]
        !question && this.updateQuestionStore(id);
      
    };

    updateQuestionStore(id){
        let questionById = `question${id}`;
        let question     = this.props['cacheEntities'].question;
        console.log(question)

        if (!question || question && !question[questionById]){
            console.log('No question and Fetching question data from the server')
            return store.dispatch<any>(getQuestion(id));
        }

        let timeStamp = question[questionById]?.timeStamp;
        const getTimeState = new GetTimeStamp({timeStamp});
                                      
        if (getTimeState.menutes() >= 5) {
            console.log('Cache expired and Fetching question data from the server')
            return store.dispatch<any>(getQuestion(id));
        }

        this.setState({questionById })
        console.log( question,'Question found from cachedEntyties')
        this.dispatchToStore(questionById,  question[questionById].question)
         
        
    }

    dispatchToStore(questionById:string, question){
        if (questionById && question) {
            store.dispatch<any>(action.getQuestionPending(questionById));
            store.dispatch<any>(action.getQuestionSuccess(questionById, question));
        }

    } 
   

   
    componentDidCatch(error, info) {
        // You can also log the err or to an error reporting service
        console.log(error, info);
    };

    reLoader =()=>{
        let id = this.state['id'];   
        this.isMounted && this.setState({isReloading : true})
        return store.dispatch<any>(getQuestion(id));
    };
    
    getProps() {
        return {
            ...this.props,
            ...this.state,
            reLoader : this.reLoader.bind(this),
        }
    };

    render() {

        let props = this.getProps();
       
        let questionById = props['questionById'];
        let entities = props['entities'];
        let {question} = entities;

        question = question && question[questionById]
      
        return (
            <div>
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <NavigationBarBottom {...props}/>
                { question &&
                    <div className="app-box-container app-question-box">
                        <UnconfirmedUserWarning {...props}/>
                        { question.isLoading &&
                            <div className="page-spin-loader-box partial-page-loader">
                                <AjaxLoader/>
                            </div>
                        }
                        <PageErrorComponent {...props}/>

                        {!question.isLoading &&
                           <Questions {...props}/>
                        }
                    </div>
                }           
            </div>
        );
    };
};


export default  MainAppHoc(QuestionPage);



export const Questions = props => {
    var {questionById, entities} = props;
    let {question, answers} = entities;
    question = question && question[questionById];
    if(question && question.isLoading) return null;

    question = question && question.question;
    if (!question) return null;

    let questionProps = { question};
    questionProps = {...props, ...questionProps}; 
   
    return (
        <div className="question-page" id="question-page">
            { question &&
                <div className="question-container">
                    <QuestionComponent {...questionProps}/>
                    <AnswersBox {...questionProps}/>
                </div>
            }
        </div>
    );
};






