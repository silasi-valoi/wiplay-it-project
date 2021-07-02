import Helper from 'utils/helpers';
import  * as types  from 'actions/types';


const helper   = new Helper();

const updateStateEntyties = (stateEntintieKey:string, 
                             params:object, 
                             state:object ):object => {

    const byId:string = params['byId'];
    const payLoad:object = params['payLoad'];
    let oldState:object = state;
    let newState:object = {};
    let stateEntintie:object = oldState[stateEntintieKey];
                                      
    if (stateEntintie && byId) {
                      
        if(stateEntintie[byId]){
            stateEntintie[byId] = {...stateEntintie[byId], ...payLoad};
                    
        }else {
            let newEntitie = CreateNewEntities(params);
            stateEntintie = {...stateEntintie, ...newEntitie}
        }

    }else{
        stateEntintie = {...stateEntintie,...payLoad}
    }

    newState[stateEntintieKey] =  stateEntintie;
    return {...oldState, ...newState};
};


const CreateNewEntities = (action:object):object =>{
        
    let key = action['byId'];
    let value =  {
            value        : action['payLoad'], 
            writable     : true,
            configurable : true,
            enumerable   : true,
    }
        
    return  Object.defineProperty({}, key, value );
};


const InitialState = ():object => {
  
    return {
        userAuth    : {},
        currentUser : {},
        userProfile : {},
        users       : {},
        index       : {},
        questions   : {},
        posts       : {},
        question    : {},
        post        : {},
        answers     : {},
        comments    : {},
        replies     : {},
        modal       : {},
        errors      : {},
        about       : {},
        admin       : {},
        message     : {},
        alertMessage : {}, 
    };
};


