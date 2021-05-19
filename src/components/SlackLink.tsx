import React from 'react';
import styled from 'styled-components';
import { Flex } from './Flex';

const Wrapper = styled(Flex)`
  background-color: #f0dfdf;
  margin: 8px;
  padding: 8px;
  font-weight: bold;
`;

export const SlackLink = (): JSX.Element => {
  return (
    <Wrapper row align justify>
      All slots are taken and you want to either get one or give away one? Visit
      <a
        href="https://cognitedata.slack.com/archives/C022RUTF21X"
        target="_blank"
        rel="noreferrer"
        style={{ margin: '0 4px' }}>
        #topic-lf-covid-test-slot
      </a>
      channel on Slack!
    </Wrapper>
  );
};
