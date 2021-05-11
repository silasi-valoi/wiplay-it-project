import React, { Component } from 'react';
import {  Link,Route } from 'react-router-dom';

import {history} from 'App' 

import {ModalManager} from 'containers/modal/modal-container';
import { getUserList, getUserProfile }  from 'dispatch/index'

import {PartalNavigationBar,
        NavigationBarBottom,
        NavigationBarBigScreen } from'templates/navBar';

import  * as action  from 'actions/actionCreators';
import { ProfileComponent, UserAnswers } from 'templates/profile';
import MainAppHoc from "containers/main/index-hoc";
import { UnconfirmedUserWarning, PageErrorComponent } from "templates/partials";
import * as checkType from 'helpers/check-types'; 
import {store} from "store/index";
import GetTimeStamp from 'utils/timeStamp';
import  AjaxLoader from "templates/ajax-loader";






class UserProfileContainer extends Component {
    private isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;


    constructor(props) {
        super(props);
        this.state = {
            userItemsComponent : UserAnswers,
            isProfileBox       : true,
            pageName           : "Profile", 
            profileById        : '',
            usersById          : 'filteredUsers',
            isMouseInside      : false,
            isReloading        : false,
            userItemsStyles    : {}, 
            error              : '', 
        } 

    };
    
    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 
    onProfileUpdate = () =>{
        if (!this.isMounted) return;    
        const onStoreChange = () => {
            
            let { slug, id } = this.props['match'].params;
            let storeUpdate  = store.getState();
            let {entities }  = storeUpdate;
            let profileById  = id? `userProfile${id}`:null;
            let answers      = entities['answers'];

            let userProfile:object = profileById && entities['userProfile'][profileById];
            
            if (userProfile) {
                this.setErrors(userProfile); 

                let user = userProfile['user'];
                answers = answers[`usersAnswers${user?.id}`];
                
                if (!answers) {
                    this._dispatchUserProfileItems(userProfile['user']);
                }

                
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    }
    
    setErrors =(userProfile) => {
        let {isLoading, isUpdating, error} = userProfile;
        if (isUpdating) return

        this.setState({ isReloading : isLoading, error});
        delete userProfile?.error
    }
  

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    componentDidUpdate(prevProps, nextProps){
        if(!this.isMounted) return;

        
        let { slug, id } = this.props['match'].params;
        let profileById  = `userProfile${id}`;
        let {state}      = this;
        let byId         =  state['profileById']; 

        if (byId && byId !== profileById) {
         
            this.setState({profileById });
            this.updateWithCacheData({profileById, id});
            this.updateUsersStore();
        }
    };

    componentDidMount() {
        this.isMounted = true;
        this.onProfileUpdate();
        console.log(this.props)
                
        let entities    = this.props['entities'];
        let { slug, id }           = this.props['match'].params;
        let { users, userProfile}  = entities; 
        let  profileById           = `userProfile${id}`;
        this.setState({profileById, id})
               
        userProfile = userProfile && userProfile[profileById];
        userProfile = userProfile && userProfile.user;
        users       = users['filteredUsers']
        
        !userProfile  && this.updateWithCacheData({profileById, id});
        !users        && this.updateUsersStore();
                     
    };

    updateUsersStore(){
        let cacheEntities = this.props['cacheEntities'];
        let usersById:string = 'filteredUsers';
        let { users }     = cacheEntities && cacheEntities;
        users             = users && users[usersById];

        if (users && users.userList) {
            store.dispatch<any>(action.getUserListPending(usersById))
            store.dispatch<any>(action.getUserListSuccess(usersById, users.userList))
            return

        }

        store.dispatch<any>(getUserList({usersById}))
        return
    }

    updateWithCacheData(params){
        if(!this.isMounted) return;
        let cacheEntities = this.props['cacheEntities'];
        let { profileById, id }      = params;
        let usersById            = this.state['usersById'];
        let { userProfile, users }   = cacheEntities

        userProfile = userProfile && userProfile[profileById];
        console.log(userProfile)
        
        if (userProfile && userProfile.user) {
            let timeStamp      = userProfile.timeStamp;
            const getTimeState = new GetTimeStamp({timeStamp});
            //let menDiff        = parseInt();
            
            if (getTimeState.menutes() >= 2) {
                userProfile = userProfile && userProfile.user;
                                
                store.dispatch<any>(action.getUserProfilePending(profileById));
                store.dispatch<any>(action.getUserProfileSuccess( profileById, userProfile));
                this._dispatchUserProfileItems(userProfile);
                return 
            }
        }
     
       store.dispatch<any>(getUserProfile(id));

    };

    reLoader =()=>{
        if(!this.isMounted) return;

        let id = this.state['id'];   
        this.isMounted && this.setState({isReloading : true, error:undefined})
        return store.dispatch<any>(getUserProfile(id));
    };

    _dispatchUserProfileItems(userProfile){
        if(!this.isMounted) return;
        let answers      = this.props['cacheEntities'].answers;

        if (userProfile && userProfile.answers && userProfile.answers.length) {
            var byId         =`usersAnswers${userProfile.id}`;
            
            var usersAnswers      = userProfile.answers;
            let  answersBtnStyles = this._userActivitesStyle();
            let userItemsStyles   = {answersBtnStyles};
            this.setState({userItemsStyles})

            if (usersAnswers) {

                ///console.log(usersAnswers, answers)
                store.dispatch<any>(action.getAnswerListPending(byId));
                store.dispatch<any>(action.getAnswerListSuccess(byId, usersAnswers));
            }
        }

    }

    _userProfileAnswerParams = (userProfile)=>{
        if (userProfile) {

            return  {
                component      :  UserAnswers,
                byId           : `usersAnswers${userProfile.id}`,
                data           :  userProfile.answers,
                items          : 'isUsersAnswers',
            }  
        }
    }

    _userActivitesStyle = ()=>{
        return {
            borderBottom : '2px solid #A33F0B',
            opacity      : '0.60',
        }
    }

   
    showUserItems(params) {
        if(!this.isMounted) return;

        let {items, component, byId, data } = params;
        this.setState({userItemsComponent : component});

        let userItemsStyles; 

        switch(items){
            case 'isUsersAnswers':
                let  answersBtnStyles = this._userActivitesStyle();
                userItemsStyles       = {answersBtnStyles};
                this.setState({userItemsStyles})

                store.dispatch<any>(action.getAnswerListPending(byId));
                store.dispatch<any>(action.getAnswerListSuccess(byId, data));
                return;


            case 'isUsersQuestions':
                let  questionsBtnStyles = this._userActivitesStyle();
                userItemsStyles         = {questionsBtnStyles};
                this.setState({userItemsStyles})

                store.dispatch<any>(action.getQuestionListPending(byId));
                store.dispatch<any>(action.getQuestionListSuccess(byId, data));
                return;
            
            case 'isUsersPosts':
                let  postsBtnStyles = this._userActivitesStyle();
                userItemsStyles     = {postsBtnStyles};
                this.setState({userItemsStyles})

                store.dispatch<any>(action.getPostListPending(byId));
                store.dispatch<any>(action.getPostListSuccess(byId, data));
                return;
         
            case 'isUsersFollowings':
                let  followingsBtnStyles = this._userActivitesStyle();
                userItemsStyles          = {followingsBtnStyles};
                this.setState({userItemsStyles})
                store.dispatch<any>(action.getUserListPending(byId));
                store.dispatch<any>(action.getUserListSuccess(byId, data));
                return;

            case 'isUsersFollowers':
                let  followersBtnStyles = this._userActivitesStyle();
                userItemsStyles          = {followersBtnStyles};
                this.setState({userItemsStyles})
                store.dispatch<any>(action.getUserListPending(byId));
                store.dispatch<any>(action.getUserListSuccess(byId, data));  
                return;  

            default:
                //console.log(data, items)
                return;  
        };
    };

    mouseEnter = () =>{
        //alert('Mouse is entering')
        this.setState({isMouseInside: true})
    } 


    mouseLeave = ()=>{
        //alert('Mouse is leaving')
        this.setState({isMouseInside : false})
    } 


       

    getProps(){

        return {
            ...this.props,
            showUserItems  : this.showUserItems.bind(this),
            reLoader       : this.reLoader.bind(this),
            redirectToUserProfile : this.props['redirectToRouter'],
            mouseEnter     : this.mouseEnter,
            mouseLeave     : this.mouseLeave,
            ...this.state, 
        };
    };
  

  
    render() {
        let   props = this.getProps();
        var   profileById = props['profileById'];
        const userProfile = props['entities'].userProfile[profileById];
                      
        return (
            <div>
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <NavigationBarBottom {...props}/> 
                { userProfile &&
                    <div  className="app-box-container app-profile-box">
                        <UnconfirmedUserWarning {...props}/> 
                        {userProfile.isLoading &&
                            <div className="page-spin-loader-box partial-page-loader">
                                 <AjaxLoader/>
                            </div>
                        }

                        <PageErrorComponent {...props}/>

                        {!userProfile.isLoading &&
                            <div className="profile-page" id="profile-page">
                                <ProfileComponent {...props}/> 
                            </div>
                        }
                        
                    </div>
                }
            </div>
        );
    };
};




export default MainAppHoc(UserProfileContainer);









