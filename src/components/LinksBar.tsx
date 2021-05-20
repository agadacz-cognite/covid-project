import React, { useContext } from 'react';
import { Tooltip } from 'antd';
import { GithubOutlined, LineChartOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { clickGithubLinkTracker, clickMixpanelLinkTracker } from '../mixpanel';
import { AppContext } from '../context';

const Bar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 32px;

  & > * {
    padding: 0 8px;
  }

  a {
    text-decoration: none;
    color: rgba(255, 255, 255, 0.5);

    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }
`;

export const LinksBar = (): JSX.Element => {
  const { user } = useContext(AppContext);
  const onGithubClick = () => clickGithubLinkTracker(user?.email);
  const onMixpanelClick = () => clickMixpanelLinkTracker(user?.email);

  const gitUrl = 'https://github.com/agadacz-cognite/covid-project';
  const mixpanelUrl =
    'https://eu.mixpanel.com/project/2375253/view/2919913/app/dashboards#id=1076659';

  return (
    <Bar>
      <Tooltip title="Mixpanel" placement="left">
        <a
          href={mixpanelUrl}
          target="_blank"
          rel="noreferrer"
          onClick={onMixpanelClick}>
          <LineChartOutlined />
        </a>
      </Tooltip>
      <Tooltip title="Github repository" placement="left">
        <a
          href={gitUrl}
          target="_blank"
          rel="noreferrer"
          onClick={onGithubClick}>
          <GithubOutlined />
        </a>
      </Tooltip>
    </Bar>
  );
};
