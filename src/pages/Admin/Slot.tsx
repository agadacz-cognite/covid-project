import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/en-gb';
import { Select, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Flex } from '../../components';

import { possibleDays, possibleHours } from './dates';

const { Option } = Select;

type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
export type SlotData = {
  id: string;
  testDay: Day;
  testHours: string[];
  officeDays: Day[];
};

type Props = {
  slot: SlotData;
} & {
  onTestDayChange: () => void;
  onTestHoursChange: () => void;
  onOfficeDaysChange: () => void;
  onSlotDelete: (id: string) => void;
};

export default function Slot(props: Props): JSX.Element {
  const {
    slot: { id, testDay, testHours, officeDays },
    onTestDayChange,
    onTestHoursChange,
    onOfficeDaysChange,
    onSlotDelete,
  } = props;

  const hoursOptions = possibleHours.map((hour: string) => (
    <Option key={hour.replace(':', '')} value={hour}>
      {hour}
    </Option>
  ));
  const daysOptions = possibleDays.map((day: string) => (
    <Option key={day} value={day}>
      {day}
    </Option>
  ));

  return (
    <StyledSlot column>
      <Flex row align style={{ justifyContent: 'flex-end' }}>
        <Button
          type="text"
          danger
          icon={<CloseCircleOutlined />}
          onClick={() => onSlotDelete(id)}
          style={{
            padding: 0,
            width: '16px',
            height: '16px',
            marginBottom: '8px',
          }}
        />
      </Flex>
      <Flex row align style={{ margin: '4px 0' }}>
        <span style={{ fontWeight: 'bold', width: '90px' }}>Test day</span>
        <Select
          value={testDay}
          onChange={onTestDayChange}
          style={{ width: '100%', marginLeft: '8px' }}>
          {possibleDays.map((day: string) => (
            <Option key={day} value={day}>
              {day}
            </Option>
          ))}
        </Select>
      </Flex>
      <Flex row align style={{ margin: '4px 0' }}>
        <span style={{ fontWeight: 'bold', width: '90px' }}>Test hours</span>
        <Select
          value={testHours}
          onChange={onTestHoursChange}
          mode="tags"
          style={{ width: '100%', marginLeft: '8px' }}>
          {hoursOptions}
        </Select>
      </Flex>
      <Flex row align style={{ margin: '4px 0' }}>
        <span style={{ fontWeight: 'bold', width: '90px' }}>Office days</span>
        <Select
          value={officeDays}
          onChange={onOfficeDaysChange}
          mode="tags"
          style={{ width: '100%', marginLeft: '8px' }}>
          {daysOptions}
        </Select>
      </Flex>
    </StyledSlot>
  );
}
const StyledSlot = styled(Flex)`
  padding: 8px;
  margin: 4px 0;
  box-sizing: border-box;
  border: 1px solid #cecece;
`;
