#!/usr/bin/env python
# coding: utf-8

# ### Environment conda3--python3
# 
# #### coding utf-8
# 
# #### Load Data

# In[2]:


import pandas as pd
import numpy as np

# turn off feature warnings
import warnings
warnings.filterwarnings('ignore')

# show pandas version for documentation reference
print("Pandas version: "+ pd.__version__)

df_house = pd.read_csv(r'C:\Users\User\Desktop\Dataset_v02\house_with_target_002.txt', delimiter='\t')
#df_land = pd.read_csv(r'C:\Users\User\Desktop\Dataset_v02\lands_dataset.txt', delimiter='\t')
df_house


# #### drop columns with missing values

# In[2]:


inputs = df_house.dropna(axis='columns')
inputs


# #### change string to numeric

# In[3]:


from sklearn.preprocessing import LabelEncoder

le_idProp = LabelEncoder()
le_propTy = LabelEncoder()
le_asseSt = LabelEncoder()
le_userTy = LabelEncoder()
le_houseAr = LabelEncoder()
le_floor = LabelEncoder()


# In[4]:


inputs['ID_Property_n'] = le_idProp.fit_transform(inputs['ID_Property'])
inputs['PropertyType_n'] = le_propTy.fit_transform(inputs['PropertyType'])
inputs['AsseStatus_n'] = le_asseSt.fit_transform(inputs['AsseStatus'])
inputs['UserType_n'] = le_userTy.fit_transform(inputs['UserType'])
inputs['HouseArea_n'] = le_houseAr.fit_transform(inputs['HouseArea'])
inputs['Floor_n'] = le_floor.fit_transform(inputs['Floor'])
inputs


# In[5]:


#drop columns with old string values
inputs_n = inputs.drop(['ID_Property', 
                        'PropertyType',
                        'AsseStatus',
                        'UserType',
                        'HouseArea',
                        'Floor',
                        'Owner'
                       ], axis='columns')
inputs_n


# In[6]:


# seperate train data and target data
df = inputs_n.drop('UserType_n', axis='columns')
target = inputs_n['UserType_n']


# In[ ]:





# In[ ]:





# #### Decision Tree Classifier

# In[7]:


from sklearn import tree

model = tree.DecisionTreeClassifier()

model.fit(df, target)


# In[8]:


model.score(df, target)


# ### Export Dataset as .txt file

# In[ ]:


#df_export = inputs_n.to_csv(r'C:\Users\User\Desktop\Dataset_v02\houseModel_dataset.txt', index=False)


# ## Save Model

# In[9]:


import pickle

with open(r'C:\Users\User\Desktop\Dataset_v02\Model_Pickle', 'wb') as f:
    pickle.dump(model,f)


# In[10]:


with open(r'C:\Users\User\Desktop\Dataset_v02\Model_Pickle', 'rb') as f:
    mp = pickle.load(f)


# In[12]:


mp.predict([[1000000,1000000,1000000,1,2,1,30,1,2560,0,0,0,0,0,1,0,1,0,0,1,0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,40,1,2
]])


# In[ ]:




