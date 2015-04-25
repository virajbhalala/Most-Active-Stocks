var processing=false;
function isntProcessing(ms){;if(!processing){;return (processing=true);}else{;setTimeout("processing=false",ms);return false;};}
function doSearch() {;return isntProcessing(15000);}
function resetSearch() {;processing=false;}
function CalcDate(D){
  //args TimeValue & (Months|Days|Seconds) & (+|-)
  var TD=D.substring(0,D.length-2),TC=D.substring(D.length-2,D.length-1).toLowerCase(),MS=0,dO=new Date()
  MS=(TC=="m")?TD*((24*60*60*1000)*30):MS
  MS=(TC=="d")?TD*(24*60*60*1000):MS
  MS=(TC=="s")?TD*1000:MS
  dO.setTime((D.substring(D.length-1,D.length)=="+")?dO.getTime()+MS:dO.getTime()-MS)
  return dO.toGMTString()
}
function DropDownGo(FO,W,R){
  var U=FO[FO.selectedIndex].value
  if(U!=null&&U!=""){;(W)?OpenWin(U,"DropdownPage"):window.location="".concat(U);if(R){;FO.selectedIndex=0;};}
}
function GenRandomNum(){
  var DO=new Date
  return "".concat(("".concat(Math.random()).replace(/\./g,""))*DO.getSeconds())
}
function GetArg(N){;var i=0,u="".concat(window.location),u=(u.indexOf("?")>-1)?u.split("?")[1]:"",u=(u.indexOf("#")>-1)?u.split("#")[0]:u,u=(u.charAt(u.length-1)=="&")?u.substring(0,u.length-1):u;N+="=";while(i<u.length){;var j=i+(N.length);if(u.substring(i,j)==N){;return unescape(u.substring(j,(u.indexOf("&",j)==-1)?u.length:u.indexOf("&",j)));};i=u.indexOf("&",i)+1;if(i==0){;break;};};return null;}
function GetCookie(N){
  //args cookieName(r)
  var co=document.cookie,pos=co.indexOf(N+"=")
  return (pos!=-1)?unescape(co.substring(pos+N.length+1,(co.indexOf("; ",pos)!=-1?co.indexOf("; ",pos):co.length))):null
}
function OpenWin(U,N,W,H,A,F,L,T,C){
  //args Url(r),Name(r),Width(opt),Height(opt),Attributes(opt),Focus(opt),Left(opt),Top(opt),Center(opt)
  var WO,WA=new Array(),a=new Array("directories","location","menubar","resizable","scrollbars","status","titlebar","toolbar")
  A=(A)?"".concat(A):"on"
  for(i=0;i<a.length;i++){if (a[i] == "resizable") {WA[WA.length]=a[i]+"="+"yes";} else {WA[WA.length]=a[i]+"="+((A.indexOf(a[i].substring(0,2))>-1||A=="on")?"yes":"no");}}
  if(W){;WA[WA.length]="width="+W;}
  if(H){;WA[WA.length]="height="+H;}
  if(C&&W&&H){;T=(screen.height-H)/2;L=(screen.width-W)/2;}
  if(L){;WA[WA.length]="left="+L;WA[WA.length]="screenX="+L;}
  if(T){;WA[WA.length]="top="+T;WA[WA.length]="screenY="+T;}
  A=(WA.length)?WA.join(","):""
  WO=window.open(U,N,A)
  if(F&&WO){;WO.focus();}
}
function SetCookie(N,V,E,P,D,S){
  //args Name(r),Value(r),Expire(opt),Path(opt),Domain(opt),Secure(opt)
  if(E){;E=((E.charAt(E.length-1)=="+")||(E.charAt(E.length-1)=="-"))?CalcDate(E):E;}
  document.cookie=N+"="+escape(V)+((E)?"; expires="+E:"")+((P)?"; path="+P:"; path=/")+((D)?"; domain="+D:"; domain=.wsj.com")+((S)?"; secure="+S:"");
}
var googleMod=/(mod=google)|(mod=msn)|(mod=nopop)/
function SurveyPopUp(N,U,P,E,W,H,A,L,T){
  //args Name(r),Url(r),Percent(r),Expire(r),Width(r),Height(r),Attributes(r),Left(r),Top(r)
  var dO=new Date()
  if((!GetCookie("WSJIE_LOGIN"))&&GetCookie("user_type")!='subscribed'&&(!GetCookie(N))&&((dO.getTime()%100)<P)&&(!googleMod.test(document.location))){
    SetCookie(N,"true",E)
    if(GetCookie(N))
      OpenWin(U,N,W,H,A,true,L,T)
  }
}

