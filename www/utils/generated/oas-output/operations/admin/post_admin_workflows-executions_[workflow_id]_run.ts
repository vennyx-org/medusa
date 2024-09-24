/**
 * @oas [post] /admin/workflows-executions/{workflow_id}/run
 * operationId: PostWorkflowsExecutionsWorkflow_idRun
 * summary: Execute a Workflow
 * description: Execute a workflow by its ID.
 * x-authenticated: true
 * parameters:
 *   - name: workflow_id
 *     in: path
 *     description: The workflow's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminCreateWorkflowsRun"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/workflows-executions/{workflow_id}/run' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Workflows Executions
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The execution's details.
 *           required:
 *             - acknowledgement
 *           properties:
 *             acknowledgement:
 *               type: object
 *               description: The workflow's details
 *               required:
 *                 - workflowId
 *                 - transactionId
 *               properties:
 *                 workflowId:
 *                   type: string
 *                   description: The ID of the executed workflow.
 *                   title: workflowId
 *                 transactionId:
 *                   type: string
 *                   description: The ID of the workflow exection's transaction. Use this later to track the workflow execution's progress or succeed / fail its steps.
 *                   title: transactionId
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * 
*/

