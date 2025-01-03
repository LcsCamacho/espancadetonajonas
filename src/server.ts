import { BotInstance, runBot } from "./bot";
import { config } from "./config";
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

    //@ts-ignore
    console.log(post.text);

    if (
      chatId.toString() ===
        config.HOMEBROKEROPENMARKET_CHAT_ID ||
      chatId.toString() === config.HOMEBROKEROTC_CHAT_ID
    ) {
      const isOpenMarket =
        chatId.toString() ===
        config.HOMEBROKEROPENMARKET_CHAT_ID;
      //@ts-ignore
      const infos = getParEntradaCompraVenda(post.text);

      if (!infos) return;

      const { moeda: par, expiracao, entrada, acao } = infos;

      console.log(par, expiracao, entrada, acao);

      if (!par || !expiracao || !entrada || !acao)
        return console.log("Erro ao pegar as informações");

      const currentDocName = isOpenMarket
        ? "aovivoforex"
        : "aovivo";
      const currentDocNameTeste = isOpenMarket
        ? "aovivotesteforex"
        : "aovivoteste";

      console.log(
        "SINAL AGORA:",
        new Date().toLocaleTimeString(),
      );

      await db.collection("sinais").doc(currentDocName).set({
        paridade: par,
        expiracao,
        horario: entrada,
        direcao: acao,
        expired: false,
        updatedAt: new Date(),
        createdAt: new Date(),
        id: "1",
      });

      await db
        .collection("sinais")
        .doc(currentDocNameTeste)
        .set({
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

      if (expiracao === "M3") {
        dataExpiracao?.setMinutes(
          dataExpiracao.getMinutes() + 3,
        );
      }

      if (expiracao === "M5") {
        dataExpiracao?.setMinutes(
          dataExpiracao.getMinutes() + 5,
        );
      }

      const tempoParaExpirarEntrada =
        dataExpiracao?.getTime()! - new Date().getTime();
      console.log(
        "TEMPO PARA EXPIRAR ENTRADA:",
        tempoParaExpirarEntrada / 1000 / 60,
      );

      setTimeout(async () => {
        console.log(
          "Entrada expirada:",
          new Date().toLocaleTimeString(),
        );
        await db.collection("sinais").doc(currentDocName).set({
          horario: "",
          paridade: "",
          expiracao: "",
          direcao: "",
          expired: true,
        });
      }, tempoParaExpirarEntrada);
    }
    if (chatId.toString() === config.AVALONOTC_CHAT_ID) {
      const post = ctx.channelPost as { text: string };
      //@ts-ignore
      const infos = getParEntradaCompraVendaAvalonChannel(
        post.text,
      );
      console.log({ infos });
      if (!infos) {
        console.log("Erro ao pegar as informações");
        return;
      }
      const { par, expiracao, entrada, acao } = infos;
      console.log(par, expiracao, entrada, acao);
      if (!par || !expiracao || !entrada || !acao)
        return console.log("Erro ao pegar as informações");
      const currentDocName = "aovivo";
      const currentCollectionName = "sinais-avalon";
      const data = {
        paridade: par,
        expiracao,
        horario: entrada,
        direcao: acao,
        expired: false,
        updatedAt: new Date(),
        createdAt: new Date(),
        id: "1",
      };
      await db
        .collection(currentCollectionName)
        .doc(currentDocName)
        .set(data);
      console.log("ENTRADA ENVIA PARA O FIREBASE", data);
      const dataExpiracao = horaParaDate(entrada);
      dataExpiracao?.setMinutes(dataExpiracao.getMinutes() + 2);
      if (expiracao === "M3") {
        dataExpiracao?.setMinutes(
          dataExpiracao.getMinutes() + 3,
        );
      }
      if (expiracao === "M5") {
        dataExpiracao?.setMinutes(
          dataExpiracao.getMinutes() + 5,
        );
      }
      const tempoParaExpirarEntrada =
        dataExpiracao?.getTime()! - new Date().getTime();
      console.log(
        "TEM PO PARA EXPIRAR ENTRADA:",
        tempoParaExpirarEntrada / 1000 / 60,
        dataExpiracao,
      );
      setTimeout(async () => {
        console.log("Entrada expirada");
        await db
          .collection(currentCollectionName)
          .doc(currentDocName)
          .set({
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
    post.includes("EMPATE") ||
    post.includes("corretora")
  ) {
    return null;
  }

  //   ⚡️ Oportunidade Relâmpago JT ⚡️

  // 💰 Moeda = USD-BRL (OTC)
  // ⏰ Expiração = 1 Minuto
  // 📌  Entrada = 10:22
  // 🟢  Compra

  const regexExpiracao =
    /Expiração = (\d+) (Minutos|minutos|minuto|Minuto)/i;
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
function getParEntradaCompraVendaAvalonChannel(post: string) {
  console.log("\n\nAVALON\n");
  if (!post) return null;
  if (
    post.includes("GREEN") ||
    post.includes("RED") ||
    post.includes("EMPATE") ||
    post.includes("INICIAR") ||
    post.includes("Green") ||
    post.includes("Red")
  ) {
    return null;
  }

  console.log("\n\nPOST\n");
  console.log(post);

  const exemploMessage = `⚡️ Oportunidade Relâmpago JT ⚡️
 
  💰 Moeda = Amazon (OTC)
  ⏰ Expiração = 1 Minuto 
  📌  Entrada = 11:51
  🔻  Venda
   
  🔗 Abrir Plataforma 🔗 (https://www.homebroker.com/?ref=SuOj035R)
  `;

  if (post.includes("Última vela")) {
    const expiracao = post
      .split("Expiração = ")[1]
      .split(" Minuto")[0];
    const acao = post.toLocaleLowerCase().includes("Venda")
      ? "VENDA"
      : "COMPRA";

    let matchMoeda = post
      .split("🪙 Moeda: ")[1]
      .split("\n")[0]
      .trim();

    matchMoeda = matchMoeda.replace("(OTC)", "");

    // Extrair os valores
    const moeda = matchMoeda
      ? Paridade[matchMoeda as keyof typeof Paridade]
      : null;

    console.log({
      matchMoeda,
      expiracao,
      moeda,
    });
    const date = new Date();
    date.setSeconds(0, 0);
    date.setMinutes(date.getMinutes() + 2);
    const entrada = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      par: moeda as string,
      expiracao: Expiracao[expiracao as keyof typeof Expiracao],
      entrada,
      acao,
    };
  }
  if (post.includes("Timefrime")) {
    const regexExpiracao = /Timefrime: (\d+)/i;
    const acao = post.toLocaleLowerCase().includes("Venda")
      ? "VENDA"
      : "COMPRA";

    let matchMoeda = post.split("🪙 Moeda: ")[1].split("\n")[0];

    matchMoeda = matchMoeda
      .replace("OTC", "(OTC)")
      .replace("-", " ");
    const matchExpiracao = post.match(regexExpiracao);

    // Extrair os valores
    const moeda = matchMoeda
      ? Paridade[
          matchMoeda.toLocaleUpperCase() as keyof typeof Paridade
        ]
      : null;
    const expiracao = matchExpiracao
      ? Expiracao[matchExpiracao[1] as keyof typeof Expiracao]
      : null;

    console.log({
      matchMoeda,
      matchExpiracao,
      expiracao,
      moeda,
    });
    const date = new Date();
    date.setSeconds(0, 0);
    date.setMinutes(date.getMinutes() + 2);
    const entrada = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      par: moeda as string,
      expiracao: expiracao as string,
      entrada,
      acao,
    };
  }
  if (post.includes("Expiração")) {
    const acao = post?.toLocaleLowerCase().includes("Venda")
      ? "VENDA"
      : "COMPRA";

    let matchMoeda = post?.split("Moeda = ")[1].split("\n")[0];

    matchMoeda = matchMoeda
      .replace("(OTC)", "")
      .replace("-", " ")
      .trim();
    const matchExpiracao = post
      ?.split(" Expiração = ")[1]
      .split(" Minuto")[0];

    // Extrair os valores
    const moeda = matchMoeda
      ? Paridade[
          matchMoeda.toLocaleUpperCase() as keyof typeof Paridade
        ]
      : null;
    const expiracao = matchExpiracao
      ? Expiracao[matchExpiracao as keyof typeof Expiracao]
      : null;

    console.log({
      matchMoeda,
      matchExpiracao,
      expiracao,
      moeda,
    });
    const date = new Date();
    date.setSeconds(0, 0);
    date.setMinutes(date.getMinutes() + 2);
    const entrada = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      par: moeda as string,
      expiracao: expiracao as string,
      entrada,
      acao,
    };
  }
  return null;
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
  "GBP-USD": "GBPUSD",
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
  "Amazon (OTC)": "AMAZONOTC",
  "AMAZON (OTC)": "AMAZONOTC",
  "MCDONALDS (OTC)": "MCDONALDSOTC",
  "FACEBOOK (OTC)": "FACEBOOKOTC",
  "APPLE (OTC)": "APPLEOTC",
  "MCDONALD'S (OTC)": "MCDONALDSOTC",
  "GOOGLE (OTC)": "GOOGLEOTC",
  "Microsoft (OTC)": "MICROSOFTOTC",
  "MICROSOFT (OTC)": "MICROSOFTOTC",
  "USD-JPY (OTC)": "USDJPYOTC",
  "GBP-JPY (OTC)": "GBPJPYOTC",
  "SOLANA (OTC)": "SOLANAOTC",
  "USDT (OTC)": "USDTOTC",
  "XRP (OTC)": "XRPOTC",
  GOOGLE: "GOOGLE",
  "APPLE INC": "APPLE",
  XRP: "XRP",
  AMAZON: "AMAZON",
  "MCDONALD'S": "MCDONALDS",
  "MCDONALD'S CORPORATION": "MCDONALDS",
  SOLANA: "SOLANA",
  "FACEBOOK INC": "FACEBOOK",
  MICROSOFT: "MICROSOFT",
  DOGECOIN: "DOGECOIN",
  BITCOIN: "BITCOIN",
  ETHEREUM: "ETHEREUM",
  TESLA: "TESLA",
  NVIDIA: "NVIDIA",
  INTEL: "INTEL",
  "TESLA (OTC)": "TESLAOTC",
  "NVIDIA (OTC)": "NVIDIAOTC",
  "INTEL (OTC)": "INTELOTC",
  AUDCAD: "AUDCAD",
  AUDJPY: "AUDJPY",
  EURGBP: "EURGBP",
  EURUSD: "EURUSD",
  GBPUSD: "GBPUSD",
  USDBRL: "USDBRL",
  USDJPY: "USDJPY",
  GBPJPY: "GBPJPY",
  EURJPY: "EURJPY",
  AUDUSD: "AUDUSD",
  "AUD-USD": "AUDUSD",
  "USD-BRL": "USDBRL",
  "EUR-USD": "EURUSD",
  "EUR-JPY": "EURJPY",
  "EUR-GBP": "EURGBP",
  "USD-JPY": "USDJPY",
  "GBP-JPY": "GBPJPY",
  "AUD-CAD": "AUDCAD",
  "AUD-JPY": "AUDJPY",

  "AUDUSD (OTC)": "AUDUSDOTC",
  "AUDCHF (OTC)": "AUDCHFOTC",
  "AUDJPY (OTC)": "AUDJPYOTC",
  "EURGBP (OTC)": "EURGBPOTC",
  "EURUSD (OTC)": "EURUSDOTC",
  "GBPUSD (OTC)": "GBPUSDOTC",
  "GBPCHF (OTC)": "GBPCHFOTC",
  "USDJPY (OTC)": "USDJPYOTC",
  "GBPJPY (OTC)": "GBPJPYOTC",
  "EURJPY (OTC)": "EURJPYOTC",
  "AUDCAD (OTC)": "AUDCADOTC",
  "BTCUSD AV": "BITCOIN",
  "ETHUSD AV": "ETHEREUM",
  "GOOGLE AV": "GOOGLE",
  "EURJPY OTC": "EURJPYOTC",
  "GBPCHF OTC": "GBPCHFOTC",
  "AUDCHF OTC": "AUDCHFOTC",
  "EURCAD OTC": "EURCADOTC",
  "AUD JPY": "AUDJPY",
  "AUD USD": "AUDUSD",
  "AUD CAD":"AUDCAD",
  "USD BRL": "USDBRL",
  USDT: "USDT",
  FACEBOOK: "FACEBOOK",
};

const Direcao = {
  COMPRA: "COMPRA",
  VENDA: "VENDA",
};

const Expiracao = {
  "1": "M1",
  "3": "M3",
  "5": "M5",
  "15": "M15",
  "30": "M30",
  "1 Hora": "H1",
  "4 Horas": "H4",
  "1 Dia": "D1",
};
