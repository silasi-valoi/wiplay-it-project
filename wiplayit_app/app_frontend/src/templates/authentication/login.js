import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';

import { NonFieldErrors,
         EmailFieldErrors} from "templates/authentication/errors"

import { PasswordChangeBig, 
         PasswordChangeSmall,
         SubmitBtnBigScreen,
         RegistrationSubmitBtn,
         SpinLoader } from  'templates/authentication/utils'



export const  LoginForm = props => {
    //console.log(props)
    let { submitting, onSignUpForm,onLoginForm, formIsValid, formName, form, validateForm} = props;


    form = form && form.loginForm? 
                           form.loginForm:null;

    let error = form && form.error; 
    formIsValid  = !onSignUpForm? validateForm(form, formName):false;

    let submitButtonStyles = submitting || onSignUpForm || !formIsValid?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting || onSignUpForm ? {opacity:'0.60'}:{}; 
    

    return(
        <div>
            { form?
                <div>
                    <ul className="form-title-box">
                        <li className="">Login</li>
                    </ul> 
                    <form onSubmit={props.onSubmit} className="login-form">
                                   
                        <fieldset 
                            style={ fieldSetStyles}
                            disabled={ submitting || onSignUpForm }
                            className="fieldset-login">
                            { error &&
                                <NonFieldErrors {...error}/>
                            }
                               
                            <div className="login-box">
                                { onLoginForm && error &&
                                    <EmailFieldErrors {...error}/>
                                }
                                <div className="login-fields">
                                    <input
                                        className="login-email-field"
                                        placeholder="Email Address"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={props.handleFormChange} 
                                        required
                                    />
                                </div>
                                <div className="login-fields">
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
                                    <div className="password-change-link-box">
                                        <PasswordChangeSmall {...props}/>
                                        <PasswordChangeBig {...props}/>
                                    </div>    
                                </div>

                                <CreateAccountLink/> 
                            </div>
                        </fieldset>
                    </form>

                    { !onSignUpForm &&
                        <SpinLoader {...props}/> 
                    } 
         
                </div>
                :
                ""
            }
        </div>
    )
};


export default LoginForm;

const _CreateAccountLink = ()=>{
    return(
        <ul className="create-account-link-box">
            <li>
               Do not have account ?
               <Link className="create-account-lin" to="/user/signup/">  Sign Up</Link>
            </li>
        </ul>
         
    )

};

export const CreateAccountLink = MatchMediaHOC(_CreateAccountLink , '(max-width: 980px)');



