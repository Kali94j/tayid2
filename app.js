import {initializeApp} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,onAuthStateChanged,deleteUser,updatePassword,reauthenticateWithCredential,EmailAuthProvider,setPersistence,browserLocalPersistence,browserSessionPersistence} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {initializeFirestore,collection,doc,getDoc,setDoc,updateDoc,deleteDoc,query,orderBy,onSnapshot,writeBatch,where,increment,arrayUnion,getDocs,limit} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
const cfg={apiKey:"AIzaSyDwQzQe_JRN4ENr95ov_Cgpo6qYLWXAZ6U",authDomain:"tayid2.firebaseapp.com",projectId:"tayid2",storageBucket:"tayid2.firebasestorage.app",messagingSenderId:"516822353811",appId:"1:516822353811:web:67848b3dc2ee79be80ca66"};
const app=initializeApp(cfg),auth=getAuth(app),fs=initializeFirestore(app,{experimentalAutoDetectLongPolling:true}),auth2=getAuth(initializeApp(cfg,"sec"));
const $=i=>document.getElementById(i),val=i=>$(i).value.trim(),JP="data:image/jpeg;base64,";
const F=["personName","statusType","beneficiary","relation","unified","district","birthDate","attendanceDate"];
const LB={personName:"الاسم",statusType:"الحالة",beneficiary:"اسم المستفيد",relation:"صلة القرابة",unified:"رقم الموحدة",district:"محل النفوس",birthDate:"تاريخ الميلاد",attendanceDate:"تاريخ الحضور",pct:"نسبة العجز"};
const RN={user:"مستخدم",editor:"محرر",admin:"مدير"},TL={p:"👤 الصورة الشخصية",f:"🪪 الموحدة: الوجه الأمامي",b:"🪪 الموحدة: الوجه الخلفي"};
let lim=20,recs=[],sel=null,selB=null,tgt=null,mp=null,unB=null,bens=[],pend={},me=null,started=false,busy=false,setup=false,tt,idle,armed={},canE=false,canD=false;
const RC=collection(fs,"records");
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const E={"auth/invalid-credential":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/user-not-found":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/wrong-password":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/weak-password":"كلمة السر ضعيفة.","auth/email-already-in-use":"هذا الاسم مستخدم مسبقًا.","auth/network-request-failed":"لا يوجد اتصال بالإنترنت.","auth/too-many-requests":"محاولات كثيرة، حاول لاحقًا.","permission-denied":"ليس لديك صلاحية لهذه العملية."};
const err=e=>E[e.code]||e.message||"حدث خطأ";
const norm=s=>String(s||"").replace(/[\u064B-\u065F\u0640]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/\s+/g," ").trim().toLowerCase();
const mail=async n=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(n.trim().toLowerCase())))].slice(0,16).map(b=>b.toString(16).padStart(2,"0")).join("")+"@tayid.app";
function say(t,ok){$("st").textContent=t;$("st").style.color=ok?"#3e8a55":"#c0574c";const o=$("toast");o.textContent=t;o.style.background=ok?"#2f7a4a":"#a64e45";o.classList.remove("hidden");clearTimeout(tt);tt=setTimeout(()=>o.classList.add("hidden"),4500)}
const lm=t=>$("lm").textContent=t;
const log=(t,x)=>setDoc(doc(collection(fs,"activity")),{t,u:me.name,x,at:Date.now()}).catch(()=>{}),IE={login:"🔑",add:"➕",del:"🗑",att:"✅"};
function notify(t){const o=$("toast");o.textContent="🔔 "+t;o.style.background="#2b6b9e";o.classList.remove("hidden");clearTimeout(tt);tt=setTimeout(()=>o.classList.add("hidden"),6000);
 if("Notification" in window&&Notification.permission==="granted"&&navigator.serviceWorker)navigator.serviceWorker.ready.then(r=>r.showNotification("برنامج تأييد الحضور",{body:t,icon:"icon-192.png",tag:"tayid"})).catch(()=>{})}
