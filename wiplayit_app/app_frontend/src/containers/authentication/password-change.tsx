import React, { Component } from 'react';
import {NavBar} from 'templates/authentication/utils';
import AuthenticationHoc from 'containers/authentication/auth-hoc'

import  {PasswordChangeForm,
        SuccessPasswordChange}   from 'templates/authentication/password-change'; 
 





export class PasswordChangePage extends Component{

   constructor(props) {
      super(props);

        this.state = {
            navbarTitle        : 'Password Change',
            formTitle          : 'Password Change',
            formDescription    : 'Enter a new passsword on both fields.',
        };
    }

    componentDidMount() {
        const match:object = this.props['match'];
        if (match) {
            const path:string = match['path'];  
            let {uid, token}  = match['params'];

            if(uid && token){
                const _formConstructor = this.props['formConstructor']
                return _formConstructor('passwordChangeConfirmForm', {uid, token});
            }             
        }
            
    }


    render(){
      
        let props:object = {...this.props, ...this.state};
        console.log(props)
                
        return (
            <div className="registration-page">
               <NavBar {...props}/>
                <div className="password-change-container registration-container">
                    {props['passswordChanged'] &&
                        <SuccessPasswordChange {...props}/>
                        ||
                        <PasswordChangeForm {...props}/>
                    }
                </div>   
            </div>
        )
    }
}


export default AuthenticationHoc(PasswordChangePage);

