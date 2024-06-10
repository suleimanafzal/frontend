import React, { useState } from 'react';
import { Button, Input, Form, notification } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { UnlockOutlined } from '@ant-design/icons';
import axios from 'axios';
import Logo from '../../Layout/Logo';
import API from '../../api';

function SignIn() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [counter, setCounter] = React.useState(60);

  const [form] = Form.useForm();
  const sendOtp = () => {
    setLoading(true);
    axios
      .post(API.verifyOtp, form.getFieldsValue())
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          console.log(res.data.data);
          notification.open({
            message: res.data.message,
            type: 'success',
          });

          setLoading(false);
          history.push(`/changePassword/${res.data.data.email}`);
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
  React.useEffect(() => {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [counter]);
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
        <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '0.5rem' }} className='welcomeBack'>Welcome Back</h2>
        <p className='loginIntoAccount'>
          Enter your OTP to Change your Password
        </p>
        <div>
          <Form form={form} layout='vertical'>
            <Form.Item style={{ fontSize: '16px' }}
              label='One Time Password'
              //   required
              name='otp'
              //   tooltip="This is a required field"
            >
              <Input style={{ borderRadius: '10px' }} placeholder='Enter one time password' />
            </Form.Item>

            <Form.Item style={{ width: '100%' }}>
              <Button
                type='primary'
                shape='round'
                icon={<UnlockOutlined />}
                style={{
                  width: '100%',
                  height: '2.5rem',
                  backgroundColor: '#102C57',
                  borderColor: 'rgb(0, 132, 137)',
                  marginBottom: '1rem',
                }}
                loading={loading}
                onClick={sendOtp}
              >
                Verify OTP
              </Button>
              {counter < 2 ? (
                <Link to='/forgot-password'>Didn't Get OTP? Resend It</Link>
              ) : (
                `Resend after ${counter} second`
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className='signin-image-div' />
    </div>
  );
}

export default SignIn;
