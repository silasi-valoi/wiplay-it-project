import * as React from 'react';
//import React, { Component } from 'react';
import { Diff } from 'utility-types';
import { BrowserRouter } from "react-router-dom";

import {matchMediaSize, displayErrorMessage, displaySuccessMessage} from 'utils/helpers';
import {authenticate} from 'dispatch/index';
import {closeModals}   from  'containers/modal/helpers';
import  * as action  from 'actions/actionCreators';
import {store} from 'store/index';
import {history} from 'App';
import Api from 'utils/api';
import Helper from 'utils/helpers';

import {getFormFields,
        authSubmit,
        getAuthUrl,
        formIsValid,
        changeForm,
        setForm,} from 'containers/authentication/utils';


type Props = {
  
};


// These props will be injected into the base component
interface InjectedProps {
  count: number;
  onIncrement: () => void;
}



export const AuthenticationHoc = <BaseProps extends InjectedProps>(
          BaseComponent: React.ComponentType<BaseProps>) => {

    type Props = Diff<BaseProps, InjectedProps> & {
        // here you can extend hoc with new props
        initialCount?: number;
    };
    
    interface State {
        canDisplayMessage:boolean,
        message:object,
        isSocialAuth:boolean,
        isConfirmed:boolean,
        form:object,
        formName:string, 
        onLoginForm:boolean,
        submitting:boolean,
        onSignUpForm:boolean,
        onPasswordResetForm:boolean,
        onPasswordChangeForm : boolean,
        onPasswordChangeTokenForm:boolean,
        onPasswordChangeSmsCodeForm:boolean, 
        passswordChanged:boolean, 
        smsCode: number,
        formIsValid: boolean,
        successMessage : string,
        cacheEntities : object,
        passwordRestAuth:object,
        onPasswordChangeConfirmForm:boolean,
        onPhoneNumberConfirmationForm:boolean,
        onEmailResendForm:boolean,
        onPasswordResetSmsCodeForm,
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
            canDisplayMessage       : false,
            message              : null,
            isSocialAuth         : false,
            isConfirmed          : false,
            form                 : null,
            formName             : null, 
            onLoginForm          : false,
            submitting           : false,
            onSignUpForm         : false,
            onPasswordResetForm  : false,
            onPasswordChangeForm : false,
            onPasswordChangeTokenForm:false,
            onPasswordChangeSmsCodeForm:false, 
            onPasswordChangeConfirmForm:false,
            onPhoneNumberConfirmationForm:false,
            onEmailResendForm:false,
            onPasswordResetSmsCodeForm:false,
            passswordChanged     : false, 
            passwordRestAuth:undefined,
            smsCode              : undefined,
            formIsValid          : false,
            successMessage       : null,
            cacheEntities        : JSON.parse(localStorage.getItem('@@CacheEntities')),
         
        };

        constructor(props) {
            super(props);
        };

        public get _isMounted() {
            return this.isFullyMounted;
        }; 

        public set _isMounted(value:boolean) {
            this.isFullyMounted = value;
        }


        public api:Api = new Api();
        
        private helper:Helper   = new Helper();

 

        responseFacebook = (response:object):void => {
            console.log(response)
            let apiUrl =  this.api.facebookLoginApi();
            let accessToken =  response['accessToken']
            accessToken && this._SendSocialAuthentication(accessToken, apiUrl)

        };


        responseTwitter = (response:object):void => {
            let accessToken =  response['accessToken']
            let apiUrl =  this.api.twitterLoginApi()
            accessToken && this._SendSocialAuthentication(accessToken, apiUrl)
        };

        responseGoogle = (response):void => {
            let accessToken =  response.accessToken
            let apiUrl =  this.api.googleLoginApi();
            accessToken && this._SendSocialAuthentication(accessToken, apiUrl)
        };

        _SendSocialAuthentication = (accessToken, apiUrl):void => {
            let isSocialAuth = true
            let form   = this.helper.createFormData({"access_token": accessToken});
            this.setState({isSocialAuth, submitting:true})
            return store.dispatch<any>(authenticate({ apiUrl, form, isSocialAuth }));
        };

        componentWillUnmount =()=> {
            console.log('is unmounting')
            window.removeEventListener('popstate', this.closeAuthModal);
            this._isMounted = false;
            this.unsubscribe();
        };


        //componentDidUpdate =(nextProps , prevState)=>{
        //};
   

        closeAuthModal = () => {
            console.log('closing authentication modal')
            return closeModals()
        }

        componentDidMount =()=> {
            this._isMounted = true;
            this.onAuthStoreUpdate();
            window.addEventListener('popstate', this.closeAuthModal);
       
        /*    
        const authenticationType:string = this.props['authenticationType'];
        const matchBigScreen = matchMediaSize("min-width : 980px");
        let matchSmallScreen = matchMediaSize("max-width : 980px");
        

        if (authenticationType === 'passwordReset') {
            this.formConstructor('passwordResetForm');
        }

        if (authenticationType === 'confirmationResend') {
            this.formConstructor('emailResendForm');
        }
        */
        };

        onAuthStoreUpdate =()=> {
            if (!this._isMounted) return;

            const onStoreChange = () => {
                let  storeUpdate = store.getState(); 
                let {entities} =  storeUpdate;
                let userAuth = entities['userAuth'];
                let errors = entities['errors']
                                
                this.setState({submitting :userAuth['isLoading']}); 
             
                if (errors && errors.error) {
                    this._HandleErrors(errors);
                }
                
                let formName = this.state['formName'];
                let form = this.state['form'];

                if (form && userAuth['error']) {
                form[formName]['error'] = userAuth['error'];
                this.setState({form})
                delete userAuth['error']
            }
            
            this.handleLogin(userAuth)
            this.handlePasswordReset(userAuth);
            this.handlePasswordChangeSuccess(userAuth);
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };
        
    handlePasswordReset = (userAuth:object):void => {
        if (!userAuth['passwordRestAuth']) return;

        let passwordRestAuth:object = userAuth['passwordRestAuth'];

        let successMessage:string = passwordRestAuth['successMessage'];
        let emailSent:boolean = passwordRestAuth['emailSent']; 
        let smsSent:boolean = passwordRestAuth['smsSent']; 

        let isPhoneNumber:boolean = this.state['isPhoneNumber'];
        let onPasswordResetForm:boolean = this.state['onPasswordResetForm']

        console.log(passwordRestAuth, isPhoneNumber)
           
        this.setState({passwordRestAuth})
        displaySuccessMessage(this, successMessage)
                    
        if (smsSent) {
            closeModals(true) //Close authentication modal 

            const pathname:string = history['location'].pathname
            if (pathname != '/password/change/') {
                const pushToRouter:Function = history['push'];
                setTimeout(()=> {
                    pushToRouter('/password/change/', {passwordRestAuth});
                }, 500);
            }
        }  

        delete userAuth['passwordRestAuth'];      
    };

    handlePasswordChangeSuccess = (userAuth:object):void =>{
        let smsCodeAuth:object = userAuth['smsCodeAuth'];
        let passwordChangeAuth:object  = userAuth['passwordChangeAuth'];
        console.log(userAuth)
        if (!passwordChangeAuth && !smsCodeAuth) {
            return
        }

       
        if (smsCodeAuth && smsCodeAuth['smsCodeValidated']) {
            displaySuccessMessage(this, smsCodeAuth['successMessage'])
            let smsCode = smsCodeAuth['smsCode']; 
            //this.tooglePasswordChangeForm(smsCode);
            delete userAuth['smsCodeAuth'];

        }else if(passwordChangeAuth && passwordChangeAuth['successMessage']){
            this.setState({passswordChanged:true});
            displaySuccessMessage(this, passwordChangeAuth['successMessage']);
            delete userAuth['passwordChangeAuth'];
                      
            if (this.state['onPasswordChangeSmsCodeForm']) {
                smsCodeAuth = {
                    smsCodeValidated : false,
                    smsCode : undefined,
                };

                store.dispatch<any>(action.authenticationSuccess({smsCodeAuth}));
            }

            
        }
    };

    /*
    tooglePasswordChangeForm=(smsCode:number) : void =>{
        if (!smsCode) return;
                
        let passwordAuthOpts = {sms_code:smsCode};
        this.formConstructor('passwordChangeConfirmForm', passwordAuthOpts);

        this.setState({
            smsCode,
            onPasswordChangeConfirmForm:true,
            onPasswordChangeSmsCodeForm:true,
            onPasswordResetSmsCodeForm:false }
        )
    };
    */
   

        handleLogin = (userAuth:object) => {
            if (!userAuth || !userAuth['loginAuth'])return;

            let onLoginForm = this.state['onLoginForm'];
            let onSignUpForm = this.state['onSignUpForm']

            let loginAuth = userAuth['loginAuth']
            let {isLoggedIn, isConfirmed} = loginAuth;
            this.setState({isConfirmed});
                                                           
            if(isLoggedIn && !isConfirmed && onSignUpForm || onLoginForm){
                             
                setTimeout(()=> {
                    history.back(); 
                }, 500);
            }

            if (isLoggedIn && isConfirmed) {
                this.setState({isConfirmed:true});   
            }
        };
      
        _HandleErrors = (errors:object):void => {
            if (!errors || !errors['error']) return;
            displayErrorMessage(this, errors['error']);
        }

        handleFormChange:React.ReactEventHandler<HTMLInputElement> =(event)=>{
            event.preventDefault()
            changeForm(this, event);
        };

        selectCountry = (value):void => {
            let form = this.state['form'];
            let formName = this.state['formName']
            form[formName]['country'] = value
            this.setState({form });
        }

        _SetForm = (form:object, formName:string):void => {
            console.log(this, this._isMounted)
            //if (!this._isMounted) return;

            let currentForm = this.state['form'];
            form = setForm(form, currentForm, formName);
            this.setState({
                form,
                formName, 
                successMessage:undefined
            });

            this.setFormOpts(formName, true);
        };

        setFormOpts = (formName:string, value:boolean) => {
        
            switch(formName){
                case 'loginForm':
                    return this.setState({ onLoginForm : value})
                  
                case 'signUpForm':
                    return this.setState({onSignUpForm : value})

                case 'passwordResetForm':
                    return this.setState({
                        onPasswordResetForm : value,
                        passwordRestAuth:undefined}
                    );
 
                case 'emailResendForm':
                    return this.setState({ onEmailResendForm : value });
                       
                case 'passwordResetSmsCodeForm':
                    return this.setState({onPasswordResetSmsCodeForm: value});

                case 'phoneNumberConfirmationForm':
                    return this.setState({onPhoneNumberConfirmationForm: value});
                       
                case 'passwordChangeConfirmForm':
                    return this.setState({onPasswordChangeConfirmForm : value});

                case 'passwordChangeForm':
                    return this.setState({onPasswordChangeTokenForm : value});
                  
                default:
                    return null;
            };
        };
        
        formConstructor = (formName:string, options?:object) => {
            console.log('constructing form', formName)   
            let defaultActiveForm = formName;
            let form:object;

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
                    form = Object.assign(form, options || {});
                    return this._SetForm(form, formName);

                case 'passwordResetSmsCodeForm':
                case 'phoneNumberConfirmationForm':
                    form = getFormFields().smsCodeForm;
                    return this._SetForm(form, formName)

                case 'passwordChangeConfirmForm':
                case 'passwordChangeForm':
                    form = getFormFields().passwordChangeForm;
                    form = Object.assign(form, options || {});
                    return this._SetForm(form, formName);

                default:
                    return null;
            };
        };

        toggleAuthForm = (params:object):void => {
            console.log(params);
                              
            if (params['value'] === false ) {
                this.hideToggledForm(params['formName']);
                this.formConstructor(this.state['defaultFormName']); 

            }else{
                this.formConstructor(params['formName']);
            }
        };

        hideToggledForm = (formName:string):void => {
       
            switch (formName) {
                case "signUpForm":
                    this.setState({onSignUpForm : false});
                    break;

                case "passwordResetForm":
                    this.setState({onPasswordResetForm : false});
                    break;

                case "emailResendForm":
                    this.setState({onEmailResendForm : false});
                    break;

                default:
                    break;
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
            console.log(this)
            //if (!this._isMounted) return null;

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

export default AuthenticationHoc;


