import React, { Component } from 'react';
import  * as action  from "actions/actionCreators";
import { Link } from "react-router-dom";

import {store } from "store/index";
import {FollowUserBtn, LinkButton} from "templates/buttons"; 
import { PageErrorComponent } from "templates/partials";
import  {getIndex} from 'dispatch/index';
import {UPDATE_USER_LIST} from 'actions/types';
import Apis from 'utils/api';
import {cacheExpired} from 'utils/helpers';
import {QuestionComponent} from "templates/question"
import {PostComponent} from "templates/post"
import CommentsBox from "containers/main/comment-page";
import {AnswersBox} from "containers/main/answer-page";
import  AjaxLoader from "templates/ajax-loader";
import {AnswersComponent } from "templates/answer";
import GetTimeStamp from 'utils/timeStamp';
import {history} from 'App'
import  MainAppHoc from "containers/main/index-hoc";


class HomePage extends Component<any, any> {
    public isFullyMounted = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);

        this.state = {
            isHomeBox        : true,
            questionListById : 'filteredQuestions',
            postListById     : 'filteredPosts',
            answerListById   : 'filteredAnswers',
            userListById     : 'filteredUsers',
            isReloading      : false,
            homeTab          : {color:'#A33F0B'},      
        } 
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
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
        let userListById     = this.state['userListById'];

        let {questions, posts, answers, users} =  entities;

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

    getProps(){
        return {
            ...this.props,
            ...this.state,
            reLoader : this.reLoader.bind(this),
        };
    };

      
    render() {
        if(!this.isMounted){
            return null;
        }

        let props = this.getProps();
        let { index } = props['entities'];
                                                
        return (
            <div>
                {index &&
                    <div className="app-index-box">
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



export const IndexComponent = props => {
    
    return(
        <div className="home-page-contents" id="home-page-contents">
            <Answers {...props}/>
            <Users {...props}/>
            <Posts {...props}/>
            <Questions {...props}/>
        </div>
    )

}


export const Questions = props => {
    let {questionListById, entities} = props;
    let {questions} = entities
    questions = questions && questions[questionListById];
    let questionList:object[] = questions && questions.questionList;

    if (questions?.isLoading) {
        return null
    }
   
    return (
        <div >
            { questionList && 
                <div className="index-questions">
                    <div className="index-questions-box">
                        <div className="question-container">
                            <div className="index-items-label">
                                <b>Questions</b>
                            </div>

                            { questionList.map((question, index) => {
                                let contentsProps = {
                                    index,
                                    question,
                                    questionById :questionListById
                                };

                                Object.assign(contentsProps, props)  

                                return (

                                    <div key={index} className="index-question-contents">
                                        <QuestionComponent {...contentsProps}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
       
      </div>
   );
};


export const Posts = props => {
    let { postListById, entities } = props;
    let posts = entities.posts;
    posts = posts && [postListById];
    if (posts?.isLoading) {
        return null
    }

    let postList:object[] = posts && posts.postList;
  
    return (

        <div>
            {postList && 
                <div className="index-posts">
                    <div className="index-posts-box">
                       <div className="post-container">
                            <div className="index-items-label">
                                <b>Posts</b>
                            </div>

                            {postList.map((post, index) => {
                                let postProps = {
                                    index,
                                    post,
                                    postById: postListById,
                                };

                                Object.assign(postProps, props)  

                                return (
                                    <div key={index} className="index-post-contents">
                                        <PostComponent {...postProps}  />
                                        <CommentsBox {...postProps}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};



export const Answers = props => {
    let { answerListById, entities } = props;
    let answers   = entities.answers;
    answers = answers && answers[answerListById]; 
    if (answers?.isLoading) {
        return null
    }

    let answerList:object[] = answers && answers.answerList;

    return(
        <div>
            {answerList && 
                <div className="index-answers">
                    <div className="index-answers-box">

                        <div className="answer-container">
                            <ul className="index-items-label">
                                <li>Answers</li>
                             </ul>
                  
                            {answerList.map((answer, index) => {
                                let answerProps = {
                                    ...props,
                                    answer,
                                    index,
                                    isAnswerBox:true,
                                };
                                 
                                return ( 
                                    <div key={index} className="index-answer-contents"> 
                                        <AnswersComponent {...answerProps}/>
                                        <CommentsBox {...answerProps}/>
                                    </div>
                                );
                            } )}
                        </div>
                    </div>
                </div>
            }

        </div> 
    );
};


export const Users = props => {
    let {userListById, entities, currentUser} = props;
    let users:object  =  entities && entities.users 
    users =  users && users[userListById]; 

    if (!users || users['isLoading']) return null;

    let userList:object[] = users['userList'];

    if(!userList || !userList['length']) return null;

        
    return(
        <div className="index-user-list">
            <ul className="index-user-list-title-box">
                <li>Discover New People</li>
            </ul>
            { _UserList(props, userList) }
        </div>
    );
};



const _UserList = (props:object, userList:object[]) =>{
    const currentUser:object = props['currentUser'];
    let userListById:string = props['userListById'];
    const apis = Apis; 

    
    return(
        <div className="index-user-list-container">
            {userList.map((user, index) => {
                                
                let profile:object = user['profile'];
                let profile_picture = profile['profile_picture'];

                const linkProps:object = {
                    linkPath:`/profile/${user['id']}/${user['slug']}/`,
                    state:{user},
                }

                let editObjProps = {
                        objName    : 'UsersList',
                        isPut      : true,
                        obj        : user, 
                        byId       : userListById,
                        currentUser,
                        index,
                        actionType : UPDATE_USER_LIST,
                        apiUrl : apis.updateProfileApi(user['id']),
                }
               
                let btnsProps   = {...props, editObjProps};
                let UnfollowOrFollowUserBtn =  <FollowUserBtn {...btnsProps}/>;

                return ( 
                    <div key={index} className="index-user-list-box">
                        <div className="index-user-list-contents">
                            <div className="index-user-list-img-container">
                                <div className="index-user-img-box">
                                    <div className="index-user-list-img-box">
                                        <LinkButton {...linkProps}>
                                            <img  src={`${profile_picture}`} 
                                                  alt="" 
                                                  className="index-user-list-img"/> 
                                        </LinkButton>
                                    </div>
                                </div>

                                <div className="hid-user-btn-box">
                                    <button type="button" className="hid-user-btn btn-sm">
                                        <span className="hid-user-icon">&times;</span>
                                    </button>
                                </div>
                            </div>
                                        

                            <div className="">
                                <ul className="index-user-name-box">
                                    <li className="index-user-name">
                                        <LinkButton {...linkProps}>
                                            <span>
                                                { user['first_name']} { user['last_name'] }
                                            </span> 
                                        </LinkButton>

                                    </li>
                                </ul>
                            </div>
                        </div>
                    
                        <ul className="index-user-credentials-box text-wrap">
                            <li>{profile['credential']}</li>
                        </ul>
                        <div className="index-user-follow-btn-box">
                            {UnfollowOrFollowUserBtn}
                        </div>
                    </div>
                )
            })}
         
        </div>

    )
} 


