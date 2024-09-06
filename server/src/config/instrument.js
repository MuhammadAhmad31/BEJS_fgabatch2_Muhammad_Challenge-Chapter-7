import * as Sentry from '@sentry/node';

Sentry.init({
    dsn: 'https://a4c764c4776674fb379b037b58800b24@o4507906102263808.ingest.us.sentry.io/4507906104360960',
    
    tracesSampleRate: 1.0,
});

export default Sentry;