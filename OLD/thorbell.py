#! /usr/bin/python3
#

# importing the subprocess module
import cgitb
cgitb.enable()

import subprocess
#import asyncio
import web
from web import form

urls = ('/','root','/scan','scan','/index','index', '/form','form')
app = web.application(urls,globals())

class root:
	def __init__(self):
		self.hello="Please go to /scan to search for available networks"

	def GET(self):
		return self.hello
				
class scan:
	def get_response(self):
		try:
			#nothing= subprocess.run(['nmcli device wifi rescan'], capture_output=True, text=True, shell=True).stdout
			stdout= subprocess.run(['nmcli device wifi list --rescan yes'], capture_output=True, shell=True).stdout
			#devices=stdout.decode("UTF-8")

			print(subprocess.run(['nmcli device wifi connect ' + post["red"] + ' password ' + post["pwd"]], capture_output=True, text=True, shell=True).stdout.decode("UTF-8"))
                        
		except:
			devices = "Error obtaining WiFi list\n\r"

		return devices

	def GET(self):
		site=self.get_response()
		#print(site)
		return site

class index:

	def __init__(self):
		self.render=web.template.render("templates/")
			
	def GET(self):
		getInput=scan.get_response(self)
		formated = getInput.splitlines()[0]
		namePosition = formated.find(" SSID") +1
		nameEnd= formated.find("MODE")
		signalStrength= formated.find("SIGNAL")
		signalEnd = formated.find("BARS")
		output=list()
		for index, line in enumerate(getInput.splitlines()[1:]):
				output+=line[0] + "," + line[namePosition:nameEnd]
				output += "," + line[signalStrength:signalEnd] + "\n"
				
		return self.render.index("Scan List", output)

class form:
	def __init__(self):
		self.render=web.template.render("templates/")
			
	def GET(self):
		getInput=scan.get_response(self)
		formated = getInput.splitlines()[0]
		namePosition = formated.find(" SSID") +1
		nameEnd= formated.find("MODE")
		signalStrength= formated.find("SIGNAL")
		signalEnd = formated.find("BARS")
		output=""
		for line in getInput.splitlines()[1:]:
			output+=line[0] + "," + line[namePosition:nameEnd]
			output+=","+line[signalStrength:signalEnd]
		#output=list()
		#for index, line in enumerate(getInput.splitlines()[1:]):
				#output+=line[0] + "," + line[namePosition:nameEnd]
				#output += "," + line[signalStrength:signalEnd] + "\n"
		#		output[index]=line[namePosition:nameEnd] + " - Signal: " + line[signalStrength:signalEnd]

		#connectForm = form.Form(
		#	form.Dropdown(self, name="ScanList",args=output)
		#)
		#self.f=connectForm()
		return self.render.form("Scan List", output)
		
class connect:
        devices="Go to /form to select network"
        def POST(self):
                post = web.input()
                try:
                        command=['nmcli', 'device', 'wifi', 'connect', str(post>
                        #command="nmcli device wifi connect "+str(post.red)
                        #command+=" password " + str(post.pwd)
                        stdout= subprocess.run(command, capture_output=True, te>
                        #stdout= os.system(command)
                        self.devices= stdout
                except subprocess.CalledProcessError as e:
                        self.devices =  str(command) + "   ERROR:   " + str(e.s>

                #return inputFromForm.red
                return self.devices

        def GET(self):
			return self.devices
			
if __name__ == "__main__":
	app.run()
