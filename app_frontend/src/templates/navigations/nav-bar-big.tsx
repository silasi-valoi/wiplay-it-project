
import React from 'react';
import { MatchMediaHOC } from 'react-match-media';
import { NavBarDropDown, NavigationMenu } from './menu';
import { OpenAuthModalBtn, OpenEditorBtn  } from "templates/buttons";
import { createQuestionProps, createPostProps, authenticationProps} from './utils';



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
      
    const _authenticationProps = {...authenticationProps};

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
                        <OpenAuthModalBtn {..._authenticationProps}/>
                    }
                </li> 

            </ul>
            
        </nav>
    );
};



const NavBarBigScreen = MatchMediaHOC(NavBar,'(min-width: 980px)');
export default NavBarBigScreen;

