import React, { useState, useEffect, useContext } from 'react';
import { Button, Input, Form, Switch, notification } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UnlockOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import Logo from '../../Layout/Logo';
import API from '../../api';
import { getauth, setauth } from '../../utils/auth';
import { GlobalContext } from '../../Context/GlobalContext';

function SignIn(props) {
  const [form] = Form.useForm();
  const { data, dispatch } = useContext(GlobalContext);
  const [state, setState] = useState({ loader: false, error: false });
  const history = useHistory();

  useEffect(() => {
    const token = getauth();
    axios.get(API.auth, { headers: { 'auth-token': token } }).then((res) => {
      if (res.data.success === true) {
        dispatch({ type: 'LOGIN_SUCCESS' });
        let { isMerchant } = res.data.data;
        if (!isMerchant) isMerchant = false;

        dispatch({ type: 'SET_MERCHANT', isMerchant });
        let path =
          '/home-services/allCategories?category=all&state=all&city=&name=';
        if (props.location && props.location.state && props.location.state.data)
          path =
            props.location.state.data.pathname +
            props.location.state.data.search;
        history.push(path);
      }
    });
  }, []);

  const login = () => {
    setState({ ...state, loader: true });
    const datas = form.getFieldsValue();
    axios
      .post(API.login, datas)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: 'LOGIN_SUCCESS' });
          let { isMerchant } = res.data.data;
          if (!isMerchant) isMerchant = false;

          dispatch({ type: 'SET_MERCHANT', isMerchant });

          if (data.categories.length === 0)
            axios
              .get(API.categories)
              .then((res) => {
                if (res.data.success) {
                  dispatch({ type: 'SET_CATEGORIES', payload: res.data.data });
                }
              })
              .catch((e) => console.log(e));
          if (data.states.length === 0)
            axios
              .get(API.states)
              .then((res) => {
                if (res.data.success) {
                  dispatch({ type: 'SET_STATES', payload: res.data.data });
                }
              })
              .catch((e) => console.log(e));
          if (res.headers.auth) {
            setauth(res.headers.auth);
          }
          setState({ ...state, loader: false });
          history.push(
            '/home-services/allCategories?category=all&state=all&city=&name=',
          );
        } else {
          setState({ error: true, loader: false });
        }
      })
      .catch((e) => {
        setState({ error: true, loader: false });
      });
  };

  useEffect(() => {
    if (state.error) {
      notification.open({
        message: 'Wrong Credentials',
        type: 'error',
      });
      setState({ ...state, error: false });
    }
  }, [state.error]);

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
        <h2 className='welcome-back' style={{ fontSize: '28px', color: '#333', marginBottom: '0.5rem' }}>Welcome Back!</h2>

        <div>
          <Form form={form} layout='vertical' className='signin-form-fields' style={{marginTop: '2rem'}}>
          <Form.Item
            label={<span style={{ fontSize: '16px' }}>Email</span>} // Increase label font size
            name='email'
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input style={{ borderRadius: '10px' }} size='large' placeholder='Enter your email' />
          </Form.Item>
          <Form.Item
            label={<span style={{ fontSize: '16px' }}>Password</span>} // Increase label font size
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
            style={{ borderRadius: '10px' }} 
              size='large'
              placeholder='Enter your password'
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div className='signin-form-actions' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Switch />
            </Form.Item>
            <span className='remember-text' style={{ marginLeft: '0rem' }}>Remember me</span>
            <Link className='forgot-password-link' to='/forgot-password' style={{ marginLeft: '1rem'}}>
              Forgot Password?
            </Link>
          </div>

          <Form.Item>
            <Button
              type='primary'
              htmlType='button'
              shape='round'
              icon={<UnlockOutlined />}
              size='large'
              className='signin-button'
              loading={state.loader}
              onClick={login}
              style={{ backgroundColor: '#102C57', marginTop: '1rem', width: '100%'}}
            >
              Login
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
              fontFamily: 'Lato',
            }}
          >
            Don't Have an Account?
            <Link
              style={{ color: '#102C57', marginLeft: '0.5rem' }}
              to='/signup'
            >
              Registration
            </Link>
          </p>
        </div>
      </div>
      <div className='signin-image-div' />
    </div>
  );
}

export default SignIn;
