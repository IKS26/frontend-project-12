import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRemoveChannelMutation } from '../../api/dataApi.js';
import { selectModalState, closeModal } from '../../store/modalSlice.js';
import { selectCurrentChannelById } from '../../store/channelsSlice.js';

const RemoveChannelModal = () => {
  const { t } = useTranslation('chat');
  const dispatch = useDispatch();
  const { channelId } = useSelector(selectModalState);
  const channelToRemove = useSelector(selectCurrentChannelById)?.name;
  const [removeChannel, { isLoading }] = useRemoveChannelMutation();

  const handleRemove = async () => {
    try {
      await removeChannel(channelId).unwrap();
      toast.success(t('removeChannel.removed'));
      dispatch(closeModal());
    } catch {
      toast.error(t('removeChannel.error'));
    }
  };

  return (
    <>
      <BootstrapModal.Header closeButton className="modal-header-dark">
        <BootstrapModal.Title className="modal-title-dark">
          <Trans i18nKey="removeChannel.title" values={{ channelToRemove }} />
        </BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body className="modal-body-dark">{t('removeChannel.confirmation')}</BootstrapModal.Body>
      <BootstrapModal.Footer className="modal-footer-dark">
        <Button variant="secondary" onClick={() => dispatch(closeModal())} className="btn-secondary-dark">
          {t('removeChannel.cancel')}
        </Button>
        <Button variant="danger" onClick={handleRemove} disabled={isLoading} className="btn-danger-dark">
          {t('removeChannel.submit')}
        </Button>
      </BootstrapModal.Footer>
    </>
  );
};

export default RemoveChannelModal;
