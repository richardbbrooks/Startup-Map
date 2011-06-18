import json
import httplib
import urllib
import time
import os

CRUNCHBASE_COMPANY_API_URL = 'http://api.crunchbase.com/v/1/company/'

class Company:
    def __init__(self, name, offices, number_of_employees, homepage_url, permalink):
        self.name = name
        self.offices = offices
        self.number_of_employees = number_of_employees
        self.homepage_url = homepage_url
        self.permalink = permalink

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

""" NOT WORKING NOT SERIALIZING TO JSON
#Distill details down to essentials
companies_distilled = []
for company in companies_detailed:
    temp_company = Company(company['name'], company['offices'], company['number_of_employees'], company['homepage_url'], company['homepage_url'])
    companies_distilled.append(temp_company)
"""

file = open('./startups_detailed.js', 'w')
file.write(json.dumps(companies_detailed))
file.close
print "Script Complete."
