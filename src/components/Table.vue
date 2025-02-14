<script setup lang="ts">
import { PropType } from 'vue';
import { UserWithSong } from '../types';

defineProps({
  songs: {
    type: Array as PropType<UserWithSong[]>,
    required: true,
  }
});
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th class="th">
          №
        </th>
        <th class="th">
          Заказчик песни
        </th>
        <th class="th">
          Автор песни
        </th>
        <th class="th">
          Песня
        </th>
      </tr>

    </thead>
    <tbody>
      <tr v-for="(song, index) in songs">
        <td class="td">
          {{ index + 1 }}
        </td>
        <td class="td">
          {{ song.user }}
        </td>
        <td class="td">
          {{ song.song.singer }}
        </td>
        <td class="td">
          {{ song.song.name }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

.td,
.th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
