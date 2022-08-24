import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Space, Table, Button, Tooltip, notification } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function UnpublishedNews() {

  const nav = useNavigate()
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
    if(roleId == 1){
      axios.get(`/news?auditState=2&publishState=1`).then(
        res => setdata(res.data)
      )
    }else if(roleId == 2){
      axios.get(`/news?auditState=2&publishState=1&region=${region}`).then(
        res => setdata(res.data)
      )
    }else{
      axios.get(`/news?auditState=2&publishState=1&author=${username}`).then(
        res => setdata(res.data)
      )
    }
   
  }

  useEffect(() => {
    renew()
  }, [])

  const btnHandler = (item) => {
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(() => {
      renew();
      notification.open({
        placement: 'top',
        duration: 2,
        description:
          '已发布,点击此消息跳至已发布新闻列表...',
        onClick: () => {
          nav('/publish-manage/published')
        }
      })
    }
    )
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
            >
              发布
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

export default UnpublishedNews
