function doAjaxCall (req, url) {
  req.open("GET", url, true);
  req.send("");
}
function doPostAjaxCall(req,url) {
  var qi=url.indexOf('?'),params=url.substring(qi+1),url=url.substring(0,qi);
  req.open('POST', url, true);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.setRequestHeader("Content-length", params.length);
  req.setRequestHeader("Connection", "close");
  req.send(params);
}
function getXMLHTTPRequestObj() {
	var req = false;
	// IE7, Mozilla, Safari...
	if(window.XMLHttpRequest) {
		
		// IE7
		if(window.ActiveXObject){
			
			var aVersions = [ "MSXML2.XMLHttp.5.0",
			                  "MSXML2.XMLHttp.4.0","MSXML2.XMLHttp.3.0",
			                  "MSXML2.XMLHttp","Microsoft.XMLHttp"];
			
			for (var i = 0; i < aVersions.length; i++) {
				try {
					var req = new ActiveXObject(aVersions[i]);
					return req;
				} catch (oError) {
					// Do nothing
				}
			}
		// Mozilla, Safari...	
		}else{
			try {
				req = new XMLHttpRequest();
			} catch(e) {
				req = false;
			}
		} 
	// IE6 or older...	
	}else if(window.ActiveXObject) {
		try {
			req = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {
				req = false;
			}
		}
	}
	
	
	return req;
}
