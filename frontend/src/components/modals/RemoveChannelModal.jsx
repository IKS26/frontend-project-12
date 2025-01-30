import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRemoveChannelMutation } from '../../services/dataApi';
import { selectModalState, closeModal } from '../../store/modalSlice.js';
import { setCurrentChannelId, DEFAULT_CHANNEL_ID } from '../../store/channelsSlice.js';

const RemoveChannelModal = () => {
  const dispatch = useDispatch();
  const { channelId } = useSelector(selectModalState);
  const [removeChannel, { isLoading }] = useRemoveChannelMutation();

  const handleRemove = async () => {
    try {
      await removeChannel(channelId).unwrap();
      toast.success('Канал удалён');
      dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
      dispatch(closeModal());
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
        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          Отмена
        </Button>
        <Button variant="danger" onClick={handleRemove} disabled={isLoading}>
          Удалить
        </Button>
      </BootstrapModal.Footer>
    </>
  );
};

export default RemoveChannelModal;
