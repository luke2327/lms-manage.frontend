import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Input } from 'antd';

import lmsApi from '../../../api/lms';

const { TextArea } = Input;

const LMSWriteModal = ({ visible, setVisible, data, context, searchKey, searchWord, next }) => {
  const [taskContent, setTaskContent] = useState('');

  /** init */
  useEffect(
    () => {
      if (data) {
        setTaskContent(data.taskContent);
      }
    },
    [data]
  );

  async function submit() {
    const currentTaskTableKey = context;
    const params = {
      key: data.key,
      taskContent,
      currentTaskTableKey,
    };

    await lmsApi.writeTaskContent(params);

    /** modal close */
    setVisible(!visible);

    /** update table list */
    if (next) {
      next({
        currentTaskTableKey,
        searchKey,
        searchWord
      });
    }
  }

  return data ? (
    <Modal
      title={
        <Space style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Text strong={true}>{data.subjectName}</Typography.Text>
          <Typography.Text style={{ fontSize: 12 }}>
            {data.taskName}
          </Typography.Text>
        </Space>
      }
      width={900}
      visible={visible}
      onCancel={() => {
        setVisible(!visible);
      }}
      okText="작성"
      onOk={() => {
        submit();
      }}
    >
      <TextArea
        rows={15}
        value={taskContent}
        onChange={(e) => {
          setTaskContent(e.target.value);
        }}
      />
    </Modal>
  ) : null;
};

export default LMSWriteModal;
