<script setup>
import SteppedView from '../SteppedView.vue';
import PrivateKeyView from './PrivateKeyView.vue';
import CreateSuccessfulView from './CreateSuccessfulView.vue';

const steps = [PrivateKeyView, CreateSuccessfulView];
</script>

<template>
  <SteppedView v-bind="$attrs" :steps="steps" />
</template>