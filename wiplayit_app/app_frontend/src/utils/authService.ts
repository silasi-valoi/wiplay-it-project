

export const isAuthenticated =():boolean => {
    let cacheEntities:object = _cacheEntities();
         
    if (cacheEntities){
        let userAuth:object  = cacheEntities['userAuth'];
                                              
        if ( userAuth){
            let loginAuth:object = userAuth['loginAuth'];
            if (loginAuth &&  loginAuth['tokenKey']) {
       		    return true;
            }
        }
    }
    return false;
};

export const isAdmin =():boolean => {
    let cacheEntities:object  = _cacheEntities();
    
    if (cacheEntities) {
        let admin:object = cacheEntities['admin'];
     
        if (admin && admin['loginAuth']) {
            let auth:object  = admin['loginAuth'];
            
            let isLoggedIn:boolean = auth['isLoggedIn'];
            let tokenKey:string = auth['tokenKey'];

            if (isLoggedIn && tokenKey) {
                return true
            }
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