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

function getComfortFactorV2(){
    /*var url = "https://dashboard.us.enableiot.com/v1/api/auth/token";
    var body = "{\"username\":\"jorallan@gmail.com\"}";
    body.username = "jorallan@gmail.com";
    body.password = ">e1!V<2MX+DmT/m&aA5&F|>^oh;2lAt}";*/
    
    var dataUrl = "https://dashboard.us.enableiot.com/v1/api/accounts/4a2fcacc-2851-4420-a450-24b7cce696e9/data/search";
    
    var timeNow = new Date().getTime() - 1000;
    
    var dataRequest = {"from":-10,"targetFilter":{"deviceList": ["pcm-hack"]},"maxItems":1,"metrics": [{"id":"27b30969-7ddc-4698-ba80-06acf6ebf95e"}]};
    
    var dr = {};
    dr.from = 1455100040814;
    dr.targetFilter = {};
    dr.targetFilter.deviceList = [];
    dr.targetFilter.deviceList[0] = "pcm-hack";
    dr.maxItems = 1;
    dr.metrics = [];
    dr.metrics[0] = {};
    dr.metrics[0].id = "27b30969-7ddc-4698-ba80-06acf6ebf95e";
    
    
     $.ajax({
            url: dataUrl,
            data: JSON.stringify(dataRequest),
            type: "POST",
            dataType: "text",
            contentType:"application/json", 
            headers: {"Content-Type":"application/json", "Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI4ZjU0OTYzOC1kYTYwLTQ3MWYtOTFkMS05Y2M4MTBhOTUyZGQiLCJpc3MiOiJodHRwOi8vZW5hYmxlaW90LmNvbSIsInN1YiI6IjU2YmIyNzUxOThmNjhhZjYwNzg2YWI2YyIsImV4cCI6IjIwMTYtMDItMTFUMTY6NDY6NDEuNDU2WiJ9.nLiHDbW5PZegV_V6eUBijy1VsUXuf3UamnEs2bigvpBgTyXmF_cZctvRuOqG7KOHGlx8NBrQ76hXJ-j3gEOvHPs1_HK2UcoPPj1Mm_jkgMePdvBnBrRSbAKtJ56mDsETgRYvp1nnl3aPaYQR3I4HED7IVUOuXF84zaMSlcCImQ9CEhlITQa73pedB0zyEo-FpGf9dj2i7z5pFU34QO0lu9udakRzpX691edBbQ4KqgXmwDvddm7Z-NSsgFT_Br2qgAkoQTUl_tushfvVwBCm-9V64I6QOqno9AU6wBiQepKeLQbxPQh4Cf5__GEJDAen4k1E_HRWZBSXTlaI_4O1yA"},
            success: function(d){
                $('#comfort').text((JSON.parse(d)).series[0].points[0].value);
            }

        });

    setTimeout(getComfortFactorV2, 1000);
    
    /*$.ajax({url:url,
            data: body,
            success: function(data){
                var token = data.token;
                
               
                
            }
           });*/
}


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
    
    getComfortFactorV2();    

}

document.addEventListener("app.Ready", onDeviceReady, false);


