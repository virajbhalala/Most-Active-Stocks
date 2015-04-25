MdcObjDimensions={
	top:function(o){
		var p=true
		var i=0
		while(p&&o.tagName!="BODY"&&o.tagName!="HTML"){
			i+=o.offsetTop
			if(o.offsetParent!=null)
				o=o.offsetParent
			else
				p=false
		}
		return i
	},
	left:function(o){
		var i=0
		while(o.tagName!="BODY"&&o.tagName!="HTML"){
			i+=o.offsetLeft
			o=o.offsetParent
		}
		return i
	},
	height:function(o){
		return o.offsetHeight
	},
	width:function(o){
		return o.offsetWidth
	}
}

MDCRolloverChartManager={
  useIframe:(navigator.userAgent.toLowerCase().indexOf('safari')==-1&&navigator.userAgent.indexOf('Mac')==-1),
	rolloverParent:null,
	symbolLabelId:"",
	chartUrl:"",
	clickUrl:"",
	header:"",
  container:null,
  bodyAttempts : 0,
  showDelay : 200,
  hideDelay : 500,
  isVisible : false,
  overPopup : false,
  showTimer : null,
  hideTimer : null,
  popupHtml : "",
  startHTML:'<html><head><link rel="stylesheet" type="text/css" href="http://'+document.domain+'/css/mdc.css" /></head><body>',
  endHTML:'</body></html>',

  getClientHeight:function () {
  	return this.filterResults (
  		window.innerHeight ? window.innerHeight : 0,
  		document.documentElement ? document.documentElement.clientHeight : 0,
  		document.body ? document.body.clientHeight : 0
  	);
  },
  
  getScrollTop:function () {
  	return this.filterResults (
  		window.pageYOffset ? window.pageYOffset : 0,
  		document.documentElement ? document.documentElement.scrollTop : 0,
  		document.body ? document.body.scrollTop : 0
  	);
  },
  
  filterResults:function (n_win, n_doc, n_body) {
  	var n_result = n_win ? n_win : 0;
  	if (n_doc && (!n_result || (n_result > n_doc)))
  		n_result = n_doc;
  	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
  },

  containerDoc:function(){
    var o=null;
    if(this.useIframe){
			if(typeof document.frames!='undefined'){
				o=document.frames['ircPopup'].document;
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
		this.container.id='ircPopup'
		this.container.style.display='none'
		this.container.style.margin='0px'
		this.container.style.padding='0px'
		this.container.style.position='absolute'
		this.container.style.left='0px'
		this.container.style.top='-400px'
		this.container.style.width='242px'
		this.container.style.height='223px'
		document.body.appendChild(this.container)
	},

  setTopPosition:function(){
    //this.container.style.height="0px";
    this.container.style.height=this.containerBody().scrollHeight+"px";
    if ((MdcObjDimensions.top(this.rolloverParent)+MdcObjDimensions.height(this.rolloverParent))+MdcObjDimensions.height(this.container)>this.getClientHeight()+this.getScrollTop()) {
      this.container.style.top=(MdcObjDimensions.top(this.rolloverParent)-MdcObjDimensions.height(this.container))+"px";
    } else {
      this.container.style.top=(MdcObjDimensions.top(this.rolloverParent)+MdcObjDimensions.height(this.rolloverParent))+"px";
    }
  },

  replaceContainerContent : function() {
    if (this.containerDoc()) {
        this.containerDoc().open("text/html","replace");
        this.containerDoc().write(this.startHTML+this.getPopupHTML()+this.endHTML);
        this.containerDoc().close();
    }
  },

  getPopupHTML:function () {
    var parentStr = "";
    if (this.useIframe)
      parentStr = "parent.";
    var popupHtml = '<span id="'+this.symbolLabelId+'_tip" class="chartToolTipBoxVisible">';
    popupHtml += '<div class="toolTipHeader"><span class="symbolName">'+this.header+'</span></div>';
    popupHtml += '<div class="toolTipBody">';
    popupHtml += '<div class="toolTipChartBox"><img class="toolTipChart" src="'+this.chartUrl.replace(/\%25/g,"%").concat("&time=1mo&frequency=1dy")+'" width="220" height="116" alt="chart" /></div>';
    popupHtml += '<div class="quoteRange">';
   if(this.symbolLabelId.indexOf('_GDOW_') != -1 || this.symbolLabelId.indexOf('_GDOWE_') != -1 ) {
        popupHtml += '<a id="timetenday" class="link11unvisited" href="javascript:'+parentStr+'MDCRolloverChartManager.changeChart(\''+this.chartUrl+'&time=10dy&frequency=15min\',\'timetenday\')">10 Day</a>&nbsp;|&nbsp;<a id="timeonemonth" class="link11unvisited selectedTime" href="javascript:'+parentStr+'MDCRolloverChartManager.changeChart(\''+this.chartUrl+'&time=1mo&frequency=1dy\',\'timeonemonth\')">1 Month</a>&nbsp;|&nbsp;<a id="timethreemonth" class="link11unvisited" href="javascript:'+parentStr+'MDCRolloverChartManager.changeChart(\''+this.chartUrl+'&time=3mo&frequency=1dy\',\'timethreemonth\')">3 Month</a>&nbsp;|&nbsp;<a id="timeoneyear" class="link11unvisited" href="javascript:'+parentStr+'MDCRolloverChartManager.changeChart(\''+this.chartUrl+'&time=1yr&frequency=1dy\',\'timeoneyear\')">1 Year</a>';
    } else {
        popupHtml += '<a id="timeoneday" class="link11unvisited" href="javascript:'+parentStr+'MDCRolloverChartManager.changeChart(\''+this.chartUrl+'&time=1dy&frequency=1mi\',\'timeoneday\')">1 Day</a>&nbsp;|&nbsp;<a id="timetenday" class="link11unvisited" href="javascript:'+parentStr+'MDCRolloverChartManager.changeChart(\''+this.chartUrl+'&time=10dy&frequency=15min\',\'timetenday\')">10 Day</a>&nbsp;|&nbsp;<a id="timeonemonth" class="link11unvisited selectedTime" href="javascript:'+parentStr+'MDCRolloverChartManager.changeChart(\''+this.chartUrl+'&time=1mo&frequency=1dy\',\'timeonemonth\')">1 Month</a>&nbsp;|&nbsp;<a id="timethreemonth" class="link11unvisited" href="javascript:'+parentStr+'MDCRolloverChartManager.changeChart(\''+this.chartUrl+'&time=3mo&frequency=1dy\',\'timethreemonth\')">3 Month</a>&nbsp;|&nbsp;<a id="timeoneyear" class="link11unvisited" href="javascript:'+parentStr+'MDCRolloverChartManager.changeChart(\''+this.chartUrl+'&time=1yr&frequency=1dy\',\'timeoneyear\')">1 Year</a>';
    }
    popupHtml += '</div>';
    popupHtml += '<div class="iacharting"><a href="'+this.clickUrl+'" class="link11unvisited" target="_top"><img src="/img/loginArrow.gif" width="5" height="9" border="0" />&nbsp;Go to Interactive Charting</a></div>';
    popupHtml += '</div>';
    popupHtml += '</span>'
    return popupHtml;
  },
  
  showPopup : function (rolloverParent, symbolLabelId, header, chartUrl, clickUrl) {
  	if(document.domain.indexOf('barrons')!=-1){//disabling rollover quotes on barrons articles for time being
		return;
	}
    this.rolloverParent = rolloverParent;
    this.symbolLabelId = symbolLabelId;
    this.header = header;
    this.chartUrl = chartUrl;
    this.clickUrl = clickUrl;
    clearTimeout(this.hideTimer);
    this.hideTimer = null;
    this.showTimer = setTimeout("MDCRolloverChartManager.changePopupState('show')",this.showDelay);
  },
  
  hidePopup : function () {
  	if(document.domain.indexOf('barrons')!=-1){//disabling rollover quotes on barrons articles for time being
		return;
	}
    this.hideTimer = setTimeout("MDCRolloverChartManager.changePopupState('hide')",this.hideDelay);
  },
  
  changePopupState : function (state) {
      if (state == "show") {
        try {
      		if(this.container==null) {
      			this.createPanel();
      	  }
      		if(this.useIframe){
      		  try {
      			  if(this.bodyAttempts > 5)
      			    return false;
      			  if (this.containerBody()==null) {
        				this.bodyAttempts++;
        				this.showTimer=setTimeout("MDCRolloverChartManager.changePopupState('"+state+"')",100);
        				return true;
        			}
        	  } catch (objErr) {
        				this.bodyAttempts++;
        				this.showTimer=setTimeout("MDCRolloverChartManager.changePopupState('"+state+"')",100);
        				return true;
        	  }
      		}
          if(this.containerBody().childNodes.length<1){
            if(this.useIframe){
              var n=this.containerDoc().createElement('link');
              n.rel='stylesheet';
              n.type='text/css';
              n.href='/css/mdc.css';
              this.containerBody().appendChild(n);
            }
            var n=this.containerDoc().createElement('div');
            n.id='popupContent';
            n.style.backgroundColor='#eff3f7';
		        n.style.borderColor='#000'
		        n.style.borderStyle='solid'
		        n.style.borderWidth='1px'
            this.containerBody().appendChild(n);
            if(this.useIframe){;
              n.onmouseover=function(){;
                parent.window.clearTimeout(parent.MDCRolloverChartManager.showTimer);
                parent.MDCRolloverChartManager.overPopup=true;
              };
              n.onmouseout=function(){;
                parent.MDCRolloverChartManager.overPopup=false;
              };
            }else{;
              n.onmouseover=function(){;
                window.clearTimeout(MDCRolloverChartManager.showTimer);
                MDCRolloverChartManager.overPopup=true;
              };
              n.onmouseout=function(){
                MDCRolloverChartManager.overPopup=false;
              };
            }
          }
          this.containerDoc().getElementById('popupContent').innerHTML = this.getPopupHTML();

        } catch (errMsg) {
          this.replaceContainerContent();
          return true;
        }
		    this.container.style.left=(MdcObjDimensions.left(this.rolloverParent)+80)+"px"
		    setTimeout("MDCRolloverChartManager.setTopPosition()",100);
        this.container.style.display = 'block';
        this.isVisible = true;
      } else {
        if (this.overPopup) {
          this.hidePopup();
        } else {
          this.container.style.display = 'none';
          this.isVisible = false;
        }
      }
  },

  changeChart : function (imgUrl, linkId) {
    if (this.rolloverParent) {
      var imgs = this.containerBody().getElementsByTagName("img");
      for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].className == "toolTipChart") {
          if (linkId == 'timeoneday')
            imgUrl += '&uf=8192';
          imgs[i].src = imgUrl;
        }
      }
      var links = this.containerBody().getElementsByTagName("a");
      for (var i = 0; i < links.length; i++) {
        if (links[i].id.indexOf("time") > -1 && links[i].id == linkId) {
            links[i].className = 'link11unvisited selectedTime';
            links[i].blur();
        } else {
            links[i].className = 'link11unvisited';
        }
      }
    }
  }
}
