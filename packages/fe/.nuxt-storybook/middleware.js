const middleware = {}

middleware['modify'] = require('../middleware/modify.js')
middleware['modify'] = middleware['modify'].default || middleware['modify']

export default middleware
