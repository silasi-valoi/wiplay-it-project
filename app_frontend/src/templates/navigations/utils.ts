import { history } from "App"
import Apis from 'utils/api';
import {CREATE_QUESTION, CREATE_POST} from 'actions/types';
import { closeModals}   from  'containers/modal/helpers';

export const Redirect = props => {
    closeModals(true)
    
    let {pathname, state} = props;
    let location:object = history.location;
    let currentPath = location['pathname'];
    
    if (pathname != currentPath) {
        setTimeout(()=> {
            history.push(pathname, state); 
        }, 500);
    }
};


let editorLinkMobileStyles:object = {
    background : '#A33F0B !important',
    color      : '#fefefe', 
    border     : '1px solid blue',
    marginTop  : '7px',  
    fontWeight : 'bold',
    fontSize   : '12px',
    display    : 'flex',
    maxWidth   : '100%',
    width      : '100px', 
    
}

let editorLinkDesktopStyles:object = {
   background  : '#A33F0B',
   color       : '#fefefe',
   height      : '30px',
   margin      : '15px 7px 0',
   fontWeight  : 'bold',
}

export const createPostProps:object = {
    objName     : 'Post',
    linkName    : 'Add Post',
    isPost      : true,
    withTextArea: true,
    editorPlaceHolder : `Add Post...`,
    className   : "create-post-btn btn",
    editorLinkDesktopStyles,
    editorLinkMobileStyles,
    apiUrl : Apis.createPostApi(),
    actionType: CREATE_POST,
};

export const createQuestionProps:object = {
    objName      : 'Question',
    isPost       : true,
    withTextArea :true,
    linkName     : "Ask Question",
    editorPlaceHolder : `Add Question...`,
    className    : "create-question-btn btn",
    editorLinkMobileStyles,
    editorLinkDesktopStyles,
    actionType :  CREATE_QUESTION,
    apiUrl  : Apis.createQuestionApi()
};

export const authenticationProps:object = {
    authenticationType : 'Login',
    linkName  : "Login/Register",
    modalName : 'authenticationForm',
};
