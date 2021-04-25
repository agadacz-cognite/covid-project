import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/en-gb';
import { Select } from 'antd';
import styled from 'styled-components';
import { Flex } from '../../components';

import { possibleDays, possibleHours } from './dates';

const { Option } = Select;

type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
export type SlotData = {
  testDay: Day;
  testHours: string[];
  officeDays: Day[];
};

type Props = { slot: SlotData };

export default function Slot({ slot }: Props): JSX.Element {
  const { testDay, testHours, officeHours } = slot;
  console.log(testDay, testHours, officeHours);
  return (
    <StyledSlot column>
      <Flex row align style={{ margin: '4px 0' }}>
        <span style={{ fontWeight: 'bold', width: '90px' }}>Test day</span>
        <Select style={{ width: '100%', marginLeft: '8px' }}>
          {possibleDays.map((day: string) => (
            <Option key={day} value={day}>
              {day}
            </Option>
          ))}
        </Select>
      </Flex>
      <Flex row align style={{ margin: '4px 0' }}>
        <span style={{ fontWeight: 'bold', width: '90px' }}>Test hours</span>
        <Select mode="tags" style={{ width: '100%', marginLeft: '8px' }}>
          {possibleHours.map((hour: string) => (
            <Option key={hour.replace(':', '')} value={hour}>
              {hour}
            </Option>
          ))}
        </Select>
      </Flex>
      <Flex row align style={{ margin: '4px 0' }}>
        <span style={{ fontWeight: 'bold', width: '90px' }}>Office days</span>
        <Select mode="tags" style={{ width: '100%', marginLeft: '8px' }}>
          {possibleDays.map((day: string) => (
            <Option key={day} value={day}>
              {day}
            </Option>
          ))}
        </Select>
      </Flex>
    </StyledSlot>
  );
}
const StyledSlot = styled(Flex)`
  padding: 8px;
  margin: 4px;
  box-sizing: border-box;
  border: 1px solid #cecece;
`;
