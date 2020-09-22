const {Wechaty, Friendship, Contact} = require('wechaty')
const {PuppetPadplus} = require('wechaty-puppet-padplus')
require('dotenv').config();

const token = process.env.token
const puppet = new PuppetPadplus({
    token
})

const bot = new Wechaty({name: process.env.name, puppet})
    .on('scan', onScan)
    .on('login', user => console.log(user))
    .on('message', onMsg)
    .on('friendship', onFriendship)
bot.start()

/**
 * 扫码登录
 * @param qrcode
 * @param status
 */
function onScan(qrcode, status) {
    require('qrcode-terminal').generate(qrcode, {small: true})
    const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        encodeURIComponent(qrcode)
    ].join('')
    console.log(status, qrcodeImageUrl)
}

/**
 * 收到好友消息自动回复
 * @param msg
 * @returns {Promise<void>}
 */
async function onMsg(msg) {
    //收到好友消息，自动回复
    if (!msg.room() && !msg.self() && msg.from().type() === Contact.Type.Individual) {
        await msg.say(`本消息为自动回复 1、拼多多没办法有偿助力；2、可以有偿助力的有：淘宝京东领券，可以在淘宝可以上找客服回复"淘宝京东有偿助力"；3、店铺：克瑞斯的云上杂货铺`)
    }
}

/**
 * 收到好友申请自动同意并拉入指定的群
 * @param friendship
 * @returns {Promise<void>}
 */
async function onFriendship(friendship) {
    if (friendship.type() === Friendship.Type.Receive) {
        //同意好友申请
        friendship.accept()
        //查询当前好友
        const contact = await bot.Contact.find({
            id: friendship.contact().id
        })
        //群ID
        let roomId = "22178701187@chatroom"
        //查询群
        const room = await bot.Room.find({
            id: roomId
        })
        //给好友发送入群邀请
        if (contact && room) {
            try {
                await room.add(contact)
            } catch (e) {
                console.log(e)
            }
        }
    }
}
