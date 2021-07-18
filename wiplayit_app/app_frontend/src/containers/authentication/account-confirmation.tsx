import React, { Component } from 'react';
import {X} from 'react-feather'

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
import Apis from 'utils/api';



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
      
    };

    componentDidMount() {
        this.isMounted = true;
               
        let currentUser:object = this.props['currentUser'];
        let email:string = currentUser && currentUser['email'];

        let isPhoneNumber:boolean = validatePhoneNumber(email)
        let isEmail:boolean = validateEmail(email)

        if (isPhoneNumber) {
            this._SetForm('phoneNumberConfirmationForm');
        }

        this.setState({currentUser, isEmail, isPhoneNumber});
    };

    _SetForm(formName:string , options?:object):void{
        const formConstructor:Function = this.props['formConstructor']
        formConstructor(formName, options)
       
    }
 
    resendConfirmation =()=> {
        let currentUser = this.state['currentUser'];
        let currentForm = this.state['form'];
        let email = currentUser &&  currentUser.email;
        
        if (email) {
            this._SetForm('emailResendForm', {email})
            
            const submit:Function = this.props['onSubmit'];
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
                <fieldset style={ fieldSetStyles} disabled={submitting} >
                    <div className="authentication-dismiss">
                        <ModalCloseBtn>
                            <X id="feather-x" size={20} color="red"/>
                        </ModalCloseBtn>
                    </div>
                    <div className="account-confirm-modal-container">
                        { props['isPhoneNumber'] &&
                            <div className="account-confirm-modal-box">
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
            <ul className="email-confirm-title-box">
                <li className="">Account Confirmation</li>
            </ul>
            <div className="email-confirm-box">
            
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
                            Please go to your email to confirm your account.
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
    );
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
        
        let formName:string = 'AccountConfirmation'
        let {key} = this.props['match'].params; 
        let apiUrl = Apis.accountConfirmApi(key);
        key && store.dispatch<any>(authenticateWithGet({key,apiUrl, formName}));  
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

    handleConfirmationSuccess(userAuth:object) : void {
        let loginAuth:object = userAuth['loginAuth'];
        let errorMessage:string = userAuth['error'];
       
        if (loginAuth && loginAuth['isConfirmed']) {
            displaySuccessMessage(this, loginAuth['successMessage']);
            this.setState({userIsConfirmed:loginAuth['isConfirmed']});
            
            delete loginAuth['isConfirmed'];

        }else if(errorMessage){
            this.setState({errorMessage});
        }
    };

    handleConfirmationResend = (userAuth:object):void => {
        const confirmationResendAuth:object = userAuth['confirmationResendAuth'];
        if (!confirmationResendAuth) return;

        let successMessage:string = confirmationResendAuth['successMessage'];
        if (successMessage) {
            closeModals(true);
            displaySuccessMessage(this, successMessage );
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



