
(function(mcvine, $, undefined) {

    $.getScript("https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML");
    $.getScript("jquery-ui/jquery-ui.js");
    $.getScript("flot/jquery.flot.js");
    
    mcvine.init = function() {
	
	$(function(){
	    $('<div id="header" class="top">').insertBefore("#page");
	    $("#header").load("header.html");
	    $('<div id="footer" class="top">').insertAfter("#page");
	    $("#footer").load("footer.html");
	    
	    // this line has to be the last
	    MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
	});
	
    };
    
} (window.mcvine=window.mcvine || {}, jQuery));



