import React, { useState } from 'react'
import { Space, Table, Tag, Button, Tooltip, Modal } from 'antd';
import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useEffect } from 'react';
import axios from 'axios';

function RightList() {

  const [data, setdata] = useState([])

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const [delData, setdelData] = useState('')

  const getItem = (i) => {
    setdelData(i)
    showModal()
  }

  const handleOk = () => {
    setIsModalVisible(false);
    console.log(delData);
    setdata(data.filter(item => item.id !== delData.id ))
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    axios.get('http://localhost:3006/rights?_embed=children').then(
      res => {
        const rightsData = res.data
        rightsData[0].children = ''
        setdata(rightsData);
      }
    )
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      key: 'key',
      dataIndex: 'key',
      render: (_, { key }) => (
        <>
          <Tag key={key} color={'green'}>
            {key}
          </Tag>
        </>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (item) => (
        <Space size="middle">
          <Tooltip >
            <Button shape="circle" icon={<DeleteOutlined />} danger onClick={() => getItem(item)} />
          </Tooltip>
          <Modal title="温馨提示" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
            maskStyle={{ backgroundColor: 'rgba(0,0,0,.2)' }}>
            <p>确定删除此权限吗？</p>
          </Modal>
          <Tooltip >
            <Button shape="circle" icon={<EditOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];
  // const data = [
  //   {
  //     id: '1',
  //     title: 32,
  //     key: ['nice'],
  //   },
  // ];

  return (
    <Table columns={columns} dataSource={data} pagination={{ pageSize: 3 }} />
  )
}

export default RightList