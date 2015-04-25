/* --- Swazz Javascript Calendar ---
/* --- v 1.0 3rd November 2006
By Oliver Bryant
http://calendar.swazz.org */

var isEdweb = (window.location.href.indexOf("MarketData")>-1);
var historicalDates;
Array.prototype.contains = function (d) {
	for (var h_d in this) {
		if (this[h_d] == d) {
			return true;
		}
	}
	return false;
}


function getObj(objID) {
    if (document.getElementById) {return document.getElementById(objID);}
    else if (document.all) {return document.all[objID];}
    else if (document.layers) {return document.layers[objID];}
}

function checkClick(e) {
	e?evt=e:evt=event;
	CSE=evt.target?evt.target:evt.srcElement;
	if (getObj('fc'))
		if (!isChild(CSE,getObj('fc')))
			getObj('fc').style.display='none';
}

function isChild(s,d) {
	while(s) {
		if (s==d) 
			return true;
		s=s.parentNode;
	}
	return false;
}

function Left(obj) {
	var curleft = -40;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
	return curleft;
}

function Top(obj) {
	var curtop = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
	return curtop;
}

document.write('<div id="fc" class="calendar" style="position:absolute;display:none;left:0px;top:0px;z-index: 5;">');	
document.write('<table class="wp-calendar" cellspacing="1">');
document.write('<thead><tr><td colspan="7" class="calendar-caption" align="center">');
document.write('<table border="0" cellspacing="0" cellpadding="1" width="100%">');
document.write('<td class="spacer">&nbsp;</td>');
document.write('<td><table class="calendar-title" cellspacing="0" cellpadding="0" width="100%">');
//temporarily hide previous and next month buttons
document.write('<tr><td id="prevmos" class="calendar-title-prev"><a href="javascript:csubm()">&lt;</a></td>'); 
document.write('<td id="mns" align="center"></td>');
//temporarily hide previous and next month buttons
document.write('<td id="nextmos" class="calendar-title-next"><a href="javascript:caddm()">&gt;</a></td>');
document.write('</tr></table></td><td class="spacer">&nbsp;</td></table>');
document.write('</td></tr><tr>');
document.write('<th abbr="Sunday" title="Sunday">S</th>');
document.write('<th abbr="Monday" title="Monday">M</th>');
document.write('<th abbr="Tuesday" title="Tuesday">T</th>');
document.write('<th abbr="Wednesday" title="Wednesday">W</th>');
document.write('<th abbr="Thursday" title="Thursday">T</th>');
document.write('<th abbr="Friday" title="Friday">F</th>');
document.write('<th abbr="Saturday" title="Saturday">S</th>');
document.write('</tr></thead>');
document.write('<tbody>');
document.write('<div id="savedrow" style="visibility: hidden"></div>');

for(var kk=1;kk<=6;kk++) {
	// identify each row, 1..6
	document.write('<tr id="row' + kk + '" style="visibility: visible;">');
	for(var tt=1;tt<=7;tt++) {
		num=7 * (kk-1) - (-tt);
		document.write('<td id="v' + num + '">&nbsp;</td>');
	}
	document.write('</tr>');
}
var currlink = window.location.href;
currlink = currlink.replace(/-(\d{8})/,"");
document.write('<tr id="row7"><td colspan="7" class="calendar-caption">');
document.write('<a id="seecurrent" class="link11 unvisited" style="font-weight: normal" href="' + currlink + '">see current data</a></td></tr>')
document.write('</tbody>');
document.write('</table></div>');

document.all?document.attachEvent('onclick',checkClick):document.addEventListener('click',checkClick,false);


// Calendar script
var now = new Date;
var sccm=now.getMonth();
var sccy=now.getFullYear();
var sccd=now.getDate();
var ccd=now.getDate();
var ccm=now.getMonth();
var ccy=now.getFullYear();
var dccd=now.getDate();
var dccm=now.getMonth();
var dccy=now.getFullYear();
// earliest date to display
var minm=4; // starts at 0
var miny=2007;
// initialize to current year and month.
// after retrieving historical dates,
// reset the values to the maximum historical date
var maxm=sccm;
var maxy=sccy;

