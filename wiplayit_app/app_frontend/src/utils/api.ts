

const Apis = {

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


    addPostBookMarkApi(id:number):string {
        return `api/post/${id}/bookmark/add/`
    },
    
    addAnswerBookMarkApi(id:number):string {
        return `api/answer/${id}/bookmark/add/`
    },  

    removeAnswerBookMarkApi(id:number):string {
        return `api/answer/${id}/bookmark/remove/`
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

    createUser():string {
        return `/rest-auth/registration/`;
    },

    logginUser():string {
        return `/rest-auth/login/`;
    },

    logoutUser():string {
        return `/rest-auth/logout/`;
    },

    passwordResetApi():string {
        return `/rest-auth/password/reset/`;
    },
    
    passwordChangeConfirmApi():string {
        return `/rest-auth/password/reset/confirm/`;
    },

    accountConfirmApi(key:string):string {
        return `/rest-auth/account-confirm-email/${key}/`;
    },

    accountConfirmPhoneNumberApi():string {
        return `rest-auth/account-confirm-phone-number/`
    },

    confirmationEmailResendApi():string{
        return `/rest-auth/confirmation/resend/`;
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

export default Apis;

