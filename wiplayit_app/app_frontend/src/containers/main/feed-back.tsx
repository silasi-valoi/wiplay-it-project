
import React, {Component} from 'react';
import {HelpPageNavBar} from 'templates/navBar';
import MessageFormContainer from '../main/message';
import Api from 'utils/api';
import  MainAppHoc from "../main/index-hoc";


class FeedBackContainer extends Component{

    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Feedback", 
        }; 
    };

    componentDidMount() {
        
    }


    render(){
        let api    = new Api()
        let apiUrl = api.getFeedBackApi();
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
                                How would want to see this platform be?
                            </li>
                        </ul>
                        <ul className="feedback-helper-text">
                            <li className="">
                                Wiplayit is a new platform and everyday we work to make
                                this platform a better place for football lovers. 
                            </li>

                            <li className="">
                                So as a user of this flatform we would like to hear from you
                                what we can add or change in the platform to make it great 
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


