import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional

class DriverStatus(Enum):
    AVAILABLE = "AVAILABLE"
    ON_ROUTE = "ON_ROUTE"
    UNAVAILABLE = "UNAVAILABLE"

class CollectionStatus(Enum):
    AWAITING_BRICKYARD = "AWAITING_BRICKYARD"
    AWAITING_DRIVER = "AWAITING_DRIVER"
    ON_ROUTE = "ON_ROUTE"
    COMPLETED = "COMPLETED"

@dataclass
class AcaiProducer:
    business_name: str
    latitude: float
    longitude: float
    current_volume_kg: float = 0.0
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    def request_collection(self, volume: float) -> str:
        if volume <= 0:
            raise ValueError("Collection volume must be greater than zero.")
        self.current_volume_kg = volume
        return f"Collection of {volume}kg requested by {self.business_name}."

@dataclass
class Driver:
    name: str
    license_plate: str
    max_capacity_kg: float
    status: DriverStatus = DriverStatus.AVAILABLE
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    def accept_route(self) -> str:
        if self.status != DriverStatus.AVAILABLE:
            raise ValueError(f"Driver {self.name} is not available.")
        self.status = DriverStatus.ON_ROUTE
        return f"Driver {self.name} accepted the route."

    def complete_route(self) -> str:
        self.status = DriverStatus.AVAILABLE
        return f"Driver {self.name} completed the route and is now available."

@dataclass
class Brickyard:
    company_name: str
    latitude: float
    longitude: float
    storage_capacity_ton: float
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    def register_receipt(self, volume_kg: float) -> str:
        if volume_kg <= 0:
            raise ValueError("Received volume must be greater than zero.")
        return f"{self.company_name} registered receipt of {volume_kg}kg of açaí seeds."

@dataclass
class Collection:
    producer: AcaiProducer
    collected_volume_kg: float
    driver: Optional[Driver] = None
    brickyard: Optional[Brickyard] = None
    status: CollectionStatus = CollectionStatus.AWAITING_BRICKYARD
    scheduled_at: datetime = field(default_factory=datetime.now)
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    def assign_brickyard(self, brickyard: Brickyard) -> str:
        if self.status != CollectionStatus.AWAITING_BRICKYARD:
            raise ValueError("Collection is not waiting for a brickyard.")
        self.brickyard = brickyard
        self.status = CollectionStatus.AWAITING_DRIVER
        return f"Brickyard {self.brickyard.company_name} assigned to collection {self.id}."

    def start(self, driver: Driver) -> str:
        if self.status != CollectionStatus.AWAITING_DRIVER:
            raise ValueError("Collection is not waiting for a driver.")
        self.driver = driver
        self.status = CollectionStatus.ON_ROUTE
        self.driver.accept_route()
        return f"Collection {self.id} started by driver {self.driver.name}."

    def complete(self) -> str:
        if self.status != CollectionStatus.ON_ROUTE:
            raise ValueError("Collection must be ON_ROUTE to be completed.")
        if not self.driver or not self.brickyard:
            raise ValueError("Collection is missing a driver or a brickyard.")
        self.status = CollectionStatus.COMPLETED
        self.driver.complete_route()
        self.brickyard.register_receipt(self.collected_volume_kg)
        return f"Collection {self.id} completed. {self.collected_volume_kg}kg delivered to {self.brickyard.company_name}."