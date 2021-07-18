import React, { Component } from 'react';
import {X} from 'react-feather'

import {NavBar} from 'templates/authentication/utils';
import AccountConfirmation from 'templates/authentication/confirmation';
import EmailForm, {SmsCodeForm}   from 'templates/authentication/email-form';
import {PasswordConfirmForm} from 'templates/authentication/password-change'
import { closeModals}   from  'containers/modal/helpers';
import { ModalCloseBtn } from "templates/buttons";
import { AlertComponent } from 'templates/partials';
import AuthenticationHoc from 'containers/authentication/auth-hoc'

import {authenticationSuccess} from 'actions/actionCreators';
import HomePage from "containers/main/home-page";

import { displaySuccessMessage, displayErrorMessage } from 'utils/helpers';

import {formIsValid,
        authSubmit,
        validatePhoneNumber,
        validateEmail,
        getFormFields,
        setForm,} from 'containers/authentication/utils';   

import {store} from "store/index";
//import Apis from 'utils/api';



export class PasswordConfirmationPage extends Component{
    public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);
        this.state = {
            formDescription   : ['Enter code to confirm your account'],
            currentUser       : undefined,
            oldPasswordConfirmed : false,
        };
    };

    public get _isMounted() {
        return this.isFullyMounted;
    }; 

    public set _isMounted(value:boolean) {
        this.isFullyMounted = value;
    }

    componentWillUnmount =()=> {
        this._isMounted = false;
        this.unsubscribe();
    };

    onReLoginStoreUpdate =()=> {
        if (!this._isMounted) return;

        const onStoreChange = () => {
            let  storeUpdate = store.getState(); 
            let {entities} =  storeUpdate;
            let userAuth = entities['userAuth'];

            if (userAuth) {
                this.handlePasswordConfirmSuccess(userAuth['loginAuth']); 
                this.handlePasswordRestSuccess(userAuth['passwordRestAuth']);
            }

        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    handlePasswordRestSuccess(passwordRestAuth){
        if (!passwordRestAuth) return;
        this.togglePasswordConfirmForm();
    };

    handlePasswordConfirmSuccess(loginAuth:object){
        if (!this._isMounted) return;
        
        let isLoggedIn = loginAuth && loginAuth['isLoggedIn'];
        let oldPasswordConfirmed:boolean = this.state['oldPasswordConfirmed']
                                                                             
        if(isLoggedIn && !oldPasswordConfirmed){
            this.setState({oldPasswordConfirmed:true});
            this.togglePasswordChangeForm();
            delete loginAuth['isLoggedIn']
        }
    };

    togglePasswordConfirmForm() : void {
        if (!this._isMounted) {
            return;
        }

        let currentUser = this.props['currentUser']
        this._SetForm('loginForm', {email:currentUser['email']})
       
        this.setState({currentUser,oldPasswordConfirmed:false});
    };

    togglePasswordChangeForm(){
        let form:object = this.props['form'];
        form = form && form['loginForm']
        let old_password = form && form['password'];

        if (old_password) {
            closeModals(true);
            const toggleForm:Function = this.props['togglePasswordChangeForm'];
            toggleForm({ old_password });            
        }
    };

    _SetForm(formName:string, params?:object){
        const _formConstructor = this.props['formConstructor']
        _formConstructor(formName, params);
    };
        
    
    componentDidMount() {
        this._isMounted = true;
        this.onReLoginStoreUpdate();
        this.togglePasswordConfirmForm();
    };
    
    validateForm(form){
        return formIsValid(form)
    };

    passwordRest =()=> {
        let currentUser:object = this.props['currentUser'];
        let currentForm = this.state['form'];
        let email:string = currentUser &&  currentUser['email'];
        
        if (email) {
            this._SetForm('passwordResetForm', {email})
            this.sendPasswordRest();                        
        }

    };

    sendPasswordRest(){
        const _sendPasswordRest:Function = this.props['onSubmit'];

        setTimeout(()=> {
            _sendPasswordRest();
        }, 500);
       
    };

    getProps(){
        return{
            ...this.props,
            ...this.state,
            validateForm      : this.validateForm.bind(this),
            passwordRest      : this.passwordRest.bind(this),
        };
    };

    render(){
        let props = this.getProps();
        
        return(
            <div className="password-confirm-box">
                <div className="authentication-dismiss">
                    <ModalCloseBtn>
                        <X id="feather-x" size={20} color="red"/>
                    </ModalCloseBtn>
                </div>

                <PasswordConfirmForm {...props}/>
            </div>
        )

    };
};

export  default AuthenticationHoc(PasswordConfirmationPage);