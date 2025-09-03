import express, { Router } from "express";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly routes: Router;
  private readonly acceptedOrigins: string[] = [
        "http://localhost:5173",
        "http://localhost:4200",
  ];

  constructor(options: Options) {
    this.port = options.port;
    this.routes = options.routes;
  }

  async start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const limiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      limit: 3000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
      standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
      // store: ... , // Redis, Memcached, etc. See below.
    });

    // Apply the rate limiting middleware to all requests.
    this.app.use(limiter);
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) {
            return callback(null, true); // acepto el tráfico sin header Origin (curl/Postman/health)
          }

          const isAllowed = this.acceptedOrigins.some((pattern) => {
            if (!pattern) return false;
            // Wildcard support: *.domain.com
            if (pattern.startsWith("*.") && origin) {
              const domain = pattern.slice(2).toLowerCase();
              try {
                const hostname = new URL(origin).hostname.toLowerCase();
                return (
                  hostname === domain || hostname.endsWith("." + domain)
                );
              } catch {
                return false;
              }
            }
            // Exact match
            return pattern === origin;
          });

          if (isAllowed) return callback(null, true);

          return callback(new Error("Not allowed by CORS"));
        },
      })
    );
    this.app.use(hpp());
    this.app.use(helmet());

    // Health check endpoint for deployment platforms
    this.app.get("/health", (_req, res) => {
      res.status(200).json({ status: "ok" });
    });

    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port} 🟢🏁`);
    });
  }
}
