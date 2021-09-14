import  * as types  from 'actions/types';

let currentTimeStamp:Date = new Date();
let timeStamp = currentTimeStamp.getTime();


export const createActionPending = (params:object):object => {
             
    return{
        type : params['actionType']?.PENDING,
        byId : params['byId'],
        payLoad: {
           isCreating : true,
        }
    }
};

export const createActionSuccess = (params:object):object => {
        
    return{
        type : params['actionType']?.SUCCESS,
        byId : params['byId'] ,
        payLoad: {
            timeStamp,
            ...params['data'], 
            isCreating   : false,
        }
    };
};

export const createActionError = (params:object):object => {
    let error = params['error'];
    if (error && error.detail) {
        error = error.detail;
    }

    console.log(params)

    return {
        type : params['actionType']?.ERROR,
        byId : params['byId'],
        payLoad: {
           error,
           isCreating : false,
           created    : true,
        }
    }
};

export const updateActionPending = (params:object):object => {
    
    return {
        type : params['actionType']?.PENDING,
        byId : params['byId'],
        payLoad : {
            submitting : true,
            isUpdating : true,
        }
    }
};

export const updateActionSuccess = (params:object): object => {

    return {
        type : params['actionType']?.SUCCESS,
        byId: params['byId'],
        index:params['index'],

        payLoad: {
            timeStamp,
            ...params['data'],
            submitting : false,
            updated    : true,
            
        }
    };
};

export const updateActionError = (params:object):object => {
    let error = params['error'];
    if (error && error.detail) {
        error = error.detail;
    }

    console.log(params)
          
    return {
        type : params['actionType']?.ERROR,
        byId : params['byId'],
        payLoad: {
           error,
           submitting : false,
        }
    }
};

export const HandleAlertMessage = (message:object):object =>({

    type : "ALERT_MESSAGE",
    payLoad: {
        message,
    }
});

export const ModalSubmitPending = (modalName:string):object => ({
    type : "MODAL_SUBMIT_PENDING",
    byId : modalName,
    payLoad: {
        submitting : true,
    }
});

export const ModalSubmitSuccess = (params:object):object => {
    const isCreating:boolean = params['isCreating'];
    const isUpdating:boolean = params['isUpdating'];
              
    return{
        type : "MODAL_SUBMIT_SUCESS",
        byId : params['modalName'],
        payLoad : {
            ...params,
            submitting : false,
            updated : isUpdating || false,
            created : isCreating || false,
        }
        
    };
};

export const ModalSubmitError = (params:object):object => {
    let error:string = params['error'];
           
    return{
        type    : "MODAL_SUBMIT_ERROR",
        byId    : params['modalName'], 
        payLoad : {
            error,
            submitting : false,
            errorMessage: ``,
        }
    };
};

export const getAboutInfoPending = (params?:object):object => {

    return{
        type : 'ABOUT_PENDING',
        payLoad : {
            isLoading : true,
        }
    }
};

export const getAboutInfoSuccess = (data:object):object => {

    return{
        type    : 'ABOUT_SUCCESS',
        payLoad : {
            timeStamp,
            isLoading : false,
            info      : data,
        }
    }
};

export const getAboutInfoError = (params:object):object => {
    let error = params['error'];

    if (error && error.detail) {
        error = error.detail;
    }

    return{
        type    : 'ABOUT_ERROR',
        payLoad : {
            isLoading : false,
            error
        }
    }
};

export const getIndexPending = ():object => {

    return{
        type    : types.GET_INDEX['PENDING'],
        payLoad : {
            isLoading : true,
            isSuccess : false,
        }
    }
};

export const getIndexError = (params:object):object => {
    let error = params['error'];

    if (error && error.detail) {
        error = error.detail;
    }
    
    return{
        type    : types.GET_INDEX['ERROR'],
        payLoad : {
            error, 
            isLoading : false,
            isSuccess : false,
        }
    }
};

export const getIndexSuccess = (data:object) => {
        
    return {
        type: types.GET_INDEX['SUCCESS'],
        payLoad : {
            timeStamp,
            isLoading : false,
            isSuccess : true,
            ...data,
        }
    };
};

