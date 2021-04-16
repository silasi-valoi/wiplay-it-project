import * as React from 'react';
import {X} from 'react-feather'
import {NavBar} from 'templates/authentication/utils';

import RegistrationComponent from 'templates/authentication/index';

import AuthenticationHoc from 'containers/authentication/auth-hoc'
import {matchMediaSize, displayErrorMessage, displaySuccessMessage} from 'utils/helpers';


type Props = {
  
};

interface State {
    navbarTitle:string,
    defaultFormName:string,

};

class AuthenticationPage extends React.Component<State, Props> {
    //public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    static defaultProps: object = {
       
    };

    readonly state: State = {
        navbarTitle : 'Joining Wiplayit', 
        defaultFormName : 'loginForm',

    };

    constructor(props) {
        super(props);
    };


    componentDidMount =()=> {
        const _formConstructor:Function = this.props['formConstructor'];
        
        const matchBigScreen = matchMediaSize("min-width : 980px");
        let matchSmallScreen = matchMediaSize("max-width : 980px");

        if (matchBigScreen) {
            _formConstructor('loginForm');
        }
    };
    
          
    getProps =():object=> {
        return {
            ...this.props,
            ...this.state,
        };

    };

    render() {
        let props = this.getProps();
        return(
            <div className="registration-page">
                <NavBar {...props}/>
                <div className="registration-container">
                    <RegistrationComponent {...props}/>
                </div>
            </div>
        )
    };
};

export default AuthenticationHoc(AuthenticationPage);







