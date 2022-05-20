import { UPDATE_USER_LIST } from "actions/types";
import { Apis } from "api";
import CommentsBox from "containers/main/comment-page";
import React from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import { AnswersComponent } from "./answer";
import { FollowUserBtn, LinkButton } from "./buttons";
import { PostComponent } from "./post";
import { QuestionComponent } from "./question";

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
    let questions:object = entities.questions;
    questions = questions[questionListById];

    if (!questions || questions['isLoading']) return null;
    

    let questionList:object[] = questions['questionList'];
    if(!questionList || !questionList.length) return null;
   
    return (
        <div className="index-questions">
            <div className="index-questions-box">
                <div className="index-items-label">
                    <b>Questions</b>
                </div>

                {questionList.map((question, index) => {
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
    );
};


export const Posts = props => {
    let { postListById, entities } = props;
    let posts:object = entities.posts;
    posts = posts[postListById];

    if (!posts || posts['isLoading']) {
        return null
    }

    let postList:object[] = posts['postList'];
    if(!postList || !postList.length) return null;
  
    return (
        <div className="index-posts">
            <div className="index-posts-box">
                <div className="index-items-label">
                    <b>Posts</b>
                </div>

                { postList.map((post, index) => {
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
    );
};



export const Answers = props => {
    let { answerListById, entities } = props;
    let answers:object   = entities.answers;
    answers = answers && answers[answerListById]; 

    if (!answers || answers['isLoading']) {
        return null;
    }

    let answerList:object[] = answers['answerList'];
    if(!answerList || !answerList.length) return null;

    return (
        <div className="index-answers">
            <div className="index-answers-box">
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
    );
};


export const Users = props => {
    let {userListById, entities} = props;
    let users:object  =  entities && entities.users 
    users =  users && users[userListById]; 

    if (!users || users['isLoading']) return null;

    let userList:object[] = users['userList'];

    if(!userList || !userList['length']) return null;

        
    return(
        <div className="index-users-box">
            <ul className="index-user-list-title-box">
                <li>Discover New People</li>
            </ul>

            <button type="button"
                    style={props.scrollBtnStyles}
                    onClick={(e)=>props.handleScroll('left')}
                    className="scroll-btn scroll-btn-left btn-sm">
                <ArrowLeft className="" size={20}/>
            </button>
            <button type="button" 
                    style={{}}
                    onClick={(e)=>props.handleScroll('right')}
                     className="scroll-btn scroll-btn-right btn-sm">
                <ArrowRight className="" size={20}/>
            </button>
                        
            { _UserList(props, userList) }
        </div>
    );
};



const _UserList = (props, userList:object[]) =>{
    const currentUser:object = props['currentUser'];
    const userListById:string = props['userListById'];
    const apis = Apis; 

    
    return(
        <div className="index-user-list-container" id="index-user-list-container">
            {userList.map((user, index) => {
                                
                let profile:object = user['profile'];
                let profile_picture = profile['profile_picture'];

                const linkProps:object = {
                    linkPath : `/profile/${user['slug']}/`,
                    state : {id : user['id']},
                };

                let editObjProps = {
                        objName    : 'UsersList',
                        isPut      : true,
                        obj        : user, 
                        byId       : userListById,
                        currentUser,
                        index,
                        actionType : UPDATE_USER_LIST,
                        apiUrl : apis.updateProfileApi(user['id']),
                };
               
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

    );
}; 


