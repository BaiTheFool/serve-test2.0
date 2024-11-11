const WebSocket = require('ws');
const os = require('os'); // 引入 os 模块获取局域网 IP 地址
const PORT = 8080; // 服务器端口

const wss = new WebSocket.Server({ port: PORT });

// 获取局域网 IP 地址
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const iface in interfaces) {
        for (const alias of interfaces[iface]) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        const message = JSON.parse(data);
        if (message.type === 'join') {
            message.message = `${message.username} 已加入房间`;
        }
        // 广播消息给所有客户端
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    });

    ws.on('close', function () {
        console.log('客户端已断开连接');
    });
});

// 启动服务器并打印局域网 IP 地址
const localIP = getLocalIP();
console.log(`WebSocket 服务器已启动！`);
console.log(`局域网访问地址：ws://${localIP}:${PORT}`);
console.log(`本机访问地址：ws://localhost:${PORT}`);
