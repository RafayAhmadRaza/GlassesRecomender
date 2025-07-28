from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split

from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder

from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
import pandas as pd



def loadData(URL):


    datasource = pd.read_csv(URL)
    print(datasource)
    return datasource

def splitDataXY(df):

    df = df.sample(frac=1).reset_index(drop=True)
    print(df)

    X = df.drop('label',axis=1)
    encoder = LabelEncoder()
    y = df['label']

    y = encoder.fit_transform(y)

    print(X)
    print(y)

    return X,y



if __name__ == "__main__":

    URL = r"C:\Users\cva\Desktop\GlassesRecomender\public\facedatasource.csv"

    df = loadData(URL)

    X,y = splitDataXY(df)
    
    scaler = StandardScaler()

    X_scaled = scaler.fit_transform(X)

    X_train,X_test,y_train,y_test = train_test_split(X_scaled,y,test_size=0.2)


    model = SVC()

    



    model.fit(X_train,y_train)

    preds = model.predict(X_test)

    print(accuracy_score(y_test,preds))


    
