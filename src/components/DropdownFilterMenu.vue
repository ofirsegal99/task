<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { TypeSelectedList } from '@/types/dropdownTypes';

import { Checkbox } from '@/components/ui/checkbox'
import { computed, onBeforeMount, ref, watch, defineEmits  } from 'vue';



const isOpen = ref(false);
let selectedValues = ref<TypeSelectedList>({});
let selectedAll = ref(false);
let input = ref('');
let numberOfSelected = ref(0);
function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function closeDropdown() {
  isOpen.value = false;
}

const props = defineProps<{
  id: string,
  label: string,
  options: Array<{ label: string; value: string, subLabel?: string,
  }>; 
}>();


function handleSelect(event: { preventDefault: () => void; target: { innerText: any; }; }) {
      event.preventDefault();
};

function toggleAllCheckboxes(){
  selectedAll.value = !selectedAll.value;
}

function clearAllCheckboxes(){
  selectedAll.value = false;
  for (const key in selectedValues.value) {
    selectedValues.value[key] = false;
}}

watch(selectedAll, (newValue) => {
  for (const key in selectedValues.value) {
    selectedValues.value[key] = newValue;
  }
});

watch(selectedValues, (newValues) => {
  numberOfSelected.value = Object.values(newValues).filter(value => value).length;
}, { deep: true });


const emit = defineEmits<{
  (e: 'update:selectedValues', value: TypeSelectedList): void;
  (e: 'update:numberOfSelected', value: number): void;
}>();

watch(selectedValues, (newValues) => {
  let currentSelected = 0;

  for (const key in newValues) {
    if(newValues[key]) currentSelected++; 
  }
  numberOfSelected.value = currentSelected;
  emit('update:selectedValues', newValues); 
  emit('update:numberOfSelected', numberOfSelected.value); 
},{ deep: true });


function toggleCheckbox(option: { label: string; value: string, subLabel?: string,
  }){
      selectedValues.value[option.value] = !selectedValues.value[option.value];
}

onBeforeMount(() => {
  if (Object.keys(selectedValues.value).length === 0) {
    selectedValues.value = props.options.reduce((acc, item) => {
      acc[item.value] = false;
      return acc;
    }, {} as TypeSelectedList);
}});

const filteredOptions = computed(() => {
  const searchTerm = input.value.toLowerCase();
  return props.options.filter(option =>
    option.label.toLowerCase().includes(searchTerm)
  );
});


</script>

