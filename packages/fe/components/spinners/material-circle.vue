<template>
  <svg class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">

    <circle
      class="path"
      fill="none"
      stroke-width="6"
      stroke-linecap="round"
      cx="33"
      cy="33"
      r="30" />

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'MaterialCircle'
}
</script>

<style lang="scss" scoped>
// /////////////////////////////////////////////////////// Variables & Keyframes
$offset: 187;
$duration: 1.5s;

@keyframes rotator {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(270deg); }
}

@keyframes dash {
  0% { stroke-dashoffset: $offset; }
  50% {
    stroke-dashoffset: math.div($offset, 4);
    transform:rotate(135deg);
  }
  100% {
    stroke-dashoffset: $offset;
    transform:rotate(450deg);
  }
}

// @keyframes colors {
//   0% { stroke: #4285F4; }
//   25% { stroke: #DE3E35; }
//   50% { stroke: #F7C223; }
//   75% { stroke: #1B9A59; }
//   100% { stroke: #4285F4; }
// }

// ///////////////////////////////////////////////////////////////////// General
.spinner {
  width: 1.5rem;
  height: 1.5rem;
  animation: rotator $duration linear infinite;
}

.path {
  stroke-dasharray: $offset;
  stroke-dashoffset: 0;
  stroke: tomato;
  transform-origin: center;
  animation: dash $duration ease-in-out infinite; // colors ($duration * 4) ease-in-out infinite; // UNCOMMENT FOR COLOR CHANGING
}
</style>
