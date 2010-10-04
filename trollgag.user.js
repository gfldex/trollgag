// ==UserScript==
// @name          Troll Gag
// @namespace     http://dexhome.homelinux.org/
// @author	  Wenzel P. P. Peppmeyer
// @description   Block posts by ppl you dont want to read on http://www.eveonline.com/ingameboard.asp
// @namespace http://dexhome.homelinux.org/
// @include       http://www.eveonline.com/ingameboard.asp?a=topic&threadID=*
// ==/UserScript==
//
// --------------------------------------------------------------------
//
// TrollGag user script
// version 0.1 BETA!
// 2005-04-22
// Copyright (c) 2010, Wenzel P. P. Peppmeyer
// Released into the public domain
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "TrollGag", and click Uninstall.

GM_addStyle("#trollHeader {\
	padding-left: 10px;\
	padding-top: 2px;\
	font-size: 10px;\
	cursor: default;\
}\
\
#trollHeader:hover {\
	color: #ffa500;\
}\
\
#trollBox {\
	font-size: 8px;\
	overflow: auto;\
}\
\
#trollBox ul, #dialog ul {\
	list-style-type: none;\
	padding-left: 10px;\
	font-size: 8pt;\
}\
\
#dialog ul {\
	font-size: 10pt;\
}\
\
body#dialog {\
	background: #4D4D57;\
	color: #f0f0f0;\
}\
\
span.trollButton {\
	font-size: 8px;\
	cursor: default;\
	padding: 2px;\
	margin: 2px;\
	border-width: 1px;\
	border-style: outset;\
	border-color: #b0b0b0;\
	background-color: #3c3b43;\
}\
\
span.trollButton:hover {\
	color: #ffa500;\
}\
\
img.add {\
	padding-top: -64px;\
}\
\
body#dialog .trollButton {\
	font-size: 8pt;\
}\
\
body#dialog textarea {\
	width: 100%;\
	display: none;\
}');");

if(console)
  console = unsafeWindow.console;
else
  console = {
    log: function(){}
  };
storage = unsafeWindow.localStorage;

function extend(_obj, _obj2){
  for(var e in _obj2){
    if(_obj2.hasOwnProperty(e)){
      _obj[e] = _obj2[e];
    }
  }
}

HTMLElementFunctionFactory = function (_elementName){
  var nameSpace = {};
  for(var i = 0; i < arguments.length; i++){
    var elementName = arguments[i];
    var defaultOptions = {};

    if(Array.prototype.isPrototypeOf(elementName)){
      defaultOptions = elementName[1];
      elementName = elementName[0];
    }

    if(elementName == "text"){
      var f = function(){ return function(_text){
			    return document.createTextNode(_text)
			  }; };
    }else{
      var f = function (){
	var c_elementName = elementName;
	var c_defaultOptions = defaultOptions;
	return function(){
	  var retval = document.createElement(c_elementName);
	  for(var j = 0;j < arguments.length; j++){
	    for(var attr_name in c_defaultOptions){
	      retval.setAttribute(attr_name, c_defaultOptions[attr_name]);
	    }

	    if(arguments[j].nodeType){
	      retval.appendChild(arguments[j]);
	    }	else {
	      for(attr_name in arguments[j]){
		retval.setAttribute(attr_name, arguments[j][attr_name]);
	      }
	    }
	  }
	  return retval;
	};
      };
    }
    nameSpace[elementName] = f();
  }
  return nameSpace;
};

extend(window, HTMLElementFunctionFactory("img", "div", "text", "ul", "li", "span", "br", "textarea"));

