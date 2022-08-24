import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import { Layout, Spin } from 'antd';
import './NewsBox.css'
import store from '../../redux/store'

const { Content } = Layout;

function NewsBox() {

  const [flag, setflag] = useState()

  store.subscribe(() => {

    for( var loading in store.getState()){
      setflag(store.getState()[loading]) 
    }
  })


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
            overflow: 'auto'
          }}
        >
          <Spin tip="加载中..." spinning={flag}>
            <Outlet />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  )
}

export default NewsBox
