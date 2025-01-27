import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { removeChannel } from '../../store/channelsSlice.js';
import { selectModalState } from '../../store/modalSlice.js';

const RemoveChannelModal = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { channelId } = useSelector(selectModalState);

  const handleRemove = async () => {
    try {
      await dispatch(removeChannel(channelId)).unwrap();
      toast.success('Канал удалён');
      handleClose();
    } catch (error) {
      toast.error('Не удалось удалить канал');
    }
  };

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Удалить канал</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        Вы уверены, что хотите удалить этот канал? Все сообщения будут удалены.
      </BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Отмена
        </Button>
        <Button variant="danger" onClick={handleRemove}>
          Удалить
        </Button>
      </BootstrapModal.Footer>
    </>
  );
};

export default RemoveChannelModal;
