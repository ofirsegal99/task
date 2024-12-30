import { defineStore } from "pinia";
import type { TypeWallet } from '@/types/walletTypes';



export const useWalletStore = defineStore('wallet', {
    state: () => ({
        wallets: null as TypeWallet[] | null,
        allWallets: null as TypeWallet[] | null,
        expandedAll:false
    }),
    actions: {
        initializeStore(wallets: TypeWallet[]) {
            this.wallets = wallets;
            this.allWallets = wallets;
        },
        setWallets(wallets: TypeWallet[]){
            this.wallets = wallets
        },
        toggleExpandAll(){
            this.expandedAll = !this.expandedAll;
        }
}});
