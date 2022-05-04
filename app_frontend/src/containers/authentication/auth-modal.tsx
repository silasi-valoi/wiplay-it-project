import React, { Component } from 'react';
import {X} from 'react-feather'

import PasswordResetPage from 'containers/authentication/password-reset';
import AccountConfirmationResendPage from 
                                   'containers/authentication/account-confirmation-resend';
import AccountConfirmationPage from 'containers/authentication/account-confirmation';
import AuthenticationPage from 'containers/authentication/index';
import {ModalCloseBtn} from 'templates/buttons';
import { PasswordConfirmationPage } from './password-confirmation';
import { AuthenticationHoc } from './auth-hoc';


class AuthenticationModalPage extends Component{
    public isFullyMounted:boolean = false;

    constructor(props) {
      super(props);

        this.state = {
            
        };
    }

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
    };

    getAuthContents(authenticationType:string) {
        
        
        switch (authenticationType) {
            case "accountConfirmation":
                return AccountConfirmationPage
             
            case "passwordReset":
                return PasswordResetPage

            case "Login":
                return AuthenticationPage 

            case "confirmationResend":
                return AccountConfirmationResendPage

            case "passwordConfirmationForm":
                return PasswordConfirmationPage

            default:
                // code...
                return null;
        }
    };
   
    render(){
        let props = {...this.props, ...this.state}
        let authenticationType:string = this.props['authenticationType'];
        const AuthContents = this.getAuthContents(authenticationType);

        if (!AuthContents) {
            return null;
        }
       
        return (
            <div>
                <div className="authentication-dismiss">
                    <ModalCloseBtn>
                        <X id="feather-x" size={20} color="red"/>
                    </ModalCloseBtn>
                </div>
                <div className="auth-modal-container">
                    <AuthContents {...props}/>
                </div>
            </div>
        )
    };
};

export default AuthenticationHoc(AuthenticationModalPage);

