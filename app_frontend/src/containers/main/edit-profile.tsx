import { MatchMediaHOC } from 'react-match-media';
import React, { Component } from 'react';

import TextareaAutosize from 'react-autosize-textarea';
import {handleModalScroll} from 'containers/modal/utils';
import { EditProfileNavBar } from 'templates/navigations/nav-bar-partial';
import {  ChangeImageBtn  } from 'templates/buttons';
import MainAppHoc from "containers/main/index-hoc";

import  * as types  from 'actions/types';
import  * as action  from 'actions/actionCreators';
import {store} from "store/index";
import {handleSubmit}  from "dispatch/index"
import { AlertComponent } from 'templates/partials';
import  AjaxLoader from 'templates/ajax-loader';
import {displaySuccessMessage, createFormData} from 'utils';
import {Apis} from 'api';


class EditProfileContainer extends Component{

    constructor(props) {
        super(props);
        this.state = {
        }
    }; 

    static pageName(){
        return 'Edit Profile'
    }

    render() {
        return (
            <div>
                <EditProfile {...this.props}/>
            </div>
        );
    };
};
 
export default MainAppHoc(EditProfileContainer);


export class EditProfile extends Component{
    public isFullyMounted:boolean = false;
    private unsubscribe;

    constructor(props) {
       super(props);
    
        this.state = {
            userProfile    :  undefined,
            submitting     : false,
            currentUser    : undefined, 
            displayMessage : false,

            form         : {
                first_name : "",
                last_name  : "",
                bio        : "",
                location   : "",
                profile_picture  : "", 
           },
        };
     
        this.handleChange   =  this.handleChange.bind(this);
    }; 

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 

