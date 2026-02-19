
export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export enum ThemeColors {
  PRIMARY = '#ccff00',
  BACKGROUND = '#0a0a0a',
  SURFACE = '#1a1a1a',
  TEXT_MUTED = '#a3a3a3'
}
