#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import numpy as np
import mysql.connector
from flask import Flask, request, jsonify, render_template
import pickle

app = Flask(__name__)
model = pickle.load(open(r'C:\Users\User\Desktop\Dataset_v02\Model_Pickle', 'rb'))


# In[ ]:


def connection():
    # verification for database connection
    con = mysql.connector.connect(
            host = "45.84.205.195",
            user = "u534477618_ppmb",
            password = "Tar15234",
            database = "u534477618_ppmb",
            port = "3306"
        )

    return con


# In[ ]:


@app.route('/')
def users():
    #cursor
    cur = con.cursor()
    cur.execute("SELECT database();")
    return str(rv)


# In[ ]:


@app.route('/welcome')
def hello():
     return "Welcome to Property Model"


# In[ ]:





# In[ ]:


@app.route('/predict', methods=['POST'])
def predict():
    #for rendering results on html
        ID_Property = request.form['fname']
        result = request.form['lname']
        cur.execute("INSERT INTO 'recom'('ID_Property','result') VALUES (%s,%s)",(ID_Property,result)) 
    
    return render_template('/predict', prediction_text='User Type for Ptoperty should be $ {}'.format(output))


# In[ ]:


if __name__ == '__main__':
    app.run(debug=True)


# In[ ]:




