require("dotenv").config();

export const config = {
  token: "6901432975:AAEuoR4lR66WnGJlCSvrITLgHRQFOs0hcnU",
  token_m10: "6251400262:AAEsMZnArltOcdM73AheblPtetXJ4ZKR7_g",
  token_homebroker:
    "7140356003:AAF3uvcCUOQefx01iLLEHyh5gSjQhdCHAKw",
  DETONABET_CHAT_ID: "-4159341736",
  ESPANCABET_CHAT_ID: "-4188071259",
  M10BET_CHAT_ID: "-4181426316",
  BETMASTERPRO_CHAT_ID: "-4182842961",
  ESPORTIVA_KADU_CHAT_ID: "-1002095648285",
  BETGREEN_CHAT_ID: "-4235325042",
  HOMEBROKER_CHAT_ID: "-1002153658338",
  HOMEBROKER_CHAT_ID2: "-1002324039991",
};

export const casasInfos = {
  espanca: {
    baseURL:
      "https://espancabet-my-team-18bb29a2.vercel.app/api",
    chatId: config.ESPANCABET_CHAT_ID,
  },
  detona: {
    baseURL: "https://detonabet-my-team-18bb29a2.vercel.app/api",
    chatId: config.DETONABET_CHAT_ID,
  },
  M10: {
    baseURL: "https://m10-tips.vercel.app/api",
    chatId: config.M10BET_CHAT_ID,
  },
  betmasterpro: {
    baseURL:
      "https://betmasterpro-git-main-my-team-18bb29a2.vercel.app/api",
    chatId: config.BETMASTERPRO_CHAT_ID,
  },
  esportivakadu: {
    baseURL: "https://esportiva-bet-kadutips.vercel.app/api",
    chatId: config.ESPORTIVA_KADU_CHAT_ID,
  },
  betgreen: {
    baseURL: "https://greenbets.vercel.app/api",
    chatId: config.BETGREEN_CHAT_ID,
  },
  homebroker: {
    baseURL: "https://operacoes-homebroker.vercel.app/api",
    chatId: config.HOMEBROKER_CHAT_ID,
  },
  homebroker2: {
    baseURL: "https://operacoes-homebroker.vercel.app/api",
    chatId: config.HOMEBROKER_CHAT_ID2,
  },
};

export type CasasInfosKeys = keyof typeof casasInfos;
