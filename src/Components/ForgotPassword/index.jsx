import React, { useState } from 'react';
import { Button, Input, Form, Switch, Divider, notification } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { SendOutlined } from '@ant-design/icons';
import axios from 'axios';
import Logo from '../../Layout/Logo';
import API from '../../api';

function SignIn() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const [form] = Form.useForm();
  const sendOtp = () => {
    setLoading(true);
    axios
      .post(API.sendOtp, form.getFieldsValue())
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          console.log(res.data.data);
          notification.open({
            message: res.data.message,
            type: 'success',
          });

          setLoading(false);
          history.push('/verifyOtp');
        } else {
          notification.open({
            message: res.data.message,
            type: 'error',
          });
        }
      })
      .catch((e) => {
        if (e.response) {
          notification.open({
            message: e.response.data.msg,
            type: 'error',
          });
        }
        setLoading(false);
        console.log(e.response);
      });
  };
  return (
    <div className='signin'>
      <div className='signin-form'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            right: '1rem',
          }}
        >
          <Logo /> <h1 className='title'>Serve US</h1>
        </div>
        <h2  style={{ fontSize: '28px', color: '#333', marginBottom: '0.5rem' }}  className='welcomeBack'>Welcome Back</h2>
        <p className='loginIntoAccount'>
          Enter your Email to Recover your Account
        </p>
        <div>
          <Form form={form} layout='vertical'>
            <Form.Item style={{ fontSize: '16px' }} label='Email' name='email'>
              <Input style={{ borderRadius: '10px' }} placeholder='example@gmail.com' />
            </Form.Item>

            <Form.Item style={{ width: '100%' }}>
              <Button
                onClick={sendOtp}
                type='primary'
                shape='round'
                icon={<SendOutlined />}
                style={{
                  width: '100%',
                  height: '2.5rem',
                  backgroundColor: '#102C57',
                  borderColor: '#102C57',
                }}
                loading={loading}
              >
                Send Email
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className='signin-image-div' />
    </div>
  );
}

export default SignIn;