<template>
  <DropdownMenu v-model:open="isOpen">
    <DropdownMenuTrigger @click="toggleDropdown">
      <slot></slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent v-if="isOpen" class="p-0 w-full">
      <DropdownMenuLabel>
        <div class="flex flex-row w-full items-center justify-between py-2 px-4 leading-6 border-b border-[#DEEAFF] bg-white font-bold text-sm text-neutral-1100">
            {{props.label}}
            <button @click="closeDropdown">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M0.0885911 0.215694L0.146447 0.146447C0.320013 -0.0271197 0.589437 -0.046405 0.784306 0.0885911L0.853553 0.146447L6 5.293L11.1464 0.146447C11.32 -0.0271197 11.5894 -0.046405 11.7843 0.0885911L11.8536 0.146447C12.0271 0.320013 12.0464 0.589437 11.9114 0.784306L11.8536 0.853553L6.707 6L11.8536 11.1464C12.0271 11.32 12.0464 11.5894 11.9114 11.7843L11.8536 11.8536C11.68 12.0271 11.4106 12.0464 11.2157 11.9114L11.1464 11.8536L6 6.707L0.853553 11.8536C0.679987 12.0271 0.410563 12.0464 0.215694 11.9114L0.146447 11.8536C-0.0271197 11.68 -0.046405 11.4106 0.0885911 11.2157L0.146447 11.1464L5.293 6L0.146447 0.853553C-0.0271197 0.679987 -0.046405 0.410563 0.0885911 0.215694L0.146447 0.146447L0.0885911 0.215694Z" fill="#5A5A5E"/>
                </svg>
            </button>
        </div>
      </DropdownMenuLabel>
      <div class="flex flex-col p-4 border-b border-[#DEEAFF] gap-2">
              <div class="relative bg-[#EFF4FF] rounded border px-4 border-[#8DB4FE] w-full max-w-sm items-center">
                <Input autocomplete="off"   @mousedown.stop 
                @keydown.stop  v-model="input" :id="props.id" type="text" placeholder="Search..." class="p-0 pl-8 pr-6 border-none" />
                <span class="absolute h-4 w-4 top-2.5 start-5 inset-y-5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5.5 0C8.53757 0 11 2.46243 11 5.5C11 6.83879 10.5217 8.06586 9.72656 9.01962L13.8536 13.1464C14.0488 13.3417 14.0488 13.6583 13.8536 13.8536C13.68 14.0271 13.4106 14.0464 13.2157 13.9114L13.1464 13.8536L9.01962 9.72656C8.06586 10.5217 6.83879 11 5.5 11C2.46243 11 0 8.53757 0 5.5C0 2.46243 2.46243 0 5.5 0ZM5.5 1C3.01472 1 1 3.01472 1 5.5C1 7.98528 3.01472 10 5.5 10C7.98528 10 10 7.98528 10 5.5C10 3.01472 7.98528 1 5.5 1Z" fill="#1F1F1F"/>
                    </svg>               
                     </span>
                     <button v-if="input" @click="()=>{input=''}" class="absolute h-2 w-2 top-3.5 end-5 inset-y-5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M0.0885911 0.215694L0.146447 0.146447C0.320013 -0.0271197 0.589437 -0.046405 0.784306 0.0885911L0.853553 0.146447L4 3.293L7.14645 0.146447C7.34171 -0.0488154 7.65829 -0.0488154 7.85355 0.146447C8.04882 0.341709 8.04882 0.658291 7.85355 0.853553L4.707 4L7.85355 7.14645C8.02712 7.32001 8.0464 7.58944 7.91141 7.78431L7.85355 7.85355C7.67999 8.02712 7.41056 8.0464 7.21569 7.91141L7.14645 7.85355L4 4.707L0.853553 7.85355C0.658291 8.04882 0.341709 8.04882 0.146447 7.85355C-0.0488154 7.65829 -0.0488154 7.34171 0.146447 7.14645L3.293 4L0.146447 0.853553C-0.0271197 0.679987 -0.046405 0.410563 0.0885911 0.215694L0.146447 0.146447L0.0885911 0.215694Z" fill="#1F1F1F"/>
                        </svg>
                     </button>    
              </div>
              <div class="flex flex-row items-center p-1 gap-2 text-neutral-1100 text-sm font-semibold">
                <Checkbox 
                :checked="selectedAll"
                @click="toggleAllCheckboxes"
                id="all" class="cursor-pointer" />
                <label
                      for="all"
                      class="cursor-pointer select-none"
                    >
                    Select all ({{ props.options.length }})
                  </label>
              </div>
      </div>
      <div class="flex flex-col max-h-52 overflow-y-auto max-w-80">
        <DropdownMenuItem
        @select="handleSelect"
        v-for="option in filteredOptions"
        :key="option.value"
      >
      <div
      class="flex flex-row py-[0.4rem] px-4 gap-2"
      >
      <Checkbox
      :checked="selectedValues[option.value]"
      @click="toggleCheckbox(option)"
      :id="option.value" 
      class="cursor-pointer mt-[2px]" />
        <div 
        class="flex flex-col"
        >
          <label
          :for="option.value"
            class="cursor-pointer text-sm text-neutral-1100 font-normal"
          >
          {{ option.label }}

          </label>
          <label
          v-if="option.subLabel"
          :for="option.value"
            class="cursor-pointer text-[0.57rem] text-[#5A5A5E]"
          >
          {{ option.subLabel }}
          </label>
        </div>
      </div>
      </DropdownMenuItem>
      </div>
      <div class="flex flex-row items-center justify-between p-4 border-t bg-[#FAFAFC] border-[#EFF4FF]">
          <div class="text-sm text-[#5A5A5E] font-normal">
            {{ numberOfSelected }} selected
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0.433058 0.308058C0.677136 0.0639806 1.07286 0.0639806 1.31694 0.308058L7.56694 6.55806C7.81102 6.80214 7.81102 7.19786 7.56694 7.44194L1.31694 13.6919C1.07286 13.936 0.677136 13.936 0.433058 13.6919C0.188981 13.4479 0.188981 13.0521 0.433058 12.8081L6.24112 7L0.433058 1.19194C0.188981 0.947864 0.188981 0.552136 0.433058 0.308058Z" fill="#5A5A5E"/>
          </svg>      
        </div>
      <div class="flex flex-row items-center justify-between p-4 border-t border-[#EFF4FF]">
        <button v-if="numberOfSelected > 0" @click="clearAllCheckboxes" class="text-[#3E00FF] font-bold text-sm py-1 disabled:text-[#D2D3D7]">Clear all</button>
        <button v-if="numberOfSelected === 0" @click="closeDropdown" class="text-[#3E00FF] font-bold text-sm py-1 disabled:text-[#D2D3D7]">Close</button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>


