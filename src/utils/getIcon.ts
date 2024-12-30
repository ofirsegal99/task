import BinanceIcon from '@/assets/Binance.png';
import SolanaIcon from '@/assets/Solana.png';

const iconMap: { [key: string]: string } = {
  BINANCE: BinanceIcon,
  SOLANA: SolanaIcon,
  BITCOIN: BinanceIcon,
  ETHEREUM: BinanceIcon,
  AVAX: BinanceIcon,
  DOGECOIN: BinanceIcon,
  RIPPLE: BinanceIcon,
  STELLAR: BinanceIcon,
  BLAST: BinanceIcon,
  HEDERA: BinanceIcon,
  OPTIMISM: BinanceIcon,
  POLYHON: BinanceIcon,
  ALGORANY: BinanceIcon,
  TRON: BinanceIcon,
  CARDANO: BinanceIcon,
  SUI: BinanceIcon,
  FANTOM: BinanceIcon,
  ETHEREUM_CLASSIC: BinanceIcon,
  POLYGON: BinanceIcon,
  ARBITRUM: BinanceIcon,
  NEAR: BinanceIcon,
  SUBSTRATE_POLKADOT: BinanceIcon,
  HARMONY: BinanceIcon,
  LITECOIN: BinanceIcon,
  COSMOS: BinanceIcon,
  KADENA: BinanceIcon,
  FILECOIN: BinanceIcon,
  GNOSIS_CHAIN: BinanceIcon,
  INTERNET_COMPUTER: BinanceIcon,
  FETCHAI: BinanceIcon,
  BITCOIN_CASH: BinanceIcon,
  ALGORAND: BinanceIcon,
};

export function getIcon(network: string) {
  const normalizedNetwork = network.toUpperCase();
  const icon = iconMap[normalizedNetwork];

  return icon || '@/assets/Solana.png'; // Replace with your default icon path
}
