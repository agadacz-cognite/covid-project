import styled from 'styled-components';

export const Choice = styled.div.attrs(
  ({ availability, chosen }: { availability: number; chosen: boolean }) => {
    const style: any = {};
    if (chosen) {
      style.border = '4px solid green';
    }
    if (availability === 0) {
      style.backgroundColor = '#e0e0e0';
      style.cursor = 'not-allowed';
    }
    if (availability > 0 && availability <= 20) {
      style.backgroundColor = '#ffd4d1';
    }
    if (availability > 20 && availability <= 40) {
      style.backgroundColor = '#ffeccf';
    }
    if (availability > 40 && availability <= 60) {
      style.backgroundColor = '#ffffcf';
    }
    if (availability > 60 && availability <= 80) {
      style.backgroundColor = '#f2ffcf';
    }
    if (availability > 80) {
      style.backgroundColor = '#d1ffd4';
    }
    return { style };
  },
)<{ availability: number; chosen: boolean }>`
  width: 100px;
  height: 100px;
  border: 1px solid #eee;
  box-sizing: border-box;
  border-radius: 4px;
  margin: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  background-color: white;

  &:hover {
    box-shadow: ${({ availability }) =>
      availability > 0 ? '0 0 3px #666' : 'none'};
  }
`;

export const Hour = styled.div.attrs(
  ({ available }: { available: boolean }) => {
    const style: any = {};
    if (!available) {
      style.textDecoration = 'line-through';
      style.color = '#444';
    }
    return { style };
  },
)<{ available: boolean }>`
  width: 100%;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
`;

export const Places = styled.div`
  font-size: 12px;
  color: #333;
  padding: 8px;
`;
