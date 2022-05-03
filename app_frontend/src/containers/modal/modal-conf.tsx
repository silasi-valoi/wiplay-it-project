import React from 'react';

import * as Styles from 'containers/modal/styles';
import ModalBox,{ModalManager}  from "containers/modal/modal-container";
import * as Effects from 'containers/modal/Effects';




export const ModalOpener = {

    optionsMenuModal(modalName:string, contentsProps:object) {
        return ModalManager.open(
            <OptionModal {...contentsProps} onRequestClose={() => true}/>,
            modalName

        );
    },

    editorModal(modalName:string, contentsProps:object){
               
        return ModalManager.open(
            <EditModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },

    dropImageModal(modalName, contentsProps){

        return ModalManager.open(
            <DropImageModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },

    imageViewModal(modalName:string, contentsProps){

        return ModalManager.open(
            <ImageViewModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },

    draftjsMediaViewModal(modalName, contentsProps){
        return ModalManager.open(
            <ImageViewModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );

    },

    userListModal(modalName, contentsProps){

        return ModalManager.open(
            <UserListModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },

    navBarMenuModal(modalName, contentsProps){
        
        return ModalManager.open(
            <NavBarMenuModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },

    smsCodeModalForm(modalName, contentsProps){
        
        return ModalManager.open(
            <SmsCodeModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },

    passwordConfirmForm(modalName, contentsProps){
        
        return ModalManager.open(
            <PasswordConfirmModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },

    AuthenticationForm(modalName, contentsProps){
        
        return ModalManager.open(
            <AuthenticationModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },
};





export const OptionModal = props => {
    
    let modalProps = {
        modalStyles    : Styles.optionsModalStyles,
        effect         : Effects.SlideFromBottom,
        modalName      : 'optionsMenu',
        ...props,
    };

    return(
        <ModalContainer {...modalProps} />
    ); 
};




export const NavBarMenuModal = props => {
    
    let modalProps = {
        modalStyles    : Styles.navBarModalStyles,
        effect         : Effects.SlideFromLeft,
        ...props
    };

    return(
        <div>
            <ModalContainer {...modalProps} />
        </div>
    ); 
};




let getModalEffect =()=> {
        if (window.matchMedia("(min-width: 980px)").matches) {
            return Effects.ScaleUp;
        } else {
            return Effects.SlideFromBottom;
        } 

};

export const EditModal = (props):JSX.Element => {
    //console.log(props)

    let modalProps = {
        modalStyles    : Styles.getEditorStyles(),
        effect         : getModalEffect() ,
        ...props, 

    }; 

    return(
       <ModalContainer {...modalProps} />
    ); 
};

export const AuthenticationModal = props => {
    let effect;
    if(window.matchMedia("(min-width: 980px)").matches){
        effect = Effects.ScaleUp;

    }else{
        effect = Effects.SlideFromRight;
    }
    
    let modalProps = {
        modalStyles : Styles.getAuthenticationStyles(),
        effect,
        ...props
    };
    
    return(
        <div>
            <ModalContainer {...modalProps} />
        </div>
    ); 
};



export const SmsCodeModal = props => {
    
    let modalProps = {
        modalStyles    : Styles.getDropImageStyles(),
        effect         : Effects.ScaleUp,
        ...props
    };
    
    return(
        <div>
            <ModalContainer {...modalProps} />
        </div>
    ); 
};


export const PasswordConfirmModal = props => {
    
    let modalProps = {
        modalStyles    : Styles.getPasswordConfirmStyles(),
        effect         : Effects.ScaleUp,
        ...props
    };
    
    return(
        <div>
            <ModalContainer {...modalProps} />
        </div>
    ); 
};



export const ImageViewModal = props => {

    let modalProps = {
        modalStyles    : Styles.getImageViewStyles(),
        effect         : Effects.ScaleUp,
        ...props,
    }; 

    return(
        <ModalContainer {...modalProps} />
    ); 
};


export const DraftjsMediaViewModal = props => {

    let modalProps = {
        modalStyles    : Styles.getImageViewStyles(),
        effect         : Effects.ScaleUp,
        ...props,
    }; 

    return(
        <ModalContainer {...modalProps} />
    ); 
};



export const DropImageModal = props => {

    let modalProps = {
        modalStyles    : Styles.getDropImageStyles(),
        effect         : Effects.ScaleUp,
        ...props,
    }; 

    return(
        <ModalContainer {...modalProps} />
    ); 
};

export const UserListModal = props => {
    let modalProps = {
        modalStyles    : Styles.getEditorStyles(),
        effect         : Effects.ScaleUp ,
        ...props,
    }; 

    return(
        <ModalContainer {...modalProps} />
    ); 
};


export function  ModalContainer(props)  {
    
    //Render modal box with along with its contents
    const {
            modalContents,
            modalStyles,
            modalName,
            effect, 
            onRequestClose, } = props;

    const modalProps:object = {
        style:modalStyles,
        effect,
        onRequestClose,
        modalName
    }
    
    return (
        <ModalBox {...modalProps}>

            {modalContents}
         
        </ModalBox>
    );
};






