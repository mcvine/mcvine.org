
(function(mcvine, $, undefined) {
  
  mcvine.plotIQ = function(plotdiv, CDW, Qmax) {
    
    var IQ = []
    for (var Q = 0; Q < Qmax; Q += 0.2) {
      IQ.push([Q, Q*Q*Math.exp(-CDW*Q*Q)]);
    }
    
    $.plot(plotdiv, [ IQ ]);

  };

  mcvine.createInteractiveIQPlot = function(divid) {
    var block = $('#'+divid);
    var plotdiv = block.find("#IQ_plot");
    var ctrldiv = block.find('#IQ_plot_contoller_container');
    var cdwval = block.find('#CDW_value');
    var Qmaxval = block.find('#Qmax_value');
    
    function updateIQplot(logCDW, Qmax) {
      var CDW = Math.pow(10, logCDW);
      mcvine.plotIQ(plotdiv, CDW, Qmax);
      cdwval.text(CDW);
      Qmaxval.text(Qmax);
    };
    
    var initCDW = -3;
    $( "#IQ_plot_CDW_slider" ).slider({
      orientation: "horizontal",
	  range: "min",
	  min: -4,
	  max: 0,
	  step: 0.01,
	  value: initCDW,
	  slide: function( event, ui ) {
	  updateIQplot(ui.value, $("#IQ_plot_Qmax_slider").slider("value"));
	}
      });
    var initQmax = 12;
    $( '#IQ_plot_Qmax_slider').slider({
      range:"min",
	  min: 0,
	  max: 50,
	  step: 1,
	  value: initQmax,
	  slide: function( event, ui ) {
	  updateIQplot($("#IQ_plot_CDW_slider").slider("value"), ui.value);
	}
      }); 

    updateIQplot(initCDW, initQmax);
  };
  
  
  var kelvin2mev = 0.0862;
  function thermalF(E, T)
  {
    var t = 1./Math.tanh(Math.abs(E)/2./(kelvin2mev*T));
    if(E>0) return (t+1)/2;
    else return (t-1)/2;
  }

  mcvine.plotThermIE = function(plotdiv, T) {
    
    var ThermIE = []
    for (var E = -60; E < 60; E += 0.5) {
      ThermIE.push([E, thermalF(E, T)]);
    }
    
    $.plot(plotdiv, [ ThermIE ], {yaxis: {max: 6}});

  };

  mcvine.createInteractiveThermIEPlot = function(divid) {
    var block = $('#'+divid);
    var plotdiv = block.find("#ThermIE_plot");
    var ctrldiv = block.find('#ThermIE_plot_contoller_container');
    var Tval = block.find('#T_value');
    
    function updateThermIEplot(T) {
      mcvine.plotThermIE(plotdiv, T);
      Tval.text(T);
    };
    
    var initval = 300;
    $( "#ThermIE_plot_T_slider" ).slider({
      orientation: "horizontal",
	  range: "min",
	  min: 1,
	  max: 1200,
	  step: 10,
	  value: initval,
	  slide: function( event, ui ) {
	  updateThermIEplot(ui.value);
	}
      });

    updateThermIEplot(initval);
  };
  

 } (window.mcvine=window.mcvine || {}, jQuery));



