<script setup>
import { storeToRefs } from 'pinia'
import { useAccountsStore } from '../../stores';
import { freeDecryptedWallet } from '../../../core/accounts/encryption';
import { getKeyfile } from '../../../core/accounts';
import { downloadFile } from '../../../utils';

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

const accountStore = useAccountsStore();
const { accounts } = storeToRefs(accountStore);

const privateKeySaved = ref(false);

const downloadLatestKeyfile = async () => {
  if (privateKeySaved.value) {
    next();
  } else {
    const [last] = accounts.value.slice(-1);
    if (!last) return;

    const jwk = await getKeyfile();
    const content = JSON.stringify(jwk);
    const blob = new Blob([content], {type: "application/json"});
    const blobUrl  = URL.createObjectURL(blob);

    freeDecryptedWallet(jwk);

    downloadFile(blobUrl, `${last.address}.json`);

    privateKeySaved.value = true;
  }
}
</script>

<template>
  <div class="quick-wallet__private-key-view quick-wallet__popup-view">
    <div class="quick-wallet__popup-view-content">
      <div class="quick-wallet__popup-view-icon">
        <div class="icon key"></div>

        <div class="quick-wallet__popup-view-subicon">
          <Transition name="zoom-in" mode="out-in">
            <div v-if="!privateKeySaved" style="background: red;" class="icon notice"></div>
            <div v-else style="background: #46c046;" class="icon tick"></div>
          </Transition>
        </div>
      </div>

      <div class="quick-wallet__popup-view-text">
        <h3>Your private key</h3>
        <p>This is the “key to the car” on the Permaweb. Store it safely. It's not something you share publicly.</p>
      </div>
    </div>

    <div class="quick-wallet__popup-view-actions">
      <p>
        <a href="javascript: void(0);" class="action" @click="downloadLatestKeyfile">
          {{ !privateKeySaved ? "Save my private key to proceed" : "Continue" }}
        </a>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.quick-wallet__popup-view {
  padding: 28px;
}

.quick-wallet__popup-view-content {
  display: flex;
  white-space: initial;
  margin-bottom: 24px;

  .quick-wallet__popup-view-icon {
    position: relative;
    margin-right: 24px;

    .icon {
      width: 50px;
      height: 50px;
    }

    .quick-wallet__popup-view-subicon {
      position: absolute;
      bottom: 28px;
      right: 0;

      .icon {
        $subiconSize: 24px;

        width: $subiconSize;
        height: $subiconSize;
      }
    }
  }

  .quick-wallet__popup-view-text {
    h3 {
      margin-bottom: 4px;
    }

    p {
      font-size: 14px;
    }
  }
}

.quick-wallet__popup-view-actions {
  text-align: right;

  a {
    font-size: 14px;
    color: black;
    text-decoration: underline;
  }
}

.quick-wallet__private-key-view {
  width: 100%;
}
</style>