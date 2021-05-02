import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/en-gb';
import { Select, Button, Slider } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Flex } from '../../components';
import { SlotData } from '../../shared/types';
import { possibleDays, possibleHours } from './dates';

const { Option } = Select;

type Props = {
  slot: SlotData;
} & {
  onTestDayChange: (id: string, value: any) => void;
  onTestHoursChange: (id: string, value: any) => void;
  onOfficeDaysChange: (id: string, value: any) => void;
  onSlotsNrChange: (id: string, value: any) => void;
  onSlotDelete: (id: string) => void;
};

export default function Slot(props: Props): JSX.Element {
  const {
    slot: { id, testDay, testHours, slotsNr, officeDays },
    onTestDayChange,
    onTestHoursChange,
    onOfficeDaysChange,
    onSlotsNrChange,
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
        <Flex row align style={{ flexGrow: 1 }}>
          <span style={{ fontWeight: 'bold', width: '73px' }}>Test day</span>
          <Select
            value={testDay}
            onChange={value => onTestDayChange(id, value)}
            style={{ marginLeft: '8px', flexGrow: 1 }}>
            {possibleDays.map((day: string) => (
              <Option key={day} value={day}>
                {day}
              </Option>
            ))}
          </Select>
        </Flex>
        <Flex row align style={{ flexGrow: 1 }}>
          <span style={{ fontWeight: 'bold', margin: '0 8px' }}>Slots</span>
          <Slider
            value={slotsNr}
            onChange={(value: number) => onSlotsNrChange(id, value)}
            min={1}
            max={30}
            style={{ marginLeft: '8px', flexGrow: 1 }}
          />
        </Flex>
      </Flex>
      <Flex row align style={{ margin: '4px 0' }}>
        <span style={{ fontWeight: 'bold', width: '90px' }}>Office days</span>
        <Select
          value={officeDays}
          onChange={value => onOfficeDaysChange(id, value)}
          mode="tags"
          style={{ width: '100%', marginLeft: '8px' }}>
          {daysOptions}
        </Select>
      </Flex>
      <Flex row align style={{ margin: '4px 0' }}>
        <span style={{ fontWeight: 'bold', width: '90px' }}>Test hours</span>
        <Select
          value={testHours}
          onChange={value => onTestHoursChange(id, value)}
          style={{ width: '100%', marginLeft: '8px' }}>
          {hoursOptions}
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
