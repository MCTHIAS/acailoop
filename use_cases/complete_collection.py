from domain.entities import Collection, CollectionStatus

def complete_collection(collection: Collection) -> str:
    if collection.status != CollectionStatus.ON_ROUTE:
        raise ValueError(
            f"Cannot complete collection. Collection {collection.id} is not ON_ROUTE."
        )

    result = collection.complete()
    return result