import type {Prices} from './model';
export function platformSubscriptionSplit(grossUSD:number, prices:Prices){const platform=Math.round(grossUSD*prices.share)/100;return {platform,developer:Number((grossUSD-platform).toFixed(2))}}
export function estimatedPrivyCost(monthlyUsers:number,signatures:number){if(monthlyUsers>10000||signatures>50000)return 2000+Math.max(0,monthlyUsers-10000)*.05+Math.max(0,signatures-50000)*.01;if(monthlyUsers>=2500)return 499;if(monthlyUsers>=500)return 299;return 0;}
