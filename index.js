const axios = require('axios')
const { notifyTelegram } = require('noti_bot')
const dotenv = require('dotenv')
dotenv.config()

const localList = process.env.CANDIDATE_LIST.split(',')
const candidateUrl = process.env.CANDIDATE_URL
const telegramChatId = process.env.TELEGRAM_CHAT_ID
const telegramToken = process.env.TELEGRAM_TOKEN
const runOnce = process.env.RUN_ONCE === 'true'
const targetStatus = process.env.TARGET_STATUS

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

const main = async () => {
    while (!runOnce) {
        const { data } = await axios.get(
            candidateUrl
        )
        const remoteList = data.items
        if (!remoteList || remoteList.length === 0) {
            return
        }
        let remoteMap = {}
        for (const c of remoteList) {
            if (c?.candidate != null) {
                remoteMap[c.candidate] = c.status
            }
        }
        for (const c of localList) {
            if (!remoteMap[c] || remoteMap[c] !== targetStatus) {
                console.log(`Candidate is not in the list`)
                await notifyTelegram(`Candidate ${c} is not in the list`, telegramToken, telegramChatId, true)
            }
        }
        await sleep(5 * 60 * 1000)
    }
    return
}

main()
