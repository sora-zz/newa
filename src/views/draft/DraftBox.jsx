import React, { useState } from 'react'
import { Space, Table, Button, Tooltip, Modal,notification } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function DraftBox() {

  const nav = useNavigate()
  const [isDel, setisDel] = useState(false)
  const [isUp, setisUp] = useState(false)
  const [data, setData] = useState([])
  const [cate, setcate] = useState([])
  const [delData, setdelData] = useState({})
  const [ediData, setediData] = useState({})

  const user = localStorage.getItem('token')
  const { roleId, username, region } = JSON.parse(user)

  useEffect(() => {
    axios.get('/categories').then(
      res => setcate(res.data)
    )
  }, [])

  const getdelData = (item) => {
    setisDel(true)
    setdelData(item)
  }

  const categoryName = (id) => {
    let arr = []
    cate.forEach(item => {
      if (item.id == id) {
        return arr.push(item.title)
      }
    })
    return arr
  }

  const renew = () => {
    axios.get(`/news?auditState=0&author=${username}`).then(
      res => setData(res.data)
    )
  }


  useEffect(() => {
    renew()
  }, [])

  const delOk = () => {
    axios.delete(`/news/${delData.id}`).then(
      renew()
    )
    setisDel(false)
  }

  const getEditData = (item) => {
    setediData(item)
    nav(`/news-manage/update/${item.id}`)
  }

  const [auditData, setauditData] = useState()

  const toAudit = () => {
    setisUp(false)
    axios.patch(`/news/${auditData}`, {
      auditState: 1
    }).then(
      () => {
        renew();
        notification.open({
          placement: 'top',
          duration: 2,
          description:
            '已提交审核,点击此消息跳至审核列表...',
          onClick: () => {
            nav('/audit-manage/list')
          }
        })
      }
    )
  }

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) =>
        <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>

    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'categoryId',
      render: (categoryId) => categoryName(categoryId)
    },
    {
      title: '操作',
      render: (item) => (
        <Space size="middle">
          <Tooltip >
            <Button shape="circle" icon={<DeleteOutlined />} danger
              onClick={() => getdelData(item)}
            />
          </Tooltip>
          <Modal title="温馨提示" visible={isDel} onOk={delOk} onCancel={() => setisDel(false)}
            okText="确认"
            cancelText="取消"
            maskStyle={{ backgroundColor: 'rgba(0,0,0,.1)' }}
          >
            <p>确定删除此条新闻草稿吗？</p>
          </Modal>
          <Tooltip >
            <Button shape="circle" icon={<EditOutlined />}
              onClick={() => getEditData(item)}
            />
          </Tooltip>
          <Tooltip >
            <Button shape="circle" icon={<UploadOutlined />} type="primary"
              onClick={
                () => {
                  setisUp(true)
                  setauditData(item.id)
                }}
            />
          </Tooltip>
          <Modal title="温馨提示" visible={isUp} onOk={toAudit} onCancel={() => setisUp(false)}
            okText="确认"
            cancelText="取消"
            maskStyle={{ backgroundColor: 'rgba(0,0,0,.1)' }}
          >
            <p>确定提交审核吗？</p>
          </Modal>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} rowKey={(item) => item.id} />
    </div>
  )
}

export default DraftBox