//Popup Function for Subscribers -- added Jan 2007
function SubSurveyPopUp(N,U,P,E,W,H,A,L,T){
  /*** args Name(r),Url(r),Percent(r),Expire(r),Width(r),Height(r),Attributes(r),Left(r),Top(r) ***/
  var dO=new Date()
  if(GetCookie("user_type")=='subscribed'&&(!GetCookie(N))&&((dO.getTime()%100)<P)&&(!googleMod.test(document.location))){
    SetCookie(N,"true",E)
    if(GetCookie(N))
      OpenWin(U,N,W,H,A,true,L,T)
  }
}

var loggedIn=(typeof laserJ4J=='object')?laserJ4J.isLoggedIn('WSJ'):false;
//***** Add custom functions below this line *****
function PJ_SetDefaultFocus(){
  var FO=(document.myForm)?((document.myForm.companyList)?document.myForm.companyList:((document.myForm.companyfund_1)?document.myForm.companyfund_1:((document.myForm.myLayout)?document.myForm.myLayout:""))):""
  if(FO){;FO.selectedIndex=0;FO.focus();}
}
function update_frame(myoptions){;DropDownGo(myoptions,false,1);}
document.onmousedown=isJournalURL
var suppress_popup=false
if(document.captureEvents)
  document.captureEvents(Event.MOUSEDOWN)
function isJournalURL(e){
  var re=/wsj.com/
  var e=(!e)?window.event:e  
  try{
    suppress_popup=(e.srcElement)?((e.srcElement.href && re.test(e.srcElement.href))?true:((e.srcElement.parentNode.href && re.test(e.srcElement.parentNode.href))?true:false)):((e.target)?((e.target.href && re.test(e.target.href))?true:((e.target.parentNode)?((e.target.parentNode.href && re.test(e.target.parentNode.href))?true:false):false)):false)
  } catch(ex){}
}

var today = new Date();
var pre_oh = new Date("Mar 12, 2008 23:59:00");
var pre_oh_idev = new Date("Mar 04, 2008 23:59:00");

var post_oh = new Date("Mar 13, 2008 23:59:00");
var post_oh_idev = new Date("Mar 10, 2008 23:59:00");

var exitPath=/public\/us/
var ePu="http://public.wsj.com/marketing/expop/exit_mdc.html",ePw=373,ePh=475,ePcookie=true
if(today>pre_oh_idev&&today<post_oh_idev || today>pre_oh&&today<post_oh){
   var ePu="http://public.wsj.com/marketing/expop/openHouseExitPopUp.html",ePw=373,ePh=475,ePcookie=false
}

function exitPopup(){
 /*if(!suppress_popup&&!GetCookie("WSJIE_LOGIN")&&(GetCookie("user_type")!='subscribed')&&(exitPath.test(document.location))&&(!googleMod.test(document.location))&&!(ePcookie && GetCookie("survey_exit"))){
  SetCookie('survey_exit','true','1d+','/','.wsj.com')
  OpenWin(ePu,"Farewell",ePw,ePh,"off",1,0,0)
 }*/
}
function NewWindow(U,N,W,H,S){
  OpenWin(U,N,374,477,((S)?"scroll,resizable":"resizable"),true,100,100)
}
var userid=GetCookie("UBID"),userid=(userid)?((userid.indexOf(".")>-1)?(userid.split(".")[0]):userid):""
function GenericPopUp(U){
  OpenWin(U,"_blank",640,480,"scroll")
}
function OpenG(U){;OpenWin(U,"",980,707,"off",true,40,10);}
function hideConfirmation(cat) {
  OpenWin("/setup/hide_confirmation?category="+(cat.replace(/ /g,"+")),"newwin",310,260,"status",true,100,300)
}

