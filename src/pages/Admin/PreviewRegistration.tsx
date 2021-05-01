import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Table, Typography, Spin } from 'antd';
import {
  AppContext,
  useBackIfNotAdmin,
  useBackIfNotLogged,
  useActiveRegistration,
} from '../../context';
import { stringCompare } from '../../shared/helpers';
import { getRegistrationsForThisWeek } from './utils';
import { Flex, Header } from '../../components';

const { Title } = Typography;

export default function PreviewRegistration(): JSX.Element {
  const history = useHistory();
  const { activeRegistration, user } = useContext(AppContext);
  const [registeredUsersData, setRegisteredUsersData] = useState([]);
  const [weekDate, setWeekDate] = useState('');

  useActiveRegistration();
  useBackIfNotLogged();
  useBackIfNotAdmin();

  const getRegisteredUsers = async () => {
    const {
      final: registrations,
      weekDate: rawWeekDate,
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
  };
  const onBack = () => history.push('/admin');

  useEffect(() => {
    if (activeRegistration) {
      getRegisteredUsers();
    }
  }, [activeRegistration]);

  return (
    <Flex column>
      <Header>
        <Title level={2}>Week {weekDate}</Title>
        <p>
          Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
        </p>
      </Header>
      <Flex row>
        {!registeredUsersData && <Spin size="large" />}
        {registeredUsersData &&
          registeredUsersData.map((oneSlot: string[][], index: number) => (
            <Flex column key={`users-table-${index}`}>
              <Header>Monday</Header>
              <Table
                columns={columns}
                dataSource={oneSlot}
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
                style={{ margin: '0 8px' }}
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
    title: 'Name',
    key: 'name',
    width: '250px',
    render: (item: string[]) => (
      <span style={{ fontWeight: 'bold' }}>{item[0]}</span>
    ),
    sorter: (a: any, b: any) => stringCompare(a?.[0], b?.[0]),
  },
  {
    title: 'Manager',
    key: 'manager',
    width: '250px',
    render: (item: string[]) => <div>{item[1]}</div>,
    sorter: (a: any, b: any) => stringCompare(a?.[1], b?.[1]),
  },
  {
    title: 'Hour',
    key: 'hour',
    width: '100px',
    render: (item: string[]) => <div>{item[2]}</div>,
    sorter: (a: any, b: any) => stringCompare(a?.[2], b?.[2]),
  },
  {
    title: 'Vaccinated',
    key: 'vaccinated',
    width: '100px',
    render: (item: string[]) => <div>{item[3] === 'X' ? 'yes' : 'no'}</div>,
    sorter: (a: any, b: any) => stringCompare(a?.[3], b?.[3]),
  },
];
