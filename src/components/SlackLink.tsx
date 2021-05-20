import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../context';
import { clickSlackLinkTracker } from '../mixpanel';

const Wrapper = styled.span`
  background-color: #f0dfdf;
  margin: 8px;
  padding: 8px;
  font-weight: bold;
  text-align: center;
`;

export const SlackLink = (): JSX.Element => {
  const { user } = useContext(AppContext);
  const onSlackLinkClick = () => clickSlackLinkTracker(user.email);

  return (
    <Wrapper>
      All slots are taken and you want to either get one or give away one? Visit
      <a
        href="https://cognitedata.slack.com/archives/C022RUTF21X"
        target="_blank"
        rel="noreferrer"
        onClick={onSlackLinkClick}
        style={{ margin: '0 4px' }}>
        #topic-lf-covid-test-slot
      </a>
      channel on Slack!
    </Wrapper>
  );
};
