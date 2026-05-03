from domain.entities import AcaiProducer, Collection, Driver, Brickyard, CollectionStatus
from datetime import datetime


def request_collection(
    producer: AcaiProducer,
    driver: Driver,
    brickyard: Brickyard,
    volume_kg: float,
) -> Collection:
    """
    Use case: an AcaiProducer requests a new collection.
    Creates a Collection in PENDING state, ready to be assigned to a route.
    """
    producer.request_collection(volume_kg)

    collection = Collection(
        producer=producer,
        driver=driver,
        brickyard=brickyard,
        collected_volume_kg=volume_kg,
        status=CollectionStatus.PENDING,
        scheduled_at=datetime.now(),
    )

    return collection