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
        getReplyChildrenList,
        getQuestionList,
        getCommentList,
        getIndex, 
        authenticate }  from 'dispatch/index';

import  * as action  from 'actions/actionCreators';
import { closeModals}   from  '../modal/helpers';
import {NavigationBarBottom} from 'templates/navBar';
import { AlertComponent } from 'templates/partials';
import * as checkType from 'helpers/check-types'; 

import {store} from 'store/index';
import {history} from "App";
import GetTimeStamp from 'utils/timeStamp';
import Api from 'utils/api';
import {isAuthenticated, isAdmin, getUserFromCache} from 'utils/authService';
import Helper, { IsBookMarked,
                 displaySuccessMessage,
                 displayErrorMessage } from 'utils/helpers';



const api      = new Api();
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
                cacheEntities      : this._cacheEntities(), 
                isAuthenticated    : isAuthenticated(),
                isAutheticanting   : true,
                isAdmin            : isAdmin(),
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
 
        _SetCurrentUser =(currentUser=undefined)=>{
            if(!this.isMounted) return;
                            
            if (!currentUser) {
                currentUser = getUserFromCache();
            }

            const userIsConfirmed:boolean = currentUser && 
                                            currentUser.is_confirmed || false;
                       
            this.setState({currentUser, userIsConfirmed})

            return currentUser;  
        };

        _cacheEntities = ()=>{
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
            
        }

        componentDidUpdate(prevProps, nextProps) {
        }
                
        componentDidMount() {
            this.isMounted = true;
            this.onStoreUpdate() //Subscribe on store change 
             
            let { entities } = this.props;
            
            window.onpopstate = (event) => {
                closeModals();
            }

            window.addEventListener("beforeunload",(event)=>{
                let { modal } = entities;
        
            });

           
            let currentUser = this._SetCurrentUser();
                              
            if (!currentUser) {
                store.dispatch<any>(getCurrentUser());
            }
        }
        
        onStoreUpdate = () => {
            if (!this.isMounted) return;

            const onStoreChange = () => {
                
                
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

                if (errors.error) {
                    console.log(errors)
                    if (editorModal && editorModal.modalIsOpen ||
                        dropImageModal && dropImageModal.modalIsOpen){
                        //We avoid handling errors if any of these modal are open

                    }else{
                        this._HandleErrors(errors)
                    }
                }

                this.handleMessageSuccess(message)
                //displayAlertMessage(this, alertMessage)
                
                this.handleCreateSuccess(editorModal);
                this.handleUpdateSuccess(editorModal);
                this.handleUpdateSuccess(dropImageModal);
                
                if (currentUser && currentUser.user) {
                    this._SetCurrentUser(currentUser.user)
                }
                                
            };
        
            this.unsubscribe = store.subscribe(onStoreChange);

        };

        handleAuth = (userAuth:object) =>{
            this.setState({userAuth});  
            this.confirmLogout(userAuth);
            this.confirmLogin(userAuth);
            this.handlePasswordChangeSuccess(userAuth);
        };

        _HandleErrors(errors:object){
            if (!errors || !errors['error']) return;
              
            displayErrorMessage(this, errors['error']);
            delete errors['error'];
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
                this.closeModal(modal)
                displaySuccessMessage(this, modal['successMessage']);
                let data = modal['data']
                               
                setTimeout(()=> {
                    let {answer,question,post} = data

                    post     && this.handleNewPost(modal);
                    question && this.handleNewQuestion(modal);
                    answer   && this.handleNewAnswer(modal);
                }, 100);
            }

        }

        handleUpdateSuccess(modal){
            if (!modal) return;
            if (!Object.keys(modal).length) return;
                       
            if (modal.updated === true) {
                delete modal.updated;
                this.closeModal(modal)
                displaySuccessMessage(this, modal.successMessage);
                let {data, objName, modalName} = modal;
                             
                objName   === 'UserProfile'  && this.handleUserProfileUpdate(data.user);
            }
            
        };

        handleUserProfileUpdate(userProfile) {
            userProfile && store.dispatch<any>(action.getCurrentUserPending())
            userProfile && store.dispatch<any>(action.getCurrentUserSuccess(userProfile));

        };

        handleNewQuestion =(params)=> {
            let data = params.data;
            let { question } = data
            let path   = question && `/question/${question.slug}/${question.id}/`;
            let state : {question, recentlyCreated : true}
         
            question && history.push(path, state);
        };

        handleNewPost =(params:object)=> {
            let data       = params['data'];
            let {post}     = data
            let path   = post && `/post/${post.title}/${post.id}/`;
            let state : {post, recentlyCreated : true}
         
            post && history.push(path, state);

        };

        handleNewAnswer =(params:object)=> {
            let data     = params['data'];
            let question = params['obj'];
            let {answer} = data;
            let path   = answer && `/answer/${answer.id}/`;
            let state : {answer, question, recentlyCreated : true}
         
            answer && history.push(path, state);
        };

        clearItemFromStore =(item)=> {
            //Remove item from cache and store
            let storeUpdate = store.getState();
            let { entities } = storeUpdate;

            let cacheEntities = this._cacheEntities();
                            
            Object.keys(entities).forEach(key => {
                let entitie = entities[key]
                                            
                Object.keys(entitie).forEach(k => {

                    if (k === item && entities[key][k]) {
                        delete cacheEntities[key][k];
                        delete entities[key][k];
                    }
                })
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

        confirmLogin =( userAuth:object) => {
            let loginAuth:object = userAuth['loginAuth'];
            if (loginAuth && loginAuth['isLoggedIn']) {
                this.setState({isAuthenticated:true})
            }

            if (loginAuth && loginAuth['isConfirmed']) {
                delete loginAuth['isConfirmed']
                closeModals(true);

                let textMessage = 'You successfully confirmed your account'
                let message = {textMessage, messageType:'success'}
                this.displayAlertMessage(message)
            }
        }

        confirmLogout =(userAuth:object)=> {

            let isLoggedOut:boolean    = this.isLoggedOut(userAuth);
            let isTokenRefresh:boolean = this.isTokenRefresh(userAuth);

            if (isLoggedOut || isTokenRefresh) {
                this.clearItemFromStore("user");
            }

            if (isLoggedOut) {
                this.setState({isAuthenticated:false});
                closeModals(true);
            }
                        
        };

        loginUser = () => {
            history.push('/user/registration');
        };

        logout= () => {
            let apiUrl:string   =  api.logoutUser();
            let useToken:boolean = false;
            let formName:string = 'logoutForm';
            this.props.authenticateUser({apiUrl, form:{},formName, useToken})
        };  
       
        pushToRouter(params:object, event?:React.MouseEvent<HTMLAnchorElement>){
            console.log(params)
            event && event.preventDefault();

            let path:string =  params['linkPath'];
            let state:object = params['state'];
            let location:object = history.location;

            let currentPath = location['pathname'];

            if (path && path !== currentPath) {
                history.push(path, state);
            }
        };

        reloadPage(){
            console.log(this.props,window.location, 'Im reloading this page')
            window.location.reload();
        }
     
        editfollowersOrUpVoters = (params:object) =>{
            console.log(params)
            this.setState({isUpdating:true})
            params = this._getFormData(params);
            this.props.submit(params); 
        }

        removeAnswerBookmark =(params:object)=>{
            let obj:object = params['obj']
            let apiUrl = api.removeAnswerBookMarkApi(obj['id']);
            store.dispatch<any>(Delete({...params, apiUrl}))
        }

        addBookmark =(params:object)=> {
            console.log(params)
            
            let isBookMarked = IsBookMarked('answers', params['obj'])
            console.log(isBookMarked)
            if (isBookMarked){
                return this.removeAnswerBookmark(params)
            }
            
            var data   = params['obj']
            params['formData'] = helper.createFormData({data});
            this.props.submit(params);
        }

        _getFormData = (params:object) =>{
           
            let obj = params['obj'];

            let objName:string = params['objName'];

            switch(objName){
                case 'Question':
                case 'UserProfile':
                case 'UsersList':
                    var followers = obj.followers || obj.profile && obj.profile.followers;
                    params['formData'] = helper.createFormData({ followers });
                    return params;

                default:
                    var upvotes       = obj.upvotes; 
                    params['formData'] = helper.createFormData({upvotes});
                    return params; 
            }

        };
    
        getProps():object{

            return {
                ...this.props,
                logout                  : this.logout.bind(this),
                loginUser               : this.loginUser.bind(this),
                editfollowersOrUpVoters : this.editfollowersOrUpVoters.bind(this),
                addBookmark             : this.addBookmark.bind(this),
                reloadPage              : this.reloadPage.bind(this),
                pushToRouter            : this.pushToRouter.bind(this),
                ...this.state,
            };
        };

        onBeforeUnload =()=>{
            console.log('Component is unloading')
        };
  

        render() {
            if(!this.isMounted) return null;
            const feather = require('feather-icons')

            let props = this.getProps();
            let {userAuth} = props['entities'];
            

            let alertMessageStyles = props['displayMessage']?{ display : 'block'}:
                                                          { display : 'none' };

            let onModalStyles = props['modalIsOpen'] ? {opacity:'0.70',} :
                                                    {opacity:'2',};
                      
            return (
                <div  className="app-container">
                    <fieldset style={ onModalStyles } 
                              disabled={ props['modalIsOpen'] } >
                        
                       <Component {...props}/>                    

                    </fieldset>

                    <div style={alertMessageStyles}>
                       <AlertComponent {...props}/>
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
        getPost              : (id)         => dispatch(getPost(id)),
        getCommentList       : (comment)    => dispatch(getCommentList(comment)),
        getReplyList         : (props)      => dispatch(getReplyList(props)),
        getReplyChildrenList : (reply)      => dispatch(getReplyChildrenList(reply)),
        submit               : (props )     => dispatch(handleSubmit(props)), 
        authenticateUser     : (props)      => dispatch(authenticate(props)),
        
   }

};




const mapStateToProps = (state, ownProps) => {
   
    return {
        entities      : state.entities,       
    }
};

const composedHoc = compose( connect(mapStateToProps, mapDispatchToProps),  MainAppHoc)


export default  composedHoc;





