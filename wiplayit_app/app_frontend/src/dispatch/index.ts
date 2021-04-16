
 
import Api from 'utils/api';
import Axios from 'utils/axios_instance';
import * as action  from 'actions/actionCreators';
import * as checkType from 'helpers/check-types'; 
import {GetLoggedInUser } from 'utils/helpers';
import {history} from 'App';

const api = new Api();
const timeStamp = new Date();

export const _GetApi =(useToken:boolean, opts?:object) =>{
    const axios     = new Axios({useToken, ...opts});
    return axios.instance()

} 


export function sendMessage(params:object):Function {
    let useToken = false;
    let opts = {}
    const Api    = _GetApi(useToken,{timeout:120000});
    
    if(!Api){
        console.log(!Api)
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }
    
    const apiUrl:string = params['apiUrl'];;
    const formData:object = params['formData'];   
    
    return dispatch => {
        dispatch(action.sendMessagePending());

        Api.post(apiUrl, formData)
            .then(response => {
                console.log(response)  
                dispatch(action.sendMessageSuccess(response.data)); 
            })
            .catch(error => {
                            
                if (error.response) {
                    error = error.response.data;
                    console.log(error)
                    dispatch(action.sendMessageError(error));

                }else if(error.request){
                    console.log(error.request)
                    error = 'Looks like you lost connection, please try again.';
                    dispatch(action.handleError(error));
                    dispatch(action.sendMessageError(error));

                }else{
                    console.log(error)
                    error = 'Something wrong happened.';
                    dispatch(action.handleError(error));
                }
            })
                
    }
};


export function getAboutInfo(options?:object) {
    let useToken = false
    const Api    = _GetApi(useToken);

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let apiUrl = api.getAboutInfoApi(); 
    
    return dispatch => {
        dispatch(action.getAboutInfoPending());

        Api.get(apiUrl)
            .then(response => {
                console.log(response)  
                dispatch(action.getAboutInfoSuccess(response.data)); 
            })
            .catch(error => {
            
                if (error.response) {
                    error = error.response.data;
                    console.log(error)
                    dispatch(action.getAboutInfoError(error.detail));

                }else if(error.request){
                    error = 'Something wrong happened.';
                    dispatch(action.getAboutInfoError(error));

                }else{
                    dispatch(action.handleError());
                }
            })
                
    }
};


export function getIndex(options?:object):Function {
    let useToken=false;
    const Api  = _GetApi(useToken, {requestFor:'index'});

    
    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let apiUrl = api.getIndexApi(); 
    
    return dispatch => {

        dispatch(action.getIndexPending());

        Api.get(apiUrl)
            .then(response => {
                dispatch(action.getIndexSuccess(response.data)); 
            })
            .catch(error => {
                                
                if (error.response) {
                    error = error.response.data;
                    console.log(error)
                    dispatch(action.getIndexError(error.detail));

                }else if(error.request){
                    console.log(error.request)
                    error = 'Something wrong happened.';
                    dispatch(action.getIndexError(error));

                }else{
                    console.log(error)
                    dispatch(action.handleError());
                }
           }); 
        
    };
};




export function getUserList(props) {
    let useToken=true
    const Api  = _GetApi(useToken);

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let { apiUrl, usersById } = props;
    apiUrl = !apiUrl && api.getUserListApi() || apiUrl; 

    return dispatch => {

        dispatch(action.getUserListPending(usersById))

	    Api.get(apiUrl)
        .then(response => dispatch(action.getUserListSuccess(usersById, response.data)))
        .catch(error => {

            console.log(error)
            if (error.response) {
                error = error.response.data;
                dispatch(action.getUserListError(usersById, error.detail));

            }else if(error.request){
                error = 'Something wrong happened.';
                dispatch(action.getUserListError(usersById, error));

            }else{
                dispatch(action.handleError());
            }
        }); 
    };
};



export function getQuestionList(questionListById) {
    let useToken=true
    const Api  = _GetApi(useToken);  
    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let apiUrl     = api.getQuestionListApi(); 

    return dispatch => {
      dispatch(action.getQuestionListPending(questionListById))
	   Api.get(apiUrl)
      .then(response => dispatch(action.getQuestionListSuccess(questionListById, response.data)))
      .catch(error => {
            console.log(error)
      	    if (error.response) {
                error = error.response.data;
                dispatch(action.getQuestionListError(questionListById, error.detail));

            }else if(error.request){
                error = 'Something wrong happened.';
                dispatch(action.getQuestionListError(questionListById, error));

            }else{
                dispatch(action.handleError());
            }
      }); 
   };
};