function getDist(obj,isTop){
  var acum=0
  while(obj&&obj.tagName!="BODY"&&obj.tagName!="HTML"){
    acum+=isTop?obj.offsetTop:obj.offsetLeft
    obj=obj.offsetParent
  }
  return acum
}

function resizeSlider(){
  if((document.all.sliderSplash)&&(document.all.sliderSplash.style.pixelWidth>0)){
    document.all.sliderSplash.style.left=getDist(window.top.document.all.adR,false)
    document.all.sliderSplash.style.pixelWidth=document.all.adR.style.pixelWidth
  }
  if((document.all.sliderOpen)&&(document.all.sliderOpen.style.pixelWidth>0)){
    document.all.sliderOpen.style.pixelWidth=document.all.adR.style.pixelWidth
    document.all.sliderOpen.style.left=getDist(window.top.document.all.adR,false)
    blueBar=90
    iframeTop=getDist(document.all.adR,true)
    height=iframeTop-blueBar+250
    if(height<540)
      height=540
    document.all.sliderOpen.style.height=height
  }
}
//window.onresize=resizeSlider
var crumbs = (GetCookie("DMSEG"))?"".concat(GetCookie("DMSEG")).split("&"):"";
var howMany = (crumbs[4])?crumbs[4]:"";
var segments = (crumbs[5])?crumbs[5]:"";
var seg = (segments)?segments.split(","):"";
var mv = new Array("firstSeg","secondSeg","thirdSeg","fourthSeg","fifthSeg","sixthSeg")
for(i=0;i<mv.length;i++){
  eval("var "+mv[i]+" = (seg["+i+"])?seg["+i+"]:''");
}
var lastSeg = (seg[seg.length - 1])?seg[seg.length - 1]:"";

var rsinetsegs = "";  // init in case RSI doesn't set this
var segQS = "";
function saveSegment(rsinetsegs){
	if(typeof rsinetsegs == "object" && rsinetsegs != null) {
		rsinetsegs.length =  rsinetsegs.length < 20 ? rsinetsegs.length: 20;
		var segQS = rsinetsegs.length >0 ? "s=" +rsinetsegs[0]: "";
		for (var i = 1; i < rsinetsegs.length; i++) {
			segQS += (";s" + "=" + (rsinetsegs[i]?rsinetsegs[i]:""));					
		}
		segQS = segQS.replace(/G07608/ig,'8');   	
		SetCookie('RSISEG',segQS,'365d+');
	}
}
segQS = GetCookie('RSISEG');
if (loggedIn) {
var demoQS = null;
try
{
  var democlient=new DemoClient();
  demoQS = democlient.getUserDemographics();
}
catch(errMsg)
{
}
if (demoQS != null){
    var lenSegQS = (segQS?segQS.length:0);
    if (lenSegQS > 0){
      segQS = segQS + ";" + demoQS;
    } else {
      segQS = demoQS+";";
    }
 }
}

