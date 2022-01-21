
import React, { Component } from 'react';
import {HelpPageNavBar} from "templates/navBar";
import MessageFormContainer from 'containers/main/message';
import MainAppHoc from "containers/main/index-hoc";
import Apis from 'utils/api';


class ReportContainer extends Component{

    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Report", 
        };       
    };

    componentDidMount() {
        
    };
 

    render(){
        
        let apiUrl = Apis.getBugReportApi();
        let props = {
                ...this.props,
                ...this.state,
                apiUrl,
            }

        return(
            <div className="app-box-container app-profile-box">
                <HelpPageNavBar {...props}/>        
                <div className="report-page">        
                    <div className="report-container">
                        <div className="report-box">
                            <MessageFormContainer {...props}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
};

export default MainAppHoc(ReportContainer); 


