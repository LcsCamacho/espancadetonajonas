export const nomes = [
  "Ana",
  "João",
  "Maria",
  "Pedro",
  "Laura",
  "Rafael",
  "Carolina",
  "Lucas",
  "Beatriz",
  "Gustavo",
  "Fernanda",
  "Ricardo",
  "Isabela",
  "Henrique",
  "Camila",
  "Marcelo",
  "Amanda",
  "Guilherme",
  "Natália",
  "Bruno",
  "Mariana",
  "Rodrigo",
  "Carla",
  "André",
  "Juliana",
  "Diego",
  "Sofia",
  "Thiago",
  "Letícia",
  "Alexandre",
];

export const sortRamdomName = () => {
  const ramdom = Math.floor(Math.random() * nomes.length);
  return nomes[ramdom];
};
