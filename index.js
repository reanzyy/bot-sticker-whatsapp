const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-gpu',],
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true, }), console.log('scan this qr');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    if (message.body === '.test') {
        await client.sendMessage(message.from, 'hii bot is on!');
    } else if (message.type === 'image') {
        const media = await message.downloadMedia();
        client.sendMessage(message.from, media, {
            sendMediaAsSticker: true
        });
    } else if (message.body === '.random') {
        const random = await MessageMedia.fromUrl('https://picsum.photos/200', { unsafeMime: true });
        await client.sendMessage(message.from, random);
    }
});

client.initialize();
