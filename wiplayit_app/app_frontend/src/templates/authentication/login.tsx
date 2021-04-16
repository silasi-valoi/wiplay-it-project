import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import {formIsValid} from 'containers/authentication/utils';

import { NonFieldErrors,
         EmailFieldErrors} from 'templates/authentication/errors';

import { RegistrationSubmitBtn,
         ToogleAuthFormBtn, 
         SpinLoader } from  'templates/authentication/utils'



export const  LoginForm = props => {
    //console.log(props)
    let { 
        submitting,
        onSignUpForm,
        onLoginForm,
        formIsClean,
        formName, 
        form, 
        isSocialAuth} = props;


    form = form && form.loginForm? form.loginForm:null;
    if (!form) return null;

    let error = form && form.error; 
    formIsClean  = !onSignUpForm? formIsValid(form):false;

    let submitButtonStyles = submitting || onSignUpForm || !formIsClean?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting || onSignUpForm ? {opacity:'0.60'}:{}; 
    

    return(
        <div className="form-container">
            <ul className="form-title-box">
                <li className="">Login</li>
            </ul> 
            <form onSubmit={props.onSubmit} className="login-form">
                <fieldset 
                    style={ fieldSetStyles}
                    disabled={ submitting || onSignUpForm }
                    className="fieldset-login">

                    { error && !isSocialAuth &&
                        <NonFieldErrors {...error}/>
                    }
                            
                    <div className="login-box">
                        {!isSocialAuth && onLoginForm && error && 
                            <EmailFieldErrors {...error}/>
                        }
                        <div className="login-fields auth-input-field">
                            <input
                                className="login-email-field"
                                placeholder="Email"
                                type="text"
                                name="email"
                                value={form.email}
                                onChange={props.handleFormChange} 
                                required
                            />
                        </div>

                        <div className="login-fields auth-input-field">
                            <input
                                className="login-password-field"
                                placeholder="Password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={props.handleFormChange} 
                                required
                            />
                        </div>

                        <div className="registration-btns-box">  
                            <div className="submit-btn-box">
                                <RegistrationSubmitBtn {...props}/>
                            </div>
                            <div className="password-change-toggle">
                                <PasswordResetBtn {...props}/>
                            </div>    
                        </div>

                        <SignUpLink {...props}/> 
                    </div>
                </fieldset>
                {!isSocialAuth && !onSignUpForm &&
                    <SpinLoader {...props}/> 
                } 
            </form>
        </div>
    )
};


export default LoginForm;


const  PasswordResetBtn  = props => {
    let toggleFormProps = {
            ...props,
            toggleBtnName:'Forgot Password ?',
            toggleFormProps:{
                value : true,
                formName:'passwordResetForm'
            }
    };

    return(
        <ul className="password-reset-toggle">
            <li>
               <ToogleAuthFormBtn {...toggleFormProps}/>
            </li>
        </ul>
    );
}


const _SignUpLink = (props)=>{
    let toggleFormProps = {
            ...props,
            toggleBtnName:'Sign Up Here',
            toggleFormProps:{
                value : true,
                formName:'signUpForm'

            }
        };

    return(
        <ul className="signup-form-toggle">
            <li>
                Do not have any account ?
                <ToogleAuthFormBtn {...toggleFormProps}/>
            </li>
        </ul>
         
    )

};

export const SignUpLink = MatchMediaHOC(_SignUpLink , '(max-width: 980px)');




