import {initializeApp} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,onAuthStateChanged,deleteUser,setPersistence,browserLocalPersistence,browserSessionPersistence} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {getFirestore,collection,doc,getDoc,setDoc,updateDoc,deleteDoc,query,orderBy,onSnapshot,writeBatch} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
const cfg={apiKey:"AIzaSyDwQzQe_JRN4ENr95ov_Cgpo6qYLWXAZ6U",authDomain:"tayid2.firebaseapp.com",projectId:"tayid2",storageBucket:"tayid2.firebasestorage.app",messagingSenderId:"516822353811",appId:"1:516822353811:web:67848b3dc2ee79be80ca66"};
const app=initializeApp(cfg),auth=getAuth(app),fs=getFirestore(app),auth2=getAuth(initializeApp(cfg,"sec"));
const $=i=>document.getElementById(i),val=i=>$(i).value.trim(),JP="data:image/jpeg;base64,";
const F=["personName","statusType","beneficiary","relation","unified","district","birthDate","attendanceDate"];
const LB={personName:"الاسم",statusType:"الحالة",beneficiary:"اسم المستفيد",relation:"صلة القرابة",unified:"رقم الموحدة",district:"محل النفوس",birthDate:"تاريخ الميلاد",attendanceDate:"تاريخ الحضور"};
const RN={user:"مستخدم",editor:"محرر",admin:"مدير"},TL={p:"👤 الصورة الشخصية",f:"🪪 الموحدة: الوجه الأمامي",b:"🪪 الموحدة: الوجه الخلفي"};
let recs=[],sel=null,pend={},me=null,started=false,busy=false,setup=false,tt,idle,armed={},canE=false,canD=false;
const RC=collection(fs,"records");
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const E={"auth/invalid-credential":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/user-not-found":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/wrong-password":"اسم المستخدم أو كلمة السر غير صحيحة.","auth/weak-password":"كلمة السر ضعيفة.","auth/email-already-in-use":"هذا الاسم مستخدم مسبقًا.","auth/network-request-failed":"لا يوجد اتصال بالإنترنت.","auth/too-many-requests":"محاولات كثيرة، حاول لاحقًا.","permission-denied":"ليس لديك صلاحية لهذه العملية."};
const err=e=>E[e.code]||e.message||"حدث خطأ";
const norm=s=>String(s||"").replace(/[\u064B-\u065F\u0640]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/\s+/g," ").trim().toLowerCase();
const mail=async n=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(n.trim().toLowerCase())))].slice(0,16).map(b=>b.toString(16).padStart(2,"0")).join("")+"@tayid.app";
function say(t,ok){$("st").textContent=t;$("st").style.color=ok?"#3e8a55":"#c0574c";const o=$("toast");o.textContent=t;o.style.background=ok?"#2f7a4a":"#a64e45";o.classList.remove("hidden");clearTimeout(tt);tt=setTimeout(()=>o.classList.add("hidden"),4500)}
const lm=t=>$("lm").textContent=t;
function ask(k,m){if(armed[k]&&Date.now()-armed[k]<5000){delete armed[k];return true}armed[k]=Date.now();say(m);return false}
const guard=fn=>fn().catch(e=>say(err(e)));
// ضغط الصورة وإعادة ترميزها (يحذف بيانات EXIF/الموقع)
const shrink=(f,max,lim)=>new Promise((ok,no)=>{const u=URL.createObjectURL(f),i=new Image();i.onerror=()=>no(Error("صورة غير صالحة"));i.onload=()=>{URL.revokeObjectURL(u);const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext("2d").drawImage(i,0,0,c.width,c.height);let q=.9,d;do{d=c.toDataURL("image/jpeg",q);q-=.1}while(d.length>lim&&q>.3);d.length>lim?no(Error("الصورة كبيرة جدًا")):ok(d)};i.src=u});
function setTile(k,src,saved){const t=$("t_"+k);t.querySelector("img")?.remove();t.firstChild.textContent=saved?"✓ محفوظة – اختر لتغييرها":TL[k];t.classList.toggle("ok",!!(src||saved));if(src){const i=new Image();i.src=src;t.prepend(i)}}
function clear(){F.forEach(k=>{$(k).value="";$(k).classList.remove("bad")});pend={};sel=null;["p","f","b"].forEach(k=>setTile(k));$("addB").classList.remove("hidden");$("edtB").classList.add("hidden");$("ft").textContent="إضافة سجل جديد";render()}
async function save(edit){
 const d={};F.forEach(k=>{d[k]=val(k);$(k).classList.remove("bad")});const m=F.filter(k=>!d[k]);
 if(m.length){m.forEach(k=>$(k).classList.add("bad"));return say("أكمل الحقول: "+m.map(k=>LB[k]).join("، "))}
 const bk=norm(d.beneficiary),x=recs.find(r=>r.id!==sel&&(r.benKey||norm(r.beneficiary))===bk);
 if(x&&!ask("dup","⚠ المستفيد «"+x.beneficiary+"» مسجّل مسبقًا (للشهيد/المصاب: "+x.personName+"). إن كان تسجيلًا جديدًا فاضغط مرة أخرى للتأكيد."))return;
 const id=edit?sel:doc(RC).id,b=writeBatch(fs),rec={...d,benKey:bk};
 if(pend.p)rec.photo=pend.p;
 for(const k of["f","b"])if(pend[k]){rec["h"+k]=true;IC.delete(id+"_"+k);b.set(doc(fs,"images",id+"_"+k),{rid:id,d:pend[k]})}
 if(edit){rec.updatedAt=Date.now();b.update(doc(RC,id),rec)}else{rec.createdAt=Date.now();rec.by=me.name;b.set(doc(RC,id),rec)}
 $("addB").disabled=$("edtB").disabled=true;
 try{await b.commit();clear();say(edit?"تم التعديل.":"✓ تمت الإضافة.",1)}finally{$("addB").disabled=$("edtB").disabled=false}}
