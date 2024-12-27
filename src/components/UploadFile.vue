<script setup lang="ts">
import { ref } from 'vue';
import { SongTable } from '../types';
import { parseData } from '../util/csv-to-table';

const emit = defineEmits<{
  (e: "file", songs: SongTable): void;
}>();

function fileFromInput(evt: Event) {
  const input = evt.target as HTMLInputElement;

  const files = input.files;
  if (!files || !files[0]) {
    return
  }

  const file = files[0];
  gotFile(file);
}

async function gotFile(file: File) {
  const f = await parseData(file);
  emit("file", f);
}

</script>

<template>
  <div>
    <input type="file" @change="fileFromInput" />
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
