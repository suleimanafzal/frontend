import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Row, Col, Collapse, notification } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import API from '../../api';

const { Panel } = Collapse;
const { Option } = Select;

export default function AddServices() {
  const [field, setField] = useState({});
  const history = useHistory();
  const [loader, setLoader] = useState(false);

  const [categoryOption, setCategoryOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [cityOption, setCityOption] = useState([]);

  const [state, setState] = useState({
    error: false,
    message: '',
    heading: '',
    type: 'error',
  });
  const validationError = (message) => {
    setState({ error: true, message, heading: 'Validation Error' });
  };
  useEffect(() => {
    if (state.error) {
      notification.open({
        message: state.heading,
        type: state.type,
        description: state.message,
      });
      setState({ ...state, error: false });
    }
  }, [state.error]);

  const submitData = () => {
    if (!field.name) {
      validationError('Please enter name');
      return;
    }
    if (!field.type) {
      validationError('Please select category');
      return;
    }
    if (!field.experiance) {
      validationError('Please enter experiance');
      return;
    }
    if (!field.description) {
      validationError('Please enter description');
      return;
    }
    if (!field.street1) {
      validationError('Please enter address line 1');
      return;
    }

    if (!field.country) {
      validationError('Please select country');
      return;
    }
    if (!field.state) {
      validationError('Please select state');
      return;
    }
    if (!field.city) {
      validationError('Please select city');
      return;
    }
    setLoader(true);
    const {
      street1,
      street2,
      type,
      city,
      country,
      state,
      name,
      description,
      experiance,
      tag,
      zipcode,
    } = field;
    const cityObj = cityOption.filter((c) => c.id === city)[0];
    const categoryObj = categoryOption.filter((c) => c.id === type)[0];
    const stateObj = stateOption.filter((c) => c.id === state)[0];

    const data = {};
    data.name = name;
    data.tag = tag.split(',');
    data.experiance = experiance;
    data.type = type;
    data.description = description;
    data.service_id = name + type + experiance;
    data.address = name + street1 + city + experiance;
    data.customers_served = (+city * 12).toString();
    data.addressObj = {
      id: name + street1 + city + experiance,
      street1,
      street2,
      country,
      state,
      city,
      zipcode,
      newCountry: { country: 'India', calling_code: '91' },
      newCity: cityObj,
      newState: stateObj,
    };
    data.typeObj = categoryObj;

    axios
      .post(API.addService, data)
      .then((res) => {
        if (res.data.success) {
          setState({
            error: true,
            message: 'Service/Shop added successfully!!',
            heading: 'Success',
            type: 'success',
          });
          history.push(
            '/home-services/allServices?category=all&state=all&city=&name=',
          );
        } else {
          setState({
            error: true,
            message: 'Server Error !!',
            heading: 'Opps',
            type: 'error',
          });
        }
        setLoader(false);
      })
      .catch((e) => {
        setState({
          error: true,
          message: 'Server Error !!',
          heading: 'Opps',
          type: 'error',
        });
        console.log(e);
        setLoader(false);
      });
  };
  const setFieldFn = (name, value) => {
    setField({ ...field, [name]: value });
  };

  useEffect(() => {
    axios
      .get(API.categories)
      .then((res) => {
        if (res.data.success) {
          setCategoryOption(res.data.data);
        }
      })
      .catch((e) => console.log(e));
    axios
      .get(API.getAllCity)
      .then((res) => {
        if (res.data.success) {
          setCityOption(res.data.data);
        }
      })
      .catch((e) => console.log(e));
    axios
      .get(API.states)
      .then((res) => {
        if (res.data.success) {
          setStateOption(res.data.data);
        }
      })
      .catch((e) => console.log(e));
  }, []);
  return (
    <div>
      <Collapse style={{backgroundColor: '#F7DCB9', borderRadius:'10px', color:"#FEFAF6"}} defaultActiveKey='1'>
        <Panel
          style={{ fontWeight: 'bold',  fontSize:'18px', color:"#FEFAF6"}}
          header='Service/Shop information'
          key='1'
        >
          <Row gutter={24}>
            <Col span='10' offset='1'>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' , fontSize:'16px'}}>
                  Service/Shop Name:
                </div>
                <Input
                style={{borderRadius:'10px'}}
                  value={field.name}
                  onChange={(e) => setFieldFn('name', e.target.value)}
                  placeholder='Service/Shop Name'
                />
              </div>
            </Col>
            <Col span='10' offset='1'>
            <div style={{ marginBottom: '1rem' }}>
  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold', fontSize: '16px' }}>
    Category/Type:
  </div>
  <Select
    value={field.type}
    onChange={(e) => {
      console.log(e);
      setFieldFn('type', e);
    }}
    placeholder='Select Category/Type'
    style={{ width: '100%', fontWeight: 'normal', borderRadius: '10px' }}
    dropdownStyle={{ borderRadius: '10px' }} // Apply borderRadius directly to the dropdown menu
  >
    {categoryOption.map((c) => (
      <Option key={c.id}>{c.name}</Option>
    ))}
  </Select>
</div>

            </Col>
          </Row>
          <Row gutter={24}>
            <Col span='10' offset='1'>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold',  fontSize:'16px' }}>
                  Total experiance:
                </div>
                <Input
                style={{borderRadius:'10px'}}
                  value={field.experiance}
                  onChange={(e) => setFieldFn('experiance', e.target.value)}
                  placeholder='1 year 6 months'
                />
              </div>
            </Col>
            <Col span='10' offset='1'>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold', fontSize:'16px' }}>
                  Tags:
                </div>
                <Input
                style={{borderRadius:'10px'}}
                  value={field.tag}
                  onChange={(e) => setFieldFn('tag', e.target.value)}
                  placeholder='Cheap,Awesome'
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col offset='1' span='21'>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold',  fontSize:'16px' }}>
                  Description:
                </div>
                <Input.TextArea
                style={{borderRadius:'10px'}}
                  value={field.description}
                  onChange={(e) => setFieldFn('description', e.target.value)}
                  placeholder='Enter Description'
                />
              </div>
            </Col>
          </Row>
        </Panel>

        <Panel style={{ fontWeight: 'bold',  fontSize:'18px' }} header='Address ' key='2'>
          <Row gutter={24}>
            <Col span='10' offset='1'>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold', fontSize:'16px' }}>
                  Address Line 1:
                </div>
                <Input
                style={{borderRadius:'10px'}}
                  value={field.street1}
                  onChange={(e) => setFieldFn('street1', e.target.value)}
                  placeholder='Address Line 1'
                />
              </div>
            </Col>
            <Col span='10' offset='1'>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold',  fontSize:'16px' }}>
                  Address Line 2:
                </div>
                <Input
                style={{borderRadius:'10px'}}
                  value={field.street2}
                  onChange={(e) => setFieldFn('street2', e.target.value)}
                  placeholder='Address Line 2'
                />
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span='10' offset='1'>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold',  fontSize:'16px' }}>
                  Country:
                </div>
                <Select
                
                  placeholder='Select Country'
                  style={{ width: '100%', fontWeight: 'normal', borderRadius:'10px' }}
                  value={field.country}
                  onChange={(e) => setFieldFn('country', e)}
                >
                  <Option key='92'>Pakistan</Option>
                </Select>
              </div>
            </Col>
            <Col span='10' offset='1'>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold',  fontSize:'16px' }}>
                  State:
                </div>
                <Select
                  placeholder='Select State'
                  style={{ width: '100%', fontWeight: 'normal', borderRadius:'10px' }}
                  value={field.state}
                  onChange={(e) => setFieldFn('state', e)}
                >
                  <Option key='fed'>Federal</Option>
                  <Option key='pun'>Punjab</Option>
                  <Option key='s'>Sindh</Option>
                  <Option key='kpk'>Khyber Pakhtunkhwa</Option>
                  <Option key='b'>Balochistan</Option>
                </Select>
              </div>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span='10' offset='1'>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold',  fontSize:'16px' }}>
                  City:
                </div>
                <Select
                  placeholder='Select City'
                  style={{ width: '100%', fontWeight: 'normal', borderRadius:'10px' }}
                  value={field.city}
                  onChange={(e) => setFieldFn('city', e)}
                >
                  <Option key='isl'>Islamabad</Option>
                  <Option key='lhr'>Lahore</Option>
                  <Option key='krc'>Karachi</Option>
                  <Option key='psh'>Peshawar</Option>
                  <Option key='qt'>Quetta</Option>
                </Select>
              </div>
            </Col>
            <Col span='10' offset='1'>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold',  fontSize:'16px' }}>
                  Zip Code:
                </div>
                <Input
                style={{borderRadius:'10px'}}
                  value={field.zipcode}
                  onChange={(e) => setFieldFn('zipcode', e.target.value)}
                  placeholder='Zip code'
                />
              </div>
            </Col>
          </Row>
        </Panel>
      </Collapse>
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={() =>
            history.push(
              '/home-services/allServices?category=all&state=all&city=&name=',
            )
          }
          style={{ marginRight: '1rem', borderRadius: '10px' }}
        >
          Cancel
        </Button>
        <Button style={{ backgroundColor: "#102C57", borderRadius: '10px' }} onClick={() => submitData()} type='primary'>
          Submit
        </Button>
      </div>
    </div>
  );
}
