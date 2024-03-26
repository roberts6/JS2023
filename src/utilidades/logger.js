import winston from 'winston';
import { EventEmitter } from 'events';

const customLevelsOptions = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'red',
        http: 'orange',
        info: 'yellow',
        warning: 'blue',
        error: 'grey',
        fatal: 'violet' 
    }
};

// Asigna colores a los niveles definidos.
winston.addColors(customLevelsOptions.colors);

// Determina el nivel dependiendo el entorno
const consoleTransportLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Crea el logger con los niveles personalizados.
const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: consoleTransportLevel, 
            format: winston.format.combine(
                winston.format.colorize(), // Aplica los colores definidos anteriormente.
                winston.format.simple() 
            )
        }),
        new winston.transports.File({ 
            filename: './errors.log',
            level: 'error' // en este caso todo lo que sea de error o mayor se guarda en el archivo
        })
    ]
});


EventEmitter.defaultMaxListeners = 100; // 100 es el límite de "oyentes" para EventEmitter (
//facilita la comunicación asincrónica entre diferentes partes de una aplicación a través de emisión y escucha de eventos)
export default logger;