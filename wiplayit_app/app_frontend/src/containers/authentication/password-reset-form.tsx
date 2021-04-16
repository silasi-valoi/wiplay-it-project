import React, { Component } from 'react';
import  EmailForm   from 'templates/authentication/email-form'; 




class PasswordResetForm extends Component{

   constructor(props) {
      super(props);

      this.state = {
         formTitle          : 'Password Reset',
         
                         
      };
            
   };

   componentDidMount() {
      //this.props.formConstructor('passwordResetForm')

    };

   
   
   render(){
      
      let props = Object.assign(this.state, this.props);
      console.log(this.props)

      return (
         <div className="password-reset">
            <ul className="form-title-box">
                <li className="">Password Reset</li>
            </ul>
         
             <EmailForm {...props}/>
         
         </div>
      )
   }
}




export default PasswordResetForm;


