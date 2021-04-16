


export default class Api{

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
        var api = `/api/current/user/`;
        return api
    }

   createDraftEditorContentsApi(){
    var api =   `api/draft/editor/contents/`;
    return api;
   } 

    getIndexApi() {
        
        var api = `api/main/`;
        return api;
    }      
    
    createPostApi() {
        var api = `/api/create/post/`;
        return api;
    }


    createPostCommentApi(id){
       var api = `/api/create/post/${id}/comment/`;
       return api; 
    }

    createPostReplyApi(id){
       var api = `/api/create/post/comment/${id}/reply/`;
        return api;
    }
    

    createPostReplyChildApi(id){
       var api = `/api/create/post/reply/${id}/child/`;
        return api;
    }

    createQuestionApi() {
        var api = `/api/create/question/`;
        return api;
    }
    
    createAnswerApi(id) {
        var api = `/api/create/question/${id}/answer/`;
        return api;
    }

    createAnswerCommentApi(id) {

        var api = `/api/create/answer/${id}/comment/`;
        return api;

    }

    createAnswerReplyApi(id){
       var api = `/api/create/answer/comment/${id}/reply/`;
        return api;
    }

    createAnswerReplyChildApi(id){
       var api = `/api/create/answer/reply/${id}/child/`;
        return api;
    }


    AddPostBookMarkApi(id){
        return `api/post/${id}/bookmark/add/`
    }
    
    AddAnswerBookMarkApi(id){
        return `api/answer/${id}/bookmark/add/`
    }  

    removeAnswerBookMarkApi(id){
        return `api/answer/${id}/bookmark/remove/`
    }   

    getQuestionListApi() {
        var api = `/api/question/list/`;
        return api;
    }  

    getPostListApi() {
        var api = `/api/post/list/`;
        return api;
    }



     getQuestionApi(id) {
        var api = `/api/question/${id}/`;
        return api;
    }  

    getPostApi(id) {
        var api = `/api/post/${id}/`;
        return api;
    }


    getPostCommentListApi(id) {
        var api = `/api/post/${id}/comment/list/`;
        return api;
    }

    getPostCommentUpVotersListApi(id) {
        var api = `/api/post/comment/${id}/upvoters/`;
        return api;
    }


    getPostReplyListApi(id) {
        var api = `/api/post/comment/${id}/reply/list/`;
        return api;
    }

    getPostReplyUpVotersListApi(id) {
        var api = `/api/post/reply/${id}/upvoters/`;
        return api;
    }


    getPostReplyChildrenListApi(id) {
        var api = `/api/post/reply/${id}/children/list/`;
        return api;
    }  

    getQuestionFollowersListApi(id) {
        var api = `/api/question/${id}/followers/`;
        return api;
    }

    getUserFollowersListApi(id) {
        var api = `/api/user/${id}/followers/`;
        return api;
    }

    getUserFollowingsListApi(id) {
        var api = `/api/user/${id}/followings/`;
        return api;
    }
    

    getPostUpVotersListApi(id) {
        var api = `/api/post/${id}/upvoters/`;
        return api;
    }

    getAnswerUpVotersListApi(id) {
        var api = `/api/answer/${id}/upvoters/`;
        return api;
    }


    getAnswerCommentListApi(id) {
        var api = `/api/answer/${id}/comment/list/`;
        return api;
    }

    getAnswerCommentUpVotersListApi(id) {
        var api = `/api/answer/comment/${id}/upvoters/`;
        return api;
    }


    getAnswerReplyListApi(id) {
        var api = `/api/answer/comment/${id}/reply/list/`;
        return api;
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