let first=true;
function watchAct(){onSnapshot(query(collection(fs,"activity"),orderBy("at","desc"),limit(30)),s=>{
 if(!first)s.docChanges().forEach(c=>{if(c.type==="added"){const e=c.doc.data();if(e.u!==me.name)notify(e.u+": "+e.x)}});first=false;
 $("act").innerHTML=s.docs.map(d=>{const e=d.data();return `<div class="ev"><i>${IE[e.t]||"•"}</i><div><b>${esc(e.u)}</b> ${esc(e.x)}<small>${new Date(e.at).toLocaleString("ar",{dateStyle:"short",timeStyle:"short"})}</small></div></div>`}).join("")||'<div class="st">لا يوجد نشاط بعد.</div>'},e=>say(err(e)))}
const today=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
async function att(id){const td=today(),bn=mp&&id!==mp?bens.find(y=>y.id===id):null,x=bn||recs.find(y=>y.id===id);if(!x)return;
 if((x.att||[]).includes(td))return say("حضور اليوم مؤكَّد مسبقًا.");
 const b=writeBatch(fs),o={att:arrayUnion(td),attendanceDate:td,updatedAt:Date.now()};
 if(bn){b.update(doc(fs,"bens",id),o);b.update(doc(RC,mp),{ld:td})}else{if(isM(x.statusType))o.ld=td;b.update(doc(RC,id),o)}
 await b.commit();const nm=bn?(recs.find(y=>y.id===mp)||{}).personName:x.personName;log("att","أيّد حضور: "+(bn?x.beneficiary+" ("+nm+")":nm));say("✓ تم تأييد حضور اليوم.",1)}
