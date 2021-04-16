import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import  AjaxLoader from 'templates/ajax-loader';
import {history} from "App";



export const NavBar = props => {
      
    return (
        <div className="navigation-bar fixed-top">
            <div className="navbar-box">
               <ul className="navbar-title-box">
                   <li className="" >{props.navbarTitle}</li>
                </ul>
            </div>
        </div>    
    );
};




export const  SpinLoader  = props => {
    if (!props.submitting)  return null;
       
    return (
        <div className="registration-spin-loader-box">
            <AjaxLoader/> 
        </div>
    );
};

export const  ToogleAuthFormBtn  = props => {
    let toggleFormProps = props.toggleFormProps;
    
    return(
        <button type="button" 
                onClick={() => { props.toggleAuthForm(toggleFormProps)} } 
                className="btn-sm text-highlight toggleBtn">
                {props.toggleBtnName}
        </button>
        
    )
};



export const  RegistrationSubmitBtn  = props => {
    let submitButtonStyles = props.submitting? {opacity:'0.60'}: {};
   
    return(
        <button type="submit" 
                style={submitButtonStyles} 
                disabled={props.submitting}
                className="registration-submit-btn btn-sm">
            Submit
        </button>
    )
};

                                         


