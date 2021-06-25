import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.span`
  background-color: #f2a3a3;
  margin: 8px;
  padding: 8px;
  box-sizing: border-box;
  font-weight: bold;
  text-align: center;
  a {
    color: #1060af;
  }
`;

type Props = { children: React.ReactNode };
export const InfoBar = (props: Props): JSX.Element => {
  const { children } = props;
  return <Wrapper>{children}</Wrapper>;
};
