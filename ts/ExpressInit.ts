import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

class ExpressInit
{
    public exp;
    public server;

    constructor()
    {
        this.exp = express();
        this.server = new http.Server(this.exp);
        this.mountRoutes();
    }

    private mountRoutes(): void
    {
        this.exp.get('/', function(req, res) {
            res.sendFile(path.join(__dirname, '../client', 'index.html'));
        });

        this.exp.use('/client', express.static(path.join(__dirname, '../client')));
        this.server.listen(process.env.PORT || 2000);
    }
}

export default new ExpressInit().server;
