dojo.provide("dj.util.animation");
dj.util.animation={crossFadeInsert:function(a,b,c){var e=new dojo.Deferred,f=0,j,g,h,l;g=dojo.byId(b);b=dojo.delegate({height:500,fadeOut:800,fadeIn:1200},c);c=dojo.contentBox(g);dojo.style(g,{position:"relative",height:c.h+"px"});if(!dojo.isIE||dojo.isIE&&!dojo.isQuirks&&dojo.isIE>7)dojo.style(g,{minHeight:"inherit"});h=dojo.create("div",{innerHTML:g.innerHTML,style:{position:"absolute",top:dojo.style(g,"paddingTop")+"px",left:dojo.style(g,"paddingLeft")+"px"}});dojo.place(h,g,"only");l=dojo.create("div",
{style:{overflow:"hidden",opacity:0,height:0}},g);a=typeof a==="object"?dojo.place(a,l):dojo.create("div",{innerHTML:a},l);a=dojo.marginBox(a);j=function(){++f===3&&e.callback()};a=dojo.animateProperty({node:g,duration:b.height,properties:{height:{start:c.h,end:a.h}},onEnd:function(){dojo.style(l,{overflow:"visible"});j()}});c=dojo.fadeOut({node:h,duration:b.fadeIn,onEnd:function(){dojo.destroy(h);dojo.style(g,{position:""});dojo.attr(l,"style","");j()}});b=dojo.fadeIn({node:l,duration:b.fadeIn,onEnd:function(){j()}});
a.play();c.play();b.play();return e}};
dojo.provide("dj.util.Form");
dj.util.Form={submitOnEvent:function(a,b,c){c=c||"onclick";a=dojo.byId(a);var e=document[b];if(typeof a==="undefined"||a===null||typeof e==="undefined"||e===null)console.warn("{dj.util.Form} element and/or form not found");else return dojo.connect(a,c,function(f){dojo.stopEvent(f);e.submit()})},clearOrDefaultValue:function(a){a=dojo.byId(a);dojo.connect(a,"onfocus",this,function(b){b=b.srcElement||b.target;if(b.value===b.defaultValue)b.value=""});dojo.connect(a,"onblur",this,function(b){b=b.srcElement||
b.target;if(b.value==="")b.value=b.defaultValue})},clearValue:function(a,b){var c=[],e=dojo.byId(a);if(e===null)throw Error("{dj.util.Form} element not found");var f=dojo.trim(e.value);if(typeof b=="undefined")e.value=" ";else if(dojo.isArray(b))c=b;else c.push(b);for(var j=0,g=c.length;j<g;j++)if(c[j]==f)e.value=""},checkEmpty:function(a){a=dojo.byId(a);if(a===null)throw Error("{dj.util.Form} element not found");return dojo.trim(a.value)===""},validateEmailAddresses:function(a){return/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(a)},
hasValidContent:function(a,b){if(b!=="")return a.test(b);return false}};
typeof dojo==="object"&&dojo.provide("dj.util.JSExec");if(typeof dj=="undefined")dj={};if(typeof dj.util=="undefined")dj.util={};if(typeof dj.context=="undefined")dj.context={};if(typeof dj.context.jsexec=="undefined")dj.context.jsexec={};
(function(){var a=0,b=undefined;dj.util.JSExec=function(c){var e=dj.util,f=window.console,j=function(){},g=typeof e.Perf=="object",h=g&&typeof e.Perf.mark=="function"?e.Perf.mark:j,l=g&&typeof e.Perf.measure=="function"?e.Perf.measure:j,n=f&&typeof f.warn=="function";if(g&&(e.Perf.type=="console"||e.Perf.type=="jiffy")){b="JSEXEC: "+a++;h(b);h=j}return function(k,p,o){try{p=k+"-"+p;h(p);o.apply(c);l(p,b)}catch(r){n&&console.warn("JSExec %d: %o",k,r)}}}})();
dojo.provide("dj.util.PollingConditionChecker");dojo.declare("dj.util.PollingConditionChecker",[],{check:function(a,b,c,e){var f=new dojo.Deferred,j=0,g;g=function(){if(j>=c)f.errback(e);else if(a())f.callback();else{j++;setTimeout(g,b)}};setTimeout(g,b);return f}});
dojo.provide("dj.util.user.Environment");dojo.declare("dj.util.user.Environment",[],{constructor:function(a,b,c){this.region=a;this.product=b;this.subType=c},toString:function(){return this.region+"_"+this.product+"_"+this.subType}});
dojo.provide("dj.util.user.EnvironmentDao");dojo.require("dj.util.user.Environment");
dojo.declare("dj.util.user.EnvironmentDao",[],{constructor:function(a,b){this.region=a;this.user=b},getEnvironment:function(){var a=new dojo.Deferred,b=new dj.util.user.Environment;b.region=this.getRegion();this.getProduct().then(dojo.hitch(this,function(c){b.product=c;return this.user.getSubscriptionType()})).then(dojo.hitch(this,function(c){b.subType=c;a.callback(b)}));return a},getRegion:function(){var a=this.region.getViewByRegion(),b={"na,us":"NA",asia:"ASIA","asia,india":"INDIA","asia,jp":"JP",
"asia,kr":"KR","asia,indo":"INDO",europe:"EUROPE","europe,tr":"TR",germany:"DE","na,lat":"LAT","na,br":"BR","europe,de":"DE","asia,cn":"CN"};return b[a]?b[a]:(a.split(",")[0]||"NA").toUpperCase()},getProduct:function(){var a=new dojo.Deferred;this.user.hasRole("WSJ-PRO",dojo.hitch(this,function(b){b?a.callback("PRO"):this.user.hasRole("WSJ-ENT",function(c){c?a.callback("PRO"):a.callback("WSJ")})}));return a}});
dojo.provide("dj.util.io.script");dojo.require("dj.util.string");dojo.require("dj.util.io");
dj.util.io.script={get:function(a){var b=new dojo.Deferred,c="dj.util.io.script._jsonp"+ ++this.__ctr+"._jsonpCallback";a=dojo.mixin({jsonp:"c",jsonpCallback:c,content:{},timeout:5E3},a);var e,f=false;dj.util.string.toFunction(a.jsonpCallback,function(j){f=true;b.callback(j)});a.content[a.jsonp]=a.jsonpCallback;c=dojo.objectToQuery(a.content);e=a.url+"?"+c;dj.util.io.insertScriptAsync(e);setTimeout(function(){f||b.errback("[io.script] url timed out: '"+e+"'")},a.timeout);return b},__ctr:0};
dojo.provide("dj.widget.fragmentloader.dao.FileServiceDao");
dojo.declare("dj.widget.fragmentloader.dao.FileServiceDao",[],{DEFAULT_CONFIG:{TTL:"24h"},constructor:function(a,b,c){this.script=a;this.coreContext=b;this.cfg=dojo.delegate(this.DEFAULT_CONFIG,c)},getFragment:function(a){if(!a||!a.id)throw Error("FileServiceDao: fragment must have an id");this._useDataId(a.id);var b=new dojo.Deferred,c,d=a.getAbsolutePaths();c=this._getFileServiceUrl();d={absolutePath:d,TTL:this.cfg.TTL};if(this.cfg.maxCacheDurationSeconds!==null&&typeof this.cfg.maxCacheDurationSeconds!=
"undefined")d.maxCacheDurationSeconds=this.cfg.maxCacheDurationSeconds;c=this.script.get({url:c,content:d,jsonp:"c",jsonpCallback:"dj.module._fileServiceDao."+a.id,timeout:25E3});c.addCallback(this,function(e){var f,g,h;g=0;for(h=e.files.length;g<h;g++){f=e.files[g];if(f.statusCode!==200){b.errback(Error("FileServiceDao: unsuccessful status code: "+f.statusCode+" for url: "+f.absolutePath));return}}b.callback(this._populateFragmentWithFiles(a,e.files))});c.addErrback(function(e){b.errback(Error("FileServiceDao: service error: "+
e))});return b},__dataIds:{},_useDataId:function(a){this.__dataIds[a]=true},_getFileServiceUrl:function(){var a=this.coreContext.customCacheCdnPrefix;if(typeof this.cfg.akamaiCdnPrefix!=="undefined"&&this.cfg.akamaiCdnPrefix!=="")a=this.cfg.akamaiCdnPrefix;return a+"/cdssvco/file/v2/Files"},_populateFragmentWithFiles:function(a,b){if(dojo.isArray(a.cssFiles))for(var c=0,d=a.cssFiles.length;c<d;c++){var e=a.cssFiles[c];e.data=this._getDataByPath(b,e.absolutePath)}if(a.jsFile)a.jsFile.data=this._getDataByPath(b,
a.jsFile.absolutePath);if(a.htmlFile)a.htmlFile.data=this._getDataByPath(b,a.htmlFile.absolutePath);if(a.jsonFile)a.jsonFile.data=this._getDataByPath(b,a.jsonFile.absolutePath);return a},_getDataByPath:function(a,b){var c,d,e;c=0;for(d=a.length;c<d;c++){e=a[c];if(e.absolutePath===b)return e.data}throw"FileServiceDao: path is not in the files";}});
dojo.provide("dj.widget.fragmentloader.File");dojo.declare("dj.widget.fragmentloader.File",[],{constructor:function(a,b){this.absolutePath=a;this.data=b}});
dojo.provide("dj.widget.fragmentloader.Fragment");dojo.declare("dj.widget.fragmentloader.Fragment",[],{constructor:function(a,b,c,d){this.id=a;this.cssFiles=b;this.jsFile=c;this.htmlFile=d},getAbsolutePaths:function(){var a=[],b,c;if(dojo.isArray(this.cssFiles)){b=0;for(c=this.cssFiles.length;b<c;b++)a.push(this.cssFiles[b].absolutePath)}this.jsFile&&a.push(this.jsFile.absolutePath);this.htmlFile&&a.push(this.htmlFile.absolutePath);return a}});
dojo.provide("dj.widget.fragmentloader.renderer.FileRenderer");dojo.require("dj.util.string");
dojo.declare("dj.widget.fragmentloader.renderer.FileRenderer",[],{constructor:function(a,b){this.animation=a;this.checker=b},renderCss:function(a){var b,c,d,e,f=dojo.doc.head||dojo.query("head")[0];b=0;for(c=a.length;b<c;b++){e=a[b];d=dojo.create("style",{type:"text/css","data-absolutePath":e.absolutePath});cssStr=e.data;if(d.styleSheet)d.styleSheet.cssText=cssStr;else d.appendChild(dojo.doc.createTextNode(cssStr));dojo.place(d,f,"last")}},renderHtml:function(a,b,c){c=typeof c=="undefined"?true:c;
var d=new this.checker.check(function(){return dojo.byId(b)},25,40,"Retriever: exceded num of retries for HTML");if(c)return dojo.when(d,dojo.hitch(this.animation,"crossFadeInsert",a.data,b));else{dojo.place(a.data,b,"only");def=new dojo.Deferred;def.resolve();return def}},renderJs:function(a){var b=dojo.create("script",{type:"text/javascript"});if(dojo.isIE)b.text=a.data;else b.appendChild(dojo.doc.createTextNode(a.data));a=dojo.doc.getElementsByTagName("script")[0];a.parentNode.insertBefore(b,a)},
renderInlineJs:function(a){dj.util.string.evalScripts(a.data,a.absolutePath)}});
dojo.provide("dj.widget.fragmentloader.bo.FragmentBo");dojo.require("dj.widget.fragmentloader.File");dojo.require("dj.widget.fragmentloader.Fragment");
dojo.declare("dj.widget.fragmentloader.bo.FragmentBo",[],{DEFAULT_CONFIG:{js:{providedUnits:"j_global_slim"},css:{},html:{}},constructor:function(a,b,c){this.dao=a;this.userEnv=b;this.cfg=dojo.delegate(this.DEFAULT_CONFIG,c);this.assetPaths=dj.context.core.assetPaths;this.cssToGetList=dj.context.core.cssToGet},getFragment:function(a,b){return dojo.when(this.userEnv,dojo.hitch(this,function(c){var d="fragment_"+c.toString()+"_"+a;d=new dj.widget.fragmentloader.Fragment(d);d.cssFiles=this.cfg.isLoadCss?
this._getCssFiles(c,a,b):undefined;d.jsFile=this.cfg.isLoadJs?this._getJsFile(c,a,b):undefined;d.htmlFile=this.cfg.isLoadHtml?this._getHtmlFile(c,a,b):undefined;return this.dao.getFragment(d)}))},_getCssFiles:function(a,b,c){var d=this._getCssFileList(dojo.isIE),e=Array(d.length);i=0;for(len=d.length;i<len;i++)e[i]=new dj.widget.fragmentloader.File(this.assetPaths.style+"/"+d[i]+"/"+a+"/"+b+"-"+c+".css");return e},_getJsFile:function(a,b,c){return new dj.widget.fragmentloader.File(this.assetPaths.script+
"/bucket/"+a+"/page/"+b+"/provided/"+this.cfg.js.providedUnits+"/version/"+c+".js")},_getHtmlFile:function(a,b,c){var d=this._getHtmlChipStr();return new dj.widget.fragmentloader.File("/public"+this.assetPaths.page+"/"+a+":"+b+"-"+d+c+".html")},_getHtmlChipStr:function(){return dojo.isArray(this.cfg.html.chips)?this.cfg.html.chips.join("-")+"-":""},_getCssFileList:function(a){var b=["2/std","3/std","4/std"];if(typeof this.cssToGetList!=="undefined")b=this.cssToGetList;if(typeof a!=="undefined")if(a<
7)b.push("1/ie6");else if(a==7)b.push("1/ie7");else if(a==8)b.push("1/ie8");else a==9&&b.push("1/ie9");return b}});
dojo.provide("dj.widget.fragmentloader.FragmentLoader");dojo.require("dj.util.PollingConditionChecker");dojo.require("dj.util.animation");dojo.require("dj.util.io.script");dojo.require("dj.widget.fragmentloader.renderer.FileRenderer");dojo.require("dj.widget.fragmentloader.bo.FragmentBo");dojo.require("dj.widget.fragmentloader.dao.FileServiceDao");
dojo.declare("dj.widget.fragmentloader.FragmentLoader",[],{DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,isLoadInlineJs:false,isDataCallback:false,isAnimated:true,akamaiCdnPrefix:""},constructor:function(a,b,c,d,e){this.userEnv=a;this.mstPageId=b;this.domNodeId=d;this.version=c;this.cfg=dojo.delegate(this.DEFAULT_CONFIG,e);this._initRenderers()},load:function(){return dojo.when(this.fragmentBo.getFragment(this.mstPageId,this.version),dojo.hitch(this,function(a){this.cfg.isDataCallback&&
this.onDataCallback(a);if(this.cfg.isLoadCss){this.fileRenderer.renderCss(a.cssFiles);this.onCssLoad()}if(this.cfg.isLoadHtml)this.fileRenderer.renderHtml(a.htmlFile,this.domNodeId,this.cfg.isAnimated).then(dojo.hitch(this,function(){this.onHtmlLoad();if(this.cfg.isLoadJs){this.fileRenderer.renderJs(a.jsFile);this.onJsLoad()}if(this.cfg.isLoadInlineJs){this.fileRenderer.renderInlineJs(a.htmlFile);this.onInlineJsLoad()}}));else if(this.cfg.isLoadJs){this.fileRenderer.renderJs(a.jsFile);this.onJsLoad()}}))},
onCssLoad:function(){},onJsLoad:function(){},onHtmlLoad:function(){},onInlineJsLoad:function(){},onDataCallback:function(){},_initRenderers:function(){var a=new dj.widget.fragmentloader.dao.FileServiceDao(dj.util.io.script,dj.context.core,this.cfg),b=new dj.util.PollingConditionChecker;this.fragmentBo=new dj.widget.fragmentloader.bo.FragmentBo(a,this.userEnv,this.cfg);this.fileRenderer=new dj.widget.fragmentloader.renderer.FileRenderer(dj.util.animation,b)}});

dojo.provide("dj.widget.Slider");dojo.declare("dj.widget.Slider",null,{constructor:function(handle,track,options){this._eventConnectHandles=[];var slider=this;if(dojo.isArray(handle)){this.handles=[];for(var count=0,max=handle.length;count<max;count++){this.handles.push(dojo.byId(handle[count]));}}else{this.handles=[dojo.byId(handle)];}
this.track=dojo.byId(track);this.options=options||{};this.axis=this.options.axis||'horizontal';this.increment=this.options.increment||1;this.step=parseInt(this.options.step||'1',10);this.range=this.options.range||{start:0,end:1};this.value=0;this.values=[];dojo.forEach(this.handles,dojo.hitch(this,function(){this.values.push(0);}));this.spans=this.options.spans?dojo.forEach(this.options.spans,function(s){return dojo.byId(s);}):false;this.options.startSpan=dojo.byId(this.options.startSpan||null);this.options.endSpan=dojo.byId(this.options.endSpan||null);this.restricted=this.options.restricted||false;this.maximum=this.options.maximum||this.range.end;this.minimum=this.options.minimum||this.range.start;this.alignX=parseInt(this.options.alignX||'0',10);this.alignY=parseInt(this.options.alignY||'0',10);this.trackLength=this.maximumOffset()-this.minimumOffset();this.handleLength=this.isVertical()?(this.handles[0].offsetHeight!==0?this.handles[0].offsetHeight:this.handles[0].style.height.replace(/px$/,"")):(this.handles[0].offsetWidth!==0?this.handles[0].offsetWidth:this.handles[0].style.width.replace(/px$/,""));this.active=false;this.dragging=false;this.disabled=false;if(this.options.disabled){this.setDisabled();}
this.allowedValues=this.options.values?this.options.values.sort():false;if(this.allowedValues){this.minimum=(this.allowedValues.length>0)?this.allowedValues[0]:0;this.maximum=(this.allowedValues.length>0)?this.allowedValues[this.allowedValues.length-1]:0;}
this.eventMouseDown=dojo.hitch(this,this.startDrag);this.eventMouseUp=dojo.hitch(this,this.endDrag);this.eventMouseMove=dojo.hitch(this,this.update);dojo.forEach(this.handles,function(h,i){i=slider.handles.length-1-i;slider.setValue(parseFloat((dojo.isArray(slider.options.sliderValue)?slider.options.sliderValue[i]:slider.options.sliderValue)||slider.range.start),i);if(h.style.position&&h.style.position==='static'){h.style.position='relative';if(dojo.isOpera){h.style.top=0;h.style.left=0;}}
slider._eventConnectHandles.push(dojo.connect(h,'onmousedown',slider.eventMouseDown));});this._eventConnectHandles.push(dojo.connect(this.track,'onmousedown',this.eventMouseDown));this._eventConnectHandles.push(dojo.connect(document,'onmouseup',this.eventMouseUp));this._eventConnectHandles.push(dojo.connect(document,'onmousemove',this.eventMouseMove));this.initialized=true;},dispose:function(){dojo.forEach(this._eventConnectHandles,dojo.disconnect);},setDisabled:function(){this.disabled=true;},setEnabled:function(){this.disabled=false;},getNearestValue:function(value){if(this.allowedValues){var max=(this.allowedValues.length>0)?this.allowedValues[this.allowedValues.length-1]:0;if(value>=max){return(max);}
var min=(this.allowedValues.length>0)?this.allowedValues[0]:0;if(value<=min){return(min);}
var offset=Math.abs(this.allowedValues[0]-value);var newValue=this.allowedValues[0];dojo.forEach(this.allowedValues,function(v){var currentOffset=Math.abs(v-value);if(currentOffset<=offset){newValue=v;offset=currentOffset;}});return newValue;}
if(value>this.range.end){return this.range.end;}
if(value<this.range.start){return this.range.start;}
return value;},setValue:function(sliderValue,handleIdx){if(!this.active){this.activeHandleIdx=handleIdx||0;this.activeHandle=this.handles[this.activeHandleIdx];this.updateStyles();}
handleIdx=handleIdx||this.activeHandleIdx||0;if(this.initialized&&this.restricted){if((handleIdx>0)&&(sliderValue<this.values[handleIdx-1])){sliderValue=this.values[handleIdx-1];}
if((handleIdx<(this.handles.length-1))&&(sliderValue>this.values[handleIdx+1])){sliderValue=this.values[handleIdx+1];}}
sliderValue=this.getNearestValue(sliderValue);this.values[handleIdx]=sliderValue;this.value=this.values[0];this.handles[handleIdx].style[this.isVertical()?'top':'left']=this.translateToPx(sliderValue);this.drawSpans();if(!this.dragging||!this.event){this.updateFinished();}},setValueBy:function(delta,handleIdx){this.setValue(this.values[handleIdx||this.activeHandleIdx||0]+delta,handleIdx||this.activeHandleIdx||0);},translateToPx:function(value){return Math.round(((this.trackLength-this.handleLength)/(this.range.end-this.range.start))*(value-this.range.start))+"px";},translateToValue:function(offset){return((offset/(this.trackLength-this.handleLength)*(this.range.end-this.range.start))+this.range.start);},getRange:function(range){var v=this.values.sort();range=range||0;return{start:v[range],end:v[range+1]};},minimumOffset:function(){return(this.isVertical()?this.alignY:this.alignX);},maximumOffset:function(){return(this.isVertical()?(this.track.offsetHeight!==0?this.track.offsetHeight:this.track.style.height.replace(/px$/,""))-this.alignY:(this.track.offsetWidth!==0?this.track.offsetWidth:this.track.style.width.replace(/px$/,""))-this.alignX);},isVertical:function(){return(this.axis=='vertical');},drawSpans:function(){var slider=this;if(this.spans){for(var count=0,max=this.spans.length-1;count<=max;count++){slider.setSpan(slider.spans[count],slider.getRange(count));}}
if(this.options.startSpan){this.setSpan(this.options.startSpan,{start:0,end:this.values.length>1?this.getRange(0).start:this.value});}
if(this.options.endSpan){this.setSpan(this.options.endSpan,{start:this.values.length>1?this.getRange(this.spans.length-1).end:this.value,end:this.maximum});}},setSpan:function(span,range){if(this.isVertical()){span.style.top=this.translateToPx(range.start);span.style.height=this.translateToPx(range.end-range.start+this.range.start);}else{span.style.left=this.translateToPx(range.start);span.style.width=this.translateToPx(range.end-range.start+this.range.start);}},updateStyles:function(){dojo.forEach(this.handles,function(h){dojo.removeClass(h,'selected');});dojo.addClass(this.activeHandle,'selected');},startDrag:function(event){if(dojo.mouseButtons.isLeft(event)){if(!this.disabled){this.active=true;var handle=event.target;var pointer=[event.clientX,event.clientY];var track=handle;if(track==this.track){var trackPosition=dojo.position(this.track);this.event=event;this.setValue(this.translateToValue((this.isVertical()?pointer[1]-trackPosition.y:pointer[0]-trackPosition.x)-(this.handleLength/2)));var handlePosition=dojo.position(this.activeHandle);this.offsetX=(pointer[0]-handlePosition.x);this.offsetY=(pointer[1]-handlePosition.y);}else{while((dojo.indexOf(this.handles,handle)==-1)&&handle.parentNode){handle=handle.parentNode;}
if(dojo.indexOf(this.handles,handle)!=-1){this.activeHandle=handle;this.activeHandleIdx=dojo.indexOf(this.handles,this.activeHandle);this.updateStyles();var activeHandlePosition=dojo.position(this.activeHandle);this.offsetX=(pointer[0]-activeHandlePosition.x);this.offsetY=(pointer[1]-activeHandlePosition.y);}}}
dojo.stopEvent(event);}},update:function(event){if(this.active){if(!this.dragging){this.dragging=true;}
this.draw(event);if(dojo.isWebKit){window.scrollBy(0,0);}
dojo.stopEvent(event);}},draw:function(event){var pointer=[event.clientX,event.clientY];var trackPosition=dojo.position(this.track);pointer[0]-=this.offsetX+trackPosition.x;pointer[1]-=this.offsetY+trackPosition.y;this.event=event;this.setValue(this.translateToValue(this.isVertical()?pointer[1]:pointer[0]));if(this.initialized&&this.options.onSlide){this.options.onSlide(this.values.length>1?this.values:this.value,this);}},endDrag:function(event){if(this.active&&this.dragging){this.finishDrag(event,true);dojo.stopEvent(event);}
this.active=false;this.dragging=false;},finishDrag:function(event,success){this.active=false;this.dragging=false;this.updateFinished();},updateFinished:function(){if(this.initialized&&this.options.onChange){this.options.onChange(this.values.length>1?this.values:this.value,this);}
this.event=null;}});dojo.provide("dj.widget.panel.LiveModalPanel");
dojo.require("dj.util.Element");

