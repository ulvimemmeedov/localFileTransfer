/*eslint-disable */

const net = require('net');

const sendBtn = document.getElementById('startServerBtn');
const btnGetData = document.getElementById('btnGetData');
const electron = require('electron');

const { ipcRenderer } = electron;
const ipInputElement = document.getElementById('ip');

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
});

document.getElementById('stopServer').addEventListener('click', () => {
  window.location.reload();
});

const server = net.createServer((connection) => {
  console.log('connected');
  connection.on('end', () => {
    console.log('disconnected');
  });
  const { value } = document.getElementById('message');
  connection.write(value);
  connection.pipe(connection);
});

const sendData = () => {
  server.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
  });
};

const getData = () => {
  const host = document.getElementById('ip').value;
  const client = net.connect({ host, port: 8080 }, () => {
  });
  client.on('data', (data) => {
    const showData = document.getElementById('showData');
    showData.innerHTML = data.toString();
    client.end();
  });

  client.on('end', () => {

  });
};

btnGetData.addEventListener('click', getData);
sendBtn.addEventListener('click', sendData);
