import {useEffect,useState} from "react";

const categories=[["All","1"],["Clothing","3"],["Body parts","4"],["Accessories","11"],["Animations","12"],["Community","13"]];

export default function Marketplace(){
 const [q,setQ]=useState(""); const [cat,setCat]=useState("1"); const [items,setItems]=useState([]); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
 const load=async()=>{setLoading(true);setError("");try{const p=new URLSearchParams({Category:cat,Limit:"30",SortType:"0",SortAggregation:"5"});if(q.trim())p.set("Keyword",q.trim());const r=await fetch("https://catalog.roblox.com/v1/search/items/details?"+p);if(!r.ok)throw new Error("Marketplace API "+r.status);const j=await r.json();setItems(j.data||[])}catch(e){setError("No se pudo cargar el catálogo ahora mismo.")}finally{setLoading(false)}};
 useEffect(()=>{load()},[cat]);
 return <main className="page">
  <div className="page-head"><div><div className="eyebrow">ESKÅDIN MARKETPLACE</div><h1 className="page-title">Marketplace</h1><p>Explora el catálogo público de avatar de Roblox desde Eskådin. Los elementos siguen siendo propiedad de sus creadores.</p></div></div>
  <div className="toolbar"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()} placeholder="Buscar ropa, accesorios, animaciones…"/><button className="button button-primary" onClick={load}>Buscar</button></div>
  <div className="toolbar" style={{overflowX:"auto"}}>{categories.map(([name,id])=><button key={id} className={"button "+(cat===id?"button-primary":"button-ghost")} onClick={()=>setCat(id)}>{name}</button>)}</div>
  {loading&&<div className="form-card"><p>Cargando catálogo…</p></div>}
  {error&&<div className="form-card"><p>{error}</p><button className="button button-primary" onClick={load}>Reintentar</button></div>}
  {!loading&&!error&&<div className="games-grid">{items.map(item=><a className="game-card" key={item.id} href={"https://www.roblox.com/catalog/"+item.id} target="_blank" rel="noreferrer"><div className="game-cover blue" style={{display:"grid",placeItems:"center",overflow:"hidden"}}>{item.thumbnailUrl?<img src={item.thumbnailUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span>ITEM</span>}</div><div className="game-info"><h3>{item.name||"Unnamed item"}</h3><p>{item.itemType||"Avatar item"}</p><b>{item.priceInRobux==null?"Gratis":item.priceInRobux+" Robux"}</b></div></a>)}</div>}
  {!loading&&!error&&!items.length&&<div className="form-card"><p>No hay resultados.</p></div>}
  <p className="muted" style={{marginTop:24}}>Esto integra el catálogo mediante la API pública de Marketplace. No copia ni redistribuye automáticamente los archivos 3D originales.</p>
 </main>
}
