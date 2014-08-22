import re
import fnmatch
import requests
import numpy as np
import pandas as pd
from bs4 import BeautifulSoup

xml = requests.get("http://en.wikipedia.org/wiki/World_population_estimates").text

#with open("xml.txt", "wb") as file:
#   file.write(xml.encode("UTF-8"))

soup = BeautifulSoup(xml)

i=0
data = {}

table = soup.find("table", {"class" : "wikitable"})

for tr in table.find_all("tr"):
    
    columns = []
    
    for th in tr.find_all("th")[:6]:
        columns.append(th.text)
        columns = [re.sub("^[^a-zA-z]*|[^a-zA-Z]*$","", s) for s in columns]
    
    for td in tr.find_all("td")[:6]:
        columns.append(td.text)
        
    data[i] = columns
        
    i+=1
    
df = pd.DataFrame(data).set_index(0).T.set_index("Year")

df = df[10:]

df.index = df.index.astype(float)

for col in df.columns:
    df[col] = df[col].str.encode("UTF-8")
    df[col] = df[col].str.replace(",", "")
    df[col] = df[col].str.replace(".", "")
    df[col] = df[col].replace("", np.nan)
    
df.index = df.index.astype(int)
    
df = df.dropna(how="all").fillna("")

df.to_csv("timeline.csv", encoding="utf-8")