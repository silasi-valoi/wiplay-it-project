
import React from 'react';
import {  Link, BrowserRouter } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import * as Icon from 'react-feather';
import {Redirect} from './utils';
import { OpenAuthModalBtn,
         OpenUsersModalBtn,
         ModalCloseBtn,
         LinkButton,
         OpenEditorBtn  } from "templates/buttons";
import { Modal}   from  "containers/modal/modal-container";

import Apis from 'utils/api';
import { closeModals}   from  'containers/modal/helpers';
import {CREATE_QUESTION, CREATE_POST} from 'actions/types';

import { history } from "App"



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

export const NavBarMenuItems = props => {
    let {currentUser, isAuthenticated} = props;
    let profile = currentUser && currentUser.profile;
          
    let state = {userProfile : currentUser, isAuthenticated};
    
    let pathToProfile = currentUser && `/profile/${currentUser.id}/${currentUser.slug}/`;
    let toProfileProps = {pathname:pathToProfile, state};

  
    return(
        <BrowserRouter>
            <div id="" className="menu-img-container">
                <div className="menu-img-box" 
                     onClick={() => Redirect(toProfileProps)}> 
                    {profile &&
                       <img alt="" src={profile['profile_picture']} className="menu-img"/>
                    }
                </div>

                <ul className="menu-username-box">
                    <li className="menu-username"  
                        onClick={() => Redirect(toProfileProps)}>
                        {currentUser && currentUser.first_name} {''} 
                        {currentUser && currentUser.last_name} 
                    </li>
                    <li className="menu-user-credential" >
                        {profile && profile.credential} 
                    </li>
                </ul>
            </div>
            <div className="menu-btn-container">
                <button type="button"
                        onClick={() => Redirect({pathname:'/help/'})}
                        className="dropdown-item">
                    Help
                </button>

                <button type="button"
                        onClick={() => Redirect({pathname:'/feedback/'})}
                        className="dropdown-item">
                    Feedback
                </button>

                <button type="button"
                        onClick={() => Redirect({pathname:'/bookmarks/'})}
                        className="btn dropdown-item">
                    Bookmarks
                </button>


                <button type="button"
                        onClick={() => Redirect({pathname:'/settings/'})}
                        className="dropdown-item">
                    Settings
                </button> 

                <button type="button"
                        onClick={() => Redirect({pathname:'/about/'})}
                        className="dropdown-item">
                    About
                </button>   

                <button type="button"
                        onClick={() => Redirect({pathname:'/privacy/'})}
                        className="dropdown-item">
                    Privacy
                </button>  
                <div className="dropdown-divider"></div>
                {isAuthenticated &&
            
                    <button  onClick={props.logout} className="logout-btn">
                        Logout
                    </button>
                }
            </div>
        </BrowserRouter>
    )
}


export const NavBarDropDown = props => {
    let { currentUser, isAuthenticated } = props;
    let profile = currentUser && currentUser.profile;
       
    return(
        
        <div className="navigation-img-box">
            { isAuthenticated &&
                    
                <ul className="nav-bar-img-box">
                    <li className="dropleft" id="navBardropdown" 
                    data-toggle="dropdown"
                    aria-haspopup="false" 
                    aria-expanded="true"> 
                        { profile && 
                            <img alt="" 
                                 src={profile.profile_picture}
                                className="nav-bar-img"/>
                        }
                    </li>

                    <li className="dropdown-menu nav-dropdown-menu"
                        aria-labelledby="navBardropdown">
                        <NavBarMenuItems {...props}/>
                    </li>
                </ul>
            }

            
        </div>
    )
}

export const ModalMenu = props =>{
     
    return(
        <div className="">
            <div className="nav-bar-menu-header">
                <ul className="nav-bar-menu-title-box">
                    <li>Your Account</li>
                </ul>

                <button type='button' 
                        onClick={()=> closeModals(true)}
                        className="btn-sm nav-bar-menu-close-btn">
                    <span className="dismiss-nav-bar-menu-icon">
                        &times;
                    </span>
                </button>
            </div>
            <div className="nav-bar-modal-menu-box">
                <NavBarMenuItems {...props}/>
            </div>
        </div>
    )

}


export const ModalMenuToggle = props => {
    let {isAuthenticated, currentUser, logout} = props;
    if (!currentUser) return null;
    if (!isAuthenticated) return null;

    let profile = currentUser.profile;
    
    let modalProps = {
            ...props,
            modalName : 'navigationMenu', 
        };

    return(
        
        <div className="navigation-img-box">

            <div className="nav-bar-modal-menu" id="nav-bar-modal-menu">
                <div className="nav-bar-img-box"> 
                    {profile && 
                        <img alt="" 
                             onClick={()=> Modal(modalProps)}
                             src={profile.profile_picture}
                             className="nav-bar-img"/>
                    }
                </div>
            </div>
        </div>
    )
};



export const NavBarBottom = props =>{
     
    
    return (
        <div className="navigation-bar-mobile">
            <NavigationMenu {...props}/>
        </div>
        )
}

