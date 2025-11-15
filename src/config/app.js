export const appConfig = {
  // Server Configuration
  server: {
    port: process.env.PORT || 4000,
    environment: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost'
  },

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI,
    name: process.env.DB_NAME || 'necx_messaging_app'
  },

  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGINS?.split(',') || []
      : [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-here',
    jwtExpiry: process.env.JWT_EXPIRY || '24h',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },

  // Validation Configuration
  validation: {
    message: {
      minLength: 1,
      maxLength: 1000
    },
    user: {
      nameMinLength: 1,
      nameMaxLength: 50
    }
  },

  // API Configuration
  api: {
    version: 'v1',
    prefix: '/api',
    defaultPageSize: 20,
    maxPageSize: 100
  }
};

export const validateConfig = () => {
  const required = ['MONGODB_URI'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export default appConfig;