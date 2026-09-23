import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";

function read(){try{return JSON.parse(localStorage.getItem("eskadin-profile"))||{username:"Eskådin Player",displayName:"Eskådin Player",bio:"",avatar:"ES"}}catch{return {username:"Eskådin Player",displayName:"Eskådin Player",bio:"",avatar:"ES"}}}
export default function AccountEdit(){
 const [p,setP]=useState(read); const [saved,setSaved]=useState(false); const navigate=useNavigate();
 const set=(k,v)=>{setSaved(false);setP(x=>({...x,[k]:v}))};
 const save=()=>{const next={...p,username:p.username.trim()||"EskadinPlayer",displayName:p.displayName.trim()||p.username.trim()||"Eskådin Player",avatar:(p.avatar||"ES").trim().slice(0,3).toUpperCase()};localStorage.setItem("eskadin-profile",JSON.stringify(next));setP(next);setSaved(true);window.dispatchEvent(new Event("eskadin-profile"));};
 return <main className="page narrow">
  <div className="eyebrow">ACCOUNT</div><h1 className="page-title">Edit profile</h1>
  <div className="form-card">
   <div className="account-avatar">{p.avatar||"ES"}</div>
   <label>Username<input value={p.username} onChange={e=>set("username",e.target.value)} maxLength={24}/></label>
   <label>Display name<input value={p.displayName} onChange={e=>set("displayName",e.target.value)} maxLength={32}/></label>
   <label>Avatar initials<input value={p.avatar} onChange={e=>set("avatar",e.target.value)} maxLength={3}/></label>
   <label>Bio<textarea value={p.bio} onChange={e=>set("bio",e.target.value)} maxLength={160} placeholder="Cuéntale algo a la gente…"/></label>
   <div className="actions"><button className="button button-primary" onClick={save}>Guardar cambios</button><Link className="button button-ghost" to="/account">Cancelar</Link></div>
   {saved&&<p className="muted">✓ Perfil guardado</p>}
  </div>
 </main>
}