(function(djl) {
  (dj.widget.panel.LiveModalPanel = function(cfg) {
    this.cfg = djl.cloneMixin(this.DEFAULT_CONFIG, cfg);
    this._setupEvents();
  }).prototype = {
    DEFAULT_CONFIG : {
      container : ".linklist_dropdown .mn_dropdown_container",
      containerInd : ".linklist_dropdown .mn_dropdown_container",
      dropdownContent : ".mn_dropdownPanel > .mn_dropdownContent",
      actionEvent : "click",
      stateContainer : ".mn_dropdownTree",
      stateCollapsed : "mn_ddState-collapsed",
      stateExpanded : "mn_ddState-expanded",
      navContainer : ".pmMainNav",
      stateHover : "mndd_ddState-hover ",
      queryUpClass : "mn_dropdownTree",
      addMouseEvents : false
    },

    prevActivePanel : undefined,
    navOpened : false,
    _setupEvents : function() {
      var that = this;

      if ( this.cfg.addMouseEvents ) {
        djl.addLiveEvent(this.cfg.container, "mouseover", function(ev) {
          that.mouseOverOut(this, ev);
        });
      }

      djl.addLiveEvent(this.cfg.containerInd, this.cfg.actionEvent, function(ev) {
        var node = that._queryUpForClassName(this, that.cfg.queryUpClass);
        that.togglePanel(node, ev);
      });

      if ( this.cfg.addMouseEvents ) {
        djl.addLiveEvent(this.cfg.container, "mouseout", function(ev) {
          that.mouseOverOut(this, ev);
        });
      }
      this.oDropdownContainer = dojo.query(this.cfg.navContainer)[0];

      /* Close the dropdown when a click happens outside of it */
      dojo.connect(document, 'onclick', function(ev) {
        // link clicked
          if ( ev.target.nodeName == "A" ) { return true; }

          if ( that.prevActivePanel !== undefined && that.navOpened === true ) {
            var dropd = dojo.query(that.cfg.dropdownContent, that.prevActivePanel)[0];
            if ( dropd !== undefined && !dj.util.Element.contains(dropd, ev.clientX, ev.clientY) ) {
              that.togglePanel(dropd, ev);
              that.navOpened = false;
            }
          }
        });
    },

    _queryUpForClassName : function(node, cn) {
      if ( node.className.indexOf(cn) == -1 ) {
        while ((typeof node !== "object") || (null === node.className) || !node.className || (node.className.indexOf(cn) !== 0)) {
          node = node.parentNode;
        }
      }
      return node;
    },

    togglePanel : function(dropd, event) {
      var cfg = this.cfg;

      if ( dojo.hasClass(dropd, cfg.stateCollapsed) ) {
        dojo.removeClass(dropd, cfg.stateCollapsed);
        dojo.addClass(dropd, cfg.stateExpanded);
        this.navOpened = true;
      } else {
        dojo.removeClass(dropd, cfg.stateExpanded);
        dojo.addClass(dropd, cfg.stateCollapsed);
        this.navOpened = false;
      }

      if ( this.prevActivePanel !== undefined && this.prevActivePanel != dropd ) {
        dojo.removeClass(this.prevActivePanel, cfg.stateExpanded);
        dojo.addClass(this.prevActivePanel, cfg.stateCollapsed);
      }

      this.prevActivePanel = dropd;
      dojo.stopEvent(event);
    },

    mouseOverOut : function(elm, ev) {
      var cfg = this.cfg, dropd = dojo.query(cfg.stateContainer, elm)[0];
      if ( dropd !== undefined ) {
        if ( ev.type == "mouseover" ) {
          dojo.addClass(dropd, cfg.stateHover);
        } else if ( ev.type == "mouseout" ) {
          dojo.removeClass(dropd, cfg.stateHover);
        }
      }
    }

  };
}(dj.lang));
dojo.provide("dj.widget.panel.SelectDropdownPanel");
dojo.require("dj.util.Element");
dojo.require("dj.lang");

dojo.declare("dj.widget.panel.SelectDropdownPanel", null, {
  DEFAULT_CONFIG : {
    scrollContainerClass: ".scroll_container",
    scrollBarClass: ".scrollbar",
    scrollTrackClass: ".scrollbar_container",
    scrollValuesContainerClass: ".scroll_values_container",
    dropdownCollapsedClassName: "dropdown_collapsed",
    dropdownExpandedClassName: "dropdown_open",
    scrollContainerCollapsedClassName: "collapsed",
    scrollContainerExpandedClassName: "expanded",
    selectedClassName: ".selected",
    scrollTrackContainerClassName: ".scroll_track",
    dropdownScrollUpArrow: ".scroll_up",
    dropdownScrollDownArrow: ".scroll_down",
    scrollTrackHeight: "154",
    scrollValuesDisplayHeight: "190",
    scrollBarArrowShiftValue: "2"
  },

  /**
   * Constructor. Initializes HTMLElement objects and enables the select dropdown.
   *
   * @param {String} selectDropdownContainer  - the id of the container containing the scroll elements and the scrollValuesContainer
   * @param {String} scrollValuesContainer  - the id of the container containing the dropdown values
   * @param {Object} config         - the configuration for other parameters
   */
  constructor: function(selectDropdownContainer, config) {
    this.cfg = dj.lang.cloneMixin(this.DEFAULT_CONFIG, config);

    var scrollBarClass = this.cfg.scrollBarClass;
    var scrollTrackClass = this.cfg.scrollTrackClass;
    var scrollContainerClass = this.cfg.scrollContainerClass;
    var scrollValuesContainerClass = this.cfg.scrollValuesContainerClass;

    this.oSelectDropDownContainer = dojo.byId(selectDropdownContainer);

    if (this.oSelectDropDownContainer) {
      this.oScrollBar = dojo.query(scrollBarClass, this.oSelectDropDownContainer)[0];
      this.oScrollTrack = dojo.query(scrollTrackClass, this.oSelectDropDownContainer)[0];
      this.oScrollContainer = dojo.query(scrollContainerClass, this.oSelectDropDownContainer)[0];
      this.oScrollValuesContainer = dojo.query(scrollValuesContainerClass, this.oSelectDropDownContainer)[0];

      this._setupSelectDropdown(this.oSelectDropDownContainer, this.oScrollContainer, this.oScrollValuesContainer, this.oScrollBar, this.oScrollTrack);
    }
  },

  /**
   * Sets up the select dropdown by configuring a slider for the scroll action and a modal panel
   * for the dropdown.
   *
   * @param {Object} oSelectDropdownContainer - the parent container
   * @param {Object} oScrollContainer - the container encompassing the select dropdowm
   * @param {Object} oScrollValuesContainer - the container having the dropdown values
   * @param {Object} oScrollBar       - the scroll bar
   * @param {Object} oScrollTrack       - the scroll track
   */
  _setupSelectDropdown : function(oSelectDropdownContainer, oScrollContainer, oScrollValuesContainer, oScrollBar, oScrollTrack) {
    //Observer to open/close the select dropdown
    var selectDropdownCollapsedClassName = this.cfg.dropdownCollapsedClassName;
    var selectDropdownExpandedClassName = this.cfg.dropdownExpandedClassName;

    var scrollContainerCollapsedClassName = this.cfg.scrollContainerCollapsedClassName;
    var scrollContainerExpandedClassName = this.cfg.scrollContainerExpandedClassName;

    var selectedClassName = this.cfg.selectedClassName;
    this.oSelected = dojo.query(selectedClassName, oSelectDropdownContainer)[0];

    var toggleDropdownClass = function(){
      if(dojo.hasClass(oSelectDropdownContainer,selectDropdownCollapsedClassName)){
        dojo.removeClass(oSelectDropdownContainer,selectDropdownCollapsedClassName);
        dojo.addClass(oSelectDropdownContainer,selectDropdownExpandedClassName);
      } else
        if(dojo.hasClass(oSelectDropdownContainer,selectDropdownExpandedClassName)){
          dojo.removeClass(oSelectDropdownContainer,selectDropdownExpandedClassName);
          dojo.addClass(oSelectDropdownContainer,selectDropdownCollapsedClassName);
      }

      if(dojo.hasClass(oScrollContainer,scrollContainerCollapsedClassName)){
        dojo.removeClass(oScrollContainer,scrollContainerCollapsedClassName);
        dojo.addClass(oScrollContainer,scrollContainerExpandedClassName);
      } else
        if(dojo.hasClass(oScrollContainer,scrollContainerExpandedClassName)){
          dojo.removeClass(oScrollContainer,scrollContainerExpandedClassName);
          dojo.addClass(oScrollContainer,scrollContainerCollapsedClassName);
        }
      };

    dojo.connect(this.oSelected, "onclick", toggleDropdownClass);
    dojo.connect(oScrollValuesContainer, "onclick", toggleDropdownClass);


		//Close the dropdown when a click happens outside the scroll_container
    dojo.connect(document, "onclick", function(event) {
      var isMousePointerinModalContainer = dj.util.Element.contains(oScrollContainer, event.clientX, event.clientY);
      if (isMousePointerinModalContainer === false) {
        if (dojo.hasClass(oSelectDropdownContainer,selectDropdownExpandedClassName)){
          dojo.removeClass(oSelectDropdownContainer,selectDropdownExpandedClassName);
          dojo.addClass(oSelectDropdownContainer,selectDropdownCollapsedClassName);
        }

        if(dojo.hasClass(oScrollContainer,scrollContainerExpandedClassName)){
          dojo.removeClass(oScrollContainer,scrollContainerExpandedClassName);
          dojo.addClass(oScrollContainer,scrollContainerCollapsedClassName);
        }
      }
    });

		//If scrollbar present
		if (oScrollBar && oScrollBar !== null && oScrollTrack && oScrollTrack !== null) {
		  dojo.require("dj.widget.Slider");

  	  var noOfValues = oScrollValuesContainer.children.length;

  	  //Set the height of the scroll bar and the scrollValuesTopShiftFactor based on the number of values
			var scrollTrackHeight = parseInt(this.cfg.scrollTrackHeight, 10);
			var scrollValuesDisplayHeight = parseInt(this.cfg.scrollValuesDisplayHeight, 10);

			var scrollBarHeight = parseInt((scrollTrackHeight / (noOfValues / 10)), 10);
			dojo.style(oScrollBar, {
				height: scrollBarHeight + "px"
			});

			var scrollValuesTopShiftFactor = (scrollValuesDisplayHeight / scrollTrackHeight) * (noOfValues / 10);

			var moveDropDown = function(value){
				var sliderPx = slider.translateToPx(value);
				var sliderPxValue = sliderPx.replace("px", "");
				dojo.style(oScrollValuesContainer, {
					top: "-" + sliderPxValue * scrollValuesTopShiftFactor + "px"
				});
			};

			//setup the slider for the scrollbar
			var slider = new dj.widget.Slider(oScrollBar, oScrollTrack, {
				onSlide: moveDropDown,
				onChange: moveDropDown,
				axis: 'vertical'
			});

			//Observers for the arrows to control vertical movement of the slider
			var scrollTrackContainerClass = this.cfg.scrollTrackContainerClassName;
			this.oScrollTrackContainer = dojo.query(scrollTrackContainerClass, oSelectDropdownContainer)[0];

			var scrollUpArrowClass = this.cfg.dropdownScrollUpArrow;
			var scrollDownArrowClass = this.cfg.dropdownScrollDownArrow;

			this.oScrollUpArrow =  dojo.query(scrollUpArrowClass, this.oScrollTrackContainer)[0];
			this.oScrollDownArrow = dojo.query(scrollDownArrowClass, this.oScrollTrackContainer )[0];

			var scrollArrowShiftValue = parseInt(this.cfg.scrollBarArrowShiftValue, 10);

			var scrollBarTopPx,
			    scrollBarTop,
			    sliderValue;

			dojo.connect(this.oScrollUpArrow, "onclick", function(event){
			  scrollBarTop = dojo.style(oScrollBar, "top");
				sliderValue = slider.translateToValue(scrollBarTop - scrollArrowShiftValue);
				if (scrollBarTop > 0) {
					slider.setValue(sliderValue);
				}
			});

			dojo.connect(this.oScrollDownArrow, "onclick", function(event){
			  scrollBarTop = dojo.style(oScrollBar, "top");
				sliderValue = slider.translateToValue(scrollBarTop + scrollArrowShiftValue);
				if (scrollBarTop < (scrollTrackHeight - scrollBarHeight)) {
					slider.setValue(sliderValue);
				}
			});
		}
  }
});

