
import React, {Component} from 'react';
import { HelpPageNavBar } from 'templates/navigations/nav-bar-partial';
import MessageFormContainer from '../main/message';
import {Apis} from 'api';
import  MainAppHoc from "../main/index-hoc";


class FeedBackContainer extends Component{

    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Feedback", 
        }; 
    };

    static pageName(){
        return "FeedBack"
    }

    componentDidMount() {
        
    }

    render(){
   
        let apiUrl = Apis.getFeedBackApi();
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
                                How would you like to see this platform be?
                            </li>
                        </ul>
                        <ul className="feedback-helper-text">
                            <li className="">
                                Wiplayit is a new social network and everyday we work to make
                                this platform a better place for football lovers. 
                            </li>

                            <li className="">
                                So as a user we would like to hear from you
                                what we can do or change in the social network platform to make it great 
                                and enjoyable.  
                            </li>
                        </ul>

                        <MessageFormContainer {...props}/>
                    </div>
                </div>
            </div>
        )
    }
};

export default MainAppHoc(FeedBackContainer); 


