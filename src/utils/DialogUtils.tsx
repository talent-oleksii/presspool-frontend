import React from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import InfoDialog from '../components/InfoDialog';
import AskDialog from '../components/AskDialog';

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

  ask: (title: string, content: string, okText: string, cancelText: string, onOk: Function) => {
    const dialogContainer = document.createElement('div');
    document.body.appendChild(dialogContainer);

    const root = createRoot(dialogContainer);

    const onClose = () => {
      root.unmount();
      document.body.removeChild(dialogContainer);
    };

    root.render(
      createPortal(
        <AskDialog title={title} content={content} onClose={onClose} okText={okText} cancelText={cancelText} onOk={onOk} />,
        dialogContainer
      )
    );
  },
};

export default DialogUtils;