import  * as types  from 'actions/types';


export const createActionPending = (params:object):object => {
    console.log(params, 'PENDING')
    
    return{
        type : params['actionType'].PENDING,
        byId : params['byId'],
        payLoad: {
           isCreating : true,
        }
    }
};

export const createActionSuccess = (params:object):object => {
    console.log(params, 'success')
    
    return{
        type : params['actionType'].SUCCESS,
        byId : params['byId'] ,
        payLoad: {
            ...params['data'], 
            isCreating   : false,
        }
    };
};

export const createActionError = (params:object):object => {
    console.log(params, 'ERROR')
    
    let error =  params['error'].detail; 

    return {
        type : params['actionType'].ERROR,
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
        type : params['actionType'].PENDING,
        byId : params['byId'],
        payLoad : {
            submitting : true,
            isUpdating : true,
        }
    }
};

export const updateActionSuccess = (params:object): object => {

    return{
        type : params['actionType'].SUCCESS,
        byId: params['byId'],
        payLoad: {
            ...params['data'],
            submitting : false,
            updated    : true,
      }
   };
};

export const updateActionError = (params:object):object => {
           
    return {
        type : params['actionType'].ERROR,
        byId : params['byId'],
        payLoad: {
           error: params['error'],
           submitting : false,
        }
    }
};

export const HandleAlertMessage = (message:any):object =>({

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
              
    return{
        type : "MODAL_SUBMIT_SUCESS",
        byId : params['modalName'],
        payLoad : {
            ...params,
            submitting : false,
            updated    : params['isUpdating'] || false,
            created    : params['isCreating'] || false,
        }
        
    };
};

export const ModalSubmitError = (params:object):object => {
        
    return{
        type    : "MODAL_SUBMIT_ERROR",
        byId    : params['modalName'], 
        payLoad : {
            error:params['error'],
            submitting : false,
            errorMessage: ``,
        }
    };
};

export const getAboutInfoPending = ():object => {

    return{
        type    : 'ABOUT_PENDING',
        payLoad : {
            isLoading : true,
        }
    }
};

export const getAboutInfoSuccess = (data:object):object => {

    return{
        type    : 'ABOUT_SUCCESS',
        payLoad : {
            isLoading : false,
            info      : data
        }
    }
};

export const getAboutInfoError = (error:string):object => {

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

export const getIndexError = (error:string):object => {
    
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
   
    return{
        type: types.GET_QUESTION['SUCCESS'],
        byId,
        payLoad: {
            question, 
            questionHasAnswer,
            userAnswer,
            userHasAnswer,
            isLoading   : false,

      }
   };
};

export const getQuestionError = (byId:string, error:string):object => ({
    type         : types.GET_QUESTION['ERROR'],
    byId ,
    payLoad: {
      error, 
      isLoading : false,
    }
});

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

        }
    };
};

export const getPostError = (byId:string, error:string) => ({
    type : types.GET_POST['ERROR'],
    byId,
    payLoad: {
       error, 
       isLoading : false,
    }
});

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
        }
    };
};

export const getUserProfileError = (byId:string, error:string) => ({
    type : types.GET_USER_PROFILE['ERROR'],
    byId,
    payLoad: {
       error, 
       isLoading : false,
    }
});

