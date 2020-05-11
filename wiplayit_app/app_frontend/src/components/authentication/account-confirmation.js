import React, { Component } from 'react';
import  AuthenticationHoc   from 'components/authentication/index-hoc'; 
import {NavBar} from 'templates/authentication/utils'
import AccountConfirmation from 'templates/authentication/confirmation'
import {store} from "store/index";
import Axios from 'utils/axios_instance'
import { getCurrentUser }  from "dispatch/index"
import Api from 'utils/api';






const api = new Api();

  

class AccountConfirmationPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            isConfirmed      :  false,
            successMessage   :  undefined,
            errorMessage     :  undefined,
            pageTitle        :  'Account Confirmation',
            navbarTitle      :  'Confirm Account',
            formDescription  :  ['Enter your email address'],
        };

        this.isConfirmed = this.isConfirmed.bind(this);
    
    };


    isConfirmed = (auth={})=>{
        this.setState({...auth});
        
    };

   
    componentDidMount() {
        
        let { key } = this.props.match.params; 
        this.props.confirmUser( key, this.isConfirmed );    
    };
   
  
    getProps(){
         
        return Object.assign(this.state, this.props );
    };
 

  
  
    render() {
        let props = this.getProps();
        console.log(props) 
        return (
            <div className="registration-page confirmation-page">
              <NavBar {...props}/>

               <div>
                    <div className="account-confirm-container registration-container">
                       <AccountConfirmation {...props } />   
                    </div>
                </div>
          
            </div>
        );
    };
};


export default AuthenticationHoc(AccountConfirmationPage);
