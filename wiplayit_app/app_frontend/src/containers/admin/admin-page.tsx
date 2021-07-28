import React, { Component } from 'react';
import  * as action  from "actions/actionCreators";
import { Link } from "react-router-dom";
import {store } from "store/index";

import {PageErrorComponent} from "templates/partials";

import {getAdmin}  from "dispatch/index"
import{history} from 'App';
import  AjaxLoader from "templates/ajax-loader";
import GetTimeStamp from 'utils/timeStamp';

import  MainAppHoc from "containers/main/index-hoc";




class AdminPage extends Component {
    public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);

        this.state = {
            isAdminPage  : true,
            pageName     : "Admin",
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
            let index:object = entities && entities['index'];
                   
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
        console.log(this.props) 
        let isAdmin:boolean = this.props['isAdmin'];

        if (isAdmin !== true) {
            //User is not authenticated,so redirect to authentication page.
           // this.props['history'].push('/user/registration/')
            return;
        }

        store.dispatch<any>(getAdmin())    
    };
   

   
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
        let entities   = props['entities'] ;
                      
        return (
            <div style={{paddingTop:'65px'}} className="admin-page" id="admin-page">
                <div className="admin-container-box">
                    <AdminComponent {...props}/>
                </div>
            </div>
        );
    };
};





export default  MainAppHoc(AdminPage);


export const AdminComponent = props => {
    
    return(
        <div className="admin-contents" id="admin-contents">
            <div className="">
                <p className="admin-item-title">
                    About
                </p>
                <button type="button" 
                        className="editor-admin-btn "
                        onClick={()=> props.history.push('/app/admin/about/') }> 
                    Change
                </button>
            </div>

        </div>
    )

}