var updobj;
function lcs(ielem) {
	updobj=ielem;
	var calPanel = getObj('fc');
	calPanel.style.left=Left(ielem)+"px";
	calPanel.style.top=(Top(ielem)+ielem.offsetHeight)+"px";
	calPanel.style.display='';
	
	// First check date is valid
	var curdt="";
	if (updobj.value)
		curdt=updobj.value;
	else if (typeof tableDate != 'undefined')
		curdt=tableDate;
	if (curdt.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
		curdtarr=curdt.split("/");
		isdt=true;
		for(var k=0;k<curdtarr.length;k++) {
			if (isNaN(curdtarr[k]))
				isdt=false;
		}
		if (isdt&(curdtarr.length==3)) {
			dccm=ccm=curdtarr[0]-1;
			dccd=ccd=curdtarr[1];
			dccy=ccy=curdtarr[2];
		}
	} else {
		ccd = '';
	}
	if (ielem.id.indexOf("_")>-1){ //id with table file name
		getHistoricalDates(ielem.id.substring(ielem.id.indexOf("_")+1));
	}else if (typeof mdcTableFileName != 'undefined'){
		if(mdcTableFileName == null || mdcTableFileName == 'null'){
			mdcTableFileName = document.location.href.split('-')[1].replace('.html','');
		}
		//clear out mod values from table file name
		if(mdcTableFileName.indexOf('?mod=')!=-1){
			mdcTableFileName = mdcTableFileName.substring(0,mdcTableFileName.indexOf('?mod='));
		}
		getHistoricalDates(mdcTableFileName);
	}
  
	//prepcalendar(ccd,ccm,ccy);
}

