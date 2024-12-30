 <script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { usePaginationStore } from '@/stores/pagination';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import walletsData from '@/assets/mock-api-wallets.json';
import type { TypeWallet } from '@/types/walletTypes';
import type { TypeSelectedList } from '@/types/dropdownTypes';
import { validatePagination } from '@/utils/validatePagination';
import { useWalletStore } from '@/stores/wallet';
import Wallet from  '@/components/Wallet.vue'
import DropdownFilterMenu from '@/components/DropdownFilterMenu.vue';


const paginationStore = usePaginationStore();
const {currentPage, viewsPerPage} = storeToRefs(paginationStore);


const walletStore = useWalletStore();
const {wallets, allWallets, expandedAll} = storeToRefs(walletStore);

const route = useRoute(); 
const router = useRouter(); 

onBeforeMount(() => {
  let wallets = walletsData as TypeWallet[];
  paginationStore.initializeStore(wallets.length);
  walletStore.initializeStore(wallets);
  watch(() => route.query, (newQuery) => {
  let {currentPage, viewsPerPage} = validatePagination(String(newQuery.page), String(newQuery.view), wallets.length);
  paginationStore.setPagination(currentPage, viewsPerPage);
  });
});

watch([currentPage, viewsPerPage], ([newPage, newViews]) => {
  router.push({ query: { page: newPage, view: newViews } });
});

watch(wallets, () => {
  console.log(wallets);
}, {deep:true} );

const nameIdentifierOptions = computed(() => {
  if (allWallets.value) {
    return allWallets.value.map(wallet => ({
      label: wallet.name,
      value: wallet.id, 
      subLabel: wallet.identifier.length <= 10 ? wallet.identifier : `${wallet.identifier.slice(0, 5)}...${wallet.identifier.slice(-5)}`
    }));
  }
  return []; 
});

const assetOptions = computed(() => {
  const uniqueAssets = new Set<string>();
  if (allWallets.value) {
    allWallets.value.forEach(wallet => {
      wallet.assets.forEach(asset => {
        uniqueAssets.add(asset.name);
      });
    });
    return Array.from(uniqueAssets).map(asset => ({
      label: asset, 
      value: asset,
      subLabel: undefined
    })) as { label: string; value: string; subLabel?: string }[];
  }
  return []; 
});

const networkOptions = computed(() => {
  const uniqueNetworks = new Set<string>(); 
  if (allWallets.value) {
    allWallets.value.forEach(wallet => {
      wallet.assets.forEach(asset => {
        const networkName = asset.asset.network.charAt(0).toUpperCase() + asset.asset.network.slice(1).toLowerCase();
        uniqueNetworks.add(networkName);
      });
    });

    return Array.from(uniqueNetworks).map(network => ({
      label: network,  
      value: network,  
      subLabel: undefined 
    })) as { label: string; value: string; subLabel?: string }[];
  }

  return []; 
});

const idFilterSelectValues = ref({});
const idFilterSelectNumber = ref(0);
const assetFilterSelectValues = ref({});
const assetFilterSelectNumber = ref(0);
const networkFilterSelectValues = ref({});
const networkFilterSelectNumber = ref(0);

const totalPages = computed(() => {
  return Math.ceil(filteredWallets.value.length / viewsPerPage.value);
});

watch([idFilterSelectValues, idFilterSelectNumber, assetFilterSelectValues, assetFilterSelectNumber, networkFilterSelectValues, networkFilterSelectNumber], () => {
  walletStore.setWallets(filterWallets());
  paginationStore.initializeStore(filterWallets().length);
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = 1; 
    router.push({ query: { page: currentPage.value, view: viewsPerPage.value } });
  }
});

function filterWallets() {
  
  if (!allWallets.value) {
    return []; 
  }

  return allWallets.value.filter(wallet => {
    const idFilterPass = idFilterSelectNumber.value === 0 || idFilterSelectValues.value[wallet.id];

    const assetFilterPass = assetFilterSelectNumber.value === 0 || wallet.assets.some(asset => 
      assetFilterSelectValues.value[asset.name]
    );

    const networkFilterPass = networkFilterSelectNumber.value === 0 || wallet.assets.some(asset => 
      networkFilterSelectValues.value[asset.asset.network.charAt(0).toUpperCase() + asset.asset.network.slice(1).toLowerCase()]
    );

    return idFilterPass && assetFilterPass && networkFilterPass;
  });
}

const filteredWallets = computed(() => filterWallets());

