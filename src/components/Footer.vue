<script setup lang="ts">
import { usePaginationStore } from '@/stores/pagination.ts';
import { storeToRefs } from 'pinia';
import Select from '@/components/Select.vue';
import { watch } from 'vue';

const storePagination = usePaginationStore();
const { currentPage, viewsPerPage, paginationInfo } = storeToRefs(storePagination);

const handleSelectChange = (newValue: number) => {
  storePagination.setViewsPerPage(newValue); 
};


</script>

<template>
  <div class="flex w-full justify-between items-center text-sm leading-6 py-4 px-6 pb-6">
    <div class="flex gap-2 text-[#8E8F98] items-center">
      View
      <div>
        <Select
          :options="[3, 5, 10, 20]"
          :initialNumber="viewsPerPage"
          @update:selected="handleSelectChange"
        />
      </div>
      per page
    </div>
    <div class="flex gap-6">
      <div class="text-[#8E8F98]">
        {{ paginationInfo.viewsShowcase }}
      </div>
      <div class="flex gap-2 text-[#5A5A5E]">
        <button @click="storePagination.previousPage()"><</button>
        <div class="flex gap-2" v-if="paginationInfo.startOfPage">
          <button @click="storePagination.setPage(paginationInfo.startOfPage)">{{ paginationInfo.startOfPage }}</button>
          <div>...</div>
        </div>
        <button 
          :class="item === currentPage ? 'text-[#0E0E52] font-bold' : 'text-[#5A5A5E] font-normal'"  
          v-for="item in paginationInfo.pages" 
          @click="storePagination.setPage(item)" 
          :key="item"
        >
          {{ item }}
        </button>
        <div class="flex gap-2" v-if="paginationInfo.endOfPage">
          <div>...</div>
          <button @click="storePagination.setPage(paginationInfo.endOfPage)">{{ paginationInfo.endOfPage }}</button>
        </div>
        <button @click="storePagination.nextPage()">></button>
      </div>
    </div>
  </div>
</template>
