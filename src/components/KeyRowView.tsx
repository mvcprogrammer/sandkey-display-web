import type { KeyAction, KeyRow } from './keyboardLayout'

interface KeyRowViewProps {
  row: KeyRow
  rowClassName: string
  keyClassName: string
  commandClassName: string
  /** Face height, when it differs from the row height. */
  keyHeight?: number
  /** Line height of a key face, for the numeric keypad where it is set per row. */
  lineHeight?: number
  /** Font size override, used by the keypad's CLEAR and Backspace faces. */
  commandFontSize?: number
  onAction: (action: KeyAction) => void
}

/**
 * Renders one row of an on-screen keyboard.
 *
 * The rows are floated and sized in absolute pixels because they sit on top of a background image
 * that draws the key faces. Changing the geometry moves the labels off the artwork.
 */
export function KeyRowView({
  row,
  rowClassName,
  keyClassName,
  commandClassName,
  keyHeight,
  lineHeight,
  commandFontSize,
  onAction,
}: KeyRowViewProps): JSX.Element {
  return (
    <div
      className={rowClassName}
      style={{ minHeight: row.height, marginTop: row.marginTop, width: '100%' }}
    >
      {' '}
      {row.keys.map((key, index) => {
        const inert = key.action.kind === 'noop'

        return (
          <div
            key={`${rowClassName}-${index}`}
            className={key.command ? commandClassName : keyClassName}
            onClick={inert ? undefined : () => onAction(key.action)}
            style={{
              float: 'left',
              marginLeft: key.marginLeft,
              width: key.width,
              minHeight: keyHeight ?? row.height,
              ...(lineHeight === undefined ? {} : { lineHeight: `${lineHeight}px` }),
              ...(key.command && commandFontSize !== undefined
                ? { fontSize: commandFontSize }
                : {}),
              textAlign: 'center',
              cursor: inert ? 'default' : 'pointer',
            }}
          >
            {key.label}
          </div>
        )
      })}
    </div>
  )
}
