import './todoDrawer.less';

import {Drawer, DrawerProps} from 'antd';
import {useState} from 'react';

interface TodoDrawerProps {
  open: boolean;
  onClose: () => void;
}

const TodoDrawer = (props: TodoDrawerProps) => {
  const {open, onClose} = props;
  const [placement, setPlacement] = useState<DrawerProps['placement']>('right');

  return (
    <Drawer
      title="Drawer with extra actions"
      placement={placement}
      width={600}
      onClose={onClose}
      open={open}
      autoFocus={true}
      closeIcon={<div>关闭</div>}
      mask={false}
      className="todo-drawer-container"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
};

export default TodoDrawer;
