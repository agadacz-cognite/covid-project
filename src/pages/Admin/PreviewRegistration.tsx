import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Typography, Spin } from 'antd';
import {
  AppContext,
  useBackIfNotAdmin,
  useBackIfNotLogged,
  useActiveRegistration,
} from '../../context';
import { stringCompare } from '../../shared/helpers';
import { getRegistrationsForThisWeek } from './utils';
import { Flex, Header, Table } from '../../components';

const { Title } = Typography;

export default function PreviewRegistration(): JSX.Element {
  const history = useHistory();
  const { activeRegistration } = useContext(AppContext);
  const [registeredUsersData, setRegisteredUsersData] = useState([]);
  const [weekDate, setWeekDate] = useState('');
  const [weekDays, setWeekDays] = useState([]);

  useActiveRegistration();
  useBackIfNotLogged();
  useBackIfNotAdmin();

  const getRegisteredUsers = async () => {
    const {
      usersRegistrationData,
      weekDate,
      weeks,
    } = await getRegistrationsForThisWeek(activeRegistration);
    setRegisteredUsersData(usersRegistrationData);
    setWeekDate(weekDate);
    setWeekDays(weeks);
  };
  const onBack = () => history.push('/admin');

  useEffect(() => {
    if (activeRegistration) {
      getRegisteredUsers();
    }
  }, [activeRegistration]);

  return (
    <Flex column style={{ margin: 'auto' }}>
      <Header>
        <Title level={2} style={{ margin: 0 }}>
          Week {weekDate}
        </Title>
      </Header>
      <Flex row align justify style={{ flexWrap: 'wrap' }}>
        {!registeredUsersData && <Spin size="large" />}
        {registeredUsersData &&
          registeredUsersData.map((oneSlot: string[][], index: number) => (
            <Flex
              column
              align
              justify
              key={`users-table-${index}`}
              style={{ boxSizing: 'border-box', margin: '0 8px' }}>
              <Header style={{ flexDirection: 'row', width: '100%' }}>
                <Title level={4} style={{ margin: '0 8px 0 0' }}>
                  {weekDays[index]}
                </Title>
                <Title level={5} style={{ margin: 0 }}>
                  ({oneSlot?.length ?? '<?>'} registrations)
                </Title>
              </Header>
              <Table
                columns={columns}
                dataSource={oneSlot}
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
              />
            </Flex>
          ))}
      </Flex>
      <Header>
        <Button type="primary" onClick={onBack}>
          Back to admin panel
        </Button>
      </Header>
    </Flex>
  );
}

const columns = [
  {
    title: 'Date',
    key: 'date',
    dataIndex: 'registeredAt',
    width: '50px',
    render: (registeredAt: string) => (
      <span>
        {Number(registeredAt) === 0
          ? '-'
          : new Date(registeredAt).toLocaleString('no-NO', {
              hour12: false,
            })}
      </span>
    ),
    sorter: (a: any, b: any) => b?.registeredAt - a?.registeredAt,
  },
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    width: '250px',
    render: (name: string) => (
      <span style={{ fontWeight: 'bold' }}>{name}</span>
    ),
    sorter: (a: any, b: any) => stringCompare(a?.name, b?.name),
  },
  {
    title: 'Manager',
    key: 'manager',
    dataIndex: 'manager',
    width: '250px',
    render: (manager: string) => <span>{manager}</span>,
    sorter: (a: any, b: any) => stringCompare(a?.manager, b?.manager),
  },
  {
    title: 'Hour',
    key: 'hour',
    dataIndex: 'hour',
    width: '50px',
    align: 'center' as const,
    render: (hour: string) => <span>{hour}</span>,
    sorter: (a: any, b: any) => stringCompare(a?.hour, b?.hour),
  },
  {
    title: 'Vaccinated',
    key: 'vaccinated',
    dataIndex: 'vaccinated',
    width: '100px',
    render: (vaccinated: string) => (
      <span>{vaccinated === 'X' ? 'yes' : ''}</span>
    ),
    sorter: (a: any, b: any) => stringCompare(a?.vaccinated, b?.vaccinated),
  },
];
