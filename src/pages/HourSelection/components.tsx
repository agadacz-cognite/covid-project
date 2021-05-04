import styled from 'styled-components';
import interpolate from 'color-interpolate';

export const Choice = styled.div.attrs(
  ({ availability, chosen }: { availability?: number; chosen?: boolean }) => {
    const colormap = interpolate(['#fcd2d2', '#ffeccf', '#d1ffd4']);
    const style: any = {};
    if (chosen) {
      style.border = '4px solid green';
    }
    style.backgroundColor =
      Number(availability) > 0 ? colormap(Number(availability)) : '#ccc';
    return { style };
  },
)<{ availability?: number; chosen?: boolean }>`
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
      Number(availability) > 0 ? '0 0 3px #666' : 'none'};
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
  padding: 8px 8px 4px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
`;

export const Places = styled.div`
  font-size: 12px;
  color: #333;
  padding: 8px;
`;
