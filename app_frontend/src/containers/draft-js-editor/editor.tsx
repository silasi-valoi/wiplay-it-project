import React, { Component } from 'react';

import {AtomicBlockUtils,
         RichUtils,convertToRaw, Entity,
         EditorState} from 'draft-js'; 

import  {ModalSubmitPending}  from 'actions/actionCreators';

import {validateForm, convertFromRaw, createFormData} from 'utils';
import {DraftEditor,
        QuestionEditor,
        PostEditor,
        DesktopToolBar,
        MobileModalNavBar,
        DesktopModalNavBar } from  "templates/draft-editor";
import {insertLink, decorator} from '../draft-js-editor/plugins'
import {AlertComponent} from 'templates/partials';

import {store} from 'store/index';

import {Apis} from 'api';
import {handleSubmit, _GetApi }  from "dispatch/index"
import  * as action  from "actions/actionCreators";
  


export default  class AppEditor extends Component{
    private isFullyMounted:boolean = false;
    private subscribe;
    private unsubscribe;

    constructor(props) {
        super(props);
        
      
        this.state = {
            editorState        : EditorState.createEmpty(decorator),
            form               : {textarea   :  "", },
            showURLInput       : false,
            showImage          : false,
            url                : '',
            urlType            : '',
            urlValue           : '',
            italicOnClick      : false,
            boldOnClick        : false,
            onLinkInput        : false, 
            onPost             : false,
            contentIsEmpty     : true,
            submitting         : false,
            showSuccessMessage : false,
            hasErrors          : false,  
            errorMessage       : null,
            submited           : false,
            redirected         : false, 
            editorsBoxStyles   : undefined,
            onScroolStyles     : undefined,
            isDraftEditor      : true, 
            editorIsFocused    : false,
        };
    
        this.onChange          = this.onChange.bind(this);
        this.onTextAreaChange  = this.onTextAreaChange.bind(this);
        this.onURLChange       = this.onURLChange.bind(this);
        this.handleKeyCommand  = this.handleKeyCommand.bind(this);
        this.addBold           = this.addBold.bind(this);
        this.addItalic         = this.addItalic.bind(this);
        this.handleAddLink     = this.handleAddLink.bind(this); 
        this.promptLinkIpunt   = this.promptLinkIpunt.bind(this);
        this.submit            = this.submit.bind(this);
        this.handleFocus       = this.handleFocus.bind(this);
        this.handleBlur        = this.handleBlur.bind(this);      

    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        
        return 'not-handled';
    }

   

    onChange(editorState){
        this.setState({ editorState, });

        const contentState = editorState.getCurrentContent();
        let validatedForm = validateForm({editorContents : contentState})

        if (validatedForm['formIsValid']) {
            this.setState({contentIsEmpty : false,})
        }
        else {
           this.setState({contentIsEmpty : true,})

        }
    };

    onTextAreaChange(event) {
        event.preventDefault();
        let form = this.state['form'];
        form[event.target.name] = event.target.value;
        this.setState({form});

        let validatedForm = validateForm({form : this.state['form']})
        if (validatedForm['formIsValid']) {
            this.setState({contentIsEmpty : false,})
        }else {
           this.setState({contentIsEmpty : true,})
        }
    };
   
    submit = () => {
        let contentIsEmpty:boolean = this.state['contentIsEmpty'];
        this.setState({hasErrors : false, message:null});

        if (contentIsEmpty) {
            let message = {
                textMessage : 'You cannot submit empth form',
                messageType : 'error'
            }
            this._SetErrorMessage(message)

            return
        }

        let submitProps = this.getSubmitProps();
        store.dispatch<any>(ModalSubmitPending('editor'));
        store.dispatch<any>(handleSubmit(submitProps));

    };

    _SetErrorMessage(message){
        this.setState({ submitting : true, hasErrors : true, message, });

        setTimeout(()=> {
            this.setState({ submitting : false, hasErrors : false, message:null, });
        }, 5000);

    }

