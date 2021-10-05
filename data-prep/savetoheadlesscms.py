# This is is an example py script for writting json file to some type of cloud storage. The idea is that 
# whereever this file is stored our conjure oracle process can access it and put it onchain. We need to pick a place if not puttin onto IPFS directly.

import requests
from requests.auth import HTTPBasicAuth
import json
from pathlib import Path

# headless crypto cms (I've helped build this but we don't have to use it and probably shouldn't use this for hackathon
# ask me for the correct api key this one wont work. It's a simple change I can tell you how to make
testHorizon = 'hQtgHgwQUBcIUV9WndOZJov/7SUc9Eiz5MWBl8gr8/A= IFw9VKgiM+e7OXDBV/QVSjefr3OWO4rLXt7YgdA9qvg='
headers = {'x-api-key' : testHorizon, 'Content-Type': 'multipart/form-data'}

# Upload file
fp = 'price_history_study_30_days_starting_2021-09-06.json'
env = "{'envelope':{'metadata':{'storage':{'contenttype':'application/javascript'}}}}"
multipart_form_data = (
 ('text', (None, 'myfileparam')), # hmm have this in other js working example so but it here
 ('file', ('price_history_study_30_days_starting_2021-09-06.json', open(fp, 'rb'))),
 ('json', (None, json.dumps(env),'application/javascript'))
)

# This reguires API key and atm the call isn't working something about multiform
#url = 'https://plato.seallake.net/API/v1/data/siptesting/price_history_study_30_days_starting_2021-09-06.json'
#response = requests.post(url, headers=headers, files=multipart_form_data)
# This seems to work on pipedream
url = 'https://en4zjzzk19z29a0.m.pipedream.net/price_history_study_30_days_starting_2021-09-06.json'
response = requests.post(url, files=multipart_form_data)

print(response.content)
if response.status_code == 200:
 print ("Success")
 data = json.loads(response.text)
 #file_ids = data['file_ids']
 print (data)
else:
 print ("Failure")
 pprint(response)
