
var backgroundColor = "#ebd2ea";
var anchorColor = "#d944d3";
var iconColor = "#aa80cd";
var lightestPink = "#faeaf7";
var lightPurple = "#f2dcf7";
var repoButtonLight = "#DD6DDD"; //for repo button gradient on index
var repoButtonDark = "#B044A7" //dido
var repoButtonBorder = "#A141A9";
var firstNames = loadStrings("common_first_names.txt");
var lastNames = loadStrings("common_last_names.txt");
var usernames = loadStrings("usernames.txt");
var linkSelector = ".title a,li h3 a,li h4 a,#languages .container li a,.posts li a,.user-list a:not(li a),.members li span a:not(.js-toggler-target),h1.avatared a";

//arrays that hold values for all old and new names and their affiliates like picture lookups
var oldUsernames;
var newUsernames;
var newFullNames;
var picNames;

var firstName;
var lastName;
var username;
var picFirst;
var picLast;
var previousURL;

//------------------DOC READY-------------------//

$("document").ready(function(){
    previousURL = document.URL;
    updateStorageDB(); //fills names arrays
    swapProfilePic(); //replaces picture on profile page
    // ^swapProfilePic must be at the top because it reads username before it is changed
    swapProfileNames(); //replaces full name and username on profile pages
    swapLoggedInUsername();
    swapUsernames(); //replaces all instances of usernames
    swapFullNames(); //replaces all instances of fullnames
    changeColors();
    changeCalendarColors();
    swapThumbnails(); //replaces thumbnail images
});

//--------------------EVENTS------------------------//

//makes swaps when githubs .ajax calls happen because the page is never reloaded
$("a").click(function(){
    window.setTimeout(function(){
        //if(document.URL != previousURL){
            resetForAjax();
        //}
    },250);
});

$(".stats li a").hover(function(){
        $(this).children().each(function(){
                toggleColor($(this), "rgb(34, 34, f34)", anchorColor);
            });
    },function(){
        $(this).children().each(function(){
                toggleColor($(this), anchorColor, "rgb(34, 34, f34)");
        });
    });
$("ul.tabs li").hover(function(){
        $(this).css("color", anchorColor);
    });


function toggleColor(jQueryObj,origColor, newColor){
    if(jQueryObj.css("color") == origColor){
        jQueryObj.css("color", newColor);
        console.log("it is the original color");
    }
    else jQueryObj.css("color", origColor);
    console.log(jQueryObj.css("color"));
}

//------------------FUNCTIONS---------------------//

