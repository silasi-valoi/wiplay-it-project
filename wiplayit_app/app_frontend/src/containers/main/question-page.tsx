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
            question      : null,
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
                                
            //console.log(errors) 
            if (this.isMounted && question){
                this.setState({
                        question,
                        isReloading : question.isLoading,
                        error: question.error
                    });

                delete question.error;  
            }
                      
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
    


    componentDidMount() {
        this.isMounted = true;
        this.onQuestionUpdate();
        let {slug, id}  =  this.props['match'].params;
        let questionById = `question${id}`;

        this.setState({questionById})
                        
        let cache = this.props['cacheEntities'];
        let questionCache = cache['question'];
        questionCache = questionCache[questionById]
        let cacheExpired:boolean = this.questionCacheExpired(questionCache);

        if(!cacheExpired){
            console.log( questionCache,'Question found from cachedEntyties')
            
            return this.dispatchToStore(questionById, questionCache.question);
        }

        let {question} = this.props['entities'];
        let questionData = question[questionById]

        if (questionData && questionData.question) {
            return
        }

        console.log('Fetching question data from the server')
        store.dispatch<any>(getQuestion(id));
      
    };

    questionCacheExpired(questionCache:object):boolean {

        if (questionCache) {
            let timeStamp = questionCache['timeStamp'];
            const getTimeState = new GetTimeStamp({timeStamp});
            let menutes = parseInt(`${getTimeState.menutes()}`);
            console.log(menutes);
            return menutes >= 1
        }

        return true;
    };

    dispatchToStore(questionById:string, question:object){
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
    
    getProps():object {
        return {
            ...this.props,
            ...this.state,
            reLoader : this.reLoader.bind(this),
        }
    };

    render() {
        let props = this.getProps();
        let questionById = props['questionById'];
        let question = props['entities']['question'];

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






