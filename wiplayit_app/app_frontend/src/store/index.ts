import { createStore,compose, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk'
import rootReducer from 'reducers/index';
import {InitialState} from 'reducers/appReducers';



const persistStore = () => (next) => (reducer, initialState, enhancer) => {
    let store;
   
    if (typeof initialState !== 'function') {

        let _cacheEntities:string = localStorage.getItem('@@CacheEntities');
        let cacheEntities:object = _cacheEntities && JSON.parse(_cacheEntities) || {};

        const preloadedState = {...initialState, ...cacheEntities};
        
        let entities = Object.defineProperty({}, "entities", {
                                               value : preloadedState,
                                               writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                            });

        store = next(reducer, initialState, enhancer);
       
       
    }else {
        const preloadedState = initialState ||
        JSON.parse(localStorage.getItem('@@CacheEntities'))
        store = next(reducer, preloadedState, enhancer);
        
    }

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