dojo.provide("dj.util.account");dojo.require("dj.lang");dj.util.account={getAccountData:function(a,b){b.responseType=!b.responseType?"application/json":b.responseType;var c=b.responseType.indexOf("json")>-1;this._sendXhrRequest(a,b,{requestMethod:"GET",handleAs:c?"json":"text",requestHeaders:{Accept:b.responseType}})},postAccountData:function(a,b,c){c.requestType=!c.requestType?"application/json":c.requestType;this._sendXhrRequest(a,c,{requestMethod:"POST",content:b,requestHeaders:{"X-HTTP-Method-Override":"POST","Content-Type":c.requestType}})},putAccountData:function(a,b,c){this._sendXhrRequest(a,c,{requestMethod:"PUT",content:dojo.toJson(b),requestHeaders:{"X-HTTP-Method-Override":"PUT","Content-Type":"application/json"}})},_sendXhrRequest:function(a,b,c){var d=dj.lang.cloneMixin({callback:function(){}},b);b=dj.lang.cloneMixin({requestHeaders:{Accept:"application/json"},handleAs:"json"},c);return this._getRequestByMethod(b.requestMethod)({url:a,headers:b.requestHeaders,handleAs:b.handleAs,postData:b.content,timeout:dj.context.account.serviceTimeOut,load:function(e,f){d.callback.apply(d.context,[e,f.xhr,d])},error:function(e,f){console.error("HTTP status code: %s, response: %o",f.xhr.status,e);typeof d.errorCallback!=="undefined"?d.errorCallback.apply(d.context,[e.status,f.xhr,d]):d.callback.apply(d.context,[e.status,f.xhr,d])}})},_getRequestByMethod:function(a){return a=="GET"?dojo.xhrGet:dojo.xhrPost}};dojo.provide("dj.widget.loader.LoadPageFragment");dojo.require("dj.widget.fragmentloader.FragmentLoader");dojo.require("dj.util.Region");dojo.require("dj.util.User");dojo.require("dj.util.user.EnvironmentDao");dojo.require("dj.util.Url");dojo.declare("dj.widget.loader.LoadPageFragment",null,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a);this.getGreyBckgroundCSSDiv="getGreyBckgroundCSSDiv";this.scrimManagerFile=dj.context.account.scrimManagerFilePath},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:5.9},init:function(){dojo.query(this._cfg.initNodeClass).connect("click",this,function(){this.initLoader(this._cfg.domNodeId,this._cfg.mstPageId,this.scrimCallback,this)})},initScrim:function(){this.initLoader(this._cfg.domNodeId,this._cfg.mstPageId,this.scrimCallback,this)},getScrimContents:function(a,b,c,d,e){var f=(new dj.util.user.EnvironmentDao(dj.util.Region,dj.util.User)).getEnvironment();if(typeof e!="undefined")this._cfg.akamaiCdnPrefix=e;a=new dj.widget.fragmentloader.FragmentLoader(f,b,this._cfg.version,a,this._cfg);a.load();dojo.connect(a,"onJsLoad",this,function(){typeof c!="undefined"&&typeof c==="function"&&c.call(d)})},initLoader:function(a,b,c,d,e){var f=dojo.byId(a);if(f!=null&&dj.lang.trim(f.innerHTML)!="")if(dojo.hasClass(f,"initialLoad")){dojo.removeClass(f,"initialLoad");d.scrimCallback(true)}else d.showScrim(a);else{if(dojo.byId(this.getGreyBckgroundCSSDiv)==null){dojo.create("div",{id:this.getGreyBckgroundCSSDiv,"class":"login_overlay"},dojo.body(),"last");this.addclassForArticles()}dojo.destroy("overlayDiv");dojo.create("div",{id:a},this.getGreyBckgroundCSSDiv,"last");this.getScrimContents(a,b,c,d,e)}},initIframeLoader:function(a,b){this._cfg.domNodeId="overlayDiv";if(dojo.byId(this._cfg.domNodeId)==null||dj.lang.trim(dojo.byId(this._cfg.domNodeId).innerHTML)==""){if(dojo.byId(this.getGreyBckgroundCSSDiv)==null){dojo.create("div",{id:this.getGreyBckgroundCSSDiv,"class":"login_overlay"},dojo.body(),"last");this.addclassForArticles()}if(dojo.byId("loginScrimLoader")==null){dojo.create("div",{id:"loginScrimLoader","class":"login_scrim_loader"},this.getGreyBckgroundCSSDiv,"last");dojo.byId("loginScrimLoader").innerHTML="<h4>"+dj.context.account.loading+"</h4>"}dojo.create("div",{id:this._cfg.domNodeId,"class":"login_scrim_wrapper hidden"},this.getGreyBckgroundCSSDiv,"last");dojo.create("div",{id:"login_inner","class":"login_scrim_inner"},this._cfg.domNodeId,"last");dojo.create("div",{id:"module","class":"login_scrim_module"},"login_inner","last");dojo.create("div",{id:"iframe_headerStrap","class":"headerStrap"},"module","last");dojo.byId("iframe_headerStrap").innerHTML='<a href="#" class="closeBtn iframeOverlayCloseBtn">'+dj.context.account.closeText+"</a>";this.addListnerForCloseButton()}else{dojo.addClass(this._cfg.domNodeId,"hidden");if(typeof this.userdata!="undefined"&&(typeof this.userdata.screenName!="undefined"||typeof this.userdata.confScreenName!="undefined"))if(this.userdata.screenName=="LoginVerifyEmail"||this.userdata.confScreenName=="LoginVerifyEmail"||this.userdata.screenName=="UnverifiedFreeReg"||this.userdata.confScreenName=="UnverifiedFreeReg")this.addListnerForCloseButton()}if(dojo.byId("moduleiframe")==null||dj.lang.trim(dojo.byId("moduleiframe")).innerHTML==""){this.disableIPadScroll();this.initIFrame("module",a,b)}else{this.fadeScrim("moduleiframe",300);dojo.removeClass(dojo.byId("module"),"hidden")}},addListnerForCloseButton:function(){dojo.query(".iframeOverlayCloseBtn").connect("click",this,function(a){dojo.stopEvent(a);this.enableIPadScroll();dojo.destroy(dojo.byId("moduleiframe"));dojo.destroy(dojo.byId(this.getGreyBckgroundCSSDiv));this.destroyAccountInstanceArr();if(typeof this.userdata!="undefined"&&(typeof this.userdata.screenName!="undefined"||typeof this.userdata.confScreenName!="undefined"))if(this.userdata.screenName=="LoginVerifyEmail"||this.userdata.confScreenName=="LoginVerifyEmail"){a=decodeURIComponent(this.userdata.refreshPageUrlForUnverifiedSub);parent.location=decodeURIComponent(a)}else if(this.userdata.screenName=="UnverifiedFreeReg"||this.userdata.confScreenName=="UnverifiedFreeReg")this.initIFrameForLogout()})},enableIPadScroll:function(){document.ontouchmove=function(){return true}},disableIPadScroll:function(){document.ontouchmove=function(){return false}},initIFrameForLogout:function(){dojo.byId("unverifiedFreeReglogout")==null&&dojo.create("div",{id:"unverifiedFreeReglogout","class":"hidden"},dojo.body(),"last");var a="http://"+document.domain+"/logout";window.console&&console.log("url for logout "+a);a={src:a,"class":"hidden"};setTimeout(this.isUserLoggedout,1E4);dj.util.Url.createSimpleIframe(a,"unverifiedFreeReglogout",this.testLogoutIframeLoaded,this)},testLogoutIframeLoaded:function(){this.userLoggedOut=true;dojo.destroy("unverifiedFreeReglogout")},isUserLoggedout:function(){this.userLoggedOut||window.console&&console.warn(" unverified free reg user couldn't be logged out ")},initIFrame:function(a,b,c){url=dj.context.account.idDomainToHostScrims+this._cfg.mstPageId+".html?successFileUrl="+encodeURIComponent("http://"+document.domain+this.scrimManagerFile)+"&currentPageUrl="+encodeURIComponent(this.getPageUrl())+"&region="+encodeURIComponent(dj.util.Region.getViewByRegion());if(typeof this.userdata!="undefined"){if(typeof this.userdata.refreshPageUrlForUnverifiedSub!="undefined")this.userdata.refreshPageUrlForUnverifiedSub=encodeURIComponent(this.userdata.refreshPageUrlForUnverifiedSub);url+="&userdata="+dojo.toJson(this.userdata)}dj.util.Url.createSimpleIframe({src:url,"class":"login_scrim_framed",style:{height:b,width:c},allowTransparency:"true"},a,this.iframeLoaded,this)},initScrimFromIframe:function(){this.initIframeLoader(this._cfg.height,this._cfg.width)},iframeLoaded:function(){if(dojo.hasClass(this._cfg.domNodeId,"hidden")){this.fadeScrim(this._cfg.domNodeId,300);dojo.byId(this._cfg.domNodeId)!=null&&dojo.removeClass(dojo.byId(this._cfg.domNodeId),"hidden")}},getDomain:function(){var a="";return a=typeof gcDomain!=="undefined"&&gcDomain!==null&&gcDomain!==""?"http://"+gcDomain:"http://"+document.domain},getPageUrl:function(){var a=this._cfg.NONSUBSCRIBER_HOMEPAGE_PID,b=this._cfg.NONSUBSCRIBER_SEARCH_PAGE_PID,c=this._cfg.NONSUBSCRIBER_NEWSLETTERS_ALERTS_PAGE_PID,d=this._cfg.MDC_PAGE_PID,e;e=this.getDomain();var f;var g=f=dojo.isIE?window.location.href:document.location.href;if(typeof pID!=="undefined"){g=pID===a?e+this._cfg.HOMEPAGE_SUBSCRIBER_URL:pID===c?e+"/email":pID===b?e+this._cfg.SEARCH_PAGE_SUBSCRIBER_URL:pID===d?e+this._cfg.MDC_LINK_URL:f;a=g.indexOf("?")!=-1?"&":"?";if(typeof a!==undefined){a=a+"_nocache="+(new Date).getTime();if(g.indexOf("#")!=-1)g=g.replace("#",a);else g+=a}}return g},initHiddenScrim:function(a,b,c,d){if(typeof b=="undefined")b=this._cfg.mstPageId;if(typeof a=="undefined")a=this._cfg.domNodeId;if(dojo.byId(a)==null||dj.lang.trim(dojo.byId(a).innerHTML)==""){if(dojo.byId(a)==null){if(dojo.byId(this.getGreyBckgroundCSSDiv)==null){dojo.create("div",{id:this.getGreyBckgroundCSSDiv,"class":"login_overlay"},dojo.body(),"last");this.addclassForArticles()}dojo.create("div",{id:a,"class":"hidden initialLoad"},this.getGreyBckgroundCSSDiv,"last")}else dojo.addClass(dojo.byId(a),"hidden");this.getScrimContents(a,b,c,d)}},fadeScrim:function(a,b){var c=1E3;if(b)c=b;dojo.style(a,"opacity","0");dojo.fadeIn({node:a,duration:c}).play()},addclassForArticles:function(){this.getPageUrl().indexOf("/article/")>0&&dojo.addClass(dojo.byId(this.getGreyBckgroundCSSDiv),"article_LIFP")},setUserdata:function(a){this.userdata=a},addToAccountInstanceArr:function(a){if(typeof dj.module.loader.accountInstanceArr=="undefined")dj.module.loader.accountInstanceArr=[];dj.module.loader.accountInstanceArr.push(a)},addToAccountWidgetInstanceArr:function(){},destroyAccountInstanceArr:function(){if(typeof dj.module.loader!="undefined"&&typeof dj.module.loader.accountInstanceArr!="undefined"){for(;dj.module.loader.accountInstanceArr.length!=0;){var a=dj.module.loader.accountInstanceArr.pop();typeof a!="undefined"&&typeof a.destroyObject!="undefined"&&typeof a.destroyObject=="function"&&a.destroyObject()}if(dj.module.loader.accountInstanceArr.length==0){dj.module.loader.accountInstanceArr={};dj.module.loader={}}}}});dojo.provide("dj.widget.loader.FBInitLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.FBInitLoader",[],{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a);this.loadpageFragObj=new dj.widget.loader.LoadPageFragment({version:this._cfg.version})},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,initNodeClass:".connectwithfb",mstPageId:dj.context.account.fbInitPageId,domNodeId:"fbInitDivId"},init:function(){dojo.query(this._cfg.initNodeClass).connect("click",this,function(){this.initScrim()})},initScrim:function(){this.isShow=true;if(typeof this.loadStatus!="undefined")this.loadStatus=="loaded"&&this.showScrim();else this.loadpageFragObj.initLoader(this._cfg.domNodeId,this._cfg.mstPageId,this.scrimCallback,this)},initHiddenScrim:function(){if(typeof this.isShow=="undefined"&&typeof this.loadStatus=="undefined"){this.isShow=false;this.loadStatus="loading";this.loadpageFragObj.initHiddenScrim(this._cfg.domNodeId,this._cfg.mstPageId,this.scrimCallback,this)}else this.isShow=false},initScrimFromIframe:function(){this.isShow=true;if(typeof this.loadStatus!="undefined")this.loadStatus=="loaded"&&this.showScrim();else this.loadpageFragObj.initLoader(this._cfg.domNodeId,this._cfg.mstPageId,this.scrimCallback,this,this._cfg.akamaiCdnPrefix)},scrimCallback:function(a){this.loadStatus="loaded";if(typeof this.fbInitdWidget!="undefined"&&this.fbInitdWidget!=null)this.fbInitdWidget.init(this._cfg.domNodeId,a,this.isShow);else{this.fbInitdWidget=new dj.widget.accountscrim.FBInit(this._cfg);this.fbInitdWidget.init(this._cfg.domNodeId,a,this.isShow);this.loadpageFragObj.addToAccountWidgetInstanceArr(this.fbInitdWidget)}},showScrim:function(){if(typeof this.fbInitdWidget!="undefined"&&this.fbInitdWidget!=null)this.fbInitdWidget.showScrim(this._cfg.domNodeId,true);else{this.fbInitdWidget=new dj.widget.accountscrim.FBInit(this._cfg);this.fbInitdWidget.showScrim(this._cfg.domNodeId,true);this.loadpageFragObj.addToAccountWidgetInstanceArr(this.fbInitdWidget)}},destroyObject:function(){delete this.fbInitdWidget}});dojo.provide("dj.widget.loader.FbLoginOrWSJPswdConfirmationLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.FbLoginOrWSJPswdConfirmationLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a,b){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,b);this._cfg.domNodeId=this.getDomNodeId(a);this._cfg.mstPageId=this.getMstPageId(a);this.userdata=a},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,height:"370px",width:"678px"},scrimCallback:function(a){if(typeof this.fbLoginOrWSJPswdConfWidget!="undefined"&&this.fbLoginOrWSJPswdConfWidget!=null)this.fbLoginOrWSJPswdConfWidget.init(this._cfg.domNodeId,this.userdata,a);else{this.fbLoginOrWSJPswdConfWidget=new dj.widget.accountscrim.Confirmation(this._cfg);this.fbLoginOrWSJPswdConfWidget.init(this._cfg.domNodeId,this.userdata,a);this.addToAccountWidgetInstanceArr(this.fbLoginOrWSJPswdConfWidget)}},showScrim:function(){if(typeof this.fbLoginOrWSJPswdConfWidget!="undefined"&&this.fbLoginOrWSJPswdConfWidget!=null)this.fbLoginOrWSJPswdConfWidget.showScrim(this._cfg.domNodeId,this.userdata,true);else{this.fbLoginOrWSJPswdConfWidget=new dj.widget.accountscrim.Confirmation(this._cfg);this.fbLoginOrWSJPswdConfWidget.showScrim(this._cfg.domNodeId,this.userdata,true);this.addToAccountWidgetInstanceArr(this.fbLoginOrWSJPswdConfWidget)}},getDomNodeId:function(a){return a.screenName+"ConfirmationDivId"},getMstPageId:function(){return dj.context.account.fbLoginOrWSJPswdConfPageId},destroyObject:function(){delete this.fbLoginOrWSJPswdConfWidget}});dojo.provide("dj.widget.loader.FbLoginOrWSJPswdLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.FbLoginOrWSJPswdLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a,b){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,b);this.userdata=a},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,domNodeId:"fbLoginOrWSJPswdDivId",mstPageId:dj.context.account.fbLoginOrWSJPswdPageId,height:"370px",width:"678px"},initScrimFromIframe:function(){this.initIframeLoader(this._cfg.height,this._cfg.width)},destroyObject:function(){delete this.fbLoginOrWSJPswdWidget}});dojo.provide("dj.widget.loader.ForgotPasswordConfirmationLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.ForgotPasswordConfirmationLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a,b){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,b);this._cfg.domNodeId=this.getDomNodeId(a);this._cfg.mstPageId=this.getMstPageId(a);this.userdata=a},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,height:"340px",width:"678px"},scrimCallback:function(a){if(typeof this.forgotPasswordConfWidget!="undefined"&&this.forgotPasswordConfWidget!=null)this.forgotPasswordConfWidget.init(this._cfg.domNodeId,this.userdata,a);else{this.forgotPasswordConfWidget=new dj.widget.accountscrim.Confirmation(this._cfg);this.forgotPasswordConfWidget.init(this._cfg.domNodeId,this.userdata,a);this.addToAccountWidgetInstanceArr(this.forgotPasswordConfWidget)}},showScrim:function(){if(typeof this.forgotPasswordConfWidget!="undefined"&&this.forgotPasswordConfWidget!=null)this.forgotPasswordConfWidget.showScrim(this._cfg.domNodeId,this.userdata,true);else{this.forgotPasswordConfWidget=new dj.widget.accountscrim.Confirmation(this._cfg);this.forgotPasswordConfWidget.showScrim(this._cfg.domNodeId,this.userdata,true);this.addToAccountWidgetInstanceArr(this.forgotPasswordConfWidget)}},getDomNodeId:function(a){return a.screenName+"ConfirmationDivId"},getMstPageId:function(){return dj.context.account.forgotPasswordConfPageId},destroyObject:function(){delete this.forgotPasswordConfWidget}});dojo.provide("dj.widget.loader.ForgotPasswordLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.ForgotPasswordLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a,b){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,b);this.userdata={}},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.4,initNodeClass:".forgotPasswordClass",mstPageId:dj.context.account.forgotPasswordPageId,domNodeId:"forgotPasswordDivId",height:"370px",width:"678px"},init:function(){dojo.query(this._cfg.initNodeClass).connect("click",this,function(){this.initIframeLoader(this._cfg.height,this._cfg.width)})},destroyObject:function(){delete this.forgotPasswordWidget}});dojo.provide("dj.widget.loader.ForgotUsernameConfirmationLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.ForgotUsernameConfirmationLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a,b){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,b);this._cfg.domNodeId=this.getDomNodeId(a);this._cfg.mstPageId=this.getMstPageId(a);this.userdata=a},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,height:"370px",width:"678px"},scrimCallback:function(a){if(typeof this.forgotUsernameConfWidget!="undefined"&&this.forgotUsernameConfWidget!=null)this.forgotUsernameConfWidget.init(this._cfg.domNodeId,this.userdata,a);else{this.forgotUsernameConfWidget=new dj.widget.accountscrim.Confirmation(this._cfg);this.forgotUsernameConfWidget.init(this._cfg.domNodeId,this.userdata,a);this.addToAccountWidgetInstanceArr(this.forgotUsernameConfWidget)}},showScrim:function(){if(typeof this.forgotUsernameConfWidget!="undefined"&&this.forgotUsernameConfWidget!=null)this.forgotUsernameConfWidget.showScrim(this._cfg.domNodeId,this.userdata,true);else{this.forgotUsernameConfWidget=new dj.widget.accountscrim.Confirmation(this._cfg);this.forgotUsernameConfWidget.showScrim(this._cfg.domNodeId,this.userdata,true);this.addToAccountWidgetInstanceArr(this.forgotUsernameConfWidget)}},getDomNodeId:function(a){return a.screenName+"ConfirmationDivId"},getMstPageId:function(){return dj.context.account.forgotUsernameConfPageId},destroyObject:function(){delete this.forgotUsernameConfWidget}});dojo.provide("dj.widget.loader.ForgotUserOrPswdLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.ForgotUserOrPswdLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a);this.userdata={}},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.4,initNodeClass:".forgotUsernameClass",mstPageId:dj.context.account.forgotUsernamePageId,domNodeId:"forgotUsernameDivId",height:"350px",width:"678px"},init:function(){dojo.query(this._cfg.initNodeClass).connect("click",this,function(){this.initIframeLoader(this._cfg.height,this._cfg.width)})},initScrimFromIframe:function(){this.initIframeLoader(this._cfg.height,this._cfg.width)},destroyObject:function(){delete this.forgotUsernameWidget}});dojo.provide("dj.widget.loader.LoginVerifyEmailConfirmationLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.LoginVerifyEmailConfirmationLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a,b){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,b);this._cfg.domNodeId=this.getDomNodeId(a);this._cfg.mstPageId=this.getMstPageId(a);this.userdata=a},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,height:"280px",width:"678px"},scrimCallback:function(a){if(typeof this.loginVerifyConfWidget!="undefined"&&this.loginVerifyConfWidget!=null)this.loginVerifyConfWidget.init(this._cfg.domNodeId,this.userdata,a);else{this.loginVerifyConfWidget=new dj.widget.accountscrim.Confirmation(this._cfg);this.loginVerifyConfWidget.init(this._cfg.domNodeId,this.userdata,a);this.addToAccountWidgetInstanceArr(this.loginVerifyConfWidget)}},showScrim:function(){if(typeof this.loginVerifyConfWidget!="undefined"&&this.loginVerifyConfWidget!=null)this.loginVerifyConfWidget.showScrim(this._cfg.domNodeId,this.userdata,true);else{this.loginVerifyConfWidget=new dj.widget.accountscrim.Confirmation(this._cfg);this.loginVerifyConfWidget.showScrim(this._cfg.domNodeId,this.userdata,true);this.addToAccountWidgetInstanceArr(this.loginVerifyConfWidget)}},getDomNodeId:function(a){return a.screenName+"ConfirmationDivId"},getMstPageId:function(){return dj.context.account.loginVerifyEmailConfPageId},destroyObject:function(){delete this.loginVerifyConfWidget}});dojo.provide("dj.widget.loader.LoginVerifyEmailLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.LoginVerifyEmailLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a);this.userdata={}},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,domNodeId:"loginVerifyEmailDivId",mstPageId:dj.context.account.loginVerifyEmailPageId,height:"400px",width:"678px"},initScrimFromIframe:function(){this.initIframeLoader(this._cfg.height,this._cfg.width)},scrimCallback:function(a){if(typeof this.loginVerifyWidget!="undefined"&&this.loginVerifyWidget!=null)this.loginVerifyWidget.init(this._cfg.domNodeId,this.userdata,a);else{this.loginVerifyWidget=new dj.widget.accountscrim.LoginVerifyEmail(this._cfg);this.loginVerifyWidget.init(this._cfg.domNodeId,this.userdata,a);this.addToAccountWidgetInstanceArr(this.loginVerifyWidget)}},showScrim:function(){if(typeof this.loginVerifyWidget!="undefined"&&this.loginVerifyWidget!=null)this.loginVerifyWidget.showScrim(this._cfg.domNodeId,this.userdata,true);else{this.loginVerifyWidget=new dj.widget.accountscrim.LoginVerifyEmail(this._cfg);this.loginVerifyWidget.showScrim(this._cfg.domNodeId,this.userdata,true);this.addToAccountWidgetInstanceArr(this.loginVerifyWidget)}},destroyObject:function(){delete this.loginVerifyWidget}});dojo.provide("dj.widget.loader.ThankYouLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.ThankYouLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a,b){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,b);this.userdata=a},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,domNodeId:"thankYouDivId",mstPageId:dj.context.account.thankYouPageId,height:"280px",width:"678px"},initScrimFromIframe:function(){this.initIframeLoader(this._cfg.height,this._cfg.width)},scrimCallback:function(a){if(typeof this.thankYouWidget!="undefined"&&this.thankYouWidget!=null)this.thankYouWidget.init(this._cfg.domNodeId,this.userdata,a);else{this.thankYouWidget=new dj.widget.accountscrim.ThankYou(this._cfg);this.thankYouWidget.init(this._cfg.domNodeId,this.userdata,a);this.addToAccountWidgetInstanceArr(this.thankYouWidget)}},showScrim:function(){if(typeof this.thankYouWidget!="undefined"&&this.thankYouWidget!=null)this.thankYouWidget.showScrim(this._cfg.domNodeId,this.userdata,true);else{this.thankYouWidget=new dj.widget.accountscrim.ThankYou(this._cfg);this.thankYouWidget.showScrim(this._cfg.domNodeId,this.userdata,true);this.addToAccountWidgetInstanceArr(this.thankYouWidget)}},destroyObject:function(){delete this.thankYouWidget}});dojo.provide("dj.widget.loader.UnverifiedFreeRegConfirmationLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.UnverifiedFreeRegConfirmationLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a,b){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,b);this._cfg.domNodeId=this.getDomNodeId(a);this._cfg.mstPageId=this.getMstPageId(a);this.userdata=a},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,height:"280px",width:"678px"},scrimCallback:function(a){if(typeof this.unverifiedFreeRegConfWidget!="undefined"&&this.unverifiedFreeRegConfWidget!=null)this.unverifiedFreeRegConfWidget.init(this._cfg.domNodeId,this.userdata,a);else{this.unverifiedFreeRegConfWidget=new dj.widget.accountscrim.Confirmation(this._cfg);this.unverifiedFreeRegConfWidget.init(this._cfg.domNodeId,this.userdata,a);this.addToAccountWidgetInstanceArr(this.unverifiedFreeRegConfWidget)}},showScrim:function(){if(typeof this.unverifiedFreeRegConfWidget!="undefined"&&this.unverifiedFreeRegConfWidget!=null)this.unverifiedFreeRegConfWidget.showScrim(this._cfg.domNodeId,this.userdata,true);else{this.unverifiedFreeRegConfWidget=new dj.widget.accountscrim.Confirmation(this._cfg);this.unverifiedFreeRegConfWidget.showScrim(this._cfg.domNodeId,this.userdata,true);this.addToAccountWidgetInstanceArr(this.unverifiedFreeRegConfWidget)}},getDomNodeId:function(a){return a.screenName+"ConfirmationDivId"},getMstPageId:function(){return dj.context.account.unverifiedFreeRegConfPageId},destroyObject:function(){delete this.unverifiedFreeRegConfWidget}});dojo.provide("dj.widget.loader.UnverifiedFreeRegLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.UnverifiedFreeRegLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a);this.userdata={}},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,domNodeId:"unverifiedFreeRegDivId",mstPageId:dj.context.account.unverifiedFreeRegPageId,height:"400px",width:"678px"},initScrimFromIframe:function(){this.initIframeLoader(this._cfg.height,this._cfg.width)},scrimCallback:function(a){if(typeof this.unverifiedFreeRegWidget!="undefined"&&this.unverifiedFreeRegWidget!=null)this.unverifiedFreeRegWidget.init(this._cfg.domNodeId,this.userdata,a);else{this.unverifiedFreeRegWidget=new dj.widget.accountscrim.LoginVerifyEmail(this._cfg);this.unverifiedFreeRegWidget.init(this._cfg.domNodeId,this.userdata,a);this.addToAccountWidgetInstanceArr(this.unverifiedFreeRegWidget)}},showScrim:function(){if(typeof this.unverifiedFreeRegWidget!="undefined"&&this.unverifiedFreeRegWidget!=null)this.unverifiedFreeRegWidget.showScrim(this._cfg.domNodeId,this.userdata,true);else{this.unverifiedFreeRegWidget=new dj.widget.accountscrim.LoginVerifyEmail(this._cfg);this.unverifiedFreeRegWidget.showScrim(this._cfg.domNodeId,this.userdata,true);this.addToAccountWidgetInstanceArr(this.unverifiedFreeRegWidget)}},destroyObject:function(){delete this.unverifiedFreeRegWidget}});dojo.provide("dj.widget.loader.UserWithourEmailConfirmationLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.declare("dj.widget.loader.UserWithourEmailConfirmationLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a,b){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,b);this.userdata=a},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,domNodeId:"userWithoutEmailConfDivId",mstPageId:dj.context.account.userWithoutEmailConfPageId,height:"350px",width:"678px"},scrimCallback:function(a){(new dj.widget.accountscrim.UserWithoutEmailConfirmation(this._cfg)).init(this._cfg.domNodeId,this.userdata,a)},showScrim:function(){(new dj.widget.accountscrim.UserWithoutEmailConfirmation(this._cfg)).showScrim(this._cfg.domNodeId,this.userdata,true)}});dojo.provide("dj.service.account.LoginService");dojo.require("dj.util.account");dojo.require("dj.util.Observer");dj.service.account.LoginService={loginUser:function(a,b,c,d,e){dj.util.account.postAccountData(a,b,{callback:this.handleSuccessResp,errorCallback:this.handleErrorResp,context:this,url:a,responseType:"application/json",clientInfo:{loadCallback:c,errorCallback:d,context:e}})},handleErrorResp:function(a,b,c){a="";var d=[];if(b.status=="404"||b.status=="500")d[0]="generalError";else if(b.status=="503"||b.status=="403")d[0]="unavailableError";else{a=dojo.fromJson(b.responseText);if(typeof a["user-status"]!="undefined")d[0]=a["user-status"];else dojo.forEach(a.errors,function(e,f){d[f]=e.name+e.status})}c.clientInfo.errorCallback.apply(c.clientInfo.context,[d])},handleSuccessResp:function(a,b,c){b.status=="200"&&c.clientInfo.loadCallback.call(c.clientInfo.context,a)},testLogin:function(a,b,c,d,e){dj.util.account.postAccountData(a,b,{callback:this.handleLoginSuccess,errorCallback:this.handleLoginError,context:this,url:a,responseType:"application/json",clientInfo:{loadCallback:c,errorCallback:d,context:e}})},handleLoginSuccess:function(a,b,c){c.clientInfo.loadCallback.call(c.clientInfo.context,a)},handleLoginError:function(a,b,c){c.clientInfo.errorCallback.call(c.clientInfo.context,a)}};dojo.provide("dj.service.account.RegistrationService");dojo.require("dj.util.account");dojo.require("dj.util.Observer");dj.service.account.RegistrationService={registerUser:function(a,b,c,d,e){dj.util.account.postAccountData(a,b,{callback:this.handleSuccessResp,errorCallback:this.handleErrorResp,context:this,url:a,responseType:"application/json",requestType:"application/x-www-form-urlencoded;charset="+document.characterSet,clientInfo:{loadCallback:c,errorCallback:d,context:e}})},handleErrorResp:function(a,b,c){a=[];if(b.status=="404"||b.status=="500")a[0]="generalError";else if(b.status==412){b=dojo.fromJson(b.responseText);if(b.status=="precondition_failed"){b=b.profile.errors;a[0]=b.emailAddress;if(typeof b.emailAddress=="undefined")a[0]="generalError"}}else if(b.status=="503"||b.status=="403")a[0]="unavailableError";c.clientInfo.errorCallback.apply(c.clientInfo.context,[a])},handleSuccessResp:function(a,b,c){b.status=="200"&&c.clientInfo.loadCallback.call(c.clientInfo.context,a.profile.emailAddress)},changeUsername:function(a,b,c,d,e){dj.util.account.postAccountData(a,b,{callback:this.handleChangeUsernameSuccessResp,errorCallback:this.handleChangeUsernameErrorResp,context:this,url:a,responseType:"application/json",requestType:"application/x-www-form-urlencoded;charset="+document.characterSet,clientInfo:{loadCallback:c,errorCallback:d,context:e}})},handleChangeUsernameErrorResp:function(a,b,c){a=[];if(b.status=="404"||b.status=="500")a[0]="generalError";else if(b.status==412){b=dojo.fromJson(b.responseText);if(b.status=="precondition_failed"){b=b.profile.errors;a[0]=b.username;if(typeof b.username=="undefined")a[0]="generalError"}}else if(b.status=="503"||b.status=="403")a[0]="unavailableError";c.clientInfo.errorCallback.apply(c.clientInfo.context,[a])},handleChangeUsernameSuccessResp:function(a,b,c){b.status=="200"&&c.clientInfo.loadCallback.call(c.clientInfo.context,a.profile.uuid)},getNodeValue:function(a,b){return a.getElementsByTagName(b)[0].firstChild.nodeValue},getNode:function(a,b){return a.getElementsByTagName(b)[0]},getAttribute:function(a,b){return a.getAttribute(b)}};dojo.provide("dj.widget.loader.FBConnectedLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.require("dj.util.Ads");dojo.declare("dj.widget.loader.FBConnectedLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a)},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,initNodeClass:".connectwithfb",mstPageId:dj.context.account.fbConnectedPageId,domNodeId:"fbConnectedDivId"},initScrimFromIframe:function(){this.initLoader(this._cfg.domNodeId,this._cfg.mstPageId,this.scrimCallback,this)},scrimCallback:function(a){if(typeof this.fbConnectedWidget!="undefined"&&this.fbConnectedWidget!=null)this.fbConnectedWidget.init(this._cfg.domNodeId,a);else{this.fbConnectedWidget=new dj.widget.accountscrim.FBConnected(this._cfg);this.fbConnectedWidget.init(this._cfg.domNodeId,a);this.addToAccountWidgetInstanceArr(this.fbConnectedWidget)}(new dj.util.Ads).loadAds("facebook2")},showScrim:function(){if(typeof this.fbConnectedWidget!="undefined"&&this.fbConnectedWidget!=null)this.fbConnectedWidget.showScrim(this._cfg.domNodeId,true);else{this.fbConnectedWidget=new dj.widget.accountscrim.FBConnected(this._cfg);this.fbConnectedWidget.showScrim(this._cfg.domNodeId,true);this.addToAccountWidgetInstanceArr(this.fbConnectedWidget)}(new dj.util.Ads).loadAds("facebook2")},destroyObject:function(){delete this.fbConnectedWidget}});dojo.provide("dj.widget.loader.LoginLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.require("dj.util.Region");dojo.declare("dj.widget.loader.LoginLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a)},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,initNodeClass:".loginClass",mstPageId:dj.context.account.loginOverlayPageId,domNodeId:"loginDivId",scrimManagerFile:"/static_html_files/account/accountScrimManager.html",height:dj.context.account.loginOverlayHeight,width:dj.context.account.loginOverlayWidth,isMobile:false},init:function(){window.console&&console.log("this._cfg.initNodeClass "+this._cfg.initNodeClass);dojo.query(this._cfg.initNodeClass).connect("click",this,function(a){dojo.stopEvent(a);this.redirectIfMobileUser()})},initLoginScrimInIframe:function(){this.initIframeLoader(this._cfg.height,this._cfg.width)},isGermanyProduct:function(){if(dj.util.Region.getViewByRegion()==="germany")return true;return false},redirectIfMobileUser:function(){var a=this;navigator.userAgent.search(/Mobile/i)>-1&&!a.isGermanyProduct()?dojo.xhrGet({url:"/static_html_files/mobile/mobileDevices.json",headers:{Accept:"application/json"},handleAs:"json",load:function(b){if(b.hasOwnProperty("deviceList"))for(var c in b.deviceList){device=b.deviceList[c];if(RegExp(device.OS,"i").test(navigator.userAgent)){a._cfg.isMobile=true;break}}},error:function(b,c){console.error("HTTP status code: ",c.xhr.status)}}).then(function(){if(a._cfg.isMobile)window.location=dj.context.core.secureLoginPrefix+"/content/public/page/login-mobile.html";else a.initIframeLoader(a._cfg.height,a._cfg.width)},function(b){console.log("errror"+
b)}):this.initIframeLoader(this._cfg.height,this._cfg.width)}});dojo.provide("dj.widget.loader.LoaderInstanceFactory");dj.widget.loader.LoaderInstanceFactory={intializeLoader:function(){if(dj.module.loader==null||typeof dj.module.loader=="undefined")dj.module.loader={}},getLoginLoaderInstance:function(a){this.intializeLoader();if(typeof dj.module.loader.loginLoaderObj=="undefined"||dj.module.loader.loginLoaderObj==null){var b={};if(typeof a!="undefined")b={isLoadJs:a.isLoadJs,version:a.version};dj.module.loader.loginLoaderObj=new dj.widget.loader.LoginLoader(b);dj.module.loader.loginLoaderObj.addToAccountInstanceArr(dj.module.loader.loginLoaderObj)}return dj.module.loader.loginLoaderObj},getRegistrationLoaderInstance:function(){this.intializeLoader();if(typeof dj.module.loader.registrationLoaderObj=="undefined"||dj.module.loader.registrationLoaderObj==null){dj.module.loader.registrationLoaderObj=new dj.widget.loader.RegistrationLoader;dj.module.loader.registrationLoaderObj.addToAccountInstanceArr(dj.module.loader.registrationLoaderObj)}return dj.module.loader.registrationLoaderObj},getForgotUserOrPswdLoaderInstance:function(a){this.intializeLoader();if(typeof dj.module.loader.forgotUserOrPswdLoaderObj=="undefined"||dj.module.loader.forgotUserOrPswdLoaderObj==null){dj.module.loader.forgotUserOrPswdLoaderObj=new dj.widget.loader.ForgotUserOrPswdLoader;dj.module.loader.forgotUserOrPswdLoaderObj.addToAccountInstanceArr(dj.module.loader.forgotUserOrPswdLoaderObj)}dj.module.loader.forgotUserOrPswdLoaderObj.setUserdata(a);return dj.module.loader.forgotUserOrPswdLoaderObj},getForgotPasswordLoaderInstance:function(a){this.intializeLoader();if(typeof dj.module.loader.forgotPasswordLoaderObj=="undefined"||dj.module.loader.forgotPasswordLoaderObj==null){dj.module.loader.forgotPasswordLoaderObj=new dj.widget.loader.ForgotPasswordLoader;dj.module.loader.forgotPasswordLoaderObj.addToAccountInstanceArr(dj.module.loader.forgotPasswordLoaderObj)}dj.module.loader.forgotPasswordLoaderObj.setUserdata(a);return dj.module.loader.forgotPasswordLoaderObj},getFBInitLoaderInstance:function(a){this.intializeLoader();if(typeof dj.module.loader.fbInitLoaderObj=="undefined"||dj.module.loader.fbInitLoaderObj==null){dj.module.loader.fbInitLoaderObj=new dj.widget.loader.FBInitLoader(a);dj.module.loader.fbInitLoaderObj.loadpageFragObj.addToAccountInstanceArr(dj.module.loader.fbInitLoaderObj)}return dj.module.loader.fbInitLoaderObj},getLoginVerifyEmailLoaderInstance:function(a){this.intializeLoader();if(typeof dj.module.loader.loginVerifyEmailLoaderObj=="undefined"||dj.module.loader.loginVerifyEmailLoaderObj==null){dj.module.loader.loginVerifyEmailLoaderObj=new dj.widget.loader.LoginVerifyEmailLoader;dj.module.loader.loginVerifyEmailLoaderObj.addToAccountInstanceArr(dj.module.loader.loginVerifyEmailLoaderObj)}dj.module.loader.loginVerifyEmailLoaderObj.setUserdata(a);return dj.module.loader.loginVerifyEmailLoaderObj},getUnverifiedFreeRegLoaderInstance:function(a){this.intializeLoader();if(typeof dj.module.loader.unverifiedFreeRegLoaderObj=="undefined"||dj.module.loader.unverifiedFreeRegLoaderObj==null){dj.module.loader.unverifiedFreeRegLoaderObj=new dj.widget.loader.UnverifiedFreeRegLoader;dj.module.loader.unverifiedFreeRegLoaderObj.addToAccountInstanceArr(dj.module.loader.unverifiedFreeRegLoaderObj)}dj.module.loader.unverifiedFreeRegLoaderObj.setUserdata(a);return dj.module.loader.unverifiedFreeRegLoaderObj},getFbLoginOrWSJPswdLoaderInstance:function(a){this.intializeLoader();if(typeof dj.module.loader.fbLoginOrWSJPswdLoaderObj=="undefined"||dj.module.loader.fbLoginOrWSJPswdLoaderObj==null){dj.module.loader.fbLoginOrWSJPswdLoaderObj=new dj.widget.loader.FbLoginOrWSJPswdLoader;dj.module.loader.fbLoginOrWSJPswdLoaderObj.addToAccountInstanceArr(dj.module.loader.fbLoginOrWSJPswdLoaderObj)}dj.module.loader.fbLoginOrWSJPswdLoaderObj.setUserdata(a);return dj.module.loader.fbLoginOrWSJPswdLoaderObj},getThankYouLoaderInstance:function(a){this.intializeLoader();if(typeof dj.module.loader.thankYouLoaderObj=="undefined"||dj.module.loader.thankYouLoaderObj==null){dj.module.loader.thankYouLoaderObj=new dj.widget.loader.ThankYouLoader;dj.module.loader.thankYouLoaderObj.addToAccountInstanceArr(dj.module.loader.thankYouLoaderObj)}dj.module.loader.thankYouLoaderObj.setUserdata(a);return dj.module.loader.thankYouLoaderObj},getUserWithourEmailConfirmationLoaderInstance:function(a){this.intializeLoader();if(typeof dj.module.loader.userWithourEmailConfirmationLoaderObj=="undefined"||dj.module.loader.userWithourEmailConfirmationLoaderObj==null){dj.module.loader.userWithourEmailConfirmationLoaderObj=new dj.widget.loader.UserWithourEmailConfirmationLoader;dj.module.loader.userWithourEmailConfirmationLoaderObj.addToAccountInstanceArr(dj.module.loader.userWithourEmailConfirmationLoaderObj)}dj.module.loader.userWithourEmailConfirmationLoaderObj.setUserdata(a);return dj.module.loader.userWithourEmailConfirmationLoaderObj},getFBConnectedLoaderInstance:function(a){this.intializeLoader();if(typeof dj.module.loader.fbConnectedLoaderObj=="undefined"||dj.module.loader.fbConnectedLoaderObj==null){dj.module.loader.fbConnectedLoaderObj=new dj.widget.loader.FBConnectedLoader({isLoadJs:a.isLoadJs,version:a.version});dj.module.loader.fbConnectedLoaderObj.addToAccountInstanceArr(dj.module.loader.fbConnectedLoaderObj)}return dj.module.loader.fbConnectedLoaderObj},getConfirmationLoaderInstance:function(a){this.intializeLoader();if(typeof a!="undefined")if(a.confScreenName==="LoginVerifyEmail"){dojo.require("dj.widget.loader.LoginVerifyEmailConfirmationLoader");if(typeof dj.module.loader.loginVerifyEmailConfirmationLoaderObj=="undefined"||dj.module.loader.loginVerifyEmailConfirmationLoaderObj==null){dj.module.loader.loginVerifyEmailConfirmationLoaderObj=new dj.widget.loader.LoginVerifyEmailConfirmationLoader(a);dj.module.loader.loginVerifyEmailConfirmationLoaderObj.addToAccountInstanceArr(dj.module.loader.loginVerifyEmailConfirmationLoaderObj)}dj.module.loader.loginVerifyEmailConfirmationLoaderObj.setUserdata(a);return dj.module.loader.loginVerifyEmailConfirmationLoaderObj}else if(a.confScreenName==="FbLoginOrWSJPswd"){dojo.require("dj.widget.loader.FbLoginOrWSJPswdConfirmationLoader");if(typeof dj.module.loader.fbLoginOrWSJPswdConfirmationLoaderObj=="undefined"||dj.module.loader.fbLoginOrWSJPswdConfirmationLoaderObj==null){dj.module.loader.fbLoginOrWSJPswdConfirmationLoaderObj=new dj.widget.loader.FbLoginOrWSJPswdConfirmationLoader(a);dj.module.loader.fbLoginOrWSJPswdConfirmationLoaderObj.addToAccountInstanceArr(dj.module.loader.fbLoginOrWSJPswdConfirmationLoaderObj)}dj.module.loader.fbLoginOrWSJPswdConfirmationLoaderObj.setUserdata(a);return dj.module.loader.fbLoginOrWSJPswdConfirmationLoaderObj}else if(a.confScreenName==="ForgotUsername"){dojo.require("dj.widget.loader.ForgotUsernameConfirmationLoader");if(typeof dj.module.loader.forgotUsernameConfirmationLoaderObj=="undefined"||dj.module.loader.forgotUsernameConfirmationLoaderObj==null){dj.module.loader.forgotUsernameConfirmationLoaderObj=new dj.widget.loader.ForgotUsernameConfirmationLoader(a);dj.module.loader.forgotUsernameConfirmationLoaderObj.addToAccountInstanceArr(dj.module.loader.forgotUsernameConfirmationLoaderObj)}dj.module.loader.forgotUsernameConfirmationLoaderObj.setUserdata(a);return dj.module.loader.forgotUsernameConfirmationLoaderObj}else if(a.confScreenName==="ForgotPassword"){dojo.require("dj.widget.loader.ForgotPasswordConfirmationLoader");if(typeof dj.module.loader.forgotPasswordConfirmationLoaderObj=="undefined"||dj.module.loader.forgotPasswordConfirmationLoaderObj==null){dj.module.loader.forgotPasswordConfirmationLoaderObj=new dj.widget.loader.ForgotPasswordConfirmationLoader(a);dj.module.loader.forgotPasswordConfirmationLoaderObj.addToAccountInstanceArr(dj.module.loader.forgotPasswordConfirmationLoaderObj)}dj.module.loader.forgotPasswordConfirmationLoaderObj.setUserdata(a);return dj.module.loader.forgotPasswordConfirmationLoaderObj}else if(a.confScreenName==="UnverifiedFreeReg"){dojo.require("dj.widget.loader.UnverifiedFreeRegConfirmationLoader");if(typeof dj.module.loader.unverifiedFreeRegConfirmationLoaderObj=="undefined"||dj.module.loader.unverifiedFreeRegConfirmationLoaderObj==null){dj.module.loader.unverifiedFreeRegConfirmationLoaderObj=new dj.widget.loader.UnverifiedFreeRegConfirmationLoader(a);dj.module.loader.unverifiedFreeRegConfirmationLoaderObj.addToAccountInstanceArr(dj.module.loader.unverifiedFreeRegConfirmationLoaderObj)}dj.module.loader.unverifiedFreeRegConfirmationLoaderObj.setUserdata(a);return dj.module.loader.unverifiedFreeRegConfirmationLoaderObj}}};dojo.provide("dj.widget.loader.RegistrationLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.require("dj.widget.loader.LoaderInstanceFactory");dojo.declare("dj.widget.loader.RegistrationLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a)},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:13.2,initNodeClass:".registerUserClass",mstPageId:dj.context.account.registrationOverlayPageId,domNodeId:"registrationDivId",scrimManagerFile:"/static_html_files/account/accountScrimManager.html",height:dj.context.account.registrationOverlayHeight,width:dj.context.account.registrationOverlayWidth},init:function(){window.console&&console.log("this._cfg.initNodeClass in reg "+this._cfg.initNodeClass);dojo.query(this._cfg.initNodeClass).connect("click",this,function(){this.initIframeLoader(this._cfg.height,this._cfg.width)})},initRegisterScrimInIframe:function(){this.initIframeLoader(this._cfg.height,this._cfg.width)},loadRegistrationRelatedScrims:function(){dj.widget.loader.LoaderInstanceFactory.getThankYouLoaderInstance(this._cfg).initHiddenScrim()}});dojo.provide("dj.widget.loader.FBLoginLoader");dojo.require("dj.widget.loader.LoadPageFragment");dojo.require("dj.widget.loader.LoaderInstanceFactory");dojo.require("dj.widget.loader.FBConnectedLoader");dojo.declare("dj.widget.loader.FBLoginLoader",dj.widget.loader.LoadPageFragment,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a)},DEFAULT_CONFIG:{isLoadJs:true,isLoadCss:true,isLoadHtml:true,version:4.2,initNodeClass:".connectwithfb",mstPageId:dj.context.account.fbLoginPageId,domNodeId:"fbLoginDivId",scrimManagerFile:"/static_html_files/account/accountScrimManager.html",height:"660px",width:"678px"},init:function(){this.initIframeLoader(this._cfg.height,this._cfg.width)},loadFBRegistrationRelatedScrims:function(){dj.widget.loader.LoaderInstanceFactory.getFBConnectedLoaderInstance(this._cfg).initHiddenScrim()}});dojo.provide("dj.widget.accountscrim.BaseScrim");dojo.require("dj.util.Form");dojo.require("dj.widget.loader.LoaderInstanceFactory");dojo.require("dj.widget.loader.ForgotUserOrPswdLoader");dojo.require("dj.widget.loader.ForgotPasswordLoader");dojo.require("dj.widget.loader.FBInitLoader");dojo.require("dj.widget.loader.RegistrationLoader");dojo.require("dj.util.Url");dojo.declare("dj.widget.accountscrim.BaseScrim",null,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a);this.PRODUCT_CD=dj.context.account.productCd;this.queryStringList={};this.getGreyBckgroundCSSDiv="getGreyBckgroundCSSDiv";this._constants=this.CONSTANTS;this.successFileUrl=this.getQueryStrParam("successFileUrl");this.currentPageUrl=this.getQueryStrParam("currentPageUrl");this.userdata=this.getQueryStrParam("userdata");this.userdata=dojo.fromJson(this.userdata);this.omniturePrefix=dj.context.account&&dj.context.account.omniturePrefix?dj.context.account.omniturePrefix:"WSJ";this.checkIfMobileUser()},DEFAULT_CONFIG:{},CONSTANTS:{FORGOT_USERNAME_SCREEN:"ForgotUsername",FORGOT_PASSWORD_SCREEN:"ForgotPassword",FB_LOGIN_OR_WSJ_PSWD_SCREEN:"FbLoginOrWSJPswd",UNVERIFIED_FREE_REG:"UnverifiedFreeReg",LOGIN_VERIFY_EMAIL_SCREEN:"LoginVerifyEmail",FORGOT_USERNAME_CONF_SCREEN:"ForgotUsernameConfirmation",FORGOT_PASSWORD_CONF_SCREEN:"ForgotPasswordConfirmation",FB_LOGIN_OR_WSJ_PSWD_CONF_SCREEN:"FbLoginOrWSJPswdConfirmation",UNVERIFIED_FREE_CONF_REG:"UnverifiedFreeRegConfirmation",LOGIN_VERIFY_EMAIL_CONF_SCREEN:"LoginVerifyEmailConfirmation",USER_WITHOUT_EMAIL:"UserWithoutEmail",LOGIN_SCREEN:"Login",SCRIMS_OK_CLOSE_BTN_CLASS:".accountScrimOkOrCloseBtnClass"},checkIfMobileUser:function(){if(typeof dj.context.mobile!=="undefined"){dj.context.account.forgotUserOrPswdPageUrl=dj.context.mobile.forgotUserOrPswdPageUrl;dj.context.account.forgotUsernameConfPageUrl=dj.context.mobile.forgotUsernameConfPageUrl;dj.context.account.forgotPasswordPageUrl=dj.context.mobile.forgotPasswordPageUrl;dj.context.account.forgotPasswordConfPageUrl=dj.context.mobile.forgotPasswordConfPageUrl;dj.context.account.resetPasswordPageUrl=dj.context.mobile.resetPasswordPageUrl}},hideErrorMessages:function(){dojo.addClass(dojo.byId(this._nodes.errorUl),this._nodes.hiddenClass)},hideScrim:function(a){if(typeof this._nodes.isStandalonePage=="undefined"||!this._nodes.isStandalonePage)dojo.byId(a)!=null&&dojo.addClass(dojo.byId(a),this._nodes.hiddenClass)},displayScrim:function(a,b){if(typeof this._nodes.isStandalonePage=="undefined"||!this._nodes.isStandalonePage){typeof b!="undefined"&&b&&this.fadeScrim(a);dojo.byId(a)!=null&&dojo.removeClass(dojo.byId(a),this._nodes.hiddenClass)}},showErrorMessage:function(a,b){var c="";if(b.length>0){dojo.forEach(b,function(e){c+=dojo.byId(e).innerHTML},this);var d=dojo.byId(a);d.innerHTML=c;dojo.removeClass(d,this._nodes.hiddenClass);if(typeof this._nodes.isIframe!="undefined"&&this._nodes.isIframe){dojo.removeClass(dojo.byId(this._nodes.iframeErrorOverlayDiv),this._nodes.hiddenClass);dojo.connect(dojo.byId(this._nodes.goBackToIframeFrmErr),"click",this,function(){dojo.addClass(dojo.byId(this._nodes.iframeErrorOverlayDiv),this._nodes.hiddenClass)})}}},addErrorClass:function(a){dojo.addClass(dojo.byId(a),this._nodes.fieldErrorClass)},connectForgotPasswordFromIframe:function(a){dojo.query(this._nodes.gotoForgotPasswordFromIframe).connect("click",this,function(b){dojo.stopEvent(b);if(this._nodes.isStandalonePage)window.location=typeof a=="undefined"?this._nodes.pageUrls.forgotPasswordPageUrl:this._nodes.pageUrls.forgotPasswordPageUrl+"?userEmailId="+a;else if(this.chkIfHttpsDomain())parent.location=dj.context.account.forgotPasswordPageUrl;else this.initForgotPasswordFromIframe(a)})},connectForgotUsernameFromIframe:function(a){dojo.query(this._nodes.gotoForgotUsernameFromIframe).connect("click",this,function(b){dojo.stopEvent(b);if(this._nodes.isStandalonePage)window.location=typeof a=="undefined"?this._nodes.pageUrls.forgotUserOrPswdPageUrl:this._nodes.pageUrls.forgotUserOrPswdPageUrl+"?userEmailId="+a;else this.initForgotUsernameFromIframe(a)})},connectForgotUsername:function(){dojo.query(this._nodes.gotoForgotUsername).connect("click",this,function(a){dojo.stopEvent(a);if(this._nodes.isStandalonePage)window.location=this._nodes.pageUrls.forgotUserOrPswdPageUrl;else this.initForgotUserOrPswd()})},connectForgotPassword:function(){dojo.query(this._nodes.gotoForgotPassword).connect("click",this,function(a){dojo.stopEvent(a);if(this._nodes.isStandalonePage)window.location=this._nodes.pageUrls.forgotPasswordPageUrl;else this.initForgotPassword()})},initForgotUserOrPswd:function(){this.hideScrim(this.domNodeId);dj.widget.loader.LoaderInstanceFactory.getForgotUserOrPswdLoaderInstance(this._cfg).initScrim()},initForgotPassword:function(){this.hideScrim(this.domNodeId);dj.widget.loader.LoaderInstanceFactory.getForgotPasswordLoaderInstance(this._cfg).initScrim()},initConfirmation:function(a){this.hideScrim(this.domNodeId);dj.widget.loader.LoaderInstanceFactory.getConfirmationLoaderInstance(a).initScrim()},initConfirmationFromIframe:function(a){if((a.confScreenName=="LoginVerifyEmail"||a.confScreenName=="ForgotPassword")&&this.chkIfHttpsDomain())this.successFileUrl="/content/javascript/account/accountScrimManager.html";document.location=this.successFileUrl+"?userdata="+dojo.toJson(a)},initLoginScrim:function(){if(this.domNodeId!=null&&dojo.byId(this.domNodeId)!=null){this.hideScrim(this.domNodeId);dj.widget.loader.LoaderInstanceFactory.getLoginLoaderInstance(this._cfg).initLoginScrimInIframe()}},initRegistration:function(){dj.widget.loader.LoaderInstanceFactory.getRegistrationLoaderInstance(this._cfg).initRegisterScrimInIframe()},initForgotUsernameFromIframe:function(a){if(typeof a=="undefined")a="";document.location=this.successFileUrl+"?userdata="+dojo.toJson({screenName:this._constants.FORGOT_USERNAME_SCREEN,userEmail:a})},initLoginFromIframe:function(){document.location=this.successFileUrl+"?userdata="+dojo.toJson({screenName:this._constants.LOGIN_SCREEN})},initForgotPasswordFromIframe:function(a){if(typeof a=="undefined")a="";document.location=this.successFileUrl+"?userdata="+dojo.toJson({screenName:this._constants.FORGOT_PASSWORD_SCREEN,userEmail:a})},initRegistrationFromIframe:function(){document.location=this.successFileUrl+"?userdata="+dojo.toJson({screenName:"Registration"})},moveOutOfIframe:function(a){if(this._nodes.isStandalonePage||this.chkIfHttpsDomain())parent.dj.widget.loader.ScrimLoaders.callBackFromIframe(dojo.toJson(a));else if(typeof a.refreshPageUrl!="undefined")parent.location=decodeURIComponent(a.refreshPageUrl);else document.location=this.successFileUrl+"?userdata="+dojo.toJson(a)},isChkEnter:function(a){if((a.keyCode||a.which)==dojo.keys.ENTER)return true;return false},isChkBackSpace:function(a){if((a.keyCode||a.which)==dojo.keys.BACKSPACE)return true;return false},initConnectWithFbNoIframe:function(){dojo.query(this._nodes.connectFB).connect("click",this,function(){this.hideScrim(this.domNodeId);dj.widget.loader.LoaderInstanceFactory.getFBInitLoaderInstance(this._cfg).initScrim()})},initConnectWithFB:function(){this.moveOutOfIframe({cfg:this._cfg,screenName:"FBInit"})},makeFBConnections:function(a){this.makeFBWhatsThisConnection();dojo.query(this._nodes.connectFB).connect("click",this,function(){this.initConnectWithFB(a)})},makeFBConnectionsNoIframe:function(){this.makeFBWhatsThisConnection();this.initConnectWithFbNoIframe()},makeFBWhatsThisConnection:function(){dojo.query(this._nodes.whatsThisFbClass).connect("click",this,function(a){dojo.stopEvent(a);dojo.removeClass(dojo.query(this._nodes.fbToolTipClass)[0],this._nodes.hiddenClass)});dojo.query(this._nodes.fbToolTipCloseClass).connect("click",this,function(a){dojo.stopEvent(a);dojo.addClass(dojo.query(this._nodes.fbToolTipClass)[0],this._nodes.hiddenClass)})},makeCloseOrOKButtonConnection:function(a){dojo.query(this._constants.SCRIMS_OK_CLOSE_BTN_CLASS).connect("click",this,function(b){this.closeNDestroyGreyBckground(a,b)})},closeNDestroyGreyBckground:function(a,b){dojo.stopEvent(b);typeof a!="undefined"&&dojo.byId(a)!=null&&this.hideScrim(a);this.destroyGreyBckground();this.destroyAccountInstanceArr()},destroyGreyBckground:function(){dojo.destroy(this.getGreyBckgroundCSSDiv)},makeCloseOrOKButtonConnectionFromIframe:function(){dojo.query(this._constants.SCRIMS_OK_CLOSE_BTN_CLASS).connect("click",this,function(){this.closeFromIframe()})},closeFromIframe:function(){this.destroyAccountInstanceArr();this.moveOutOfIframe({close:"close"})},hideErrorNPassIndGreen:function(a){dojo.addClass(this._nodes.errorUl,this._nodes.hiddenClass);this.updatePasswordInd(a,this._nodes.passIndClassGreen)},chkEmpty:function(a){if(typeof a!="undefined")return dj.lang.trim(a)===""?false:true;return false},updatePasswordInd:function(a,b){dojo.byId(a).className=b},isValidEmailAddress:function(a){return dj.util.Form.validateEmailAddresses(a)},chkEmailAddress:function(a){if(this.chkEmpty(a)){if(!this.isValidEmailAddress(a)){this.errorArr.push(this._nodes.invalidemailFormat);return false}}else{this.errorArr.push(this._nodes.emailIdrequired);return false}return true},chkPasswordLength:function(a,b){if(typeof a!="undefined"){var c=a.value;if(typeof c!="undefined")if(dj.lang.trim(c).length<5)dojo.indexOf(this.errorArr,this._nodes.passwordTooShort)<0&&this.errorArr.push(this._nodes.passwordTooShort);else if(dj.lang.trim(c).length>15)dojo.indexOf(this.errorArr,this._nodes.passwordTooLong)<0&&this.errorArr.push(this._nodes.passwordTooLong);else{this.updatePasswordInd(b,this._nodes.passIndClassGreen);return true}}this.updatePasswordInd(b,this._nodes.passIndClassRed);return false},chkPasswordMatch:function(a,b){if(typeof a!="undefined"&&typeof b!="undefined")if(typeof a.value!="undefined"&&typeof b.value!="undefined")if(dj.lang.trim(a.value)===dj.lang.trim(b.value)){this.hideErrorNPassIndGreen(this._nodes.newPassInd);this.hideErrorNPassIndGreen(this._nodes.confirmPassInd);return true}this.updatePasswordInd(this._nodes.confirmPassInd,this._nodes.passIndClassRed);this.errorArr.push(this._nodes.passwordDoNotMatch);return false},validateNewPassword:function(){var a=true;if(this.chkEmpty(this.oNewPassword.value))if(this.chkPasswordLength(this.oNewPassword,this._nodes.newPassInd,this._nodes.errorUl))this.chkPasswordSplChars(this.oNewPassword,this._nodes.newPassInd,this._nodes.errorUl)||(a=false);else a=false;else{dojo.indexOf(this.errorArr,this._nodes.newPasswordRequired)<0&&this.errorArr.push(this._nodes.newPasswordRequired);this.updatePasswordInd(this._nodes.newPassInd,this._nodes.passIndClassRed);a=false}a&&this.hideErrorNPassIndGreen(this._nodes.newPassInd);return a},validateConfirmPassword:function(){var a=true;if(this.chkEmpty(this.oConfirmPassword.value))if(this.chkPasswordLength(this.oConfirmPassword,this._nodes.confirmPassInd,this._nodes.errorUl))this.chkPasswordSplChars(this.oConfirmPassword,this._nodes.confirmPassInd,this._nodes.errorUl)||(a=false);else a=false;else{dojo.indexOf(this.errorArr,this._nodes.confirmPasswordRequired)<0&&this.errorArr.push(this._nodes.confirmPasswordRequired);this.updatePasswordInd(this._nodes.confirmPassInd,this._nodes.passIndClassRed);a=false}a&&this.hideErrorNPassIndGreen(this._nodes.confirmPassInd);return a},initForgotPasswordPage:function(){dojo.byId(this._nodes.userEmailId);document.location=this._nodes.pageUrls.forgotPasswordPageUrl},getQueryStrParam:function(a,b){if(typeof this.queryStringList[a]=="undefined"){var c="";c=typeof b=="undefined"?window.location.toString():b.toString();c.match(/\?(.+)$/);c=RegExp.$1;c=c.split("&");for(var d=0;d<c.length;d++){var e=c[d].split("=");this.queryStringList[e[0]]=unescape(e[1])}}return this.queryStringList[a]},hideFormFactor:function(a){a=dojo.query(a);a.length>0&&dojo.addClass(a[0],"hidden");a=dojo.query(".lnColl");a.length>0&&dojo.addClass(a[0],"hidden");a=dojo.query(".custNav");a.length>0&&dojo.addClass(a[0],"hidden")},fadeScrim:function(a,b){var c=500;if(b)c=b;dojo.style(a,"opacity","0");dojo.fadeIn({node:a,duration:c}).play()},getPageUrl:function(){var a=this._cfg.NONSUBSCRIBER_HOMEPAGE_PID,b=this._cfg.NONSUBSCRIBER_SEARCH_PAGE_PID,c=this._cfg.NONSUBSCRIBER_NEWSLETTERS_ALERTS_PAGE_PID,d=this._cfg.MDC_PAGE_PID,e;e=typeof gcDomain!=="undefined"&&gcDomain!==null&&gcDomain!==""?"http://"+gcDomain:"http://"+document.domain;var f;var g=f=parent.window.location.href;if(typeof pID!=="undefined"){g=this._nodes.isStandalonePage?e+this._cfg.HOMEPAGE_SUBSCRIBER_URL:pID===a?e+this._cfg.HOMEPAGE_SUBSCRIBER_URL:pID===c?e+"/email":pID===b?e+this._cfg.SEARCH_PAGE_SUBSCRIBER_URL:pID===d?e+this._cfg.MDC_LINK_URL:f;a=g.indexOf("?")!=-1?"&":"?";if(typeof a!==undefined){a=a+"_nocache="+(new Date).getTime();if(g.indexOf("#")!=-1)g=g.replace("#",a+"#");else g+=a}}return g},chkPasswordSplChars:function(a,b){if(typeof a!="undefined"){var c=a.value;if(typeof c!="undefined"){for(var d=true,e=0;e<c.length;e++)if("!@#$%^&*()+=-[]\\';,./{}|\":<>?~_ ".indexOf(c.charAt(e))!=-1)d=false;if(d){this.updatePasswordInd(b,this._nodes.passIndClassGreen);return true}else dojo.indexOf(this.errorArr,this._nodes.invalidCharacters)<0&&this.errorArr.push(this._nodes.invalidCharacters)}}this.updatePasswordInd(b,this._nodes.passIndClassRed);return false},resizeIframe:function(){if(dojo.byId("moduleiframe")!=null&&typeof dojo.byId("moduleiframe")!="undefined"){var a=dojo.query(".loginModule")[0].clientHeight?dojo.query(".loginModule")[0].clientHeight:0;if(a!=0)dojo.byId("moduleiframe").style.height=a}},addClassToBody:function(){dojo.addClass(dojo.body(),"loginForm_content")},chkIfHttpsDomain:function(){try{if(typeof parent.window.location.href!="undefined"&&parent.window.location.href.indexOf("https://")>-1)return true;return false}catch(a){return false}},lifpOmnitureTracking:function(a,b,c){setMetaData("pagename",c);c=c.replace(this.omniturePrefix,"");setMetaData("apage",this.omniturePrefix+"_Customer Resources_"+
c);setMetaData("atype",this.omniturePrefix+"_Customer Resourcess_"+c);setMetaData("section","Customer Resources");setMetaData("subsection",this.omniturePrefix+"_Login");setMetaData("csource","Customer Resources");setMetaData("ctype","marketing and support");setMetaData("basesection",this.omniturePrefix+"_Customer Resources_Login");if(typeof a!="undefined"&&a.length>0)for(index=0;index<a.length;index++)setMetaData(a[index][0],a[index][1]);if(typeof b!="undefined")s.events=b;typeof dj.context.core!=="undefined"&&typeof dj.context.core.urlPrefix!=="undefined"&&(dj.context.core.urlPrefix.indexOf("wsj.de")!==-1||dj.context.core.urlPrefix.indexOf("wallstreetjournal.de")!==-1)?dj.util.Tracking.omniture.firePixel(true,"WSJDE_"):dj.util.Tracking.omniture.firePixel(true)},destroyIframe:function(){parent.dojo.destroy("moduleiframe");parent.dojo.destroy("overlayDiv")},destroyAccountInstanceArr:function(){if(typeof dj.module.loader!="undefined"&&typeof dj.module.loader.accountInstanceArr!="undefined"){for(;dj.module.loader.accountInstanceArr.length!=0;){var a=dj.module.loader.accountInstanceArr.pop();typeof a!="undefined"&&typeof a.destroyObject!="undefined"&&typeof a.destroyObject=="function"&&a.destroyObject()}if(dj.module.loader.accountInstanceArr.length==0){dj.module.loader.accountInstanceArr={};dj.module.loader={}}}},logoutTheUnverifiedFreeRegUser:function(){this.destroyAccountInstanceArr();this.moveOutOfIframe({logout:"logout"})},submitTowerStreamForm:function(){var a="wsj/wsjwifi";if(this._nodes.towerUsername&&this._nodes.towerUsername!="")a=this._nodes.towerUsername;var b="laiZeis6";if(this._nodes.towerPassword&&this._nodes.towerPassword!="")b=this._nodes.towerPassword;if(this._nodes.towerStreamUrl&&this._nodes.towerStreamUrl!="")document.towerWifiForm.action=this._nodes.towerStreamUrl;if(this._nodes.towerIP&&this._nodes.towerIP!="")document.towerWifiForm.ip.value=this._nodes.towerIP;document.towerWifiForm.username.value=a;document.towerWifiForm.password.value=b;document.towerWifiForm.submit()}});dojo.provide("dj.widget.accountscrim.FBConnected");dojo.require("dj.widget.accountscrim.BaseScrim");dojo.require("dj.util.User");dojo.declare("dj.widget.accountscrim.FBConnected",dj.widget.accountscrim.BaseScrim,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a);this.fragmentLoaded=false;this._nodes=this.WIDGET_CONFIG;this.errorArr=[]},DEFAULT_CONFIG:{isLoadJs:true,version:4.3,NONSUBSCRIBER_HOMEPAGE_PID:"0_0_WH_0001_public",NONSUBSCRIBER_SEARCH_PAGE_PID:"3_0466",NONSUBSCRIBER_NEWSLETTERS_ALERTS_PAGE_PID:"5_6007",MDC_PAGE_PID:"2_3000",HOMEPAGE_SUBSCRIBER_URL:"/",SEARCH_PAGE_SUBSCRIBER_URL:"/search",MDC_LINK_URL:"/mdc/page/marketsdata.html"},WIDGET_CONFIG:{closeButton:".closeBtn",tryagain:".tryagian",hiddenClass:"hidden"},init:function(a,b){this.displayScrim(a,b);this.domNodeId=a;this.makeWidgetConnections();if(typeof dj.module.facebook!="undefined"&&typeof dj.module.facebook.connect!="undefined")typeof FB=="undefined"?dj.module.facebook.connect.init(this.updateUserInfo):this.updateUserInfo();else window.console&&console.warn(" In {FBConnected.js} dj.module.facebook.connect is not found, please make the required js file available")},setOmnitureTracking:function(){var a=[],b="";b=this.omniturePrefix+"_Auth_FBConnect_Thank_You_Original";dj.util.User.isSubLoggedIn(function(c){a[0]=c?["caccess","sub"]:["caccess","reg"]});this.lifpOmnitureTracking(a,"event12,evenr57",b)},showScrim:function(a,b){this.domNodeId=a;this.displayScrim(a,b);this.setOmnitureTracking()},makeWidgetConnections:function(){this.makeCloseOrOKButtonConnection(this.domNodeId);dojo.query(".login_invite").connect("click",this,function(a){this.closeNDestroyGreyBckground(this.domNodeId,a);FB.ui({method:"apprequests",message:"You should learn more about this awesome game.",data:"tracking information for the user"})})},updateUserInfo:function(){typeof FB!="undefined"&&FB.api("/me",function(a){if(!(!a||a.error))dojo.byId("name").innerHTML=a.first_name+" "+a.last_name})}});dojo.provide("dj.widget.accountscrim.Registration");dojo.require("dj.widget.accountscrim.BaseScrim");dojo.require("dj.util.Form");dojo.require("dj.service.account.RegistrationService");dojo.declare("dj.widget.accountscrim.Registration",dj.widget.accountscrim.BaseScrim,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a);this.fragmentLoaded=false;this._nodes=this.WIDGET_CONFIG;this.errorArr=[]},DEFAULT_CONFIG:{isLoadJs:true,version:4.2},WIDGET_CONFIG:{serviceUrls:{registrationServiceUrl:"/epiton/registration/v2/profile",loginServiceUrl:"/auth/submitlogin.json"},closeButton:"registrationClose",firstName:"firstName",lastName:"lastName",emailToRegister:"emailToRegister",newPassword:"newPassword",confirmPassword:"confirmPassword",companySize:"companySize",registerNow:"registerNow",newPassInd:"newPassInd",confirmPassInd:"confirmPassInd",jobTitleDropDown:"jobTitleDropDown",passIndClassRed:"validate no",passIndClassGreen:"validate yes",hiddenClass:"hidden",gotoLogin:".loginClass",gotoForgotPasswordFromIframe:".forgotPasswordFromIframeClass",registrationIframeForm:"registrationIframeForm",errorUl:"registrationErrorUl",goBackToIframeFrmErr:"goBackToIframeFrmErr",fieldErrorClass:"errorState",isIframe:false,iframeErrorOverlayDiv:"iframeErrorOverlayDiv",firstNameRequired:"firstNameRequired",lastNameRequired:"lastNameRequired",invalidemailFormat:"invalidemailFormat",emailIdrequired:"emailIdrequired",newPasswordRequired:"newPasswordRequired",confirmPasswordRequired:"confirmPasswordRequired",privacyPolicyRequired:"privacyPolicyRequired",passwordTooShort:"passwordTooShort",passwordTooLong:"passwordTooLong",invalidCharacters:"invalidCharacters",passwordDoNotMatch:"passwordDoNotMatch",passwordSuggestion:".pw_suggestion",passwordSuggestionClose:".pw_tooltip",generalError:"generalError",emailAddressexists:"emailAddressexists",emailAddressinvalid:"emailAddressinvalid",connectFB:".connectwithfb",whatsThisFbClass:".whatsThisFbClass",fbToolTipClass:".fb_tooltip",fbToolTipCloseClass:".fb-close-tooltip-btn"},init:function(a){this.addClassToBody();this.successFileUrl=this.getQueryStrParam("successFileUrl");this.numOfLoginAttempts=0;this.domNodeId=a;this.makeWidgetConnections();this.makeFBConnections(this.successFileUrl);this.setOmnitureTracking()},setOmnitureTracking:function(){var a=[],b=this.omniturePrefix+"_FreeReg_Login_FreeReg_Form";a[0]=["basesection",this.omniturePrefix+"_Free_Reg"];a[1]=["subsection",this.omniturePrefix+"_Free_Reg"];a[2]=["caccess","free"];this.lifpOmnitureTracking(a,"event12",b)},showScrim:function(a){this.domNodeId=a;this.displayScrim(a);this.hideErrorMessages(this._nodes.errorUl);this.setOmnitureTracking()},makeWidgetConnections:function(){this.fragmentLoaded=true;this.oFirstName=dojo.byId(this._nodes.firstName);this.oLastName=dojo.byId(this._nodes.lastName);this.oEmailToRegister=dojo.byId(this._nodes.emailToRegister);this.oNewPassword=dojo.byId(this._nodes.newPassword);this.oConfirmPassword=dojo.byId(this._nodes.confirmPassword);this.oCompanySize=dojo.byId(this._nodes.companySize);this.oRegisterNow=dojo.byId(this._nodes.registerNow);if(this.oFirstName!==null){dojo.connect(this.oFirstName,"onfocus",this,function(){dj.util.Form.clearValue(this.oFirstName,"First Name")});dojo.connect(this.oFirstName,"onclick",this,function(){dj.util.Form.clearValue(this.oFirstName,"First Name")})}dojo.connect(dojo.byId("registrationIframeForm"),"onsubmit",this,function(a){dojo.stopEvent(a);this.submitForm()});dojo.connect(dojo.byId(this._nodes.closeButton),"click",this,function(a){dojo.stopEvent(a);dojo.addClass(dojo.byId(this.domNodeId),this._nodes.hiddenClass)});if(this.oNewPassword!==null)this.oNewPassword.type="password";if(this.oConfirmPassword!==null)this.oConfirmPassword.type="password";dojo.connect(this.oNewPassword,"keyup",this,function(a){if(this.oNewPassword.value==""&&!this.isChkEnter(a)){dojo.removeClass(dojo.byId("newPassInd"),"validate no");dojo.removeClass(dojo.byId("newPassInd"),"validate yes");dojo.removeClass(dojo.byId("newPassword"),"errorState")}});dojo.connect(this.oConfirmPassword,"keyup",this,function(a){if(this.oConfirmPassword.value==""&&!this.isChkEnter(a)){dojo.removeClass(dojo.byId("confirmPassInd"),"validate no");dojo.removeClass(dojo.byId("confirmPassInd"),"validate yes");dojo.removeClass(dojo.byId("confirmPassword"),"errorState")}});dojo.query(this._nodes.passwordSuggestion).connect("click",this,function(){dojo.removeClass(dojo.byId("pwSuggestion"),"hidden")});dojo.query(this._nodes.passwordSuggestionClose).connect("click",this,function(){dojo.addClass(dojo.byId("pwSuggestion"),"hidden")});dojo.query(this._nodes.gotoLogin).connect("click",this,function(){this.chkIfHttpsDomain()?this.moveOutOfIframe({close:"close"}):this.initLoginFromIframe(this.successFileUrl)})},submitForm:function(){this.clearRedBoundaryFromFields();if(this.validateForm()){dojo.byId(this._nodes.errorUl).innerHTML="";var a=dojo.byId(this._nodes.jobTitleDropDown),b="profile.firstName="+this.oFirstName.value;b+="&profile.lastName="+this.oLastName.value;b+="&profile.emailAddress="+this.oEmailToRegister.value;b+="&profile.password="+this.oNewPassword.value;b+="&profile.passwordConfirmation="+this.oConfirmPassword.value;b+="&service.prodct=wsj-online&service.templateCode="+this.PRODUCT_CD;b+="&service.registrationType=FREE_REGISTRATION";if(typeof this._nodes.isTowerLoadPage!="undefined"&&typeof this._nodes.isTowerLoadPage!="")b+="&service.trackingCode=tsWifi";if(typeof a!="undefined"&&a.value!="")b+="&profile.demographics.questionId1=dt_job_title&profile.demographics.answer1="+a.value;a=this.load;if(typeof this._nodes.isTowerLoadPage!="undefined"&&typeof this._nodes.isTowerLoadPage!="")a=this.towerLoad;dj.service.account.RegistrationService.registerUser(this._nodes.serviceUrls.registrationServiceUrl,b,a,this.error,this)}},load:function(){this.moveOutOfIframe({screenName:"RegistrationConfirmation",emailId:"",firstName:"",lastName:""})},error:function(a){dojo.forEach(a,function(c,d){if(c.indexOf("-")>-1){c=c.replace(/-/g,"");a[d]=c}},this);this.showErrorMessage(this._nodes.errorUl,a);var b=false;dojo.forEach(a,function(c){if(c==this._nodes.emailAddressexists||c==this._nodes.emailAddressinvalid){this.addErrorClass(this._nodes.emailToRegister);if(c==this._nodes.emailAddressexists)b=true}},this);b&&this.lifpOmnitureTracking([],"event12",this.omniturePrefix+"_Auth_"+this.omniturePrefix+"_Registration_Scrim Email Already Exists");this.connectForgotPasswordFromIframe()},validateForm:function(){var a=true;if(!this.chkEmpty(this.oFirstName.value)){this.errorArr.push(this._nodes.firstNameRequired);this.addErrorClass(this._nodes.firstName);a=false}if(!this.chkEmpty(this.oLastName.value)){this.errorArr.push(this._nodes.lastNameRequired);this.addErrorClass(this._nodes.lastName);a=false}var b=this.chkEmailAddress(this.oEmailToRegister.value);b||this.addErrorClass(this._nodes.emailToRegister);a=a?b:false;(b=this.validateNewPassword())||this.addErrorClass(this._nodes.newPassword);var c=this.validateConfirmPassword();c||this.addErrorClass(this._nodes.confirmPassword);a=a?b?c:false:false;if(b&&c)if(!this.chkPasswordMatch(this.oNewPassword,this.oConfirmPassword,this._nodes.errorUl)){this.addErrorClass(this._nodes.confirmPassword);a=false}if(dojo.byId("privacypolicybox"))if(dojo.byId("privacypolicybox").checked==false){this.errorArr.push(this._nodes.privacyPolicyRequired);a=false}this.showErrorNClearArray();return a},showErrorNClearArray:function(){this.showErrorMessage(this._nodes.errorUl,this.errorArr);this.errorArr=[]},highlightTheErrorField:function(a){dojo.forEach(a,function(b){b==this._nodes.usernamemissing&&this.addErrorClass(this._nodes.userOrEmailInput);b==this._nodes.passwordmissing&&this.addErrorClass(this._nodes.password)},this)},clearRedBoundaryFromFields:function(){dojo.removeClass(dojo.byId(this._nodes.firstName),this._nodes.fieldErrorClass);dojo.removeClass(dojo.byId(this._nodes.lastName),this._nodes.fieldErrorClass);dojo.removeClass(dojo.byId(this._nodes.emailToRegister),this._nodes.fieldErrorClass);dojo.removeClass(dojo.byId(this._nodes.newPassword),this._nodes.fieldErrorClass);dojo.removeClass(dojo.byId(this._nodes.confirmPassword),this._nodes.fieldErrorClass)}});dojo.provide("dj.widget.accountscrim.BaseLogin");dojo.require("dj.widget.accountscrim.BaseScrim");dojo.require("dj.util.Form");dojo.require("dj.service.account.LoginService");dojo.require("dj.util.User");dojo.declare("dj.widget.accountscrim.BaseLogin",dj.widget.accountscrim.BaseScrim,{constructor:function(){},submitForm:function(a){this.clearRedBoundaryFromFields();if(this.validateForm(a)){dojo.byId(this._nodes.errorUl).innerHTML="";if(this._nodes.isStandalonePage)this.currentPageUrl=this._nodes.isAmazonOffer?this._nodes.shopnbuyUrl:this._nodes.loginTargetUrl?this._nodes.loginTargetUrl:this.getPageUrl();var b="";b=this.currentPageUrl.indexOf("?")>-1?encodeURIComponent(this.currentPageUrl+"&user=welcome"):encodeURIComponent(this.currentPageUrl+"?user=welcome");var c=encodeURIComponent(dj.context.account.testLogin+"?currentPageUrl=")+b;b=this.load;if(typeof this._nodes.isTowerLoadPage!="undefined"&&typeof this._nodes.isTowerLoadPage!=""){b=this.towerLoginLoad;c=encodeURIComponent(this._nodes.landingPage)}a={username:dj.lang.trim(a.username),password:a.password,url:c,template:"default",realm:"default",savelogin:a.savelogin};dj.service.account.LoginService.loginUser(this._nodes.serviceUrls.loginServiceUrl,dojo.toJson(a),b,this.error,this)}},setupLoginData:function(){return{username:this.oUserName.value,password:this.oPassword.value,savelogin:dojo.byId(this._nodes.savelogin).checked+"",errorUI:this._nodes.errorUl}},load:function(a){var b="";if(typeof a.status!="undefined"){if(this.isValidEmailAddress(a.username))b=a.username;else{if(dojo.byId("userEmailIdToResendEmail")!=null)dojo.byId("userEmailIdToResendEmail").innerHTML="";else dojo.create("div",{id:"userEmailIdToResendEmail"},dojo.body());dj.util.User.renderEmailAddress("userEmailIdToResendEmail");b=dojo.byId("userEmailIdToResendEmail").innerHTML}if(a.status==this._nodes.unverifiedsubscriber){this.isUnverifiedSubscriber=true;this.loginVerifyEmailUserdata={screenName:this._constants.LOGIN_VERIFY_EMAIL_SCREEN,uuid:a.uuid,productCode:this.PRODUCT_CD,userEmail:b,refreshPageUrlForUnverifiedSub:encodeURIComponent(this.currentPageUrl)};dojo.byId("unverifiedFreeRegOrSub")==null&&dojo.create("div",{id:"unverifiedFreeRegOrSub","class":"hidden"},dojo.body(),"last")}else if(a.status==this._nodes.unverifiedfreereg){this.isUnverifiedFreeReg=true;this.unverifiedFreeRegUserdata={screenName:this._constants.UNVERIFIED_FREE_REG,uuid:a.uuid,productCode:this.PRODUCT_CD,userEmail:b};dojo.byId("unverifiedFreeRegOrSub")==null&&dojo.create("div",{id:"unverifiedFreeRegOrSub","class":"hidden"},dojo.body(),"last")}else if(typeof a.status!="undefined"&&dojo.trim(a.status)!="")this.successLogin=true}if(this.successLogin)parent.location=a.url;else if(this._nodes.isStandalonePage&&typeof this.isUnverifiedSubscriber=="undefined"&&typeof this.isUnverifiedFreeReg=="undefined")window.location=a.url;else{dojo.create("div",{id:"testLoginContainer"},dojo.body(),"last");this.initIFrame("testLoginContainer",0,0,a.url)}},error:function(a){if(this._nodes.fbConnectLogin){dojo.removeClass(dojo.byId("fbconnect"),"disabled");dojo.removeClass(dojo.byId("loginSubmit"),"disabled")}var b="N";this.numOfLoginAttempts++;dojo.forEach(a,function(e,f){if(e.indexOf("-")>-1){e=e.replace(/-/g,"");a[f]=e;if(e===this._nodes.usernameinvalidcredentials&&this.numOfLoginAttempts>2){a[f]=this._nodes.morethan2invalidcredentials;b="Y"}e===this._nodes.facebookconnected&&this.moveOutOfIframe({screenName:this._constants.FB_LOGIN_OR_WSJ_PSWD_SCREEN,username:this.oUserName.value,productCode:this.PRODUCT_CD})}},this);this.showErrorMessage(this._nodes.errorUl,a);if(a.length>0){this.clearRedBoundaryFromFields();this.focusOnError()}if(b==="Y"){this.connectForgotUsernameFromIframe();this.connectForgotPasswordFromIframe()}var c=[],d="";c=[];d=this._nodes.fbConnectLogin?"WSJ_Auth_WSJ/Barrons_Login_Page_Post_FBConnect Invalid Login Credentials":this._nodes.isStandalonePage?"WSJ_Auth_WSJ_Login_Page Bad Credentials page":"WSJ_Auth_WSJ_Login_Scrim Bad Credentials page";this.lifpOmnitureTracking(c,"event12",d)},gotoSubscribePage:function(){var a={};if(dj.util.Region.getViewByRegion()=="asia,india"){this._nodes.subscribeFromLoginPage=dj.context.account.india_subscribeFromLoginPage;this._nodes.subscribeFromLoginOverlay=dj.context.account.india_subscribeFromLoginOverlay}else if(dj.util.Region.getViewByRegion()=="asia"){this._nodes.subscribeFromLoginPage=dj.context.account.asia_subscribeFromLoginPage;this._nodes.subscribeFromLoginOverlay=dj.context.account.asia_subscribeFromLoginOverlay}else if(dj.util.Region.getViewByRegion()=="europe"){this._nodes.subscribeFromLoginPage=dj.context.account.europe_subscribeFromLoginPage;this._nodes.subscribeFromLoginOverlay=dj.context.account.europe_subscribeFromLoginOverlay}a=this._nodes.isStandalonePage?{refreshPageUrl:encodeURIComponent(this._nodes.subscribeFromLoginPage)}:{refreshPageUrl:encodeURIComponent(this._nodes.subscribeFromLoginOverlay)};this.moveOutOfIframe(a)},highlightTheErrorField:function(a){dojo.forEach(a,function(b){b==this._nodes.usernamemissing&&this.addErrorClass(this._nodes.userOrEmailInput);b==this._nodes.passwordmissing&&this.addErrorClass(this._nodes.password)},this)},clearRedBoundaryFromFields:function(){dojo.removeClass(dojo.byId(this._nodes.userOrEmailInput),this._nodes.fieldErrorClass);dojo.removeClass(dojo.byId(this._nodes.password),this._nodes.fieldErrorClass)},focusOnError:function(){this.oPassword.value="";this.oUserName.focus()},validateForm:function(a){var b=true;if(!this.chkEmpty(a.username)){this.errorArr.push(this._nodes.usernamemissing);this.addErrorClass(this._nodes.userOrEmailInput);b=false}if(b)if(!this.chkEmpty(a.password)){this.errorArr.push(this._nodes.passwordmissing);this.addErrorClass(this._nodes.password);b=false}this.showErrorMessage(a.errorUI,this.errorArr);this.errorArr=[];return b},initIFrame:function(a,b,c,d){setTimeout(this.isLoginSuccess,2E4);dj.util.Url.createSimpleIframe({src:d,"class":"hidden",allowTransparency:"true"},a,this.testLoginIframeLoaded,this)},isLoginSuccess:function(){if(!this.isUserLoggedIn){this.errorArr=["generalError"];this.showErrorMessage(this._nodes.errorUl,this.errorArr);window.console&&console.warn("User couldn't be logged in ");this.errorArr=[];this.isUserLoggedIn=false}},testLoginIframeLoaded:function(){this.isUserLoggedIn=true;if(this.isUnverifiedSubscriber)this.moveOutOfIframe(this.loginVerifyEmailUserdata);else this.isUnverifiedFreeReg&&this.moveOutOfIframe(this.unverifiedFreeRegUserdata);dojo.destroy("unverifiedFreeRegOrSub")}});dojo.provide("dj.widget.accountscrim.Login");dojo.require("dj.widget.accountscrim.BaseLogin");dojo.require("dj.util.Form");dojo.require("dj.service.account.LoginService");dojo.require("dj.util.User");dojo.declare("dj.widget.accountscrim.Login",dj.widget.accountscrim.BaseLogin,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a);this._nodes=this.WIDGET_CONFIG;this._dls=dj.service.account.LoginService;this.errorArr=[]},DEFAULT_CONFIG:{isLoadJs:true,version:4.2,NONSUBSCRIBER_HOMEPAGE_PID:"0_0_WH_0001_public",NONSUBSCRIBER_SEARCH_PAGE_PID:"3_0466",NONSUBSCRIBER_NEWSLETTERS_ALERTS_PAGE_PID:"5_6007",MDC_PAGE_PID:"2_3000",HOMEPAGE_SUBSCRIBER_URL:"/",SEARCH_PAGE_SUBSCRIBER_URL:"/search",MDC_LINK_URL:"/mdc/page/marketsdata.html"},WIDGET_CONFIG:{serviceUrls:{loginServiceUrl:"/auth/submitlogin.json"},closeButton:"loginClose",userOrEmailInput:"loginUserOrEmail",password:"password",submitButton:"loginSubmit",hiddenClass:"hidden",gotoForgotUsernameFromIframe:".forgotUsernameFromIframeClass",gotoForgotPasswordFromIframe:".forgotPasswordFromIframeClass",gotoRegistration:".registerUserClass",gotoSubscribe:".subscribeUser",savelogin:"savelogin",loginIframeForm:"loginIframeForm",errorUl:"loginErrorUl",goBackToIframeFrmErr:"goBackToIframeFrmErr",fieldErrorClass:"errorState",isIframe:false,iframeErrorOverlayDiv:"iframeErrorOverlayDiv",usernamemissing:"usernamemissing",passwordmissing:"passwordmissing",usernameinvalidcredentials:"usernameinvalidcredentials",morethan2invalidcredentials:"morethan2invalidcredentials",cookiesDisabledMsg:"cookiesDisabledMsg",facebookconnected:"facebookconnected",unverifiedsubscriber:"unverified-subscriber",unverifiedfreereg:"unverified-freereg",generalError:"generalError",connectFB:".connectwithfb",whatsThisFbClass:".whatsThisFbClass",fbToolTipClass:".login_tooltip",fbToolTipCloseClass:".close-tooltip-btn",subscribeFromLoginOverlay:dj.context.account.subscribeFromLoginOverlay,subscribeFromLoginPage:dj.context.account.subscribeFromLoginPage},init:function(a,b){if(typeof this._nodes.isStandalonePage=="undefined"||!this._nodes.isStandalonePage){this.addClassToBody();this.updatePromoUrlnImage()}this.numOfLoginAttempts=0;this.domNodeId=a;this.makeWidgetConnections();if(this._nodes.isStandalonePage&&typeof this._nodes.akamaiCdnPrefix!="undefined"&&this._nodes.akamaiCdnPrefix!="")this._cfg.akamaiCdnPrefix=this._nodes.akamaiCdnPrefix;this.makeFBConnections(this.successFileUrl);var c=this;this.chkIfCookieEnabledOnMob();dj.lang.addLiveEvent(".login_id","keypress",function(d){if(dojo.isIE)if(c.isChkEnter(d)){dojo.stopEvent(d);c.submitForm(c.setupLoginData())}});dj.lang.addLiveEvent(".login_pw","keypress",function(d){if(dojo.isIE)if(c.isChkEnter(d)){dojo.stopEvent(d);c.submitForm(c.setupLoginData())}});if(typeof b=="undefined"||b)dojo.ready(function(){setTimeout(function(){document.loginform.loginUserOrEmail.focus()},100)});this.setOmnitureTracking()},chkIfCookieEnabledOnMob:function(){if(/Android|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))navigator.cookieEnabled||this.showErrorMessage(this._nodes.errorUl,[this._nodes.cookiesDisabledMsg])},setOmnitureTracking:function(){var a="";a=this._nodes.isStandalonePage?this.omniturePrefix+"_Auth_"+this.omniturePrefix+"/Barrons_Login_Page_Sub_with_Promo":this.omniturePrefix+"_Auth_"+this.omniturePrefix+"/Barrons_Login_Scrim_Sub_with_Promo";this.lifpOmnitureTracking([],"event12",a)},showScrim:function(a){this.domNodeId=a;this.displayScrim(a);this.hideErrorMessages(this._nodes.errorUl);this.setOmnitureTracking()},makeWidgetConnections:function(){this.fragmentLoaded=true;this.oUserName=dojo.byId(this._nodes.userOrEmailInput);this.oPassword=dojo.byId(this._nodes.password);this.oLoginSub=dojo.byId(this._nodes.submitButton);if(this.oUserName!==null){dojo.connect(this.oUserName,"focus",this,function(){dj.util.Form.clearValue(this.oUserName,"User Name")});dojo.connect(this.oUserName,"click",this,function(){dj.util.Form.clearValue(this.oUserName,"User Name")})}dojo.connect(dojo.byId("loginIframeForm"),"onsubmit",this,function(a){this.submitForm(this.setupLoginData());dojo.stopEvent(a)});dojo.connect(dojo.byId(this._nodes.closeButton),"click",this,function(a){dojo.stopEvent(a);dojo.addClass(dojo.byId(this.domNodeId),this._nodes.hiddenClass)});if(this.oPassword!==null){this.oPassword.type="password";dojo.connect(this.oPassword,"focus",this,function(){dj.util.Form.clearValue(this.oPassword,"Password")})}this.connectForgotPasswordFromIframe();this.connectForgotUsernameFromIframe();dojo.query(this._nodes.gotoRegistration).connect("click",this,function(){this._nodes.isStandalonePage?this.initRegistration():this.initRegistrationFromIframe(this.successFileUrl)});dojo.query(this._nodes.gotoSubscribe).connect("click",this,function(a){dojo.stopEvent(a);this.gotoSubscribePage()})},updatePromoUrlnImage:function(){var a=dj.util.Region.getViewByRegion();console.log("region "+a);if(typeof a!="undefined"&&dojo.byId("usLoginPromo")!=null){var b="usLoginPromo",c="asiaLoginPromo",d="europeLoginPromo";if(a.toUpperCase().indexOf("US")>-1){b="usLoginPromo";c="asiaLoginPromo";d="europeLoginPromo"}else if(a.toUpperCase().indexOf("ASIA")>-1){b="asiaLoginPromo";c="usLoginPromo";d="europeLoginPromo"}else if(a.toUpperCase().indexOf("EUROPE")>-1){b="europeLoginPromo";c="usLoginPromo";d="asiaLoginPromo"}dojo.removeClass(dojo.byId(b),"hidden");dojo.addClass(dojo.byId(c),"hidden");dojo.addClass(dojo.byId(d),"hidden")}}});dojo.provide("dj.widget.accountscrim.FBLogin");dojo.require("dj.widget.accountscrim.BaseLogin");dojo.require("dj.util.Form");dojo.require("dj.service.account.LoginService");dojo.require("dj.widget.accountscrim.Login");dojo.require("dj.widget.accountscrim.Registration");dojo.declare("dj.widget.accountscrim.FBLogin",dj.widget.accountscrim.BaseLogin,{constructor:function(a){this._cfg=dojo.mixin(this.DEFAULT_CONFIG,a);this.fragmentLoaded=false;this._nodes=this.WIDGET_CONFIG;this._dls=dj.service.account.LoginService;this.errorArr=[]},DEFAULT_CONFIG:{isLoadJs:true,version:4.2,productCd:"WSJ_FACEBOOK",NONSUBSCRIBER_HOMEPAGE_PID:"0_0_WH_0001_public",NONSUBSCRIBER_SEARCH_PAGE_PID:"3_0466",NONSUBSCRIBER_NEWSLETTERS_ALERTS_PAGE_PID:"5_6007",MDC_PAGE_PID:"2_3000",HOMEPAGE_SUBSCRIBER_URL:"/",SEARCH_PAGE_SUBSCRIBER_URL:"/search",MDC_LINK_URL:"/mdc/page/marketsdata.html"},WIDGET_CONFIG:{serviceUrls:{loginServiceUrl:"/auth/submitlogin.json",registrationServiceUrl:"/epiton/registration/v2/profile"},closeButton:".closeBtn",userOrEmailInput:"fb_loginUserOrEmail",password:"fb_password",loginSubmit:"loginSubmit",fbSubmit:"fbconnect",hiddenClass:"hidden",gotoForgotUsernameFromIframe:".forgotUsernameFromIframeClass",loginConnect:".wsj_login_form_intro",loginForm:".wsj_login_form",savelogin:"fb_savelogin",errorUl:"fb_loginErrorUl",usernamemissing:"usernamemissing",passwordmissing:"passwordmissing",usernameinvalidcredentials:"usernameinvalidcredentials",morethan2invalidcredentials:"morethan2invalidcredentials",facebookconnected:"facebookconnected",unverifiedsubscriber:"unverified-subscriber",unverifiedfreereg:"unverified-freereg",generalError:"generalError",fieldErrorClass:"errorState",firstNameRequired:"firstNameRequired",lastNameRequired:"lastNameRequired",invalidemailFormat:"invalidemailFormat",emailIdrequired:"emailIdrequired",newPasswordRequired:"newPasswordRequired",confirmPasswordRequired:"confirmPasswordRequired",passwordTooShort:"passwordTooShort",passwordTooLong:"passwordTooLong",invalidCharacters:"invalidCharacters",passwordDoNotMatch:"passwordDoNotMatch",emailAddressexists:"emailAddressexists",firstName:"fb_firstName",lastName:"fb_lastName",emailToRegister:"fb_emailToRegister",newPassword:"fb_newPassword",confirmPassword:"fb_confirmPassword",registerErrorUl:"fb_registrationErrorUl",registerNow:"registerNow",newPassInd:"newPassInd",confirmPassInd:"confirmPassInd",passIndClassRed:"validate no",passIndClassGreen:"validate yes",passwordSuggestion:".pw_suggestion",passwordSuggestionClose:".pw_tooltip",connectFB:"connectwithfb",whatsThisFb:"whatsThisFb",fbToolTip:"fbToolTip",fbToolTipClose:"fbToolTipClose",helpTipTarget:".helpTipTarget",helpbtnclose:".btn_close"},init:function(a){this.addClassToBody();this._nodes.fbConnectLogin=true;this.successFileUrl=this.getQueryStrParam("successFileUrl");this.currentPageUrl=this.getQueryStrParam("currentPageUrl");this.fbconnectURL=this.getFBConnectURL(this.currentPageUrl);this.numOfLoginAttempts=0;this.domNodeId=a;this.makeWidgetConnections();if(typeof dj.module.facebook!="undefined"&&typeof dj.module.facebook.connect!="undefined")typeof FB=="undefined"?dj.module.facebook.connect.init(this.updateUserInfo):this.updateUserInfo();else window.console&&console.warn(" In {FBLogin.js} dj.module.facebook.connect is not found, please make the required js file available");this.setOmnitureTracking();var b=this;dj.lang.addLiveEvent(".fbloginid","keypress",function(c){if(dojo.isIE)if(b.isChkEnter(c)){dojo.stopEvent(c);b.submitLoginForm()}});dj.lang.addLiveEvent(".fbloginpassword","keypress",function(c){if(dojo.isIE)if(b.isChkEnter(c)){dojo.stopEvent(c);b.submitLoginForm()}})},showScrim:function(a){this.domNodeId=a;this.displayScrim(a);this.hideErrorMessages(this._nodes.errorUl);this.setOmnitureTracking()},setOmnitureTracking:function(){var a="";a=this.omniturePrefix+"_Auth_"+this.omniturePrefix+"_Login_Page_Post_FBConnect";this.lifpOmnitureTracking([],"event12",a)},updateUserInfo:function(){FB.api("/me",function(a){if(!(!a||a.error)){dojo.byId("fb_firstName").value=a.first_name;dojo.byId("fb_lastName").value=a.last_name;dojo.byId("fb_emailToRegister").value=a.email}})},showLoginForm:function(){dojo.removeClass(dojo.byId("wsj_login_box"),"wsj_login_box collapsed");dojo.addClass(dojo.byId("wsj_login_box"),"wsj_login_box expanded");this.makeLoginConnections()},setupRegistrationData:function(){return{firstname:this.oFirstName.value,lastname:this.oLastName.value,email:this.oEmailToRegister.value,password:this.oNewPassword.value,confirmpassword:this.oConfirmPassword.value,errorUI:this._nodes.registerErrorUl}},setupLoginData:function(){return{username:this.oUserName.value,password:this.oPassword.value,savelogin:dojo.byId(this._nodes.savelogin).checked+"",errorUI:this._nodes.errorUl}},makeWidgetConnections:function(){this.fragmentLoaded=true;this.oFirstName=dojo.byId(this._nodes.firstName);this.oLastName=dojo.byId(this._nodes.lastName);this.oEmailToRegister=dojo.byId(this._nodes.emailToRegister);this.oNewPassword=dojo.byId(this._nodes.newPassword);this.oConfirmPassword=dojo.byId(this._nodes.confirmPassword);dojo.connect(dojo.byId("fbRegisterForm"),"onsubmit",this,function(a){dojo.stopEvent(a);this.submitFBForm()});dojo.query(this._nodes.closeButton).connect("click",this,function(){dojo.addClass(dojo.byId(this.domNodeId),this._nodes.hiddenClass)});this.connectForgotPasswordFromIframe();this.connectForgotUsernameFromIframe();dojo.query(this._nodes.loginConnect).connect("click",this,function(){this.showLoginForm()});dojo.query(this._nodes.helpTipTarget).connect("click",this,function(){dojo.removeClass(dojo.byId("helpTipTree"),"helpTipTree-collapsed");dojo.addClass(dojo.byId("helpTipTree"),"helpTipTree-expanded")});dojo.query(this._nodes.helpbtnclose).connect("click",this,function(){dojo.addClass(dojo.byId("helpTipTree"),"helpTipTree-collapsed");dojo.removeClass(dojo.byId("helpTipTree"),"helpTipTree-expanded")});dojo.query(this._nodes.passwordSuggestion).connect("click",this,function(){dojo.removeClass(dojo.byId("pwSuggestion"),"hidden")});dojo.query(this._nodes.passwordSuggestionClose).connect("click",this,function(){dojo.addClass(dojo.byId("pwSuggestion"),"hidden")});dojo.connect(this.oConfirmPassword,"keyup",this,function(a){if(this.oConfirmPassword.value==""&&!this.isChkEnter(a)){dojo.removeClass(dojo.byId("confirmPassInd"),"validate no");dojo.removeClass(dojo.byId("confirmPassInd"),"validate yes");dojo.removeClass(dojo.byId("fb_confirmPassword"),"errorState")}if(this.isChkEnter(a)){dojo.stopEvent(a);this.submitFBForm()}});dojo.connect(this.oNewPassword,"keyup",this,function(a){if(this.oNewPassword.value==""&&!this.isChkEnter(a)){dojo.removeClass(dojo.byId("newPassInd"),"validate no");dojo.removeClass(dojo.byId("newPassInd"),"validate yes");dojo.removeClass(dojo.byId("fb_newPassword"),"errorState")}if(this.isChkEnter(a)){dojo.stopEvent(a);this.submitFBForm()}})},makeLoginConnections:function(){this.fragmentLoaded=true;this.oUserName=dojo.byId(this._nodes.userOrEmailInput);this.oPassword=dojo.byId(this._nodes.password);this.oLoginSub=dojo.byId(this._nodes.loginSubmit);this.oFBSub=dojo.byId(this._nodes.fbSubmit);if(this.oUserName!==null){dojo.connect(this.oUserName,"focus",this,function(){dj.util.Form.clearValue(this.oUserName,"User Name")});dojo.connect(this.oUserName,"click",this,function(){dj.util.Form.clearValue(this.oUserName,"User Name")})}dojo.connect(dojo.byId("fbLoginForm"),"onsubmit",this,function(a){dojo.stopEvent(a);this.submitLoginForm()})},validateLoginForm:function(a){this.errorArr=[];var b=true;if(!this.chkEmpty(a.username)){this.errorArr.push(this._nodes.usernamemissing);this.addErrorClass(this._nodes.userOrEmailInput);b=false}if(b)if(!this.chkEmpty(a.password)){this.errorArr.push(this._nodes.passwordmissing);this.addErrorClass(this._nodes.password);b=false}this.showErrorMessage(a.errorUI,this.errorArr);this.errorArr=[];return b},submitLoginForm:function(){if(!dojo.hasClass(dojo.byId("loginSubmit"),"disabled")){this.clearRedBoundaryFromFields("loginForm");var a=this.setupLoginData();if(this.validateLoginForm(a)){dojo.byId(this._nodes.errorUl).innerHTML="";dojo.addClass(dojo.byId("loginSubmit"),"disabled");a={username:dj.lang.trim(a.username),password:a.password,url:encodeURIComponent(dj.context.account.testLogin)+"?fbConnectPageUrl="+this.fbconnectURL,template:"default",realm:"default",savelogin:a.savelogin};dj.service.account.LoginService.loginUser(this._nodes.serviceUrls.loginServiceUrl,dojo.toJson(a),this.load,this.error,this)}}},submitFBForm:function(){if(!dojo.hasClass("fbconnect","disabled")){this.clearRedBoundaryFromFields("registrationForm");if(this.validateRegistrationForm()){dojo.byId(this._nodes.registerErrorUl).innerHTML="";dojo.addClass(dojo.byId("fbconnect"),"disabled");var a="profile.firstName="+this.oFirstName.value;a+="&profile.lastName="+this.oLastName.value;a+="&profile.emailAddress="+this.oEmailToRegister.value;a+="&profile.password="+this.oNewPassword.value;a+="&profile.passwordConfirmation="+this.oConfirmPassword.value;a+="&profile.uuid=true";a+="&profile.options.createCommunityProfile=";a+="&profile.options.featureEmailOptIn=true";a+="&profile.options.returnLink=http%3A%2F%2F"+document.domain;a+="&service.registrationType=FREE_REGISTRATION";a+="&profile.trackingCode=FACEBOOK_CONNECT";a+="&profile.newsletterOptIns=";a+="&service.templateCode="+this.PRODUCT_CD+"_FACEBOOK";a+="&profile.registrationSource=facebook";dj.service.account.RegistrationService.registerUser(this._nodes.serviceUrls.registrationServiceUrl,a,this.registrationLoad,this.registrationError,this)}}},registrationLoad:function(){var a={username:dj.lang.trim(this.oEmailToRegister.value),password:this.oNewPassword.value,url:encodeURIComponent(dj.context.account.testLogin)+"?fbConnectPageUrl="+this.fbconnectURL,template:"default",realm:"sbk-default",savelogin:"true"};dj.service.account.LoginService.loginUser(this._nodes.serviceUrls.loginServiceUrl,dojo.toJson(a),this.load,this.error,this)},registrationError:function(a){dojo.removeClass(dojo.byId("fbconnect"),"disabled");dojo.forEach(a,function(c,d){if(c.indexOf("-")>-1){c=c.replace(/-/g,"");a[d]=c}},this);this.showErrorMessage(this._nodes.registerErrorUl,a);this.connectForgotPasswordFromIframe();var b="";b=this.omniturePrefix+"_Auth_"+this.omniturePrefix+"/Barrons_Login_Page_Post_FBConnect EmailAddressexists Error Page";this.lifpOmnitureTracking([],"event12",b)},validateRegistrationForm:function(){var a=true;if(!this.chkEmpty(this.oFirstName.value)){this.errorArr.push(this._nodes.firstNameRequired);this.addErrorClass(this._nodes.firstName);a=false}if(!this.chkEmpty(this.oLastName.value)){this.errorArr.push(this._nodes.lastNameRequired);this.addErrorClass(this._nodes.lastName);a=false}var b=this.chkEmailAddress(this.oEmailToRegister.value);b||this.addErrorClass(this._nodes.emailToRegister);a=a?b:false;(b=this.validateNewPassword())||this.addErrorClass(this._nodes.newPassword);var c=this.validateConfirmPassword();c||this.addErrorClass(this._nodes.confirmPassword);a=a?b?c:false:false;if(b&&c)this.chkPasswordMatch(this.oNewPassword,this.oConfirmPassword,this._nodes.registerErrorUl)||(a=false);this.showErrorNClearArray();return a},showErrorNClearArray:function(){this.showErrorMessage(this._nodes.registerErrorUl,this.errorArr);this.errorArr=[]},getFBConnectURL:function(a){var b=a.substring(a.indexOf("?")+1,a.length);b=dojo.queryToObject(b);var c="";if(typeof b.url!="undefined")c=b.url.constructor.toString().indexOf("Array")==-1?b.url:b.url[1];else{a=a.substring(0,a.indexOf("?"));c=dj.context.facebook.commerceFBConnectURL+"?url="+encodeURIComponent(a);c=encodeURIComponent(c)}return c},clearRedBoundaryFromFields:function(a){if(typeof a=="undefined")a="loginForm";if(a=="registrationForm"){dojo.removeClass(dojo.byId(this._nodes.firstName),this._nodes.fieldErrorClass);dojo.removeClass(dojo.byId(this._nodes.lastName),this._nodes.fieldErrorClass);dojo.removeClass(dojo.byId(this._nodes.emailToRegister),this._nodes.fieldErrorClass);dojo.removeClass(dojo.byId(this._nodes.newPassword),this._nodes.fieldErrorClass);dojo.removeClass(dojo.byId(this._nodes.confirmPassword),this._nodes.fieldErrorClass)}else if(a=="loginForm"){dojo.removeClass(dojo.byId(this._nodes.userOrEmailInput),this._nodes.fieldErrorClass);dojo.removeClass(dojo.byId(this._nodes.password),this._nodes.fieldErrorClass)}}});dojo.provide("dj.widget.loader.ScrimLoaders");dojo.require("dj.widget.loader.LoaderInstanceFactory");dojo.require("dj.util.Url");dj.widget.loader.ScrimLoaders={init:function(){},callBackFromIframe:function(a){a=dojo.fromJson(a);if(typeof a!="undefined"){if(typeof a.logout!="undefined"){this.initIFrameForLogout();dojo.destroy(dojo.byId("moduleiframe"));dojo.destroy(dojo.byId("getGreyBckgroundCSSDiv"))}if(typeof a.refreshPageUrl!="undefined")window.location=decodeURIComponent(a.refreshPageUrl);if(typeof a.close!="undefined"){dojo.destroy(dojo.byId("moduleiframe"));dojo.destroy(dojo.byId("getGreyBckgroundCSSDiv"))}else parent.dojo.destroy("moduleiframe");if(typeof a.screenName!="undefined")if(a.screenName==="LoginVerifyEmail"){dojo.require("dj.widget.loader.LoginVerifyEmailLoader");dj.widget.loader.LoaderInstanceFactory.getLoginVerifyEmailLoaderInstance(a).initScrimFromIframe()}else if(a.screenName==="UnverifiedFreeReg"){dojo.require("dj.widget.loader.UnverifiedFreeRegLoader");dj.widget.loader.LoaderInstanceFactory.getUnverifiedFreeRegLoaderInstance(a).initScrimFromIframe()}else if(a.screenName==="FbLoginOrWSJPswd"){dojo.require("dj.widget.loader.FbLoginOrWSJPswdLoader");dj.widget.loader.LoaderInstanceFactory.getFbLoginOrWSJPswdLoaderInstance(a).initScrimFromIframe()}else if(a.screenName==="RegistrationConfirmation"){dojo.require("dj.widget.loader.ThankYouLoader");dj.widget.loader.LoaderInstanceFactory.getThankYouLoaderInstance(a).initScrimFromIframe()}else if(a.screenName==="ForgotUsername"){dojo.require("dj.widget.loader.ForgotUserOrPswdLoader");dj.widget.loader.LoaderInstanceFactory.getForgotUserOrPswdLoaderInstance(a).initScrimFromIframe()}else if(a.screenName==="ForgotPassword"){dojo.require("dj.widget.loader.ForgotPasswordLoader");dj.widget.loader.LoaderInstanceFactory.getForgotPasswordLoaderInstance(a).initScrimFromIframe()}else if(a.screenName==="Registration"){dojo.require("dj.widget.loader.RegistrationLoader");dj.widget.loader.LoaderInstanceFactory.getRegistrationLoaderInstance().initRegisterScrimInIframe()}else if(a.screenName==="FBInit"){dojo.require("dj.widget.loader.FBInitLoader");dj.widget.loader.LoaderInstanceFactory.getFBInitLoaderInstance(a.cfg).initScrimFromIframe()}else if(a.screenName==="Login"){dojo.require("dj.widget.loader.LoginLoader");dj.widget.loader.LoaderInstanceFactory.getLoginLoaderInstance(a.cfg).initLoginScrimInIframe()}else if(a.screenName==="FBConnected"){dojo.require("dj.widget.loader.FBConnectedLoader");dj.widget.loader.LoaderInstanceFactory.getFBConnectedLoaderInstance(a.cfg).initScrimFromIframe()}else{if(a.screenName==="UserWithoutEmail"){dojo.require("dj.widget.loader.UserWithourEmailConfirmationLoader");dj.widget.loader.LoaderInstanceFactory.getUserWithourEmailConfirmationLoaderInstance(a).initScrimFromIframe()}}else typeof a.confScreenName!="undefined"&&dj.widget.loader.LoaderInstanceFactory.getConfirmationLoaderInstance(a).initScrimFromIframe()}},callBackFromAdops:function(a){parent.dojo.destroy("moduleiframe");parent.dojo.destroy("overlayDiv");if(typeof a!="undefined")if(a=="subscribeFromOverlay")parent.location=dj.context.account.subscribeOfferFromLoginOverlay;else if(a=="subscribeFromPage")parent.location=dj.context.account.subscribeOfferFromLoginPage;else if(a=="subscribeFromAmazonPage")parent.location=dj.context.account.subscribeFromAmazonPage;else if(a=="subscribeFromFB")parent.location=dj.context.account.subscribeOfferFromFBOverlay;else if(a=="subscribeFromRegistration")parent.location=dj.context.account.subscribeOfferFromRegistrationOverlay;else if(a=="registerFromPage"||a=="registerFromOverlay"){dojo.require("dj.widget.loader.RegistrationLoader");dj.widget.loader.LoaderInstanceFactory.getRegistrationLoaderInstance().initRegisterScrimInIframe()}},chkIfHttpsDomain:function(){try{if(typeof parent.location.href!="undefined"&&parent.location.href.indexOf("https://")>-1)return true;return false}catch(a){return false}},initIFrameForLogout:function(){dojo.byId("unverifiedFreeReglogout")==null&&dojo.create("div",{id:"unverifiedFreeReglogout","class":"hidden"},dojo.body(),"last");var a={src:"http://"+document.domain+"/logout","class":"hidden"};setTimeout(this.isUserLoggedout,1E4);dj.util.Url.createSimpleIframe(a,"unverifiedFreeReglogout",this.testLogoutIframeLoaded,this)},testLogoutIframeLoaded:function(){this.userLoggedOut=true;dojo.destroy("unverifiedFreeReglogout")},isUserLoggedout:function(){this.userLoggedOut||window.console&&console.warn(" unverified free reg user couldn't be logged out ");this.userLoggedOut=false}};
dojo.provide("dj.module.facebook.connect");dojo.require("dj.lang");dojo.require("dj.util.Region");dj.module.facebook.connect={init:function(a,b){if(typeof FB==="object"&&FB.XFBML)FB.XFBML.parse();else if(typeof FB!=="object"&&typeof FB==="undefined"){window.fbAsyncInit=function(){FB.init({appId:dj.context.facebook.appId,status:true,cookie:false,xfbml:true,oauth:true});FB.getLoginStatus(function(){if(typeof a=="function")b?a.apply(b):a()})};(function(){var c=document.createElement("script"),d,e=dj.util.Region.getViewByRegion(),h={"na,us":"en_US","asia,indo":"id_ID","asia,jp":"ja_JP","asia,kr":"ko_KR","europe,tr":"tr_TR",germany:"de_DE","sa,br":"pt_BR"};if(typeof e!=="undefined"&&e)d=h[e];c.src=typeof d!=="undefined"&&d?document.location.protocol+"//connect.facebook.net/"+d+"/all.js":document.location.protocol+"//connect.facebook.net/en_US/all.js";c.type="text/javascript";c.charset="utf-8";c.async=true;d=dojo.byId("fb-root");if(null==d)d=dojo.create("div",{id:"fb-root",style:{display:"none"}},dojo.body());dojo.place(c,d)})()}},registerFBConnect:function(a){if(typeof a=="undefined")a=fbScrimCFG;FB.getLoginStatus(function(b){console.log("Facebook connect staus: "+b.status);if(b.status=="connected"){dojo.require("dj.widget.loader.FBLoginLoader");dojo.require("dj.widget.accountscrim.FBLogin");(new dj.widget.loader.FBLoginLoader(a)).init()}})},fbConnected:function(a){if(typeof a=="undefined")a=fbScrimCFG;dojo.require("dj.widget.loader.FBConnectedLoader");dojo.require("dj.widget.accountscrim.FBConnected");(new dj.widget.loader.FBConnectedLoader(a)).initScrim()},fireScrimPixel:function(a){if(typeof setMetaData!="undefined"){var b=dj.util.Tracking.omniture.getMetaData("pagename"),c=dj.util.Tracking.omniture.getMetaData("ctype"),d=dj.util.Tracking.omniture.getMetaData("section"),e=dj.util.Tracking.omniture.getMetaData("subsection"),h=dj.util.Tracking.omniture.getMetaData("caccess"),g=dj.util.Tracking.omniture.getMetaData("qsymbol"),f=dj.util.Tracking.omniture.getMetaData("basesection");setMetaData("pagename",a);setMetaData("ctype","marketing and support");setMetaData("section","WSJ_Customer Resources");setMetaData("subsection","WSJ_Customer Resources");setMetaData("caccess","free");setMetaData("basesection","WSJ_FBconnect");setMetaData("qsymbol",null);dj.util.Tracking.omniture.firePixel();setMetaData("pagename",b);setMetaData("ctype",c);setMetaData("section",d);setMetaData("subsection",e);setMetaData("caccess",h);setMetaData("basesection",f);setMetaData("qsymbol",g)}},login:function(a){typeof FB=="undefined"?this.init(dj.module.facebook.connect.processLogin):this.processLogin(a)},processLogin:function(a,b){if(a)this.afterLoginURL=a;typeof b!="undefined"?FB.login(b,{scope:"publish_stream,email,read_stream,publish_actions"}):FB.login(dj.module.facebook.connect.afterLogin,{scope:"publish_stream,email,read_stream,publish_actions"})},afterLogin:function(a){if(a.authResponse){dj.util.Cookie.setCookie("djfbsr_"+dj.context.facebook.appId,'{"accessToken":"'+a.authResponse.accessToken+'","userID":"'+a.authResponse.userID+'","expiresIn":"0","signedRequest":"'+a.authResponse.signedRequest+'"}');if(dj.module.facebook.connect.afterLoginURL)location.href=dj.context.facebook.commerceFBConnectURL+"?url="+encodeURIComponent(dj.module.facebook.connect.afterLoginURL);else{oldUrlParts=location.href.split("?");location.href=dj.context.facebook.commerceFBConnectURL+"?url="+encodeURIComponent(oldUrlParts[0])}}},addConnectClick:function(a,b){var c=this;dj.lang.addLiveEvent(a,"click",function(d){dojo.stopEvent(d);c.login(b)})},displayMessage:function(a){a.url="";a.message="";typeof a.callback=="function"&&a.callback()},logout:function(a){dj.util.Cookie.deleteCookie("djfbsr_"+
dj.context.facebook.appId);FB.logout(a)},getUserID:function(){return FB.getAuthResponse()?FB.getAuthResponse().userID:null},getFBUserInfo:function(){var a;FB.api("/me",function(b){a=b});return a},checkQueryString:function(a){fbScrimCFG=a;var b=dojo.queryToObject(window.location.search.slice(1));if(typeof b.fbresult!="undefined")if(b.fbresult=="add")typeof FB=="undefined"?dj.module.facebook.connect.init(dj.module.facebook.connect.fbConnected):dj.module.facebook.connect.fbConnected(a);else if(b.fbresult=="register")typeof FB=="undefined"?dj.module.facebook.connect.init(dj.module.facebook.connect.registerFBConnect):dj.module.facebook.connect.registerFBConnect(a)},publish:function(a,b){if(typeof FB!="undefined"){if(FB.getAuthResponse()){myObj=a;myObj.method="stream.publish";myObj.preview=1;myObj.display="popup";FB.ui(myObj,b)}}else{console.error("User is not logged in or FB in undefined");b(false)}},showModalScrim:function(){var a=dojo.byId("fbscrim"),b=dojo.byId("fbscrim_content");a.style.display="block";b.style.display="block";dojo.query("div#fbscrim_content a.closebtn").connect("onclick",dj.module.facebook.connect.hideModalScrim)},hideModalScrim:function(){var a=dojo.byId("fbscrim"),b=dojo.byId("fbscrim_content");a.style.display="none";b.style.display="none"},openModalMessage:function(){}};dojo.provide("dj.module.facebook.api");dojo.require("dj.module.facebook.connect");dj.module.facebook.api={modValue:"fbconnect_wsj",numOfWords:40,truncateWords:function(a,b){var c="",d=a.split(" ");if(d.length>b){c="...";d=d.slice(0,b)}return d.join(" ")+c},addtracking:function(a,b){parseUri=function(g){var f=parseUri.options;g=f.parser[f.strictMode?"strict":"loose"].exec(g);for(var n={},m=14;m--;)n[f.key[m]]=g[m]||"";n[f.q.name]={};n[f.key[12]].replace(f.q.parser,function(k,i,j){if(i)n[f.q.name][i]=j});return n};parseUri.options={strictMode:false,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}};var c=parseUri(a),d=c.protocol+"://"+c.host+c.path+"?",e=b?b:this.modValue,h;for(h in c.queryKey)if(String(h).toUpperCase()!="MOD")d+=h+"="+c.queryKey[h]+"&";d+="mod="+e;d+=c.anchor?"#"+c.anchor:"";return d},postAnswer:function(a){if(!(a.question&&a.answer&&a.questionPermalink))return false;var b=this.truncateWords(a.answer,this.numOfWords),c={name:a.question,href:this.addtracking(a.questionPermalink),caption:"WSJ.com"},d=[{text:"Answer",href:this.addtracking(a.questionPermalink)}];this.sendStream(b,c,d,a.callbackFn,a.callbackParams)},postArticleComment:function(a){if(!(a.comment&&a.commentPermalink))return false;JSON.stringify=function(g){return dojo.toJson(g)};var b=typeof AT_VARS!="undefined"?AT_VARS.articleUrl:a.commentPermalink,c=typeof AT_VARS!="undefined"?AT_VARS.seoHeadline:"";if(typeof c=="undefined")c=AT_VARS.articleHeadline;var d=typeof AT_VARS!="undefined"?AT_VARS.imgSizeA:"http://s.wsj.net/img/WSJ_profile_lg.gif",e=typeof AT_VARS!="undefined"&&typeof AT_VARS.bodyText!="undefined"?AT_VARS.bodyText.replace(/\+/g," "):"",h=this.truncateWords(a.comment,this.numOfWords);c={name:c,href:this.addtracking(b),description:unescape(e),caption:"WSJ.com"};if(d!=null)c.media=[{type:"image",src:d,href:this.addtracking(b)}];b=[{text:"Read the Article",href:this.addtracking(a.commentPermalink)}];this.sendStream(h,c,b,a.callbackFn,a.callbackParams)},postCreateGroup:function(a){if(!(a.groupName&&a.groupDescription&&a.groupPermalink))return false;var b={name:a.groupName,href:this.addtracking(a.groupPermalink),description:a.groupDescription,caption:"WSJ.com"},c=[{text:"Join this Journal Group",href:this.addtracking(a.groupPermalink)}];this.sendStream("",b,c,a.callbackFn,a.callbackParams)},postJoinGroup:function(a){if(!(a.groupName&&a.groupDescription&&a.groupPermalink))return false;var b={name:a.groupName,href:this.addtracking(a.groupPermalink),description:a.groupDescription,caption:"WSJ.com"},c=[{text:"Join this Journal Group",href:this.addtracking(a.groupPermalink)}];this.sendStream("",b,c,a.callbackFn,a.callbackParams)},postPollVote:function(a){if(!a)return null;params=dojo.fromJson(a);a="";JSON.stringify=function(c){return dojo.toJson(c)};for(var b=0;b<params.options.length;b++)a+=b+1+") "+params.options[b].value+" ";a={name:params.question,href:this.addtracking(window.location),description:a,media:[{type:"image",src:"http://s.wsj.net/img/WSJ_profile_lg.gif",href:this.addtracking(window.location)}]};b=[{text:"Related Article",href:this.addtracking(params.poll_meta.urlSrc)}];if(params.poll_meta.communityURLSrc!="")b=[{text:"Journal Community Group",href:this.addtracking(params.poll_meta.communityURLSrc)}];this.sendStream("voted on a Wall Street Journal poll",a,b,function(){},null)},postQuestion:function(a){if(!(a.question&&a.category&&a.questionPermalink))return false;var b=this.truncateWords(a.question,this.numOfWords),c={name:a.category,href:this.addtracking(a.questionPermalink),caption:"WSJ.com"},d=[{text:"Answer",href:this.addtracking(a.questionPermalink)}];this.sendStream(b,c,d,a.callbackFn,a.callbackParams)},postTopic:function(a){if(!(a.topic&&a.topicPermalink&&a.description))return false;var b=this.truncateWords(a.topic,this.numOfWords),c={name:a.topic,href:this.addtracking(a.topicPermalink),description:a.description,caption:"WSJ.com"},d=[{text:"Join the discussion",href:this.addtracking(a.topicPermalink)}];this.sendStream(b,c,d,a.callbackFn,a.callbackParams)},postTopicComment:function(a){if(!(a.comment&&a.commentPermalink&&a.topicName&&a.topicDescription&&a.topicPermalink))return false;var b=this.truncateWords(a.comment,this.numOfWords),c={name:a.topicName,href:this.addtracking(a.topicPermalink),description:a.topicDescription,caption:"WSJ.com"},d=[{text:"Join this discussion",href:this.addtracking(a.commentPermalink)}];this.sendStream(b,c,d,a.callbackFn,a.callbackParams)},sendStream:function(a,b,c,d,e){var h=-1;FB.getLoginStatus(function(g){g.session?dj.module.facebook.connect.publish({message:a,attachment:b,action_links:c},function(f){if(f){h=f.post_id;dj.module.facebook.api.omnitureEventCall("event56");d?d(e,dj.module.facebook.connect.getUserID(),h):console.log("success: "+h)}}):dj.module.facebook.connect.processLogin(document.location,dojo.hitch(this,dj.module.facebook.api.sendStream,a,b,c,d,e))});return h},omnitureEventCall:function(){if(typeof s!="undefined"){s.linkTrackVars="events";s.linkTrackEvents="event56";s.events="event56";s.tl(this,"o","fb_activity");s.linkTrackVars="None";s.linkTrackEvents="None"}}};/*global document, dj, dojo, dojox, dijit, window, console, unescape, escape*/

