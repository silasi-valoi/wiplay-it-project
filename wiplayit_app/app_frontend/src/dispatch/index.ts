
 
import Apis from 'utils/api';
import Axios from 'utils/axios_instance';
import * as action  from 'actions/actionCreators';
import * as checkType from 'helpers/check-types'; 
import {GetLoggedInUser } from 'utils/helpers';
import {history} from 'App';


export const _GetApi = (useToken:boolean, opts?:object) =>{
    const axios     = new Axios({useToken, ...opts});
    return axios.instance()

} 

const checkOnlineStatus = async () => {
    try {
        let apiUrl:string = Apis.getDefaultProfilePicture();
        const online = await fetch(apiUrl);
        return online.status >= 200 && online.status < 300; // either true or false

    } catch (err) {
        return false; // definitely offline
    }
};


export function sendMessage(params:object):Function {
    let useToken:boolean = true;
    const Api = _GetApi(useToken,{timeout:120000});
     
    const apiUrl:string = params['apiUrl'];;
    const formData:object = params['formData'];   
    
    return async dispatch => {
        const errorOpts:object = {
            dispatch,
            action:action.sendMessageError,
        };

        let online = await checkOnlineStatus();
        if(!online){
            handleErrors({online}, errorOpts);

        }else{

            dispatch(action.sendMessagePending());

            Api.post(apiUrl, formData).then(response => {
                dispatch(action.sendMessageSuccess(response.data)); 
            
            }).catch(error => {
                handleErrors(error, errorOpts)
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

    let apiUrl = Apis.getAboutInfoApi(); 
    
    return async dispatch => {
        const errorOpts:object = {
            dispatch,
            action:action.getAboutInfoError,
        };

        let online = await checkOnlineStatus();
        if(!online){
            handleErrors({online}, options)
                  
        }else{
            dispatch(action.getAboutInfoPending());

           Api.get(apiUrl).then(response => {
                console.log(response)  
                dispatch(action.getAboutInfoSuccess(response.data)); 
            }).catch(error => {
                handleErrors(error, errorOpts)
            })
        }       
    };
};


export function getIndex(authenticated:boolean=false, options?:object):Function {
    
    const Api  = _GetApi(authenticated, {requestFor:'index'});
    let apiUrl = Apis.getIndexApi(); 

    return async dispatch => {
        const errorOpts:object = {
            dispatch,
            action:action.getIndexError,
        };

        let online = await checkOnlineStatus();
        if(!online){
            handleErrors({online}, errorOpts)         

        }else{
            dispatch(action.getIndexPending());

            Api.get(apiUrl).then(response => {
                dispatch(action.getIndexSuccess(response.data)); 
           
            }).catch(error => {
                handleErrors(error, errorOpts)  
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
        const errorOpts:object = {
            dispatch,
            action:action.getUserListError,
            byId:usersById,
        };

        let online = await checkOnlineStatus();
        if(!online){
            handleErrors({online}, errorOpts)
             
        }else{
            let useToken:boolean = false;
            const Api  = _GetApi(useToken);

            dispatch(action.getUserListPending(usersById))

	        Api.get(apiUrl).then(response =>{
                dispatch(action.getUserListSuccess(usersById, response.data))

            }).catch(error => {
                handleErrors(error, errorOpts)
            }); 
        }
    };
};



export function getQuestionList(questionListById:string) {
    let useToken:boolean = false;
    const Api  = _GetApi(useToken);  
    let apiUrl     = Apis.getQuestionListApi(); 

    return async dispatch => {
        const errorOpts:object = {
            dispatch,
            action:action.getQuestionListError,
            byId:questionListById,
        };

        let online = await checkOnlineStatus();

        if(!online){
            handleErrors({online}, errorOpts)
              
        }else{
            dispatch(action.getQuestionListPending(questionListById))
	        Api.get(apiUrl).then(response =>{
                dispatch(action.getQuestionListSuccess(questionListById, response.data));

            }).catch(error => {
                handleErrors(error, errorOpts)
            });
        } 
    };
};




export function getPostList(postListById:string) {

    let useToken:boolean = false;
    const Api = _GetApi(useToken);  

    let apiUrl:string = Apis.getPostListApi();

    return async dispatch => {
        const errorOpts:object = {
            dispatch,
            action:action.getPostListError,
            byId:postListById,
        };

        let online = await checkOnlineStatus();

        if(!online){
            handleErrors({online}, errorOpts)
          
        }else{
            dispatch(action.getPostListPending(postListById))
	        
            Api.get(apiUrl).then(response => {
                dispatch(action.getPostListSuccess(postListById, response.data))
            }).catch(error => {
                handleErrors(error, errorOpts)
      	    });
        } 
    };
};



export function getQuestion(id:number) {
    let useToken:boolean = false;
    const Api  = _GetApi(useToken); 
  
    let apiUrl:string = Apis.getQuestionApi(id);
    let questionById:string = `question${id}`;

    return async dispatch => {
        const errorOpts:object = {
            dispatch,
            action:action.getQuestionError,
            byId:questionById,
        };

        let online = await checkOnlineStatus();
        if(!online){
          handleErrors({online}, errorOpts)            

        }else{
            dispatch(action.getQuestionPending(questionById))
	        Api.get(apiUrl).then(response =>{
                    dispatch(action.getQuestionSuccess( questionById, response.data))

            }).catch(error => {
                handleErrors(error, errorOpts)
            });
        }
    };
};



export function getPost(id:number) {
    let useToken:boolean = false;
    const Api  = _GetApi(useToken);  

    let apiUrl = id && Apis.getPostApi(id);
    let postById = id && `post${id}`

    return async dispatch => {
        const errorOpts:object = {
            dispatch,
            action:action.getPostError,
            byId:postById,
        };

        let online = await checkOnlineStatus();
        if(!online){
          handleErrors({online}, errorOpts)
       
        }else{
            dispatch(action.getPostPending(postById))

	        Api.get(apiUrl).then(response =>{
                dispatch(action.getPostSuccess(postById, response.data));
            
            }).catch(error => {
                 handleErrors(error, errorOpts)               
            });
        } 
    };
};




export function getUserProfile(id:number, apiUrl?:string) {
    let useToken:boolean = false;
    const Api  = _GetApi(useToken);
    apiUrl    = !apiUrl && Apis.getProfileApi(id) || apiUrl;
    let profileById:string = `userProfile${id}`;
    
    return async dispatch => {
        const errorOpts:object = {
            dispatch,
            action:action.getUserProfileError,
            byId:profileById,
        };

        let online = await checkOnlineStatus();
        if(!online){
          handleErrors({online}, errorOpts)
        
        }else{
            dispatch(action.getUserProfilePending(profileById));

	        Api.get(apiUrl).then(response => {
        	    dispatch(action.getUserProfileSuccess(profileById ,response.data));
            
            }).catch(error => {
                handleErrors(error, errorOpts)
            });
        }
    };
};

interface commetParams {
    commentsById:string,
    apiUrl:string
}

export function getCommentList(params:commetParams) {
    let useToken:boolean = false;
    const Api    = _GetApi(useToken); 

    let apiUrl:string = params['apiUrl']; 
    let byId:string = params['commentsById'];
   
    return async dispatch => {
        dispatch(action.getCommentListPending(byId));
                
        let errorOpts:object = {
                action : action.getCommentListError,
                dispatch,
                byId,
            };

        let online = await checkOnlineStatus();
        if(!online){
          handleErrors({online}, errorOpts);

        }else{
            Api.get(apiUrl).then(response => {
                console.log(response)
                dispatch(action.getCommentListSuccess(byId, response.data));

            }).catch(error => {
                handleErrors(error, errorOpts)
            }) 
        }
    }
};


export function getReplyList(params:object) {
    let byId:string = params['byId'];
    const apiUrl:string = params['apiUrl'];

    let useToken:boolean = false;
    const Api    = _GetApi(useToken);  

    return async dispatch => {
        dispatch(action.getReplyListPending(byId));

        let errorOpts:object = {
                action : action.getReplyListError,
                dispatch,
                byId,
            };

        let online = await checkOnlineStatus();
        if(!online){
          handleErrors({online}, errorOpts);

        }else{
	        Api.get(params['apiUrl']).then(response => {
                console.log(response)
                dispatch(action.getReplyListSuccess(byId, response.data));
                
            }).catch(error => {
                handleErrors(error, errorOpts)
            }) 
        }
    };
};


export function getCurrentUser(authenticated:boolean=true):Function {
    
    const Api  = _GetApi(authenticated); 

    return async dispatch => {
	    dispatch(action.getCurrentUserPending());

        let errorOpts:object = {
            action : action.getCurrentUserError,
            dispatch,
        };

        if (!authenticated) {
            return dispatchErrorActions({}, errorOpts);
        }

        let online = await checkOnlineStatus();
        if(!online){
          handleErrors({online}, errorOpts);

        }else {
            Api.get(`/api/current/user/`).then(response => {
      	        dispatch(action.getCurrentUserSuccess(response.data)) 
            })
            .catch(error =>{
                handleErrors(error, errorOpts)
               
            });
        }
    };
	
};


export const Delete = (params:object)=>{
    let apiUrl = params['apiUrl'];
    let objName:string = params['objName'];
    const Api  = _GetApi(true); 
   
    return async  dispatch => {
        let errorOpts:object = {
                action : action,
                dispatch,
                global:true,
            };

        let online = await checkOnlineStatus();
        if(!online){
          handleErrors({online}, errorOpts);

        }else{

            Api.delete(apiUrl, {}).then(response => {
                console.log(response, params) 
                let bookmarks = removeBookmark(params['obj'], params['bookmarkType'])
         
                dispatch(action.getIndexSuccess(bookmarks));
                let bookmarkType:string;
                if(objName === 'AnswerBookmark'){
                    bookmarkType = 'Answer';

                }else if(objName === 'PostBookmark'){
                    bookmarkType = 'Post';       
                }
                                
                let alertMessage = {
                    textMessage : `${bookmarkType} removed from your bookmarks.`,
                    messageType : 'success'
                }
                dispatch(action.HandleAlertMessage(alertMessage))

            }).catch(error =>{
                handleErrors(error, errorOpts)
            });
        }
    };
}; 

const removeBookmark =(data:object, bookmarkType:string)=>{
    let cache:object = JSON.parse(localStorage.getItem('@@CacheEntities')) || {};
    let index:object = cache['index'];
    
    let bookmarks = index && index['bookmarks'];
    if (bookmarks) {
        let bookmarksCache:object[] = bookmarks[bookmarkType];
        bookmarks[bookmarkType] = bookmarksCache.filter((bookmark)=> {
                                    return bookmark['id'] !== data['id'];
                                });
    }
    
    index['bookmarks'] = bookmarks
    index['bookmarkRemoved'] = true
    
    return index
}; 

export  function  handleSubmit(params:object) {
    console.log(params)
    const isPut:boolean = params['isPut'];
    const isPost:boolean = params['isPost'];
    
    return async dispatch => {
        let online = await checkOnlineStatus() 
       
        if (online){
            isPut && await sendUpdateResquest(params, dispatch);
            isPost &&  await sendPostRequest(params, dispatch);
           
        }else{
            const _action:Function = isPut && action.updateActionError 
                                           || action.createActionError;
            let errorOpts:object = {
                ...params,
                action : _action,
                dispatch,
            };

            handleErrors({online}, errorOpts)
        }  
    };          

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
        console.log(response)
        createProps['data'] = prepPayLoad(objName, response.data); 
        createProps['successMessage'] = BuildAlertMessage(createProps);

        isModal && dispatch(action.ModalSubmitSuccess(createProps));
        dispatch(action.createActionSuccess(createProps));
                 
    }).catch(error => {
        let global = !isModal;

        let errorOpts:object = {
                ...createProps,
                action : action.createActionError,
                dispatch,
                global,
            };

        handleErrors(error, errorOpts);

        if (isModal) {
            errorOpts = {
                ...errorOpts, 
               action : action.ModalSubmitError
            };
            handleErrors(error, errorOpts);
        }

    });
    
};

function sendUpdateResquest(params:object, dispatch:Function){
    const Api  = _GetApi(true);

    let isModal:boolean = params['isModal'];
    let modalName:string = params['modalName'];
    const formData = params['formData'];
    let objName = params['objName'];

    let updateProps = {
        ...params,
        isUpdating:true,
    }

    isModal && dispatch(action.ModalSubmitPending(modalName));
    dispatch(action.updateActionPending(updateProps));
     
    Api.put(params['apiUrl'], formData).then(response => {
        
        updateProps['data'] = prepPayLoad(objName, response.data);
        updateProps['successMessage'] = BuildAlertMessage(updateProps)

        isModal && dispatch(action.ModalSubmitSuccess(updateProps));
        dispatch(action.updateActionSuccess(updateProps));
       
    }).catch(error => {
        let global = !isModal;

        let errorOpts:object = {
                ...updateProps,
                action : action.updateActionError,
                dispatch,
                global,
            };

        handleErrors(error, errorOpts);

        if (isModal) {
            errorOpts = {
                ...errorOpts, 
               action : action.ModalSubmitError
            };

            handleErrors(error, errorOpts);
        }
    });
    
};



export function authenticateWithGet(params:object):Function {
  
    let useToken = false;
    const apiUrl = params['apiUrl']
    const Api    = _GetApi(useToken, {timeout:30000, requestFor:'authentication'}); 

    return async dispatch => {
        const errorOpts:object = {
                formName:params['formName'], 
                action : action.authenticationError,
                dispatch,
            };

        let online = await checkOnlineStatus();

        if(!online){
            handleErrors({online}, errorOpts)
           
        }else{
            dispatch(action.authenticationPending(params));


            Api.get(apiUrl).then(response => { 
                let {data}  = response;
                
                data = {...data,isConfirmed:true}
                handleLogin(data, dispatch);

            }).catch(error => {
                handleErrors(error, errorOpts)
               
            });
        }
    };
};

export function authenticate(params:object):Function {
   
    const isSocialAuth:boolean = params['isSocialAuth'];
    const isTokenRefresh:boolean = params['isTokenRefresh'];
    const formName:string = params['formName'];
    const apiUrl:string = params['apiUrl'];
    const form:object = params['form'];
    const useToken:boolean = params['useToken']
       
    const Api = _GetApi(useToken, {timeout:120000, requestFor:'authentication'});   
   

    return async dispatch => {
        let errorOpts:object = {
                formName, 
                isSocialAuth,
                isTokenRefresh,
                action : action.authenticationError,
                dispatch,
            };

        let online = await checkOnlineStatus();

        if(!online){
            handleErrors({online}, errorOpts)

        }else{ 
            dispatch(action.authenticationPending(params));
        
            Api.post(apiUrl, form).then(response => {
                let {data}  = response;
                if (formName === 'phoneNumberConfirmationForm'){
                    data = {...data, isConfirmed:true}
                }
                handleSuccessAuth(formName, data, dispatch);

            }).catch(error =>{
                handleErrors(error, errorOpts)
            });
        }
    }
}; 

export const handleErrors  = (error:object, options?:object) => {
    console.log(error)
           
    let online:boolean = error['online'];
    const response:object = error && error['response'];
    const request:object = error && error['request'];
    
    if (response) {
        console.log(response)
       return handleErrorResponse(response, options);
        
    }else if (request){
        return handleErrorRequest(request, options);

    }else if(online === false){
        let _error:string = 'Your internet connection is offline';
        return dispatchErrorActions(_error, {...options, global:true})
        
    }else {
        let _error:string = 'Something wrong happenned. Please try again';
        return dispatchErrorActions(_error, {...options, global:true})
    }
}

const handleErrorResponse = (response:object, options?:object) => {
    let error:string;
    
    if (response['status'] === 500) {
        error = 'Something wrong happenned. Please try again';
        options = {...options, global:true,};

    }else if(response['status'] === 401){
        options = {...options, global:true,};

    }else{
        error = response['data']
    }

    dispatchErrorActions(error, options)
};

const handleErrorRequest = (request:object, options?:object) => {
    let _error = 'The server took to long to respond.';
    dispatchErrorActions(_error, {...options, global:true,})

}

const dispatchErrorActions = (error:any, options:object) => {
    const dispatch:Function = options['dispatch'];
    const _action:Function = options['action'];
    const isGlobal:boolean = options['global']

    if (dispatch && action) {
        isGlobal && dispatch(action.handleError(error, options));

        dispatch(_action({error, ...options}));
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


let timeStamp:Date = new Date();


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
        timeStamp   : timeStamp.getTime(),
    };

    let user:object = data['user']
    if (user) {
        let isSuperUser:boolean = user['is_superuser'];
        isSuperUser 
        && dispatch(action.getAdminSuccess({loginAuth}))
        dispatch(action.getCurrentUserSuccess(user));
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



