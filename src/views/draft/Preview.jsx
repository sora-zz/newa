import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import { useParams } from 'react-router-dom';
import './Preview.css'
import axios from 'axios';
import moment from 'moment'

function Preview() {
  const { id } = useParams()
  const [data, setdata] = useState(null)

  useEffect(() => {
    axios.get(`/news/${id}?_expand=category&_expand=role`).then(
      res => setdata(res.data)
    )
  }, [])

  const audit = {
    0:'未审核',
    1:'审核中',
    2:'审核通过',
    3:'审核未通过'
  }

  const publish = {
    0:'未发布',
    1:'待发布',
    2:'已上线',
    3:'已下线',
  }

  return (

    data && <>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={data.title}
        subTitle={data.category.value}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{data.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{moment(data.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{data.publishTime?
           moment(data.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="区域">{data.region}</Descriptions.Item>
          <Descriptions.Item label="审核状态"><span style={{color:'red'}}>{audit[data.auditState]}</span></Descriptions.Item>
          <Descriptions.Item label="发布状态"><span style={{color:'red'}}>{publish[data.publishState]}</span></Descriptions.Item>
          <Descriptions.Item label="访问数量"><span style={{color:'green'}}>{data.view}</span></Descriptions.Item>
          <Descriptions.Item label="点赞数量"><span style={{color:'green'}}>{data.star}</span></Descriptions.Item>
          <Descriptions.Item label="评论数量"><span style={{color:'green'}}>0</span></Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div className="site-page-header-ghost-wrapper" 
      dangerouslySetInnerHTML={{__html:data.content}}></div>
    </>

  )
}

export default Preview
