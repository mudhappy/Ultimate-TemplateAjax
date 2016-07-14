/*

MAIN SCRIPTS FILE

Author - Roussounelos Nikos
Template - Genma 
Version - 1.0
Contact - info@roussounelosweb.gr, roussounmanman@hotmail.com

*/

var homePage = "inicio"; //home page, for example masonry-portfolio.html
var pageType = ".html"; //page extension, .html, .php, etc
var animationLength = 100; //main animation duration
var animationIn = "dropping-blocks"; //how the inner page will animate in
var animationOut; //how the inner page will animate out
var portfolioPopupRatio = 0.9; //set the percent of the screen the popup will fill in the portfolios
var galleryPopupRatio = 0.8; //set the percent of the screen the popup will fill in the galleries
var playlistInterval = 5000; //time, in milliseconds (1000milliseconds = 1sec) that each image is displayed in playlist mode
var closeDescription = "close this popup window"; //translate - change this
var playlistDescription = "start / stop the automatic playlist"; //translate - change this
var fullscreenDescription = "show this image in full screen mode"; //translate - change this
var linkDescription = "see this item in detail"; //translate - change this
var maxImageColumns = 6; //the maximum number of columns in the column portfolio page
var host = "../index.html"; //your host address
var skin = "normal"; //select the skin you want to use - cherry, normal

var isGenma = true; //makes sure the page is loaded if someone visits the normal link for instance typography.html
var pageHash = window.location.hash; //current hash - gets transformed into a url and ajax loaded
var anchorage = homePage+pageType; //current page / link to load
var doit; //to make the resize event not fire constantly in Firefox, Chrome, etc when resizing
var doit2; //to make the resize event not fire constantly in Firefox, Chrome, etc when resizing
var playlistOn = false; //playlist on or off - leave this off
var playlist; //the playlist interval variable
var menuOpen = true; //if the menu is visible or not
var tabletMenuOpen = false; //if the tablet menu is extended or not 
var flag = ""; //variable that acts as a flag; if true, a validation error occured
var portfolioItem = 1; //current portfolio item

$(document).ready(function(){
	//change the main CSS according to the skin selected
	$(document).on("click", ".skin", function(){

		$(".shine-hover").remove();
		skin = $(this).attr("title");
		changeSkin();

	});

	//check if host parameter is added, else set it via Javascript
	checkForHost();

	//bind the hash change event to appropriate handler
	$(window).on('hashchange', function() {

		//load the clicked hash - index page instead
	    loadHash();

	    //update the google analytics code
	    _gaq.push(['_trackPageview',host + location.hash]);

	});

	//link click handler
	$(document).on("click", "a", linkage);

	//adjust main wrapper dimensions
	adjustMainWrapper();

	//load the clicked hash - index page instead
	loadHash();

});

$(window).resize(function() {

	clearTimeout(doit2);
    doit2 = setTimeout(function(){
        
    	//adjust main wrapper dimensions
		adjustMainWrapper();
        
    }, 50);

});


//function that readjusts main-wrapper sizes according to the client screen size / resizes
function adjustMainWrapper(){

	var clientWidth = getClientWidth();
	var clientHeight = getClientHeight();

	var menuWidth = $("#menu-wrapper").width();
	var menuLeft = $("#menu-wrapper").css("left");

	menuLeft = parseInt(menuLeft.split("px")[0]);

	$("#main-wrapper").css({"height":"", "top":""}).width(clientWidth - menuWidth - menuLeft);
	$("#menu-wrapper").css({"height":"", "top":""});

	if(clientWidth > 980){

	}
	else{
		
	}
}

//get client window width
function getClientWidth(){

	return $(window).innerWidth();

}

//get client window height
function getClientHeight(){

	return $(window).innerHeight();

}

//load hash selected - home page instead
function loadHash(){

	pageHash = window.location.hash;

	//if there's a hash, load the appropriate page
	if (pageHash.length > 1) {
		anchorage = pageHash.split("#")[1]+pageType;
		loadContents(anchorage);
	}
	else
		loadContents(homePage+pageType);

}

