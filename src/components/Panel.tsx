import styled from 'styled-components';

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  border: 3px double #ccc;
  background-color: #fefefe;

  & > * {
    margin: 12px;
  }
`;
