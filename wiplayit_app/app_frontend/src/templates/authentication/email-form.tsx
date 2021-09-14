import React from 'react';

import { NonFieldErrors,
         EmailFieldErrors} from "templates/authentication/errors"

import { RegistrationSubmitBtn,
         ToogleAuthFormBtn,
         SpinLoader } from  'templates/authentication/utils'



const EmailForm = props => {
    const {handleFormChange, validateForm, children} = props;

    let {submitting,
        onSignUpForm,
        onPasswordResetForm,
        onEmailResendForm,
        passwordRestAuth,
        form, 
        successMessage,
        formIsValid,
        formName, 
        defaultFormName,
        isSocialAuth } = props.authForm;

    form = form && form[formName]? 
                           form[formName]:null;
    if (!form) return null;

    let error = form.error; 

    formIsValid =  onPasswordResetForm || onEmailResendForm?
                             validateForm(form, formName):false;
    

    let submitButtonStyles = submitting || onSignUpForm || !formIsValid?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting || onSignUpForm ? {opacity:'0.60'}:{};
    let toggleProps = {successMessage:false, value:true, formName}
    let formTitle   = onEmailResendForm && 'Confirmation Resend' ||
                      onPasswordResetForm && 'Password Reset';


    let formDescription = `Enter your e-mail address or phone number.`;

    let emailSent:boolean = passwordRestAuth && passwordRestAuth['emailSent'];

    return(
        <div className="email-form-box" id="form-container">
            <ul className="form-title-box">
                <li className="">{formTitle}</li>
            </ul>
            {onPasswordResetForm && successMessage &&
                <EmailPasswordResetSuccess {...props}/>

                ||

                <form className="email-form" onSubmit={props.onSubmit}>
                    <ul className="password-form-description">
                        <li>
                            {formDescription}
                        </li>
                    </ul>

                    {!isSocialAuth && !onSignUpForm && error &&
                        <div>
                            <NonFieldErrors {...error}/>
                            <EmailFieldErrors {...error}/>
                        </div>
                    }
                        
                    <fieldset style={ fieldSetStyles} 
                            disabled={ submitting || onSignUpForm} >

                        <div  className="email-fields">
                            <p></p>
                                <div className="email-box auth-input-field">
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
                            </div>

                            <div className="form-btns registration-btns-box">
                                <div className="form-submit submit-btn-box">
                                    <RegistrationSubmitBtn {...props}/>
                                </div>
                                <div className="email-form-cancel">
                                    {props.children}
                                </div>                  
                            </div>
                    </fieldset>   
                    {!isSocialAuth && !onSignUpForm &&
                        <SpinLoader {...props}/> 
                    }   
                </form>
            }
        </div>
    )
};

export default EmailForm;


export const EmailPasswordResetSuccess =(props)=>{
    let {passwordRestAuth} = props;
    let {identifier} = passwordRestAuth || {};
    let toggleProps = {value : true, formName : 'passwordResetForm'};
   

    let toggleFormProps = {
            ...props,
            toggleBtnName:'Resend',
            toggleFormProps:{
                value : true,
                formName:'passwordResetForm'
            }
    };   

    return(
        <div className="success-message-box">
            <ul className="success-alert message-success">
                <li>
                    Instructions to change password has been sent to
                    <span className="text-highlight">
                      {' '}{identifier}
                    </span> address. Please open you email to change your password.
                </li>
            </ul>
            <div className="resend-email-box">
                <p className="resend-email-text">
                    Didn't receive any email ?
                </p>
                <ToogleAuthFormBtn {...toggleFormProps}/>
            </div>
           
        </div>
    )
} 


export const SmsCodeForm = props => {
    let {submitting,
        onSignUpForm,
        onPasswordResetForm,
        successMessage,
        onEmailResendForm,
        form, 
        formName, 
        defaultFormName,
        isSocialAuth } = props.authForm;

    const {handleFormChange, formTitle, validateForm} = props
   
    const phoneNumberConfirmationForm = form?.phoneNumberConfirmationForm;
    
    const passwordResetSmsCodeForm =  form?.passwordResetSmsCodeForm;

    form = phoneNumberConfirmationForm || passwordResetSmsCodeForm;
    if (!form) return null;

    let error = form.error; 

    let formIsValid =  onPasswordResetForm || onEmailResendForm?
                             validateForm(form, defaultFormName):false;

    let email = successMessage?props.email:null;

    let submitButtonStyles = submitting || !formIsValid?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting && {opacity:'0.60'} || {};

    return(
        <div className="sms-code-form-box" id="form-container">
            <ul className="form-title-box">
                <li className="">{formTitle}</li>
            </ul>
        
            { successMessage &&
                <ul className="success-resend-message">
                    <li className="">{successMessage}</li>
                </ul>
            }
           

            <div className="sms-code-form">
                                                                
                <form  onSubmit={props.onSubmit}>
                    {props?.children[0]}

                                         
                    <fieldset style={fieldSetStyles} disabled={submitting}>
                        <div  className="email-fields">
                            {error &&
                                <NonFieldErrors {...error}/>
                            }
                            
                            <div className="email-box auth-input-field">
                                <input
                                    placeholder=""
                                    className="number-input"
                                    type="number"
                                    name="sms_code"
                                    value={form.sms_code}
                                    onChange={handleFormChange}
                                    required
                                />
                                <span className="floating-label">Code</span>
                            </div>
                        </div>

                        <div className="form-submit submit-btn-box">
                            <RegistrationSubmitBtn {...props}/>
                        </div>
                    </fieldset>   
                    {!isSocialAuth && !onSignUpForm && onPasswordResetForm &&
                        <SpinLoader {...props}/> 
                    }   
                </form>

                <div className="resend-email-box">
                    <p className="resend-email-text">
                        You didn't receive any sms ?
                    </p>
                    {props?.children[1]}
                </div>   
            </div>
        </div>
    )
};




