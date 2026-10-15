---
layout: page
title: Live demo
---

<script setup>
import { withBase } from 'vitepress';
</script>

<div class="demo-wrap">

# Live demo

This is the [example app](https://github.com/swapnil20711/expo-splitkit/tree/main/example) compiled for the web. It's the same code that runs on iOS and Android. Change the user id and watch the bucket score move, then press **Re-evaluate ×10** and watch nothing change. Everything is computed in your browser, so you can turn off your network and it keeps working.

<iframe :src="withBase('/live/index.html')" title="SplitKit live demo" class="demo-frame" loading="lazy"></iframe>

<p class="demo-open"><a :href="withBase('/live/index.html')" target="_blank" rel="noopener">Open the demo full screen ↗</a></p>

</div>

<style>
.demo-wrap {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}
.demo-wrap h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.demo-wrap p {
  color: var(--vp-c-text-2);
  line-height: 1.7;
}
.demo-frame {
  display: block;
  width: 100%;
  max-width: 480px;
  height: 820px;
  margin: 24px auto 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: #0b0b0c;
}
.demo-open {
  text-align: center;
}
</style>
