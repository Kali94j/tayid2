import {initializeApp} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,onAuthStateChanged,deleteUser,updatePassword,reauthenticateWithCredential,EmailAuthProvider,setPersistence,browserLocalPersistence,browserSessionPersistence} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {initializeFirestore,collection,doc,getDoc,setDoc,updateDoc,deleteDoc,query,orderBy,onSnapshot,writeBatch,where,increment,arrayUnion,getDocs,limit,terminate,clearIndexedDbPersistence,persistentLocalCache,persistentMultipleTabManager,getCountFromServer} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
const cfg={apiKey:"AIzaSyDwQzQe_JRN4ENr95ov_Cgpo6qYLWXAZ6U",authDomain:"tayid2.firebaseapp.com",projectId:"tayid2",storageBucket:"tayid2.firebasestorage.app",messagingSenderId:"516822353811",appId:"1:516822353811:web:67848b3dc2ee79be80ca66"};
const LS=k=>{try{return localStorage[k]}catch{return null}};
const app=initializeApp(cfg),auth=getAuth(app),fs=initializeFirestore(app,{experimentalAutoDetectLongPolling:true,...(LS("offm")!=="0"?{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})}:{})}),auth2=getAuth(initializeApp(cfg,"sec"));
const APPCHECK_KEY="";
if(APPCHECK_KEY){const m=await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app-check.js");m.initializeAppCheck(app,{provider:new m.ReCaptchaV3Provider(APPCHECK_KEY),isTokenAutoRefreshEnabled:true})}
const $=i=>document.getElementById(i),val=i=>$(i).value.trim(),JP="data:image/jpeg;base64,";
const F=["personName","statusType","beneficiary","relation","unified","district","birthDate","attendanceDate"];
const LB={personName:"الاسم",statusType:"الحالة",beneficiary:"اسم المستفيد",relation:"صلة القرابة",unified:"رقم الموحدة",district:"محل النفوس",birthDate:"تاريخ الميلاد",attendanceDate:"تاريخ الحضور",pct:"نسبة العجز"};
const RN={user:"مستخدم",editor:"محرر",admin:"مدير"},TL={p:"👤 الصورة الشخصية",f:"🪪 الموحدة: الوجه الأمامي",b:"🪪 الموحدة: الوجه الخلفي"};
let trR=[],ou="",ob=null,lim=20,recs=[],sel=null,selB=null,tgt=null,mp=null,unB=null,bens=[],pend={},me=null,started=false,busy=false,setup=false,tt,idle,armed={},canE=false,canD=false;
const RC=collection(fs,"records");
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const E={"auth/invalid-credential":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/user-not-found":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/wrong-password":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/weak-password":"كلمة السر ضعيفة.","auth/email-already-in-use":"هذا الاسم مستخدم مسبقًا.","auth/network-request-failed":"لا يوجد اتصال بالإنترنت.","auth/too-many-requests":"محاولات كثيرة، حاول لاحقًا.","permission-denied":"رفض Firebase هذه العملية. إن كنت مديرًا فانشر آخر نسخة من firestore.rules في Firebase ← Rules."};
const err=e=>E[e.code]||e.message||"حدث خطأ";
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
function csvText(bs){const H=["الحالة","اسم الشهيد/المصاب","نسبة العجز","اسم المستفيد","صلة القرابة","رقم الموحدة","محل النفوس","تاريخ الميلاد","تاريخ الحضور","عدد مرات الحضور","أضيف بواسطة"],R=[];
 recs.forEach(r=>{const l=[...((r.beneficiary||!isM(r.statusType))?[r]:[]),...bs.filter(b=>b.rid===r.id)];(l.length?l:[{}]).forEach(x=>R.push([r.statusType,r.personName,r.pct?r.pct+"%":"",x.beneficiary,x.relation,x.unified,x.district,x.birthDate,x.attendanceDate,(x.att||[]).length,x.by||r.by]))});
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
const RK=["personName","statusType","beneficiary","relation","unified","district","birthDate","attendanceDate","benKey","photo","hf","hb","by","createdAt","updatedAt","pct","bc","sk","ld","att"],BK=["rid","beneficiary","relation","unified","district","birthDate","attendanceDate","benKey","photo","hf","hb","by","createdAt","updatedAt","att"];
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
function chkBk(){let lb=0;try{lb=+localStorage.lb||0}catch{}const d=Math.floor((Date.now()-lb)/864e5);$("bkn").classList.toggle("hidden",!!lb&&d<14);$("bkt").textContent=lb?"⚠ آخر نسخة احتياطية منذ "+d+" يومًا.":"⚠ لم تُحمَّل أي نسخة احتياطية بعد."}
const okBk=()=>{try{localStorage.lb=Date.now()}catch{}chkBk()};
async function getImg(k){let d=IC.get(k);if(!d){const s=await getDoc(doc(fs,"images",k));d=s.exists()&&s.data().d;if(d&&d.startsWith(JP))IC.set(k,d);else d=""}return d}
async function printRec(id){const r=recs.find(x=>x.id===id);if(!r)return;say("جارٍ تجهيز الكشف…",1);
 const m=isM(r.statusType),bl=m?(mp===id?bens:(await getDocs(query(collection(fs,"bens"),where("rid","==",id)))).docs.map(d=>({id:d.id,...d.data()}))):[],L=[...((r.beneficiary||!m)?[r]:[]),...bl],P=[];
 for(const x of L){const im=[["الصورة الشخصية",x.photo&&x.photo.startsWith(JP)?x.photo:""],["الموحدة - الأمامي",x.hf?await getImg(x.id+"_f"):""],["الموحدة - الخلفي",x.hb?await getImg(x.id+"_b"):""]].filter(y=>y[1]);
  P.push(`<section class="pb"><dl>${rows(x).replace("<details>","<details open>")}</dl><div class="pi">${im.map(y=>`<figure><img src="${esc(y[1])}" alt=""><figcaption>${y[0]}</figcaption></figure>`).join("")}</div></section>`)}
 $("pr").innerHTML=`<h1>برنامج تأييد الحضور — كشف بيانات</h1><p class="pd">${new Date().toLocaleDateString("ar")} · ${esc(r.statusType)}</p><dl>${kv(ST[r.statusType]||"الاسم",r.personName)}${r.pct?kv("نسبة العجز",r.pct+"%",1):""}${m?kv("عدد المستفيدين",L.length,1):""}</dl>${P.join("")}`;
 document.body.classList.add("printing");document.body.style.overflow="";setTimeout(()=>print(),300)}
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
 const rels=[...$("relation").options].slice(1).map(o=>o.text),dis=[...$("district").options].slice(1).map(o=>o.text),ok=[],bad=[],seen=new Set();
 R.slice(1).forEach((r,i)=>{const g=k=>String(r[ix(k)]==null?"":r[ix(k)]).trim(),o={st:g("st"),pn:g("pn"),pc:g("pc").replace("%",""),bn:g("bn"),rl:g("rl"),un:g("un"),ds:g("ds"),bd:dte(g("bd")),ad:dte(g("ad"))},e=[];
  if(!ST_OK.includes(o.st))e.push("حالة غير صحيحة");if(!o.pn)e.push("الاسم ناقص");if(!isM(o.st)&&!(+o.pc>=30&&+o.pc<=100))e.push("نسبة العجز 30-100");
  if(!o.bn)e.push("المستفيد ناقص");if(!rels.includes(o.rl))e.push("صلة القرابة غير معروفة");if(!o.un)e.push("رقم الموحدة ناقص");else if(seen.has(o.un)||dupU(o.un))e.push("رقم الموحدة مكرر");
  if(!dis.includes(o.ds))e.push("محل النفوس غير معروف");if(!o.bd)e.push("تاريخ الميلاد");if(!o.ad)e.push("تاريخ الحضور");
  if(e.length)bad.push("سطر "+(i+2)+": "+e.join("، "));else{seen.add(o.un);ok.push(o)}});
 if(!ok.length)throw Error("لا يوجد سطر صالح. "+bad.slice(0,3).join(" | "));
 if(!confirm("جاهز للاستيراد: "+ok.length+" سطر صالح، و"+bad.length+" فيه أخطاء (سيُتجاهل).\n"+bad.slice(0,6).join("\n")+(bad.length>6?"\n…":"")+"\nمتابعة؟"))return;
 const now=Date.now();let b=writeBatch(fs),n=0;const put=async fn=>{fn(b);if(++n>=100){await b.commit();b=writeBatch(fs);n=0}},gm={};
 ok.filter(o=>isM(o.st)).forEach(o=>{const k=o.st+"|"+norm(o.pn);(gm[k]=gm[k]||[]).push(o)});
 for(const k in gm){const L=gm[k],o0=L[0],ex=recs.find(r=>r.statusType===o0.st&&norm(r.personName)===norm(o0.pn)),id=ex?ex.id:doc(RC).id,sk=L.flatMap(o=>[norm(o.bn),o.un,o.ds]),ld=[(ex&&ex.ld)||"",...L.map(o=>o.ad)].sort().pop();
  await put(x=>ex?x.update(doc(RC,id),{bc:increment(L.length),sk:arrayUnion(...sk),ld}):x.set(doc(RC,id),{personName:o0.pn,statusType:o0.st,bc:L.length,sk:[...new Set(sk)],ld,by:me.name,createdAt:now}));
  for(const o of L)await put(x=>x.set(doc(collection(fs,"bens")),{rid:id,beneficiary:o.bn,relation:o.rl,unified:o.un,district:o.ds,birthDate:o.bd,attendanceDate:o.ad,benKey:norm(o.bn),att:[o.ad],by:me.name,createdAt:now}))}
 for(const o of ok.filter(o=>!isM(o.st)))await put(x=>x.set(doc(RC),{personName:o.pn,statusType:o.st,pct:Math.round(+o.pc),beneficiary:o.bn,relation:o.rl,unified:o.un,district:o.ds,birthDate:o.bd,attendanceDate:o.ad,benKey:norm(o.bn),att:[o.ad],by:me.name,createdAt:now}));
 if(n)await b.commit();log("add","استورد "+ok.length+" سطرًا من ملف");say("✓ تم استيراد "+ok.length+" سطر.",1)}
const bars=(t,p)=>{const m=Math.max(1,...p.map(x=>x[1]));return `<div class="cd" style="margin-top:12px"><h2>${t}</h2>${p.length?p.map(x=>`<div class="br"><span>${esc(x[0])}</span><i><u style="width:${Math.round(x[1]/m*100)}%"></u></i><b>${x[1]}</b></div>`).join(""):'<div class="st">لا توجد بيانات.</div>'}</div>`};
const cnt=(a,f)=>{const m={};a.forEach(x=>{const k=f(x);if(k)m[k]=(m[k]||0)+1});return Object.entries(m).sort((x,y)=>y[1]-x[1])};
function statsH(L){const M=recs.filter(r=>isM(r.statusType)),I=recs.filter(r=>!isM(r.statusType)),band=p=>p<50?"30–49%":p<70?"50–69%":p<90?"70–89%":"90–100%",am={},mo=[];
 L.forEach(x=>(x.att||[]).forEach(t=>{const k=String(t).slice(0,7);am[k]=(am[k]||0)+1}));
 for(let i=11;i>=0;i--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);mo.push(d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"))}
 return `<div class="tl4"><div><b>${recs.length}</b>السجلات</div><div><b>${M.length}</b>الشهداء</div><div><b>${I.length}</b>المصابون</div><div><b>${L.length}</b>المستفيدون</div></div>`+bars("حسب الحالة",cnt(recs,r=>r.statusType))+bars("المستفيدون حسب محل النفوس",cnt(L,x=>x.district))+bars("المصابون حسب نسبة العجز",cnt(I.filter(r=>r.pct),r=>band(r.pct)).sort())+bars("صلة القرابة",cnt(L,x=>x.relation))+bars("تأييد الحضور (آخر 12 شهرًا)",mo.map(k=>[k,am[k]||0]))}
function missH(bs){const R=[],chk=(x,l,rid)=>{const p=[];if(!(x.photo&&x.photo.startsWith(JP)))p.push("الصورة الشخصية");if(!x.hf)p.push("الموحدة أمامي");if(!x.hb)p.push("الموحدة خلفي");BF.forEach(k=>{if(!x[k])p.push(LB[k])});if(p.length)R.push([l,rid,p])};
 recs.forEach(r=>{if(isM(r.statusType)){if(!(r.bc||0)&&!r.beneficiary)R.push([r.personName,r.id,["لا يوجد مستفيد"]]);if(r.beneficiary)chk(r,r.personName+" ← "+r.beneficiary,r.id)}else chk(r,r.personName,r.id)});
 bs.forEach(x=>{const r=recs.find(y=>y.id===x.rid);chk(x,(r?r.personName:"")+" ← "+x.beneficiary,x.rid)});
 return `<div class="cd" style="margin-top:12px"><h2>⚠ سجلات ناقصة (${R.length})</h2>${R.slice(0,150).map(x=>`<div class="ev" data-a="gt" data-id="${esc(x[1])}" style="cursor:pointer"><div><b>${esc(x[0])}</b><div>${x[2].map(c=>`<span class="chip">${esc(c)}</span>`).join("")}</div></div><i>›</i></div>`).join("")||'<div class="st">✓ لا توجد نواقص.</div>'}</div>`}
async function purge(id,k,sil){if(!sil&&!ask("pg"+id,"اضغط مرة أخرى للحذف النهائي (لا رجعة فيه)."))return;const b=writeBatch(fs),im=i=>["f","b"].forEach(q=>b.delete(doc(fs,"images",i+"_"+q)));
 if(k==="b"){b.delete(doc(fs,"bens",id));im(id)}else{b.delete(doc(RC,id));im(id);(await getDocs(query(collection(fs,"bens"),where("rid","==",id)))).forEach(d=>{b.delete(d.ref);im(d.id)})}
 await b.commit();if(!sil){say("حُذف نهائيًا.",1);repTab("t")}}
async function restoreT(id,k){const b=writeBatch(fs);if(k==="b"){const x=(await getDoc(doc(fs,"bens",id))).data();b.update(doc(fs,"bens",id),{del:false});if(x&&recs.some(r=>r.id===x.rid))b.update(doc(RC,x.rid),{bc:increment(1)})}else b.update(doc(RC,id),{del:false});await b.commit();log("res","استعاد عنصرًا من المحذوفات");say("✓ تمت الاستعادة.",1);repTab("t")}
async function trashH(){const tb=(await getDocs(query(collection(fs,"bens"),where("del","==",true)))).docs.map(d=>({id:d.id,...d.data(),k:"b"})),tr=[...trR.map(x=>({...x,k:"r"})),...tb],old=tr.filter(x=>Date.now()-(x.dt||0)>30*864e5);
 for(const x of old)await purge(x.id,x.k,1);const L=tr.filter(x=>!old.includes(x)).sort((a,b)=>(b.dt||0)-(a.dt||0));
 return `<div class="cd" style="margin-top:12px"><h2>🗑 المحذوفات (تُمحى نهائيًا بعد 30 يومًا)</h2>${L.map(x=>`<div class="ev"><i>${x.k==="r"?"👤":"🧾"}</i><div><b>${esc(x.k==="r"?x.statusType+": "+x.personName:"مستفيد: "+x.beneficiary)}</b><small>بقي ${Math.max(0,30-Math.floor((Date.now()-(x.dt||0))/864e5))} يومًا</small></div><button class="b" data-a="rst" data-id="${esc(x.id)}" data-k="${x.k}">استعادة</button><button class="b del" data-a="pgr" data-id="${esc(x.id)}" data-k="${x.k}">حذف نهائي</button></div>`).join("")||'<div class="st">السلة فارغة.</div>'}</div>`}
async function repTab(k){document.querySelectorAll("#rp .tab").forEach(b=>b.classList.toggle("on",b.dataset.k===k));$("stb").innerHTML='<div class="st">جارٍ التحميل…</div>';
 try{const bs=k==="t"?[]:await allB();$("stb").innerHTML=k==="s"?statsH([...recs.filter(r=>!isM(r.statusType)||r.beneficiary),...bs]):k==="m"?missH(bs):await trashH()}catch(e){$("stb").innerHTML='<div class="st">'+esc(err(e))+'</div>'}}
const repOpen=()=>{$("rp").classList.remove("hidden");document.body.style.overflow="hidden";$("tbT").classList.toggle("hidden",!canD);repTab("s")},repClose=()=>{$("rp").classList.add("hidden");document.body.style.overflow=""};
async function stor(){try{const[i,r,b]=await Promise.all(["images","records","bens"].map(c=>getCountFromServer(collection(fs,c)))),n=i.data().count,mb=Math.round(n*.35+(r.data().count+b.data().count)*.04),p=Math.min(100,Math.round(mb/1024*100));
 $("sto").innerHTML=`<h2>💽 مساحة التخزين (تقدير)</h2><div class="gg"><u style="width:${p}%"></u></div><small>≈ ${mb} م.ب من 1024 م.ب (${p}%) · ${n} صورة موحدة${p>70?" — ⚠ اقتربت من الامتلاء، حمّل نسخة احتياطية":""}</small>`}catch{}}
function sgOpen(){$("sLk").value=LS("lockMin")||"0";$("sOff").checked=LS("offm")!=="0";$("sPn").value="";$("sgm").textContent="";$("sg").classList.remove("hidden")}
async function sgSave(){const m=$("sgm"),p=$("sPn").value.trim(),L=$("sLk").value;m.style.color="#c0574c";
 if(p&&!/^\d{4,6}$/.test(p))return m.textContent="الرمز من 4 إلى 6 أرقام فقط.";
 if(L!=="0"&&!p&&!hasPin())return m.textContent="عيّن رمز PIN أولًا لتفعيل القفل.";
 if(p){const s=crypto.randomUUID();localStorage.pin=JSON.stringify({u:me.id,s,n:p.length,h:await hsh(s,p)})}
 try{localStorage.lockMin=L;localStorage.offm=$("sOff").checked?"1":"0"}catch{}
 m.style.color="#3e8a55";m.textContent="✓ تم الحفظ. وضع الإنترنت يسري بعد إعادة فتح البرنامج.";bumpIdle();setTimeout(()=>$("sg").classList.add("hidden"),1500)}
const net=()=>{const on=navigator.onLine;$("dot").className="dot"+(on?" on":"");$("conn").textContent=on?"متصل ومتزامن":"بدون إنترنت — التغييرات تُحفظ على الجهاز وتُرسل عند الاتصال"};
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
 pend[k]=await shrink(bl,k==="p"?TP:TC,k==="p"?38e3:45e4);setTile(k,pend[k]);m.textContent="✓ تم التقاط: "+CMN[k];if(k!=="b")csel(k==="p"?"f":"b")}
async function pws(){const o=$("pw0").value,n=$("pw1").value,c=$("pw2").value,m=$("pwm");m.style.color="#c0574c";
 if(n.length<8)return m.textContent="كلمة السر الجديدة 8 أحرف على الأقل.";if(n!==c)return m.textContent="كلمتا السر غير متطابقتين.";if(n===o)return m.textContent="اختر كلمة مختلفة عن الحالية.";
 try{const u=auth.currentUser;await reauthenticateWithCredential(u,EmailAuthProvider.credential(u.email,o));await updatePassword(u,n);["pw0","pw1","pw2"].forEach(i=>$(i).value="");m.style.color="#3e8a55";m.textContent="✓ تم تغيير كلمة السر.";setTimeout(()=>$("pw").classList.add("hidden"),1500)}catch(e){m.textContent=err(e)}}
function ask(k,m){if(armed[k]&&Date.now()-armed[k]<5000){delete armed[k];return true}armed[k]=Date.now();say(m);return false}
const guard=(fn,n)=>fn().catch(e=>say(err(e)+(n&&e&&e.code==="permission-denied"?" ["+n+"]":"")));
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
function clear(){[...RF,...BF,"pct"].forEach(k=>{$(k).value="";$(k).classList.remove("bad")});pend={};sel=selB=tgt=null;ou="";ob=null;["p","f","b"].forEach(k=>setTile(k));$("addB").classList.remove("hidden");$("edtB").classList.add("hidden");$("ft").textContent="إضافة سجل جديد";layout();render()}
function putImgs(b,id,o){for(const k of["f","b"])if(pend[k]){o["h"+k]=true;b.set(doc(fs,"images",id+"_"+k),{rid:id,d:pend[k]});IC.delete(id+"_"+k)}if(pend.p)o.photo=pend.p}
async function save(){
 const st=val("statusType"),m=isM(st),inj=isI(st),rr=sel?recs.find(x=>x.id===sel):null,flat=rr?(!m||!!rr.beneficiary):true;
 const req=[...(tgt?[]:RF),...(tgt||flat?BF:[]),...(!tgt&&inj?["pct"]:[])];
 [...RF,...BF,"pct"].forEach(k=>$(k).classList.remove("bad"));const miss=req.filter(k=>!val(k));
 if(miss.length){miss.forEach(k=>$(k).classList.add("bad"));return say("أكمل الحقول: "+miss.map(k=>LB[k]).join("، "))}
 const d={};[...RF,...BF].forEach(k=>d[k]=val(k));
 const du=dupU(d.unified);if(du&&d.unified!==ou&&!ask("du","⚠ رقم الموحدة مسجّل مسبقًا لـ «"+du.personName+"». اضغط مرة أخرى للمتابعة."))return;
 const bk=norm(d.beneficiary),now=Date.now(),b=writeBatch(fs),mk=o=>{BF.forEach(k=>o[k]=d[k]);o.benKey=bk;return o},ed=!!(sel||selB),chg=ed?(selB?dif(ob||{},d,BF):dif(rr||{},{...d,pct:val("pct")},[...RF,...(flat?BF:[]),"pct"])):"";
 let back=tgt,t=tgt;
 if(selB){const o=mk({updatedAt:now,att:arrayUnion(d.attendanceDate)});putImgs(b,selB,o);b.update(doc(fs,"bens",selB),o);b.update(doc(RC,tgt),{sk:arrayUnion(bk,d.unified,d.district)})}
 else if(sel){const o={personName:d.personName,statusType:st,updatedAt:now};if(flat){mk(o);o.att=arrayUnion(d.attendanceDate);putImgs(b,sel,o)}if(inj)o.pct=+val("pct");b.update(doc(RC,sel),o)}
 else{
  if(!t&&m){const x=recs.find(r=>r.statusType===st&&norm(r.personName)===norm(d.personName));
   if(x){if(!ask("dm","⚠ «"+x.personName+"» مسجّل مسبقًا. اضغط مرة أخرى لإضافة هذا المستفيد إلى سجله."))return;t=back=x.id}}
  if(t||m){const bid=doc(collection(fs,"bens")).id,o=mk({by:me.name,createdAt:now,att:[d.attendanceDate]});putImgs(b,bid,o);
   if(t){o.rid=t;b.update(doc(RC,t),{bc:increment(1),sk:arrayUnion(bk,d.unified,d.district),ld:[(recs.find(r=>r.id===t)||{}).ld||"",d.attendanceDate].sort().pop()})}
   else{const id=doc(RC).id;o.rid=id;b.set(doc(RC,id),{personName:d.personName,statusType:st,bc:1,sk:[bk,d.unified,d.district],ld:d.attendanceDate,by:me.name,createdAt:now})}
   b.set(doc(fs,"bens",bid),o)}
  else{const x=recs.find(r=>r.beneficiary&&(r.benKey||norm(r.beneficiary))===bk);
   if(x&&!ask("dup","⚠ المستفيد «"+x.beneficiary+"» مسجّل مسبقًا (للمصاب: "+x.personName+"). اضغط مرة أخرى للتأكيد."))return;
   const o=mk({personName:d.personName,statusType:st,pct:+val("pct"),by:me.name,createdAt:now,att:[d.attendanceDate]}),id=doc(RC).id;putImgs(b,id,o);b.set(doc(RC,id),o)}}
 const t1=$("addB").textContent,t2=$("edtB").textContent;$("addB").textContent=$("edtB").textContent="جارٍ الحفظ…";$("addB").disabled=$("edtB").disabled=true;
 try{const cp=b.commit();if(!navigator.onLine)cp.catch(e=>say(err(e)));else await cp;if(!ed)log("add",t?"أضاف مستفيدًا إلى "+st+": "+d.personName:"أضاف "+st+": "+d.personName);else if(chg)log("edit","عدّل "+(selB?"مستفيدًا":st)+" «"+d.personName+"»: "+chg);clear();say(!navigator.onLine?"🔌 حُفظ على الجهاز وسيُرسل عند عودة الإنترنت.":ed?"تم التعديل.":"✓ تمت الإضافة.",1);if(back)openM(back)}finally{$("addB").disabled=$("edtB").disabled=false;$("addB").textContent=t1;$("edtB").textContent=t2}}
function show(src,info,dl){$("vimg").src=src;$("vi").textContent=info;const a=$("vdl");a.classList.toggle("hidden",!dl);if(dl){a.href=src;a.download=info+".jpg"}$("viewer").classList.remove("hidden")}
async function view(id,k){const r=recs.find(x=>x.id===id)||bens.find(x=>x.id===id);if(!r)return;
 if(k==="p"){if(r.photo&&r.photo.startsWith(JP))show(r.photo,"الصورة الشخصية");return}
 show("","جارٍ التحميل…");const s=await getDoc(doc(fs,"images",id+"_"+k));const d=s.exists()&&s.data().d;if(!d||!d.startsWith(JP))throw Error("الصورة غير متوفرة.");show(d,k==="f"?"الموحدة - الأمامي":"الموحدة - الخلفي",1)}
const up=()=>scrollTo({top:0,behavior:"smooth"}),tiles=x=>{setTile("p",x.photo&&x.photo.startsWith(JP)?x.photo:"");setTile("f","",x.hf);setTile("b","",x.hb)};
function pick(id){const r=recs.find(x=>x.id===id);if(!r)return;clear();sel=id;ou=r.unified||"";[...RF,...BF].forEach(k=>$(k).value=r[k]||"");$("pct").value=r.pct||"";tiles(r);
 $("addB").classList.add("hidden");$("edtB").classList.remove("hidden");$("ft").textContent="تعديل سجل";layout();render();up()}
function addBen(){const rid=mp,r=recs.find(y=>y.id===rid);closeM();clear();tgt=rid;$("personName").value=r.personName;$("statusType").value=r.statusType;$("ft").textContent="إضافة مستفيد لـ: "+r.personName;layout();up()}
function editBen(bid){const rid=mp;if(bid===rid){closeM();return pick(rid)}
 const x=bens.find(y=>y.id===bid),r=recs.find(y=>y.id===rid);if(!x||!r)return;closeM();clear();tgt=rid;selB=bid;ou=x.unified||"";ob=x;
 $("personName").value=r.personName;$("statusType").value=r.statusType;BF.forEach(k=>$(k).value=x[k]||"");tiles(x);
 $("addB").classList.add("hidden");$("edtB").classList.remove("hidden");$("ft").textContent="تعديل مستفيد";layout();up()}
async function rm(id){if(!ask("d"+id,"اضغط «حذف» مرة أخرى لنقل السجل إلى المحذوفات (يبقى 30 يومًا)."))return;const rx=recs.find(x=>x.id===id)||{};await updateDoc(doc(RC,id),{del:true,dt:Date.now()});log("del","حذف "+(rx.statusType||"سجل")+": "+(rx.personName||""));if(sel===id)clear();say("نُقل إلى المحذوفات — يمكنك استعادته خلال 30 يومًا.",1)}
async function rmBen(bid){if(!ask("b"+bid,"اضغط «حذف» مرة أخرى لنقل المستفيد إلى المحذوفات."))return;const b=writeBatch(fs);b.update(doc(fs,"bens",bid),{del:true,dt:Date.now()});b.update(doc(RC,mp),{bc:increment(-1)});await b.commit();log("del","حذف مستفيد من: "+((recs.find(x=>x.id===mp)||{}).personName||""));say("نُقل المستفيد إلى المحذوفات.",1)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);fill(e.target)}}),{rootMargin:"250px"}),obs=c=>c.querySelectorAll(".gi.c:not([disabled])").forEach(el=>io.observe(el));
async function fill(el){const k=el.dataset.id+"_"+el.dataset.k;try{let d=IC.get(k);if(!d){const s=await getDoc(doc(fs,"images",k));d=s.exists()&&s.data().d;if(!d||!d.startsWith(JP))throw 0;if(IC.size>30)IC.delete(IC.keys().next().value);IC.set(k,d)}const sp=el.querySelector("span");if(sp){const i=new Image();i.alt="";i.src=d;sp.replaceWith(i)}}catch{const sp=el.querySelector("span");if(sp)sp.textContent="تعذّر التحميل"}}
const kv=(l,v,n)=>`<div class="kv"><dt>${l}</dt><dd${n?' class="n"':""}>${esc(v)}</dd></div>`,bt=(a,i,t,c)=>`<button class="b ${c||""}" data-a="${a}" data-id="${i}">${t}</button>`;
const gal=(i,x)=>{const ph=!!(x.photo&&x.photo.startsWith(JP)),g=(k,t,has,src)=>`<button class="gi${k==="p"?"":" c"}" data-a="v" data-id="${i}" data-k="${k}"${has?"":" disabled"}>${src?`<img src="${esc(src)}" alt="">`:`<span>${has?"جارٍ التحميل…":"لا توجد صورة"}</span>`}<em>${t}</em></button>`;
 return `<div class="gal">${g("p","الصورة الشخصية",ph,ph?x.photo:"")}${g("f","الموحدة - الأمامي",x.hf)}${g("b","الموحدة - الخلفي",x.hb)}</div>`};
