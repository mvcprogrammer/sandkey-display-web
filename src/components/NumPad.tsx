import { NUMPAD_LINE_HEIGHTS, NUMPAD_ROWS, type KeyAction } from './keyboardLayout'
import { KeyRowView } from './KeyRowView'

interface NumPadProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
  disabled: boolean
}

/** Font size of the keypad's CLEAR face, which is smaller than a digit. */
const CLEAR_FONT_SIZE = 28

/** Font size of the keypad's Backspace face. */
const BACKSPACE_FONT_SIZE = 20

/**
 * The telephone keypad shown on the listing detail screen, for a visitor who would rather be
 * called than emailed.
 */
export function NumPad({ value, onChange, onSubmit, onClose, disabled }: NumPadProps): JSX.Element {
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
      id="id_contact_numpad"
      className="contact-numpad"
      style={{
        backgroundColor: '#b7b7b7',
        borderRadius: 15,
        backgroundImage: "url('/Images/NumPad.gif')",
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          minHeight: 615,
          minWidth: 600,
          textAlign: 'center',
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontSize: 65,
          lineHeight: 0,
        }}
      >
        {' '}
        {NUMPAD_ROWS.map((row, index) => (
          <KeyRowView
            key={`keypad-row-${index + 1}`}
            row={row}
            rowClassName={`keypad-row-${index + 1}`}
            keyClassName="num-key"
            commandClassName="num-command"
            lineHeight={NUMPAD_LINE_HEIGHTS[index]}
            commandFontSize={index === NUMPAD_ROWS.length - 1 ? BACKSPACE_FONT_SIZE : CLEAR_FONT_SIZE}
            onAction={handle}
          />
        ))}
      </div>
      <div id="id_res_phone_info_center" style={{ textAlign: 'center', marginBottom: 10 }}>
        <input
          id="id_res_phone_input"
          readOnly
          value={value}
          style={{
            backgroundColor: '#2F2F2F',
            border: '2px solid #AA9C79',
            borderRadius: 8,
            color: '#FF8503',
            fontSize: 31,
            width: 256,
            padding: 15,
            margin: 0,
            textAlign: 'right',
          }}
        />
        <button
          type="button"
          id="id_res_send_phone_contact_request"
          disabled={disabled}
          onClick={onSubmit}
          style={{
            margin: '0 0 0 5px',
            padding: 5,
            backgroundColor: 'rgb(47, 47, 47)',
            color: 'rgb(255, 133, 3)',
            border: '2px solid #AA9C79',
            borderRadius: 8,
            fontSize: 36,
          }}
        >
          SEND
        </button>
        <button
          type="button"
          id="num-cls"
          className="num-command"
          onClick={onClose}
          style={{
            margin: '0 0 0 5px',
            padding: 5,
            backgroundColor: 'rgb(47, 47, 47)',
            color: 'rgb(255, 133, 3)',
            border: '2px solid #AA9C79',
            borderRadius: 8,
            fontSize: 36,
          }}
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}
