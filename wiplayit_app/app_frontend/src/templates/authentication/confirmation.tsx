import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import  EmailForm  from 'templates/authentication/email-form'; 
import HomePage from "containers/main/home-page";
import {OpenAuthModalBtn} from "templates/buttons";
import {history} from 'App';
import { ToogleAuthFormBtn,
         SpinLoader } from  'templates/authentication/utils';



const AccountConfirmation = props => {
    let {isConfirmed, submitting, pageTitle} = props;
       
    return(
        <div className="account-confirmation-box" >
            <ul className="form-title-box">
                <li className="">{pageTitle}</li>
            </ul> 

            <div className="confirmation-message-box">
                {!submitting && 
                    <ConfirmationContents {...props}/>    
                }
                <SpinLoader {...props}/> 
            </div>
        </div>
    );
};

export default AccountConfirmation;

const ConfirmationContents = (props) => {
    
    return(
        <div>
            {!props.userIsConfirmed &&
                <ConfirmationSuccess {...props}/>
                ||
                <ConfirmationError {...props}/>
            }
        </div>
    )
};


const ConfirmationSuccess =(props)=> {
    let message = 'Your account has been successefully confirmed.'
    let {successMessage} = props;

    let authenticationProps = {
        linkName  : 'Login',
        authenticationType : 'Login',
        modalName : 'authenticationForm',
    };
 
    return(
        <div>
            <div className="confirmation-success-box">
                <p className="confirmation-message message-success">
                    {successMessage || message}  You can login now and start posting
                </p> 
            </div>

            <div className="authentication-btn-box">
                <OpenAuthModalBtn {...authenticationProps}/>  
            </div>
        </div>
    );
};

const ConfirmationError =(props)=> {
    let errorMessage:string = "Something wrong happened while trying " + 
                            "to verify your account. " +  
                           "Please click the button bellow to resend confirmation mail again."
    

    let authenticationProps = {
            linkName  : 'Resend Confirmation',
            authenticationType : 'confirmationResend',
            modalName : 'authenticationForm',
    };

    return(
        <div>
            <div className="confirmation-error-box">
                <p className="confirmation-message alert-danger message-success">
                    {errorMessage}
                </p>
            </div>

            <div className="authentication-btn-box">
                <OpenAuthModalBtn {...authenticationProps}/> 
            </div>
        </div>
    );
};