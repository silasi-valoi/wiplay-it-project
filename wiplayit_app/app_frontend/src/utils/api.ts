


export default class Api{

    getDefaultProfilePicture(){
        return `/api/default/profile/picture/`;
    }

    getContactAdminApi() {
       return `/api/contact/admin/`;
    }

    getFeedBackApi() {
       return `/api/feedback/`;
    }

    getBugReportApi() {
       return `/api/bug/report/`;
    }

    getAdminApi() {
       return `/api/admin/`;
    }

    updateAboutApi(id) {
       return `/api/about/change/${id}/`;
    }

    createAboutApi(){
        return `/api/about/create/`;
    }

    getAboutInfoApi() {
        return `/api/about/`;
    }

    getCurrentUserApi() {
        return `/api/current/user/`;
    }

    createDraftEditorContentsApi(){
        return `api/draft/editor/contents/`;
    } 

    getIndexApi() {
        return `api/main/`;
    }      
    
    createPostApi() {
        return `/api/create/post/`;;
    }


    createPostCommentApi(id){
        return `/api/create/post/${id}/comment/`; 
    }

    createPostReplyApi(id){
        return `/api/create/post/comment/${id}/reply/`;
    }
    

    createPostReplyChildApi(id){
        return `/api/create/post/reply/${id}/child/`;
    }

    createQuestionApi() {
        return `/api/create/question/`;
    }
    
    createAnswerApi(id) {
        return `/api/create/question/${id}/answer/`;
    }

    createAnswerCommentApi(id) {
        return `/api/create/answer/${id}/comment/`;
    }

    createAnswerReplyApi(id){
        return `/api/create/answer/comment/${id}/reply/`;
    }

    createAnswerReplyChildApi(id){
        return `/api/create/answer/reply/${id}/child/`;
    }


    addPostBookMarkApi(id){
        return `api/post/${id}/bookmark/add/`
    }
    
    addAnswerBookMarkApi(id){
        return `api/answer/${id}/bookmark/add/`
    }  

    removeAnswerBookMarkApi(id){
        return `api/answer/${id}/bookmark/remove/`
    }   

    getQuestionListApi() {
        return `/api/question/list/`;
    }  

    getPostListApi() {
        return `/api/post/list/`;
    }

    getQuestionApi(id) {
        return `/api/question/${id}/`;
    }  

    getPostApi(id) {
        return `/api/post/${id}/`;
    }

    getPostCommentListApi(id) {
        return `/api/post/${id}/comment/list/`;
    }

    getPostCommentUpVotersListApi(id) {
        return `/api/post/comment/${id}/upvoters/`;
    }

    getPostReplyListApi(id) {
        return `/api/post/comment/${id}/reply/list/`;
    }

    getPostReplyUpVotersListApi(id) {
        return `/api/post/reply/${id}/upvoters/`;
    }

    getPostReplyChildrenListApi(id) {
        return `/api/post/reply/${id}/children/list/`;
    }  

    getQuestionFollowersListApi(id) {
        return `/api/question/${id}/followers/`;
    }

    getUserFollowersListApi(id) {
        return `/api/user/${id}/followers/`;
    }

    getUserFollowingsListApi(id) {
        return `/api/user/${id}/followings/`;
    }
   
    getPostUpVotersListApi(id) {
        return `/api/post/${id}/upvoters/`;
    }

    getAnswerUpVotersListApi(id) {
        return `/api/answer/${id}/upvoters/`;
    }


    getAnswerCommentListApi(id) {
        return `/api/answer/${id}/comment/list/`;
    }

    getAnswerCommentUpVotersListApi(id) {
        return `/api/answer/comment/${id}/upvoters/`;
    }


    getAnswerReplyListApi(id) {
        return `/api/answer/comment/${id}/reply/list/`;
    }

    
    getAnswerReplyChildrenListApi(id) {
        var api = `/api/answer/reply/${id}/children/list/`;
        return api;
    }


    getAnswerReplyUpVotersListApi(id) {
        var api = `/api/answer/reply/${id}/upvoters/`;
        return api;
    }

    getProfileApi(id ) {
        var api = `/api/profile/${id}/`;
        return api;
    }
    
    getUserListApi() {
        var api = `/api/user/list/`;
        return api;
    }

    updateProfileApi(id) {
        var api = `/api/profile/${id}/edit/`;
        return api;
    }


    updateUseNameApi(id) {
        var api = `/api/profile/username/${id}/edit/`;
        return api;
    }
    
    
    updateQuestionApi(id) {
        var api = `/api/question/${id}/edit/`;
        return api;
    }

    updateAnswerApi(id) {
        var api = `/api/answer/${id}/edit/`;
        return api;
    }
   

    updateAnswerCommentApi(id) {
        var api =   `/api/answer/comment/${id}/edit/`;
        return api;
    }

    updateAnswerReplyApi(id) {
        var api = `/api/answer/reply/${id}/edit/`;
        return api;
    }


    updatePostApi(id) {
        var api = `/api/post/${id}/edit/`;
        return api;
    }

    updatePostCommentApi(id) {
        var api = `/api/post/comment/${id}/edit/`;
        return api;
    }
   
    
    updatePostReplyApi(id) {
        var api = `/api/post/reply/${id}/edit/`;
        return api;
    }

    createUser() {
        var url = `/rest-auth/registration/`;
        return url;
    }

    logginUser() {
        var url = `/rest-auth/login/`;
        return url ;
         
    }

    logoutUser() {
        var url = `/rest-auth/logout/`;
        return url ;
         
    }

    passwordResetApi() {
        var url = `/rest-auth/password/reset/`;
        return url ;
         
    }
    
    passwordChangeConfirmApi() {
        var url = `/rest-auth/password/reset/confirm/`;
        return url ;
  
    }

    accountConfirmApi(key) {
        var url = `/rest-auth/account-confirm-email/${key}/`;
        return url ;
         
    }

    accountConfirmPhoneNumberApi(){
        return `rest-auth/account-confirm-phone-number/`
    }

    confirmationEmailResendApi(){
        return `/rest-auth/confirmation/resend/`;
    }

    passwordResetSmsConfirmApi(){
        return `rest-auth/password-change-confirm-sms-code/`

    }

    passwordChangeApi() {
        var url = `/rest-auth/password/change/`;
        return url ;
    }

    addEmailApi(){
        return `/rest-auth/add/email/`;
    };

    addPhoneNumberApi(){
        return `rest-auth/add/phone-number/`;
    };

    facebookLoginApi() {
        
        var url = `/rest-auth/facebook/`;
        return url ;
         
    }


    twitterLoginApi() {
        
        var url = `/rest-auth/twitter/`;
        return url ;
         
    }

    googleLoginApi() {
        
        var url = `/rest-auth/google/`;
        return url ;
         
    }

    refreshTokenApi(){
        return `/api-token-refresh/`;
    }
}



