import * as React from 'react';
import Registration from 'templates/authentication/index';

import { matchMediaSize } from 'utils';


type Props = {
  
};

interface State {
    isAuthenticating:boolean,
    
};

class AuthenticationPage extends React.Component<State, Props> {
    public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    static defaultProps: object = {
       
    };

    readonly state: State = {
        isAuthenticating:false,
       
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }

    constructor(props) {
        super(props);
    };

    componentDidMount =()=> {
        this.isMounted = true;

        this.setState({isAuthenticating:true})
        const _formConstructor:Function = this.props['formConstructor'];
        
        const matchBigScreen = matchMediaSize("min-width : 980px");
        
        if (matchBigScreen) {
            _formConstructor('loginForm');
        }
     
    };

    componentWillUnmount(){
        this.isMounted = false;                
    }
    
          
    getProps =():object=> {
        return {
            ...this.props,
            ...this.state,
        };

    };

    render() {
        if(!this.isMounted) return null;

        let props = this.getProps();
        
        return(
            <Registration {...props}/>
        )
    };
};

export default AuthenticationPage;







