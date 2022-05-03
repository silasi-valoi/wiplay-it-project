import {store} from 'store/index';
import {Apis} from 'api';
import {toggleAuthForm} from 'actions/actionCreators';
import {authenticate} from 'dispatch/index';
import {createFormData} from 'utils';
import  * as action  from 'actions/actionCreators';



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

    formData(){
        let form = this.form;
        return createFormData({...form});
    };

    isClean(){
        let errors = this.errors()
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

    errors(){
        let formName = this.formName;
        let form:object = this.form;
               
        let formErrors;
        let isValid = formIsValid(form);

        if (!isValid) {
            formErrors = {non_field_errors:['Please fill in all fields']};
        }
   
        let email = form['email'];
        if (email) {
            
            this.isPhoneNumber = this._isPhoneNumber(email);
            this.isEmail = this._isEmail(email);

            if (!this.isEmail && !this.isPhoneNumber) {
                if (formName === 'signUpForm' || 
                    formName === 'loginForm' || 
                    formName === 'passwordResetForm') {
                    formErrors = {email:['Please enter a valid email or phone number']};
                }else{

                    formErrors = {email:['Please enter a valid email address.']};
                }
            }
        }
               
        return formErrors;
    };

};


export const authSubmit =(self:object, useToken:boolean=false, formName?:string, action?:Function)=>{
    
    let authForm :object = self['state']['authForm'];

    if(!formName){
        formName = authForm['formName'];
    }
   
    let form:object = authForm['form'];
    let validatedForm = new FormValidator({form : form[formName], formName});
    
    if (!validatedForm.isClean()) {
                
        if(form){
            form[formName]['error'] = validatedForm.errors();

            return store.dispatch<any>(toggleAuthForm({form, formName, submitting : false}));

        }
    }

    let apiUrl = getAuthUrl(formName);  
    let email = form['email'];
          
    let isPhoneNumber:boolean = validatePhoneNumber(email);
    let isEmail:boolean = validateEmail(email);
    
    store.dispatch<any>(toggleAuthForm({isEmail, isPhoneNumber, submitting : true}));

    form = validatedForm.formData();    
    
    if (action) {
        return store.dispatch<any>(action({apiUrl, form, formName, useToken}));
    }
   
    return store.dispatch<any>(authenticate({apiUrl, form, formName, useToken}));
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
    return numberRegExp.test(phoneNumber)
};

export const validateEmail=(email:string):boolean =>{
    let emailRegExp;
    emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegExp.test(email)
  
}


export const updateAuthForm = (self, form:object, formName:string, options?:object) : void => {
    let _store:object = store.getState().entities;  
    
    let authForm:object = _store['authForm'];
    
    let currentForm:object = authForm['form'];
    form = constructForm(currentForm, form, formName);
       
    store.dispatch<any>(toggleAuthForm({...authForm, form, formName, ...options}));
};


export const constructForm =(currentForm:object, newForm:object, formName:string)=> {
    
    if(currentForm && formName) {

        if (Object.keys(newForm)) {
            currentForm[formName] = newForm;
        }

       return currentForm
        
    }else {
                    
        let formValue = {
            value        : newForm,
            writable     : true,
            configurable : true,
            enumerable   : true,
        };

        return Object.defineProperty({}, formName, formValue)
    }
};


export const getFormFields = () : object => {
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
        phoneNumberForm : {
            'phone_number':'',
            'country_code':'',
            'dial_code':'',
            'country_name':'',
            'format':'',

        }, 

    };  
};

export const getAuthUrl =(formName)=> {
    if (!formName) return;
            
    switch(formName){
        case 'loginForm':
        case 'reLoginForm':
            return Apis.logginUser();

        case 'signUpForm':
            return Apis.createUser();
                
        case 'passwordResetForm':
            return Apis.passwordResetApi();

        case 'passwordChangeForm':
            return Apis.passwordChangeApi();

        case 'passwordChangeConfirmForm':
            return Apis.passwordChangeConfirmApi();

        case 'passwordResetSmsCodeForm':
            return Apis.passwordResetSmsConfirmApi();

        case 'emailResendForm':
            return Apis.confirmationEmailResendApi();

        case 'phoneNumberConfirmationForm':
            return Apis.accountConfirmPhoneNumberApi();

        case 'addEmailForm':
            return Apis.addEmailApi();

        case 'addPhoneNumberForm':
            return Apis.addPhoneNumberApi();

        case 'sendEmailConfirmationForm':
            return Apis.sendConfirmationEmailApi();
    
        case 'sendConfirmationCodeForm':
            return Apis.sendConfirmationCodeApi();
            
        case 'removeEmailForm':
            return Apis.removeEmailApi();
    
        case 'removePhoneNumberForm':
            return Apis.removePhoneNumberApi();
            

        default:
            return  '';
    };
            
};