const dl=(n,t,m)=>{const u=URL.createObjectURL(new Blob([t],{type:m})),a=document.createElement("a");a.href=u;a.download=n;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4e3)};
const cs=v=>{let s=String(v==null?"":v);if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
const allB=async()=>(await getDocs(collection(fs,"bens"))).docs.map(d=>({id:d.id,...d.data()}));
async function csv(){const bs=await allB(),H=["الحالة","اسم الشهيد/المصاب","نسبة العجز","اسم المستفيد","صلة القرابة","رقم الموحدة","محل النفوس","تاريخ الميلاد","تاريخ الحضور","عدد مرات الحضور","أضيف بواسطة"],R=[];
 recs.forEach(r=>{const l=[...((r.beneficiary||!isM(r.statusType))?[r]:[]),...bs.filter(b=>b.rid===r.id)];(l.length?l:[{}]).forEach(x=>R.push([r.statusType,r.personName,r.pct?r.pct+"%":"",x.beneficiary,x.relation,x.unified,x.district,x.birthDate,x.attendanceDate,(x.att||[]).length,x.by||r.by]))});
 dl("tayid-"+today()+".csv","\uFEFF"+[H,...R].map(r=>r.map(cs).join(",")).join("\r\n"),"text/csv;charset=utf-8");say("تم تحميل ملف Excel.",1)}
async function bk(full){const o={v:1,at:Date.now(),records:recs,bens:await allB()};if(full)o.images=Object.fromEntries((await getDocs(collection(fs,"images"))).docs.map(d=>[d.id,d.data().d]));
 dl("tayid-backup-"+today()+(full?"-full":"")+".json",JSON.stringify(o),"application/json");say("تم تحميل النسخة الاحتياطية.",1)}
async function pws(){const o=$("pw0").value,n=$("pw1").value,c=$("pw2").value,m=$("pwm");m.style.color="#c0574c";
 if(n.length<8)return m.textContent="كلمة السر الجديدة 8 أحرف على الأقل.";if(n!==c)return m.textContent="كلمتا السر غير متطابقتين.";if(n===o)return m.textContent="اختر كلمة مختلفة عن الحالية.";
 try{const u=auth.currentUser;await reauthenticateWithCredential(u,EmailAuthProvider.credential(u.email,o));await updatePassword(u,n);["pw0","pw1","pw2"].forEach(i=>$(i).value="");m.style.color="#3e8a55";m.textContent="✓ تم تغيير كلمة السر.";setTimeout(()=>$("pw").classList.add("hidden"),1500)}catch(e){m.textContent=err(e)}}
function ask(k,m){if(armed[k]&&Date.now()-armed[k]<5000){delete armed[k];return true}armed[k]=Date.now();say(m);return false}
const guard=fn=>fn().catch(e=>say(err(e)));
// ضغط الصورة وإعادة ترميزها (يحذف بيانات EXIF/الموقع)
const shrink=(f,max,lim)=>new Promise((ok,no)=>{const u=URL.createObjectURL(f),i=new Image();i.onerror=()=>no(Error("صورة غير صالحة"));i.onload=()=>{URL.revokeObjectURL(u);const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext("2d").drawImage(i,0,0,c.width,c.height);let q=.82,d;do{d=c.toDataURL("image/jpeg",q);q-=.12}while(d.length>lim&&q>.25);d.length>lim?no(Error("الصورة كبيرة جدًا")):ok(d)};i.src=u});
function setTile(k,src,saved){const t=$("t_"+k);t.querySelector("img")?.remove();t.firstChild.textContent=saved?"✓ محفوظة – اختر لتغييرها":TL[k];t.classList.toggle("ok",!!(src||saved));if(src){const i=new Image();i.src=src;t.prepend(i)}}
const RF=["personName","statusType"],BF=["beneficiary","relation","unified","district","birthDate","attendanceDate"];
const ST={"شهيد":"اسم الشهيد","شهيدة":"اسم الشهيدة","مصاب":"اسم المصاب","مصابه":"اسم المصابة"},IC=new Map();
const isM=s=>s==="شهيد"||s==="شهيدة",isI=s=>s==="مصاب"||s==="مصابه";
function layout(){const st=$("statusType").value,rr=sel?recs.find(x=>x.id===sel):null;
 $("pctW").classList.toggle("hidden",!isI(st));$("sBen").classList.toggle("hidden",!!rr&&isM(st)&&!rr.beneficiary);
 $("personName").disabled=$("statusType").disabled=!!tgt}
function clear(){[...RF,...BF,"pct"].forEach(k=>{$(k).value="";$(k).classList.remove("bad")});pend={};sel=selB=tgt=null;["p","f","b"].forEach(k=>setTile(k));$("addB").classList.remove("hidden");$("edtB").classList.add("hidden");$("ft").textContent="إضافة سجل جديد";layout();render()}
function putImgs(b,id,o){for(const k of["f","b"])if(pend[k]){o["h"+k]=true;b.set(doc(fs,"images",id+"_"+k),{rid:id,d:pend[k]});IC.delete(id+"_"+k)}if(pend.p)o.photo=pend.p}
async function save(){
 const st=val("statusType"),m=isM(st),inj=isI(st),rr=sel?recs.find(x=>x.id===sel):null,flat=rr?(!m||!!rr.beneficiary):true;
 const req=[...(tgt?[]:RF),...(tgt||flat?BF:[]),...(!tgt&&inj?["pct"]:[])];
 [...RF,...BF,"pct"].forEach(k=>$(k).classList.remove("bad"));const miss=req.filter(k=>!val(k));
 if(miss.length){miss.forEach(k=>$(k).classList.add("bad"));return say("أكمل الحقول: "+miss.map(k=>LB[k]).join("، "))}
 const d={};[...RF,...BF].forEach(k=>d[k]=val(k));
 const bk=norm(d.beneficiary),now=Date.now(),b=writeBatch(fs),mk=o=>{BF.forEach(k=>o[k]=d[k]);o.benKey=bk;return o},ed=!!(sel||selB);
 let back=tgt,t=tgt;
 if(selB){const o=mk({updatedAt:now,att:arrayUnion(d.attendanceDate)});putImgs(b,selB,o);b.update(doc(fs,"bens",selB),o);b.update(doc(RC,tgt),{sk:arrayUnion(bk,d.unified)})}
 else if(sel){const o={personName:d.personName,statusType:st,updatedAt:now};if(flat){mk(o);o.att=arrayUnion(d.attendanceDate);putImgs(b,sel,o)}if(inj)o.pct=+val("pct");b.update(doc(RC,sel),o)}
 else{
  if(!t&&m){const x=recs.find(r=>r.statusType===st&&norm(r.personName)===norm(d.personName));
   if(x){if(!ask("dm","⚠ «"+x.personName+"» مسجّل مسبقًا. اضغط مرة أخرى لإضافة هذا المستفيد إلى سجله."))return;t=back=x.id}}
  if(t||m){const bid=doc(collection(fs,"bens")).id,o=mk({by:me.name,createdAt:now,att:[d.attendanceDate]});putImgs(b,bid,o);
   if(t){o.rid=t;b.update(doc(RC,t),{bc:increment(1),sk:arrayUnion(bk,d.unified),ld:[(recs.find(r=>r.id===t)||{}).ld||"",d.attendanceDate].sort().pop()})}
   else{const id=doc(RC).id;o.rid=id;b.set(doc(RC,id),{personName:d.personName,statusType:st,bc:1,sk:[bk,d.unified],ld:d.attendanceDate,by:me.name,createdAt:now})}
   b.set(doc(fs,"bens",bid),o)}
  else{const x=recs.find(r=>r.beneficiary&&(r.benKey||norm(r.beneficiary))===bk);
   if(x&&!ask("dup","⚠ المستفيد «"+x.beneficiary+"» مسجّل مسبقًا (للمصاب: "+x.personName+"). اضغط مرة أخرى للتأكيد."))return;
   const o=mk({personName:d.personName,statusType:st,pct:+val("pct"),by:me.name,createdAt:now,att:[d.attendanceDate]}),id=doc(RC).id;putImgs(b,id,o);b.set(doc(RC,id),o)}}
 const t1=$("addB").textContent,t2=$("edtB").textContent;$("addB").textContent=$("edtB").textContent="جارٍ الحفظ…";$("addB").disabled=$("edtB").disabled=true;
 try{await b.commit();if(!ed)log("add",t?"أضاف مستفيدًا إلى "+st+": "+d.personName:"أضاف "+st+": "+d.personName);clear();say(ed?"تم التعديل.":"✓ تمت الإضافة.",1);if(back)openM(back)}finally{$("addB").disabled=$("edtB").disabled=false;$("addB").textContent=t1;$("edtB").textContent=t2}}
function show(src,info,dl){$("vimg").src=src;$("vi").textContent=info;const a=$("vdl");a.classList.toggle("hidden",!dl);if(dl){a.href=src;a.download=info+".jpg"}$("viewer").classList.remove("hidden")}
async function view(id,k){const r=recs.find(x=>x.id===id)||bens.find(x=>x.id===id);if(!r)return;
 if(k==="p"){if(r.photo&&r.photo.startsWith(JP))show(r.photo,"الصورة الشخصية");return}
 show("","جارٍ التحميل…");const s=await getDoc(doc(fs,"images",id+"_"+k));const d=s.exists()&&s.data().d;if(!d||!d.startsWith(JP))throw Error("الصورة غير متوفرة.");show(d,k==="f"?"الموحدة - الأمامي":"الموحدة - الخلفي",1)}
const up=()=>scrollTo({top:0,behavior:"smooth"}),tiles=x=>{setTile("p",x.photo&&x.photo.startsWith(JP)?x.photo:"");setTile("f","",x.hf);setTile("b","",x.hb)};
function pick(id){const r=recs.find(x=>x.id===id);if(!r)return;clear();sel=id;[...RF,...BF].forEach(k=>$(k).value=r[k]||"");$("pct").value=r.pct||"";tiles(r);
 $("addB").classList.add("hidden");$("edtB").classList.remove("hidden");$("ft").textContent="تعديل سجل";layout();render();up()}
function addBen(){const rid=mp,r=recs.find(y=>y.id===rid);closeM();clear();tgt=rid;$("personName").value=r.personName;$("statusType").value=r.statusType;$("ft").textContent="إضافة مستفيد لـ: "+r.personName;layout();up()}
function editBen(bid){const rid=mp;if(bid===rid){closeM();return pick(rid)}
 const x=bens.find(y=>y.id===bid),r=recs.find(y=>y.id===rid);if(!x||!r)return;closeM();clear();tgt=rid;selB=bid;
 $("personName").value=r.personName;$("statusType").value=r.statusType;BF.forEach(k=>$(k).value=x[k]||"");tiles(x);
 $("addB").classList.add("hidden");$("edtB").classList.remove("hidden");$("ft").textContent="تعديل مستفيد";layout();up()}
async function rm(id){if(!ask("d"+id,"اضغط «حذف» مرة أخرى للتأكيد (يُحذف معه كل مستفيديه)."))return;const rx=recs.find(x=>x.id===id)||{},b=writeBatch(fs),im=i=>["f","b"].forEach(k=>b.delete(doc(fs,"images",i+"_"+k)));
 b.delete(doc(RC,id));im(id);const s=await getDocs(query(collection(fs,"bens"),where("rid","==",id)));s.forEach(d=>{b.delete(d.ref);im(d.id)});await b.commit();log("del","حذف "+(rx.statusType||"سجل")+": "+(rx.personName||""));if(sel===id)clear();say("تم الحذف.",1)}
async function rmBen(bid){if(!ask("b"+bid,"اضغط «حذف» مرة أخرى لتأكيد حذف المستفيد."))return;const b=writeBatch(fs);b.delete(doc(fs,"bens",bid));["f","b"].forEach(k=>b.delete(doc(fs,"images",bid+"_"+k)));b.update(doc(RC,mp),{bc:increment(-1)});await b.commit();log("del","حذف مستفيد من: "+((recs.find(x=>x.id===mp)||{}).personName||""));say("تم حذف المستفيد.",1)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);fill(e.target)}}),{rootMargin:"250px"}),obs=c=>c.querySelectorAll(".gi.c:not([disabled])").forEach(el=>io.observe(el));
async function fill(el){const k=el.dataset.id+"_"+el.dataset.k;try{let d=IC.get(k);if(!d){const s=await getDoc(doc(fs,"images",k));d=s.exists()&&s.data().d;if(!d||!d.startsWith(JP))throw 0;if(IC.size>30)IC.delete(IC.keys().next().value);IC.set(k,d)}const sp=el.querySelector("span");if(sp){const i=new Image();i.alt="";i.src=d;sp.replaceWith(i)}}catch{const sp=el.querySelector("span");if(sp)sp.textContent="تعذّر التحميل"}}
const kv=(l,v,n)=>`<div class="kv"><dt>${l}</dt><dd${n?' class="n"':""}>${esc(v)}</dd></div>`,bt=(a,i,t,c)=>`<button class="b ${c||""}" data-a="${a}" data-id="${i}">${t}</button>`;
const gal=(i,x)=>{const ph=!!(x.photo&&x.photo.startsWith(JP)),g=(k,t,has,src)=>`<button class="gi${k==="p"?"":" c"}" data-a="v" data-id="${i}" data-k="${k}"${has?"":" disabled"}>${src?`<img src="${esc(src)}" alt="">`:`<span>${has?"جارٍ التحميل…":"لا توجد صورة"}</span>`}<em>${t}</em></button>`;
 return `<div class="gal">${g("p","الصورة الشخصية",ph,ph?x.photo:"")}${g("f","الموحدة - الأمامي",x.hf)}${g("b","الموحدة - الخلفي",x.hb)}</div>`};
