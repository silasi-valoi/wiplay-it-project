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
import {cacheExpired} from 'utils/helpers';
import Api from 'utils/api';
import  AjaxLoader from "templates/ajax-loader";



const api = new Api();


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
            userProfile        : undefined,
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
            
            let {slug, id} = this.props['match'].params;
            let storeUpdate  = store.getState();
            let {entities}  = storeUpdate;
            let profileById  = id? `userProfile${id}`:null;
            let answers      = entities['answers'];

            let userProfile:object = profileById && entities['userProfile'][profileById];
            
            if (userProfile) {
                this.setErrors(userProfile); 
                
                this.setState({userProfile})
                this._dispatchUserProfileAnswers(userProfile['user']);
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    }
    
    setErrors =(userProfile:object) => {
        let isLoading:boolean = userProfile['isLoading'];
        let isUpdating:boolean =userProfile['isUpdating'];
        let error:string = userProfile['error'];

        if (isUpdating) return
        this.setState({ isReloading : isLoading, error});
        delete userProfile['error']
    }
  

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    componentDidUpdate(prevProps, nextProps){
        if(!this.isMounted) return;
        
        let {slug, id} = this.props['match'].params;
        let profileById  = `userProfile${id}`;
        let {state}      = this;
        let byId         =  state['profileById']; 

        if (byId && byId !== profileById) {
                    
            this.setState({profileById});
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
        let {users, userProfile}  = entities; 
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
        
        let apiUrl = api.getUserListApi();
        return store.dispatch<any>(getUserList({usersById, apiUrl}))
        
    }
    
    getUserProfileCache(profileById:string){
        let cacheEntities = this.props['cacheEntities'];
        let {userProfile, users}   = cacheEntities;
        return userProfile[profileById]

    }

    updateWithCacheData(params:object){
        let profileById = params['profileById'];
        let usersById = this.state['usersById'];
     
        const userProfile = this.getUserProfileCache(profileById);
        let _cacheExpired:boolean = cacheExpired(userProfile);

        if (!_cacheExpired) { 
            this.setState({userProfile});
            this._dispatchUserProfileAnswers(userProfile.user);
            
        } else {
            let id  = params['id'];
            store.dispatch<any>(getUserProfile(id));
        }
    };

    _dispatchUserProfileAnswers(userProfile){
        let userAnswers = userProfile && userProfile['answers'];
        
        if (userAnswers && userAnswers.length) {
            var byId =`usersAnswers${userProfile.id}`;
            let entities = this.props['entities'];
            let answers  = entities.answers[byId];
            let _cacheExpired:boolean = cacheExpired(answers);

            if (!answers && !_cacheExpired) {
                
                let  answersBtnStyles = this._userActivitesStyle();
                let userItemsStyles   = {answersBtnStyles};
                this.setState({userItemsStyles})

                ///console.log(usersAnswers, answers)
                store.dispatch<any>(action.getAnswerListPending(byId));
                store.dispatch<any>(action.getAnswerListSuccess(byId, userAnswers));
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

    reLoader =()=>{
        if(!this.isMounted) return;

        let id = this.state['id'];   
        this.isMounted && this.setState({isReloading : true, error:undefined})
        return store.dispatch<any>(getUserProfile(id));
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
        const userProfile = props['userProfile'];
                      
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
                            ||
                            <div className="profile-page" id="profile-page">
                                <ProfileComponent {...props}/> 
                            </div>
                        }

                        <PageErrorComponent {...props}/>
                    </div>
                }
            </div>
        );
    };
};




export default MainAppHoc(UserProfileContainer);









