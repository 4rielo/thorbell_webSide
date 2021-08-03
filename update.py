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

port = 8085
localhost = f"http://localhost:{port}"

urls = ('/','root','/status', 'status', '/update' , 'update')
app = web.application(urls,globals())

class root:
	def __init__(self):
		self.hello="Please go to /update to update webApp side"

	def GET(self):
		return self.hello

class status:
    def GET(self):
        response = requests.get(f"{localhost}/status").text
		status=json.loads(str(response))
        return status

class update:
    def __init__(self):
        self.path=__file__			#Obtiene ubicación actual
        self.path=self.path.replace("/update.py","")			#Elimina nombre de archivo, para obtener directorio

    def fetch(self):
        with open(self.path+"/repo.txt") as f:                 #obtiene la dirección del repositorio para descargar el update
            url=f.readline()
        #print(url)

        #Obtiene la dirección del archivo de versión
        with open(self.path+"/versionURL.txt") as f:
            urlVersion=f.readline()

        a = False
        #Aquí comienza el auto update
        try:
            q=requests.get(url)                 #Chekea tener conexión a internet, para ver si puede acceder al repositorio
            if(q):
                a=True                              #Conexión extablecida, pudo acceder al repo
        except:						#No pudo acceder al repo
            a=False

        if(a):
            #print("Auto Update")
            self.updatePath="/home/applica/update/WEB_UPDATE"
            #print(updatePath)
            command=f"rm -rf {self.updatePath}"
            subprocess.run(command,shell=True)

            #Download file "version.txt" to update path, and open it to check on latest version number
            command = f"wget -P {self.updatePath} -c {urlVersion}"
            response=subprocess.run(command,capture_output=True,text=True,shell=True)
            #print(response)
            #print(updatePath+"version.txt")
            #Open file and read it's content.
            with open(self.updatePath+"/version.txt") as f:
                self.newVersion=f.readline()
                if(self.newVersion[-1]=="\n"):
                    self.newVersion=self.newVersion[:-1]

            new = self.newVersion.split(".")
            newVersion=(int(new[0]),int(new[1]),int(new[2]))
            #Checks local version number.

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

            self.update=False
            """If "Stable" version from repository is greater than current version, performs update"""
            if(newVersion[0]>cVersion[0]):
                self.update=True
            elif(newVersion[1]>cVersion[1]):
                self.update=True
            elif(newVersion[2]>cVersion[2]):
                self.update=True

            if(self.update):
                #Download stable version from git
                command=f"rm -rf {self.updatePath}"
                subprocess.run(command,shell=True)

                command = f"git clone {url} {self.updatePath} -b stable"
                response=subprocess.run(command,capture_output=True,text=True,shell=True)
                if(not response.returncode): #response from git clone is "Done"
                    print("Descarga completada.\nEn momentos se reiniciará para completar actualización")
                    time.sleep(5)
                    command="reboot"
                    subprocess.run(command,shell=True)
		else:
			self.newVersion="No conection"
    def GET(self):
        self.fetch()
        page = f"{self.path}\nVersion: {self.currentVersion}\n"
        page += f"New version available: {self.newVersion}\n"
        page += f"Update status: {self.update}"
        return page


if __name__ == "__main__":
	app.run()
