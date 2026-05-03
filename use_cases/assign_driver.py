from domain.entities import Collection, CollectionStatus


def assign_driver(collection: Collection) -> str:
    """
    Use case: assigns a driver to a pending collection and starts the route.
    The driver's status is updated to ON_ROUTE inside collection.start().
    """
    if collection.status != CollectionStatus.PENDING:
        raise ValueError(
            f"Cannot assign driver. Collection {collection.id} is not PENDING."
        )

    result = collection.start()
    return result