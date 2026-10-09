# Openholidays TypeScript SDK Reference

Complete API reference for the Openholidays TypeScript SDK.


## OpenholidaysSDK

### Constructor

```ts
new OpenholidaysSDK(options?: object)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | SDK configuration options. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `object` | Custom headers for all requests. |
| `options.feature` | `object` | Feature configuration. |
| `options.system` | `object` | System overrides (e.g. custom fetch). |


### Static Methods

#### `OpenholidaysSDK.test(testopts?, sdkopts?)`

Create a test client with mock features active.

```ts
const client = OpenholidaysSDK.test()
```

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `testopts` | `object` | Test feature options. |
| `sdkopts` | `object` | Additional SDK options merged with test defaults. |

**Returns:** `OpenholidaysSDK` instance in test mode.


### Instance Methods

#### `Country(data?: object)`

Create a new `Country` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `CountryEntity` instance.

#### `Group(data?: object)`

Create a new `Group` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `GroupEntity` instance.

#### `Language(data?: object)`

Create a new `Language` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `LanguageEntity` instance.

#### `PublicHoliday(data?: object)`

Create a new `PublicHoliday` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `PublicHolidayEntity` instance.

#### `PublicHolidaysByDate(data?: object)`

Create a new `PublicHolidaysByDate` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `PublicHolidaysByDateEntity` instance.

#### `SchoolHoliday(data?: object)`

Create a new `SchoolHoliday` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `SchoolHolidayEntity` instance.

#### `SchoolHolidaysByDate(data?: object)`

Create a new `SchoolHolidaysByDate` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `SchoolHolidaysByDateEntity` instance.

#### `Statistic(data?: object)`

Create a new `Statistic` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `StatisticEntity` instance.

#### `Subdivision(data?: object)`

Create a new `Subdivision` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `SubdivisionEntity` instance.

#### `options()`

Return a deep copy of the current SDK options.

**Returns:** `object`

#### `utility()`

Return a copy of the SDK utility object.

**Returns:** `object`

#### `direct(fetchargs?: object)`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `GET`). |
| `fetchargs.params` | `object` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `object` | Query string parameters. |
| `fetchargs.headers` | `object` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (objects are JSON-serialized). |
| `fetchargs.ctrl` | `object` | Control options (e.g. `{ explain: true }`). |
| `fetchargs.ctrl.signal` | `AbortSignal` | Aborts the request in flight: `ok` is then `false` and `err.code` is `request_aborted`. |

**Returns:** `Promise<{ ok, status, headers, data }>`. On a failure
`ok` is `false` and `err` holds the error.

#### `prepare(fetchargs?: object)`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `Promise<{ url, method, headers, body } | Error>`

#### `tester(testopts?, sdkopts?)`

Alias for `OpenholidaysSDK.test()`.

**Returns:** `OpenholidaysSDK` instance in test mode.

#### Cancelling a call

Every entity operation takes an optional `ctrl` object after its match or
data, and an `AbortSignal` in `ctrl.signal` cancels the request in flight.
The operation then rejects with an error whose `code` is
`request_aborted` and whose `cause` is the signal's reason. A request
whose signal has already aborted is not sent. `stream()` takes the signal
as `callopts.signal`, and ends when it aborts.


---

## CountryEntity

```ts
const country = client.Country()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `isoCode` | `string` | Yes | ISO 3166-1 country code |
| `name` | `any[]` | Yes | Localized country names |
| `officialLanguages` | `any[]` | Yes | Official ISO-639-1 language codes |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Country().list()
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `CountryEntity` instance with the same client and
options.

#### `client()`

Return the parent `OpenholidaysSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## GroupEntity

```ts
const group = client.Group()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `category` | `any[]` | Yes | Localized categories of the group |
| `children` | `any[]` | No | Child groups |
| `code` | `string` | Yes | Group code |
| `comment` | `any[]` | No | Localized comments of the group |
| `name` | `any[]` | Yes | Localized names of the group |
| `shortName` | `string` | Yes | Short name for display |
| `subdivisions` | `any[]` | No | List of subdivision references |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Group().list({ country_iso_code: "example" })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `GroupEntity` instance with the same client and
options.

#### `client()`

Return the parent `OpenholidaysSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## LanguageEntity

```ts
const language = client.Language()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `isoCode` | `string` | Yes | ISO-639-1 language code |
| `name` | `any[]` | Yes | Localized language names |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Language().list()
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `LanguageEntity` instance with the same client and
options.

#### `client()`

Return the parent `OpenholidaysSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## PublicHolidayEntity

```ts
const public_holiday = client.PublicHoliday()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `comment` | `any[]` | No | Additional localized comments |
| `endDate` | `string` | Yes | End date of the holiday |
| `groups` | `any[]` | No | List of group references |
| `id` | `string` | Yes | Unique holiday id |
| `name` | `any[]` | Yes | Localized names of the holiday |
| `nationwide` | `boolean` | Yes | Is the holiday nationwide? |
| `regionalScope` | `string` | No | Regional scope of a holdiay |
| `startDate` | `string` | Yes | Start date of the holiday |
| `subdivisions` | `any[]` | No | List of subdivision references |
| `tags` | `any[]` | No | Additional holday tags |
| `temporalScope` | `string` | No | Temporal scope of a holdiay |
| `type` | `string` | Yes | Type of holiday |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.PublicHoliday().list({ country_iso_code: "example", valid_from: "example", valid_to: "example" })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `PublicHolidayEntity` instance with the same client and
options.

