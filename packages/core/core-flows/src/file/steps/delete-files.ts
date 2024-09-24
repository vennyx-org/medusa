import { IFileModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteFilesStepId = "delete-files"
/**
 * This step deletes one or more files.
 */
export const deleteFilesStep = createStep(
  { name: deleteFilesStepId, noCompensation: true },
  async (ids: string[], { container }) => {
    const service = container.resolve<IFileModuleService>(Modules.FILE)

    await service.deleteFiles(ids)
    return new StepResponse(void 0)
  },
  async () => {}
)
