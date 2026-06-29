
require('./setting')
const { BufferJSON, WA_DEFAULT_EPHEMERAL, proto, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@whiskeysockets/baileys')
const { getAggregateVotesInPollMessage, downloadContentFromMessage, generateWAMessage, generateWAMessageFromContent, MessageType, buttonsMessage } = require("@whiskeysockets/baileys")
const { exec, spawn } = require("child_process");
const { color, bgcolor, pickRandom, randomNomor } = require('./lib/console.js')
const { isUrl, getRandom, getGroupAdmins, runtime, sleep, reSize, makeid, fetchJson, getBuffer } = require("./lib/myfunc");
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./lib/all-function');
const { addResponTesti, delResponTesti, isAlreadyResponTesti, sendResponTesti, updateResponTesti, getDataResponTesti } = require('./lib/all-function');
const { addResponProduk, delResponProduk, resetProdukAll, isAlreadyResponProduk, sendResponProduk, updateResponProduk, getDataResponProduk } = require('./lib/all-function');
const { isSetDone, addSetDone, removeSetDone, changeSetDone, getTextSetDone } = require('./lib/all-function');
const { isSetProses, addSetProses, removeSetProses, changeSetProses, getTextSetProses } = require('./lib/all-function');
const { addSewaGroup, getSewaExpired, getSewaPosition, expiredCheck, checkSewaGroup } = require('./lib/all-function');
const { remini } = require('./lib/scraper2');
const toMs = require("ms");

// apinya
const fs = require("fs");
const ms = require("ms");
const chalk = require('chalk');
const axios = require("axios");
const colors = require('colors/safe');
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment-timezone");
const { UploadFileUgu } = require('./lib/Upload_Url');

// Database
const antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
const antilink2 = JSON.parse(fs.readFileSync('./database/antilink2.json'));
const mess = JSON.parse(fs.readFileSync('./mess.json'));
const welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
const db_error = JSON.parse(fs.readFileSync('./database/error.json'));
const db_respon_list = JSON.parse(fs.readFileSync('./database/list.json'));
const db_respon_testi = JSON.parse(fs.readFileSync('./database/list-testi.json'));
const db_respon_produk = JSON.parse(fs.readFileSync('./database/list-produk.json'));
let set_done = JSON.parse(fs.readFileSync('./database/set_done.json'));
let set_proses = JSON.parse(fs.readFileSync('./database/set_proses.json'));
const sewa = JSON.parse(fs.readFileSync('./database/sewa.json'));

moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async(ramz, msg, m, setting, store) => {
try {
const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg
if (msg.isBaileys) return
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
const content = JSON.stringify(msg.message)
const from = msg.key.remoteJid
const time = moment(new Date()).format("HH:mm");
var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
if (chats == undefined) { chats = '' }
const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const isOwner = [`${global.ownerNumber}`,"6285791220179@s.whatsapp.net","6285806240904@s.whatsapp.net"].includes(sender) ? true : false
const pushname = msg.pushName
const body = chats.startsWith(prefix) ? chats : ''
const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const isCommand = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const botNumber = ramz.user.id.split(':')[0] + '@s.whatsapp.net'

// Group
const groupMetadata = isGroup ? await ramz.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender)
const isAntiLink = antilink.includes(from) ? true : false
const isAntiLink2 = antilink2.includes(from) ? true : false
const isWelcome = isGroup ? welcome.includes(from) : false
const isSewa = checkSewaGroup(from, sewa);

// Quoted
const quoted = msg.quoted ? msg.quoted : msg
const isImage = (type == 'imageMessage')
const isQuotedMsg = (type == 'extendedTextMessage')
const isMedia = (type === 'imageMessage' || type === 'videoMessage');
const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
const isVideo = (type == 'videoMessage')
const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
const isSticker = (type == 'stickerMessage')
const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false 
const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isListMessage = dataListG.length !== 0 ? dataListG : dataList

function mentions(teks, mems = [], id) {
if (id == null || id == undefined || id == false) {
let res = ramz.sendMessage(from, { text: teks, mentions: mems })
return res
} else {
let res = ramz.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
return res
}
}

const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByReply) : []
const mentionUser = mention != undefined ? mention.filter(n => n) : []

async function downloadAndSaveMediaMessage (type_file, path_file) {
if (type_file === 'image') {
var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]) }
fs.writeFileSync(path_file, buffer)
return path_file } 
else if (type_file === 'video') {
var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file
} else if (type_file === 'sticker') {
var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file
} else if (type_file === 'audio') {
var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file}
}
function TelegraPh(path) {
    return new Promise(async (resolve, reject) => {
	const { ImageUploadService } = require('node-upload-images')
const service = new ImageUploadService('pixhost.to');
    try {
let { directLink } = await service.uploadFromBinary(fs.readFileSync(path), 'ramagnz.jpg');
let teks = directLink.toString()
			return resolve(teks)
		} catch (err) {
			return reject(new Error(String(err)))
		}
        })
    }
    
const reply = (teks) => {ramz.sendMessage(from, { text: teks }, { quoted: msg })}

