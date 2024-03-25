import * as s from './style.module.css';

/**
 * A component used to show content as a popup.
 * @param {boolean} isOpen - Determines whether the component is displayed on the screen.
 * @param {function} onClick - The callback function to be triggered when clicking on the container.
 * @param {JSX.Element} children - Component to be rendered inside the container.
 * @returns {JSX.Element} The popup with content.
 */

export default function PopupContainer({
  isOpen = false,
  onClick = f => f,
  children
}) {

  /**
   * Prevents the propagation of the event.
   * It is required in order to prevent the callback function to be triggered
   * when clicking on the content of the popup.
   * @param {Event} e - The event object.
   */
  function preventPropagation(e) {
    e.stopPropagation();
  }

  const popupCN = [s.popup];
  if (isOpen) popupCN.push('open');

  return (
    <div className={popupCN.join(' ')} onClick={onClick}>
      <div className={s.popupContent} onClick={preventPropagation}>
        {children}
      </div>
    </div>
  );
};