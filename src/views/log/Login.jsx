import React from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd';
import './Login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {

  const nav = useNavigate()

  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(
      res => {
        if (res.data.length === 0) {
          message.error('用户名或密码错误')
        } else {
          localStorage.setItem('token', JSON.stringify(res.data[0]))
          nav('/')
        }
      }
    )
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ backgroundColor: 'rgb(35,39,65)', height: '100%' }}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,.7)', width: "45%", height: '40%',
        position: 'fixed', left: '30%', top: '30%', display: 'flex', flexFlow: 'column',
        textAlign: 'center'
      }}>
        <div className='title'>全球新闻发布管理系统</div>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          // autoComplete="off"
          // initialValues={{
          //   modifier: 'public',
          // }}
        >
          <Form.Item style={{ width: '80%' }}
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item style={{ width: '80%' }}
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" style={{ marginLeft: '150px' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
