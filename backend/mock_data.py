from datetime import date, timedelta
import random

from database import SessionLocal, init_db, Tenant, Item, Sale

ITEMS = [
    "Baguette", "Croissant", "Brot", "Kuchen", "Muffin", "Keks",
    "Donut", "Bagel", "Brezel", "Tarte", "Ciabatta", "Focaccia",
    "Scone", "Pita", "Brioche", "Strudel", "Bauernbrot", "Kornspitz",
    "Streuselschnecke", "Laugenstange"
]


def populate():
    init_db()
    db = SessionLocal()
    if db.query(Tenant).first():
        print("Database already populated")
        db.close()
        return

    tenant = Tenant(name="Demo Bakery")
    db.add(tenant)
    db.commit()
    db.refresh(tenant)

    item_objs = []
    for name in ITEMS:
        item = Item(name=name, tenant_id=tenant.id)
        db.add(item)
        item_objs.append(item)
    db.commit()

    start = date.today() - timedelta(weeks=4)
    for day_offset in range(28):
        d = start + timedelta(days=day_offset)
        for item in item_objs:
            sale = Sale(
                tenant_id=tenant.id,
                item_id=item.id,
                date=d,
                quantity=random.randint(0, 30)
            )
            db.add(sale)
    db.commit()
    db.close()
    print("Inserted demo data")


if __name__ == "__main__":
    populate()
