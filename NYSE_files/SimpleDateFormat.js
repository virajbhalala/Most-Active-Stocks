com.dowjones.utils.SimpleDateFormat={
	nibbles:{},
	character:"",
	output:"",
	index:0,
	labels:{month:['January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],day:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat']},
	doubleDigit:function(x){return(x<0||x>9?"":"0")+x},
	format:function(date,f){
		f=f+""
		this.output=""
		this.index=0
		var token=""
		var y=date.getYear()+""
		var M=date.getMonth()+1
		var E=date.getDay()
		var H=date.getHours()
		var m=date.getMinutes()
		var s=date.getSeconds()
		y="".concat((y.length < 4)?(y-0+1900):y)
		this.nibbles["y"]=y
		this.nibbles["yyyy"]=y
		this.nibbles["yy"]=y.substring(2,4)
		this.nibbles["M"]=M
		this.nibbles["MM"]=this.doubleDigit(M)
		this.nibbles["MMM"]=this.labels.month[M-1]
		this.nibbles["NNN"]=this.labels.month[M+11]
		this.nibbles["d"]=date.getDate()
		this.nibbles["dd"]=this.doubleDigit(date.getDate())
		this.nibbles["E"]=this.labels.day[E+7]
		this.nibbles["EE"]=this.labels.day[E]
		this.nibbles["H"]=H
		this.nibbles["HH"]=this.doubleDigit(H)
		this.nibbles["h"]=(H==0)?12:((H>12)?H-12:H)
		this.nibbles["hh"]=this.doubleDigit(this.nibbles["h"])
		this.nibbles["K"]=(H>11)?(H-12):H
		this.nibbles["k"]=H+1
		this.nibbles["KK"]=this.doubleDigit(this.nibbles["K"])
		this.nibbles["kk"]=this.doubleDigit(this.nibbles["k"])
		this.nibbles["a"]=(H > 11)?"PM":"AM"
		this.nibbles["m"]=m
		this.nibbles["mm"]=this.doubleDigit(m)
		this.nibbles["s"]=s
		this.nibbles["ss"]=this.doubleDigit(s)
		while(this.index<f.length){
			this.character=f.charAt(this.index)
			token=""
			while((f.charAt(this.index)==this.character)&&(this.index<f.length)){
				token+=f.charAt(this.index++)
			}
			this.output+=(this.nibbles[token]!=null)?this.nibbles[token]:token
		}
		return this.output
	}
}
