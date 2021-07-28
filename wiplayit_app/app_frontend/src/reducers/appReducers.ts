import Helper, {cacheStoreData} from 'utils/helpers';
import  * as types  from 'actions/types';


const helper   = new Helper();

const updateStateEntyties = (stateEntintieKey:string, 
                             action:object, 
                             state:object ):object => {

    const byId:string = action['byId'];
    const payLoad:object = action['payLoad'];
    let oldState:object = state;
    let newState:object = {};
    let stateEntintie:object = oldState[stateEntintieKey];
                                      
    if (byId) {
        let  entintieData:object = stateEntintie[byId];
                  
        if(entintieData){
           stateEntintie[byId] = {...entintieData, ...payLoad};

        }else {
            let newEntitie = CreateNewEntities(action);
            stateEntintie = {...stateEntintie, ...newEntitie};
        }

    }else{
        stateEntintie = {...stateEntintie,...payLoad};
    
    }
    
    payLoad['timeStamp'] && cacheStoreData(stateEntintieKey, byId, stateEntintie);
    newState[stateEntintieKey] =  stateEntintie;

    return {...oldState, ...newState};
};


const CreateNewEntities = (action:object):object =>{
        
    let key = action['byId'];
    let data:object =  {
            value        : action['payLoad'], 
            writable     : true,
            configurable : true,
            enumerable   : true,
    }
        
    return  Object.defineProperty({}, key, data);
};


export const InitialState = ():object => {
  
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

    let newStateEntintie;

    const index:number = action['index']    
    const byId:string = action['byId'];
    const payLoad:object = action['payLoad'];
   
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
            let users:object  = state['users'][byId];
                        
            if (users) {
                users = users['userList'];
                users[index] = {...users[index], ...payLoad['user']}
                 
                action['payLoad']['userList'] = users
                            
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
            let question:object  = state['question'][byId]
            let questions:[] = state['questions'][byId];
            
            if (question) {
                question     = question['question'];
                payLoad['question'] = {...question, ...payLoad['question']}
              
                return updateStateEntyties('question', {byId, payLoad}, state);

            }else if(questions){
                let questionList:object[] = questions['questionList'] || [];
                questionList[index] = {...questionList[index], ...payLoad['question']};

                payLoad['questionList'] = questionList;
                          
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
            let updatedPost:object = payLoad['post'];
            let post:object = state['post'][byId];
            let posts:object = state['posts'][byId];
           
            if (post) {
                post = post['post'];
                payLoad['post'] = {...post, ...updatedPost}
              
                return updateStateEntyties('post', {byId, payLoad}, state);

            }else if(posts){
                let _posts = posts['postList'];
                _posts[index] = {..._posts[index], ...updatedPost};
               
                payLoad['postList'] = _posts;
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
            let previousAnswers =  state['answers'][byId];

            const answerList:object[] = previousAnswers['answerList'] || [];
            answerList.unshift(newAnswer);
           
            payLoad['answerList'] = answerList;
            delete payLoad['answer']; 
            return  updateStateEntyties('answers', {byId, payLoad}, state) || state;  
            


        case types.UPDATE_ANSWER['SUCCESS']:
            let answers:object[] = state['answers'][byId].answerList;
            let updatedAnswer:object = payLoad['answer'] || {};

            delete updatedAnswer['question'];
          
            answers[index] = {...answers[index], ...updatedAnswer};
            payLoad['answerList'] = answers;
           
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
            let newComment = payLoad['comment'];
            let newComments = [newComment];  
            let previousComments = state['comments'][byId];
      
            let commentList:object[] = previousComments?.commentList || [];
            commentList.unshift(newComment)
                
            payLoad['commentList'] = commentList;
            delete payLoad['comment'];
            return updateStateEntyties('comments', { byId, payLoad }, state) || state; 



        case types.UPDATE_COMMENT['SUCCESS']:
            let comments = state['comments'][byId];

            if (comments) {
                comments =   comments.commentList;
                comments[index] = {...comments[index], ...payLoad['comment']};
            
                payLoad['commentList'] =  comments;

                delete payLoad['comment'];
            }

            return updateStateEntyties('comments', {byId, payLoad }, state)|| state; 
      
            
        case  types.GET_REPLY_LIST['SUCCESS']:
        case  types.GET_REPLY_LIST['PENDING']:
        case  types.GET_REPLY_LIST['ERROR']:
        case  types.CREATE_REPLY['PENDING']:
        case  types.CREATE_REPLY['ERROR']:
        case  types.UPDATE_REPLY['PENDING']:
        case  types.UPDATE_REPLY['ERROR']:
        case  'GET_REPLY_LINK_DATA':
            return updateStateEntyties('replies', action, state);


        case types.CREATE_REPLY['SUCCESS']:
            let newReply:object = payLoad['reply'];
            let newReplies:object[] = [newReply];

            let previousReplies = state['replies'][byId];
            
            const replyList:object[] = previousReplies?.replyList || [];

            replyList.unshift(newReply); 
                              
            payLoad['replyList'] = replyList;
            delete payLoad['reply'];
            return updateStateEntyties('replies', {byId, payLoad }, state) || state;    

        case types.UPDATE_REPLY['SUCCESS']:
            let replies = state['replies'][byId]; 
          
            if (replies) {
                replies = replies.replyList;
                replies[index] = {...replies[index], ...payLoad['reply']}
                payLoad['commentList'] = replies

                delete payLoad['reply'];
            }
         
            return updateStateEntyties('replies', {byId, payLoad}, state)|| state


        case types.CREATE_BOOKMARK['PENDING']:
        case types.CREATE_BOOKMARK['ERROR']:
            return state

        case types.CREATE_BOOKMARK['SUCCESS']:
            let bookmarksType:string;

            if (byId === 'bookmarkedAnswers') {
                bookmarksType = 'answers'
                   
            }else{
                bookmarksType = 'posts'
            }

            let cache:object = JSON.parse(localStorage.getItem('@@CacheEntities')) || {};
            let indexData:object = cache['index'];
            
            let bookmarks:object = indexData && indexData['bookmarks'];
            let bookmarksCache:object[] = bookmarks && bookmarks[bookmarksType];

            let newBookmarks = payLoad[bookmarksType].bookmarks;
                                   
            for (var i = 0; i < bookmarksCache.length; i++) {
                let bookmark:object = bookmarksCache[i];
                let _newBookmark = newBookmarks[i];
                
                if (_newBookmark && bookmark['id'] ===  _newBookmark['id']) {
                    newBookmarks = []
                    break
                }
            }

            bookmarksCache = [...bookmarksCache, ...newBookmarks];
            
            delete action['payLoad'][bookmarksType]
            delete action['byId']

            bookmarks[bookmarksType] = bookmarksCache
                  
            indexData['bookmarks'] = bookmarks
            action['payLoad'] = {...indexData};
            
            updateStateEntyties('index', action, state);

            let message = getBookmarkSuccessMsg(bookmarksType);
            let alertMessageAction:object =  {
                payLoad:{
                    message
                }
            };

            return updateStateEntyties('alertMessage', alertMessageAction, state)
            
        default:
            return state; 
    }
}


const getBookmarkSuccessMsg = (messageType:string) =>{
    let textMessage:string;
    let bookmarkType:string;
     
    if (messageType === 'answers') {
        bookmarkType = 'Answer';
           
    } else if(messageType === 'posts'){
        bookmarkType = 'Post';
    }

    textMessage = `${bookmarkType} added to your bookmarks.`;

    return {textMessage, messageType:'success'};
};