const rows=x=>kv("اسم المستفيد",x.beneficiary)+kv("صلة القرابة",x.relation)+kv("رقم الموحدة",x.unified,1)+kv("محل النفوس",x.district)+kv("تاريخ الميلاد",x.birthDate,1)+kv("تاريخ الحضور",x.attendanceDate,1)+(x.att&&x.att.length?`<div class="kv at"><details><summary>سجل الحضور (${x.att.length})</summary>${[...x.att].sort().reverse().map(esc).join("، ")}</details></div>`:"");
function render(){
 const q=norm(val("q")),od=+$("od").value,lad=r=>isM(r.statusType)?(r.ld||r.attendanceDate):r.attendanceDate,f=recs.filter(r=>norm([r.personName,r.beneficiary,r.unified,(r.sk||[]).join(" ")].join(" ")).includes(q)&&(!od||!lad(r)||(Date.now()-new Date(lad(r)))/864e5>=od));
 $("n0").textContent=recs.length;$("n1").textContent=recs.filter(r=>isM(r.statusType)).length;$("n2").textContent=recs.filter(r=>!isM(r.statusType)).length;
 io.disconnect();
 $("list").innerHTML=f.length?f.slice(0,lim).map(r=>{const i=esc(r.id),act=(o)=>`<div class="ra">${o}${canE?bt("pick",i,"✎ تعديل"):""}${canD?bt("rm",i,"✕ حذف","del"):""}</div>`;
  if(isM(r.statusType))return `<article class="rc m${r.id===sel?" sel":""}" data-a="om" data-id="${i}"><div class="bd">${esc(r.statusType)}</div><dl>${kv(ST[r.statusType],r.personName)}${kv("عدد المستفيدين",(r.bc||0)+(r.beneficiary?1:0),1)}</dl>${act(bt("om",i,"📂 فتح الصفحة"))}</article>`;
  return `<article class="rc i${r.id===sel?" sel":""}"><div class="bd">${esc(r.statusType)}</div><dl>${kv(ST[r.statusType]||"الاسم",r.personName)}${kv("نسبة العجز",r.pct?r.pct+"%":"-",1)}${rows(r)}</dl>${gal(i,r)}${act(bt("att",i,"✔ تأييد حضور اليوم","add"))}</article>`}).join("")+(f.length>lim?'<button class="b add" data-a="more" style="grid-column:1/-1">عرض المزيد ('+(f.length-lim)+')</button>':""):'<div class="st">لا توجد سجلات.</div>';
 obs($("list"))}
