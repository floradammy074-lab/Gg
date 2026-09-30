function face(skin,hair,bg,extra){return '<svg viewBox="0 0 44 44" width="100%" height="100%"><rect width="44" height="44" fill="'+bg+'"/><path d="M6 44c2-10 9-13 16-13s14 3 16 13z" fill="#2d3a55"/><circle cx="22" cy="21" r="9" fill="'+skin+'"/><path d="M12.5 20c0-8 5-11 10-11s9 3 9 10c-2-4-5-5-9-5s-7 2-10 6z" fill="'+hair+'"/>'+(extra||'')+'<circle cx="18.5" cy="21" r="1" fill="#222"/><circle cx="25.5" cy="21" r="1" fill="#222"/><path d="M19 25.5q3 2 6 0" stroke="#7a3b2a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>'}
const glasses='<g fill="none" stroke="#222" stroke-width="1"><circle cx="18.5" cy="21" r="2.6"/><circle cx="25.5" cy="21" r="2.6"/></g>';
const beard='<path d="M14 24q8 12 16 0q-2 8-8 8t-8-8z" fill="#3a2418"/>';
document.getElementById('me').innerHTML=face('#e9b98a','#2b1a10','#f4d35e',glasses);

document.addEventListener('gesturestart',function(e){e.preventDefault()});

(function(){
var $=function(i){return document.getElementById(i)},R=document.documentElement,bal=56989.30,timers=[];
var RATE=1500; /* NGN per 1 USD - edit this to update the exchange rate */
var CUR={USD:{sym:'$',rate:1},NGN:{sym:'\u20A6',rate:RATE}};
var ACC={purple:'#1c12c8',red:'#b3121c',green:'#0b7a3b',blue:'#0a86c9',grey:'#2b2f36'};
var st={accent:'purple',theme:'light',cur:'USD'};
try{for(var k in st){var sv=localStorage.getItem('bk_'+k);if(sv)st[k]=sv}}catch(e){}
if(!ACC[st.accent])st.accent='purple';if(!CUR[st.cur])st.cur='USD';if(st.theme!=='dark')st.theme='light';
function save(){try{for(var k in st)localStorage.setItem('bk_'+k,st[k])}catch(e){}}
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function stamp(d){return d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear()+', '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}).replace(/\u202f/g,' ')}
function fmt(usd){var c=CUR[st.cur];return c.sym+(usd*c.rate).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}

/* Transaction PIN. Default is 1472; changing it in Settings saves the new one on this device.
   (Prototype only: a real app must verify the PIN on the server, never in the browser.) */
var PIN='1472';
try{var spin=localStorage.getItem('bk_pin');if(/^\d{4}$/.test(spin||''))PIN=spin}catch(e){}

/* ---------- Keyboard / viewport handling ----------
   --vt / --kb describe the part of the screen the keyboard is NOT covering,
   so popups and the transfer form can sit above it instead of underneath. */
var vv=window.visualViewport;
function kbh(){return vv?Math.max(0,Math.round(window.innerHeight-vv.height-vv.offsetTop)):0}
function fit(){
 var t=vv?Math.max(0,Math.round(vv.offsetTop)):0;
 R.style.setProperty('--vt',t+'px');R.style.setProperty('--kb',kbh()+'px');
}
if(vv){vv.addEventListener('resize',fit);vv.addEventListener('scroll',fit)}
window.addEventListener('resize',fit);
function blurAll(){var a=document.activeElement;if(a&&a!==document.body&&typeof a.blur==='function')a.blur()}
/* after a field loses focus, make sure iOS hasn't left the page scrolled/offset */
document.addEventListener('focusout',function(){setTimeout(function(){var a=document.activeElement;if(!a||a===document.body||a===R)window.scrollTo(0,0);fit()},120)});
document.addEventListener('focusin',function(){[60,250,500].forEach(function(ms){setTimeout(fit,ms)})});
/* Tapping anywhere on a field card focuses it. If a field is "focused" but the keyboard never appeared
   (the hang), tapping it again drops focus and re-focuses inside the tap, which brings the keyboard back. */
function revive(i,e){
 if(e.pointerType!=='touch')return;
 if(document.activeElement===i&&kbh()<80){i.blur();i.focus({preventScroll:true})}
 else if(e.target!==i&&document.activeElement!==i){i.focus({preventScroll:true})}
}
document.querySelectorAll('.fld').forEach(function(f){var i=f.querySelector('input');if(i)f.addEventListener('pointerup',function(e){revive(i,e)})});

