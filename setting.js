const chalk = require("chalk")
const fs = require("fs")

  global.ownerNumber = "6289673129395@s.whatsapp.net"
  global.kontakOwner = "6289673129395"
  global.namaStore = "N Store"
  global.botName = "N Bot"
  global.ownerName = "Hafizh Ikna"
  
  
  global.linkyt = "--"
  global.linkig = "--" 
  global.dana = "Payment dana" 
  global.gopay = "Payment gopay" 
  global.sawer = "--" 
 global.linkgc1 = "Link grup WhatsApp mu (1)"
 global.linkgc2 = "--"
//Jikalau dari salah satu di atas kalian tidak memiliki 
//silahkan kosongkan atau isi --


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})