//function that handles the ajax loading of the contents
function loadContents(anchorage){

	animateInAjax(function(){

		setTimeout(function(){

			//make the ajax call and get the content
			$.ajax({
			
				dataType: "html",
				method: "post",
				url: anchorage,
				statusCode: {
				
					//not found, get to 404 page
					404: function() {

						$.ajax({
			
							dataType: "html",
							method: "post",
							url: "404"+pageType
							
						}).success(function(responseText){
			
							//set animationType
							animationIn = null;
							animationOut = null;

							//append the content and animate back
							$("#main-wrapper").html(responseText);
							changeTitle(responseText);

							$("#main-wrapper").imagesLoaded(function(){

								//remove all tispys
								$(".tipsy").remove();
								animateBackFromAjax();

							});
						  
						});
					}
					
				}
				
			}).success(function(responseText){
			
				//set animationType
				animationIn = null;
				animationOut = null;

				//append the content and animate back
				$("#main-wrapper").html(responseText);
				changeTitle(responseText);

				$("#main-wrapper").imagesLoaded(function(){

					//remove all tispys
					$(".tipsy").remove();
					animateBackFromAjax();

				});
			  
			}).error(function(responseText){
			
				//not found, get to 404 page
				$.ajax({

					dataType: "html",
					method: "post",
					url: "404"+pageType
					
				}).success(function(responseText){
	
					//set animationType
					animationIn = null;
					animationOut = null;

					//append the content and animate back
					$("#main-wrapper").html(responseText);
					changeTitle(responseText);

					$("#main-wrapper").imagesLoaded(function(){

						//remove all tispys
						$(".tipsy").remove();
						animateBackFromAjax();

					});
				  
				});
			  
			});;

		}, animationLength); //slight delay added here

	});

}

//function starts the animation before the ajax load
function animateInAjax(callback){

	var pageTitleSpan = anchorage.replace(pageType," ").replace(/-/g, ' ');


	$("#loader").css("display","block");

	animateOut(function(){

		$("#loader").stop().animate({"opacity": "0.9"},{duration:animationLength, easing:"easeOutQuad", complete:function(){

			$("#pageTitle").stop().animate({"opacity": "1", "right":"80px"},{duration:animationLength, easing:"easeOutQuad"});
			$("#pageTitle").html(pageTitleSpan);
			callback();

		}});

	});

}

//function starts the animation after the ajax load
function animateBackFromAjax(){
	
	$("#pageTitle").stop().animate({"opacity": "0"},{duration:animationLength, easing:"easeOutQuad", complete:function(){

		//when the entire animation's complete, run the appropriate inner page animation and add the custom scrollbar
		$("#pageTitle").css("right","");
		$("#loader").stop().animate({"opacity":"0"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

			animateIn(function(){

				//add the custom scrollbar
				// ADRIAN
				$("#main-wrapper").css("display", "block");
				$("#loader").css("display","none");
				$("#light1").stop().css("backgroundPosition","0px -100px");
				$("#light2").stop().css("backgroundPosition","-3200px 30px");

			});

		}});		

	}});

}

//function that handles normal clicks
function linkage(evt){
 
    //prevent default redirection - that's only for crawlers
    evt.preventDefault();
    evt.stopPropagation();

    //ignore links with the 'ignore' class
    if(!$(this).hasClass("ignore")){

       var thisHash = $(this).attr("href").split(pageType);
       window.location.hash = "#"+thisHash[0];

    }
    //for external website "normal" links
    if($(this).hasClass("external"))
	window.open(
	  $(this).attr("href"),
	  '_blank'
	);
 
}

