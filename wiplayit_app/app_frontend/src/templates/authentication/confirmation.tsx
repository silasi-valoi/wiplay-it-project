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

const ConfirmationContents =(props)=> {
    return(
        <div>
            {props.isConfirmed &&
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
 
    return(
        <div>
            <div className="confirmation-success-box">
                <p className="confirmation-message message-success">
                    {successMessage || message}  You can login now and start posting
                </p> 
            </div>

            <div className="authentication-btn-box">
                <button className="btn-sm" 
                        onClick={()=> history.push('user/registration/') }>
                        Login
                </button>  
            </div>
        </div>
    );
};

const ConfirmationError =(props)=> {
    let error   = "Something wrong happened, please try again"
    let {errorMessage} = props;

    let authenticationProps = {
            linkName  : 'Resend Confirmation',
            authenticationType : 'confirmationResend',
            modalName : 'confirmationResend',
    };

    return(
        <div>
            <div className="confirmation-error-box">
                <p className="confirmation-message message-success">
                    {errorMessage || error}
                </p>
            </div>

            <div className="authentication-btn-box">
                <OpenAuthModalBtn {...authenticationProps}/> 
            </div>
        </div>
    );
};