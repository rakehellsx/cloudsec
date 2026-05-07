<!--
设计约束：Neo-Enterprise Minimalism，新企业级极简控制台美学。图标必须服务“指标—趋势—证据—处置”的安全运营闭环，采用 24px 线性 SVG、圆角端点与 currentColor 继承，确保在深蓝侧栏、白色内容区、选中态与悬停态中保持一致的可审计感和功能辨识度。
-->
<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  name?: string;
  size?: number | string;
  strokeWidth?: number | string;
  label?: string;
}>(), {
  name: 'default',
  size: 20,
  strokeWidth: 1.9,
  label: '',
});

const iconPaths: Record<string, string> = {
  default: '<path d="M12 3.5 20 7.5v5.4c0 4.1-2.8 7-8 8.6-5.2-1.6-8-4.5-8-8.6V7.5l8-4Z"/><path d="m8.8 12 2.1 2.1 4.6-4.8"/>',
  overview: '<path d="M4 19V8.8l8-4.6 8 4.6V19"/><path d="M8 19v-6h8v6"/><path d="M8.8 9.6h.1M12 8h.1M15.2 9.6h.1"/><path d="M6.8 16.5h10.4"/>',
  alerts: '<path d="M12 3.5 4.7 7.2v5.6c0 4 2.6 6.8 7.3 8.5 4.7-1.7 7.3-4.5 7.3-8.5V7.2L12 3.5Z"/><path d="M12 7.5v5.2"/><path d="M12 16.3h.1"/><path d="M8.5 18.2h7"/>',
  intelligence: '<path d="M7.8 14.5a5.7 5.7 0 1 1 8.4 0c-.8.8-1.2 1.6-1.3 2.7H9.1c-.1-1.1-.5-1.9-1.3-2.7Z"/><path d="M9.2 20h5.6"/><path d="M10 17.2h4"/><path d="M12 7.8v2.8l2 1.2"/>',
  trace: '<path d="M4 6.2h4.2l2 3.2h3.6l2-3.2H20"/><path d="M4 17.8h4.2l2-3.2h3.6l2 3.2H20"/><path d="M8 6.2v11.6"/><path d="M16 6.2v11.6"/><circle cx="12" cy="12" r="2.2"/>',
  risk: '<path d="M12 3.5 20 7v5.1c0 4.3-2.8 7.5-8 9.4-5.2-1.9-8-5.1-8-9.4V7l8-3.5Z"/><path d="m12 7.7 4 7H8l4-7Z"/><path d="M12 10.5v2.1"/><path d="M12 14.7h.1"/>',
  assets: '<path d="M5 7.5 12 4l7 3.5-7 3.5-7-3.5Z"/><path d="M5 12 12 15.5 19 12"/><path d="M5 16.3 12 20l7-3.7"/><path d="M5 7.5v8.8M19 7.5v8.8"/>',
  rules: '<path d="M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z"/><path d="M8 8h8"/><path d="M8 12h5"/><path d="M8 16h3"/><path d="m14 15.5 1.2 1.2 2.5-3"/>',
  warning: '<path d="M5 8.2 12 13l7-4.8"/><path d="M5.5 6h13A1.5 1.5 0 0 1 20 7.5v9A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5v-9A1.5 1.5 0 0 1 5.5 6Z"/><path d="M16.8 5.2 18.3 3.7M19.2 8.8h2M14.5 3.5l-.7-1.8"/>',
  process: '<path d="M6 5h5l2 3h5"/><path d="M6 12h12"/><path d="M6 19h5l2-3h5"/><circle cx="5" cy="5" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="5" cy="19" r="1.5"/><circle cx="19" cy="8" r="1.5"/><circle cx="19" cy="16" r="1.5"/>',
  behavior: '<path d="M4 18c2.6-5.5 5-7.2 8-5 2.9 2.1 4.9 1.2 8-4"/><path d="M5 6h3v3H5zM10.5 15h3v3h-3zM16 5h3v3h-3z"/>',
  topology: '<circle cx="6" cy="7" r="2.3"/><circle cx="18" cy="7" r="2.3"/><circle cx="12" cy="17" r="2.3"/><path d="M8 8.2 10.3 14.8M16 8.2l-2.3 6.6M8.4 7h7.2"/>',
  profile: '<circle cx="12" cy="8" r="3.2"/><path d="M5.8 20c.8-3.8 3-5.6 6.2-5.6s5.4 1.8 6.2 5.6"/><path d="M15.8 4.5 18 3M8.2 4.5 6 3"/>',
  packet: '<path d="M4.5 7.5 12 3.8l7.5 3.7v8.9L12 20.2l-7.5-3.8V7.5Z"/><path d="M4.8 7.7 12 11.4l7.2-3.7"/><path d="M12 11.4V20"/><path d="M8.2 13.6v2.6M15.8 13.6v2.6"/>',
  region: '<path d="M12 21s6-5.1 6-10.3A6 6 0 0 0 6 10.7C6 15.9 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2.2"/>',
  vpc: '<path d="M6.5 15.5a3.6 3.6 0 0 1 .7-7.1A5.3 5.3 0 0 1 17.4 10a2.9 2.9 0 0 1 .2 5.8H6.5Z"/><path d="M8 18h8M12 15.8V20"/>',
  physical: '<path d="M6 4.5h12v15H6z"/><path d="M9 8h6M9 12h6M9 16h3"/><path d="M18 8h2M18 12h2M18 16h2M4 8h2M4 12h2M4 16h2"/>',
  host: '<rect x="5" y="6" width="14" height="9" rx="1.5"/><path d="M9 19h6M12 15v4"/><path d="M8 9h8M8 12h5"/>',
  container: '<path d="M5 7.2 12 4l7 3.2v9.6L12 20l-7-3.2V7.2Z"/><path d="M8.2 8.8h7.6M8.2 12h7.6M8.2 15.2h7.6"/>',
  vulnerability: '<path d="M12 4.2 19 8v4.8c0 3.8-2.4 6.5-7 8-4.6-1.5-7-4.2-7-8V8l7-3.8Z"/><path d="M9.5 9.8 14.5 14.8M14.5 9.8 9.5 14.8"/>',
  password: '<rect x="5" y="10" width="14" height="10" rx="1.5"/><path d="M8.5 10V7.8a3.5 3.5 0 0 1 7 0V10"/><path d="M12 14v2.5"/>',
  baseline: '<path d="M4 18h16"/><path d="M6 15.5 9.5 11l3 2.5L18 6"/><path d="M6 6v9.5"/>',
  config: '<path d="M5 7h14M5 12h14M5 17h14"/><circle cx="9" cy="7" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="11" cy="17" r="1.6"/>',
  group: '<path d="M8 7h8v4H8zM4.5 15h7v4h-7zM12.5 15h7v4h-7z"/><path d="M12 11v4M8 15v-2h8v2"/>',
  whitelist: '<path d="M5.5 12.5 10 17l8.5-10"/><path d="M12 3.8 20 7.4V12c0 4.2-2.8 7.4-8 9-5.2-1.6-8-4.8-8-9V7.4l8-3.6Z"/>',
  mail: '<path d="M5 8.2 12 13l7-4.8"/><rect x="4" y="6" width="16" height="12" rx="1.5"/>',
  recipients: '<circle cx="8.2" cy="8" r="2.4"/><path d="M3.8 18c.5-3 2-4.4 4.4-4.4 1.2 0 2.2.4 3 1.1"/><circle cx="16" cy="9" r="2.1"/><path d="M12.3 18.2c.5-2.6 1.8-3.9 3.8-3.9s3.2 1.3 3.8 3.9"/>',
  smtp: '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M8 9h8M8 12h8M8 15h5"/><path d="M19 8.5h1.5M19 12h1.5M19 15.5h1.5M3.5 8.5H5M3.5 12H5M3.5 15.5H5"/>',
  all: '<path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z"/>',
  external: '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M3.8 12h16.4M12 3c2.2 2.3 3.3 5.3 3.3 9s-1.1 6.7-3.3 9M12 3c-2.2 2.3-3.3 5.3-3.3 9s1.1 6.7 3.3 9"/>',
  lateral: '<path d="M5 8h6V5l5 5-5 5v-3H5z"/><path d="M4 18h16"/>',
  sql: '<ellipse cx="12" cy="6" rx="6" ry="2.5"/><path d="M6 6v8c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6"/><path d="M8.5 20 12 16.5 15.5 20"/>',
  scan: '<path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3"/><path d="M7 12h10M12 7v10"/><circle cx="12" cy="12" r="3"/>',
  brute: '<rect x="5" y="10" width="14" height="9" rx="1.5"/><path d="M8 10V7.8a4 4 0 0 1 7.5-1.9"/><path d="M9 14h6M9 16.5h4"/>',
  outbound: '<path d="M5 19 19 5"/><path d="M12 5h7v7"/><path d="M4.5 10.5a7.5 7.5 0 0 0 9 9"/>',
  unauthorized: '<circle cx="12" cy="12" r="8"/><path d="m7 17 10-10"/><path d="M9 9.5c.7-1 1.7-1.5 3-1.5 1.8 0 3 1 3 2.6 0 1.2-.6 2-1.9 2.6-.8.4-1.1.8-1.1 1.6"/><path d="M12 17h.1"/>',
  leak: '<path d="M12 3.5s5 5.4 5 10a5 5 0 0 1-10 0c0-4.6 5-10 5-10Z"/><path d="M9.5 16c1.4 1.1 3.6 1.1 5 0"/>',
  refresh: '<path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M18.2 9A7 7 0 0 0 6.3 6.5M5.8 15A7 7 0 0 0 17.7 17.5"/>',
  search: '<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/>',
  filter: '<path d="M4 6h16l-6 7v5l-4 2v-7L4 6Z"/>',
  export: '<path d="M12 4v9"/><path d="m8.5 9.5 3.5 3.5 3.5-3.5"/><path d="M5 16.5V20h14v-3.5"/>',
  edit: '<path d="M5 19h4l10-10-4-4L5 15v4Z"/><path d="m13.5 6.5 4 4"/>',
  delete: '<path d="M5 7h14"/><path d="M9 7V5h6v2"/><path d="M8 10v8M12 10v8M16 10v8"/><path d="M7 7l1 14h8l1-14"/>',
  copy: '<rect x="8" y="8" width="11" height="11" rx="1.5"/><path d="M5 15V5h10"/>',
  eye: '<path d="M3.5 12s3.2-5.5 8.5-5.5 8.5 5.5 8.5 5.5-3.2 5.5-8.5 5.5S3.5 12 3.5 12Z"/><circle cx="12" cy="12" r="2.5"/>',
  shield: '<path d="M12 3.5 20 7v5c0 4.4-2.8 7.5-8 9-5.2-1.5-8-4.6-8-9V7l8-3.5Z"/><path d="m8.5 12 2.4 2.4 4.8-5"/>',
  server: '<rect x="5" y="4" width="14" height="6" rx="1.2"/><rect x="5" y="14" width="14" height="6" rx="1.2"/><path d="M8 7h.1M8 17h.1M11 7h5M11 17h5"/>',
  network: '<circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="7" r="2.2"/><circle cx="18" cy="17" r="2.2"/><path d="M8 11 16 8M8 13l8 3"/>',
  user: '<circle cx="12" cy="8" r="3"/><path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6"/>',
  bell: '<path d="M6.5 16h11l-1.1-1.8V10a4.4 4.4 0 0 0-8.8 0v4.2L6.5 16Z"/><path d="M10 18.5a2.2 2.2 0 0 0 4 0"/>',
};

const normalizedName = computed(() => props.name?.trim() || 'default');
const svgContent = computed(() => iconPaths[normalizedName.value] ?? iconPaths.default);
const ariaHidden = computed(() => props.label ? undefined : 'true');
</script>

<template>
  <svg
    class="app-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :stroke-width="strokeWidth"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-label="label || undefined"
    :aria-hidden="ariaHidden"
    role="img"
    v-html="svgContent"
  />
</template>
