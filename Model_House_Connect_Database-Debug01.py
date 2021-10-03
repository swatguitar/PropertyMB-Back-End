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


SQL_Query_House = pd.read_sql_query(
    "SELECT ID_Property,PropertyType,CostestimateB,SellPrice,MarketPrice,AsseStatus,RoadType,HouseArea,Floor,HomeCondition,BuildingAge FROM propertys WHERE ID_Property = '"+sys.argv[1]+"'", con)
df_house = pd.DataFrame(SQL_Query_House)

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
df_house


# #### Drop Rows with missing Values

# In[5]:


df_house = df_house.dropna(axis='rows')
df_house


# #### Change String to Numeric Value

# In[6]:


from sklearn.preprocessing import LabelEncoder

# encoding string values into numeric values
le_propTy = LabelEncoder()
le_asseSt = LabelEncoder()
le_homeCon = LabelEncoder()
le_roadTy = LabelEncoder()


# In[7]:


# create new columns containing numeric code of former column
df_house['PropertyType_n'] = le_propTy.fit_transform(df_house['PropertyType'])
df_house['AsseStatus_n'] = le_asseSt.fit_transform(df_house['AsseStatus'])
df_house['HomeCondition_n'] = le_homeCon.fit_transform(df_house['HomeCondition'])
df_house['RoadType_n'] = le_roadTy.fit_transform(df_house['RoadType'])
df_house


# ### Seperate ID_Property from Dataframe before Model Implementation

# In[8]:


ID_Property = df_house[['ID_Property']]
ID_Property


# ### Select Columns that are used as Variables in Model

# In[9]:


df_house_select = df_house[['PropertyType_n', 'SellPrice', 'CostestimateB','MarketPrice', 'HouseArea', 'Floor', 'HomeCondition_n', 'BuildingAge','RoadType_n','AsseStatus_n']]
df_house_select


# In[10]:



# ### Import Decision Tree Model

# In[11]:

import pickle
print(pickle.format_version)
readdict_file = open('Model_Pickle_giniHouse_V04.pkl', 'rb')
classification_dict = pickle.load(readdict_file)
readdict_file.close

#loaded_model_house = pickle.load(open('E:\Model\Model_Pickle_giniHouse_V03.pkl','rb'))
#loaded_model_house = pickle.load(open("E:\Model\Model_Pickle_giniHouse_V02", 'rb'))


# ### Make Predictions with the Dataframe & Model

# In[12]:


house_prediction = classification_dict.predict(df_house_select)
house_prediction


# In[13]:


dataframe = pd.DataFrame(house_prediction, columns=['UserType']) 
dataframe


# In[14]:


dataframe['UserType'] = np.where((dataframe.UserType==1),'Short-Term',dataframe.UserType)
dataframe


# In[15]:


dataframe = dataframe['UserType'].replace(to_replace=['0'], value='Long-Term')


# In[16]:


df = pd.DataFrame(dataframe)
df


# In[17]:


df_concat = pd.concat([ID_Property, df], axis=1, sort=False)
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
    cur.execute('''UPDATE propertys SET UserType =%s WHERE ID_Property=%s''', (y.UserType, y.ID_Property))
    con.commit()
    print('Index: ', x, 'Value: ', y.UserType, 'ID_P :',y.ID_Property)


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




