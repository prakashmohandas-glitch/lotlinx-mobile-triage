/* ============================================================
   Lotlinx Mobile — Inventory Triage · data layer
   Health system: Green / Yellow / Red / Black (VIN performance)

   These figures are realistic placeholders. In production, wire
   KPIS / INVENTORY / VEHICLES to the live inventory + media APIs.
   ============================================================ */

/* Unsplash placeholder helper — replace with real VIN photography. */
const PH = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=78&auto=format&fit=crop`;

/* Traffic-light health palette (VIN performance, not brand red). */
const HEALTH = {
  green:  { key:'green',  label:'Green',  color:'#1BA45A', soft:'#E7F6EE', ink:'#0C6B3A' },
  yellow: { key:'yellow', label:'Yellow', color:'#E8A50C', soft:'#FBF1DA', ink:'#8A6206' },
  red:    { key:'red',    label:'Red',    color:'#E23744', soft:'#FBE7E9', ink:'#9B1F29' },
  black:  { key:'black',  label:'Black',  color:'#1A1A1A', soft:'#E9E9EA', ink:'#1A1A1A' },
};

/* Brand action red — deliberately distinct from health "red". */
const BRAND = '#ED1C2E';

/* The four task actions a user can take on a vehicle. */
const ACTIONS = {
  assign: { key:'assign', label:'Assign',           hint:'to a teammate' },
  pm:     { key:'pm',     label:'Request PM help',   hint:'Lotlinx strategist' },
  merch:  { key:'merch',  label:'Fix merchandising', hint:'photos · description' },
  price:  { key:'price',  label:'Review price',      hint:'vs. market' },
};
const ACTION_ORDER = ['assign','pm','merch','price'];

/* Top-of-app KPIs — period: last 7 days vs. prior 7. */
const KPIS = {
  hero: {
    label:'Shoppers Delivered', value:'48.2K', raw:'48,210',
    delta:'+8.4%', dir:'up', note:'vs. prior 7 days',
  },
  row: [
    { label:'Net New Shoppers',    value:'62%', delta:'+5 pts', dir:'up' },
    { label:'Sales Opportunities', value:'327', delta:'+12',    dir:'up' },
    { label:'Sales',               value:'41',  delta:'−3',     dir:'down' },
  ],
};

/* Inventory movement, last 7 days. */
const INVENTORY = {
  attention: {
    title:'Needs attention', tone:'down',
    rows:[
      { from:'green',  to:'yellow', count:12 },
      { from:'yellow', to:'red',    count:5  },
    ],
  },
  control: {
    title:'In control', tone:'up',
    rows:[
      { from:'yellow', to:'green',  count:9 },
      { from:'red',    to:'yellow', count:6 },
      { from:'black',  to:'green',  count:3 },
    ],
  },
};

/* The swipe stack — vehicles that need a decision today. */
const VEHICLES = [
  {
    id:'v1', year:2024, make:'Ford', model:'F-150', trim:'XLT SuperCrew',
    stock:'F4187', price:'$52,940', miles:'12 mi',
    photo:PH('1551830820-330a71b99659'), health:'red',
    days:67, vdps:1840, opps:1, sale:'No sale',
    primary:'High shopper interest, stalling out',
    rec:'Demand is strong but stale — refresh price against market before spending more media.',
    action:'price',
  },
  {
    id:'v2', year:2023, make:'Honda', model:'CR-V', trim:'EX-L AWD',
    stock:'H2231', price:'$33,480', miles:'9,210 mi',
    photo:PH('1519641471654-76ce0107ad1b'), health:'yellow',
    days:43, vdps:661, opps:3, sale:'No sale',
    primary:'Getting attention, not converting',
    rec:'Review open opps and sales follow-up before adding media.',
    action:'assign',
  },
  {
    id:'v3', year:2024, make:'Tesla', model:'Model 3', trim:'Long Range',
    stock:'T0094', price:'$41,200', miles:'1,120 mi',
    photo:PH('1606016159991-dfe4f2746ad5'), health:'yellow',
    days:29, vdps:402, opps:0, sale:'No sale',
    primary:'Soft traffic for a hot segment',
    rec:'Under-exposed vs. demand — move into an active campaign to lift VDPs.',
    action:'pm',
  },
  {
    id:'v4', year:2023, make:'Ford', model:'Expedition', trim:'Limited 4x4',
    stock:'F3902', price:'$61,750', miles:'18,430 mi',
    photo:PH('1533473359331-0135ef1b58bf'), health:'red',
    days:88, vdps:240, opps:0, sale:'No sale',
    primary:'Aging with thin demand',
    rec:'Low interest and aging fast — only 4 photos live. Fix merchandising first.',
    action:'merch',
  },
  {
    id:'v5', year:2022, make:'Audi', model:'A4', trim:'Premium 45 TFSI',
    stock:'A1180', price:'$31,990', miles:'24,800 mi',
    photo:PH('1597007030739-6d2e7172ee5b'), health:'green',
    days:14, vdps:520, opps:4, sale:'No sale',
    primary:'Healthy — converting on its own',
    rec:'Performing well. Keep as-is — no spend change needed.',
    action:'assign',
  },
  {
    id:'v6', year:2021, make:'Chevrolet', model:'Camaro', trim:'2LT Coupe',
    stock:'C7745', price:'$28,650', miles:'31,005 mi',
    photo:PH('1552519507-da3b142c6e3d'), health:'yellow',
    days:51, vdps:300, opps:2, sale:'No sale',
    primary:'Interest fading after launch',
    rec:'Engagement slipping — a budget bump can re-surface it to in-market shoppers.',
    action:'pm',
  },
  {
    id:'v7', year:2020, make:'Ford', model:'Mustang', trim:'GT Premium',
    stock:'M5510', price:'$34,200', miles:'22,140 mi',
    photo:PH('1494905998402-395d579af36f'), health:'black',
    days:103, vdps:96, opps:0, sale:'No sale',
    primary:'Invisible — almost no shopper activity',
    rec:'No demand and no media. Get it into a campaign or reconsider the price.',
    action:'price',
  },
  {
    id:'v8', year:2023, make:'Audi', model:'RS6', trim:'Avant quattro',
    stock:'A9921', price:'$118,500', miles:'6,400 mi',
    photo:PH('1542362567-b07e54358753'), health:'green',
    days:9, vdps:880, opps:5, sale:'No sale',
    primary:'Strong demand, well merchandised',
    rec:'Firing on all cylinders. Hold spend and let sales work the opps.',
    action:'assign',
  },
];

Object.assign(window, { PH, HEALTH, BRAND, ACTIONS, ACTION_ORDER, KPIS, INVENTORY, VEHICLES });
