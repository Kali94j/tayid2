import {initializeApp} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,onAuthStateChanged,deleteUser,updatePassword,reauthenticateWithCredential,EmailAuthProvider,setPersistence,browserLocalPersistence,browserSessionPersistence} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {initializeFirestore,collection,doc,getDoc,setDoc,updateDoc,deleteDoc,query,orderBy,onSnapshot,writeBatch,where,increment,arrayUnion,getDocs,limit,terminate,clearIndexedDbPersistence,persistentLocalCache,persistentMultipleTabManager,getCountFromServer} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
const cfg={apiKey:"AIzaSyDwQzQe_JRN4ENr95ov_Cgpo6qYLWXAZ6U",authDomain:"tayid2.firebaseapp.com",projectId:"tayid2",storageBucket:"tayid2.firebasestorage.app",messagingSenderId:"516822353811",appId:"1:516822353811:web:67848b3dc2ee79be80ca66"};
const LS=k=>{try{return localStorage[k]}catch{return null}};
const app=initializeApp(cfg),auth=getAuth(app),fs=initializeFirestore(app,{experimentalAutoDetectLongPolling:true,...(LS("offm")!=="0"?{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})}:{})}),auth2=getAuth(initializeApp(cfg,"sec"));
const APPCHECK_KEY="";
if(APPCHECK_KEY){const m=await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app-check.js");m.initializeAppCheck(app,{provider:new m.ReCaptchaV3Provider(APPCHECK_KEY),isTokenAutoRefreshEnabled:true})}
const $=i=>document.getElementById(i),val=i=>$(i).value.trim(),JP="data:image/jpeg;base64,";
const TH=["auto","dark","light"],THN={auto:"تلقائي",dark:"داكن 🌙",light:"فاتح ☀"};
function setTheme(t){if(!TH.includes(t))t="auto";const h=document.documentElement;if(t==="auto")h.removeAttribute("data-theme");else h.dataset.theme=t;try{localStorage.theme=t}catch{}
 const dk=t==="dark"||(t==="auto"&&matchMedia("(prefers-color-scheme:dark)").matches),mt=document.querySelector('meta[name="theme-color"]'),l=$("thL"),s=$("sTh");if(mt)mt.content=dk?"#16231e":"#315743";if(l)l.textContent=THN[t];if(s)s.value=t}
setTheme(LS("theme")||"auto");
const F=["personName","statusType","beneficiary","relation","unified","district","birthDate","attendanceDate"];
const LB={personName:"الاسم",statusType:"الحالة",beneficiary:"اسم المستفيد",relation:"صلة القرابة",unified:"رقم الموحدة",district:"محل النفوس",birthDate:"تاريخ الميلاد",attendanceDate:"تاريخ الحضور",pct:"نسبة العجز"};
const RN={user:"مستخدم",editor:"محرر",admin:"مدير"},TL={p:"👤 الصورة الشخصية",f:"🪪 الموحدة: الوجه الأمامي",b:"🪪 الموحدة: الوجه الخلفي"};
let trR=[],ou="",ob=null,lim=20,recs=[],sel=null,selB=null,tgt=null,mp=null,unB=null,bens=[],pend={},me=null,started=false,busy=false,setup=false,tt,idle,armed={},canE=false,canD=false;
const RC=collection(fs,"records");
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const E={"auth/invalid-credential":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/user-not-found":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/wrong-password":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/weak-password":"كلمة السر ضعيفة.","auth/email-already-in-use":"هذا الاسم مستخدم مسبقًا.","auth/network-request-failed":"لا يوجد اتصال بالإنترنت.","auth/too-many-requests":"محاولات كثيرة، حاول لاحقًا.","permission-denied":"رفض Firebase هذه العملية. إن كنت مديرًا فانشر آخر نسخة من firestore.rules في Firebase ← Rules."};
const err=e=>E[e.code]||e.message||"حدث خطأ";
const qn=()=>{let s=AD(val("q"));if(/^[\d\s]+$/.test(s))s=s.replace(/\s/g,"");return norm(s)};
const norm=s=>String(s||"").replace(/[\u064B-\u065F\u0640]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/\s+/g," ").trim().toLowerCase();
const mail=async n=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(n.trim().toLowerCase())))].slice(0,16).map(b=>b.toString(16).padStart(2,"0")).join("")+"@tayid.app";
function say(t,ok){$("st").textContent=t;$("st").style.color=ok?"#3e8a55":"#c0574c";const o=$("toast");o.textContent=t;o.style.background=ok?"#2f7a4a":"#a64e45";o.classList.remove("hidden");clearTimeout(tt);tt=setTimeout(()=>o.classList.add("hidden"),4500)}
const lm=t=>$("lm").textContent=t;
const log=(t,x)=>setDoc(doc(collection(fs,"activity")),{t,u:me.name,x:String(x).slice(0,190),at:Date.now()}).catch(()=>{}),IE={login:"🔑",add:"➕",del:"🗑",att:"✅",edit:"✏️"};
function notify(t){const o=$("toast");o.textContent="🔔 "+t;o.style.background="linear-gradient(90deg,#1e3c72,#0f766e)";o.classList.remove("hidden");clearTimeout(tt);tt=setTimeout(()=>o.classList.add("hidden"),6000);
 if("Notification" in window&&Notification.permission==="granted"&&navigator.serviceWorker)navigator.serviceWorker.ready.then(r=>r.showNotification("برنامج تأييد الحضور",{body:t,icon:"icon-192.png",tag:"tayid"})).catch(()=>{})}
let first=true,acts=[];
const lseen=()=>{try{return +localStorage.ls||0}catch{return 0}};
function renderAct(){const l=lseen(),o=acts.filter(e=>e.u!==me.name),b=$("bn");b.textContent=o.length>99?"99+":o.length;b.classList.toggle("hidden",!o.length);
 $("act").innerHTML=acts.map(e=>`<div class="ev"><i>${IE[e.t]||"•"}</i><div><b>${esc(e.u)}</b> ${esc(e.x)}${e.at>l&&e.u!==me.name?' <span class="nw">جديد</span>':""}<small>${new Date(e.at).toLocaleString("ar",{dateStyle:"short",timeStyle:"short"})}</small></div><button class="b del" data-a="da" data-id="${esc(e.id)}" aria-label="حذف">✕</button></div>`).join("")||'<div class="st">لا يوجد نشاط.</div>'}
function watchAct(){$("bell").classList.remove("hidden");onSnapshot(query(collection(fs,"activity"),orderBy("at","desc"),limit(100)),s=>{
 if(!first)s.docChanges().forEach(c=>{if(c.type==="added"){const e=c.doc.data();if(e.u!==me.name){notify((IE[e.t]||"")+" "+e.u+": "+e.x);$("bell").classList.add("ring");setTimeout(()=>$("bell").classList.remove("ring"),4e3)}}});first=false;
 acts=s.docs.map(d=>({id:d.id,...d.data()}));renderAct()},e=>say(err(e)+" [سجل النشاط]"))}
const today=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
async function att(id){const td=today(),bn=mp&&id!==mp?bens.find(y=>y.id===id):null,x=bn||recs.find(y=>y.id===id);if(!x)return;
 if((x.att||[]).includes(td))return say("حضور اليوم مؤكَّد مسبقًا.");
 const b=writeBatch(fs),o={att:arrayUnion(td),attendanceDate:td,updatedAt:Date.now()};
 if(bn){b.update(doc(fs,"bens",id),o);b.update(doc(RC,mp),{ld:td})}else{if(isM(x.statusType))o.ld=td;b.update(doc(RC,id),o)}
 const cp=b.commit();if(navigator.onLine)await cp;else cp.catch(()=>{});const nm=bn?(recs.find(y=>y.id===mp)||{}).personName:x.personName;log("att","أيّد حضور: "+(bn?x.beneficiary+" ("+nm+")":nm));say(navigator.onLine?"✓ تم تأييد حضور اليوم.":"🔌 حُفظ على الجهاز وسيُرسل عند الاتصال.",1)}
const dl=(n,t,m)=>{const u=URL.createObjectURL(new Blob([t],{type:m})),a=document.createElement("a");a.href=u;a.download=n;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4e3)};
const cs=v=>{let s=String(v==null?"":v);if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
const allB=async()=>(await getDocs(collection(fs,"bens"))).docs.map(d=>({id:d.id,...d.data()})).filter(x=>!x.del&&recs.some(r=>r.id===x.rid));
function csvText(bs){const H=["الحالة","اسم الشهيد/المصاب","نسبة العجز","اسم المستفيد","صلة القرابة","رقم الموحدة","محل النفوس","تاريخ الميلاد","تاريخ الحضور","عدد مرات الحضور","أضيف بواسطة",...CFd().map(f=>f.lb)],R=[];
 recs.forEach(r=>{const l=[...((r.beneficiary||!isM(r.statusType))?[r]:[]),...bs.filter(b=>b.rid===r.id)];(l.length?l:[{}]).forEach(x=>R.push([r.statusType,r.personName,r.pct?r.pct+"%":"",x.beneficiary,x.relation,x.unified,x.district,x.birthDate,x.attendanceDate,(x.att||[]).length,x.by||r.by,...CFd().map(f=>(x.cf||{})[f.id]||"")]))});
 return "\uFEFF"+[H,...R].map(r=>r.map(cs).join(",")).join("\r\n")}
async function csv(){dl("tayid-"+today()+".csv",csvText(await allB()),"text/csv;charset=utf-8");say("تم تحميل ملف Excel.",1)}
async function bk(full){const o={v:1,at:Date.now(),records:recs,bens:await allB()};if(full)o.images=Object.fromEntries((await getDocs(collection(fs,"images"))).docs.map(d=>[d.id,d.data().d]));
 dl("tayid-backup-"+today()+(full?"-full":"")+".json",JSON.stringify(o),"application/json");say("تم تحميل النسخة الاحتياطية.",1);okBk()}
const crcT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=u=>{let c=-1;for(let i=0;i<u.length;i++)c=crcT[(c^u[i])&255]^(c>>>8);return(c^-1)>>>0};
function zip(files){const enc=new TextEncoder(),parts=[],cd=[];let off=0;
 for(const f of files){const nm=enc.encode(f.n),c=crc(f.d),n=f.d.length,L=new DataView(new ArrayBuffer(30));
  L.setUint32(0,0x04034b50,true);L.setUint16(4,20,true);L.setUint16(6,0x0800,true);L.setUint16(12,0x21,true);L.setUint32(14,c,true);L.setUint32(18,n,true);L.setUint32(22,n,true);L.setUint16(26,nm.length,true);
  parts.push(L.buffer,nm,f.d);
  const C=new DataView(new ArrayBuffer(46));C.setUint32(0,0x02014b50,true);C.setUint16(4,20,true);C.setUint16(6,20,true);C.setUint16(8,0x0800,true);C.setUint16(14,0x21,true);C.setUint32(16,c,true);C.setUint32(20,n,true);C.setUint32(24,n,true);C.setUint16(28,nm.length,true);C.setUint32(42,off,true);
  cd.push(C.buffer,nm);off+=30+nm.length+n}
 const E=new DataView(new ArrayBuffer(22));E.setUint32(0,0x06054b50,true);E.setUint16(8,files.length,true);E.setUint16(10,files.length,true);E.setUint32(12,cd.reduce((s,x)=>s+x.byteLength,0),true);E.setUint32(16,off,true);
 return new Blob([...parts,...cd,E.buffer],{type:"application/zip"})}
function unzip(buf,any){const v=new DataView(buf),u=new Uint8Array(buf),dec=new TextDecoder(),out={};let e=buf.byteLength-22;while(e>=0&&v.getUint32(e,true)!==0x06054b50)e--;if(e<0)throw Error("ملف ZIP غير صالح.");
 let n=v.getUint16(e+10,true),p=v.getUint32(e+16,true);
 while(n--&&v.getUint32(p,true)===0x02014b50){const m=v.getUint16(p+10,true),cs_=v.getUint32(p+20,true),nl=v.getUint16(p+28,true),xl=v.getUint16(p+30,true),cl=v.getUint16(p+32,true),lo=v.getUint32(p+42,true),nm=dec.decode(u.subarray(p+46,p+46+nl));
  if(m!==0&&!any)throw Error("هذا الملف مضغوط بطريقة غير مدعومة. استعمل ملف ZIP أنشأه البرنامج.");
  const ds=lo+30+v.getUint16(lo+26,true)+v.getUint16(lo+28,true);out[nm]=any?{m,d:u.subarray(ds,ds+cs_)}:u.subarray(ds,ds+cs_);p+=46+nl+xl+cl}
 return out}
const b64u=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),safe=s=>String(s||"").replace(/[\\\/:*?"<>|]/g,"_").slice(0,60);
async function zipx(){say("جارٍ تجهيز الملف… قد يستغرق دقيقة.",1);const bs=await allB(),im=Object.fromEntries((await getDocs(collection(fs,"images"))).docs.map(d=>[d.id,d.data().d])),F=[],enc=new TextEncoder(),nmo={p:" - شخصية",f:" - موحدة أمامي",b:" - موحدة خلفي"};
 const add=(x,lab)=>{for(const k of["p","f","b"]){const d=k==="p"?x.photo:im[x.id+"_"+k];if(d&&d.startsWith(JP))F.push({n:"الصور/"+safe(lab)+nmo[k]+"__"+x.id+"_"+k+".jpg",d:b64u(d.slice(JP.length))})}};
 recs.forEach(r=>{if(!isM(r.statusType)||r.beneficiary)add(r,r.personName+(r.beneficiary&&isM(r.statusType)?" - "+r.beneficiary:""))});
 bs.forEach(x=>{const r=recs.find(y=>y.id===x.rid);add(x,(r?r.personName:"")+" - "+x.beneficiary)});
 F.unshift({n:"data.json",d:enc.encode(JSON.stringify({v:2,at:Date.now(),records:recs,bens:bs}))},{n:"table.csv",d:enc.encode(csvText(bs))});
 dl("tayid-"+today()+".zip",zip(F),"application/zip");say("✓ تم تحميل ملف ZIP.",1);okBk()}
const RK=["personName","statusType","beneficiary","relation","unified","district","birthDate","attendanceDate","benKey","photo","hf","hb","by","createdAt","updatedAt","pct","bc","sk","ld","att","cf"],BK=["rid","beneficiary","relation","unified","district","birthDate","attendanceDate","benKey","photo","hf","hb","by","createdAt","updatedAt","att","cf"];
const pk=(o,K)=>{const r={};K.forEach(k=>{if(o[k]!=null)r[k]=o[k]});return r},okId=i=>/^[A-Za-z0-9]{10,40}$/.test(i||"");
async function restore(f){let J,IM={};
 if(/\.zip$/i.test(f.name)){const z=unzip(await f.arrayBuffer());if(!z["data.json"])throw Error("الملف لا يحتوي data.json.");J=JSON.parse(new TextDecoder().decode(z["data.json"]));
  for(const n in z){const m=n.match(/__([A-Za-z0-9]+_[fb])\.jpg$/);if(m)IM[m[1]]=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(new Blob([z[n]],{type:"image/jpeg"}))})}}
 else{J=JSON.parse(await f.text());IM=J.images||{}}
 if(!J||!Array.isArray(J.records)||!Array.isArray(J.bens||[]))throw Error("ملف النسخة غير صالح.");
 const R=J.records.filter(r=>okId(r.id)),B=(J.bens||[]).filter(x=>okId(x.id)),I=Object.entries(IM).filter(([k,d])=>/^[A-Za-z0-9]+_[fb]$/.test(k)&&typeof d==="string"&&d.startsWith(JP)&&d.length<1e6);
 if(!confirm("سيتم استعادة "+R.length+" سجل و "+B.length+" مستفيد و "+I.length+" صورة موحدة.\nتُدمج مع الموجود: يُستبدل ما له نفس المعرّف ولا يُحذف شيء. متابعة؟"))return;
 let b=writeBatch(fs),n=0,sz=0,t=0;
 const put=async(ref,o,len)=>{b.set(ref,o);n++;t++;sz+=len;if(n>=100||sz>4e6){await b.commit();b=writeBatch(fs);n=sz=0;say("تمت استعادة "+t+"…",1)}};
 for(const r of R)await put(doc(RC,r.id),pk(r,RK),(r.photo||"").length+500);
 for(const x of B)await put(doc(fs,"bens",x.id),pk(x,BK),(x.photo||"").length+500);
 for(const [k,d] of I)await put(doc(fs,"images",k),{rid:k.slice(0,-2),d},d.length);
 if(n)await b.commit();say("✓ تمت الاستعادة: "+t+" عنصر.",1)}
const dif=(o,n,ks)=>ks.filter(k=>String(o[k]==null?"":o[k])!==String(n[k]==null?"":n[k])).map(k=>LB[k]+": "+(o[k]||"—")+" ← "+(n[k]||"—")).join("، ");
const dupU=v=>v&&recs.find(r=>r.id!==sel&&(r.unified===v||(r.sk||[]).includes(v)));
let LBr=0;
const bkDays=()=>{const v=LS("bkDays");return v==null?7:+v};
function chkBk(){let lb=0,sn=0;try{lb=+localStorage.lb||0;sn=+localStorage.bsn||0}catch{}lb=Math.max(lb,LBr);const D=bkDays(),d=Math.floor((Date.now()-lb)/864e5),show=D>0&&(!lb||d>=D)&&Date.now()>sn;
 $("bkn").classList.toggle("hidden",!show);$("bkt").textContent=lb?"⚠ تذكير النسخة الاحتياطية: آخر نسخة منذ "+d+" يومًا.":"⚠ لم تُحمَّل أي نسخة احتياطية بعد.";
 if(show){try{if(!sessionStorage.bkn){sessionStorage.bkn=1;notify($("bkt").textContent.replace("⚠ ",""))}}catch{}}}
const okBk=()=>{LBr=Date.now();try{localStorage.lb=LBr}catch{}if(me&&me.role==="admin")setDoc(doc(fs,"meta","backup"),{at:LBr,by:me.name}).catch(()=>{});chkBk()};
async function getImg(k){let d=IC.get(k);if(!d){const s=await getDoc(doc(fs,"images",k));d=s.exists()&&s.data().d;if(d&&d.startsWith(JP))IC.set(k,d);else d=""}return d}
addEventListener("afterprint",()=>document.body.classList.remove("printing"));
const ST_OK=["شهيد","شهيدة","مصاب","مصابه"],HC={st:"الحالة",pn:"اسم الشهيد/المصاب",pc:"نسبة العجز",bn:"اسم المستفيد",rl:"صلة القرابة",un:"رقم الموحدة",ds:"محل النفوس",bd:"تاريخ الميلاد",ad:"تاريخ الحضور"};
function parseCSV(t){const R=[];let r=[],c="",q=false;for(let i=0;i<t.length;i++){const ch=t[i];if(q){if(ch==='"'){if(t[i+1]==='"'){c+='"';i++}else q=false}else c+=ch}else if(ch==='"')q=true;else if(ch===","||ch===";"||ch==="\t"){r.push(c);c=""}else if(ch==="\n"){r.push(c);R.push(r);r=[];c=""}else if(ch!=="\r")c+=ch}if(c||r.length){r.push(c);R.push(r)}return R}
const inflate=async u=>new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer());
async function xlsxRows(buf){const z=unzip(buf,true),P=new DOMParser(),rd=async n=>{const e=z[n];return e?new TextDecoder().decode(e.m?await inflate(e.d):e.d):""};
 const ss=[...P.parseFromString(await rd("xl/sharedStrings.xml"),"text/xml").getElementsByTagName("si")].map(si=>[...si.getElementsByTagName("t")].map(t=>t.textContent).join("")),sh=P.parseFromString(await rd("xl/worksheets/sheet1.xml"),"text/xml"),R=[];
 for(const row of sh.getElementsByTagName("row")){const r=[];for(const c of row.getElementsByTagName("c")){const col=(c.getAttribute("r")||"A1").replace(/\d+/g,"").split("").reduce((s,ch)=>s*26+ch.charCodeAt(0)-64,0)-1,v=c.getElementsByTagName("v")[0],t=c.getAttribute("t");let x="";if(t==="s"&&v)x=ss[+v.textContent]||"";else if(t==="inlineStr")x=[...c.getElementsByTagName("t")].map(y=>y.textContent).join("");else if(v)x=v.textContent;r[col]=x}R.push(Array.from(r,v=>v==null?"":v))}return R}
const dte=v=>{v=String(v||"").trim();if(/^\d{5}(\.\d+)?$/.test(v)&&+v>20000&&+v<80000)return new Date(Math.round((+v-25569)*864e5)).toISOString().slice(0,10);let m=v.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/);if(m)return m[1]+"-"+m[2].padStart(2,"0")+"-"+m[3].padStart(2,"0");m=v.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/);return m?m[3]+"-"+m[2].padStart(2,"0")+"-"+m[1].padStart(2,"0"):""};
async function imp(f){let R;if(/\.xlsx$/i.test(f.name))R=await xlsxRows(await f.arrayBuffer());else R=parseCSV((await f.text()).replace(/^\uFEFF/,""));
 R=R.filter(r=>r.some(c=>String(c).trim()));if(R.length<2)throw Error("الملف فارغ أو بلا صفوف.");
 const H=R[0].map(x=>String(x).trim()),ix=k=>H.indexOf(HC[k]);for(const k in HC)if(ix(k)<0)throw Error("العمود المطلوب غير موجود: "+HC[k]);
 const cfi=CFd().map(f=>[f.id,H.indexOf(f.lb)]).filter(x=>x[1]>=0),cfo=o=>o.cf&&Object.keys(o.cf).length?{cf:o.cf}:{},rels=[...$("relation").options].slice(1).map(o=>o.text),dis=[...$("district").options].slice(1).map(o=>o.text),ok=[],bad=[],seen=new Set();
 R.slice(1).forEach((r,i)=>{const g=k=>String(r[ix(k)]==null?"":r[ix(k)]).trim(),o={st:g("st"),pn:g("pn"),pc:g("pc").replace("%",""),bn:g("bn"),rl:g("rl"),un:g("un"),ds:g("ds"),bd:dte(g("bd")),ad:dte(g("ad")),cf:Object.fromEntries(cfi.map(([id,c])=>[id,String(r[c]==null?"":r[c]).trim()]).filter(x=>x[1]))},e=[];
  if(!ST_OK.includes(o.st))e.push("حالة غير صحيحة");if(!o.pn)e.push("الاسم ناقص");if(!isM(o.st)&&!(+o.pc>=30&&+o.pc<=100))e.push("نسبة العجز 30-100");
  if(!o.bn)e.push("المستفيد ناقص");if(o.rl?!rels.includes(o.rl):isReq("relation"))e.push("صلة القرابة غير معروفة");if(!o.un){if(isReq("unified"))e.push("رقم الموحدة ناقص")}else if(seen.has(o.un)||dupU(o.un))e.push("رقم الموحدة مكرر");
  if(o.ds?!dis.includes(o.ds):isReq("district"))e.push("محل النفوس غير معروف");if(!o.bd&&isReq("birthDate"))e.push("تاريخ الميلاد");if(!o.ad&&isReq("attendanceDate"))e.push("تاريخ الحضور");
  if(e.length)bad.push("سطر "+(i+2)+": "+e.join("، "));else{seen.add(o.un);ok.push(o)}});
 if(!ok.length)throw Error("لا يوجد سطر صالح. "+bad.slice(0,3).join(" | "));
 if(!confirm("جاهز للاستيراد: "+ok.length+" سطر صالح، و"+bad.length+" فيه أخطاء (سيُتجاهل).\n"+bad.slice(0,6).join("\n")+(bad.length>6?"\n…":"")+"\nمتابعة؟"))return;
 const now=Date.now();let b=writeBatch(fs),n=0;const put=async fn=>{fn(b);if(++n>=100){await b.commit();b=writeBatch(fs);n=0}},gm={};
 ok.filter(o=>isM(o.st)).forEach(o=>{const k=o.st+"|"+norm(o.pn);(gm[k]=gm[k]||[]).push(o)});
 for(const k in gm){const L=gm[k],o0=L[0],ex=recs.find(r=>r.statusType===o0.st&&norm(r.personName)===norm(o0.pn)),id=ex?ex.id:doc(RC).id,sk=L.flatMap(o=>[norm(o.bn),o.un,o.ds]).filter(Boolean),ld=[(ex&&ex.ld)||"",...L.map(o=>o.ad)].sort().pop();
  await put(x=>ex?x.update(doc(RC,id),{bc:increment(L.length),sk:arrayUnion(...sk),ld}):x.set(doc(RC,id),{personName:o0.pn,statusType:o0.st,bc:L.length,sk:[...new Set(sk)],ld,by:me.name,createdAt:now}));
  for(const o of L)await put(x=>x.set(doc(collection(fs,"bens")),{rid:id,beneficiary:o.bn,relation:o.rl,unified:o.un,district:o.ds,birthDate:o.bd,attendanceDate:o.ad,benKey:norm(o.bn),att:A1(o.ad),by:me.name,createdAt:now,...cfo(o)}))}
 for(const o of ok.filter(o=>!isM(o.st)))await put(x=>x.set(doc(RC),{personName:o.pn,statusType:o.st,pct:Math.round(+o.pc),beneficiary:o.bn,relation:o.rl,unified:o.un,district:o.ds,birthDate:o.bd,attendanceDate:o.ad,benKey:norm(o.bn),att:A1(o.ad),by:me.name,createdAt:now,...cfo(o)}));
 if(n)await b.commit();log("add","استورد "+ok.length+" سطرًا من ملف");say("✓ تم استيراد "+ok.length+" سطر.",1)}
