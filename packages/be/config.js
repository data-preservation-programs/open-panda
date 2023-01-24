// ////////////////////////////////////////////////// Imports, Variables & Setup
// -----------------------------------------------------------------------------
const Path = require('path')

const env = process.env.SERVER_ENV

const baseUrls = {
  development: 'https://localhost',
  stable: '',
  production: ''
}

const frontendPort = (function () {
  if (env === 'development') { return 13010 }
  return env === 'stable' ? 13020 : 13030
}())

const backendPort = (function () {
  if (env === 'development') { return 13040 }
  return env === 'stable' ? 13050 : 13060
}())

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = {
  // ===================================================================== Paths
  packageRoot: __dirname,
  repoRoot: Path.resolve(__dirname, '../../'),
  cacheRoot: Path.resolve(__dirname, 'cache'),
  staticRoot: Path.resolve(__dirname, 'static'),
  publicRoot: Path.resolve(__dirname, 'public'),
  tmpRoot: Path.resolve(__dirname, 'tmp'),
  serverRoot: Path.resolve(
    __dirname,
    env === 'development' ? '../../../' : '../../../../'
  ),
  // ============================================================= Server Config
  port: backendPort,
  frontendUrl: env === 'development' ? `${baseUrls[env]}:${frontendPort}` : baseUrls[env],
  backendUrl: env === 'development' ? `${baseUrls[env]}:${backendPort}` : `${baseUrls[env]}/api`,
  websocketUrl: env === 'development' ? `${baseUrls[env]}:${backendPort}` : baseUrls[env],
  // ==================================================================== Server
  server: false,
  environment: env,
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
      `${baseUrls.development}:${frontendPort}`
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
