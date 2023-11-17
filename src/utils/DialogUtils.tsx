import React from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import InfoDialog from '../components/InfoDialog';

const DialogUtils = {
  show: (type: string, title: string, content: string) => {
    const dialogContainer = document.createElement('div');
    document.body.appendChild(dialogContainer);

    const root = createRoot(dialogContainer);

    const onClose = () => {
      root.unmount();
      document.body.removeChild(dialogContainer);
    };

    root.render(
      createPortal(
        <InfoDialog type={type} title={title} content={content} onClose={onClose} />,
        dialogContainer
      )
    );
  },

  info: (title: string, content: string) => {
    const dialogContainer = document.createElement('div');
    document.body.appendChild(dialogContainer);

    const root = createRoot(dialogContainer);

    const onClose = () => {
      root.unmount();
      document.body.removeChild(dialogContainer);
    };

    root.render(
      createPortal(
        <InfoDialog title={title} content={content} onClose={onClose} />,
        dialogContainer
      )
    );
  },
};

export default DialogUtils;