//function that takes care of the starting animation of the inner pages - the type of the animation is changed from withing the inner page
function animateIn(callback){

	var animationType = animationIn;
	var mainWrapper = $("#main-wrapper");

	switch(animationType){

		case("puzzle"):
			var counter = 1;
			var inertia = 4;
			var numOfItems = mainWrapper.find(".span1, .span2, .span3, .span4, .span5, .span6, .span7, .span8, .span10, .span11, .span12").length;

			mainWrapper.find(".inner").animate({"opacity":"1"},{duration:animationLength, easing:"easeInOutQuad"});

			mainWrapper.find(".span1, .span2, .span3, .span4, .span5, .span6, .span7, .span8, .span10, .span11, .span12").each(function(){

				var direction = 1 + Math.floor(Math.random() * 2);

				switch(direction){

					case(1):
						$(this).css({"margin-top":"-100px", "opacity":"0"});
						if(counter == numOfItems){

							$(this).delay(counter*animationLength/inertia).animate({"opacity":"1", "margin-top":"0px"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

								callback();

							}});

						}
						else
							$(this).delay(counter*animationLength/inertia).animate({"opacity":"1", "margin-top":"0px"},{duration:animationLength, easing:"easeInOutQuad"});

						counter++;
						inertia += 0.2;
						break;
					case(2):
						$(this).css({"margin-top":"100px", "opacity":"0"});
						if(counter == numOfItems){

							$(this).delay(counter*animationLength/inertia).animate({"opacity":"1", "margin-top":"0px"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

								callback();

							}});

						}
						else
							$(this).delay(counter*animationLength/inertia).animate({"opacity":"1", "margin-top":"0px"},{duration:animationLength, easing:"easeInOutQuad"});

						counter++;
						inertia += 0.2;
						break;

				}

			});
			break;

		case("dropping-blocks"):
			var counter = 1;
			var inertia = 4;
			var numOfItems = mainWrapper.find(".masonryImage, .galleryImage, .simpleImage").length;

			mainWrapper.find(".masonryImage, .galleryImage, .simpleImage").css("margin-top","-100px").each(function(){

				if(counter == numOfItems){

					$(this).delay(counter*animationLength/inertia).animate({"opacity":"1", "margin-top":"0px"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

						callback();

					}});

				}
				else
					$(this).delay(counter*animationLength/inertia).animate({"opacity":"1", "margin-top":"0px"},{duration:animationLength, easing:"easeInOutQuad"});

				counter++;
				inertia += 0.2;

			});
			break;

		case("expand-width"):
			mainWrapper.find(".inner").css({"width":"0px", "height":"100%"});
			mainWrapper.find(".inner").animate({"width":"100%", "opacity":"1"},{duration:animationLength*2, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;

		case("expand-height"):
			mainWrapper.find(".inner").css({"height":"0px", "width":"100%"});
			mainWrapper.find(".inner").animate({"height":"100%", "opacity":"1"},{duration:animationLength*2, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;

		case("left"):
			mainWrapper.find(".inner").css({"margin-left":"-100px"});
			mainWrapper.find(".inner").animate({"margin-left":"0px", "opacity":"1"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;

		case("top"):
			mainWrapper.find(".inner").css({"margin-top":"-100px"});
			mainWrapper.find(".inner").animate({"margin-top":"0px", "opacity":"1"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;

		case("bottom"):
			mainWrapper.find(".inner").css({"margin-top":"100px"});
			mainWrapper.find(".inner").animate({"margin-top":"0px", "opacity":"1"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;

		case("right"):
			mainWrapper.find(".inner").css({"margin-left":"100px"});
			mainWrapper.find(".inner").animate({"margin-left":"0px", "opacity":"1"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;
		
		default:
			callback();
			break;

	}

}

//function that takes care of the ending animation of the inner pages - the type of the animation is changed from withing the inner page
function animateOut(callback){

	var animationType = animationOut;
	var mainWrapper = $("#main-wrapper");

	switch(animationType){

		case("puzzle"):
			var counter = 1;
			var inertia = 2;
			var numOfItems = mainWrapper.find(".span1, .span2, .span3, .span4, .span5, .span6, .span7, .span8, .span10, .span11, .span12").length;

			mainWrapper.find(".span1, .span2, .span3, .span4, .span5, .span6, .span7, .span8, .span10, .span11, .span12").each(function(){

				var direction = 1 + Math.floor(Math.random() * 2);

				if(counter == numOfItems)
					mainWrapper.find(".inner").delay(counter*animationLength/inertia/2).animate({"opacity":"0"},{duration:animationLength, easing:"easeInOutQuad"});

				switch(direction){

					case(1):
						if(counter == numOfItems){

							$(this).delay(counter*animationLength/inertia).animate({"margin-top":"-100px", "opacity":"0"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

								callback();

							}});

						}
						else
							$(this).delay(counter*animationLength/inertia).animate({"margin-top":"-100px", "opacity":"0"},{duration:animationLength, easing:"easeInOutQuad"});

						counter++;
						inertia += 0.2;
						break;
					case(2):
						if(counter == numOfItems){

							$(this).delay(counter*animationLength/inertia).animate({"margin-top":"100px", "opacity":"0"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

								callback();

							}});

						}
						else
							$(this).delay(counter*animationLength/inertia).animate({"margin-top":"100px", "opacity":"0"},{duration:animationLength, easing:"easeInOutQuad"});

						counter++;
						inertia += 0.2;
						break;

				}

			});
			break;

		case("lifting-blocks"):
			var counter = 1;
			var inertia = 2;
			var numOfItems = mainWrapper.find(".masonryImage, .galleryImage, .simpleImage").length;

			mainWrapper.find(".masonryImage, .galleryImage, .simpleImage").each(function(){

				if(counter == numOfItems){

					$(this).delay(counter*animationLength/inertia).animate({"opacity":"0", "margin-top":"-100px"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

						callback();

					}});

				}
				else
					$(this).delay(counter*animationLength/inertia).animate({"opacity":"0", "margin-top":"-100px"},{duration:animationLength, easing:"easeInOutQuad"});

				counter++;
				inertia += 0.2;

			});
			break;
		
		case("expand-width"):
			mainWrapper.find(".inner").animate({"width":"0px", "height":"100%", "opacity":"0"},{duration:animationLength*2, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;

		case("expand-height"):
			mainWrapper.find(".inner").animate({"height":"0px", "width":"100%", "opacity":"0"},{duration:animationLength*2, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;

		case("right"):
			mainWrapper.find(".inner").animate({"margin-left":"100px", "opacity":"0"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;

		case("bottom"):
			mainWrapper.find(".inner").animate({"margin-top":"100px", "opacity":"0"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;

		case("top"):
			mainWrapper.find(".inner").animate({"margin-top":"-100px", "opacity":"0"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;

		case("left"):
			mainWrapper.find(".inner").animate({"margin-left":"-100px", "opacity":"0"},{duration:animationLength, easing:"easeInOutQuad", complete:function(){

				callback();

			}});
			break;

		default:
			callback();
			break;

	}

}

//function that adds dynamic elements to the DOM after checking if they exist
function addToDOM(where, item, checkfor){

	if(where.find(checkfor).length == 0)
		where.prepend(item);

}

//function that dynamically changes the TITLE attribute while changing content
function changeTitle(pageHTML){

	var titleMatch = pageHTML.match(/<title>(.*?)<\/title>/);
    var title = titleMatch[1];

	$(document).attr('title', title);

}

//change title attributes to data-title
function saveTitleAttr(){

	$(".galleryImage img.item").each(function(){

		$(this).attr("data-title", $(this).attr("title"));
		$(this).attr("title", "");

	});

}

//check if the host parameter is set, else use Javascript to set it
function checkForHost(){

	if(host.length === 0){

		host = document.location.href;
		host = host.substring(0, host.lastIndexOf("/"))+"/";

	}

}

//helper function that check for attributes
$.fn.hasAttr = function(name){  

	var attr = $(this).attr(name);
	return (typeof attr !== 'undefined' && attr !== false);

};