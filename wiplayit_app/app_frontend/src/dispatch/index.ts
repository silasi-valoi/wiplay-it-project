
 
import Api from 'utils/api';
import Axios from 'utils/axios_instance';
import * as action  from 'actions/actionCreators';
import * as checkType from 'helpers/check-types'; 
import {GetLoggedInUser } from 'utils/helpers';
import {history} from 'App';

const api = new Api();
const timeStamp = new Date();
const isOnline:boolean = false;

export const _GetApi = (useToken:boolean, opts?:object) =>{
    const axios     = new Axios({useToken, ...opts});
    return axios.instance()

} 

const checkOnlineStatus = async () => {
    try {
        let apiUrl:string = api.getDefaultProfilePicture();
        const online = await fetch(apiUrl);
        return online.status >= 200 && online.status < 300; // either true or false

    } catch (err) {
        return false; // definitely offline
    }
};


export function sendMessage(params:object):Function {
    let useToken:boolean = true;
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
    
    return async dispatch => {
         let online = await checkOnlineStatus();

        if(!online){
            let error:string = 'Your internet connection is offline';
            dispatch(action.handleError(error));
        }else{

            dispatch(action.sendMessagePending());

            Api.post(apiUrl, formData).then(response => {
                console.log(response)  
                dispatch(action.sendMessageSuccess(response.data)); 
            
            }).catch(error => {
                            
                if (error.response) {
                    error = error.response.data;
                    console.log(error)
                    dispatch(action.sendMessageError(error));

                }else if(error.request){
                    console.log(error.request)
                    error = 'The server took to long to respond.';
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
};


export function getAboutInfo(options?:object) {
    let useToken:boolean = false;
    const Api    = _GetApi(useToken);

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let apiUrl = api.getAboutInfoApi(); 
    
    return async dispatch => {
        let online = await checkOnlineStatus();

        if(!online){
            let error:string = 'Your internet connection is offline';
            dispatch(action.handleError(error));
            dispatch(action.getAboutInfoError(error));
      
        }else{
            dispatch(action.getAboutInfoPending());

           Api.get(apiUrl).then(response => {
                console.log(response)  
                dispatch(action.getAboutInfoSuccess(response.data)); 
            }).catch(error => {
            
                if (error.response) {
                    error = error.response.data;
                    console.log(error)
                    dispatch(action.getAboutInfoError(error.detail));

                }else if(error.request){
                    error = 'The server took to long to respond.';
                    dispatch(action.getAboutInfoError(error));

                }else{
                    dispatch(action.handleError());
                }
            })
        }       
    };
};


export function getIndex(options?:object):Function {
    let useToken:boolean = true;
    const Api  = _GetApi(useToken, {requestFor:'index'});
    let apiUrl = api.getIndexApi(); 

    return async dispatch => {
        let online = await checkOnlineStatus();

        if(!online){
            let error:string = 'Your internet connection is offline';
            dispatch(action.handleError(error));
            dispatch(action.getIndexError(error));
            

        }else{
            dispatch(action.getIndexPending());

            Api.get(apiUrl).then(response => {
                dispatch(action.getIndexSuccess(response.data)); 
           
            }).catch(error => {
                                               
                if (error.response) {
                    let errorResponse = error.response
                    console.log(errorResponse)
                    if (errorResponse.status === 500) {
                        error = errorResponse.statusText
                    }else{
                        error = errorResponse.data.detail;
                    }

                }else if(error.request){
                    console.log(error.request)
                    error = 'The server took to long to respond.';
                    
                }else{
                    console.log(error)
                    error = 'Something wrong happened.'
                }
              
                dispatch(action.getIndexError(error));
            }); 
        }
    };
};

interface UserListProps {
    apiUrl:string,
    usersById:string
};


export function getUserList(props:UserListProps) {
   
    let {apiUrl, usersById} = props;
    
    return async dispatch => {
        let online = await checkOnlineStatus();

        if(!online){
            let error:string = 'Your internet connection is offline';
            dispatch(action.handleError(error));
            dispatch(action.getUserListError(usersById, error));
     
        }else{
            let useToken:boolean = true;
            const Api  = _GetApi(useToken);

            dispatch(action.getUserListPending(usersById))

	        Api.get(apiUrl).then(response =>{
                dispatch(action.getUserListSuccess(usersById, response.data))

            }).catch(error => {

                console.log(error)
                if (error.response) {
                    error = error.response.data.detail;
                    
                }else if(error.request){
                    error = 'The server took to long to respond.';
                
                }else{
                    error = 'Something wrong happened.'
                }

                dispatch(action.getUserListError(usersById, error));
            }); 
        }
    };
};



export function getQuestionList(questionListById:string) {
    let useToken:boolean = true;
    const Api  = _GetApi(useToken);  
    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let apiUrl     = api.getQuestionListApi(); 

    return async dispatch => {
        let online = await checkOnlineStatus();

        if(!online){
            let error:string = 'Your internet connection is offline';
            dispatch(action.handleError(error));
            dispatch(action.getQuestionListError(questionListById, error));
            

        }else{
            dispatch(action.getQuestionListPending(questionListById))
	        Api.get(apiUrl).then(response =>{
                dispatch(action.getQuestionListSuccess(questionListById, response.data));

            }).catch(error => {
                console.log(error)
      	        if (error.response) {
                    error = error.response.data;
                    dispatch(action.getQuestionListError(questionListById, error.detail));

                }else if(error.request){
                    error = 'The server took to long to respond.';
                    dispatch(action.getQuestionListError(questionListById, error));

                }else{
                    dispatch(action.handleError());
                }
            });
        } 
    };
};




export function getPostList(postListById:string) {

    let useToken:boolean = true;
    const Api  = _GetApi(useToken);  

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let   apiUrl:string  = api.getPostListApi();

    return async dispatch => {
        let online = await checkOnlineStatus();

        if(!online){
            let error:string = 'Your internet connection is offline';
            dispatch(action.handleError(error));
            dispatch(action.getPostListError(postListById, error));
          
        }else{
            dispatch(action.getPostListPending(postListById))
	        
            Api.get(apiUrl).then(response => {
                dispatch(action.getPostListSuccess(postListById, response.data))
            }).catch(error => {
      	   
                if (error.response) {
                    error = error.response.data;
                    dispatch(action.getPostListError(postListById, error.detail));

                }else if(error.request){
                    error = 'The server took to long to respond.';
                    dispatch(action.getPostListError(postListById, error));

                }else{
                    dispatch(action.handleError());
                }
            });
        } 
    };
};



export function getQuestion(id:number) {
    let useToken:boolean = true;
    const Api  = _GetApi(useToken); 

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    } 
      
    let apiUrl:string = api.getQuestionApi(id);
    let questionById:string = `question${id}`;

    return async dispatch => {
        let online = await checkOnlineStatus();

        if(!online){
            let error:string = 'Your internet connection is offline';
            dispatch(action.handleError(error));
            dispatch(action.getQuestionError(questionById, error));
            

        }else{
            dispatch(action.getQuestionPending(questionById))
	        Api.get(apiUrl).then(response =>{
                    dispatch(action.getQuestionSuccess( questionById, response.data))

            }).catch(error => {
                    
                if (error.response) {
                    console.log(error.response)
                    error = error.response.data;
                    dispatch(action.getQuestionError( questionById, error.detail));

                }else if(error.request){
                    console.log(error.request)
                    error = 'The server took to long to respond.';
                    dispatch(action.getQuestionError(questionById, error));

                }else{
                    error = 'Something wrong happened.';
                    dispatch(action.handleError());
                }
            });
        }
    };
};



export function getPost(id:number) {
    let useToken:boolean = true;
    const Api  = _GetApi(useToken);  

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let apiUrl     = id && api.getPostApi(id);
    let postById   = id && `post${id}`

    return async dispatch => {
        let online = await checkOnlineStatus();

        if(!online){
            let error:string = 'Your internet connection is offline';
            dispatch(action.handleError(error));
            dispatch(action.getPostError(postById, error));
       
        }else{
            dispatch(action.getPostPending(postById))

	        Api.get(apiUrl).then(response =>{
                console.log(response)
                dispatch(action.getPostSuccess(postById, response.data));
            
            }).catch(error => {
                console.log(error)
                if (error.response) {
                    error = error.response.data;
                    dispatch(action.getPostError(postById ,error.detail));

                }else if(error.request){
                    error = 'The server took to long to respond.';
                    dispatch(action.getPostError(postById ,error));

                }else{
                    dispatch(action.handleError());
                }
            });
        } 
    };
};




export function getUserProfile(id:number, apiUrl?:string) {
    let useToken:boolean = true;
    const Api  = _GetApi(useToken);
    apiUrl    = !apiUrl && api.getProfileApi(id) || apiUrl;
    

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }
  
    
    let profileById:string = `userProfile${id}`;
    
    return async dispatch => {
        let online = await checkOnlineStatus();

        if(!online){
            let error:string = 'Your internet connection is offline';
            dispatch(action.handleError(error));
            dispatch(action.getUserProfileError(profileById, error));
            

        }else{
            dispatch(action.getUserProfilePending(profileById));

	        Api.get(apiUrl).then(response => {
        	    dispatch(action.getUserProfileSuccess(profileById ,response.data));
            
            }).catch(error => {
                if (error.response) {
                    console.log(error.response)
                    error = error.response.data.detail;
      		    
                }else if(error.request){
                    console.log(error.request)
                    error = 'The server took to long to respond.';
                
                }else{
                    console.log(error)
                    error = 'Something wrong happened.'
                }

                dispatch(action.getUserProfileError(profileById, error))
            });
        }
    };
};

export function getCommentList(byId:string) {
    
    return dispatch => {
        dispatch(action.getCommentListPending(byId))
	}
};

export function getReplyList(params:object) {
    return dispatch => {
        dispatch(action.getReplyListPending(params['actionType'], params['byId']))
    }
};

export function getReplyChildrenList(params:object) {
    
    let actionType = params['actionType'];
    let byId:string = params['byId'];
    let children = params['children'];
 
    if (children && children['length']) {
        return dispatch => {
            dispatch(action.getReplyChildListPending(actionType, byId));
            dispatch(action.getReplyChildListSuccess(actionType, byId, children));
        }
        
    }
    let useToken:boolean = true;
    const Api    = _GetApi(useToken);  

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    return dispatch => {
        dispatch(action.getReplyChildListPending(actionType, byId))
	    Api.get(params['apiUrl'])
        .then(response =>{
            dispatch(action.getReplyChildListSuccess(actionType, byId, response.data))
        })
        .catch(error => {
            dispatch(action.getReplyChildListError(actionType, byId, error))
        }) 
    }
};


export function getCurrentUser():Function {
    let useToken = true
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

const UserIsConfirmed =(currentUser:object)=> {
    return currentUser && currentUser['is_confirmed'];

}

export const Delete = (params:object)=>{
    let apiUrl = params['apiUrl'];
    const Api  = _GetApi(true); 
   
    return dispatch => {
        
        Api.delete(apiUrl, {})
            .then(response => {
                console.log(response, params) 
                let bookmarks = removeBookmark(params['obj'], params['bookmarkType'])
         
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
}; 

const removeBookmark =(data:object, bookmarkType:string)=>{
    let cache = JSON.parse(localStorage.getItem('@@CacheEntities')) || {};
    let index = cache?.index
    
    let bookmarks = index?.bookmarks || []
    let bookmarksCache = bookmarks[bookmarkType] || []
    bookmarks[bookmarkType] = bookmarksCache.filter((bookmark)=> {
                                     return bookmark.id !== data['id'];
                                    })
    
    index['bookmarks'] = bookmarks
    index['bookmarkRemoved'] = true
    
    return index
}; 

export  function  handleSubmit(params:object) {
    
    return async dispatch => {
        let online = await checkOnlineStatus() 
       
        if (online && params['isPut']) {
           await sendUpdateResquest(params, dispatch);

        }else if(online && params['isPost']){

           await sendPostRequest(params, dispatch);
           
        }else if(!online){
            let error:string = 'Your internet connection is offline'
           await dispatch(action.handleError(error));
        }  
    }          

};

function sendPostRequest(params:object, dispatch:Function){
    const Api  = _GetApi(true); 
    
    let isModal:boolean = params['isModal'];
    let modalName:string = params['modalName'];
    let objName:string = params['objName'];

    let createProps:object = {
        ...params,
        isCreating:true,
        byId: params['byId'] || "newObject", 
    };
        
    isModal && dispatch(action.ModalSubmitPending(modalName));
    dispatch(action.createActionPending(createProps));

    Api.post(params['apiUrl'], params['formData']).then(response => {
        createProps['data'] = prepPayLoad(objName, response.data); 
        createProps['successMessage'] = BuildAlertMessage(createProps);

        isModal && dispatch(action.ModalSubmitSuccess(createProps));
        dispatch(action.createActionSuccess(createProps));
                 
    }).catch(error => {
                                
        if (error.response && error.response.data) {
            createProps['error'] = error.response.data;
            isModal  && dispatch(action.ModalSubmitError(createProps))
            dispatch(action.createActionError(createProps));
              
        }else if(error.request){
            error = 'The server took to long to respond.';
            createProps['error'] = error;
            isModal && dispatch(action.handleError(error));
                    
        }else{
            dispatch(action.handleError());
            createProps['error'] = 'Something wrong happened.'
        }

        dispatch(action.createActionError(error));
        isModal && dispatch(action.ModalSubmitError(createProps))
    });
    
};

function sendUpdateResquest(params:object, dispatch:Function){
    console.log(params)
    const Api  = _GetApi(true);

    let isModal:boolean = params['isModal'];
    let modalName:string = params['modalName'];
    const formData = params['formData'];
    let objName = params['objName'];

    let updateProps = {
        ...params,
        isUpdating:true,
    }
     
    Api.put(params['apiUrl'], formData).then(response => {
        console.log(response)
        updateProps['data'] = prepPayLoad(objName, response.data);
        updateProps['successMessage'] = BuildAlertMessage(updateProps)

        isModal && dispatch(action.ModalSubmitSuccess(updateProps));
        dispatch(action.updateActionSuccess(updateProps));
       
    }).catch(error => {
        if (error.response) {
            console.log(error.response)
            error = error.response.data;
            updateProps['error'] = error.detail;

            isModal  && dispatch(action.ModalSubmitError(updateProps));
            dispatch(action.updateActionError(updateProps));

        }else if(error.request){
            error = 'The server took to long to respond.';
            updateProps['error'] = error;
            dispatch(action.updateActionError(updateProps));
            isModal && dispatch(action.ModalSubmitError(updateProps));

            dispatch(action.handleError(error));

        }else{
            console.log(error)
            dispatch(action.handleError());
            updateProps['error'] = 'Something wrong happened.'
            isModal && dispatch(action.ModalSubmitError(updateProps));
        }
    });
    
};



export function authenticateWithGet(params:object):Function {

    let key = params['key'];
    let useToken = false;
    const apiUrl = api.accountConfirmApi(key);
    const Api    = _GetApi(useToken, {timeout:30000, requestFor:'authentication'}); 

    return async dispatch => {
        let online = await checkOnlineStatus();

        if(!online){
            let error:string = 'Your internet connection is offline';
            dispatch(action.handleError(error));
            dispatch(action.authenticationError({error}));
            

        }else{
            dispatch(action.authenticationPending());
            Api.get(apiUrl).then(response => { 
                let {data}  = response;
                
                data = {...data,isConfirmed:true}
                handleLogin(data, dispatch);

            }).catch(error => {
                console.log(error)
                if (error.response) {
                    console.log(error.response)
                    let _error = error.response.data
                    dispatch(action.authenticationError(_error.detail, ''));
                } 
            });
        }
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

    return async dispatch => {
        let online = await checkOnlineStatus();

        if(!online){
            let error:string = 'Your internet connection is offline';
            dispatch(action.handleError(error));

        }else{ 
            dispatch(action.authenticationPending( isSocialAuth, isTokenRefresh));
        
            Api.post(apiUrl, form).then(response => {
                let {data}  = response;
                if (formName === 'phoneNumberConfirmationForm'){
                    data = {...data, isConfirmed:true}
                }
                handleSuccessAuth(formName, data, dispatch);

            }).catch(error =>{

                let _error;
                if (error.response) {
                    console.log(error.response)
                    if (error.response.status == 500) {
                        _error = error.response.statusText
                        dispatch(action.authenticationError(_error,formName, isSocialAuth));
                        return dispatch(action.handleError(_error));
                    }

                    _error = error.response.data;
                    dispatch(
                        action.authenticationError(
                            _error,
                            formName,
                            isSocialAuth,
                            isTokenRefresh
                        )
                    );
                    
                    isSocialAuth && dispatch(
                            action.handleError(_error.non_field_errors[0])
                            );

                }
                else if (error.request)  {
                    console.log(error.request)
                    error = 'The server took to long to respond.';
                
                    dispatch(
                        action.authenticationError(
                            _error, 
                            formName,
                            isSocialAuth,
                            isTokenRefresh
                        )
                    );
                    dispatch(action.handleError(_error));

                }else{
                    dispatch(action.handleError());
                }
            });
        }
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

    let isLoggedIn:boolean = false;
    let tokenKey:string = null;
    if (data['token'] || data['key']) {
       isLoggedIn = true;
       tokenKey = data['token'] || data['key'];
    }
     
    let loginAuth:object = {
        isLoggedIn,
        tokenKey,
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
};

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
    let alertMessage = `Your ${objName} has successfully been ${action}`

    if(objName === 'AnswerBookmark'){
        alertMessage = 'Answer successfully added to your bookmarks'
    }
    else if(objName === 'PostBookmark'){
        alertMessage = 'Post successfully added to your bookmarks'
    }

   return alertMessage;
};  



