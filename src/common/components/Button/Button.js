import * as s from './style.module.css';

/**
 * A shared button with common styling used in the app (Home page, Config page, and Question view for answers).
 * @param {string} title - The text inside the button.
 * @param {boolean} disabled - Determines whether the button is disabled.
 * @param {boolean} uppercased - Determines whether the text inside the button is uppercased.
 * @param {function} onClick - The callback function to be triggered when clicking on the button.
 * @returns {JSX.Element} - The shared button component.
 */

export default function Button({
  title = '',
  disabled = false,
  uppercased = false,
  onClick = f => f
}) {
  const buttonCN = [s.button];
  if (uppercased) buttonCN.push('uppercased');

  return (
    <button
      className={buttonCN.join(' ')}
      disabled={disabled}
      type='button'
      onClick={onClick}>
      {title}
    </button>
  );
}