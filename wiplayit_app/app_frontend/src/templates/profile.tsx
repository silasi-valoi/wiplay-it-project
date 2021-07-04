import React from 'react';
import { Link, BrowserRouter } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import * as Icon from 'react-feather';

import {history} from "App" 


import Api from 'utils/api';
import  * as types  from 'actions/types';

import{ QuestionComponent } from "templates/question"
import GetTimeStamp from 'utils/timeStamp';

import { PostComponent } from "templates/post"
import { AnswersComponent  } from "templates/answer";

import { OpenEditorBtn,
         OpenOptionlBtn,
         ChangeImageBtn,
         OpenUsersModalBtn,
         UnfollowUserBtn, 
         LinkButton,
         FollowUserBtn } from "templates/buttons";


const api      = new Api();

export const ProfileComponent = props => {
    let {entities,
        currentUser,
        isAuthenticated,
        userIsConfirmed,
        userProfile,
        profileById} = props;
    
    userProfile = userProfile && userProfile.user;
    if (!userProfile) return null;
         
    let profile  = userProfile.profile;
    let apiUrl   = api.getQuestionFollowersListApi(userProfile?.id);
    let linkName = profile.followers > 1 && `${profile.followers} Followers` 
                                || `${profile?.followers} Follower`;

    let userProfileFollowersProps = {
            apiUrl,
            byId      : userProfile && `userProfileFollowers${userProfile.id}`,
            obj       : userProfile,
            currentUser,
            linkName  : linkName,
           
        };
    

    let optionsBtnStyles = {
              fontSize   : '8px',
              background : 'white',
              fontWeight : 'bold',
              width      : '40px',
              color      : '#4A4A4A',
              margin     : '0 0 2px'
    }

            

    let editObjProps = {
            objName     : 'UserProfile',
            isPut       : true,
            obj         : userProfile, 
            byId        : profileById,
            isAuthenticated,
            linkName    : 'Edit',
            currentUser,
            apiUrl : api.updateProfileApi(userProfile.id),
            actionType : types.UPDATE_USER_PROFILE,

    }

    const EditProfileLink = ()=>{
        const pathToEditProfile = userProfile  && 
                 `/edit/profile/${userProfile.slug}/${userProfile.id}/`;
        return(
            <button 
                className="btn-sm edit-user-profile"
                onClick={()=>{
                        props['history'].push(pathToEditProfile, {...editObjProps}); 
                    }}>
                Edit
            </button>
        )
    }


    let EditorModalBtnSmallScreen = MatchMediaHOC(
                                            EditProfileLink,
                                            '(max-width: 980px)');
    const EditorModalBtnBigScreen = MatchMediaHOC(
                                            OpenEditorBtn,
                                            '(min-width: 980px)'); 

    let ChangeImageBtnBigScreen   = MatchMediaHOC(
                                            ChangeImageBtn,
                                            '(min-width: 980px)');

    let UserProfileFollowersBtn = profile && profile.followers !== 0 && 
                                  <OpenUsersModalBtn {...userProfileFollowersProps}/>; 

    let pathToUserFollowers = userProfile &&
                 `/user/profile/${userProfile.slug}/${userProfile.id}/followers/`;
    

    let btnsProps = {
            editObjProps,
            btnStyles : optionsBtnStyles,
            ...props
        };
    
    var followers_text = profile && profile.followers > 1? 'Followers' : 'Follower';  

    let UnfollowOrFollowUserBtn = <FollowUserBtn {...btnsProps}/>;
   
    let UserList = MatchMediaHOC(UserProfileFollowingList, '(min-width: 980px)')
      
    const UserItemsComponent = props.userItemsComponent;   
    let  profile_picture = profile && profile.profile_picture || null;

    let authenticationProps = {
            linkName  : "Edit",
            authenticationType : 'AccountConfirmation',
            currentUser,
    };
        
    return (
        <div className="profile-container">
            {userProfile?
            <div className="profile-contents">
            
            <div id="profile-box">
                <div className="profile">
                    <div className="profile-box">
                        <div className="profile-section-top">
                            <div className="profile-img-container">
                                <div onMouseEnter={props.mouseEnter}
                                     onMouseLeave={props.mouseLeave} 
                                     className="profile-img-box">

                                    <img alt=""
                                         src={`${profile_picture}`}
                                         className="profile-image"/>
                                    </div>

                                {userProfile.user_can_edit && props.isMouseInside?
                                    <div className="edit-img-btn-box"
                                         onMouseEnter={props.mouseEnter}
                                         onMouseLeave={props.mouseLeave}>
                                        <div className="" 
                                             onMouseEnter={props.mouseEnter}
                                             onMouseLeave={props.mouseLeave} >
                                            <ChangeImageBtnBigScreen
                                                {...editObjProps}
                                            />
                                        </div>
                                    </div>
                                    :
                                    null
                                }
                            </div>    

                                            
                            <div className="profile-credential-box">

                                <ul className="profile-name-box">
                                    <li className="profile-name">
                                    {userProfile.first_name} {userProfile.last_name } 
                                    </li>

                                    <li className="user-credential">
                                        {profile.credential}
                                    </li>
                                </ul>

                                <div className="relation-box">
                                    <div className="user-profile-followers-box">
                                        <div className="follow-user-profile-btn-box">
                                            { UnfollowOrFollowUserBtn }     
                                        </div>
                                    
                                    </div>

                                    <div className="user-profile-options-box">
                                        <OpenOptionlBtn {...editObjProps}/>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
     
          
                <div className="credentials-container" >
                    <div className="credentials-box">
                        <div id="credentials-box">
                            <div className="credentials-menu">
                                <div className="about-box">
                                    <p className="about">About</p>
                                </div>

                                <div className="edit-credential-btn-box">
                        
                                    { userProfile?.user_can_edit && userIsConfirmed &&
                                        <div>
                                            <EditorModalBtnBigScreen {...editObjProps}/>
                                            <EditorModalBtnSmallScreen/>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="about-user-box">
                            <Icon.MapPin id="feather-location" size={20}/>
                                <p className="user-location">
                                     {profile?.country }  
                                     {profile?.live } 
                                </p>
                            </div>
                  
                            <div className="about-user-box">
                                <p className="user-fav-quote">
                                    {profile?.favorite_quote }
                                </p>
                            </div> 
                        </div>
                    </div>
        
                    <div className="user-activities-box">
                        <div className="user-activities-title-box">
                            <p>Feeds</p>
                        </div>
                        <UserActivitiesBtns {...props} />
                        
                        <div className="answers-flex-box" id="activities-box">
                            <UserItemsComponent {...props}/> 
                        </div>
                    </div> 
                </div>
            </div>


            <div className="profile-user-list-container">

                <UserList {...props}/>
            </div>

        </div>
        :
        null
        }
        </div>
    );

};


export const UserProfileFollowingList = props => {
    //console.log(props)
    let {
        entities,
        users,
        currentUser,
        isAuthenticated,
        userProfile } = props;

    let usersById = 'filteredUsers';    
    users  = entities?.users[usersById] || users && users[usersById];
    //console.log(users, entities.users)
    let userList = users && users.userList && users.userList.slice(0, 3);

    let userProfileFollowersProps = {
            byId      : usersById,
            obj       : userProfile,
            isAuthenticated,
            currentUser,
            linkName  : `Show more`,
           
        };
    let UserProfileFollowersBtn =  <OpenUsersModalBtn {...userProfileFollowersProps}/>; 
    //console.log(users.userList,userList)

    return (
        <div className="profile-user-list-box">
            <div className="partial-user-list-box-header">
                <p>You might follow </p>
            </div>

            { userList && userList.length?
                <div>
                    { userList.map(( user, index )  => {
                        let userProps = {user  : user, objIndex:index};

                        Object.assign(userProps, props);           
                        return(
                            <div style={props.userListBoxStyles}
                                key={index}
                                className="user-list-containe"
                                id="user-list-containe">

                                <PartialUserList {...userProps}/>

                            </div>
                        )
                    })}
                </div>
                :
                null   
            }
            <div className="partial-user-list-box-bottom">
                {UserProfileFollowersBtn}
            </div>

        </div>
    )
}


export const PartialUserList = props => {
        let {user, usersById, currentUser} = props
        
        let profile         = user && user.profile;
        let profile_picture = profile &&  profile.profile_picture;

        let editObjProps = {
            objName    : 'UsersList',
            isPut      : true,
            obj        : user, 
            byId       : usersById,
            currentUser,
            actionType : types.UPDATE_USER_LIST,
            apiUrl : api.updateProfileApi(user.id),
        }
       
        let btnsProps   = {...props, editObjProps};
      
        let FollowBtn   = MatchMediaHOC(FollowUserBtn, '(min-width: 980px)');
        
        const linkProps:object = {
                linkPath:`/profile/${user.id}/${user['slug']}/`,
                pushToRouter: props['pushToRouter'],
                state:{user},
        };

        return (
            <div className="partial-user-list-box">
                <div className="partial-user-list-contents">
                    <div className="partial-user-list-img-box">
                        <div className="partail-user-list-img user-list-img">
                            { profile_picture &&
                                <LinkButton {...linkProps}>
                                    <img src={`${profile_picture}`} alt="" 
                                        className="user-list-photo"/> 
                                </LinkButton>
                            }        
                        </div>
                    </div>

                    <div className="user-list-credentials-box">
                        <ul className="user-list-credentials">
                            <li className="user-list-name">
                                <LinkButton {...linkProps}>
                                    <span>
                                        {user.first_name} { user.last_name }
                                    </span> 
                                </LinkButton>
                            </li>
                        </ul>

                    </div>

                    <div className="user-list-follow-box" >
                        <div className="user-list-follow-btn-box">
                            <FollowBtn {...btnsProps}/>
                        </div>
                    </div>

                </div>
            </div>
        )
};


export const UserList = props => {
    let {entities, users, usersById} = props

    users   = entities?.users[usersById] || users && users[usersById];
    let userList = users?.userList || [];

    return (
        <div className="">
            {userList?.map(( user, index )  => {
                let userProps = {user  : user, objIndex:index};
                Object.assign(userProps, props);

                return(
                    <div key={index}>
                        <UsersComponent{...userProps}/>
                    </div>
                )
            })}
        </div>

  )
}


export const UserAnswers = props =>{
    let userProfile    = props.userProfile;
    userProfile        = userProfile.user;
    const answerListById = `userAnswers${userProfile.id}`
    const answers        = props.entities.answers;
     
    const usersAnswers   = answers[answerListById]
    const answerList:object[] = usersAnswers && usersAnswers.answerList;
   
   
   return (
        <div>
            { answerList && answerList.length?

                <div className="answer-container">
                    <div className="number-answers-box">
                        {answerList.length === 1? 
                            <p className="items-count">
                               { answerList.length }  Answer
                            </p>

                            :

                            <p className="items-count">
                              { answerList.length } Answers
                            </p>
                        }
                    </div> 

                    <div>
                        {usersAnswers.answerList.map((answer, index) => {
                            let answerProps = {answer, answerListById }
                            Object.assign(answerProps, props)

                            return(
                                <div key={answer.id} 
                                     className="answer-contents profile-activites "> 
                                    <AnswersComponent {...answerProps}  />
                                </div>
                            )
                        }
                        )}
                    </div>

                </div>

                :
                <p>No Answer yet</p>
            }
        </div>
    )
};




export const UserQuestions = props => {
    let userProfile = props.userProfile;
    userProfile    = userProfile.user;

    let  questionListById     = `userQuestions${userProfile.id}`
    let questions  = props.entities.questions;
    questions      = questions[questionListById]
    let questionList = questions && questions.questionList;  
        
    return (
        <div>
            {questionList && questionList?.length &&
                <div className="question-container">
                    <div className="number-question-box">
                        { questionList?.length? 
                            <p className="items-count">
                                {questionList.length } Questions
                            </p>
                            :
                            <p className="items-count">
                                {questionList.length } Question
                            </p>
                        }
                    </div> 
     
                    {questionList?.map((question, index) => {
                        let questionProps = {question, questionListById }
                        Object.assign(questionProps, props)

                        return (
                            <div key={question.id} className="profile-activites"> 
                                <QuestionComponent {...questionProps}/>
                            </div>
                        )
                    })}

                </div>
                || 
                <p>No Question </p>
            }
        </div>
    )
};


export const UserPosts = props => {
   
   let userProfile = props.userProfile;
   userProfile    = userProfile.user;

   let postListById = `userPosts${userProfile.id}`;
   let posts  = props.entities.posts;
   posts      = posts && posts[postListById];
   let postList = posts && posts.postList;
   
   return(
        <div>
            {postList && postList.length &&

                <div className="post-container">
                    <div className="number-post-box">
                        {postList.length > 1? 
                            <p className="items-count">{postList.length } Posts</p>
                            :
                            <p className="items-count">{postList.length } Post</p>
                        }
                    </div> 
      
                    { posts.postList.map((post, index) => {
                        let postProps = { post, postListById}
                        Object.assign(postProps, props)
                        return(
                            <div key={index} className="profile-activites"> 
                            <PostComponent {...postProps}  />
                            </div>
                        )
                    })}
                </div>

                ||
                <p>No Post yet</p>
            }

        </div>
 
   );
};

export const UsersComponent = props => {

    let {user,
         usersById,
         currentUser,
         redirectToUserProfile} = props

    let pathToProfile =  `/profile/${user.id}/${user.slug}/`;
    let profile_picture = user.profile.profile_picture;
    let profile = user.profile;
        
    let state    = { userProfile : user}
    
    let editObjProps = {
            objName    : 'UsersList',
            isPut      : true,
            obj        : user, 
            byId       : usersById,
            currentUser,
            actionType : types.UPDATE_USER_LIST,
            apiUrl : api.updateProfileApi(user.id),
            
    }

    
    const btnsProps   = {...props, editObjProps};
    
    const linkProps:object = {
            linkPath:`/profile/${user.id}/${user['slug']}/`,
            modalIsOpen:props.modalIsOpen || false,
            state:{user},
    };

    return (
        <BrowserRouter>
        <div className="user-list-box">
            <div className="user-list-contents">
                <div className="user-list-img-box">
                    <div className="user-list-img">
                        <LinkButton {...linkProps}>
                            <img  src={`${profile_picture}`}
                                  alt=""
                                 className="user-list-photo"/> 
                        </LinkButton>
                    </div>
                </div> 

                <div className="user-list-credentials-box">
                    <ul className="user-list-credentials-contents">
                        <li className="user-list-name">
                            <LinkButton {...linkProps}>
                                <span>
                                    {user.first_name} { user.last_name }
                                </span> 
                            </LinkButton>
                        </li>

                        <li className="user-list-credentials">
                            { user.profile.credential }
                        </li>
                    </ul>

                </div>

                <div className="user-list-follow-box" >
                    <div className="user-list-follow-btn-box">
                        <FollowUserBtn {...btnsProps}/>
                    </div>
                </div>

            </div>
        </div>
        </BrowserRouter>
    );
   
};



export const UserFollowings = props => {
    let userProfile = props.userProfile;
    userProfile    = userProfile.user;

    let usersById   = `userFollowings${userProfile.id}`;
    let users       = props.entities.users[usersById];
    let userListProps = {...props, usersById};

    return (
      <div>
         { users?
            <div>
               { users.userList.length === 0?
                 <p>No Followings Yet</p>
                 : 
                 <div>
                     <div className="number-answers-box">
                        { users.userList.length > 1? 
                            <p className="items-count">
                               {users.userList.length}  Followings</p>
                            :
                            <p className="items-count">
                               {users.userList.length} Following
                            </p>
                        }
                     </div> 
                     <UserList {...userListProps }/>
                  </div>
               }
            </div>
            :
            ""   
         }  
      </div>
   
   );
};



export const UserFollowers = props => {
    let userProfile = props.userProfile;
    userProfile    = userProfile.user;

    let usersById   = `userFollowers${userProfile.id}`
    let users       = props.entities.users[usersById];
    let userListProps     = {...props, ...{ usersById }}
  
    return (
        <div>
            { users?
               <div>
                    { users.userList.length === 0?
                        <p>No Followers Yet</p>
                        :
                        <div>
                            <div className="number-answers-box">
                                { users.userList.length > 1? 
                                    <p className="items-count">
                                       {users.userList.length}  Followings</p>
                                    :
                                    <p className="items-count">
                                        {users.userList.length} Following
                                    </p>
                                }
                            </div> 
                            <UserList {...userListProps}/>
                        </div>
                    }
                </div>
                :
                null
            }
        </div>
    );
};
 
export  const userProfileItemsParams = {
    
        answers(user:object){
            return {
                component : UserAnswers,
                byId      : `userAnswers${user['id']}`,
                data      :  user['answers'],
                itemsType : 'Answers',
            }
        },
      
        questions(user:object){
            return{
                component : UserQuestions,
                byId      : `userQuestions${user['id']}`,
                data      :  user['questions'], 
                itemsType : 'Questions',
            }
        },

        posts(user:object){
            return {
                component : UserPosts,
                byId      : `userPosts${user['id']}`,
                data      :  user['posts'],
                itemsType : 'Posts',
            }
        },
   
        followers(user:object){
            return {
                component : UserFollowers,
                byId      : `usersFollowers${user['id']}`,
                data      :  user['followers'],
                itemsType : 'Followers'
            }
        },


        followings(user:object) {
            return {
                component :  UserFollowings,
                byId      :  `userFollowings${user['id']}`,
                data      :  user['followings'],
                itemsType :  'Followings'
            }
        },

}


export const UserActivitiesBtns = props => {
    const itemsParams = userProfileItemsParams;
    let userProfile = props.userProfile;
    userProfile = userProfile.user;

    
    let totalAnswers    = userProfile?.answers?.length || 0;
    let totalQuestions  = userProfile?.questions?.length || 0;
    let totalPosts      = userProfile?.posts?.length || 0;
    let totalFollowers  = userProfile?.followers?.length || 0;
    let totalFollowings = userProfile?.followings?.length || 0;

    let {answersBtnStyles,
        questionsBtnStyles,
        postsBtnStyles,
        followersBtnStyles,
        followingsBtnStyles} = props.userItemsStyles && props.userItemsStyles;
        
    return (
        <div className="user-activities">
            <div style={answersBtnStyles} className="user-activities-btn-box">
            <button type="button" 
                    onClick={()=> props.showUserItems(itemsParams.answers(userProfile))} 
                    className="btn-sm activities user-answers" >
                {totalAnswers} {totalAnswers <= 1? "Answer":"Answers"}
            </button>
            </div>

            <div  style={questionsBtnStyles}className="user-activities-btn-box">
            <button type="button"
                    onClick={() => props.showUserItems(itemsParams.questions(userProfile))} 
                    className="btn-sm activities user-questions" >
                {totalQuestions} {totalQuestions <= 1? "Question":"Questions"}
            </button>

            </div>

            <div style={postsBtnStyles} className="user-activities-btn-box">
            <button type="button" 
                    onClick={() => props.showUserItems(itemsParams.posts(userProfile))} 
                    className="btn-sm activities user-posts">
               {totalPosts} {totalPosts <= 1? "Post":"Posts"}
            </button> 
            </div>

            <div style={followingsBtnStyles} className="user-activities-btn-box">
            <button type="button" 
                    onClick={() => props.showUserItems(itemsParams.followings(userProfile))} 
                    className="btn-sm activities user-following ">
                {totalFollowings} {totalFollowings <= 1? "Following":"Followings"}
            </button>
            </div>

            <div style={followersBtnStyles} className="user-activities-btn-box">
         
            <button type="button"
                    onClick={() => props.showUserItems(itemsParams.followers(userProfile))} 
                    className="btn-sm activities user-followers " >
               {totalFollowers} {totalFollowers <= 1? "Follower":"Followers"}        
            </button>
            </div>

        </div>
    );
};



