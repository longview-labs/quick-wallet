<script setup>
import AccountCreatedView from './AccountCreatedView/index.vue';
import AccountView from './AccountView.vue';

import { useAccountsStore } from '../stores';

const accounts = useAccountsStore();

const backedup = computed(() => {
  return accounts.activeAccount && accounts.activeAccount.backedup;
})
</script>

<template>
  <div class="quick-wallet__main-view">
    <AccountCreatedView v-if="!backedup" @steps-done="accounts.setActiveAccountBackedup(true)" />
    <AccountView v-else />
  </div>
</template>

<style>
.quick-wallet__main-view {
  overflow: hidden;

  position: absolute;
  background: white;
  border: 1px solid #E9E9E9;
  box-shadow: 0px 8px 15px 1px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  max-width: 380px;
  width: 90vw;
}
</style>