import React, { Component } from 'react';
import {X} from 'react-feather'

import  EmailForm   from 'templates/authentication/email-form'; 
import {NavBar}  from 'templates/authentication/utils';
import {ModalCloseBtn} from 'templates/buttons';
import AuthenticationHoc from 'containers/authentication/auth-hoc';


class AccountConfirmationResendPage extends Component{

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
   
    render(){
        let props = {...this.props, ...this.state}

        return (
            <div className="">
                <div className="authentication-dismiss">
                    <ModalCloseBtn>
                        <X id="feather-x" size={20} color="red"/>
                    </ModalCloseBtn>
                </div>
                <div className="account-confirmation-box">
                    <EmailForm {...props}/>
                </div>
            </div>
        )
    };
};


export default AuthenticationHoc(AccountConfirmationResendPage);

