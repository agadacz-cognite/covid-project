import React from 'react';
import { notification } from 'antd';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const errorHandler = (error: any): void => {
  const mail = (
    <a
      href={`mailto:anna.gadacz@cognite.com?subject=COVID Project issue&body=${error}`}>
      Anna
    </a>
  );
  notification.error({
    message: 'Something went wrong.',
    description: `${error} Please contact ${mail}!`,
  });
};

export const stringCompare = (a = '', b = ''): any => {
  const al = a.replace(/\s+/g, '');
  const bl = b.replace(/\s+/g, '');
  return al.localeCompare(bl, 'nb');
};
