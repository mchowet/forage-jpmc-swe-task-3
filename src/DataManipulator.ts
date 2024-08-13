import { ServerRespond } from './DataStreamer';

export interface Row {
    price_abc: number,
    price_def: number,
    price_ratio: number,
    timestamp: Date,
    upper_bound: number,
    lower_bound: number,
    trigger_alert: number | undefined,
}

export class DataManipulator {

  static generateRow(serverResponds: ServerRespond[]) {

    const prices = serverResponds.map(datapoint => (datapoint.top_ask.price + datapoint.top_bid.price) / 2);
    const price_ratio = prices[1]? prices[0] / prices[1] : 0.00;
    const threshold = 0.05;
    const upper_bound = 1 + threshold;
    const lower_bound = 1 - threshold;
    const latest_timestamp = serverResponds[0].timestamp > serverResponds[1].timestamp?
                        serverResponds[0].timestamp :
                        serverResponds[1].timestamp;
    const trigger_alert = (price_ratio > upper_bound || price_ratio < lower_bound)? price_ratio : undefined;

    return {
        //price_abc: prices[0],
        //price_abc: prices[1],
        price_ratio,
        timestamp: latest_timestamp,
        upper_bound,
        lower_bound,
        trigger_alert,
    };
  }
}
