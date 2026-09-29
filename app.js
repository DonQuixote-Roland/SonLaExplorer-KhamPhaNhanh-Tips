const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const normalize=s=>(s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d');
const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
let state={q:'',area:'all',season:'all',activity:'all',type:'all'};

function matches(p){const q=normalize(state.q); return (!q||normalize(p.searchText).includes(q))&&(state.area==='all'||p.area===state.area)&&(state.season==='all'||p.seasons.includes(state.season))&&(state.activity==='all'||p.activities.includes(state.activity))&&(state.type==='all'||p.type===state.type)}
function card(p){return `<article class="place-card" data-id="${p.id}"><a href="place.html?id=${encodeURIComponent(p.id)}" class="card-img"><img src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy" onerror="this.classList.add('broken')"><span>${p.badge}</span></a><div class="card-body"><div class="meta"><span>${p.emoji} ${esc(p.area)}</span><span>${esc(p.type)}</span></div><h3><a href="place.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a></h3><p>${esc(p.summary)}</p><div class="chips">${p.activities.slice(0,3).map(x=>`<span>${esc(x)}</span>`).join('')}</div><a class="read-more" href="place.html?id=${encodeURIComponent(p.id)}">Đọc hồ sơ đầy đủ →</a></div></article>`}
function render(){const arr=PLACES.filter(matches); $('#resultCount').textContent=arr.length; $('#placeGrid').innerHTML=arr.map(card).join(''); $('#emptyState').hidden=arr.length!==0; $('#heroCount').textContent=PLACES.length; $('#activeQuery').textContent=state.q?` · từ khóa “${state.q}”`:''; renderMap(arr)}
function setOptions(){const areas=[...new Set(PLACES.map(p=>p.area))].sort((a,b)=>a.localeCompare(b,'vi')); const acts=[...new Set(PLACES.flatMap(p=>p.activities))].sort((a,b)=>a.localeCompare(b,'vi')); const types=[...new Set(PLACES.map(p=>p.type))].sort((a,b)=>a.localeCompare(b,'vi')); for(const [id,vals] of [['areaFilter',areas],['activityFilter',acts],['typeFilter',types]]){const el=$('#'+id); el.innerHTML='<option value="all">Tất cả</option>'+vals.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('')}}
function renderMap(arr=PLACES){const list=arr.length?arr:PLACES; $('#mapCount').textContent=list.length; $('#mapPlaces').innerHTML=list.map((p,i)=>`<button class="map-item" data-map-id="${p.id}"><span>${String(i+1).padStart(2,'0')}</span><div><b>${esc(p.name)}</b><small>${esc(p.area)} · ${esc(p.type)}</small></div></button>`).join(''); $$('.map-item').forEach(b=>b.onclick=()=>focusMap(b.dataset.mapId)); if(list[0])focusMap(list[0].id,false)}
function focusMap(id,scroll=true){const p=PLACES.find(x=>x.id===id); if(!p)return; $('#googleMap').src=p.mapEmbed; $('#mapInfo').innerHTML=`<img src="${p.images[0]}" alt="${esc(p.name)}"><div><span>${p.emoji} ${esc(p.badge)}</span><h3>${esc(p.name)}</h3><p>${esc(p.summary)}</p><a class="read-more" href="place.html?id=${encodeURIComponent(p.id)}">Mở trang chi tiết →</a><a class="map-link" target="_blank" rel="noreferrer" href="${p.mapUrl}">Chỉ đường trên Google Maps ↗</a></div>`; $$('.map-item').forEach(x=>x.classList.toggle('active',x.dataset.mapId===id)); if(scroll&&window.innerWidth<800)$('#map').scrollIntoView({behavior:'smooth'})}
function runFilters(){state.q=$('#inlineSearch').value.trim();state.area=$('#areaFilter').value;state.season=$('#seasonFilter').value;state.activity=$('#activityFilter').value;state.type=$('#typeFilter').value;render()}

const EVENTS=[
  {title:'Lễ hội Cà phê Sơn La lần thứ hai',dateText:'Dự kiến tháng 10/2026',location:'Quảng trường Tây Bắc, Sơn La',status:'upcoming',desc:'Chuỗi hoạt động về cà phê, hội chợ, kết nối giao thương, trải nghiệm nông trại và các chương trình văn hóa – nghệ thuật.',source:'Báo Sơn La',url:'https://baosonla.vn/thoi-su-chinh-tri/dam-bao-cac-dieu-kien-to-chuc-le-hoi-ca-phe-son-la-lan-thu-hai-nam-2026-51YnYvXDR.html'},
  {title:'Ngày hội Đổi mới sáng tạo & Chuyển đổi số Sơn La 2026',dateText:'28–29/09/2026',location:'Quảng trường Tây Bắc',status:'current',desc:'Sự kiện đang diễn ra tại Sơn La, có các hoạt động kết nối, giới thiệu, trải nghiệm sản phẩm và mô hình công nghệ.',source:'Báo Sơn La',url:'https://baosonla.vn/'},
  {title:'Tuần Văn hóa – Du lịch Mộc Châu 2026',dateText:'Đã diễn ra 28/08–04/09',location:'Khu du lịch Quốc gia Mộc Châu',status:'past',desc:'Đã kết thúc; gồm nhiều hoạt động văn hóa, du lịch và Lễ hội thổ cẩm quốc tế lần thứ nhất.',source:'Báo Sơn La',url:'https://baosonla.vn/du-lich/hoi-nghi-ve-cong-tac-phat-trien-du-lich-va-chuan-bi-tuan-van-hoa-du-lich-moc-chau-nam-2026-QldRWVAvR.html'}
];
function eventStatus(e){if(e.status==='current')return '<span class="event-status live">ĐANG DIỄN RA</span>'; if(e.status==='upcoming')return '<span class="event-status">SẮP DIỄN RA</span>'; return '<span class="event-status unknown">ĐÃ DIỄN RA</span>'}
function renderEvents(){const box=$('#eventList'); if(!box)return; const active=EVENTS.filter(e=>e.status==='current'||e.status==='upcoming'); box.innerHTML=active.map((e,i)=>`<article class="event-item"><div class="event-date"><strong>${i===0?'10':'28'}</strong><small>${i===0?'2026':'09/2026'}</small></div><div><h3>${esc(e.title)}</h3><p>${esc(e.dateText)} · ${esc(e.location)}</p><div class="event-source">${esc(e.source)} · <a href="${e.url}" target="_blank" rel="noreferrer">Xem nguồn ↗</a></div></div>${eventStatus(e)}</article>`).join('')}

function openSearch(q){state.q=q.trim(); $('#searchInput').value=state.q; $('#searchClear').hidden=!state.q; saveRecent(state.q); const nq=normalize(state.q); const arr=PLACES.filter(p=>!nq||normalize(p.searchText).includes(nq)); const ev=EVENTS.filter(e=>!nq||normalize(e.title+' '+e.desc+' '+e.location).includes(nq)); $('#searchPanel').hidden=false; $('#searchTitle').textContent=state.q?`“${state.q}” — ${arr.length+ev.length} kết quả`:`Tất cả ${arr.length+ev.length} kết quả`; const placeHtml=arr.map(p=>`<a class="search-result" href="place.html?id=${encodeURIComponent(p.id)}"><img src="${p.images[0]}"><div><span>${p.emoji} ${esc(p.area)} · ${esc(p.type)}</span><h3>${highlight(p.name,state.q)}</h3><p>${esc(p.summary)}</p><b>Đọc hồ sơ →</b></div></a>`).join(''); const eventHtml=ev.map(e=>`<a class="search-result event-search" href="${e.url}" target="_blank" rel="noreferrer"><div class="event-search-icon">🎉</div><div><span>${eventStatus(e)} · ${esc(e.location)}</span><h3>${highlight(e.title,state.q)}</h3><p>${esc(e.dateText)} · ${esc(e.desc)}</p><b>Xem nguồn sự kiện ↗</b></div></a>`).join(''); $('#searchResults').innerHTML=(placeHtml+eventHtml)||`<div class="empty"><span>🧭</span><h3>Không có kết quả</h3><p>Thử tên địa điểm, địa bàn, hoạt động hoặc lễ hội.</p></div>`; $('#searchPanel').scrollIntoView({behavior:'smooth',block:'start'})}
function highlight(text,q){if(!q)return esc(text); const n=normalize(q); const idx=normalize(text).indexOf(n); if(idx<0)return esc(text); return esc(text.slice(0,idx))+'<mark>'+esc(text.slice(idx,idx+q.length))+'</mark>'+esc(text.slice(idx+q.length))}
function suggestions(q){const box=$('#searchSuggestions'); if(!q){renderRecent();box.hidden=!$('#recentSearches').hidden;return} const nq=normalize(q); const places=PLACES.filter(p=>normalize(p.searchText).includes(nq)).slice(0,5); const acts=[...new Set(PLACES.flatMap(p=>p.activities))].filter(x=>normalize(x).includes(nq)).slice(0,4); const areas=[...new Set(PLACES.map(p=>p.area))].filter(x=>normalize(x).includes(nq)).slice(0,3); const events=EVENTS.filter(e=>normalize(e.title+' '+e.location+' '+e.desc).includes(nq)).slice(0,2); let html=''; if(places.length)html+='<div class="suggestion-group">Địa điểm</div>'+places.map(p=>`<a href="place.html?id=${encodeURIComponent(p.id)}" class="suggestion-item"><span>${p.emoji}</span><div><b>${highlight(p.name,q)}</b><small>${esc(p.area)} · ${esc(p.type)}</small></div></a>`).join(''); if(areas.length)html+='<div class="suggestion-group">Địa bàn</div>'+areas.map(x=>`<a href="#discover" class="suggestion-item" data-search-value="${esc(x)}"><span>📍</span><div><b>${highlight(x,q)}</b><small>Tìm các điểm trong khu vực này</small></div></a>`).join(''); if(acts.length)html+='<div class="suggestion-group">Hoạt động</div>'+acts.map(x=>`<a href="#discover" class="suggestion-item" data-search-value="${esc(x)}"><span>✨</span><div><b>${highlight(x,q)}</b><small>Tìm địa điểm có hoạt động này</small></div></a>`).join(''); if(events.length)html+='<div class="suggestion-group">Lễ hội & sự kiện</div>'+events.map(e=>`<a href="${e.url}" target="_blank" rel="noreferrer" class="suggestion-item"><span>🎉</span><div><b>${highlight(e.title,q)}</b><small>${esc(e.dateText)}</small></div></a>`).join(''); html+=`<button class="search-all" data-search-all>🔎 Xem tất cả kết quả cho “${esc(q)}”</button>`; box.innerHTML=html; box.hidden=false; $$('#searchSuggestions [data-search-value]').forEach(a=>a.onclick=e=>{e.preventDefault();openSearch(a.dataset.searchValue);box.hidden=true}); const all=$('#searchSuggestions [data-search-all]'); if(all)all.onclick=()=>{openSearch(q);box.hidden=true}}
function saveRecent(q){if(!q)return; let r=[];try{r=JSON.parse(localStorage.getItem('sonlaRecentSearches')||'[]')}catch{}; r=[q,...r.filter(x=>x.toLowerCase()!==q.toLowerCase())].slice(0,5);localStorage.setItem('sonlaRecentSearches',JSON.stringify(r));renderRecent()}
function renderRecent(){const box=$('#recentSearches');if(!box)return;let r=[];try{r=JSON.parse(localStorage.getItem('sonlaRecentSearches')||'[]')}catch{};if(!r.length){box.hidden=true;return}box.innerHTML='<span>Gần đây:</span>'+r.map(x=>`<button type="button" data-recent="${esc(x)}">${esc(x)}</button>`).join('');box.hidden=false;$$('#recentSearches [data-recent]').forEach(b=>b.onclick=()=>{openSearch(b.dataset.recent);$('#searchSuggestions').hidden=true})}
function seasonDetail(key){const labels={xuân:['🌸','Mùa xuân','Hoa, bản làng và hoạt động văn hóa'],hè:['☀️','Mùa hè','Thác, hồ, cảnh xanh và những ngày mát ở vùng cao'],thu:['🍂','Mùa thu','Mây, núi và những chuyến đi chậm'],đông:['❄️','Mùa đông','Săn mây, cao nguyên và không khí lạnh']}; const l=labels[key]; const arr=PLACES.filter(p=>p.seasons.includes(key)); $('#seasonDetail').innerHTML=`<div class="season-icon">${l[0]}</div><div><b>${l[1]}</b><p>${l[2]}. Có <strong>${arr.length}</strong> hồ sơ phù hợp trong dữ liệu hiện tại.</p><div class="season-picks">${arr.slice(0,8).map(p=>`<a href="place.html?id=${p.id}">${p.name}</a>`).join('')}</div></div>`}
// Gióng Mini AI: trợ lý hỏi đáp cục bộ, dùng dữ liệu PLACES ngay trong website.
// Không cần API key. AI nhận diện địa điểm + ý định câu hỏi + ngữ cảnh câu hỏi trước đó.
let chatMemory={lastPlace:null,lastIntent:null};

const CHAT_INTENTS=[
  {key:'history', words:['lich su','lich su phat trien','phat trien','hinh thanh','nguon goc','duoc cong nhan','cong nhan']},
  {key:'activities', words:['lam gi','choi gi','hoat dong','trai nghiem','co gi','tham quan','di dau','diem nao']},
  {key:'season', words:['mua nao','mua gi','thoi diem','khi nao','bao gio','thang nao','mua phu hop','thoi tiet']},
  {key:'location', words:['o dau','dia chi','vi tri','toa do','den nhu the nao','duong di','map','ban do']},
  {key:'overview', words:['la gi','gioi thieu','tong quan','dac diem','noi bat','the nao','ke ve']},
  {key:'culture', words:['van hoa','ban lang','cong dong','am thuc','truyen thong','nguoi dan','nghe truyen thong']},
  {key:'compare', words:['so sanh','khac gi','khac nhau','hay hon','giua']},
  {key:'gallery', words:['anh','hinh','hinh anh','xem anh','gallery']},
  {key:'itinerary', words:['lich trinh','hanh trinh','2 ngay','3 ngay','mot ngay','ke hoach di','goi y di']},
  {key:'weather', words:['thoi tiet','nhiet do','do am','nhiet do hien tai','hom nay']},
  {key:'events', words:['le hoi','su kien','sap dien ra','dang dien ra','gan nhat','thang nay']}
];

function detectPlace(q){
  const n=normalize(q);
  // Ưu tiên tên địa điểm dài hơn để tránh khớp một phần tên.
  return [...PLACES].sort((a,b)=>normalize(b.name).length-normalize(a.name).length)
    .find(p=>n.includes(normalize(p.name))||n.includes(normalize(p.area)))||null;
}
function detectIntent(q){
  const n=normalize(q);
  let best={key:'overview',score:0};
  for(const item of CHAT_INTENTS){
    let score=0;
    for(const w of item.words) if(n.includes(w)) score += w.includes(' ')?2:1;
    if(score>best.score) best={key:item.key,score};
  }
  // Câu hỏi nối tiếp như "còn lịch sử?", "ở đâu?" dùng địa điểm trước đó.
  return best.score?best.key:(chatMemory.lastIntent||'overview');
}
function isFollowUp(q){
  const n=normalize(q);
  return !!chatMemory.lastPlace && (n.length<45 || /^(con|the|va|o dau|khi nao|mua nao|lam gi|co gi|lich su|gia|anh|hinh)/.test(n));
}
function placeLink(p,label='Xem hồ sơ đầy đủ →'){
  return `<a class="chat-place-link" href="place.html?id=${encodeURIComponent(p.id)}">${label}</a>`;
}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]||'';}
function miniAI(q){
  const raw=q.trim();
  const place=detectPlace(raw)|| (isFollowUp(raw)?chatMemory.lastPlace:null);
  const intent=detectIntent(raw);
  if(place) chatMemory.lastPlace=place;
  chatMemory.lastIntent=intent;

  if(!place){
    if(intent==='compare' && /moc chau.*ta xua|ta xua.*moc chau/.test(normalize(raw)))
      return `<p>Mộc Châu thiên về cao nguyên, nông nghiệp, bản làng và nhiều điểm tham quan kết hợp; Tà Xùa nổi bật hơn với núi cao và trải nghiệm săn mây. Bạn có thể hỏi tiếp về <b>mùa đi</b>, <b>hoạt động</b> hoặc <b>cách di chuyển</b> của từng nơi.</p>`;
    return `<p>Mình chưa xác định được địa điểm bạn đang hỏi. Bạn thử ghi tên như <b>Mộc Châu</b>, <b>Tà Xùa</b>, <b>Ngọc Chiến</b> hoặc hỏi kiểu: “Mộc Châu có hoạt động gì?”, “Lịch sử phát triển của Mộc Châu?”, “Đi Mộc Châu mùa nào?”.</p>`;
  }

  const p=place;
  const name=esc(p.name);
  switch(intent){
    case 'history':
      return `<p><b>${name}</b> — ${esc(p.history)}</p><p>Nếu muốn xem sâu hơn, mình có thể kể tiếp về quá trình phát triển, giá trị văn hóa hoặc các điểm du lịch liên quan.</p>${placeLink(p)}`;
    case 'activities':
      return `<p>Ở <b>${name}</b>, bạn có thể tập trung vào các trải nghiệm sau:</p><ul>${p.activities.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>${esc(p.overview)}</p>${placeLink(p)}`;
    case 'season':
      return `<p>Với <b>${name}</b>, dữ liệu hiện tại ghi nhận các mùa phù hợp: <b>${p.seasons.map(x=>esc(x)).join(', ')}</b>.</p><p>Thời điểm thực tế vẫn phụ thuộc thời tiết từng năm. Nếu bạn nói rõ mục tiêu như <b>săn mây</b>, <b>chụp ảnh</b> hay <b>nghỉ dưỡng</b>, mình có thể hướng câu trả lời theo mục tiêu đó.</p>${placeLink(p)}`;
    case 'location':
      return `<p><b>${name}</b> nằm tại <b>${esc(p.address)}</b>.</p><p>Tọa độ: <b>${esc(String(p.lat))}, ${esc(String(p.lng))}</b>.</p><a class="chat-place-link" target="_blank" rel="noreferrer" href="${p.mapUrl}">Mở vị trí trên Google Maps ↗</a>`;
    case 'culture':
      return `<p><b>${name}</b> có thể được tìm hiểu qua góc nhìn văn hóa cộng đồng, đời sống địa phương và các trải nghiệm gắn với vùng đất.</p><p>${esc(p.overview)}</p>${placeLink(p,'Mở hồ sơ để xem phần văn hóa →')}`;
    case 'gallery':
      return `<p>Mình đã chuẩn bị ảnh trong hồ sơ <b>${name}</b>. Bạn có thể mở trang chi tiết để xem gallery cùng phần mô tả tương ứng với từng nội dung.</p>${placeLink(p,'🖼️ Mở gallery ảnh →')}`;
    case 'weather':
      return `<p>Thời tiết Sơn La hiện tại trên website là <b>${esc($('#weatherTemp')?.textContent||'--')}°C</b>, ${esc($('#weatherText')?.textContent||'đang cập nhật')}, độ ẩm <b>${esc($('#weatherHumidity')?.textContent||'--')}</b>, gió khoảng <b>${esc($('#weatherWind')?.textContent||'--')}</b>.</p><p>Phần thời tiết lấy dữ liệu tự động và có dự báo 5 ngày ở trang chủ.</p>`;
    case 'events':
      return `<p>Website đang ưu tiên các sự kiện gần nhất được đưa vào dữ liệu. Bạn có thể xem mục <b>Lễ hội & Sự kiện</b> trên trang chủ để biết trạng thái và nguồn.</p>${EVENTS.filter(e=>e.status!=='past').map(e=>`<p>🎉 <b>${esc(e.title)}</b> — ${esc(e.dateText)}</p>`).join('')}`;
    case 'itinerary':
      const local=PLACES.filter(x=>x.area===p.area||x.id===p.id).slice(0,4);
      return `<p>Nếu bạn muốn lên lịch trình quanh <b>${name}</b>, mình gợi ý chia theo nhịp <b>sáng – chiều – tối</b> và ghép thêm các điểm cùng khu vực.</p><ol>${local.map((x,i)=>`<li><b>${i+1}. ${esc(x.name)}</b> — ${esc(x.activities.slice(0,3).join(', '))}</li>`).join('')}</ol>${placeLink(p,'🧭 Mở hồ sơ để xem chi tiết →')}`;
    case 'compare': {
      const other=PLACES.find(x=>x.id!==p.id && (normalize(raw).includes(normalize(x.name))||normalize(raw).includes(normalize(x.area))));
      if(other) return `<p><b>${name}</b> thuộc <b>${esc(p.type)}</b>, nổi bật với ${esc(p.activities.slice(0,3).join(', '))}; còn <b>${esc(other.name)}</b> thuộc <b>${esc(other.type)}</b>, nổi bật với ${esc(other.activities.slice(0,3).join(', '))}.</p><p>Hai nơi khác nhau về địa hình, trải nghiệm và bối cảnh văn hóa. Bạn có thể mở từng hồ sơ để xem ảnh, bản đồ và lịch trình.</p>${placeLink(p,'Mở '+esc(p.name)+' →')} ${placeLink(other,'Mở '+esc(other.name)+' →')}`;
      return `<p>Bạn có thể hỏi “So sánh ${name} và Tà Xùa” hoặc ghi rõ hai địa điểm. Gióng sẽ lấy từng hồ sơ để đối chiếu.</p>`;
    }
    default:
      return `<p><b>${name}</b>: ${esc(p.summary)}</p><p>${esc(p.overview)}</p><div class="chat-facts"><span>📍 ${esc(p.area)}</span><span>🏷️ ${esc(p.type)}</span><span>✨ ${p.activities.slice(0,3).map(x=>esc(x)).join(' · ')}</span></div>${placeLink(p)}`;
  }
}
function chatAnswer(q){
  try{return miniAI(q)}catch(e){return '<p>Mình gặp lỗi nhỏ khi xử lý câu hỏi. Bạn thử hỏi lại theo tên địa điểm + nội dung muốn biết nhé.</p>';}
}

