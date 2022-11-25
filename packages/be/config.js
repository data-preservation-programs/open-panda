// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Path = require('path')

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = {
  // ================================================= Server Config & Variables
  port: (function () {
    const env = process.env.SERVER_ENV
    let port = 14000 // development
    switch (env) {
      case 'stable': port = 14001; break
      case 'production': port = 14002; break
    } return port
  }()),
  packageRoot: __dirname,
  repoRoot: Path.resolve(__dirname, '../../'),
  staticRoot: Path.resolve(__dirname, 'static'),
  publicRoot: Path.resolve(__dirname, 'public'),
  tmpRoot: Path.resolve(__dirname, 'tmp'),
  serverRoot: (function () {
    const env = process.env.SERVER_ENV
    let path = Path.resolve(__dirname, '../../../') // development
    switch (env) {
      case 'production': path = Path.resolve(__dirname, '../../../../'); break
    } return path
  }()),
  frontendUrl: (function () {
    const env = process.env.SERVER_ENV
    let uri = 'https://localhost:11000'
    switch (env) {
      case 'stable': uri = ''; break
      case 'production': uri = ''; break
    } return uri
  }()),
  backendUrl: (function () {
    const env = process.env.SERVER_ENV
    let uri = 'https://localhost:14000'
    switch (env) {
      case 'stable': uri = '/api'; break
      case 'production': uri = '/api'; break
    } return uri
  }()),
  websocketUrl: (function () {
    const env = process.env.SERVER_ENV
    let uri = 'https://localhost:14000'
    switch (env) {
      case 'stable': uri = ''; break
      case 'production': uri = ''; break
    } return uri
  }()),
  // ==================================================================== Server
  server: false,
  environment: process.env.SERVER_ENV,
  autocreateEntities: [
    { type: 'dir', path: 'static' },
    { type: 'dir', path: 'cache' },
    { type: 'dir', path: 'tmp' },
    { type: 'dir', path: 'tmp/uploads' },
    { type: 'dir', path: 'public' },
    { type: 'dir', path: 'public/uploads' },
    { type: 'dir', path: 'tmp' },
    { type: 'file', path: 'tmp/app-version.json', data: { version: '' } }
  ],
  serveStaticDirectories: [],
  // ================================================================== Database
  databaseUrl: process.env.DATABASE_URL,
  mongoConnectionOptions: {
    ssl: true,
    sslValidate: true,
    sslCA: Path.resolve(process.env.DPP_CA_PATH),
    sslKey: Path.resolve(process.env.MONGODB_CLIENT_PEM),
    sslCert: Path.resolve(process.env.MONGODB_CLIENT_PEM),
    authMechanism: 'MONGODB-X509'
  },
  mongooseConnection: false,
  model: {},
  // ================================================================= Socket.Io
  socket: {
    io: false,
    listeners: []
  },
  // ======================================================== Session Management
  expressSessionOptions: {
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: false,
    proxy: process.env.NODE_ENV !== 'development' ? true : undefined,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Expires in 24hrs
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      unset: 'destroy'
    }
  },
  expressSession: false,
  // ====================================================================== CORS
  cors: {
    origin: [
      'https://localhost:11000'
    ],
    methods: 'OPTIONS,GET,POST',
    allowedHeaders: 'Origin,Accept,Authorization,X-Requested-With,Content-Type,Cache-Control',
    credentials: true,
    optionsSuccessStatus: 200
  },
  // =================================================================== Modules
  modules: {
    // ---------------------------------------------------------------- Uploader
    uploader: {
      chunkSize: 50000
    }
  }
}
