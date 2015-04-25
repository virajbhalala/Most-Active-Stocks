// hack to address vertical alignment issues  06/08/12
dj.lang.addLiveEvent(".navmenu","mouseover",function(ev){
  var popupFrame = document.getElementById("hnpopupMDC").contentDocument;
  var setI=setInterval(function(){
    dojo.byId("hnpopupMDC").style.top="";
    var popImg = dojo.query("div img",popupFrame) ? dojo.query("div img",popupFrame)[0] : undefined;
    if(popImg && popImg.src.indexOf("mdc_nav_popup_top") > -1){
      var x = dojo.query("div",popupFrame)[0];
      if(x){x.parentNode.removeChild(x)};
    }
  },100)
  setTimeout(function(){clearInterval(setI);},1000);
});
// ---------------------------------------------------

var isIE=(navigator.userAgent.indexOf("MSIE")!=-1)?true:false;
var isFF=(navigator.userAgent.indexOf("Firefox")!=-1)?true:false;
var isOpera=(navigator.userAgent.indexOf("Opera")!=-1)?true:false;
var isNS=(navigator.userAgent.indexOf("Netscape")!=-1)?true:false;
var isMac = (navigator.userAgent.indexOf("Mac") != -1)?true:false;

var ieversion;
if(isIE) {
if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
 ieversion=new Number(RegExp.$1) // capture x.x portion and store as a number 
}
}

MdcMouseTracker={
  x:0,y:0,
  set:function(e){
    if(typeof event!='undefined'&&typeof event.clientX!='undefined'){
      MdcMouseTracker.x=event.clientX+document.body.scrollLeft
      MdcMouseTracker.y=event.clientY+document.body.scrollTop
    } else {
      MdcMouseTracker.x=e.pageX
      MdcMouseTracker.y=e.pageY
    }
    return true
  },
  init:function(){
    if(typeof document.captureEvents!='undefined')
      document.captureEvents(Event.MOUSEMOVE)
    document.onmousemove=this.set
  }
}
MdcMouseTracker.init()

function getDistance(obj,isTop){
  var acum=0
  while(obj.tagName!="BODY"){
    acum+=isTop?obj.offsetTop:obj.offsetLeft
    obj=obj.offsetParent
  }
  return acum
}

function changeWinLocation(link, target) {
  if (link == null)
    return;

  if (target == '_new') {
    window.open(link,'newwin');
  } else { //assuming _top
    top.location.href = link;
  }
}

