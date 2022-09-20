module.exports = app => {
    app.use('/api/video', require('./api/video'));
    app.use('/api/auth', require('./api/auth'));
    app.use('/api/payment', require('./api/payments'));
    app.use('/api/report', require('./api/report'));
    app.use('/api/notification', require('./api/notifications'));
}