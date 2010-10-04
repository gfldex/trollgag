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

unsaveWindow.org = {};