dojo.provide("dj.module.header2012.editionSwitcher");

/* Documentation Describing code
 * Make sure this always passes jsHint!
 * Call edition switcher with param override like this:
 * dj.module.initionSwitcher.init({"initial":"and not useful"})
 */

(function() {
  dj.module.header2012.editionSwitcher = {
    init: function(cfg) {

      var defaultConfig = {
        editionTriggerId : "editionPopTrigger",
        editionDDId      : "editionDDTrigger",
        regionCodeToEdition :
            { "na,us"      : "usEdition", 
              "asia"       : "AsiaEdition", 
              "asia,indo"  : "indonesiaEdition", 
              "asia,cn"    : "simChiEdition",
              // "asia,cn"    : "tradChiEdition",  // TODO: fix datamodel issue here
              "asia,kr"    : "koreaEdition",
              "asia,india" : "indiaEdition",
              "asia,jp" : "jpnEdition",
              "europe"     : "europeEdition",
              "europe,tr"  : "turkeyEdition",
              "germany"  : "germanyEdition",
              "na,lat"     : "latinEdition",
              "na,br"      : "brasilEdition"
            }
      };

      this.dropdownCollapsed = true;
      dojo.mixin(defaultConfig, cfg);
      this.config = defaultConfig;
      this._load();
    },

    _load: function() {
      var ddTrigger   = dojo.byId(this.config.editionTriggerId),
          ddContainer = dojo.byId(this.config.editionDDId);

      this.addClickEvents(ddTrigger, ddContainer);
      this.highlightEditionName();
    },

    /**
     * Retrieves weather XHTML for ajax requests
     *
     * @param {String}
     *          aParam, an important param
     */
    addClickEvents: function(ddTrigger, ddContainer) {
      var self = this;

      // hides/shows region dropdown
      dojo.connect(ddTrigger, "click", this, function(ev) {
        dojo.stopEvent(ev);

        if (dojo.hasClass(ddContainer, "popOpen")) {
          dojo.removeClass(ddContainer, "popOpen");
          dojo.addClass(ddContainer, "popClosed");
          self.dropdownCollapsed = true;
        } else {
          dojo.addClass(ddContainer, "popOpen");
          dojo.removeClass(ddContainer, "popClosed");
          self.dropdownCollapsed = false;
        }
      });

      // close the dropdown when a click happens outside of it
      dojo.connect(document, "onclick", function(event) {
        if (self.dropdownCollapsed === false) {
          var isClickInContainer = dj.util.Element.contains(ddContainer, event.clientX, event.clientY);

          if (isClickInContainer === false) {
            dojo.removeClass(ddContainer, "popOpen");
            dojo.addClass(ddContainer, "popClosed");
            self.dropdownCollapsed = true;
          }
        }
      });
    },

    highlightEditionName: function() {
      var region        = dj.util.Region.getViewByRegion(),
          mappedRegion  = "#" + this.config.regionCodeToEdition[region] + " a",
          regionEl      = dojo.query(mappedRegion)[0];
      dojo.addClass(regionEl, "selected");
    }
  };
}());
/*global document, dj, dojo, dojox, dijit, window, console, unescape, escape*/

