<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { REPO, REPO_URL } from './repo';

const CACHE_KEY = 'splitkit-stars';
const stars = ref<number | null>(null);

// The unauthenticated GitHub API allows 60 requests an hour per IP, so the count
// is cached for the browser session. If the request fails the button still
// works, it just doesn't show a number.
onMounted(async () => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      stars.value = Number(cached);
      return;
    }
  } catch {}
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`);
    if (!res.ok) return;
    const { stargazers_count } = await res.json();
    stars.value = stargazers_count;
    try {
      sessionStorage.setItem(CACHE_KEY, String(stargazers_count));
    } catch {}
  } catch {}
});
</script>

<template>
  <a class="star-button" :href="REPO_URL" target="_blank" rel="noopener" aria-label="Star expo-splitkit on GitHub">
    <span class="star-icon" aria-hidden="true">★</span>
    <span class="star-label">Star</span>
    <span v-if="stars !== null" class="star-count">{{ stars.toLocaleString() }}</span>
  </a>
</template>
