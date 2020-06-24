import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Table,
  Space,
  Button,
  Input,
  Select,
} from "antd";
import lmsApi from "api/lms";
import coreService from "services/core";
import Modal from "../components";

const localStorageAccessKey = "lmsTable";
const { Column, ColumnGroup } = Table;
const { Option } = Select;
const { Content } = Layout;
const { Title } = Typography;

const LMSList = () => {
  const [lms, setLms] = useState([]);
  const [searchKey, setSearchKey] = useState("all");
  const searchKeyList = ["all", "subjectName", "taskName"];
  
  /** modal status */
  const [saveModal, setSaveModal] = useState(false);
  const [writeModal, setWriteModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);

  /** modal data */
  const [writeModalData, setWriteModalData] = useState();
  const [detailModalData, setDetailModalData] = useState();

  useEffect(() => {
    const params = {
      rowData: lms,
      searchKey: searchKey,
    };
    async function fetchData() {
      await searchDo(params, (res) => {
        coreService.setLocalStorage(localStorageAccessKey, res.data);
      });
    }

    fetchData();
  }, []);

  async function searchFn (value) {
    const storedRowData = coreService.getLocalStorage(localStorageAccessKey);
    const params = {
      rowData: storedRowData,
      searchWord: value,
      searchKey: searchKey,
    };

    await searchDo(params);
  };

  async function loadNewData () {
    coreService.removeLocalStorage(localStorageAccessKey);

    const params = {
      rowData: [],
      searchKey: "all",
    };

    await searchDo(params, (res) => {
      coreService.setLocalStorage(localStorageAccessKey, res.data);
    });
  };

  async function searchDo (params, next) {
    const res = await lmsApi.getTaskList(params);

    setLms(res.data);

    if (next) {
      next(res);
    }
  }

  function onSearchKeyChange (value) {
    setSearchKey(value);
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
                searchFn(value);
              }}
            />
          </Input.Group>
        </>
        <>
          <Space size="small">
          <Button
              type="primary"
              onClick={() => {
                setSaveModal(true);
              }}
            >
              데이터 저장
            </Button>
            <Button
              type="primary"
              onClick={() => {
                loadNewData();
              }}
            >
              데이터 갱신
            </Button>
          </Space>
        </>
      </div>

      {/* main content */}
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
                    <Button
                      type="primary"
                      onClick={() => {
                        setDetailModalData(text);
                        setDetailModal(true)
                      }}
                    >
                      상세
                    </Button>
                    <Button type="primary">작성</Button>
                  </Space>
                );
              }}
            />
          </Table>
          <Modal.LMSSaveModal visible={saveModal} setVisible={setSaveModal} data={lms} />
          <Modal.LMSWriteModal visible={writeModal} setVisible={setWriteModal} data={writeModalData} />
          <Modal.LMSDetailModal visible={detailModal} setVisible={setDetailModal} data={detailModalData} />
        </div>
      ) : (
        <p>loading</p>
      )}
    </Content>
  );
};

export default LMSList;
