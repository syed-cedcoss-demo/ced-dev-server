import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';

const security = (app) => {
  // RATE LIMITER: 150 REQ PER 5 MIN
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 150,
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);

  // HTTP SECURITY HEADERS
  app.use(helmet());

  // DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
  app.use(mongoSanitize());

  // DATA SANITIZATION AGAINST XSS
  app.use(xss());
};
export default security;
