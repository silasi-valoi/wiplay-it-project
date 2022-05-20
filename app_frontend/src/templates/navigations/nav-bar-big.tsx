
import React from 'react';
import { MatchMediaHOC } from 'react-match-media';
import { Search } from 'react-feather';

import { NavBarDropDown, NavigationMenu } from './menu';
import { OpenAuthModalBtn, OpenEditorBtn  } from "templates/buttons";
import { createQuestionProps, authenticationProps} from './utils';



export const NavBar = props => {
    var {currentUser, searchForm, isAuthenticated} = props;
    
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

                    <div className='nav-bar-search-box'>
                        <form className='nav-bar-search-form'>
                            <button 
                                type="button" 
                                onClick={ () => console.log("trigger search")}
                                className="btn-sm search-btn" >
                                    <Search className="search-icon" size={20}/>  
                            </button>
                            <input
                                className="nav-bar-search-input"
                                type="text"
                                name="search"
                                value={searchForm['search']}
                                onChange={props.handleSearchChange}
                            />
                        </form>
                    </div>
                    
                    <NavBarDropDown {...props}/>
          
                    <div className="post-question-box">
                        <div className="post-question-btn-box">
                            <OpenEditorBtn {..._createQuestionProps}/>
                        </div>
                    </div>
                </div>
            </div>
            
            <ul className="navbar-login-box">
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

