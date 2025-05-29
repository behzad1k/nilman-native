export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  slug: string;
  pricePlus: number;
  section: number;
  parent?: Service;
  attributes?: Service[];
  hasColor: boolean;
  isMulti: boolean;
  hasMedia: boolean;
  color?: string;
  media: any,
  sort: number,
  openDrawer: boolean,
  showInList: boolean,
  addOns: Service[];
}
