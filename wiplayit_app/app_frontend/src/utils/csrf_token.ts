import React from 'react';
//import JQuery from 'jquery';
let csrftoken = getCookie('csrftoken');

/*
const CSRFToken = () => {
    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
    );
};
export default CSRFToken;
*/


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