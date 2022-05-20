import React from 'react';
import styled from 'styled-components'
import * as Icon from 'react-feather';

import {OpenAuthModalBtn, LinkButton} from "templates/buttons";
import { isString } from 'typeChecker'; 
import GetTimeStamp from 'timeStamp';

export const ButtonsBox = props => {
             
    return (
        <div className="contents-nav-container">

            <ul className="items-counter-box">
                <li  className="items-btn-box">
                    {props.authorCounter || null}
                </li>

                <li  className="items-btn-box">
                    {props.itemsCounter || null}
                </li>
            </ul>
            
            <ul  className="contents-nav-box" > 
                <li className="btn-box1">
                    {props?.btn1}
                </li>

                <li  className="btn-box2">
                    {props?.btn2}
                </li>

                <li className="btn-box3">
                    {props?.btn3}
                </li>
            </ul>
        </div>   
    )

};

const StyledCounter = styled['div']`
  /* ... */
`
const Paragraph = styled['p']`
  /* ... */
`
const Button = styled['button']`
  /* ... */
`

const AuthorLinkProps = (author:object):object => {
    return{
        linkPath:`/profile/${author['slug']}/`,
        state:{id:author['id']},
    }
}

export const AuthorAvatar = (props:object) => {
    const author:object = props['author'];
    const linkProps = AuthorLinkProps(author);
    const profile = author && author['profile'];

    return(
        <ul className="author-img-box" >
            <li className="author-img">
                <LinkButton {...linkProps}>
                    <img alt="" src={profile.profile_picture} className=""/> 
                </LinkButton>
            </li>
        </ul>
    )
}

export const AuthorDetails = (props:object)=>{
    let author:object = props['author'];
    let data:object = props['data'];
    let updated:boolean = data['updated'];

    let timeStamp:string;
    if(!updated){
        timeStamp = data['date_created'];

    }else{
        timeStamp = data['date_updated'];
    }

    

    const getTimeState = new GetTimeStamp({timeStamp});
    let dateCreated = getTimeState.timeSince();
    if(updated){
        dateCreated = `Updated ${dateCreated}`;
    }

    const linkProps = AuthorLinkProps(author);

    return(
        <ul className="author-details-box">
            <li className="author-name-box">
                <LinkButton {...linkProps}>
                    {author['first_name']} {author['last_name']}
                </LinkButton>
            </li>
            <li className="time-created">{dateCreated}</li>
        </ul>
    )
}


export const PageErrorComponent = props => {
    let {error, isReloading } = props;
 
    if (isReloading) {
       return null;
    }

    if (!error || !isString(error)){
        return null;
    }
   
    return(
        <div className="page-error-box" id="page-error-box">
            <ul className="error-box">
                <li className="error-text">
                    {error}
                </li>
            </ul>

            <ul className="reload-btn-box">
                <button onClick={()=> props.reLoader() }
                        className="reload-btn btn-sm">
                    <li className="reload-btn-box2">
                        <Icon.RotateCcw size={30}/>
                        <span className="reload-icon-text">Try Again</span>
                    </li>
                </button>
            </ul>
        </div>
    )

};


export const AlertComponent = (props) => {
    let {message, alertBoxStyles} = props;
    let textMessage  = message?.textMessage  
    let messageType = message?.messageType;

    if (!textMessage || typeof textMessage !== 'string') return null;
     
    let classNames   = messageType === 'error'   && `alert-danger`   ||
                       messageType === 'success' &&  `alert-success` ;
        
    let styles = alertBoxStyles || {}; 

    return(
        <div  className="alert-container">
            <div style={styles} className={`alert ${classNames}`}>
                <div  className="alert-box">

                    <ul className="alert-message">
                        <li>
                            {textMessage}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
};




export const UnconfirmedUserWarning =(props)=> {
 
    let {cacheEntities, currentUser, isAuthenticated} = props;
    if (!isAuthenticated) return null;

    currentUser     = !currentUser && cacheEntities && 
                       cacheEntities.currentUser && 
                       cacheEntities.currentUser.user || currentUser;
 
    let authenticationProps = {
            linkName  : "confirm account",
            authenticationType : 'accountConfirmation',
            modalName : 'authenticationForm',
            currentUser,
    };

    return(
        <div>
            {currentUser && !currentUser.is_confirmed &&
            <div className="unconfirmed-user-warn-container">
                <div className="alert alert-warning unconfirmed-user-warn-box">
                    <button className="">
                        <Icon.AlertCircle id="feather-alert-circle" size={20}/>
                    </button>

                    <ul className="confirm-account-link">
                        <li>
                            Your account has not been confirmed yet and you won't be able to
                            post or edit your profile. Please click 
                            <OpenAuthModalBtn {...authenticationProps}/> to 
                            verify your account.
                        </li>
                    </ul>
                </div>

            </div>
            }
        </div>
    );
};

//We just sent an email to the address: silassibaloy@gmail.com
//#Please check your email and click on the link provided to verify your address.