const rows=x=>kv("اسم المستفيد",x.beneficiary)+kv("صلة القرابة",x.relation)+kv("رقم الموحدة",x.unified,1)+kv("محل النفوس",x.district)+kv("تاريخ الميلاد",x.birthDate,1)+kv("تاريخ الحضور",x.attendanceDate,1)+(x.att&&x.att.length?`<div class="kv at"><details><summary>سجل الحضور (${x.att.length})</summary>${[...x.att].sort().reverse().map(esc).join("، ")}</details></div>`:"");
function render(){
 const q=norm(val("q")),f=recs.filter(r=>norm([r.personName,r.beneficiary,r.unified,(r.sk||[]).join(" ")].join(" ")).includes(q)&&(!$("fSt").value||r.statusType===$("fSt").value)&&(!$("fDi").value||r.district===$("fDi").value||(r.sk||[]).includes($("fDi").value))&&(!+$("fPc").value||(r.pct||0)>=+$("fPc").value));
 $("n0").textContent=recs.length;$("n1").textContent=recs.filter(r=>isM(r.statusType)).length;$("n2").textContent=recs.filter(r=>!isM(r.statusType)).length;
 io.disconnect();
 $("list").innerHTML=f.length?f.slice(0,lim).map(r=>{const i=esc(r.id),act=(o)=>`<div class="ra">${o}${canE?bt("pick",i,"✎ تعديل"):""}${canD?bt("rm",i,"✕ حذف","del"):""}</div>`;
  if(isM(r.statusType))return `<article class="rc m${r.id===sel?" sel":""}" data-a="om" data-id="${i}"><div class="bd">${esc(r.statusType)}</div><dl>${kv(ST[r.statusType],r.personName)}${kv("عدد المستفيدين",(r.bc||0)+(r.beneficiary?1:0),1)}</dl>${act(bt("om",i,"📂 فتح الصفحة"))}</article>`;
  return `<article class="rc i${r.id===sel?" sel":""}"><div class="bd">${esc(r.statusType)}</div><dl>${kv(ST[r.statusType]||"الاسم",r.personName)}${kv("نسبة العجز",r.pct?r.pct+"%":"-",1)}${rows(r)}</dl>${gal(i,r)}${act(bt("att",i,"✔ تأييد حضور اليوم","add")+bt("pr",i,"🖨 طباعة"))}</article>`}).join("")+(f.length>lim?'<button class="b add" data-a="more" style="grid-column:1/-1">عرض المزيد ('+(f.length-lim)+')</button>':""):'<div class="st">لا توجد سجلات.</div>';
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
 me={id:uid,...u};canE=u.role!=="user";canD=u.role==="admin";
 $("login").classList.add("hidden");$("app").classList.remove("hidden");
 $("me").textContent=u.name;$("av").textContent=(u.name||"؟").trim().charAt(0).toUpperCase();$("role").textContent=RN[u.role]||"";
 $("edtB").classList.add("hidden");if(canE)$("miSt").classList.remove("hidden");render();
 if(started)return;started=true;try{if(!sessionStorage.tl){sessionStorage.tl=1;log("login","دخل إلى البرنامج")}}catch{}$("dot").className="dot on";$("conn").textContent="متصل ومتزامن";
 ["click","keydown","touchstart"].forEach(v=>addEventListener(v,bumpIdle,{passive:true}));bumpIdle();
 onSnapshot(query(RC,orderBy("createdAt","desc")),s=>{const al=s.docs.map(d=>({id:d.id,...d.data()}));recs=al.filter(x=>!x.del);trR=al.filter(x=>x.del);render();if(mp)renderM()},e=>{$("dot").className="dot";$("conn").textContent="انقطع الاتصال: "+err(e)});
 if(u.role==="admin"){$("adm").classList.remove("hidden");watchAct();chkBk();stor();onSnapshot(collection(fs,"users"),s=>{$("adn").classList.toggle("hidden",s.docs.filter(d=>d.data().role==="admin"&&!d.data().off).length>1);$("ub").innerHTML=s.docs.map(d=>{const x=d.data(),me_=d.id===uid,i=esc(d.id);return `<tr><td>${esc(x.name)}${x.off?' <span class="nw">معطّل</span>':""}</td><td><select data-uid="${i}" ${me_?"disabled":""}>${Object.keys(RN).map(r=>`<option value="${r}"${x.role===r?" selected":""}>${RN[r]}</option>`).join("")}</select></td><td>${me_?"":`<button class="b" data-a="ut" data-id="${i}" data-k="${x.off?1:0}">${x.off?"تفعيل":"تعطيل"}</button> <button class="b del" data-a="du" data-id="${i}">حذف</button>`}</td></tr>`}).join("")})}}
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
  else{await signInWithEmailAndPassword(auth,em,p);bump(1);try{$("rem").checked?localStorage.tu=n:localStorage.removeItem("tu")}catch{}}}
 catch(e){busy=false;bump(0);lm(err(e))}finally{$("lb").disabled=false}}
