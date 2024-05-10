import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import axios from "axios";

const getRandomuserParams = (params) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const Home = () => {
  const [dataSource, setDataSource] = useState([]);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: limit,
    },
  });

  const handleData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://dummyjson.com/posts?skip=${skip}&limit=${limit}`
      );
      setDataSource(res.data.posts);
      setLimit(res.data.limit);
      setSkip(res.data.skip);
      setTotal(res.total);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total,
        },
      });

      console.log(res.data.posts);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    handleData();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataSource([]);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      filters: [...new Set(dataSource?.map((item) => item.id))],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        console.log(record);
        record.id.startsWith(value);
      },

      sorter: (a, b) => a.id - b.id,

      width: "20%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      filters: [...new Set(dataSource?.map((item) => item.title))],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.title.startsWith(value),

      width: "20%",
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
      filters: [...new Set(dataSource?.map((item) => item.body))],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.body.startsWith(value),
      width: "20%",
    },

    {
      title: "UserId",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      filters: [...new Set(dataSource?.map((item) => item.tags))],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.tags.startsWith(value),
      width: "20%",

      render: (_, { tags }) => (
        <>
          {tags?.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Reactions",
      dataIndex: "reactions",
      key: "reactions",
      filters: [...new Set(dataSource?.map((item) => item.reactions))],
      onFilter: (value, record) => record.reactions.startsWith(value),

      sorter: (a, b) => a.reactions - b.reactions,
    },
  ];

  return (
    <div>
      Home
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey={(record) => record.id}
      />
    </div>
  );
};

export default Home;