const bars=(t,p)=>{const m=Math.max(1,...p.map(x=>x[1]));return `<div class="cd" style="margin-top:12px"><h2>${t}</h2>${p.length?p.map(x=>`<div class="br"><span>${esc(x[0])}</span><i><u style="width:${Math.round(x[1]/m*100)}%"></u></i><b>${x[1]}</b></div>`).join(""):'<div class="st">لا توجد بيانات.</div>'}</div>`};
const cnt=(a,f)=>{const m={};a.forEach(x=>{const k=f(x);if(k)m[k]=(m[k]||0)+1});return Object.entries(m).sort((x,y)=>y[1]-x[1])};
function statsH(L){const M=recs.filter(r=>isM(r.statusType)),I=recs.filter(r=>!isM(r.statusType)),band=p=>p<50?"30–49%":p<70?"50–69%":p<90?"70–89%":"90–100%",am={},mo=[];
 L.forEach(x=>(x.att||[]).forEach(t=>{const k=String(t).slice(0,7);am[k]=(am[k]||0)+1}));
 for(let i=11;i>=0;i--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);mo.push(d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"))}
 return `<div class="tl4"><div><b>${recs.length}</b>السجلات</div><div><b>${M.length}</b>الشهداء</div><div><b>${I.length}</b>المصابون</div><div><b>${L.length}</b>المستفيدون</div></div>`+bars("حسب الحالة",cnt(recs,r=>r.statusType))+bars("المستفيدون حسب محل النفوس",cnt(L,x=>x.district))+bars("المصابون حسب نسبة العجز",cnt(I.filter(r=>r.pct),r=>band(r.pct)).sort())+bars("صلة القرابة",cnt(L,x=>x.relation))+bars("تأييد الحضور (آخر 12 شهرًا)",mo.map(k=>[k,am[k]||0]))}
function missList(bs){const R=[],chk=(x,l,rid)=>{const p=[];if(!(x.photo&&x.photo.startsWith(JP)))p.push("الصورة الشخصية");if(!x.hf)p.push("الموحدة أمامي");if(!x.hb)p.push("الموحدة خلفي");BF.forEach(k=>{if(isReq(k)&&!x[k])p.push(LB[k])});CFd().forEach(f=>{if(isReq("cf_"+f.id)&&!(x.cf||{})[f.id])p.push(f.lb)});if(p.length)R.push([l,rid,p])};
 recs.forEach(r=>{if(isM(r.statusType)){if(!(r.bc||0)&&!r.beneficiary)R.push([r.personName,r.id,["لا يوجد مستفيد"]]);if(r.beneficiary)chk(r,r.personName+" ← "+r.beneficiary,r.id)}else chk(r,r.personName,r.id)});
 bs.forEach(x=>{const r=recs.find(y=>y.id===x.rid);chk(x,(r?r.personName:"")+" ← "+x.beneficiary,x.rid)});
 return R}
function missH(bs){const R=missList(bs);return `<div class="cd" style="margin-top:12px"><h2>⚠ سجلات ناقصة (${R.length})</h2>${R.slice(0,150).map(x=>`<div class="ev" data-a="gt" data-id="${esc(x[1])}" style="cursor:pointer"><div><b>${esc(x[0])}</b><div>${x[2].map(c=>`<span class="chip">${esc(c)}</span>`).join("")}</div></div><i>›</i></div>`).join("")||'<div class="st">✓ لا توجد نواقص.</div>'}</div>`}
async function purge(id,k,sil){if(!sil&&!ask("pg"+id,"اضغط مرة أخرى للحذف النهائي (لا رجعة فيه)."))return;const b=writeBatch(fs),im=i=>["f","b"].forEach(q=>b.delete(doc(fs,"images",i+"_"+q)));
 if(k==="b"){b.delete(doc(fs,"bens",id));im(id)}else{b.delete(doc(RC,id));im(id);(await getDocs(query(collection(fs,"bens"),where("rid","==",id)))).forEach(d=>{b.delete(d.ref);im(d.id)})}
 await b.commit();if(!sil){say("حُذف نهائيًا.",1);repTab("t")}}
async function restoreT(id,k){const b=writeBatch(fs);if(k==="b"){const x=(await getDoc(doc(fs,"bens",id))).data();b.update(doc(fs,"bens",id),{del:false});if(x&&recs.some(r=>r.id===x.rid))b.update(doc(RC,x.rid),{bc:increment(1)})}else b.update(doc(RC,id),{del:false});await b.commit();log("res","استعاد عنصرًا من المحذوفات");say("✓ تمت الاستعادة.",1);repTab("t")}
async function trashH(){const tb=(await getDocs(query(collection(fs,"bens"),where("del","==",true)))).docs.map(d=>({id:d.id,...d.data(),k:"b"})),tr=[...trR.map(x=>({...x,k:"r"})),...tb],old=tr.filter(x=>Date.now()-(x.dt||0)>30*864e5);
 for(const x of old)await purge(x.id,x.k,1);const L=tr.filter(x=>!old.includes(x)).sort((a,b)=>(b.dt||0)-(a.dt||0));
 return `<div class="cd" style="margin-top:12px"><h2>🗑 المحذوفات (تُمحى نهائيًا بعد 30 يومًا)</h2>${L.map(x=>`<div class="ev"><i>${x.k==="r"?"👤":"🧾"}</i><div><b>${esc(x.k==="r"?x.statusType+": "+x.personName:"مستفيد: "+x.beneficiary)}</b><small>بقي ${Math.max(0,30-Math.floor((Date.now()-(x.dt||0))/864e5))} يومًا</small></div><button class="b" data-a="rst" data-id="${esc(x.id)}" data-k="${x.k}">استعادة</button><button class="b del" data-a="pgr" data-id="${esc(x.id)}" data-k="${x.k}">حذف نهائي</button></div>`).join("")||'<div class="st">السلة فارغة.</div>'}</div>`}
async function repTab(k){document.querySelectorAll("#rp .tab").forEach(b=>b.classList.toggle("on",b.dataset.k===k));$("stb").innerHTML='<div class="st">جارٍ التحميل…</div>';
 try{const bs=k==="t"?[]:await allB();$("stb").innerHTML=k==="s"?statsH([...recs.filter(r=>!isM(r.statusType)||r.beneficiary),...bs]):k==="m"?missH(bs):await trashH()}catch(e){$("stb").innerHTML='<div class="st">'+esc(err(e))+'</div>'}}
const repOpen=()=>{$("rp").classList.remove("hidden");document.body.style.overflow="hidden";$("tbT").classList.toggle("hidden",!canD);repTab("s")},repClose=()=>{$("rp").classList.add("hidden");document.body.style.overflow="";missRefresh(1)};
async function stor(){try{const[i,r,b]=await Promise.all(["images","records","bens"].map(c=>getCountFromServer(collection(fs,c)))),n=i.data().count,mb=Math.round(n*.35+(r.data().count+b.data().count)*.04),p=Math.min(100,Math.round(mb/1024*100));
 $("sto").innerHTML=`<h2>💽 مساحة التخزين (تقدير)</h2><div class="gg"><u style="width:${p}%"></u></div><small>≈ ${mb} م.ب من 1024 م.ب (${p}%) · ${n} صورة موحدة${p>70?" — ⚠ اقتربت من الامتلاء، حمّل نسخة احتياطية":""}</small>`}catch{}}
function sgOpen(){$("sLk").value=LS("lockMin")||"0";$("sOff").checked=LS("offm")!=="0";$("sTh").value=LS("theme")||"auto";$("sBk").value=String(bkDays());$("sPn").value="";$("sgm").textContent="";$("sg").classList.remove("hidden")}
async function sgSave(){const m=$("sgm"),p=$("sPn").value.trim(),L=$("sLk").value;m.style.color="#c0574c";
 if(p&&!/^\d{4,6}$/.test(p))return m.textContent="الرمز من 4 إلى 6 أرقام فقط.";
 if(L!=="0"&&!p&&!hasPin())return m.textContent="عيّن رمز PIN أولًا لتفعيل القفل.";
 if(p){const s=crypto.randomUUID();localStorage.pin=JSON.stringify({u:me.id,s,n:p.length,h:await hsh(s,p)})}
 try{localStorage.lockMin=L;localStorage.offm=$("sOff").checked?"1":"0"}catch{}
 m.style.color="#3e8a55";m.textContent="✓ تم الحفظ. وضع الإنترنت يسري بعد إعادة فتح البرنامج.";bumpIdle();setTimeout(()=>$("sg").classList.add("hidden"),1500)}
let OFFT=0;const net=()=>{const o=navigator.onLine;$("dot").className="dot"+(o?" on":"");$("conn").textContent=o?"متصل ومتزامن":"بدون إنترنت — التغييرات تُحفظ على الجهاز وتُرسل عند الاتصال";if(!o)OFFT=OFFT||Date.now();else if(OFFT){const q=Math.round((Date.now()-OFFT)/1e3);OFFT=0;if(q>=5)rep("net","انقطع الاتصال "+(q>=90?Math.round(q/60)+" دقيقة":q+" ثانية"),"عاد الاتصال")}};
let cmS=null,cmK="p",cmD="";
const CMN={p:"الشخصية",f:"الموحدة الأمامي",b:"الموحدة الخلفي"};
function camStop(){if(cmS){cmS.getTracks().forEach(t=>t.stop());cmS=null}const v=$("cmv");if(v)v.srcObject=null}
function csel(k){cmK=k;document.querySelectorAll("#cm .tab").forEach(b=>b.classList.toggle("on",b.dataset.k===k))}
async function camStart(){camStop();const m=$("cmm");m.style.color="#c0574c";m.textContent="";
 try{if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw Error("المتصفح لا يدعم الكاميرا (يلزم اتصال آمن https).");
  const v={width:{ideal:1920},height:{ideal:1080}};if(cmD)v.deviceId={exact:cmD};else v.facingMode={ideal:"environment"};
  cmS=await navigator.mediaDevices.getUserMedia({video:v,audio:false});$("cmv").srcObject=cmS;
  const ds=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==="videoinput");
  $("cmd").innerHTML=ds.map((d,i)=>`<option value="${esc(d.deviceId)}">${esc(d.label||"كاميرا "+(i+1))}</option>`).join("");
  const cur=cmS.getVideoTracks()[0].getSettings().deviceId;if(cur)$("cmd").value=cur;$("cmd").parentElement.classList.toggle("hidden",ds.length<2)}
 catch(e){m.textContent=e.name==="NotAllowedError"?"لم تسمح للبرنامج باستخدام الكاميرا. فعّل الإذن من إعدادات المتصفح ثم أعد المحاولة.":e.name==="NotFoundError"?"لا توجد كاميرا على هذا الجهاز.":e.name==="NotReadableError"?"الكاميرا مشغولة ببرنامج آخر.":(e.message||"تعذر تشغيل الكاميرا.")}}
function camOpen(){$("cm").classList.remove("hidden");csel(cmK);camStart()}
function camClose(){camStop();$("cm").classList.add("hidden")}
async function camShot(){const v=$("cmv"),m=$("cmm");if(!cmS||!v.videoWidth){m.style.color="#c0574c";return m.textContent="انتظر حتى تظهر الصورة."}
 const c=document.createElement("canvas");c.width=v.videoWidth;c.height=v.videoHeight;c.getContext("2d").drawImage(v,0,0);
 const bl=await new Promise(r=>c.toBlob(r,"image/jpeg",.95)),k=cmK;m.style.color="#3e8a55";m.textContent="جارٍ معالجة الصورة…";
 pend[k]=await shrink(bl,k==="p"?TP:TC,k==="p"?38e3:45e4);setTile(k,pend[k]);onImg(k);m.textContent="✓ تم التقاط: "+CMN[k];if(k!=="b")csel(k==="p"?"f":"b")}
const SC="http://localhost:8765";let snK="f";
function snSel(k){snK=k;document.querySelectorAll("#sn .tab").forEach(b=>b.classList.toggle("on",b.dataset.k===k))}
async function snPing(){const m=$("snm");m.style.color="#c0574c";m.textContent="جارٍ فحص الاتصال بالسكنر…";
 try{const r=await fetch(SC+"/ping",{cache:"no-store"});if(!r.ok)throw 0;m.style.color="#3e8a55";m.textContent="✓ الاتصال جاهز. ضع المستند في السكنر ثم اضغط «مسح الآن»."}
 catch{m.textContent="البرنامج المساعد غير متصل. شغّل start-scanner.bat على الحاسوب (واترك نافذته مفتوحة) ثم اضغط «إعادة فحص الاتصال»."}}
function snOpen(){$("sn").classList.remove("hidden");snSel(snK);snPing()}
function cropBox(d,w,h,T){const E=Math.max(2,Math.round(Math.min(w,h)*.02)),R=[],G=[],B=[],sp=(X,Y)=>{const p=(Y*w+X)*4;R.push(d[p]);G.push(d[p+1]);B.push(d[p+2])};
 for(let X=0;X<w;X+=3)for(let k=0;k<E;k++){sp(X,k);sp(X,h-1-k)}for(let Y=0;Y<h;Y+=3)for(let k=0;k<E;k++){sp(k,Y);sp(w-1-k,Y)}
 const md=a=>{a.sort((p,q)=>p-q);return a[a.length>>1]},br=md(R),bg=md(G),bb=md(B),rc=new Uint32Array(h),cc=new Uint32Array(w);
 for(let Y=E;Y<h-E;Y++)for(let X=E;X<w-E;X++){const p=(Y*w+X)*4;if(Math.max(Math.abs(d[p]-br),Math.abs(d[p+1]-bg),Math.abs(d[p+2]-bb))>T){rc[Y]++;cc[X]++}}
 const tr=Math.max(2,w*.006),tc=Math.max(2,h*.006);let x0=-1,x1=-1,y0=-1,y1=-1;
 for(let Y=0;Y<h;Y++)if(rc[Y]>tr){if(y0<0)y0=Y;y1=Y}
 for(let X=0;X<w;X++)if(cc[X]>tc){if(x0<0)x0=X;x1=X}
 if(x0<0||y0<0)return null;const ar=(x1-x0+1)*(y1-y0+1);if(ar<w*h*.04||ar>w*h*.985)return null;
 if(x0<=E+1)x0=0;if(y0<=E+1)y0=0;if(x1>=w-E-2)x1=w-1;if(y1>=h-E-2)y1=h-1;
 const L=(X,Y)=>{const p=(Y*w+X)*4;return(d[p]+d[p+1]+d[p+2])/3},cl=X=>{let s=0,n=0;for(let Y=y0;Y<=y1;Y+=2){s+=L(X,Y);n++}return s/n},rl=Y=>{let s=0,n=0;for(let X=x0;X<=x1;X+=2){s+=L(X,Y);n++}return s/n};
 const ox0=x0,ox1=x1,oy0=y0,oy1=y1;
 while(x0<x1-10&&cl(x0)<75)x0++;while(x1>x0+10&&cl(x1)<75)x1--;while(y0<y1-10&&rl(y0)<75)y0++;while(y1>y0+10&&rl(y1)<75)y1--;
 if(x0-ox0>(ox1-ox0)*.4)x0=ox0;if(ox1-x1>(ox1-ox0)*.4)x1=ox1;if(y0-oy0>(oy1-oy0)*.4)y0=oy0;if(oy1-y1>(oy1-oy0)*.4)y1=oy1;
 return[x0,y0,x1,y1]}
async function autoCrop(bl,T){const u=URL.createObjectURL(bl),i=await new Promise((ok,no)=>{const m=new Image();m.onload=()=>ok(m);m.onerror=()=>no(Error("صورة غير صالحة"));m.src=u});URL.revokeObjectURL(u);
 const s=Math.min(1,800/Math.max(i.width,i.height)),w=Math.round(i.width*s),h=Math.round(i.height*s),c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d",{willReadFrequently:true});x.drawImage(i,0,0,w,h);
 const bx=cropBox(x.getImageData(0,0,w,h).data,w,h,T);if(!bx)return bl;
 const pd=Math.round(.012*Math.max(i.width,i.height)),sx=Math.max(0,Math.round(bx[0]/s)-pd),sy=Math.max(0,Math.round(bx[1]/s)-pd),ex=Math.min(i.width,Math.round((bx[2]+1)/s)+pd),ey=Math.min(i.height,Math.round((bx[3]+1)/s)+pd),o=document.createElement("canvas");o.width=ex-sx;o.height=ey-sy;o.getContext("2d").drawImage(i,sx,sy,o.width,o.height,0,0,o.width,o.height);
 return new Promise(r=>o.toBlob(r,"image/jpeg",.95))}
async function snScan(){const m=$("snm"),k=snK;m.style.color="#3e8a55";m.textContent="جارٍ المسح… قد تظهر نافذة الماسح على الحاسوب.";
 try{const r=await fetch(SC+"/scan?dpi="+$("snD").value+"&color="+$("snC").value+"&area="+$("snR").value+"&ui="+$("snU").value);const inf=r.headers.get("X-Scan-Info")||"";if(!r.ok)throw Error((await r.text())||"فشل المسح.");let bl=await r.blob();const T=+$("snT").value;if(T>0)bl=await autoCrop(bl,T);
  pend[k]=await shrink(bl,k==="p"?TP:TC,k==="p"?38e3:45e4);setTile(k,pend[k]);onImg(k);const mm=inf.match(/got=(\d+)x(\d+);want=(\d+)x(\d+)/);let ex="";if(mm){const gw=+mm[1],gh=+mm[2],ww=+mm[3],wh=+mm[4];ex=" — المقاس الخام "+gw+"×"+gh;if(ww&&wh&&(gw<ww*.9||gh<wh*.9)){ex+=" ⚠ أصغر من المطلوب ("+ww+"×"+wh+")، جرّب «عبر نافذة ويندوز».";m.style.color="#c9a24d"}}m.textContent="✓ تم مسح: "+CMN[k]+ex+(k==="f"?" — اقلب البطاقة وامسح الوجه الخلفي.":"");if(k==="f")snSel("b")}
 catch(e){m.style.color="#c0574c";m.textContent=e.name==="TypeError"?"تعذّر الاتصال بالبرنامج المساعد. شغّل start-scanner.bat ثم اضغط «إعادة فحص الاتصال».":(e.message||"فشل المسح.")}}
/* ===== القراءة الآلية للموحدة (تعمل داخل المتصفح ولا ترسل الصور لأي جهة) ===== */
const AD=s=>String(s).replace(/[٠-٩]/g,c=>c.charCodeAt(0)-1632).replace(/[۰-۹]/g,c=>c.charCodeAt(0)-1776);
const KMAP={"ک":"ك","ی":"ي","پ":"ب","گ":"ك","چ":"ج","ڤ":"ف","ە":"ه","ۆ":"و","ێ":"ي","ڕ":"ر","ڵ":"ل","ہ":"ه","ھ":"ه","ۇ":"و"};
const NR=s=>String(s).replace(/[کیپگچڤەۆێڕڵہھۇ]/g,c=>KMAP[c]).replace(/[\u064B-\u065F\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^\u0621-\u064A]/g,"");
const KU=new Set(["ناو","باوک","باپیر","نازناو","دایک","ڕەگەز","ناوی","باب"].map(NR));
function nidScores(texts){const c={};for(const t of texts)for(const m of AD(t).matchAll(/\d{12,}/g)){const s=m[0];if(s.length===12)c[s]=(c[s]||0)+1;else{const p=s.slice(0,12),q=s.slice(-12);c[p]=(c[p]||0)+.4;c[q]=(c[q]||0)+.4}}return Object.entries(c).sort((x,y)=>y[1]-x[1])}
const pickNid=t=>{const e=nidScores(t);return e.length?e[0][0]:""};
function parseDates(texts){const S=new Set(),yr=new Date().getFullYear();for(const t of texts)for(const m of AD(t).matchAll(/(19\d{2}|20\d{2})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.1]\s*(\d{1,2})/g)){const y=+m[1],mo=+m[2],d=+m[3];if(mo>=1&&mo<=12&&d>=1&&d<=31&&y<=yr+15)S.add(y+"-"+String(mo).padStart(2,"0")+"-"+String(d).padStart(2,"0"))}return[...S].sort()}
const mzv=c=>c==="<"?0:/\d/.test(c)?+c:c.charCodeAt(0)-55,mzc=s=>{const w=[7,3,1];let t=0;for(let i=0;i<s.length;i++)t+=mzv(s[i])*w[i%3];return t%10},mzfix=s=>s.replace(/O/g,"0").replace(/[IL]/g,"1").replace(/S/g,"5").replace(/B/g,"8").replace(/Z/g,"2");
function parseMrz(texts){const yy0=new Date().getFullYear()%100,R={},L=[];
 for(const t of texts)for(const ln of String(t).toUpperCase().split("\n")){const s=ln.replace(/[^A-Z0-9<]/g,"");if(s.length>=15)L.push(s)}
 for(const s of L){if(R.date)break;const m=s.match(/([0-9OILSBZ]{6})([0-9OILSBZ])([MFK<])([0-9OILSBZ]{6})([0-9OILSBZ])[I1L]{0,2}RQ/);if(!m)continue;const b=mzfix(m[1]),yy=+b.slice(0,2),mm=+b.slice(2,4),dd=+b.slice(4,6);if(mm<1||mm>12||dd<1||dd>31)continue;R.date=(yy>yy0?1900+yy:2000+yy)+"-"+b.slice(2,4)+"-"+b.slice(4,6);R.ok=mzc(b)===+mzfix(m[2])}
 for(const s of L){if(R.nid)break;const m=s.match(/IRQ([A-Z0-9]{9})([0-9OILSBZ])([0-9OILSBZ]{12})/);if(!m)continue;R.nid=mzfix(m[3]);R.docOk=mzc(m[1])===+mzfix(m[2])}
 return R.date||R.nid?R:null}
