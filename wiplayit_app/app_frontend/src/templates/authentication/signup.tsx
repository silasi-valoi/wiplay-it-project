import React from 'react';
import { MatchMediaHOC } from 'react-match-media';
import {  Link } from "react-router-dom";
import { CountryDropdown,
       RegionDropdown } from 'react-country-region-selector';

import { NonFieldErrors,
         CountryFieldErrors,
         EmailFieldErrors} from "templates/authentication/errors"
import { ToogleAuthFormBtn, 
         RegistrationSubmitBtn,
         SpinLoader} from  'templates/authentication/utils';


export const  SignUpForm = props => {
    let { 
          submitting,
          form,
          onSignUpForm,
          formName,
          formIsValid, 
          validateForm, 
          isSocialAuth} = props;

    form = form && form.signUpForm? form.signUpForm: null;
    if (!form) return null;

    let error = form['error']; 
    
    formIsValid = onSignUpForm? validateForm(form, formName):false;
    let submitButtonStyles = submitting || !formIsValid?{opacity:'0.60'}:{};
    let fieldSetStyles = submitting ? {opacity:'0.60'}:{}; 

    const toggleSignUpFormProps = {
          ...props,
          toggleBtnName:'Cancel',
          toggleFormProps:{
             value : false,
             formName:'signUpForm',
            
          }

        };
    
    
    return(
        <div className="form-container">
            <ul className="form-title-box">
                <li className="">Create Account</li>
            </ul> 
            <form onSubmit={props.onSubmit} className="sign-up-form">
                <fieldset disabled={submitting} style={fieldSetStyles}
                        className="fieldset-signup" >

                    <div className="sign-up-box">
                        <div className="country-select-box">
                            <CountryFieldErrors {...error}/>
                         
                            <div className="country-select">
                                <CountryDropdown
                                    value={form.country}
                                    labelType="full"
                                    valueType="short"
                                    priorityOptions={["ZA"]}
                                    showDefaultOption={true}
                                    onChange={(value) => props.selectCountry(value)}
                                />
                            </div>
                        </div>
            
                        <div className="name-fields">
                            <div className="username-fields">
                                <div className="name-field-box1 auth-input-field">
                                    <input
                                        placeholder="First Name"
                                        className="first-name-input"
                                        type="text"
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={props.handleFormChange}
                                        required
                                    />

                                </div>  
                                <div className="name-field-box2 auth-input-field">
                                    <input
                                        placeholder="Last Name"
                                        className="last-name-input"
                                        type="text"
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={props.handleFormChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div  className="email-fields signup-fields">
                            {!isSocialAuth && onSignUpForm && error &&
                                <EmailFieldErrors {...error}/>
                            }
                    
                            {!isSocialAuth && error &&
                                <NonFieldErrors {...error}/>
                            }    

                            <div className="email-box auth-input-field">
                                <input
                                    placeholder="Email"
                                    className="email"
                                    type="text"
                                    name="email"
                                    value={form.email}
                                    onChange={props.handleFormChange}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="password-fields signup-fields">
                            <div className="password-box auth-input-field">
                                <input
                                    placeholder="Password"
                                    className="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={props.handleFormChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="registration-btns-box">
                        <div className="submit-btn-box">
                            <RegistrationSubmitBtn {...props}/>
                        </div>
                        <div className="cancel-signup-btn-box">
                            <ToogleAuthFormBtn {...toggleSignUpFormProps}/>
                        </div>    
                    </div>  
            
                    <LoginLink {...props}/>
                </fieldset>

                {!isSocialAuth && onSignUpForm &&
                    <SpinLoader {...props}/> 
                }
            </form>
          
        </div>
    )
};


export default SignUpForm;


const _LoginLink = (props)=>{
    const toggleLoginFormProps = {
          ...props,
          toggleBtnName:'Login Here',
          toggleFormProps:{
             value : true,
             formName:'loginForm'
          }

        };
    return(
        <ul className="login-form-toggle">
            <li>
                Already have any account ?
                <ToogleAuthFormBtn {...toggleLoginFormProps}/>
            </li>
        </ul>
         
    )

};


export const LoginLink = MatchMediaHOC(_LoginLink , '(max-width: 980px)');


