import axios from "axios";
import { BotInstance, runBot } from "./bot";
import { config } from "./config";
import { updateSinalAcadaMinuto } from "./cron/updateSinal";
import { Filter, message } from "telegraf/filters";
import { db } from "./firebase";
import { horaParaDate } from "./utils/horasParaDate";
(async () => {
  // updateSinalAcadaMinuto().catch(console.log);
  runBot().then(({ botHomebroker }) => {
    console.log("Bot Homebroker rodando");
    initHandlerMessagesHomebroker(botHomebroker);
  });
})();

async function initHandlerMessagesHomebroker(bot: BotInstance) {
  console.log("initHandlerMessagesHomebroker");
  bot.use(async (ctx, next) => {
    console.time(
      `Processing update Homebroker ${ctx.update.update_id}`,
    );
    await next(); // runs next middleware
    // runs after next middleware finishes
    console.timeEnd(
      `Processing update Homebroker ${ctx.update.update_id}`,
    );
  });

  bot.on("channel_post", async ctx => {
    const chatId = ctx.chat?.id;

    const post = ctx.channelPost;

    console.log(post);

    if (
      chatId.toString() === config.HOMEBROKER_CHAT_ID ||
      chatId.toString() === config.HOMEBROKER_CHAT_ID2
    ) {
      //@ts-ignore
      const infos = getParEntradaCompraVenda(post.text);

      if (!infos) return;

      const { moeda: par, expiracao, entrada, acao } = infos;

      console.log(par, expiracao, entrada, acao);

      if (!par || !expiracao || !entrada || !acao)
        return console.log("Erro ao pegar as informações");

      await db.collection("sinais").doc("aovivo").set({
        paridade: par,
        expiracao,
        horario: entrada,
        direcao: acao,
        expired: false,
        updatedAt: new Date(),
        createdAt: new Date(),
        id: "1",
      });

      await db.collection("sinais").doc("aovivoteste").set({
        paridade: par,
        expiracao,
        horario: entrada,
        direcao: acao,
        expired: false,
        updatedAt: new Date(),
        createdAt: new Date(),
        id: "1",
      });

      const dataExpiracao = horaParaDate(entrada);
      dataExpiracao?.setMinutes(dataExpiracao.getMinutes() + 2);

      const tempoParaExpirarEntrada =
        dataExpiracao?.getTime()! - new Date().getTime();
      console.log(
        "TEMPO PARA EXPIRAR ENTRADA:",
        tempoParaExpirarEntrada / 1000 / 60,
      );

      setTimeout(async () => {
        console.log("Entrada expirada");
        await db.collection("sinais").doc("aovivo").set({
          horario: "",
          paridade: "",
          expiracao: "",
          direcao: "",
          expired: true,
        });
      }, tempoParaExpirarEntrada);
    }
  });
}

//Função para pgar o Par, expiração, o ohorairo da entrada e compra ou venda
// text: 'Entrada Confirmada\n' +
// '\n' +
// '📊 Par = Ethereum (OTC)\n' +
// '⏰ Expiração = 1 Minuto \n' +
// '\n' +
// '💻 Entrada às 15:02\n' +
// '🟩 Compra\n' +
// '\n' +
// '✋🏻 Em caso de LOSS\n' +
// 'Fazer 1º Proteção às 15:03\n' +
// 'Fazer 2º Proteção às 15:04\n' +
// '\n' +
// '👨🏻‍💻 Clique aqui para abrir a corretora',

function getParEntradaCompraVenda(post: string) {
  if (!post) return null;
  if (
    post.includes("GREEN") ||
    post.includes("RED") ||
    post.includes("EMPATE")
  ) {
    return null;
  }

  const regexExpiracao = /Expiração = (\d+) (Minutos|minutos)/i;
  const regexEntrada = /Entrada = (\d{2}:\d{2})/i;

  // Encontrar as correspondências
  const matchMoeda = post.split("💰 Moeda = ")[1].split("\n")[0];
  const matchExpiracao = post.match(regexExpiracao);
  const matchEntrada = post.match(regexEntrada);

  console.log({
    matchMoeda,
    matchExpiracao,
    matchEntrada,
  });

  // Extrair os valores
  const moeda = matchMoeda
    ? Paridade[
        matchMoeda.toLocaleUpperCase() as keyof typeof Paridade
      ]
    : null;
  const expiracao = matchExpiracao
    ? Expiracao[matchExpiracao[1] as keyof typeof Expiracao]
    : null;
  const entrada = matchEntrada ? matchEntrada[1] : null;

  return {
    moeda: moeda as string,
    expiracao: expiracao as string,
    entrada: entrada as string,
    acao: post.includes("Compra")
      ? Direcao.COMPRA
      : Direcao.VENDA,
  };
}
// enum Paridade {
//   XRPOTC
//   BITCOINOTC
//   DOGECOINOTC
//   ETHEREUMOTC
//   SOLANAOTC
//   USDTOTC
//   AUDCADOTC
//   AUDJPYOTC
//   EURGBPOTC
//   EURUSDOTC
//   GBPUSDOTC
//   USDBRLOTC
//   MCDONALDSOTC
//   FACEBOOKOTC
//   APPLEOTC
//   MICROSOFTOTC
//   GOOGLEOTC
//   USDJPYOTC
//   GBPJPYOTC
//   EURJPYOTC
// }

const Paridade = {
  "USD-BRL (OTC)": "USDBRLOTC",
  "EUR-USD (OTC)": "EURUSDOTC",
  "EUR-JPY (OTC)": "EURJPYOTC",
  "EUR-GBP (OTC)": "EURGBPOTC",
  "GBP-USD (OTC)": "GBPUSDOTC",
  "AUD-CAD (OTC)": "AUDCADOTC",
  "AUD-JPY (OTC)": "AUDJPYOTC",
  "ETHEREUM (OTC)": "ETHEREUMOTC",
  "BITCOIN (OTC)": "BITCOINOTC",
  "DOGECOIN (OTC)": "DOGECOINOTC",
  "MCDONALDS (OTC)": "MCDONALDSOTC",
  "FACEBOOK (OTC)": "FACEBOOKOTC",
  "APPLE (OTC)": "APPLEOTC",
  "MCDONALD'S (OTC)": "MCDONALDSOTC",
  "GOOGLE (OTC)": "GOOGLEOTC",
  "Microsoft (OTC)": "MICROSOFTOTC",
  "USD-JPY (OTC)": "USDJPYOTC",
  "GBP-JPY (OTC)": "GBPJPYOTC",
  "SOLANA (OTC)": "SOLANAOTC",
  "USDT (OTC)": "USDTOTC",
  "XRP (OTC)": "XRPOTC",
  GOOGLE: "GOOGLE",
  "APPLE INC": "APPLE",
  XRP: "XRP",
  AMAZON: "AMAZON",
  "MCDONALD'S CORPORATION": "MCDONALDS",
  SOLANA: "SOLANA",
  "FACEBOOK INC": "FACEBOOK",
  MICROSOFT: "MICROSOFT",
  DOGECOIN: "DOGECOIN",
  BITCOIN: "BITCOIN",
  ETHEREUM: "ETHEREUM",
};

const Direcao = {
  COMPRA: "COMPRA",
  VENDA: "VENDA",
};

const Expiracao = {
  "1": "M1",
  "5": "M5",
  "15": "M15",
  "30": "M30",
  "1 Hora": "H1",
  "4 Horas": "H4",
  "1 Dia": "D1",
};
