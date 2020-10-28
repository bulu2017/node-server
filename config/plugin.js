module.exports = function() {
    var seneca = this;
    seneca.add('role:user,cmd:list', (msg, done) => {
        done(null, { ok: true });
    });
    seneca.add('role:user,cmd:load', (msg, done) => {
        done(null, { ok: true });
    });
    seneca.add('role:user,cmd:edit', (msg, done) => {
        var rep = msg.response$;
        if (rep.send) {
            rep.send(msg.args);
        } else {
            rep(null, msg.args);
        }
        done();
    });
    seneca.add('role:user,cmd:create', (msg, done) => {
        var rep = msg.response$;
        if (rep.send) {
            rep.send(msg.args);
        } else {
            rep(null, msg.args);
        }
        done();
    });
    seneca.add('role:user,cmd:delete', (msg, done) => {
        var rep = msg.response$;
        if (rep.send) {
            rep.send(msg.args);
        } else {
            rep(null, msg.args);
        }
        done();
    });
}