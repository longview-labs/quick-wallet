<script setup>
import { storeToRefs } from 'pinia'
import { useAccountsStore, useGlobalStore } from '../stores';
import { decryptWallet, freeDecryptedWallet } from '../../core/accounts/encryption';
import { TEST_PASSWORD } from '../../core/accounts';
import { downloadFile } from '../../utils';

const accountStore = useAccountsStore();
const globalStore = useGlobalStore();
const { accounts } = storeToRefs(accountStore);
const { createAccount, setActiveAccount } = accountStore;
const { setShowMainPopup } = globalStore;

const creating = ref(false);
const createSuccess = ref(false);

const showOverlay = computed(() => creating.value || createSuccess.value);

const setActive = async (address) => {
  setActiveAccount(address);
  setShowMainPopup(false);
}

const createNewAccount = async () => {
  creating.value = true;
  await createAccount();
  creating.value = false;
  createSuccess.value = true;
}

const downloadLatestKeyfile = async () => {
  const [last] = accounts.value.slice(-1);
  if (!last) return;

  const jwk = await decryptWallet(last.keyfile, TEST_PASSWORD);
  const content = JSON.stringify(jwk);
  const blob = new Blob([content], {type: "application/json"});
  const blobUrl  = URL.createObjectURL(blob);

  freeDecryptedWallet(jwk);

  downloadFile(blobUrl, "keyfile.json");
}
</script>

<template>
  <div class="quick-wallet__login-view">
    <div v-if="accounts.length > 0" class="quick-wallet__accounts-container">
      <p style="font-weight: 500;font-size: 14px;margin-bottom: 12px;font-family: sans-serif;">Permaweb Accounts</p>
      <div v-for="account in accounts" class="quick-wallet__account" @click="setActive(account.address)">
        <div class="avatar xs"></div>
        <div style="flex: 1;overflow: hidden;">
          <p style="font-weight: 500;">{{ account.nickname }}</p>
          <p style="font-size: 12px;">{{ account.address }}</p>
        </div>
      </div>
    </div>

    <p class="quick-wallet__create-account" @click="createNewAccount" style="text-align: center;margin: 0 16px 32px;"><u>create a new account</u></p>
  
    <div v-if="showOverlay" class="overlay">
      <p v-if="creating">Creating Account...</p>
      <div v-else-if="createSuccess" style="text-align: center;">
        <p style="font-size: 18px;margin-bottom: 12px;">Welcome to the Permaweb!</p>
        <p>
          <a style="font-size: 14px;text-decoration: underline;color: black;" href="javascript: void(0)" @click="createSuccess=false">Explore the Permaweb</a>
        </p>

        <p style="margin-top: 40px;">
          <a style="font-size: 14px;text-decoration: underline;color: #888;" href="javascript: void(0)" @click="downloadLatestKeyfile">Save keyfile to access wallet</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.quick-wallet__login-view {
  width: 100%;

  .overlay {
    font-family: sans-serif;

    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    background: rgba(255,255,255,.92);
  }
}

.quick-wallet__accounts-container {
  padding: 16px;
}

.quick-wallet__account {
  display: flex;
  align-items: center;

  font-family: sans-serif;

  border-radius: 8px;
  border: 1px solid black;

  padding: 12px 16px;
  margin-bottom: 12px;

  .avatar {
    margin-right: 12px;
    min-width: 38px;
    width: 38px;
    height: 38px;
  }
}

.quick-wallet__account:hover {
  background: #eaeaea;
  cursor: pointer;
}

.quick-wallet__account p {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-wallet__create-account:hover {
  cursor: pointer;
}
</style>