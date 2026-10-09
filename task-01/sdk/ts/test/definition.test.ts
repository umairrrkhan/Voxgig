import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "country",
    "accessor": "Country",
    "op": "list",
    "method": "GET",
    "path": "/Countries",
    "args": [],
    "select": {
      "language_iso_code": "DE"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "text/json",
      "text/plain",
      "text/csv"
    ],
    "query": [
      "languageIsoCode"
    ],
    "queryArgs": [
      {
        "name": "language_iso_code",
        "wire": "languageIsoCode"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "isoCode": "DE",
        "name": [
          {
            "language": "EN",
            "text": "Germany"
          },
          {
            "language": "DE",
            "text": "Deutschland"
          }
        ],
        "officialLanguages": [
          "DE"
        ]
      }
    ],
    "idField": "id"
  },
  {
    "entity": "group",
    "accessor": "Group",
    "op": "list",
    "method": "GET",
    "path": "/Groups",
    "args": [],
    "select": {
      "country_iso_code": "v1",
      "language_iso_code": "de",
      "subdivision_code": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "text/json",
      "text/plain",
      "text/csv"
    ],
    "query": [
      "countryIsoCode",
      "languageIsoCode",
      "subdivisionCode"
    ],
    "queryArgs": [
      {
        "name": "country_iso_code",
        "wire": "countryIsoCode"
      },
      {
        "name": "language_iso_code",
        "wire": "languageIsoCode"
      },
      {
        "name": "subdivision_code",
        "wire": "subdivisionCode"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "category": [
          {
            "language": "fr",
            "text": "zone"
          },
          {
            "language": "de",
            "text": "Zone"
          }
        ],
        "children": [
          {}
        ],
        "code": "FR-ZA",
        "comment": [
          {
            "language": "x",
            "text": "x"
          }
        ],
        "name": [
          {
            "language": "fr",
            "text": "Zone A"
          },
          {
            "language": "de",
            "text": "Zone A"
          }
        ],
        "shortName": "ZA",
        "subdivisions": ">[\"FR-BF-TB\"]"
      }
    ],
    "idField": "id"
  },
  {
    "entity": "language",
    "accessor": "Language",
    "op": "list",
    "method": "GET",
    "path": "/Languages",
    "args": [],
    "select": {
      "language_iso_code": "DE"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "text/json",
      "text/plain",
      "text/csv"
    ],
    "query": [
      "languageIsoCode"
    ],
    "queryArgs": [
      {
        "name": "language_iso_code",
        "wire": "languageIsoCode"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "isoCode": "DE",
        "name": [
          {
            "language": "DE",
            "text": "Deutsch"
          },
          {
            "language": "EN",
            "text": "German"
          }
        ]
      }
    ],
    "idField": "id"
  },
  {
    "entity": "public_holiday",
    "accessor": "PublicHoliday",
    "op": "list",
    "method": "GET",
    "path": "/PublicHolidays",
    "args": [],
    "select": {
      "country_iso_code": "v1",
      "valid_from": "v1",
      "valid_to": "v1",
      "language_iso_code": "DE",
      "subdivision_code": "DE-BE"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "text/json",
      "text/plain",
      "text/calendar",
      "text/csv"
    ],
    "query": [
      "countryIsoCode",
      "validFrom",
      "validTo",
      "languageIsoCode",
      "subdivisionCode"
    ],
    "queryArgs": [
      {
        "name": "country_iso_code",
        "wire": "countryIsoCode"
      },
      {
        "name": "language_iso_code",
        "wire": "languageIsoCode"
      },
      {
        "name": "subdivision_code",
        "wire": "subdivisionCode"
      },
      {
        "name": "valid_from",
        "wire": "validFrom"
      },
      {
        "name": "valid_to",
        "wire": "validTo"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "comment": [
          {
            "language": "x",
            "text": "x"
          }
        ],
        "endDate": "2022-12-31",
        "id": "ff3b77a3-8c31-47af-b1c7-f26dd51f3c19",
        "name": [
          {
            "language": "x",
            "text": "x"
          }
        ],
        "nationwide": true,
        "regionalScope": "National",
        "startDate": "2022-01-01",
        "subdivisions": [
          {
            "code": "DE-BE",
            "shortName": "BE"
          }
        ],
        "groups": [
          {
            "code": "FR-ZA",
            "shortName": "ZA"
          }
        ],
        "tags": "Recommended",
        "temporalScope": "FullDay",
        "type": "Public"
      }
    ],
    "idField": "id"
  },
  {
    "entity": "public_holidays_by_date",
    "accessor": "PublicHolidaysByDate",
    "op": "list",
    "method": "GET",
    "path": "/PublicHolidaysByDate",
    "args": [],
    "select": {
      "date": "2023-12-25",
      "language_iso_code": "DE"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "text/json",
      "text/plain",
      "text/csv"
    ],
    "query": [
      "date",
      "languageIsoCode"
    ],
    "queryArgs": [
      {
        "name": "date",
        "wire": "date"
      },
      {
        "name": "language_iso_code",
        "wire": "languageIsoCode"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "comment": [
          {
            "language": "x",
            "text": "x"
          }
        ],
        "country": {
          "isoCode": "DE"
        },
        "groups": [
          {
            "code": "FR-ZA",
            "shortName": "ZA"
          }
        ],
        "id": "ff3b77a3-8c31-47af-b1c7-f26dd51f3c19",
        "name": [
          {
            "language": "x",
            "text": "x"
          }
        ],
        "nationwide": true,
        "regionalScope": "National",
        "subdivisions": [
          {
            "code": "DE-BE",
            "shortName": "BE"
          }
        ],
        "tags": "Recommended",
        "temporalScope": "FullDay",
        "type": "Public"
      }
    ],
    "idField": "id"
  },
  {
    "entity": "school_holiday",
    "accessor": "SchoolHoliday",
    "op": "list",
    "method": "GET",
    "path": "/SchoolHolidays",
    "args": [],
    "select": {
      "country_iso_code": "v1",
      "valid_from": "v1",
      "valid_to": "v1",
      "group_code": "v1",
      "language_iso_code": "DE",
      "subdivision_code": "DE-MV"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "text/json",
      "text/plain",
      "text/calendar",
      "text/csv"
    ],
    "query": [
      "countryIsoCode",
      "validFrom",
      "validTo",
      "languageIsoCode",
      "subdivisionCode",
      "groupCode"
    ],
    "queryArgs": [
      {
        "name": "country_iso_code",
        "wire": "countryIsoCode"
      },
      {
        "name": "group_code",
        "wire": "groupCode"
      },
      {
        "name": "language_iso_code",
        "wire": "languageIsoCode"
      },
      {
        "name": "subdivision_code",
        "wire": "subdivisionCode"
      },
      {
        "name": "valid_from",
        "wire": "validFrom"
      },
      {
        "name": "valid_to",
        "wire": "validTo"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "comment": [
          {
            "language": "x",
            "text": "x"
          }
        ],
        "endDate": "2022-12-31",
        "id": "ff3b77a3-8c31-47af-b1c7-f26dd51f3c19",
        "name": [
          {
            "language": "x",
            "text": "x"
          }
        ],
        "nationwide": true,
        "regionalScope": "National",
        "startDate": "2022-01-01",
        "subdivisions": [
          {
            "code": "DE-BE",
            "shortName": "BE"
          }
        ],
        "groups": [
          {
            "code": "FR-ZA",
            "shortName": "ZA"
          }
        ],
        "tags": "Recommended",
        "temporalScope": "FullDay",
        "type": "Public"
      }
    ],
    "idField": "id"
  },
  {
    "entity": "school_holidays_by_date",
    "accessor": "SchoolHolidaysByDate",
    "op": "list",
    "method": "GET",
    "path": "/SchoolHolidaysByDate",
    "args": [],
    "select": {
      "date": "2023-12-25",
      "language_iso_code": "DE"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "text/json",
      "text/plain",
      "text/csv"
    ],
    "query": [
      "date",
      "languageIsoCode"
    ],
    "queryArgs": [
      {
        "name": "date",
        "wire": "date"
      },
      {
        "name": "language_iso_code",
        "wire": "languageIsoCode"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "comment": [
          {
            "language": "x",
            "text": "x"
          }
        ],
        "country": {
          "isoCode": "DE"
        },
        "groups": [
          {
            "code": "FR-ZA",
            "shortName": "ZA"
          }
        ],
        "id": "ff3b77a3-8c31-47af-b1c7-f26dd51f3c19",
        "name": [
          {
            "language": "x",
            "text": "x"
          }
        ],
        "nationwide": true,
        "regionalScope": "National",
        "subdivisions": [
          {
            "code": "DE-BE",
            "shortName": "BE"
          }
        ],
        "tags": "Recommended",
        "temporalScope": "FullDay",
        "type": "Public"
      }
    ],
    "idField": "id"
  },
  {
    "entity": "statistic",
    "accessor": "Statistic",
    "op": "load",
    "method": "GET",
    "path": "/Statistics/PublicHolidays",
    "action": "public_holiday",
    "args": [],
    "select": {
      "country_iso_code": "v1",
      "subdivision_code": "DE-BE"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "text/json",
      "text/plain"
    ],
    "query": [
      "countryIsoCode",
      "subdivisionCode"
    ],
    "queryArgs": [
      {
        "name": "country_iso_code",
        "wire": "countryIsoCode"
      },
      {
        "name": "subdivision_code",
        "wire": "subdivisionCode"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": {
      "youngestStartDate": "2026-01-01",
      "oldestStartDate": "2026-01-01"
    },
    "idField": "id"
  },
  {
    "entity": "statistic",
    "accessor": "Statistic",
    "op": "load",
    "method": "GET",
    "path": "/Statistics/SchoolHolidays",
    "action": "school_holiday",
    "args": [],
    "select": {
      "country_iso_code": "v1",
      "group_code": "v1",
      "subdivision_code": "DE-BE"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "text/json",
      "text/plain"
    ],
    "query": [
      "countryIsoCode",
      "subdivisionCode",
      "groupCode"
    ],
    "queryArgs": [
      {
        "name": "country_iso_code",
        "wire": "countryIsoCode"
      },
      {
        "name": "group_code",
        "wire": "groupCode"
      },
      {
        "name": "subdivision_code",
        "wire": "subdivisionCode"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": {
      "youngestStartDate": "2026-01-01",
      "oldestStartDate": "2026-01-01"
    },
    "idField": "id"
  },
  {
    "entity": "subdivision",
    "accessor": "Subdivision",
    "op": "list",
    "method": "GET",
    "path": "/Subdivisions",
    "args": [],
    "select": {
      "country_iso_code": "v1",
      "language_iso_code": "DE"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json",
      "text/json",
      "text/plain",
      "text/csv"
    ],
    "query": [
      "countryIsoCode",
      "languageIsoCode"
    ],
    "queryArgs": [
      {
        "name": "country_iso_code",
        "wire": "countryIsoCode"
      },
      {
        "name": "language_iso_code",
        "wire": "languageIsoCode"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "category": [
          {
            "language": "fr",
            "text": "région"
          },
          {
            "language": "de",
            "text": "Region"
          }
        ],
        "children": [
          {}
        ],
        "code": "FR-BF",
        "comment": [
          {
            "language": "x",
            "text": "x"
          }
        ],
        "groups": ">[\"FR-ZA-BE,FR-ZA-DI\"]",
        "isoCode": "FR-BFC",
        "name": [
          {
            "language": "fr",
            "text": "Bourgogne-Franche-Comté"
          }
        ],
        "officialLanguages": ">[\"fr\"]",
        "shortName": "BF"
      }
    ],
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
