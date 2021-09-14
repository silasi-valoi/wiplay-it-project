import React, { Component } from 'react';
import {  Link,Route } from 'react-router-dom';

import {history} from 'App' 

import {ModalManager} from 'containers/modal/modal-container';
import { getUserList, getUserProfile }  from 'dispatch/index'

import {PartalNavigationBar,
        NavigationBarBottom,
        NavigationBarBigScreen } from'templates/navBar';

import  * as action  from 'actions/actionCreators';
import {ProfileComponent, UserAnswers, userProfileItemsParams} from 'templates/profile';
import MainAppHoc from "containers/main/index-hoc";
import {UnconfirmedUserWarning, PageErrorComponent} from "templates/partials";
import * as checkType from 'helpers/check-types'; 
import {store} from "store/index";
import GetTimeStamp from 'utils/timeStamp';
import {cacheExpired} from 'utils/helpers';
import Apis from 'utils/api';
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

            let userProfile:object =  entities['userProfile'];
            
            if (userProfile) {
                userProfile = userProfile[profileById];

                userProfile && this.setErrors(userProfile); 
                userProfile && this.setState({userProfile});

                let user:object = userProfile && userProfile['user'];
                if (user && !userProfile['answersDispatched']) {
                    userProfile['answersDispatched'] = true;

                    const itemsparams = userProfileItemsParams.answers(user)
                    this.showUserItems(itemsparams)
                }
                              
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    }
    
    setErrors =(userProfile:object) => {
       
        let isLoading:boolean  = userProfile['isLoading'];
        let isUpdating:boolean = userProfile['isUpdating'];
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
        let pageContents = document.getElementById('page-contents');
        
        if (pageContents) {
            pageContents.style.margin = 'auto';
            pageContents.style.width = 'auto';
                       
        }
        
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
                                
        let entities    = this.props['entities'];
        let {slug, id}  = this.props['match'].params;
        let {users, userProfile}  = entities; 
        let  profileById           = `userProfile${id}`;
        this.setState({profileById, id})
              
        const userProfileCache = this.getUserProfileCache(profileById);
        let _cacheExpired:boolean = cacheExpired(userProfileCache);
        
        if (!_cacheExpired) { 
            this.setState({userProfile : userProfileCache});
          
            const itemsParams = userProfileItemsParams.answers(userProfileCache['user'])
            this.showUserItems(itemsParams)
        } else {
            store.dispatch<any>(getUserProfile(id));
        }

        let userList = users['filteredUsers'];

        if (!userList) {
            this.updateUsersStore();
        }       
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
        
        let apiUrl = Apis.getUserListApi();
        return store.dispatch<any>(getUserList({usersById, apiUrl}))
        
    }
    
    getUserProfileCache(profileById:string){
        let cacheEntities:object = this.props['cacheEntities'];
        let userProfile:object   = cacheEntities && cacheEntities['userProfile'];
        userProfile = userProfile && userProfile[profileById];
        
        return userProfile;

    }

    updateWithCacheData(params:object){
        let profileById = params['profileById'];
        let usersById = this.state['usersById'];
     
        const userProfile = this.getUserProfileCache(profileById);
        let _cacheExpired:boolean = cacheExpired(userProfile);
        console.log(_cacheExpired, userProfile)

        if (!_cacheExpired) { 
            this.setState({userProfile});
                        
        } else {
            let id  = params['id'];
            store.dispatch<any>(getUserProfile(id));
        }
    };

    _userActivitesStyle = ()=>{
        return {
            borderBottom : '2px solid #A33F0B',
            opacity      : '0.60',
        }
    }
   
    showUserItems(params) {
        if(!this.isMounted) return;

        let {itemsType, component, byId, data } = params;
        this.setState({userItemsComponent : component});

        let userItemsStyles; 

        switch(itemsType){
            case 'Answers':
                let  answersBtnStyles = this._userActivitesStyle();
                userItemsStyles       = {answersBtnStyles};
                this.setState({userItemsStyles})

                store.dispatch<any>(action.getAnswerListPending(byId));
                store.dispatch<any>(action.getAnswerListSuccess(byId, data));
                return;


            case 'Questions':
                let  questionsBtnStyles = this._userActivitesStyle();
                userItemsStyles         = {questionsBtnStyles};
                this.setState({userItemsStyles})

                store.dispatch<any>(action.getQuestionListPending(byId));
                store.dispatch<any>(action.getQuestionListSuccess(byId, data));
                return;
            
            case 'Posts':
                let  postsBtnStyles = this._userActivitesStyle();
                userItemsStyles     = {postsBtnStyles};
                this.setState({userItemsStyles})

                store.dispatch<any>(action.getPostListPending(byId));
                store.dispatch<any>(action.getPostListSuccess(byId, data));
                return;
         
            case 'Followings':
                let  followingsBtnStyles = this._userActivitesStyle();
                userItemsStyles          = {followingsBtnStyles};
                this.setState({userItemsStyles})
                store.dispatch<any>(action.getUserListPending(byId));
                store.dispatch<any>(action.getUserListSuccess(byId, data));
                return;

            case 'Followers':
                let  followersBtnStyles = this._userActivitesStyle();
                userItemsStyles          = {followersBtnStyles};
                this.setState({userItemsStyles})
                store.dispatch<any>(action.getUserListPending(byId));
                store.dispatch<any>(action.getUserListSuccess(byId, data));  
                return;  

            default:
                return;  
        };
    };

    reLoader = () =>{
        if(!this.isMounted) return;

        let id = this.state['id'];   
        this.isMounted && this.setState({isReloading : true, error:undefined})
        return store.dispatch<any>(getUserProfile(id));
    };


    mouseEnter = () =>{
        this.setState({isMouseInside: true})
    } 

    mouseLeave = ()=>{
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
        if(!this.isMounted) return null;

        let   props = this.getProps();
        const userProfile = props['userProfile'];

        if (!userProfile) {
            return null;
        }
                             
        return (
            <div>
                <UnconfirmedUserWarning {...props}/>

                <div className="page-contents" id="page-contents">
                    <div className="profile-page" id="profile-page">
                        {userProfile.isLoading &&
                            <div className="page-spin-loader-box partial-page-loader">
                                <AjaxLoader/>
                            </div>
                
                            ||
                
                            <div>
                                <ProfileComponent {...props}/> 
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    };
};




export default MainAppHoc(UserProfileContainer);