export const getQuestionPending = (byId:string):object => {
   
    return{
        type: types.GET_QUESTION['PENDING'],
        byId,
        payLoad: {
           isLoading : true,
        }
    }
};

export const getQuestionSuccess = (byId:string, question:object):object => {
   
    let userAnswer        = getUserAnswer(question['answers']);
    let userHasAnswer     = userAnswer?true:false;
    let answers           = question['answers']
    let questionHasAnswer = answers && answers.length && true || false;
   
    return {
        type: types.GET_QUESTION['SUCCESS'],
        byId,
        payLoad: {
            timeStamp,
            question, 
            questionHasAnswer,
            userAnswer,
            userHasAnswer,
            isLoading   : false,

        }
    };
};

export const getQuestionError = (params:object):object => {
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }

    return {
        type : types.GET_QUESTION['ERROR'],
        byId : params['byId'],
        payLoad: {
            error, 
            isLoading : false,
        }
    };
};

export const getUserAnswer = (answerList:[]):any => {
    let cacheEntities:object = JSON.parse(localStorage.getItem('@@CacheEntities')); 
    let currentUser:object =  cacheEntities['currentUser'];
    currentUser = currentUser && currentUser['user'];
    var answer  = undefined; 
      
    if (currentUser && answerList && answerList.length) {
        answerList.map( (item, index) => {

            if (item['author']['id'] === currentUser['id']) {
                answer = item;
            }
            return answer;
        });
    }

    return answer;
};

export const getPostPending = (byId:string) => {
   
    return{
        type : types.GET_POST['PENDING'],
        byId,
        payLoad: {
           isLoading          : true,
           post               : "",
           newObject          : "",
           commentList        : [],
           visited            : false,
           error              : '',
        }
    }
};

export const getPostSuccess = (byId:string ,post:object):object => {
      
    return{
        type : types.GET_POST['SUCCESS'],
        byId,
        payLoad: {
            post, 
            isLoading : false,
            timeStamp,
        }
    };
};

export const getPostError = (params:object) => {
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }

    return {
        type : types.GET_POST['ERROR'],
        byId : params['byId'],
        payLoad: {
           error, 
           isLoading : false,
        }
    }
};

export const getUserProfilePending = (byId:string):object => {
  
    return{
        type: types.GET_USER_PROFILE['PENDING'],
        byId,
        payLoad: {
            isLoading          : true,
        }
    };
};

export const getUserProfileSuccess = (byId:string, userProfile:object):object => {
      
    return{
        type: types.GET_USER_PROFILE['SUCCESS'],
        byId,
        payLoad: {
            user      : userProfile,
            isLoading : false,
            timeStamp,
        }
    };
};

export const getUserProfileError = (params:object) => {
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }

    return {
        type : types.GET_USER_PROFILE['ERROR'],
        byId: params['byId'],
        payLoad: {
            error, 
            isLoading : false,
        }
    };
};

export const deleteQuestionPending = (id:number):object => ({
    type:  types.DELETE_QUESTION['PENDING'],
    payLoad: {
        id
    }
});


export const deleteQuestionSuccess= ({ success }) => ({
    type:  types.DELETE_QUESTION['SUCCESS'],
    payLoad: {
        success,
    }
});

export const deleteQuestionError = (params:object) => ({
    type:  types.DELETE_QUESTION['ERROR'],
    payLoad : {
        error : params['byId'],
    }
});

export const getQuestionListSuccess = (byId:string, questionList:[]):object => {
    
    return {
	    type: types.GET_QUESTION_LIST['SUCCESS'],
        byId,
        payLoad: {
            questionList,
            isLoading : false,
            timeStamp,
        }
    }
};

export const getQuestionListPending = (byId:string):object => ({
	type: types.GET_QUESTION_LIST['PENDING'],
    byId,
    payLoad: {
        isLoading    : true,
    }
});

export const getQuestionListError = (params:object):object =>{
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }

    return{
	    type: types.GET_QUESTION_LIST['ERROR'],
        byId : params['byId'],
        payLoad: {
            error,
            isLoading: false,
        }
    };

};

