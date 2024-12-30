<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue';
import {
  Select as shadcnSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const props = defineProps<{
  options: number[];
  initialNumber: number; 
}>();

const emit = defineEmits<{
  (e: 'update:selected', value: number): void;
}>();

const selectedValue = ref(props.initialNumber.toString());


watch(() => props.initialNumber, (newValue) => {
  selectedValue.value = newValue.toString(); 
});

watch(selectedValue, (newValue) => {
  emit('update:selected', Number(newValue));
});

</script>

<template>
  <shadcnSelect v-model="selectedValue">
    <SelectTrigger class=" p-2 rounded border border-[#D2D3D7] flex flex-row gap-2 text-sm font-bold text-[#8E8F98]">
      <SelectValue :placeholder="selectedValue" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup >
        <SelectLabel>Select view per page</SelectLabel>
        <SelectItem 
          v-for="item in props.options" 
          :key="item"
          :value="item.toString()"
        >
          {{ item }} 
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </shadcnSelect>
</template>
