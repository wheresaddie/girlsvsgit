
var backgroundColor = "#ebd2ea";
var anchorColor = "#d944d3";
var iconColor = "#aa80cd";
var lightestPink = "#faeaf7";
var lightPurple = "#f2dcf7";

changeNames("squigly");
changeColors();

function changeNames(newUserName){
    $(".name").text(newUserName);
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