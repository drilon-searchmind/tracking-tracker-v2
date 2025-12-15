---
title: Order
description: >-
  Create and update a store's orders. Each order is a record of a complete
  purchase that includes details of the customer, their cart, and any
  transactions.
api_version: 2025-10
api_name: admin-rest
api_type: rest
source_url:
  html: 'https://shopify.dev/docs/api/admin-rest/latest/resources/order'
  md: 'https://shopify.dev/docs/api/admin-rest/latest/resources/order.md'
---

The REST Admin API is a legacy API as of October 1, 2024. Starting April 1, 2025, all new public apps must be built exclusively with the [GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql). For details and migration steps, visit our [migration guide](https://shopify.dev/docs/apps/build/graphql/migrate).

# Order

Multiple access scopes needed — refer to each endpoint for access scope requirements.

Requires access to [protected customer data](https://shopify.dev/apps/store/data-protection/protected-customer-data).

An order is a customer's request to purchase one or more products from a shop. You can create, retrieve, update, and delete orders using the Order resource.

#### Usage notes

![](https://shopify.dev/assets/api/reference/order.png)

* When you create an order through the API, no payment information is collected, and no transaction is performed.
* After an order is created, you can change only a few of its attributes using the API. You can't change the items or the quantities in an order using the REST API, but you can change them using the [GraphQL Admin API](https://shopify.dev/apps/fulfillment/order-management-apps/order-editing).
* You can add [metafields](https://shopify.dev/docs/api/admin-rest/current/resources/metafield) to the Order resource.
* You can allow merchants to create orders manually by using the [DraftOrder resource](https://shopify.dev/docs/api/admin-rest/current/resources/draftorder).

Caution

You can't use the Order resource to create a new checkout for an individual store. To create a checkout, you need to use the [Checkout API](https://shopify.dev/docs/api/admin-rest/current/resources/checkout) or an SDK powered by the [Storefront API](https://shopify.dev/docs/api/storefront), such as the [JavaScript Buy SDK](https://shopify.dev/docs/custom-storefronts/additional-sdks/js-buy), [iOS Buy SDK](https://shopify.dev/docs/custom-storefronts/mobile-kit/buy-sdk-ios), or [Android Buy SDK](https://shopify.dev/docs/custom-storefronts/mobile-kit/buy-sdk-android).

Caution

Only the last 60 days' worth of orders from a store are accessible from the Order resource by default. If you want to access older orders, then you need to [request access to all orders](https://shopify.dev/api/usage/access-scopes#orders-permissions). If your app is granted access, then you can add the `read_all_orders` scope to your app along with `read_orders` or `write_orders`.

Only use this data if it's required for your app's functionality. Shopify will restrict [access to scopes](https://shopify.dev/api/usage/access-scopes) for apps that don't have a legitimate use for the associated data.

\#

## Endpoints

* [post](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#post-orders)

  [/admin/api/latest/orders.​json](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#post-orders)

  Create an order

  [customerCreate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerCreate)

  [orderCreate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderCreate)

* [post](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#post-orders-order-id-cancel)

  [/admin/api/latest/orders/{order\_​id}/cancel.​json](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#post-orders-order-id-cancel)

  Cancel an order

  [orderCancel](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderCancel?example=cancel-an-order)

* [post](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#post-orders-order-id-close)

  [/admin/api/latest/orders/{order\_​id}/close.​json](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#post-orders-order-id-close)

  Close an order

  [orderClose](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderClose?example=close-an-order)

* [post](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#post-orders-order-id-open)

  [/admin/api/latest/orders/{order\_​id}/open.​json](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#post-orders-order-id-open)

  Re-open a closed order

  [orderOpen](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderOpen?example=re-open-a-closed-order)

* [get](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#get-orders?status=any)

  [/admin/api/latest/orders.​json?status=any](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#get-orders?status=any)

  Retrieve a list of orders

  [orders](https://shopify.dev/docs/api/admin-graphql/latest/queries/orders?example=retrieve-a-list-of-orders)

* [get](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#get-orders-order-id?fields=id,line-items,name,total-price)

  [/admin/api/latest/orders/{order\_​id}.​json?fields=id,line\_​items,name,total\_​price](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#get-orders-order-id?fields=id,line-items,name,total-price)

  Retrieve a specific order

  [order](https://shopify.dev/docs/api/admin-graphql/latest/queries/order?example=retrieve-a-specific-order)

* [get](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#get-orders-count?status=any)

  [/admin/api/latest/orders/count.​json?status=any](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#get-orders-count?status=any)

  Retrieve an order count

  [ordersCount](https://shopify.dev/docs/api/admin-graphql/latest/queries/ordersCount?example=retrieve-an-order-count)

* [put](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#put-orders-order-id)

  [/admin/api/latest/orders/{order\_​id}.​json](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#put-orders-order-id)

  Update an order

  [orderUpdate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderUpdate)

* [del](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#delete-orders-order-id)

  [/admin/api/latest/orders/{order\_​id}.​json](https://shopify.dev/docs/api/admin-rest/latest/resources/order.md#delete-orders-order-id)

  Delete an order

  [orderDelete](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderDelete?example=delete-an-order)

***

## The Order resource

### Properties

***

app\_id

integer

read-only

->[app](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order#field-Order.fields.app)

The ID of the app that created the order.

***

billing\_address

[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

object

CustomerAddress

->[billingAddress](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order#field-Order.fields.billingAddress)

The mailing address associated with the payment method. This address is an optional field that won't be available on orders that do not require a payment method. It has the following properties:

Show billing\_address properties

* **address1**: The street address of the billing address.
* **address2**: An optional additional field for the street address of the billing address.
* **city**: The city, town, or village of the billing address.
* **company**: The company of the person associated with the billing address.
* **country**: The name of the country of the billing address.
* **country\_code**: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the billing address.
* **first\_name**: The first name of the person associated with the payment method.
* **last\_name**: The last name of the person associated with the payment method.
* **latitude**: The latitude of the billing address.
* **longitude**: The longitude of the billing address.
* **name**: The full name of the person associated with the payment method.
* **phone**: The phone number at the billing address.
* **province**: The name of the region (for example, province, state, or prefecture) of the billing address.
* **province\_code**: The alphanumeric abbreviation of the region of the billing address.
* **zip**: The postal code (for example, zip, postcode, or Eircode) of the billing address.

***

browser\_ip

string

ip

read-only

->[clientIp](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order#field-Order.fields.clientIp)

The IP address of the browser used by the customer when they placed the order. Both IPv4 and IPv6 are supported.

***

buyer\_accepts\_marketing

boolean

->[customerAcceptsMarketing](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order#field-Order.fields.customerAcceptsMarketing)

Whether the customer consented to receive email updates from the shop.

***

cancel\_reason

string

->[cancelReason](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order#field-Order.fields.cancelReason)

The reason why the order was canceled. Valid values:

Show cancel\_reason properties

* **customer**: The customer canceled the order.
* **fraud**: The order was fraudulent.
* **inventory**: Items in the order were not in inventory.
* **declined**: The payment was declined.
* **other**: A reason not in this list.

***

cancelled\_at

string

ISO 8601

read-only

->[cancelledAt](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order#field-Order.fields.cancelledAt)

The date and time when the order was canceled. Returns `null` if the order isn't canceled.

***

cart\_token

string

deprecated

A unique value when referencing the cart that's associated with the order.

***

checkout\_token

string

deprecated

A unique value when referencing the checkout that's associated with the order.

***

client\_details

object

read-only

->[customerJourneySummary](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order#field-Order.fields.customerJourneySummary)

Information about the browser that the customer used when they placed their order:

Show client\_details properties

* **accept\_language**: The languages and locales that the browser understands.
* **browser\_height**: The browser screen height in pixels, if available.
* **browser\_ip**: The browser IP address.
* **browser\_width**: The browser screen width in pixels, if available.
* **session\_hash**: A hash of the session.
* **user\_agent**: Details of the browsing client, including software and operating versions.

***

closed\_at

boolean

ISO 8601

read-only

->[closedAt](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order#field-Order.fields.closedAt)

The date and time ([ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format) when the order was closed. Returns `null` if the order isn't closed.

***

company

object

read-only

->[purchasingEntity](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order#field-Order.fields.purchasingEntity)

Represents information about the purchasing company for the order. `null` will be returned if there is no purchasing company.

***

confirmation\_number

string

read-only

->[confirmationNumber](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order#field-Order.fields.confirmationNumber)

A randomly generated alpha-numeric identifier for the order that may be shown to the customer instead of the sequential order name. This value isn't guaranteed to be unique.

***

{}

## The Order resource

```json
{
  "app_id": 1966818,
  "billing_address": {
    "address1": "2259 Park Ct",
    "address2": "Apartment 5",
    "city": "Drayton Valley",
    "company": null,
    "country": "Canada",
    "first_name": "Christopher",
    "last_name": "Gorski",
    "phone": "(555)555-5555",
    "province": "Alberta",
    "zip": "T0E 0M0",
    "name": "Christopher Gorski",
    "province_code": "AB",
    "country_code": "CA",
    "latitude": "45.41634",
    "longitude": "-75.6868"
  },
  "browser_ip": "216.191.105.146",
  "buyer_accepts_marketing": false,
  "cancel_reason": "customer",
  "cancelled_at": null,
  "cart_token": "68778783ad298f1c80c3bafcddeea",
  "checkout_token": "bd5a8aa1ecd019dd3520ff791ee3a24c",
  "client_details": {
    "accept_language": "en-US,en;q=0.9",
    "browser_height": 1320,
    "browser_ip": "216.191.105.146",
    "browser_width": 1280,
    "session_hash": "9ad4d1f4e6a8977b9dd98eed1e477643",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36"
  },
  "closed_at": "2008-01-10T11:00:00-05:00",
  "company": {
    "id": 182772,
```

***

## postCreate an order

[customerCreate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerCreate)

[orderCreate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderCreate)

Requires `orders` access scope.

Creates an order.

By default, product inventory is not claimed when creating an order.

There are additional optional parameters that can be specified in the body of the request when creating an order:

* **inventory\_behaviour**: The behaviour to use when updating inventory. (default: `bypass`)

  * **bypass**: Do not claim inventory.
  * **decrement\_ignoring\_policy**: Ignore the product's inventory policy and claim inventory.
  * **decrement\_obeying\_policy**: Follow the product's inventory policy and claim inventory, if possible.

* **send\_receipt**: Whether to send an order confirmation to the customer. (default: `false`)

Note

If you're working on a private app and order confirmations are still being sent to the customer when `send_receipt` is set to `false`, then you need to disable the Storefront API from the private app's page in the Shopify admin.

* **send\_fulfillment\_receipt**: Whether to send a shipping confirmation to the customer. (default: `false`)

Note

If you are including **shipping\_address** or **billing\_address**, make sure to pass both **first\_name** and **last\_name**. Otherwise both these addresses will be ignored.

**Usage notes:**\
If you're using this endpoint with a trial or Partner development store, then you can create no more than 5 new orders per minute.

### Parameters

***

api\_version

string

required

***

### Examples

Create a comprehensive order

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.line\_​items:​\[{"title":"Big Brown Bear Boots",​"price":74.99,​"grams":"1300",​"quantity":3,​"tax\_lines":\[{"price":13.5,​"rate":0.06,​"title":"State tax"}]}][](https://shopify.dev/apps/store/data-protection/protected-customer-data)

array

A list of line item objects, each containing information about an item in the order. Each object has the following properties:

Show line\_items properties

* **attributed\_staffs**: The staff members attributed to the line item.

  * `id`: The id of the staff member.
  * `quantity`: The quantity of the line item attributed to the staff member.

* **fulfillable\_quantity**: The amount available to fulfill, calculated as follows:
  ```
  quantity - max(refunded_quantity, fulfilled_quantity) - pending_fulfilled_quantity - open_fulfilled_quantity
  ```

* **fulfillment\_service**: The handle of a fulfillment service that stocks the product variant belonging to a line item.

  This is the handle of a third-party fulfillment service in the following scenarios:

  **Scenario 1**

  1. The product variant is stocked by a single fulfillment service.
  2. The [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice) is a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  **Scenario 2**

  1. Multiple fulfillment services stock the product variant.
  2. The last time that the line item was unfulfilled, it was awaiting fulfillment by a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  If none of the above conditions are met, then this is `manual`.

  The [relationship between a product variant and a fulfillment service was changed in the `2022-07` API version](https://shopify.dev/changelog/fulfillment-service-sku-sharing). A [ProductVariant](https://shopify.dev/api/admin-rest/latest/resources/product-variant) can be stocked by multiple fulfillment services. As a result, we recommend that you use the [InventoryLevel](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel) resource if you need to determine where a product variant is stocked.

  If you previously set this field, then we recommend that you instead [connect inventory items to locations](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel#post-inventory-levels-connect). Each [Location](https://shopify.dev/api/admin-rest/latest/resources/location) is associated with a single [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice). The value of this field after setting it will be as described above.

  If you need to determine whether a product is a gift card, then you should continue to use this field until an alternative is available.

  Altering the locations which stock a product variant won't change the value of this field for existing orders.

  Learn more about [managing inventory quantities and states](https://shopify.dev/apps/fulfillment/inventory-management-apps/quantities-states).

* **fulfillment\_status**: How far along an order is in terms line items fulfilled. Valid values: `null`, `fulfilled`, `partial`, and `not_eligible`.

* **grams**: The weight of the item in grams.

* **id**: The ID of the line item.

* **price**: The price of the item before discounts have been applied in the shop currency.

* **price\_set**: The price of the line item in shop and presentment currencies.

* **product\_id**: The ID of the product that the line item belongs to. Can be `null` if the original product associated with the order is deleted at a later date.

* **quantity**: The number of items that were purchased.

* **current\_quantity**: The line item's quantity, minus the removed quantity.

* **requires\_shipping**: Whether the item requires shipping.

* **sku**: The item's SKU (stock keeping unit).

* **title**: The title of the product.

* **variant\_id**: The ID of the product variant.

* **variant\_title**: The title of the product variant.

* **vendor**: The name of the item's supplier.

* **name**: The name of the product variant.

* **gift\_card**: Whether the item is a gift card. If `true`, then the item is not taxed or considered for shipping charges.

* **properties**: An array of custom information for the item that has been added to the cart. Often used to provide product customization options.

* **taxable**: Whether the item was taxable.

* **tax\_lines**: A list of tax line objects, each of which details a tax applied to the item.

  * `title`: The name of the tax.
  * `price`: The amount added to the order for this tax in the shop currency after discounts are applied.
  * `price_set`: The amount added to the order for this tax in shop and presentment currencies after discounts are applied.
  * `rate`: The tax rate applied to the order to calculate the tax price.
  * `channel_liable`: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

* **tip\_payment\_gateway**: The payment gateway used to tender the tip, such as `shopify_payments`. Present only on tips.

* **tip\_payment\_method**: The payment method used to tender the tip, such as `Visa`. Present only on tips.

* **total\_discount**: The total amount of the discount allocated to the line item in the shop currency. This field must be explicitly set using draft orders, Shopify scripts, or the API. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **total\_discount\_set**: The total amount allocated to the line item in the presentment currency. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **discount\_allocations**: An ordered list of amounts allocated by discount applications. Each discount allocation is associated with a particular discount application.

  * `amount`: The discount amount allocated to the line in the shop currency.
  * `discount_application_index`: The index of the associated discount application in the order's `discount_applications` list.
  * `amount_set`: The discount amount allocated to the line item in shop and presentment currencies.

* **origin\_location**: The location of the line item’s fulfillment origin. This field is due to be **deprecated**. Consider using [' "FulfillmentOrder#assigned\_location\_id](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) instead.

  * `id`: The location ID of the line item’s fulfillment origin. Used by Shopify to calculate applicable taxes. This is not the ID of the location where the order was placed. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource to determine the location an item will be sourced from.
  * `country_code`: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the item's supplier.
  * `province_code`: The alphanumeric abbreviation for the region of the item's supplier.
  * `name`: The name of the item's supplier.
  * `address1`: The street address of the item's supplier.
  * `address2`: The suite number of the item's supplier.
  * `city`: The city of the item's supplier.
  * `zip`: The zip of the item's supplier.

* **duties**: A list of duty objects, each containing information about a duty on the line item.

order.total\_​tax:​13.5

string

price

The sum of the prices for all tax lines applied to the order in the shop currency, including refunded and removed tax lines.

order.currency:​"EUR"

string

ISO 4217

read-only

The three-letter code ([ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format) for the shop currency.

Create a partially paid order with a new customer and addresses

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.line\_​items:​\[{"variant\_id":447654529,​"quantity":1}][](https://shopify.dev/apps/store/data-protection/protected-customer-data)

array

A list of line item objects, each containing information about an item in the order. Each object has the following properties:

Show line\_items properties

* **attributed\_staffs**: The staff members attributed to the line item.

  * `id`: The id of the staff member.
  * `quantity`: The quantity of the line item attributed to the staff member.

* **fulfillable\_quantity**: The amount available to fulfill, calculated as follows:
  ```
  quantity - max(refunded_quantity, fulfilled_quantity) - pending_fulfilled_quantity - open_fulfilled_quantity
  ```

* **fulfillment\_service**: The handle of a fulfillment service that stocks the product variant belonging to a line item.

  This is the handle of a third-party fulfillment service in the following scenarios:

  **Scenario 1**

  1. The product variant is stocked by a single fulfillment service.
  2. The [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice) is a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  **Scenario 2**

  1. Multiple fulfillment services stock the product variant.
  2. The last time that the line item was unfulfilled, it was awaiting fulfillment by a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  If none of the above conditions are met, then this is `manual`.

  The [relationship between a product variant and a fulfillment service was changed in the `2022-07` API version](https://shopify.dev/changelog/fulfillment-service-sku-sharing). A [ProductVariant](https://shopify.dev/api/admin-rest/latest/resources/product-variant) can be stocked by multiple fulfillment services. As a result, we recommend that you use the [InventoryLevel](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel) resource if you need to determine where a product variant is stocked.

  If you previously set this field, then we recommend that you instead [connect inventory items to locations](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel#post-inventory-levels-connect). Each [Location](https://shopify.dev/api/admin-rest/latest/resources/location) is associated with a single [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice). The value of this field after setting it will be as described above.

  If you need to determine whether a product is a gift card, then you should continue to use this field until an alternative is available.

  Altering the locations which stock a product variant won't change the value of this field for existing orders.

  Learn more about [managing inventory quantities and states](https://shopify.dev/apps/fulfillment/inventory-management-apps/quantities-states).

* **fulfillment\_status**: How far along an order is in terms line items fulfilled. Valid values: `null`, `fulfilled`, `partial`, and `not_eligible`.

* **grams**: The weight of the item in grams.

* **id**: The ID of the line item.

* **price**: The price of the item before discounts have been applied in the shop currency.

* **price\_set**: The price of the line item in shop and presentment currencies.

* **product\_id**: The ID of the product that the line item belongs to. Can be `null` if the original product associated with the order is deleted at a later date.

* **quantity**: The number of items that were purchased.

* **current\_quantity**: The line item's quantity, minus the removed quantity.

* **requires\_shipping**: Whether the item requires shipping.

* **sku**: The item's SKU (stock keeping unit).

* **title**: The title of the product.

* **variant\_id**: The ID of the product variant.

* **variant\_title**: The title of the product variant.

* **vendor**: The name of the item's supplier.

* **name**: The name of the product variant.

* **gift\_card**: Whether the item is a gift card. If `true`, then the item is not taxed or considered for shipping charges.

* **properties**: An array of custom information for the item that has been added to the cart. Often used to provide product customization options.

* **taxable**: Whether the item was taxable.

* **tax\_lines**: A list of tax line objects, each of which details a tax applied to the item.

  * `title`: The name of the tax.
  * `price`: The amount added to the order for this tax in the shop currency after discounts are applied.
  * `price_set`: The amount added to the order for this tax in shop and presentment currencies after discounts are applied.
  * `rate`: The tax rate applied to the order to calculate the tax price.
  * `channel_liable`: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

* **tip\_payment\_gateway**: The payment gateway used to tender the tip, such as `shopify_payments`. Present only on tips.

* **tip\_payment\_method**: The payment method used to tender the tip, such as `Visa`. Present only on tips.

* **total\_discount**: The total amount of the discount allocated to the line item in the shop currency. This field must be explicitly set using draft orders, Shopify scripts, or the API. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **total\_discount\_set**: The total amount allocated to the line item in the presentment currency. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **discount\_allocations**: An ordered list of amounts allocated by discount applications. Each discount allocation is associated with a particular discount application.

  * `amount`: The discount amount allocated to the line in the shop currency.
  * `discount_application_index`: The index of the associated discount application in the order's `discount_applications` list.
  * `amount_set`: The discount amount allocated to the line item in shop and presentment currencies.

* **origin\_location**: The location of the line item’s fulfillment origin. This field is due to be **deprecated**. Consider using [' "FulfillmentOrder#assigned\_location\_id](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) instead.

  * `id`: The location ID of the line item’s fulfillment origin. Used by Shopify to calculate applicable taxes. This is not the ID of the location where the order was placed. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource to determine the location an item will be sourced from.
  * `country_code`: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the item's supplier.
  * `province_code`: The alphanumeric abbreviation for the region of the item's supplier.
  * `name`: The name of the item's supplier.
  * `address1`: The street address of the item's supplier.
  * `address2`: The suite number of the item's supplier.
  * `city`: The city of the item's supplier.
  * `zip`: The zip of the item's supplier.

* **duties**: A list of duty objects, each containing information about a duty on the line item.

order.customer:​{"first\_name":"Paul",​"last\_name":"Norman",​"email":"paul.norman\@example.com"}[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

object

Customer

Information about the customer. The order might not have a customer and apps should not depend on the existence of a `customer` object. This value might be `null` if the order was created through Shopify POS. For more information about the `customer` object, see the [Customer resource](https://shopify.dev/docs/admin-api/rest/reference/customers/customer).

order.billing\_​address:​{"first\_name":"John",​"last\_name":"Smith",​"address1":"123 Fake Street",​"phone":"555-555-5555",​"city":"Fakecity",​"province":"Ontario",​"country":"Canada",​"zip":"K2P 1L4"}[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

object

CustomerAddress

->[billingAddress](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-billingAddress)

The mailing address associated with the payment method. This address is an optional field that won't be available on orders that do not require a payment method. It has the following properties:

Show billing\_address properties

* **address1**: The street address of the billing address.
* **address2**: An optional additional field for the street address of the billing address.
* **city**: The city, town, or village of the billing address.
* **company**: The company of the person associated with the billing address.
* **country**: The name of the country of the billing address.
* **country\_code**: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the billing address.
* **first\_name**: The first name of the person associated with the payment method.
* **last\_name**: The last name of the person associated with the payment method.
* **latitude**: The latitude of the billing address.
* **longitude**: The longitude of the billing address.
* **name**: The full name of the person associated with the payment method.
* **phone**: The phone number at the billing address.
* **province**: The name of the region (for example, province, state, or prefecture) of the billing address.
* **province\_code**: The alphanumeric abbreviation of the region of the billing address.
* **zip**: The postal code (for example, zip, postcode, or Eircode) of the billing address.

order.shipping\_​address:​{"first\_name":"Jane",​"last\_name":"Smith",​"address1":"123 Fake Street",​"phone":"777-777-7777",​"city":"Fakecity",​"province":"Ontario",​"country":"Canada",​"zip":"K2P 1L4"}[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

object

CustomerAddress

->[shippingAddress](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-shippingAddress)

The mailing address to where the order will be shipped. This address is optional and will not be available on orders that do not require shipping. It has the following properties:

Show shipping\_address properties

* **address1**: The street address of the shipping address.
* **address2**: An optional additional field for the street address of the shipping address.
* **city**: The city, town, or village of the shipping address.
* **company**: The company of the person associated with the shipping address.
* **country**: The name of the country of the shipping address.
* **country\_code**: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the shipping address.
* **first\_name**: The first name of the person associated with the shipping address.
* **last\_name**: The last name of the person associated with the shipping address.
* **latitude**: The latitude of the shipping address.
* **longitude**: The longitude of the shipping address.
* **name**: The full name of the person associated with the payment method.
* **phone**: The phone number at the shipping address.
* **province**: The name of the region (for example, province, state, or prefecture) of the shipping address.
* **province\_code**: The alphanumeric abbreviation of the region of the shipping address.
* **zip**: The postal code (for example, zip, postcode, or Eircode) of the shipping address.

order.email:​"jane\@example.com"[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

string

email

->[email](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-email)

The customer's email address.

order.financial\_​status:​"partially\_paid"

string

read-only

The status of payments associated with the order. Can only be set when the order is created. Valid values:

Show financial\_status properties

* **pending**: The payments are pending. Payment might fail in this state. Check again to confirm whether the payments have been paid successfully.
* **authorized**: The payments have been authorized.
* **partially\_paid**: The order has been partially paid.
* **paid**: The payments have been paid.
* **partially\_refunded**: The payments have been partially refunded.
* **refunded**: The payments have been refunded.
* **voided**: The payments have been voided.

Create a pending order with an existing customer

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.line\_​items:​\[{"variant\_id":447654529,​"quantity":1}][](https://shopify.dev/apps/store/data-protection/protected-customer-data)

array

A list of line item objects, each containing information about an item in the order. Each object has the following properties:

Show line\_items properties

* **attributed\_staffs**: The staff members attributed to the line item.

  * `id`: The id of the staff member.
  * `quantity`: The quantity of the line item attributed to the staff member.

* **fulfillable\_quantity**: The amount available to fulfill, calculated as follows:
  ```
  quantity - max(refunded_quantity, fulfilled_quantity) - pending_fulfilled_quantity - open_fulfilled_quantity
  ```

* **fulfillment\_service**: The handle of a fulfillment service that stocks the product variant belonging to a line item.

  This is the handle of a third-party fulfillment service in the following scenarios:

  **Scenario 1**

  1. The product variant is stocked by a single fulfillment service.
  2. The [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice) is a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  **Scenario 2**

  1. Multiple fulfillment services stock the product variant.
  2. The last time that the line item was unfulfilled, it was awaiting fulfillment by a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  If none of the above conditions are met, then this is `manual`.

  The [relationship between a product variant and a fulfillment service was changed in the `2022-07` API version](https://shopify.dev/changelog/fulfillment-service-sku-sharing). A [ProductVariant](https://shopify.dev/api/admin-rest/latest/resources/product-variant) can be stocked by multiple fulfillment services. As a result, we recommend that you use the [InventoryLevel](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel) resource if you need to determine where a product variant is stocked.

  If you previously set this field, then we recommend that you instead [connect inventory items to locations](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel#post-inventory-levels-connect). Each [Location](https://shopify.dev/api/admin-rest/latest/resources/location) is associated with a single [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice). The value of this field after setting it will be as described above.

  If you need to determine whether a product is a gift card, then you should continue to use this field until an alternative is available.

  Altering the locations which stock a product variant won't change the value of this field for existing orders.

  Learn more about [managing inventory quantities and states](https://shopify.dev/apps/fulfillment/inventory-management-apps/quantities-states).

* **fulfillment\_status**: How far along an order is in terms line items fulfilled. Valid values: `null`, `fulfilled`, `partial`, and `not_eligible`.

* **grams**: The weight of the item in grams.

* **id**: The ID of the line item.

* **price**: The price of the item before discounts have been applied in the shop currency.

* **price\_set**: The price of the line item in shop and presentment currencies.

* **product\_id**: The ID of the product that the line item belongs to. Can be `null` if the original product associated with the order is deleted at a later date.

* **quantity**: The number of items that were purchased.

* **current\_quantity**: The line item's quantity, minus the removed quantity.

* **requires\_shipping**: Whether the item requires shipping.

* **sku**: The item's SKU (stock keeping unit).

* **title**: The title of the product.

* **variant\_id**: The ID of the product variant.

* **variant\_title**: The title of the product variant.

* **vendor**: The name of the item's supplier.

* **name**: The name of the product variant.

* **gift\_card**: Whether the item is a gift card. If `true`, then the item is not taxed or considered for shipping charges.

* **properties**: An array of custom information for the item that has been added to the cart. Often used to provide product customization options.

* **taxable**: Whether the item was taxable.

* **tax\_lines**: A list of tax line objects, each of which details a tax applied to the item.

  * `title`: The name of the tax.
  * `price`: The amount added to the order for this tax in the shop currency after discounts are applied.
  * `price_set`: The amount added to the order for this tax in shop and presentment currencies after discounts are applied.
  * `rate`: The tax rate applied to the order to calculate the tax price.
  * `channel_liable`: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

* **tip\_payment\_gateway**: The payment gateway used to tender the tip, such as `shopify_payments`. Present only on tips.

* **tip\_payment\_method**: The payment method used to tender the tip, such as `Visa`. Present only on tips.

* **total\_discount**: The total amount of the discount allocated to the line item in the shop currency. This field must be explicitly set using draft orders, Shopify scripts, or the API. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **total\_discount\_set**: The total amount allocated to the line item in the presentment currency. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **discount\_allocations**: An ordered list of amounts allocated by discount applications. Each discount allocation is associated with a particular discount application.

  * `amount`: The discount amount allocated to the line in the shop currency.
  * `discount_application_index`: The index of the associated discount application in the order's `discount_applications` list.
  * `amount_set`: The discount amount allocated to the line item in shop and presentment currencies.

* **origin\_location**: The location of the line item’s fulfillment origin. This field is due to be **deprecated**. Consider using [' "FulfillmentOrder#assigned\_location\_id](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) instead.

  * `id`: The location ID of the line item’s fulfillment origin. Used by Shopify to calculate applicable taxes. This is not the ID of the location where the order was placed. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource to determine the location an item will be sourced from.
  * `country_code`: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the item's supplier.
  * `province_code`: The alphanumeric abbreviation for the region of the item's supplier.
  * `name`: The name of the item's supplier.
  * `address1`: The street address of the item's supplier.
  * `address2`: The suite number of the item's supplier.
  * `city`: The city of the item's supplier.
  * `zip`: The zip of the item's supplier.

* **duties**: A list of duty objects, each containing information about a duty on the line item.

order.customer:​{"id":207119551}[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

object

Customer

Information about the customer. The order might not have a customer and apps should not depend on the existence of a `customer` object. This value might be `null` if the order was created through Shopify POS. For more information about the `customer` object, see the [Customer resource](https://shopify.dev/docs/admin-api/rest/reference/customers/customer).

order.financial\_​status:​"pending"

string

read-only

The status of payments associated with the order. Can only be set when the order is created. Valid values:

Show financial\_status properties

* **pending**: The payments are pending. Payment might fail in this state. Check again to confirm whether the payments have been paid successfully.
* **authorized**: The payments have been authorized.
* **partially\_paid**: The order has been partially paid.
* **paid**: The payments have been paid.
* **partially\_refunded**: The payments have been partially refunded.
* **refunded**: The payments have been refunded.
* **voided**: The payments have been voided.

Create a simple order and fulfill it

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.email:​"foo\@example.com"[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

string

email

->[email](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-email)

The customer's email address.

order.fulfillment\_​status:​"fulfilled"

string

The order's status in terms of fulfilled line items. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource for a more granular view. Valid values:

Show fulfillment\_status properties

* **fulfilled**: Every line item in the order has been fulfilled.
* **null**: None of the line items in the order have been fulfilled.
* **partial**: At least one line item in the order has been fulfilled.
* **restocked**: Every line item in the order has been restocked and the order canceled.

order.fulfillments:​\[{"location\_id":24826418}]

array

An array of fulfillments associated with the order. For more information, see the [Fulfillment API](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillment).

order.line\_​items:​\[{"variant\_id":447654529,​"quantity":1}][](https://shopify.dev/apps/store/data-protection/protected-customer-data)

array

A list of line item objects, each containing information about an item in the order. Each object has the following properties:

Show line\_items properties

* **attributed\_staffs**: The staff members attributed to the line item.

  * `id`: The id of the staff member.
  * `quantity`: The quantity of the line item attributed to the staff member.

* **fulfillable\_quantity**: The amount available to fulfill, calculated as follows:
  ```
  quantity - max(refunded_quantity, fulfilled_quantity) - pending_fulfilled_quantity - open_fulfilled_quantity
  ```

* **fulfillment\_service**: The handle of a fulfillment service that stocks the product variant belonging to a line item.

  This is the handle of a third-party fulfillment service in the following scenarios:

  **Scenario 1**

  1. The product variant is stocked by a single fulfillment service.
  2. The [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice) is a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  **Scenario 2**

  1. Multiple fulfillment services stock the product variant.
  2. The last time that the line item was unfulfilled, it was awaiting fulfillment by a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  If none of the above conditions are met, then this is `manual`.

  The [relationship between a product variant and a fulfillment service was changed in the `2022-07` API version](https://shopify.dev/changelog/fulfillment-service-sku-sharing). A [ProductVariant](https://shopify.dev/api/admin-rest/latest/resources/product-variant) can be stocked by multiple fulfillment services. As a result, we recommend that you use the [InventoryLevel](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel) resource if you need to determine where a product variant is stocked.

  If you previously set this field, then we recommend that you instead [connect inventory items to locations](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel#post-inventory-levels-connect). Each [Location](https://shopify.dev/api/admin-rest/latest/resources/location) is associated with a single [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice). The value of this field after setting it will be as described above.

  If you need to determine whether a product is a gift card, then you should continue to use this field until an alternative is available.

  Altering the locations which stock a product variant won't change the value of this field for existing orders.

  Learn more about [managing inventory quantities and states](https://shopify.dev/apps/fulfillment/inventory-management-apps/quantities-states).

* **fulfillment\_status**: How far along an order is in terms line items fulfilled. Valid values: `null`, `fulfilled`, `partial`, and `not_eligible`.

* **grams**: The weight of the item in grams.

* **id**: The ID of the line item.

* **price**: The price of the item before discounts have been applied in the shop currency.

* **price\_set**: The price of the line item in shop and presentment currencies.

* **product\_id**: The ID of the product that the line item belongs to. Can be `null` if the original product associated with the order is deleted at a later date.

* **quantity**: The number of items that were purchased.

* **current\_quantity**: The line item's quantity, minus the removed quantity.

* **requires\_shipping**: Whether the item requires shipping.

* **sku**: The item's SKU (stock keeping unit).

* **title**: The title of the product.

* **variant\_id**: The ID of the product variant.

* **variant\_title**: The title of the product variant.

* **vendor**: The name of the item's supplier.

* **name**: The name of the product variant.

* **gift\_card**: Whether the item is a gift card. If `true`, then the item is not taxed or considered for shipping charges.

* **properties**: An array of custom information for the item that has been added to the cart. Often used to provide product customization options.

* **taxable**: Whether the item was taxable.

* **tax\_lines**: A list of tax line objects, each of which details a tax applied to the item.

  * `title`: The name of the tax.
  * `price`: The amount added to the order for this tax in the shop currency after discounts are applied.
  * `price_set`: The amount added to the order for this tax in shop and presentment currencies after discounts are applied.
  * `rate`: The tax rate applied to the order to calculate the tax price.
  * `channel_liable`: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

* **tip\_payment\_gateway**: The payment gateway used to tender the tip, such as `shopify_payments`. Present only on tips.

* **tip\_payment\_method**: The payment method used to tender the tip, such as `Visa`. Present only on tips.

* **total\_discount**: The total amount of the discount allocated to the line item in the shop currency. This field must be explicitly set using draft orders, Shopify scripts, or the API. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **total\_discount\_set**: The total amount allocated to the line item in the presentment currency. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **discount\_allocations**: An ordered list of amounts allocated by discount applications. Each discount allocation is associated with a particular discount application.

  * `amount`: The discount amount allocated to the line in the shop currency.
  * `discount_application_index`: The index of the associated discount application in the order's `discount_applications` list.
  * `amount_set`: The discount amount allocated to the line item in shop and presentment currencies.

* **origin\_location**: The location of the line item’s fulfillment origin. This field is due to be **deprecated**. Consider using [' "FulfillmentOrder#assigned\_location\_id](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) instead.

  * `id`: The location ID of the line item’s fulfillment origin. Used by Shopify to calculate applicable taxes. This is not the ID of the location where the order was placed. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource to determine the location an item will be sourced from.
  * `country_code`: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the item's supplier.
  * `province_code`: The alphanumeric abbreviation for the region of the item's supplier.
  * `name`: The name of the item's supplier.
  * `address1`: The street address of the item's supplier.
  * `address2`: The suite number of the item's supplier.
  * `city`: The city of the item's supplier.
  * `zip`: The zip of the item's supplier.

* **duties**: A list of duty objects, each containing information about a duty on the line item.

Create a simple order with only a product variant ID and no optional parameters

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.line\_​items:​\[{"variant\_id":447654529,​"quantity":1}][](https://shopify.dev/apps/store/data-protection/protected-customer-data)

array

A list of line item objects, each containing information about an item in the order. Each object has the following properties:

Show line\_items properties

* **attributed\_staffs**: The staff members attributed to the line item.

  * `id`: The id of the staff member.
  * `quantity`: The quantity of the line item attributed to the staff member.

* **fulfillable\_quantity**: The amount available to fulfill, calculated as follows:
  ```
  quantity - max(refunded_quantity, fulfilled_quantity) - pending_fulfilled_quantity - open_fulfilled_quantity
  ```

* **fulfillment\_service**: The handle of a fulfillment service that stocks the product variant belonging to a line item.

  This is the handle of a third-party fulfillment service in the following scenarios:

  **Scenario 1**

  1. The product variant is stocked by a single fulfillment service.
  2. The [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice) is a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  **Scenario 2**

  1. Multiple fulfillment services stock the product variant.
  2. The last time that the line item was unfulfilled, it was awaiting fulfillment by a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  If none of the above conditions are met, then this is `manual`.

  The [relationship between a product variant and a fulfillment service was changed in the `2022-07` API version](https://shopify.dev/changelog/fulfillment-service-sku-sharing). A [ProductVariant](https://shopify.dev/api/admin-rest/latest/resources/product-variant) can be stocked by multiple fulfillment services. As a result, we recommend that you use the [InventoryLevel](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel) resource if you need to determine where a product variant is stocked.

  If you previously set this field, then we recommend that you instead [connect inventory items to locations](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel#post-inventory-levels-connect). Each [Location](https://shopify.dev/api/admin-rest/latest/resources/location) is associated with a single [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice). The value of this field after setting it will be as described above.

  If you need to determine whether a product is a gift card, then you should continue to use this field until an alternative is available.

  Altering the locations which stock a product variant won't change the value of this field for existing orders.

  Learn more about [managing inventory quantities and states](https://shopify.dev/apps/fulfillment/inventory-management-apps/quantities-states).

* **fulfillment\_status**: How far along an order is in terms line items fulfilled. Valid values: `null`, `fulfilled`, `partial`, and `not_eligible`.

* **grams**: The weight of the item in grams.

* **id**: The ID of the line item.

* **price**: The price of the item before discounts have been applied in the shop currency.

* **price\_set**: The price of the line item in shop and presentment currencies.

* **product\_id**: The ID of the product that the line item belongs to. Can be `null` if the original product associated with the order is deleted at a later date.

* **quantity**: The number of items that were purchased.

* **current\_quantity**: The line item's quantity, minus the removed quantity.

* **requires\_shipping**: Whether the item requires shipping.

* **sku**: The item's SKU (stock keeping unit).

* **title**: The title of the product.

* **variant\_id**: The ID of the product variant.

* **variant\_title**: The title of the product variant.

* **vendor**: The name of the item's supplier.

* **name**: The name of the product variant.

* **gift\_card**: Whether the item is a gift card. If `true`, then the item is not taxed or considered for shipping charges.

* **properties**: An array of custom information for the item that has been added to the cart. Often used to provide product customization options.

* **taxable**: Whether the item was taxable.

* **tax\_lines**: A list of tax line objects, each of which details a tax applied to the item.

  * `title`: The name of the tax.
  * `price`: The amount added to the order for this tax in the shop currency after discounts are applied.
  * `price_set`: The amount added to the order for this tax in shop and presentment currencies after discounts are applied.
  * `rate`: The tax rate applied to the order to calculate the tax price.
  * `channel_liable`: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

* **tip\_payment\_gateway**: The payment gateway used to tender the tip, such as `shopify_payments`. Present only on tips.

* **tip\_payment\_method**: The payment method used to tender the tip, such as `Visa`. Present only on tips.

* **total\_discount**: The total amount of the discount allocated to the line item in the shop currency. This field must be explicitly set using draft orders, Shopify scripts, or the API. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **total\_discount\_set**: The total amount allocated to the line item in the presentment currency. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **discount\_allocations**: An ordered list of amounts allocated by discount applications. Each discount allocation is associated with a particular discount application.

  * `amount`: The discount amount allocated to the line in the shop currency.
  * `discount_application_index`: The index of the associated discount application in the order's `discount_applications` list.
  * `amount_set`: The discount amount allocated to the line item in shop and presentment currencies.

* **origin\_location**: The location of the line item’s fulfillment origin. This field is due to be **deprecated**. Consider using [' "FulfillmentOrder#assigned\_location\_id](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) instead.

  * `id`: The location ID of the line item’s fulfillment origin. Used by Shopify to calculate applicable taxes. This is not the ID of the location where the order was placed. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource to determine the location an item will be sourced from.
  * `country_code`: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the item's supplier.
  * `province_code`: The alphanumeric abbreviation for the region of the item's supplier.
  * `name`: The name of the item's supplier.
  * `address1`: The street address of the item's supplier.
  * `address2`: The suite number of the item's supplier.
  * `city`: The city of the item's supplier.
  * `zip`: The zip of the item's supplier.

* **duties**: A list of duty objects, each containing information about a duty on the line item.

Create a simple order without sending an order receipt or a fulfillment receipt

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.email:​"foo\@example.com"[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

string

email

->[email](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-email)

The customer's email address.

order.fulfillment\_​status:​"fulfilled"

string

The order's status in terms of fulfilled line items. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource for a more granular view. Valid values:

Show fulfillment\_status properties

* **fulfilled**: Every line item in the order has been fulfilled.
* **null**: None of the line items in the order have been fulfilled.
* **partial**: At least one line item in the order has been fulfilled.
* **restocked**: Every line item in the order has been restocked and the order canceled.

order.line\_​items:​\[{"variant\_id":447654529,​"quantity":1}][](https://shopify.dev/apps/store/data-protection/protected-customer-data)

array

A list of line item objects, each containing information about an item in the order. Each object has the following properties:

Show line\_items properties

* **attributed\_staffs**: The staff members attributed to the line item.

  * `id`: The id of the staff member.
  * `quantity`: The quantity of the line item attributed to the staff member.

* **fulfillable\_quantity**: The amount available to fulfill, calculated as follows:
  ```
  quantity - max(refunded_quantity, fulfilled_quantity) - pending_fulfilled_quantity - open_fulfilled_quantity
  ```

* **fulfillment\_service**: The handle of a fulfillment service that stocks the product variant belonging to a line item.

  This is the handle of a third-party fulfillment service in the following scenarios:

  **Scenario 1**

  1. The product variant is stocked by a single fulfillment service.
  2. The [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice) is a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  **Scenario 2**

  1. Multiple fulfillment services stock the product variant.
  2. The last time that the line item was unfulfilled, it was awaiting fulfillment by a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  If none of the above conditions are met, then this is `manual`.

  The [relationship between a product variant and a fulfillment service was changed in the `2022-07` API version](https://shopify.dev/changelog/fulfillment-service-sku-sharing). A [ProductVariant](https://shopify.dev/api/admin-rest/latest/resources/product-variant) can be stocked by multiple fulfillment services. As a result, we recommend that you use the [InventoryLevel](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel) resource if you need to determine where a product variant is stocked.

  If you previously set this field, then we recommend that you instead [connect inventory items to locations](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel#post-inventory-levels-connect). Each [Location](https://shopify.dev/api/admin-rest/latest/resources/location) is associated with a single [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice). The value of this field after setting it will be as described above.

  If you need to determine whether a product is a gift card, then you should continue to use this field until an alternative is available.

  Altering the locations which stock a product variant won't change the value of this field for existing orders.

  Learn more about [managing inventory quantities and states](https://shopify.dev/apps/fulfillment/inventory-management-apps/quantities-states).

* **fulfillment\_status**: How far along an order is in terms line items fulfilled. Valid values: `null`, `fulfilled`, `partial`, and `not_eligible`.

* **grams**: The weight of the item in grams.

* **id**: The ID of the line item.

* **price**: The price of the item before discounts have been applied in the shop currency.

* **price\_set**: The price of the line item in shop and presentment currencies.

* **product\_id**: The ID of the product that the line item belongs to. Can be `null` if the original product associated with the order is deleted at a later date.

* **quantity**: The number of items that were purchased.

* **current\_quantity**: The line item's quantity, minus the removed quantity.

* **requires\_shipping**: Whether the item requires shipping.

* **sku**: The item's SKU (stock keeping unit).

* **title**: The title of the product.

* **variant\_id**: The ID of the product variant.

* **variant\_title**: The title of the product variant.

* **vendor**: The name of the item's supplier.

* **name**: The name of the product variant.

* **gift\_card**: Whether the item is a gift card. If `true`, then the item is not taxed or considered for shipping charges.

* **properties**: An array of custom information for the item that has been added to the cart. Often used to provide product customization options.

* **taxable**: Whether the item was taxable.

* **tax\_lines**: A list of tax line objects, each of which details a tax applied to the item.

  * `title`: The name of the tax.
  * `price`: The amount added to the order for this tax in the shop currency after discounts are applied.
  * `price_set`: The amount added to the order for this tax in shop and presentment currencies after discounts are applied.
  * `rate`: The tax rate applied to the order to calculate the tax price.
  * `channel_liable`: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

* **tip\_payment\_gateway**: The payment gateway used to tender the tip, such as `shopify_payments`. Present only on tips.

* **tip\_payment\_method**: The payment method used to tender the tip, such as `Visa`. Present only on tips.

* **total\_discount**: The total amount of the discount allocated to the line item in the shop currency. This field must be explicitly set using draft orders, Shopify scripts, or the API. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **total\_discount\_set**: The total amount allocated to the line item in the presentment currency. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **discount\_allocations**: An ordered list of amounts allocated by discount applications. Each discount allocation is associated with a particular discount application.

  * `amount`: The discount amount allocated to the line in the shop currency.
  * `discount_application_index`: The index of the associated discount application in the order's `discount_applications` list.
  * `amount_set`: The discount amount allocated to the line item in shop and presentment currencies.

* **origin\_location**: The location of the line item’s fulfillment origin. This field is due to be **deprecated**. Consider using [' "FulfillmentOrder#assigned\_location\_id](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) instead.

  * `id`: The location ID of the line item’s fulfillment origin. Used by Shopify to calculate applicable taxes. This is not the ID of the location where the order was placed. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource to determine the location an item will be sourced from.
  * `country_code`: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the item's supplier.
  * `province_code`: The alphanumeric abbreviation for the region of the item's supplier.
  * `name`: The name of the item's supplier.
  * `address1`: The street address of the item's supplier.
  * `address2`: The suite number of the item's supplier.
  * `city`: The city of the item's supplier.
  * `zip`: The zip of the item's supplier.

* **duties**: A list of duty objects, each containing information about a duty on the line item.

Create a simple order, sending an order confirmation and a shipping confirmation to the customer

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.email:​"foo\@example.com"[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

string

email

->[email](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-email)

The customer's email address.

order.fulfillment\_​status:​"fulfilled"

string

The order's status in terms of fulfilled line items. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource for a more granular view. Valid values:

Show fulfillment\_status properties

* **fulfilled**: Every line item in the order has been fulfilled.
* **null**: None of the line items in the order have been fulfilled.
* **partial**: At least one line item in the order has been fulfilled.
* **restocked**: Every line item in the order has been restocked and the order canceled.

order.line\_​items:​\[{"variant\_id":457924702,​"quantity":1}][](https://shopify.dev/apps/store/data-protection/protected-customer-data)

array

A list of line item objects, each containing information about an item in the order. Each object has the following properties:

Show line\_items properties

* **attributed\_staffs**: The staff members attributed to the line item.

  * `id`: The id of the staff member.
  * `quantity`: The quantity of the line item attributed to the staff member.

* **fulfillable\_quantity**: The amount available to fulfill, calculated as follows:
  ```
  quantity - max(refunded_quantity, fulfilled_quantity) - pending_fulfilled_quantity - open_fulfilled_quantity
  ```

* **fulfillment\_service**: The handle of a fulfillment service that stocks the product variant belonging to a line item.

  This is the handle of a third-party fulfillment service in the following scenarios:

  **Scenario 1**

  1. The product variant is stocked by a single fulfillment service.
  2. The [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice) is a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  **Scenario 2**

  1. Multiple fulfillment services stock the product variant.
  2. The last time that the line item was unfulfilled, it was awaiting fulfillment by a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  If none of the above conditions are met, then this is `manual`.

  The [relationship between a product variant and a fulfillment service was changed in the `2022-07` API version](https://shopify.dev/changelog/fulfillment-service-sku-sharing). A [ProductVariant](https://shopify.dev/api/admin-rest/latest/resources/product-variant) can be stocked by multiple fulfillment services. As a result, we recommend that you use the [InventoryLevel](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel) resource if you need to determine where a product variant is stocked.

  If you previously set this field, then we recommend that you instead [connect inventory items to locations](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel#post-inventory-levels-connect). Each [Location](https://shopify.dev/api/admin-rest/latest/resources/location) is associated with a single [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice). The value of this field after setting it will be as described above.

  If you need to determine whether a product is a gift card, then you should continue to use this field until an alternative is available.

  Altering the locations which stock a product variant won't change the value of this field for existing orders.

  Learn more about [managing inventory quantities and states](https://shopify.dev/apps/fulfillment/inventory-management-apps/quantities-states).

* **fulfillment\_status**: How far along an order is in terms line items fulfilled. Valid values: `null`, `fulfilled`, `partial`, and `not_eligible`.

* **grams**: The weight of the item in grams.

* **id**: The ID of the line item.

* **price**: The price of the item before discounts have been applied in the shop currency.

* **price\_set**: The price of the line item in shop and presentment currencies.

* **product\_id**: The ID of the product that the line item belongs to. Can be `null` if the original product associated with the order is deleted at a later date.

* **quantity**: The number of items that were purchased.

* **current\_quantity**: The line item's quantity, minus the removed quantity.

* **requires\_shipping**: Whether the item requires shipping.

* **sku**: The item's SKU (stock keeping unit).

* **title**: The title of the product.

* **variant\_id**: The ID of the product variant.

* **variant\_title**: The title of the product variant.

* **vendor**: The name of the item's supplier.

* **name**: The name of the product variant.

* **gift\_card**: Whether the item is a gift card. If `true`, then the item is not taxed or considered for shipping charges.

* **properties**: An array of custom information for the item that has been added to the cart. Often used to provide product customization options.

* **taxable**: Whether the item was taxable.

* **tax\_lines**: A list of tax line objects, each of which details a tax applied to the item.

  * `title`: The name of the tax.
  * `price`: The amount added to the order for this tax in the shop currency after discounts are applied.
  * `price_set`: The amount added to the order for this tax in shop and presentment currencies after discounts are applied.
  * `rate`: The tax rate applied to the order to calculate the tax price.
  * `channel_liable`: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

* **tip\_payment\_gateway**: The payment gateway used to tender the tip, such as `shopify_payments`. Present only on tips.

* **tip\_payment\_method**: The payment method used to tender the tip, such as `Visa`. Present only on tips.

* **total\_discount**: The total amount of the discount allocated to the line item in the shop currency. This field must be explicitly set using draft orders, Shopify scripts, or the API. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **total\_discount\_set**: The total amount allocated to the line item in the presentment currency. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **discount\_allocations**: An ordered list of amounts allocated by discount applications. Each discount allocation is associated with a particular discount application.

  * `amount`: The discount amount allocated to the line in the shop currency.
  * `discount_application_index`: The index of the associated discount application in the order's `discount_applications` list.
  * `amount_set`: The discount amount allocated to the line item in shop and presentment currencies.

* **origin\_location**: The location of the line item’s fulfillment origin. This field is due to be **deprecated**. Consider using [' "FulfillmentOrder#assigned\_location\_id](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) instead.

  * `id`: The location ID of the line item’s fulfillment origin. Used by Shopify to calculate applicable taxes. This is not the ID of the location where the order was placed. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource to determine the location an item will be sourced from.
  * `country_code`: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the item's supplier.
  * `province_code`: The alphanumeric abbreviation for the region of the item's supplier.
  * `name`: The name of the item's supplier.
  * `address1`: The street address of the item's supplier.
  * `address2`: The suite number of the item's supplier.
  * `city`: The city of the item's supplier.
  * `zip`: The zip of the item's supplier.

* **duties**: A list of duty objects, each containing information about a duty on the line item.

Create an order and apply a discount

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.line\_​items:​\[{"variant\_id":447654529,​"quantity":1}][](https://shopify.dev/apps/store/data-protection/protected-customer-data)

array

A list of line item objects, each containing information about an item in the order. Each object has the following properties:

Show line\_items properties

* **attributed\_staffs**: The staff members attributed to the line item.

  * `id`: The id of the staff member.
  * `quantity`: The quantity of the line item attributed to the staff member.

* **fulfillable\_quantity**: The amount available to fulfill, calculated as follows:
  ```
  quantity - max(refunded_quantity, fulfilled_quantity) - pending_fulfilled_quantity - open_fulfilled_quantity
  ```

* **fulfillment\_service**: The handle of a fulfillment service that stocks the product variant belonging to a line item.

  This is the handle of a third-party fulfillment service in the following scenarios:

  **Scenario 1**

  1. The product variant is stocked by a single fulfillment service.
  2. The [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice) is a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  **Scenario 2**

  1. Multiple fulfillment services stock the product variant.
  2. The last time that the line item was unfulfilled, it was awaiting fulfillment by a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  If none of the above conditions are met, then this is `manual`.

  The [relationship between a product variant and a fulfillment service was changed in the `2022-07` API version](https://shopify.dev/changelog/fulfillment-service-sku-sharing). A [ProductVariant](https://shopify.dev/api/admin-rest/latest/resources/product-variant) can be stocked by multiple fulfillment services. As a result, we recommend that you use the [InventoryLevel](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel) resource if you need to determine where a product variant is stocked.

  If you previously set this field, then we recommend that you instead [connect inventory items to locations](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel#post-inventory-levels-connect). Each [Location](https://shopify.dev/api/admin-rest/latest/resources/location) is associated with a single [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice). The value of this field after setting it will be as described above.

  If you need to determine whether a product is a gift card, then you should continue to use this field until an alternative is available.

  Altering the locations which stock a product variant won't change the value of this field for existing orders.

  Learn more about [managing inventory quantities and states](https://shopify.dev/apps/fulfillment/inventory-management-apps/quantities-states).

* **fulfillment\_status**: How far along an order is in terms line items fulfilled. Valid values: `null`, `fulfilled`, `partial`, and `not_eligible`.

* **grams**: The weight of the item in grams.

* **id**: The ID of the line item.

* **price**: The price of the item before discounts have been applied in the shop currency.

* **price\_set**: The price of the line item in shop and presentment currencies.

* **product\_id**: The ID of the product that the line item belongs to. Can be `null` if the original product associated with the order is deleted at a later date.

* **quantity**: The number of items that were purchased.

* **current\_quantity**: The line item's quantity, minus the removed quantity.

* **requires\_shipping**: Whether the item requires shipping.

* **sku**: The item's SKU (stock keeping unit).

* **title**: The title of the product.

* **variant\_id**: The ID of the product variant.

* **variant\_title**: The title of the product variant.

* **vendor**: The name of the item's supplier.

* **name**: The name of the product variant.

* **gift\_card**: Whether the item is a gift card. If `true`, then the item is not taxed or considered for shipping charges.

* **properties**: An array of custom information for the item that has been added to the cart. Often used to provide product customization options.

* **taxable**: Whether the item was taxable.

* **tax\_lines**: A list of tax line objects, each of which details a tax applied to the item.

  * `title`: The name of the tax.
  * `price`: The amount added to the order for this tax in the shop currency after discounts are applied.
  * `price_set`: The amount added to the order for this tax in shop and presentment currencies after discounts are applied.
  * `rate`: The tax rate applied to the order to calculate the tax price.
  * `channel_liable`: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

* **tip\_payment\_gateway**: The payment gateway used to tender the tip, such as `shopify_payments`. Present only on tips.

* **tip\_payment\_method**: The payment method used to tender the tip, such as `Visa`. Present only on tips.

* **total\_discount**: The total amount of the discount allocated to the line item in the shop currency. This field must be explicitly set using draft orders, Shopify scripts, or the API. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **total\_discount\_set**: The total amount allocated to the line item in the presentment currency. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **discount\_allocations**: An ordered list of amounts allocated by discount applications. Each discount allocation is associated with a particular discount application.

  * `amount`: The discount amount allocated to the line in the shop currency.
  * `discount_application_index`: The index of the associated discount application in the order's `discount_applications` list.
  * `amount_set`: The discount amount allocated to the line item in shop and presentment currencies.

* **origin\_location**: The location of the line item’s fulfillment origin. This field is due to be **deprecated**. Consider using [' "FulfillmentOrder#assigned\_location\_id](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) instead.

  * `id`: The location ID of the line item’s fulfillment origin. Used by Shopify to calculate applicable taxes. This is not the ID of the location where the order was placed. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource to determine the location an item will be sourced from.
  * `country_code`: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the item's supplier.
  * `province_code`: The alphanumeric abbreviation for the region of the item's supplier.
  * `name`: The name of the item's supplier.
  * `address1`: The street address of the item's supplier.
  * `address2`: The suite number of the item's supplier.
  * `city`: The city of the item's supplier.
  * `zip`: The zip of the item's supplier.

* **duties**: A list of duty objects, each containing information about a duty on the line item.

order.email:​"jane\@example.com"[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

string

email

->[email](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-email)

The customer's email address.

order.phone:​"18885551234"[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

string

->[phone](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-phone)

The customer's phone number for receiving SMS notifications.

order.billing\_​address:​{"first\_name":"John",​"last\_name":"Smith",​"address1":"123 Fake Street",​"phone":"555-555-5555",​"city":"Fakecity",​"province":"Ontario",​"country":"Canada",​"zip":"K2P 1L4"}[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

object

CustomerAddress

->[billingAddress](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-billingAddress)

The mailing address associated with the payment method. This address is an optional field that won't be available on orders that do not require a payment method. It has the following properties:

Show billing\_address properties

* **address1**: The street address of the billing address.
* **address2**: An optional additional field for the street address of the billing address.
* **city**: The city, town, or village of the billing address.
* **company**: The company of the person associated with the billing address.
* **country**: The name of the country of the billing address.
* **country\_code**: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the billing address.
* **first\_name**: The first name of the person associated with the payment method.
* **last\_name**: The last name of the person associated with the payment method.
* **latitude**: The latitude of the billing address.
* **longitude**: The longitude of the billing address.
* **name**: The full name of the person associated with the payment method.
* **phone**: The phone number at the billing address.
* **province**: The name of the region (for example, province, state, or prefecture) of the billing address.
* **province\_code**: The alphanumeric abbreviation of the region of the billing address.
* **zip**: The postal code (for example, zip, postcode, or Eircode) of the billing address.

order.shipping\_​address:​{"first\_name":"Jane",​"last\_name":"Smith",​"address1":"123 Fake Street",​"phone":"777-777-7777",​"city":"Fakecity",​"province":"Ontario",​"country":"Canada",​"zip":"K2P 1L4"}[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

object

CustomerAddress

->[shippingAddress](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-shippingAddress)

The mailing address to where the order will be shipped. This address is optional and will not be available on orders that do not require shipping. It has the following properties:

Show shipping\_address properties

* **address1**: The street address of the shipping address.
* **address2**: An optional additional field for the street address of the shipping address.
* **city**: The city, town, or village of the shipping address.
* **company**: The company of the person associated with the shipping address.
* **country**: The name of the country of the shipping address.
* **country\_code**: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the shipping address.
* **first\_name**: The first name of the person associated with the shipping address.
* **last\_name**: The last name of the person associated with the shipping address.
* **latitude**: The latitude of the shipping address.
* **longitude**: The longitude of the shipping address.
* **name**: The full name of the person associated with the payment method.
* **phone**: The phone number at the shipping address.
* **province**: The name of the region (for example, province, state, or prefecture) of the shipping address.
* **province\_code**: The alphanumeric abbreviation of the region of the shipping address.
* **zip**: The postal code (for example, zip, postcode, or Eircode) of the shipping address.

order.financial\_​status:​"paid"

string

read-only

The status of payments associated with the order. Can only be set when the order is created. Valid values:

Show financial\_status properties

* **pending**: The payments are pending. Payment might fail in this state. Check again to confirm whether the payments have been paid successfully.
* **authorized**: The payments have been authorized.
* **partially\_paid**: The order has been partially paid.
* **paid**: The payments have been paid.
* **partially\_refunded**: The payments have been partially refunded.
* **refunded**: The payments have been refunded.
* **voided**: The payments have been voided.

order.discount\_​codes:​\[{"code":"FAKE30",​"amount":"9.00",​"type":"percentage"}]

array

->[discountCode](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-discountCode)

A list of discounts applied to the order.

Note

When creating an order, only the first Discount Code supplied in this field is applied to the Order.

Each discount object includes the following properties:

Show discount\_codes properties

* **amount**: The amount that's deducted from the order total. When you create an order, this value is the percentage or monetary amount to deduct. After the order is created, this property returns the calculated amount.

* **code**: When the associated discount application is of type `code`, this property returns the discount code that was entered at checkout. Otherwise this property returns the title of the discount that was applied.

* **type**: The type of discount. Default value: `fixed_amount`. Valid values:

  * `fixed_amount`: Applies `amount` as a unit of the store's currency. For example, if `amount` is 30 and the store's currency is USD, then 30 USD is deducted from the order total when the discount is applied.
  * `percentage`: Applies a discount of `amount` as a percentage of the order total.
  * `shipping`: Applies a free shipping discount on orders that have a shipping rate less than or equal to `amount`. For example, if `amount` is 30, then the discount will give the customer free shipping for any shipping rate that is less than or equal to $30.

Create an order with tax lines split across taxable line items

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.line\_​items:​\[{"title":"Red Leather Coat",​"price":129.99,​"grams":"1700",​"quantity":1},​{"title":"Blue Suede Shoes",​"price":85.95,​"grams":"750",​"quantity":1,​"taxable":false},​{"title":"Raspberry Beret",​"price":19.99,​"grams":"320",​"quantity":2}][](https://shopify.dev/apps/store/data-protection/protected-customer-data)

array

A list of line item objects, each containing information about an item in the order. Each object has the following properties:

Show line\_items properties

* **attributed\_staffs**: The staff members attributed to the line item.

  * `id`: The id of the staff member.
  * `quantity`: The quantity of the line item attributed to the staff member.

* **fulfillable\_quantity**: The amount available to fulfill, calculated as follows:
  ```
  quantity - max(refunded_quantity, fulfilled_quantity) - pending_fulfilled_quantity - open_fulfilled_quantity
  ```

* **fulfillment\_service**: The handle of a fulfillment service that stocks the product variant belonging to a line item.

  This is the handle of a third-party fulfillment service in the following scenarios:

  **Scenario 1**

  1. The product variant is stocked by a single fulfillment service.
  2. The [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice) is a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  **Scenario 2**

  1. Multiple fulfillment services stock the product variant.
  2. The last time that the line item was unfulfilled, it was awaiting fulfillment by a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  If none of the above conditions are met, then this is `manual`.

  The [relationship between a product variant and a fulfillment service was changed in the `2022-07` API version](https://shopify.dev/changelog/fulfillment-service-sku-sharing). A [ProductVariant](https://shopify.dev/api/admin-rest/latest/resources/product-variant) can be stocked by multiple fulfillment services. As a result, we recommend that you use the [InventoryLevel](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel) resource if you need to determine where a product variant is stocked.

  If you previously set this field, then we recommend that you instead [connect inventory items to locations](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel#post-inventory-levels-connect). Each [Location](https://shopify.dev/api/admin-rest/latest/resources/location) is associated with a single [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice). The value of this field after setting it will be as described above.

  If you need to determine whether a product is a gift card, then you should continue to use this field until an alternative is available.

  Altering the locations which stock a product variant won't change the value of this field for existing orders.

  Learn more about [managing inventory quantities and states](https://shopify.dev/apps/fulfillment/inventory-management-apps/quantities-states).

* **fulfillment\_status**: How far along an order is in terms line items fulfilled. Valid values: `null`, `fulfilled`, `partial`, and `not_eligible`.

* **grams**: The weight of the item in grams.

* **id**: The ID of the line item.

* **price**: The price of the item before discounts have been applied in the shop currency.

* **price\_set**: The price of the line item in shop and presentment currencies.

* **product\_id**: The ID of the product that the line item belongs to. Can be `null` if the original product associated with the order is deleted at a later date.

* **quantity**: The number of items that were purchased.

* **current\_quantity**: The line item's quantity, minus the removed quantity.

* **requires\_shipping**: Whether the item requires shipping.

* **sku**: The item's SKU (stock keeping unit).

* **title**: The title of the product.

* **variant\_id**: The ID of the product variant.

* **variant\_title**: The title of the product variant.

* **vendor**: The name of the item's supplier.

* **name**: The name of the product variant.

* **gift\_card**: Whether the item is a gift card. If `true`, then the item is not taxed or considered for shipping charges.

* **properties**: An array of custom information for the item that has been added to the cart. Often used to provide product customization options.

* **taxable**: Whether the item was taxable.

* **tax\_lines**: A list of tax line objects, each of which details a tax applied to the item.

  * `title`: The name of the tax.
  * `price`: The amount added to the order for this tax in the shop currency after discounts are applied.
  * `price_set`: The amount added to the order for this tax in shop and presentment currencies after discounts are applied.
  * `rate`: The tax rate applied to the order to calculate the tax price.
  * `channel_liable`: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

* **tip\_payment\_gateway**: The payment gateway used to tender the tip, such as `shopify_payments`. Present only on tips.

* **tip\_payment\_method**: The payment method used to tender the tip, such as `Visa`. Present only on tips.

* **total\_discount**: The total amount of the discount allocated to the line item in the shop currency. This field must be explicitly set using draft orders, Shopify scripts, or the API. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **total\_discount\_set**: The total amount allocated to the line item in the presentment currency. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **discount\_allocations**: An ordered list of amounts allocated by discount applications. Each discount allocation is associated with a particular discount application.

  * `amount`: The discount amount allocated to the line in the shop currency.
  * `discount_application_index`: The index of the associated discount application in the order's `discount_applications` list.
  * `amount_set`: The discount amount allocated to the line item in shop and presentment currencies.

* **origin\_location**: The location of the line item’s fulfillment origin. This field is due to be **deprecated**. Consider using [' "FulfillmentOrder#assigned\_location\_id](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) instead.

  * `id`: The location ID of the line item’s fulfillment origin. Used by Shopify to calculate applicable taxes. This is not the ID of the location where the order was placed. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource to determine the location an item will be sourced from.
  * `country_code`: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the item's supplier.
  * `province_code`: The alphanumeric abbreviation for the region of the item's supplier.
  * `name`: The name of the item's supplier.
  * `address1`: The street address of the item's supplier.
  * `address2`: The suite number of the item's supplier.
  * `city`: The city of the item's supplier.
  * `zip`: The zip of the item's supplier.

* **duties**: A list of duty objects, each containing information about a duty on the line item.

order.tax\_​lines:​\[{"price":10.2,​"rate":0.06,​"title":"State tax"},​{"price":4.25,​"rate":0.025,​"title":"County tax"}]

array

->[taxLines](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-taxLines)

An array of tax line objects, each of which details a tax applicable to the order. Each object has the following properties:

Show tax\_lines properties

* **price**: The amount added to the order for this tax in the shop currency after discounts are applied.
* **rate**: The rate of tax to be applied.
* **title**: The name of the tax.
* **channel\_liable**: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

When creating an order through the API, tax lines can be specified on the order or the line items but not both. Tax lines specified on the order are split across the *taxable* line items in the created order.

order.total\_​tax:​14.45

string

price

The sum of the prices for all tax lines applied to the order in the shop currency, including refunded and removed tax lines.

Creating an order with tax lines both on line items and on the order fails and returns an error

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.line\_​items:​\[{"title":"Clicky Keyboard",​"price":99.99,​"grams":"600",​"quantity":1,​"tax\_lines":\[{"price":1,​"rate":0.01,​"title":"Keyboard tax"}]}][](https://shopify.dev/apps/store/data-protection/protected-customer-data)

array

A list of line item objects, each containing information about an item in the order. Each object has the following properties:

Show line\_items properties

* **attributed\_staffs**: The staff members attributed to the line item.

  * `id`: The id of the staff member.
  * `quantity`: The quantity of the line item attributed to the staff member.

* **fulfillable\_quantity**: The amount available to fulfill, calculated as follows:
  ```
  quantity - max(refunded_quantity, fulfilled_quantity) - pending_fulfilled_quantity - open_fulfilled_quantity
  ```

* **fulfillment\_service**: The handle of a fulfillment service that stocks the product variant belonging to a line item.

  This is the handle of a third-party fulfillment service in the following scenarios:

  **Scenario 1**

  1. The product variant is stocked by a single fulfillment service.
  2. The [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice) is a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  **Scenario 2**

  1. Multiple fulfillment services stock the product variant.
  2. The last time that the line item was unfulfilled, it was awaiting fulfillment by a third-party fulfillment service. Third-party fulfillment services don't have a handle with the value `manual`.

  If none of the above conditions are met, then this is `manual`.

  The [relationship between a product variant and a fulfillment service was changed in the `2022-07` API version](https://shopify.dev/changelog/fulfillment-service-sku-sharing). A [ProductVariant](https://shopify.dev/api/admin-rest/latest/resources/product-variant) can be stocked by multiple fulfillment services. As a result, we recommend that you use the [InventoryLevel](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel) resource if you need to determine where a product variant is stocked.

  If you previously set this field, then we recommend that you instead [connect inventory items to locations](https://shopify.dev/api/admin-rest/latest/resources/inventorylevel#post-inventory-levels-connect). Each [Location](https://shopify.dev/api/admin-rest/latest/resources/location) is associated with a single [FulfillmentService](https://shopify.dev/api/admin-rest/latest/resources/fulfillmentservice). The value of this field after setting it will be as described above.

  If you need to determine whether a product is a gift card, then you should continue to use this field until an alternative is available.

  Altering the locations which stock a product variant won't change the value of this field for existing orders.

  Learn more about [managing inventory quantities and states](https://shopify.dev/apps/fulfillment/inventory-management-apps/quantities-states).

* **fulfillment\_status**: How far along an order is in terms line items fulfilled. Valid values: `null`, `fulfilled`, `partial`, and `not_eligible`.

* **grams**: The weight of the item in grams.

* **id**: The ID of the line item.

* **price**: The price of the item before discounts have been applied in the shop currency.

* **price\_set**: The price of the line item in shop and presentment currencies.

* **product\_id**: The ID of the product that the line item belongs to. Can be `null` if the original product associated with the order is deleted at a later date.

* **quantity**: The number of items that were purchased.

* **current\_quantity**: The line item's quantity, minus the removed quantity.

* **requires\_shipping**: Whether the item requires shipping.

* **sku**: The item's SKU (stock keeping unit).

* **title**: The title of the product.

* **variant\_id**: The ID of the product variant.

* **variant\_title**: The title of the product variant.

* **vendor**: The name of the item's supplier.

* **name**: The name of the product variant.

* **gift\_card**: Whether the item is a gift card. If `true`, then the item is not taxed or considered for shipping charges.

* **properties**: An array of custom information for the item that has been added to the cart. Often used to provide product customization options.

* **taxable**: Whether the item was taxable.

* **tax\_lines**: A list of tax line objects, each of which details a tax applied to the item.

  * `title`: The name of the tax.
  * `price`: The amount added to the order for this tax in the shop currency after discounts are applied.
  * `price_set`: The amount added to the order for this tax in shop and presentment currencies after discounts are applied.
  * `rate`: The tax rate applied to the order to calculate the tax price.
  * `channel_liable`: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

* **tip\_payment\_gateway**: The payment gateway used to tender the tip, such as `shopify_payments`. Present only on tips.

* **tip\_payment\_method**: The payment method used to tender the tip, such as `Visa`. Present only on tips.

* **total\_discount**: The total amount of the discount allocated to the line item in the shop currency. This field must be explicitly set using draft orders, Shopify scripts, or the API. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **total\_discount\_set**: The total amount allocated to the line item in the presentment currency. Instead of using this field, Shopify recommends using `discount_allocations`, which provides the same information.

* **discount\_allocations**: An ordered list of amounts allocated by discount applications. Each discount allocation is associated with a particular discount application.

  * `amount`: The discount amount allocated to the line in the shop currency.
  * `discount_application_index`: The index of the associated discount application in the order's `discount_applications` list.
  * `amount_set`: The discount amount allocated to the line item in shop and presentment currencies.

* **origin\_location**: The location of the line item’s fulfillment origin. This field is due to be **deprecated**. Consider using [' "FulfillmentOrder#assigned\_location\_id](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) instead.

  * `id`: The location ID of the line item’s fulfillment origin. Used by Shopify to calculate applicable taxes. This is not the ID of the location where the order was placed. You can use the [FulfillmentOrder](https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillmentorder) resource to determine the location an item will be sourced from.
  * `country_code`: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the item's supplier.
  * `province_code`: The alphanumeric abbreviation for the region of the item's supplier.
  * `name`: The name of the item's supplier.
  * `address1`: The street address of the item's supplier.
  * `address2`: The suite number of the item's supplier.
  * `city`: The city of the item's supplier.
  * `zip`: The zip of the item's supplier.

* **duties**: A list of duty objects, each containing information about a duty on the line item.

order.tax\_​lines:​\[{"price":6,​"rate":0.06,​"title":"State tax"}]

array

->[taxLines](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateOrderInput#fields-taxLines)

An array of tax line objects, each of which details a tax applicable to the order. Each object has the following properties:

Show tax\_lines properties

* **price**: The amount added to the order for this tax in the shop currency after discounts are applied.
* **rate**: The rate of tax to be applied.
* **title**: The name of the tax.
* **channel\_liable**: Whether the channel that submitted the tax line is liable for remitting. A value of `null` indicates unknown liability for the tax line.

When creating an order through the API, tax lines can be specified on the order or the line items but not both. Tax lines specified on the order are split across the *taxable* line items in the created order.

post

## /admin/api/2025-10/orders.​json

```bash
curl -d '{"order":{"line_items":[{"title":"Big Brown Bear Boots","price":74.99,"grams":"1300","quantity":3,"tax_lines":[{"price":13.5,"rate":0.06,"title":"State tax"}]}],"transactions":[{"kind":"sale","status":"success","amount":238.47}],"total_tax":13.5,"currency":"EUR"}}' \
-X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json" \
-H "X-Shopify-Access-Token: {access_token}" \
-H "Content-Type: application/json"
```

{}

## Response

JSON

```json
HTTP/1.1 201 Created
{
  "order": {
    "id": 1073459975,
    "admin_graphql_api_id": "gid://shopify/Order/1073459975",
    "app_id": 755357713,
    "browser_ip": null,
    "buyer_accepts_marketing": false,
    "cancel_reason": null,
    "cancelled_at": null,
    "cart_token": null,
    "checkout_id": null,
    "checkout_token": null,
    "client_details": null,
    "closed_at": null,
    "confirmation_number": "8XZZMTYKY",
    "confirmed": true,
    "contact_email": null,
    "created_at": "2025-10-01T14:58:40-04:00",
    "currency": "EUR",
    "current_subtotal_price": "224.97",
    "current_subtotal_price_set": {
      "shop_money": {
        "amount": "224.97",
        "currency_code": "EUR"
      },
      "presentment_money": {
        "amount": "224.97",
        "currency_code": "EUR"
      }
    },
    "current_total_additional_fees_set": null,
    "current_total_discounts": "0.00",
    "current_total_discounts_set": {
      "shop_money": {
        "amount": "0.00",
```

### examples

* #### Create a comprehensive order

  #####

  ```curl
  curl -d '{"order":{"line_items":[{"title":"Big Brown Bear Boots","price":74.99,"grams":"1300","quantity":3,"tax_lines":[{"price":13.5,"rate":0.06,"title":"State tax"}]}],"transactions":[{"kind":"sale","status":"success","amount":238.47}],"total_tax":13.5,"currency":"EUR"}}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.line_items = [
    {
      "title": "Big Brown Bear Boots",
      "price": 74.99,
      "grams": "1300",
      "quantity": 3,
      "tax_lines": [
        {
          "price": 13.5,
          "rate": 0.06,
          "title": "State tax"
        }
      ]
    }
  ];
  order.transactions = [
    {
      "kind": "sale",
      "status": "success",
      "amount": 238.47
    }
  ];
  order.total_tax = 13.5;
  order.currency = "EUR";
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.line_items = [
    {
      "title" => "Big Brown Bear Boots",
      "price" => 74.99,
      "grams" => "1300",
      "quantity" => 3,
      "tax_lines" => [
        {
          "price" => 13.5,
          "rate" => 0.06,
          "title" => "State tax"
        }
      ]
    }
  ]
  order.transactions = [
    {
      "kind" => "sale",
      "status" => "success",
      "amount" => 238.47
    }
  ]
  order.total_tax = 13.5
  order.currency = "EUR"
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.line_items = [
    {
      "title": "Big Brown Bear Boots",
      "price": 74.99,
      "grams": "1300",
      "quantity": 3,
      "tax_lines": [
        {
          "price": 13.5,
          "rate": 0.06,
          "title": "State tax"
        }
      ]
    }
  ];
  order.transactions = [
    {
      "kind": "sale",
      "status": "success",
      "amount": 238.47
    }
  ];
  order.total_tax = 13.5;
  order.currency = "EUR";
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 201 Created{"order":{"id":1073459975,"admin_graphql_api_id":"gid://shopify/Order/1073459975","app_id":755357713,"browser_ip":null,"buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":null,"checkout_id":null,"checkout_token":null,"client_details":null,"closed_at":null,"confirmation_number":"8XZZMTYKY","confirmed":true,"contact_email":null,"created_at":"2025-10-01T14:58:40-04:00","currency":"EUR","current_subtotal_price":"224.97","current_subtotal_price_set":{"shop_money":{"amount":"224.97","currency_code":"EUR"},"presentment_money":{"amount":"224.97","currency_code":"EUR"}},"current_total_additional_fees_set":null,"current_total_discounts":"0.00","current_total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"EUR"},"presentment_money":{"amount":"0.00","currency_code":"EUR"}},"current_total_duties_set":null,"current_total_price":"238.47","current_total_price_set":{"shop_money":{"amount":"238.47","currency_code":"EUR"},"presentment_money":{"amount":"238.47","currency_code":"EUR"}},"current_total_tax":"13.50","current_total_tax_set":{"shop_money":{"amount":"13.50","currency_code":"EUR"},"presentment_money":{"amount":"13.50","currency_code":"EUR"}},"customer_locale":null,"device_id":null,"discount_codes":[],"duties_included":false,"email":"","estimated_taxes":false,"financial_status":"paid","fulfillment_status":null,"landing_site":null,"landing_site_ref":null,"location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1002","note":null,"note_attributes":[],"number":2,"order_number":1002,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/70c3ba9fb8cf9f9943ab84edeb98e10d/authenticate?key=63afbe0dba5a3f2f21907ea35b3ece95","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":[""],"phone":null,"po_number":null,"presentment_currency":"EUR","processed_at":"2025-10-01T14:58:40-04:00","reference":null,"referring_site":null,"source_identifier":null,"source_name":"755357713","source_url":null,"subtotal_price":"224.97","subtotal_price_set":{"shop_money":{"amount":"224.97","currency_code":"EUR"},"presentment_money":{"amount":"224.97","currency_code":"EUR"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"13.50","rate":0.06,"title":"State tax","price_set":{"shop_money":{"amount":"13.50","currency_code":"EUR"},"presentment_money":{"amount":"13.50","currency_code":"EUR"}},"channel_liable":false}],"taxes_included":false,"test":false,"token":"70c3ba9fb8cf9f9943ab84edeb98e10d","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"EUR"},"presentment_money":{"amount":"0.00","currency_code":"EUR"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"EUR"},"presentment_money":{"amount":"0.00","currency_code":"EUR"}},"total_discounts":"0.00","total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"EUR"},"presentment_money":{"amount":"0.00","currency_code":"EUR"}},"total_line_items_price":"224.97","total_line_items_price_set":{"shop_money":{"amount":"224.97","currency_code":"EUR"},"presentment_money":{"amount":"224.97","currency_code":"EUR"}},"total_outstanding":"0.00","total_price":"238.47","total_price_set":{"shop_money":{"amount":"238.47","currency_code":"EUR"},"presentment_money":{"amount":"238.47","currency_code":"EUR"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"EUR"},"presentment_money":{"amount":"0.00","currency_code":"EUR"}},"total_tax":"13.50","total_tax_set":{"shop_money":{"amount":"13.50","currency_code":"EUR"},"presentment_money":{"amount":"13.50","currency_code":"EUR"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:40-04:00","user_id":null,"billing_address":null,"customer":null,"discount_applications":[],"fulfillments":[],"line_items":[{"id":1071823190,"admin_graphql_api_id":"gid://shopify/LineItem/1071823190","attributed_staffs":[],"current_quantity":3,"fulfillable_quantity":3,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":1300,"name":"Big Brown Bear Boots","price":"74.99","price_set":{"shop_money":{"amount":"74.99","currency_code":"EUR"},"presentment_money":{"amount":"74.99","currency_code":"EUR"}},"product_exists":false,"product_id":null,"properties":[],"quantity":3,"requires_shipping":true,"sku":null,"taxable":true,"title":"Big Brown Bear Boots","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"EUR"},"presentment_money":{"amount":"0.00","currency_code":"EUR"}},"variant_id":null,"variant_inventory_management":null,"variant_title":null,"vendor":null,"tax_lines":[{"channel_liable":false,"price":"13.50","price_set":{"shop_money":{"amount":"13.50","currency_code":"EUR"},"presentment_money":{"amount":"13.50","currency_code":"EUR"}},"rate":0.06,"title":"State tax"}],"duties":[],"discount_allocations":[]}],"payment_terms":null,"refunds":[],"shipping_address":null,"shipping_lines":[]}}
  ```

* #### Create a partially paid order with a new customer and addresses

  #####

  ```curl
  curl -d '{"order":{"line_items":[{"variant_id":447654529,"quantity":1}],"customer":{"first_name":"Paul","last_name":"Norman","email":"paul.norman@example.com"},"billing_address":{"first_name":"John","last_name":"Smith","address1":"123 Fake Street","phone":"555-555-5555","city":"Fakecity","province":"Ontario","country":"Canada","zip":"K2P 1L4"},"shipping_address":{"first_name":"Jane","last_name":"Smith","address1":"123 Fake Street","phone":"777-777-7777","city":"Fakecity","province":"Ontario","country":"Canada","zip":"K2P 1L4"},"email":"jane@example.com","transactions":[{"kind":"authorization","status":"success","amount":50.0}],"financial_status":"partially_paid"}}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  order.customer = {
    "first_name": "Paul",
    "last_name": "Norman",
    "email": "paul.norman@example.com"
  };
  order.billing_address = {
    "first_name": "John",
    "last_name": "Smith",
    "address1": "123 Fake Street",
    "phone": "555-555-5555",
    "city": "Fakecity",
    "province": "Ontario",
    "country": "Canada",
    "zip": "K2P 1L4"
  };
  order.shipping_address = {
    "first_name": "Jane",
    "last_name": "Smith",
    "address1": "123 Fake Street",
    "phone": "777-777-7777",
    "city": "Fakecity",
    "province": "Ontario",
    "country": "Canada",
    "zip": "K2P 1L4"
  };
  order.email = "jane@example.com";
  order.transactions = [
    {
      "kind": "authorization",
      "status": "success",
      "amount": 50.0
    }
  ];
  order.financial_status = "partially_paid";
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.line_items = [
    {
      "variant_id" => 447654529,
      "quantity" => 1
    }
  ]
  order.customer = {
    "first_name" => "Paul",
    "last_name" => "Norman",
    "email" => "paul.norman@example.com"
  }
  order.billing_address = {
    "first_name" => "John",
    "last_name" => "Smith",
    "address1" => "123 Fake Street",
    "phone" => "555-555-5555",
    "city" => "Fakecity",
    "province" => "Ontario",
    "country" => "Canada",
    "zip" => "K2P 1L4"
  }
  order.shipping_address = {
    "first_name" => "Jane",
    "last_name" => "Smith",
    "address1" => "123 Fake Street",
    "phone" => "777-777-7777",
    "city" => "Fakecity",
    "province" => "Ontario",
    "country" => "Canada",
    "zip" => "K2P 1L4"
  }
  order.email = "jane@example.com"
  order.transactions = [
    {
      "kind" => "authorization",
      "status" => "success",
      "amount" => 50.0
    }
  ]
  order.financial_status = "partially_paid"
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  order.customer = {
    "first_name": "Paul",
    "last_name": "Norman",
    "email": "paul.norman@example.com"
  };
  order.billing_address = {
    "first_name": "John",
    "last_name": "Smith",
    "address1": "123 Fake Street",
    "phone": "555-555-5555",
    "city": "Fakecity",
    "province": "Ontario",
    "country": "Canada",
    "zip": "K2P 1L4"
  };
  order.shipping_address = {
    "first_name": "Jane",
    "last_name": "Smith",
    "address1": "123 Fake Street",
    "phone": "777-777-7777",
    "city": "Fakecity",
    "province": "Ontario",
    "country": "Canada",
    "zip": "K2P 1L4"
  };
  order.email = "jane@example.com";
  order.transactions = [
    {
      "kind": "authorization",
      "status": "success",
      "amount": 50.0
    }
  ];
  order.financial_status = "partially_paid";
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 201 Created{"order":{"id":1073459972,"admin_graphql_api_id":"gid://shopify/Order/1073459972","app_id":755357713,"browser_ip":null,"buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":null,"checkout_id":null,"checkout_token":null,"client_details":null,"closed_at":null,"confirmation_number":"7Q4NV4N9N","confirmed":true,"contact_email":"jane@example.com","created_at":"2025-10-01T14:58:34-04:00","currency":"USD","current_subtotal_price":"199.00","current_subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"0.00","current_total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.00","current_total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_tax":"0.00","current_total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[],"duties_included":false,"email":"jane@example.com","estimated_taxes":false,"financial_status":"partially_paid","fulfillment_status":null,"landing_site":null,"landing_site_ref":null,"location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1002","note":null,"note_attributes":[],"number":2,"order_number":1002,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/3b677b22f5b70607e2b7d42a636ec9e5/authenticate?key=73b8d0ae8fc5b8274ac5bee6a86559bc","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":[""],"phone":null,"po_number":null,"presentment_currency":"USD","processed_at":"2025-10-01T14:58:34-04:00","reference":null,"referring_site":null,"source_identifier":null,"source_name":"755357713","source_url":null,"subtotal_price":"199.00","subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[],"taxes_included":false,"test":false,"token":"3b677b22f5b70607e2b7d42a636ec9e5","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"0.00","total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_line_items_price":"199.00","total_line_items_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_outstanding":"149.00","total_price":"199.00","total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"0.00","total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:34-04:00","user_id":null,"billing_address":{"first_name":"John","address1":"123 Fake Street","phone":"555-555-5555","city":"Fakecity","zip":"K2P 1L4","province":"Ontario","country":"Canada","last_name":"Smith","address2":null,"company":null,"latitude":null,"longitude":null,"name":"John Smith","country_code":"CA","province_code":"ON"},"customer":{"id":1073339462,"created_at":"2025-10-01T14:58:34-04:00","updated_at":"2025-10-01T14:58:34-04:00","first_name":"John","last_name":"Smith","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":null},"sms_marketing_consent":null,"tags":"","email":"paul.norman@example.com","phone":null,"currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/1073339462","default_address":{"id":1053317292,"customer_id":1073339462,"first_name":"Jane","last_name":"Smith","company":null,"address1":"123 Fake Street","address2":null,"city":"Fakecity","province":"Ontario","country":"Canada","zip":"K2P 1L4","phone":"777-777-7777","name":"Jane Smith","province_code":"ON","country_code":"CA","country_name":"Canada","default":true}},"discount_applications":[],"fulfillments":[],"line_items":[{"id":1071823185,"admin_graphql_api_id":"gid://shopify/LineItem/1071823185","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":567,"name":"IPod Touch 8GB - Black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":921728736,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2009BLACK","taxable":true,"title":"IPod Touch 8GB","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":447654529,"variant_inventory_management":"shopify","variant_title":"Black","vendor":"Apple","tax_lines":[],"duties":[],"discount_allocations":[]}],"payment_terms":null,"refunds":[],"shipping_address":{"first_name":"Jane","address1":"123 Fake Street","phone":"777-777-7777","city":"Fakecity","zip":"K2P 1L4","province":"Ontario","country":"Canada","last_name":"Smith","address2":null,"company":null,"latitude":null,"longitude":null,"name":"Jane Smith","country_code":"CA","province_code":"ON"},"shipping_lines":[]}}
  ```

* #### Create a pending order with an existing customer

  #####

  ```curl
  curl -d '{"order":{"line_items":[{"variant_id":447654529,"quantity":1}],"customer":{"id":207119551},"financial_status":"pending"}}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  order.customer = {
    "id": 207119551
  };
  order.financial_status = "pending";
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.line_items = [
    {
      "variant_id" => 447654529,
      "quantity" => 1
    }
  ]
  order.customer = {
    "id" => 207119551
  }
  order.financial_status = "pending"
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  order.customer = {
    "id": 207119551
  };
  order.financial_status = "pending";
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 201 Created{"order":{"id":1073459976,"admin_graphql_api_id":"gid://shopify/Order/1073459976","app_id":755357713,"browser_ip":null,"buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":null,"checkout_id":null,"checkout_token":null,"client_details":null,"closed_at":null,"confirmation_number":"7L4QU85RX","confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2025-10-01T14:58:42-04:00","currency":"USD","current_subtotal_price":"199.00","current_subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"0.00","current_total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.00","current_total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_tax":"0.00","current_total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"pending","fulfillment_status":null,"landing_site":null,"landing_site_ref":null,"location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1002","note":null,"note_attributes":[],"number":2,"order_number":1002,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/e2dc7695c2a66b5b86dab9ed7c83aa6b/authenticate?key=bfa14a0cacbae6119b304a7f79a42e17","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":[],"phone":null,"po_number":null,"presentment_currency":"USD","processed_at":"2025-10-01T14:58:42-04:00","reference":null,"referring_site":null,"source_identifier":null,"source_name":"755357713","source_url":null,"subtotal_price":"199.00","subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[],"taxes_included":false,"test":false,"token":"e2dc7695c2a66b5b86dab9ed7c83aa6b","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"0.00","total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_line_items_price":"199.00","total_line_items_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_outstanding":"199.00","total_price":"199.00","total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"0.00","total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:42-04:00","user_id":null,"billing_address":null,"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:58:42-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[],"fulfillments":[],"line_items":[{"id":1071823191,"admin_graphql_api_id":"gid://shopify/LineItem/1071823191","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":567,"name":"IPod Touch 8GB - Black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":921728736,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2009BLACK","taxable":true,"title":"IPod Touch 8GB","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":447654529,"variant_inventory_management":"shopify","variant_title":"Black","vendor":"Apple","tax_lines":[],"duties":[],"discount_allocations":[]}],"payment_terms":null,"refunds":[],"shipping_address":null,"shipping_lines":[]}}
  ```

* #### Create a simple order and fulfill it

  #####

  ```curl
  curl -d '{"order":{"email":"foo@example.com","fulfillment_status":"fulfilled","fulfillments":[{"location_id":24826418}],"line_items":[{"variant_id":447654529,"quantity":1}]}}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.email = "foo@example.com";
  order.fulfillment_status = "fulfilled";
  order.fulfillments = [
    {
      "location_id": 24826418
    }
  ];
  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.email = "foo@example.com"
  order.fulfillment_status = "fulfilled"
  order.fulfillments = [
    {
      "location_id" => 24826418
    }
  ]
  order.line_items = [
    {
      "variant_id" => 447654529,
      "quantity" => 1
    }
  ]
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.email = "foo@example.com";
  order.fulfillment_status = "fulfilled";
  order.fulfillments = [
    {
      "location_id": 24826418
    }
  ];
  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 201 Created{"order":{"id":1073459986,"admin_graphql_api_id":"gid://shopify/Order/1073459986","app_id":755357713,"browser_ip":null,"buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":null,"checkout_id":null,"checkout_token":null,"client_details":null,"closed_at":null,"confirmation_number":"F78UM3ZHA","confirmed":true,"contact_email":"foo@example.com","created_at":"2025-10-01T14:59:20-04:00","currency":"USD","current_subtotal_price":"199.00","current_subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"0.00","current_total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.00","current_total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_tax":"0.00","current_total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[],"duties_included":false,"email":"foo@example.com","estimated_taxes":false,"financial_status":"paid","fulfillment_status":"fulfilled","landing_site":null,"landing_site_ref":null,"location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1002","note":null,"note_attributes":[],"number":2,"order_number":1002,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/d04e50c4bc258003ffaa5bafa7589282/authenticate?key=0881119ed469e70f733c1c6f583fc76c","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":[],"phone":null,"po_number":null,"presentment_currency":"USD","processed_at":"2025-10-01T14:59:20-04:00","reference":null,"referring_site":null,"source_identifier":null,"source_name":"755357713","source_url":null,"subtotal_price":"199.00","subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[],"taxes_included":false,"test":false,"token":"d04e50c4bc258003ffaa5bafa7589282","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"0.00","total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_line_items_price":"199.00","total_line_items_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_outstanding":"199.00","total_price":"199.00","total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"0.00","total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:59:20-04:00","user_id":null,"billing_address":null,"customer":{"id":1073339469,"created_at":"2025-10-01T14:59:20-04:00","updated_at":"2025-10-01T14:59:21-04:00","first_name":null,"last_name":null,"state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":null},"sms_marketing_consent":null,"tags":"","email":"foo@example.com","phone":null,"currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/1073339469"},"discount_applications":[],"fulfillments":[{"id":1069019867,"admin_graphql_api_id":"gid://shopify/Fulfillment/1069019867","created_at":"2025-10-01T14:59:20-04:00","location_id":24826418,"name":"#1002.1","order_id":1073459986,"origin_address":{},"receipt":{},"service":"shipwire-app","shipment_status":null,"status":"success","tracking_company":null,"tracking_number":null,"tracking_numbers":[],"tracking_url":null,"tracking_urls":[],"updated_at":"2025-10-01T14:59:20-04:00","line_items":[{"id":1071823202,"admin_graphql_api_id":"gid://shopify/LineItem/1071823202","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":0,"fulfillment_service":"shipwire-app","fulfillment_status":"fulfilled","gift_card":false,"grams":567,"name":"IPod Touch 8GB - Black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":921728736,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2009BLACK","taxable":true,"title":"IPod Touch 8GB","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":447654529,"variant_inventory_management":"shopify","variant_title":"Black","vendor":"Apple","tax_lines":[],"duties":[],"discount_allocations":[]}]}],"line_items":[{"id":1071823202,"admin_graphql_api_id":"gid://shopify/LineItem/1071823202","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":0,"fulfillment_service":"shipwire-app","fulfillment_status":"fulfilled","gift_card":false,"grams":567,"name":"IPod Touch 8GB - Black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":921728736,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2009BLACK","taxable":true,"title":"IPod Touch 8GB","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":447654529,"variant_inventory_management":"shopify","variant_title":"Black","vendor":"Apple","tax_lines":[],"duties":[],"discount_allocations":[]}],"payment_terms":null,"refunds":[],"shipping_address":null,"shipping_lines":[]}}
  ```

* #### Create a simple order with only a product variant ID and no optional parameters

  #####

  ```curl
  curl -d '{"order":{"line_items":[{"variant_id":447654529,"quantity":1}]}}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.line_items = [
    {
      "variant_id" => 447654529,
      "quantity" => 1
    }
  ]
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 201 Created{"order":{"id":1073459964,"admin_graphql_api_id":"gid://shopify/Order/1073459964","app_id":755357713,"browser_ip":null,"buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":null,"checkout_id":null,"checkout_token":null,"client_details":null,"closed_at":null,"confirmation_number":"UIVCYFMWE","confirmed":true,"contact_email":null,"created_at":"2025-10-01T14:57:46-04:00","currency":"USD","current_subtotal_price":"199.00","current_subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"0.00","current_total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.00","current_total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_tax":"0.00","current_total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[],"duties_included":false,"email":"","estimated_taxes":false,"financial_status":"paid","fulfillment_status":null,"landing_site":null,"landing_site_ref":null,"location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1002","note":null,"note_attributes":[],"number":2,"order_number":1002,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/86b54ac1fdb045c6277bfc00a5d39feb/authenticate?key=4ea8619f83f187c212bf48738dbf66ee","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":[],"phone":null,"po_number":null,"presentment_currency":"USD","processed_at":"2025-10-01T14:57:46-04:00","reference":null,"referring_site":null,"source_identifier":null,"source_name":"755357713","source_url":null,"subtotal_price":"199.00","subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[],"taxes_included":false,"test":false,"token":"86b54ac1fdb045c6277bfc00a5d39feb","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"0.00","total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_line_items_price":"199.00","total_line_items_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_outstanding":"199.00","total_price":"199.00","total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"0.00","total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:57:46-04:00","user_id":null,"billing_address":null,"customer":null,"discount_applications":[],"fulfillments":[],"line_items":[{"id":1071823178,"admin_graphql_api_id":"gid://shopify/LineItem/1071823178","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":567,"name":"IPod Touch 8GB - Black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":921728736,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2009BLACK","taxable":true,"title":"IPod Touch 8GB","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":447654529,"variant_inventory_management":"shopify","variant_title":"Black","vendor":"Apple","tax_lines":[],"duties":[],"discount_allocations":[]}],"payment_terms":null,"refunds":[],"shipping_address":null,"shipping_lines":[]}}
  ```

* #### Create a simple order without sending an order receipt or a fulfillment receipt

  #####

  ```curl
  curl -d '{"order":{"email":"foo@example.com","fulfillment_status":"fulfilled","line_items":[{"variant_id":447654529,"quantity":1}]}}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.email = "foo@example.com";
  order.fulfillment_status = "fulfilled";
  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.email = "foo@example.com"
  order.fulfillment_status = "fulfilled"
  order.line_items = [
    {
      "variant_id" => 447654529,
      "quantity" => 1
    }
  ]
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.email = "foo@example.com";
  order.fulfillment_status = "fulfilled";
  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 201 Created{"order":{"id":1073459982,"admin_graphql_api_id":"gid://shopify/Order/1073459982","app_id":755357713,"browser_ip":null,"buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":null,"checkout_id":null,"checkout_token":null,"client_details":null,"closed_at":null,"confirmation_number":"U2AIVH7CF","confirmed":true,"contact_email":"foo@example.com","created_at":"2025-10-01T14:59:02-04:00","currency":"USD","current_subtotal_price":"199.00","current_subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"0.00","current_total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.00","current_total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_tax":"0.00","current_total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[],"duties_included":false,"email":"foo@example.com","estimated_taxes":false,"financial_status":"paid","fulfillment_status":"fulfilled","landing_site":null,"landing_site_ref":null,"location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1002","note":null,"note_attributes":[],"number":2,"order_number":1002,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b265b3fa6b8434a0caa77f2e0311553e/authenticate?key=9685c71065de636807e3af151a66a289","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":[],"phone":null,"po_number":null,"presentment_currency":"USD","processed_at":"2025-10-01T14:59:02-04:00","reference":null,"referring_site":null,"source_identifier":null,"source_name":"755357713","source_url":null,"subtotal_price":"199.00","subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[],"taxes_included":false,"test":false,"token":"b265b3fa6b8434a0caa77f2e0311553e","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"0.00","total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_line_items_price":"199.00","total_line_items_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_outstanding":"199.00","total_price":"199.00","total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"0.00","total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:59:02-04:00","user_id":null,"billing_address":null,"customer":{"id":1073339467,"created_at":"2025-10-01T14:59:02-04:00","updated_at":"2025-10-01T14:59:03-04:00","first_name":null,"last_name":null,"state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":null},"sms_marketing_consent":null,"tags":"","email":"foo@example.com","phone":null,"currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/1073339467"},"discount_applications":[],"fulfillments":[{"id":1069019865,"admin_graphql_api_id":"gid://shopify/Fulfillment/1069019865","created_at":"2025-10-01T14:59:02-04:00","location_id":24826418,"name":"#1002.1","order_id":1073459982,"origin_address":{},"receipt":{},"service":"shipwire-app","shipment_status":null,"status":"success","tracking_company":null,"tracking_number":null,"tracking_numbers":[],"tracking_url":null,"tracking_urls":[],"updated_at":"2025-10-01T14:59:02-04:00","line_items":[{"id":1071823199,"admin_graphql_api_id":"gid://shopify/LineItem/1071823199","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":0,"fulfillment_service":"shipwire-app","fulfillment_status":"fulfilled","gift_card":false,"grams":567,"name":"IPod Touch 8GB - Black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":921728736,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2009BLACK","taxable":true,"title":"IPod Touch 8GB","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":447654529,"variant_inventory_management":"shopify","variant_title":"Black","vendor":"Apple","tax_lines":[],"duties":[],"discount_allocations":[]}]}],"line_items":[{"id":1071823199,"admin_graphql_api_id":"gid://shopify/LineItem/1071823199","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":0,"fulfillment_service":"shipwire-app","fulfillment_status":"fulfilled","gift_card":false,"grams":567,"name":"IPod Touch 8GB - Black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":921728736,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2009BLACK","taxable":true,"title":"IPod Touch 8GB","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":447654529,"variant_inventory_management":"shopify","variant_title":"Black","vendor":"Apple","tax_lines":[],"duties":[],"discount_allocations":[]}],"payment_terms":null,"refunds":[],"shipping_address":null,"shipping_lines":[]}}
  ```

* #### Create a simple order, sending an order confirmation and a shipping confirmation to the customer

  #####

  ```curl
  curl -d '{"order":{"email":"foo@example.com","fulfillment_status":"fulfilled","send_receipt":true,"send_fulfillment_receipt":true,"line_items":[{"variant_id":457924702,"quantity":1}]}}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.email = "foo@example.com";
  order.fulfillment_status = "fulfilled";
  order.send_receipt = true;
  order.send_fulfillment_receipt = true;
  order.line_items = [
    {
      "variant_id": 457924702,
      "quantity": 1
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.email = "foo@example.com"
  order.fulfillment_status = "fulfilled"
  order.send_receipt = true
  order.send_fulfillment_receipt = true
  order.line_items = [
    {
      "variant_id" => 457924702,
      "quantity" => 1
    }
  ]
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.email = "foo@example.com";
  order.fulfillment_status = "fulfilled";
  order.send_receipt = true;
  order.send_fulfillment_receipt = true;
  order.line_items = [
    {
      "variant_id": 457924702,
      "quantity": 1
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 201 Created{"order":{"id":1073459984,"admin_graphql_api_id":"gid://shopify/Order/1073459984","app_id":755357713,"browser_ip":null,"buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":null,"checkout_id":null,"checkout_token":null,"client_details":null,"closed_at":null,"confirmation_number":"FGGDKR9PF","confirmed":true,"contact_email":"foo@example.com","created_at":"2025-10-01T14:59:12-04:00","currency":"USD","current_subtotal_price":"199.00","current_subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"0.00","current_total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.00","current_total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_tax":"0.00","current_total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[],"duties_included":false,"email":"foo@example.com","estimated_taxes":false,"financial_status":"paid","fulfillment_status":"fulfilled","landing_site":null,"landing_site_ref":null,"location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1002","note":null,"note_attributes":[],"number":2,"order_number":1002,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/78e76b5c54dc4b4bc322bb4bca08ce80/authenticate?key=8c497854032b0cdc5cd57e570ad7fd2e","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":[],"phone":null,"po_number":null,"presentment_currency":"USD","processed_at":"2025-10-01T14:59:12-04:00","reference":null,"referring_site":null,"source_identifier":null,"source_name":"755357713","source_url":null,"subtotal_price":"199.00","subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[],"taxes_included":false,"test":false,"token":"78e76b5c54dc4b4bc322bb4bca08ce80","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"0.00","total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_line_items_price":"199.00","total_line_items_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_outstanding":"199.00","total_price":"199.00","total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"0.00","total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:59:12-04:00","user_id":null,"billing_address":null,"customer":{"id":1073339468,"created_at":"2025-10-01T14:59:12-04:00","updated_at":"2025-10-01T14:59:12-04:00","first_name":null,"last_name":null,"state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":null},"sms_marketing_consent":null,"tags":"","email":"foo@example.com","phone":null,"currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/1073339468"},"discount_applications":[],"fulfillments":[{"id":1069019866,"admin_graphql_api_id":"gid://shopify/Fulfillment/1069019866","created_at":"2025-10-01T14:59:12-04:00","location_id":655441491,"name":"#1002.1","order_id":1073459984,"origin_address":{},"receipt":{},"service":"manual","shipment_status":null,"status":"success","tracking_company":null,"tracking_number":null,"tracking_numbers":[],"tracking_url":null,"tracking_urls":[],"updated_at":"2025-10-01T14:59:12-04:00","line_items":[{"id":1071823200,"admin_graphql_api_id":"gid://shopify/LineItem/1071823200","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":"fulfilled","gift_card":false,"grams":567,"name":"IPod Nano - 8GB - Black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8GB","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"Black","vendor":"Apple","tax_lines":[],"duties":[],"discount_allocations":[]}]}],"line_items":[{"id":1071823200,"admin_graphql_api_id":"gid://shopify/LineItem/1071823200","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":"fulfilled","gift_card":false,"grams":567,"name":"IPod Nano - 8GB - Black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8GB","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"Black","vendor":"Apple","tax_lines":[],"duties":[],"discount_allocations":[]}],"payment_terms":null,"refunds":[],"shipping_address":null,"shipping_lines":[]}}
  ```

* #### Create an order and apply a discount

  #####

  ```curl
  curl -d '{"order":{"line_items":[{"variant_id":447654529,"quantity":1}],"email":"jane@example.com","phone":"18885551234","billing_address":{"first_name":"John","last_name":"Smith","address1":"123 Fake Street","phone":"555-555-5555","city":"Fakecity","province":"Ontario","country":"Canada","zip":"K2P 1L4"},"shipping_address":{"first_name":"Jane","last_name":"Smith","address1":"123 Fake Street","phone":"777-777-7777","city":"Fakecity","province":"Ontario","country":"Canada","zip":"K2P 1L4"},"transactions":[{"kind":"sale","status":"success","amount":50.0}],"financial_status":"paid","discount_codes":[{"code":"FAKE30","amount":"9.00","type":"percentage"}]}}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  order.email = "jane@example.com";
  order.phone = "18885551234";
  order.billing_address = {
    "first_name": "John",
    "last_name": "Smith",
    "address1": "123 Fake Street",
    "phone": "555-555-5555",
    "city": "Fakecity",
    "province": "Ontario",
    "country": "Canada",
    "zip": "K2P 1L4"
  };
  order.shipping_address = {
    "first_name": "Jane",
    "last_name": "Smith",
    "address1": "123 Fake Street",
    "phone": "777-777-7777",
    "city": "Fakecity",
    "province": "Ontario",
    "country": "Canada",
    "zip": "K2P 1L4"
  };
  order.transactions = [
    {
      "kind": "sale",
      "status": "success",
      "amount": 50.0
    }
  ];
  order.financial_status = "paid";
  order.discount_codes = [
    {
      "code": "FAKE30",
      "amount": "9.00",
      "type": "percentage"
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.line_items = [
    {
      "variant_id" => 447654529,
      "quantity" => 1
    }
  ]
  order.email = "jane@example.com"
  order.phone = "18885551234"
  order.billing_address = {
    "first_name" => "John",
    "last_name" => "Smith",
    "address1" => "123 Fake Street",
    "phone" => "555-555-5555",
    "city" => "Fakecity",
    "province" => "Ontario",
    "country" => "Canada",
    "zip" => "K2P 1L4"
  }
  order.shipping_address = {
    "first_name" => "Jane",
    "last_name" => "Smith",
    "address1" => "123 Fake Street",
    "phone" => "777-777-7777",
    "city" => "Fakecity",
    "province" => "Ontario",
    "country" => "Canada",
    "zip" => "K2P 1L4"
  }
  order.transactions = [
    {
      "kind" => "sale",
      "status" => "success",
      "amount" => 50.0
    }
  ]
  order.financial_status = "paid"
  order.discount_codes = [
    {
      "code" => "FAKE30",
      "amount" => "9.00",
      "type" => "percentage"
    }
  ]
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.line_items = [
    {
      "variant_id": 447654529,
      "quantity": 1
    }
  ];
  order.email = "jane@example.com";
  order.phone = "18885551234";
  order.billing_address = {
    "first_name": "John",
    "last_name": "Smith",
    "address1": "123 Fake Street",
    "phone": "555-555-5555",
    "city": "Fakecity",
    "province": "Ontario",
    "country": "Canada",
    "zip": "K2P 1L4"
  };
  order.shipping_address = {
    "first_name": "Jane",
    "last_name": "Smith",
    "address1": "123 Fake Street",
    "phone": "777-777-7777",
    "city": "Fakecity",
    "province": "Ontario",
    "country": "Canada",
    "zip": "K2P 1L4"
  };
  order.transactions = [
    {
      "kind": "sale",
      "status": "success",
      "amount": 50.0
    }
  ];
  order.financial_status = "paid";
  order.discount_codes = [
    {
      "code": "FAKE30",
      "amount": "9.00",
      "type": "percentage"
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 201 Created{"order":{"id":1073459981,"admin_graphql_api_id":"gid://shopify/Order/1073459981","app_id":755357713,"browser_ip":null,"buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":null,"checkout_id":null,"checkout_token":null,"client_details":null,"closed_at":null,"confirmation_number":"TMLD2C6UZ","confirmed":true,"contact_email":"jane@example.com","created_at":"2025-10-01T14:58:52-04:00","currency":"USD","current_subtotal_price":"181.09","current_subtotal_price_set":{"shop_money":{"amount":"181.09","currency_code":"USD"},"presentment_money":{"amount":"181.09","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"17.91","current_total_discounts_set":{"shop_money":{"amount":"17.91","currency_code":"USD"},"presentment_money":{"amount":"17.91","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"181.09","current_total_price_set":{"shop_money":{"amount":"181.09","currency_code":"USD"},"presentment_money":{"amount":"181.09","currency_code":"USD"}},"current_total_tax":"0.00","current_total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"FAKE30","amount":"17.91","type":"percentage"}],"duties_included":false,"email":"jane@example.com","estimated_taxes":false,"financial_status":"paid","fulfillment_status":null,"landing_site":null,"landing_site_ref":null,"location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1002","note":null,"note_attributes":[],"number":2,"order_number":1002,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/5b83735ed0c9740df0439fa86ba10d25/authenticate?key=e7a45f649881e5a9fd68bbc5ee425a71","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":[""],"phone":"+18885551234","po_number":null,"presentment_currency":"USD","processed_at":"2025-10-01T14:58:52-04:00","reference":null,"referring_site":null,"source_identifier":null,"source_name":"755357713","source_url":null,"subtotal_price":"181.09","subtotal_price_set":{"shop_money":{"amount":"181.09","currency_code":"USD"},"presentment_money":{"amount":"181.09","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[],"taxes_included":false,"test":false,"token":"5b83735ed0c9740df0439fa86ba10d25","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"17.91","total_discounts_set":{"shop_money":{"amount":"17.91","currency_code":"USD"},"presentment_money":{"amount":"17.91","currency_code":"USD"}},"total_line_items_price":"199.00","total_line_items_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_outstanding":"131.09","total_price":"181.09","total_price_set":{"shop_money":{"amount":"181.09","currency_code":"USD"},"presentment_money":{"amount":"181.09","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"0.00","total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:52-04:00","user_id":null,"billing_address":{"first_name":"John","address1":"123 Fake Street","phone":"555-555-5555","city":"Fakecity","zip":"K2P 1L4","province":"Ontario","country":"Canada","last_name":"Smith","address2":null,"company":null,"latitude":null,"longitude":null,"name":"John Smith","country_code":"CA","province_code":"ON"},"customer":{"id":1073339466,"created_at":"2025-10-01T14:58:52-04:00","updated_at":"2025-10-01T14:58:52-04:00","first_name":"John","last_name":"Smith","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":null},"sms_marketing_consent":null,"tags":"","email":"jane@example.com","phone":null,"currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/1073339466","default_address":{"id":1053317298,"customer_id":1073339466,"first_name":"Jane","last_name":"Smith","company":null,"address1":"123 Fake Street","address2":null,"city":"Fakecity","province":"Ontario","country":"Canada","zip":"K2P 1L4","phone":"777-777-7777","name":"Jane Smith","province_code":"ON","country_code":"CA","country_name":"Canada","default":true}},"discount_applications":[{"target_type":"line_item","type":"manual","value":"9.0","value_type":"percentage","allocation_method":"across","target_selection":"all","title":"FAKE30","description":"FAKE30"}],"fulfillments":[],"line_items":[{"id":1071823198,"admin_graphql_api_id":"gid://shopify/LineItem/1071823198","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":567,"name":"IPod Touch 8GB - Black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":921728736,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2009BLACK","taxable":true,"title":"IPod Touch 8GB","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":447654529,"variant_inventory_management":"shopify","variant_title":"Black","vendor":"Apple","tax_lines":[],"duties":[],"discount_allocations":[{"amount":"17.91","amount_set":{"shop_money":{"amount":"17.91","currency_code":"USD"},"presentment_money":{"amount":"17.91","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[],"shipping_address":{"first_name":"Jane","address1":"123 Fake Street","phone":"777-777-7777","city":"Fakecity","zip":"K2P 1L4","province":"Ontario","country":"Canada","last_name":"Smith","address2":null,"company":null,"latitude":null,"longitude":null,"name":"Jane Smith","country_code":"CA","province_code":"ON"},"shipping_lines":[]}}
  ```

* #### Create an order with tax lines split across taxable line items

  #####

  ```curl
  curl -d '{"order":{"line_items":[{"title":"Red Leather Coat","price":129.99,"grams":"1700","quantity":1},{"title":"Blue Suede Shoes","price":85.95,"grams":"750","quantity":1,"taxable":false},{"title":"Raspberry Beret","price":19.99,"grams":"320","quantity":2}],"tax_lines":[{"price":10.2,"rate":0.06,"title":"State tax"},{"price":4.25,"rate":0.025,"title":"County tax"}],"total_tax":14.45}}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.line_items = [
    {
      "title": "Red Leather Coat",
      "price": 129.99,
      "grams": "1700",
      "quantity": 1
    },
    {
      "title": "Blue Suede Shoes",
      "price": 85.95,
      "grams": "750",
      "quantity": 1,
      "taxable": false
    },
    {
      "title": "Raspberry Beret",
      "price": 19.99,
      "grams": "320",
      "quantity": 2
    }
  ];
  order.tax_lines = [
    {
      "price": 10.2,
      "rate": 0.06,
      "title": "State tax"
    },
    {
      "price": 4.25,
      "rate": 0.025,
      "title": "County tax"
    }
  ];
  order.total_tax = 14.45;
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.line_items = [
    {
      "title" => "Red Leather Coat",
      "price" => 129.99,
      "grams" => "1700",
      "quantity" => 1
    },
    {
      "title" => "Blue Suede Shoes",
      "price" => 85.95,
      "grams" => "750",
      "quantity" => 1,
      "taxable" => false
    },
    {
      "title" => "Raspberry Beret",
      "price" => 19.99,
      "grams" => "320",
      "quantity" => 2
    }
  ]
  order.tax_lines = [
    {
      "price" => 10.2,
      "rate" => 0.06,
      "title" => "State tax"
    },
    {
      "price" => 4.25,
      "rate" => 0.025,
      "title" => "County tax"
    }
  ]
  order.total_tax = 14.45
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.line_items = [
    {
      "title": "Red Leather Coat",
      "price": 129.99,
      "grams": "1700",
      "quantity": 1
    },
    {
      "title": "Blue Suede Shoes",
      "price": 85.95,
      "grams": "750",
      "quantity": 1,
      "taxable": false
    },
    {
      "title": "Raspberry Beret",
      "price": 19.99,
      "grams": "320",
      "quantity": 2
    }
  ];
  order.tax_lines = [
    {
      "price": 10.2,
      "rate": 0.06,
      "title": "State tax"
    },
    {
      "price": 4.25,
      "rate": 0.025,
      "title": "County tax"
    }
  ];
  order.total_tax = 14.45;
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 201 Created{"order":{"id":1073459980,"admin_graphql_api_id":"gid://shopify/Order/1073459980","app_id":755357713,"browser_ip":null,"buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":null,"checkout_id":null,"checkout_token":null,"client_details":null,"closed_at":null,"confirmation_number":"FU1N0DDX6","confirmed":true,"contact_email":null,"created_at":"2025-10-01T14:58:50-04:00","currency":"USD","current_subtotal_price":"255.92","current_subtotal_price_set":{"shop_money":{"amount":"255.92","currency_code":"USD"},"presentment_money":{"amount":"255.92","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"0.00","current_total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"270.37","current_total_price_set":{"shop_money":{"amount":"270.37","currency_code":"USD"},"presentment_money":{"amount":"270.37","currency_code":"USD"}},"current_total_tax":"14.45","current_total_tax_set":{"shop_money":{"amount":"14.45","currency_code":"USD"},"presentment_money":{"amount":"14.45","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[],"duties_included":false,"email":"","estimated_taxes":false,"financial_status":"paid","fulfillment_status":null,"landing_site":null,"landing_site_ref":null,"location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1002","note":null,"note_attributes":[],"number":2,"order_number":1002,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/96974b4e0340d74402dcad527a31672e/authenticate?key=c1fc05036b9732c2f54a9f5ac160a8fd","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":[],"phone":null,"po_number":null,"presentment_currency":"USD","processed_at":"2025-10-01T14:58:50-04:00","reference":null,"referring_site":null,"source_identifier":null,"source_name":"755357713","source_url":null,"subtotal_price":"255.92","subtotal_price_set":{"shop_money":{"amount":"255.92","currency_code":"USD"},"presentment_money":{"amount":"255.92","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"10.20","rate":0.06,"title":"State tax","price_set":{"shop_money":{"amount":"10.20","currency_code":"USD"},"presentment_money":{"amount":"10.20","currency_code":"USD"}},"channel_liable":false},{"price":"4.25","rate":0.025,"title":"County tax","price_set":{"shop_money":{"amount":"4.25","currency_code":"USD"},"presentment_money":{"amount":"4.25","currency_code":"USD"}},"channel_liable":false}],"taxes_included":false,"test":false,"token":"96974b4e0340d74402dcad527a31672e","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"0.00","total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_line_items_price":"255.92","total_line_items_price_set":{"shop_money":{"amount":"255.92","currency_code":"USD"},"presentment_money":{"amount":"255.92","currency_code":"USD"}},"total_outstanding":"270.37","total_price":"270.37","total_price_set":{"shop_money":{"amount":"270.37","currency_code":"USD"},"presentment_money":{"amount":"270.37","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"14.45","total_tax_set":{"shop_money":{"amount":"14.45","currency_code":"USD"},"presentment_money":{"amount":"14.45","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:50-04:00","user_id":null,"billing_address":null,"customer":null,"discount_applications":[],"fulfillments":[],"line_items":[{"id":1071823195,"admin_graphql_api_id":"gid://shopify/LineItem/1071823195","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":1700,"name":"Red Leather Coat","price":"129.99","price_set":{"shop_money":{"amount":"129.99","currency_code":"USD"},"presentment_money":{"amount":"129.99","currency_code":"USD"}},"product_exists":false,"product_id":null,"properties":[],"quantity":1,"requires_shipping":true,"sku":null,"taxable":true,"title":"Red Leather Coat","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":null,"variant_inventory_management":null,"variant_title":null,"vendor":null,"tax_lines":[{"channel_liable":false,"price":"7.81","price_set":{"shop_money":{"amount":"7.81","currency_code":"USD"},"presentment_money":{"amount":"7.81","currency_code":"USD"}},"rate":0.06,"title":"State tax"},{"channel_liable":false,"price":"3.26","price_set":{"shop_money":{"amount":"3.26","currency_code":"USD"},"presentment_money":{"amount":"3.26","currency_code":"USD"}},"rate":0.025,"title":"County tax"}],"duties":[],"discount_allocations":[]},{"id":1071823196,"admin_graphql_api_id":"gid://shopify/LineItem/1071823196","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":750,"name":"Blue Suede Shoes","price":"85.95","price_set":{"shop_money":{"amount":"85.95","currency_code":"USD"},"presentment_money":{"amount":"85.95","currency_code":"USD"}},"product_exists":false,"product_id":null,"properties":[],"quantity":1,"requires_shipping":true,"sku":null,"taxable":false,"title":"Blue Suede Shoes","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":null,"variant_inventory_management":null,"variant_title":null,"vendor":null,"tax_lines":[],"duties":[],"discount_allocations":[]},{"id":1071823197,"admin_graphql_api_id":"gid://shopify/LineItem/1071823197","attributed_staffs":[],"current_quantity":2,"fulfillable_quantity":2,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":320,"name":"Raspberry Beret","price":"19.99","price_set":{"shop_money":{"amount":"19.99","currency_code":"USD"},"presentment_money":{"amount":"19.99","currency_code":"USD"}},"product_exists":false,"product_id":null,"properties":[],"quantity":2,"requires_shipping":true,"sku":null,"taxable":true,"title":"Raspberry Beret","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":null,"variant_inventory_management":null,"variant_title":null,"vendor":null,"tax_lines":[{"channel_liable":false,"price":"2.39","price_set":{"shop_money":{"amount":"2.39","currency_code":"USD"},"presentment_money":{"amount":"2.39","currency_code":"USD"}},"rate":0.06,"title":"State tax"},{"channel_liable":false,"price":"0.99","price_set":{"shop_money":{"amount":"0.99","currency_code":"USD"},"presentment_money":{"amount":"0.99","currency_code":"USD"}},"rate":0.025,"title":"County tax"}],"duties":[],"discount_allocations":[]}],"payment_terms":null,"refunds":[],"shipping_address":null,"shipping_lines":[]}}
  ```

* #### Creating an order with tax lines both on line items and on the order fails and returns an error

  #####

  ```curl
  curl -d '{"order":{"line_items":[{"title":"Clicky Keyboard","price":99.99,"grams":"600","quantity":1,"tax_lines":[{"price":1.0,"rate":0.01,"title":"Keyboard tax"}]}],"tax_lines":[{"price":6.0,"rate":0.06,"title":"State tax"}]}}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.line_items = [
    {
      "title": "Clicky Keyboard",
      "price": 99.99,
      "grams": "600",
      "quantity": 1,
      "tax_lines": [
        {
          "price": 1.0,
          "rate": 0.01,
          "title": "Keyboard tax"
        }
      ]
    }
  ];
  order.tax_lines = [
    {
      "price": 6.0,
      "rate": 0.06,
      "title": "State tax"
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.line_items = [
    {
      "title" => "Clicky Keyboard",
      "price" => 99.99,
      "grams" => "600",
      "quantity" => 1,
      "tax_lines" => [
        {
          "price" => 1.0,
          "rate" => 0.01,
          "title" => "Keyboard tax"
        }
      ]
    }
  ]
  order.tax_lines = [
    {
      "price" => 6.0,
      "rate" => 0.06,
      "title" => "State tax"
    }
  ]
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.line_items = [
    {
      "title": "Clicky Keyboard",
      "price": 99.99,
      "grams": "600",
      "quantity": 1,
      "tax_lines": [
        {
          "price": 1.0,
          "rate": 0.01,
          "title": "Keyboard tax"
        }
      ]
    }
  ];
  order.tax_lines = [
    {
      "price": 6.0,
      "rate": 0.06,
      "title": "State tax"
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 422 Unprocessable Entity{"errors":{"order":["Tax lines must be associated with either order or line item but not both"]}}
  ```

***

## postCancel an order

[orderCancel](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderCancel?example=cancel-an-order)

Requires ANY of the following access scopes: `buyer_membership_orders`, `orders`, `marketplace_orders`.

Caution

For multi-currency orders, the `currency` property is required whenever the `amount` property is provided. For more information, refer to the [*Transaction resource*](https://shopify.dev/api/admin-rest/latest/resources/transaction).

Cancels an order. Orders that are paid and have fulfillments can't be canceled.

### Parameters

***

api\_version

string

required

***

order\_id

string

required

***

amount

string

The amount to refund. If set, Shopify attempts to refund the specified amount, depending on its status. Shopify refunds through a manual gateway in cases where the original transaction was not made in Shopify. Refunds through a manual gateway are recorded as a refund on Shopify, but the customer is not refunded.

***

currency

The currency of the refund that's issued when the order is canceled. Required for multi-currency orders whenever the `amount` property is provided.

***

email

[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

boolean

default false

Whether to send an email to the customer notifying them of the cancellation.

***

reason

string

default other

The reason for the order cancellation. Valid values: `customer`, `inventory`, `fraud`, `declined`, and `other`.)

***

refund

refund

The refund transactions to perform. Required for some more complex refund situations. For more information, see the [Refund API](https://shopify.dev/docs/admin-api/rest/reference/orders/refund#create-{{%20current_version%20}}).

***

restock

boolean

ISO 4217

deprecated

default false

Whether to restock refunded items back to your store's inventory.

***

### Examples

Cancel an order

Path parameters

order\_​id=​450789469

string

required

Cancel and refund an order using the `amount` property

Path parameters

order\_​id=​450789469

string

required

Request body

amount​

Amount resource

Show amount properties

amount:​"10.00"

string

The amount to refund. If set, Shopify attempts to refund the specified amount, depending on its status. Shopify refunds through a manual gateway in cases where the original transaction was not made in Shopify. Refunds through a manual gateway are recorded as a refund on Shopify, but the customer is not refunded.

currency:​"USD"

The currency of the refund that's issued when the order is canceled. Required for multi-currency orders whenever the `amount` property is provided.

Cancel and refund an order using the `refund` property

Path parameters

order\_​id=​450789469

string

required

Request body

refund​

Refund resource

Show refund properties

refund:​{"note":"Customer made a mistake",​"shipping":{"full\_refund":true},​"refund\_line\_items":\[{"line\_item\_id":466157049,​"quantity":1,​"restock\_type":"cancel",​"location\_id":24826418}],​"transactions":\[{"parent\_id":1068278478,​"amount":"10.00",​"kind":"refund",​"gateway":"bogus"},​{"parent\_id":1068278479,​"amount":"100.00",​"kind":"refund",​"gateway":"gift\_card"}]}

refund

The refund transactions to perform. Required for some more complex refund situations. For more information, see the [Refund API](https://shopify.dev/docs/admin-api/rest/reference/orders/refund#create-{{%20current_version%20}}).

Canceling an order that is paid and has fulfillments fails with an error

Path parameters

order\_​id=​450789469

string

required

When an order has multiple refundable transactions, refunding an amount less than its net payment without a `refund` property fails with an error

Path parameters

order\_​id=​450789469

string

required

Request body

amount​

Amount resource

Show amount properties

amount:​"109.00"

string

The amount to refund. If set, Shopify attempts to refund the specified amount, depending on its status. Shopify refunds through a manual gateway in cases where the original transaction was not made in Shopify. Refunds through a manual gateway are recorded as a refund on Shopify, but the customer is not refunded.

currency:​"USD"

The currency of the refund that's issued when the order is canceled. Required for multi-currency orders whenever the `amount` property is provided.

post

## /admin/api/2025-10/orders/450789469/cancel.​json

```bash
curl -d '{}' \
-X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469/cancel.json" \
-H "X-Shopify-Access-Token: {access_token}" \
-H "Content-Type: application/json"
```

{}

## Response

JSON

```json
HTTP/1.1 200 OK
{
  "order": {
    "id": 450789469,
    "admin_graphql_api_id": "gid://shopify/Order/450789469",
    "app_id": null,
    "browser_ip": "0.0.0.0",
    "buyer_accepts_marketing": false,
    "cancel_reason": "other",
    "cancelled_at": "2025-10-01T14:57:59-04:00",
    "cart_token": "68778783ad298f1c80c3bafcddeea02f",
    "checkout_id": 901414060,
    "checkout_token": "bd5a8aa1ecd019dd3520ff791ee3a24c",
    "client_details": {
      "accept_language": null,
      "browser_height": null,
      "browser_ip": "0.0.0.0",
      "browser_width": null,
      "session_hash": null,
      "user_agent": null
    },
    "closed_at": null,
    "confirmation_number": null,
    "confirmed": true,
    "contact_email": "bob.norman@mail.example.com",
    "created_at": "2008-01-10T11:00:00-05:00",
    "currency": "USD",
    "current_subtotal_price": "195.67",
    "current_subtotal_price_set": {
      "shop_money": {
        "amount": "195.67",
        "currency_code": "USD"
      },
      "presentment_money": {
        "amount": "195.67",
        "currency_code": "USD"
```

### examples

* #### Cancel an order

  #####

  ```curl
  curl -d '{}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469/cancel.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  await order.cancel({});
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.cancel(
    session: test_session,
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  await order.cancel({});
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":"other","cancelled_at":"2025-10-01T14:57:59-04:00","cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:57:59-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]},"notice":"Order has been canceled"}
  ```

* #### Cancel and refund an order using the \<code>amount\</code> property

  #####

  ```curl
  curl -d '{"amount":"10.00","currency":"USD"}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469/cancel.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  await order.cancel({
    body: {"amount": "10.00", "currency": "USD"},
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.cancel(
    session: test_session,
    body: {"amount" => "10.00", "currency" => "USD"},
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  await order.cancel({
    body: {"amount": "10.00", "currency": "USD"},
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":"other","cancelled_at":"2025-10-01T14:59:16-04:00","cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"587.00","current_subtotal_price_set":{"shop_money":{"amount":"587.00","currency_code":"USD"},"presentment_money":{"amount":"587.00","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"10.00","current_total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"598.94","current_total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"current_total_tax":"11.94","current_total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"598.94","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:59:16-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":929361467,"admin_graphql_api_id":"gid://shopify/Refund/929361467","created_at":"2025-10-01T14:59:15-04:00","note":"Order canceled","order_id":450789469,"processed_at":"2025-10-01T14:59:15-04:00","restock":false,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":null,"order_adjustments":[],"transactions":[{"id":1068278500,"admin_graphql_api_id":"gid://shopify/OrderTransaction/1068278500","amount":"10.00","authorization":null,"created_at":"2025-10-01T14:59:15-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":"Bogus Gateway: Forced success","order_id":450789469,"parent_id":1068278499,"payment_id":"c901414060.3","processed_at":"2025-10-01T14:59:15-04:00","receipt":{},"source_name":"755357713","status":"success","test":true,"user_id":null}],"refund_line_items":[{"id":1058498313,"line_item_id":466157049,"location_id":null,"quantity":1,"restock_type":"no_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}},{"id":1058498314,"line_item_id":518995019,"location_id":null,"quantity":1,"restock_type":"no_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":1058498315,"line_item_id":703073504,"location_id":null,"quantity":1,"restock_type":"no_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]},"notice":"Order has been canceled"}
  ```

* #### Cancel and refund an order using the \<code>refund\</code> property

  #####

  ```curl
  curl -d '{"refund":{"note":"Customer made a mistake","shipping":{"full_refund":true},"refund_line_items":[{"line_item_id":466157049,"quantity":1,"restock_type":"cancel","location_id":24826418}],"transactions":[{"parent_id":1068278478,"amount":"10.00","kind":"refund","gateway":"bogus"},{"parent_id":1068278479,"amount":"100.00","kind":"refund","gateway":"gift_card"}]}}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469/cancel.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  await order.cancel({
    body: {"refund": {"note": "Customer made a mistake", "shipping": {"full_refund": true}, "refund_line_items": [{"line_item_id": 466157049, "quantity": 1, "restock_type": "cancel", "location_id": 24826418}], "transactions": [{"parent_id": 1068278478, "amount": "10.00", "kind": "refund", "gateway": "bogus"}, {"parent_id": 1068278479, "amount": "100.00", "kind": "refund", "gateway": "gift_card"}]}},
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.cancel(
    session: test_session,
    body: {"refund" => {"note" => "Customer made a mistake", "shipping" => {"full_refund" => true}, "refund_line_items" => [{"line_item_id" => 466157049, "quantity" => 1, "restock_type" => "cancel", "location_id" => 24826418}], "transactions" => [{"parent_id" => 1068278478, "amount" => "10.00", "kind" => "refund", "gateway" => "bogus"}, {"parent_id" => 1068278479, "amount" => "100.00", "kind" => "refund", "gateway" => "gift_card"}]}},
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  await order.cancel({
    body: {"refund": {"note": "Customer made a mistake", "shipping": {"full_refund": true}, "refund_line_items": [{"line_item_id": 466157049, "quantity": 1, "restock_type": "cancel", "location_id": 24826418}], "transactions": [{"parent_id": 1068278478, "amount": "10.00", "kind": "refund", "gateway": "bogus"}, {"parent_id": 1068278479, "amount": "100.00", "kind": "refund", "gateway": "gift_card"}]}},
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":"other","cancelled_at":"2025-10-01T14:58:30-04:00","cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"587.00","current_subtotal_price_set":{"shop_money":{"amount":"587.00","currency_code":"USD"},"presentment_money":{"amount":"587.00","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"10.00","current_total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"598.94","current_total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"current_total_tax":"11.94","current_total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus","gift_card"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"598.94","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:30-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":929361465,"admin_graphql_api_id":"gid://shopify/Refund/929361465","created_at":"2025-10-01T14:58:29-04:00","note":"Order canceled","order_id":450789469,"processed_at":"2025-10-01T14:58:29-04:00","restock":false,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":null,"order_adjustments":[{"id":1030976843,"amount":"89.64","amount_set":{"shop_money":{"amount":"89.64","currency_code":"USD"},"presentment_money":{"amount":"89.64","currency_code":"USD"}},"kind":"refund_discrepancy","order_id":450789469,"reason":"Refund discrepancy","refund_id":929361465,"tax_amount":"0.00","tax_amount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}}}],"transactions":[{"id":1068278480,"admin_graphql_api_id":"gid://shopify/OrderTransaction/1068278480","amount":"10.00","authorization":null,"created_at":"2025-10-01T14:58:29-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":"Bogus Gateway: Forced success","order_id":450789469,"parent_id":1068278478,"payment_id":"c901414060.4","processed_at":"2025-10-01T14:58:29-04:00","receipt":{},"source_name":"755357713","status":"success","test":true,"user_id":null},{"id":1068278481,"admin_graphql_api_id":"gid://shopify/OrderTransaction/1068278481","amount":"100.00","authorization":null,"created_at":"2025-10-01T14:58:29-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"gift_card","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":1068278479,"payment_id":"c901414060.5","processed_at":"2025-10-01T14:58:29-04:00","receipt":{"gift_card_id":1035197676,"gift_card_last_characters":"0d0d"},"source_name":"755357713","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":1058498311,"line_item_id":466157049,"location_id":null,"quantity":1,"restock_type":"no_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]},"notice":"Order has been canceled"}
  ```

* #### Canceling an order that is paid and has fulfillments fails with an error

  #####

  ```curl
  curl -d '{}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469/cancel.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  await order.cancel({});
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.cancel(
    session: test_session,
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  await order.cancel({});
  ```

  #### response

  ```json
  HTTP/1.1 422 Unprocessable Entity{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:42-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"success","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:58:42-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]},"error":"Cannot cancel a paid and fulfilled order"}
  ```

* #### When an order has multiple refundable transactions, refunding an amount less than its net payment without a \<code>refund\</code> property fails with an error

  #####

  ```curl
  curl -d '{"amount":"109.00","currency":"USD"}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469/cancel.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  await order.cancel({
    body: {"amount": "109.00", "currency": "USD"},
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.cancel(
    session: test_session,
    body: {"amount" => "109.00", "currency" => "USD"},
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  await order.cancel({
    body: {"amount": "109.00", "currency": "USD"},
  });
  ```

  #### response

  ```json
  HTTP/1.1 422 Unprocessable Entity{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"587.00","current_subtotal_price_set":{"shop_money":{"amount":"587.00","currency_code":"USD"},"presentment_money":{"amount":"587.00","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"10.00","current_total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"598.94","current_total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"current_total_tax":"11.94","current_total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus","gift_card"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"488.94","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:56-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]},"error":"Refund parameter required to process refund"}
  ```

***

## postClose an order

[orderClose](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderClose?example=close-an-order)

Requires `orders` access scope.

Closes an order. A closed order is one that has no more work to be done. All items have been fulfilled or refunded.

### Parameters

***

api\_version

string

required

***

order\_id

string

required

***

### Examples

Close an order

Path parameters

order\_​id=​450789469

string

required

post

## /admin/api/2025-10/orders/450789469/close.​json

```bash
curl -d '{}' \
-X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469/close.json" \
-H "X-Shopify-Access-Token: {access_token}" \
-H "Content-Type: application/json"
```

{}

## Response

JSON

```json
HTTP/1.1 200 OK
{
  "order": {
    "id": 450789469,
    "admin_graphql_api_id": "gid://shopify/Order/450789469",
    "app_id": null,
    "browser_ip": "0.0.0.0",
    "buyer_accepts_marketing": false,
    "cancel_reason": null,
    "cancelled_at": null,
    "cart_token": "68778783ad298f1c80c3bafcddeea02f",
    "checkout_id": 901414060,
    "checkout_token": "bd5a8aa1ecd019dd3520ff791ee3a24c",
    "client_details": {
      "accept_language": null,
      "browser_height": null,
      "browser_ip": "0.0.0.0",
      "browser_width": null,
      "session_hash": null,
      "user_agent": null
    },
    "closed_at": "2025-10-01T14:58:25-04:00",
    "confirmation_number": null,
    "confirmed": true,
    "contact_email": "bob.norman@mail.example.com",
    "created_at": "2008-01-10T11:00:00-05:00",
    "currency": "USD",
    "current_subtotal_price": "195.67",
    "current_subtotal_price_set": {
      "shop_money": {
        "amount": "195.67",
        "currency_code": "USD"
      },
      "presentment_money": {
        "amount": "195.67",
        "currency_code": "USD"
```

### examples

* #### Close an order

  #####

  ```curl
  curl -d '{}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469/close.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  await order.close({});
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.close(
    session: test_session,
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  await order.close({});
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":"2025-10-01T14:58:25-04:00","confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:25-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

***

## postRe-open a closed order

[orderOpen](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderOpen?example=re-open-a-closed-order)

Requires `orders` access scope.

Re-opens a closed order

### Parameters

***

api\_version

string

required

***

order\_id

string

required

***

### Examples

Re-open a closed order

Path parameters

order\_​id=​450789469

string

required

post

## /admin/api/2025-10/orders/450789469/open.​json

```bash
curl -d '{}' \
-X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469/open.json" \
-H "X-Shopify-Access-Token: {access_token}" \
-H "Content-Type: application/json"
```

{}

## Response

JSON

```json
HTTP/1.1 200 OK
{
  "order": {
    "id": 450789469,
    "admin_graphql_api_id": "gid://shopify/Order/450789469",
    "app_id": null,
    "browser_ip": "0.0.0.0",
    "buyer_accepts_marketing": false,
    "cancel_reason": null,
    "cancelled_at": null,
    "cart_token": "68778783ad298f1c80c3bafcddeea02f",
    "checkout_id": 901414060,
    "checkout_token": "bd5a8aa1ecd019dd3520ff791ee3a24c",
    "client_details": {
      "accept_language": null,
      "browser_height": null,
      "browser_ip": "0.0.0.0",
      "browser_width": null,
      "session_hash": null,
      "user_agent": null
    },
    "closed_at": null,
    "confirmation_number": null,
    "confirmed": true,
    "contact_email": "bob.norman@mail.example.com",
    "created_at": "2008-01-10T11:00:00-05:00",
    "currency": "USD",
    "current_subtotal_price": "195.67",
    "current_subtotal_price_set": {
      "shop_money": {
        "amount": "195.67",
        "currency_code": "USD"
      },
      "presentment_money": {
        "amount": "195.67",
        "currency_code": "USD"
```

### examples

* #### Re-open a closed order

  #####

  ```curl
  curl -d '{}' \
  -X POST "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469/open.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  await order.open({});
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.open(
    session: test_session,
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  await order.open({});
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:18-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

***

## getRetrieve a list of orders

[orders](https://shopify.dev/docs/api/admin-graphql/latest/queries/orders?example=retrieve-a-list-of-orders)

Requires ANY of the following access scopes: `orders`, `marketplace_orders`.

Retrieves a list of orders that meet the specified criteria. **Note:** This endpoint implements pagination by using links that are provided in the response header. To learn more, refer to [Make paginated requests to the REST Admin API](https://shopify.dev/api/usage/pagination-rest).

### Parameters

***

api\_version

string

required

***

attribution\_app\_id

string

Show orders attributed to a certain app, specified by the app ID. Set as `current` to show orders for the app currently consuming the API.

***

created\_at\_max

date

ISO 8601

Show orders created at or before date.

***

created\_at\_min

date

ISO 8601

Show orders created at or after date.

***

fields

string

Retrieve only certain fields, specified by a comma-separated list of fields names.

***

financial\_status

string

default any

Filter orders by their financial status.

Show financial\_status properties

* **authorized**: Show only authorized orders

* **pending**: Show only pending orders

* **paid**: Show only paid orders

* **partially\_paid**: Show only partially paid orders

* **refunded**: Show only refunded orders

* **voided**: Show only voided orders

* **partially\_refunded**: Show only partially refunded orders

* **any**: Show orders of any financial status.

* **unpaid**: Show authorized and partially paid orders.

***

fulfillment\_status

string

default any

Filter orders by their fulfillment status.

Show fulfillment\_status properties

* **shipped**: Show orders that have been shipped. Returns orders with `fulfillment_status` of `fulfilled`.

* **partial**: Show partially shipped orders.

* **unshipped**: Show orders that have not yet been shipped. Returns orders with `fulfillment_status` of `null`.

* **any**: Show orders of any fulfillment status.

* **unfulfilled**: Returns orders with `fulfillment_status` of `null` or `partial`.

***

ids

string

Retrieve only orders specified by a comma-separated list of order IDs.

***

limit

integer

int32

≤ 250

default 50

The maximum number of results to show on a page.

***

name

string

Filter orders by `name`.

***

processed\_at\_max

date

ISO 8601

Show orders imported at or before date.

***

processed\_at\_min

date

ISO 8601

Show orders imported at or after date.

***

### Response

***

Returns an array of Order objects

***

### Examples

Retrieve all orders

Query parameters

status=​any

enum

default open

Filter orders by their status.

Show status properties

* **open**: Show only open orders.

* **closed**: Show only closed orders.

* **cancelled**: Show only canceled orders.

* **any**: Show orders of any status, including archived orders.

Retrieve all orders after the specified ID

Query parameters

since\_​id=​123

integer

ISO 8601

Show orders after the specified ID.

Retrieve all orders but show only certain properties

Query parameters

fields=​created\_at,​id,​name,​total-price

string

Retrieve only certain fields, specified by a comma-separated list of fields names.

Retrieve orders last updated after 2005-07-31 15:57:11 in the EDT timezone

Query parameters

updated\_​at\_​min=​2005-07-31T15:57:11-04:00

date

ISO 8601

Show orders last updated at or after date.

Retrieve orders that have authorized payments ready to be captured

Query parameters

financial\_​status=​authorized

string

default any

Filter orders by their financial status.

Show financial\_status properties

* **authorized**: Show only authorized orders

* **pending**: Show only pending orders

* **paid**: Show only paid orders

* **partially\_paid**: Show only partially paid orders

* **refunded**: Show only refunded orders

* **voided**: Show only voided orders

* **partially\_refunded**: Show only partially refunded orders

* **any**: Show orders of any financial status.

* **unpaid**: Show authorized and partially paid orders.

Retrieve specific orders

Query parameters

ids=​1073459970

string

Retrieve only orders specified by a comma-separated list of order IDs.

get

## /admin/api/2025-10/orders.​json?status=​any

```bash
curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json?status=any" \
-H "X-Shopify-Access-Token: {access_token}"
```

{}

## Response

JSON

```json
HTTP/1.1 200 OK
{
  "orders": [
    {
      "id": 450789469,
      "admin_graphql_api_id": "gid://shopify/Order/450789469",
      "app_id": null,
      "browser_ip": "0.0.0.0",
      "buyer_accepts_marketing": false,
      "cancel_reason": null,
      "cancelled_at": null,
      "cart_token": "68778783ad298f1c80c3bafcddeea02f",
      "checkout_id": 901414060,
      "checkout_token": "bd5a8aa1ecd019dd3520ff791ee3a24c",
      "client_details": {
        "accept_language": null,
        "browser_height": null,
        "browser_ip": "0.0.0.0",
        "browser_width": null,
        "session_hash": null,
        "user_agent": null
      },
      "closed_at": null,
      "confirmation_number": null,
      "confirmed": true,
      "contact_email": "bob.norman@mail.example.com",
      "created_at": "2008-01-10T11:00:00-05:00",
      "currency": "USD",
      "current_subtotal_price": "195.67",
      "current_subtotal_price_set": {
        "shop_money": {
          "amount": "195.67",
          "currency_code": "USD"
        },
        "presentment_money": {
          "amount": "195.67",
```

### examples

* #### Retrieve all orders

  #####

  ```curl
  curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json?status=any" \
  -H "X-Shopify-Access-Token: {access_token}"
  ```

  #####

  ```remix
  await admin.rest.resources.Order.all({
    session: session,
    status: "any",
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  ShopifyAPI::Order.all(
    session: test_session,
    status: "any",
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  await shopify.rest.Order.all({
    session: session,
    status: "any",
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"orders":[{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2008-01-10T11:00:00-05:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}]}
  ```

* #### Retrieve all orders after the specified ID

  #####

  ```curl
  curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json?since_id=123" \
  -H "X-Shopify-Access-Token: {access_token}"
  ```

  #####

  ```remix
  await admin.rest.resources.Order.all({
    session: session,
    since_id: "123",
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  ShopifyAPI::Order.all(
    session: test_session,
    since_id: "123",
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  await shopify.rest.Order.all({
    session: session,
    since_id: "123",
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"orders":[{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2008-01-10T11:00:00-05:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}]}
  ```

* #### Retrieve all orders but show only certain properties

  #####

  ```curl
  curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json?fields=created_at%2Cid%2Cname%2Ctotal-price" \
  -H "X-Shopify-Access-Token: {access_token}"
  ```

  #####

  ```remix
  await admin.rest.resources.Order.all({
    session: session,
    fields: "created_at,id,name,total-price",
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  ShopifyAPI::Order.all(
    session: test_session,
    fields: "created_at,id,name,total-price",
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  await shopify.rest.Order.all({
    session: session,
    fields: "created_at,id,name,total-price",
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"orders":[{"id":450789469,"created_at":"2008-01-10T11:00:00-05:00","name":"#1001","total_price":"598.94"}]}
  ```

* #### Retrieve orders last updated after 2005-07-31 15:57:11 in the EDT timezone

  #####

  ```curl
  curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json?updated_at_min=2005-07-31T15%3A57%3A11-04%3A00" \
  -H "X-Shopify-Access-Token: {access_token}"
  ```

  #####

  ```remix
  await admin.rest.resources.Order.all({
    session: session,
    updated_at_min: "2005-07-31T15:57:11-04:00",
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  ShopifyAPI::Order.all(
    session: test_session,
    updated_at_min: "2005-07-31T15:57:11-04:00",
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  await shopify.rest.Order.all({
    session: session,
    updated_at_min: "2005-07-31T15:57:11-04:00",
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"orders":[{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2008-01-10T11:00:00-05:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}]}
  ```

* #### Retrieve orders that have authorized payments ready to be captured

  #####

  ```curl
  curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json?financial_status=authorized" \
  -H "X-Shopify-Access-Token: {access_token}"
  ```

  #####

  ```remix
  await admin.rest.resources.Order.all({
    session: session,
    financial_status: "authorized",
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  ShopifyAPI::Order.all(
    session: test_session,
    financial_status: "authorized",
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  await shopify.rest.Order.all({
    session: session,
    financial_status: "authorized",
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"orders":[{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"authorized","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:59:13-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}]}
  ```

* #### Retrieve specific orders

  #####

  ```curl
  curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders.json?ids=1073459970" \
  -H "X-Shopify-Access-Token: {access_token}"
  ```

  #####

  ```remix
  await admin.rest.resources.Order.all({
    session: session,
    ids: "1073459970",
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  ShopifyAPI::Order.all(
    session: test_session,
    ids: "1073459970",
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  await shopify.rest.Order.all({
    session: session,
    ids: "1073459970",
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"orders":[{"id":1073459970,"admin_graphql_api_id":"gid://shopify/Order/1073459970","app_id":755357713,"browser_ip":null,"buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":null,"checkout_id":null,"checkout_token":null,"client_details":null,"closed_at":null,"confirmation_number":"KJX3HJX3Q","confirmed":true,"contact_email":null,"created_at":"2025-10-01T14:58:10-04:00","currency":"USD","current_subtotal_price":"199.00","current_subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"0.00","current_total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.00","current_total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"current_total_tax":"0.00","current_total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[],"duties_included":false,"email":"","estimated_taxes":false,"financial_status":"paid","fulfillment_status":null,"landing_site":null,"landing_site_ref":null,"location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1002","note":null,"note_attributes":[],"number":2,"order_number":1002,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/af02b26402426d461f71d79aaacee538/authenticate?key=c6ac44df719a1b5ca730612d48d07af6","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":[],"phone":null,"po_number":null,"presentment_currency":"USD","processed_at":"2025-10-01T14:58:10-04:00","reference":null,"referring_site":null,"source_identifier":null,"source_name":"755357713","source_url":null,"subtotal_price":"199.00","subtotal_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[],"taxes_included":false,"test":false,"token":"af02b26402426d461f71d79aaacee538","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"0.00","total_discounts_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_line_items_price":"199.00","total_line_items_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_outstanding":"199.00","total_price":"199.00","total_price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"0.00","total_tax_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:10-04:00","user_id":null,"billing_address":null,"customer":null,"discount_applications":[],"fulfillments":[],"line_items":[{"id":1071823183,"admin_graphql_api_id":"gid://shopify/LineItem/1071823183","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":567,"name":"IPod Touch 8GB - Black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":921728736,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2009BLACK","taxable":true,"title":"IPod Touch 8GB","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":447654529,"variant_inventory_management":"shopify","variant_title":"Black","vendor":"Apple","tax_lines":[],"duties":[],"discount_allocations":[]}],"payment_terms":null,"refunds":[],"shipping_address":null,"shipping_lines":[]}]}
  ```

***

## getRetrieve a specific order

[order](https://shopify.dev/docs/api/admin-graphql/latest/queries/order?example=retrieve-a-specific-order)

Requires ANY of the following access scopes: `orders`, `marketplace_orders`.

Retrieve an order by specifying the ID. All fields of an order are returned unless specific fields are named. The GET orders endpoint returns open orders by default.

### Parameters

***

api\_version

string

required

***

order\_id

string

required

***

fields

string

Retrieve only certain fields, specified by a comma-separated list of fields names.

***

### Examples

Get only particular fields

Query parameters

fields=​id,​line\_items,​name,​total\_price

string

Retrieve only certain fields, specified by a comma-separated list of fields names.

Retrieve a single order

get

## /admin/api/2025-10/orders/450789469.​json?fields=​id,​line\_items,​name,​total\_price

```bash
curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json?fields=id%2Cline_items%2Cname%2Ctotal_price" \
-H "X-Shopify-Access-Token: {access_token}"
```

{}

## Response

JSON

```json
HTTP/1.1 200 OK
{
  "order": {
    "id": 450789469,
    "name": "#1001",
    "total_price": "598.94",
    "line_items": [
      {
        "id": 466157049,
        "admin_graphql_api_id": "gid://shopify/LineItem/466157049",
        "current_quantity": 0,
        "fulfillable_quantity": 0,
        "fulfillment_service": "manual",
        "fulfillment_status": null,
        "gift_card": false,
        "grams": 200,
        "name": "IPod Nano - 8gb - green",
        "price": "199.00",
        "price_set": {
          "shop_money": {
            "amount": "199.00",
            "currency_code": "USD"
          },
          "presentment_money": {
            "amount": "199.00",
            "currency_code": "USD"
          }
        },
        "product_exists": true,
        "product_id": 632910392,
        "properties": [
          {
            "name": "Custom Engraving Front",
            "value": "Happy Birthday"
          },
          {
```

### examples

* #### Get only particular fields

  #####

  ```curl
  curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json?fields=id%2Cline_items%2Cname%2Ctotal_price" \
  -H "X-Shopify-Access-Token: {access_token}"
  ```

  #####

  ```remix
  await admin.rest.resources.Order.find({
    session: session,
    id: 450789469,
    fields: "id,line_items,name,total_price",
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  ShopifyAPI::Order.find(
    session: test_session,
    id: 450789469,
    fields: "id,line_items,name,total_price",
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  await shopify.rest.Order.find({
    session: session,
    id: 450789469,
    fields: "id,line_items,name,total_price",
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"name":"#1001","total_price":"598.94","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}]}}
  ```

* #### Retrieve a single order

  #####

  ```curl
  curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
  -H "X-Shopify-Access-Token: {access_token}"
  ```

  #####

  ```remix
  await admin.rest.resources.Order.find({
    session: session,
    id: 450789469,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  ShopifyAPI::Order.find(
    session: test_session,
    id: 450789469,
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  await shopify.rest.Order.find({
    session: session,
    id: 450789469,
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2008-01-10T11:00:00-05:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

***

## getRetrieve an order count

[ordersCount](https://shopify.dev/docs/api/admin-graphql/latest/queries/ordersCount?example=retrieve-an-order-count)

Requires `orders` access scope.

Retrieve the total number of orders that meet the specified criteria.

### Parameters

***

api\_version

string

required

***

created\_at\_max

date

ISO 8601

Orders created before date specified.

***

created\_at\_min

date

ISO 8601

Orders created after date specified.

***

financial\_status

string

default any

Orders of a given financial status.

Show financial\_status properties

* **authorized**: Authorized orders.

* **pending**: Pending orders.

* **paid**: Paid orders.

* **partially\_paid**: Partially paid orders.

* **refunded**: Refunded orders.

* **voided**: Voided orders.

* **partially\_refunded**: Partially refunded orders.

* **any**: Orders of any financial status.

* **unpaid**: Authorized and partially paid orders.

***

fulfillment\_status

string

default any

Orders of a given fulfillment status.

Show fulfillment\_status properties

* **shipped**: Orders that have been shipped. Returns orders with `fulfillment_status` of `fulfilled`.

* **partial**: Partially shipped orders.

* **unshipped**: Orders that have not yet been shipped. Returns orders with `fulfillment_status` of `null`.

* **any**: Orders of any fulfillment status.

* **unfulfilled**: Orders with `fulfillment_status` of `null` or `partial`.

***

status

string

default open

Orders of a given status.

Show status properties

* **open**: Open orders.

* **closed**: Closed orders.

* **any**: Orders of any status.

***

updated\_at\_max

date

ISO 8601

Orders last updated before date specified.

***

updated\_at\_min

date

ISO 8601

Orders last updated after date specified.

***

### Examples

Count all orders

Query parameters

status=​any

string

default open

Orders of a given status.

Show status properties

* **open**: Open orders.

* **closed**: Closed orders.

* **any**: Orders of any status.

Count orders that have authorized payments ready to be captured

Query parameters

financial\_​status=​authorized

string

default any

Orders of a given financial status.

Show financial\_status properties

* **authorized**: Authorized orders.

* **pending**: Pending orders.

* **paid**: Paid orders.

* **partially\_paid**: Partially paid orders.

* **refunded**: Refunded orders.

* **voided**: Voided orders.

* **partially\_refunded**: Partially refunded orders.

* **any**: Orders of any financial status.

* **unpaid**: Authorized and partially paid orders.

get

## /admin/api/2025-10/orders/count.​json?status=​any

```bash
curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders/count.json?status=any" \
-H "X-Shopify-Access-Token: {access_token}"
```

{}

## Response

JSON

```json
HTTP/1.1 200 OK
{
  "count": 1
}
```

### examples

* #### Count all orders

  #####

  ```curl
  curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders/count.json?status=any" \
  -H "X-Shopify-Access-Token: {access_token}"
  ```

  #####

  ```remix
  await admin.rest.resources.Order.count({
    session: session,
    status: "any",
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  ShopifyAPI::Order.count(
    session: test_session,
    status: "any",
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  await shopify.rest.Order.count({
    session: session,
    status: "any",
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"count":1}
  ```

* #### Count orders that have authorized payments ready to be captured

  #####

  ```curl
  curl -X GET "https://your-development-store.myshopify.com/admin/api/2025-10/orders/count.json?financial_status=authorized" \
  -H "X-Shopify-Access-Token: {access_token}"
  ```

  #####

  ```remix
  await admin.rest.resources.Order.count({
    session: session,
    financial_status: "authorized",
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  ShopifyAPI::Order.count(
    session: test_session,
    financial_status: "authorized",
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  await shopify.rest.Order.count({
    session: session,
    financial_status: "authorized",
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"count":1}
  ```

***

## putUpdate an order

[orderUpdate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderUpdate)

Requires ANY of the following access scopes: `orders`, `marketplace_orders`.

This operation allows for updating properties of an order including `buyer_accepts_marketing`, `email`, `phone`, `note`, `tags`, `metafields` and `shipping_address_attributes`.

It is not for editing the items of an order.

Note

After an order is created, you can change only a few of its attributes using the API. You can't change the items or the quantities in an order using the REST API, but you can change them using the [GraphQL Admin API](https://shopify.dev/apps/fulfillment/order-management-apps/order-editing).

### Parameters

***

api\_version

string

required

***

order\_id

string

required

***

### Examples

Add a metafield to an order

Path parameters

order\_​id=​450789469

string

required

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.id:​450789469

integer

read-only

The ID of the order, used for API purposes. This is different from the `order_number` property, which is the ID used by the shop owner and customer.'

Add a note to order

Path parameters

order\_​id=​450789469

string

required

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.id:​450789469

integer

read-only

The ID of the order, used for API purposes. This is different from the `order_number` property, which is the ID used by the shop owner and customer.'

order.note:​"Customer contacted us about a custom engraving on this iPod"

string

->[note](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderInput#fields-note)

An optional note that a shop owner can attach to the order.

Add note attributes to an order

Path parameters

order\_​id=​450789469

string

required

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.id:​450789469

integer

read-only

The ID of the order, used for API purposes. This is different from the `order_number` property, which is the ID used by the shop owner and customer.'

order.note\_​attributes:​\[{"name":"colour",​"value":"red"}]

array

->[customAttributes](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderInput#fields-customAttributes)

Extra information that is added to the order. Appears in the **Additional details** section of an order details page. Each array entry must contain a hash with `name` and `value` keys.

Change an order's email address

Path parameters

order\_​id=​450789469

string

required

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.id:​450789469

integer

read-only

The ID of the order, used for API purposes. This is different from the `order_number` property, which is the ID used by the shop owner and customer.'

order.email:​"a-different\@email.com"[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

string

email

->[email](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderInput#fields-email)

The customer's email address.

Change an order's phone number

Path parameters

order\_​id=​450789469

string

required

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.id:​450789469

integer

read-only

The ID of the order, used for API purposes. This is different from the `order_number` property, which is the ID used by the shop owner and customer.'

order.phone:​"+15145556677"[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

string

The customer's phone number for receiving SMS notifications.

Change whether the customer accepts marketing

Path parameters

order\_​id=​450789469

string

required

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.id:​450789469

integer

read-only

The ID of the order, used for API purposes. This is different from the `order_number` property, which is the ID used by the shop owner and customer.'

order.buyer\_​accepts\_​marketing:​true

boolean

Whether the customer consented to receive email updates from the shop.

Remove the customer from an order

Path parameters

order\_​id=​450789469

string

required

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.id:​450789469

integer

read-only

The ID of the order, used for API purposes. This is different from the `order_number` property, which is the ID used by the shop owner and customer.'

order.customer:​null[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

object

Customer

Information about the customer. The order might not have a customer and apps should not depend on the existence of a `customer` object. This value might be `null` if the order was created through Shopify POS. For more information about the `customer` object, see the [Customer resource](https://shopify.dev/docs/admin-api/rest/reference/customers/customer).

Update an order's tags

Path parameters

order\_​id=​450789469

string

required

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.id:​450789469

integer

read-only

The ID of the order, used for API purposes. This is different from the `order_number` property, which is the ID used by the shop owner and customer.'

order.tags:​"External,​Inbound,​Outbound"

string

->[tags](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderInput#fields-tags)

Tags attached to the order, formatted as a string of comma-separated values. Tags are additional short descriptors, commonly used for filtering and searching. Each individual tag is limited to 40 characters in length.

Update the shipping address of an order

Path parameters

order\_​id=​450789469

string

required

Request body

order​[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

Order resource

Show order properties

order.id:​450789469

integer

read-only

The ID of the order, used for API purposes. This is different from the `order_number` property, which is the ID used by the shop owner and customer.'

order.shipping\_​address:​{"address1":"123 Ship Street",​"city":"Shipsville"}[](https://shopify.dev/apps/store/data-protection/protected-customer-data)

object

CustomerAddress

->[shippingAddress](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderInput#fields-shippingAddress)

The mailing address to where the order will be shipped. This address is optional and will not be available on orders that do not require shipping. It has the following properties:

Show shipping\_address properties

* **address1**: The street address of the shipping address.
* **address2**: An optional additional field for the street address of the shipping address.
* **city**: The city, town, or village of the shipping address.
* **company**: The company of the person associated with the shipping address.
* **country**: The name of the country of the shipping address.
* **country\_code**: The two-letter code ([ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format) for the country of the shipping address.
* **first\_name**: The first name of the person associated with the shipping address.
* **last\_name**: The last name of the person associated with the shipping address.
* **latitude**: The latitude of the shipping address.
* **longitude**: The longitude of the shipping address.
* **name**: The full name of the person associated with the payment method.
* **phone**: The phone number at the shipping address.
* **province**: The name of the region (for example, province, state, or prefecture) of the shipping address.
* **province\_code**: The alphanumeric abbreviation of the region of the shipping address.
* **zip**: The postal code (for example, zip, postcode, or Eircode) of the shipping address.

put

## /admin/api/2025-10/orders/450789469.​json

```bash
curl -d '{"order":{"id":450789469,"metafields":[{"key":"new","value":"newvalue","type":"single_line_text_field","namespace":"global"}]}}' \
-X PUT "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
-H "X-Shopify-Access-Token: {access_token}" \
-H "Content-Type: application/json"
```

{}

## Response

JSON

```json
HTTP/1.1 200 OK
{
  "order": {
    "id": 450789469,
    "admin_graphql_api_id": "gid://shopify/Order/450789469",
    "app_id": null,
    "browser_ip": "0.0.0.0",
    "buyer_accepts_marketing": false,
    "cancel_reason": null,
    "cancelled_at": null,
    "cart_token": "68778783ad298f1c80c3bafcddeea02f",
    "checkout_id": 901414060,
    "checkout_token": "bd5a8aa1ecd019dd3520ff791ee3a24c",
    "client_details": {
      "accept_language": null,
      "browser_height": null,
      "browser_ip": "0.0.0.0",
      "browser_width": null,
      "session_hash": null,
      "user_agent": null
    },
    "closed_at": null,
    "confirmation_number": null,
    "confirmed": true,
    "contact_email": "bob.norman@mail.example.com",
    "created_at": "2008-01-10T11:00:00-05:00",
    "currency": "USD",
    "current_subtotal_price": "195.67",
    "current_subtotal_price_set": {
      "shop_money": {
        "amount": "195.67",
        "currency_code": "USD"
      },
      "presentment_money": {
        "amount": "195.67",
        "currency_code": "USD"
```

### examples

* #### Add a metafield to an order

  #####

  ```curl
  curl -d '{"order":{"id":450789469,"metafields":[{"key":"new","value":"newvalue","type":"single_line_text_field","namespace":"global"}]}}' \
  -X PUT "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  order.metafields = [
    {
      "key": "new",
      "value": "newvalue",
      "type": "single_line_text_field",
      "namespace": "global"
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.metafields = [
    {
      "key" => "new",
      "value" => "newvalue",
      "type" => "single_line_text_field",
      "namespace" => "global"
    }
  ]
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  order.metafields = [
    {
      "key": "new",
      "value": "newvalue",
      "type": "single_line_text_field",
      "namespace": "global"
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:57:44-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

* #### Add a note to order

  #####

  ```curl
  curl -d '{"order":{"id":450789469,"note":"Customer contacted us about a custom engraving on this iPod"}}' \
  -X PUT "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  order.note = "Customer contacted us about a custom engraving on this iPod";
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.note = "Customer contacted us about a custom engraving on this iPod"
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  order.note = "Customer contacted us about a custom engraving on this iPod";
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":"Customer contacted us about a custom engraving on this iPod","note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:51-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

* #### Add note attributes to an order

  #####

  ```curl
  curl -d '{"order":{"id":450789469,"note_attributes":[{"name":"colour","value":"red"}]}}' \
  -X PUT "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  order.note_attributes = [
    {
      "name": "colour",
      "value": "red"
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.note_attributes = [
    {
      "name" => "colour",
      "value" => "red"
    }
  ]
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  order.note_attributes = [
    {
      "name": "colour",
      "value": "red"
    }
  ];
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"colour","value":"red"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:57:48-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

* #### Change an order's email address

  #####

  ```curl
  curl -d '{"order":{"id":450789469,"email":"a-different@email.com"}}' \
  -X PUT "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  order.email = "a-different@email.com";
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.email = "a-different@email.com"
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  order.email = "a-different@email.com";
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"a-different@email.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"a-different@email.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:20-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

* #### Change an order's phone number

  #####

  ```curl
  curl -d '{"order":{"id":450789469,"phone":"+15145556677"}}' \
  -X PUT "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  order.phone = "+15145556677";
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.phone = "+15145556677"
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  order.phone = "+15145556677";
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+15145556677","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:58-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

* #### Change whether the customer accepts marketing

  #####

  ```curl
  curl -d '{"order":{"id":450789469,"buyer_accepts_marketing":true}}' \
  -X PUT "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  order.buyer_accepts_marketing = true;
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.buyer_accepts_marketing = true
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  order.buyer_accepts_marketing = true;
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":true,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:59:01-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

* #### Remove the customer from an order

  #####

  ```curl
  curl -d '{"order":{"id":450789469,"customer":null}}' \
  -X PUT "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  order.customer = null;
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.customer = nil
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  order.customer = null;
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:59:09-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":null,"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

* #### Update an order's tags

  #####

  ```curl
  curl -d '{"order":{"id":450789469,"tags":"External, Inbound, Outbound"}}' \
  -X PUT "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  order.tags = "External, Inbound, Outbound";
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.tags = "External, Inbound, Outbound"
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  order.tags = "External, Inbound, Outbound";
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"External, Inbound, Outbound","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:59:06-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

* #### Update the shipping address of an order

  #####

  ```curl
  curl -d '{"order":{"id":450789469,"shipping_address":{"address1":"123 Ship Street","city":"Shipsville"}}}' \
  -X PUT "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
  -H "X-Shopify-Access-Token: {access_token}" \
  -H "Content-Type: application/json"
  ```

  #####

  ```remix
  const { admin, session } = await authenticate.admin(request);

  const order = new admin.rest.resources.Order({session: session});

  order.id = 450789469;
  order.shipping_address = {
    "address1": "123 Ship Street",
    "city": "Shipsville"
  };
  await order.save({
    update: true,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  order = ShopifyAPI::Order.new(session: test_session)
  order.id = 450789469
  order.shipping_address = {
    "address1" => "123 Ship Street",
    "city" => "Shipsville"
  }
  order.save!
  ```

  #####

  ```node
  // Session is built by the OAuth process

  const order = new shopify.rest.Order({session: session});
  order.id = 450789469;
  order.shipping_address = {
    "address1": "123 Ship Street",
    "city": "Shipsville"
  };
  await order.save({
    update: true,
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{"order":{"id":450789469,"admin_graphql_api_id":"gid://shopify/Order/450789469","app_id":null,"browser_ip":"0.0.0.0","buyer_accepts_marketing":false,"cancel_reason":null,"cancelled_at":null,"cart_token":"68778783ad298f1c80c3bafcddeea02f","checkout_id":901414060,"checkout_token":"bd5a8aa1ecd019dd3520ff791ee3a24c","client_details":{"accept_language":null,"browser_height":null,"browser_ip":"0.0.0.0","browser_width":null,"session_hash":null,"user_agent":null},"closed_at":null,"confirmation_number":null,"confirmed":true,"contact_email":"bob.norman@mail.example.com","created_at":"2008-01-10T11:00:00-05:00","currency":"USD","current_subtotal_price":"195.67","current_subtotal_price_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"current_total_additional_fees_set":null,"current_total_discounts":"3.33","current_total_discounts_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"current_total_duties_set":null,"current_total_price":"199.65","current_total_price_set":{"shop_money":{"amount":"199.65","currency_code":"USD"},"presentment_money":{"amount":"199.65","currency_code":"USD"}},"current_total_tax":"3.98","current_total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"customer_locale":null,"device_id":null,"discount_codes":[{"code":"TENOFF","amount":"10.00","type":"fixed_amount"}],"duties_included":false,"email":"bob.norman@mail.example.com","estimated_taxes":false,"financial_status":"partially_refunded","fulfillment_status":null,"landing_site":"http://www.example.com?source=abc","landing_site_ref":"abc","location_id":null,"merchant_business_entity_id":"MTU0ODM4MDAwOQ","merchant_of_record_app_id":null,"name":"#1001","note":null,"note_attributes":[{"name":"custom engraving","value":"Happy Birthday"},{"name":"colour","value":"green"}],"number":1,"order_number":1001,"order_status_url":"https://jsmith.myshopify.com/548380009/orders/b1946ac92492d2347c6235b4d2611184/authenticate?key=imasecretipod","original_total_additional_fees_set":null,"original_total_duties_set":null,"payment_gateway_names":["bogus"],"phone":"+557734881234","po_number":"ABC123","presentment_currency":"USD","processed_at":"2008-01-10T11:00:00-05:00","reference":"fhwdgads","referring_site":"http://www.otherexample.com","source_identifier":"fhwdgads","source_name":"web","source_url":null,"subtotal_price":"597.00","subtotal_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"tags":"","tax_exempt":false,"tax_lines":[{"price":"11.94","rate":0.06,"title":"State Tax","price_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"channel_liable":null}],"taxes_included":false,"test":false,"token":"b1946ac92492d2347c6235b4d2611184","total_cash_rounding_payment_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_cash_rounding_refund_adjustment_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_discounts":"10.00","total_discounts_set":{"shop_money":{"amount":"10.00","currency_code":"USD"},"presentment_money":{"amount":"10.00","currency_code":"USD"}},"total_line_items_price":"597.00","total_line_items_price_set":{"shop_money":{"amount":"597.00","currency_code":"USD"},"presentment_money":{"amount":"597.00","currency_code":"USD"}},"total_outstanding":"0.00","total_price":"598.94","total_price_set":{"shop_money":{"amount":"598.94","currency_code":"USD"},"presentment_money":{"amount":"598.94","currency_code":"USD"}},"total_shipping_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_tax":"11.94","total_tax_set":{"shop_money":{"amount":"11.94","currency_code":"USD"},"presentment_money":{"amount":"11.94","currency_code":"USD"}},"total_tip_received":"0.00","total_weight":0,"updated_at":"2025-10-01T14:58:48-04:00","user_id":null,"billing_address":{"first_name":"Bob","address1":"Chestnut Street 92","phone":"+1(502)-459-2181","city":"Louisville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"customer":{"id":207119551,"created_at":"2025-10-01T14:30:56-04:00","updated_at":"2025-10-01T14:30:56-04:00","first_name":"Bob","last_name":"Norman","state":"disabled","note":null,"verified_email":true,"multipass_identifier":null,"tax_exempt":false,"email_marketing_consent":{"state":"not_subscribed","opt_in_level":null,"consent_updated_at":"2004-06-13T11:57:11-04:00"},"sms_marketing_consent":{"state":"not_subscribed","opt_in_level":"single_opt_in","consent_updated_at":"2024-01-01T07:00:00-05:00","consent_collected_from":"OTHER"},"tags":"Léon, Noël","email":"bob.norman@mail.example.com","phone":"+16136120707","currency":"USD","tax_exemptions":[],"admin_graphql_api_id":"gid://shopify/Customer/207119551","default_address":{"id":207119551,"customer_id":207119551,"first_name":null,"last_name":null,"company":null,"address1":"Chestnut Street 92","address2":"","city":"Louisville","province":"Kentucky","country":"United States","zip":"40202","phone":"555-625-1199","name":"","province_code":"KY","country_code":"US","country_name":"United States","default":true}},"discount_applications":[{"target_type":"line_item","type":"discount_code","value":"10.0","value_type":"fixed_amount","allocation_method":"across","target_selection":"all","code":"TENOFF"}],"fulfillments":[{"id":255858046,"admin_graphql_api_id":"gid://shopify/Fulfillment/255858046","created_at":"2025-10-01T14:30:56-04:00","location_id":655441491,"name":"#1001.0","order_id":450789469,"origin_address":{},"receipt":{"testcase":true,"authorization":"123456"},"service":"manual","shipment_status":null,"status":"failure","tracking_company":"USPS","tracking_number":"1Z1234512345123456","tracking_numbers":["1Z1234512345123456"],"tracking_url":"https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456","tracking_urls":["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z1234512345123456"],"updated_at":"2025-10-01T14:30:56-04:00","line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}]}],"line_items":[{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]},{"id":518995019,"admin_graphql_api_id":"gid://shopify/LineItem/518995019","attributed_staffs":[],"current_quantity":1,"fulfillable_quantity":1,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - red","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008RED","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":49148385,"variant_inventory_management":"shopify","variant_title":"red","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]},{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}],"payment_terms":null,"refunds":[{"id":509562969,"admin_graphql_api_id":"gid://shopify/Refund/509562969","created_at":"2025-10-01T14:30:56-04:00","note":"it broke during shipping","order_id":450789469,"processed_at":"2025-10-01T14:30:56-04:00","restock":true,"total_additional_fees_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"total_duties_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"user_id":548380009,"order_adjustments":[],"transactions":[{"id":179259969,"admin_graphql_api_id":"gid://shopify/OrderTransaction/179259969","amount":"209.00","authorization":"authorization-key","created_at":"2005-08-05T12:59:12-04:00","currency":"USD","device_id":null,"error_code":null,"gateway":"bogus","kind":"refund","location_id":null,"message":null,"order_id":450789469,"parent_id":801038806,"payment_id":"#1001.3","processed_at":"2005-08-05T12:59:12-04:00","receipt":{},"source_name":"web","status":"success","test":false,"user_id":null}],"refund_line_items":[{"id":104689539,"line_item_id":703073504,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.66,"subtotal_set":{"shop_money":{"amount":"195.66","currency_code":"USD"},"presentment_money":{"amount":"195.66","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":703073504,"admin_graphql_api_id":"gid://shopify/LineItem/703073504","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - black","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[],"quantity":1,"requires_shipping":true,"sku":"IPOD2008BLACK","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":457924702,"variant_inventory_management":"shopify","variant_title":"black","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.33","amount_set":{"shop_money":{"amount":"3.33","currency_code":"USD"},"presentment_money":{"amount":"3.33","currency_code":"USD"}},"discount_application_index":0}]}},{"id":709875399,"line_item_id":466157049,"location_id":487838322,"quantity":1,"restock_type":"legacy_restock","subtotal":195.67,"subtotal_set":{"shop_money":{"amount":"195.67","currency_code":"USD"},"presentment_money":{"amount":"195.67","currency_code":"USD"}},"total_tax":3.98,"total_tax_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"line_item":{"id":466157049,"admin_graphql_api_id":"gid://shopify/LineItem/466157049","attributed_staffs":[],"current_quantity":0,"fulfillable_quantity":0,"fulfillment_service":"manual","fulfillment_status":null,"gift_card":false,"grams":200,"name":"IPod Nano - 8gb - green","price":"199.00","price_set":{"shop_money":{"amount":"199.00","currency_code":"USD"},"presentment_money":{"amount":"199.00","currency_code":"USD"}},"product_exists":true,"product_id":632910392,"properties":[{"name":"Custom Engraving Front","value":"Happy Birthday"},{"name":"Custom Engraving Back","value":"Merry Christmas"}],"quantity":1,"requires_shipping":true,"sku":"IPOD2008GREEN","taxable":true,"title":"IPod Nano - 8gb","total_discount":"0.00","total_discount_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"variant_id":39072856,"variant_inventory_management":"shopify","variant_title":"green","vendor":null,"tax_lines":[{"channel_liable":null,"price":"3.98","price_set":{"shop_money":{"amount":"3.98","currency_code":"USD"},"presentment_money":{"amount":"3.98","currency_code":"USD"}},"rate":0.06,"title":"State Tax"}],"duties":[],"discount_allocations":[{"amount":"3.34","amount_set":{"shop_money":{"amount":"3.34","currency_code":"USD"},"presentment_money":{"amount":"3.34","currency_code":"USD"}},"discount_application_index":0}]}}],"duties":[],"additional_fees":[]}],"shipping_address":{"first_name":"Bob","address1":"123 Ship Street","phone":"+1(502)-459-2181","city":"Shipsville","zip":"40202","province":"Kentucky","country":"United States","last_name":"Norman","address2":"","company":null,"latitude":45.41634,"longitude":-75.6868,"name":"Bob Norman","country_code":"US","province_code":"KY"},"shipping_lines":[{"id":369256396,"carrier_identifier":null,"code":"Free Shipping","discounted_price":"0.00","discounted_price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"is_removed":false,"phone":null,"price":"0.00","price_set":{"shop_money":{"amount":"0.00","currency_code":"USD"},"presentment_money":{"amount":"0.00","currency_code":"USD"}},"requested_fulfillment_service_id":null,"source":"shopify","title":"Free Shipping","tax_lines":[],"discount_allocations":[]}]}}
  ```

***

## delDelete an order

[orderDelete](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderDelete?example=delete-an-order)

Requires `orders` access scope.

Deletes an order. Orders that interact with an online gateway can't be deleted.

### Parameters

***

api\_version

string

required

***

order\_id

string

required

***

### Examples

Delete an order

Path parameters

order\_​id=​450789469

string

required

del

## /admin/api/2025-10/orders/450789469.​json

```bash
curl -X DELETE "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
-H "X-Shopify-Access-Token: {access_token}"
```

{}

## Response

JSON

```json
HTTP/1.1 200 OK
{}
```

### examples

* #### Delete an order

  #####

  ```curl
  curl -X DELETE "https://your-development-store.myshopify.com/admin/api/2025-10/orders/450789469.json" \
  -H "X-Shopify-Access-Token: {access_token}"
  ```

  #####

  ```remix
  await admin.rest.resources.Order.delete({
    session: session,
    id: 450789469,
  });
  ```

  #####

  ```ruby
  # Session is activated via Authentication
  test_session = ShopifyAPI::Context.active_session

  ShopifyAPI::Order.delete(
    session: test_session,
    id: 450789469,
  )
  ```

  #####

  ```node
  // Session is built by the OAuth process

  await shopify.rest.Order.delete({
    session: session,
    id: 450789469,
  });
  ```

  #### response

  ```json
  HTTP/1.1 200 OK{}
  ```