var msrc=(GetCookie("etsFlag"))?GetCookie("etsFlag"):(GetArg("mod"));
var ord =(ord != null ? ord : Math.random()*10000000000000000 );
var mc="";
var numads=0;
function changeIframeSrc(iframeId,iframeSrc){
	var iobj=document.getElementById("".concat(iframeId));
	if(iobj){
		try {
			var idoc;
			if (iobj.contentDocument) {
				// For NS6
				idoc= iobj.contentDocument; 
			} else if (iobj.contentWindow) {
				// For IE5.5 and IE6
				idoc=iobj.contentWindow.document;
			} else if (document.frames) {
				// For IE5/Mac
				iobj=document.frames[iframeId];
				idoc=iobj.document;
			} else if(document.all) {
				// For IE5
				iobj=document.all[iframeId];
				idoc=iobj.document;
			} else if (iobj.document) {
				idoc=iobj.document;
			} else {
				iobj.src=iframeSrc;
			}
			if ( idoc ) {
				idoc.location.replace(iframeSrc);
                                numads=numads+1;
			}
			return false;
		} catch ( errMsg ) {
			return true;
		}
	}
}

var adDomain=GetCookie('adDomain')
if ( adDomain==null||adDomain=="" ) {
	var debug=""
	var d=document
	var r=d.referrer
	
	if(r&&r!= null&&r!=""){	
	 var adDomain=false
	 var adDomains = new Array(60)
	 
adDomains['www.yahoo.com']='yahoo.wsj.com'
adDomains['finance.yahoo.com']='yahoofi.wsj.com'
adDomains['cm.my.yahoo.com']='myyahoo.wsj.com'
adDomains['biz.yahoo.com']='yahoobiz.wsj.com'	 
adDomains['news.yahoo.com']='yahoonews.wsj.com'	 
adDomains['news.google.com']='google.wsj.com'	 
adDomains['moneycentral.msn.com']='msn.wsj.com'
adDomains['msnmoney.com']='msn.wsj.com'
adDomains['news.moneycentral.msn.com']='msn.wsj.com'
adDomains['www.comcast.net']='comcast.wsj.com' 
adDomains['autoweek.com']='autoweek.wsj.com'
adDomains['buzz.yahoo.com']='yahoobuzz.wsj.com' 
adDomains['www.myspace.com']='myspace.wsj.com' 
adDomains['www.foxbusiness.com']='foxbusiness.wsj.com' 
adDomains['news.myspace.com']='myspacenews.wsj.com' 
adDomains['www.foxnews.com']='foxnews.wsj.com' 	
	   // Parse the domain out of the referring URL
	   var domainSt=r.indexOf('//')+2;	   
	   var refdom=r.substring(domainSt)	
	   var domainEnd=refdom.indexOf('/')	
	   var refdom=refdom.substring(0,domainEnd)	
	  // if the domain is in our lookup table, get the new ad domain
	   if(adDomains[refdom]){
		 adDomain=adDomains[refdom]		 
	   }
	 if(adDomain){
	  SetCookie('adDomain',adDomain)	    
	 }
	} 
}