/* Screens: always drop focus before hiding one, and keep hidden ones un-focusable (inert) */
function openScr(el){el.removeAttribute('inert');el.classList.add('open')}
function closeScr(el){blurAll();el.classList.remove('open');el.setAttribute('inert','')}

var ts=$('tscr'),ps=$('pscr'),ss=$('sscr'),amt=$('amt'),bank=$('bank'),acn=$('acn'),nm=$('acname'),send=$('send'),err=$('terr');
function val(){var a=parseFloat(amt.value)||0,u=a/CUR[st.cur].rate,over=u>bal+1e-9,
 ok=a>0&&bank.value&&/^\d{10}$/.test(acn.value)&&nm.value.trim().length>1;
 err.textContent=over?'Insufficient balance for this transfer':'';send.disabled=!(ok&&!over)}
function setBal(){
 document.querySelector('.bal').textContent=fmt(bal);$('avail').textContent=fmt(bal);
 document.querySelectorAll('[data-usd]').forEach(function(e){e.textContent=(e.dataset.sign||'')+fmt(parseFloat(e.dataset.usd))});
 $('csym').textContent=CUR[st.cur].sym;
 $('rnote').textContent=st.cur==='NGN'?'Amounts are converted at '+CUR.NGN.sym+RATE.toLocaleString('en-US')+' = $1.':'';
}
function mark(sel,attr,v){document.querySelectorAll(sel).forEach(function(b){var on=b.getAttribute(attr)===v;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)})}
function apply(){
 R.setAttribute('data-accent',st.accent);R.setAttribute('data-theme',st.theme);
 document.querySelector('meta[name=theme-color]').content=st.theme==='dark'?'#000000':ACC[st.accent];
 mark('[data-a]','data-a',st.accent);mark('[data-t]','data-t',st.theme);mark('[data-c]','data-c',st.cur);setBal();
}
document.querySelectorAll('[data-a]').forEach(function(b){b.addEventListener('click',function(){st.accent=b.dataset.a;save();apply()})});
document.querySelectorAll('[data-t]').forEach(function(b){b.addEventListener('click',function(){st.theme=b.dataset.t;save();apply()})});
document.querySelectorAll('[data-c]').forEach(function(b){b.addEventListener('click',function(){st.cur=b.dataset.c;amt.value='';save();apply();val()})});

/* Bottom nav */
var nav=document.querySelector('nav'),blob=nav.querySelector('.blob'),items=nav.querySelectorAll('div:not(.fab):not(.sp)');
function place(t){blob.style.width=t.offsetWidth+'px';blob.style.transform='translateX('+t.offsetLeft+'px)'}
items.forEach(function(t){t.addEventListener('click',function(){nav.querySelectorAll('div.active').forEach(function(a){a.classList.remove('active')});void t.offsetWidth;t.classList.add('active');place(t);if(t.id==='nset')openScr(ss)})});
$('sback').addEventListener('click',function(){closeScr(ss);items[0].click()});
function sync(){place(nav.querySelector('div.active'))}
sync();window.addEventListener('resize',sync);

/* ---------- PIN popup ---------- */
var pov=$('pinov'),pinp=$('pininp'),pbox=$('pinboxes'),pdots=pbox.querySelectorAll('i'),ptitle=$('pintitle'),psub=$('pinsub'),perr=$('pinerr'),pinfo=$('pininfo'),pcur=null,pbusy=false,ttm=null;
function pdraw(){var n=pinp.value.length;pdots.forEach(function(d,i){d.classList.toggle('f',i<n);d.classList.toggle('a',i===Math.min(n,3))})}
function pclear(){pinp.value='';pbox.classList.remove('bad','ok');pdraw()}
function toast(m){var t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(ttm);ttm=setTimeout(function(){t.classList.remove('show')},2400)}
/* open: focus happens synchronously inside the tap, so the number keypad opens straight away */
function popen(cfg){
 pcur=cfg;pbusy=false;ptitle.textContent=cfg.title;psub.textContent=cfg.sub||'';perr.textContent='';pclear();
 pov.setAttribute('aria-hidden','false');pov.classList.add('open');
 pinp.focus({preventScroll:true});
 fit();[80,250,500,800].forEach(function(ms){setTimeout(fit,ms)});
}
/* move to another step (e.g. new PIN -> confirm) without closing the popup or the keypad */
function pstep(cfg){
 pcur=cfg;pbusy=true;pinfo.classList.add('sw');
 setTimeout(function(){ptitle.textContent=cfg.title;psub.textContent=cfg.sub||'';pclear();pinfo.classList.remove('sw');pbusy=false},220);
}
function pwrong(msg,after){
 pbusy=true;perr.textContent=msg;
 pbox.classList.remove('shake');void pbox.offsetWidth;pbox.classList.add('bad','shake');
 if(navigator.vibrate){try{navigator.vibrate([40,40,40])}catch(e){}}
 setTimeout(function(){pclear();pbox.classList.remove('shake');pbusy=false;if(after)after()},550);
}
function pclose(){
 pov.classList.remove('open');pov.setAttribute('aria-hidden','true');pinp.blur();pbusy=false;pcur=null;
 setTimeout(function(){if(!pov.classList.contains('open')){pclear();perr.textContent=''}},450);
}
/* success: keypad goes away immediately, popup closes a beat later, then the callback runs */
function pfinish(cb){
 pbusy=true;pbox.classList.add('ok');pinp.blur();
 setTimeout(function(){pclose();if(cb)cb()},260);
}
function pcancel(){if(pbox.classList.contains('ok'))return;pclose()}
pinp.addEventListener('input',function(){
 if(pbusy){pinp.value='';return}
 var v=pinp.value.replace(/\D/g,'').slice(0,4);pinp.value=v;
 perr.textContent='';pbox.classList.remove('bad');pdraw();
 if(v.length===4&&pcur)pcur.submit(v);
});
$('pinx').addEventListener('click',pcancel);
$('pinbd').addEventListener('click',pcancel);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&pov.classList.contains('open'))pcancel()});
$('pincard').addEventListener('pointerup',function(e){
 if(e.target.closest&&e.target.closest('.pinx'))return;
 if(pbox.classList.contains('ok'))return;
 revive(pinp,e);
 if(e.pointerType==='touch'&&document.activeElement!==pinp)pinp.focus({preventScroll:true});
});

