import React, { Component } from 'react';
import  withAuthentication   from '../../containers/authentication/index'; 
 
import { NavBar, EmailFormComponent } from '../../components/registration'




class PasswordResetPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            navbarTitle    : 'Password Reset',
            formDescription    : `Forgotten your password? Enter your e-mail address below,
                                   and we'll send you an e-mail allowing you to reset it`,
                             
        };
    
   };

    componentDidMount() {
       console.log(this.props)
       this.props.formConstructor('passwordResetForm');
    }


      
    getProps(){
          
        return Object.assign(this.state, this.props );
    }
 

    render(){
      
        let props = this.getProps();

        return (
            <div>
                <div className="registration-container">
                  <EmailFormComponent {...props}/>
                </div>
            </div>
        )
    };
};




export default withAuthentication(PasswordResetPage);

