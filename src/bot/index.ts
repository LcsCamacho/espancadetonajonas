import { Telegraf, Context } from "telegraf";
import { message } from "telegraf/filters";
import { Update } from "telegraf/typings/core/types/typegram";
import { casasInfos, config } from "../config";
import { updateTips } from "../cron/update";
import axios from "axios";

export type BotInstance = Telegraf<Context<Update>>;

const tagsCasa = {
  [config.ESPANCABET_CHAT_ID]: {
    casa: "espanca" as const,
  },
  [config.DETONABET_CHAT_ID]: {
    casa: "detona" as const,
  },
  [config.M10BET_CHAT_ID]: {
    casa: "M10" as const,
  },
  [config.BETMASTERPRO_CHAT_ID]: {
    casa: "betmasterpro" as const,
  },
  [config.ESPORTIVA_KADU_CHAT_ID]: {
    casa: "esportivakadu" as const,
  },
  [config.BETGREEN_CHAT_ID]: {
    casa: "betgreen" as const,
  },
};

interface SendToUpdateProps {
  message: string;
  chat: {
    id: number;
  };
  gameId?: string;
}

const sendToUpdate = async ({
  message,
  chat: { id: chatId },
}: SendToUpdateProps) => {
  if (!message || !chatId) return;

  const { casa } = tagsCasa[chatId];
  await updateTips({
    qual: casa,
    message,
  });
};

export const runBot = async () => {
  // const bot: BotInstance = new Telegraf(config.token);
  // const bot2: BotInstance = new Telegraf(config.token_m10);
  const botHomebroker: BotInstance = new Telegraf(
    config.token_homebroker,
  );
  botHomebroker.launch().catch(console.log);

  const botKauan = new Telegraf(config.token_kauan);

  botKauan.launch().catch(console.log);

  // bot.launch().catch(console.log);
  // bot2.launch().catch(console.log);

  // bot.on(message("text"), async ctx => {
  //   const chatId = ctx.chat?.id;
  //   const allowedChats = [
  //     Number(config.ESPANCABET_CHAT_ID),
  //     Number(config.DETONABET_CHAT_ID),
  //     Number(config.BETMASTERPRO_CHAT_ID),
  //     Number(config.ESPORTIVA_KADU_CHAT_ID),
  //     Number(config.BETGREEN_CHAT_ID),
  //   ];
  //   if (allowedChats.includes(chatId)) {
  //     const message = ctx.message?.text;
  //     const chatId = ctx.chat?.id;
  //     await sendToUpdate({
  //       message,
  //       chat: { id: chatId },
  //     }).catch(console.log);
  //   }
  // });
  // bot.on(message("photo"), async ctx => {
  //   const chatId = ctx.chat?.id;
  //   const allowedChats = [Number(config.DETONABET_CHAT_ID)];
  //   console.log(
  //     "[HANDLER PHOTO]",
  //     chatId,
  //     allowedChats.includes(chatId),
  //   );
  //   if (allowedChats.includes(chatId)) {
  //     const photo = ctx.message.photo;
  //     const legenda = ctx.message.caption;
  //     console.log(legenda);
  //     // Escolha a versão desejada da foto (normalmente a última, que tem a maior resolução)
  //     const photoFile = photo[photo.length - 1].file_id;
  //     // Obtenha informações sobre o arquivo de foto
  //     const fileDetails = await ctx.telegram.getFile(photoFile);
  //     console.log(fileDetails);
  //     // Construa o URL da foto
  //     const photoUrl = `https://api.telegram.org/file/bot${config.token}/${fileDetails.file_path}`;
  //     console.log(photoUrl);
  //     const casa = tagsCasa[chatId].casa;
  //     await sendToUpdateImage({ photoUrl, casa, legenda }).catch(
  //       console.log,
  //     );
  //   }
  // });
  // bot2.on(message("photo"), async ctx => {
  //   const chatId = ctx.chat?.id;
  //   if (chatId === Number(config.M10BET_CHAT_ID)) {
  //     const photo = ctx.message.photo;
  //     // Escolha a versão desejada da foto (normalmente a última, que tem a maior resolução)
  //     const photoFile = photo[photo.length - 1].file_id;
  //     // Obtenha informações sobre o arquivo de foto
  //     const fileDetails = await ctx.telegram.getFile(photoFile);
  //     console.log(fileDetails);
  //     // Construa o URL da foto
  //     const photoUrl = `https://api.telegram.org/file/bot${config.token_m10}/${fileDetails.file_path}`;
  //     console.log(photoUrl);
  //     await sendToUpdateImage({ photoUrl, casa: "M10" }).catch(
  //       console.log,
  //     );
  //   }
  // });
  // bot2.on(message("text"), async ctx => {
  //   const message = ctx.message?.text;
  //   const chatId = ctx.chat?.id;
  //   if (chatId === Number(config.M10BET_CHAT_ID)) {
  //     await sendToUpdate({
  //       message,
  //       chat: { id: chatId },
  //     }).catch(console.log);
  //   }
  // });
  return { botHomebroker, botKauan };
};

const sendToUpdateImage = async ({
  photoUrl,
  casa,
  legenda,
}: {
  photoUrl: string;
  casa: Casas;
  legenda?: string;
}) => {
  const { data } = await axios.put(
    casasInfos[casa].baseURL + "/futebol/tips",
    {
      image: photoUrl,
      legenda,
    },
  );
  console.log(data);
};
