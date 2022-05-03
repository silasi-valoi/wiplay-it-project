import React from 'react';

export const  NonFieldErrors = errors => {
    let error:string[] = errors.non_field_errors;

    if (!error) return null;
 
    return(
        <div className="errors-box">
            <ul className="form-errors">
                {error.map((error, index) =>
                    <li key={index}>{error}</li>
                )}
            </ul>
        </div>
    );   
};

export const  EmailFieldErrors = errors => {
    let error:string[] = errors.email;

    if (!error) return null;
  
    return(
        <div>
            <ul className="form-errors">
                {error && error.map(( error, index) =>
                    <li key={index}>{error}</li>
                )}
            </ul>
        </div>
    )   
};


export const  PhoneNumberFieldErrors = errors => {
    let error:string[] = errors?.phone_number;
    
    if (!error) return null;

    return(
        <div>
            <ul className="form-errors">
                {error && error.map((error, index) =>
                    <li key={index}>{error}</li>
                )}
            </ul>
        </div>
    );
};


export const  PasswordErrors = errors => {
    let error:string[] = errors.new_password2 || errors.new_password1;
    if (!error) return null;

    return(
        <ul className="form-errors">
            {error && error.map(( error, index) =>
                <li key={index}>{error}</li>   )
                ||
                <li>
                   Unable to change password.
                </li>
            }
        </ul>
    )   
};


export const  CountryFieldErrors = errors => {
    let error:string[] = errors.country;
    if (!error) return null;

    return(
        <div>
            <ul className="form-errors">
               {error && error.map(( error, index) =>
                    <li key={index}>{error}</li>
                )}
            </ul>
        </div>
    );   
};


export const  SmsCodeErrors = errors => {
    return(
         <ul className="form-errors">
            <li>
                Unable to change password. You can click on the link to request
                another change
            </li>
            
        </ul>
    )   
};


export const FormErrors =(form)=> {
    let formErrors = form && form.passwordChangeForm || null;
    formErrors = formErrors && formErrors.error; 
    if (!formErrors) return;
    return(
        <div>
            <NonFieldErrors {...formErrors}/>
            <PasswordErrors {...formErrors}/>
            <SmsCodeErrors {...formErrors}/>
            <CountryFieldErrors {...formErrors}/>
            <EmailFieldErrors {...formErrors}/>
        </div>
    );
}; 












