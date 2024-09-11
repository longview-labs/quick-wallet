<script setup lang="ts">
import { useWalletConnect, useWalletConnection } from './composables';

defineProps({
  block: { type: Boolean, default: false },
  mobile: { type: Boolean, default: false },
  color: String
})

const connection = useWalletConnection();
const connectWallet = useWalletConnect();

const onButtonClick = () => {
  if (!connection.value) {
    connectWallet();
  }
}
</script>

<template>
  <div @click="onButtonClick">
    <slot :connection="connection"></slot>
  </div>
</template>