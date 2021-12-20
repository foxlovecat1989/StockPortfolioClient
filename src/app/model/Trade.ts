import { TradeType } from "../enum/TradeType.enum";
import { Stock } from "./Stock";

export class Trade {
  tradeId!: number;
  tstock!: Stock;
  amount!: number;
  price!: number;
  tradeDate!: string;
  tradeTime!: string;
  tradeType!: TradeType

  getTradeDateAsDate() {
    return new Date(this.tradeDate);
  }

  static fromHttp(trade: Trade): Trade {
    const newTrade = new Trade();
    newTrade.tradeId = trade.tradeId;
    newTrade.tstock = Stock.fromHttp(trade.tstock);
    newTrade.amount = trade.amount;
    newTrade.price = trade.price;
    newTrade.tradeDate = trade.tradeDate;
    newTrade.tradeTime = trade.tradeTime;
    newTrade.tradeType = trade.tradeType;

    return newTrade;
  }
}
