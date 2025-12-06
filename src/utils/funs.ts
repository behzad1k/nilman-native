import { defaultLanguage, LOCALES } from '@/src/configs/translations';
import { Service } from '@/src/features/service/types';

export const findRootCount = (arr: any[], value: any, key: string = 'id') => {
  let obj = arr.find(e => e[key] == value);
  let count = 0;

  if (!obj?.parent){
    return count;
  }

  while (obj?.parent){
    obj = arr.find(e => e[key] == obj?.parent?.id);
    ++count;
  }
  return count;
}
export const findAncestors = (arr: any[], value: any, key: string = 'id'): Service[] => {
  let obj = arr.find(e => e[key] == value);
  let ancestors = [obj];

  if (!obj?.parent){
    return ancestors;
  }

  while (obj?.parent){
    obj = arr.find(e => e[key] == obj?.parent?.id);
    ancestors.push(obj)
  }
  return ancestors;
}
export const extractChildren = (node: any, array: any[], index: number = 0, depth = 0) => {
  ++depth;

  const j = { ...node, title: node.title }

  array.push(j)

  if (j.attributes) {
    j.attributes.map((e: any) => {
      return extractChildren(e, array, ++index, depth)
    })
  }
  return array;
}

export const formatPrice = (value: number | string, lang = defaultLanguage) =>
  Intl.NumberFormat(LOCALES[lang]).format(value as number);

export const omit = (keys: any, obj: any): any => {
  if (!keys.length) return obj
  const { [keys.pop()]: omitted, ...rest } = obj;
  return omit(keys, rest);
}

export const isEmpty = (obj: any) => {
  return Object.keys(obj)?.length == 0;
}

export const persianNumToEn = (str: any) => str.toString().replace(/[۰-۹]/g, (d: any) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))

export const engNumToPersian = (str: any) => str.toString().replace(/[0-9]/g, (d: any) => '۰۱۲۳۴۵۶۷۸۹'.charAt(d))



export const getServiceIcon = (slug: string) => ({ uri: `/images/services/${slug}.png`})