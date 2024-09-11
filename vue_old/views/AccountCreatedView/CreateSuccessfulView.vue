<script setup>
import { storeToRefs } from 'pinia'
import { useAccountsStore } from '../../stores';

const { next, last } = defineProps({
  next: {
    type: Function,
    default: () => {}
  },
  last: {
    type: Function,
    default: () => {}
  }
})

const accounts = useAccountsStore();
const account = accounts.lastAccount;
</script>

<template>
  <div class="quick-wallet__private-key-view quick-wallet__popup-view">
    <div class="quick-wallet__popup-view-content">
      <div class="quick-wallet__popup-view-text">
        <p style="margin-bottom: 12px;">Your Permaweb account is activated!</p>

        <h3>{{ account.nickname }}</h3>
        <h3>{{ account.address }}</h3>
      </div>
    </div>

    <div class="quick-wallet__popup-view-actions">
      <p><a href="javascript: void(0);" class="action" @click="next">Go to app</a></p>
    </div>
  </div>
</template>