export function entities(state:object=InitialState(), action:object):object {

    let currentTimeStamp:Date = new Date();

    if (action['payLoad']) {
        action['payLoad'].timeStamp = currentTimeStamp.getTime();
    }
       
   
    let newStateEntintie;
    
    const byId:string = action['byId'];
    const payLoad:object = action['payLoad'];
    let updateAction    = {byId};
    let createAction    = {byId};

    switch (action['type']){
        case 'SERVER_ERROR':
            return updateStateEntyties('errors', action, state);

        case 'ALERT_MESSAGE':
            return updateStateEntyties('alertMessage', action, state);
       
        case 'ABOUT_SUCCESS':
        case 'ABOUT_ERROR':
        case 'ABOUT_PENDING':
        case 'CREATE_ABOUT_SUCCESS':
        case 'CREATE_ABOUT_PENDING':
        case 'CREATE_ABOUT_SUCCESS':
            return updateStateEntyties('about', action, state);

        case "ADMIN_SUCCESS":
        case "ADMIN_ERROR":
        case "ADMIN_PENDING":
            return updateStateEntyties('admin', action, state);

        case "SEND_MESSAGE_SUCCESS":
        case "SEND_MESSAGE_ERROR":
        case "SEND_MESSAGE_PENDING":
            return updateStateEntyties('message', action, state);

        case 'MODAL_ROUTER':
        case "MODAL_SUBMIT_PENDING":
        case "MODAL_SUBMIT_SUCESS":
        case "MODAL_SUBMIT_ERROR":
            return updateStateEntyties('modal', action, state);

            
    
        case types.USER_AUTHENTICATION['PENDING'] :
        case types.USER_AUTHENTICATION['SUCCESS']:
        case types.USER_AUTHENTICATION['ERROR']:
            return updateStateEntyties('userAuth', action, state);
      

        case types.GET_CURRENT_USER['SUCCESS']:
        case types.GET_CURRENT_USER['ERROR']:
        case types.GET_CURRENT_USER['PENDING']:
            return updateStateEntyties('currentUser', action, state);
              
       
        case types.GET_USER_PROFILE['PENDING']: 
        case types.GET_USER_PROFILE['SUCCESS']:
        case types.GET_USER_PROFILE['ERROR']:
        case types.UPDATE_USER_PROFILE['PENDING']:
        case types.UPDATE_USER_PROFILE['ERROR']:
            return updateStateEntyties('userProfile', action, state);
            
            

        case types.UPDATE_USER_PROFILE['SUCCESS']:

            let userProfileToUpdate:object = state['userProfile'][byId];
            userProfileToUpdate = userProfileToUpdate && userProfileToUpdate['user']
            let updatedUserProfile:object = payLoad['user'];

            payLoad['user'] = {
                ...userProfileToUpdate || {},
                ...updatedUserProfile || {}
            };

            return updateStateEntyties('userProfile', {byId, payLoad}, state);


        case types.GET_USER_LIST['SUCCESS']:
        case types.GET_USER_LIST['PENDING']:
        case types.GET_USER_LIST['ERROR']:
        case types.UPDATE_USER_LIST['PENDING']:
        case types.UPDATE_USER_LIST['ERROR']:
            return updateStateEntyties('users', action, state);

            

        case types.UPDATE_USER_LIST['SUCCESS']:
                        
            if (state['users'][byId]) {

                let updatedUser:object = payLoad['user'];
                let usersToUpdate:object  = state['users'][byId];
                usersToUpdate      = usersToUpdate['userList'];
                 
                action['payLoad']['userList'] = 
                            helper.updateReducerListEntynties(usersToUpdate, updatedUser);
                delete action['payLoad'].user
            }
                  
            return updateStateEntyties('users', action, state);  

      
        
        case types.GET_INDEX['PENDING']:
        case types.GET_INDEX['SUCCESS']:
        case types.GET_INDEX['ERROR']:
            return updateStateEntyties('index', action, state); 
                       

        case types.GET_QUESTION_LIST['SUCCESS']:
        case types.GET_QUESTION_LIST['PENDING']:
        case types.GET_QUESTION_LIST['ERROR']:
        case types.UPDATE_QUESTION['ERROR']:
        case types.UPDATE_QUESTION['PENDING']:
           
            return updateStateEntyties('questions', action, state);
           
       


        case types.CREATE_QUESTION['PENDING']:
        case types.CREATE_QUESTION['SUCCESS']:
        case types.CREATE_QUESTION['ERROR']:
        case types.GET_QUESTION['PENDING']:
        case types.GET_QUESTION['SUCCESS']:
        case types.GET_QUESTION['ERROR']:
        case types.UPDATE_QUESTION['ERROR']:
        case types.UPDATE_QUESTION['PENDING']:
            return updateStateEntyties('question', action, state);

            

        case types.UPDATE_QUESTION['SUCCESS']:
            let updatedQuestion = payLoad['question'];
            
            if (state['question'][byId]) {

                let question:object  = state['question'][byId]
                question     = question['question'];
                payLoad['question'] = {...question, ...updatedQuestion}
              
                return updateStateEntyties('question', {byId, payLoad}, state);

            }else if(state['questions'][byId]){
            
                let questions:[] = state['questions'][byId];
                let questionList:[] = questions['questionList'] || [];
                payLoad['questionList'] = 
                           helper.updateReducerListEntynties(
                                                questionList, 
                                                updatedQuestion
                                            );
                delete payLoad['question'];

                return updateStateEntyties('questions', {byId, payLoad}, state);

            };
            return state;
        

        case types.GET_POST_LIST['PENDING']:
        case types.GET_POST_LIST['SUCCESS']:
        case types.GET_POST_LIST['ERROR']:
        case types.UPDATE_POST['ERROR']:
        case types.UPDATE_POST['PENDING']:
            return updateStateEntyties('posts', action, state);
            
        case types.GET_POST['PENDING']:
        case types.GET_POST['SUCCESS']:
        case types.GET_POST['ERROR']:
        case types.UPDATE_POST['ERROR']:
        case types.UPDATE_POST['PENDING']:
            return updateStateEntyties('post', action, state);
        
   

        case types.UPDATE_POST['SUCCESS']:
            let updatedPost = payLoad['post'];
           
            if (state['post'][byId]) {

                let post:object = state['post'][byId]
                post            = post['post'];
                payLoad['post'] = {...post, ...updatedPost}
              
                return updateStateEntyties('post', {byId, payLoad}, state);

            }else if(state['posts'][byId]){
            
                let posts:[]        = state['posts'][byId];
                let postList        = posts['postList'] || [];
                payLoad['postList'] = helper.updateReducerListEntynties(
                                                      postList,
                                                      updatedPost
                                                    );
                delete payLoad['post'];

                return updateStateEntyties('posts', {byId, payLoad}, state);

            };
            return state;                 



        case types.GET_ANSWER_LIST['ERROR']:
        case types.GET_ANSWER_LIST['PENDING']:
        case types.GET_ANSWER_LIST['SUCCESS']:
        case types.CREATE_ANSWER['PENDING']:
        case types.CREATE_ANSWER['ERROR']:
        case types.UPDATE_ANSWER['PENDING']:
        case types.UPDATE_ANSWER['ERROR']:
            return updateStateEntyties('answers', action, state);
          
     
        case types.CREATE_ANSWER['SUCCESS']:
               
            let newAnswer:object =  payLoad['answer'];
            let newAnswerList  =  [newAnswer];
            let currentAnswers =  state['answers'][byId];
            currentAnswers     =  currentAnswers['answerList'];

            newAnswerList      =  currentAnswers.length &&
                                  currentAnswers.unshift(newAnswer) || newAnswerList;
           
            payLoad['answerList'] = Array.isArray(newAnswerList) && 
                        newAnswerList || currentAnswers;
            delete payLoad['answer']; 
            return  updateStateEntyties('answers', {byId, payLoad}, state)|| state;  
            


        case types.UPDATE_ANSWER['SUCCESS']:
            let updatedAnswer = payLoad['answer'];
            let answers:[] = state['answers'][byId].answerList;
            
            payLoad['answerList'] = helper.updateReducerListEntynties(
                                                        answers,
                                                        updatedAnswer
                                                    );
            delete payLoad['answer'];
            return updateStateEntyties('answers', {byId, payLoad}, state)|| state;


        case types.CREATE_COMMENT['PENDING']:
        case types.CREATE_COMMENT['ERROR']:
        case types.GET_COMMENT_LIST['PENDING']:
        case types.GET_COMMENT_LIST['SUCCESS']:
        case types.GET_COMMENT_LIST['ERROR']: 
        case types.UPDATE_COMMENT['PENDING']:
        case types.UPDATE_COMMENT['ERROR']:
        case 'GET_COMMENT_LINK_DATA':
            return updateStateEntyties('comments', action, state);

    
        case types.CREATE_COMMENT['SUCCESS']:
             
            let newComment           = payLoad['comment'];
            let newComments          = [newComment];  

            let currentNewComments = state['comments'][byId];
            currentNewComments = currentNewComments?.commentList;
            

            newComments = currentNewComments?.length &&
                          currentNewComments.unshift(newComment) || newComments;
                        
            payLoad['commentList'] = Array.isArray(newComments) && newComments;
            delete payLoad['comment'];
            return updateStateEntyties('comments', { byId, payLoad }, state) || state; 



        case types.UPDATE_COMMENT['SUCCESS']:
            
            let updatedComment = payLoad['comment'];
            let comments = state['comments'][byId];
            comments = comments['commentList']
            payLoad['commentList'] = helper.updateReducerListEntynties(
                                                       comments,
                                                       updatedComment
                                                    );
            delete payLoad['comment'];
         
            return updateStateEntyties('comments', {byId, payLoad }, state)|| state; 
      
            

        case  types.GET_REPLY_LIST['PENDING']:
        case  types.CREATE_REPLY['PENDING']:
        case  types.CREATE_REPLY['ERROR']:
        case  types.UPDATE_REPLY['PENDING']:
        case  types.UPDATE_REPLY['ERROR']:
        case  'GET_REPLY_LINK_DATA':
            return updateStateEntyties('replies', action, state);


        case types.CREATE_REPLY['SUCCESS']:
             
            let newReply            = payLoad['reply'];
            let newReplies          = [newReply];
            let currentNewReplies   = state['replies'][byId];
            currentNewReplies       = currentNewReplies?.replyList;

            newReplies = currentNewReplies?.unshift(newReply)
                                                  || newReplies;  
                       
            payLoad['replyList'] = Array.isArray(newReplies) && newReplies;
            delete payLoad['reply'];
            return updateStateEntyties('replies', {byId, payLoad }, state) || state;    

        case types.UPDATE_REPLY['SUCCESS']:
            let repliesToUpdate     = state['replies'][byId]; 
            let updatedReply        = payLoad['reply'];

            payLoad['commentList'] = helper.updateReducerListEntynties(
                                                        repliesToUpdate.replyList, 
                                                        updatedReply
                                                    );
            delete payLoad['reply'];
         
            return updateStateEntyties('replies', {byId, payLoad}, state)|| state


        case types.CREATE_BOOKMARK['PENDING']:
        case types.CREATE_BOOKMARK['ERROR']:
            return state

        case types.CREATE_BOOKMARK['SUCCESS']:
            console.log(action)
            let bookmarksType = '';

            if (byId === 'bookmarkedAnswers') {
                bookmarksType = 'answers'
                   
            } else {
                bookmarksType = 'posts'
            }

            let cache = JSON.parse(localStorage.getItem('@@CacheEntities')) || {};
            let indexData = cache?.index
            delete indexData.index

            let bookmarks = indexData.bookmarks
            let bookmarksCache = bookmarks[bookmarksType]
            let newBookmarks = payLoad[bookmarksType]
            
            for (var i = 0; i < bookmarksCache.length; i++) {
                if (bookmarksCache[i]?.id ===  newBookmarks[0]?.id) {
                    newBookmarks = []
                }
            }

            bookmarksCache = [...bookmarksCache, ...newBookmarks]
            delete  action['payLoad'][bookmarksType]
            delete action['byId']

            bookmarks[bookmarksType] = bookmarksCache
            console.log(bookmarks)
            console.log(indexData)

            indexData['bookmarks'] = bookmarks
            action['payLoad'] = {...indexData};
            console.log(indexData)
            console.log(bookmarksCache)
            console.log(newBookmarks, action['payLoad'] )

            return updateStateEntyties('index', action, state);
            
        default:
            return state; 
    }
}
