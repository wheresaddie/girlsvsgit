//------------------VOID FUNCTIONS---------------------//

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
        var link = $(this).attr("href"); //extracts the href attr
        link = link.substring(1);
        if(link.indexOf("/") == -1){
            visibleUsernames[i] = link; //if it is a username add it to the array
            i++;
        }
    });
    
    //grabs username from user profile
    $("[itemprop='additionalName'],span .owner").each(function(){
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

//http://stackoverflow.com/questions/12729449/javascript-replace-doesnt-replace-all-occurences
function swapLoggedInUsername(){
    var oldUsername = getLoggedInUsername();
    var content = $("a.name").html();
    var newUsername = storageDBLookup(newUsernames, oldUsername)
    $("a.name").html(content.replace(oldUsername, newUsername)); //swaps main logged in username button at top right
    $("span.with-gravatar span.js-select-button").text(newUsername); //swaps logged in username select button on homepage
}

function swapUsernames(){
    var selector = linkSelector+",.author-name a, a[rel='author']";
    //for replacing usernames that are links to user's page
    $(selector).each(function(){
        var link = $(this).attr("href");
        for(var i = 0; i < oldUsernames.length; i++){
            if(link.indexOf(oldUsernames[i]) != -1 ){
            link = link.replace(oldUsernames[i], storageDBLookup(newUsernames, oldUsernames[i]));
            link = link.substring(link.lastIndexOf("/")+1);
            $(this).text(link);
            break;
            }
        }
    });
    
    //for replacing usernames that are not links (i.e. brannondorsey's following)
    $("div.repos h2, div.users h2").not(":contains('You'),:contains('you')").each(function(){
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
    
    //swaps names before repo links on right column of homepage
    $(".css-truncate span.owner").each(function(){
        var username = $(this).text();
        $(this).text(storageDBLookup(newUsernames, username));
    });
    
    //swaps names before repo links on pull requests page
    $(".filter-list.small li a").each(function(){
        var contents = $(this).html();
        var beginString = "</span>"
        var beginIndex = contents.indexOf(beginString);
        var withoutSpan = contents.substring(beginIndex+beginString.length, contents.length);
        console.log("the begin index is "+beginIndex);
        console.log("without span the contents are "+withoutSpan);
        var slash = withoutSpan.indexOf('/');
        console.log("the end index is "+slash);
        var username = withoutSpan.substring(0, slash).replace(/ |\n/g, "");
        console.log("the username is "+username);
        $(this).html(contents.replace(username, storageDBLookup(newUsernames, username)));
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
    $(".users li a img,#user-links li a img,.details a img,.user-list a img, div.jump-to-users a img").each(function(){
       var href = $(this).parent().attr("href")
       var username = href.substring(href.lastIndexOf("/")+1);
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
    $("[class*='mini-icon'],.octicon,.mega-octicon,ul.top-nav li a").css("color", iconColor);
    $(".stats li a span").css("color", "#222");
    $("ul.filter-list a.filter-item.selected").css({
        "background": iconColorHovered,
        "color" : lightestPink
        });
    $("[class*='full-commit']").css("background", lightestPink); //profile bar above 
    $(".contributions-tab h3").css("background", lightestPink);
    $(".commit-tease.js-details-container").css("background", lightPurple);
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