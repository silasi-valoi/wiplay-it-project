import React from 'react';
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
        isSocialAuth} = props.authForm;


    form = form && form.loginForm;
    if (!form) return null;

    let error = form.error; 
    formIsClean  = !onSignUpForm? formIsValid(form):false;
   
    const toggleLoginFormProps:object = {
        ...props,
        toggleBtnName   :'Cancel',
        toggleFormProps : {
            formName :'loginForm',
            value    : false,
        }
    }

    let disabled:boolean = submitting || onSignUpForm; 
    let disablingStyles:object = disabled? {opacity:'0.60'}: {};

    return(
        <div className="form-container" id="form-container">
            <ul className="form-title-box">
                <li className="">Login</li>
            </ul> 
            <form onSubmit={props.onSubmit} className="login-form">
                <fieldset 
                    style={disablingStyles}
                    disabled={disabled}
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
                                placeholder=""
                                type="text"
                                name="email"
                                value={form.email}
                                onChange={props.handleFormChange} 
                                required
                            />
                            <span className="floating-label">Email Address</span>
                        </div>

                        <div className="login-fields auth-input-field">
                            <input
                                className="login-password-field"
                                placeholder=""
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={props.handleFormChange} 
                                required
                            />
                            <span className="floating-label">Password</span>
                        </div>

                        <div className="login-submit-box registration-btns-box">  
                            <div className="submit-btn-box">
                                <RegistrationSubmitBtn {...props}/>
                            </div>
                            <div className="password-change-toggle">
                                <PasswordResetBtn {...props}/>
                            </div>    
                        </div>
                        
                        <SignUpToogle {...props}/> 
                        
                        <div className="cancel-login-btn-box">
                            <ToogleAuthFormBtn {...toggleLoginFormProps}/>
                        </div> 
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


const _SignUpToogle = (props)=>{
    let toggleFormProps = {
            ...props,
            toggleBtnName:'Sign Up',
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

export const SignUpToogle = MatchMediaHOC(_SignUpToogle , '(max-width: 980px)');




