
import React, {Component} from 'react';
import {HelpPageNavBar} from 'templates/navBar';
import MessageFormContainer from 'containers/main/message';
import Apis from 'utils/api';
import  MainAppHoc from "containers/main/index-hoc";


class ContactAdminContainer extends Component{

    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Contact us", 
        }; 
    };

    componentDidMount() {
        
    }


    render(){
        
        let apiUrl = Apis.getContactAdminApi();
        let props  = {
                ...this.props,
                ...this.state,
                apiUrl,
            };
        
        return(
            <div className="app-box-container">
                <HelpPageNavBar {...props}/>
                <div className="feedback-page">
                    <div className="feedback-container">
                        <ul className="feedback-title">
                            <li className="">
                                How can we help you?
                            </li>
                        </ul>
                        
                        <MessageFormContainer {...props}/>
                    </div>
                </div>
            </div>
        )
    }
};

export default MainAppHoc(ContactAdminContainer); 


