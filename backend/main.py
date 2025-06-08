from fastapi import FastAPI, Depends
from pydantic import BaseModel
from datetime import date, timedelta
import pandas as pd
import numpy as np
from neuralforecast import NeuralForecast
from neuralforecast.models import NBEATSx
from sqlalchemy.orm import Session

from database import init_db, get_db, Tenant, Item, Sale

class DemandRequest(BaseModel):
    branch: str
    horizon: int
    window: str  # e.g. "3H", "6H", "1D"

class TenantOut(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class ItemOut(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class SaleOut(BaseModel):
    id: int
    item_id: int
    date: date
    quantity: int

    class Config:
        orm_mode = True

app = FastAPI()


@app.on_event("startup")
def on_startup():
    init_db()

# simple in-memory data for tasks and orders
class Task(BaseModel):
    id: int
    title: str
    due_date: date
    completed: bool = False

class Order(BaseModel):
    id: int
    date: date
    quantity: int

tasks = [
    Task(id=1, title="Dienstag planen", due_date=date.today() + timedelta(days=1)),
    Task(id=2, title="Auslage sortieren", due_date=date.today() + timedelta(days=2)),
]

orders = [
    Order(id=1, date=date.today() - timedelta(days=1), quantity=50),
    Order(id=2, date=date.today(), quantity=40),
]

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


@app.get('/tenants', response_model=list[TenantOut])
def list_tenants(db: Session = Depends(get_db)):
    return db.query(Tenant).all()


@app.get('/tenants/{tenant_id}/items', response_model=list[ItemOut])
def list_items(tenant_id: int, db: Session = Depends(get_db)):
    return db.query(Item).filter(Item.tenant_id == tenant_id).all()


@app.get('/tenants/{tenant_id}/sales', response_model=list[SaleOut])
def list_sales(tenant_id: int, db: Session = Depends(get_db)):
    return db.query(Sale).filter(Sale.tenant_id == tenant_id).all()


@app.get('/tasks')
def list_tasks():
    return tasks


@app.get('/orders')
def list_orders():
    return orders


@app.get('/weather/{plz}')
def get_weather(plz: str):
    today = date.today()
    data = []
    for i in range(7):
        day = today + timedelta(days=i)
        data.append({
            'date': day,
            'temperature': np.random.uniform(-5, 30),
            'plz': plz,
        })
    return data