function chooseDob(dates,mrz){if(mrz&&mrz.date){if(dates.includes(mrz.date))return{d:mrz.date,s:"تطابق مع الشريط السفلي"};if(mrz.ok)return{d:mrz.date,s:"من الشريط السفلي"}}
 if(dates.length>=3)return{d:dates[0],s:"أقدم تاريخ على البطاقة"};
 if(dates.length===2){const dy=(new Date(dates[1])-new Date(dates[0]))/31557600000;if(!(dy>9&&dy<11))return{d:dates[0],s:"أقدم تاريخ"}}
 if(mrz&&mrz.date)return{d:mrz.date,s:"من الشريط السفلي (غير مؤكد)"};return null}
function tsvWords(t){return String(t||"").split("\n").map(l=>l.split("\t")).filter(c=>c.length>=12&&c[0]==="5"&&c.slice(11).join("").trim()).map(c=>({l:+c[6],t:+c[7],w:+c[8],h:+c[9],s:c.slice(11).join("\t").trim()}))}
const lev=(p,q)=>{const d=Array.from({length:p.length+1},(_,i)=>[i]);for(let j=1;j<=q.length;j++)d[0][j]=j;for(let i=1;i<=p.length;i++)for(let j=1;j<=q.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(p[i-1]===q[j-1]?0:1));return d[p.length][q.length]};
const isKu=n=>n.length<=6&&[...KU].some(k=>lev(n,k)<=1);
function findNames(W){const L={n:"الاسم",f:"الاب",g:"الجد"},v={};
 for(const k in L){const lb=W.filter(w=>NR(w.s)===L[k]).sort((p,q)=>p.t-q.t)[0];if(!lb)continue;const cy=lb.t+lb.h/2;
  const row=W.filter(w=>w!==lb&&w.l<lb.l&&Math.abs(w.t+w.h/2-cy)<lb.h*.8).sort((p,q)=>q.l-p.l);
  const ci=row.reduce((a,w,i)=>/[:：]/.test(w.s)?i:a,-1);let vals;
  if(ci>=0){vals=row.slice(ci+1);const b=row[ci].s.replace(/[:：]/g,"").trim(),n=NR(b);if(n.length>=2&&!isKu(n))vals=[{...row[ci],s:b},...vals]}
  else vals=row.filter(w=>!isKu(NR(w.s)));
  const r=[];for(const w of vals){const n=NR(w.s);if(n.length<2)continue;if(r.length&&r[r.length-1].l-(w.l+w.w)>r[r.length-1].h*1.3)break;r.push(w);if(r.length>=2)break}
  if(r.length)v[k]=r.map(w=>NR(w.s)).join(" ")}
 return["n","f","g"].map(k=>v[k]).filter(Boolean).join(" ")}
let OCRE=null,OCRA=null,OCRB=0,OCRQ=[],OCRN=null;
const ocrU=p=>new URL(p,location.href).href;
let OCRL="";
const OCRS={"loading tesseract core":"تحميل المحرك","initializing tesseract":"تهيئة المحرك","loading language traineddata":"تحميل بيانات اللغة","loaded language traineddata":"تم تحميل اللغة","initializing api":"تهيئة القراءة","initialized api":"جاهز","recognizing text":"قراءة النص"};
let OCRT=null,OCRP="";
const ocrLog=m=>{OCRL=(OCRS[m.status]||m.status)+(m.progress!=null?" "+Math.round(m.progress*100)+"%":"");const el=OCRT||$("ocrm");if(OCRB&&el)el.textContent="🔎 "+OCRP+OCRL+" …"};
const tmo=(p,ms,what)=>{let t;return Promise.race([p,new Promise((_,no)=>{t=setTimeout(()=>no(Error("انتهت المهلة أثناء "+what+(OCRL?" (آخر مرحلة: "+OCRL+")":""))),ms)})]).finally(()=>clearTimeout(t))};
const OCRF=["tesseract.min.js","worker.min.js","tesseract-core-simd-lstm.wasm.js","tesseract-core-lstm.wasm.js","lang/eng.traineddata","lang/ara.traineddata"];
async function ocrCheck(){const bad=[];for(const f of OCRF){try{const r=await fetch(ocrU("ocr/"+f),{method:"HEAD",cache:"no-store"});if(!r.ok)bad.push(f+" ("+r.status+")")}catch{bad.push(f+" (تعذّر الوصول)")}}return bad}
async function ocrW(lang){OCRL="";
 if(!window.Tesseract)await tmo(new Promise((ok,no)=>{const s=document.createElement("script");s.src="ocr/tesseract.min.js";s.onload=ok;s.onerror=()=>no(Error("ملف ocr/tesseract.min.js غير موجود في GitHub."));document.head.appendChild(s)}),30000,"تحميل المكتبة");
 let last;for(const core of["tesseract-core-simd-lstm.wasm.js","tesseract-core-lstm.wasm.js"]){OCRL="";try{return await tmo(Tesseract.createWorker(lang,1,{workerPath:ocrU("ocr/worker.min.js"),corePath:ocrU("ocr/"+core),langPath:ocrU("ocr/lang"),gzip:false,workerBlobURL:false,cacheMethod:"none",logger:ocrLog}),120000,"تهيئة محرك "+lang)}catch(e){last=e}}throw last}
async function ocrPrep(src,rot){const i0=await new Promise((ok,no)=>{const m=new Image();m.onload=()=>ok(m);m.onerror=()=>no(Error("صورة غير صالحة"));m.src=src}),i=rot?rotImg(i0,rot):i0,q=Math.min(1,800/Math.max(i.width,i.height)),sw=Math.round(i.width*q),sh=Math.round(i.height*q),sc=document.createElement("canvas");sc.width=sw;sc.height=sh;const sx=sc.getContext("2d",{willReadFrequently:true});sx.drawImage(i,0,0,sw,sh);
 const bx=cropBox(sx.getImageData(0,0,sw,sh).data,sw,sh,24);let X=0,Y=0,W=i.width,H=i.height;if(bx){X=Math.round(bx[0]/q);Y=Math.round(bx[1]/q);W=Math.round((bx[2]-bx[0]+1)/q);H=Math.round((bx[3]-bx[1]+1)/q)}
 const s=Math.min(4,Math.max(1,2200/W),Math.sqrt(14e6/(W*H))),c=document.createElement("canvas");c.width=Math.round(W*s);c.height=Math.round(H*s);const x=c.getContext("2d",{willReadFrequently:true});x.imageSmoothingQuality="high";x.drawImage(i,X,Y,W,H,0,0,c.width,c.height);
 const d=x.getImageData(0,0,c.width,c.height),p=d.data,hist=new Uint32Array(256);for(let j=0;j<p.length;j+=4){const g=Math.round(p[j]*.3+p[j+1]*.59+p[j+2]*.11);p[j]=p[j+1]=p[j+2]=g;hist[g]++}
 const tot=p.length/4;let lo=0,hi=255,a=0;for(let j=0;j<256;j++){a+=hist[j];if(a>tot*.01){lo=j;break}}a=0;for(let j=255;j>=0;j--){a+=hist[j];if(a>tot*.01){hi=j;break}}const k=hi>lo?255/(hi-lo):1;
 for(let j=0;j<p.length;j+=4){const v=Math.max(0,Math.min(255,(p[j]-lo)*k));p[j]=p[j+1]=p[j+2]=v}x.putImageData(d,0,0);return on("enh")?deskew(c):c}
function ocrBin(c){const w=c.width,h=c.height,d=c.getContext("2d",{willReadFrequently:true}).getImageData(0,0,w,h),p=d.data,I=new Float64Array((w+1)*(h+1));
 for(let y=0;y<h;y++){let r=0;for(let X=0;X<w;X++){r+=p[(y*w+X)*4];I[(y+1)*(w+1)+X+1]=I[y*(w+1)+X+1]+r}}
 const R=Math.max(12,Math.round(w/60)),o=document.createElement("canvas");o.width=w;o.height=h;const ox=o.getContext("2d"),od=ox.createImageData(w,h);
 for(let y=0;y<h;y++){const y0=Math.max(0,y-R),y1=Math.min(h,y+R+1);for(let X=0;X<w;X++){const x0=Math.max(0,X-R),x1=Math.min(w,X+R+1),m=(I[y1*(w+1)+x1]-I[y0*(w+1)+x1]-I[y1*(w+1)+x0]+I[y0*(w+1)+x0])/((x1-x0)*(y1-y0)),k=(y*w+X)*4,v=p[k]<m*.88?0:255;od.data[k]=od.data[k+1]=od.data[k+2]=v;od.data[k+3]=255}}
 ox.putImageData(od,0,0);return o}
async function ocrPass(w,cv,rois,par){await tmo(w.setParameters(par),30000,"ضبط المحرك");const out=[];for(const r of rois){const o=r?{rectangle:{left:Math.round(r[0]*cv.width),top:Math.round(r[1]*cv.height),width:Math.round(r[2]*cv.width),height:Math.round(r[3]*cv.height)}}:{};const{data}=await tmo(w.recognize(cv,o,{text:true,tsv:true}),90000,"قراءة الصورة");out.push(data)}return out}
const DG={tessedit_char_whitelist:"0123456789",tessedit_pageseg_mode:"6"},DT={tessedit_char_whitelist:"0123456789/-.",tessedit_pageseg_mode:"6"},MZ={tessedit_char_whitelist:"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<",tessedit_pageseg_mode:"6"},NM={tessedit_char_whitelist:"",tessedit_pageseg_mode:"11"};
function ocrSet(id,v){const el=$(id);if(el.value&&!el.classList.contains("ocr"))return false;el.value=v;el.classList.add("ocr");return true}
/* v21: قراءة الوجه الأمامي — الرقم من السطر العريض بقراءة متفرّقة، والاسم من ثلاثة أسطر مقصوصة بالنسبة لموضع الرقم */
const tsvW=t=>String(t||"").split("\n").map(l=>l.split("\t")).filter(c=>c.length>=12&&c[0]==="5"&&c.slice(11).join("").trim()).map(c=>({l:+c[6],t:+c[7],w:+c[8],h:+c[9],c:+c[10],s:c.slice(11).join("\t").trim()}));
const DFIX=s=>AD(s).replace(/[Oo]/g,"0").replace(/[Il|!]/g,"1").replace(/S/g,"5").replace(/B/g,"8").replace(/Z/g,"2");
function nidCands(W){const o=[],bn=s=>/^(19|20)/.test(s)?1:.6,D=[];
 for(const w of W){const a=AD(w.s),z=DFIX(w.s);if(/^\d{3,}$/.test(z)&&(a.match(/\d/g)||[]).length>=z.length*.6)D.push({w,z})}
 for(const{w,z}of D){if(z.length===12)o.push({s:z,c:w.c*bn(z),b:w});else if(z.length>12)for(const s of[z.slice(0,12),z.slice(-12)])o.push({s,c:w.c*.4*bn(s),b:w})}
 for(const a of D){const line=D.filter(x=>Math.abs(x.w.t+x.w.h/2-(a.w.t+a.w.h/2))<a.w.h*.6&&x.w.l>=a.w.l).sort((p,q)=>p.w.l-q.w.l);let s="",cs=0,n=0,R=0,T=1e9,B=0;
  for(const x of line){if(n&&x.w.l-R>a.w.h*1.5)break;s+=x.z;cs+=x.w.c;n++;R=x.w.l+x.w.w;T=Math.min(T,x.w.t);B=Math.max(B,x.w.t+x.w.h);if(s.length>=12)break}
  if(n>1&&s.length===12)o.push({s,c:cs/n*.85*bn(s),b:{l:a.w.l,t:T,w:R-a.w.l,h:B-T}})}
 return o}
function crop(src,x0,y0,x1,y1,k,m){m=m==null?20:m;x0=Math.max(0,Math.round(x0));y0=Math.max(0,Math.round(y0));x1=Math.min(src.width,Math.round(x1));y1=Math.min(src.height,Math.round(y1));const w=Math.max(1,x1-x0),h=Math.max(1,y1-y0),c=document.createElement("canvas");c.width=Math.round(w*k)+2*m;c.height=Math.round(h*k)+2*m;const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.imageSmoothingQuality="high";x.drawImage(src,x0,y0,w,h,m,m,Math.round(w*k),Math.round(h*k));return c}
function nameGeos(cv,box,card){const G=[],W=cv.width,H=cv.height;
 if(box&&!card){const R=box.l+box.w,w=box.w,cy=box.t+box.h/2;for(const[dx,dy]of[[0,0],[.02,0],[0,.03],[0,-.03]])G.push([0,1,2].map(i=>{const rc=cy+(.324+.167*i+dy)*w;return[R+(-.2+dx)*w,rc-.1*w,R+(.44+dx)*w,rc+.1*w]}))}
 if(card)for(const[dx,dy]of[[0,0],[-.015,0],[.012,.015]])G.push([0,1,2].map(i=>{const rc=(.441+.0695*i+dy)*H;return[(.585+dx)*W,rc-.04*H,(.752+dx)*W,rc+.04*H]}));
 return G}
function rowName(d){const toks=[];for(const w of tsvW(d.tsv).sort((p,q)=>q.l-p.l))for(const p of w.s.split(/\s+/)){const n=NR(p);if(n.length>=2&&n.length<=12&&!isKu(n))toks.push({n,c:w.c})}
 return toks.length?{s:toks.map(x=>x.n).join(" "),c:toks.reduce((a,x)=>a+x.c,0)/toks.length}:null}
async function ocrNames(cv,box,bn){const A=OCRA=OCRA||await ocrW("ara");await tmo(A.setParameters({tessedit_char_whitelist:"",tessedit_pageseg_mode:"7"}),30000,"ضبط المحرك");
 const V=[[],[],[]];const rd=async c=>(await tmo(A.recognize(c,{},{text:true,tsv:true}),90000,"قراءة الاسم")).data;
 const run=async geos=>{for(const g of geos)for(let i=0;i<3;i++){const[a,b,c,d]=g[i];for(const S of[cv,bn]){try{const r=rowName(await rd(crop(S,a,b,c,d,1)));if(r)V[i].push(r)}catch(e){if(/المهلة/.test(e.message))throw e}}}};
 const pick=()=>V.map(L=>{const m={};for(const r of L){const o=m[r.s]||(m[r.s]={s:r.s,sum:0,n:0});o.sum+=r.c/100;o.n++}const e=Object.values(m).sort((p,q)=>q.sum-p.sum)[0];return e?{s:e.s,c:e.sum/e.n*100,n:e.n,all:L.length}:null});
 const ok=P=>P.every(p=>p&&p.c>=45);
 if(box)await run(nameGeos(cv,box,false));let P=pick();
 if(!ok(P)){await run(nameGeos(cv,box,true));P=pick()}
 const rows=P.filter(p=>p&&p.c>=35);
 return{nm:rows.map(p=>p.s).join(" "),nc:rows.length?Math.min(...rows.map(p=>p.c))*(rows.length<3?.8:1):0,raw:P.map(p=>p?p.s+"("+Math.round(p.c)+")":"؟").join(" | ")}}
async function ocrFront(cv){const E=OCRE=OCRE||await ocrW("eng"),sc={},bx={};
 const add=W=>{for(const c of nidCands(W)){sc[c.s]=(sc[c.s]||0)+c.c/100;if(!bx[c.s]||c.c>bx[c.s].c)bx[c.s]={c:c.c,b:c.b}}},top=()=>Object.entries(sc).sort((p,q)=>q[1]-p[1])[0];
 const rd=async c=>(await tmo(E.recognize(c,{},{text:true,tsv:true}),90000,"قراءة الرقم")).data;
 await tmo(E.setParameters({tessedit_char_whitelist:"",tessedit_pageseg_mode:"11"}),30000,"ضبط المحرك");
 add(tsvW((await rd(cv)).tsv));let t=top();const bn=ocrBin(cv);
 if(!t||t[1]<.8){add(tsvW((await rd(bn)).tsv));t=top()}
 let id="",box=null;
 if(t){id=t[0];box=bx[id].b;
  try{const pd=Math.round(box.h*.35),c=crop(cv,box.l-pd*2,box.t-pd,box.l+box.w+pd*2,box.t+box.h+pd,1.5);await tmo(E.setParameters({tessedit_char_whitelist:"0123456789",tessedit_pageseg_mode:"7"}),30000,"ضبط المحرك");const r=AD((await rd(c)).text||"").replace(/\D/g,"");if(r.length===12){sc[r]=(sc[r]||0)+.8;t=top();id=t[0];if(bx[id])box=bx[id].b}}catch{}}
 let nm="",nc=0,raw="",ne="";
 try{const r=await ocrNames(cv,box,bn);nm=r.nm;nc=r.nc;raw=r.raw}catch(x){ne=x.message}
 return{id,nm,nc,raw,ne}}
async function ocrBack(cv){const E=OCRE=OCRE||await ocrW("eng");let dsAll=[],M=null;
 for(const st of["gray","bin"]){const c=st==="gray"?cv:ocrBin(cv);
  const full=(await ocrPass(E,c,[null],{tessedit_char_whitelist:"",tessedit_pageseg_mode:"6"})).map(d=>d.text),dt=(await ocrPass(E,c,[[0,.05,1,.38],[0,.2,1,.38],[0,.35,1,.38]],DT)).map(d=>d.text),mz=(await ocrPass(E,c,[[0,.5,1,.5],[0,.65,1,.35]],MZ)).map(d=>d.text);
  dsAll=[...new Set([...dsAll,...parseDates([...full,...dt])])].sort();M=parseMrz([...full,...mz])||M;const r=chooseDob(dsAll,M);if(r)return{r,M,ds:dsAll}}
 return{r:null,M,ds:dsAll}}
async function ocrRun(k){if(OCRB){OCRQ.push(k);return}const src=pend[k],m=$("ocrm");if(!src)return;OCRB=1;m.style.color="#3e8a55";m.textContent="🔎 جارٍ قراءة البطاقة… قد يستغرق أول مرة نصف دقيقة.";
 try{const msg=[],rots=await rotsFor(src);let res=null,used=0;
  for(const rt of rots){OCRP=rt?"(تدوير "+rt+"°) ":"";const cv=await ocrPrep(src,rt);res=k==="f"?await ocrFront(cv):await ocrBack(cv);used=rt;if(k==="f"?(res.id||res.nm):(res.r||res.M))break}
  OCRP="";if(used)msg.push("صُحّح اتجاه الصورة ("+used+"°)");
  if(k==="f"){const{id:id0,nm:nm0,nc,raw,ne}=res;let id=id0,nm=nm0;if(OCRN&&OCRN.ok&&OCRN.nid&&id!==OCRN.nid){msg.push("صُحّح الرقم من الشريط السفلي");id=OCRN.nid}
   if(id&&ocrSet("unified",id)){msg.push("الرقم "+id);const x=dupU(id);if(x)msg.push("⚠ الرقم مسجّل لـ «"+x.personName+"»")}else if(!id)msg.push("تعذّر قراءة رقم الموحدة");
   if(nm&&nc>=40){const L=learnApply(nm),rw=nm;nm=L.nm;if(ocrSet("beneficiary",nm)){OCRV.b=rw;msg.push("الاسم «"+nm+"»"+(nc<65?" (غير مؤكد — راجعه)":"")+(L.ch.length?" — تصحيح متعلَّم: "+L.ch.map(c=>c[0]+"←"+c[1]).join("، "):""))}}else msg.push("تعذّر قراءة الاسم"+(ne?" ("+ne+")":"")+(raw?" — المقروء: "+raw:""))}
  else{const{r,M,ds}=res;
   if(r&&ocrSet("birthDate",r.d))msg.push("تاريخ الميلاد "+r.d+" ("+r.s+")");else if(!r)msg.push("تعذّر قراءة تاريخ الميلاد (التواريخ المقروءة: "+(ds.join("، ")||"لا شيء")+" — الشريط السفلي: "+(M&&M.date?"مقروء":"غير مقروء")+")");
   if(M&&M.nid){OCRN={nid:M.nid,ok:M.docOk};const u=$("unified");if(M.docOk&&u.value&&u.value!==M.nid&&u.classList.contains("ocr")){u.value=M.nid;msg.push("صُحّح رقم الموحدة من الشريط السفلي")}else if(u.value&&u.value!==M.nid&&!u.classList.contains("ocr"))msg.push("⚠ الرقم المكتوب يخالف الشريط السفلي ("+M.nid+")");else if(!u.value&&M.docOk&&ocrSet("unified",M.nid))msg.push("الرقم "+M.nid+" (من الشريط السفلي)")}}
  m.style.color=msg.some(x=>x.startsWith("تعذّر")||x.startsWith("⚠"))?"#c9a24d":"#3e8a55";m.textContent="🔎 "+msg.join(" — ")+". راجع الحقول المظللة قبل الحفظ."}
 catch(e){OCRB=0;OCRP="";const bad=await ocrCheck().catch(()=>[]);m.style.color="#c0574c";m.textContent=(e.message||"تعذرت القراءة الآلية.")+(bad.length?" — ملفات ناقصة في GitHub: "+bad.join("، "):" — ملفات المحرك موجودة.");rep("ocr",e.message||"تعذرت القراءة الآلية","قراءة بطاقة");OCRE=null;OCRA=null}
 finally{OCRB=0;if(OCRQ.length)ocrRun(OCRQ.shift())}}
const onImg=k=>{if((k==="f"||k==="b")&&$("ocrOn").checked)ocrRun(k)};
["unified","beneficiary","birthDate"].forEach(i=>$(i).addEventListener("input",()=>$(i).classList.remove("ocr")));
async function pws(){const o=$("pw0").value,n=$("pw1").value,c=$("pw2").value,m=$("pwm");m.style.color="#c0574c";
 if(n.length<8)return m.textContent="كلمة السر الجديدة 8 أحرف على الأقل.";if(n!==c)return m.textContent="كلمتا السر غير متطابقتين.";if(n===o)return m.textContent="اختر كلمة مختلفة عن الحالية.";
 try{const u=auth.currentUser;await reauthenticateWithCredential(u,EmailAuthProvider.credential(u.email,o));await updatePassword(u,n);["pw0","pw1","pw2"].forEach(i=>$(i).value="");m.style.color="#3e8a55";m.textContent="✓ تم تغيير كلمة السر.";setTimeout(()=>$("pw").classList.add("hidden"),1500)}catch(e){m.textContent=err(e)}}
