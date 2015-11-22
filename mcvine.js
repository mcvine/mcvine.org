
(function(mcvine, $, undefined) {

    mcvine.init = function(options) {
	
	$(function(){
	    $.getScript(
		"https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML",
		function () {
		    MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
		}
	    );
	    $.getScript("jquery-ui/jquery-ui.js");
	    $.getScript("flot/jquery.flot.js", options.onflot);
    
	    $('<div id="header" class="top">').insertBefore("#page");
	    $("#header").load("header.html");
	    $('<div id="footer" class="top">').insertAfter("#page");
	    $("#footer").load("footer.html");
	    
	});

    };
    
} (window.mcvine=window.mcvine || {}, jQuery));



