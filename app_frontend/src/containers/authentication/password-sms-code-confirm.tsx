import React, { Component } from 'react';
import EmailForm, {SmsCodeForm}   from 'templates/authentication/email-form'; 
import {NavBar, ToogleAuthFormBtn} from 'templates/authentication/utils';
import { AlertComponent } from 'templates/partials';
import {PasswordChangeForm,
        SuccessPasswordChange} from 'templates/authentication/password-change';
import AuthenticationHoc from 'containers/authentication/auth-hoc'
import {cacheExpired} from 'utils';




class PasswordChangeSmsCodePage extends Component{
    public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);

        this.state = {
            navbarTitle : 'Passward Change',
            formTitle   : 'Enter code',
        };
    
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 
    componentDidUpdate(prevProps, nexProps){
               
    };

    componentWillUnmount =()=> {
        this.isMounted = false;
    };

    componentDidMount() {
        this.isMounted = true;
        
        let state = this.props['location'].state;
        state && this.setState({...state});

        if(this.passwordChanged()){
            return this.setState({passswordChanged:true});
        }
        
        this.tooglePasswordResetForm();
    }; 

    passwordChanged(){
        let cacheEntities:object = this.props['cacheEntities'];
        let userAuth:object = cacheEntities && cacheEntities['userAuth'];
       
        let passwordChangeAuth:object = userAuth && userAuth['passwordChangeAuth'];
        if(passwordChangeAuth && passwordChangeAuth['successMessage']){

            let _cacheExpired:boolean = cacheExpired(userAuth);
            
            return !_cacheExpired;
        }

        return false;
    };


    getCachedSmsCode =():number => {
        let cacheEntities:object = this.props['cacheEntities'];
        let userAuth:object = cacheEntities && cacheEntities['userAuth'];
       
        if (userAuth && userAuth['smsCodeAuth']) {
            let smsCodeAuth:object = userAuth['smsCodeAuth'];
           
            if (smsCodeAuth['smsCode'] && smsCodeAuth['smsCodeValidated']) {
                return smsCodeAuth['smsCode'];
            }
        }

        return undefined;
    }; 

    tooglePasswordResetForm(){
        let form:object = this.props['authForm'];

        let cachedCode =   this.getCachedSmsCode();
        if (cachedCode) {

            if(form && !form['passwordChangeConfirmForm']){
                this.tooglePasswordChangeForm(cachedCode);
            }

        }else{

            if(form && !form['passwordResetSmsCodeForm']){
                this._formConstructor('passwordResetSmsCodeForm');
            }
        }

    }

    tooglePasswordChangeForm=(smsCode:number): void =>{
        if (!smsCode) return;
           
        const options:object = {
            smsCode,
            form : {sms_code:smsCode},
            onPasswordChangeConfirmForm:true,
            onPasswordChangeSmsCodeForm:true,
            onPasswordResetSmsCodeForm:false 
        };

        this._formConstructor('passwordChangeConfirmForm', options);
        
    };

    _formConstructor(formName:string, options?:object){
        const formConstructor:Function = this.props['formConstructor'];
        return formConstructor(formName, options);

    }

    getProps=():object =>{
        return {
            ...this.props,
            ...this.state, 
        };

    }

    render(){
        if(!this.isMounted) return null;

        let props = this.getProps();
               
        let alertMessageStyles = props['displayMessage'] && {display : 'block'} ||
                                                         {display : 'none' };
                     
        return (
            <div className="registration-page">
                <NavBar {...props}/>
                <div className="password-change-container">
                    {props['passswordChanged'] &&
                        <SuccessPasswordChange {...props}/>
                        ||
                        <PasswordChange {...props}/>
                    }
                </div>  

                <div style={alertMessageStyles}>
                       <AlertComponent {...props}/>
                </div> 
            </div>
        )
    };
};



export default AuthenticationHoc(PasswordChangeSmsCodePage);

const PasswordChange =(props)=>{
    const authForm:object = props['authForm'];
    
    let smsCode:number = authForm['smsCode'];
    let onPasswordResetForm:boolean = authForm['onPasswordResetForm'];
  
    let successMessage:string = authForm['successMessage'];
           
    let passwordChangeProps:object = {
            ...props,
            formTitle          : 'Password Change',
            formDescription    : 'Enter a new passsword on both fields.',
    };

    let passwordResetProps:object = {
            ...props,
            formTitle : 'Password Reset',
            formDescription :  `Enter your e-mail address or phone number to change password.`,
    };

   
    let cancelProps = {
        ...props,
        toggleBtnName:'Cancel',
        toggleFormProps:{
            value : false,
            formName : 'passwordResetForm',
            defaultFormName : 'passwordResetSmsCodeForm'
        }
           
    };


    let toggleEmailFormProps:object = {
        ...props,
        toggleBtnName:'Resend',
        toggleFormProps:{
            value : true,
            formName:'passwordResetForm'
        }
    };
    
    
    return(
        <div className="password-change-contents">
            {smsCode &&
                <PasswordChangeForm {...passwordChangeProps}/>
              
                ||
                
                <div className="form-container">
                    {onPasswordResetForm && !successMessage &&
                        <EmailForm {...passwordResetProps}>
                            <ToogleAuthFormBtn {...cancelProps}/>
                        </EmailForm>

                        ||

                        <SmsCodeForm {...props}>
                            <SmsCodeHelperText {...props}/>
                            <ToogleAuthFormBtn {...toggleEmailFormProps}/>
                        </SmsCodeForm>
                    }
                </div>
            }
        </div>
    )
}

const SmsCodeHelperText = (props)=>{
    let {cacheEntities, passwordRestAuth,} = props;
        
    if (!passwordRestAuth) {
        let {userAuth} = cacheEntities || {};
        passwordRestAuth =  userAuth && userAuth.passwordRestAuth;
    }

    let {identifier} = passwordRestAuth || {};

    return (
        <ul className="form-helper-text">
            <li>
                We sent a code to your phone number {' '} 
                <span className="text-highlight">
                { identifier }.
                </span> Please enter the code to change password.
            </li>
        </ul>
    )
};