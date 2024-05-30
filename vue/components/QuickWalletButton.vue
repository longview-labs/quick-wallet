<script setup>
import { storeToRefs } from 'pinia'

import { useAccountsStore, useGlobalStore } from '../stores';
import MainView from '../views/MainView.vue';

const accounts = useAccountsStore();
const global = useGlobalStore();

const { accounts: allAccounts, active } = storeToRefs(accounts);
const { showMainPopup } = storeToRefs(global);
const { setShowMainPopup } = global;
const { loginAccount, createAccount } = accounts;

// button states
// 0: logged out, 1: success, 2: has active account, 3: creating account
const buttonState = ref(accounts.activeAccount ? 2 : 0);
const hasNotification = ref(accounts.activeAccount?.backedup===false);

const createOrLoginAccount = async () => {
  if (allAccounts.value.length === 0) {
    buttonState.value = 3;
    await createAccount();
    setTimeout(loginAccount, 2000);
    // showPopup.value = true;
  } else {
    loginAccount();
  }
};

const buttonClick = () => {
  if (buttonState.value === 2) {
    setShowMainPopup(!showMainPopup.value);
  } else if (buttonState.value === 0) {
    createOrLoginAccount();
  }
}

// watch active account changes
watch(active, (a) => {
  if (a) {
    buttonState.value = 1;
  } else {
    buttonState.value = 0;
  }
});

// watch button state changes for button animations
watch(buttonState, (s) => {
  if (s===1) {
    setTimeout(() => {
      buttonState.value=2;
    }, 3000);
  }
});

watch(() => accounts.activeAccount?.backedup, (flag) => {
  if (flag) {
    hasNotification.value = false;
  } else {
    setTimeout(() => {
      hasNotification.value = true;
    }, 10000);
  }
});
</script>

<template>
  <div class="quick-wallet__connect-container">
    <div class="quick-wallet__connect-button" :class="{active: buttonState !== 0}" @click="buttonClick">
      <Transition name="fade">
        <div v-if="buttonState===0" class="quick-wallet__button-bg default"></div>
        <div v-else-if="buttonState===1" class="quick-wallet__button-bg success"></div>
        <div v-else-if="buttonState===2" class="quick-wallet__button-bg signed-in"></div>
        <div v-else-if="buttonState===3" class="quick-wallet__button-bg default"></div>
      </Transition>

      <Transition name="fade-left" mode="out-in">
        <div v-if="buttonState===0" class="quick-wallet__button-inner">
          <div class="quick-wallet__button-icon">
            <div class="icon arweave"></div>
          </div>

          <div class="quick-wallet__button-text">
            <span>Permaweb Login</span>
            <!-- <span v-else>{{ accounts.activeAccount.nickname }}</span> -->
          </div>
        </div>

        <div v-else-if="buttonState===1" class="quick-wallet__button-inner success">
          <div class="quick-wallet__button-icon">
            <div class="icon tick"></div>
          </div>

          <div class="quick-wallet__button-text">
            <span>Signed In</span>
          </div>
        </div>

        <div v-else-if="buttonState===2" class="quick-wallet__button-inner">
          <div class="quick-wallet__button-icon">
            <div class="avatar"></div>
          </div>

          <div class="quick-wallet__button-text">
            <span>{{ accounts.activeAccount.nickname }}</span>
          </div>
        </div>

        <div v-else-if="buttonState===3" class="quick-wallet__button-inner">
          <div class="quick-wallet__button-icon">
            <Loader style="top: 2px;" />
          </div>

          <div class="quick-wallet__button-text">
            <span>Creating Account</span>
          </div>
        </div>
      </Transition>

      <Transition name="zoom-in">
        <div v-if="buttonState===2 && hasNotification" class="quick-wallet__notification-badge">{{ 1 }}</div>
      </Transition>
    </div>
    
    <Transition name="fade-up">
      <MainView
        v-if="showMainPopup"
        style="left: 0;top: calc(100% + 12px);" />
    </Transition>
  </div>
</template>

