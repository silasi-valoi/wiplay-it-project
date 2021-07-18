import React from 'react';
import {Switch, Route,} from "react-router-dom";
import { createBrowserHistory } from 'history';
import HomePage from "containers/main/home-page";

import AdminPage from 'containers/admin/admin-page';
import AboutAdminPage from 'containers/admin/about-admin';
import AuthenticationPage  from "containers/authentication/index";

import PasswordChangeSmsCodePage from 'containers/authentication/password-sms-code-confirm';
import PasswordChangePage from 'containers/authentication/password-change';
import {AccountEmailConfirmationPage} from "containers/authentication/account-confirmation"

import EditProfileRouter from "containers/main/edit-profile";

import PostListPage from "containers/main/post-list"
import PostPage    from "containers/main/post-page"
import QuestionPage    from "containers/main/question-page"
import QuestionListPage from "containers/main/question-list"
import AnswerContainer  from "containers/main/answer-page";
import UserProfileContainer from "containers/main/profile-page";
import FeedBackContainer  from 'containers/main/feed-back';
import ContactAdminContainer  from 'containers/main/contact-admin';
import AboutContainer  from 'containers/main/about';
import PrivacyContainer  from 'containers/main/privacy';
import HelpContainer  from 'containers/main/help';
import SettingsContainer  from 'containers/main/settings';
import NotificationsContainer from 'containers/main/notifications';
import BookmarkContainer from 'containers/main/bookmarks';

import ReportContainer from 'containers/main/report';
import NotFoundPage from 'containers/main/page-not-found';
import {store} from "store/index";


export const history = createBrowserHistory();
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

console.log('Is Production :',isProduction)
console.log('isDevelopment :', isDevelopment)
console.log(process.env.NODE_ENV)

function App() {
        
    return (
        <div>
            <Switch>
                <Route exact path="/" component={HomePage}/>
                <Route path="/profile/:id/:slug/" component={UserProfileContainer}/>
                <Route path="/question/:slug/:id/" component={QuestionPage}/>
                <Route path="/user/registration/" component={AuthenticationPage}/>
                <Route path="/registration/account/confirm/:key/" component={AccountEmailConfirmationPage}/>
                <Route path="/reset/:uid/:token/" component={PasswordChangePage}/>
                <Route path="/password/change/" component={PasswordChangeSmsCodePage}/>

                <Route path="/posts/" component={PostListPage}/>
                <Route path="/answer/:id/" component={AnswerContainer}/>
                <Route path="/questions/" component={QuestionListPage}/>
                <Route path="/post/:slug/:id/" component={PostPage}/>
                <Route path="/edit/profile/:slug/:id/" component={EditProfileRouter}/>
            
                <Route path="/:slug/answer/" component={QuestionPage}/>
                <Route path="/feedback/" component={FeedBackContainer}/>
                <Route path="/about/" component={AboutContainer}/>
                <Route path="/privacy/" component={PrivacyContainer}/>
                <Route path="/help/" component={HelpContainer}/>
                <Route path="/contact/us/" component={ContactAdminContainer}/>
                <Route path="/settings/" component={SettingsContainer}/>  
                <Route path="/notifications/" component={NotificationsContainer}/>  
                <Route path="/bookmarks/" component={BookmarkContainer}/>     
                <Route path="/bug/report/" component={ReportContainer}/>
                <Route exact path="/app/admin/"  component={AdminPage}/>
                <Route path="/app/admin/about/" component={AboutAdminPage}/>
                <Route path="*" component={NotFoundPage}/>   
            </Switch>
        </div>
    );
}

export default App;




