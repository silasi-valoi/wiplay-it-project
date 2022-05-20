import React from 'react';
import { MatchMediaHOC } from 'react-match-media';

import { NonFieldErrors, EmailFieldErrors, PhoneNumberFieldErrors} from "templates/authentication/errors"
import { ToogleAuthFormBtn, 
         RegistrationSubmitBtn,
         SpinLoader} from  'templates/authentication/utils';
import PhoneInput from 'react-phone-input-2';


export const  SignUpForm = props => {
    const authForm = props.authForm;
        
    let { 
          submitting,
          form,
          withPhoneNumber,
          onSignUpForm,
          isSocialAuth} = authForm;

    form = form && form.signUpForm;
    if (!form) return null;

    let error = form['error'];
    let phoneNumber:object = form['phone_number']
    
    const toggleSignUpFormProps = {
            ...props,
            toggleBtnName : 'Cancel',
            toggleFormProps : {
                value : false,
                formName : 'signUpForm',
            }
        };

    const onSubmitStyles = props['onSubmitStyles']
    
    return(
        <div className="form-container" id="form-container">
            <ul className="form-title-box">
                <li className="">Create Account</li>
            </ul> 
            <form onSubmit={props.onSubmit} className="sign-up-form">
                <fieldset disabled={submitting} style={onSubmitStyles}
                        className="fieldset-signup" >

                    <div className="sign-up-box">
                                   
                        <div className="name-fields">
                            <div className="username-fields">
                                <div className="name-field-box1 auth-input-field">
                                    <input
                                        placeholder=""
                                        className="first-name-input"
                                        type="text"
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={props.handleFormChange}
                                        required
                                    />
                                    <span className="floating-label">First Name</span>

                                </div>  
                                <div className="name-field-box2 auth-input-field">
                                    <input
                                        placeholder=""
                                        className="last-name-input"
                                        type="text"
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={props.handleFormChange}
                                        required
                                    />
                                    <span className="floating-label">Last Name</span>
                                </div>
                            </div>
                        </div>

                        <div  className="email-fields signup-fields">
                            {!isSocialAuth && onSignUpForm && error &&
                                <div>
                                    <EmailFieldErrors {...error}/>
                                    <NonFieldErrors {...error}/>
                                    <PhoneNumberFieldErrors {...error}/>
                                </div>
                            }
                          
                            {withPhoneNumber &&
                                <div className='phone-number-box auth-input-field'>
                                    
                                    <span className='toggle-input' 
                                          onClick={() => props.toggleInput(false)}>
                                        Register using your email address
                                    </span>
                                    <ul className="phone-number-label">Phone Number</ul>
                                    <PhoneInput
                                        country={'za'}
                                        placeholder=""
                                        enableAreaCodes={false}
                                        countryCodeEditable={false}
                                        containerClass="phone-number-container"
                                        inputClass="phone-number-input"
                                        value={phoneNumber? phoneNumber['number']: ''}
                                        onChange={(number, phoneNumberInfo)=> {
                                            props.handlePhoneNumber(number, phoneNumberInfo)
                                        }}
                                    />
                                    
                                </div>

                                ||

                                <div className="email-box auth-input-field">
                                    <span style={{'display':'none'}} className='toggle-input' 
                                        onClick={()=> props.toggleInput(true)}>
                                        Register using your phone number
                                    </span>
                                    <input
                                        placeholder=""
                                        className="email"
                                        type="text"
                                        name="email"
                                        value={form.email}
                                        onChange={props.handleFormChange}
                                        required 
                                    />
                                    <span className="floating-label">Email Address</span>
                                </div>
                            }
                        </div>

                        <div className="password-fields signup-fields">
                            <div className="password-box auth-input-field">
                                <input
                                    autoComplete='true'
                                    placeholder=""
                                    className="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={props.handleFormChange}
                                    required
                                />
                                <span className="floating-label">Password</span>
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
            
                    <LoginToogle {...props}/>
                </fieldset>

                {!isSocialAuth && onSignUpForm &&
                    <SpinLoader {...props}/> 
                }
            </form>
          
        </div>
    )
};


export default SignUpForm;


const _LoginToogle = (props)=>{
    const toggleLoginFormProps = {
            ...props,
            toggleBtnName:'Login',
            toggleFormProps:{
                defaultFormName : 'loginForm',
                value : false,
                formName:'signUpForm',
            }
        };

    return(
        <ul className="login-form-toggle">
            <li>
                Already have any account ?
                <ToogleAuthFormBtn {...toggleLoginFormProps}/>
            </li>
        </ul>
    );

};


export const LoginToogle = MatchMediaHOC(_LoginToogle, '(max-width: 980px)');


