import json
import httplib
import urllib
import time
import os

CRUNCHBASE_COMPANY_API_URL = 'http://api.crunchbase.com/v/1/company/'

print "Script starting..."
file = open('./startups.js', 'r')

json_string = ''
for line in file:
 json_string += line
file.close()
 
companies_detailed = []
companies = json.loads(json_string)
 
#Fetch details for all startups
for company in companies:
 url_to_fetch = CRUNCHBASE_COMPANY_API_URL + company + '.js'
  
 result = json.load(urllib.urlopen(url_to_fetch))
 if ''.join(result).count("error") > 0:
    print "ERROR: " + company
 else:
    companies_detailed.append(result)

""" NOT WORKING NOT SERIALIZING TO JSON """
companies_distilled = []
for company in companies_detailed:
    temp_company = {}
    temp_company['name'] = company['name']
    temp_company['offices'] = company['offices']
    temp_company['permalink'] = company['permalink']
    temp_company['number_of_employees'] = company['number_of_employees']
    temp_company['homepage_url'] = company['homepage_url']
    companies_distilled.append(temp_company)

file = open('./startups_distilled.js', 'w')
file.write(json.dumps(companies_distilled))
file.close

file = open('./startups_detailed.js', 'w')
file.write(json.dumps(companies_detailed))
file.close
print "Script Complete."
