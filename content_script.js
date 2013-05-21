
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

handleCookies(); //fills names arrays

swapProfilePic();   //replaces picture on profile page
//swapProfileNames(); //replaces full name and username on profile pages
swapUsernames();     //replaces all instances of usernames
changeColors();
changeCalendarColors();

function handleCookies(){
    var visibleUsernames = new Array(); //holds all possible usernames and links
    var oldUsernamesCookie = docCookies.getItem("old_usernames"); //loads old old_usernames cookie
    var newUsernamesCookie = docCookies.getItem("new_usernames");
    var newFullNamesCookie = docCookies.getItem("new_full_names");
    var picNamesCookie = docCookies.getItem("pic_names");
    var totalCookieSize;
    
    var linkSelector = ".title a,li h3 a,li h4 a,#languages .container li a,.posts li a,.user-list a:not(li a),.members li span a";
    var i = 0; //keeps index of all username grabs
    
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
    
    if(oldUsernamesCookie == null || oldUsernamesCookie == "null") oldUsernamesCookie =""; //if there were no usernames found set var to ""
    if(newUsernamesCookie == null || newUsernamesCookie == "null") newUsernamesCookie =""; //if there were no usernames found set var to ""
    if(newFullNamesCookie == null || newFullNamesCookie == "null") newFullNamesCookie =""; //if there were no usernames found set var to ""
    if(picNamesCookie == null || picNamesCookie == "null") picNamesCookie =""; //if there were no usernames found set var to ""
    
    for(var j = 0; j < visibleUsernames.length; j++){
        var newFullName = getRandom(firstNames)+' '+getRandom(lastNames);
        var newPicName = getRandom(firstNames)+'.'+getRandom(lastNames);
        var newUsername = getRandom(usernames);
        
        //adds username to cookie string if it was not already there
        if(oldUsernamesCookie.indexOf(visibleUsernames[j]) == -1){
             oldUsernamesCookie += visibleUsernames[j]+',';
             newUsernamesCookie += newUsername+',';
             newFullNamesCookie += newFullName+',';
             picNamesCookie     += newPicName+',';
        }
    }
    
    //not very accurate because does not account for chrome's sanitation (i.e , == %2)
    totalCookieSize = oldUsernamesCookie.length+newUsernamesCookie.length+newFullNamesCookie.length+picNamesCookie.length;
    
    //reset cookies to null if they are to large to avoid err 400
    if(totalCookieSize >= 3500){
        oldUsernamesCookie ="";
        newUsernamesCookie =""; 
        newFullNamesCookie =""; 
        picNamesCookie ="";
    }
    
    docCookies.setItem("old_usernames", oldUsernamesCookie, "Fri, 31 Dec 9999 23:59:59 GMT", "/", "github.com"); //resets (or sets) old_usernames cookie
    docCookies.setItem("new_usernames", newUsernamesCookie, "Fri, 31 Dec 9999 23:59:59 GMT", "/", "github.com"); //resets (or sets) old_usernames cookie
    docCookies.setItem("new_full_names", newFullNamesCookie, "Fri, 31 Dec 9999 23:59:59 GMT", "/", "github.com"); //resets (or sets) old_usernames cookie
    docCookies.setItem("pic_names", picNamesCookie, "Fri, 31 Dec 9999 23:59:59 GMT", "/", "github.com"); //resets (or sets) old_usernames cookie
    
     
    oldUsernames = oldUsernamesCookie.split(',');
    newUsernames = newUsernamesCookie.split(',');
    newFullNames = newFullNamesCookie.split(',');
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
//function swapUsername(){
//    var original = $(".name").text();
//    original = original.replace(/ /g, "");
//    original = original.replace(/\n/g, "");
//    var html = $("body").html();
//    var reg = new RegExp(">"+original+"<", "g");
//    html = html.replace(reg, ">"+username+"<");
//    $("body").html(html);
//    
//    var content = $(".name").html();
//    var imgTagEnd = content.indexOf(">")+1;
//    var keep = content.substring(0, imgTagEnd);
//    $(".name").html(keep+username);
//    console.log(keep+username);
//}

function swapProfilePic(){
    picNames = docCookies.getItem("pic_names").split(',');
    var username = $("[itemprop='additionalName']").text().replace(' ','');
    var picName = cookieDBLookup(picNames, username);
    console.log("the picname is "+picName);
    if(typeof(picName) !== "undefined"){
        console.log(picName);
        $.getJSON("https://graph.facebook.com/"+picName+"?fields=id,name,gender,picture.height(236).width(236)", function(graphApi){  
            if(typeof(graphApi.error) == 'undefined' &&
               graphApi.gender == "female" &&
               graphApi.picture.data.is_silhouette == false){
                    imgURL = graphApi.picture.data.url;
                    console.log("should have changed");
                    swapProfilePics(imgURL);
            }
            else{
                var test = docCookies.getItem("pic_names").replace(picName, getRandom(firstNames)+'.'+getRandom(lastNames));
                docCookies.setItem("pic_names", test, "Fri, 31 Dec 9999 23:59:59 GMT", "/", "github.com"); //resets (or sets) old_usernames cookie
                swapProfilePic();
            }
        });
    }
}

function swapUsernames(){
    var linkSelector = ".title a,li h3 a,li h4 a,#languages .container li a,.posts li a,.user-list a:not(li a),.members li span a";
    $(linkSelector).each(function(){
        var link = $(this).attr("href");
        link = link.substring(1);
        for(var i = 0; i < oldUsernames.length; i++){
            if(link.indexOf(oldUsernames[i]) != -1 ){
            link = link.replace(oldUsernames[i], cookieDBLookup(newUsernames, oldUsernames[i]));
            $(this).text(link);
            break;  
            }
        }
            //link = link.substring(1);
            //if(link.indexOf("/") == -1){
            //    var newUsername = cookieDBLookup(newUsernames, link)
            //    $(this).text(newUsername);
            //}
            
    });
}

//uses different name than picture for security purposes and common decincy 
function swapProfileNames(){
    $("[itemprop='name']").text(capitalize(firstName)+" "+capitalize(lastName));
    $("[itemprop='additionalName']").text(username);
}

function swapProfilePics(image){
    $("div.avatared a img").attr("src", image);
    $("[class*='gravatar'] img").attr("src",image);
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
    $("[class*='mini-icon']").css("color", iconColor);
    $("[class*='full-commit']").css("background", lightestPink); //profile bar above 
    $(".contributions-tab h3").css("background", lightestPink); 
    $("#dashboard:parent").css("background", lightestPink).css("padding", "10"); //homepage dashboard
    $(".octofication .message").css({
                        "background" : lightPurple,
                        "border" : "1px solid #D2BBD2"
                        }); //octocat messages
    $(".minibutton.primary").css({
                                    "background-image": "linear-gradient("+repoButtonLight+", "+repoButtonDark+")",
                                    "color": "#fff",
                                    "border-color" : repoButtonBorder
                                    });
    $(".minibutton.primary span").css("color", "#fff");
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
function cookieDBLookup(targetLookupArray, username){
    if(oldUsernames.indexOf(username) != -1){
        var index = oldUsernames.indexOf(username);
        console.log(index);
        return targetLookupArray[index];
    }
    else return null;
}