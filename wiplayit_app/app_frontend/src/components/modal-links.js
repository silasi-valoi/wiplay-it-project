
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { store } from "store/index";
import {showModal, handleError} from 'actions/actionCreators';
import {history} from "App" 

import { ModalManager}   from  "containers/modal/modal_container";



export const EditorLink = props => {
    //console.log(props)
	
    let {modalProps, currentUser} = props ;
    let { background, modalPath, className } =  props;

    background && console.log(background)
    
    let editorProps = modalProps && modalProps.editorProps || {...props};

    modalProps = {
            editorProps,
            modalType   : 'editor', 
        };

    
    let {objName, isPut, linkName, editorLinkStyles} = editorProps;
    let context   = objName && objName.toLowerCase();
    let pathname  = modalPath || `/compose/${context}/${'1'}/`;

    let state = { 
        background : background || useLocation(),
        modalProps
    } 
    

    let buildLinkName =()=> {
        let Edit = isPut && "Edit " || "";
        return `${Edit}${objName}`;
    };

    let getEditorStyles = ()=>{
            if (window.matchMedia("(min-width: 900px)").matches) {
               return props.editorLinkDesktopStyles || {};
            }
            
            else {
              return props.editorLinkMobileStyles || {};
            } 
        };

    
    linkName   = linkName?linkName:buildLinkName();
    let styles = getEditorStyles();

    let madalParams = {
            boolValue   : true,
            modalType   : 'editor',
            background  : state.background,
        }
       
    return(
        <button  className={className}   onClick={()=> {
                        if (!currentUser.is_confirmed) {
                            let error = 'Sorry, you must confirm your account to start posting and editting ';
                            store.dispatch(handleError(error));
                            return;   
                        }

                        background &&  ModalManager.close('optionsMenu', background)
                        let timer = isPut && 1500 || 100;
                    
                        setTimeout(()=> {
                            store.dispatch(showModal(madalParams));
                            history.push({ pathname: pathname, state}); 
                        }, timer);

                    }}>
                    { linkName } 
        </button>
        
    );
};




export const OptionsModalLink = props => {
    let location = useLocation();
    let pathname = `/compose/${'options'}/${props.obj.id}/`;

    let  modalProps = {
            optionsMenuProps : {...props},
            modalType   : 'optionsMenu', 
        }; 

    let state = { 
        background : props.background || location,
        modalProps
    } 

    let madalParams = {
            boolValue : true,
            modalType   : 'optionsMenu',
            background  : state.background,
        }
        
        
    return(
        <button className="btn-sm options-btn"    onClick={()=> {

                        store.dispatch(showModal(madalParams))
                        setTimeout(()=> {

                            history.push({ pathname: pathname, state}); 
                        }, 500);

                    }}>
             <i className="material-icons ">more_horiz</i>  
        </button>
        
    );
};





export const ChangeImageBtn = props => {
    let location = useLocation();
    //console.log(props)
    let {currentUser} = props && props;

    let modalProps = {
            dropImageProps : {...props},
            modalType   : 'dropImage', 
        }; 

    let pathname = `/compose/${'profile-pic'}/${'1'}/`;
    let state    = { background: location, modalProps };

    let madalParams = {
            boolValue : true,
            modalType   : 'dropImage',
            background  : state.background,
        }

    let linkName = props.linkName || `Edit`;

    return(
       
        <button className="edit-img-btn"   onClick={()=> {
                        if (!currentUser.is_confirmed) {
                            let error = 'Sorry, you must confirm your account to to change photo ';
                            store.dispatch(handleError(error));
                            return;   
                        }

                        store.dispatch(showModal(madalParams));
                        setTimeout(()=> {
                            history.push({ pathname: pathname, state}); 
                        }, 500);

                    }}>
            {linkName}  
        </button>
    );
};





export const UsersModalLink = props => {
    let location = useLocation();
    let {obj, background, linkName} = props
    
    let pathname =  `/compose/${'user'}/${obj && obj.id || 1}/`;

    let modalProps = {
            userListProps : {...props},
            modalType     : 'userList', 
        }; 

    let state = { 
        background : background || location,
        modalProps
    } 

    let madalParams = {
            boolValue   : true,
            modalType   : 'userList',
            background  : state.background,
        }
        
        
    return(
        <button className="btn-sm"    onClick={()=> {
                        store.dispatch(showModal(madalParams))
                        setTimeout(()=> {

                            history.push({ pathname: pathname, state}); 
                        }, 500);

                    }}>
            {linkName}  
        </button>
        
    );
};


