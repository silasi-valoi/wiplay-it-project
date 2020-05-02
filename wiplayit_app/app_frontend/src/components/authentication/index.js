
import React, { Component } from 'react';
import  AuthenticationHoc   from 'components/authentication/index-hoc';
import RegistrationComponent from 'templates/authentication/index';



class RegistrationPage extends Component {

    constructor(props) {
      super(props);

      this.state = {
         navbarTitle : 'Joining Wiplayit', 
      }

    }

    componentDidMount() {
       console.log(this.props)
       this.props.formConstructor('loginForm')
    }


    getProps(){
        return Object.assign(this.state, this.props )
    };

    render() {
        let props = this.getProps();
        console.log(props)
     
        return (
            <RegistrationComponent {...props}/>         
        );
    };
};

export default AuthenticationHoc(RegistrationPage);







