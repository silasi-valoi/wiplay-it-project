import React, { Component } from 'react';
import EmailForm, {SmsCodeForm}   from 'templates/authentication/email-form'; 
import {NavBar} from 'templates/authentication/utils';
import { AlertComponent } from 'templates/partials';
import {OpenAuthModalBtn} from "templates/buttons";
import {PasswordChangeForm,
        SuccessPasswordChange} from 'templates/authentication/password-change';
import AuthenticationHoc from 'containers/authentication/auth-hoc'

import {authenticationSuccess} from 'actions/actionCreators';
import {store} from 'store/index';

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
        //console.log(prevProps, nexProps)
       // let {onPasswordResetForm} = prevProps
        //if (!onPasswordResetForm) {
            //this.props.formConstructor('passwordResetSmsCodeForm');
       // }
        
    };

    componentWillUnmount =()=> {
        this.isMounted = false;
    };

    componentDidMount() {
        this.isMounted = true;

        let state = this.props['location'].state;
        state && this.setState({...state})
        
        let cachedCode =   this.getCachedSmsCode();
        if (cachedCode) {
            return this.tooglePasswordChangeForm(cachedCode)
        }else{

            return this._formConstructor('passwordResetSmsCodeForm');
        }
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

    tooglePasswordChangeForm=(smsCode:number) : void =>{
        if (!smsCode) return;
                
        let passwordAuthOpts = {sms_code:smsCode};
        this._formConstructor('passwordChangeConfirmForm', passwordAuthOpts);

        this.setState({
            smsCode,
            onPasswordChangeConfirmForm:true,
            onPasswordChangeSmsCodeForm:true,
            onPasswordResetSmsCodeForm:false }
        )
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
        let props = this.getProps();
        
        let alertMessageStyles = props['displayMessage'] && { display : 'block'} ||
                                                         { display : 'none' };
                     
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
           
    let passwordChangeProps:object = {
            formTitle          : 'Password Change',
            formDescription    : 'Enter a new passsword on both fields.',
            ...props
    };

   
    let authenticationProps = {
            linkName  : 'Resend',
            authenticationType : 'passwordReset',
            modalName : 'passwordReset',

    };
    
    
    return(
        <div className="password-change-contents">
            { props.smsCode &&
                <PasswordChangeForm {...passwordChangeProps}/>
              
                ||
                
                <div className="form-container">
                    <SmsCodeForm {...props}>
                        <SmsCodeHelperText {...props}/>
                        <OpenAuthModalBtn {...authenticationProps}/>
                    </SmsCodeForm>
                </div>
            }
        </div>
    )
}

const SmsCodeHelperText = (props)=>{
    let {cacheEntities, passwordRestAuth,} = props;
    let {userAuth}     = cacheEntities || {};
    
    if (!passwordRestAuth) {
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