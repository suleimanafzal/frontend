import React, { useState, useEffect } from 'react';
import { Upload, Button, Input, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import API from '../../api';

function getBase64(file) {
  if (file)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  return new Promise((resolve, reject) => {
    reject();
  });
}
function AddCategory() {
  const [loader, setLoader] = useState(false);
  const [fieldData, setFieldData] = useState({ name: '', description: '' });
  const [file, setFile] = useState();
  const [url, setUrl] = useState();
  const history = useHistory();
  const [state, setState] = useState({
    loader: false,
    error: false,
    message: '',
  });
  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };
  const sendData = () => {
    if (
      fieldData.name === '' ||
      fieldData.name === null ||
      !fieldData.name ||
      fieldData.name.trim() === ''
    ) {
      setState({
        ...state,
        error: true,
        message: 'Please enter category name',
      });
      return;
    }
    if (!file) {
      setState({
        ...state,
        error: true,
        message: 'Please select image for category',
      });
      return;
    }
    setLoader(true);
    const formData = new FormData();
    formData.append('name', fieldData.name);
    formData.append('image', file);
    formData.append('description', fieldData.description);
    axios
      .post(API.addCategory, formData)
      .then((res) => {
        if (res.data.success) {
          history.push(
            '/home-services/allCategories?category=all&state=all&city=&name=',
          );
        }
        setLoader(false);
      })
      .catch((e) => {
        if (e.response) {
          setState({ error: true, message: e.response.data.error });
        } else {
          setState({ error: true, message: 'Server Error' });
        }
        setLoader(false);
      });
  };
  useEffect(() => {
    if (state.error) {
      notification.open({
        message: state.message,
        type: 'error',
      });
      setState({ ...state, error: false });
    }
  }, [state.error]);

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Add Category</h2>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1', marginRight: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Category Image:</span>
            <Upload
  style={{ marginTop: '2rem', border: '1px solid #d9d9d9', borderRadius: '8px', backgroundColor: '#fafafa' }}
  accept='image/*'
  showUploadList={false}
  customRequest={dummyRequest}
  listType='picture-card'
  onChange={(event) => {
    setFile(event.file.originFileObj);
    getBase64(event.file.originFileObj)
      .then((data) => setUrl(data))
      .catch((e) => console.log(e));
  }}
  name='file'
>
  {url ? (
    <img src={url} alt='avatar' style={{ width: '100%' }} />
  ) : (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )}
</Upload>

          </div>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Category Name:</span>
            <Input
              style={{ marginTop: '0.5rem', borderRadius: '10px' }}
              value={fieldData.name}
              onChange={(e) => {
                setFieldData({ ...fieldData, name: e.target.value });
              }}
              placeholder='Category Name'
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Category Description:</span>
            <Input.TextArea
              style={{ marginTop: '0.5rem', borderRadius: '10px' }}
              value={fieldData.description}
              onChange={(e) => {
                setFieldData({ ...fieldData, description: e.target.value });
              }}
              placeholder='Category Description'
            />
          </div>
        </div>
        <div style={{ flex: '1', maxWidth: '300px' }}>
          <img src='https://img.freepik.com/free-vector/illustration-characters-fixing-cogwheel_53876-40796.jpg?t=st=1713456531~exp=1713460131~hmac=6d18b4158b23225685eca92e3e0d2b40ba7b847b08f6e9d7177381add71921d7&w=740' alt='categories' style={{ width: '100%' }} />
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Button onClick={() => history.push('/home-services/allCategories?category=all&state=all&city=&name=')} style={{ marginRight: '1rem', borderRadius: '10px' }}>Cancel</Button>
        <Button style={{ backgroundColor: "#102C57", borderRadius: '10px' }} loading={loader} type='primary' onClick={sendData}>Submit</Button>
      </div>
    </>
  );
}

export default AddCategory;
