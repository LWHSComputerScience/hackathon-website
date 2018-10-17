import pandas as pd

form = pd.read_csv('./private/form.csv')
he = pd.read_csv('./private/hackerearth.csv')
import math
transferables = ['Shirt Size','Phone Number','Date of Birth','Level of Study','Expected Year of Graduation','High School Name','Gender','Interested Major','Race/Ethnicity']
autofill = {'MLH Privacy Policy':'yes','MLH Terms of Service':'yes'}


def fix2(row):
    if row.Email in form['Confirm Email Address'].values:
        formrow = form.loc[form['Confirm Email Address'] == row.Email]
        for t in transferables:
            row[t] = formrow[t].values[0]
        for k, v in autofill.items():
            row[k] = v
        row['Computer Science Experience'] = formrow[
            "Please give a brief description of your computer science and hackathon experiences (it's okay if you don't have any)."].values[
            0]
        row['Dietary Restrictions'] = formrow['Dietary restrictions'].values[0]

    return row
final = he.apply(lambda x: fix2(x),axis=1)
final.to_csv('registrations')