/* Change PIN (Settings): current -> new -> confirm */
function changePin(){
 function newStep(){pstep({title:'New PIN',sub:'Choose a new 4-digit PIN',submit:function(n){
  if(n===PIN)pwrong('New PIN must be different from your current PIN');else confirmStep(n);
 }})}
 function confirmStep(n){pstep({title:'Confirm new PIN',sub:'Enter the new PIN once more',submit:function(c){
  if(c===n){PIN=n;try{localStorage.setItem('bk_pin',PIN)}catch(e){}pfinish(function(){toast('PIN updated')})}
  else pwrong('PINs did not match. Start again.',newStep);
 }})}
 popen({title:'Current PIN',sub:'Enter your current PIN to continue',submit:function(c){
  if(c===PIN)newStep();else pwrong('Incorrect PIN. Try again.');
 }});
}
$('chpin').addEventListener('click',changePin);

/* ---------- Notifications ----------
   Real phone notifications use a service worker (sw.js) + the Notification API.
   They need https:// (or localhost), and on iPhone the app must be added to the Home Screen first.
   If a system notification isn't possible, the in-app banner is used as a fallback. */
var nel=$('notif'),ntm2=null,secure=(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1');
function hideNotif(){clearTimeout(ntm2);nel.classList.remove('show')}
function banner(body){
 $('nbody').textContent=body;nel.classList.add('show');
 clearTimeout(ntm2);ntm2=setTimeout(hideNotif,9000);
 if(navigator.vibrate){try{navigator.vibrate(60)}catch(e){}}
}
nel.addEventListener('click',hideNotif);
if('serviceWorker' in navigator&&secure){try{navigator.serviceWorker.register('sw.js').catch(function(){})}catch(e){}}
function canNotify(){return 'Notification' in window}
function notiSt(){
 var s=$('notst'),n=$('notnote');
 if(!canNotify()){s.textContent='Unavailable';n.textContent='This browser does not support phone notifications. On iPhone, add the app to your Home Screen first.';return}
 var p=Notification.permission;
 s.textContent=p==='granted'?'On':p==='denied'?'Blocked':'Off';
 n.textContent=p==='denied'?'Notifications are blocked. Turn them on for this app in your phone settings.':(secure?'':'Phone notifications need the app to be opened over https (or localhost).');
}
function askNotif(){
 if(!canNotify()||Notification.permission!=='default')return Promise.resolve();
 return new Promise(function(res){try{var p=Notification.requestPermission(res);if(p&&p.then)p.then(res)}catch(e){res()}}).then(notiSt);
}
function pushNotif(title,body,tag){
 if(!canNotify()||Notification.permission!=='granted')return Promise.reject();
 var o={body:body,icon:'icon-192.png',badge:'icon-192.png',tag:tag,vibrate:[80,40,80],timestamp:Date.now()};
 var g=('serviceWorker' in navigator)?navigator.serviceWorker.getRegistration():Promise.resolve();
 return g.then(function(r){if(r&&r.active)return r.showNotification(title,o);var n=new Notification(title,o);return n});
}
function notify(body,ref){pushNotif('Transaction Successful',body,'txn-'+ref).catch(function(){banner(body)})}
$('notbtn').addEventListener('click',function(){
 askNotif().then(function(){
  notiSt();
  if(!canNotify())return;
  if(Notification.permission==='granted')pushNotif('Notifications are on','You will get an alert for every transfer.','test').catch(function(){toast('Notifications are on')});
  else toast('Notifications are blocked in your phone settings');
 });
});
notiSt();

/* ---------- Transfer flow ---------- */
amt.addEventListener('input',function(){amt.value=amt.value.replace(/[^\d.]/g,'').replace(/(\..*)\./g,'$1').replace(/(\.\d\d).+/,'$1');val()});
acn.addEventListener('input',function(){acn.value=acn.value.replace(/\D/g,'');val()});
[bank,nm].forEach(function(e){e.addEventListener('input',val)});
$('tbtn').addEventListener('click',function(){askNotif();setBal();openScr(ts)});
$('tback').addEventListener('click',function(){closeScr(ts)});

var CONF=['#1fb54a','#f5c542','#ff6b6b','#4a8cff','#b26bff','#ff9f43','#111'];
function confetti(){
 var c=$('conf');c.innerHTML='';
 for(var i=0;i<34;i++){
  var p=document.createElement('i'),ang=Math.random()*Math.PI*2,d=70+Math.random()*90;
  p.className='cf'+(i%4===0?' r':'');
  p.style.cssText='--x:'+Math.round(Math.cos(ang)*d)+'px;--y:'+Math.round(Math.sin(ang)*d-40)+'px;--r:'+Math.round(Math.random()*720-360)+'deg;--d:'+(0.55+Math.random()*.25).toFixed(2)+'s;--c:'+CONF[i%CONF.length];
  c.appendChild(p);
 }
}
function startTransfer(){
 var a=parseFloat(amt.value),u=a/CUR[st.cur].rate,b=bank.value,name=nm.value.trim(),ac=acn.value;
 $('pamt').textContent=$('damt').textContent=fmt(u);
 ps.classList.remove('fin');void ps.offsetWidth;openScr(ps);ps.classList.add('run');
 timers.push(setTimeout(function(){
  bal-=u;setBal();
  confetti();
  /* receipt details shown under the amount */
  var d=new Date(),rf='',when=stamp(d);
  for(var q=0;q<9;q++)rf+=Math.floor(Math.random()*10);
  $('rname').textContent=name;$('racn').textContent=ac;$('rbank').textContent=b;
  $('rdate').textContent=when;
  $('rref').textContent='TXN'+rf;
  ps.classList.remove('run');ps.classList.add('fin');
  timers.push(setTimeout(function(){
   notify(fmt(u)+' '+st.cur+' has been successfully transferred from your account to '+name+'.\n'+
    'Reference: TXN'+rf+'\n'+
    'Date: '+when+'\n'+
    'Available Balance: '+fmt(bal)+' '+st.cur+'\n'+
    'Thank you for banking with us','TXN'+rf)},1400));
  var t=document.createElement('div');t.className='tx new';
  t.innerHTML='<div class="logo" style="background:var(--acsoft)"><svg width="20" height="20" viewBox="0 0 24 24" fill="#2b34e6" style="fill:var(--ac)"><path d="M20.5 3.5L4.6 9.6l5.8 3.9z"/><path d="M20.5 3.5l-6.2 15.8-3.9-5.8z" opacity=".6"/></svg></div><div class="m"><b></b><span>Transfer to '+b+'</span></div><div class="r"><b class="rd" data-usd="'+u+'" data-sign="-">-'+fmt(u)+'</b><span>Just now</span></div>';
  t.querySelector('.m b').textContent=name;
  document.querySelector('.sheet .day').after(t);
 },10000));
}
/* "Send money" now asks for the PIN first; the transfer starts only after the correct PIN */
send.addEventListener('click',function(){
 var u=(parseFloat(amt.value)||0)/CUR[st.cur].rate;
 popen({title:'Enter your PIN',sub:'Confirm sending '+fmt(u)+' to '+nm.value.trim(),submit:function(c){
  if(c===PIN)pfinish(startTransfer);else pwrong('Incorrect PIN. Try again.');
 }});
});
$('dbtn').addEventListener('click',function(){
 closeScr(ps);closeScr(ts);
 setTimeout(function(){ps.classList.remove('fin');amt.value=acn.value=nm.value='';bank.selectedIndex=0;val()},650);
});
apply();fit();
})();
