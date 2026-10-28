import { Module, Modules } from "@medusajs/framework/utils"
import { RbacModuleService } from "@services"

export default Module(Modules.RBAC, {
  service: RbacModuleService,
})
