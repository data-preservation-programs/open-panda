<template>
  <div id="identifier">

    <ButtonA
      :to="`/account/${username}/datasets/claimed`"
      :selected="isRouteCurrent(username)"
      tag="nuxt-link"
      class="profile-button"
      data-tooltip="my datasets & account">
      <img class="avatar" :src="avatar" />
      <span class="username">{{ username }}</span>
    </ButtonA>

    <ButtonA
      v-if="isAdmin"
      :selected="isRouteCurrent('modify')"
      to="/modify/editor"
      tag="nuxt-link"
      data-tooltip="omgz I'm an admin! 😍"
      class="modify-button">
      🔑
    </ButtonA>

    <ButtonB
      class="logout-button"
      data-tooltip="logout"
      @clicked="logout">
      <IconShutdown />
    </ButtonB>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import ButtonA from '@/components/buttons/button-a'
import ButtonB from '@/components/buttons/button-b'
import IconShutdown from '@/components/icons/shutdown'

// ====================================================================== Export
export default {
  name: 'Identifier',

  components: {
    ButtonA,
    ButtonB,
    IconShutdown
  },

  props: {
    identifier: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      accountIsAdmin: 'account/accountIsAdmin'
    }),
    avatar () {
      return this.identifier.githubAvatarUrl
    },
    username () {
      return this.identifier.githubUsername
    },
    isAdmin () {
      return this.accountIsAdmin || this.$authIdentifier.isAdmin
    }
  },

  methods: {
    ...mapActions({
      logout: 'auth/logout'
    }),
    isRouteCurrent (key) {
      const route = this.$route
      if (route.path.includes(key)) { return true }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#identifier {
  display: flex;
  flex-direction: row;
  align-items: center;
}

// //////////////////////////////////////////////////////////// [Button] Profile
.button.profile-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 0.25rem;
  margin-right: 1rem;
  @include small {
    margin-right: 0.5rem;
    padding-left: 0.125rem;
    padding-right: 0.75rem;
    font-size: 0.75rem;
  }
}

.avatar {
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
  border-radius: 50%;
  @include small {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.375rem;
  }
}

// ///////////////////////////////////////////////////////////// [Button] Modify
::v-deep .button.modify-button {
  border-radius: 50%;
  padding: 0.375rem 0.75rem;
  margin-right: 1rem;
  @include small {
    margin-right: 0.5rem;
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
  }
  .button-content {
    text-shadow: 1px 1px 3px $mirage;
  }
}

// ///////////////////////////////////////////////////////////// [Button] Logout
::v-deep .button.logout-button {
  border-radius: 50%;
  padding: 0.5rem;
  &:hover {
    transform: scale(1.25);
    .shutdown-svg-icon {
      transition: 150ms ease-in;
      path {
        fill: teal;
      }
    }
  }
}

::v-deep .shutdown-svg-icon {
  width: 0.75rem;
  @include small {
    width: 0.5rem;
  }
  path {
    transition: 150ms ease-out;
  }
}
</style>
