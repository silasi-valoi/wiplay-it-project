
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
        console.log(this.props)
    }
  
    onChange(e){
        e.preventDefault();
        let form      = this.state['form'];
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
      const onChange = this.onChange;
      const handleAddLink = this.props['handleAddLink'];
      const form:object = this.props['form'];

      return(
         <div className="hyperlink-form">
            <div className="hyperlink-box">
               <input
                  className="hyperlink-input" 
                  type='text'
                  onChange={onChange}
                  name="LINK"
                  value={form['value']}
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