<style lang="scss">
.quick-wallet__connect-container {
  position: relative;
  display: inline-block;
}

$buttonRadius: 10px;
$iconSize: 20px;

.quick-wallet__connect-button {
  display: flex;
  align-items: center;
  height: 40px;
  width: 200px;

  font-family: "Work Sans";
  font-size: 16px;
  // font-weight: 500;

  padding: 8px 16px;
  border-radius: $buttonRadius;

  transition: .2s transform, .2s box-shadow;

  .quick-wallet__button-bg {
    border-radius: $buttonRadius;
    border: 1px solid black;

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    z-index: -1;

    &.default {
      background: white;

      &:before {
        content: "";
        transition: .2s opacity;
        opacity: 0;

        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(132deg, rgba(38,80,87,1) 0%, rgba(70,100,140,1) 10%, rgb(81, 139, 187) 34%, rgb(56, 166, 94) 100%);
        border-radius: $buttonRadius;
      }

      &:after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-image: url("../../assets/noise.png");
        background-size: 30px 30px;
        
        opacity: 0.5;
        border-radius: $buttonRadius;
      }
    }

    &.success {
      border-width: 0;
      
      &:before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(90deg, #90cf5d 0%, #74cc31 100%);
        background-size: 400% 400%;
        animation: gradient 2s ease infinite;

        border-radius: $buttonRadius;
      }
    }

    &.signed-in {
      border-width: 0;
      background: linear-gradient(132deg, rgba(38,80,87,1) 0%, rgba(70,100,140,1) 10%, rgba(73,129,175,1) 34%, rgba(53,157,89,1) 100%);
      // background: black;

      &:before {
        content: "";
        position: absolute;
        top: 2px;
        bottom: 2px;
        left: 2px;
        right: 2px;
        background: white;
        border-radius: $buttonRadius - 2px;
      }
    }
  }

  &:hover:not(.active) {
    transform: translateY(-3px);
    box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.25);

    .quick-wallet__button-inner {
      color: white;
    }

    .quick-wallet__button-bg.default {
      border-width: 0;

      &:before {
        opacity: 1;
      }
    }

    .icon {
      background-color: white;
    }
  }

  .quick-wallet__button-inner {
    display: flex;
    align-items: center;
    color: black;
    width: 100%;

    &.success {
      color: white;

      .icon {
        background-color: white;
      }
    }

    .quick-wallet__button-text {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .quick-wallet__button-icon {
      margin-right: 12px;
    }

    .icon {
      background-color: black;
      width: $iconSize;
      height: $iconSize;
    }

    .avatar {
      min-width: $iconSize;
      width: $iconSize;
      height: $iconSize;
    }
  }

  .quick-wallet__notification-badge {
    width: 20px;
    height: 20px;
    position: absolute;
    right: -6px;
    top: -5px;
    background: #FF3131;
    border-radius: 50%;
    
    line-height: 20px;
    text-align: center;

    font-size: 11px;
    font-weight: 500;
    color: white;

    .icon {
      background-color: white;

      width: 15px;
      height: 15px;
    }
  }
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.fade-up-enter-active, .fade-up-leave-active {
  transition: .2s all;

  &.fade-up-leave-to, &.fade-up-enter-from {
    transform: translateY(10px);
    opacity: 0;
  }
}

.fade-left-enter-active, .fade-left-leave-active {
  transition: .2s all;

  &.fade-left-enter-from {
    transform: translateX(10px);
    opacity: 0;
  }

  &.fade-left-leave-to {
    transform: translateX(-10px);
    opacity: 0;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: .2s all;

  &.fade-enter-from {
    opacity: 0;
  }

  &.fade-leave-to {
    opacity: 0;
  }
}

.zoom-in-enter-active, .zoom-in-leave-active {
  transition: .2s all;

  &.zoom-in-enter-from, &.zoom-in-leave-to {
    // opacity: 0;
    transform: scale(0);
  }
}

.quick-wallet__connect-button:hover {
  cursor: pointer;
}
</style>