interface Ethereum extends Window {
  ethereum: {
    isMiniPay?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  };
}

declare var window: Ethereum;

interface CustomEthereum {
  isMiniPay?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isDawn?: boolean;
  isBraveWallet?: boolean;
  isCoinbaseWallet?: boolean;
  isFrame?: boolean;
  isGamestop?: boolean;
  isMetaMask?: boolean;
  isExodus?: boolean;
  isOpera?: boolean;
  isBlocto?: boolean;
  isTrustWallet?: boolean;
  isOkxWallet?: boolean;
  isZerion?: boolean;
  isPhantom?: boolean;
  isSuperb?: boolean;
  isRabby?: boolean;
}

interface CustomWindow extends Window {
  ethereum?: CustomEthereum;
}

declare let window: CustomWindow;
