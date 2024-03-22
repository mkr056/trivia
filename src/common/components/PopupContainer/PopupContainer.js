import * as s from './style.module.css';

export default function PopupContainer({isOpen = false, onClose = () => {}, children}) {
  const popupCN = [s.popup];
  if (isOpen) popupCN.push('open');

  return (
    <div className={popupCN.join(' ')} onClick={onClose}>
      <div className={s.popupContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};