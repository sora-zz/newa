import React, { useState, useRef } from 'react'
import { Space, Table, Button, Tooltip, Modal, Switch } from 'antd';
import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useEffect } from 'react';
import axios from 'axios'
import './UserList.css'
import FormList from '../form/FormList'

function UserList() {

  const childref = useRef(null)

  const [show, setshow] = useState(false);

  const [data, setdata] = useState([])

  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleOk = () => {
    axios.delete(`/users/${delData.id}`).then(
      () => {
        setIsModalVisible(false);
        renew()
      }
    )
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const user = localStorage.getItem('token')
  const { roleId, id, region } = JSON.parse(user)

  const renew = () => {
    axios.get('/users?_expand=role').then(
      res => {
        if (roleId !== 1) {
          const newArr = res.data.filter(item => (item.roleId > roleId && item.region === region) || item.id === id)
          setdata(newArr)
        } else {
          setdata(res.data)
        }
      }

    )

  }

  const [delData, setdelData] = useState({})

  const delHandler = (item) => {
    setdelData(item)
    setIsModalVisible(true)
  }

  const switchHandler = (item, roleState) => {
    axios.patch(`/users/${item.id}`, { roleState: !roleState }).then(
      () => renew()
    )
  }

  const [edishow, setedishow] = useState(false)

  const [state, setstate] = useState('add')

  const [ediData, setediData] = useState({})

  const [filterData, setfilterData] = useState([])

  useEffect(() => {
    axios.get('/regions').then(
      res => {
        const regions = [{
          text: '全球',
          value: '全球'
        }]
        res.data.map(item => regions.push({ text: item.title, value: item.value }))
        setfilterData(regions)
      }
    )
  }, [])

  useEffect(() => {
    renew()
  }, [])

  const editHandler = (item) => {
    setedishow(true)
    setstate('edit')
    setediData(item)
  }

  const showedit = () => {
    setedishow(false)
  }

  const cancelHandler = () => {
    childref.current.click()
  }

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: filterData,
      onFilter: (value, record) => {
        if (value === '全球') {
          return record.region === ''
        }
        return record.region == value
      },
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => <Switch checked={roleState} disabled={item.default ||
        (id == item.id ? true : false)}
        onClick={() => switchHandler(item, roleState)} />
    },
    {
      title: '操作',
      render: (item) => (
        <Space size="middle">
          <Tooltip >
            <Button shape="circle" icon={<DeleteOutlined />} danger
              disabled={
                item.default
                ||
                (id == item.id ? true : false)
              }
              onClick={() => delHandler(item)} />
          </Tooltip>
          <Modal title="温馨提示" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
            maskStyle={{ backgroundColor: 'rgba(0,0,0,.1)' }}
          >
            <p>确定删除此用户吗？</p>
          </Modal>
          <Tooltip >
            <Button type="primary" shape="circle" icon={<EditOutlined />}
              disabled={
                item.default
                ||
                (id == item.id ? true : false)
              }
              onClick={() => editHandler(item)} />
          </Tooltip>
          <Modal
            visible={edishow}
            maskStyle={{ backgroundColor: 'rgba(0,0,0,.1)' }}
            title="更新用户信息"
            onCancel={cancelHandler}
            footer={null}
          >
            <FormList renew={renew} showedit={showedit} state={state} ediData={ediData}
              ref={childref} />
          </Modal>
        </Space>
      ),
    },
  ];

  const showadd = () => {
    setshow(false)
  }

  return (
    <>
      <Button type="primary" onClick={() => {
        setshow(true)
        setstate('add')
      }}>添加用户</Button>
      <Table columns={columns} dataSource={data} rowKey={(item) => item.id}
        locale={{
          filterConfirm: '确定',
          filterReset: '重置',
          emptyText: '暂无数据'
        }}
      />
      <Modal
        visible={show}
        title="添加用户信息"
        onCancel={showadd}
        footer={null}
        maskStyle={{ backgroundColor: 'rgba(0,0,0,.4)' }}>
        <FormList renew={renew} show={showadd} state={state} />
      </Modal>
    </>
  )
}

export default UserList