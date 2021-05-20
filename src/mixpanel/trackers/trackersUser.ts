import { track } from '../';

// new user registration
export const newUserRegistrationTracker = (email: string): void =>
  track({
    email,
    event: 'New registration',
    eventOptions: { timestamp: Date.now() },
  });

export const failedNewUserRegistrationTracker = (
  email: string,
  failReason: string,
): void =>
  track({
    email,
    event: 'New registration FAIL',
    eventOptions: { timestamp: Date.now(), failReason },
  });

// user edit registration
export const editUserRegistrationTracker = (email: string): void =>
  track({
    email,
    event: 'Edit registration',
    eventOptions: { timestamp: Date.now() },
  });

export const failedEditUserRegistrationTracker = (
  email: string,
  failReason: string,
): void =>
  track({
    email,
    event: 'Edit registration FAIL',
    eventOptions: { timestamp: Date.now(), failReason },
  });

// user delete registration
export const deleteUserRegistrationTracker = (email: string): void =>
  track({
    email,
    event: 'Delete registration',
    eventOptions: { timestamp: Date.now() },
  });

export const failedDeleteUserRegistrationTracker = (
  email: string,
  failReason: string,
): void =>
  track({
    email,
    event: 'Delete registration FAIL',
    eventOptions: { timestamp: Date.now(), failReason },
  });
