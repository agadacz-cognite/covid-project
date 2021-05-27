import { useEffect, useState } from 'react';
import mixpanel from 'mixpanel-browser';
import { isDev } from '../shared';

export const useMixpanel = (): void => {
  const [mixpanelLoaded, setMixpanelLoaded] = useState(false);
  const token = process.env.REACT_APP_MIXPANEL;

  useEffect(() => {
    if (!token || mixpanelLoaded) {
      return;
    }
    mixpanel.init(token, { api_host: 'https://api-eu.mixpanel.com' }, '');
    setMixpanelLoaded(true);
  }, []);
};

type Track = {
  email: string;
  event: string;
  eventOptions?: { [key: string]: string | number | boolean };
};

export const track = ({ email, event, eventOptions = {} }: Track): void => {
  try {
    mixpanel.identify(email);
    mixpanel.track(event, {
      isDev,
      email,
      ...eventOptions,
    });
  } catch (error) {
    mixpanel.track('MIXPANEL ERROR', {
      email: 'SYSTEM',
      timestamp: Date.now(),
    });
  }
};

export * from './trackers';
