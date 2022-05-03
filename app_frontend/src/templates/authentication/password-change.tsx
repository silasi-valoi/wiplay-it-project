import React from 'react';
import {ModalCloseBtn, OpenAuthModalBtn} from 'templates/buttons';
import { NonFieldErrors,
         PasswordErrors } from 'templates/authentication/errors'

import { RegistrationSubmitBtn } from  'templates/authentication/utils'


export const PasswordChangeForm = props => {
    
    
    return(
        <div className="form-container password-change-box">
            <ul className="form-title-box">
                <li className="">Password Change</li>
            </ul>
            <PasswordForm {...props}/>
        </div>
    )
}


export default PasswordChangeForm;


export const PasswordForm =(props)=>{
    const {handleFormChange, formDescription, authForm, children} = props;

    let {submitting, form, formName, onSignUpForm} = authForm;
 
    if (formName !== 'passwordChangeForm' && 
        formName !== 'passwordChangeConfirmForm'){
        return null;
    }
   
    let passwordChangeForm:object = form?.passwordChangeForm;
    
    let passwordChangeConfirmForm:object = form?.passwordChangeConfirmForm;

    form = passwordChangeForm || passwordChangeConfirmForm;

    if(!form) return null;

    let error =  form.error; 
    let onSubmitStyles = props['onSubmitStyles'];

    return(
        <form className="password-change-form" 
              onSubmit={(event)=> props.onSubmit(event, 'passwordChangeForm')} >
                         
            <fieldset style={onSubmitStyles}
                      disabled={submitting || onSignUpForm}>

                <ul className="password-form-description">
                    <li>{formDescription}</li>
                </ul>
                

                <div  className="password-form" >
                {error &&
                    <div>
                        <PasswordErrors {...error}/>
                        <NonFieldErrors {...error}/>
                    </div>
                }

                <div>
                    <div className="change-password-box auth-input-field">
                        <input
                            autoComplete='true'
                            className="password"
                            placeholder=""
                            type="password"
                            name="new_password1"
                            value={form.new_password1}
                            onChange={(event) => handleFormChange(event, 'passwordChangeForm')}
                            required
                        />
                        <span className="floating-label">
                            New Password
                        </span>
                    </div>
                    <div className="change-password-box auth-input-field">
                        <input
                            autoComplete='true'
                            className="password"
                            placeholder=""
                            type="password"
                            name="new_password2"
                            value={form.new_password2}
                            onChange={(event) => handleFormChange(event, 'passwordChangeForm')}
                            required
                        />
                        <span className="floating-label">
                            Repeat New Password
                        </span>
                    </div>
                    </div>
        
                </div>

                <div className="form-submit submit-btn-box">
                        <RegistrationSubmitBtn {...props}/>
                </div>
                <div className="password-change-link-box">
                    {children && children[0]}
                    {children && children[1]}
                </div> 
            </fieldset>
        </form>
    )
};


export const PasswordConfirmForm =(props)=>{

    return(
        <div className="">
            <div className="confirm-password-title-box">
                <ul className="confirm-password-title form-title-box">
                    <li className="">Enter Password</li>
                </ul>
            </div>

            <_PasswordConfirmForm {...props}/>
        </div>
        
    )
};

export const _PasswordConfirmForm =(props)=>{
    const {handleFormChange, authForm} = props;

    let { submitting, form, successMessage } = authForm;
    
    form = form && form.loginForm;
       
    if (!form) return null;

    let error = form && form.error; 
    
    let fieldSetStyles = submitting? {opacity:'0.60'}:{};
    
    return (
        <form className="password-confirm-form" 
              onSubmit={(event)=> props.onSubmit(event)} >
            <fieldset style={fieldSetStyles} disabled={submitting}>
                { successMessage &&
                    <ul className="success-resend-message">
                        <li className="">{successMessage}</li>
                    </ul>
                }
                        
                <div className="password-form-description-box">
                    <ul className="password-form-description">
                        <li>
                            For security purposes, please enter your 
                            password in order to continue. If you signed 
                            up for Wiplayit using Facebook or Google,
                            please <span
                                onClick={()=> props.passwordRest()}
                                style={fieldSetStyles}
                                className="password-rest-btn text-highlight">
                                create an account password.
                            </span>
                        </li>
                    </ul>
                    {error &&
                        <ul className="form-errors">
                            <li>The password you entered is invalid</li>   
                        </ul>
                    }
                </div>
                       
                <div  className="" >
                    <div className="confirm-password-box auth-input-field">
                        <div className="confirm-password-input auth-input-field">
                            <input
                                autoComplete='true'
                                className="password"
                                placeholder=""
                                type="password"
                                name="password"
                                value={form?.password}
                                onChange={(event)=> handleFormChange(event)}
                                required
                            />
                            <span className="floating-label">Password</span>
                        </div>

                        <button
                            onClick={()=> props.passwordRest()}
                            type="button"
                            className="confirm-password-rest-btn">
                            Forgot Password ?
                        </button>
                    </div>
                    
                    <div className="submit-btn-bo confirm-password-submit">
                        <div className="confirm-password-submit-btn">
                            <RegistrationSubmitBtn {...props}/>
                        </div>
                        <div className="password-confirm-form-cancel">
                            <ModalCloseBtn> 
                                Cancel
                            </ModalCloseBtn>
                        </div>
                    </div>
                    
                </div>
            </fieldset>
        </form>
    )
};

export const SuccessPasswordChange =()=>{

    let authenticationProps = {
        linkName  : 'Login',
        authenticationType : 'Login',
        modalName : 'authenticationForm',
    };

    return(
        <div className="password-change-success">
            <div className="password-change-success-box">
                <p className="alert-success message-success">
                    You successfully changed  your password with the new one.
                </p>
            </div>
            <div className="authentication-btn-box">
                <OpenAuthModalBtn {...authenticationProps}/>  
            </div>
        </div>
    )
};

