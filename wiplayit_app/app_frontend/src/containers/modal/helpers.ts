
 
import {store } from "store/index";
import { ModalManager}   from  "containers/modal/modal-container";


export const closeModals =(background?:boolean):void => {

    let { entities}  = store.getState();
    let modal:object  = entities['modal'];
    
    let optionsModal     = modal && modal['optionsMenu'];
    let editorModal      = modal && modal['editor'];
    let dropImageModal   = modal && modal['dropImage'];
    let userListModal    = modal && modal['userList'];
    let navigationModal  = modal && modal['navigationMenu'];
    let passwordConfirmForm = modal && modal['passwordConfirmationForm'];
    let authenticationForm = modal && modal['authenticationForm'];
    let passwordResetModal = modal && modal['passwordReset'];
    let confirmationResendModal = modal && modal['confirmationResend'];
    let accountConfirmationModal = modal && modal['accountConfirmation'];

    editorModal     && editorModal.modalIsOpen      &&
                                     ModalManager.close('editor', background);
    optionsModal    && optionsModal.modalIsOpen     &&
                                     ModalManager.close('optionsMenu', background);

    dropImageModal  && dropImageModal.modalIsOpen   &&
                                    ModalManager.close('dropImage', background); 

    userListModal   && userListModal.modalIsOpen    && 
                                  ModalManager.close('userList', background); 
                                        
    navigationModal && navigationModal.modalIsOpen  && 
                                  ModalManager.close('navigationMenu', background);
    accountConfirmationModal && accountConfirmationModal.modalIsOpen && 
                                   ModalManager.close('accountConfirmation', background); 

    passwordResetModal && passwordResetModal.modalIsOpen && 
                                   ModalManager.close('passwordReset', background); 

    confirmationResendModal && confirmationResendModal.modalIsOpen && 
                                   ModalManager.close('confirmationResend', background); 
                                   
    passwordConfirmForm && passwordConfirmForm.modalIsOpen && 
                                  ModalManager.close('passwordConfirmForm', background); 
    

                                  
};

export const handleModalScroll =()=> {
    let content      = document.getElementById('modal-content');
    let overlay      = document.getElementById('modal-overlay');

    if (content) {
        let contentRectTop      = content.getBoundingClientRect().top;
        let _contentHeight = content.clientHeight + contentRectTop;
        let _overlay = overlay.clientHeight - 80;
        
                        
        if (_contentHeight >= _overlay) {
            return true;

        }else{
            return false;
        }
    }

    return false;
}

