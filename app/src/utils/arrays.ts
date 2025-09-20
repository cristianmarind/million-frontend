import _ from "lodash";

export const uniqByWithPriority = (arr: any[], id: string, key: string, val: any) => {
  const grouped = _.groupBy(arr, id);

  return _.map(grouped, (items) => {
    const prioritized = _.find(items, { [key]: val });
    return prioritized || items[0];
  });
}