import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment/locale/en-gb';
import { Select, Button, InputNumber, AutoComplete } from 'antd';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { Flex } from '../../components';
import { SlotData, TestHoursInSlot } from '../../shared/types';
import { possibleDays, possibleHours } from './dates';

const { Option } = Select;
const { Option: OptionAutoComplete } = AutoComplete;

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
    slot: { id, testDay, testHours, officeDays },
    onTestDayChange,
    onTestHoursChange,
    onOfficeDaysChange,
    onSlotDelete,
  } = props;

  const daysOptions = possibleDays.map((day: string) => (
    <Option key={day} value={day}>
      {day}
    </Option>
  ));

  const onAddHour = () => {
    const newTestHours: TestHoursInSlot[] = [
      ...testHours,
      { hour: '', places: 15, id: uuid() },
    ];
    onTestHoursChange(id, newTestHours);
  };
  const onHourDelete = (hour: TestHoursInSlot) => {
    const newTestHours: TestHoursInSlot[] = testHours.filter(
      (testHour: TestHoursInSlot) => testHour.id !== hour.id,
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
          {testHours.map((testHour: TestHoursInSlot, index: number) => {
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
                    onChange={value => onTestHoursChange(id, value)}
                    style={{ width: '60px' }}>
                    {possibleHours.map((hour: string) => (
                      <OptionAutoComplete key={`hour-${uuid()}`} value={hour}>
                        {hour}
                      </OptionAutoComplete>
                    ))}
                  </AutoComplete>
                  <InputNumber
                    min={1}
                    max={50}
                    defaultValue={15}
                    style={{ width: '60px' }}
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
