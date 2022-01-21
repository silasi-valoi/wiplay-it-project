
import React, { Component } from 'react';
import MainAppHoc from "containers/main/index-hoc";
import {PartalNavigationBar,
        NavigationBarBottom,
        NavigationBarBigScreen } from "templates/navBar";




class  NotificationsContainer extends Component  {
    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Notifications",
            notificationsTab : {color:'#A33F0B'}, 
        };       
    }

    static pageName(){
        return "Notifications"
    }

    componentDidMount() {
       
    }
    

    render(){
        let props = {...this.props, ...this.state}

        return(
            <div className="app-box-container">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <NavigationBarBottom {...props}/>
                <div className="notifications-page">
                    <div className="empty-notifications-box">
                        <ul className="empty-notifications">
                            <li>Your notifications will appear here</li>
                        </ul>
                    </div>
                </div>
          </div>
        )
    }
};

export default MainAppHoc(NotificationsContainer); 


