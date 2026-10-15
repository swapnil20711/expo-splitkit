import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';

import StarButton from './StarButton.vue';
import StarCallout from './StarCallout.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(StarButton),
      'doc-footer-before': () => h(StarCallout),
    }),
};
