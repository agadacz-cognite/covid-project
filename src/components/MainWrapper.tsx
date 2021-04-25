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
  position: fixed;
  display: flex;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-image: url(${bg});
  background-size: cover;
  z-index: -100;

  &:before {
    content: '';
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    pointer-events: none;
  }
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
