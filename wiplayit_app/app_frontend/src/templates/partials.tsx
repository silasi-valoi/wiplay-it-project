import React from 'react';
import * as Icon from 'react-feather';
import {OpenAuthModalBtn} from "templates/buttons";
import * as checkType from 'helpers/check-types'; 
import {validateEmail,
        validatePhoneNumber} from 'containers/authentication/utils';

export const ButtonsBox = props => {
    let styles = props && props.Styles;
    styles     = styles && styles.contents;
  	styles     = !styles && Styles.contents || styles;
    
    return (
        <div className="contents-nav-container">

            <div className="items-counter-box">
               <ul className="items-counter-box">
                    <li  className="items-btn-box">
                        {props.itemsCounter || null}
                    </li>
               </ul>
            </div>

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


export const Styles = {
    contents : {
        display      : 'flex',
        border       : 'px solid red',
    }
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
    let { message,alertBoxStyles }      = props;
    let textMessage  = message?.textMessage  
    let messageType = message?.messageType;
     
    let classNames   = messageType === 'error'   && `alert-danger`   ||
                       messageType === 'success' &&  `alert-success` ;
        
    let styles = alertBoxStyles || {}; 
    return(
        <div  className="alert-container">
            <div style={styles} className={`alert  alert-success ${classNames}`}>
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

