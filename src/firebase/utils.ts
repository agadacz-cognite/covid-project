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
    .collection('weeks')
    .add(registrationData)
    .then(docRef => {
      const id = docRef.id;
      db.collection('options').doc('activeRegistration').update({
        id,
      });
      notification.success({
        message: 'Yay!',
        description: 'You successfully opened a new registration!',
      });
    })
    .catch(error => {
      notification.error({ message: ':(', description: JSON.stringify(error) });
    });
};

export const getActiveRegistration = (): any => {
  const docRef = db.collection('options').doc('activeRegistration');
  docRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        notification.error({
          message: 'Something went wrong.',
          description:
            'Something went wrong when trying to retrieve data of the active registration from database.',
        });
        return undefined;
      } else {
        const activeRegistration = doc.data();
        return activeRegistration?.id;
      }
    })
    .catch(error => {
      notification.error({
        message: 'Something went wrong.',
        description: JSON.stringify(error),
      });
      return undefined;
    });
};
