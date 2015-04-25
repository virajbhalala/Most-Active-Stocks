  djcs=function(){
  var _url={

  decode : function (str) {
  var string = "";
  var i = 0;
  var c = 0;
  var c1 = 0;
  var c2 = 0;
  var utftext=null;

  if(!str) return null;

  utftext=unescape(str);
  while ( i < utftext.length ) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
    string += String.fromCharCode(c);
    i++;
      }
      else if((c > 191) && (c < 224)) {
    c2 = utftext.charCodeAt(i+1);
    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
    i += 2;
      }
      else {
    c2 = utftext.charCodeAt(i+1);
    c3 = utftext.charCodeAt(i+2);
    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
    i += 3;
      }
  }
  return string;
  }
      };
  var _base64={
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  decode : function (input) {
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;

  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  while (i < input.length) {
      enc1 = _base64._keyStr.indexOf(input.charAt(i++));
      enc2 = _base64._keyStr.indexOf(input.charAt(i++));
      enc3 = _base64._keyStr.indexOf(input.charAt(i++));
      enc4 = _base64._keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
    output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
    output = output + String.fromCharCode(chr3);
      }
  }
  output = _url.decode(output);
  return output;
  }
  };

  var _private={
  runCount:1,
  canRun:function(){
      if(_private.runCount>0){
      _private.runCount--;
      if(_private.runCount>=0){
      return true;
      }
      }
      return false;
  },

  products:{"WSJ-ACCOUNT":3,"WSJ":2,"BARRONS":30,"NEWSREADER":161,"FREEREG-BASE":341,"HILTON":381,"WSJ-TRANSIENT":401,"EXP-LEXISNEXIS":721,"EXP-GAYLORD":761},
  hasRole:function(role,pArray){
      if(!pArray) return false;
      var rCode=_private.products[role];
      if(!rCode) return false;
      for(var x=0;x<pArray.length;x++){
      if(pArray[x]==rCode){
      return true;
      }
      }
      return false;
  },

  getCookie:function(cName){
    if (document.cookie.length <= 0) { return null; }

    var cStart = document.cookie.indexOf(cName + "=");
    if (cStart === -1) { return null; }

    cStart = cStart + cName.length + 1;
    var cEnd = document.cookie.indexOf(";" , cStart);
    if (cEnd === -1) { cEnd = document.cookie.length; }

    var cValue = document.cookie.substring(cStart, cEnd);

    if (typeof cValue === "remove" || cValue === null) {
      return null;
    }
    return cValue;
  }
  };

    var _public={
      isLoggedIn:function(){
      if(!_private.canRun()){
            throw new Error('Only allowed to test djcs:isLoggedIn once');
      }

      var cValue=_private.getCookie("wsjlocal");
      if(cValue)return true;
      return false;
      },

      hasRole:function(role){
      var cValue=_private.getCookie("wsjlocal");

        cValue=_url.decode(cValue);
        cValue=_url.decode(cValue);
        cValue=_base64.decode(cValue);

        var unpr = cValue.split(":");
        if (unpr.constructor == Array && unpr.length == 3) {

                   if (unpr[0] == "V1") {
                         var pr = unpr[2].split(",");
                         if (pr.constructor == Array && pr.length > 0) {
                        return _private.hasRole(role,pr);
                         }
                   }
                  }
          return false;
      },

      isLoggedInHasRole:function(role){
      if(!_private.canRun()){
            throw new Error('Only allowed to test djcs:isLoggedInHasRole once');
      }
      return _public.hasRole(role);
      }
      };
      return _public;
  }();

  var laserJ4J = new Object();
  var loggedIn = false;
  
  if(djcs.isLoggedIn() && (djcs.hasRole('WSJ') || djcs.hasRole('WSJ-TRANSIENT'))){
    window.loggedIn = true;
  }else{
    window.loggedIn = false;
  }

  laserJ4J.isLoggedIn = function (RES){
    return window.loggedIn;
  }
     

