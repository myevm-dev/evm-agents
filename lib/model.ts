export const chains = [
 {id:1,name:'Ethereum',symbol:'ETH'}, {id:8453,name:'Base',symbol:'ETH'},
 {id:42161,name:'Arbitrum',symbol:'ETH'}, {id:10,name:'Optimism',symbol:'ETH'},
 {id:137,name:'Polygon PoS',symbol:'POL'}, {id:43114,name:'Avalanche',symbol:'AVAX'},
 {id:130,name:'Unichain',symbol:'ETH'}, {id:5042,name:'Arc',symbol:'USDC'}
] as const;
export type Status='Running'|'Paused'|'Needs Deposit'|'Locked'|'Idle';
export type Strategy={id:string;name:string;category:string;developer:string;description:string;fee:number;chainId:number;walletId:string;status:Status;subscribed:boolean;rating:number;ratings:number;phase:string;balance:number;pnl:number;spent:number;signatures:number;nextRun:string;};
export type Wallet={id:string;name:string;address:string;server:boolean;chainId:number;balance:number};
export type Entry={id:string;time:string;kind:string;message:string;strategyId?:string};
export type Prices={account:number;wallet:number;publish:number;signature:number;share:number};
export type Flags={privy:boolean;gateway:boolean;arcLedger:boolean;agentRunner:boolean;realPayments:boolean};
export type State={theme:'dark'|'light';tab:'strategies'|'marketplace'|'wallets'|'billing'|'publish'|'settings';selected:string;activeWallet:string;wallets:Wallet[];strategies:Strategy[];entries:Entry[];purchased:string[];ratings:Record<string,number>;credits:number;prices:Prices;flags:Flags;tenant:string;};
export const catalog=[
 {id:'eth-dca',name:'ETH DCA Bot',category:'DCA',developer:'DeFi Agents',description:'Accumulate ETH on a fixed schedule with spending caps and optional approvals.',fee:5,chainId:8453,rating:4.8,ratings:126},
 {id:'stable-yield',name:'Stable Yield',category:'Yield',developer:'Vault Research',description:'Monitor USDC yield opportunities and propose allocation changes.',fee:12,chainId:8453,rating:4.6,ratings:82},
 {id:'arb-scanner',name:'Arb Scanner',category:'Monitoring',developer:'Quant Studio',description:'Observe price differences and simulate opportunities. Execution requires live adapter.',fee:19,chainId:42161,rating:4.4,ratings:47},
 {id:'treasury',name:'Treasury Manager',category:'Treasury',developer:'Strategy Labs',description:'Track treasury concentration, cash buffers and rebalance proposals.',fee:9,chainId:5042,rating:4.9,ratings:39},
 {id:'rebalancer',name:'Portfolio Rebalancer',category:'Portfolio',developer:'Quant Studio',description:'Target token allocations with scheduled checks and enforced limits.',fee:8,chainId:10,rating:4.5,ratings:65},
 {id:'signals',name:'Signal Watcher',category:'Signals',developer:'DataForge',description:'Signal monitoring and notification strategy.',fee:0,chainId:137,rating:4.3,ratings:21}
];
export const defaults:State={theme:'dark',tab:'strategies',selected:'s1',activeWallet:'w1',tenant:'Demo Workspace',wallets:[{id:'w1',name:'Main Wallet',address:'0x3a7C...9F2D',server:false,chainId:8453,balance:12432.18},{id:'w2',name:'Savings Wallet',address:'0x91Bb...3A80',server:true,chainId:8453,balance:6014.55},{id:'w3',name:'Trading Wallet',address:'0x5b30...FB00',server:true,chainId:42161,balance:0}],strategies:[{id:'s1',...catalog[0],walletId:'w1',status:'Running',subscribed:true,phase:'Accumulating',balance:12432.18,pnl:1842.59,spent:42.18,signatures:48,nextRun:'2h 14m'},{id:'s2',...catalog[1],walletId:'w2',status:'Paused',subscribed:true,phase:'Paused',balance:6014.55,pnl:244.18,spent:18.2,signatures:24,nextRun:'Paused'},{id:'s3',...catalog[2],walletId:'w3',status:'Needs Deposit',subscribed:true,phase:'Awaiting funds',balance:0,pnl:0,spent:0,signatures:0,nextRun:'Not scheduled'},{id:'s4',...catalog[3],walletId:'w1',status:'Locked',subscribed:false,phase:'Subscription required',balance:0,pnl:0,spent:0,signatures:0,nextRun:'Not scheduled'}],entries:[{id:'e1',time:'12:14 PM',kind:'trade',message:'Bought 0.12 ETH at $3,432.11',strategyId:'s1'},{id:'e2',time:'10:03 AM',kind:'info',message:'Skipped trade due to risk limits',strategyId:'s1'},{id:'e3',time:'Yesterday',kind:'trade',message:'Rebalance completed',strategyId:'s1'},{id:'e4',time:'Yesterday',kind:'info',message:'Awaiting approval for large deposit',strategyId:'s1'}],purchased:['eth-dca','stable-yield','arb-scanner'],ratings:{},credits:48.25,prices:{account:1,wallet:3,publish:1,signature:0.011,share:20},flags:{privy:false,gateway:false,arcLedger:false,agentRunner:false,realPayments:false}};
export const money=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