dojo.provide("dj.module.header2012.messageCenter");

/* Documentation Describing code
 * Passes jsHint!
 * Call edition switcher with param override like this:
 */

(function () {
  dj.module.header2012.messageCenter = {
    init: function (cfg) {
      var defaultConfig = {
        messageSvcUrl : "/community/integration/userinfo.html"
      };

      dojo.mixin(defaultConfig, cfg);
      this.config = defaultConfig;
      this._load();
    },

    _load: function () {
      var count = dj.util.Cookie.getCookie("msgCount");

      if (count=== null) {
        this.getMessages(this.config.messageSvcUrl, "processMessages");
      } else {
        this.displayMessageCount(count);
      }
    },

    processMessages: function (messages) {
      var count = messages.MessagesCount;

      this.setMessageCookie("msgCount", count);
      this.displayMessageCount(count);
    },

    getMessages: function (url, functionName) {
      var self = this;

      return dojo.xhrGet({
        url      : self.config.messageSvcUrl,
        handleAs : "json",
        load     : function (response, ioArgs) {
                     self.processMessages(response);
        },
        error    : function (response, ioArgs) {
          console.error("HTTP status code: ", ioArgs.xhr.status);
          return response;
        }
      });
    },

    setMessageCookie: function (key, value) {
      dj.util.Cookie.setCookie(key, value, (5 / 24 / 60));
    },

    displayMessageCount: function (count) {
      if (count > 0) {
        var messages = dojo.byId("messageCount");
        dojo.removeClass(dojo.byId("showMessages"), "hidden");
        messages.innerHTML = "(" + count + ")";
      }
    }
  };
}());
/*global document, dj, dojo, FB, console */

