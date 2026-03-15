const axios = require('axios')
const { notifyTelegram } = require('noti_bot')
const dotenv = require('dotenv')
dotenv.config()

const candidateList = process.env.CANDIDATE_LIST.split(',')
const telegramChatId = process.env.TELEGRAM_CHAT_ID
const telegramToken = process.env.TELEGRAM_TOKEN

const main = async () => {
    const { data } = await axios.get('https://www.vicmaster.xyz/api/candidates/masternodes?page=1&limit=150&sortBy=capacity&sortDesc=true')
    const masternodes = data.items
    if (!masternodes || masternodes.length === 0) {
        return
    }
    const masternodeList = masternodes.filter(masternode => masternode.candidate)
    for (const c of candidateList) {
        if (masternodeList.includes(c)) {
            continue
        }
        await notifyTelegram(`Masternode ${c} is not in the list`, telegramToken, telegramChatId, true)
    }
}

main()
