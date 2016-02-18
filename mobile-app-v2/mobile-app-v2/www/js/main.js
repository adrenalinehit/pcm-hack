/*jslint browser:true, devel:true, white:true, vars:true, eqeq:true */
/*global $:false, intel:false*/
/*
 * This function runs once the page is loaded, but the JavaScript bridge library is not yet active.
 */
var init = function () {
    
};


function getComfortFactorV2(){
  
    var dataUrl = "https://dashboard.us.enableiot.com/v1/api/accounts/4a2fcacc-2851-4420-a450-24b7cce696e9/data/search";
    var dataRequest = {"from":-10,"targetFilter":{"deviceList": ["pcm-hack"]},"maxItems":1,"metrics": [{"id":"27b30969-7ddc-4698-ba80-06acf6ebf95e"}]};
    
    var tokenRequestURL = "https://dashboard.us.enableiot.com/v1/api/auth/token";
    var tokenRequestBody = {"username": "jorallan@gmail.com","password":"ku!dMcTeEh[Bt$^,{4-VioDFMc=U[<2E"};
    
    $.ajax({
     
          url: tokenRequestURL,
            data: JSON.stringify(tokenRequestBody),
            type: "POST",
            dataType: "text",
            contentType:"application/json", 
            headers: {"Content-Type":"application/json"},
            success: function(data){
        
                var auth = "Bearer " + (JSON.parse(data)).token;
                
                $.ajax({
                    url: dataUrl,
                    data: JSON.stringify(dataRequest),
                    type: "POST",
                    dataType: "text",
                    contentType:"application/json", 
                    headers: {"Content-Type":"application/json", "Authorization": auth },
                    success: function(d){
                        var score = (JSON.parse(d)).series[0].points[0].value;

                        $('#thescore').text( Math.round(score*100)+"%");
                    }

            });
               
        }        
        
    });
    
    setTimeout(getComfortFactorV2, 1000);
}


window.addEventListener("load", init, false);  

 // Prevent Default Scrolling 
var preventDefaultScroll = function(event) 
{
    event.preventDefault();
    window.scroll(0,0);
    return false;
};
    
window.document.addEventListener("touchmove", preventDefaultScroll, false);

/**
 * Device ready code.  This event handler is fired once the JavaScript bridge library is ready.
 */
function onDeviceReady()
{
    if( window.Cordova && navigator.splashscreen ) {     // Cordova API detected
        navigator.splashscreen.hide();                 // hide splash screen
    }
    console.log("anything?");
    getComfortFactorV2();
}

document.addEventListener("deviceready",onDeviceReady,false); 
/**
 * We use the target from the event to add the pressed class name to the selected button
 */     

// Touch start functionality for the buttons
function touchstarthandler(event)
{
  
}

// Touch end functionality for the buttond
function touchendhandler(event)
{
   
}