//Antilink
if (isGroup && isAntiLink && isBotGroupAdmins){
if (chats.includes(`https://chat.whatsapp.com/`) || chats.includes(`http://chat.whatsapp.com/`)) {
if (!isBotGroupAdmins) return reply('Untung bot bukan admin')
if (isOwner) return reply('Untung lu owner ku:v😙')
if (isGroupAdmins) return reply('Admin grup mah bebas ygy🤭')
if (fromMe) return reply('bot bebas Share link')
await ramz.sendMessage(from, { delete: msg.key })
reply(`*「 GROUP LINK DETECTOR 」*\n\nTerdeteksi mengirim link group,Maaf sepertinya kamu akan di kick`)
ramz.groupParticipantsUpdate(from, [sender], "remove")
}
}

//Antilink 2
if (isGroup && isAntiLink2 && isBotGroupAdmins){
if (chats.includes(`https://chat.whatsapp.com/`) || chats.includes(`http://chat.whatsapp.com/`)) {
if (!isBotGroupAdmins) return reply('Untung bot bukan admin')
if (isOwner) return reply('Untung lu owner ku:v😙')
if (isGroupAdmins) return reply('Admin grup mah bebas ygy🤭')
if (fromMe) return reply('bot bebas Share link')
await ramz.sendMessage(from, { delete: msg.key })
reply(`*「 GROUP LINK DETECTOR 」*\n\nTerdeteksi mengirim link group`)
}
}

// Response Addlist
if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
var get_data_respon = getDataResponList(from, chats, db_respon_list)
if (get_data_respon.isImage === false) {
ramz.sendMessage(from, { text: sendResponList(from, chats, db_respon_list) }, {
quoted: msg
})
} else {
ramz.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {quoted: msg})
}
}
if (!isGroup && isAlreadyResponTesti(chats, db_respon_testi)) {
var get_data_respon = getDataResponTesti(chats, db_respon_testi)
ramz.sendMessage(from, { image: { url: get_data_respon.image_url }, caption: get_data_respon.response }, { quoted: msg })
}
if (!isGroup && isAlreadyResponProduk(chats, db_respon_produk)) {
var get_data_respon = getDataResponProduk(chats, db_respon_produk)
ramz.sendMessage(from, { image: { url: get_data_respon.image_url }, caption: get_data_respon.response }, { quoted: msg })
}

//cek sewa otomatis 
if (msg.isGroup) {
      expiredCheck(ramz, sewa);
    } 


const sendContact = (jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'END:VCARD'
return ramz.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
}

function readSewaFile() {
          try {
            const fileContent = fs.readFileSync("database/sewa.json", "utf-8");
            return JSON.parse(fileContent);
          } catch (error) {
            console.error("Error di bagian sewa.json", error);
            return [];
          }
        }
async function getGcName(groupID) {
      try {
        let data_name = await ramz.groupMetadata(groupID);
        return data_name.subject;
      } catch (err) {
        return "-";
      }
    }
    function msToDate(mse) {
  temp = mse;
  days = Math.floor(mse / (24 * 60 * 60 * 1000));
  daysms = mse % (24 * 60 * 60 * 1000);
  hours = Math.floor(daysms / (60 * 60 * 1000));
  hoursms = mse % (60 * 60 * 1000);
  minutes = Math.floor(hoursms / (60 * 1000));
  minutesms = mse % (60 * 1000);
  sec = Math.floor(minutesms / 1000);
  return days + " Days " + hours + " Hours " + minutes + " Minutes";
}


const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `Bot Created By ${global.ownerName}\n`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${global.botName},;;;\nFN:Halo ${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': { url: `${global.qris}` }}}}
//const fkontak = msg

function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}


// Console
if (isGroup && isCmd) {
console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(groupName));
}
if (!isGroup && isCmd) {
console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(pushname));
}

