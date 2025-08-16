export interface Address {
  id: number;
  title: string;
  phoneNumber?: string;
  longitude: number;
  latitude: number;
  description: string;
  pelak: string;
  vahed: string;
  districtId: number;
  floor: string;
}


export type AddressQuery = {
  search_text: string,
  district: string,
}

export type GeoAddress = {
  city: string,
  municipality_zone: number,
  formatted_address: string,
}//
// export type GeoAddress = {
//   address: string,
//   subdivision_prefix: string,
//   subdiv_prefixed_address: string,
//   certainty: number,
//   status: string
// }

export type AddressSearchResult = {
  geo_location: GeoLocation;
  description: string;

}
export type GeoLocation = {
  title: string;
  category: string;
  center: Position
}

export type Position = {
  lat: number;
  lng: number
}

