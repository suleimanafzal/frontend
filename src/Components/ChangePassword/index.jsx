import React, { useState } from 'react';
import { Button, Input, Form, Switch, Divider, notification } from 'antd';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { SendOutlined } from '@ant-design/icons';
import axios from 'axios';
import Logo from '../../Layout/Logo';
import API from '../../api';

function SignIn() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const params = useParams();
  console.log(params);

  const [form] = Form.useForm();
  const sendOtp = () => {
    setLoading(true);
    axios
      .post(API.changePassword, {
        email: params.email,
        ...form.getFieldsValue(),
      })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          console.log(res.data.data);
          notification.open({
            message: res.data.message,
            type: 'success',
          });

          setLoading(false);
          history.push(`/`);
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
        <h2  style={{ fontSize: '28px', color: '#333', marginBottom: '0.5rem' }}  className='welcomeBack'>Welcome back</h2>
        <p className='loginIntoAccount'>Enter New password For </p>
        <div>
          <Form form={form} layout='vertical'>
            <Form.Item style={{ fontSize: '16px' }} label='Password' name='password'>
              <Input style={{ borderRadius: '10px' }} placeholder='Password' />
            </Form.Item>
            <Form.Item>
              <Input.Password style={{ borderRadius: '10px' }} placeholder='Confirm Password' />
            </Form.Item>

            <Form.Item style={{ width: '100%' }}>
              {console.log('hi')}
              <Button
                type='primary'
                shape='round'
                icon={<SendOutlined />}
                style={{
                  width: '100%',
                  height: '2.5rem',
                  backgroundColor: '#102C57',
                  borderColor: 'rgb(0, 132, 137)',
                }}
                loading={loading}
                onClick={sendOtp}
              >
                Change Password
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
