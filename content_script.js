
var backgroundColor = "#ebd2ea";
var anchorColor = "#d944d3";
var iconColor = "#aa80cd";
var iconColorHovered = "rgb(138, 65, 196)"
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
    $("body").css("cursor", "url('"+chrome.extension.getURL('glitter_cursor.gif')+"'), default");
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
$("body").click(function(){
    window.setTimeout(function(){
        if(document.URL != previousURL){
            resetForAjax();
        }
    },250);
});

$("div.pagination.ajax_paginate").click(function(){
    console.log("I should have just changed something");
    window.setTimeout(function(){
        resetForAjax();
    },250);
});

toggleColorOnHover($("a.tooltipped,a.header-logo-invertocat,span.octicon-mark-github,ul.top-nav li a,.stats li a"),
            iconColor, iconColorHovered);
toggleColorOnHover($(".stats li a"),"#222", anchorColor);