
import React, { Component } from 'react';
import {PartalNavigationBar,
        NavigationBarBottom,
        NavigationBarBigScreen} from "templates/navBar";
import  MainAppHoc from "containers/main/index-hoc";
import {store} from "store/index";
import {getAboutInfo} from "dispatch/index"
import {pageMediaBlockRenderer} from 'templates/draft-editor';
import {Editor} from 'draft-js';
import Helper from 'utils/helpers';

const helper = new Helper();


class  AboutContainer extends Component  {
    public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);
        this.state = { 
            pageName : "About", 
        };       
    }
    
    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 
    onAboutInfoUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate = store.getState();
            let {entities} = storeUpdate;
            let about     = entities['about'];
            this.setState({about})
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    componentDidMount() {
        this.isMounted = true;
        this.onAboutInfoUpdate()
        store.dispatch<any>(getAboutInfo())
    }

    render(){
        let props = {...this.props, ...this.state}
        let isAuthenticated = props['isAuthenticated'];

        return(
            <div className="app-box-container">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props}/>
                {isAuthenticated &&
                    <NavigationBarBottom {...props}/> 
                }
                <div className="about-page">
                    <AboutComponent {...props}/>
                </div>
            </div>
        )
    }
};

export default MainAppHoc(AboutContainer); 


export const AboutComponent = props => {
    let about = props.about;
    about = about && about.info;
    
    return(
        <div className="about-container">
            {about && about.map( (about, index)=>{
                let editorState = helper.convertFromRaw(about.about_text)
                return(
                    <div key={index} className="about-contents">
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
};

