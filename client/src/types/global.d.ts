// Global type declarations for Private Vault

declare global {
  interface Window {
    ethereum?: any;
    __PRIVATE_VAULT_ETHEREUM_DISABLED__?: boolean;
  }
}

export {};