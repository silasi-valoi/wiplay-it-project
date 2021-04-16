import React, {Component} from 'react';

import {QuestionComponent} from "templates/question"
import  * as action  from 'actions/actionCreators';
import {getQuestionList} from 'dispatch/index';
import {store} from 'store/index';
import  MainAppHoc from "containers/main/index-hoc";
import {OpenEditorBtn}  from "templates/buttons";
import {UnconfirmedUserWarning, PageErrorComponent} from 'templates/partials';
import { GetModalLinkProps } from "templates/component-props";
import { MatchMediaHOC } from 'react-match-media';
import {PartalNavigationBar, 
        NavigationBarBottom,
        NavigationBarBigScreen} from 'templates/navBar';
import  AjaxLoader from 'templates/ajax-loader';
 


class  QuestionListPage extends Component  {
    private isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);

        this.state = {
            isQuestionListBox : true,
            questionListById  : 'filteredQuestions',
            isReloading       : false,
            pageName          : "Questions",
            error             : '',
            questionListTab : {color:'#A33F0B'},
        }
     
   }

   public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 

    onQuestionListUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate  = store.getState();
            let {entities }  = storeUpdate;
            let questions   = entities['questions'];

            let questionListById  = this.state['questionListById'];
             questions           = questions && questions[questionListById]
                     
            //console.log(errors) 
            if (this.isMounted && questions){
                this.setState({isReloading : questions.isLoading, error: questions.error})  
            }
                      
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
    

    
    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };
      
    componentDidMount() {
        this.isMounted = true;
        this.onQuestionListUpdate();

        var questionListById = this.state['questionListById'];
        let cacheEntities = this.props['cacheEntities'];
        let {questions, currentUser} = cacheEntities;
        
             
        questions = questions[questionListById]
        let questionList = questions && questions.questionList;

        if (questionList) {
            console.log(questionList) 
            
            store.dispatch<any>(action.getQuestionListPending(questionListById));
            store.dispatch<any>(action.getQuestionListSuccess( questionListById, questionList));
            return
        }
      

        store.dispatch<any>(getQuestionList(questionListById));                           
      
    };

     reLoader =()=>{
        let questionListById = this.state['questionListById'];   
        this.isMounted && this.setState({isReloading : true})
        return store.dispatch<any>(getQuestionList(questionListById));
    };

   

    getProps(){
        return {
            ...this.props,
            ...this.state,
            reLoader : this.reLoader.bind(this),
        }
    };

    render() {
        let props = this.getProps();
        //let style =  {border:'1px solid red',padding:'60px 0 0 0', margin:'100px 0 0 0'}
        var { questions }  = props['entities'];
        let questionListById = this.state['questionListById']; 
        questions  = questions[questionListById];
           
      
        return (
            <div style={{}}>
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} /> 
                <NavigationBarBottom {...props}/>
                
                { questions &&
                    <div  className="app-box-container">
                        <UnconfirmedUserWarning {...props}/>
                        
                        { questions.isLoading && 
                            <div  className="page-spin-loader-box partial-page-loader">
                                <AjaxLoader/>
                            </div>
                        } 
                        { questions.error && !questions.error &&
                            <PageErrorComponent {...props}/>
                        }
                        
                        <Questions {...props}/>   
                    </div>
                
                }
            </div>
        );
    };

};


export default MainAppHoc(QuestionListPage);





let createQuestionProps = {
        objName   : 'Question',
        isPost    : true,
        linkName  : "Ask Question",
        className : "btn-sm",
    };


createQuestionProps = GetModalLinkProps.props(createQuestionProps);


const Questions = props => {

    let questions  = props.entities.questions;
    questions  = questions[props.questionListById];
    let questionList = questions && questions.questionList;
   
    return (
        <div className="question-list-page" id="question-list-page">
            { questionList && questionList.length &&
                IterateQuestionList(props, questionList)

                ||
                <div className="">
                    <ul className="empty-question-list-box">
                        <li className="">
                            No question yet
                        </li>
                    </ul>

                    <div className="question-list-create-box">
                        <OpenEditorBtn {...createQuestionProps}/>
                    </div>
                </div>
            }
        </div>
    );
}


const IterateQuestionList = (props, questionList:[])=>{
   
    return questionList.map((question:object, index:number)  => {
                       
        return (
            <div key={index}>
                <QuestionComponent {...{...props, question}}/>
            </div>
        )
    })
};


 