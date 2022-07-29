import React from 'react'
import { Outlet } from 'react-router-dom'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import { Layout } from 'antd';
import './NewsBox.css'
const { Content } = Layout;

function NewsBox() {
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow:'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default NewsBox
