import React, { useState } from 'react';
import { Modal, Typography, Input, Button, Space, message, Tooltip } from 'antd';
import coreService from '../../../services/core';
import lmsApi from '../../../api/lms';

const LMSSaveModal = ({
  visible,
  setVisible,
  data,
  dataAll,
  setDataAll,
  context,
  setContext,
  next,
}) => {
  /** table name */
  const [tableName, setTableName] = useState('');

  /** table key */
  const [applyKey, setApplyKey] = useState('');

  /** check submit possibility */
  const [modalSubmit, setModalSubmit] = useState(true);

  /** check duplicate */
  const [onDuplicate, setOnDuplicate] = useState(false);

  async function handlingTableName(value) {
    setTableName(value);

    if (value === '') {
      message.error('별칭은 1글자 이상 입력 해 주세요.');

      return false;
    }

    const params = {
      value,
    };

    return await lmsApi.checkDuplicateTableName(params).then(({ data }) => {
      let result;

      if (!data) {
        setModalSubmit(false);
        setOnDuplicate(false);

        result = false;

        message.success('사용가능한 테이블 별칭입니다.');
      } else {
        setModalSubmit(true);
        setOnDuplicate(true);

        result = true;
      }

      return result;
    });
  }

  async function submit() {
    /** check duplicate */
    await handlingTableName(tableName).then(async (re) => {
      if (!re) {
        await lmsApi.saveTaskList({ tableName, data });

        coreService.setLocalStorage('currentTaskTable', tableName);

        setContext(tableName);

        const allTaskList = await lmsApi.getAllTaskList().then((re) => re.data);
        const params = {
          currentTaskTableKey: tableName,
        };

        setDataAll(allTaskList);

        next.searchDo(params);
      }
    });
  }

  async function destory() {
    await lmsApi.destoryTaskList({}).then(re => {
      message.success('성공적으로 초기화 하였습니다.');
    });

    setDataAll();

    coreService.removeLocalStorage('currentTaskTable');

    setContext('');

    next.setLms([]);
    next.setMsg('데이터가 없습니다. 새로운 데이터를 생성 해 주세요.');

    setVisible(!visible);
  }

  async function apply(key) {
    setVisible(!visible);
    setApplyKey(key);

    coreService.setLocalStorage('currentTaskTable', key);

    setContext(key);
  }

  async function deleteTask(key) {
    await lmsApi.deleteTaskList({ currentTaskTableKey: key });

    const allTaskList = await lmsApi.getAllTaskList().then((re) => re.data);

    setDataAll(allTaskList);

    message.success('성공적으로 삭제하였습니다.');
  }

  async function onAfterClose() {
    setTableName('');
    setModalSubmit(true);

    if (applyKey) {
      const params = {
        currentTaskTableKey: applyKey,
      };

      setApplyKey('');

      next.searchDo(params);
    }
  }

  return (
    <Modal
      title="테이블 저장"
      visible={visible}
      afterClose={() => {
        onAfterClose();
      }}
      onCancel={() => {
        setVisible(!visible);
      }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          { dataAll ? <Button onClick={() => { destory(); }} danger>초기화</Button> : <div /> }
          <Space>
            <Button onClick={() => { setVisible(!visible); }}>닫기</Button>
            {
              modalSubmit
                ? (
                  <Tooltip placement="top" title="먼저 별칭 중복확인을 해 주세요.">
                    <Button disabled={modalSubmit} type="primary">저장</Button>
                  </Tooltip>
                )
                : <Button onClick={() => { submit(); }} type="primary">저장</Button>
            }
          </Space>
        </div>
      }
    >
      <Typography.Text strong={true}>테이블 별칭</Typography.Text>
      <Input.Search
        maxLength={20}
        value={tableName}
        onSearch={(value) => {
          handlingTableName(value);
        }}
        onChange={(e) => {
          setTableName(e.target.value);
        }}
      />
      {onDuplicate ? (
        <Typography.Paragraph
          type="danger"
          style={{ paddingLeft: 5, marginTop: 5, marginBottom: 0 }}
        >
          중복된 테이블 별칭입니다.
        </Typography.Paragraph>
      ) : null}
      <div style={{ height: 20 }} />
      <Typography.Text strong={true}>저장된 테이블 목록</Typography.Text>
      {dataAll
        ? Object.entries(dataAll).map(([key, value]) => (
          <div
            key={key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 2,
            }}
          >
            <Typography.Text>{key}</Typography.Text>
            <Space>
              <Typography.Text>{value.createdAt}</Typography.Text>
              <Button
                size="small"
                disabled={
                  context === key
                }
                onClick={() => {
                  deleteTask(key);
                }}
              >
                  삭제
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  apply(key);
                }}
              >
                  적용
              </Button>
            </Space>
          </div>
        ))
        : null}
    </Modal>
  );
};

export default LMSSaveModal;
