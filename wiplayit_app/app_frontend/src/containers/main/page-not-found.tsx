
import React, { Component } from 'react';
import {PartalNavigationBar,NavigationBarBigScreen } from 'templates/navBar';
import  MainAppHoc from 'containers/main/index-hoc';
import {history} from 'App';
import {LinkButton} from 'templates/buttons';

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

export default MainAppHoc(NotFoundPage); 


export const NotFoundComponent = props => {
    const linkProps = {
        linkPath: `/`,
        styles:{
            textDecoration:'none',
            color:'#5384e5',
            marginLeft:'15px',
        },
    }
        
    return(
        <div className="">
            <div className="page-not-found-contents">
                <div className="text-center page-not-found-title">
                    <p className="">
                        Page Not Found
                    </p>
                </div>

                <p className="text-center page-not-found-text">
                    We searched everywhere but couldn't find the page you were looking for.
                </p>
                <div className="text-center page-not-found-btns">
                    <div className="page-not-found-btns-box">
                        <button className="btn-sm text-highlight" 
                                onClick={()=> history.goBack()}>
                            Go Back
                        </button>
                      
                        <LinkButton {...linkProps}>
                            <span>Go Home</span>
                        </LinkButton>
                    </div>
                </div>
            </div>
            
        </div>
    )
};

