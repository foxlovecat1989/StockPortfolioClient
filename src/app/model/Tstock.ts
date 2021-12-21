import { Classify } from "./classify";


export class Tstock{
  id!: number;
  symbol!: string;
  name!: string;
  previousClosed!: number;
  price!: number;
  changePrice!: number;
  changeInPercent!: number;
  volume!: number;
  lastUpDateTime!: string;
  classify!: Classify;

  static fromHttp(data: Tstock): Tstock {
    const stock = new Tstock();
    stock.id = data.id;
    stock.name = data.name;
    stock.classify = Classify.fromHttp(data.classify);
    stock.symbol = data.symbol;
    stock.changeInPercent = data.changeInPercent;
    stock.changePrice = data.changePrice;
    stock.previousClosed = data.previousClosed;
    stock.price = data.price;
    stock.volume = data.volume;
    stock.lastUpDateTime = data.lastUpDateTime;

    return stock;
  }
}
