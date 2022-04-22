const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const find = require('local-devices');

function getIpList() {
  try {
    return find().then((result) => result);
  } catch (error) {
    return error;
  }
}
/*eslint-disable */

function getLocalIp() {
  const results = {};
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  return results;
}

/* eslint-enable */

const protocolFamily = {
  V6: nets['Wi-Fi'][0].family,
  V4: nets['Wi-Fi'][1].family,
};

const v6Adress = nets['Wi-Fi'][0].address;
const v4Adress = nets['Wi-Fi'][1].address;

const myLocal = getLocalIp();
const localIpWifi = myLocal['Wi-Fi'];
const localIpVEthernet = myLocal['vEthernet (WSL)'];

module.exports = {
  getLocalIp,
  v6Adress,
  v4Adress,
  localIpVEthernet,
  localIpWifi,
  protocolFamily,
  getIpList,
};