function ask(k,m){if(armed[k]&&Date.now()-armed[k]<5000){delete armed[k];return true}armed[k]=Date.now();say(m);return false}
const guard=(fn,n)=>fn().catch(e=>{say(err(e)+(n&&e&&e.code==="permission-denied"?" ["+n+"]":""));const m=err(e||{});rep(e&&e.code==="permission-denied"?"perm":/صورة|الصورة|كاميرا|سكنر|المسح/.test(m)?"img":"op",m,n||"")});
// ضغط الصورة وإعادة ترميزها (يحذف بيانات EXIF/الموقع)
const TP=[[260,.82],[220,.7],[180,.6]],TC=[[1600,.86],[1600,.78],[1400,.78],[1400,.7],[1200,.7],[1100,.62]];
const shrink=(f,T,lim)=>new Promise((ok,no)=>{const u=URL.createObjectURL(f),i=new Image();i.onerror=()=>no(Error("صورة غير صالحة"));i.onload=()=>{URL.revokeObjectURL(u);let c,last=0;for(const[m,q]of T){if(m!==last){const k=Math.min(1,m/Math.max(i.width,i.height));c=document.createElement("canvas");c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);const x=c.getContext("2d");x.imageSmoothingQuality="high";x.drawImage(i,0,0,c.width,c.height);last=m}const d=c.toDataURL("image/jpeg",q);if(d.length<=lim)return ok(d)}no(Error("الصورة كبيرة جدًا، جرّب صورة أخرى."))};i.src=u});
function setTile(k,src,saved){const t=$("t_"+k);t.querySelector("img")?.remove();t.firstChild.textContent=saved?"✓ محفوظة – اختر لتغييرها":TL[k];t.classList.toggle("ok",!!(src||saved));if(src){const i=new Image();i.src=src;t.prepend(i)}}
const RF=["personName","statusType"],BF=["beneficiary","relation","unified","district","birthDate","attendanceDate"];
const ST={"شهيد":"اسم الشهيد","شهيدة":"اسم الشهيدة","مصاب":"اسم المصاب","مصابه":"اسم المصابة"},IC=new Map();
const isM=s=>s==="شهيد"||s==="شهيدة",isI=s=>s==="مصاب"||s==="مصابه";
function layout(){const st=$("statusType").value,rr=sel?recs.find(x=>x.id===sel):null;
 $("pctW").classList.toggle("hidden",!isI(st));$("sBen").classList.toggle("hidden",!!rr&&isM(st)&&!rr.beneficiary);
 $("personName").disabled=$("statusType").disabled=!!tgt}
function clear(){[...RF,...BF,"pct"].forEach(k=>{$(k).value="";$(k).classList.remove("bad","ocr")});pend={};OCRV={};cfSet(null);sel=selB=tgt=null;ou="";ob=null;["p","f","b"].forEach(k=>setTile(k));$("addB").classList.remove("hidden");$("edtB").classList.add("hidden");$("ft").textContent="إضافة سجل جديد";layout();render();simShow()}
function putImgs(b,id,o){for(const k of["f","b"])if(pend[k]){o["h"+k]=true;b.set(doc(fs,"images",id+"_"+k),{rid:id,d:pend[k]});IC.delete(id+"_"+k)}if(pend.p)o.photo=pend.p}
async function save(){
 const st=val("statusType"),m=isM(st),inj=isI(st),rr=sel?recs.find(x=>x.id===sel):null,flat=rr?(!m||!!rr.beneficiary):true;
 const cfk=CFd().map(f=>"cf_"+f.id),req=[...(tgt?[]:RF),...(tgt||flat?BF.filter(isReq):[]),...(!tgt&&inj&&isReq("pct")?["pct"]:[]),...(tgt||flat?cfk.filter(k=>isReq(k)&&cfVisK(k)):[])];
 [...RF,...BF,"pct",...cfk].forEach(k=>$(k).classList.remove("bad"));const miss=req.filter(k=>!val(k));
 if(miss.length){miss.forEach(k=>$(k).classList.add("bad"));return say("أكمل الحقول: "+miss.map(lbl).join("، "))}
 const bnk=cfk.find(k=>cfT(k)==="number"&&cfVisK(k)&&val(k)&&isNaN(+val(k).replace(/,/g,"")));if(bnk){$(bnk).classList.add("bad");return say("الحقل «"+lbl(bnk)+"» يقبل أرقامًا فقط.")}
 const d={};[...RF,...BF].forEach(k=>d[k]=val(k));d.cf=cfGet(selB?ob:rr);
 const du=dupU(d.unified);if(du&&d.unified!==ou&&!ask("du","⚠ رقم الموحدة مسجّل مسبقًا لـ «"+du.personName+"». اضغط مرة أخرى للمتابعة."))return;
 if(on("fuzzy")&&!sel&&!selB){const bk0=norm(d.beneficiary),sp=!tgt?sims(d.personName,"p").filter(x=>x.d>0||!m||norm(x.n)!==norm(d.personName)):[],sb=sims(d.beneficiary,"b").filter(x=>x.d>0||norm(x.n)!==bk0);if((sp.length||sb.length)&&!ask("sim","⚠ أسماء مشابهة مسجّلة: "+[...sp,...sb].slice(0,3).map(x=>"«"+x.n+"»").join("، ")+". اضغط مرة أخرى إن كان شخصًا مختلفًا."))return}
 const bk=norm(d.beneficiary),now=Date.now(),b=writeBatch(fs),mk=o=>{BF.forEach(k=>o[k]=d[k]);o.benKey=bk;if(CFd().length)o.cf=d.cf;return o},ed=!!(sel||selB),chg=ed?(selB?dif(ob||{},d,BF):dif(rr||{},{...d,pct:val("pct")},[...RF,...(flat?BF:[]),"pct"])):"";
 let back=tgt,t=tgt;
 if(selB){const o=mk({updatedAt:now,...AU(d.attendanceDate)});putImgs(b,selB,o);b.update(doc(fs,"bens",selB),o);b.update(doc(RC,tgt),{sk:SKU(bk,d.unified,d.district)})}
 else if(sel){const o={personName:d.personName,statusType:st,updatedAt:now};if(flat){mk(o);Object.assign(o,AU(d.attendanceDate));putImgs(b,sel,o)}if(inj&&val("pct"))o.pct=+val("pct");b.update(doc(RC,sel),o)}
 else{
  if(!t&&m){const x=recs.find(r=>r.statusType===st&&norm(r.personName)===norm(d.personName));
   if(x){if(!ask("dm","⚠ «"+x.personName+"» مسجّل مسبقًا. اضغط مرة أخرى لإضافة هذا المستفيد إلى سجله."))return;t=back=x.id}}
  if(t||m){const bid=doc(collection(fs,"bens")).id,o=mk({by:me.name,createdAt:now,att:A1(d.attendanceDate)});putImgs(b,bid,o);
   if(t){o.rid=t;b.update(doc(RC,t),{bc:increment(1),sk:SKU(bk,d.unified,d.district),ld:[(recs.find(r=>r.id===t)||{}).ld||"",d.attendanceDate].sort().pop()})}
   else{const id=doc(RC).id;o.rid=id;b.set(doc(RC,id),{personName:d.personName,statusType:st,bc:1,sk:[bk,d.unified,d.district].filter(Boolean),ld:d.attendanceDate,by:me.name,createdAt:now})}
   b.set(doc(fs,"bens",bid),o)}
  else{const x=recs.find(r=>r.beneficiary&&(r.benKey||norm(r.beneficiary))===bk);
   if(x&&!ask("dup","⚠ المستفيد «"+x.beneficiary+"» مسجّل مسبقًا (للمصاب: "+x.personName+"). اضغط مرة أخرى للتأكيد."))return;
   const o=mk({personName:d.personName,statusType:st,...PCT(),by:me.name,createdAt:now,att:A1(d.attendanceDate)}),id=doc(RC).id;putImgs(b,id,o);b.set(doc(RC,id),o)}}
 const hc=ed?(selB?hch(ob||{},d,BF):hch(rr||{},{...d,pct:val("pct")},[...RF,...(flat?BF:[]),"pct"])):[];
 if(hc.length)b.set(doc(collection(fs,"history")),{rid:selB?tgt:sel,tid:selB||sel,k:selB?"b":"r",lb:String(selB?d.beneficiary:d.personName).slice(0,120),u:me.name,at:now,ch:hc});
 const t1=$("addB").textContent,t2=$("edtB").textContent;$("addB").textContent=$("edtB").textContent="جارٍ الحفظ…";$("addB").disabled=$("edtB").disabled=true;
 try{const cp=b.commit();if(!navigator.onLine)cp.catch(e=>say(err(e)));else await cp;learnFrom(OCRV.b,d.beneficiary);if(!ed)log("add",t?"أضاف مستفيدًا إلى "+st+": "+d.personName:"أضاف "+st+": "+d.personName);else if(chg)log("edit","عدّل "+(selB?"مستفيدًا":st)+" «"+d.personName+"»: "+chg);clear();say(!navigator.onLine?"🔌 حُفظ على الجهاز وسيُرسل عند عودة الإنترنت.":ed?"تم التعديل.":"✓ تمت الإضافة.",1);if(back)openM(back)}finally{$("addB").disabled=$("edtB").disabled=false;$("addB").textContent=t1;$("edtB").textContent=t2}}
function show(src,info,dl){$("vimg").src=src;$("vi").textContent=info;const a=$("vdl");a.classList.toggle("hidden",!dl);if(dl){a.href=src;a.download=info+".jpg"}$("viewer").classList.remove("hidden")}
async function view(id,k){const r=recs.find(x=>x.id===id)||bens.find(x=>x.id===id);if(!r)return;
 if(k==="p"){if(r.photo&&r.photo.startsWith(JP))show(r.photo,"الصورة الشخصية");return}
 show("","جارٍ التحميل…");const s=await getDoc(doc(fs,"images",id+"_"+k));const d=s.exists()&&s.data().d;if(!d||!d.startsWith(JP))throw Error("الصورة غير متوفرة.");show(d,k==="f"?"الموحدة - الأمامي":"الموحدة - الخلفي",1)}
const up=()=>scrollTo({top:0,behavior:"smooth"}),tiles=x=>{setTile("p",x.photo&&x.photo.startsWith(JP)?x.photo:"");setTile("f","",x.hf);setTile("b","",x.hb)};
function pick(id){const r=recs.find(x=>x.id===id);if(!r)return;clear();sel=id;ou=r.unified||"";[...RF,...BF].forEach(k=>setV(k,r[k]||""));$("pct").value=r.pct||"";tiles(r);cfSet(r);
 $("addB").classList.add("hidden");$("edtB").classList.remove("hidden");$("ft").textContent="تعديل سجل";layout();render();up()}
function addBen(){const rid=mp,r=recs.find(y=>y.id===rid);closeM();clear();tgt=rid;$("personName").value=r.personName;$("statusType").value=r.statusType;$("ft").textContent="إضافة مستفيد لـ: "+r.personName;layout();up()}
function editBen(bid){const rid=mp;if(bid===rid){closeM();return pick(rid)}
 const x=bens.find(y=>y.id===bid),r=recs.find(y=>y.id===rid);if(!x||!r)return;closeM();clear();tgt=rid;selB=bid;ou=x.unified||"";ob=x;
 $("personName").value=r.personName;$("statusType").value=r.statusType;BF.forEach(k=>setV(k,x[k]||""));tiles(x);cfSet(x);
 $("addB").classList.add("hidden");$("edtB").classList.remove("hidden");$("ft").textContent="تعديل مستفيد";layout();up()}
async function rm(id){if(!ask("d"+id,"اضغط «حذف» مرة أخرى لنقل السجل إلى المحذوفات (يبقى 30 يومًا)."))return;const rx=recs.find(x=>x.id===id)||{};await updateDoc(doc(RC,id),{del:true,dt:Date.now()});log("del","حذف "+(rx.statusType||"سجل")+": "+(rx.personName||""));if(sel===id)clear();say("نُقل إلى المحذوفات — يمكنك استعادته خلال 30 يومًا.",1)}
async function rmBen(bid){if(!ask("b"+bid,"اضغط «حذف» مرة أخرى لنقل المستفيد إلى المحذوفات."))return;const b=writeBatch(fs);b.update(doc(fs,"bens",bid),{del:true,dt:Date.now()});b.update(doc(RC,mp),{bc:increment(-1)});await b.commit();log("del","حذف مستفيد من: "+((recs.find(x=>x.id===mp)||{}).personName||""));say("نُقل المستفيد إلى المحذوفات.",1)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);fill(e.target)}}),{rootMargin:"250px"}),obs=c=>c.querySelectorAll(".gi.c:not([disabled])").forEach(el=>io.observe(el));
async function fill(el){const k=el.dataset.id+"_"+el.dataset.k;try{let d=IC.get(k);if(!d){const s=await getDoc(doc(fs,"images",k));d=s.exists()&&s.data().d;if(!d||!d.startsWith(JP))throw 0;if(IC.size>30)IC.delete(IC.keys().next().value);IC.set(k,d)}const sp=el.querySelector("span");if(sp){const i=new Image();i.alt="";i.src=d;sp.replaceWith(i)}}catch{const sp=el.querySelector("span");if(sp)sp.textContent="تعذّر التحميل"}}
const kv=(l,v,n)=>`<div class="kv"><dt>${l}</dt><dd${n?' class="n"':""}>${esc(v)}</dd></div>`,bt=(a,i,t,c)=>`<button class="b ${c||""}" data-a="${a}" data-id="${i}">${t}</button>`;
const gal=(i,x)=>{if(uiO().hi)return"";const ph=!!(x.photo&&x.photo.startsWith(JP)),g=(k,t,has,src)=>`<button class="gi${k==="p"?"":" c"}" data-a="v" data-id="${i}" data-k="${k}"${has?"":" disabled"}>${src?`<img src="${esc(src)}" alt="">`:`<span>${has?"جارٍ التحميل…":"لا توجد صورة"}</span>`}<em>${t}</em></button>`;
 return `<div class="gal">${g("p","الصورة الشخصية",ph,ph?x.photo:"")}${g("f","الموحدة - الأمامي",x.hf)}${g("b","الموحدة - الخلفي",x.hb)}</div>`};
const RWK={beneficiary:"اسم المستفيد",relation:"صلة القرابة",unified:"رقم الموحدة",district:"محل النفوس",birthDate:"تاريخ الميلاد",attendanceDate:"تاريخ الحضور"},RWN=new Set(["unified","birthDate","attendanceDate"]);
const defKeys=()=>{const base=Object.keys(RWK),L=CFd(),o=[];base.forEach(k=>{o.push(k);L.filter(f=>f.af===k).forEach(f=>o.push("cf_"+f.id))});L.filter(f=>!base.includes(f.af)).forEach(f=>o.push("cf_"+f.id));return o};
const rowKeysFrom=co=>{const all=defKeys();return[...co.filter(k=>all.includes(k)),...all.filter(k=>!co.includes(k))]};
const rows=x=>rowKeysFrom(uiO().co).map(k=>{if(k.startsWith("cf_")){const v=(x.cf||{})[k.slice(3)];return v?kv(lbl(k),v,cfT(k)==="date"||cfT(k)==="number"):""}return kv(RWK[k],x[k],RWN.has(k))}).join("")+(x.att&&x.att.length?`<div class="kv at"><details><summary>سجل الحضور (${x.att.length})</summary>${[...x.att].sort().reverse().map(esc).join("، ")}</details></div>`:"");
function render(){
 const fq=on("fuzzy"),q=fq?qf():qn(),flt=r=>(!$("fSt").value||r.statusType===$("fSt").value)&&(!$("fDi").value||r.district===$("fDi").value||(r.sk||[]).includes($("fDi").value))&&(!+$("fPc").value||(r.pct||0)>=+$("fPc").value),txt=r=>[r.personName,r.beneficiary,r.unified,(r.sk||[]).join(" ")].join(" ");
 let f=recs.filter(r=>(fq?NF(txt(r)):norm(txt(r))).includes(q)&&flt(r));const nP=f.length;if(fq&&q.length>=3&&nP<8)f=[...f,...fuzzy(q,f,flt,txt)];const fzOn=fq&&nP<f.length;
 LASTF=f;$("n0").textContent=recs.length;$("n1").textContent=recs.filter(r=>isM(r.statusType)).length;$("n2").textContent=recs.filter(r=>!isM(r.statusType)).length;
 io.disconnect();
 $("list").innerHTML=f.length?f.slice(0,lim).map((r,ix)=>{const i=esc(r.id),fzh=ix===nP&&fzOn?'<div class="st fzb">🔍 نتائج مشابهة (تصحيح إملائي)</div>':"";
  if(SELM)return fzh+`<article class="rc ${isM(r.statusType)?"m":"i"} pk${SELS.has(r.id)?" pkd":""}" data-a="tg" data-id="${i}"><i class="pkc"></i><div class="bd">${esc(r.statusType)}</div><dl>${kv(ST[r.statusType]||"الاسم",r.personName)}${isM(r.statusType)?kv("عدد المستفيدين",(r.bc||0)+(r.beneficiary?1:0),1):kv("نسبة العجز",r.pct?r.pct+"%":"-",1)+kv("محل النفوس",r.district)}</dl></article>`;
  const act=(o)=>`<div class="ra">${o}${canE?bt("pick",i,"✎ تعديل")+bt("hs",i,"🕘 السجل"):""}${canD?bt("rm",i,"✕ حذف","del"):""}</div>`;
  if(isM(r.statusType))return fzh+`<article class="rc m${r.id===sel?" sel":""}" data-a="om" data-id="${i}"><div class="bd">${esc(r.statusType)}</div><dl>${kv(ST[r.statusType],r.personName)}${kv("عدد المستفيدين",(r.bc||0)+(r.beneficiary?1:0),1)}</dl>${act(bt("om",i,"📂 فتح الصفحة"))}</article>`;
  return fzh+`<article class="rc i${r.id===sel?" sel":""}"><div class="bd">${esc(r.statusType)}</div><dl>${kv(ST[r.statusType]||"الاسم",r.personName)}${kv("نسبة العجز",r.pct?r.pct+"%":"-",1)}${rows(r)}</dl>${gal(i,r)}${act(bt("att",i,"✔ تأييد حضور اليوم","add")+bt("pr",i,"🖨 طباعة"))}</article>`}).join("")+(f.length>lim?'<button class="b add" data-a="more" style="grid-column:1/-1">عرض المزيد ('+(f.length-lim)+')</button>':""):'<div class="st">لا توجد سجلات.</div>';
 obs($("list"))}
function openM(id){if(!recs.find(x=>x.id===id))return;if(unB)unB();mp=id;bens=[];$("mp").classList.remove("hidden");document.body.style.overflow="hidden";scrollTo(0,0);
 unB=onSnapshot(query(collection(fs,"bens"),where("rid","==",id)),s=>{bens=s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>!x.del);renderM()},e=>say(err(e)));renderM()}
function closeM(){mp=null;if(unB){unB();unB=null}bens=[];$("mp").classList.add("hidden");document.body.style.overflow="";render()}
function renderM(){const r=recs.find(x=>x.id===mp);if(!r)return closeM();io.disconnect();
 const l=[...(r.beneficiary?[{...r}]:[]),...[...bens].sort((a,b)=>(a.createdAt||0)-(b.createdAt||0))];
 $("mpT").textContent=r.personName;$("mpS").textContent=r.statusType+" - المستفيدون: "+l.length;
 $("mpb").innerHTML=l.length?l.map(x=>{const i=esc(x.id),lg=x.id===r.id;return `<article class="rc m ben"><dl>${rows(x)}</dl>${gal(i,x)}<div class="ra">${bt("att",i,"✔ تأييد حضور اليوم","add")}${canE?bt("eb",i,"✎ تعديل"):""}${canD&&!lg?bt("rb",i,"✕ حذف","del"):""}</div></article>`}).join(""):'<div class="st">لا يوجد مستفيدون بعد.</div>';obs($("mpb"))}
let lockT,outT,lastAct=Date.now(),locked=false,pn="",fails=0;
const lockMs=()=>(+LS("lockMin")||0)*6e4,pinO=()=>{try{return JSON.parse(LS("pin")||"null")}catch{return null}},hasPin=()=>{const o=pinO();return !!o&&!!me&&o.u===me.id};
const hsh=async(s,p)=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s+":"+p)))].map(b=>b.toString(16).padStart(2,"0")).join("");
async function wipe(){try{await signOut(auth)}catch{}try{await terminate(fs);await clearIndexedDbPersistence(fs)}catch{}location.reload()}
function bumpIdle(){lastAct=Date.now();clearTimeout(lockT);clearTimeout(outT);const l=lockMs();if(l&&hasPin()&&!locked)lockT=setTimeout(lock,l);outT=setTimeout(wipe,Math.max(12e5,l+6e5))}
const dots=()=>{const o=pinO(),n=o?o.n:4;$("lkd").innerHTML=Array.from({length:n},(_,i)=>`<i class="${i<pn.length?"f":""}"></i>`).join("")};
function lock(){if(locked||!hasPin())return;locked=true;camStop();$("cm").classList.add("hidden");pn="";dots();$("lkm").textContent="";$("lk").classList.remove("hidden");document.body.style.overflow="hidden"}
async function chkPin(){const o=pinO();if(o&&await hsh(o.s,pn)===o.h){locked=false;pn="";fails=0;$("lk").classList.add("hidden");document.body.style.overflow="";bumpIdle();return}
 pn="";dots();$("lkm").textContent="رمز غير صحيح.";if(++fails>=5)wipe()}
async function pdk(k){if(k==="clr"){pn=pn.slice(0,-1);return dots()}const o=pinO();pn+=k;dots();if(o&&pn.length>=o.n)chkPin()}
document.addEventListener("visibilitychange",()=>{if(document.hidden||!me)return;const e=Date.now()-lastAct,l=lockMs();if(e>Math.max(12e5,l+6e5))wipe();else if(l&&e>l)lock()})
function enter(uid,u){
 me={id:uid,...u};canE=u.role!=="user";canD=u.role==="admin";$("miAd").classList.toggle("hidden",!canD);
 $("login").classList.add("hidden");$("app").classList.remove("hidden");
 $("me").textContent=u.name;$("av").textContent=(u.name||"؟").trim().charAt(0).toUpperCase();$("role").textContent=RN[u.role]||"";
 $("edtB").classList.add("hidden");if(canE){$("miSt").classList.remove("hidden");$("selB").classList.remove("hidden");$("hsmB").classList.remove("hidden")}render();
 if(started)return;started=true;v23start();try{if(!sessionStorage.tl){sessionStorage.tl=1;log("login","دخل إلى البرنامج — "+devLabel())}}catch{}$("dot").className="dot on";$("conn").textContent="متصل ومتزامن";
 ["click","keydown","touchstart"].forEach(v=>addEventListener(v,bumpIdle,{passive:true}));bumpIdle();
 onSnapshot(query(RC,orderBy("createdAt","desc")),s=>{const al=s.docs.map(d=>({id:d.id,...d.data()}));recs=al.filter(x=>!x.del);trR=al.filter(x=>x.del);render();if(mp)renderM();if(canE&&!MT&&!MQ){MQ=1;setTimeout(()=>missRefresh(),5000)}},e=>{$("dot").className="dot";$("conn").textContent="انقطع الاتصال: "+err(e);rep(e.code==="permission-denied"?"perm":"net","مزامنة السجلات: "+err(e),"records")});
 if(u.role==="admin"){$("adm").classList.remove("hidden");watchAct();$("sBkW").classList.remove("hidden");getDoc(doc(fs,"meta","backup")).then(s=>{if(s.exists())LBr=s.data().at||0}).catch(()=>{}).finally(chkBk);stor();onSnapshot(collection(fs,"users"),s=>{$("adn").classList.toggle("hidden",s.docs.filter(d=>d.data().role==="admin"&&!d.data().off).length>1);$("ub").innerHTML=s.docs.map(d=>{const x=d.data(),me_=d.id===uid,i=esc(d.id);return `<tr><td>${esc(x.name)}${x.off?' <span class="nw">معطّل</span>':""}</td><td><select data-uid="${i}" ${me_?"disabled":""}>${Object.keys(RN).map(r=>`<option value="${r}"${x.role===r?" selected":""}>${RN[r]}</option>`).join("")}</select></td><td>${me_?"":`<button class="b" data-a="ut" data-id="${i}" data-k="${x.off?1:0}">${x.off?"تفعيل":"تعطيل"}</button> <button class="b del" data-a="du" data-id="${i}">حذف</button>`}</td></tr>`}).join("")})}}
