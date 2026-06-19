import React from "react";
import { useState, useMemo, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
const firebaseConfig={apiKey:"AIzaSyDhikmn2Vu-m2DF0bP6uIqnJZGkgyMLoIk",authDomain:"istiraha-f94f0.firebaseapp.com",projectId:"istiraha-f94f0",storageBucket:"istiraha-f94f0.firebasestorage.app",messagingSenderId:"841224975321",appId:"1:841224975321:web:add62f9ab1da8e146c1fc8"};
const firebaseApp=initializeApp(firebaseConfig);
const db=getFirestore(firebaseApp);
const MONTHS=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const MONTH_ORDER={"يناير":1,"فبراير":2,"مارس":3,"أبريل":4,"مايو":5,"يونيو":6,"يوليو":7,"أغسطس":8,"سبتمبر":9,"أكتوبر":10,"نوفمبر":11,"ديسمبر":12};
const FIRST_BALANCE_MONTH="مايو";const FIRST_BALANCE_YEAR=2026;
const CATEGORIES=["خدمات","مستلزمات","صيانة ونظافة","طعام وشراب","أخرى"];
const CURRENT_YEAR=new Date().getFullYear();
const CURRENT_MONTH=MONTHS[new Date().getMonth()];
const YEARS=[CURRENT_YEAR-1,CURRENT_YEAR,CURRENT_YEAR+1];
const ADMIN_PASS="yes321";
const SESSION_DURATION=60*60*1000;
function todayStr(){return new Date().toISOString().slice(0,10);}
function fmt(n){if(n==null||isNaN(n))return"—";return Number(n).toLocaleString("ar-SA",{minimumFractionDigits:0,maximumFractionDigits:0})+" ر.س";}
function monthIndex(month,year){return year*100+MONTH_ORDER[month];}
function getMonthFromDate(d){return d?MONTHS[new Date(d).getMonth()]:"";}
const IcPlus=()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcTrash=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IcUsers=()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcCalc=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/></svg>;
const IcX=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcEdit=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcReset=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>;
const IcLogout=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const T={navy:"#1E3A5F",blue:"#2563EB",blueLight:"#EFF6FF",green:"#16A34A",greenLight:"#DCFCE7",greenDark:"#14532D",red:"#EF4444",redLight:"#FEE2E2",redDark:"#7F1D1D",amber:"#F59E0B",amberLight:"#FEF3C7",orange:"#F97316",orangeLight:"#FFF3E0",slate:"#F8FAFC",slate2:"#F1F5F9",slate3:"#E2E8F0",gray:"#64748B",darkGray:"#334155",white:"#FFFFFF",purple:"#7C3AED",purpleLight:"#EDE9FE",teal:"#0F6E56",tealLight:"#E1F5EE",font:"'Tajawal',Arial,sans-serif"};
const inputSt={width:"100%",padding:"9px 11px",border:`1.5px solid ${T.slate3}`,borderRadius:10,fontSize:14,fontFamily:T.font,color:T.darkGray,outline:"none",boxSizing:"border-box",background:T.slate,transition:"border .15s"};
const selectSt={...inputSt,cursor:"pointer"};
function Btn({children,onClick,color=T.navy,textColor=T.white,size="md",style={},disabled=false}){const pad=size==="sm"?"7px 13px":size==="lg"?"12px 22px":"9px 16px";const fsz=size==="sm"?12:size==="lg"?15:13;return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#CBD5E1":color,color:disabled?"#94A3B8":textColor,border:"none",borderRadius:10,padding:pad,fontSize:fsz,fontWeight:700,cursor:disabled?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:T.font,transition:"opacity .15s",whiteSpace:"nowrap",...style}} onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity=".85"}} onMouseLeave={e=>{e.currentTarget.style.opacity="1"}}>{children}</button>;}
function Field({label,required,error,children}){return <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:700,color:T.gray,marginBottom:5,fontFamily:T.font}}>{label}{required&&<span style={{color:T.red,marginRight:3}}>*</span>}</label>{children}{error&&<div style={{fontSize:11,color:T.red,marginTop:3,fontFamily:T.font}}>{error}</div>}</div>;}
function Modal({title,onClose,children,width=380}){return <div style={{position:"fixed",inset:0,background:"rgba(10,20,50,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(3px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}><div style={{background:T.white,borderRadius:20,padding:"24px 26px",width,maxWidth:"95vw",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.25)",direction:"rtl",fontFamily:T.font}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><span style={{fontSize:17,fontWeight:800,color:T.navy}}>{title}</span><button onClick={onClose} style={{background:T.slate2,border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.gray}}><IcX/></button></div>{children}</div></div>;}
function Toast({msg,type}){if(!msg)return null;return <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:type==="error"?T.red:type==="warn"?T.amber:T.green,color:T.white,padding:"10px 26px",borderRadius:14,fontFamily:T.font,fontSize:14,fontWeight:700,boxShadow:"0 6px 24px rgba(0,0,0,.22)",zIndex:9999,animation:"fadeup .25s ease"}}>{msg}</div>;}
function KPI({label,value,color,sub,icon,onClick}){return <div onClick={onClick} style={{background:T.white,borderRadius:16,padding:"16px 18px",boxShadow:"0 2px 10px rgba(0,0,0,.07)",borderTop:`4px solid ${color}`,flex:1,minWidth:0,cursor:onClick?"pointer":"default"}}><div style={{fontSize:20,marginBottom:2}}>{icon}</div><div style={{fontSize:10,color:T.gray,fontWeight:700,letterSpacing:.4,marginBottom:3,fontFamily:T.font}}>{label}</div><div style={{fontSize:20,fontWeight:800,color,fontFamily:T.font}}>{value}</div>{sub&&<div style={{fontSize:11,color:T.gray,marginTop:2,fontFamily:T.font}}>{sub}</div>}</div>;}
const TH={padding:"8px 11px",fontSize:11,fontWeight:700,color:T.white,background:T.navy,textAlign:"right",fontFamily:T.font,whiteSpace:"nowrap"};
const TD={padding:"8px 11px",fontSize:12,color:T.darkGray,borderBottom:`1px solid ${T.slate2}`,textAlign:"right",fontFamily:T.font};
const Banner=({text})=><div style={{background:T.amberLight,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#92400E",textAlign:"center",fontFamily:T.font}}>{text}</div>;
export default function App(){
  const [members,setMembers]=useState([]);
  const [income,setIncome]=useState([]);
  const [expenses,setExpenses]=useState([]);
  const [debts,setDebts]=useState([]);
  const [balances,setBalances]=useState([]);
  const [credits,setCredits]=useState([]);
  const [modal,setModal]=useState(null);
  const [incF,setIncF]=useState({memberName:"",month:"",year:CURRENT_YEAR,date:todayStr(),amount:""});
  const [expF,setExpF]=useState({desc:"",cat:"",memberName:"",date:todayStr(),amount:""});
  const [memF,setMemF]=useState({name:"",type:"regular"});
  const [incErr,setIncErr]=useState({});
  const [expErr,setExpErr]=useState({});
  const [memErr,setMemErr]=useState({});
  const [budgetMonth,setBudgetMonth]=useState("");
  const [budgetYear,setBudgetYear]=useState(CURRENT_YEAR);
  const [budgetResult,setBudgetResult]=useState(null);
  const [editDebt,setEditDebt]=useState(null);
  const [editDebtAmt,setEditDebtAmt]=useState("");
  const [debtView,setDebtView]=useState("summary");
  const [processing,setProcessing]=useState(false);
  const [toast,setToast]=useState(null);
  const [incFilterMonth,setIncFilterMonth]=useState(CURRENT_MONTH);
  const [incFilterYear,setIncFilterYear]=useState(CURRENT_YEAR);
  const [expFilterMonth,setExpFilterMonth]=useState(CURRENT_MONTH);
  const [expFilterYear,setExpFilterYear]=useState(CURRENT_YEAR);
  const [isAdmin,setIsAdmin]=useState(()=>{try{const s=localStorage.getItem("adminSession");if(!s)return false;const{time}=JSON.parse(s);return Date.now()-time<SESSION_DURATION;}catch{return false;}});
  const [adminPassInput,setAdminPassInput]=useState("");
  const [adminPassError,setAdminPassError]=useState(false);
  const [pressTimer,setPressTimer]=useState(null);
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
  const loginAdmin=()=>{if(adminPassInput===ADMIN_PASS){localStorage.setItem("adminSession",JSON.stringify({time:Date.now()}));setIsAdmin(true);setModal(null);setAdminPassInput("");setAdminPassError(false);showToast("✅ وضع المحاسب مفعّل");}else{setAdminPassError(true);}};
  const logoutAdmin=()=>{localStorage.removeItem("adminSession");setIsAdmin(false);showToast("تم تسجيل الخروج","warn");};
  const startPress=()=>{const t=setTimeout(()=>setModal("adminLogin"),800);setPressTimer(t);};
  const endPress=()=>{if(pressTimer)clearTimeout(pressTimer);setPressTimer(null);};
  useEffect(()=>{
    const u1=onSnapshot(collection(db,"members"),s=>{setMembers(s.docs.map(d=>({id:d.id,...d.data()})));});
    const u2=onSnapshot(collection(db,"income"),s=>{setIncome(s.docs.map(d=>({id:d.id,...d.data()})));});
    const u3=onSnapshot(collection(db,"expenses"),s=>{setExpenses(s.docs.map(d=>({id:d.id,...d.data()})));});
    const u4=onSnapshot(collection(db,"debts"),s=>{setDebts(s.docs.map(d=>({id:d.id,...d.data()})));});
    const u5=onSnapshot(collection(db,"balances"),s=>{setBalances(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>monthIndex(a.month,a.year)-monthIndex(b.month,b.year)));});
    const u6=onSnapshot(collection(db,"balance_credits"),s=>{setCredits(s.docs.map(d=>({id:d.id,...d.data()})));});
    return()=>{u1();u2();u3();u4();u5();u6();};
  },[]);
  const plusMembers=useMemo(()=>members.filter(m=>m.type==="plus"),[members]);
  const totalInc=useMemo(()=>income.reduce((s,r)=>s+r.amount,0),[income]);
  const totalExp=useMemo(()=>expenses.reduce((s,r)=>s+r.amount,0),[expenses]);
  const totalCredits=useMemo(()=>credits.reduce((s,c)=>s+c.amount,0),[credits]);
  const balance=totalInc+totalCredits+pendingCarryover-totalExp;
  const activeDebts=useMemo(()=>debts.filter(d=>d.remaining>0),[debts]);
  const debtSummary=useMemo(()=>Object.values(activeDebts.reduce((acc,d)=>{if(!acc[d.memberName])acc[d.memberName]={memberName:d.memberName,memberType:d.memberType,total:0};acc[d.memberName].total+=d.remaining;return acc;},{})),[activeDebts]);
  const lastBalance=useMemo(()=>balances.length>0?balances[balances.length-1]:null,[balances]);
  const pendingCarryover=useMemo(()=>lastBalance?.carryover||0,[lastBalance]);
  const nextAllowedMonth=useMemo(()=>{if(balances.length===0)return{month:FIRST_BALANCE_MONTH,year:FIRST_BALANCE_YEAR};const last=balances[balances.length-1];const lastIdx=MONTH_ORDER[last.month];if(lastIdx===12)return{month:"يناير",year:last.year+1};return{month:MONTHS[lastIdx],year:last.year};},[balances]);
  const recentIncome=useMemo(()=>[...income].sort((a,b)=>b.createdAt-a.createdAt).slice(0,20),[income]);
  const recentExpenses=useMemo(()=>[...expenses].sort((a,b)=>b.createdAt-a.createdAt).slice(0,20),[expenses]);
  const filteredIncome=useMemo(()=>income.filter(r=>(!incFilterMonth||r.month===incFilterMonth)&&r.year===incFilterYear).sort((a,b)=>b.createdAt-a.createdAt),[income,incFilterMonth,incFilterYear]);
  const filteredExpenses=useMemo(()=>expenses.filter(r=>(!expFilterMonth||getMonthFromDate(r.date)===expFilterMonth)&&new Date(r.date).getFullYear()===expFilterYear).sort((a,b)=>b.createdAt-a.createdAt),[expenses,expFilterMonth,expFilterYear]);
  const submitMember=async()=>{const err={};if(!memF.name.trim())err.name="أدخل الاسم";if(members.some(m=>m.name===memF.name.trim()))err.name="الاسم مكرر";setMemErr(err);if(Object.keys(err).length)return;await addDoc(collection(db,"members"),{name:memF.name.trim(),type:memF.type,createdAt:Date.now()});setMemF({name:"",type:"regular"});showToast("✅ تم إضافة العضو");};
  const submitIncome=async()=>{const err={};if(!incF.memberName)err.member="اختر العضو";if(!incF.month)err.month="اختر الشهر";if(!incF.date)err.date="أدخل تاريخ الدفع";const amt=parseFloat(incF.amount);if(!incF.amount||isNaN(amt)||amt<=0)err.amount="أدخل مبلغاً صحيحاً";setIncErr(err);if(Object.keys(err).length)return;await addDoc(collection(db,"income"),{memberName:incF.memberName,month:incF.month,year:incF.year,date:incF.date,amount:amt,createdAt:Date.now()});setIncF({memberName:"",month:"",year:CURRENT_YEAR,date:todayStr(),amount:""});setModal(null);showToast("✅ تم تسجيل الإيراد");};
  const submitExpense=async()=>{const err={};if(!expF.desc.trim())err.desc="أدخل وصف المصروف";const amt=parseFloat(expF.amount);if(!expF.amount||isNaN(amt)||amt<=0)err.amount="أدخل مبلغاً صحيحاً";setExpErr(err);if(Object.keys(err).length)return;await addDoc(collection(db,"expenses"),{desc:expF.desc.trim(),cat:expF.cat||"أخرى",memberName:expF.memberName||"",date:expF.date||todayStr(),amount:amt,createdAt:Date.now()});if(expF.memberName){await addDoc(collection(db,"debts"),{memberName:expF.memberName,memberType:members.find(m=>m.name===expF.memberName)?.type||"regular",desc:expF.desc.trim(),date:expF.date||todayStr(),original:amt,remaining:amt,createdAt:Date.now()});}setExpF({desc:"",cat:"",memberName:"",date:todayStr(),amount:""});setModal(null);showToast("✅ تم تسجيل المصروف");};
  const del=async(col,id)=>{await deleteDoc(doc(db,col,id));};
  const clearDebt=async(d)=>{await updateDoc(doc(db,"debts",d.id),{remaining:0});showToast("✅ تم تسديد الدين");};
  const clearMemberDebts=async(memberName)=>{const md=activeDebts.filter(d=>d.memberName===memberName);await Promise.all(md.map(d=>updateDoc(doc(db,"debts",d.id),{remaining:0})));showToast("✅ تم تسديد ديون "+memberName);};
  const updateDebt=async()=>{const amt=parseFloat(editDebtAmt);if(isNaN(amt)||amt<0){showToast("أدخل مبلغاً صحيحاً","error");return;}await updateDoc(doc(db,"debts",editDebt.id),{remaining:Math.max(0,editDebt.remaining-amt)});setEditDebt(null);setEditDebtAmt("");showToast("✅ تم تحديث الدين");};
  const calcBudget=async()=>{
    if(!budgetMonth){showToast("اختر الشهر أولاً","warn");return;}
    const existing=balances.find(b=>b.month===budgetMonth&&b.year===budgetYear);
    if(existing){showToast(`⚠️ موازنة ${budgetMonth} ${budgetYear} نُفِّذت بالفعل`,"warn");return;}
    const selectedIdx=monthIndex(budgetMonth,budgetYear);
    const nextIdx=monthIndex(nextAllowedMonth.month,nextAllowedMonth.year);
    if(selectedIdx!==nextIdx){showToast(`⚠️ يجب إجراء موازنة ${nextAllowedMonth.month} ${nextAllowedMonth.year} أولاً`,"warn");return;}
    const prevCarryover=pendingCarryover;
    const mInc=income.filter(r=>r.month===budgetMonth&&r.year===budgetYear).reduce((s,r)=>s+r.amount,0);
    const mExp=expenses.filter(r=>{const d=new Date(r.date);return MONTHS[d.getMonth()]===budgetMonth&&d.getFullYear()===budgetYear;}).reduce((s,r)=>s+r.amount,0);
    const bal=mInc-mExp;
    const rawDeficit=bal<0?Math.abs(bal):0;
    const deficit=rawDeficit+prevCarryover;
    const n=plusMembers.length;
    const rawShare=n>0?deficit/n:0;
    const sharePerMember=Math.floor(rawShare);
    const carryover=n>0?(rawShare-sharePerMember)*n:0;
    const memberBreakdown=plusMembers.map(m=>{const memberDebtTotal=activeDebts.filter(d=>d.memberName===m.name).reduce((s,d)=>s+d.remaining,0);const deducted=Math.min(sharePerMember,memberDebtTotal);const stillOwes=Math.max(0,sharePerMember-memberDebtTotal);return{...m,sharePerMember,memberDebtTotal,deducted,stillOwes};});
    const totalDeducted=memberBreakdown.reduce((s,m)=>s+m.deducted,0);
    const realDeficit=deficit-totalDeducted-carryover;
    setBudgetResult({month:budgetMonth,year:budgetYear,mInc,mExp,bal,rawDeficit,prevCarryover,deficit,sharePerMember,carryover,memberBreakdown,totalDeducted,realDeficit,isNew:true});
    setModal("budget");
  };
  const confirmBudget=async()=>{
    if(!budgetResult||!budgetResult.isNew)return;
    setProcessing(true);
    try{
      const debtSnapshot=activeDebts.map(d=>({id:d.id,remaining:d.remaining}));
      const creditIds=[];
      for(const m of budgetResult.memberBreakdown){
        if(m.deducted>0){
          let toDeduct=m.deducted;
          const memberDebts=activeDebts.filter(d=>d.memberName===m.name).sort((a,b)=>a.createdAt-b.createdAt);
          for(const d of memberDebts){if(toDeduct<=0)break;const x=Math.min(toDeduct,d.remaining);await updateDoc(doc(db,"debts",d.id),{remaining:d.remaining-x});toDeduct-=x;}
          const cr=await addDoc(collection(db,"balance_credits"),{memberName:m.name,month:budgetResult.month,year:budgetResult.year,amount:m.deducted,createdAt:Date.now()});
          creditIds.push(cr.id);
        }
      }
      await addDoc(collection(db,"balances"),{month:budgetResult.month,year:budgetResult.year,date:todayStr(),mInc:budgetResult.mInc,mExp:budgetResult.mExp,rawDeficit:budgetResult.rawDeficit,prevCarryover:budgetResult.prevCarryover,deficit:budgetResult.deficit,sharePerMember:budgetResult.sharePerMember,carryover:budgetResult.carryover,totalDeducted:budgetResult.totalDeducted,realDeficit:budgetResult.realDeficit,memberBreakdown:budgetResult.memberBreakdown,debtSnapshot,creditIds,createdAt:Date.now()});
      showToast(`✅ تمت موازنة ${budgetResult.month} ${budgetResult.year}`);setModal(null);setBudgetResult(null);
    }catch(e){showToast("حدث خطأ","error");}
    setProcessing(false);
  };
  const resetLastBalance=async()=>{
    if(!lastBalance){showToast("لا توجد موازنة","warn");return;}
    setProcessing(true);
    try{
      for(const snap of lastBalance.debtSnapshot){try{await updateDoc(doc(db,"debts",snap.id),{remaining:snap.remaining});}catch(e){}}
      if(lastBalance.creditIds){for(const cid of lastBalance.creditIds){try{await deleteDoc(doc(db,"balance_credits",cid));}catch(e){}}}
      await deleteDoc(doc(db,"balances",lastBalance.id));
      showToast(`✅ تم إعادة موازنة ${lastBalance.month} ${lastBalance.year}`);
    }catch(e){showToast("حدث خطأ","error");}
    setProcessing(false);
  };
  return(<div style={{minHeight:"100vh",background:"#EEF2F7",fontFamily:T.font,direction:"rtl",padding:"18px 14px"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;600;700;800&display=swap');*{box-sizing:border-box}input:focus,select:focus{border-color:#2563EB!important;background:#fff!important;outline:none}button:active{transform:scale(.97)}@keyframes fadeup{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px}tr:hover td{background:#F8FAFC!important}.badge{display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700}`}</style>
    <div style={{background:`linear-gradient(135deg,${T.navy} 0%,${T.blue} 100%)`,borderRadius:20,padding:"20px 24px",marginBottom:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:T.white,cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:8}}
            onMouseDown={startPress} onMouseUp={endPress} onTouchStart={startPress} onTouchEnd={endPress}>
            🏡 حساب الاستراحة
            {isAdmin&&<span style={{fontSize:11,background:"rgba(255,255,255,.2)",borderRadius:6,padding:"2px 8px"}}>محاسب</span>}
          </div>
          {isAdmin&&<div style={{marginTop:6}}><Btn size="sm" color="rgba(255,255,255,.15)" textColor={T.white} onClick={logoutAdmin}><IcLogout/> خروج المحاسب</Btn></div>}
          <div style={{fontSize:12,color:"#BFDBFE",marginTop:6}}>{plusMembers.length} أعضاء+ · {members.filter(m=>m.type==="regular").length} أعضاء عاديون</div>
          {lastBalance&&<div style={{fontSize:11,color:"#93C5FD",marginTop:2}}>آخر موازنة: {lastBalance.month} {lastBalance.year}</div>}
          {pendingCarryover>0&&<div style={{fontSize:11,color:"#FEF3C7",marginTop:2}}>⚠️ فرق تقريب محمول: {fmt(pendingCarryover)}</div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"stretch"}}>
          <Btn color={T.red} style={{width:170,justifyContent:"center"}} onClick={()=>{setExpF({desc:"",cat:"",memberName:"",date:todayStr(),amount:""});setExpErr({});setModal("expense");}}><IcPlus/> مصروف جديد</Btn>
          <Btn color={T.green} style={{width:170,justifyContent:"center"}} onClick={()=>{setIncF({memberName:"",month:"",year:CURRENT_YEAR,date:todayStr(),amount:""});setIncErr({});setModal("income");}}><IcPlus/> إيراد جديد</Btn>
          <Btn color={T.white} textColor={T.navy} style={{width:170,justifyContent:"center"}} onClick={()=>setModal("members")}><IcUsers/> الأعضاء</Btn>
        </div>
      </div>
    </div>
    <div style={{display:"flex",gap:14,marginBottom:18,flexWrap:"wrap"}}>
      <KPI label="إجمالي الإيرادات" value={fmt(totalInc)} color={T.green} icon="💰" sub={`${income.length} عملية — اضغط للتفاصيل`} onClick={()=>setModal("incList")}/>
      <KPI label="إجمالي المصاريف" value={fmt(totalExp)} color={T.red} icon="📤" sub={`${expenses.length} عملية — اضغط للتفاصيل`} onClick={()=>setModal("expList")}/>
      <KPI label="الرصيد الحالي" value={fmt(Math.abs(balance))} color={balance>=0?T.blue:T.orange} icon={balance>=0?"✅":"⚠️"} sub={balance>=0?"فائض":"عجز"}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
      <div style={{background:T.white,borderRadius:16,boxShadow:"0 2px 10px rgba(0,0,0,.07)",overflow:"hidden"}}>
        <div style={{background:`linear-gradient(90deg,${T.greenDark}ee,${T.greenDark}bb)`,padding:"13px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:T.white,fontWeight:700,fontSize:15}}>💰 الإيرادات</span>
          <Btn size="sm" color={T.white} textColor={T.greenDark} onClick={()=>{setIncF({memberName:"",month:"",year:CURRENT_YEAR,date:todayStr(),amount:""});setIncErr({});setModal("income");}}><IcPlus/></Btn>
        </div>
        <div style={{maxHeight:300,overflowY:"auto",overflowX:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
            <thead style={{position:"sticky",top:0}}><tr><th style={{...TH,width:"40%"}}>العضو</th><th style={{...TH,width:"30%"}}>الشهر</th><th style={{...TH,width:"30%"}}>المبلغ</th></tr></thead>
            <tbody>
              {recentIncome.length===0&&<tr><td colSpan={3} style={{...TD,textAlign:"center",color:T.gray,padding:20}}>لا توجد إيرادات</td></tr>}
              {recentIncome.map(r=>(<tr key={r.id}><td style={{...TD,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.memberName}</td><td style={{...TD,fontSize:11}}>{r.month}</td><td style={{...TD,color:T.green,fontWeight:700,fontSize:11}}>{fmt(r.amount)}</td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{background:T.white,borderRadius:16,boxShadow:"0 2px 10px rgba(0,0,0,.07)",overflow:"hidden"}}>
        <div style={{background:`linear-gradient(90deg,${T.redDark}ee,${T.redDark}bb)`,padding:"13px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:T.white,fontWeight:700,fontSize:15}}>📤 المصاريف</span>
          <Btn size="sm" color={T.white} textColor={T.redDark} onClick={()=>{setExpF({desc:"",cat:"",memberName:"",date:todayStr(),amount:""});setExpErr({});setModal("expense");}}><IcPlus/></Btn>
        </div>
        <div style={{maxHeight:300,overflowY:"auto",overflowX:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
            <thead style={{position:"sticky",top:0}}><tr><th style={{...TH,width:"45%"}}>البيان</th><th style={{...TH,width:"20%"}}>العضو</th><th style={{...TH,width:"35%"}}>المبلغ</th></tr></thead>
            <tbody>
              {recentExpenses.length===0&&<tr><td colSpan={3} style={{...TD,textAlign:"center",color:T.gray,padding:20}}>لا توجد مصاريف</td></tr>}
              {recentExpenses.map(r=>(<tr key={r.id}><td style={{...TD,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.desc}</td><td style={{...TD,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.memberName||"—"}</td><td style={{...TD,color:T.red,fontWeight:700,fontSize:11}}>{fmt(r.amount)}</td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
      {isAdmin?(<>
        <select value={budgetYear} onChange={e=>{setBudgetYear(Number(e.target.value));setBudgetResult(null);}} style={{...selectSt,width:110,flex:"none"}}>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select>
        <select value={budgetMonth} onChange={e=>{setBudgetMonth(e.target.value);setBudgetResult(null);}} style={{...selectSt,width:160,flex:"none"}}><option value="">— اختر الشهر —</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select>
        <Btn size="lg" color={T.navy} style={{flex:1,justifyContent:"center",minWidth:160}} onClick={calcBudget} disabled={processing}><IcCalc/> احسب الموازنة</Btn>
        {lastBalance&&<Btn size="md" color={T.orange} style={{justifyContent:"center"}} onClick={resetLastBalance} disabled={processing}><IcReset/> Reset {lastBalance.month}</Btn>}
      </>):(
        <div style={{flex:1,padding:"12px 16px",background:T.slate2,borderRadius:12,fontSize:13,color:T.gray,textAlign:"center",fontFamily:T.font}}>الموازنة غير مفعّلة لهذا الحساب</div>
      )}
    </div>
    <div style={{background:T.white,borderRadius:16,boxShadow:"0 2px 10px rgba(0,0,0,.07)",overflow:"hidden",marginBottom:16}}>
      <div style={{background:`linear-gradient(90deg,${T.purple}ee,${T.purple}bb)`,padding:"13px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:T.white,fontWeight:700,fontSize:15}}>💳 الديون {activeDebts.length>0?`(${debtSummary.length} أعضاء)`:"— لا توجد ديون"}</span>
        {activeDebts.length>0&&<button onClick={()=>setDebtView(v=>v==="summary"?"detail":"summary")} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:8,padding:"4px 12px",color:T.white,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>{debtView==="summary"?"تفصيل":"ملخّص"}</button>}
      </div>
      {activeDebts.length===0?(<div style={{padding:"20px",textAlign:"center",color:T.gray,fontSize:13}}>لا توجد ديون مستحقة</div>):(
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{(debtView==="summary"?["العضو","إجمالي الدين",""]:[" العضو","البيان","الأصلي","المتبقي",""]).map(h=><th key={h} style={{...TH,background:T.purple}}>{h}</th>)}</tr></thead>
        <tbody>{debtView==="summary"?debtSummary.map(m=>(<tr key={m.memberName}><td style={TD}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:7,height:7,borderRadius:"50%",background:m.memberType==="plus"?T.purple:T.gray,flexShrink:0}}/><span style={{fontWeight:600}}>{m.memberName}</span><span className="badge" style={{background:m.memberType==="plus"?T.purpleLight:T.slate2,color:m.memberType==="plus"?T.purple:T.gray,fontSize:10}}>{m.memberType==="plus"?"عضو+":"عضو"}</span></div></td><td style={{...TD,color:T.orange,fontWeight:700}}>{fmt(m.total)}</td><td style={{...TD,padding:"5px 8px"}}>{isAdmin&&<button onClick={()=>clearMemberDebts(m.memberName)} style={{background:T.greenLight,border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",color:T.green,fontFamily:T.font,fontSize:11,fontWeight:700}}>تم الدفع</button>}</td></tr>)):activeDebts.sort((a,b)=>b.createdAt-a.createdAt).map(d=>(<tr key={d.id}><td style={TD}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:7,height:7,borderRadius:"50%",background:d.memberType==="plus"?T.purple:T.gray,flexShrink:0}}/><span style={{fontWeight:600}}>{d.memberName}</span></div></td><td style={{...TD,color:T.gray}}>{d.desc}</td><td style={TD}>{fmt(d.original)}</td><td style={{...TD,color:T.orange,fontWeight:700}}>{fmt(d.remaining)}</td><td style={{...TD,padding:"5px 8px"}}>{isAdmin&&<div style={{display:"flex",gap:6}}><button onClick={()=>clearDebt(d)} style={{background:T.greenLight,border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",color:T.green,fontFamily:T.font,fontSize:11,fontWeight:700}}>تم الدفع</button><button onClick={()=>{setEditDebt(d);setEditDebtAmt("");}} style={{background:T.blueLight,border:"none",borderRadius:6,padding:"4px 6px",cursor:"pointer",color:T.blue,display:"flex"}}><IcEdit/></button></div>}</td></tr>))}</tbody>
      </table></div>)}
    </div>
    {isAdmin&&credits.length>0&&(<div style={{background:T.white,borderRadius:16,boxShadow:"0 2px 10px rgba(0,0,0,.07)",overflow:"hidden",marginBottom:16}}>
      <div style={{background:`linear-gradient(90deg,${T.teal},#1D9E75)`,padding:"13px 18px"}}>
        <span style={{color:T.white,fontWeight:700,fontSize:15}}>📊 مخصومات الموازنة</span>
      </div>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["العضو","الشهر","السنة","المبلغ المخصوم"].map(h=><th key={h} style={{...TH,background:T.teal}}>{h}</th>)}</tr></thead>
        <tbody>
          {[...credits].sort((a,b)=>monthIndex(a.month,a.year)-monthIndex(b.month,b.year)).map(c=>(<tr key={c.id}><td style={TD}>{c.memberName}</td><td style={TD}>{c.month}</td><td style={{...TD,color:T.gray}}>{c.year}</td><td style={{...TD,color:T.teal,fontWeight:700}}>{fmt(c.amount)}</td></tr>))}
          <tr><td colSpan={3} style={{...TD,fontWeight:700}}>الإجمالي</td><td style={{...TD,color:T.teal,fontWeight:800}}>{fmt(credits.reduce((s,c)=>s+c.amount,0))}</td></tr>
        </tbody>
      </table></div>
    </div>)}
    {modal==="adminLogin"&&(<Modal title="🔐 وضع المحاسب" onClose={()=>{setModal(null);setAdminPassInput("");setAdminPassError(false);}}>
      <Field label="كلمة المرور" error={adminPassError?"كلمة المرور غلط":""}>
        <input type="password" style={{...inputSt,borderColor:adminPassError?T.red:T.slate3}} value={adminPassInput} onChange={e=>{setAdminPassInput(e.target.value);setAdminPassError(false);}} onKeyDown={e=>e.key==="Enter"&&loginAdmin()} placeholder="أدخل كلمة المرور" autoFocus/>
      </Field>
      <Btn color={T.navy} style={{width:"100%",justifyContent:"center"}} onClick={loginAdmin}>دخول</Btn>
    </Modal>)}
    {modal==="incList"&&(<Modal title="💰 سجل الإيرادات" onClose={()=>setModal(null)} width={480}>
      {!isAdmin&&<Banner text="إضافة الإيراد غير ممكنة لهذا الحساب"/>}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <select value={incFilterMonth} onChange={e=>setIncFilterMonth(e.target.value)} style={{...selectSt,flex:1}}><option value="">كل الشهور</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select>
        <select value={incFilterYear} onChange={e=>setIncFilterYear(Number(e.target.value))} style={{...selectSt,width:110,flex:"none"}}>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select>
      </div>
      <div style={{borderRadius:12,overflow:"hidden",border:`1px solid ${T.slate3}`}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["العضو","الشهر","السنة","تاريخ الدفع","المبلغ",isAdmin?"":""].map((h,i)=><th key={i} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {filteredIncome.length===0&&<tr><td colSpan={isAdmin?6:5} style={{...TD,textAlign:"center",color:T.gray,padding:20}}>لا توجد إيرادات</td></tr>}
            {filteredIncome.map(r=>(<tr key={r.id}><td style={TD}>{r.memberName}</td><td style={TD}>{r.month}</td><td style={{...TD,fontSize:11}}>{r.year}</td><td style={{...TD,fontSize:11}}>{r.date}</td><td style={{...TD,color:T.green,fontWeight:700}}>{fmt(r.amount)}</td>{isAdmin&&<td style={{...TD,padding:"4px 6px"}}><button onClick={()=>del("income",r.id)} style={{background:T.redLight,border:"none",borderRadius:6,padding:"4px 6px",cursor:"pointer",color:T.red,display:"flex"}}><IcTrash/></button></td>}</tr>))}
          </tbody>
        </table>
      </div>
      <div style={{marginTop:14,padding:"10px 14px",background:T.greenLight,borderRadius:10,textAlign:"center",fontSize:13,color:T.greenDark,fontWeight:700}}>الإجمالي: {fmt(filteredIncome.reduce((s,r)=>s+r.amount,0))}</div>
    </Modal>)}
    {modal==="expList"&&(<Modal title="📤 سجل المصاريف" onClose={()=>setModal(null)} width={480}>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <select value={expFilterMonth} onChange={e=>setExpFilterMonth(e.target.value)} style={{...selectSt,flex:1}}><option value="">كل الشهور</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select>
        <select value={expFilterYear} onChange={e=>setExpFilterYear(Number(e.target.value))} style={{...selectSt,width:110,flex:"none"}}>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select>
      </div>
      <div style={{borderRadius:12,overflow:"hidden",border:`1px solid ${T.slate3}`}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["البيان","التصنيف","العضو","التاريخ","المبلغ",isAdmin?"":""].map((h,i)=><th key={i} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {filteredExpenses.length===0&&<tr><td colSpan={isAdmin?6:5} style={{...TD,textAlign:"center",color:T.gray,padding:20}}>لا توجد مصاريف</td></tr>}
            {filteredExpenses.map(r=>(<tr key={r.id}><td style={TD}>{r.desc}</td><td style={TD}><span className="badge" style={{background:T.slate2,color:T.gray}}>{r.cat}</span></td><td style={TD}>{r.memberName?<span style={{color:T.purple,fontWeight:600}}>{r.memberName}</span>:<span style={{color:T.gray,fontSize:11}}>—</span>}</td><td style={{...TD,fontSize:11}}>{r.date}</td><td style={{...TD,color:T.red,fontWeight:700}}>{fmt(r.amount)}</td>{isAdmin&&<td style={{...TD,padding:"4px 6px"}}><button onClick={()=>del("expenses",r.id)} style={{background:T.redLight,border:"none",borderRadius:6,padding:"4px 6px",cursor:"pointer",color:T.red,display:"flex"}}><IcTrash/></button></td>}</tr>))}
          </tbody>
        </table>
      </div>
      <div style={{marginTop:14,padding:"10px 14px",background:T.redLight,borderRadius:10,textAlign:"center",fontSize:13,color:T.redDark,fontWeight:700}}>الإجمالي: {fmt(filteredExpenses.reduce((s,r)=>s+r.amount,0))}</div>
    </Modal>)}
    {modal==="members"&&(<Modal title={`👥 الأعضاء (${members.length})`} onClose={()=>setModal(null)} width={440}>
      {!isAdmin&&<Banner text="إضافة الأعضاء غير ممكنة لهذا الحساب"/>}
      {isAdmin&&<div style={{background:T.blueLight,borderRadius:12,padding:"14px 16px",marginBottom:16}}><div style={{fontSize:13,fontWeight:700,color:T.navy,marginBottom:10}}>إضافة عضو جديد</div><div style={{display:"flex",gap:10,alignItems:"flex-start",flexWrap:"wrap"}}><div style={{flex:2,minWidth:120}}><input style={{...inputSt,borderColor:memErr.name?T.red:T.slate3}} placeholder="اسم العضو" value={memF.name} onChange={e=>setMemF(p=>({...p,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submitMember()}/>{memErr.name&&<div style={{fontSize:11,color:T.red,marginTop:2}}>{memErr.name}</div>}</div><div style={{flex:1,minWidth:100}}><select style={selectSt} value={memF.type} onChange={e=>setMemF(p=>({...p,type:e.target.value}))}><option value="regular">عضو</option><option value="plus">عضو+</option></select></div><Btn color={T.blue} onClick={submitMember}><IcPlus/> إضافة</Btn></div></div>}
      <div style={{display:"flex",gap:16,marginBottom:12,fontSize:12,color:T.gray}}><span><span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:T.purple,marginLeft:5}}/>عضو+ يغطي العجز</span><span><span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:T.gray,marginLeft:5}}/>عضو عادي</span></div>
      <div style={{maxHeight:340,overflowY:"auto"}}>{members.length===0&&<div style={{textAlign:"center",color:T.gray,padding:20}}>لا يوجد أعضاء</div>}{members.map(m=>(<div key={m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:10,marginBottom:6,background:m.type==="plus"?T.purpleLight:T.slate2}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{width:34,height:34,borderRadius:"50%",background:m.type==="plus"?T.purple:T.gray,color:T.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700}}>{m.name[0]}</span><div><div style={{fontWeight:700,color:T.darkGray,fontSize:14}}>{m.name}</div><span className="badge" style={{background:m.type==="plus"?T.purple:T.gray,color:T.white,fontSize:10}}>{m.type==="plus"?"عضو+":"عضو"}</span></div></div>{isAdmin&&<button onClick={()=>del("members",m.id)} style={{background:T.redLight,border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.red,display:"flex"}}><IcTrash/></button>}</div>))}</div>
    </Modal>)}
    {modal==="income"&&(<Modal title="💰 تسجيل إيراد جديد" onClose={()=>setModal(null)}>
      {!isAdmin?(<><Banner text="إضافة الإيراد غير ممكنة لهذا الحساب"/><Btn color={T.slate2} textColor={T.gray} style={{width:"100%",justifyContent:"center"}} onClick={()=>setModal(null)}>إغلاق</Btn></>):(<><Field label="العضو" required error={incErr.member}><select style={{...selectSt,borderColor:incErr.member?T.red:T.slate3}} value={incF.memberName} onChange={e=>setIncF(p=>({...p,memberName:e.target.value}))}><option value="">— اختر العضو —</option>{members.filter(m=>m.type==="plus").length>0&&<optgroup label="── أعضاء+">{members.filter(m=>m.type==="plus").map(m=><option key={m.id} value={m.name}>{m.name} (عضو+)</option>)}</optgroup>}{members.filter(m=>m.type==="regular").length>0&&<optgroup label="── أعضاء عاديون">{members.filter(m=>m.type==="regular").map(m=><option key={m.id} value={m.name}>{m.name}</option>)}</optgroup>}</select></Field><Field label="الشهر" required error={incErr.month}><select style={{...selectSt,borderColor:incErr.month?T.red:T.slate3}} value={incF.month} onChange={e=>setIncF(p=>({...p,month:e.target.value}))}><option value="">— اختر الشهر —</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select></Field><Field label="السنة" required><select style={selectSt} value={incF.year} onChange={e=>setIncF(p=>({...p,year:Number(e.target.value)}))}>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></Field><Field label="تاريخ الدفع" required error={incErr.date}><input type="date" style={{...inputSt,borderColor:incErr.date?T.red:T.slate3}} value={incF.date} onChange={e=>setIncF(p=>({...p,date:e.target.value}))}/></Field><Field label="المبلغ (ر.س)" required error={incErr.amount}><input type="number" min="1" style={{...inputSt,borderColor:incErr.amount?T.red:T.slate3}} placeholder="100" value={incF.amount} onChange={e=>setIncF(p=>({...p,amount:e.target.value}))}/></Field><div style={{display:"flex",gap:10,marginTop:4}}><Btn color={T.green} style={{flex:1,justifyContent:"center"}} onClick={submitIncome}>تسجيل الإيراد</Btn><Btn color={T.slate2} textColor={T.gray} style={{flex:1,justifyContent:"center"}} onClick={()=>setModal(null)}>إلغاء</Btn></div></>)}
    </Modal>)}
    {modal==="expense"&&(<Modal title="📤 تسجيل مصروف جديد" onClose={()=>setModal(null)}><Field label="وصف المصروف" required error={expErr.desc}><input style={{...inputSt,borderColor:expErr.desc?T.red:T.slate3}} placeholder="مثال: فاتورة الكهرباء" value={expF.desc} onChange={e=>setExpF(p=>({...p,desc:e.target.value}))}/></Field><Field label="التصنيف (اختياري)"><select style={selectSt} value={expF.cat} onChange={e=>setExpF(p=>({...p,cat:e.target.value}))}><option value="">— اختر تصنيفاً —</option>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></Field><Field label="العضو (اختياري)"><select style={selectSt} value={expF.memberName} onChange={e=>setExpF(p=>({...p,memberName:e.target.value}))}><option value="">— من حساب الاستراحة —</option>{members.filter(m=>m.type==="plus").length>0&&<optgroup label="── أعضاء+">{members.filter(m=>m.type==="plus").map(m=><option key={m.id} value={m.name}>{m.name} (عضو+)</option>)}</optgroup>}{members.filter(m=>m.type==="regular").length>0&&<optgroup label="── أعضاء عاديون">{members.filter(m=>m.type==="regular").map(m=><option key={m.id} value={m.name}>{m.name}</option>)}</optgroup>}</select>{expF.memberName&&<div style={{fontSize:11,color:T.purple,marginTop:3,fontFamily:T.font}}>⚡ سيُسجَّل دين باسم {expF.memberName}</div>}</Field><Field label="المبلغ (ر.س)" required error={expErr.amount}><input type="number" min="1" style={{...inputSt,borderColor:expErr.amount?T.red:T.slate3}} placeholder="0" value={expF.amount} onChange={e=>setExpF(p=>({...p,amount:e.target.value}))}/></Field><Field label="التاريخ"><input type="date" style={inputSt} value={expF.date} onChange={e=>setExpF(p=>({...p,date:e.target.value}))}/></Field><div style={{display:"flex",gap:10,marginTop:4}}><Btn color={T.red} style={{flex:1,justifyContent:"center"}} onClick={submitExpense}>تسجيل المصروف</Btn><Btn color={T.slate2} textColor={T.gray} style={{flex:1,justifyContent:"center"}} onClick={()=>setModal(null)}>إلغاء</Btn></div></Modal>)}
    {modal==="budget"&&budgetResult&&(<Modal title={`📊 موازنة ${budgetResult.month} ${budgetResult.year}`} onClose={()=>setModal(null)} width={500}>
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
        {[{label:"الإيرادات",val:budgetResult.mInc,color:T.green,bg:T.greenLight},{label:"المصاريف",val:budgetResult.mExp,color:T.red,bg:T.redLight},{label:budgetResult.bal>=0?"فائض":"عجز",val:Math.abs(budgetResult.bal),color:budgetResult.bal>=0?T.blue:T.orange,bg:budgetResult.bal>=0?"#EFF6FF":T.orangeLight}].map(item=>(<div key={item.label} style={{flex:1,minWidth:110,background:item.bg,borderRadius:12,padding:"12px 14px",textAlign:"center"}}><div style={{fontSize:10,color:T.gray,fontWeight:700,marginBottom:4}}>{item.label}</div><div style={{fontSize:17,fontWeight:800,color:item.color}}>{fmt(item.val)}</div></div>))}
      </div>
      {budgetResult.prevCarryover>0&&<div style={{background:T.amberLight,borderRadius:10,padding:"8px 14px",marginBottom:12,fontSize:12,color:"#92400E",display:"flex",justifyContent:"space-between"}}><span>+ فرق تقريب محمول من الشهر السابق</span><strong>{fmt(budgetResult.prevCarryover)}</strong></div>}
      {budgetResult.deficit>0?(<>
        <div style={{background:T.amberLight,border:`1px solid ${T.amber}44`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#92400E"}}>
          ⚠️ العجز الإجمالي <strong>{fmt(budgetResult.deficit)}</strong> — نصيب كل عضو+ <strong>{fmt(budgetResult.sharePerMember)}</strong>
          {budgetResult.carryover>0&&<div style={{fontSize:11,marginTop:4}}>فرق تقريب يُحمل للشهر القادم: <strong>{fmt(budgetResult.carryover)}</strong></div>}
        </div>
        <div style={{fontSize:13,fontWeight:700,color:T.navy,marginBottom:8}}>توزيع العجز:</div>
        <div style={{borderRadius:12,overflow:"hidden",border:`1px solid ${T.slate3}`,marginBottom:12}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["العضو","نصيبه","دينه","يُخصم","المتبقي عليه"].map(h=><th key={h} style={{...TH,background:T.navy,fontSize:10,padding:"8px"}}>{h}</th>)}</tr></thead>
            <tbody>{budgetResult.memberBreakdown.map(m=>(<tr key={m.id}>
              <td style={TD}><div style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:22,height:22,borderRadius:"50%",background:T.purple,color:T.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{m.name[0]}</span>{m.name}</div></td>
              <td style={{...TD,color:T.orange,fontWeight:700,fontSize:11}}>{fmt(m.sharePerMember)}</td>
              <td style={{...TD,color:T.purple,fontSize:11}}>{fmt(m.memberDebtTotal)}</td>
              <td style={{...TD,color:T.green,fontWeight:700,fontSize:11}}>{fmt(m.deducted)}</td>
              <td style={TD}>{m.stillOwes<=0?<span className="badge" style={{background:T.greenLight,color:T.green}}>✅</span>:<span style={{color:T.red,fontWeight:700,fontSize:11}}>{fmt(m.stillOwes)}</span>}</td>
            </tr>))}</tbody>
          </table>
        </div>
        <div style={{background:T.tealLight,borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:13,color:T.teal,display:"flex",justifyContent:"space-between"}}>
          <span>إجمالي المخصوم من الديون</span><strong>{fmt(budgetResult.totalDeducted)}</strong>
        </div>
        <div style={{background:budgetResult.realDeficit<=0?T.greenLight:T.redLight,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:14,color:budgetResult.realDeficit<=0?T.greenDark:T.redDark,display:"flex",justifyContent:"space-between",fontWeight:700}}>
          <span>العجز الفعلي المتبقي</span>
          <span>{budgetResult.realDeficit<=0?"✅ صفر":fmt(budgetResult.realDeficit)}</span>
        </div>
      </>):(<div style={{background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:10,padding:"14px 16px",textAlign:"center",color:T.greenDark,fontSize:14,marginBottom:14}}>✅ لا يوجد عجز في {budgetResult.month} {budgetResult.year}</div>)}
      {budgetResult.isNew&&<div style={{background:T.blueLight,borderRadius:10,padding:"10px 14px",fontSize:12,color:T.navy,marginBottom:14}}>📌 سيتم خصم مبلغ العجز من ديون الأعضاء+ وتسجيله في مخصومات الموازنة</div>}
      <div style={{display:"flex",gap:10}}>
        {budgetResult.isNew&&<Btn color={T.green} style={{flex:1,justifyContent:"center"}} onClick={confirmBudget} disabled={processing}>{processing?"جاري التنفيذ...":"✅ تأكيد وتنفيذ الموازنة"}</Btn>}
        <Btn color={T.slate2} textColor={T.gray} style={{flex:1,justifyContent:"center"}} onClick={()=>setModal(null)}>إغلاق</Btn>
      </div>
    </Modal>)}
    {editDebt&&(<Modal title="تعديل الدين" onClose={()=>setEditDebt(null)} width={340}><div style={{marginBottom:14,fontSize:13,color:T.gray}}><strong>{editDebt.memberName}</strong> — {editDebt.desc}<br/>المتبقي: <strong style={{color:T.orange}}>{fmt(editDebt.remaining)}</strong></div><Field label="المبلغ المدفوع الآن"><input type="number" min="1" style={inputSt} placeholder="0" value={editDebtAmt} onChange={e=>setEditDebtAmt(e.target.value)}/></Field><div style={{display:"flex",gap:10,marginTop:4}}><Btn color={T.green} style={{flex:1,justifyContent:"center"}} onClick={updateDebt}>تأكيد</Btn><Btn color={T.slate2} textColor={T.gray} style={{flex:1,justifyContent:"center"}} onClick={()=>setEditDebt(null)}>إلغاء</Btn></div></Modal>)}
    {toast&&<Toast msg={toast.msg} type={toast.type}/>}
  </div>);
}
