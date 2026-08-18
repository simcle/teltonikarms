import{r as p,c as N,o as W,a as ne,b as C,d as D,e as c,w as G,v as le,n as U,f as te,F as se,g as ae,t as I,h as ge,i as re,j as Z,k as A,l as z,m as oe,u as pe,p as he,q as be,s as J,x as me,y as q,z as ye,A as xe}from"./index-yCKvmcZ0.js";import{m as Y,u as we,s as M}from"./useMapbox-DlkfOIvw.js";import"./_commonjsHelpers-Cpj98o6Y.js";const ke={class:"flex"},_e={class:"w-[350px] relative"},Ce={class:"w-full absolute z-20"},De={class:"rounded w-full bg-white overflow-hidden max-h-96 shadow"},Le={class:"relative flex items-center"},Se={class:"border-t border-gray-300"},Pe={class:"max-h-80 overflow-y-auto mt-2.5"},$e=["onClick"],Ne={class:"flex items-center"},Re={class:"leading-none font-semibold"},Te={class:"text-gray-400 font-light"},Fe={__name:"searchDevice",props:{deviceLists:{type:Array,default:()=>[]}},emits:["isSelected","isCleared"],setup(l,{expose:e,emit:n}){const d=l,o=n,i=p(null),a=p(""),u=p(!1),m=N(()=>d.deviceLists.filter(w=>w.name.toLocaleLowerCase().includes(a.value.toLocaleLowerCase()))),g=w=>{a.value=w.name,o("isSelected",w)},y=()=>{a.value="",o("isCleared")},_=w=>{(!w||!i.value.contains(w.target))&&(u.value=!1)};return e({onClear:y}),W(()=>{document.addEventListener("click",_)}),ne(()=>{document.removeEventListener("click",_)}),(w,h)=>(D(),C("div",ke,[c("div",_e,[c("div",Ce,[c("div",De,[c("div",Le,[G(c("input",{ref_key:"searchRef",ref:i,"onUpdate:modelValue":h[0]||(h[0]=f=>a.value=f),type:"text",name:"search",id:"search",onFocus:h[1]||(h[1]=f=>u.value=!0),class:U([[u.value?" rounded-b-none":"rounded"],"h-9 w-full px-5 outline-none"]),placeholder:"Cari nama Perangkat",autocomplete:"off"},null,34),[[le,a.value]]),G(c("button",{onClick:y,class:"absolute right-3 font-semibold text-xl flex items-center hover:text-blue-500"},h[2]||(h[2]=[c("i",{class:"ph ph-x"},null,-1)]),512),[[te,a.value]])]),G(c("div",Se,[c("ul",Pe,[(D(!0),C(se,null,ae(m.value,(f,t)=>(D(),C("li",{key:t,onClick:s=>g(f),class:"px-5 py-2 cursor-pointer hover:bg-gray-100"},[c("div",Ne,[h[3]||(h[3]=c("div",{class:"text-2xl mr-3 text-gray-500"},[c("i",{class:"ph ph-cell-tower"})],-1)),c("div",null,[c("div",Re,I(f==null?void 0:f.name),1),c("div",Te,I(f==null?void 0:f.type),1)])])],8,$e))),128))])],512),[[te,u.value]])])])])]))}},Ie={class:"flex flex-col space-y-1.5"},Be={class:"flex items-center justify-center space-x-1.5"},Ke={__name:"DeviceStatus",props:{online:{type:Number,default:0},offline:{type:Number,default:0},total:{type:Number,default:0},actived:{type:String}},setup(l){return(e,n)=>(D(),C("div",Ie,[c("div",Be,[ge(e.$slots,"default"),c("button",{onClick:n[0]||(n[0]=d=>e.$emit("filterOnline")),class:U([{"ring-2 ring-green-500":l.actived=="online"},"h-9 border-green-100 border bg-green-600 px-3 rounded text-green-50 flex items-center space-x-1.5"])},[n[3]||(n[3]=c("i",{class:"ph ph-link text-lg"},null,-1)),c("span",null,"Online: "+I(l.online),1)],2),c("button",{onClick:n[1]||(n[1]=d=>e.$emit("filterOffline")),class:U([{"ring-2 ring-red-500":l.actived=="offline"},"h-9 border-red-100 border bg-red-600 px-3 rounded text-red-50 flex items-center space-x-1.5"])},[n[4]||(n[4]=c("i",{class:"ph ph-link text-lg"},null,-1)),c("span",null,"Offline: "+I(l.offline),1)],2),c("button",{onClick:n[2]||(n[2]=d=>e.$emit("filterAll")),class:U([{"ring-2 ring-blue-500":l.actived=="all"},"h-9 border-blue-100 border bg-blue-600 px-3 rounded text-blue-50 flex items-center space-x-1.5"])},[n[5]||(n[5]=c("i",{class:"ph ph-link text-lg"},null,-1)),c("span",null,"Total Perangkat: "+I(l.total),1)],2)])]))}},Me={class:"flex-1 text-sm truncate"},Oe={key:0,class:"capitalize"},Ve={key:1,class:"text-gray-400"},Ee={key:0,class:"absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-30"},Ae={class:"p-2"},Ue=["onKeydown"],ze={class:"max-h-52 overflow-y-auto"},qe=["onClick"],He={key:0,class:"px-3 py-2 text-sm text-gray-400"},Ge={__name:"ComboBox",props:{modelValue:[String,Number,Object,null],options:{type:Array,required:!0},labelKey:{type:String,default:"label"},valueKey:{type:String,default:"value"},placeholder:{type:String,default:"Select..."},clearable:{type:Boolean,default:!0}},emits:["update:modelValue"],setup(l,{emit:e}){const n=l,d=e,o=p(!1),i=p(""),a=p(0),u=p(null),m=p(null),g=N(()=>{const v=n.options.find(L=>L[n.valueKey]===n.modelValue);return v?v[n.labelKey]:""}),y=N(()=>i.value?n.options.filter(v=>v[n.labelKey].toLowerCase().includes(i.value.toLowerCase())):n.options),_=v=>v[n.valueKey]===n.modelValue,w=()=>{o.value=!o.value,o.value&&(i.value="",setTimeout(()=>{var v;return(v=m.value)==null?void 0:v.focus()},50))},h=()=>{o.value=!1},f=()=>{d("update:modelValue",null)},t=v=>{d("update:modelValue",v[n.valueKey]),h()},s=()=>{const v=y.value[a.value];v&&t(v)},x=()=>{a.value<y.value.length-1&&a.value++},P=()=>{a.value>0&&a.value--},B=v=>{u.value.contains(v.target)||h()};W(()=>{document.addEventListener("click",B)}),ne(()=>{document.removeEventListener("click",B)});const O=()=>y.value.findIndex(v=>v[n.valueKey]===n.modelValue);return re(o,v=>{if(v){const L=O();a.value=L!==-1?L:0,setTimeout(()=>{const S=u.value.querySelector("ul"),k=S==null?void 0:S.children[a.value];k&&k.scrollIntoView({block:"nearest"})},50)}}),(v,L)=>(D(),C("div",{class:"relative",ref_key:"wrapper",ref:u},[c("div",{class:"border border-gray-300 rounded flex items-center px-3 h-9 min-w-44 cursor-pointer bg-white",onClick:w},[c("div",Me,[g.value?(D(),C("span",Oe,I(g.value),1)):(D(),C("span",Ve,I(l.placeholder),1))]),l.modelValue&&l.clearable?(D(),C("button",{key:0,onClick:A(f,["stop"]),class:"text-gray-400 hover:text-red-500 mr-2"}," ✕ ")):Z("",!0),L[1]||(L[1]=c("i",{class:"ph ph-caret-down text-gray-500"},null,-1))]),o.value?(D(),C("div",Ee,[c("div",Ae,[G(c("input",{"onUpdate:modelValue":L[0]||(L[0]=S=>i.value=S),name:"search",ref_key:"searchBox",ref:m,type:"text",class:"w-full h-7 border border-gray-300 rounded px-2 text-sm focus:outline-none",placeholder:"Cari...",onKeydown:[z(A(x,["prevent"]),["down"]),z(A(P,["prevent"]),["up"]),z(A(s,["prevent"]),["enter"]),z(A(h,["prevent"]),["esc"])],autocomplete:"off"},null,40,Ue),[[le,i.value]])]),c("ul",ze,[(D(!0),C(se,null,ae(y.value,(S,k)=>(D(),C("li",{key:S[l.valueKey],onClick:R=>t(S),class:U(["capitalize",["px-3 py-2 text-sm cursor-pointer",k===a.value?"bg-blue-600 text-white hover:bg-blue-600!":"",_(S)?"bg-blue-100 text-blue-700 font-medium":"hover:bg-gray-100"]])},I(S[l.labelKey]),11,qe))),128)),y.value.length===0?(D(),C("li",He," Tidak ada data ")):Z("",!0)])])):Z("",!0)],512))}},Ze=()=>{const l=p(!1),e=p([]),n=N(()=>e.value.filter(a=>Number(a.status)===1).length),d=N(()=>e.value.filter(a=>Number(a.status)===0).length),o=N(()=>e.value.length);return{loaderData:l,deviceData:e,onlineCount:n,offlineCount:d,totalCount:o,getDevices:async()=>{l.value=!0;try{const a=await oe.get("/api/device-logger/map");return e.value=a.data.data||[],e.value}finally{l.value=!1}}}},je=()=>{const l=p(!1),e=p([]),n=N(()=>e.value.filter(a=>Number(a.status)===1).length),d=N(()=>e.value.filter(a=>Number(a.status)===0).length),o=N(()=>e.value.length);return{loaderDataPlcRtu:l,devicePlcData:e,onlineCountPlc:n,offlineCountPlc:d,totalCountPlc:o,getDevicesPlc:async(a="")=>{l.value=!0;try{const u=a?`/api/devices/${a}`:"/api/devices/map",m=await oe.get(u);return e.value=m.data.data||[],e.value}catch(u){return console.error("Gagal mengambil data PLC Reservoir:",u),e.value=[],[]}finally{l.value=!1}}}};function Je(l,e){l=l.replace("#","");const n=parseInt(l,16),d=n>>16&255,o=n>>8&255,i=n&255;return`rgba(${d}, ${o}, ${i}, ${e})`}function We(l,e,n){return{width:l,height:l,data:new Uint8Array(l*l*4),color:e,onAdd:function(){const d=document.createElement("canvas");d.width=this.width,d.height=this.height,this.context=d.getContext("2d",{willReadFrequently:!0})},render:function(){const o=performance.now()%1e3/1e3,i=l/2*.3,a=l/2*.4*o+i,u=this.context;return u.clearRect(0,0,this.width,this.height),u.beginPath(),u.arc(this.width/2,this.height/2,a,0,Math.PI*2),u.fillStyle=Je(this.color,1-o),u.fill(),u.beginPath(),u.arc(this.width/2,this.height/2,i,0,Math.PI*2),u.fillStyle=this.color,u.strokeStyle="white",u.lineWidth=2+4*(1-o),u.fill(),u.stroke(),this.data=u.getImageData(0,0,this.width,this.height).data,n&&n.triggerRepaint&&n.triggerRepaint(),!0}}}function Ye(l){return{width:l,height:l,data:new Uint8Array(l*l*4),onAdd:function(){const e=document.createElement("canvas");e.width=this.width,e.height=this.height;const n=e.getContext("2d",{willReadFrequently:!0});this.context=n;const d=l/2*.35;n.clearRect(0,0,this.width,this.height),n.beginPath(),n.arc(this.width/2,this.height/2,d+3,0,Math.PI*2),n.fillStyle="white",n.fill(),n.beginPath(),n.arc(this.width/2,this.height/2,d,0,Math.PI*2),n.fillStyle="#e70008",n.fill(),this.data=n.getImageData(0,0,this.width,this.height).data},render:function(){return!0}}}function Qe(l){const e=new Y.LngLatBounds;return l.features.forEach(n=>{const[d,o]=n.geometry.coordinates;e.extend([d,o])}),e}const Xe=(l,e,n)=>{const d=pe(),o=p(null),i=t=>{if(!t)return"-";const s=new Date(t);if(Number.isNaN(s.getTime()))return"-";const x=P=>String(P).padStart(2,"0");return`${x(s.getDate())}/${x(s.getMonth()+1)}/${String(s.getFullYear()).slice(-2)} ${x(s.getHours())}:${x(s.getMinutes())}`},a=t=>t?t.type==="Logger Tekanan"?t.device_id:t.type==="PLC Reservoir"?t.serial_number:null:null,u=t=>t.type==="Logger Tekanan"?`
                <div class="p-1">

                    <b
                        class="uppercase"
                        style="font-size:14px;"
                    >
                        ${t.name??"-"}
                    </b>

                    <br>

                    <span style="font-size:12px;">
                        Logger Tekanan
                    </span>

                    <div style="font-size:12px;">
                        ${i(t.recorded_at||t.received_at)}
                    </div>

                    <hr class="my-2">

                    ID:
                    <b>${t.device_id}</b>
                    <br>
                    Pressure:
                    <b>${t.pressure??"0"}</b>
                    <br>

                    Voltage:
                    <b>${t.voltage??"0"}</b>
                    <br>

                    Battery:
                    <b>${t.battery??"0"}</b>
                    <br>

                    Signal:
                    <b>${t.signal??"0"}</b>
                    <br>

                    Status:
                    <b
                        style="
                            color:${Number(t.status)===1?"#00a63e":"#dc2626"};
                        "
                    >
                        ${Number(t.status)===1?"ONLINE":"OFFLINE"}
                    </b>

                    <div class="text-center mt-1.5">

                        <button
                            id="my-button"
                            class="
                                h-7
                                bg-blue-500
                                hover:bg-blue-600
                                px-3
                                rounded
                                text-blue-50
                            "
                        >
                            Klik untuk detail
                        </button>

                    </div>

                </div>
            `:t.type==="PLC Reservoir"?`
                <div class="p-1">

                    <b
                        class="uppercase"
                        style="font-size:14px;"
                    >
                        ${t.name??"-"}
                    </b>

                    <br>

                    <span style="font-size:12px;">
                        PLC Reservoir
                    </span>

                    <hr class="my-2">

                    Serial Number:
                    <b>
                        ${t.serial_number??"-"}
                    </b>
                    <br>

                    IP Address:
                    <b>
                        ${t.ip_address??"-"}
                    </b>
                    <br>

                    Status:
                    <b
                        style="
                            color:${Number(t.status)===1?"#00a63e":"#dc2626"};
                        "
                    >
                        ${Number(t.status)===1?"ONLINE":"OFFLINE"}
                    </b>

                    <div class="text-center mt-1.5">

                        <button
                            id="my-button"
                            class="
                                h-7
                                bg-blue-500
                                hover:bg-blue-600
                                px-3
                                rounded
                                text-blue-50
                            "
                        >
                            Klik untuk detail
                        </button>

                    </div>

                </div>
            `:"",m=t=>{if(t){if(t.type==="Logger Tekanan"){d.push("/logger-tekanan/"+t.device_id);return}t.type==="PLC Reservoir"&&d.push("/intake/"+t.serial_number)}},g=t=>{setTimeout(()=>{const s=document.getElementById("my-button");s&&s.addEventListener("click",()=>{m(t)},{once:!0})},0)},y=({device:t,coordinates:s,closeOnClick:x=!0})=>{var P;!l.value||!t||!s||((P=e.value)==null||P.remove(),o.value=a(t),e.value=new Y.Popup({closeButton:!0,closeOnClick:x,offset:10,className:"device-popup"}).setLngLat(s).setHTML(u(t)).on("open",()=>{g(t)}).on("close",()=>{o.value=null}).addTo(l.value))};return{renderDeviceMarkers:t=>{if(!l.value||!(t!=null&&t.features))return;const s=l.value;s.hasImage("icon-online")||s.addImage("icon-online",We(90,"#00a63e",s),{pixelRatio:2}),s.hasImage("icon-offline")||s.addImage("icon-offline",Ye(70),{pixelRatio:2}),s.getSource("device")?s.getSource("device").setData(t):s.addSource("device",{type:"geojson",data:t}),s.getLayer("layer-device")||s.addLayer({id:"layer-device",type:"symbol",source:"device",layout:{"icon-image":["case",["==",["get","status"],1],"icon-online","icon-offline"],"icon-allow-overlap":!0,"icon-ignore-placement":!0,"text-field":["get","name"],"text-size":14,"text-offset":[0,-1],"text-anchor":"bottom","text-font":["Open Sans Bold"],"text-allow-overlap":!1},paint:{"text-color":"#000","text-halo-color":"#fff","text-halo-width":1.2}}),s.on("mouseenter","layer-device",()=>{s.getCanvas().style.cursor="pointer"}),s.on("mouseleave","layer-device",()=>{s.getCanvas().style.cursor=""}),s.on("click","layer-device",x=>{var v;const P=(v=x.features)==null?void 0:v[0];if(!P)return;const B=P.geometry.coordinates,O=P.properties;y({device:O,coordinates:B,closeOnClick:!0})})},fitBoundsAll:t=>{if(!l.value)return;const s=Qe(t);s.isEmpty()||l.value.fitBounds(s,{offset:[0,10],padding:100,maxZoom:15,duration:500})},flyToDevice:t=>{if(!t||!l.value)return;const s=Number(t.longitude),x=Number(t.latitude);!Number.isFinite(s)||!Number.isFinite(x)||(l.value.flyTo({center:[s,x],zoom:15,offset:[0,10],curve:1.4,speed:3,essential:!0}),y({device:t,coordinates:[s,x],closeOnClick:!1}))},updatePopupDevice:t=>{if(!t||!e.value||!o.value)return;const s=a(t);s&&String(o.value)===String(s)&&(e.value.setHTML(u(t)),g(t))}}};function et(l,e,n,d){const o=p(""),i=p("");return{activeDeviceType:o,activeStatus:i,applyFilters:()=>{var y;if(!l.value)return;(y=n.value)==null||y.remove();const u=l.value;if(!u.getLayer("layer-device"))return;let m=["all"];o.value&&m.push(["==",["get","type"],o.value]),i.value==="online"&&m.push(["==",["get","status"],1]),i.value==="offline"&&m.push(["==",["get","status"],0]),m.length===1&&(m=!0),u.setFilter("layer-device",m);const g=new Y.LngLatBounds;e.value.forEach(_=>{const w=!o.value||_.type===o.value;let h=!0;if(i.value==="online"&&(h=Number(_.status)===1),i.value==="offline"&&(h=Number(_.status)===0),!w||!h)return;const f=Number(_.longitude),t=Number(_.latitude);Number.isFinite(f)&&Number.isFinite(t)&&g.extend([f,t])}),g.isEmpty()||u.fitBounds(g,{offset:[0,10],padding:100,maxZoom:15,duration:500})}}}const H=(l=[])=>({type:"FeatureCollection",features:l.filter(e=>e.latitude!==null&&e.longitude!==null&&!Number.isNaN(Number(e.latitude))&&!Number.isNaN(Number(e.longitude))).map(e=>{const n={id:e.id,name:e.name,type:e.type,status:e.status};return e.type==="Logger Tekanan"&&Object.assign(n,{device_id:e.device_id,is_active:e.is_active,pressure:e.pressure,voltage:e.voltage,battery:e.battery,signal:e.signal,recorded_at:e.recorded_at,received_at:e.received_at}),e.type==="PLC RTU"&&Object.assign(n,{serial_number:e.serial_number,ip_address:e.ip_address,no_gsm:e.no_gsm}),{type:"Feature",geometry:{type:"Point",coordinates:[Number(e.longitude),Number(e.latitude)]},properties:n}})}),tt={class:"bg-gray-200 h-full overflow-hidden relative"},nt={class:"absolute z-30 p-2.5 space-x-2.5 flex justify-between"},lt={key:0,class:"left-[922px] top-2.5 z-30"},ot={__name:"dashboard",setup(l){const e=he(),n=p(null),d=p([{id:"Logger Tekanan",name:"Logger Tekanan"},{id:"PLC Reservoir",name:"PLC Reservoir"}]);p(null);const o=p(null),i=p(null),{map:a,initMap:u,destroyMap:m}=we(),{deviceData:g,onlineCount:y,offlineCount:_,totalCount:w,getDevices:h}=Ze(),{devicePlcData:f,onlineCountPlc:t,offlineCountPlc:s,totalCountPlc:x,getDevicesPlc:P}=je(),{renderDeviceMarkers:B,flyToDevice:O,fitBoundsAll:v,updatePopupDevice:L}=Xe(a,o),S=N(()=>k.value==="Logger Tekanan"?g.value:k.value==="PLC Reservoir"?f.value:[...g.value||[],...f.value||[]]),{activeDeviceType:k,activeStatus:R,applyFilters:K}=et(a,S,o),ie=()=>{var r;R.value="online",(r=n.value)==null||r.onClear(),K()},ue=()=>{var r;R.value="offline",(r=n.value)==null||r.onClear(),K()},ce=()=>{var r;R.value="all",(r=n.value)==null||r.onClear(),K()},de=()=>{k.value="",R.value="",K()},j=N(()=>k.value==="Logger Tekanan"?{online:y.value,offline:_.value,total:w.value}:k.value==="PLC Reservoir"?{online:t.value,offline:s.value,total:x.value}:{online:y.value+t.value,offline:_.value+s.value,total:w.value+x.value}),ve=async r=>{R.value="",K(),await xe(),O(r)},fe=()=>{o.value&&(o.value.remove(),o.value=null),i.value&&v(i.value)};re(k,()=>{var r;a.value&&((r=n.value)==null||r.onClear(),R.value="",K())});const Q=r=>{var F;if(!(r!=null&&r.device_id))return;const b=g.value.findIndex(E=>String(E.device_id)===String(r.device_id));if(b===-1)return;const $={...g.value[b],pressure:r.pressure,voltage:r.voltage,battery:r.battery,signal:r.signal,recorded_at:r.recorded_at,received_at:r.received_at,status:1};g.value[b]=$;const V=[...f.value||[],...g.value||[]];i.value=H(V);const T=(F=a.value)==null?void 0:F.getSource("device");T&&T.setData(i.value),L($)},X=r=>{var F;if(!(r!=null&&r.device_id))return;const b=g.value.findIndex(E=>String(E.device_id)===String(r.device_id));if(b===-1)return;const $={...g.value[b],status:Number(r.status)};g.value[b]=$;const V=[...f.value||[],...g.value||[]];i.value=H(V);const T=(F=a.value)==null?void 0:F.getSource("device");T&&T.setData(i.value),L($)},ee=r=>{var F;if(!(r!=null&&r.serial_number))return;const b=f.value.findIndex(E=>String(E.serial_number)===String(r.serial_number));if(b===-1)return;const $={...f.value[b],status:Number(r.status)};f.value[b]=$;const V=[...f.value||[],...g.value||[]];i.value=H(V);const T=(F=a.value)==null?void 0:F.getSource("device");T&&T.setData(i.value),L($)};return W(async()=>{e.set([{label:"Dashboard",to:null}]),await u("map",{center:[112.6214,-7.9839],zoom:9.5,minZoom:8.5,attributionControl:!1});const r=await P(),b=await h(),$=[...r,...b];i.value=H($),B(i.value),v(i.value),M.on("pressure:dashboard",Q),M.on("pressure:status:dashboard",X),M.on("plc:status:dashboard",ee)}),be(()=>{M.off("pressure:dashboard",Q),M.off("pressure:status:dashboard",X),M.off("plc:status:dashboard",ee),m()}),(r,b)=>(D(),C("div",tt,[c("div",nt,[J(Fe,{ref_key:"searchDeviceRef",ref:n,"device-lists":S.value,onIsSelected:ve,onIsCleared:fe},null,8,["device-lists"]),J(Ke,{online:j.value.online,offline:j.value.offline,total:j.value.total,onFilterOnline:ie,onFilterOffline:ue,onFilterAll:ce,actived:q(R)},{default:me(()=>[J(Ge,{modelValue:q(k),"onUpdate:modelValue":b[0]||(b[0]=$=>ye(k)?k.value=$:null),options:d.value,placeholder:"Filter Perangkat",labelKey:"name",valueKey:"id"},null,8,["modelValue","options"])]),_:1},8,["online","offline","total","actived"]),q(k)||q(R)?(D(),C("div",lt,[c("button",{onClick:de,class:"h-9 px-3 bg-white border rounded border-gray-300"},"Reset")])):Z("",!0)]),b[1]||(b[1]=c("div",{id:"map",class:"h-full w-full"},null,-1))]))}};export{ot as default};
