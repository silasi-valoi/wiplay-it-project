
import React, {Component} from 'react';

import GetTimeStamp from 'utils/timeStamp';
import Api from 'utils/api';
import {store} from 'store/index';
import MainAppHoc from 'containers/main/index-hoc';
import {Modal} from 'containers/modal/modal-container';
import {getCurrentUserSuccess, authenticationSuccess} from 'actions/actionCreators';
import {SettingsTemplate} from 'templates/settings';
import { displaySuccessMessage, displayErrorMessage } from 'utils/helpers';
import {formIsValid,
        validateEmail,
        authSubmit,
        changeForm,
        getFormFields,
        setForm,} from 'containers/authentication/utils';   
import {PartalNavigationBar,
        NavigationBarBottom,
        NavigationBarBigScreen} from 'templates/navBar';


class  SettingsContainer extends Component  {
    private isFullyMounted:boolean = false;
    private subscribe;
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
            form : undefined,
        };       
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 

    componentDidMount() {
        this.isMounted = true
        this.onSettingsStoreUpdate()
     
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
            let formName:string = this.state['formName'];
            this.setState({submitting : entities['isLoading']}); 

            if (userAuth['error'] && formName) {
                let form:object = this.state['form'];
                
                form[formName]['error'] = userAuth['error'];
                this.setState({form});
                delete userAuth['error'];
            }

            this.handlePhoneNumberAddSuccess(entities['phoneNumberOrEmailAuth']);
                 
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };


    handlePhoneNumberAddSuccess(phoneNumberOrEmailAuth){
        if (!phoneNumberOrEmailAuth) return;

        let phoneNumberOrEmailAdded = this.state['phoneNumberOrEmailAdded'];
        let currentUser = this.props['currentUser'];

        if (!phoneNumberOrEmailAdded) {
            let successMessage = 'Your new phone number has been added successfully.'
            displaySuccessMessage(this, successMessage)
            
            let {phone_numbers,
                 email_address} =  phoneNumberOrEmailAuth || {};
            
            if (phone_numbers?.length ) {
                currentUser = {...currentUser, phone_numbers};

            }else if (email_address?.length) {
                currentUser = {...currentUser, email_address};
            }
                   
            this.setState({phoneNumberOrEmailAdded:true});
            store.dispatch<any>(getCurrentUserSuccess(currentUser));
        }
    };
    
    cachePassword(passswordParams={}) {
        let timeStamp = new Date();
        
        let passwordConfirmAuth = {
                timeStamp   : timeStamp.getTime(),
                passwordValidated : true,
                ...passswordParams,
        };
        store.dispatch<any>(authenticationSuccess({passwordConfirmAuth}));
    }; 

    togglePasswordChangeForm=(params)=>{
        let formName = 'passwordChangeForm';

        let old_password = params?.old_password;
        let fromCache    = this.getOldPassword();
        if (old_password) {
            this.cachePassword(params);
        }
                    
        if (!old_password && !fromCache) {
                return this.openPasswordConfirmationModal();
                
        }else{
            
            let formFields = getFormFields();
            let form = formFields.passwordChangeForm;
            let onPasswordChangeForm = true;
            let passwordChanged      = false
            this.setState({onPasswordChangeForm, passwordChanged})
            return this._SetForm(form, formName, {old_password})
        }
    }

    togglePhoneNumberForm =()=> {
        let formFields = getFormFields();
        let form = formFields.phoneNumberForm;
        let onAddPhoneNumberForm = true
        this.setState({onAddPhoneNumberForm})
        this._SetForm(form, 'addPhoneNumberForm')
    }

    toggleEmailForm =()=> {
        let formFields = getFormFields();
        let form = formFields.emailForm;
        let onAddEmailForm = true
        this.setState({onAddEmailForm})
        this._SetForm(form, 'addEmailForm');
    }

    _SetForm=(form={}, formName='', formOpts={})=>{
        let currentForm = this.state['form'];
                 
        form = {...form, ...formOpts};
        form = setForm(form, currentForm, formName);

        this.setState({form, formName});
    }

    passwordConfirmExpired=(passwordConfirmAuth={})=>{
        let timeStamp = passwordConfirmAuth['timeStamp'];
        timeStamp = new GetTimeStamp({timeStamp});

        if (timeStamp) {
            return timeStamp.menutes() >= 30;
        }

        return true;
    }

    getOldPassword =()=> {
        let cacheEntities = this.props['cacheEntities'];
        let userAuth:object = cacheEntities['userAuth'];
        
        if (userAuth && userAuth['passwordConfirmAuth']) {
            let passwordConfirmAuth = userAuth['passwordConfirmAuth'];
            let passwordExpired:boolean = this.passwordConfirmExpired(passwordConfirmAuth);
        
            if (passwordExpired) {
                return undefined;
            }

            let {old_password, passwordValidated} = passwordConfirmAuth;
            if (old_password && passwordValidated) {
                return old_password;
            }
        }
        return undefined;
    }
   
    openPasswordConfirmationModal =()=> {
        let currentUser = this.props['currentUser'];
        let modalProps = {
            togglePasswordChangeForm: this.togglePasswordChangeForm.bind(this),
            currentUser,
            modalName : 'passwordConfirmation',
            authenticationType : 'passwordConfirmation',
        }; 

        Modal(modalProps)
    }

    onChange(event, formName:string) {
        event.preventDefault();
        formName && this.setState({formName})
        
        changeForm(this, event);
    };

    handleSubmit=(event, formName)=>{
        event.preventDefault();
        formName && this.setState({formName});
        this.resetSuccessSubmitListers();

        if (formName === 'passwordChangeForm') {
            return this.submitPasswordChange(formName)
        }

        let useToken = true;
        authSubmit(this, formName, useToken);
    }

    submitPasswordChange =(formName:string):void =>{
        let {userAuth} = this.props['entities'];
        let passwordChanged = this.props['passwordChanged'];
        let passwordConfirmAuth = userAuth['passwordConfirmAuth'];
                       
        if (passwordConfirmAuth) {
            let passwordValidated:boolean = passwordConfirmAuth.passwordValidated;

            if (!passwordValidated) {
                return this.openPasswordConfirmationModal();
            }
        }

        let useToken:boolean = true;
        authSubmit(this, formName, useToken);
    }

    resetSuccessSubmitListers():void{
        this.setState({phoneNumberOrEmailAdded:false, passwordChanged:false})
    }

    validateForm(form){
        return formIsValid(form)
    }

    removeEmail(email){

    };

    removePhoneNumber(phone_number){

    };

    sendConfirmation(value){
        let email = value;
        
    };

    reactBindings():object{
        return{
            handleFormChange         : this.onChange.bind(this),
            onSubmit                 : this.handleSubmit.bind(this),
            removePhoneNumber        : this.removePhoneNumber.bind(this),
            removeEmail              : this.removeEmail.bind(this), 
            sendConfirmation         : this.sendConfirmation.bind(this), 
            toggleEmailForm          : this.toggleEmailForm.bind(this),
            togglePhoneNumberForm    : this.togglePhoneNumberForm.bind(this),
            togglePasswordChangeForm : this.togglePasswordChangeForm.bind(this),
            validateForm             : this.validateForm.bind(this),
        }
    }

    getProps():object{
        return{
            ...this.reactBindings(),
            ...this.props,
            ...this.state,
        }
    };

    render(){
        let props = this.getProps();
        
        return(
            <div className="">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <NavigationBarBottom {...props}/> 

                <div className="settings-page">
                    <div className="settings-container">
                        <SettingsTemplate {...props}/>
                    </div>
                </div>
            </div>
        )
    }
};

export default MainAppHoc(SettingsContainer); 
