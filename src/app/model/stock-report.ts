export class StockReport{
  symbol!: string;
  date!: Date;
  open!: number;
  low!: number;
  high!: number;;
  close!: number;
  adjClose!: number;
  volume!: number;

  static fromHttp(stockReport: StockReport): StockReport{
    const newOne = new StockReport();
    newOne.symbol = stockReport.symbol;
    newOne.date = stockReport.date;
    newOne.open = stockReport.open;
    newOne.low = stockReport.low;
    newOne.high = stockReport.high;
    newOne.close = stockReport.close;
    newOne.adjClose = stockReport.adjClose;
    newOne.volume = stockReport.volume;

    return newOne;
  }
}

