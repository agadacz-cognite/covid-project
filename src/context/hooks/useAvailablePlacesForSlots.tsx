import { useEffect, useContext } from 'react';
import deepEqual from 'deep-equal';
import { AppContext } from '../';
import { db } from '../../firebase';
import { v4 as uuid } from 'uuid';
import {
  errorHandler,
  RegisteredUser,
  SlotData,
  FixedSlotData,
  TestHourInSlot,
  ChosenHour,
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
              (slot: SlotData) => {
                let testHours = [];
                if (typeof slot.testHours[0] === 'string') {
                  // this means it's an old format
                  const adjustToNewFormat = slot.testHours.map(
                    (testHour: any) => ({
                      hour: testHour,
                      places: 15,
                      id: uuid(),
                    }),
                  );
                  testHours = adjustToNewFormat;
                } else {
                  testHours = slot.testHours;
                }
                return {
                  id: slot.id,
                  testHours: testHours.map((testHour: TestHourInSlot) => {
                    return {
                      hourId: testHour.id,
                      totalPlaces: testHour.places ?? 15,
                      takenPlaces: registrations.filter(
                        (registeredUser: RegisteredUser) => {
                          const usersChosenHours = registeredUser.testHours.find(
                            (userTestHour: ChosenHour) =>
                              userTestHour.slotId === slot.id &&
                              userTestHour.hourId === testHour.hour,
                          );
                          return (
                            registeredUser.weekId === weekId && usersChosenHours
                          );
                        },
                      ).length,
                    };
                  }),
                };
              },
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
