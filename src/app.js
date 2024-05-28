import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import flash from 'connect-flash';
import passport from 'passport';
import { fileURLToPath } from 'url';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passportConfig from './utilidades/passport-config.js';
import authorization from './middleware/authorization.js';
import ProductsRouter from './routes/productsModel.router.js';
import UsersRouter from './routes/userModel.router.js';
import MessagesRouter from './routes/messagesModel.router.js';
import CookiesRouter from './routes/cookies.router.js';
import GithubRouter from './routes/github.router.js';
import { generateProducts } from './middleware/mock.js';
import logger from './utilidades/logger.js';
import cluster from 'cluster';
import { cpus } from 'os';

dotenv.config();
const numeroDeProcesadores = cpus().length;

if (cluster.isPrimary) {
    console.log("Proceso primario ejecutándose en pid:", process.pid);
    for (let i = 0; i < numeroDeProcesadores; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} murió`);
        console.log("Forking a new worker...");
        cluster.fork();
    });
} else {
    const app = express();
    const PORT = process.env.PORT || 3001;
    const DB_URL = process.env.DB_ATLAS;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const swaggerOptions = {
        definition: {
            openapi: '3.0.1',
            info: {
                title: 'Documentación de mi API',
                description: 'API destinada a e-commerce'
            }
        },
        apis: [`${__dirname}/docs/**/*.yaml`]
    };

    passportConfig(passport);

    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(express.static('public'));

    const specs = swaggerJsdoc(swaggerOptions);
    app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(specs));

    app.engine('handlebars', engine({
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
    }));

    app.set('view engine', 'handlebars');
    app.set('views', './src/views');
    app.use(cookieParser(process.env.COOKIE_SECRET));

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 86400000 }
    }));

    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/user', UsersRouter);
    app.use('/products', ProductsRouter);
    app.use('/cookies', CookiesRouter);
    app.use('/auth', GithubRouter);
    app.use('/messages', MessagesRouter);

    app.get('/current', passport.authenticate('jwt', { session: false }), authorization, (req, res) => {
        res.send({ status: 'success', payload: req.user });
    });

    app.get('/session', (req, res) => {
        if (req.session.counter) {
            req.session.counter++;
            res.send(`You have visited this page ${req.session.counter} times`);
        } else {
            req.session.counter = 1;
            res.send('Welcome for the first time!');
        }
    });

    app.get('/loggerTest', (req, res) => {
        logger.debug('Debug message');
        logger.info('Info message');
        logger.warning('Warning message');
        logger.error('Error message');
        logger.fatal('Fatal error message');
        logger.http('HTTP message');
        res.json({ message: 'All loggers tested successfully' });
    });

    mongoose.connect(DB_URL)
        .then(() => {
            console.log(`Connected to the database, Server is up on port ${PORT}`);
        })
        .catch((error) => {
            console.error('Database connection error:', error);
            process.exit(1);
        });

    const server = app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on port ${PORT}`);
    });

    server.on('error', (error) => {
        console.error(`Server error: ${error.message}`);
    });
}




