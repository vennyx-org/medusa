curl -X POST '{backend_url}/admin/customers/{id}/addresses' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "address_name": "{value}",
  "company": "{value}",
  "first_name": "{value}",
  "last_name": "{value}",
  "address_1": "{value}",
  "address_2": "{value}",
  "city": "{value}",
  "country_code": "{value}",
  "province": "{value}",
  "postal_code": "{value}",
  "phone": "{value}",
  "metadata": {}
}'