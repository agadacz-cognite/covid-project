import React, { useContext } from 'react';
import { GithubOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { clickGithubLinkTracker } from '../mixpanel';
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

  return (
    <Bar>
      <a
        href="https://github.com/agadacz-cognite/covid-project"
        target="_blank"
        rel="noreferrer"
        onClick={onGithubClick}>
        <GithubOutlined />
      </a>
    </Bar>
  );
};
