import * as s from './style.module.css';

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