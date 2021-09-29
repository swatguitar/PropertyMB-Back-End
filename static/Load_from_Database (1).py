#!/usr/bin/env python
# coding: utf-8

# ### Environment conda3--python3
# #### coding utf-8

# In[1]:


# import libraries
import mysql.connector
import pandas as pd
import mysql.connector
import pandas as pd


# In[2]:


# verification for database connection
con = mysql.connector.connect(
        host = "45.84.205.195",
        user = "u534477618_ppmb",
        password = "Tar15234",
        database = "u534477618_ppmb",
        port = "3306"
    )


# In[3]:


# check database connection
if con.is_connected():
        print("\n")
        db_Info = con.get_server_info()
        print("Connected to MySQL Server version: ", db_Info, " \n")
        #cursor
        cur = con.cursor()
        cur.execute("SELECT database();")
        record = cur.fetchone()
        print("You\'r connected to database: ", record, " \n")


# In[4]:


# querry select three datatables from database
sequel = """"""


# In[5]:


# define dataframe as 'df'
# read / load data from query database
df = pd.read_sql_query(sequel, con)


# In[6]:


# display table example
# .to_string() can force display actual data when too many columns
df.head(10)


# In[7]:


# merge columns with similar data
df_melt = pd.melt(df,
                  id_vars=['UserType', 'ID_User', 'ID_Property', 'PropertyType'])
df_melt.head(10)


# In[8]:


# make the table formation clean, without hierarchy
df_melt.reset_index()
df.head(10)


# In[9]:


# sort dataset according to ceratin values
# let 'ID_User' be ascending (lowest to highet)
df.sort_values(['ID_User'], ascending=True)


# In[ ]:




