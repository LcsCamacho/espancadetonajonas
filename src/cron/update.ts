import axios from "axios";
import { casasInfos, CasasInfosKeys } from "../config";

interface UpdateTipsProps {
  qual: Casas;
  message: string;
}
export const updateTips = async ({
  qual,
  message,
}: UpdateTipsProps) => {
  const baseURL = casasInfos[qual as CasasInfosKeys].baseURL;

  const { data } = await axios.put(baseURL + "/futebol/tips", {
    content: message,
  });
  console.log(data);
};
