from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, ConfigDict

from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# -----------------------------------
# DATABASE CONFIGURATION
# -----------------------------------

DATABASE_URL = "sqlite:///./items.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


# -----------------------------------
# DATABASE MODEL
# -----------------------------------

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


# Create database tables
Base.metadata.create_all(bind=engine)


# -----------------------------------
# PYDANTIC SCHEMAS
# -----------------------------------

class ItemCreate(BaseModel):
    name: str
    description: str


class ItemUpdate(BaseModel):
    name: str
    description: str


class ItemResponse(BaseModel):
    id: int
    name: str
    description: str

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------
# FASTAPI APP
# -----------------------------------

app = FastAPI()


# -----------------------------------
# CORS
# -----------------------------------

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------
# DATABASE DEPENDENCY
# -----------------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# -----------------------------------
# HOME
# -----------------------------------

@app.get("/")
def home():
    return {
        "message": "FastAPI CRUD API is running"
    }


# -----------------------------------
# CREATE
# POST /items
# -----------------------------------

@app.post(
    "/items",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED
)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db)
):

    new_item = Item(
        name=item.name,
        description=item.description
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


# -----------------------------------
# READ ALL
# GET /items
# -----------------------------------

@app.get(
    "/items",
    response_model=list[ItemResponse]
)
def get_items(
    db: Session = Depends(get_db)
):

    items = db.query(Item).all()

    return items


# -----------------------------------
# READ ONE
# GET /items/1
# -----------------------------------

@app.get(
    "/items/{item_id}",
    response_model=ItemResponse
)
def get_item(
    item_id: int,
    db: Session = Depends(get_db)
):

    item = (
        db.query(Item)
        .filter(Item.id == item_id)
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    return item


# -----------------------------------
# UPDATE
# PUT /items/1
# -----------------------------------

@app.put(
    "/items/{item_id}",
    response_model=ItemResponse
)
def update_item(
    item_id: int,
    updated_item: ItemUpdate,
    db: Session = Depends(get_db)
):

    item = (
        db.query(Item)
        .filter(Item.id == item_id)
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    item.name = updated_item.name
    item.description = updated_item.description

    db.commit()
    db.refresh(item)

    return item


# -----------------------------------
# DELETE
# DELETE /items/1
# -----------------------------------

@app.delete("/items/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db)
):

    item = (
        db.query(Item)
        .filter(Item.id == item_id)
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Item deleted successfully"
    }