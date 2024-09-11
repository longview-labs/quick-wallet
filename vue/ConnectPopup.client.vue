<script setup lang="ts">
// @ts-nocheck

import { ref, computed } from 'vue';

import { showWalletConnect, useWalletConnection, useWalletConnectionOptions } from './composables';
import methods from './methods';

const $t = () => {};

const connection = useWalletConnection();
const connectionOptions = useWalletConnectionOptions();

const methodOptions = computed(() => connectionOptions.value.methods);

// refs
const methodsAvailability = ref(Object.keys(methods).reduce((a, m) => { a[m]=true;return a }, {}));
const connecting = ref(null);

const connectWithMethod = async (method) => {
  // abort connect function if already connecting
  if (connecting.value) return;
  if (!methods[method]) throw new Error("No method found");

  // redirect user to learn more about the wallet if not available
  const availability = methodsAvailability.value;
  if (!availability[method]) {
    window.open(methods[method]['learn_more']);
    return;
  }

  connecting.value = method;
  await methods[method]['connect']();
  const address = await methods[method]['getActiveAddress']();
  
  connection.value = {
    method,
    address,
    sign: methods[method]['sign'],
    getWalletInstance: methods[method]['getWalletInstance']
  };

  connecting.value = null;
  showWalletConnect.value = false;
};

const checkMethodAvailability = async () => {
  const availability = {};
  for (let method in methods) {
    const res = await methods[method]['isAvaliable']();
    availability[method] = res;
  }
  methodsAvailability.value = availability;
}

checkMethodAvailability();
</script>

<template>
  <Transition name="overlay-show">
    <div v-if="showWalletConnect" class="overlay">
      <div @click="showWalletConnect=false" class="backdrop"></div>

      <div class="content">
        <h3>Connect Wallet</h3>
        <div v-for="method in methodOptions" @click="connectWithMethod(method)" class="connect-option">
          <div class="connect-option-icon" :style="{'background-image': `url(https://arweave.net/${methods[method].logo})`, 'background-color': methods[method].theme}"></div>
          <div class="connect-option-detail">
            <p class="connect-option-name" :class="{'not-available': !methodsAvailability[method]}">
              {{ methods[method]['name'] }}
              <span v-if="!methodsAvailability[method]">(Not Available)</span>
              <span class="recommended" v-else-if="methods[method]['recommended']"> (Recommended)</span>
            </p>
            <p v-if="methodsAvailability[method]" class="connect-option-desc">
              {{ methods[method]['description'] }}
            </p>
            <p v-else class="connect-option-desc">Click to learn more about the wallet</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background: rgba(0, 0, 0, 0.5);
  }

  .content {
    background: #fff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    z-index: 1;

    padding: 16px;
    margin: 0 16px;
    max-width: 380px;
    border-radius: 16px;

    color: black;

    h3 {
      font-family: "Plus Jakarta Sans", sans-serif;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 120%;
      letter-spacing: 0;

      margin-bottom: 24px;
    }

    .connect-option {
      display: flex;
      align-items: center;
      border-radius: 12px;
      // padding: 12px;
      
      &:hover {
        background: #efefef;
        cursor: pointer;
      }

      &:not(:last-child) {
        margin-bottom: 16px;
      }

      .connect-option-icon {
        flex: 0 0 56px;
        height: 56px;

        border-radius: 12px;
        background-size: 30px 30px;
        background-position: center;
        background-repeat: no-repeat;
      }

      .connect-option-detail {
        margin-left: 16px;
      }

      .connect-option-name {
        font-family: "Plus Jakarta Sans", sans-serif;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 120%; /* 19.2px */
        letter-spacing: -0.16px;
        margin-bottom: 2px;

        &.not-available {
          opacity: 0.3;
        }

        .recommended {
          color: #8D90A5;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: 120%;
          letter-spacing: -0.24px;

          vertical-align: top;
          position: relative;
          top: 3px;
          left: 5px;
        }
      }

      .connect-option-desc {
        font-family: "Plus Jakarta Sans", sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%;
        letter-spacing: 0;
      }
    }
  }
}

// transition
.overlay-show-enter-active,
.overlay-show-leave-active {
  transition: all .3s;

  .backdrop {
    transition: opacity .3s;
  }

  .content {
    transition: all .3s;
  }
}

.overlay-show-enter-from,
.overlay-show-leave-to {
  .backdrop {
    opacity: 0;
  }

  .content {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
  }
}
</style>