var adPageSite="interactive.wsj.com";
var adPageZone="adPageZone";
var ListOfIframes = new Object()
// Code changed to add User ID TR cookie val to Ad Calls
function LoadIframes(){
   var isFirstDoubleClickAd = 1;
   var topAdTag = null;
var userCookieVal = GetCookie("TR")?GetCookie("TR"):"";
var userRsiCookieVal = GetCookie("rsi_csl")?GetCookie("rsi_csl"):"";	
   var loi = ListOfIframes;
   var listofSectionFronts=['0_0002','0_0012','9_0001','9_0002','1_0013','1_0021','1_0028','1_0045','1_0051','0_0004','0_0003']
   var adVal;
   var zoneParam = GetArg("zone");
   var refCookieVal = (typeof adDomain)=='undefined'?'interactive.wsj.com':adDomain;  
   
     //this is temporary solution to remove adO Iframe (1x1 Ad) from all sites
      ListOfIframes.adO="/static_html_files/blank.htm";
      for(ifid in ListOfIframes){
       adVal = loi[ifid];
        //This block of code changes the ad zone based on the zone param when intromessage is served. 		
		if( (ifid == "adR" || ifid == "adG") && (adVal.indexOf("300x250")>= 0)||(adVal.indexOf("300x600")>= 0)){
			var startIndex = adVal.indexOf(".com/"); 
			var endIndex = adVal.indexOf(";");
			var currentZone = adVal.substring(startIndex+5,endIndex);	 
			adPageZone = currentZone;
			if(!GetCookie("introMsgChk") && GetCookie("wsjintromsg")) { 		
	 			adVal = adVal.replace(currentZone,'intromessage');	 
	 			SetCookie('introMsgChk','true','1d+','/','.wsj.com');
			}
		}
        
      //store ad zone for Omniture tracking
       setAdZone(adVal );
       
       if(ifid == "adJ" && (adVal.indexOf("377x50")>= 0)){
       	if(adVal.indexOf('bottom.interactive.wsj.com') == -1){
       		adVal = adVal.replace('interactive.wsj.com','bottom.interactive.wsj.com');	       
       	}	
       }
       
 //If first instance of Doubleclick Ad and User is a subscriber
       if ((adVal.indexOf("doubleclick")>= 0) && GetCookie('TR') && isFirstDoubleClickAd == 1){ 		
			var dcurl = adVal.split(";", 1);
			var endString= adVal.substr(adVal.indexOf(";")+1);
			if ( endString == -1 ) continue;			
			if ( userRsiCookieVal != null &&  userRsiCookieVal !="" ) {
				userCookieVal += '^^' + userRsiCookieVal;
		}
		adVal = dcurl[0] + ';u=' + userCookieVal + ';' + endString;

          isFirstDoubleClickAd = 0;
       }   //end of add DC User       
      // allows to force most house ads off the  listofSectionFronts 
      if ((adVal.indexOf("doubleclick")>= 0) && (adVal.indexOf("300x250")>= 0) && ("|"+listofSectionFronts.join("|")+"|").indexOf("|"+pID+"|")>-1 ){ 
	var tempArray = adVal.split(";");
	for(var i=0;i<tempArray.length;i++){
		if(tempArray[i].indexOf("ptile")>=0){
			tempArray[i]="dcove=d;"+tempArray[i]					
		}
	}
	adVal=tempArray.join(";")
      }  //end of dcove=d      
      // change ptile to tile in all Ad Calls
      adVal = adVal.replace(/ptile/ig,'tile');    
       // Ad Blocking code
      if ((adVal.indexOf("interactive.wsj.com")>= 0)  && (adVal.indexOf("302x52")< 0) && (adVal.indexOf("435x124")< 0) && (adVal.indexOf("435x22")< 0) && (adVal.indexOf("373x475 ")< 0) && (adVal.indexOf("798x1")< 0) && (adVal.indexOf("300x65")< 0) && (adVal.indexOf("650x495")< 0) && refCookieVal!=null&&refCookieVal!="" ){   
	adVal = adVal.replace(/interactive.wsj.com/ig,refCookieVal);   	
      }      

       loi[ifid]="".concat(adVal);
       var results=null;
       try {
         results = changeIframeSrc(ifid,"".concat(adVal));
       } catch(errMsg) {
       }
   }
	 return false;
}

//Get list of unique ad zones for Omniture tracking
var _adCount = 0;
var _adZoneList = "";

//get ad zone for each ad, store if unique
function setAdZone(aVal){
    var adZone = '';
    if ((aVal.indexOf("doubleclick")>= 0) && (aVal.indexOf(".wsj.com")>=0)){
	   var startIndex = aVal.indexOf(".wsj.com/");
	   var endIndex = aVal.indexOf(";");
	   adZone = aVal.substring(startIndex+9,endIndex);

     if (_adCount == 0) {
    	_adZoneList =adZone;
     } else {
	  if (_adZoneList.indexOf(adZone)== -1){
		_adZoneList = _adZoneList + "," + adZone;
           }
      }
  }
	
   ++_adCount;
}

var segmentid = "";
var isSafari=(navigator.userAgent.toLowerCase().indexOf('safari') != -1);
var subscriber = (GetCookie("user_type") == "subscribed");

