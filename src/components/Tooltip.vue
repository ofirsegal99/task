<script setup lang="ts">
import { defineProps } from 'vue';
import {
  Tooltip as shadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const props = defineProps<{
  mode: 'copy' | 'none';
  content: string;
  triggerProps?: Record<string, any>;
}>();

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.content);
};
</script>


<template>
    <TooltipProvider>
      <shadcnTooltip>
        <TooltipTrigger as-child>
                <slot name="trigger"></slot>
        </TooltipTrigger>
        <TooltipContent class="bg-[#35383C] my-2 overflow-visible rounded-md text-white py-1 px-2 flex flex-row">
            <div class="flex relative items-center justify-center gap-2">
                    <svg class="absolute bottom-[-10px]  left-1/2 transform -translate-x-1/2" xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 0L11.5 0L6 6L0.5 0Z" fill="#35383C"/>
                    </svg>
                  <p>{{ content }}</p>
                  <template v-if="mode === 'copy'">
                      <svg xmlns="http://www.w3.org/2000/svg" width="2" height="9" viewBox="0 0 2 9" fill="none">
                        <path d="M1 0.5L1 8.5" stroke="#5A5A5E"/>
                        </svg>
                      <button  @click="copyToClipboard">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 11" fill="none">
                        <path d="M0.800234 2.23771L0.8 7.58333C0.8 8.6879 1.62523 9.5917 2.6685 9.66224L2.8 9.66667L6.33152 9.66725C6.16663 10.1524 5.72228 10.5 5.2 10.5H2.4C1.07452 10.5 0 9.38071 0 8V3.41667C0 2.87232 0.334035 2.40924 0.800234 2.23771ZM6.8 0.5C7.46274 0.5 8 1.05964 8 1.75V7.58333C8 8.27369 7.46274 8.83333 6.8 8.83333H2.8C2.13726 8.83333 1.6 8.27369 1.6 7.58333V1.75C1.6 1.05964 2.13726 0.5 2.8 0.5H6.8ZM6.8 1.33333H2.8C2.57909 1.33333 2.4 1.51988 2.4 1.75V7.58333C2.4 7.81345 2.57909 8 2.8 8H6.8C7.02091 8 7.2 7.81345 7.2 7.58333V1.75C7.2 1.51988 7.02091 1.33333 6.8 1.33333Z" fill="white"/>
                        </svg>
                      </button>
                  </template>
            </div>
        </TooltipContent>
      </shadcnTooltip>
    </TooltipProvider>
  </template>
  
