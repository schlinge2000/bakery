from datetime import date, timedelta
import random
import json
from sqlalchemy.orm import Session

from database import SessionLocal, Tenant, Item, Sale, DisplayCase, DisplayConfiguration, DisplaySlot

def populate_db():
    """Populate the database with mock data"""
    db = SessionLocal()
    
    # Check if database is already populated
    if db.query(Tenant).first():
        print("Database already populated")
        db.close()
        return
    
    # Create tenant
    tenant = Tenant(name="Demo Bakery")
    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    
    # Create items with display properties
    items = [
        Item(
            name="Vollkornbrot", 
            tenant_id=tenant.id, 
            display_name="Vollkornbrot", 
            icon_type="brot", 
            category="Brot",
            priority=1
        ),
        Item(
            name="Weizenbrötchen", 
            tenant_id=tenant.id, 
            display_name="Brötchen", 
            icon_type="broetchen", 
            category="Kleingebäck",
            priority=2
        ),
        Item(
            name="Croissant", 
            tenant_id=tenant.id, 
            display_name="Croissant", 
            icon_type="croissant", 
            category="Feingebäck",
            priority=2
        ),
        Item(
            name="Baguette", 
            tenant_id=tenant.id, 
            display_name="Baguette", 
            icon_type="baguette", 
            category="Brot",
            priority=1
        ),
        Item(
            name="Brezel", 
            tenant_id=tenant.id, 
            display_name="Brezel", 
            icon_type="brezel", 
            category="Kleingebäck",
            priority=2
        ),
        Item(
            name="Laugenstange", 
            tenant_id=tenant.id, 
            display_name="Laugenstange", 
            icon_type="laugenstange", 
            category="Kleingebäck",
            priority=2
        ),
        Item(
            name="Kürbiskernbrot", 
            tenant_id=tenant.id, 
            display_name="Kürbiskernbrot", 
            icon_type="kuerbiskernbrot", 
            category="Brot",
            priority=1
        ),
        Item(
            name="Apfeltasche", 
            tenant_id=tenant.id, 
            display_name="Apfeltasche", 
            icon_type="apfeltasche", 
            category="Feingebäck",
            priority=3
        ),
        Item(
            name="Nussecke", 
            tenant_id=tenant.id, 
            display_name="Nussecke", 
            icon_type="nussecken", 
            category="Feingebäck",
            priority=3
        ),
    ]
    db.add_all(items)
    db.commit()
    
    # Create sales (4 weeks)
    today = date.today()
    for item in items:
        for i in range(28):
            d = today - timedelta(days=i)
            quantity = random.randint(10, 100)
            sale = Sale(
                date=d,
                quantity=quantity,
                item_id=item.id,
                tenant_id=tenant.id,
            )
            db.add(sale)
    
    db.commit()
    
    # Create display case
    display_case = DisplayCase(
        name="Haupttheke",
        description="Zentrale Verkaufstheke",
        layout_type="grid",
        rows=4,
        columns=5,
        tenant_id=tenant.id
    )
    db.add(display_case)
    db.commit()
    db.refresh(display_case)
    
    # Create display configurations for different times of day
    times = ["06:00", "08:00", "11:00", "14:00", "17:00"]
    
    for time_of_day in times:
        config = DisplayConfiguration(
            display_case_id=display_case.id,
            time_of_day=time_of_day,
            layout_data=json.dumps({
                "layout_type": "grid",
                "rows": 4,
                "columns": 5
            })
        )
        db.add(config)
        db.commit()
        db.refresh(config)
        
        # Fill some slots with products for each configuration
        available_items = items.copy()
        random.shuffle(available_items)
        
        # Vary the number of filled slots based on time of day
        if time_of_day == "06:00":
            fill_count = 6  # Fewer products in the morning
        elif time_of_day == "08:00":
            fill_count = 10  # More products at breakfast time
        elif time_of_day == "11:00":
            fill_count = 15  # Many products at lunch time
        elif time_of_day == "14:00":
            fill_count = 12  # Fewer products in the afternoon
        else:  # 17:00
            fill_count = 8   # Even fewer in the evening
        
        # Create slots and fill some with products
        slots = []
        for row in range(display_case.rows):
            for col in range(display_case.columns):
                # Some slots remain empty
                if len(slots) < fill_count and available_items:
                    item = available_items.pop(0)
                    slot = DisplaySlot(
                        configuration_id=config.id,
                        row_index=row,
                        column_index=col,
                        item_id=item.id
                    )
                else:
                    slot = DisplaySlot(
                        configuration_id=config.id,
                        row_index=row,
                        column_index=col,
                        item_id=None  # Empty slot
                    )
                slots.append(slot)
        
        db.add_all(slots)
    
    db.commit()
    db.close()
    print("Inserted demo data")

if __name__ == "__main__":
    from database import init_db
    init_db()
    populate_db()
