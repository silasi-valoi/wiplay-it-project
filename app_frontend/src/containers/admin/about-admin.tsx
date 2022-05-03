import React, { Component } from 'react';
import {store } from "store/index";
import { OpenEditorBtn  } from "templates/buttons";
import {pageMediaBlockRenderer} from 'templates/draft-editor';
import {Editor} from 'draft-js';
import {Apis} from 'api';
import {UPDATE_ABOUT, CREATE_ABOUT} from 'actions/types';
import { convertFromRaw } from 'utils';
import  MainAppHoc from "containers/main/index-hoc";

class AboutAdminPage extends Component {
    public isFullyMounted:boolean = false;
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
        if(!this.isMounted){
            return null;
        }
        
        let props = this.getProps();
  
        
                    
        return (
            <div style={{paddingTop:'65px'}} className="about-admin-page">
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

    let createAboutProps = EditAboutProps();
       
    return(
        <div className="about-admin-contents" id="about-admin-contents">
            <div className="">
                <OpenEditorBtn {...createAboutProps}/>
            </div>

            {about && about.length && about.map( (about, index)=>{
                
                let editAboutProps = EditAboutProps(about);
              
                let editorState = convertFromRaw(about.about_text)
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
                                onChange={()=> void {}}
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


