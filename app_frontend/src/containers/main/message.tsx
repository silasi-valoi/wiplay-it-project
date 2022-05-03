
import React, {Component} from 'react';
import {MessageForm} from 'templates/forms';
import {formIsValid} from 'containers/authentication/utils';
import {sendMessage} from 'dispatch/index';
import {store} from "store/index";
import {createFormData} from 'utils';

class MessageFormContainer extends Component{
    private isFullyMounted:boolean = false;
    private unsubscribe;
    public handleChange;
    public handleSubmit;

    constructor(props) {
        super(props);
        this.state = { 
            form     : {full_name   : '',
                        email       : '',
                        subject     : '',
                        description : '',},
            error     : '',
            submitting : false,
            displayMessage :false,
            pageName  : 'Feedback', 
        }; 

       
    };

    public get isMounted() {
        return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
        this.isFullyMounted = value;
    }
 

    componentDidMount() {
        this.isMounted = true;
        this.onStoreUpdate();
        
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    onStoreUpdate = () =>{
        if (!this.isMounted) return;    
        const onStoreChange = () => {
            let storeUpdate  = store.getState();
            let {entities }  = storeUpdate;
            let message = entities['message'];
           

            if (message) {
                this.setState({submitting:message.isLoading || false});
                 
                let {error} = message;
                if (error) {
                    this.setState({error})
                    delete message.error;
                }
            }        
            
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
      

    onChange = (event) => {
        event.preventDefault();
        let form = this.state['form'];
        console.log(form)
        form[event.target.name] = event.target.value;
        this.setState({form});
    };

    
    textAreaProps() {
        let form = this.state['form'];
        return {
           value       : form.description,
           onChange    : this.onChange.bind(this),
           name        : "description",
           className   : "message-textarea-field",
           placeholder : '',
        };
    };

    _handleSubmit(){
        let form = this.state['form'];
        let isValid = formIsValid(form);
        
        if (!isValid) {
            let error = {non_field_errors : ['Please fill in all fields']};
            return this.setState({error})
        }

        this.setState({submitting:true})
        
        let   apiUrl = this.props['apiUrl'];
        let   formData = createFormData({...form});

        store.dispatch<any>(sendMessage({apiUrl, formData}))
    };

    render(){
        let textAreaProps = this.textAreaProps();
        let props  = {
                ...this.props,
                ...this.state,
                textAreaProps,
                handleChange : this.onChange.bind(this),      
                handleSubmit : this._handleSubmit.bind(this),
            };

       
        return(
            <div className="message-container">
                <MessageForm {...props}/>
            </div>
        )
    }
};

export default MessageFormContainer; 