    onProfileUpdate = () =>{
        if(!this.isMounted) return;

        const onStoreChange = () => {
            let byId = this.state['byId']

            let storeUpdate  = store.getState();
            let {entities }  = storeUpdate;
            let userProfile:object = entities['userProfile'];
                        
            userProfile = userProfile[byId];
            
            let modal:object = entities['modal'] 
              
            if (userProfile) {
                this.setState({submitting : userProfile['submitting']});

                let isEditorModal:boolean = this.checkModalIsOpen('editor');
                let isDropImageModal:boolean = this.checkModalIsOpen('dropImage');

                if (!isDropImageModal || !isEditorModal) {
                    this._HandleSuccessUpdate(userProfile)
                }

                this._SetUpdatedUser(userProfile)
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
    
    _SetUpdatedUser(userProfile:object){
        if (!userProfile || !userProfile['user']) {
            return
        }
       
        const user = userProfile['user'];
        this.isMounted && this.setState({userProfile : user});
        this.populateEditForm(user);
    };

    _HandleSuccessUpdate(userProfile){
        if (!userProfile) return;

        if (userProfile.updated === true) {
            delete userProfile.updated;

            let message = "You have successfuly updated your profile."
            
            displaySuccessMessage(this, message);
        }
    };

    _HandleErrorUpdate(){

    };

    displayMessage(message){
        if (!this.isMounted) return;
                  
        this.setState({ displayMessage : true, message });
        setTimeout(()=> {
           this.isMounted && this.setState({displayMessage : false}); 
        }, 5000);
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    componentDidMount() {
        this.isMounted = true
        this.onProfileUpdate();

        let location = this.props['location']; 
                        
        if (location) {
            let state:object =  location.state;
            let userProfile  = state && state['obj'];

            this.setState({...state, userProfile});
            this.populateEditForm(userProfile);
           
        }else{

            let userProfile = this.props['obj'];
            this.setState({...this.props, userProfile});
            this.populateEditForm(userProfile);
        }
        
    };
    
    populateEditForm(userProfile:object ){
        if (!userProfile) return;
        if (!Object.keys(userProfile).length) return;
        
        let form = this.state['form'];
            
        let first_name = userProfile['first_name']
        let last_name = userProfile['last_name']
        
        form = { 
            first_name, 
            last_name, 
            ...userProfile['profile'],
        };

        this.isMounted && this.setState({ form, userProfile });
    }

    handleChange(e){
      e.preventDefault()

      let form:object = this.state['form'];
      form[e.target.name] = e.target.value;
      this.isMounted && this.setState({form});
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
        };
    };
 
    textAreaProps() {
        return {
           value     : this.state['form'].favorite_quote,
           onChange  : this.handleChange,
           name      : "favorite_quote",
           className : "favorite_quote",
           placeholder:'Your favourite quote',
        };
    };


    submitProps():object {

        let form:object = this.state['form'];
        let editUserProfileProps = this.getUserEditProps()
        let formData = createFormData(form)

        return Object.assign(editUserProfileProps, {formData})
    };

    checkModalIsOpen(modalName){
        let storeUpdate  = store.getState();
        let {entities }  = storeUpdate;
        let modal     = entities['modal'];
        modal = modal[modalName]
        if (!modal) return false;

        return modal.modalIsOpen;
    };


    getUserEditProps():object{
        let isModal:boolean = this.checkModalIsOpen('editor');

        let modalName = isModal && 'editor' || undefined;
        let userProfile = this.state['userProfile']
        let apiUrl:string = userProfile && Apis.updateProfileApi(userProfile.id);
            
        return {
            apiUrl,
            actionType : types.UPDATE_USER_PROFILE,    
            objName     : 'UserProfile',
            isPut       : true,
            obj         : this.state['userProfile'], 
            currentUser : this.state['currentUser'],
            byId : this.state['byId'],
            modalName,
            isModal,
        }; 
    };

    handleScroll=()=>{
        let onScroolStyles    = this.state['onScroolStyles'];
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
        store.dispatch<any>(handleSubmit(params));
    };

    render() {
        if (!this.isMounted) return null;

        let props = this.getProps();
        let alertMessageStyles = props['displayMessage']?{ display : 'block'}:
                                                      { display : 'none' };
        var userProfile = props['userProfile']

      return (
        <div className="modal-editor"
             id="modal-editor"
             onScroll={props.handleScroll()}>

            <EditProfileNavBar {...props}/>
            <div style={props['onScroolStyles'] || {}}
                 id="editors-box" 
                 className="editors-box">
                { userProfile &&
                    <div>
                        <ProfileEditComponent {...props}/>
                    </div>
                }  
          
            </div>

            <div style={alertMessageStyles}>
                <AlertComponent {...props}/>
            </div>
                   
        </div>
      );
   };
};




const ProfileEditComponent = props => {
    
    let {submitting} = props;
        
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
                        <div className="">
                            <input
                                type="text" 
                                className="profile-name-input"
                                name="first_name"
                                value={props.form.first_name}
                                onChange={props.handleChange}
                            />
                            <span className="floating-label">Email Address</span>
                        </div>
                        
                        <div className="">
                            <input
                                type="text" 
                                className="profile-name-input"
                                name="last_name"
                                value={props.form.last_name}
                                onChange={props.handleChange}
                            />
                        </div>
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
                            name="location"
                            value={props.form.location}
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
                            name="bio"
                            value={props.form.bio}
                            onChange={props.handleChange}
                        />
                    </div>
                </div>
            </fieldset>
        </div>
    );
};


const EditProfilePicture = (props:object)=>{

        //console.log(props)
        let userProfile:object = props['userProfile'];
        let editUserProfileProps:object = props['editUserProfileProps'];
        let profile  = userProfile && userProfile['profile'];
        let linkName = `Edit`; 

        editUserProfileProps = {...editUserProfileProps, linkName}
           
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
                                <img alt="" 
                                     className="edit-image" 
                                     src={profile.profile_picture }/>
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

export const NavBarTitle = ()  => (
  <div className="navbar-title-box">
   <b className="navbar-title">Edit Profile</b>  
  </div>    
)


export class DropImage extends React.Component {
    private isFullyMounted:boolean = false;
    private unsubscribe;
 
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

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }

    componentDidMount(){
        this.isMounted = true;
        this.onImageDropUpdate();
    }
    

    onImageDropUpdate = () =>{
 
        const onStoreChange = () => {
            if(!this.isMounted)  return;

            let storeUpdate = store.getState();
            let {entities}  = storeUpdate;
            
            let modal = entities['modal'];

            let dropImageModal = modal['dropImage'];
            
            if (dropImageModal) {
                let submitting:boolean = dropImageModal['submitting'];
                this.setState({submitting});

                dropImageModal['error'] && this._HandleErrorUpdate(dropImageModal);

                let data:object = dropImageModal['data'];

                if (data && dropImageModal['isUpdating']) {
                   dropImageModal['isUpdating'] = false;
                   store.dispatch<any>(action.getCurrentUserSuccess(data['user']));

                }
            }
            
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    _HandleErrorUpdate(data:object){
        let error = data['error']
        if (!error) {
            return;
        }

        this.setState({failed : true, error });
       
        setTimeout(()=> {
            this.setState({failed : false}); 
        }, 5000);

        delete data['error']
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

    handleImageAdd = ()=>{
        let file = this.state['file'];
        
        let formData:object = createFormData({'profile_picture': file});
        let submitProps = {
               formData,
               isModal : true,
               modalName : 'dropImage',
               isImageDrop : true,
            };

        submitProps = {...this.props, ...submitProps};
        store.dispatch<any>(handleSubmit(submitProps));
       

    };

    cancelImagePreview =()=>{
        this.setState({imagePreviewUrl:undefined, file:''});
    };


    getProps() {
   
        return {
            ...this.props,
            file         : this.state['file'],
            userProfile  : this.props['userProfile'],
            isImageDrop  : true,
            ...this.state,
        };
    };

    render() {
        let props = this.getProps();
        let imagePreviewUrl = props['imagePreviewUrl'];
        let submitting = props['submitting'];
        let error = props['error'];
        let failed = props['failed'];

    
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
                                <img 
                                className="image-preview" 
                                alt="" 
                                src={imagePreviewUrl} />
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
                           <input 
                               onChange={this.handleChange}
                               type="file" accept="image/*" />
                              Click Here to Upload
                       </label>
                     </form>

                  }
               </div>
               </fieldset>
            </div>  
        )
    };
};

