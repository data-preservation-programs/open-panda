// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const getMockCids = () => {
  const mockCid = {
    title: 'Genome in a Bottle 001',
    hash: 'baga6ea4seaqih7gfqvkpvez3qlbajjolszk7vfqaatt5m2rdef52p3fq4jfpigi',
    filetypes: 'xml, txt, csv',
    size: 32000000000,
    expires: 'Feb 27 2023',
    storage_providers: [
      {
        id: 'F0123431',
        dealId: '1472881',
        location: 'GB',
        expiry_date: 'Feb 27 2023',
        retrieval_rate: '100%',
        retrieval_commands: [
          'lotus client retrieve --miner f022352 baga6ea4seaqih7gfqvkpvez3qlbajjolszk7vfqaatt5m2rdef52p3fq4jfpigi publicdomainmovies.tar.01',
          'pow ffs get baga6ea4seaqih7gfqvkpvez3qlbajjolszk7vfqaatt5m2rdef52p3fq4jfpigi retrieval.png'
        ]
      },
      {
        id: 'F0123123',
        dealId: '1438903',
        location: 'GB',
        expiry_date: 'Feb 28 2023',
        retrieval_rate: '100%',
        retrieval_commands: [
          'lotus client retrieve --miner f022352 b356c864441e1ca71dd4fe1fc455862350f6798c1f966a90ea3fcf60713b3548 publicdomainmovies.tar.01',
          'pow ffs get b356c864441e1ca71dd4fe1fc455862350f6798c1f966a90ea3fcf60713b3548 retrieval.png',
          'pow ffs get b356c864441e1ca71dd4fe1fc455862350f6798c1f966a90ea3fcf60713b3548 retrieval.png',
          'pow ffs get b356c864441e1ca71dd4fe1fc455862350f6798c1f966a90ea3fcf60713b3548 retrieval.png'
        ]
      },
      {
        id: 'F012H890',
        dealId: '1472892',
        location: 'GB',
        expiry_date: 'Mar 28 2023',
        retrieval_rate: '100%',
        retrieval_commands: [
          'lotus client retrieve --miner f022352 88a601f0915f70051a32ac1c1e4b931c348467e70a0c2f7f72086967eeb79e29 publicdomainmovies.tar.01',
          'pow ffs get 88a601f0915f70051a32ac1c1e4b931c348467e70a0c2f7f72086967eeb79e29 retrieval.png'
        ]
      },
      {
        id: 'F0126789',
        dealId: '1472890',
        location: 'GB',
        expiry_date: 'Apr 1 2023',
        retrieval_rate: '100%',
        retrieval_commands: [
          'lotus client retrieve --miner f022352 444d11afee588638e0479240c55abc5dc8c21ef829f519b8a96db9134b6b41f0 publicdomainmovies.tar.01',
          'pow ffs get 444d11afee588638e0479240c55abc5dc8c21ef829f519b8a96db9134b6b41f0 retrieval.png'
        ]
      }
    ],
    status: 'active'
  }
  const mockCids = []
  for (let i = 0; i < 6; i++) {
    const cid = CloneDeep(mockCid)
    cid.title = `Genome in a Bottle 00${i}`
    mockCids.push(cid)
  }
  return {
    data: {
      payload: mockCids
    }
  }
}

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  dataset: false,
  cidList: false
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  dataset: state => state.dataset,
  cidList: state => state.cidList
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// getDataset
  async getDataset ({ commit, getters, dispatch }, metadata) {
    try {
      const route = metadata.route
      const slug = route.params.id
      const response = await this.$axiosAuth('/get-dataset', {
        params: {
          slug
        }
      })
      const dataset = response.data.payload
      dispatch('getCidList', { datasetId: dataset._id })
      commit('SET_DATASET', { dataset })
      return dataset
    } catch (e) {
      if (getters.dataset) { commit('SET_DATASET', { dataset: false }) }
      console.log('Dataset not found.')
      console.log('======================== [Store Action: dataset/getDataset]')
      console.log(e)
      return false
    }
  },
  // //////////////////////////////////////////////////////////////// getCidList
  async getCidList ({ commit, getters }, metadata) {
    try {
      // const id = metadata.dataSetId
      // const response = await this.$axiosAuth('/get-cid-list',  { params: { id } })
      const response = await getMockCids()
      const cids = response.data.payload
      commit('SET_CID_LIST', { cids })
    } catch (e) {
      console.log('======================== [Store Action: dataset/getCidList]')
      console.log(e)
      return false
    }
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_DATASET (state, payload) {
    state.dataset = payload.dataset
    console.log(state.dataset)
  },
  SET_CID_LIST (state, payload) {
    state.cidList = payload.cids
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  state,
  getters,
  actions,
  mutations
}
