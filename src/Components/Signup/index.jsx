import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Switch,  notification } from 'antd';
import { Link, useHistory} from 'react-router-dom';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UnlockOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import Logo from '../../Layout/Logo';
import API from '../../api';

function SignUp() {
  const [form] = Form.useForm();
  const [isMerchant, setIsMerchant] = useState(false);
  const [state, setState] = useState({
    loader: false,
    error: false,
    message: 'Please provide valid details',
    type: 'error',
  });
  const history = useHistory();
  const registration = () => {
    form
      .validateFields()
      .then((values) => {
        const password = values.password ? values.password.trim() : ''; // Check if password is defined before calling trim()
        const confirmPassword = values.confirmPassword
          ? values.confirmPassword.trim()
          : ''; // Check if confirmPassword is defined before calling trim()
        /* if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        } */
        setState({ ...state, loader: true });
        const data = { ...values, isMerchant };
        delete data.confirmPassword;
        axios
          .post(API.registration, data)
          .then((res) => {
            if (res.status === 200) {
              setState({
                ...state,
                loader: false,
                message: 'Registration Success',
                type: 'success',
                error: true,
              });
              history.push('/signin');
            } else {
              setState({ ...state, error: true, loader: false });
            }
          })
          .catch((error) => {
            setState({ ...state, error: true, loader: false });
          });
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: error.message || 'Please provide valid details',
        });
      });
  };
  useEffect(() => {
    if (state.error) {
      notification.open({
        message: state.message,
        type: state.type,
      });
      setState({ ...state, error: false });
    }
  }, [state.error, state.message, state.type]);
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
        <h2  style={{ fontSize: '28px', color: '#333', marginBottom: '0.5rem' }} className='welcomeBack'>Welcome to Serve Us</h2>
        
        <div>
          <Form form={form} layout='vertical' style={{marginTop: '2rem'}}>
            <Form.Item  style={{ fontSize: '16px' }} label='Username' name='name'>
              <Input style={{ borderRadius: '10px' }}  placeholder='john doe' />
            </Form.Item>
            <Form.Item style={{ fontSize: '16px' }} label='Email' name='email'>
              <Input style={{ borderRadius: '10px' }}  placeholder='johndoe@gmail.com' />
            </Form.Item>
            <Form.Item style={{ fontSize: '16px' }} label='Password' name='password'>
              <Input.Password
              style={{ borderRadius: '10px' }} 
                placeholder='Password'
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item style={{ fontSize: '16px' }} label='Confirm password'>
              <Input.Password
              style={{ borderRadius: '10px' }} 
                placeholder='Password'
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                marginTop: '2rem',
              }}
            >
              <div>
                <Switch
                  onChange={(e) => {
                    setIsMerchant(e);
                  }}
                />
                <span className='remeberMe'>Merchant/Owner/Worker</span>
              </div>
            </div>
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
                }}
                loading={state.loader}
                onClick={registration}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
          <p
            style={{
              textAlign: 'center',
              margin: '1.5rem 0',
              fontSize: '1rem',
              fontWeight: '700',
              color: 'rgb(119, 119, 119)',
              fontFamily: 'Loto',
            }}
          >
            Already Have an Account!
            <Link
              style={{ color: '#102C57', marginLeft: '0.5rem' }}
              to='/signin'
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className='signin-image-div' />
    </div>
  );
}

export default SignUp;
