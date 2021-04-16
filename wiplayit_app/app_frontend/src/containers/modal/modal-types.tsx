
import React from 'react';
import PasswordResetPage from 'containers/authentication/password-reset';
import AccountConfirmationResendPage from 
                                    'containers/authentication/account-confirmation-resend';
import AccountConfirmationPage from 'containers/authentication/account-confirmation';

import { ModalOptionsMenu } from "templates/buttons";
import {EditProfile, DropImage} from "../main/edit-profile";
import UserListBox from "containers/users/modal-user-list"; 
import { NavBarMenuModalItems} from "templates/navBar";
import AppEditor  from 'containers/draft-js-editor/editor';
import {ModalOpener} from 'containers/modal/modal-conf'


export const GetModalType = (props) =>{
    let modalProps = props;
    
    let getEditorContents = () =>{
        let { objName } = modalProps;
        return objName === 'UserProfile' &&
              <EditProfile {...modalProps}/> || <AppEditor {...modalProps}/>;
    }
        
    let { modalName } = modalProps;
    
    switch(modalName){
        case 'editor':
            modalProps['modalContents'] = getEditorContents();
            return ModalOpener.editorModal(modalName, modalProps);

        case 'optionsMenu':
            modalProps['modalContents'] = <ModalOptionsMenu {...modalProps}/>
            return ModalOpener.optionsMenuModal(modalName, modalProps);

        case 'navigationMenu':
            modalProps['modalContents'] = <NavBarMenuModalItems {...modalProps}/>
            return ModalOpener.navBarMenuModal(modalName, modalProps);

        case 'dropImage':
            modalProps['modalContents'] = <DropImage {...modalProps}/>
            return ModalOpener.dropImageModal(modalName, modalProps);

        case 'userList':
            modalProps['modalContents'] = <UserListBox {...modalProps}/>
            return ModalOpener.userListModal(modalName, modalProps);

        case 'accountConfirmation':
            modalProps['modalContents'] = <AccountConfirmationPage {...modalProps}/>
            return ModalOpener.AuthenticationForm(modalName, modalProps);
       
        case 'confirmationResend':
            modalProps['modalContents'] = <AccountConfirmationResendPage {...modalProps}/>
            return ModalOpener.AuthenticationForm(modalName, modalProps);

        case 'passwordReset':
            modalProps['modalContents'] = <PasswordResetPage {...modalProps}/>
            return ModalOpener.AuthenticationForm(modalName, modalProps);

        default:
            return; 
    }
};

