import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';

export default function Home(): JSX.Element {
  const history = useHistory();

  const onStartClick = () => {
    history.push('/start');
  };
  return (
    <Button type="primary" onClick={onStartClick}>
      (((o(*ﾟ▽ﾟ*)o)))
    </Button>
  );
}
