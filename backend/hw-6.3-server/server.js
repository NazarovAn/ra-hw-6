const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors());
app.use(koaBody({json: true}));

const messages = [
    {
        id: 1,
        userId: 'TestIdOne',
        content: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."'
      },
      {
        id: 2,
        userId: 'TestIdTwo',
        content: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."'
      },
      {
        id: 3,
        userId: 'TestIdTwo',
        content: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."'
      },
      {
        id: 4,
        userId: 'TestIdOne',
        content: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."'
      }
];
const users = [
    {
        userName: 'Test User #1',
        userColor: '#5f39ce',
        userId: 'TestIdOne'
    },
    {
        userName: 'Test User #2',
        userColor: '#a6d730',
        userId: 'TestIdTwo'
    }
];
let nextId = 5;

const router = new Router();

router.get('/messages', async (ctx, next) => {
    const from = Number(ctx.request.query.from)
    if (ctx.request.query.from === 0) {
        ctx.response.body = JSON.stringify(messages);
        return;
    }

    const fromIndex = messages.findIndex(o => o.id === from);
    if (fromIndex === -1) {
        ctx.response.body = JSON.stringify(messages);
        return;
    }

    ctx.response.body = JSON.stringify(messages.slice(fromIndex + 1));
});

router.post('/messages', async(ctx, next) => {
    const data = JSON.parse(ctx.request.body);

    messages.push({...data, id: nextId++});
    ctx.response.status = 204;
});

router.post('/users', async(ctx, next) => {
    const data = JSON.parse(ctx.request.body);
    if (data.remove) {
        const index = users.indexOf(data.userName);
        users.splice(index, 1);
        ctx.response.status = 204;
        return
    }
    
    if (!users.filter((user) => user.userId === data.userId).length) {
        users.push(data);        
    }
    
    ctx.response.status = 204;
});

router.get('/users', async(ctx, next) => {
    ctx.response.body = JSON.stringify(users);
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));
