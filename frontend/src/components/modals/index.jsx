import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal as BootstrapModal } from 'react-bootstrap';
import { closeModal, selectModalState } from '../../store/modalSlice.js';
import AddChannelModal from './AddChannelModal.jsx';
import RemoveChannelModal from './RemoveChannelModal.jsx';
import RenameChannelModal from './RenameChannelModal.jsx';

const Modal = () => {
  const { type, isOpen } = useSelector(selectModalState);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  const Component = useMemo(() => {
    const modals = {
      add: AddChannelModal,
      remove: RemoveChannelModal,
      rename: RenameChannelModal,
    };
    return modals[type] || null;
  }, [type]);

  return (
    <BootstrapModal show={isOpen} onHide={handleClose} centered>
      {Component && <Component handleClose={handleClose} />}
    </BootstrapModal>
  );
};

export default Modal;
