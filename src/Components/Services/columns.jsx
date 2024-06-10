import React from 'react';
import { Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const tagColor = [
  '#ffa39e',
  '#ffbb96',
  '#ffd591',
  '#ffe58f',
  '#fffb8f',
  '#eaff8f',
  '#b7eb8f',
  '#87e8de',
  '#91d5ff',
  '#adc6ff',
  '#d3adf7',
  '#ffadd2',
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text, row) => (
      <Link to={`allServices/${row.service_id}`}>
        <Text strong>{text}</Text>
      </Link>
    ),
  },
  {
    title: 'Category',
    dataIndex: ['typeObj', 'name'],
    render: (text) => <Text>{text}</Text>,
  },
  {
    title: 'City',
    dataIndex: ['addressObj', 'newCity', 'city'],
    render: (text) => <Text>{text}</Text>,
  },
  {
    title: 'State',
    dataIndex: ['addressObj', 'newState', 'state'],
    render: (text) => <Text>{text}</Text>,
  },
  {
    title: 'Tags',
    dataIndex: 'tag',
    render: (text) =>
      text.map((prop) => {
        const num = prop.charCodeAt(0) + prop.charCodeAt(prop.length - 1);
        return (
          <Tag color={tagColor[num % 11]} key={prop}>
            <Text strong>{prop}</Text>
          </Tag>
        );
      }),
  },
  {
    title: 'Owner name',
    dataIndex: ['ownerObj', 'name'],
    render: (text) => <Text>{text || 'Not Specified'}</Text>,
  },
  {
    title: 'Owner number',
    dataIndex: ['ownerObj', 'phone'],
    render: (text) => <Text>{text || 'Not Specified'}</Text>,
  },
  {
    title: 'Experience',
    dataIndex: 'experience',
    render: (text) => <Text>{text}</Text>,
  },
  {
    title: 'Customers Served',
    dataIndex: 'customers_served',
    render: (text) => <Text>{text}</Text>,
  },
];

export default columns;