async function addUser(){const n=val("nu"),p=$("np").value,st=$("ust"),r=$("nr").value;st.style.color="#c0574c";
 if(!n||p.length<8||!RN[r])return st.textContent="أدخل الاسم وكلمة سر من 8 أحرف على الأقل.";
 try{const c=await createUserWithEmailAndPassword(auth2,await mail(n),p);await setDoc(doc(fs,"users",c.user.uid),{name:n,role:r,createdAt:Date.now()});await signOut(auth2);$("nu").value=$("np").value="";st.style.color="#3e8a55";st.textContent="تمت إضافة المستخدم."}catch(e){st.textContent=err(e)}}
// حماية من التخمين: 5 محاولات خاطئة = قفل دقيقة
const LK="tlk",lockLeft=()=>{try{const o=JSON.parse(localStorage[LK]||"{}");return o.n>=5&&Date.now()-o.t<6e4?Math.ceil((6e4-Date.now()+o.t)/1e3):0}catch{return 0}};
const bump=ok=>{try{if(ok)return localStorage.removeItem(LK);const o=JSON.parse(localStorage[LK]||"{}");localStorage[LK]=JSON.stringify({n:(o.n>=5&&Date.now()-o.t>=6e4?0:o.n||0)+1,t:Date.now()})}catch{}};
function setSetup(on){setup=on;$("lt").textContent=on?"إنشاء حساب المدير":"تسجيل الدخول";$("lbt").textContent=on?"إنشاء الحساب":"دخول";$("sb").textContent=on?"رجوع لتسجيل الدخول":"أول استخدام؟ أنشئ حساب المدير";lm("")}
async function login(){const n=val("lu"),p=$("lp").value,L=lockLeft();
 if(L)return lm("محاولات كثيرة. انتظر "+L+" ثانية.");if(!n||!p)return lm("أدخل اسم المستخدم وكلمة السر.");if(setup&&p.length<8)return lm("كلمة السر 8 أحرف على الأقل.");
 $("lb").disabled=true;
 try{await setPersistence(auth,$("rem").checked?browserLocalPersistence:browserSessionPersistence);const em=await mail(n);
  if(setup){busy=true;const c=await createUserWithEmailAndPassword(auth,em,p),u={name:n,role:"admin",createdAt:Date.now()};
   try{const b=writeBatch(fs);b.set(doc(fs,"users",c.user.uid),u);b.set(doc(fs,"meta","setup"),{by:c.user.uid,at:Date.now()});await b.commit();busy=false;enter(c.user.uid,u)}
   catch(e){await deleteUser(c.user).catch(()=>{});busy=false;$("sb").classList.add("hidden");setSetup(false);lm("تم إعداد المدير مسبقًا. اطلب حسابًا من المدير.")}}
  else{await signInWithEmailAndPassword(auth,em,p);bump(1);devReset();try{$("rem").checked?localStorage.tu=n:localStorage.removeItem("tu")}catch{}}}
 catch(e){busy=false;bump(0);lm(err(e))}finally{$("lb").disabled=false}}
const A={
 eye:()=>{const p=$("lp");p.type=p.type==="password"?"text":"password"},setup:()=>setSetup(!setup),out:()=>wipe(),
 add:()=>save(),edt:()=>{if(!sel&&!selB)return say("اختر سجلًا أولًا.");return save()},clr:clear,vx:()=>$("viewer").classList.add("hidden"),
 v:(id,k)=>view(id,k),om:id=>openM(id),more:()=>{lim+=20;render()},mc:closeM,att:id=>att(id),pw:()=>$("pw").classList.remove("hidden"),pwx:()=>$("pw").classList.add("hidden"),pws:pws,csv:csv,bk:()=>bk(0),bkf:()=>bk(1),zip:zipx,cam:camOpen,sn:snOpen,snx:()=>$("sn").classList.add("hidden"),ss:(id,k)=>snSel(k),sc:snScan,snp:snPing,ocr:async()=>{if(!pend.f&&!pend.b)return say("التقط أو ارفع صورة الموحدة أولًا.");if(pend.f)await ocrRun("f");if(pend.b)await ocrRun("b")},cx:camClose,cs:(id,k)=>csel(k),cc:camShot,mn:()=>$("mn").classList.remove("hidden"),mx:()=>$("mn").classList.add("hidden"),stp:repOpen,stx:repClose,tab:(id,k)=>repTab(k),gt:id=>{repClose();const r=recs.find(x=>x.id===id);if(r)isM(r.statusType)?openM(id):pick(id)},rst:(id,k)=>restoreT(id,k),pgr:(id,k)=>purge(id,k),sg:sgOpen,sgx:()=>$("sg").classList.add("hidden"),sgs:sgSave,sgd:()=>{try{localStorage.removeItem("pin");localStorage.lockMin="0"}catch{}$("sLk").value="0";$("sgm").style.color="#3e8a55";$("sgm").textContent="حُذف الرمز وعُطّل القفل."},pd:(id,k)=>pdk(k),im:()=>$("imf").click(),tpl:()=>dl("tayid-template.csv","\uFEFF"+[Object.values(HC),["شهيد","فلان الفلاني","","علان العلاني","الاب","123456789","البصرة","1990-01-31",today()]].map(r=>r.map(cs).join(",")).join("\r\n"),"text/csv;charset=utf-8"),ut:(id,k)=>updateDoc(doc(fs,"users",id),{off:k!=="1"}),pr:id=>printRec(id),prm:()=>printRec(mp),fr:()=>{["fSt","fDi","fPc"].forEach(i=>$(i).value="");lim=20;render()},rs:()=>$("rsf").click(),ap:()=>{$("ap").classList.remove("hidden");document.body.style.overflow="hidden"},apx:()=>{try{localStorage.ls=Date.now()}catch{}$("ap").classList.add("hidden");document.body.style.overflow="";renderAct()},da:id=>deleteDoc(doc(fs,"activity",id)),dall:async()=>{if(!ask("dall","اضغط مرة أخرى لحذف كل السجل."))return;const b=writeBatch(fs);acts.forEach(e=>b.delete(doc(fs,"activity",e.id)));await b.commit();say("تم حذف السجل.",1)},ntf:async()=>{if(!("Notification" in window))return say("المتصفح لا يدعم الإشعارات.");const p=await Notification.requestPermission();say(p==="granted"?"تم تفعيل إشعارات الجهاز.":"لم يُسمح بالإشعارات.",p==="granted")},ab:addBen,eb:editBen,rb:rmBen,pick:id=>pick(id),rm:id=>rm(id),nu:addUser,
 du:async id=>{if(ask("u"+id,"اضغط «حذف» مرة أخرى لحذف المستخدم."))await deleteDoc(doc(fs,"users",id))},
 inst:async()=>{if(!dp)return;dp.prompt();await dp.userChoice;dp=null;$("ib").classList.add("hidden")}};
let dp=null;
/* ===== v22: تنبيه النواقص + البحث الصوتي + التحديد والتعديل الجماعي + سجل التعديلات + قراءة عدة بطاقات ===== */
let MS=null,MT=0,MQ=0;
async function missRefresh(force){if(!canE||(!force&&MT))return;MT=Date.now();
 try{const B=collection(fs,"bens"),cn=async(...w)=>(await getCountFromServer(w.length?query(B,...w):B)).data().count,
  [t,d,hf,hb,dh,db]=await Promise.all([cn(),cn(where("del","==",true)),cn(where("hf","==",true)),cn(where("hb","==",true)),cn(where("del","==",true),where("hf","==",true)),cn(where("del","==",true),where("hb","==",true))]);
  MS={R:missList([]),nf:Math.max(0,t-d-(hf-dh)),nb:Math.max(0,t-d-(hb-db))};missCard()}catch{}}
function missCard(){const el=$("mdn");if(!MS)return;let z=0;try{z=+localStorage.mdz||0}catch{}
 const n=MS.R.length+MS.nf+MS.nb;if(!canE||!n||Date.now()<z){el.classList.add("hidden");return}
 const c={};MS.R.forEach(x=>x[2].forEach(p=>c[p]=(c[p]||0)+1));
 const ch=[...(MS.nf?[["مستفيدون بلا موحدة أمامي",MS.nf]]:[]),...(MS.nb?[["مستفيدون بلا موحدة خلفي",MS.nb]]:[]),...Object.entries(c).sort((a,b)=>b[1]-a[1])].slice(0,6);
 $("mdt").textContent="⚠ بيانات ناقصة تحتاج استكمالًا";$("mdc").innerHTML=ch.map(x=>`<span class="chip">${esc(x[0])}: ${x[1]}</span>`).join("")+'<small style="display:block;color:var(--mu);margin-top:4px">الأرقام تقريبية، والتفاصيل الدقيقة في تقرير النواقص.</small>';el.classList.remove("hidden")}
/* ---- البحث الصوتي ---- */
let SR=null;
function voice(){const R=window.SpeechRecognition||window.webkitSpeechRecognition,b=$("vsB");if(!R)return say("متصفحك لا يدعم البحث الصوتي. استعمل Chrome أو Samsung Internet.");
 if(SR){try{SR.stop()}catch{}return}
 const r=SR=new R();r.lang="ar-IQ";r.interimResults=true;r.maxAlternatives=1;r.continuous=false;b.classList.add("rec");say("🎤 تحدّث الآن…",1);
 r.onresult=e=>{let t="";for(const x of e.results)t+=x[0].transcript+" ";$("q").value=t.trim();lim=20;render()};
 r.onerror=e=>say(e.error==="not-allowed"||e.error==="service-not-allowed"?"لم تسمح للبرنامج باستخدام الميكروفون. فعّل الإذن من إعدادات المتصفح.":e.error==="no-speech"?"لم أسمع شيئًا. حاول مرة أخرى.":e.error==="network"?"البحث الصوتي يحتاج اتصالًا بالإنترنت.":"تعذّر البحث الصوتي ("+e.error+").");
 r.onend=()=>{SR=null;b.classList.remove("rec")};
 try{r.start()}catch{SR=null;b.classList.remove("rec")}}
/* ---- التحديد المتعدد والتعديل الجماعي ---- */
let SELM=false,SELS=new Set(),LASTF=[];
function selUI(){document.body.classList.toggle("selm",SELM);$("sbar").classList.toggle("hidden",!SELM);$("sbn").textContent=SELS.size+" محدد";$("selB").textContent=SELM?"✕ إنهاء التحديد":"☑ تحديد متعدد"}
function selTog(id){SELS.has(id)?SELS.delete(id):SELS.add(id);document.querySelectorAll("#list article.pk").forEach(el=>{if(el.dataset.id===id)el.classList.toggle("pkd",SELS.has(id))});selUI()}
function selEnd(){SELM=false;SELS.clear();selUI();render()}
function bulkOpen(){if(!SELS.size)return say("حدّد سجلًا واحدًا على الأقل.");$("buAd").value=today();$("buDs").innerHTML=$("district").innerHTML;$("buPc").innerHTML=$("pct").innerHTML;["buA","buD","buP"].forEach(i=>$(i).checked=false);$("bum").textContent="";$("but").textContent="تعديل جماعي لـ "+SELS.size+" سجل";$("buDel").classList.toggle("hidden",!canD);$("bu").classList.remove("hidden")}
async function bulkApply(){
 const ids=[...SELS].filter(id=>recs.some(r=>r.id===id));if(!ids.length)return say("لا توجد سجلات محددة.");
 const dA=$("buA").checked,dD=$("buD").checked,dP=$("buP").checked,ad=val("buAd"),ds=val("buDs"),pc=val("buPc"),m=$("bum");m.style.color="#c0574c";
 if(!dA&&!dD&&!dP)return m.textContent="اختر تعديلًا واحدًا على الأقل.";
 if(dA&&!ad)return m.textContent="اختر تاريخ الحضور.";if(dD&&!ds)return m.textContent="اختر محل النفوس.";if(dP&&!(+pc>=30&&+pc<=100))return m.textContent="اختر نسبة العجز.";
 const R=ids.map(id=>recs.find(r=>r.id===id)),nM=R.filter(r=>isM(r.statusType)).length,nI=R.length-nM;
 if(dP&&!nI)return m.textContent="لا يوجد مصابون بين المحددين لتطبيق نسبة العجز.";
 const sm=[dA?"تأييد حضور "+ad:"",dD?"محل النفوس ← "+ds:"",dP?"نسبة العجز ← "+pc+"% (للمصابين)":""].filter(Boolean).join("، ");
 if(!confirm("سيُطبَّق على "+R.length+" سجلًا ("+nM+" شهيد، "+nI+" مصاب)"+(nM&&(dA||dD)?"\nملاحظة: للشهداء يشمل كل مستفيديهم.":"")+"\n"+sm+"\nمتابعة؟"))return;
 m.style.color="#3e8a55";m.textContent="جارٍ التنفيذ…";
 const bm={},mi=R.filter(r=>isM(r.statusType)).map(r=>r.id);
 for(let i=0;i<mi.length;i+=10)(await getDocs(query(collection(fs,"bens"),where("rid","in",mi.slice(i,i+10))))).forEach(d=>{const x={id:d.id,...d.data()};if(!x.del)(bm[x.rid]=bm[x.rid]||[]).push(x)});
 const now=Date.now();let b=writeBatch(fs),n=0,done=0;const put=async fn=>{fn(b);if(++n>=150){await b.commit();b=writeBatch(fs);n=0}};
 for(const r of R){const flat=!isM(r.statusType)||!!r.beneficiary,its=[...(flat?[{k:"r",x:r}]:[]),...(bm[r.id]||[]).map(x=>({k:"b",x}))],rup={};let tc=0;
  for(const it of its){const up={},ch=[];
   if(dD&&it.x.district!==ds){ch.push({f:"district",o:it.x.district||"",n:ds});up.district=ds}
   if(dP&&it.k==="r"&&!isM(r.statusType)&&+it.x.pct!==+pc){ch.push({f:"pct",o:String(it.x.pct||""),n:String(+pc)});up.pct=+pc}
   if(dA&&!(it.x.att||[]).includes(ad)){up.att=arrayUnion(ad);up.attendanceDate=ad}
   it.d=up.district||it.x.district;
   if(!Object.keys(up).length)continue;tc++;up.updatedAt=now;
   if(it.k==="r")Object.assign(rup,up);else await put(x=>x.update(doc(fs,"bens",it.x.id),up));
   if(ch.length)await put(x=>x.set(doc(collection(fs,"history")),{rid:r.id,tid:it.x.id,k:it.k,lb:String(it.k==="r"?r.personName:it.x.beneficiary).slice(0,120),u:me.name,at:now,ch,bulk:true}))}
  if(tc){if(dD&&isM(r.statusType))rup.sk=[...new Set(its.flatMap(it=>[norm(it.x.beneficiary),it.x.unified,it.d]).filter(Boolean))];if(dA&&isM(r.statusType))rup.ld=[r.ld||"",ad].sort().pop();rup.updatedAt=now;await put(x=>x.update(doc(RC,r.id),rup));done++}}
 if(n)await b.commit();
 log("edit","تعديل جماعي لـ "+done+" سجل: "+sm);$("bu").classList.add("hidden");selEnd();say("✓ تم التعديل الجماعي: "+done+" سجلًا"+(done<R.length?" (والباقي لم يتغيّر لأن القيم نفسها)":"")+".",1);missRefresh(1)}
async function bulkDel(){if(!canD)return;const ids=[...SELS].filter(id=>recs.some(r=>r.id===id));if(!ids.length)return;
 if(!ask("bud","اضغط مرة أخرى لنقل "+ids.length+" سجلًا إلى المحذوفات (يبقى 30 يومًا)."))return;
 let b=writeBatch(fs),n=0;for(const id of ids){b.update(doc(RC,id),{del:true,dt:Date.now()});if(++n>=400){await b.commit();b=writeBatch(fs);n=0}}if(n)await b.commit();
 log("del","نقل "+ids.length+" سجلًا إلى المحذوفات (جماعي)");$("bu").classList.add("hidden");selEnd();say("نُقل "+ids.length+" سجلًا إلى المحذوفات.",1)}
/* ---- سجل تعديلات السجل مع التراجع ---- */
const HF=["personName","statusType","beneficiary","relation","unified","district","birthDate","pct"];
const hch=(o,n,ks)=>ks.filter(k=>HF.includes(k)&&String(o[k]==null?"":o[k])!==String(n[k]==null?"":n[k])).map(k=>({f:k,o:String(o[k]==null?"":o[k]).slice(0,120),n:String(n[k]==null?"":n[k]).slice(0,120)}));
let HSL=[],HSR="";
async function hsOpen(rid){HSR=rid;$("hs").classList.remove("hidden");$("hsl").innerHTML='<div class="st">جارٍ التحميل…</div>';
 try{HSL=(await getDocs(query(collection(fs,"history"),where("rid","==",rid),limit(200)))).docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.at-a.at);hsRender()}
 catch(e){$("hsl").innerHTML='<div class="st">'+esc(err(e)+(e.code==="permission-denied"?" [history] — انشر آخر firestore.rules.":""))+'</div>'}}
function hsRender(){const rv=new Set(HSL.filter(h=>h.ref).map(h=>h.ref));
 $("hsl").innerHTML=HSL.map(h=>`<div class="ev"><i>${h.undo?"↩":h.bulk?"📋":"✏️"}</i><div><b>${esc(h.lb)}</b><small>${esc(h.u)} — ${new Date(h.at).toLocaleString("ar",{dateStyle:"short",timeStyle:"short"})}${h.undo?" — تراجع":""}${h.bulk?" — تعديل جماعي":""}${rv.has(h.id)?" — ✓ تم التراجع عنه":""}</small>${(h.ch||[]).map(c=>`<div class="hc"><span>${esc(LB[c.f]||c.f)}:</span> <s>${esc(c.o||"—")}</s> ← <b>${esc(c.n||"—")}</b></div>`).join("")}</div>${canE&&!h.undo&&!rv.has(h.id)?`<button class="b" data-a="hu" data-id="${esc(h.id)}">↩ تراجع</button>`:""}</div>`).join("")||'<div class="st">لا توجد تعديلات مسجَّلة لهذا السجل بعد.</div>'}
async function hsUndo(id){const h=HSL.find(x=>x.id===id);if(!h)return;if(!ask("hu"+id,"اضغط «تراجع» مرة أخرى لإعادة القيم القديمة."))return;
 const ref=doc(fs,h.k==="b"?"bens":"records",h.tid),s=await getDoc(ref);if(!s.exists())throw Error("السجل غير موجود.");const cur=s.data(),up={},ch=[],skip=[];
 for(const c of h.ch||[]){const cv=String(cur[c.f]==null?"":cur[c.f]);if(cv!==c.n){skip.push(LB[c.f]||c.f);continue}
  if(c.f==="pct"){if(!c.o){skip.push(LB.pct);continue}up.pct=+c.o}else{if((c.f==="personName"||c.f==="beneficiary"&&h.k==="b")&&!c.o){skip.push(LB[c.f]);continue}up[c.f]=c.o}
  ch.push({f:c.f,o:c.n,n:c.o})}
 if(!ch.length)return say("لا يمكن التراجع: القيم الحالية تغيّرت بعد هذا التعديل"+(skip.length?" ("+skip.join("، ")+")":"")+".");
 if(up.beneficiary!=null)up.benKey=norm(up.beneficiary);
 const sk=[up.beneficiary&&norm(up.beneficiary),up.unified,up.district].filter(Boolean);up.updatedAt=Date.now();
 const b=writeBatch(fs);b.update(ref,up);if(sk.length&&h.k==="b")b.update(doc(RC,h.rid),{sk:arrayUnion(...sk)});
 b.set(doc(collection(fs,"history")),{rid:h.rid,tid:h.tid,k:h.k,lb:h.lb,u:me.name,at:Date.now(),ch,undo:true,ref:h.id});
 await b.commit();log("edit","تراجع عن تعديل «"+h.lb+"»: "+ch.map(c=>LB[c.f]+" ← "+(c.n||"—")).join("، "));say("✓ تم التراجع"+(skip.length?" (تعذّر: "+skip.join("، ")+")":"")+".",1);hsOpen(HSR)}
/* ---- قراءة عدة بطاقات دفعة واحدة ---- */
let BT=[],BTX=false;
const ops=(id,v)=>[...$(id).options].map(o=>`<option value="${esc(o.value)}"${o.value===v?" selected":""}>${esc(o.text)}</option>`).join("");
const btNew=()=>({on:true,f:"",b:"",nm:"",un:"",bd:"",st:val("btSt"),pn:val("btPn"),rl:val("btRl"),ds:val("btDs"),pc:val("btPc"),w:[],err:[]});
function btRender(){const dup=new Map();BT.forEach(x=>{if(x.un)dup.set(x.un,(dup.get(x.un)||0)+1)});
 $("btl").innerHTML=BT.map((x,i)=>{const w=[...x.w],d=x.un&&dupU(x.un);if(d)w.push("⚠ الرقم مسجّل مسبقًا لـ «"+d.personName+"»");if(x.un&&dup.get(x.un)>1)w.push("⚠ الرقم مكرر داخل هذه الدفعة");
  return `<article class="rc i${x.on?"":" off"}"><label class="ck"><input type="checkbox" data-bt="on" data-i="${i}"${x.on?" checked":""}> إدراج هذه البطاقة</label>
<div class="gal bt2">${["f","b"].map(k=>`<div class="gi c">${x[k]?`<img src="${esc(x[k])}" alt="">`:"<span>لا توجد صورة</span>"}<em>${k==="f"?"الوجه الأمامي":"الوجه الخلفي"}</em></div>`).join("")}</div>
<div class="gr" style="margin-top:12px"><div class="fw"><label>اسم المستفيد</label><input type="text" data-bt="nm" data-i="${i}" value="${esc(x.nm)}" maxlength="120"></div>
<div><label>رقم الموحدة</label><input type="text" inputmode="numeric" data-bt="un" data-i="${i}" value="${esc(x.un)}" maxlength="30"></div>
<div><label>تاريخ الميلاد</label><input type="date" data-bt="bd" data-i="${i}" value="${esc(x.bd)}"></div>
<div><label>الحالة</label><select data-bt="st" data-i="${i}">${ops("statusType",x.st)}</select></div>
<div><label>صلة القرابة</label><select data-bt="rl" data-i="${i}">${ops("relation",x.rl)}</select></div>
<div class="fw"><label>اسم الشهيد أو المصاب</label><input type="text" list="btNames" data-bt="pn" data-i="${i}" value="${esc(x.pn)}" maxlength="120"></div>
<div><label>محل النفوس</label><select data-bt="ds" data-i="${i}">${ops("district",x.ds)}</select></div>
<div class="btpc${isI(x.st)?"":" hidden"}"><label>نسبة العجز</label><select data-bt="pc" data-i="${i}">${ops("pct",x.pc)}</select></div></div>
<div class="st" style="color:#c9a24d">${w.map(esc).join("<br>")}</div><div class="st" style="color:#c0574c">${x.err&&x.err.length?"أكمل: "+esc(x.err.join("، ")):""}</div></article>`}).join("");
 $("btA").classList.toggle("hidden",!BT.length)}
