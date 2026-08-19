import type { CalendarEvent } from "./events";

const source = "https://endfield.hypergryph.com/news/9335";
const versionImage = "https://web.hycdn.cn/upload/image/20260715/a816d526872e655f6324a2f026e6be2f.jpg";

const datedEvents: CalendarEvent[] = [
  { id:"ef-morning-star", game:"endfield", title:"Morning Star Shines Here", shortTitle:"Morning Star", titleZh:"晨星于此闪耀", shortTitleZh:"晨星于此闪耀", category:"warp", startsAt:"2026-08-09T04:00:00.000Z", endsAt:"2026-09-17T03:59:00.000Z", description:"Rate-up recruitment for 6-star Operator Lino.", descriptionZh:"六星干员「梨诺」概率提升特许寻访。", sourceUrl:source, verified:true },
  { id:"ef-meteor", game:"endfield", title:"Like a Meteor Beyond the Border", shortTitle:"Like a Meteor", titleZh:"如同流星飞越边界", shortTitleZh:"如同流星飞越边界", category:"event", startsAt:"2026-08-09T04:00:00.000Z", endsAt:"2026-09-17T03:59:00.000Z", description:"Complete the side story for Oroberyl and materials.", descriptionZh:"完成支线任务，获取嵌晶玉与初级认知载体等奖励。", rewardZh:"嵌晶玉 ×600", sourceUrl:source, verified:true },
  { id:"ef-root-wonderland", game:"endfield", title:"Root Wonderland", shortTitle:"Root Wonderland", titleZh:"根脉奇境", shortTitleZh:"根脉奇境", category:"event", startsAt:"2026-08-09T04:00:00.000Z", endsAt:"2026-09-17T03:59:00.000Z", description:"Collect Aether fragments and complete Wonderland missions.", descriptionZh:"收集醚质残块并完成奇境任务。", rewardZh:"嵌晶玉 ×1600", sourceUrl:source, verified:true },
  { id:"ef-delirium", game:"endfield", title:"War Echoes: Delirium Season", shortTitle:"Delirium Season", titleZh:"战争回响：谵妄赛季", shortTitleZh:"谵妄赛季", category:"reset", startsAt:"2026-08-09T04:00:00.000Z", endsAt:"2026-09-17T03:59:00.000Z", description:"A new seasonal permanent challenge rotation.", descriptionZh:"战争回响全新赛季，新增挑战关卡。", sourceUrl:source, verified:true },
  { id:"ef-monument", game:"endfield", title:"Monument Challenge: Beast", shortTitle:"Monument Challenge", titleZh:"丰碑留名·兽犼", shortTitleZh:"丰碑留名·兽犼", category:"reset", startsAt:"2026-08-06T04:00:00.000Z", endsAt:"2026-08-19T20:00:00.000Z", description:"Limited Monument challenge event.", descriptionZh:"完成「山中见犼」对应挑战，领取限时奖励。", rewardZh:"嵌晶玉 ×1200", sourceUrl:source, verified:true },
  { id:"ef-secret-space", game:"endfield", title:"Secret Realm Walker: Hexa Realm", shortTitle:"Hexa Realm", titleZh:"密境行者：六方巧境", shortTitleZh:"六方巧境", category:"event", startsAt:"2026-08-19T04:00:00.000Z", endsAt:"2026-09-17T03:59:00.000Z", description:"A new puzzle space group opens in two stages.", descriptionZh:"全新解谜空间组，8月19日与26日分阶段开放。", rewardZh:"嵌晶玉 ×1200", sourceUrl:source, verified:true },
  { id:"ef-sanity", game:"endfield", title:"Sanity Supply", shortTitle:"Sanity Supply", titleZh:"理智补给", shortTitleZh:"理智补给", category:"bonus", startsAt:"2026-08-25T20:00:00.000Z", endsAt:"2026-09-01T20:00:00.000Z", description:"Complete daily missions for Sanity supplies.", descriptionZh:"每日完成指定任务，领取理智补给奖励。", sourceUrl:source, verified:true },
];

export const endfieldEvents: CalendarEvent[] = datedEvents.map(event=>({...event,imageUrl:versionImage}));
