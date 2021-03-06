/*eslint-disable */

const net = require('net');
const message_input = document.getElementById('message');
const fs = require("fs");
const sendBtn = document.getElementById('startServerBtn');
const btnGetData = document.getElementById('btnGetData');
const electron = require('electron');

const { ipcRenderer } = electron;
const ipInputElement = document.getElementById('ip');
let value;

function catchError(e) {
    if (e.fatal) {
        console.log(e);
    }
    const nd = new Date();
    const y = nd.getFullYear();
    const m = (nd.getMonth() + 1);
    const d = nd.getDate();
    const h = nd.getHours();
    const mm = nd.getMinutes();
    const s = nd.getSeconds();
    let err;
    err = JSON.stringify(e, null, 2)
    if(!fs.existsSync(path.resolve(__dirname, '../error_logs'))) { fs.mkdirSync(path.resolve(__dirname, '../error_logs')); }
    if(!fs.existsSync(path.resolve(__dirname, '../error_logs', `${y}-${m<10?`0${m}`:m}-${d<10?`0${d}`:d}`))) { fs.mkdirSync(path.resolve(__dirname, '../error_logs', `${y}-${m<10?`0${m}`:m}-${d<10?`0${d}`:d}`)); }
    fs.writeFileSync(path.resolve(__dirname, '../error_logs', `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`, `log-${h < 10 ? `0${h}` : h}-${mm < 10 ? `0${mm}` : mm}-${s < 10 ? `0${s}` : s}.json`), err);

}
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

function makeBuffer(data) {
    return new Promise((resolve,reject)=>{
        try {
            return resolve(Buffer.from(JSON.stringify(data)))
        } catch (error) {
            return reject(error)
        }
    });
}
message_input.addEventListener('change',async (e)=>{
    if (e.target.type === "file") {
        let file = e.target.files[0];
        let data = await getBase64(file);
        value = {
            file:data,
            type:file.type,
            name:file.name
        }
    }else {
        value = {
            data: e.target.value,
            type:"text"
        };
    }
});

function init() {
    let file_or_text_btn = document.getElementById('file_or_text');
    file_or_text_btn.addEventListener('click',()=>{
       if ( message_input.type === "file") {
            message_input.type = "text";
       }else {
            message_input.type = "file";
       }
    })
    ipcRenderer.on('ips_datas', (event, store) => {
        const select = document.createElement('select');
        select.id = 'ip_selector';
        select.addEventListener('change', (e) => {
            ipInputElement.value = e.target.value;
        });
        const ip_listDiv = document.getElementById('ip_list');
        const {
            ipList,
            localIpWifi,
            localIpVEthernet,
        } = store;
        ipList.forEach((element) => {
            const option = document.createElement('option');
            option.value = element.ip;
            option.textContent = element.ip;
            select.appendChild(option);
        });
        ip_listDiv.append(select);
        let my_ip_span = document.getElementById('my_ip_span');
        my_ip_span.innerHTML = `
        Local Ip Wifi: ${localIpWifi}
        <br>
        Local Ip VEthernet: ${localIpVEthernet}
        `;
    });
}

document.getElementById('stopServer').addEventListener('click', () => {
    window.location.reload();
});

const server = net.createServer(async (connection) => {
    connection.on('end', () => {
        // console.log('disconnected');
    });
    value = await makeBuffer(value);
    connection.write(value);
    connection.pipe(connection);
});

const sendData = () => {
    if (server.listening) {
        server.close();
    }
    server.listen(8080);
};
function getRandomString() {
    let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = ""
    let chaactersLength = characters.length;

    for ( let i = 0; i < 10 ; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * chaactersLength));
    }
    result += "-" + Date.now().toString();
    return result;
}
const getData = () => {
    const host = document.getElementById('ip').value;
    const client = net.connect({ host, port: 8080 });
    
    client.on('data', async (data) => {
        const showData = document.getElementById('showData');
        data = data.toString();
        data = JSON.parse(data);
        
        if (data.type === "text") {
            showData.innerHTML = data.data;
        }else {
            let base64Data = data.file.split(';base64,').pop();
            let mimeType = data.type.split("/")[1];
            let name = data.name.split(".")[0];

            let file = `./downloads/${name+"-"+getRandomString()}`+'-out.'+mimeType;
            let check = await fs.existsSync("./downloads/");
            if (!check) {
                fs.mkdirSync("./downloads/");
            }
            fs.writeFileSync(file, base64Data,  {encoding: 'base64'}).then(result => {
                alert("success");
            }).catch(err=>{
                alert(err);
                catchError(err);
                console.log(err);
            });
        }
        
        client.end();
    });

    client.on('end', () => {

    });
};

btnGetData.addEventListener('click', getData);
sendBtn.addEventListener('click', sendData);

init();
