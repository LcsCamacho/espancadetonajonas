export function horaParaDate(horaString: string) {
  // Separa a hora e os minutos da string
  if (!horaString) return new Date();
  const [horas, minutos] = horaString.split(":").map(Number);

  // Cria um novo objeto Date para o dia atual
  const hoje = new Date();

  // Define as horas e minutos no objeto Date
  hoje.setHours(horas);
  hoje.setMinutes(minutos);
  hoje.setSeconds(0); // Opcional: Zera os segundos

  return hoje;
}
