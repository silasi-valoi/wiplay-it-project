import React from 'react';
import styled from 'styled-components'
import * as Icon from 'react-feather';

import {OpenAuthModalBtn, LinkButton} from "templates/buttons";
import * as checkType from 'helpers/check-types'; 
import GetTimeStamp from 'utils/timeStamp';
import {validateEmail,
        validatePhoneNumber} from 'containers/authentication/utils';

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
        linkPath:`/profile/${author['id']}/${author['slug']}/`,
        state:{user:author},
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
    let data:object = props['data']
    let timeStamp:string = data['date_created']
    const linkProps = AuthorLinkProps(author);

    const getTimeState = new GetTimeStamp({timeStamp});
    let dateCreated = getTimeState.timeSince();

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
    if (isReloading || !error || !checkType.isString(error)) return null;
   
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

}





export const AlertComponent =(props)=> {
    let {message, alertBoxStyles} = props;
    let textMessage  = message?.textMessage  
    let messageType = message?.messageType;
     
    let classNames   = messageType === 'error'   && `alert-danger`   ||
                       messageType === 'success' &&  `alert-success` ;
        
    let styles = alertBoxStyles || {}; 
    return(
        <div  className="alert-container">
            <div style={styles} className={`alert ${classNames}`}>
                <div  className="alert-box">

                    <ul className="alert-message">
                        <li>
                            { textMessage }
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
            modalName:'accountConfirmation',
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