export function getPostList(postListById) {

    let useToken=true
    const Api  = _GetApi(useToken);  

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let   apiUrl  = api.getPostListApi();

    return dispatch => {
        dispatch(action.getPostListPending(postListById))
	    Api.get(apiUrl)
        .then(response => dispatch(action.getPostListSuccess(postListById, response.data)))
        .catch(error => {
      	   
            if (error.response) {
                error = error.response.data;
                dispatch(action.getPostListError(postListById, error.detail));

            }else if(error.request){
                error = 'Something wrong happened.';
                dispatch(action.getPostListError(postListById, error));

            }else{
                dispatch(action.handleError());
            }
      }); 
   };
};



export function getQuestion(id) {
    let useToken=true
    const Api  = _GetApi(useToken); 

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    } 
      
    let apiUrl = api.getQuestionApi(id);
    let questionById = `question${id}`;

    return dispatch => {
        dispatch(action.getQuestionPending(questionById))
	    Api.get(apiUrl)
            .then(response =>{
                dispatch(action.getQuestionSuccess( questionById, response.data))

            })
            .catch(error => {
                console.log(error)
                if (error.response) {
                    error = error.response.data;
                    dispatch(action.getQuestionError( questionById, error.detail));

                }else if(error.request){
                    error = 'Something wrong happened.';
                    dispatch(action.getQuestionError(questionById, error));

                }else{
                    dispatch(action.handleError());
                }
            })
    }
};



export function getPost(id) {
    let useToken=true
    const Api  = _GetApi(useToken);  

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let apiUrl     = id && api.getPostApi(id);
    let postById   = id && `post${id}`

    return dispatch => {
        dispatch(action.getPostPending(postById))

	    Api.get(apiUrl)
       .then(response =>{
        console.log(response)
            dispatch(action.getPostSuccess(postById, response.data));
        })
       .catch(error => {
            console.log(error)
            if (error.response) {
                error = error.response.data;
                dispatch(action.getPostError(postById ,error.detail));

            }else if(error.request){
                error = 'Something wrong happened.';
                dispatch(action.getPostError(postById ,error));

            }else{
                dispatch(action.handleError());
            }
        }) 
   };
};




export function getUserProfile(id:number, apiUrl?:string) {
    let useToken=true;
    const Api  = _GetApi(useToken);
    apiUrl    = !apiUrl && api.getProfileApi(id) || apiUrl;
    

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }
  
    
    let profileById = `userProfile${id}`;
    
    return dispatch => {
        dispatch(action.getUserProfilePending(profileById));

	    Api.get(apiUrl)
        .then(response => {
        	
            dispatch(action.getUserProfileSuccess(profileById ,response.data));
        })
        .catch(error => {
            console.log(error)
      	
      	    if (error.response) {
                error = error.response.data;
      		    dispatch(action.getUserProfileError(profileById, error.detail));

            }else if(error.request){
                error = 'Something wrong happened.';
                dispatch(action.getUserProfileError(profileById, error));

            }else{
                dispatch(action.handleError());
            }
        });
    }
};


export function getCommentList(byId) {
    
    return dispatch => {
        dispatch(action.getCommentListPending(byId))
	}
};



export function getReplyList(props) {
   return dispatch => {
      dispatch(action.getReplyListPending(props.actionType, props.byId ))
   }
};



export function getReplyChildrenList(props) {
    let {actionType, byId, apiUrl, children } = props;
 
    if (children && children.length) {
        return dispatch => {
            dispatch(action.getReplyChildListPending(actionType, byId));
            dispatch(action.getReplyChildListSuccess(actionType, byId, children));
        }
        
    }
    let useToken = true
    const Api    = _GetApi(useToken);  

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    return dispatch => {
        dispatch(action.getReplyChildListPending(actionType, byId))
	    Api.get(apiUrl)
        .then(response =>{
            dispatch(action.getReplyChildListSuccess(actionType, byId, response.data))
        })
        .catch(error => {
            dispatch(action.getReplyChildListError(actionType, byId, error))
        }) 
    }
};