function openM(id){if(!recs.find(x=>x.id===id))return;if(unB)unB();mp=id;bens=[];$("mp").classList.remove("hidden");document.body.style.overflow="hidden";scrollTo(0,0);
 unB=onSnapshot(query(collection(fs,"bens"),where("rid","==",id)),s=>{bens=s.docs.map(d=>({id:d.id,...d.data()}));renderM()},e=>say(err(e)));renderM()}
function closeM(){mp=null;if(unB){unB();unB=null}bens=[];$("mp").classList.add("hidden");document.body.style.overflow="";render()}
function renderM(){const r=recs.find(x=>x.id===mp);if(!r)return closeM();io.disconnect();
 const l=[...(r.beneficiary?[{...r}]:[]),...[...bens].sort((a,b)=>(a.createdAt||0)-(b.createdAt||0))];
 $("mpT").textContent=r.personName;$("mpS").textContent=r.statusType+" - المستفيدون: "+l.length;
 $("mpb").innerHTML=l.length?l.map(x=>{const i=esc(x.id),lg=x.id===r.id;return `<article class="rc m ben"><dl>${rows(x)}</dl>${gal(i,x)}<div class="ra">${bt("att",i,"✔ تأييد حضور اليوم","add")}${canE?bt("eb",i,"✎ تعديل"):""}${canD&&!lg?bt("rb",i,"✕ حذف","del"):""}</div></article>`}).join(""):'<div class="st">لا يوجد مستفيدون بعد.</div>';obs($("mpb"))}
