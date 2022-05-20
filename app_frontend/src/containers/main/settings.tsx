
import React, {Component} from 'react';

import GetTimeStamp from 'timeStamp';
import {store} from 'store/index';
import { updateAuthForm } from 'containers/authentication/utils';
import MainAppHoc from 'containers/main/index-hoc';
import {Modal} from 'containers/modal/modal-container';
import {getCurrentUserSuccess, authenticationSuccess} from 'actions/actionCreators';
import {SettingsTemplate} from 'templates/settings';
import { displaySuccessMessage, getDataFromCache } from 'utils';
import { removeUserEmail } from 'dispatch';

import {authenticationProps} from 'templates/navigations/utils';

import {formIsValid,
        authSubmit,
        getAuthUrl,
        getFormFields} from 'containers/authentication/utils'; 

class  SettingsContainer extends Component  {
    private isFullyMounted:boolean = false;
    private unsubscribe;

    constructor(props) {
        super(props);
        this.state = { 
            pageName   : "Settings",
            formName   : '',
            submitting : false,
            onPasswordChangeForm : false,
            onAddEmailForm : false,
            onAddPhoneNumberForm : false,
            phoneNumberOrEmailAdded : false,
            successMessage   : undefined,
            authForm : {},
        };       
    };

    static pageName(){
        return "Settings"
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    };
 

    componentDidMount() {
        this.isMounted = true
        this.onSettingsStoreUpdate();
        let authForm:object = this.props['entities'].authForm;

        this.setState({authForm})
        
        if(!this.props['isAuthenticated']){
            setTimeout(() => { Modal(authenticationProps) }, 1000);
        }
    };

    componentWillUnmount =()=> {
        this.isMounted = false;
        this.unsubscribe();
    };

    onSettingsStoreUpdate =()=> {
        if (!this.isMounted) return;

        const onStoreChange = () => {
            let  storeUpdate = store.getState(); 
            let {entities}   =  storeUpdate;
            let userAuth:object = entities['userAuth'];
            let authForm:object = entities['authForm'];
                   
            let formName:string = authForm['formName'];
            let form = authForm['form'];

            if (userAuth['error']) {
                
                form[formName]['error'] = userAuth['error'];
                authForm['form'] = form;
                console.log(authForm)
                
                delete userAuth['error'];
            }

            authForm['submitting'] = userAuth['isLoading'];

            this.setState({authForm});
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };

  
    toggleForm = (formName:string, options?:object) => {
        if(!this.props['isAuthenticated']){
            return setTimeout(() => { Modal(authenticationProps) }, 200);
        }

        let form:object;
        let _options:object;
          
        if(formName === 'addPhoneNumberForm'){
            _options = {onAddPhoneNumberForm:true};
            form = getFormFields()['phoneNumberForm'];

        }else if(formName === 'addEmailForm'){
            _options = {onAddEmailForm:true};
            form = getFormFields()['emailForm'];

        }

        updateAuthForm(this, form, formName, _options); 
    };

    togglePasswordChangeForm = (oldPassword:string) => {

        if (!oldPassword) {
            oldPassword = this.getOldPassword();
            if(!oldPassword) return this.openPasswordConfirmationModal();
        }

        let formName:string = 'passwordChangeForm';
        let _options:object = {
            onPasswordChangeForm : true,
            passwordChanged : false
        };
        
        let form = getFormFields()['passwordChangeForm'];
                
        form['old_password'] = oldPassword; 
        updateAuthForm(this, form, formName, _options); 
        
    };
    
    getOldPassword = () :string => {
        
        let userAuth:object = getDataFromCache('userAuth')
        
        if (userAuth && userAuth['passwordConfirmAuth']) {
            
            let passwordConfirmAuth = userAuth['passwordConfirmAuth'];
            let passwordExpired:boolean = this.passwordConfirmExpired(passwordConfirmAuth);
                        
            if (passwordExpired) {
                return '';
            }

            let { old_password, passwordValidated } = passwordConfirmAuth;
            
            if (old_password && passwordValidated) {
                return old_password;
            }
        }
        return ''
    };

    passwordConfirmExpired=(passwordConfirmAuth:object)=>{
        let timeStamp = passwordConfirmAuth['timeStamp'];
        timeStamp = new GetTimeStamp({timeStamp});

        if (timeStamp) {
            return timeStamp.menutes() >= 10;
        }

        return true;
    };
   
    openPasswordConfirmationModal = () => {
        
        let modalProps = {
            ...authenticationProps,
            authenticationType : 'passwordConfirmationForm',
            togglePasswordChangeForm : this.togglePasswordChangeForm.bind(this),
            currentUser : this.props['currentUser'],
        }; 
        
        Modal(modalProps);
    };

    onChange = (event:React.ChangeEvent<HTMLInputElement>, formName:string) => {
        event && event.preventDefault();
        
        try {
            this.updateFormChanges(event, formName);
            
        } catch (error) {
            throw new TypeError(`Form ${formName} doesn't exist.`);
        }
    };

    updateFormChanges = (event: React.ChangeEvent<HTMLInputElement>, formName:string) => {
        let { form } = this.state['authForm'];
        form = form[formName];       
        let name:string = event.target['name'];
        let data:string = event.target['value'];

        form[name] = data;
        let opts:object;
        if (formName === 'addEmailForm') {
            opts = {onAddEmailForm:true}

        }else if(formName === 'passwordChangeForm'){
            opts = {onPasswordChangeForm:true}
        }

        updateAuthForm(this, form, formName, opts);
    };
    
    handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, formName: string) => {
        let authForm = this.state['authForm']
        if(authForm['submitting']) return
    
        event &&  event.preventDefault();
       
        if (formName === 'passwordChangeForm') {
            let oldPassword = this.getOldPassword();
            
            if (!oldPassword) {
                return this.openPasswordConfirmationModal();
                return
            }
        }
        
        let isAuthenticated = true;
        authSubmit(isAuthenticated, formName);
    };

