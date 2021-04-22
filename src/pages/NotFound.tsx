import React from 'react';
import styled from 'styled-components';

const HTTPCat = styled.img`
  border: 12px solid white;
  border-radius: 12px;
`;

export default function NotFound(): JSX.Element {
  return <HTTPCat src="https://http.cat/404" />;
}
