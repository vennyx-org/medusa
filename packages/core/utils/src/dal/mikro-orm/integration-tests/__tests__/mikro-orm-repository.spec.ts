import {
  BeforeCreate,
  Collection,
  Entity,
  EntityManager,
  ManyToMany,
  ManyToOne,
  MikroORM,
  OneToMany,
  OnInit,
  PrimaryKey,
  Property,
  Unique,
  wrap,
} from "@mikro-orm/core"
import { mikroOrmBaseRepositoryFactory } from "../../mikro-orm-repository"
import { dropDatabase } from "pg-god"
import { MikroOrmBigNumberProperty } from "../../big-number-field"
import BigNumber from "bignumber.js"
import { BigNumberRawValue } from "@medusajs/types"
import { getDatabaseURL, pgGodCredentials } from "../__fixtures__/database"

const dbName = "mikroorm-integration-1"

jest.setTimeout(300000)
@Entity()
class Entity1 {
  @PrimaryKey()
  id: string

  @Property()
  title: string

  @MikroOrmBigNumberProperty({ nullable: true })
  amount: BigNumber | number | null

  @Property({ columnType: "jsonb", nullable: true })
  raw_amount: BigNumberRawValue | null

  @Property({ nullable: true })
  deleted_at: Date | null

  @OneToMany(() => Entity2, (entity2) => entity2.entity1)
  entity2 = new Collection<Entity2>(this)

  @ManyToMany(() => Entity3, "entity1", {
    owner: true,
    pivotTable: "entity_1_3",
  })
  entity3 = new Collection<Entity3>(this)

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }
}

@Entity()
class Entity2 {
  @PrimaryKey()
  id: string

  @Property()
  title: string

  @Unique()
  @Property()
  handle: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => Entity1, {
    columnType: "text",
    nullable: true,
    mapToPk: true,
    fieldName: "entity1_id",
    onDelete: "set null",
  })
  entity1_id: string

  @ManyToOne(() => Entity1, { persist: false, nullable: true })
  entity1: Entity1 | null

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }

    this.entity1_id ??= this.entity1?.id!
  }
}

@Entity()
class Entity3 {
  @PrimaryKey()
  id: string

  @Unique()
  @Property()
  title: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToMany(() => Entity1, (entity1) => entity1.entity3)
  entity1 = new Collection<Entity1>(this)

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }
}

const Entity1Repository = mikroOrmBaseRepositoryFactory<Entity1>(Entity1)
const Entity2Repository = mikroOrmBaseRepositoryFactory<Entity2>(Entity2)
const Entity3Repository = mikroOrmBaseRepositoryFactory<Entity3>(Entity3)