export const getPostListSuccess = (byId:string, postList:[]):object => {
    return{
        type: types.GET_POST_LIST['SUCCESS'],
        byId,
        payLoad: {
            timeStamp,
            postList,
            isLoading : false,
        }
    }
};

export const getPostListPending = (byId:string):object => ({
    type: types.GET_POST_LIST['PENDING'],
    byId,
    payLoad: {
      isLoading  : true,
        
    }
});

export const getPostListError = (params):object => {
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }

    return{
        type: types.GET_POST_LIST['ERROR'],
        byId : params['byId'],
        payLoad: {
            error,
            isLoading: false,
        }
    };

};

export const getAnswerListSuccess = (byId:string, answerList:object[]):object => {

    return{
        type: types.GET_ANSWER_LIST['SUCCESS'],
        byId,
        payLoad: {
            timeStamp,
            answerList,
            isLoading : false,
        }
    };
};

export const getAnswerListPending = (byId:string):object => ({
    type: types.GET_ANSWER_LIST['PENDING'],
    byId,
    payLoad: {
        isLoading: true,
    }
});


export const getAnswerListError = (params:object):object => {
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }

    return{
        type: types.GET_ANSWER_LIST['ERROR'],
        byId:params['byId'],
        payLoad: {
            error,
            isLoading: false,
        }
    };

};

export const getCommentListSuccess = (byId:string, commentList:[]):object => {
 
    return{
        type: types.GET_COMMENT_LIST['SUCCESS'],
        byId,
        payLoad: {
            commentList,
            showLink  : false,
            isLoading : false,
        }
    };
};

export const getCommentListPending = (byId:string):object => {
  
    return{
        type: types.GET_COMMENT_LIST['PENDING'],
        byId,
        payLoad: {
            isLoading : true,
        }
    };
};

export const getCommentListError = (params:object) => {
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }
    
    return{
        type: types.GET_COMMENT_LIST['ERROR'],
        byId : params['byId'],
        payLoad: {
            error,
            isLoading: false,
            showLink:true,
        }
    };

};

export const getReplyListPending = (byId:string) => ({
    type : types.GET_REPLY_LIST['PENDING'],
    byId,
    payLoad : {
        showLink  : false,
        isLoading : true,
    },
   
});

export const getReplyListSuccess = (byId:string, replyList:[]):object => {

    return{
        type    : types.GET_REPLY_LIST['SUCCESS'],
        byId,
        payLoad : {
            replyList,
            isLoading  : false, 
        }
    };
};

export const getReplyListError = (params:object):object => {
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }
    
    return{
        type : types.GET_REPLY_LIST['ERROR'],
        byId :  params['byId'],
        payLoad : {
            error,
            isLoading : false,
        }
    }
};

export const handleError  = (error?:any, opts?:object):object => {
    if (typeof error === 'object') {
        error = error['detail']    
    }
    
    return {
        type: types.SERVER['ERROR'],
        payLoad: {
            error,
        }
    };
};


export const toggleAuthForm  = (options:object):object => {
    
    return {
        type: 'AUTH_FORM',
        payLoad: {
            ...options,
        }
    };
};



export const authenticationPending = (params?:object):object => ({

    type   : types.USER_AUTHENTICATION['PENDING'],
    payLoad : {
        isLoading : true,
        isSocialAuth : params['isSocialAuth'],   
        isTokenRefresh : params['isTokenRefresh'], 
    }
});

export const authenticationSuccess = (data:object, isSocialAuth?:boolean):object => {
          
    return {
        type : types.USER_AUTHENTICATION['SUCCESS'],
        payLoad : {
            timeStamp,
            ...data,
            isLoading  : false,
            isSocialAuth,
        }
    };
};

