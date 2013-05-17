
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
var origUsernames; //array that holds all original usernames
var newUsernames;  //holds all new usernames
var newNames;      //holds all new full names
var picNames;      //holds all full names for pictures

var firstName;
var lastName;
var username;
var picFirst;
var picLast;

handleCookies();

//swapProfilePic();   //replaces picture on profile page
//swapProfileNames(); //replaces full name and username on profile pages
//swapUsername();     //replaces all instances of username
//changeCalendarColors();
//changeColors();

function handleCookies(){
    var visibleUsernames = new Array();
    var oldUsernamesCookie = docCookies.getItem("old_usernames");
    var i = 0;
    $(".title a").each(function(){
            //$(this).text();
            var link = $(this).attr("href");
            var link = link.substring(1);
            //if(link.indexOf("/") == -1) cookieString += link+",";
            if(link.indexOf("/") == -1) visibleUsernames[i] = link; //if it is a username add it to the array
            i++;
        });
    //if there is no old_usernames cookie
    if(oldUsernamesCookie == null){
        oldUsernamesCookie = "";
        for(i = 0; i < visibleUsernames.length; i++){
           oldUsernamesCookie += visibleUsernames[i]+",";
        }   
    }
    else{
        //var queue = new Array();
        for(i = 0; i < visibleUsernames.length; i++){
            if(oldUsernamesCookie.indexOf(visibleUsernames[i]) != -1) oldUsernamesCookie += visibleUsernames[i]+",";
        }
    }
    docCookies.setItem("old_usernames", oldUsernamesCookie); 
    //console.log(cookieString);
}

//function handleCookies(){
//    if(docCookies.getItem("new_username") == null){username = getRandom(usernames); docCookies.setItem("new_username", username);}
//    else username = docCookies.getItem("new_username");
//    if(docCookies.getItem("new_first") == null || docCookies.getItem("new_last") == null){
//        firstName = getRandom(firstNames);
//        lastName = getRandom(lastNames);
//        docCookies.setItem("new_first", firstName);
//        docCookies.setItem("new_last", lastName);
//    }
//    else{firstName = docCookies.getItem("new_first"); lastName = docCookies.getItem("new_last");}
//    if(docCookies.getItem("pic_first") == null || docCookies.getItem("pic_last") == null){
//        picFirst = getRandom(firstNames);
//        picLast = getRandom(lastNames);
//        docCookies.setItem("pic_first", picFirst);
//        docCookies.setItem("pic_last", picLast);
//        console.log(picFirst);
//    }
//    else{picFirst = docCookies.getItem("pic_first"); picLast = docCookies.getItem("pic_last");}
//}

//http://stackoverflow.com/questions/12729449/javascript-replace-doesnt-replace-all-occurences
function swapUsername(){
    var original = $(".name").text();
    original = original.replace(/ /g, "");
    original = original.replace(/\n/g, "");
    console.log("the original is "+original+"\n the new is "+username);
    var html = $("body").html();
    var reg = new RegExp(">"+original+"<", "g");
    html = html.replace(reg, ">"+username+"<");
    $("body").html(html);
    
    var content = $(".name").html();
    var imgTagEnd = content.indexOf(">")+1;
    var keep = content.substring(0, imgTagEnd);
    $(".name").html(keep+username);
    console.log(keep+username);
}

function swapProfilePic(){
    console.log("the first name picture is "+picFirst);  
    $.getJSON("https://graph.facebook.com/"+picFirst+"."+picLast+"?fields=id,name,gender,picture.height(236).width(236)", function(graphApi){  
        if(typeof(graphApi.error) == 'undefined' &&
           graphApi.gender == "female" &&
           graphApi.picture.data.is_silhouette == false){
                imgURL = graphApi.picture.data.url;
                swapProfilePics(imgURL);
        }
        else{
            docCookies.setItem("pic_first", getRandom(firstNames));
            docCookies.setItem("pic_last", getRandom(lastNames));
            picFirst = docCookies.getItem("pic_first");
            picLast = docCookies.getItem("pic_last");
            swapProfilePic();
        }
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