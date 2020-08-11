import { MatchMediaHOC } from 'react-match-media';

import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import {handleModalScroll} from 'components/modal/helpers';
import { GetModalLinkProps } from 'templates/component-props';

import { EditProfileNavBar } from 'templates/navBar';
import {  ChangeImageBtn  } from 'templates/buttons';
import MainAppHoc from "components/index/index-hoc";

import  * as types  from 'actions/types';
import  * as action  from 'actions/actionCreators';
import {store} from "store/index";
import {handleSubmit, getUserProfile}  from "dispatch/index"
import { AlertComponent } from 'templates/partial-components';
import  AjaxLoader from 'templates/ajax-loader';
import  Helper from 'utils/helpers';
import Api from 'utils/api';
import * as checkType from 'helpers/check-types'; 


const api = new Api();

const helper   = new Helper();  


class EditProfileRouter extends Component{

    constructor(props) {
        super(props);
        this.state = {
        }
    }; 

    render() {
        return (
            <div>
                <EditProfile {...this.props}/>
            </div>
        );
    };
};
 
export default MainAppHoc(EditProfileRouter);


export class EditProfile extends Component{
    isMounted = false;

    constructor(props) {
       super(props);
    
        this.state = {
            userProfile    :  undefined,
            submitting     : false,
            currentUser    : undefined, 
            displayMessage : false,

            form         : {
               first_name       : "",
               last_name        : "",
               credential       : "",
               live             : "",
               country          : '',
               favorite_quote   : "",
               phone_number     : "",
               profile_picture  : "", 
           },
        };
     
        this.handleChange   =  this.handleChange.bind(this);
    }; 