export const NavigationMenu =(props)=>{
    let {homeTab,
         questionListTab,
         usersTab,
         currentUser,
         isAuthenticated,
         notificationsTab} = props || {};

    

    return(
        <div className="navbar-menu">
            <ul  className="navbar-item">
                <button
                    type="button"
                    style={homeTab}
                    onClick={() => Redirect({pathname:'/'})}
                    className="btn-sm navbar-btn">
                    <Icon.Home 
                        id="feather-home" 
                        size={20} 
                        {...homeTab}
                    />
                    Home
                </button> 
            </ul>

            <ul  className="navbar-item">
                <OpenUsersModalBtn {...{currentUser, isAuthenticated}}>
                    <Icon.Users id="feather-users" size={20} {...usersTab}/>
                    People
                </OpenUsersModalBtn>
            </ul>

            <ul className="navbar-item">
                <button
                    type="button"
                    style={questionListTab}
                    onClick={() => Redirect({pathname:'/questions/'})}
                    className="btn-sm navbar-btn answer-question-btn">
                    <Icon.Edit 
                        id="feather-edit"
                        size={20}
                        {...questionListTab}
                    />
                    Answer
               </button>
            </ul>
                
            <ul  className="navbar-item">
                <button 
                    type="button"
                    style={notificationsTab}
                    onClick={() => Redirect({pathname:'/notifications/'})}
                    className="btn-sm navbar-btn notifications-btn">
                    <Icon.Bell 
                        id="feather-bell"
                        size={20}
                        {...notificationsTab}
                    />
                    Notifications
                </button>
            </ul> 
        </div> 
    );
}

export const NavigationBarBottom = MatchMediaHOC(
                                      NavBarBottom, 
                                      '(max-width: 980px)'
                                    );


export const EditProfileNavBar = props  => {

    let {submitting, userProfile } = props;
    let submitButtonStyles = submitting?{opacity:'0.60'}:{};
    let fieldSetStyles     = submitting? {opacity:'0.60'}:{};

    const BackBtn = () => {
        let backButton;
        if (window.matchMedia("(min-width: 980px)").matches) {
            backButton =
                <ModalCloseBtn> 
                    <Icon.X 
                        className="nav-bar-arrow-icon"
                        id="arrow-left"
                        size={20}
                    />
                </ModalCloseBtn>  
            
        }else{

            backButton = <CustomBackBtn/>;
        }

        return backButton
    }

    
    return(
        <nav className="partial-form-navbar edit-profile-navbar fixed-top"> 

            <div className="partial-navbar-back-btn-box">
               <BackBtn {...props}/>
	        </div>

            <div className="page-name-box">
                <b className="page-name">Edit Profile</b>  
            </div>

	        <div className="submit-profile-btn-box">
		        <button type="submit" 
                        style={submitButtonStyles} 
                        disabled={submitting}
                        onClick={()=> props.submit(props.submitProps)}
                        value="submit" className="btn-sm  submit-profile-btn">
                    Submit
                </button>
	        </div>
        </nav>
            
    )
};



export const CustomBackBtn = props => {

    return(
        <button type="button" 
              onClick={()=>window.history.back()} 
              className="btn-sm custom-back-bt nav-bar-back-bt" >
            <Icon.ArrowLeft 
                className="nav-bar-arrow-icon"
                id="arrow-left"
                size={20}
            />
        </button>  
  );
}



export const HelpPageNavBar = props => {
        
        
    return(
        <nav className="navigation fixed-top" id="help-navigation">
            <div className="help-navigation-box">
                <ul className="help-logo-contents"
                    onClick={()=>Redirect({pathname:'/'})} >
                    <li>Wiplayit</li>
                </ul>
                <div className="help-menu-box">
                    <HelpDropDownMenu/>
                    <HelpMenu/>
                </div>
            </div>
        </nav>
    );
};

const HelpNavBarMenuItems = () => {

    return (
        <div className="help-menu-contents">
            <button type="button" 
                    onClick={()=>Redirect({pathname:'/bug/report/'})} 
                    className="btn-sm help-menu-items">
                Report a bug
            </button>  
            <button type="button" 
                    onClick={()=>Redirect({pathname:'/feedback/'})} 
                    className="btn-sm help-menu-items">
                Feedback
            </button> 
            <button type="button" 
                    onClick={()=>Redirect({pathname:'/contact/us/'})} 
                    className="btn-sm help-menu-items">
                Contact us
            </button> 
        </div>
    )

};


const BigScreenHelpMenu = props => {
 
    return(
        <div className="">
            <HelpNavBarMenuItems/>
        </div>
    )
}



const SmallScreenHelpMenu = props => {
 
    return(
        <div className="help-dropdown-box">
            <div className="droplet"
                 id="helpNavBarDropdown" 
                 data-toggle="dropdown"
                 aria-haspopup="false" 
                 aria-expanded="true">
                <button type="button" className="menu-tooggle-btn">
                    <Icon.Menu className="menu-toggle-icon" size={30}/>
                </button>
            </div>
            
            <div className="dropdown-menu help-dropdown-menu"
                 aria-labelledby="helpNavBarDropdown">
                <HelpNavBarMenuItems/>
            </div>
        </div>
    )
};

const HelpMenu         = MatchMediaHOC(BigScreenHelpMenu,'(min-width: 980px)');
const HelpDropDownMenu = MatchMediaHOC(SmallScreenHelpMenu,'(max-width: 980px)');