const WEATHER_CODES={0:['☀️','Trời quang'],1:['🌤️','Trời khá quang'],2:['⛅','Mây rải rác'],3:['☁️','Nhiều mây'],45:['🌫️','Sương mù'],48:['🌫️','Sương mù đóng băng'],51:['🌦️','Mưa phùn nhẹ'],53:['🌦️','Mưa phùn'],55:['🌧️','Mưa phùn dày'],61:['🌦️','Mưa nhẹ'],63:['🌧️','Mưa vừa'],65:['🌧️','Mưa to'],71:['🌨️','Tuyết nhẹ'],73:['🌨️','Tuyết'],75:['❄️','Tuyết dày'],80:['🌦️','Mưa rào nhẹ'],81:['🌧️','Mưa rào'],82:['⛈️','Mưa rào mạnh'],95:['⛈️','Dông'],96:['⛈️','Dông, mưa đá'],99:['⛈️','Dông mạnh']};
async function loadWeather(){
  try{
    const url='https://api.open-meteo.com/v1/forecast?latitude=21.3256&longitude=103.9188&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=Asia%2FBangkok';
    const r=await fetch(url); if(!r.ok)throw new Error('weather'); const d=await r.json(); const c=d.current;
    const [icon,text]=WEATHER_CODES[c.weather_code]||['🌤️','Không rõ'];
    $('#weatherIcon').textContent=icon; $('#weatherTemp').textContent=Math.round(c.temperature_2m); $('#weatherText').textContent=text;
    $('#weatherHumidity').textContent=Math.round(c.relative_humidity_2m)+'%'; $('#weatherFeels').textContent=Math.round(c.apparent_temperature)+'°C'; $('#weatherWind').textContent=Math.round(c.wind_speed_10m)+' km/h';
    const t=new Date(c.time); $('#weatherUpdated').textContent='Cập nhật '+t.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});
    const names=['CN','T2','T3','T4','T5','T6','T7'];
    $('#forecast').innerHTML=d.daily.time.map((day,i)=>{const dt=new Date(day+'T12:00:00');const [ic,tx]=WEATHER_CODES[d.daily.weather_code[i]]||['🌤️',''];return `<div class="forecast-day"><b>${i===0?'Hôm nay':names[dt.getDay()]}</b><span>${ic}</span><strong>${Math.round(d.daily.temperature_2m_max[i])}°</strong><small>${Math.round(d.daily.temperature_2m_min[i])}° · ${tx}</small></div>`}).join('');
  }catch(e){$('#weatherText').textContent='Chưa lấy được dữ liệu';$('#weatherUpdated').textContent='Kiểm tra kết nối mạng rồi tải lại trang.'; $('#forecast').innerHTML='<div class="forecast-fallback">Dự báo 5 ngày tạm thời không khả dụng.</div>';}
}

