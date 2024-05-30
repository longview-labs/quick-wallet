<script setup>
import { useAccountsStore } from '../stores';
import { shortAddr } from '../../utils';
import { decryptWallet, freeDecryptedWallet } from '../../core/accounts/encryption';
import { TEST_PASSWORD } from '../../core/accounts';

const accounts = useAccountsStore();
const account = accounts.activeAccount;

const updateProfile = async () => {
  const jwk = await decryptWallet(account.keyfile, TEST_PASSWORD);
  freeDecryptedWallet(jwk);
  console.log(result);
}
</script>

<template>
  <div class="quick-wallet__private-key-view quick-wallet__popup-view">
    <div class="quick-wallet__popup-view-content">
      <div class="quick-wallet__popup-view-text">
        <h3>{{ account.nickname }}</h3>
        <h4>{{ shortAddr(account.address, 10) }}</h4>
      </div>
    </div>

    <div class="quick-wallet__popup-view-actions">
      <p><a href="javascript: void(0);" class="action" @click="updateProfile">Update your profile</a></p>
    </div>
  </div>
</template>