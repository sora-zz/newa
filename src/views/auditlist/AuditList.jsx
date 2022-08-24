import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Space, Table, Tag, Button, Tooltip, notification } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function AuditList() {

  const nav = useNavigate()
  const user = localStorage.getItem('token')
  const { roleId, region, username } = JSON.parse(user)
  const [data, setdata] = useState()
  const [newsCategories, setnewsCategories] = useState([])

  const renew = () => {
    if(roleId == 1){
      axios.get(`/news?auditState_ne=0&publishState_lte=1`).then(
        res => setdata(res.data)
      )
    }else if(roleId == 2){
      axios.get(`/news?auditState_ne=0&publishState_lte=1&region=${region}`).then(
        res => setdata(res.data)
      )
    }else{
      axios.get(`/news?auditState_ne=0&publishState_lte=1&author=${username}`).then(
        res => setdata(res.data)
      )
    }
  }

  useEffect(() => {
    renew()
  }, [])

  const audit = {
    1: '审核中',
    2: '审核通过',
    3: '审核不通过'
  }


  useEffect(() => {
    axios.get('/categories').then(
      res => setnewsCategories(res.data)
    )
  }, [])

  const colorHandler = (num) => {
    if (num == 1) {
      return 'orange'
    } else if (num == 2) {
      return 'green'
    } else {
      return 'red'
    }

  }

  const operHandler = (num) => {
    if (num == 1) {
      return '撤销'
    } else if (num == 2) {
      return '发布'
    } else {
      return '修改'
    }

  }

  const btnHandler = (item) => {
    if (item.auditState == 1) {
      axios.patch(`/news/${item.id}`, {
        auditState: 0
      }).then(
        () => {
          renew();
          notification.open({
            placement: 'top',
            duration: 2,
            description:
              '已撤销,点击此消息跳至草稿箱...',
            onClick: () => {
              nav('/news-manage/draft')
            }
          })
        }
      )
    } else if (item.auditState == 2) {
      axios.patch(`/news/${item.id}`, {
        publishState: 2,
        publishTime:Date.now()
      }).then(
        () =>{ renew();
          notification.open({
            placement: 'top',
            duration: 2,
            description:
              '已发布,点击此消息跳至已发布新闻列表...',
            onClick: () => {
              nav('/publish-manage/published')
            }
          })}
        )
    } else {
      nav(`/news-manage/update/${item.id}`)
    }
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => (
        <>
          <Tag key={auditState} color={colorHandler(auditState)}>
            {audit[auditState]}
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
            <Button type="primary" onClick={() => btnHandler(item)}>{operHandler(item.auditState)}</Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey={(item) => item.id} />
  )
}

export default AuditList
