

export const isAuthenticated =(userAuth:object):boolean => {
           
    if (userAuth){
        let loginAuth:object = userAuth['loginAuth'];
        
        if (loginAuth &&  loginAuth['tokenKey']) {
            return true;
        }
    }
       
    return false;
};

export const isAdmin =(adminAuth:object):boolean => {
    
    if (adminAuth && adminAuth['loginAuth']) {
        let auth:object  = adminAuth['loginAuth'];
           
        let isLoggedIn:boolean = auth['isLoggedIn'];
        let tokenKey:string = auth['tokenKey'];

        if (isLoggedIn && tokenKey) {
            return true
        }
    }

    return false;
};


export const getUserFromCache = () : object => {
    const  cacheEntities:object  = _cacheEntities();
    const currentUser:object = cacheEntities && cacheEntities['currentUser'];

    return currentUser && currentUser['user']
   
};




const _cacheEntities = () : object  => {
   return JSON.parse(localStorage.getItem('@@CacheEntities')) || {};
}