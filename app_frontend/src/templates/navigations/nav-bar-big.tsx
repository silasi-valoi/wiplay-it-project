
import React from 'react';
import { MatchMediaHOC } from 'react-match-media';
import { NavBarDropDown, NavigationMenu } from './menu';
import { OpenAuthModalBtn, OpenEditorBtn  } from "templates/buttons";

import Apis from 'utils/api';

import {CREATE_QUESTION, CREATE_POST} from 'actions/types';


let editorLinkMobileStyles = {
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

let editorLinkDesktopStyles = {
       background  : '#A33F0B',
       color       : '#fefefe',
       height      : '30px',
       margin      : '15px 7px 0',
       fontWeight  : 'bold',
    }

export const createPostProps = {
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

export const createQuestionProps = {
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

let authenticationProps = {
        authenticationType : 'Login',
        linkName  : "Login/Register",
        modalName : 'authenticationForm',
};


export const NavBar = props => {
    var {currentUser, isAuthenticated}       = props;
   
    const _createPostProps     = {
            ...createPostProps,
            currentUser,
            isAuthenticated,
    };

    const _createQuestionProps = {
        ...createQuestionProps,
        currentUser,
        isAuthenticated,
    };
      
    authenticationProps = {...authenticationProps, ...props};

    return(
			
        <nav className="navigation fixed-top" id="navigation">
            <div className="navigation-box">
                <div className="navigation-menu">
                    <div className="logo-box">
                        <div className="logo-img-box" 
                             onClick={() => console.log('Home')}>
                            <img alt="" 
                                 src={require("media/logo.png")}
                                 className="logo-img"/>
                        </div>
                    </div> 

                    <div className="nav-menu">
                        <NavigationMenu {...props}/>
                    </div> 
                    
                    <NavBarDropDown {...props}/>
          
                    <div className="post-question-box">
                        <div className="post-question-btn-box">
                            <ul className="create-question-btn-box">
                                <OpenEditorBtn {..._createQuestionProps}/>
                            </ul>
    
                            <p>Or</p>
                            
                            <ul className="create-post-btn-box">
                                <OpenEditorBtn {..._createPostProps}/>
                            </ul>
                        </div>
                    </div>

                    
                </div>
            </div>
            
            <ul className="navbar-login-link">
                <li className="">
                    { !isAuthenticated &&
                        <OpenAuthModalBtn {...authenticationProps}/>
                    }
                </li> 

            </ul>
            
        </nav>
    );
};



const NavBarBigScreen = MatchMediaHOC(NavBar,'(min-width: 980px)');
export default NavBarBigScreen;

