import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './SideMenu.css'
import {
  WalletOutlined,
  HomeOutlined,
  TeamOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import axios from 'axios';
const { Sider } = Layout;
// const items = [
//   getItem('首页 ', '/home', <HomeOutlined />),
//   getItem('用户管理', 'sub1', <TeamOutlined />, [
//     getItem('用户列表', '/userlist'),                    
//   ]),
//   getItem('权限管理', 'sub2', <FormOutlined />, [
//     getItem('角色列表', '/rolelist'), 
//     getItem('权限列表', '/rightlist')
//   ])
// ];

const iconList = {
  '/home': <HomeOutlined />,
  '/user-manage': <TeamOutlined />,
  '/right-manage': <WalletOutlined />,
  '/news-manage': <CreditCardOutlined />,
  '/audit-manage': <CheckCircleOutlined />,
  '/publish-manage': <UnorderedListOutlined />,
}

function getItem1(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}

function getItem(label, key, icon, children) {
  return {
    key,
    children,
    label,
    icon
  };
}

function SideMenu() {

  const [isCollapsed] = useState(false);
  const [menu, setMenu] = useState([])
  const nav = useNavigate()
  const current = useLocation()

  useEffect(() => {
    axios.get('http://localhost:3006/rights?_embed=children').then(
      res => {
        // console.log(res.data);
        setMenu(res.data)
      }
    )
  }, [])

  const items = menu.map(data => {

    if (data.children.length == 0) {

      return getItem1(data.title, data.key, iconList[data.key])

    } else {

      let child = []
      data.children.map((item => {

        if (item.pagepermisson) {
          child.push(getItem(item.title, item.key))
        }

      }))
      return getItem(data.title, data.key, iconList[data.key], child)
    }

  })

  return (
    <Sider trigger={null} collapsible collapsed={isCollapsed} style={{overflow: 'auto',
    height: '100vh',
   }}>   
        <div className="logo">新闻发布管理系统</div>
        <Menu  theme="dark" defaultSelectedKeys={current.pathname} mode="inline" items={items} 
        defaultOpenKeys={['/'+current.pathname.split('/')[1]]}
          onClick={(item) => {
            nav(item.key)
          }}
        />
    </Sider>
  )
}

export default SideMenu