trolls = {
  __trolls: [],
  forEach: function(){
    this.__trolls.forEach.apply(this.__trolls, arguments);
  },
  join: function(){
    return this.__trolls.join.apply(this.__trolls, arguments);
  },
  push: function(){
    var tmp = this.__trolls.push.apply(this.__trolls, arguments);
    this.store();
    return tmp;
  },
  splice: function(){
    var tmp = this.__trolls.splice.apply(this.__trolls, arguments);
    this.store();
    return tmp;
  },
  indexOf: function(){
    return this.__trolls.indexOf.apply(this.__trolls, arguments);
  },
  load: function(){
    this.__trolls = eval(String(storage.trolls));
    if(!Array.prototype.isPrototypeOf(this.__trolls))
      this.__trolls = [];

    return this;
  },
  store: function(){
    storage.trolls = uneval(this.__trolls);

    return this;
  }
};

var f = function(){
  var posts = []; //{posterName: String, trollButton: HTMLSpan, tableRow: HTMLTableRow}
  var onPageDialog;
  var trollCfgWindow;
  var trollButtonAddDATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABL2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjarY69SsNQHEfPbUXBIYgEN+HiIC7ix9YxaUsRHGoUSbI1yaWKNrncXD86+RI+hIOLo6BvUHEQnHwEN0EcHBwiZHAQwTOd/xn+/KCx4nX8bmMORrk1Qc+XYRTLmUemaQLAIC211+9vA+RFrvjB+zMC4GnV6/hd/sZsqo0FPoHNTJUpiHUgO7PagrgE3ORIWxBXgGv2gjaIO8AZVj4BnKTyF8AxYRSDeAXcYRjF0ABwk8pdwLXq3AK0Cz02h8MDKzdarZb0siJRcndcWjUq5VaeFkYXZmBVBlT7qt2e1sdKBj2f/yWMYlnZ2w4CEAuTutWkJ+b0W4V4+P2uf4zvwQtg6rZu+x9wvQaLzbotL8H8BdzoL/HAUD36i+bmAAAABGdBTUEAANjr9RwUqgAAACBjSFJNAAB6JQAAgIMAAPQlAACE0QAAbV8AAOhsAAA8iwAAG1iD5wd4AAADQElEQVR42mSTy2tcZRjGf9/5vjMzZ87MZGYymWQSG6Wxpk0gqSTVVF0IVaQFF0YQSq0Fuyiif4B/gLiybkQ34sqFihvBuggFMRovDbZCeotWbZuYhEwy98zMybl8n4tZqPjAu3su8PC84vSxFP+GNpByDMX+4Wfy7vpb2b7sdDKV86VKrtjB3Vf9wLsThj5CCADE/ww0pJLGPj4RfVppWvMdr8vIUJYDB8epNjK3bl6/cbLV2l6zLAWAJYD/nIC0W/hAWGL+1Ok3eHDiJKt3avz2612U8ie0cd7uMXtQSeuf9AjwASFEyxcj4cGpp9WRx+b5anCE61cuE6xt0A203NhVSNkTyuhRh03XYi1lEdkwagzNdnXRSR948YnZqWLMNoxPP87YkaOsLC/frFTrr4dBZzdmK5QUqPvpnpMB1iIYLA1xKjPs/VXr1HW3BlEdbJdCCqLI/iPj6NWOPEr80BnsuECmJx2kAWnAwmJVd0jkMgwM5a+quv/86FA6Q7jH94u/bHRC+Zqdnd3So2fxNVhK0asSA8IAlpNUscxnW7dM2k47PyzPrRWK/kg8qXn/8uH62OTItfVyIPOFKMIEPVn+3CB2bB8l63jV7MdzM8dfTqdcGuvKe2H8gjg2MxqXEhoNbb68dLveqLXXnaR5LzTtTywZtRVIECn6Ev3YUpdmzl7DEg7fXHw4UUrnaO1YyESEikXi3CvTuXzOzb17celDr7s3hI4uydRsJm5psRjtqwv57MChsad2Ul0vzu0rFivby3z95xcMFwscLk0iMPhBiONqlpbuD7quaimnpGxlyyefPVMByrRDQ9NrMXW+QRD9zsJHgnU9S6HvJcqNHe7dK7NdruI4sUdqu/o5VQ13jNkXbO3uM5yHalPTDfcQviIAKsUQP9A06wFb5SatvX1sO0YirpSJ6YQYPu8qrxZfMJHI2TJhnXhzcxrH8N07pU1vo79mecWtQnfOT8tiEOpQGG0wRuP7Ecbwo5JahMl0cCLwBIFvFgquZOABzbdWu9Jf6p/q/jxOFIvwo5BIRxhjMBjC0BCGurcDI8AojQjRP32eDBJJ7LijK/GHboDUiKvzyJgFopduDISi93h/DwCBlnQWovsJogAAAABJRU5ErkJggg==";
  var trollButtonRemoveDATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAADOklEQVR42lSSX0xbdRTHP/dPube9QO34U2h1QgSZOLMhkcUlkwGJ0wwkOucfXkw0wIOJZol7GEansmDUiS4zi0tcnJnbNItmi3swZRKyZDizMRcVpGMIGmYLtEAp3PWW2/vzoYrbSb45L9/zzfd7zpGEEOzdWcmt5QgNjVHZ8CixQIHsq6wKhI+ewXx84x8PfjuYh6GLVa4KIMnqbQL2ivrw+rXO8YGLGd9fbrjJctXuXU28865HaMqwJIS2ypUBRDpyG9Lm5B5DEeU9R0+jGHfyzVfT9IcGaawvADnY5cop5T+oAJdMNw5wTyarmkim3ZGkgW9dK/vPPkZvZyPnQoNU1wg0XTfUWwxLQggixRKlafCVQK0FszF4paNBvLSvG8wVKKiD5HU6t20YuR7hfo87O2zN/Rsh4obpPPhgqoSpBZhZgpFwNIYdh/GfYOwM5FkECoPVaRPEElh/wqZ9k1kHV+6WCDrw8RSUXRB0as+zqFfeGzp1Kfx0xw5QbI7vfY+LqZ1SRZFNNNiOIuIsRn/NOgDwSNkuZq7w2th+etd3X2Pttq9PHjxJ6JOPaD/WOuAue5LPfliHuvQzqfjY/2csdMGRcY9IYsaEz1+kpZUOGw5Pvt5DR2QGyQGzm61bmw6I2RvxhKAyCCyvCnwxjnjjN2DeKOxseVnUlyVp+/IQTsqmNxjkvu+u4rXn6OtrxyW7vK0tJ5aqNzmN1oo4LwNoAH9bLP4uOHwgRNtb/SzrpRCbIM9KUBpYQ67HYHQ4xoot+PxYM+fORk/lunO2qwBNBlLXo5mB7hfMeqsZtKEXkeIHefXIZbpSS4jpReQCAwGcvxDm8tAIhcWGATlbVIDocnaBiq2iXPVD4Ec8C/lkWIMH8PrzyVg3mZhK4HIJ6urKSSxk9NGR+edUgLCC6NmlwhPNsOAFOwEbPRwqlXnfdQdvF735i9dlSvk6OciyMz9nBXY8U/7h5s3+71UAdwaofQCKS2h55NNBBQpOD7VVUZvLXXZiQmvcvqEy0o+uONiOQNdMFFXCsjLZR2qUJJ7V9GuzVupGLTRkgGEYU3KQatJU1AAPPdVHRTKM7QjiMZMtDX5KSnT+GQDy11Unb++BqAAAAABJRU5ErkJggg==";
  var trollButtonShowDATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAggAAAIIBsKhZvgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKkSURBVDiNlZJbSBNwFId//23enVPn8B7OpZZoIaZhISYmGkSYgQqSXSjpIUp0SaYSJvXiLCsIMrIMSoXQh2hq5uXBLrOlZjo0GjO1DS9zbcupy3l6CMFLhn1wHs7D+c7vwGFEhBWYlLkAOB4dII73E4gClePqDzqTXk4yascmsBWBXSE3+URMTJ0vXyjQmizfbORi8HRyCvJwEnq1jPS0vx3tyyIZzWwwEBFQgJ2lzQnW2KptHW+ULbnmye+aZZttkojel7eVX7n04rTpwL24dyj4s3B1cQAgLSKkQTU1Pd4zPpbqOmrOVnfKg3T9nTMAhksOlqCiq+bIoR2Je7kcbvb6ABwmZY4SoXu4qUb1q1qJM4rq+7UjrY2LBo2qo7uqzPz8VFgwyairTzv4JSYw6uh6AQ+AmEBcn1nwyR3+ua1txWWJ7EnGMTkVu7ImSRyiAUCjHxsKFkoi/iZQcxhbaorHTYkKtwEgXAQCYJufw0mLCQIACBVJooYmvyo2nEAysn7WTSvT43dLrZPIe5jEFGYDLDXJrCsyGSnnFaThFfLSIn3DxL0Tnxo2CACgdWQ0U2Dv6DGUIa7o1SLWaoE9gIQl4HFIvtO1oqSz9U8/PtKIXByGN/2DxD0szysz9FZohATzxiVYjHNw8/UHOI7UqH45U54VIVQNTunkA7rG3gmjlCrJukYAABft2FX1duT+9LHz44ndDfqF6Vf9frguCnArPZezK32fJ5/rrF+0Fdf1K7o1s4epkgxY/xhEhEKAv7pHPniiu4L2y3MJVE8p1D2fQqkPvAf4RbzgNQn+BStgfA+xQJ6RE7k/2s2ZBdsYbtT0veZsaRoAVZLZoDEmP6sdaGvW/VjuNFlIu2C1bjnBqiRcB2/nC/YEF/OU5c5/C9bzGwvBT8kVzIllAAAAAElFTkSuQmCC";

  var onload = function(){
    var posters = document.evaluate("//div[@id=\"content\"]/table[3]/*/*/*/table/*/tr/td[1]/b/span", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    var posterNames = [];

    trolls.load();

    for(var i=0, poster;(poster = posters.snapshotItem(i)) && i < posters.snapshotLength; i++){
      var untrollRow, untrollButton, posterName;

      poster.parentRow = poster.parentNode.parentNode.parentNode;
      posterNames.push(posterName = poster.textContent);

      //Adding troll Button below poster name
      //trollButton = span({"class": "trollButton"}, text("Troll!"));
      var trollButton = img({"class": "trollButton add", "src": trollButtonAddDATA});
      poster.parentNode.parentNode.insertBefore(trollButton, poster.parentNode.parentNode.firstChild.nextSibling);

      trollButton.clickHander = function(){
	addTroll(this.post.posterName);
      };

      trollButton.addEventListener("click", function(){ var _this = trollButton; return function(){ _this.clickHander() }; }(), true);

      posts.push(trollButton.post = {posterName: posterName, trollButton: trollButton, tableRow: poster.parentRow});
    }

    onPageDialog = createOnPageDialog();
    onPageDialog.update();
    updateTable();
  };

  var createOnPageDialog = function(){
    var dialog = div({"id": "trollBox", "class": "boxHref"});
    var title = div({"id": "trollHeader", "class": "boxHeader"}, text("Troll Control"));
    title.addEventListener("click", function(){
      trollCfgWindow = window.open("", "Troll Management", "outerWidth=600,outerHeight=400,resizable,scrollbars");

      var CSS = trollCfgWindow.document.createElement("link");
      CSS.setAttribute("rel", "stylesheet");
      CSS.setAttribute("href", "http://dexhome.homelinux.org/~dex/js/trollgag-eveonline.css");

      trollCfgWindow.window.document.getElementsByTagName("head").item(0).appendChild(CSS);

      //trollCfgWindow.window.trolls = trolls;
      trollCfgWindow.document.body.setAttribute("id", "dialog");
      trollCfgWindow.window.update = function(){

      while(this.document.body.firstChild)
	this.document.body.removeChild(this.document.body.firstChild);

	var importButton, exportButton, inout;
	this.document.body.appendChild(
	  div({"id": "exportContainer"},
	    importButton = span({"class": "trollButton"}, text("import")),
	    exportButton = span({"class": "trollButton"}, text("export")),
	    br(),
	    div(inout = textarea())
	  )
	);

	importButton.inout = exportButton.inout = inout;
	importButton.addEventListener("mouseover", function(_e){ inout.style.display = "block"; }, true);
	exportButton.addEventListener("mouseover", function(_e){ inout.style.display = "block"; }, true);
	exportButton.addEventListener("click", function(){
	  inout.value = trolls.join(",");
	},true);
	importButton.addEventListener("click", function(){
	  var newTrolls = String(inout.value).split(",");
	  newTrolls.forEach(function(_i){
	    addTroll(_i);
	  });
	},true);

	var trollList = ul();
	trolls.forEach(function(_e){
	  //var removeButton = span({"class": "trollButton"}, text("remove"));
	  var removeButton = img({"class": "trollButton add", "src": trollButtonRemoveDATA});
	  removeButton.addEventListener("click", function(){ removeTroll(_e); }, true);
	  trollList.appendChild(li(text(_e), removeButton));
	});

	this.document.body.appendChild(trollList);
      };
      trollCfgWindow.window.update();
  }, true);

    var rc = document.getElementById("rightcontent");
    var searchBox = rc.firstChild;
    rc.insertBefore(title, searchBox);
    rc.insertBefore(img({"src": "/bitmaps/interface/end_box.gif"}), searchBox);
    rc.insertBefore(dialog, searchBox);

    dialog.update = function(){
      while(this.firstChild)
	this.removeChild(this.firstChild);

      //display all posters on this page that are in the troll list
      var trollList = ul();

      trolls.forEach(function(_e){
		       if(posts.some(function(_p){ return _e == _p.posterName; })){

			 //var removeButton = span({"class": "trollButton"}, text("remove"));
			 var removeButton = img({"class": "trollButton remove", "src": trollButtonRemoveDATA});
			 //var showButton = span({"class": "trollButton"}, text("show"));
			 var showButton = img({"class": "trollButton remove", "src": trollButtonShowDATA});

			 removeButton.addEventListener("click", function(){ removeTroll(_e) }, true);
			 showButton.addEventListener("click", function(){
						       posts.forEach(function(_p){
								       if(_e == _p.posterName)
									 _p.tableRow.style.display = "table-row";
								     });
						     }, true);

			 trollList.appendChild(li(text(_e), removeButton, showButton));
		       }
		     });

      this.appendChild(trollList);

      function removeButtonFactor(){
	return div;
      };
    };

    return dialog;
  };

  var addTroll = function(_t){
    if(_t == "gfldex")
      throw TypeError("A God ain't no troll!");

    trolls.push(_t);

    updateTable();
    onPageDialog.update();
    if(trollCfgWindow)
      trollCfgWindow.window.update();
  };

  var removeTroll = function(_t){
    trolls.splice(trolls.indexOf(_t),1);
    updateTable();
    onPageDialog.update();
    if(trollCfgWindow)
      trollCfgWindow.window.update();
  };

  var updateTable = function(){
    posts.forEach(function(_e){
		    if(trolls.indexOf(_e.posterName) > -1){
		      _e.tableRow.style.display = "none";
		    }else{
		      _e.tableRow.style.display = "table-row";
		    }
		  });
  };

  var mark = function(_e){
    _e.style.borderColor = "#ff0000";
    _e.style.borderWidth = "1px";
    _e.style.borderStyle = "solid";
  };

  //window.addEventListener("load", function(){ onload(); }, true);

  onload();
/*
  unsafeWindow.trollGag = {
    addTroll: addTroll,
    removeTroll: removeTroll,
    getTrolls: function(){ return trolls; }
  };
*/
}();
