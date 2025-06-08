from fastapi import FastAPI
from pydantic import BaseModel

class DemandRequest(BaseModel):
    branch: str
    days_ahead: int

app = FastAPI()

@app.post('/predict')
def predict_demand(req: DemandRequest):
    predictions = [
        {'day': i + 1, 'bread': 20 * (i + 1), 'pastry': 10 * (i + 1)}
        for i in range(req.days_ahead)
    ]
    return {'branch': req.branch, 'predictions': predictions}
