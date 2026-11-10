import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

import { useCustomerGroup } from "../../../hooks/api"

type CustomerGroupDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminCustomerGroupResponse>

export const CustomerGroupDetailBreadcrumb = (
  props: CustomerGroupDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { customer_group } = useCustomerGroup(id!, undefined, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!customer_group) {
    return null
  }

  return <span>{customer_group.name}</span>
}
