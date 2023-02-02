<template>
  <div class="card-cutout-wrapper">

    <svg
      v-if="topTab && backgroundImage"
      width="104px"
      height="9px"
      viewBox="0 0 104 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="svg-clip-path">
      <defs>
        <clipPath id="corner-clip-path">
          <path d="M 104 9 H 104 C 103 9 103 9 102 9 L 88 0 C 88 0 87 0 87 0 H 9 C 4 0 0 4 0 9 V 9 Z" />
        </clipPath>
      </defs>
    </svg>

    <!-- <img
      v-if="topTab && backgroundImage"
      class="clipped-background-image"
      :src="backgroundImage" /> -->

    <div
      v-if="topTab && backgroundImage"
      class="clipped-background-image"
      :style="{ 'background-image': `url('${backgroundImage}')` }">
    </div>

    <svg
      v-if="topTab && !backgroundImage"
      width="104px"
      height="11.5px"
      viewBox="0 0 104 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="tab-before">
      <path
        d="M 104 9 H 104 C 103 9 103 9 101.815 8.8108 L 88.368 0.3095 C 88.048 0.1073 87.678 0 87.299 0 H 9 C 4.0294 0 0 4.0294 0 9 V 9 Z"
        fill="white" />
    </svg>

    <svg
      v-if="bottomTab"
      width="24px"
      height="10px"
      viewBox="0 0 24 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="tab-after">
      <path
        d="M 24 0 H 0 C 2.3938 0.285 4.7082 1.144 6.5227 2.705 L 12.7684 8.08 C 14.5829 9.641 16.8973 10.5 19.2911 10.5 H 24 Z"
        fill="white" />
    </svg>

    <div :class="['bg-left', { 'corner-radius': !topTab }]"></div>

    <div :class="['bg-right', { extended: bottomTab }]"></div>

    <div class="card-contents">
      <slot></slot>
    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'CardCutout',

  props: {
    topTab: {
      type: Boolean,
      required: false,
      default: true
    },
    bottomTab: {
      type: Boolean,
      required: false,
      default: true
    },
    backgroundImage: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.card-cutout-wrapper {
  position: relative;
  filter: drop-shadow(0 0 1.25rem rgba(#566A60, 0.25));
}

svg {
  background-color: none;
}

.svg-clip-path {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.tab-before,
.tab-after,
.bg-left,
.bg-right {
  position: absolute;
}

.tab-before {
  top: -0.625rem;
  left: 0;
  &:not(.clipped) {
    @include medium {
      width: 62px;
      height: 0.375rem;
      top: -0.34375rem;
    }
  }
  &.clipped {
    clip-path: url(#corner-clip-path);
    top: -8.5px;
  }
}

.clipped-background-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: toRem(122);
  clip-path: url(#corner-clip-path);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  transform: translateY(-8.5px);
  @include medium {
    transform: translateY(-4.5px);
    height: toRem(118);
  }
}

#corner-clip-path {
  path {
    @include medium {
      d: path('M 61 5 H 61 C 61 5 61 5 60 5 L 52 0 C 52 0 51 0 51 0 H 5 C 2 0 0 2 0 5 V 5 Z');
    }
  }
}

.tab-after {
  bottom: -0.625rem;
  left: 86px;
  @include medium {
    width: 14px;
    height: 0.375rem;
    bottom: -0.375rem;
    left: 50px;
  }
}

.bg-left,
.bg-right {
  top: 0;
  height: 100%;
  background-color: white;
}

.bg-left {
  left: 0;
  width: 110px;
  @include medium {
    width: 4rem;
  }
  border-bottom-left-radius: 0.625rem;
  &.corner-radius {
    border-top-left-radius: 0.625rem;
  }
}

.bg-right {
  left: 109px;
  width: calc(100% - 109px);
  border-top-right-radius: 0.625rem;
  border-bottom-right-radius: 0.625rem;
  &.extended {
    height: calc(100% + 0.625rem);
  }
  @include medium {
    left: 62px;
    width: calc(100% - 62px);
    &.extended {
      height: calc(100% + 0.375rem);
    }
  }
}

.card-contents {
  position: relative;
}

</style>
