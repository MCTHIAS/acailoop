from domain.entities import Collection, Driver, CollectionStatus

def assign_driver(collection: Collection, driver: Driver) -> str:
    if collection.status != CollectionStatus.AWAITING_DRIVER:
        raise ValueError(
            f"Cannot assign driver. Collection {collection.id} is not AWAITING_DRIVER."
        )

    result = collection.start(driver)
    return result