describe("mikroOrmRepository", () => {
  let orm!: MikroORM
  let manager!: EntityManager
  const manager1 = () => {
    return new Entity1Repository({ manager: manager.fork() })
  }
  const manager2 = () => {
    return new Entity2Repository({ manager: manager.fork() })
  }
  const manager3 = () => {
    return new Entity3Repository({ manager: manager.fork() })
  }

  beforeEach(async () => {
    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )

    orm = await MikroORM.init({
      entities: [Entity1, Entity2],
      clientUrl: getDatabaseURL(dbName),
      type: "postgresql",
    })

    const generator = orm.getSchemaGenerator()
    await generator.ensureDatabase()
    await generator.createSchema()

    manager = orm.em.fork()
  })

  afterEach(async () => {
    const generator = orm.getSchemaGenerator()
    await generator.dropSchema()
    await orm.close(true)
  })

  describe("upsert with replace", () => {
    it("should successfully create a flat entity", async () => {
      const entity1 = { id: "1", title: "en1", amount: 100 }

      const { performedActions } = await manager1().upsertWithReplace([entity1])

      expect(performedActions).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        updated: {},
        deleted: {},
      })

      const listedEntities = await manager1().find()

      expect(listedEntities).toHaveLength(1)
      expect(wrap(listedEntities[0]).toPOJO()).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
          amount: 100,
          raw_amount: { value: "100", precision: 20 },
        })
      )
    })

    it("should successfully update a flat entity", async () => {
      const entity1 = { id: "1", title: "en1" }

      const { performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1])

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        updated: {},
        deleted: {},
      })

      entity1.title = "newen1"
      const { performedActions: performedActions2 } =
        await manager1().upsertWithReplace([entity1])

      expect(performedActions2).toEqual({
        created: {},
        updated: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        deleted: {},
      })

      const listedEntities = await manager1().find()

      expect(listedEntities).toHaveLength(1)
      expect(wrap(listedEntities[0]).toPOJO()).toEqual(
        expect.objectContaining({
          id: "1",
          title: "newen1",
        })
      )
    })

    it("should successfully do a partial update a flat entity", async () => {
      const entity1 = { id: "1", title: "en1" }

      const { performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1])

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        updated: {},
        deleted: {},
      })

      entity1.title = undefined as any

      const { performedActions: performedActions2 } =
        await manager1().upsertWithReplace([entity1])

      expect(performedActions2).toEqual({
        created: {},
        updated: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        deleted: {},
      })

      const listedEntities = await manager1().find()

      expect(listedEntities).toHaveLength(1)
      expect(wrap(listedEntities[0]).toPOJO()).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
    })

    it("should throw if a sub-entity is passed in a many-to-one relation", async () => {
      const entity2 = {
        id: "2",
        title: "en2",
        handle: "some-handle",
        entity1: { title: "en1" },
      }

      const errMsg = await manager2()
        .upsertWithReplace([entity2])
        .catch((e) => e.message)

      expect(errMsg).toEqual(
        "Many-to-one relation entity1 must be set with an ID"
      )
    })

    // TODO: I believe this should not be allowed
    it("should successfully create the parent entity of a many-to-one", async () => {
      const entity2 = {
        id: "2",
        handle: "some-handle",
        title: "en2",
      }

      await manager2().upsertWithReplace([entity2], {
        relations: [],
      })
      const listedEntities = await manager2().find({
        where: { id: "2" },
        options: { populate: ["entity1"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "2",
          title: "en2",
          entity1: null,
        })
      )
    })

    it("should set an entity to parent entity of a many-to-one relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
      }

      const entity2 = {
        id: "2",
        title: "en2",
        handle: "some-handle",
        entity1: { id: "1" },
      }

      await manager1().upsertWithReplace([entity1])
      await manager2().upsertWithReplace([entity2])

      const listedEntities = await manager2().find({
        where: { id: "2" },
        options: { populate: ["entity1"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(JSON.parse(JSON.stringify(listedEntities[0]))).toEqual(
        expect.objectContaining({
          id: "2",
          title: "en2",
          entity1: expect.objectContaining({
            title: "en1",
          }),
        })
      )
    })

    it("should successfully unset an entity of a many-to-one relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
      }

      const entity2 = {
        id: "2",
        title: "en2",
        handle: "some-handle",
        entity1: { id: "1" },
      }

      await manager1().upsertWithReplace([entity1])
      await manager2().upsertWithReplace([entity2])

      entity2.entity1 = null as any
      await manager2().upsertWithReplace([entity2])

      const listedEntities = await manager2().find({
        where: { id: "2" },
        options: { populate: ["entity1"] },
      })

      const listedEntity1 = await manager1().find({
        where: {},
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "2",
          title: "en2",
          entity1: null,
        })
      )

      expect(listedEntity1).toHaveLength(1)
      expect(listedEntity1[0].title).toEqual("en1")
    })

    it("should only create the parent entity of a one-to-many if relation is not included", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [{ title: "en2-1" }, { title: "en2-2" }],
      }

      const { performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1], {
          relations: [],
        })

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        updated: {},
        deleted: {},
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(0)
    })

    it("should successfully create an entity with a sub-entity one-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [
          { title: "en2-1", handle: "some-handle" },
          { title: "en2-2", handle: "some-other-handle" },
        ],
      }

      const { performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1], {
          relations: ["entity2"],
        })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      const entities2 = listedEntities.flatMap((entity1) =>
        entity1.entity2.getItems()
      )

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: entities2.map((entity2) => ({ id: entity2.id })),
        },
        updated: {},
        deleted: {},
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en2-1",
          }),
          expect.objectContaining({
            title: "en2-2",
          }),
        ])
      )
    })

    it("should clear the parent entity from the one-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [{ title: "en2-1", handle: "some-handle", entity1: null }],
      }

      const { performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1], {
          relations: ["entity2"],
        })
      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: [
            expect.objectContaining({ id: listedEntities[0].entity2[0].id }),
          ],
        },
        updated: {},
        deleted: {},
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(1)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en2-1",
          }),
        ])
      )
    })

    it("should only update the parent entity of a one-to-many if relation is not included", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [
          { title: "en2-1", handle: "some-handle" },
          { title: "en2-2", handle: "some-other-handle" },
        ],
      }

      const { entities: entities1, performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1], {
          relations: ["entity2"],
        })

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: entities1[0].entity2.map((entity2) =>
            expect.objectContaining({ id: entity2.id })
          ),
        },
        updated: {},
        deleted: {},
      })

      entity1.entity2.push({ title: "en2-3", handle: "some-new-handle" })

      const { performedActions: performedActions2 } =
        await manager1().upsertWithReplace([entity1], {
          relations: [],
        })

      expect(performedActions2).toEqual({
        created: {},
        updated: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        deleted: {},
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en2-1",
          }),
          expect.objectContaining({
            title: "en2-2",
          }),
        ])
      )
    })

    it("should successfully update, create, and delete subentities an entity with a one-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [
          { id: "2", title: "en2-1", handle: "some-handle" },
          { id: "3", title: "en2-2", handle: "some-other-handle" },
        ] as any[],
      }

      const { entities: entities1, performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1], {
          relations: ["entity2"],
        })

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: entities1[0].entity2.map((entity2) =>
            expect.objectContaining({ id: entity2.id })
          ),
        },
        updated: {},
        deleted: {},
      })

      entity1.entity2 = [
        { id: "2", title: "newen2-1" },
        { title: "en2-3", handle: "some-new-handle" },
      ]

      const { entities: entities2, performedActions: performedActions2 } =
        await manager1().upsertWithReplace([entity1], {
          relations: ["entity2"],
        })

      const entity2En23 = entities2[0].entity2.find((e) => e.title === "en2-3")!

      expect(performedActions2).toEqual({
        created: {
          [Entity2.name]: [expect.objectContaining({ id: entity2En23.id })],
        },
        updated: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: [expect.objectContaining({ id: "2" })],
        },
        deleted: {
          [Entity2.name]: [expect.objectContaining({ id: "3" })],
        },
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "newen2-1",
          }),
          expect.objectContaining({
            title: "en2-3",
          }),
        ])
      )
    })

    it("should update an entity with a one-to-many relation that has the same unique constraint key", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [{ id: "2", title: "en2-1", handle: "some-handle" }] as any[],
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity2"],
      })

      entity1.entity2 = [{ title: "newen2-1", handle: "some-handle" }]
      await manager1().upsertWithReplace([entity1], {
        relations: ["entity2"],
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(1)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "newen2-1",
            handle: "some-handle",
          }),
        ])
      )
    })

    it("should only create the parent entity of a many-to-many if relation is not included", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [{ title: "en3-1" }, { title: "en3-2" }],
      }

      await manager1().upsertWithReplace([entity1], {
        relations: [],
      })
      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity3"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity3.getItems()).toHaveLength(0)
    })

    it("should successfully create an entity with a sub-entity many-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [{ title: "en3-1" }, { title: "en3-2" }],
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })
      const listedEntity1 = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity3"] },
      })

      const listedEntity3 = await manager3().find({
        where: { title: "en3-1" },
        options: { populate: ["entity1"] },
      })

      expect(listedEntity1).toHaveLength(1)
      expect(listedEntity1[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntity1[0].entity3.getItems()).toHaveLength(2)
      expect(listedEntity1[0].entity3.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en3-1",
          }),
          expect.objectContaining({
            title: "en3-2",
          }),
        ])
      )

      expect(listedEntity3).toHaveLength(1)
      expect(listedEntity3[0]).toEqual(
        expect.objectContaining({
          title: "en3-1",
        })
      )
      expect(listedEntity3[0].entity1.getItems()).toHaveLength(1)
      expect(listedEntity3[0].entity1.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en1",
          }),
        ])
      )
    })

    it("should only update the parent entity of a many-to-many if relation is not included", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [{ title: "en3-1" }, { title: "en3-2" }],
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })
      entity1.title = "newen1"
      entity1.entity3.push({ title: "en3-3" })
      await manager1().upsertWithReplace([entity1], {
        relations: [],
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity3"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0].title).toEqual("newen1")

      expect(listedEntities[0].entity3.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity3.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en3-1",
          }),
          expect.objectContaining({
            title: "en3-2",
          }),
        ])
      )
    })

    it("should successfully create subentities and delete pivot relationships on a many-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [
          { id: "4", title: "en3-1" },
          { id: "5", title: "en3-2" },
        ] as any,
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })

      entity1.title = "newen1"
      entity1.entity3 = [{ id: "4", title: "newen3-1" }, { title: "en3-4" }]

      // We don't do many-to-many updates, so id: 4 entity should remain unchanged
      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity3"] },
      })

      const listedEntity3 = await manager3().find({
        where: {},
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0].title).toEqual("newen1")
      expect(listedEntities[0].entity3.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity3.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en3-1",
          }),
          expect.objectContaining({
            title: "en3-4",
          }),
        ])
      )

      // Many-to-many don't get deleted afterwards, even if they were disassociated
      expect(listedEntity3).toHaveLength(3)
    })

    it("should successfully remove relationship when an empty array is passed in a many-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [
          { id: "4", title: "en3-1" },
          { id: "5", title: "en3-2" },
        ] as any,
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })
      entity1.title = "newen1"
      entity1.entity3 = []
      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity3"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0].title).toEqual("newen1")
      expect(listedEntities[0].entity3.getItems()).toHaveLength(0)
    })

    it("should correctly handle sub-entity upserts", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [
          { id: "4", title: "en3-1" },
          { id: "5", title: "en3-2" },
        ] as any,
      }

      const { entities: mainEntity } = await manager1().upsertWithReplace(
        [entity1],
        {
          relations: ["entity3"],
        }
      )

      entity1.title = "newen1"
      entity1.entity3 = [{ id: "4", title: "newen3-1" }, { title: "en3-4" }]

      // We don't do many-to-many updates, so id: 4 entity should remain unchanged
      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })

      // The sub-entity upsert should happen after the main was created
      await manager2().upsertWithReplace([
        {
          id: "2",
          title: "en2",
          handle: "some-handle",
          entity1_id: mainEntity[0].id,
        },
      ])

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2", "entity3"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0].title).toEqual("newen1")
      expect(listedEntities[0].entity2.getItems()).toHaveLength(1)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en2",
          }),
        ])
      )
      expect(listedEntities[0].entity3.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity3.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en3-1",
          }),
          expect.objectContaining({
            title: "en3-4",
          }),
        ])
      )
    })

    it("should return the complete dependency tree as a response, with IDs populated", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [{ title: "en2", handle: "some-handle" }],
        entity3: [{ title: "en3-1" }, { title: "en3-2" }] as any,
      }

      const {
        entities: [createResp],
        performedActions: performedActions1,
      } = await manager1().upsertWithReplace([entity1], {
        relations: ["entity2", "entity3"],
      })

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: createResp.id })],
          [Entity2.name]: [
            expect.objectContaining({ id: createResp.entity2[0].id }),
          ],
          [Entity3.name]: createResp.entity3.map((entity3) =>
            expect.objectContaining({ id: entity3.id })
          ),
        },
        updated: {},
        deleted: {},
      })

      createResp.title = "newen1"
      const {
        entities: [updateResp],
      } = await manager1().upsertWithReplace([createResp], {
        relations: ["entity2", "entity3"],
      })

      expect(createResp.id).toEqual("1")
      expect(createResp.title).toEqual("newen1")
      expect(createResp.entity2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "en2",
          }),
        ])
      )
      expect(createResp.entity3).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "en3-1",
          }),
          expect.objectContaining({
            id: expect.any(String),
            title: "en3-2",
          }),
        ])
      )

      expect(updateResp.id).toEqual("1")
      expect(updateResp.title).toEqual("newen1")
      expect(updateResp.entity2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "en2",
          }),
        ])
      )
      expect(updateResp.entity3).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "en3-1",
          }),
          expect.objectContaining({
            id: expect.any(String),
            title: "en3-2",
          }),
        ])
      )
    })

    it("should correctly handle many-to-many upserts with a uniqueness constriant on a non-primary key", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [
          { id: "4", title: "en3-1" },
          { id: "5", title: "en3-2" },
        ] as any,
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })

      await manager1().upsertWithReplace([{ ...entity1, id: "2" }], {
        relations: ["entity3"],
      })

      const listedEntities = await manager1().find({
        where: {},
        options: { populate: ["entity3"] },
      })

      expect(listedEntities).toHaveLength(2)
      expect(listedEntities[0].entity3.getItems()).toEqual(
        listedEntities[1].entity3.getItems()
      )
    })
  })

  describe("error mapping", () => {
    it("should map UniqueConstraintViolationException to MedusaError on upsertWithReplace", async () => {
      const entity3 = { title: "en3" }
      await manager3().upsertWithReplace([entity3])
      const err = await manager3()
        .upsertWithReplace([entity3])
        .catch((e) => e.message)

      expect(err).toEqual("Entity3 with title: en3, already exists.")
    })

    it("should map NotNullConstraintViolationException MedusaError on upsertWithReplace", async () => {
      const entity3 = { title: null }
      const err = await manager3()
        .upsertWithReplace([entity3])
        .catch((e) => e.message)

      expect(err).toEqual("Cannot set field 'title' of Entity3 to null")
    })

    it("should map InvalidFieldNameException MedusaError on upsertWithReplace", async () => {
      const entity3 = { othertitle: "en3" }
      const err = await manager3()
        .upsertWithReplace([entity3])
        .catch((e) => e.message)

      expect(err).toEqual(
        'column "othertitle" of relation "entity3" does not exist'
      )
    })
    it("should map ForeignKeyConstraintViolationException MedusaError on upsertWithReplace", async () => {
      const entity2 = {
        title: "en2",
        handle: "some-handle",
        entity1: { id: "1" },
      }
      const err = await manager2()
        .upsertWithReplace([entity2])
        .catch((e) => e.message)

      expect(err).toEqual(
        "You tried to set relationship entity1_id: 1, but such entity does not exist"
      )
    })
  })
})