export const authenticationError = (params:object):object => {

    let error = params['error'];
    let isSocialAuth:boolean = params['isSocialAuth'];
    let isTokenRefresh:boolean = params['isTokenRefresh'];
    let formName:string = params['formName'];
   
    if(isSocialAuth && error['non_field_errors']){
        error = error.non_field_errors[0]
    }
    
    return {
        type   : types.USER_AUTHENTICATION['ERROR'],
        payLoad : {
            error,
            formName,
            isLoading : false,
            isSocialAuth,
            isTokenRefresh,
        }
    };
};

export const getCurrentUserSuccess = (user:object):object => {
 
    return {
        type    : types.GET_CURRENT_USER['SUCCESS'],
        payLoad : {
            user,
            timeStamp,
            isLoading   : false,
        }
    };
};

export const getCurrentUserPending = ():object => {
    
    return {
        type    : types.GET_CURRENT_USER['SUCCESS'],
        payLoad : {
            isLoading: true,
        }
    };
};


export const getCurrentUserError = (params:object):object => {
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }
    
    return {
        type   :types.GET_CURRENT_USER['ERROR'],
        payLoad : {
            error, 
            isLoading: false,
        }
    };
};

export const getUserListSuccess = (byId:string, users:[]):object => {
    
    return{
        type: types.GET_USER_LIST['SUCCESS'],
        byId,
        payLoad: {
            userList    : users,
            isLoading   : false,
            timeStamp,
       }
    };
};

export const getUserListPending = (byId:string):object => ({
    type: types.GET_USER_LIST['PENDING'],
    byId,
    payLoad: {
        isLoading : true,
    }
});

export const getUserListError = (params:object):object =>{
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }
    
    return{
        type: types.GET_USER_LIST['ERROR'],
        byId : params['byId'],
        payLoad: {
            error,
            isLoading: false,
        }
    }

};


export const getCommentLindData = (params:object):object => {
    const comments = params['comments'];
    const commentsCount:number = params['commentsCount'];

    const byId:string = params['commentsById'];
          
    return {     
        type   : 'GET_COMMENT_LINK_DATA',
        byId,
        payLoad : {
            showLink         : commentsCount > 1,
            commentList      : comments,
            isLoading        : false,
            commentsCount,
        }
    };
};

export const getRepliesLindData = (params:object) => {
   //console.log(props)
   const replies:object[] = params['replies'];
   var reply:object =  replies && replies[0];
   var byId:string = params['byId'];
   const repliesCount:number = params['repliesCount']
   
    return {
        byId,
        type : 'GET_REPLY_LINK_DATA',
        payLoad : {
            replyList  : replies,
            showLink   : repliesCount !== 0,
            isLoading  : false,
            linkData   : {
                reply,
                repliesCount,
            }
        },
    };
};


export const showModal = (byId:string, opening:boolean):object =>{
        
    return {
        type : 'MODAL_ROUTER',
        byId,
        payLoad : {
        modalIsOpen  : opening,
        
      }
   };
};

export const getAdminPending = ():object => {
    
    return {
        type    : 'ADMIN_PENDING',
        payLoad : {
            isLoading: true,
        }
    };
};

export const getAdminSuccess = (data:object):object => {

    return {
        type    : 'ADMIN_SUCCESS',
        payLoad : {
            ...data,
            isLoading: false,
            timeStamp,
        }
    };
};

export const getAdminError = (params:object):object => {
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }
    
    return {
        type    : 'ADMIN_ERROR',
        payLoad : {
            error,
            isLoading: false,
        }
    };
};

export const sendMessagePending = ():object => {
    
    return {
        type    : 'SEND_MESSAGE_PENDING',
        payLoad : {
            isLoading: true,
        }
    };
};

export const sendMessageSuccess = (data:object):object => {
    let successMessage = 'Message has succefully been sent';

    return {
        type    : 'SEND_MESSAGE_SUCCESS',
        payLoad : {
            data,
            isLoading   : false,
            messageSent : true,
            successMessage,
        }
    };
};

export const sendMessageError = (params:string):object => {
    let error = params['error'];
    
    if (error && error.detail) {
        error = error.detail;
    }
    
    return {
        type    : 'SEND_MESSAGE_ERROR',
        payLoad : {
            error,
            isLoading: false,
        }
    };
};





