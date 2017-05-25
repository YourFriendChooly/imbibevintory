# imbibevintory
Imbibeventory provides easy to use API endpoints for parsing inventory data for products from Ontarios' LCBO and Beer Stores.

## Overview
This utility provides API endpoints that will scrape inventory counts using a product's ID and/or store ID from either the Beer Store or LCBO web sites.
Returned JSON objects can be configured by adding query parameters to your applications GET requests ( outlined below. )

## Usage
After installing the package dependancies, begin the express server with  **npm start**. !!!(Needs update)!!!
This will allow you to connect to two api endpoints,
localhost:3000/api_tbs_ and localhost:3000/api_lcbo_

### The Beer Store Inventory
Retrieve Beer Store inventory counts for a specific store and brand ID by sending a GET request to
yourserver:port_api_tbs**_STORE_****BRAND**/ (Where store is the location's store ID and brand is the brand ID of the product in question.)
This will return a JSON object of inventory data in one of several configurable formats (see Configurable Options.)

### LCBO Inventory
Retrieve LCBO Inventory for a product from all locations  by sending a GET request to yourserver:port_api_lcbo/brand. As this method will return all the LCBO locations and the current inventory count there are several configurable options to assist in delivering valuable and easy-to-parse information.


## Configurable options
There are several configurable options to change the way that data is returned from the API. These are primarily designed to allow for easier to consume JSON objects. Add these configurable options as query strings into your GET requests. All query strings are optional.

### /api/tbs/:store/:brand

Query Parameter | Value | Result
----------------|-------|-------
`returntype` | `sum` | Returns the total sum of the the available inventory variations for a given product and location.
| | `default` | Returns the full title and inventory quantity for each variations of a given product at a location. **Default behaviour.** |
| `ignorezero` | `true` | Will not return inventory variants with a zero count. |
| | `false` | Will return inventory variants with a zero count. **Default behaviour.**
| `prepend` | `null` | Will not prepend parsed product title information. |
| | `title` | Will prepend the returned JSON object with parsed brand information. |
| | `id` | Will prepend the JSON object with the GET request brand id.
| | `store` | Will prepend the JSON object with the GET request store id.
| | `full` | Will include {store: storeid, brand: brandid} in the returned JSON object.

### /api/lcbo/:brand
| Query Parameter | Value | Result |
| ---- | ---- | ---- |
| `returntype` | `addr` | Will return inventory information using the LCBO’s address as the key value when returning the inventory count. |
| | `tel` | Same as above, but will use the LCBO’s telephone number as the key value.
| | `default `| Organizes information for each LCBO into a structured object with categories for address, telephone, inventory, and region. **Default behaviour**
| `ignorezero` | true | Will not return listings for retail locations where the inventory count is zero.
| | `false` | Will return all listings, regardless of inventory count. **Default Behaviour**

## Thanks!
Thanks to the great people behind [Cheerio](https://cheerio.js.org/), [Express](https://expressjs.com/), [axios](https://github.com/mzabriskie/axios), and of course node and npm. Also big thanks to the organizers of [Hackernest Peterborough](http://hackernest.com/) for the inspiration to complete this project!
