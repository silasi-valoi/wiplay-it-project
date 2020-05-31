import React, { Component } from 'react';
import {SmsCodeForm}   from 'templates/authentication/email-form'; 
import AuthenticationHoc  from 'components/authentication/index-hoc';  
import {NavBar} from 'templates/authentication/utils';
import {PassWordChangeForm,
        SuccessPasswordChange} from 'templates/authentication/password-change';
import {authenticationSuccess} from 'actions/actionCreators';
import {store} from 'store/index';

class PasswordChangeSmsCodePage extends Component{
    isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            navbarTitle                : 'Passward Change',
            formTitle                  : 'Enter code',
            passswordChanged           : false,  
            onPasswordResetSmsCodeForm : true,  
            onPasswordChangeForm       : false,
            smsCode                    : undefined,                         
        };
    
    };
    componentDidUpdate(prevProps, nexProps){
        //console.log(prevProps, nexProps)
        
    };

    onAuthStoreUpdate =()=> {
        const onStoreChange = () => {
            let  storeUpdate       = store.getState(); 
            let {entities}         =  storeUpdate;
            let {userAuth, errors} = entities;
            let {smsCodeAuth, passwordChangeAuth}  = userAuth;
            

            let {formName,
                 onPasswordResetSmsCodeForm,
                 onPasswordChangeForm, } = this.props;

            
            if (smsCodeAuth && smsCodeAuth.successMessage) {
                delete smsCodeAuth.successMessage;
                let {smsCode} = smsCodeAuth; 
                this.tooglePasswordChangeForm(smsCode)

            }else if(passwordChangeAuth && passwordChangeAuth.successMessage){
                this.setState({passswordChanged:true});
                this.handlePasswordChangeSuccess(userAuth);
                
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    }

    componentDidMount() {
        
        this.isMounted = true;
        this.onAuthStoreUpdate();
        let {location} = this.props;
        let state = location && location.state || {};
        this.setState({...state})

        
        this.props.formConstructor('passwordResetSmsCodeForm');

        let cachedCode =   this.getCachedSmsCode();
        if (cachedCode) {
           this.tooglePasswordChangeForm(cachedCode)
        }
    };

    handlePasswordChangeSuccess=(userAuth)=>{
        
        let auth = {
                smsCodeValidated : false,
                smsCode : undefined,
            }
        store.dispatch(authenticationSuccess({auth}))
    };

    tooglePasswordChangeForm=(smsCode)=>{
        if (smsCode) {
            let onPasswordChangeForm = true;
            let onPasswordResetSmsCodeForm = false;
            this.setState({smsCode,onPasswordChangeForm, onPasswordResetSmsCodeForm})
            let passwordAuthOpts = {sms_code:smsCode};
            this.props.formConstructor('passwordChangeForm', passwordAuthOpts);
        }
    };

    componentWillUnmount =()=> {
        this.isMounted = false;
        this.unsubscribe();
    };

    getCachedSmsCode =()=> {
        let cacheEntities = this.props.cacheEntities;
        let userAuth = cacheEntities && cacheEntities.userAuth;
        
        if (userAuth && userAuth.smsCodeAuth) {
            let smsCodeAuth = userAuth.smsCodeAuth;
            let {smsCode, smsCodeValidated} = smsCodeAuth;
            if (smsCode && smsCodeValidated) {
                return smsCode;
            }
        }
        return undefined;
    };

    getProps=()=>{
        return {
            ...this.props,
            ...this.state, 
            cachedCode : this.getCachedSmsCode(),
        };

    }



    render(){
        let props = this.getProps();
                  
        return (
            <div className="registration-page">
                <NavBar {...props}/>
                <div className="password-change-container registration-container">
                    {props.passswordChanged &&
                        <SuccessPasswordChange {...props}/>
                        ||
                        <PasswordChangeForm {...props}/>
                    }
                </div>   
            </div>
        )
    };
};



export default AuthenticationHoc(PasswordChangeSmsCodePage);

const PasswordChangeForm =(props)=>{
        
    let passwordChangeProps = {
        formTitle          : 'Password Change',
        formDescription    : 'Enter a new passsword on both fields.',
    };
    
    passwordChangeProps = {...props, ...passwordChangeProps}
    return(
            <div className="password-change-contents">
                {props.smsCode &&
                    <PassWordChangeForm {...passwordChangeProps}/>
                    ||
                    <SmsCodeForm {...props}/>
                }
            </div>
        )
}

