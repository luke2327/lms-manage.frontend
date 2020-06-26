import React, { useState, useEffect, useContext } from 'react';
import {
  Layout,
  Typography,
  Table,
  Space,
  Button,
  Input,
  Select,
  message,
} from 'antd';
import { CheckCircleTwoTone, CloseCircleOutlined, ArrowDownOutlined } from '@ant-design/icons';
import lmsApi from '../../../api/lms';
import Modal from '../components';
import { ErrorContext, TableContext } from '../../../App';

const { Column } = Table;
const { Option } = Select;
const { Content } = Layout;
const { Title } = Typography;

const LMSList = () => {
  /** main table data */
  const [lms, setLms] = useState([]);
  const [lmsAll, setLmsAll] = useState();
  const [currentTableKey, setCurrentTableKey] = useContext(TableContext);

  /** search data */
  const [searchKey, setSearchKey] = useState('subjectName');
  const [searchWord, setSearchWord] = useState('');
  const searchKeyList = ['subjectName', 'taskName'];

  /** modal status */
  const [saveModal, setSaveModal] = useState(false);
  const [writeModal, setWriteModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);

  /** modal data */
  const [writeModalData, setWriteModalData] = useState();
  const [detailModalData, setDetailModalData] = useState();

  /** msg */
  const [msg, setMsg] = useState();
  const [errMessage] = useContext(ErrorContext);

  useEffect(() => {
    const params = {
      rowData: lms,
      searchKey: searchKey,
      currentTaskTableKey: currentTableKey,
    };

    async function fetchData() {
      if (params.currentTaskTableKey) {
        await searchDo(params);

        await lmsApi.getAllTaskList().then((re) => {
          setLmsAll(re.data);
        });
      } else {
        setMsg('데이터가 없습니다. 새로운 데이터를 생성해 주세요.');
      }
    }

    fetchData();
  }, []);

  async function searchFn(value) {
    setSearchWord(value);

    const params = {
      searchWord: value,
      searchKey: searchKey,
      currentTaskTableKey: currentTableKey,
    };

    await searchDo(params, (res) => {
      if (!res.data.length) {
        setMsg('검색된 결과가 없습니다.');
      }
    });
  }

  async function loadNewData() {
    const params = {
      rowData: [],
      searchKey: 'all',
    };

    await lmsApi.generateTaskList(params).then((re) => {
      setLms(re.data);
    });
  }

  async function searchDo(params, next) {
    const res = await lmsApi.getTaskList(params);

    if (res) {
      setLms(res.data);

      if (next) {
        next(res);
      }
    }
  }

  async function submit(key) {
    const currentTaskTableKey = currentTableKey;
    const params = {
      key,
      currentTaskTableKey,
    };

    await lmsApi.submitTask(params);

    await searchDo({ currentTaskTableKey }, () => {
      message.success('성공적으로 제출하였습니다.');
    });
  }

  function onSearchKeyChange(value) {
    setSearchKey(value);
  }

  return (
    <Content>
      <Title level={4}>미해결 과제 목록</Title>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
              style={{ width: '30%' }}
              onSearch={(value, e) => {
                if (!currentTableKey && !lms.length) {
                  message.error('먼저 데이터를 생성 후 저장 해 주세요.');
                } else if (!currentTableKey && lms.length) {
                  message.info({
                    content: '데이터를 생성하셨다면 아래의 모달에서 데이터를 저장 해 주세요.',
                    icon: <ArrowDownOutlined />
                  });

                  setSaveModal(true);
                } else {
                  searchFn(value);
                }
              }}
            />
          </Input.Group>
        </>
        <>
          <Space size="small">
            {lms.length ? (
              <Button
                type="primary"
                onClick={() => {
                  setSaveModal(true);
                }}
              >
                데이터 저장
              </Button>
            ) : null}
            <Button
              type="primary"
              onClick={() => {
                loadNewData();
              }}
            >
              데이터 생성
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
                      disabled={!text.taskContent}
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
            context={currentTableKey}
            setContext={setCurrentTableKey}
            next={{
              searchDo,
              setLms,
              setMsg
            }}
          />
          <Modal.LMSWriteModal
            visible={writeModal}
            setVisible={setWriteModal}
            data={writeModalData}
            context={currentTableKey}
            searchKey={searchKey}
            searchWord={searchWord}
            next={searchDo}
          />
          <Modal.LMSDetailModal
            visible={detailModal}
            setVisible={setDetailModal}
            data={detailModalData}
          />
        </div>
      ) : (
        <p>{
          (msg || errMessage)
            ? msg ? msg : errMessage
            : 'loading'
        }
        </p>
      )}
    </Content>
  );
};

export default LMSList;
