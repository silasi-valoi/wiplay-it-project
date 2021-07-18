import React, { Component } from 'react';
import  * as action  from "actions/actionCreators";
import { Link } from "react-router-dom";
import {store } from "store/index";
import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";
import { OpenEditorBtn  } from "templates/buttons";
import {pageMediaBlockRenderer} from 'templates/draft-editor';
import {Editor} from 'draft-js';
import * as checkType from 'helpers/check-types'; 
import { UnconfirmedUserWarning,
         PageErrorComponent, } from "templates/partials";
import Apis from 'utils/api';
import {UPDATE_ABOUT, CREATE_ABOUT} from 'actions/types';
import {getAdmin}  from "dispatch/index"
import Helper from 'utils/helpers';
import  AjaxLoader from "templates/ajax-loader";
import GetTimeStamp from 'utils/timeStamp';

import  MainAppHoc from "containers/main/index-hoc";

const helper   = new Helper();

class AboutAdminPage extends Component {
    public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);

        this.state = {
            isAdminPage  : true,
            pageName     : "About Admin",
            about        : undefined, 
            isReloading  : false,


        } 
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
   

    // static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    //  return  dispatch => action.handleError(error);
    // }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        //console.log(error, info);
    }

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    onIndexUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate   = store.getState();
            let {entities }   = storeUpdate;
            let index:object  =  entities['index'];
                              
            index && this.setState({isReloading : index['isLoading']})  

            if (index && index['isSuccess']) {
                index['isSuccess'] = false;
             
                //this.updateIndexEntities(index);
               
            }
          
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
    
    componentDidMount() {
        this.isMounted = true;
        this.onIndexUpdate();
        this.getAboutData()
               
    };

    getAboutData(){
        let cacheEntities = this.props['cacheEntities'];
               
        if (cacheEntities){
            let {about} = cacheEntities;
            about && this.setState({about})
        }

    }

    getProps(){
        return {
            ...this.props,
            ...this.state,
        };
    };

      
    render() {
        let props = this.getProps();
  
        let entities  = props['entities'] ;
        
                    
        return (
            <div style={{paddingTop:'65px'}} className="about-admin-page">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props}/>

                <div className="about-admin-box">
                    <AboutAdminComponent {...props}/>
                </div>
            </div>
        );
    };
};





export default  MainAppHoc(AboutAdminPage);


export const AboutAdminComponent = props => {

    let about = props.about;
    about = about && about.info;

    const EditAboutProps =(obj?:object):object=>{
        let isPut    = obj && true || false;
        let isPost   = !obj && true || false;

        let apiUrl:string = isPost && Apis.createAboutApi()
                            || isPut && Apis.updateAboutApi(obj['id']);

        let actionType:object = isPost && CREATE_ABOUT || isPost && UPDATE_ABOUT;

        return {
            isPost,
            isPut,
            obj,
            apiUrl,
            actionType,
            withTextArea : true,
            objName      : 'About',
            isAuthenticated :  props.isAuthenticated,
            className    : "edit-about-admin-btn btn-sm",
        };
        
    };

    console.log(props ,about)
    let createAboutProps = EditAboutProps();
    console.log(createAboutProps)
    
    
    return(
        <div className="about-admin-contents" id="about-admin-contents">
            <div className="">
                <OpenEditorBtn {...createAboutProps}/>
            </div>

            {about && about.length && about.map( (about, index)=>{
                
                let editAboutProps = EditAboutProps(about);
              
                let editorState = helper.convertFromRaw(about.about_text)
                if (!editorState) return null;

                return(
                    <div key={index}>
                        <OpenEditorBtn {...editAboutProps}/>
                        <ul className="about-info-title-box">
                            <li className="about-info-title">
                                {about.about_title}
                            </li>
                        </ul>

                        <div className="about-info-box">
                            <Editor
                                blockRendererFn={pageMediaBlockRenderer}
                                editorState={editorState} 
                                readOnly={true} 
                            />
                        </div>
                       <div>
                       </div>
                    </div>
                )
            })}
        </div>
    )

}


