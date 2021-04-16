import React from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import {history} from 'App';
import EmailForm from 'templates/authentication/email-form';



const PasswordResetForm = props => {
    console.log(props)
   
    return(
        <div>
            <ul className="form-title-box">
                <li className="">Password Reset</li>
            </ul>

            <EmailForm {...props}/>
        </div>
    )
};


export default PasswordResetForm;
