mport json
import httplib
import urllib
import time
import os

CRUNCHBASE_COMPANY_API_URL = 'http://api.crunchbase.com/v/1/company/'

file = open('/Users/rich90usa/Documents/Work/Grooveshark/Startup Map/companies.js', 'r')

json_string = ''
for line in file:
 json_string += line
 
 ''' 65614 COMPANIES '''
 
 companies_detailed = []
 companies = json.loads(json_string)
 
 for company in companies:
  companyname = company['permalink']
  
  url_to_fetch = CRUNCHBASE_COMPANY_API_URL + companyname + '.js'
  
  result = json.load(urllib.urlopen(url_to_fetch))
