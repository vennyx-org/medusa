import { IModuleService, ModuleResolution } from "@medusajs/types"
import { upperCaseFirst } from "@medusajs/utils"
import { join } from "path"
import {
  ModuleWithDmlMixedWithoutJoinerConfigFixtures,
  ModuleWithDmlWithoutJoinerConfigFixtures,
  ModuleWithJoinerConfigFixtures,
  ModuleWithoutJoinerConfigFixtures,
} from "../__fixtures__"
import { loadResources } from "../load-internal"

describe("load internal - load resources", () => {
  describe("when loading the module resources from a path", () => {
    test("should return the correct resources and generate the correct joiner config from a mix of DML entities and mikro orm entities", async () => {
      const { ModuleService, EntityModel, dmlEntity } =
        ModuleWithDmlMixedWithoutJoinerConfigFixtures

      const moduleResolution: ModuleResolution = {
        resolutionPath: join(
          __dirname,
          "../__fixtures__/module-with-dml-mixed-without-joiner-config"
        ),
        definition: {
          key: "module-with-dml-mixed-without-joiner-config",
          label: "Module with DML mixed without joiner config",
          defaultPackage: false,
          defaultModuleDeclaration: {
            scope: "internal",
            resources: "shared",
          },
        },
      }

      expect(
        (ModuleService.prototype as IModuleService).__joinerConfig
      ).toBeUndefined()

      const resources = await loadResources(moduleResolution)

      expect(resources).toBeDefined()
      expect(resources.services).toHaveLength(1)
      expect(resources.services[0]).toEqual(ModuleService)
      expect(resources.models).toHaveLength(2)
      expect(resources.models).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: upperCaseFirst(dmlEntity.name) }),
          expect.objectContaining({ name: upperCaseFirst(EntityModel.name) }),
        ])
      )
      expect(resources.repositories).toHaveLength(0)
      expect(resources.loaders).toHaveLength(2)
      expect(resources.loaders).toEqual([
        expect.objectContaining({ name: "connectionLoader" }),
        expect.objectContaining({ name: "containerLoader" }),
      ])
      expect(resources.moduleService).toEqual(ModuleService)

      expect(
        (resources.moduleService.prototype as IModuleService).__joinerConfig
      ).toBeDefined()

      const generatedJoinerConfig = (
        resources.moduleService.prototype as IModuleService
      ).__joinerConfig?.()!

      expect(generatedJoinerConfig).toEqual(
        expect.objectContaining({
          serviceName: "module-with-dml-mixed-without-joiner-config",
          primaryKeys: ["id"],
          linkableKeys: {
            dml_entity_id: "DmlEntity",
            entity_model_id: "EntityModel",
          },
          alias: [
            {
              name: ["dml_entity", "dml_entities"],
              entity: "DmlEntity",
              args: {
                methodSuffix: "DmlEntities",
              },
            },
            {
              name: ["entity_model", "entity_models"],
              entity: "EntityModel",
              args: {
                methodSuffix: "EntityModels",
              },
            },
          ],
        })
      )
    })

    test("should return the correct resources and generate the correct joiner config from DML entities", async () => {
      const { ModuleService, entityModel, dmlEntity } =
        ModuleWithDmlWithoutJoinerConfigFixtures

      const moduleResolution: ModuleResolution = {
        resolutionPath: join(
          __dirname,
          "../__fixtures__/module-with-dml-without-joiner-config"
        ),
        definition: {
          key: "module-with-dml-without-joiner-config",
          label: "Module with DML without joiner config",
          defaultPackage: false,
          defaultModuleDeclaration: {
            scope: "internal",
            resources: "shared",
          },
        },
      }

      expect(
        (ModuleService.prototype as IModuleService).__joinerConfig
      ).toBeUndefined()

      const resources = await loadResources(moduleResolution)

      expect(resources).toBeDefined()
      expect(resources.services).toHaveLength(1)
      expect(resources.services[0]).toEqual(ModuleService)
      expect(resources.models).toHaveLength(2)
      expect(resources.models).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: upperCaseFirst(dmlEntity.name) }),
          expect.objectContaining({ name: upperCaseFirst(entityModel.name) }),
        ])
      )
      expect(resources.repositories).toHaveLength(0)
      expect(resources.loaders).toHaveLength(2)
      expect(resources.loaders).toEqual([
        expect.objectContaining({ name: "connectionLoader" }),
        expect.objectContaining({ name: "containerLoader" }),
      ])
      expect(resources.moduleService).toEqual(ModuleService)

      expect(
        (resources.moduleService.prototype as IModuleService).__joinerConfig
      ).toBeDefined()

      const generatedJoinerConfig = (
        resources.moduleService.prototype as IModuleService
      ).__joinerConfig?.()!

      expect(generatedJoinerConfig).toEqual(
        expect.objectContaining({
          serviceName: "module-with-dml-without-joiner-config",
          primaryKeys: ["id"],
          linkableKeys: {
            entity_model_id: "EntityModel",
            dml_entity_id: "DmlEntity",
          },
          alias: [
            {
              name: ["entity_model", "entity_models"],
              entity: "EntityModel",
              args: {
                methodSuffix: "EntityModels",
              },
            },
            {
              name: ["dml_entity", "dml_entities"],
              entity: "DmlEntity",
              args: {
                methodSuffix: "DmlEntities",
              },
            },
          ],
        })
      )
    })

    test("should return the correct resources and generate the correct joiner config from mikro orm entities", async () => {
      const { ModuleService, EntityModel, Entity2 } =
        ModuleWithoutJoinerConfigFixtures

      const moduleResolution: ModuleResolution = {
        resolutionPath: join(
          __dirname,
          "../__fixtures__/module-without-joiner-config"
        ),
        definition: {
          key: "module-without-joiner-config",
          label: "Module without joiner config",
          defaultPackage: false,
          defaultModuleDeclaration: {
            scope: "internal",
            resources: "shared",
          },
        },
      }

      expect(
        (ModuleService.prototype as IModuleService).__joinerConfig
      ).toBeUndefined()

      const resources = await loadResources(moduleResolution)

      expect(resources).toBeDefined()
      expect(resources.services).toHaveLength(1)
      expect(resources.services[0]).toEqual(ModuleService)
      expect(resources.models).toHaveLength(2)
      expect(resources.models).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: upperCaseFirst(EntityModel.name) }),
          expect.objectContaining({ name: upperCaseFirst(Entity2.name) }),
        ])
      )
      expect(resources.repositories).toHaveLength(0)
      expect(resources.loaders).toHaveLength(2)
      expect(resources.loaders).toEqual([
        expect.objectContaining({ name: "connectionLoader" }),
        expect.objectContaining({ name: "containerLoader" }),
      ])
      expect(resources.moduleService).toEqual(ModuleService)

      expect(
        (resources.moduleService.prototype as IModuleService).__joinerConfig
      ).toBeDefined()

      const generatedJoinerConfig = (
        resources.moduleService.prototype as IModuleService
      ).__joinerConfig?.()!

      expect(generatedJoinerConfig).toEqual({
        serviceName: "module-without-joiner-config",
        primaryKeys: ["id"],
        linkableKeys: {
          entity2_id: "Entity2",
          entity_model_id: "EntityModel",
        },
        schema: "",
        alias: [
          {
            name: ["entity2", "entity2s"],
            entity: "Entity2",
            args: {
              methodSuffix: "Entity2s",
            },
          },
          {
            name: ["entity_model", "entity_models"],
            entity: "EntityModel",
            args: {
              methodSuffix: "EntityModels",
            },
          },
        ],
      })
    })

    test("should return the correct resources and use the given joiner config", async () => {
      const { ModuleService, EntityModel, Entity2 } =
        ModuleWithJoinerConfigFixtures

      const moduleResolution: ModuleResolution = {
        resolutionPath: join(
          __dirname,
          "../__fixtures__/module-with-joiner-config"
        ),
        definition: {
          key: "module-without-joiner-config",
          label: "Module without joiner config",
          defaultPackage: false,
          defaultModuleDeclaration: {
            scope: "internal",
            resources: "shared",
          },
        },
      }

      expect(
        (ModuleService.prototype as IModuleService).__joinerConfig
      ).toBeDefined()

      const resources = await loadResources(moduleResolution)

      expect(resources).toBeDefined()
      expect(resources.services).toHaveLength(1)
      expect(resources.services[0]).toEqual(ModuleService)
      expect(resources.models).toHaveLength(2)
      expect(resources.models).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: upperCaseFirst(EntityModel.name) }),
          expect.objectContaining({ name: upperCaseFirst(Entity2.name) }),
        ])
      )
      expect(resources.repositories).toHaveLength(0)
      expect(resources.loaders).toHaveLength(2)
      expect(resources.loaders).toEqual([
        expect.objectContaining({ name: "connectionLoader" }),
        expect.objectContaining({ name: "containerLoader" }),
      ])
      expect(resources.moduleService).toEqual(ModuleService)

      const generatedJoinerConfig = (
        resources.moduleService.prototype as IModuleService
      ).__joinerConfig?.()!

      expect(generatedJoinerConfig).toEqual({
        serviceName: "module-service",
        primaryKeys: ["id"],
        linkableKeys: {},
        schema: "",
        alias: [
          {
            name: ["custom_name"],
            entity: "Custom",
            args: {
              methodSuffix: "Customs",
            },
          },
        ],
      })
    })
  })
})