function evtTgt(e) {
	var el;
	if(e.target)el=e.target;
	else if(e.srcElement)el=e.srcElement;
	if(el.nodeType==3)el=el.parentNode; // defeat Safari bug
	return el;
}
function EvtObj(e){if(!e)e=window.event;return e;}
function cs_over(e) {
	evtTgt(EvtObj(e)).style.color='#FF9933';
}
function cs_out(e) {
	evtTgt(EvtObj(e)).style.color='#0253b7';
}
function cs_click(e) {
	updobj.value=calvalarr[evtTgt(EvtObj(e)).id.substring(1,evtTgt(EvtObj(e)).id.length)];
	getObj('fc').style.display='none';
	var clink = window.location.href;
	// swap month and date to appear as MMDD instead of DDMM
	var newdate = updobj.value.replace(/\/(\d{1,2})\/(\d{1,2})$/,"/$2/$1");
	if (clink.match(/-(\d{8})(\S+)$/)) {
		clink = clink.replace(/-(\d{8})(\S+)$/,"-"+newdate.replace(/\//g,'')+"$2");
	} else {
		clink = clink.substring(0, clink.indexOf(".html"))+"-"+newdate.replace(/\//g,'')+clink.substring(clink.indexOf(".html"));
	}
	clink = clink.replace(/mod=[^&]+(&)?/,"mod=mdc_pastcalendar$1");
	if(clink.search(/mod=/) < 0) {
		// there wasn't a mod=, add one.
		clink += clink.search(/\?/) >= 0 ? "&mod=mdc_pastcalendar" : "?mod=mdc_pastcalendar";
	}
	window.location.href = clink
}

function ed_click(e) {
	sel = calvalarr[evtTgt(EvtObj(e)).id.substring(1,evtTgt(EvtObj(e)).id.length)];
	datearr = sel.split("/");
	updobj.value = datearr[2] + '/' + datearr[1] + '/' + datearr[0];
	changeFileName();
	getObj('fc').style.display='none';
}

function checkDate(ielem) {
	if (ielem) {
		updobj = ielem;
		var ielemvalue = updobj.value;
		if (ielemvalue.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
			changeFileName();
		} else {
			removeDateFromURL();
		}
	}
}

function changeFileName() {
	var tableName = updobj.id.substring(updobj.id.indexOf("_")+1);
	var a = updobj.parentNode.getElementsByTagName("a");
	var datearr = updobj.value.split("/");
	for (var i = 0; i < a.length; i++) {
		var ahref = a[i].href;
		if (ahref.match(/(\d{8})(\S+)$/)) {
			a[i].href = ahref.replace(/(\d{8})(\S+)$/,datearr[2]+(datearr[0]<10?'0':'')+parseInt(datearr[0],10)+(datearr[1]<10?'0':'')+parseInt(datearr[1],10)+"$2");
		} else {
			a[i].href = ahref.substring(0, ahref.indexOf(tableName)+tableName.length)+datearr[2]+(datearr[0]<10?'0':'')+parseInt(datearr[0],10)+(datearr[1]<10?'0':'')+parseInt(datearr[1],10)+ahref.substring(ahref.indexOf(tableName)+tableName.length);
		}
	}
}

function removeDateFromURL() {
	var tableName = updobj.id.substring(updobj.id.indexOf("_")+1);
	var a = updobj.parentNode.getElementsByTagName("a");
	for (var i = 0; i < a.length; i++) {
		var ahref = a[i].href;
		if (ahref.match(/(\d{8})(\S+)$/)) {
			a[i].href = ahref.replace(/(\d{8})(\S+)$/,"$2");
		}
	}
}

var mn=new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
var mnn=new Array('31','28','31','30','31','30','31','31','30','31','30','31');
var mnl=new Array('31','29','31','30','31','30','31','31','30','31','30','31');
var calvalarr=new Array(42);

function f_d(obj) {
	if(obj) {
		obj.style.background='#efefef';
		obj.style.cursor='default';
	}
}

function f_hd(obj) {
	if(obj) {
		obj.style.background='#ffffff';
		obj.style.color='#0253b7';
		obj.style.cursor='pointer';
	}
}

function f_nd(obj) {
	if(obj) {
		obj.style.color='#666666';
		obj.style.background='#DDDDDD';
		obj.style.cursor='default';
	}
}

function f_sd(obj) {
	if(obj) {
		obj.style.background='#FFCC33';
		obj.style.color='#0253b7';
		obj.style.cursor='pointer';
	}
}

// day selected
function prepcalendar(hd,cm,cy) {

	now=new Date();
	sd=now.getDate();
	td=new Date();
	td.setDate(1);
	td.setFullYear(cy);
	td.setMonth(cm);
	cd=td.getDay();
	// dip=false;

	var nextMonth = document.getElementById("nextmos");
	var prevMonth = document.getElementById("prevmos");
	if(nextMonth) {
		if (cy < maxy || (cy == maxy && cm < maxm)) {
			// next button should appear
			nextMonth.style.visibility = 'visible';
			nextMonth.style.display = '';
		} else {
			nextMonth.style.visibility = 'hidden';
			nextMonth.style.display = 'none';
		}
	}
	if(prevMonth) {
		if(cy > miny || (cy == miny && cm > minm)) {
			// previous button should appear
			prevMonth.style.visibility = 'visible';
			prevMonth.style.display = '';
		} else {
			prevMonth.style.visibility = 'hidden';
			prevMonth.style.display = 'none';
		}
	}

	getObj('mns').innerHTML=mn[cm]+ '-' + cy;
	marr=((cy%4)==0)?mnl:mnn;

	for(var d=1;d<=42;d++) {
		f_d(getObj('v'+parseInt(d)));
		if ((d >= (cd -(-1))) && (d<=cd-(-marr[cm]))) {
			calvalarr[d]=''+cy+'/'+((d-cd)<10?'0':'')+(d-cd)+'/'+((cm-(-1))<10?'0':'')+(cm-(-1));

			//dip=((d-cd < sd)&&(cm==sccm)&&(cy==sccy));
			dip=!(historicalDates && historicalDates.contains && historicalDates.contains(calvalarr[d].replace(/\//g,'')));

			//htd=((hd!='')&&(d-cd==hd));
			htd=(d-cd==hd && dccd==hd && dccm==cm && dccy==cy);

			if (dip) {
				f_nd(getObj('v'+parseInt(d)));
			} else if (htd) {
				f_sd(getObj('v'+parseInt(d)));
			} else {
				f_hd(getObj('v'+parseInt(d)));
			}

			getObj('v'+parseInt(d)).onmouseover=(dip)?null:cs_over;
			getObj('v'+parseInt(d)).onmouseout=(dip)?null:cs_out;
			getObj('v'+parseInt(d)).onclick=(dip)?null:(isEdweb?ed_click:cs_click);
			getObj('v'+parseInt(d)).innerHTML=d-cd;	

		} else {
			var o = getObj('v'+parseInt(d));
			if(o) {
				o.innerHTML='&nbsp;';
				o.onmouseover=null;
				o.onmouseout=null;
				o.style.cursor='default';
			}
		}
	}
	// add day of week for 1st day of month to #days in month
	var lastcell = cd + parseInt(marr[cm]);
	var row7 = document.getElementById("row7");
	var row6 = document.getElementById("row6");
	if(lastcell < 36) {
		try {
			row6.style.visibility = "collapse";
		} catch (e) {
			row6.style.display = 'none';
		}
	} else {
		try {
			row6.style.visibility = "visible";
			row6.style.display = '';
		} catch (e) {
			// ie permits visibility to be visibly, but not collapse
		}
	}
}

prepcalendar('',ccm,ccy);
//getObj('fc'+cc).style.visibility='hidden';

function caddm() {
	marr=((ccy%4)==0)?mnl:mnn;
	
	ccm+=1;
	if (ccm>=12) {
		ccm=0;
		ccy++;
	}
	cdayf();
	prepcalendar(ccd,ccm,ccy);
	//prepcalendar('',ccm,ccy);

}

function csubm() {
	marr=((ccy%4)==0)?mnl:mnn;

	if(ccy>miny || (ccy==miny && ccm>=minm)) {
		ccm-=1;
		if (ccm<0) {
			ccm=11;
			ccy--;
		}
		cdayf();
		prepcalendar(ccd,ccm,ccy);
		//prepcalendar('',ccm,ccy);
	}
}

function cdayf() {
	if ((ccy<sccy)|((ccy==sccy)&&(ccm<=sccm)))
		return;
	else {
		ccy=sccy;
		ccm=sccm;
		//ccd=sccd;
	}
}

function getHistoricalDates(tableName) {
	if (typeof tableName == 'undefined' || tableName == null || tableName == "")
		return;
	var histURL = "/mdc/js/hist/"+tableName+".html";
	var historyreq  = getXMLHTTPRequestObj();
  
	historyreq.onreadystatechange = function () {
		if (historyreq.readyState != 4)
			return;
		var responseText = historyreq.responseText;
		historicalDates = eval(responseText.replace(/<!\-\-.+?\-\->/,""))
		transformHistoricalDates(historicalDates);
		if (historicalDates && historicalDates.sort) 
			historicalDates.sort();
		prepcalendar(ccd,ccm,ccy);
	}
	doAjaxCall(historyreq, histURL);
}

function transformHistoricalDates(dates) {
	var max = 0;
	for(var idx = 0; idx < dates.length; idx++) {
		if(dates[idx] > max) {
			max = dates[idx]; // format YYYYMMDD
		}
		dates[idx] = dates[idx].replace(/(\d{2})(\d{2})$/,"$2$1");
	}
	// save max month
	maxm = max.replace(/^(\d{4})(\d{2}).+/,"$2") - 1;
	// save max year
	maxy = max.replace(/^(\d{4})(\d{2}).+/,"$1");
	// set the max scroll-to date as the greater of the 
	// newest historical date, or the current date of the browser.
	maxm = maxm > sccm ? maxm : sccm; 
	maxy = maxy > sccy ? maxy : sccy;
}


