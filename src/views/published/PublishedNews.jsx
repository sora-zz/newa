import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Space, Table, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

function PublishedNews() {

  const [newsCategories, setnewsCategories] = useState([])
  const [data, setdata] = useState()
  const user = localStorage.getItem('token')
  const { roleId, region, username } = JSON.parse(user)

  useEffect(() => {
    axios.get('/categories').then(
      res => setnewsCategories(res.data)
    )
  }, [])

  const renew = () => {
    axios.get(`/news?publishState=2`).then(
      res => setdata(res.data)
    )
  }

  useEffect(() => {
    renew()
  }, [])

  const btnHandler = (item) => {
    axios.patch(`/news/${item.id}`, {
      publishState: 3
    }).then(
      () => renew()
    )
  }

  const flag = (item) => {
    let flag = true
    if (roleId == 1 || (item.region == region && roleId == 2)) {
      flag = false
    }
    return flag
  }

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (text, item) => <Link to={`/news-manage/preview/${item.id}`}>{text}</Link>,
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'categoryId',
      render: (categoryId) => {
        if (newsCategories.length !== 0) {
          return newsCategories.find(item => item.id == categoryId).value
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (item) => (
        <Space size="middle">
          <Tooltip >
            <Button type="primary"
              onClick={() => btnHandler(item)}
              disabled={flag(item)}
            >
              下线
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey={(item) => item.id} />
  )
}

export default PublishedNews
