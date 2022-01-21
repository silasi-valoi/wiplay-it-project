import React from 'react';
import { MatchMediaHOC } from 'react-match-media';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import  LoginForm from "templates/authentication/login";
import  SignUpForm  from "templates/authentication/signup";
import  EmailForm  from "templates/authentication/email-form";
import {LinkButton} from 'templates/buttons';
import {NonFieldErrors} from 'templates/authentication/errors';

import {SpinLoader, ToogleAuthFormBtn} from  'templates/authentication/utils'

let toggleEmailFormProps = {
        toggleBtnName:'Cancel',
        toggleFormProps:{
            value : false,
            formName:'passwordResetForm',
            defaultFormName : 'loginForm'
        }
    };

let toggleLoginFormProps = {
        toggleBtnName   :'Login',
        toggleFormProps : {
            formName :'loginForm',
            value    : true,
        }
    }

let toggleSignUpFormProps = {
        toggleBtnName  : 'Create new Account',
        toggleFormProps:{
            formName  : 'signUpForm',
            value : true,
        }
    }

const Registration = props => {
  
    return(
        <React.Fragment>
           <RegistrationBigScreen {...props}/>
           <RegistrationSmallScreen {...props}/>
        </React.Fragment> 
   );
}


export default Registration;


const RegistrationSmall = props => {
    let {authForm} = props;
    if(!authForm) return null;

    let {onLoginForm, onSignUpForm, onPasswordResetForm} = authForm;
        
    const AuthForm = ()=>{

        if(onSignUpForm){
            return <SignUpForm {...props}/>

        }else if(onPasswordResetForm){
            toggleEmailFormProps = {...toggleEmailFormProps, ...props }
   
            return  <div className="form-container">
                        <EmailForm {...props}>
                            <ToogleAuthFormBtn {...toggleEmailFormProps}/>
                        </EmailForm>
                    </div>
            
        }else if(onLoginForm){
            return <LoginForm {...props}/>
        }

        return null;
    };
    
    return(
        <div className="" >
            { AuthForm()}
            <DefaultSmallScreen {...props}/>
        </div>
    );
};


const DefaultSmallScreen = props => {
    toggleSignUpFormProps = {...props, ...toggleSignUpFormProps }   

    toggleLoginFormProps = {...props, ...toggleLoginFormProps};
    
    return(
        <div>
            <WelcomeTextComponent {...props}/>
            <SocialLogin {...props}/>
            <ul className="center auth-option-title">
                <li>Or</li>
            </ul>

            <div className="sign-or-login-btns">
                <div className="toggle-box">
                    <ul className="form-toggle-btns">
                        <li className="login-toggle">
                            <ToogleAuthFormBtn {...toggleLoginFormProps}/>
                        </li>
                        <li className="signup-toggle">
                           <ToogleAuthFormBtn {...toggleSignUpFormProps}/>
                        </li>
                    </ul>    
                </div> 
                <TermsAndContionTextComponent/>
            </div>
        </div>
       
    );
};


const RegistrationBig = props => {
    let {authForm} = props;
    if(!authForm) return null;

    let {onPasswordResetForm, onSignUpForm} = authForm;
    
    toggleSignUpFormProps = {...props, ...toggleSignUpFormProps};   

    toggleEmailFormProps = {...props, ...toggleEmailFormProps};

    return(
        <div className="registration-box">
            <WelcomeTextComponent {...props}/>
            <SocialLogin {...props}/>

            <ul className="center-item auth-option-title">
                <li>Or</li>
            </ul>

            <div className="registration-flex-box ">
                {onPasswordResetForm &&
                    <div className="password-reset-container">
                        <EmailForm {...props}>
                           <ToogleAuthFormBtn {...toggleEmailFormProps}/>
                        </EmailForm> 
                    </div>

                    ||

                    <div className="login-container" >
                        <LoginForm {...props}/>
                    </div>
                }

                <p className="separator"></p>
                <div className="signup-container">
                    {onSignUpForm?
                        <SignUpForm {...props}/>
                        :
                        <div className="signup-container-contents">
                            <div className="create-account-box"> 
                                <ToogleAuthFormBtn {...toggleSignUpFormProps}/>
                            </div>
                            <TermsAndContionTextComponent/>
                        </div>
                    }
                </div>
            </div>
        </div> 
    )

}


const TermsAndContionTextComponent = props => {
    let linkProps:object = {
        linkPath:"/privacy/"
    }

    return(
        <div className="terms-and-policy-box">
            <p className="terms-and-policy">
               By signing up you indicate that you read and agree 
               to wiplayit <LinkButton {...linkProps}>
                   <span>Terms and Conditions</span>
               </LinkButton> and <LinkButton {...linkProps}>
               <span>Privacy</span></LinkButton>
            </p>
              
        </div>
    )
};

const WelcomeTextComponent = props => {
    let linkProps:object = {
        linkPath:"/about/"
    }

    return(
        <ul className="registration-welcome-box">
            <h1 className="welcome-message">
              Welcome to Wiplayit, a  place for football lovers,
              Join in and share your opinion with other fellow football lovers. 
              <LinkButton {...linkProps}><span> More.</span></LinkButton> 
           </h1>
        </ul>
    )
}



const SocialLogin = props =>  {
    let {isSocialAuth, form} = props.authForm
    form = form && form.loginForm;
    let error = form && form.error; 

    return(
        <div className="social-login-container">
            {isSocialAuth && 
                <SpinLoader {...props}/>
            }

            { error && !isSocialAuth &&
                <NonFieldErrors {...error}/>
            }
    
            <div className="social-login">
                <div className="google-login-box">
                <GoogleLogin
                    clientId = "499495811255-0v3hjt4lena190or9euvdla2qi5f8qrk.apps.googleusercontent.com"
                    
                    onSuccess={props.responseGoogle}
                    onFailure={props.responseGoogle}
                    render={renderProps => (

                    <button  className='btn-openid google-login'
                    onClick={renderProps.onClick} 
                         disabled={renderProps.disabled}>
                         <span className="google-login-icon fa fa-google"></span>   
                        Login with Google 
                    </button>
               )}
         
            />
        </div>

           
   
        <div className="facebook-login-box">
          <FacebookLogin
            appId = "2482459181845798"
            callback={props.responseFacebook}
            render={renderProps => (
                <button className='facebook-login' onClick={renderProps.onClick}>
                <span className="facebook-login-icon fa fa-facebook"></span> 
                  Login with Facebook
                </button>
            )} 
          />

        </div>
      </div>
    </div>
  ); 

 }



export const  NavBar   = props => {
   
    return (
        <div className="navigation-bar fixed-top">
            <div className="navbar-box">
               <div className="navbar-title-box">
                   <p className="" >{props.navbarTitle}</p>
                </div>
            </div>
        </div>    
    );
};


export const RegistrationSmallScreen =
                MatchMediaHOC(RegistrationSmall, '(max-width: 980px)')

export const RegistrationBigScreen   = 
                MatchMediaHOC(RegistrationBig, '(min-width: 980px)')
