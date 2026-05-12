from domain.entities import Collection, Brickyard, CollectionStatus

def assign_brickyard(collection: Collection, brickyard: Brickyard) -> str:
    if collection.status != CollectionStatus.AWAITING_BRICKYARD:
        raise ValueError(
            f"Cannot assign brickyard. Collection {collection.id} is not AWAITING_BRICKYARD."
        )

    result = collection.assign_brickyard(brickyard)
    return result