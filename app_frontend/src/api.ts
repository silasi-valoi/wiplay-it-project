import axios from 'axios';

import GetTimeStamp from 'timeStamp';
import { getCookie } from 'utils';
import { authenticate } from "dispatch/index"
import {store} from 'store/index';

let csrftoken = getCookie('csrftoken');


export default class Axios {
    private cacheEntities:object;
    private DOMAIN_URL:string;
    private useToken:boolean;
    private timeout:number;

    constructor(props:object){
        this.cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities')) || {};
        this.DOMAIN_URL    =  window.location.origin; 
        this.useToken      =  props['useToken'];
        this.timeout       =  props['timeout'] || 20000; 
        
    };

    authTimeStampe(timeStamp){
        return new GetTimeStamp({timeStamp});
    };

    _getAuth = () => {
        
        if (this.cacheEntities) {
            let userAuth = this.cacheEntities['userAuth'];

            if (userAuth) {
                let loginAuth = userAuth['loginAuth'];

                if (loginAuth && loginAuth['tokenKey']) {
                   return loginAuth;
                }
            }
        }
        return null;
    };

    tokenExpired =():boolean => {
        let loginAuth  = this._getAuth();
        let expireTime = loginAuth && this.authTimeStampe(loginAuth.timeStamp);
        
        if (expireTime) {
            return expireTime.days() >= 1;
        }
        return true
    };

    refreshToken(){
        if(!this.useToken) return;
                        
        if (this.tokenExpired()) {
            
            let loginAuth = this._getAuth();
            let token = this.getToken(loginAuth);
            
            if(token){

                const authProps:object ={
                    apiUrl :Apis.refreshTokenApi(), 
                    form   :{token},
                    formName:'loginForm',
                    isTokenRefresh : true,
                    useToken : false,
                };

                if(!store.dispatch<any>(authenticate(authProps))){
                    this.useToken = false;
                }

                return;
            }

            this.useToken = false;
        }
    };
   
    getToken(loginAuth:object):string{
        return loginAuth && loginAuth['tokenKey']; 
    };

    createInstance=()=>{
        let instance = axios.create({
            baseURL: this.DOMAIN_URL,
        });

        instance.defaults.xsrfCookieName = csrftoken;
        instance.defaults.timeout = this.timeout;
        return instance;

    };

    instance = () => {
        const instance = this.createInstance();
        this.refreshToken();
       
        if (this.useToken) {
            
            let userAuth = this._getAuth();  
            let tokenKey = this.getToken(userAuth)
            
            if (tokenKey) {
                tokenKey =`JWT ${tokenKey}`;
                instance.defaults.headers.common['Authorization'] = tokenKey;
            }
        }
     
        return instance        
    };

};




