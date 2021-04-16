import React, { Component } from 'react';
import {X} from 'react-feather'

import AuthenticationHoc from 'containers/authentication/auth-hoc';
import {ModalCloseBtn} from 'templates/buttons';
import EmailForm ,{EmailPasswordResetSuccess}  from 'templates/authentication/email-form'; 
import {NavBar} from 'templates/authentication/utils'



class PasswordResetPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            navbarTitle     : 'Password Reset',
            formDescription : `Enter your e-mail address or phone number to change password.`,
        };
    };

    componentDidMount() {
        const _formConstructor = this.props['formConstructor']
        return _formConstructor('passwordResetForm');
      
    }
   
    render(){
        let props = {...this.props, ...this.state};
               
        return (
            <div className="password-reset-page">
                <div className="authentication-dismiss">
                    <ModalCloseBtn>
                        <X id="feather-x" size={20} color="red"/>
                    </ModalCloseBtn>
                </div>

                <div className="password-reset-container">
                    <EmailForm {...props}/>
                </div>
            </div>
        )
    };
};




export default AuthenticationHoc(PasswordResetPage);