function updateStorageDB(){
    var visibleUsernames = new Array(); //holds all possible usernames and links
    var oldUsernamesStorage = localStorage.getItem("old_usernames"); //loads old old_usernames storage
    var newUsernamesStorage = localStorage.getItem("new_usernames");
    var newFullNamesStorage = localStorage.getItem("new_full_names");
    var picNamesStorage = localStorage.getItem("pic_names");
    var totalStorageSize;
    var i = 1; //keeps index of all username grabs
    
    visibleUsernames[0] = getLoggedInUsername(); //makes sure that first array value is logged in user
    //grab usernames that are links (basically all of them)
    $(linkSelector).each(function(){
        var link = $(this).attr("href");
            link = link.substring(1);
            if(link.indexOf("/") == -1){
                visibleUsernames[i] = link; //if it is a username add it to the array
                i++;
            }
    });
    
    //grabs username from user profile
    $("[itemprop='additionalName']").each(function(){
            var text = $(this).text();
            visibleUsernames[i] = text;
            i++;
        });
    
    if(oldUsernamesStorage == null || oldUsernamesStorage == "null") oldUsernamesStorage =""; //if there were no usernames found set var to ""
    if(newUsernamesStorage == null || newUsernamesStorage == "null") newUsernamesStorage =""; //if there were no usernames found set var to ""
    if(newFullNamesStorage == null || newFullNamesStorage == "null") newFullNamesStorage =""; //if there were no usernames found set var to ""
    if(picNamesStorage == null || picNamesStorage == "null") picNamesStorage =""; //if there were no usernames found set var to ""
    
    for(var j = 0; j < visibleUsernames.length; j++){
        var newFullName = getRandom(firstNames)+' '+getRandom(lastNames);
        var newPicName = getRandom(firstNames)+'.'+getRandom(lastNames);
        var newUsername = getRandom(usernames);
        
        //adds username to storage string if it was not already there
        if(!contains(oldUsernamesStorage, visibleUsernames[j])){
             oldUsernamesStorage += visibleUsernames[j]+',';
             newUsernamesStorage += newUsername+',';
             newFullNamesStorage += newFullName+',';
             picNamesStorage     += newPicName+',';
        }
    }
    
    localStorage.setItem("old_usernames", oldUsernamesStorage, "Fri, 31 Dec 9999 23:59:59 GMT", "/", "github.com"); //resets (or sets) old_usernames storage
    localStorage.setItem("new_usernames", newUsernamesStorage, "Fri, 31 Dec 9999 23:59:59 GMT", "/", "github.com"); //resets (or sets) old_usernames storage
    localStorage.setItem("new_full_names", newFullNamesStorage, "Fri, 31 Dec 9999 23:59:59 GMT", "/", "github.com"); //resets (or sets) old_usernames storage
    localStorage.setItem("pic_names", picNamesStorage, "Fri, 31 Dec 9999 23:59:59 GMT", "/", "github.com"); //resets (or sets) old_usernames storage
    
     
    oldUsernames = oldUsernamesStorage.split(',');
    newUsernames = newUsernamesStorage.split(',');
    newFullNames = newFullNamesStorage.split(',');
}

    //console.log(oldUsernames);
    //console.log("the length is "+oldUsernames.length);
    //console.log('');
    //console.log(newUsernames);
    //console.log("the length is "+newUsernames.length);
    //console.log('');
    //console.log(newFullNames);
    //console.log("the length is "+newFullNames.length);
    //console.log('');
    //console.log(picNames);
    //console.log("the length is "+picNames.length);

//http://stackoverflow.com/questions/12729449/javascript-replace-doesnt-replace-all-occurences
function swapLoggedInUsername(){
    var oldUsername = getLoggedInUsername();
    var content = $("a.name").html();
    var newUsername = storageDBLookup(newUsernames, oldUsername)
    $("a.name").html(content.replace(oldUsername, newUsername)); //swaps main logged in username button at top right
    $("span.js-select-button").text(newUsername); //swaps logged in username select button on homepage
}

function swapUsernames(){
    var selector = linkSelector+",.author-name a, a[rel='author']";
    //for replacing usernames that are links to user's page
    $(selector).each(function(){
        var link = $(this).attr("href");
        for(var i = 0; i < oldUsernames.length; i++){
            if(link.indexOf(oldUsernames[i]) != -1 ){
            link = link.replace(oldUsernames[i], storageDBLookup(newUsernames, oldUsernames[i]));
            link = link.substring(1);
            $(this).text(link);
            break;
            }
        }
    });
    
    //for replacing usernames that are not links (i.e. brannondorsey's following)
    $("div.repos h2, div.users h2, span.author-name").not(":contains('You')").each(function(){
        var sentence = $(this).text();
        var oldUsername;
        var newUsername;
        if(contains(sentence, "'")){
            var apostrophe = sentence.indexOf("'");
            oldUsername = sentence.substring(0, apostrophe);
            newUsername = storageDBLookup(newUsernames, oldUsername);
            $(this).text(sentence.replace(oldUsername, newUsername));
        }
        else{
            oldUsername = sentence;
            newUsername = storageDBLookup(newUsernames, oldUsername);
            $(this).text(newUsername);
        }
        });
}

function swapFullNames(){
    var selector = ".members li em, h1.avatared em";
    $(selector).each(function(){
        var newUsername = $(this).prev().text();
        var newFullName = storageDBLookupFromArray(newUsernames, newFullNames, newUsername);
        if(newFullName != null){
            newFullName = newFullName.split(' ');
            $(this).text('('+capitalize(newFullName[0])+' '+capitalize(newFullName[1])+')');
        }
    });
}

