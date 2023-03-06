<template>
  <div class="col card">
    <CardCutout>
      <div class="card-inner">
        <img class="card-img" :src="card.img_url" />
        <div class="card-details">
          <div class="card-details-row title" :title="card.name">
            {{ card.name }}
          </div>

          <div class="card-details-row">
            <span
              v-for="(label, key) in labelsTier1"
              :key="key"
              class="card-details-row-item">
              <span class="caption">
                {{ label }}
              </span>
              <span class="card-data">
                {{ card[key] || '-' }}
              </span>
            </span>
          </div>

          <div v-if="labelsTier2" class="card-details-row">
            <span
              v-for="(label, key) in labelsTier2"
              :key="key"
              class="">
              <span class="caption">
                {{ label }}
              </span>
              <span
                v-if="key === 'locations'">
                <span v-if="!card[key]" class="card-data">-</span>
                <span
                  v-for="(item, index) in card[key]"
                  :key="index">
                  {{ $getFlagIcon(item.country_code) }}
                </span>
              </span>
              <span v-if="key === 'file_extensions'">
                <span v-if="!card[key]" class="card-data">-</span>
                <span
                  v-for="(item, index) in card[key]"
                  :key="index">
                  <span v-if="index < 3" class="file-item">
                    {{ item }}
                  </span>
                </span>
              </span>
            </span>
          </div>

        </div>
        <div class="card-button">
          <Button
            :button="{
              type: 'solid',
              url: `/dataset/${card.slug}`,
              text: 'View dataset',
              icon: 'arrow'
            }" />
        </div>
      </div>
    </CardCutout>
  </div>
</template>

<script>
// ===================================================================== Imports
import Button from '@/components/buttons/button'
import CardCutout from '@/components/card-cutout'

// ====================================================================== Export
export default {
  name: 'DatasetsCardList',

  components: {
    Button,
    CardCutout
  },

  props: {
    card: {
      type: Object,
      required: true
    },
    labels: {
      type: Object,
      required: true
    }
  },

  computed: {
    labelsTier1 () {
      return this.labels.tier1
    },
    labelsTier2 () {
      return this.labels.tier2
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: toRem(10);
}
.card-inner {
  padding: toRem(25);
  display: flex;
  align-items: center;
  .card-img {
    background-color: $tasman;
    height: toRem(100);
    width: toRem(100);
    border-radius: toRem(2);
    object-fit: cover;
    flex-shrink: 0;
  }
  .card-details {
    padding-left: toRem(60);
    padding-right: toRem(20);
    flex-grow: 1;
    .title {
      @include fontSize_20;
      line-height: leading(30, 20);
    }
    .card-details-row {
      margin-bottom: toRem(10);
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .card-button {
    flex-shrink: 0;
    margin-top: auto;
  }
}
</style>
