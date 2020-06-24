import React, { useState, useEffect } from "react";
import {
  Modal
} from "antd";

const LMSWriteModal = ({ visible, setVisible, data }) => {

  console.log(visible);

  return (
    <Modal
      title="title"
      visible={visible}>
      <p>hello</p>
    </Modal>
  )
}

export default LMSWriteModal;