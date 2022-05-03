import React from 'react';
import  AjaxLoader from 'templates/ajax-loader';


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
    const authForm = props.authForm;
    let toggleFormProps = props.toggleFormProps;
    let submitting = authForm['submitting']
    let disablingStyles:object = submitting? {opacity:'0.60'}: {};
    
    return(
        <button type="button" 
            style={disablingStyles}
            disabled={submitting}
            onClick={() => {props.toggleAuthForm(toggleFormProps)}} 
            className="btn-sm text-highlight toggleBtn">
            {props.toggleBtnName}
        </button>
    )
};


export const  RegistrationSubmitBtn  = props => {
    let submitting = props.authForm['submitting']
    let disablingStyles:object = submitting? {opacity:'0.60'}: {};
   
    return(
        <button type="submit" 
                style={disablingStyles} 
                disabled={submitting}
                className="registration-submit-btn btn-sm">
            Submit
        </button>
    )
};

                                         