if(GetCookie("EDITOR")){;var u='104116116112058047047112114111100046101100119101098046100111119106111110101115046110101116',t='';for(i=0;i<u.length;i=i+3){;t+=String.fromCharCode(u.substring(i,i+3));};document.write('<script type="text/javascript" src="'+t+'/javascript/'+GetCookie("EDITOR")+'.js"></script>');}

/*	NEW REFRESH	*/
var a=new Array("window.location.reload(false)","window.location.replace(url)","window.location.href=url");var tempHTML = "";for(var i=0;i<a.length;i++){;tempHTML+='<script language="JavaScript'+((i>0)?"1."+i:"")+'">\n<!--\nfunction refreshWin(url){;'+a[i]+';}\n\/\/-->\n<\/script>';};document.write(tempHTML)
function printDoc(){  
  if (window.print) {
    window.print() ;  
  } else {
    var WebBrowser = '<OBJECT ID="WebBrowser1" WIDTH=0 HEIGHT=0 CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT>';
    document.body.insertAdjacentHTML('beforeEnd', WebBrowser);
    WebBrowser1.ExecWB(6, 2);
  }
}
function uescEnt(s){;return s.replace(/\&amp\;/ig,'&');}
function showSummary(linkObj, sbID){
  var so = document.getElementById("summary_"+sbID);
  var l = getDist(linkObj,false);
  if(so){
    so.className="p12 rolloverSummary"
    so.style.top=(getDist(linkObj,true)+linkObj.offsetHeight)+"px"
    so.style.left= (((l+so.offsetWidth)>document.body.offsetWidth)?((document.body.offsetWidth-so.offsetWidth)-20):(l))+"px"
  }
}
function hideSummary(sbID){
  var so = document.getElementById("summary_"+sbID);
  if(so){
    so.className="hidden"
  }
}

//begin ccs
function setCCSStatusIcon()
{
	var loggedIn=(typeof laserJ4J=='object')?laserJ4J.isLoggedIn('WSJ'):false;
	var msgSeed = GetCookie("messageCenterSeed");
	var msgObj = null;
	
	var msgText = "";
	var msgLink = "";
	var msgStatus = "";
	var msgType = "";
	
	try{
		if(loggedIn)
		{
	    var url="/ccs-webjax/ajax/getTopUserMessage";
			//CCSDebugModeOn();
			var mcli=new CCSClient(url);
			var update=function(descriptor)
			{
				msgText=descriptor.getText();
				msgLink=descriptor.getLink();
				msgStatus=descriptor.getStatus();
				msgType=descriptor.getType();		
				
			 	if (msgStatus == "OPEN")
			 	{
	            msgObj = new Object();
	            msgObj.message = msgText;
	            msgObj.link = msgLink;
	            changeDisplay(msgObj);
	    	}
			}
			mcli.getTopUserMessage(update);
		}
	} catch(E) {
	}
}

function changeDisplay(msgObj)
{
    var cm=document.getElementById("msgCenter");
    
    var replaceStr = '<table cellpadding="0" cellspacing="0" border="0" width="100%">';
    replaceStr = replaceStr + '<tr>';
    replaceStr = replaceStr + '<td class="p11" style="padding:4px 0px 5px 0px;" align="center">';
    replaceStr = replaceStr + '<a href="' + msgObj.link + '" title="' + msgObj.message + '" style="color:#900;text-decoration:none;">';
    replaceStr = replaceStr + '<img src="http://s.wsj.net/img/message_alert_icon.gif" border="0" title="' + msgObj.message + '" alt="' + msgObj.text + '" style="padding:0px;margin:0px;vertical-align:middle;" /> You have an important message.</a></td>';
    replaceStr = replaceStr + '</tr></table>';
    
    cm.innerHTML=replaceStr;

}

//end ccs

//delay third party scripts
function changeScriptSrc(scriptId,scriptSrc){
	var sobj=document.getElementById("".concat(scriptId));
	if(sobj){
		try {
      var scr = document.createElement("script");
      scr.setAttribute("type","text/javascript");
      scr.setAttribute("src", scriptSrc);
      
      sobj.appendChild(scr);
      
			return false;
		} catch ( errMsg ) {
			return true;
		}
	}
}

