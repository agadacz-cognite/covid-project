import React from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

const Wrapper = styled.div.attrs((props: { loading?: boolean }) => {
  return {
    style: {
      display: props.loading ? 'flex' : 'none',
    },
  };
})<{ loading?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
`;

export const Loader = ({ loading }: { loading: boolean }): JSX.Element => {
  return (
    <Wrapper loading={loading}>
      <Spin size="large" />
    </Wrapper>
  );
};
