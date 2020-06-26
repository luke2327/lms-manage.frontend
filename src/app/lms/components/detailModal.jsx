import React from 'react';
import { Modal, Typography, Input, Divider } from 'antd';

const { TextArea } = Input;

const LMSDetailModal = ({ visible, setVisible, data }) => {
  return data ? (
    <Modal
      visible={visible}
      width={data.taskContent ? 900 : 600}
      onCancel={() => {
        setVisible(!visible);
      }}
      title={data.subjectName}
      footer={null}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography.Text strong={true}>{data.taskName}</Typography.Text>
        <Typography.Text style={{ fontSize: 12 }}>
          {data.dueDate}
        </Typography.Text>
      </div>
      <div style={{ height: 20 }} />
      <div>
        {data.taskDesc.map((v, i) => (
          <Typography.Paragraph key={i} style={{ marginBottom: 4 }}>
            {v}
          </Typography.Paragraph>
        ))}
      </div>
      {data.taskContent ? (
        <>
          <Divider style={{ margin: '10px 0' }} />
          <Typography.Text strong={true}>제출 내용</Typography.Text>
          <TextArea
            value={data.taskContent}
            disabled={true}
            style={{ color: '#000' }}
            rows={15}
          />
        </>
      ) : null}
    </Modal>
  ) : null;
};

export default LMSDetailModal;
