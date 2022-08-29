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
import store from '../redux/store'


const { Sider } = Layout;
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

  const [menu, setMenu] = useState([])
  const nav = useNavigate()
  const current = useLocation()
  const user = localStorage.getItem('token')
  const { roleId, role: { rights } } = JSON.parse(user)
  const [flag, setFlag] = useState()

  store.subscribe(() => {
    setFlag(store.getState()['collapseReceduer'])
  })

  useEffect(() => {
    axios.get('/rights?_embed=children').then(
      res => {
        setMenu(res.data)
      }
    )
  }, [])

  const items = menu.map(data => {

    if (roleId === 1 ? true : rights.includes(data.key)) {

      if (data.children.length == 0) {
        if (data.pagepermisson == 1) {
          return getItem1(data.title, data.key, iconList[data.key])
        }
      } else {

        let child = []
        data.children.map((item => {

          if (item.pagepermisson) {
            child.push(getItem(item.title, item.key))
          }

        }))
        return getItem(data.title, data.key, iconList[data.key], child)
      }
    }
  })

  return (
    <Sider trigger={null} collapsible collapsed={flag} style={{
      overflow: 'auto',
      height: '100vh',
    }}>
      <div className="logo">新闻发布管理系统</div>
      <Menu theme="dark" defaultSelectedKeys={current.pathname} mode="inline" items={items}
        defaultOpenKeys={['/' + current.pathname.split('/')[1]]} 
        onClick={(item) => {
          nav(item.key)
        }}
      />
    </Sider>
  )
}

export default SideMenu
