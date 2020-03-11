const axios = require('axios')
axios.defaults.withcredentials = true
const config = require('./config')
const pbToken = config.pushBullet.token
const pbHeaders = {
  'Access-Token': pbToken,
  'Content-Type': 'application/json'
}
function sendMessage (msg) {
  const api = 'https://api.pushbullet.com/v2/texts'
  const params = {
    addresses: config.pushBullet.addresses,
    guid: new Date().toString(),
    message: msg,
    target_device_iden: config.pushBullet.target_device_iden
  }
  return axios.request({
    method: 'POST',
    url: api,
    data: {
      data: params
    },
    headers: pbHeaders
  })
}
const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
  'Content-Type': 'text/plain/charset=euc-kr;',
}
async function getWelkeeps () {
  const { data } = await axios.get('http://www.welkeepsmall.com/shop/detailpage.html?request=ajax&brandcode=023002000022', {
    headers: headers
  })
  if(data.includes('loading...')) {
    const token = data.match(/testck2\=([a-z0-9]+);/)
    headers.cookie += token[0]
    return getWelkeeps()
  } else {
    return data
  }
}
let count = 0
async function run () {
  const result = await getWelkeeps()
  if (result.includes('SOLD OUT')) {
    console.log(`마스크가 품절입니다. [ ${++count}번째 시도중 ]`)
    setTimeout(run, 5000)
  } else if (result.includes('황사마스크 중형')) {
    sendMessage('웰킵스 마스크를 구입할 수 있습니다.')
  } else {
    console.log(`페이지가 비정상입니다. [ ${++count}번째 시도중 ]`)
    setTimeout(run, 5000)
  }
}
run()