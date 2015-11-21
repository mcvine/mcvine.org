
(function(mcvine, $, undefined) {

    mcvine.loadPage = function(pgname, title) {
	
	$(function(){
	    $("#header").load("header.html");
	    $("#footer").load("footer.html");
	    $("#page").load(pgname);
	});
	$(document).ready(function() {
	    document.title = title;
	});
	
    };
    
} (window.mcvine=window.mcvine || {}, jQuery));



