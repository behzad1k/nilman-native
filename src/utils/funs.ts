import globalType from '../types/globalType';

type WorkerOff = {
  date: number;
  fromTime: number;
  id: number;
  orderId: null | number;
  toTime: number;
  workerId: number;
} | any;

type ScheduleCard = {
  fromTime: number;
  toTime: number;
};

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
export const findAncestors = (arr: any[], value: any, key: string = 'id'): globalType.Service[] => {
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

export const formatPrice = (value: number | string) =>
  Intl.NumberFormat().format(value as number);

export const omit = (keys: any, obj: any): any => {
  if (!keys.length) return obj
  const { [keys.pop()]: omitted, ...rest } = obj;
  return omit(keys, rest);
}
export function createSchedule(length: number, workerOff: WorkerOff[]) {
  const start = 8;
  const end = 23;

  const allHours: number[] = Array.from(
    {length: end - start + 1},
    (_, index) => index + start,
  );
  const busyHours: number[] = [];
  workerOff.forEach((item) => {
    let i = item.fromTime;
    while (i <= item.toTime) {
      busyHours.push(i);
      i++;
    }
  });
  const busySet = new Set(busyHours);

  const freeHours: number[] = allHours.filter((hour) => !busySet.has(hour));
  const freeHoursSet = new Set(freeHours);

  const scheduleCards: ScheduleCard[] = [];
  freeHours.forEach((hour) => {
    if (freeHoursSet.has(hour + length))
      scheduleCards.push({fromTime: hour, toTime: hour + length});
  });

  return scheduleCards;
}

export const isEmpty = (obj: any) => {
  return Object.keys(obj)?.length == 0;
}

export const persianNumToEn = (str: any) => str.replace(/[۰-۹]/g, (d: any) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))



export const getServiceIcon = (slug: string) => '/img/' + slug + '.png'