    onProfileUpdate = () =>{
 
        const onStoreChange = () => {
            let { byId, currentUser}     =  this.state; 

            let storeUpdate  = store.getState();
            let {entities }  = storeUpdate;
            let {userProfile} = entities;
                        
            userProfile = userProfile[byId];
            let { modal, errors } = entities;
            let editorModal    = modal['editor']; 
            let dropImageModal = modal['dropImage'];
              
            if (userProfile) {
                console.log(userProfile, this.state)

                let isEditorModal    = this.checkModalIsOpen('editor');
                let isDropImageModal = this.checkModalIsOpen('dropImage');

                if (!isDropImageModal || !isEditorModal) {
                    this._HandleSuccessUpdate(userProfile)
                }

                !isDropImageModal && this._IsSubmiting(userProfile);
                this._SetUpdatedUser(userProfile)

                
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    _IsSubmiting(userProfile){
        let isSubimiting  = userProfile &&  checkType.isBoolean(userProfile.submitting)
        isSubimiting && this.setState({ submitting : userProfile.submitting});

    }

    _SetUpdatedUser(userProfile){
        userProfile = userProfile &&  userProfile.user;
        userProfile && this.setState({userProfile})
        userProfile && this.populateEditForm(userProfile);
    }

    _HandleSuccessUpdate(userProfile){
        if (!userProfile) return;

        if (userProfile.updated === true) {
            delete userProfile.updated;
            console.log(userProfile)

            let textMessage = "Your profile successfuly updated"
            textMessage     = {textMessage, messageType:'success'}
            this.displayMessage(textMessage)

        }

    }

    _HandleErrorUpdate(){

    }

    displayMessage(message){
        if (!this.isMounted) return;
        console.log(message)
                     
        this.setState({ displayMessage : true, message });
        setTimeout(()=> {
            this.setState({displayMessage : false}); 
        }, 5000);
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    componentDidMount() {
        this.isMounted = true
        this.onProfileUpdate();
        console.log(this.props)
        
        let { location, match } = this.props; 
        let state =  location && location.state;
                
        if (state) {
            let {obj, byId} =  state;
            this.setState({...state});
            this.getUserProfileFromStore(byId)
           
        }else{

            let {obj, byId} = this.props 
            if (byId) {
                this.setState({...this.props});
                this.getUserProfileFromStore(byId)
            }else{
                this.getUserProfile()
            }
           
        }
        
    };

    getUserProfileFromStore(byId){
        let storeUpdate  = store.getState();
        let {entities }  = storeUpdate;
        let {userProfile} = entities;

        userProfile = userProfile[byId];
        console.log(userProfile)
                         
        if (userProfile && userProfile.user) {
            userProfile = userProfile.user;
            this.populateEditForm(userProfile);
            return;
        }

        this.getUserProfile()
    }

    getUserProfile(){
        let { cacheEntities, match } = this.props; 
        let { userProfile, currentUser } = cacheEntities;

        let {id}    = match && match.params;
        let byId    = `userProfile${id}`;
        userProfile = userProfile && userProfile[byId];

        currentUser = currentUser.user;
        userProfile = userProfile.user;
        this.setState({userProfile, currentUser, byId});

        if (userProfile) {
            this.populateEditForm(userProfile);
            return;
        }

        getUserProfile(id);
    }


    
    populateEditForm(userProfile ){
        if (!userProfile) return;
        if (!Object.keys(userProfile).length) return;
        
        let {form}     =  this.state;
            
        let {first_name, last_name} = userProfile

        let { live, credential, favorite_quote, country, phone_number } = userProfile.profile 
      
        form = { first_name, 
                 last_name, 
                 live, 
                 country,
                 phone_number,
                 credential,
                 favorite_quote 
            };

        this.setState({ form, userProfile });
    }

    handleChange(e){
      e.preventDefault()
      let form = this.state.form;
      form[e.target.name] = e.target.value;
      this.setState({form})
    }

    getProps(){
        
        return {
            ...this.props,
            handleChange         : this.handleChange, 
            textAreaProps        : this.textAreaProps(),
            submitProps          : this.submitProps(),
            submit               : this.submit.bind(this), 
            editUserProfileProps : this.getUserEditProps(),
            handleScroll : this.handleScroll.bind(this),
            ...this.state,
        }
    }
 
    textAreaProps() {
        return {
           value     : this.state.form.favorite_quote,
           onChange  : this.handleChange,
           name      : "favorite_quote",
           className : "favorite_quote",
           placeholder:'Your favourite quote',
        };
    };


    submitProps() {
        let { form } = this.state;
        let editUserProfileProps = this.getUserEditProps()
        let formData = helper.createFormData(form)
        return Object.assign(editUserProfileProps, {formData})
    
          
           
    };
    checkModalIsOpen(modalName){
        let storeUpdate  = store.getState();
        let {entities }  = storeUpdate;
        let {modal}     = entities;
        modal = modal[modalName]
        if (!modal) return false;

        return modal.modalIsOpen;
    }


    getUserEditProps(){
        let { byId, userProfile, currentUser } = this.state;
        let isModal = this.checkModalIsOpen('editor');

       let modalName = isModal && 'editor' || undefined;
            
        let editUserProfileProps = {
                objName     : 'UserProfile',
                isPut       : true,
                obj         : userProfile, 
                modalName,
                isModal,
                currentUser ,
                byId,

            } 

        return GetModalLinkProps.props(editUserProfileProps)    

    }

    handleScroll=()=>{
        let {onScroolStyles}    = this.state;
        let isDesktopScreenSize = window.matchMedia("(min-width: 980px)").matches;

        if (isDesktopScreenSize) {
            let editorsBoxElem = document.getElementById('editors-box')
            let isAtBottom     = handleModalScroll();
            //editorsBoxElem && console.log(editorsBoxElem.clientHeight)

            if (editorsBoxElem && isAtBottom && !onScroolStyles) {
                onScroolStyles  = {
                    height : editorsBoxElem.clientHeight
                };

                this.isMounted && this.setState({onScroolStyles});
            }
        }
    };

    submit(params){
        store.dispatch(handleSubmit(params));
    };

    render() {
        let props = this.getProps();
        let alertMessageStyles = props.displayMessage?{ display : 'block'}:
                                                      { display : 'none' };
        var userProfile = props.userProfile

      return (
        <div className="modal-editor"
             id="modal-editor"
             onScroll={props.handleScroll()}>

            <EditProfileNavBar {...props}/>
            <div style={props.onScroolStyles || {}}
                 id="editors-box" 
                 className="editors-box">
                { userProfile &&
                    <div>
                        <ProfileEditComponent {...props}/>
                    </div>
                }  

                <div style={alertMessageStyles}>
                    <AlertComponent {...props}/>
                </div>         
            </div>
                   
        </div>
      );
   };
};




const ProfileEditComponent = props => {
    
    let {submitting, userProfile, editUserProfileProps } = props;
    userProfile = userProfile;
    
    let submitButtonStyles = submitting?{opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting? {opacity:'0.60'}:{};



    return(

        <div  className="edit-profile-container" >
            <fieldset style={ fieldSetStyles} 
                      disabled={ submitting} >
                <EditProfilePicSmalScreen {...props}/>
            
                <div className="profile-name-edit-box">
                    <ul className="item-title-box">
                        <li className="item-title">
                             Name
                        </li>
                    </ul>

                    <div className="profile-name-input-box input-box">
                        <input
                            type="text" 
                            className="profile-name-input"
                            name="first_name"
                            value={props.form.first_name}
                            onChange={props.handleChange}
                        />

                        <input
                            type="text" 
                            className="profile-name-input"
                            name="last_name"
                            value={props.form.last_name}
                            onChange={props.handleChange}
                        />
                    </div>

                </div>

      
                <div className="user-locacion-box">
                    <ul className="item-title-box">
                        <li className="item-title">
                            Live
                        </li>
                    </ul>
                    <div className="input-box">
                        <input
                            type="text" 
                            placeholder="Your location"
                            className=""
                            name="live"
                            value={props.form.live}
                            onChange={props.handleChange}
                        />
                    </div>        
                </div>
      
                <div className="user-credential-box">
                    <ul className="item-title-box">
                        <li className="item-title">
                            Credentials
                        </li>
                    </ul>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="About you" 
                            className=""
                            name="credential"
                            value={props.form.credential}
                            onChange={props.handleChange}
                        />
                    </div>
                </div>

      
                <div className="user-favorite-quote-box">
                    <ul className="item-title-box">
                        <li className="item-title">
                            Quote
                        </li>
                    </ul>

                    <div className="input-box">
                        <TextareaAutosize {...props.textAreaProps}  rows={3}/>  
                    </div>   
                </div>
            </fieldset>
    
        </div>
    );
};


const EditProfilePicture = (props)=>{

        //console.log(props)
        let {userProfile, editUserProfileProps } = props;
        let profile  = userProfile && userProfile.profile;
        let linkName = `Edit`; 

        editUserProfileProps = {...editUserProfileProps, linkName}
        //console.log(editUserProfileProps)
    
        return(
            <div className="edit-img-container">
                <ul className="item-title-box">
                    <li className="item-title">
                        Photo
                    </li>
                </ul>

                <div className="edit-image-container">
                    <div className="edit-profile-image-box">
                            <div className="edit-image-btn-box">
                                { profile && profile.profile_picture?
                                    <img alt="" 
                                         className="edit-image" 
                                         src={profile.profile_picture }/>
                                    :
                                    <img alt="" 
                                         src={require("media/user-image-placeholder.png")} 
                                         className="edit-image"/> 
                                }
                            </div>
                    </div>
                    <div className="change-img-btn-box">
                        <ChangeImageBtn {...editUserProfileProps}/>
                    </div>
                </div>
            </div>   
        )
};

const EditProfilePicSmalScreen = MatchMediaHOC(EditProfilePicture, '(max-width:980px)')

export const NavBarTitle = props  => (
  <div className="navbar-title-box">
   <b className="navbar-title">Edit Profile</b>  
  </div>    
)



export const EditContents = props  => (
  <div className="navbar-title-box">
   <b className="navbar-title">Edit Profile</b>  
   <ModalCloseBtn/>
  </div>    
)




export class DropImage extends React.Component {
    isMounted = false;
 
   constructor(props) {
      super(props);
      this.state = {
           file: '',
           imagePreviewUrl : '',
           submitting      : false,
           error           : null,
           failed          : false,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        this.isMounted = true;
        this.onImageDropUpdate();
        console.log(this.props)
    }
    

    onImageDropUpdate = () =>{
 
        const onStoreChange = () => {
            if(!this.isMounted)  return;

            let storeUpdate          = store.getState();
            let {currentUser, obj}   = this.state; 
            let {entities}           = storeUpdate
            let {userProfile,modal }        = entities
            let {byId}               = this.props;

            let dropImageModal = modal['dropImage'];
            userProfile        = userProfile[byId];

            if (dropImageModal) {
                let isSubimiting  =   checkType.isBoolean(dropImageModal.submitting)
                isSubimiting && this.setState({submitting : dropImageModal.submitting});

                dropImageModal.error && this._HandleErrorUpdate(dropImageModal);
            }
            
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    _HandleErrorUpdate(data){
        if (data && data.error) {
            
            let error = data.error
            this.setState({ failed : true, error });
            setTimeout(()=> {
                this.setState({failed : false}); 
            }, 5000);

            delete data.error
        }
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };
  
    
    handleChange(event) {
        event.preventDefault();
        var reader = new FileReader();
        var file = event.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        };

        reader.readAsDataURL(file);
  
    };

    handleImageAdd = (params)=>{
        let file = this.state.file;
        
        let formData = helper.createFormData({'profile_picture': file});
        let submitProps = {
               formData,
               isModal    : true,
               modalName : 'dropImage',
            };

        submitProps = {...this.props, ...submitProps};
        store.dispatch(handleSubmit(submitProps));
       

    };

    cancelImagePreview =()=>{
        this.setState({imagePreviewUrl:undefined, file:''})

    };


    getProps() {
   
        return {
            ...this.props,
            file         : this.state.file,
            userProfile  : this.props.userProfile,
            isImageDrop  : true,
            ...this.state,
        };
    };

    render() {
        let props = this.getProps();
        let { imagePreviewUrl,
              submitting,
              error,
              failed } = props

        let submitButtonStyles = submitting?{opacity:'0.60'}:{};
    
        let fieldSetStyles = submitting? {opacity:'0.60'}:{};
       
        return (
            <div>
            <fieldset style={ fieldSetStyles} 
                      disabled={ submitting} >
                        
                <div className="upload-preview">
                  <div className="drop-image-btns">
                     <div className="dismiss-box">
                        <button  type="button" 
                              onClick={()=> window.history.back()}
                              className="image-drop-dismiss-btn btn-sm">

                            <span className="image-drop-dismiss-icon dismiss">&times;</span>
                        </button>
                     </div>

                     <div className="drop-image-spin-loader">
                        { submitting &&
                            <AjaxLoader/>
                        }

                        { failed &&
                            <ul className="drop-image-error">
                                <li>{error}</li>
                            </ul>
                        }
                        
                     </div>
                    
                        <div className="add-image-btn-box">
                        { imagePreviewUrl &&
                            <button  type="button" onClick={()=>this.handleImageAdd()}
                                  className="btn-sm image-add-btn">
                                Add
                            </button>
                        }
                        </div>
                    </div>

                   
                  { imagePreviewUrl?
                    <div className="image-preview-container">
                        <div className="image-preview-contents">
                            <div className="image-preview-box">
                                <img className="image-preview" alt="" src={imagePreviewUrl} />
                            </div>
                        </div>
                        <div className="cancel-image-btn-box">
                            <button  type="button" onClick={()=>this.cancelImagePreview()}
                                  className="btn-sm image-cancel-btn">
                                Cancel
                            </button>
                        </div>

                     </div>
                     :
                     <form className="image-form">
                        <label className="fileBox" id="fileContainer">
                           <input onChange={this.handleChange} type="file" accept="image/*" />
                              Click Here to Upload
                       </label>
                     </form>

                  }
               </div>
               </fieldset>
            </div>  
        );
    };
};


/*
         <div className="edit-img-container">
            <div className="item-title-box">
               <b className="item-title">Photo</b>
            </div>

            <div className="item-title-container">
               <div className="image-contain">
                    { userProfile && userProfile.profile.profile_picture?
                        <div className="edit-image-box">
                            <img alt="" className="edit-image" src={ userProfile.profile.profile_picture }/>
                        </div>
                        :
                        <div className="avatar-image-box">
                            <img alt="" src={require("../../images/user-avatar.png")} className="avatar-image"/> 
                        </div> 
                    }
                </div>
               
            </div>

         </div>   
*/

//const EditBtnSmallScreen = MatchMediaHOC(EditBtn, '(max-width: 500px)');