const A={
 eye:()=>{const p=$("lp");p.type=p.type==="password"?"text":"password"},setup:()=>setSetup(!setup),out:()=>wipe(),
 add:()=>save(),edt:()=>{if(!sel&&!selB)return say("اختر سجلًا أولًا.");return save()},clr:clear,vx:()=>$("viewer").classList.add("hidden"),
 v:(id,k)=>view(id,k),om:id=>openM(id),more:()=>{lim+=20;render()},mc:closeM,att:id=>att(id),pw:()=>$("pw").classList.remove("hidden"),pwx:()=>$("pw").classList.add("hidden"),pws:pws,csv:csv,bk:()=>bk(0),bkf:()=>bk(1),zip:zipx,cam:camOpen,cx:camClose,cs:(id,k)=>csel(k),cc:camShot,mn:()=>$("mn").classList.remove("hidden"),mx:()=>$("mn").classList.add("hidden"),stp:repOpen,stx:repClose,tab:(id,k)=>repTab(k),gt:id=>{repClose();const r=recs.find(x=>x.id===id);if(r)isM(r.statusType)?openM(id):pick(id)},rst:(id,k)=>restoreT(id,k),pgr:(id,k)=>purge(id,k),sg:sgOpen,sgx:()=>$("sg").classList.add("hidden"),sgs:sgSave,sgd:()=>{try{localStorage.removeItem("pin");localStorage.lockMin="0"}catch{}$("sLk").value="0";$("sgm").style.color="#3e8a55";$("sgm").textContent="حُذف الرمز وعُطّل القفل."},pd:(id,k)=>pdk(k),im:()=>$("imf").click(),tpl:()=>dl("tayid-template.csv","\uFEFF"+[Object.values(HC),["شهيد","فلان الفلاني","","علان العلاني","الاب","123456789","البصرة","1990-01-31",today()]].map(r=>r.map(cs).join(",")).join("\r\n"),"text/csv;charset=utf-8"),ut:(id,k)=>updateDoc(doc(fs,"users",id),{off:k!=="1"}),pr:id=>printRec(id),prm:()=>printRec(mp),fr:()=>{["fSt","fDi","fPc"].forEach(i=>$(i).value="");lim=20;render()},rs:()=>$("rsf").click(),ap:()=>{$("ap").classList.remove("hidden");document.body.style.overflow="hidden"},apx:()=>{try{localStorage.ls=Date.now()}catch{}$("ap").classList.add("hidden");document.body.style.overflow="";renderAct()},da:id=>deleteDoc(doc(fs,"activity",id)),dall:async()=>{if(!ask("dall","اضغط مرة أخرى لحذف كل السجل."))return;const b=writeBatch(fs);acts.forEach(e=>b.delete(doc(fs,"activity",e.id)));await b.commit();say("تم حذف السجل.",1)},ntf:async()=>{if(!("Notification" in window))return say("المتصفح لا يدعم الإشعارات.");const p=await Notification.requestPermission();say(p==="granted"?"تم تفعيل إشعارات الجهاز.":"لم يُسمح بالإشعارات.",p==="granted")},ab:addBen,eb:editBen,rb:rmBen,pick:id=>pick(id),rm:id=>rm(id),nu:addUser,
 du:async id=>{if(ask("u"+id,"اضغط «حذف» مرة أخرى لحذف المستخدم."))await deleteDoc(doc(fs,"users",id))},
 inst:async()=>{if(!dp)return;dp.prompt();await dp.userChoice;dp=null;$("ib").classList.add("hidden")}};
let dp=null;
document.addEventListener("click",e=>{const el=e.target.closest("[data-a]");if(el&&A[el.dataset.a]){if(el.closest("#mn")&&el.dataset.a!=="mn")$("mn").classList.add("hidden");guard(async()=>A[el.dataset.a](el.dataset.id,el.dataset.k),el.dataset.a)}});
document.addEventListener("change",async e=>{const t=e.target;
 if(t.dataset.uid)return guard(()=>updateDoc(doc(fs,"users",t.dataset.uid),{role:t.value}));
 const k=t.dataset.k;if(!k||!t.files)return;const f=t.files[0];if(!f)return;if(!f.type.startsWith("image/"))return say("اختر ملف صورة.");
 try{say("جارٍ معالجة الصورة…",1);pend[k]=await shrink(f,k==="p"?TP:TC,k==="p"?38e3:45e4);setTile(k,pend[k]);say("تم اختيار الصورة.",1)}catch(x){say(err(x))}t.value=""});
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
