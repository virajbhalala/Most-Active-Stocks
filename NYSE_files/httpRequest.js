var wsjaxActiveXObjType = ""
var iswsjax = (httpRequestObject())?true:false;
function httpRequestObject(){
	if (window.XMLHttpRequest) {
		//netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		if (wsjaxActiveXObjType) {
			return new ActiveXObject(wsjaxActiveXObjType);
		} else {
			for(var v=7;v>0;v--){
				if(v>2){
					if(v>3){
						wsjaxActiveXObjType="Msxml2.XMLHTTP."+v+".0"
					} else {
						wsjaxActiveXObjType="MSXML2.XMLHTTP.3.0";
					}
				} else if(v==2) {
					wsjaxActiveXObjType="MSXML2.XMLHTTP";
				} else {
					wsjaxActiveXObjType="Microsoft.XMLHTTP";
				}
				
				try {
					var tempObj = new ActiveXObject(wsjaxActiveXObjType);
					if(tempObj)
						return tempObj
				} catch (objException) {
				}
			}
		}
	}
	return false
}

function WSJAXRequest(){
	
	var argHash = new Object();
	for(var a=0;a<arguments.length;a++){
		if(arguments[a].type)
			argHash[arguments[a].type]=arguments[a].value
	}

	if(typeof argHash['URL'] =='undefined' || argHash['URL']==null || argHash['URL']==""){;return false;}
	argHash['VERB']=(typeof argHash['VERB'] == 'undefined')?"GET":argHash['VERB'].toUpperCase();
	argHash['ASYNC']=(typeof argHash['ASYNC'] != 'boolean')?true:argHash['ASYNC'];
	
	this.process=(typeof argHash['PROCESS'] == 'undefined')?new Function("return false"):argHash['PROCESS'];
	this.rObj = httpRequestObject()
	if(!this.rObj)
		return false
	
	var self = this;
	this.argHash = argHash
	this.rObj.onreadystatechange = function( ) {
        	self.process(self.rObj,self.argHash);
    	}
    	
    	this.rObj.open(argHash['VERB'],argHash['URL'],argHash['ASYNC']);
    	
    	
    	if (argHash['VERB'] == "POST") {
        	//this.rObj.setRequestHeader("Connection", "close");
        	//this.rObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        	//this.rObj.setRequestHeader("Method", "POST " + argHash['URL'] + "HTTP/1.1");
    	}
    	
    	if(typeof argHash['HEADERS'] != 'undefined'){
    		var _ta = argHash['HEADERS'];
    		for(var h=0;h<_ta.length;h++){
    			this.rObj.setRequestHeader(_ta[h][0], _ta[h][1]);
		}
    	}
    	
  	this.rObj.send((typeof argHash['NVP']=='undefined'||argHash['NVP']==null)?"":argHash['NVP']);
  	return this.rObj
}

function isIframeLoaded(n){
	alert(parent.top.document.getElementById('httpRequestFrame').innerHTML)
	if(window.top.document.getElementById(n).innerHTML.length>0){
		window.top.document.getElementById(n).onload();
	} else {
		setTimeout("isIframeLoaded('"+n+"')",5*1000)
	}
}

function _arg(t,s){
	this.type=t.toUpperCase()
	this.value=s
}