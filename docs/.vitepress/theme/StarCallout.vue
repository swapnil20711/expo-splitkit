<script setup lang="ts">
import { REPO_URL } from './repo';
</script>

<template>
  <div class="star-callout">
    <span>Found SplitKit useful? A star on GitHub helps other developers find it.</span>
    <a :href="REPO_URL" target="_blank" rel="noopener">★ Star on GitHub</a>
  </div>
</template>
