<script setup lang="ts">
import { reactive } from 'vue';
import UploadFile from './components/UploadFile.vue';

import { SongTable, UserWithSong } from './types';
import { shuffleSongs } from './util/csv-to-table';
import Table from './components/Table.vue';

const state = reactive<{
  table: SongTable,
  shuffled: UserWithSong[],
}>({
  table: [],
  shuffled: [],
});

function onTabledCreated(table: SongTable) {
  state.table = table;
  const shuffled = shuffleSongs(table);
  state.shuffled = shuffled;
}

</script>

<template>
  <UploadFile  v-if="state.shuffled.length === 0" @file="onTabledCreated" class="no-print"></UploadFile>
  <Table v-if="state.shuffled.length > 0" :songs="state.shuffled"></Table>
</template>

<style scoped>
</style>
