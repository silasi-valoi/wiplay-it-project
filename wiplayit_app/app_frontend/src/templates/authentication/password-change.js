import React from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import {history} from 'App';

import { NonFieldErrors } from 'templates/authentication/errors'

import { CancelFormBtn,
         RegistrationSubmitBtn,
         LoginSmallScreem,
         LoginBigScreem,
         SpinLoader } from  'templates/authentication/utils'





export const PassWordChangeForm = props => {
    let { submitting, form, formName,
          onSignUpForm,onPasswordChangeForm,
           formIsValid , validateForm, successMessage } = props;

    let disabledStyle = submitting || onSignUpForm? 
                                  {opacity:'0.60'}:
                                  {};
    
    form = form && form.passwordChangeForm? 
                           form.passwordChangeForm:null;
    let error = form && form.error; 

    formIsValid = onPasswordChangeForm? validateForm(form, formName):false;

    console.log(form, props)

    let submitButtonStyles = submitting || onSignUpForm || !formIsValid?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting || onSignUpForm ? {opacity:'0.60'}:{};
    
    return(
    <div>
        {form?

        <div className="">
            <ul className="form-title-box">
                <li className="">Password Change</li>
            </ul>

            { !successMessage?
                <div>
                    <div className="password-change-success-box">
                        <p className="password-change-success message-success">
                            { successMessage}. Chick bellow to login with your new password
                        </p>
                    </div>
                    <div className="confirmation-login-btn-box">
                        <LoginSmallScreem/>
                        <LoginBigScreem/>
                    </div>
                </div>

                :

            <form className="password-change-form" onSubmit={props.onSubmit} >
                <li className="password-form-description">{props.Description}</li>
               

               <fieldset style={ fieldSetStyles}
                disabled={ submitting || onSignUpForm}>
                    {error &&
                        <NonFieldErrors {...error}/>
                    }

                   <div  className="" >
                     <div className="change-password-box auth-input-field">
                        <input
                           className="password"
                           placeholder="New Password"
                           type="password"
                           name="new_password1"
                           value={form.new_password1}
                           onChange={props.handleFormChange}
                           required
                        />
                     </div>

                     <div className="change-password-box auth-input-field">

                        <input
                           className="password"
                           placeholder="Repeat New Password"
                           type="password"
                           name="new_password2"
                           value={form.new_password2}
                           onChange={props.handleFormChange}
                           required
                        />
                     </div>
                    <div className="submit-btn-box">
                        <RegistrationSubmitBtn {...props}/>
                    </div>
      
                  </div>
               </fieldset>
            </form>
         }

         <SpinLoader {...props}/> 
      </div>
      :
      ""
    }
    </div>
  )
}


export default PassWordChangeForm;