function bumpIdle(){clearTimeout(idle);idle=setTimeout(()=>signOut(auth).then(()=>location.reload()),12e5)}
function enter(uid,u){
 me={id:uid,...u};canE=u.role!=="user";canD=u.role==="admin";
 $("login").classList.add("hidden");$("app").classList.remove("hidden");
 $("me").textContent=u.name;$("av").textContent=(u.name||"؟").trim().charAt(0).toUpperCase();$("role").textContent=RN[u.role]||"";
 $("edtB").classList.add("hidden");render();
 if(started)return;started=true;try{if(!sessionStorage.tl){sessionStorage.tl=1;log("login","دخل إلى البرنامج")}}catch{}$("dot").className="dot on";$("conn").textContent="متصل ومتزامن";
 ["click","keydown","touchstart"].forEach(v=>addEventListener(v,bumpIdle,{passive:true}));bumpIdle();
 onSnapshot(query(RC,orderBy("createdAt","desc")),s=>{recs=s.docs.map(d=>({id:d.id,...d.data()}));render();if(mp)renderM()},e=>{$("dot").className="dot";$("conn").textContent="انقطع الاتصال: "+err(e)});
 if(u.role==="admin"){$("adm").classList.remove("hidden");watchAct();onSnapshot(collection(fs,"users"),s=>{$("ub").innerHTML=s.docs.map(d=>{const x=d.data(),me_=d.id===uid,i=esc(d.id);return `<tr><td>${esc(x.name)}</td><td><select data-uid="${i}" ${me_?"disabled":""}>${Object.keys(RN).map(r=>`<option value="${r}"${x.role===r?" selected":""}>${RN[r]}</option>`).join("")}</select></td><td>${me_?"":`<button class="b del" data-a="du" data-id="${i}">حذف</button>`}</td></tr>`}).join("")})}}
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
 eye:()=>{const p=$("lp");p.type=p.type==="password"?"text":"password"},setup:()=>setSetup(!setup),out:async()=>{await signOut(auth);location.reload()},
 add:()=>save(),edt:()=>{if(!sel&&!selB)return say("اختر سجلًا أولًا.");return save()},clr:clear,vx:()=>$("viewer").classList.add("hidden"),
 v:(id,k)=>view(id,k),om:id=>openM(id),more:()=>{lim+=20;render()},mc:closeM,att:id=>att(id),pw:()=>$("pw").classList.remove("hidden"),pwx:()=>$("pw").classList.add("hidden"),pws:pws,csv:csv,bk:()=>bk(0),bkf:()=>bk(1),ntf:async()=>{if(!("Notification" in window))return say("المتصفح لا يدعم الإشعارات.");const p=await Notification.requestPermission();say(p==="granted"?"تم تفعيل إشعارات الجهاز.":"لم يُسمح بالإشعارات.",p==="granted")},ab:addBen,eb:editBen,rb:rmBen,pick:id=>pick(id),rm:id=>rm(id),nu:addUser,
 du:async id=>{if(ask("u"+id,"اضغط «حذف» مرة أخرى لحذف المستخدم."))await deleteDoc(doc(fs,"users",id))},
 inst:async()=>{if(!dp)return;dp.prompt();await dp.userChoice;dp=null;$("ib").classList.add("hidden")}};
