/**
 * js/services/db.js — Local persistence (localStorage).
 * UPGRADE HOOK: swap get/set/del with Supabase/Firebase. See README.
 */

// Node.js shim (tests run outside browser)
if (typeof localStorage === 'undefined') {
  const _s = {};
  globalThis.localStorage = {
    getItem: k => _s[k]??null, setItem: (k,v)=>{_s[k]=v;},
    removeItem: k=>{delete _s[k];},
    get length(){ return Object.keys(_s).length; },
    key: i=>Object.keys(_s)[i]??null,
  };
}

const NS = 'n7__';
export const db = {
  get(k)    { try{ const r=localStorage.getItem(NS+k); return r==null?null:JSON.parse(r); }catch{ return null; } },
  set(k,v)  { try{ localStorage.setItem(NS+k,JSON.stringify(v)); return true; }catch{ return false; } },
  del(k)    { localStorage.removeItem(NS+k); },
  list(prefix='') { const ks=[]; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i); if(k&&k.startsWith(NS+prefix)) ks.push(k.slice(NS.length));} return ks; },
  clearAll()  { this.list().forEach(k=>this.del(k)); },
  exportAll() { const o={}; this.list().forEach(k=>{ o[k]=this.get(k); }); return o; },
  entryKey(wk,day)     { return `entry__w${wk}_2026_${day}`; },
  saveEntry(wk,day,data) {
    const k=this.entryKey(wk,day);
    const merged={...(this.get(k)||{}),...data,updatedAt:new Date().toISOString()};
    this.set(k,merged); return merged;
  },
  getEntry(wk,day)   { return this.get(this.entryKey(wk,day)); },
  getWeekEntries(wk) {
    const out={}; ['Fri','Sat','Sun','Mon','Tue','Wed','Thu'].forEach(d=>{ out[d]=this.getEntry(wk,d)||null; }); return out;
  },
};