const hd=(a,b)=>a.length!==b.length?99:[...a].reduce((s,c,i)=>s+(c!==b[i]?1:0),0);
async function btRead(files){if(OCRB)return say("انتظر انتهاء القراءة الحالية.");files=files.filter(f=>f.type.startsWith("image/"));if(!files.length)return say("اختر ملفات صور.");
 OCRB=1;BTX=false;OCRT=$("btm");const m=$("btm"),FR=[],BK=[];$("btC").classList.remove("hidden");$("btp").disabled=true;let bad=0;
 try{for(let i=0;i<files.length;i++){if(BTX)break;OCRP="الصورة "+(i+1)+" من "+files.length+" — ";m.style.color="#3e8a55";m.textContent="🔎 "+OCRP+"…";
   try{const src=await shrink(files[i],TC,45e4),E=OCRE=OCRE||await ocrW("eng");let cv,d,nc,back;
    for(const rt of await rotsFor(src)){cv=await ocrPrep(src,rt);await tmo(E.setParameters({tessedit_char_whitelist:"",tessedit_pageseg_mode:"11"}),30000,"ضبط المحرك");
     d=(await tmo(E.recognize(cv,{},{text:true,tsv:true}),90000,"قراءة الصورة")).data;nc=nidCands(tsvW(d.tsv)).filter(c=>c.c>=60);back=/IRQ|<<</.test(String(d.text).toUpperCase())||(!nc.length&&parseDates([d.text]).length>0);if(nc.length||back)break}
    if(!back&&nc.length){FR.push({src,i,...await ocrFront(cv)})}
    else{const r=await ocrBack(cv);if(!r.r&&!r.M){const fr=await ocrFront(cv);FR.push({src,i,...fr,unk:!fr.id&&!fr.nm})}else BK.push({src,i,r:r.r,M:r.M})}}
   catch(e){bad++;if(/المهلة|tesseract|ocr/i.test(e.message||"")&&bad>=2)throw e}}
  const used=new Set();
  for(const f of FR){const k=f.id&&BK.find(x=>!used.has(x)&&x.M&&x.M.nid&&hd(x.M.nid,f.id)<=2);if(k){used.add(k);f.k=k}}
  const open=FR.filter(f=>!f.k).sort((a,b)=>a.i-b.i);
  open.forEach((f,j)=>{const nx=open[j+1]?open[j+1].i:1e9,k=BK.filter(x=>!used.has(x)&&x.i>f.i&&x.i<nx).sort((a,b)=>a.i-b.i)[0];if(k){used.add(k);f.k=k}});
  const out=[];
  for(const f of FR.sort((a,b)=>a.i-b.i)){const k=f.k,x=btNew(),w=x.w;x.f=f.src;x.b=k?k.src:"";let id=f.id;
   if(k&&k.M&&k.M.nid&&k.M.docOk&&id&&id!==k.M.nid){w.push("صُحّح الرقم من الشريط السفلي");id=k.M.nid}
   if(!id&&k&&k.M&&k.M.nid){id=k.M.nid;w.push("الرقم من الشريط السفلي (غير مؤكد)")}
   x.un=id||"";x.raw=x.nm=f.nc>=40?f.nm:"";{const L=learnApply(x.nm);if(L.ch.length){x.nm=L.nm;w.push("تصحيح متعلَّم: "+L.ch.map(c=>c[0]+"←"+c[1]).join("، "))}}x.bd=k&&k.r?k.r.d:"";
   if(f.unk)w.push("تعذّر تمييز هذه الصورة (لا أمامي ولا خلفي)");else{if(!id)w.push("تعذّر قراءة رقم الموحدة");if(!x.nm)w.push("تعذّر قراءة الاسم"+(f.raw?" — المقروء: "+f.raw:""));else if(f.nc<65)w.push("الاسم غير مؤكد — راجعه")}
   if(!k)w.push("لم يُعثر على الوجه الخلفي (أدخل تاريخ الميلاد يدويًا)");else if(!x.bd)w.push("تعذّر قراءة تاريخ الميلاد");
   out.push(x)}
  for(const k of BK)if(!used.has(k)){const x=btNew();x.b=k.src;x.un=(k.M&&k.M.docOk&&k.M.nid)||"";x.bd=k.r?k.r.d:"";x.w.push("وجه خلفي بلا وجه أمامي مطابق — أضف الاسم يدويًا");out.push(x)}
  BT.push(...out);btRender();m.style.color=out.length?"#3e8a55":"#c9a24d";m.textContent=(BTX?"⏹ أُوقفت القراءة. ":"")+(out.length?"✓ قُرئت "+out.length+" بطاقة"+(bad?" (تعذّرت "+bad+" صورة)":"")+". راجع البيانات ثم اضغط «حفظ المحدد».":"لم تُقرأ أي بطاقة"+(bad?" ("+bad+" صورة فشلت)":"")+".")}
 catch(e){const miss=await ocrCheck().catch(()=>[]);m.style.color="#c0574c";m.textContent=(e.message||"تعذرت القراءة.")+(miss.length?" — ملفات ناقصة في GitHub: "+miss.join("، "):"");OCRE=null;OCRA=null}
 finally{OCRB=0;OCRT=null;OCRP="";$("btC").classList.add("hidden");$("btp").disabled=false}}
function btApply(){const d=btNew();BT.filter(x=>x.on).forEach(x=>{if(d.st)x.st=d.st;if(d.pn)x.pn=d.pn;if(d.rl)x.rl=d.rl;if(d.ds)x.ds=d.ds;if(d.pc)x.pc=d.pc});btRender();say("طُبّقت البيانات المشتركة على البطاقات المحددة.",1)}
async function btSave(){const it=BT.filter(x=>x.on),ad=val("btAd");if(!it.length)return say("حدّد بطاقة واحدة على الأقل.");if(!ad)return say("اختر تاريخ الحضور.");
 let bad=0;it.forEach(x=>{x.err=[];if(isI(x.st)&&!x.pn)x.pn=x.nm;if(!x.st)x.err.push("الحالة");if(!x.pn)x.err.push("اسم الشهيد/المصاب");if(!x.nm)x.err.push("اسم المستفيد");if(!x.rl&&isReq("relation"))x.err.push("صلة القرابة");if(!x.un&&isReq("unified"))x.err.push("رقم الموحدة");if(!x.ds&&isReq("district"))x.err.push("محل النفوس");if(!x.bd&&isReq("birthDate"))x.err.push("تاريخ الميلاد");if(isI(x.st)&&!(+x.pc>=30&&+x.pc<=100))x.err.push("نسبة العجز");if(x.err.length)bad++});
 if(bad){btRender();return say("أكمل الحقول الناقصة في "+bad+" بطاقة (مكتوبة تحت كل بطاقة).")}
 const seen=new Set();let dups=0;it.forEach(x=>{if(dupU(x.un)||seen.has(x.un))dups++;seen.add(x.un)});
 if(dups&&!ask("btd","⚠ "+dups+" بطاقة رقمها مسجّل مسبقًا أو مكرر. اضغط مرة أخرى للمتابعة."))return;
 const now=Date.now();let b=writeBatch(fs),n=0;const put=async fn=>{fn(b);if(++n>=120){await b.commit();b=writeBatch(fs);n=0}};
 const ben=async(x,rid,flat)=>{const id=flat?rid:doc(collection(fs,"bens")).id,o=flat?{personName:x.pn,statusType:x.st,pct:Math.round(+x.pc)}:{rid};Object.assign(o,{beneficiary:x.nm,relation:x.rl,unified:x.un,district:x.ds,birthDate:x.bd,attendanceDate:ad,benKey:norm(x.nm),att:[ad],by:me.name,createdAt:now});
  for(const k of["f","b"])if(x[k]){o["h"+k]=true;await put(y=>y.set(doc(fs,"images",id+"_"+k),{rid:id,d:x[k]}))}
  await put(y=>y.set(doc(fs,flat?"records":"bens",id),o))};
 const gm={};it.filter(x=>isM(x.st)).forEach(x=>{const k=x.st+"|"+norm(x.pn);(gm[k]=gm[k]||[]).push(x)});
 for(const k in gm){const L=gm[k],x0=L[0],ex=recs.find(r=>r.statusType===x0.st&&norm(r.personName)===norm(x0.pn)),id=ex?ex.id:doc(RC).id,sk=L.flatMap(x=>[norm(x.nm),x.un,x.ds]);
  await put(y=>ex?y.update(doc(RC,id),{bc:increment(L.length),sk:arrayUnion(...sk),ld:[ex.ld||"",ad].sort().pop(),updatedAt:now}):y.set(doc(RC,id),{personName:x0.pn,statusType:x0.st,bc:L.length,sk:[...new Set(sk)],ld:ad,by:me.name,createdAt:now}));
  for(const x of L)await ben(x,id,false)}
 for(const x of it.filter(x=>isI(x.st)))await ben(x,doc(RC).id,true);
 if(n)await b.commit();it.forEach(x=>x.raw&&learnFrom(x.raw,x.nm));log("add","قراءة عدة بطاقات: أُضيف "+it.length+" مستفيد");BT=BT.filter(x=>!x.on);btRender();say("✓ تم حفظ "+it.length+" بطاقة.",1);missRefresh(1)}
const btOpen=()=>{$("btNames").innerHTML=[...new Set(recs.map(r=>r.personName))].slice(0,3000).map(n=>`<option value="${esc(n)}">`).join("");if(!$("btAd").value)$("btAd").value=today();$("bt").classList.remove("hidden");document.body.style.overflow="hidden"};
const btClose=()=>{BTX=true;$("bt").classList.add("hidden");document.body.style.overflow=""};
Object.assign(A,{th:()=>{const t=LS("theme")||"auto";setTheme(TH[(TH.indexOf(t)+1)%TH.length])},bks:()=>{try{localStorage.bsn=Date.now()+864e5}catch{}chkBk()},mdz:()=>{try{localStorage.mdz=Date.now()+864e5}catch{}$("mdn").classList.add("hidden")},mis:()=>{repOpen();repTab("m")},vs:voice,
 selm:()=>{SELM=!SELM;if(!SELM)SELS.clear();selUI();render()},sall:()=>{LASTF.forEach(r=>SELS.add(r.id));selUI();render()},selx:selEnd,tg:id=>selTog(id),bke:bulkOpen,bux:()=>$("bu").classList.add("hidden"),bus:bulkApply,bud:bulkDel,
 hs:id=>hsOpen(id),hsm:()=>mp&&hsOpen(mp),hsx:()=>$("hs").classList.add("hidden"),hu:id=>hsUndo(id),
 btO:btOpen,btx:btClose,btp:()=>$("btf").click(),btc:()=>{BTX=true},bta:btApply,bts:btSave});
document.addEventListener("input",e=>{const t=e.target,k=t.dataset&&t.dataset.bt;if(!k)return;const x=BT[+t.dataset.i];if(!x)return;
 if(k==="on"){x.on=t.checked;t.closest("article").classList.toggle("off",!x.on);return}
 x[k]=t.value;
 if(k==="st"){const a=t.closest("article");a.querySelector(".btpc").classList.toggle("hidden",!isI(x.st));if(isI(x.st)&&!x.rl){x.rl=x.st;a.querySelector('[data-bt="rl"]').value=x.rl}}});
$("btf").onchange=e=>{const fl=[...e.target.files];e.target.value="";if(fl.length)guard(()=>btRead(fl))};
["btSt","btRl","btDs","btPc"].forEach((i,k)=>$(i).innerHTML=$(["statusType","relation","district","pct"][k]).innerHTML);
$("sTh").onchange=()=>setTheme($("sTh").value);$("sBk").onchange=()=>{try{localStorage.bkDays=$("sBk").value}catch{}chkBk()};
if(window.matchMedia)try{matchMedia("(prefers-color-scheme:dark)").addEventListener("change",()=>setTheme(LS("theme")||"auto"))}catch{}
document.addEventListener("click",e=>{const el=e.target.closest("[data-a]");if(el&&A[el.dataset.a]){if(el.closest("#mn")&&el.dataset.a!=="mn")$("mn").classList.add("hidden");guard(async()=>A[el.dataset.a](el.dataset.id,el.dataset.k),el.dataset.a)}});
document.addEventListener("change",async e=>{const t=e.target;
 if(t.dataset.uid)return guard(()=>updateDoc(doc(fs,"users",t.dataset.uid),{role:t.value}));
 const k=t.dataset.k;if(!k||!t.files)return;const f=t.files[0];if(!f)return;if(!f.type.startsWith("image/"))return say("اختر ملف صورة.");
 try{say("جارٍ معالجة الصورة…",1);pend[k]=await shrink(f,k==="p"?TP:TC,k==="p"?38e3:45e4);setTile(k,pend[k]);onImg(k);say("تم اختيار الصورة.",1)}catch(x){say(err(x));rep("img",err(x),"رفع صورة: "+(CMN[k]||k))}t.value=""});
$("lb").onclick=login;$("lu").onkeydown=e=>{if(e.key==="Enter")$("lp").focus()};$("lp").onkeydown=e=>{if(e.key==="Enter")login()};let qt;$("q").oninput=()=>{clearTimeout(qt);qt=setTimeout(()=>{lim=20;render()},250)};
try{const s=localStorage.tu;if(s)$("lu").value=s}catch{}
onAuthStateChanged(auth,async u=>{if(busy||!u)return;try{const s=await getDoc(doc(fs,"users",u.uid));if(!s.exists()){await signOut(auth);return lm("حسابك غير مفعّل. اطلب من المدير تفعيله.")}if(s.data().off){await signOut(auth);return lm("تم تعطيل حسابك. تواصل مع المدير.")}enter(u.uid,s.data())}catch(e){lm(err(e))}});
addEventListener("beforeinstallprompt",e=>{e.preventDefault();dp=e;$("ib").classList.remove("hidden")});
if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
getDoc(doc(fs,"meta","setup")).then(x=>{if(!x.exists())$("sb").classList.remove("hidden")}).catch(()=>{});
$("pct").innerHTML='<option value="">اختر</option>'+Array.from({length:71},(_,i)=>`<option value="${30+i}">${30+i}%</option>`).join("");$("statusType").onchange=layout;layout();
$("rsf").onchange=e=>{const f=e.target.files[0];e.target.value="";if(f)guard(()=>restore(f))};
$("fDi").innerHTML='<option value="">الكل</option>'+[...$("district").options].slice(1).map(o=>`<option>${o.text}</option>`).join("");
$("fPc").innerHTML='<option value="">الكل</option>'+Array.from({length:71},(_,i)=>`<option value="${30+i}">${30+i}% فأكثر</option>`).join("");
["fSt","fDi","fPc"].forEach(i=>$(i).onchange=()=>{lim=20;render()});
$("unified").onblur=()=>{const v=$("unified").value.trim(),x=dupU(v);if(x&&v!==ou)say("⚠ رقم الموحدة مسجّل مسبقًا لـ «"+x.personName+"».")};
$("imf").onchange=e=>{const f=e.target.files[0];e.target.value="";if(f)guard(()=>imp(f))};
addEventListener("online",net);addEventListener("offline",net);
$("cmd").onchange=()=>{cmD=$("cmd").value;camStart()};
if(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))$("snB").classList.add("hidden");
/* ===== v23: لوحة المدير + الأخطاء + الأجهزة + القوائم + الحقول المخصصة + الإلزامي + قوالب الطباعة + تخصيص الواجهة + البحث الذكي + التعلّم + تحسين الصورة ===== */
const FT=[["errs","🐞 صفحة الأخطاء","تسجّل ما فشل عند المستخدمين (رفع الصور، انقطاع الاتصال، رفض الصلاحيات…) وتعرضه لك."],
 ["devs","💻 سجل الدخول والأجهزة","أجهزة كل مستخدم وآخر ظهور، مع زر إنهاء الجلسات."],
 ["lists","📋 تعديل القوائم","إضافة وحذف وترتيب «محل النفوس» و«صلة القرابة»."],
 ["cfld","🧩 حقول مخصصة","حقول تضيفها أنت تظهر في النموذج والبطاقة والتصدير والطباعة."],
 ["req","✱ الحقول الإلزامية","تحدد أي الحقول إجبارية وأيها اختيارية."],
 ["ptpl","🖨 قوالب الطباعة","قوالب محفوظة: الأعمدة والعنوان والشعار والورق."],
 ["ui","🎛 تخصيص الواجهة","لكل مستخدم: حجم الخط وترتيب البطاقة وإخفاء الصور."],
 ["fuzzy","🔍 البحث الذكي","تسامح مع الأخطاء الإملائية واقتراح أسماء مشابهة لمنع التكرار."],
 ["learn","🧠 تعلّم التصحيح","يتذكر تصحيحاتك لأسماء القراءة الآلية ويطبّقها لاحقًا."],
 ["enh","🪄 تحسين صورة البطاقة","تعديل الميلان والاتجاه والقص قبل القراءة الآلية."]];
let CFG={},UIP={fs:100,co:[],hi:false,gp:"b"},NC=new Map(),DR=null,ADK="ft",ER=null,ERF="",DV=null,PRID="",UD=null,OCRV={},DEVS=0,KSELF=0,DVID="",SIT;
const on=k=>CFG.feat?CFG.feat[k]!==false:true;
const NF=s=>norm(AD(s)).replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/ء/g,"").replace(/([^\d\s])\1+/g,"$1").replace(/\s+/g," ").trim();
const qf=()=>{let s=AD(val("q"));if(/^[\d\s]+$/.test(s))s=s.replace(/\s/g,"");return NF(s)};
const DIS0=[...$("district").options].slice(1).map(o=>o.text),REL0=[...$("relation").options].slice(1).map(o=>o.text);
const CFGR=()=>doc(fs,"meta","config"),LSS=(k,v)=>{try{localStorage[k]=v}catch{}};
const GOV=["بغداد (العاصمه)","نينوى (موصل)","البصرة","صلاح الدين","دهوك","أربيل","السليمانية","ديالى","واسط","ميسان","ذي قار (ناصريه)","المثنى","بابل","كربلاء","النجف","الانبار","الديوانية (القادسيه)","كركوك","حلبجة"],BIID=["gov","gnf"],GW={k:"district",v:"محافظات",re:/^(ال)?محافظ/};
const BCF=[{id:"gov",lb:"اسم المحافظة",t:"list",o:GOV,af:"district",fw:0,w:GW,bi:1},{id:"gnf",lb:"محل النفوس في المحافظة المختارة",t:"text",o:[],af:"district",fw:0,w:GW,bi:1}];
const CFd=()=>[...BCF,...(on("cfld")&&Array.isArray(CFG.cf)?CFG.cf.filter(f=>!BIID.includes(f.id)):[])];
const cfT=k=>(CFd().find(f=>"cf_"+f.id===k)||{}).t;
const lbl=k=>LB[k]||((CFd().find(f=>"cf_"+f.id===k)||{}).lb)||k;
const LOCK=["personName","statusType","beneficiary"];
const isReq=k=>{if(LOCK.includes(k))return true;if(!on("req")||!Array.isArray(CFG.rq))return !k.startsWith("cf_");return CFG.rq.includes(k)};
const A1=v=>v?[v]:[],AU=v=>v?{att:arrayUnion(v)}:{},SKU=(...a)=>arrayUnion(...a.filter(Boolean)),PCT=()=>val("pct")?{pct:+val("pct")}:{};
const PTs=()=>on("ptpl")&&Array.isArray(CFG.pt)?CFG.pt:[];
const uiO=()=>on("ui")?UIP:{fs:100,co:[],hi:false,gp:"b"};
function setV(k,v){const e=$(k);if(e.tagName==="SELECT"&&v&&![...e.options].some(o=>o.value===v||o.text===v))e.insertAdjacentHTML("beforeend",`<option>${esc(v)}</option>`);e.value=v}
function fillSel(id,list,first){const el=$(id);if(!el)return;const v=el.value;el.innerHTML=(first||'<option value="">اختر</option>')+list.map(t=>`<option>${esc(t)}</option>`).join("");if(v){if(!list.includes(v))el.insertAdjacentHTML("beforeend",`<option>${esc(v)}</option>`);el.value=v}}
/* ---- حقول مخصصة ---- */
const CFA=[["","آخر النموذج (قسم «حقول إضافية»)"],["beneficiary","اسم المستفيد"],["relation","صلة القرابة"],["unified","رقم الموحدة"],["district","محل النفوس"],["birthDate","تاريخ الميلاد"],["attendanceDate","تاريخ الحضور"]];
const cfVis=f=>{if(!f||!f.w||!f.w.k)return true;const c=NF(($(f.w.k)||{}).value||"");return f.w.re?f.w.re.test(c):c===NF(f.w.v||"")},cfVisK=k=>cfVis(CFd().find(f=>"cf_"+f.id===k));
function cfShow(){CFd().forEach(f=>{const w=document.querySelector('.cfw[data-cf="'+f.id+'"]');if(w)w.classList.toggle("hidden",!cfVis(f))});$("cfS").classList.toggle("hidden",![...$("cfG").children].some(e=>!e.classList.contains("hidden")))}
function cfForm(){const L=CFd(),keep={};L.forEach(f=>{const e=$("cf_"+f.id);if(e)keep[f.id]=e.value});document.querySelectorAll(".cfw").forEach(e=>e.remove());
 const mk=f=>{const d=document.createElement("div");d.className="cfw"+(f.fw?" fw":"");d.dataset.cf=f.id;d.innerHTML=`<label for="cf_${f.id}">${esc(f.lb)}</label>`+(f.t==="list"?`<select id="cf_${f.id}"><option value="">اختر</option>${(f.o||[]).map(o=>`<option>${esc(o)}</option>`).join("")}</select>`:`<input id="cf_${f.id}" type="${f.t==="date"?"date":"text"}"${f.t==="number"?' inputmode="decimal"':""} maxlength="200">`);return d},last={},end=[];
 L.forEach(f=>{const w=mk(f),a=f.af?$(f.af):null;if(a){(last[f.af]||a.parentElement).after(w);last[f.af]=w}else end.push(w)});
 $("cfG").replaceChildren(...end);L.forEach(f=>{if(keep[f.id]!=null)$("cf_"+f.id).value=keep[f.id]});cfShow()}
function cfGet(old){const o={...(old||{})};CFd().forEach(f=>{const v=(($("cf_"+f.id)||{}).value||"").trim();v&&cfVis(f)?o[f.id]=v:delete o[f.id]});return o}
function cfSet(x){CFd().forEach(f=>{const e=$("cf_"+f.id);if(!e)return;const v=(x&&x.cf&&x.cf[f.id])||"";if(f.t==="list"&&v&&![...e.options].some(o=>o.value===v))e.insertAdjacentHTML("beforeend",`<option>${esc(v)}</option>`);e.value=v;e.classList.remove("bad")});cfShow()}
function reqMarks(){[...RF,...BF,"pct",...CFd().map(f=>"cf_"+f.id)].forEach(k=>{const l=document.querySelector('label[for="'+k+'"]');if(l)l.classList.toggle("rqd",isReq(k))})}
/* ---- تطبيق الإعدادات ---- */
function applyCfg(){
 const dis=on("lists")&&CFG.dis&&CFG.dis.length?CFG.dis:DIS0,rel=on("lists")&&CFG.rel&&CFG.rel.length?CFG.rel:REL0;
 fillSel("district",dis);fillSel("relation",rel);fillSel("fDi",dis,'<option value="">الكل</option>');fillSel("btRl",rel);fillSel("btDs",dis);
 cfForm();reqMarks();$("plB").classList.toggle("hidden",!PTs().length);$("miUi").classList.toggle("hidden",!on("ui"));applyUI();
 if(me&&canD&&!$("ad").classList.contains("hidden"))adTabs();
 devInit();render();if(mp)renderM()}
