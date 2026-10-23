(function(){
var r=document.documentElement,K='mq-theme';
var t=localStorage.getItem(K)||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');r.dataset.theme=t;
window.addEventListener('DOMContentLoaded',function(){
var tb=document.getElementById('theme');function ic(){tb.textContent=r.dataset.theme==='dark'?'☀️':'🌙'}ic();
tb.onclick=function(){r.dataset.theme=r.dataset.theme==='dark'?'light':'dark';localStorage.setItem(K,r.dataset.theme);ic()};
var m=document.getElementById('menu');m.onclick=function(){document.querySelector('.top nav').classList.toggle('open')};
document.querySelectorAll('.art table').forEach(function(x){var w=document.createElement('div');w.className='tblw';x.parentNode.insertBefore(w,x);w.appendChild(x)});
document.querySelectorAll('[data-id]').forEach(function(c){var n=+c.dataset.n,d=0;for(var i=0;i<n;i++)if(localStorage.getItem('mq:'+c.dataset.id+':'+i)==='ok')d++;
var b=c.querySelector('.bar i');if(b)b.style.width=(n?d/n*100:0)+'%';var s=c.querySelector('.pc');if(s)s.textContent=d+'/'+n+' correct'});
var q=document.getElementById('qa');if(q)quiz(q);
var tm=document.getElementById('timer');if(tm)timer(tm);
});

function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}
function plain(h){var d=document.createElement('div');d.innerHTML=h;return d.textContent}
function nm(t){return t.toLowerCase().replace(/[−–—]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/tk\.?|taka|km\/?h(r|our)?|kmph|m\/s|hours?|hrs?|minutes?|mins?|days?|years?|yrs?|litres?|liters?|kg|cm|sq|units?|degrees?|metres?|meters?|[%°$,\s]/g,'')}
function num(t){t=nm(t);var m=t.match(/^(-?\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/);return m?(m[2]?m[1]/m[2]:+m[1]):NaN}
function cmpAns(u,h){var g=plain(h).trim(),L=g.match(/^\(?([A-E])\)?(?![a-z])/),ul=u.trim().match(/^\(?([a-eA-E])\)?$/);
if(L&&ul)return L[1].toLowerCase()===ul[1].toLowerCase();
var ps=g.split(/=|→|⇒/),fin=ps[ps.length-1].replace(/\.$/,'').trim(),uu=u.split('=').pop(),un=nm(uu),x=num(uu);
if(un&&nm(fin)===un)return true;
var toks=(fin.replace(/[−–]/g,'-').match(/-?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?/g)||[]);
if(!isNaN(x))for(var j=0;j<toks.length;j++){var y=num(toks[j]);if(!isNaN(y)&&Math.abs(x-y)<=1e-6*Math.max(1,Math.abs(y)))return true}
if(!isNaN(x)&&toks.length===0&&nm(g).indexOf(un)>-1)return true;return false}
function quiz(box){
var id=box.dataset.id,A=JSON.parse(document.getElementById('adata').textContent),L=[].slice.call(box.querySelectorAll('ol.qs>li, .qs>ol>li'));
if(!L.length)L=[].slice.call(box.querySelectorAll('ol>li'));
L.forEach(function(li,i){
var m=li.innerHTML.match(/\((IBA|GRE|BCS|Bank)\)\s*(<\/p>)?\s*$/);if(m){li.dataset.ex=m[1];li.innerHTML=li.innerHTML.replace(m[0],(m[2]||''));li.insertAdjacentHTML('afterbegin','<span class="tag">'+m[1]+'</span>')}
var a=document.createElement('div');a.className='ans';a.innerHTML=A[i]||'—';
var row=document.createElement('div');row.className='arow';row.innerHTML='<input class="ai" type="text" inputmode="text" placeholder="Type your answer…" aria-label="Your answer"><button data-a="chk">Check</button>';
var cmp=document.createElement('div');cmp.className='cmp';
var qa=document.createElement('div');qa.className='qa';qa.innerHTML='<button data-a="show">Show answer</button><button data-a="ok">✔ Got it</button><button data-a="bad">✘ Missed</button>';
li.appendChild(row);li.appendChild(cmp);li.appendChild(a);li.appendChild(qa);
var inp=row.querySelector('input');
var k='mq:'+id+':'+i,v=localStorage.getItem(k);if(v){li.classList.add(v)}
function mark(x){li.classList.remove('ok','bad');li.classList.add(x);localStorage.setItem(k,x);sum()}
function doCheck(){var u=inp.value.trim();if(!u){inp.focus();return}var r=cmpAns(u,A[i]||'');a.classList.add('show');cmp.className='cmp show '+(r?'good':'diff');
cmp.innerHTML='<b>Your answer:</b> '+esc(u)+'<br>'+(r?'✅ Matches the given answer. Nice!':'⚠️ Doesn’t match the final value in the given answer. Compare with the working below, then mark yourself.');if(r)mark('ok')}
row.onclick=function(e){if(e.target.dataset.a==='chk')doCheck()};inp.onkeydown=function(e){if(e.key==='Enter')doCheck()};
qa.onclick=function(e){var a2=e.target.dataset.a;if(!a2)return;if(a2==='show'){a.classList.toggle('show');return}
a.classList.add('show');mark(a2)}});
var tools=document.getElementById('tools');
function sum(){var ok=0,bad=0;L.forEach(function(li){if(li.classList.contains('ok'))ok++;if(li.classList.contains('bad'))bad++});
document.getElementById('sum').textContent='✔ '+ok+'  ✘ '+bad+'  / '+L.length+(ok+bad?'  ('+Math.round(ok/(ok+bad)*100)+'% accuracy)':'')}
sum();
var ex={};L.forEach(function(li){if(li.dataset.ex)ex[li.dataset.ex]=1});
var fs=['All'].concat(Object.keys(ex)).concat(['Missed','Unanswered']),h='';fs.forEach(function(f,i){h+='<button class="tb'+(i?'':' on')+'" data-f="'+f+'">'+f+'</button>'});
document.getElementById('filters').innerHTML=h;
document.getElementById('filters').onclick=function(e){var f=e.target.dataset.f;if(!f)return;
this.querySelectorAll('.tb').forEach(function(b){b.classList.toggle('on',b===e.target)});
L.forEach(function(li){var s=f==='All'||li.dataset.ex===f||(f==='Missed'&&li.classList.contains('bad'))||(f==='Unanswered'&&!li.classList.contains('ok')&&!li.classList.contains('bad'));li.style.display=s?'':'none'})};
document.getElementById('reset').onclick=function(){if(!confirm('Reset your progress for this set?'))return;L.forEach(function(li,i){localStorage.removeItem('mq:'+id+':'+i);li.classList.remove('ok','bad')});sum()};
document.getElementById('showall').onclick=function(){L.forEach(function(li){li.querySelector('.ans').classList.toggle('show')})};
}
function timer(el){var s=0,iv=null,b=document.getElementById('tstart');function f(){var m=Math.floor(s/60),x=s%60;el.textContent=(m<10?'0':'')+m+':'+(x<10?'0':'')+x}
b.onclick=function(){if(iv){clearInterval(iv);iv=null;b.textContent='▶ Start'}else{iv=setInterval(function(){s++;f()},1000);b.textContent='⏸ Pause'}};
document.getElementById('treset').onclick=function(){s=0;f();if(iv){clearInterval(iv);iv=null;b.textContent='▶ Start'}};f()}
})();
