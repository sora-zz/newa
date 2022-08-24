import React, { useState } from 'react'
import { Space, Table, Button, Tooltip, Modal, Tree } from 'antd';
import {
  DeleteOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { useEffect } from 'react';
import axios from 'axios';

function RoleList() {

  const [data, setdata] = useState([])

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [shoeTree, setshoeTree] = useState(false)

  const [delData, setdelData] = useState({})

  const [ediData, setediData] = useState({})

  const [currentRights, setcurrentRights] = useState({})

  const editData = (item) => {
    setediData(item)
    setcurrentRights(item.rights)
    setshoeTree(true)
  }

  const showModal = (item) => {
    setdelData(item)
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    axios.delete(`/roles/${delData.roleType}`)
    refresh()
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    setcurrentRights(checkedKeys)
  };

  const rightsChange = () => {
    console.log(ediData);
    console.log(currentRights);
    setshoeTree(false)
    axios.patch(`/roles/${ediData.id}`,{rights:currentRights})
    refresh()
  }

  const refresh = () => {
    axios.get('/roles').then(
      res => {
        setdata(res.data)
      }
    )
  }

  useEffect(() => {
    refresh()
  }, [])

  const [rightsData, setrightsData] = useState([])

  useEffect(() => {
    axios.get('/rights?_embed=children').then(
      res => {
        setrightsData(res.data)
      }
    )
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'roleType',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => (
        <Space size="middle">
          <Tooltip >
            <Button shape="circle" icon={<DeleteOutlined />} danger onClick={() => showModal(item)} />
          </Tooltip>
          <Modal title="温馨提示" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
            maskStyle={{ backgroundColor: 'rgba(0,0,0,.2)' }}>
            <p>确定删除此角色吗？</p>
          </Modal>
          <Tooltip >
            <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => editData(item)} />
          </Tooltip>
          <Modal visible={shoeTree} title="角色权限编辑" maskStyle={{ backgroundColor: 'rgba(0,0,0,.2)' }}
            onOk={rightsChange } onCancel={() => setshoeTree(false)}
            okText="确认"
            cancelText="取消">
            <Tree
              checkable
              checkedKeys={currentRights}
              onCheck={onCheck}
              treeData={rightsData}
              checkStrictly
            /></Modal>
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey={(item) => item.roleType} />
  )
}

export default RoleList