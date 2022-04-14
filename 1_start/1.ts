import colors from "colors";
import invoices from "./invoices.json";
import plays from "./plays.json";
import { Invoice, Performances, Play, PlayList } from "./type";

// 테스트 코드
const input = JSON.stringify(statement(invoices[0], plays));
const output = JSON.stringify(
  "청구 내역 (고객명: BigCo) \nHamlet: $650.00 (55석) \nAs You Like It: $580.00 (35석) \nOthello: $500.00 (40석) \n총액: $1,730.00 \n적립 포인트: 47점 \n"
);

console.log(colors.bgRed(input === output ? "Pass" : "Fail"));

function statement(invoice: Invoice, plays: PlayList) {
  let totalAmount = 0;
  let volumCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer}) \n`;
  const format = new Intl.NumberFormat("es-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playId];
    let thisAmount = amountFor(play, perf);

    // 포인트를 적립한다.
    volumCredits += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명 마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volumCredits += Math.floor(perf.audience / 5);

    // 청구내역을 출력한다.
    result += `${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석) \n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount / 100)} \n`;
  result += `적립 포인트: ${volumCredits}점 \n`;

  return result;
}

// 함수추출하기 - thisAmount, play, perf 의존 변수를 인자로 받거나 맥락상으로 안으로 위치 시킴
function amountFor(play: Play, perf: Performances) {
  let thisAmount = 0;

  switch (play.type) {
    case "tragedy": // 비극
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;

    case "comedy": // 희극
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;

    default:
      throw new Error(`알 수 없는 장르 :${play.type}`);
  }

  return thisAmount;
}
