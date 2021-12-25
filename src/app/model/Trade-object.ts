import { TradeType } from "../enum/TradeType.enum";
import { Tstock } from "./tstock";
import { User } from "./user";

export class TradeObject{
  tstock!: Tstock;
  user!: User;
  amount!: number;
  tradeType!: TradeType;

  static fromHttp(tradeObject: TradeObject){
    const newTradeObject = new TradeObject();
    newTradeObject.tstock = Tstock.fromHttp(tradeObject.tstock);
    newTradeObject.user = User.fromHttp(tradeObject.user);
    newTradeObject.amount = tradeObject.amount;


  }
}
