import {store} from 'store/index';
import Api from 'utils/api';
import {authenticate} from 'dispatch/index';
import Helper from 'utils/helpers';




export default class FormValidator {
    public formName:string;
    public form:object;
    public isEmail:boolean;
    public isPhoneNumber:boolean;
    
    constructor(props){
        this.formName = props.formName;
        this.form = props.form;
        this.isEmail = false;
        this.isPhoneNumber = false;
    };

    cleanForm(){
        
        const helper = new Helper();
        let formName = this.formName;
        let form     = this.form[formName];
        return helper.createFormData({...form});
    };

    formIsClean(){
        let errors = this.formErrors()
        if (errors) {
            return false;
        }else{
            return true;
        }
    };

    _isPhoneNumber(value):boolean{
        if (value) {
            return validatePhoneNumber(value);
        }
        return false;
    };

    _isEmail(value):boolean{
        if (value) {
            return validateEmail(value);
        }
        return false;
    };

    formErrors(){
        let formName = this.formName;
        let form     = this.form && this.form[formName];
               
        let formErrors;
        let isValid = formIsValid(form);

        if (!isValid) {
            formErrors = {non_field_errors:['Please fill in all fields']};
        }
                
        if (form && form.email) {
            let {email} = form;
            this.isPhoneNumber = this._isPhoneNumber(email)
            this.isEmail = this._isEmail(email)

            if (!this.isEmail && !this.isPhoneNumber) {
                formErrors = {email:['Please enter a valid email or phone number']}
            }
        }

        if (formName === 'signUpForm' && !form.country) {
            formErrors = {country:['Please select your country']}
        }
                
        return formErrors;
    };

};

/*

export class Authentication {
    constructor(props){

    }

    responseFacebook =(response)=> {
        console.log(response)
        let apiUrl =  api.facebookLoginApi();
        let accessToken =  response.accessToken
        accessToken && this._SendSocialAuthentication(accessToken, apiUrl)

        return ;
    };


    responseTwitter =(response)=> {
        let accessToken =  response.accessToken
        let apiUrl =  api.twitterLoginApi(this)
        accessToken && this._SendSocialAuthentication(accessToken, apiUrl)
         
        return ;
    };


    responseGoogle =(response)=> {
        let accessToken =  response.accessToken
        let apiUrl =  api.googleLoginApi();
        accessToken && this._SendSocialAuthentication(accessToken, apiUrl)
        return ;
    };

    _SendSocialAuthentication =(accessToken, apiUrl)=>{
        let isSocialAuth = true
        let form   = helper.createFormData({"access_token": accessToken});
        this.setState({isSocialAuth, submitting:true})
        return this.props.authenticate({ apiUrl, form, isSocialAuth });

    };
    
    handleFormChange=(e)=>{
        if (!this.isMounted) return;

        e.preventDefault()
        changeForm(this, event);
    };

    selectCountry =(val)=> {
        if (!this.isMounted) return;
        let {formName, form} = this.state;
        form[formName]['country'] = val
        this.setState({ form });
    };

    hideToggledForm =()=>{
        let {onPasswordResetForm,
             onEmailResendForm,
             onSignUpForm} = this.state;

        onPasswordResetForm && this.setState({onPasswordResetForm : false})
        onEmailResendForm   && this.setState({onEmailResendForm : false})

    }   
    
    formConstructor =(name, opts={})=> {
            if (!this.isMounted) return;
            
            if (name) {
                let formName = name;
                let currentForm = this.state.form
                if (currentForm) {
                    //return
                }

                let defaultActiveForm = formName;
                let form = null;

                switch(formName){

                    case 'loginForm':
                        form = getFormFields().loginForm;
                        return this._SetForm(form, formName)

                    case 'signUpForm':

                        form = getFormFields().signUpForm;
                        return this._SetForm(form, formName);

                    case 'passwordResetForm':
                        form = getFormFields().emailForm;
                        return this._SetForm(form, formName); 

                    case 'emailResendForm':
                        form = getFormFields().emailForm;
                        return this._SetForm(form, formName);

                    case 'passwordResetSmsCodeForm':
                        form = getFormFields().smsCodeForm;
                        return this._SetForm(form, formName)

                    case 'passwordChangeConfirmForm':
                    case 'passwordChangeForm':
                        form = getFormFields().passwordChangeForm;
                        form = Object.assign(opts, form);
                        return this._SetForm(form, formName);

                    default:
                        return null;
                };

            }
        };

         _SetForm =(form, formName)=> {
            if (!this.isMounted) return;

            let currentForm = this.state.form;
            form = setForm(form, currentForm, formName);
            this.setState({form, formName, successMessage:undefined});
            this.setFormOpts(formName);
            
        };

        setFormOpts(formName){
            if (formName) {
                switch(formName){

                    case 'loginForm':
                        return this.setState({ onLoginForm : true})
                  
                    case 'signUpForm':
                        return this.setState({onSignUpForm : true})

                    case 'passwordResetForm':
                        return this.setState({onPasswordResetForm : true});

                    case 'emailResendForm':
                        return this.setState({ onEmailResendForm : true });
                        
                    case 'passwordResetSmsCodeForm':
                        return this.setState({onPasswordResetSmsCodeForm:true});
                        
                    case 'passwordChangeConfirmForm':
                        return this.setState({onPasswordChangeConfirmForm : true});
                        
                    default:
                        return null;
                };

            }

        };

        getCurrentDefaultForm=()=>{
           return this.state.defaultActiveForm;
        }
        
        toggleSignUpForm =(params={})=>{
            //if(!this.isMounted) return;
            let { value } = params;

            if (!params.value) {
                this.setState({onSignUpForm : false})
                this.formConstructor(currentFormName) 
            }

            if ( params.value) {
                this.formConstructor("signUpForm");
            }
        };

        toggleEmailForm = (params) => {
            let {value,
                 successMessage,
                 defaultFormName,
                 formName } = params;

            if (value) {
                this.formConstructor(formName)

            }else{
                this.hideToggledForm();
                this.formConstructor(defaultFormName)
            }
        };
      
};*/