    passwordConfirmed = () => {

    }

    handleCountry = (phoneNumber:string, phoneNumberInfo:object) => {
        let { form } = this.state['authForm'];
        let formName:string = 'addPhoneNumberForm';

        form =  form[formName]
       
        form['phone_number'] = phoneNumber; 
        form['country_code'] = phoneNumberInfo['countryCode'];
        form['country_name'] = phoneNumberInfo['name'];
        form['dial_code'] = phoneNumberInfo['dialCode'];
        form['format'] = phoneNumberInfo['format'];
       
        updateAuthForm(this, form, formName, {onAddPhoneNumberForm:true});

    }
    
    resetSuccessSubmitListers() : void {
        this.setState({phoneNumberOrEmailAdded:false, passwordChanged:false})
    };

    validateForm(form){
        return formIsValid(form);
    };

    removeEmail = (email:string, formName:string) => {
        let form = getFormFields()['emailForm'];
        form['email'] = email; 
        this.removeItems(form, formName, {onEmailRemove : true});
       
    };

    removePhoneNumber = (phone_number:string, formName:string) => {
        let form:object = {};
        console.log(phone_number)
        form['phone_number'] = phone_number; 
        this.removeItems(form, formName, {onPhoneNumberRemove : true});
       
    };

    removeItems = (form:object, formName:string, opts?:object) => {
        let authForm = this.state['authForm'];
        if(authForm['submitting']) return
               
        updateAuthForm(this, form, formName, opts); 

        setTimeout(() => {
            authSubmit(true, formName);
        }, 500);
    }

    sendConfirmationCode = (phoneNumber:object) => {
        
        let form:object = {}
        form['phone_number'] = phoneNumber['phone_number'];
        form['country_code'] = phoneNumber['country_code'];

        this.sendConfirmation(form, 'sendConfirmationCodeForm')
    }

    sendEmailConfirmation = (email:string) => {
        let form = getFormFields()['emailForm'];
        form['email'] = email;
        this.sendConfirmation(form, 'sendEmailConfirmationForm')
    };

    sendConfirmation(form:object, formName:string){
        let authForm = this.state['authForm'];
        if(authForm['submitting']) return
               
        updateAuthForm(this, form, formName); 
                
        setTimeout(() => {
            authSubmit(true, formName);
        }, 300);
        
    };

    reactBindings() : object{
        return{
            handleFormChange         : this.onChange.bind(this),
            togglePasswordChangeForm : this.togglePasswordChangeForm.bind(this),
            handleCountry            : this.handleCountry.bind(this),
            onSubmit                 : this.handleSubmit.bind(this),
            removePhoneNumber        : this.removePhoneNumber.bind(this),
            removeEmail              : this.removeEmail.bind(this), 
            sendConfirmationCode     : this.sendConfirmationCode.bind(this), 
            sendEmailConfirmation    : this. sendEmailConfirmation.bind(this),
            toggleForm               : this.toggleForm.bind(this),
            validateForm             : this.validateForm.bind(this),
        }
    };

    getProps() : object{
        return {
            ...this.reactBindings(),
            ...this.props,
            ...this.state,
        }
    };

    render(){
        let props = this.getProps();
                
        return(
            <div className="">
                <div className="settings-page">
                    <div className="settings-container">
                        <SettingsTemplate {...props}/>
                    </div>
                </div>
            </div>
        )
    };
};

export default MainAppHoc(SettingsContainer); 
