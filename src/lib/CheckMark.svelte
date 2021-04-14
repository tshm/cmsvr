<script lang="ts">
  import { isRead } from '$lib/store';

  export let path = '';
</script>

{#if isRead(path)}
  <img class="check" src="check.svg" alt="read" />
{/if}

<style lang="scss">
  .check {
    position: relative;
    top: -3rem;
  }
</style>
