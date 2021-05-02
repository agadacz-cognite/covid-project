import React from 'react';
import { notification } from 'antd';
import { SendEmailProps } from './types';

/**
 * Handles an error
 * @param error
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const errorHandler = (error: any): void => {
  notification.error({
    message: 'Something went wrong.',
    description: (
      <div>
        <p>Don&apos;t worry, you probably just need to refresh the page!</p>
        <p>
          Click{' '}
          <a
            href={`mailto:anna.gadacz@cognite.com?subject=COVID Project issue, fix fast pls&body=${String(
              error,
            )}`}>
            HERE{' '}
          </a>
          to send an email to Anna.
        </p>
        <span></span>
      </div>
    ),
  });
};

/**
 * Compares string a with string b
 * @param a
 * @param b
 * @returns
 */
export const stringCompare = (a = '', b = ''): any => {
  const al = a.replace(/\s+/g, '');
  const bl = b.replace(/\s+/g, '');
  return al.localeCompare(bl, 'nb');
};

/**
 *
 * @param param0
 */
export const sendEmail = ({
  email,
  subject,
  content,
}: SendEmailProps): void => {
  (window as any).Email.send({
    SecureToken: 'd92b5171-f9c5-4573-b866-b87c4d392dd6',
    Username: 'Cognite COVID Test Bot',
    To: email,
    From: 'cogcovidtest@gmail.com',
    Subject: subject,
    Body: content,
  });
};
