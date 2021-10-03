#!/usr/bin/env python
# coding: utf-8

# # Environment conda3--python3
# ## Coding UTF-8
# ### Import Libraries

# In[1]:


import sys
print("Python: {}".format(sys.version))
import pandas as pd
print("pandas: {}".format(pd.__version__))
import numpy as np
print("numpy: {}".format(np.__version__))
import mysql.connector
print("connector: {}".format(mysql.connector.__version__))


# ### Connect to Database

# In[2]:


#connect to database
con = mysql.connector.connect(
    host = "45.84.205.195",
        user = "u534477618_ppmb",
        password = "Tar15234",
        database = "u534477618_ppmb",
        port = "3306"
)

if con.is_connected():
    db_Info = con.get_server_info()
    print("Connected to MySQL Server version: ", db_Info)
    #cursor
    cur = con.cursor()
    cur.execute("select database();")
    record = cur.fetchone()
    print("You\'r connected to the database: ", record)
    print("Property ID is: ", sys.argv[1])

# ### Execute the Query

# In[3]:


SQL_Query_Land = pd.read_sql_query("SELECT ID_Lands,ColorType,CostestimateB,SellPrice,MarketPrice,AsseStatus,RoadType,GroundLevel FROM lands WHERE ID_Lands = '"+sys.argv[1]+"'", con)
df_land = pd.DataFrame(SQL_Query_Land)

if (con.is_connected()):
        #close the cursor
        cur.close()
        #close the connection
        con.close()
        print()
        print("MySQL connection is closed")
        print()


# ### Clean Data --Land_Dataset

# In[4]:


# show example data from loaded file
df_land


# #### Drop Rows with missing Values

# In[5]:
df_land_droped = df_land.dropna(axis='rows')
df_land_droped



# #### Change String to Numeric Value

# In[6]:


from sklearn.preprocessing import LabelEncoder

# encoding string values into numeric values
le_colorTy = LabelEncoder()
le_asseSt = LabelEncoder()
le_roadTy = LabelEncoder()
le_groundLev = LabelEncoder()


# In[7]:


# create new columns containing numeric code of former column
df_land_droped['ColorType_n'] = le_colorTy.fit_transform(df_land_droped['ColorType'])
df_land_droped['AsseStatus_n'] = le_asseSt.fit_transform(df_land_droped['AsseStatus'])
df_land_droped['RoadType_n'] = le_roadTy.fit_transform(df_land_droped['RoadType'])
df_land_droped['GroundLevel_n'] = le_groundLev.fit_transform(df_land_droped['GroundLevel'])
df_land_droped


# ### Seperate ID_Property from Dataframe before Model Implementation

# In[8]:


ID_Lands = df_land_droped[['ID_Lands']]
ID_Lands


# ### Select Columns that are used as Variables in Model

# In[9]:


df_land_select = df_land_droped[['ColorType_n', 'CostestimateB', 'SellPrice', 'MarketPrice',  'RoadType_n', 'AsseStatus_n']]
df_land_select


# ### Import Decision Tree Model

# In[10]:


import pickle
readdict_file = open('Model_Pickle_giniLand_V04.pkl', 'rb')
classification_dict = pickle.load(readdict_file)
readdict_file.close

#loaded_model_land = pickle.load(open("E:\Model\Model_Pickle_giniLand_V02", 'rb'))


# ### Make Predictions with the Dataframe & Model

# In[11]:


land_prediction = classification_dict.predict(df_land_select)


# In[12]:


land_prediction


# In[13]:


dataframe = pd.DataFrame(land_prediction, columns=['UserType']) 
dataframe


# In[14]:


dataframe['UserType'] = np.where((dataframe.UserType==1),'Short-Term',dataframe.UserType)
dataframe


# In[15]:


dataframe = dataframe['UserType'].replace(to_replace=['0'], value='Long-Term')


# In[16]:


df = pd.DataFrame(dataframe, columns=['UserType'])
df


# In[17]:


df_concat = pd.concat([ID_Lands, df], axis=1, sort=False)
df_concat


# In[18]:


#connect to database
con = mysql.connector.connect(
   host = "45.84.205.195",
        user = "u534477618_ppmb",
        password = "Tar15234",
        database = "u534477618_ppmb",
        port = "3306"
)

if con.is_connected():
    db_Info = con.get_server_info()
    print("Connected to MySQL Server version: ", db_Info)
    #cursor
    cur = con.cursor()
    cur.execute("select database();")
    record = cur.fetchone()
    print("You\'r connected to the database: ", record)


# In[19]:


for x,y in df_concat.iterrows():
    mycursor = con.cursor()
    cur.execute('''UPDATE lands SET UserType =%s WHERE ID_Lands=%s''', (y.UserType, y.ID_Lands))
    con.commit()
    print('Index: ', x, 'Value: ', y.UserType, 'ID_L :',y.ID_Lands)


# ### Close the Databse Connection

# In[20]:


if (con.is_connected()):
        #commit the transaction when changes made to database
        con.commit()
        #close the cursor
        cur.close()
        #close the connection
        con.close()
        print()
        print("MySQL connection is closed")
        print()


# In[ ]:




