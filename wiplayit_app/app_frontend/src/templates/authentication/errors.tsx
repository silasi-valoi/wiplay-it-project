import React from 'react';

export const  NonFieldErrors = errors => {
    if (!errors) return null;

    return(
        <div className="errors-box">
            {errors.non_field_errors && 
                <ul className="form-errors">
                { errors.non_field_errors.map(( error, index) =>
                    <li key={index}>{error}</li>
                )}
                </ul>
            }   
        </div>
    )   
}

export const  EmailFieldErrors = errors => {
    if (!errors) return null;

    return(
        <div>
            {errors.email && 
                <ul className="form-errors">
                    { errors.email.map(( error, index) =>
                        <li key={index}>{error}</li>
                    )}
                </ul>
            }   
        </div>
    )   
};


export const  PhoneNumberFieldErrors = errors => {
    if (!errors) return null;

    return(
        <div>
            {errors.phone_nmber && 
                <ul className="form-errors">
                    { errors.phone_nmber.map((error, index) =>
                        <li key={index}>{error}</li>
                    )}
                </ul>
            }   
        </div>
    )   
};


export const  PasswordErrors = errors => {
    if (!errors) return null;
    
    let passwordErrors = errors.new_password2 || errors.new_password1

    return(
        <ul className="form-errors">
            { passwordErrors  && 
                passwordErrors.map(( error, index) =>
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
    if (!errors) return null;

    return(
        <div>
            {errors.country && 
                <ul className="form-errors">
                    { errors.country.map(( error, index) =>
                        <li key={index}>{error}</li>
                    )}
                </ul>
            }   
        </div>
    )   
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












