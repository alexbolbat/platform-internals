export type MessageType = 'init' | 'text'

export interface Message {
  type: MessageType
  text?: string
}
