import React, { useState } from 'react'
import './TopHeader.css'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Space, Avatar } from 'antd';
const { Header } = Layout;
const menu = (
  <Menu
    items={[
      {
        key: '1',
        label: ('超级管理员'),
      },
      {
        key: '4',
        danger: true,
        label: '退出登录',
      },
    ]}
  />
);


function TopHeader() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {isCollapsed ? <MenuUnfoldOutlined className='icon' onClick={() => setIsCollapsed(!isCollapsed)} />
        : <MenuFoldOutlined className='icon' onClick={() => setIsCollapsed(!isCollapsed)} />
      }
      <div className='right'>
        <span className='welcome' >欢迎admin回来</span>
        <Dropdown overlay={menu}>
          <a onClick={(e) => e.preventDefault()}>
            <Space className='hoverme'>
              <Avatar size={40} icon={<UserOutlined />} />
            </Space>
          </a>
        </Dropdown>
      </div>

    </Header>
  )
}

export default TopHeader
