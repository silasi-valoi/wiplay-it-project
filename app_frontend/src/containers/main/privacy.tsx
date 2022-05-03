import React, { Component } from 'react';

import {HelpPageNavBar} from 'templates/navigations//nav-bar-partial';


class  PrivacyContainer extends Component  {
    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Privacy", 
        };       
    }

    static pageName(){
        return "Privacy"
    }


    componentDidMount() {
      console.log(this.props)
    }

    
    render(){
        let props = {...this.props, ...this.state}

        return(
            <div className="">
                <HelpPageNavBar {...props}/>
                <div className="privacy-page">
                    <div className="privacy-box">
                    <img alt="" 
                         src={require("media/pages-placeholder/pageUnderConstruction.jpeg")} 
                         className="page-placeholder-img"/> 
                </div>
                </div>
            </div>
        )
    }
};

export default PrivacyContainer; 


