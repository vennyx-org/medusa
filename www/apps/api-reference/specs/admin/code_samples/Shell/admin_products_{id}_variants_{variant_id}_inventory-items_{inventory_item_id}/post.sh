curl -X POST '{backend_url}/admin/products/{id}/variants/{variant_id}/inventory-items/{inventory_item_id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "required_quantity": 5324804697620480
}'