<script setup>
const step = ref(0);

const emit = defineEmits(['steps-done'])

const { steps } = defineProps({
  steps: {
    type: Array,
    default: () => [],
  }
});

const nextStep = () => {
  if (step.value + 1 < steps.length) {
    step.value++;
  } else {
    emit("steps-done");
  }
};
const lastStep = () => step.value--;
</script>

<template>
  <div class="quick-wallet__stepped-view">
    <Transition name="fade-left" mode="out-in">
      <component v-if="steps" :is="steps[step]" v-bind="$attrs" :next="nextStep" :last="lastStep" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
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
</style>