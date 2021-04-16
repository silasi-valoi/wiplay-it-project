import React from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import {history} from 'App';
import {X} from 'react-feather';
import {ModalCloseBtn, AuthenticationBtn} from 'templates/buttons';
import { NonFieldErrors,
         PasswordErrors,
         SmsCodeErrors } from 'templates/authentication/errors'

import { RegistrationSubmitBtn,
         ToogleAuthFormBtn, SpinLoader } from  'templates/authentication/utils'





export const PasswordChangeForm = props => {
    
    
    return(
        <div className="password-change-box">
            <ul className="form-title-box">
                <li className="">Password Change</li>
            </ul>
            <PasswordForm {...props}/>
        </div>
    )
}


export default PasswordChangeForm;


export const PasswordForm =(props)=>{
    let {submitting,
         onSubmit,
         handleFormChange,
         form,
         formName,
         onSignUpForm,
         onPasswordChangeForm,
         validateForm,
         formDescription,
         children,
         successMessage} = props;
        

    if (formName !== 'passwordChangeForm' && 
        formName !== 'passwordChangeConfirmForm'){
        return null;
    }

   

    let passwordChangeForm   = form?.passwordChangeForm;
    
    let passwordChangeConfirmForm =  form?.passwordChangeConfirmForm;

    form = passwordChangeForm || passwordChangeConfirmForm;

    let error = form && form.error; 
    let disabledStyle = submitting? {opacity:'0.60'} : {};
    let formIsValid = validateForm(form);

    let submitButtonStyles = submitting? {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting? {opacity:'0.60'}:{};


    return(
        <form className="password-change-form" 
              onSubmit={(event)=> onSubmit(event, 'passwordChangeForm')} >
                         
            <fieldset style={fieldSetStyles}
                      disabled={submitting || onSignUpForm}>

                <ul className="password-form-description">
                    <li>{formDescription}</li>
                </ul>
                

                <div  className="password-form" >
                {error &&
                    <PasswordErrors {...error}/>
                }
                <div>
                    <div className="change-password-box auth-input-field">
                        <input
                            className="password"
                            placeholder="New Password"
                            type="password"
                            name="new_password1"
                            value={form?.new_password1}
                            onChange={(event)=> 
                                      handleFormChange(event, 'passwordChangeForm')}
                            required
                        />
                    </div>
                    <div className="change-password-box auth-input-field">
                        <input
                            className="password"
                            placeholder="Repeat New Password"
                            type="password"
                            name="new_password2"
                            value={form?.new_password2}
                            onChange={(event)=>
                                        handleFormChange(event, 'passwordChangeForm')}
                            required
                        />
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



export const PassWordChangeForms = props => {
    
    
    return(
        <div className="password-change-contents">
            <div className="password-change-box">
                <ul className="form-title-box">
                    <li className="">Enter Password</li>
                </ul>
               <PasswordChangeForm {...props}/>
            </div>
        </div>
  )
}

export const PasswordConfirmForm =(props)=>{

    return(
        <div className="password-change-contents">
            <div className="password-change-box">
                <div className="confirm-password-title-box">
                    <ul className="confirm-password-title form-title-box">
                        <li className="">Enter Password</li>
                        
                    </ul>
                    <div className="password-confirm-form-dismiss">
                        <ModalCloseBtn> 
                            <X id="feather-x" size={20} color={'red'}/>
                        </ModalCloseBtn>
                    </div>
                </div>

                <_PasswordConfirmForm {...props}/>
            </div>
        </div>
    )
};

export const _PasswordConfirmForm =(props)=>{

    let {submitting,
         onSubmit,
         handleFormChange,
         passwordRest,
         form,
         formName,
         validateForm,
         formDescription,
         children,
         successMessage} = props;
    
    form = form && form.reLoginForm || undefined;
    if (!form) return null;

    let error = form && form.error; 
    let disabledStyle = submitting? {opacity:'0.60'} : {};
    let formIsValid = validateForm(form);

    let submitButtonStyles = submitting || !formIsValid?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting? {opacity:'0.60'}:{};

    return (
        <form className="password-confirm-form" 
              onSubmit={(event)=> onSubmit(event)} >
            <div className="password-form-description-box">
                <ul className="password-form-description">
                    <li>
                        For security purposes, please enter your 
                        password in order to continue. If you signed 
                        up for Wiplayit using Facebook or Google,
                        please <span
                                onClick={()=> passwordRest()}
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
                
            <fieldset style={fieldSetStyles}
                      disabled={submitting}>
                <div  className="" >
                    <div className="confirm-password-box auth-input-field">
                        <div className="confirm-password-input">
                            <input
                                className="password"
                                placeholder="Password"
                                type="password"
                                name="password"
                                value={form?.password}
                                onChange={(event)=> handleFormChange(event)}
                                required
                            />
                        </div>

                        <button
                            onClick={()=> passwordRest()}
                            type="button"
                            className="confirm-password-rest-btn">
                            Forgot Password ?
                        </button>
                    </div>
                    
                    <div className="submit-btn-box confirm-password-submit">
                        <div className="password-confirm-form-cancel">
                            <ModalCloseBtn> 
                                Cancel
                            </ModalCloseBtn>
                        </div>
                        <RegistrationSubmitBtn {...props}/>
                    </div>
                    <div className="password-change-link-box">
                        {children && children[0]}
                        {children && children[1]}
                    </div> 
                </div>
            </fieldset>
        </form>
    )
};

export const SuccessPasswordChange =(props:object)=>{

    return(
        <div className="password-change-success">
            <div className="password-change-success-box">
                <p className="alert-success message-success">
                    You successfully changed  your password with the new one.
                </p>
            </div>
            <div className="authentication-btn-box">
                <button className="btn-sm" 
                        onClick={()=> history.push('user/registration/') }>
                        Login
                </button> 
            </div>
        </div>
    )
};