function swapProfilePic(){
    $("div.avatared a img").each(function(){
        var username = $("[itemprop='additionalName']").text().replace(' ','');
        beginImgSwap($(this), username);
    });
    
    /*these two must be called at the beginning because it needs to grab content that
    will change later.*/
    //swaps thumbnails where desired username is the content of next sibling
    $(".authorship img").each(function(){
       var username = $(this).next().text();
       beginImgSwap($(this), username);
        });
    //swaps thumbnails where desired username is the content of the parents next sibling
    $("div.select-menu-button-gravatar img").each(function(){
       var username = $(this).parent().next().text();
       beginImgSwap($(this), username);
        });
}

function swapThumbnails(){
    
    //swaps thumbnails with an a-tag parent that is a direct link to a profile page
    $(".members li a img,#user-links li a img,.details a img").each(function(){
       var username = $(this).parent().attr("href").substring(1);
       console.log("the username is "+username);
       beginImgSwap($(this), username);
        });
    
    //swaps thumbnails where parent is span with title attr value equal to a username
    $(".details span img").each(function(){
       var username = $(this).parent().attr("title");
       beginImgSwap($(this), username);
        });
    
    //swaps thumbnails with an a-tag next sibling that is a direct links to a profile page
    $("h1.avatared img,img.author-avatar").each(function(){
       var username = $(this).next().attr("href").substring(1);
       beginImgSwap($(this), username);
        });
    
    //swaps thumbnails with an a-tag as the first child of a node that is a sibling of the img
    $("div.commit img").each(function(){
       var username = $(this).next().children(":first-child").attr("href").substring(1);
       beginImgSwap($(this), username);
        });
}

//uses different name than picture for security purposes and common decincy 
function swapProfileNames(){
    var fullNameSelector = "[itemprop='name']";
    var usernameSelector = "[itemprop='additionalName']";
    var oldUsername = $(usernameSelector).text();
    if(oldUsername != ""){
        var newFullName = storageDBLookup(newFullNames, oldUsername);
        var newUsername = storageDBLookup(newUsernames, oldUsername);
        var firstAndLast = newFullName.split(' ');
        $(fullNameSelector).text(capitalize(firstAndLast[0])+" "+capitalize(firstAndLast[1]));
        $(usernameSelector).text(newUsername);
    }
}

function changeCalendarColors(){
    
    var darkest   = "#621e68";
    var dark      = "#a340a2";
    var light     = "#c665c5";
    var lightest  = "#e585e6";
    
    //for days
    $("rect[style*=#1e6823]:not(ul)").attr("style", "fill: "+darkest); //darkest
    $("rect[style*=#44a340]").attr("style", "fill: "+dark);    //dark
    $("rect[style*=#8cc665]").attr("style", "fill: "+light);   //light
    $("rect[style*=#d6e685]").attr("style", "fill: "+lightest);//lightest
    
    //for key
    $("li[style*=#1e6823]:not(ul)").attr("style", "background-color: "+darkest); //darkest
    $("li[style*=#44a340]").attr("style", "background-color: "+dark);    //dark
    $("li[style*=#8cc665]").attr("style", "background-color: "+light);   //light
    $("li[style*=#d6e685]").attr("style", "background-color: "+lightest);//lightest
}

function changeColors(){
    $("body").css("background", backgroundColor); //background
    $("a").css("color", anchorColor);             //links
    $("a.selected").css("border-bottom", "2px solid "+anchorColor); 
    $(".mega-icon").css("border-bottom", anchorColor);  //github cat icon 
    $("[class*='mini-icon'],.octicon,.mega-octicon").css("color", iconColor);
    $("[class*='full-commit']").css("background", lightestPink); //profile bar above 
    $(".contributions-tab h3").css("background", lightestPink);
    $("#dashboard,ul.repolist,.activity-tab,div.columns.userrepos").css({
        "background": lightestPink,
        "padding": "10"
        }); //homepage dashboard
    $(".octofication .message").css({
                        "background" : lightPurple,
                        "border" : "1px solid #D2BBD2"
                        }); //octocat messages
    $(".minibutton.primary,.button.primary.new-repo").css({
                                    "background-image": "linear-gradient("+repoButtonLight+", "+repoButtonDark+")",
                                    "color": "#fff",
                                    "border-color" : repoButtonBorder
                                    });
    $(".minibutton.primary span").css("color", "#fff");
}

