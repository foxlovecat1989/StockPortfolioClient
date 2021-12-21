import { TradeType } from "../enum/TradeType.enum";
import { Tstock } from "./Tstock";
import { User } from "./User";

export class TradeObject{
  tstock!: Tstock;
  userId!: number;
  amount!: number;
  tradeType!: TradeType;

  static fromHttp(tradeObject: TradeObject){
    const newTradeObject = new TradeObject();
    newTradeObject.tstock = Tstock.fromHttp(tradeObject.tstock);
    newTradeObject.userId = tradeObject.userId;
    newTradeObject.amount = tradeObject.amount;


  }
}
