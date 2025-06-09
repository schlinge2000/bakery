from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Date, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

Base = declarative_base()

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    items = relationship("Item", back_populates="tenant")
    sales = relationship("Sale", back_populates="tenant")
    display_cases = relationship("DisplayCase", back_populates="tenant")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    name = Column(String, index=True)
    tenant = relationship("Tenant", back_populates="items")
    sales = relationship("Sale", back_populates="item")
    
    # Neue Felder für die Anzeige in der Auslage
    display_name = Column(String, nullable=True)  # Anzeigename (kann vom Namen abweichen)
    icon_type = Column(String, nullable=True)     # Art des Icons (z.B. "broetchen", "baguette")
    category = Column(String, nullable=True)      # Kategorie (z.B. "Brot", "Gebäck")
    priority = Column(Integer, default=0)         # Priorität für die Auslage

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    date = Column(Date)
    quantity = Column(Float)
    item = relationship("Item", back_populates="sales")
    tenant = relationship("Tenant", back_populates="sales")

# Neue Tabellen für die Auslage
class DisplayCase(Base):
    __tablename__ = "display_cases"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)          # Name der Auslage (z.B. "Haupttheke")
    description = Column(String, nullable=True)    # Beschreibung
    layout_type = Column(String, default="grid")    # Art des Layouts (z.B. "grid", "L-form", "U-form")
    rows = Column(Integer, default=4)              # Anzahl der Reihen
    columns = Column(Integer, default=5)           # Anzahl der Spalten
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    
    tenant = relationship("Tenant", back_populates="display_cases")
    configurations = relationship("DisplayConfiguration", back_populates="display_case")

class DisplayConfiguration(Base):
    __tablename__ = "display_configurations"
    
    id = Column(Integer, primary_key=True, index=True)
    display_case_id = Column(Integer, ForeignKey("display_cases.id"))
    time_of_day = Column(String, nullable=False)   # Tageszeit (z.B. "06:00", "08:00")
    layout_data = Column(Text)                     # JSON-String mit Layout-Daten
    
    display_case = relationship("DisplayCase", back_populates="configurations")
    slots = relationship("DisplaySlot", back_populates="configuration")

class DisplaySlot(Base):
    __tablename__ = "display_slots"
    
    id = Column(Integer, primary_key=True, index=True)
    configuration_id = Column(Integer, ForeignKey("display_configurations.id"))
    row_index = Column(Integer, nullable=False)    # Zeilenindex
    column_index = Column(Integer, nullable=False)  # Spaltenindex
    item_id = Column(Integer, ForeignKey("items.id"), nullable=True)  # Produkt in diesem Slot
    
    configuration = relationship("DisplayConfiguration", back_populates="slots")
    item = relationship("Item")

# SQLite-Datenbank erstellen
Base.metadata.create_all(bind=engine)

# Session-Factory erstellen
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Hilfsfunktion zum Erstellen einer Datenbankverbindung
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
