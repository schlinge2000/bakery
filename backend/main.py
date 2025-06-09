from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from datetime import date, timedelta
import pandas as pd
import numpy as np
from neuralforecast import NeuralForecast
from neuralforecast.models import NBEATSx
from sqlalchemy.orm import Session
import json
from typing import List, Dict, Any, Optional

from database import init_db, get_db, Tenant, Item, Sale, DisplayCase, DisplayConfiguration, DisplaySlot, Product

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

class ProductResponse(BaseModel):
    id: int
    name: str
    display_name: str
    icon_type: str
    category: str
    priority: int

class DisplaySlotResponse(BaseModel):
    row_index: int
    column_index: int
    product: Optional[ProductResponse] = None

class DisplayConfigurationResponse(BaseModel):
    id: int
    time_of_day: str
    layout_data: dict
    slots: list[DisplaySlotResponse]

class DisplayCaseResponse(BaseModel):
    id: int
    name: str
    description: str
    layout_type: str
    rows: int
    columns: int
    configurations: list[DisplayConfigurationResponse]

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


# Neue API-Endpunkte für die Auslage
@app.get('/products')
def get_products(db: Session = Depends(get_db)):
    """Alle verfügbaren Produkte abrufen"""
    products = db.query(Item).all()
    result = []
    
    for product in products:
        result.append({
            "id": product.id,
            "name": product.name,
            "display_name": product.display_name or product.name,
            "icon_type": product.icon_type or "broetchen",
            "category": product.category or "Sonstiges",
            "priority": product.priority or 0
        })
    
    return result


@app.get('/products/{product_id}')
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Ein einzelnes Produkt abrufen"""
    product = db.query(Item).filter(Item.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    
    return {
        "id": product.id,
        "name": product.name,
        "display_name": product.display_name or product.name,
        "icon_type": product.icon_type or "broetchen",
        "category": product.category or "Sonstiges",
        "priority": product.priority or 0
    }


@app.get('/display-cases')
def get_display_cases(db: Session = Depends(get_db)):
    """Alle verfügbaren Auslagen abrufen"""
    cases = db.query(DisplayCase).all()
    result = []
    
    for case in cases:
        case_data = {
            "id": case.id,
            "name": case.name,
            "description": case.description,
            "layout_type": case.layout_type,
            "rows": case.rows,
            "columns": case.columns
        }
        result.append(case_data)
    
    return result


@app.get('/display-cases/{case_id}')
def get_display_case(case_id: int, db: Session = Depends(get_db)):
    """Eine einzelne Auslage mit allen Konfigurationen abrufen"""
    case = db.query(DisplayCase).filter(DisplayCase.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Auslage nicht gefunden")
    
    # Konfigurationen mit Slots abrufen
    configurations = db.query(DisplayConfiguration).filter(
        DisplayConfiguration.display_case_id == case_id
    ).all()
    
    config_data = []
    for config in configurations:
        # Layout-Daten parsen
        try:
            import json
            layout_data = json.loads(config.layout_data) if config.layout_data else {}
        except:
            layout_data = {}
        
        # Slots mit Produkten abrufen
        slots = db.query(DisplaySlot).filter(
            DisplaySlot.configuration_id == config.id
        ).all()
        
        slot_data = []
        for slot in slots:
            slot_info = {
                "row_index": slot.row_index,
                "column_index": slot.column_index,
                "product": None
            }
            
            # Produkt hinzufügen, falls vorhanden
            if slot.item_id:
                product = db.query(Item).filter(Item.id == slot.item_id).first()
                if product:
                    slot_info["product"] = {
                        "id": product.id,
                        "name": product.name,
                        "display_name": product.display_name or product.name,
                        "icon_type": product.icon_type or "broetchen",
                        "category": product.category or "Sonstiges",
                        "priority": product.priority or 0
                    }
            
            slot_data.append(slot_info)
        
        config_data.append({
            "id": config.id,
            "time_of_day": config.time_of_day,
            "layout_data": layout_data,
            "slots": slot_data
        })
    
    result = {
        "id": case.id,
        "name": case.name,
        "description": case.description,
        "layout_type": case.layout_type,
        "rows": case.rows,
        "columns": case.columns,
        "configurations": config_data
    }
    
    return result


@app.get('/display-configurations/{time_of_day}')
def get_display_configuration_by_time(time_of_day: str, db: Session = Depends(get_db)):
    """Eine Auslagenkonfiguration für eine bestimmte Tageszeit abrufen"""
    config = db.query(DisplayConfiguration).filter(
        DisplayConfiguration.time_of_day == time_of_day
    ).first()
    
    if not config:
        raise HTTPException(status_code=404, detail="Konfiguration nicht gefunden")
    
    # Layout-Daten parsen
    try:
        import json
        layout_data = json.loads(config.layout_data) if config.layout_data else {}
    except:
        layout_data = {}
    
    # Slots mit Produkten abrufen
    slots = db.query(DisplaySlot).filter(
        DisplaySlot.configuration_id == config.id
    ).all()
    
    slot_data = []
    for slot in slots:
        slot_info = {
            "row_index": slot.row_index,
            "column_index": slot.column_index,
            "product": None
        }
        
        # Produkt hinzufügen, falls vorhanden
        if slot.item_id:
            product = db.query(Item).filter(Item.id == slot.item_id).first()
            if product:
                slot_info["product"] = {
                    "id": product.id,
                    "name": product.name,
                    "display_name": product.display_name or product.name,
                    "icon_type": product.icon_type or "broetchen",
                    "category": product.category or "Sonstiges",
                    "priority": product.priority or 0
                }
        
        slot_data.append(slot_info)
    
    result = {
        "id": config.id,
        "display_case_id": config.display_case_id,
        "time_of_day": config.time_of_day,
        "layout_data": layout_data,
        "slots": slot_data
    }
    
    return result
