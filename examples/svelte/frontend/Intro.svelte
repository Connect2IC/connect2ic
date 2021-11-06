<script lang="ts">
  import logo from "./assets/logo-dark.svg"
  import { onMount } from "svelte"
  import { counter } from "canisters/counter"

  let count: number = 0

  const refreshCounter = async () => {
    const res: any = await counter.getValue()
    count = res.toString()
  }

  const increment = async () => {
    await counter.increment()
    refreshCounter()
  }

  onMount(refreshCounter)
</script>

<header class="App-header">
  <h1>My first NFT</h1>
  <div
    style="cursor: pointer; width: 200px; height: 200px; border: 3px solid black; border-radius: 15px; font-size: 150px; display: flex; justify-content: center; align-items: baseline;">
    +
  </div>
  <p style="font-size: 0.4em;">by <a href="https://twitter.com/miamaruq">@miamaruq</a></p>
</header>

<style global>
    .App-logo {
        height: 15vmin;
        pointer-events: none;
    }

    .App-header {
        margin-top: 75px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: calc(10px + 2vmin);
    }

    .App-link {
        color: rgb(26, 117, 255);
    }

    .demo-button {
        background: #a02480;
        padding: 0 1.3em;
        margin-top: 1em;
        border-radius: 60px;
        font-size: 0.7em;
        height: 35px;
        outline: 0;
        border: 0;
        cursor: pointer;
        color: white;
    }

    .demo-button:active {
        color: white;
        background: #979799;
    }
</style>
