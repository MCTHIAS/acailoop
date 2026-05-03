from domain.entities import Collection, CollectionStatus


def complete_collection(collection: Collection) -> str:
    """
    Use case: marks a collection as completed after the brickyard confirms receipt.
    The driver's status is reset to AVAILABLE inside collection.complete().
    """
    if collection.status != CollectionStatus.ON_ROUTE:
        raise ValueError(
            f"Cannot complete collection. Collection {collection.id} is not ON_ROUTE."
        )

    result = collection.complete()
    return result