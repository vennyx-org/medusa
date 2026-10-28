import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.MEDUSA_FF_RBAC = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let container

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    afterAll(async () => {
      delete process.env.MEDUSA_FF_RBAC
    })

    describe("RBAC Roles - Admin API", () => {
      describe("POST /admin/rbac/roles", () => {
        it("should create a role", async () => {
          const response = await api.post(
            "/admin/rbac/roles",
            {
              name: "Viewer",
              description: "Can view resources",
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.role).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "Viewer",
              description: "Can view resources",
            })
          )
        })

        it("should create a role with metadata", async () => {
          const response = await api.post(
            "/admin/rbac/roles",
            {
              name: "Editor",
              description: "Can edit resources",
              metadata: { department: "sales" },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.role).toEqual(
            expect.objectContaining({
              name: "Editor",
              metadata: { department: "sales" },
            })
          )
        })
      })

      describe("GET /admin/rbac/roles", () => {
        beforeEach(async () => {
          await api.post(
            "/admin/rbac/roles",
            {
              name: "Viewer",
              description: "Can view resources",
            },
            adminHeaders
          )

          await api.post(
            "/admin/rbac/roles",
            {
              name: "Editor",
              description: "Can edit resources",
            },
            adminHeaders
          )

          await api.post(
            "/admin/rbac/roles",
            {
              name: "Admin",
              description: "Full access",
            },
            adminHeaders
          )
        })

        it("should list all roles", async () => {
          const response = await api.get("/admin/rbac/roles", adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(3)
          expect(response.data.roles).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                name: "Viewer",
                description: "Can view resources",
              }),
              expect.objectContaining({
                name: "Editor",
                description: "Can edit resources",
              }),
              expect.objectContaining({
                name: "Admin",
                description: "Full access",
              }),
            ])
          )
        })

        it("should filter roles by name", async () => {
          const response = await api.get(
            "/admin/rbac/roles?name=Viewer",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.roles[0]).toEqual(
            expect.objectContaining({
              name: "Viewer",
            })
          )
        })
      })

      describe("GET /admin/rbac/roles/:id", () => {
        it("should retrieve a role by id", async () => {
          const createResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Manager",
              description: "Can manage resources",
            },
            adminHeaders
          )

          const roleId = createResponse.data.role.id

          const response = await api.get(
            `/admin/rbac/roles/${roleId}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.role).toEqual(
            expect.objectContaining({
              id: roleId,
              name: "Manager",
              description: "Can manage resources",
            })
          )
        })
      })

      describe("POST /admin/rbac/roles/:id", () => {
        it("should update a role", async () => {
          const createResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Support",
              description: "Support team",
            },
            adminHeaders
          )

          const roleId = createResponse.data.role.id

          const response = await api.post(
            `/admin/rbac/roles/${roleId}`,
            {
              name: "Customer Support",
              description: "Customer support team with limited access",
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.role).toEqual(
            expect.objectContaining({
              id: roleId,
              name: "Customer Support",
              description: "Customer support team with limited access",
            })
          )
        })
      })

      describe("DELETE /admin/rbac/roles/:id", () => {
        it("should delete a role", async () => {
          const createResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Temporary",
              description: "Temporary role",
            },
            adminHeaders
          )

          const roleId = createResponse.data.role.id

          const deleteResponse = await api.delete(
            `/admin/rbac/roles/${roleId}`,
            adminHeaders
          )

          expect(deleteResponse.status).toEqual(200)
          expect(deleteResponse.data).toEqual({
            id: roleId,
            object: "rbac_role",
            deleted: true,
          })

          const listResponse = await api.get("/admin/rbac/roles", adminHeaders)
          expect(
            listResponse.data.roles.find((r) => r.id === roleId)
          ).toBeUndefined()
        })
      })

      describe("Role Policies", () => {
        let policies
        let viewerRole
        let editorRole
        let adminUser

        beforeEach(async () => {
          const userModule = container.resolve(Modules.USER)
          const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

          // Create policies
          const policy1 = await api.post(
            "/admin/rbac/policies",
            {
              key: "read:products",
              resource: "product",
              operation: "read",
              name: "Read Products",
            },
            adminHeaders
          )

          const policy2 = await api.post(
            "/admin/rbac/policies",
            {
              key: "write:products",
              resource: "product",
              operation: "write",
              name: "Write Products",
            },
            adminHeaders
          )

          const policy3 = await api.post(
            "/admin/rbac/policies",
            {
              key: "delete:products",
              resource: "product",
              operation: "delete",
              name: "Delete Products",
            },
            adminHeaders
          )

          policies = [
            policy1.data.policy,
            policy2.data.policy,
            policy3.data.policy,
          ]

          // Create an admin role with all policies
          const adminRoleResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Admin Role",
              description: "Has all permissions",
            },
            adminHeaders
          )
          const adminRole = adminRoleResponse.data.role

          // Associate all policies with the admin role using the module directly
          const rbacModule = container.resolve(Modules.RBAC)
          await rbacModule.createRbacRolePolicies([
            { role_id: adminRole.id, policy_id: policies[0].id },
            { role_id: adminRole.id, policy_id: policies[1].id },
            { role_id: adminRole.id, policy_id: policies[2].id },
          ])

          // Get the admin user
          const users = await userModule.listUsers({ email: "admin@medusa.js" })
          adminUser = users[0]

          // Link the admin user to the admin role
          await remoteLink.create({
            [Modules.USER]: {
              user_id: adminUser.id,
            },
            [Modules.RBAC]: {
              rbac_role_id: adminRole.id,
            },
          })

          // Create viewer and editor roles for the tests
          const viewer = await api.post(
            "/admin/rbac/roles",
            {
              name: "Product Viewer",
              description: "Can view products",
            },
            adminHeaders
          )
          viewerRole = viewer.data.role

          const editor = await api.post(
            "/admin/rbac/roles",
            {
              name: "Product Editor",
              description: "Can edit products",
            },
            adminHeaders
          )
          editorRole = editor.data.role
        })

        it("should add policies to a role", async () => {
          const response = await api.post(
            `/admin/rbac/roles/${viewerRole.id}/policies`,
            {
              policies: [policies[0].id],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)

          expect(response.data.policies).toHaveLength(1)
          expect(response.data.policies[0]).toMatchObject({
            role_id: viewerRole.id,
            policy_id: policies[0].id,
          })
        })

        it("should list role-policies for a specific role", async () => {
          // Add multiple policies to the role
          await api.post(
            `/admin/rbac/roles/${viewerRole.id}/policies`,
            {
              policies: [policies[0].id, policies[1].id],
            },
            adminHeaders
          )

          // List the role to get its policies
          const response = await api.get(
            `/admin/rbac/roles/${viewerRole.id}/?fields=policies`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(Array.isArray(response.data.role.policies)).toBe(true)
          expect(response.data.role.policies).toHaveLength(2)
          expect(response.data.role.policies).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: policies[0].id,
              }),
              expect.objectContaining({
                id: policies[1].id,
              }),
            ])
          )
        })

        it("should remove a policy from a role", async () => {
          // First add a policy to the role
          await api.post(
            `/admin/rbac/roles/${editorRole.id}/policies`,
            {
              policies: [policies[2].id],
            },
            adminHeaders
          )

          // Verify the policy was added
          const initialResponse = await api.get(
            `/admin/rbac/roles/${editorRole.id}?fields=policies`,
            adminHeaders
          )
          expect(initialResponse.data.role.policies).toHaveLength(1)

          // Remove the policy from the role
          const deleteResponse = await api.delete(
            `/admin/rbac/roles/${editorRole.id}/policies/${policies[2].id}`,
            adminHeaders
          )

          expect(deleteResponse.status).toEqual(200)
          expect(deleteResponse.data).toEqual({
            id: expect.stringContaining("rlpl_"),
            object: "rbac_role_policy",
            deleted: true,
          })

          // Verify the policy was removed
          const finalResponse = await api.get(
            `/admin/rbac/roles/${editorRole.id}?fields=policies`,
            adminHeaders
          )
          expect(finalResponse.data.role.policies).toHaveLength(0)
        })
      })
    })
  },
})
