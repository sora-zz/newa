import { Form, Input, Table, Space, Button, Tooltip, Modal } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import './NewsCategory.css'
import axios from 'axios'
import {
  DeleteOutlined
} from '@ant-design/icons';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


function NewsCategory() {

  const [dataSource, setDataSource] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [delData, setdelData] = useState()

  const renew = () => {
    axios.get('/categories').then(
      res => {
        setDataSource(res.data);
        setCount(res.data.length + 1)
      }
    )
  }

  const handleOk = () => {
    axios.delete(`/categories/${delData.id}`).then(
      () => {
        renew()
        setIsModalVisible(false)
      }
    )
  }

  useEffect(() => {
    renew()
  }, [])

  const delHandler = (item) => {
    setIsModalVisible(true)
    setdelData(item)
  }

  const defaultColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '新闻类别',
      dataIndex: 'title',
      editable: true,
    },
    {
      title: '操作',
      render: (item) => (
        <Space size="middle">
          <Tooltip >
            <Button shape="circle" icon={<DeleteOutlined />} danger onClick={() => delHandler(item)} />
          </Tooltip>
          <Modal title="温馨提示" visible={isModalVisible}
            onOk={handleOk} onCancel={() => setIsModalVisible(false)}
            okText="确认"
            cancelText="取消"
            maskStyle={{ backgroundColor: 'rgba(0,0,0,.2)' }}>
            <p>确定删除此类别吗？</p>
          </Modal>
        </Space>
      )
    },
  ];

  const [count, setCount] = useState();

  const handleAdd = () => {
    const newData = { id: count, title: '', value: '' };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row, value: row.title });
    let prevData = []
    setDataSource(prevState => prevData = [...prevState]);
    setDataSource(newData);

    if(prevData[prevData.length - 1].title !== ''){
      const editData = newData.filter(item => !prevData.includes(item))
      axios.patch(`/categories/${editData[0].id}`, {
        title: editData[0].title,
        value: editData[0].title
      })
    }else{
      axios.post('/categories',newData[newData.length - 1])
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });


  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        增加类别
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey={item => item.id}
      />
    </div>
  )
}

export default NewsCategory


