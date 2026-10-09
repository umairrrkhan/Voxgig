
import { BaseFeature } from './feature/base/BaseFeature'
import { TestFeature } from './feature/test/TestFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   test: TestFeature,

}


const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'Openholidays',
        slug: "openholidays",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     test:     {
      "options": {
        "active": false
      },
      "optspec": {
        "entity": "`$MAP`",
        "net": "`$MAP`"
      },
      "strict": false,
      "transport": "base"
    },

  }


  options = {
    base: "https://openholidaysapi.org",

    headers: {
      "content-type": "application/json"
    },

    entity: {
      
        country: {
        },
  
        group: {
        },
  
        language: {
        },
  
        public_holiday: {
        },
  
        public_holidays_by_date: {
        },
  
        school_holiday: {
        },
  
        school_holidays_by_date: {
        },
  
        statistic: {
        },
  
        subdivision: {
        },
  
    }
  }


  entity = {
    "country": {
      "fields": [
        {
          "name": "isoCode",
          "title": "Iso Code",
          "type": "`$STRING`",
          "req": true,
          "short": "ISO 3166-1 country code"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Localized country names"
        },
        {
          "name": "officialLanguages",
          "title": "Official Languages",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Official ISO-639-1 language codes"
        }
      ],
      "name": "country",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/Countries",
              "segments": [
                {
                  "lit": "Countries"
                }
              ],
              "parts": [
                "Countries"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "query": [
                  {
                    "name": "language_iso_code",
                    "orig": "languageIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "DE"
                  }
                ]
              },
              "select": {},
              "response": {
                "alternatives": [
                  {
                    "kind": "json",
                    "media": "text/json"
                  },
                  {
                    "kind": "raw",
                    "media": "text/csv"
                  },
                  {
                    "kind": "raw",
                    "media": "text/plain"
                  }
                ],
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "group": {
      "fields": [
        {
          "name": "category",
          "title": "Category",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Localized categories of the group"
        },
        {
          "name": "children",
          "title": "Children",
          "type": "`$ARRAY`",
          "short": "Child groups"
        },
        {
          "name": "code",
          "title": "Code",
          "type": "`$STRING`",
          "req": true,
          "short": "Group code"
        },
        {
          "name": "comment",
          "title": "Comment",
          "type": "`$ARRAY`",
          "short": "Localized comments of the group"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Localized names of the group"
        },
        {
          "name": "shortName",
          "title": "Short Name",
          "type": "`$STRING`",
          "req": true,
          "short": "Short name for display"
        },
        {
          "name": "subdivisions",
          "title": "Subdivisions",
          "type": "`$ARRAY`",
          "short": "List of subdivision references"
        }
      ],
      "name": "group",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/Groups",
              "segments": [
                {
                  "lit": "Groups"
                }
              ],
              "parts": [
                "Groups"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "query": [
                  {
                    "name": "country_iso_code",
                    "orig": "countryIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "DE"
                  },
                  {
                    "name": "language_iso_code",
                    "orig": "languageIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "de"
                  },
                  {
                    "name": "subdivision_code",
                    "orig": "subdivisionCode",
                    "type": "`$STRING`",
                    "kind": "query"
                  }
                ]
              },
              "select": {
                "exist": [
                  "country_iso_code"
                ]
              },
              "response": {
                "alternatives": [
                  {
                    "kind": "json",
                    "media": "text/json"
                  },
                  {
                    "kind": "raw",
                    "media": "text/csv"
                  },
                  {
                    "kind": "raw",
                    "media": "text/plain"
                  }
                ],
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "language": {
      "fields": [
        {
          "name": "isoCode",
          "title": "Iso Code",
          "type": "`$STRING`",
          "req": true,
          "short": "ISO-639-1 language code"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Localized language names"
        }
      ],
      "name": "language",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/Languages",
              "segments": [
                {
                  "lit": "Languages"
                }
              ],
              "parts": [
                "Languages"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "query": [
                  {
                    "name": "language_iso_code",
                    "orig": "languageIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "DE"
                  }
                ]
              },
              "select": {},
              "response": {
                "alternatives": [
                  {
                    "kind": "json",
                    "media": "text/json"
                  },
                  {
                    "kind": "raw",
                    "media": "text/csv"
                  },
                  {
                    "kind": "raw",
                    "media": "text/plain"
                  }
                ],
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "public_holiday": {
      "fields": [
        {
          "name": "comment",
          "title": "Comment",
          "type": "`$ARRAY`",
          "short": "Additional localized comments"
        },
        {
          "name": "endDate",
          "title": "End Date",
          "type": "`$STRING`",
          "req": true,
          "short": "End date of the holiday",
          "format": "date"
        },
        {
          "name": "groups",
          "title": "Groups",
          "type": "`$ARRAY`",
          "short": "List of group references"
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$STRING`",
          "req": true,
          "short": "Unique holiday id",
          "format": "uuid"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Localized names of the holiday"
        },
        {
          "name": "nationwide",
          "title": "Nationwide",
          "type": "`$BOOLEAN`",
          "req": true,
          "short": "Is the holiday nationwide?"
        },
        {
          "name": "regionalScope",
          "title": "Regional Scope",
          "type": "`$STRING`",
          "short": "Regional scope of a holdiay",
          "readOnly": true
        },
        {
          "name": "startDate",
          "title": "Start Date",
          "type": "`$STRING`",
          "req": true,
          "short": "Start date of the holiday",
          "format": "date"
        },
        {
          "name": "subdivisions",
          "title": "Subdivisions",
          "type": "`$ARRAY`",
          "short": "List of subdivision references"
        },
        {
          "name": "tags",
          "title": "Tags",
          "type": "`$ARRAY`",
          "short": "Additional holday tags"
        },
        {
          "name": "temporalScope",
          "title": "Temporal Scope",
          "type": "`$STRING`",
          "short": "Temporal scope of a holdiay",
          "readOnly": true
        },
        {
          "name": "type",
          "title": "Type",
          "type": "`$STRING`",
          "req": true,
          "short": "Type of holiday",
          "readOnly": true
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "public_holiday",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/PublicHolidays",
              "segments": [
                {
                  "lit": "PublicHolidays"
                }
              ],
              "parts": [
                "PublicHolidays"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "query": [
                  {
                    "name": "country_iso_code",
                    "orig": "countryIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "DE"
                  },
                  {
                    "name": "language_iso_code",
                    "orig": "languageIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "DE"
                  },
                  {
                    "name": "subdivision_code",
                    "orig": "subdivisionCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "DE-BE"
                  },
                  {
                    "name": "valid_from",
                    "orig": "validFrom",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "2023-01-01"
                  },
                  {
                    "name": "valid_to",
                    "orig": "validTo",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "2023-12-31"
                  }
                ]
              },
              "select": {
                "exist": [
                  "country_iso_code",
                  "valid_from",
                  "valid_to"
                ]
              },
              "response": {
                "alternatives": [
                  {
                    "kind": "json",
                    "media": "text/json"
                  },
                  {
                    "kind": "raw",
                    "media": "text/calendar"
                  },
                  {
                    "kind": "raw",
                    "media": "text/csv"
                  },
                  {
                    "kind": "raw",
                    "media": "text/plain"
                  }
                ],
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "public_holidays_by_date": {
      "fields": [
        {
          "name": "comment",
          "title": "Comment",
          "type": "`$ARRAY`",
          "short": "Additional localized comments"
        },
        {
          "name": "country",
          "title": "Country",
          "type": "`$OBJECT`",
          "req": true,
          "short": "Representation of a country reference",
          "readOnly": true
        },
        {
          "name": "groups",
          "title": "Groups",
          "type": "`$ARRAY`",
          "short": "List of group references"
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$STRING`",
          "req": true,
          "short": "Unique holiday id",
          "format": "uuid"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Localized names of the holiday"
        },
        {
          "name": "nationwide",
          "title": "Nationwide",
          "type": "`$BOOLEAN`",
          "req": true,
          "short": "Is the holiday nationwide?"
        },
        {
          "name": "regionalScope",
          "title": "Regional Scope",
          "type": "`$STRING`",
          "short": "Regional scope of a holdiay",
          "readOnly": true
        },
        {
          "name": "subdivisions",
          "title": "Subdivisions",
          "type": "`$ARRAY`",
          "short": "List of subdivision references"
        },
        {
          "name": "tags",
          "title": "Tags",
          "type": "`$ARRAY`",
          "short": "Additional holday tags"
        },
        {
          "name": "temporalScope",
          "title": "Temporal Scope",
          "type": "`$STRING`",
          "short": "Temporal scope of a holdiay",
          "readOnly": true
        },
        {
          "name": "type",
          "title": "Type",
          "type": "`$STRING`",
          "req": true,
          "short": "Type of holiday",
          "readOnly": true
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "public_holidays_by_date",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/PublicHolidaysByDate",
              "segments": [
                {
                  "lit": "PublicHolidaysByDate"
                }
              ],
              "parts": [
                "PublicHolidaysByDate"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "query": [
                  {
                    "name": "date",
                    "orig": "date",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "2023-12-25"
                  },
                  {
                    "name": "language_iso_code",
                    "orig": "languageIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "DE"
                  }
                ]
              },
              "select": {
                "exist": [
                  "date"
                ]
              },
              "response": {
                "alternatives": [
                  {
                    "kind": "json",
                    "media": "text/json"
                  },
                  {
                    "kind": "raw",
                    "media": "text/csv"
                  },
                  {
                    "kind": "raw",
                    "media": "text/plain"
                  }
                ],
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "school_holiday": {
      "fields": [
        {
          "name": "comment",
          "title": "Comment",
          "type": "`$ARRAY`",
          "short": "Additional localized comments"
        },
        {
          "name": "endDate",
          "title": "End Date",
          "type": "`$STRING`",
          "req": true,
          "short": "End date of the holiday",
          "format": "date"
        },
        {
          "name": "groups",
          "title": "Groups",
          "type": "`$ARRAY`",
          "short": "List of group references"
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$STRING`",
          "req": true,
          "short": "Unique holiday id",
          "format": "uuid"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Localized names of the holiday"
        },
        {
          "name": "nationwide",
          "title": "Nationwide",
          "type": "`$BOOLEAN`",
          "req": true,
          "short": "Is the holiday nationwide?"
        },
        {
          "name": "regionalScope",
          "title": "Regional Scope",
          "type": "`$STRING`",
          "short": "Regional scope of a holdiay",
          "readOnly": true
        },
        {
          "name": "startDate",
          "title": "Start Date",
          "type": "`$STRING`",
          "req": true,
          "short": "Start date of the holiday",
          "format": "date"
        },
        {
          "name": "subdivisions",
          "title": "Subdivisions",
          "type": "`$ARRAY`",
          "short": "List of subdivision references"
        },
        {
          "name": "tags",
          "title": "Tags",
          "type": "`$ARRAY`",
          "short": "Additional holday tags"
        },
        {
          "name": "temporalScope",
          "title": "Temporal Scope",
          "type": "`$STRING`",
          "short": "Temporal scope of a holdiay",
          "readOnly": true
        },
        {
          "name": "type",
          "title": "Type",
          "type": "`$STRING`",
          "req": true,
          "short": "Type of holiday",
          "readOnly": true
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "school_holiday",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/SchoolHolidays",
              "segments": [
                {
                  "lit": "SchoolHolidays"
                }
              ],
              "parts": [
                "SchoolHolidays"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "query": [
                  {
                    "name": "country_iso_code",
                    "orig": "countryIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "DE"
                  },
                  {
                    "name": "group_code",
                    "orig": "groupCode",
                    "type": "`$STRING`",
                    "kind": "query"
                  },
                  {
                    "name": "language_iso_code",
                    "orig": "languageIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "DE"
                  },
                  {
                    "name": "subdivision_code",
                    "orig": "subdivisionCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "DE-MV"
                  },
                  {
                    "name": "valid_from",
                    "orig": "validFrom",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "2023-01-01"
                  },
                  {
                    "name": "valid_to",
                    "orig": "validTo",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "2023-12-31"
                  }
                ]
              },
              "select": {
                "exist": [
                  "country_iso_code",
                  "valid_from",
                  "valid_to"
                ]
              },
              "response": {
                "alternatives": [
                  {
                    "kind": "json",
                    "media": "text/json"
                  },
                  {
                    "kind": "raw",
                    "media": "text/calendar"
                  },
                  {
                    "kind": "raw",
                    "media": "text/csv"
                  },
                  {
                    "kind": "raw",
                    "media": "text/plain"
                  }
                ],
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "school_holidays_by_date": {
      "fields": [
        {
          "name": "comment",
          "title": "Comment",
          "type": "`$ARRAY`",
          "short": "Additional localized comments"
        },
        {
          "name": "country",
          "title": "Country",
          "type": "`$OBJECT`",
          "req": true,
          "short": "Representation of a country reference",
          "readOnly": true
        },
        {
          "name": "groups",
          "title": "Groups",
          "type": "`$ARRAY`",
          "short": "List of group references"
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$STRING`",
          "req": true,
          "short": "Unique holiday id",
          "format": "uuid"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Localized names of the holiday"
        },
        {
          "name": "nationwide",
          "title": "Nationwide",
          "type": "`$BOOLEAN`",
          "req": true,
          "short": "Is the holiday nationwide?"
        },
        {
          "name": "regionalScope",
          "title": "Regional Scope",
          "type": "`$STRING`",
          "short": "Regional scope of a holdiay",
          "readOnly": true
        },
        {
          "name": "subdivisions",
          "title": "Subdivisions",
          "type": "`$ARRAY`",
          "short": "List of subdivision references"
        },
        {
          "name": "tags",
          "title": "Tags",
          "type": "`$ARRAY`",
          "short": "Additional holday tags"
        },
        {
          "name": "temporalScope",
          "title": "Temporal Scope",
          "type": "`$STRING`",
          "short": "Temporal scope of a holdiay",
          "readOnly": true
        },
        {
          "name": "type",
          "title": "Type",
          "type": "`$STRING`",
          "req": true,
          "short": "Type of holiday",
          "readOnly": true
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "school_holidays_by_date",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/SchoolHolidaysByDate",
              "segments": [
                {
                  "lit": "SchoolHolidaysByDate"
                }
              ],
              "parts": [
                "SchoolHolidaysByDate"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "query": [
                  {
                    "name": "date",
                    "orig": "date",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "2023-12-25"
                  },
                  {
                    "name": "language_iso_code",
                    "orig": "languageIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "DE"
                  }
                ]
              },
              "select": {
                "exist": [
                  "date"
                ]
              },
              "response": {
                "alternatives": [
                  {
                    "kind": "json",
                    "media": "text/json"
                  },
                  {
                    "kind": "raw",
                    "media": "text/csv"
                  },
                  {
                    "kind": "raw",
                    "media": "text/plain"
                  }
                ],
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "statistic": {
      "fields": [],
      "name": "statistic",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/Statistics/PublicHolidays",
              "segments": [
                {
                  "lit": "Statistics"
                },
                {
                  "lit": "PublicHolidays"
                }
              ],
              "parts": [
                "Statistics",
                "PublicHolidays"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "query": [
                  {
                    "name": "country_iso_code",
                    "orig": "countryIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "DE"
                  },
                  {
                    "name": "subdivision_code",
                    "orig": "subdivisionCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "DE-BE"
                  }
                ]
              },
              "select": {
                "$action": "public_holiday",
                "exist": [
                  "country_iso_code"
                ]
              },
              "response": {
                "alternatives": [
                  {
                    "kind": "json",
                    "media": "text/json"
                  },
                  {
                    "kind": "raw",
                    "media": "text/plain"
                  }
                ],
                "kind": "json",
                "media": "application/json"
              }
            },
            {
              "kind": "http",
              "method": "GET",
              "orig": "/Statistics/SchoolHolidays",
              "segments": [
                {
                  "lit": "Statistics"
                },
                {
                  "lit": "SchoolHolidays"
                }
              ],
              "parts": [
                "Statistics",
                "SchoolHolidays"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "query": [
                  {
                    "name": "country_iso_code",
                    "orig": "countryIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "DE"
                  },
                  {
                    "name": "group_code",
                    "orig": "groupCode",
                    "type": "`$STRING`",
                    "kind": "query"
                  },
                  {
                    "name": "subdivision_code",
                    "orig": "subdivisionCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "DE-BE"
                  }
                ]
              },
              "select": {
                "$action": "school_holiday",
                "exist": [
                  "country_iso_code"
                ]
              },
              "response": {
                "alternatives": [
                  {
                    "kind": "json",
                    "media": "text/json"
                  },
                  {
                    "kind": "raw",
                    "media": "text/plain"
                  }
                ],
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "subdivision": {
      "fields": [
        {
          "name": "category",
          "title": "Category",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Localized categories of the subdivision"
        },
        {
          "name": "children",
          "title": "Children",
          "type": "`$ARRAY`",
          "short": "Child subdivisions"
        },
        {
          "name": "code",
          "title": "Code",
          "type": "`$STRING`",
          "req": true,
          "short": "Subdivision code"
        },
        {
          "name": "comment",
          "title": "Comment",
          "type": "`$ARRAY`",
          "short": "Localized comments of the subdivision"
        },
        {
          "name": "groups",
          "title": "Groups",
          "type": "`$ARRAY`",
          "short": "List of group references"
        },
        {
          "name": "isoCode",
          "title": "Iso Code",
          "type": "`$STRING`",
          "short": "ISO 3166-2 subdivision code (if defined)"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Localized names of the subdivision"
        },
        {
          "name": "officialLanguages",
          "title": "Official Languages",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Official languages as ISO-639-1 codes"
        },
        {
          "name": "shortName",
          "title": "Short Name",
          "type": "`$STRING`",
          "req": true,
          "short": "Short name for display"
        }
      ],
      "name": "subdivision",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/Subdivisions",
              "segments": [
                {
                  "lit": "Subdivisions"
                }
              ],
              "parts": [
                "Subdivisions"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "query": [
                  {
                    "name": "country_iso_code",
                    "orig": "countryIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true,
                    "example": "DE"
                  },
                  {
                    "name": "language_iso_code",
                    "orig": "languageIsoCode",
                    "type": "`$STRING`",
                    "kind": "query",
                    "example": "DE"
                  }
                ]
              },
              "select": {
                "exist": [
                  "country_iso_code"
                ]
              },
              "response": {
                "alternatives": [
                  {
                    "kind": "json",
                    "media": "text/json"
                  },
                  {
                    "kind": "raw",
                    "media": "text/csv"
                  },
                  {
                    "kind": "raw",
                    "media": "text/plain"
                  }
                ],
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

