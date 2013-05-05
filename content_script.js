
var backgroundColor = "#ebd2ea";
var anchorColor = "#d944d3";
var iconColor = "#aa80cd";
var lightestPink = "#faeaf7";
var lightPurple = "#f2dcf7";
var firstNames = loadStrings("common_first_names.txt");
var lastNames = loadStrings("common_last_names.txt");
var usernames = loadStrings("usernames.txt");
var username = getRandom(usernames);

swapProfilePic(); //replaces picture on profile page
swapProfileName(); //replaces name on profile page
swapUsername(); //replaces all instances of username
changeCalendarColors();
changeColors();

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
    
    $(".name").text(username); //replaces name at top *dont forget to add in picture
}

function swapProfilePic(){
    //var firstIndex = Math.floor(Math.random()*firstNames.length);
    //var lastIndex = Math.floor(Math.random()*lastNames.length);
    //var firstName = firstNames[firstIndex];
    //var lastName = lastNames[lastIndex];
        
    $.getJSON("https://graph.facebook.com/"+getRandom(firstNames)+"."+getRandom(lastNames)+"?fields=id,name,gender,picture.height(236).width(236)", function(graphApi){  
        if(typeof(graphApi.error) == 'undefined' &&
           graphApi.gender == "female" &&
           graphApi.picture.data.is_silhouette == false){
                imgURL = graphApi.picture.data.url;
                swapProfilePics(imgURL);
        }
        else swapProfilePic();
    });
}

//uses different name than picture for security purposes and common decincy 
function swapProfileName(){
    $("[itemprop='name']").text(capitalize(getRandom(firstNames))+" "+capitalize(getRandom(lastNames)));
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
    $("[class*='mini-icon']").css("color", iconColor);
    $("[class*='full-commit']").css("background", lightestPink); //profile bar above 
    $(".contributions-tab h3").css("background", lightestPink); 
    $("#dashboard:parent").css("background", lightestPink).css("padding", "10"); //homepage dashboard
    $(".message").css("background", lightPurple); //octocat messages
}

/*-----------------USEFUL FUNCTIONS---------------------*/

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