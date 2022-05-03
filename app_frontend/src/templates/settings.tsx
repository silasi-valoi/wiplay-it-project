
import React from 'react';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import {PasswordForm} from 'templates/authentication/password-change';
import { EmailFieldErrors, NonFieldErrors, PhoneNumberFieldErrors } from './authentication/errors';


export const SettingsTemplate =(props)=>{
    
    return(
        <div className="settings-contents">
            <ul className="settings-page-title">
                <li className="">
                    Account settings
                </li>
            </ul>
            <EmailSettings {...props}/>
            <PhoneNumberSettings {...props}/>
            <PasswordChangeSettings {...props}/>
        </div>
    )
};


const EmailSettings = (props) => {
    let {toggleForm,
        authForm,
         currentUser} = props;
         
    
    let emailAddress = currentUser && currentUser.email_address;
    
    let email;
    if (emailAddress) {
        emailAddress.map((value)=>{
            if (value.primary) {
                email = value.email;
            }
            return emailAddress;
        });
    }
    let onAddEmailForm = authForm && authForm['onAddEmailForm'];
    let addEmailStyles = onAddEmailForm && {opacity:'0.60'} || {};
    
    return(
        <div className="email-settings account-settings">
            <ul className="settings-items">
                <li className="">
                    Email
                </li>
            </ul>
            <div className="account-email">
                <div className="primary-email-box">
                    <ul className="primary-email-title">
                        <li className="">
                           Primary Email
                        </li>
                    </ul>
                    <ul className="primary-email">
                        <li>{email}</li>
                    </ul>
                </div>
                <NonPrimaryEmail {...props}/>

                <div className="add-email-btn-box">
                    <button type="button" 
                            style={addEmailStyles}
                            disabled={onAddEmailForm}
                        onClick={()=>toggleForm('addEmailForm')} 
                        className="btn-sm add-email-btn">
                        Add Another Email Address
                    </button>
                    <AddEmailAddressForm {...props}/>
                </div>

            </div>
        </div>  
    )
};


const PhoneNumberSettings = (props) => {
    let {toggleForm,
         authForm,
         currentUser,} = props;

    let account = currentUser;
    let phoneNumbers = account && account.phone_numbers;

    let phoneNumber;
    if (phoneNumbers) {
        phoneNumbers.map((number)=>{
                    if (number.primary) {
                        phoneNumber = number.national_format;
                    }
                    return phoneNumbers;
                })
    }

    let  onAddPhoneNumberForm = authForm && authForm['onAddPhoneNumberForm']

    let addPhoneNumberStyles = onAddPhoneNumberForm && {opacity:'0.60'} || {};
    
    return (
        <div className="phone-number-settings account-settings">
            <ul className="settings-items">
                <li>
                    Phone Number
                </li>
            </ul>

            <div className="account-phone-number">
                <div className="primary-email-box">
                    <ul className="primary-email-title">
                        <li className="">
                           Primary Phone Number
                        </li>
                    </ul>

                    <ul>
                        <li className="primary-phone-number">
                            {phoneNumber}
                        </li>
                    </ul>
                </div>
                
                <NonPrimaryPhoneNumber {...props}/>
                <div className="add-email-btn-box">
                   <button type="button"
                           style={addPhoneNumberStyles}
                           disabled={onAddPhoneNumberForm} 
                           onClick={()=> toggleForm('addPhoneNumberForm')}
                           className="btn-sm add-email-btn">
                        Add Another Phone Number
                    </button>
                    <AddPhoneNumberForm {...props}/>
                </div>
            </div>
        </div>    
    )

};


const PasswordChangeSettings = (props) =>{
    let { authForm, togglePasswordChangeForm } = props;
    let onPasswordChangeForm = authForm && authForm['onPasswordChangeForm'];
        
    let formDescription = 'Enter a new passsword on both fields.';
    let passswordProps = {...props, formDescription};
    let changePasswordStyles = onPasswordChangeForm && {opacity:'0.60'} || {};

    return(
        <div className="">
            <div className="password-settings account-settings">
                <ul className="settings-items">
                    <li>
                        Password
                    </li>
                </ul>

                <div className="change-password-btn-box">
                    <button type="button"
                        style={changePasswordStyles}
                        disabled={onPasswordChangeForm}
                        onClick={()=> togglePasswordChangeForm()}
                        className="btn-sm change-password-btn">
                        Change Password
                    </button>
                    
                </div>

            </div>
            {onPasswordChangeForm &&
                <PasswordForm {...passswordProps}/>
             }
            
        </div>   
    )
};