export function getCurrentUser():Function {
    let useToken=true
    const Api  = _GetApi(useToken); 

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }   

    return dispatch => {
	    dispatch(action.getCurrentUserPending());

		Api.get(`/api/current/user/`)
            .then(response => {
      	        dispatch(action.getCurrentUserSuccess(response.data)) 
            })
            .catch(error =>{
                if (error.response && error.response.data) {
                    dispatch(action.getCurrentUserError(error.response.data));

      	        }else{
                    dispatch(action.handleError(error.request))
      	        }
            });
    };
	
};

const UserIsConfirmed =(currentUser)=> {
    return currentUser && currentUser.is_confirmed;

}

export const Delete = (params)=>{
    let apiUrl = params.apiUrl;
    const Api  = _GetApi(true); 
    if (!Api) {
        return dispatch =>{ dispatch(action.handleError()) };
    }

    return dispatch => {
        
        Api.delete(apiUrl, {})
            .then(response => {
                console.log(response, params) 
                let bookmarks = removeBookmark(params.obj, params.bookmarkType)
         
                dispatch(action.getIndexSuccess(bookmarks))
                
                let alertMessage = {
                    textMessage : 'Bookmark successfully removed.',
                    messageType : 'success'
                }
                dispatch(action.HandleAlertMessage(alertMessage))
            })
            .catch(error =>{
                if (error.response && error.response.data) {
                    console.log(error)

                }else{
                    console.log(error)
                    dispatch(action.handleError(error.request))
                }
            });
    };
} 

const removeBookmark =(bookmarkObj, bookmarkType)=>{
    let cache = JSON.parse(localStorage.getItem('@@CacheEntities')) || {};
    let index = cache?.index
    
    let bookmarks = index?.bookmarks || []
    let bookmarksCache = bookmarks[bookmarkType] || []
    bookmarks[bookmarkType] = bookmarksCache.filter((bookmark)=> {
                                     return bookmark.id !== bookmarkObj.id;
                                    })
    
    index['bookmarks'] = bookmarks
    index['bookmarkRemoved'] = true
    
    return index
} 

export function handleSubmit(props) {
    
    let useToken=true
    const Api  = _GetApi(useToken); 
    if (!Api) {
        return dispatch =>{ dispatch(action.handleError()) };
    }

    let { currentUser } = props;
    currentUser = currentUser || GetLoggedInUser()

    let userIsConfirmed = UserIsConfirmed(currentUser);
    if (!userIsConfirmed) {
        let error = 'Sorry. You must confirm your account before you can do any action';
        
        return dispatch => {
            dispatch(action.handleError(error));
        }
         
    }
     
    let { 
        actionType, 
        byId,
        objName,  
        formData,
        apiUrl,
        isModal,
        modalName,
        obj } = props;


   
    byId = byId?byId:"newObject"; 
    isModal = isModal || false;

    let updateProps = {
            actionType,
            byId,
            objName,
            modalName,
            obj,
            isUpdating:true,
        };

    let createProps = {
            actionType,
            byId,
            objName,
            modalName,
            obj,
            isCreating: true, 
        }; 

    
    if (props.isPut) {
   	    return dispatch => {
            isModal && dispatch(action.ModalSubmitPending(modalName))
            !isModal && dispatch(action.updateActionPending(updateProps))

		    Api.put(apiUrl, formData)
		    .then(response => {
		        
                updateProps['data'] = prepPayLoad(objName, response.data);
                isModal && dispatch(action.ModalSubmitSuccess(updateProps));
			    dispatch(action.updateActionSuccess(updateProps));

                let alertMessage = {
                    textMessage : BuildAlertMessage(updateProps),
                    messageType : 'success'
                }
                isModal && dispatch(action.HandleAlertMessage(alertMessage))
			
		    })
		    .catch(error => {
			    			
			    if (error.response && error.response.data) {
                    
                    error = error.response.data
                    updateProps['error'] = error.detail;

                    isModal  && dispatch(action.ModalSubmitError(updateProps));
			        !isModal && dispatch(action.updateActionError(updateProps));

			    }else if(error.request){
                    
                    error = 'Something wrong happened.';
                    updateProps['error'] = error;
                    !isModal && dispatch(action.updateActionError(updateProps));
                                      
                    isModal && dispatch(action.ModalSubmitError(updateProps));

                    !isModal && dispatch(action.handleError(error));

                }else{
                    console.log(error)
                    !isModal && dispatch(action.handleError());

                    updateProps['error'] = 'Something wrong happened.'
                    isModal && dispatch(action.ModalSubmitError(updateProps))
                }
        
	        })
        }

	}else if (props.isPost) {
        console.log(props)
        return dispatch => {
           isModal && dispatch(action.ModalSubmitPending(modalName))
     	   !isModal && dispatch(action.createActionPending(createProps ))

		    Api.post(props.apiUrl, props.formData)
		    .then(response => {
                console.log(response)
			    createProps['data'] = prepPayLoad(objName, response.data); 
                isModal && dispatch(action.ModalSubmitSuccess(createProps))
			    dispatch(action.createActionSuccess(createProps));
                            
                let alertMessage = {
                    textMessage : BuildAlertMessage(createProps),
                    messageType : 'success'
                }
                isModal && dispatch(action.HandleAlertMessage(alertMessage))
                
		    })
		    .catch(error => {
                				
			    if (error.response && error.response.data) {
                    console.log(error)
                    createProps['error'] = error.response.data;
                    isModal  && dispatch(action.ModalSubmitError(createProps))
				    !isModal && dispatch(action.createActionError(createProps));
      		
         	    }else if(error.request){
                    console.log(error.request)
                    error = 'Something wrong happened.';
                    createProps['error'] = error;
                    isModal && dispatch(action.handleError(error));
                    
                }else{
                    console.log(error)
                    dispatch(action.handleError());
                    createProps['error'] = 'Something wrong happened.'
                }

                !isModal && dispatch(action.createActionError(error));
                isModal && dispatch(action.ModalSubmitError(createProps))
			   
	        })
   	    }

    }else{

        return dispatch =>{
 		   dispatch(action.handleError())
 	    }
 	}
};

