import * as React from 'react';
//import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Diff } from 'utility-types';
import { BrowserRouter } from "react-router-dom";

import {matchMediaSize, displayErrorMessage, displaySuccessMessage} from 'utils/helpers';
import {authenticate} from 'dispatch/index';
import {closeModals}   from  'containers/modal/helpers';
import  * as action  from 'actions/actionCreators';
import {store} from 'store/index';
import {history} from 'App';
import Apis from 'utils/api';
import Helper from 'utils/helpers';

import {getFormFields,
        authSubmit,
        validatePhoneNumber,
        getAuthUrl,
        formIsValid,
        constructForm } from 'containers/authentication/utils';


type Props = {
  
};


// These props will be injected into the base component
interface InjectedProps {
  
}



export const AuthenticationHoc = <BaseProps extends InjectedProps>(
          BaseComponent: React.ComponentType<BaseProps>) => {

    type Props = Diff<BaseProps, InjectedProps> & {
        // here you can extend hoc with new props
    
    };
    
    interface State {
        isMounted:boolean,
        canDisplayMessage:boolean,
        defaultFormName:string,
        message:object,
        isConfirmed:boolean,
        authForm:object,
        onScroolStyles:object,
        passswordChanged:boolean, 
        smsCode: number,
        formIsValid: boolean,
        successMessage : string,
        cacheEntities : object,
        passwordRestAuth:object,
        modalIsOpen:boolean,
    };

    
    return class Authentication extends React.Component<Props, State>{
        public isFullyMounted:boolean = false;
        private subscribe;
        private unsubscribe;

        // Enhance component name for debugging and React-Dev-Tools
        static displayName = `AuthenticationHoc(${BaseComponent.name})`;
        // reference to original wrapped component
        static readonly WrappedComponent = BaseComponent;


        static defaultProps: object = {
       
        };

        readonly state: State = {
            isMounted:false,
            onScroolStyles :null,
            canDisplayMessage    : false,
            message              : null,
            isConfirmed          : false,
            authForm             : {},
            passswordChanged     : false, 
            modalIsOpen:false,
            defaultFormName:'loginForm',
            passwordRestAuth:undefined,
            smsCode              : undefined,
            formIsValid          : false,
            successMessage       : null,
            cacheEntities        : JSON.parse(localStorage.getItem('@@CacheEntities')),
         
        };

        constructor(props) {
            super(props);
        };

        public get isMounted() {
            return this.isFullyMounted;
        }; 

        public set isMounted(value:boolean) {
            this.isFullyMounted = value;
        }

        private helper:Helper   = new Helper();

 

        responseFacebook = (response:object):void => {
            console.log(response)
            let apiUrl =  Apis.facebookLoginApi();
            let accessToken =  response['accessToken']
            accessToken && this._SendSocialAuthentication(accessToken, apiUrl)

        };


        responseTwitter = (response:object):void => {
            let accessToken =  response['accessToken']
            let apiUrl =  Apis.twitterLoginApi()
            accessToken && this._SendSocialAuthentication(accessToken, apiUrl)
        };

        responseGoogle = (response):void => {
            let accessToken =  response.accessToken
            let apiUrl =  Apis.googleLoginApi();
            accessToken && this._SendSocialAuthentication(accessToken, apiUrl)
        };

        _SendSocialAuthentication = (accessToken, apiUrl):void => {
            this.formConstructor('loginForm');

            const socialLoginProps:object = {
                isSocialAuth : true,
                form : this.helper.createFormData({"access_token": accessToken}),
                formName:'loginForm',
                apiUrl,
            };

            return store.dispatch<any>(authenticate(socialLoginProps));
        };

        componentWillUnmount =()=> {
            const matchSmallScreen = matchMediaSize("max-width : 980px");
        
            if (matchSmallScreen) {
                this.clearAuthForm();
            }
                        
            this.unsubscribe();

            this.isMounted = false;
            
        };


        componentDidUpdate(nextProps , prevState){
        };

        clearAuthForm(){
            let storeUpdate = store.getState(); 
            let {entities} =  storeUpdate;
            let authForm:object = entities['authForm'];
            
            Object.keys(authForm).forEach(key => {
                if(key !== 'form') delete authForm[key];
            });
            
        };  

        closeAuthModal = () => {
            return closeModals()
        };

        handleResize = () => {
            let formBox = document.getElementById('form-container');
        
            if (formBox) {
                
                let formBoxTop = formBox.getBoundingClientRect().top;
                let clientHeight = window.innerHeight - formBoxTop - 20;
                console.log(formBox.getBoundingClientRect())
                console.log(window.innerHeight)
                if(!this.state['onScroolStyles']){

                    setTimeout(()=> {
                        
                        let onScroolStyles = {
                            height : `${clientHeight}px`,
                            border: '1px solid blue',
                        };
                        //this.isMounted && this.setState({onScroolStyles});
                    }, 100);
                }
            }

        };

        componentDidMount =()=> {
                       
            this.isMounted = true;
            let storeUpdate = store.getState(); 
            let {entities} =  storeUpdate;
            let authForm:object = entities['authForm'];
           
            this.setState({authForm})
            
            this.onAuthStoreUpdate();
        };

        onAuthStoreUpdate =()=> {

            if (!this.isMounted) return;

            const onStoreChange = () => {
                let storeUpdate = store.getState(); 
                let {entities} =  storeUpdate;
                let userAuth = entities['userAuth'];
                let authForm:object = entities['authForm'];
                let errors = entities['errors']
                     
                if (errors && errors.error) {
                    this._HandleErrors(errors);
                }
                
                let formName:string = authForm['formName'];
                let form = authForm['form'];
               
                if (userAuth['error'] && form && formName) {
                    form[formName]['error'] = userAuth['error'];
                    authForm['form'] = form;

                    delete userAuth['error'];
                }
                authForm['submitting'] = userAuth['isLoading'];
                

                if(Object.keys(authForm).length){
                    this.setState({authForm});
                }
                            
                this.handlePasswordReset(userAuth);
                this.handlePasswordChangeSuccess(userAuth);
                this.handleConfirmationResend(userAuth);
            };

            this.unsubscribe = store.subscribe(onStoreChange);
        };

        
        handleConfirmationResend(userAuth:object){
            if (!userAuth['confirmationResendAuth']) {
                return;
            }

            let currentUser:object = this.props['currentUser'];
            let email:string = currentUser && currentUser['email'];
            let isPhoneNumber:boolean = validatePhoneNumber(email);
            
            let confirmationResendAuth:object = userAuth['confirmationResendAuth'];
            if (confirmationResendAuth['successMessage']) {
                let authForm:object = this.state['authForm'];
                               
                let successMessage = confirmationResendAuth['successMessage'];
                              
                authForm['successMessage'] = successMessage;
                
                this.isMounted && this.setState({authForm});
                delete confirmationResendAuth['successMessage'];
                
                if (isPhoneNumber) {
                    this.formConstructor('phoneNumberConfirmationForm');
                }

            }
            
            
        };
        
        handlePasswordReset = (userAuth:object):void => {
            if (!userAuth['passwordRestAuth']) return;

            let passwordRestAuth:object = userAuth['passwordRestAuth'];
            let successMessage:string = passwordRestAuth['successMessage'];
            let emailSent:boolean = passwordRestAuth['emailSent']; 
            let smsSent:boolean = passwordRestAuth['smsSent']; 
                               
            if (smsSent) {
                closeModals(true) //Close authentication modal 

                delete passwordRestAuth['smsSent'];

                this.updateSuccessMessage(successMessage, passwordRestAuth);                          
                this.formConstructor('passwordResetSmsCodeForm');

                const pathname:string = history['location'].pathname;
                const redirectUrl:string = '/password/change/';
                
                if (pathname !== redirectUrl) {
                    const pushToRouter:Function = history['push'];

                    setTimeout(()=> {
                        pushToRouter(redirectUrl, {passwordRestAuth});
                    }, 1000);
                }

                    
            }else if(emailSent){
                delete passwordRestAuth['emailSent'];
                this.updateSuccessMessage(successMessage, passwordRestAuth);   
                
            }

            delete passwordRestAuth['successMessage'];  

        };

        updateSuccessMessage(successMessage:string, passwordRestAuth:object){

            let authForm:object = this.state['authForm']; 
            
            authForm['successMessage'] = successMessage;
            this.isMounted && this.setState({authForm, passwordRestAuth});

        };

        handlePasswordChangeSuccess = (userAuth:object):void =>{
            let smsCodeAuth:object = userAuth['smsCodeAuth'];
            let passwordChangeAuth:object  = userAuth['passwordChangeAuth'];
        
            if (!passwordChangeAuth && !smsCodeAuth) {
                return
            }
       
            if (smsCodeAuth && smsCodeAuth['smsCodeValidated']) {
                displaySuccessMessage(this, smsCodeAuth['successMessage']);
                let smsCode = smsCodeAuth['smsCode']; 
                delete userAuth['smsCodeAuth'];

                let opts:object = {
                        smsCode,
                        form:{sms_code:smsCode},
                        onPasswordChangeConfirmForm:true,
                        onPasswordChangeSmsCodeForm:true,
                        onPasswordResetSmsCodeForm:false 
                };
                
                this.formConstructor('passwordChangeConfirmForm', opts);
                

            }else if(passwordChangeAuth && passwordChangeAuth['successMessage']){
                this.isMounted && this.setState({passswordChanged:true});

                displaySuccessMessage(this, passwordChangeAuth['successMessage']);
                delete userAuth['passwordChangeAuth'];
                      
                smsCodeAuth = {
                    smsCodeValidated : false,
                    smsCode : undefined,
                };
                store.dispatch<any>(action.authenticationSuccess({smsCodeAuth}));
            }
        };
              
        _HandleErrors = (errors:object):void => {
            if (!errors || !errors['error']) return;
            displayErrorMessage(this, errors['error']);
        }

        handleFormChange:React.ReactEventHandler<HTMLInputElement> =(event)=>{
            event.preventDefault()
         
            let authForm:object = this.state['authForm'];
            let form:object = authForm['form'];
            let formName = authForm['formName'];

            let _form:object = form && form[formName];
            
             
            if (_form) {

                let name:string = event.target['name'];
                let data:string = event.target['value'];
                               
                form[formName][name] = data;
           
                store.dispatch<any>(action.toggleAuthForm({form, formName}))
            }
        };

        selectCountry = (value):void => {
            let authForm:object = this.state['authForm'];
            let form:object = authForm['form'];
            let formName = authForm['formName'];

            form[formName]['country'] = value;

            store.dispatch<any>(action.toggleAuthForm({form, formName}));
        }

        _SetForm = (form:object, formName:string, options?:object):void => {
           
            let authForm:object = this.state['authForm'];
     
            let currentForm:object = authForm['form'];
               
            
            form = constructForm(form, currentForm, formName);
            let formOpts:object =  this.getFormOpts(formName, true);
                
            if(options){
                formOpts = {...formOpts, ...options};
            }
            
            store.dispatch<any>(action.toggleAuthForm({form, formName, ...formOpts}));

        };

        getFormOpts = (formName:string, value:boolean):object => {
        
            switch(formName){
                case 'loginForm':
                    return {onLoginForm : value}
                  
                case 'signUpForm':
                    return {onSignUpForm : value}

                case 'passwordResetForm':
                    let successMessage:string;
                    let passwordRestAuth:object;
                                                        
                    return {
                        onPasswordResetForm : value, 
                        successMessage,
                        passwordRestAuth,
                        
                    };
                
                case 'emailResendForm':
                    return {onEmailResendForm : value};
                       
                case 'passwordResetSmsCodeForm':
                    return {onPasswordResetSmsCodeForm: value};

                case 'phoneNumberConfirmationForm':
                    return {onPhoneNumberConfirmationForm : value};
                       
                case 'passwordChangeConfirmForm':
                    return {onPasswordChangeConfirmForm : value};

                case 'passwordChangeForm':
                    return {onPasswordChangeTokenForm : value};
                  
                default:
                    return {};
            };
        };
        
        formConstructor = (formName:string, options?:object) => {
            let formFields = getFormFields();
            let form:object = formFields[formName];
            
            if (formName === 'passwordResetForm' || 
                formName === 'emailResendForm') {
                form = formFields['emailForm'];

            }else if(formName === 'passwordResetSmsCodeForm' || 
                     formName === 'phoneNumberConfirmationForm'){
                form = formFields['smsCodeForm'];

            }else if(formName === 'passwordChangeConfirmForm'){
                form = formFields['passwordChangeForm'];
            }
            
            if (form) {
                let extraForm:object = options && options['form'];

                if(extraForm){
                    
                    form = {...form, ...extraForm};
                    delete options['form'];
                }
             
               
                this._SetForm(form, formName, options);
            }
        };

        toggleAuthForm = (params:object):void => {
            let defaultFormName:string = params['defaultFormName'];
            let formName:string = params['formName'];

            let value:boolean = params['value'];

            if (value === false ) {
                console.log(params, 'hidding form and toogling', formName, defaultFormName)
                this.hideToggledForm(formName);

                if(defaultFormName) this.formConstructor(defaultFormName); 

            }else{
                console.log(params, 'toogling form', formName)
                this.formConstructor(params['formName']);
            }
        };

        hideToggledForm = (formName:string) => {
            console.log("passwordResetForm" === formName)
                               
            switch (formName) {
                case "loginForm":
                    return store.dispatch<any>(action.toggleAuthForm({onLoginForm: false}));

                case "signUpForm":
                    return store.dispatch<any>(action.toggleAuthForm({onSignUpForm : false}));
                 
                case "passwordResetForm":
                    console.log('hidding a form', formName)

                    return store.dispatch<any>(
                        action.toggleAuthForm({onPasswordResetForm:false, onPasswordResetSmsCodeForm:false})
                        );
                
                case "emailResendForm":
                    return store.dispatch<any>(action.toggleAuthForm({onEmailResendForm : false}));
                
                default:
                    return null;
            }
        };


        
        onSubmit = (e) => {
            e && e.preventDefault();
            authSubmit(this);
        };
              
        getProps = ():object => {
            return {
                ...this.props,
                ...this.state,
                selectCountry    : this.selectCountry.bind(this),
                onSubmit         : this.onSubmit.bind(this),
                formConstructor  : this.formConstructor.bind(this),
                handleFormChange : this.handleFormChange.bind(this),
                responseFacebook : this.responseFacebook.bind(this),
                responseGoogle   : this.responseGoogle.bind(this),
                responseTwitter  : this.responseTwitter.bind(this),
                validateForm     : formIsValid.bind(this), 
                toggleAuthForm   : this.toggleAuthForm.bind(this), 
            };
        };

        render() {
            if(!this.isMounted) return null;

            let props = this.getProps();
            let fieldSetStyles = props['submitting'] && {opacity:'0.60'} || {};
          
            return (
                <BrowserRouter>
                    <BaseComponent {...(props as BaseProps)}/> 
                </BrowserRouter>        
            );
        };
    };
};


//binds on `props` change
const mapDispatchToProps = (dispatch, ownProps) => {
   
    return {
        authenticateUser : (props) => dispatch(authenticate(props)),
        
    }

};

const mapStateToProps = (state, ownProps) => {
   
    return {
        entities : state.entities,  
        authForm : state.entities.authForm,    
    }
};

const composedHoc = compose(connect(mapStateToProps, mapDispatchToProps),  AuthenticationHoc);


export default  AuthenticationHoc;