// Casenya
switch(command) {
	case 'help':
	case 'menu':{
		const mark_slebew = '0@s.whatsapp.net'
const more = String.fromCharCode(8206)
const strip_ny = more.repeat(4001)
let simbol = `${pickRandom(["⭔","⌬","〆","»"])}`
var footer_nya =`Creator by - ${global.ownerName}`
var ramex = `./SCRIPT BY RAMAA GNNZ`
	let menu = `━━━━━[ ${global.botName} ]━━━━━


┏━━━『 𝘿𝘼𝙏𝘼 𝘽𝙊𝙏 』━━━━━◧
┃
┣» ᴄʀᴇᴀᴛᴏʀ : @${global.kontakOwner}
┣» ʙᴏᴛ ɴᴀᴍᴇ : ${global.botName}
┣» ᴏᴡɴᴇʀ ɴᴀᴍᴇ : ${global.ownerName} 
┣» ʀᴜɴɴɪɴɢ : ᴘᴀɴᴇʟ
┃
┗━◧


┏           『 𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 』           ◧

${simbol} .allmenu
${simbol} .pay
${simbol} .testi
${simbol} .produk
${simbol} .kalkulator
${simbol} .owner
${simbol} .donasi

┗━◧`
ramz.sendMessage(from, {
text: menu},
 {quoted: fkontak})
}
break
case 'allmenu':{
	let simbol = `${pickRandom(["⭔","⌬","〆","»"])}`
	let menu = `
───「 *⭐ALL MENU⭐* 」───
	
	
┏           『 𝙈𝙖𝙞𝙣 𝙈𝙚𝙣𝙪 』           ◧

${simbol} .ffstalk
${simbol} .mlstalk
${simbol} .tiktok
${simbol} .tiktokaudio
${simbol} .produk
${simbol} .listproduk
${simbol} .donasi
${simbol} .ping
${simbol} .test
${simbol} .pay
${simbol} .pembayaran 
${simbol} .sticker 

┗━◧


┏           『 𝙂𝙧𝙤𝙪𝙥 𝙈𝙚𝙣𝙪 』           ◧

${simbol} .ceksewa
${simbol} .hidetag
${simbol} .group open
${simbol} .group close 
${simbol} .antilink (kick)
${simbol} .antilink2 (no kick)
${simbol} .welcome on
${simbol} .welcome off
${simbol} .kick 
${simbol} .proses
${simbol} .done
${simbol} .setdone
${simbol} .delsetdone
${simbol} .changedone
${simbol} .setproses
${simbol} .delsetproses
${simbol} .changeproses
${simbol} .linkgc
${simbol} .tagall
${simbol} .fitnah
${simbol} .revoke
${simbol} .delete

${simbol} .addlist (Support image)
${simbol} .dellist
${simbol} .list 
${simbol} .shop
${simbol} .hapuslist

┗━◧


┏    『 *PROSES/DONE MENU* 』    ◧

${simbol} .proses
${simbol} .done
${simbol} .setdone
${simbol} .delsetdone
${simbol} .changedone
${simbol} .setproses
${simbol} .delsetproses
${simbol} .changeproses

┗━◧


┏           『 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 』           ◧

${simbol} .mode (on/off)
${simbol} .addsewa
${simbol} .delsewa
${simbol} .listsewa
${simbol} .gantiqris
${simbol} .addtesti
${simbol} .deltesti
${simbol} .addproduk
${simbol} .delproduk
${simbol} .join
${simbol} .sendbyr 62xxx
${simbol} .block 62xxx 
${simbol} .unblock 62xxx

┗━◧


┏           『 *Kalkulator* 』           ◧

${simbol} .tambah
${simbol} .kali
${simbol} .bagi
${simbol} .kurang 

┗━◧


┏   『 *SOSIAL MEDIA* 』        ◧

${simbol} .ig
${simbol} .yt
${simbol} .gc
${simbol} .youtube
${simbol} .Instagram 
${simbol} .groupadmin

┗━━━━━━━━━━━━━━━━━━◧
`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'sticker': case 's': case 'stiker':{
if (isImage || isQuotedImage) {
let media = await downloadAndSaveMediaMessage('image', `./gambar/${tanggal}.jpg`)
reply(mess.wait)
ramz.sendImageAsSticker(from, media, msg, { packname: `${global.namaStore}`, author: `Store Bot`})
} else if (isVideo || isQuotedVideo) {
let media = await downloadAndSaveMediaMessage('video', `./sticker/${tanggal}.mp4`)
reply(mess.wait)
ramz.sendVideoAsSticker(from, media, msg, { packname: `${global.namaStore}`, author: `Store Bot`})
} else {
reply(`Kirim/reply gambar/vidio dengan caption *${prefix+command}*`)
}
}
break
case 'owner':{
var owner_Nya = `${global.ownerNumber}`
sendContact(from, owner_Nya, `${global.ownerName}`, msg)
reply('*Itu kak nomor owner ku, Chat aja gk usah malu😆*')
}
break

case 'ffstalk':{
if (!q) return reply(`Kirim perintah ${prefix+command} id\nContoh: ${prefix+command} 2023873618`)
let anu = await fetchJson('https://api.gamestoreindonesia.com/v1/order/prepare/FREEFIRE?userId=' + q + '&zoneId=null')
if (!anu.statusCode == "404") return reply("Id tidak ditemukan")
    let dataa = anu.data
reply(`*BERHASIL DITEMUKAN*
ID: ${q}
Nickname: ${dataa}`)
}
break
case 'mlstalk':{
if (!q) return reply(`Kirim perintah ${prefix+command} id|zone\nContoh: ${prefix+command} 106281329|2228`)
var id = q.split('|')[0]
var zon = q.split('|')[1]
if (!id) return reply('ID wajib di isi')
if (!zon) return reply('ZoneID wajib di isi')
let anu = await fetchJson('https://api.gamestoreindonesia.com/v1/order/prepare/MOBILE_LEGENDS?userId=' + id + '&zoneId=' + zon)
if (!anu.statusCode == "404") return reply("Id/zone tidak ditemukan")
    let dataa = anu.data
reply(`*BERHSAIL DITEMUKAN*
ID: ${id}
Zone: ${zon}
Nickname: ${dataa}`)
}
break

case 'tiktok':{ 
if (!q) return reply( `Example : ${prefix + command} link`)
if (!q.includes('tiktok')) return reply(`Link Invalid!!`)
reply(mess.wait)
require('./lib/scraper2').Tiktok(q).then( data => {
ramz.sendMessage(from, { caption: `*Download Tiktok No Wm*`, video: { url: data.watermark }}, {quoted:msg})
})
}
break
case 'tiktokaudio':{
if (!q) return reply( `Example : ${prefix + command} link`)
if (!q.includes('tiktok')) return reply(`Link Invalid!!`)
reply(mess.wait)
require('./lib/scraper2').Tiktok(q).then( data => {
ramz.sendMessage(from, { audio: { url: data.audio }, mimetype: 'audio/mp4' }, { quoted: msg })
})
}
break
case 'yt':
case 'youtube':
	ramz.sendMessage(from, 
{text: `Jangan Lupa Subscriber yah kak
*Link* : ${global.linkyt}`},
{quoted: msg})
break
case 'ig':
case 'instagram':
	ramz.sendMessage(from, {text: `Follow Instragram kami\nLink \n${global.linkig}`},
{quoted: msg})
break
case 'gc':
case 'groupadmin':
	ramz.sendMessage(from, 
{text: `*Group  ${global.ownerName}*\n
Group1 : ${global.linkgc1}
Group2 : ${global.linkgc2}`},
{quoted: msg})
break
case 'donasi': case 'donate':{
let tekssss = `───「  *DONASI*  」────

*Payment donasi💰* 

- *Dana :* ${global.dana}
- *Gopay :*  ${global.gopay}
- *Saweria :* ${global.sawer}
- *Qris :* Scan qr di atas

berapapun donasi dari kalian itu sangat berarti bagi kami 
`
ramz.sendMessage(from, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${global.ownerName} © 2022`},
{quoted: msg})
}
break
case 'sendbyr':{
	if (!isOwner) return reply(mess.OnlyOwner)
	if (!q) return reply('*Contoh:*\n.add 628xxx')
	var number = q.replace(/[^0-9]/gi, '')+'@s.whatsapp.net'
let tekssss = `───「  *PAYMENT*  」────

- *Dana :* ${global.dana}
- *Gopay :*  ${global.gopay}
- *Qris :* Scan qr di atas

_Pembayaran ini Telah di kirim oleh Admin_
_Melalui bot ini🙏_


OK, thanks udah order di *${global.namaStore}*
`
ramz.sendMessage(number, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${global.ownerName} © 2022`},
{quoted: msg})
reply (`Suksess Owner ku tercinta 😘🙏`)
}
break
case 'join':{
 if (!isOwner) return reply(mess.OnlyOwner)
if (!q) return reply(`Kirim perintah ${prefix+command} _linkgrup_`)
var ini_urrrl = q.split('https://chat.whatsapp.com/')[1]
var data = await ramz.groupAcceptInvite(ini_urrrl).then((res) => reply(`Berhasil Join ke grup...`)).catch((err) => reply(`Eror.. Munkin bot telah di kick Dari grup tersebut`))
}
break
case 'pay':
case 'payment':
case 'pembayaran':
case 'bayar':{
let tekssss = `───「  *PAYMENT*  」────

- *Dana :* ${global.dana}
- *Gopay :*  ${global.gopay}
- *Qris :* Scan qr di atas

OK, thanks udah order di *${global.botName}*
`
ramz.sendMessage(from, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${global.ownerName} © 2022`},
{quoted: msg})
}
break
case 'mode':{
if (!isOwner) return reply(mess.OnlyOwner)
if (!args[0]) return reply(`Kirim perintah #${command} _options_\nOptions : on & off\nContoh : #${command} on`)
if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
if (isCmd) {
if (!msg.key.fromMe && !isOwner) return
reply('Secces mode Off')
}
} else if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
reply('Secces mode ON')
} else { reply('Kata kunci tidak ditemukan!') }
}
break
case 'p': case 'proses':{
if (!msg.key.fromMe && ! isOwner && !isGroup) return reply('Hanya Dapat Digunakan oleh Owner/admingrup')
if (!msg.key.fromMe && ! isOwner && !isGroupAdmins) return reply('Hanya Dapat Digunakan oleh Owner/admingrup')
if (!quotedMsg) return reply('Reply pesanannya!')
let proses = `「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Pending\`\`\`\n\n📝 Catatan : ${quotedMsg.chats}\n\nPesanan @${quotedMsg.sender.split("@")[0]} sedang di proses!`
const getTextP = getTextSetProses(from, set_proses);
if (getTextP !== undefined) {
mentions(getTextP.replace('pesan', quotedMsg.chats).replace('nama', quotedMsg.sender.split("@")[0]).replace('jam', jam).replace('tanggal', tanggal), [quotedMsg.sender], true)
} else {
mentions(proses, [quotedMsg.sender], true)
}
}
break
case 'd': case 'done':{
if (!msg.key.fromMe && ! isOwner && !isGroup) return reply('Hanya Dapat Digunakan oleh Owner/admingrup')
if (!msg.key.fromMe && ! isOwner && !isGroupAdmins) return reply('Hanya Dapat Digunakan oleh Owner/admingrup')
if (!quotedMsg) return reply('Reply pesanannya!')
let sukses = `「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Berhasil\`\`\`\n\nTerimakasih @${quotedMsg.sender.split("@")[0]} Next Order ya??`
const getTextD = getTextSetDone(from, set_done);
if (getTextD !== undefined) {
mentions(getTextD.replace('pesan', quotedMsg.chats).replace('nama', quotedMsg.sender.split("@")[0]).replace('jam', jam).replace('tanggal', tanggal), [quotedMsg.sender], true);
} else {
mentions(sukses, [quotedMsg.sender], true)
}
}
break

