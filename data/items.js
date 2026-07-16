// ============================================================
//  ITEMS DATA
// ============================================================

const ITEMS = {
  // ===== NOVA/EGY A =====
  'a-weapon':   { id:'a-weapon',   cat:'Nova/Egy A', group:'weapon_shield', name:'Weapon', gold:2000000000, sc:100, lsc:10000 },
  'a-shield':   { id:'a-shield',   cat:'Nova/Egy A', group:'weapon_shield', name:'Shield', gold:2000000000, sc:100, lsc:10000 },
  'a-head':     { id:'a-head',     cat:'Nova/Egy A', group:'armor', name:'Head', setTag:'Destruction', gold:1000000000, sc:50, lsc:1000 },
  'a-chest':    { id:'a-chest',    cat:'Nova/Egy A', group:'armor', name:'Chest', setTag:'Destruction', gold:1000000000, sc:50, lsc:1000 },
  'a-legs':     { id:'a-legs',     cat:'Nova/Egy A', group:'armor', name:'Legs', setTag:'Destruction', gold:1000000000, sc:50, lsc:1000 },
  'a-shoulder': { id:'a-shoulder', cat:'Nova/Egy A', group:'armor', name:'Shoulder', setTag:'Destruction', gold:1000000000, sc:50, lsc:1000 },
  'a-hands':    { id:'a-hands',    cat:'Nova/Egy A', group:'armor', name:'Hands', setTag:'Destruction', gold:1000000000, sc:50, lsc:1000 },
  'a-foot':     { id:'a-foot',     cat:'Nova/Egy A', group:'armor', name:'Foot', setTag:'Destruction', gold:1000000000, sc:50, lsc:1000 },
  'a-earring':  { id:'a-earring',  cat:'Nova/Egy A', group:'accessory', name:'Earring', setTag:'Myth', gold:1500000000, sc:100, lsc:4000 },
  'a-necklace': { id:'a-necklace', cat:'Nova/Egy A', group:'accessory', name:'Necklace', setTag:'Myth', gold:2000000000, sc:100, lsc:6000 },
  'a-ring1':    { id:'a-ring1',    cat:'Nova/Egy A', group:'accessory', name:'1. Ring', setTag:'Myth', gold:1000000000, sc:100, lsc:2000 },
  'a-ring2':    { id:'a-ring2',    cat:'Nova/Egy A', group:'accessory', name:'2. Ring', setTag:'Myth', gold:1000000000, sc:100, lsc:2000 },

  // ===== NOVA/EGY B =====
  'b-head':     { id:'b-head',     cat:'Nova/Egy B', group:'armor', name:'Head', setTag:'Immortal', gold:2000000000, sc:100, lsc:2000, gc:25, lgc:2000 },
  'b-chest':    { id:'b-chest',    cat:'Nova/Egy B', group:'armor', name:'Chest', setTag:'Immortal', gold:2000000000, sc:100, lsc:2000, gc:25, lgc:2000 },
  'b-legs':     { id:'b-legs',     cat:'Nova/Egy B', group:'armor', name:'Legs', setTag:'Immortal', gold:2000000000, sc:100, lsc:2000, gc:25, lgc:2000 },
  'b-shoulder': { id:'b-shoulder', cat:'Nova/Egy B', group:'armor', name:'Shoulder', setTag:'Immortal', gold:2000000000, sc:100, lsc:2000, gc:25, lgc:2000 },
  'b-hands':    { id:'b-hands',    cat:'Nova/Egy B', group:'armor', name:'Hands', setTag:'Immortal', gold:2000000000, sc:100, lsc:2000, gc:25, lgc:2000 },
  'b-foot':     { id:'b-foot',     cat:'Nova/Egy B', group:'armor', name:'Foot', setTag:'Immortal', gold:2000000000, sc:100, lsc:2000, gc:25, lgc:2000 },
  'b-earring':  { id:'b-earring',  cat:'Nova/Egy B', group:'accessory', name:'Earring', setTag:'Legend', gold:2000000000, sc:200, lsc:8000, gc:50, lgc:4000 },
  'b-necklace': { id:'b-necklace', cat:'Nova/Egy B', group:'accessory', name:'Necklace', setTag:'Legend', gold:2000000000, sc:200, lsc:12000, gc:50, lgc:6000 },
  'b-ring1':    { id:'b-ring1',    cat:'Nova/Egy B', group:'accessory', name:'1. Ring', setTag:'Legend', gold:2000000000, sc:200, lsc:4000, gc:50, lgc:2000 },
  'b-ring2':    { id:'b-ring2',    cat:'Nova/Egy B', group:'accessory', name:'2. Ring', setTag:'Legend', gold:2000000000, sc:200, lsc:4000, gc:50, lgc:2000 },

  // ===== UPGRADE NOVA/EGY A → B =====
  'u-head':     { id:'u-head',     cat:'Upgrade Nova/Egy A → B', group:'armor', name:'Head', upgradeFrom:'Destruction', upgradeTo:'Immortal', gold:2000000000, sc:50, lsc:1000, gc:25, lgc:2000 },
  'u-chest':    { id:'u-chest',    cat:'Upgrade Nova/Egy A → B', group:'armor', name:'Chest', upgradeFrom:'Destruction', upgradeTo:'Immortal', gold:2000000000, sc:50, lsc:1000, gc:25, lgc:2000 },
  'u-legs':     { id:'u-legs',     cat:'Upgrade Nova/Egy A → B', group:'armor', name:'Legs', upgradeFrom:'Destruction', upgradeTo:'Immortal', gold:2000000000, sc:50, lsc:1000, gc:25, lgc:2000 },
  'u-shoulder': { id:'u-shoulder', cat:'Upgrade Nova/Egy A → B', group:'armor', name:'Shoulder', upgradeFrom:'Destruction', upgradeTo:'Immortal', gold:2000000000, sc:50, lsc:1000, gc:25, lgc:2000 },
  'u-hands':    { id:'u-hands',    cat:'Upgrade Nova/Egy A → B', group:'armor', name:'Hands', upgradeFrom:'Destruction', upgradeTo:'Immortal', gold:2000000000, sc:50, lsc:1000, gc:25, lgc:2000 },
  'u-foot':     { id:'u-foot',     cat:'Upgrade Nova/Egy A → B', group:'armor', name:'Foot', upgradeFrom:'Destruction', upgradeTo:'Immortal', gold:2000000000, sc:50, lsc:1000, gc:25, lgc:2000 },
  'u-earring':  { id:'u-earring',  cat:'Upgrade Nova/Egy A → B', group:'accessory', name:'Earring', upgradeFrom:'Myth', upgradeTo:'Legend', gold:2000000000, sc:100, lsc:4000, gc:50, lgc:4000 },
  'u-necklace': { id:'u-necklace', cat:'Upgrade Nova/Egy A → B', group:'accessory', name:'Necklace', upgradeFrom:'Myth', upgradeTo:'Legend', gold:2000000000, sc:100, lsc:6000, gc:50, lgc:6000 },
  'u-ring1':    { id:'u-ring1',    cat:'Upgrade Nova/Egy A → B', group:'accessory', name:'1. Ring', upgradeFrom:'Myth', upgradeTo:'Legend', gold:2000000000, sc:100, lsc:2000, gc:50, lgc:2000 },
  'u-ring2':    { id:'u-ring2',    cat:'Upgrade Nova/Egy A → B', group:'accessory', name:'2. Ring', upgradeFrom:'Myth', upgradeTo:'Legend', gold:2000000000, sc:100, lsc:2000, gc:50, lgc:2000 },
};