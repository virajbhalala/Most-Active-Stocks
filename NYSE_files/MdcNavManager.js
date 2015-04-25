NavManager={
  openSectionIndex : -1,
  onTabIndex : -1,
  overTab : false,
  
  init : function() {
    if(mdcHorNav) {
      var tmpHTML = '<div class="text" style="height:38px"><table cellpadding="0" cellspacing="0" border="0" bgcolor="#e6daad"><tr>'
	    var openSectionFound = false;
      for(s=0;s<mdcHorNav.length;s++){
        var isOpenSection = (("|"+mdcHorNav[s].pIDs+"|").indexOf("|"+pID+"|")>-1||(typeof mdcSectionId != 'undefined' && ("|"+mdcHorNav[s].pIDs+"|").indexOf("|"+mdcSectionId+"|")>-1))
        isOpenSection=(isOpenSection&&!openSectionFound)
        if(isOpenSection){
        	this.openSectionIndex=s;
        }
        if(s== 4){
		if( mdcHorNav[s].subnav != "undefined" )
		 for(j=1;j<mdcHorNav[s].subnav.length;j++){
		 var subnavhref = mdcHorNav[s].subnav[j].href;

		   if (subnavhref != "" && subnavhref.indexOf('/redirect/mutualfundresearch.html') != -1) {
			if(currentRegion == 'asia' || currentRegion == 'asia,india'){
				subnavhref = subnavhref.replace('/redirect/mutualfundresearch.html','/public/page/mutual-funds-asia.html');
			}else if(currentRegion == 'europe'){	
				subnavhref = subnavhref.replace('/redirect/mutualfundresearch.html','/public/page/mutual-funds-europe.html');
			}	
		   }
		   mdcHorNav[s].subnav[j].href = subnavhref;
		   if(j == 2 ){break;}
		 }
         }
         
        tmpHTML+= '<td id="hntabMDC'+s+'" class="navmenu" style="'+(s==mdcHorNav.length-1?"border-right:none;":"")+'color:#'+(isOpenSection?"ffffff;background-color:#AD9B5A;":"0253B7")+';cursor:pointer;"'
        var tempHref = "";
        if (typeof mdcHorNav[s].href != 'undefined')
          tempHref = mdcHorNav[s].href+(mdcHorNav[s].href.indexOf('#')==-1?('?mod=mdc_topnav_'+pID):'');
	
          if (tempHref != "" && tempHref.indexOf('/redirect/mutualfundresearch.html') != -1) {
          	if(currentRegion == 'asia' || currentRegion == 'asia,india'){
          		tempHref = tempHref.replace('/redirect/mutualfundresearch.html','/public/page/mutual-funds-asia.html');
          	}else if(currentRegion == 'europe'){	
          		tempHref = tempHref.replace('/redirect/mutualfundresearch.html','/public/page/mutual-funds-europe.html');
          	}	
          }
          
          if (tempHref != "" && tempHref.indexOf('/marketsdata.html') != -1) {
          	if(currentRegion == 'asia' || currentRegion == 'asia,india'){
          		tempHref = tempHref.replace('/redirect/marketsdata.html','/mdc/public/page/marketsdata_asia.html');
          	}else if(currentRegion == 'europe'){	
          		tempHref = tempHref.replace('/redirect/marketsdata.html','/mdc/public/page/marketsdata_europe.html');
          	}	
          }
          
        if (typeof suppressNavPopup != 'undefined' && !suppressNavPopup) {
          if(mdcHorNav[s].subnav.length>=0) {
            tmpHTML+= ' onmouseover="NavManager.onTab('+s+');" onmouseout="NavManager.offTab('+s+');'
            if(isOpenSection) {
              tmpHTML+= ';this.style.color=\'#ffffff\';this.style.backgroundColor=\'#AD9B5A\';'
            } 
            tmpHTML+= '" '
            if (tempHref != "") {
              tmpHTML+='onclick="changeWinLocation(\''+tempHref+'\',\'_top\')" '
            }
          }
        } else {
            if (tempHref != "") {
              tmpHTML+= ' onclick="changeWinLocation(\''+tempHref+'\',\'_top\')" '
            }
        }
    
        tmpHTML+= '>'+mdcHorNav[s].name+'</td>'
        if(isOpenSection)
          openSectionFound = true;
      }
      tmpHTML+= '</tr>'
      tmpHTML+= '<tr><td bgcolor="#666666" height="1" colspan="99"></td></tr>'
      tmpHTML+= '<tr><td bgcolor="#999999" height="1" colspan="99"></td></tr>'
      tmpHTML+= '<tr><td bgcolor="#CCCCCC" height="1" colspan="99"></td></tr>'
      tmpHTML+= '<tr><td bgcolor="#EFEFEF" height="1" colspan="99"></td></tr>'
      tmpHTML+= '</table></div>'

      if(NavPopupManager.useIframe){
        tmpHTML+= '<iframe id="hnpopupMDC" src="" marginWidth="0" marginHeight="0" hspace="0" vspace="0" frameBorder="0" scrolling="no" style="display:none;position:absolute;width:1px;height:1px;z-index:9999;"';
        if (isOpera) { 
          tmpHTML+= ' allowtransparency="true" ';
        }
        tmpHTML+= ' ></iframe>';
      } else {
//alert("using div");
        tmpHTML+= '<div id="hnpopupMDC" style="display:none;margin:0px;padding:0px;position:absolute;left:0px;top:0px;width:1px;height:1px;z-index:9999;"></div>';
      }
      
      document.write(tmpHTML)
      NavPopupManager.init("hnpopupMDC");
      NavPopupManager.addObserver(this);
    }
  },
  
  onTab : function (index) {
    if (this.onTabIndex != index) {
    this.onTabIndex = index;
    NavPopupManager.showPopup(index);
    }
    this.overTab = true;
  },
  
  offTab : function (index) {
    //this.onTabIndex = -1;
    NavPopupManager.hidePopup(index);
    this.overTab = false;
  },
  
  highlightTab : function (tabIndex, doHighlight) {
  if (mdcHorNav) {
    for(var i=0; i < mdcHorNav.length; i++) {
      var tabObj = document.getElementById('hntabMDC'+i);
      if (tabObj) {
        if (doHighlight) {
          if (tabIndex == i) {
            tabObj.style.backgroundColor='#AE9A59'
            tabObj.style.color='#ffffff'
          } else if (i != this.openSectionIndex) {
            tabObj.style.backgroundColor = '#e6daad'
            tabObj.style.color = '#0253B7'
          }
        } else {
          if (i != this.openSectionIndex) {
            tabObj.style.backgroundColor = '#e6daad'
            tabObj.style.color = '#0253B7'
          }
        }
      }
    }
  }
  },
  
  stateChanged : function (isVisible, tabIndex) {
    this.highlightTab(tabIndex, isVisible);
  }

}
NavManager.init();