function resetForAjax(){
    swapProfilePic(); 
    swapProfileNames(); 
    swapUsernames(); 
    swapFullNames(); 
    changeColors();
    changeCalendarColors();
    swapThumbnails(); 
    previousURL = document.URL;
}

/*-----------------HELPER FUNCTIONS---------------------*/

function capitalize(str){
    var firstLet = str.charAt(0).toUpperCase();
    var theRest = str.substring(1);
    
    return firstLet+theRest; 
}

//returns random value in array
function getRandom(array){
    var index = Math.floor(Math.random()*array.length);
    var value = array[index];
    return value;
}

//seperates .txt into arrays based on line returns
function loadStrings(file) {
    var result;
    $.ajax({
        type: "GET",
        url: chrome.extension.getURL(file),
        async: false,
        success: function(data){
            result = data;
        }
    });
    return result.split("\n");
}

//returns name value of username in desired array
function storageDBLookup(targetLookupArray, username){
    if(contains(oldUsernames, username)){
        var index = oldUsernames.indexOf(username);
        return targetLookupArray[index];
    }
    else return null;
}

//returns name value of username in desired array from desired array
function storageDBLookupFromArray(fromArray, targetLookupArray, key){
    if(contains(fromArray, key)){
        var index = fromArray.indexOf(key);
        return targetLookupArray[index];
    }
    else return null;
}

//returns logged in users original username
function getLoggedInUsername(){
    var content = $("a.name").html();
    var imgTagEnd = content.indexOf(">")+1;
    var loggedInUsername = content.substring(imgTagEnd);
    loggedInUsername = loggedInUsername.replace(/ /g, "");
    loggedInUsername = loggedInUsername.replace(/\n/g, "");
    return loggedInUsername;
}

//returns true if string contains searched character
function contains(string, searchChar){
    if(string.indexOf(searchChar) != -1) return true;
    else return false;
}

//starts async image swap
function beginImgSwap(jQueryObj, username){
    //for debugging uncomment all //// lines
    
    picNames = localStorage.getItem("pic_names");
    var picNamesArray;
    if(picNames != null) picNamesArray = picNames.split(',');
    var picName = storageDBLookup(picNamesArray, username);
    console.log("I just tried to swap an image with the picname as "+picName);
    if(typeof(picName) != undefined &&
    picName != ""){
        $.ajax({
            url: "https://graph.facebook.com/"+picName+"?fields=id,name,picture.height(236).width(236)",
            success: function(result){
                //pass all of the variables used above into the function that is called once the .ajax call succeeds
                executeImgSwap(result, jQueryObj, username, picName, picNames);
            }
        });
    }
}

//function that is called ONLY from inside beginImgSwap once the .ajax call is successfull
function executeImgSwap(result, jQueryObj, username, picName, picNamesString){
    if(typeof(result.error) == "undefined" &&
       result.picture.data.is_silhouette == false){
       var picUrl = result.picture.data.url;
       console.log("***it worked!*** The name that worked was "+picName);
       jQueryObj.attr("src", picUrl);
    }
    else{
        console.log("the image name I just looked for was "+picName+" and it wasnt right");
        var newPicName = getRandom(firstNames)+'.'+getRandom(lastNames); //pick a new name
        var picNames = picNamesString.replace(picName, newPicName);
        var picNamesArray = picNames.split(','); //resplit new array
        localStorage.setItem("pic_names", picNames, "Fri, 31 Dec 9999 23:59:59 GMT", "/", "github.com"); //resets old_usernames storage
        console.log("I am going to try again with this "+newPicName);
        var newUsername = storageDBLookupFromArray(picNamesArray, newUsernames, newPicName);
        beginImgSwap(jQueryObj, username); //recall function
    }
}