import React from 'react';
import { Link, BrowserRouter } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import * as Icon from 'react-feather';

import {history} from "App" 


import Api from 'utils/api';
import  * as types  from 'actions/types';

import{ QuestionComponent } from "templates/question/question-templates"
import GetTimeStamp from 'utils/timeStamp';

import { PostComponent } from "templates/post/post-templates"
import { GetModalLinkProps } from "templates/component-props";
import { AnswersComponent  } from "templates/answer/answer-templates";

import { OpenEditorBtn,
         OpenOptionlBtn,
         ChangeImageBtn,
         OpenUsersModalBtn,
         UnfollowUserBtn, 
         FollowUserBtn } from "templates/buttons";


const api      = new Api();

export const ProfileComponent = props => {
    let {entities,
        currentUser,
        isAuthenticated,
         profileById} = props;

    let userProfile = entities.userProfile[profileById];
    userProfile     = userProfile?.user;
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

    }

    editObjProps = GetModalLinkProps.props(editObjProps);

    const EditProfileLink = ()=>{
        const pathToEditProfile = userProfile  && 
                 `/edit/profile/${userProfile.slug}/${userProfile.id}/`;
        return(
            <button 
                className="btn-sm edit-user-profile"
                onClick={()=>{
                        history.push(pathToEditProfile, {...editObjProps}); 
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
    

    var followers_text =  profile && profile.followers > 1? 'Followers' : 'Follower';  

    let UnfollowOrFollowUserBtn =  <FollowUserBtn {...btnsProps}/>;
   
    let UserList = MatchMediaHOC(UserProfileFollowingList, '(min-width: 980px)')
      
    const UserItemsComponent = props.userItemsComponent;   
    let  profile_picture = profile && profile.profile_picture || null;
        
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

                                    { profile_picture? 
                                        <img alt=""
                                             src={`${profile_picture}`}
                                             className="profile-image"/>
                                        :
                                        <img 
                                        alt=""
                                        src={require("media/user-image-placeholder.png")} 
                                        className="profile-image"
                                        />
                                    }
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
                        
                                { userProfile?.user_can_edit &&
                                    <div className="edit-credential-btn-box">

                                    <EditorModalBtnBigScreen {...editObjProps}/>
                                    <EditorModalBtnSmallScreen/>
                                    </div>
                                }
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

        let pathToProfile   =  `/profile/${user.id}/${user.slug}/`;
        let profile         = user && user.profile;
        let profile_picture = profile &&  profile.profile_picture;

        let editUserProfileProps = {
            objName    : 'UsersList',
            isPut      : true,
            obj        : user, 
            byId       : usersById,
            currentUser,
        }

        editUserProfileProps = GetModalLinkProps.props(editUserProfileProps);
        let btnsProps   = {...props, editUserProfileProps};
      
        let FollowBtn   = MatchMediaHOC(FollowUserBtn, '(min-width: 980px)');
        //console.log(props)

        return (
            <div className="partial-user-list-box">
                <div className="partial-user-list-contents">
                    <div className="partial-user-list-img-box">
                        <div className="partail-user-list-img user-list-img">
                            { profile_picture? 
                                <img 
                                    onClick={() => history.push(pathToProfile,user)}
                                    src={`${profile_picture}`} alt="" 
                                    className="user-list-photo"/> 
                                :
                                <img alt="" 
                                     onClick={() => props.push({path:pathToProfile,user})}
                                     src={require("media/user-image-placeholder.png")}
                                     className="user-list-photo"/>  
                            }        
                        </div>
                    </div>

                    <div className="user-list-credentials-box">
                        <div className="user-list-credentials-contents">
                            <p onClick={() => props.push({path:pathToProfile, user}) } 
                                  className="partial-user-list-name user-list-name">
                                { user.first_name }   {user.last_name }
                            </p>

                        </div>

                    </div>

                    <div className="user-list-follow-box" >
                        <div className="follow-user-list-box">
                            <FollowBtn {...btnsProps}/>
                        </div>
                    </div>

                </div>
            </div>
        )
};


export const UserList = props => {
    //console.log(props)
    let {entities,users, usersById } = props

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






export const UserfollowersNum = props => {
   return (
      <Link to="" className="num-followers">
         {props.userProfile.profile.followers} Followers
      </Link>
   )
}







export const UserAnswers = props =>{
   var profileById    = props.profileById;
   let userProfile    = props.entities.userProfile[profileById];
   userProfile        = userProfile.user;
   var answerListById = `usersAnswers${userProfile.id}`
   var answers        = props.entities.answers;
   
   var usersAnswers   = answers[answerListById]
   //console.log(props, answers)
   
   return (
        <div>
            { usersAnswers && usersAnswers.answerList?

                <div className="answer-container">
                    <div className="number-answers-box">
                        {usersAnswers.answerList.length === 1? 
                            <p className="items-count">
                               { usersAnswers.answerList.length }  Answer
                            </p>

                            :

                            <p className="items-count">
                              { usersAnswers.answerList.length } Answers
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
                <p>No Answer </p>
            }
        </div>
    )
};




export const UserQuestions = props => {
    var profileById = props.profileById;
    let userProfile = props.entities.userProfile[profileById];
    userProfile    = userProfile.user;

    let  questionListById     = `usersQuestions${userProfile.id}`
    let questions  = props.entities.questions;
    questions      = questions[questionListById]
    let questionList = questions && questions.questionList;  
    console.log(questionList,  props)
    
    return (
        <div>
            {questions &&
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
   var profileById = props.profileById;
   let userProfile = props.entities.userProfile[profileById];
   userProfile    = userProfile.user;

   var postListById     = `usersPosts${userProfile.id}`;
   var posts  = props.entities.posts;
   posts      = posts && posts[postListById]
   
   return(
        <div>
            {posts &&

                <div className="post-container">
                    <div className="number-post-box">
                        {posts.postList.length > 1? 
                            <p className="items-count">{posts.postList.length } Posts</p>
                            :
                            <p className="items-count">{posts.postList.length } Post</p>
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
                <p>No Post </p>
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
    
    let editUserProfileProps = {
            objName    : 'UsersList',
            isPut      : true,
            obj        : user, 
            byId       : usersById,
            currentUser,
            
    }

    editUserProfileProps = GetModalLinkProps.props(editUserProfileProps);
    var btnsProps   = {...props, editUserProfileProps};
      
    let FollowBtn   = MatchMediaHOC(FollowUserBtn, '(min-width: 980px)');
      

    return (
        <BrowserRouter>
        <div className="user-list-box">
            <div className="user-list-contents">
                <div className="user-list-img-box">
                    <div className="user-list-img">
                        <div  onClick={() => 
                              redirectToUserProfile({path:pathToProfile,state})}>  
                            { user && profile_picture? 
                                <img  src={`${profile_picture}`}
                                      alt=""
                                      className="user-list-photo"/> 
                                :
                                <img alt=""
                                     src={require("media/user-image-placeholder.png")}
                                     className="user-list-photo"/>  
            
                            }        
                        </div>
                    </div>
                </div> 

                <div className="user-list-credentials-box">
                    <ul className="user-list-credentials-contents">
                        <li onClick={() => 
                             redirectToUserProfile({path:pathToProfile,state})}
                           className="user-list-name">
                            { user.first_name }   {user.last_name }
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
   var profileById = props.profileById;
   let userProfile = props.entities.userProfile[profileById];
   userProfile    = userProfile.user;

   var usersById   = `usersFollowings${userProfile.id}`;
   var users       = props.entities.users[usersById];
   //console.log(users,usersById, props.entyties)
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
    var profileById = props.profileById;
    let userProfile = props.entities.userProfile[profileById];
    userProfile    = userProfile.user;

    var usersById   = `usersFollowers${userProfile.id}`
    var users       = props.entities.users[usersById];
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


export const UserActivitiesBtns = props => {
    var profileById = props.profileById;
    var userProfile = props.entities.userProfile[profileById];
    var userProfile = userProfile.user;

    //console.log(userProfile)

    var usersAnswers = {
      component      : UserAnswers,
      byId           : userProfile && `usersAnswers${userProfile.id}`,
      data           :  userProfile.answers,
      items          : 'isUsersAnswers',

    }
   
    var usersQuestions = {
      component        : UserQuestions,
      byId             : `usersQuestions${userProfile.id}`,
      data             :  userProfile.questions, 
      items            : 'isUsersQuestions',
     }

    var usersPosts = {
      component      : UserPosts,
      byId           : `usersPosts${userProfile.id}`,
      data           :  userProfile.posts,
      items          : 'isUsersPosts',
    }
   
    var usersFollowers = {
      component          : UserFollowers,
      byId               : `usersFollowers${userProfile.id}`,
      data               :  userProfile.followers,
      items              : 'isUsersFollowers'
    }


    var usersFollowings = {
      component           :  UserFollowings,
      byId                :  `usersFollowings${userProfile.id}`,
      data                :  userProfile.followings,
      items               :  'isUsersFollowings'
    }

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
        
    //console.log(answersBtnStyles, props)
    return (
        <div className="user-activities">
            <div style={answersBtnStyles} className="user-activities-btn-box">
            <button type="button" onClick={() => props.showUserItems(usersAnswers)} 
                             className="btn-sm activities user-answers" >
                { totalAnswers } {totalAnswers <= 1? "Answer":"Answers"}
            </button>
            </div>

            <div  style={questionsBtnStyles}className="user-activities-btn-box">
            <button type="button" onClick={() => props.showUserItems(usersQuestions)} 
                        className="btn-sm activities user-questions" >
                { totalQuestions } {totalQuestions <= 1? "Question":"Questions"}
            </button>

            </div>

            <div style={postsBtnStyles} className="user-activities-btn-box">
            <button type="button" onClick={() => props.showUserItems(usersPosts)} 
                               className="btn-sm activities user-posts">
               { totalPosts } {totalPosts <= 1? "Post":"Posts"}
            </button> 
            </div>

            <div style={followingsBtnStyles} className="user-activities-btn-box">
            <button type="button" onClick={() => props.showUserItems(usersFollowings)} 
                            className="btn-sm activities user-following ">
                { totalFollowings } {totalFollowings <= 1? "Following":"Followings"}
            </button>
            </div>

            <div style={followersBtnStyles} className="user-activities-btn-box">
         
            <button type="button" onClick={() => props.showUserItems(usersFollowers)} 
                            className="btn-sm activities user-followers " >
               { totalFollowers } {totalFollowers <= 1? "Follower":"Followers"}        
            </button>
            </div>

        </div>
    );
};






export const UserComponentSmall = props => {
    let {obj, currentUser} = props;
    let author = obj.author;
    let pathToProfile =  `/profile/${author.id}/${author.slug}/`;
    let state = {currentUser, userProfile:author}
    let currentdate = new Date();

    let timeCreated = obj && new Date(obj.date_created);
    let timeStamp = timeCreated && timeCreated.getTime();

    const getTimeState = new GetTimeStamp({timeStamp});
    let menDiff        = parseInt(getTimeState.menutes());
    let hourDiff       = parseInt(getTimeState.hours());
    let dayDiff        = parseInt(getTimeState.days());
    let weekDiff       = parseInt(getTimeState.weeks());
    

    let dateCreated;
    let dateOptions;

    const getLocaleDateString=(dateOptions)=>{
       return timeCreated.toLocaleDateString('en-GB', dateOptions)
    }

    let month = getLocaleDateString({'month':'short'}) 
    let day   = getLocaleDateString({day : 'numeric'})
    let year  = getLocaleDateString({year : 'numeric'})

    if (menDiff <= 59) {
        dateCreated = `${menDiff} menutes ago`

    }else if(hourDiff <= 23){
        dateCreated = `${hourDiff} hours ago`
        
    }else if(dayDiff <= 6){
        dateOptions = {'weekday':'short'}
        dateCreated = getLocaleDateString(dateOptions)

    }else{
        let yearCreated = timeCreated.getFullYear();
        let currentYear = currentdate.getFullYear()
        

        if (yearCreated === currentYear) {
            dateCreated = month + ' ' + day; 
        }else{
            dateCreated =  month + ' ' + day + ', ' + year;

        }
    }

    //console.log(created_at)

    return (
        <div className="author-box">
            <ul className="author-img-box" >
                <li className="author-img  img-container-sm">
                    <Link  to={ {pathname: pathToProfile,state}}>

                        {author?.profile?.profile_picture === null?
                            <img alt="" src={require("media/user-image-placeholder.png")}
                             className="profile-photo"/>
             
                            :  
                            <img alt="" src={author?.profile?.profile_picture}
                                   className="profile-photo"/> 
                        }
                    </Link>
                </li>
            </ul>

            <ul className="author-properties-box">
                <li className="author-name-box">
                    <Link className="author-name" to={ {pathname: pathToProfile,state}}>
                        {author?.first_name} {author?.last_name}
                    </Link>
                </li>
                <li className="time-created">{dateCreated}</li>
            </ul>
        </div>
    );
}; 








