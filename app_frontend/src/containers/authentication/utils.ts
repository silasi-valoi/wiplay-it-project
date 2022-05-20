import {store} from 'store/index';
import {Apis} from 'api';
import {toggleAuthForm} from 'actions/actionCreators';
import {authenticate} from 'dispatch/index';
import {createFormData} from 'utils';



export default class FormValidator {
    public formName:string;
    public form:object;
    public formErrors:object;
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
        this.validate();

        if (this.formErrors) {
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

    validate = () => {
        let form:object = this.form;

        console.log(form)          
        
        let isValid = formIsValid(form);
        if (!isValid) {
            this.formErrors = {non_field_errors:['Please fill in all fields']};
            return
        }
        
        let formName = this.formName;

        if (formName === 'signUpForm') {
            this. validateSignupForm(form);
            
        } else if (formName === 'loginForm'){
            this. validateLoginForm(form)
            
        }
    };


    validateSignupForm = (form:object) => {
        let email:string = form['email'];
        let phoneNumber:string = form['phone_number'];

        this.isPhoneNumber = this._isPhoneNumber(phoneNumber);
        this.isEmail = this._isEmail(email);
        console.log("Phone Number: ",this.isPhoneNumber, phoneNumber)
        console.log("Email Address: ",this.isEmail, email)
 
        if (phoneNumber && !this.isPhoneNumber) {
            this.formErrors = {email:['Please enter a valid phone number']};

        }else if(email && !this.isEmail){
            this.formErrors = {email:['Please enter a valid email address.']};
        }
    };


    validateLoginForm = (form:object) => {
        let email = form['email'];
        this.isPhoneNumber = this._isPhoneNumber(email);
        this.isEmail = this._isEmail(email);

    };

   
};


export const authSubmit =(useToken:boolean=false, formName?:string)=>{
    let _store:object = store.getState().entities;  
    
    let authForm:object = _store['authForm'];

    if(!formName){
        formName = authForm['formName'];
    }
   
    let form:object = authForm['form'];
    let validatedForm = new FormValidator({form : form[formName], formName});
    
    if (!validatedForm.isClean()) {
                
        if(form){
            form[formName]['error'] = validatedForm.formErrors;
            return store.dispatch<any>(toggleAuthForm({form, formName, submitting : false}));
        }
    }

    let apiUrl = getAuthUrl(formName);  

    if (authForm['withPhoneNumber']) {
        apiUrl = Apis.phoneNumberRegisterApi();
    } 
              
    let isPhoneNumber:boolean = validatedForm.isPhoneNumber;
    let isEmail:boolean = validatedForm.isEmail;
    
    store.dispatch<any>(toggleAuthForm({isEmail, isPhoneNumber, submitting : true}));

    form = validatedForm.formData();  
    
    return store.dispatch<any>(authenticate({apiUrl, form, formName, useToken}));
};


export const formIsValid = (form:object) => {
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
    phoneNumber.replace(/\s+/g, '')
    
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

    if (Object.keys(form)) {
        let currentForm:object = authForm['form'];
        form = constructForm(currentForm, form, formName);
        store.dispatch<any>(toggleAuthForm({...authForm, form, formName, ...options}));
        
    }else {
        store.dispatch<any>(toggleAuthForm({formName, ...options}));
    }
    
   
};


export const constructForm =(currentForm:object, newForm:object, formName:string)=> {
    
    if(currentForm && formName) {
        currentForm[formName] = newForm;
        return currentForm
        
    }else if(formName) {
                    
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
            'password' : '',
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
            return Apis.logginUserApi();

        case 'signUpForm':
            return Apis.emailRegisterApi();
                
        case 'passwordResetForm':
            return Apis.passwordResetApi();

        case 'passwordChangeForm':
            return Apis.passwordChangeApi();

        case 'passwordChangeConfirmForm':
            return Apis.passwordChangeConfirmApi();

        case 'passwordResetSmsCodeForm':
            return Apis.passwordResetSmsConfirmApi();

        case 'accountConfirmationEmailResendForm':
            return Apis.accountConfirmationEmailSendApi();

        case 'accountConfirmationSmsResendForm':
            return Apis.accountConfirmationSmsSendApi();

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
