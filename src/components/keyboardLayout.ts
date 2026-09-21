/**
 * Geometry of the on-screen keyboard and numeric keypad, transcribed from the legacy detail view.
 *
 * Both sit on top of a background image (Keyboard.gif, NumPad.gif) that draws the key faces, so
 * every width, height and margin here has to line up with the artwork to the pixel. Nothing about
 * these numbers is arbitrary and none of them should be tidied.
 */

/** What activating a key does. */
export type KeyAction =
  | { kind: 'append'; value: string }
  | { kind: 'backspace' }
  | { kind: 'clear' }
  | { kind: 'close' }
  | { kind: 'submit' }
  | { kind: 'noop' }

/** One key on a row. */
export interface KeyDefinition {
  label: string
  width: number
  marginLeft: number
  /** Distinguishes a letter face from a command face; they are styled differently. */
  command: boolean
  action: KeyAction
}

/** One row of keys. */
export interface KeyRow {
  height: number
  marginTop: number
  keys: KeyDefinition[]
}

const SPACE = (width: number): KeyDefinition => ({
  label: '\u00a0',
  width,
  marginLeft: 13,
  command: false,
  action: { kind: 'noop' },
})

const LETTER = (label: string, value: string, width: number): KeyDefinition => ({
  label,
  width,
  marginLeft: 13,
  command: false,
  action: { kind: 'append', value },
})

const COMMAND = (
  label: string,
  width: number,
  action: KeyAction,
  marginLeft = 13,
): KeyDefinition => ({ label, width, marginLeft, command: true, action })

/**
 * The email keyboard. Shift is present on the artwork but was never wired up in the legacy
 * handler either - both shift keys fell through their switch case - so it stays inert rather
 * than changing behaviour the office has used for a decade.
 */
export const KEYBOARD_ROWS: readonly KeyRow[] = [
  {
    height: 82,
    marginTop: 0,
    keys: [
      COMMAND('ESC', 83, { kind: 'close' }, 27),
      LETTER('1', '1', 83),
      LETTER('2', '2', 83),
      LETTER('3', '3', 84),
      LETTER('4', '4', 83),
      LETTER('5', '5', 84),
      LETTER('6', '6', 83),
      LETTER('7', '7', 83),
      LETTER('8', '8', 84),
      LETTER('9', '9', 83),
      LETTER('0', '0', 83),
      SPACE(84),
      SPACE(84),
      COMMAND('Clear', 133, { kind: 'clear' }),
    ],
  },
  {
    height: 82,
    marginTop: 9,
    keys: [
      COMMAND('Delete', 131, { kind: 'backspace' }, 27),
      LETTER('Q', 'q', 83),
      LETTER('W', 'w', 83),
      LETTER('E', 'e', 84),
      LETTER('R', 'r', 83),
      LETTER('T', 't', 84),
      LETTER('Y', 'y', 83),
      LETTER('U', 'u', 83),
      LETTER('I', 'i', 84),
      LETTER('O', 'o', 83),
      LETTER('P', 'p', 83),
      SPACE(84),
      SPACE(84),
      SPACE(85),
    ],
  },
  {
    height: 82,
    marginTop: 12,
    keys: [
      COMMAND('Backspace', 155, { kind: 'backspace' }, 27),
      LETTER('A', 'a', 83),
      LETTER('S', 's', 83),
      LETTER('D', 'd', 84),
      LETTER('F', 'f', 83),
      LETTER('G', 'g', 84),
      LETTER('H', 'h', 83),
      LETTER('J', 'j', 83),
      LETTER('K', 'k', 84),
      LETTER('L', 'l', 83),
      SPACE(83),
      SPACE(84),
      COMMAND('SEND', 158, { kind: 'submit' }),
    ],
  },
  {
    height: 82,
    marginTop: 12,
    keys: [
      COMMAND('Shift', 204, { kind: 'noop' }, 27),
      LETTER('Z', 'z', 83),
      LETTER('X', 'x', 83),
      LETTER('C', 'c', 84),
      LETTER('V', 'v', 83),
      LETTER('B', 'b', 84),
      LETTER('N', 'n', 83),
      LETTER('M', 'm', 83),
      SPACE(84),
      LETTER('.', '.', 83),
      SPACE(83),
      COMMAND('Shift', 207, { kind: 'noop' }),
    ],
  },
  {
    height: 95,
    marginTop: 12,
    keys: [
      COMMAND('@', 131, { kind: 'append', value: '@' }, 27),
      LETTER('_', '_', 108),
      LETTER('-', '-', 131),
      SPACE(566),
      LETTER('.COM', '.com', 132),
      LETTER('.NET', '.net', 108),
      LETTER('.ORG', '.org', 132),
    ],
  },
]

/** Key face height on the last keyboard row, which is one pixel shorter than the row. */
export const KEYBOARD_LAST_ROW_KEY_HEIGHT = 94

/** Numeric keypad keys sit on a 15px gutter rather than the keyboard's 13px. */
const NUM = (label: string, value: string, width: number): KeyDefinition => ({
  label,
  width,
  marginLeft: 15,
  command: false,
  action: { kind: 'append', value },
})

const NUM_COMMAND = (label: string, width: number, action: KeyAction): KeyDefinition => ({
  label,
  width,
  marginLeft: 15,
  command: true,
  action,
})

const NUM_SPACE = (width: number): KeyDefinition => ({
  label: '\u00a0',
  width,
  marginLeft: 15,
  command: false,
  action: { kind: 'noop' },
})

/** The telephone keypad. */
export const NUMPAD_ROWS: readonly KeyRow[] = [
  {
    height: 124,
    marginTop: 15,
    keys: [
      NUM('1', '1', 130),
      NUM('2', '2', 130),
      NUM('3', '3', 130),
      NUM('-', '-', 130),
    ],
  },
  {
    height: 124,
    marginTop: 18,
    keys: [
      NUM('4', '4', 130),
      NUM('5', '5', 130),
      NUM('6', '6', 130),
      NUM_COMMAND('CLEAR', 130, { kind: 'clear' }),
    ],
  },
  {
    height: 124,
    marginTop: 18,
    keys: [
      NUM('7', '7', 130),
      NUM('8', '8', 130),
      NUM('9', '9', 130),
      NUM_SPACE(130),
    ],
  },
  {
    height: 145,
    marginTop: 18,
    keys: [
      NUM('0', '0', 275),
      NUM_COMMAND('Backspace', 130, { kind: 'backspace' }),
      NUM_SPACE(130),
    ],
  },
]

/** Line height of a key face on each numeric keypad row, matching the artwork. */
export const NUMPAD_LINE_HEIGHTS: readonly number[] = [123, 123, 123, 145]