export const authSubmit =(self:object,formName?:string, useToken:boolean=false)=>{
    const state:object = self['state']
    formName  = formName || state['formName'];
    let validatedForm  = getForm(self, formName);
              
    _isSubmitting(self, formName);
        
    if (!validatedForm.formIsClean()) {
        
        let error = validatedForm.formErrors(); 
        return setFormErrors(self, error, formName);
    }

    let apiUrl = getAuthUrl(formName);           
    let form   = validatedForm.cleanForm();
    return store.dispatch<any>(authenticate({apiUrl, form, formName, useToken}));

};

export const getForm =(self:object, formName:string):FormValidator => {
    let form :object = self['state']['form'];
    
    return new FormValidator({form, formName});
}; 

export const setFormErrors =(self, error, formName)=> {
    let form = self.state.form;

    if (form) {
        form[formName]['error'] = error
        self.setState({form, submitting : false});
    }
}

export const _isSubmitting=(self, formName)=>{
    let {form} = self.state;
    form = form && form[formName]

    if (form && form.email) {
        let isPhoneNumber = validatePhoneNumber(form.email);
        let isEmail       = validateEmail(form.email); 
        self.setState({isEmail, isPhoneNumber})  
    }
        
    self.setState({submitting : true})
};

export const formIsValid =(form:object)=> {
    //Check form is complete

    if (form) {
        for (let key in form) {
            if(/^ *$/.test(form[key])){
                return false; //Form is not complete
            }
        }
        return true
    }else{
        return false
    }
};

export const validatePhoneNumber=(phoneNumber:string):boolean =>{
    let numberRegExp = /^\+?[\d\s]+$/
    let isPhoneNumber = numberRegExp.test(phoneNumber)
 
    return isPhoneNumber || false;
};

export const validateEmail=(email:string):boolean =>{
    let emailRegExp;
    emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let isEmail = emailRegExp.test(email)
     
    return isEmail || false;
}

export const changeForm =(self, event)=> {
    let  {form, formName} = self.state;
    
    if (form && formName) {
        form[formName][event.target.name] = event.target.value;
        self.setState({form});
    }
};

export const setForm =(form, currentForm, formName)=> {
    
    if (currentForm && formName) {
        if (!currentForm[formName]) {
            currentForm[formName] = {...form}
        }

        form = currentForm;
    }else{
        
        let formValue = {
            value        : form,
            writable     : true,
            configurable : true,
            enumerable   : true,
        };

        form = Object.defineProperty({}, formName, formValue);
    }
    return form;
};


export const getFormFields =()=> {
    return {
        loginForm  : {
            'email':'',
            'password':''
        },

        signUpForm : {
            'first_name' : '',
            'last_name'  : '',
            'email'      : '',
            'password'   : '',
            'country'    : 'ZA',
        },

        emailForm  : {
            'email'  : '',
        },

        smsCodeForm  : {
            'sms_code'  : '',
        }, 

        passwordChangeForm : {
            'new_password1' : '',
            'new_password2' : '',
        },
        phoneNumberForm : {phone_number:''}, 

    };  
};
export const getAuthUrl =(formName)=> {
    if (!formName) return;
    const api = new Api();
        
    switch(formName){
        case 'loginForm':
        case 'reLoginForm':
            return api.logginUser();

        case 'signUpForm':
            return api.createUser();
                
        case 'passwordResetForm':
            return api.passwordResetApi();

        case 'passwordChangeForm':
            return api.passwordChangeApi();

        case 'passwordChangeConfirmForm':
            return api.passwordChangeConfirmApi()

        case 'passwordResetSmsCodeForm':
            return api.passwordResetSmsConfirmApi();

        case 'emailResendForm':
            return api.confirmationEmailResendApi();

        case 'phoneNumberConfirmationForm':
            return api.accountConfirmPhoneNumberApi();

        case 'addEmailForm':
            return api.addEmailApi();

        case 'addPhoneNumberForm':
            return api.addPhoneNumberApi();

        default:
            return  '';
    };
            
};
