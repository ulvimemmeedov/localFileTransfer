/*eslint-disable */

const net = require('net');
const message_input = document.getElementById('message');

const sendBtn = document.getElementById('startServerBtn');
const btnGetData = document.getElementById('btnGetData');
const electron = require('electron');

const { ipcRenderer } = electron;
const ipInputElement = document.getElementById('ip');
let value;

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
        value = e.target.value;
    }
})


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

    server.listen(8080);
};

const getData = () => {
    const host = document.getElementById('ip').value;
    const client = net.connect({ host, port: 8080 }, () => {
    });
    client.on('data', (data) => {
        const showData = document.getElementById('showData');
        data = data.toString();
        console.log(JSON.parse(data));
        // showData.innerHTML = data.toString();
        client.end();
    });

    client.on('end', () => {

    });
};

btnGetData.addEventListener('click', getData);
sendBtn.addEventListener('click', sendData);

init();
