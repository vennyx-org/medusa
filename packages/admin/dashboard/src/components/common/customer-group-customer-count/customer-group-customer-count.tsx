import { useCustomers } from "../../../hooks/api/customers"

type CustomerGroupCustomerCountProps = {
  customerGroupId: string
}

// ponytail: one count request per row; add a count field to the groups API if list pages get slow
export const CustomerGroupCustomerCount = ({
  customerGroupId,
}: CustomerGroupCustomerCountProps) => {
  const { count } = useCustomers({
    groups: customerGroupId,
    limit: 1,
    fields: "id",
  })

  return <span>{count ?? "-"}</span>
}
