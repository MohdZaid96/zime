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
  const [filterData, setFilterData] = useState([]);
  const [filterReactions, setFilterReaction] = useState([]);
  const [filterBody, setFilterBody] = useState([]);
  const [filterTitle, setFilterTitle] = useState([]);
  const [filterUserId, setFilterUserId] = useState([]);
  const [filterTags, setFiltertags] = useState([]);
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

  const handleFilterData=async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://dummyjson.com/posts?skip=0&limit=0`
      );
      setFilterData(res.data.posts)
      setFilterBody([...new Set(res.data.posts?.map((item) => {
        if(item.body != null)
          return (
          item.body
        )
        
      }))]);
      setFilterReaction([...new Set(res.data.posts?.map((item) => item.reactions))])
      console.log(filterReactions);

      //console.log(res.data.posts.length);
    } catch (error) {
      console.error(error);
    }
  }

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

     // console.log(res.data.posts);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    handleFilterData();
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
      onFilter: (value, record) => record.id === value
      ,

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
      onFilter: (value, record) => record.title === value,

      width: "20%",
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
      filters: [...new Set(filterBody)],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.body === value,
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
      onFilter: (value, record) => record.tags === value,
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
      filters: filterReactions?.map((item) => item && ({
        text: item,
        value: item
    }) 
    
    ),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => 
        record.reactions === value,

      sorter: (a, b) => a.reactions - b.reactions,
    },
  ];

  return (
    <div>
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
