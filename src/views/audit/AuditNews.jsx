import React , { useState, useEffect }from 'react'
import axios from 'axios'
import { Space, Table, Button, Tooltip,notification} from 'antd';
import { Link } from 'react-router-dom';
import {
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';

function AuditNews() {

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
    axios.get(`/news?auditState=1`).then(
      res => setdata(res.data)
    )}else if(roleId == 2){
      axios.get(`/news?auditState=1&region=${region}`).then(
      res => setdata(res.data)
      )}
  }

  useEffect(() => {
    renew()
  }, [])

  const okHandler = (item) => {
    axios.patch(`/news/${item.id}`,{
      auditState:2,
      publishState:1
    }).then(
      () => {
        renew();
        notification.open({
          placement: 'top',
          duration: 2,
          description:
            '已通过审核'
        })
      }
    )
  }

  const noHandler = (item) => {
    axios.patch(`/news/${item.id}`,{
      auditState:3
    }).then(
      () => {
        renew();
        notification.open({
          placement: 'top',
          duration: 2,
          description:
            '未通过审核'
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
          <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={()=>okHandler(item)}/>
          </Tooltip>
          <Tooltip >
          <Button type="primary" danger shape="circle" icon={<CloseOutlined />} onClick={()=>noHandler(item)}/>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey={(item) => item.id} />
  )
}

export default AuditNews
