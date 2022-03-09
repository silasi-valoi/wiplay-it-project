
import React from 'react';
import { MatchMediaHOC } from 'react-match-media';
import * as Icon from 'react-feather';

import {Redirect} from './utils';
import { authenticationProps } from './utils';
import { OpenAuthModalBtn, ModalCloseBtn } from "templates/buttons";
import { NavigationMenu, ModalMenuToggle} from './menu';
import { history } from "App";



export const _NavBarBottom = props =>{
         
    return (
        <div className="navigation-bar-mobile">
            <NavigationMenu {...props}/>
        </div>
    );
};


const _PartialNavBar = props =>{
    let pathname:string = history.location.pathname;
    if (pathname === '/') {
        return null;
    }
    
    var {currentUser, isAuthenticated } = props;
    
    let path_to_profile = `/`;
    let userProfile = {};
       
    if (currentUser) {
      path_to_profile = `/profile/${currentUser.id}/${currentUser.slug}/`;
      userProfile  = currentUser.profile;
    }

    const _authenticationProps = {...authenticationProps, ...props}
       
    return (
        <nav className="navigation partial-page-navbar fixed-top" 
            id="navigation">
            <div className="partial-navbar-back-btn-box">
                <button 
                    className="btn-sm"
                    onClick={()=> window.history.back()}> 
                    <Icon.ArrowLeft
                        className="nav-bar-arrow-icon"
                        id="arrow-left" 
                        size={20}/>
                </button>  
            </div>

            <div className="page-name-box">
                <b className="page-name">{props.pageName}</b>  
            </div>
         
            <div className="navigation-img-item">

                { isAuthenticated &&
                    <ModalMenuToggle {...props}/>
                    
                    ||

                    <ul className="partial-navbar-login-link">
                       <li className="">
                            <OpenAuthModalBtn {..._authenticationProps}/>
                        </li>                    
                    </ul>
                }
            </div>
        </nav>
    );

};

const PartalNavBar = MatchMediaHOC(
         _PartialNavBar,
         '(max-width: 980px)'
    );

export default PartalNavBar

export const NavBarBottom = MatchMediaHOC(
            _NavBarBottom,
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
        <nav 
            className="partial-form-navbar edit-profile-navbar fixed-top"> 

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
                        value="submit"
                        className="btn-sm  submit-profile-btn">
                    Submit
                </button>
	        </div>
        </nav>
            
    )
};



export const CustomBackBtn = props => {

    return(
        <button
            type="button" 
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

const HelpMenu = MatchMediaHOC(BigScreenHelpMenu,'(min-width: 980px)');
const HelpDropDownMenu = MatchMediaHOC(
            SmallScreenHelpMenu,
            '(max-width: 980px)'
        );





