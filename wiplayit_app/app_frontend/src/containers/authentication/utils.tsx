import {store} from 'store/index';
import Apis from 'utils/api';
import {toggleAuthForm} from 'actions/actionCreators';
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
        let form     = this.form;
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
                formErrors = {email:['Please enter a valid email or phone number']}
            }
        }

        if (formName === 'signUpForm' && !form['country']) {
            formErrors = {country:['Please select your country']}
        }
                
        return formErrors;
    };

};


export const authSubmit =(self:object, formName?:string, useToken:boolean=false)=>{
    const state:object = self['state'];
    let authForm :object = state['authForm'];

    if(!formName){
        formName = authForm['formName'];
    }
   
    authForm = authForm['form'];
    let form:object =  authForm && authForm[formName];
    
    let validatedForm  =  new FormValidator({form, formName});

    if (!validatedForm.formIsClean()) {
        
        let error = validatedForm.formErrors(); 
        if(form){
            form['error'] = error;
            form = {...authForm, formName:form};

            return store.dispatch<any>(toggleAuthForm({form, formName, submitting : false}));

        }
    }

    let apiUrl = getAuthUrl(formName);  
    let email = form['email'];
          
    let isPhoneNumber:boolean = validatePhoneNumber(form['email']);
    let isEmail:boolean = validateEmail(form['email']);
    
    store.dispatch<any>(toggleAuthForm({isEmail, isPhoneNumber, submitting : true}));

    form   = validatedForm.cleanForm();       
   
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


export const constructForm =(form:object, currentForm:object, formName:string)=> {
       
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
        phoneNumberForm : {'phone_number':''}, 

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
            return Apis.passwordChangeConfirmApi()

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

        default:
            return  '';
    };
            
};