dojo.provide("dj.module.header2012.userDetails");
dojo.require("dj.module.facebook.connect");

/*
 * Enables login info in Header
 * Make sure this always passes jsHint!
 */

(function() {
  dj.module.header2012.userDetails = {
    init: function(cfg) {

      var defaultConfig = {
        loginDetailsTriggerId   : "userName",
        loginDetailsContainerId : "loginDetailsDDContainer",
        myJournalTriggerId      : "myJournalTrigger",
        myJournalContainerId    : "myJournalContainer",
        avatarId                : "communityAvatar",
        avatarUrl               : "http://cs.wsj.net/community/content/images/misc/members/defaultuser.50x50.png",
        enableFacebookConnect   : true,
        fbConnectAsId           : "facebookConnectedAs",
        fbConnectAsPopup        : "facebookConnectPopup",
        custChatUrl				: dj.context.core.custChatUrl?dj.context.core.custChatUrl:"https://customercenter.wsj.com/livechat/chat?product=WSJ"
      };

      this.loginDropdownCollapsed     = true;
      this.myjournalDropdownCollapsed = true;

      dojo.mixin(defaultConfig, cfg);
      this.config = defaultConfig;
      var self = this;

      // only load user info if logged in
      dj.util.User.isLoggedIn(function (isLoggedIn) {
        if (isLoggedIn) {
          self._load();
        }
      });
      this.showChatWin();//This is outside logged in so as to initialize the chat popup for us footer
    },

    /**
     * Initial lookups and basic logic goes here
     */
    _load: function() {
      var loginDetailsTrigger   = dojo.byId(this.config.loginDetailsTriggerId),
          loginDetailsContainer = dojo.byId(this.config.loginDetailsContainerId),
          myJournalTrigger      = dojo.byId(this.config.myJournalTriggerId),
          myJournalContainer    = dojo.byId(this.config.myJournalContainerId);

      this.addClickEvents(loginDetailsTrigger, loginDetailsContainer, this.loginDropdownCollapsed);
      this.addClickEvents(myJournalTrigger, myJournalContainer, this.myjournalDropdownCollapsed);

      this.showUserName();
    },

    /**
     * Retrieves weather XHTML for ajax requests
     *
     */
    addClickEvents: function(ddTrigger, ddContainer, collapsed) {
      var self = this;

      dojo.connect(ddTrigger, "click", this, function(ev) {
        dojo.stopEvent(ev);

        if (dojo.hasClass(ddContainer, "popOpen")) {
          dojo.removeClass(ddContainer, "popOpen");
          dojo.addClass(ddContainer, "popClosed");
          collapsed = true;
        } else {
          dojo.addClass(ddContainer, "popOpen");
          dojo.removeClass(ddContainer, "popClosed");
          collapsed = false;

     //     self.setCommunityAvatar();  // lazyload community avatar

          if (self.config.enableFacebookConnect) {
            self.getFacebookStatus();
          }
        }
      });

      // close the dropdown when a click happens outside of it
      dojo.connect(document, "onclick", function(event) {
        if (collapsed === false) {
          var isClickInContainer = dj.util.Element.contains(ddContainer, event.clientX, event.clientY);

          if (isClickInContainer === false) {
            dojo.removeClass(ddContainer, "popOpen");
            dojo.addClass(ddContainer, "popClosed");
            self.collapsed = true;
          }
        }
      });
    },

    setCommunityAvatar: function() {
      var el = dojo.byId(this.config.avatarId);

      if (el.src.length > 0) {
        el.src = this.config.avatarUrl;
      }
    },

    getFacebookStatus: function () {
      if (FB.getUserID() === 0) {
        this.loginFacebookConnect();
      } else {
        this.showFacebookConnectedAs();
      }
    },

    loginFacebookConnect: function () {
      var el = dojo.byId(this.config.fbConnectAsPopup);
      dojo.removeClass(el, "hidden");

      dojo.connect(el, "onclick", function() {
        var self = this;

        FB.login(function(response) {
          if (response.authResponse) {
            dojo.addClass(el, "hidden");
            self.showFaceBookConnectedAs();
          } else {
            console.log('User login not completed.');
          }
        });
      });
    },

    showFacebookConnectedAs: function () {
      var el = dojo.byId(this.config.fbConnectAsId);
      dojo.removeClass(el, "hidden");

      FB.api('/me', function(response) {
        el.innerHTML = "<small>Connected as</small>" + response.name;
      });
    },

    showUserName: function () {
      dojo.removeClass(dojo.query(".uNav")[0], "hidden");
      dj.util.User.renderFirstName("userName");
      var uNamePlaceholder = dojo.byId("userName").innerHTML;
      if (uNamePlaceholder && uNamePlaceholder!=='') {
        uNamePlaceholder += "'s Journal";        
      } else {
        dj.util.User.renderCallsign("userName");
        var uNamePlaceholder = dojo.byId("userName").innerHTML;
        uNamePlaceholder += "'s Journal";      
        }
      dojo.byId("userName").innerHTML = uNamePlaceholder;
      dojo.place("<span class='sym'></span>", dojo.byId("userName"),"last");
    },
    
    showChatWin: function(){
    	var self = this;
    	self.custChatWin=null;
    	dojo.forEach(
    	  dojo.query("a.custChatLink"),
    	  function(tag) {
	    	    dojo.connect(tag,"click", this, function(ev){
	    	    	dojo.stopEvent(ev);
		    	    if(self.custChatWin==undefined||self.custChatWin==null||self.custChatWin.closed){
		    	    	self.custChatWin=window.open(self.config.custChatUrl, "DowJones_Live_Chat","width=510,height=420,location=no,menubar=no,status=no,toolbar=no,scrollbars=no,resizable=no");
		    	    }else{
		    	    	self.custChatWin.focus();
		    	    }
	    	   });
    	  }
    	);
    }
    
  };
}());
/*global document, dj, dojo, dojox, dijit, window, console, unescape, escape*/

 dojo.provide("dj.module.header2012.localWeather");
 dojo.require("dj.util.Cookie");
 dojo.require("dj.util.User");
 dojo.require("dj.widget.fragmentloader.FragmentLoader");

 /* Local Weather:
  *   This module sets the user's local weather in the WSJ header.  Currently
  *   there are strict xhtml dependencies to the wsj header structure.  This
  *   code will update several cookies and the pzn service to store the
  *   weather data.  The weather data will be populated next to the timestamp.
  *
  * TODO: Move the utility functions at the bottom into the utilities bundle.
  *
  * Testing Commands: (use this to clear the cookie cache)
  *   dj.util.Cookie.deleteGroupCookie("DJCOOKIE", "weatherUser");
  *   dj.util.Cookie.deleteGroupCookie("DJCOOKIE", "weatherCode");
  *
  *   Config with defaultLocation overridden:
  *   dj.module.header.localWeather.init({defaultLocation:"08054"});
  */

 (function() {

   dj.module.header2012.localWeather = {
     init: function(cfg) {

       var defaultConfig = {
         defaultLocation   : "10005",
         ttl               : 10,
         populateEl        : "weatherContent",
         fragmentPage      : "0_0_WC_HeaderWeather",
         iframeId          : "iframeweatherDetails",
         iframeParam       : "location",
         locationNameId    : "locationName",
         pznUrl            : "/pznusersvc/update/user/profile",
         setPznWeatherUrl  : "/pznusersvc/view/user/profile?profileType=weatherCode",
         redirectUrl       : "http://commerce.wsj.com/auth/login",
         locationSavedTxt  : "Default location saved"
       };

       dojo.mixin(defaultConfig, cfg);
       this.config = defaultConfig;
       this.cookieWeatherCode = this.getCookie("weatherCode");

       // limiting the header weather to US region
       if (dj.util.Region.getViewByRegion() === "na,us") {
         this._load();
       }
     },

     /**
      * Loads the weather data in the WSJ header.  Weather data can be pulled
      * from cookie data or the PZN service, assuming the user is logged in.
      * Load essentially retrieves the weather data and sets appropriate cookie
      * data to optimize future requests.
      *
      * TODO: Update code to disallow non reg/freereg users
      *
      */
     _load: function() {
       var that = this;
       dj.util.User.isLoggedIn(function(isLoggedIn) {
         if (isLoggedIn) {
           dj.util.User.getUserId(function(userId) {
             var wc = that.getCookie("weatherCode") ? that.getCookie("weatherCode") : that.config.defaultLocation;

             if (that.getCookie("weatherUser") === userId) { // confirm correct cookie set for current user
               that.getHTML(wc);                             // pull html based on cookie value
             } else {                                        // cookie data present from other user
               that.clearWeatherCookies();                   // clear cookies
               that.getPznLocalWeather(userId);              // pull custom weather setting with html
             }
           });
         } else {
           that.getHTML(that.config.defaultLocation);
           that.clearWeatherCookies();                       // ensures logged in user does not get previous cookie code value
         }
       });
     },

     /**
      * Retrieves weather XHTML for ajax requests
      *
      * @param {String}
      *          location, location code (zip code).  Service requires a
      *          location to pull weather data from.
      */
     getHTML: function(location) {
       var dao              = new dj.util.user.EnvironmentDao(dj.util.Region, dj.util.User),
           envDef           = dao.getEnvironment(),
           toolsFragment    = this.config.fragmentPage,
           initialContainer = this.config.populateEl;
       var cfg = {
         isLoadCss      : false,
         isLoadHtml     : true,
         isLoadJs       : false,
         isLoadInlineJs : false,
         isAnimated     : false,
         TTL            : this.config.ttl
       };
       var loader = new dj.widget.fragmentloader.FragmentLoader(envDef, toolsFragment, location+'-v'+Math.floor(Math.random()*90000)+10000, initialContainer, cfg);
       loader.load();
     },

     /**
      * Wrapper to get DJ cookie data
      *
      * @param {String}
      *          name, name of sub-cookie value to be retrieved
      */
     getCookie: function(name) {
       return dj.util.Cookie.getGroupCookie("DJCOOKIE", name);
     },

     /**
      * Wrapper to set DJ cookie data
      *
      * @param {String}
      *          name, name of sub-cookie value to be set
      * @param {String}
      *          value, value of sub-cookie to be set
      */
     setCookie: function(name, value) {
       dj.util.Cookie.setGroupCookie("DJCOOKIE", name, value, 365);
     },

     /**
      * This method is specifically for setting the User's local weather on the Accuweather
      * detail page (0_0_WP_AccuWeather_Details).  On that page exists an iFrame to accuweather
      * that has the location code stored in the iFrame src attribute, named "location".  We
      * then update the pzn service with the code (if the user is logged in), delete existing
      * weather cookies and re-run the weather initialization.
      *
      * @param {String}
      *          locationEl, ID of the iframe you are targeting
      */
     setDefaultLocation: function(locationId) {
       var that = this,
           locationEl   = dojo.byId(locationId),
           iFrameParam  =  that.getIframeParam(this.config.iframeId, this.config.iframeParam),
           locationCode = iFrameParam !== "" ? iFrameParam : this.config.defaultLocation;

       dojo.byId(this.config.locationNameId).innerHTML = unescape(this.getIframeParam(that.config.iframeId, "name"));

       dj.util.User.isLoggedIn(function(isLoggedIn) {
         if (isLoggedIn) {
           if (locationCode !== that.getCookie("weatherCode")) {
             dojo.connect(locationEl, "click", function(ev) {
               dojo.stopEvent(ev);
               that.clearWeatherCookies();
               that.setPznLocalWeather(locationCode);
               that.getHTML(locationCode);
               that.setCookie("weatherCode", locationCode);
               dojo.addClass(locationEl, "hidden");
               dojo.place("<span style='font-size:1.1em'>"+that.config.locationSavedTxt+"</span>", locationEl, "before");
             });
           } else {
             dojo.addClass(locationEl, "hidden");
           }
         } else {
           dojo.connect(locationEl, "click", function(ev) {
             dojo.stopEvent(ev);
             window.location = that.getCommerceRedirectUrl();
           });
         }
       });
     },

     /**
      * Asynchronous request to pull in weather data from pzn service.  User must be
      * logged in and have populated their pzn settings with their local weather.  PZN
      * service knows if the user is logged in, so there is no need to pass that status.
      */
     getPznLocalWeather: function(userId) {
       var that = this;
       dojo.xhrGet( {
        url: that.config.setPznWeatherUrl,
        headers: {
          Accept: 'application/json'
        },
        handleAs: "json",
        load: function(response, ioArgs) {
          var requestStatus = ioArgs.xhr.getResponseHeader('Status');
           if ( 200 !== ioArgs.xhr.status ) {
            console.error("Error message: Service is not working with Error Code: " + ioArgs.xhr.status);
            return;
          }
          var profileData = response.User.profileData[0];

          if (profileData !== undefined) {
            that.setCookie("weatherUser", userId);                             // set proper user cookie
            that.setCookie("weatherCode", profileData.weatherCode);            // set proper location code
            that.getHTML(profileData.weatherCode);
          } else {
            that.getHTML(that.config.defaultLocation);
          }
        },
        error: function(response, ioArgs) {
          console.error("HTTP status code: ", ioArgs.xhr.status);
          return response;
        }
       });
     },

     /**
      * Sets a Reg/FreeReg user's local weather code (most often a zip code)
      *
      * @param {String}
      *          code, local weather code (zip code)
      */
     setPznLocalWeather: function(code) {
       var data = {"profileType":"weatherCode","profileName":"weatherCode","params":[{"weatherCode": code}]};
       var xhrArgs = {
         url         : this.config.pznUrl,
         postData    : dojo.toJson(data),
         handleAs    : "json",
         contentType : "application/json",
         accept      : "application/json",
         load        : function(data){},
         error       : function(error){}
       };
       var deferred = dojo.xhrPost(xhrArgs);
     },

     /**
      * Delete DJCOOKIE group cookie related to custom weather settings
      */
     clearWeatherCookies: function() {
       dj.util.Cookie.deleteGroupCookie("DJCOOKIE", "weatherUser");
       dj.util.Cookie.deleteGroupCookie("DJCOOKIE", "weatherCode");
     },

     /**
      * Returns a url to commerce login with the current page as the redirect (after success)
      *
      * TODO: detect whether a "?" or "&" should be passed
      * @param {String}
      *          urll, param to point to commerce login page, not required
      */
     getCommerceRedirectUrl: function(urll) {
       var url = urll || this.config.redirectUrl;
       return url+"&url="+escape(window.location);
     },

     getIframeParam: function(iframeId, name) {
       var iframeSrc = dojo.byId(iframeId).src,
           location  = name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]"),
           regexS    = "[\\?&]" + location + "=([^&#]*)",
           regex     = new RegExp( regexS ),
           results   = regex.exec(iframeSrc);

       if (results === null) {
         return "";
       } else {
         return results[1];
       }
     }
   };
 }());