function show(src,info,dl){$("vimg").src=src;$("vi").textContent=info;const a=$("vdl");a.classList.toggle("hidden",!dl);if(dl){a.href=src;a.download=info+".jpg"}$("viewer").classList.remove("hidden")}
async function view(id,k){const r=recs.find(x=>x.id===id);if(!r)return;
 if(k==="p"){if(r.photo&&r.photo.startsWith(JP))show(r.photo,"الصورة الشخصية");return}
 show("","جارٍ التحميل…");const s=await getDoc(doc(fs,"images",id+"_"+k));const d=s.exists()&&s.data().d;if(!d||!d.startsWith(JP))throw Error("الصورة غير متوفرة.");show(d,k==="f"?"الموحدة - الأمامي":"الموحدة - الخلفي",1)}
function pick(id){const r=recs.find(x=>x.id===id);if(!r)return;clear();sel=id;F.forEach(k=>$(k).value=r[k]||"");setTile("p",r.photo&&r.photo.startsWith(JP)?r.photo:"");setTile("f","",r.hf);setTile("b","",r.hb);
 $("addB").classList.add("hidden");$("edtB").classList.remove("hidden");$("ft").textContent="تعديل سجل";render();scrollTo({top:0,behavior:"smooth"})}
async function rm(id){if(!ask("d"+id,"اضغط «حذف» مرة أخرى للتأكيد."))return;const b=writeBatch(fs);b.delete(doc(RC,id));b.delete(doc(fs,"images",id+"_f"));b.delete(doc(fs,"images",id+"_b"));await b.commit();if(sel===id)clear();say("تم الحذف.",1)}
const ST={"شهيد":"اسم الشهيد","شهيدة":"اسم الشهيدة","مصاب":"اسم المصاب","مصابه":"اسم المصابة"},IC=new Map();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);fill(e.target)}}),{rootMargin:"250px"});
async function fill(el){const k=el.dataset.id+"_"+el.dataset.k;try{let d=IC.get(k);if(!d){const s=await getDoc(doc(fs,"images",k));d=s.exists()&&s.data().d;if(!d||!d.startsWith(JP))throw 0;if(IC.size>30)IC.delete(IC.keys().next().value);IC.set(k,d)}const sp=el.querySelector("span");if(sp){const i=new Image();i.alt="";i.src=d;sp.replaceWith(i)}}catch{const sp=el.querySelector("span");if(sp)sp.textContent="تعذّر التحميل"}}
function render(){
 const q=norm(val("q")),f=recs.filter(r=>norm(F.slice(0,6).map(k=>r[k]).join(" ")).includes(q)),M=r=>r.statusType==="شهيد"||r.statusType==="شهيدة";
 $("n0").textContent=recs.length;$("n1").textContent=recs.filter(M).length;$("n2").textContent=recs.filter(r=>!M(r)).length;
 io.disconnect();
 $("list").innerHTML=f.length?f.map(r=>{const i=esc(r.id),ph=!!(r.photo&&r.photo.startsWith(JP)),
 kv=(l,v,n)=>`<div class="kv"><dt>${l}</dt><dd${n?' class="n"':""}>${esc(v)}</dd></div>`,
 g=(k,t,has,src)=>`<button class="gi${k==="p"?"":" c"}" data-a="v" data-id="${i}" data-k="${k}"${has?"":" disabled"}>${src?`<img src="${esc(src)}" alt="">`:`<span>${has?"جارٍ التحميل…":"لا توجد صورة"}</span>`}<em>${t}</em></button>`,
 bt=(a,t,c)=>`<button class="b ${c||""}" data-a="${a}" data-id="${i}">${t}</button>`;
 return `<article class="rc ${M(r)?"m":"i"}${r.id===sel?" sel":""}"><div class="bd">${esc(r.statusType)}</div><dl>${kv(ST[r.statusType]||"الاسم",r.personName)}${kv("اسم المستفيد",r.beneficiary)}${kv("صلة القرابة",r.relation)}${kv("رقم الموحدة",r.unified,1)}${kv("محل النفوس",r.district)}${kv("تاريخ الميلاد",r.birthDate,1)}${kv("تاريخ الحضور",r.attendanceDate,1)}</dl><div class="gal">${g("p","الصورة الشخصية",ph,ph?r.photo:"")}${g("f","الموحدة - الأمامي",r.hf)}${g("b","الموحدة - الخلفي",r.hb)}</div><div class="ra">${canE?bt("pick","✎ تعديل"):""}${canD?bt("rm","✕ حذف","del"):""}</div></article>`}).join(""):'<div class="st">لا توجد سجلات.</div>';
 $("list").querySelectorAll(".gi.c:not([disabled])").forEach(el=>io.observe(el))}
