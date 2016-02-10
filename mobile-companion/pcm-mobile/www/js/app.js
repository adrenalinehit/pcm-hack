/*
 * Copyright © 2012-2015, Intel Corporation. All rights reserved.
 * Please see the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */



// This file contains your event handlers, the center of your application.
// NOTE: see app.initEvents() in init-app.js for event handler initialization code.

// function myEventHandler() {
//     "use strict" ;
// // ...event handler code here...
// }


// ...additional event handlers here...

function getComfortFactor(){
    
    var url = 'http://10.163.12.210:8080/comfortValue';
    $.ajax({url: url,
            success: function(data){
                $('#comfort').text(data.value);
            }
    });
 
    setTimeout(getComfortFactor, 1000);
}

function onDeviceReady() {
    // Now safe to use device APIs
    
    getComfortFactor();    

}

document.addEventListener("app.Ready", onDeviceReady, false);


