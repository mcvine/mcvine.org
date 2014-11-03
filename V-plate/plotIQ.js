
(function(mcvine, $, undefined) {
  
  mcvine.plotIQ = function(plotdiv, CDW) {
    
    var IQ = []
    for (var Q = 0; Q < 14; Q += 0.2) {
      IQ.push([Q, Q*Q*Math.exp(-CDW*Q*Q)]);
    }
    
    $.plot(plotdiv, [ IQ ]);

  };

  mcvine.createInteractiveIQPlot = function(divid) {
    var block = $('#'+divid);
    var plotdiv = block.find("#IQ_plot");
    var ctrldiv = block.find('#IQ_plot_contoller_container');
    var cdwval = block.find('#CDW_value');
    
    function updateIQplot(logCDW) {
      var CDW = Math.pow(10, logCDW);
      mcvine.plotIQ(plotdiv, CDW);
      cdwval.text(CDW);
    };
    
    var initval = -3;
    $( "#IQ_plot_CDW_slider" ).slider({
      orientation: "vertical",
	  range: "min",
	  min: -4,
	  max: 0,
	  step: 0.01,
	  value: initval,
	  slide: function( event, ui ) {
	  updateIQplot(ui.value);
	}
      });

    updateIQplot(initval);
  };
  
 } (window.mcvine=window.mcvine || {}, jQuery));



