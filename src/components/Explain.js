import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';

const Explain = ({ children, title, isOpen, toggle }) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>{ title }</ModalHeader>
    <ModalBody>
      { children }
    </ModalBody>
  </Modal>
);

export default Explain;