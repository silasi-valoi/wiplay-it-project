import React, { Component } from 'react';
import  * as action  from "actions/actionCreators";

import {store } from "store/index";
import {PageErrorComponent, UnconfirmedUserWarning} from 'templates/partials';
import { NavBarTabStyles } from 'templates/navigations/utils';

import  {getIndex} from 'dispatch/index';
import {cacheExpired} from 'utils';
import  AjaxLoader from "templates/ajax-loader";
import  MainAppHoc from "containers/main/index-hoc";
import { IndexComponent } from 'templates/home';


class HomePage extends Component<any, any> {
    public isFullyMounted = false;
    private unsubscribe;

    constructor(props) {
        super(props);

        this.state = {
            isHomeBox        : true,
            questionListById : 'filteredQuestions',
            postListById     : 'filteredPosts',
            answerListById   : 'filteredAnswers',
            userListById     : 'filteredUsers',
            scrollBtnStyles  : {},
            isReloading      : false,
        } 
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }

    static pageName(){
        return "Home"
    }

    static navbarTabeStyles(){
        return {
            homeTab : NavBarTabStyles()
        }
    }
 
  
    // static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    //  return  dispatch => action.handleError(error);
    // }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        //console.log(error, info);
    }

    onIndexUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate   = store.getState();
            let {entities }   = storeUpdate;
            let index:object = entities['index']

            if(index && Object.keys(index)){
                let isReloading:boolean = index['isLoading'];
                let error:string = index['error'];
                this.setState({isReloading});

                if (index['isSuccess']) {
                    index['isSuccess'] = false;
                    this.updateIndexEntities(index);

                }else if(error){
                    this.setState({error})
                    delete index['error'];
                }
            }
          
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    _CheckIndexDataFromStore(){
        let entities  = this.props['entities'];

        let questionListById = this.state['questionListById'];
        let answerListById   = this.state['answerListById']; 
        let postListById     = this.state['postListById'];

        let {questions, posts, answers} =  entities;

        if(!questions[questionListById])return false;
        if(!answers[answerListById])return false;
        if(!posts[postListById])return false;

        return true;
    };
        
    checkDataExist(data:object){
        if (!data) {
            return false;
        }

        if (data['questions'] 
            && data['users'] 
            && data['answers']
            && data['posts']) {

            return true;
        }

        return false;
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    getIndexData(){
        let isAuthenticated:boolean = this.props['isAuthenticated']
        store.dispatch<any>(getIndex(isAuthenticated)); 
    };
    
    componentDidMount() {
        this.isMounted = true;
        this.onIndexUpdate();
              
        let storeEntities:object = this.props['cacheEntities'];
        let index  =  storeEntities['index'];
                    
        if (this.checkDataExist(index)) {
            let dataExpired:boolean = cacheExpired(index);
            
            if (!dataExpired) {
                return this.updateIndexEntities(index);
            }
        }
             
        this.getIndexData();

        let scrollDiv = document.getElementById('index-user-list-container');
        let scrollBtnStyles:object = {};

        if(scrollDiv && scrollDiv.scrollLeft === 0) {
            scrollBtnStyles = {
                display:'none'
            }
        }else {
            scrollBtnStyles = {
                display:'none'
            }
        }
        scrollDiv && console.log(scrollDiv.scrollLeft)

        this.setState({scrollBtnStyles})
    };
      
    reLoader = () =>{
        this.setState({isReloading : true, error:null})
        this.getIndexData();
    };

    updateIndexEntities(index){
        let {questions, posts, answers, users} =  index;

        this.dispatchAnswers(answers);
        this.dispatchQuestions(questions);
        this.dispatchPosts(posts);
        this.dispatchUsers(users);
    };

    dispatchQuestions(questions){
        store.dispatch<any>(action.getQuestionListPending('filteredQuestions'));
        store.dispatch<any>(action.getQuestionListSuccess('filteredQuestions', questions));

    }

    dispatchAnswers(answers){
        store.dispatch<any>(action.getAnswerListPending('filteredAnswers'));
        store.dispatch<any>(action.getAnswerListSuccess('filteredAnswers', answers));
    }

    dispatchPosts(posts){
        store.dispatch<any>(action.getPostListPending('filteredPosts'));
        store.dispatch<any>(action.getPostListSuccess('filteredPosts', posts));
    }

    dispatchUsers(users){
        store.dispatch<any>(action.getUserListPending('filteredUsers'));
        store.dispatch<any>(action.getUserListSuccess('filteredUsers', users));
    }

    handleScroll=(direction:string) => {
                
        let scrollDiv = document.getElementById('index-user-list-container');
        if (!scrollDiv) {
            return
        }
        let scrollBtnStyles:object = {};

        let scrollSize:number;
        if (direction == 'right') {
            scrollSize = scrollDiv.clientWidth;
            scrollBtnStyles = {
                diplay:'block'
            }
                    
        }else if (direction === 'left'){
            scrollSize = -scrollDiv.clientWidth;

            if(scrollDiv.scrollLeft === 0){
                scrollBtnStyles = {
                    display:'none'
                }
            }
                        
        }
        scrollDiv.scroll({top:0, left:scrollSize, behavior:'smooth'});
                
        this.setState({scrollBtnStyles})
    };

    getProps(){
        return {
            ...this.props,
            ...this.state,
            handleScroll : this.handleScroll.bind(this),
            reLoader : this.reLoader.bind(this),
        };
    };

      
    render() {
        if(!this.isMounted){
            return null;
        }

        let props = this.getProps();
        let { index } = props['entities'];

        //className="page-contents" id="page-contents"
                                                
        return (
            <div className="home-page">
                <UnconfirmedUserWarning {...props}/>

                {index &&
                    <div className="page-contents" id="page-contents">
                        <PageErrorComponent {...props}/>

                        {index && index.isLoading &&
                            <div className="page-spin-loader-box">
                                <AjaxLoader {...props}/>
                            </div>

                            ||

                            <div className=""> 
                                {!index.isLoading && !index.errors &&
                                    <IndexComponent {...props}/>
                                }
                            </div>
                        }
                    </div>
                }           
            </div>
        );
    };
};

export default  MainAppHoc(HomePage);


