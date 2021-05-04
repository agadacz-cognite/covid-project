import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Typography, Button, Tooltip, notification } from 'antd';
import { ExportOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';
import {
  usePreviousWeeks,
  useBackIfNotAdmin,
  useBackIfNotLogged,
  AppContext,
} from '../../context';
import { Flex, Header, Card } from '../../components';
import { getRegistrationsForExcel, RegistrationData } from '../../shared';

const { SubMenu } = Menu;
const { Title } = Typography;

export default function OldRegistrations(): JSX.Element {
  const history = useHistory();
  const { user, previousWeeks } = useContext(AppContext);
  const [weekKeys, setWeekKeys] = useState<any[]>([]);
  const [openKeys, setOpenKeys] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>();

  useBackIfNotAdmin();
  useBackIfNotLogged();
  usePreviousWeeks();

  useEffect(() => {
    if (!previousWeeks) {
      return;
    }
    const keys = previousWeeks.map((week: RegistrationData) => week.id);
    setWeekKeys(keys);
  }, [previousWeeks]);

  const onOpenChange = (keys: any[]) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (latestOpenKey && weekKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const onWeekPreview = (weekId: string | undefined) =>
    history.push(`/admin/preview/${weekId}`);
  const onWeekExport = async (weekId: string | undefined) => {
    const {
      final: registrations,
      weekDate,
      legacy,
    } = await getRegistrationsForExcel(weekId);
    if (legacy) {
      notification.warning({
        message: 'Cannot download this week',
        description:
          'The week you try to download uses the legacy format and cannot be downloaded.',
      });
      return;
    }
    const fileTitle = weekDate.replace(' ', '');
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(registrations);
    XLSX.utils.book_append_sheet(workbook, sheet, 'data');
    XLSX.writeFile(workbook, `${fileTitle}.xlsx`);
  };
  const onWeekClick = (item: any) => setSelectedWeek(item?.key ?? undefined);
  const onBack = () => history.push('/admin');

  const mappedWeeks = () =>
    previousWeeks &&
    previousWeeks.map((week: RegistrationData) => {
      const isDisabled = week.legacy && (
        <Tooltip
          title={
            'This week uses the legacy format and cannot be downloaded nor previewed.'
          }>
          <ExclamationCircleOutlined style={{ color: 'orange' }} />
        </Tooltip>
      );
      const weekDate = `${new Date(
        (week?.week[0]?.seconds ?? 0) * 1000,
      ).toLocaleDateString()} - ${new Date(
        (week?.week[1]?.seconds ?? 0) * 1000,
      ).toLocaleDateString()}`;
      return (
        <SubMenu
          key={week.id}
          title={weekDate}
          onTitleClick={onWeekClick}
          icon={isDisabled}>
          <Menu.Item
            key={`view-users-${week?.id}`}
            onClick={() => onWeekPreview(week?.id)}
            disabled={week.legacy}>
            View registered users
          </Menu.Item>
          <Menu.Item
            key={`export-${week?.id}`}
            onClick={() => onWeekExport(week?.id)}
            disabled={week.legacy}>
            Export to Excel (*.xlsx) <ExportOutlined />
          </Menu.Item>
        </SubMenu>
      );
    });
  const selectedWeekData = () => {
    const week = previousWeeks?.find(
      (w: RegistrationData) => selectedWeek && w.id === selectedWeek,
    );
    return (
      <Card
        style={{
          minWidth: '300px',
          width: 'auto',
          height: 'auto',
          margin: '8px',
          padding: 0,
        }}>
        {week?.id ? week.id : 'Select a week in the menu on the left.'}
      </Card>
    );
  };

  return (
    <Flex column style={{ margin: 'auto' }}>
      <Header>
        <Title level={2}>Previous registrations</Title>
        <p>
          Logged in as {user?.displayName ?? '-'} ({user?.email ?? '-'})
        </p>
      </Header>
      <Flex row>
        <Menu
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectable={false}
          style={{ width: 'auto', height: 'auto', margin: '8px', padding: 0 }}>
          {mappedWeeks()}
        </Menu>
        {selectedWeekData()}
      </Flex>
      <Header>
        <Button type="primary" onClick={onBack}>
          Back to admin panel
        </Button>
      </Header>
    </Flex>
  );
}
