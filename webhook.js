// webhook.js
import http from 'http';
import { exec } from 'child_process';

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      // console.log('Webhook received:', body);
      // Ejecuta el script de despliegue cuando llega un webhook
      exec('sh /home/miahuabot/proyectos/mbot-next/deploy.sh', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error ejecutando el despliegue: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
      res.end('OK');
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});