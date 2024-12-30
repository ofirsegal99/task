<script setup lang="ts">
import type { TypeAsset, TypeWallet } from '@/types/walletTypes';
import { computed, ref, watch } from 'vue';
import Tooltip from '@/components/Tooltip.vue';
import { getIcon } from '@/utils/getIcon';
import { stringify } from 'postcss';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/stores/wallet';

const props = defineProps<{
  wallet: TypeWallet;
}>();

const walletStore = useWalletStore();
const {expandedAll} = storeToRefs(walletStore);


const identifierFormatted = computed(() => {
  const id = props.wallet.identifier;
  return id.length <= 10 ? id : `${id.slice(0, 5)}...${id.slice(-5)}`;
});


const createdAtFormatted = computed(() => {
  const date = new Date(props.wallet.createdAt);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: '2-digit' }).format(date);
});

const assetsFormatted = computed(() => {
  return `${props.wallet.assets.length} ${props.wallet.assets.length > 1 ? 'Assets' : 'Asset'}`;
});

function networkFormatted(str: string | number) {
    if (typeof str === 'number') {
        str = String(str); 
    }

    if (str.length === 0) return str; 

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function currencyFormatted(value: number | null, currency: string){
    const totalUsdValue = Math.floor(value || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${totalUsdValue} ${currency}`;
}


function getUniqueIcons(assets: TypeAsset[]): { [key: string]: string } {
  const iconsMap: { [key: string]: string } = {};

  assets.forEach(asset => {
    const network = asset.asset.network; 
    const iconPath = getIcon(network); 

    if (iconPath && !iconsMap[network]) {
      iconsMap[network] = iconPath;
    }
  });

  return iconsMap;
}

const uniqueIcons = ref(getUniqueIcons(props.wallet.assets));
</script>

<template>
  <div class="flex flex-col w-full justify-between items-center bg-white border border-[#DEEAFF]">
    <div class="flex flex-col w-full">
      <div class="flex flex-row w-full pt-4 px-4 justify-between items-center">
        <div class="flex flex-row items-center gap-4">
         <div class="flex flex-row relative h-6">
                 <div class="flex justify-center items-center">
                      <div v-if="Object.keys(uniqueIcons).length > 0" class="w-6 h-6 rounded-[50%] transition-all ease-in-out">
                        <Tooltip
                             mode='none'
                             :content="networkFormatted(Object.keys(uniqueIcons)[0])"
                         >
                             <template #trigger>
                                 <img
                                     class="h-6 w-6 cursor-pointer"
                                     :src="Object.values(uniqueIcons)[0]"
                                     alt="Asset Icon"
                                 />
                             </template>
                         </Tooltip>
                      </div>
                      <div v-if="Object.keys(uniqueIcons).length > 1" class="w-6 h-6 rounded-[50%] ml-[-0.8rem] transition-all ease-in-out">
                        <Tooltip
                             mode='none'
                             :content="networkFormatted(Object.keys(uniqueIcons)[1])"
                         >
                             <template #trigger>
                                 <img
                                     class="h-6 w-6 cursor-pointer"
                                     :src="Object.values(uniqueIcons)[1]"
                                     alt="Asset Icon"
                                 />
                             </template>
                         </Tooltip>
                      </div>
                      <div v-if="Object.keys(uniqueIcons).length > 2" class="w-6 h-6 rounded-[50%] ml-[-0.8rem] transition-all ease-in-out">
                        <div class="h-6 w-6 flex items-center justify-center rounded-full bg-white border border-[#DEEAFF] text-black text-[0.6rem]">
                              +{{ Object.keys(uniqueIcons).length - 2 }}
                         </div>
                      </div>
                    </div>
             </div>
          <div class="flex flex-col items-start">
            <h4 class="text-neutral-1100 font-bold text-lg">{{ props.wallet.name }}</h4>
              <Tooltip
              mode='copy'
              :content="props.wallet.identifier"              
              >
              <template #trigger> 
                <div class="flex flex-row gap-1 cursor-pointer items-center justify-center text-[#8E8F98] font-normal text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M4.99194 0.591302C5.04138 0.31962 4.86121 0.0593052 4.58953 0.00987232C4.31784 -0.0395605 4.05753 0.140608 4.0081 0.41229L3.53721 3.00024L1.49602 3.00003C1.21988 3 0.996001 3.22384 0.995972 3.49998C0.995943 3.77612 1.21978 4 1.49592 4.00003L3.35527 4.00023L2.62751 7.99994L0.499979 8.00003C0.223836 8.00004 -1.16811e-05 8.22391 4.57185e-10 8.50005C1.17137e-05 8.77619 0.223879 9.00004 0.500021 9.00003L2.44556 8.99995L2.00694 11.4106C1.95751 11.6823 2.13768 11.9426 2.40936 11.992C2.68104 12.0414 2.94136 11.8613 2.99079 11.5896L3.46199 8.9999L7.44424 8.99974L7.00532 11.4087C6.95582 11.6804 7.13592 11.9408 7.40759 11.9903C7.67926 12.0398 7.93962 11.8596 7.98912 11.588L8.46071 8.99969L10.5 8.99961C10.7762 8.99959 11 8.77573 11 8.49959C11 8.22344 10.7761 7.9996 10.5 7.99961L8.64291 7.99969L9.3715 4.00085L11.5 4.00108C11.7762 4.00111 12.0001 3.77727 12.0001 3.50113C12.0001 3.22499 11.7763 3.00111 11.5002 3.00108L9.5537 3.00087L9.99258 0.592092C10.0421 0.320423 9.86198 0.0600641 9.59031 0.0105655C9.31864 -0.0389331 9.05828 0.141172 9.00878 0.412842L8.53726 3.00077L4.55361 3.00035L4.99194 0.591302ZM4.37167 4.00033L8.35506 4.00075L7.62644 7.99973L3.64394 7.9999L4.37167 4.00033Z" fill="#8E8F98"/>
                    </svg>
                    {{ identifierFormatted }}
                </div>
                </template>
              </Tooltip>
          </div>
        </div>
            <Tooltip
              mode='none'
              :content="props.wallet.totalUsdValue+' USD'"              
              >
              <template #trigger> 
                    <h4 class="text-[#1F1F1F] cursor-pointer font-bold text-lg">
                        {{  currencyFormatted(props.wallet.totalUsdValue, 'USD') }}
                    </h4>
                </template>
              </Tooltip>
      </div>
      <div class="flex flex-row w-full py-4">
        <div class="flex flex-row w-full border-b mx-4 border-[#DEEAFF]"></div>
      </div>
      <div class="flex flex-row w-full px-4 pb-4 items-center gap-2">
        <div class="text-sm">Added: {{ createdAtFormatted }}</div>
        <div class="w-[1px] h-5 mx-1 bg-[#DEEAFF]"></div>
        <div class="bg-[#F0F1F5] p-2 rounded text-xs">{{ assetsFormatted }}</div>
      </div>
      <transition name="fade">
        <div v-if="expandedAll" class="flex flex-row w-full">
            <table class="w-full border border-[#DEEAFF]">
                <thead>
                    <tr>
                        <th class="w-1/3 border border-[#DEEAFF] text-start py-3 px-4 gap-2 uppercase text-xs text-[#8E8F98]">asset</th>
                        <th class="w-1/3 border border-[#DEEAFF] text-start py-3 px-4 gap-2 uppercase text-xs text-[#8E8F98]">network</th>
                        <th class="w-1/3 border border-[#DEEAFF] text-start py-3 px-4 gap-2 uppercase text-xs text-[#8E8F98]">
                          <div class="flex flex-row items-center gap-2">
                            current balance
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 6C0.5 9.05 2.95 11.5 6 11.5C9.05 11.5 11.5 9.05 11.5 6C11.5 2.95 9.05 0.5 6 0.5C2.95 0.5 0.5 2.95 0.5 6ZM1.5 6C1.5 3.5 3.5 1.5 6 1.5C8.5 1.5 10.5 3.5 10.5 6C10.5 8.5 8.5 10.5 6 10.5C3.5 10.5 1.5 8.5 1.5 6Z" fill="#8E8F98"/>
                            <path d="M6.053 5.0995C6.29269 5.0995 6.487 5.29381 6.487 5.5335V8.2565C6.487 8.49619 6.29269 8.6905 6.053 8.6905C5.81331 8.6905 5.619 8.49619 5.619 8.2565V5.5335C5.619 5.29381 5.81331 5.0995 6.053 5.0995ZM6.606 4.053C6.606 4.12767 6.59083 4.19767 6.5605 4.263C6.53017 4.32833 6.48933 4.3855 6.438 4.4345C6.389 4.4835 6.33067 4.52317 6.263 4.5535C6.19533 4.5815 6.123 4.5955 6.046 4.5955C5.97133 4.5955 5.90017 4.5815 5.8325 4.5535C5.76717 4.52317 5.71 4.4835 5.661 4.4345C5.612 4.3855 5.57233 4.32833 5.542 4.263C5.514 4.19767 5.5 4.12767 5.5 4.053C5.5 3.976 5.514 3.90367 5.542 3.836C5.57233 3.76833 5.612 3.71 5.661 3.661C5.71 3.612 5.76717 3.5735 5.8325 3.5455C5.90017 3.51517 5.97133 3.5 6.046 3.5C6.123 3.5 6.19533 3.51517 6.263 3.5455C6.33067 3.5735 6.389 3.612 6.438 3.661C6.48933 3.71 6.53017 3.76833 6.5605 3.836C6.59083 3.90367 6.606 3.976 6.606 4.053Z" fill="#8E8F98"/>
                            </svg>
                          </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(asset, index) in props.wallet.assets">
                       <td class="w-1/3 border border-[#DEEAFF] py-3 px-4 text-left align-top text-neutral-1100 font-bold text-base">
                        {{  asset.name }}
                        </td>
                       <td class="w-1/3 border border-[#DEEAFF] py-3 px-4 text-left align-top">
                        <div class="text-neutral-1100 flex items-center font-bold gap-2 text-lg">
                            <img class="h-4 w-4" :src="getIcon(asset.asset.network)" :alt="asset.asset.network">      
                        <Tooltip
                             mode='copy'
                             :content="'Contract: ' + asset.asset.identifier"             
                             >
                             <template #trigger> 
                                    <span class="cursor-pointer">
                                        {{  networkFormatted(asset.asset.network) }}
                                    </span>
                               </template>
                             </Tooltip>
                            </div>

                        </td>
                       <td class="w-1/3 border border-[#DEEAFF] gap-1 py-3 px-4 text-left align-top">
                        <div class="flex text-sm text-neutral-1100">
                            {{  currencyFormatted(asset.assetAmount, asset.asset.symbol) }}
                        </div>
                        <div class="text-[#8E8F98] flex gap-1 items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <g clip-path="url(#clip0_1_4500)">
                            <path d="M8 1.83337C4.32667 1.83337 1.33333 4.82671 1.33333 8.50004C1.33333 12.1734 4.32667 15.1667 8 15.1667C11.6733 15.1667 14.6667 12.1734 14.6667 8.50004C14.6667 4.82671 11.6733 1.83337 8 1.83337ZM8 14.1667C4.87333 14.1667 2.33333 11.6267 2.33333 8.50004C2.33333 5.37337 4.87333 2.83337 8 2.83337C11.1267 2.83337 13.6667 5.37337 13.6667 8.50004C13.6667 11.6267 11.1267 14.1667 8 14.1667Z" fill="#8E8F98"/>
                            <path d="M9.92333 10.0734C9.92333 10.9334 9.35 11.5934 8.50333 11.78V12.6667C8.50333 12.94 8.27667 13.1667 8.00333 13.1667C7.73 13.1667 7.50333 12.94 7.50333 12.6667V11.78C6.65667 11.5934 6.08333 10.9334 6.08333 10.0734C6.08333 9.80004 6.31 9.57337 6.59 9.57337C6.86333 9.57337 7.08333 9.80004 7.08333 10.0734C7.08333 10.6334 7.58333 10.8334 8.00333 10.8334C8.42333 10.8334 8.92333 10.6334 8.92333 10.0734C8.92333 9.62004 8.70333 9.45337 7.49667 8.73337L7.27 8.60004C6.74333 8.29337 6.08333 7.91337 6.08333 6.92671C6.08333 6.06671 6.65667 5.40671 7.50333 5.22004V4.33337C7.50333 4.06004 7.73 3.83337 8.00333 3.83337C8.27667 3.83337 8.50333 4.06004 8.50333 4.33337V5.23337C9.31667 5.45337 9.92333 6.20004 9.92333 7.08671C9.92333 7.36004 9.69667 7.58004 9.41667 7.58004C9.14333 7.58004 8.92333 7.36004 8.92333 7.08671C8.92333 6.58004 8.51 6.16671 8.00333 6.16671C7.58333 6.16671 7.08333 6.36671 7.08333 6.92671C7.08333 7.32004 7.26333 7.44004 7.77 7.73337L7.95 7.84004C9.24333 8.61337 9.92333 9.02004 9.92333 10.0734Z" fill="#8E8F98"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_1_4500">
                            <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
                            </clipPath>
                            </defs>
                            </svg>
                            {{  currencyFormatted(asset.assetUsdValue?.value || null, 'USD') }}
                        </div>
                       </td>
                     </tr>
                     <tr>
                        <td class="w-1/3 border border-[#DEEAFF] text-start py-3 px-4 gap-2 text-xs bg-[#EFF4FF]">
                            <div class="flex flex-row py-3 px-4 items-center justify-start gap-2 bg-[#EFF4FF]">
                                <h5 class=" font-bold text-base text-[#1F1F1F]">
                                 {{ assetsFormatted }}
                                </h5>
                                <div class=" rounded px-2 py-1 bg-[#DEEAFF] leading-4 font-normal text-[#1F1F1F] text-xs">
                                   Summary
                                 </div>
                             </div>
                        </td>
                        <td class="w-1/3 border border-[#DEEAFF] text-start py-3 px-4 gap-2 uppercase text-xs text-[#8E8F98] bg-[#EFF4FF]">
                          <div class="flex items-center flex-wrap">
                                   <div 
                                    v-for="(iconPath, network, index) in uniqueIcons" 
                                    class="w-4 h-4 rounded-[50%] transition-all ease-in-out"
                                    :style="{ marginLeft: index === 0 ? '0' : '-0.5rem'}"
                                    >
                                     <Tooltip
                                          mode='none'
                                          :content="networkFormatted(network)"
                                      >
                                          <template #trigger>
                                              <img
                                                  class="h-4 w-4 cursor-pointer"
                                                  :src="iconPath"
                                                  alt="Asset Icon"
                                              />
                                          </template>
                                      </Tooltip>
                                   </div>
                                      </div>
                        </td>
                        <td class="w-1/3 border border-[#DEEAFF] text-start py-3 px-4 uppercase text-[#1F1F1F] font-bold text-sm bg-[#EFF4FF]">
                            <div class="flex gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <g clip-path="url(#clip0_1_4500)">
                            <path d="M8 1.83337C4.32667 1.83337 1.33333 4.82671 1.33333 8.50004C1.33333 12.1734 4.32667 15.1667 8 15.1667C11.6733 15.1667 14.6667 12.1734 14.6667 8.50004C14.6667 4.82671 11.6733 1.83337 8 1.83337ZM8 14.1667C4.87333 14.1667 2.33333 11.6267 2.33333 8.50004C2.33333 5.37337 4.87333 2.83337 8 2.83337C11.1267 2.83337 13.6667 5.37337 13.6667 8.50004C13.6667 11.6267 11.1267 14.1667 8 14.1667Z" fill="#1F1F1F"/>
                            <path d="M9.92333 10.0734C9.92333 10.9334 9.35 11.5934 8.50333 11.78V12.6667C8.50333 12.94 8.27667 13.1667 8.00333 13.1667C7.73 13.1667 7.50333 12.94 7.50333 12.6667V11.78C6.65667 11.5934 6.08333 10.9334 6.08333 10.0734C6.08333 9.80004 6.31 9.57337 6.59 9.57337C6.86333 9.57337 7.08333 9.80004 7.08333 10.0734C7.08333 10.6334 7.58333 10.8334 8.00333 10.8334C8.42333 10.8334 8.92333 10.6334 8.92333 10.0734C8.92333 9.62004 8.70333 9.45337 7.49667 8.73337L7.27 8.60004C6.74333 8.29337 6.08333 7.91337 6.08333 6.92671C6.08333 6.06671 6.65667 5.40671 7.50333 5.22004V4.33337C7.50333 4.06004 7.73 3.83337 8.00333 3.83337C8.27667 3.83337 8.50333 4.06004 8.50333 4.33337V5.23337C9.31667 5.45337 9.92333 6.20004 9.92333 7.08671C9.92333 7.36004 9.69667 7.58004 9.41667 7.58004C9.14333 7.58004 8.92333 7.36004 8.92333 7.08671C8.92333 6.58004 8.51 6.16671 8.00333 6.16671C7.58333 6.16671 7.08333 6.36671 7.08333 6.92671C7.08333 7.32004 7.26333 7.44004 7.77 7.73337L7.95 7.84004C9.24333 8.61337 9.92333 9.02004 9.92333 10.0734Z" fill="#1F1F1F"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_1_4500">
                            <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
                            </clipPath>
                            </defs>
                            </svg>
                            {{  currencyFormatted(props.wallet.totalUsdValue, 'USD') }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </transition>
    </div>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