case 'tambah':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one + nilai_two}`)
break
case 'kurang':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one - nilai_two}`)
break
case 'kali':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one * nilai_two}`)
break
case 'bagi':
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one / nilai_two}`)
break
case 'hidetag':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
let mem = [];
groupMembers.map( i => mem.push(i.id) )
ramz.sendMessage(from, { text: q ? q : '', mentions: mem })
break
case 'antilink':{
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!args[0]) return reply(`Kirim perintah #${command} _options_\nOptions : on & off\nContoh : #${command} on`)
if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
if (isAntiLink) return reply('Antilink sudah aktif')
antilink.push(from)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Activate Antilink In This Group')
} else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
if (!isAntiLink) return reply('Antilink belum aktif')
let anu = antilink.indexOf(from)
antilink.splice(anu, 1)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Disabling Antilink In This Group')
} else { reply('Kata kunci tidak ditemukan!') }
}
break
case 'tagall':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Teks?\nContoh #tagall hallo`)
let teks_tagall = `══✪〘 *👥 Tag All* 〙✪══\n\n${q ? q : ''}\n\n`
for (let mem of participants) {
teks_tagall += `➲ @${mem.id.split('@')[0]}\n`
}
ramz.sendMessage(from, { text: teks_tagall, mentions: participants.map(a => a.id) }, { quoted: msg })
break
case 'fitnah':
if (!isGroup) return reply(mess.OnlyGrup)
if (!q) return reply(`Kirim perintah #*${command}* @tag|pesantarget|pesanbot`)
var org = q.split("|")[0]
var target = q.split("|")[1]
var bot = q.split("|")[2]
if (!org.startsWith('@')) return reply('Tag orangnya')
if (!target) return reply(`Masukkan pesan target!`)
if (!bot) return reply(`Masukkan pesan bot!`)
var mens = parseMention(target)
var msg1 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { extemdedTextMessage: { text: `${target}`, contextInfo: { mentionedJid: mens }}}}
var msg2 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { conversation: `${target}` }}
ramz.sendMessage(from, { text: bot, mentions: mentioned }, { quoted: mens.length > 2 ? msg1 : msg2 })
break
case 'del':
case 'delete':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!quotedMsg) return reply(`Balas chat dari bot yang ingin dihapus`)
if (!quotedMsg.fromMe) return reply(`Hanya bisa menghapus chat dari bot`)
ramz.sendMessage(from, { delete: { fromMe: true, id: quotedMsg.id, remoteJid: from }})
break
case 'linkgrup': case 'linkgc':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var url = await ramz.groupInviteCode(from).catch(() => reply(mess.error.api))
url = 'https://chat.whatsapp.com/'+url
reply(url)
break
case 'revoke':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
await ramz.groupRevokeInvite(from)
.then( res => {
reply(`Sukses menyetel tautan undangan grup ini`)
}).catch(() => reply(mess.error.api))
break
case 'antilink2':{
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!args[0]) return reply(`Kirim perintah #${command} _options_\nOptions : on & off\nContoh : #${command} on`)
if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
if (isAntiLink2) return reply('Antilink 2 sudah aktif')
antilink2.push(from)
fs.writeFileSync('./database/antilink2.json', JSON.stringify(antilink2, null, 2))
reply('Successfully Activate Antilink 2 In This Group')
} else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
if (!isAntiLink2) return reply('Antilink 2 belum aktif')
let anu = antilink2.indexOf(from)
antilink2.splice(anu, 1)
fs.writeFileSync('./database/antilink2.json', JSON.stringify(antilink2, null, 2))
reply('Successfully Disabling Antilink 2 In This Group')
} else { reply('Kata kunci tidak ditemukan!') }
}
break
case 'group':
case 'grup':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!q) return reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
if (args[0] == "close") {
ramz.groupSettingUpdate(from, 'announcement')
reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
} else if (args[0] == "open") {
ramz.groupSettingUpdate(from, 'not_announcement')
reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
} else {
reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
}
break
case 'kick':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var number;
if (mentionUser.length !== 0) {
number = mentionUser[0]
ramz.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else if (isQuotedMsg) {
number = quotedMsg.sender
ramz.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
}
break
case 'welcome':{
if (!isGroup) return reply('Khusus Group!') 
if (!msg.key.fromMe && !isOwner && !isGroupAdmins) return reply("Mau ngapain?, Fitur ini khusus admin")
if (!args[0]) return reply('*Kirim Format*\n\n.welcome on\n.welcome off')
if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
if (isWelcome) return reply('Sudah aktif✓')
welcome.push(from)
fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
reply('Suksess mengaktifkan welcome di group:\n'+groupName)
} else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
var posi = welcome.indexOf(from)
welcome.splice(posi, 1)
fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
reply('Success menonaktifkan welcome di group:\n'+groupName)
} else { reply('Kata kunci tidak ditemukan!') }
}
break
case 'block':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Block\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await ramz.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "block") // Block user
reply('Sukses Block Nomor')
}
break
case 'unblock':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Unblock\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await ramz.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "unblock")
reply('Sukses Unblock Nomor')
}
break
case 'shop':
case 'list':
    if (!isGroup) {
        return reply(mess.OnlyGrup)
    }
    if (db_respon_list.length === 0) {
        return reply("Belum ada list message di database")
    }
    if (!isAlreadyResponListGroup(from, db_respon_list)) {
        return reply("Belum ada list message yang terdaftar di group ini")
    }

    var arr_rows = []
    for (let x of db_respon_list) {
        if (x.id === from) {
            arr_rows.push({
                title: x.key,
                rowId: x.key
            })
        }
    }

    let tekny = `Hai @${sender.split("@")[0]}\nKETIK NAMA PRODUK\nCONTOH : DISCORD\n\n*LIST PRODUK:*\n\n`
    for (let i of arr_rows) {
        tekny += `≫ ${i.title.toUpperCase()}\n`
    }

    var listMsg = {
        text: tekny,
        mentions: [sender]
    }

    ramz.sendMessage(from, listMsg)
    break
  break;
