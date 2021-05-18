#! /usr/bin/python3
#

# importing the subprocess module
import cgitb
cgitb.enable()

import subprocess
#import time
#import asyncio
import web

urls = ('/','root','/scan','scan','/index','index')
app = web.application(urls,globals())

class root:
	def __init__(self):
		self.hello = "Please go to /scan to search for active networks"
	
	def GET(self):
		return self.hello

class scan:
	#def __init__(self):
	#	self.response = self.get_response()
		#self.response="hola"

	def get_response(self):
		try:
			subprocess.run(['nmcli device wifi rescan'], shell=True).stdout
			#time.delay(0.001)
			stdout= subprocess.run(['nmcli device wifi list'], capture_output=True, shell=True).stdout
			devices=stdout.decode("UTF-8")
                        
		except subprocess.CalledProcessError as exc:
			devices= "Error obtaining WiFi list\n\r"
			devices+="Status : FAIL\n"
			devices+=  str(exc.returncode)
			devices+= str(exc.output)

		return devices

	def GET(self):
		site=self.get_response()
		return site
		

class index:
	def __init__(self):
		self.render=web.template.render("templates/")
		
	def GET(self):
		getInput=scan.get_response(self)
		return self.render.index("Scan List", getInput)

if __name__ == "__main__":
        app.run()
