import colors from "colors";
import invoices from "./invoices.json";
import plays from "./plays.json";
import { Invoice, Performances, Play, PlayList } from "./type";

// 테스트 코드
const input = JSON.stringify(statement(invoices[0] as Invoice, plays));
const output = JSON.stringify(
  "청구 내역 (고객명: BigCo) \nHamlet: $650.00 (55석) \nAs You Like It: $580.00 (35석) \nOthello: $500.00 (40석) \n총액: $1,730.00 \n적립 포인트: 47점 \n"
);

console.log(colors.bgRed(input === output ? "Pass" : "Fail"));

function statement(invoice: Invoice, plays: PlayList) {
  let totalAmount = 0;
  let volumCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer}) \n`;

  for (let perf of invoice.performances) {
    // 포인트를 적립한다
    volumCredits += volumeCreditsFor(perf);
    // 청구내역을 출력한다.
    result += `${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${
      perf.audience
    }석) \n`;
    totalAmount += amountFor(perf);
  }

  result += `총액: ${usd(totalAmount / 100)} \n`;
  result += `적립 포인트: ${volumCredits}점 \n`;

  return result;
}

// 함수추출하기 - thisAmount, play, perf 의존 변수를 인자로 받거나 맥락상으로 안으로 위치 시킴
function amountFor(aPerformance: Performances) {
  let result = 0;

  switch (playFor(aPerformance).type) {
    case "tragedy": // 비극
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;

    case "comedy": // 희극
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;

    default:
      throw new Error(`알 수 없는 장르 :${playFor(aPerformance).type}`);
  }

  return result;
}

// 변수를 리턴하는 질의 함수
function playFor(aPerformance: Performances) {
  return plays[aPerformance.playId];
}

//
function volumeCreditsFor(perf: Performances) {
  let result = 0;
  result += Math.max(perf.audience - 30, 0);
  if ("comedy" === playFor(perf).type) result += Math.floor(perf.audience / 5);
  return result;
}

function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber);
}