const PHOTO_WALL=[
 {src:'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20S%C6%A1n%20La/anh-dep-son-la-3.jpg',title:'Đồi chè Sơn La',credit:'Sforum · bộ ảnh đẹp Sơn La'},
 {src:'https://phaluongtravel.com/wp-content/uploads/2024/07/thac-dai-yem-moc-chau-6.jpg',title:'Thác Dải Yếm · Mộc Châu',credit:'Pha Luông Travel · ảnh tham khảo'},
 {src:'https://www.asiakingtravel.com/cuploads/files/image-20241030105527-4.jpeg',title:'Cảnh quan Tà Xùa',credit:'Asia King Travel · ảnh tham khảo'},
 {src:'https://mia.vn/media/uploads/blog-du-lich/ngoc-chien-6-1725930932.jpg',title:'Ngọc Chiến',credit:'MIA.vn · ảnh tham khảo'},
 {src:'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20S%C6%A1n%20La/anh-dep-son-la-32.jpg',title:'Ruộng bậc thang Sơn La',credit:'Sforum · bộ ảnh đẹp Sơn La'},
 {src:'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20S%C6%A1n%20La/anh-dep-son-la-22.jpg',title:'Thác nước vùng Sơn La',credit:'Sforum · bộ ảnh đẹp Sơn La'},
 {src:'https://www.asiakingtravel.com/cuploads/files/Son%20La/Moc%20Chau/moc%20chau.jpg',title:'Mộc Châu',credit:'Asia King Travel · ảnh tham khảo'},
 {src:'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20S%C6%A1n%20La/anh-dep-son-la-42.jpg',title:'Sơn La về đêm',credit:'Sforum · bộ ảnh đẹp Sơn La'}
];
function renderPhotoWall(){const box=$('#photoWall');if(!box)return;box.innerHTML=PHOTO_WALL.map((x,i)=>`<button class="photo-tile tile-${i%5}" data-photo="${esc(x.src)}" data-caption="${esc(x.title+' · '+x.credit)}"><img src="${x.src}" alt="${esc(x.title)}" loading="lazy"><span><b>${esc(x.title)}</b><small>${esc(x.credit)}</small></span></button>`).join(''); $$('#photoWall .photo-tile').forEach(b=>b.onclick=()=>openLightbox(b.dataset.photo,b.dataset.caption));}
function openLightbox(src,caption){$('#lightboxImg').src=src;$('#lightboxCaption').textContent=caption;$('#lightbox').hidden=false;document.body.classList.add('no-scroll');}
function closeLightbox(){if(!$('#lightbox'))return;$('#lightbox').hidden=true;document.body.classList.remove('no-scroll');}

