require("dotenv").config();

export const config = {
  token_homebroker:
    "7140356003:AAF3uvcCUOQefx01iLLEHyh5gSjQhdCHAKw",

  HOMEBROKEROPENMARKET_CHAT_ID: "-1002324039991",
  HOMEBROKEROTC_CHAT_ID: "-1002153658338",
  AVALONOTC_CHAT_ID: "-1002380788259",
};

export const casasInfos = {
  homebroker: {
    baseURL: "https://operacoes-homebroker.vercel.app/api",
    chatId: config.HOMEBROKEROPENMARKET_CHAT_ID,
  },
  homebrokerOTC: {
    baseURL: "https://operacoes-homebroker.vercel.app/api",
    chatId: config.HOMEBROKEROTC_CHAT_ID,
  },
  avalon: {
    baseURL: "https://operacoes-homebroker.vercel.app/api",
    chatId: config.AVALONOTC_CHAT_ID,
  },
};

export type CasasInfosKeys = keyof typeof casasInfos;
