import { createStore,compose, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk'
import rootReducer from 'reducers/index';



const persistStore = () => (next) => (reducer, initialState, enhancer) => {
    let store;
    if (typeof initialState !== 'function') {

        let cacheEntities = localStorage.getItem('@@CacheEntities');
        cacheEntities     = cacheEntities && JSON.parse(cacheEntities) || {};

        const preloadedState = initialState || cacheEntities;

        let entities = Object.defineProperty({}, "entities", {
                                               value : preloadedState,
                                               writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                            });;

        store = next(reducer, initialState, enhancer);
       
       
    } 

    else {
        const preloadedState = initialState ||
        JSON.parse(localStorage.getItem('@@CacheEntities'))
        store = next(reducer, preloadedState, enhancer);
        
    }

    

    let UpdateKeyedLocalCache =(storeData, cacheData)=> {
        //console.log(storeData, cacheData )
        let cacheMerge;
        let storeDataKeys = storeData && Object.keys(storeData);
         
                    
        if (storeDataKeys.length) {
                        
            for(var Key in storeData){
                let storeDataValue  =  storeData[Key] 
                let cacheDataValue  = cacheData && cacheData[Key] || {} ;

                cacheMerge = Object.assign(cacheDataValue, storeDataValue);

                cacheMerge =  Object.defineProperty({}, Key, {
                                               value : cacheMerge,
                                               writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                        });
                                           
            }
      
        }


        return cacheMerge;     
    };

    let UpdateNonKeyedLocalCache =(_storeData, _cacheData)=> {
       return  {};

    };

    store.subscribe(() => {

        let cacheEntities = localStorage.getItem('@@CacheEntities');
        cacheEntities     = cacheEntities && JSON.parse(cacheEntities) || {};
                
        let storeUpdate = store.getState();
        let { entities } = storeUpdate;
        let storeEntities = entities;
        //console.log(storeEntities)

        let storeData; 
        let cacheData;
        let _cacheMerge;

        for(var entitieKey in storeEntities){
            storeData = storeEntities[entitieKey] || {};
            cacheData = cacheEntities[entitieKey] || {};

            if(   entitieKey === 'userAuth'     
               || entitieKey === 'currentUser'  
               || entitieKey === 'index'          
               || entitieKey === 'admin'           
               || entitieKey === 'about'               
               || entitieKey === 'modal' ) {

                   
                cacheData = cacheData || {};
                let storeDataKeys = storeData && Object.keys(storeData);
                               
                if (storeDataKeys && storeDataKeys.length) {
                    _cacheMerge = {...cacheData, ...storeData}
                    cacheEntities[entitieKey] = _cacheMerge;
                }
                    
            }else if(entitieKey === 'users'       ||
                     entitieKey === 'userProfile' ||
                     entitieKey === 'questions'   ||
                     entitieKey === 'question'    ||
                     entitieKey === 'answers'     ||
                     entitieKey === 'posts'       ||  
                     entitieKey === 'post'        ||   
                     entitieKey === 'comments'    ||     
                     entitieKey === 'replies'
                    ){
              
                if (Object.keys(storeData)) {
                    _cacheMerge = UpdateKeyedLocalCache(storeData, cacheData)
                    cacheEntities[entitieKey] = Object.assign(cacheData, _cacheMerge)
                }

            }
        }
      
        localStorage.setItem('@@CacheEntities', JSON.stringify(cacheEntities));  
    })


    return store;
};


const storeEnhancers = compose(
   applyMiddleware(thunkMiddleware),
   persistStore()
);


export const store = createStore(
                        rootReducer, 
                        window['__REDUX_DEVTOOLS_EXTENSION__'],
                        storeEnhancers
                    );


// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),









