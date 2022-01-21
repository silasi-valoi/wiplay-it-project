import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import {formIsValid} from 'containers/authentication/utils';

import {NonFieldErrors, EmailFieldErrors} from "templates/authentication/errors"

export const MessageForm = props => {
	let {form,
		 error,
		 handleChange,
		 handleSubmit,
		 textAreaProps,
		 submitting,
		} = props;

	let fieldSetStyles; 
	let submitBtnStyles;

	if (submitting || !formIsValid(form)) {
		submitBtnStyles = {opacity:'0.60'};
		
	}else{
		
		submitBtnStyles = {};
	}

	if (submitting) {
		fieldSetStyles  = {opacity:'0.60'};
	}else{
		fieldSetStyles = {}; 
	}

    console.log(submitBtnStyles, fieldSetStyles, submitting)

	return (
		 <fieldset  disabled={submitting} 
                       style={fieldSetStyles}
                       className="fieldset-signup" >
		<div className="message-form">
            <div className="feedback-form-container">
                <div className="feedback-form-box">
                	<NonFieldErrors {...error}/>

                    <div className="">
                    	<label htmlFor="full_name" className="input-label">
                        	Full Name
                        	<span aria-hidden="true" className="required">*</span>
                        </label>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="" 
                                className=""
                                name="full_name"
                                value={form && form.full_name || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="full-name-box">
                        <label htmlFor="email" className="input-label">
                        		Your email address
                           	<span aria-hidden="true" className="required">*</span>
                        </label>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="" 
                                className=""
                                name="email"
                                value={form && form.email || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="subject-box">
                        <label htmlFor="subject" className="input-label">
                        	Subject
                        	<span aria-hidden="true" className="required">*</span>
                        </label>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="" 
                                className=""
                                name="subject"
                                value={form && form.subject || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="description-box">
                        
                        <label htmlFor="description" className="input-label">
                        	Description
                        	<span aria-hidden="true" className="required">*</span>
                        </label>
                        <div className="description-textarea-box">
                            <TextareaAutosize {...textAreaProps} rows={4}/>
                       	</div>
                    </div>
                    <div className="message-submit-box">
                       	<button type="button"
                       			style={submitBtnStyles} 
                				disabled={submitting}
                        		onClick={() => handleSubmit()}
                        		className="btn-sm message-submit-btn">
                            	Submit
                    	</button>
                    </div>	
                </div>
            </div>
        </div>
        </fieldset>
	)
};













