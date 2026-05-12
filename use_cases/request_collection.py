from domain.entities import AcaiProducer, Collection, CollectionStatus
from datetime import datetime

def request_collection(
    producer: AcaiProducer,
    volume_kg: float,
) -> Collection:
    producer.request_collection(volume_kg)

    collection = Collection(
        producer=producer,
        collected_volume_kg=volume_kg,
        status=CollectionStatus.AWAITING_BRICKYARD,
        scheduled_at=datetime.now(),
    )

    return collection