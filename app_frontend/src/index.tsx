import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router}  from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'css/page-not-found.css';
import 'css/admin/admin.css';
import 'css/admin/about-admin.css';
import 'draft-js/dist/Draft.css';
import 'css/draft-editor/app-editor.css';
import 'css/App.css';
import 'css/index.css';
import 'css/home.css';
import 'css/nav-bar/index.css';
import 'css/nav-bar/nav-bar-mobile.css';
import 'css/nav-bar/nav-bar-desktop.css'
import "css/mobile-question-page.css";
import "css/desktop-question-page.css";

import "css/main-sm-screen.css";
import "css/profile/profile-edit.css";
import "css/profile/user-list.css";
import "css/profile/index-user-list.css";
import "css/feedback.css";
import "css/settings.css";
import "css/notifications.css";
import "css/bookmarks.css";
import "css/about.css";
import "css/message-form.css";
import "css/profile/index.css";
import "css/profile/user-profile-mobile.css";
import "css/profile/user-profile-desktop.css"

import 'css/authentication/index.css';
import 'css/authentication/registration-mobile.css';
import 'css/authentication/registration-desktop.css';

import * as serviceWorker from 'utils/serviceWorker';
import App, {history} from './App';
import {store} from "store/index";

const _App =()=> (
	<Provider store={store}>
        <Router history={history}>
            <App/>
        </Router>
    </Provider>
) 

ReactDOM.render(<_App/>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();



