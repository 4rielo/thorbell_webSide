#! /usr/bin/python3
#

# importing the subprocess module
import cgitb
cgitb.enable()

#import nmcli
import web
from web import form
import subprocess
import requests
import time
import json

defaultSSID = "THORBELL"
defaultPASS = "applica07"

urls = ('/','root','/scan','scan','/index','index', '/form','form','/connect','connect','/status', 'status', '/update' , 'update')
app = web.application(urls,globals())

class root:
	def __init__(self):
		self.hello="Please go to /scan to search for available networks"

	def GET(self):
		return self.hello
				
class scan:
	def get_response(self):
		try:		
			command="nmcli device"
			response=subprocess.run(command,capture_output=True,text=True,shell=True).stdout
			lines=response.splitlines()
			hotspot=lines[1].split()
			flag_wasHotspot=False
			if(hotspot[3]=="Hotspot"):
				#print("It's a hotspot")
				command="nmcli device disconnect wlan0"
				response=subprocess.run(command,capture_output=True,shell=True)
				flag_wasHotspot=True
				time.sleep(1)
			
			command="nmcli device wifi list --rescan yes"
			devices = subprocess.run(command,capture_output=True, text=True, shell=True).stdout

			if(flag_wasHotspot):
				command=f"nmcli device wifi hotspot ssid {defaultSSID} password {defaultPASS}"
				response=subprocess.run(command,capture_output=True,shell=True)	
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
		for line in getInput.splitlines()[1:]:
			output.append((line[0],line[namePosition:nameEnd],line[signalStrength:signalEnd]))
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
		output=list()
		for line in getInput.splitlines()[1:]:
			output.append((line[0],str(line[namePosition:nameEnd]).strip(),str(line[signalStrength:signalEnd]).strip()))
		return self.render.form("Scan List", output)
		
class connect:
	devices="Go to /form to select network"
	def POST(self):
		post = web.input()
		post.red=post.red.replace("¿.","\ ")
		command="nmcli device disconnect wlan0"
		response=subprocess.run(command,capture_output=True,shell=True)
		try:
			#command=['nmcli', 'device', 'wifi', 'connect', str(post>
			command=f"nmcli device wifi connect {post.red} password {post.pwd}"
			stdout= subprocess.run(command, capture_output=True, text=True, shell=True)
			#stdout= os.system(command)
			if(stdout.stdout.find("Device 'wlan0' successfully activated")):
				self.devices= "Conexión exitosa"
			else:
				command=f"nmcli device wifi hotspot ssid {defaultSSID} password {defaultPASS}"
				response=subprocess.run(command,capture_output=True,shell=True)
				self.devices= "Error en la conexión - Restableciendo Hotspot"

			self.devices+= "\n\r"+ str(stdout)
		except subprocess.CalledProcessError as e:
			self.devices =  str(command) + "   ERROR:   " + str(e.stderr)

		#return inputFromForm.red
		return self.devices

	def GET(self):
		return self.devices

class status:
	def GET(self):
		with open("/home/applica/THORBELL/CSB_MercurioR1/status.dat") as f:
			status = json.load(f)
		return status

class update:
	def __init__(self):
		self.path=__file__			#Obtiene ubicación actual
		self.path=self.path.replace("/thorbell.py","")			#Elimina nombre de archivo, para obtener directorio

		with open(self.path+"/repo.txt") as f:                 #obtiene la dirección del repositorio para descargar el update
			url=f.readline()
        #print(url)

		#Obtiene la dirección del archivo de versión
		with open(self.path+"/versionURL.txt") as f:
			urlVersion=f.readline()

		a = False
		#Aquí comienza el auto update
		try:
			fetch=requests.get(url)                 #Chekea tener conexión a internet, para ver si puede acceder al repositorio
			if(fetch):
				a=True                              #Conexión extablecida, pudo acceder al repo
		except:						#No pudo acceder al repo
			a=False

		if(a):
			#print("Auto Update")
            #if(not self.path):
			#	self.path = "./"
            #updatePath = path + "UPDATE/"
			self.updatePath="/home/applica/update/WEB_UPDATE"
            #print(updatePath)
			command="rm -rf /home/applica/update/WEB_UPDATE"
			subprocess.run(command,shell=True)
            
            #Download file "version.txt" to update path, and open it to check on latest version number 
			command = "wget -P " + self.updatePath + " -c " + urlVersion 
			response=subprocess.run(command,capture_output=True,text=True,shell=True)
            #print(response)
            #print(updatePath+"version.txt")
			#Open file and read it's content.
			with open(self.updatePath+"/version.txt") as f:
				f=f.readline()
				if(f[-1]=="\n"):
					f=f[:-1]

			new = f.split(".")
			newVersion=(int(new[0]),int(new[1]),int(new[2]))
			self.newVersion=newVersion
            #Checks local version number. 
            #self.localPath = "/home/applica/THORBELL/"
			try:
				f=open(self.path + "/version.txt","r")
				self.currentVersion=f.readline()
				f.close()
			except:
				self.currentVersion="0.0.0"	
			if(self.currentVersion[-1]=="\n"):
			    self.currentVersion=self.currentVersion[:-1]
			curr=self.currentVersion.split(".")
			cVersion=(int(curr[0]),int(curr[1]),int(curr[2]))
			#self.updateLabel.setText("Versión remota: " + f + "\nLocal: " + currentVersio			
			self.update=False
			"""If "Stable" version from repository is greater than current version, performs update"""
			if(newVersion[0]>cVersion[0]):
			    self.update=True
			elif(newVersion[1]>cVersion[1]):
			    self.update=True
			elif(newVersion[2]>cVersion[2]):
			    self.update=True

			"""if(update):
			    self.updateLabel.setText("Comienza la descarga")
			    #Download stable version from git
			    command="rm -rf /home/applica/update/UPDATE"
			    subprocess.run(command,shell=True)
			    #time.sleep(2)
			    command = "git clone " + url + " " + updatePath + " -b stable"
			    response=subprocess.run(command,capture_output=True,text=True,shell=True)
			    if(not response.returncode): # stdout.endswith("done.")):          #response from git clone is "Done"
			        self.updateLabel.setText("Descarga completada.\nEn momentos se reiniciará para completar actualización")
                    time.sleep(5)
                    command="reboot"
                    subprocess.run(command,shell=True)"""
	def GET(self):
		page = self.path + "\n"
		page += "Version: " + self.currentVersion + "\n"
		page += "New version available: " + self.newVersion + "\n"
		page += "Update status: " + self.update
		return page
        

if __name__ == "__main__":
	app.run()
