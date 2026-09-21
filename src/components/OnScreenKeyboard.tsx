import { KEYBOARD_LAST_ROW_KEY_HEIGHT, KEYBOARD_ROWS, type KeyAction } from './keyboardLayout'
import { KeyRowView } from './KeyRowView'

interface OnScreenKeyboardProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
  /** Status text shown in place of the address while a request is in flight. */
  status: string | null
  disabled: boolean
}

/**
 * The email keyboard shown on the listing detail screen.
 *
 * Every key reads from and writes to a single piece of state rather than reaching into the input
 * by id, which is what the jQuery version did.
 */
export function OnScreenKeyboard({
  value,
  onChange,
  onSubmit,
  onClose,
  status,
  disabled,
}: OnScreenKeyboardProps): JSX.Element {
  const handle = (action: KeyAction): void => {
    switch (action.kind) {
      case 'append':
        onChange(value + action.value)
        break
      case 'backspace':
        onChange(value.slice(0, -1))
        break
      case 'clear':
        onChange('')
        break
      case 'close':
        onClose()
        break
      case 'submit':
        onSubmit()
        break
      case 'noop':
        break
    }
  }

  return (
    <div
      id="id_contact_keyboard"
      className="contact-keyboard"
      style={{
        backgroundColor: '#b7b7b7',
        padding: 20,
        borderRadius: 15,
        backgroundImage: "url('/Images/Keyboard.gif')",
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          minHeight: 560,
          minWidth: 1465,
          textAlign: 'center',
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontSize: 28,
          lineHeight: '50px',
        }}
      >
        {' '}
        {KEYBOARD_ROWS.map((row, index) => (
          <KeyRowView
            key={`keyboard-row-${index + 1}`}
            row={row}
            rowClassName={`keyboard-row-${index + 1}`}
            keyClassName="keyboard-key"
            commandClassName="keyboard-command"
            keyHeight={index === KEYBOARD_ROWS.length - 1 ? KEYBOARD_LAST_ROW_KEY_HEIGHT : undefined}
            onAction={handle}
          />
        ))}
      </div>
      <div id="id_info_center" style={{ textAlign: 'center' }}>
        <input
          id="id_email_input"
          readOnly
          value={status ?? value}
          style={{
            backgroundColor: '#2F2F2F',
            border: '2px solid #AA9C79',
            borderRadius: 8,
            color: '#FF8503',
            fontSize: 40,
            minWidth: 800,
            textAlign: 'center',
          }}
        />
        <button
          type="button"
          id="id_send_email_res_details"
          disabled={disabled}
          onClick={onSubmit}
          style={{
            backgroundColor: 'rgb(47, 47, 47)',
            color: 'rgb(255, 133, 3)',
            border: '2px solid #AA9C79',
            borderRadius: 8,
            fontSize: 36,
            marginLeft: 50,
          }}
        >
          SEND
        </button>
        <button
          type="button"
          className="keyboard-command"
          id="CLS"
          onClick={onClose}
          style={{
            backgroundColor: 'rgb(47, 47, 47)',
            color: 'rgb(255, 133, 3)',
            border: '2px solid #AA9C79',
            borderRadius: 8,
            fontSize: 36,
            marginLeft: 15,
          }}
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}
