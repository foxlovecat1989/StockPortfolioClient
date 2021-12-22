import { Tstock } from "./Tstock";
import { User } from "./user";

export class Watchlist{
  id!: number;
  name!: string;
  lastUpdateAt!: string;
  user!: User;
  tstocks!: Array<Tstock>;

  static fromHttp(watchlist: Watchlist): Watchlist{
    const newOne = new Watchlist();
    newOne.id = watchlist.id;
    newOne.name = watchlist.name;
    newOne.lastUpdateAt = watchlist.lastUpdateAt;
    newOne.user = User.fromHttp(watchlist.user);
    const stocks = new Array<Tstock>();
    watchlist.tstocks.forEach(stock => stocks.push(Tstock.fromHttp(stock)))
    newOne.tstocks = stocks;

    return newOne;
  }
}