let dp=null;
document.addEventListener("click",e=>{const el=e.target.closest("[data-a]");if(el&&A[el.dataset.a])guard(async()=>A[el.dataset.a](el.dataset.id,el.dataset.k))});
document.addEventListener("change",async e=>{const t=e.target;
 if(t.dataset.uid)return guard(()=>updateDoc(doc(fs,"users",t.dataset.uid),{role:t.value}));
 const k=t.dataset.k;if(!k||!t.files)return;const f=t.files[0];if(!f)return;if(!f.type.startsWith("image/"))return say("اختر ملف صورة.");
 try{say("جارٍ معالجة الصورة…",1);pend[k]=await shrink(f,k==="p"?200:1600,k==="p"?25e3:6e5);setTile(k,pend[k]);say("تم اختيار الصورة.",1)}catch(x){say(err(x))}t.value=""});
$("lb").onclick=login;$("lu").onkeydown=e=>{if(e.key==="Enter")$("lp").focus()};$("lp").onkeydown=e=>{if(e.key==="Enter")login()};let qt;$("q").oninput=()=>{clearTimeout(qt);qt=setTimeout(()=>{lim=20;render()},250)};
try{const s=localStorage.tu;if(s)$("lu").value=s}catch{}
onAuthStateChanged(auth,async u=>{if(busy||!u)return;try{const s=await getDoc(doc(fs,"users",u.uid));if(!s.exists()){await signOut(auth);return lm("حسابك غير مفعّل. اطلب من المدير تفعيله.")}enter(u.uid,s.data())}catch(e){lm(err(e))}});
addEventListener("beforeinstallprompt",e=>{e.preventDefault();dp=e;$("ib").classList.remove("hidden")});
if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
getDoc(doc(fs,"meta","setup")).then(x=>{if(!x.exists())$("sb").classList.remove("hidden")}).catch(()=>{});
$("pct").innerHTML='<option value="">اختر</option>'+Array.from({length:71},(_,i)=>`<option value="${30+i}">${30+i}%</option>`).join("");$("statusType").onchange=layout;layout();
$("od").onchange=()=>{lim=20;render()};