export const Apis = {

    getDefaultProfilePicture():string{
        return `/api/default/profile/picture/`;
    },

    getContactAdminApi():string {
       return `/api/contact/admin/`;
    },

    getFeedBackApi():string {
       return `/api/feedback/`;
    },

    getBugReportApi():string {
       return `/api/bug/report/`;
    },

    getAdminApi():string {
       return `/api/admin/`;
    },

    updateAboutApi(id:number):string {
       return `/api/about/change/${id}/`;
    },

    createAboutApi():string {
        return `/api/about/create/`;
    },

    getAboutInfoApi():string {
        return `/api/about/`;
    },

    getCurrentUserApi():string {
        return `/api/current/user/`;
    },

    createDraftEditorContentsApi():string {
        return `api/draft/editor/contents/`;
    }, 

    getIndexApi():string {
        return `api/main/`;
    },      
    
    createPostApi():string {
        return `/api/create/post/`;;
    },

    createPostCommentApi(id:number):string {
        return `/api/create/post/${id}/comment/`; 
    },

    createPostReplyApi(id:number):string {
        return `/api/create/post/comment/${id}/reply/`;
    },
    
    createPostReplyChildApi(id:number):string {
        return `/api/create/post/reply/${id}/child/`;
    },

    createQuestionApi():string {
        return `/api/create/question/`;
    },
    
    createAnswerApi(id:number):string {
        return `/api/create/question/${id}/answer/`;
    },

    createAnswerCommentApi(id:number):string {
        return `/api/create/answer/${id}/comment/`;
    },

    createAnswerReplyApi(id:number):string {
        return `/api/create/answer/comment/${id}/reply/`;
    },

    createAnswerReplyChildApi(id:number):string {
        return `/api/create/answer/reply/${id}/child/`;
    },


    addPostBookmarkApi(id:number):string {
        return `api/post/${id}/bookmark/add/`
    },
    
    addAnswerBookmarkApi(id:number):string {
        return `api/answer/${id}/bookmark/add/`
    },  

    removeAnswerBookmarkApi(id:number):string {
        return `api/answer/${id}/bookmark/remove/`
    },   

    removePostBookmarkApi(id:number):string {
        return `api/post/${id}/bookmark/remove/`
    },

    getQuestionListApi():string {
        return `/api/question/list/`;
    }, 

    getPostListApi():string {
        return `/api/post/list/`;
    },

    getQuestionApi(id:number):string {
        return `/api/question/${id}/`;
    },  

    getPostApi(id:number):string {
        return `/api/post/${id}/`;
    },

    getPostCommentListApi(id:number) {
        return `/api/post/${id}/comment/list/`;
    },

    getPostCommentUpVotersListApi(id:number):string {
        return `/api/post/comment/${id}/upvoters/`;
    },

    getPostReplyListApi(id:number):string {
        return `/api/post/comment/${id}/reply/list/`;
    },

    getPostReplyUpVotersListApi(id:number):string {
        return `/api/post/reply/${id}/upvoters/`;
    },

    getPostReplyChildrenListApi(id:number):string {
        return `/api/post/reply/${id}/children/list/`;
    },  

    getQuestionFollowersListApi(id:number):string {
        return `/api/question/${id}/followers/`;
    },

    getUserFollowersListApi(id:number):string {
        return `/api/user/${id}/followers/`;
    },

    getUserFollowingsListApi(id:number):string {
        return `/api/user/${id}/followings/`;
    },
   
    getPostUpVotersListApi(id:number):string {
        return `/api/post/${id}/upvoters/`;
    },

    getAnswerUpVotersListApi(id:number):string {
        return `/api/answer/${id}/upvoters/`;
    },

    getAnswerCommentListApi(id:number):string {
        return `/api/answer/${id}/comment/list/`;
    },

    getAnswerCommentUpVotersListApi(id:number):string {
        return `/api/answer/comment/${id}/upvoters/`;
    },

    getAnswerReplyListApi(id:number):string {
        return `/api/answer/comment/${id}/reply/list/`;
    },
    
    getAnswerReplyChildrenListApi(id:number):string {
        return `/api/answer/reply/${id}/children/list/`;
    },

    getAnswerReplyUpVotersListApi(id:number):string {
        return `/api/answer/reply/${id}/upvoters/`;
    },

    getProfileApi(id:number):string {
        return `/api/profile/${id}/`;
    },
    
    getUserListApi():string {
        return  `/api/user/list/`;
    },

    updateProfileApi(id:number):string {
        return `/api/profile/${id}/edit/`;
    },

    updateUseNameApi(id:number):string {
        return `/api/profile/username/${id}/edit/`;
    },
        
    updateQuestionApi(id:number):string {
        return `/api/question/${id}/edit/`;
    },

    updateAnswerApi(id:number):string {
        return `/api/answer/${id}/edit/`;
    },
   
    updateAnswerCommentApi(id:number):string {
        return `/api/answer/comment/${id}/edit/`;
    },

    updateAnswerReplyApi(id:number):string {
        return `/api/answer/reply/${id}/edit/`;
    },

    updatePostApi(id:number):string {
        return `/api/post/${id}/edit/`;
    },

    updatePostCommentApi(id:number):string {
        return `/api/post/comment/${id}/edit/`;
    },
       
    updatePostReplyApi(id:number):string {
        return `/api/post/reply/${id}/edit/`;
    },

    deleteQuestionApi(id:number):string {
        return `/api/question/${id}/delete/`;
    },

    deleteAnswerApi(id:number):string {
        return `/api/answer/${id}/delete/`;
    },

    deleteAnswerCommentApi(id:number):string {
        return `/api/answer/comment/${id}/delete/`;
    },

    deleteAnswerReplyApi(id:number):string {
        return `/api/answer/reply/${id}/delete/`;
    },

    deletePostApi(id:number):string {
        return `/api/post/${id}/delete/`;
    },

    deletePostCommentApi(id:number):string {
        return `/api/post/comment/${id}/delete/`;
    },
       
    deletePostReplyApi(id:number):string {
        return `/api/post/reply/${id}/delete/`;
    },

    emailRegisterApi():string {
        return `/rest-auth/email/registration/`;
    },

    phoneNumberRegisterApi():string {
        return `rest-auth/phone/number/registration/`;
    },

    logginUserApi():string {
        return `/rest-auth/login/`;
    },

    logoutUser():string {
        return `/rest-auth/logout/`;
    },

    passwordResetApi():string {
        return `/rest-auth/password/reset/`
    },
    
    passwordChangeConfirmApi():string {
        return `/rest-auth/password/reset/confirm/`
    },

    accountConfirmationEmailApi(key:string):string {
        return `/rest-auth/account-confirm-email/${key}/`
    },

    accountConfirmPhoneNumberApi():string {
        return `/rest-auth/account-confirm-phone-number/`
    },

    accountConfirmationEmailSendApi():string{
        return `/rest-auth/confirmation/email/send/`
    },

    accountConfirmationSmsSendApi():string {
        return `rest-auth/confirmation/sms/send/`
    },

    passwordResetSmsConfirmApi():string {
        return `rest-auth/password-change-confirm-sms-code/`
    },

    passwordChangeApi():string {
        return `/rest-auth/password/change/`;
    },

    addEmailApi():string {
        return `/rest-auth/add/email/`;
    },

    addPhoneNumberApi():string {
        return `rest-auth/add/phone-number/`;
    },

    removeEmailApi():string {
        return `/rest-auth/remove/email/`;
    },

    removePhoneNumberApi():string {
        return `/rest-auth/remove/phone-number/`;
    },

    sendConfirmationEmailApi():string {
        return `/rest-auth/confirm/email/`
    },

    sendConfirmationCodeApi():string {
        return `/rest-auth/confirm/phone-number/`;
    },

    facebookLoginApi():string {
        return `/rest-auth/facebook/`;
    },

    twitterLoginApi():string {
        return `/rest-auth/twitter/`;
    },

    googleLoginApi():string {
        return `/rest-auth/google/`;
    },

    refreshTokenApi():string {
        return `/api-token-refresh/`;
    },
};