/*global document, dj, dojo, dojox, dijit, window, console, unescape, escape*/

dojo.provide("dj.module.header2012.sectionMenu");
dojo.require("dj.widget.panel.LiveModalPanel");
dojo.require("dj.util.Element");
dojo.require("dj.lang");
dojo.require("dj.widget.panel.SelectDropdownPanel");

(function () {
  dj.module.header2012.sectionMenu = {
    init: function () {
      var isInitDone = false;
      this.delayedMouseOver("._exp", function (el) {
        if (!isInitDone) {
          this.initializeHeaderPanels();
          this.setEvents();
          isInitDone = true;
        }
        this.initShowData(el);
      }, 250);

      this.fadeInArrows();
    },

    /**
     * Initialize Panels object for menu dropdown
     *
     */
    initializeHeaderPanels: function () {
      var headerMenu = new dj.widget.panel.LiveModalPanel(
      {
        container : ".linklist_dropdown .wsjmn_dropdown_container",
        containerInd : ".linklist_dropdown .wsjmn_dropdown_container .mnExpand",
        dropdownContent : ".wsjmn_dropdownContent",
        actionEvent : "click",
        stateContainer : ".wsjmn_dropdownTree",
        stateCollapsed : "wsjmn_ddState-collapsed",
        stateExpanded : "wsjmn_ddState-expanded",
        navContainer : ".pmMainNav",
        stateHover : "mndd_ddState-hover",
        queryUpClass : "wsjmn_dropdownTree",
        addMouseEvents : false
      });
    },

    initShowData: function (el) {
      var svcUrl = this.getDropdownIndex(el);
      var ddi = dj.util.Element.getDataset(el).dropdownindex;
      var ddiEl = dojo.byId(ddi+"_content");

      this.showData(svcUrl, ddiEl, el);
    },

    showData: function (svcUrl, ddiEl, dataEl) {
      var that = this;
      var initDelay = false;

      initDelay = setTimeout(function () {
        // multiple requests aren't initiated by the click and mouseover events
        if ((dojo.hasClassName(dataEl, "_data") === false)) {
          dojo.addClass(dataEl, '_data');
          that.getHTML(svcUrl, ddiEl, dataEl);  // replaces spinner html with menu content
        }
      });
    },

    getDropdownIndex: function (el) {
      var sEl = dj.util.Element.getDataset(el);
      var svcEl = dj.util.Element.getDataset(dojo.byId(sEl.dropdownindex));
      return svcEl.panelServiceUri;
    },

    setIframeShimHeights: function (el) {
      var elData = dj.util.Element.getDataset(el).dropdownindex;
      var elNum = elData.match(/(\d.*)/)[0];
      var iFrameId = "wsjmn_dropdown_iframe"+elNum;
      var dropdownId = "wsjmn_dropdown"+elNum+"_content";
      var content = dojo.byId(dropdownId);
      var iFrameEl = dojo.byId(iFrameId);

      for (var i=0;i<=content.length - 1;i++) {
        try {
          iFrameEl.offsetHeight = dojo.byId("wsjmn_dropdown_content"+elNum).offsetHeight;
        }
          catch(err) {}
        }

      try {
        iFrameEl.offsetHeight = dojo.byId("wsjmn_dropdown_content"+elNum).offsetHeight;
      }
        catch(e) {}
    },	

    setEvents: function () {
      var that = this;

      dj.lang.addLiveEvent("._exp", "mousedown", function (ev) {
        var el = (ev.target || ev.srcElement);
        that.initShowData(el);
      });

      dj.lang.addLiveEvent(".subExpand", "mousedown", function (ev) {
        var el = (ev.target || ev.srcElement);
        that.subFlyoutToggle("1-3");
      });
    },

    delayedMouseOver: function (containerClass, func, time) {
      var doInit = false, initDelay;
      var that = this;

      var outEvent = dj.lang.addLiveEvent(containerClass, "mouseout", function () { doInit = false; });
      var overEvent = dj.lang.addLiveEvent(containerClass, "mouseover", function (ev) {
      if (initDelay) { clearTimeout(initDelay); }
        doInit = true;
        var el = this;
        initDelay = setTimeout(function () {
          if (!doInit) { 
            return; 
          }

          func.call(that, el);
        }, time);
      });
    },

    getHTML: function (location, el, dataEl) {
      var that = this;

      dojo.xhrGet( {
         url: location,
         headers: {
           Accept: 'application/html'
         },
         handleAs: "text",
         load: function (response, ioArgs) {
           var requestStatus = ioArgs.xhr.getResponseHeader('Status');
           el.innerHTML = response;
           // when the comment below is matched in the request a special panel is initialized 
           if (response.match(/<!--BusinessDropdown-->/)) {
             var panel = new dj.widget.panel.SelectDropdownPanel('subIndDropdown');
           }
         },
         error: function (response, ioArgs) {
           console.error("HTTP status code: ", ioArgs.xhr.status);
           return response;
         }
      });
    },

    subFlyoutToggle: function (n) {
      // Get the dropdown
      var el = dojo.byId("wsjsub_flyout" + n);

      if (el === null) {
        return false;
      }

      var currentClass = el.className;
      // Toggle between the classes mn_ddState-collapsed and mn_ddState-expanded
      if(currentClass.indexOf("wsjsub_ddState-collapsed") !== -1) {
        el.className = currentClass.replace( /wsjsub_ddState-collapsed/, "wsjsub_ddState-expanded");
      } 
      else {
        el.className = currentClass.replace(/wsjsub_ddState-expanded/, "wsjsub_ddState-collapsed");
      }
      return false;	
    },

    fadeInArrows: function () {
      var arrowNodes = dojo.query(".mnExpand._exp");

      for (var i=0;i<=arrowNodes.length - 1;i++) {
        dojo.fadeIn({
          node: arrowNodes[i],
          duration: (1.0 * 1000)
        }).play();
      }
    }
  };
}());
dojo.provide("dj.module.header2012.nonreno");
dojo.require("dj.widget.fragmentloader.FragmentLoader");
dojo.require("dj.util.Region");
dojo.require("dj.util.User");
dojo.require("dj.util.user.EnvironmentDao");
dojo.require("dj.widget.ad.AdManager");

