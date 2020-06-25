import React, { useState, useEffect } from "react";
import { Layout, Typography, Table, Space, Button, Input, Select } from "antd";
import lmsApi from "../../../api/lms";
import coreService from "../../../services/core";
import Modal from "../components";

const { Column } = Table;
const { Option } = Select;
const { Content } = Layout;
const { Title } = Typography;

const ResolvedLMSList = () => {
  const [resolvedLms, setResolvedLms] = useState([]);

  /** search data */
  const [searchKey, setSearchKey] = useState("subjectName");
  const searchKeyList = ["subjectName", "taskName"];

  /** modal status */
  const [detailModal, setDetailModal] = useState(false);

  /** modal data */
  const [detailModalData, setDetailModalData] = useState();

  useEffect(() => {
    const params = {
      currentTaskTableKey: coreService.getLocalStorage("currentTaskTable"),
    };

    async function fetchData() {
      await searchDo(params);
    }

    fetchData();
  }, []);

  async function searchFn(value) {
    const params = {
      searchWord: value,
      searchKey: searchKey,
      currentTaskTableKey: coreService.getLocalStorage("currentTaskTable"),
    };

    await searchDo(params);
  }

  async function searchDo(params, next) {
    const res = await lmsApi.getResolvedTaskList(params);

    setResolvedLms(res.data);

    if (next) {
      next(res);
    }
  }

  function onSearchKeyChange(value) {
    setSearchKey(value);
  }

  return (
    <Content>
      <Title level={4}>제출한 과제 목록</Title>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <>
          <Input.Group compact>
            <Select
              style={{ width: 130 }}
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
              onSearch={(value, e) => {
                searchFn(value);
              }}
            />
          </Input.Group>
        </>
      </div>
      <div style={{ height: 10 }} />
      {resolvedLms.length ? (
        <div>
          <Table dataSource={resolvedLms} bordered={true}>
            <Column
              title="교과목"
              width={150}
              align="center"
              dataIndex="subjectName"
              key="subjectName"
            />
            <Column
              title="담당교수"
              width={130}
              align="center"
              dataIndex="professorName"
              key="professorName"
            />
            <Column title="과제" dataIndex="taskName" key="taskName" />
            <Column
              title="기한"
              width={120}
              dataIndex="dueDate"
              key="dueDate"
            />
            <Column
              title="Action"
              width={90}
              align="center"
              key="action"
              render={(text, record) => {
                return (
                  <Space size="small">
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        setDetailModalData(text);
                        setDetailModal(true);
                      }}
                    >
                      상세
                    </Button>
                  </Space>
                );
              }}
            />
          </Table>
          <Modal.LMSDetailModal
            visible={detailModal}
            setVisible={setDetailModal}
            data={detailModalData}
          />
        </div>
      ) : (
        "제출 한 과제가 없습니다."
      )}
    </Content>
  );
};

export default ResolvedLMSList;
