import React, { useState, useEffect } from "react";
import { Modal, Typography, Input } from "antd";
import lmsApi from "api/lms";

const LMSSaveModal = ({ visible, setVisible, data }) => {
  console.log(visible);
  console.log(data);

  return (
    <Modal
      title="테이블 저장"
      visible={visible}
      onCancel={() => {
        setVisible(!visible);
      }}
      onOk={() => {
        lmsApi.saveTaskList(data);
      }}
    >
      <Typography.Text strong={true}>테이블 별명</Typography.Text>
      <Input.Search maxLength={20} />
    </Modal>
  );
};

export default LMSSaveModal;
