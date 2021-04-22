import React from 'react';
import styled from 'styled-components';
import bg from '../shared/img/bg.jpg';

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  justify-content: center;
  align-items: center;
`;
const Background = styled.div`
  position: absolute;
  display: flex;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-image: url(${bg});
  background-size: cover;
  filter: blur(8px);
  -webkit-filter: blur(8px);
`;

export const MainWrapper = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <>
      <Background />
      <Wrapper>{children}</Wrapper>
    </>
  );
};
