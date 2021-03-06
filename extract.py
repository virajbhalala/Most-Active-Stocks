# Extracts most active stocks information from the WSJ

import libxml2
import sys
import os
import commands
import re
import sys
#import MySQLdb
from xml.dom.minidom import parse, parseString
# for converting dict to xml 
from cStringIO import StringIO
from xml.parsers import expat

def get_elms_for_atr_val(tag,atr,val):
	lst=[]
	tr_lst = dom.getElementsByTagName("tr")
	#make list of all stock names and info
	for tr in range(17, len(tr_lst)-5):
		print(tr_lst[tr])
		textList=get_text(tr_lst[tr])
		lst.append(textList);
		#print(len(textList)) length is 8
	#print(lst[0]) <- heading
	#print(lst[1])  <-other than heading
	return lst;

	
# get all text recursively to the bottom
def get_text(e):
	lst=[];
	if (e.nodeType==3):
		lst.append(e.data);
		lst[0]=replace_white_space(lst[0])
#		print(lst)
		return lst; 
	elif (e.nodeType==1):
		for child in e.childNodes:
			l=get_text(child);
			#print(l)
			lst+=l;
		return lst;

# replace whitespace chars
def replace_white_space(old):
	new=""
	new=old.replace("\n","")
	return new
   	#p = re.compile(r'\s+')
   	#new = p.sub(' ',str)   # a lot of \n\t\t\t\t\t\t
   	#return new.strip()

# replace but these chars including ':'
def replace_non_alpha_numeric(s):
   	p = re.compile(r'[^a-zA-Z0-9:-]+')
   	#   p = re.compile(r'\W+') # replace whitespace chars
   	new = p.sub(' ',s)
   	return new.strip()

# convert to xhtml
# use: java -jar tagsoup-1.2.jar --files html_file
def html_to_xml(fn):
	xhtml="";
	os.system("java -jar tagsoup-1.2.1.jar --files " + str(fn));
	for i in fn:	
		if (i!="."): 
			xhtml=xhtml+i;
		else:
			break;
	xhtml=xhtml+".xhtml";
	return xhtml;	

def extract_values(dm):
   	lst = []
   	l = get_elms_for_atr_val('table','class','most_actives')
 	 # ............
   	#get_text(l)
 	  # ............
   	return l

# mysql> describe most_active;
#def insert_to_db(l,tbl):
	   # ............

# show databases;
# show tables;
def main():

	html_fn = sys.argv[1]
   	fn = html_fn.replace('.html','')
   	xhtml_fn = html_to_xml(html_fn)
 	global dom
   	dom = parse(xhtml_fn)
   	lst = extract_values(dom)
	for i in lst:
		print(i[0] + "\t" + i[2]+ "\t" + i[4]+ "\t" + i[5]+ "\t" + i[6]+ "\t" + i[7])
		
   # make sure your mysql server is up and running
   #cursor = insert_to_db(lst,fn) # fn = table name for mysql

   #l = select_from_db(cursor,fn) # display the table on the screen

   # make sure the Apache web server is up and running
   # write a PHP script to display the table(s) on your browser

   #return xml
# end of main()"
#if __name__ == "__main__":

main()

# end of hw7.py
