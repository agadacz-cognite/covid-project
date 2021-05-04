import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/en-gb';
import { Select, Button, InputNumber, AutoComplete } from 'antd';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { Flex } from '../../components';
import { SlotData, TestHourInSlot } from '../../shared/types';
import { possibleDays, possibleHours, defaultNewHour } from './utils';

const { Option } = Select;
const { Option: OptionAutoComplete } = AutoComplete;

type Props = {
  slot: SlotData;
} & {
  onTestDayChange: (id: string, value: any) => void;
  onTestHoursChange: (id: string, value: any) => void;
  onOfficeDaysChange: (id: string, value: any) => void;
  onSlotDelete: (id: string) => void;
};

export default function Slot(props: Props): JSX.Element {
  const {
    slot,
    onTestDayChange,
    onTestHoursChange,
    onOfficeDaysChange,
    onSlotDelete,
  } = props;
  const { id, testDay, testHours, officeDays } = slot;

  const daysOptions = possibleDays.map((day: string) => (
    <Option key={day} value={day}>
      {day}
    </Option>
  ));

  const onAddHour = () => {
    const newTestHours: TestHourInSlot[] = [...testHours, defaultNewHour];
    onTestHoursChange(id, newTestHours);
  };
  const onHourDelete = (hour: TestHourInSlot) => {
    const newTestHours: TestHourInSlot[] = testHours.filter(
      (testHour: TestHourInSlot) => testHour.id !== hour.id,
    );
    onTestHoursChange(id, newTestHours);
  };
  const onTestPlacesChange = (hour: TestHourInSlot, places: number) => {
    const newTestHours: TestHourInSlot[] = testHours.map(
      (testHour: TestHourInSlot) => {
        if (testHour.id === hour.id) {
          return { ...testHour, places };
        }
        return testHour;
      },
    );
    onTestHoursChange(id, newTestHours);
  };
  const onTestHourChange = (testHour: TestHourInSlot, newHour: string) => {
    const newTestHours: TestHourInSlot[] = testHours.map(
      (oldHour: TestHourInSlot) => {
        if (testHour.id === oldHour.id) {
          return { ...oldHour, hour: newHour };
        }
        return oldHour;
      },
    );
    onTestHoursChange(id, newTestHours);
  };

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
          <span style={{ fontWeight: 'bold', minWidth: '80px' }}>Test day</span>
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
      </Flex>
      <Flex row align style={{ margin: '4px 0' }}>
        <span style={{ fontWeight: 'bold', minWidth: '80px' }}>
          Office days
        </span>
        <Select
          value={officeDays}
          onChange={value => onOfficeDaysChange(id, value)}
          mode="tags"
          style={{ width: '100%', marginLeft: '8px' }}>
          {daysOptions}
        </Select>
      </Flex>
      <Flex row align style={{ margin: '4px 0' }}>
        <Flex column style={{ fontWeight: 'bold', minWidth: '90px' }}>
          <div>Test hours </div>
          <div>+ places</div>
        </Flex>
        <Flex row style={{ flexWrap: 'wrap' }}>
          {testHours.map((testHour: TestHourInSlot, index: number) => {
            return (
              <Flex
                column
                key={`one-hour-slot-${index}`}
                style={{
                  position: 'relative',
                  margin: '0 4px 4px 0',
                  padding: 0,
                  alignItems: 'flex-end',
                }}>
                <Button
                  type="text"
                  danger
                  icon={
                    <CloseCircleOutlined
                      style={{
                        width: '16px',
                        height: '16px',
                        zIndex: 10,
                        backgroundColor: 'white',
                        borderRadius: '20px',
                      }}
                    />
                  }
                  onClick={() => onHourDelete(testHour)}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: 0,
                    padding: 0,
                    margin: 0,
                    width: '16px',
                    height: '16px',
                    zIndex: 10,
                  }}
                />
                <Flex
                  column
                  style={{
                    margin: '0 4px 4px 0',
                    padding: 0,
                    border: '1px solid #cecece',
                  }}>
                  <AutoComplete
                    placeholder="hour"
                    value={testHour.hour}
                    onChange={value => onTestHourChange(testHour, value)}
                    style={{ width: '60px' }}>
                    {possibleHours.map((hour: string) => (
                      <OptionAutoComplete key={`hour-${uuid()}`} value={hour}>
                        {hour}
                      </OptionAutoComplete>
                    ))}
                  </AutoComplete>
                  <InputNumber
                    min={0}
                    max={500}
                    value={testHour.places}
                    style={{ width: '60px' }}
                    onChange={(value: number) =>
                      onTestPlacesChange(testHour, value)
                    }
                  />
                </Flex>
              </Flex>
            );
          })}
          <Flex
            column
            style={{
              margin: '0 4px 4px 0',
              padding: 0,
              minWidth: '60px',
              minHeight: '60px',
            }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={onAddHour}
              style={{ height: '60px', width: '60px' }}
            />
          </Flex>
        </Flex>
        <Flex
          style={{ height: '100%', width: '32px', marginLeft: '8px' }}></Flex>
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
