import React, { useState } from 'react'
import './TopHeader.css'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import store from '../redux/store'

const { Header } = Layout;

function TopHeader() {

  const user = localStorage.getItem('token')
  const { username, role: { roleName } } = JSON.parse(user)

  const nav = useNavigate()

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <span >
              {roleName}
            </span>
          ),
        },
        {
          key: '4',
          danger: true,
          label: (
            <span onClick={() => {
              nav('/login')
              localStorage.removeItem('token')
            }}>
              退出登录
            </span>
          ),
        },
      ]}
    />
  );

  const [isCollapsed, setIsCollapsed] = useState(true);


  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {isCollapsed ? <MenuUnfoldOutlined className='icon' onClick={() => {
        setIsCollapsed(!isCollapsed);
        store.dispatch({ type: 'collapse',payload:true })
      }} />
        : <MenuFoldOutlined className='icon' onClick={() => {
          setIsCollapsed(!isCollapsed);
          store.dispatch({ type: 'collapse',payload:false })
        }} />
      }
      <div className='right'>
        <span className='welcome' >欢迎 <span style={{ color: '#1890ff' }}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar size={40} icon={<UserOutlined />} />
        </Dropdown>
      </div>

    </Header>
  )
}

export default TopHeader
