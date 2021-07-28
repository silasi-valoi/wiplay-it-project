import React, { Component } from 'react';

import  * as action  from 'actions/actionCreators';
import { getQuestion } from 'dispatch/index';

import  AjaxLoader from 'templates/ajax-loader';
import { QuestionComponent} from 'templates/question';
import {store} from "store/index";
import { AnswersBox } from 'containers/main/answer-page';
import GetTimeStamp from 'utils/timeStamp';
import {cacheExpired} from 'utils/helpers';
import {PageErrorComponent} from 'templates/partials';
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
            error         : '',
            isReloading   : false,
            questionData  : null,
            isNewQuestion : false,
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
            if(!this.isMounted) return;
            
            const storeUpdate = store.getState();
            const {entities} = storeUpdate;
            const questionStore:object = entities['question'];
            const questionById:string = this.state['questionById'];
            const questionData:object = questionStore && questionStore[questionById];
       
            if (questionData){
                
                let isReloading:boolean = questionData['isLoading'];
                let error:string = questionData['error'];

                this.setState({questionData, isReloading});
                
                if (error) {
                    this.setState({error})
                    delete questionData['error']; 
                }
            }
                      
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
    
    getQuestionFromStore(questionById:string):object{
        let entities:object = this.props['entities'];
     
        let question:object = entities['question'];
        question = question && question[questionById];

        return question;
    }

    componentDidMount() {
        this.isMounted = true;
        this.onQuestionUpdate();
        let {slug, id}  =  this.props['match'].params;
        let questionById = `question${id}`;
        this.setState({questionById, id})
                        
        let questionData = this.getQuestionFromStore(questionById)
        let _cacheExpired:boolean = cacheExpired(questionData);

        if(!_cacheExpired){
            return this.setState({questionData});
        }

        let questionStore:object = this.props['entities'].question;
        questionData = questionStore && questionStore[questionById];

        if (questionData && questionData['question']) {
            return this.setState({questionData})
        }
        
        // Data might have expired or doesn't exist in store,
        // So we fech it from api. 
        store.dispatch<any>(getQuestion(id));
      
    };
       
    componentDidCatch(error, info) {
        // You can also log the err or to an error reporting service
        //console.log(error, info)
        let errors:string = 'Sorry, something wrong happened'
        this.setState({error:errors})
    };

    reLoader =()=>{
        let id = this.state['id'];   
        this.setState({isReloading : true, error:null})
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
        if(!this.isMounted){
            return null;
        }

        const props = this.getProps();
        const questionData = props['questionData'];

        if (!questionData) {
            return null;
        }

        return (
            <div>
                {questionData.isLoading &&
                    <div className="page-spin-loader-box partial-page-loader">
                        <AjaxLoader/>
                    </div>
                }
                <PageErrorComponent {...props}/>

                {!questionData.isLoading &&
                    <Questions {...props}/>
                }
            </div>
        );
    };
};


export default  MainAppHoc(QuestionPage);


export const Questions = props => {
    const questionData = props['questionData'];
    let question = questionData && questionData.question;
    if (!question) return null;
    const questionProps = {...props, question};
      
    return (
        <div className="question-page">
            <div className="question-container">
                <div className="question-contents">
                    <QuestionComponent {...questionProps}/>
                </div>
                <AnswersBox {...questionProps}/>
            </div>
        </div>
    );
};






