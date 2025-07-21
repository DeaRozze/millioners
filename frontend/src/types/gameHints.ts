export interface Hint {
  used: boolean
}
export interface Props {
  hints: {
    fiftyFifty: Hint
    audienceHelp: Hint
  }
  disabled?: boolean
}

export interface Hints {
  fiftyFifty: Hint
  audienceHelp: Hint
}
