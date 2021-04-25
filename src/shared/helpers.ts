import { notification } from 'antd';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const errorHandler = (error: any): void => {
  notification.error({
    message: 'Something went wrong.',
    description: JSON.stringify(error),
  });
  return undefined;
};