// the files below are provided for the pro-hack
dojo.provide("dj.widget.fragmentloader.Fragment");
dojo.provide("dj.widget.fragmentloader.dao.FileServiceDao");
dojo.provide("dj.widget.fragmentloader.renderer.FileRenderer");
dojo.provide("dj.util.io.script");
dojo.provide("dj.context.core");

dj.module.header2012.nonreno = {
  _isDone: false,

  init: function(cfg) {
    // Ensuring there's only one instance of the header
    if (this._isDone) {
      console.warn("header2012.nonreno has already been initialized");
      return;
    }

    this._isDone = true;
    this.header = new dj.module.header2012._NonRenoLoader(cfg);
    return this.header.load();
  }
};

/**
 * Context-variables used (if set):
 *   dj.context.header.version - for cache-buster
 *   dj.context.page.id - to set the current page-id
 */
dojo.declare("dj.module.header2012._NonRenoLoader", [], {
  constructor: function(config) {
    this.cfg = dojo.delegate({
      userEnv: null,
      version: 0,
      html: {},
      domNodeId: "headerWrapper",
      headerPageId: "0_0_WG_Header2012",
      overrideUserEnvStr: null,
      isLoadInlineJs: true
    }, config);

    this.userEnv = (this.cfg.userEnv !== null)? this.cfg.userEnv : this._getUserEnv();
    this.version = this._getVersion();

    this.cfg.html.chips = [this._getPageId()];
    this.loader = new dj.widget.fragmentloader.FragmentLoader(
        this.userEnv, this.cfg.headerPageId, this.version, this.cfg.domNodeId, this.cfg);

    this._connectToLoaderEvents();
  },

  load: function() {
    var doLoad = dojo.hitch(this.loader, "load");
    return dojo.when(this._standaloneCssForProHack(), doLoad, doLoad);
  },

  runHeaderExec: function() {
    var that = this;
    dojo.when(this.userEnv, dojo.hitch(this, function(env) {
      try {
        var userEnvStr = (this.cfg.overrideUserEnvStr !== null)? this.cfg.overrideUserEnvStr : env.toString();
        console.log("env.subType " + env.subType + " userEnvStr "+userEnvStr);
        // Run all of the header-related JSEXECs
        if (dojo.getObject("dj.module.header2012.exec") &&
            (typeof dj.module.header2012.exec[userEnvStr] === "object")) {
           if(env.subType === "PUB"){
             console.log("that.version "+ that._getVersion());
             dj.module.header2012.exec[userEnvStr].init({version:that._getVersion()});
           }else{
             dj.module.header2012.exec[userEnvStr].init();
           }
        } else {
          console.error("dj.module.header2012.exec is undefined for env: " + userEnvStr);
        }

        // Rneder the ad for a non-subscriber
        if (env.subType === "PUB") {
          this._renderAd();
        }

        // Run a callback the module-user specified
        if (typeof this.cfg.onJsExec === "function") {
          this.cfg.onJsExec.call(null, env);
        }
      } catch (e) {
        console.error("header2012.nonreno: " + e);
      }
    }));
  },

  _connectToLoaderEvents: function() {
    if (!this.cfg.isLoadInlineJs) { dojo.connect(this.loader, "onJsLoad", dojo.hitch(this, "runHeaderExec")); }
    if (this.cfg.onJsLoad) { dojo.connect(this.loader, "onJsLoad", this.cfg.onJsLoad); }
    if (this.cfg.onHtmlLoad) { dojo.connect(this.loader, "onHtmlLoad", this.cfg.onHtmlLoad); }
    if (this.cfg.onCssLoad) { dojo.connect(this.loader, "onCssLoad", this.cfg.onCssLoad); }
  },

  _getUserEnv: function() {
    var env = this.cfg.userEnv;

    if (null === env) {
      var dao = new dj.util.user.EnvironmentDao(
          dj.util.Region, dj.util.User);
      env = dao.getEnvironment();
    }

    return env;
  },

  /**
   * Cache is a combination of the following:
   *   - dj.context.header.version (if set)
   *   - version provided by the user
   *
   * If we're in debugMode (chip or query param),
   * then the current time will be used.
   */
  _getVersion: function() {
    var d = new Date(), v = "0",
        ctxVersion = (dojo.getObject("dj.context.header.version") || "v");

    v = [ctxVersion, this.cfg.version].join("");

    if (dojo.doc.location.toString().indexOf("debugMode") > -1) {
      v = d.getTime();
    }

    return v;
  },

  _standaloneCssForProHack: function() {
    return dojo.when(this.userEnv, dojo.hitch(this, function(env) {
      if ((env.product === "PRO") && !this.cfg.isLoadCss) {
        var frag = new dj.widget.fragmentloader.Fragment("pmStandalone");
        frag.cssFiles = [];
        frag.cssFiles.push({absolutePath: "/css/pmStandalone.css"});
        if (dojo.isIE < 7) { frag.cssFiles.push({absolutePath: "/css/pmStandalone-ie6.css"}); }
        if (dojo.isIE === 7) { frag.cssFiles.push({absolutePath: "/css/pmStandalone-ie7.css"}); }
        if (dojo.isIE === 8) { frag.cssFiles.push({absolutePath: "/css/pmStandalone-ie8.css"}); }

        var dao =  new dj.widget.fragmentloader.dao.FileServiceDao(dj.util.io.script, dj.context.core);
        return dojo.when(dao.getFragment(frag), function(files) {
          var rend = new dj.widget.fragmentloader.renderer.FileRenderer();
          rend.renderCss(files.cssFiles);
        });
      }
    }));
  },

  /**
   * First checks the dj.context.page.id
   * if that's not set, checks whether it is a
   * 3rd-party; and only then tries the global pID.
   */
  _getPageId: function() {
    var override = dojo.getObject("dj.context.page.id"),
        is3rdParty = (window.location.href.indexOf('WSJThirdParty_Header_Nav') > -1 ||
        window.location.href.indexOf('0_0_WG_NonReno3rdPartyGlobalHeader') > -1);
    return (typeof override !== "undefined") ?  override :
      (is3rdParty ? "THIRDPARTY" : ((typeof pID !== "undefined") ? pID : "none"));
  },

  _renderAd: function() {
    if (this._isAdDone) { return; }
    this._isAdDone = true;

    if(typeof nonrenoAdLabel !== "undefined"){
      _zone = nonrenoAdLabel;
    }else{
      _zone = 'nonreno';
    }

    if(typeof nonrenoAdWidth !== "undefined"){
      _width = nonrenoAdWidth;
    }else{
      _width = '377';
    }

    if(typeof nonrenoAdHeight !== "undefined"){
      _height = nonrenoAdHeight;
    }else{
      _height = '50';
    }

    _size = _width + 'x' +_height;

    //TODO: zone: quotes, mdc, blogs, community, nonreno
    dj.widget.ad.AdManager.createAd('headerPromoContainer','iframe' , {
      width: _width, height: _height, size: _size, site: 'interactive.wsj.com', zone:_zone,
      adClass: 'A', meta: '', category: '', frequency: '', cacheId: '', classEnabled: 'true',
      classValue: 'promo', styleValue: '', conditionType: '', conditionValue: '', conditionalString: ''
    });
  }
});

