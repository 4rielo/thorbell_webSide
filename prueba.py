import subprocess

stdout= subprocess.run(['nmcli device wifi list --rescan yes'], capture_output=True, shell=True).stdout
devices=stdout.decode("UTF-8")

formated = devices.splitlines()[0]

for line in devices.splitlines():
    print(line)

namePosition = formated.find(" SSID") +1
nameEnd= formated.find("MODE")

signalStrength= formated.find("SIGNAL")
signalEnd = formated.find("BARS")

for line in devices.splitlines()[1:]:
    print("Network: " + line[namePosition:nameEnd] + " -> Strength: " + line[signalStrength:signalEnd])

