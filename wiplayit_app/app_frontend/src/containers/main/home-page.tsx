import React, { Component } from 'react';
import  * as action  from "actions/actionCreators";
import { Link } from "react-router-dom";

import { NavigationBarSmallScreen,
         NavigationBarBottom,
         NavigationBarBigScreen } from "templates/navBar";
import {store } from "store/index";
import { FollowUserBtn, LinkButton} from "templates/buttons"; 
import { GetModalLinkProps } from "templates/component-props";
import { UnconfirmedUserWarning,
         PageErrorComponent, } from "templates/partials";
import  {getIndex} from 'dispatch/index';

import { QuestionComponent} from "templates/question"
import { PostComponent} from "templates/post"
import CommentsBox from "containers/main/comment-page";
import {AnswersBox} from "containers/main/answer-page";
import * as checkType from 'helpers/check-types'; 
import  AjaxLoader from "templates/ajax-loader";
import { AnswersComponent } from "templates/answer";
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
            isAutheticanting : false,
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
        

    getTimeState(timeStamp:number){
        const timeState = new GetTimeStamp({timeStamp});
        return parseInt(`${timeState.menutes()}`)
    };

    checkDataExist(data:object){
        if (data['questions'] 
            || data['users'] 
            || data['answers']
            || data['posts']) {

            return true;
        }
        return false;
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    getIndexData(){
        console.log('Fetching index data from api')
        store.dispatch<any>(getIndex()); 
    };
    
    componentDidMount() {
        this.isMounted = true;
        this.onIndexUpdate();
        
        let cacheEntities = this.props['cacheEntities']
        let storeEntities:object = this.props['entities']
        let index     =  storeEntities['index'];
        let cachedIndex  = cacheEntities?.index; 
        let checkDataExist  = this.checkDataExist;
              
        if (checkDataExist(cachedIndex)) {
            let menDifference = this.getTimeState(cachedIndex.timeStamp);
            if (menDifference <= 2) {
                return this.updateIndexEntities(cachedIndex);
            }
        }
             
        if(checkDataExist(index)) {
            return this.updateIndexEntities(index);
        }
        
        this.getIndexData();
    };
      
    reLoader =()=>{
        if (this.isMounted) {
            this.setState({isReloading : true})
        }
        this.getIndexData();
    };

    _checkData(data:object):boolean {
        if (!data) return false;

        if(checkType.isObject(data)){
            data = Object.keys(data)
        }
        return data && data['length'] || false;
    }

    updateIndexEntities(index){
        let {questions, posts, answers, users} =  index;
        const checkData = this._checkData; 

        checkData(questions) && this.dispatchQuestions(questions);
        checkData(answers)   && this.dispatchAnswers(answers);
        checkData(posts)     && this.dispatchPosts(posts);
        checkData(users)     && this.dispatchUsers(users);
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
        let props = this.getProps();
        let { index } = props['entities'];
                                
        return (
            <div>
                <NavigationBarBigScreen {...props}/>
                <NavigationBarSmallScreen {...props}/>
                <NavigationBarBottom {...props}/>
                { index &&
                    <div className="app-box-container app-index-box">
                        <UnconfirmedUserWarning {...props}/>

                        {index && index.isLoading &&
                            <div className="page-spin-loader-box">
                                <AjaxLoader {...props}/>
                            </div>
                        }

                        <PageErrorComponent {...props}/>

                        {!index.isLoading &&
                            <IndexComponent {...props}/>
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
    let questionList = questions && questions.questionList;
    
    return (

        <div >
            { questionList && questionList.length?
                <div className="index-questions">
                    <div className="index-questions-box">
                        <div className="question-container">
                            <div className="index-items-label">
                                <b>Questions</b>
                            </div>

                            { questionList.map((question, index) => {
                                let contentsProps = {
                                        question,
                                        questionById :questionListById
                                };

                                Object.assign(contentsProps, props)  

                                return (

                                    <div key={index}>
                                        <QuestionComponent {...contentsProps}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                :
                null
            }
       
      </div>
   );
};





export const Posts = props => {
   
    let { postListById, entities } = props;

    let posts = entities.posts[postListById];
    
  
    return (

        <div>
            { posts && posts.postList && posts.postList.length?
                <div className="index-posts">
                    <div className="index-posts-box">
                       <div className="post-container">
                            <div className="index-items-label">
                                <b>Posts</b>
                            </div>

                            { posts.postList.map((post, index) => {
                                let postProps = {
                                        post,
                                        postById: postListById,
                                };

                                Object.assign(postProps, props)  

                                return (
                                    <div key={index} className="post-contents">
                                        <PostComponent {...postProps}  />
                                         <CommentsBox {...postProps}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                :
                null
            }
        </div>
    );
};






export const Answers = props => {
    let { answerListById, entities } = props;
    let answers   = entities.answers[answerListById]; 
    //console.log(answers)     
    return(
        <div>
            {answers && answers.answerList && answers.answerList?
                <div className="index-answers">
                    <div className="index-answers-box">

                        <div className="answer-container">
                            <ul className="index-items-label">
                                <li>Answers</li>
                             </ul>
                  
                            { answers.answerList.map((answer, index) => {
                                let answerProps = { answer };
                                Object.assign(answerProps, props); 
      
                                return ( 
                                    <div key={index} className="answer-contents"> 
                                        
                                        <AnswersComponent {...answerProps}/>
                                        <CommentsBox {...answerProps}/>
                                    </div>
                                );
                            } )}
                        </div>
                    </div>
                </div>

                :
               ""
            }

        </div> 
    );
};




export const Users = props => {
    let { userListById, entities, currentUser } = props;
    let users:object  =  entities && entities.users 
    users =  users && users[userListById]; 

    if (!users) return null;

    let userList:object[] = users['userList'];

    if(!userList || !userList['length']) return null;

        
    return(
        <div className="index-user-list">
            <ul className="index-user-list-title-box">
                <li>Discover New People</li>
            </ul>
            <_UserList {...props}/>
        </div>
    );
};



const _UserList = (props) =>{
    let { userListById, entities, currentUser } = props;
    let users  =  entities && entities.users 
    users =  users[userListById]; 

    
    return(
        <div className="index-user-list-container">
            { users.userList.map((user, index) => {
                                
                let profile         = user['profile'];
                let profile_picture = profile['profile_picture'];

                const linkProps:object = {
                    linkPath:`/profile/${user.id}/${user['slug']}/`,
                    state:{user},
                }

                let editObjProps = {
                        objName    : 'UsersList',
                        isPut      : true,
                        obj        : user, 
                        byId       : userListById,
                        currentUser,
                }

                editObjProps = GetModalLinkProps.props(editObjProps);
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
                                                {user.first_name} { user.last_name }
                                            </span> 
                                        </LinkButton>

                                    </li>
                                </ul>
                            </div>
                        </div>
                    
                        <ul className="index-user-credentials-box text-wrap">
                            <li>{user.profile.credential}</li>
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