export function authenticateWithGet(params:object):Function {

    let key = params['key'];
    let useToken = false;
    const apiUrl = api.accountConfirmApi(key);
    const Api    = _GetApi(useToken, {timeout:30000, requestFor:'authentication'}); 

    return dispatch => {
        dispatch(action.authenticationPending());
        Api.get(apiUrl)
            .then(response => { 
                let {data}  = response;
                
                data = {...data,isConfirmed:true}
                handleLogin(data, dispatch);

            }).catch(error => {
                console.log(error)
                if (error.response) {
                    console.log(error.response)
                    let _error = error.response.data
                    dispatch(action.authenticationError(_error.detail));
                } 
            });
    };
}

export function authenticate(params:object):Function {
   
    const isSocialAuth:boolean = params['isSocialAuth'];
    const isTokenRefresh:boolean = params['isTokenRefresh'];
    const formName:string = params['formName'];
    const apiUrl:string = params['apiUrl'];
    const form:object = params['form'];
    const useToken:boolean = params['useToken']
     
    
    const Api = _GetApi(useToken, {timeout:120000, requestFor:'authentication'});   
    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    return dispatch => {
        dispatch(
            action.authenticationPending(
                        isSocialAuth,
                        isTokenRefresh
                    ));

        Api.post(apiUrl, form)
            .then(response => {
                let {data}  = response;
                console.log(response)
                
                if (formName === 'phoneNumberConfirmationForm'){
                    data = {...data, isConfirmed:true}
                }
                
                if (isSocialAuth) handleLogin(data, dispatch);
                handleSuccessAuth(formName, data, dispatch)
            }
        )
        .catch(error =>{

            let _error;
            if (error.response) {
                
                if (error.response.status == 500) {
                    _error = error.response.statusText
                    dispatch(action.authenticationError(_error, isSocialAuth));
                    return dispatch(action.handleError(_error));
                }

                _error = error.response.data;
                dispatch(
                    action.authenticationError(
                        _error,
                        isSocialAuth,
                        isTokenRefresh
                    )
                );
                    
                isSocialAuth && dispatch(
                                    action.handleError(_error.non_field_errors[0])
                                );

            }
            else if (error.request)  {
                _error = 'Something wrong happened. Please try again';
                
                dispatch(
                    action.authenticationError(_error, isSocialAuth, isTokenRefresh)
                );
                dispatch(action.handleError(_error));

            }else{
                dispatch(action.handleError());
            }
        });
    }
   
}; 

