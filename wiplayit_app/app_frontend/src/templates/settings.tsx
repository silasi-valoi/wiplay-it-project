
import React, {Component} from 'react';

import {PasswordConfirmModalBtn} from 'templates/buttons';

import {PasswordForm} from 'templates/authentication/password-change';

import {NonFieldErrors,
        PhoneNumberFieldErrors,
        EmailFieldErrors} from 'templates/authentication/errors';



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
    let {toggleEmailForm,
        onAddEmailForm,
         currentUser} = props;
         
    let account = currentUser;
    let emailAddress = currentUser && currentUser.email_address;
    
    let email;
    if (emailAddress) {
        emailAddress.map((value)=>{
                    if (value.primary) {
                        email = value.email;
                    }
                    return emailAddress;
                })
    }
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
                        onClick={()=>toggleEmailForm()} 
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
    let {togglePhoneNumberForm,
         onAddPhoneNumberForm,
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
                           onClick={()=>togglePhoneNumberForm()}
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
    let {togglePasswordChangeForm,
         onPasswordChangeForm,
         currentUser,} = props;

    let account = currentUser;
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
                        onClick={()=>togglePasswordChangeForm()}
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
}

const NonPrimaryEmail = (props) => {
    let {sendConfirmation,
         currentUser,
         removePhoneNumber} = props;

    let account = currentUser;
    let emailAddress = account && account.email_address;
    let email = account && account.email;
    

    emailAddress = emailAddress && emailAddress.filter(email => 
                                                        email.primary === false);
    
    if (!emailAddress) return null;

    return(
        <div>
            {emailAddress.map((email, key)=>
                <div key={key} className="non-primary-email-box">
                    <ul className="non-primary-email">
                        <li>{email.email}</li>
                    </ul>
                    <ul className="non-primary-email-btns">
                        {!email.verified &&
                        <button
                            type="button" 
                            className="btn-sm confirm-email-btn"
                            onClick={()=> sendConfirmation(email.email)}>
                            confirm
                        </button>   
                        }
                    
                        <button
                            type="button" 
                            className="btn-sm remove-email-btn"
                            onClick={()=> removePhoneNumber(email) }>
                                Remove
                        </button>
                    </ul>
                </div>
            )}

        </div>
    )
}


const NonPrimaryPhoneNumber = (props) => {
    let {sendConfirmation,
         currentUser,
         removePhoneNumber} = props;

    let account = currentUser;
    let phoneNumbers = account && account.phone_numbers;
    
    phoneNumbers = phoneNumbers && phoneNumbers.filter(phone_number => 
                                                    phone_number.primary === false);
    

    return(
        <div className="">
            {phoneNumbers && phoneNumbers.map((phoneNumber, key)=>{
                        
                return(
                 <div key={key} className="non-primary-email-box">
                    <ul className="non-primary-email">
                        <li>{phoneNumber.national_format}</li>
                    </ul>
                    <ul className="non-primary-email-btns">
                        {!phoneNumber.verified &&
                        <button
                            type="button" 
                            className="btn-sm confirm-email-btn"
                            onClick={()=> sendConfirmation(phoneNumber.primary_number)}>
                            confirm
                        </button>   
                        }
                    
                        <button
                            type="button" 
                            className="btn-sm remove-email-btn"
                            onClick={()=> removePhoneNumber(phoneNumber.primary_number)}>
                                Remove
                        </button>
                    </ul>
                </div>
                )
            })}
        </div>
    )
}

const AddEmailAddressForm = (props)=> {
    let {handleFormChange,
         onSubmit,
         submitting,
         formName,
         form} = props;

    form = form && form.addEmailForm;
    if (!form) return null;
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
                            onChange={(event)=> handleFormChange(event, 'addEmailForm')}
                        />
                    </div>

                    <div className="submit-email-btn-box">
                        <button type="button"
                            onClick={(event)=> onSubmit(event, 'addEmailForm')}
                            className="btn-sm submit-email-btn">
                            Add Email 
                        </button>
                    </div>
                </div>
            </fieldset>
        </form>
    )

}



const AddPhoneNumberForm = (props)=> {
    let {handleFormChange,
         onSubmit,
         submitting,
         formName,
         form} = props;

    form = form && form.addPhoneNumberForm;
    if (!form) return null;
    let fieldSetStyles = submitting && {opacity:'0.60'} || {};

    return(
        <form className="add-phone-number-form">
            <fieldset style={fieldSetStyles} 
                      disabled={submitting} >
            <div className="add-phone-number-form-contents">
                <div className="add-phone-number-input-box">
                    <input 
                        className="add-phone-number-input"
                        type="number" 
                        name="phone_number"
                        placeholder=""
                        value={form && form.phone_number}
                        onChange={(event)=> handleFormChange(event, 'addPhoneNumberForm')}
                    />
                </div>

                <div className="submit-email-btn-box">
                    <button type="button" 
                        onClick={(event)=> onSubmit(event, 'addPhoneNumberForm')}
                        className="btn-sm submit-email-btn">
                        Add Phone Number 
                    </button>
                </div>
            </div>
            </fieldset>
        </form>
    )

}
