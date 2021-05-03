import { useEffect, useContext } from 'react';
import deepEqual from 'deep-equal';
import { AppContext } from '../';
import { db } from '../../firebase';
import {
  errorHandler,
  RegisteredUser,
  SlotData,
  FixedSlotData,
} from '../../shared';

/**
 * Prepares the information about the availability of the slots for the passed week.
 * @param weekId string|undefined
 */
export const useAvailablePlacesForSlots = async (
  weekId: string | undefined,
): Promise<any> => {
  const { slotsData, setSlotsData } = useContext(AppContext);

  useEffect(() => {
    if (!weekId) {
      return;
    }
    db.collection('weeks')
      .doc(weekId)
      .get()
      .then((weeksDoc: any) => {
        if (!weeksDoc.exists) {
          return;
        }
        const weeksRaw = weeksDoc.data();
        const registrationsRef = db
          .collection('registrations')
          .where('weekId', '==', weekId);
        const unsubscribe = registrationsRef.onSnapshot(
          (registrationsDocs: any) => {
            const registrations: RegisteredUser[] = [];
            registrationsDocs.forEach((registrationDoc: any) => {
              registrations.push({
                id: registrationDoc.id,
                ...registrationDoc.data(),
              });
            });
            const slots: FixedSlotData[] = weeksRaw?.slots.map(
              (slot: SlotData) => ({
                id: slot.id,
                testHours: slot.testHours.map((testHour: string) => ({
                  time: testHour,
                  totalPlaces: slot.slotsNr,
                  takenPlaces: registrations.filter(
                    (registeredUser: RegisteredUser) =>
                      registeredUser.weekId === weekId &&
                      registeredUser.testHours[slot.id] === testHour,
                  ).length,
                })),
              }),
            );
            if (!deepEqual(slots, slotsData)) {
              setSlotsData(slots);
            }
          },
          errorHandler,
        );
        return () => {
          unsubscribe();
        };
      });
  }, []);
};
