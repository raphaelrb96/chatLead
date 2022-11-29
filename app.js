const express = require('express');
const { start } = require('repl');
const { Socket } = require('socket.io');
const venom = require('venom-bot');
const estaSalvo = require('./objects/chats');
const chatObject = require('./objects/chats');
const estaArquivado = require('./objects/chats');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});

let mCliente = null;

const loop = (list) => {

    let tamanho = 20;
    let delay = 6000;
    let i = 0;
    let mensagensEnviadas = 0;

    setTimeout(() => {

        //funcao
        mensagensEnviadas++;
        console.log(mensagensEnviadas);

        //logica do loop
        i++;
        if(i < tamanho) {
            loop();
        }

    }, delay);

    return mensagensEnviadas;

};

async function loop2(lista) {

    let tamanho = lista.length;
    let delay = 4000;
    let mensagensEnviadas = 0;

    const timer = ms => new Promise(res => setTimeout(res, ms));


    for (let i = 0; i < tamanho; i++) {

        const item = lista[i];

        mensagensEnviadas++;
        console.log(mensagensEnviadas);

        if(estaSalvo(item) || estaArquivado(item)) return;


        mensagensEnviadas++;
        mCliente.sendText(item.id._serialized, txtEditado).catch(erro => console.log(`${item.contact.pushname} ${JSON.stringify(erro)}`));

        await timer(delay);
        
    }

    return mensagensEnviadas;

}


const enviarMensagens = async (list, text) => {

    if(mCliente == null) return;

    const txtEditado = String(text);

    let mensagensEnviadas = await loop2(list)

    console.log(`${mensagensEnviadas} mensagens enviadas...`);

    
};

app.set("view engine", "ejs");

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.get('/', (req, res) => {
    res.render('home');
});

app.use(express.static(__dirname + '/images'));

server.listen(3000, () => {
    console.log('Listener on port 3000');
});


io.on('connection', (socket) => {
    console.log('User conected: ' + socket.id);
    
    

    socket.on("message", () => {

        if(mCliente !== null) return;

        function start(client) {
            mCliente = client;
            client.onStateChange(state => {
                console.log('estado change: ' + state);
                socket.emit('message', state);
            });


            client.onMessage((message) => {
                //console.log('nova mensagem: ' + JSON.stringify(message));
                socket.emit('chat', message);
                const {isUser, verifiedName, isMyContact, isBusiness, profilePicThumbObj} = message.sender;
                if (message.body === 'Falar com Robô') {
                  client
                    .sendText(message.from, '[BOT]: Olá! Raphael está ausente. Pode deixar o recado ?')
                    .then((result) => {
                      console.log('Result: ', result); //retorna um objeto de successo
                    })
                    .catch((erro) => {
                      console.error('Erro ao enviar mensagem: ', erro); //return um objeto de erro
                    });
                }
              });
        }

        venom.create({
            session: 'ChatLead',
            catchQR: (base64Qr, asciiQR) => {

                console.log(base64Qr);
                //console.log(asciiQR);

                const matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
                if(matches.length !== 3) {
                    return new Error("Invalid input string");
                }
                response.type = matches[1];
                response.data = new Buffer.from(matches[2], 'base64');

                const imageBuffer = response;

                socket.emit('image', base64Qr)

                require('fs').writeFile(
                    './images/out.png',
                    imageBuffer['data'],
                    'binary',
                    (err) => {
                        if(err !== null) {
                            console.log(err);
                        }
                    }
                );
            },
            logQR: true,
            statusFind: (statusSession, session) => {
                //if(!session) return;
                console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
                //Create session wss return "serverClose" case server for close
                console.log('Session name: ', session);
                socket.emit('status', statusSession);
            }
        }).then((client) => start(client)).catch(error => console.log(error));
    });


    socket.on("ready", () => {
        setTimeout(() => {
            socket.emit("ready", './out.png')
        }, 3000);
    });

    socket.on("send", (data) => {
        //console.log('send: ' + data);
        mCliente.getAllChats().then(chats => {
            console.log('Get chats: ');
            if(chats) {
                
                enviarMensagens(chats, data);
            }
        });
    })
    
});



