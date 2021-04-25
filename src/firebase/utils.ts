import { db } from '.';
import { notification } from 'antd';
import { SlotData } from '../pages/Admin/Slot';

type RegistrationData = {
  week: Date[];
  registrationOpenTime: Date;
  slots: SlotData[];
};

export const createActiveRegistration = (
  registrationData: RegistrationData,
): any => {
  return db
    .collection('registrations')
    .add(registrationData)
    .then(() =>
      notification.success({
        message: 'Yay!',
        description: 'You successfully opened a new registration!',
      }),
    )
    .catch(error => notification.error({ message: ':(', description: error }));
};
