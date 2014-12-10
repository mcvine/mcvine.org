(function(mcvine, $, undefined) {
  
  // UI
  mcvine.UI = {};
  //
  mcvine.UI.initSlicePlot = function(plotdiv) {
    mcvine.UI.hESliceUpdate(plotdiv);
    $("#update").click(function(){
	mcvine.UI.hESliceUpdate(plotdiv);
      });
    $("#Si_example").click(function(){
	populate_Si_exampleconfig();
	$("#update").click();
      });
  };
  function populate_Si_exampleconfig()
  {
    var rbase = "a = 5.431; \nrbase = [[1/a, 0,0], [0,1/a,0], [0,0,1/a]];";
    var haxis = new mcvine.Axis(-12, 0, 0);
    var Eaxis = new mcvine.Axis(0, 100, 0);
    var psiaxis = new mcvine.Axis(5, 90, 0);
    populate_exampleconfig(100, rbase, "-1,1,-1", "2,1,-1", haxis, 0, 0, Eaxis, psiaxis);
  }
  function populate_exampleconfig(Ei, rbase, u, v, haxis, k, l, Eaxis, psiaxis){
    $("#Ei").val(Ei);
    $("#rbase").val(rbase);
    $("#u").val(u);
    $("#v").val(v);
    $("#hmin").val(haxis.min);
    $("#hmax").val(haxis.max);
    $("#k").val(k);
    $("#l").val(l);
    $("#Emin").val(Eaxis.min);
    $("#Emax").val(Eaxis.max);
    $("#psimin").val(psiaxis.min);
    $("#psimax").val(psiaxis.max);
  }
  //
  mcvine.UI.hESliceUpdate = function(plotdiv) {
    var hmin = Number($("#hmin").val()), hmax = Number($("#hmax").val());
    var dh = (hmax-hmin)/80;
    var haxis = new mcvine.Axis(hmin, hmax, dh);

    var k = Number($("#k").val()), l = Number($("#l").val());
    
    var Emin = Number($("#Emin").val()), Emax = Number($("#Emax").val());
    var Eaxis=new mcvine.Axis(Emin, Emax, 0);
    
    var psimin = Number($("#psimin").val()), psimax = Number($("#psimax").val());
    var dpsi = Math.round((psimax-psimin)/8);
    var psiaxis = new mcvine.Axis(psimin, psimax, dpsi);
    
    var code = $("#rbase").text();
    eval(code); // got rbase
    var ra = numeric['*'](rbase[0], TWOPI); 
    var rb = numeric['*'](rbase[1], TWOPI); 
    var rc = numeric['*'](rbase[2], TWOPI);
    var u = s2v($("#u").val());
    var v = s2v($("#v").val());
    
    var xtalori = new mcvine.XtalOri(ra, rb, rc, u, v, 0);
    var Ei = Number($("#Ei").val());
    
    mcvine.plot_hE_curves(plotdiv, haxis, Eaxis, psiaxis, k, l, xtalori, Ei, mcvine.example.CBD_all);
  };
  function s2v(s)
  {
    return JSON.parse('['+s+']');
  }

  // examples
  mcvine.example = {};
  mcvine.example.CBD_all = function() {return 1;};
  mcvine.example.Si_xtalori = function() {
    var a = 5.431;
    var u= [-1,1,-1], v=[2,1,-1];
    var psi = 10 * DEG2RAD;
    var xtalori = new mcvine.XtalOri([TWOPI/a, 0,0], [0,TWOPI/a,0], [0,0,TWOPI/a], u, v, psi);
    return xtalori;
  };
  // plot one h-E curve. use a div like this: 
  // <div id="plot" style="width: 500px; height:300px;"></div>
  mcvine.example.plot_one_hE_curve = function(plotdiv){
    var haxis = new mcvine.Axis(-12, 0, 0.1), Eaxis=new mcvine.Axis(0, 100, 0);
    var k=0, l=0;
    var xtalori = mcvine.example.Si_xtalori();
    var Ei = 100;
    mcvine.plot_hE_curve(plotdiv, haxis, Eaxis, k, l, xtalori, Ei, mcvine.example.CBD_all);
  };
  // plot h-E curves. use a div like this: 
  // <div id="plot" style="width: 500px; height:300px;"></div>
  mcvine.example.plot_hE_curves = function(plotdiv){
    var haxis = new mcvine.Axis(-12, 0, 0.1), Eaxis=new mcvine.Axis(0, 100, 0);
    var psiaxis = new mcvine.Axis(5., 90., 15.);
    var k=0, l=0;
    var xtalori = mcvine.example.Si_xtalori();
    var Ei = 100;
    mcvine.plot_hE_curves(plotdiv, haxis, Eaxis, psiaxis, k, l, xtalori, Ei, mcvine.example.CBD_all);
  };
  
  // implementations
  var SE2K = 0.69469209;
  var KS2E = 2.0721218464;
  var DEG2RAD = Math.PI/180;
  var PI = Math.PI, TWOPI = 2.*PI;
  
  mcvine.Axis = function (min, max, delta) {
    this.min = min; this.max = max; this.delta = delta;
  }
  
  mcvine.XtalOri = function (ra, rb, rc, u, v, psi)
  {
    this.ra = ra; this.rb = rb; this.rc = rc;
    this.u = u; this.v = v; this.psi = psi;
  }
  
  mcvine.plot_hE_curves = function(div, haxis, Eaxis, psiaxis, k, l, xtalori, Ei, covered_by_detector) {
    var data = [];
    for (var psi=psiaxis.min; psi<psiaxis.max+psiaxis.delta/2; psi+=psiaxis.delta) {
      xtalori.psi = psi * DEG2RAD;
      var data1 = mcvine.compute_hE_curve 
	(haxis.min, haxis.max, haxis.delta, k, l, xtalori, Ei, covered_by_detector);
      data.push({"data":data1, label:psi});
    }
    var options = {legend:{position:"nw"}, yaxis:{min:Eaxis.min, max:Eaxis.max}};
    $.plot($('#'+div), data, options);
  };
  
  mcvine.plot_hE_curve = function(div, haxis, Eaxis, k, l, xtalori, Ei, covered_by_detector) {
    var data = mcvine.compute_hE_curve 
    (haxis.min, haxis.max, haxis.delta, k, l, xtalori, Ei, covered_by_detector);
    var options = {yaxis:{min:Eaxis.min, max:Eaxis.max}};
    $.plot($('#'+div), [data], options);
  };
  
  mcvine.compute_hE_curve = function(hmin, hmax, dh, k, l, xtalori, Ei, covered_by_detector) {
    
    var mat = xtalori2mat(xtalori);
    var data = []
    var ki = SE2K * Math.sqrt(Ei);
    var kiv = [ki, 0, 0];
    
    for (var h = hmin; h < hmax; h += dh) {
      var hkl = [h, k, l];
      var Q = numeric.dot(hkl, mat);
      var kfv = numeric['-'](kiv, Q);
      var kf2 = numeric.norm2Squared(kfv);
      var kf = Math.sqrt(kf2);
      
      var theta = Math.atan2(kfv[1], kfv[0]);
      var phi = Math.asin(kfv[2], kf);

      if (covered_by_detector(theta, phi)) {
	var Ef = kf2*KS2E;
	var E = Ei - Ef;
	data.push([h, E]);
      }
    }
    return data;
  };

  function cross(a, b)
  {
    return [ a[1]*b[2] - a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0] ];
  }
  function normalized(v)
  {
    return numeric['/'](v, numeric.norm2(v));
  }
  
  function xtalori2mat(xtalori)
  {
    var r = [xtalori.ra, xtalori.rb, xtalori.rc];
    // compute u, v in cartesian coordinate system
    var u_cart = numeric.dot(xtalori.u, r);
    var v_cart = numeric.dot(xtalori.v, r);
    // normalize them
    u_cart=normalized(u_cart);
    v_cart = normalized(v_cart);
    // u and v is not necesarily perpendicular to each other
    // let us compute z first
    var ez = cross(u_cart, v_cart); ez=normalized(ez);
    // now we can compute vprime, a unit vector perpedicular to
    // u_cart and ez
    var vprime_cart = cross(ez, u_cart);
    // rotate u, v by psi angle to obtain x,y unit vectors
    var psi = xtalori.psi;
    var ex = numeric['-'](numeric['*'](u_cart, Math.cos(psi)), numeric['*'](vprime_cart, Math.sin(psi)));
    var ey = numeric['+'](numeric['*'](u_cart, Math.sin(psi)), numeric['*'](vprime_cart, Math.cos(psi)));
    
    // ex, ey, ez are representation of unit vectors
    // of the instrument coordinate system in CCSC
    var T = [ex, ey, ez];
    var T1 = numeric.transpose(T);
    var eh = numeric.dot(xtalori.ra, T1), ek = numeric.dot(xtalori.rb, T1), el = numeric.dot(xtalori.rc, T1);
    return [eh, ek, el];
  }

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



