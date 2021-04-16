import React from 'react';
import * as Effects from '../modal/Effects';



export let optionsModalStyles = {
  
  content: {
    width                   : '100%',
    margin                  : 'auto',
    border                  : '1px solid rgba(0, 0, 0, .2)',
    background              : '#fff',
    overflow                : 'none',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    height                  : 'auto', 
    bottom                  :  0,
    top                     :  'auto', 
    position                : 'fixed',
    right                   : 'auto',
    left                    : 'auto',
  }
};



export let navBarModalStyles = {
  
  content: {
    width                   : '70%',
    margin                  : 'auto',
    border                  : '1px solid rgba(0, 0, 0, .2)',
    background              : '#fff',
    overflow                : 'none',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
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
    overflow                : 'none',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    height                  : '100%', 
    bottom                  :  0,
    top                     :  0, 
    position                : 'relative',
    right                   : 'auto',
    left                    : 'auto',
     
   }
};

let desktopModalStyles  = {
    content: {
        position                : 'relative',
        margin                  : '5% 30% 0',
        width                   : '40%',
        background              : '#fff',
        overflowX               : 'hidden',
        overflowY               : 'hidden',
        borderRadius            : '4px',
        outline                 : 'none',
        boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
        maxHeight               : '100%',
    }
}; 


export let mobileImageModalStyles  = {
  
  content: {
    width                   : '90%',
    margin                  : '35% auto',
    border                  : '1px solid rgba(0, 0, 0, .2)',
    background              : '#fff',
    overflow                : 'none',
    borderRadius            : '7px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    position                : 'relative',
   
   
   }
};


export let desktopImageModalStyles  = {
  
  content: {
    width                   : '90%',
    margin                  : '35%auto',
    border                  : 'px solid rgba(0, 0, 0, .2)',
    background              : '#fff',
    overflow                : 'none',
    borderRadius            : '7px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    position                : 'relative',
   
   
   }
};


export const UserListModalStyles = {
  
    content: {
        margin                  : '5%',
        border                  : 'px solid rgba(0, 0, 0, .2)',
        background              : '#fff',
        overflow                : 'none',
        borderRadius            : '4px',
        outline                 : 'none',
        boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
        position                : 'relative !important',
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
            marginTop : '5%',
            ...mobileImageModalStyles.content
        }
}

export let getAuthenticationStyles = ()=>{
    if (window.matchMedia("(min-width: 980px)").matches) {
        return desktopModalStyles;
    } else {
        return authModalStyles;
    } 
}