NavPopupManager={
  //useIframe:(navigator.userAgent.toLowerCase().indexOf('safari')==-1&&navigator.userAgent.indexOf('Mac')==-1),
  useIframe:true,
  container:null,
  bodyAttempts : 0,
  showDelay : 200,
  hideDelay : 500,
  popupObj : null,
  observers : new Array(),
  isVisible : false,
  overPopup : false,
  tabIndex : 0,
  extraWidth : (isIE || isOpera ? 4 : 0),
  extraWidthLeft : (isIE || isOpera ? 8 : 0),
  topImgOffset : (isFF || isNS ? 16 : 10),
  showTimer : null,
  hideTimer : null,
  timestamp : 0,
  popupSizeArray : new Array(),
  popupHtml : new Array(),
  tmpHTML1 : "",
  tmpHTML2 : "",
  tmpHTML3 : "",
  tmpHTML4 : "",
  tmpHTML5 : "",
  tmpHTML6 : "",
  tmpHTML7 : "",

  init : function (popupId) {
    if (document.getElementById(popupId) == null) {
      setTimeout("NavPopupManager.init('"+popupId+"')",100);
    } else {
      this.container = document.getElementById(popupId);
      this.popupSizeArray[0] = new Object(); //Markets Data Home
      this.popupSizeArray[0].height = 0;
      this.popupSizeArray[0].width = 0;
      this.popupSizeArray[1] = new Object(); //US Stocks
      this.popupSizeArray[1].height = 395;
      this.popupSizeArray[1].width = 975;
      this.popupSizeArray[2] = new Object(); //International Markets
      this.popupSizeArray[2].height = 492;
      this.popupSizeArray[2].width = 690;
      this.popupSizeArray[3] = new Object(); //ETFs
      this.popupSizeArray[3].height = 115;
      this.popupSizeArray[3].width = 285;
      this.popupSizeArray[4] = new Object(); //Mutual Funds
      this.popupSizeArray[4].height = 173;
      this.popupSizeArray[4].width = 275;
      this.popupSizeArray[5] = new Object(); //Bonds, rates and credit markets
      this.popupSizeArray[5].height = 273;
      this.popupSizeArray[5].width = 550;
      this.popupSizeArray[6] = new Object(); //Commodities and futures
      this.popupSizeArray[6].height = 453;
      this.popupSizeArray[6].width = 614;
      this.popupSizeArray[7] = new Object(); //Currencies
      this.popupSizeArray[7].height = 144;
      this.popupSizeArray[7].width = 268;
      this.popupSizeArray[8] = new Object(); //Calendars and economy
      this.popupSizeArray[8].height = 215;
      this.popupSizeArray[8].width = 219;
      this.popupSizeArray[9] = new Object(); //Earnings
      this.popupSizeArray[9].height = 144;
      this.popupSizeArray[9].width = 200;
      
    this.tmpHTML1 = '<html><head><base href="http://'+document.domain+'" />'
    this.tmpHTML1 += '<style type="text/css">';
    this.tmpHTML1 += '.navmenupage {font-family: Arial, Helvetica, Verdana, sans-serif;background:url(http://s.wsj.net/img/mdc_nav_menu_title.gif) no-repeat top left;background-color:#044593;vertical-align:middle;border-bottom:1px solid #e7f0fb;padding-left:16px;padding-right:5px;font-size:11px;color:#fff;font-weight:bold;white-space:nowrap;text-decoration: none;}'
    this.tmpHTML1 += '.navmenusec  {font-family: Arial, Helvetica, Verdana, sans-serif;background:url(http://s.wsj.net/img/mdc_nav_menu_subtitle.gif) no-repeat top left;background-color:#5B91D2;vertical-align:middle;padding-left:16px;padding-right:5px;font-size:11px;color:#fff;font-weight:bold;white-space:nowrap;text-decoration: none;}'
    this.tmpHTML1 += '.navmenuitem {font-family: Arial, Helvetica, Verdana, sans-serif;background:url(http://s.wsj.net/img/mdc_black_round_bullet.gif) no-repeat 5px 50%;vertical-align:middle;padding-left:13px;padding-right:5px;font-size:11px;color:#0253B7;white-space:nowrap;text-decoration: none;}'
    this.tmpHTML1 += '.navmenuitemover {font-family: Arial, Helvetica, Verdana, sans-serif;background:url(http://s.wsj.net/img/mdc_black_round_bullet.gif) no-repeat 5px 50%;vertical-align:middle;padding-left:13px;padding-right:5px;font-size:11px;color:#f93;white-space:nowrap;text-decoration: underline;}'
    this.tmpHTML1 += '.navmenuitemsel {font-family: Arial, Helvetica, Verdana, sans-serif;background:url(http://s.wsj.net/img/mdc_black_round_bullet.gif) no-repeat 5px 50%;vertical-align:middle;padding-left:13px;padding-right:5px;font-size:11px;color:#f93;font-weight:bold;white-space:nowrap;text-decoration: none;}'
    if (isOpera) {
      this.tmpHTML1 += 'body {background:trasparent;}';
    }
    this.tmpHTML1 += '</style>'
    this.tmpHTML1 += '</head><body>'

      this.tmpHTML2='<table border="0" cellspacing="0" cellpadding="0" '
      this.tmpHTML2+='onmouseover="parent.NavPopupManager.overPopup=true" onmouseout="parent.NavPopupManager.overPopup=false;"'
      this.tmpHTML2+='><tr>'
      this.tmpHTML2+='<td rowspan="4">'

      this.tmpHTML4 = '</div></div>'
      this.tmpHTML4+= '</td>'
      this.tmpHTML4+= '<td bgcolor="#666666" width="1" rowspan="5"></td>'
      if (isIE) {
          this.tmpHTML4+= '<td bgcolor="#999999" style="border-top:1px solid #666666"></td>'
          this.tmpHTML4+= '<td bgcolor="#CCCCCC" style="border-top:2px solid #999999"></td>'
          this.tmpHTML4+= '<td bgcolor="#EFEFEF" style="border-top:3px solid #CCCCCC"></td>'
      } else {
          this.tmpHTML4+= '<td height="1"></td>'
          this.tmpHTML4+= '<td height="1"></td>'
          this.tmpHTML4+= '<td height="1"></td>'
      }
      this.tmpHTML4+= '</tr>'
      this.tmpHTML4+  '<tr>'
      this.tmpHTML4+= '<td bgcolor="#999999" width="1" rowspan="5"></td>'
      this.tmpHTML4+= '<td height="1" bgcolor="#CCCCCC"></td>'
      this.tmpHTML4+= '<td height="1" bgcolor="#EFEFEF"></td>'
      this.tmpHTML4+= '</tr>'
      this.tmpHTML4+  '<tr>'
      this.tmpHTML4+= '<td bgcolor="#CCCCCC" width="1" rowspan="5"></td>'
      this.tmpHTML4+= '<td height="1" bgcolor="#EFEFEF"></td>'
      this.tmpHTML4+= '</tr>'
      this.tmpHTML4+  '<tr>'
      this.tmpHTML4+= '<td bgcolor="#EFEFEF" width="1" rowspan="5"></td>'
      this.tmpHTML4+='</tr>'
      this.tmpHTML4+= '<tr><td bgcolor="#666666" height="1" colspan="1"></td></tr>'
      this.tmpHTML4+= '<tr><td bgcolor="#999999" height="1" colspan="2"></td></tr>'
      this.tmpHTML4+= '<tr><td bgcolor="#CCCCCC" height="1" colspan="3"></td></tr>'
      this.tmpHTML4+= '<tr><td bgcolor="#EFEFEF" height="1" colspan="4"></td></tr>'
      this.tmpHTML4+='</table>'

      this.tmpHTML5='</body></html>'

      this.tmpHTML6='<table border="0" cellspacing="0" cellpadding="0" '
      this.tmpHTML6+='onmouseover="parent.NavPopupManager.overPopup=true" onmouseout="parent.NavPopupManager.overPopup=false;"'
      this.tmpHTML6+='><tr>'
      if (isIE){
          this.tmpHTML6+= '<td bgcolor="#EFEFEF" style="border-top:3px solid #CCCCCC;"></td>'
          this.tmpHTML6+= '<td bgcolor="#CCCCCC" style="border-top:2px solid #999999;"></td>'
          this.tmpHTML6+= '<td bgcolor="#999999" style="border-top:1px solid #666666;"></td>'
      } else {
          this.tmpHTML6+= '<td height="1"></td>'
          this.tmpHTML6+= '<td height="1"></td>'
          this.tmpHTML6+= '<td height="1"></td>'
      }
      this.tmpHTML6+= '<td bgcolor="#666666" width="1" rowspan="5"></td>'

      this.tmpHTML7 = '</div></div>'
      this.tmpHTML7+= '</td>'
      this.tmpHTML7+= '</tr>'
      this.tmpHTML7+  '<tr>'
      this.tmpHTML7+= '<td height="1" bgcolor="#EFEFEF"></td>'
      this.tmpHTML7+= '<td height="1" bgcolor="#CCCCCC"></td>'
      this.tmpHTML7+= '<td bgcolor="#999999" width="1" rowspan="5"></td>'
      this.tmpHTML7+= '</tr>'
      this.tmpHTML7+  '<tr>'
      this.tmpHTML7+= '<td height="1" bgcolor="#EFEFEF"></td>'
      this.tmpHTML7+= '<td bgcolor="#CCCCCC" width="1" rowspan="5"></td>'
      this.tmpHTML7+= '</tr>'
      this.tmpHTML7+  '<tr>'
      this.tmpHTML7+= '<td bgcolor="#EFEFEF" width="1" rowspan="5"></td>'
      this.tmpHTML7+='</tr>'
      this.tmpHTML7+= '<tr><td bgcolor="#666666" height="1" colspan="1"></td></tr>'
      this.tmpHTML7+= '<tr><td bgcolor="#999999" height="1" colspan="2"></td></tr>'
      this.tmpHTML7+= '<tr><td bgcolor="#CCCCCC" height="1" colspan="3"></td></tr>'
      this.tmpHTML7+= '<tr><td bgcolor="#EFEFEF" height="1" colspan="4"></td></tr>'
      this.tmpHTML7+='</table>'

      for (var i = 0; i < mdcHorNav.length; i++) {
        if (mdcHorNav[i].subnav.length == 0) {
          this.popupHtml[i] = "";
          this.popupSizeArray[i].top = "0px";
          this.popupSizeArray[i].left = "0px";
          continue;
        }
        var popupWidth = this.popupSizeArray[i].width;
        var popupHeight = this.popupSizeArray[i].height;
        this.popupHtml[i] = "";
        var tabObj = document.getElementById("hntabMDC" + i);
        if (tabObj) {
          var tabObjLeft = getDistance(tabObj,false);
          var tabWidth = 97;
          var popupTopImg = "http://s.wsj.net/img/mdc_nav_popup_top_left.gif";
          var popupTopImgLeft = "0px";
          var popupStyle1 = "background-color:#fff;border:1px solid #797560";
          var popupStyle2 = "margin:1px 1px 0px 0px;padding:2px 2px;background-color:#ae9a59";
          var popupOri = 0; //0-right, 1-left
          if (((tabObjLeft + popupWidth) > 990) && (tabObjLeft+tabWidth-popupWidth > 0)) {
            if (document.getElementById("hntabMDC"+(i+1))) {
               var nextTab = getDistance(document.getElementById("hntabMDC"+(i+1)),false);
               tabWidth = nextTab-tabObjLeft;
            } else
               tabWidth = 990 - tabObjLeft;
            this.popupSizeArray[i].left = ((tabObjLeft+tabWidth)-popupWidth)+"px"
            popupTopImg = "http://s.wsj.net/img/mdc_nav_popup_top_right.gif";
            popupTopImgLeft = (popupWidth-100)+"px";
            popupStyle1 = "background-color:#fff;border-top:1px solid #797560;border-left:1px solid #797560;border-bottom:1px solid #797560";
            popupStyle2 = "margin:1px 0px 0px 1px;padding:2px 2px;background-color:#ae9a59;border:1px solid #797560;border-right:0px";
            this.popupHtml[i] += this.tmpHTML6;
            this.popupHtml[i] += '<td rowspan="4"><div style="position:absolute;width:99px;left:'+popupTopImgLeft+';top:0px;height:5px;background-color:#e7f0fb;"><img src="'+popupTopImg+'" height="5" /></div>'
            this.popupHtml[i] += '<div style="'+popupStyle1+'">'
            this.popupHtml[i] += '<div style="'+popupStyle2+'">'
            this.popupHtml[i] += this.getMenuHtml(i);
            this.popupHtml[i] += this.tmpHTML7;
          } else {
            if (((tabObjLeft + popupWidth) > 990) && (tabObjLeft+tabWidth-popupWidth < 0)) {
              this.popupSizeArray[i].left=tabObjLeft-((tabObjLeft + popupWidth)-990) + "px";
              popupTopImg = "http://s.wsj.net/img/mdc_nav_popup_top_center.gif";
              popupTopImgLeft = (tabObjLeft-16)+"px";
            } else
              this.popupSizeArray[i].left=tabObjLeft+"px"

            this.popupHtml[i] += this.tmpHTML2;
            this.popupHtml[i] +='<div style="position:absolute;width:100px;left:'+popupTopImgLeft+';top:0px;height:4px;background-color:#e7f0fb;"><img src="'+popupTopImg+'" height="4" /></div>'
            this.popupHtml[i] +='<div style="'+popupStyle1+'">'
            this.popupHtml[i] +='<div style="'+popupStyle2+'">'
            this.popupHtml[i] += this.getMenuHtml(i);
            this.popupHtml[i] += this.tmpHTML4;
          }
          //this.popupHtml[i] += this.tmpHTML5;

          this.popupSizeArray[i].top=(getDistance(tabObj,true)+38)+"px"

        }
      }

      //this.createPanel();
    }
  },

  getMenuHtml : function (index) {
    var tmpHTML3='<table border="0" cellspacing="0" cellpadding="0" style="background-color:#e7f0fb;">'
    tmpHTML3+='<tr height="10"><td height="10"><img src="http://s.wsj.net/img/b.gif" height="10" width="1" /></td></tr>'
    tmpHTML3+='<tr>'
    tmpHTML3+='<td style="vertical-align:top;padding:0px 10px;"><table border="0" cellpadding="0" cellspacing="0">'
    var indent = 0;
    for(var i=0;i<mdcHorNav[index].subnav.length;i++){
      if(typeof mdcHorNav[index].subnav[i].disabled !=="undefined" && mdcHorNav[index].subnav[i].disabled === true) {
        continue;
      }
      indent = mdcHorNav[index].subnav[i].indent;
      if (mdcHorNav[index].subnav[i].columnBreak) {
        tmpHTML3+='</table></td>'
        tmpHTML3+='<td style="border-left:1px solid #666;vertical-align:top;padding:0px 10px;"><table border="0" cellpadding="0" cellspacing="0">'
      } else {
        if (typeof mdcHorNav[index].subnav[i].href == "undefined" || mdcHorNav[index].subnav[i].href == "") {
          tmpHTML3+= '<tr><td class="'+mdcHorNav[index].subnav[i].style+'">'+mdcHorNav[index].subnav[i].text+'</td></tr>'
        } else {
          var tempHref = (mdcHorNav[index].subnav[i].href.indexOf("http:")==-1?mdcHorNav[index].subnav[i].href+(mdcHorNav[index].subnav[i].href.indexOf("?")==-1?"?":"&")+'mod=topnav_'+pID:mdcHorNav[index].subnav[i].href);
          var linkTarget = (mdcHorNav[index].subnav[i].href.indexOf("http:")==-1?"_top":"_new");
          var newImg = (mdcHorNav[index].subnav[i].isNew!='undefined'&&mdcHorNav[index].subnav[i].isNew?'<img src="http://s.wsj.net/img/mdc_nav_new.gif" width="22" height="7" alt="New" style="margin-left:5px" />':'');
          var hasCal = (mdcHorNav[index].subnav[i].isHist!='undefined'&&mdcHorNav[index].subnav[i].isHist?'<img src="http://s.wsj.net/img/NavIcon_Cal.gif" width="11" height="8" alt="Historical tables available" style="margin-left:5px;margin-right:5px;" />':'');
          var hasDwldLink = (mdcHorNav[index].subnav[i].hasCsv!='undefined'&&mdcHorNav[index].subnav[i].hasCsv?'<img src="http://s.wsj.net/img/NavIcon_Download.gif" width="11" height="8" alt="Available for download" style="margin-left:5px;margin-right:5px;" />':'');
          if(index == NavManager.openSectionIndex){
            var tempLoc = ("".concat(window.top.location).substring("".concat(window.top.location).indexOf("/",8)))
            if(tempLoc.indexOf("?")>-1){
              tempLoc=tempLoc.substring(0,tempLoc.indexOf("?"))
            }
            if(tempLoc==mdcHorNav[index].subnav[i].href && mdcHorNav[index].subnav[i].style!='navmenupage'){
              tmpHTML3+= '<tr><td class="navmenuitemsel" style="'+(mdcHorNav[index].subnav[i].style=="navmenuitem"?"padding-left:"+((indent>0)?indent*34:13)+"px;background-position:"+((indent>0)?indent*26:5)+"px 50%;":"")+'">'+mdcHorNav[index].subnav[i].text+newImg+hasCal+hasDwldLink+'</td></tr>'
            } else {
              tmpHTML3+= '<tr><td class="'+mdcHorNav[index].subnav[i].style+'" style="cursor:pointer;'+(mdcHorNav[index].subnav[i].style=="navmenuitem"?"padding-left:"+((indent>0)?indent*34:13)+"px;background-position:"+((indent>0)?indent*26:5)+"px 50%;":"")+'" onclick="parent.changeWinLocation(\''+tempHref+'\',\''+linkTarget+'\')" onmouseover="status=\''+tempHref+'\';'+(typeof mdcHorNav[index].subnav[i].changeBg == 'undefined'?"this.className=\'navmenuitemover\'":"")+';" onmouseout="status=\''+'\';'+(typeof mdcHorNav[index].subnav[i].changeBg == 'undefined'?"this.className=\'navmenuitem\'":"")+';">'+mdcHorNav[index].subnav[i].text+newImg+hasCal+hasDwldLink+'</td></tr>'
            }
          } else {
            tmpHTML3+= '<tr><td class="'+mdcHorNav[index].subnav[i].style+'" style="cursor:pointer;'+(mdcHorNav[index].subnav[i].style=="navmenuitem"?"padding-left:"+((indent>0)?indent*34:13)+"px;background-position:"+((indent>0)?indent*26:5)+"px 50%;":"")+'" onclick="parent.changeWinLocation(\''+tempHref+'\',\''+linkTarget+'\')" onmouseover="status=\''+tempHref+'\';'+(typeof mdcHorNav[index].subnav[i].changeBg == 'undefined'?"this.className=\'navmenuitemover\'":"")+';" onmouseout="status=\''+'\';'+(typeof mdcHorNav[index].subnav[i].changeBg == 'undefined'?"this.className=\'navmenuitem\'":"")+';">'+mdcHorNav[index].subnav[i].text+newImg+hasCal+hasDwldLink+'</td></tr>'
          }
        }
      }
    }
    tmpHTML3+='</table></td>'
    tmpHTML3+='<tr height="10"><td height="10"><img src="http://s.wsj.net/img/b.gif" height="10" width="1" /></td></tr>'
    tmpHTML3+='</tr>'
    tmpHTML3+='</table>'
    return tmpHTML3;
  },

  replaceContainerContent : function(index) {
    if (this.containerDoc()) {
        this.containerDoc().open("text/html","replace");
        this.containerDoc().write(this.tmpHTML1+this.popupHtml[index]+this.tmpHTML5);
        this.containerDoc().close();
    }
  },

  containerDoc:function(){
    var o=null;
    if(this.useIframe){
      if(typeof document.frames!='undefined'){
        o=document.frames['hnpopupMDC'].document;
      }else if(typeof this.container.Document!='undefined'){
        o=this.container.Document;
      }else if(typeof this.container.contentDocument!='undefined'){
        o=this.container.contentDocument;
      }else if(typeof this.container.contentWindow!='undefined'){
        o=this.container.contentWindow;
      }
    }else{
      o=document;
    }
    return o;
  },

  containerBody:function(){;
    return (this.useIframe)?((typeof this.containerDoc()=='object')?this.containerDoc().body:this.containerDoc()):this.container;
  },

  createPanel:function(){
    if(this.useIframe){
      this.container=document.createElement('iframe')
      this.container.src='/static_html_files/blank.htm'
      this.container.marginWidth='0'
      this.container.marginHeight='0'
      this.container.hspace='0'
      this.container.vspace='0'
      this.container.frameBorder='0'
      this.container.scrolling='no'

    }else{
      this.container=document.createElement('div')
    }
    this.container.id='hnpopupMDC'
    this.container.style.display='none'
    this.container.style.margin='0px'
    this.container.style.padding='0px'
    this.container.style.position='absolute'
    this.container.style.left='0px'
    this.container.style.top='0px'
    this.container.style.width='1px'
    this.container.style.height='1px'
    document.body.appendChild(this.container)
  },

  adjustheight:function(){
    //this.container.style.height="0px";
    this.container.style.height=(this.containerBody().scrollHeight)+"px";
  },

  addObserver : function (o) {
    this.observers[this.observers.length] = o;
  },

  notifyAll : function () {
    for (var i = 0; i < this.observers.length; i++) {
      this.observers[i].stateChanged(this.isVisible(), this.tabIndex);
    }
  },

  isVisible : function () {
    if (this.container.style.display=='block')
      return true;
    return false;
  },

  showPopup : function (index) {
    if (new Date().getTime() - this.timestamp < this.showDelay) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    clearTimeout(this.hideTimer);
    this.hideTimer = null;
    this.changePopupState('hide',this.tabIndex);
    this.timestamp = new Date().getTime();
    this.showTimer = setTimeout("NavPopupManager.changePopupState('show', "+index+")",this.showDelay);
  },

  hidePopup : function (index) {
      this.hideTimer = setTimeout("NavPopupManager.changePopupState('hide', "+index+")",this.hideDelay);
  },

  changePopupState : function (state, index) {
    if (this.container) {
      if (state == "show") {
        try {

          if (this.bodyAttempts > 5) {
            return false;
          }
          if (this.containerBody() == null) {
            bodyAttempts++;
            this.showTimer = setTimeout("NavPopupManager.changePopupState('show', "+index+")",100);
            return true;
          }
          if(this.containerBody().childNodes.length<1){
            if(this.useIframe){var n = this.containerDoc().createElement('head');var b=this.containerDoc().createElement('base');b.href='http://'+document.domain;n.appendChild(b);this.containerBody.appendChild(n);var n=this.containerDoc().createElement('link');n.rel='stylesheet';n.type='text/css';n.href='/css/mdc.css';this.containerBody().appendChild(n);}
            var n=this.containerDoc().createElement('div');n.id='popupContent';this.containerBody().appendChild(n);
            if(this.useIframe){;n.onmouseover=function(){;parent.window.clearTimeout(parent.NavPopupManager.showTimer);parent.NavPopupManager.overPopup=true;};n.onmouseout=function(){;parent.NavPopupManager.overPopup=false;};}else{;n.onmouseover=function(){;window.clearTimeout(NavPopupManager.showTimer);NavPopupManager.overPopup=true;};n.onmouseout=function(){NavPopupManager.overPopup=false;};}
          }
          this.containerDoc().getElementById('popupContent').innerHTML = this.popupHtml[index];
        } catch (errMsg) {
          this.replaceContainerContent(index);
        }
      
        var topheight = 300;
        if (dj.util.Region.getViewByRegion() == "na,us") {
          topheight = this.popupSizeArray[index].top;
    topheight = topheight.substring(0,topheight.length-2);

                if ( isIE && ieversion>=8 ){
        topheight = parseInt(topheight) + 83;
                } else {
                   topheight = parseInt(topheight) + 60;
                }

//ASIA +30 - 2_3002_asia
//US  -38 - 2_3000
//Europe - No change

    if(pID === "2_3000"){
      topheight = topheight - 38;
    }

    this.container.style.top = topheight + "px";
  }
  else {

        if (dj.util.Region.getViewByRegion() == "asia" || dj.util.Region.getViewByRegion() == "asia,india") {

          topheight = this.popupSizeArray[index].top;

          if(pID === "2_3000_asia"){
            topheight = topheight + 30;
          }

          this.container.style.top = topheight + "px";
          
        }else{
          this.container.style.top = this.popupSizeArray[index].top;
        }
  }

if(index===9 )
        {
          
          var leftheight = this.popupSizeArray[index].left;
          leftheight = leftheight.substring(0,leftheight.length-2);
          leftheight = parseInt(leftheight) + 100;          
          this.container.style.left = leftheight + "px";
          
        }
        else
        {
        this.container.style.left = this.popupSizeArray[index].left;
        }

        this.container.style.width = this.popupSizeArray[index].width + "px";
        this.container.style.height = this.popupSizeArray[index].height + "px";
        setTimeout("NavPopupManager.adjustheight()",100);
        this.container.style.display = 'block';
        //this.isVisible = true;
        this.tabIndex = index;
        this.notifyAll();
      } else {
        if (this.overPopup || NavManager.overTab) {
          this.hidePopup(index);
        } else {
          this.container.style.display = 'none';
          //this.isVisible = false;
          NavManager.onTabIndex=-1;
          this.tabIndex = index;
          this.notifyAll();
        }
      }
    }
  }
}
