

const asyncActionType = (type:string):object => {
	//console.log(type)
    return {
        PENDING : `${type}_PENDING`,
        SUCCESS : `${type}_SUCCESS`,
        ERROR   : `${type}_ERROR`,
    }
}


const asyncActionToggleType = (type:string):object => ({
   SIGNUP_FORM         : `${type}_SIGNUP_FORM`,
   PASSWORD_RESET_FORM : `${type}_PASSWORD_RESET_FORM`,
   MODAL               : `${type}_MODAL`,
   
})


const actionType = (type:string):object => ({
    ABOUT                   : `${type}_ABOUT`,
    BOOKMARK                : `${type}_BOOKMARK`,
    INDEX                   : `${type}_INDEX`,
    QUESTION                : `${type}_QUESTION`,
    POST                    : `${type}_POST`,
    ANSWER                  : `${type}_ANSWER`,
    COMMENT                 : `${type}_COMMENT`,
    REPLY                   : `${type}_REPLY`,
    REPLY_CHILD             : `${type}_REPLY_CHILD`,
    USER_PROFILE            : `${type}_USER_PROFILE`,
    CURRENT_USER            : `${type}_CURRENT_USER` ,
    USER_LIST               : `${type}_USER_LIST`, 

    QUESTION_LIST                : `${type}_QUESTION_LIST`, 
    POST_LIST                    : `${type}_POST_LIST`,
    ANSWER_LIST                  : `${type}_ANSWER_LIST`,
    COMMENT_LIST                 : `${type}_COMMENT_LIST`, 
    REPLY_LIST                   : `${type}_REPLY_LIST`, 
    REPLY_CHILD_LIST             : `${type}_REPLY_CHILD_LIST`, 
    REPLY_GRAND_CHILD_LIST       : `${type}_REPLY_GRAND_CHILD_LIST`, 
    REPLY_GREAT_GRAND_CHILD_LIST : `${type}_REPLY_GREAT_GRAND_CHILD_LIST`, 
});




export const USER_AUTHENTICATION  = asyncActionType("USER_AUTHENTICATION");
export const DEBUG                = asyncActionType('DEBUG'); 
export const SERVER               = asyncActionType('SERVER'); 


export const TOGGLE               = asyncActionToggleType("TOGGLE");

export const UPDATE               = actionType('UPDATE');
export const CREATE               = actionType('CREATE');
export const GET                  = actionType('GET');
export const DELETE               = actionType('DELETE');

export const GET_INDEX            = asyncActionType(GET['INDEX']);

export const GET_CURRENT_USER     = asyncActionType(GET['CURRENT_USER']);

export const GET_USER_LIST        = asyncActionType(GET['USER_LIST']);

export const DELETE_QUESTION      = asyncActionType("DELETE_QUESTION"); 
export const DELETE_POST          = asyncActionType("DELETE_POST");
export const GET_QUESTION         = asyncActionType(GET['QUESTION']);
export const GET_POST             = asyncActionType(GET['POST']);
export const GET_USER_PROFILE     = asyncActionType(GET['USER_PROFILE']);

export const GET_QUESTION_LIST     = asyncActionType(GET['QUESTION_LIST']);
export const GET_POST_LIST         = asyncActionType(GET['POST_LIST']);
export const GET_ANSWER_LIST       = asyncActionType(GET['ANSWER_LIST'])
export const GET_COMMENT_LIST            = asyncActionType(GET['COMMENT_LIST']);
export const GET_REPLY_LIST              = asyncActionType(GET['REPLY_LIST']);
export const GET_REPLY_CHILD_LIST        = asyncActionType(GET['REPLY_CHILD_LIST']);
export const GET_REPLY_GRAND_CHILD_LIST  = asyncActionType(GET['REPLY_GRAND_CHILD_LIST']);

export const GET_REPLY_GREAT_GRAND_CHILD_LIST = 
                asyncActionType(GET['REPLY_GREAT_GRAND_CHILD_LIST']);

export const CREATE_ABOUT        = asyncActionType(CREATE['ABOUT']);
export const CREATE_BOOKMARK     = asyncActionType(CREATE['BOOKMARK']);
export const CREATE_QUESTION     = asyncActionType(CREATE['QUESTION']);
export const CREATE_POST         = asyncActionType(CREATE['POST']);
export const CREATE_ANSWER       = asyncActionType(CREATE['ANSWER']);
export const CREATE_COMMENT      = asyncActionType(CREATE['COMMENT']);
export const CREATE_REPLY        = asyncActionType(CREATE['REPLY']);
export const CREATE_REPLY_CHILD  = asyncActionType(CREATE['REPLY_CHILD']);


export const UPDATE_QUESTION      = asyncActionType(UPDATE['QUESTION']);
export const UPDATE_QUESTION_LIST = asyncActionType(UPDATE['QUESTION_LIST']);
export const UPDATE_POST          = asyncActionType(UPDATE['POST']);
export const UPDATE_ANSWER        = asyncActionType(UPDATE['ANSWER'])
export const UPDATE_REPLY         = asyncActionType(UPDATE['REPLY']);
export const UPDATE_COMMENT       = asyncActionType(UPDATE['COMMENT']);
export const UPDATE_USER_PROFILE  = asyncActionType(UPDATE['USER_PROFILE']);
export const UPDATE_USER_LIST     = asyncActionType(UPDATE['USER_LIST']);
export const UPDATE_ABOUT         = asyncActionType(UPDATE['ABOUT']);