const handleSuccessAuth = (formName:string, data:object, dispatch:Function):object => {
    switch(formName){
        case 'loginForm':
        case 'reLoginForm':
        case 'signUpForm':
        case 'logoutForm':
        case 'phoneNumberConfirmationForm':
            return handleLogin(data, dispatch);
                
        case 'passwordResetForm':
            return handlePasswordReset(data, dispatch);

        case 'passwordChangeForm':
        case 'passwordChangeConfirmForm':
            return handlePasswordChange(data, dispatch);

        case 'passwordResetSmsCodeForm':
            return handleSmsCode(data, dispatch);

        case 'emailResendForm':
            return handleConfirmationResend(data, dispatch);
        
        case 'addPhoneNumberForm':
        case 'addEmailForm':
            return handlePhoneNumberOrEmailAdd(data, dispatch);

        default:
            return  undefined;
    }
}


const handleLogin = (data:object, dispatch:Function):object => {
     
    let loginAuth:object = {
        isLoggedIn :true,
        tokenKey   : data['token'] || data['key'] || null,
        successMessage : data['detail'] || '',
        isConfirmed : data['isConfirmed'] || false,
        timeStamp      : timeStamp.getTime(),
    }

    if (data['user']) {
        let isSuperUser:boolean = data['user'].is_superuser;
        isSuperUser  && dispatch(action.getAdminSuccess({loginAuth}))
        dispatch(action.getCurrentUserSuccess(data['user']))
    }
   
    return dispatch(action.authenticationSuccess({loginAuth}));
}


const handlePasswordReset = (data:object, dispatch:Function):object => {
        
    let passwordRestAuth = {
        successMessage : data['detail'],
        identifier     : data['email'] || data['phone_number'],
        smsSent        : data['sms_sent'] || false,
        emailSent      : data['email_sent'] || false, 
    };

    return dispatch(action.authenticationSuccess({passwordRestAuth}));
};

const handleSmsCode = (data:object, dispatch:Function):object => {
    let smsCodeAuth = {
            smsCode : data['sms_code'], 
            smsCodeValidated : true,
    };
             
    return dispatch(action.authenticationSuccess({smsCodeAuth}));
};

const handlePasswordChange = (data:object, dispatch:Function):object => {
    let passwordChangeAuth = {
        successMessage : data['detail'],
    }
    return dispatch(action.authenticationSuccess({passwordChangeAuth}));
};


const handleConfirmationResend =(data:object, dispatch:Function): object =>{
        
    let confirmationResendAuth = {
        successMessage : data['detail'],
    }

    return dispatch(action.authenticationSuccess({confirmationResendAuth}));
}


const handlePhoneNumberOrEmailAdd =(data:object, dispatch:Function):object =>{
        
    let phoneNumberOrEmailAuth = {
        ...data,
    }

    return dispatch(action.authenticationSuccess({phoneNumberOrEmailAuth}));
}



export function getAdmin():Function {
    let useToken:boolean = true;
    const Api  = _GetApi(useToken); 

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }   

    return dispatch => {
        dispatch(action.getAdminPending());

        Api.get(`/api/admin/`)
            .then(response => dispatch(action.getAdminSuccess(response.data)))
            .catch(error =>{
               
                if (error.response && error.response.data) {
                    dispatch(action.getAdminError(error.response.data));

                }else{
                    console.log(error.request)
                    dispatch(action.handleError(error.request))
                }
            });
    };
    
};


const prepPayLoad = (objName:string, data:object):object =>{
	switch(objName){
        case 'Question':
            return {question : data}

        case 'Answer':
            return {answer : data}

        case 'Comment':
            return {comment : data}

        case 'Reply':
            return {reply : data}

        case 'Post':
            return {post : data}

        case 'UserProfile':
        case 'UsersList':
            return {user: data}

        case 'AnswerBookmark':
            return {answers : data}

        case 'PostBookmark':
            return {posts : data}
    }
};  


const BuildAlertMessage = (params:object):string =>{
    
    const objName:string = params['objName'];
    const isCreating:boolean = params['isCreating'];
    const isUpdating:boolean = params['isUpdating'] ;

    let action = isCreating && 'created' || isUpdating && 'updated';
    let alertMessage = `${objName} successfully ${action}`

    if(objName === 'AnswerBookmark'){
        alertMessage = 'Answer successfully added to bookmarks'
    }
    else if(objName === 'PostBookmark'){
        alertMessage = 'Post successfully added to bookmarks'
    }

   return alertMessage;
};  



