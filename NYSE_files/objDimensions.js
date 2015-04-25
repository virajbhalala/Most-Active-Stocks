com.dowjones.utils.objDimensions={
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