#### `client()`

Return the parent `OpenholidaysSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## PublicHolidaysByDateEntity

```ts
const public_holidays_by_date = client.PublicHolidaysByDate()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `comment` | `any[]` | No | Additional localized comments |
| `country` | `Record<string, any>` | Yes | Representation of a country reference |
| `groups` | `any[]` | No | List of group references |
| `id` | `string` | Yes | Unique holiday id |
| `name` | `any[]` | Yes | Localized names of the holiday |
| `nationwide` | `boolean` | Yes | Is the holiday nationwide? |
| `regionalScope` | `string` | No | Regional scope of a holdiay |
| `subdivisions` | `any[]` | No | List of subdivision references |
| `tags` | `any[]` | No | Additional holday tags |
| `temporalScope` | `string` | No | Temporal scope of a holdiay |
| `type` | `string` | Yes | Type of holiday |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.PublicHolidaysByDate().list({ date: "example" })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `PublicHolidaysByDateEntity` instance with the same client and
options.

#### `client()`

Return the parent `OpenholidaysSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## SchoolHolidayEntity

```ts
const school_holiday = client.SchoolHoliday()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `comment` | `any[]` | No | Additional localized comments |
| `endDate` | `string` | Yes | End date of the holiday |
| `groups` | `any[]` | No | List of group references |
| `id` | `string` | Yes | Unique holiday id |
| `name` | `any[]` | Yes | Localized names of the holiday |
| `nationwide` | `boolean` | Yes | Is the holiday nationwide? |
| `regionalScope` | `string` | No | Regional scope of a holdiay |
| `startDate` | `string` | Yes | Start date of the holiday |
| `subdivisions` | `any[]` | No | List of subdivision references |
| `tags` | `any[]` | No | Additional holday tags |
| `temporalScope` | `string` | No | Temporal scope of a holdiay |
| `type` | `string` | Yes | Type of holiday |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.SchoolHoliday().list({ country_iso_code: "example", valid_from: "example", valid_to: "example" })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `SchoolHolidayEntity` instance with the same client and
options.

#### `client()`

Return the parent `OpenholidaysSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## SchoolHolidaysByDateEntity

```ts
const school_holidays_by_date = client.SchoolHolidaysByDate()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `comment` | `any[]` | No | Additional localized comments |
| `country` | `Record<string, any>` | Yes | Representation of a country reference |
| `groups` | `any[]` | No | List of group references |
| `id` | `string` | Yes | Unique holiday id |
| `name` | `any[]` | Yes | Localized names of the holiday |
| `nationwide` | `boolean` | Yes | Is the holiday nationwide? |
| `regionalScope` | `string` | No | Regional scope of a holdiay |
| `subdivisions` | `any[]` | No | List of subdivision references |
| `tags` | `any[]` | No | Additional holday tags |
| `temporalScope` | `string` | No | Temporal scope of a holdiay |
| `type` | `string` | Yes | Type of holiday |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.SchoolHolidaysByDate().list({ date: "example" })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `SchoolHolidaysByDateEntity` instance with the same client and
options.

#### `client()`

Return the parent `OpenholidaysSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## StatisticEntity

```ts
const statistic = client.Statistic()
```

### Actions

This entity exposes custom API actions in addition to the standard
operations. Select one with `$action` in the call's argument; the
remaining keys are sent as that action's payload.

| Action | Route | Call |
| --- | --- | --- |
| `public_holiday` | `/Statistics/PublicHolidays` | `client.Statistic().list({ $action: 'public_holiday', ... })` |
| `school_holiday` | `/Statistics/SchoolHolidays` | `client.Statistic().list({ $action: 'school_holiday', ... })` |

An action returns that action's OWN response, which is not necessarily a
Statistic record — check the API definition for its shape.

```ts
const result = await client.Statistic().list({
  $action: 'public_holiday',
  /* ...the action's own arguments */
})
```

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `StatisticEntity` instance with the same client and
options.

#### `client()`

Return the parent `OpenholidaysSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## SubdivisionEntity

```ts
const subdivision = client.Subdivision()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `category` | `any[]` | Yes | Localized categories of the subdivision |
| `children` | `any[]` | No | Child subdivisions |
| `code` | `string` | Yes | Subdivision code |
| `comment` | `any[]` | No | Localized comments of the subdivision |
| `groups` | `any[]` | No | List of group references |
| `isoCode` | `string` | No | ISO 3166-2 subdivision code (if defined) |
| `name` | `any[]` | Yes | Localized names of the subdivision |
| `officialLanguages` | `any[]` | Yes | Official languages as ISO-639-1 codes |
| `shortName` | `string` | Yes | Short name for display |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Subdivision().list({ country_iso_code: "example" })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `SubdivisionEntity` instance with the same client and
options.

#### `client()`

Return the parent `OpenholidaysSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `test` | 0.0.1 | Test transport |


Features are activated via the `feature` option:

```ts
const client = new OpenholidaysSDK({
  feature: {
    test: { active: true },
  }
})
```


### Configuring features

Each feature is inactive until switched on, and an SDK with no feature
configured does no feature work at all. Every option below keeps its default
unless you name it.

The array form of \`feature\` is significant: several features wrap the
transport, and the order you list them in is the order they nest.

#### `test`

Test transport.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |

| Option | Type |
|---|---|
| `entity` | map |
| `net` | map |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.test.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Installs the BASE transport that the wrapping features wrap, so it must be
  activated before them.
- Inactive by default: leaving it out costs nothing at runtime.

