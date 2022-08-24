import { Button, message, Steps, PageHeader, Form, Input, Select, notification } from 'antd';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import './WriteNews.css'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { useNavigate } from 'react-router-dom';

function WriteNews(prop) {

  const nav = useNavigate()

  const newsForm = useRef()
  const refEditor = useRef()

  const { Option } = Select;
  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

  const [form] = Form.useForm();

  const { Step } = Steps;
  const steps = [
    {
      title: '基本信息',
      description: "新闻标题，新闻分类",
    },
    {
      title: '新闻内容',
      description: "新闻主题内容",
    },
    {
      title: '新闻提交',
      description: "保存草稿或提交审核",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [formInfo, setformInfo] = useState({})
  const [editContent, seteditContent] = useState('')

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const [newsCategories, setnewsCategories] = useState([])

  useEffect(() => {
    axios.get('/categories').then(
      res => setnewsCategories(res.data)
    )
  }, [])

  const nextStep = () => {
    if (current == 0) {
      newsForm.current.validateFields().then(
        () => next(),
        setformInfo(newsForm.current.getFieldValue())
      )
    } else {
      if (editContent == '' || editContent.trim() == '<p></p>') {
        message.error('新闻内容不能为空')
      } else {
        next()
      }
    }
  }

  const user = localStorage.getItem('token')
  const { roleId, region, username } = JSON.parse(user)
  const [isDisable, setisDisable] = useState(false)
  const [isOk, setisOk] = useState(true)

  const btnHandler = (flag) => {
    if (flag == 0) {
      notification.open({
        placement: 'top',
        duration: 2,
        description:
          '已保存草稿,点击此消息跳至草稿箱...',
        onClick: () => {
          nav('/news-manage/draft')
        }
      })
    } else {

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
    setisDisable(true)
    setisOk(false)
    if (!prop.id) {
      axios.post('/news', {
        ...formInfo,
        content: editContent,
        region: region == '' ? '全球' : region,
        author: username,
        roleId: roleId,
        auditState: flag,
        publishState: 0,
        createTime: Date.now(),
        star: 0,
        view: 0,
        publishTime: null
      })
    } else {
      axios.patch(`/news/${prop.id}`, {
        ...newsForm.current.getFieldsValue(),
        content: editContent.replace(/<.+?>/g, '').replace(/&nbsp;/ig, '').replace(/\s/ig, ''),
        auditState: flag,
        createTime: Date.now(),
      })
    }
  }

  const editorRenew = (editorState) => {
    setEditorState(editorState)
  }

  const back = () => {
    if (!prop.id) {
      setCurrent(0)
      setformInfo({})
      seteditContent('')
      setisDisable(false)
      setisOk(true)
      newsForm.current.resetFields()
      editorRenew()
    } else {
      setformInfo({})
      seteditContent('')
      setisDisable(false)
      setisOk(true)
      newsForm.current.resetFields()
      editorRenew()
      nav('/audit-manage/list')
    }
  }

  useEffect(() => {
    if (prop.data) {
      newsForm.current.setFieldsValue({ title: prop.data.title, categoryId: prop.data.categoryId })
      seteditContent(prop.data.content)
      const initData = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            text: prop.data.content.replace(/<.+?>/g, '').replace(/&nbsp;/ig, '').replace(/\s/ig, '')
          },
        ],
      })

      const initState = EditorState.createWithContent(initData,);
      setEditorState(initState)

    }
  }, [prop.data])

  const [editorState, setEditorState] = useState();

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title={prop.id ? '修改新闻' : "撰写新闻"}
        onBack={prop.id ? () => window.history.back() : null}
      />
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} description={item.description} />
        ))}
      </Steps>
      <div className="steps-content">

        <Form {...layout} form={form}
          ref={newsForm}
          style={{ display: (current == 0 ? 'block' : 'none') }}>
          <Form.Item
            name="title"
            label="新闻标题"
            rules={[
              {
                required: true,
                message: '新闻标题是必填项'
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="新闻分类"
            rules={[
              {
                required: true,
                message: '新闻分类是必选项'
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Select
              placeholder="请选择新闻分类"
              allowClear
              rules={[
                {
                  required: true,
                },
              ]}
            >
              {newsCategories.map(item => {
                return <Option value={item.id} key={item.id}>{item.title}</Option>
              })}
            </Select>
          </Form.Item>
        </Form>

        {current == 1 && <div style={{ overflow: 'auto', width: '70%' }}> <Editor
          ref={refEditor}
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={editorRenew}
          onBlur={() => { seteditContent(draftToHtml(convertToRaw(editorState.getCurrentContent()))) }}
        /></div>}

        {current == 2 && <h2>您已完成新闻内容撰写，请选择下列按钮完成操作</h2>}

      </div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={nextStep} style={{ margin: '0 8px', }}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <>
            <Button type="primary" onClick={() => btnHandler(0)}
              disabled={isDisable}
              style={{ margin: '0 8px', }}>
              保存草稿
            </Button>
            <Button danger type="primary" onClick={() => btnHandler(1)}
              disabled={isDisable}
              style={{ margin: '0 8px', }}>
              提交审核
            </Button>
            <Button style={{ position: 'fixed', right: '100px' }}
              onClick={back}
              type="primary"
              disabled={isOk}
            >
              完成
            </Button>
          </>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px', }}
            disabled={isDisable}
            onClick={() => prev()}
            type="primary"
          >
            上一步
          </Button>
        )}
      </div>
    </div>
  )
}

export default WriteNews
