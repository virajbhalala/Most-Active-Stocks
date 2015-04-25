com.dowjones.video={
    articlePlayer:{
        src:"http://wsj.vo.llnwd.net/o28/plymedia/SWF/BrightPLYembed.swf",
        flashVars:"playerId=452319854&viewerSecureGatewayURL=https://services.brightcove.com/services/amfgateway&servicesURL=http://services.brightcove.com/services&cdnURL=http://admin.brightcove.com&domain=embed&autoStart=false&showTicker=true&flashId=flashObj&",
        idParamNameNonGuid:"&videoId=",
        idParamNameGuid:"&videoRef=",
        base:"http://wsj.vo.llnwd.net/o28/plymedia/SWF",
        name:"BrightPLYembed",
        bgcolor:"#000000",
        pluginspage:"http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash",
        draw:function(v,w,h,a,t,c){
            if(!w||w==""){w="320";}
            if(!h||h==""){h="290";}
            var isguid=((""+v).indexOf('-')>-1);
            if (isguid){
                this.idParamName=this.idParamNameGuid;v='{'+v+'}';
            }else{
                this.idParamName=this.idParamNameNonGuid;
            }
            document.write(this.code(v,w,h,a,t,c));
        },
        code:function(v,w,h,a,t,c){;a=(a=='none')?"":('align="'+a+'"');return '<table cellpadding="0" cellspacing="0" border="0" style="margin-right:8px;" width="'+w+'" height="'+h+'" '+a+'><tr><td><embed src="'+this.src+'" bgcolor="'+this.bgcolor+'" flashVars="'+this.flashVars+this.idParamName+v+'&width= '+w+'&height='+ h+'&" base="'+this.base+'" name="'+this.name+'" width="'+w+'" height="'+h+'" seamlesstabbing="false" type="application/x-shockwave-flash" allowFullScreen="true" quality="high" swLiveConnect="true" pluginspage="'+this.pluginspage+'"></embed></td></tr><tr><td class="medcptnocrd">'+c+'</td></tr></table>';}
    }
}