case 'addlist':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
var args1 = q.split("@")[0]
var args2 = q.split("@")[1]
if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n#${command} tes@apa\n\nAtau kalian bisa Reply/Kasih Image dengan caption: #${command} tes@apa`)
if (isImage || isQuotedImage) {
if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
let media = await downloadAndSaveMediaMessage('image', `./gambar/${sender.split('@')[0]}.jpg`)
let url = await TelegraPh(media)
addResponList(from, args1, args2, true, url, db_respon_list)
reply(`Berhasil menambah List menu : *${args1}*`)
} else {
	if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
	addResponList(from, args1, args2, false, '-', db_respon_list)
reply(`Berhasil menambah List menu : *${args1}*`)
}
break
case 'dellist':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: `#hapuslist ${x.key}`
})
}
}
let tekny = `Hai @${sender.split("@")[0]}\nSilahkan Hapus list dengan Mengetik #hapuslist Nama list\n\nContoh: #hapuslist Tes\n\n`;
  for (let i of arr_rows) {
    tekny += `List : ${i.title}\n\n`;
  }
var listMsg = {
    text: tekny,
  };
ramz.sendMessage(from, listMsg)
}
break
case 'hapuslist':
delResponList(from, q, db_respon_list)
reply(`Sukses delete list message dengan key *${q}*`)
break
case 'sc':
case 'script':
case 'scbot':
case 'scriptbot':{
reply(`𝗦𝗖𝗥𝗜𝗣𝗧 𝗞𝗛𝗨𝗦𝗨𝗦 𝗦𝗧𝗢𝗥𝗘 𝗩7

-Untuk Script nya bisa kalian dapatkan di YouTube saya
: https://youtube.com/@RamaaGnnZ
-Judul Sc:
: SC STORE V7

Sosial media
https://sociabuzz.com/ramaagnnz`)
}    
break
case 'testi':{
if (isGroup) return reply(mess.OnlyPM)
if (db_respon_testi.length === 0) return reply(`Belum ada list testi di database`)
var teks = `Hi @${sender.split("@")[0]}\nBerikut list testi\n\n`
for (let x of db_respon_testi) {
teks += `*LIST TESTI:* ${x.key}\n\n`
}
teks += `_Ingin melihat listnya?_\n_Ketik List Testi yang ada di atss_`
var listMsg = {
text: teks,
mentions: [sender]
}
ramz.sendMessage(from, listMsg, { quoted: msg })
}
break
case 'addtesti':
if (isGroup) return reply(mess.OnlyPM)
if (!isOwner) return reply(mess.OnlyOwner)
var args1 = q.split("@")[0]
var args2 = q.split("@")[1]
if (isImage || isQuotedImage) {
if (!q.includes("@")) return reply(`Gunakan dengan cara ${prefix+command} *key@response*\n\n_Contoh_\n\n${prefix+command} testi1@testimoni sc bot`)
if (isAlreadyResponTesti(args1, db_respon_testi)) return reply(`List respon dengan key : *${args1}* sudah ada.`)
let media = await downloadAndSaveMediaMessage('image', `./gambar/${sender}`)
let tphurl = await TelegraPh(media)
addResponTesti(args1, args2, true, tphurl, db_respon_testi)
reply(`Berhasil menambah List testi *${args1}*`)
if (fs.existsSync(media)) return fs.unlinkSync(media)
} else {
	reply(`Kirim gambar dengan caption ${prefix+command} *key@response* atau reply gambar yang sudah ada dengan caption ${prefix+command} *key@response*`)
	}