/* ---- الأخطاء ---- */
const REP={n:0,seen:new Map()};
function rep(k,m,c){try{if(!me||!on("errs"))return;m=String(m||"").slice(0,300);if(!m||/ResizeObserver|^Script error/.test(m)||REP.n>=30)return;const key=k+m,t=Date.now();if((REP.seen.get(key)||0)>t-3e5)return;REP.seen.set(key,t);REP.n++;
 setDoc(doc(collection(fs,"errors")),{u:me.name,k,m,c:String(c||"").slice(0,120),at:t,ua:devLabel()}).catch(()=>{})}catch{}}
addEventListener("error",e=>rep("js",(e.message||"خطأ")+(e.lineno?" @"+e.lineno:""),e.filename?String(e.filename).split("/").pop():""));
addEventListener("unhandledrejection",e=>{const r=e.reason;rep(r&&r.code==="permission-denied"?"perm":"js",(r&&(r.message||r.code))||String(r),"promise")});
/* ---- الأجهزة وإنهاء الجلسات ---- */
function devLabel(){const u=navigator.userAgent,b=/SamsungBrowser/.test(u)?"Samsung":/Edg\//.test(u)?"Edge":/OPR\//.test(u)?"Opera":/Firefox\//.test(u)?"Firefox":/Chrome\//.test(u)?"Chrome":/Safari\//.test(u)?"Safari":"متصفح",o=/Windows/.test(u)?"Windows":/Android/.test(u)?"Android":/iPhone/.test(u)?"iPhone":/iPad/.test(u)?"iPad":/Mac OS/.test(u)?"Mac":/Linux/.test(u)?"Linux":"";return b+(o?" · "+o:"")}
function devId(){let v=LS("did");if(!v||!/^[a-z0-9]{12}$/.test(v)){v=[...crypto.getRandomValues(new Uint8Array(12))].map(b=>(b%36).toString(36)).join("");LSS("did",v)}return v}
const devReset=()=>{try{Object.keys(localStorage).filter(k=>/^(kn|den)_/.test(k)).forEach(k=>localStorage.removeItem(k))}catch{}};
function killMe(){LSS("killed","1");wipe()}
function wk(key,n){const b=LS(key);if(b==null){LSS(key,n);return false}if(n>+b){if(Date.now()-KSELF<8e3){LSS(key,n);return false}return true}return false}
async function devInit(){if(DEVS||!me||!on("devs"))return;DEVS=1;const did=devId(),id=me.id+"_"+did,ref=doc(fs,"devices",id);DVID=id;
 try{const s=await getDoc(ref),now=Date.now(),ua=devLabel(),fresh=!sessionStorage.dvs;
  if(!s.exists())await setDoc(ref,{uid:me.id,u:me.name,did,ua,at:now,ls:now,n:1});else await updateDoc(ref,fresh?{ls:now,ua,u:me.name,n:increment(1)}:{ls:now,ua,u:me.name});
  try{sessionStorage.dvs=1}catch{}}catch{}
 onSnapshot(doc(fs,"kills",me.id),s=>{if(wk("kn_"+me.id,s.exists()?(s.data().n||0):0))killMe()},()=>{});
 onSnapshot(ref,s=>{if(s.exists()&&wk("den_"+id,s.data().en||0))killMe()},()=>{});
 setInterval(()=>{if(!document.hidden)updateDoc(ref,{ls:Date.now()}).catch(()=>{})},6e5)}
/* ---- التعلّم من التصحيح ---- */
const ncId=t=>[...t].map(c=>c.charCodeAt(0).toString(36).padStart(3,"0")).join("");
function learnApply(nm){if(!on("learn")||!nm||!NC.size)return{nm,ch:[]};const ch=[],out=nm.split(" ").map(t=>{const k=NF(t),e=NC.get(k);if(e){if(e.c!==t){ch.push([t,e.c]);return e.c}return t}
  if(k.length>=4){let b=null,bd=2;for(const[kk,v]of NC){if(Math.abs(kk.length-k.length)>1||v.n<2)continue;const d=lev(k,kk);if(d<bd){bd=d;b=v}}if(b&&b.c!==t){ch.push([t,b.c]);return b.c}}return t});return{nm:out.join(" "),ch}}
function learnFrom(raw,fin){if(!on("learn")||!me||!raw||!fin)return;const a=raw.split(" ").filter(Boolean),b=String(fin).trim().split(/\s+/);if(a.length!==b.length)return;
 a.forEach((t,i)=>{const c=b[i],k=NF(t);if(!k||k.length<2||c.length>30)return;const e=NC.get(k);
  if(t===c){if(e&&e.c!==t)setDoc(doc(fs,"nc",ncId(k)),{o:k,c:t,n:1,u:me.name,at:Date.now()}).catch(()=>{});return}
  if(lev(k,NF(c))>Math.max(3,k.length*.5))return;
  setDoc(doc(fs,"nc",ncId(k)),{o:k,c,n:(e&&e.c===c?e.n:0)+1,u:me.name,at:Date.now()}).catch(()=>{})})}
/* ---- البحث الذكي والأسماء المتشابهة ---- */
const tol=l=>l<=3?0:l<=8?1:l<=14?2:3,tolS=l=>l<=5?0:l<=9?1:l<=16?2:3;
function fuzzy(qs,have,ok,txt){const hs=new Set(have),qt=qs.split(" ").filter(Boolean);if(!qt.length||qt.some(t=>t.length<3||/\d/.test(t)))return[];const out=[];
 for(const r of recs){if(hs.has(r)||!ok(r))continue;const tk=NF(txt(r)).split(" ").filter(Boolean);let tot=0,all=true;
  for(const t of qt){const tl=tol(t.length);let b=99;for(const w of tk){if(w.includes(t)){b=0;break}if(Math.abs(w.length-t.length)>tl)continue;const d=lev(t,w);if(d<b)b=d}if(b>tl){all=false;break}tot+=b}
  if(all)out.push([tot,r])}
 return out.sort((a,b)=>a[0]-b[0]).slice(0,60).map(x=>x[1])}
function sims(nm,kind,ex){const q=NF(nm);if(q.length<4)return[];const t=tolS(q.length),out=[],dn=new Set((CFG.dis&&CFG.dis.length?CFG.dis:DIS0).map(NF));
 for(const r of recs){if(r.id===ex)continue;const names=kind==="p"?[r.personName]:[r.beneficiary,...(r.sk||[]).filter(s=>typeof s==="string"&&/[؀-ۿ]/.test(s)&&!dn.has(NF(s)))];let best=99,hit="";
  for(const n of names){if(!n)continue;const f=NF(n);if(Math.abs(f.length-q.length)>t)continue;const d=f===q?0:lev(q,f);if(d<=t&&d<best){best=d;hit=n}}
  if(best<=t)out.push({r,d:best,n:hit})}
 return out.sort((a,b)=>a.d-b.d).slice(0,5)}
function simShow(){const one=(id,v,k)=>{const L=on("fuzzy")&&v.length>=4&&!(sel||selB||(k==="p"&&tgt))?sims(v,k):[];$(id).innerHTML=L.length?'<span style="color:var(--mu)">⚠ مسجّل بأسماء مشابهة: </span>'+L.map(x=>`<button type="button" class="chip cb" data-a="simg" data-id="${esc(x.r.id)}">${esc(x.n||x.r.personName)}${x.d?"":" (مطابق)"}</button>`).join(""):""};one("simP",val("personName"),"p");one("simB",val("beneficiary"),"b")}
/* ---- تحسين صورة البطاقة قبل القراءة ---- */
const dims=src=>new Promise(ok=>{const i=new Image();i.onload=()=>ok({w:i.width,h:i.height});i.onerror=()=>ok({w:1,h:1});i.src=src});
async function rotsFor(src){if(!on("enh"))return[0];const d=await dims(src);return d.h>d.w*1.15?[90,270,0,180]:[0,180]}
function rotImg(i,d){const c=document.createElement("canvas"),sw=d===90||d===270;c.width=sw?i.height:i.width;c.height=sw?i.width:i.height;const x=c.getContext("2d");x.translate(c.width/2,c.height/2);x.rotate(d*Math.PI/180);x.drawImage(i,-i.width/2,-i.height/2);return c}
function skewAngle(c){const s=Math.min(1,700/c.width),w=Math.max(1,Math.round(c.width*s)),h=Math.max(1,Math.round(c.height*s)),t=document.createElement("canvas");t.width=w;t.height=h;const x=t.getContext("2d",{willReadFrequently:true});x.drawImage(c,0,0,w,h);const p=x.getImageData(0,0,w,h).data;let sum=0;for(let j=0;j<p.length;j+=4)sum+=p[j];
 const th=sum/(p.length/4)*.72,pts=[];for(let Y=0;Y<h;Y++)for(let X=0;X<w;X++)if(p[(Y*w+X)*4]<th)pts.push(X,Y);if(pts.length<400)return 0;
 const sc=a=>{const r=a*Math.PI/180,sn=Math.sin(r),cs=Math.cos(r),off=w*Math.abs(sn)+2,H=new Float64Array(Math.ceil(h*cs+off*2+4));for(let j=0;j<pts.length;j+=2)H[Math.round(pts[j+1]*cs-pts[j]*sn+off)]++;let q=0;for(let j=0;j<H.length;j++)q+=H[j]*H[j];return q};
 let b=0,bs=sc(0);const s0=bs;for(let a=-10;a<=10;a+=.5){const v=sc(a);if(v>bs){bs=v;b=a}}const c0=b;for(let a=c0-.5;a<=c0+.5;a+=.1){const v=sc(a);if(v>bs){bs=v;b=a}}
 return bs>s0*1.03&&Math.abs(b)>=.4?Math.round(b*10)/10:0}
function deskew(c){const a=skewAngle(c);if(!a)return c;const o=document.createElement("canvas");o.width=c.width;o.height=c.height;const x=o.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,o.width,o.height);x.translate(o.width/2,o.height/2);x.rotate(-a*Math.PI/180);x.drawImage(c,-c.width/2,-c.height/2);o.skew=a;return o}
/* ---- تخصيص الواجهة ---- */
const UIKEY=()=>"ui_"+(me?me.id:"x");
function uiLoad(){try{UIP={fs:100,co:[],hi:false,gp:"b",...JSON.parse(LS(UIKEY())||"{}")}}catch{UIP={fs:100,co:[],hi:false,gp:"b"}}}
function applyUI(){if(!me)return;uiLoad();const a=on("ui");document.documentElement.style.setProperty("--fz",a?UIP.fs/100:1);document.body.classList.toggle("gpt",a&&UIP.gp==="t")}
function uiDraw(){$("uiL").innerHTML=rowKeysFrom(UD.co).map((k,i)=>`<div class="li uil"><span style="flex:1">${esc(lbl(k))}</span><button class="ib" data-a="uic" data-id="u:${i}">▲</button><button class="ib" data-a="uic" data-id="d:${i}">▼</button></div>`).join("");$("uFs").value=String(UD.fs);$("uHi").checked=!!UD.hi;$("uGp").value=UD.gp}
function uiOpen(){uiLoad();UD=JSON.parse(JSON.stringify(UIP));UD.co=rowKeysFrom(UD.co);uiDraw();$("uGlW").classList.toggle("hidden",!canD);$("uGl").checked=false;$("ui").classList.remove("hidden")}
function uiOp(s){UD.fs=+$("uFs").value;UD.hi=$("uHi").checked;UD.gp=$("uGp").value;const[o,i]=s.split(":"),a=UD.co,x=+i,y=o==="u"?x-1:x+1;if(y<0||y>=a.length)return;[a[x],a[y]]=[a[y],a[x]];uiDraw()}
function cfGlobal(ord){const AN=CFA.map(a=>a[0]).filter(Boolean);let cur="";const af={},pos={};ord.forEach((k,i)=>{if(k.startsWith("cf_")){const id=k.slice(3);af[id]=cur;pos[id]=i}else if(AN.includes(k))cur=k});
 const L=(Array.isArray(CFG.cf)?CFG.cf:[]).filter(f=>!BIID.includes(f.id)).map(f=>({...f,af:f.id in af?af[f.id]:f.af||""}));
 L.sort((a,b)=>(pos[a.id]??1e9)-(pos[b.id]??1e9));return cfgSet({cf:L})}
async function uiSave(){UD.fs=+$("uFs").value;UD.hi=$("uHi").checked;UD.gp=$("uGp").value;const gl=canD&&$("uGl").checked,ord=[...UD.co];if(JSON.stringify(UD.co)===JSON.stringify(defKeys()))UD.co=[];LSS(UIKEY(),JSON.stringify(UD));applyUI();render();if(mp)renderM();
 if(gl){try{await cfGlobal(ord)}catch(e){say(err(e));rep(e&&e.code==="permission-denied"?"perm":"op",err(e||{}),"uiGl");return}}
 $("ui").classList.add("hidden");say(gl?"✓ حُفظ الترتيب وطُبّق موضع الحقول الإضافية على نموذج جميع المستخدمين.":"✓ حُفظ تخصيص الواجهة لحسابك على هذا الجهاز.",1)}
function uiReset(){try{localStorage.removeItem(UIKEY())}catch{}applyUI();render();if(mp)renderM();$("ui").classList.add("hidden");say("رُجعت الواجهة للوضع الافتراضي.",1)}
/* ---- قوالب الطباعة ---- */
const PAPERS=[["A4p","A4 عمودي"],["A4l","A4 أفقي"],["A5p","A5 عمودي"],["A5l","A5 أفقي"]],NUMK=new Set(["unified","birthDate","attendanceDate","pct","ac"]);
const PC=()=>[["personName","اسم الشهيد/المصاب"],["statusType","الحالة"],["pct","نسبة العجز"],["beneficiary","اسم المستفيد"],["relation","صلة القرابة"],["unified","رقم الموحدة"],["district","محل النفوس"],["birthDate","تاريخ الميلاد"],["attendanceDate","تاريخ الحضور"],["ac","عدد مرات الحضور"],["by","أضيف بواسطة"],...CFd().map(f=>["cf_"+f.id,f.lb])];
const plb=k=>(PC().find(a=>a[0]===k)||[0,k])[1];
function pv(r,x,k){if(k==="personName")return r.personName||"";if(k==="statusType")return r.statusType||"";if(k==="pct")return r.pct?r.pct+"%":"";if(k==="ac")return(x.att||[]).length;if(k==="by")return x.by||r.by||"";if(k.startsWith("cf_"))return(x.cf||{})[k.slice(3)]||"";return x[k]||""}
function pageCss(pp){let s=document.getElementById("pgs");if(!s){s=document.createElement("style");s.id="pgs";document.head.appendChild(s)}const m=/^(A\d)([pl])$/.exec(pp||"");s.textContent=m?`@page{size:${m[1]} ${m[2]==="l"?"landscape":"portrait"};margin:12mm}`:""}
const pHead=t=>`<div class="ph">${t.lg?'<img src="logo.png" alt="">':""}<div><h1>${esc(t.ti||"برنامج تأييد الحضور — كشف بيانات")}</h1><p class="pd">${new Date().toLocaleDateString("ar")}</p></div></div>`;
const pTbl=(cols,rows)=>`<table class="pt"><thead><tr><th>#</th>${cols.map(k=>`<th>${esc(plb(k))}</th>`).join("")}</tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i+1}</td>${r.map(v=>`<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
async function pGo(){const im=[...$("pr").querySelectorAll("img")];await Promise.all(im.map(i=>i.decode?i.decode().catch(()=>{}):0));document.body.classList.add("printing");document.body.style.overflow="";setTimeout(()=>print(),300)}
async function recItems(r){const m=isM(r.statusType),bl=m?(mp===r.id?bens:(await getDocs(query(collection(fs,"bens"),where("rid","==",r.id)))).docs.map(d=>({id:d.id,...d.data()})).filter(x=>!x.del)):[];return[...((r.beneficiary||!m)?[r]:[]),...bl]}
async function printTpl(r,L,t){const cols=t.cols.filter(k=>PC().some(a=>a[0]===k));pageCss(t.pp);let body;
 const hd=`<dl>${kv(ST[r.statusType]||"الاسم",r.personName)}${r.pct?kv("نسبة العجز",r.pct+"%",1):""}${isM(r.statusType)?kv("عدد المستفيدين",L.length,1):""}</dl>`;
 if(t.ty==="table")body=hd+pTbl(cols,L.map(x=>cols.map(k=>pv(r,x,k))));
 else{const P=[];for(const x of L){const im=[["p","الصورة الشخصية",x.photo&&x.photo.startsWith(JP)?x.photo:""],["f","الموحدة - الأمامي",x.hf&&(t.im||[]).includes("f")?await getImg(x.id+"_f"):""],["b","الموحدة - الخلفي",x.hb&&(t.im||[]).includes("b")?await getImg(x.id+"_b"):""]].filter(y=>y[2]&&(t.im||[]).includes(y[0]));
   P.push(`<section class="pb"><dl>${cols.map(k=>kv(plb(k),pv(r,x,k),NUMK.has(k))).join("")}</dl><div class="pi">${im.map(y=>`<figure><img src="${esc(y[2])}" alt=""><figcaption>${y[1]}</figcaption></figure>`).join("")}</div></section>`)}
  body=hd+P.join("")}
 $("pr").innerHTML=pHead(t)+body+(t.ft?`<p class="pf">${esc(t.ft)}</p>`:"");await pGo()}
async function printList(t){if(!t)return;if(!LASTF.length)return say("لا توجد سجلات لطباعتها.");say("جارٍ تجهيز القائمة…",1);const bs=await allB(),cols=t.cols.filter(k=>PC().some(a=>a[0]===k)),rows=[];
 for(const r of LASTF){const m=isM(r.statusType),L=[...((r.beneficiary||!m)?[r]:[]),...bs.filter(b=>b.rid===r.id)];(L.length?L:[{}]).forEach(x=>rows.push(cols.map(k=>pv(r,x,k))))}
 pageCss(t.pp);$("pr").innerHTML=pHead(t)+`<p class="pd">عدد الأسطر: ${rows.length}</p>`+pTbl(cols,rows)+(t.ft?`<p class="pf">${esc(t.ft)}</p>`:"");await pGo()}
async function printRec(id,t){const r=recs.find(x=>x.id===id);if(!r)return;say("جارٍ تجهيز الكشف…",1);const m=isM(r.statusType),L=await recItems(r);
 if(t)return printTpl(r,L,t);pageCss(null);const P=[];
 for(const x of L){const im=[["الصورة الشخصية",x.photo&&x.photo.startsWith(JP)?x.photo:""],["الموحدة - الأمامي",x.hf?await getImg(x.id+"_f"):""],["الموحدة - الخلفي",x.hb?await getImg(x.id+"_b"):""]].filter(y=>y[1]);
  P.push(`<section class="pb"><dl>${rows(x).replace("<details>","<details open>")}</dl><div class="pi">${im.map(y=>`<figure><img src="${esc(y[1])}" alt=""><figcaption>${y[0]}</figcaption></figure>`).join("")}</div></section>`)}
 $("pr").innerHTML=`<h1>برنامج تأييد الحضور — كشف بيانات</h1><p class="pd">${new Date().toLocaleDateString("ar")} · ${esc(r.statusType)}</p><dl>${kv(ST[r.statusType]||"الاسم",r.personName)}${r.pct?kv("نسبة العجز",r.pct+"%",1):""}${m?kv("عدد المستفيدين",L.length,1):""}</dl>${P.join("")}`;
 await pGo()}
function printStart(id){const T=PTs();if(!T.length)return printRec(id);if(T.length===1)return printRec(id,T[0]);PRID=id;psDraw(id!=="*")}
function psDraw(def){let l="";try{l=localStorage.ptl||""}catch{}$("psl").innerHTML=PTs().map(t=>`<button class="mi" data-a="pts" data-id="${esc(t.id)}"${t.id===l?' style="border-color:var(--p)"':""}>${esc(t.n)}</button>`).join("")+(def?'<button class="mi" data-a="pts" data-id="">كشف افتراضي</button>':"");$("ps").classList.remove("hidden")}
/* ---- لوحة المدير ---- */
const ADT=()=>[["ft","⚙ الميزات",1],["ls","📋 القوائم","lists"],["cf","🧩 الحقول","cfld"],["rq","✱ الإلزامي","req"],["pt","🖨 القوالب","ptpl"],["er","🐞 الأخطاء","errs"],["dv","💻 الأجهزة","devs"],["lr","🧠 التعلّم","learn"]].filter(t=>t[2]===1||on(t[2]));
function adTabs(){if(!ADT().some(t=>t[0]===ADK))ADK="ft";$("adt").innerHTML=ADT().map(t=>`<button class="tab${t[0]===ADK?" on":""}" data-a="adk" data-id="${t[0]}">${t[1]}</button>`).join("")}
function adOpen(){if(!canD)return;$("ad").classList.remove("hidden");document.body.style.overflow="hidden";adTab(ADK)}
function adTab(k){ADK=k;ER=null;DV=null;const cl=o=>JSON.parse(JSON.stringify(o));
 if(k==="ls")DR={dis:[...(CFG.dis&&CFG.dis.length?CFG.dis:DIS0)],rel:[...(CFG.rel&&CFG.rel.length?CFG.rel:REL0)]};
 else if(k==="cf")DR={cf:cl(Array.isArray(CFG.cf)?CFG.cf.filter(f=>!BIID.includes(f.id)):[])};
 else if(k==="rq")DR={rq:new Set(Array.isArray(CFG.rq)?CFG.rq:[...BF,"pct"])};
 else if(k==="pt")DR={pt:cl(Array.isArray(CFG.pt)?CFG.pt:[])};
 else DR=null;adTabs();adBody()}
