import React, { Component } from 'react';
import * as Icon from 'react-feather';

import {NavBar} from 'templates/authentication/utils';
import AccountConfirmation from 'templates/authentication/confirmation';
import EmailForm, {SmsCodeForm}   from 'templates/authentication/email-form';
import {PasswordConfirmForm} from 'templates/authentication/password-change'
import { closeModals}   from  'containers/modal/helpers';
import { ModalCloseBtn } from "templates/buttons";
import { AlertComponent } from 'templates/partials';
import AuthenticationHoc from 'containers/authentication/auth-hoc'

import {authenticationSuccess} from 'actions/actionCreators';
import HomePage from "containers/main/home-page";

import { displaySuccessMessage, displayErrorMessage } from 'utils/helpers';

import {formIsValid,
        authSubmit,
        validatePhoneNumber,
        validateEmail,
        getFormFields,
        setForm,} from 'containers/authentication/utils';   

import {store} from "store/index";
import {authenticateWithGet}  from "dispatch/index"
import Api from 'utils/api';


const api = new Api();


class AccountConfirmationPage extends Component{
    public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);
        this.state = {
            onPhoneNumberSmsCodeForm : true,
            formTitle        : 'Enter code',
            formDescription  : ['Enter code to confirm your account'],
            isPhoneNumber    : false,
            isEmail          : false,
          
        };
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }

    componentWillUnmount =()=> {
        this.isMounted = false;
        this.unsubscribe();
    };


    onAuthStoreUpdate =()=> {
        if (!this.isMounted) return;

        const onStoreChange = () => {
            let  storeUpdate = store.getState(); 
            let {entities} =  storeUpdate;
            let userAuth = entities['userAuth'];
            
            let form = this.state['form'];
            let formName = this.state['formName']
                        
            this.setState({submitting : userAuth['isLoading']}); 

            if (form && userAuth['error']) {
                form[formName]['error'] = userAuth['error'];
                this.setState({form});
                delete userAuth['error'];
            }

            let emailResendAuth = userAuth['emailResendAuth'];
            if (emailResendAuth && emailResendAuth['successMessage']) {
                this.setState({successMessage:emailResendAuth['successMessage']})
                this._SetForm('phoneNumberConfirmationForm');                 
                delete emailResendAuth['successMessage']
            }
            
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
   
    componentDidMount() {
        this.isMounted = true;
        this.onAuthStoreUpdate();
        this._SetForm('phoneNumberConfirmationForm');
        
        let currentUser:object = this.props['currentUser'];
        let email:string = currentUser && currentUser['email'];

        let isPhoneNumber:boolean = validatePhoneNumber(email)
        let isEmail:boolean = validateEmail(email)

        this.setState({currentUser, isEmail, isPhoneNumber});
    };

    _SetForm(formName:string , options?:object):void{
        const formConstructor:Function = this.props['formConstructor']
        formConstructor(formName, options)
       
    }
 

    resendConfirmation =()=> {
        let currentUser = this.state['currentUser'];
        let currentForm = this.state['form'];
        let phone_number = currentUser &&  currentUser.email;
        
        if (phone_number) {
            this._SetForm('emailResendForm' ,{email:phone_number})
            console.log('send confirmation')

            const submit:Function = this.props['onSubmit']

            setTimeout(()=> {
                submit()
            }, 500);
            
            
            
        }
    };
    
    getProps=():object =>{
        return {
            resendConfirmation : this.resendConfirmation.bind(this),
            validateForm     : formIsValid, 
            ...this.props, ...this.state,
        };
    };
     
    render() {
        let props = this.getProps();
        let  submitting = props['submitting'];
        
        let submitButtonStyles = submitting? {opacity:'0.60'} : {};
    
        let fieldSetStyles = submitting && {opacity:'0.60'} || {};

        return (
            <div className="">
                <fieldset style={ fieldSetStyles} 
                          disabled={submitting} >
                <div>
                    
                    {props['isPhoneNumber'] &&
                        <div className="account-confirm-modal-container">

                            <SmsCodeForm {...props}>
                                <SmsCodeHelperText {...props}/>  
                                <button 
                                    type="button" 
                                    onClick={()=> this.resendConfirmation()} 
                                    className="resend-email-btn btn-sm" >
                                    Resend
                                </button>
                            </SmsCodeForm>
                            
                        </div>
                        ||

                        <EmailConfirmation {...props}/>
                    }
                </div>
                </fieldset>
            </div>
        );
    };
};

export default AuthenticationHoc(AccountConfirmationPage);


const SmsCodeHelperText = (props)=>{
    let {cacheEntities, currentUser} = props;
    let phone_number = currentUser && currentUser.phone_numbers[0];
    phone_number     = phone_number && phone_number.national_format;
    
    return (
        <ul className="form-helper-text">
            <li>
                We sent a code to your phone {' '} 
                <span className="text-highlight">
                {phone_number}.
                </span> Please enter the code to confrm your account.
            </li>
        </ul>
    )
}


const EmailConfirmation = (props)=>{
    let {successMessage, currentUser} = props;
    let email = currentUser && currentUser.email;
        
    return (
        <div className="email-confirm-container">
        <div className="email-confirm-box">
            <ul className="email-confirm-title-box">
                <li className="">Account Confirmation</li>
            </ul>
            <div className="email-confirm-contents">
                {successMessage &&
                    <ul className="success-resend-message">
                        <li className="">{successMessage}</li>
                    </ul>
                }

                <ul className="email-confirm-helper-text">
                    <li>
                        We sent a link to your email address {' '} 
                        <span className="text-highlight">{email}</span> with {' '}
                        instructions to confirm your account. {' '} 
                        Please go to your email to confirm you account.
                    </li>
                </ul>
                <div className="resend-email-box">
                    <p className="resend-email-text">
                        You didn't receive any email?
                    </p>

                    <button type="button" 
                            onClick={()=> props.resendConfirmation()} 
                            className="resend-email-btn btn-sm" >
                                Resend
                    </button>
                </div>            
            </div>
        </div>
        </div>
    )
}


export class PasswordConfirmationPage extends Component{
    public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);
        this.state = {
            formDescription   : ['Enter code to confirm your account'],
            formName          : undefined,
            currentUser       : undefined,
            submitting        : false,
            form              : undefined,
            successMessage    : undefined,
            oldPasswordConfirmed : false,
        };
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }

    componentWillUnmount =()=> {
        this.isMounted = false;
        this.unsubscribe();
    };

    onReLoginStoreUpdate =()=> {
        if (!this.isMounted) return;

        const onStoreChange = () => {
            let  storeUpdate = store.getState(); 
            let {entities} =  storeUpdate;
            let userAuth = entities['userAuth'];

            let formName = this.state['formName'];
            let form = this.state['form'];

            this.setState({submitting : userAuth['isLoading']}); 

            if (form && userAuth['error']) {
                form[formName]['error'] = userAuth['error'];
                this.setState({form});
                delete userAuth['error'];
            }

            this.handlePasswordConfirmSuccess(userAuth['loginAuth']); 
            this.handlePasswordRestSuccess(userAuth['passwordRestAuth']);

        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    handlePasswordRestSuccess(passwordRestAuth){
        if (!passwordRestAuth) return;

        if (passwordRestAuth.successMessage) {
            displaySuccessMessage(this, passwordRestAuth['successMessage']);
            delete passwordRestAuth['successMessage'];
            this.togglePasswordConfirmForm();
        }
    }

    handlePasswordConfirmSuccess(loginAuth:object){
        if (!loginAuth) return;
        
        let isLoggedIn = loginAuth['isLoggedIn'];
        let oldPasswordConfirmed:boolean = this.state['oldPasswordConfirmed']
                                                                             
        if(isLoggedIn && !oldPasswordConfirmed){
            console.log(this.state)
            this.setState({oldPasswordConfirmed:true});
            this.togglePasswordChangeForm();
            delete loginAuth['isLoggedIn']
        }
    };

    togglePasswordConfirmForm(){
        let currentUser = this.props['currentUser']
        let currentForm   = this.state['form'];
        let formName      =  'reLoginForm';

        let form = getFormFields().loginForm;
        form = {...form, email:currentUser.email}
        form = setForm(form, currentForm, formName);
        this.setState({form, formName, currentUser,oldPasswordConfirmed:false});
    }

    togglePasswordChangeForm(){
        let form     = this.state['form'];
        let password = form?.reLoginForm?.password;

        if (password) {
            let passswordParams = {old_password : password}; 
            //this.props.togglePasswordChangeForm(passswordParams);
            this._closeModal();    
        }
    };
    
    _closeModal (){
        let background = true;
        closeModals(background);
    };
    
    componentDidMount() {
        this.isMounted = true;
        console.log(this.props)
        this.onReLoginStoreUpdate();
        this.togglePasswordConfirmForm();
    };
  
    onChange(event, formName) {
        event.preventDefault();
        console.log(formName)

        formName && this.setState({formName})
        //changeForm(this, event);
    };

    handleSubmit(event, formName){
        event.preventDefault();

        formName && this.setState({formName});
        let useToken:boolean = false;
        authSubmit(this, '', useToken);
    };

    validateForm(form){
        return formIsValid(form)
    };

    passwordRest =()=> {
        let currentUser:object = this.props['currentUser'];
        let currentForm = this.state['form'];
        let email:string = currentUser &&  currentUser['email'];
        
        if (email) {
            let formName = 'passwordResetForm';
            let formFields = getFormFields()
            let form:object = formFields[formName];
            form     = {...form, email}

            form = setForm(form, currentForm, formName);
            this.setState({form, formName});
            this.sendPasswordRest(formName);
            
        }

    };

    sendPasswordRest(formName){
        authSubmit(this, formName);
    };

    getProps(){
        return{
            ...this.props,
            ...this.state,
            handleFormChange  : this.onChange.bind(this),
            onSubmit          : this.handleSubmit.bind(this),
            validateForm      : this.validateForm.bind(this),
            passwordRest      : this.passwordRest.bind(this),
        };
    };

    render(){
        let props = this.getProps();

        return(
            <PasswordConfirmForm {...props}/>
        )

    };
};


export class AccountEmailConfirmationPage extends Component{
    public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;


    constructor(props) {
        super(props);

        this.state = {
            pageTitle        : 'Account Confirmation',
            navbarTitle      : 'Confirm Account',
            formDescription  : ['Enter your email address'],
            submitting       : false,
            userIsConfirmed  : false, 
            displayMessage   : false,
            message          : null,
        };
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 

    componentWillUnmount =()=> {
        this.isMounted = false;
        this.unsubscribe();
    };
   
    componentDidMount() {
        this.isMounted = true
        this.onAuthStoreUpdate();
        
        let { key } = this.props['match'].params; 
        key && store.dispatch<any>(authenticateWithGet({key}));  
    };

    onAuthStoreUpdate =()=> {
        if (!this.isMounted) return;

        const onStoreChange = () => {
            let  storeUpdate = store.getState(); 
            let {entities} =  storeUpdate;
            let userAuth:object = entities['userAuth'];

            this.setState({submitting : userAuth['isLoading']}); 
            
            this.handleConfirmationSuccess(userAuth);
            this.handleConfirmationResend(userAuth);

        };

        this.unsubscribe = store.subscribe(onStoreChange);
    }

    handleConfirmationSuccess(userAuth:object):void{
        let loginAuth:object = userAuth['loginAuth'];
        let errorMessage:string = userAuth['error']
       
        if (loginAuth && loginAuth['isConfirmed']) {
            displaySuccessMessage(this, loginAuth['successMessage'])
            this.setState({userIsConfirmed:loginAuth['isConfirmed']});
            
            delete loginAuth['isConfirmed'];
        }else if(errorMessage){
            this.setState({errorMessage})
        }
    };

    handleConfirmationResend = (userAuth:object):void => {
        const confirmationResendAuth:object = userAuth['confirmationResendAuth'];
        if (!confirmationResendAuth) return;

        let successMessage:string = confirmationResendAuth['successMessage'];
        if (successMessage) {
            closeModals(true)
            displaySuccessMessage(this, successMessage )
            delete userAuth['confirmationResendAuth'];
        }

    }
     
    render() {
        let props = {...this.props,...this.state};
        let alertMessageStyles = props['displayMessage'] && { display : 'block'} ||
                                                          { display : 'none' };
        
        return (
            <div className="registration-page confirmation-page">
                <NavBar {...props}/>
                <div   className="account-confirmation-container">
                    <AccountConfirmation {...props } />   
                </div>
                 

                <div style={alertMessageStyles}>
                       <AlertComponent {...props}/>
                </div>
            </div>
        );
    };
};