break
case 'deltesti':
if (isGroup) return reply(mess.OnlyPM)
if (!isOwner) return reply(mess.OnlyOwner)
if (db_respon_testi.length === 0) return reply(`Belum ada list testi di database`)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *key*\n\n_Contoh_\n\n${prefix+command} testi1`)
if (!isAlreadyResponTesti(q, db_respon_testi)) return reply(`List testi dengan key *${q}* tidak ada di database!`)
delResponTesti(q, db_respon_testi)
reply(`Sukses delete list testi dengan key *${q}*`)
break
case 'listproduk': case 'produk':{
if (isGroup) return reply(mess.OnlyPM)
if (db_respon_produk.length === 0) return reply(`Belum ada list produk di database`)
var teks = `Hi @${sender.split("@")[0]}\nBerikut list produk\n\n`
for (let x of db_respon_produk) {
teks += `*LIST PRODUK:* ${x.key}\n\n`
}
teks += `_Ingin melihat listnya?_\n_Ketik List Produk yang ada di atss_`
var listMsg = {
text: teks,
mentions: [sender]
}
ramz.sendMessage(from, listMsg, { quoted: msg })
}
break
case 'addproduk':
if (isGroup) return reply(mess.OnlyPM)
if (!isOwner) return reply(mess.OnlyOwner)
var args1 = q.split("@")[0]
var args2 = q.split("@")[1]
if (isImage || isQuotedImage) {
if (!q.includes("@")) return reply(`Gunakan dengan cara ${prefix+command} *key@response*\n\n_Contoh_\n\n${prefix+command} diamond_ml@list mu`)
if (isAlreadyResponProduk(args1, db_respon_produk)) return reply(`List respon dengan key : *${args1}* sudah ada.`)
let media = await downloadAndSaveMediaMessage('image', `./gambar/${sender}`)
let tphurl = await TelegraPh(media)
addResponProduk(args1, args2, true, tphurl, db_respon_produk)
reply(`Berhasil menambah List Produk *${args1}*`)
if (fs.existsSync(media)) return fs.unlinkSync(media)
} else {
	reply(`Kirim gambar dengan caption ${prefix+command} *key@response* atau reply gambar yang sudah ada dengan caption ${prefix+command} *key@response*`)
	}
break
case 'delproduk':
if (isGroup) return reply(mess.OnlyPM)
if (!isOwner) return reply(mess.OnlyOwner)
if (db_respon_produk.length === 0) return reply(`Belum ada list produk di database`)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *key*\n\n_Contoh_\n\n${prefix+command} diamond_ml`)
if (!isAlreadyResponProduk(q, db_respon_produk)) return reply(`List testi dengan key *${q}* tidak ada di database!`)
delResponProduk(q, db_respon_produk)
reply(`Sukses delete list testi dengan key *${q}*`)
break
case 'setdone': case 'setd':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_done*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama\n\nList Opts : tanggal/jamwib`)
if (isSetDone(from, set_done)) return reply(`Set done already active`)
addSetDone(q, from, set_done)
reply(`Successfully set done!`)
break

case 'delsetdone': case 'delsetd':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isSetDone(from, set_done)) return reply(`Belum ada set done di sini..`)
removeSetDone(from, set_done)
reply(`Sukses delete set done`)
break

case 'changedone': case 'changed':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_done*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama\n\nList Opts : tanggal/jamwib`)
if (isSetDone(from, set_done)) {
changeSetDone(q, from, set_done)
reply(`Sukses change set done teks!`)
} else {
addSetDone(q, from, set_done)
reply(`Sukses change set done teks!`)
}
break

