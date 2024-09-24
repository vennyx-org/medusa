import { IInventoryService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { Modules } from "@medusajs/utils"

export const deleteInventoryLevelsStepId = "delete-inventory-levels-step"
/**
 * This step deletes one or more inventory levels.
 */
export const deleteInventoryLevelsStep = createStep(
  deleteInventoryLevelsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IInventoryService>(Modules.INVENTORY)

    await service.softDeleteInventoryLevels(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevLevelIds, { container }) => {
    if (!prevLevelIds?.length) {
      return
    }

    const service = container.resolve<IInventoryService>(Modules.INVENTORY)

    await service.restoreInventoryLevels(prevLevelIds)
  }
)
