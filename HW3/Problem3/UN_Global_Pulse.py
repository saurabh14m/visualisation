import re
import fnmatch
import requests
import numpy as np
import pandas as pd
from bs4 import BeautifulSoup

xml = requests.get("http://unglobalpulse.net/ewec/").text

soup = BeautifulSoup(xml)

table = soup.find("table")

i = 0
main = []

for tr in table.find_all("tr"):
    columns = []
    for td in tr.find_all("td"):
        columns.append(td.text)
    main.append(columns)
    i += 1


df = pd.DataFrame(main, columns=["Analysis Date", "All Relevant", "Children's Health", "Women's Health"])
df = df[1:]
df = df[["Analysis Date", "Women's Health"]].set_index("Analysis Date")
df.to_csv("unHealth.csv", encoding="utf-8")