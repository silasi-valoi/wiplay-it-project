
import React from 'react';
import {  BrowserRouter } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import * as Icon from 'react-feather';
import {Redirect} from './utils';
import userProfileAvatar from 'media/user-image-placeholder.png';
import { OpenUsersModalBtn,
         ModalCloseBtn  } from "templates/buttons";
import { Modal}   from  "containers/modal/modal-container";

import { closeModals}   from  'containers/modal/utils';


export const NavBarMenuItems = props => {
    let {currentUser, isAuthenticated} = props;
    let profile = currentUser && currentUser.profile;
          
    let state = {id : currentUser.id, isAuthenticated};
    
    let pathToProfile = currentUser && `/profile/${currentUser.slug}/`;
    let toProfileProps = {pathname:pathToProfile, state};
  
    return(
        <BrowserRouter>
        {isAuthenticated  &&
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
            }
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
    let { currentUser } = props;
    let profile = currentUser?.profile;
       
    return(
        
        <div className="navigation-img-box">
            <ul className="nav-bar-img-box">
                    <li className="dropleft" id="navBardropdown" 
                    data-toggle="dropdown"
                    aria-haspopup="false" 
                    aria-expanded="true"> 
                        { 
                            <img alt="" 
                                 src={profile?.profile_picture || userProfileAvatar}
                                className="nav-bar-img"/>
                        }
                    </li>

                    <li className="dropdown-menu nav-dropdown-menu"
                        aria-labelledby="navBardropdown">
                        <NavBarMenuItems {...props}/>
                    </li>
            </ul>
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
    let { currentUser } = props;
        
    let profile = currentUser?.profile;
    
    let modalProps = {
            ...props,
            modalName : 'navigationMenu', 
        };

    return(
        
        <div className="navigation-img-box">

            <div className="nav-bar-modal-menu" id="nav-bar-modal-menu">
                <div className="nav-bar-img-box"> 
                    <img alt="" 
                        onClick={()=> Modal(modalProps)}
                        src={profile?.profile_picture || userProfileAvatar}
                        className="nav-bar-img"/>
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
                        size={15} 
                    />
                    Home
                </button> 
            </ul>

            <ul  className="navbar-item">
                <OpenUsersModalBtn {...{currentUser, isAuthenticated}}>
                    <Icon.Users id="feather-users" size={15}/>
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
                        size={15}
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
                        size={15}
                    />
                    Notifications
                </button>
            </ul> 

            <ul className="navbar-item">
                <ModalMenuToggle {...props}/>
            </ul>
        </div> 
    );
}

export const NavigationBarBottom = MatchMediaHOC(
                                      NavBarBottom, 
                                      '(max-width: 980px)'
                                    );


export const EditProfileNavBar = props  => {

    let {submitting } = props;
    let submitButtonStyles = submitting?{opacity:'0.60'}:{};

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



export const CustomBackBtn = () => {

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



export const HelpPageNavBar = () => {
        
        
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


const BigScreenHelpMenu = () => {
 
    return(
        <div className="">
            <HelpNavBarMenuItems/>
        </div>
    )
}



const SmallScreenHelpMenu = () => {
 
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

const HelpMenu = MatchMediaHOC(BigScreenHelpMenu,'(min-width: 980px)');
const HelpDropDownMenu = MatchMediaHOC(SmallScreenHelpMenu,'(max-width: 980px)');