const NonPrimaryEmail = (props) => {
    let {  sendEmailConfirmation, currentUser, removeEmail } = props;

    let account = currentUser;
    let emailAddress = account && account.email_address;
    emailAddress = emailAddress && emailAddress.filter(email => email.primary === false);
    
    if (!emailAddress) return null;

    return(
        <div>
            { emailAddress.map((email, key)=>
                <div key={key} className="non-primary-email-box">
                    <ul className="non-primary-email">
                        <li>{email.email}</li>
                    </ul>
                    <ul className="non-primary-email-btns">
                        {!email.verified &&
                        <button
                            type="button" 
                            className="btn-sm confirm-email-btn"
                            onClick={()=>  sendEmailConfirmation(email.email, 'sendConfirmationEmailForm')}>
                            confirm
                        </button>   
                        }
                    
                        <button
                            type="button" 
                            className="btn-sm remove-email-btn"
                            onClick={()=> removeEmail(email.email, 'removeEmailForm') }>
                                Remove
                        </button>
                    </ul>
                    <NonFieldErrors {...props}/>
                </div>
            )}

        </div>
    )
}


const NonPrimaryPhoneNumber = (props) => {
    let { sendConfirmationCode,
         currentUser,
         removePhoneNumber} = props;

    let account = currentUser;
    let phoneNumbers = account && account.phone_numbers;
    
    phoneNumbers = phoneNumbers && phoneNumbers.filter(phone_number => 
                                                    phone_number.primary === false);
    

    return(
        <div className="">
            {phoneNumbers && phoneNumbers.map((phoneNumber:string, key:number)=>{
                        
                return(
                 <div key={key} className="non-primary-email-box">
                    <ul className="non-primary-email">
                        <li>{phoneNumber['national_format']}</li>
                    </ul>
                    <ul className="non-primary-email-btns">
                        {!phoneNumber['verified'] &&
                        <button
                            type="button" 
                            className="btn-sm confirm-email-btn"
                            onClick={()=>  sendConfirmationCode(phoneNumber, 'sendConfirmationCodeForm')}>
                            confirm
                        </button>   
                        }
                    
                        <button
                            type="button" 
                            className="btn-sm remove-email-btn"
                            onClick={()=> removePhoneNumber(phoneNumber['phone_number'], 'removePhoneNumberForm')}>
                            Remove
                        </button>
                        
                    </ul>

                    <NonFieldErrors {...props}/>
                </div>
                )
            })}
        </div>
    )
}

const AddEmailAddressForm = (props)=> {

    let { handleFormChange, onSubmit, authForm } = props;
    let { form, submitting } = authForm;
    let formName:string = 'addEmailForm';
   
    form = form && form[formName];
    
    if (!form) return null;
    let error = form.error;
    let fieldSetStyles = submitting && {opacity:'0.60'} || {};
           
    return(
        <form className="add-email-form">
            <fieldset style={fieldSetStyles} 
                      disabled={submitting} >
                <div className="add-email-form-contents">
                    <div className="add-email-input-box">
                        <input 
                            className="add-email-input"
                            type="email" 
                            name="email"
                            placeholder="name@example.com"
                            value={form && form.email}
                            onChange={(event)=> handleFormChange(event, formName)}
                        />
                    </div>

                    <div className="submit-email-btn-box">
                        <button type="button"
                            onClick={(event)=> onSubmit(event, formName)}
                            className="btn-sm submit-email-btn">
                            Add Email 
                        </button>
                    </div>
                </div>

                <EmailFieldErrors {...error}/>
            </fieldset>
        </form>
    )
};



const AddPhoneNumberForm = (props)=> {
    let {handleCountry,
         onSubmit,
         authForm,
        } = props;

    let {form, submitting} = authForm;

    let formName:string = 'addPhoneNumberForm';
    form = form && form[formName];

    if (!form) return null;
    
    let error = form.error
    let fieldSetStyles = submitting && {opacity:'0.60'} || {};
    

    return(
        <form className="add-phone-number-form">
            <fieldset style={fieldSetStyles} 
                      disabled={submitting} >
            <div className="add-phone-number-form-contents">
                <div className="add-phone-number-input-box">

                    <PhoneInput
                        country={'za'}
                        value={form.phone_number}
                        onChange={(phoneNumber, phoneNumberInfo)=> {
                            handleCountry(phoneNumber, phoneNumberInfo)
                        }}
                    />
                   
                </div>

                <div className="submit-email-btn-box">
                    <button type="button" 
                        onClick={(event)=> onSubmit(event, formName)}
                        className="btn-sm submit-email-btn">
                        Add Phone Number 
                    </button>
                </div>
            </div>
            <PhoneNumberFieldErrors {...error}/>
            </fieldset>
        </form>
    )

};


