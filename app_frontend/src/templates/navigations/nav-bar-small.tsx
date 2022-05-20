
import React from 'react';
import { MatchMediaHOC } from 'react-match-media';
import { Search } from 'react-feather';

import { NavigationMenu} from './menu';
import { OpenAuthModalBtn, OpenEditorBtn  } from "templates/buttons";
import { createPostProps,
         createQuestionProps,
         authenticationProps } from './utils';
import { history } from "App"


export const NavBar = props => {
    let pathname:string = history.location.pathname;
    if (pathname !== '/') {
        return null;
    }

    let {isAuthenticated, currentUser} = props;
    
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

    const _authenticationProps:object = {
            ...authenticationProps,
        };
    
    return (
		<nav className="mobile-navbar-top fixed-top navbar-expand-lg navbar-light"
              id="navigation-mobile">
            <div style={{display:'flex'}} className="navbar-contents-top">
                <ul className='nav-bar-search'>
                    <button 
                        type="button" 
                        onClick={ () => console.log("trigger search")}
                        className="btn-sm search-btn" >
                            <Search className="search-icon" size={20}/>  
                            Search
                    </button>

                </ul>
                          
                <ul className="logo-contents">
                    <li className="logo" >Wiplayit</li>
                </ul>

                { !isAuthenticated &&
                    <ul className="navbar-login-box">
                        <li className="">
                            <OpenAuthModalBtn {..._authenticationProps}/>
                        </li>                    
                    </ul>
                       
                    ||
                
                    <ul className="add-question-box">
                        <OpenEditorBtn {..._createQuestionProps}/>
                    </ul>
                }
            </div>

            <div className="navbar-bottom">
                <div className="navbar-bottom-contents">
                    <NavigationMenu {...props}/>
                </div>
            </div>
            
        </nav>
    ); 
};


const NavBarSmallScreen = MatchMediaHOC(NavBar,'(max-width: 980px)');
export default NavBarSmallScreen;

/*
<ul className="add-question-box">
                        <li className="">
                            <OpenEditorBtn {..._createQuestionProps}/>
                        </li>
                    </ul>
                    <ul className="add-post-box">
                        <li className="">
                            <OpenEditorBtn {..._createPostProps}/>
                        </li>
                    </ul>*/
                     