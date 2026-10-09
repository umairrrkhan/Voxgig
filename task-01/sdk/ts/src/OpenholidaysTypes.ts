// Typed models for the Openholidays SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Country {
  isoCode: string
  name: any[]
  officialLanguages: any[]
}

export interface CountryListMatch {
  language_iso_code?: string
}

export interface Group {
  category: any[]
  children?: any[]
  code: string
  comment?: any[]
  name: any[]
  shortName: string
  subdivisions?: any[]
}

export interface GroupListMatch {
  country_iso_code: string
  language_iso_code?: string
  subdivision_code?: string
}

export interface Language {
  isoCode: string
  name: any[]
}

export interface LanguageListMatch {
  language_iso_code?: string
}

export interface PublicHoliday {
  comment?: any[]
  endDate: string
  groups?: any[]
  id: string
  name: any[]
  nationwide: boolean
  regionalScope?: string
  startDate: string
  subdivisions?: any[]
  tags?: any[]
  temporalScope?: string
  type: string
}

export interface PublicHolidayListMatch {
  country_iso_code: string
  language_iso_code?: string
  subdivision_code?: string
  valid_from: string
  valid_to: string
}

export interface PublicHolidaysByDate {
  comment?: any[]
  country: Record<string, any>
  groups?: any[]
  id: string
  name: any[]
  nationwide: boolean
  regionalScope?: string
  subdivisions?: any[]
  tags?: any[]
  temporalScope?: string
  type: string
}

export interface PublicHolidaysByDateListMatch {
  date: string
  language_iso_code?: string
}

export interface SchoolHoliday {
  comment?: any[]
  endDate: string
  groups?: any[]
  id: string
  name: any[]
  nationwide: boolean
  regionalScope?: string
  startDate: string
  subdivisions?: any[]
  tags?: any[]
  temporalScope?: string
  type: string
}

export interface SchoolHolidayListMatch {
  country_iso_code: string
  group_code?: string
  language_iso_code?: string
  subdivision_code?: string
  valid_from: string
  valid_to: string
}

export interface SchoolHolidaysByDate {
  comment?: any[]
  country: Record<string, any>
  groups?: any[]
  id: string
  name: any[]
  nationwide: boolean
  regionalScope?: string
  subdivisions?: any[]
  tags?: any[]
  temporalScope?: string
  type: string
}

export interface SchoolHolidaysByDateListMatch {
  date: string
  language_iso_code?: string
}

export interface Statistic {
}

export interface StatisticLoadMatch {
  country_iso_code: string
  subdivision_code?: string
  group_code?: string

  // Selects a custom action instead of the plain load:
  //   'public_holiday' | 'school_holiday'
  // The remaining keys are that action's own payload.
  $action?: string
  [action: string]: any
}

export interface Subdivision {
  category: any[]
  children?: any[]
  code: string
  comment?: any[]
  groups?: any[]
  isoCode?: string
  name: any[]
  officialLanguages: any[]
  shortName: string
}

export interface SubdivisionListMatch {
  country_iso_code: string
  language_iso_code?: string
}

