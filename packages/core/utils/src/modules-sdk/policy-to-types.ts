import { FileSystem } from "../common/file-system"
import { Policy, PolicyOperation, PolicyResource } from "./define-policies"

/**
 * Generates TypeScript type definitions for RBAC Resource, Operation, and Policy.
 * Creates a "policy-bindings.d.ts" file with type-safe autocomplete.
 *
 * @param outputDir - Directory where the type definition file should be created
 */
export async function generatePolicyTypes({
  outputDir,
}: {
  outputDir: string
}) {
  const policyTypeEntries: string[] = []

  // Generate type entries for each named policy from Policy object
  for (const [name, { resource, operation }] of Object.entries(Policy)) {
    policyTypeEntries.push(
      `  ${name}: { resource: "${resource}"; operation: "${operation}" }`
    )
  }

  // If no policies are registered, create empty types
  const policyInterface =
    policyTypeEntries.length > 0
      ? `{\n${policyTypeEntries.join("\n")}\n}`
      : "{}"

  const fileSystem = new FileSystem(outputDir)
  const fileName = "policy-bindings.d.ts"
  const fileContents = `declare module '@medusajs/framework/utils' {
  /**
   * RBAC Resource registry with lowercase keys for type-safe access.
   * All resource names are normalized to lowercase.
   * 
   * @example
   * import { PolicyResource } from '@medusajs/framework/utils'
   * 
   * const productResource = PolicyResource.product // "product"
   * const apiKeyResource = PolicyResource.api_key // "api-key"
   */
  export const Resource: {
${Object.entries(PolicyResource)
  .map(([key, val]) => `    readonly ${key}: "${val}"`)
  .join("\n")}
  }

  /**
   * RBAC Operation registry with lowercase keys for type-safe access.
   * All operation names are normalized to lowercase.
   * 
   * @example
   * import { PolicyOperation } from '@medusajs/framework/utils'
   * 
   * const readOp = PolicyOperation.read // "read"
   */
  export const Operation: {
${Object.entries(PolicyOperation)
  .map(([key, val]) => `    readonly ${key}: "${val}"`)
  .join("\n")}
  }

  /**
   * RBAC Policy registry with all defined policies.
   * Maps policy names to their resource and operation pairs.
   * 
   * @example
   * import { Policy } from '@medusajs/framework/utils'
   * 
   * const readProduct = Policy.ReadProduct
   * // { resource: "product", operation: "read" }
   */
  export const Policy: ${policyInterface}
}`

  await fileSystem.create(fileName, fileContents)
}
