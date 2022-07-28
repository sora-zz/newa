import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './SideMenu.css'
import {
  FormOutlined,
  HomeOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { Sider } = Layout;
const items = [
  getItem('首页 ', '/home', <HomeOutlined />),
  getItem('用户管理', 'sub1', <TeamOutlined />, [
    getItem('用户列表', '/userlist'),                    
  ]),
  getItem('权限管理', 'sub2', <FormOutlined />, [
    getItem('角色列表', '/rolelist'), 
    getItem('权限列表', '/rightlist')
  ])
];

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  }; 
}

function SideMenu() {
  
  const [isCollapsed] = useState(false);
  const nav = useNavigate()
  return (
    <Sider trigger={null} collapsible collapsed={isCollapsed}>
        <div className="logo">新闻发布管理系统</div>
        <Menu theme="dark" defaultSelectedKeys={['/home']} mode="inline" items={items} 
        onClick={(item) => {
          // console.log(item.key)
          nav(item.key)
        }}
        />
      </Sider>
  )
}

export default SideMenu
