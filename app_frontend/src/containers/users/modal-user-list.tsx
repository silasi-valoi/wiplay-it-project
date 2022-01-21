import React,{Component} from 'react';
import { withRouter } from "react-router";
import {handleSubmit, getUserList }  from "dispatch/index"
import { UserList } from "templates/profile";
import  AjaxLoader from "templates/ajax-loader";
import {store } from "store/index";
import {MobileModalNavBar, DesktopModalNavBar} from  "templates/draft-editor";
import { PageErrorComponent } from "templates/partials";
import Helper from 'utils/helpers';
import {handleModalScroll} from 'containers/modal/helpers';
import {history} from "App";
import Apis from 'utils/api';

const helper   = new Helper();

class UserListBox extends Component {
    public isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);
        this.state = {
            usersById         : `filteredUsers`,
            apiUrl            : '',
            modalTitle        : "Authors",
            modalIsOpen       : true,
            isReloading       : false,
            users             : undefined,
            onScroolStyles    : undefined,
        }
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    onUserListUpdate = () =>{
        if (!this.isMounted) return;
 
        const onStoreChange = () => {
            let storeUpdate  = store.getState();
            let { entities } = storeUpdate;
            let users:object = entities && entities['users'];
            let usersById  = this.state['usersById'];
                       
            let userList:object[] = users  && users[usersById]
            let error    = userList && userList['error']; 
            let isReloading = userList && userList['isLoading'];

            this.isMounted && this.setState({users, isReloading, error})
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };

  
    componentDidMount() {
        this.isMounted = true;
        this.onUserListUpdate();
                  
        let apiUrl:string = this.props['apiUrl'];
        let byId:string = this.props['byId'];
        let usersById:string  = this.state['usersById'];

        usersById  = byId   || usersById;
        apiUrl     = apiUrl || Apis.getUserListApi();

        this.setState({usersById, apiUrl})
        
        store.dispatch<any>(getUserList({usersById, apiUrl}))
                                
    }

    editfollowersOrUpVoters = (params) =>{
        let { objName, obj } = params;

        var followers      = obj.followers || obj.profile && obj.profile.followers;
        params['formData'] = helper.createFormData({ followers });
        store.dispatch<any>(handleSubmit(params)); 
    }

    handleScroll=()=>{
        if (!this.isMounted) return;
              
        let isDesktopScreenSize = window.matchMedia("(min-width: 980px)").matches;
        let overlay:HTMLElement = document.getElementById('modal-overlay');
        let overlaySize:number;

        if (isDesktopScreenSize) {
            overlaySize = overlay.clientHeight - 150;
            this._SetScrooll(overlaySize);

        }else{
            let isAtBottom = handleModalScroll();
           
            if (isAtBottom) {
                overlaySize = overlay.clientHeight - 40;
                this._SetScrooll(overlaySize);

            }

        }
    };

    _SetScrooll=(overlay)=>{
        if (!this.isMounted) return
        let onScroolStyles = this.state['onScroolStyles'];
        
        if (!onScroolStyles) {
            onScroolStyles =  {height : overlay, overflowY:'scroll'};
            setTimeout(()=> {
                this.setState({onScroolStyles});
            }, 1000);
        }

    }

    redirectToUserProfile(params){
        let path = params && params.path;
        let state = params && params.state;

        if (path) {
            window.history.back()
            setTimeout(()=>  history.push(path, state), 500)
        }
    };

    reLoader =()=>{
        let apiUrl = this.state['apiUrl'];
        let usersById:string = this.state['usersById']; 
        this.isMounted && this.setState({isReloading : true})
        store.dispatch<any>(getUserList({usersById, apiUrl}))
    };
    
    getProps(){
        return {
            ...this.props,
            ...this.state,
            reLoader : this.reLoader.bind(this),
            redirectToUserProfile: this.redirectToUserProfile.bind(this),
            editfollowersOrUpVoters : this.editfollowersOrUpVoters.bind(this),
            handleScroll: this.handleScroll.bind(this),
        }
    };


    render() {
        if (!this.isMounted) return null;

        let props = this.getProps()
        let usersById:string = props['usersById'];
        let onScroolStyles = props['onScroolStyles'];
        let users:object = props['users'];

        users = users && users[usersById];
        onScroolStyles = onScroolStyles || {};
                       
        return (
            <div 
                id="users-modal-container"
                className="users-modal-container">
                <UserListModalNavBar {...props}/>
                {users &&
                    <div>
                        { users['isLoading'] &&
                            <div className="page-spin-loader-box">
                                <AjaxLoader/>
                            </div>

                            ||
                            
                            <div onScroll={props.handleScroll()}
                                style={onScroolStyles} 
                                className="user-list-container"
                                id="user-list-container"
                                >
                                { users['userList'] &&
                                    <UserList {...props}/>
                                }

                                { users['error'] &&
                                    <PageErrorComponent {...props}/>
                                }

                            </div>
                            
                        }
                    </div>
                }
            </div>
        );
   };
};



export default UserListBox;




const UserListModalNavBar = (props)=> {
    
    let { usersById, users, obj, modalTitle } = props

    users = usersById && users && users[usersById];
    console.log(users)

    let usersLength = users && users.userList && users.userList.length;

    let isFollowers = obj && obj.hasOwnProperty('followers');
    let isUpVoters  = obj && obj.hasOwnProperty('upvotes');

    let getModalTitle =()=>{
        let modalTitle;
        if (!usersLength) return '';
       
        if (isFollowers) {
            modalTitle = usersLength > 1 && `${usersLength || ''} Followers` ||
                                            `${usersLength || ''} Follower`;
            return modalTitle;

        }else if(isUpVoters){
            modalTitle = usersLength > 1 && `${usersLength || ''} Upvoters` ||
                                        `${usersLength} Upvoter`;
            return modalTitle;

        }else{
            return `Who to follow`;
        }
       
    }

    modalTitle  =  getModalTitle() || modalTitle || null;
    let navBarProps = {...props, modalTitle};

    if (window.matchMedia("(min-width: 900px)").matches) {
            return DesktopModalNavBar(navBarProps);
        } else {
            return MobileModalNavBar(navBarProps);
    } 
    
};
