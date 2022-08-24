import React, { useState, useRef, forwardRef } from 'react'
import { Form, Input, Select, Button } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';

function FormList(prop, ref) {

  const formElement = useRef(null)

  const { Option } = Select;

  const [regions, setregions] = useState([])

  const [roles, setroles] = useState([])

  const [isDisable, setisDisable] = useState(false)

  const [add, setadd] = useState({})

  const [patchData, setpatchData] = useState({})

  const valueChange = () => {
    if (prop.state === 'add') {

      const user = formElement.current.getFieldsValue()

      if (user.roleId === '超级管理员') {
        user.roleId = 1
      } else if (user.roleId === '区域管理员') {
        user.roleId = 2
      } else {
        user.roleId = 3
      }

      user.roleState = true
      user.default = false
      setadd(user)
    } else {
      const userpatch = formElement.current.getFieldsValue()

      userpatch.default = false
      userpatch.roleState = true

      setpatchData(userpatch)
    }

  }

  const user = localStorage.getItem('token')
  const { roleId, id, region } = JSON.parse(user)

  useEffect(() => {
    axios.get('/roles').then(
      res => setroles(res.data)
    )
  }, [])

  useEffect(() => {
    axios.get('/regions').then(
      res => {
        setregions(res.data)
      }
    )
  }, [])

  useEffect(() => {
    if (prop.state === 'edit') {

      if (patchData.username) {
        formElement.current.setFieldsValue(patchData)
      } else {
        prop.ediData.roleId = prop.ediData.role.roleName
        formElement.current.setFieldsValue(prop.ediData)
      }

    }
  }, [prop.ediData])

  const operate = () => {
    if (prop.state === 'add') {
      axios.post('/users', add).then(
        () => prop.renew()
      )
      formElement.current.resetFields()
      prop.show()
    } else {

      const newpatchData = { ...patchData }

      if (newpatchData.roleId == '超级管理员') {
        newpatchData.roleId = 1
      } else if (newpatchData.roleId == '区域管理员') {
        newpatchData.roleId = 2
      } else {
        newpatchData.roleId = 3
      }

      axios.patch(`/users/${prop.ediData.id}`, newpatchData).then(
        () => {
          prop.renew();
          setpatchData({})
        }
      )
      prop.showedit()
    }
  }

  const close = () => {
    if (prop.state === 'add') {
      formElement.current.resetFields()
      prop.show()
    } else {
      setpatchData({})
      setisDisable(false)
      prop.showedit()
    }
  }

  return (
    <Form
      onFinish={operate}
      onValuesChange={valueChange}
      ref={formElement}
      layout="vertical"
      name="form_in_modal"
      initialValues={{
        modifier: 'public',
      }}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请输入用户名!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: '请输入密码!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="region"
        label="区域"
        rules={!isDisable && [
          {
            required: true,
            message: '请输入区域!',
          },
        ]}
      >
        <Select disabled={isDisable}>
          {regions.map(item => {
            let flag = false
            if (roleId !== 1) {
               flag = item.title == region ? false : true
            }
            return <Option value={item.title} key={item.id} disabled={flag}>{item.title}</Option>
          })}
        </Select>
      </Form.Item>

      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: '请输入角色!',
          },
        ]}
      >
        <Select onChange={(value) => {
          if (value == '超级管理员') {
            formElement.current.setFieldsValue({ region: '' })
            valueChange()
            setisDisable(true)
          } else {
            setisDisable(false)
          }
        }}>
          {roles.map(item => {
            let flag = false
            if (roleId == 2) {
               flag = item.roleName == '区域编辑' ? false : true
            } 
            return <Option value={item.roleName} key={item.id} disabled={flag}>{item.roleName}</Option>
          })}
        </Select>
      </Form.Item>

      <div style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit" style={{ marginRight: "20px" }}>
          {prop.state === 'add' ? '添加' : '更新'}
        </Button>
        <Button htmlType="button" onClick={close} ref={ref}
        >取消</Button>
      </div>
    </Form>
  )
}

export default forwardRef(FormList)