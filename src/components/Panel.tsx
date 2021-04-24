import styled from 'styled-components';

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border: 1px solid #ccc;
  background-color: #fefefe;
  box-shadow: 0 0 100px #000;

  & > * {
    margin: 12px;
  }
`;