function makePlan(){
  const area=$('#planArea').value, days=Number($('#planDays').value); let places=PLACES.filter(p=>p.area===area);
  if(!places.length) places=PLACES.filter(p=>normalize(p.area).includes(normalize(area))||normalize(p.searchText).includes(normalize(area)));
  places=[...places].sort((a,b)=>b.activities.length-a.activities.length).slice(0,Math.max(days*3,3));
  if(!places.length){$('#planResult').innerHTML='<span>🧭</span><p>Chưa có đủ hồ sơ cho khu vực này.</p>';return;}
  const chunks=[]; for(let d=0;d<days;d++){const picks=places.slice(d*3,d*3+3); if(!picks.length)break; chunks.push(`<div class="plan-day"><b>Ngày ${d+1}</b><div>${picks.map((x,i)=>`<a href="place.html?id=${x.id}"><span>${i===0?'🌅':i===1?'🌿':'🌙'}</span><strong>${esc(x.name)}</strong><small>${esc(x.activities.slice(0,2).join(' · '))}</small></a>`).join('')}</div></div>`)}
  $('#planResult').innerHTML=chunks.join('')+`<p class="plan-note">Đây là lịch trình tham khảo dựa trên dữ liệu địa điểm hiện có; thời gian di chuyển, thời tiết và giờ mở cửa cần kiểm tra trước chuyến đi.</p>`;
}

