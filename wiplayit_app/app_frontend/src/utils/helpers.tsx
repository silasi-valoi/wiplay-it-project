import React from 'react';
import {history} from 'App';
import {convertToRaw, convertFromRaw, EditorState} from 'draft-js';
import {decorator} from 'containers/draft-js-editor/plugins';
import * as checkType from 'helpers/check-types'; 
import GetTimeStamp from 'utils/timeStamp';


//let Print = (data:any) => console.log(data);

export default class Helper {


    updateReducerListEntynties(listItems, obj) {
        //console.log(listItems,obj)
        if (Array.isArray(listItems) && obj ) {

            listItems.map(( item, index) => {
                if ( item.id  === obj.id) {
                    Object.assign(listItems[index], obj)
                }
                return listItems;
            });

            return listItems;
        }
    };
      
   createFormData(data ) {
      var formData    =   new FormData();

      if (data) {
         for (var key in data){
            formData.append(key, data[key]);
         }
      }

      return formData;
    };


    draftContents =()=>{
        return {
            "blocks":
                [{"key": "dau30","text":"", 
                  "type":"unstyled","depth":0,
                   "inlineStyleRanges":[],
                   "entityRanges":[],
                   "data":{} }
                ],"entityMap":{}
        }
    }


    convertFromRaw =(contents)=>{
        let contentState = contents;

        if (contents?.length) {
            
            for (var i = contents.length - 1; i >= 0; i--) {
                let carecter = contents[i];
            
                if (!contents.includes('{') || !contents.includes('[')) {
                    let draftContents = this.draftContents();
                    draftContents.blocks[0].text = contents
                    contentState = draftContents
                    break
                }
            }
        }
        
        let isString = checkType.isString(contentState)

        if (isString) {
            contentState  = JSON.parse(contentState);
        }

        contentState  = contentState && convertFromRaw(contentState);
        return contentState && 
                            EditorState.createWithContent(contentState, decorator);
    };

    convertToRaw(){
        
    }

    _blockText(form) {
        let blocks    =  form.blocks;
        let blockText     =  "";    

        for (var i = blocks.length - 1; i >= 0; i--) {
           //console.log(blocks[i].text)
           let text = blocks[i].text;

            if (! /^ *$/.test(text)) {
                //console.log(text)
                blockText = text;  
            }
            else{
                //console.log(blocks[i].text)
                blockText = "";
            }
        }

        return blockText;
    };

    validateForm =(params)=> {
        let validatedForm = {};

        let {editorContents, form } = params

        if (editorContents) {
            form      = convertToRaw(editorContents);
            let entityMap = Object.keys(form.entityMap);
            let blockText =   this._blockText(form);
                  
            if (blockText !== "" || entityMap.length) {
                validatedForm = {data: JSON.stringify(form),formIsValid : true,}
            }

            else{
                validatedForm = {
                   formHasErrors : true,
                   formIsValid   : false,
                   errors        : "Form is Empty",
               }
            } 
        }

        else if(form){
            let textarea = form.textarea;
            if (/^ *$/.test(textarea)) {
                //If textarea field is empty? Return form errors

                validatedForm = {
                    formHasErrors : true,
                    formIsValid   : false,
                    errors        : "Form is Empty",
                }
            }
            else {
                validatedForm = {
                    data          : form.textarea,
                    formIsValid   : true,
                    formHasErrors : false
                }
            }
        }

        return validatedForm; 
    }

};

export const IsBookMarked =(contentType, obj)=>{
    
    let cache = JSON.parse(localStorage.getItem('@@CacheEntities')) || {};
    let index  = cache?.index;
    let bookmarks = index?.bookmarks;
    let isBookmarked = false;

    if (bookmarks && obj) {
        let contents = bookmarks[contentType] || []
       
        contents.map((value, key)=> {
                        
            if(value.id === obj.id) {
                isBookmarked = true
            }
        })
    }
    return isBookmarked

}

export const GetLoggedInUser =()=>{
    let cache = JSON.parse(localStorage.getItem('@@CacheEntities'))  || {};
    let currentUser = cache && cache.currentUser
    return currentUser && currentUser.user || undefined;
}



export const DisablePageScrool =()=>{
        document.body.style['overflow-y'] = 'hidden';
        document.body.style['overflow-x'] = 'hidden';
    }

export const EnablePageScrool =()=>{
        document.body.style['overflow-y'] = 'scroll';
        document.body.style['overflow-x'] = 'scroll';
}


export const matchMediaSize =(mediaSize)=> {
        let size = `(${mediaSize})`;
        return window.matchMedia(size).matches;
};


export const displaySuccessMessage =(self, message:string)=> {
    
    if (!message) return;
    
    const successMessage:object = {textMessage:message, messageType:'success'}
    displayAlertMessage(self, successMessage)
};

export const displayErrorMessage =(self, message:string) => {
    let errorMessage:object = {textMessage:message, messageType:'error'}
    displayAlertMessage(self, errorMessage)
};

const displayAlertMessage = (self, message:object) => {
    self.setState({ displayMessage : true, message });
        
    setTimeout(()=> {
        self.setState({displayMessage : false, message:undefined}); 
    }, 10000);
};


export const pushToRouter = (params:object, event?:React.MouseEvent<HTMLAnchorElement>) =>{
    
    event && event.preventDefault();
 
    if (params['modalIsOpen']) {
        history.goBack();
    }

    let location:object = history.location;
    let currentPath = location['pathname'];

    if (params['linkPath'] && params['linkPath'] !== currentPath) {

        setTimeout(()=>  {
            history.push(params['linkPath'], params['state'])
        }, 500)
    }
};


export const cacheExpired = (cache:object):boolean => {
    if (!cache) {
        return true;    
    }

    let timeStamp = cache['timeStamp'];
    const getTimeState = new GetTimeStamp({timeStamp});
    let menutes = parseInt(`${getTimeState.menutes()}`);
    return menutes >= 1
    
}