(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e({label:e,action:t=``,variant:n=`primary`,size:r=`md`,disabled:i=!1,attrs:a={}}){let o=t?`data-action="${t}"`:``,s=Object.entries(a).filter(([,e])=>e!=null&&e!==!1).map(([e,t])=>`${e}="${String(t)}"`).join(` `);return`
    <button class="btn btn--${n} btn--${r}" ${o} ${i?`disabled`:``} ${s}>
      ${e}
    </button>
  `}function t(t){return t?`
    <div class="modal-overlay">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <p class="card__kicker">Please confirm</p>
        <h3 class="card__title" id="confirm-dialog-title">${t.title}</h3>
        <div class="card__body">
          <p class="muted">${t.message}</p>
          <div class="action-row">
            ${e({label:t.cancelLabel||`Cancel`,action:`cancel-dialog`,variant:`ghost`})}
            ${e({label:t.confirmLabel||`Confirm`,action:`confirm-dialog`,variant:`danger`})}
          </div>
        </div>
      </section>
    </div>
  `:``}function n(e){return`
    <span class="status-pill status-pill--${e.status}">
      <span class="status-pill__dot"></span>
      <span>${e.status}</span>
    </span>
  `}function r(e){return e.length?`
    <div class="toast-stack">
      ${e.map(e=>`
            <div class="toast toast--${e.tone}">
              <span>${e.message}</span>
              <button class="toast__close" data-action="dismiss-toast" data-id="${e.id}">x</button>
            </div>
          `).join(``)}
    </div>
  `:``}function i({route:e,content:i,connection:a,ui:o}){let s=e!==`match`;return`
    <div class="app-shell app-shell--${e}">
      <div class="app-shell__backdrop"></div>
      <header class="topbar">
        <div>
          <a class="brand" href="#/home" data-action="navigate" data-route="home">
            <span class="brand__mark">MH</span>
            <span>
              <strong>MH Handrex</strong>
              <small>Crafted by MH Horizon</small>
            </span>
          </a>
        </div>
        <div class="topbar__meta">
          ${n(a)}
          <p class="topbar__note">${o.connectionBanner||a.note||`Ready`}</p>
        </div>
      </header>
      <main class="page-shell page-shell--${e}">
        ${i}
      </main>
      ${s?`
            <nav class="dock-nav">
              <button class="dock-nav__item ${e===`home`?`is-active`:``}" data-action="navigate" data-route="home">Home</button>
              <button class="dock-nav__item ${e===`history`?`is-active`:``}" data-action="navigate" data-route="history">History</button>
              <button class="dock-nav__item ${e===`rules`?`is-active`:``}" data-action="navigate" data-route="rules">Rules</button>
            </nav>
          `:``}
      ${r(o.toasts)}
      ${t(o.confirmDialog??null)}
    </div>
  `}function a(e){return structuredClone(e)}function o(e){let t=[...e];for(let e=t.length-1;e>0;--e){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}function s(e,t){return Math.floor(Math.random()*(t-e+1))+e}function c(e){return e[Math.floor(Math.random()*e.length)]}var l=Object.freeze([1,2,3,4,5,6]),u=1,d=99,f=2,p=16,m=Object.freeze([Object.freeze({id:`classic`,label:`Classic 1-6`,allowedNumbers:l}),Object.freeze({id:`power`,label:`Power Mode`,allowedNumbers:Object.freeze([1,2,3,4,5,6,8,10])}),Object.freeze({id:`chaos`,label:`Chaos Mode`,allowedNumbers:Object.freeze([1,3,5,7,9,11])}),Object.freeze({id:`risk`,label:`Risk Mode`,allowedNumbers:Object.freeze([1,2,4,6,10,20])}),Object.freeze({id:`low-score`,label:`Low Score Mode`,allowedNumbers:Object.freeze([1,2,3,4])})]),h=new Map(m.map(e=>[e.id,e]));function g(e){if(typeof e==`number`)return Number.isInteger(e)?e:null;if(typeof e!=`string`||!e.trim()||!/^\d+$/.test(e.trim()))return null;let t=Number(e);return Number.isInteger(t)?t:null}function _(e){return Array.isArray(e)?e:typeof e==`string`?e.split(/[\s,|]+/).map(e=>e.trim()).filter(Boolean):[]}function v(e){return e.join(`, `)}function y(){return{numberSetMode:`classic`,numberSetPreset:`classic`,numberSetLabel:`Classic 1-6`,allowedNumbers:[...l],numberRangeMin:1,numberRangeMax:6,customNumbersText:v(l)}}function ee(){return m.map(e=>({id:e.id,label:e.label,allowedNumbers:[...e.allowedNumbers]}))}function te(e){return Array.from(new Set(_(e).map(g).filter(e=>e!=null&&e>=u&&e<=d))).sort((e,t)=>e-t)}function ne(e){let t=_(e),n=t.map(g),r=te(e);return t.length?n.some(e=>e==null||e<u)?{ok:!1,error:`Numbers must be positive whole numbers.`,allowedNumbers:r}:n.some(e=>e!=null&&e>d)?{ok:!1,error:`Numbers must be ${d} or lower.`,allowedNumbers:r}:new Set(n).size===n.length?r.length<f?{ok:!1,error:`Choose at least 2 numbers.`,allowedNumbers:r}:r.length>p?{ok:!1,error:`Choose ${p} numbers or fewer.`,allowedNumbers:r}:{ok:!0,allowedNumbers:r}:{ok:!1,error:`Duplicate numbers are not allowed.`,allowedNumbers:r}:{ok:!1,error:`Choose at least 2 numbers.`,allowedNumbers:r}}function b(e,t){let n=g(e),r=g(t);if(n==null||r==null)return{ok:!1,error:`Range values must be positive whole numbers.`,allowedNumbers:[],min:n,max:r};if(n<u||r<u)return{ok:!1,error:`Range values must be 1 or higher.`,allowedNumbers:[],min:n,max:r};if(r>d||n>d)return{ok:!1,error:`Range values must be ${d} or lower.`,allowedNumbers:[],min:n,max:r};if(n>r)return{ok:!1,error:`Range minimum must be lower than or equal to the maximum.`,allowedNumbers:[],min:n,max:r};let i=Array.from({length:r-n+1},(e,t)=>n+t);return i.length<f?{ok:!1,error:`Range must include at least 2 numbers.`,allowedNumbers:i,min:n,max:r}:i.length>p?{ok:!1,error:`Range includes ${i.length} numbers. Choose ${p} numbers or fewer.`,allowedNumbers:i,min:n,max:r}:{ok:!0,allowedNumbers:i,min:n,max:r}}function x(e){return e===`range`||e===`custom`||e===`preset`?e:`classic`}function S(e={},t={}){let n=e&&typeof e==`object`?e:{},r=t&&typeof t==`object`?t:{},i=y(),a=x(n.numberSetMode??r.numberSetMode);if(a===`classic`)return{ok:!0,settings:i};if(a===`preset`){let e=String(n.numberSetPreset??n.presetId??r.numberSetPreset??`classic`),t=h.get(e);return t?{ok:!0,settings:{numberSetMode:`preset`,numberSetPreset:t.id,numberSetLabel:t.label,allowedNumbers:[...t.allowedNumbers],numberRangeMin:t.allowedNumbers[0],numberRangeMax:t.allowedNumbers[t.allowedNumbers.length-1],customNumbersText:v(t.allowedNumbers)}}:{ok:!1,error:`Choose a valid number set preset.`,settings:i}}if(a===`range`){let e=r.numberRangeMin??r.allowedNumbers?.[0]??i.numberRangeMin,t=r.numberRangeMax??r.allowedNumbers?.[r.allowedNumbers.length-1]??i.numberRangeMax,a=b(n.numberRangeMin??n.rangeMin??e,n.numberRangeMax??n.rangeMax??t);return a.ok?{ok:!0,settings:{numberSetMode:`range`,numberSetPreset:`classic`,numberSetLabel:`Range ${a.min}-${a.max}`,allowedNumbers:a.allowedNumbers,numberRangeMin:a.min,numberRangeMax:a.max,customNumbersText:v(a.allowedNumbers)}}:{ok:!1,error:a.error,settings:i}}let o=ne(n.customNumbersText??n.customNumbers??n.allowedNumbers??r.customNumbersText??r.allowedNumbers??i.allowedNumbers);return o.ok?{ok:!0,settings:{numberSetMode:`custom`,numberSetPreset:`classic`,numberSetLabel:`Custom: ${v(o.allowedNumbers)}`,allowedNumbers:o.allowedNumbers,numberRangeMin:o.allowedNumbers[0],numberRangeMax:o.allowedNumbers[o.allowedNumbers.length-1],customNumbersText:v(o.allowedNumbers)}}:{ok:!1,error:o.error,settings:i}}function C(e,t){return Number.isInteger(e)&&Array.isArray(t)&&t.includes(e)}function w(e){let t=te(e);return t.length>=f?t:y().allowedNumbers}function T(e){return e.length===l.length&&e.every((e,t)=>e===l[t])}function re(e,t){let n=w(t);if(T(n))return new Map([[1,`Quick Single`],[2,`Smart Double`],[3,`Gap Run`],[4,`Boundary`],[5,`Risky Loft`],[6,`Huge Six`]]).get(e)??`Attacking Shot`;let r=n.indexOf(e);if(r===-1)return`Attacking Shot`;if(r===n.length-1)return`Mega Hit`;let i=n.length===1?1:r/(n.length-1);return i<=.05?`Controlled Shot`:i<.38?`Smart Run`:i<.75?`Attacking Shot`:`Power Hit`}function E({battingNumber:e,bowlingNumber:t,runs:n,isWicket:r,allowedNumbers:i}){let a=w(i),o=re(e,a);if(r)return{shotLabel:`Wicket`,resultLabel:`Wicket! Perfect match.`,resultTone:`wicket`,commentary:`Batter chose ${e}, bowler chose ${t} - Wicket! Perfect match.`};let s=a[a.length-1],c=!T(a)&&e===s?`mega`:o===`Boundary`||o===`Huge Six`?`boundary`:o===`Power Hit`?`power`:n===0?`dot`:`run`;return{shotLabel:o,resultLabel:`${o}! +${n}`,resultTone:c,commentary:`Batter chose ${e}, bowler chose ${t} - ${o}! +${n}`}}function D(e){let t=Array.isArray(e)&&e.length?e:y().allowedNumbers;return[...new Set(t.filter(e=>Number.isInteger(e)))].sort((e,t)=>e-t)}function O(e){return Array.isArray(e)?e.filter(e=>Number.isInteger(e?.battingNumber)&&Number.isInteger(e?.bowlingNumber)&&typeof e?.resultType==`string`):[]}function k(e,t,n=5){let r=t===`bowling`?`bowlingNumber`:`battingNumber`;return O(e).slice(-n).map(e=>Number(e[r])).filter(e=>Number.isInteger(e))}function ie(e){let t=new Map;return e.forEach(e=>{t.set(e,(t.get(e)??0)+1)}),t}function ae(e){let t=null;return ie(e).forEach((e,n)=>{(!t||e>t.count||e===t.count&&n>t.number)&&(t={number:n,count:e})}),t}function oe(e){let t=e[e.length-1]??null;if(t==null)return{number:null,count:0};let n=0;for(let r=e.length-1;r>=0&&e[r]===t;--r)n+=1;return{number:t,count:n}}function A(e,t){let n=D(t),r=n.indexOf(e);if(r<0)return`mid`;if(r===n.length-1)return`highest`;let i=n.length===1?1:r/(n.length-1);return i<=.28?`low`:i>=.7?`high`:`mid`}function j(e,t){let n=A(e,t);return n===`high`||n===`highest`}function se(e,t){return A(e,t)===`low`}function ce(e,t){let n=O(e),r=n.slice(-5),i=k(n,`batting`,5),a=k(n,`bowling`,5),o=n.map(e=>e.battingNumber),s=n.map(e=>e.bowlingNumber),c=r.filter(e=>e.resultType===`wicket`),l=r.filter(e=>e.resultType!==`wicket`&&j(e.battingNumber,t));return{batterPicks:i,bowlerPicks:a,mostUsedBatter:ae(o),mostUsedBowler:ae(s),batterRepeat:oe(i),bowlerRepeat:oe(a),recentWicketNumbers:c.map(e=>e.battingNumber),recentBigHits:l,recentWickets:c}}function le(e){return e?.innings?.[e.currentInningsIndex]??null}function ue(e,t,n){let r=le(e),i=D(n),a=i[i.length-1]??6,o=O(t).slice(-4),s=o.filter(e=>e.resultType===`wicket`).length,c=o.filter(e=>e.resultType!==`wicket`&&j(e.battingNumber,i)).length;if(!r)return{label:`Calm Start`,tone:`calm`,detail:`No pressure pattern yet.`};let l=e?.teams?.[r.battingTeamId]??null,u=Math.max((l?.playerIds.length??1)-r.scoreboard.wickets,0),d=r.scoreboard.requiredRuns??null,f=r.scoreboard.ballsLeft??0,p=r.scoreboard.target!=null,m=p&&f>0&&d!=null?d/f:0;return s>=2?{label:`Collapse Warning`,tone:`danger`,detail:`Wickets are falling quickly.`}:u===1?{label:`Last Wicket Tension`,tone:`danger`,detail:`One mistake can end the innings.`}:p&&f<=6&&d!=null&&d>0?m>a*.55?{label:`Must Hit Phase`,tone:`danger`,detail:`The chase needs big choices now.`}:{label:`Clutch Chase`,tone:`warning`,detail:`The target is close enough to feel every ball.`}:p&&d!=null&&d>0&&d<=a?{label:`Target Almost There`,tone:`live`,detail:`One clean shot can finish it.`}:c>=2?{label:`Batter On Fire`,tone:`live`,detail:`High-value shots are landing.`}:o[o.length-1]?.resultType===`wicket`?{label:`Bowler On Top`,tone:`warning`,detail:`The last read landed perfectly.`}:!p&&r.scoreboard.legalBalls<=6?{label:`Calm Start`,tone:`calm`,detail:`Patterns are still forming.`}:f<=6?{label:`Final Over Heat`,tone:`warning`,detail:`Every pick has endgame weight.`}:{label:`Powerplay Mood`,tone:`calm`,detail:`Build pressure without showing the hand.`}}function de(e,t,n){let r=le(e),i=O(t).slice(-5),a=i[i.length-1]??null,o=i.filter(e=>e.resultType===`wicket`).length,s=i.filter(e=>e.resultType!==`wicket`&&j(e.battingNumber,n)).length,c=i.slice(-3,-1),l=a?.resultType===`wicket`&&c.length>=2&&c.every(e=>e.resultType!==`wicket`&&j(e.battingNumber,n));return r?.scoreboard.target!=null&&(r.scoreboard.ballsLeft??0)<=6&&(r.scoreboard.requiredRuns??99)>0?{label:`Clutch Mode`,tone:`clutch`,detail:`The chase is inside the final squeeze.`}:o>=2?{label:`Collapse Pressure`,tone:`collapse`,detail:`The bowling side has the story right now.`}:l?{label:`Momentum Swing`,tone:`swing`,detail:`A wicket cut through a scoring burst.`}:a?.resultType===`wicket`?{label:`Bowler Momentum`,tone:`bowling`,detail:`A perfect read just shifted the ball.`}:s>=2?{label:`Batter Momentum`,tone:`batting`,detail:`Big numbers are driving the innings.`}:{label:`Neutral`,tone:`neutral`,detail:`Both sides are still testing patterns.`}}function fe(e,t,n,r=3){let i=O(t),a=ce(i,n),o=[],s=i[i.length-1]??null,c=a.batterPicks.filter(e=>j(e,n)).length,l=a.bowlerPicks.filter(e=>j(e,n)).length,u=a.batterPicks.filter(e=>se(e,n)).length;a.batterPicks.length&&o.push(`Last 5 batter picks: ${a.batterPicks.join(`, `)}`),s?.resultType===`wicket`&&o.push(`Perfect read last ball`),a.batterRepeat.number!=null&&a.batterRepeat.count>=2?o.push(`Batter repeated ${a.batterRepeat.number} twice`):(a.mostUsedBatter?.count??0)>=3&&o.push(`Batter repeats ${a.mostUsedBatter?.number} often`),c>=3?o.push(`High numbers are becoming predictable`):a.recentBigHits.length>=2&&o.push(`Batter is attacking`),l>=3&&o.push(`Bowler is hunting high numbers`),a.batterPicks.length>=4&&u===0&&o.push(`Low numbers are being ignored`);let d=ue(e,i,n);return(d.tone===`warning`||d.tone===`danger`)&&o.push(d.label),[...new Set(o)].slice(0,r)}function pe(e,t,n){if(!e)return``;if(e.resultType===`wicket`)return`Perfect Read`;if(e.resultTone===`mega`||A(e.battingNumber,n)===`highest`)return`Mega Hit`;if(j(e.battingNumber,n))return`Power Phase`;let r=k(t,`batting`,3);return r.length&&r[r.length-1]===e.battingNumber?`Pattern Repeat`:``}function M(e,t,n){let r=O(t);if(!r.length)return[];let i=ae(r.flatMap(e=>[e.battingNumber,e.bowlingNumber])),a=new Map,o=new Map,s=r[0];r.forEach(e=>{e.resultType===`wicket`?o.set(e.battingNumber,(o.get(e.battingNumber)??0)+1):(a.set(e.battingNumber,(a.get(e.battingNumber)??0)+e.runs),e.runs>s.runs&&(s=e))});let c=[...a.entries()].sort((e,t)=>t[1]-e[1])[0]??null,l=[...o.entries()].sort((e,t)=>t[1]-e[1])[0]??null,u=r.filter(e=>e.resultType===`wicket`).length,d=de(e,r,n),f=[];return i&&f.push({label:`Most Picked`,value:String(i.number),detail:`${i.count} total uses across bat and bowl.`}),c&&f.push({label:`Best Scoring Number`,value:String(c[0]),detail:`${c[1]} runs came from this pick.`}),l&&f.push({label:`Most Dangerous Number`,value:String(l[0]),detail:`${l[1]} wicket read${l[1]===1?``:`s`}.`}),f.push({label:`Biggest Hit`,value:String(s.runs),detail:`${s.battingNumber} vs ${s.bowlingNumber}.`}),f.push({label:`Perfect Reads`,value:String(u),detail:u?`Matched numbers decided key balls.`:`No wicket reads in this finish.`}),f.push({label:`Story Finish`,value:d.label,detail:d.detail}),f.slice(0,6)}function N(e){return`${Math.floor(e/6)}.${e%6}`}function me(e){return e?new Intl.DateTimeFormat(`en-IN`,{hour:`numeric`,minute:`2-digit`}).format(e):`just now`}function he(e){return e.split(/[\s-]+/).filter(Boolean).map(e=>e[0].toUpperCase()+e.slice(1)).join(` `)}var P={HOME:`home`,ROOM:`room`,LOBBY:`lobby`,DRAFT:`draft`,TOSS:`toss`,LINEUP:`lineup`,MATCH:`match`,RESULT:`result`,HISTORY:`history`,RULES:`rules`},F={IDLE:`idle`,LOBBY:`lobby`,DRAFT:`draft`,TOSS:`toss`,LINEUP:`lineup`,LIVE:`live`,COMPLETED:`completed`},I={SETUP:`setup`,TOSS:`toss`,LINEUP:`lineup`,LIVE:`live`,BREAK:`innings-break`,COMPLETE:`complete`},ge={SINGLE:`single`,TWO_BATSMEN:`two-batsmen`},_e={FREE:`free-change`,LOCKED:`over-locked`},L={CONNECTED:`connected`,WAITING:`waiting`,SYNCING:`syncing`,RECONNECTING:`reconnecting`,OFFLINE:`offline`},ve={LOCAL_VS_AI:`local-vs-ai`,HOTSEAT:`hotseat`},R={ALPHA:`alpha`,BETA:`beta`},ye=[`Storm Falcons`,`Metro Blazers`,`Night Chargers`,`Sky Strikers`],be=[`Aadi`,`Rhea`,`Kabir`,`Mira`,`Arjun`,`Tara`,`Ishaan`,`Zoya`,`Neel`,`Kiara`,`Dev`,`Anya`],z=y(),B={matchMode:ge.TWO_BATSMEN,bowlingMode:_e.LOCKED,overs:2,playersPerTeam:2,controlMode:ve.LOCAL_VS_AI,numberSetMode:z.numberSetMode,numberSetPreset:z.numberSetPreset,numberSetLabel:z.numberSetLabel,allowedNumbers:z.allowedNumbers,numberRangeMin:z.numberRangeMin,numberRangeMax:z.numberRangeMax,customNumbersText:z.customNumbersText,aiDifficulty:`medium`},xe=[1,2,3,4,5,6,7,8,9,10,11];B.playersPerTeam*2,z.allowedNumbers;var V={SESSION:`mh-handrex-session`,HISTORY:`mh-handrex-history`,ROOM:`mh-handrex-room`,STATE:`mh-handrex-state`,RELEASE_NOTICE:`mh-handrex-release-notice`},Se={PLAYER_JOIN_MIN:350,PLAYER_JOIN_MAX:950,AI_PICK_MIN:500,AI_PICK_MAX:1200,REVEAL:850,STATUS_PULSE:2800},H={WAITING_PULSE:300,REVEAL_LOCK:320,RESULT_DISPLAY:920,INNINGS_BREAK:960,RECONNECT:800,SIGNAL_COOLDOWN:2500,SIGNAL_DISPLAY:2600},U={version:`v1.2.0`,releasedAt:`2026-04-16T00:00:00+05:30`,whatsNewUrl:``,whatsNewVisibleDays:7};function Ce(){return typeof crypto<`u`&&typeof crypto.randomUUID==`function`?crypto.randomUUID():`player_${Math.random().toString(36).slice(2,10)}${Date.now().toString(36)}`}function we(e,t){try{let n=window.localStorage.getItem(e);return n?JSON.parse(n):t}catch{return t}}function Te(e,t){try{window.localStorage.setItem(e,JSON.stringify(t))}catch{}}function Ee(){let e=we(V.SESSION,{localPlayerId:null,playerKey:``,profileName:`Captain You`,lastRoomCode:``,activeRoomCode:``});return{localPlayerId:e.localPlayerId??null,playerKey:e.playerKey||Ce(),profileName:e.profileName||`Captain You`,lastRoomCode:e.lastRoomCode||``,activeRoomCode:e.activeRoomCode||``}}function De(e){Te(V.SESSION,e)}function Oe(){return we(V.HISTORY,[])}function ke(e){Te(V.HISTORY,e)}function Ae(e){Te(V.ROOM,e)}function je(){return we(V.STATE,null)}function Me(e){Te(V.STATE,e)}function Ne(){return we(V.RELEASE_NOTICE,{installedVersion:null,whatsNewVersion:null})}function Pe(e){Te(V.RELEASE_NOTICE,e)}var W={NAVIGATE:`NAVIGATE`,PATCH_UI:`PATCH_UI`,SET_CONNECTION:`SET_CONNECTION`,SET_ROOM:`SET_ROOM`,PATCH_ROOM:`PATCH_ROOM`,SET_MATCH:`SET_MATCH`,PATCH_MATCH:`PATCH_MATCH`,SAVE_HISTORY_ENTRY:`SAVE_HISTORY_ENTRY`,PUSH_TOAST:`PUSH_TOAST`,DISMISS_TOAST:`DISMISS_TOAST`,UPDATE_SESSION:`UPDATE_SESSION`,RESET_FLOW:`RESET_FLOW`};function Fe(e,t){let n=t.innings.reduce((e,t)=>e+t.scoreboard.legalBalls,0);return{savedAt:Date.now(),roomCode:e?.code??``,result:a(t.result),numberSetLabel:t.settings.numberSetLabel??`Classic 1-6`,allowedNumbers:[...t.settings.allowedNumbers??[1,2,3,4,5,6]],insights:M(t,t.ballEvents,t.settings.allowedNumbers),basicStats:{totalRuns:t.innings.reduce((e,t)=>e+t.scoreboard.runs,0),totalWickets:t.innings.reduce((e,t)=>e+t.scoreboard.wickets,0),oversText:N(n),ballCount:t.ballEvents.length},inningsSummary:t.innings.map(e=>({teamId:e.battingTeamId,teamName:t.teams[e.battingTeamId].name,runs:e.scoreboard.runs,wickets:e.scoreboard.wickets,oversText:N(e.scoreboard.legalBalls)}))}}function Ie(e,t){let n=a(e);switch(t.type){case W.NAVIGATE:return n.route=t.payload,n;case W.PATCH_UI:return n.ui={...n.ui,...t.payload},n;case W.SET_CONNECTION:return n.connection={...n.connection,...t.payload},n;case W.SET_ROOM:return n.room=t.payload,t.payload&&Ae(t.payload),n;case W.PATCH_ROOM:return n.room=n.room?{...n.room,...t.payload}:t.payload,n.room&&Ae(n.room),n;case W.SET_MATCH:return n.match=t.payload,t.payload?.result&&(n.lastSavedMatch=Fe(n.room,t.payload),Me(n.lastSavedMatch)),n;case W.PATCH_MATCH:return n.match=n.match?{...n.match,...t.payload}:t.payload,n;case W.SAVE_HISTORY_ENTRY:return n.history=[t.payload,...n.history].slice(0,12),ke(n.history),n;case W.PUSH_TOAST:return n.ui.toasts=[...n.ui.toasts,t.payload].slice(-3),n;case W.DISMISS_TOAST:return n.ui.toasts=n.ui.toasts.filter(e=>e.id!==t.payload),n;case W.UPDATE_SESSION:return n.session={...n.session,...t.payload},De(n.session),n;case W.RESET_FLOW:return n.room=null,n.match=null,n.route=`home`,n.session={...n.session,activeRoomCode:``},n.ui.selectedNumberSide=null,n.ui.selectedPicks={batting:null,bowling:null},n.ui.numberSetDraft=null,n.ui.numberSetValidationError=``,n.ui.connectionBanner=`Ready for realtime room`,n.ui.isPaused=!1,n.ui.signalSheetOpen=!1,n.ui.signalCooldownUntil=0,n.ui.signalHighlightUntil=0,n.ui.incomingSignal=null,n.ui.confirmDialog=null,n.ui.toasts=[],De(n.session),n;default:return n}}function G({title:e=``,kicker:t=``,content:n,className:r=``}){return`
    <section class="card ${r}">
      ${t?`<p class="card__kicker">${t}</p>`:``}
      ${e?`<h3 class="card__title">${e}</h3>`:``}
      <div class="card__body">
        ${n}
      </div>
    </section>
  `}function Le(t){if(!t.room?.draftState)return G({kicker:`Draft`,title:`Draft not ready`,content:`
        <p>Fill the lobby, choose captains, and then open the draft board.</p>
        <div class="action-row">${e({label:`Back to Lobby`,action:`navigate`,attrs:{"data-route":`lobby`}})}</div>
      `});let n=Object.fromEntries(t.room.players.map(e=>[e.id,e])),r=t.room.draftState.pickSequence[t.room.draftState.currentPickIndex]??null,i=r?t.room.teams[r]:null,a=t.room.captains.alpha===t.session.localPlayerId?`alpha`:t.room.captains.beta===t.session.localPlayerId?`beta`:null,o=t.room.settings.controlMode===`local-vs-ai`&&r&&a&&r!==a&&t.room.draftState.status!==`complete`,s=e=>{let r=t.room?.teams[e];return r?`
      <div class="draft-roster">
        <p class="team-preview__label">${r.name}</p>
        <ul>
          ${r.playerIds.map(e=>`<li>${n[e]?.name??e}${r.captainId===e?` (C)`:``}</li>`).join(``)}
        </ul>
      </div>
    `:`<p class="empty-state">Waiting for captains.</p>`};return`
    <section class="page-stack">
      ${G({kicker:`Draft Board`,title:t.room.draftState.status===`complete`?`Teams Locked In`:`${i?.name??`Captain`} on the clock`,className:`card--hero`,content:`
          <p>
            ${t.room.draftState.status===`complete`?`The squad build is finished. Move forward to the toss and final lineups.`:o?`Opponent captain is making a mocked live pick.`:`Pick from the available player pool to complete both teams in order.`}
          </p>
          <div class="stats-row">
            <div><strong>${t.room.draftState.currentPickIndex+1}</strong><span>Current pick</span></div>
            <div><strong>${t.room.draftState.availablePlayerIds.length}</strong><span>Players left</span></div>
            <div><strong>${t.room.draftState.picks.length}</strong><span>Picks made</span></div>
          </div>
          <div class="action-row">
            ${e({label:`Auto Complete`,action:`auto-draft`,variant:`ghost`,disabled:t.room.draftState.status===`complete`})}
            ${e({label:`Back to Lobby`,action:`navigate`,variant:`ghost`,attrs:{"data-route":`lobby`}})}
            ${e({label:`Start Toss`,action:`start-toss`,attrs:{"data-route":`toss`},disabled:t.room.draftState.status!==`complete`})}
          </div>
        `})}
      <div class="grid-two">
        ${G({kicker:`Available Pool`,title:`Make The Next Pick`,className:`card--span-2`,content:`
            <div class="draft-grid">
              ${t.room.draftState.availablePlayerIds.map(r=>{let i=n[r];return`
                    <article class="draft-player">
                      <div>
                        <strong>${i?.name??r}</strong>
                        <p>${i?.isMock?`Mock remote player`:`Local player`}</p>
                      </div>
                      ${e({label:t.room.draftState.status===`complete`?`Picked`:`Draft`,action:`draft-pick`,variant:`secondary`,disabled:t.room.draftState.status===`complete`||o,attrs:{"data-player":r}})}
                    </article>
                  `}).join(``)}
            </div>
          `})}
        ${G({kicker:`Squads`,title:`Alpha Roster`,content:s(`alpha`)})}
        ${G({kicker:`Squads`,title:`Beta Roster`,content:s(`beta`)})}
        ${G({kicker:`Pick Log`,title:`Draft Timeline`,className:`card--span-2`,content:`
            <div class="history-list">
              ${t.room.draftState.picks.length?t.room.draftState.picks.map((e,r)=>`
                        <article class="history-item">
                          <div>
                            <strong>Pick ${r+1}</strong>
                            <p>${t.room.teams[e.teamId]?.name??e.teamId}</p>
                          </div>
                          <div>
                            <p>${n[e.playerId]?.name??e.playerId}</p>
                            <p>${e.auto?`AI assisted`:`Captain selected`}</p>
                          </div>
                        </article>
                      `).join(``):`<p class="empty-state">The draft board is ready for the first pick.</p>`}
            </div>
          `})}
      </div>
    </section>
  `}function Re(e){return`
    <section class="page-stack">
      ${G({kicker:`History`,title:`Recent Matches`,className:`card--hero`,content:`
          <p class="muted">
            ${e.history.length?`${e.history.length} finished match${e.history.length===1?``:`es`} saved on this device.`:`Finished matches saved on this device will appear here.`}
          </p>
        `})}
      ${G({kicker:`Saved Results`,title:`Match Archive`,content:e.history.length?`
              <div class="history-list">
                ${e.history.map(e=>`
                      <article class="history-item">
                        <div>
                          <strong>${e.result.marginText}</strong>
                          <p>Room ${e.roomCode} &middot; ${me(e.playedAt)}</p>
                        </div>
                        <div>
                          <p>${he(e.settings?.matchMode??`two-batsmen`)} &middot; ${he(e.settings?.bowlingMode??`over-locked`)}</p>
                          <p>${e.numberSetLabel??e.settings?.numberSetLabel??`Classic 1-6`} &middot; ${(e.allowedNumbers??e.settings?.allowedNumbers??[1,2,3,4,5,6]).join(`, `)}</p>
                          ${e.insights?.[0]?`<p>${e.insights[0].label}: ${e.insights[0].value}</p>`:``}
                          <p>${e.inningsSummary.map(e=>`${e.teamId}: ${e.runs}/${e.wickets}`).join(` | `)}</p>
                        </div>
                      </article>
                    `).join(``)}
              </div>
            `:`<p class="empty-state">Your finished matches will appear here.</p>`})}
    </section>
  `}function ze(){let e=Ne(),t={installedVersion:e.installedVersion,whatsNewVersion:e.whatsNewVersion},n=!1;t.installedVersion?t.installedVersion!==U.version&&(t.installedVersion=U.version,t.whatsNewVersion=U.version,n=!0):(t.installedVersion=U.version,n=!0);let r=Date.parse(U.releasedAt);if(Number.isNaN(r))return n&&Pe(t),!1;let i=U.whatsNewVisibleDays*24*60*60*1e3,a=Date.now(),o=a>=r&&a<r+i,s=t.whatsNewVersion===U.version&&o;return!o&&t.whatsNewVersion===U.version&&(t.whatsNewVersion=null,n=!0),n&&Pe(t),s}function Be(t){let n=t.lastSavedMatch,r=ze(),i=U.whatsNewUrl.trim();return`
    <section class="hero hero--home">
      <div class="hero__copy">
        <div class="hero__intro">
          <p class="eyebrow">Realtime Multiplayer Hand Cricket</p>
          <div class="hero__title-row">
            <h1>MH Handrex</h1>
            <div class="hero__release">
              <span class="hero-version">Version ${U.version}</span>
              ${r?`
                    <a
                      class="hero-link ${i?``:`is-disabled`}"
                      href="${i||`#`}"
                      ${i?`target="_blank" rel="noreferrer"`:`aria-disabled="true" tabindex="-1"`}
                    >
                      What's New
                    </a>
                  `:``}
            </div>
          </div>
          <p class="hero__lede">
            Structured room play, quick practice matches, and synchronized ball reveals built to stay clear on both desktop and mobile.
          </p>
        </div>
        <div class="hero__pills">
          <span class="hero-pill">1v1 to 11v11</span>
          <span class="hero-pill">Live room sync</span>
          <span class="hero-pill">Practice offline</span>
          <span class="hero-pill">Mobile-friendly play</span>
        </div>
        <ul class="feature-list">
          <li>Create or join a room in seconds and keep every player synced.</li>
          <li>Set team size, captains, toss, lineups, and match mode from one flow.</li>
          <li>Jump into quick practice when you want a faster solo session.</li>
        </ul>
        <div class="field-grid">
          <label class="field">
            <span>Player Name</span>
            <input data-field="profile-name" value="${t.session.profileName}" maxlength="18" />
          </label>
          <label class="field">
            <span>Room Code</span>
            <input data-field="room-code" value="${t.ui.roomCodeInput}" maxlength="6" />
          </label>
          <label class="field">
            <span>Players Per Team</span>
            <select data-field="players-per-team">
              ${xe.map(e=>`<option value="${e}" ${t.ui.playersPerTeam===e?`selected`:``}>${e} vs ${e}</option>`).join(``)}
            </select>
          </label>
        </div>
        <div class="hero__actions">
          ${e({label:`Quick Match`,action:`quick-match`})}
          ${e({label:`Create Room`,action:`create-room`,variant:`secondary`})}
          ${e({label:`Join Room`,action:`join-room`,variant:`secondary`})}
          ${e({label:`Practice / Offline`,action:`practice-mode`,variant:`ghost`})}
          ${e({label:`Rules`,action:`navigate`,variant:`ghost`,attrs:{"data-route":`rules`}})}
        </div>
      </div>
      <div class="hero__stack">
        ${G({kicker:`Flow`,title:`From home screen to live match`,content:`
            <ul class="feature-list">
              <li>Create or join a room with realtime presence and invite sharing.</li>
              <li>Choose team sizes from 1v1 up to 11v11 before room creation.</li>
              <li>Move through toss, lineups, innings switch, and chase without leaving the flow.</li>
              <li>Play across tabs, windows, or separate devices.</li>
            </ul>
          `})}
        ${n?G({kicker:`Last Match`,title:n.result?.marginText??`Saved locally`,content:`
                <ul class="feature-list">
                  ${n.inningsSummary.map(e=>`<li>${e.teamName}: ${e.runs}/${e.wickets} in ${e.oversText} overs</li>`).join(``)}
                  <li>Total runs: ${n.basicStats.totalRuns}</li>
                  <li>Total wickets: ${n.basicStats.totalWickets}</li>
                  <li>Numbers: ${n.numberSetLabel??`Classic 1-6`}</li>
                </ul>
              `}):``}
        ${G({kicker:`Architecture`,title:`Structured to scale cleanly`,content:`
            <ul class="feature-list">
              <li>UI, transport, and deterministic game logic are separated clearly.</li>
              <li>Socket communication stays behind room and match services.</li>
              <li>The engine keeps scoring predictable and easier to maintain.</li>
            </ul>
          `})}
      </div>
    </section>
  `}function K({title:e,teamId:t,type:n,order:r,playersById:i,movableIds:a=null,locked:o=!1,helper:s=``}){return`
    <section class="lineup-editor">
      <div class="lineup-editor__head">
        <div>
          <h4>${e}</h4>
          ${s?`<p>${s}</p>`:``}
        </div>
      </div>
      <ol class="lineup-editor__list">
        ${r.map((e,s)=>{let c=i[e],l=!o&&(!a||a.includes(e));return`
              <li class="lineup-editor__item ${l?``:`is-locked`}">
                <span class="lineup-editor__index">${s+1}</span>
                <span class="lineup-editor__name">${c?.name??e}</span>
                <span class="lineup-editor__actions">
                  <button
                    class="icon-btn"
                    data-action="move-lineup"
                    data-team="${t}"
                    data-type="${n}"
                    data-index="${s}"
                    data-direction="up"
                    ${!l||s===0?`disabled`:``}
                  >&uarr;</button>
                  <button
                    class="icon-btn"
                    data-action="move-lineup"
                    data-team="${t}"
                    data-type="${n}"
                    data-index="${s}"
                    data-direction="down"
                    ${!l||s===r.length-1?`disabled`:``}
                  >&darr;</button>
                </span>
              </li>
            `}).join(``)}
      </ol>
    </section>
  `}function Ve(t){if(!t.room?.teams.alpha||!t.room.teams.beta)return``;let n=Object.fromEntries(t.room.players.map(e=>[e.id,e])),r=t.room.lineups?.alpha??{battingOrder:t.room.teams.alpha.battingOrder,bowlingOrder:t.room.teams.alpha.bowlingOrder},i=t.room.lineups?.beta??{battingOrder:t.room.teams.beta.battingOrder,bowlingOrder:t.room.teams.beta.bowlingOrder},a=t.session.localPlayerId,o=t.room.settings.controlMode===ve.HOTSEAT,s=o||t.room.captains.alpha===a,c=o||t.room.captains.beta===a,l=t.room.hostId===a,u=n[t.room.captains.alpha??``]?.name??`Alpha captain`,d=n[t.room.captains.beta??``]?.name??`Beta captain`;return`
    <section class="page-stack">
      ${G({kicker:`Ready`,title:`Lock lineups and start the match`,className:`card--hero`,content:`
          <p>Each captain sets the batting order and bowling rotation for their side before kickoff. The host can lock the lineups and start the match when both teams look right.</p>
          <p class="muted">
            ${u} controls ${t.room.teams.alpha.name}. ${d} controls ${t.room.teams.beta.name}.
          </p>
          <div class="action-row">
            ${e({label:l?`Lock & Start Match`:`Host Starts Match`,action:`start-match`,disabled:!l})}
            ${e({label:`Back to Toss`,action:`navigate`,variant:`ghost`,attrs:{"data-route":`toss`}})}
          </div>
        `})}
      <div class="grid-two">
        ${G({kicker:`Lineups`,title:t.room.teams.alpha.name,content:`
            ${K({title:`Batting Order`,teamId:`alpha`,type:`batting`,order:r.battingOrder,playersById:n,locked:!s,helper:s?`Alpha captain sets the order for incoming batters.`:`${u} controls this batting lineup.`})}
            ${K({title:`Bowling Rotation`,teamId:`alpha`,type:`bowling`,order:r.bowlingOrder,playersById:n,locked:!s,helper:s?`Set the starting bowling order. Free-change mode can still adjust this in-match.`:`${u} controls this bowling lineup.`})}
          `})}
        ${G({kicker:`Lineups`,title:t.room.teams.beta.name,content:`
            ${K({title:`Batting Order`,teamId:`beta`,type:`batting`,order:i.battingOrder,playersById:n,locked:!c,helper:c?`Beta captain sets the order for incoming batters.`:`${d} controls this batting lineup.`})}
            ${K({title:`Bowling Rotation`,teamId:`beta`,type:`bowling`,order:i.bowlingOrder,playersById:n,locked:!c,helper:c?`Set the starting bowling order for match setup.`:`${d} controls this bowling lineup.`})}
          `})}
      </div>
    </section>
  `}function He({player:e,badges:t,rowClass:n=``,actions:r=``,layout:i=`default`}){let a=e.status===`unready`?`not ready`:e.status;return`
    <li class="${[`player-list__item`,n,i===`board`?`player-tile--board`:``].filter(Boolean).join(` `)}">
      <div class="avatar">${e.name.slice(0,2).toUpperCase()}</div>
      <div class="player-tile__body">
        <strong>${e.name}</strong>
        <p>${a}</p>
      </div>
      ${t.length?`<div class="badge-row">${t.map(e=>`<span class="mini-badge">${e}</span>`).join(``)}</div>`:``}
      ${r?`<div class="player-tile__actions">${r}</div>`:``}
    </li>
  `}function Ue({players:t,captains:n,teams:r={alpha:null,beta:null},hostId:i=``,localPlayerId:a=null,canRemovePlayers:o=!1}){return`
    <ul class="player-list">
      ${t.map(t=>{let s=r.alpha?.playerIds.includes(t.id)?`Alpha`:r.beta?.playerIds.includes(t.id)?`Beta`:``;return He({player:t,badges:[t.id===i?`Host`:``,t.id===n.alpha?`Alpha Captain`:``,t.id===n.beta?`Beta Captain`:``,s,t.isLocal?`You`:``,t.status===`ready`?`Ready`:`Waiting`].filter(Boolean),rowClass:[t.id===i?`is-host`:``,t.id===n.alpha||t.id===n.beta?`is-captain`:``,t.status===`ready`?`is-ready`:``,t.id===a?`is-local`:``].filter(Boolean).join(` `),actions:o&&t.id!==i?e({label:`Remove`,action:`remove-player`,variant:`danger`,size:`sm`,attrs:{"data-player":t.id}}):``})}).join(``)}
    </ul>
  `}function We({room:t,localPlayerId:n}){let r=t.teamSelections??{alpha:[],beta:[]},i=Object.fromEntries(t.players.map(e=>[e.id,e])),a=new Set([...r.alpha,...r.beta]),o=t.playerIds.filter(e=>!a.has(e)),s=t.hostId===n,c=t.teams.alpha?.name??t.teamNames?.alpha??`Alpha XI`,l=t.teams.beta?.name??t.teamNames?.beta??`Beta XI`;function u(i,a){if(!(s||i===n))return``;let o=r.alpha.length>=t.settings.playersPerTeam,c=r.beta.length>=t.settings.playersPerTeam;return`
      <div class="team-board__actions">
        ${a===R.ALPHA?``:e({label:a?`To Alpha`:`Join Alpha`,action:`set-player-team`,variant:a?`ghost`:`secondary`,size:`sm`,disabled:o,attrs:{"data-player":i,"data-team":R.ALPHA}})}
        ${a===R.BETA?``:e({label:a?`To Beta`:`Join Beta`,action:`set-player-team`,variant:a?`ghost`:`secondary`,size:`sm`,disabled:c,attrs:{"data-player":i,"data-team":R.BETA}})}
        ${a?e({label:`Bench`,action:`set-player-team`,variant:`ghost`,size:`sm`,attrs:{"data-player":i,"data-team":``}}):``}
      </div>
    `}function d(e,r,a,o){return`
      <section class="team-board__column ${r?`is-${r}`:`is-waiting`}">
        <div class="team-board__head">
          <div>
            <span class="team-board__kicker">${r?`Team Side`:`Waiting Pool`}</span>
            <h4>${a}</h4>
          </div>
          <span class="team-board__count">${e.length}/${r?t.settings.playersPerTeam:t.maxPlayers}</span>
        </div>
        <p class="team-board__helper">${o}</p>
        <ul class="player-list">
          ${e.length?e.map(e=>{let a=i[e];return a?He({player:a,badges:[a.id===t.hostId?`Host`:``,a.id===t.captains.alpha?`Alpha Captain`:``,a.id===t.captains.beta?`Beta Captain`:``,a.id===n?`You`:``].filter(Boolean),rowClass:[a.id===n?`is-local`:``,a.id===t.captains.alpha||a.id===t.captains.beta?`is-captain`:``,a.status===`ready`?`is-ready`:``].filter(Boolean).join(` `),actions:u(e,r),layout:`board`}):``}).join(``):`<li class="team-board__empty">No players here yet.</li>`}
        </ul>
      </section>
    `}return`
    <section class="team-board">
      ${d(r.alpha,R.ALPHA,c,`Players can choose this side for themselves. The host can re-place anyone before toss.`)}
      ${d(o,null,`Waiting To Choose`,`Unassigned players stay here until they pick Alpha or Beta.`)}
      ${d(r.beta,R.BETA,l,`Beta fills independently, and the host can still rebalance before kickoff.`)}
    </section>
  `}function Ge(t){if(!t.room)return``;let n=t.room.teamSelections??{alpha:[],beta:[]},r=(e,r)=>n[e].map(e=>t.room.players.find(t=>t.id===e)).filter(Boolean).map(e=>`<option value="${e.id}" ${e.id===r?`selected`:``}>${e.name}</option>`).join(``),i=t.room.hostId===t.session.localPlayerId,a=(t.room.players.find(e=>e.id===t.session.localPlayerId)??null)?.status===`ready`,o=t.room.players.filter(e=>e.status===`ready`).length,s=t.room.playerIds.length>=t.room.maxPlayers,c=s&&o===t.room.players.length,l=n.alpha.length===t.room.settings.playersPerTeam&&n.beta.length===t.room.settings.playersPerTeam,u=s&&c&&l&&t.room.captains.alpha&&t.room.captains.beta,d=t.room.draftState?.status===`complete`,f=t.room.source===`offline`,p=f||i,m=(t.room.teams.alpha?.name??t.room.teamNames?.alpha??`Alpha XI`).replace(/"/g,`&quot;`),h=(t.room.teams.beta?.name??t.room.teamNames?.beta??`Beta XI`).replace(/"/g,`&quot;`),g=r(`alpha`,t.room.captains.alpha),_=r(`beta`,t.room.captains.beta),y=!!g,te=!!_,ne=ee(),b=t.room.status===`live`||t.room.status===`completed`||!!t.match,x=i&&!b,C=t.ui.numberSetDraft??null,w={...t.room.settings,...C??{}},T=w.numberSetMode??`classic`,re=w.numberSetPreset??`classic`,E=Array.isArray(t.room.settings.allowedNumbers)&&t.room.settings.allowedNumbers.length?t.room.settings.allowedNumbers:[1,2,3,4,5,6],D=S(w,t.room.settings),O=D.ok?D.settings.allowedNumbers:E,k=D.ok?D.settings.numberSetLabel:`Pending edits`,ie=t.ui.numberSetValidationError||(D.ok?``:D.error),ae=String(w.customNumbersText??w.allowedNumbers?.join(`, `)??`1, 2, 3, 4, 5, 6`).replace(/"/g,`&quot;`);return`
    <section class="page-stack">
      ${G({kicker:`Lobby`,title:`Match Configuration`,content:`
          <div class="round-banner ${c&&l?`is-live`:``}">
            <strong>${s?`${o}/${t.room.players.length} players ready`:`${t.room.playerIds.length}/${t.room.maxPlayers} players in room`}</strong>
            <span>
              ${c&&l?i?`Everyone is ready and both sides are complete. Start the toss when you want.`:`Everyone is ready. Waiting for the host to continue.`:s&&!l?`Choose sides so Alpha and Beta are fully staffed before the toss can begin.`:s?`Use the ready toggle once you are set. Host can continue after everyone is ready.`:`Waiting for the room to fill before the lobby can continue.`}
            </span>
          </div>
          <div class="field-grid">
            <label class="field">
              <span>Match Mode</span>
              <select data-field="match-mode" ${i?``:`disabled`}>
                <option value="single" ${t.room.settings.matchMode===`single`?`selected`:``}>Single batsman</option>
                <option value="two-batsmen" ${t.room.settings.matchMode===`two-batsmen`?`selected`:``}>Two batsmen</option>
              </select>
            </label>
            <label class="field">
              <span>Bowling Mode</span>
              <select data-field="bowling-mode" ${i?``:`disabled`}>
                <option value="free-change" ${t.room.settings.bowlingMode===`free-change`?`selected`:``}>Free change</option>
                <option value="over-locked" ${t.room.settings.bowlingMode===`over-locked`?`selected`:``}>Over locked</option>
              </select>
            </label>
            <label class="field">
              <span>Team Size</span>
              <input value="${t.room.settings.playersPerTeam} vs ${t.room.settings.playersPerTeam}" disabled />
            </label>
            <label class="field">
              <span>Overs</span>
              <select data-field="overs" ${i?``:`disabled`}>
                <option value="2" ${t.room.settings.overs===2?`selected`:``}>2 overs</option>
                <option value="5" ${t.room.settings.overs===5?`selected`:``}>5 overs</option>
                <option value="10" ${t.room.settings.overs===10?`selected`:``}>10 overs</option>
              </select>
            </label>
            ${f?`
                  <label class="field">
                    <span>AI Difficulty</span>
                    <select data-field="ai-difficulty" ${i?``:`disabled`}>
                      <option value="beginner" ${t.room.settings.aiDifficulty===`beginner`?`selected`:``}>Beginner</option>
                      <option value="medium" ${(t.room.settings.aiDifficulty??`medium`)===`medium`?`selected`:``}>Medium</option>
                      <option value="hard" ${t.room.settings.aiDifficulty===`hard`?`selected`:``}>Hard</option>
                    </select>
                  </label>
                `:``}
          </div>
          <section class="number-set-panel" aria-label="Number set settings">
            <div class="number-set-panel__head">
              <div>
                <span class="team-preview__label">Number Set</span>
                <strong>${t.room.settings.numberSetLabel??`Classic 1-6`}</strong>
                <p class="muted">${i?`Choose the match numbers before the toss starts.`:`Synced from the host and locked for non-host players.`}</p>
              </div>
              <div class="number-set-preview">
                <span>Live Preview</span>
                <strong>${k}</strong>
                <div class="number-set-list">${v(O)}</div>
              </div>
            </div>
            <div class="field-grid">
              <label class="field">
                <span>Number Set Mode</span>
                <select data-field="number-set-mode" ${x?``:`disabled`}>
                  <option value="classic" ${T===`classic`?`selected`:``}>Classic 1-6</option>
                  <option value="preset" ${T===`preset`?`selected`:``}>Preset</option>
                  <option value="range" ${T===`range`?`selected`:``}>Range</option>
                  <option value="custom" ${T===`custom`?`selected`:``}>Custom list</option>
                </select>
              </label>
              <label class="field">
                <span>Preset</span>
                <select data-field="number-set-preset" ${!x||T!==`preset`?`disabled`:``}>
                  ${ne.map(e=>`
                        <option value="${e.id}" ${re===e.id?`selected`:``}>
                          ${e.label} (${e.allowedNumbers.join(`, `)})
                        </option>
                      `).join(``)}
                </select>
              </label>
              <label class="field">
                <span>Range Min</span>
                <input data-field="number-range-min" type="number" min="1" max="99" value="${w.numberRangeMin??1}" ${!x||T!==`range`?`disabled`:``} />
              </label>
              <label class="field">
                <span>Range Max</span>
                <input data-field="number-range-max" type="number" min="1" max="99" value="${w.numberRangeMax??6}" ${!x||T!==`range`?`disabled`:``} />
              </label>
              <label class="field">
                <span>Custom Numbers</span>
                <input data-field="custom-numbers" value="${ae}" placeholder="1, 5, 7, 11, 20" ${!x||T!==`custom`?`disabled`:``} />
              </label>
              <label class="field">
                <span>Active Numbers</span>
                <input value="${t.room.settings.numberSetLabel??`Classic 1-6`}: ${E.join(`, `)}" disabled />
              </label>
            </div>
            <div class="preset-card-grid">
              ${ne.map(e=>`
                    <button
                      class="preset-card ${T===`preset`&&re===e.id?`is-active`:``}"
                      data-action="choose-number-preset"
                      data-preset="${e.id}"
                      ${x?``:`disabled`}
                    >
                      <strong>${e.label}</strong>
                      <span>${e.allowedNumbers.join(`, `)}</span>
                    </button>
                  `).join(``)}
            </div>
            <div class="number-set-panel__actions">
              ${ie?`<p class="validation-text">${ie}</p>`:`<p class="muted">Active picker order is sorted ascending and supports up to 16 numbers.</p>`}
              ${e({label:`Apply Number Set`,action:`apply-number-set`,variant:`secondary`,disabled:!x||!!ie})}
            </div>
          </section>
          <div class="field-grid">
            <label class="field">
              <span>Alpha Captain</span>
              <select data-field="captain-alpha" ${!i||!y?`disabled`:``}>
                ${g||`<option value="">Choose from Alpha</option>`}
              </select>
            </label>
            <label class="field">
              <span>Beta Captain</span>
              <select data-field="captain-beta" ${!i||!te?`disabled`:``}>
                ${_||`<option value="">Choose from Beta</option>`}
              </select>
            </label>
          </div>
          <div class="field-grid">
            <label class="field">
              <span>Alpha Team Name</span>
              <input
                data-field="team-name-alpha"
                value="${m}"
                maxlength="24"
                ${i?``:`disabled`}
              />
            </label>
            <label class="field">
              <span>Beta Team Name</span>
              <input
                data-field="team-name-beta"
                value="${h}"
                maxlength="24"
                ${i?``:`disabled`}
              />
            </label>
          </div>
          <div class="action-row">
            ${e({label:f?`Practice Room`:`Copy Invite Link`,action:`copy-invite`,variant:`ghost`,disabled:f})}
            ${e({label:a?`Set Unready`:`Ready Up`,action:`toggle-ready`,variant:a?`ghost`:`secondary`})}
            ${e({label:`Open Draft Board`,action:`open-draft`,variant:`secondary`,disabled:!u||!i})}
            ${e({label:`Auto Draft Teams`,action:`auto-draft`,variant:`ghost`,disabled:!u||!i})}
            ${e({label:i?`Start Toss`:`Host Starts Toss`,action:`start-toss`,disabled:!d||!c||!l||!i})}
            ${p?e({label:f?`Discard Practice Room`:`Discard Room`,action:`discard-room`,variant:`danger`}):``}
          </div>
          <p class="muted">
            Connected mode: ${f?`offline practice with AI`:`realtime head-to-head`}. Host:
            ${t.room.players.find(e=>e.id===t.room.hostId)?.name??`Unknown`}.
            ${i?`You control lobby progression and can move any player between the two sides.`:`You can only change your own side while the host controls global setup.`}
          </p>
          <p class="muted">
            Draft status: ${d?`complete`:u?`ready for toss`:`waiting for full teams`}.
          </p>
        `})}
      <div class="grid-two">
        ${G({kicker:`Choose Sides`,title:`Alpha And Beta Areas`,className:`card--span-2`,content:We({room:t.room,localPlayerId:t.session.localPlayerId})})}
        ${G({kicker:`Room`,title:`Players`,content:Ue({players:t.room.players,captains:t.room.captains,teams:t.room.teams,hostId:t.room.hostId,localPlayerId:t.session.localPlayerId,canRemovePlayers:i&&!f})})}
        ${G({kicker:`Checklist`,title:`What unlocks the toss`,content:`
            <ul class="feature-list">
              <li>${s?`Room is full.`:`Fill every player slot in the room.`}</li>
              <li>${l?`Both sides are fully assigned.`:`Assign enough players to both Alpha and Beta.`}</li>
              <li>${t.room.captains.alpha&&t.room.captains.beta?`Both captains are chosen.`:`Choose one captain for each side.`}</li>
              <li>${c?`Everyone is marked ready.`:`Every player must toggle ready.`}</li>
              <li>${d?`Draft is complete and the match can move on.`:`Finish the draft so the toss can begin.`}</li>
            </ul>
          `})}
      </div>
    </section>
  `}function Ke(e,t={}){let n=Array.isArray(e)?e:[],r=n.map((e,t)=>({event:e,index:t})).slice(-12).reverse();return`
    <section class="ball-timeline">
      <div class="ball-timeline__head">
        <h3>Recent Balls</h3>
        <p>Latest reveals and outcomes</p>
      </div>
      <div class="ball-timeline__list">
        ${r.length?r.map(({event:e,index:r})=>{let i=e.resultTone??e.resultType??`run`,a=e.resultLabel??(e.resultType===`wicket`?`Wicket!`:`+${e.runs}`),o=pe(e,n.slice(0,r),t.allowedNumbers),s=de(t.match,n.slice(0,r+1),t.allowedNumbers),c=o||(s.label===`Neutral`?e.shotLabel??``:s.label);return`
                  <article class="ball-chip ball-chip--${i}">
                    <strong>${e.resultType===`wicket`?`OUT`:`+${e.runs}`}</strong>
                    <span>${e.battingNumber} vs ${e.bowlingNumber}</span>
                    <small>${a}</small>
                    ${c?`<em>${c}</em>`:``}
                    <small>Over ${e.over}.${e.ball}</small>
                  </article>
                `}).join(``):`<p class="empty-state">First ball is still waiting.</p>`}
      </div>
    </section>
  `}function qe({title:e,side:t,selected:n,disabled:r,locked:i,busy:a=!1,note:o,statusLabel:s=``,allowedNumbers:c=y().allowedNumbers,waiting:l=!1}){let u=Array.isArray(c)&&c.length?c:y().allowedNumbers,d=u.length===6&&u.every((e,t)=>e===t+1),f=!r&&!i&&n!=null;return`
    <section class="number-pad ${r?`is-disabled`:``} ${i?`is-locked`:``} ${a?`is-busy`:``} ${l?`is-waiting`:``}">
      <div class="number-pad__head">
        <div>
          <h3>${e}</h3>
          <p>${o}</p>
        </div>
        ${s?`<span class="mini-badge">${s}</span>`:``}
      </div>
      <div class="number-pad__grid ${d?`number-pad__grid--classic`:`number-pad__grid--dynamic`} ${u.length>10?`number-pad__grid--dense`:``}">
        ${u.map(e=>`
            <button
              class="number-btn ${!i&&n===e?`is-selected`:``}"
              data-action="pick-number"
              data-side="${t}"
              data-value="${e}"
              aria-label="Select ${e} for ${t}"
              ${r||i?`disabled`:``}
            >
              <span>${e}</span>
            </button>
          `).join(``)}
      </div>
      <div class="number-pad__footer">
        <p class="number-pad__status">
          ${i?`Pick locked and hidden until reveal.`:n==null?`Choose a number, then lock your pick.`:`Selected ${n}. Lock it when ready.`}
        </p>
        <button
          class="btn btn--secondary btn--sm number-pad__lock"
          data-action="lock-number"
          data-side="${t}"
          ${f?``:`disabled`}
          aria-label="Lock ${t} pick"
        >
          ${l?`Waiting...`:i?`Locked`:`Lock Pick`}
        </button>
      </div>
    </section>
  `}function Je({room:e,match:t,playersById:n,turnLabel:r,turnTone:i=``,incomingSignal:a=null,signalHighlighted:o=!1,scorePulse:s=!1}){let c=t.innings[t.currentInningsIndex],l=e.teams[c.battingTeamId],u=e.teams[c.bowlingTeamId],d=c.strikerId?n[c.strikerId]:null,f=c.nonStrikerId?n[c.nonStrikerId]:null,p=c.currentBowlerId?n[c.currentBowlerId]:null,m=c.strikerId?t.teams[c.battingTeamId].stats[c.strikerId]:null,h=c.nonStrikerId?t.teams[c.battingTeamId].stats[c.nonStrikerId]:null,g=c.currentBowlerId?t.teams[c.bowlingTeamId].stats[c.currentBowlerId]:null,_=Math.min(c.scoreboard.ballsInOver+1,6),v=c.scoreboard.target!=null&&c.scoreboard.requiredRuns!=null&&c.scoreboard.ballsLeft>0&&c.scoreboard.requiredRuns<=Math.max(12,c.scoreboard.ballsLeft*2);return`
    <section class="scoreboard ${s?`is-scored`:``} ${v?`is-close-chase`:``}">
      <div class="scoreboard__main">
        <div class="scoreboard__headline">
          <p class="eyebrow">Innings ${t.currentInningsIndex+1}</p>
          <h2>${l?.name??`Batting`} <span>${c.scoreboard.runs}/${c.scoreboard.wickets}</span></h2>
          <p class="scoreboard__subline">${N(c.scoreboard.legalBalls)} overs completed</p>
        </div>
        <div class="scoreboard__turn ${i}">
          <div class="scoreboard__turn-head">
            <span class="turn-dot ${i}"></span>
            <strong>${r}</strong>
          </div>
          <span>Over ${c.scoreboard.overs+1}, ball ${_}</span>
        </div>
        <div class="scoreboard__signal-lane ${o?`is-live`:``}">
          <span class="scoreboard__signal-label">Team Signal</span>
          <strong>${a?`${a.fromPlayerName||`Teammate`}: ${a.text}`:`No teammate signal right now`}</strong>
        </div>
        <div class="scoreboard__meta">
          <span><strong>${N(c.scoreboard.legalBalls)}</strong><small>Over count</small></span>
          <span><strong>${c.scoreboard.target??`-`}</strong><small>Target</small></span>
          <span><strong>${c.scoreboard.requiredRuns??`-`}</strong><small>Need</small></span>
          <span><strong>${c.scoreboard.ballsLeft}</strong><small>Balls left</small></span>
        </div>
      </div>
      <div class="scoreboard__players">
        <article class="scoreboard__player is-striker">
          <strong>Striker</strong>
          <span>${d?.name??`Waiting`}</span>
          <small>${m?`${m.runs} runs &middot; ${m.ballsFaced} balls`:`Yet to face`}</small>
        </article>
        <article class="scoreboard__player">
          <strong>Non-striker</strong>
          <span>${f?.name??`Single batsman mode`}</span>
          <small>${h?`${h.runs} runs &middot; ${h.ballsFaced} balls`:`Waiting`}</small>
        </article>
        <article class="scoreboard__player is-bowler">
          <strong>Current bowler</strong>
          <span>${p?.name??u?.name??`Waiting`}</span>
          <small>${g?`${g.wicketsTaken} wickets &middot; ${g.ballsBowled} balls`:`Ready to bowl`}</small>
        </article>
      </div>
    </section>
  `}var Ye=new Set;function q(e=`id`){return`${e}-${Math.random().toString(36).slice(2,8)}`}function Xe(){let e=``;do e=Array.from({length:6},()=>`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`[Math.floor(Math.random()*32)]).join(``);while(Ye.has(e));return Ye.add(e),e}var Ze=[{id:`batting`,label:`Batting Signals`,signals:[{id:`take-strike`,text:`I'll take strike`},{id:`you-take-strike`,text:`You take strike`},{id:`play-safe`,text:`Play safe`},{id:`go-aggressive`,text:`Go aggressive`}]},{id:`bowling`,label:`Bowling Signals`,signals:[{id:`i-bowl-next`,text:`I'll bowl next`},{id:`change-bowler`,text:`Change bowler`},{id:`try-random`,text:`Try random`},{id:`watch-pattern`,text:`Watch pattern`}]},{id:`general`,label:`General Signals`,signals:[{id:`nice-move`,text:`Nice move`},{id:`careful`,text:`Careful`},{id:`finish-it`,text:`Finish it`},{id:`wait`,text:`Wait`}]}],Qe=new Map(Ze.flatMap(e=>e.signals.map(t=>[t.id,{...t,categoryId:e.id,categoryLabel:e.label}]))),$e=56;function et(e){return Qe.get(e)??null}function tt(e,t){return!e||!t?null:e.teams.alpha?.playerIds.includes(t)?R.ALPHA:e.teams.beta?.playerIds.includes(t)?R.BETA:null}function nt(e,t){let n=tt(e,t);if(!e||!n||!t)return[];let r=e.teams[n]?.playerIds.filter(e=>e!==t)??[];return e.players.filter(e=>r.includes(e.id))}function rt(e,t){return!!(e?.source===`realtime`&&nt(e,t).length)}var it=class{constructor({store:e,socket:t}){this.store=e,this.socket=t,this.hideTimer=null,this.unsubscribe=this.socket.on(`receive_signal`,e=>this.handleIncomingSignal(e))}destroy(){this.clearHideTimer(),this.unsubscribe?.()}clearHideTimer(){this.hideTimer&&=(window.clearTimeout(this.hideTimer),null)}stripSignalToasts(e){let t=new Set(Array.from(Qe.values(),e=>e.text));return(e??[]).filter(e=>{let n=String(e?.message??``).trim(),r=n.indexOf(`:`);if(r<=0)return!0;let i=n.slice(r+1).trim();return!t.has(i)})}showSignal(e){let t=this.store.getState();this.clearHideTimer(),this.store.dispatch({type:W.PATCH_UI,payload:{incomingSignal:{signalId:e.signalId,categoryId:e.categoryId,text:e.text,fromPlayerId:e.fromPlayerId,fromPlayerName:e.fromPlayerName,receivedAt:e.receivedAt??Date.now()},signalHighlightUntil:Date.now()+H.SIGNAL_DISPLAY,toasts:this.stripSignalToasts(t.ui.toasts)}}),this.hideTimer=window.setTimeout(()=>{this.store.dispatch({type:W.PATCH_UI,payload:{signalHighlightUntil:0}}),this.hideTimer=null},H.SIGNAL_DISPLAY)}pushToast(e,t=`info`){this.store.dispatch({type:W.PUSH_TOAST,payload:{id:q(`toast`),message:e,tone:t}})}openSheet(){let e=this.store.getState();if(!(!e.match||e.route!==P.MATCH)){if(!rt(e.room,e.session.localPlayerId)){this.pushToast(`Signals are available only in team multiplayer rooms.`,`info`);return}this.store.dispatch({type:W.PATCH_UI,payload:{signalSheetOpen:!0}})}}closeSheet(){this.store.dispatch({type:W.PATCH_UI,payload:{signalSheetOpen:!1}})}sanitizeCustomText(e){return String(e??``).replace(/\s+/g,` `).trim().slice(0,$e)}sendSignal(e){let t=this.store.getState(),n=et(e),r=Number(t.ui.signalCooldownUntil)||0;if(!n||!t.match||!t.room||!rt(t.room,t.session.localPlayerId)){this.closeSheet();return}if(Date.now()<r){let e=Math.max(1,Math.ceil((r-Date.now())/1e3));this.pushToast(`Signals cooling down. Try again in ${e}s.`,`info`),this.closeSheet();return}let i=Date.now()+H.SIGNAL_COOLDOWN;this.store.dispatch({type:W.PATCH_UI,payload:{signalSheetOpen:!1,signalCooldownUntil:i}}),this.socket.emit(`send_signal`,{signalId:n.id},e=>{if(e?.ok){this.showSignal({signalId:n.id,categoryId:n.categoryId,text:n.text,fromPlayerId:t.session.localPlayerId??null,fromPlayerName:`You`});return}this.pushToast(e?.error??`Unable to send teammate signal.`,`warning`)})}sendCustomSignal(e){let t=this.store.getState(),n=Number(t.ui.signalCooldownUntil)||0,r=this.sanitizeCustomText(e);if(!t.match||!t.room||!rt(t.room,t.session.localPlayerId)){this.closeSheet();return}if(!r){this.pushToast(`Type a short teammate note first.`,`info`);return}if(Date.now()<n){let e=Math.max(1,Math.ceil((n-Date.now())/1e3));this.pushToast(`Signals cooling down. Try again in ${e}s.`,`info`);return}let i=Date.now()+H.SIGNAL_COOLDOWN;this.store.dispatch({type:W.PATCH_UI,payload:{signalSheetOpen:!1,signalCooldownUntil:i}}),this.socket.emit(`send_signal`,{customText:r},e=>{if(e?.ok){this.showSignal({signalId:`custom`,categoryId:`custom`,text:r,fromPlayerId:t.session.localPlayerId??null,fromPlayerName:`You`});return}this.pushToast(e?.error??`Unable to send teammate note.`,`warning`)})}handleIncomingSignal(e){let t=this.store.getState(),n=t.session.localPlayerId,r=tt(t.room,n),i=e?.senderTeamId===R.ALPHA||e?.senderTeamId===R.BETA?e.senderTeamId:null;!t.room||e?.roomId!==t.room.code||e?.fromPlayerId&&n&&e.fromPlayerId===n||r&&i&&r!==i||this.showSignal({signalId:e?.signalId??``,categoryId:e?.categoryId??`general`,text:e?.text??`Signal`,fromPlayerId:e?.fromPlayerId??null,fromPlayerName:e?.fromPlayerName??`Teammate`,receivedAt:e?.sentAt??Date.now()})}};function at(e,t){let n=t.revealState;return e.ui.isPaused?{kicker:`Paused`,title:`Match paused`,note:`Selections are frozen until the match resumes.`,toneClass:`is-warning`}:e.connection.status===`reconnecting`?{kicker:`Reconnect`,title:`Restoring link`,note:`Waiting for the realtime connection to recover.`,toneClass:`is-warning`}:n.status===`locked`?{kicker:`Syncing`,title:`Both picks locked`,note:`Numbers stay hidden until the reveal animation completes.`,toneClass:`is-live`}:n.status===`revealing`?{kicker:`Reveal`,title:n.lastBall?.commentary??`Ball resolved`,note:`Both numbers are shown together to keep every ball fair.`,toneClass:`is-live`}:n.status===`waiting`?{kicker:`Waiting`,title:`Waiting for opponent`,note:e.ui.connectionBanner||`One side has locked in. Waiting for the other pick.`,toneClass:``}:{kicker:`Ready`,title:n.lastBall?.commentary??`Awaiting next ball`,note:`Lock both picks to start the next reveal.`,toneClass:``}}function ot(e,t,n,r,i,a){let o=t.innings[t.currentInningsIndex];return e.ui.isPaused?{label:`Match paused`,tone:`is-warning`}:e.connection.status===`reconnecting`?{label:`Reconnecting`,tone:`is-warning`}:t.revealState.status===`locked`?{label:`Reveal syncing`,tone:`is-live`}:t.revealState.status===`revealing`?{label:`Result live`,tone:`is-live`}:i?t.revealState.waitingFor===`batting`?{label:`Batting side to pick`,tone:``}:t.revealState.waitingFor===`bowling`?{label:`Bowling side to pick`,tone:``}:{label:`Pick both sides`,tone:`is-live`}:t.revealState.waitingFor?t.revealState.waitingFor===n?{label:`Your pick needed`,tone:`is-live`}:a&&r&&o[t.revealState.waitingFor===`batting`?`battingTeamId`:`bowlingTeamId`]===r?{label:t.revealState.waitingFor===`batting`?`AI teammate choosing`:`AI teammate bowling`,tone:``}:{label:`Waiting for opponent`,tone:``}:n===`batting`?{label:`Your turn to bat`,tone:`is-live`}:n===`bowling`?{label:`Your turn to bowl`,tone:`is-live`}:a&&r&&(o.battingTeamId===r||o.bowlingTeamId===r)?{label:`AI teammate on this ball`,tone:``}:{label:`Waiting for active players`,tone:``}}function st(t){if(!t.room||!t.match)return``;let n=Object.fromEntries(t.room.players.map(e=>[e.id,e])),r=t.match.innings[t.match.currentInningsIndex],i=t.session.localPlayerId,a=t.room.teams.alpha?.playerIds.includes(i??``)?`alpha`:t.room.teams.beta?.playerIds.includes(i??``)?`beta`:null,o=r.strikerId===i?`batting`:r.currentBowlerId===i?`bowling`:null,s=t.match.settings.controlMode===`hotseat`,c=t.room.source===`offline`,l=rt(t.room,i),u=nt(t.room,i),d=Number(t.ui.signalCooldownUntil)||0,f=Date.now()<d,p=Math.max(1,Math.ceil((d-Date.now())/1e3)),m=t.ui.incomingSignal??null,h=Number(t.ui.signalHighlightUntil)||0,g=!!m&&Date.now()<h,_=l||!!m,v=!!t.ui.isPaused,y=t.match.revealState,ee=r.pendingChoices.batting?.value??null,te=r.pendingChoices.bowling?.value??null,ne=t.ui.selectedPicks??{batting:null,bowling:null},b=Array.isArray(t.match.settings.allowedNumbers)&&t.match.settings.allowedNumbers.length?t.match.settings.allowedNumbers:[1,2,3,4,5,6],x=t.match.settings.numberSetLabel??`Classic 1-6`,S=y.lockedSides.includes(`batting`)||ee!==null,C=y.lockedSides.includes(`bowling`)||te!==null,w=S?ee:ne.batting,T=C?te:ne.bowling,re=v||y.status===`locked`||y.status===`revealing`||t.connection.status===`reconnecting`||t.connection.status===`offline`,E=re||(s?S:o!==`batting`||S),D=re||(s?C:o!==`bowling`||C),O=t.match.teams[r.battingTeamId],k=t.match.teams[r.bowlingTeamId],ie=O.battingOrder.filter(e=>![r.strikerId,r.nonStrikerId,...r.dismissedIds].includes(e)),ae=s||(a?r.battingTeamId===a:!1),oe=s||(a?r.bowlingTeamId===a:!1),A=v||y.status===`locked`||y.status===`revealing`||!!(r.pendingChoices.batting||r.pendingChoices.bowling)||t.match.settings.bowlingMode===`over-locked`&&r.scoreboard.ballsInOver!==0,j=at(t,t.match),se=ot(t,t.match,o,a,s,c),ce=ue(t.match,t.match.ballEvents,b),le=de(t.match,t.match.ballEvents,b),pe=fe(t.match,t.match.ballEvents,b,3),M=y.status===`revealing`,N=t.match.revealState.lastBall,me=M?N?.resultType===`wicket`?`is-wicket`:N?.resultTone===`mega`?`is-mega`:N?.resultTone===`boundary`||N?.resultTone===`power`?`is-boundary`:`is-run`:``,he=M?N?.resultLabel??(N?.resultType===`wicket`?`Wicket!`:`+${N?.runs??0}`):``,P=M?N?.battingNumber??`-`:S||y.status===`locked`?`Locked`:`Waiting`,F=M?N?.bowlingNumber??`-`:C||y.status===`locked`?`Locked`:`Waiting`;return`
    <section class="match-layout">
      ${Je({room:t.room,match:t.match,playersById:n,turnLabel:se.label,turnTone:se.tone,incomingSignal:m,signalHighlighted:g,scorePulse:M})}
      <div class="number-rule-strip" title="Allowed numbers: ${b.join(`, `)}">
        <span>Number Set</span>
        <strong>${x}</strong>
        <small>${b.join(`, `)}</small>
      </div>
      <section class="tactical-strip" aria-label="Mind game hints from revealed balls">
        <div class="tactical-chip tactical-chip--${ce.tone}">
          <span>Pressure</span>
          <strong>${ce.label}</strong>
          <small>${ce.detail}</small>
        </div>
        <div class="tactical-chip tactical-chip--${le.tone}">
          <span>Momentum</span>
          <strong>${le.label}</strong>
          <small>${le.detail}</small>
        </div>
        <details class="mind-hints" ${pe.length?`open`:``}>
          <summary>Mind Game</summary>
          ${pe.length?`<ul>${pe.map(e=>`<li>${e}</li>`).join(``)}</ul>`:`<p class="muted">Reveal a few balls to build useful patterns.</p>`}
        </details>
      </section>
      ${G({kicker:`Team Signal`,title:_?`Quick coordination`:`Signals unavailable`,className:g?`card--focus`:``,content:_?`
              <div class="signal-hub">
                <div class="signal-hub__head">
                  <div>
                    <strong>${u.map(e=>e.name).join(`, `)||m?.fromPlayerName||`Teammate connected`}</strong>
                    <p class="muted">Signals appear here without blocking the ball flow. Use a sample or type your own short note.</p>
                  </div>
                  ${e({label:f?`Signal in ${p}s`:`Open Signals`,action:`open-signal-sheet`,variant:`secondary`,disabled:!l})}
                </div>
                <div class="signal-hub__message ${g?`is-live`:``}">
                  <span class="signal-hub__label">Signal Channel</span>
                  <strong>${m?`${m.fromPlayerName||`Teammate`}: ${m.text}`:`No teammate signal right now`}</strong>
                </div>
              </div>
            `:`
              <div class="signal-hub">
                <div class="signal-hub__message">
                  <span class="signal-hub__label">Unavailable</span>
                  <strong>Signals activate only in live team multiplayer matches with at least one teammate.</strong>
                </div>
              </div>
            `})}
      <div class="match-layout__controls">
        ${G({kicker:j.kicker,title:j.title,className:`card--focus`,content:`
            <div class="round-banner ${j.toneClass}">
              <strong>${t.ui.connectionBanner||j.title}</strong>
              <span>${j.note}</span>
            </div>
            <div class="number-pad-row">
              ${qe({title:`Batting Pick`,side:`batting`,selected:w,disabled:E,locked:S,busy:y.status===`locked`||y.status===`revealing`,waiting:S&&y.status===`waiting`,allowedNumbers:b,statusLabel:S?`Locked`:E?`Waiting`:`Ready`,note:s?`Pick for batting side`:o===`batting`?S?`Your batting pick is locked in.`:`Your side is batting`:c&&a===r.battingTeamId?S?`AI teammate locked batting pick`:`AI teammate is batting`:S?`Opponent locked batting pick`:`Waiting for opponent`})}
              ${qe({title:`Bowling Pick`,side:`bowling`,selected:T,disabled:D,locked:C,busy:y.status===`locked`||y.status===`revealing`,waiting:C&&y.status===`waiting`,allowedNumbers:b,statusLabel:C?`Locked`:D?`Waiting`:`Ready`,note:s?`Pick for bowling side`:o===`bowling`?C?`Your bowling pick is locked in.`:`Your side is bowling`:c&&a===r.bowlingTeamId?C?`AI teammate locked bowling pick`:`AI teammate is bowling`:C?`Opponent locked bowling pick`:`Waiting for opponent`})}
            </div>
            <div class="action-row">
              ${e({label:v?`Resume Match`:`Pause Match`,action:`toggle-pause`,variant:`ghost`})}
              ${e({label:`Reconnect`,action:`simulate-reconnect`,variant:`ghost`})}
              ${e({label:`Leave Match`,action:`back-home`,variant:`danger`})}
            </div>
          `})}
        ${G({kicker:y.status===`revealing`?`Reveal`:y.status===`locked`?`Hidden Picks`:y.status===`waiting`?`Waiting`:`Latest Ball`,title:y.status===`revealing`?t.match.revealState.lastBall?.commentary??`Ball resolved`:y.status===`locked`?`Both picks are hidden`:y.status===`waiting`?`Waiting for opponent`:t.match.revealState.lastBall?.commentary??`Awaiting first reveal`,content:`
            <div class="reveal-panel ${M?`is-live`:``} ${y.status===`locked`?`is-hidden`:``}">
              <div>
                <strong>Bat</strong>
                <span class="reveal-panel__value">${P}</span>
              </div>
              <div>
                <strong>Bowl</strong>
                <span class="reveal-panel__value">${F}</span>
              </div>
            </div>
            ${M?`<div class="ball-result ${me}">${he}</div>`:``}
            ${M&&N?.commentary?`<p class="result-copy">${N.commentary}</p>`:``}
            ${y.status===`waiting`?`<p class="warning-text">Waiting for opponent to lock the remaining pick.</p>`:y.status===`locked`?`<p class="warning-text">Numbers are synced and will reveal together after a short delay.</p>`:v?`<p class="warning-text">Match paused. Picks are temporarily disabled.</p>`:``}
          `})}
      </div>
      <div class="grid-two">
        ${G({kicker:`Captain Control`,title:`Batting Order Management`,content:ae?K({title:O.name,teamId:r.battingTeamId,type:`batting`,order:ie,playersById:n,movableIds:ie,helper:`Only remaining batters can be reshuffled mid-match.`}):`<p class="muted">Opponent captain is managing the remaining batting queue.</p>`})}
        ${G({kicker:`Captain Control`,title:`Bowling Order And Changes`,content:oe?`
                <p class="muted">
                  ${A&&t.match.settings.bowlingMode===`over-locked`&&r.scoreboard.ballsInOver!==0?`Bowler is locked until the over ends.`:A?`Bowler changes unlock after the current ball resolves.`:`Tap a bowler to make them active for the next ball.`}
                </p>
                ${K({title:`${k.name} bowling queue`,teamId:r.bowlingTeamId,type:`bowling`,order:k.bowlingOrder,playersById:n,locked:A,helper:`Top position becomes the active bowler when changes are allowed.`})}
                <div class="chip-row">
                  ${k.playerIds.map(e=>{let t=n[e];return`
                        <button
                          class="chip-btn ${r.currentBowlerId===e?`is-active`:``}"
                          data-action="change-bowler"
                          data-team="${r.bowlingTeamId}"
                          data-player="${e}"
                          ${A?`disabled`:``}
                        >
                          ${t?.name??e}
                        </button>
                      `}).join(``)}
                </div>
              `:`<p class="muted">Opponent bowling changes are controlled from the other live client.</p>`})}
      </div>
      ${Ke(t.match.ballEvents,{match:t.match,allowedNumbers:b})}
      ${t.ui.signalSheetOpen?`
            <section class="signal-sheet" aria-label="Quick teammate signals">
              <div class="signal-sheet__header">
                <div>
                  <p class="card__kicker">Quick Signals</p>
                  <h3 class="card__title">Teammate Signals</h3>
                </div>
                <button class="icon-btn" data-action="close-signal-sheet" aria-label="Close signals">x</button>
              </div>
              <p class="muted">
                Sent only to teammate${u.length>1?`s`:``}.
                ${f?` Ready again in ${p}s.`:` Tap once to send instantly, or type a short custom note.`}
              </p>
              <div class="signal-sheet__composer">
                <label class="field">
                  <span>Type Your Own Signal</span>
                  <textarea
                    class="signal-sheet__input"
                    data-signal-input="custom"
                    maxlength="56"
                    rows="2"
                    placeholder="Type a short note for your teammate"
                  ></textarea>
                </label>
                <div class="action-row">
                  ${e({label:`Send Custom Signal`,action:`send-custom-signal`,variant:`secondary`,disabled:f})}
                </div>
              </div>
              <div class="signal-sheet__groups">
                ${Ze.map(e=>`
                    <section class="signal-group">
                      <p class="team-preview__label">${e.label}</p>
                      <div class="signal-group__grid">
                        ${e.signals.map(e=>`
                            <button
                              class="signal-btn"
                              data-action="send-signal"
                              data-signal="${e.id}"
                            >
                                <span class="signal-btn__text">${e.text}</span>
                              </button>
                            `).join(``)}
                      </div>
                    </section>
                  `).join(``)}
              </div>
            </section>
          `:``}
    </section>
  `}function ct(t){return t?`
    <section class="page-stack">
      ${G({kicker:`Restored`,title:t.result?.marginText??`Last match result`,className:`card--hero`,content:`
          <p><strong>Loaded from local storage</strong></p>
          <p class="muted">Basic result data was restored after refresh.</p>
          <div class="action-row">
            ${e({label:`History`,action:`navigate`,variant:`secondary`,attrs:{"data-route":`history`}})}
            ${e({label:`Back Home`,action:`back-home`,variant:`ghost`})}
          </div>
        `})}
      <div class="grid-two">
        ${G({kicker:`Scorecard`,title:`Innings Summary`,content:`
            <ul class="feature-list">
              ${t.inningsSummary.map(e=>`<li>${e.teamName}: ${e.runs}/${e.wickets} in ${e.oversText} overs</li>`).join(``)}
            </ul>
          `})}
        ${G({kicker:`Match Summary`,title:`Totals`,content:`
            <div class="stats-row">
              <div><strong>${t.basicStats.totalRuns}</strong><span>Total runs</span></div>
              <div><strong>${t.basicStats.totalWickets}</strong><span>Total wickets</span></div>
              <div><strong>${t.basicStats.oversText}</strong><span>Total overs</span></div>
              <div><strong>${t.basicStats.ballCount}</strong><span>Balls logged</span></div>
            </div>
          `})}
        ${t.insights?.length?G({kicker:`Mind Game`,title:`Saved Story Insights`,className:`card--span-2`,content:`
                <div class="insight-grid">
                  ${t.insights.map(e=>`
                        <article class="insight-tile">
                          <span>${e.label}</span>
                          <strong>${e.value}</strong>
                          <p>${e.detail}</p>
                        </article>
                      `).join(``)}
                </div>
              `}):``}
      </div>
    </section>
  `:``}function lt(t){if(!t.match?.result||!t.room)return ct(t.lastSavedMatch);let n=Object.fromEntries(t.room.players.map(e=>[e.id,e])),r=t.match.innings.reduce((e,t)=>e+t.scoreboard.runs,0),i=t.match.innings.reduce((e,t)=>e+t.scoreboard.wickets,0),a=t.match.innings.reduce((e,t)=>e+t.scoreboard.legalBalls,0),o=Array.isArray(t.match.settings.allowedNumbers)&&t.match.settings.allowedNumbers.length?t.match.settings.allowedNumbers:[1,2,3,4,5,6],s=M(t.match,t.match.ballEvents,o),c=t.match.result.winnerTeamId&&t.match.teams[t.match.result.winnerTeamId]?t.match.teams[t.match.result.winnerTeamId]:null,l=e=>`
    <div class="stats-table">
      ${e.playerIds.map(t=>{let r=e.stats[t];return`
            <div class="stats-table__row">
              <strong>${n[t]?.name??t}</strong>
              <span>${r.runs} runs</span>
              <span>${r.ballsFaced} balls</span>
              <span>${r.wicketsTaken} wkts</span>
            </div>
          `}).join(``)}
    </div>
  `;return`
    <section class="page-stack">
      ${G({kicker:`Result`,title:t.match.result.marginText,className:`card--hero`,content:`
          <p><strong>${t.match.result.isTie?`Match tied`:`${c?.name??`Winner`} wins`}</strong></p>
          <p>${t.match.result.summary}</p>
          <p class="muted">${t.match.result.reason}</p>
          <div class="action-row">
            ${e({label:`History`,action:`navigate`,variant:`secondary`,attrs:{"data-route":`history`}})}
            ${e({label:`Back Home`,action:`back-home`,variant:`ghost`})}
          </div>
        `})}
      <div class="grid-two">
        ${G({kicker:`Scorecard`,title:`Innings Summary`,content:`
            <ul class="feature-list">
              ${t.match.innings.map(e=>`<li>${(t.match?.teams[e.battingTeamId]).name}: ${e.scoreboard.runs}/${e.scoreboard.wickets} in ${N(e.scoreboard.legalBalls)} overs</li>`).join(``)}
            </ul>
          `})}
        ${G({kicker:`Match Summary`,title:`Totals`,content:`
            <div class="stats-row">
              <div><strong>${r}</strong><span>Total runs</span></div>
              <div><strong>${i}</strong><span>Total wickets</span></div>
              <div><strong>${N(a)}</strong><span>Total overs</span></div>
              <div><strong>${t.match.ballEvents.length}</strong><span>Balls logged</span></div>
              <div><strong>${t.match.settings.numberSetLabel??`Classic 1-6`}</strong><span>${o.join(`, `)}</span></div>
            </div>
          `})}
        ${s.length?G({kicker:`Mind Game`,title:`Match Story Insights`,className:`card--span-2`,content:`
                <div class="insight-grid">
                  ${s.map(e=>`
                        <article class="insight-tile">
                          <span>${e.label}</span>
                          <strong>${e.value}</strong>
                          <p>${e.detail}</p>
                        </article>
                      `).join(``)}
                </div>
              `}):``}
        ${G({kicker:`Player Stats`,title:t.match.teams.alpha.name,content:l(t.match.teams.alpha)})}
        ${G({kicker:`Player Stats`,title:t.match.teams.beta.name,content:l(t.match.teams.beta)})}
        ${G({kicker:`Ball By Ball`,title:`Match Log`,className:`card--span-2`,content:`
            <div class="history-list">
              ${t.match.ballEvents.map((e,n)=>{let r=pe(e,t.match.ballEvents.slice(0,n),o);return`
                      <article class="history-item">
                        <div>
                          <strong>Over ${e.over}.${e.ball}${r?` - ${r}`:``}</strong>
                          <p>${e.commentary??e.resultLabel??`Ball resolved`}</p>
                          ${e.shotLabel&&e.resultType!==`wicket`?`<p class="muted">${e.shotLabel}</p>`:``}
                        </div>
                        <div>
                          <p>${e.battingNumber} vs ${e.bowlingNumber}</p>
                          <p>${e.resultLabel??(e.resultType===`wicket`?`Wicket`:`+${e.runs}`)}</p>
                          <p>${t.match.teams[e.battingTeamId].name} batting</p>
                        </div>
                      </article>
                    `}).join(``)}
            </div>
          `})}
      </div>
    </section>
  `}function ut(t){if(!t.room)return G({title:`No active room`,content:`
        <p>Create a room or quick match from home to start the flow.</p>
        <div class="action-row">${e({label:`Back Home`,action:`navigate`,attrs:{"data-route":`home`}})}</div>
      `});let n=`${t.room.playerIds.length}/${t.room.maxPlayers} players`,r=t.room.players.filter(e=>e.status===`ready`).length,i=t.room.hostId===t.session.localPlayerId,a=t.room.source===`offline`,o=a||i;return`
    <section class="page-stack">
      ${G({kicker:`Room Setup`,title:`Room ${t.room.code}`,className:`card--hero`,content:`
          <p class="muted">
            ${a?`Practice mode keeps the room local, so you can organize sides and move straight into the lobby when you are ready.`:`Invite players, place everyone on the correct side, and move into the lobby once the room is full.`}
          </p>
          <div class="room-code">${t.room.code}</div>
          <div class="stats-row">
            <div><strong>${n}</strong><span>Lobby fill</span></div>
            <div><strong>${r}/${t.room.players.length}</strong><span>Players ready</span></div>
            <div><strong>${t.room.settings.playersPerTeam} vs ${t.room.settings.playersPerTeam}</strong><span>Team size</span></div>
            <div><strong>${a?`Practice AI`:`Realtime`}</strong><span>Control mode</span></div>
            <div><strong>${t.room.connectionState.status}</strong><span>Status</span></div>
          </div>
          <div class="action-row">
            ${e({label:`Enter Lobby`,action:`enter-lobby`,disabled:t.room.playerIds.length<t.room.maxPlayers})}
            ${e({label:`Copy Invite Link`,action:`copy-invite`,variant:`secondary`,disabled:a})}
            ${o?e({label:a?`Discard Practice Room`:`Discard Room`,action:`discard-room`,variant:`danger`}):``}
            ${e({label:`Back Home`,action:`back-home`,variant:`ghost`})}
          </div>
        `})}
      <div class="grid-two">
        ${G({kicker:`Choose Sides`,title:`Team Placement`,className:`card--span-2`,content:We({room:t.room,localPlayerId:t.session.localPlayerId})})}
        ${G({kicker:`Presence`,title:`Players Joining`,content:Ue({players:t.room.players,captains:t.room.captains,teams:t.room.teams,hostId:t.room.hostId,localPlayerId:t.session.localPlayerId,canRemovePlayers:i&&!a})})}
        ${G({kicker:`Next Step`,title:`Before you enter the lobby`,content:`
            <ul class="feature-list">
              <li>Fill every available slot so both sides can move forward together.</li>
              <li>Place players into Alpha, Beta, or keep them waiting until teams are balanced.</li>
              <li>Once the room is full, continue to the lobby for captains, settings, and readiness.</li>
            </ul>
          `})}
      </div>
    </section>
  `}function J(e,t,n){return`
    <article class="guide-step">
      <span class="guide-step__index">${e}</span>
      <div class="guide-step__body">
        <strong>${t}</strong>
        <p>${n}</p>
      </div>
    </article>
  `}function Y(e,t,n){return`
    <article class="guide-tile">
      <strong>${e}</strong>
      <p>${t}</p>
      <span>${n}</span>
    </article>
  `}function dt(){return`
    <div class="guide-demo">
      <div class="guide-demo__lane">
        <span class="guide-demo__label">Batter pick</span>
        <div class="guide-demo__value">4</div>
      </div>
      <div class="guide-demo__divider">Reveal together</div>
      <div class="guide-demo__lane">
        <span class="guide-demo__label">Bowler pick</span>
        <div class="guide-demo__value">2</div>
      </div>
      <div class="guide-demo__result is-run">
        <strong>Runs scored</strong>
        <span>+4</span>
      </div>
    </div>
  `}function ft(){return`
    <div class="guide-demo">
      <div class="guide-demo__lane">
        <span class="guide-demo__label">Batter pick</span>
        <div class="guide-demo__value">6</div>
      </div>
      <div class="guide-demo__divider">Same number</div>
      <div class="guide-demo__lane">
        <span class="guide-demo__label">Bowler pick</span>
        <div class="guide-demo__value">6</div>
      </div>
      <div class="guide-demo__result is-out">
        <strong>Wicket falls</strong>
        <span>OUT</span>
      </div>
    </div>
  `}function pt(t){return`
    <section class="rules-page">
      ${G({kicker:`How To Play`,title:`Learn MH Handrex in one smooth walkthrough`,className:`card--hero rules-hero`,content:`
          <p class="rules-hero__lede">
            MH Handrex is hand cricket with realtime tension. Two sides lock numbers from the active number set,
            both picks stay hidden, and the reveal decides whether the batter survives or the wicket falls.
          </p>
          <div class="rules-hero__pills">
            <span class="guide-pill">Classic 1-6 by default</span>
            <span class="guide-pill">Hidden picks</span>
            <span class="guide-pill">Realtime reveal</span>
            <span class="guide-pill">Room play from 1v1 to 11v11</span>
          </div>
          <div class="action-row">
            ${e({label:`Quick Match`,action:`quick-match`})}
            ${e({label:`Create Room`,action:`create-room`,variant:`secondary`})}
            ${e({label:`Back Home`,action:`navigate`,variant:`ghost`,attrs:{"data-route":`home`}})}
          </div>
        `})}

      <div class="grid-two">
        ${G({kicker:`One Ball`,title:`This is the entire core rule`,content:`
            <div class="guide-stack">
              ${J(`1`,`Both sides choose a number`,`The active batter and current bowler each pick from the room's active number set.`)}
              ${J(`2`,`Both picks stay hidden`,`No one sees the result until both numbers are locked in.`)}
              ${J(`3`,`The reveal decides the ball`,`Match means OUT. Different numbers means the batter scores the chosen runs.`)}
            </div>
          `})}
        ${G({kicker:`Visual Example`,title:`If the numbers are different`,content:`
            ${dt()}
            <p class="muted">The batter chose 4, the bowler chose 2, so the batting side scores 4 runs.</p>
          `})}
      </div>

      <div class="grid-two">
        ${G({kicker:`Wicket Rule`,title:`If both sides pick the same number`,content:`
            ${ft()}
            <p class="muted">A matching number always dismisses the striker. In single mode the next batter arrives. In two-batsmen mode the non-striker stays.</p>
          `})}
        ${G({kicker:`Strike Logic`,title:`Who faces the next ball`,content:`
            <div class="guide-stack">
              ${J(`A`,`Odd runs rotate strike`,`In two-batsmen mode, 1, 3, and 5 swap striker and non-striker.`)}
              ${J(`B`,`Even runs keep strike`,`2, 4, and 6 keep the same striker on the next legal ball.`)}
              ${J(`C`,`Over end rotates strike`,`After 6 legal balls, the over ends, strike changes, and the next bowler takes over.`)}
            </div>
          `})}
      </div>

      <div class="grid-two">
        ${G({kicker:`Match Journey`,title:`From room to winner`,content:`
            <div class="guide-journey">
              ${J(`01`,`Create or join a room`,`Share the room code or invite link and fill both teams.`)}
              ${J(`02`,`Ready up in the lobby`,`The host sets match settings, captains are chosen, and everyone marks ready.`)}
              ${J(`03`,`Run the toss`,`Captains decide which side bats first and move into lineup control.`)}
              ${J(`04`,`Play the innings`,`Each legal ball updates score, wickets, strike, over count, and chase pressure.`)}
              ${J(`05`,`Finish and review`,`See the winner, innings summary, player stats, and ball-by-ball history.`)}
            </div>
          `})}
        ${G({kicker:`Ways To Play`,title:`Choose the match style before you start`,content:`
            <div class="guide-tile-grid">
              ${Y(`Single batsman`,`One active batter at a time. Every wicket brings in the next player.`,`Best for simpler flow`)}
              ${Y(`Two batsmen`,`Striker and non-striker stay active. Odd runs and over end rotate strike.`,`Feels closer to cricket`)}
              ${Y(`Free-change bowling`,`Captain can change bowler whenever the rules allow during the innings.`,`Flexible captain control`)}
              ${Y(`Over-locked bowling`,`The current bowler stays for all 6 balls of the over.`,`More structured match rhythm`)}
            </div>
          `})}
      </div>

      <div class="grid-two">
        ${G({kicker:`Captain Control`,title:`What captains manage`,content:`
            <div class="guide-stack">
              ${J(`1`,`Set batting order`,`Arrange who walks in first and who remains in the queue behind them.`)}
              ${J(`2`,`Set bowling order`,`Choose the opening bowler and the sequence that follows.`)}
              ${J(`3`,`Adjust during the innings`,`Remaining batters can be reshuffled, and bowlers can be changed if the bowling mode allows it.`)}
            </div>
          `})}
        ${G({kicker:`How You Win`,title:`When the match ends`,content:`
            <div class="guide-endings">
              <article class="guide-ending">
                <strong>All out</strong>
                <p>The batting side runs out of available players before reaching the target or before overs finish.</p>
              </article>
              <article class="guide-ending">
                <strong>Overs complete</strong>
                <p>The innings ends when the legal ball limit is reached.</p>
              </article>
              <article class="guide-ending">
                <strong>Target achieved</strong>
                <p>In the chase, the match ends immediately once the batting side reaches the target.</p>
              </article>
            </div>
          `})}
      </div>

      <div class="grid-two">
        ${G({kicker:`During Live Play`,title:`What to watch on the match screen`,content:`
            <div class="guide-tile-grid">
              ${Y(`Scoreboard`,`Shows runs, wickets, overs, target, required runs, and balls left.`,`Top of screen`)}
              ${Y(`Turn signal`,`Tells you whether it is your turn or you are waiting for the opponent.`,`Center feedback`)}
              ${Y(`Hidden picks`,`Numbers stay locked and private until both sides have submitted.`,`Fair reveal`)}
              ${Y(`Ball history`,`Recent balls and result trail stay visible so the match never feels confusing.`,`Always traceable`)}
            </div>
          `})}
        ${G({kicker:`Good To Know`,title:`Small rules that matter`,content:`
            <ul class="feature-list">
              <li>The batter's number is the run value whenever the bowler picks something different.</li>
              <li>Only the active striker and active bowler submit numbers for the current ball.</li>
              <li>In two-batsmen mode, a wicket only removes the striker. The non-striker stays.</li>
              <li>The second innings always chases first innings score plus one.</li>
              <li>If the page reloads during a live match, the app tries to restore you back into the same room session.</li>
            </ul>
          `})}
      </div>

      ${G({kicker:`Ready To Play`,title:`Start simple, then scale up`,content:`
          <div class="rules-footer">
            <p>
              Start with a quick 1v1 to learn the rhythm. Once the reveal-and-response flow clicks,
              move into bigger rooms, captain lineups, and full chase pressure.
            </p>
            <div class="action-row">
              ${e({label:`Start Quick Match`,action:`quick-match`})}
              ${e({label:`Open History`,action:`navigate`,variant:`secondary`,attrs:{"data-route":`history`}})}
            </div>
          </div>
        `})}
    </section>
  `}function mt(t){let n=t.room?.tossResult??null;if(!t.room?.teams.alpha||!t.room.teams.beta)return``;let r=t.session.localPlayerId,i=t.room.captains.alpha===r,a=t.room.captains.beta===r,o=i||a,s=n?t.room.captains[n.winnerTeamId]:null,c=!!(n&&!n.decision&&s===r),l=n?t.room.teams[n.winnerTeamId]?.name??n.winnerTeamId:``,u=`
    <div class="coin-stage">
      <div class="coin ${n?`is-flipped`:``}">
        <span>MH</span>
      </div>
    </div>
  `;return n?n.decision?u+=`
      <div class="toss-result">
        <p class="eyebrow">Toss Finalized</p>
        <h3>${l} chose to ${n.decision}</h3>
        <p class="centered">Lineups are opening for the full room now.</p>
      </div>
    `:u+=`
      <div class="toss-result">
        <p class="eyebrow">Coin landed on ${n.coinFace}</p>
        <h3>${l} won the toss</h3>
        <p>The winning captain now chooses whether to bat or bowl first. All players are synced to this result.</p>
        ${c?`
                <div class="action-row action-row--center">
                  ${e({label:`Bat First`,action:`choose-toss`,attrs:{"data-decision":`bat`}})}
                  ${e({label:`Bowl First`,action:`choose-toss`,variant:`secondary`,attrs:{"data-decision":`bowl`}})}
                </div>
              `:`
                <p class="warning-text centered">
                  ${o?`Waiting for the toss-winning captain to choose bat or bowl.`:`Waiting for the toss-winning captain. You will move to lineups automatically.`}
                </p>
              `}
      </div>
    `:u+=`
      <p class="centered">Both captains are on toss duty. Alpha captain calls heads or tails while everyone else waits for the reveal.</p>
      ${i?`
              <div class="action-row action-row--center">
                ${e({label:`Heads`,action:`run-toss`,attrs:{"data-call":`heads`}})}
                ${e({label:`Tails`,action:`run-toss`,variant:`secondary`,attrs:{"data-call":`tails`}})}
              </div>
            `:`
              <p class="warning-text centered">
                ${o?`Waiting for Alpha captain to make the call.`:`Captains are handling the toss. The result will appear here for everyone.`}
              </p>
            `}
    `,`
    <section class="page-stack">
      ${G({kicker:`Toss`,title:`Coin Flip`,className:`card--hero`,content:u})}
      ${G({kicker:`Flow`,title:`How this stage works`,content:`
          <ul class="feature-list">
            <li>Alpha captain makes the heads-or-tails call for the room.</li>
            <li>The toss-winning captain chooses whether to bat or bowl first.</li>
            <li>Once that choice is locked, everyone moves together into lineups.</li>
          </ul>
        `})}
    </section>
  `}var ht={[P.HOME]:Be,[P.ROOM]:ut,[P.LOBBY]:Ge,[P.DRAFT]:Le,[P.TOSS]:mt,[P.LINEUP]:Ve,[P.MATCH]:st,[P.RESULT]:lt,[P.HISTORY]:Re,[P.RULES]:pt};function gt(e,t,n){let r=[...e],i=n===`up`?t-1:t+1;return i<0||i>=r.length||([r[t],r[i]]=[r[i],r[t]]),r}var _t=class{constructor({root:e,store:t,roomService:n,matchService:r,signalSystem:i,socket:a}){this.root=e,this.store=t,this.roomService=n,this.matchService=r,this.signalSystem=i,this.socket=a,this.renderedRoute=``}mount(){this.root.addEventListener(`click`,e=>this.handleClick(e)),this.root.addEventListener(`change`,e=>this.handleChange(e)),this.root.addEventListener(`input`,e=>this.handleInput(e)),this.root.addEventListener(`keydown`,e=>this.handleKeyDown(e)),this.store.subscribe(()=>this.render()),this.render()}render(){let e=this.store.getState(),t=(ht[e.route]??ht.home)(e),n=i({route:e.route,content:t,connection:e.connection,ui:e.ui}),r=()=>{this.root.innerHTML=n,this.renderedRoute=e.route},a=document;if(this.renderedRoute&&this.renderedRoute!==e.route&&typeof a.startViewTransition==`function`){a.startViewTransition(()=>{r()});return}r()}handleClick(e){let t=e.target instanceof HTMLElement?e.target.closest(`[data-action]`):null;if(!t)return;let n=t.dataset.action,r=this.store.getState();switch(n){case`navigate`:this.store.dispatch({type:W.NAVIGATE,payload:t.dataset.route||`home`});break;case`quick-match`:this.roomService.startQuickMatch({teamSize:r.ui.playersPerTeam});break;case`create-room`:this.roomService.createRoom({playerName:r.session.profileName,teamSize:r.ui.playersPerTeam});break;case`join-room`:this.roomService.joinRoom({playerName:r.session.profileName,code:r.ui.roomCodeInput.trim().toUpperCase()});break;case`practice-mode`:this.roomService.startPracticeMode();break;case`enter-lobby`:this.roomService.enterLobby();break;case`toggle-ready`:this.roomService.toggleReady();break;case`copy-invite`:this.roomService.copyInviteLink();break;case`remove-player`:this.roomService.removePlayer(t.dataset.player||``);break;case`set-player-team`:this.roomService.setPlayerTeam(t.dataset.player||``,t.dataset.team||null);break;case`discard-room`:if(!r.room)break;this.store.dispatch({type:W.PATCH_UI,payload:{confirmDialog:{title:r.room.source===`offline`?`Discard Practice Room`:`Discard Room`,message:r.room.source===`offline`?`Discard this practice room and return home?`:`Discard room ${r.room.code}? This will remove every player from the room.`,confirmLabel:`Discard`,cancelLabel:`Keep Room`,intent:`discard-room`}}});break;case`cancel-dialog`:this.store.dispatch({type:W.PATCH_UI,payload:{confirmDialog:null}});break;case`confirm-dialog`:{let e=r.ui.confirmDialog?.intent??null;this.store.dispatch({type:W.PATCH_UI,payload:{confirmDialog:null}}),e===`discard-room`&&(this.matchService.clearTimers(),this.roomService.discardRoom());break}case`auto-draft`:this.roomService.autoDraftTeams();break;case`open-draft`:this.roomService.openDraftBoard();break;case`open-signal-sheet`:this.signalSystem.openSheet();break;case`close-signal-sheet`:this.signalSystem.closeSheet();break;case`send-signal`:this.signalSystem.sendSignal(t.dataset.signal||``);break;case`send-custom-signal`:{let e=this.root.querySelector(`[data-signal-input='custom']`);this.signalSystem.sendCustomSignal(e?.value??``);break}case`draft-pick`:this.roomService.pickDraftPlayer(t.dataset.player||``);break;case`start-toss`:this.matchService.startToss();break;case`run-toss`:this.matchService.runToss(t.dataset.call||`heads`);break;case`choose-toss`:this.matchService.chooseTossDecision(t.dataset.decision||`bat`);break;case`start-match`:this.roomService.lockLineups(),this.matchService.confirmLineupsAndStart();break;case`move-lineup`:this.handleLineupMove(t);break;case`pick-number`:if(!r.ui.isPaused){let e=t.dataset.side||`batting`;this.matchService.submitSelection(e,Number(t.dataset.value),{previewOnly:!0})}break;case`lock-number`:if(!r.ui.isPaused){let e=t.dataset.side||`batting`,n=r.ui.selectedPicks?.[e];this.matchService.submitSelection(e,Number(n))}break;case`apply-number-set`:this.roomService.updateSettings(r.ui.numberSetDraft??r.room?.settings??{});break;case`choose-number-preset`:this.store.dispatch({type:W.PATCH_UI,payload:{numberSetDraft:{...r.ui.numberSetDraft??r.room?.settings??{},numberSetMode:`preset`,numberSetPreset:t.dataset.preset||`classic`},numberSetValidationError:``}});break;case`change-bowler`:this.matchService.changeBowler(t.dataset.team||``,t.dataset.player||``);break;case`toggle-pause`:this.matchService.togglePause();break;case`simulate-reconnect`:this.matchService.simulateReconnect();break;case`back-home`:this.matchService.clearTimers(),this.roomService.resetToHome();break;case`dismiss-toast`:this.store.dispatch({type:W.DISMISS_TOAST,payload:t.dataset.id});break;default:break}}handleLineupMove(e){let t=e.dataset.team||`alpha`,n=e.dataset.type||`batting`,r=Number(e.dataset.index),i=e.dataset.direction||`up`,a=this.store.getState();if(a.route===`lineup`&&a.room?.teams[t]){let e=a.room.teams[t][n===`batting`?`battingOrder`:`bowlingOrder`];this.roomService.updateTeamLineup(t,n,gt(e,r,i));return}if(a.route===`match`&&a.match){let e=a.match.teams[t];if(n===`bowling`){this.matchService.reorderBowlers(t,gt(e.bowlingOrder,r,i));return}let o=a.match.innings[a.match.currentInningsIndex],s=e.battingOrder.filter(e=>![o.strikerId,o.nonStrikerId,...o.dismissedIds].includes(e));this.matchService.reorderBatters(t,gt(s,r,i))}}handleChange(e){let t=e.target instanceof HTMLElement?e.target:null;if(!t?.dataset.field)return;let n=t.dataset.field,r=t.value,i=this.store.getState();switch(n){case`profile-name`:this.store.dispatch({type:W.UPDATE_SESSION,payload:{profileName:r}});break;case`room-code`:this.store.dispatch({type:W.PATCH_UI,payload:{roomCodeInput:r.toUpperCase()}});break;case`match-mode`:this.roomService.updateSettings({matchMode:r});break;case`bowling-mode`:this.roomService.updateSettings({bowlingMode:r});break;case`overs`:this.roomService.updateSettings({overs:Number(r)});break;case`ai-difficulty`:this.roomService.updateSettings({aiDifficulty:r});break;case`number-set-mode`:this.store.dispatch({type:W.PATCH_UI,payload:{numberSetDraft:{...i.ui.numberSetDraft??i.room?.settings??{},numberSetMode:r},numberSetValidationError:``}});break;case`number-set-preset`:this.store.dispatch({type:W.PATCH_UI,payload:{numberSetDraft:{...i.ui.numberSetDraft??i.room?.settings??{},numberSetMode:`preset`,numberSetPreset:r},numberSetValidationError:``}});break;case`number-range-min`:this.store.dispatch({type:W.PATCH_UI,payload:{numberSetDraft:{...i.ui.numberSetDraft??i.room?.settings??{},numberSetMode:`range`,numberRangeMin:Number(r)},numberSetValidationError:``}});break;case`number-range-max`:this.store.dispatch({type:W.PATCH_UI,payload:{numberSetDraft:{...i.ui.numberSetDraft??i.room?.settings??{},numberSetMode:`range`,numberRangeMax:Number(r)},numberSetValidationError:``}});break;case`custom-numbers`:this.store.dispatch({type:W.PATCH_UI,payload:{numberSetDraft:{...i.ui.numberSetDraft??i.room?.settings??{},numberSetMode:`custom`,customNumbersText:r},numberSetValidationError:``}});break;case`players-per-team`:this.store.dispatch({type:W.PATCH_UI,payload:{playersPerTeam:Number(r)}});break;case`captain-alpha`:this.roomService.setCaptain(`alpha`,r);break;case`captain-beta`:this.roomService.setCaptain(`beta`,r);break;case`team-name-alpha`:this.roomService.updateTeamName(`alpha`,r);break;case`team-name-beta`:this.roomService.updateTeamName(`beta`,r);break;default:break}}handleInput(e){let t=(e.target instanceof HTMLElement?e.target:null)?.dataset.field??``;(t===`number-range-min`||t===`number-range-max`||t===`custom-numbers`)&&this.handleChange(e)}handleKeyDown(e){let t=e.target instanceof HTMLElement?e.target:null;if(!t?.matches(`[data-signal-input='custom']`)||e.key!==`Enter`||e.shiftKey)return;e.preventDefault();let n=t;this.signalSystem.sendCustomSignal(n?.value??``)}};function vt(e,t){let n=!1,r=e=>{let n=e.replace(/^#\/?/,``)||`home`;return t[n]?n:`home`};window.addEventListener(`hashchange`,()=>{n||e.dispatch({type:W.NAVIGATE,payload:r(window.location.hash)})}),e.subscribe(e=>{let t=`#/${e.route}`;window.location.hash!==t&&(n=!0,window.location.hash=t,window.setTimeout(()=>{n=!1},0))}),e.dispatch({type:W.NAVIGATE,payload:r(window.location.hash)})}function yt(){let e=Ee(),t=je(),n=typeof window<`u`?new URLSearchParams(window.location.search).get(`room`)?.trim().toUpperCase()??``:``;return{route:P.HOME,session:e,ui:{roomCodeInput:n||e.lastRoomCode||``,tossCall:`heads`,playersPerTeam:B.playersPerTeam,connectionBanner:`Realtime room service ready`,selectedNumberSide:null,selectedPicks:{batting:null,bowling:null},numberSetDraft:null,numberSetValidationError:``,isPaused:!1,signalSheetOpen:!1,signalCooldownUntil:0,signalHighlightUntil:0,incomingSignal:null,confirmDialog:null,toasts:[]},connection:{status:L.RECONNECTING,lastSyncAt:null,latencyMs:28,note:`Connecting to realtime backend`},room:null,match:null,history:Oe(),lastSavedMatch:t}}function bt(e,t){let n=e,r=new Set;return{getState(){return n},subscribe(e){return r.add(e),()=>r.delete(e)},dispatch(e){return n=t(n,e),r.forEach(e=>e(n)),e}}}function xt(e,t){return e===t}function St(e){return e%2==1}function Ct(e,t){return Math.max(t*6-e,0)}function wt(e,t){return e>=Math.max(t,1)}function Tt(e,t){return e.length===t.length&&e.every(e=>t.includes(e))&&new Set(e).size===e.length}function X(e,t=y().allowedNumbers){return C(e,t)}function Et(e,t,n){if(e.phase!==I.LIVE)return!1;let r=e.innings[e.currentInningsIndex],i=r.bowlingTeamId===`alpha`?`alpha`:`beta`,a=e.teams[i];return!(r.bowlingTeamId!==t||!a.playerIds.includes(n)||r.pendingChoices.batting||r.pendingChoices.bowling||e.settings.bowlingMode===_e.LOCKED&&r.scoreboard.ballsInOver!==0)}function Dt(e,t,n){if(e.phase!==I.LIVE)return!1;let r=e.innings[e.currentInningsIndex];if(r.battingTeamId!==t)return!1;let i=e.teams[t===`alpha`?`alpha`:`beta`],a=[r.strikerId,r.nonStrikerId,...r.dismissedIds].filter(Boolean),o=i.battingOrder.filter(e=>!a.includes(e));return o.length===n.length&&n.every(e=>o.includes(e))&&new Set(n).size===n.length}function Ot(e,t,n){if(e.phase!==I.LIVE)return!1;let r=e.innings[e.currentInningsIndex],i=e.teams[t===`alpha`?`alpha`:`beta`];return!(r.bowlingTeamId!==t||!Tt(n,i.playerIds)||r.pendingChoices.batting||r.pendingChoices.bowling||e.settings.bowlingMode===_e.LOCKED&&r.scoreboard.ballsInOver!==0)}function kt(e){let t=Object.fromEntries(e.playerIds.map(e=>[e,{runs:0,ballsFaced:0,wicketsTaken:0,ballsBowled:0,dismissals:0}]));return{...a(e),currentBowlerId:null,stats:t}}function Z(e,t){return t===R.ALPHA?e.alpha:e.beta}function Q(e){return e.innings[e.currentInningsIndex]}function At(e,t){let n=[];return X(e.pendingChoices.batting?.value??null,t)&&n.push(`batting`),X(e.pendingChoices.bowling?.value??null,t)&&n.push(`bowling`),n}function jt(e={}){return{status:`idle`,waitingFor:null,lockedSides:[],revealAt:null,cycleId:0,lastBall:null,...e}}function Mt(e){return e.phase===I.LIVE&&!Q(e).completed}function Nt(e,t){e.overs=Math.floor(e.legalBalls/6),e.ballsLeft=Ct(e.legalBalls,t.overs),e.target&&(e.requiredRuns=Math.max(e.target-e.runs,0))}function Pt(e,t){t.matchMode===ge.TWO_BATSMEN&&(!e.strikerId||!e.nonStrikerId||([e.strikerId,e.nonStrikerId]=[e.nonStrikerId,e.strikerId]))}function Ft(e,t){let n=t.battingOrder[e.nextBatterIndex]??null;return n?(e.nextBatterIndex+=1,e.strikerId=n,n):e.nonStrikerId?(e.strikerId=e.nonStrikerId,e.nonStrikerId=null,e.strikerId):(e.strikerId=null,null)}function It(e,t){let n=t.bowlingOrder;if(!n.length)return e.currentBowlerId=null,t.currentBowlerId=null,null;let r=n[e.nextBowlerIndex%n.length]??n[0];return e.currentBowlerId=r,t.currentBowlerId=r,e.nextBowlerIndex=(e.nextBowlerIndex+1)%n.length,r}function Lt(e,t,n,r,i){let a=Z(e,t),o=Z(e,n),s=a.battingOrder[0]??null,c=r.matchMode===ge.TWO_BATSMEN?a.battingOrder[1]??null:null,l=o.bowlingOrder[0]??null;o.currentBowlerId=l;let u={battingTeamId:t,bowlingTeamId:n,scoreboard:{runs:0,wickets:0,legalBalls:0,overs:0,ballsInOver:0,target:i,requiredRuns:i,ballsLeft:r.overs*6},strikerId:s,nonStrikerId:c,currentBowlerId:l,nextBatterIndex:r.matchMode===ge.TWO_BATSMEN?2:1,nextBowlerIndex:1,dismissedIds:[],completed:!1,pendingChoices:{batting:null,bowling:null}};return Nt(u.scoreboard,r),u}function Rt(e,t){let n=t.scoreboard.runs+1,r=e.innings[1];r.scoreboard.target=n,r.scoreboard.requiredRuns=n,r.scoreboard.ballsLeft=e.settings.overs*6,Nt(r.scoreboard,e.settings),e.currentInningsIndex=1,e.phase=I.BREAK}function zt(e){let t=a(e),n=t.innings[0],r=t.innings[1],i=n.battingTeamId===R.ALPHA?n.scoreboard.runs:r.scoreboard.runs,o=n.battingTeamId===R.BETA?n.scoreboard.runs:r.scoreboard.runs,s;if(i===o)s={winnerTeamId:null,marginText:`Match tied`,reason:`Scores level`,summary:`Both teams finished on the same score.`,isTie:!0};else{let e=i>o?R.ALPHA:R.BETA,n=e===R.ALPHA?R.BETA:R.ALPHA,r=Z(t.teams,e),a=Z(t.teams,n),c=t.innings[1],l=!!(c.scoreboard.target&&c.scoreboard.runs>=c.scoreboard.target),u=Math.max(r.playerIds.length-c.scoreboard.wickets,0),d=Math.abs(i-o);s={winnerTeamId:e,marginText:l?`${r.name} won by ${u} wicket${u===1?``:`s`}`:`${r.name} won by ${d} run${d===1?``:`s`}`,reason:l?`Target chased`:`Defended total`,summary:`${r.name} beat ${a.name}.`,isTie:!1}}return t.result=s,t.phase=I.COMPLETE,t.updatedAt=Date.now(),t}function Bt(e){if(!Mt(e))return e;let t=a(e),n=Q(t),r=Z(t.teams,n.bowlingTeamId);return n.scoreboard.ballsInOver<6?t:(n.scoreboard.ballsInOver=0,Pt(n,t.settings),It(n,r),t.updatedAt=Date.now(),t)}function Vt(e){let t=a(e),n=Q(t),r=Z(t.teams,n.battingTeamId),i=wt(n.scoreboard.wickets,r.playerIds.length),o=n.scoreboard.legalBalls>=t.settings.overs*6,s=!!(n.scoreboard.target&&n.scoreboard.runs>=n.scoreboard.target);return!i&&!o&&!s?(t.phase=I.LIVE,t.updatedAt=Date.now(),t):(n.completed=!0,t.currentInningsIndex===0?(Rt(t,n),t.updatedAt=Date.now(),t):zt(t))}function Ht(e){let t=a(e);return t.phase=I.LIVE,t.revealState=jt({cycleId:t.revealState.cycleId+1,lastBall:t.revealState.lastBall}),t.updatedAt=Date.now(),t}function Ut(e,t){if(!e.teams.alpha||!e.teams.beta)throw Error(`Cannot start match without two drafted teams.`);let n=S(e.settings,e.settings),r={...a(e.settings),...n.ok?n.settings:S({},{}).settings},i={alpha:kt(e.teams.alpha),beta:kt(e.teams.beta)},o=t.decision===`bat`?t.winnerTeamId:t.winnerTeamId===R.ALPHA?R.BETA:R.ALPHA,s=o===R.ALPHA?R.BETA:R.ALPHA;return{id:q(`match`),roomId:e.id,phase:I.LIVE,settings:r,teams:i,tossResult:a(t),innings:[Lt(i,o,s,r,null),Lt(i,s,o,r,null)],currentInningsIndex:0,revealState:jt(),ballEvents:[],result:null,updatedAt:Date.now()}}function Wt(e,t,n){let r=a(e),i=Q(r);i.pendingChoices[t]=n;let o=At(i,r.settings.allowedNumbers);return r.revealState={...r.revealState,status:o.length===2?`locked`:o.length===1?`waiting`:`idle`,waitingFor:o.length===1?o[0]===`batting`?`bowling`:`batting`:null,lockedSides:o,revealAt:null},r.updatedAt=Date.now(),r}function Gt(e,t={}){let n=a(e),r=At(Q(n),n.settings.allowedNumbers);return n.revealState={...n.revealState,lockedSides:r,waitingFor:r.length===1?r[0]===`batting`?`bowling`:`batting`:null,...t},n.updatedAt=Date.now(),n}function Kt(e){let t=a(e);return t.revealState=jt({cycleId:t.revealState.cycleId+1,lastBall:t.revealState.lastBall}),t.updatedAt=Date.now(),t}function qt(e){let t=a(e),n=Q(t);return n.pendingChoices={batting:null,bowling:null},t.revealState=jt({cycleId:t.revealState.cycleId+1,lastBall:t.revealState.lastBall}),t.updatedAt=Date.now(),t}function Jt(e,t,n){if(!Mt(e)||!X(t,e.settings.allowedNumbers)||!X(n,e.settings.allowedNumbers))return e;let r=a(e),i=Q(r),o=Z(r.teams,i.battingTeamId),s=Z(r.teams,i.bowlingTeamId),c=i.strikerId,l=i.nonStrikerId,u=i.currentBowlerId,d=Math.floor(i.scoreboard.legalBalls/6),f=i.scoreboard.ballsInOver+1,p=xt(t,n),m=p?0:t,h=E({battingNumber:t,bowlingNumber:n,runs:m,isWicket:p,allowedNumbers:r.settings.allowedNumbers});if(!c||!u)return Vt(r);o.stats[c].ballsFaced+=1,s.stats[u].ballsBowled+=1,p?(i.scoreboard.wickets+=1,o.stats[c].dismissals+=1,i.dismissedIds.push(c),s.stats[u].wicketsTaken+=1,Ft(i,o)):(i.scoreboard.runs+=m,o.stats[c].runs+=m,St(m)&&Pt(i,r.settings)),i.scoreboard.legalBalls+=1,i.scoreboard.ballsInOver+=1,Nt(i.scoreboard,r.settings);let g={inningsIndex:r.currentInningsIndex,over:d,ball:f,battingNumber:t,bowlingNumber:n,resultType:p?`wicket`:m===0?`dot`:`run`,runs:m,shotLabel:h.shotLabel,resultLabel:h.resultLabel,resultTone:h.resultTone,strikerId:c,nonStrikerId:l,bowlerId:u,battingTeamId:i.battingTeamId,bowlingTeamId:i.bowlingTeamId,timestamp:Date.now(),commentary:h.commentary};r.ballEvents.push(g),r.revealState.lastBall=g,i.pendingChoices={batting:null,bowling:null};let _=Vt(r);if(_.phase!==I.LIVE)return _.revealState.lastBall=g,_.updatedAt=Date.now(),_;if(Q(_).scoreboard.ballsInOver===6){let e=Bt(_);return e.revealState.lastBall=g,e.updatedAt=Date.now(),e}return _.revealState.lastBall=g,_.phase=I.LIVE,_.updatedAt=Date.now(),_}function Yt(e,t,n){if(!Dt(e,t,n))return e;let r=a(e),i=Q(r),o=Z(r.teams,t),s=new Set([i.strikerId,i.nonStrikerId,...i.dismissedIds].filter(Boolean)),c=[...n];return o.battingOrder=o.battingOrder.map(e=>s.has(e)?e:c.shift()??e),r.updatedAt=Date.now(),r}function Xt(e,t,n){if(!Et(e,t,n))return e;let r=a(e),i=Q(r),o=Z(r.teams,t);i.currentBowlerId=n,o.currentBowlerId=n;let s=o.bowlingOrder.indexOf(n);return i.nextBowlerIndex=s===-1?i.nextBowlerIndex:(s+1)%o.bowlingOrder.length,r.updatedAt=Date.now(),r}function Zt(e,t,n){if(!Ot(e,t,n))return e;let r=a(e),i=Q(r),o=Z(r.teams,t),s=o.currentBowlerId&&n.includes(o.currentBowlerId)?o.currentBowlerId:n[0]??null,c=s?n.indexOf(s):-1;return o.bowlingOrder=[...n],o.currentBowlerId=s,i.currentBowlerId=s,i.nextBowlerIndex=n.length?(c+1+n.length)%n.length:0,r.updatedAt=Date.now(),r}function Qt(e,t){return{id:q(`history`),roomCode:t,playedAt:Date.now(),result:a(e.result),tossResult:a(e.tossResult),settings:a(e.settings),numberSetLabel:e.settings.numberSetLabel??`Classic 1-6`,allowedNumbers:[...e.settings.allowedNumbers??[1,2,3,4,5,6]],insights:M(e,e.ballEvents,e.settings.allowedNumbers),inningsSummary:e.innings.map(e=>({teamId:e.battingTeamId,runs:e.scoreboard.runs,wickets:e.scoreboard.wickets,oversText:N(e.scoreboard.legalBalls)}))}}function $t(e){return be.filter(t=>!e.includes(t))[0]??`Player ${e.length+1}`}function en(e,t){let n=$t(t);return t.push(n),{id:q(`mock-${e+1}`),name:n,isHost:!1,isLocal:!1,isMock:!0,role:`player`,status:`joining`,avatarSeed:`${n.toLowerCase()}-${e}`,connectionState:{status:`connected`,lastSyncAt:Date.now(),latencyMs:s(26,72),note:`Mock network`}}}function tn(e,t){let n=[t];return Array.from({length:e},(e,t)=>en(t,n))}function nn(){let[e,t]=o(ye).slice(0,2);return{alpha:e,beta:t}}function rn(){return s(Se.AI_PICK_MIN,Se.AI_PICK_MAX)}var an=rn;function on(e){let t=e.filter(e=>e.weight>0),n=t.reduce((e,t)=>e+t.weight,0),r=Math.random()*n;for(let e of t)if(r-=e.weight,r<=0)return e.value;return t[t.length-1]?.value??e[0]?.value??1}function sn(e,t,n){let r=new Set(t.filter(t=>e.includes(t)));return on(e.map(e=>({value:e,weight:r.has(e)?n:1})))}function cn(e,t,n=e.settings.aiDifficulty||`medium`){let r=e.innings[e.currentInningsIndex],i=r.scoreboard.target?r.scoreboard.requiredRuns??0:0,a=[...Array.isArray(e.settings.allowedNumbers)&&e.settings.allowedNumbers.length?e.settings.allowedNumbers:y().allowedNumbers].sort((e,t)=>e-t),o=a.slice(0,Math.max(1,Math.ceil(a.length/2))),s=a.slice(Math.max(0,Math.floor(a.length/2))),l=n===`beginner`||n===`hard`?n:`medium`,u=k(e.ballEvents,`batting`,5),d=k(e.ballEvents,`bowling`,5),f=ae(u);if(l===`beginner`)return c(a);if(t===`bowling`){let e=[u.length>=2&&u[u.length-1]===u[u.length-2]?u[u.length-1]:null,f&&f.count>=2?f.number:null,r.scoreboard.ballsLeft<=6?c(s):null].filter(e=>e!=null),t=l===`hard`?.5:.3;return e.length&&Math.random()<t?sn(a,e,l===`hard`?5:3):c(a)}let p=u[u.length-1]??null,m=i>Math.max(12,a[a.length-1]??6),h=!r.scoreboard.target||i<=Math.max(6,a[Math.floor(a.length/2)]??3);return l===`medium`?c(m&&Math.random()<.45?s:h&&Math.random()<.35?[...o,a[Math.floor(a.length/2)]??o[0]]:a):on(a.map(e=>{let t=A(e,a),n=1;return e===p&&(n*=.45),d.includes(e)&&(n*=.85),m&&(t===`high`||t===`highest`)?n+=3:h&&(t===`low`||t===`mid`)?n+=1.6:t===`highest`&&(n+=.7),{value:e,weight:n}}))}function ln(e){return e.settings.overs<=2?`bowl`:c([`bat`,`bowl`])}function $(e){return e?.source===`offline`}function un(e,t){return t?!!e.players.find(e=>e.id===t&&!e.isLocal):!1}function dn(e,t){return{call:`heads`,coinFace:`heads`,winnerTeamId:t===R.ALPHA||t===R.BETA?t:R.ALPHA,decision:`bat`}}function fn(e){return{alpha:e.teams.alpha?{id:e.teams.alpha.id,name:e.teams.alpha.name,captainId:e.teams.alpha.captainId,playerIds:[...e.teams.alpha.playerIds],battingOrder:[...e.lineups?.alpha?.battingOrder??e.teams.alpha.battingOrder],bowlingOrder:[...e.lineups?.alpha?.bowlingOrder??e.teams.alpha.bowlingOrder]}:null,beta:e.teams.beta?{id:e.teams.beta.id,name:e.teams.beta.name,captainId:e.teams.beta.captainId,playerIds:[...e.teams.beta.playerIds],battingOrder:[...e.lineups?.beta?.battingOrder??e.teams.beta.battingOrder],bowlingOrder:[...e.lineups?.beta?.bowlingOrder??e.teams.beta.bowlingOrder]}:null}}var pn=1;function mn(e,t){let n=a(e),r=Number(t?.currentInningsIndex),i=Number(t?.legalBalls);if(!Number.isInteger(r)||r<0||r>=n.innings.length)return e;let o=e.innings[e.currentInningsIndex];if(r<e.currentInningsIndex||r===e.currentInningsIndex&&Number.isFinite(i)&&i<o.scoreboard.legalBalls)return e;n.currentInningsIndex=r;let s=n.innings[r],c=Number(t?.score),l=Number(t?.wickets),u=Number(t?.ballsInOver),d=t?.target==null?null:Number(t.target),f=!!t?.inputsLocked?.[t?.strikerId??``],p=!!t?.inputsLocked?.[t?.currentBowlerId??``],m=[];return s.battingTeamId=t?.battingTeamId??s.battingTeamId,s.bowlingTeamId=t?.bowlingTeamId??s.bowlingTeamId,s.strikerId=t?.strikerId??s.strikerId,s.nonStrikerId=t?.nonStrikerId??s.nonStrikerId,s.currentBowlerId=t?.currentBowlerId??s.currentBowlerId,Number.isFinite(c)&&(s.scoreboard.runs=c),Number.isFinite(l)&&(s.scoreboard.wickets=l),Number.isFinite(i)&&(s.scoreboard.legalBalls=i,s.scoreboard.overs=Math.floor(i/6),s.scoreboard.ballsLeft=Math.max(n.settings.overs*6-i,0)),Number.isFinite(u)&&(s.scoreboard.ballsInOver=u),s.scoreboard.target=d,s.scoreboard.requiredRuns=d==null?null:Math.max(d-s.scoreboard.runs,0),s.completed=!!(!t?.inningsSwitched&&s.completed),s.pendingChoices={batting:f?{controller:`manual`,playerId:s.strikerId,teamId:s.battingTeamId,value:pn,lockedAt:Date.now()}:null,bowling:p?{controller:`manual`,playerId:s.currentBowlerId,teamId:s.bowlingTeamId,value:pn,lockedAt:Date.now()}:null},f&&m.push(`batting`),p&&m.push(`bowling`),n.teams[s.bowlingTeamId].currentBowlerId=s.currentBowlerId,n.phase!==I.COMPLETE&&n.revealState.status!==`revealing`&&(n.phase=t?.inningsSwitched?I.BREAK:I.LIVE,n.revealState={...n.revealState,status:m.length===2?`locked`:m.length===1?`waiting`:`idle`,waitingFor:m.length===1?m[0]===`batting`?`bowling`:`batting`:null,lockedSides:m,revealAt:m.length===2?Date.now()+H.REVEAL_LOCK:null}),n.updatedAt=Date.now(),n}function hn(e){let t=Number(e?.over),n=Number(e?.ball);return!Number.isInteger(t)||!Number.isInteger(n)||n<1||n>6?null:t*6+n}function gn(e){let t=e?.resultType===`out`,n=e?.runs??0,r=E({battingNumber:e?.battingNumber??0,bowlingNumber:e?.bowlingNumber??0,runs:n,isWicket:t,allowedNumbers:e?.allowedNumbers??e?.settings?.allowedNumbers??[]});return{inningsIndex:e?.inningsIndex??0,over:e?.over??0,ball:e?.ball??1,battingNumber:e?.battingNumber??0,bowlingNumber:e?.bowlingNumber??0,resultType:t?`wicket`:n?`run`:`dot`,runs:n,shotLabel:e?.shotLabel??r.shotLabel,resultLabel:e?.resultLabel??r.resultLabel,resultTone:e?.resultTone??r.resultTone,strikerId:e?.strikerId??null,nonStrikerId:e?.nonStrikerId??null,bowlerId:e?.currentBowlerId??null,battingTeamId:e?.battingTeamId??R.ALPHA,bowlingTeamId:e?.bowlingTeamId??R.BETA,timestamp:e?.timestamp??Date.now(),commentary:e?.commentary??r.commentary}}function _n(e,t,n,r){let i=new Set([t,n].filter(Boolean)),a=[];return e.forEach(e=>{a.length>=r||i.has(e)||a.push(e)}),a}function vn(e,t){let n=a(e),r=Array.isArray(t?.innings)?t.innings:[],i=n.settings.overs*6;return n.currentInningsIndex=Number.isInteger(Number(t?.currentInningsIndex))&&Number(t.currentInningsIndex)>=0?Number(t.currentInningsIndex):n.currentInningsIndex,n.ballEvents=Array.isArray(t?.ballHistory)?t.ballHistory.map(e=>gn(e)):n.ballEvents,n.result=t?.result??null,n.phase=t?.status===`complete`||n.result?I.COMPLETE:I.LIVE,r.forEach((e,t)=>{let r=n.innings[t];if(!r)return;let a=n.teams[e?.battingTeamId??r.battingTeamId],o=n.teams[e?.bowlingTeamId??r.bowlingTeamId],s=Number(e?.legalBalls),c=Number(e?.score),l=Number(e?.wickets),u=Number(e?.ballsInOver),d=e?.target==null?null:Number(e.target),f=e?.strikerId??r.strikerId,p=e?.nonStrikerId??r.nonStrikerId,m=e?.currentBowlerId??r.currentBowlerId,h=[f,p].filter(Boolean).length;r.battingTeamId=e?.battingTeamId??r.battingTeamId,r.bowlingTeamId=e?.bowlingTeamId??r.bowlingTeamId,r.strikerId=f,r.nonStrikerId=p,r.currentBowlerId=m,r.completed=!!e?.completed,r.scoreboard.runs=Number.isFinite(c)?c:r.scoreboard.runs,r.scoreboard.wickets=Number.isFinite(l)?l:r.scoreboard.wickets,r.scoreboard.legalBalls=Number.isFinite(s)?s:r.scoreboard.legalBalls,r.scoreboard.overs=Math.floor(r.scoreboard.legalBalls/6),r.scoreboard.ballsInOver=Number.isFinite(u)?u:r.scoreboard.legalBalls%6,r.scoreboard.target=d,r.scoreboard.requiredRuns=d==null?null:Math.max(d-r.scoreboard.runs,0),r.scoreboard.ballsLeft=Math.max(i-r.scoreboard.legalBalls,0),r.dismissedIds=a?_n(a.battingOrder,r.strikerId,r.nonStrikerId,r.scoreboard.wickets):[],r.nextBatterIndex=r.dismissedIds.length+h,r.nextBowlerIndex=o?.bowlingOrder?.length&&m?(o.bowlingOrder.indexOf(m)+1+o.bowlingOrder.length)%o.bowlingOrder.length:0,r.pendingChoices={batting:null,bowling:null},o&&(o.currentBowlerId=m)}),n.updatedAt=t?.updatedAt??Date.now(),n}function yn(e){let t=a(e);return Object.values(t.teams).forEach(e=>{e.playerIds.forEach(t=>{e.stats[t]={runs:0,ballsFaced:0,wicketsTaken:0,ballsBowled:0,dismissals:0}})}),t.ballEvents.forEach(e=>{let n=t.teams[e.battingTeamId],r=t.teams[e.bowlingTeamId],i=e.strikerId,a=e.bowlerId;i&&n?.stats[i]&&(n.stats[i].ballsFaced+=1,n.stats[i].runs+=e.runs,e.resultType===`wicket`&&(n.stats[i].dismissals+=1)),a&&r?.stats[a]&&(r.stats[a].ballsBowled+=1,e.resultType===`wicket`&&(r.stats[a].wicketsTaken+=1))}),t}function bn(e,t){let n=a(e),r=Number.isInteger(Number(t?.inningsIndex))&&Number(t?.inningsIndex)>=0?Number(t.inningsIndex):n.currentInningsIndex,i=n.innings[r],o=hn(t),s=Number(t?.score),c=Number(t?.wickets),l=gn(t);return i&&(Number.isFinite(s)&&(i.scoreboard.runs=s),Number.isFinite(c)&&(i.scoreboard.wickets=c),Number.isInteger(o)&&(i.scoreboard.legalBalls=o,i.scoreboard.overs=Math.floor(o/6),i.scoreboard.ballsLeft=Math.max(n.settings.overs*6-o,0)),i.scoreboard.target=t?.target==null?i.scoreboard.target:Number(t.target),i.scoreboard.requiredRuns=i.scoreboard.target==null?null:Math.max(i.scoreboard.target-i.scoreboard.runs,0),i.scoreboard.ballsInOver=Number.isInteger(Number(t?.ball))?Number(t.ball)%6:i.scoreboard.ballsInOver,i.strikerId=t?.strikerId??i.strikerId,i.nonStrikerId=t?.nonStrikerId??i.nonStrikerId,i.currentBowlerId=t?.currentBowlerId??i.currentBowlerId,i.pendingChoices={batting:null,bowling:null}),n.revealState={...n.revealState,status:`revealing`,waitingFor:null,lockedSides:[],revealAt:null,lastBall:l},n.ballEvents.some(e=>e.timestamp===l.timestamp)||n.ballEvents.push(l),n.updatedAt=Date.now(),n}var xn=class{constructor({store:e,socket:t}){this.store=e,this.socket=t,this.timers={revealReset:null,inningsBreak:null,revealLock:null,aiBatting:null,aiBowling:null,aiDecision:null},this.unsubscribers=[this.socket.on(`game_started`,e=>this.handleGameStarted(e)),this.socket.on(`next_turn`,e=>this.handleNextTurn(e)),this.socket.on(`ball_result`,e=>this.handleBallResult(e)),this.socket.on(`match_end`,e=>this.handleMatchEnd(e)),this.socket.on(`game_error`,e=>this.handleGameError(e)),this.socket.on(`match:playerLeft`,e=>this.handlePlayerLeft(e)),this.socket.on(`connection:status`,e=>this.applyConnection(e))]}destroy(){this.clearTimers(),this.unsubscribers.forEach(e=>e())}clearTimer(e){let t=this.timers[e];t&&(window.clearTimeout(t),this.timers[e]=null)}clearTimers(e=Object.keys(this.timers)){e.forEach(e=>this.clearTimer(e))}setBanner(e){this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:e}})}pushToast(e,t=`info`){this.store.dispatch({type:W.PUSH_TOAST,payload:{id:q(`toast`),message:e,tone:t}})}queueOfflineAiSelections(){let e=this.store.getState(),t=e.room,n=e.match;if(!t||!n||!$(t)||e.ui.isPaused||n.phase!==I.LIVE){this.clearTimers([`aiBatting`,`aiBowling`,`revealLock`]);return}let r=n.innings[n.currentInningsIndex],i=!r.pendingChoices.batting&&un(t,r.strikerId),a=!r.pendingChoices.bowling&&un(t,r.currentBowlerId);i&&!this.timers.aiBatting&&(this.timers.aiBatting=window.setTimeout(()=>{this.timers.aiBatting=null,this.applyOfflineAiSelection(`batting`)},an())),i||this.clearTimer(`aiBatting`),a&&!this.timers.aiBowling&&(this.timers.aiBowling=window.setTimeout(()=>{this.timers.aiBowling=null,this.applyOfflineAiSelection(`bowling`)},an())),a||this.clearTimer(`aiBowling`),r.pendingChoices.batting&&r.pendingChoices.bowling&&this.lockOfflineReveal()}applyOfflineAiSelection(e){let t=this.store.getState(),n=t.room,r=t.match;if(!n||!r||!$(n)||r.phase!==I.LIVE||t.ui.isPaused)return;let i=r.innings[r.currentInningsIndex],a=e===`batting`?i.strikerId:i.currentBowlerId;if(!un(n,a)||i.pendingChoices[e])return;let o=Wt(r,e,{controller:`ai`,playerId:a,teamId:e===`batting`?i.battingTeamId:i.bowlingTeamId,value:cn(r,e),lockedAt:Date.now()});this.store.dispatch({type:W.SET_MATCH,payload:o}),this.setBanner(o.revealState.status===`locked`?`Both picks locked. Revealing together...`:e===`batting`?`AI batter locked in.`:`AI bowler locked in.`),this.queueOfflineAiSelections()}lockOfflineReveal(){let e=this.store.getState(),t=e.room,n=e.match;if(!t||!n||!$(t)||n.phase!==I.LIVE)return;let r=n.innings[n.currentInningsIndex];if(!r.pendingChoices.batting||!r.pendingChoices.bowling)return;this.clearTimers([`aiBatting`,`aiBowling`]);let i=n.revealState.status===`locked`?n:Gt(n,{status:`locked`,waitingFor:null,revealAt:Date.now()+H.REVEAL_LOCK});this.store.dispatch({type:W.SET_MATCH,payload:i}),this.setBanner(`Both picks locked. Revealing together...`),this.clearTimer(`revealLock`),this.timers.revealLock=window.setTimeout(()=>{this.timers.revealLock=null,this.resolveOfflineBall()},H.REVEAL_LOCK)}resolveOfflineBall(){let e=this.store.getState(),t=e.room,n=e.match;if(!t||!n||!$(t)||n.phase!==I.LIVE)return;let r=n.innings[n.currentInningsIndex],i=r.pendingChoices.batting?.value??null,a=r.pendingChoices.bowling?.value??null;if(!X(i,n.settings.allowedNumbers)||!X(a,n.settings.allowedNumbers))return;let o=Gt(Jt(n,i,a),{status:`revealing`,waitingFor:null,revealAt:null}),s=o.revealState.lastBall?.timestamp??Date.now();this.store.dispatch({type:W.SET_MATCH,payload:o}),this.store.dispatch({type:W.SET_CONNECTION,payload:{status:L.CONNECTED,note:o.revealState.lastBall?.commentary??`Practice ball resolved.`,lastSyncAt:Date.now()}}),this.setBanner(o.revealState.lastBall?.commentary??`Practice ball resolved.`),this.clearTimer(`revealReset`),this.timers.revealReset=window.setTimeout(()=>this.finalizeResolvedBall(s),H.RESULT_DISPLAY)}finalizeOfflineTossDecision(e){let t=this.store.getState().room;!t?.tossResult||!$(t)||(this.clearTimer(`aiDecision`),this.store.dispatch({type:W.SET_ROOM,payload:{...t,status:F.LINEUP,tossResult:{...t.tossResult,decision:e}}}),this.store.dispatch({type:W.NAVIGATE,payload:P.LINEUP}),this.setBanner(`Toss finalized. ${t.teams[t.tossResult.winnerTeamId]?.name??`Winning team`} chose to ${e}.`))}pauseInterruptedMatch(e,t={}){let{resetSelections:n=!1,toast:r=null}=t,i=this.store.getState();this.clearTimers(),i.match&&n&&this.store.dispatch({type:W.SET_MATCH,payload:qt(i.match)}),this.store.dispatch({type:W.PATCH_UI,payload:{isPaused:!0,connectionBanner:e}}),r&&this.pushToast(r,`warning`)}markPlayerStatus(e,t,n){let r=this.store.getState();r.room&&this.store.dispatch({type:W.SET_ROOM,payload:{...r.room,players:r.room.players.map(r=>r.id===e?{...r,status:t,connectionState:{...r.connectionState,status:t===`away`?L.OFFLINE:L.CONNECTED,note:n,lastSyncAt:Date.now()}}:r)}})}togglePause(){let e=this.store.getState();if(!e.match)return;let t=!e.ui.isPaused;this.store.dispatch({type:W.PATCH_UI,payload:{isPaused:t,connectionBanner:t?`Match paused locally.`:`Match resumed. Lock your number.`}}),!t&&$(e.room)&&this.queueOfflineAiSelections()}simulateReconnect(){if($(this.store.getState().room)){this.setBanner(`Practice mode runs locally. No server reconnect is needed.`);return}this.setBanner(`Trying to reconnect to the realtime backend...`),this.socket.reconnect()}startToss(){let e=this.store.getState(),t=e.room;if(!(!t?.teams.alpha||!t.teams.beta||t.hostId!==e.session.localPlayerId||t.players.length!==t.maxPlayers||t.players.some(e=>e.status!==`ready`)||t.teams.alpha.playerIds.length!==t.settings.playersPerTeam||t.teams.beta.playerIds.length!==t.settings.playersPerTeam)){if($(t)){this.store.dispatch({type:W.SET_ROOM,payload:{...t,status:F.TOSS,tossResult:null}}),this.store.dispatch({type:W.NAVIGATE,payload:P.TOSS}),this.setBanner(`Practice toss ready. Call heads or tails.`);return}this.socket.emit(`start_toss`,{},e=>{e?.ok||this.handleGameError({message:e?.error??`Unable to start the toss.`})})}}runToss(e){let t=this.store.getState().room;if(!(!t?.teams.alpha||!t.teams.beta||t.status!==F.TOSS)){if($(t)){let n=Math.random()>.5?`heads`:`tails`,r=n===e?R.ALPHA:R.BETA,i={...t,tossResult:{call:e,coinFace:n,winnerTeamId:r,decision:null}};this.store.dispatch({type:W.SET_ROOM,payload:i}),i.captains[r]===this.store.getState().session.localPlayerId?this.setBanner(`${i.teams[r]?.name??`Your team`} won the toss. Choose bat or bowl.`):(this.setBanner(`${i.teams[r]?.name??`AI team`} won the toss. AI captain is choosing...`),this.clearTimer(`aiDecision`),this.timers.aiDecision=window.setTimeout(()=>{this.timers.aiDecision=null,this.finalizeOfflineTossDecision(ln({settings:i.settings}))},an()));return}this.socket.emit(`run_toss`,{call:e},e=>{e?.ok||this.handleGameError({message:e?.error??`Unable to flip the toss.`})})}}chooseTossDecision(e){let t=this.store.getState().room;if(!(!t?.tossResult||t.status!==F.TOSS)){if($(t)){this.finalizeOfflineTossDecision(e);return}this.socket.emit(`choose_toss`,{decision:e},e=>{e?.ok||this.handleGameError({message:e?.error??`Unable to lock the toss decision.`})})}}confirmLineupsAndStart(){let e=this.store.getState(),t=e.room;if(!t?.teams.alpha||!t.teams.beta||!t.tossResult?.decision||t.hostId!==e.session.localPlayerId)return;let n=t.tossResult.decision===`bat`?t.tossResult.winnerTeamId:t.tossResult.winnerTeamId===R.ALPHA?R.BETA:R.ALPHA,r=t.lineups?.[n]?.battingOrder?.[0]??t.teams[n]?.playerIds[0]??null;if(r){if($(t)){this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Game starts within 5 seconds. Preparing practice match...`,isPaused:!1}});let e={...t,status:F.LIVE},n=Ut(e,t.tossResult);this.clearTimers(),this.store.dispatch({type:W.SET_ROOM,payload:e}),this.store.dispatch({type:W.SET_MATCH,payload:n}),this.store.dispatch({type:W.NAVIGATE,payload:P.MATCH}),this.store.dispatch({type:W.SET_CONNECTION,payload:{status:L.CONNECTED,note:`Practice match running locally.`,lastSyncAt:Date.now()}}),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Practice match live. Lock your number when it is your turn.`,isPaused:!1}}),this.queueOfflineAiSelections();return}this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Game starts within 5 seconds. Preparing realtime match...`,isPaused:!1}}),this.socket.emit(`start_match`,{battingFirstPlayerId:r,tossWinnerId:t.teams[t.tossResult.winnerTeamId]?.captainId??null,decision:t.tossResult.decision,teams:fn(t),settings:{overs:t.settings.overs,matchMode:t.settings.matchMode,bowlingMode:t.settings.bowlingMode,numberSetMode:t.settings.numberSetMode,numberSetPreset:t.settings.numberSetPreset,numberSetLabel:t.settings.numberSetLabel,allowedNumbers:t.settings.allowedNumbers,numberRangeMin:t.settings.numberRangeMin,numberRangeMax:t.settings.numberRangeMax,customNumbersText:t.settings.customNumbersText}},e=>{e?.ok||this.handleGameError({message:e?.error??`Unable to start the match.`})})}}submitSelection(e,t,n={}){let r=this.store.getState(),i=r.match,a=r.room,o=r.session.localPlayerId,s=i?.settings.allowedNumbers??S({},{}).settings.allowedNumbers;if(!i||!a||!o||r.ui.isPaused||i.phase!==I.LIVE||!X(t,s)||i.revealState.status===`locked`||i.revealState.status===`revealing`){i&&!X(t,s)&&this.handleGameError({message:`Choose one of: ${s.join(`, `)}.`});return}let c=i.innings[i.currentInningsIndex];if((c.strikerId===o?`batting`:c.currentBowlerId===o?`bowling`:null)!==e||c.pendingChoices[e]?.value!=null)return;if(n.previewOnly){this.store.dispatch({type:W.PATCH_UI,payload:{selectedPicks:{...r.ui.selectedPicks??{batting:null,bowling:null},[e]:t},selectedNumberSide:e}}),this.setBanner(`Selected ${t}. Lock your pick when ready.`);return}let l=e===`batting`?c.battingTeamId:c.bowlingTeamId,u=Wt(i,e,{controller:`local`,playerId:e===`batting`?c.strikerId:c.currentBowlerId,teamId:l,value:t,lockedAt:Date.now()}),d=u.revealState.cycleId;if(this.store.dispatch({type:W.SET_MATCH,payload:u}),this.store.dispatch({type:W.PATCH_UI,payload:{selectedPicks:{...r.ui.selectedPicks??{batting:null,bowling:null},[e]:null},selectedNumberSide:null}}),this.setBanner(`Selection locked. Waiting for opponent.`),$(a)){this.queueOfflineAiSelections(),u.innings[u.currentInningsIndex].pendingChoices.batting&&u.innings[u.currentInningsIndex].pendingChoices.bowling&&this.lockOfflineReveal();return}this.socket.emit(`select_number`,{number:t},t=>{let n=this.store.getState(),r=n.match;if(!(!r||r.revealState.cycleId!==d)&&r.revealState.status!==`revealing`){if(!t?.ok){this.store.dispatch({type:W.SET_MATCH,payload:qt(r)}),this.store.dispatch({type:W.PATCH_UI,payload:{selectedPicks:{...n.ui.selectedPicks??{batting:null,bowling:null},[e]:null}}}),this.handleGameError({message:t?.error??`Unable to submit selection.`});return}t.waiting===!1&&(this.store.dispatch({type:W.SET_MATCH,payload:Gt(r,{status:`locked`,waitingFor:null,revealAt:Date.now()+H.REVEAL_LOCK})}),this.setBanner(`Both picks locked. Revealing together...`))}})}reorderBatters(e,t){let n=this.store.getState();!n.match||n.ui.isPaused||this.store.dispatch({type:W.SET_MATCH,payload:Yt(n.match,e,t)})}reorderBowlers(e,t){let n=this.store.getState();!n.match||n.ui.isPaused||this.store.dispatch({type:W.SET_MATCH,payload:Zt(n.match,e,t)})}changeBowler(e,t){let n=this.store.getState();!n.match||n.ui.isPaused||this.store.dispatch({type:W.SET_MATCH,payload:Xt(n.match,e,t)})}startRematch(){let e=this.store.getState().room;e&&(this.clearTimers(),this.store.dispatch({type:W.SET_MATCH,payload:null}),this.store.dispatch({type:W.SET_ROOM,payload:{...e,status:F.TOSS,tossResult:null,teams:{alpha:e.teams.alpha?{...e.teams.alpha,lockedLineup:!1}:null,beta:e.teams.beta?{...e.teams.beta,lockedLineup:!1}:null},lineups:{alpha:e.lineups?.alpha?{...e.lineups.alpha,locked:!1}:null,beta:e.lineups?.beta?{...e.lineups.beta,locked:!1}:null}}}),this.store.dispatch({type:W.PATCH_UI,payload:{isPaused:!1,connectionBanner:`Rematch ready. Toss again to start fresh.`}}),this.store.dispatch({type:W.NAVIGATE,payload:P.TOSS}))}handleGameStarted(e){let t=this.store.getState().room;if(!t?.teams.alpha||!t.teams.beta)return;let n=e?.tossResult?.decision&&e?.tossResult?.winnerTeamId?e.tossResult:t.tossResult?.decision&&t.tossResult.winnerTeamId?t.tossResult:dn(t,e?.innings?.[0]?.battingTeamId??null),r=e?.teams?{alpha:t.teams.alpha?{...t.teams.alpha,playerIds:[...e.teams.alpha.playerIds],captainId:e.teams.alpha.captainId,battingOrder:[...e.teams.alpha.battingOrder],bowlingOrder:[...e.teams.alpha.bowlingOrder],currentBowlerId:e.teams.alpha.bowlingOrder[0]??t.teams.alpha.currentBowlerId,lockedLineup:!0}:t.teams.alpha,beta:t.teams.beta?{...t.teams.beta,playerIds:[...e.teams.beta.playerIds],captainId:e.teams.beta.captainId,battingOrder:[...e.teams.beta.battingOrder],bowlingOrder:[...e.teams.beta.bowlingOrder],currentBowlerId:e.teams.beta.bowlingOrder[0]??t.teams.beta.currentBowlerId,lockedLineup:!0}:t.teams.beta}:t.teams,i=S(e?.settings??{},t.settings),a={...t,status:F.LIVE,tossResult:n,settings:{...t.settings,overs:e?.settings?.overs??t.settings.overs,matchMode:e?.settings?.matchMode??t.settings.matchMode,bowlingMode:e?.settings?.bowlingMode??t.settings.bowlingMode,...i.ok?i.settings:S({},t.settings).settings},teams:r,lineups:{alpha:r.alpha?{teamId:r.alpha.id,battingOrder:[...r.alpha.battingOrder],bowlingOrder:[...r.alpha.bowlingOrder],locked:!0}:null,beta:r.beta?{teamId:r.beta.id,battingOrder:[...r.beta.battingOrder],bowlingOrder:[...r.beta.bowlingOrder],locked:!0}:null}},o=yn(vn(Ut(a,n),e));this.store.dispatch({type:W.SET_ROOM,payload:a}),this.store.dispatch({type:W.SET_MATCH,payload:o}),this.store.dispatch({type:W.NAVIGATE,payload:P.MATCH}),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:e?.ballHistory?.length||e?.innings?.some(e=>Number(e?.legalBalls)>0)?`Realtime match restored. Lock your number when your turn is active.`:`Realtime match live. Lock your number.`,isPaused:!1}})}handleNextTurn(e){let t=this.store.getState(),n=t.match?mn(t.match,e):null,r=t.match?.revealState.status===`revealing`,i=!!e?.waitingFor?.length,a=r?L.CONNECTED:i?L.WAITING:L.CONNECTED,o=r?t.ui.connectionBanner||`Reveal in progress.`:e?.message??`Realtime turn synced.`;this.store.dispatch({type:W.SET_CONNECTION,payload:{status:a,note:o,lastSyncAt:Date.now()}}),n&&this.store.dispatch({type:W.SET_MATCH,payload:n}),e?.timeout&&!r&&this.pushToast(`Still waiting for the missing input.`,`warning`),r||this.setBanner(e?.message??`Realtime turn synced.`),t.room&&this.store.dispatch({type:W.SET_ROOM,payload:{...t.room,status:t.room.status===F.COMPLETED?F.COMPLETED:F.LIVE}})}handleBallResult(e){let t=this.store.getState().match;if(!t||t.phase!==I.LIVE)return;let n=hn(e),r=t.innings[t.currentInningsIndex];if(Number.isInteger(n)&&r.scoreboard.legalBalls>n)return;let i=Number.isInteger(n)&&r.scoreboard.legalBalls>=n?bn(t,e):Gt(Jt(t,e.battingNumber,e.bowlingNumber),{status:`revealing`,waitingFor:null,revealAt:null});if(i.revealState.lastBall&&(i.revealState.lastBall.timestamp=e?.timestamp??i.revealState.lastBall.timestamp,i.revealState.lastBall.commentary=e?.commentary??i.revealState.lastBall.commentary),i.ballEvents.length){let t=i.ballEvents[i.ballEvents.length-1];t.timestamp=e?.timestamp??t.timestamp,t.commentary=e?.commentary??t.commentary}let a=e?.timestamp??i.revealState.lastBall?.timestamp??Date.now();this.store.dispatch({type:W.SET_MATCH,payload:i}),this.store.dispatch({type:W.SET_CONNECTION,payload:{status:L.CONNECTED,note:e?.commentary??i.revealState.lastBall?.commentary??`Ball synced.`,lastSyncAt:Date.now()}}),this.setBanner(e?.commentary??i.revealState.lastBall?.commentary??`Ball synced.`),this.clearTimer(`revealReset`),this.timers.revealReset=window.setTimeout(()=>this.finalizeResolvedBall(a),H.RESULT_DISPLAY)}finalizeResolvedBall(e){let t=this.store.getState(),n=t.match,r=t.room;if(!(!n||n.revealState.lastBall?.timestamp!==e)){if(n.phase===I.BREAK){this.clearTimer(`inningsBreak`),this.timers.inningsBreak=window.setTimeout(()=>{let e=this.store.getState();!e.match||e.match.phase!==I.BREAK||(this.store.dispatch({type:W.SET_MATCH,payload:Ht(e.match)}),this.setBanner(`Innings switched. Lock fresh picks.`),$(e.room)&&this.queueOfflineAiSelections())},H.INNINGS_BREAK);return}if(n.phase===I.COMPLETE&&n.result&&r){this.store.dispatch({type:W.SAVE_HISTORY_ENTRY,payload:Qt(n,r.code)}),this.store.dispatch({type:W.SET_ROOM,payload:{...r,status:F.COMPLETED}}),this.store.dispatch({type:W.NAVIGATE,payload:P.RESULT}),this.setBanner(n.result.marginText);return}this.store.dispatch({type:W.SET_MATCH,payload:Kt(n)}),this.setBanner(`Next ball ready. Make your picks.`),$(r)&&this.queueOfflineAiSelections()}}handleMatchEnd(e){let t=this.store.getState();if(e?.aborted){this.pauseInterruptedMatch(e.reason??`Match ended early.`,{resetSelections:!0,toast:e.reason??`Match ended early.`});return}t.room&&this.store.dispatch({type:W.SET_ROOM,payload:{...t.room,status:F.COMPLETED}}),e?.result?.marginText&&this.setBanner(e.result.marginText)}handlePlayerLeft(e){let t=this.store.getState();if(!t.room||!t.match||$(t.room)||e.roomId&&e.roomId!==t.room.code)return;let n=t.room.players.find(t=>t.id===e.playerId)?.name??`Opponent`;e.playerId&&this.markPlayerStatus(e.playerId,`away`,e.note??`Left the room`),this.pauseInterruptedMatch(`${n} left mid-match. Match paused.`,{resetSelections:!0,toast:`${n} disconnected during the round.`})}handleGameError(e){let t=e?.message??`Realtime game action failed.`;this.pushToast(t,`warning`),this.setBanner(t)}applyConnection(e){let t=this.store.getState();if($(t.room)){this.store.dispatch({type:W.SET_CONNECTION,payload:{status:L.CONNECTED,note:`Practice mode active locally.`,lastSyncAt:Date.now()}});return}if(this.store.dispatch({type:W.SET_CONNECTION,payload:{status:e.status,note:e.note,lastSyncAt:Date.now()}}),e.status===L.RECONNECTING&&t.match){this.pauseInterruptedMatch(`Realtime link unstable. Waiting to reconnect.`,{resetSelections:!0});return}if(e.status===L.OFFLINE&&t.match){this.pauseInterruptedMatch(e.note||`Connection lost.`,{resetSelections:!0});return}e.status===L.CONNECTED&&!t.ui.isPaused&&this.setBanner(e.note||(t.match?`Realtime match synced.`:`Connected.`))}},Sn=null,Cn=24,wn=1e4;function Tn(){let e=window.MH_HANDREX_SOCKET_URL;if(typeof e==`string`&&e.trim())return e.trim().replace(/\/$/,``);if(window.location.protocol.startsWith(`http`)){let e=new URLSearchParams(window.location.search);return e.get(`gamehubShell`)===`premium`||e.get(`gamehubEmbedded`)===`1`?`${window.location.origin}/premium-handcricket`:window.location.origin}return`http://localhost:4000`}function En(e){try{return new URL(e,window.location.href).origin}catch{return window.location.protocol.startsWith(`http`)?window.location.origin:`http://localhost:4000`}}function Dn(e){return typeof window.io==`function`?Promise.resolve(window.io):Sn||(Sn=new Promise((t,n)=>{let r=document.createElement(`script`);r.src=`${En(e)}/socket.io/socket.io.js`,r.async=!0,r.onload=()=>{if(typeof window.io==`function`){t(window.io);return}n(Error(`Socket.io client loaded but window.io was unavailable.`))},r.onerror=()=>{n(Error(`Failed to load Socket.io client from backend.`))},document.head.append(r)}),Sn)}function On(e){return e.startsWith(`connection:`)||e.startsWith(`socket:`)||e.startsWith(`match:`)}var kn=class{constructor(){this.url=Tn(),this.socket=null,this.listeners=new Map,this.serverListeners=new Map,this.timers=new Set,this.pendingEmits=[],this.initializing=null,this.initialize()}async initialize(){return this.socket?this.socket:this.initializing?this.initializing:(this.emitLocal(`connection:status`,{status:L.RECONNECTING,note:`Connecting to realtime backend...`}),this.initializing=Dn(this.url).then(e=>(this.socket=e(this.url,{autoConnect:!0,reconnection:!0,reconnectionDelay:500,reconnectionDelayMax:4e3,randomizationFactor:.5,timeout:8e3,path:`/socket.io`,transports:[`websocket`,`polling`]}),this.registerCoreHandlers(),this.bindQueuedServerListeners(),this.socket.connected&&this.flushPendingEmits(),this.socket)).catch(e=>(this.pendingEmits.splice(0).forEach(t=>{t.ack?.({ok:!1,error:e instanceof Error?e.message:`Unable to connect to the realtime backend.`})}),this.emitLocal(`connection:status`,{status:L.OFFLINE,note:e instanceof Error?e.message:`Unable to connect to the realtime backend.`}),null)).finally(()=>{this.initializing=null}),this.initializing)}registerCoreHandlers(){this.socket&&(this.socket.on(`connect`,()=>{this.emitLocal(`connection:status`,{status:L.CONNECTED,note:`Connected to realtime backend`}),this.flushPendingEmits()}),this.socket.on(`connect_error`,()=>{this.emitLocal(`connection:status`,{status:L.RECONNECTING,note:`Trying to reach realtime backend...`})}),this.socket.on(`disconnect`,e=>{this.emitLocal(`connection:status`,{status:L.OFFLINE,note:`Disconnected: ${e}`})}),this.socket.on(`connected`,e=>{this.emitLocal(`socket:connected`,e)}),this.socket.on(`player_left`,e=>{this.emitLocal(`match:playerLeft`,{roomId:e?.roomId??null,playerId:e?.playerId??null,note:e?.reason??`Player left the room.`})}))}bindQueuedServerListeners(){this.socket&&this.serverListeners.forEach((e,t)=>{e.forEach(e=>{this.socket.on(t,e)})})}flushPendingEmits(){!this.socket||!this.pendingEmits.length||this.pendingEmits.splice(0).forEach(e=>{this.emitNow(e.eventName,e.payload,e.ack)})}queueEmit(e){this.pendingEmits.length>=Cn&&this.pendingEmits.shift()?.ack?.({ok:!1,error:`Realtime connection is busy. Please try that action again.`}),this.pendingEmits.push(e)}emitNow(e,t,n){if(!this.socket){n?.({ok:!1,error:`Realtime backend is not ready yet.`});return}if(typeof n!=`function`){this.socket.emit(e,t);return}let r=!1,i=window.setTimeout(()=>{r||(r=!0,n({ok:!1,error:`Realtime action timed out. Please try again.`}))},wn);this.socket.emit(e,t,e=>{r||(r=!0,window.clearTimeout(i),n(e))})}on(e,t){let n=On(e)?this.listeners:this.serverListeners,r=n.get(e)??new Set;return r.add(t),n.set(e,r),!On(e)&&this.socket&&this.socket.on(e,t),()=>{r.delete(t),!On(e)&&this.socket&&this.socket.off(e,t)}}emitLocal(e,t){let n=this.listeners.get(e);n&&n.forEach(e=>e(t))}emit(e,t,n){if(!this.socket||!this.socket.connected){this.queueEmit({eventName:e,payload:t,ack:n}),this.socket?this.socket.connect():this.initialize();return}this.emitNow(e,t,n)}broadcast(e,t,n=0,r){let i=window.setTimeout(()=>{this.timers.delete(i),this.emit(e,t,r)},n);return this.timers.add(i),i}clear(){this.timers.forEach(e=>window.clearTimeout(e)),this.timers.clear()}reconnect(){if(!this.socket){this.initialize();return}if(this.socket.connected){this.emitLocal(`connection:status`,{status:L.CONNECTED,note:`Realtime link already active`});return}this.emitLocal(`connection:status`,{status:L.RECONNECTING,note:`Reconnecting to realtime backend...`}),this.socket.connect()}disconnect(){this.clear(),this.pendingEmits.splice(0).forEach(e=>{e.ack?.({ok:!1,error:`Realtime connection closed before the action was sent.`})}),this.socket?.disconnect()}get id(){return this.socket?.id??null}};function An(e){return RegExp(`^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$`).test(e)}function jn(e,t=B){let n=S(e,t);return{...B,...t,...e,...n.ok?n.settings:S({},B).settings}}function Mn(e){let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,`true`),t.style.position=`fixed`,t.style.opacity=`0`,t.style.pointerEvents=`none`,document.body.append(t),t.select(),t.setSelectionRange(0,t.value.length);let n=!1;try{n=!!document.execCommand?.(`copy`)}catch{n=!1}return t.remove(),n}function Nn(e,t,n,r,i){return{id:e,name:t,captainId:n,playerIds:[...r],battingOrder:[...r],bowlingOrder:[...r],currentBowlerId:r[0]??null,lockedLineup:i,stats:{}}}function Pn(e,t){let n=t?.battingOrder&&Tt(t.battingOrder,e.playerIds)?[...t.battingOrder]:[...e.battingOrder],r=t?.bowlingOrder&&Tt(t.bowlingOrder,e.playerIds)?[...t.bowlingOrder]:[...e.bowlingOrder];return{teamId:e.id,battingOrder:n,bowlingOrder:r,locked:e.lockedLineup}}function Fn(e,t,n=null){return e&&t.includes(e)&&e!==n?e:t.find(e=>e!==n)??null}function In(e,t,n){let r=new Set(e.map(e=>e.id)),i=new Set,a={alpha:[],beta:[]};return[R.ALPHA,R.BETA].forEach(e=>{(Array.isArray(n?.[e])?n[e]:[]).forEach(n=>{!r.has(n)||i.has(n)||a[e].length>=t||(a[e].push(n),i.add(n))})}),a}function Ln(e,t){return e.alpha.length===t&&e.beta.length===t}function Rn(e,t){return e.alpha.includes(t)?R.ALPHA:e.beta.includes(t)?R.BETA:null}function zn(e,t,n,r){if(Rn(e,t)===n)return{ok:!0,selections:e};if(n&&e[n].length>=r)return{ok:!1,error:`${n===R.ALPHA?`Alpha`:`Beta`} team is already full.`};let i={alpha:e.alpha.filter(e=>e!==t),beta:e.beta.filter(e=>e!==t)};return n&&i[n].push(t),{ok:!0,selections:i}}function Bn(e,t,n,r,i){let a=!!(r?.lineups?.alpha?.locked||r?.lineups?.beta?.locked||r?.status===F.LINEUP||r?.status===F.LIVE||r?.status===F.COMPLETED),o=In(e,n,i??r?.teamSelections),s=o.alpha,c=o.beta,l=Fn(t.alpha,s)??s[0]??null,u=Fn(t.beta,c,l)??c[0]??null,d=s.length?Nn(R.ALPHA,r?.teams?.alpha?.name??r?.teamNames?.alpha??`Alpha XI`,l??s[0],s,a):null,f=c.length?Nn(R.BETA,r?.teams?.beta?.name??r?.teamNames?.beta??`Beta XI`,u??c[0],c,a):null;return{alpha:d,beta:f,lineups:{alpha:d?Pn(d,r?.lineups?.alpha):null,beta:f?Pn(f,r?.lineups?.beta):null},captains:{alpha:d?.captainId??null,beta:f?.captainId??null},selections:o}}function Vn(e,t){return e?{...e,teamNames:{alpha:t?.alpha?.trim()||e.teamNames?.alpha||e.teams?.alpha?.name||`Alpha XI`,beta:t?.beta?.trim()||e.teamNames?.beta||e.teams?.beta?.name||`Beta XI`},teams:{alpha:e.teams?.alpha?{...e.teams.alpha,name:t?.alpha?.trim()||e.teams.alpha.name||`Alpha XI`}:e.teams?.alpha??null,beta:e.teams?.beta?{...e.teams.beta,name:t?.beta?.trim()||e.teams.beta.name||`Beta XI`}:e.teams?.beta??null}}:null}function Hn(e,t,n){let r=e.session.localPlayerId??q(`local`),i=Xe(),a=nn(),o=tn(n*2-1,t).map((e,t)=>({...e,role:t===0?`captain`:`player`,status:`ready`,connectionState:{...e.connectionState,note:`Practice AI ready`}})),s={alpha:r,beta:o[0]?.id??null},c=[{id:r,name:t,isHost:!0,isLocal:!0,isMock:!1,role:`captain`,status:`unready`,avatarSeed:t.toLowerCase().replace(/\s+/g,`-`),connectionState:{status:L.CONNECTED,lastSyncAt:Date.now(),latencyMs:0,note:`Practice player`}},...o],l={alpha:[r],beta:o[0]?.id?[o[0].id]:[]};o.filter(e=>!l.beta.includes(e.id)).forEach(e=>{if(l.alpha.length<n){l.alpha.push(e.id);return}l.beta.length<n&&l.beta.push(e.id)});let u={id:q(`practice-room`),code:i,source:`offline`,teamNames:a,hostId:r,maxPlayers:n*2,playerIds:c.map(e=>e.id),players:c,status:F.LOBBY,connectionState:{status:L.CONNECTED,lastSyncAt:Date.now(),latencyMs:0,note:`Offline practice room with AI players.`},settings:{...jn(B),playersPerTeam:n,controlMode:ve.LOCAL_VS_AI},captains:s,teamSelections:l,teams:{alpha:null,beta:null},lineups:{alpha:null,beta:null},draftState:{status:`complete`,availablePlayerIds:[],currentPickIndex:0,pickSequence:[],picks:[]},tossResult:null,createdAt:Date.now()},d=Bn(c,s,n,u,l),f={alpha:d.alpha?{...d.alpha,name:a.alpha}:null,beta:d.beta?{...d.beta,name:a.beta}:null};return{...u,captains:d.captains,teamSelections:d.selections,teams:f,lineups:{alpha:f.alpha?Pn(f.alpha,d.lineups.alpha):null,beta:f.beta?Pn(f.beta,d.lineups.beta):null},players:c.map(e=>({...e,role:e.id===d.captains.alpha||e.id===d.captains.beta?`captain`:`player`}))}}function Un(e,t,n,r){return e===`toss`?F.TOSS:e===`lineup`?F.LINEUP:e===`live`?F.LIVE:e===`completed`?F.COMPLETED:e===`draft`?F.DRAFT:F.LOBBY}function Wn(e,t,n){return e===`live`?{status:L.CONNECTED,lastSyncAt:Date.now(),latencyMs:28,note:`Realtime match is live.`}:e===`completed`?{status:L.CONNECTED,lastSyncAt:Date.now(),latencyMs:28,note:`Match completed.`}:e===`toss`?{status:L.CONNECTED,lastSyncAt:Date.now(),latencyMs:28,note:`Toss live for the captains.`}:e===`lineup`?{status:L.CONNECTED,lastSyncAt:Date.now(),latencyMs:28,note:`Lineups are being finalized.`}:t<n||e===`waiting`?{status:L.WAITING,lastSyncAt:Date.now(),latencyMs:28,note:`Waiting for ${Math.max(n-t,0)} more player${n-t===1?``:`s`}.`}:{status:L.CONNECTED,lastSyncAt:Date.now(),latencyMs:28,note:`Room synced. Ready states are live.`}}function Gn(e,t){let n=Vn(t.room,e.teamNames)??{teamNames:e.teamNames??{alpha:`Alpha XI`,beta:`Beta XI`},teams:{alpha:null,beta:null},lineups:t.room?.lineups,status:t.room?.status,settings:t.room?.settings??B,captains:t.room?.captains??{alpha:null,beta:null},teamSelections:t.room?.teamSelections??{alpha:[],beta:[]}},r=t.session.localPlayerId,i=e.players.map(e=>e.id),a=Math.max(1,Number(e.teamSize)||e.settings?.playersPerTeam||n?.settings?.playersPerTeam||B.playersPerTeam),o=Math.max(2,Number(e.maxPlayers)||a*2),s=e.players.map(t=>({id:t.id,name:t.name,isHost:t.id===e.hostId,isLocal:t.id===r,isMock:!1,role:`player`,status:t.connected===!1?`away`:t.ready?`ready`:`unready`,avatarSeed:t.name.toLowerCase().replace(/\s+/g,`-`),connectionState:{status:t.connected===!1?L.OFFLINE:L.CONNECTED,lastSyncAt:Date.now(),latencyMs:28,note:t.connected===!1?`Disconnected from room`:t.ready?`Ready in lobby`:`Connected`}})),c=Bn(s,{alpha:e.captains?.alpha??n?.captains?.alpha??null,beta:e.captains?.beta??n?.captains?.beta??null},a,n,e.teamSelections??n?.teamSelections),l=s.map(e=>({...e,role:e.id===c.captains.alpha||e.id===c.captains.beta?`captain`:`player`})),u=Un(e.status,n?.status,s.length,o),d=s.length>=o,f=Ln(c.selections,a);return{id:e.roomId,code:e.roomId,source:`realtime`,teamNames:{alpha:c.alpha?.name??e.teamNames?.alpha??`Alpha XI`,beta:c.beta?.name??e.teamNames?.beta??`Beta XI`},hostId:e.hostId,maxPlayers:o,playerIds:i,players:l,status:u,connectionState:Wn(e.status,s.length,o),settings:{...jn(e.settings??{},n?.settings??B),playersPerTeam:a,controlMode:ve.LOCAL_VS_AI},captains:{alpha:c.captains.alpha,beta:c.captains.beta},teamSelections:c.selections,teams:{alpha:c.alpha,beta:c.beta},lineups:c.lineups,draftState:{status:d&&f?`complete`:`pending`,availablePlayerIds:[],currentPickIndex:0,pickSequence:[],picks:[]},tossResult:e.tossResult??n?.tossResult??null,createdAt:e.createdAt??n?.createdAt??Date.now()}}var Kn=class{constructor({store:e,socket:t}){this.store=e,this.socket=t,this.pendingRoomAction=null,this.resumeInFlight=!1,this.unsubscribers=[this.socket.on(`socket:connected`,e=>this.handleSocketConnected(e)),this.socket.on(`room_created`,e=>this.handleRoomCreated(e)),this.socket.on(`room_update`,e=>this.handleRoomUpdate(e)),this.socket.on(`room_kicked`,e=>this.handleRoomKicked(e)),this.socket.on(`room_closed`,e=>this.handleRoomClosed(e)),this.socket.on(`room_error`,e=>this.handleRoomError(e)),this.socket.on(`connection:status`,e=>this.setConnection(e))]}destroy(){this.unsubscribers.forEach(e=>e())}clearPendingRoomAction(){this.pendingRoomAction=null}beginRoomAction(e){return this.pendingRoomAction||this.resumeInFlight?(this.pushToast(`Please wait for the current room request to finish.`,`info`),!1):(this.pendingRoomAction=e,!0)}clearActiveRoomSession(){let e=this.store.getState();this.store.dispatch({type:W.UPDATE_SESSION,payload:{...e.session,activeRoomCode:``}})}attemptResume(){let e=this.store.getState(),t=e.session.activeRoomCode?.trim().toUpperCase(),n=e.session.playerKey;!t||!n||this.resumeInFlight||(this.resumeInFlight=!0,this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Rejoining room ${t}...`}}),this.socket.emit(`resume_session`,{roomId:t,playerKey:n,playerName:e.session.profileName},e=>{if(this.resumeInFlight=!1,e?.ok){this.pushToast(`Rejoined room ${t}.`,`success`);return}this.clearActiveRoomSession(),this.handleRoomError({message:e?.error??`Unable to restore the previous room session.`})}))}pushToast(e,t=`info`){this.store.dispatch({type:W.PUSH_TOAST,payload:{id:q(`toast`),message:e,tone:t}})}setConnection(e){let t=this.store.getState();if(t.room?.source===`offline`){this.store.dispatch({type:W.SET_CONNECTION,payload:{status:L.CONNECTED,note:t.room.connectionState.note??`Practice room active locally.`,lastSyncAt:Date.now()}});return}this.store.dispatch({type:W.SET_CONNECTION,payload:{status:e.status,note:e.note,lastSyncAt:Date.now()}}),t.room&&this.store.dispatch({type:W.SET_ROOM,payload:{...t.room,connectionState:{...t.room.connectionState,status:e.status,note:e.note,lastSyncAt:Date.now()}}})}handleSocketConnected(e){e?.socketId&&this.store.getState().room?.source!==`offline`&&(this.store.dispatch({type:W.UPDATE_SESSION,payload:{localPlayerId:e.socketId}}),this.store.getState().session.activeRoomCode&&this.attemptResume())}applyServerRoom(e){let t=this.store.getState(),n=Gn(e,t),r=Ln(n.teamSelections,n.settings.playersPerTeam),i=null;this.resumeInFlight=!1,this.clearPendingRoomAction(),n.status===F.TOSS&&t.route!==P.MATCH&&t.route!==P.RESULT?i=P.TOSS:n.status===F.LINEUP&&t.route!==P.MATCH&&t.route!==P.RESULT?i=P.LINEUP:n.status===F.LOBBY&&[P.TOSS,P.LINEUP].includes(t.route)?i=n.playerIds.length===n.maxPlayers?P.LOBBY:P.ROOM:n.playerIds.length===n.maxPlayers&&n.status===F.LOBBY&&[P.HOME,P.ROOM,P.TOSS,P.LINEUP].includes(t.route)?i=P.LOBBY:(!t.room||t.route===P.HOME)&&n.status!==F.LIVE&&n.status!==F.COMPLETED&&(i=n.playerIds.length===n.maxPlayers?P.LOBBY:P.ROOM);let a=`Room synced.`;a=n.status===F.TOSS?n.tossResult?n.tossResult.decision?`${n.teams[n.tossResult.winnerTeamId]?.name??`Winning team`} chose to ${n.tossResult.decision}.`:`${n.teams[n.tossResult.winnerTeamId]?.name??`Winning team`} won the toss. Waiting for the decision.`:`Toss live. Alpha captain can call the flip.`:n.status===F.LINEUP?`Toss complete. Captains can finalize batting and bowling orders.`:n.playerIds.length<n.maxPlayers?`Room live. Waiting for ${n.maxPlayers-n.playerIds.length} more player${n.maxPlayers-n.playerIds.length===1?``:`s`} to join.`:r?n.players.every(e=>e.status===`ready`)?`All players ready. Host can continue.`:`Room synced. Ready toggles are live.`:`Choose sides for Alpha and Beta before the host starts the toss.`,this.store.dispatch({type:W.UPDATE_SESSION,payload:{lastRoomCode:n.code,activeRoomCode:n.code}}),this.store.dispatch({type:W.SET_ROOM,payload:n}),t.match||this.store.dispatch({type:W.SET_MATCH,payload:null}),i&&this.store.dispatch({type:W.NAVIGATE,payload:i}),this.store.dispatch({type:W.PATCH_UI,payload:{roomCodeInput:n.code,connectionBanner:a}})}handleRoomCreated(e){this.applyServerRoom(e),this.pushToast(`Room ${e.roomId} created. Share the invite link or room code to join.`,`success`)}handleRoomUpdate(e){this.applyServerRoom(e)}handleRoomKicked(e){let t=e?.roomId??this.store.getState().room?.code??``,n=e?.message??`You were removed from the room by the host.`;this.resumeInFlight=!1,this.clearPendingRoomAction(),this.store.dispatch({type:W.RESET_FLOW}),this.store.dispatch({type:W.PATCH_UI,payload:{roomCodeInput:t,connectionBanner:n}}),this.pushToast(n,`warning`)}handleRoomClosed(e){let t=e?.roomId??this.store.getState().room?.code??``,n=e?.message??`This room was discarded by the host.`;this.resumeInFlight=!1,this.clearPendingRoomAction(),this.store.dispatch({type:W.RESET_FLOW}),this.store.dispatch({type:W.PATCH_UI,payload:{roomCodeInput:t,connectionBanner:n}}),this.pushToast(n,`info`)}handleRoomError(e){this.clearPendingRoomAction();let t=e?.message??`Room action failed.`;this.pushToast(t,`warning`),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:t}})}getInviteLink(e=this.store.getState().room?.code??``){if(!e)return``;let t=new URL(window.location.href);return t.search=``,t.hash=``,t.searchParams.set(`room`,e),t.toString()}copyInviteLink(){if(this.store.getState().room?.source===`offline`){this.pushToast(`Invite links are only available for realtime rooms.`,`info`);return}let e=this.getInviteLink();if(!e){this.pushToast(`Create or join a room first to share an invite link.`,`warning`);return}if(navigator.clipboard?.writeText){navigator.clipboard.writeText(e).then(()=>{this.pushToast(`Invite link copied.`,`success`)}).catch(()=>{if(Mn(e)){this.pushToast(`Invite link copied.`,`success`);return}this.pushToast(`Unable to copy automatically. Please copy the room link from the browser address bar.`,`warning`)});return}if(Mn(e)){this.pushToast(`Invite link copied.`,`success`);return}this.pushToast(`Unable to copy automatically. Please copy the room link from the browser address bar.`,`warning`)}createRoom(e={}){let t=(e.playerName||`Captain You`).trim()||`Captain You`,n=Math.max(1,Math.min(11,Number(e.teamSize)||this.store.getState().ui.playersPerTeam||B.playersPerTeam));if(!this.beginRoomAction(`create`))return;let r=this.store.getState();this.store.dispatch({type:W.UPDATE_SESSION,payload:{profileName:t,playerKey:r.session.playerKey}}),this.store.dispatch({type:W.SET_MATCH,payload:null}),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Creating realtime ${n}v${n} room...`,playersPerTeam:n}}),this.socket.emit(`create_room`,{playerName:t,playerKey:r.session.playerKey,teamSize:n,settings:jn({playersPerTeam:n},B)},e=>{this.clearPendingRoomAction(),!e?.ok&&this.handleRoomError({message:e?.error??`Unable to create room.`})})}joinRoom(e={}){let t=(e.playerName||`Captain You`).trim()||`Captain You`,n=(e.code||``).trim().toUpperCase();if(!An(n)){this.handleRoomError({message:`Enter a valid 6-character room code.`});return}if(!this.beginRoomAction(`join`))return;let r=this.store.getState();this.store.dispatch({type:W.UPDATE_SESSION,payload:{profileName:t,playerKey:r.session.playerKey}}),this.store.dispatch({type:W.SET_MATCH,payload:null}),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Joining room ${n}...`}}),this.socket.emit(`join_room`,{roomId:n,playerName:t,playerKey:r.session.playerKey},e=>{if(this.clearPendingRoomAction(),e?.ok){this.pushToast(`Joined room ${n}.`,`success`);return}this.handleRoomError({message:e?.error??`Unable to join room.`})})}startQuickMatch(e={}){this.createRoom({playerName:this.store.getState().session.profileName,teamSize:e.teamSize})}startPracticeMode(){let e=this.store.getState(),t=Number(e.ui.playersPerTeam)||1,n=Math.max(1,Math.min(2,t));t>2&&this.pushToast(`Practice mode currently supports up to 2v2. Switched to 2v2.`,`info`);let r=Hn(e,e.session.profileName,n);this.store.dispatch({type:W.UPDATE_SESSION,payload:{localPlayerId:r.hostId,profileName:e.session.profileName,activeRoomCode:``}}),this.store.dispatch({type:W.SET_MATCH,payload:null}),this.store.dispatch({type:W.SET_ROOM,payload:r}),this.store.dispatch({type:W.SET_CONNECTION,payload:r.connectionState}),this.store.dispatch({type:W.PATCH_UI,payload:{playersPerTeam:n,roomCodeInput:r.code,connectionBanner:`Practice room ready. Review settings, ready up, and start the toss.`,isPaused:!1}}),this.store.dispatch({type:W.NAVIGATE,payload:P.LOBBY}),this.pushToast(`Practice ${n}v${n} room created with AI players.`,`success`)}enterLobby(){this.store.getState().room&&this.store.dispatch({type:W.NAVIGATE,payload:P.LOBBY})}openDraftBoard(){if(this.store.getState().room?.source===`offline`){this.pushToast(`Practice teams are already prepared with AI players.`,`info`),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Practice teams are ready. Review lineups and move into the toss.`}});return}this.pushToast(`Players now choose sides directly in the room and lobby before the toss.`,`info`),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Set team sides, choose captains from each side, then move into the toss.`}})}pickDraftPlayer(e){}autoDraftTeams(){if(this.store.getState().room?.source===`offline`){this.pushToast(`Practice teams are already filled with AI players.`,`info`),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Practice teams are already set. Start the toss when you are ready.`}});return}this.pushToast(`Manual side selection is active. Use the team board to place players into Alpha or Beta.`,`info`),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Arrange both sides manually, then review captains and ready states.`}})}updateSettings(e){let t=this.store.getState();if(!t.room||t.room.hostId!==t.session.localPlayerId)return;if(t.match||t.room.status===F.LIVE||t.room.status===F.COMPLETED){this.pushToast(`Room settings are locked after the match starts.`,`warning`),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Room settings are locked after the match starts.`,numberSetValidationError:`Room settings are locked after the match starts.`}});return}let n=S(e,t.room.settings);if(!n.ok){this.pushToast(n.error,`warning`),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:n.error,numberSetValidationError:n.error}});return}let r={...t.room.settings,...e,...n.settings,playersPerTeam:t.room.settings.playersPerTeam,controlMode:ve.LOCAL_VS_AI},i=[`numberSetMode`,`numberSetPreset`,`numberRangeMin`,`numberRangeMax`,`customNumbersText`,`allowedNumbers`].some(t=>Object.prototype.hasOwnProperty.call(e,t));this.store.dispatch({type:W.SET_ROOM,payload:{...t.room,settings:r}}),this.store.dispatch({type:W.PATCH_UI,payload:{numberSetDraft:i?null:t.ui.numberSetDraft??null,numberSetValidationError:i?``:t.ui.numberSetValidationError??``,connectionBanner:i?`${r.numberSetLabel} number set applied.`:`Room settings updated.`}}),t.room.source!==`offline`&&this.socket.emit(`update_room_config`,{settings:{matchMode:r.matchMode,bowlingMode:r.bowlingMode,overs:r.overs,numberSetMode:r.numberSetMode,numberSetPreset:r.numberSetPreset,numberSetLabel:r.numberSetLabel,allowedNumbers:r.allowedNumbers,numberRangeMin:r.numberRangeMin,numberRangeMax:r.numberRangeMax,customNumbersText:r.customNumbersText}},e=>{e?.ok||(this.store.dispatch({type:W.PATCH_UI,payload:{numberSetValidationError:e?.error??`Unable to update room settings.`}}),this.handleRoomError({message:e?.error??`Unable to update room settings.`}))})}updateTeamName(e,t){let n=this.store.getState(),r=n.room;if(!r||r.hostId!==n.session.localPlayerId)return;let i=e===`alpha`?`Alpha XI`:`Beta XI`,a=t.trim()||i,o={...r,teamNames:{alpha:e===`alpha`?a:r.teams.alpha?.name??`Alpha XI`,beta:e===`beta`?a:r.teams.beta?.name??`Beta XI`},teams:{...r.teams,[e]:r.teams[e]?{...r.teams[e],name:a}:r.teams[e]}};this.store.dispatch({type:W.SET_ROOM,payload:o}),r.source!==`offline`&&this.socket.emit(`update_room_config`,{teamNames:{alpha:e===`alpha`?a:r.teams.alpha?.name??`Alpha XI`,beta:e===`beta`?a:r.teams.beta?.name??`Beta XI`}},e=>{e?.ok||this.handleRoomError({message:e?.error??`Unable to update team names.`})})}setCaptain(e,t){let n=this.store.getState();if(!n.room||n.room.hostId!==n.session.localPlayerId)return;if(!n.room.teamSelections?.[e]?.includes(t)){this.pushToast(`${e===R.ALPHA?`Alpha`:`Beta`} captain must belong to that side first.`,`info`);return}let r={...n.room.captains,[e]:t};if(r.alpha&&r.alpha===r.beta)return;let i=Bn(n.room.players,r,n.room.settings.playersPerTeam,n.room,n.room.teamSelections);this.store.dispatch({type:W.SET_ROOM,payload:{...n.room,captains:i.captains,teamSelections:i.selections,teams:{alpha:i.alpha,beta:i.beta},lineups:i.lineups,draftState:{...n.room.draftState??{status:`pending`,availablePlayerIds:[],currentPickIndex:0,pickSequence:[],picks:[]},status:n.room.playerIds.length===n.room.maxPlayers&&Ln(i.selections,n.room.settings.playersPerTeam)?`complete`:`pending`}}}),n.room.source!==`offline`&&this.socket.emit(`update_room_config`,{captains:i.captains},e=>{e?.ok||this.handleRoomError({message:e?.error??`Unable to update captains.`})})}setPlayerTeam(e,t){let n=this.store.getState(),r=n.room,i=n.session.localPlayerId;if(!r||!e||!i||!(r.hostId===i||e===i))return;let a=t===R.ALPHA||t===R.BETA?t:null;if(r.source===`offline`){let t=zn(In(r.players,r.settings.playersPerTeam,r.teamSelections),e,a,r.settings.playersPerTeam);if(!t.ok){this.pushToast(t.error,`warning`);return}let n=Bn(r.players,r.captains,r.settings.playersPerTeam,r,t.selections);this.store.dispatch({type:W.SET_ROOM,payload:{...r,captains:n.captains,teamSelections:n.selections,teams:{alpha:n.alpha,beta:n.beta},lineups:n.lineups}});return}this.socket.emit(`set_player_team`,{playerId:e,teamId:a},e=>{e?.ok||this.handleRoomError({message:e?.error??`Unable to change team side.`})})}updateTeamLineup(e,t,n){let r=this.store.getState().room,i=r?.teams[e],a=r?.lineups?.[e];if(!r||!i||!a||!Tt(n,i.playerIds))return;let o={...i,battingOrder:t===`batting`?n:i.battingOrder,bowlingOrder:t===`bowling`?n:i.bowlingOrder,currentBowlerId:t===`bowling`?n[0]??i.currentBowlerId:i.currentBowlerId},s={...a,battingOrder:t===`batting`?n:a.battingOrder,bowlingOrder:t===`bowling`?n:a.bowlingOrder};this.store.dispatch({type:W.SET_ROOM,payload:{...r,teams:{...r.teams,[e]:o},lineups:{...r.lineups,[e]:s}}})}lockLineups(){let e=this.store.getState().room;!e?.teams.alpha||!e.teams.beta||!e.lineups?.alpha||!e.lineups.beta||this.store.dispatch({type:W.SET_ROOM,payload:{...e,status:F.LINEUP,teams:{alpha:{...e.teams.alpha,lockedLineup:!0},beta:{...e.teams.beta,lockedLineup:!0}},lineups:{alpha:{...e.lineups.alpha,locked:!0},beta:{...e.lineups.beta,locked:!0}}}})}resetToHome(){this.resumeInFlight=!1,this.clearPendingRoomAction();let e=this.store.getState();e.room?.source===`realtime`&&this.socket.emit(`leave_room`,{},()=>{}),this.store.dispatch({type:W.RESET_FLOW}),e.room?.source===`offline`&&(this.socket.id&&this.store.dispatch({type:W.UPDATE_SESSION,payload:{localPlayerId:this.socket.id}}),this.store.dispatch({type:W.SET_CONNECTION,payload:{status:this.socket.id?L.CONNECTED:L.RECONNECTING,note:this.socket.id?`Connected to realtime backend`:`Connecting to realtime backend`,lastSyncAt:Date.now()}}))}discardRoom(){let e=this.store.getState();if(e.room){if(e.room.source===`offline`){this.resetToHome(),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:`Practice room discarded.`}}),this.pushToast(`Practice room discarded.`,`success`);return}if(e.room.hostId!==e.session.localPlayerId){this.handleRoomError({message:`Only the room host can discard the room.`});return}this.socket.emit(`discard_room`,{},e=>{e?.ok||this.handleRoomError({message:e?.error??`Unable to discard room.`})})}}toggleReady(){let e=this.store.getState(),t=e.room,n=e.session.localPlayerId,r=t?.players.find(e=>e.id===n);if(!(!t||!r)){if(t.source===`offline`){let e=r.status===`ready`?`unready`:`ready`,i=t.players.map(t=>t.id===n?{...t,status:e,connectionState:{...t.connectionState,note:e===`ready`?`Ready for practice toss`:`Reviewing practice settings`,lastSyncAt:Date.now()}}:t);this.store.dispatch({type:W.SET_ROOM,payload:{...t,players:i}}),this.store.dispatch({type:W.PATCH_UI,payload:{connectionBanner:e===`ready`?`Practice lobby ready. Start the toss when you want.`:`Practice lobby unlocked. Change settings or lineups before readying again.`}});return}this.socket.emit(`player_ready`,{ready:r.status!==`ready`},e=>{e?.ok||this.handleRoomError({message:e?.error??`Unable to change ready state.`})})}}removePlayer(e){let t=this.store.getState();if(!(!t.room||t.room.hostId!==t.session.localPlayerId||!e||e===t.room.hostId)){if(t.room.source===`offline`){this.pushToast(`AI players stay fixed in practice mode.`,`info`);return}this.socket.emit(`kick_player`,{playerId:e},n=>{if(n?.ok){let n=t.room?.players.find(t=>t.id===e)?.name??`Player`;this.pushToast(`${n} was removed from the room.`,`success`);return}this.handleRoomError({message:n?.error??`Unable to remove player.`})})}}},qn=document.querySelector(`#app`);if(!(qn instanceof HTMLElement))throw Error(`App root not found.`);var Jn=bt(yt(),Ie),Yn=new kn,Xn=new _t({root:qn,store:Jn,roomService:new Kn({store:Jn,socket:Yn}),matchService:new xn({store:Jn,socket:Yn}),signalSystem:new it({store:Jn,socket:Yn}),socket:Yn});vt(Jn,ht),Xn.mount();