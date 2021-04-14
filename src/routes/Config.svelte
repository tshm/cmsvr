<script lang="ts">
  import { config } from '$lib/store';
  const displayName = (key: string) => key?.replace(/Percent/, '');
  const keys = [
    'topAreaHeightPercent',
    'middleWidthPercent',
    'bottomAreaHeightPercent',
  ];
  $: top = $config.topAreaHeightPercent + '%';
  $: mid = $config.middleWidthPercent + '%';
  $: bot = $config.bottomAreaHeightPercent + '%';
</script>

<div class="config">
  <h2>Config</h2>
  {#each keys as key}
    <form>
      <label for={key}> {displayName(key)}: {$config[key]} %</label>
      <input type="range" bind:value={$config[key]} />
    </form>
  {/each}
  <h3>preview</h3>
  <form class="preview" style="--top: {top}; --mid: {mid}; --bot: {bot}">
    <card class="t"><span>go to main shelf</span></card>
    <card class="l"><span>prev page</span></card>
    <card class="m"><span>change fit mode</span></card>
    <card class="r"><span>next page</span></card>
    <card class="b"><span>back to shelf</span></card>
  </form>
</div>

<style lang="scss">
  .config {
    padding-top: 3rem;
  }
  card {
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .preview {
    background-color: gray;
    width: 80%;
    height: 80%;
    margin: 1rem;

    display: grid;
    grid-template-columns: 1fr var(--mid) 1fr;
    grid-template-rows: var(--top) 1fr var(--bot);
    gap: 2px 2px;
    grid-template-areas:
      't t t'
      'l m r'
      'b b b';
    justify-content: stretch;
    align-items: stretch;
  }
  .t {
    grid-area: t;
    background-color: purple;
  }
  .l {
    grid-area: l;
    background-color: rgba(51, 128, 0, 0.5);
  }
  .m {
    grid-area: m;
    background-color: rgba(19, 0, 128, 0.5);
  }
  .r {
    grid-area: r;
    background-color: rgba(230, 192, 24, 0.5);
  }
  .b {
    grid-area: b;
    background-color: rgba(240, 25, 25, 0.5);
  }
  form {
    border: 1px gray solid;
    border-radius: 10px;
    box-shadow: 0 0 15px 4px rgba(0, 1, 0, 0.1);
    margin: 0.5rem;
  }
  label {
    display: block;
    font-size: 1.1rem;
    padding: 0.3rem;
  }
  input {
    padding: 0.1rem;
  }
</style>