function bumpIdle(){clearTimeout(idle);idle=setTimeout(()=>signOut(auth).then(()=>location.reload()),12e5)}
function enter(uid,u){
 me={id:uid,...u};canE=u.role!=="user";canD=u.role==="admin";
 $("login").classList.add("hidden");$("app").classList.remove("hidden");
 $("me").textContent=u.name;$("av").textContent=(u.name||"؟").trim().charAt(0).toUpperCase();$("role").textContent=RN[u.role]||"";
 $("edtB").classList.add("hidden");render();
 if(started)return;started=true;$("dot").className="dot on";$("conn").textContent="متصل ومتزامن";
 ["click","keydown","touchstart"].forEach(v=>addEventListener(v,bumpIdle,{passive:true}));bumpIdle();
 onSnapshot(query(RC,orderBy("createdAt","desc")),s=>{recs=s.docs.map(d=>({id:d.id,...d.data()}));render()},e=>{$("dot").className="dot";$("conn").textContent="انقطع الاتصال: "+err(e)});
 if(u.role==="admin"){$("adm").classList.remove("hidden");onSnapshot(collection(fs,"users"),s=>{$("ub").innerHTML=s.docs.map(d=>{const x=d.data(),me_=d.id===uid,i=esc(d.id);return `<tr><td>${esc(x.name)}</td><td><select data-uid="${i}" ${me_?"disabled":""}>${Object.keys(RN).map(r=>`<option value="${r}"${x.role===r?" selected":""}>${RN[r]}</option>`).join("")}</select></td><td>${me_?"":`<button class="b del" data-a="du" data-id="${i}">حذف</button>`}</td></tr>`}).join("")})}}
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
 add:()=>save(false),edt:()=>{if(!sel)return say("اختر سجلًا أولًا.");return save(true)},clr:clear,vx:()=>$("viewer").classList.add("hidden"),
 v:(id,k)=>view(id,k),pick:id=>pick(id),rm:id=>rm(id),nu:addUser,
 du:async id=>{if(ask("u"+id,"اضغط «حذف» مرة أخرى لحذف المستخدم."))await deleteDoc(doc(fs,"users",id))},
 inst:async()=>{if(!dp)return;dp.prompt();await dp.userChoice;dp=null;$("ib").classList.add("hidden")}};
let dp=null;
document.addEventListener("click",e=>{const el=e.target.closest("[data-a]");if(el&&A[el.dataset.a])guard(async()=>A[el.dataset.a](el.dataset.id,el.dataset.k))});
document.addEventListener("change",async e=>{const t=e.target;
 if(t.dataset.uid)return guard(()=>updateDoc(doc(fs,"users",t.dataset.uid),{role:t.value}));
 const k=t.dataset.k;if(!k||!t.files)return;const f=t.files[0];if(!f)return;if(!f.type.startsWith("image/"))return say("اختر ملف صورة.");
 try{pend[k]=await shrink(f,k==="p"?360:1800,k==="p"?9e4:9e5);setTile(k,pend[k]);say("تم اختيار الصورة.",1)}catch(x){say(err(x))}t.value=""});
$("lb").onclick=login;$("lu").onkeydown=e=>{if(e.key==="Enter")$("lp").focus()};$("lp").onkeydown=e=>{if(e.key==="Enter")login()};$("q").oninput=render;
try{const s=localStorage.tu;if(s)$("lu").value=s}catch{}
onAuthStateChanged(auth,async u=>{if(busy||!u)return;try{const s=await getDoc(doc(fs,"users",u.uid));if(!s.exists()){await signOut(auth);return lm("حسابك غير مفعّل. اطلب من المدير تفعيله.")}enter(u.uid,s.data())}catch(e){lm(err(e))}});
addEventListener("beforeinstallprompt",e=>{e.preventDefault();dp=e;$("ib").classList.remove("hidden")});
if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
getDoc(doc(fs,"meta","setup")).then(x=>{if(!x.exists())$("sb").classList.remove("hidden")}).catch(()=>{});
