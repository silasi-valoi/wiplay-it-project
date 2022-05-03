
import React, { Component } from 'react';


class  LinkInput extends Component  {
    constructor(props) {
        super(props);
        this.state = {
               form : {
               value : '',
            },  
        }

        this.onChange.bind(this)
    }


    componentDidMount() {
      
    }
  
    onChange(e){
        e.preventDefault();
        let form = this.state['form'];
        form['value'] = e.target.value;
        this.setState({form});
    }

    getProps(){
        let props = {
            onChange: this.onChange.bind(this),
            form    : this.state['form'],
        }
        return {...this.props, ...props};
      }

   render(){
      const props = this.getProps()
      const onChange = props.onChange;
      const handleAddLink = props['handleAddLink'];
      const form:object = props['form'];
      let value:string = form['value'];

      return(
         <div className="hyperlink-form">
            <div className="hyperlink-box">
               <input
                  className="hyperlink-input" 
                  type='text'
                  onChange={onChange}
                  name="LINK"
                  value={value}
                  placeholder="Enter Url" 
               />

               <button
                  onClick={() => handleAddLink(form['value'])}
                  className="btn-sm add-link">
                  Add
               </button>
            </div>
         </div>
      )
   }
};

export default LinkInput;


