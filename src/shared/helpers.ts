import { notification } from 'antd';
import moment from 'moment';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const errorHandler = (error: any): void => {
  notification.error({
    message: 'Something went wrong.',
    description: JSON.stringify(error),
  });
  console.log(error);
  return undefined;
};

export const stringCompare = (a = '', b = ''): any => {
  const al = a.replace(/\s+/g, '');
  const bl = b.replace(/\s+/g, '');
  return al.localeCompare(bl, 'nb');
};

export const dateSorter = <A>(select: (x: A) => string) => {
  return function compare(a: A, b: A): any {
    return moment(select(a)).diff(select(b));
  };
};
