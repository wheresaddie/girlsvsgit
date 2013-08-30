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

//toggle hover colors
function toggleColorOnHover(jQueryObj, origColor, newColor){
    jQueryObj.hover(function(){
        if($(this).children().length > 0) $(this).children().css("color", newColor);
        else $(this).css("color", newColor);
        }, function(){
        if($(this).children().length > 0) $(this).children().css("color", origColor); 
        else $(this).css("color", origColor);
    });
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
    //console.log("I just tried to swap an image with the picname as "+picName);
    if(typeof(picName) != undefined &&
        picName != null &&
        picName != ""){
        $.ajax({
            url: "https://graph.facebook.com/"+picName+"?fields=id,name,picture.height(236).width(236)",
            success: function(result){ 
                executeImgSwap(result, jQueryObj, username, picName, picNames);
            },
            error: function(result){
                executeImgSwap(result, jQueryObj, username, picName, picNames);
            } 
        });
    }
}

//function that is called ONLY from inside beginImgSwap once the .ajax call is successfull
function executeImgSwap(result, jQueryObj, username, picName, picNamesString){
    if(typeof result.error === 'undefined' &&
       result.picture.data.is_silhouette == false){
       var picUrl = result.picture.data.url;
       console.log("***it worked!*** The name that worked was "+picName);
       jQueryObj.attr("src", picUrl);
    }else{
        //console.log("the image name I just looked for was "+picName+" and it wasnt right");
        var newPicName = getRandom(firstNames)+'.'+getRandom(lastNames); //pick a new name
        var picNames = picNamesString.replace(picName, newPicName);
        var picNamesArray = picNames.split(','); //resplit new array
        localStorage.setItem("pic_names", picNames, "Fri, 31 Dec 9999 23:59:59 GMT", "/", "github.com"); //resets old_usernames storage
        console.log("I am going to try again with this "+newPicName);
        var newUsername = storageDBLookupFromArray(picNamesArray, newUsernames, newPicName);
        beginImgSwap(jQueryObj, username); //recall function
    }
}