case 'setproses': case 'setp':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara *${prefix+command} teks*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama`)
if (isSetProses(from, set_proses)) return reply(`Set proses already active`)
addSetProses(q, from, set_proses)
reply(`Sukses set proses!`)
break

case 'delsetproses': case 'delsetp':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isSetProses(from, set_proses)) return reply(`Belum ada set proses di sini..`)
removeSetProses(from, set_proses)
reply(`Sukses delete set proses`)
break

case 'changeproses': case 'changep':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_p*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama`)
if (isSetProses(from, set_proses)) {
changeSetProses(q, from, set_proses)
reply(`Sukses change set proses teks!`)
} else {
addSetProses(q, from, set_proses)
reply(`Sukses change set proses teks!`)
}
break
case 'gantiqris':{
	if (!isOwner) return reply(mess.OnlyOwner)
if (isImage || isQuotedImage) {
	let media = await downloadAndSaveMediaMessage('image', `./gambar/${sender}`)
	fs.unlinkSync(`./gambar/qris.jpg`)
	fs.renameSync(media, `./gambar/qris.jpg`)
reply(`Sukses mengganti Image Qris`)
} else {
	reply(`kirim gambar/reply gambar dengan caption .gantiqris`)
}
}
break
case 'addsewa': {
	if (q < 2) return reply(`Contoh: ${prefix + command} *linkgc waktu*\n\nContoh : ${command} https://chat.whatsapp.com/JanPql7MaMLa 30d\n\n*CATATAN:*\nd = hari (day)\nm = menit(minute)\ns = detik (second)\ny = tahun (year)\nh = jam (hour)`)
var url = q.split(' ')[0]
var hari = q.split(' ')[1]
if (!isUrl(url)) return reply("Link grup tidak valid");
var urrll = url.split('https://chat.whatsapp.com/')[1]
var data = await ramz.groupAcceptInvite(urrll);
if (checkSewaGroup(data, sewa)) return reply(`Bot sudah disewakan di grup tersebut 🙂‍↔️`);
   addSewaGroup(data, hari, sewa);
          reply(`Bot berhasil disewakan dalam waktu *${hari}* 🙂‍↕️`)
          ramz.sendMessage(data, {text: `Haii...\nBot telah disewakan di grup ini selama *${hari}* ketik .menu untuk memulai bot, jika tidak merespon ketik 2x agar bot bisa merespon`})
          }
          break
          case 'delsewa': {
          if (!isOwner) return reply(mess.OnlyOwner);
          if (!isGroup) return reply(`Khusus di dalam group`)
          if (!isSewa) return m.reply(`Bot tidak disewakan di grup ini🙂‍↔️`);
          sewa.splice(getSewaPosition(from, sewa), 1);
          fs.writeFileSync("./database/sewa.json",JSON.stringify(sewa, null, 2));
          reply(`Suksess delete sewa di grup ini🙂‍↕️`);
        }
        break
        case 'ceksewa': {
          if (!isGroup) return reply("fitur ini khusus di grub🙂‍↔️");
          try {
            const sewaData = await readSewaFile();
            const matchingEntry = sewaData.find(
              (entry) => entry.id === msg.key.remoteJid
            );
            if (matchingEntry) {
              const groupName = await getGcName(matchingEntry.id);
              const dateexpired = matchingEntry.expired - Date.now();
              const formattedDate = msToDate(dateexpired);
              reply(`*CEK SEWA DI GROUP ${groupName}*\n\n*⌛EXPIRED TIME:* ${formattedDate}`
              );
            } else {
              reply("Grup ini tidak disewakan");
            }
          } catch (error) {
            console.error("ror", error);
            reply("An error occurred while processing the request.");
          }
        }
        break;
   case 'listsewa': {       
          if (!isOwner) return reply(mess.OnlyOwner);
          if (isGroup) return reply(`Fitur ini tidak dapat digunakan dialam group`)
          let list_sewa_list = `*LIST SEWA BOT🤖*\n*Total Group:* ${sewa.length}\n\n`;
          let data_array = [];
          for (let x of sewa) {
            list_sewa_list += `*NAME:* ${await getGcName(x.id)}\n*ID :* ${x.id}\n`;
            if (x.expired === "PERMANENT") {
              let ceksewa = "PERMANENT";
              list_sewa_list += `*Expired :* Unlimited\n\n`;
            } else {
              let ceksewa = x.expired - Date.now();
              list_sewa_list += `*Expired :* ${msToDate(ceksewa)}\n\n`;
            }
          }
          ramz.sendMessage(from, { text: list_sewa_list }, { quoted: msg });
        }
        break;
