import axios from "axios";
import { validate, schedule } from "node-cron";
import cronstrue from "cronstrue/i18n";
import "cronstrue/locales/pt_BR";

export const updateSinalAcadaMinuto = async () => {
  console.log("Atualizando sinal a cada minuto TASK");

  const expression = "55 */1 * * * *";

  console.log(
    cronstrue.toString(expression, { locale: "pt_BR" }),
  );

  if (!validate(expression)) {
    console.error("Invalid cron expression");
  }

  schedule(
    expression,
    async () => {
      console.log(
        "Atualizando sinal",
        new Date().toLocaleTimeString(),
      );
      return;

      const response = await axios.put(
        "https://operacoes-homebroker.vercel.app/api/sinal/",
      );

      // console.log(response.data);

      console.log("Sinal atualizado");
    },
    {
      scheduled: true,
      timezone: "America/Sao_Paulo",
    },
  );
};
