import React from 'react';
import * as Effects from '../modal/Effects';



export let optionsModalStyles = {
  
  content: {
        border      : '1px solid rgba(0, 0, 0, .2)',
        background  : '#ffff',
        height      : 'auto', 
        bottom      :  '-5%',
        top         :  'auto', 
        position    : 'fixed',
        right       : 'auto',
        left        : 'auto',
    }
};



export let navBarModalStyles = {
  
    content: {
        width                   : '70%',
        margin                  : 'auto',
        border                  : '1px solid rgba(0, 0, 0, .2)',
        background              : '#fff',
        height                  : '100%', 
        bottom                  : 'auto',
        top                     : 'auto', 
        position                : 'fixed',
        right                   : 'auto',
        left                    : 'auto',

    }
};


export let mobileModalStyles = {
  
  content: {
    width                   : '100%',
    margin                  : '0% auto',
    background              : '#fff',
    height                  : '100%', 
    overflow                : 'none',
    bottom                  :  0,
    top                     :  0, 
    right                   : 'auto',
    left                    : 'auto',
     
   }
};

let desktopModalStyles  = {
    content: {
        margin                  : '5% 30% 0',
        width                   : '40%',
        background              : '#fff',
        maxHeight               : '100%',
    }
}; 


export let mobileImageModalStyles  = {
  
  content: {
    width                   : '90%',
    margin                  : '35% auto',
    background              : '#fff',
    borderRadius            : '7px',
  
   
   
   }
};


export let desktopImageModalStyles  = {
  
    content: {
        width                   : '90%',
        margin                  : '35%auto',
        borderRadius            : '7px',
    }
};


export const UserListModalStyles = {
  
    content: {
        margin     : '5%',
        background : '#fff',
        overflow   : 'none',
       
    }
};


export let getEditorStyles = ()=>{
        if (window.matchMedia("(min-width: 980px)").matches) {
            return desktopModalStyles;
        } else {
            return mobileModalStyles;
        } 
    };

let getModalEffect =()=> {
        if (window.matchMedia("(min-width: 980px)").matches) {
            return Effects.ScaleUp;
        } else {
            return Effects.SlideFromBottom;
        } 

};


export let getDropImageStyles = ()=>{
        if (window.matchMedia("(min-width: 980px)").matches) {
            return desktopModalStyles;
        } else {
            return mobileImageModalStyles;
        } 
    };

let desktopPasswordStyles = {
        content: {
            marginTop : '20%',
            ...desktopModalStyles.content
        }
};


export let getPasswordConfirmStyles = ()=>{

    if (window.matchMedia("(min-width: 980px)").matches) {
        return desktopPasswordStyles;
    } else {
        return mobileImageModalStyles;
    } 
};

const authModalStyles = {
    content: {
        ...mobileModalStyles.content,
        overflow : 'auto',
        marginLeft : '2.5%%',
        marginTop : '2.5%',
        width : '95%',
        bottom : '2.5%',
        height: '90%',
    }
}

export let getAuthenticationStyles = ()=>{
    if (window.matchMedia("(min-width: 980px)").matches) {
        return desktopModalStyles;
    } else {
        return authModalStyles;
    } 
}