default:
if ((budy) && ["assalamu'alaikum", "Assalamu'alaikum", "Assalamualaikum", "assalamualaikum", "Assalammualaikum", "assalammualaikum", "Asalamualaikum", "asalamualaikum", "Asalamu'alaikum", " asalamu'alaikum"].includes(budy) && !isCmd) {
ramz.sendMessage(from, { text: `${pickRandom(["Wa'alaikumussalam","Wa'alaikumussalam Wb.","Wa'alaikumussalam Wr. Wb.","Wa'alaikumussalam Warahmatullahi Wabarakatuh"])}`})
}
if ((budy) && ["tes", "Tes", "TES", "Test", "test", "ping", "Ping"].includes(budy) && !isCmd) {
ramz.sendMessage(from, { text: `${runtime(process.uptime())}*⏰`})
}

}} catch (err) {
console.log(color('[ERROR]', 'red'), err)
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const moment = require("moment-timezone");
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let kon_erorr = {"tanggal": tanggal, "jam": jam, "error": err, "user": sender}
db_error.push(kon_erorr)
fs.writeFileSync('./database/error.json', JSON.stringify(db_error))
var errny =`*SERVER ERROR*
*Dari:* @${sender.split("@")[0]}
*Jam:* ${jam}
*Tanggal:* ${tanggal}
*Tercatat:* ${db_error.length}
*Type:* ${err}`
ramz.sendMessage(`${global.ownerNumber}`, {text:errny, mentions:[sender]})
}}