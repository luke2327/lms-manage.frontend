import React, { useState, useEffect } from "react";
import { Modal, Typography, Descriptions, Divider } from "antd";

const LMSDetailModal = ({ visible, setVisible, data }) => {
  console.log(visible);
  console.log(data);

  return data ? (
    <Modal
      visible={visible}
      width={600}
      onCancel={() => {
        setVisible(!visible);
      }}
      title={data.subjectName}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
    </Modal>
  ) : null;
};

export default LMSDetailModal;