let suggestionIndex=-1;
function moveSuggestions(dir){const items=[...document.querySelectorAll('#searchSuggestions .suggestion-item')]; if(!items.length)return; suggestionIndex=(suggestionIndex+dir+items.length)%items.length; items.forEach((x,i)=>x.classList.toggle('active',i===suggestionIndex)); items[suggestionIndex].scrollIntoView({block:'nearest'});}

function init(){setOptions(); render(); seasonDetail('xuân'); renderEvents(); renderRecent(); loadWeather(); renderPhotoWall();
$('#makePlan').onclick=makePlan;
if($('#lightboxClose'))$('#lightboxClose').onclick=closeLightbox; if($('#lightbox'))$('#lightbox').onclick=e=>{if(e.target.id==='lightbox')closeLightbox()}; document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();});
$('#searchInput').addEventListener('input',e=>{suggestionIndex=-1;$('#searchClear').hidden=!e.target.value; suggestions(e.target.value)}); $('#searchInput').addEventListener('focus',e=>{if(e.target.value)suggestions(e.target.value);else renderRecent()}); $('#searchInput').addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();moveSuggestions(1);return} if(e.key==='ArrowUp'){e.preventDefault();moveSuggestions(-1);return} if(e.key==='Enter'){e.preventDefault();const active=$('#searchSuggestions .suggestion-item.active'); if(active){active.click();return} openSearch(e.target.value);$('#searchSuggestions').hidden=true;$('#recentSearches').hidden=true}}); $('#searchBtn').onclick=()=>{openSearch($('#searchInput').value);$('#searchSuggestions').hidden=true;$('#recentSearches').hidden=true}; $('#searchClear').onclick=()=>{$('#searchInput').value='';$('#searchClear').hidden=true;$('#searchSuggestions').hidden=true;renderRecent();$('#searchInput').focus()}; $('#inlineSearch').oninput=runFilters; ['areaFilter','seasonFilter','activityFilter','typeFilter'].forEach(id=>$('#'+id).onchange=runFilters); $$('.quick-tags button').forEach(b=>b.onclick=()=>openSearch(b.dataset.q)); $('#clearFilters').onclick=()=>{$('#inlineSearch').value='';['areaFilter','seasonFilter','activityFilter','typeFilter'].forEach(id=>$('#'+id).value='all');state={q:'',area:'all',season:'all',activity:'all',type:'all'};render()}; $('#closeSearch').onclick=()=>$('#searchPanel').hidden=true; $$('.season-grid button').forEach(b=>b.onclick=()=>{seasonDetail(b.dataset.seasonCard);$('#seasonFilter').value=b.dataset.seasonCard;runFilters();$('#discover').scrollIntoView({behavior:'smooth'})});
$('#openGiong').onclick=()=>$('#giongModal').hidden=false; $('[data-close]').onclick=()=>$('#giongModal').hidden=true; $('#chatForm').onsubmit=e=>{e.preventDefault();const inp=$('#chatInput');const q=inp.value.trim();if(!q)return;$('#chatMessages').insertAdjacentHTML('beforeend',`<div class="user">${esc(q)}</div><div class="bot thinking">Gióng đang tìm trong dữ liệu Sơn La…</div>`);const thinking=$('#chatMessages .thinking:last-child');inp.value='';setTimeout(()=>{thinking.classList.remove('thinking');thinking.innerHTML=chatAnswer(q);$('#chatMessages').scrollTop=$('#chatMessages').scrollHeight;},220);$('#chatMessages').scrollTop=$('#chatMessages').scrollHeight;}; $$('.chat-suggest button').forEach(b=>b.onclick=()=>{$('#chatInput').value=b.dataset.chat;$('#chatForm').requestSubmit()}); document.addEventListener('click',e=>{if(!e.target.closest('.search-box')&&!e.target.closest('#recentSearches')){$('#searchSuggestions').hidden=true;$('#recentSearches').hidden=true}});}
document.addEventListener('DOMContentLoaded',init);
