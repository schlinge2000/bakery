from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
from neuralforecast import NeuralForecast
from neuralforecast.models import NBEATSx

class DemandRequest(BaseModel):
    branch: str
    horizon: int
    window: str  # e.g. "3H", "6H", "1D"

app = FastAPI()

def _forecast_demand(horizon: int, window: str):
    periods = 100
    dates = pd.date_range('2023-01-01', periods=periods, freq=window)
    df = pd.DataFrame(
        {
            'unique_id': '1',
            'ds': dates,
            'y': np.random.rand(periods),
            'price': np.random.uniform(1.0, 3.0, periods),
            'display_pos': np.random.randint(1, 5, periods),
            'weather': np.random.uniform(-5, 30, periods),
        }
    )

    models = [
        NBEATSx(
            h=horizon,
            input_size=min(24, periods),
            futr_exog_list=['price', 'display_pos', 'weather'],
        )
    ]

    nf = NeuralForecast(models=models, freq=window)
    nf.fit(df=df)

    fut_dates = pd.date_range(dates[-1] + pd.Timedelta(window), periods=horizon, freq=window)
    fut_df = pd.DataFrame(
        {
            'unique_id': '1',
            'ds': fut_dates,
            'price': np.random.uniform(1.0, 3.0, horizon),
            'display_pos': np.random.randint(1, 5, horizon),
            'weather': np.random.uniform(-5, 30, horizon),
        }
    )

    fut = nf.predict(futr_df=fut_df)
    return fut['NBEATSx'].tolist()


@app.post('/predict')
def predict_demand(req: DemandRequest):
    preds = _forecast_demand(req.horizon, req.window)
    return {'branch': req.branch, 'predictions': preds}
