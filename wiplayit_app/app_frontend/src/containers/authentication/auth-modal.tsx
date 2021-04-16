import React, { Component } from 'react';
import {X} from 'react-feather'

import PasswordResetPage from 'containers/authentication/password-reset';
import AccountConfirmationResendPage from 
                                   'containers/authentication/account-confirmation-resend';
import AccountConfirmationPage from 'containers/authentication/account-confirmation';

import  EmailForm   from 'templates/authentication/email-form'; 
import {NavBar}  from 'templates/authentication/utils';
import {ModalCloseBtn} from 'templates/buttons';
import AuthenticationHoc from 'containers/authentication/auth-hoc';


class AuthenticationModalPage extends Component{

    constructor(props) {
      super(props);

        this.state = {
            pageTitle :  'Confirmation Resend',
            navbarTitle      :  'Confirm Account',
            formDescription  :  ['Enter Your email address'],
        };
    }

    componentDidMount() {
        const _formConstructor = this.props['formConstructor']
        return _formConstructor('emailResendForm');
    }

    getAuthContents(modalName:string):React.Component {
        return
        /*
        switch (modalName) {
            case "accountConfirmation":
                return AccountConfirmationPage;
                break;

            case "passwordReset":
                return PasswordResetPage;
                break;
            
            default:
                // code...
                return null;
        }
        */

    }
   
    render(){
        let props = {...this.props, ...this.state}
        let modalName = this.props['modalName'];
        const AuthContents = this.getAuthContents(modalName);

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
                    
                </div>
            </div>
        )
    };
};


export default AuthenticationHoc(AuthenticationModalPage);

