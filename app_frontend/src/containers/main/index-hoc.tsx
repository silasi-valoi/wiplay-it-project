import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {handleSubmit, 
        Delete,
        getCurrentUser,
        getPost,
        getUserList,
        getAboutInfo,
        getUserProfile,
        getPostList,
        getQuestion,
        getReplyList,
        getQuestionList,
        getCommentList,
        getIndex, 
        authenticate }  from 'dispatch/index';

import  * as action  from 'actions/actionCreators';
import { closeModals}   from  'containers/modal/helpers';
import NavBarSmallScreen from 'templates/navigations/nav-bar-small';
import NavBarBigScreen from 'templates/navigations/nav-bar-big';
import PartalNavBar from 'templates/navigations/nav-bar-partial';
import { NavBarBottom } from 'templates/navigations/nav-bar-partial';

import {AlertComponent} from 'templates/partials';

import {Modal}   from  "containers/modal/modal-container";

import {store} from 'store/index';
import {history} from "App";
import Apis from 'utils/api';
import {isAuthenticated, isAdmin, getUserFromCache} from 'utils/authService';
import Helper, { IsBookMarked,
                 displayAlertMessage,
                 displaySuccessMessage,
                 displayErrorMessage } from 'utils/helpers';

const helper   = new Helper();


export function MainAppHoc(Component) {

    return class MainApp extends Component {
        private isFullyMounted:boolean = false;
        private subscribe;
        private unsubscribe;


        constructor(props) {
            super(props);

            this.state = {
                currentUser        : {},
                userIsConfirmed    : false, 
                userAuth           : {},
                isAuthenticating   : false,
                cacheEntities      : this._cacheEntities(), 
                isAuthenticated    : this.authenticated(),
                isAdmin            : this.isSuperUser(),
                displayMessage     : false,
                passwordChanged    : false,
                message            : null,
                modalIsOpen        : false,
            };
          
        };

        public get isMounted() {
            return this.isFullyMounted;
        }; 

        public set isMounted(value:boolean) {
            this.isFullyMounted = value;
        }

        isSuperUser =():boolean  => {
            let entities:object = this._cacheEntities();
            let admin:object = entities && entities['admin'];

            return isAdmin(admin)
        };

        authenticated = ():boolean => {
           let entities:object = this._cacheEntities();
           let userAuth:object = entities && entities['userAuth'];

           return isAuthenticated(userAuth);
        };

 
        _GetCurrentUser = ():object =>{
            let entities:object = this._cacheEntities();
            let currentUser:object =  entities && entities['currentUser'];
            currentUser = currentUser && currentUser['user'];
            
            return currentUser;
            
        };

        _userIsConfirmed =(user:object):boolean=>{
            return user && user['is_confirmed'] || false;

        }
 
         _cacheEntities = ():object => {
            return JSON.parse(localStorage.getItem('@@CacheEntities')) || {};
        }



        //static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        // return  dispatch => action.handleError(error);
        //}

      
        //componentDidCatch(error, info) {
         // You can also log the error to an error reporting service
        // console.log(error, info);
        // }
        
        

        static getDerivedStateFromProps(props, state) {
            //console.log(state, props)
            return null
        }
        
        componentWillUnmount() {
            this.unsubscribe();
            this.isMounted = false;
            
        };

        componentDidUpdate(prevProps, nextProps) {
        };
      
                
        componentDidMount() {
            this.isMounted = true;
            this.onStoreUpdate() //Subscribe on store change 
      
            window.onpopstate = (event) => {
                // Everytime a browser back button is hit, 
                // Close modals if any is open 
                
                return closeModals();
            }

            let currentUser = this._GetCurrentUser();

            if (currentUser) {
                let userIsConfirmed:boolean = this._userIsConfirmed(currentUser);
                
                this.setState({currentUser, userIsConfirmed});

                if(!userIsConfirmed){
                    store.dispatch<any>(getCurrentUser(this.authenticated()));
                }

            }else{
                store.dispatch<any>(getCurrentUser(this.authenticated()));
            }
        };
        
        onStoreUpdate = () => {
           
            const onStoreChange = () => {
                if(!this.isMounted) return;
                
                
                let storeUpdate = store.getState();
                var timeStamp = new Date();
                let { entities } = storeUpdate;
                
                let index = entities['index'];
                let userAuth = entities['userAuth']; 
                let currentUser = entities['currentUser']
                let modal = entities['modal'];
                let question = entities['question'];
                let userProfile = entities['userProfile'];
                let message = entities['message'];
                let alertMessage = entities['alertMessage'];
                let errors = entities['errors']

                
                let editorModal      = modal['editor']; 
                let optionsModal     = modal['optionsMenu'];
                let dropImageModal   = modal['dropImage'];
                let userListModal    = modal['userList'];
                let smsCodeFormModal = modal['smsCodeForm']; 
                              
                if (userAuth) {
                    this.handleAuth(userAuth);
                }

                if (errors && errors.error) {
                    
                    if (editorModal && editorModal.modalIsOpen ||
                        dropImageModal && dropImageModal.modalIsOpen){
                        //We avoid handling errors if any of these modal are open

                    }else{
                        this._HandleErrors(errors)
                    }
                }

                this.handleAlertMessage(alertMessage);
                this.handleMessageSuccess(message)
                                
                this.handleCreateSuccess(editorModal);
                this.handleUpdateSuccess(editorModal);
                this.handleUpdateSuccess(dropImageModal);

                currentUser = currentUser &&  currentUser['user'];
                
                if (currentUser) {
                    let userIsConfirmed:boolean = this._userIsConfirmed(currentUser);

                    this.setState({currentUser, userIsConfirmed})
                }
            };
        
            this.unsubscribe = store.subscribe(onStoreChange);

        };

        handleAuth = (userAuth:object) =>{

            if(this.isMounted){
               
                this.handleUserLogin(userAuth);
                this.handleUserLogout(userAuth);
                this.handlePasswordChangeSuccess(userAuth);
                this.handleAccountConfirmation(userAuth);
            }
        };

        _HandleErrors(errors:object){
            if (!errors || !errors['error']) return;
                          
            displayErrorMessage(this, errors['error']);
            delete errors['error'];
        }

        handleAlertMessage(alertMessage:object){

            if (!alertMessage) {
                return;
            }
            
            let message:object = alertMessage['message'];
            
            if (message) {
                displayAlertMessage(this, message);
                delete alertMessage['message'];  
            }      
        }

        handleMessageSuccess =(message:object)=> {
            if (!message) return;

            if (message['messageSent']) {
                delete message['messageSent'];
                displaySuccessMessage(this, message['successMessage'])
            }
        };

        
        handlePasswordChangeSuccess(userAuth:object){
            if (!userAuth['passwordChangeAuth'])return;

            let passwordChangeAuth = userAuth['passwordChangeAuth']
             
                                                      
            if(passwordChangeAuth['successMessage']){
                displaySuccessMessage(this, passwordChangeAuth['successMessage'])
                delete passwordChangeAuth['successMessage'];
        
                let passwordConfirmAuth = {
                        passwordValidated : false,
                        old_password : undefined,
                };

                this.setState({passwordChanged : true,})
                store.dispatch<any>(action.authenticationSuccess({passwordConfirmAuth}));
            }
        };  

        handleCreateSuccess(modal:object){
            if (!modal) return;
            if (!Object.keys(modal).length) return;
                       
            if (modal['created'] === true) {
                delete modal['created'];
                closeModals(true)
                displaySuccessMessage(this, modal['successMessage']);
                let data = modal['data']
                               
                setTimeout(()=> {
                    let {answer,question,post} = data

                    post     && this.handleNewPost(modal);
                    question && this.handleNewQuestion(modal);
                    answer   && this.handleNewAnswer(modal);
                }, 500);
            }

        }

        handleUpdateSuccess(modal:object){
            if (!modal) return;
            if (!Object.keys(modal).length) return;
                                  
            if (modal['updated'] === true) {
                delete modal['updated'];

                closeModals(true)
                displaySuccessMessage(this, modal['successMessage']);

                let data:object = modal['data'];
                            
                if(data['objName']   === 'UserProfile' && data){
                    this.handleUserProfileUpdate(data['user']);
                }
            }
            
        };

        handleUserProfileUpdate(userProfile) {
            userProfile && store.dispatch<any>(action.getCurrentUserPending())
            userProfile && store.dispatch<any>(action.getCurrentUserSuccess(userProfile));

        };

        handleNewQuestion =(params:object)=> {
            let data:object = params['data'];
            let question:object = data && data['question'];

            if (question) {
                let path:string = `/question/${question['slug']}/${question['id']}/`;
                let state:object = {
                    question,
                    recentlyCreated : true
                };
                
                history.push(path, state);
            }
        };

        handleNewPost =(params:object)=> {

            let data:object = params['data'];
            let post:object = data && data['post'];

            if (post) {
                let path:string = `/post/${post['slug']}/${post['id']}/`;
                let state:object = {
                    post, 
                    recentlyCreated : true
                }
                history.push(path, state);
            }
        };

        handleNewAnswer =(params:object)=> {

            let data:object     = params['data'];
            let question:object = params['obj'];
            let answer:object = data && data['answer'];

            if (answer) {
                let path:string =  `/answer/${answer['id']}/`;
                let state:object = {
                    answer, 
                    question,
                    recentlyCreated : true
                };
         
                history.push(path, state);
            }
        };

        clearItemFromStore =()=> {
            //Remove item from cache and store
            let storeUpdate = store.getState();
            let {entities} = storeUpdate;

            let cacheEntities = this._cacheEntities();
                            
            Object.keys(entities).forEach(key => {

                let entitie = entities[key]
                if(key === 'userAuth' || key === 'currentUser'){
                    
                    Object.keys(entitie).forEach(k => {
                        delete cacheEntities[key][k];
                        delete entities[key][k];
                    })
                }
            })
          
            
            localStorage.setItem('@@CacheEntities',JSON.stringify(cacheEntities));

        };
       
        isLoggedOut =(userAuth:object)=>{
            if (!userAuth || !userAuth['loginAuth']) {
                return false;
            }

            let {successMessage} = userAuth && userAuth['loginAuth'];
            return successMessage === 'Successfully logged out.';
        };

        isTokenRefresh =(userAuth:object):boolean =>{
            if (!userAuth) {
                return false;
            }
            const isTokenRefresh:boolean =  userAuth['isTokenRefresh'];
            const error:object = userAuth['error'];

            if (error && isTokenRefresh) return true;
        };
    

        handleUserLogout =(userAuth:object)=> {
            if (!userAuth || !userAuth['loginAuth']) {
                return;
            }
            
            let isLoggedOut:boolean = this.isLoggedOut(userAuth);
            let isTokenRefresh:boolean = this.isTokenRefresh(userAuth);
            let isAuthenticated:boolean = this.state['isAuthenticated'];
           
            if (isLoggedOut && isAuthenticated) {
                this.isMounted && this.setState({isAuthenticated:false});

                let successMessage:string = userAuth['loginAuth'].successMessage;
                displaySuccessMessage(this, successMessage);
 
                closeModals(true);
                
            }

            if (isLoggedOut || isTokenRefresh) {
                this.clearItemFromStore();
            }
        };

        handleUserLogin(userAuth:object){
            if (!userAuth || !userAuth['loginAuth'])return;

            let loginAuth = userAuth['loginAuth'];
            let isLoggedIn:boolean = loginAuth['isLoggedIn']; 
            let isAuthenticated:boolean = this.state['isAuthenticated'];  
            
            if(isLoggedIn && !isAuthenticated){
                this.isMounted && this.setState({isAuthenticated:true})
                closeModals(true);

                this.pushToRouter({linkPath:'/'});
            }
        };

        handleAccountConfirmation =(userAuth:object) => {
            let loginAuth:object = userAuth['loginAuth'];
            let userIsConfirmed:boolean = this.state['userIsConfirmed'];
            if(!loginAuth) return;


            if (loginAuth['isConfirmed']) {
                delete loginAuth['isConfirmed'];
                this.isMounted && this.setState({userIsConfirmed:true})
                closeModals(true);
                                     
                let successMessage:string = 'You successfully confirmed your account';
                displaySuccessMessage(this, successMessage);
            }
        };
   

        loginUser = () => {
            let modalProps =  {
                authenticationType : 'Login',
                modalName : 'authenticationForm',
            };

            return Modal(modalProps);
        };


        logout= () => {
            let apiUrl:string   =  Apis.logoutUser();
            let useToken:boolean = false;
            let formName:string = 'logoutForm';
            this.props.authenticateUser({apiUrl, form:{},formName, useToken})
        };  
       
        pushToRouter(params:object, event?:React.MouseEvent<HTMLAnchorElement>){
            closeModals(true);
            event && event.preventDefault();

            let path:string =  params['linkPath'];
            let state:object = params['state'];
            let location:object = history.location;

            let currentPath = location['pathname'];
        
            if (path && path !== currentPath) {
                setTimeout(()=> {
                    history.push(path, state); 
                }, 500);
            }
        };

        reloadPage(){
            window.location.reload();
        };
     
        editFollowersOrUpVoters = (params:object) =>{
            params['formData'] = this._getFormData(params);
            this.updateObjData(params);
           
        };
       

        updateObjData(params:object){
            let isAuthenticated:boolean = this.state.isAuthenticated;

            if(!isAuthenticated){
                return this.loginUser();    
            }
           
            this.setState({isUpdating:true})
            this.props.submit(params); 
        };

        removeBookmark =(params:object)=>{
            let bookmarkId:number = params && params['obj'].id
            let apiUrl:string;
            
            let objName:string = params['objName'];

            if(objName === 'Answer'){
                apiUrl = Apis.removeAnswerBookMarkApi(bookmarkId);

            }else{
                apiUrl = Apis.removePostBookMarkApi(bookmarkId);
            }

            this.deleteObj({...params, apiUrl});
        };

        deleteObj(params:object){
            let isAuthenticated:boolean = this.state.isAuthenticated;

            if(!isAuthenticated){
                return this.loginUser();    
            }
           
           return store.dispatch<any>(Delete({...params}));
        };

        addBookmark =(params:object)=> {
            
            let bookmarkType:string = params['bookmarkType'];
            let data   = params['obj'];
            let isBookMarked = IsBookMarked(bookmarkType, data)
       
            if (isBookMarked){
                return this.removeBookmark(params)
            }
                     
            params['formData'] = helper.createFormData({data});
            this.props.submit(params);
        };

        _getFormData = (params:object) =>{
            let obj = params['obj'];
            let objName:string = params['objName'];
           
            switch(objName){
                case 'Question':
                    let questionFollowers = obj.followers
                    return helper.createFormData(
                                            {followers : questionFollowers}
                                        );
                   
                case 'UserProfile':
                case 'UsersList':
                    let userFollowers = obj.profile.followers;
                    return helper.createFormData(
                                            {followers:userFollowers}
                                        );
                default:
                    let upvotes  = obj.upvotes; 
                    return helper.createFormData({upvotes});
            }

        };
    
        getProps():object{

            return {
                ...this.props,
                logout                  : this.logout.bind(this),
                loginUser               : this.loginUser.bind(this),
                editFollowersOrUpVoters : this.editFollowersOrUpVoters.bind(this),
                deleteObj               : this.deleteObj.bind(this),
                addBookmark             : this.addBookmark.bind(this),
                reloadPage              : this.reloadPage.bind(this),
                pushToRouter            : this.pushToRouter.bind(this),
                pageName                : Component.pageName(),
                ...this.state,
            };
        };

        render() {
            if(!this.isMounted){
                return null;
            }
          
            let props = this.getProps();
            let alertMessageStyles = props['displayMessage']? { display : 'block'}: { display : 'none' };

            let onModalStyles = props['modalIsOpen']? {opacity:'0.70',}: {opacity:'2',};
                                  
            return (
                <div  className="app-container">
                    <div className="app-box-container">
                        
                        <div className="" style={alertMessageStyles}>
                            <AlertComponent {...props}/>
                        </div>
                        
                        <div>
                            <fieldset style={ onModalStyles } 
                                      disabled={props['modalIsOpen']}>
                                <NavBarSmallScreen  {...props}/>      
                                <PartalNavBar {...props}/>
                                <NavBarBigScreen {...props} />
                                <NavBarBottom {...props}/>
                                
                                <Component {...props}/>                    
                            </fieldset>
                        </div>
                    </div>
                </div> 

            );
        };

    };
};


//binds on `props` change
const mapDispatchToProps = (dispatch, ownProps) => {
   
    return {
        getIndex             : (props)      => dispatch(getIndex(props)), 
        getUserProfile       : (id, apiUrl) => dispatch(getUserProfile(id, apiUrl)),
        getUserList          : (props)      => dispatch(getUserList(props)),
        getQuestionList      : (id)         => dispatch(getQuestionList(id)),
        getPostList          : (id)         => dispatch(getPostList(id)),
        getQuestion          : (id)         => dispatch(getQuestion(id)),
        getPost              : (id:number)  => dispatch(getPost(id)),
        getCommentList       : (byId)    => dispatch(getCommentList(byId)),
        getReplyList         : (props)      => dispatch(getReplyList(props)),
        submit               : (props )     => dispatch(handleSubmit(props)), 
        authenticateUser     : (props)      => dispatch(authenticate(props)),
    };

};




const mapStateToProps = (state, ownProps) => {
   
    return {
        entities      : state.entities,       
    }
};

const composedHoc = compose( connect(mapStateToProps, mapDispatchToProps),  MainAppHoc)


export default  composedHoc;





