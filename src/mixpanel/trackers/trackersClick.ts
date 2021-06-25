import { track } from '../';

export const clickSlackLinkTracker = (email: string): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'Slack link click',
    eventOptions: { timestamp: Date.now() },
  });

export const clickContactLinkTracker = (email: string, contact: string): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'Contact link click',
    eventOptions: { timestamp: Date.now(), contact },
  });

export const clickGithubLinkTracker = (email: string): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'GitHub link click',
    eventOptions: { timestamp: Date.now() },
  });

export const clickMixpanelLinkTracker = (email: string): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'Mixpanel link click',
    eventOptions: { timestamp: Date.now() },
  });

// calendar event
export const addCalendarEventTracker = (email: string): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'Add calendar event',
    eventOptions: { timestamp: Date.now() },
  });

export const failedAddCalendarEventTracker = (
  email: string,
  failReason: string,
): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'Add calendar event FAIL',
    eventOptions: { timestamp: Date.now(), failReason },
  });

// video
export const startVideoTracker = (email: string): void =>
  track({
    email: email ?? 'UNKNOWN ENTITY',
    event: 'Start watching video',
    eventOptions: { timestamp: Date.now() },
  });