    onEditorUpdate = () =>{
 
        const onStoreChange = () => {
            if (this.isMounted) {
                let storeUpdate   = store.getState();
          
                let {entities} = storeUpdate
                let modal = entities['modal'];
                let errors = entities['errors']
                                                             
                if (modal && modal['editor']) {
                    modal = modal['editor']
                    this.setState({submitting : modal.submitting});

                    if (modal.error) {
                                     
                        let message = {
                            textMessage : modal.error,
                            messageType : 'error'
                        }

                        this._SetErrorMessage(message)
                        delete modal.error;   
                    }
                }
            }
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };

    componentWillUnmount() {
        this.isMounted = false;
        window.removeEventListener('resize', this.handleResize);
        this.unsubscribe();
    };

    addEventListeners(){
        let editorsBoxElem    = document.getElementById('editors-box');
        window.addEventListener('resize', this.handleResize)
    };
    
    componentDidUpdate(prevProps, nextProps) {
    
    }

    componentDidMount(){
        this.isMounted = true;
        this.onEditorUpdate();
        this.addEventListeners();
                
        let isPut:boolean = this.props['isPut'];
        let objName:string = this.props['objName'];
        let data:object = this.props['obj'];
                   
        if (isPut) {

            this.setState({contentIsEmpty:false})          
            if (objName === 'About') {
                this.updateDraftEditor(data['about_text']);
                this.updateTextAreaForm(data['about_title']);
            }

            if ( objName === 'Post') {
                this.updateDraftEditor(data['post']);
                this.updateTextAreaForm(data['title']);
            }

            if (objName === 'Question') {
                this.updateTextAreaForm(data['question']);
            }

            else if (objName === 'Answer') {
                this.updateDraftEditor(data['answer']);
            }

            else if (objName === 'Comment') {
                this.updateDraftEditor(data['comment'])
            }

            else if (objName === 'Reply') {
                this.updateDraftEditor(data['reply'])
            }
            
        }
    };

    updateDraftEditor(editorContents:string){
        const editorState = convertFromRaw(editorContents);

        setTimeout(()=> {
            this.setState({editorState});
            this.modifyEditorSize();
        }, 500);
        
    };

    updateTextAreaForm(value){
        let form = this.state['form'];
        let withTextArea = true;
        form['textarea']  = value; 
        this.setState({withTextArea, form})

    };

    blockStyleFn(contentBlock) {
       const type = contentBlock.getType();
       console.log(contentBlock) 
    };

    onURLChange(e) {
        e.preventDefault();
        this.handleFocus();

        let reader = new FileReader();
        let file = e.target.files[0];
        let name = e.target.name;
                             
        reader.onloadend = () => {
            this.saveFile(name, file)  
        };

        reader.readAsDataURL(file);
    };

    saveFile(name, file){
        let apiUrl   = Apis.createDraftEditorContentsApi();
        let form     = {'draft_editor_file': file}
        let fileForm = createFormData(form);

        let useToken=true
        const Api = _GetApi(useToken);   

        if (!Api) {
            return store.dispatch<any>(action.handleError());
        }
    
        Api.post(apiUrl, fileForm)
        .then(response => {
            let file = response.data.draft_editor_file
            this.addFile(name, file)
        })
        .catch(error => {
            if (error.request) {
                console.log(error.request)
            }else if(error.response){
                console.log(error.response)
            }
        });
    }

    addFile(name,file){
        let editorState = this.state['editorState'];
        const entityKey = Entity.create(name, 'IMMUTABLE', {src:file});
        editorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
        this.setState({editorState});
    }
   
    addBold(e){
        e.preventDefault();

        if (!this.state['editorIsFocused']) return;

        if (this.state['boldOnClick']) {
            this.setState({boldOnClick : false});
        }else{
            this.setState({boldOnClick : true});
        }

        this.toggleInlineStyle('BOLD');
    }     

    addItalic(e){
        e.preventDefault();
        if (!this.state['editorIsFocused']) return;

        if (this.state['italicOnClick']) {
            this.setState({italicOnClick:false})
        }else{
             this.setState({italicOnClick:true})
        }
        this.toggleInlineStyle('ITALIC'); 
    }
   
    toggleInlineStyle(style){
        this.onChange(RichUtils.toggleInlineStyle(this.state['editorState'], style));
    };
      
    promptLinkIpunt(e){
        e.preventDefault()
        this.setState({onLinkInput: true})
    };

    handleAddLink(linkUrl) {
        const editorState  = this.state['editorState'];
        let newEditorState;

        if (linkUrl) {
            let urlValue = linkUrl;
            let protocol = urlValue && urlValue.slice(0, 4)
                       
            let http  = 'http://';
            
            if (protocol !== http.slice(0, 4)) {
                urlValue = `${http}${urlValue}`

            }

            newEditorState = insertLink(editorState, { url: urlValue }, linkUrl)
            
        }

        newEditorState = newEditorState || editorState;
        this._handleChange(newEditorState)
    };

    _handleChange = (editorState) => {
        this.setState({editorState, onLinkInput:false});
    };

    getFormData = () =>{
        let objName = this.props['objName'];
        let form =  this.state['form'];
        const editorState = this.state['editorState'];

        let editorContents = editorState.getCurrentContent();
        let validatedForm  = validateForm({editorContents});
        let validForm = {};

        if (objName === "Question") {
            
            validatedForm =  validateForm({form});
            validForm =  {question: validatedForm['data']}; 
        }
        else if (objName === "Post") {
            let title = validateForm({form});
        
            validForm = {
                post  : validatedForm['data'],
                title : title['data'], 
            };
        }

        else if(objName === "Answer"){
            validForm = {answer : validatedForm['data']}; 

        }else if(objName === "Comment"){
            validForm = {comment : validatedForm['data']};  

        }
        else if(objName === "Reply"){
            validForm = {reply : validatedForm['data']};

        }
        else if(objName === "About"){
            let about_title =  validateForm({form});
            validForm = {
                about_text  : validatedForm['data'],
                about_title : about_title['data'],
            }; 
        }

        return createFormData(validForm);
    };

    getSubmitProps = () =>{
        return {
            formData : this.getFormData(),
            ...this.props, 
        };
    }


    getTextAreaProps() {
        let getPlaceHolder = ()=> {
            let editorPlaceHolder = this.props['editorPlaceHolder'];
            let objName = this.props['objName'];
                    
            if (objName === 'Post' || objName === 'About' ) {
               editorPlaceHolder = 'Title...'
            }
            return editorPlaceHolder;
        }

        return {
           value       : this.state['form']['textarea'],
           onChange    : this.onTextAreaChange,
           name        : "textarea",
           className   : "textarea-form-field",
           placeholder : getPlaceHolder(),
        };
    }

    handleFocus =()=> {
        
        this.setState({editorIsFocused : true, onFocus:true});
        this['editor'].focus();
    }

    handleBlur =()=> {
        //if (!this.matchSmallScreenMedia()) return;
        this.setState({editorIsFocused : false});
    }

    handleResize =(event)=> {
        let editorsBoxElem = document.getElementById('editors-box');
        
        if (editorsBoxElem) {
            let editorsBoxTop = editorsBoxElem.getBoundingClientRect().top;
            let clientHeight = window.innerHeight - editorsBoxTop - 20;
            this.setScrollHeight(clientHeight, true);
        }
    }
    
    modifyEditorSize =()=> {
        let editorsBoxElem = document.getElementById('editors-box');
        let overlay      = document.getElementById('modal-overlay');
                
        let editorsBoxTop = editorsBoxElem.getBoundingClientRect().top
        editorsBoxTop     = editorsBoxTop + editorsBoxTop;
        let editorHeight  = overlay.clientHeight - editorsBoxTop; 

        this.setScrollHeight(editorHeight, true);  
    }
    
    handleScroll=(e?:any):React.UIEventHandler<HTMLDivElement> => {
        if (!this.matchDesktopMedia()) return;
        
        let editorsBoxElem = document.getElementById('editors-box');
        let content      = document.getElementById('modal-content');
        let overlay      = document.getElementById('modal-overlay');

        if (!overlay && !content) return;
        
        let contentRectTop = content?.getBoundingClientRect()?.top;
        let _contentHeight = content?.clientHeight + contentRectTop;
        let _overlay = overlay?.clientHeight - 80;
        
        editorsBoxElem.scrollTop = editorsBoxElem?.scrollHeight;
            
        if (_contentHeight >= _overlay) {
            this.setScrollHeight(editorsBoxElem.clientHeight);
        }

        return e;
    };
   
    setScrollHeight =(scrollHeight:number, override?:boolean):void => {
        if (this.state['onScroolStyles'] && !override) return

        // The modal editor as reached a bottom of the page
        // So a height is set on modlal container to maintain its 
        // Full view.
            
        // Because everytime a user type a carecter on a form, a react
        // State is updated. So to prevent this warning:

        // "Warning: Cannot update during an existing state transition
        // (such as within `render`).Render methods should be a pure function 
        // of props and state."

        // Delay for 1 second before call setState.
        setTimeout(()=> {
            let onScroolStyles = {height : `${scrollHeight}px`};
            this.setState({onScroolStyles});
        }, 500);
        
    }

    matchSmallScreenMedia():boolean{
       return window.matchMedia("(max-width: 980px)").matches;
    }

    matchDesktopMedia():boolean{
        return window.matchMedia("(min-width: 980px)").matches;
    }

    matchTabletMedia():boolean{
        return window.matchMedia("(min-width: 760px)").matches
    }


    getProps():object {
        const editorState = this.state['editorState'];
        let currentContent  = editorState && editorState.getCurrentContent();
        
        let editorContents  = currentContent && convertToRaw(currentContent) || {};
        editorContents      =  JSON.stringify(editorContents);
    
        return {
            ...this.props,
            onChange          : this.onChange,
            onURLChange       : this.onURLChange,
            handleAddLink     : this.handleAddLink,
            promptLinkIpunt   : this.promptLinkIpunt,
            addItalic         : this.addItalic,
            addBold           : this.addBold,
            editorContents    : editorContents,
            submit            : this.submit,
            textAreaProps     : this.getTextAreaProps(), 
            handleScroll      : this.handleScroll, 
            handleBlur        : this.handleBlur,
            handleFocus       : this.handleFocus,
            self: this,
            ...this.state,
        } 
    };

    scroolIcon =(e)=>{
        console.log(e)
    }

    render() {
        let props = this.getProps();
        let onSubmitStyles = props['submitting'] ? {opacity:'0.70',}
                                              : {opacity:'2',};

        let showAlertMessageStiles = props['hasErrors']?{ display : 'block'}:
                                                     { display : 'none' };
        
        return (
            <div onScroll={this.handleScroll()}
                className="editor-container" 
                id="editor-container" > 
                
                <fieldset style={onSubmitStyles} 
                      disabled={props['submitting']} >
                    <EditorCommponent {...props}/>
                </fieldset>

                <div style={showAlertMessageStiles}>
                    <AlertComponent {...props}/>
                </div>
               
            </div>
        );
    }
};

const EditorCommponent = (props)=>{
    if (window.matchMedia("(min-width: 900px)").matches) {
        return DesktopEditorComponent(props);

    } else {
        return MobileEditorComponent(props);
    } 
    
};


export const MobileEditorComponent =(props)=>{
    let { objName} = props;

    return(
        <div>
            <MobileModalNavBar {...props}/>
            <EditorContentsComponent {...props}/>
        </div>
    )
};


export const DesktopEditorComponent =(props)=>{
    let {currentUser} = props;

  
    return(
        <div className="desktop-editor">
            <DesktopModalNavBar {...props}/>
            <Author {...currentUser}/>

            <div>
               <EditorContentsComponent {...props}/>
            </div>
            <DesktopToolBar {...props}/>
        </div>
    );
};

const Author =(author:object)=>{
    let profile = author['profile'];

    return(
        <div className="modal-user-box">
            <div className="editor-img-box">
                <img alt="" 
                     src={profile.profile_picture}
                     className="profile-photo"/>
            </div>
            <ul className="editor-username-box">
                <li className="editor-username" >
                    {author['first_name']}  {author['last_name']} 
                </li>
            </ul>
        </div>
    );
}; 


export const EditorContentsComponent = (props)=> {
    let {objName, withTextArea} = props;

    switch(objName){
        case 'Question':
            return <QuestionEditor {...props}/>

        case 'Post':
        case 'About':
            return <PostEditor {...props}/>
 
        default:
            return <PureDraftEditor {...props}/>;  
    };

};

const PureDraftEditor =(props)=>{
    let {onScroolStyles, handleFocus, handleScroll} = props;
    
    return(
        <div className="editors-page">
            <div style={onScroolStyles}
                 onClick={(e)=> handleFocus(e)}
                 id="editors-box" 
                 className="editors-box pure-draft-editor">
                <DraftEditor {...props}/>
            </div>
        </div>
    )
}