export const deleteQuestionPending = (id :number):object => ({
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

export const deleteQuestionError = ({error}) => ({
  type:  types.DELETE_QUESTION['ERROR'],
  payLoad: {
    error,
  }
});

export const getQuestionListSuccess = (byId:string, questionList:[]):object => {
    
    return{
	   type: types.GET_QUESTION_LIST['SUCCESS'],
      byId,
      payLoad: {
         questionList,
         isLoading   : false,
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

export const getQuestionListError = (byId:string, error:string):object =>({
	type: types.GET_QUESTION_LIST['ERROR'],
    byId,
    payLoad: {
        error,
        isLoading: false,
    }

});

export const getPostListSuccess = (byId:string, postList:[]):object => {
    return{
      type: types.GET_POST_LIST['SUCCESS'],
      byId,
      payLoad: {
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

export const getPostListError = (byId:string, error:string):object =>({
    type: types.GET_POST_LIST['ERROR'],
    byId,
    payLoad: {
        error,
        isLoading: false,
    }

});

export const getAnswerListSuccess = (byId:string, answerList:object[]):object => {

    return{
        type: types.GET_ANSWER_LIST['SUCCESS'],
        byId,
        payLoad: {
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

export const getAnswerListError = (byId:string, error:string):object =>({
    type: types.GET_ANSWER_LIST['ERROR'],
    byId,
    payLoad: {
        error,
        isLoading: false,
    }

});

export const getCommentListSuccess = (byId:string, comments:[]):object => {
   
    return{
        type: types.GET_COMMENT_LIST['SUCCESS'],
        byId,
        payLoad: {
            comments,
            showLink : false,
        }
    };
};

export const getCommentListPending = (byId:string):object => {
  
  return{
    type: types.GET_COMMENT_LIST['PENDING'],
    byId,
    payLoad: {
        showLink    : false,
    }
  };
};

export const getCommentListError = (byId:string, error:string) =>({
   type: types.GET_COMMENT_LIST['ERROR'],
   byId,
   payLoad: {
    error,
    isLoading: false,
  }

});

export const getReplyListPending = (actionType:any, byId:string) => ({
   type    : actionType.PENDING,
   byId,
   payLoad : {
      showLink    : false,
   },
   
});

export const getReplyListSuccess = (actionType:any, byId:string, replyList:[]):object => {
    return{
      type    : actionType.SUCCESS,
      byId,
      payLoad : {
         replyList  : replyList,
         isLoading  : false, 
      }
   };
};

export const getReplyListError = (actionType:any, byId:string, error:string):object =>({
   type    : actionType.ERROR,
   byId,
   payLoad : {
      error,
      isLoading   : false,
   }
});


export const handleError  = (error?:string):object => {
    console.log(error)
    if (!error) {
        error = 'Something wrong happened.'
    }
    
    return {
        type: types.SERVER['ERROR'],
        payLoad: {
            error,
        }
    };
};

export const authenticationPending = (
                isSocialAuth:boolean=false, 
                isTokenRefresh:boolean=false):object => ({

    type   : types.USER_AUTHENTICATION['PENDING'],
    payLoad : {
        isLoading : true,
        isSocialAuth,   
        isTokenRefresh, 
    }
});

export const authenticationSuccess = (data:object, 
                                      isSocialAuth:boolean=false,
                                      isTokenRefresh:boolean=false):object => {
        
    return {
        type   : types.USER_AUTHENTICATION['SUCCESS'],
        payLoad : {
            ...data,
            isLoading  : false,
            isSocialAuth,
        }
    };
};

export const authenticationError = (
                            error:object, 
                            formName?:string,
                            isSocialAuth?:boolean, 
                            isTokenRefresh?:boolean):object => {

    console.log(error, isTokenRefresh, isSocialAuth)
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

export const getUserListSuccess = (byId:string, users:[]):object => {
    
    return{
        type: types.GET_USER_LIST['SUCCESS'],
        byId,
        payLoad: {
            userList    : users,
            isLoading   : false,
       }
    }
};

export const getUserListPending = (byId:string):object => ({
    type: types.GET_USER_LIST['PENDING'],
    byId,
    payLoad: {
        isLoading : true,
    }
});

export const getUserListError = (byId:string, error:string):object =>({
    type: types.GET_USER_LIST['ERROR'],
    byId,
    payLoad: {
        error,
        isLoading: false,
    }

});

export const getCurrentUserError = (error:object):object => {
    console.log(error)
    return {
        type   :types.GET_CURRENT_USER['ERROR'],
        payLoad : {
            error: error['data'], 
            isLoading: false,
        }
    };
};

export const getCommentLindData = (byId:string, comments:object[]):object => {
          
    return {     
        type   : 'GET_COMMENT_LINK_DATA',
        byId,
        payLoad : {

            showLink         : comments.length > 1,
            commentList      : comments,
            isLoading        : false,
            error            : '',
            linkData : {
                comment         : comments[0],
                numOfComments   : comments.length,
            
            },
        }
    };
};

export const getRepliesLindData = (props:object) => {
   //console.log(props)
   const replies:object[] = props['replies'];
   var reply:object =  replies && replies[0];
   var byId:string = props['byId'];
   
    return {
        type : props['actionType'],
        byId,
        payLoad : {
            replyList  : replies,
            showLink   : replies && replies.length !== 0,
            isLoading  : false,
            linkData   : {
                reply,
                totalReplies : replies && replies.length,
            }
        },
    };
};


export const showModal = (byId:string, isOpening:boolean):object =>{
    
    return {
        type : 'MODAL_ROUTER',
        byId,
        payLoad : {
        modalIsOpen  : isOpening,
        
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
        }
    };
};

export const getAdminError = (error:object):object => {
    
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

export const sendMessageError = (error:string):object => {
    
    return {
        type    : 'SEND_MESSAGE_ERROR',
        payLoad : {
            error,
            isLoading: false,
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