const ftH=()=>`<div class="cd" style="margin-top:12px"><h2>الميزات</h2><small style="color:var(--mu)">أطفئ أي ميزة لتختفي من البرنامج ومن لوحة التحكم عند جميع المستخدمين. الإطفاء لا يحذف أي بيانات.</small>${FT.map(f=>`<label class="tgl"><input type="checkbox" data-ad="ft" data-j="${f[0]}"${on(f[0])?" checked":""}><span><b>${f[1]}</b><small>${f[2]}</small></span></label>`).join("")}</div>`;
const lsBox=(w,t)=>`<div class="cd" style="margin-top:12px"><h2>${t}</h2>${DR[w].map((v,i)=>`<div class="li"><input type="text" data-ad="li" data-w="${w}" data-i="${i}" value="${esc(v)}" maxlength="40"><button class="ib" data-a="adc" data-id="lu:${w}:${i}">▲</button><button class="ib" data-a="adc" data-id="ld:${w}:${i}">▼</button><button class="ib" data-a="adc" data-id="lx:${w}:${i}">✕</button></div>`).join("")}<div class="li"><input type="text" id="lsn_${w}" placeholder="إضافة جديد…" maxlength="40"><button class="b add" data-a="adc" data-id="la:${w}">＋ إضافة</button></div></div>`;
const lsH=()=>lsBox("dis","📍 محل النفوس")+lsBox("rel","👪 صلة القرابة")+`<div class="ac"><button class="b add" data-a="adc" data-id="lss">💾 حفظ القوائم</button><button class="b" data-a="adc" data-id="lr0">↺ القوائم الافتراضية</button></div><small style="color:var(--mu)">تغيير اسم عنصر لا يغيّر السجلات القديمة؛ تبقى قيمتها كما كُتبت وتظهر عند تعديلها.</small>`;
const listOf=k=>[...$(k).options].slice(1).map(o=>o.text),sopt=(arr,v)=>arr.map(o=>`<option value="${esc(o[0])}"${o[0]===v?" selected":""}>${esc(o[1])}</option>`).join("");
const cfRow=(f,i)=>{const wk=(f.w&&f.w.k)||"",wv=(f.w&&f.w.v)||"",wl=wk?listOf(wk):[];if(wk&&wv&&!wl.includes(wv))wl.push(wv);
 return `<div class="cd cfr"><div class="cfh"><b>${i+1}</b><span>${esc(f.lb||"حقل جديد")}</span></div><div class="gr">
<div class="fw"><label>اسم الحقل</label><input type="text" data-ad="cfl" data-i="${i}" value="${esc(f.lb)}" maxlength="40"></div>
<div><label>النوع</label><select data-ad="cft" data-i="${i}">${sopt([["text","نص"],["number","رقم"],["date","تاريخ"],["list","قائمة اختيار"]],f.t)}</select></div>
<div><label>عرض الحقل</label><select data-ad="cfw" data-i="${i}">${sopt([["0","نصف السطر"],["1","السطر كاملًا"]],f.fw?"1":"0")}</select></div>
<div class="fw"><label>موضع الظهور في النموذج (يظهر تحت الحقل المختار)</label><select data-ad="cfa" data-i="${i}">${sopt(CFA,f.af||"")}</select></div>
<div class="fw"><label>شرط الظهور</label><select data-ad="cwk" data-i="${i}">${sopt([["","يظهر دائمًا"],["district","يظهر عند اختيار محل نفوس معيّن"],["relation","يظهر عند اختيار صلة قرابة معيّنة"]],wk)}</select></div>
${wk?`<div class="fw"><label>القيمة التي تُظهر الحقل</label><select data-ad="cwv" data-i="${i}">${sopt([["","— اختر القيمة —"],...wl.map(x=>[x,x])],wv)}</select>${wv?"":'<small style="color:var(--r);display:block;margin-top:4px">⚠ اختر القيمة، وإلا لن يُحفظ الشرط.</small>'}<small style="color:var(--mu);display:block;margin-top:4px">يظهر الحقل عندما يكون «${wk==="district"?"محل النفوس":"صلة القرابة"}» = «${esc(wv||"؟")}»</small></div>`:""}
${f.t==="list"?`<div class="fw"><label>الخيارات (افصل بينها بفاصلة)</label><input type="text" data-ad="cfo" data-i="${i}" value="${esc((f.o||[]).join("، "))}"></div>`:""}</div>
<div class="rb"><button class="b" data-a="adc" data-id="cu:${i}">▲ أعلى</button><button class="b" data-a="adc" data-id="cd:${i}">▼ أسفل</button><button class="b del" data-a="adc" data-id="cx:${i}">✕ حذف</button></div></div>`};
const cfH=()=>{return `<small style="color:var(--mu);display:block;margin-top:12px">كل تغيير هنا يسري على جميع المستخدمين فور الحفظ. «موضع الظهور» يضع الحقل تحت الحقل الذي تختاره في النموذج والبطاقة، و▲▼ ترتّب الحقول التي تشترك في الموضع نفسه. «شرط الظهور» يخفي الحقل حتى يُختار محل النفوس أو صلة القرابة المطلوبة.</small>
<div class="cd cfr"><div class="cfh"><b>⚡</b><span>حقول المحافظات (مدمجة تلقائيًا)</span></div><small style="color:var(--mu);display:block">عند اختيار «محافظات» في محل النفوس يظهر تحته تلقائيًا حقلان: «اسم المحافظة» (19 محافظة) و«محل النفوس في المحافظة المختارة». لا تحتاج إلى إضافتهما.</small></div>
${DR.cf.map(cfRow).join("")}<div class="rb"><button class="b" data-a="adc" data-id="cfa">＋ حقل جديد</button><button class="b add" data-a="adc" data-id="cfs">💾 حفظ الحقول</button></div>`};
const rqH=()=>{const L=[...BF,"pct",...CFd().map(f=>"cf_"+f.id)];return `<div class="cd" style="margin-top:12px"><h2>الحقول الإلزامية</h2><small style="color:var(--mu)">الحقول المعلَّمة لا يُحفظ السجل بدونها. الاسم والحالة واسم المستفيد إلزامية دائمًا. «نسبة العجز» تخص المصابين فقط.</small>${[...LOCK,...L].map(k=>`<label class="tgl"><input type="checkbox" data-ad="rq" data-j="${k}"${LOCK.includes(k)||DR.rq.has(k)?" checked":""}${LOCK.includes(k)?" disabled":""}><span><b>${esc(lbl(k))}</b></span></label>`).join("")}</div><div class="ac"><button class="b add" data-a="adc" data-id="rqs">💾 حفظ</button></div>`};
const ptRow=(t,i)=>{const all=PC(),ids=all.map(a=>a[0]),sel_=t.cols.filter(k=>ids.includes(k)),ord=[...sel_,...ids.filter(k=>!sel_.includes(k))];
 return `<div class="cd" style="margin-top:10px"><div class="gr"><div><label>اسم القالب</label><input type="text" data-ad="ptn" data-i="${i}" value="${esc(t.n)}" maxlength="40"></div><div><label>الورق</label><select data-ad="ptp" data-i="${i}">${PAPERS.map(p=>`<option value="${p[0]}"${t.pp===p[0]?" selected":""}>${p[1]}</option>`).join("")}</select></div><div class="fw"><label>عنوان الصفحة</label><input type="text" data-ad="ptt" data-i="${i}" value="${esc(t.ti||"")}" maxlength="80" placeholder="برنامج تأييد الحضور — كشف بيانات"></div><div><label>الشكل</label><select data-ad="pty" data-i="${i}"><option value="table"${t.ty==="table"?" selected":""}>جدول</option><option value="card"${t.ty==="card"?" selected":""}>بطاقات (مع الصور)</option></select></div><div><label>نص أسفل الصفحة</label><input type="text" data-ad="ptf" data-i="${i}" value="${esc(t.ft||"")}" maxlength="120"></div></div>
<label class="tgl"><input type="checkbox" data-ad="ptl" data-i="${i}"${t.lg?" checked":""}><span><b>إظهار الشعار</b></span></label>
${t.ty==="card"?`<label style="margin-top:8px">الصور المطبوعة</label><div class="ac" style="margin:0">${[["p","الشخصية"],["f","الموحدة أمامي"],["b","الموحدة خلفي"]].map(o=>`<label class="ck"><input type="checkbox" data-ad="pti" data-i="${i}" data-j="${o[0]}"${(t.im||[]).includes(o[0])?" checked":""}> ${o[1]}</label>`).join("")}</div>`:""}
<label style="margin-top:10px">الأعمدة (حدّد ورتّب)</label>${ord.map(k=>{const s=sel_.includes(k);return `<div class="li"><label class="ck" style="flex:1;margin:0"><input type="checkbox" data-ad="ptc" data-i="${i}" data-j="${k}"${s?" checked":""}> ${esc(plb(k))}</label>${s?`<button class="ib" data-a="adc" data-id="pu:${i}:${k}">▲</button><button class="ib" data-a="adc" data-id="pd:${i}:${k}">▼</button>`:""}</div>`}).join("")}
<div class="ac"><button class="b del" data-a="adc" data-id="px:${i}">✕ حذف القالب</button></div></div>`};
const ptH=()=>`<small style="color:var(--mu);display:block;margin-top:12px">القوالب تظهر للجميع عند الطباعة. زر «طباعة القائمة» في صفحة السجلات يطبع نتائج البحث الحالية بالقالب المختار.</small>${DR.pt.map(ptRow).join("")}<div class="ac"><button class="b" data-a="adc" data-id="pta">＋ قالب جديد</button><button class="b add" data-a="adc" data-id="pts">💾 حفظ القوالب</button></div>`;
const EK={img:"🖼 رفع صورة",net:"📡 اتصال",perm:"⛔ صلاحية",ocr:"🔎 قراءة آلية",js:"💥 خطأ برمجي",op:"⚠ عملية"};
async function erLoad(){ER=(await getDocs(query(collection(fs,"errors"),orderBy("at","desc"),limit(300)))).docs.map(d=>({id:d.id,...d.data()}))}
function erH(){const c={};ER.forEach(e=>c[e.k]=(c[e.k]||0)+1);const L=ER.filter(e=>!ERF||e.k===ERF);
 return `<div class="cd" style="margin-top:12px"><div class="ac" style="margin:0 0 8px"><button class="b${ERF?"":" add"}" data-a="adc" data-id="erf:">الكل (${ER.length})</button>${Object.keys(EK).filter(k=>c[k]).map(k=>`<button class="b${ERF===k?" add":""}" data-a="adc" data-id="erf:${k}">${EK[k]} (${c[k]})</button>`).join("")}<button class="b" data-a="adc" data-id="err">↻ تحديث</button><button class="b del" data-a="adc" data-id="era">حذف الكل</button></div>${L.map(e=>`<div class="ev"><i>${esc((EK[e.k]||"⚠").split(" ")[0])}</i><div><b>${esc(e.u)}</b> — ${esc(e.m)}<small>${esc(EK[e.k]||e.k)}${e.c?" · "+esc(e.c):""} · ${esc(e.ua||"")} · ${new Date(e.at).toLocaleString("ar",{dateStyle:"short",timeStyle:"short"})}</small></div><button class="b del" data-a="adc" data-id="erx:${esc(e.id)}">✕</button></div>`).join("")||'<div class="st">✓ لا توجد أخطاء مسجّلة.</div>'}</div>`}
async function dvLoad(){DV=(await getDocs(query(collection(fs,"devices"),limit(500)))).docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.ls-a.ls)}
const ago=t=>{const s=(Date.now()-t)/1e3;return s<90?"الآن":s<3600?Math.round(s/60)+" دقيقة":s<86400?Math.round(s/3600)+" ساعة":Math.round(s/86400)+" يومًا"};
function dvH(){const g={};DV.forEach(d=>(g[d.uid]=g[d.uid]||[]).push(d));
 return `<small style="color:var(--mu);display:block;margin-top:12px">إنهاء الجلسة يُخرج الجهاز عند اتصاله بالإنترنت ويمسح البيانات المحفوظة عليه، لكن يستطيع صاحبه الدخول من جديد بكلمة سره. لمنعه تمامًا استعمل «تعطيل» أو غيّر كلمة سره.</small>`+(Object.values(g).map(L=>`<div class="cd" style="margin-top:12px"><div class="mph" style="margin:0 0 6px"><h2 style="margin:0;flex:1">👤 ${esc(L[0].u)}</h2><button class="b del" data-a="adc" data-id="dvu:${esc(L[0].uid)}">🚪 إنهاء كل جلساته</button></div>${L.map(d=>`<div class="ev"><i>${/Android|iPhone|iPad/.test(d.ua||"")?"📱":"💻"}</i><div><b>${esc(d.ua)}</b>${d.id===DVID?' <span class="nw" style="background:var(--p)">هذا الجهاز</span>':""}<small>آخر ظهور: ${ago(d.ls)} — أول دخول: ${new Date(d.at).toLocaleDateString("ar")} — مرات الدخول: ${d.n||1}</small></div>${d.id===DVID?"":`<button class="b del" data-a="adc" data-id="dvx:${esc(d.id)}">إنهاء</button>`}</div>`).join("")}</div>`).join("")||'<div class="st">لا توجد أجهزة مسجّلة بعد.</div>')}
const lrH=()=>{const L=[...NC.values()].sort((a,b)=>b.n-a.n);return `<div class="cd" style="margin-top:12px"><h2>🧠 التصحيحات المتعلَّمة (${L.length})</h2><small style="color:var(--mu)">كل ما صحّحه المستخدمون في أسماء القراءة الآلية. يُطبَّق تلقائيًا في القراءة التالية. احذف ما تراه خاطئًا.</small>${L.map(x=>`<div class="ev"><div><b>${esc(x.o)}</b> ← <b style="color:var(--p)">${esc(x.c)}</b><small>${x.n} مرة · ${esc(x.u||"")}</small></div><button class="b del" data-a="adc" data-id="lrx:${esc(x.id)}">✕</button></div>`).join("")||'<div class="st">لم يتعلّم البرنامج شيئًا بعد.</div>'}</div>`};
async function adBody(){const b=$("adb"),k=ADK;try{
 if(k==="ft")b.innerHTML=ftH();else if(k==="ls")b.innerHTML=lsH();else if(k==="cf")b.innerHTML=cfH();else if(k==="rq")b.innerHTML=rqH();else if(k==="pt")b.innerHTML=ptH();else if(k==="lr")b.innerHTML=lrH();
 else if(k==="er"){if(!ER){b.innerHTML='<div class="st">جارٍ التحميل…</div>';await erLoad()}if(ADK===k)b.innerHTML=erH()}
 else if(k==="dv"){if(!DV){b.innerHTML='<div class="st">جارٍ التحميل…</div>';await dvLoad()}if(ADK===k)b.innerHTML=dvH()}
 }catch(e){b.innerHTML='<div class="st">'+esc(err(e)+(e.code==="permission-denied"?" — انشر آخر firestore.rules.":""))+'</div>'}}
const cfgSet=o=>setDoc(CFGR(),{...o,at:Date.now(),by:me.name},{merge:true});
const mvA=(a,i,d)=>{const j=i+d;if(i<0||j<0||j>=a.length||i>=a.length)return;[a[i],a[j]]=[a[j],a[i]]};
async function adOp(s){const[op,a,b]=s.split(":");
 switch(op){
  case"lu":mvA(DR[a],+b,-1);break;case"ld":mvA(DR[a],+b,1);break;case"lx":DR[a].splice(+b,1);break;
  case"la":{const v=$("lsn_"+a).value.trim();if(!v)return say("اكتب الاسم أولًا.");if(DR[a].includes(v))return say("هذا الاسم موجود مسبقًا.");DR[a].push(v);break}
  case"lr0":DR.dis=[...DIS0];DR.rel=[...REL0];break;
  case"lss":{const c=x=>[...new Set(x.map(y=>String(y).trim()).filter(Boolean))].slice(0,80);await cfgSet({dis:c(DR.dis),rel:c(DR.rel)});say("✓ حُفظت القوائم.",1);return}
  case"cfa":if(DR.cf.length>=18)return say("الحد الأقصى 18 حقلًا مخصصًا.");DR.cf.push({id:"f"+Math.random().toString(36).slice(2,7),lb:"",t:"text",o:[],af:"",fw:0,w:null});break;
  case"cfg":{if(DR.cf.length>18)return say("الحد الأقصى 20 حقلًا.");const w={k:"district",v:listOf("district").find(x=>NF(x)===NF("محافظات"))||"محافظات"};if(!DR.cf.some(f=>f.id==="gov"))DR.cf.push({id:"gov",lb:"اسم المحافظة",t:"list",o:[...GOV],af:"district",fw:0,w:{...w}});if(!DR.cf.some(f=>f.id==="gnf"))DR.cf.push({id:"gnf",lb:"محل النفوس",t:"text",o:[],af:"district",fw:0,w:{...w}});if(!listOf("district").includes("محافظات"))say("تنبيه: أضف «محافظات» إلى قائمة محل النفوس (تبويب القوائم) حتى يعمل الشرط.");break}
  case"cu":mvA(DR.cf,+a,-1);break;case"cd":mvA(DR.cf,+a,1);break;
  case"cx":if(!ask("cx"+a,"اضغط مرة أخرى لحذف الحقل (بياناته المدخلة تبقى محفوظة ومخفية)."))return;DR.cf.splice(+a,1);break;
  case"cfs":{const L=DR.cf.map(f=>({id:f.id,lb:String(f.lb||"").trim().slice(0,40),t:f.t,o:f.t==="list"?(f.o||[]).slice(0,40):[],af:CFA.some(a=>a[0]===f.af)?f.af||"":"",fw:f.fw?1:0,w:f.w&&f.w.k&&f.w.v?{k:f.w.k,v:String(f.w.v).slice(0,60)}:null}));if(L.some(f=>!f.lb))return say("اكتب اسمًا لكل حقل.");{const x=DR.cf.find(f=>f.w&&f.w.k&&!f.w.v);if(x)return say("حدّد القيمة التي تُظهر الحقل «"+(x.lb||"جديد")+"» في «شرط الظهور».")}if(new Set(L.map(f=>f.lb)).size!==L.length)return say("يجب أن تختلف أسماء الحقول.");if(L.some(f=>f.t==="list"&&!f.o.length))return say("حقل القائمة يحتاج خيارًا واحدًا على الأقل.");await cfgSet({cf:L});say("✓ حُفظت الحقول.",1);return}
  case"rqs":await cfgSet({rq:[...DR.rq].filter(k=>!LOCK.includes(k))});say("✓ حُفظت الحقول الإلزامية.",1);return;
  case"pta":if(DR.pt.length>=12)return say("الحد الأقصى 12 قالبًا.");DR.pt.push({id:"t"+Math.random().toString(36).slice(2,7),n:"قالب جديد",ti:"",ty:"table",pp:"A4l",lg:1,im:["p","f","b"],cols:["personName","beneficiary","relation","unified","district","birthDate","attendanceDate"],ft:""});break;
  case"px":if(!ask("px"+a,"اضغط مرة أخرى لحذف القالب."))return;DR.pt.splice(+a,1);break;
  case"pu":{const c=DR.pt[+a].cols;mvA(c,c.indexOf(b),-1);break}case"pd":{const c=DR.pt[+a].cols;mvA(c,c.indexOf(b),1);break}
  case"pts":{const L=DR.pt.map(t=>({id:t.id,n:String(t.n||"").trim().slice(0,40),ti:String(t.ti||"").slice(0,80),ty:t.ty==="card"?"card":"table",pp:PAPERS.some(p=>p[0]===t.pp)?t.pp:"A4p",lg:t.lg?1:0,im:(t.im||[]).filter(x=>["p","f","b"].includes(x)),cols:t.cols.slice(0,30),ft:String(t.ft||"").slice(0,120)}));if(L.some(t=>!t.n))return say("اكتب اسمًا لكل قالب.");if(L.some(t=>!t.cols.length))return say("اختر عمودًا واحدًا على الأقل في كل قالب.");await cfgSet({pt:L});say("✓ حُفظت القوالب.",1);return}
  case"erf":ERF=a||"";break;case"err":ER=null;break;
  case"erx":await deleteDoc(doc(fs,"errors",a));ER=ER.filter(e=>e.id!==a);break;
  case"era":{if(!ask("era","اضغط مرة أخرى لحذف كل سجل الأخطاء."))return;for(let i=0;i<ER.length;i+=400){const w=writeBatch(fs);ER.slice(i,i+400).forEach(e=>w.delete(doc(fs,"errors",e.id)));await w.commit()}ER=[];break}
  case"dvx":if(!ask("dv"+a,"اضغط مرة أخرى لإنهاء جلسة هذا الجهاز."))return;await updateDoc(doc(fs,"devices",a),{en:increment(1)});say("✓ سيُخرَج الجهاز عند اتصاله بالإنترنت.",1);return;
  case"dvu":if(!ask("dvu"+a,"اضغط مرة أخرى لإنهاء كل جلسات هذا المستخدم."))return;if(a===me.id)KSELF=Date.now();await setDoc(doc(fs,"kills",a),{n:increment(1),by:me.name,at:Date.now()},{merge:true});say("✓ أُنهيت الجلسات"+(a===me.id?" الأخرى (جهازك الحالي باقٍ)":"")+".",1);return;
  case"lrx":await deleteDoc(doc(fs,"nc",a));break;
 }
 adBody()}
function adIn(e){const t=e.target,k=t.dataset&&t.dataset.ad;if(!k)return;const i=+t.dataset.i,j=t.dataset.j;
 if(k==="ft")return guard(()=>cfgSet({feat:{...(CFG.feat||{}),[j]:t.checked}}),"meta/config");
 if(!DR)return;
 if(k==="li")DR[t.dataset.w][i]=t.value;else if(k==="cfl")DR.cf[i].lb=t.value;else if(k==="cft"){DR.cf[i].t=t.value;adBody()}
 else if(k==="cfw")DR.cf[i].fw=+t.value;else if(k==="cfa")DR.cf[i].af=t.value;else if(k==="cwk"){DR.cf[i].w=t.value?{k:t.value,v:""}:null;adBody()}else if(k==="cwv")DR.cf[i].w.v=t.value;
 else if(k==="cfo")DR.cf[i].o=t.value.split(/[،,]/).map(x=>x.trim()).filter(Boolean);
 else if(k==="rq")t.checked?DR.rq.add(j):DR.rq.delete(j);
 else if(k==="ptn")DR.pt[i].n=t.value;else if(k==="ptt")DR.pt[i].ti=t.value;else if(k==="ptf")DR.pt[i].ft=t.value;else if(k==="ptp")DR.pt[i].pp=t.value;
 else if(k==="pty"){DR.pt[i].ty=t.value;adBody()}else if(k==="ptl")DR.pt[i].lg=t.checked?1:0;
 else if(k==="pti"){const m=DR.pt[i].im=DR.pt[i].im||[],x=m.indexOf(j);t.checked?x<0&&m.push(j):x>=0&&m.splice(x,1)}
 else if(k==="ptc"){const c=DR.pt[i].cols,x=c.indexOf(j);t.checked?x<0&&c.push(j):x>=0&&c.splice(x,1);adBody()}}
addEventListener("input",e=>{if(e.target.matches&&e.target.matches('input[type=text],textarea'))adIn(e)});
addEventListener("change",e=>{if(e.target.matches&&!e.target.matches('input[type=text],textarea'))adIn(e)});
["personName","beneficiary"].forEach(i=>$(i).addEventListener("input",()=>{clearTimeout(SIT);SIT=setTimeout(simShow,350)}));
function v23start(){
 onSnapshot(doc(fs,"meta","config"),s=>{CFG=s.exists()?s.data():{};applyCfg()},e=>say(err(e)+" [meta/config] — انشر آخر firestore.rules."));
 onSnapshot(query(collection(fs,"nc"),limit(3000)),s=>{NC=new Map();s.docs.forEach(d=>{const x=d.data();NC.set(NF(x.o),{id:d.id,...x})})},()=>{})}
Object.assign(A,{ad:adOpen,adx:()=>{$("ad").classList.add("hidden");document.body.style.overflow=""},adk:id=>adTab(id),adc:id=>adOp(id),
 ui:uiOpen,uix:()=>$("ui").classList.add("hidden"),uis:uiSave,uiz:uiReset,uic:id=>uiOp(id),
 pr:id=>printStart(id),prm:()=>printStart(mp),plr:()=>{if(!PTs().length)return say("لا توجد قوالب طباعة. أنشئ قالبًا من لوحة المدير.");PRID="*";if(PTs().length===1)return printList(PTs()[0]);psDraw(false)},
 pts:id=>{$("ps").classList.add("hidden");const t=PTs().find(x=>x.id===id)||null;LSS("ptl",id||"");return PRID==="*"?printList(t||PTs()[0]):printRec(PRID,t)},psx:()=>$("ps").classList.add("hidden"),
 simg:id=>{const r=recs.find(x=>x.id===id);if(!r)return;isM(r.statusType)?openM(id):pick(id)}});
if(!navigator.onLine)OFFT=Date.now();
try{if(LS("killed")){localStorage.removeItem("killed");lm("أنهى المدير جلستك على هذا الجهاز. سجّل الدخول من جديد.")}}catch{}
["district","relation"].forEach(i=>$(i).addEventListener("change",cfShow));
