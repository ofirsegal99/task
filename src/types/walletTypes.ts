export interface TypeAsset {
  id: string;
  name: string;
  asset: {
      identifier: string;
      network: string;
      symbol: string;
  };
  assetUsdValue: {
      value: number | null;
  } | null; 
  assetAmount: number;
}

export interface TypeWallet {
  id: string;
  identifier: string;
  name: string;
  createdAt: string;
  totalUsdValue: number;
  assets: TypeAsset[];
}