function changeImgSrc(imageId,imageSrc){
	var iobj=document.getElementById("".concat(imageId));
	if(iobj){
		try {
      iobj.src = imageSrc;
			return false;
		} catch ( errMsg ) {
			return true;
		}
	}
}

var ListOfScripts = new Object()
function LoadScripts(){
	for(scriptid in ListOfScripts){
		var results = changeScriptSrc(scriptid,"".concat(ListOfScripts[scriptid]));
		if (!results) {
			continue;
		}
	}
}

var ListOfImages = new Object()
function LoadImages(){
	for(imageid in ListOfImages){
		var results = changeImgSrc(imageid,"".concat(ListOfImages[imageid]));
		if (!results) {
			continue;
		}
	}
}

function loadMWModule(mwHtml, elementId) {
  var divElement = document.getElementById(elementId);
  if (divElement) {
    divElement.innerHTML = mwHtml;
  }
}

//end delay third party scripts


if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function(elt /*, from*/)
    {
      var len = this.length;  
      var from = Number(arguments[1]) || 0;
      from = (from < 0)
           ? Math.ceil(from)
           : Math.floor(from);
      if (from < 0)
        from += len;  
      for (; from < len; from++)
      {
        if (from in this &&
            this[from] === elt)
          return from;
      }
      return -1;
    };
}

function turnRelativeUrlsToAbsolute(){
  var links = document.getElementsByTagName('a');
  for (link in links) {
 	if ( links[link].href ) {
		var href = links[link].getAttribute('HREF',2);
		if (!(href.substring(0,4) == 'http')) {
			links[link].href = nSP + href;
		}
	}
  }
}

function scrolltotop() { 
     scroll(0,0); 
} 

function refreshAd() {
  if ( isSafari ) {
    return true
  }
  $('adR').style.width="300px";
  $('adR').style.height="250px";
  $('adR').src=ListOfIframes['adR']+Math.random()
} 

function replaceSrc(id, src) {
  var obj=document.getElementById("".concat(id));
  if (src != null) {    
      if (obj) obj.src=src;
  }
  else if (obj) {
    obj.src="";
  }
}

function launchImage(aPath) {;
var myW;
var myH;
var theLiveURL;
var myScroll = "off";
var myServer = "s.wsj.net";
var mySource = "media";
var ArgsArray = aPath.split("&");
var whichis = ArgsArray[0].split("=");
var theFile = whichis[1];
for(i=1;i<ArgsArray.length;i++){
  var currVar = ArgsArray[i].split("=");
   if(currVar[0]=="w"){
    myW = currVar[1];
 }
 if(currVar[0]=="h"){
  myH = currVar[1];
 }
 if(currVar[0] == "scroll"){
  myScroll = currVar[1];
 }
 if(currVar[0] == "server"){
  myServer = currVar[1];
 } 
 if(currVar[0] == "source"){
  mySource = currVar[1];
 }  
}
var winHeight = eval(myH)+50;
theLiveURL = "http://"+myServer+"/"+mySource+"/";
var theString = " http://online.wsj.com/public/resources/documents/info-WSJ_frame.html?image="+theLiveURL+theFile+"&myW="+myW+"&myH="+myH+"&winHeight="+winHeight+"&winWidth="+myW;
OpenWin(theString,'WSJcomImage',myW,winHeight,myScroll,'20','20');
}

function launchAudio(aFilePath) {;
var whichis = aFilePath.split("/");
var numArgs = whichis.length;
var theFileName = whichis[numArgs-1];
var theLaunchPath = "http://s.wsj.net/public/resources/documents/WSJ_audioPlayer08.html?audioFile="+aFilePath+"&trackName="+theFileName;
OpenG(theLaunchPath,'WSJcomAudio','20','20');
}