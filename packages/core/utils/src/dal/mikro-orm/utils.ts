import { Collection, EntityMetadata, FindOptions, wrap } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { buildQuery } from "../../modules-sdk/build-query"

function detectCircularDependency(
  manager: SqlEntityManager,
  entityMetadata: EntityMetadata,
  visited: Set<string> = new Set(),
  shouldStop: boolean = false
) {
  if (shouldStop) {
    return
  }

  visited.add(entityMetadata.className)

  const relations = entityMetadata.relations

  const relationsToCascade = relations.filter((relation) =>
    relation.cascade?.includes("soft-remove" as any)
  )

  for (const relation of relationsToCascade) {
    const branchVisited = new Set(Array.from(visited))

    const isSelfCircularDependency = entityMetadata.class === relation.entity()

    if (!isSelfCircularDependency && branchVisited.has(relation.name)) {
      const dependencies = Array.from(visited)
      dependencies.push(entityMetadata.className)
      const circularDependencyStr = dependencies.join(" -> ")

      throw new Error(
        `Unable to soft delete the ${relation.name}. Circular dependency detected: ${circularDependencyStr}`
      )
    }
    branchVisited.add(relation.name)

    const relationEntityMetadata = manager
      .getDriver()
      .getMetadata()
      .get(relation.type)

    detectCircularDependency(
      manager,
      relationEntityMetadata,
      branchVisited,
      isSelfCircularDependency
    )
  }
}

async function performCascadingSoftDeletion<T>(
  manager: SqlEntityManager,
  entity: T & { id: string; deleted_at?: string | Date | null },
  value: Date | null
) {
  if (!("deleted_at" in entity)) return

  entity.deleted_at = value

  const entityName = entity.constructor.name

  const relations = manager.getDriver().getMetadata().get(entityName).relations

  const relationsToCascade = relations.filter((relation) =>
    relation.cascade?.includes("soft-remove" as any)
  )

  for (const relation of relationsToCascade) {
    let entityRelation = entity[relation.name]

    // Handle optional relationships
    if (relation.nullable && !entityRelation) {
      continue
    }

    const retrieveEntity = async () => {
      const query = buildQuery(
        {
          id: entity.id,
        },
        {
          relations: [relation.name],
          withDeleted: true,
        }
      )
      return await manager.findOne(
        entity.constructor.name,
        query.where,
        query.options as FindOptions<any>
      )
    }

    entityRelation = await retrieveEntity()
    entityRelation = entityRelation[relation.name]
    if (!entityRelation) {
      continue
    }

    const isCollection = "toArray" in entityRelation
    let relationEntities: any[] = []

    if (isCollection) {
      if (!(entityRelation as Collection<any, any>).isInitialized()) {
        entityRelation = await retrieveEntity()
        entityRelation = entityRelation[relation.name]
      }
      relationEntities = entityRelation.getItems()
    } else {
      const wrappedEntity = wrap(entityRelation)

      let initializedEntityRelation = entityRelation
      if (!wrappedEntity.isInitialized()) {
        initializedEntityRelation = await wrap(entityRelation).init()
      }

      relationEntities = [initializedEntityRelation]
    }

    if (!relationEntities.length) {
      continue
    }

    await mikroOrmUpdateDeletedAtRecursively(manager, relationEntities, value)
  }

  await manager.persist(entity)
}

export const mikroOrmUpdateDeletedAtRecursively = async <
  T extends object = any
>(
  manager: SqlEntityManager,
  entities: (T & { id: string; deleted_at?: string | Date | null })[],
  value: Date | null
) => {
  for (const entity of entities) {
    const entityMetadata = manager
      .getDriver()
      .getMetadata()
      .get(entity.constructor.name)
    detectCircularDependency(manager, entityMetadata)
    await performCascadingSoftDeletion(manager, entity, value)
  }
}
