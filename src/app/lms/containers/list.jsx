import React, { useState, useEffect } from "react";
import { Layout, Typography, Table, Space, Button, Input, Select } from "antd";
import { CheckCircleTwoTone, CloseCircleOutlined } from "@ant-design/icons";
import lmsApi from "../../../api/lms";
import coreService from "../../../services/core";
import Modal from "../components";

const localStorageAccessKey = "lmsTable";
const { Column } = Table;
const { Option } = Select;
const { Content } = Layout;
const { Title } = Typography;

const LMSList = () => {
  /** main table data */
  const [lms, setLms] = useState([]);
  const [lmsAll, setLmsAll] = useState([]);

  /** search data */
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
      currentTaskTableKey: coreService.getLocalStorage("currentTaskTable"),
    };
    async function fetchData() {
      await searchDo(params);

      await lmsApi.getAllTaskList().then((re) => {
        setLmsAll(re.data);
      });
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

  async function loadNewData() {
    coreService.removeLocalStorage(localStorageAccessKey);

    const params = {
      rowData: [],
      searchKey: "all",
    };

    await lmsApi.generateTaskList(params).then((re) => {
      setLms(re.data);
    });
  }

  async function searchDo(params, next) {
    const res = await lmsApi.getTaskList(params);

    setLms(res.data);

    if (next) {
      next(res);
    }
  }

  async function submit(key) {
    const currentTaskTableKey = coreService.getLocalStorage("currentTaskTable");
    const params = {
      key,
      currentTaskTableKey,
    };

    await lmsApi.submitTask(params);

    await searchDo({ currentTaskTableKey });
  }

  function onSearchKeyChange(value) {
    setSearchKey(value);
  }

  return (
    <Content>
      <Title level={4}>미해결 과제 목록</Title>
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
      <div style={{ height: 10 }} />

      {/* main content */}
      {lms.length ? (
        <div>
          <Table dataSource={lms} bordered={true}>
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
              width={190}
              align="center"
              key="action"
              render={(text) => {
                return (
                  <Space size="small">
                    <Button
                      onClick={() => {
                        setDetailModalData(text);
                        setDetailModal(true);
                      }}
                      size="small"
                    >
                      상세
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setWriteModalData({
                          subjectName: text.subjectName,
                          taskName: text.taskName,
                          taskContent: text.taskContent,
                          dueDate: text.dueDate,
                          key: text.key,
                        });
                        setWriteModal(true);
                      }}
                    >
                      작성
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      disabled={text.taskContent ? false : true}
                      onClick={() => {
                        submit(text.key);
                      }}
                    >
                      제출
                    </Button>
                  </Space>
                );
              }}
            />
            <Column
              title="작성 상태"
              width={90}
              align="center"
              key="writeStatus"
              render={(text) => {
                return (
                  <div>
                    {text.taskContent ? (
                      <CheckCircleTwoTone />
                    ) : (
                      <CloseCircleOutlined />
                    )}
                  </div>
                );
              }}
            />
          </Table>
          <Modal.LMSSaveModal
            visible={saveModal}
            setVisible={setSaveModal}
            data={lms}
            dataAll={lmsAll}
            setDataAll={setLmsAll}
            next={searchDo}
          />
          <Modal.LMSWriteModal
            visible={writeModal}
            setVisible={setWriteModal}
            data={writeModalData}
            next={searchDo}
          />
          <Modal.LMSDetailModal
            visible={detailModal}
            setVisible={setDetailModal}
            data={detailModalData}
          />
        </div>
      ) : (
        <p>loading</p>
      )}
    </Content>
  );
};

export default LMSList;
