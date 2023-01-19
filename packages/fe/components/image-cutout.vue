<template>
  <div class="card-cutout-wrapper">

    <svg
      class="clip-path-svg"
      width="1000px"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      viewBox="0 0 300 122">
      <defs>
        <clipPath :id="`${pathId}-outer`" clipPathUnits="objectBoundingBox">
          <path
            d="M 1 1 H 0 V 0.082 C 0 0.0367 0.0141 0 0.0314 0 H 0.2726 C 0.2801 0 0.2873 0.0069 0.2929 0.0194 L 0.3162 0.0708 C 0.3218 0.0833 0.329 0.0902 0.3365 0.0902 H 0.9686 C 0.9859 0.0902 1 0.1269 1 0.1721 V 1 Z"
            stroke-linejoin="arcs"
            class="path-element" />
        </clipPath>
      </defs>
    </svg>

    <slot></slot>

      <!-- <div class="card-inner-cutout">

        <svg
          class="clip-path-svg inner"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 319 122">
          <defs>
            <clipPath :id="`${pathId}-inner`">
              <path
                d="M 1000 122 H 0 V 10 C 0 4.4771 4.4771 0 10 0 H 86.8369 C 89.2021 0 91.4908 0.8384 93.2963 2.3661 L 100.704 8.6339 C 102.509 10.1616 104.798 11 107.163 11 H 1000 V 122 Z"
                stroke-linejoin="arcs"
                class="path-element" />
            </clipPath>
          </defs>
        </svg>

      </div> -->

    </div>
  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'CardCutout',

  data () {
    return {
      pathId: 'test-path'
    }
  },

  computed: {
    svgPath () {
      return 'M318.5 122H0V10C0 4.47715 4.47715 0 10 0H86.8369C89.2021 0 91.4908 0.83835 93.2963 2.36614L100.704 8.63386C102.509 10.1616 104.798 11 107.163 11H308.5C314.023 11 318.5 15.4772 318.5 21V122Z'
    }
  }
}
// M 318.5 122 H 0 V 0 H 308.5 L 308.5 11 H 308.5 C 314.023 11 318.5 15.4772 318.5 21 V 122 Z
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.card-cutout-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  clip-path: url(#test-path-outer);
}

.clip-path-svg {
  position: absolute;
}

</style>
