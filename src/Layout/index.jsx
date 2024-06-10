import React, { useState, useContext, useEffect } from 'react';
import { Layout, Menu, Input, Select, Button } from 'antd';
import {
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  ProfileOutlined,
  LogoutOutlined,
  SettingOutlined,
  SearchOutlined,
  WechatOutlined
} from '@ant-design/icons';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Avatar from 'antd/lib/avatar/avatar';
import axios from 'axios';
import { GlobalContext } from '../Context/GlobalContext';
import API from '../api';
import { getArrayParams, setUrlString } from '../utils/paramsConvert';

const { Option } = Select;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function Index({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { data, dispatch } = useContext(GlobalContext);
  const history = useHistory();
  const { search: urlSearch } = useLocation();
  const [isHide, setIsHide] = useState(false);

  const [search, setSearch] = useState({
    name: '',
    state: 'all',
    city: '',
    category: 'all',
  });

  const fieldOnChange = (key, value) => {
    setSearch({ ...search, [key]: value });
  };

  const onCollapse = (collapsedData) => {
    setCollapsed(collapsedData);
  };

  const secondURL = history.location.pathname.split('/')[2];
  useEffect(() => {
    if (secondURL === 'addCategory' || secondURL === 'addService')
      setIsHide(true);
    else setIsHide(false);
  }, [secondURL]);

  useEffect(() => {
    setSearch(getArrayParams(urlSearch));
  }, [urlSearch]);

  useEffect(() => {
    axios
      .get(API.categories)
      .then((res) => {
        if (res.data.success) {
          dispatch({ type: 'SET_CATEGORIES', payload: res.data.data });
        }
      })
      .catch((e) => console.error(e));
    axios
      .get(API.states)
      .then((res) => {
        if (res.data.success) {
          dispatch({ type: 'SET_STATES', payload: res.data.data });
        }
      })
      .catch((e) => console.error(e));
  }, [dispatch]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className='logo' style={{ overflow: 'hidden' }}>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', padding: '16px', margin: 0 }}>Serve US</p>
        </div>
        <Menu theme='dark' defaultOpenKeys={['13', 'category', 'Services']} defaultSelectedKeys={['13']} mode='inline'>
          <SubMenu key='category' icon={<UserOutlined />} title={<span style={{ fontSize: '16px', color: 'white' }}>Categories</span>}>
            <Menu.Item key='66'>
              <Link to='/home-services/allCategories?category=all&state=all&city=&name='>
                All Categories
              </Link>
            </Menu.Item>
            {data.isMerchant && (
              <Menu.Item key='67'>
                <Link to='/home-services/addCategory'>Add Category</Link>
              </Menu.Item>
            )}
          </SubMenu>

          <SubMenu icon={<TeamOutlined />} title={<span style={{ fontSize: '16px', color: 'white' }}>Services</span>}>
            <Menu.Item key='6'>
              <Link to='/home-services/allServices?category=all&state=all&city=&name='>
                All Services
              </Link>
            </Menu.Item>
            {data.isMerchant && (
              <Menu.Item key='8'>
                <Link to='/home-services/addService'>Add Service</Link>
              </Menu.Item>
            )}
          </SubMenu>

          <SubMenu key='13' icon={<PieChartOutlined />} title={<span style={{ fontSize: '16px', color: 'white' }}>Charts</span>}>
            <Menu.Item key='1'>
              <Link to='/home-services/charts/categories'>
                Categories Charts
              </Link>
            </Menu.Item>
            <Menu.Item style={{ marginRight: '-10%' }} key='10'>
              <Link to='/home-services/charts/services'>Services Charts</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu key='15' icon={<WechatOutlined />} title={<span style={{ fontSize: '16px', color: 'white' }}>Chat</span>}>
            <Menu.Item key='10'>
              <a
                href='/chatbot'
                target='_blank'
                rel='noopener noreferrer'
              >
                Chat
              </a>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Header
          theme='dark'
          className='site-layout-background'
          style={{ padding: 0 }}
        >
          <Menu
            style={{
              display: 'flex',
              justifyContent: !isHide ? 'space-between' : 'flex-end',
              alignItems: 'center',
            }}
            theme='dark'
            mode='horizontal'
          >
            {!isHide ? (
              <Input.Group>
                <Select
                  className='locationState'
                  style={{
                    width: '15%',
                    color: 'white',
                  }}
                  value={search.category}
                  onChange={(value) => {
                    fieldOnChange('category', value);
                  }}
                >
                  <Option value='all'>Category (All)</Option>
                  {data.categories.length > 0
                    ? data.categories.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))
                    : null}
                </Select>
                <Select
                  className='locationState'
                  style={{
                    width: '15%',
                    color: 'white',
                  }}
                  value={search.state}
                  onChange={(value) => fieldOnChange('state', value)}
                >
                  <Option value='all'>State (All)</Option>
                  {data.states.length > 0
                    ? data.states.map((state) => (
                      <Option key={state.id} value={state.id}>
                        {state.state}
                      </Option>
                    ))
                    : null}
                </Select>
                <Input
                  prefix={
                    <i
                      style={{ marginRight: '0.75rem' }}
                      className='fa fa-map-marker'
                      aria-hidden='true'
                    />
                  }
                  style={{
                    width: '15%',
                    color: 'white',
                  }}
                  value={search.city}
                  onChange={(value) =>
                    fieldOnChange('city', value.target.value)
                  }
                  className='locationCity'
                  placeholder='Enter your location'
                />
                <Input
                  style={{
                    width: '15%',
                    color: 'white',
                  }}
                  className='locationCity'
                  placeholder={'ex "shree ram"'}
                  value={search.name}
                  onChange={(value) => {
                    fieldOnChange('name', value.target.value);
                  }}
                />
                <Button
                  icon={<SearchOutlined />}
                  style={{
                    marginLeft: '1rem',
                    boxShadow:
                      '0 4px 10px 0 #6c757d6e, 0 0 10px 0 #f8f8f9 !important',
                  }}
                  type='primary'
                  className='mainSearchButton'
                  onClick={() => {
                    history.push(
                      `/home-services/allServices${setUrlString(search)}`,
                    );
                    dispatch({ type: 'SET_SEARCH_PARAMS', payload: search });
                  }}
                >
                  Search
                </Button>
              </Input.Group>
            ) : null}

            <SubMenu
              key='100'
              title={<Avatar size='large' src='../images/team_01.jpg' />}
            >
              <Menu.Item key='101' icon={<ProfileOutlined />}>
                <Link to='/home-services/profile'>Profile</Link>
              </Menu.Item>
              <Menu.Item key='102' icon={<SettingOutlined />}>
                <Link to='/home-services/setting'>Setting</Link>
              </Menu.Item>
              <Menu.Item
                onClick={() => dispatch({ type: 'LOGOUT' })}
                key='103'
                icon={<LogoutOutlined />}
              >
                <Link to='/signin'>Log Out</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div className='site-layout-background' style={{ padding: 24 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', fontSize: '16px', color: 'rgba(0,0,0,0.65)' }}>
          {new Date().getFullYear()} Suleiman
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Index;
