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
      final: registrations,
      weekDate: rawWeekDate,
      weeks,
    } = await getRegistrationsForThisWeek(activeRegistration);
    const sanitizedRegistrations = registrations
      .map((registration: string[][]) =>
        registration.map((singleUser: string[]) =>
          singleUser.filter((field: string) => field?.length),
        ),
      )
      .map((registration: string[][]) =>
        registration.filter((singleUser: string[]) => singleUser?.length),
      );
    setRegisteredUsersData(sanitizedRegistrations);
    setWeekDate(rawWeekDate);
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
    width: '50px',
    render: (item: string[]) => <span>{item[0]}</span>,
    sorter: (a: any, b: any) => stringCompare(a?.[0], b?.[0]),
  },
  {
    title: 'Name',
    key: 'name',
    width: '250px',
    render: (item: string[]) => (
      <span style={{ fontWeight: 'bold' }}>{item[1]}</span>
    ),
    sorter: (a: any, b: any) => stringCompare(a?.[1], b?.[1]),
  },
  {
    title: 'Manager',
    key: 'manager',
    width: '250px',
    render: (item: string[]) => <span>{item[2]}</span>,
    sorter: (a: any, b: any) => stringCompare(a?.[2], b?.[2]),
  },
  {
    title: 'Hour',
    key: 'hour',
    width: '50px',
    align: 'center' as const,
    render: (item: string[]) => <span>{item[3]}</span>,
    sorter: (a: any, b: any) => stringCompare(a?.[3], b?.[3]),
  },
  {
    title: 'Vaccinated',
    key: 'vaccinated',
    width: '100px',
    render: (item: string[]) => <span>{item[4] === 'X' ? 'yes' : ''}</span>,
    sorter: (a: any, b: any) => stringCompare(a?.[4], b?.[4]),
  },
];
