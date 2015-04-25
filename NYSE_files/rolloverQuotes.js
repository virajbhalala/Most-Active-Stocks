$import("com.dowjones.mouse")
$import("com.dowjones.utils.objDimensions")
$import("com.dowjones.utils.SimpleDateFormat")

com.dowjones.rolloverQuotes={
	suppress:(navigator.userAgent.indexOf('MSIE 5.23; Mac')>-1),useIframe:(navigator.userAgent.toLowerCase().indexOf('safari')==-1&&navigator.userAgent.indexOf('Mac')==-1),inProgress:false,inProgressTimer:null,attempts:0,rolloverParent:null,type:"",symbol:"",timer:null,chartPrefix:"http://chartbigchart.gtm.idmanagedsolutions.com/custom/wsj-com/charts/commodities/chart.asp?size=2&style=2101&type=256&mocktick=1",container:null,
	containerDoc:function(){
		var o=null
		if(this.useIframe){
			if(typeof document.frames!='undefined'){
				o=document.frames['rqTip'].document
			}else if(typeof com.dowjones.rolloverQuotes.container.contentDocument!='undefined'){
				o=$('rqTip').contentDocument
			}else if(typeof com.dowjones.rolloverQuotes.container.contentWindow!='undefined'){
				o=$('rqTip').contentWindow
			}
		}else{
			o=document
		}
		return o
	},
	containerBody:function(){;return (this.useIframe)?((typeof this.containerDoc()=='object')?this.containerDoc().body:this.containerDoc()):this.container;},
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
		this.container.id='rqTip'
		this.container.style.display='none'
		this.container.style.margin='0px'
		this.container.style.padding='0px'
		this.container.style.borderColor='#000'
		this.container.style.borderStyle='solid'
		this.container.style.borderWidth='1px'
		this.container.style.position='absolute'
		this.container.style.left='0px'
		this.container.style.top='0px'
		this.container.style.width='250px'
		this.container.style.height='1px'
		document.body.appendChild(this.container)
	},
	inPopup:function(){;return (com.dowjones.mouse.x>com.dowjones.utils.objDimensions.left(this.container)&&com.dowjones.mouse.x<(com.dowjones.utils.objDimensions.left(this.container)+com.dowjones.utils.objDimensions.width(this.container))&&com.dowjones.mouse.y>com.dowjones.utils.objDimensions.top(this.container)&&com.dowjones.mouse.y<(com.dowjones.utils.objDimensions.top(this.container)+this.containerBody().scrollHeight));},
	show:function(n,s,t){
		if(this.suppress){;return true;}
		t=(t)?t:'usstock'
		this.rolloverParent=n
		this.symbol=s
		this.type=t
		window.clearTimeout(this.timer)
		if($('rqTip')==null)
			this.createPanel()
		if(this.container==null)
			this.container=$('rqTip')
		if(this.useIframe){
			if(this.containerBody()==null){
				this.timer=setTimeout("com.dowjones.rolloverQuotes.showagain()",100)
				return true
			}
		}
		if(this.containerBody().childNodes.length<1){
			if(this.useIframe){;var n=this.containerDoc().createElement('link');n.rel='stylesheet';n.type='text/css';n.href='/j20type.css';this.containerBody().appendChild(n);}
			var n=this.containerDoc().createElement('div');n.id='rqContent';this.containerBody().appendChild(n);
			var n=this.containerDoc().createElement('div');n.id='rqContentHeadlines';this.containerBody().appendChild(n)
			var n=this.containerDoc().createElement('div');n.id='rqContentPR';this.containerBody().appendChild(n)
			var n=this.containerDoc().createElement('div');n.id='rqPromo';this.containerBody().appendChild(n)
			var n=this.containerDoc().createElement('div');n.id='rqFootnote';this.containerBody().appendChild(n)
			if(this.useIframe){;this.containerDoc().onmouseover=function(){;parent.window.clearTimeout(parent.com.dowjones.rolloverQuotes.timer);};this.containerDoc().onmouseout=function(){;parent.com.dowjones.rolloverQuotes.hidelater();};}else{;this.containerBody().onmouseover=function(){;window.clearTimeout(com.dowjones.rolloverQuotes.timer);};this.containerBody().onmouseout=function(){;com.dowjones.rolloverQuotes.hidelater();};}
		}
		this.containerDoc().getElementById('rqContent').innerHTML='<div class="p14 bold" style="padding:8px 0px 8px 0px;background-color:#789BCE;color:#FFF;border-bottom:1px solid #000;" align="center">Loading, please wait ...</div>'
		this.containerDoc().getElementById('rqContentHeadlines').innerHTML='<div class="p11" style="background-color:#EFF3F7;padding:10px;"><img src="http://s.wsj.net/img/loading.gif"></div>'
		this.containerDoc().getElementById('rqContentPR').style.display='none'
		this.containerDoc().getElementById('rqPromo').style.display='none'
		this.containerDoc().getElementById('rqFootnote').style.display='none'
		setTimeout("com.dowjones.rolloverQuotes.adjustheight()",100)
		this.container.style.top=(com.dowjones.utils.objDimensions.top(this.rolloverParent)+com.dowjones.utils.objDimensions.height(this.rolloverParent))+"px"
		this.container.style.left=(com.dowjones.utils.objDimensions.left(this.rolloverParent)+60)+"px"
		this.container.style.display='block'
		this.fetch()
	},
	showagain:function(){;this.show(this.rolloverParent,this.symbol,this.type);},
	hide:function(){;window.clearTimeout(this.timer);if($('rqTip').style.display=='block'){;if(!this.inPopup()){;$('rqTip').style.display="none";window.clearTimeout(this.timer);}else{;this.hidelater();};};},
	hidelater:function(t){;if(this.suppress){;return true;};window.clearTimeout(this.timer);this.timer=setTimeout("com.dowjones.rolloverQuotes.hide()",1000);},
	fetch:function(){
		if(!this.inProgress) {
			this.inProgress=true
			this.attempts=0
			QUOTEJSON={data:null,callback:function(){
				var temp =""
				com.dowjones.rolloverQuotes.attempts++
				var chartingURL=('/quotes/stock_charting.html?symbol='+this.data.s+'&type=usstock&mod=mdc_rolloverquotes')
				if(typeof(this.data.etf)!='undef' && this.data.etf!="false") 
chartingURL=('/public/quotes/etf_charting.html?issue_type=ETF&chartingPage=dynamic&&Symb='+this.data.s+'&mod=mdc_rolloverquotes');
				
				var timezones = {
				'Australian Central Daylight Time':'ACDT',
				'Australian Central Standard Time':'ACST',
				'Atlantic Daylight Time':'ADT',
				'Australian Eastern Daylight Time':'AEDT',
				'Australian Eastern Standard Time':'AEST',
				'Alaska Daylight Time':'AKDT',
				'Alaska Standard Time':'AKST',
				'Atlantic Standard Time':'AST',
				'Australian Western Daylight Time':'AWDT',
				'Australian Western Standard Time':'AWST',
				'British Summer Time':'BST',
				'Central Daylight Time':'CDT',
				'Central European Daylight Time':'CEDT',
				'Central European Summer Time':'CEST',
				'Central European Time':'CET',
				'Central Summer(Daylight) Time':'CST',
				'Central Standard Time':'CST',
				'Central Standard Time':'CST',
				'Christmas Island Time':'CXT',
				'Eastern Daylight Time':'EDT',
				'Eastern European Daylight Time':'EEDT',
				'Eastern European Summer Time':'EEST',
				'Eastern European Time':'EET',
				'Eastern Summer(Daylight) Time':'EST',
				'Eastern Standard Time':'EST',
				'Eastern Standard Time':'EST',
				'Greenwich Mean Time':'GMT',
				'Heure Avanc?e de l\',Atlantique':'HAA',
				'Heure Avanc?e du Centre':'HAC',
				'Hawaii-Aleutian Daylight Time':'HADT',
				'Heure Avanc?e de l\',Est':'HAE',
				'Heure Avanc?e du Pacifique':'HAP',
				'Heure Avanc?e des Rocheuses':'HAR',
				'Hawaii-Aleutian Standard Time':'HAST',
				'Heure Avanc?e de Terre-Neuve':'HAT',
				'Heure Avanc?e du Yukon':'HAY',
				'Heure Normale de l\',Atlantique':'HNA',
				'Heure Normale du Centre':'HNC',
				'Heure Normale de l\',Est':'HNE',
				'Heure Normale du Pacifique':'HNP',
				'Heure Normale des Rocheuses':'HNR',
				'Heure Normale de Terre-Neuve':'HNT',
				'Heure Normale du Yukon':'HNY',
				'Irish Summer Time':'IST',
				'Mountain Daylight Time':'MDT',
				'Mitteleurop?ische Sommerzeit':'MESZ',
				'Mitteleurop?ische Zeit':'MEZ',
				'Mountain Standard Time':'MST',
				'Newfoundland Daylight Time':'NDT',
				'Norfolk (Island) Time':'NFT',
				'Newfoundland Standard Time':'NST',
				'Pacific Daylight Time':'PDT',
				'Pacific Standard Time':'PST',
				'Coordinated Universal Time':'UTC',
				'Western European Daylight Time':'WEDT',
				'Western European Summer Time':'WEST',
				'Western European Time':'WET',
				'Western Summer(Daylight) Time':'WST',
				'Western Standard Time':'WST'
				};
				
				this.getZone = function() {
					var tz = timezones[serverTime.toString().replace(/^.*\(|\)$/g, "")];
					if(typeof(tz) == "undefined" || !tz){
						var  d = serverTime.toString();
						tz = d.substr(d.length-8, 3);
					}
					if(typeof(tz) == "undefined"){
						tz="";
					}
					return tz;
				}
				
				this.timeZone = this.getZone();
				
				var div=com.dowjones.rolloverQuotes.containerDoc().getElementById('rqContent')
				if(div){
					div.innerHTML='<div class="p14 bold" style="padding:8px 0px;background-color:#789BCE;color:#FFF;border-bottom:1px solid #000;" align="center">'+this.data.n.toUpperCase()+'</div><div class="p11" style="background-color:#EFF3F7;padding:10px 10px 0px 10px;"><div><img name="rqChartImage" src="'+com.dowjones.rolloverQuotes.chartPrefix+'&symb='+this.data.s+'&time=1dy&frequency=1min&uf=8192" width="220" height="116" border="0" alt="stock chart"/></div><div style="border-top:1px solid #789BCE;padding:2px 0px 3px 0px;"><a id="l1" style="text-decoration: none;color:#F93;" href="'+com.dowjones.rolloverQuotes.chartPrefix+'&symb='+this.data.s+'&time=1dy&frequency=1min&uf=8192" onclick="document.rqChartImage.src=this.href;document.getElementById(\'l1\').style.color=document.getElementById(\'l2\').style.color=document.getElementById(\'l3\').style.color=document.getElementById(\'l4\').style.color=document.getElementById(\'l5\').style.color=\'#0253b7\';document.getElementById(\'l1\').style.color=\'#F93\';return false">1 Day</a> | <a id="l2" style="text-decoration: none;" href="'+com.dowjones.rolloverQuotes.chartPrefix+'&symb='+this.data.s+'&time=10dy&frequency=15min" onclick="document.rqChartImage.src=this.href;document.getElementById(\'l1\').style.color=document.getElementById(\'l2\').style.color=document.getElementById(\'l3\').style.color=document.getElementById(\'l4\').style.color=document.getElementById(\'l5\').style.color=\'#0253b7\';document.getElementById(\'l2\').style.color=\'#F93\';return false">10 Days</a> | <a id="l3" style="text-decoration: none;" href="'+com.dowjones.rolloverQuotes.chartPrefix+'&symb='+this.data.s+'&time=1mon&frequency=1day" onclick="document.rqChartImage.src=this.href;document.getElementById(\'l1\').style.color=document.getElementById(\'l2\').style.color=document.getElementById(\'l3\').style.color=document.getElementById(\'l4\').style.color=document.getElementById(\'l5\').style.color=\'#0253b7\';document.getElementById(\'l3\').style.color=\'#F93\';return false">1 Month</a> | <a id="l4" style="text-decoration: none;" href="'+com.dowjones.rolloverQuotes.chartPrefix+'&symb='+this.data.s+'&time=3mon&frequency=1day" onclick="document.rqChartImage.src=this.href;document.getElementById(\'l1\').style.color=document.getElementById(\'l2\').style.color=document.getElementById(\'l3\').style.color=document.getElementById(\'l4\').style.color=document.getElementById(\'l5\').style.color=\'#0253b7\';document.getElementById(\'l4\').style.color=\'#F93\';return false">3 Months</a> | <a id="l5" style="text-decoration: none;" href="'+com.dowjones.rolloverQuotes.chartPrefix+'&symb='+this.data.s+'&time=1yr&frequency=1day" onclick="document.rqChartImage.src=this.href;document.getElementById(\'l1\').style.color=document.getElementById(\'l2\').style.color=document.getElementById(\'l3\').style.color=document.getElementById(\'l4\').style.color=document.getElementById(\'l5\').style.color=\'#0253b7\';document.getElementById(\'l5\').style.color=\'#F93\';return false">1 Year</a></div><div class="bold" style="border-bottom:1px solid #789BCE;border-top:1px solid #789BCE;padding:3px 0px 0px 0px;margin-bottom:5px;"><img src="http://s.wsj.net/img/loginArrow.gif"/><a href="'+chartingURL+'" target="_parent">Go to Interactive Charting</a></div>'+((this.data.rts != 0) ? '<div><span class="b11">'+this.data.rtss+'</span> <span class="p9">'+com.dowjones.utils.SimpleDateFormat.format(this.data.rtd,"MM/dd/yy h:mm a ")+this.timeZone+'</span></table><div><span class="b11" style="font-size:26px;">'+this.data.rtl+'</span>'+ ((this.data.rta=='') ? '' : '<img src="'+this.data.rta+'" />')+'</div><table width="230" cellpadding="0" cellspacing="0" border="0" class="p10" style="color:#333;border-bottom:1px solid #789BCE;"><tr>	<td align="left">'+((this.data.rtc=='n.a.') ? '' : 'Change')+'</td><td align="right">'+((this.data.rtp=='n.a.') ? '' : '% Change')+'</td><td align="right">'+((this.data.rtv=='n.a.') ? '' : 'Volume')+'</td></tr><tr><td align="left" class="p13 bold change'+((this.data.rtc.substring(0,1)=="-")?"Neg":"Pos")+'">'+((this.data.rtc=='n.a.') ? '' : this.data.rtc)+'</td><td align="right" class="p13 bold change'+((this.data.rtc.substring(0,1)=="-")?"Neg":"Pos")+'">'+((this.data.rtp=='n.a.') ? '' : this.data.rtp)+'</td><td align="right" class="p13 bold" style="color:#000;">'+((this.data.rtv=='n.a.') ? '' : this.data.rtv)+'</td>	</tr><tr><td colspan="3" align="right">Source: Nasdaq Last Sale</td></tr></table>' : '')+'<div><span class="b11" align="left">Comprehensive Quote</span> <span class="p9" align="right">'+com.dowjones.utils.SimpleDateFormat.format(this.data.d,"MM/dd/yy h:mm a ")+this.timeZone+'</span></div><table width="230" cellpadding="0" cellspacing="0" border="0" class="p10" style="color:#333;"><tr><td>Last</td><td align="right">Change</td><td align="right">% Change</td><td align="right">Volume</td></tr><tr><td class="p13 bold" style="color:#000;">'+this.data.l+'</td><td align="right" class="p13 bold change'+((this.data.c.substring(0,1)=="-")?"Neg":"Pos")+'">'+this.data.c+'</td><td align="right" class="p13 bold change'+((this.data.c.substring(0,1)=="-")?"Neg":"Pos")+'">'+this.data.p+'</td><td align="right" class="p13 bold" style="color:#000;">'+this.data.v+'</span></div></div>'

					temp=temp+'<div class="p11" style="background-color:#EFF3F7;padding:5px 10px 0px 10px;">'
					temp=temp+'<div style="margin 0px;padding:5px 0px 0px 0px;border-top:1px solid #789BCE; height:11px; line-height:11px;">'
					temp=temp+'<b>Get:</b>&nbsp;<a href="/quotes/main.html?type=usstock&symbol='+this.data.s+'&mod=mdc_rolloverquotes" target="_parent">Full Research</a> | '
					temp=temp+'<a href="/pznsetup/sub/pvemail/setup.html?mod=mdc_rolloverquotes" target="_parent">Price &amp; Volume Alerts</a>'
					temp=temp+'</div></div>'
					var div=com.dowjones.rolloverQuotes.containerDoc().getElementById('rqPromo')
					div.innerHTML = temp
					div.style.display='block'
					
					temp="";
					temp=temp+'<div class="p9" style="color:#666666;background-color:#EFF3F7;padding:5px 10px 10px 10px;">'
					temp=temp+'<div style="margin:0px;padding:5px 0px 0px 0px;border-top:1px solid #789BCE;">'
					temp=temp+'Snapshot quotes reflect real-time trades reported through Nasdaq only;'
					temp=temp+'comprehensive quotes reflect trading in all markets and are delayed up to 15 minutes.'
					temp=temp+' Volume updates from 4:00 a.m. - 8:00 p.m. ET.'
					temp=temp+'</div>'
					temp=temp+'</div>'
					div=com.dowjones.rolloverQuotes.containerDoc().getElementById('rqFootnote')
					div.innerHTML = temp
					div.style.display='block'
					
				}else{;if(com.dowjones.rolloverQuotes.attempts<5){;setTimeout("QUOTEJSON.callback()",100);}else{;com.dowjones.rolloverQuotes.showagain();};}
			}}
			QUOTEHEADLINEJSON={data:null,callback:function(){
				var temp=""
				if((this.data != null) && (this.data.length>0)){
					temp=temp+'<div class="p11" style="background-color:#EFF3F7;padding:5px 10px 0px 10px;">'
					temp=temp+'<div style="border-top:1px solid #789BCE;padding-top:7px;clear:both;width:100%;">'
					temp=temp+'<div style="float:left;"><b>Latest News:</b></div>'
					temp=temp+'<div style="float:right;"><a href="/quotes/news.html?type=usstock&symbol='+com.dowjones.rolloverQuotes.symbol+'&mod=mdc_rolloverquotes" class="p11" target="_parent">See all</a></div>'
					temp=temp+'</div>'
					temp=temp+'<div style="width:100%;clear:both;">'
					for(var a=0;a<this.data.length;a++){
						temp=temp+'<div class="p11" style="float:left;padding-right:15px;">'+com.dowjones.utils.SimpleDateFormat.format(this.data[a].d,"dd-NNN")+'</div><div class="p11" style="color:#0253b7;"><a href="'+this.data[a].l+'?mod=mdc_rolloverquotes" target="_parent" >'+this.data[a].h+'</a></div>';
					}
					temp=temp+'</div>'
					temp=temp+'</div>'
				}
				var div=com.dowjones.rolloverQuotes.containerDoc().getElementById('rqContentHeadlines')
				if(div){
					if(QUOTEJSON.data==null){
						com.dowjones.rolloverQuotes.containerDoc().getElementById('rqContent').innerHTML='<div class="p14 bold" style="padding:8px 0px 8px 0px;background-color:#789BCE;color:#FFF;" align="center">Sorry</div>'
						temp='<div class="p11" style="background-color:#EFF3F7;padding:10px;">Unfortunately this service is unavailable temporally, please try later.</div>'
					}
					div.innerHTML=temp
					div.style.display=(this.data.length>0)?'block':'none';
					com.dowjones.rolloverQuotes.adjustheight()
					setTimeout("com.dowjones.rolloverQuotes.adjustheight()",100)
					setTimeout("com.dowjones.rolloverQuotes.adjustheight()",500)
					com.dowjones.rolloverQuotes.inProgress=false
				}else{;if(com.dowjones.rolloverQuotes.attempts<5){;setTimeout("QUOTEHEADLINEJSON.callback()",100);}else{;com.dowjones.rolloverQuotes.showagain();};}
			}}
			QUOTEPRJSON={data:null,callback:function(){
				var temp=""
				if((this.data != null) && (this.data.length>0)){
					temp=temp+'<div class="p11" style="background-color:#EFF3F7;padding:5px 10px 0px 10px;clear:both;">'
					temp=temp+'<div style="border-top:1px solid #789BCE;padding-top:7px;clear:both;width:100%;">'
					temp=temp+'<div style="float:left;"><b>Latest Press Release:</b></div>'
					temp=temp+'<div style="float:right;"><a href="/quotes/pr.html?type=usstock&symbol='+com.dowjones.rolloverQuotes.symbol+'&mod=mdc_rolloverquotes" class="p11" target="_parent">See all</a></div>'
					temp=temp+'</div>'
					temp=temp+'<div style="width:100%;clear:both;">'
					for(var a=0;a<this.data.length;a++){
						temp=temp+'<div class="p11" style="float:left;padding-right:15px;">'+com.dowjones.utils.SimpleDateFormat.format(this.data[a].d,"dd-NNN")+'</div><div class="p11" style="color:#0253b7;"><a href="'+this.data[a].l+'?mod=mdc_rolloverquotes" target="_parent" >'+this.data[a].h+'</a></div>';
					}
					temp=temp+'</div>'
					temp=temp+'</div>'
				}
				var div=com.dowjones.rolloverQuotes.containerDoc().getElementById('rqContentPR')
				if(div){
					if(QUOTEJSON.data==null){
						com.dowjones.rolloverQuotes.containerDoc().getElementById('rqContent').innerHTML='<div class="p14 bold" style="padding:8px 0px 8px 0px;background-color:#789BCE;color:#FFF;" align="center">Sorry</div>'
						temp='<div class="p11" style="background-color:#EFF3F7;padding:10px;">Unfortunately this service is unavailable temporally, please try later.</div>'
					}
					div.innerHTML=temp
					div.style.display=(this.data.length>0)?'block':'none';
					com.dowjones.rolloverQuotes.adjustheight()
					setTimeout("com.dowjones.rolloverQuotes.adjustheight()",100)
					setTimeout("com.dowjones.rolloverQuotes.adjustheight()",500)
					com.dowjones.rolloverQuotes.inProgress=false
				}else{;if(com.dowjones.rolloverQuotes.attempts<5){;setTimeout("QUOTEPRJSON.callback()",100);}else{;com.dowjones.rolloverQuotes.showagain();};}
			}}
			SetCookie("CRS","","1m-");SetCookie("CRT","","1m-");$import("/public/quotes/json.html?type="+this.type+"&symbol="+this.symbol+"&r="+new Date().getTime(),'rcq',((this.useIframe)?false:true))
		}else{;window.clearTimeout(this.inProgressTimer);this.inProgressTimer=setTimeout("com.dowjones.rolloverQuotes.fetch()",100);}
	},
	adjustheight:function(){
		this.container.style.height="0px";this.container.style.height=(this.containerBody().scrollHeight)+"px"
		if(((com.dowjones.utils.objDimensions.top(this.container)-((typeof window.pageYOffset!='undefined')?window.pageYOffset:((typeof document.documentElement!='undefined')?document.documentElement.scrollTop:document.body.scrollTop)))+com.dowjones.utils.objDimensions.height(this.container))>((navigator.userAgent.indexOf("Mac")>0)?((typeof window.innerHeight!='undefined')?window.innerHeight:document.body.clientHeight):((typeof window.innerHeight!='undefined')?window.innerHeight:((document.documentElement)?document.documentElement.clientHeight:document.body.offsetHeight)))){
			this.container.style.top=((((navigator.userAgent.indexOf("Mac")>0)?((typeof window.innerHeight!='undefined')?window.innerHeight:document.body.clientHeight):((typeof window.innerHeight!='undefined')?window.innerHeight:((document.documentElement)?document.documentElement.clientHeight:document.body.offsetHeight)))-com.dowjones.utils.objDimensions.height(this.container))+((typeof window.pageYOffset!='undefined')?window.pageYOffset:((typeof document.documentElement!='undefined')?document.documentElement.scrollTop:document.body.scrollTop))-4)+"px"
		}
	}
}
