import { CreateStoreDTO, IStoreModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createStoresStepId = "create-stores"
/**
 * This step creates one or more stores.
 */
export const createStoresStep = createStep(
  createStoresStepId,
  async (data: CreateStoreDTO[], { container }) => {
    const service = container.resolve<IStoreModuleService>(Modules.STORE)

    const created = await service.createStores(data)
    return new StepResponse(
      created,
      created.map((store) => store.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IStoreModuleService>(Modules.STORE)

    await service.deleteStores(createdIds)
  }
)