const paginatedWallets = computed(() => {
  const startIndex = (currentPage.value - 1) * viewsPerPage.value;
  const endIndex = startIndex + viewsPerPage.value;
  return filteredWallets.value.slice(startIndex, endIndex);
});
</script>

<template>
  <div class="py-4 px-6 flex flex-col w-full gap-4">
    <div class="flex items-center gap-2 p-1">
      <DropdownFilterMenu 
      id="nameDropdownfiltermenu" 
      label="Name/identifier" 
      :options="nameIdentifierOptions"
      @update:selectedValues="(values:TypeSelectedList) => {idFilterSelectValues = values}"
      @update:numberOfSelected="(count:number) => {idFilterSelectNumber = count}"
      >
         <button class="flex items-center gap-2 py-1 px-2 rounded-[100px] border bg-[#F6F6F9] border-[#D2D3D7] text-sm text-neutral-1100">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.99194 0.591271C5.04138 0.31959 4.86121 0.0592747 4.58953 0.0098418C4.31784 -0.039591 4.05753 0.140577 4.0081 0.412259L3.53721 3.00021L1.49602 3C1.21988 2.99997 0.996001 3.22381 0.995972 3.49995C0.995943 3.77609 1.21978 3.99997 1.49592 4L3.35527 4.00019L2.62751 7.99991L0.499979 8C0.223836 8.00001 -1.16811e-05 8.22388 4.57185e-10 8.50002C1.17137e-05 8.77616 0.223879 9.00001 0.500021 9L2.44556 8.99992L2.00694 11.4106C1.95751 11.6822 2.13768 11.9425 2.40936 11.992C2.68104 12.0414 2.94136 11.8612 2.99079 11.5896L3.46199 8.99987L7.44424 8.99971L7.00532 11.4087C6.95582 11.6804 7.13592 11.9407 7.40759 11.9902C7.67926 12.0397 7.93962 11.8596 7.98912 11.5879L8.46071 8.99966L10.5 8.99958C10.7762 8.99956 11 8.7757 11 8.49956C11 8.22341 10.7761 7.99956 10.5 7.99958L8.64291 7.99966L9.3715 4.00082L11.5 4.00105C11.7762 4.00108 12.0001 3.77724 12.0001 3.5011C12.0001 3.22496 11.7763 3.00108 11.5002 3.00105L9.5537 3.00084L9.99258 0.592062C10.0421 0.320392 9.86198 0.0600336 9.59031 0.010535C9.31864 -0.0389636 9.05828 0.141142 9.00878 0.412812L8.53726 3.00074L4.55361 3.00032L4.99194 0.591271ZM4.37167 4.0003L8.35506 4.00072L7.62644 7.9997L3.64394 7.99987L4.37167 4.0003Z" fill="#5A5A5E"/>
            </svg>
            Name/identifier
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5" fill="none">
            <path d="M0.146447 0.646447C0.341709 0.451184 0.658291 0.451184 0.853553 0.646447L4 3.79289L7.14645 0.646447C7.34171 0.451184 7.65829 0.451184 7.85355 0.646447C8.04882 0.841709 8.04882 1.15829 7.85355 1.35355L4.35355 4.85355C4.15829 5.04882 3.84171 5.04882 3.64645 4.85355L0.146447 1.35355C-0.0488155 1.15829 -0.0488155 0.841709 0.146447 0.646447Z" fill="#5A5A5E"/>
              </svg>
          </button>
      </DropdownFilterMenu>
      <DropdownFilterMenu 
      id="assetDropdownfiltermenu" 
      label="Asset" 
      :options="assetOptions"
      @update:selectedValues="(values:TypeSelectedList) => {assetFilterSelectValues = values}"
      @update:numberOfSelected="(count:number) => {assetFilterSelectNumber = count}"
      >
        <button class="flex items-center gap-2 py-1 px-2 rounded-[100px] border bg-[#F6F6F9] border-[#D2D3D7] text-sm text-neutral-1100">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8.0013 1.33311C4.32797 1.33311 1.33464 4.32644 1.33464 7.99978C1.33464 11.6731 4.32797 14.6664 8.0013 14.6664C11.6746 14.6664 14.668 11.6731 14.668 7.99978C14.668 4.32644 11.6746 1.33311 8.0013 1.33311ZM8.0013 13.6664C4.87464 13.6664 2.33464 11.1264 2.33464 7.99978C2.33464 4.87311 4.87464 2.33311 8.0013 2.33311C11.128 2.33311 13.668 4.87311 13.668 7.99978C13.668 11.1264 11.128 13.6664 8.0013 13.6664Z" fill="#8E8F98"/>
          <path d="M9.92463 9.57311C9.92463 10.4331 9.3513 11.0931 8.50464 11.2798V12.1664C8.50464 12.4398 8.27797 12.6664 8.00464 12.6664C7.7313 12.6664 7.50464 12.4398 7.50464 12.1664V11.2798C6.65797 11.0931 6.08464 10.4331 6.08464 9.57311C6.08464 9.29978 6.3113 9.07311 6.5913 9.07311C6.86464 9.07311 7.08464 9.29978 7.08464 9.57311C7.08464 10.1331 7.58464 10.3331 8.00464 10.3331C8.42464 10.3331 8.92464 10.1331 8.92464 9.57311C8.92464 9.11978 8.70464 8.95311 7.49797 8.23311L7.2713 8.09978C6.74464 7.79311 6.08464 7.41311 6.08464 6.42644C6.08464 5.56644 6.65797 4.90644 7.50464 4.71978V3.83311C7.50464 3.55978 7.7313 3.33311 8.00464 3.33311C8.27797 3.33311 8.50464 3.55978 8.50464 3.83311V4.73311C9.31797 4.95311 9.92463 5.69978 9.92463 6.58644C9.92463 6.85978 9.69797 7.07978 9.41797 7.07978C9.14464 7.07978 8.92464 6.85978 8.92464 6.58644C8.92464 6.07978 8.5113 5.66644 8.00464 5.66644C7.58464 5.66644 7.08464 5.86644 7.08464 6.42644C7.08464 6.81978 7.26464 6.93978 7.7713 7.23311L7.9513 7.33978C9.24463 8.11311 9.92463 8.51978 9.92463 9.57311Z" fill="#8E8F98"/>
          </svg>
         Asset
         <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5" fill="none">
            <path d="M0.146447 0.646447C0.341709 0.451184 0.658291 0.451184 0.853553 0.646447L4 3.79289L7.14645 0.646447C7.34171 0.451184 7.65829 0.451184 7.85355 0.646447C8.04882 0.841709 8.04882 1.15829 7.85355 1.35355L4.35355 4.85355C4.15829 5.04882 3.84171 5.04882 3.64645 4.85355L0.146447 1.35355C-0.0488155 1.15829 -0.0488155 0.841709 0.146447 0.646447Z" fill="#5A5A5E"/>
          </svg>
      </button>
      </DropdownFilterMenu>
      <DropdownFilterMenu 
      id="networkDropdownfiltermenu" 
      label="Network" 
      :options="networkOptions"
      @update:selectedValues="(values:TypeSelectedList) => {networkFilterSelectValues = values}"
      @update:numberOfSelected="(count:number) => {networkFilterSelectNumber = count}"
      >
        <button class="flex items-center gap-2 py-1 px-2 rounded-[100px] border bg-[#F6F6F9] border-[#D2D3D7] text-sm text-neutral-1100">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
           <path d="M2.68004 3.26922C2.4319 3.41586 2.14245 3.5 1.83335 3.5C0.912879 3.5 0.166687 2.75381 0.166687 1.83333C0.166687 0.912858 0.912879 0.166666 1.83335 0.166666C2.75383 0.166666 3.50002 0.912858 3.50002 1.83333C3.50002 2.14241 3.41589 2.43183 3.26928 2.67995L5.1534 4.56407C5.40152 4.41746 5.69095 4.33333 6.00002 4.33333C6.30909 4.33333 6.59852 4.41746 6.84664 4.56407L8.73076 2.67995C8.58415 2.43183 8.50002 2.14241 8.50002 1.83333C8.50002 0.912858 9.24621 0.166666 10.1667 0.166666C11.0872 0.166666 11.8334 0.912858 11.8334 1.83333C11.8334 2.75381 11.0872 3.5 10.1667 3.5C9.85759 3.5 9.56814 3.41586 9.32 3.26922L7.43591 5.15331C7.58254 5.40145 7.66669 5.6909 7.66669 6C7.66669 6.30907 7.58256 6.5985 7.43595 6.84662L9.32007 8.73074C9.56819 8.58413 9.85761 8.5 10.1667 8.5C11.0872 8.5 11.8334 9.24619 11.8334 10.1667C11.8334 11.0871 11.0872 11.8333 10.1667 11.8333C9.24621 11.8333 8.50002 11.0871 8.50002 10.1667C8.50002 9.85757 8.58416 9.56812 8.7308 9.31998L6.84671 7.43589C6.59857 7.58252 6.30912 7.66667 6.00002 7.66667C5.69092 7.66667 5.40147 7.58252 5.15334 7.43589L3.26924 9.31998C3.41588 9.56812 3.50002 9.85757 3.50002 10.1667C3.50002 11.0871 2.75383 11.8333 1.83335 11.8333C0.912879 11.8333 0.166687 11.0871 0.166687 10.1667C0.166687 9.24619 0.912879 8.5 1.83335 8.5C2.14243 8.5 2.43185 8.58413 2.67997 8.73074L4.56409 6.84662C4.41748 6.5985 4.33335 6.30907 4.33335 6C4.33335 5.6909 4.4175 5.40145 4.56413 5.15331L2.68004 3.26922ZM2.66669 1.83333C2.66669 1.3731 2.29359 0.999999 1.83335 0.999999C1.37312 0.999999 1.00002 1.3731 1.00002 1.83333C1.00002 2.29357 1.37312 2.66667 1.83335 2.66667C2.29359 2.66667 2.66669 2.29357 2.66669 1.83333ZM2.66669 10.1667C2.66669 9.70643 2.29359 9.33333 1.83335 9.33333C1.37312 9.33333 1.00002 9.70643 1.00002 10.1667C1.00002 10.6269 1.37312 11 1.83335 11C2.29359 11 2.66669 10.6269 2.66669 10.1667ZM10.1667 2.66667C10.6269 2.66667 11 2.29357 11 1.83333C11 1.3731 10.6269 0.999999 10.1667 0.999999C9.70645 0.999999 9.33335 1.3731 9.33335 1.83333C9.33335 2.29357 9.70645 2.66667 10.1667 2.66667ZM11 10.1667C11 9.70643 10.6269 9.33333 10.1667 9.33333C9.70645 9.33333 9.33335 9.70643 9.33335 10.1667C9.33335 10.6269 9.70645 11 10.1667 11C10.6269 11 11 10.6269 11 10.1667ZM6.83335 6C6.83335 5.53976 6.46026 5.16667 6.00002 5.16667C5.53978 5.16667 5.16669 5.53976 5.16669 6C5.16669 6.46024 5.53978 6.83333 6.00002 6.83333C6.46026 6.83333 6.83335 6.46024 6.83335 6Z" fill="#5A5A5E"/>
        </svg>
         Network
         <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5" fill="none">
            <path d="M0.146447 0.646447C0.341709 0.451184 0.658291 0.451184 0.853553 0.646447L4 3.79289L7.14645 0.646447C7.34171 0.451184 7.65829 0.451184 7.85355 0.646447C8.04882 0.841709 8.04882 1.15829 7.85355 1.35355L4.35355 4.85355C4.15829 5.04882 3.84171 5.04882 3.64645 4.85355L0.146447 1.35355C-0.0488155 1.15829 -0.0488155 0.841709 0.146447 0.646447Z" fill="#5A5A5E"/>
          </svg>
      </button>
      </DropdownFilterMenu>
    </div>
    <div class="flex flex-row w-full items-center justify-between">
      <button @click="walletStore.toggleExpandAll" class="flex items-center gap-2 p-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" 
       :class="`transition-transform duration-300 ${expandedAll ? 'fill-[#0E0E52] rotate-90' : 'fill-[#5A5A5E]'}`">
        <path fill-rule="evenodd" clip-rule="evenodd" 
              :class="`${expandedAll ? 'fill-[#0E0E52]' : 'fill-[#5A5A5E]'}`"
              d="M0.71967 17.0303C0.426777 16.7374 0.426777 16.2626 0.71967 15.9697L7.68934 9L0.71967 2.03033C0.426777 1.73744 0.426777 1.26256 0.71967 0.969671C1.01256 0.676777 1.48744 0.676777 1.78033 0.969671L9.28033 8.46967C9.57322 8.76256 9.57322 9.23744 9.28033 9.53033L1.78033 17.0303C1.48744 17.3232 1.01256 17.3232 0.71967 17.0303Z" 
              />
      </svg>
      <span class="text-sm" :class="expandedAll ? 'text-[#0E0E52] font-bold':'text-[#5A5A5E] font-normal'">
        Expand all
      </span>
    </button>
      <span class="text-xs text-[#5A5A5E]">
        {{wallets?.length}} Wallets
      </span>
    </div>
  </div>
  <div class="text-center pb-4 px-6 overflow-y-auto h-fill-available w-fill-available">
    <div class="flex flex-col gap-2">
      <Wallet 
        v-for="(wallet, index) in paginatedWallets"
        :key="wallet.id"
        :wallet="wallet"
  />
    </div>
  </div>
</template>
