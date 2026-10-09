# Openholidays TypeScript SDK



The TypeScript SDK for the Openholidays API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Country()` — each with a small set of operations (`list`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/openholidays-sdk/tags)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/voxgig-sdk/openholidays-sdk
npm install ./openholidays-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { OpenholidaysSDK } from '@voxgig-sdk/openholidays-sdk'

const client = new OpenholidaysSDK()
```

### 2. List country records

`list()` resolves to an array of Country ENTITIES — every operation
resolves to entities, not raw records. Iterate them directly, and call
`.data()` on one for the record it holds:

```ts
const countrys = await client.Country().list()

for (const country of countrys) {
  console.log(country.data())
}
```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const subdivisions = await client.Subdivision().list({ country_iso_code: "example" })
  console.log(subdivisions.map((item) => item.data()))
} catch (err) {
  console.error('list failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = OpenholidaysSDK.test()

const subdivisions = await client.Subdivision().list({ country_iso_code: 'example_country_iso_code' })
// subdivisions is an array of Subdivision entities, one per mock record
console.log(subdivisions.map((subdivision) => subdivision.data()))
```

You can also use the instance method:

```ts
const client = new OpenholidaysSDK()
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Subdivision()

// First call runs the operation and stores its result
await entity.list({ country_iso_code: 'example_country_iso_code' })

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new OpenholidaysSDK({
  extend: [logger],
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
OPENHOLIDAYS_TEST_LIVE=TRUE
```

Then run:

```bash
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### OpenholidaysSDK

#### Constructor

```ts
new OpenholidaysSDK(options?: {
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Country(data?)` | `CountryEntity` | Create a Country entity instance. |
| `Group(data?)` | `GroupEntity` | Create a Group entity instance. |
| `Language(data?)` | `LanguageEntity` | Create a Language entity instance. |
| `PublicHoliday(data?)` | `PublicHolidayEntity` | Create a PublicHoliday entity instance. |
| `PublicHolidaysByDate(data?)` | `PublicHolidaysByDateEntity` | Create a PublicHolidaysByDate entity instance. |
| `SchoolHoliday(data?)` | `SchoolHolidayEntity` | Create a SchoolHoliday entity instance. |
| `SchoolHolidaysByDate(data?)` | `SchoolHolidaysByDateEntity` | Create a SchoolHolidaysByDate entity instance. |
| `Statistic(data?)` | `StatisticEntity` | Create a Statistic entity instance. |
| `Subdivision(data?)` | `SubdivisionEntity` | Create a Subdivision entity instance. |
| `tester(testopts?, sdkopts?)` | `OpenholidaysSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `OpenholidaysSDK.test(testopts?, sdkopts?)` | `OpenholidaysSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria, one per record. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): OpenholidaysSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's `data()` reads its record:

- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### Country

| Field | Description |
| --- | --- |
| `isoCode` | ISO 3166-1 country code |
| `name` | Localized country names |
| `officialLanguages` | Official ISO-639-1 language codes |

Operations: list.

API path: `/Countries`

#### Group

| Field | Description |
| --- | --- |
| `category` | Localized categories of the group |
| `children` | Child groups |
| `code` | Group code |
| `comment` | Localized comments of the group |
| `name` | Localized names of the group |
| `shortName` | Short name for display |
| `subdivisions` | List of subdivision references |

Operations: list.

API path: `/Groups`

#### Language

| Field | Description |
| --- | --- |
| `isoCode` | ISO-639-1 language code |
| `name` | Localized language names |

Operations: list.

API path: `/Languages`

#### PublicHoliday

| Field | Description |
| --- | --- |
| `comment` | Additional localized comments |
| `endDate` | End date of the holiday |
| `groups` | List of group references |
| `id` | Unique holiday id |
| `name` | Localized names of the holiday |
| `nationwide` | Is the holiday nationwide? |
| `regionalScope` | Regional scope of a holdiay |
| `startDate` | Start date of the holiday |
| `subdivisions` | List of subdivision references |
| `tags` | Additional holday tags |
| `temporalScope` | Temporal scope of a holdiay |
| `type` | Type of holiday |

Operations: list.

API path: `/PublicHolidays`

#### PublicHolidaysByDate

| Field | Description |
| --- | --- |
| `comment` | Additional localized comments |
| `country` | Representation of a country reference |
| `groups` | List of group references |
| `id` | Unique holiday id |
| `name` | Localized names of the holiday |
| `nationwide` | Is the holiday nationwide? |
| `regionalScope` | Regional scope of a holdiay |
| `subdivisions` | List of subdivision references |
| `tags` | Additional holday tags |
| `temporalScope` | Temporal scope of a holdiay |
| `type` | Type of holiday |

Operations: list.

API path: `/PublicHolidaysByDate`

#### SchoolHoliday

| Field | Description |
| --- | --- |
| `comment` | Additional localized comments |
| `endDate` | End date of the holiday |
| `groups` | List of group references |
| `id` | Unique holiday id |
| `name` | Localized names of the holiday |
| `nationwide` | Is the holiday nationwide? |
| `regionalScope` | Regional scope of a holdiay |
| `startDate` | Start date of the holiday |
| `subdivisions` | List of subdivision references |
| `tags` | Additional holday tags |
| `temporalScope` | Temporal scope of a holdiay |
| `type` | Type of holiday |

Operations: list.

API path: `/SchoolHolidays`

#### SchoolHolidaysByDate

| Field | Description |
| --- | --- |
| `comment` | Additional localized comments |
| `country` | Representation of a country reference |
| `groups` | List of group references |
| `id` | Unique holiday id |
| `name` | Localized names of the holiday |
| `nationwide` | Is the holiday nationwide? |
| `regionalScope` | Regional scope of a holdiay |
| `subdivisions` | List of subdivision references |
| `tags` | Additional holday tags |
| `temporalScope` | Temporal scope of a holdiay |
| `type` | Type of holiday |

Operations: list.

API path: `/SchoolHolidaysByDate`

#### Statistic

| Field | Description |
| --- | --- |

Operations: list.

API path: `/Statistics/PublicHolidays`

#### Subdivision

| Field | Description |
| --- | --- |
| `category` | Localized categories of the subdivision |
| `children` | Child subdivisions |
| `code` | Subdivision code |
| `comment` | Localized comments of the subdivision |
| `groups` | List of group references |
| `isoCode` | ISO 3166-2 subdivision code (if defined) |
| `name` | Localized names of the subdivision |
| `officialLanguages` | Official languages as ISO-639-1 codes |
| `shortName` | Short name for display |

Operations: list.

API path: `/Subdivisions`



## Entities


### Country

Create an instance: `const country = client.Country()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `isoCode` | `string` | ISO 3166-1 country code |
| `name` | `any[]` | Localized country names |
| `officialLanguages` | `any[]` | Official ISO-639-1 language codes |

#### Example: List

```ts
const countrys = await client.Country().list()
```


### Group

Create an instance: `const group = client.Group()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `category` | `any[]` | Localized categories of the group |
| `children` | `any[]` | Child groups |
| `code` | `string` | Group code |
| `comment` | `any[]` | Localized comments of the group |
| `name` | `any[]` | Localized names of the group |
| `shortName` | `string` | Short name for display |
| `subdivisions` | `any[]` | List of subdivision references |

#### Example: List

```ts
const groups = await client.Group().list({ country_iso_code: "example" })
```


### Language

Create an instance: `const language = client.Language()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `isoCode` | `string` | ISO-639-1 language code |
| `name` | `any[]` | Localized language names |

#### Example: List

```ts
const languages = await client.Language().list()
```


### PublicHoliday

Create an instance: `const public_holiday = client.PublicHoliday()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `comment` | `any[]` | Additional localized comments |
| `endDate` | `string` | End date of the holiday |
| `groups` | `any[]` | List of group references |
| `id` | `string` | Unique holiday id |
| `name` | `any[]` | Localized names of the holiday |
| `nationwide` | `boolean` | Is the holiday nationwide? |
| `regionalScope` | `string` | Regional scope of a holdiay |
| `startDate` | `string` | Start date of the holiday |
| `subdivisions` | `any[]` | List of subdivision references |
| `tags` | `any[]` | Additional holday tags |
| `temporalScope` | `string` | Temporal scope of a holdiay |
| `type` | `string` | Type of holiday |

#### Example: List

```ts
const public_holidays = await client.PublicHoliday().list({ country_iso_code: "example", valid_from: "example", valid_to: "example" })
```


### PublicHolidaysByDate

Create an instance: `const public_holidays_by_date = client.PublicHolidaysByDate()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `comment` | `any[]` | Additional localized comments |
| `country` | `Record<string, any>` | Representation of a country reference |
| `groups` | `any[]` | List of group references |
| `id` | `string` | Unique holiday id |
| `name` | `any[]` | Localized names of the holiday |
| `nationwide` | `boolean` | Is the holiday nationwide? |
| `regionalScope` | `string` | Regional scope of a holdiay |
| `subdivisions` | `any[]` | List of subdivision references |
| `tags` | `any[]` | Additional holday tags |
| `temporalScope` | `string` | Temporal scope of a holdiay |
| `type` | `string` | Type of holiday |

#### Example: List

```ts
const public_holidays_by_dates = await client.PublicHolidaysByDate().list({ date: "example" })
```


### SchoolHoliday

Create an instance: `const school_holiday = client.SchoolHoliday()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `comment` | `any[]` | Additional localized comments |
| `endDate` | `string` | End date of the holiday |
| `groups` | `any[]` | List of group references |
| `id` | `string` | Unique holiday id |
| `name` | `any[]` | Localized names of the holiday |
| `nationwide` | `boolean` | Is the holiday nationwide? |
| `regionalScope` | `string` | Regional scope of a holdiay |
| `startDate` | `string` | Start date of the holiday |
| `subdivisions` | `any[]` | List of subdivision references |
| `tags` | `any[]` | Additional holday tags |
| `temporalScope` | `string` | Temporal scope of a holdiay |
| `type` | `string` | Type of holiday |

#### Example: List

```ts
const school_holidays = await client.SchoolHoliday().list({ country_iso_code: "example", valid_from: "example", valid_to: "example" })
```


### SchoolHolidaysByDate

Create an instance: `const school_holidays_by_date = client.SchoolHolidaysByDate()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `comment` | `any[]` | Additional localized comments |
| `country` | `Record<string, any>` | Representation of a country reference |
| `groups` | `any[]` | List of group references |
| `id` | `string` | Unique holiday id |
| `name` | `any[]` | Localized names of the holiday |
| `nationwide` | `boolean` | Is the holiday nationwide? |
| `regionalScope` | `string` | Regional scope of a holdiay |
| `subdivisions` | `any[]` | List of subdivision references |
| `tags` | `any[]` | Additional holday tags |
| `temporalScope` | `string` | Temporal scope of a holdiay |
| `type` | `string` | Type of holiday |

#### Example: List

```ts
const school_holidays_by_dates = await client.SchoolHolidaysByDate().list({ date: "example" })
```


### Statistic

Create an instance: `const statistic = client.Statistic()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |


### Subdivision

Create an instance: `const subdivision = client.Subdivision()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `category` | `any[]` | Localized categories of the subdivision |
| `children` | `any[]` | Child subdivisions |
| `code` | `string` | Subdivision code |
| `comment` | `any[]` | Localized comments of the subdivision |
| `groups` | `any[]` | List of group references |
| `isoCode` | `string` | ISO 3166-2 subdivision code (if defined) |
| `name` | `any[]` | Localized names of the subdivision |
| `officialLanguages` | `any[]` | Official languages as ISO-639-1 codes |
| `shortName` | `string` | Short name for display |

#### Example: List

```ts
const subdivisions = await client.Subdivision().list({ country_iso_code: "example" })
```

## Features

This SDK ships 1 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`test`](#test) | Test transport |

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **TestFeature**: Test transport

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
openholidays/
├── src/
│   ├── OpenholidaysSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { OpenholidaysSDK } from '@voxgig-sdk/openholidays-sdk'
```

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const subdivision = client.Subdivision()
await subdivision.list({ country_iso_code: "example" })

// subdivision.data() now returns the subdivision data from the last `list`
// subdivision.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
