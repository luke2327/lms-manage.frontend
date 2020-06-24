import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Input,
  Col,
  Row,
  Select,
  InputNumber,
  DatePicker,
  AutoComplete,
  Cascader,
} from "antd";
import lmsApi from "api/lms";
import coreService from "services/core";

const localStorageAccessKey = "lmsTable";
const { Column, ColumnGroup } = Table;
const { Option } = Select;
const { Content } = Layout;
const { Title } = Typography;
const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

const LMSList = () => {
  const [lms, setLms] = useState([]);
  const [searchKey, setSearchKey] = useState("all");
  const searchKeyList = ["all", "subjectName", "taskName"];
  const params = {
    rowData: lms,
    searchKey: searchKey,
  };

  useEffect(() => {
    console.log(1);
    async function fetchData() {
      const res = await lmsApi.getTaskList(params);

      setLms(res.data);
      coreService.setLocalStorage(localStorageAccessKey, res.data);
    }

    fetchData();
  }, []);

  const searchFn = async (value) => {
    const storedRowData = coreService.getLocalStorage(localStorageAccessKey);
    const params = {
      rowData: storedRowData,
      searchWord: value,
      searchKey: searchKey,
    };
    const res = await lmsApi.getTaskList(params);

    setLms(res.data);
  };

  const onSearchKeyChange = (value) => {
    setSearchKey(value);
  };

  const loadNewData = async () => {
    coreService.removeLocalStorage(localStorageAccessKey);

    const params = {
      rowData: [],
      searchKey: "all",
    };

    const res = await lmsApi.getTaskList(params);

    setLms(res.data);
    coreService.setLocalStorage(localStorageAccessKey, res.data);
  };

  return (
    <Content>
      <Title level={4}>미해결 과제 목록</Title>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <>
          <Input.Group compact>
            <Select
              defaultValue={searchKey}
              onChange={(v) => {
                onSearchKeyChange(v);
              }}
            >
              {searchKeyList.map((k, i) => (
                <Option key={i} value={k}>
                  {k}
                </Option>
              ))}
            </Select>
            <Input.Search
              style={{ width: "30%" }}
              placeholder="all"
              onSearch={(value, e) => {
                e.target.blur();

                searchFn(value);
              }}
            />
          </Input.Group>
        </>
        <Button
          type="primary"
          onClick={() => {
            loadNewData();
          }}
        >
          데이터 갱신
        </Button>
      </div>

      {lms.length ? (
        <div>
          <Table dataSource={lms}>
            <Column title="교과목" dataIndex="subjectName" key="subjectName" />
            <Column
              title="담당교수"
              dataIndex="professorName"
              key="professorName"
            />
            <Column title="과제" dataIndex="taskName" key="taskName" />
            <Column title="기한" dataIndex="dueDate" key="dueDate" />
            <Column
              title="Action"
              key="action"
              render={(text, record) => {
                console.log(text, record);
                return (
                  <Space size="middle">
                    <Button type="primary">상세</Button>
                  </Space>
                );
              }}
            />
          </Table>
        </div>
      ) : (
        <p>loading</p>
      )}
    </Content>
  );
};

export default LMSList;
