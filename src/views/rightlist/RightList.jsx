import React, { useState,useEffect } from 'react'
import { Space, Table, Tag, Button, Tooltip, Modal, Popover, Switch } from 'antd';
import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import axios from 'axios';

function RightList() {

  const [data, setdata] = useState([])

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const [delData, setdelData] = useState()

  const getItem = (i) => {
    setdelData(i)
    showModal()
  }

  const handleOk = () => {
    setIsModalVisible(false);
    if (delData.grade == 1) {
      axios.delete(`/rights/${delData.id}`)
      dataSrc()
    } else {
      axios.delete(`/children/${delData.id}`)
      dataSrc()
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const dataSrc = () => {
    axios.get('/rights?_embed=children').then(
      res => {
        const rightsData = res.data
        rightsData.forEach(element => {
          if (element.children.length == 0) {
            element.children = ''
          }
        });
        setdata(rightsData)
      }
    )
  };


  useEffect(() => {
    dataSrc()
  }, []);

  const switchHandler = (item) => {
    item.pagepermisson = item.pagepermisson == 1 ? 0 : 1
    if (item.grade == 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
      dataSrc()
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
      dataSrc()
    };
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
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
            <Popover content={
              <div style={{ textAlign: 'center' }}>
                <Switch checked={item.pagepermisson} onClick={() => switchHandler(item)} />
              </div>
            } title="导航配置项" trigger={item.pagepermisson === undefined ? '' : "click"}>
              <Button type="primary" shape="circle" icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined} />
            </Popover>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={data} />
  )
}

export default RightList