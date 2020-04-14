import pandas as pd
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn import tree
from sklearn.externals.six import StringIO  
from IPython.display import Image  
import pydotplus
import pickle  
from sqlalchemy import create_engine


#filename = 'C:\\Users\\jackplus\\Documents\\Python Scripts\\Python Scripts\\Malaria\\Malaria2\\malaria_prediction_model.sav'
#filename = 'C:\\Users\\jackplus\\Documents\\Python Scripts\\Python Scripts\\Malaria\\Malaria2\\malaria_decision_prediction_model.sav'
filename = 'D:\\@Work\\SeniorProject\\Malaria-SP\\Model\\malaria_prediction_model.sav'
print(filename)

loaded_model = pickle.load(open(filename, 'rb'))
print('Loade Model : Success')

connection_str = create_engine('mysql+pymysql://root:@localhost/malaria_spicies_predict')

data_predict = pd.read_sql('SELECT * FROM malaria_information_for_predict', con=connection_str)

data_predict.head()

malaria_features = data_predict.columns.tolist()
malaria_features

numeric = data_predict[['Age']]
df_cat = data_predict[['bloddraw_year','bloddraw_day','site_district','occupation_id']]
df_cat = df_cat.astype(str)
df_cat2 = data_predict[['bloddraw_month','sex','nationality','Peopletype']]
nominal_data = pd.concat([df_cat, df_cat2], axis=1)
nominal_data = pd.get_dummies(nominal_data)
preprocessed_data = pd.concat([numeric,nominal_data], axis=1)

from sklearn.preprocessing import MinMaxScaler
mms = MinMaxScaler()
norm_data = mms.fit_transform(preprocessed_data)
norm_data=pd.DataFrame(norm_data, columns=preprocessed_data.columns) 
norm_data.head()

from sklearn.decomposition import PCA
pca = PCA(n_components=5,random_state=0)
norm_data = pca.fit_transform(norm_data)

label_malaria_predict = loaded_model.predict(norm_data)

data_predict['result_1'] = label_malaria_predict

data_predict.to_sql('result_malaria_prediction', con =connection_str, if_exists = 'append', index=False)
print('Prediction : Success')




