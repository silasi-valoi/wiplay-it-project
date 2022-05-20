import React from 'react';
import {history} from 'App';
import {ContentState, EditorState} from 'draft-js';
import {convertFromRaw as _convertFromRaw, convertToRaw as _convertToRaw} from 'draft-js';
import {decorator} from 'containers/draft-js-editor/plugins';
import {isString, isObject} from 'typeChecker'; 
import GetTimeStamp from 'timeStamp';
import {closeModals}   from  'containers/modal/utils';


//let Print = (data:any) => console.log(data);


export  function getCookie(name) {
    var cookieValue = null;
    
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        
        
        for (var i = 0; i < cookies.length; i++) {
            var cookie  = cookies[i].split("=");
                        
            if (cookie && cookie.length) {
                for (var x = 0; x < cookie.length; x++) {
                    
                    if (name === cookie[x].trim()) {
                        cookieValue = decodeURIComponent(cookie[x + 1].trim());
                        break;
                    }
                }
            }
        }
    }
    return cookieValue;
};

     
export const createFormData = (data:object) => {
    var formData = new FormData();

    if (data) {
        for (var key in data){
            formData.append(key, data[key]);
        }
    }
    return formData;
};

const  draftContents = {
        "blocks":
            [{"key": "dau30","text":"", 
            "type":"unstyled","depth":0,
               "inlineStyleRanges":[],
                "entityRanges":[],
                "data":{} }
            ],"entityMap":{}
    };
    


export const convertFromRaw = (contents) => {
    let contentState = contents;
                
    if (!contents.includes('{') || !contents.includes('[')) {
        for (var i = contents.length - 1; i >= 0; i--) {
            draftContents.blocks[0].text = contents
            contentState = draftContents
            break
        }
     }
                
    if (isString(contentState)) {
        contentState = JSON.parse(contentState);
    }

    contentState = contentState && _convertFromRaw(contentState);
    return contentState && EditorState.createWithContent(contentState, decorator);
};

export const convertToRaw = () => {
        
};

const _blockText = (form) => {
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

export const validateForm = (params) => {
    let validatedForm = {};

    let {editorContents, form } = params;

    if (editorContents) {
        form = _convertToRaw(editorContents);
        let entityMap = Object.keys(form.entityMap);
        let blockText =   _blockText(form);
                  
        if (blockText !== "" || entityMap.length) {
            validatedForm = {data: JSON.stringify(form),formIsValid : true,}
        }

        else {
            validatedForm = {
                formHasErrors : true,
                formIsValid   : false,
                errors        : "Form is Empty",
            }
        } 
    }

    else if(form){
        let textarea = form.textarea;

        //Check if form is empty and set errors in validatedForm
        // otherwise set validated data.
        if (/^ *$/.test(textarea)) {
            
            validatedForm = {
                formHasErrors : true,
                formIsValid   : false,
                errors        : "Form is Empty",
            }
        }
        else {
            validatedForm = {
                data : form.textarea,
                formIsValid : true,
                formHasErrors : false
            }
        }
    }

    return validatedForm; 
}


export const IsBookMarked =(contentType:string, data:object)=>{
    
    let cache = JSON.parse(localStorage.getItem('@@CacheEntities')) || {};
    let index  = cache?.index;
    let bookmarks = index?.bookmarks;
    let isBookmarked = false;

    if (bookmarks && data) {
        let contents = bookmarks[contentType] || []
       
        contents.map((value)=> {
                        
            if(value.id === data['id']) {
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

export const displayAlertMessage = (self, message:object) => {
    
    if(self.isMounted){
        self.setState({ displayMessage : true, message });
        
        setTimeout(()=> {
            self.setState({displayMessage : false, message:undefined}); 
        },7000);


    }

        
};


export const pushToRouter = (params:object, event?:React.MouseEvent<HTMLAnchorElement>) =>{
    
    event && event.preventDefault();
    
    //If a modal is open, let's close it before navigating to another page
    closeModals(true)
 
    let location:object = history.location;
    let currentPath = location['pathname'];

    if (params['linkPath'] && params['linkPath'] !== currentPath) {

        setTimeout(()=>  {
            history.push(params['linkPath'], params['state'])
        }, 500)
    }
};


export const cacheExpired = (cache:object, duration?:number):boolean => {
    if (!cache) {
        return true;    
    }

    let timeStamp = cache['timeStamp'];
    const getTimeState = new GetTimeStamp({timeStamp});
    let menutes = parseInt(`${getTimeState.menutes()}`);
    let _cacheExpired:boolean;

    if(duration){
        _cacheExpired = menutes >= duration
        
    }else{
        _cacheExpired = menutes >= 1;
    }

    return _cacheExpired;
    
}



export const cacheStoreData = (cacheKey:string, byId:string, data:object)=> {
    
    let entities:object = getCache()
    let cacheData:object =  entities[cacheKey];
    let newCache:object = {};
    
    if (byId) {

        let _cache:object = cacheData && cacheData[byId] || {};
        let _data:object = {..._cache, ...data[byId]};

         _data = {
            value : _data, 
            writable : true,
            configurable : true,
            enumerable   : true,
        };
      
        newCache =  Object.defineProperty({}, byId, _data);
        newCache = {...cacheData, ...newCache};
        
    }else{
        newCache = {...cacheData, ...data}
    }

    entities[cacheKey] = newCache;


    localStorage.setItem('@@CacheEntities', JSON.stringify(entities));  

}

export const getDataFromCache = (key:string) => {
    let entities:object = getCache()
    return entities[key];

}


const getCache = () => {
    let cacheEntities:string = localStorage.getItem('@@CacheEntities');
    return cacheEntities && JSON.parse(cacheEntities) || {};

};

