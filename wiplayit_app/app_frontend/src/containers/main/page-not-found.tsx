
import React, { Component } from 'react';
import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";
import  MainAppHoc from "containers/main/index-hoc";
import { FollowUserBtn, LinkButton} from "templates/buttons"; 
import {store} from "store/index";
import {getAboutInfo} from "dispatch/index"




class  NotFoundPage extends Component  {
   
    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Not Found", 
        };       
    }
    

    componentWillUnmount() {
        
    };

    componentDidMount() {
       
        console.log(this.props)
    }

    render(){
        let props = {...this.props, ...this.state}

        return(
         <div style={{paddingTop:'65px'}} className="page-not-found-page">
            <PartalNavigationBar {...props}/>
            <NavigationBarBigScreen {...props} />
            <div className="page-not-found-box">
                <NotFoundComponent {...props}/>
            </div>
         </div>
        )
    }
};

export default NotFoundPage; 


export const NotFoundComponent = props => {
    console.log(props)
    
    return(
        <div className="page-not-found-contents">
            <div className="page-not-found-text">
                <h1>Page Not Found</h1>
            </div>
            <div className="page-not-found-igm-box">
                <img alt=""
                     className="page-not-found-igm" 
                     src={require('media/page-not-found/custom-404-page-creation-1024x585.png')}/>
            </div>
        </div>
    )
};

