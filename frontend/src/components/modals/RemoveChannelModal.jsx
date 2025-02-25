import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRemoveChannelMutation } from '../../services/dataApi';
import { selectModalState, closeModal } from '../../store/modalSlice.js';
import {
  selectChannelById,
  setCurrentChannelId,
  DEFAULT_CHANNEL_ID,
} from '../../store/channelsSlice.js';

const RemoveChannelModal = () => {
  const { t } = useTranslation('modals');
  const dispatch = useDispatch();
  const { channelId } = useSelector(selectModalState);
  const channelToRemove = useSelector(state =>
    selectChannelById(state, channelId),
  )?.name;
  const [removeChannel, { isLoading }] = useRemoveChannelMutation();

  const handleRemove = async () => {
    try {
      await removeChannel(channelId).unwrap();
      toast.success(t('removeChannel.removed'));
      dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
      dispatch(closeModal());
    } catch {
      toast.error(t('removeChannel.error'));
    }
  };

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>
          <Trans i18nKey="removeChannel.title" values={{ channelToRemove }} />
        </BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        {t('removeChannel.confirmation')}
      </BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          {t('removeChannel.cancel')}
        </Button>
        <Button variant="danger" onClick={handleRemove} disabled={isLoading}>
          {t('removeChannel.submit')}
        </Button>
      </BootstrapModal.Footer>
    </>
  );
};

export default RemoveChannelModal;
