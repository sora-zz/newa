import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, Divider, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, PieChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as echarts from 'echarts';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { BarChart, PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import _ from 'lodash'

const { Meta } = Card;

function Home() {

  const user = localStorage.getItem('token')
  const { username, region, role: { roleName } } = JSON.parse(user)
  const [viewData, setviewData] = useState()
  const [likeData, setlikeData] = useState()
  const barRef = useRef()
  const pieRef = useRef()
  const [categories, setcategories] = useState([])

  useEffect(() => {
    let viewArr = []
    let likeArr = []

    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(
      (res) => {
        res.data.forEach(item => {
          viewArr.push(item)
        })
        setviewData(viewArr)
      }
    )

    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(
      (res) => {
        res.data.forEach(item => {
          likeArr.push(item)
        })
        setlikeData(likeArr)
      }
    )

  }, [])

  useEffect(() => {
    echarts.use([GridComponent, BarChart, CanvasRenderer]);

    var barChart = echarts.init(barRef.current);
    var baroption;

    axios.get('/news?publishState=2&_expand=category').then(
      res => {
        setcategories(res.data)
        const reGroup = _.groupBy(res.data, item => item.category.title)
        const xArr = []
        const yArr = []

        for (var key in reGroup) {
          xArr.push(key)
          yArr.push(reGroup[key].length)
        }

        baroption = {
          title: {
            text: '新闻分类图示',

          },
          xAxis: {
            type: 'category',
            data: xArr,
            axisTick: {
              interval: 0
            }
          },
          yAxis: {
            type: 'value',
            minInterval: 1
          },
          series: [
            {
              data: yArr,
              type: 'bar'
            }
          ]
        };

        baroption && barChart.setOption(baroption);

        window.onresize = barChart.resize

      }

    )
  }, [])

  const [visible, setVisible] = useState(false);
  const [flag, setflag] = useState(false)

  const showDrawer = () => {
    setVisible(true);
    setflag(true)
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (flag == true) {
      const perArr = categories.filter(item => item.author == username)
      const perCateArr =  _.groupBy(perArr, item => item.category.title)
      const perData = []

      for(let key in perCateArr){
        perData.push({value:perCateArr[key].length,name:key})
      }
      
      echarts.use([
        TitleComponent,
        TooltipComponent,
        LegendComponent,
        PieChart,
        CanvasRenderer,
        LabelLayout
      ]);

      var pieChart = echarts.init(pieRef.current);
      var pieoption;

      pieoption = {
        title: {
          text: '个人新闻数据分析',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '发布数量',
            type: 'pie',
            radius: '50%',
            data:perData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      pieoption && pieChart.setOption(pieoption);
    }

  }, [flag])

  return (
    <>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card >
              <Divider orientation="left" style={{
                color: '	#000000',
                fontFamily: 'Microsoft YaHei',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 'bold',
                opacity: '65%'
              }}>用户最常浏览</Divider>
              <List
                size="small"
                dataSource={viewData}
                renderItem={item => <List.Item style={{ fontSize: '18px' }} >
                  <a href={`http://localhost:3000/#/news-manage/preview/${item.id}`}>
                    {item.title}
                  </a>
                </List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card >
              <Divider orientation="left" style={{
                color: '	#000000',
                fontFamily: 'Microsoft YaHei',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 'bold',
                opacity: '65%'
              }}>用户点赞最多</Divider>
              <List
                size="small"
                dataSource={likeData}
                renderItem={item => <List.Item style={{ fontSize: '18px' }} >
                  <a href={`http://localhost:3000/#/news-manage/preview/${item.id}`}>
                    {item.title}
                  </a>
                </List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              style={{
                width: 300,
              }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <PieChartOutlined key="setPieChartting" onClick={showDrawer} />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={(region == '' ? '全球' : region) + '的' + roleName}
              />
            </Card>
          </Col>
        </Row>
        <Drawer title={[<span style={{
          color: '	#000000',
          fontFamily: 'Microsoft YaHei',
          fontSize: '18px',
          fontStyle: 'normal',
          fontWeight: 'bold',
          opacity: '65%'
        }}>个人新闻数据分析</span>]}
          placement="right"
          onClose={onClose} visible={visible}
          contentWrapperStyle={{ width: '40%' }}

        >
          <div ref={pieRef} style={{ width: '100%', height: '700px' }}></div>
        </Drawer>
      </div>

      <div ref={barRef} style={{ width: '100%', height: '500px', padding: '30px' }}></div>
    </>
  )
}

export default Home