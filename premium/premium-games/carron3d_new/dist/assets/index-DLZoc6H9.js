(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const xe={loading:"loading",mainMenu:"mainMenu",modeSelect:"modeSelect",localSetup:"localSetup",challenges:"challenges",challengePlaying:"challengePlaying",practice:"practice",playing:"playing",paused:"paused",rules:"rules",settings:"settings",result:"result",about:"about"},bi={settings:"gamehub.carrom3d.settings",playerNames:"gamehub.carrom3d.playerNames",challengeProgress:"gamehub.carrom3d.challengeProgress",onboardingSeen:"gamehub.carrom3d.onboardingSeen",tutorialCompleted:"gamehub.carrom3d.tutorialCompleted",practiceStats:"gamehub.carrom3d.practiceStats",cosmetics:"gamehub.carrom3d.cosmetics",onlineSession:"gamehub.carrom3d.onlineSession"},qe={matchMode:"local2p",playerOneName:"Player 1",playerTwoName:"Player 2",botDifficulty:"normal",ruleMode:"classic",classicRuleVariant:"casual",coinSide:"p1White",matchType:"classic",practiceType:"freePractice",boardStyle:"ivory"},bs={casual:{id:"casual",label:"Casual",hudLabel:"Classic - Casual",helper:"Forgiving local rules for quick games and beginners."},standard:{id:"standard",label:"Standard",hudLabel:"Classic - Standard",helper:"Cleaner queen and foul handling without strict dues."},strict:{id:"strict",label:"Strict",hudLabel:"Classic - Strict",helper:"Harder queen timing and due penalties for mistakes."}};function Ic(n){return bs[n]?n:"casual"}function wr(n="casual"){return bs[Ic(n)]}const el={ivory:{id:"ivory",label:"Ivory Royale",scene:{}},wood:{id:"wood",label:"Tournament Wood",scene:{tableBase:"#d9c0a0",boardSurface:"#c99458",boardSurfaceAccent:"#e4b87b",outerFrame:"#6c3f21",frameSide:"#3f2416",goldTrim:"#d7a65e",pocketDark:"#160e09",pocketRim:"#7f4c25",markingLine:"#4d2b17",shadow:"#3d2314"}},midnight:{id:"midnight",label:"Midnight Gold",scene:{tableBase:"#090d14",boardSurface:"#222936",boardSurfaceAccent:"#303948",outerFrame:"#8b642d",frameSide:"#080b10",goldTrim:"#dfb765",pocketDark:"#02050a",pocketRim:"#d9aa56",markingLine:"#f0d08b",shadow:"#030509"}}};function qh(n){return el[n]||el.ivory}function wo(n,e){const t=qh(e);return{...n,scene:{...n.scene,...t.scene}}}const Ft={matchMode:"local2p",matchModeLabel:"Local 2 Player",currentTurn:"Player 1",playerOneScore:"0",playerTwoScore:"0",queenStatus:"On board",shotPower:"Ready",shotPowerRatio:0,currentColor:"White",playerOneColor:"White",playerTwoColor:"Black",ruleMode:"classic",ruleModeLabel:"Classic Carrom",classicRuleVariant:"casual",classicRuleVariantLabel:"Casual",dueStatus:"",playerOneDue:0,playerTwoDue:0,coinAssignmentMode:"p1White",colorsAssigned:!0,playerOnePocketed:0,playerTwoPocketed:0,playerOneRemaining:9,playerTwoRemaining:9,scoringMode:"coins",playerOnePoints:0,playerTwoPoints:0,pointsLabel:"",botDifficulty:"",botDifficultyLabel:"",botStatus:"",currentIsBot:!1,onlineActive:!1,onlineRoomCode:"",onlineConnectionStatus:"",onlineTurnStatus:"",challengeActive:!1,challengeTitle:"",challengeObjective:"",challengeShots:"",challengeResult:"",practiceActive:!1,practiceTitle:"",practiceStatus:"",tutorialActive:!1,tutorialTitle:"",tutorialInstruction:"",turnNumber:1,shotNumber:0,foulStatus:"Clear",bannerTone:"default",status:"Place striker on the baseline, then drag to aim."},Wh=[{id:"local",title:"Local 2 Player",status:"Playable",description:"Play a complete local match on the same device with turns, fouls, and queen cover.",action:"select-local2p",disabled:!1},{id:"bot",title:"Vs Bot",status:"Playable",description:"Play a local human-vs-bot match with difficulty-based geometric shot planning.",action:"select-vs-bot",disabled:!1},{id:"practice",title:"Practice / Tutorial",status:"Playable",description:"Train striker control, pocket drills, and queen cover without match pressure.",action:"open-practice",disabled:!1},{id:"challenges",title:"Challenges",status:"Playable",description:"Clear curated solo shot objectives, earn stars, and save progress locally.",action:"open-challenges",disabled:!1},{id:"onlinePrivate",title:"Online Private Room",status:"MVP",description:"Create or join a memory-only private room and play online with server-owned turns.",action:"open-online",disabled:!1},{id:"onlinePublic",title:"Public Matchmaking",status:"MVP",description:"Find a casual online opponent and play with server-owned match state.",action:"open-public-matchmaking",disabled:!1}],Lc=[{title:"Controls",body:"Place the striker on the baseline, drag to aim, pull back for power, and release to shoot."},{title:"Objective",body:"Pocket your assigned coins before finishing the match with clean, controlled shots."},{title:"Casual Classic",body:"Forgiving classic play: own coins continue the turn, queen needs cover, and simple fouls return a coin when possible."},{title:"Standard Classic",body:"Standard play tightens queen and foul handling while keeping the match readable and fair."},{title:"Strict Classic",body:"Strict play blocks early queen claims, returns the final coin before queen cover, and records dues for hard fouls."},{title:"Queen",body:"Pocket the queen and cover it with your own coin to secure the royal finish."},{title:"Fouls",body:"Avoid pocketing the striker. Foul penalties return one of your pocketed own coins when available."},{title:"Match Flow",body:"Pocketing your own coin continues the turn. Empty shots and opponent-only pockets pass the table."},{title:"Free Capture",body:"Pocket any normal coin to score. Each coin is 1 point, the covered queen is 3 bonus points, and coin color does not matter."},{title:"Bot Mode",body:"Vs Bot uses the same physics and rules. The bot waits, places the striker, previews aim, and shoots without teleporting pieces."},{title:"Practice",body:"Practice mode lets you reset drills and train shots without turns, winners, or bot pressure."},{title:"Online Private",body:"Private rooms use server-owned turns, shot validation, and authoritative match state sync."},{title:"Online Public",body:"Public matchmaking pairs compatible casual players, then reuses the same online match engine."},{title:"Challenges",body:"Challenges are solo shot setups with limited shots, clear objectives, star ratings, and local-only progress."},{title:"Customization",body:"Cosmetic loadouts are saved on this device. Board, coin, striker, table, and VFX styles are visual only and do not change physics."}],kc=["auto","high","balanced","battery"],tl={high:{id:"high",pixelRatioDesktop:2,pixelRatioMobile:1.65,keyShadowMapSize:2048,spotShadowMapSize:1024,shadowEnabled:!0,vfxIntensity:1,ambientParticleScale:1},auto:{id:"auto",pixelRatioDesktop:1.5,pixelRatioMobile:1.25,keyShadowMapSize:1024,spotShadowMapSize:768,shadowEnabled:!0,vfxIntensity:.9,ambientParticleScale:.85},balanced:{id:"balanced",pixelRatioDesktop:1.25,pixelRatioMobile:1.1,keyShadowMapSize:1024,spotShadowMapSize:512,shadowEnabled:!0,vfxIntensity:.72,ambientParticleScale:.65},battery:{id:"battery",pixelRatioDesktop:1,pixelRatioMobile:1,keyShadowMapSize:512,spotShadowMapSize:256,shadowEnabled:!1,vfxIntensity:.46,ambientParticleScale:.34}};function il(n="auto"){return tl[n]||tl.auto}const H={BOARD_SIZE:6.4,PLAY_AREA_SIZE:5.34,FRAME_WIDTH:.53,BOARD_THICKNESS:.34,FRAME_HEIGHT:.34,SURFACE_Y:.08,POCKET_RADIUS:.26,POCKET_CENTER_OFFSET:2.35,COIN_RADIUS:.145,COIN_HEIGHT:.075,STRIKER_RADIUS:.22,STRIKER_HEIGHT:.085,CENTER_CLUSTER_SPACING:.33,BASELINE_OFFSET:2.08,BASELINE_HALF_LENGTH:1.55,MARKING_Y_OFFSET:.006},Hn={COIN_VISUAL_Y:H.SURFACE_Y+H.COIN_HEIGHT/2+.025,QUEEN_VISUAL_Y:H.SURFACE_Y+H.COIN_HEIGHT/2+.026,STRIKER_VISUAL_Y:H.SURFACE_Y+H.STRIKER_HEIGHT/2+.026},st={ACTIVE_BASELINE:"bottom",BASELINE_TOUCH_BAND:.42,PLACEMENT_PADDING:.015,PLACEMENT_SAMPLE_COUNT:25,AIM_START_RADIUS:.48,AIM_CANCEL_DISTANCE:.12,AIM_DRAG_MAX_DISTANCE:1.65,MIN_SHOT_POWER:.55,MAX_SHOT_POWER:14.4,POWER_SCALE:9.6},Ji={menu:{position:{x:-2.25,y:5.7,z:7.4},target:{x:0,y:.2,z:0}},gameplay:{position:{x:0,y:6.8,z:6.7},target:{x:0,y:.16,z:0}},top:{position:{x:0,y:8.6,z:.18},target:{x:0,y:.12,z:0}},cinematic:{position:{x:-3.15,y:4.35,z:6.1},target:{x:0,y:.18,z:0}},mobile:{position:{x:0,y:7.55,z:6.9},target:{x:0,y:.14,z:0}}},Ia={DURATION:.72,POSITION_LERP:9.5,TARGET_LERP:10.5},Eo="ivoryRoyale",ps={ivoryRoyale:{id:"ivoryRoyale",label:"Ivory Royale",css:{"--bg":"#f7f1e4","--bg-soft":"#fffaf1","--panel":"rgba(255, 250, 241, 0.74)","--panel-strong":"rgba(255, 247, 232, 0.94)","--panel-top":"rgba(255, 255, 255, 0.88)","--panel-subtle":"rgba(255, 251, 245, 0.96)","--panel-chip":"rgba(255, 248, 238, 0.84)","--surface-soft":"rgba(255, 251, 245, 0.84)","--surface-strong":"rgba(255, 255, 255, 0.68)","--panel-border":"rgba(155, 119, 61, 0.24)","--line-soft":"rgba(147, 117, 64, 0.18)","--line-strong":"rgba(147, 117, 64, 0.32)","--text":"#2c251d","--text-muted":"#756653","--accent":"#c89b52","--accent-soft":"rgba(200, 155, 82, 0.18)","--accent-strong":"#8d642b","--gold":"#b78a46","--gold-deep":"#8e6730","--gold-rich":"#a87329","--danger":"#a94435","--success":"#477a53","--warning":"#b87d2e","--shadow":"0 28px 84px rgba(70, 49, 21, 0.18)","--glow":"0 0 0 1px rgba(184, 138, 70, 0.15), 0 18px 40px rgba(183, 138, 70, 0.2)","--overlay-bg":"rgba(30, 22, 12, 0.24)","--glass-blur":"20px"},scene:{background:"#f7efe1",fog:"#eadbc0",floor:"#ece0c9",floorAccent:"#fff9ed",platform:"#f7f0e2",platformEdge:"#b58a4a",glow:"#f2c781",metal:"#b88d49",plaque:"#fff8ec",particle:"#ffe7b4",light:"#fff8ee",rim:"#f2c781",shadow:"#6a4318",tableBase:"#ece0c9",boardSurface:"#f6ecd8",boardSurfaceAccent:"#fff9ee",outerFrame:"#b8894a",frameSide:"#84602d",goldTrim:"#d5ad67",pocketDark:"#1e1813",pocketRim:"#b98945",markingLine:"#8f662d",whiteCoin:"#fff6e7",whiteCoinRim:"#c79b55",blackCoin:"#2f2925",blackCoinRim:"#b78a46",queen:"#a53a2d",queenRim:"#e3bd73",striker:"#fff4da",strikerGlow:"#f1c06f"}},midnightGold:{id:"midnightGold",label:"Midnight Gold",css:{"--bg":"#07090d","--bg-soft":"#101720","--panel":"rgba(13, 18, 25, 0.76)","--panel-strong":"rgba(17, 23, 33, 0.94)","--panel-top":"rgba(35, 46, 66, 0.86)","--panel-subtle":"rgba(20, 28, 42, 0.95)","--panel-chip":"rgba(25, 33, 48, 0.86)","--surface-soft":"rgba(18, 26, 40, 0.86)","--surface-strong":"rgba(43, 54, 75, 0.72)","--panel-border":"rgba(218, 174, 99, 0.28)","--line-soft":"rgba(151, 178, 255, 0.12)","--line-strong":"rgba(216, 173, 99, 0.32)","--text":"#f7eedf","--text-muted":"#c9b895","--accent":"#d8ad63","--accent-soft":"rgba(216, 173, 99, 0.18)","--accent-strong":"#f2d18c","--gold":"#d8ad63","--gold-deep":"#f2d18c","--gold-rich":"#9a7136","--danger":"#ff8a73","--success":"#8ed09b","--warning":"#f2bb66","--shadow":"0 30px 90px rgba(0, 0, 0, 0.42)","--glow":"0 0 0 1px rgba(216, 173, 99, 0.18), 0 18px 40px rgba(41, 55, 93, 0.26)","--overlay-bg":"rgba(5, 8, 14, 0.54)","--glass-blur":"22px"},scene:{background:"#07090d",fog:"#101720",floor:"#171f2a",floorAccent:"#2b3340",platform:"#131922",platformEdge:"#d8ad63",glow:"#d8ad63",metal:"#f2d18c",plaque:"#19212d",particle:"#f2d18c",light:"#f9e8c9",rim:"#d8ad63",shadow:"#02050a",tableBase:"#171f2a",boardSurface:"#242c38",boardSurfaceAccent:"#2f3846",outerFrame:"#84602d",frameSide:"#07090d",goldTrim:"#d8ad63",pocketDark:"#02050a",pocketRim:"#d8ad63",markingLine:"#f2d18c",whiteCoin:"#efe4d0",whiteCoinRim:"#d8ad63",blackCoin:"#080b10",blackCoinRim:"#8e6730",queen:"#b94a3b",queenRim:"#f2d18c",striker:"#f7eedf",strikerGlow:"#d8ad63"}}};function nl(n){return ps[n]||ps[Eo]}const sl={uiClick:{type:"sine",frequency:520,duration:.055,gain:.035},matchStart:{type:"triangle",frequency:330,duration:.32,gain:.065,sweep:180},shotRelease:{type:"sawtooth",frequency:155,duration:.13,gain:.06,sweep:70},collisionSoft:{type:"triangle",frequency:420,duration:.055,gain:.035},collisionHard:{type:"square",frequency:260,duration:.075,gain:.045},pocketCoin:{type:"sine",frequency:610,duration:.18,gain:.055,sweep:-220},queenPocket:{type:"triangle",frequency:520,duration:.28,gain:.07,sweep:190},queenCovered:{type:"sine",frequency:740,duration:.34,gain:.07,sweep:260},queenReturned:{type:"sawtooth",frequency:220,duration:.2,gain:.055,sweep:-90},foul:{type:"square",frequency:165,duration:.22,gain:.065,sweep:-55},turnChange:{type:"triangle",frequency:440,duration:.16,gain:.045,sweep:110},win:{type:"sine",frequency:520,duration:.5,gain:.075,sweep:340},reset:{type:"triangle",frequency:280,duration:.14,gain:.04,sweep:80}},La={shotRelease:{url:new URL(""+new URL("stiker_hit-BJaMjzYi.mp4",import.meta.url).href,import.meta.url).href,gain:.88},collisionSoft:{url:new URL(""+new URL("collison-GLfeurjD.mp4",import.meta.url).href,import.meta.url).href,gain:.52},collisionHard:{url:new URL(""+new URL("collison-GLfeurjD.mp4",import.meta.url).href,import.meta.url).href,gain:.72}};class Xh{constructor(e={}){this.settings=e,this.context=null,this.master=null,this.unlocked=!1,this.lastPlayed=new Map,this.assetBuffers=new Map,this.assetPromises=new Map,this.assetFailures=new Set,this.boundUnlock=()=>this.unlock()}init(){typeof window>"u"||(window.addEventListener("pointerdown",this.boundUnlock,{once:!0,passive:!0}),window.addEventListener("keydown",this.boundUnlock,{once:!0}))}updateSettings(e){this.settings=e,this.master&&(this.master.gain.value=this.settings.sound?.72:0)}unlock(){if(this.unlocked||typeof window>"u")return;const e=window.AudioContext||window.webkitAudioContext;e&&(this.context=this.context||new e,this.master=this.master||this.context.createGain(),this.master.gain.value=this.settings.sound?.72:0,this.master.connect(this.context.destination),this.context.resume?.(),this.unlocked=!0,this.preloadAssets())}play(e,{intensity:t=1,throttle:i=.035}={}){if(!this.settings.sound||(this.unlock(),!this.context||!this.master))return;const s=this.context.currentTime,a=this.lastPlayed.get(e)??-1/0;s-a<i||(this.lastPlayed.set(e,s),!this.playAsset(e,t,s)&&(this.loadAsset(e),this.playSynth(e,t,s)))}preloadAssets(){Object.keys(La).forEach(e=>this.loadAsset(e))}loadAsset(e){const t=La[e];if(!t||!this.context||this.assetBuffers.has(e)||this.assetFailures.has(e))return null;if(this.assetPromises.has(e))return this.assetPromises.get(e);const i=fetch(t.url).then(s=>{if(!s.ok)throw new Error(`Audio asset failed: ${e}`);return s.arrayBuffer()}).then(s=>this.context.decodeAudioData(s)).then(s=>(this.assetBuffers.set(e,s),this.assetPromises.delete(e),s)).catch(()=>(this.assetFailures.add(e),this.assetPromises.delete(e),null));return this.assetPromises.set(e,i),i}playAsset(e,t,i=this.context?.currentTime||0){const s=La[e],a=this.assetBuffers.get(e);if(!s||!a||!this.context||!this.master)return!1;const r=Math.min(Math.max(t,.15),1.8),o=this.context.createBufferSource(),l=this.context.createGain();return o.buffer=a,o.playbackRate.setValueAtTime(Math.min(1.08,.96+r*.04),i),l.gain.setValueAtTime(Math.min(s.gain*r,1.15),i),l.gain.exponentialRampToValueAtTime(1e-4,i+Math.min(a.duration,1.4)),o.connect(l),l.connect(this.master),o.start(i),o.stop(i+a.duration),!0}playSynth(e,t,i=this.context?.currentTime||0){const s=sl[e]||sl.uiClick,a=Math.min(Math.max(t,.15),1.8),r=this.context.createOscillator(),o=this.context.createGain(),l=this.context.createBiquadFilter();r.type=s.type,r.frequency.setValueAtTime(s.frequency,i),r.frequency.exponentialRampToValueAtTime(Math.max(40,s.frequency+(s.sweep||0)*a),i+s.duration),l.type="lowpass",l.frequency.setValueAtTime(1400+a*900,i),o.gain.setValueAtTime(0,i),o.gain.linearRampToValueAtTime(s.gain*a,i+.01),o.gain.exponentialRampToValueAtTime(1e-4,i+s.duration),r.connect(l),l.connect(o),o.connect(this.master),r.start(i),r.stop(i+s.duration+.025)}playCollision(e){this.play(e>.62?"collisionHard":"collisionSoft",{intensity:e,throttle:.055})}dispose(){typeof window<"u"&&(window.removeEventListener("pointerdown",this.boundUnlock),window.removeEventListener("keydown",this.boundUnlock)),this.context?.close?.(),this.context=null,this.master=null,this.assetBuffers.clear(),this.assetPromises.clear(),this.assetFailures.clear()}}const Dc={easy:{id:"easy",label:"Easy",defaultName:"Easy Bot",thinkingMinMs:1e3,thinkingMaxMs:1400,previewMs:700,baselineSamples:7,choiceTopN:5,aimErrorDegrees:8,powerErrorRatio:.18,queenRisk:.18,queenCoverPriority:28,bankChance:0,bankDirectScoreThreshold:-999,bankScorePenalty:42,anglePenaltyScale:22,scratchPenaltyScale:.78,opponentPenalty:18,riskyPowerScale:.9,mistakeChance:.16,mistakeSpread:5,blockedPenalty:24,foulRiskPenalty:16,fallbackPower:2.3},normal:{id:"normal",label:"Normal",defaultName:"Royal Bot",thinkingMinMs:650,thinkingMaxMs:1e3,previewMs:560,baselineSamples:11,choiceTopN:3,aimErrorDegrees:4,powerErrorRatio:.1,queenRisk:.44,queenCoverPriority:44,bankChance:.16,bankDirectScoreThreshold:72,bankScorePenalty:28,anglePenaltyScale:32,scratchPenaltyScale:1,opponentPenalty:30,riskyPowerScale:.82,mistakeChance:.08,mistakeSpread:4,blockedPenalty:36,foulRiskPenalty:26,fallbackPower:2.8},hard:{id:"hard",label:"Hard",defaultName:"Master Bot",thinkingMinMs:450,thinkingMaxMs:750,previewMs:460,baselineSamples:15,choiceTopN:2,aimErrorDegrees:1.7,powerErrorRatio:.05,queenRisk:.68,queenCoverPriority:62,bankChance:.38,bankDirectScoreThreshold:86,bankScorePenalty:18,anglePenaltyScale:44,scratchPenaltyScale:1.35,opponentPenalty:48,riskyPowerScale:.74,mistakeChance:.035,mistakeSpread:3,blockedPenalty:54,foulRiskPenalty:42,fallbackPower:3.1}};function ga(n="normal"){return Dc[n]?n:"normal"}function Sn(n="normal"){return Dc[ga(n)]}function ra(n="normal"){return Sn(n).defaultName}class $h{constructor(e,t="normal"){this.id=e?.id||"player-2",this.name=e?.name||"Royal Bot",this.color=e?.color||null,this.difficulty=ga(t||e?.difficulty),this.profile=Sn(this.difficulty)}update(e,t=this.difficulty){return this.id=e?.id||this.id,this.name=e?.name||this.name,this.color=e?.color||null,this.difficulty=ga(t),this.profile=Sn(this.difficulty),this}}class Yh{constructor(e){this.profile=e}scoreCandidate(e,t={}){const i=e.targetPriority||0,s=Math.max(0,30-e.targetDistance*5.6),a=Math.max(0,22-e.strikerDistance*4.2),r=Math.max(0,6-Math.abs(e.strikerPosition.x)*2.2),o=e.shotType==="direct"?10:-this.profile.bankScorePenalty,l=e.target.type==="queen"?t.queenAllowed&&t.canRiskQueen?20:-80:0,c=t.coverRequired&&e.target.type!=="queen"?this.profile.queenCoverPriority:0,h=e.targetOwnership==="opponent"?this.profile.opponentPenalty:0,u=e.strikerBlockers.length*this.profile.blockedPenalty+e.targetBlockers.length*this.profile.blockedPenalty*.85+(e.bankBlockers?.length||0)*this.profile.blockedPenalty*.68,p=(e.angleDifficulty||0)*this.profile.anglePenaltyScale,f=e.shotType==="bank"?Math.abs((e.bankAngle||0)-1.1)*9:0,g=(e.scratchRisk||0)*this.profile.foulRiskPenalty*this.profile.scratchPenaltyScale,v=Math.max(0,e.estimatedPower-5.25)*3.2,m=e.strictFinalCoinRisk?140:0,d=e.target.type==="queen"&&!t.coverAvailable?32:0;return i+s+a+r+o+l+c-u-p-f-g-v-h-m-d}}function Bn(n,e,t){return Math.min(Math.max(n,e),t)}function Kh(n){return Math.hypot(n.x,n.z)}function Pi(n,e){return Math.hypot(n.x-e.x,n.z-e.z)}function di(n,e={x:0,z:1}){const t=Kh(n);return t<1e-4?{...e}:{x:n.x/t,z:n.z/t}}function To(n,e){return{x:n.x+e.x,z:n.z+e.z}}function vn(n,e){return{x:n.x-e.x,z:n.z-e.z}}function Co(n,e){return{x:n.x*e,z:n.z*e}}function al(n,e){const t=Math.cos(e),i=Math.sin(e);return{x:n.x*t-n.z*i,z:n.x*i+n.z*t}}function Oc(n,e){const t=di(n),i=di(e);return Math.acos(Bn(Uc(t,i),-1,1))}function rl(n,e){return n+Math.random()*(e-n)}function Nc(n,e,t){const i=vn(t,e),s=i.x*i.x+i.z*i.z;if(s<=1e-5)return Pi(n,e);const a=Bn(((n.x-e.x)*i.x+(n.z-e.z)*i.z)/s,0,1);return Pi(n,{x:e.x+i.x*a,z:e.z+i.z*a})}function jh(n="top"){const e=-1.55+H.STRIKER_RADIUS,t=H.BASELINE_HALF_LENGTH-H.STRIKER_RADIUS,i=H.BASELINE_OFFSET;return n==="top"?{minX:e,maxX:t,fixedZ:-i}:{minX:e,maxX:t,fixedZ:i}}function ol(n="top",e=11){const t=jh(n),i=Math.max(3,e);return Array.from({length:i},(s,a)=>{const r=i===1?.5:a/(i-1);return{x:t.minX+(t.maxX-t.minX)*r,z:t.fixedZ}})}function ll(n,e,t,i=new Set){return!t.some(s=>{if(i.has(s.id)||s.isPocketed)return!1;const a=e+s.radius+st.PLACEMENT_PADDING;return Pi(n,s.position)<a})}function Rs(n,e,t,{ignoreIds:i=new Set,clearance:s=H.COIN_RADIUS*1.75}={}){return t.filter(a=>{if(i.has(a.id)||a.isPocketed||a.type==="striker")return!1;const r=s+a.radius*.35;return Nc(a.position,n,e)<r})}function cl(n,e,t,i=2.55){const s=di(e,{x:0,z:-1}),a=To(n,Co(s,i)),r=H.STRIKER_RADIUS*1.45;return t.reduce((o,l)=>{if(!(Uc(vn(l.position,n),s)>0))return o;const h=Nc(l.position,n,a);if(h>=r)return o;const u=1-h/r;return Math.max(o,u)},0)}function Uc(n,e){return n.x*e.x+n.z*e.z}function Qh(n,e){const t=H.PLAY_AREA_SIZE/2-H.COIN_RADIUS*.65;return[{id:"left",axis:"x",value:-t},{id:"right",axis:"x",value:t},{id:"top",axis:"z",value:-t},{id:"bottom",axis:"z",value:t}].map(s=>{const a=s.axis==="x"?{x:s.value*2-e.position.x,z:e.position.z}:{x:e.position.x,z:s.value*2-e.position.z},r=di(vn(a,n.position)),o=s.axis==="x"?r.x:r.z;if(Math.abs(o)<1e-4)return null;const l=s.axis==="x"?n.position.x:n.position.z,c=(s.value-l)/o;if(c<=H.COIN_RADIUS*1.8)return null;const h=To(n.position,Co(r,c)),u=s.axis==="x"?h.z:h.x;if(Math.abs(u)>t)return null;const p=di(vn(e.position,h)),f=Oc(r,p);return f<.18||f>2.45?null:{railId:s.id,railPoint:h,reflectedPocket:a,travelDirection:r,railToPocket:p,bankAngle:f,totalDistance:Pi(n.position,h)+Pi(h,e.position)}}).filter(Boolean)}function ka(n){return n.type==="coin"&&(n.color==="white"||n.color==="black")}function Zh(n={}){return n.state==="onBoard"||n.state==="returned"||!n.state}class Jh{constructor({debugBot:e=!1}={}){this.debugBot=e}plan({snapshot:e,matchState:t,botPlayer:i,baseline:s="top",difficulty:a="normal"}){const r=Sn(a),o=new Yh(r);if(!e)return this.createFallbackPlan({snapshot:{pockets:[],striker:null},activeBodies:[],striker:null,baseline:s,profile:r,reason:"missing-snapshot"});const l=e.activeBodies||e.bodies?.filter(P=>!P.isPocketed)||[],c=e.striker,h=this.getContext(t,i,r,l);h.pockets=e.pockets||[];const u=this.getTargets(l,t,i,r,h),p=ol(s,r.baselineSamples);if(!c||!u.length)return this.createFallbackPlan({snapshot:e,activeBodies:l,striker:c,baseline:s,profile:r,reason:"no-targets"});const f=this.createDirectCandidates({snapshot:e,activeBodies:l,striker:c,targets:u,strikerPositions:p,profile:r,evaluator:o,context:h,baseline:s}),g=f.reduce((P,O)=>Math.max(P,O.score),-1/0),m=r.bankChance>0&&(!f.length||g<r.bankDirectScoreThreshold&&Math.random()<=r.bankChance)?this.createBankCandidates({snapshot:e,activeBodies:l,striker:c,targets:u,strikerPositions:p,profile:r,evaluator:o,context:h,baseline:s}):[],d=[...f,...m];if(!d.length)return this.createFallbackPlan({snapshot:e,activeBodies:l,striker:c,baseline:s,profile:r,reason:"no-candidates"});d.sort((P,O)=>O.score-P.score);const E=Math.random()<r.mistakeChance,M=r.choiceTopN+(E?r.mistakeSpread:0),b=Math.max(1,Math.min(M,d.length)),R=d[Math.floor(Math.random()*b)],T=this.applyDifficultyError(R,r);return this.debugBot&&(T.debug={candidates:d.length,directCandidates:f.length,bankCandidates:m.length,bestDirectScore:Number(g.toFixed(2)),target:R.target.id,pocket:R.pocket.id,shotType:R.shotType,score:Number(R.score.toFixed(2)),scratchRisk:Number((R.scratchRisk||0).toFixed(2)),mistake:E}),T}createDirectCandidates({snapshot:e,activeBodies:t,striker:i,targets:s,strikerPositions:a,profile:r,evaluator:o,context:l,baseline:c}){const h=[];return s.forEach(u=>{e.pockets.forEach(p=>{const f=di(vn(p.position,u.position)),g=Rs(u.position,p.position,t,{ignoreIds:new Set([u.id,i.id]),clearance:u.radius*1.55});this.addPlacementCandidates({candidates:h,activeBodies:t,striker:i,strikerPositions:a,profile:r,evaluator:o,context:l,baseline:c,target:u,pocket:p,travelDirection:f,targetDistance:Pi(u.position,p.position),targetBlockers:g,bankBlockers:[],shotType:"direct"})})}),h}createBankCandidates({snapshot:e,activeBodies:t,striker:i,targets:s,strikerPositions:a,profile:r,evaluator:o,context:l,baseline:c}){const h=[];return s.forEach(u=>{e.pockets.forEach(p=>{Qh(u,p).forEach(f=>{const g=Rs(u.position,f.railPoint,t,{ignoreIds:new Set([u.id,i.id]),clearance:u.radius*1.45}),v=Rs(f.railPoint,p.position,t,{ignoreIds:new Set([u.id,i.id]),clearance:u.radius*1.25});this.addPlacementCandidates({candidates:h,activeBodies:t,striker:i,strikerPositions:a,profile:r,evaluator:o,context:l,baseline:c,target:u,pocket:p,travelDirection:f.travelDirection,targetDistance:f.totalDistance,targetBlockers:g,bankBlockers:v,bankPath:f,shotType:"bank"})})})}),h}addPlacementCandidates({candidates:e,activeBodies:t,striker:i,strikerPositions:s,profile:a,evaluator:r,context:o,baseline:l,target:c,pocket:h,travelDirection:u,targetDistance:p,targetBlockers:f,bankBlockers:g,bankPath:v=null,shotType:m}){const d=i.radius+c.radius,E=To(c.position,Co(u,-d));s.forEach(M=>{if(!ll(M,i.radius,t,new Set([i.id])))return;const b=di(vn(E,M),{x:0,z:l==="top"?1:-1}),R=Pi(M,E),T=Rs(M,E,t,{ignoreIds:new Set([c.id,i.id]),clearance:i.radius*1.3});Bn(Oc(b,u)/(Math.PI*.5),0,1.5);const P=cl(M,b,o.pockets,Math.min(R+.65,3.15)),O=this.estimatePower(R,p,c.type,m),x={shotType:m,target:c,pocket:h,strikerPosition:M,impactPoint:E,direction:b,travelDirection:u,strikerDistance:R,targetDistance:p,estimatedPower:O,targetPriority:c.priority,targetOwnership:c.ownership,strikerBlockers:T,targetBlockers:f,bankBlockers:g,bankRailId:v?.railId||"",bankRailPoint:v?.railPoint||null,bankAngle:v?.bankAngle||0,scratchRisk:P,strictFinalCoinRisk:!!c.strictFinalCoinRisk,baseline:l,difficulty:a.id};x.score=r.scoreCandidate(x,o),e.push(x)})}getContext(e,t,i,s=[]){const a=e?.queen||{},r=e?.ruleMode||"classic",o=e?.classicRuleVariant||"casual",l=e?.players?.find(d=>d.id===t.id)||{},c=s.filter(ka),h=c.filter(d=>d.color===t.color),u=a.state==="pendingCover"&&a.pendingCoverPlayerId===t.id,p=r==="freeCapture"?c.length>0:!t.color||h.length>0,f=l.pocketedOwnCoinIds?.length||0,g=a.state==="covered",v=o==="strict",m=Zh(a)&&p&&(!v||f>0);return{ruleMode:r,variant:o,strict:v,pockets:[],coverRequired:u,coverAvailable:p,canRiskQueen:Math.random()<=i.queenRisk,queenAllowed:m,queenCovered:g,ownPocketedCount:f,finalOwnCoinRisk:v&&!g&&!!t.color&&h.length<=1}}getTargets(e,t,i,s,a){a.pockets=t?.pockets||a.pockets;const r=t?.ruleMode||"classic",o=t?.queen||{},l=r==="freeCapture"||t?.coinAssignment?.isAssigned!==!1,c=o.state==="pendingCover"&&o.pendingCoverPlayerId===i.id,h=e.filter(ka),u=e.find(v=>v.type==="queen");if(c)return h.filter(v=>r==="freeCapture"||!i.color||v.color===i.color).map(v=>({...v,priority:98,ownership:"cover"}));if(r==="freeCapture"){const v=h.map(m=>({...m,priority:70,ownership:"any"}));return u&&a.queenAllowed&&a.canRiskQueen&&v.push({...u,priority:48+s.queenCoverPriority*.22,ownership:"queen"}),v}if(!l||!i.color)return h.map(v=>({...v,priority:66,ownership:"open"}));const p=h.filter(v=>v.color===i.color),f=h.filter(v=>v.color!==i.color),g=p.map(v=>({...v,priority:a.finalOwnCoinRisk?12:82,ownership:"own",strictFinalCoinRisk:a.finalOwnCoinRisk}));return u&&a.queenAllowed&&a.canRiskQueen&&g.push({...u,priority:42+s.queenCoverPriority*.18,ownership:"queen"}),(!g.length||g.every(v=>v.strictFinalCoinRisk))&&f.forEach(v=>{g.push({...v,priority:8,ownership:"opponent"})}),g.length?g:h.map(v=>({...v,priority:12,ownership:"safety"}))}estimatePower(e,t,i,s="direct"){const a=i==="queen"?.28:0,r=s==="bank"?.46:0;return Bn(1+e*.78+t*.54+a+r,st.MIN_SHOT_POWER,st.MAX_SHOT_POWER*.96)}applyDifficultyError(e,t){const i=e.shotType==="bank"?1.2:1,s=rl(-t.aimErrorDegrees,t.aimErrorDegrees)*i*Math.PI/180,a=di(al(e.direction,s),e.direction),r=1+rl(-t.powerErrorRatio,t.powerErrorRatio),o=e.scratchRisk>.38?t.riskyPowerScale:1,l=Bn(e.estimatedPower*r*o,st.MIN_SHOT_POWER,st.MAX_SHOT_POWER);return{type:"bot-shot",shotType:e.shotType,targetId:e.target.id,targetType:e.target.type,targetColor:e.target.color,targetOwnership:e.targetOwnership,pocketId:e.pocket.id,bankRailId:e.bankRailId,strikerPosition:{...e.strikerPosition},impactPoint:{...e.impactPoint},direction:a,power:l,powerRatio:l/st.MAX_SHOT_POWER,score:e.score,scratchRisk:e.scratchRisk,baseline:e.baseline,difficulty:t.id}}createFallbackPlan({snapshot:e,activeBodies:t,striker:i,baseline:s,profile:a,reason:r}){const o=i||e.striker||{radius:H.STRIKER_RADIUS,id:"striker-1"},l=ol(s,a.baselineSamples),c=l.find(m=>ll(m,o.radius,t,new Set([o.id])))||l[Math.floor(l.length/2)]||{x:0,z:s==="top"?-2.08:H.BASELINE_OFFSET},u=t.filter(ka).slice().sort((m,d)=>Pi(m.position,c)-Pi(d.position,c))[0],p=u?.position||{x:0,z:0};let f=di(vn(p,c),{x:0,z:s==="top"?1:-1});const g=cl(c,f,e.pockets||[],2.4);g>.42&&(f=di(al(f,s==="top"?.28:-.28),f));const v=Bn(a.fallbackPower*(g>.42?.82:1),st.MIN_SHOT_POWER,st.MAX_SHOT_POWER*.62);return{type:"bot-fallback-shot",shotType:"safety",reason:r,targetId:u?.id||"",targetType:u?.type||"",targetColor:u?.color||"",pocketId:"",strikerPosition:c,impactPoint:p,direction:f,power:v,powerRatio:v/st.MAX_SHOT_POWER,score:-1,scratchRisk:g,baseline:s,difficulty:a.id}}}function eu(n){return n.thinkingMinMs+Math.random()*(n.thinkingMaxMs-n.thinkingMinMs)}class tu{constructor({sceneRenderer:e,getMatchStateManager:t,getAppState:i,canRun:s=null,callbacks:a={},debugBot:r=!1}){this.sceneRenderer=e,this.getMatchStateManager=t,this.getAppState=i,this.canRun=s,this.callbacks=a,this.debugBot=r,this.planner=new Jh({debugBot:r}),this.botPlayer=new $h(null),this.timerId=0,this.phase="idle",this.paused=!1,this.pendingPlan=null}scheduleTurn({reason:e="turn-ready"}={}){if(this.clearTimer(),this.pendingPlan=null,this.phase="idle",!this.canRunBotTurn())return!1;const t=this.getMatchStateManager?.(),i=t?.getCurrentPlayer?.(),s=t?.state?.botDifficulty||i?.difficulty||"normal";this.botPlayer.update(i,s);const a=this.botPlayer.profile,r=eu(a);return this.phase="thinking",this.sceneRenderer?.setInputEnabled(!1),this.callbacks.onStatus?.(`${this.botPlayer.name} is lining up a shot...`,{shotPower:"Bot",shotPowerRatio:0,botStatus:"thinking"}),this.debug("scheduled bot turn",{reason:e,delay:r,difficulty:a.id}),this.timerId=globalThis.setTimeout(()=>this.planShot(),r),!0}planShot(){if(this.timerId=0,!this.canRunBotTurn()){this.phase="idle";return}const e=this.getMatchStateManager?.(),t=e.getCurrentPlayer();this.botPlayer.update(t,e.state.botDifficulty);const i=this.sceneRenderer?.getBoardSnapshot?.(),s=e.getActiveBaseline(),a=this.planner.plan({snapshot:i,matchState:e.state,botPlayer:this.botPlayer,baseline:s,difficulty:this.botPlayer.difficulty});this.pendingPlan=a,this.phase="preview",this.sceneRenderer?.placeStrikerForBot(a.strikerPosition),this.sceneRenderer?.previewBotShot(a),this.callbacks.onStatus?.(`${this.botPlayer.name} aiming ${a.shotType==="bank"?"a bank shot":"a shot"}...`,{shotPower:`${Math.round((a.powerRatio||0)*100)}%`,shotPowerRatio:a.powerRatio||0,botStatus:"aiming"}),this.debug("bot plan",a.debug||{target:a.targetId,pocket:a.pocketId,score:a.score});const r=Sn(this.botPlayer.difficulty);this.timerId=globalThis.setTimeout(()=>this.fireShot(),r.previewMs)}fireShot(){if(this.timerId=0,!this.canRunBotTurn()||!this.pendingPlan){this.phase="idle";return}const e=this.pendingPlan;if(this.phase="shooting",!(this.sceneRenderer?.fireBotShot?.(e)||!1)){this.sceneRenderer?.clearBotPreview?.(),this.callbacks.onStatus?.(`${this.botPlayer.name} is finding a safer shot...`,{shotPower:"Bot",shotPowerRatio:0,botStatus:"thinking"}),this.debug("bot shot blocked, rescheduling",{target:e.targetId}),this.timerId=globalThis.setTimeout(()=>this.scheduleTurn({reason:"blocked-shot"}),320);return}this.callbacks.onShotFired?.(e,this.botPlayer),this.callbacks.onStatus?.(`${this.botPlayer.name} shot in motion...`,{shotPower:"Moving",shotPowerRatio:1,botStatus:"shooting"})}pause(){this.paused=!0,this.clearTimer(),this.sceneRenderer?.clearBotPreview?.()}resume(){this.paused&&(this.paused=!1,this.canRunBotTurn()&&this.scheduleTurn({reason:"resume"}))}cancel(){this.clearTimer(),this.pendingPlan=null,this.phase="idle",this.paused=!1,this.sceneRenderer?.clearBotPreview?.()}dispose(){this.cancel()}canRunBotTurn(){if(this.paused||this.getAppState?.()!=="playing"||this.canRun?.()===!1)return!1;const e=this.getMatchStateManager?.(),t=e?.getCurrentPlayer?.(),i=this.sceneRenderer?.getPhysicsSummary?.();return!!(e&&e.state?.status==="playing"&&t?.isBot&&!i?.anyMoving)}clearTimer(){this.timerId&&(globalThis.clearTimeout(this.timerId),this.timerId=0)}debug(e,t={}){this.debugBot&&console.debug("[Carrom3D bot]",e,t)}}const hi="striker-1",Oi="queen-red-1";function ci({id:n,title:e,objectiveText:t,activePieceIds:i,placements:s,targetPieceIds:a=[],targetPocketId:r="",highlights:o=[],resetToDefault:l=!1}){return{id:n,title:e,objectiveText:t,resetToDefault:l,activePieceIds:i,placements:{[hi]:{x:0,z:H.BASELINE_OFFSET},...s},targetPieceIds:a,targetPocketId:r,highlights:[{id:`${n}-baseline`,type:"baseline",baseline:"bottom"},...o]}}function en(n,e,t,i="coin"){return[{id:`${n}-piece`,type:"piece",pieceId:e,tone:i},{id:`${n}-pocket`,type:"pocket",pocketId:t}]}const Ai=[{id:"easy-pocket-1",title:"Easy Pocket I",type:"easyPocket",difficulty:"easy",description:"A straight starter pocket to lock in striker feel.",objectiveText:"Pocket the white coin in 1 shot.",shotLimit:1,idealShots:1,boardSetup:ci({id:"easy-pocket-1",title:"Easy Pocket I",objectiveText:"Pocket the white coin in 1 shot.",activePieceIds:[hi,"inner-white-coin-1"],placements:{"inner-white-coin-1":{x:1.28,z:1.48}},targetPieceIds:["inner-white-coin-1"],targetPocketId:"pocket-4",highlights:en("easy-pocket-1","inner-white-coin-1","pocket-4")})},{id:"easy-pocket-2",title:"Easy Pocket II",type:"easyPocket",difficulty:"easy",description:"A clean black-coin starter from the opposite lane.",objectiveText:"Pocket the black coin in 1 shot.",shotLimit:1,idealShots:1,boardSetup:ci({id:"easy-pocket-2",title:"Easy Pocket II",objectiveText:"Pocket the black coin in 1 shot.",activePieceIds:[hi,"inner-black-coin-2"],placements:{"inner-black-coin-2":{x:-1.28,z:1.48}},targetPieceIds:["inner-black-coin-2"],targetPocketId:"pocket-3",highlights:en("easy-pocket-2","inner-black-coin-2","pocket-3")})},{id:"angle-shot-1",title:"Angle Shot I",type:"angleShot",difficulty:"normal",description:"Pocket an angled coin with two attempts.",objectiveText:"Pocket the highlighted coin in 2 shots or less.",shotLimit:2,idealShots:1,boardSetup:ci({id:"angle-shot-1",title:"Angle Shot I",objectiveText:"Pocket the highlighted coin in 2 shots or less.",activePieceIds:[hi,"outer-white-coin-2"],placements:{"outer-white-coin-2":{x:.78,z:.92}},targetPieceIds:["outer-white-coin-2"],targetPocketId:"pocket-4",highlights:en("angle-shot-1","outer-white-coin-2","pocket-4")})},{id:"angle-shot-2",title:"Angle Shot II",type:"angleShot",difficulty:"normal",description:"A sharper angle with less margin for lazy power.",objectiveText:"Pocket the highlighted coin in 2 shots or less.",shotLimit:2,idealShots:1,boardSetup:ci({id:"angle-shot-2",title:"Angle Shot II",objectiveText:"Pocket the highlighted coin in 2 shots or less.",activePieceIds:[hi,"outer-black-coin-3"],placements:{"outer-black-coin-3":{x:-.72,z:.74}},targetPieceIds:["outer-black-coin-3"],targetPocketId:"pocket-3",highlights:en("angle-shot-2","outer-black-coin-3","pocket-3")})},{id:"queen-cover-1",title:"Queen Cover I",type:"queenCover",difficulty:"normal",description:"Claim the queen, then cover with the normal coin.",objectiveText:"Pocket the queen and cover it before the shot limit.",shotLimit:3,idealShots:2,queenRequired:!0,coverPieceId:"inner-white-coin-3",boardSetup:ci({id:"queen-cover-1",title:"Queen Cover I",objectiveText:"Pocket the queen, then cover with the white coin.",activePieceIds:[hi,Oi,"inner-white-coin-3"],placements:{[Oi]:{x:1.28,z:1.48},"inner-white-coin-3":{x:-1.15,z:1.35}},targetPieceIds:[Oi,"inner-white-coin-3"],targetPocketId:"pocket-4",highlights:[{id:"queen-cover-1-queen",type:"piece",pieceId:Oi,tone:"queen"},{id:"queen-cover-1-cover",type:"piece",pieceId:"inner-white-coin-3"},{id:"queen-cover-1-pocket",type:"pocket",pocketId:"pocket-4"}]})},{id:"queen-cover-2",title:"Queen Cover II",type:"queenCover",difficulty:"hard",description:"A tighter queen-cover route with a harder cover coin.",objectiveText:"Pocket the queen and cover it before the shot limit.",shotLimit:3,idealShots:2,queenRequired:!0,coverPieceId:"inner-black-coin-4",boardSetup:ci({id:"queen-cover-2",title:"Queen Cover II",objectiveText:"Pocket the queen, then cover with the black coin.",activePieceIds:[hi,Oi,"inner-black-coin-4"],placements:{[Oi]:{x:-1.2,z:1.46},"inner-black-coin-4":{x:1.08,z:1.02}},targetPieceIds:[Oi,"inner-black-coin-4"],targetPocketId:"pocket-3",highlights:[{id:"queen-cover-2-queen",type:"piece",pieceId:Oi,tone:"queen"},{id:"queen-cover-2-cover",type:"piece",pieceId:"inner-black-coin-4"},{id:"queen-cover-2-pocket",type:"pocket",pocketId:"pocket-3"}]})},{id:"bank-basic-1",title:"Bank Basic I",type:"bankBasic",difficulty:"normal",description:"Use the rail if you need it. V1 checks the pocketed target.",objectiveText:"Pocket the highlighted coin in 2 shots or less.",shotLimit:2,idealShots:2,boardSetup:ci({id:"bank-basic-1",title:"Bank Basic I",objectiveText:"Pocket the highlighted coin in 2 shots or less.",activePieceIds:[hi,"outer-white-coin-4"],placements:{"outer-white-coin-4":{x:1.96,z:.15}},targetPieceIds:["outer-white-coin-4"],targetPocketId:"pocket-4",highlights:en("bank-basic-1","outer-white-coin-4","pocket-4")})},{id:"bank-basic-2",title:"Bank Basic II",type:"bankBasic",difficulty:"hard",description:"A harder rail-side target with two shots.",objectiveText:"Pocket the highlighted coin in 2 shots or less.",shotLimit:2,idealShots:2,boardSetup:ci({id:"bank-basic-2",title:"Bank Basic II",objectiveText:"Pocket the highlighted coin in 2 shots or less.",activePieceIds:[hi,"outer-black-coin-7"],placements:{"outer-black-coin-7":{x:-1.92,z:.06}},targetPieceIds:["outer-black-coin-7"],targetPocketId:"pocket-3",highlights:en("bank-basic-2","outer-black-coin-7","pocket-3")})},{id:"clean-break-1",title:"Clean Break",type:"cleanBreak",difficulty:"normal",description:"Break the standard cluster and pocket at least one normal coin.",objectiveText:"Pocket at least one normal coin from the break shot.",shotLimit:1,idealShots:1,boardSetup:ci({id:"clean-break-1",title:"Clean Break",objectiveText:"Pocket at least one normal coin from the break shot.",resetToDefault:!0,activePieceIds:null,placements:{},highlights:[{id:"clean-break-cluster",type:"center"},{id:"clean-break-baseline",type:"baseline",baseline:"bottom"}]})},{id:"foul-avoidance-1",title:"Foul Avoidance",type:"foulAvoidance",difficulty:"hard",description:"Score the target without losing the striker.",objectiveText:"Pocket the target coin without pocketing the striker.",shotLimit:2,idealShots:1,failOnStriker:!0,boardSetup:ci({id:"foul-avoidance-1",title:"Foul Avoidance",objectiveText:"Pocket the target coin without pocketing the striker.",activePieceIds:[hi,"outer-white-coin-8"],placements:{"outer-white-coin-8":{x:1.28,z:1.32}},targetPieceIds:["outer-white-coin-8"],targetPocketId:"pocket-4",highlights:en("foul-avoidance-1","outer-white-coin-8","pocket-4")})}];function hl(n){return Ai.find(e=>e.id===n)||Ai[0]}function iu(n){const e=Ai.findIndex(t=>t.id===n);return Ai[(e+1+Ai.length)%Ai.length].id}const Ps="queen-red-1";function nu(n,e,{foul:t=!1}={}){return t&&n.failOnStriker?0:e<=(n.idealShots||1)?3:e<=n.shotLimit?2:1}class su{createTracker(e){return{challengeId:e.id,shotsUsed:0,pocketedIds:new Set,queenPocketed:!1,coverPocketed:!1,strikerPocketed:!1,completed:!1,failed:!1,stars:0,message:e.objectiveText}}recordPocketed(e,t){return!e||!t?.id||(e.pocketedIds.add(t.id),(t.type==="queen"||t.id===Ps)&&(e.queenPocketed=!0),t.type==="striker"&&(e.strikerPocketed=!0)),e}evaluate(e,t,i={}){const s=new Set([...t.pocketedIds,...(i.pocketed||[]).map(u=>u.id)]),a=t.strikerPocketed||!!i.strikerPocketed,r=(i.pocketed||[]).filter(u=>u.type==="coin").length;let o=!1,l=!1,c="";if(e.failOnStriker&&a)l=!0,c="Challenge failed: striker pocketed.";else if(e.type==="cleanBreak")o=r>0||[...s].some(u=>u.includes("-coin-")),l=!o&&t.shotsUsed>=e.shotLimit,c=o?"Clean break complete.":"No coin from the break. Retry the challenge.";else if(e.type==="queenCover"){const u=e.coverPieceId;o=s.has(Ps)&&!!(u&&s.has(u)),l=!o&&t.shotsUsed>=e.shotLimit,c=o?"Queen covered. Challenge complete.":s.has(Ps)?"Queen pocketed. Cover it with the normal coin.":"Pocket the queen, then cover it."}else o=(e.boardSetup.targetPieceIds||[]).some(u=>s.has(u)),l=!o&&t.shotsUsed>=e.shotLimit,c=o?"Target pocketed. Challenge complete.":"Target still on the board. Try again.";const h=o?nu(e,t.shotsUsed,{foul:a}):0;return t.pocketedIds=s,t.strikerPocketed=a,t.queenPocketed=s.has(Ps),t.coverPocketed=!!(e.coverPieceId&&s.has(e.coverPieceId)),t.completed=o,t.failed=l,t.stars=h,t.message=c,{completed:o,failed:l,stars:h,message:c,shotsUsed:t.shotsUsed,pocketedIds:[...s]}}}const As={bestStarsByChallengeId:{},completedChallengeIds:[],lastPlayedChallengeId:""};function ul(){return typeof window<"u"&&!!window.localStorage}class au{constructor(e=bi.challengeProgress){this.storageKey=e,this.progress=this.load()}load(){if(!ul())return{...As};try{const e=JSON.parse(window.localStorage.getItem(this.storageKey)||"null");return{...As,...e||{},bestStarsByChallengeId:e?.bestStarsByChallengeId||{},completedChallengeIds:Array.isArray(e?.completedChallengeIds)?e.completedChallengeIds:[]}}catch{return{...As}}}save(){ul()&&window.localStorage.setItem(this.storageKey,JSON.stringify(this.progress))}recordResult(e,t){const i=Number(this.progress.bestStarsByChallengeId[e])||0,s=Math.max(i,Number(t)||0);return this.progress.bestStarsByChallengeId[e]=s,this.progress.lastPlayedChallengeId=e,s>0&&!this.progress.completedChallengeIds.includes(e)&&this.progress.completedChallengeIds.push(e),this.save(),this.getProgress()}setLastPlayed(e){this.progress.lastPlayedChallengeId=e||"",this.save()}getBestStars(e){return Number(this.progress.bestStarsByChallengeId[e])||0}getProgress(){return{bestStarsByChallengeId:{...this.progress.bestStarsByChallengeId},completedChallengeIds:[...this.progress.completedChallengeIds],lastPlayedChallengeId:this.progress.lastPlayedChallengeId||""}}reset(){return this.progress={...As,bestStarsByChallengeId:{},completedChallengeIds:[]},this.save(),this.getProgress()}}class ru{constructor({sceneRenderer:e,callbacks:t={}}={}){this.sceneRenderer=e,this.callbacks=t,this.evaluator=new su,this.progressManager=new au,this.active=!1,this.challenge=null,this.tracker=null,this.lastResult=null}listChallenges(){const e=this.progressManager.getProgress();return Ai.map(t=>({...t,bestStars:this.progressManager.getBestStars(t.id),completed:e.completedChallengeIds.includes(t.id)}))}selectChallenge(e){return this.active=!1,this.tracker=null,this.lastResult=null,this.challenge=hl(e),this.progressManager.setLastPlayed(this.challenge.id),this.sceneRenderer?.clearTrainingScenario?.(),this.emitChange(),this.challenge}startChallenge(e=""){return this.challenge=hl(e||this.challenge?.id||this.progressManager.getProgress().lastPlayedChallengeId),this.tracker=this.evaluator.createTracker(this.challenge),this.lastResult=null,this.active=!0,this.progressManager.setLastPlayed(this.challenge.id),this.applyBoardSetup(),this.emitChange(),this.getHud()}retryChallenge(){return this.startChallenge(this.challenge?.id)}nextChallenge(){return this.startChallenge(iu(this.challenge?.id))}exitChallenge(){this.active=!1,this.tracker=null,this.lastResult=null,this.sceneRenderer?.clearTrainingScenario?.(),this.emitChange()}resetProgress(){this.lastResult=null,this.progressManager.reset(),this.emitChange()}applyBoardSetup(){const e=this.challenge?.boardSetup;e&&(this.sceneRenderer?.applyTrainingScenario?.(e),this.sceneRenderer?.showTrainingHighlights?.(e.highlights||[]),this.sceneRenderer?.prepareForTurn?.({baseline:"bottom",enabled:!0,silent:!0,rotateCamera:!1}))}handleShotReleased(){!this.active||!this.tracker||this.tracker.completed||this.tracker.failed||(this.tracker.shotsUsed+=1,this.emitChange())}handlePiecePocketed(e){!this.active||!this.tracker||this.tracker.completed||this.tracker.failed||(this.evaluator.recordPocketed(this.tracker,e),this.emitChange())}handleShotSettled(e={}){return!this.active||!this.tracker||!this.challenge?this.getHud():this.tracker.completed||this.tracker.failed?this.getHud():(this.lastResult=this.evaluator.evaluate(this.challenge,this.tracker,e),this.lastResult.completed?(this.progressManager.recordResult(this.challenge.id,this.lastResult.stars),this.callbacks.onSuccess?.(this.lastResult,this.challenge)):this.lastResult.failed&&this.callbacks.onFail?.(this.lastResult,this.challenge),!this.lastResult.completed&&!this.lastResult.failed?this.sceneRenderer?.prepareForTurn?.({baseline:"bottom",enabled:!0,silent:!0,rotateCamera:!1}):this.sceneRenderer?.setInputEnabled?.(!1),this.emitChange(),this.getHud())}getPanelModel(){return{challenges:this.listChallenges(),selectedChallengeId:this.challenge?.id||this.progressManager.getProgress().lastPlayedChallengeId||Ai[0]?.id,active:this.active,result:this.lastResult,progress:this.progressManager.getProgress()}}getHud(){if(!this.active||!this.challenge||!this.tracker)return{challengeActive:!1,challengeTitle:"",challengeObjective:"",challengeShots:"",challengeResult:""};const e=this.lastResult?.message||this.tracker.message||this.challenge.objectiveText,t=this.lastResult?.completed?"success":this.lastResult?.failed?"danger":"warning";return{challengeActive:!0,challengeTitle:this.challenge.title,challengeObjective:this.challenge.objectiveText,challengeShots:`${this.tracker.shotsUsed}/${this.challenge.shotLimit}`,challengeResult:this.lastResult?.completed?`${this.lastResult.stars} star${this.lastResult.stars===1?"":"s"}`:this.lastResult?.failed?"Failed":"In progress",currentTurn:"Challenge",currentColor:this.challenge.difficulty,matchModeLabel:"Challenge Mode",ruleModeLabel:this.challenge.title,playerOneName:"Challenge",playerTwoName:this.challenge.difficulty,playerOneScore:`${this.tracker.shotsUsed}/${this.challenge.shotLimit}`,playerTwoScore:`${this.progressManager.getBestStars(this.challenge.id)} best`,playerOnePoints:this.lastResult?.stars||0,playerTwoPoints:this.progressManager.getBestStars(this.challenge.id),scoringMode:"points",queenStatus:this.challenge.queenRequired?"Queen objective":"Solo objective",turnNumber:1,shotNumber:this.tracker.shotsUsed,foulStatus:this.tracker.strikerPocketed?"Foul":"Clear",shotPower:this.lastResult?.completed||this.lastResult?.failed?"Complete":"Ready",shotPowerRatio:0,status:e,bannerTone:t}}emitChange(){this.callbacks.onChange?.(this.getPanelModel(),this.getHud())}}const pi=[{id:"board",loadoutKey:"boardSkin",label:"Board",description:"Surface, frame, trim, pockets, and markings."},{id:"coins",loadoutKey:"coinSet",label:"Coins",description:"White coins, black coins, queen, and rim detail."},{id:"striker",loadoutKey:"strikerSkin",label:"Striker",description:"Striker body, rings, and control glow."},{id:"table",loadoutKey:"tableEnvironment",label:"Table",description:"Floor, lounge mood, fog, and lighting tint."},{id:"vfx",loadoutKey:"vfxPreset",label:"VFX",description:"Feedback colors and effect intensity."}],Fc={available:"Available",locked:"Locked",comingSoon:"Coming Soon"},Bc={default:"Default",common:"Common",rare:"Rare",royale:"Royale"},zc=[{id:"board-ivory-royale",category:"board",name:"Ivory Royale",description:"White ivory surface, warm gold trims, and premium lounge readability.",rarity:"default",status:"available",previewLabel:"Default board",themeTokens:{scene:{boardSurface:"#f6ecd8",boardSurfaceAccent:"#fff9ee",outerFrame:"#b8894a",frameSide:"#84602d",goldTrim:"#d5ad67",pocketDark:"#1e1813",pocketRim:"#b98945",markingLine:"#8f662d",shadow:"#6a4318"}}},{id:"board-tournament-wood",category:"board",name:"Tournament Wood",description:"Warm wooden playfield with dark rails and grounded tournament contrast.",rarity:"common",status:"available",previewLabel:"Warm wood",themeTokens:{scene:{boardSurface:"#c99458",boardSurfaceAccent:"#e4b87b",outerFrame:"#6c3f21",frameSide:"#3f2416",goldTrim:"#d7a65e",pocketDark:"#160e09",pocketRim:"#7f4c25",markingLine:"#4d2b17",shadow:"#3d2314"}}},{id:"board-midnight-gold",category:"board",name:"Midnight Gold",description:"Dark luxury surface with crisp gold markings and pocket rims.",rarity:"rare",status:"available",previewLabel:"Dark gold table",themeTokens:{scene:{boardSurface:"#222936",boardSurfaceAccent:"#303948",outerFrame:"#8b642d",frameSide:"#080b10",goldTrim:"#dfb765",pocketDark:"#02050a",pocketRim:"#d9aa56",markingLine:"#f0d08b",shadow:"#030509"}}},{id:"board-royal-walnut",category:"board",name:"Royal Walnut",description:"Deep walnut frame with cream surface and subdued royal trim.",rarity:"rare",status:"available",previewLabel:"Unlocked for testing",entitlementKey:"carrom.skin.boardRoyalWalnut",themeTokens:{scene:{boardSurface:"#ead9b8",outerFrame:"#59331d",frameSide:"#2c1a12",goldTrim:"#c99b55",pocketDark:"#120b08",pocketRim:"#6d4224",markingLine:"#694321"}}},{id:"board-marble-palace",category:"board",name:"Marble Palace",description:"Bright marble-inspired surface with soft gold detail.",rarity:"royale",status:"available",previewLabel:"Unlocked for testing",entitlementKey:"carrom.skin.boardMarblePalace",themeTokens:{scene:{boardSurface:"#f9f5ec",outerFrame:"#d8bd82",frameSide:"#b18b55",goldTrim:"#e7c77d",pocketRim:"#d2a75e",markingLine:"#9c733d"}}},{id:"coins-classic-carrom",category:"coins",name:"Classic Carrom",description:"Readable matte white, black, and red coin set.",rarity:"default",status:"available",previewLabel:"Default coins",themeTokens:{scene:{whiteCoin:"#fff6e7",whiteCoinRim:"#c79b55",blackCoin:"#2f2925",blackCoinRim:"#b78a46",queen:"#a53a2d",queenRim:"#e3bd73"}}},{id:"coins-ivory-edge",category:"coins",name:"Ivory Edge",description:"Ivory and dark walnut coins with fine gold rims.",rarity:"common",status:"available",previewLabel:"Gold edged",themeTokens:{scene:{whiteCoin:"#fffaf0",whiteCoinRim:"#dfb96b",blackCoin:"#3a251a",blackCoinRim:"#d6a85a",queen:"#b54534",queenRim:"#f0ca79"}}},{id:"coins-tournament-matte",category:"coins",name:"Tournament Matte",description:"Simple, low-glare coins built for fast reading.",rarity:"common",status:"available",previewLabel:"Matte readable",themeTokens:{scene:{whiteCoin:"#f1eadb",whiteCoinRim:"#8f795c",blackCoin:"#1c1b19",blackCoinRim:"#7f6a4e",queen:"#9f3027",queenRim:"#bc8d4f"}}},{id:"coins-midnight",category:"coins",name:"Midnight Coins",description:"Dark luxury coins with luminous gold accents.",rarity:"rare",status:"available",previewLabel:"Unlocked for testing",entitlementKey:"carrom.skin.coinsMidnight",themeTokens:{scene:{whiteCoin:"#e8deca",whiteCoinRim:"#f0cc7b",blackCoin:"#07090e",blackCoinRim:"#d6a857",queen:"#c6493b",queenRim:"#f2d18c"}}},{id:"coins-royal-queen-set",category:"coins",name:"Royal Queen Set",description:"A stronger red and gold queen treatment for royal finishes.",rarity:"royale",status:"available",previewLabel:"Unlocked for testing",entitlementKey:"carrom.skin.coinsRoyalQueen",themeTokens:{scene:{queen:"#d84634",queenRim:"#ffd58a",whiteCoinRim:"#dfb86e",blackCoinRim:"#d7a75f"}}},{id:"striker-ivory",category:"striker",name:"Ivory Striker",description:"Clean ivory striker with warm gold control glow.",rarity:"default",status:"available",previewLabel:"Default striker",themeTokens:{scene:{striker:"#fff4da",strikerGlow:"#f1c06f"}}},{id:"striker-gold-ring",category:"striker",name:"Gold Ring Striker",description:"Brighter striker ring and stronger launch readability.",rarity:"common",status:"available",previewLabel:"Gold ring",themeTokens:{scene:{striker:"#fff8e8",strikerGlow:"#f6c866",strikerRing:"#ddb25f"}}},{id:"striker-walnut-pro",category:"striker",name:"Walnut Pro Striker",description:"Warm pro striker with cream center and walnut edge mood.",rarity:"common",status:"available",previewLabel:"Walnut pro",themeTokens:{scene:{striker:"#d9b071",strikerGlow:"#f0c36e",strikerRing:"#9d6330"}}},{id:"striker-midnight",category:"striker",name:"Midnight Striker",description:"Dark striker shell with premium gold glow.",rarity:"rare",status:"available",previewLabel:"Unlocked for testing",entitlementKey:"carrom.skin.strikerMidnight",themeTokens:{scene:{striker:"#151a22",strikerGlow:"#f0c86e",strikerRing:"#d7a957"}}},{id:"striker-royal-red",category:"striker",name:"Royal Red Striker",description:"Red striker accent made for royal table themes.",rarity:"royale",status:"available",previewLabel:"Unlocked for testing",entitlementKey:"carrom.skin.strikerRoyalRed",themeTokens:{scene:{striker:"#b94234",strikerGlow:"#ffd18a"}}},{id:"table-ivory-lounge",category:"table",name:"Ivory Lounge",description:"Soft ivory room, gold dust, and bright tabletop lighting.",rarity:"default",status:"available",previewLabel:"Default room",themeTokens:{scene:{background:"#f7efe1",fog:"#eadbc0",tableBase:"#ece0c9",floor:"#ece0c9",particle:"#ffe7b4",light:"#fff8ee",rim:"#f2c781",glow:"#f2c781"}}},{id:"table-royal",category:"table",name:"Royal Table",description:"Warmer lounge with deeper base and richer gold ambience.",rarity:"common",status:"available",previewLabel:"Royal warmth",themeTokens:{scene:{background:"#efe0c5",fog:"#d7bd95",tableBase:"#caa36a",floor:"#d5b887",particle:"#ffd98f",light:"#fff1d2",rim:"#e0b461",glow:"#e0b461"}}},{id:"table-midnight-room",category:"table",name:"Midnight Room",description:"Dark premium room with gold highlights and readable table focus.",rarity:"rare",status:"available",previewLabel:"Dark lounge",themeTokens:{scene:{background:"#080a0f",fog:"#121821",tableBase:"#151d29",floor:"#121923",particle:"#f0cb76",light:"#f8e6c4",rim:"#d7ac5d",glow:"#d7ac5d"}}},{id:"table-tournament-hall",category:"table",name:"Tournament Hall",description:"Neutral hall lighting made for long serious sessions.",rarity:"rare",status:"available",previewLabel:"Unlocked for testing",entitlementKey:"carrom.skin.tableTournamentHall",themeTokens:{scene:{background:"#d8d0c3",fog:"#c5b8a8",tableBase:"#9f8462",particle:"#e9c878",light:"#fff5dd"}}},{id:"table-marble-studio",category:"table",name:"Marble Studio",description:"Bright studio ambience for future marble boards.",rarity:"royale",status:"available",previewLabel:"Unlocked for testing",entitlementKey:"carrom.skin.tableMarbleStudio",themeTokens:{scene:{background:"#f8f6f1",fog:"#e9e1d3",tableBase:"#e5d5b9",particle:"#ffe0a3"}}},{id:"vfx-classic-gold",category:"vfx",name:"Classic Gold",description:"Warm gold feedback for pockets, launches, and banners.",rarity:"default",status:"available",previewLabel:"Default VFX",themeTokens:{scene:{particle:"#ffe7b4",strikerGlow:"#f1c06f"},vfx:{intensity:1,sparkColor:"#d5ad67"}}},{id:"vfx-royal-red",category:"vfx",name:"Royal Red",description:"Richer queen and foul feedback with red-gold sparks.",rarity:"common",status:"available",previewLabel:"Red gold",themeTokens:{scene:{queen:"#c44738",queenRim:"#f3c36e",particle:"#ffd0a0",strikerGlow:"#f0b76f"},vfx:{intensity:1.06,sparkColor:"#f0b76f"}}},{id:"vfx-minimal-clean",category:"vfx",name:"Minimal Clean",description:"Lower particle intensity with clear readable feedback.",rarity:"common",status:"available",previewLabel:"Low sparkle",themeTokens:{scene:{particle:"#f4d99f",strikerGlow:"#e9bd68"},vfx:{intensity:.62,sparkColor:"#d3b374"}}},{id:"vfx-midnight-spark",category:"vfx",name:"Midnight Spark",description:"Gold-blue sparkle profile for midnight tables.",rarity:"rare",status:"available",previewLabel:"Unlocked for testing",entitlementKey:"carrom.skin.vfxMidnightSpark",themeTokens:{scene:{particle:"#c9d9ff",strikerGlow:"#d8ad63"},vfx:{intensity:.94,sparkColor:"#c9d9ff"}}}],Ri={boardSkin:"board-ivory-royale",coinSet:"coins-classic-carrom",strikerSkin:"striker-ivory",tableEnvironment:"table-ivory-lounge",vfxPreset:"vfx-classic-gold"};function Er(n){return zc.filter(e=>e.category===n)}function qi(n){return zc.find(e=>e.id===n)||null}class ou{constructor({storageKey:e=bi.cosmetics}={}){this.storageKey=e}load(){if(typeof window>"u"||!window.localStorage)return{...Ri};try{const e=window.localStorage.getItem(this.storageKey),t=e?JSON.parse(e):null;return!t||typeof t!="object"?{...Ri}:{...Ri,...t}}catch{return{...Ri}}}save(e){if(!(typeof window>"u"||!window.localStorage))try{window.localStorage.setItem(this.storageKey,JSON.stringify({...Ri,...e}))}catch{}}reset(){const e={...Ri};return this.save(e),e}}const dl={ivory:"board-ivory-royale",wood:"board-tournament-wood",midnight:"board-midnight-gold"};function lu(n){const e={},t={};return Object.entries(n).forEach(([i,s])=>{if(Ri[i]===s)return;const a=qi(s);a&&(Object.assign(e,a.themeTokens?.scene||{}),Object.assign(t,a.themeTokens?.vfx||{}))}),{scene:e,vfx:t}}class cu{constructor({sceneRenderer:e,storage:t=new ou}={}){this.sceneRenderer=e,this.storage=t,this.loadout=this.validateLoadout(this.storage.load())}getDefaultLoadout(){return{...Ri}}loadLoadout(){return this.loadout=this.validateLoadout(this.storage.load()),{...this.loadout}}saveLoadout(e){const t=this.validateLoadout(e);return this.loadout=t,this.storage.save(t),this.applyLoadout(t),{...t}}applyLoadout(e=this.loadout,{preview:t=!1}={}){const i=this.validateLoadout(e,{allowLocked:t});return this.sceneRenderer?.applyCosmeticLoadout?.(i,lu(i)),{...i}}applyBoardStyle(e="ivory"){const t=dl[e]||dl.ivory;return this.saveLoadout({...this.loadout,boardSkin:t})}selectCosmetic(e,t,{preview:i=!1}={}){const s=this.getCosmeticById(t);if(!s||s.category!==e)return{ok:!1,message:"Cosmetic not found."};if(s.status==="comingSoon")return{ok:!1,item:s,message:"Coming soon."};const r=pi.find(l=>l.id===e)?.loadoutKey;if(!r)return{ok:!1,item:s,message:"Cosmetic category not found."};const o={...this.loadout,[r]:s.id};return i&&this.applyLoadout(o,{preview:!0}),{ok:!0,item:s,loadout:o,message:s.status==="locked"?"Locked cosmetic - preview only.":`Previewing ${s.name}.`}}resetToDefault(){const e=this.storage.reset();return this.loadout=this.validateLoadout(e),this.applyLoadout(this.loadout),{...this.loadout}}getAvailableCosmetics(e){return Er(e).filter(t=>t.status==="available")}getCosmeticById(e){return qi(e)}canEquipLoadout(e){return Object.values(this.validateLoadout(e,{allowLocked:!0})).every(t=>qi(t)?.status==="available")}getPanelItems(e=this.loadout){return pi.map(t=>{const i=e[t.loadoutKey],s=this.loadout[t.loadoutKey];return{...t,selectedId:i,equippedId:s,items:Er(t.id)}})}validateLoadout(e={},{allowLocked:t=!1}={}){const i={...Ri};return pi.forEach(s=>{const a=qi(e[s.loadoutKey]);a&&a.category===s.id&&a.status!=="comingSoon"&&(t||a.status==="available")&&(i[s.loadoutKey]=a.id)}),i}getLoadoutSummary(e=this.loadout){return pi.map(t=>{const i=qi(e[t.loadoutKey]);return i?i.name:"Default"}).join(" / ")}}class hu{constructor({cosmeticManager:e}){this.cosmeticManager=e,this.activeCategory="board",this.previewLoadout=this.cosmeticManager?.loadout||{},this.originalLoadout=this.cosmeticManager?.loadout||{},this.focusedItemId=null,this.isOpen=!1,this.message="Select a cosmetic to preview it on the live 3D table.",this.tone="default"}open(){return this.isOpen=!0,this.originalLoadout={...this.cosmeticManager.loadout},this.previewLoadout={...this.originalLoadout},this.focusedItemId=null,this.message="Select a cosmetic to preview it on the live 3D table.",this.tone="default",this.cosmeticManager.applyLoadout(this.previewLoadout,{preview:!0}),this.getModel()}setCategory(e){return pi.some(t=>t.id===e)&&(this.activeCategory=e,this.focusedItemId=null),this.getModel()}preview(e,t){this.setCategory(e);const i=qi(t);if(!i)return this.message="Cosmetic not found.",this.tone="danger",this.getModel();if(i.status==="comingSoon")return this.focusedItemId=i.id,this.message="Coming soon.",this.tone="warning",this.getModel();const s=pi.find(a=>a.id===e)?.loadoutKey;return s?(this.previewLoadout={...this.previewLoadout,[s]:i.id},this.focusedItemId=i.id,this.cosmeticManager.applyLoadout(this.previewLoadout,{preview:!0}),this.message=i.status==="locked"?"Locked cosmetic - future unlock. Preview only.":`Previewing ${i.name}.`,this.tone=i.status==="locked"?"warning":"success",this.getModel()):(this.message="Cosmetic category not found.",this.tone="danger",this.getModel())}equip(){return this.cosmeticManager.canEquipLoadout(this.previewLoadout)?(this.originalLoadout=this.cosmeticManager.saveLoadout(this.previewLoadout),this.previewLoadout={...this.originalLoadout},this.focusedItemId=null,this.message="Cosmetic loadout equipped and saved locally.",this.tone="success",this.getModel()):(this.message="Locked or coming-soon cosmetics cannot be equipped yet.",this.tone="warning",this.getModel())}resetToDefault(){const e=this.cosmeticManager.resetToDefault();return this.originalLoadout={...e},this.previewLoadout={...e},this.focusedItemId=null,this.message="Default cosmetics restored.",this.tone="success",this.getModel()}cancelPreview(){return this.previewLoadout={...this.cosmeticManager.loadout},this.originalLoadout={...this.cosmeticManager.loadout},this.focusedItemId=null,this.cosmeticManager.applyLoadout(this.originalLoadout),this.message="Preview cancelled. Equipped loadout restored.",this.tone="default",this.getModel()}getSelectedItem(){const e=pi.find(i=>i.id===this.activeCategory)||pi[0],t=qi(this.focusedItemId);return t?.category===e.id?t:qi(this.previewLoadout[e.loadoutKey])}getModel(){const e=this.getSelectedItem();return{isOpen:this.isOpen,activeCategory:this.activeCategory,categories:this.cosmeticManager.getPanelItems(this.previewLoadout),equippedLoadout:{...this.cosmeticManager.loadout},previewLoadout:{...this.previewLoadout},focusedItemId:this.focusedItemId,canEquip:this.cosmeticManager.canEquipLoadout(this.previewLoadout)&&(!this.focusedItemId||e?.status==="available"),selectedItem:e,selectedStatusLabel:Fc[e?.status]||"Available",selectedRarityLabel:Bc[e?.rarity]||"Common",summary:this.cosmeticManager.getLoadoutSummary(this.previewLoadout),message:this.message,tone:this.tone}}}const uu={strikerPocketed:"strikerPocketed"};class du{evaluate(e){return e.strikerPocketed?{isFoul:!0,foulType:uu.strikerPocketed,message:"Foul: striker pocketed."}:{isFoul:!1,foulType:"",message:""}}}const pu="queen-red-1";class fu{markPendingCover(e,t,i){e.queen.state="pendingCover",e.queen.pocketedByPlayerId=t,e.queen.pendingCoverPlayerId=t,e.queen.pendingCoverShotNumber=i,e.pocketedPieces.queen=!0}markCovered(e,t){e.queen.state="covered",e.queen.pocketedByPlayerId=t,e.queen.pendingCoverPlayerId=null,e.queen.pendingCoverShotNumber=null,e.pocketedPieces.queen=!0}returnQueen(e){return e.queen.state="returned",e.queen.pocketedByPlayerId=null,e.queen.pendingCoverPlayerId=null,e.queen.pendingCoverShotNumber=null,e.pocketedPieces.queen=!1,{id:pu,type:"queen",color:"red"}}resetQueen(e){e.queen.state="onBoard",e.queen.pocketedByPlayerId=null,e.queen.pendingCoverPlayerId=null,e.queen.pendingCoverShotNumber=null,e.pocketedPieces.queen=!1}isCovered(e){return e.queen.state==="covered"}getDisplayStatus(e){return{onBoard:"On board",pendingCover:"Pending cover",covered:"Covered",returned:"Returned"}[e.queen.state]||"On board"}}const tn="queen-red-1";function mu(n){return n==="standard"||n==="strict"?n:"casual"}function Da(n){return n?.type==="coin"&&(n.color==="white"||n.color==="black")}class gu{constructor({scoreManager:e,queenManager:t,foulManager:i}){this.scoreManager=e,this.queenManager=t,this.foulManager=i}evaluate(e,t,i){return e.ruleMode==="freeCapture"?this.evaluateFreeCapture(e,t,i):this.evaluateClassic(e,t,i,mu(e.classicRuleVariant))}createRuleResult({state:e,currentPlayer:t,summary:i,foul:s,ownCoinsPocketed:a,opponentCoinsPocketed:r,capturedCoins:o=[],variant:l="casual"}){return{ruleMode:e.ruleMode,classicRuleVariant:l,isFoul:s.isFoul,foulType:s.foulType,ownCoinsPocketed:a,opponentCoinsPocketed:r,capturedCoins:o,queenPocketed:i.queenPocketed,queenCovered:!1,queenReturned:!1,queenPending:!1,firstPocketAssignedColor:i.firstPocketAssignedColor||"",dueChanges:[],shouldContinueTurn:!1,shouldSwitchTurn:!0,winnerPlayerId:null,draw:!1,messages:[],piecesToReturn:[],currentPlayerId:t.id}}evaluateClassic(e,t,i,s="casual"){const a=!!t.color,r=a?i.pocketed.filter(v=>v.type==="coin"&&v.color===t.color):[],o=i.pocketed.filter(v=>a&&Da(v)&&v.color!==t.color),l=r.map(v=>v.id),c=this.foulManager.evaluate(i),h=this.createRuleResult({state:e,currentPlayer:t,summary:i,foul:c,ownCoinsPocketed:r,opponentCoinsPocketed:o,variant:s});if(o.length&&h.messages.push("Opponent coin pocketed."),c.isFoul)return this.resolveClassicFoul(e,t,i,h,l,a,s);if(!a&&i.awaitedFirstPocketAssignment)return this.resolveUnassignedClassicShot(i,h);if(i.queenReturnedBeforeAssignment)return h.queenReturned=!0,h.piecesToReturn.push({id:tn,type:"queen",reason:"queen-before-first-color-coin"}),h.messages.push("Pocket a white or black coin first. Queen returned."),r.length&&(h.shouldContinueTurn=!0,h.shouldSwitchTurn=!1,h.messages.push(`${t.name} claims ${t.color==="white"?"White":"Black"} and continues.`)),this.guardUncoveredFinish(e,t,h,l,s);i.colorAssignedThisShot&&h.messages.push(`${t.name} claims ${t.color==="white"?"White":"Black"}.`);const u=Math.max(0,(t.pocketedOwnCoinIds?.length||0)-l.length),p=[...l],f=[...r];return s==="strict"&&this.scoreManager.getDueCount(e,t.id)>0&&p.length&&this.consumeStrictDue(e,t,h,p,f),e.queen.state==="pendingCover"&&e.queen.pendingCoverPlayerId===t.id?(f.length?(h.queenCovered=!0,h.shouldContinueTurn=!0,h.shouldSwitchTurn=!1,h.messages.push("Queen covered.")):(h.queenReturned=!0,h.piecesToReturn.push({id:tn,type:"queen",reason:"cover-missed"}),h.messages.push("Queen cover missed. Queen returned.")),this.guardUncoveredFinish(e,t,h,p,s)):i.queenPocketed?s==="strict"&&u<=0?(h.queenReturned=!0,h.piecesToReturn.push({id:tn,type:"queen",reason:"strict-early-queen"}),h.messages.push("Queen cannot be claimed yet."),h):(f.length?(h.queenCovered=!0,h.shouldContinueTurn=!0,h.shouldSwitchTurn=!1,h.messages.push("Queen covered.")):(h.queenPending=!0,h.shouldContinueTurn=!0,h.shouldSwitchTurn=!1,h.messages.push("Queen needs cover.")),this.guardUncoveredFinish(e,t,h,p,s)):f.length?(h.shouldContinueTurn=!0,h.shouldSwitchTurn=!1,h.messages.push(`${t.name}: +${f.length} own coin${f.length===1?"":"s"}. Extra shot.`),this.guardUncoveredFinish(e,t,h,p,s)):(i.pocketedCount?o.length?h.messages.push("Turn switched."):h.dueChanges.length&&h.messages.push("Penalty recovery does not continue the turn."):h.messages.push("No coin pocketed. Turn switched."),this.guardUncoveredFinish(e,t,h,p,s))}resolveClassicFoul(e,t,i,s,a,r,o){s.messages.push(s.foulType?this.foulManager.evaluate(i).message:"Foul.");const l=this.scoreManager.selectPenaltyCoin(e,t.id,a);return l?(s.piecesToReturn.push({id:l,type:"coin",reason:"striker-foul-penalty"}),s.messages.push("Penalty coin returned.")):o==="strict"&&(s.dueChanges.push({playerId:t.id,delta:1,reason:"striker-foul-due"}),s.messages.push("Due recorded.")),!r&&i.awaitedFirstPocketAssignment&&(i.pocketed.filter(Da).forEach(c=>s.piecesToReturn.push({id:c.id,type:"coin",color:c.color,reason:"unassigned-foul-return"})),s.piecesToReturn.some(c=>c.reason==="unassigned-foul-return")&&s.messages.push("Coin returned. First pocket still decides color.")),(i.queenPocketed||e.queen.state==="pendingCover")&&(s.queenReturned=!0,s.piecesToReturn.push({id:tn,type:"queen",reason:"foul-queen-return"}),s.messages.push("Queen returned.")),s}resolveUnassignedClassicShot(e,t){return e.queenPocketed?(t.queenReturned=!0,t.piecesToReturn.push({id:tn,type:"queen",reason:"queen-before-color-assignment"}),t.messages.push("Pocket a white or black coin first. Queen returned."),t):(t.messages.push("First pocket decides color."),t)}consumeStrictDue(e,t,i,s,a){const r=this.scoreManager.selectPenaltyCoin(e,t.id,s)||s[s.length-1];if(!r)return;i.piecesToReturn.push({id:r,type:"coin",reason:"strict-due-recovery"}),i.dueChanges.push({playerId:t.id,delta:-1,reason:"strict-due-recovered"}),i.messages.push("Due cleared: coin returned.");const o=s.indexOf(r);o>=0&&s.splice(o,1);const l=a.findIndex(c=>c.id===r);l>=0&&a.splice(l,1)}evaluateFreeCapture(e,t,i){const s=i.pocketed.filter(Da),a=s.map(c=>c.id),r=this.foulManager.evaluate(i),o=this.createRuleResult({state:e,currentPlayer:t,summary:i,foul:r,ownCoinsPocketed:s,opponentCoinsPocketed:[],capturedCoins:s,variant:""});if(r.isFoul){o.messages.push(r.message);const c=this.scoreManager.selectPenaltyCoin(e,t.id,a);return c&&(o.piecesToReturn.push({id:c,type:"coin",reason:"free-capture-striker-foul-penalty"}),o.messages.push("Penalty captured coin returned.")),(i.queenPocketed||e.queen.state==="pendingCover")&&(o.queenReturned=!0,o.piecesToReturn.push({id:tn,type:"queen",reason:"foul-queen-return"}),o.messages.push("Queen returned.")),o}return e.queen.state==="pendingCover"&&e.queen.pendingCoverPlayerId===t.id?(s.length?(o.queenCovered=!0,o.shouldContinueTurn=!0,o.shouldSwitchTurn=!1,o.messages.push("Queen covered. +3 bonus.")):(o.queenReturned=!0,o.piecesToReturn.push({id:tn,type:"queen",reason:"cover-missed"}),o.messages.push("Queen cover missed. Queen returned.")),o):i.queenPocketed?(s.length?(o.queenCovered=!0,o.shouldContinueTurn=!0,o.shouldSwitchTurn=!1,o.messages.push("Queen covered. +3 bonus.")):(o.queenPending=!0,o.shouldContinueTurn=!0,o.shouldSwitchTurn=!1,o.messages.push("Queen needs cover.")),o):s.length?(o.shouldContinueTurn=!0,o.shouldSwitchTurn=!1,o.messages.push(`Free Capture: +${s.length} point${s.length===1?"":"s"}. Extra shot.`),o):(o.messages.push("No coin captured. Turn switched."),o)}guardUncoveredFinish(e,t,i,s,a="casual"){if(i.queenCovered||this.queenManager.isCovered(e)||!this.scoreManager.hasAllOwnCoins(e,t.id))return i;const o=new Set(i.piecesToReturn.map(c=>c.id)),l=this.scoreManager.selectPenaltyCoin(e,t.id,s);return l&&!o.has(l)&&i.piecesToReturn.push({id:l,type:"coin",reason:a==="strict"?"strict-final-coin-before-queen":"queen-not-covered-finish-guard"}),i.shouldContinueTurn=!1,i.shouldSwitchTurn=!0,i.messages.push(a==="strict"?"Strict: cover queen before final coin.":"Cover queen to finish. Last coin returned."),i}}const fs=9,Tr=fs*2,vu=1,yu=3;class Su{applyPocketedCoins(e,t){const i=[];return t.filter(s=>s.type==="coin"&&(s.color==="white"||s.color==="black")).forEach(s=>{const a=e.pocketedPieces[s.color];if(a.includes(s.id))return;a.push(s.id),this.getPlayerByColor(e,s.color)?.pocketedOwnCoinIds.push(s.id),i.push(s)}),i}applyCapturedCoins(e,t,i){const s=this.getPlayerById(e,t),a=[];return s&&i.filter(r=>r.type==="coin"&&(r.color==="white"||r.color==="black")).forEach(r=>{const o=e.pocketedPieces[r.color];o.includes(r.id)||(o.push(r.id),s.capturedCoinIds.push(r.id),a.push(r))}),a}getPlayerByColor(e,t){return e.players.find(i=>i.color===t)||null}getPlayerById(e,t){return e.players.find(i=>i.id===t)||null}getOpponent(e,t){return e.players.find(i=>i.id!==t)||null}getDueCount(e,t){return Math.max(0,Number(this.getPlayerById(e,t)?.dueCount)||0)}applyDueChange(e,t,i=0){const s=this.getPlayerById(e,t);return s?(s.dueCount=Math.max(0,(Number(s.dueCount)||0)+i),s.dueCount):0}getPocketedCount(e,t){const i=this.getPlayerById(e,t);return i?e.ruleMode==="freeCapture"?i.capturedCoinIds.length:i.pocketedOwnCoinIds.length:0}getRemainingCount(e,t){return e.ruleMode==="freeCapture"?Math.max(Tr-this.getTotalNormalCoinsPocketed(e),0):Math.max(fs-this.getPocketedCount(e,t),0)}hasAllOwnCoins(e,t){return this.getPocketedCount(e,t)>=fs}selectPenaltyCoin(e,t,i=[]){const s=this.getPlayerById(e,t),a=e.ruleMode==="freeCapture"?s?.capturedCoinIds:s?.pocketedOwnCoinIds;return!s||!a?.length?null:[...i].reverse().find(o=>a.includes(o))||a[a.length-1]}returnCoinToBoard(e,t){if(!t)return null;const i=e.pocketedPieces.white.includes(t)?"white":e.pocketedPieces.black.includes(t)?"black":"";if(!i)return null;e.pocketedPieces[i]=e.pocketedPieces[i].filter(a=>a!==t);const s=this.getPlayerByColor(e,i);return s&&(s.pocketedOwnCoinIds=s.pocketedOwnCoinIds.filter(a=>a!==t),s.returnedPenaltyCount+=1),e.players.forEach(a=>{const r=a.capturedCoinIds.includes(t);a.pocketedOwnCoinIds=a.pocketedOwnCoinIds.filter(o=>o!==t),a.capturedCoinIds=a.capturedCoinIds.filter(o=>o!==t),r&&(a.returnedPenaltyCount+=1)}),{id:t,type:"coin",color:i}}getTotalNormalCoinsPocketed(e){return e.pocketedPieces.white.length+e.pocketedPieces.black.length}getScoreSnapshot(e){return e.players.reduce((t,i)=>{const s=this.getPocketedCount(e,i.id),a=e.queen.state==="covered"&&e.queen.pocketedByPlayerId===i.id?yu:0;return t[i.id]={pocketed:s,remaining:this.getRemainingCount(e,i.id),color:i.color,points:s*vu+a,queenBonus:a,dueCount:this.getDueCount(e,i.id)},t},{})}}class bu{constructor(e){this.state=e}getCurrentPlayer(){return this.state.players.find(e=>e.id===this.state.currentPlayerId)||this.state.players[0]}getOpponentPlayer(){const e=this.getCurrentPlayer();return this.state.players.find(t=>t.id!==e.id)||null}continueTurn(){return this.getCurrentPlayer()}switchTurn(){const e=this.getOpponentPlayer();return e&&(this.state.currentPlayerId=e.id,this.state.turnNumber+=1),this.getCurrentPlayer()}getActiveBaseline(e=this.state.currentPlayerId){return e==="player-2"?"top":"bottom"}resetTurns(){this.state.currentPlayerId="player-1",this.state.turnNumber=1,this.state.shotNumber=0}}function _u(){return`local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Mu(n){return n==="fixed"?"p1White":n==="black"?"p1Black":n==="random"||n==="firstPocket"||n==="p1Black"?n:"p1White"}function xu(n){return n==="freeCapture"?"freeCapture":"classic"}function wu(n){return n==="vsBot"?"vsBot":"local2p"}function Eu(n){return n==="vsBot"?"Human vs Bot":"Local 2 Player"}function Tu(n){if(n==="p1Black")return{playerOne:"black",playerTwo:"white"};if(n==="random"){const e=Math.random()>.5?"white":"black";return{playerOne:e,playerTwo:e==="white"?"black":"white"}}return n==="firstPocket"?{playerOne:null,playerTwo:null}:{playerOne:"white",playerTwo:"black"}}function wn(n,e="classic"){return e==="freeCapture"?"Any":n?n==="white"?"White":"Black":"Unassigned"}function Cu(n,e="casual"){return n==="freeCapture"?"Free Capture":`Classic - ${wr(e).label}`}function Ru(n,e,t){return`${e.name}: ${n[e.id].points} pts | ${t.name}: ${n[t.id].points} pts`}class Pu{constructor(e={}){this.scoreManager=new Su,this.queenManager=new fu,this.foulManager=new du,this.rulesEngine=new gu({scoreManager:this.scoreManager,queenManager:this.queenManager,foulManager:this.foulManager}),this.resetMatch(e)}resetMatch(e={}){const t=wu(e.matchMode),i=ga(e.botDifficulty),s=Sn(i),a=xu(e.ruleMode),r=Ic(e.classicRuleVariant),o=Mu(e.coinSide||e.coinAssignmentMode),l=a==="freeCapture"?{playerOne:null,playerTwo:null}:Tu(o),c=a==="freeCapture"||o==="random"?"points":"coins";return this.state={matchId:_u(),mode:"local",matchMode:t,botDifficulty:t==="vsBot"?i:"",ruleMode:a,classicRuleVariant:r,setup:{matchMode:t,botDifficulty:t==="vsBot"?i:"",ruleMode:a,classicRuleVariant:r,coinSide:o,coinAssignmentMode:o,boardStyle:e.boardStyle||"ivory",matchType:e.matchType||"classic"},coinAssignmentMode:o,coinAssignment:{mode:o,isAssigned:a==="freeCapture"?!1:o!=="firstPocket",assignedByPlayerId:null,assignedShotNumber:null,firstPocketCoinId:null},scoringMode:c,status:"playing",players:[{id:"player-1",name:e.playerOneName||"Player 1",color:l.playerOne,isBot:!1,role:"human",difficulty:"",pocketedOwnCoinIds:[],capturedCoinIds:[],dueCount:0,returnedPenaltyCount:0},{id:"player-2",name:t==="vsBot"?e.playerTwoName||e.botName||ra(i):e.playerTwoName||"Player 2",color:l.playerTwo,isBot:t==="vsBot",role:t==="vsBot"?"bot":"human",difficulty:t==="vsBot"?s.id:"",pocketedOwnCoinIds:[],capturedCoinIds:[],dueCount:0,returnedPenaltyCount:0}],currentPlayerId:"player-1",turnNumber:1,shotNumber:0,queen:{state:"onBoard",pocketedByPlayerId:null,pendingCoverPlayerId:null,pendingCoverShotNumber:null},pocketedPieces:{white:[],black:[],queen:!1},lastShotSummary:null,lastFoul:"",messages:[`${e.playerOneName||"Player 1"} starts.`,t==="vsBot"?`Vs Bot mode: ${s.label} bot waits for Player 2 turns.`:"",a==="freeCapture"?"Free Capture mode. Pocket any coin to score.":"",a==="classic"?`${wr(r).label} Classic rules active.`:"",a!=="freeCapture"&&o==="random"?"Random side point mode active.":"",o==="firstPocket"?"First pocket decides color.":""].filter(Boolean),winnerPlayerId:null,isDraw:!1},this.turnManager=new bu(this.state),this.state}quitCurrentMatch(){if(this.state.status==="finished")return this.createMatchResult({messages:["Match already finished."]});const e=this.turnManager.getCurrentPlayer(),t=this.turnManager.getOpponentPlayer();return this.state.status="finished",this.state.winnerPlayerId=t.id,this.state.isDraw=!1,this.state.lastFoul="forfeit",this.state.messages=[`${e.name} quit the match. ${t.name} wins by forfeit.`],this.createMatchResult({ruleResult:{isFoul:!1,shouldSwitchTurn:!1,shouldContinueTurn:!1,queenCovered:!1,queenReturned:!1,queenPending:!1,messages:[...this.state.messages],piecesToReturn:[]},resolvedPlayer:e,activePlayer:t,winner:t})}forfeitPlayer(e){if(this.state.status==="finished")return this.createMatchResult({messages:["Match already finished."]});const t=this.state.players.find(s=>s.id===e)||this.turnManager.getCurrentPlayer(),i=this.state.players.find(s=>s.id!==t.id)||this.turnManager.getOpponentPlayer();return this.state.status="finished",this.state.winnerPlayerId=i.id,this.state.isDraw=!1,this.state.lastFoul="forfeit",this.state.messages=[`${t.name} left the match. ${i.name} wins by forfeit.`],this.createMatchResult({ruleResult:{isFoul:!1,shouldSwitchTurn:!1,shouldContinueTurn:!1,queenCovered:!1,queenReturned:!1,queenPending:!1,messages:[...this.state.messages],piecesToReturn:[]},resolvedPlayer:t,activePlayer:i,winner:i})}applyShotSummary(e){if(this.state.status==="finished")return this.createMatchResult({messages:["Match already finished."],piecesToReturn:[]});this.state.shotNumber+=1;const t=this.normalizeSummary(e),i=this.turnManager.getCurrentPlayer(),s=this.isAwaitingFirstPocketAssignment();this.state.lastShotSummary=t,s&&!t.strikerPocketed&&this.assignFirstPocketColors(i,t),t.awaitedFirstPocketAssignment=s,t.colorAssignedThisShot=!!t.firstPocketAssignedColor,t.queenReturnedBeforeAssignment=s&&t.queenPocketed&&t.pocketed[0]?.type==="queen",this.state.ruleMode==="freeCapture"?this.scoreManager.applyCapturedCoins(this.state,i.id,t.pocketed):(!s||this.state.coinAssignment.isAssigned)&&this.scoreManager.applyPocketedCoins(this.state,t.pocketed);const a=this.rulesEngine.evaluate(this.state,i,t),r=this.applyRuleResult(a,i);this.resolveWinner(i,a),this.state.status!=="finished"&&(a.shouldSwitchTurn?this.turnManager.switchTurn():this.turnManager.continueTurn());const o=this.turnManager.getCurrentPlayer();if(this.state.status!=="finished"){const l=a.shouldSwitchTurn?`Turn switched to ${o.name}.`:`${o.name} continues.`;this.state.messages.push(l)}return this.createMatchResult({ruleResult:a,piecesToReturn:r,resolvedPlayer:i,activePlayer:this.turnManager.getCurrentPlayer(),winner:this.state.players.find(l=>l.id===this.state.winnerPlayerId)||null})}applyRuleResult(e,t){const i=[];(e.dueChanges||[]).forEach(a=>{this.scoreManager.applyDueChange(this.state,a.playerId,a.delta)}),e.queenCovered?this.queenManager.markCovered(this.state,t.id):e.queenPending&&this.queenManager.markPendingCover(this.state,t.id,this.state.shotNumber);const s=new Set;return e.piecesToReturn.forEach(a=>{if(s.has(a.id))return;if(s.add(a.id),a.type==="queen"){i.push(this.queenManager.returnQueen(this.state));return}const r=this.scoreManager.returnCoinToBoard(this.state,a.id)||(a.type==="coin"?{id:a.id,type:"coin",color:a.color}:null);r&&i.push(r)}),this.state.lastFoul=e.foulType||"",this.state.messages=e.messages.length?[...e.messages]:["Shot settled."],i}resolveWinner(e,t){if(!t.isFoul){if(this.state.ruleMode==="freeCapture"){this.resolveFreeCaptureWinner();return}this.scoreManager.hasAllOwnCoins(this.state,e.id)&&this.queenManager.isCovered(this.state)&&(this.state.status="finished",this.state.winnerPlayerId=e.id,this.state.messages.push(`${e.name} wins.`))}}resolveFreeCaptureWinner(){const e=this.scoreManager.getTotalNormalCoinsPocketed(this.state),t=this.state.queen.state!=="pendingCover";if(e<Tr||!t)return;const i=this.scoreManager.getScoreSnapshot(this.state),[s,a]=this.state.players,r=i[s.id].points,o=i[a.id].points;if(this.state.status="finished",r>o){this.state.winnerPlayerId=s.id,this.state.messages.push(`${s.name} wins Free Capture.`);return}if(o>r){this.state.winnerPlayerId=a.id,this.state.messages.push(`${a.name} wins Free Capture.`);return}const l=this.state.queen.state==="covered"?this.state.players.find(c=>c.id===this.state.queen.pocketedByPlayerId):null;if(l){this.state.winnerPlayerId=l.id,this.state.messages.push(`${l.name} wins on queen tie-break.`);return}this.state.isDraw=!0,this.state.messages.push("Free Capture ends in a draw.")}isAwaitingFirstPocketAssignment(){return this.state.ruleMode!=="freeCapture"&&this.state.coinAssignmentMode==="firstPocket"&&!this.state.coinAssignment.isAssigned}assignFirstPocketColors(e,t){const i=t.pocketed.find(a=>a.type==="coin"&&(a.color==="white"||a.color==="black"));if(!i)return!1;const s=this.turnManager.getOpponentPlayer();return e.color=i.color,s.color=i.color==="white"?"black":"white",this.state.coinAssignment.isAssigned=!0,this.state.coinAssignment.assignedByPlayerId=e.id,this.state.coinAssignment.assignedShotNumber=this.state.shotNumber,this.state.coinAssignment.firstPocketCoinId=i.id,t.firstPocketAssignedColor=i.color,t.firstPocketAssignedPlayerId=e.id,!0}normalizeSummary(e={}){const t=new Set,i=(e.pocketed||[]).filter(s=>!s?.id||t.has(s.id)?!1:(t.add(s.id),!0));return{...e,pocketed:i,pocketedCount:i.length,strikerPocketed:i.some(s=>s.type==="striker"),queenPocketed:i.some(s=>s.type==="queen"),coinPocketedIds:i.filter(s=>s.type==="coin").map(s=>s.id)}}getCurrentPlayer(){return this.turnManager.getCurrentPlayer()}getActiveBaseline(){return this.turnManager.getActiveBaseline()}createMatchResult({ruleResult:e=null,piecesToReturn:t=[],messages:i=null,resolvedPlayer:s=null,activePlayer:a=null,winner:r=null}={}){return{state:this.state,ruleResult:e,piecesToReturn:t,activeBaseline:this.getActiveBaseline(),resolvedPlayer:s,activePlayer:a||this.getCurrentPlayer(),winner:r,hud:this.toHudMatch(i)}}toHudMatch(e=null){const t=this.state.players[0],i=this.state.players[1],s=this.getCurrentPlayer(),a=this.scoreManager.getScoreSnapshot(this.state),r=this.state.players.find(T=>T.id===this.state.winnerPlayerId)||null,o=e||this.state.messages,l=this.state.scoringMode==="points",c=Ru(a,t,i),h=this.state.ruleMode==="freeCapture",u=h?!0:this.state.coinAssignment?.isAssigned!==!1,p=h?[...o,"Free Capture: pocket any coin. Every captured coin counts for you."]:u||o.some(T=>T.includes("First pocket decides color"))?o:[...o,"First pocket decides color."],f=Math.max(Tr-this.scoreManager.getTotalNormalCoinsPocketed(this.state),0),g=h?`${a[t.id].pocketed} captured`:`${a[t.id].pocketed}/${fs}`,v=h?`${a[i.id].pocketed} captured`:`${a[i.id].pocketed}/${fs}`,m=this.state.isDraw?"Match":r?.name||"",d=this.state.isDraw?"Scores tied":r?wn(r.color,this.state.ruleMode):"",E=l?`${a[t.id].points} - ${a[i.id].points} pts`:`${a[t.id].pocketed} - ${a[i.id].pocketed}`,M=h?`Free Capture | ${t.name}: ${a[t.id].pocketed} coins | ${i.name}: ${a[i.id].pocketed} coins`:`${t.name}: ${wn(t.color)} | ${i.name}: ${wn(i.color)}`,b=this.state.queen.state==="covered"?this.state.players.find(T=>T.id===this.state.queen.pocketedByPlayerId):null,R=h&&b?`Covered by ${b.name} (+3)`:this.queenManager.getDisplayStatus(this.state);return{currentTurn:r?r.name:s.name,currentColor:wn((r||s).color,this.state.ruleMode),matchMode:this.state.matchMode,matchModeLabel:Eu(this.state.matchMode),botDifficulty:this.state.botDifficulty,botDifficultyLabel:this.state.botDifficulty?Sn(this.state.botDifficulty).label:"",currentIsBot:!!s.isBot,ruleMode:this.state.ruleMode,ruleModeLabel:Cu(this.state.ruleMode,this.state.classicRuleVariant),classicRuleVariant:this.state.classicRuleVariant,classicRuleVariantLabel:wr(this.state.classicRuleVariant).label,playerOneName:t.name,playerTwoName:i.name,playerOneColor:wn(t.color,this.state.ruleMode),playerTwoColor:wn(i.color,this.state.ruleMode),playerOneScore:g,playerTwoScore:v,playerOnePocketed:a[t.id].pocketed,playerTwoPocketed:a[i.id].pocketed,playerOneRemaining:h?f:a[t.id].remaining,playerTwoRemaining:h?f:a[i.id].remaining,scoringMode:this.state.scoringMode,coinAssignmentMode:this.state.coinAssignmentMode,colorsAssigned:u,playerOnePoints:a[t.id].points,playerTwoPoints:a[i.id].points,pointsLabel:l?c:"",playerOneDue:a[t.id].dueCount,playerTwoDue:a[i.id].dueCount,dueStatus:a[t.id].dueCount||a[i.id].dueCount?`${t.name}: ${a[t.id].dueCount} | ${i.name}: ${a[i.id].dueCount}`:"",queenStatus:R,shotPower:this.state.status==="finished"?"Match over":"Ready",shotPowerRatio:0,turnNumber:this.state.turnNumber,shotNumber:this.state.shotNumber,foulStatus:this.state.lastFoul?"Foul":"Clear",status:p.join(" "),bannerTone:this.state.winnerPlayerId||this.state.isDraw?"success":this.state.lastFoul?"danger":this.state.queen.state==="pendingCover"?"warning":"default",winnerName:m,winnerColor:d,resultOutcome:this.state.isDraw?"Drawn":"Wins",resultScore:E,resultColorSummary:M,resultQueenStatus:R,resultTurns:this.state.turnNumber,resultShots:this.state.shotNumber}}}const vi=Object.create(null);vi.open="0";vi.close="1";vi.ping="2";vi.pong="3";vi.message="4";vi.upgrade="5";vi.noop="6";const oa=Object.create(null);Object.keys(vi).forEach(n=>{oa[vi[n]]=n});const Cr={type:"error",data:"parser error"},Hc=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Vc=typeof ArrayBuffer=="function",Gc=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,Ro=({type:n,data:e},t,i)=>Hc&&e instanceof Blob?t?i(e):pl(e,i):Vc&&(e instanceof ArrayBuffer||Gc(e))?t?i(e):pl(new Blob([e]),i):i(vi[n]+(e||"")),pl=(n,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(n)};function fl(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let Oa;function Au(n,e){if(Hc&&n.data instanceof Blob)return n.data.arrayBuffer().then(fl).then(e);if(Vc&&(n.data instanceof ArrayBuffer||Gc(n.data)))return e(fl(n.data));Ro(n,!1,t=>{Oa||(Oa=new TextEncoder),e(Oa.encode(t))})}const ml="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",us=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<ml.length;n++)us[ml.charCodeAt(n)]=n;const Iu=n=>{let e=n.length*.75,t=n.length,i,s=0,a,r,o,l;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const c=new ArrayBuffer(e),h=new Uint8Array(c);for(i=0;i<t;i+=4)a=us[n.charCodeAt(i)],r=us[n.charCodeAt(i+1)],o=us[n.charCodeAt(i+2)],l=us[n.charCodeAt(i+3)],h[s++]=a<<2|r>>4,h[s++]=(r&15)<<4|o>>2,h[s++]=(o&3)<<6|l&63;return c},Lu=typeof ArrayBuffer=="function",Po=(n,e)=>{if(typeof n!="string")return{type:"message",data:qc(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:ku(n.substring(1),e)}:oa[t]?n.length>1?{type:oa[t],data:n.substring(1)}:{type:oa[t]}:Cr},ku=(n,e)=>{if(Lu){const t=Iu(n);return qc(t,e)}else return{base64:!0,data:n}},qc=(n,e)=>e==="blob"?n instanceof Blob?n:new Blob([n]):n instanceof ArrayBuffer?n:n.buffer,Wc="",Du=(n,e)=>{const t=n.length,i=new Array(t);let s=0;n.forEach((a,r)=>{Ro(a,!1,o=>{i[r]=o,++s===t&&e(i.join(Wc))})})},Ou=(n,e)=>{const t=n.split(Wc),i=[];for(let s=0;s<t.length;s++){const a=Po(t[s],e);if(i.push(a),a.type==="error")break}return i};function Nu(){return new TransformStream({transform(n,e){Au(n,t=>{const i=t.length;let s;if(i<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,i);else if(i<65536){s=new Uint8Array(3);const a=new DataView(s.buffer);a.setUint8(0,126),a.setUint16(1,i)}else{s=new Uint8Array(9);const a=new DataView(s.buffer);a.setUint8(0,127),a.setBigUint64(1,BigInt(i))}n.data&&typeof n.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let Na;function Is(n){return n.reduce((e,t)=>e+t.length,0)}function Ls(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let i=0;for(let s=0;s<e;s++)t[s]=n[0][i++],i===n[0].length&&(n.shift(),i=0);return n.length&&i<n[0].length&&(n[0]=n[0].slice(i)),t}function Uu(n,e){Na||(Na=new TextDecoder);const t=[];let i=0,s=-1,a=!1;return new TransformStream({transform(r,o){for(t.push(r);;){if(i===0){if(Is(t)<1)break;const l=Ls(t,1);a=(l[0]&128)===128,s=l[0]&127,s<126?i=3:s===126?i=1:i=2}else if(i===1){if(Is(t)<2)break;const l=Ls(t,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),i=3}else if(i===2){if(Is(t)<8)break;const l=Ls(t,8),c=new DataView(l.buffer,l.byteOffset,l.length),h=c.getUint32(0);if(h>Math.pow(2,21)-1){o.enqueue(Cr);break}s=h*Math.pow(2,32)+c.getUint32(4),i=3}else{if(Is(t)<s)break;const l=Ls(t,s);o.enqueue(Po(a?l:Na.decode(l),e)),i=0}if(s===0||s>n){o.enqueue(Cr);break}}}})}const Xc=4;function Mt(n){if(n)return Fu(n)}function Fu(n){for(var e in Mt.prototype)n[e]=Mt.prototype[e];return n}Mt.prototype.on=Mt.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};Mt.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};Mt.prototype.off=Mt.prototype.removeListener=Mt.prototype.removeAllListeners=Mt.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var i,s=0;s<t.length;s++)if(i=t[s],i===e||i.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+n],this};Mt.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,s=t.length;i<s;++i)t[i].apply(this,e)}return this};Mt.prototype.emitReserved=Mt.prototype.emit;Mt.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};Mt.prototype.hasListeners=function(n){return!!this.listeners(n).length};const xa=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),Zt=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Bu="arraybuffer";function $c(n,...e){return e.reduce((t,i)=>(n.hasOwnProperty(i)&&(t[i]=n[i]),t),{})}const zu=Zt.setTimeout,Hu=Zt.clearTimeout;function wa(n,e){e.useNativeTimers?(n.setTimeoutFn=zu.bind(Zt),n.clearTimeoutFn=Hu.bind(Zt)):(n.setTimeoutFn=Zt.setTimeout.bind(Zt),n.clearTimeoutFn=Zt.clearTimeout.bind(Zt))}const Vu=1.33;function Gu(n){return typeof n=="string"?qu(n):Math.ceil((n.byteLength||n.size)*Vu)}function qu(n){let e=0,t=0;for(let i=0,s=n.length;i<s;i++)e=n.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function Yc(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Wu(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function Xu(n){let e={},t=n.split("&");for(let i=0,s=t.length;i<s;i++){let a=t[i].split("=");e[decodeURIComponent(a[0])]=decodeURIComponent(a[1])}return e}class $u extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class Ao extends Mt{constructor(e){super(),this.writable=!1,wa(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new $u(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=Po(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Wu(e);return t.length?"?"+t:""}}class Yu extends Ao{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};Ou(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Du(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=Yc()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let Kc=!1;try{Kc=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Ku=Kc;function ju(){}class Qu extends Yu{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(s,a)=>{this.onError("xhr post error",s,a)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class gi extends Mt{constructor(e,t,i){super(),this.createRequest=e,wa(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=$c(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&i.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var s;i.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=gi.requestsCount++,gi.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=ju,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete gi.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}gi.requestsCount=0;gi.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",gl);else if(typeof addEventListener=="function"){const n="onpagehide"in Zt?"pagehide":"unload";addEventListener(n,gl,!1)}}function gl(){for(let n in gi.requests)gi.requests.hasOwnProperty(n)&&gi.requests[n].abort()}const Zu=(function(){const n=jc({xdomain:!1});return n&&n.responseType!==null})();class Ju extends Qu{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Zu&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new gi(jc,this.uri(),e)}}function jc(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Ku))return new XMLHttpRequest}catch{}if(!e)try{return new Zt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Qc=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class ed extends Ao{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=Qc?{}:$c(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;Ro(i,this.supportsBinary,a=>{try{this.doWrite(i,a)}catch{}s&&xa(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=Yc()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Ua=Zt.WebSocket||Zt.MozWebSocket;class td extends ed{createSocket(e,t,i){return Qc?new Ua(e,t,i):t?new Ua(e,t):new Ua(e)}doWrite(e,t){this.ws.send(t)}}class id extends Ao{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Uu(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),s=Nu();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const a=()=>{i.read().then(({done:o,value:l})=>{o||(this.onPacket(l),a())}).catch(o=>{})};a();const r={type:"open"};this.query.sid&&(r.data=`{"sid":"${this.query.sid}"}`),this._writer.write(r).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;this._writer.write(i).then(()=>{s&&xa(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const nd={websocket:td,webtransport:id,polling:Ju},sd=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,ad=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Rr(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),i=n.indexOf("]");t!=-1&&i!=-1&&(n=n.substring(0,t)+n.substring(t,i).replace(/:/g,";")+n.substring(i,n.length));let s=sd.exec(n||""),a={},r=14;for(;r--;)a[ad[r]]=s[r]||"";return t!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a.pathNames=rd(a,a.path),a.queryKey=od(a,a.query),a}function rd(n,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function od(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,s,a){s&&(t[s]=a)}),t}const Pr=typeof addEventListener=="function"&&typeof removeEventListener=="function",la=[];Pr&&addEventListener("offline",()=>{la.forEach(n=>n())},!1);class Wi extends Mt{constructor(e,t){if(super(),this.binaryType=Bu,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=Rr(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=Rr(t.host).host);wa(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const s=i.prototype.name;this.transports.push(s),this._transportsByName[s]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Xu(this.opts.query)),Pr&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},la.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=Xc,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Wi.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",Wi.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const s=this.writeBuffer[i].data;if(s&&(t+=Gu(s)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,xa(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,s){if(typeof t=="function"&&(s=t,t=void 0),typeof i=="function"&&(s=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const a={type:e,data:t,options:i};this.emitReserved("packetCreate",a),this.writeBuffer.push(a),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(Wi.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Pr&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=la.indexOf(this._offlineEventListener);i!==-1&&la.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}Wi.protocol=Xc;class ld extends Wi{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;Wi.priorWebsocketSuccess=!1;const s=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",u=>{if(!i)if(u.type==="pong"&&u.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;Wi.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(h(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const p=new Error("probe error");p.transport=t.name,this.emitReserved("upgradeError",p)}}))};function a(){i||(i=!0,h(),t.close(),t=null)}const r=u=>{const p=new Error("probe error: "+u);p.transport=t.name,a(),this.emitReserved("upgradeError",p)};function o(){r("transport closed")}function l(){r("socket closed")}function c(u){t&&u.name!==t.name&&a()}const h=()=>{t.removeListener("open",s),t.removeListener("error",r),t.removeListener("close",o),this.off("close",l),this.off("upgrading",c)};t.once("open",s),t.once("error",r),t.once("close",o),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let cd=class extends ld{constructor(e,t={}){const i=typeof e=="object"?e:t;(!i.transports||i.transports&&typeof i.transports[0]=="string")&&(i.transports=(i.transports||["polling","websocket","webtransport"]).map(s=>nd[s]).filter(s=>!!s)),super(e,i)}};function hd(n,e="",t){let i=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),i=Rr(n)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const a=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+a+":"+i.port+e,i.href=i.protocol+"://"+a+(t&&t.port===i.port?"":":"+i.port),i}const ud=typeof ArrayBuffer=="function",dd=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,Zc=Object.prototype.toString,pd=typeof Blob=="function"||typeof Blob<"u"&&Zc.call(Blob)==="[object BlobConstructor]",fd=typeof File=="function"||typeof File<"u"&&Zc.call(File)==="[object FileConstructor]";function Io(n){return ud&&(n instanceof ArrayBuffer||dd(n))||pd&&n instanceof Blob||fd&&n instanceof File}function ca(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,i=n.length;t<i;t++)if(ca(n[t]))return!0;return!1}if(Io(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return ca(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&ca(n[t]))return!0;return!1}function md(n){const e=[],t=n.data,i=n;return i.data=Ar(t,e),i.attachments=e.length,{packet:i,buffers:e}}function Ar(n,e){if(!n)return n;if(Io(n)){const t={_placeholder:!0,num:e.length};return e.push(n),t}else if(Array.isArray(n)){const t=new Array(n.length);for(let i=0;i<n.length;i++)t[i]=Ar(n[i],e);return t}else if(typeof n=="object"&&!(n instanceof Date)){const t={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=Ar(n[i],e));return t}return n}function gd(n,e){return n.data=Ir(n.data,e),delete n.attachments,n}function Ir(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=Ir(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=Ir(n[t],e));return n}const vd=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var $e;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})($e||($e={}));class yd{constructor(e){this.replacer=e}encode(e){return(e.type===$e.EVENT||e.type===$e.ACK)&&ca(e)?this.encodeAsBinary({type:e.type===$e.EVENT?$e.BINARY_EVENT:$e.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===$e.BINARY_EVENT||e.type===$e.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=md(e),i=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(i),s}}class Lo extends Mt{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===$e.BINARY_EVENT;i||t.type===$e.BINARY_ACK?(t.type=i?$e.EVENT:$e.ACK,this.reconstructor=new Sd(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(Io(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if($e[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===$e.BINARY_EVENT||i.type===$e.BINARY_ACK){const a=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const r=e.substring(a,t);if(r!=Number(r)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const o=Number(r);if(!bd(o)||o<0)throw new Error("Illegal attachments");if(o>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=o}if(e.charAt(t+1)==="/"){const a=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(a,t)}else i.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const a=t+1;for(;++t;){const r=e.charAt(t);if(r==null||Number(r)!=r){--t;break}if(t===e.length)break}i.id=Number(e.substring(a,t+1))}if(e.charAt(++t)){const a=this.tryParse(e.substr(t));if(Lo.isPayloadValid(i.type,a))i.data=a;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case $e.CONNECT:return vl(t);case $e.DISCONNECT:return t===void 0;case $e.CONNECT_ERROR:return typeof t=="string"||vl(t);case $e.EVENT:case $e.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&vd.indexOf(t[0])===-1);case $e.ACK:case $e.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Sd{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=gd(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const bd=Number.isInteger||function(n){return typeof n=="number"&&isFinite(n)&&Math.floor(n)===n};function vl(n){return Object.prototype.toString.call(n)==="[object Object]"}const _d=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Lo,Encoder:yd,get PacketType(){return $e}},Symbol.toStringTag,{value:"Module"}));function ni(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const Md=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Jc extends Mt{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[ni(e,"open",this.onopen.bind(this)),ni(e,"packet",this.onpacket.bind(this)),ni(e,"error",this.onerror.bind(this)),ni(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,s,a;if(Md.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const r={type:$e.EVENT,data:t};if(r.options={},r.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const h=this.ids++,u=t.pop();this._registerAckCallback(h,u),r.id=h}const o=(s=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||s===void 0?void 0:s.writable,l=this.connected&&!(!((a=this.io.engine)===null||a===void 0)&&a._hasPingExpired());return this.flags.volatile&&!o||(l?(this.notifyOutgoingListeners(r),this.packet(r)):this.sendBuffer.push(r)),this.flags={},this}_registerAckCallback(e,t){var i;const s=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const a=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let o=0;o<this.sendBuffer.length;o++)this.sendBuffer[o].id===e&&this.sendBuffer.splice(o,1);t.call(this,new Error("operation has timed out"))},s),r=(...o)=>{this.io.clearTimeoutFn(a),t.apply(this,o)};r.withError=!0,this.acks[e]=r}emitWithAck(e,...t){return new Promise((i,s)=>{const a=(r,o)=>r?s(r):i(o);a.withError=!0,t.push(a),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...a)=>(this._queue[0],s!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...a)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:$e.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case $e.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case $e.EVENT:case $e.BINARY_EVENT:this.onevent(e);break;case $e.ACK:case $e.BINARY_ACK:this.onack(e);break;case $e.DISCONNECT:this.ondisconnect();break;case $e.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...s){i||(i=!0,t.packet({type:$e.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:$e.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function jn(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}jn.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=(Math.floor(e*10)&1)==0?n-t:n+t}return Math.min(n,this.max)|0};jn.prototype.reset=function(){this.attempts=0};jn.prototype.setMin=function(n){this.ms=n};jn.prototype.setMax=function(n){this.max=n};jn.prototype.setJitter=function(n){this.jitter=n};class Lr extends Mt{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,wa(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new jn({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||_d;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new cd(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const s=ni(t,"open",function(){i.onopen(),e&&e()}),a=o=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",o),e?e(o):this.maybeReconnectOnOpen()},r=ni(t,"error",a);if(this._timeout!==!1){const o=this._timeout,l=this.setTimeoutFn(()=>{s(),a(new Error("timeout")),t.close()},o);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(s),this.subs.push(r),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(ni(e,"ping",this.onping.bind(this)),ni(e,"data",this.ondata.bind(this)),ni(e,"error",this.onerror.bind(this)),ni(e,"close",this.onclose.bind(this)),ni(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){xa(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new Jc(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const ts={};function ha(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=hd(n,e.path||"/socket.io"),i=t.source,s=t.id,a=t.path,r=ts[s]&&a in ts[s].nsps,o=e.forceNew||e["force new connection"]||e.multiplex===!1||r;let l;return o?l=new Lr(i,e):(ts[s]||(ts[s]=new Lr(i,e)),l=ts[s]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(ha,{Manager:Lr,Socket:Jc,io:ha,connect:ha});const ks="/premium-carrom";function xd(){if(typeof window>"u")return ks;const{protocol:n,hostname:e,port:t,origin:i}=window.location;return new Set(["5173","5174","4173"]).has(t)?`${n}//${e}:3001${ks}`:!t||t==="3001"?`${i}${ks}`:`${i}${ks}`}class wd{constructor({url:e=xd()}={}){this.url=e,this.socket=null}connect(){return this.socket?.connected?Promise.resolve(this.socket):(this.socket||(this.socket=ha(this.url,{autoConnect:!1,transports:["websocket","polling"],reconnectionAttempts:3})),new Promise((e,t)=>{const i=()=>{a(),e(this.socket)},s=r=>{a(),t(r instanceof Error?r:new Error("Could not connect to online server."))},a=()=>{this.socket.off("connect",i),this.socket.off("connect_error",s)};this.socket.once("connect",i),this.socket.once("connect_error",s),this.socket.connect()}))}emit(e,t={}){this.socket?.emit(e,t)}on(e,t){this.socket?.on(e,t)}off(e,t){this.socket?.off(e,t)}disconnect(){this.socket?.disconnect()}get connected(){return!!this.socket?.connected}get id(){return this.socket?.id||""}}const ke={createRoom:"carrom:createRoom",joinRoom:"carrom:joinRoom",leaveRoom:"carrom:leaveRoom",startMatch:"carrom:startMatch",submitShot:"carrom:submitShot",requestRoomState:"carrom:requestRoomState",joinPublicQueue:"carrom:joinPublicQueue",cancelPublicQueue:"carrom:cancelPublicQueue",queuePing:"carrom:queuePing",queueReady:"carrom:queueReady",reconnectRoom:"carrom:reconnectRoom",requestRematch:"carrom:requestRematch",respondRematch:"carrom:respondRematch",roomCreated:"carrom:roomCreated",roomJoined:"carrom:roomJoined",roomState:"carrom:roomState",playerJoined:"carrom:playerJoined",playerLeft:"carrom:playerLeft",playerDisconnected:"carrom:playerDisconnected",playerReconnected:"carrom:playerReconnected",disconnectGraceStarted:"carrom:disconnectGraceStarted",disconnectGraceTick:"carrom:disconnectGraceTick",disconnectGraceExpired:"carrom:disconnectGraceExpired",roomClosed:"carrom:roomClosed",reconnectAccepted:"carrom:reconnectAccepted",reconnectRejected:"carrom:reconnectRejected",sessionExpired:"carrom:sessionExpired",matchStarted:"carrom:matchStarted",shotAccepted:"carrom:shotAccepted",shotRejected:"carrom:shotRejected",shotStarted:"carrom:shotStarted",shotSettled:"carrom:shotSettled",matchState:"carrom:matchState",turnTimer:"carrom:turnTimer",turnTimeout:"carrom:turnTimeout",matchFinished:"carrom:matchFinished",rematchRequested:"carrom:rematchRequested",rematchDeclined:"carrom:rematchDeclined",rematchStarted:"carrom:rematchStarted",queueJoined:"carrom:queueJoined",queueStatus:"carrom:queueStatus",queueCancelled:"carrom:queueCancelled",matchFound:"carrom:matchFound",matchmakingError:"carrom:matchmakingError",error:"carrom:error"},Ie={idle:"idle",connecting:"connecting",connected:"connected",lobby:"lobby",playing:"playing",waiting:"waiting",reconnecting:"reconnecting",grace:"grace",rematch:"rematch",queued:"queued",matched:"matched",finished:"finished",disconnected:"disconnected",error:"error"};function Fa(){return{status:Ie.idle,connectionStatus:"Offline",queueId:"",joinedAt:0,waitMs:0,playersWaiting:0,preferences:null,matchFound:null,message:"Find a casual 3D Carrom opponent.",error:""}}class Ed{constructor({client:e,callbacks:t={}}){this.client=e,this.callbacks=t,this.state=Fa(),this.boundHandlers=new Map}async connect(){return this.client.connected||(this.setState({status:Ie.connecting,connectionStatus:"Connecting...",error:""}),await this.client.connect()),this.bindSocketEvents(),this.setState({connectionStatus:"Connected"}),!0}bindSocketEvents(){if(this.boundHandlers.size)return;const e=(t,i)=>{this.boundHandlers.set(t,i),this.client.on(t,i)};e(ke.queueJoined,(t={})=>{this.setState({status:Ie.queued,queueId:t.queueId||"",joinedAt:t.joinedAt||Date.now(),waitMs:0,preferences:t.preferences||null,message:t.estimatedStatus||"Searching for opponent...",error:""}),this.callbacks.onQueueJoined?.(t,this.state)}),e(ke.queueStatus,(t={})=>{this.setState({status:t.status==="matched"?Ie.matched:Ie.queued,waitMs:Number(t.waitMs)||this.getWaitMs(),playersWaiting:Number(t.playersWaiting)||0,message:t.message||"Searching for opponent..."}),this.callbacks.onQueueStatus?.(t,this.state)}),e(ke.queueCancelled,(t={})=>{this.setState({...Fa(),connectionStatus:this.client.connected?"Connected":"Offline",message:t.reason||"Queue cancelled."}),this.callbacks.onQueueCancelled?.(t,this.state)}),e(ke.matchFound,(t={})=>{this.setState({status:Ie.matched,matchFound:t,queueId:"",waitMs:this.getWaitMs(),message:`Match found vs ${t.opponentName||"opponent"}.`,error:""}),this.callbacks.onMatchFound?.(t,this.state)}),e(ke.matchmakingError,(t={})=>{this.setState({status:Ie.error,error:t.message||"Matchmaking error.",message:t.message||"Matchmaking error."}),this.callbacks.onError?.(t,this.state)})}async joinQueue({playerName:e,preferences:t}){await this.connect(),this.setState({status:Ie.connecting,connectionStatus:"Connected",message:"Joining public queue...",error:""}),this.client.emit(ke.joinPublicQueue,{playerName:e,preferences:t})}cancelQueue(){return this.state.status===Ie.queued||this.state.queueId?(this.client.emit(ke.cancelPublicQueue,{}),!0):(this.setState({...Fa(),connectionStatus:this.client.connected?"Connected":"Offline"}),!1)}ping(){this.state.status===Ie.queued&&this.client.emit(ke.queuePing,{})}readyForMatch(e=this.state.matchFound||{}){e.roomCode&&this.client.emit(ke.queueReady,{matchId:e.matchId||"",roomCode:e.roomCode})}getWaitMs(){return this.state.joinedAt?Math.max(Date.now()-this.state.joinedAt,0):0}setState(e={}){this.state={...this.state,...e},this.callbacks.onChange?.(this.state)}dispose(){this.boundHandlers.forEach((e,t)=>{this.client.off(t,e)}),this.boundHandlers.clear()}}function yl(){return{status:Ie.idle,connectionStatus:"Offline",roomCode:"",playerId:"",seat:"",roomState:null,matchState:null,roomType:"private",pendingShot:!1,reconnectPrompt:null,disconnectGrace:null,turnTimer:null,rematch:null,latestServerStateVersion:0,lastRejectedShot:null,latencyMs:0,lastSession:null,message:"Create or join a private room.",error:""}}function Td(n=""){return String(n).trim().toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8)}class Cd{constructor({client:e,callbacks:t={}}){this.client=e,this.callbacks=t,this.state=yl(),this.boundHandlers=new Map}getServerStateVersion(e={}){const t=e?.serverStateVersion??e?.roomState?.serverStateVersion??e?.matchState?.serverStateVersion??0;return Number.isFinite(Number(t))?Number(t):0}acceptServerPayload(e={}){const t=this.getServerStateVersion(e);if(t>0&&t<(this.state.latestServerStateVersion||0))return!1;t>(this.state.latestServerStateVersion||0)&&(this.state={...this.state,latestServerStateVersion:t});const i=Number(e?.serverTime||e?.matchState?.serverTime||e?.roomState?.serverTime);return Number.isFinite(i)&&i>0&&(this.state={...this.state,latencyMs:Math.max(Date.now()-i,0)}),!0}async connect(){return this.client.connected?(this.bindSocketEvents(),!0):(this.setState({status:Ie.connecting,connectionStatus:"Connecting...",error:""}),await this.client.connect(),this.bindSocketEvents(),this.setState({status:Ie.connected,connectionStatus:"Connected"}),!0)}bindSocketEvents(){if(this.boundHandlers.size)return;const e=(t,i)=>{this.boundHandlers.set(t,i),this.client.on(t,i)};e(ke.roomCreated,t=>{this.acceptServerPayload(t)&&(this.setState({status:Ie.lobby,roomCode:t.roomCode,playerId:t.playerId,seat:t.seat,roomState:t.roomState,roomType:t.roomState?.roomType||"private",lastSession:t.session||null,message:"Room created. Share the room code."}),this.callbacks.onSession?.(t.session,this.state),this.callbacks.onRoomState?.(this.state))}),e(ke.roomJoined,t=>{this.acceptServerPayload(t)&&(this.setState({status:Ie.lobby,roomCode:t.roomCode,playerId:t.playerId,seat:t.seat,roomState:t.roomState,roomType:t.roomState?.roomType||"private",lastSession:t.session||null,message:"Joined room."}),this.callbacks.onSession?.(t.session,this.state),this.callbacks.onRoomState?.(this.state))}),e(ke.roomState,t=>{if(!this.acceptServerPayload(t))return;const i=t?.status==="closed";this.setState({roomState:t,roomType:t?.roomType||this.state.roomType||"private",matchState:t?.matchState||this.state.matchState,disconnectGrace:t?.disconnectGrace||null,turnTimer:t?.turnTimer||this.state.turnTimer,rematch:t?.rematch||this.state.rematch,status:i?Ie.disconnected:t?.status==="playing"?Ie.playing:Ie.lobby,message:t?.message||this.state.message,connectionStatus:i?"Opponent left":"Connected"}),this.callbacks.onRoomState?.(this.state)}),e(ke.playerJoined,t=>{this.acceptServerPayload(t)&&(this.setState({message:`${t.player?.name||"Opponent"} joined.`}),this.callbacks.onRoomState?.(this.state))}),e(ke.playerLeft,t=>{this.acceptServerPayload(t)&&(this.setState({status:Ie.disconnected,pendingShot:!1,connectionStatus:"Player left",message:t.reason||"Opponent left."}),this.callbacks.onPlayerLeft?.(t,this.state))}),e(ke.playerDisconnected,t=>{this.acceptServerPayload(t)&&(this.setState({status:Ie.grace,pendingShot:!1,disconnectGrace:t,connectionStatus:"Opponent disconnected",message:t.message||"Opponent disconnected."}),this.callbacks.onPlayerDisconnected?.(t,this.state))}),e(ke.disconnectGraceStarted,t=>{this.acceptServerPayload(t)&&(this.setState({status:Ie.grace,pendingShot:!1,disconnectGrace:t,connectionStatus:"Waiting for reconnect",message:t.message||"Waiting for opponent to reconnect."}),this.callbacks.onDisconnectGrace?.(t,this.state))}),e(ke.disconnectGraceTick,t=>{this.acceptServerPayload(t)&&(this.setState({disconnectGrace:t,connectionStatus:"Waiting for reconnect",message:t.message||"Waiting for opponent to reconnect."}),this.callbacks.onDisconnectGrace?.(t,this.state))}),e(ke.disconnectGraceExpired,t=>{this.acceptServerPayload(t)&&(this.setState({status:Ie.disconnected,pendingShot:!1,disconnectGrace:t,connectionStatus:"Room closed",message:t.message||"Opponent did not reconnect."}),this.callbacks.onDisconnectExpired?.(t,this.state))}),e(ke.roomClosed,t=>{this.acceptServerPayload(t)&&(this.setState({status:Ie.disconnected,pendingShot:!1,connectionStatus:"Room closed",message:t.reason||"Room closed."}),this.callbacks.onRoomClosed?.(t,this.state))}),e(ke.playerReconnected,t=>{this.acceptServerPayload(t)&&(this.setState({status:this.state.matchState?.status==="playing"?Ie.playing:this.state.status,disconnectGrace:null,connectionStatus:"Connected",message:t.message||"Player reconnected."}),this.callbacks.onPlayerReconnected?.(t,this.state))}),e(ke.reconnectAccepted,t=>{if(!this.acceptServerPayload(t))return;const i=t.matchState||t.roomState?.matchState||null;this.setState({status:i?.status==="finished"?Ie.finished:i?.status==="playing"?Ie.playing:Ie.lobby,connectionStatus:"Connected",roomCode:t.roomCode,playerId:t.playerId,roomState:t.roomState,roomType:t.roomState?.roomType||this.state.roomType,matchState:i,disconnectGrace:null,rematch:t.roomState?.rematch||null,turnTimer:t.roomState?.turnTimer||t.matchState?.turnTimer||null,lastSession:t.session||null,pendingShot:!1,reconnectPrompt:null,message:"Reconnected to online match."}),this.callbacks.onSession?.(t.session,this.state),this.callbacks.onReconnectAccepted?.(t,this.state)}),e(ke.reconnectRejected,t=>{this.setState({status:Ie.error,reconnectPrompt:null,error:t.message||"Reconnect failed.",message:t.message||"Reconnect failed."}),this.callbacks.onReconnectRejected?.(t,this.state)}),e(ke.sessionExpired,t=>{this.setState({status:Ie.error,reconnectPrompt:null,error:t.message||"Session expired.",message:t.message||"Session expired."}),this.callbacks.onSessionExpired?.(t,this.state)}),e(ke.matchStarted,t=>{this.acceptServerPayload(t)&&(this.setState({status:Ie.playing,roomState:t.roomState,roomType:t.roomState?.roomType||this.state.roomType||"private",matchState:t.matchState,disconnectGrace:t.roomState?.disconnectGrace||null,turnTimer:t.matchState?.turnTimer||t.roomState?.turnTimer||null,rematch:t.matchState?.rematch||t.roomState?.rematch||null,pendingShot:!1,message:"Online match started."}),this.callbacks.onMatchStarted?.(t.matchState,this.state))}),e(ke.shotAccepted,t=>{this.acceptServerPayload(t)&&(this.setState({pendingShot:!0,status:Ie.waiting,message:"Shot accepted."}),this.callbacks.onShotAccepted?.(t,this.state))}),e(ke.shotRejected,t=>{this.setState({pendingShot:!1,status:Ie.playing,lastRejectedShot:t||null,error:t.message||"Shot rejected.",message:t.message||"Shot rejected."}),this.callbacks.onShotRejected?.(t,this.state)}),e(ke.shotStarted,t=>{this.acceptServerPayload(t)&&(this.setState({pendingShot:!0,status:Ie.waiting,message:"Online shot in motion."}),this.callbacks.onShotStarted?.(t,this.state))}),e(ke.shotSettled,t=>{this.acceptServerPayload(t)&&(this.setState({pendingShot:!1,status:t.matchState?.status==="finished"?Ie.finished:Ie.playing,matchState:t.matchState,turnTimer:t.matchState?.turnTimer||this.state.turnTimer,rematch:t.matchState?.rematch||this.state.rematch,message:"Shot settled."}),this.callbacks.onShotSettled?.(t,this.state))}),e(ke.matchState,t=>{this.acceptServerPayload(t)&&(this.setState({matchState:t,turnTimer:t?.turnTimer||this.state.turnTimer,rematch:t?.rematch||this.state.rematch,disconnectGrace:t?.disconnectGrace||this.state.disconnectGrace,status:t?.status==="finished"?Ie.finished:Ie.playing}),this.callbacks.onMatchState?.(t,this.state))}),e(ke.turnTimer,t=>{this.acceptServerPayload(t)&&(this.setState({turnTimer:t,message:this.state.message}),this.callbacks.onTurnTimer?.(t,this.state))}),e(ke.turnTimeout,t=>{this.acceptServerPayload(t)&&(this.setState({pendingShot:!1,matchState:t.matchState||this.state.matchState,turnTimer:null,message:"Turn timed out."}),this.callbacks.onTurnTimeout?.(t,this.state))}),e(ke.matchFinished,t=>{this.acceptServerPayload(t)&&(this.setState({pendingShot:!1,status:Ie.finished,matchState:t.matchState,rematch:t.matchState?.rematch||this.state.rematch,message:t.draw?"Online match drawn.":"Online match finished."}),this.callbacks.onMatchFinished?.(t,this.state))}),e(ke.rematchRequested,t=>{this.acceptServerPayload(t)&&(this.setState({status:Ie.rematch,rematch:t.rematch||this.state.rematch,message:t.playerId===this.state.playerId?"Rematch request sent.":`${t.playerName||"Opponent"} wants a rematch.`}),this.callbacks.onRematchRequested?.(t,this.state))}),e(ke.rematchDeclined,t=>{this.acceptServerPayload(t)&&(this.setState({status:Ie.finished,rematch:t.rematch||null,message:`${t.playerName||"Opponent"} declined rematch.`}),this.callbacks.onRematchDeclined?.(t,this.state))}),e(ke.rematchStarted,t=>{this.acceptServerPayload(t)&&(this.setState({status:Ie.playing,roomState:t.roomState||this.state.roomState,matchState:t.matchState,rematch:null,pendingShot:!1,message:"Rematch started."}),this.callbacks.onRematchStarted?.(t,this.state))}),e(ke.error,t=>{this.setState({status:Ie.error,error:t.message||"Online error.",message:t.message||"Online error."}),this.callbacks.onError?.(t,this.state)})}async createRoom({playerName:e,matchConfig:t}){await this.connect(),this.setState({message:"Creating room...",error:""}),this.client.emit(ke.createRoom,{playerName:e,matchConfig:t})}async joinRoom({playerName:e,roomCode:t}){await this.connect(),this.setState({message:"Joining room...",error:""}),this.client.emit(ke.joinRoom,{playerName:e,roomCode:Td(t)})}leaveRoom(){this.state.roomCode&&this.client.emit(ke.leaveRoom,{roomCode:this.state.roomCode}),this.setState(yl()),this.callbacks.onRoomState?.(this.state)}startMatch(){this.state.roomCode&&(this.setState({message:"Starting match..."}),this.client.emit(ke.startMatch,{roomCode:this.state.roomCode}))}adoptMatchedRoom(e={}){this.bindSocketEvents(),this.setState({status:e.roomState?.status==="playing"?Ie.playing:Ie.lobby,connectionStatus:"Connected",roomCode:e.roomCode||e.roomState?.roomCode||"",playerId:e.playerId||"",seat:e.seat||"",lastSession:e.session||null,roomType:e.roomType||e.roomState?.roomType||"public",roomState:e.roomState||null,matchState:e.roomState?.matchState||null,pendingShot:!1,message:`Match found vs ${e.opponentName||"opponent"}.`}),this.callbacks.onSession?.(e.session,this.state),this.callbacks.onRoomState?.(this.state)}submitShot(e){return!this.state.roomCode||!this.state.matchState?.matchId||this.state.pendingShot?!1:(this.setState({pendingShot:!0,status:Ie.waiting,message:"Sending shot..."}),this.client.emit(ke.submitShot,{roomCode:this.state.roomCode,matchId:this.state.matchState.matchId,...e}),!0)}requestRoomState(){this.state.roomCode&&this.client.emit(ke.requestRoomState,{roomCode:this.state.roomCode})}showReconnectPrompt(e){this.setState({status:Ie.idle,reconnectPrompt:e,message:"Reconnect to previous online match?"})}async reconnectRoom(e){await this.connect(),this.setState({status:Ie.reconnecting,connectionStatus:"Reconnecting...",reconnectPrompt:null,message:"Reconnecting..."}),this.client.emit(ke.reconnectRoom,e)}requestRematch(){const e=this.state.matchState?.matchId||this.state.roomState?.matchState?.matchId||"";return!this.state.roomCode||!e?!1:(this.client.emit(ke.requestRematch,{roomCode:this.state.roomCode,matchId:e}),!0)}respondRematch(e){const t=this.state.matchState?.matchId||this.state.roomState?.matchState?.matchId||"";return!this.state.roomCode||!t?!1:(this.client.emit(ke.respondRematch,{roomCode:this.state.roomCode,matchId:t,accepted:!!e}),!0)}setState(e={}){this.state={...this.state,...e},this.callbacks.onChange?.(this.state)}getViewModel(){const e=this.state.roomState,t=e?.players||[],i=t.find(a=>a.seat==="host"),s=t.find(a=>a.seat==="guest");return{...this.state,host:i,guest:s,isHost:this.state.seat==="host",canStart:this.state.seat==="host"&&e?.status==="lobby"&&!!(i&&s),hasRoom:!!this.state.roomCode,roomStatus:e?.status||"offline",matchConfig:e?.matchConfig||{},roomType:e?.roomType||this.state.roomType||"private",reconnectPrompt:this.state.reconnectPrompt,disconnectGrace:this.state.disconnectGrace||e?.disconnectGrace||null,turnTimer:this.state.turnTimer||e?.turnTimer||null,rematch:this.state.rematch||e?.rematch||null,latestServerStateVersion:this.state.latestServerStateVersion||0,lastRejectedShot:this.state.lastRejectedShot||null,latencyMs:Math.round(Number(this.state.latencyMs)||0)}}dispose(){this.boundHandlers.forEach((e,t)=>{this.client.off(t,e)}),this.boundHandlers.clear(),this.client.disconnect()}}const Rd=3e5;function Ba(){return typeof window<"u"&&!!window.localStorage}function Sl(n={}){const e=String(n.sessionId||"").trim(),t=String(n.playerId||"").trim(),i=String(n.roomCode||"").trim().toUpperCase();return!e||!t||!i?null:{sessionId:e,playerId:t,roomCode:i,matchId:String(n.matchId||""),mode:n.mode==="onlinePublic"?"onlinePublic":"onlinePrivate",playerName:String(n.playerName||"Player").slice(0,24),createdAt:Number(n.createdAt)||Date.now(),updatedAt:Number(n.updatedAt)||Date.now()}}class Pd{constructor({storageKey:e=bi.onlineSession,staleMs:t=Rd}={}){this.storageKey=e,this.staleMs=t}loadSession(){if(!Ba())return null;try{const e=JSON.parse(window.localStorage.getItem(this.storageKey)||"null"),t=Sl(e);return!t||this.isExpired(t)?(this.clearSession(),null):t}catch{return this.clearSession(),null}}saveSession(e={}){if(!Ba())return null;const t=Sl({...e,updatedAt:Date.now()});return t?(window.localStorage.setItem(this.storageKey,JSON.stringify(t)),t):null}updateSession(e={}){const t=this.loadSession();return this.saveSession({...t||{},...e})}clearSession(){Ba()&&window.localStorage.removeItem(this.storageKey)}isExpired(e={}){return Date.now()-(Number(e.updatedAt)||0)>this.staleMs}getReconnectPayload(){const e=this.loadSession();return e?{sessionId:e.sessionId,playerId:e.playerId,roomCode:e.roomCode,matchId:e.matchId}:null}}function bl(n,e="classic"){return e==="freeCapture"?"Any":n?n==="white"?"White":"Black":"Unassigned"}class Ad{constructor({sceneRenderer:e}){this.sceneRenderer=e,this.pendingSettledPayload=null}applyMatchState(e,t={}){return e?(e.board&&this.sceneRenderer?.applyBoardSnapshot(e.board),this.toHud(e,t)):{...Ft}}toHud(e,t={}){const i=e.hud||{},s=e.mode==="onlinePublic"?"onlinePublic":"onlinePrivate",a=s==="onlinePublic"?"Online Public":"Online Private",r=e.players||[],o=r.find(M=>M.id==="player-1")||{},l=r.find(M=>M.id==="player-2")||{},c=e.currentPlayerId===t.playerId,h=e.status==="finished",u=!!t.pendingShot,p=!!(t.disconnectGrace||e.disconnectGrace),f=["requested","accepted"].includes(t.rematch?.status||e.rematch?.status),g=t.turnTimer||e.turnTimer||null,v=Number(t.latencyMs)||0,m=g?.active&&Number.isFinite(Number(g.remainingMs))?`Time ${Math.max(0,Math.ceil(Number(g.remainingMs)/1e3))}s`:"",d=v>0?`Sync ${Math.min(Math.round(v),999)}ms`:"",E=h?f?"Rematch pending.":"Match finished.":p?"Opponent disconnected.":u?"Sending shot...":c?"Your turn.":"Opponent turn.";return{...Ft,...i,matchMode:s,matchModeLabel:a,onlineActive:!0,onlineRoomCode:t.roomCode||e.roomCode||"",onlineConnectionStatus:t.connectionStatus||"Connected",onlineTurnStatus:[E,m,d].filter(Boolean).join(" | "),onlineTurnTimer:m,onlineTurnTimerLow:!!(g?.active&&Number(g.remainingMs)<=1e4),onlineDisconnectGrace:p?t.disconnectGrace||e.disconnectGrace:null,onlineRematchStatus:t.rematch?.status||e.rematch?.status||"idle",playerOneName:o.name||i.playerOneName||"Host",playerTwoName:l.name||i.playerTwoName||"Guest",playerOneColor:bl(o.color,e.ruleMode),playerTwoColor:bl(l.color,e.ruleMode),currentTurn:i.currentTurn||(e.currentPlayerId==="player-2"?l.name:o.name)||"Player",ruleMode:e.ruleMode,classicRuleVariant:e.classicRuleVariant,turnNumber:e.turnNumber,shotNumber:e.shotNumber,status:`${E} ${i.status||""}`.trim(),bannerTone:h?"success":c?"warning":"default",winnerName:i.winnerName||"",resultOutcome:e.draw?"Drawn":i.resultOutcome||"Wins",resultScore:i.resultScore||"",resultColorSummary:i.resultColorSummary||"",resultQueenStatus:i.resultQueenStatus||i.queenStatus||"On board",resultTurns:e.turnNumber,resultShots:e.shotNumber}}getActiveBaseline(e){return e?.activeBaseline||(e?.currentPlayerId==="player-2"?"top":"bottom")}getPlayerBaseline(e=""){return e==="player-2"?"top":"bottom"}getLocalPlayerBaseline(e,t={}){return this.getPlayerBaseline(t.playerId)}canLocalPlayerShoot(e,t={},i={}){const s=t.turnTimer||e?.turnTimer||null,a=!!(s?.active&&s.currentPlayerId===t.playerId&&Number(s.remainingMs)<=0);return!!(e?.status==="playing"&&t.playerId&&e.currentPlayerId===t.playerId&&!t.pendingShot&&!t.disconnectGrace&&!e.disconnectGrace&&!a&&!["requested","accepted"].includes(t.rematch?.status||e.rematch?.status)&&t.status!=="grace"&&t.status!=="reconnecting"&&t.status!=="rematch"&&t.status!=="waiting"&&t.status!=="disconnected"&&t.status!=="error"&&!i.anyMoving)}}function Id(n=0){const e=Math.floor(Math.max(n,0)/1e3),t=Math.floor(e/60),i=e%60;return`${t}:${String(i).padStart(2,"0")}`}function Ld(n={}){const e=n.ruleMode==="freeCapture"?"Free Capture":n.ruleMode==="any"?"Any Rules":"Classic",t=n.ruleMode==="freeCapture"?"":n.classicRuleVariant==="any"?"Any Style":n.classicRuleVariant||"Casual",i=n.ruleMode==="freeCapture"?"":n.coinAssignmentMode==="any"?"Any Side":n.coinAssignmentMode||"Random";return[e,t,i].filter(Boolean).join(" / ")}function Jt(n={}){const e=n.status||"idle",t=e==="matched"||!!n.matchFound,i=e==="queued",s=n.joinedAt?Date.now()-n.joinedAt:Number(n.waitMs)||0;return{view:t?"matched":i?"queued":"form",status:e,queued:i,matched:t,waitLabel:Id(s),playersWaiting:Number(n.playersWaiting)||0,message:n.error||n.message||"Find a casual 3D Carrom opponent.",tone:n.error?"danger":t?"success":i?"warning":"default",preferencesLabel:Ld(n.preferences||n.matchFound?.matchConfig||{}),opponentName:n.matchFound?.opponentName||"Opponent",roomCode:n.matchFound?.roomCode||"",startsAt:n.matchFound?.startsAt||0,connectionStatus:n.connectionStatus||"Offline"}}function yt(n={}){const e=n.roomState||{},t=e.players||[],i=t.find(M=>M.seat==="host")||null,s=t.find(M=>M.seat==="guest")||null,a=n.status||"idle",r=n.reconnectPrompt||null,o=n.disconnectGrace||e.disconnectGrace||null,l=n.turnTimer||e.turnTimer||n.matchState?.turnTimer||null,c=n.rematch||e.rematch||n.matchState?.rematch||null,h=Number(o?.remainingMs)||0,u=Number(l?.remainingMs)||0,p=M=>{const b=Math.max(0,Math.ceil(M/1e3)),R=Math.floor(b/60),T=b%60;return`${R}:${String(T).padStart(2,"0")}`},f=c?.status==="requested",g=!!c?.requestedBy?.includes?.(n.playerId),v=n.latestServerStateVersion||e.serverStateVersion||n.matchState?.serverStateVersion||0,m=Math.round(Number(n.latencyMs)||0),d=n.matchState?.matchId||e.matchState?.matchId||"",E=[`v${v}`,`${m}ms`,n.playerId||"no-player",d||"no-match",n.lastRejectedShot?.code||"OK"].join(" / ");return{view:r?"reconnect":e.status==="playing"||e.status==="finished"?"playing":n.roomCode?"lobby":"menu",status:a,roomCode:n.roomCode||e.roomCode||"",connectionStatus:n.connectionStatus||"Offline",message:n.message||"Create or join a private room.",error:n.error||"",reconnectPrompt:r,reconnectRoomCode:r?.roomCode||"",reconnectPlayerName:r?.playerName||"",host:i,guest:s,isHost:n.seat==="host",canStart:n.seat==="host"&&e.status==="lobby"&&!!(i&&s),matchConfig:e.matchConfig||{},playerId:n.playerId||"",disconnectGrace:o,disconnectLabel:h?p(h):"",turnTimer:l,turnTimerLabel:u?p(u):"",turnTimerLow:u>0&&u<=1e4,rematch:c,rematchLabel:c?.status==="declined"?"Rematch declined":f?g?"Rematch request sent":"Opponent wants rematch":"No rematch request",canRequestRematch:n.matchState?.status==="finished"&&!f,canAnswerRematch:n.matchState?.status==="finished"&&f&&!g,serverStateVersion:v,lastRejectedShot:n.lastRejectedShot||null,latencyMs:m,debugLabel:E}}const ko="180",kd=0,_l=1,Dd=2,eh=1,th=2,Ci=3,Ki=0,Vt=1,Ht=2,Xi=0,Vn=1,Ml=2,xl=3,wl=4,Od=5,dn=100,Nd=101,Ud=102,Fd=103,Bd=104,zd=200,Hd=201,Vd=202,Gd=203,kr=204,Dr=205,qd=206,Wd=207,Xd=208,$d=209,Yd=210,Kd=211,jd=212,Qd=213,Zd=214,Or=0,Nr=1,Ur=2,qn=3,Fr=4,Br=5,zr=6,Hr=7,ih=0,Jd=1,ep=2,$i=0,tp=1,ip=2,np=3,nh=4,sp=5,ap=6,rp=7,sh=300,Wn=301,Xn=302,Vr=303,Gr=304,Ea=306,qr=1e3,mn=1001,Wr=1002,ri=1003,op=1004,Ds=1005,fi=1006,za=1007,gn=1008,yi=1009,ah=1010,rh=1011,ms=1012,Do=1013,bn=1014,Ii=1015,_s=1016,Oo=1017,No=1018,gs=1020,oh=35902,lh=35899,ch=1021,hh=1022,ai=1023,vs=1026,ys=1027,uh=1028,Uo=1029,dh=1030,Fo=1031,Bo=1033,ua=33776,da=33777,pa=33778,fa=33779,Xr=35840,$r=35841,Yr=35842,Kr=35843,jr=36196,Qr=37492,Zr=37496,Jr=37808,eo=37809,to=37810,io=37811,no=37812,so=37813,ao=37814,ro=37815,oo=37816,lo=37817,co=37818,ho=37819,uo=37820,po=37821,fo=36492,mo=36494,go=36495,vo=36283,yo=36284,So=36285,bo=36286,lp=3200,cp=3201,ph=0,hp=1,Gi="",Bt="srgb",$n="srgb-linear",va="linear",tt="srgb",En=7680,El=519,up=512,dp=513,pp=514,fh=515,fp=516,mp=517,gp=518,vp=519,Tl=35044,Cl="300 es",mi=2e3,ya=2001;class Qn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const At=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ha=Math.PI/180,Sa=180/Math.PI;function Ms(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(At[n&255]+At[n>>8&255]+At[n>>16&255]+At[n>>24&255]+"-"+At[e&255]+At[e>>8&255]+"-"+At[e>>16&15|64]+At[e>>24&255]+"-"+At[t&63|128]+At[t>>8&255]+"-"+At[t>>16&255]+At[t>>24&255]+At[i&255]+At[i>>8&255]+At[i>>16&255]+At[i>>24&255]).toLowerCase()}function Ye(n,e,t){return Math.max(e,Math.min(t,n))}function yp(n,e){return(n%e+e)%e}function Va(n,e,t){return(1-t)*n+t*e}function is(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ut(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class Xe{constructor(e=0,t=0){Xe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class xs{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3];const p=a[r+0],f=a[r+1],g=a[r+2],v=a[r+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=p,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(u!==v||l!==p||c!==f||h!==g){let m=1-o;const d=l*p+c*f+h*g+u*v,E=d>=0?1:-1,M=1-d*d;if(M>Number.EPSILON){const R=Math.sqrt(M),T=Math.atan2(R,d*E);m=Math.sin(m*T)/R,o=Math.sin(o*T)/R}const b=o*E;if(l=l*m+p*b,c=c*m+f*b,h=h*m+g*b,u=u*m+v*b,m===1-o){const R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=a[r],p=a[r+1],f=a[r+2],g=a[r+3];return e[t]=o*g+h*u+l*f-c*p,e[t+1]=l*g+h*p+c*u-o*f,e[t+2]=c*g+h*f+o*p-l*u,e[t+3]=h*g-o*u-l*p-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(a/2),p=l(i/2),f=l(s/2),g=l(a/2);switch(r){case"XYZ":this._x=p*h*u+c*f*g,this._y=c*f*u-p*h*g,this._z=c*h*g+p*f*u,this._w=c*h*u-p*f*g;break;case"YXZ":this._x=p*h*u+c*f*g,this._y=c*f*u-p*h*g,this._z=c*h*g-p*f*u,this._w=c*h*u+p*f*g;break;case"ZXY":this._x=p*h*u-c*f*g,this._y=c*f*u+p*h*g,this._z=c*h*g+p*f*u,this._w=c*h*u-p*f*g;break;case"ZYX":this._x=p*h*u-c*f*g,this._y=c*f*u+p*h*g,this._z=c*h*g-p*f*u,this._w=c*h*u+p*f*g;break;case"YZX":this._x=p*h*u+c*f*g,this._y=c*f*u+p*h*g,this._z=c*h*g-p*f*u,this._w=c*h*u-p*f*g;break;case"XZY":this._x=p*h*u-c*f*g,this._y=c*f*u-p*h*g,this._z=c*h*g+p*f*u,this._w=c*h*u+p*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],p=i+o+u;if(p>0){const f=.5/Math.sqrt(p+1);this._w=.25/f,this._x=(h-l)*f,this._y=(a-c)*f,this._z=(r-s)*f}else if(i>o&&i>u){const f=2*Math.sqrt(1+i-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+r)/f,this._z=(a+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-i-u);this._w=(a-c)/f,this._x=(s+r)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-i-o);this._w=(r-s)/f,this._x=(a+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+r*o+s*c-a*l,this._y=s*h+r*l+a*o-i*c,this._z=a*h+r*c+i*l-s*o,this._w=r*h-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,a=this._z,r=this._w;let o=r*e._w+i*e._x+s*e._y+a*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=r,this._x=i,this._y=s,this._z=a,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*r+t*this._w,this._x=f*i+t*this._x,this._y=f*s+t*this._y,this._z=f*a+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,p=Math.sin(t*h)/c;return this._w=r*u+this._w*p,this._x=i*u+this._x*p,this._y=s*u+this._y*p,this._z=a*u+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,i=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Rl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Rl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,l=e.w,c=2*(r*s-o*i),h=2*(o*t-a*s),u=2*(a*i-r*t);return this.x=t+l*c+r*u-o*h,this.y=i+l*h+o*c-a*u,this.z=s+l*u+a*h-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,l=t.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ga.copy(this).projectOnVector(e),this.sub(Ga)}reflect(e){return this.sub(Ga.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ye(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ga=new L,Rl=new xs;class Be{constructor(e,t,i,s,a,r,o,l,c){Be.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c)}set(e,t,i,s,a,r,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=a,h[5]=l,h[6]=i,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],p=i[2],f=i[5],g=i[8],v=s[0],m=s[3],d=s[6],E=s[1],M=s[4],b=s[7],R=s[2],T=s[5],P=s[8];return a[0]=r*v+o*E+l*R,a[3]=r*m+o*M+l*T,a[6]=r*d+o*b+l*P,a[1]=c*v+h*E+u*R,a[4]=c*m+h*M+u*T,a[7]=c*d+h*b+u*P,a[2]=p*v+f*E+g*R,a[5]=p*m+f*M+g*T,a[8]=p*d+f*b+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*r*h-t*o*c-i*a*h+i*o*l+s*a*c-s*r*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*r-o*c,p=o*l-h*a,f=c*a-r*l,g=t*u+i*p+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(s*c-h*i)*v,e[2]=(o*i-s*r)*v,e[3]=p*v,e[4]=(h*t-s*l)*v,e[5]=(s*a-o*t)*v,e[6]=f*v,e[7]=(i*l-c*t)*v,e[8]=(r*t-i*a)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+e,-s*c,s*l,-s*(-c*r+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(qa.makeScale(e,t)),this}rotate(e){return this.premultiply(qa.makeRotation(-e)),this}translate(e,t){return this.premultiply(qa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const qa=new Be;function mh(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function ba(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Sp(){const n=ba("canvas");return n.style.display="block",n}const Pl={};function Ss(n){n in Pl||(Pl[n]=!0,console.warn(n))}function bp(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}const Al=new Be().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Il=new Be().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function _p(){const n={enabled:!0,workingColorSpace:$n,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===tt&&(s.r=Li(s.r),s.g=Li(s.g),s.b=Li(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===tt&&(s.r=Gn(s.r),s.g=Gn(s.g),s.b=Gn(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Gi?va:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Ss("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Ss("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[$n]:{primaries:e,whitePoint:i,transfer:va,toXYZ:Al,fromXYZ:Il,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Bt},outputColorSpaceConfig:{drawingBufferColorSpace:Bt}},[Bt]:{primaries:e,whitePoint:i,transfer:tt,toXYZ:Al,fromXYZ:Il,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Bt}}}),n}const Qe=_p();function Li(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Gn(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Tn;class Mp{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Tn===void 0&&(Tn=ba("canvas")),Tn.width=e.width,Tn.height=e.height;const s=Tn.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Tn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ba("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Li(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Li(t[i]/255)*255):t[i]=Li(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xp=0;class zo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xp++}),this.uuid=Ms(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Wa(s[r].image)):a.push(Wa(s[r]))}else a=Wa(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function Wa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Mp.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let wp=0;const Xa=new L;class Ot extends Qn{constructor(e=Ot.DEFAULT_IMAGE,t=Ot.DEFAULT_MAPPING,i=mn,s=mn,a=fi,r=gn,o=ai,l=yi,c=Ot.DEFAULT_ANISOTROPY,h=Gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wp++}),this.uuid=Ms(),this.name="",this.source=new zo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Xe(0,0),this.repeat=new Xe(1,1),this.center=new Xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Be,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Xa).x}get height(){return this.source.getSize(Xa).y}get depth(){return this.source.getSize(Xa).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==sh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case qr:e.x=e.x-Math.floor(e.x);break;case mn:e.x=e.x<0?0:1;break;case Wr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case qr:e.y=e.y-Math.floor(e.y);break;case mn:e.y=e.y<0?0:1;break;case Wr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ot.DEFAULT_IMAGE=null;Ot.DEFAULT_MAPPING=sh;Ot.DEFAULT_ANISOTROPY=1;class it{constructor(e=0,t=0,i=0,s=1){it.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const l=e.elements,c=l[0],h=l[4],u=l[8],p=l[1],f=l[5],g=l[9],v=l[2],m=l[6],d=l[10];if(Math.abs(h-p)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+p)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,b=(f+1)/2,R=(d+1)/2,T=(h+p)/4,P=(u+v)/4,O=(g+m)/4;return M>b&&M>R?M<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(M),s=T/i,a=P/i):b>R?b<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(b),i=T/s,a=O/s):R<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(R),i=P/a,s=O/a),this.set(i,s,a,t),this}let E=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(p-h)*(p-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(u-v)/E,this.z=(p-h)/E,this.w=Math.acos((c+f+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ye(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ep extends Qn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new it(0,0,e,t),this.scissorTest=!1,this.viewport=new it(0,0,e,t);const s={width:e,height:t,depth:i.depth},a=new Ot(s);this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:fi,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new zo(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class _n extends Ep{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class gh extends Ot{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=ri,this.minFilter=ri,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Tp extends Ot{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=ri,this.minFilter=ri,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ws{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ei.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ei.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ei.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,ei):ei.fromBufferAttribute(a,r),ei.applyMatrix4(e.matrixWorld),this.expandByPoint(ei);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Os.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Os.copy(i.boundingBox)),Os.applyMatrix4(e.matrixWorld),this.union(Os)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ei),ei.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ns),Ns.subVectors(this.max,ns),Cn.subVectors(e.a,ns),Rn.subVectors(e.b,ns),Pn.subVectors(e.c,ns),Ni.subVectors(Rn,Cn),Ui.subVectors(Pn,Rn),nn.subVectors(Cn,Pn);let t=[0,-Ni.z,Ni.y,0,-Ui.z,Ui.y,0,-nn.z,nn.y,Ni.z,0,-Ni.x,Ui.z,0,-Ui.x,nn.z,0,-nn.x,-Ni.y,Ni.x,0,-Ui.y,Ui.x,0,-nn.y,nn.x,0];return!$a(t,Cn,Rn,Pn,Ns)||(t=[1,0,0,0,1,0,0,0,1],!$a(t,Cn,Rn,Pn,Ns))?!1:(Us.crossVectors(Ni,Ui),t=[Us.x,Us.y,Us.z],$a(t,Cn,Rn,Pn,Ns))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ei).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ei).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Mi=[new L,new L,new L,new L,new L,new L,new L,new L],ei=new L,Os=new ws,Cn=new L,Rn=new L,Pn=new L,Ni=new L,Ui=new L,nn=new L,ns=new L,Ns=new L,Us=new L,sn=new L;function $a(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){sn.fromArray(n,a);const o=s.x*Math.abs(sn.x)+s.y*Math.abs(sn.y)+s.z*Math.abs(sn.z),l=e.dot(sn),c=t.dot(sn),h=i.dot(sn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Cp=new ws,ss=new L,Ya=new L;class Ta{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Cp.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ss.subVectors(e,this.center);const t=ss.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(ss,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ya.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ss.copy(e.center).add(Ya)),this.expandByPoint(ss.copy(e.center).sub(Ya))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const xi=new L,Ka=new L,Fs=new L,Fi=new L,ja=new L,Bs=new L,Qa=new L;class Ho{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,xi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=xi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(xi.copy(this.origin).addScaledVector(this.direction,t),xi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Ka.copy(e).add(t).multiplyScalar(.5),Fs.copy(t).sub(e).normalize(),Fi.copy(this.origin).sub(Ka);const a=e.distanceTo(t)*.5,r=-this.direction.dot(Fs),o=Fi.dot(this.direction),l=-Fi.dot(Fs),c=Fi.lengthSq(),h=Math.abs(1-r*r);let u,p,f,g;if(h>0)if(u=r*l-o,p=r*o-l,g=a*h,u>=0)if(p>=-g)if(p<=g){const v=1/h;u*=v,p*=v,f=u*(u+r*p+2*o)+p*(r*u+p+2*l)+c}else p=a,u=Math.max(0,-(r*p+o)),f=-u*u+p*(p+2*l)+c;else p=-a,u=Math.max(0,-(r*p+o)),f=-u*u+p*(p+2*l)+c;else p<=-g?(u=Math.max(0,-(-r*a+o)),p=u>0?-a:Math.min(Math.max(-a,-l),a),f=-u*u+p*(p+2*l)+c):p<=g?(u=0,p=Math.min(Math.max(-a,-l),a),f=p*(p+2*l)+c):(u=Math.max(0,-(r*a+o)),p=u>0?a:Math.min(Math.max(-a,-l),a),f=-u*u+p*(p+2*l)+c);else p=r>0?-a:a,u=Math.max(0,-(r*p+o)),f=-u*u+p*(p+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ka).addScaledVector(Fs,p),f}intersectSphere(e,t){xi.subVectors(e.center,this.origin);const i=xi.dot(this.direction),s=xi.dot(xi)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,p=this.origin;return c>=0?(i=(e.min.x-p.x)*c,s=(e.max.x-p.x)*c):(i=(e.max.x-p.x)*c,s=(e.min.x-p.x)*c),h>=0?(a=(e.min.y-p.y)*h,r=(e.max.y-p.y)*h):(a=(e.max.y-p.y)*h,r=(e.min.y-p.y)*h),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(e.min.z-p.z)*u,l=(e.max.z-p.z)*u):(o=(e.max.z-p.z)*u,l=(e.min.z-p.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,xi)!==null}intersectTriangle(e,t,i,s,a){ja.subVectors(t,e),Bs.subVectors(i,e),Qa.crossVectors(ja,Bs);let r=this.direction.dot(Qa),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Fi.subVectors(this.origin,e);const l=o*this.direction.dot(Bs.crossVectors(Fi,Bs));if(l<0)return null;const c=o*this.direction.dot(ja.cross(Fi));if(c<0||l+c>r)return null;const h=-o*Fi.dot(Qa);return h<0?null:this.at(h/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ut{constructor(e,t,i,s,a,r,o,l,c,h,u,p,f,g,v,m){ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c,h,u,p,f,g,v,m)}set(e,t,i,s,a,r,o,l,c,h,u,p,f,g,v,m){const d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=s,d[1]=a,d[5]=r,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=p,d[3]=f,d[7]=g,d[11]=v,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ut().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/An.setFromMatrixColumn(e,0).length(),a=1/An.setFromMatrixColumn(e,1).length(),r=1/An.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),u=Math.sin(a);if(e.order==="XYZ"){const p=r*h,f=r*u,g=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=p-v*c,t[9]=-o*l,t[2]=v-p*c,t[6]=g+f*c,t[10]=r*l}else if(e.order==="YXZ"){const p=l*h,f=l*u,g=c*h,v=c*u;t[0]=p+v*o,t[4]=g*o-f,t[8]=r*c,t[1]=r*u,t[5]=r*h,t[9]=-o,t[2]=f*o-g,t[6]=v+p*o,t[10]=r*l}else if(e.order==="ZXY"){const p=l*h,f=l*u,g=c*h,v=c*u;t[0]=p-v*o,t[4]=-r*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=r*h,t[9]=v-p*o,t[2]=-r*c,t[6]=o,t[10]=r*l}else if(e.order==="ZYX"){const p=r*h,f=r*u,g=o*h,v=o*u;t[0]=l*h,t[4]=g*c-f,t[8]=p*c+v,t[1]=l*u,t[5]=v*c+p,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=r*l}else if(e.order==="YZX"){const p=r*l,f=r*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-p*u,t[8]=g*u+f,t[1]=u,t[5]=r*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+g,t[10]=p-v*u}else if(e.order==="XZY"){const p=r*l,f=r*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=p*u+v,t[5]=r*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=v*u+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Rp,e,Pp)}lookAt(e,t,i){const s=this.elements;return Xt.subVectors(e,t),Xt.lengthSq()===0&&(Xt.z=1),Xt.normalize(),Bi.crossVectors(i,Xt),Bi.lengthSq()===0&&(Math.abs(i.z)===1?Xt.x+=1e-4:Xt.z+=1e-4,Xt.normalize(),Bi.crossVectors(i,Xt)),Bi.normalize(),zs.crossVectors(Xt,Bi),s[0]=Bi.x,s[4]=zs.x,s[8]=Xt.x,s[1]=Bi.y,s[5]=zs.y,s[9]=Xt.y,s[2]=Bi.z,s[6]=zs.z,s[10]=Xt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],p=i[9],f=i[13],g=i[2],v=i[6],m=i[10],d=i[14],E=i[3],M=i[7],b=i[11],R=i[15],T=s[0],P=s[4],O=s[8],x=s[12],_=s[1],I=s[5],U=s[9],z=s[13],q=s[2],$=s[6],W=s[10],ie=s[14],V=s[3],re=s[7],he=s[11],we=s[15];return a[0]=r*T+o*_+l*q+c*V,a[4]=r*P+o*I+l*$+c*re,a[8]=r*O+o*U+l*W+c*he,a[12]=r*x+o*z+l*ie+c*we,a[1]=h*T+u*_+p*q+f*V,a[5]=h*P+u*I+p*$+f*re,a[9]=h*O+u*U+p*W+f*he,a[13]=h*x+u*z+p*ie+f*we,a[2]=g*T+v*_+m*q+d*V,a[6]=g*P+v*I+m*$+d*re,a[10]=g*O+v*U+m*W+d*he,a[14]=g*x+v*z+m*ie+d*we,a[3]=E*T+M*_+b*q+R*V,a[7]=E*P+M*I+b*$+R*re,a[11]=E*O+M*U+b*W+R*he,a[15]=E*x+M*z+b*ie+R*we,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],p=e[10],f=e[14],g=e[3],v=e[7],m=e[11],d=e[15];return g*(+a*l*u-s*c*u-a*o*p+i*c*p+s*o*f-i*l*f)+v*(+t*l*f-t*c*p+a*r*p-s*r*f+s*c*h-a*l*h)+m*(+t*c*u-t*o*f-a*r*u+i*r*f+a*o*h-i*c*h)+d*(-s*o*h-t*l*u+t*o*p+s*r*u-i*r*p+i*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],p=e[10],f=e[11],g=e[12],v=e[13],m=e[14],d=e[15],E=u*m*c-v*p*c+v*l*f-o*m*f-u*l*d+o*p*d,M=g*p*c-h*m*c-g*l*f+r*m*f+h*l*d-r*p*d,b=h*v*c-g*u*c+g*o*f-r*v*f-h*o*d+r*u*d,R=g*u*l-h*v*l-g*o*p+r*v*p+h*o*m-r*u*m,T=t*E+i*M+s*b+a*R;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/T;return e[0]=E*P,e[1]=(v*p*a-u*m*a-v*s*f+i*m*f+u*s*d-i*p*d)*P,e[2]=(o*m*a-v*l*a+v*s*c-i*m*c-o*s*d+i*l*d)*P,e[3]=(u*l*a-o*p*a-u*s*c+i*p*c+o*s*f-i*l*f)*P,e[4]=M*P,e[5]=(h*m*a-g*p*a+g*s*f-t*m*f-h*s*d+t*p*d)*P,e[6]=(g*l*a-r*m*a-g*s*c+t*m*c+r*s*d-t*l*d)*P,e[7]=(r*p*a-h*l*a+h*s*c-t*p*c-r*s*f+t*l*f)*P,e[8]=b*P,e[9]=(g*u*a-h*v*a-g*i*f+t*v*f+h*i*d-t*u*d)*P,e[10]=(r*v*a-g*o*a+g*i*c-t*v*c-r*i*d+t*o*d)*P,e[11]=(h*o*a-r*u*a-h*i*c+t*u*c+r*i*f-t*o*f)*P,e[12]=R*P,e[13]=(h*v*s-g*u*s+g*i*p-t*v*p-h*i*m+t*u*m)*P,e[14]=(g*o*s-r*v*s-g*i*l+t*v*l+r*i*m-t*o*m)*P,e[15]=(r*u*s-h*o*s+h*i*l-t*u*l-r*i*p+t*o*p)*P,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,l=e.z,c=a*r,h=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*r,0,c*l-s*o,h*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,l=t._w,c=a+a,h=r+r,u=o+o,p=a*c,f=a*h,g=a*u,v=r*h,m=r*u,d=o*u,E=l*c,M=l*h,b=l*u,R=i.x,T=i.y,P=i.z;return s[0]=(1-(v+d))*R,s[1]=(f+b)*R,s[2]=(g-M)*R,s[3]=0,s[4]=(f-b)*T,s[5]=(1-(p+d))*T,s[6]=(m+E)*T,s[7]=0,s[8]=(g+M)*P,s[9]=(m-E)*P,s[10]=(1-(p+v))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let a=An.set(s[0],s[1],s[2]).length();const r=An.set(s[4],s[5],s[6]).length(),o=An.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),e.x=s[12],e.y=s[13],e.z=s[14],ti.copy(this);const c=1/a,h=1/r,u=1/o;return ti.elements[0]*=c,ti.elements[1]*=c,ti.elements[2]*=c,ti.elements[4]*=h,ti.elements[5]*=h,ti.elements[6]*=h,ti.elements[8]*=u,ti.elements[9]*=u,ti.elements[10]*=u,t.setFromRotationMatrix(ti),i.x=a,i.y=r,i.z=o,this}makePerspective(e,t,i,s,a,r,o=mi,l=!1){const c=this.elements,h=2*a/(t-e),u=2*a/(i-s),p=(t+e)/(t-e),f=(i+s)/(i-s);let g,v;if(l)g=a/(r-a),v=r*a/(r-a);else if(o===mi)g=-(r+a)/(r-a),v=-2*r*a/(r-a);else if(o===ya)g=-r/(r-a),v=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=mi,l=!1){const c=this.elements,h=2/(t-e),u=2/(i-s),p=-(t+e)/(t-e),f=-(i+s)/(i-s);let g,v;if(l)g=1/(r-a),v=r/(r-a);else if(o===mi)g=-2/(r-a),v=-(r+a)/(r-a);else if(o===ya)g=-1/(r-a),v=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=p,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const An=new L,ti=new ut,Rp=new L(0,0,0),Pp=new L(1,1,1),Bi=new L,zs=new L,Xt=new L,Ll=new ut,kl=new xs;class Si{constructor(e=0,t=0,i=0,s=Si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],p=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-Ye(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,f),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ye(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Ll.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ll,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return kl.setFromEuler(this),this.setFromQuaternion(kl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Si.DEFAULT_ORDER="XYZ";class Vo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Ap=0;const Dl=new L,In=new xs,wi=new ut,Hs=new L,as=new L,Ip=new L,Lp=new xs,Ol=new L(1,0,0),Nl=new L(0,1,0),Ul=new L(0,0,1),Fl={type:"added"},kp={type:"removed"},Ln={type:"childadded",child:null},Za={type:"childremoved",child:null};class xt extends Qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ap++}),this.uuid=Ms(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xt.DEFAULT_UP.clone();const e=new L,t=new Si,i=new xs,s=new L(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ut},normalMatrix:{value:new Be}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return In.setFromAxisAngle(e,t),this.quaternion.multiply(In),this}rotateOnWorldAxis(e,t){return In.setFromAxisAngle(e,t),this.quaternion.premultiply(In),this}rotateX(e){return this.rotateOnAxis(Ol,e)}rotateY(e){return this.rotateOnAxis(Nl,e)}rotateZ(e){return this.rotateOnAxis(Ul,e)}translateOnAxis(e,t){return Dl.copy(e).applyQuaternion(this.quaternion),this.position.add(Dl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ol,e)}translateY(e){return this.translateOnAxis(Nl,e)}translateZ(e){return this.translateOnAxis(Ul,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(wi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Hs.copy(e):Hs.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),as.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wi.lookAt(as,Hs,this.up):wi.lookAt(Hs,as,this.up),this.quaternion.setFromRotationMatrix(wi),s&&(wi.extractRotation(s.matrixWorld),In.setFromRotationMatrix(wi),this.quaternion.premultiply(In.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fl),Ln.child=e,this.dispatchEvent(Ln),Ln.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(kp),Za.child=e,this.dispatchEvent(Za),Za.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),wi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),wi.multiply(e.parent.matrixWorld)),e.applyMatrix4(wi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fl),Ln.child=e,this.dispatchEvent(Ln),Ln.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,e,Ip),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,Lp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];a(e.shapes,u)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(a(e.animations,l))}}if(t){const o=r(e.geometries),l=r(e.materials),c=r(e.textures),h=r(e.images),u=r(e.shapes),p=r(e.skeletons),f=r(e.animations),g=r(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),p.length>0&&(i.skeletons=p),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function r(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}xt.DEFAULT_UP=new L(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ii=new L,Ei=new L,Ja=new L,Ti=new L,kn=new L,Dn=new L,Bl=new L,er=new L,tr=new L,ir=new L,nr=new it,sr=new it,ar=new it;class si{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),ii.subVectors(e,t),s.cross(ii);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){ii.subVectors(s,t),Ei.subVectors(i,t),Ja.subVectors(e,t);const r=ii.dot(ii),o=ii.dot(Ei),l=ii.dot(Ja),c=Ei.dot(Ei),h=Ei.dot(Ja),u=r*c-o*o;if(u===0)return a.set(0,0,0),null;const p=1/u,f=(c*l-o*h)*p,g=(r*h-o*l)*p;return a.set(1-f-g,g,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Ti)===null?!1:Ti.x>=0&&Ti.y>=0&&Ti.x+Ti.y<=1}static getInterpolation(e,t,i,s,a,r,o,l){return this.getBarycoord(e,t,i,s,Ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Ti.x),l.addScaledVector(r,Ti.y),l.addScaledVector(o,Ti.z),l)}static getInterpolatedAttribute(e,t,i,s,a,r){return nr.setScalar(0),sr.setScalar(0),ar.setScalar(0),nr.fromBufferAttribute(e,t),sr.fromBufferAttribute(e,i),ar.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(nr,a.x),r.addScaledVector(sr,a.y),r.addScaledVector(ar,a.z),r}static isFrontFacing(e,t,i,s){return ii.subVectors(i,t),Ei.subVectors(e,t),ii.cross(Ei).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ii.subVectors(this.c,this.b),Ei.subVectors(this.a,this.b),ii.cross(Ei).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return si.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return si.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return si.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return si.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return si.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;kn.subVectors(s,i),Dn.subVectors(a,i),er.subVectors(e,i);const l=kn.dot(er),c=Dn.dot(er);if(l<=0&&c<=0)return t.copy(i);tr.subVectors(e,s);const h=kn.dot(tr),u=Dn.dot(tr);if(h>=0&&u<=h)return t.copy(s);const p=l*u-h*c;if(p<=0&&l>=0&&h<=0)return r=l/(l-h),t.copy(i).addScaledVector(kn,r);ir.subVectors(e,a);const f=kn.dot(ir),g=Dn.dot(ir);if(g>=0&&f<=g)return t.copy(a);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(Dn,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Bl.subVectors(a,s),o=(u-h)/(u-h+(f-g)),t.copy(s).addScaledVector(Bl,o);const d=1/(m+v+p);return r=v*d,o=p*d,t.copy(i).addScaledVector(kn,r).addScaledVector(Dn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const vh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zi={h:0,s:0,l:0},Vs={h:0,s:0,l:0};function rr(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class De{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Qe.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Qe.workingColorSpace){if(e=yp(e,1),t=Ye(t,0,1),i=Ye(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=rr(r,a,e+1/3),this.g=rr(r,a,e),this.b=rr(r,a,e-1/3)}return Qe.colorSpaceToWorking(this,s),this}setStyle(e,t=Bt){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bt){const i=vh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Li(e.r),this.g=Li(e.g),this.b=Li(e.b),this}copyLinearToSRGB(e){return this.r=Gn(e.r),this.g=Gn(e.g),this.b=Gn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bt){return Qe.workingToColorSpace(It.copy(this),e),Math.round(Ye(It.r*255,0,255))*65536+Math.round(Ye(It.g*255,0,255))*256+Math.round(Ye(It.b*255,0,255))}getHexString(e=Bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.workingToColorSpace(It.copy(this),t);const i=It.r,s=It.g,a=It.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let l,c;const h=(o+r)/2;if(o===r)l=0,c=0;else{const u=r-o;switch(c=h<=.5?u/(r+o):u/(2-r-o),r){case i:l=(s-a)/u+(s<a?6:0);break;case s:l=(a-i)/u+2;break;case a:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Qe.workingColorSpace){return Qe.workingToColorSpace(It.copy(this),t),e.r=It.r,e.g=It.g,e.b=It.b,e}getStyle(e=Bt){Qe.workingToColorSpace(It.copy(this),e);const t=It.r,i=It.g,s=It.b;return e!==Bt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(zi),this.setHSL(zi.h+e,zi.s+t,zi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(zi),e.getHSL(Vs);const i=Va(zi.h,Vs.h,t),s=Va(zi.s,Vs.s,t),a=Va(zi.l,Vs.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const It=new De;De.NAMES=vh;let Dp=0;class Zn extends Qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Dp++}),this.uuid=Ms(),this.name="",this.type="Material",this.blending=Vn,this.side=Ki,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=kr,this.blendDst=Dr,this.blendEquation=dn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new De(0,0,0),this.blendAlpha=0,this.depthFunc=qn,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=El,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=En,this.stencilZFail=En,this.stencilZPass=En,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Vn&&(i.blending=this.blending),this.side!==Ki&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==kr&&(i.blendSrc=this.blendSrc),this.blendDst!==Dr&&(i.blendDst=this.blendDst),this.blendEquation!==dn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==qn&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==El&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==En&&(i.stencilFail=this.stencilFail),this.stencilZFail!==En&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==En&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Rt extends Zn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new De(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.combine=ih,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const _t=new L,Gs=new Xe;let Op=0;class oi{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Op++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Tl,this.updateRanges=[],this.gpuType=Ii,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Gs.fromBufferAttribute(this,t),Gs.applyMatrix3(e),this.setXY(t,Gs.x,Gs.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=is(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ut(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=is(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=is(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=is(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=is(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array),s=Ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array),s=Ut(s,this.array),a=Ut(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Tl&&(e.usage=this.usage),e}}class yh extends oi{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Sh extends oi{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class gt extends oi{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Np=0;const Qt=new ut,or=new xt,On=new L,$t=new ws,rs=new ws,Ct=new L;class Gt extends Qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Np++}),this.uuid=Ms(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(mh(e)?Sh:yh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Be().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Qt.makeRotationFromQuaternion(e),this.applyMatrix4(Qt),this}rotateX(e){return Qt.makeRotationX(e),this.applyMatrix4(Qt),this}rotateY(e){return Qt.makeRotationY(e),this.applyMatrix4(Qt),this}rotateZ(e){return Qt.makeRotationZ(e),this.applyMatrix4(Qt),this}translate(e,t,i){return Qt.makeTranslation(e,t,i),this.applyMatrix4(Qt),this}scale(e,t,i){return Qt.makeScale(e,t,i),this.applyMatrix4(Qt),this}lookAt(e){return or.lookAt(e),or.updateMatrix(),this.applyMatrix4(or.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(On).negate(),this.translate(On.x,On.y,On.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new gt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ws);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];$t.setFromBufferAttribute(a),this.morphTargetsRelative?(Ct.addVectors(this.boundingBox.min,$t.min),this.boundingBox.expandByPoint(Ct),Ct.addVectors(this.boundingBox.max,$t.max),this.boundingBox.expandByPoint(Ct)):(this.boundingBox.expandByPoint($t.min),this.boundingBox.expandByPoint($t.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ta);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if($t.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];rs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ct.addVectors($t.min,rs.min),$t.expandByPoint(Ct),Ct.addVectors($t.max,rs.max),$t.expandByPoint(Ct)):($t.expandByPoint(rs.min),$t.expandByPoint(rs.max))}$t.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)Ct.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(Ct));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ct.fromBufferAttribute(o,c),l&&(On.fromBufferAttribute(e,c),Ct.add(On)),s=Math.max(s,i.distanceToSquared(Ct))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new oi(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],l=[];for(let O=0;O<i.count;O++)o[O]=new L,l[O]=new L;const c=new L,h=new L,u=new L,p=new Xe,f=new Xe,g=new Xe,v=new L,m=new L;function d(O,x,_){c.fromBufferAttribute(i,O),h.fromBufferAttribute(i,x),u.fromBufferAttribute(i,_),p.fromBufferAttribute(a,O),f.fromBufferAttribute(a,x),g.fromBufferAttribute(a,_),h.sub(c),u.sub(c),f.sub(p),g.sub(p);const I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(I),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(I),o[O].add(v),o[x].add(v),o[_].add(v),l[O].add(m),l[x].add(m),l[_].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let O=0,x=E.length;O<x;++O){const _=E[O],I=_.start,U=_.count;for(let z=I,q=I+U;z<q;z+=3)d(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const M=new L,b=new L,R=new L,T=new L;function P(O){R.fromBufferAttribute(s,O),T.copy(R);const x=o[O];M.copy(x),M.sub(R.multiplyScalar(R.dot(x))).normalize(),b.crossVectors(T,x);const I=b.dot(l[O])<0?-1:1;r.setXYZW(O,M.x,M.y,M.z,I)}for(let O=0,x=E.length;O<x;++O){const _=E[O],I=_.start,U=_.count;for(let z=I,q=I+U;z<q;z+=3)P(e.getX(z+0)),P(e.getX(z+1)),P(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new oi(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let p=0,f=i.count;p<f;p++)i.setXYZ(p,0,0,0);const s=new L,a=new L,r=new L,o=new L,l=new L,c=new L,h=new L,u=new L;if(e)for(let p=0,f=e.count;p<f;p+=3){const g=e.getX(p+0),v=e.getX(p+1),m=e.getX(p+2);s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,v),r.fromBufferAttribute(t,m),h.subVectors(r,a),u.subVectors(s,a),h.cross(u),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let p=0,f=t.count;p<f;p+=3)s.fromBufferAttribute(t,p+0),a.fromBufferAttribute(t,p+1),r.fromBufferAttribute(t,p+2),h.subVectors(r,a),u.subVectors(s,a),h.cross(u),i.setXYZ(p+0,h.x,h.y,h.z),i.setXYZ(p+1,h.x,h.y,h.z),i.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ct.fromBufferAttribute(e,t),Ct.normalize(),e.setXYZ(t,Ct.x,Ct.y,Ct.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,p=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*h;for(let d=0;d<h;d++)p[g++]=c[f++]}return new oi(p,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Gt,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let h=0,u=c.length;h<u;h++){const p=c[h],f=e(p,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,p=c.length;u<p;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const a=e.morphAttributes;for(const c in a){const h=[],u=a[c];for(let p=0,f=u.length;p<f;p++)h.push(u[p].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let c=0,h=r.length;c<h;c++){const u=r[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const zl=new ut,an=new Ho,qs=new Ta,Hl=new L,Ws=new L,Xs=new L,$s=new L,lr=new L,Ys=new L,Vl=new L,Ks=new L;class Ve extends xt{constructor(e=new Gt,t=new Rt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){Ys.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=o[l],u=a[l];h!==0&&(lr.fromBufferAttribute(u,e),r?Ys.addScaledVector(lr,h):Ys.addScaledVector(lr.sub(t),h))}t.add(Ys)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),qs.copy(i.boundingSphere),qs.applyMatrix4(a),an.copy(e.ray).recast(e.near),!(qs.containsPoint(an.origin)===!1&&(an.intersectSphere(qs,Hl)===null||an.origin.distanceToSquared(Hl)>(e.far-e.near)**2))&&(zl.copy(a).invert(),an.copy(e.ray).applyMatrix4(zl),!(i.boundingBox!==null&&an.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,an)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,u=a.attributes.normal,p=a.groups,f=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,v=p.length;g<v;g++){const m=p[g],d=r[m.materialIndex],E=Math.max(m.start,f.start),M=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let b=E,R=M;b<R;b+=3){const T=o.getX(b),P=o.getX(b+1),O=o.getX(b+2);s=js(this,d,e,i,c,h,u,T,P,O),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,d=v;m<d;m+=3){const E=o.getX(m),M=o.getX(m+1),b=o.getX(m+2);s=js(this,r,e,i,c,h,u,E,M,b),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let g=0,v=p.length;g<v;g++){const m=p[g],d=r[m.materialIndex],E=Math.max(m.start,f.start),M=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let b=E,R=M;b<R;b+=3){const T=b,P=b+1,O=b+2;s=js(this,d,e,i,c,h,u,T,P,O),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,d=v;m<d;m+=3){const E=m,M=m+1,b=m+2;s=js(this,r,e,i,c,h,u,E,M,b),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Up(n,e,t,i,s,a,r,o){let l;if(e.side===Vt?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,e.side===Ki,o),l===null)return null;Ks.copy(o),Ks.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ks);return c<t.near||c>t.far?null:{distance:c,point:Ks.clone(),object:n}}function js(n,e,t,i,s,a,r,o,l,c){n.getVertexPosition(o,Ws),n.getVertexPosition(l,Xs),n.getVertexPosition(c,$s);const h=Up(n,e,t,i,Ws,Xs,$s,Vl);if(h){const u=new L;si.getBarycoord(Vl,Ws,Xs,$s,u),s&&(h.uv=si.getInterpolatedAttribute(s,o,l,c,u,new Xe)),a&&(h.uv1=si.getInterpolatedAttribute(a,o,l,c,u,new Xe)),r&&(h.normal=si.getInterpolatedAttribute(r,o,l,c,u,new L),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const p={a:o,b:l,c,normal:new L,materialIndex:0};si.getNormal(Ws,Xs,$s,p.normal),h.face=p,h.barycoord=u}return h}class ki extends Gt{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],h=[],u=[];let p=0,f=0;g("z","y","x",-1,-1,i,t,e,r,a,0),g("z","y","x",1,-1,i,t,-e,r,a,1),g("x","z","y",1,1,e,i,t,s,r,2),g("x","z","y",1,-1,e,i,-t,s,r,3),g("x","y","z",1,-1,e,t,i,s,a,4),g("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new gt(c,3)),this.setAttribute("normal",new gt(h,3)),this.setAttribute("uv",new gt(u,2));function g(v,m,d,E,M,b,R,T,P,O,x){const _=b/P,I=R/O,U=b/2,z=R/2,q=T/2,$=P+1,W=O+1;let ie=0,V=0;const re=new L;for(let he=0;he<W;he++){const we=he*I-z;for(let Ge=0;Ge<$;Ge++){const at=Ge*_-U;re[v]=at*E,re[m]=we*M,re[d]=q,c.push(re.x,re.y,re.z),re[v]=0,re[m]=0,re[d]=T>0?1:-1,h.push(re.x,re.y,re.z),u.push(Ge/P),u.push(1-he/O),ie+=1}}for(let he=0;he<O;he++)for(let we=0;we<P;we++){const Ge=p+we+$*he,at=p+we+$*(he+1),lt=p+(we+1)+$*(he+1),Ze=p+(we+1)+$*he;l.push(Ge,at,Ze),l.push(at,lt,Ze),V+=6}o.addGroup(f,V,x),f+=V,p+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ki(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Yn(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Dt(n){const e={};for(let t=0;t<n.length;t++){const i=Yn(n[t]);for(const s in i)e[s]=i[s]}return e}function Fp(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function bh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Qe.workingColorSpace}const Bp={clone:Yn,merge:Dt};var zp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ji extends Zn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zp,this.fragmentShader=Hp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Yn(e.uniforms),this.uniformsGroups=Fp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class _h extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=mi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Hi=new L,Gl=new Xe,ql=new Xe;class zt extends _h{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Sa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ha*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Sa*2*Math.atan(Math.tan(Ha*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Hi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Hi.x,Hi.y).multiplyScalar(-e/Hi.z),Hi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Hi.x,Hi.y).multiplyScalar(-e/Hi.z)}getViewSize(e,t){return this.getViewBounds(e,Gl,ql),t.subVectors(ql,Gl)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ha*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,t-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Nn=-90,Un=1;class Vp extends xt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new zt(Nn,Un,e,t);s.layers=this.layers,this.add(s);const a=new zt(Nn,Un,e,t);a.layers=this.layers,this.add(a);const r=new zt(Nn,Un,e,t);r.layers=this.layers,this.add(r);const o=new zt(Nn,Un,e,t);o.layers=this.layers,this.add(o);const l=new zt(Nn,Un,e,t);l.layers=this.layers,this.add(l);const c=new zt(Nn,Un,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,l]=t;for(const c of t)this.remove(c);if(e===mi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ya)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,h]=this.children,u=e.getRenderTarget(),p=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,a),e.setRenderTarget(i,1,s),e.render(t,r),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,s),e.render(t,h),e.setRenderTarget(u,p,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Mh extends Ot{constructor(e=[],t=Wn,i,s,a,r,o,l,c,h){super(e,t,i,s,a,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Gp extends _n{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Mh(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ki(5,5,5),a=new ji({name:"CubemapFromEquirect",uniforms:Yn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Vt,blending:Xi});a.uniforms.tEquirect.value=t;const r=new Ve(s,a),o=t.minFilter;return t.minFilter===gn&&(t.minFilter=fi),new Vp(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}class Yt extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qp={type:"move"};class cr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){r=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),d=this._getHandJoint(c,v);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],p=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&p>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(qp)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Yt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Go{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new De(e),this.near=t,this.far=i}clone(){return new Go(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Wp extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Si,this.environmentIntensity=1,this.environmentRotation=new Si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const hr=new L,Xp=new L,$p=new Be;class Vi{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=hr.subVectors(i,t).cross(Xp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(hr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||$p.getNormalMatrix(e),s=this.coplanarPoint(hr).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const rn=new Ta,Yp=new Xe(.5,.5),Qs=new L;class qo{constructor(e=new Vi,t=new Vi,i=new Vi,s=new Vi,a=new Vi,r=new Vi){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=mi,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],l=a[2],c=a[3],h=a[4],u=a[5],p=a[6],f=a[7],g=a[8],v=a[9],m=a[10],d=a[11],E=a[12],M=a[13],b=a[14],R=a[15];if(s[0].setComponents(c-r,f-h,d-g,R-E).normalize(),s[1].setComponents(c+r,f+h,d+g,R+E).normalize(),s[2].setComponents(c+o,f+u,d+v,R+M).normalize(),s[3].setComponents(c-o,f-u,d-v,R-M).normalize(),i)s[4].setComponents(l,p,m,b).normalize(),s[5].setComponents(c-l,f-p,d-m,R-b).normalize();else if(s[4].setComponents(c-l,f-p,d-m,R-b).normalize(),t===mi)s[5].setComponents(c+l,f+p,d+m,R+b).normalize();else if(t===ya)s[5].setComponents(l,p,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),rn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),rn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(rn)}intersectsSprite(e){rn.center.set(0,0,0);const t=Yp.distanceTo(e.center);return rn.radius=.7071067811865476+t,rn.applyMatrix4(e.matrixWorld),this.intersectsSphere(rn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(Qs.x=s.normal.x>0?e.max.x:e.min.x,Qs.y=s.normal.y>0?e.max.y:e.min.y,Qs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Qs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class xh extends Zn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new De(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const _a=new L,Ma=new L,Wl=new ut,os=new Ho,Zs=new Ta,ur=new L,Xl=new L;class Kp extends xt{constructor(e=new Gt,t=new xh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,a=t.count;s<a;s++)_a.fromBufferAttribute(t,s-1),Ma.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=_a.distanceTo(Ma);e.setAttribute("lineDistance",new gt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Zs.copy(i.boundingSphere),Zs.applyMatrix4(s),Zs.radius+=a,e.ray.intersectsSphere(Zs)===!1)return;Wl.copy(s).invert(),os.copy(e.ray).applyMatrix4(Wl);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,p=i.attributes.position;if(h!==null){const f=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let v=f,m=g-1;v<m;v+=c){const d=h.getX(v),E=h.getX(v+1),M=Js(this,e,os,l,d,E,v);M&&t.push(M)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(f),d=Js(this,e,os,l,v,m,g-1);d&&t.push(d)}}else{const f=Math.max(0,r.start),g=Math.min(p.count,r.start+r.count);for(let v=f,m=g-1;v<m;v+=c){const d=Js(this,e,os,l,v,v+1,v);d&&t.push(d)}if(this.isLineLoop){const v=Js(this,e,os,l,g-1,f,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Js(n,e,t,i,s,a,r){const o=n.geometry.attributes.position;if(_a.fromBufferAttribute(o,s),Ma.fromBufferAttribute(o,a),t.distanceSqToSegment(_a,Ma,ur,Xl)>i)return;ur.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(ur);if(!(c<e.near||c>e.far))return{distance:c,point:Xl.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}class jp extends Ot{constructor(e,t,i,s,a,r,o,l,c){super(e,t,i,s,a,r,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class wh extends Ot{constructor(e,t,i=bn,s,a,r,o=ri,l=ri,c,h=vs,u=1){if(h!==vs&&h!==ys)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:e,height:t,depth:u};super(p,s,a,r,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new zo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Eh extends Ot{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Di extends Gt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const a=[],r=[],o=[],l=[],c=new L,h=new Xe;r.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,p=3;u<=t;u++,p+=3){const f=i+u/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),r.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(r[p]/e+1)/2,h.y=(r[p+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)a.push(u,u+1,0);this.setIndex(a),this.setAttribute("position",new gt(r,3)),this.setAttribute("normal",new gt(o,3)),this.setAttribute("uv",new gt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Di(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Kn extends Gt{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const h=[],u=[],p=[],f=[];let g=0;const v=[],m=i/2;let d=0;E(),r===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new gt(u,3)),this.setAttribute("normal",new gt(p,3)),this.setAttribute("uv",new gt(f,2));function E(){const b=new L,R=new L;let T=0;const P=(t-e)/i;for(let O=0;O<=a;O++){const x=[],_=O/a,I=_*(t-e)+e;for(let U=0;U<=s;U++){const z=U/s,q=z*l+o,$=Math.sin(q),W=Math.cos(q);R.x=I*$,R.y=-_*i+m,R.z=I*W,u.push(R.x,R.y,R.z),b.set($,P,W).normalize(),p.push(b.x,b.y,b.z),f.push(z,1-_),x.push(g++)}v.push(x)}for(let O=0;O<s;O++)for(let x=0;x<a;x++){const _=v[x][O],I=v[x+1][O],U=v[x+1][O+1],z=v[x][O+1];(e>0||x!==0)&&(h.push(_,I,z),T+=3),(t>0||x!==a-1)&&(h.push(I,U,z),T+=3)}c.addGroup(d,T,0),d+=T}function M(b){const R=g,T=new Xe,P=new L;let O=0;const x=b===!0?e:t,_=b===!0?1:-1;for(let U=1;U<=s;U++)u.push(0,m*_,0),p.push(0,_,0),f.push(.5,.5),g++;const I=g;for(let U=0;U<=s;U++){const q=U/s*l+o,$=Math.cos(q),W=Math.sin(q);P.x=x*W,P.y=m*_,P.z=x*$,u.push(P.x,P.y,P.z),p.push(0,_,0),T.x=$*.5+.5,T.y=W*.5*_+.5,f.push(T.x,T.y),g++}for(let U=0;U<s;U++){const z=R+U,q=I+U;b===!0?h.push(q,q+1,z):h.push(q+1,q,z),O+=3}c.addGroup(d,O,b===!0?1:2),d+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Mn extends Gt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=e/o,p=t/l,f=[],g=[],v=[],m=[];for(let d=0;d<h;d++){const E=d*p-r;for(let M=0;M<c;M++){const b=M*u-a;g.push(b,-E,0),v.push(0,0,1),m.push(M/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let E=0;E<o;E++){const M=E+c*d,b=E+c*(d+1),R=E+1+c*(d+1),T=E+1+c*d;f.push(M,b,T),f.push(b,R,T)}this.setIndex(f),this.setAttribute("position",new gt(g,3)),this.setAttribute("normal",new gt(v,3)),this.setAttribute("uv",new gt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mn(e.width,e.height,e.widthSegments,e.heightSegments)}}class Yi extends Gt{constructor(e=.5,t=1,i=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:r},i=Math.max(3,i),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let u=e;const p=(t-e)/s,f=new L,g=new Xe;for(let v=0;v<=s;v++){for(let m=0;m<=i;m++){const d=a+m/i*r;f.x=u*Math.cos(d),f.y=u*Math.sin(d),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}u+=p}for(let v=0;v<s;v++){const m=v*(i+1);for(let d=0;d<i;d++){const E=d+m,M=E,b=E+i+1,R=E+i+2,T=E+1;o.push(M,b,T),o.push(b,R,T)}}this.setIndex(o),this.setAttribute("position",new gt(l,3)),this.setAttribute("normal",new gt(c,3)),this.setAttribute("uv",new gt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yi(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Ca extends Gt{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(r+o,Math.PI);let c=0;const h=[],u=new L,p=new L,f=[],g=[],v=[],m=[];for(let d=0;d<=i;d++){const E=[],M=d/i;let b=0;d===0&&r===0?b=.5/t:d===i&&l===Math.PI&&(b=-.5/t);for(let R=0;R<=t;R++){const T=R/t;u.x=-e*Math.cos(s+T*a)*Math.sin(r+M*o),u.y=e*Math.cos(r+M*o),u.z=e*Math.sin(s+T*a)*Math.sin(r+M*o),g.push(u.x,u.y,u.z),p.copy(u).normalize(),v.push(p.x,p.y,p.z),m.push(T+b,1-M),E.push(c++)}h.push(E)}for(let d=0;d<i;d++)for(let E=0;E<t;E++){const M=h[d][E+1],b=h[d][E],R=h[d+1][E],T=h[d+1][E+1];(d!==0||r>0)&&f.push(M,b,T),(d!==i-1||l<Math.PI)&&f.push(b,R,T)}this.setIndex(f),this.setAttribute("position",new gt(g,3)),this.setAttribute("normal",new gt(v,3)),this.setAttribute("uv",new gt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ca(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class yn extends Gt{constructor(e=1,t=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],l=[],c=[],h=new L,u=new L,p=new L;for(let f=0;f<=i;f++)for(let g=0;g<=s;g++){const v=g/s*a,m=f/i*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(v),u.y=(e+t*Math.cos(m))*Math.sin(v),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),p.subVectors(u,h).normalize(),l.push(p.x,p.y,p.z),c.push(g/s),c.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=s;g++){const v=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,d=(s+1)*(f-1)+g,E=(s+1)*f+g;r.push(v,m,E),r.push(m,d,E)}this.setIndex(r),this.setAttribute("position",new gt(o,3)),this.setAttribute("normal",new gt(l,3)),this.setAttribute("uv",new gt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yn(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Lt extends Zn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new De(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new De(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ph,this.normalScale=new Xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Qp extends Zn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=lp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Zp extends Zn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Es extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new De(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Jp extends Es{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new De(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const dr=new ut,$l=new L,Yl=new L;class Wo{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Xe(512,512),this.mapType=yi,this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new qo,this._frameExtents=new Xe(1,1),this._viewportCount=1,this._viewports=[new it(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;$l.setFromMatrixPosition(e.matrixWorld),t.position.copy($l),Yl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Yl),t.updateMatrixWorld(),dr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(dr,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(dr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class ef extends Wo{constructor(){super(new zt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,i=Sa*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,a=e.distance||t.far;(i!==t.fov||s!==t.aspect||a!==t.far)&&(t.fov=i,t.aspect=s,t.far=a,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class tf extends Es{constructor(e,t,i=0,s=Math.PI/3,a=0,r=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.distance=i,this.angle=s,this.penumbra=a,this.decay=r,this.map=null,this.shadow=new ef}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Kl=new ut,ls=new L,pr=new L;class nf extends Wo{constructor(){super(new zt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Xe(4,2),this._viewportCount=6,this._viewports=[new it(2,1,1,1),new it(0,1,1,1),new it(3,1,1,1),new it(1,1,1,1),new it(3,0,1,1),new it(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,a=e.distance||i.far;a!==i.far&&(i.far=a,i.updateProjectionMatrix()),ls.setFromMatrixPosition(e.matrixWorld),i.position.copy(ls),pr.copy(i.position),pr.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(pr),i.updateMatrixWorld(),s.makeTranslation(-ls.x,-ls.y,-ls.z),Kl.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Kl,i.coordinateSystem,i.reversedDepth)}}class jl extends Es{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new nf}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Th extends _h{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class sf extends Wo{constructor(){super(new Th(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ql extends Es{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new sf}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class af extends Es{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class rf extends zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class of{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Zl=new ut;class lf{constructor(e,t,i=0,s=1/0){this.ray=new Ho(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Vo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Zl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Zl),this}intersectObject(e,t=!0,i=[]){return _o(e,this,i,t),i.sort(Jl),i}intersectObjects(e,t=!0,i=[]){for(let s=0,a=e.length;s<a;s++)_o(e[s],this,i,t);return i.sort(Jl),i}}function Jl(n,e){return n.distance-e.distance}function _o(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)_o(a[r],e,t,!0)}}function ec(n,e,t,i){const s=cf(i);switch(t){case ch:return n*e;case uh:return n*e/s.components*s.byteLength;case Uo:return n*e/s.components*s.byteLength;case dh:return n*e*2/s.components*s.byteLength;case Fo:return n*e*2/s.components*s.byteLength;case hh:return n*e*3/s.components*s.byteLength;case ai:return n*e*4/s.components*s.byteLength;case Bo:return n*e*4/s.components*s.byteLength;case ua:case da:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case pa:case fa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case $r:case Kr:return Math.max(n,16)*Math.max(e,8)/4;case Xr:case Yr:return Math.max(n,8)*Math.max(e,8)/2;case jr:case Qr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Zr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Jr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case eo:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case to:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case io:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case no:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case so:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case ao:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case ro:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case oo:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case lo:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case co:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ho:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case uo:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case po:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case fo:case mo:case go:return Math.ceil(n/4)*Math.ceil(e/4)*16;case vo:case yo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case So:case bo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function cf(n){switch(n){case yi:case ah:return{byteLength:1,components:1};case ms:case rh:case _s:return{byteLength:2,components:1};case Oo:case No:return{byteLength:2,components:4};case bn:case Do:case Ii:return{byteLength:4,components:1};case oh:case lh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ko}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ko);function Ch(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function hf(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,p=n.createBuffer();n.bindBuffer(l,p),n.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let p=0;for(let f=1;f<u.length;f++){const g=u[p],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++p,u[p]=v)}u.length=p+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];n.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var uf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,df=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,pf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ff=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,yf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Sf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,bf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_f=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,wf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ef=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Cf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Pf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Af=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,If=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Lf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,kf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Df=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Of=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Nf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Uf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ff=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,zf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,qf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Wf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Xf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$f=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Yf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Kf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Qf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Jf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,em=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,im=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,nm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,sm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,am=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,rm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,om=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,cm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,hm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,um=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,dm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ym=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Sm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,bm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_m=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Em=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Cm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Pm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Am=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Im=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,km=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Dm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Om=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Nm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Um=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Fm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,zm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,$m=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ym=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Km=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,jm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Qm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Zm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,eg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ig=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ng=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,sg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ag=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,rg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,og=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,lg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,cg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const hg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ug=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,vg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,yg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Sg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,bg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_g=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Eg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Pg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ag=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ig=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Lg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Og=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ng=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ug=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Bg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,He={alphahash_fragment:uf,alphahash_pars_fragment:df,alphamap_fragment:pf,alphamap_pars_fragment:ff,alphatest_fragment:mf,alphatest_pars_fragment:gf,aomap_fragment:vf,aomap_pars_fragment:yf,batching_pars_vertex:Sf,batching_vertex:bf,begin_vertex:_f,beginnormal_vertex:Mf,bsdfs:xf,iridescence_fragment:wf,bumpmap_pars_fragment:Ef,clipping_planes_fragment:Tf,clipping_planes_pars_fragment:Cf,clipping_planes_pars_vertex:Rf,clipping_planes_vertex:Pf,color_fragment:Af,color_pars_fragment:If,color_pars_vertex:Lf,color_vertex:kf,common:Df,cube_uv_reflection_fragment:Of,defaultnormal_vertex:Nf,displacementmap_pars_vertex:Uf,displacementmap_vertex:Ff,emissivemap_fragment:Bf,emissivemap_pars_fragment:zf,colorspace_fragment:Hf,colorspace_pars_fragment:Vf,envmap_fragment:Gf,envmap_common_pars_fragment:qf,envmap_pars_fragment:Wf,envmap_pars_vertex:Xf,envmap_physical_pars_fragment:nm,envmap_vertex:$f,fog_vertex:Yf,fog_pars_vertex:Kf,fog_fragment:jf,fog_pars_fragment:Qf,gradientmap_pars_fragment:Zf,lightmap_pars_fragment:Jf,lights_lambert_fragment:em,lights_lambert_pars_fragment:tm,lights_pars_begin:im,lights_toon_fragment:sm,lights_toon_pars_fragment:am,lights_phong_fragment:rm,lights_phong_pars_fragment:om,lights_physical_fragment:lm,lights_physical_pars_fragment:cm,lights_fragment_begin:hm,lights_fragment_maps:um,lights_fragment_end:dm,logdepthbuf_fragment:pm,logdepthbuf_pars_fragment:fm,logdepthbuf_pars_vertex:mm,logdepthbuf_vertex:gm,map_fragment:vm,map_pars_fragment:ym,map_particle_fragment:Sm,map_particle_pars_fragment:bm,metalnessmap_fragment:_m,metalnessmap_pars_fragment:Mm,morphinstance_vertex:xm,morphcolor_vertex:wm,morphnormal_vertex:Em,morphtarget_pars_vertex:Tm,morphtarget_vertex:Cm,normal_fragment_begin:Rm,normal_fragment_maps:Pm,normal_pars_fragment:Am,normal_pars_vertex:Im,normal_vertex:Lm,normalmap_pars_fragment:km,clearcoat_normal_fragment_begin:Dm,clearcoat_normal_fragment_maps:Om,clearcoat_pars_fragment:Nm,iridescence_pars_fragment:Um,opaque_fragment:Fm,packing:Bm,premultiplied_alpha_fragment:zm,project_vertex:Hm,dithering_fragment:Vm,dithering_pars_fragment:Gm,roughnessmap_fragment:qm,roughnessmap_pars_fragment:Wm,shadowmap_pars_fragment:Xm,shadowmap_pars_vertex:$m,shadowmap_vertex:Ym,shadowmask_pars_fragment:Km,skinbase_vertex:jm,skinning_pars_vertex:Qm,skinning_vertex:Zm,skinnormal_vertex:Jm,specularmap_fragment:eg,specularmap_pars_fragment:tg,tonemapping_fragment:ig,tonemapping_pars_fragment:ng,transmission_fragment:sg,transmission_pars_fragment:ag,uv_pars_fragment:rg,uv_pars_vertex:og,uv_vertex:lg,worldpos_vertex:cg,background_vert:hg,background_frag:ug,backgroundCube_vert:dg,backgroundCube_frag:pg,cube_vert:fg,cube_frag:mg,depth_vert:gg,depth_frag:vg,distanceRGBA_vert:yg,distanceRGBA_frag:Sg,equirect_vert:bg,equirect_frag:_g,linedashed_vert:Mg,linedashed_frag:xg,meshbasic_vert:wg,meshbasic_frag:Eg,meshlambert_vert:Tg,meshlambert_frag:Cg,meshmatcap_vert:Rg,meshmatcap_frag:Pg,meshnormal_vert:Ag,meshnormal_frag:Ig,meshphong_vert:Lg,meshphong_frag:kg,meshphysical_vert:Dg,meshphysical_frag:Og,meshtoon_vert:Ng,meshtoon_frag:Ug,points_vert:Fg,points_frag:Bg,shadow_vert:zg,shadow_frag:Hg,sprite_vert:Vg,sprite_frag:Gg},ae={common:{diffuse:{value:new De(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new Xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new De(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new De(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new De(16777215)},opacity:{value:1},center:{value:new Xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},ui={basic:{uniforms:Dt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:Dt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new De(0)}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:Dt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new De(0)},specular:{value:new De(1118481)},shininess:{value:30}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:Dt([ae.common,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.roughnessmap,ae.metalnessmap,ae.fog,ae.lights,{emissive:{value:new De(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:Dt([ae.common,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.gradientmap,ae.fog,ae.lights,{emissive:{value:new De(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:Dt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:Dt([ae.points,ae.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:Dt([ae.common,ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:Dt([ae.common,ae.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:Dt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:Dt([ae.sprite,ae.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distanceRGBA:{uniforms:Dt([ae.common,ae.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distanceRGBA_vert,fragmentShader:He.distanceRGBA_frag},shadow:{uniforms:Dt([ae.lights,ae.fog,{color:{value:new De(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};ui.physical={uniforms:Dt([ui.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new Xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new De(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new Xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new De(0)},specularColor:{value:new De(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new Xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const ea={r:0,b:0,g:0},on=new Si,qg=new ut;function Wg(n,e,t,i,s,a,r){const o=new De(0);let l=a===!0?0:1,c,h,u=null,p=0,f=null;function g(M){let b=M.isScene===!0?M.background:null;return b&&b.isTexture&&(b=(M.backgroundBlurriness>0?t:e).get(b)),b}function v(M){let b=!1;const R=g(M);R===null?d(o,l):R&&R.isColor&&(d(R,1),b=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||b)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(M,b){const R=g(b);R&&(R.isCubeTexture||R.mapping===Ea)?(h===void 0&&(h=new Ve(new ki(1,1,1),new ji({name:"BackgroundCubeMaterial",uniforms:Yn(ui.backgroundCube.uniforms),vertexShader:ui.backgroundCube.vertexShader,fragmentShader:ui.backgroundCube.fragmentShader,side:Vt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,P,O){this.matrixWorld.copyPosition(O.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),on.copy(b.backgroundRotation),on.x*=-1,on.y*=-1,on.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(on.y*=-1,on.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(qg.makeRotationFromEuler(on)),h.material.toneMapped=Qe.getTransfer(R.colorSpace)!==tt,(u!==R||p!==R.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=R,p=R.version,f=n.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(c===void 0&&(c=new Ve(new Mn(2,2),new ji({name:"BackgroundMaterial",uniforms:Yn(ui.background.uniforms),vertexShader:ui.background.vertexShader,fragmentShader:ui.background.fragmentShader,side:Ki,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=R,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(R.colorSpace)!==tt,R.matrixAutoUpdate===!0&&R.updateMatrix(),c.material.uniforms.uvTransform.value.copy(R.matrix),(u!==R||p!==R.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=R,p=R.version,f=n.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function d(M,b){M.getRGB(ea,bh(n)),i.buffers.color.setClear(ea.r,ea.g,ea.b,b,r)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,b=1){o.set(M),l=b,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,d(o,l)},render:v,addToRenderList:m,dispose:E}}function Xg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=p(null);let a=s,r=!1;function o(_,I,U,z,q){let $=!1;const W=u(z,U,I);a!==W&&(a=W,c(a.object)),$=f(_,z,U,q),$&&g(_,z,U,q),q!==null&&e.update(q,n.ELEMENT_ARRAY_BUFFER),($||r)&&(r=!1,b(_,I,U,z),q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function l(){return n.createVertexArray()}function c(_){return n.bindVertexArray(_)}function h(_){return n.deleteVertexArray(_)}function u(_,I,U){const z=U.wireframe===!0;let q=i[_.id];q===void 0&&(q={},i[_.id]=q);let $=q[I.id];$===void 0&&($={},q[I.id]=$);let W=$[z];return W===void 0&&(W=p(l()),$[z]=W),W}function p(_){const I=[],U=[],z=[];for(let q=0;q<t;q++)I[q]=0,U[q]=0,z[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:U,attributeDivisors:z,object:_,attributes:{},index:null}}function f(_,I,U,z){const q=a.attributes,$=I.attributes;let W=0;const ie=U.getAttributes();for(const V in ie)if(ie[V].location>=0){const he=q[V];let we=$[V];if(we===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&(we=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&(we=_.instanceColor)),he===void 0||he.attribute!==we||we&&he.data!==we.data)return!0;W++}return a.attributesNum!==W||a.index!==z}function g(_,I,U,z){const q={},$=I.attributes;let W=0;const ie=U.getAttributes();for(const V in ie)if(ie[V].location>=0){let he=$[V];he===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&(he=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&(he=_.instanceColor));const we={};we.attribute=he,he&&he.data&&(we.data=he.data),q[V]=we,W++}a.attributes=q,a.attributesNum=W,a.index=z}function v(){const _=a.newAttributes;for(let I=0,U=_.length;I<U;I++)_[I]=0}function m(_){d(_,0)}function d(_,I){const U=a.newAttributes,z=a.enabledAttributes,q=a.attributeDivisors;U[_]=1,z[_]===0&&(n.enableVertexAttribArray(_),z[_]=1),q[_]!==I&&(n.vertexAttribDivisor(_,I),q[_]=I)}function E(){const _=a.newAttributes,I=a.enabledAttributes;for(let U=0,z=I.length;U<z;U++)I[U]!==_[U]&&(n.disableVertexAttribArray(U),I[U]=0)}function M(_,I,U,z,q,$,W){W===!0?n.vertexAttribIPointer(_,I,U,q,$):n.vertexAttribPointer(_,I,U,z,q,$)}function b(_,I,U,z){v();const q=z.attributes,$=U.getAttributes(),W=I.defaultAttributeValues;for(const ie in $){const V=$[ie];if(V.location>=0){let re=q[ie];if(re===void 0&&(ie==="instanceMatrix"&&_.instanceMatrix&&(re=_.instanceMatrix),ie==="instanceColor"&&_.instanceColor&&(re=_.instanceColor)),re!==void 0){const he=re.normalized,we=re.itemSize,Ge=e.get(re);if(Ge===void 0)continue;const at=Ge.buffer,lt=Ge.type,Ze=Ge.bytesPerElement,Y=lt===n.INT||lt===n.UNSIGNED_INT||re.gpuType===Do;if(re.isInterleavedBufferAttribute){const Q=re.data,pe=Q.stride,Le=re.offset;if(Q.isInstancedInterleavedBuffer){for(let Me=0;Me<V.locationSize;Me++)d(V.location+Me,Q.meshPerAttribute);_.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let Me=0;Me<V.locationSize;Me++)m(V.location+Me);n.bindBuffer(n.ARRAY_BUFFER,at);for(let Me=0;Me<V.locationSize;Me++)M(V.location+Me,we/V.locationSize,lt,he,pe*Ze,(Le+we/V.locationSize*Me)*Ze,Y)}else{if(re.isInstancedBufferAttribute){for(let Q=0;Q<V.locationSize;Q++)d(V.location+Q,re.meshPerAttribute);_.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Q=0;Q<V.locationSize;Q++)m(V.location+Q);n.bindBuffer(n.ARRAY_BUFFER,at);for(let Q=0;Q<V.locationSize;Q++)M(V.location+Q,we/V.locationSize,lt,he,we*Ze,we/V.locationSize*Q*Ze,Y)}}else if(W!==void 0){const he=W[ie];if(he!==void 0)switch(he.length){case 2:n.vertexAttrib2fv(V.location,he);break;case 3:n.vertexAttrib3fv(V.location,he);break;case 4:n.vertexAttrib4fv(V.location,he);break;default:n.vertexAttrib1fv(V.location,he)}}}}E()}function R(){O();for(const _ in i){const I=i[_];for(const U in I){const z=I[U];for(const q in z)h(z[q].object),delete z[q];delete I[U]}delete i[_]}}function T(_){if(i[_.id]===void 0)return;const I=i[_.id];for(const U in I){const z=I[U];for(const q in z)h(z[q].object),delete z[q];delete I[U]}delete i[_.id]}function P(_){for(const I in i){const U=i[I];if(U[_.id]===void 0)continue;const z=U[_.id];for(const q in z)h(z[q].object),delete z[q];delete U[_.id]}}function O(){x(),r=!0,a!==s&&(a=s,c(a.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:O,resetDefaultState:x,dispose:R,releaseStatesOfGeometry:T,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:m,disableUnusedAttributes:E}}function $g(n,e,t){let i;function s(c){i=c}function a(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function r(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),t.update(h,i,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,i,1)}function l(c,h,u,p){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)r(c[g],h[g],p[g]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,h,0,p,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*p[v];t.update(g,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Yg(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(P){return!(P!==ai&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const O=P===_s&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==yi&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Ii&&!O)}function l(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),E=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),b=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:p,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:E,maxVaryings:M,maxFragmentUniforms:b,vertexTextures:R,maxSamples:T}}function Kg(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new Vi,o=new Be,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){const f=u.length!==0||p||i!==0||s;return s=p,i=u.length,f},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,p){t=h(u,p,0)},this.setState=function(u,p,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,d=n.get(u);if(!s||g===null||g.length===0||a&&!m)a?h(null):c();else{const E=a?0:i,M=E*4;let b=d.clippingState||null;l.value=b,b=h(g,p,M,f);for(let R=0;R!==M;++R)b[R]=t[R];d.clippingState=b,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,p,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const d=f+v*4,E=p.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<d)&&(m=new Float32Array(d));for(let M=0,b=f;M!==v;++M,b+=4)r.copy(u[M]).applyMatrix4(E,o),r.normal.toArray(m,b),m[b+3]=r.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function jg(n){let e=new WeakMap;function t(r,o){return o===Vr?r.mapping=Wn:o===Gr&&(r.mapping=Xn),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===Vr||o===Gr)if(e.has(r)){const l=e.get(r).texture;return t(l,r.mapping)}else{const l=r.image;if(l&&l.height>0){const c=new Gp(l.height);return c.fromEquirectangularTexture(n,r),e.set(r,c),r.addEventListener("dispose",s),t(c.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}const zn=4,tc=[.125,.215,.35,.446,.526,.582],pn=20,fr=new Th,ic=new De;let mr=null,gr=0,vr=0,yr=!1;const un=(1+Math.sqrt(5))/2,Fn=1/un,nc=[new L(-un,Fn,0),new L(un,Fn,0),new L(-Fn,0,un),new L(Fn,0,un),new L(0,un,-Fn),new L(0,un,Fn),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],Qg=new L;class sc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=Qg}=a;mr=this._renderer.getRenderTarget(),gr=this._renderer.getActiveCubeFace(),vr=this._renderer.getActiveMipmapLevel(),yr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=oc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(mr,gr,vr),this._renderer.xr.enabled=yr,e.scissorTest=!1,ta(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Wn||e.mapping===Xn?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),mr=this._renderer.getRenderTarget(),gr=this._renderer.getActiveCubeFace(),vr=this._renderer.getActiveMipmapLevel(),yr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:fi,minFilter:fi,generateMipmaps:!1,type:_s,format:ai,colorSpace:$n,depthBuffer:!1},s=ac(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ac(e,t,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Zg(a)),this._blurMaterial=Jg(a,e,t)}return s}_compileMaterial(e){const t=new Ve(this._lodPlanes[0],e);this._renderer.compile(t,fr)}_sceneToCubeUV(e,t,i,s,a){const l=new zt(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,p=u.autoClear,f=u.toneMapping;u.getClearColor(ic),u.toneMapping=$i,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const v=new Rt({name:"PMREM.Background",side:Vt,depthWrite:!1,depthTest:!1}),m=new Ve(new ki,v);let d=!1;const E=e.background;E?E.isColor&&(v.color.copy(E),e.background=null,d=!0):(v.color.copy(ic),d=!0);for(let M=0;M<6;M++){const b=M%3;b===0?(l.up.set(0,c[M],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+h[M],a.y,a.z)):b===1?(l.up.set(0,0,c[M]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+h[M],a.z)):(l.up.set(0,c[M],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+h[M]));const R=this._cubeSize;ta(s,b*R,M>2?R:0,R,R),u.setRenderTarget(s),d&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=p,e.background=E}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Wn||e.mapping===Xn;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=oc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rc());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new Ve(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;ta(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(r,fr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=nc[(s-a-1)%nc.length];this._blur(e,a-1,a,r,o)}t.autoClear=i}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Ve(this._lodPlanes[s],c),p=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*f):2*Math.PI/(2*pn-1),v=a/g,m=isFinite(a)?1+Math.floor(h*v):pn;m>pn&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${pn}`);const d=[];let E=0;for(let P=0;P<pn;++P){const O=P/v,x=Math.exp(-O*O/2);d.push(x),P===0?E+=x:P<m&&(E+=2*x)}for(let P=0;P<d.length;P++)d[P]=d[P]/E;p.envMap.value=e.texture,p.samples.value=m,p.weights.value=d,p.latitudinal.value=r==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:M}=this;p.dTheta.value=g,p.mipInt.value=M-i;const b=this._sizeLods[s],R=3*b*(s>M-zn?s-M+zn:0),T=4*(this._cubeSize-b);ta(t,R,T,3*b,2*b),l.setRenderTarget(t),l.render(u,fr)}}function Zg(n){const e=[],t=[],i=[];let s=n;const a=n-zn+1+tc.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);t.push(o);let l=1/o;r>n-zn?l=tc[r-n+zn-1]:r===0&&(l=0),i.push(l);const c=1/(o-2),h=-c,u=1+c,p=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,d=1,E=new Float32Array(v*g*f),M=new Float32Array(m*g*f),b=new Float32Array(d*g*f);for(let T=0;T<f;T++){const P=T%3*2/3-1,O=T>2?0:-1,x=[P,O,0,P+2/3,O,0,P+2/3,O+1,0,P,O,0,P+2/3,O+1,0,P,O+1,0];E.set(x,v*g*T),M.set(p,m*g*T);const _=[T,T,T,T,T,T];b.set(_,d*g*T)}const R=new Gt;R.setAttribute("position",new oi(E,v)),R.setAttribute("uv",new oi(M,m)),R.setAttribute("faceIndex",new oi(b,d)),e.push(R),s>zn&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function ac(n,e,t){const i=new _n(n,e,t);return i.texture.mapping=Ea,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ta(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function Jg(n,e,t){const i=new Float32Array(pn),s=new L(0,1,0);return new ji({name:"SphericalGaussianBlur",defines:{n:pn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function rc(){return new ji({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function oc(){return new ji({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xi,depthTest:!1,depthWrite:!1})}function Xo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ev(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Vr||l===Gr,h=l===Wn||l===Xn;if(c||h){let u=e.get(o);const p=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return t===null&&(t=new sc(n)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return c&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new sc(n)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",a),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function a(o){const l=o.target;l.removeEventListener("dispose",a);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:r}}function tv(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Ss("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function iv(n,e,t,i){const s={},a=new WeakMap;function r(u){const p=u.target;p.index!==null&&e.remove(p.index);for(const g in p.attributes)e.remove(p.attributes[g]);p.removeEventListener("dispose",r),delete s[p.id];const f=a.get(p);f&&(e.remove(f),a.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(u,p){return s[p.id]===!0||(p.addEventListener("dispose",r),s[p.id]=!0,t.memory.geometries++),p}function l(u){const p=u.attributes;for(const f in p)e.update(p[f],n.ARRAY_BUFFER)}function c(u){const p=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const E=f.array;v=f.version;for(let M=0,b=E.length;M<b;M+=3){const R=E[M+0],T=E[M+1],P=E[M+2];p.push(R,T,T,P,P,R)}}else if(g!==void 0){const E=g.array;v=g.version;for(let M=0,b=E.length/3-1;M<b;M+=3){const R=M+0,T=M+1,P=M+2;p.push(R,T,T,P,P,R)}}else return;const m=new(mh(p)?Sh:yh)(p,1);m.version=v;const d=a.get(u);d&&e.remove(d),a.set(u,m)}function h(u){const p=a.get(u);if(p){const f=u.index;f!==null&&p.version<f.version&&c(u)}else c(u);return a.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function nv(n,e,t){let i;function s(p){i=p}let a,r;function o(p){a=p.type,r=p.bytesPerElement}function l(p,f){n.drawElements(i,f,a,p*r),t.update(f,i,1)}function c(p,f,g){g!==0&&(n.drawElementsInstanced(i,f,a,p*r,g),t.update(f,i,g))}function h(p,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,a,p,0,g);let m=0;for(let d=0;d<g;d++)m+=f[d];t.update(m,i,1)}function u(p,f,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<p.length;d++)c(p[d]/r,f[d],v[d]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,a,p,0,v,0,g);let d=0;for(let E=0;E<g;E++)d+=f[E]*v[E];t.update(d,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function sv(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function av(n,e,t){const i=new WeakMap,s=new it;function a(r,o,l){const c=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let p=i.get(o);if(p===void 0||p.count!==u){let x=function(){P.dispose(),i.delete(o),o.removeEventListener("dispose",x)};p!==void 0&&p.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let M=0;f===!0&&(M=1),g===!0&&(M=2),v===!0&&(M=3);let b=o.attributes.position.count*M,R=1;b>e.maxTextureSize&&(R=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const T=new Float32Array(b*R*4*u),P=new gh(T,b,R,u);P.type=Ii,P.needsUpdate=!0;const O=M*4;for(let _=0;_<u;_++){const I=m[_],U=d[_],z=E[_],q=b*R*4*_;for(let $=0;$<I.count;$++){const W=$*O;f===!0&&(s.fromBufferAttribute(I,$),T[q+W+0]=s.x,T[q+W+1]=s.y,T[q+W+2]=s.z,T[q+W+3]=0),g===!0&&(s.fromBufferAttribute(U,$),T[q+W+4]=s.x,T[q+W+5]=s.y,T[q+W+6]=s.z,T[q+W+7]=0),v===!0&&(s.fromBufferAttribute(z,$),T[q+W+8]=s.x,T[q+W+9]=s.y,T[q+W+10]=s.z,T[q+W+11]=z.itemSize===4?s.w:1)}}p={count:u,texture:P,size:new Xe(b,R)},i.set(o,p),o.addEventListener("dispose",x)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",p.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",p.size)}return{update:a}}function rv(n,e,t,i){let s=new WeakMap;function a(l){const c=i.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;s.get(p)!==c&&(p.update(),s.set(p,c))}return u}function r(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:a,dispose:r}}const Rh=new Ot,lc=new wh(1,1),Ph=new gh,Ah=new Tp,Ih=new Mh,cc=[],hc=[],uc=new Float32Array(16),dc=new Float32Array(9),pc=new Float32Array(4);function Jn(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=cc[s];if(a===void 0&&(a=new Float32Array(s),cc[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function wt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Et(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ra(n,e){let t=hc[e];t===void 0&&(t=new Int32Array(e),hc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function ov(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function lv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2fv(this.addr,e),Et(t,e)}}function cv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(wt(t,e))return;n.uniform3fv(this.addr,e),Et(t,e)}}function hv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4fv(this.addr,e),Et(t,e)}}function uv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Et(t,e)}else{if(wt(t,i))return;pc.set(i),n.uniformMatrix2fv(this.addr,!1,pc),Et(t,i)}}function dv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Et(t,e)}else{if(wt(t,i))return;dc.set(i),n.uniformMatrix3fv(this.addr,!1,dc),Et(t,i)}}function pv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Et(t,e)}else{if(wt(t,i))return;uc.set(i),n.uniformMatrix4fv(this.addr,!1,uc),Et(t,i)}}function fv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function mv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2iv(this.addr,e),Et(t,e)}}function gv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;n.uniform3iv(this.addr,e),Et(t,e)}}function vv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4iv(this.addr,e),Et(t,e)}}function yv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Sv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2uiv(this.addr,e),Et(t,e)}}function bv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;n.uniform3uiv(this.addr,e),Et(t,e)}}function _v(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4uiv(this.addr,e),Et(t,e)}}function Mv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(lc.compareFunction=fh,a=lc):a=Rh,t.setTexture2D(e||a,s)}function xv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Ah,s)}function wv(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Ih,s)}function Ev(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Ph,s)}function Tv(n){switch(n){case 5126:return ov;case 35664:return lv;case 35665:return cv;case 35666:return hv;case 35674:return uv;case 35675:return dv;case 35676:return pv;case 5124:case 35670:return fv;case 35667:case 35671:return mv;case 35668:case 35672:return gv;case 35669:case 35673:return vv;case 5125:return yv;case 36294:return Sv;case 36295:return bv;case 36296:return _v;case 35678:case 36198:case 36298:case 36306:case 35682:return Mv;case 35679:case 36299:case 36307:return xv;case 35680:case 36300:case 36308:case 36293:return wv;case 36289:case 36303:case 36311:case 36292:return Ev}}function Cv(n,e){n.uniform1fv(this.addr,e)}function Rv(n,e){const t=Jn(e,this.size,2);n.uniform2fv(this.addr,t)}function Pv(n,e){const t=Jn(e,this.size,3);n.uniform3fv(this.addr,t)}function Av(n,e){const t=Jn(e,this.size,4);n.uniform4fv(this.addr,t)}function Iv(n,e){const t=Jn(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Lv(n,e){const t=Jn(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function kv(n,e){const t=Jn(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Dv(n,e){n.uniform1iv(this.addr,e)}function Ov(n,e){n.uniform2iv(this.addr,e)}function Nv(n,e){n.uniform3iv(this.addr,e)}function Uv(n,e){n.uniform4iv(this.addr,e)}function Fv(n,e){n.uniform1uiv(this.addr,e)}function Bv(n,e){n.uniform2uiv(this.addr,e)}function zv(n,e){n.uniform3uiv(this.addr,e)}function Hv(n,e){n.uniform4uiv(this.addr,e)}function Vv(n,e,t){const i=this.cache,s=e.length,a=Ra(t,s);wt(i,a)||(n.uniform1iv(this.addr,a),Et(i,a));for(let r=0;r!==s;++r)t.setTexture2D(e[r]||Rh,a[r])}function Gv(n,e,t){const i=this.cache,s=e.length,a=Ra(t,s);wt(i,a)||(n.uniform1iv(this.addr,a),Et(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||Ah,a[r])}function qv(n,e,t){const i=this.cache,s=e.length,a=Ra(t,s);wt(i,a)||(n.uniform1iv(this.addr,a),Et(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||Ih,a[r])}function Wv(n,e,t){const i=this.cache,s=e.length,a=Ra(t,s);wt(i,a)||(n.uniform1iv(this.addr,a),Et(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||Ph,a[r])}function Xv(n){switch(n){case 5126:return Cv;case 35664:return Rv;case 35665:return Pv;case 35666:return Av;case 35674:return Iv;case 35675:return Lv;case 35676:return kv;case 5124:case 35670:return Dv;case 35667:case 35671:return Ov;case 35668:case 35672:return Nv;case 35669:case 35673:return Uv;case 5125:return Fv;case 36294:return Bv;case 36295:return zv;case 36296:return Hv;case 35678:case 36198:case 36298:case 36306:case 35682:return Vv;case 35679:case 36299:case 36307:return Gv;case 35680:case 36300:case 36308:case 36293:return qv;case 36289:case 36303:case 36311:case 36292:return Wv}}class $v{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Tv(t.type)}}class Yv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Xv(t.type)}}class Kv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const Sr=/(\w+)(\])?(\[|\.)?/g;function fc(n,e){n.seq.push(e),n.map[e.id]=e}function jv(n,e,t){const i=n.name,s=i.length;for(Sr.lastIndex=0;;){const a=Sr.exec(i),r=Sr.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){fc(t,c===void 0?new $v(o,n,e):new Yv(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Kv(o),fc(t,u)),t=u}}}class ma{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=e.getActiveUniform(t,s),r=e.getUniformLocation(t,a.name);jv(a,r,this)}}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function mc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Qv=37297;let Zv=0;function Jv(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const gc=new Be;function ey(n){Qe._getMatrix(gc,Qe.workingColorSpace,n);const e=`mat3( ${gc.elements.map(t=>t.toFixed(4))} )`;switch(Qe.getTransfer(n)){case va:return[e,"LinearTransferOETF"];case tt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function vc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+Jv(n.getShaderSource(e),o)}else return a}function ty(n,e){const t=ey(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function iy(n,e){let t;switch(e){case tp:t="Linear";break;case ip:t="Reinhard";break;case np:t="Cineon";break;case nh:t="ACESFilmic";break;case ap:t="AgX";break;case rp:t="Neutral";break;case sp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ia=new L;function ny(){Qe.getLuminanceCoefficients(ia);const n=ia.x.toFixed(4),e=ia.y.toFixed(4),t=ia.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sy(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ds).join(`
`)}function ay(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function ry(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function ds(n){return n!==""}function yc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Sc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const oy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Mo(n){return n.replace(oy,cy)}const ly=new Map;function cy(n,e){let t=He[e];if(t===void 0){const i=ly.get(e);if(i!==void 0)t=He[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Mo(t)}const hy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function bc(n){return n.replace(hy,uy)}function uy(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function _c(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function dy(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===eh?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===th?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ci&&(e="SHADOWMAP_TYPE_VSM"),e}function py(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Wn:case Xn:e="ENVMAP_TYPE_CUBE";break;case Ea:e="ENVMAP_TYPE_CUBE_UV";break}return e}function fy(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===Xn&&(e="ENVMAP_MODE_REFRACTION"),e}function my(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ih:e="ENVMAP_BLENDING_MULTIPLY";break;case Jd:e="ENVMAP_BLENDING_MIX";break;case ep:e="ENVMAP_BLENDING_ADD";break}return e}function gy(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function vy(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const l=dy(t),c=py(t),h=fy(t),u=my(t),p=gy(t),f=sy(t),g=ay(a),v=s.createProgram();let m,d,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ds).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ds).join(`
`),d.length>0&&(d+=`
`)):(m=[_c(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ds).join(`
`),d=[_c(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==$i?"#define TONE_MAPPING":"",t.toneMapping!==$i?He.tonemapping_pars_fragment:"",t.toneMapping!==$i?iy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,ty("linearToOutputTexel",t.outputColorSpace),ny(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ds).join(`
`)),r=Mo(r),r=yc(r,t),r=Sc(r,t),o=Mo(o),o=yc(o,t),o=Sc(o,t),r=bc(r),o=bc(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===Cl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Cl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const M=E+m+r,b=E+d+o,R=mc(s,s.VERTEX_SHADER,M),T=mc(s,s.FRAGMENT_SHADER,b);s.attachShader(v,R),s.attachShader(v,T),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function P(I){if(n.debug.checkShaderErrors){const U=s.getProgramInfoLog(v)||"",z=s.getShaderInfoLog(R)||"",q=s.getShaderInfoLog(T)||"",$=U.trim(),W=z.trim(),ie=q.trim();let V=!0,re=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(V=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,R,T);else{const he=vc(s,R,"vertex"),we=vc(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+$+`
`+he+`
`+we)}else $!==""?console.warn("THREE.WebGLProgram: Program Info Log:",$):(W===""||ie==="")&&(re=!1);re&&(I.diagnostics={runnable:V,programLog:$,vertexShader:{log:W,prefix:m},fragmentShader:{log:ie,prefix:d}})}s.deleteShader(R),s.deleteShader(T),O=new ma(s,v),x=ry(s,v)}let O;this.getUniforms=function(){return O===void 0&&P(this),O};let x;this.getAttributes=function(){return x===void 0&&P(this),x};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(v,Qv)),_},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Zv++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=R,this.fragmentShader=T,this}let yy=0;class Sy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new by(e),t.set(e,i)),i}}class by{constructor(e){this.id=yy++,this.code=e,this.usedTimes=0}}function _y(n,e,t,i,s,a,r){const o=new Vo,l=new Sy,c=new Set,h=[],u=s.logarithmicDepthBuffer,p=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return c.add(x),x===0?"uv":`uv${x}`}function m(x,_,I,U,z){const q=U.fog,$=z.geometry,W=x.isMeshStandardMaterial?U.environment:null,ie=(x.isMeshStandardMaterial?t:e).get(x.envMap||W),V=ie&&ie.mapping===Ea?ie.image.height:null,re=g[x.type];x.precision!==null&&(f=s.getMaxPrecision(x.precision),f!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const he=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,we=he!==void 0?he.length:0;let Ge=0;$.morphAttributes.position!==void 0&&(Ge=1),$.morphAttributes.normal!==void 0&&(Ge=2),$.morphAttributes.color!==void 0&&(Ge=3);let at,lt,Ze,Y;if(re){const Je=ui[re];at=Je.vertexShader,lt=Je.fragmentShader}else at=x.vertexShader,lt=x.fragmentShader,l.update(x),Ze=l.getVertexShaderID(x),Y=l.getFragmentShaderID(x);const Q=n.getRenderTarget(),pe=n.state.buffers.depth.getReversed(),Le=z.isInstancedMesh===!0,Me=z.isBatchedMesh===!0,Ke=!!x.map,Pt=!!x.matcap,C=!!ie,ct=!!x.aoMap,Ne=!!x.lightMap,Pe=!!x.bumpMap,ge=!!x.normalMap,ht=!!x.displacementMap,ve=!!x.emissiveMap,ze=!!x.metalnessMap,Tt=!!x.roughnessMap,St=x.anisotropy>0,w=x.clearcoat>0,y=x.dispersion>0,N=x.iridescence>0,X=x.sheen>0,j=x.transmission>0,G=St&&!!x.anisotropyMap,_e=w&&!!x.clearcoatMap,ne=w&&!!x.clearcoatNormalMap,ye=w&&!!x.clearcoatRoughnessMap,Se=N&&!!x.iridescenceMap,ee=N&&!!x.iridescenceThicknessMap,ce=X&&!!x.sheenColorMap,Re=X&&!!x.sheenRoughnessMap,be=!!x.specularMap,oe=!!x.specularColorMap,Fe=!!x.specularIntensityMap,A=j&&!!x.transmissionMap,te=j&&!!x.thicknessMap,se=!!x.gradientMap,de=!!x.alphaMap,Z=x.alphaTest>0,K=!!x.alphaHash,me=!!x.extensions;let Oe=$i;x.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Oe=n.toneMapping);const rt={shaderID:re,shaderType:x.type,shaderName:x.name,vertexShader:at,fragmentShader:lt,defines:x.defines,customVertexShaderID:Ze,customFragmentShaderID:Y,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:Me,batchingColor:Me&&z._colorsTexture!==null,instancing:Le,instancingColor:Le&&z.instanceColor!==null,instancingMorph:Le&&z.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:Q===null?n.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:$n,alphaToCoverage:!!x.alphaToCoverage,map:Ke,matcap:Pt,envMap:C,envMapMode:C&&ie.mapping,envMapCubeUVHeight:V,aoMap:ct,lightMap:Ne,bumpMap:Pe,normalMap:ge,displacementMap:p&&ht,emissiveMap:ve,normalMapObjectSpace:ge&&x.normalMapType===hp,normalMapTangentSpace:ge&&x.normalMapType===ph,metalnessMap:ze,roughnessMap:Tt,anisotropy:St,anisotropyMap:G,clearcoat:w,clearcoatMap:_e,clearcoatNormalMap:ne,clearcoatRoughnessMap:ye,dispersion:y,iridescence:N,iridescenceMap:Se,iridescenceThicknessMap:ee,sheen:X,sheenColorMap:ce,sheenRoughnessMap:Re,specularMap:be,specularColorMap:oe,specularIntensityMap:Fe,transmission:j,transmissionMap:A,thicknessMap:te,gradientMap:se,opaque:x.transparent===!1&&x.blending===Vn&&x.alphaToCoverage===!1,alphaMap:de,alphaTest:Z,alphaHash:K,combine:x.combine,mapUv:Ke&&v(x.map.channel),aoMapUv:ct&&v(x.aoMap.channel),lightMapUv:Ne&&v(x.lightMap.channel),bumpMapUv:Pe&&v(x.bumpMap.channel),normalMapUv:ge&&v(x.normalMap.channel),displacementMapUv:ht&&v(x.displacementMap.channel),emissiveMapUv:ve&&v(x.emissiveMap.channel),metalnessMapUv:ze&&v(x.metalnessMap.channel),roughnessMapUv:Tt&&v(x.roughnessMap.channel),anisotropyMapUv:G&&v(x.anisotropyMap.channel),clearcoatMapUv:_e&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:ne&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:Re&&v(x.sheenRoughnessMap.channel),specularMapUv:be&&v(x.specularMap.channel),specularColorMapUv:oe&&v(x.specularColorMap.channel),specularIntensityMapUv:Fe&&v(x.specularIntensityMap.channel),transmissionMapUv:A&&v(x.transmissionMap.channel),thicknessMapUv:te&&v(x.thicknessMap.channel),alphaMapUv:de&&v(x.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(ge||St),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!$.attributes.uv&&(Ke||de),fog:!!q,useFog:x.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:pe,skinning:z.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:Ge,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:Oe,decodeVideoTexture:Ke&&x.map.isVideoTexture===!0&&Qe.getTransfer(x.map.colorSpace)===tt,decodeVideoTextureEmissive:ve&&x.emissiveMap.isVideoTexture===!0&&Qe.getTransfer(x.emissiveMap.colorSpace)===tt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Ht,flipSided:x.side===Vt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:me&&x.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&x.extensions.multiDraw===!0||Me)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return rt.vertexUv1s=c.has(1),rt.vertexUv2s=c.has(2),rt.vertexUv3s=c.has(3),c.clear(),rt}function d(x){const _=[];if(x.shaderID?_.push(x.shaderID):(_.push(x.customVertexShaderID),_.push(x.customFragmentShaderID)),x.defines!==void 0)for(const I in x.defines)_.push(I),_.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(E(_,x),M(_,x),_.push(n.outputColorSpace)),_.push(x.customProgramCacheKey),_.join()}function E(x,_){x.push(_.precision),x.push(_.outputColorSpace),x.push(_.envMapMode),x.push(_.envMapCubeUVHeight),x.push(_.mapUv),x.push(_.alphaMapUv),x.push(_.lightMapUv),x.push(_.aoMapUv),x.push(_.bumpMapUv),x.push(_.normalMapUv),x.push(_.displacementMapUv),x.push(_.emissiveMapUv),x.push(_.metalnessMapUv),x.push(_.roughnessMapUv),x.push(_.anisotropyMapUv),x.push(_.clearcoatMapUv),x.push(_.clearcoatNormalMapUv),x.push(_.clearcoatRoughnessMapUv),x.push(_.iridescenceMapUv),x.push(_.iridescenceThicknessMapUv),x.push(_.sheenColorMapUv),x.push(_.sheenRoughnessMapUv),x.push(_.specularMapUv),x.push(_.specularColorMapUv),x.push(_.specularIntensityMapUv),x.push(_.transmissionMapUv),x.push(_.thicknessMapUv),x.push(_.combine),x.push(_.fogExp2),x.push(_.sizeAttenuation),x.push(_.morphTargetsCount),x.push(_.morphAttributeCount),x.push(_.numDirLights),x.push(_.numPointLights),x.push(_.numSpotLights),x.push(_.numSpotLightMaps),x.push(_.numHemiLights),x.push(_.numRectAreaLights),x.push(_.numDirLightShadows),x.push(_.numPointLightShadows),x.push(_.numSpotLightShadows),x.push(_.numSpotLightShadowsWithMaps),x.push(_.numLightProbes),x.push(_.shadowMapType),x.push(_.toneMapping),x.push(_.numClippingPlanes),x.push(_.numClipIntersection),x.push(_.depthPacking)}function M(x,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),_.gradientMap&&o.enable(22),x.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reversedDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),x.push(o.mask)}function b(x){const _=g[x.type];let I;if(_){const U=ui[_];I=Bp.clone(U.uniforms)}else I=x.uniforms;return I}function R(x,_){let I;for(let U=0,z=h.length;U<z;U++){const q=h[U];if(q.cacheKey===_){I=q,++I.usedTimes;break}}return I===void 0&&(I=new vy(n,_,x,a),h.push(I)),I}function T(x){if(--x.usedTimes===0){const _=h.indexOf(x);h[_]=h[h.length-1],h.pop(),x.destroy()}}function P(x){l.remove(x)}function O(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:b,acquireProgram:R,releaseProgram:T,releaseShaderCache:P,programs:h,dispose:O}}function My(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,l){n.get(r)[o]=l}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function xy(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Mc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function xc(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(u,p,f,g,v,m){let d=n[e];return d===void 0?(d={id:u.id,object:u,geometry:p,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},n[e]=d):(d.id=u.id,d.object=u,d.geometry=p,d.material=f,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=v,d.group=m),e++,d}function o(u,p,f,g,v,m){const d=r(u,p,f,g,v,m);f.transmission>0?i.push(d):f.transparent===!0?s.push(d):t.push(d)}function l(u,p,f,g,v,m){const d=r(u,p,f,g,v,m);f.transmission>0?i.unshift(d):f.transparent===!0?s.unshift(d):t.unshift(d)}function c(u,p){t.length>1&&t.sort(u||xy),i.length>1&&i.sort(p||Mc),s.length>1&&s.sort(p||Mc)}function h(){for(let u=e,p=n.length;u<p;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:o,unshift:l,finish:h,sort:c}}function wy(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new xc,n.set(i,[r])):s>=a.length?(r=new xc,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function Ey(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new De};break;case"SpotLight":t={position:new L,direction:new L,color:new De,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new De,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new De,groundColor:new De};break;case"RectAreaLight":t={color:new De,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function Ty(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Cy=0;function Ry(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Py(n){const e=new Ey,t=Ty(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);const s=new L,a=new ut,r=new ut;function o(c){let h=0,u=0,p=0;for(let x=0;x<9;x++)i.probe[x].set(0,0,0);let f=0,g=0,v=0,m=0,d=0,E=0,M=0,b=0,R=0,T=0,P=0;c.sort(Ry);for(let x=0,_=c.length;x<_;x++){const I=c[x],U=I.color,z=I.intensity,q=I.distance,$=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=U.r*z,u+=U.g*z,p+=U.b*z;else if(I.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(I.sh.coefficients[W],z);P++}else if(I.isDirectionalLight){const W=e.get(I);if(W.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const ie=I.shadow,V=t.get(I);V.shadowIntensity=ie.intensity,V.shadowBias=ie.bias,V.shadowNormalBias=ie.normalBias,V.shadowRadius=ie.radius,V.shadowMapSize=ie.mapSize,i.directionalShadow[f]=V,i.directionalShadowMap[f]=$,i.directionalShadowMatrix[f]=I.shadow.matrix,E++}i.directional[f]=W,f++}else if(I.isSpotLight){const W=e.get(I);W.position.setFromMatrixPosition(I.matrixWorld),W.color.copy(U).multiplyScalar(z),W.distance=q,W.coneCos=Math.cos(I.angle),W.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),W.decay=I.decay,i.spot[v]=W;const ie=I.shadow;if(I.map&&(i.spotLightMap[R]=I.map,R++,ie.updateMatrices(I),I.castShadow&&T++),i.spotLightMatrix[v]=ie.matrix,I.castShadow){const V=t.get(I);V.shadowIntensity=ie.intensity,V.shadowBias=ie.bias,V.shadowNormalBias=ie.normalBias,V.shadowRadius=ie.radius,V.shadowMapSize=ie.mapSize,i.spotShadow[v]=V,i.spotShadowMap[v]=$,b++}v++}else if(I.isRectAreaLight){const W=e.get(I);W.color.copy(U).multiplyScalar(z),W.halfWidth.set(I.width*.5,0,0),W.halfHeight.set(0,I.height*.5,0),i.rectArea[m]=W,m++}else if(I.isPointLight){const W=e.get(I);if(W.color.copy(I.color).multiplyScalar(I.intensity),W.distance=I.distance,W.decay=I.decay,I.castShadow){const ie=I.shadow,V=t.get(I);V.shadowIntensity=ie.intensity,V.shadowBias=ie.bias,V.shadowNormalBias=ie.normalBias,V.shadowRadius=ie.radius,V.shadowMapSize=ie.mapSize,V.shadowCameraNear=ie.camera.near,V.shadowCameraFar=ie.camera.far,i.pointShadow[g]=V,i.pointShadowMap[g]=$,i.pointShadowMatrix[g]=I.shadow.matrix,M++}i.point[g]=W,g++}else if(I.isHemisphereLight){const W=e.get(I);W.skyColor.copy(I.color).multiplyScalar(z),W.groundColor.copy(I.groundColor).multiplyScalar(z),i.hemi[d]=W,d++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ae.LTC_FLOAT_1,i.rectAreaLTC2=ae.LTC_FLOAT_2):(i.rectAreaLTC1=ae.LTC_HALF_1,i.rectAreaLTC2=ae.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=p;const O=i.hash;(O.directionalLength!==f||O.pointLength!==g||O.spotLength!==v||O.rectAreaLength!==m||O.hemiLength!==d||O.numDirectionalShadows!==E||O.numPointShadows!==M||O.numSpotShadows!==b||O.numSpotMaps!==R||O.numLightProbes!==P)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=d,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=E,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=b+R-T,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=P,O.directionalLength=f,O.pointLength=g,O.spotLength=v,O.rectAreaLength=m,O.hemiLength=d,O.numDirectionalShadows=E,O.numPointShadows=M,O.numSpotShadows=b,O.numSpotMaps=R,O.numLightProbes=P,i.version=Cy++)}function l(c,h){let u=0,p=0,f=0,g=0,v=0;const m=h.matrixWorldInverse;for(let d=0,E=c.length;d<E;d++){const M=c[d];if(M.isDirectionalLight){const b=i.directional[u];b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),u++}else if(M.isSpotLight){const b=i.spot[f];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),f++}else if(M.isRectAreaLight){const b=i.rectArea[g];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),r.identity(),a.copy(M.matrixWorld),a.premultiply(m),r.extractRotation(a),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(r),b.halfHeight.applyMatrix4(r),g++}else if(M.isPointLight){const b=i.point[p];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),p++}else if(M.isHemisphereLight){const b=i.hemi[v];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:i}}function wc(n){const e=new Py(n),t=[],i=[];function s(h){c.camera=h,t.length=0,i.length=0}function a(h){t.push(h)}function r(h){i.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:a,pushShadow:r}}function Ay(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new wc(n),e.set(s,[o])):a>=r.length?(o=new wc(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Iy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ly=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function ky(n,e,t){let i=new qo;const s=new Xe,a=new Xe,r=new it,o=new Qp({depthPacking:cp}),l=new Zp,c={},h=t.maxTextureSize,u={[Ki]:Vt,[Vt]:Ki,[Ht]:Ht},p=new ji({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xe},radius:{value:4}},vertexShader:Iy,fragmentShader:Ly}),f=p.clone();f.defines.HORIZONTAL_PASS=1;const g=new Gt;g.setAttribute("position",new oi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ve(g,p),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=eh;let d=this.type;this.render=function(T,P,O){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const x=n.getRenderTarget(),_=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),U=n.state;U.setBlending(Xi),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const z=d!==Ci&&this.type===Ci,q=d===Ci&&this.type!==Ci;for(let $=0,W=T.length;$<W;$++){const ie=T[$],V=ie.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const re=V.getFrameExtents();if(s.multiply(re),a.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/re.x),s.x=a.x*re.x,V.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/re.y),s.y=a.y*re.y,V.mapSize.y=a.y)),V.map===null||z===!0||q===!0){const we=this.type!==Ci?{minFilter:ri,magFilter:ri}:{};V.map!==null&&V.map.dispose(),V.map=new _n(s.x,s.y,we),V.map.texture.name=ie.name+".shadowMap",V.camera.updateProjectionMatrix()}n.setRenderTarget(V.map),n.clear();const he=V.getViewportCount();for(let we=0;we<he;we++){const Ge=V.getViewport(we);r.set(a.x*Ge.x,a.y*Ge.y,a.x*Ge.z,a.y*Ge.w),U.viewport(r),V.updateMatrices(ie,we),i=V.getFrustum(),b(P,O,V.camera,ie,this.type)}V.isPointLightShadow!==!0&&this.type===Ci&&E(V,O),V.needsUpdate=!1}d=this.type,m.needsUpdate=!1,n.setRenderTarget(x,_,I)};function E(T,P){const O=e.update(v);p.defines.VSM_SAMPLES!==T.blurSamples&&(p.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,p.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new _n(s.x,s.y)),p.uniforms.shadow_pass.value=T.map.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(P,null,O,p,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(P,null,O,f,v,null)}function M(T,P,O,x){let _=null;const I=O.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)_=I;else if(_=O.isPointLight===!0?l:o,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const U=_.uuid,z=P.uuid;let q=c[U];q===void 0&&(q={},c[U]=q);let $=q[z];$===void 0&&($=_.clone(),q[z]=$,P.addEventListener("dispose",R)),_=$}if(_.visible=P.visible,_.wireframe=P.wireframe,x===Ci?_.side=P.shadowSide!==null?P.shadowSide:P.side:_.side=P.shadowSide!==null?P.shadowSide:u[P.side],_.alphaMap=P.alphaMap,_.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,_.map=P.map,_.clipShadows=P.clipShadows,_.clippingPlanes=P.clippingPlanes,_.clipIntersection=P.clipIntersection,_.displacementMap=P.displacementMap,_.displacementScale=P.displacementScale,_.displacementBias=P.displacementBias,_.wireframeLinewidth=P.wireframeLinewidth,_.linewidth=P.linewidth,O.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const U=n.properties.get(_);U.light=O}return _}function b(T,P,O,x,_){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&_===Ci)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,T.matrixWorld);const z=e.update(T),q=T.material;if(Array.isArray(q)){const $=z.groups;for(let W=0,ie=$.length;W<ie;W++){const V=$[W],re=q[V.materialIndex];if(re&&re.visible){const he=M(T,re,x,_);T.onBeforeShadow(n,T,P,O,z,he,V),n.renderBufferDirect(O,null,z,he,T,V),T.onAfterShadow(n,T,P,O,z,he,V)}}}else if(q.visible){const $=M(T,q,x,_);T.onBeforeShadow(n,T,P,O,z,$,null),n.renderBufferDirect(O,null,z,$,T,null),T.onAfterShadow(n,T,P,O,z,$,null)}}const U=T.children;for(let z=0,q=U.length;z<q;z++)b(U[z],P,O,x,_)}function R(T){T.target.removeEventListener("dispose",R);for(const O in c){const x=c[O],_=T.target.uuid;_ in x&&(x[_].dispose(),delete x[_])}}}const Dy={[Or]:Nr,[Ur]:zr,[Fr]:Hr,[qn]:Br,[Nr]:Or,[zr]:Ur,[Hr]:Fr,[Br]:qn};function Oy(n,e){function t(){let A=!1;const te=new it;let se=null;const de=new it(0,0,0,0);return{setMask:function(Z){se!==Z&&!A&&(n.colorMask(Z,Z,Z,Z),se=Z)},setLocked:function(Z){A=Z},setClear:function(Z,K,me,Oe,rt){rt===!0&&(Z*=Oe,K*=Oe,me*=Oe),te.set(Z,K,me,Oe),de.equals(te)===!1&&(n.clearColor(Z,K,me,Oe),de.copy(te))},reset:function(){A=!1,se=null,de.set(-1,0,0,0)}}}function i(){let A=!1,te=!1,se=null,de=null,Z=null;return{setReversed:function(K){if(te!==K){const me=e.get("EXT_clip_control");K?me.clipControlEXT(me.LOWER_LEFT_EXT,me.ZERO_TO_ONE_EXT):me.clipControlEXT(me.LOWER_LEFT_EXT,me.NEGATIVE_ONE_TO_ONE_EXT),te=K;const Oe=Z;Z=null,this.setClear(Oe)}},getReversed:function(){return te},setTest:function(K){K?Q(n.DEPTH_TEST):pe(n.DEPTH_TEST)},setMask:function(K){se!==K&&!A&&(n.depthMask(K),se=K)},setFunc:function(K){if(te&&(K=Dy[K]),de!==K){switch(K){case Or:n.depthFunc(n.NEVER);break;case Nr:n.depthFunc(n.ALWAYS);break;case Ur:n.depthFunc(n.LESS);break;case qn:n.depthFunc(n.LEQUAL);break;case Fr:n.depthFunc(n.EQUAL);break;case Br:n.depthFunc(n.GEQUAL);break;case zr:n.depthFunc(n.GREATER);break;case Hr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}de=K}},setLocked:function(K){A=K},setClear:function(K){Z!==K&&(te&&(K=1-K),n.clearDepth(K),Z=K)},reset:function(){A=!1,se=null,de=null,Z=null,te=!1}}}function s(){let A=!1,te=null,se=null,de=null,Z=null,K=null,me=null,Oe=null,rt=null;return{setTest:function(Je){A||(Je?Q(n.STENCIL_TEST):pe(n.STENCIL_TEST))},setMask:function(Je){te!==Je&&!A&&(n.stencilMask(Je),te=Je)},setFunc:function(Je,_i,li){(se!==Je||de!==_i||Z!==li)&&(n.stencilFunc(Je,_i,li),se=Je,de=_i,Z=li)},setOp:function(Je,_i,li){(K!==Je||me!==_i||Oe!==li)&&(n.stencilOp(Je,_i,li),K=Je,me=_i,Oe=li)},setLocked:function(Je){A=Je},setClear:function(Je){rt!==Je&&(n.clearStencil(Je),rt=Je)},reset:function(){A=!1,te=null,se=null,de=null,Z=null,K=null,me=null,Oe=null,rt=null}}}const a=new t,r=new i,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},p=new WeakMap,f=[],g=null,v=!1,m=null,d=null,E=null,M=null,b=null,R=null,T=null,P=new De(0,0,0),O=0,x=!1,_=null,I=null,U=null,z=null,q=null;const $=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,ie=0;const V=n.getParameter(n.VERSION);V.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(V)[1]),W=ie>=1):V.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),W=ie>=2);let re=null,he={};const we=n.getParameter(n.SCISSOR_BOX),Ge=n.getParameter(n.VIEWPORT),at=new it().fromArray(we),lt=new it().fromArray(Ge);function Ze(A,te,se,de){const Z=new Uint8Array(4),K=n.createTexture();n.bindTexture(A,K),n.texParameteri(A,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(A,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let me=0;me<se;me++)A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY?n.texImage3D(te,0,n.RGBA,1,1,de,0,n.RGBA,n.UNSIGNED_BYTE,Z):n.texImage2D(te+me,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Z);return K}const Y={};Y[n.TEXTURE_2D]=Ze(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=Ze(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=Ze(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=Ze(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),Q(n.DEPTH_TEST),r.setFunc(qn),Pe(!1),ge(_l),Q(n.CULL_FACE),ct(Xi);function Q(A){h[A]!==!0&&(n.enable(A),h[A]=!0)}function pe(A){h[A]!==!1&&(n.disable(A),h[A]=!1)}function Le(A,te){return u[A]!==te?(n.bindFramebuffer(A,te),u[A]=te,A===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=te),A===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=te),!0):!1}function Me(A,te){let se=f,de=!1;if(A){se=p.get(te),se===void 0&&(se=[],p.set(te,se));const Z=A.textures;if(se.length!==Z.length||se[0]!==n.COLOR_ATTACHMENT0){for(let K=0,me=Z.length;K<me;K++)se[K]=n.COLOR_ATTACHMENT0+K;se.length=Z.length,de=!0}}else se[0]!==n.BACK&&(se[0]=n.BACK,de=!0);de&&n.drawBuffers(se)}function Ke(A){return g!==A?(n.useProgram(A),g=A,!0):!1}const Pt={[dn]:n.FUNC_ADD,[Nd]:n.FUNC_SUBTRACT,[Ud]:n.FUNC_REVERSE_SUBTRACT};Pt[Fd]=n.MIN,Pt[Bd]=n.MAX;const C={[zd]:n.ZERO,[Hd]:n.ONE,[Vd]:n.SRC_COLOR,[kr]:n.SRC_ALPHA,[Yd]:n.SRC_ALPHA_SATURATE,[Xd]:n.DST_COLOR,[qd]:n.DST_ALPHA,[Gd]:n.ONE_MINUS_SRC_COLOR,[Dr]:n.ONE_MINUS_SRC_ALPHA,[$d]:n.ONE_MINUS_DST_COLOR,[Wd]:n.ONE_MINUS_DST_ALPHA,[Kd]:n.CONSTANT_COLOR,[jd]:n.ONE_MINUS_CONSTANT_COLOR,[Qd]:n.CONSTANT_ALPHA,[Zd]:n.ONE_MINUS_CONSTANT_ALPHA};function ct(A,te,se,de,Z,K,me,Oe,rt,Je){if(A===Xi){v===!0&&(pe(n.BLEND),v=!1);return}if(v===!1&&(Q(n.BLEND),v=!0),A!==Od){if(A!==m||Je!==x){if((d!==dn||b!==dn)&&(n.blendEquation(n.FUNC_ADD),d=dn,b=dn),Je)switch(A){case Vn:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ml:n.blendFunc(n.ONE,n.ONE);break;case xl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case wl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",A);break}else switch(A){case Vn:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ml:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case xl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case wl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",A);break}E=null,M=null,R=null,T=null,P.set(0,0,0),O=0,m=A,x=Je}return}Z=Z||te,K=K||se,me=me||de,(te!==d||Z!==b)&&(n.blendEquationSeparate(Pt[te],Pt[Z]),d=te,b=Z),(se!==E||de!==M||K!==R||me!==T)&&(n.blendFuncSeparate(C[se],C[de],C[K],C[me]),E=se,M=de,R=K,T=me),(Oe.equals(P)===!1||rt!==O)&&(n.blendColor(Oe.r,Oe.g,Oe.b,rt),P.copy(Oe),O=rt),m=A,x=!1}function Ne(A,te){A.side===Ht?pe(n.CULL_FACE):Q(n.CULL_FACE);let se=A.side===Vt;te&&(se=!se),Pe(se),A.blending===Vn&&A.transparent===!1?ct(Xi):ct(A.blending,A.blendEquation,A.blendSrc,A.blendDst,A.blendEquationAlpha,A.blendSrcAlpha,A.blendDstAlpha,A.blendColor,A.blendAlpha,A.premultipliedAlpha),r.setFunc(A.depthFunc),r.setTest(A.depthTest),r.setMask(A.depthWrite),a.setMask(A.colorWrite);const de=A.stencilWrite;o.setTest(de),de&&(o.setMask(A.stencilWriteMask),o.setFunc(A.stencilFunc,A.stencilRef,A.stencilFuncMask),o.setOp(A.stencilFail,A.stencilZFail,A.stencilZPass)),ve(A.polygonOffset,A.polygonOffsetFactor,A.polygonOffsetUnits),A.alphaToCoverage===!0?Q(n.SAMPLE_ALPHA_TO_COVERAGE):pe(n.SAMPLE_ALPHA_TO_COVERAGE)}function Pe(A){_!==A&&(A?n.frontFace(n.CW):n.frontFace(n.CCW),_=A)}function ge(A){A!==kd?(Q(n.CULL_FACE),A!==I&&(A===_l?n.cullFace(n.BACK):A===Dd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):pe(n.CULL_FACE),I=A}function ht(A){A!==U&&(W&&n.lineWidth(A),U=A)}function ve(A,te,se){A?(Q(n.POLYGON_OFFSET_FILL),(z!==te||q!==se)&&(n.polygonOffset(te,se),z=te,q=se)):pe(n.POLYGON_OFFSET_FILL)}function ze(A){A?Q(n.SCISSOR_TEST):pe(n.SCISSOR_TEST)}function Tt(A){A===void 0&&(A=n.TEXTURE0+$-1),re!==A&&(n.activeTexture(A),re=A)}function St(A,te,se){se===void 0&&(re===null?se=n.TEXTURE0+$-1:se=re);let de=he[se];de===void 0&&(de={type:void 0,texture:void 0},he[se]=de),(de.type!==A||de.texture!==te)&&(re!==se&&(n.activeTexture(se),re=se),n.bindTexture(A,te||Y[A]),de.type=A,de.texture=te)}function w(){const A=he[re];A!==void 0&&A.type!==void 0&&(n.bindTexture(A.type,null),A.type=void 0,A.texture=void 0)}function y(){try{n.compressedTexImage2D(...arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function N(){try{n.compressedTexImage3D(...arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function X(){try{n.texSubImage2D(...arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function j(){try{n.texSubImage3D(...arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function G(){try{n.compressedTexSubImage2D(...arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function _e(){try{n.compressedTexSubImage3D(...arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function ne(){try{n.texStorage2D(...arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function ye(){try{n.texStorage3D(...arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function Se(){try{n.texImage2D(...arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function ee(){try{n.texImage3D(...arguments)}catch(A){console.error("THREE.WebGLState:",A)}}function ce(A){at.equals(A)===!1&&(n.scissor(A.x,A.y,A.z,A.w),at.copy(A))}function Re(A){lt.equals(A)===!1&&(n.viewport(A.x,A.y,A.z,A.w),lt.copy(A))}function be(A,te){let se=c.get(te);se===void 0&&(se=new WeakMap,c.set(te,se));let de=se.get(A);de===void 0&&(de=n.getUniformBlockIndex(te,A.name),se.set(A,de))}function oe(A,te){const de=c.get(te).get(A);l.get(te)!==de&&(n.uniformBlockBinding(te,de,A.__bindingPointIndex),l.set(te,de))}function Fe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},re=null,he={},u={},p=new WeakMap,f=[],g=null,v=!1,m=null,d=null,E=null,M=null,b=null,R=null,T=null,P=new De(0,0,0),O=0,x=!1,_=null,I=null,U=null,z=null,q=null,at.set(0,0,n.canvas.width,n.canvas.height),lt.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:Q,disable:pe,bindFramebuffer:Le,drawBuffers:Me,useProgram:Ke,setBlending:ct,setMaterial:Ne,setFlipSided:Pe,setCullFace:ge,setLineWidth:ht,setPolygonOffset:ve,setScissorTest:ze,activeTexture:Tt,bindTexture:St,unbindTexture:w,compressedTexImage2D:y,compressedTexImage3D:N,texImage2D:Se,texImage3D:ee,updateUBOMapping:be,uniformBlockBinding:oe,texStorage2D:ne,texStorage3D:ye,texSubImage2D:X,texSubImage3D:j,compressedTexSubImage2D:G,compressedTexSubImage3D:_e,scissor:ce,viewport:Re,reset:Fe}}function Ny(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Xe,h=new WeakMap;let u;const p=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,y){return f?new OffscreenCanvas(w,y):ba("canvas")}function v(w,y,N){let X=1;const j=St(w);if((j.width>N||j.height>N)&&(X=N/Math.max(j.width,j.height)),X<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const G=Math.floor(X*j.width),_e=Math.floor(X*j.height);u===void 0&&(u=g(G,_e));const ne=y?g(G,_e):u;return ne.width=G,ne.height=_e,ne.getContext("2d").drawImage(w,0,0,G,_e),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+G+"x"+_e+")."),ne}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),w;return w}function m(w){return w.generateMipmaps}function d(w){n.generateMipmap(w)}function E(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(w,y,N,X,j=!1){if(w!==null){if(n[w]!==void 0)return n[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let G=y;if(y===n.RED&&(N===n.FLOAT&&(G=n.R32F),N===n.HALF_FLOAT&&(G=n.R16F),N===n.UNSIGNED_BYTE&&(G=n.R8)),y===n.RED_INTEGER&&(N===n.UNSIGNED_BYTE&&(G=n.R8UI),N===n.UNSIGNED_SHORT&&(G=n.R16UI),N===n.UNSIGNED_INT&&(G=n.R32UI),N===n.BYTE&&(G=n.R8I),N===n.SHORT&&(G=n.R16I),N===n.INT&&(G=n.R32I)),y===n.RG&&(N===n.FLOAT&&(G=n.RG32F),N===n.HALF_FLOAT&&(G=n.RG16F),N===n.UNSIGNED_BYTE&&(G=n.RG8)),y===n.RG_INTEGER&&(N===n.UNSIGNED_BYTE&&(G=n.RG8UI),N===n.UNSIGNED_SHORT&&(G=n.RG16UI),N===n.UNSIGNED_INT&&(G=n.RG32UI),N===n.BYTE&&(G=n.RG8I),N===n.SHORT&&(G=n.RG16I),N===n.INT&&(G=n.RG32I)),y===n.RGB_INTEGER&&(N===n.UNSIGNED_BYTE&&(G=n.RGB8UI),N===n.UNSIGNED_SHORT&&(G=n.RGB16UI),N===n.UNSIGNED_INT&&(G=n.RGB32UI),N===n.BYTE&&(G=n.RGB8I),N===n.SHORT&&(G=n.RGB16I),N===n.INT&&(G=n.RGB32I)),y===n.RGBA_INTEGER&&(N===n.UNSIGNED_BYTE&&(G=n.RGBA8UI),N===n.UNSIGNED_SHORT&&(G=n.RGBA16UI),N===n.UNSIGNED_INT&&(G=n.RGBA32UI),N===n.BYTE&&(G=n.RGBA8I),N===n.SHORT&&(G=n.RGBA16I),N===n.INT&&(G=n.RGBA32I)),y===n.RGB&&(N===n.UNSIGNED_INT_5_9_9_9_REV&&(G=n.RGB9_E5),N===n.UNSIGNED_INT_10F_11F_11F_REV&&(G=n.R11F_G11F_B10F)),y===n.RGBA){const _e=j?va:Qe.getTransfer(X);N===n.FLOAT&&(G=n.RGBA32F),N===n.HALF_FLOAT&&(G=n.RGBA16F),N===n.UNSIGNED_BYTE&&(G=_e===tt?n.SRGB8_ALPHA8:n.RGBA8),N===n.UNSIGNED_SHORT_4_4_4_4&&(G=n.RGBA4),N===n.UNSIGNED_SHORT_5_5_5_1&&(G=n.RGB5_A1)}return(G===n.R16F||G===n.R32F||G===n.RG16F||G===n.RG32F||G===n.RGBA16F||G===n.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function b(w,y){let N;return w?y===null||y===bn||y===gs?N=n.DEPTH24_STENCIL8:y===Ii?N=n.DEPTH32F_STENCIL8:y===ms&&(N=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===bn||y===gs?N=n.DEPTH_COMPONENT24:y===Ii?N=n.DEPTH_COMPONENT32F:y===ms&&(N=n.DEPTH_COMPONENT16),N}function R(w,y){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==ri&&w.minFilter!==fi?Math.log2(Math.max(y.width,y.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?y.mipmaps.length:1}function T(w){const y=w.target;y.removeEventListener("dispose",T),O(y),y.isVideoTexture&&h.delete(y)}function P(w){const y=w.target;y.removeEventListener("dispose",P),_(y)}function O(w){const y=i.get(w);if(y.__webglInit===void 0)return;const N=w.source,X=p.get(N);if(X){const j=X[y.__cacheKey];j.usedTimes--,j.usedTimes===0&&x(w),Object.keys(X).length===0&&p.delete(N)}i.remove(w)}function x(w){const y=i.get(w);n.deleteTexture(y.__webglTexture);const N=w.source,X=p.get(N);delete X[y.__cacheKey],r.memory.textures--}function _(w){const y=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(y.__webglFramebuffer[X]))for(let j=0;j<y.__webglFramebuffer[X].length;j++)n.deleteFramebuffer(y.__webglFramebuffer[X][j]);else n.deleteFramebuffer(y.__webglFramebuffer[X]);y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer[X])}else{if(Array.isArray(y.__webglFramebuffer))for(let X=0;X<y.__webglFramebuffer.length;X++)n.deleteFramebuffer(y.__webglFramebuffer[X]);else n.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&n.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let X=0;X<y.__webglColorRenderbuffer.length;X++)y.__webglColorRenderbuffer[X]&&n.deleteRenderbuffer(y.__webglColorRenderbuffer[X]);y.__webglDepthRenderbuffer&&n.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const N=w.textures;for(let X=0,j=N.length;X<j;X++){const G=i.get(N[X]);G.__webglTexture&&(n.deleteTexture(G.__webglTexture),r.memory.textures--),i.remove(N[X])}i.remove(w)}let I=0;function U(){I=0}function z(){const w=I;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),I+=1,w}function q(w){const y=[];return y.push(w.wrapS),y.push(w.wrapT),y.push(w.wrapR||0),y.push(w.magFilter),y.push(w.minFilter),y.push(w.anisotropy),y.push(w.internalFormat),y.push(w.format),y.push(w.type),y.push(w.generateMipmaps),y.push(w.premultiplyAlpha),y.push(w.flipY),y.push(w.unpackAlignment),y.push(w.colorSpace),y.join()}function $(w,y){const N=i.get(w);if(w.isVideoTexture&&ze(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&N.__version!==w.version){const X=w.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(N,w,y);return}}else w.isExternalTexture&&(N.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,N.__webglTexture,n.TEXTURE0+y)}function W(w,y){const N=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&N.__version!==w.version){Y(N,w,y);return}t.bindTexture(n.TEXTURE_2D_ARRAY,N.__webglTexture,n.TEXTURE0+y)}function ie(w,y){const N=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&N.__version!==w.version){Y(N,w,y);return}t.bindTexture(n.TEXTURE_3D,N.__webglTexture,n.TEXTURE0+y)}function V(w,y){const N=i.get(w);if(w.version>0&&N.__version!==w.version){Q(N,w,y);return}t.bindTexture(n.TEXTURE_CUBE_MAP,N.__webglTexture,n.TEXTURE0+y)}const re={[qr]:n.REPEAT,[mn]:n.CLAMP_TO_EDGE,[Wr]:n.MIRRORED_REPEAT},he={[ri]:n.NEAREST,[op]:n.NEAREST_MIPMAP_NEAREST,[Ds]:n.NEAREST_MIPMAP_LINEAR,[fi]:n.LINEAR,[za]:n.LINEAR_MIPMAP_NEAREST,[gn]:n.LINEAR_MIPMAP_LINEAR},we={[up]:n.NEVER,[vp]:n.ALWAYS,[dp]:n.LESS,[fh]:n.LEQUAL,[pp]:n.EQUAL,[gp]:n.GEQUAL,[fp]:n.GREATER,[mp]:n.NOTEQUAL};function Ge(w,y){if(y.type===Ii&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===fi||y.magFilter===za||y.magFilter===Ds||y.magFilter===gn||y.minFilter===fi||y.minFilter===za||y.minFilter===Ds||y.minFilter===gn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,re[y.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,re[y.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,re[y.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,he[y.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,he[y.minFilter]),y.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,we[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===ri||y.minFilter!==Ds&&y.minFilter!==gn||y.type===Ii&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){const N=e.get("EXT_texture_filter_anisotropic");n.texParameterf(w,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function at(w,y){let N=!1;w.__webglInit===void 0&&(w.__webglInit=!0,y.addEventListener("dispose",T));const X=y.source;let j=p.get(X);j===void 0&&(j={},p.set(X,j));const G=q(y);if(G!==w.__cacheKey){j[G]===void 0&&(j[G]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,N=!0),j[G].usedTimes++;const _e=j[w.__cacheKey];_e!==void 0&&(j[w.__cacheKey].usedTimes--,_e.usedTimes===0&&x(y)),w.__cacheKey=G,w.__webglTexture=j[G].texture}return N}function lt(w,y,N){return Math.floor(Math.floor(w/N)/y)}function Ze(w,y,N,X){const G=w.updateRanges;if(G.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,y.width,y.height,N,X,y.data);else{G.sort((ee,ce)=>ee.start-ce.start);let _e=0;for(let ee=1;ee<G.length;ee++){const ce=G[_e],Re=G[ee],be=ce.start+ce.count,oe=lt(Re.start,y.width,4),Fe=lt(ce.start,y.width,4);Re.start<=be+1&&oe===Fe&&lt(Re.start+Re.count-1,y.width,4)===oe?ce.count=Math.max(ce.count,Re.start+Re.count-ce.start):(++_e,G[_e]=Re)}G.length=_e+1;const ne=n.getParameter(n.UNPACK_ROW_LENGTH),ye=n.getParameter(n.UNPACK_SKIP_PIXELS),Se=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,y.width);for(let ee=0,ce=G.length;ee<ce;ee++){const Re=G[ee],be=Math.floor(Re.start/4),oe=Math.ceil(Re.count/4),Fe=be%y.width,A=Math.floor(be/y.width),te=oe,se=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Fe),n.pixelStorei(n.UNPACK_SKIP_ROWS,A),t.texSubImage2D(n.TEXTURE_2D,0,Fe,A,te,se,N,X,y.data)}w.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ne),n.pixelStorei(n.UNPACK_SKIP_PIXELS,ye),n.pixelStorei(n.UNPACK_SKIP_ROWS,Se)}}function Y(w,y,N){let X=n.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(X=n.TEXTURE_2D_ARRAY),y.isData3DTexture&&(X=n.TEXTURE_3D);const j=at(w,y),G=y.source;t.bindTexture(X,w.__webglTexture,n.TEXTURE0+N);const _e=i.get(G);if(G.version!==_e.__version||j===!0){t.activeTexture(n.TEXTURE0+N);const ne=Qe.getPrimaries(Qe.workingColorSpace),ye=y.colorSpace===Gi?null:Qe.getPrimaries(y.colorSpace),Se=y.colorSpace===Gi||ne===ye?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);let ee=v(y.image,!1,s.maxTextureSize);ee=Tt(y,ee);const ce=a.convert(y.format,y.colorSpace),Re=a.convert(y.type);let be=M(y.internalFormat,ce,Re,y.colorSpace,y.isVideoTexture);Ge(X,y);let oe;const Fe=y.mipmaps,A=y.isVideoTexture!==!0,te=_e.__version===void 0||j===!0,se=G.dataReady,de=R(y,ee);if(y.isDepthTexture)be=b(y.format===ys,y.type),te&&(A?t.texStorage2D(n.TEXTURE_2D,1,be,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,be,ee.width,ee.height,0,ce,Re,null));else if(y.isDataTexture)if(Fe.length>0){A&&te&&t.texStorage2D(n.TEXTURE_2D,de,be,Fe[0].width,Fe[0].height);for(let Z=0,K=Fe.length;Z<K;Z++)oe=Fe[Z],A?se&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,oe.width,oe.height,ce,Re,oe.data):t.texImage2D(n.TEXTURE_2D,Z,be,oe.width,oe.height,0,ce,Re,oe.data);y.generateMipmaps=!1}else A?(te&&t.texStorage2D(n.TEXTURE_2D,de,be,ee.width,ee.height),se&&Ze(y,ee,ce,Re)):t.texImage2D(n.TEXTURE_2D,0,be,ee.width,ee.height,0,ce,Re,ee.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){A&&te&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,be,Fe[0].width,Fe[0].height,ee.depth);for(let Z=0,K=Fe.length;Z<K;Z++)if(oe=Fe[Z],y.format!==ai)if(ce!==null)if(A){if(se)if(y.layerUpdates.size>0){const me=ec(oe.width,oe.height,y.format,y.type);for(const Oe of y.layerUpdates){const rt=oe.data.subarray(Oe*me/oe.data.BYTES_PER_ELEMENT,(Oe+1)*me/oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,Oe,oe.width,oe.height,1,ce,rt)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,oe.width,oe.height,ee.depth,ce,oe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Z,be,oe.width,oe.height,ee.depth,0,oe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else A?se&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Z,0,0,0,oe.width,oe.height,ee.depth,ce,Re,oe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Z,be,oe.width,oe.height,ee.depth,0,ce,Re,oe.data)}else{A&&te&&t.texStorage2D(n.TEXTURE_2D,de,be,Fe[0].width,Fe[0].height);for(let Z=0,K=Fe.length;Z<K;Z++)oe=Fe[Z],y.format!==ai?ce!==null?A?se&&t.compressedTexSubImage2D(n.TEXTURE_2D,Z,0,0,oe.width,oe.height,ce,oe.data):t.compressedTexImage2D(n.TEXTURE_2D,Z,be,oe.width,oe.height,0,oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):A?se&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,oe.width,oe.height,ce,Re,oe.data):t.texImage2D(n.TEXTURE_2D,Z,be,oe.width,oe.height,0,ce,Re,oe.data)}else if(y.isDataArrayTexture)if(A){if(te&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,be,ee.width,ee.height,ee.depth),se)if(y.layerUpdates.size>0){const Z=ec(ee.width,ee.height,y.format,y.type);for(const K of y.layerUpdates){const me=ee.data.subarray(K*Z/ee.data.BYTES_PER_ELEMENT,(K+1)*Z/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,K,ee.width,ee.height,1,ce,Re,me)}y.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,ce,Re,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,be,ee.width,ee.height,ee.depth,0,ce,Re,ee.data);else if(y.isData3DTexture)A?(te&&t.texStorage3D(n.TEXTURE_3D,de,be,ee.width,ee.height,ee.depth),se&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,ce,Re,ee.data)):t.texImage3D(n.TEXTURE_3D,0,be,ee.width,ee.height,ee.depth,0,ce,Re,ee.data);else if(y.isFramebufferTexture){if(te)if(A)t.texStorage2D(n.TEXTURE_2D,de,be,ee.width,ee.height);else{let Z=ee.width,K=ee.height;for(let me=0;me<de;me++)t.texImage2D(n.TEXTURE_2D,me,be,Z,K,0,ce,Re,null),Z>>=1,K>>=1}}else if(Fe.length>0){if(A&&te){const Z=St(Fe[0]);t.texStorage2D(n.TEXTURE_2D,de,be,Z.width,Z.height)}for(let Z=0,K=Fe.length;Z<K;Z++)oe=Fe[Z],A?se&&t.texSubImage2D(n.TEXTURE_2D,Z,0,0,ce,Re,oe):t.texImage2D(n.TEXTURE_2D,Z,be,ce,Re,oe);y.generateMipmaps=!1}else if(A){if(te){const Z=St(ee);t.texStorage2D(n.TEXTURE_2D,de,be,Z.width,Z.height)}se&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ce,Re,ee)}else t.texImage2D(n.TEXTURE_2D,0,be,ce,Re,ee);m(y)&&d(X),_e.__version=G.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function Q(w,y,N){if(y.image.length!==6)return;const X=at(w,y),j=y.source;t.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+N);const G=i.get(j);if(j.version!==G.__version||X===!0){t.activeTexture(n.TEXTURE0+N);const _e=Qe.getPrimaries(Qe.workingColorSpace),ne=y.colorSpace===Gi?null:Qe.getPrimaries(y.colorSpace),ye=y.colorSpace===Gi||_e===ne?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);const Se=y.isCompressedTexture||y.image[0].isCompressedTexture,ee=y.image[0]&&y.image[0].isDataTexture,ce=[];for(let K=0;K<6;K++)!Se&&!ee?ce[K]=v(y.image[K],!0,s.maxCubemapSize):ce[K]=ee?y.image[K].image:y.image[K],ce[K]=Tt(y,ce[K]);const Re=ce[0],be=a.convert(y.format,y.colorSpace),oe=a.convert(y.type),Fe=M(y.internalFormat,be,oe,y.colorSpace),A=y.isVideoTexture!==!0,te=G.__version===void 0||X===!0,se=j.dataReady;let de=R(y,Re);Ge(n.TEXTURE_CUBE_MAP,y);let Z;if(Se){A&&te&&t.texStorage2D(n.TEXTURE_CUBE_MAP,de,Fe,Re.width,Re.height);for(let K=0;K<6;K++){Z=ce[K].mipmaps;for(let me=0;me<Z.length;me++){const Oe=Z[me];y.format!==ai?be!==null?A?se&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,me,0,0,Oe.width,Oe.height,be,Oe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,me,Fe,Oe.width,Oe.height,0,Oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):A?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,me,0,0,Oe.width,Oe.height,be,oe,Oe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,me,Fe,Oe.width,Oe.height,0,be,oe,Oe.data)}}}else{if(Z=y.mipmaps,A&&te){Z.length>0&&de++;const K=St(ce[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,de,Fe,K.width,K.height)}for(let K=0;K<6;K++)if(ee){A?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ce[K].width,ce[K].height,be,oe,ce[K].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Fe,ce[K].width,ce[K].height,0,be,oe,ce[K].data);for(let me=0;me<Z.length;me++){const rt=Z[me].image[K].image;A?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,me+1,0,0,rt.width,rt.height,be,oe,rt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,me+1,Fe,rt.width,rt.height,0,be,oe,rt.data)}}else{A?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,be,oe,ce[K]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Fe,be,oe,ce[K]);for(let me=0;me<Z.length;me++){const Oe=Z[me];A?se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,me+1,0,0,be,oe,Oe.image[K]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,me+1,Fe,be,oe,Oe.image[K])}}}m(y)&&d(n.TEXTURE_CUBE_MAP),G.__version=j.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function pe(w,y,N,X,j,G){const _e=a.convert(N.format,N.colorSpace),ne=a.convert(N.type),ye=M(N.internalFormat,_e,ne,N.colorSpace),Se=i.get(y),ee=i.get(N);if(ee.__renderTarget=y,!Se.__hasExternalTextures){const ce=Math.max(1,y.width>>G),Re=Math.max(1,y.height>>G);j===n.TEXTURE_3D||j===n.TEXTURE_2D_ARRAY?t.texImage3D(j,G,ye,ce,Re,y.depth,0,_e,ne,null):t.texImage2D(j,G,ye,ce,Re,0,_e,ne,null)}t.bindFramebuffer(n.FRAMEBUFFER,w),ve(y)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,X,j,ee.__webglTexture,0,ht(y)):(j===n.TEXTURE_2D||j>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,X,j,ee.__webglTexture,G),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Le(w,y,N){if(n.bindRenderbuffer(n.RENDERBUFFER,w),y.depthBuffer){const X=y.depthTexture,j=X&&X.isDepthTexture?X.type:null,G=b(y.stencilBuffer,j),_e=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=ht(y);ve(y)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ne,G,y.width,y.height):N?n.renderbufferStorageMultisample(n.RENDERBUFFER,ne,G,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,G,y.width,y.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,_e,n.RENDERBUFFER,w)}else{const X=y.textures;for(let j=0;j<X.length;j++){const G=X[j],_e=a.convert(G.format,G.colorSpace),ne=a.convert(G.type),ye=M(G.internalFormat,_e,ne,G.colorSpace),Se=ht(y);N&&ve(y)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Se,ye,y.width,y.height):ve(y)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Se,ye,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,ye,y.width,y.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Me(w,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,w),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=i.get(y.depthTexture);X.__renderTarget=y,(!X.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),$(y.depthTexture,0);const j=X.__webglTexture,G=ht(y);if(y.depthTexture.format===vs)ve(y)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,j,0,G):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,j,0);else if(y.depthTexture.format===ys)ve(y)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,j,0,G):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Ke(w){const y=i.get(w),N=w.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==w.depthTexture){const X=w.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),X){const j=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,X.removeEventListener("dispose",j)};X.addEventListener("dispose",j),y.__depthDisposeCallback=j}y.__boundDepthTexture=X}if(w.depthTexture&&!y.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");const X=w.texture.mipmaps;X&&X.length>0?Me(y.__webglFramebuffer[0],w):Me(y.__webglFramebuffer,w)}else if(N){y.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[X]),y.__webglDepthbuffer[X]===void 0)y.__webglDepthbuffer[X]=n.createRenderbuffer(),Le(y.__webglDepthbuffer[X],w,!1);else{const j=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,G=y.__webglDepthbuffer[X];n.bindRenderbuffer(n.RENDERBUFFER,G),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,G)}}else{const X=w.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=n.createRenderbuffer(),Le(y.__webglDepthbuffer,w,!1);else{const j=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,G=y.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,G),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,G)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Pt(w,y,N){const X=i.get(w);y!==void 0&&pe(X.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),N!==void 0&&Ke(w)}function C(w){const y=w.texture,N=i.get(w),X=i.get(y);w.addEventListener("dispose",P);const j=w.textures,G=w.isWebGLCubeRenderTarget===!0,_e=j.length>1;if(_e||(X.__webglTexture===void 0&&(X.__webglTexture=n.createTexture()),X.__version=y.version,r.memory.textures++),G){N.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(y.mipmaps&&y.mipmaps.length>0){N.__webglFramebuffer[ne]=[];for(let ye=0;ye<y.mipmaps.length;ye++)N.__webglFramebuffer[ne][ye]=n.createFramebuffer()}else N.__webglFramebuffer[ne]=n.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){N.__webglFramebuffer=[];for(let ne=0;ne<y.mipmaps.length;ne++)N.__webglFramebuffer[ne]=n.createFramebuffer()}else N.__webglFramebuffer=n.createFramebuffer();if(_e)for(let ne=0,ye=j.length;ne<ye;ne++){const Se=i.get(j[ne]);Se.__webglTexture===void 0&&(Se.__webglTexture=n.createTexture(),r.memory.textures++)}if(w.samples>0&&ve(w)===!1){N.__webglMultisampledFramebuffer=n.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let ne=0;ne<j.length;ne++){const ye=j[ne];N.__webglColorRenderbuffer[ne]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,N.__webglColorRenderbuffer[ne]);const Se=a.convert(ye.format,ye.colorSpace),ee=a.convert(ye.type),ce=M(ye.internalFormat,Se,ee,ye.colorSpace,w.isXRRenderTarget===!0),Re=ht(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,Re,ce,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ne,n.RENDERBUFFER,N.__webglColorRenderbuffer[ne])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(N.__webglDepthRenderbuffer=n.createRenderbuffer(),Le(N.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(G){t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),Ge(n.TEXTURE_CUBE_MAP,y);for(let ne=0;ne<6;ne++)if(y.mipmaps&&y.mipmaps.length>0)for(let ye=0;ye<y.mipmaps.length;ye++)pe(N.__webglFramebuffer[ne][ye],w,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ye);else pe(N.__webglFramebuffer[ne],w,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);m(y)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(_e){for(let ne=0,ye=j.length;ne<ye;ne++){const Se=j[ne],ee=i.get(Se);let ce=n.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ce=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ce,ee.__webglTexture),Ge(ce,Se),pe(N.__webglFramebuffer,w,Se,n.COLOR_ATTACHMENT0+ne,ce,0),m(Se)&&d(ce)}t.unbindTexture()}else{let ne=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ne=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ne,X.__webglTexture),Ge(ne,y),y.mipmaps&&y.mipmaps.length>0)for(let ye=0;ye<y.mipmaps.length;ye++)pe(N.__webglFramebuffer[ye],w,y,n.COLOR_ATTACHMENT0,ne,ye);else pe(N.__webglFramebuffer,w,y,n.COLOR_ATTACHMENT0,ne,0);m(y)&&d(ne),t.unbindTexture()}w.depthBuffer&&Ke(w)}function ct(w){const y=w.textures;for(let N=0,X=y.length;N<X;N++){const j=y[N];if(m(j)){const G=E(w),_e=i.get(j).__webglTexture;t.bindTexture(G,_e),d(G),t.unbindTexture()}}}const Ne=[],Pe=[];function ge(w){if(w.samples>0){if(ve(w)===!1){const y=w.textures,N=w.width,X=w.height;let j=n.COLOR_BUFFER_BIT;const G=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,_e=i.get(w),ne=y.length>1;if(ne)for(let Se=0;Se<y.length;Se++)t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Se,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Se,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,_e.__webglMultisampledFramebuffer);const ye=w.texture.mipmaps;ye&&ye.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let Se=0;Se<y.length;Se++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(j|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(j|=n.STENCIL_BUFFER_BIT)),ne){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,_e.__webglColorRenderbuffer[Se]);const ee=i.get(y[Se]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ee,0)}n.blitFramebuffer(0,0,N,X,0,0,N,X,j,n.NEAREST),l===!0&&(Ne.length=0,Pe.length=0,Ne.push(n.COLOR_ATTACHMENT0+Se),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Ne.push(G),Pe.push(G),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Pe)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ne))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ne)for(let Se=0;Se<y.length;Se++){t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Se,n.RENDERBUFFER,_e.__webglColorRenderbuffer[Se]);const ee=i.get(y[Se]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Se,n.TEXTURE_2D,ee,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const y=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[y])}}}function ht(w){return Math.min(s.maxSamples,w.samples)}function ve(w){const y=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function ze(w){const y=r.render.frame;h.get(w)!==y&&(h.set(w,y),w.update())}function Tt(w,y){const N=w.colorSpace,X=w.format,j=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||N!==$n&&N!==Gi&&(Qe.getTransfer(N)===tt?(X!==ai||j!==yi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),y}function St(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=U,this.setTexture2D=$,this.setTexture2DArray=W,this.setTexture3D=ie,this.setTextureCube=V,this.rebindTextures=Pt,this.setupRenderTarget=C,this.updateRenderTargetMipmap=ct,this.updateMultisampleRenderTarget=ge,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=ve}function Uy(n,e){function t(i,s=Gi){let a;const r=Qe.getTransfer(s);if(i===yi)return n.UNSIGNED_BYTE;if(i===Oo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===No)return n.UNSIGNED_SHORT_5_5_5_1;if(i===oh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===lh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===ah)return n.BYTE;if(i===rh)return n.SHORT;if(i===ms)return n.UNSIGNED_SHORT;if(i===Do)return n.INT;if(i===bn)return n.UNSIGNED_INT;if(i===Ii)return n.FLOAT;if(i===_s)return n.HALF_FLOAT;if(i===ch)return n.ALPHA;if(i===hh)return n.RGB;if(i===ai)return n.RGBA;if(i===vs)return n.DEPTH_COMPONENT;if(i===ys)return n.DEPTH_STENCIL;if(i===uh)return n.RED;if(i===Uo)return n.RED_INTEGER;if(i===dh)return n.RG;if(i===Fo)return n.RG_INTEGER;if(i===Bo)return n.RGBA_INTEGER;if(i===ua||i===da||i===pa||i===fa)if(r===tt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===ua)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===da)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===pa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===fa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===ua)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===da)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===pa)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===fa)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Xr||i===$r||i===Yr||i===Kr)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Xr)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===$r)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Yr)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Kr)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===jr||i===Qr||i===Zr)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===jr||i===Qr)return r===tt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===Zr)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Jr||i===eo||i===to||i===io||i===no||i===so||i===ao||i===ro||i===oo||i===lo||i===co||i===ho||i===uo||i===po)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Jr)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===eo)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===to)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===io)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===no)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===so)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ao)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ro)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===oo)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===lo)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===co)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ho)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===uo)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===po)return r===tt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===fo||i===mo||i===go)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===fo)return r===tt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===mo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===go)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===vo||i===yo||i===So||i===bo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===vo)return a.COMPRESSED_RED_RGTC1_EXT;if(i===yo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===So)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===bo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===gs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Fy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,By=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class zy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Eh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new ji({vertexShader:Fy,fragmentShader:By,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ve(new Mn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Hy extends Qn{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",l=1,c=null,h=null,u=null,p=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new zy,d={},E=t.getContextAttributes();let M=null,b=null;const R=[],T=[],P=new Xe;let O=null;const x=new zt;x.viewport=new it;const _=new zt;_.viewport=new it;const I=[x,_],U=new rf;let z=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let Q=R[Y];return Q===void 0&&(Q=new cr,R[Y]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Y){let Q=R[Y];return Q===void 0&&(Q=new cr,R[Y]=Q),Q.getGripSpace()},this.getHand=function(Y){let Q=R[Y];return Q===void 0&&(Q=new cr,R[Y]=Q),Q.getHandSpace()};function $(Y){const Q=T.indexOf(Y.inputSource);if(Q===-1)return;const pe=R[Q];pe!==void 0&&(pe.update(Y.inputSource,Y.frame,c||r),pe.dispatchEvent({type:Y.type,data:Y.inputSource}))}function W(){s.removeEventListener("select",$),s.removeEventListener("selectstart",$),s.removeEventListener("selectend",$),s.removeEventListener("squeeze",$),s.removeEventListener("squeezestart",$),s.removeEventListener("squeezeend",$),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",ie);for(let Y=0;Y<R.length;Y++){const Q=T[Y];Q!==null&&(T[Y]=null,R[Y].disconnect(Q))}z=null,q=null,m.reset();for(const Y in d)delete d[Y];e.setRenderTarget(M),f=null,p=null,u=null,s=null,b=null,Ze.stop(),i.isPresenting=!1,e.setPixelRatio(O),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){a=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return p!==null?p:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",$),s.addEventListener("selectstart",$),s.addEventListener("selectend",$),s.addEventListener("squeeze",$),s.addEventListener("squeezestart",$),s.addEventListener("squeezeend",$),s.addEventListener("end",W),s.addEventListener("inputsourceschange",ie),E.xrCompatible!==!0&&await t.makeXRCompatible(),O=e.getPixelRatio(),e.getSize(P),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,Le=null,Me=null;E.depth&&(Me=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=E.stencil?ys:vs,Le=E.stencil?gs:bn);const Ke={colorFormat:t.RGBA8,depthFormat:Me,scaleFactor:a};u=this.getBinding(),p=u.createProjectionLayer(Ke),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),b=new _n(p.textureWidth,p.textureHeight,{format:ai,type:yi,depthTexture:new wh(p.textureWidth,p.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const pe={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(s,t,pe),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new _n(f.framebufferWidth,f.framebufferHeight,{format:ai,type:yi,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),Ze.setContext(s),Ze.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ie(Y){for(let Q=0;Q<Y.removed.length;Q++){const pe=Y.removed[Q],Le=T.indexOf(pe);Le>=0&&(T[Le]=null,R[Le].disconnect(pe))}for(let Q=0;Q<Y.added.length;Q++){const pe=Y.added[Q];let Le=T.indexOf(pe);if(Le===-1){for(let Ke=0;Ke<R.length;Ke++)if(Ke>=T.length){T.push(pe),Le=Ke;break}else if(T[Ke]===null){T[Ke]=pe,Le=Ke;break}if(Le===-1)break}const Me=R[Le];Me&&Me.connect(pe)}}const V=new L,re=new L;function he(Y,Q,pe){V.setFromMatrixPosition(Q.matrixWorld),re.setFromMatrixPosition(pe.matrixWorld);const Le=V.distanceTo(re),Me=Q.projectionMatrix.elements,Ke=pe.projectionMatrix.elements,Pt=Me[14]/(Me[10]-1),C=Me[14]/(Me[10]+1),ct=(Me[9]+1)/Me[5],Ne=(Me[9]-1)/Me[5],Pe=(Me[8]-1)/Me[0],ge=(Ke[8]+1)/Ke[0],ht=Pt*Pe,ve=Pt*ge,ze=Le/(-Pe+ge),Tt=ze*-Pe;if(Q.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Tt),Y.translateZ(ze),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Me[10]===-1)Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const St=Pt+ze,w=C+ze,y=ht-Tt,N=ve+(Le-Tt),X=ct*C/w*St,j=Ne*C/w*St;Y.projectionMatrix.makePerspective(y,N,X,j,St,w),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function we(Y,Q){Q===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(Q.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let Q=Y.near,pe=Y.far;m.texture!==null&&(m.depthNear>0&&(Q=m.depthNear),m.depthFar>0&&(pe=m.depthFar)),U.near=_.near=x.near=Q,U.far=_.far=x.far=pe,(z!==U.near||q!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),z=U.near,q=U.far),U.layers.mask=Y.layers.mask|6,x.layers.mask=U.layers.mask&3,_.layers.mask=U.layers.mask&5;const Le=Y.parent,Me=U.cameras;we(U,Le);for(let Ke=0;Ke<Me.length;Ke++)we(Me[Ke],Le);Me.length===2?he(U,x,_):U.projectionMatrix.copy(x.projectionMatrix),Ge(Y,U,Le)};function Ge(Y,Q,pe){pe===null?Y.matrix.copy(Q.matrixWorld):(Y.matrix.copy(pe.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(Q.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Sa*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(p===null&&f===null))return l},this.setFoveation=function(Y){l=Y,p!==null&&(p.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(Y){return d[Y]};let at=null;function lt(Y,Q){if(h=Q.getViewerPose(c||r),g=Q,h!==null){const pe=h.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let Le=!1;pe.length!==U.cameras.length&&(U.cameras.length=0,Le=!0);for(let C=0;C<pe.length;C++){const ct=pe[C];let Ne=null;if(f!==null)Ne=f.getViewport(ct);else{const ge=u.getViewSubImage(p,ct);Ne=ge.viewport,C===0&&(e.setRenderTargetTextures(b,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(b))}let Pe=I[C];Pe===void 0&&(Pe=new zt,Pe.layers.enable(C),Pe.viewport=new it,I[C]=Pe),Pe.matrix.fromArray(ct.transform.matrix),Pe.matrix.decompose(Pe.position,Pe.quaternion,Pe.scale),Pe.projectionMatrix.fromArray(ct.projectionMatrix),Pe.projectionMatrixInverse.copy(Pe.projectionMatrix).invert(),Pe.viewport.set(Ne.x,Ne.y,Ne.width,Ne.height),C===0&&(U.matrix.copy(Pe.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Le===!0&&U.cameras.push(Pe)}const Me=s.enabledFeatures;if(Me&&Me.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=i.getBinding();const C=u.getDepthInformation(pe[0]);C&&C.isValid&&C.texture&&m.init(C,s.renderState)}if(Me&&Me.includes("camera-access")&&v){e.state.unbindTexture(),u=i.getBinding();for(let C=0;C<pe.length;C++){const ct=pe[C].camera;if(ct){let Ne=d[ct];Ne||(Ne=new Eh,d[ct]=Ne);const Pe=u.getCameraImage(ct);Ne.sourceTexture=Pe}}}}for(let pe=0;pe<R.length;pe++){const Le=T[pe],Me=R[pe];Le!==null&&Me!==void 0&&Me.update(Le,Q,c||r)}at&&at(Y,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}const Ze=new Ch;Ze.setAnimationLoop(lt),this.setAnimationLoop=function(Y){at=Y},this.dispose=function(){}}}const ln=new Si,Vy=new ut;function Gy(n,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,bh(n)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,E,M,b){d.isMeshBasicMaterial||d.isMeshLambertMaterial?a(m,d):d.isMeshToonMaterial?(a(m,d),u(m,d)):d.isMeshPhongMaterial?(a(m,d),h(m,d)):d.isMeshStandardMaterial?(a(m,d),p(m,d),d.isMeshPhysicalMaterial&&f(m,d,b)):d.isMeshMatcapMaterial?(a(m,d),g(m,d)):d.isMeshDepthMaterial?a(m,d):d.isMeshDistanceMaterial?(a(m,d),v(m,d)):d.isMeshNormalMaterial?a(m,d):d.isLineBasicMaterial?(r(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,E,M):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function a(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Vt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Vt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const E=e.get(d),M=E.envMap,b=E.envMapRotation;M&&(m.envMap.value=M,ln.copy(b),ln.x*=-1,ln.y*=-1,ln.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ln.y*=-1,ln.z*=-1),m.envMapRotation.value.setFromMatrix4(Vy.makeRotationFromEuler(ln)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function r(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,E,M){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*E,m.scale.value=M*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function p(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function f(m,d,E){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Vt&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function v(m,d){const E=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function qy(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,M){const b=M.program;i.uniformBlockBinding(E,b)}function c(E,M){let b=s[E.id];b===void 0&&(g(E),b=h(E),s[E.id]=b,E.addEventListener("dispose",m));const R=M.program;i.updateUBOMapping(E,R);const T=e.render.frame;a[E.id]!==T&&(p(E),a[E.id]=T)}function h(E){const M=u();E.__bindingPointIndex=M;const b=n.createBuffer(),R=E.__size,T=E.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,R,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,b),b}function u(){for(let E=0;E<o;E++)if(r.indexOf(E)===-1)return r.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(E){const M=s[E.id],b=E.uniforms,R=E.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let T=0,P=b.length;T<P;T++){const O=Array.isArray(b[T])?b[T]:[b[T]];for(let x=0,_=O.length;x<_;x++){const I=O[x];if(f(I,T,x,R)===!0){const U=I.__offset,z=Array.isArray(I.value)?I.value:[I.value];let q=0;for(let $=0;$<z.length;$++){const W=z[$],ie=v(W);typeof W=="number"||typeof W=="boolean"?(I.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,U+q,I.__data)):W.isMatrix3?(I.__data[0]=W.elements[0],I.__data[1]=W.elements[1],I.__data[2]=W.elements[2],I.__data[3]=0,I.__data[4]=W.elements[3],I.__data[5]=W.elements[4],I.__data[6]=W.elements[5],I.__data[7]=0,I.__data[8]=W.elements[6],I.__data[9]=W.elements[7],I.__data[10]=W.elements[8],I.__data[11]=0):(W.toArray(I.__data,q),q+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,I.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(E,M,b,R){const T=E.value,P=M+"_"+b;if(R[P]===void 0)return typeof T=="number"||typeof T=="boolean"?R[P]=T:R[P]=T.clone(),!0;{const O=R[P];if(typeof T=="number"||typeof T=="boolean"){if(O!==T)return R[P]=T,!0}else if(O.equals(T)===!1)return O.copy(T),!0}return!1}function g(E){const M=E.uniforms;let b=0;const R=16;for(let P=0,O=M.length;P<O;P++){const x=Array.isArray(M[P])?M[P]:[M[P]];for(let _=0,I=x.length;_<I;_++){const U=x[_],z=Array.isArray(U.value)?U.value:[U.value];for(let q=0,$=z.length;q<$;q++){const W=z[q],ie=v(W),V=b%R,re=V%ie.boundary,he=V+re;b+=re,he!==0&&R-he<ie.storage&&(b+=R-he),U.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=b,b+=ie.storage}}}const T=b%R;return T>0&&(b+=R-T),E.__size=b,E.__cache={},this}function v(E){const M={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(M.boundary=4,M.storage=4):E.isVector2?(M.boundary=8,M.storage=8):E.isVector3||E.isColor?(M.boundary=16,M.storage=12):E.isVector4?(M.boundary=16,M.storage=16):E.isMatrix3?(M.boundary=48,M.storage=48):E.isMatrix4?(M.boundary=64,M.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),M}function m(E){const M=E.target;M.removeEventListener("dispose",m);const b=r.indexOf(M.__bindingPointIndex);r.splice(b,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete a[M.id]}function d(){for(const E in s)n.deleteBuffer(s[E]);r=[],s={},a={}}return{bind:l,update:c,dispose:d}}class Wy{constructor(e={}){const{canvas:t=Sp(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=r;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,d=null;const E=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=$i,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let R=!1;this._outputColorSpace=Bt;let T=0,P=0,O=null,x=-1,_=null;const I=new it,U=new it;let z=null;const q=new De(0);let $=0,W=t.width,ie=t.height,V=1,re=null,he=null;const we=new it(0,0,W,ie),Ge=new it(0,0,W,ie);let at=!1;const lt=new qo;let Ze=!1,Y=!1;const Q=new ut,pe=new L,Le=new it,Me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ke=!1;function Pt(){return O===null?V:1}let C=i;function ct(S,k){return t.getContext(S,k)}try{const S={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ko}`),t.addEventListener("webglcontextlost",se,!1),t.addEventListener("webglcontextrestored",de,!1),t.addEventListener("webglcontextcreationerror",Z,!1),C===null){const k="webgl2";if(C=ct(k,S),C===null)throw ct(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Ne,Pe,ge,ht,ve,ze,Tt,St,w,y,N,X,j,G,_e,ne,ye,Se,ee,ce,Re,be,oe,Fe;function A(){Ne=new tv(C),Ne.init(),be=new Uy(C,Ne),Pe=new Yg(C,Ne,e,be),ge=new Oy(C,Ne),Pe.reversedDepthBuffer&&p&&ge.buffers.depth.setReversed(!0),ht=new sv(C),ve=new My,ze=new Ny(C,Ne,ge,ve,Pe,be,ht),Tt=new jg(b),St=new ev(b),w=new hf(C),oe=new Xg(C,w),y=new iv(C,w,ht,oe),N=new rv(C,y,w,ht),ee=new av(C,Pe,ze),ne=new Kg(ve),X=new _y(b,Tt,St,Ne,Pe,oe,ne),j=new Gy(b,ve),G=new wy,_e=new Ay(Ne),Se=new Wg(b,Tt,St,ge,N,f,l),ye=new ky(b,N,Pe),Fe=new qy(C,ht,Pe,ge),ce=new $g(C,Ne,ht),Re=new nv(C,Ne,ht),ht.programs=X.programs,b.capabilities=Pe,b.extensions=Ne,b.properties=ve,b.renderLists=G,b.shadowMap=ye,b.state=ge,b.info=ht}A();const te=new Hy(b,C);this.xr=te,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const S=Ne.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Ne.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(S){S!==void 0&&(V=S,this.setSize(W,ie,!1))},this.getSize=function(S){return S.set(W,ie)},this.setSize=function(S,k,F=!0){if(te.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=S,ie=k,t.width=Math.floor(S*V),t.height=Math.floor(k*V),F===!0&&(t.style.width=S+"px",t.style.height=k+"px"),this.setViewport(0,0,S,k)},this.getDrawingBufferSize=function(S){return S.set(W*V,ie*V).floor()},this.setDrawingBufferSize=function(S,k,F){W=S,ie=k,V=F,t.width=Math.floor(S*F),t.height=Math.floor(k*F),this.setViewport(0,0,S,k)},this.getCurrentViewport=function(S){return S.copy(I)},this.getViewport=function(S){return S.copy(we)},this.setViewport=function(S,k,F,B){S.isVector4?we.set(S.x,S.y,S.z,S.w):we.set(S,k,F,B),ge.viewport(I.copy(we).multiplyScalar(V).round())},this.getScissor=function(S){return S.copy(Ge)},this.setScissor=function(S,k,F,B){S.isVector4?Ge.set(S.x,S.y,S.z,S.w):Ge.set(S,k,F,B),ge.scissor(U.copy(Ge).multiplyScalar(V).round())},this.getScissorTest=function(){return at},this.setScissorTest=function(S){ge.setScissorTest(at=S)},this.setOpaqueSort=function(S){re=S},this.setTransparentSort=function(S){he=S},this.getClearColor=function(S){return S.copy(Se.getClearColor())},this.setClearColor=function(){Se.setClearColor(...arguments)},this.getClearAlpha=function(){return Se.getClearAlpha()},this.setClearAlpha=function(){Se.setClearAlpha(...arguments)},this.clear=function(S=!0,k=!0,F=!0){let B=0;if(S){let D=!1;if(O!==null){const J=O.texture.format;D=J===Bo||J===Fo||J===Uo}if(D){const J=O.texture.type,le=J===yi||J===bn||J===ms||J===gs||J===Oo||J===No,fe=Se.getClearColor(),ue=Se.getClearAlpha(),Ce=fe.r,Ae=fe.g,Ee=fe.b;le?(g[0]=Ce,g[1]=Ae,g[2]=Ee,g[3]=ue,C.clearBufferuiv(C.COLOR,0,g)):(v[0]=Ce,v[1]=Ae,v[2]=Ee,v[3]=ue,C.clearBufferiv(C.COLOR,0,v))}else B|=C.COLOR_BUFFER_BIT}k&&(B|=C.DEPTH_BUFFER_BIT),F&&(B|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",se,!1),t.removeEventListener("webglcontextrestored",de,!1),t.removeEventListener("webglcontextcreationerror",Z,!1),Se.dispose(),G.dispose(),_e.dispose(),ve.dispose(),Tt.dispose(),St.dispose(),N.dispose(),oe.dispose(),Fe.dispose(),X.dispose(),te.dispose(),te.removeEventListener("sessionstart",li),te.removeEventListener("sessionend",Yo),Qi.stop()};function se(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function de(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const S=ht.autoReset,k=ye.enabled,F=ye.autoUpdate,B=ye.needsUpdate,D=ye.type;A(),ht.autoReset=S,ye.enabled=k,ye.autoUpdate=F,ye.needsUpdate=B,ye.type=D}function Z(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function K(S){const k=S.target;k.removeEventListener("dispose",K),me(k)}function me(S){Oe(S),ve.remove(S)}function Oe(S){const k=ve.get(S).programs;k!==void 0&&(k.forEach(function(F){X.releaseProgram(F)}),S.isShaderMaterial&&X.releaseShaderCache(S))}this.renderBufferDirect=function(S,k,F,B,D,J){k===null&&(k=Me);const le=D.isMesh&&D.matrixWorld.determinant()<0,fe=Fh(S,k,F,B,D);ge.setMaterial(B,le);let ue=F.index,Ce=1;if(B.wireframe===!0){if(ue=y.getWireframeAttribute(F),ue===void 0)return;Ce=2}const Ae=F.drawRange,Ee=F.attributes.position;let We=Ae.start*Ce,et=(Ae.start+Ae.count)*Ce;J!==null&&(We=Math.max(We,J.start*Ce),et=Math.min(et,(J.start+J.count)*Ce)),ue!==null?(We=Math.max(We,0),et=Math.min(et,ue.count)):Ee!=null&&(We=Math.max(We,0),et=Math.min(et,Ee.count));const vt=et-We;if(vt<0||vt===1/0)return;oe.setup(D,B,fe,F,ue);let ot,nt=ce;if(ue!==null&&(ot=w.get(ue),nt=Re,nt.setIndex(ot)),D.isMesh)B.wireframe===!0?(ge.setLineWidth(B.wireframeLinewidth*Pt()),nt.setMode(C.LINES)):nt.setMode(C.TRIANGLES);else if(D.isLine){let Te=B.linewidth;Te===void 0&&(Te=1),ge.setLineWidth(Te*Pt()),D.isLineSegments?nt.setMode(C.LINES):D.isLineLoop?nt.setMode(C.LINE_LOOP):nt.setMode(C.LINE_STRIP)}else D.isPoints?nt.setMode(C.POINTS):D.isSprite&&nt.setMode(C.TRIANGLES);if(D.isBatchedMesh)if(D._multiDrawInstances!==null)Ss("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),nt.renderMultiDrawInstances(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount,D._multiDrawInstances);else if(Ne.get("WEBGL_multi_draw"))nt.renderMultiDraw(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount);else{const Te=D._multiDrawStarts,dt=D._multiDrawCounts,je=D._multiDrawCount,qt=ue?w.get(ue).bytesPerElement:1,xn=ve.get(B).currentProgram.getUniforms();for(let Wt=0;Wt<je;Wt++)xn.setValue(C,"_gl_DrawID",Wt),nt.render(Te[Wt]/qt,dt[Wt])}else if(D.isInstancedMesh)nt.renderInstances(We,vt,D.count);else if(F.isInstancedBufferGeometry){const Te=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,dt=Math.min(F.instanceCount,Te);nt.renderInstances(We,vt,dt)}else nt.render(We,vt)};function rt(S,k,F){S.transparent===!0&&S.side===Ht&&S.forceSinglePass===!1?(S.side=Vt,S.needsUpdate=!0,Cs(S,k,F),S.side=Ki,S.needsUpdate=!0,Cs(S,k,F),S.side=Ht):Cs(S,k,F)}this.compile=function(S,k,F=null){F===null&&(F=S),d=_e.get(F),d.init(k),M.push(d),F.traverseVisible(function(D){D.isLight&&D.layers.test(k.layers)&&(d.pushLight(D),D.castShadow&&d.pushShadow(D))}),S!==F&&S.traverseVisible(function(D){D.isLight&&D.layers.test(k.layers)&&(d.pushLight(D),D.castShadow&&d.pushShadow(D))}),d.setupLights();const B=new Set;return S.traverse(function(D){if(!(D.isMesh||D.isPoints||D.isLine||D.isSprite))return;const J=D.material;if(J)if(Array.isArray(J))for(let le=0;le<J.length;le++){const fe=J[le];rt(fe,F,D),B.add(fe)}else rt(J,F,D),B.add(J)}),d=M.pop(),B},this.compileAsync=function(S,k,F=null){const B=this.compile(S,k,F);return new Promise(D=>{function J(){if(B.forEach(function(le){ve.get(le).currentProgram.isReady()&&B.delete(le)}),B.size===0){D(S);return}setTimeout(J,10)}Ne.get("KHR_parallel_shader_compile")!==null?J():setTimeout(J,10)})};let Je=null;function _i(S){Je&&Je(S)}function li(){Qi.stop()}function Yo(){Qi.start()}const Qi=new Ch;Qi.setAnimationLoop(_i),typeof self<"u"&&Qi.setContext(self),this.setAnimationLoop=function(S){Je=S,te.setAnimationLoop(S),S===null?Qi.stop():Qi.start()},te.addEventListener("sessionstart",li),te.addEventListener("sessionend",Yo),this.render=function(S,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(te.cameraAutoUpdate===!0&&te.updateCamera(k),k=te.getCamera()),S.isScene===!0&&S.onBeforeRender(b,S,k,O),d=_e.get(S,M.length),d.init(k),M.push(d),Q.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),lt.setFromProjectionMatrix(Q,mi,k.reversedDepth),Y=this.localClippingEnabled,Ze=ne.init(this.clippingPlanes,Y),m=G.get(S,E.length),m.init(),E.push(m),te.enabled===!0&&te.isPresenting===!0){const J=b.xr.getDepthSensingMesh();J!==null&&Pa(J,k,-1/0,b.sortObjects)}Pa(S,k,0,b.sortObjects),m.finish(),b.sortObjects===!0&&m.sort(re,he),Ke=te.enabled===!1||te.isPresenting===!1||te.hasDepthSensing()===!1,Ke&&Se.addToRenderList(m,S),this.info.render.frame++,Ze===!0&&ne.beginShadows();const F=d.state.shadowsArray;ye.render(F,S,k),Ze===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=m.opaque,D=m.transmissive;if(d.setupLights(),k.isArrayCamera){const J=k.cameras;if(D.length>0)for(let le=0,fe=J.length;le<fe;le++){const ue=J[le];jo(B,D,S,ue)}Ke&&Se.render(S);for(let le=0,fe=J.length;le<fe;le++){const ue=J[le];Ko(m,S,ue,ue.viewport)}}else D.length>0&&jo(B,D,S,k),Ke&&Se.render(S),Ko(m,S,k);O!==null&&P===0&&(ze.updateMultisampleRenderTarget(O),ze.updateRenderTargetMipmap(O)),S.isScene===!0&&S.onAfterRender(b,S,k),oe.resetDefaultState(),x=-1,_=null,M.pop(),M.length>0?(d=M[M.length-1],Ze===!0&&ne.setGlobalState(b.clippingPlanes,d.state.camera)):d=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function Pa(S,k,F,B){if(S.visible===!1)return;if(S.layers.test(k.layers)){if(S.isGroup)F=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(k);else if(S.isLight)d.pushLight(S),S.castShadow&&d.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||lt.intersectsSprite(S)){B&&Le.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Q);const le=N.update(S),fe=S.material;fe.visible&&m.push(S,le,fe,F,Le.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||lt.intersectsObject(S))){const le=N.update(S),fe=S.material;if(B&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Le.copy(S.boundingSphere.center)):(le.boundingSphere===null&&le.computeBoundingSphere(),Le.copy(le.boundingSphere.center)),Le.applyMatrix4(S.matrixWorld).applyMatrix4(Q)),Array.isArray(fe)){const ue=le.groups;for(let Ce=0,Ae=ue.length;Ce<Ae;Ce++){const Ee=ue[Ce],We=fe[Ee.materialIndex];We&&We.visible&&m.push(S,le,We,F,Le.z,Ee)}}else fe.visible&&m.push(S,le,fe,F,Le.z,null)}}const J=S.children;for(let le=0,fe=J.length;le<fe;le++)Pa(J[le],k,F,B)}function Ko(S,k,F,B){const D=S.opaque,J=S.transmissive,le=S.transparent;d.setupLightsView(F),Ze===!0&&ne.setGlobalState(b.clippingPlanes,F),B&&ge.viewport(I.copy(B)),D.length>0&&Ts(D,k,F),J.length>0&&Ts(J,k,F),le.length>0&&Ts(le,k,F),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function jo(S,k,F,B){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[B.id]===void 0&&(d.state.transmissionRenderTarget[B.id]=new _n(1,1,{generateMipmaps:!0,type:Ne.has("EXT_color_buffer_half_float")||Ne.has("EXT_color_buffer_float")?_s:yi,minFilter:gn,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qe.workingColorSpace}));const J=d.state.transmissionRenderTarget[B.id],le=B.viewport||I;J.setSize(le.z*b.transmissionResolutionScale,le.w*b.transmissionResolutionScale);const fe=b.getRenderTarget(),ue=b.getActiveCubeFace(),Ce=b.getActiveMipmapLevel();b.setRenderTarget(J),b.getClearColor(q),$=b.getClearAlpha(),$<1&&b.setClearColor(16777215,.5),b.clear(),Ke&&Se.render(F);const Ae=b.toneMapping;b.toneMapping=$i;const Ee=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),d.setupLightsView(B),Ze===!0&&ne.setGlobalState(b.clippingPlanes,B),Ts(S,F,B),ze.updateMultisampleRenderTarget(J),ze.updateRenderTargetMipmap(J),Ne.has("WEBGL_multisampled_render_to_texture")===!1){let We=!1;for(let et=0,vt=k.length;et<vt;et++){const ot=k[et],nt=ot.object,Te=ot.geometry,dt=ot.material,je=ot.group;if(dt.side===Ht&&nt.layers.test(B.layers)){const qt=dt.side;dt.side=Vt,dt.needsUpdate=!0,Qo(nt,F,B,Te,dt,je),dt.side=qt,dt.needsUpdate=!0,We=!0}}We===!0&&(ze.updateMultisampleRenderTarget(J),ze.updateRenderTargetMipmap(J))}b.setRenderTarget(fe,ue,Ce),b.setClearColor(q,$),Ee!==void 0&&(B.viewport=Ee),b.toneMapping=Ae}function Ts(S,k,F){const B=k.isScene===!0?k.overrideMaterial:null;for(let D=0,J=S.length;D<J;D++){const le=S[D],fe=le.object,ue=le.geometry,Ce=le.group;let Ae=le.material;Ae.allowOverride===!0&&B!==null&&(Ae=B),fe.layers.test(F.layers)&&Qo(fe,k,F,ue,Ae,Ce)}}function Qo(S,k,F,B,D,J){S.onBeforeRender(b,k,F,B,D,J),S.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),D.onBeforeRender(b,k,F,B,S,J),D.transparent===!0&&D.side===Ht&&D.forceSinglePass===!1?(D.side=Vt,D.needsUpdate=!0,b.renderBufferDirect(F,k,B,D,S,J),D.side=Ki,D.needsUpdate=!0,b.renderBufferDirect(F,k,B,D,S,J),D.side=Ht):b.renderBufferDirect(F,k,B,D,S,J),S.onAfterRender(b,k,F,B,D,J)}function Cs(S,k,F){k.isScene!==!0&&(k=Me);const B=ve.get(S),D=d.state.lights,J=d.state.shadowsArray,le=D.state.version,fe=X.getParameters(S,D.state,J,k,F),ue=X.getProgramCacheKey(fe);let Ce=B.programs;B.environment=S.isMeshStandardMaterial?k.environment:null,B.fog=k.fog,B.envMap=(S.isMeshStandardMaterial?St:Tt).get(S.envMap||B.environment),B.envMapRotation=B.environment!==null&&S.envMap===null?k.environmentRotation:S.envMapRotation,Ce===void 0&&(S.addEventListener("dispose",K),Ce=new Map,B.programs=Ce);let Ae=Ce.get(ue);if(Ae!==void 0){if(B.currentProgram===Ae&&B.lightsStateVersion===le)return Jo(S,fe),Ae}else fe.uniforms=X.getUniforms(S),S.onBeforeCompile(fe,b),Ae=X.acquireProgram(fe,ue),Ce.set(ue,Ae),B.uniforms=fe.uniforms;const Ee=B.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Ee.clippingPlanes=ne.uniform),Jo(S,fe),B.needsLights=zh(S),B.lightsStateVersion=le,B.needsLights&&(Ee.ambientLightColor.value=D.state.ambient,Ee.lightProbe.value=D.state.probe,Ee.directionalLights.value=D.state.directional,Ee.directionalLightShadows.value=D.state.directionalShadow,Ee.spotLights.value=D.state.spot,Ee.spotLightShadows.value=D.state.spotShadow,Ee.rectAreaLights.value=D.state.rectArea,Ee.ltc_1.value=D.state.rectAreaLTC1,Ee.ltc_2.value=D.state.rectAreaLTC2,Ee.pointLights.value=D.state.point,Ee.pointLightShadows.value=D.state.pointShadow,Ee.hemisphereLights.value=D.state.hemi,Ee.directionalShadowMap.value=D.state.directionalShadowMap,Ee.directionalShadowMatrix.value=D.state.directionalShadowMatrix,Ee.spotShadowMap.value=D.state.spotShadowMap,Ee.spotLightMatrix.value=D.state.spotLightMatrix,Ee.spotLightMap.value=D.state.spotLightMap,Ee.pointShadowMap.value=D.state.pointShadowMap,Ee.pointShadowMatrix.value=D.state.pointShadowMatrix),B.currentProgram=Ae,B.uniformsList=null,Ae}function Zo(S){if(S.uniformsList===null){const k=S.currentProgram.getUniforms();S.uniformsList=ma.seqWithValue(k.seq,S.uniforms)}return S.uniformsList}function Jo(S,k){const F=ve.get(S);F.outputColorSpace=k.outputColorSpace,F.batching=k.batching,F.batchingColor=k.batchingColor,F.instancing=k.instancing,F.instancingColor=k.instancingColor,F.instancingMorph=k.instancingMorph,F.skinning=k.skinning,F.morphTargets=k.morphTargets,F.morphNormals=k.morphNormals,F.morphColors=k.morphColors,F.morphTargetsCount=k.morphTargetsCount,F.numClippingPlanes=k.numClippingPlanes,F.numIntersection=k.numClipIntersection,F.vertexAlphas=k.vertexAlphas,F.vertexTangents=k.vertexTangents,F.toneMapping=k.toneMapping}function Fh(S,k,F,B,D){k.isScene!==!0&&(k=Me),ze.resetTextureUnits();const J=k.fog,le=B.isMeshStandardMaterial?k.environment:null,fe=O===null?b.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:$n,ue=(B.isMeshStandardMaterial?St:Tt).get(B.envMap||le),Ce=B.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,Ae=!!F.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Ee=!!F.morphAttributes.position,We=!!F.morphAttributes.normal,et=!!F.morphAttributes.color;let vt=$i;B.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(vt=b.toneMapping);const ot=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,nt=ot!==void 0?ot.length:0,Te=ve.get(B),dt=d.state.lights;if(Ze===!0&&(Y===!0||S!==_)){const kt=S===_&&B.id===x;ne.setState(B,S,kt)}let je=!1;B.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==dt.state.version||Te.outputColorSpace!==fe||D.isBatchedMesh&&Te.batching===!1||!D.isBatchedMesh&&Te.batching===!0||D.isBatchedMesh&&Te.batchingColor===!0&&D.colorTexture===null||D.isBatchedMesh&&Te.batchingColor===!1&&D.colorTexture!==null||D.isInstancedMesh&&Te.instancing===!1||!D.isInstancedMesh&&Te.instancing===!0||D.isSkinnedMesh&&Te.skinning===!1||!D.isSkinnedMesh&&Te.skinning===!0||D.isInstancedMesh&&Te.instancingColor===!0&&D.instanceColor===null||D.isInstancedMesh&&Te.instancingColor===!1&&D.instanceColor!==null||D.isInstancedMesh&&Te.instancingMorph===!0&&D.morphTexture===null||D.isInstancedMesh&&Te.instancingMorph===!1&&D.morphTexture!==null||Te.envMap!==ue||B.fog===!0&&Te.fog!==J||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==ne.numPlanes||Te.numIntersection!==ne.numIntersection)||Te.vertexAlphas!==Ce||Te.vertexTangents!==Ae||Te.morphTargets!==Ee||Te.morphNormals!==We||Te.morphColors!==et||Te.toneMapping!==vt||Te.morphTargetsCount!==nt)&&(je=!0):(je=!0,Te.__version=B.version);let qt=Te.currentProgram;je===!0&&(qt=Cs(B,k,D));let xn=!1,Wt=!1,es=!1;const pt=qt.getUniforms(),Kt=Te.uniforms;if(ge.useProgram(qt.program)&&(xn=!0,Wt=!0,es=!0),B.id!==x&&(x=B.id,Wt=!0),xn||_!==S){ge.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),pt.setValue(C,"projectionMatrix",S.projectionMatrix),pt.setValue(C,"viewMatrix",S.matrixWorldInverse);const Nt=pt.map.cameraPosition;Nt!==void 0&&Nt.setValue(C,pe.setFromMatrixPosition(S.matrixWorld)),Pe.logarithmicDepthBuffer&&pt.setValue(C,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&pt.setValue(C,"isOrthographic",S.isOrthographicCamera===!0),_!==S&&(_=S,Wt=!0,es=!0)}if(D.isSkinnedMesh){pt.setOptional(C,D,"bindMatrix"),pt.setOptional(C,D,"bindMatrixInverse");const kt=D.skeleton;kt&&(kt.boneTexture===null&&kt.computeBoneTexture(),pt.setValue(C,"boneTexture",kt.boneTexture,ze))}D.isBatchedMesh&&(pt.setOptional(C,D,"batchingTexture"),pt.setValue(C,"batchingTexture",D._matricesTexture,ze),pt.setOptional(C,D,"batchingIdTexture"),pt.setValue(C,"batchingIdTexture",D._indirectTexture,ze),pt.setOptional(C,D,"batchingColorTexture"),D._colorsTexture!==null&&pt.setValue(C,"batchingColorTexture",D._colorsTexture,ze));const jt=F.morphAttributes;if((jt.position!==void 0||jt.normal!==void 0||jt.color!==void 0)&&ee.update(D,F,qt),(Wt||Te.receiveShadow!==D.receiveShadow)&&(Te.receiveShadow=D.receiveShadow,pt.setValue(C,"receiveShadow",D.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(Kt.envMap.value=ue,Kt.flipEnvMap.value=ue.isCubeTexture&&ue.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&k.environment!==null&&(Kt.envMapIntensity.value=k.environmentIntensity),Wt&&(pt.setValue(C,"toneMappingExposure",b.toneMappingExposure),Te.needsLights&&Bh(Kt,es),J&&B.fog===!0&&j.refreshFogUniforms(Kt,J),j.refreshMaterialUniforms(Kt,B,V,ie,d.state.transmissionRenderTarget[S.id]),ma.upload(C,Zo(Te),Kt,ze)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(ma.upload(C,Zo(Te),Kt,ze),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&pt.setValue(C,"center",D.center),pt.setValue(C,"modelViewMatrix",D.modelViewMatrix),pt.setValue(C,"normalMatrix",D.normalMatrix),pt.setValue(C,"modelMatrix",D.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const kt=B.uniformsGroups;for(let Nt=0,Aa=kt.length;Nt<Aa;Nt++){const Zi=kt[Nt];Fe.update(Zi,qt),Fe.bind(Zi,qt)}}return qt}function Bh(S,k){S.ambientLightColor.needsUpdate=k,S.lightProbe.needsUpdate=k,S.directionalLights.needsUpdate=k,S.directionalLightShadows.needsUpdate=k,S.pointLights.needsUpdate=k,S.pointLightShadows.needsUpdate=k,S.spotLights.needsUpdate=k,S.spotLightShadows.needsUpdate=k,S.rectAreaLights.needsUpdate=k,S.hemisphereLights.needsUpdate=k}function zh(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(S,k,F){const B=ve.get(S);B.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),ve.get(S.texture).__webglTexture=k,ve.get(S.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:F,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,k){const F=ve.get(S);F.__webglFramebuffer=k,F.__useDefaultFramebuffer=k===void 0};const Hh=C.createFramebuffer();this.setRenderTarget=function(S,k=0,F=0){O=S,T=k,P=F;let B=!0,D=null,J=!1,le=!1;if(S){const ue=ve.get(S);if(ue.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(C.FRAMEBUFFER,null),B=!1;else if(ue.__webglFramebuffer===void 0)ze.setupRenderTarget(S);else if(ue.__hasExternalTextures)ze.rebindTextures(S,ve.get(S.texture).__webglTexture,ve.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Ee=S.depthTexture;if(ue.__boundDepthTexture!==Ee){if(Ee!==null&&ve.has(Ee)&&(S.width!==Ee.image.width||S.height!==Ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ze.setupDepthRenderbuffer(S)}}const Ce=S.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(le=!0);const Ae=ve.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ae[k])?D=Ae[k][F]:D=Ae[k],J=!0):S.samples>0&&ze.useMultisampledRTT(S)===!1?D=ve.get(S).__webglMultisampledFramebuffer:Array.isArray(Ae)?D=Ae[F]:D=Ae,I.copy(S.viewport),U.copy(S.scissor),z=S.scissorTest}else I.copy(we).multiplyScalar(V).floor(),U.copy(Ge).multiplyScalar(V).floor(),z=at;if(F!==0&&(D=Hh),ge.bindFramebuffer(C.FRAMEBUFFER,D)&&B&&ge.drawBuffers(S,D),ge.viewport(I),ge.scissor(U),ge.setScissorTest(z),J){const ue=ve.get(S.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+k,ue.__webglTexture,F)}else if(le){const ue=k;for(let Ce=0;Ce<S.textures.length;Ce++){const Ae=ve.get(S.textures[Ce]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+Ce,Ae.__webglTexture,F,ue)}}else if(S!==null&&F!==0){const ue=ve.get(S.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,ue.__webglTexture,F)}x=-1},this.readRenderTargetPixels=function(S,k,F,B,D,J,le,fe=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ue=ve.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&le!==void 0&&(ue=ue[le]),ue){ge.bindFramebuffer(C.FRAMEBUFFER,ue);try{const Ce=S.textures[fe],Ae=Ce.format,Ee=Ce.type;if(!Pe.textureFormatReadable(Ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pe.textureTypeReadable(Ee)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=S.width-B&&F>=0&&F<=S.height-D&&(S.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+fe),C.readPixels(k,F,B,D,be.convert(Ae),be.convert(Ee),J))}finally{const Ce=O!==null?ve.get(O).__webglFramebuffer:null;ge.bindFramebuffer(C.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(S,k,F,B,D,J,le,fe=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ue=ve.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&le!==void 0&&(ue=ue[le]),ue)if(k>=0&&k<=S.width-B&&F>=0&&F<=S.height-D){ge.bindFramebuffer(C.FRAMEBUFFER,ue);const Ce=S.textures[fe],Ae=Ce.format,Ee=Ce.type;if(!Pe.textureFormatReadable(Ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pe.textureTypeReadable(Ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const We=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,We),C.bufferData(C.PIXEL_PACK_BUFFER,J.byteLength,C.STREAM_READ),S.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+fe),C.readPixels(k,F,B,D,be.convert(Ae),be.convert(Ee),0);const et=O!==null?ve.get(O).__webglFramebuffer:null;ge.bindFramebuffer(C.FRAMEBUFFER,et);const vt=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await bp(C,vt,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,We),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,J),C.deleteBuffer(We),C.deleteSync(vt),J}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,k=null,F=0){const B=Math.pow(2,-F),D=Math.floor(S.image.width*B),J=Math.floor(S.image.height*B),le=k!==null?k.x:0,fe=k!==null?k.y:0;ze.setTexture2D(S,0),C.copyTexSubImage2D(C.TEXTURE_2D,F,0,0,le,fe,D,J),ge.unbindTexture()};const Vh=C.createFramebuffer(),Gh=C.createFramebuffer();this.copyTextureToTexture=function(S,k,F=null,B=null,D=0,J=null){J===null&&(D!==0?(Ss("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),J=D,D=0):J=0);let le,fe,ue,Ce,Ae,Ee,We,et,vt;const ot=S.isCompressedTexture?S.mipmaps[J]:S.image;if(F!==null)le=F.max.x-F.min.x,fe=F.max.y-F.min.y,ue=F.isBox3?F.max.z-F.min.z:1,Ce=F.min.x,Ae=F.min.y,Ee=F.isBox3?F.min.z:0;else{const jt=Math.pow(2,-D);le=Math.floor(ot.width*jt),fe=Math.floor(ot.height*jt),S.isDataArrayTexture?ue=ot.depth:S.isData3DTexture?ue=Math.floor(ot.depth*jt):ue=1,Ce=0,Ae=0,Ee=0}B!==null?(We=B.x,et=B.y,vt=B.z):(We=0,et=0,vt=0);const nt=be.convert(k.format),Te=be.convert(k.type);let dt;k.isData3DTexture?(ze.setTexture3D(k,0),dt=C.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(ze.setTexture2DArray(k,0),dt=C.TEXTURE_2D_ARRAY):(ze.setTexture2D(k,0),dt=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,k.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,k.unpackAlignment);const je=C.getParameter(C.UNPACK_ROW_LENGTH),qt=C.getParameter(C.UNPACK_IMAGE_HEIGHT),xn=C.getParameter(C.UNPACK_SKIP_PIXELS),Wt=C.getParameter(C.UNPACK_SKIP_ROWS),es=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,ot.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ot.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Ce),C.pixelStorei(C.UNPACK_SKIP_ROWS,Ae),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Ee);const pt=S.isDataArrayTexture||S.isData3DTexture,Kt=k.isDataArrayTexture||k.isData3DTexture;if(S.isDepthTexture){const jt=ve.get(S),kt=ve.get(k),Nt=ve.get(jt.__renderTarget),Aa=ve.get(kt.__renderTarget);ge.bindFramebuffer(C.READ_FRAMEBUFFER,Nt.__webglFramebuffer),ge.bindFramebuffer(C.DRAW_FRAMEBUFFER,Aa.__webglFramebuffer);for(let Zi=0;Zi<ue;Zi++)pt&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,ve.get(S).__webglTexture,D,Ee+Zi),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,ve.get(k).__webglTexture,J,vt+Zi)),C.blitFramebuffer(Ce,Ae,le,fe,We,et,le,fe,C.DEPTH_BUFFER_BIT,C.NEAREST);ge.bindFramebuffer(C.READ_FRAMEBUFFER,null),ge.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(D!==0||S.isRenderTargetTexture||ve.has(S)){const jt=ve.get(S),kt=ve.get(k);ge.bindFramebuffer(C.READ_FRAMEBUFFER,Vh),ge.bindFramebuffer(C.DRAW_FRAMEBUFFER,Gh);for(let Nt=0;Nt<ue;Nt++)pt?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,jt.__webglTexture,D,Ee+Nt):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,jt.__webglTexture,D),Kt?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,kt.__webglTexture,J,vt+Nt):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,kt.__webglTexture,J),D!==0?C.blitFramebuffer(Ce,Ae,le,fe,We,et,le,fe,C.COLOR_BUFFER_BIT,C.NEAREST):Kt?C.copyTexSubImage3D(dt,J,We,et,vt+Nt,Ce,Ae,le,fe):C.copyTexSubImage2D(dt,J,We,et,Ce,Ae,le,fe);ge.bindFramebuffer(C.READ_FRAMEBUFFER,null),ge.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else Kt?S.isDataTexture||S.isData3DTexture?C.texSubImage3D(dt,J,We,et,vt,le,fe,ue,nt,Te,ot.data):k.isCompressedArrayTexture?C.compressedTexSubImage3D(dt,J,We,et,vt,le,fe,ue,nt,ot.data):C.texSubImage3D(dt,J,We,et,vt,le,fe,ue,nt,Te,ot):S.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,J,We,et,le,fe,nt,Te,ot.data):S.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,J,We,et,ot.width,ot.height,nt,ot.data):C.texSubImage2D(C.TEXTURE_2D,J,We,et,le,fe,nt,Te,ot);C.pixelStorei(C.UNPACK_ROW_LENGTH,je),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,qt),C.pixelStorei(C.UNPACK_SKIP_PIXELS,xn),C.pixelStorei(C.UNPACK_SKIP_ROWS,Wt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,es),J===0&&k.generateMipmaps&&C.generateMipmap(dt),ge.unbindTexture()},this.initRenderTarget=function(S){ve.get(S).__webglFramebuffer===void 0&&ze.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?ze.setTextureCube(S,0):S.isData3DTexture?ze.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?ze.setTexture2DArray(S,0):ze.setTexture2D(S,0),ge.unbindTexture()},this.resetState=function(){T=0,P=0,O=null,ge.reset(),oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Qe._getUnpackColorSpace()}}const Ec={bottom:0,top:Math.PI,left:Math.PI/2,right:-Math.PI/2};function Xy(n){return n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2}function na(n,e){const t=n[e];return new L(t.x,t.y,t.z)}function $y(n,e){const t=Math.PI*2;let i=((e-n+Math.PI)%t+t)%t-Math.PI;return Math.abs(Math.abs(i)-Math.PI)<1e-4&&(i=Math.PI),n+i}class Yy{constructor(e){this.camera=e,this.target=na(Ji.menu,"target"),this.basePosition=na(Ji.menu,"position"),this.desiredPosition=this.basePosition.clone(),this.desiredTarget=this.target.clone(),this.time=0,this.motionEnabled=!0,this.viewport={width:1280,height:720},this.mode="menu",this.side="bottom",this.sideAngle=0,this.sideTransition=null,this.tempPosition=new L,this.tempTarget=new L,this.sidePosition=new L,this.feedbackOffset=new L,this.feedbackVelocity=new L,this.manualOrbitEnabled=!1,this.isManualOrbiting=!1,this.manualOrbitYaw=0,this.manualOrbitLift=0,this.orbitStart={x:0,y:0,yaw:0,lift:0}}init(){this.setMenuView({immediate:!0})}setViewport(e,t){this.viewport={width:e,height:t},this.mode==="gameplay"&&this.setGameplayView()}setMotionEnabled(e){this.updateIdleMotion(e)}updateIdleMotion(e){this.motionEnabled=!!e}setManualOrbitEnabled(e){this.manualOrbitEnabled=!!e,this.manualOrbitEnabled||(this.isManualOrbiting=!1,this.manualOrbitYaw=0,this.manualOrbitLift=0)}beginManualOrbit(e,t){return this.manualOrbitEnabled?(this.isManualOrbiting=!0,this.orbitStart.x=e,this.orbitStart.y=t,this.orbitStart.yaw=this.manualOrbitYaw,this.orbitStart.lift=this.manualOrbitLift,!0):!1}updateManualOrbit(e,t){if(!this.isManualOrbiting)return;const i=e-this.orbitStart.x,s=t-this.orbitStart.y;this.manualOrbitYaw=this.orbitStart.yaw-i*.006,this.manualOrbitLift=Math.min(Math.max(this.orbitStart.lift+s*.004,-.82),.78)}endManualOrbit(){this.isManualOrbiting=!1}setMenuView(e={}){this.mode="menu",this.setView(Ji.menu,e)}setGameplayView(e={}){this.mode="gameplay";const t=this.viewport.width<=760||this.viewport.height<=560;this.setView(t?Ji.mobile:Ji.gameplay,e)}setGameplaySide(e="bottom",{immediate:t=!1}={}){const i=Object.prototype.hasOwnProperty.call(Ec,e)?e:"bottom",s=this.getNextSideAngle(i);if(this.side=i,t||Math.abs(s-this.sideAngle)<1e-4){this.sideAngle=s,this.sideTransition=null,this.applyImmediateCameraPosition();return}this.sideTransition={from:this.sideAngle,to:s,elapsed:0,duration:Ia.DURATION}}getNextSideAngle(e){return this.side==="bottom"&&e==="top"||this.side==="top"&&e==="bottom"?this.sideAngle+Math.PI:$y(this.sideAngle,Ec[e])}setTopView(e={}){this.mode="top",this.setView(Ji.top,e)}setCinematicView(e={}){this.mode="cinematic",this.setView(Ji.cinematic,e)}focusBoard(e={}){this.setGameplayView(e)}setView(e,{immediate:t=!1}={}){this.basePosition.copy(na(e,"position")),this.target.copy(na(e,"target")),this.desiredPosition.copy(this.basePosition),this.desiredTarget.copy(this.target),t&&this.applyImmediateCameraPosition()}applyImmediateCameraPosition(){this.camera.position.copy(this.getSideAdjustedPosition()),this.camera.lookAt(this.target),this.desiredTarget.copy(this.target)}getSideAdjustedPosition(){const e=this.basePosition.x-this.target.x,t=this.basePosition.z-this.target.z,i=(this.mode==="gameplay"?this.sideAngle:0)+this.manualOrbitYaw,s=Math.cos(i),a=Math.sin(i);return this.sidePosition.set(this.target.x+e*s-t*a,this.basePosition.y+this.manualOrbitLift,this.target.z+e*a+t*s),this.sidePosition}focusForState(e){if(e==="playing"||e==="paused"||e==="result"){this.setGameplayView();return}if(!(e==="rules"||e==="settings")){if(e==="modeSelect"||e==="localSetup"){this.setCinematicView();return}this.setMenuView()}}playIntroSweep(){this.motionEnabled&&(this.setCinematicView(),this.feedbackVelocity.set(-.12,.05,.16))}shotNudge(e=.5){if(!this.motionEnabled)return;const t=Math.min(Math.max(e,.1),1);this.feedbackVelocity.set(0,.025*t,-.08*t)}foulPulse(){this.motionEnabled&&this.feedbackVelocity.set(.08,0,.04)}winnerView(){this.setCinematicView(),this.motionEnabled&&this.feedbackVelocity.set(-.06,.08,.12)}clearFeedback(){this.feedbackOffset.set(0,0,0),this.feedbackVelocity.set(0,0,0),this.sideTransition=null}update(e){this.time+=e,this.updateSideTransition(e);const t=this.mode==="gameplay"?.055:.18,i=this.motionEnabled?Math.sin(this.time*.32)*t:0,s=this.motionEnabled?Math.sin(this.time*.21)*t*.32:0,a=this.getSideAdjustedPosition();this.tempPosition.set(a.x+i,a.y+s,a.z),this.feedbackOffset.addScaledVector(this.feedbackVelocity,e),this.feedbackVelocity.multiplyScalar(Math.exp(-e*9)),this.feedbackOffset.multiplyScalar(Math.exp(-e*5.5)),this.tempPosition.add(this.feedbackOffset),this.tempTarget.copy(this.target);const r=this.sideTransition?Ia.POSITION_LERP:2.8,o=this.sideTransition?Ia.TARGET_LERP:3.2;this.camera.position.lerp(this.tempPosition,1-Math.exp(-e*r)),this.desiredTarget.lerp(this.tempTarget,1-Math.exp(-e*o)),this.camera.lookAt(this.desiredTarget)}updateSideTransition(e){if(!this.sideTransition)return;this.sideTransition.elapsed+=e;const t=Math.min(this.sideTransition.elapsed/this.sideTransition.duration,1),i=Xy(t);this.sideAngle=this.sideTransition.from+(this.sideTransition.to-this.sideTransition.from)*i,t>=1&&(this.sideAngle=this.sideTransition.to,this.sideTransition=null)}}const cn=2048;function br(n,e){const t=n.replace("#",""),i=Number.parseInt(t,16),s=i>>16&255,a=i>>8&255,r=i&255;return`rgba(${s}, ${a}, ${r}, ${e})`}function hn(n,e,t,i,s,a){n.beginPath(),n.arc(e,t,i,0,Math.PI*2),n.strokeStyle=s,n.lineWidth=a,n.stroke()}class Ky{constructor({theme:e}){this.theme=e,this.boardStyleId="ivory",this.texture=null,this.material=null,this.mesh=null,this.sceneOverrides={}}create(){return this.texture=this.createTexture(this.getEffectiveTheme()),this.material=new Rt({map:this.texture,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,side:Ht}),this.mesh=new Ve(new Mn(H.PLAY_AREA_SIZE,H.PLAY_AREA_SIZE),this.material),this.mesh.name="board-markings-layer",this.mesh.rotation.x=-Math.PI/2,this.mesh.position.y=H.SURFACE_Y+H.MARKING_Y_OFFSET,this.mesh.renderOrder=10,this.mesh}createTexture(e){const t=document.createElement("canvas");t.width=cn,t.height=cn;const i=t.getContext("2d"),s=H.PLAY_AREA_SIZE/2,a=cn/H.PLAY_AREA_SIZE,r=f=>cn/2+f*a,o=f=>cn/2+f*a,l=f=>f*a,c=br(e.scene.markingLine,.82),h=br(e.scene.markingLine,.42),u=br(e.scene.goldTrim,.7);i.clearRect(0,0,cn,cn),i.lineCap="round",i.lineJoin="round",hn(i,r(0),o(0),l(.58),c,l(.022)),hn(i,r(0),o(0),l(.34),h,l(.014)),hn(i,r(0),o(0),l(.18),u,l(.012)),this.drawBaselineSet(i,r,o,l,c,h,1),this.drawBaselineSet(i,r,o,l,c,h,-1),this.drawSideBaselineSet(i,r,o,l,c,h,1),this.drawSideBaselineSet(i,r,o,l,c,h,-1),this.drawCornerGuides(i,r,o,l,c,h,s);const p=new jp(t);return p.colorSpace=Bt,p.anisotropy=8,p.needsUpdate=!0,p}drawBaselineSet(e,t,i,s,a,r,o){const l=H.BASELINE_OFFSET*o,c=.17,h=-1.55,u=H.BASELINE_HALF_LENGTH,p=.16;e.strokeStyle=a,e.lineWidth=s(.018),[l-c/2*o,l+c/2*o].forEach(f=>{e.beginPath(),e.moveTo(t(h),i(f)),e.lineTo(t(u),i(f)),e.stroke()}),[h,u].forEach(f=>{hn(e,t(f),i(l),s(p),r,s(.016)),hn(e,t(f),i(l),s(p*.56),a,s(.01))})}drawSideBaselineSet(e,t,i,s,a,r,o){const l=H.BASELINE_OFFSET*o,c=.17,h=-1.55,u=H.BASELINE_HALF_LENGTH,p=.16;e.strokeStyle=a,e.lineWidth=s(.018),[l-c/2*o,l+c/2*o].forEach(f=>{e.beginPath(),e.moveTo(t(f),i(h)),e.lineTo(t(f),i(u)),e.stroke()}),[h,u].forEach(f=>{hn(e,t(l),i(f),s(p),r,s(.016)),hn(e,t(l),i(f),s(p*.56),a,s(.01))})}drawCornerGuides(e,t,i,s,a,r,o){e.lineWidth=s(.014),[[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([h,u])=>{const p=h*(o-.74),f=u*(o-.74);e.strokeStyle=r,e.beginPath(),e.moveTo(t(p),i(f)),e.lineTo(t(p-h*.82),i(f-u*.82)),e.stroke(),e.strokeStyle=a,e.beginPath(),e.moveTo(t(p-h*.22),i(f)),e.lineTo(t(p),i(f)),e.lineTo(t(p),i(f-u*.22)),e.stroke()})}getEffectiveTheme(e=this.theme,t=this.boardStyleId,i=this.sceneOverrides){const s=wo(e,t);return{...s,scene:{...s.scene,...i||{}}}}applyTheme(e,t=this.boardStyleId,i=this.sceneOverrides){this.theme=e,this.boardStyleId=t||"ivory",this.sceneOverrides={...i||{}},this.material&&(this.texture?.dispose(),this.texture=this.createTexture(this.getEffectiveTheme(e,this.boardStyleId,this.sceneOverrides)),this.material.map=this.texture,this.material.needsUpdate=!0)}dispose(){this.texture?.dispose(),this.material?.dispose(),this.mesh?.geometry?.dispose()}}class jy{constructor({materialLibrary:e,theme:t}){this.materialLibrary=e,this.theme=t,this.boardStyleId="ivory",this.cosmeticScene={},this.group=new Yt,this.group.name="premium-carrom-board",this.markings=new Ky({theme:t}),this.pockets=[]}build(){return this.createTableBase(),this.createBoardBody(),this.createPlaySurface(),this.createFrameRails(),this.createTrimLines(),this.createPockets(),this.group.add(this.markings.create()),{group:this.group,pockets:this.pockets}}createTableBase(){const e=new Ve(new Kn(4.85,5.22,.34,128),this.materialLibrary.get("tableBase"));e.name="ivory-table-base",e.position.y=-.36,e.receiveShadow=!0,e.castShadow=!0,this.group.add(e);const t=new Ve(new Di(4.95,96),this.materialLibrary.get("softShadow"));t.name="board-soft-shadow",t.rotation.x=-Math.PI/2,t.position.y=-.18,t.scale.set(1.22,.86,1),t.renderOrder=0,this.group.add(t)}createBoardBody(){const e=new Ve(new ki(H.BOARD_SIZE,H.BOARD_THICKNESS,H.BOARD_SIZE),this.materialLibrary.get("frameSide"));e.name="carrom-board-body",e.position.y=H.SURFACE_Y-H.BOARD_THICKNESS/2,e.castShadow=!0,e.receiveShadow=!0,this.group.add(e)}createPlaySurface(){const e=new Ve(new Mn(H.PLAY_AREA_SIZE,H.PLAY_AREA_SIZE),this.materialLibrary.get("boardSurface"));e.name="carrom-playing-surface",e.rotation.x=-Math.PI/2,e.position.y=H.SURFACE_Y+.002,e.receiveShadow=!0,this.group.add(e)}createFrameRails(){const e=H.BOARD_SIZE/2,t=H.SURFACE_Y+H.FRAME_HEIGHT/2,i=e-H.FRAME_WIDTH/2,s=this.materialLibrary.get("outerFrame");[{name:"frame-rail-left",size:[H.FRAME_WIDTH,H.FRAME_HEIGHT,H.BOARD_SIZE],position:[-i,t,0]},{name:"frame-rail-right",size:[H.FRAME_WIDTH,H.FRAME_HEIGHT,H.BOARD_SIZE],position:[i,t,0]},{name:"frame-rail-top",size:[H.BOARD_SIZE,H.FRAME_HEIGHT,H.FRAME_WIDTH],position:[0,t,-i]},{name:"frame-rail-bottom",size:[H.BOARD_SIZE,H.FRAME_HEIGHT,H.FRAME_WIDTH],position:[0,t,i]}].forEach(a=>{const r=new Ve(new ki(...a.size),s);r.name=a.name,r.position.set(...a.position),r.castShadow=!0,r.receiveShadow=!0,this.group.add(r)})}createTrimLines(){const e=H.PLAY_AREA_SIZE/2,t=H.BOARD_SIZE/2,i=H.SURFACE_Y+H.FRAME_HEIGHT+.012,s=H.SURFACE_Y+.018,a=this.materialLibrary.get("goldTrim"),r=.035;[[H.PLAY_AREA_SIZE,r,0,s,-e],[H.PLAY_AREA_SIZE,r,0,s,e],[r,H.PLAY_AREA_SIZE,-e,s,0],[r,H.PLAY_AREA_SIZE,e,s,0],[H.BOARD_SIZE-.32,.045,0,i,-t+.18],[H.BOARD_SIZE-.32,.045,0,i,t-.18],[.045,H.BOARD_SIZE-.32,-t+.18,i,0],[.045,H.BOARD_SIZE-.32,t-.18,i,0]].forEach(([o,l,c,h,u],p)=>{const f=new Ve(new ki(o,.028,l),a);f.name=`gold-trim-${p+1}`,f.position.set(c,h,u),f.castShadow=!0,this.group.add(f)})}createPockets(){const e=this.materialLibrary.get("pocketDark"),t=this.materialLibrary.get("pocketRim"),i=new Kn(H.POCKET_RADIUS,H.POCKET_RADIUS*1.08,.075,48),s=new yn(H.POCKET_RADIUS*1.05,.032,12,72);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,r],o)=>{const l=a*H.POCKET_CENTER_OFFSET,c=r*H.POCKET_CENTER_OFFSET,h=new Ve(i,e);h.name=`corner-pocket-${o+1}`,h.position.set(l,H.SURFACE_Y-.018,c),h.receiveShadow=!0,this.group.add(h);const u=new Ve(s,t);u.name=`corner-pocket-rim-${o+1}`,u.rotation.x=Math.PI/2,u.position.set(l,H.SURFACE_Y+.018,c),u.castShadow=!0,this.group.add(u),this.pockets.push({id:`pocket-${o+1}`,position:{x:l,y:H.SURFACE_Y,z:c},radius:H.POCKET_RADIUS,mesh:h})})}applyTheme(e,t=this.boardStyleId,i=this.cosmeticScene){this.theme=e,this.boardStyleId=t||"ivory",this.cosmeticScene={...i||{}},this.markings.applyTheme(e,this.boardStyleId,this.cosmeticScene)}dispose(){this.markings.dispose()}}class Qy{constructor(e,t){this.scene=e,this.group=new Yt,this.scene.add(this.group),this.ambient=new af(t.scene.light,.95),this.hemisphere=new Jp(t.scene.light,t.scene.fog,1.18),this.key=new Ql(t.scene.light,2.45),this.fill=new Ql(t.scene.rim,.82),this.rim=new jl(t.scene.glow,2.55,18,1.8),this.tableGlow=new jl(t.scene.glow,1.35,9,2.2),this.boardSpot=new tf(t.scene.light,1.65,16,Math.PI/6,.52,1.4),this.key.position.set(5.6,8.8,5.8),this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048),this.key.shadow.camera.near=.5,this.key.shadow.camera.far=28,this.key.shadow.camera.left=-10,this.key.shadow.camera.right=10,this.key.shadow.camera.top=10,this.key.shadow.camera.bottom=-10,this.key.shadow.bias=-18e-5,this.fill.position.set(-6.8,4.6,-4.5),this.rim.position.set(0,2.8,-3.9),this.tableGlow.position.set(0,1.15,1.35),this.boardSpot.position.set(-2.4,5.8,3.4),this.boardSpot.target.position.set(0,.08,0),this.boardSpot.castShadow=!0,this.boardSpot.shadow.mapSize.set(1024,1024),this.boardSpot.shadow.bias=-12e-5,this.group.add(this.ambient,this.hemisphere,this.key,this.fill,this.rim,this.tableGlow,this.boardSpot,this.boardSpot.target)}applyTheme(e){this.ambient.color.set(e.scene.light),this.hemisphere.color.set(e.scene.light),this.hemisphere.groundColor.set(e.scene.fog),this.key.color.set(e.scene.light),this.fill.color.set(e.scene.rim),this.rim.color.set(e.scene.glow),this.tableGlow.color.set(e.scene.glow),this.boardSpot.color.set(e.scene.light)}applyQuality(e){e&&(this.key.castShadow=!!e.shadowEnabled,this.boardSpot.castShadow=!!e.shadowEnabled,this.key.shadow.mapSize.set(e.keyShadowMapSize,e.keyShadowMapSize),this.boardSpot.shadow.mapSize.set(e.spotShadowMapSize,e.spotShadowMapSize),this.key.shadow.map?.dispose?.(),this.boardSpot.shadow.map?.dispose?.(),this.key.shadow.map=null,this.boardSpot.shadow.map=null,this.key.shadow.needsUpdate=!0,this.boardSpot.shadow.needsUpdate=!0)}dispose(){this.scene.remove(this.group)}}class Zy{constructor(e){this.theme=e,this.boardStyleId="ivory",this.cosmeticScene={},this.materials=new Map,this.createMaterials(e)}getEffectiveScene(e=this.theme,t=this.boardStyleId){return{...wo(e,t).scene,...this.cosmeticScene}}createMaterials(e){const t=this.getEffectiveScene(e,this.boardStyleId);this.materials.set("tableBase",new Lt({color:t.tableBase,roughness:.92,metalness:.02})),this.materials.set("boardSurface",new Lt({color:t.boardSurface,roughness:.78,metalness:.03})),this.materials.set("outerFrame",new Lt({color:t.outerFrame,roughness:.46,metalness:.16})),this.materials.set("frameSide",new Lt({color:t.frameSide,roughness:.58,metalness:.1})),this.materials.set("goldTrim",new Lt({color:t.goldTrim,emissive:new De(t.glow),emissiveIntensity:.07,roughness:.26,metalness:.58})),this.materials.set("strikerRing",new Lt({color:t.strikerRing||t.goldTrim,emissive:new De(t.strikerGlow||t.glow),emissiveIntensity:.06,roughness:.24,metalness:.56})),this.materials.set("pocketDark",new Lt({color:t.pocketDark,roughness:.9,metalness:.02})),this.materials.set("pocketRim",new Lt({color:t.pocketRim,emissive:new De(t.glow),emissiveIntensity:.05,roughness:.3,metalness:.48})),this.materials.set("markingLine",new Rt({color:t.markingLine,transparent:!0,opacity:.82,depthWrite:!1})),this.materials.set("whiteCoin",new Lt({color:t.whiteCoin,roughness:.42,metalness:.05})),this.materials.set("whiteCoinRim",new Lt({color:t.whiteCoinRim,emissive:new De(t.glow),emissiveIntensity:.04,roughness:.28,metalness:.46})),this.materials.set("blackCoin",new Lt({color:t.blackCoin,roughness:.36,metalness:.12})),this.materials.set("blackCoinRim",new Lt({color:t.blackCoinRim,emissive:new De(t.glow),emissiveIntensity:.04,roughness:.28,metalness:.5})),this.materials.set("queen",new Lt({color:t.queen,emissive:new De(t.queen),emissiveIntensity:.05,roughness:.38,metalness:.08})),this.materials.set("queenRim",new Lt({color:t.queenRim,emissive:new De(t.glow),emissiveIntensity:.06,roughness:.24,metalness:.55})),this.materials.set("striker",new Lt({color:t.striker,emissive:new De(t.strikerGlow),emissiveIntensity:.08,roughness:.32,metalness:.08})),this.materials.set("strikerGlow",new Rt({color:t.strikerGlow,transparent:!0,opacity:.22,depthWrite:!1})),this.materials.set("softShadow",new Rt({color:t.shadow,transparent:!0,opacity:.13,depthWrite:!1}))}get(e){return this.materials.get(e)}applyTheme(e,t=this.boardStyleId,i=this.cosmeticScene){this.theme=e,this.boardStyleId=t||"ivory",this.cosmeticScene={...i||{}};const s=this.getEffectiveScene(e,this.boardStyleId);this.setColor("tableBase",s.tableBase),this.setColor("boardSurface",s.boardSurface),this.setColor("outerFrame",s.outerFrame),this.setColor("frameSide",s.frameSide),this.setColor("goldTrim",s.goldTrim,s.glow),this.setColor("strikerRing",s.strikerRing||s.goldTrim,s.strikerGlow||s.glow),this.setColor("pocketDark",s.pocketDark),this.setColor("pocketRim",s.pocketRim,s.glow),this.setColor("markingLine",s.markingLine),this.setColor("whiteCoin",s.whiteCoin),this.setColor("whiteCoinRim",s.whiteCoinRim,s.glow),this.setColor("blackCoin",s.blackCoin),this.setColor("blackCoinRim",s.blackCoinRim,s.glow),this.setColor("queen",s.queen,s.queen),this.setColor("queenRim",s.queenRim,s.glow),this.setColor("striker",s.striker,s.strikerGlow),this.setColor("strikerGlow",s.strikerGlow),this.setColor("softShadow",s.shadow)}applyBoardStyle(e){this.applyTheme(this.theme,e)}applyCosmetics(e={}){this.applyTheme(this.theme,this.boardStyleId,e)}setColor(e,t,i=null){const s=this.materials.get(e);s&&(s.color?.set(t),i&&s.emissive&&s.emissive.set(i))}dispose(){this.materials.forEach(e=>e.dispose()),this.materials.clear()}}class Jy{constructor({materialLibrary:e}){this.materialLibrary=e,this.group=new Yt,this.group.name="static-carrom-pieces",this.pieces=[],this.coinGeometry=new Kn(H.COIN_RADIUS,H.COIN_RADIUS,H.COIN_HEIGHT,48),this.strikerGeometry=new Kn(H.STRIKER_RADIUS,H.STRIKER_RADIUS,H.STRIKER_HEIGHT,64),this.coinRingGeometry=new yn(H.COIN_RADIUS*.78,.012,10,48),this.strikerRingGeometry=new yn(H.STRIKER_RADIUS*.72,.016,10,56),this.shadowGeometry=new Di(.25,36),this.highlightMaterial=new Rt({color:16777215,transparent:!0,opacity:.22,depthWrite:!1})}createInitialPieces(){return this.createQueen(),this.createCoinRing({count:6,radius:H.CENTER_CLUSTER_SPACING,angleOffset:Math.PI/6,colors:["white","black","white","black","white","black"],idPrefix:"inner"}),this.createCoinRing({count:12,radius:H.CENTER_CLUSTER_SPACING*2,angleOffset:0,colors:["black","white","black","white","black","white","black","white","black","white","black","white"],idPrefix:"outer"}),this.createStriker(),{group:this.group,pieces:this.pieces}}createCoinRing({count:e,radius:t,angleOffset:i,colors:s,idPrefix:a}){for(let r=0;r<e;r+=1){const o=i+r/e*Math.PI*2,l=s[r],c={x:Math.cos(o)*t,y:Hn.COIN_VISUAL_Y,z:Math.sin(o)*t};this.createCoin({id:`${a}-${l}-coin-${r+1}`,color:l,position:c})}}createQueen(){const e={x:0,y:Hn.QUEEN_VISUAL_Y,z:0};this.createCoin({id:"queen-red-1",color:"red",type:"queen",position:e})}createStriker(){const e={x:0,y:Hn.STRIKER_VISUAL_Y,z:H.BASELINE_OFFSET},t=new Yt;t.name="striker-piece",t.position.set(e.x,e.y,e.z);const i=new Ve(this.strikerGeometry,this.materialLibrary.get("striker"));i.name="striker-body",i.castShadow=!0,i.receiveShadow=!0,t.add(i);const s=new Ve(this.strikerRingGeometry,this.materialLibrary.get("strikerRing"));s.name="striker-top-ring",s.rotation.x=Math.PI/2,s.position.y=H.STRIKER_HEIGHT/2+.009,t.add(s);const a=new Ve(new yn(H.STRIKER_RADIUS*.42,.01,8,48),this.materialLibrary.get("pocketRim"));a.name="striker-inner-ring",a.rotation.x=Math.PI/2,a.position.y=H.STRIKER_HEIGHT/2+.013,t.add(a);const r=new Ve(new Di(H.STRIKER_RADIUS*1.55,48),this.materialLibrary.get("strikerGlow"));r.name="striker-soft-glow",r.rotation.x=-Math.PI/2,r.position.y=-.085/2-.006,r.renderOrder=4,t.add(r);const o=this.createMetadata({id:"striker-1",type:"striker",color:"striker",position:e,mesh:t});t.userData.carrom={id:o.id,type:o.type,color:o.color,isPocketed:!1},this.group.add(t),this.pieces.push(o)}createCoin({id:e,color:t,type:i="coin",position:s}){const a=new Yt;a.name=e,a.position.set(s.x,s.y,s.z);const r=this.getCoinBodyMaterial(t),o=this.getCoinRimMaterial(t),l=new Ve(this.coinGeometry,r);l.name=`${e}-body`,l.castShadow=!0,l.receiveShadow=!0,a.add(l);const c=new Ve(this.coinRingGeometry,o);c.name=`${e}-top-rim`,c.rotation.x=Math.PI/2,c.position.y=H.COIN_HEIGHT/2+.008,a.add(c);const h=new Ve(new Di(H.COIN_RADIUS*.46,32),this.highlightMaterial);h.name=`${e}-top-highlight`,h.rotation.x=-Math.PI/2,h.position.set(-.145*.18,H.COIN_HEIGHT/2+.011,-.145*.1),h.renderOrder=6,a.add(h);const u=new Ve(this.shadowGeometry,this.materialLibrary.get("softShadow"));u.name=`${e}-soft-shadow`,u.rotation.x=-Math.PI/2,u.scale.set(.7,.7,1),u.position.y=-.075/2-.008,u.renderOrder=2,a.add(u);const p=this.createMetadata({id:e,type:i,color:t,position:s,mesh:a});a.userData.carrom={id:p.id,type:p.type,color:p.color,isPocketed:!1},this.group.add(a),this.pieces.push(p)}getCoinBodyMaterial(e){return e==="red"?this.materialLibrary.get("queen"):this.materialLibrary.get(e==="white"?"whiteCoin":"blackCoin")}getCoinRimMaterial(e){return e==="red"?this.materialLibrary.get("queenRim"):this.materialLibrary.get(e==="white"?"whiteCoinRim":"blackCoinRim")}createMetadata({id:e,type:t,color:i,position:s,mesh:a}){return{id:e,type:t,color:i,radius:t==="striker"?H.STRIKER_RADIUS:H.COIN_RADIUS,initialPosition:{...s},visualY:s.y,mesh:a,isPocketed:!1}}dispose(){this.coinGeometry.dispose(),this.strikerGeometry.dispose(),this.coinRingGeometry.dispose(),this.strikerRingGeometry.dispose(),this.shadowGeometry.dispose(),this.highlightMaterial.dispose()}}class eS{constructor({onShotStarted:e,onPiecePocketed:t,onShotSettled:i}={}){this.onShotStarted=e,this.onPiecePocketed=t,this.onShotSettled=i,this.isShotActive=!1,this.pocketedThisShot=[],this.lastMoving=!1}update({anyMoving:e,allSleeping:t}){if(e&&!this.isShotActive&&(this.isShotActive=!0,this.pocketedThisShot=[],this.onShotStarted?.()),this.isShotActive&&!e&&t){const i={pocketed:[...this.pocketedThisShot],pocketedCount:this.pocketedThisShot.length,strikerPocketed:this.pocketedThisShot.some(s=>s.type==="striker"),queenPocketed:this.pocketedThisShot.some(s=>s.type==="queen"),coinPocketedIds:this.pocketedThisShot.filter(s=>s.type==="coin").map(s=>s.id)};this.isShotActive=!1,this.onShotSettled?.(i)}this.lastMoving=e}recordPocketed(e){const t={id:e.id,type:e.type,color:e.color,pocketId:e.pocketId,pocketPosition:e.pocketTarget?{...e.pocketTarget}:{x:e.position.x,z:e.position.z}};if(this.isShotActive){if(this.pocketedThisShot.some(i=>i.id===t.id))return;this.pocketedThisShot.push(t)}this.onPiecePocketed?.(t)}reset(){this.isShotActive=!1,this.pocketedThisShot=[],this.lastMoving=!1}}const Ue={FIXED_TIMESTEP:1/120,MAX_SUBSTEPS:6,COIN_MASS:1,STRIKER_MASS:2.4,COIN_RESTITUTION:.91,STRIKER_RESTITUTION:.89,WALL_RESTITUTION:.8,LINEAR_DAMPING:1.5,STOP_SPEED_THRESHOLD:.025,SLEEP_FRAMES_REQUIRED:18,MIN_VELOCITY_CUTOFF:.006,MAX_SHOT_SPEED_DEV_TEST:14.4,MAX_BODY_SPEED:17,COLLISION_EVENT_MIN_SPEED:.18,POCKET_CAPTURE_RADIUS:.21,POCKET_HALF_ENTRY_RATIO:.5,POCKET_PULL_RADIUS:.38,POCKET_PULL_STRENGTH:5.15,POCKET_REMOVE_DELAY:160,BOARD_BOUNDS:{minX:-5.34/2,maxX:H.PLAY_AREA_SIZE/2,minZ:-5.34/2,maxZ:H.PLAY_AREA_SIZE/2}},tS=1e-6;class iS{constructor({pocketDetector:e,onCollision:t}){this.pocketDetector=e,this.onCollision=t}resolveBodies(e){for(let t=0;t<e.length-1;t+=1){const i=e[t];if(!i.isPocketed)for(let s=t+1;s<e.length;s+=1){const a=e[s];a.isPocketed||this.resolvePair(i,a)}}}resolvePair(e,t){const i=t.position.x-e.position.x,s=t.position.z-e.position.z,a=e.radius+t.radius,r=i*i+s*s;if(r<=tS||r>=a*a)return!1;const o=Math.sqrt(r),l=i/o,c=s/o,h=a-o,u=e.invMass+t.invMass;if(u>0){const b=h/u;e.position.x-=l*b*e.invMass,e.position.z-=c*b*e.invMass,t.position.x+=l*b*t.invMass,t.position.z+=c*b*t.invMass}const p=t.velocity.x-e.velocity.x,f=t.velocity.z-e.velocity.z,g=p*l+f*c;if(e.wake(),t.wake(),g>0)return!0;const v=Math.abs(g),d=-(1+Math.min(e.restitution,t.restitution))*g/u,E=d*l,M=d*c;return e.velocity.x-=E*e.invMass,e.velocity.z-=M*e.invMass,t.velocity.x+=E*t.invMass,t.velocity.z+=M*t.invMass,v>=Ue.COLLISION_EVENT_MIN_SPEED&&this.onCollision?.({bodyA:e,bodyB:t,position:{x:e.position.x+i*.5,z:e.position.z+s*.5},relativeSpeed:v,intensity:Math.min(v/Ue.MAX_BODY_SPEED,1)}),!0}resolveRails(e){if(e.isPocketed||this.pocketDetector.isNearPocket(e))return;const t=Ue.BOARD_BOUNDS,i=t.minX+e.radius,s=t.maxX-e.radius,a=t.minZ+e.radius,r=t.maxZ-e.radius,o={x:e.velocity.x,z:e.velocity.z};let l=0,c=!1;e.position.x<i?(e.position.x=i,e.velocity.x=Math.abs(e.velocity.x)*Ue.WALL_RESTITUTION,l=Math.max(l,Math.abs(o.x)),c=!0):e.position.x>s&&(e.position.x=s,e.velocity.x=-Math.abs(e.velocity.x)*Ue.WALL_RESTITUTION,l=Math.max(l,Math.abs(o.x)),c=!0),e.position.z<a?(e.position.z=a,e.velocity.z=Math.abs(e.velocity.z)*Ue.WALL_RESTITUTION,l=Math.max(l,Math.abs(o.z)),c=!0):e.position.z>r&&(e.position.z=r,e.velocity.z=-Math.abs(e.velocity.z)*Ue.WALL_RESTITUTION,l=Math.max(l,Math.abs(o.z)),c=!0),c&&(e.wake(),l>=Ue.COLLISION_EVENT_MIN_SPEED&&this.onCollision?.({bodyA:e,bodyB:{id:"rail",type:"rail"},position:{x:e.position.x,z:e.position.z},relativeSpeed:l,intensity:Math.min(l/Ue.MAX_BODY_SPEED,1)}))}}function nS(n){return Number.isFinite(n.visualY)?n.visualY:n.type==="striker"?Hn.STRIKER_VISUAL_Y:n.type==="queen"?Hn.QUEEN_VISUAL_Y:Hn.COIN_VISUAL_Y}class sS{constructor(e){const t=e.type==="striker",i=t?Ue.STRIKER_RESTITUTION:Ue.COIN_RESTITUTION,s=e.radius||(t?H.STRIKER_RADIUS:H.COIN_RADIUS),a=nS(e);this.id=e.id,this.type=e.type,this.color=e.color,this.radius=s,this.mass=t?Ue.STRIKER_MASS:Ue.COIN_MASS,this.invMass=this.mass>0?1/this.mass:0,this.restitution=i,this.damping=Ue.LINEAR_DAMPING,this.position={x:e.initialPosition.x,z:e.initialPosition.z},this.velocity={x:0,z:0},this.initialPosition={...e.initialPosition,y:a},this.lastSafePosition={x:e.initialPosition.x,z:e.initialPosition.z},this.mesh=e.mesh,this.meshId=e.mesh?.name||e.id,this.visualY=a,this.isPocketed=!1,this.isSleeping=!0,this.sleepFrames=0,this.pocketId="",this.pocketedElapsed=0,this.pocketTarget=null,this.spin={y:0},this.lastFlatWarningTime=0,this.scenarioHidden=!1}applyImpulse(e){this.isPocketed||(this.velocity.x+=e.x*this.invMass,this.velocity.z+=e.z*this.invMass,this.wake())}wake(){this.isPocketed||(this.isSleeping=!1,this.sleepFrames=0)}markPocketed(e){return this.isPocketed?!1:(this.isPocketed=!0,this.isSleeping=!0,this.pocketId=e.id,this.pocketTarget=e.position,this.pocketedElapsed=0,this.velocity.x=0,this.velocity.z=0,!0)}reset(){this.position.x=this.initialPosition.x,this.position.z=this.initialPosition.z,this.velocity.x=0,this.velocity.z=0,this.isPocketed=!1,this.isSleeping=!0,this.sleepFrames=0,this.pocketId="",this.pocketTarget=null,this.pocketedElapsed=0,this.scenarioHidden=!1,this.spin.y=0,this.lastSafePosition.x=this.initialPosition.x,this.lastSafePosition.z=this.initialPosition.z,this.mesh&&(this.mesh.visible=!0,this.mesh.position.set(this.initialPosition.x,this.visualY,this.initialPosition.z),this.mesh.rotation.set(0,0,0),this.mesh.scale.set(1,1,1),this.mesh.userData.carrom&&(this.mesh.userData.carrom.isPocketed=!1))}speedSq(){return this.velocity.x*this.velocity.x+this.velocity.z*this.velocity.z}isMoving(e=Ue.STOP_SPEED_THRESHOLD){return!this.isPocketed&&this.speedSq()>e*e}}class aS{constructor({pockets:e,onPocketed:t}){this.pockets=e,this.onPocketed=t}updateBody(e,t){if(e.isPocketed){e.pocketedElapsed+=t;return}const i=this.getNearestPocket(e);if(i){if(i.distance<=this.getCaptureRadius(e)){e.markPocketed(i)&&(e.position.x=i.position.x,e.position.z=i.position.z,e.mesh?.userData?.carrom&&(e.mesh.userData.carrom.isPocketed=!0),this.onPocketed?.(e,i));return}if(i.distance<=this.getPullRadius(e)){const s=Ue.POCKET_PULL_STRENGTH*t;e.velocity.x+=i.normalX*s,e.velocity.z+=i.normalZ*s,e.wake()}}}isNearPocket(e){return!!this.getNearestPocket(e,this.getRailBypassRadius(e))}getCaptureRadius(e){const t=Math.min(Math.max(Ue.POCKET_HALF_ENTRY_RATIO,.1),.9);return Math.max(Ue.POCKET_CAPTURE_RADIUS*.45,H.POCKET_RADIUS-e.radius*t)}getPullRadius(e){return Math.max(this.getCaptureRadius(e)+e.radius*.75,Ue.POCKET_PULL_RADIUS)}getRailBypassRadius(e){return Math.max(this.getCaptureRadius(e)+e.radius*.45,H.POCKET_RADIUS+e.radius*.15)}getNearestPocket(e,t=Ue.POCKET_PULL_RADIUS){let i=null;return this.pockets.forEach(s=>{const a=s.position.x-e.position.x,r=s.position.z-e.position.z,o=a*a+r*r;if(o>t*t)return;const l=Math.sqrt(o)||1e-4;(!i||l<i.distance)&&(i={...s,distance:l,normalX:a/l,normalZ:r/l})}),i}}class rS{constructor({pieces:e,pockets:t,onShotStarted:i,onPiecePocketed:s,onShotSettled:a,onStatus:r,onCollision:o,debugPhysics:l=!1}){this.bodies=e.map(c=>new sS(c)),this.bodyMap=new Map(this.bodies.map(c=>[c.id,c])),this.accumulator=0,this.totalTime=0,this.onStatus=r,this.debugPhysics=l,this.shotResolver=new eS({onShotStarted:i,onPiecePocketed:s,onShotSettled:a}),this.pocketDetector=new aS({pockets:t,onPocketed:c=>this.handlePocketed(c)}),this.collisionResolver=new iS({pocketDetector:this.pocketDetector,onCollision:o}),this.syncMeshes()}update(e){const t=Math.min(Math.max(e,0),.08);this.accumulator+=t;let i=0;for(;this.accumulator>=Ue.FIXED_TIMESTEP&&i<Ue.MAX_SUBSTEPS;)this.step(Ue.FIXED_TIMESTEP),this.accumulator-=Ue.FIXED_TIMESTEP,i+=1;i===Ue.MAX_SUBSTEPS&&(this.accumulator=0),this.syncMeshes(),this.shotResolver.update(this.getMotionState())}step(e){this.totalTime+=e,this.bodies.forEach(t=>{if(this.sanitizeBody(t),t.isPocketed){this.pocketDetector.updateBody(t,e);return}this.integrateBody(t,e),this.sanitizeBody(t),this.pocketDetector.updateBody(t,e)}),this.bodies.forEach(t=>this.collisionResolver.resolveRails(t)),this.collisionResolver.resolveBodies(this.bodies),this.bodies.forEach(t=>this.sanitizeBody(t)),this.bodies.forEach(t=>this.updateSleep(t))}integrateBody(e,t){if(e.isSleeping)return;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t;const i=Math.exp(-e.damping*t);e.velocity.x*=i,e.velocity.z*=i}updateSleep(e){if(e.isPocketed)return;const t=e.speedSq();if(t<=Ue.MIN_VELOCITY_CUTOFF*Ue.MIN_VELOCITY_CUTOFF&&(e.velocity.x=0,e.velocity.z=0),t<=Ue.STOP_SPEED_THRESHOLD*Ue.STOP_SPEED_THRESHOLD){e.sleepFrames+=1,e.sleepFrames>=Ue.SLEEP_FRAMES_REQUIRED&&(e.isSleeping=!0,e.velocity.x=0,e.velocity.z=0);return}e.isSleeping=!1,e.sleepFrames=0}syncMeshes(){this.bodies.forEach(e=>{if(this.sanitizeBody(e),!e.mesh)return;if(e.scenarioHidden){e.mesh.visible=!1;return}if(e.isPocketed){const i=Ue.POCKET_REMOVE_DELAY/1e3,s=Math.min(e.pocketedElapsed/i,1),a=e.pocketTarget||{x:e.position.x,z:e.position.z};e.mesh.position.x+=(a.x-e.mesh.position.x)*.35,e.mesh.position.z+=(a.z-e.mesh.position.z)*.35,e.mesh.position.y=e.visualY-s*.22,this.lockFlatRotation(e.mesh,e.spin.y);const r=Math.max(.2,1-s*.8);e.mesh.scale.set(r,r,r),e.mesh.visible=s<1;return}this.validateFlatInvariant(e),e.mesh.visible=!0,e.mesh.position.set(e.position.x,e.visualY,e.position.z),e.mesh.scale.set(1,1,1);const t=Math.sqrt(e.speedSq());t>.01&&(e.spin.y+=t*.018),this.lockFlatRotation(e.mesh,e.spin.y),e.lastSafePosition.x=e.position.x,e.lastSafePosition.z=e.position.z})}sanitizeBody(e){let t=!1;const i=Number.isFinite(e.lastSafePosition?.x)?e.lastSafePosition.x:e.initialPosition.x,s=Number.isFinite(e.lastSafePosition?.z)?e.lastSafePosition.z:e.initialPosition.z;Number.isFinite(e.position.x)||(e.position.x=i,t=!0),Number.isFinite(e.position.z)||(e.position.z=s,t=!0),Number.isFinite(e.velocity.x)||(e.velocity.x=0,t=!0),Number.isFinite(e.velocity.z)||(e.velocity.z=0,t=!0);const a=e.speedSq(),r=Ue.MAX_BODY_SPEED*Ue.MAX_BODY_SPEED;if(!Number.isFinite(a))e.velocity.x=0,e.velocity.z=0,t=!0;else if(a>r){const o=Ue.MAX_BODY_SPEED/Math.sqrt(a);e.velocity.x*=o,e.velocity.z*=o,t=!0}!e.isPocketed&&!t&&(e.lastSafePosition.x=e.position.x,e.lastSafePosition.z=e.position.z),t&&this.debugPhysics&&this.warnFlatCorrection(e,"corrected invalid or excessive physics values")}lockFlatRotation(e,t=0){e.rotation.x=0,e.rotation.y=Number.isFinite(t)?t:0,e.rotation.z=0}validateFlatInvariant(e){if(!this.debugPhysics||!e.mesh||e.isPocketed)return;const t=Math.abs(e.mesh.position.y-e.visualY)>5e-4,i=Math.abs(e.mesh.rotation.x)>5e-4||Math.abs(e.mesh.rotation.z)>5e-4;(t||i)&&this.warnFlatCorrection(e,"active piece visual drift or tilt corrected")}warnFlatCorrection(e,t){const i=typeof performance<"u"?performance.now():Date.now();i-e.lastFlatWarningTime<750||(e.lastFlatWarningTime=i,console.warn("[Carrom3D physics]",t,{id:e.id,expectedY:e.visualY,position:{...e.position},velocity:{...e.velocity},rotation:e.mesh?{x:e.mesh.rotation.x,y:e.mesh.rotation.y,z:e.mesh.rotation.z}:null}))}applyDevTestShot(){const e=this.getStrikerBody();if(!e)return!1;const t=this.getNormalizedVector({x:-e.position.x,z:-e.position.z}),i=this.applyStrikerShot(t,Ue.MAX_SHOT_SPEED_DEV_TEST);return i&&this.onStatus?.("Debug impulse running..."),i}applyStrikerShot(e,t){if(!this.canAcceptShot())return!1;const i=this.getStrikerBody(),s=this.getNormalizedVector(e),a=Math.min(Math.max(t,0),Ue.MAX_SHOT_SPEED_DEV_TEST);return!i||a<=0?!1:(i.velocity.x=s.x*a,i.velocity.z=s.z*a,i.wake(),this.shotResolver.update({anyMoving:!0,allSleeping:!1}),this.onStatus?.("Shot in motion."),!0)}canAcceptShot(){const e=this.getStrikerBody();return!!(e&&!e.isPocketed&&!this.getMotionState().anyMoving)}getBody(e){return this.bodyMap.get(e)||null}getStrikerBody(){return this.getBody("striker-1")}getActiveBodies({includeStriker:e=!0}={}){return this.bodies.filter(t=>t.isPocketed?!1:e||t.type!=="striker")}setStrikerPosition(e,t){if(this.getMotionState().anyMoving)return!1;const i=this.getStrikerBody();if(!i)return!1;const s=-5.34/2+i.radius,a=H.PLAY_AREA_SIZE/2-i.radius;return i.position.x=Math.min(Math.max(e,s),a),i.position.z=Math.min(Math.max(t,s),a),i.velocity.x=0,i.velocity.z=0,i.isPocketed=!1,i.isSleeping=!0,i.sleepFrames=0,i.pocketId="",i.pocketTarget=null,i.pocketedElapsed=0,i.scenarioHidden=!1,i.spin.y=0,i.lastSafePosition.x=i.position.x,i.lastSafePosition.z=i.position.z,i.mesh&&(i.mesh.visible=!0,i.mesh.scale.set(1,1,1),i.mesh.rotation.set(0,0,0),i.mesh.userData.carrom&&(i.mesh.userData.carrom.isPocketed=!1)),this.syncMeshes(),!0}setBodyPosition(e,t={},{visible:i=!0,pocketed:s=!1}={}){const a=this.getBody(e);if(!a||!Number.isFinite(t.x)||!Number.isFinite(t.z))return!1;const r=Ue.BOARD_BOUNDS,o=a.radius+.02;return a.position.x=Math.min(Math.max(t.x,r.minX+o),r.maxX-o),a.position.z=Math.min(Math.max(t.z,r.minZ+o),r.maxZ-o),a.velocity.x=0,a.velocity.z=0,a.isPocketed=!!s,a.isSleeping=!0,a.sleepFrames=0,a.pocketId="",a.pocketTarget=null,a.pocketedElapsed=0,a.scenarioHidden=!!(s&&!i),a.spin.y=0,a.lastSafePosition.x=a.position.x,a.lastSafePosition.z=a.position.z,a.mesh&&(a.mesh.visible=!!i,a.mesh.scale.set(1,1,1),a.mesh.position.set(a.position.x,a.visualY,a.position.z),a.mesh.rotation.set(0,0,0),a.mesh.userData.carrom&&(a.mesh.userData.carrom.isPocketed=!!s)),!0}applyBodySnapshot(e={}){const t=this.getBody(e.id);if(!t)return!1;const i=e.position||e,s=e.velocity||e,a=Number(i.x),r=Number(i.z),o=Number(s.vx??s.x??0),l=Number(s.vz??s.z??0);return!Number.isFinite(a)||!Number.isFinite(r)?!1:(t.position.x=a,t.position.z=r,t.velocity.x=Number.isFinite(o)?o:0,t.velocity.z=Number.isFinite(l)?l:0,t.isPocketed=!!e.isPocketed,t.isSleeping=e.isSleeping!==void 0?!!e.isSleeping:!0,t.sleepFrames=t.isSleeping?Ue.SLEEP_FRAMES_REQUIRED:0,t.pocketId=e.pocketId||"",t.pocketTarget=e.pocketTarget||null,t.pocketedElapsed=t.isPocketed?Ue.POCKET_REMOVE_DELAY/1e3:0,t.scenarioHidden=!!e.scenarioHidden,t.spin.y=Number.isFinite(e.spinY)?e.spinY:0,t.lastSafePosition.x=t.position.x,t.lastSafePosition.z=t.position.z,t.mesh&&(t.mesh.visible=!t.isPocketed&&!t.scenarioHidden,t.mesh.scale.set(1,1,1),t.mesh.position.set(t.position.x,t.visualY,t.position.z),t.mesh.rotation.set(0,t.spin.y,0),t.mesh.userData.carrom&&(t.mesh.userData.carrom.isPocketed=t.isPocketed)),!0)}applyBoardSnapshot(e={}){return(Array.isArray(e.bodies)?e.bodies:Array.isArray(e.pieces)?e.pieces:[]).forEach(i=>this.applyBodySnapshot(i)),this.accumulator=0,this.shotResolver.reset(),this.syncMeshes(),this.getBoardSnapshot()}hideBodyForScenario(e){const t=this.getBody(e);return t?this.setBodyPosition(e,t.position,{visible:!1,pocketed:!0}):!1}resetVelocities(){this.bodies.forEach(e=>{e.velocity.x=0,e.velocity.z=0,e.isSleeping=!0,e.sleepFrames=0}),this.syncMeshes()}applyTrainingScenario(e={}){this.accumulator=0,this.totalTime=0,this.shotResolver.reset(),this.bodies.forEach(i=>i.reset());const t=Array.isArray(e.activePieceIds)?new Set(e.activePieceIds):null;t&&this.bodies.forEach(i=>{t.has(i.id)||this.hideBodyForScenario(i.id)}),Object.entries(e.placements||{}).forEach(([i,s])=>{this.setBodyPosition(i,s,{visible:!0,pocketed:!1})}),e.striker&&this.setBodyPosition("striker-1",e.striker,{visible:!0,pocketed:!1}),this.resetVelocities(),this.onStatus?.(e.objectiveText||"Scenario ready.")}clearTrainingScenario(){this.reset()}resetStrikerToBaseline(e={}){return this.setStrikerPosition(e.x??0,e.z??H.BASELINE_OFFSET)}returnBodyToBoard(e,t=null){const i=this.getBody(e);if(!i)return null;const s=this.findSafeReturnPosition(i,t);return i.position.x=s.x,i.position.z=s.z,i.velocity.x=0,i.velocity.z=0,i.isPocketed=!1,i.isSleeping=!0,i.sleepFrames=0,i.pocketId="",i.pocketTarget=null,i.pocketedElapsed=0,i.scenarioHidden=!1,i.spin.y=0,i.lastSafePosition.x=s.x,i.lastSafePosition.z=s.z,i.mesh&&(i.mesh.visible=!0,i.mesh.scale.set(1,1,1),i.mesh.rotation.set(0,0,0),i.mesh.userData.carrom&&(i.mesh.userData.carrom.isPocketed=!1)),this.syncMeshes(),{id:i.id,type:i.type,color:i.color,position:s}}findSafeReturnPosition(e,t=null){return this.createReturnCandidates(t).find(a=>this.isReturnPositionSafe(e,a))||{x:0,z:0}}createReturnCandidates(e=null){const t=[];return e&&Number.isFinite(e.x)&&Number.isFinite(e.z)&&t.push({x:e.x,z:e.z}),t.push({x:0,z:0}),[.34,.52,.72,.94,1.18,1.42].forEach((s,a)=>{const r=8+a*4;for(let o=0;o<r;o+=1){const l=o/r*Math.PI*2+a*.18;t.push({x:Math.cos(l)*s,z:Math.sin(l)*s})}}),t}isReturnPositionSafe(e,t){const i=Ue.BOARD_BOUNDS,s=e.radius+.04;if(t.x<i.minX+s||t.x>i.maxX-s||t.z<i.minZ+s||t.z>i.maxZ-s)return!1;const a=Ue.POCKET_PULL_RADIUS+e.radius;return this.pocketDetector.pockets.some(o=>{const l=o.position.x-t.x,c=o.position.z-t.z;return l*l+c*c<a*a})?!1:!this.getActiveBodies({includeStriker:!0}).some(o=>{if(o.id===e.id)return!1;const l=o.position.x-t.x,c=o.position.z-t.z,h=o.radius+e.radius+.035;return l*l+c*c<h*h})}isCircleOverlapping(e,t,i,s=""){return this.getActiveBodies({includeStriker:!0}).some(a=>{if(a.id===s)return!1;const r=a.position.x-e,o=a.position.z-t,l=a.radius+i;return r*r+o*o<l*l})}reset(){this.accumulator=0,this.totalTime=0,this.bodies.forEach(e=>e.reset()),this.shotResolver.reset(),this.syncMeshes(),this.onStatus?.("Physics reset. Ready for striker placement.")}getMotionState(){const e=this.bodies.filter(s=>!s.isPocketed),t=e.some(s=>s.isMoving()),i=e.every(s=>s.isSleeping);return{anyMoving:t,allSleeping:i,movingCount:e.filter(s=>s.isMoving()).length,sleepingCount:e.filter(s=>s.isSleeping).length,pocketedCount:this.bodies.length-e.length}}getSummary(){return{totalBodies:this.bodies.length,activeBodies:this.bodies.filter(e=>!e.isPocketed).length,pocketedBodies:this.bodies.filter(e=>e.isPocketed).length,strikerReady:!!(this.bodyMap.get("striker-1")&&!this.bodyMap.get("striker-1").isPocketed),...this.getMotionState()}}getBoardSnapshot(){const e=i=>({id:i?.id||"",type:i?.type||"",color:i?.color||"",radius:i?.radius||0,mass:i?.mass||0,x:i?.position?.x||0,z:i?.position?.z||0,vx:i?.velocity?.x||0,vz:i?.velocity?.z||0,position:{x:i?.position?.x||0,z:i?.position?.z||0},velocity:{x:i?.velocity?.x||0,z:i?.velocity?.z||0},isPocketed:!!i?.isPocketed,isSleeping:!!i?.isSleeping}),t=this.bodies.map(e);return{bodies:t,activeBodies:t.filter(i=>!i.isPocketed),striker:e(this.getStrikerBody()),pockets:this.pocketDetector.pockets.map(i=>({id:i.id,position:{x:i.position.x,z:i.position.z},radius:H.POCKET_RADIUS})),bounds:{...Ue.BOARD_BOUNDS},motion:this.getMotionState()}}handlePocketed(e){this.shotResolver.recordPocketed(e)}getNormalizedVector(e){const t=Math.hypot(e.x,e.z)||1;return{x:e.x/t,z:e.z/t}}dispose(){this.bodies.length=0,this.bodyMap.clear()}}const sa=H.SURFACE_Y+.052,oS=H.SURFACE_Y+.032;class lS{constructor({parent:e,theme:t}){this.parent=e,this.theme=t,this.group=new Yt,this.group.name="premium-aim-line-layer",this.group.visible=!1,this.placementGroup=new Yt,this.placementGroup.name="striker-placement-feedback",this.placementGroup.visible=!1,this.linePositions=new Float32Array(6),this.lineGeometry=new Gt,this.lineGeometry.setAttribute("position",new oi(this.linePositions,3)),this.lineMaterial=new xh({color:t.scene.goldTrim,transparent:!0,opacity:.92,depthWrite:!1}),this.line=new Kp(this.lineGeometry,this.lineMaterial),this.line.renderOrder=30,this.group.add(this.line),this.dotMaterial=new Rt({color:t.scene.strikerGlow,transparent:!0,opacity:.72,depthWrite:!1}),this.invalidMaterial=new Rt({color:t.scene.queen,transparent:!0,opacity:.72,depthWrite:!1}),this.endpointMaterial=new Rt({color:t.scene.goldTrim,transparent:!0,opacity:.9,depthWrite:!1}),this.endpoint=new Ve(new Di(.055,32),this.endpointMaterial),this.endpoint.name="aim-line-endpoint",this.endpoint.rotation.x=-Math.PI/2,this.endpoint.renderOrder=31,this.group.add(this.endpoint),this.dots=Array.from({length:5},(i,s)=>{const a=new Ve(new Di(.026,20),this.dotMaterial);return a.name=`aim-line-power-dot-${s+1}`,a.rotation.x=-Math.PI/2,a.renderOrder=31,this.group.add(a),a}),this.placementRingMaterial=new Rt({color:t.scene.strikerGlow,transparent:!0,opacity:.72,depthWrite:!1}),this.placementInvalidMaterial=new Rt({color:t.scene.queen,transparent:!0,opacity:.78,depthWrite:!1}),this.placementRing=new Ve(new yn(H.STRIKER_RADIUS+.035,.012,10,72),this.placementRingMaterial),this.placementRing.name="striker-placement-ring",this.placementRing.rotation.x=Math.PI/2,this.placementRing.renderOrder=32,this.placementGroup.add(this.placementRing),this.parent?.add(this.group),this.parent?.add(this.placementGroup)}showAim({start:e,direction:t,powerRatio:i,valid:s=!0}){if(!e||!t){this.hideAim();return}const a=Math.min(Math.max(i,0),1),r=.48+a*2.25,o={x:e.x+t.x*r,z:e.z+t.z*r};this.linePositions[0]=e.x,this.linePositions[1]=sa,this.linePositions[2]=e.z,this.linePositions[3]=o.x,this.linePositions[4]=sa,this.linePositions[5]=o.z,this.lineGeometry.attributes.position.needsUpdate=!0;const l=s?this.dotMaterial:this.invalidMaterial;this.lineMaterial.color.copy(l.color),this.lineMaterial.opacity=s?.92:.78,this.endpoint.material=l,this.endpoint.position.set(o.x,sa+.004,o.z),this.endpoint.scale.setScalar(.9+a*1.15),this.dots.forEach((c,h)=>{const u=(h+1)/(this.dots.length+1);c.material=l,c.position.set(e.x+(o.x-e.x)*u,sa+.003,e.z+(o.z-e.z)*u),c.scale.setScalar(.7+a*.7),c.visible=a>h*.14}),this.group.visible=!0}hideAim(){this.group.visible=!1}showPlacement(e,t=!0){if(!e){this.hidePlacement();return}this.placementRing.material=t?this.placementRingMaterial:this.placementInvalidMaterial,this.placementRing.position.set(e.x,oS,e.z),this.placementGroup.visible=!0}hidePlacement(){this.placementGroup.visible=!1}hide(){this.hideAim(),this.hidePlacement()}applyTheme(e){this.theme=e,this.lineMaterial.color.set(e.scene.goldTrim),this.dotMaterial.color.set(e.scene.strikerGlow),this.endpointMaterial.color.set(e.scene.goldTrim),this.placementRingMaterial.color.set(e.scene.strikerGlow),this.invalidMaterial.color.set(e.scene.queen),this.placementInvalidMaterial.color.set(e.scene.queen)}dispose(){this.parent?.remove(this.group),this.parent?.remove(this.placementGroup),this.lineGeometry.dispose(),this.lineMaterial.dispose(),this.dotMaterial.dispose(),this.invalidMaterial.dispose(),this.endpointMaterial.dispose(),this.placementRingMaterial.dispose(),this.placementInvalidMaterial.dispose(),this.endpoint.geometry.dispose(),this.dots.forEach(e=>e.geometry.dispose()),this.placementRing.geometry.dispose()}}function _r(n,e,t){return Math.min(Math.max(n,e),t)}class cS{constructor({physicsWorld:e,aimLineRenderer:t,onPowerChange:i}){this.physicsWorld=e,this.aimLineRenderer=t,this.onPowerChange=i,this.reset()}begin(){this.reset();const e=this.physicsWorld?.getStrikerBody();return e?(this.startPosition={x:e.position.x,z:e.position.z},this.active=!0,this.emitPower(0,"Pull to aim"),!0):!1}update(e,t=!0){if(!this.active||!e||!this.startPosition)return this.getAimState();const i=e.x-this.startPosition.x,s=e.z-this.startPosition.z,a=Math.hypot(i,s),r=_r(a,0,st.AIM_DRAG_MAX_DISTANCE),o=_r(r*st.POWER_SCALE,0,st.MAX_SHOT_POWER),l=o/st.MAX_SHOT_POWER;let c={x:0,z:-1};a>1e-4&&(c={x:-i/a,z:-s/a}),this.dragDistance=a,this.power=o,this.powerRatio=l,this.direction=c,this.aimLineRenderer?.showAim({start:this.startPosition,direction:c,powerRatio:l,valid:t&&o>=st.MIN_SHOT_POWER});const h=o<st.MIN_SHOT_POWER?"Too soft":`${Math.round(l*100)}%`;return this.emitPower(l,h),this.getAimState()}release(e=!0,{applyShot:t=!0}={}){const i=this.getAimState();if(this.cancel(),!e)return{fired:!1,reason:"invalid-placement",...i};if(i.power<st.MIN_SHOT_POWER||i.dragDistance<st.AIM_CANCEL_DISTANCE)return{fired:!1,reason:"cancelled",...i};if(!t)return{fired:!0,deferred:!0,reason:"deferred",...i};const s=this.physicsWorld?.applyStrikerShot(i.direction,i.power)||!1;return{fired:s,reason:s?"":"blocked",...i}}cancel(){this.aimLineRenderer?.hideAim(),this.emitPower(0,"Ready"),this.reset()}reset(){this.active=!1,this.startPosition=null,this.dragDistance=0,this.power=0,this.powerRatio=0,this.direction={x:0,z:-1}}getAimState(){return{active:this.active,strikerPosition:this.startPosition?{...this.startPosition}:null,dragDistance:this.dragDistance,power:this.power,powerRatio:this.powerRatio,direction:{...this.direction}}}emitPower(e,t){this.onPowerChange?.({ratio:_r(e,0,1),label:t})}}class hS{constructor({canvas:e,camera:t,surfaceY:i=H.SURFACE_Y}){this.canvas=e,this.camera=t,this.surfaceY=i,this.raycaster=new lf,this.ndc=new Xe,this.boardPlane=new Vi(new L(0,1,0),-i),this.hitPoint=new L}getBoardPoint(e){if(!this.canvas||!this.camera)return null;const t=this.canvas.getBoundingClientRect();return!t.width||!t.height||(this.ndc.x=(e.clientX-t.left)/t.width*2-1,this.ndc.y=-((e.clientY-t.top)/t.height*2-1),this.boardPlane.constant=-this.surfaceY,this.raycaster.setFromCamera(this.ndc,this.camera),!this.raycaster.ray.intersectPlane(this.boardPlane,this.hitPoint))?null:{x:this.hitPoint.x,y:this.hitPoint.y,z:this.hitPoint.z}}}const uS=new Set(["bottom","top","left","right"]);function aa(n,e,t){return Math.min(Math.max(n,e),t)}class dS{constructor({physicsWorld:e,aimLineRenderer:t}){this.physicsWorld=e,this.aimLineRenderer=t,this.activeBaseline=st.ACTIVE_BASELINE,this.lastPlacement=this.getDefaultPosition()}setActiveBaseline(e){return this.activeBaseline=uS.has(e)?e:st.ACTIVE_BASELINE,this.activeBaseline}getBaselinePlacementRange(e=this.activeBaseline){const t=-1.55+H.STRIKER_RADIUS,i=H.BASELINE_HALF_LENGTH-H.STRIKER_RADIUS,s=H.BASELINE_OFFSET;return e==="top"?{axis:"x",minX:t,maxX:i,minZ:-s,maxZ:-s,fixedZ:-s}:e==="left"?{axis:"z",minX:-s,maxX:-s,fixedX:-s,minZ:t,maxZ:i}:e==="right"?{axis:"z",minX:s,maxX:s,fixedX:s,minZ:t,maxZ:i}:{axis:"x",minX:t,maxX:i,minZ:s,maxZ:s,fixedZ:s}}getDefaultPosition(e={}){const t=this.getBaselinePlacementRange();return t.axis==="z"?{x:t.fixedX,z:aa(e.z??0,t.minZ,t.maxZ)}:{x:aa(e.x??0,t.minX,t.maxX),z:t.fixedZ}}isPointOnBaseline(e){if(!e)return!1;const t=this.getBaselinePlacementRange(),i=st.BASELINE_TOUCH_BAND;return t.axis==="z"?Math.abs(e.x-t.fixedX)<=i&&e.z>=t.minZ-i&&e.z<=t.maxZ+i:Math.abs(e.z-t.fixedZ)<=i&&e.x>=t.minX-i&&e.x<=t.maxX+i}getClampedPosition(e){const t=this.getBaselinePlacementRange();return t.axis==="z"?{x:t.fixedX,z:aa(e?.z??this.lastPlacement.z,t.minZ,t.maxZ)}:{x:aa(e?.x??this.lastPlacement.x,t.minX,t.maxX),z:t.fixedZ}}moveToPoint(e){const t=this.getClampedPosition(e);return this.placeAt(t)}placeAt(e){const t=this.validatePosition(e);if(!t.valid)return this.aimLineRenderer?.showPlacement(e,!1),{placed:!1,position:e,...t};const i=this.physicsWorld?.setStrikerPosition(e.x,e.z);return i&&(this.lastPlacement={x:e.x,z:e.z}),this.aimLineRenderer?.showPlacement(e,t.valid),{placed:i,position:e,...t}}placeAtDefault(e={}){const t=this.findOpenBaselinePosition(e);return this.placeAt(t)}findOpenBaselinePosition(e={}){const t=this.getDefaultPosition(e);if(this.validatePosition(t).valid)return t;const i=this.getBaselinePlacementRange(),s=Math.max(3,st.PLACEMENT_SAMPLE_COUNT),a=Math.floor(s/2);for(let r=1;r<=a;r+=1){const o=[a-r,a+r];for(const l of o){if(l<0||l>=s)continue;const c=s===1?.5:l/(s-1),h=i.axis==="z"?{x:i.fixedX,z:i.minZ+(i.maxZ-i.minZ)*c}:{x:i.minX+(i.maxX-i.minX)*c,z:i.fixedZ};if(this.validatePosition(h).valid)return h}}return t}validateCurrentPosition(){const e=this.physicsWorld?.getStrikerBody();return e?this.validatePosition(e.position):{valid:!1,reason:"missing-striker"}}validatePosition(e){const t=this.physicsWorld?.getStrikerBody();return t?this.physicsWorld.isCircleOverlapping(e.x,e.z,t.radius+st.PLACEMENT_PADDING,t.id)?{valid:!1,reason:"overlap"}:{valid:!0,reason:""}:{valid:!1,reason:"missing-striker"}}clearFeedback(){this.aimLineRenderer?.hidePlacement()}}const ft={ready:"ready",pending:"pending",placing:"placing",aiming:"aiming",shotMoving:"shotMoving",settling:"settling"},pS=.045;class fS{constructor({canvas:e,camera:t,physicsWorld:i,aimLineRenderer:s,callbacks:a={}}){this.canvas=e,this.camera=t,this.physicsWorld=i,this.aimLineRenderer=s,this.callbacks=a,this.enabled=!1,this.state=ft.ready,this.activePointerId=null,this.pointerStart=null,this.pointerRaycaster=new hS({canvas:e,camera:t}),this.placementController=new dS({physicsWorld:i,aimLineRenderer:s}),this.aimingController=new cS({physicsWorld:i,aimLineRenderer:s,onPowerChange:r=>this.callbacks.onPowerChange?.(r)}),this.handlePointerDown=this.handlePointerDown.bind(this),this.handlePointerMove=this.handlePointerMove.bind(this),this.handlePointerUp=this.handlePointerUp.bind(this),this.handlePointerCancel=this.handlePointerCancel.bind(this),this.canvas?.addEventListener("pointerdown",this.handlePointerDown,{passive:!1}),this.canvas?.addEventListener("pointermove",this.handlePointerMove,{passive:!1}),this.canvas?.addEventListener("pointerup",this.handlePointerUp,{passive:!1}),this.canvas?.addEventListener("pointercancel",this.handlePointerCancel,{passive:!1}),this.canvas?.addEventListener("lostpointercapture",this.handlePointerCancel,{passive:!1})}setEnabled(e){if(this.enabled=!!e,!this.enabled){this.cancelActiveInput();return}this.state=ft.ready,this.aimLineRenderer?.hide()}reset(){this.cancelActiveInput(),this.placementController.placeAtDefault(),this.aimLineRenderer?.hide(),this.state=ft.ready,this.callbacks.onPowerChange?.({ratio:0,label:"Ready"}),this.emitReadyStatus()}setActiveBaseline(e){this.placementController.setActiveBaseline(e)}prepareForTurn({baseline:e=st.ACTIVE_BASELINE,enabled:t=!0,silent:i=!1}={}){this.cancelActiveInput(),this.setActiveBaseline(e),this.enabled=!!t,this.placementController.placeAtDefault(),this.aimLineRenderer?.hide(),this.state=t?ft.ready:ft.settling,this.callbacks.onPowerChange?.({ratio:0,label:t?"Ready":"Locked"}),!i&&t&&this.emitReadyStatus()}handlePointerDown(e){if(e.pointerType==="touch"&&e.isPrimary===!1||!this.canReceivePointer())return;const t=this.pointerRaycaster.getBoardPoint(e);if(!t)return;const i=this.isNearStriker(t),s=this.placementController.isPointOnBaseline(t);if(!(!i&&!s)){if(e.preventDefault(),this.activePointerId=e.pointerId,this.pointerStart=t,this.canvas?.setPointerCapture?.(e.pointerId),i){this.state=ft.pending,this.emitStatus("Drag sideways to place, or pull back to aim.",{shotPower:"Ready",shotPowerRatio:0});return}s&&this.beginPlacing(t)}}handlePointerMove(e){if(e.pointerId!==this.activePointerId)return;const t=this.pointerRaycaster.getBoardPoint(e);if(t){if(e.preventDefault(),this.state===ft.pending){this.resolvePendingGesture(t);return}if(this.state===ft.placing){this.updatePlacement(t);return}this.state===ft.aiming&&this.updateAim(t)}}handlePointerUp(e){if(e.pointerId===this.activePointerId){if(e.preventDefault(),this.state===ft.pending){this.finishPointer(),this.emitReadyStatus();return}if(this.state===ft.placing){const t=this.placementController.validateCurrentPosition();this.finishPointer(),t.valid?(this.placementController.clearFeedback(),this.emitReadyStatus()):this.emitInvalidPlacement();return}if(this.state===ft.aiming){this.releaseShot(),this.finishPointer();return}this.finishPointer()}}handlePointerCancel(e){this.activePointerId===null||e.pointerId!==this.activePointerId||(this.cancelActiveInput(),this.enabled&&this.emitReadyStatus())}resolvePendingGesture(e){if(!this.pointerStart)return;const t=e.x-this.pointerStart.x,i=e.z-this.pointerStart.z;if(!(Math.hypot(t,i)<pS)){if(Math.abs(t)>Math.abs(i)*1.15){this.beginPlacing(e);return}this.beginAiming(e)}}beginPlacing(e){if(!this.canInteractWithWorld()){this.emitSettlingStatus();return}this.state=ft.placing,this.updatePlacement(e)}updatePlacement(e){const t=this.placementController.moveToPoint(e);if(t.valid){this.callbacks.onPlacementChanged?.(t.position),this.emitStatus("Striker placed. Pull from the striker to aim.",{shotPower:"Ready",shotPowerRatio:0});return}this.emitInvalidPlacement()}beginAiming(e){if(!this.canInteractWithWorld()){this.emitSettlingStatus();return}if(!this.placementController.validateCurrentPosition().valid){this.emitInvalidPlacement(),this.state=ft.ready;return}if(this.placementController.clearFeedback(),!this.aimingController.begin()){this.emitStatus("Striker is not ready.",{shotPower:"Blocked",shotPowerRatio:0}),this.state=ft.ready;return}this.state=ft.aiming,this.callbacks.onAimCreated?.(),this.updateAim(e)}updateAim(e){const t=this.placementController.validateCurrentPosition(),i=this.aimingController.update(e,t.valid);if(this.callbacks.onAimUpdated?.(i),!t.valid){this.emitInvalidPlacement();return}const s=i.power<st.MIN_SHOT_POWER?"Pull farther for a clean shot.":"Release to shoot.";this.emitStatus(s,{shotPower:i.power<st.MIN_SHOT_POWER?"Too soft":`${Math.round(i.powerRatio*100)}%`,shotPowerRatio:i.powerRatio})}releaseShot(){const e=this.placementController.validateCurrentPosition(),t=this.callbacks.shouldDeferShotRelease?.()===!0,i=this.aimingController.release(e.valid,{applyShot:!t});if(!i.fired){if(this.state=ft.ready,i.reason==="invalid-placement"){this.emitInvalidPlacement();return}if(i.reason==="cancelled"){this.emitStatus("Shot cancelled. Pull farther to shoot.",{shotPower:"Ready",shotPowerRatio:0});return}this.emitStatus("Shot blocked while pieces settle.",{shotPower:"Blocked",shotPowerRatio:0});return}this.state=ft.shotMoving,this.placementController.clearFeedback(),this.callbacks.onShotReleased?.(i)}handleShotStarted(){this.state=ft.shotMoving,this.aimLineRenderer?.hide(),this.emitStatus("Shot in motion.",{shotPower:"Moving",shotPowerRatio:1})}handleShotSettled(e={pocketedCount:0}){this.state=ft.settling,this.aimLineRenderer?.hide(),this.emitStatus(`Resolving shot. Pocketed: ${e.pocketedCount||0}.`,{shotPower:"Settled",shotPowerRatio:0})}canReceivePointer(){return!this.enabled||this.activePointerId!==null?!1:this.canInteractWithWorld()?!0:(this.emitSettlingStatus(),!1)}canInteractWithWorld(){const e=this.physicsWorld?.getMotionState();return!!(e&&!e.anyMoving)}isNearStriker(e){const t=this.physicsWorld?.getStrikerBody();if(!t||t.isPocketed)return!1;const i=e.x-t.position.x,s=e.z-t.position.z;return Math.hypot(i,s)<=st.AIM_START_RADIUS}emitReadyStatus(){if(!this.enabled||!this.canInteractWithWorld())return;if(!this.placementController.validateCurrentPosition().valid){this.emitInvalidPlacement();return}this.emitStatus("Ready. Drag striker to place, pull from it to aim.",{shotPower:"Ready",shotPowerRatio:0})}emitInvalidPlacement(){this.emitStatus("Invalid striker placement. Move it away from coins.",{shotPower:"Blocked",shotPowerRatio:0})}emitSettlingStatus(){this.emitStatus("Waiting for pieces to settle.",{shotPower:"Moving",shotPowerRatio:1})}emitStatus(e,t={}){this.callbacks.onStatus?.(e,t)}finishPointer(){if(this.activePointerId!==null)try{this.canvas?.releasePointerCapture?.(this.activePointerId)}catch{}this.activePointerId=null,this.pointerStart=null,this.state!==ft.shotMoving&&(this.state=ft.ready)}cancelActiveInput(){this.aimingController.cancel(),this.placementController.clearFeedback(),this.finishPointer(),this.state=ft.ready}dispose(){this.cancelActiveInput(),this.canvas?.removeEventListener("pointerdown",this.handlePointerDown),this.canvas?.removeEventListener("pointermove",this.handlePointerMove),this.canvas?.removeEventListener("pointerup",this.handlePointerUp),this.canvas?.removeEventListener("pointercancel",this.handlePointerCancel),this.canvas?.removeEventListener("lostpointercapture",this.handlePointerCancel)}}class mS{constructor({parent:e,theme:t}){this.parent=e,this.theme=t,this.effects=[],this.geometry=new Di(.055,20),this.material=new Rt({color:t.scene.goldTrim,transparent:!0,opacity:0,depthWrite:!1,side:Ht})}play(e,t=.5,i=!1){if(i||t<.24)return;if(this.effects.length>=12){const a=this.effects.shift();this.parent.remove(a.mesh),a.mesh.material.dispose()}const s=new Ve(this.geometry,this.material.clone());s.rotation.x=-Math.PI/2,s.position.set(e.x,H.SURFACE_Y+.065,e.z),s.scale.setScalar(.8+t*1.4),s.renderOrder=44,this.parent.add(s),this.effects.push({mesh:s,life:.16,maxLife:.16,intensity:t})}update(e){this.effects=this.effects.filter(t=>{t.life-=e;const i=Math.max(t.life/t.maxLife,0);return t.mesh.material.opacity=.5*i*t.intensity,t.mesh.scale.multiplyScalar(1+e*3.2),t.life>0?!0:(this.parent.remove(t.mesh),t.mesh.material.dispose(),!1)})}applyTheme(e){this.theme=e,this.material.color.set(e.scene.goldTrim)}clear(){this.effects.forEach(e=>{this.parent.remove(e.mesh),e.mesh.material.dispose()}),this.effects=[]}dispose(){this.clear(),this.geometry.dispose(),this.material.dispose()}}class gS{constructor({parent:e,material:t,geometry:i,size:s=36}){this.parent=e,this.material=t,this.geometry=i,this.items=Array.from({length:s},(a,r)=>{const o=new Ve(i,t.clone());return o.name=`pooled-vfx-particle-${r+1}`,o.visible=!1,o.renderOrder=40,e.add(o),{mesh:o,velocity:new L,life:0,maxLife:1}})}emit({position:e,color:t,count:i=8,speed:s=.7,life:a=.55,scale:r=1}){for(let o=0;o<i;o+=1){const l=this.items.find(h=>h.life<=0);if(!l)return;const c=Math.random()*Math.PI*2;l.mesh.visible=!0,l.mesh.position.copy(e),l.mesh.scale.setScalar(r),l.mesh.material.color.set(t),l.velocity.set(Math.cos(c)*s*(.35+Math.random()*.65),.24+Math.random()*.34,Math.sin(c)*s*(.35+Math.random()*.65)),l.life=a,l.maxLife=a}}update(e){this.items.forEach(t=>{if(t.life<=0)return;t.life-=e;const i=Math.max(t.life/t.maxLife,0);t.mesh.position.addScaledVector(t.velocity,e),t.mesh.scale.setScalar(i),t.mesh.material.opacity=.72*i,t.mesh.visible=t.life>0})}clear(){this.items.forEach(e=>{e.life=0,e.mesh.visible=!1,e.mesh.material.opacity=0})}dispose(){this.items.forEach(e=>this.parent.remove(e.mesh)),this.items.forEach(e=>e.mesh.material.dispose()),this.geometry.dispose(),this.material.dispose()}}class vS{constructor({parent:e,theme:t}){this.parent=e,this.theme=t,this.effects=[],this.ringGeometry=new Yi(.18,.34,64),this.ringMaterial=new Rt({color:t.scene.goldTrim,transparent:!0,opacity:0,depthWrite:!1,side:Ht})}play(e,{queen:t=!1,foul:i=!1,reduced:s=!1}={}){if(s)return;if(this.effects.length>=8){const r=this.effects.shift();this.parent.remove(r.mesh),r.mesh.material.dispose()}const a=new Ve(this.ringGeometry,this.ringMaterial.clone());a.rotation.x=-Math.PI/2,a.position.set(e.x,H.SURFACE_Y+.04,e.z),a.renderOrder=42,a.material.color.set(i?this.theme.scene.queen:t?this.theme.scene.queenRim:this.theme.scene.goldTrim),this.parent.add(a),this.effects.push({mesh:a,life:t?.72:.48,maxLife:t?.72:.48,queen:t,foul:i})}update(e){this.effects=this.effects.filter(t=>{t.life-=e;const i=Math.max(t.life/t.maxLife,0),s=1+(1-i)*(t.queen?2.1:1.55);return t.mesh.scale.setScalar(s),t.mesh.material.opacity=.62*i,t.life>0?!0:(this.parent.remove(t.mesh),t.mesh.material.dispose(),!1)})}applyTheme(e){this.theme=e,this.ringMaterial.color.set(e.scene.goldTrim)}clear(){this.effects.forEach(e=>{this.parent.remove(e.mesh),e.mesh.material.dispose()}),this.effects=[]}dispose(){this.clear(),this.ringGeometry.dispose(),this.ringMaterial.dispose()}}class yS{constructor({parent:e,theme:t}){this.parent=e,this.theme=t,this.effects=[],this.geometry=new Yi(.26,.46,72),this.material=new Rt({color:t.scene.queenRim,transparent:!0,opacity:0,depthWrite:!1,side:Ht})}play(e={x:0,z:0},t="pocketed",i=!1){if(i&&t!=="returned")return;if(this.effects.length>=5){const a=this.effects.shift();this.parent.remove(a.mesh),a.mesh.material.dispose()}const s=new Ve(this.geometry,this.material.clone());s.rotation.x=-Math.PI/2,s.position.set(e.x,H.SURFACE_Y+.075,e.z),s.material.color.set(t==="returned"?this.theme.scene.queen:this.theme.scene.queenRim),s.renderOrder=45,this.parent.add(s),this.effects.push({mesh:s,life:t==="covered"?1:.72,maxLife:t==="covered"?1:.72})}update(e){this.effects=this.effects.filter(t=>{t.life-=e;const i=Math.max(t.life/t.maxLife,0);return t.mesh.scale.setScalar(1+(1-i)*2.8),t.mesh.material.opacity=.74*i,t.life>0?!0:(this.parent.remove(t.mesh),t.mesh.material.dispose(),!1)})}applyTheme(e){this.theme=e,this.material.color.set(e.scene.queenRim)}clear(){this.effects.forEach(e=>{this.parent.remove(e.mesh),e.mesh.material.dispose()}),this.effects=[]}dispose(){this.clear(),this.geometry.dispose(),this.material.dispose()}}class SS{constructor({parent:e,theme:t}){this.parent=e,this.theme=t,this.effects=[],this.geometry=new Yi(.45,.5,96),this.material=new Rt({color:t.scene.goldTrim,transparent:!0,opacity:0,depthWrite:!1,side:Ht})}play(e=!1){if(!e){this.clear();for(let t=0;t<3;t+=1){const i=new Ve(this.geometry,this.material.clone());i.rotation.x=-Math.PI/2,i.position.set(0,H.SURFACE_Y+.08+t*.01,0),i.renderOrder=46,this.parent.add(i),this.effects.push({mesh:i,delay:t*.16,life:1.15,maxLife:1.15})}}}update(e){this.effects=this.effects.filter(t=>{if(t.delay-=e,t.delay>0)return!0;t.life-=e;const i=Math.max(t.life/t.maxLife,0);return t.mesh.scale.setScalar(1+(1-i)*4.6),t.mesh.material.opacity=.4*i,t.life>0?!0:(this.parent.remove(t.mesh),t.mesh.material.dispose(),!1)})}applyTheme(e){this.theme=e,this.material.color.set(e.scene.goldTrim)}clear(){this.effects.forEach(e=>{this.parent.remove(e.mesh),e.mesh.material.dispose()}),this.effects=[]}dispose(){this.clear(),this.geometry.dispose(),this.material.dispose()}}class bS{constructor({target:e}){this.target=e,this.time=0,this.power=0,this.reduced=!1}setReducedEffects(e){this.reduced=!!e}trigger(e=1,t=.18){this.reduced||!this.target||(this.power=Math.min(Math.max(e,0),1),this.time=t)}update(e){if(!this.target||this.time<=0)return;this.time-=e;const t=this.power*this.time*8;this.target.style.transform=`translate3d(${Math.sin(this.time*88)*t}px, ${Math.cos(this.time*73)*t*.6}px, 0)`,this.time<=0&&(this.target.style.transform="")}clear(){this.time=0,this.target&&(this.target.style.transform="")}}class _S{constructor({root:e}){this.root=e,this.element=null,this.timeoutId=0}init(){!this.root||this.element||(this.element=document.createElement("div"),this.element.className="cinematic-feedback-banner",this.element.setAttribute("aria-live","polite"),this.root.appendChild(this.element))}show({eyebrow:e="Turn",title:t="",detail:i="",tone:s="default",reduced:a=!1}){if(this.init(),!this.element)return;window.clearTimeout(this.timeoutId),this.element.dataset.tone=s,this.element.innerHTML=`
      <span>${e}</span>
      <strong>${t}</strong>
      <em>${i}</em>
    `,this.element.classList.add("is-visible");const r=window.matchMedia?.("(max-width: 760px), (max-height: 560px)")?.matches,o=a?700:r?1150:1500;this.timeoutId=window.setTimeout(()=>{this.element?.classList.remove("is-visible")},o)}clear(){window.clearTimeout(this.timeoutId),this.element?.classList.remove("is-visible")}dispose(){window.clearTimeout(this.timeoutId),this.element?.remove(),this.element=null}}class MS{constructor({sceneParent:e,root:t,theme:i}){this.sceneParent=e,this.root=t,this.theme=i,this.reducedEffects=!1,this.baseQualityIntensity=1,this.cosmeticIntensity=1,this.qualityIntensity=1,this.cosmeticPreset={},this.lastCollision=0,this.sparkMaterial=new Rt({color:i.scene.goldTrim,transparent:!0,opacity:.72,depthWrite:!1}),this.sparkGeometry=new Ca(.026,10,10),this.particles=new gS({parent:e,material:this.sparkMaterial,geometry:this.sparkGeometry,size:54}),this.pocket=new vS({parent:e,theme:i}),this.collision=new mS({parent:e,theme:i}),this.queen=new yS({parent:e,theme:i}),this.result=new SS({parent:e,theme:i}),this.banner=new _S({root:t}),this.shake=new bS({target:t?.querySelector?.(".carrom-stage")||t})}playMatchIntro(e=[],t={}){const[i,s]=e,a=t.matchMode==="vsBot"||!!s?.isBot,r=t.ruleModeLabel||"Classic",o=t.botDifficultyLabel?` - ${t.botDifficultyLabel} Bot`:"",l=t.ruleMode==="freeCapture"?`${r}${o} - Pocket any coin. Queen +3.`:`${r}${o} - ${i?.color||"White"} vs ${s?.color||"Black"}`;this.banner.show({eyebrow:a?"Human vs Bot":"Local Match",title:`${i?.name||"Player 1"} vs ${s?.name||"Player 2"}`,detail:l,tone:"default",reduced:this.reducedEffects})}playTurnChange(e,t=!1){this.banner.show({eyebrow:t?"Extra Shot":"Turn Change",title:t?`${e.name} continues`:`${e.name} Turn`,detail:`${e.color||""} coins`,tone:t?"success":"default",reduced:this.reducedEffects})}playShotRelease(e=.5,t={x:0,z:H.BASELINE_OFFSET}){const i=Math.min(Math.max(e,.2),1.2)*this.qualityIntensity,s=new L(t.x,H.SURFACE_Y+.09,t.z);this.particles.emit({position:s,color:this.theme.scene.strikerGlow,count:this.getEffectCount(this.reducedEffects?3:8),speed:.42*i,life:.34,scale:.7}),this.shake.trigger(.08*i,.11)}playCoinCollision(e){const t=performance.now(),i=this.qualityIntensity<.6?90:42;if(t-this.lastCollision<i)return;this.lastCollision=t;const s=Math.min(Math.max(e.intensity||0,0),1);s<(this.qualityIntensity<.7?.34:.18)||this.collision.play(e.position,s,this.reducedEffects)}playPocketEffect(e,t){const i=e.type==="queen",s=e.type==="striker",a=new L(t?.x??0,H.SURFACE_Y+.08,t?.z??0);this.pocket.play(t||{x:0,z:0},{queen:i,foul:s,reduced:this.reducedEffects}),this.particles.emit({position:a,color:s?this.theme.scene.queen:i?this.theme.scene.queenRim:this.theme.scene.goldTrim,count:this.getEffectCount(this.reducedEffects?4:i?18:10),speed:(i?.92:.62)*this.qualityIntensity,life:i?.78:.5,scale:i?1.1:.85})}playQueenPocketEffect(e){this.queen.play(e,"pocketed",this.reducedEffects)}playQueenCoveredEffect(){this.queen.play({x:0,z:0},"covered",this.reducedEffects),this.banner.show({eyebrow:"Queen",title:"Queen Covered",detail:"Royal finish secured",tone:"success",reduced:this.reducedEffects})}playQueenReturnedEffect(){this.queen.play({x:0,z:0},"returned",this.reducedEffects),this.banner.show({eyebrow:"Queen",title:"Queen Returned",detail:"Cover missed",tone:"warning",reduced:this.reducedEffects})}playFoulEffect(e="Foul"){this.banner.show({eyebrow:"Foul",title:e==="strikerPocketed"?"Striker Pocketed":"Foul",detail:"Turn changes after penalty",tone:"danger",reduced:this.reducedEffects}),this.shake.trigger(.28,.18)}playWinnerEffect(e){this.result.play(this.reducedEffects),this.banner.show({eyebrow:"Winner",title:`${e?.name||"Player"} Wins`,detail:`${e?.color||""} closes the table`,tone:"success",reduced:this.reducedEffects})}playResetEffect(){this.clear(),this.banner.show({eyebrow:"Reset",title:"Fresh Board",detail:"Local match restarted",tone:"default",reduced:this.reducedEffects})}update(e){this.particles.update(e),this.pocket.update(e),this.collision.update(e),this.queen.update(e),this.result.update(e),this.shake.update(e)}clear(){this.particles.clear(),this.pocket.clear(),this.collision.clear(),this.queen.clear(),this.result.clear(),this.shake.clear()}applyTheme(e){this.theme=e;const t=this.cosmeticPreset.sparkColor||e.scene.goldTrim;this.sparkMaterial.color.set(t),this.particles.items.forEach(i=>i.mesh.material.color.set(t)),this.pocket.applyTheme(e),this.collision.applyTheme(e),this.queen.applyTheme(e),this.result.applyTheme(e)}setCosmeticPreset(e={}){this.cosmeticPreset={...e||{}},this.cosmeticIntensity=Math.min(Math.max(Number(e.intensity)||1,.35),1.2),this.updateEffectiveIntensity();const t=this.cosmeticPreset.sparkColor||this.theme.scene.goldTrim;this.sparkMaterial.color.set(t)}setReducedEffects(e){this.reducedEffects=!!e,this.shake.setReducedEffects(e)}setQualityProfile(e){this.baseQualityIntensity=Math.min(Math.max(e?.vfxIntensity??1,.25),1),this.updateEffectiveIntensity()}updateEffectiveIntensity(){this.qualityIntensity=Math.min(Math.max(this.baseQualityIntensity*this.cosmeticIntensity,.2),1.2)}getEffectCount(e){return Math.max(1,Math.round(e*this.qualityIntensity))}dispose(){this.clear(),this.particles.dispose(),this.pocket.dispose(),this.collision.dispose(),this.queen.dispose(),this.result.dispose(),this.banner.dispose()}}class xS{constructor({canvas:e,root:t,theme:i,settings:s,physicsCallbacks:a={},inputCallbacks:r={},debugPhysics:o=!1}){this.canvas=e,this.root=t,this.theme=i,this.settings=s,this.boardStyleId="ivory",this.physicsCallbacks=a,this.inputCallbacks=r,this.debugPhysics=o,this.scene=new Wp,this.scene.background=new De(i.scene.background),this.scene.fog=new Go(i.scene.fog,12,25),this.clock=new of,this.animationFrame=0,this.pendingResizeFrame=0,this.qualityProfile=il(s.quality),this.cosmeticSceneOverrides={},this.cosmeticVfxPreset={},this.stageGroup=new Yt,this.stageGroup.name="carrom-royale-scene-root",this.trainingHighlightGroup=new Yt,this.trainingHighlightGroup.name="training-challenge-highlights",this.particles=[],this.sceneObjects={pockets:[],pieces:[]},this.sceneOrbitEnabled=!1,this.orbitPointerId=null,this.camera=new zt(42,1,.1,80),this.cameraController=new Yy(this.camera),this.renderer=new Wy({canvas:e,antialias:!0,alpha:!0}),this.renderer.outputColorSpace=Bt,this.renderer.toneMapping=nh,this.renderer.toneMappingExposure=1.1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=th,this.handleSceneOrbitDown=this.handleSceneOrbitDown.bind(this),this.handleSceneOrbitMove=this.handleSceneOrbitMove.bind(this),this.handleSceneOrbitUp=this.handleSceneOrbitUp.bind(this)}init(){this.materialLibrary=new Zy(this.theme),this.cameraController.init(),this.lighting=new Qy(this.scene,this.theme),this.scene.add(this.stageGroup),this.createScene(),this.stageGroup.add(this.trainingHighlightGroup),this.canvas?.addEventListener("pointerdown",this.handleSceneOrbitDown,{passive:!1}),this.canvas?.addEventListener("pointermove",this.handleSceneOrbitMove,{passive:!1}),this.canvas?.addEventListener("pointerup",this.handleSceneOrbitUp,{passive:!1}),this.canvas?.addEventListener("pointercancel",this.handleSceneOrbitUp,{passive:!1}),this.canvas?.addEventListener("lostpointercapture",this.handleSceneOrbitUp,{passive:!1}),this.resize(),this.animate()}createScene(){this.createEnvironment(),this.boardBuilder=new jy({materialLibrary:this.materialLibrary,theme:this.theme});const e=this.boardBuilder.build();this.stageGroup.add(e.group),this.sceneObjects.pockets=e.pockets,this.pieceFactory=new Jy({materialLibrary:this.materialLibrary});const t=this.pieceFactory.createInitialPieces();this.stageGroup.add(t.group),this.sceneObjects.pieces=t.pieces,this.aimLineRenderer=new lS({parent:this.stageGroup,theme:this.theme}),this.vfxManager=new MS({sceneParent:this.stageGroup,root:this.root,theme:this.theme}),this.vfxManager.setReducedEffects(this.settings.reducedEffects),this.vfxManager.setQualityProfile(this.qualityProfile),this.physicsWorld=new rS({pieces:this.sceneObjects.pieces,pockets:this.sceneObjects.pockets,onShotStarted:()=>{this.inputController?.handleShotStarted(),this.physicsCallbacks.onShotStarted?.()},onPiecePocketed:i=>{this.vfxManager?.playPocketEffect(i,i.pocketPosition),i.type==="queen"&&this.vfxManager?.playQueenPocketEffect(i.pocketPosition),this.physicsCallbacks.onPiecePocketed?.(i)},onShotSettled:i=>{this.inputController?.handleShotSettled(i),this.physicsCallbacks.onShotSettled?.(i)},onCollision:i=>{this.vfxManager?.playCoinCollision(i),this.physicsCallbacks.onCollision?.(i)},onStatus:i=>this.physicsCallbacks.onStatus?.(i),debugPhysics:this.debugPhysics}),this.inputController=new fS({canvas:this.canvas,camera:this.camera,physicsWorld:this.physicsWorld,aimLineRenderer:this.aimLineRenderer,callbacks:this.inputCallbacks})}createEnvironment(){const e=new Ve(new Mn(24,18),this.materialLibrary.get("tableBase"));e.name="luxury-lounge-floor",e.rotation.x=-Math.PI/2,e.position.y=-.56,e.receiveShadow=!0,this.stageGroup.add(e),this.particleMaterial=new Lt({color:this.theme.scene.particle,emissive:new De(this.theme.scene.particle),emissiveIntensity:.38,roughness:.5,metalness:.08,transparent:!0,opacity:.34});for(let t=0;t<26;t+=1){const i=new Ve(new Ca(.012+Math.random()*.022,10,10),this.particleMaterial);i.name=`ambient-gold-dust-${t+1}`,i.position.set((Math.random()-.5)*9.4,.5+Math.random()*3.4,(Math.random()-.5)*7.8),i.userData.baseY=i.position.y,i.userData.phase=Math.random()*Math.PI*2,i.userData.float=.08+Math.random()*.2,this.stageGroup.add(i),this.particles.push(i)}}resize(){const e=Math.round(window.visualViewport?.width||window.innerWidth||1),t=Math.round(window.visualViewport?.height||window.innerHeight||1),s=e<=760||t<=560?this.qualityProfile.pixelRatioMobile:this.qualityProfile.pixelRatioDesktop;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.cameraController.setViewport(e,t),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,s)),this.renderer.setSize(e,t,!1)}requestResize(){this.pendingResizeFrame||(this.pendingResizeFrame=window.requestAnimationFrame(()=>{this.pendingResizeFrame=0,this.resize()}))}setStateFocus(e){this.cameraController.focusForState(e),this.inputController?.setEnabled(e==="playing")}setSceneOrbitEnabled(e){this.sceneOrbitEnabled=!!e,this.canvas?.classList.toggle("is-orbit-enabled",this.sceneOrbitEnabled),this.canvas?.classList.remove("is-orbiting"),this.cameraController?.setManualOrbitEnabled(this.sceneOrbitEnabled),this.sceneOrbitEnabled||(this.orbitPointerId=null,this.cameraController?.endManualOrbit())}handleSceneOrbitDown(e){!this.sceneOrbitEnabled||!this.isSceneOrbitPointer(e)||(e.preventDefault(),this.orbitPointerId=e.pointerId,this.canvas?.setPointerCapture?.(e.pointerId),this.canvas?.classList.add("is-orbiting"),this.cameraController?.beginManualOrbit(e.clientX,e.clientY))}isSceneOrbitPointer(e){return e.pointerType==="touch"?e.isPrimary!==!1:e.pointerType==="pen"?e.button===0||e.buttons===1||e.button===-1:e.button===0}handleSceneOrbitMove(e){!this.sceneOrbitEnabled||e.pointerId!==this.orbitPointerId||(e.preventDefault(),this.cameraController?.updateManualOrbit(e.clientX,e.clientY))}handleSceneOrbitUp(e){if(!(this.orbitPointerId===null||e.pointerId!==this.orbitPointerId)){try{this.canvas?.releasePointerCapture?.(this.orbitPointerId)}catch{}this.orbitPointerId=null,this.canvas?.classList.remove("is-orbiting"),this.cameraController?.endManualOrbit()}}applySettings(e){this.settings=e,this.applyQualityProfile(e.quality),this.cameraController.updateIdleMotion(e.cameraMotion&&!e.reducedEffects),this.vfxManager?.setReducedEffects(e.reducedEffects),this.resize()}applyQualityProfile(e="auto"){this.qualityProfile=il(e),this.renderer.shadowMap.enabled=!!this.qualityProfile.shadowEnabled,this.lighting?.applyQuality(this.qualityProfile),this.vfxManager?.setQualityProfile(this.qualityProfile);const t=Math.ceil(this.particles.length*this.qualityProfile.ambientParticleScale);this.particles.forEach((i,s)=>{i.visible=s<t})}applyTheme(e){this.theme=e;const t=this.getVisualTheme();this.scene.background.set(t.scene.background),this.scene.fog.color.set(t.scene.fog),this.lighting?.applyTheme(t),this.materialLibrary?.applyTheme(e,this.boardStyleId,this.cosmeticSceneOverrides),this.boardBuilder?.applyTheme(e,this.boardStyleId,this.cosmeticSceneOverrides),this.aimLineRenderer?.applyTheme(t),this.vfxManager?.applyTheme(t),this.vfxManager?.setCosmeticPreset?.(this.cosmeticVfxPreset),this.particleMaterial&&(this.particleMaterial.color.set(t.scene.particle),this.particleMaterial.emissive.set(t.scene.particle))}setBoardStyle(e="ivory"){this.boardStyleId=e||"ivory",this.materialLibrary?.applyTheme(this.theme,this.boardStyleId,this.cosmeticSceneOverrides),this.boardBuilder?.applyTheme(this.theme,this.boardStyleId,this.cosmeticSceneOverrides),this.applyTheme(this.theme)}getVisualTheme(){const e=wo(this.theme,this.boardStyleId);return{...e,scene:{...e.scene,...this.cosmeticSceneOverrides}}}applyCosmeticLoadout(e={},t={}){this.cosmeticLoadout={...e},this.cosmeticSceneOverrides={...t.scene||{}},this.cosmeticVfxPreset={...t.vfx||{}},this.applyTheme(this.theme)}animate=()=>{const e=Math.min(this.clock.getDelta(),.04),t=this.clock.elapsedTime;this.cameraController.update(e),this.physicsWorld?.update(e),this.vfxManager?.update(e),this.particles.forEach((i,s)=>{i.visible&&(i.position.y=i.userData.baseY+Math.sin(t*.42+i.userData.phase+s)*i.userData.float,i.rotation.y=t*.12+s)}),this.renderer.render(this.scene,this.camera),this.animationFrame=window.requestAnimationFrame(this.animate)};applyDevTestShot(){return this.physicsWorld?.applyDevTestShot()||!1}resetPhysics(){this.physicsWorld?.reset(),this.inputController?.reset(),this.vfxManager?.clear(),this.clearTrainingHighlights()}prepareForTurn({baseline:e="bottom",cameraBaseline:t=e,enabled:i=!0,silent:s=!0,rotateCamera:a=!0}={}){a?this.cameraController?.setGameplaySide(t):this.cameraController?.setGameplaySide("bottom",{immediate:!0}),this.inputController?.prepareForTurn({baseline:e,enabled:i,silent:s})}setActiveBaseline(e,{cameraBaseline:t=e,rotateCamera:i=!0}={}){i?this.cameraController?.setGameplaySide(t):this.cameraController?.setGameplaySide("bottom",{immediate:!0}),this.inputController?.setActiveBaseline(e)}setInputEnabled(e){this.inputController?.setEnabled(e)}returnPieceToBoard(e,t=null){return this.physicsWorld?.returnBodyToBoard(e,t)||null}applyTrainingScenario(e={}){this.clearFeedback(),this.physicsWorld?.applyTrainingScenario(e),this.inputController?.reset(),this.showTrainingHighlights(e.highlights||[])}clearTrainingScenario(){this.clearFeedback(),this.clearTrainingHighlights(),this.physicsWorld?.clearTrainingScenario(),this.inputController?.reset()}showTrainingHighlights(e=[]){this.clearTrainingHighlights(),e.forEach(t=>{const i=this.createTrainingHighlight(t);i&&this.trainingHighlightGroup.add(i)})}createTrainingHighlight(e={}){const t=e.tone==="queen"?15294280:15055986,i=new Rt({color:t,transparent:!0,opacity:e.tone==="queen"?.42:.34,depthWrite:!1});if(e.type==="piece"){const s=this.physicsWorld?.getBody(e.pieceId);if(!s||s.isPocketed)return i.dispose(),null;const a=new Ve(new Yi(s.radius*1.28,s.radius*1.7,56),i);return a.name=`training-highlight-${e.id||e.pieceId}`,a.rotation.x=-Math.PI/2,a.position.set(s.position.x,s.visualY+.025,s.position.z),a.renderOrder=12,a}if(e.type==="pocket"){const s=this.sceneObjects.pockets.find(r=>r.id===e.pocketId);if(!s)return i.dispose(),null;const a=new Ve(new Yi(H.POCKET_RADIUS*1.06,H.POCKET_RADIUS*1.36,64),i);return a.name=`training-highlight-${e.id||e.pocketId}`,a.rotation.x=-Math.PI/2,a.position.set(s.position.x,H.SURFACE_Y+.045,s.position.z),a.renderOrder=11,a}if(e.type==="baseline"){const s=e.baseline==="top"?-2.08:H.BASELINE_OFFSET,a=new Ve(new ki(H.BASELINE_HALF_LENGTH*2,.018,.045),i);return a.name=`training-highlight-${e.id||"baseline"}`,a.position.set(0,H.SURFACE_Y+.05,s),a.renderOrder=10,a}if(e.type==="center"){const s=new Ve(new Yi(.18,.86,72),i);return s.name=`training-highlight-${e.id||"center"}`,s.rotation.x=-Math.PI/2,s.position.set(0,H.SURFACE_Y+.05,0),s.renderOrder=10,s}return i.dispose(),null}clearTrainingHighlights(){this.trainingHighlightGroup&&[...this.trainingHighlightGroup.children].forEach(e=>{this.trainingHighlightGroup.remove(e),e.geometry?.dispose?.(),Array.isArray(e.material)?e.material.forEach(t=>t.dispose?.()):e.material?.dispose?.()})}getBoardSnapshot(){return this.physicsWorld?.getBoardSnapshot()||null}applyBoardSnapshot(e={}){const t=this.physicsWorld?.applyBoardSnapshot(e)||null;return this.inputController?.reset(),t}placeStrikerForBot(e){if(!e)return!1;this.setInputEnabled(!1);const t=this.physicsWorld?.setStrikerPosition(e.x,e.z)||!1;return t&&this.aimLineRenderer?.showPlacement(e,!0),t}applyAuthoritativeShot({strikerPosition:e,direction:t,power:i}={}){return this.setInputEnabled(!1),e&&this.physicsWorld?.setBodyPosition("striker-1",e,{visible:!0,pocketed:!1}),this.inputController?.handleShotStarted(),this.physicsWorld?.applyStrikerShot(t,i)||!1}previewBotShot(e){if(!e?.strikerPosition||!e?.direction){this.clearBotPreview();return}this.aimLineRenderer?.hidePlacement(),this.aimLineRenderer?.showAim({start:e.strikerPosition,direction:e.direction,powerRatio:e.powerRatio||0,valid:!0})}fireBotShot(e){return e?.direction?(this.clearBotPreview(),this.physicsWorld?.applyStrikerShot(e.direction,e.power)||!1):!1}clearBotPreview(){this.aimLineRenderer?.hide()}playMatchIntro(e,t={}){this.vfxManager?.playMatchIntro(e,t),this.cameraController.playIntroSweep()}playShotRelease(e=.5){const t=this.physicsWorld?.getStrikerBody();this.vfxManager?.playShotRelease(e,t?.position),this.cameraController.shotNudge(e)}playRuleFeedback({ruleResult:e,currentPlayer:t,activePlayer:i,winner:s}={}){if(e){if(e.isFoul){this.vfxManager?.playFoulEffect(e.foulType),this.cameraController.foulPulse();return}if(e.queenCovered?this.vfxManager?.playQueenCoveredEffect():e.queenReturned?this.vfxManager?.playQueenReturnedEffect():e.queenPending&&this.vfxManager?.banner.show({eyebrow:"Queen",title:"Cover the Queen",detail:`${t?.name||"Player"} gets one cover shot`,tone:"warning",reduced:this.settings.reducedEffects}),s){this.vfxManager?.playWinnerEffect(s),this.cameraController.winnerView();return}this.vfxManager?.playTurnChange(i||t,!e.shouldSwitchTurn)}}playWinnerEffect(e){this.vfxManager?.playWinnerEffect(e),this.cameraController.winnerView()}playResetEffect(){this.vfxManager?.playResetEffect()}clearFeedback(){this.aimLineRenderer?.hide(),this.vfxManager?.clear(),this.cameraController?.clearFeedback?.()}getPhysicsSummary(){return this.physicsWorld?.getSummary()||null}dispose(){window.cancelAnimationFrame(this.animationFrame),this.pendingResizeFrame&&(window.cancelAnimationFrame(this.pendingResizeFrame),this.pendingResizeFrame=0),this.inputController?.dispose(),this.canvas?.removeEventListener("pointerdown",this.handleSceneOrbitDown),this.canvas?.removeEventListener("pointermove",this.handleSceneOrbitMove),this.canvas?.removeEventListener("pointerup",this.handleSceneOrbitUp),this.canvas?.removeEventListener("pointercancel",this.handleSceneOrbitUp),this.canvas?.removeEventListener("lostpointercapture",this.handleSceneOrbitUp),this.clearTrainingHighlights(),this.aimLineRenderer?.dispose(),this.vfxManager?.dispose(),this.physicsWorld?.dispose(),this.lighting?.dispose(),this.boardBuilder?.dispose(),this.pieceFactory?.dispose(),this.scene.traverse(e=>{e.isMesh&&e.geometry?.dispose?.()}),this.particleMaterial?.dispose(),this.materialLibrary?.dispose(),this.renderer.dispose()}}const wS={place:"Drag the striker along the highlighted baseline before aiming.",aim:"Pull back from the striker. The aim line shows where the striker will travel.",power:"Pull farther to increase power, then release when the meter feels right.",pocket:"Try aiming through the coin toward the highlighted pocket.",queen:"Pocket the queen, then cover it with a normal coin.",foul:"Too much direct power near a corner can pocket the striker.",freeCapture:"In Free Capture, any normal coin gives points."};class ES{constructor(){this.visible=!1,this.message="",this.tone="default",this.dismissedKeys=new Set,this.activeKey=""}show(e,t={}){return this.dismissedKeys.has(e)?this.getViewModel():(this.activeKey=e,this.message=t.message||wS[e]||e,this.tone=t.tone||"default",this.visible=!!this.message,this.getViewModel())}dismiss(){return this.activeKey&&this.dismissedKeys.add(this.activeKey),this.visible=!1,this.getViewModel()}clear(){return this.visible=!1,this.activeKey="",this.message="",this.tone="default",this.getViewModel()}resetDismissed(){return this.dismissedKeys.clear(),this.clear()}getViewModel(){return{visible:this.visible,key:this.activeKey,message:this.message,tone:this.tone}}}const cs=[{id:"welcome",title:"Welcome to 3D Carrom Royale",body:"Learn smooth striker control, queen cover, and premium carrom flow."},{id:"controls",title:"Controls",body:"Place the striker on your baseline, drag back to aim and set power, then release to shoot."},{id:"coins",title:"Coins",body:"Classic uses assigned colors. Free Capture lets any normal coin score."},{id:"queen",title:"Queen",body:"Pocket the queen and cover it with a valid coin. If cover fails, queen returns."},{id:"fouls",title:"Fouls",body:"Pocketing the striker is a foul. A penalty may return one captured or pocketed coin."},{id:"start",title:"Ready",body:"Start the tutorial, jump into practice, or skip straight to the setup panel."}];function Mr(){return typeof window<"u"&&!!window.localStorage}class TS{constructor(e=bi.onboardingSeen){this.storageKey=e,this.visible=!1,this.stepIndex=0}hasSeen(){return Mr()?window.localStorage.getItem(this.storageKey)==="true":!1}shouldShow(){return!this.hasSeen()}open(){return this.visible=!0,this.stepIndex=0,this.getViewModel()}close({markSeen:e=!0}={}){return this.visible=!1,e&&this.markSeen(),this.getViewModel()}next(){return this.stepIndex=Math.min(this.stepIndex+1,cs.length-1),this.getViewModel()}previous(){return this.stepIndex=Math.max(this.stepIndex-1,0),this.getViewModel()}markSeen(){Mr()&&window.localStorage.setItem(this.storageKey,"true")}reset(){return Mr()&&window.localStorage.removeItem(this.storageKey),this.visible=!1,this.stepIndex=0,this.getViewModel()}getViewModel(){const e=cs[this.stepIndex]||cs[0];return{visible:this.visible,step:e,stepIndex:this.stepIndex,stepCount:cs.length,isFirst:this.stepIndex===0,isLast:this.stepIndex===cs.length-1}}}const xo={freePractice:{id:"freePractice",label:"Free Practice",helper:"Full board sandbox. Shoot freely and reset whenever you want."},pocketDrill:{id:"pocketDrill",label:"Pocket Drill",helper:"Pocket the highlighted coin into the marked corner."},queenCoverDrill:{id:"queenCoverDrill",label:"Queen Cover Drill",helper:"Pocket the queen, then cover it with the highlighted coin."}},mt={striker:"striker-1",queen:"queen-red-1",pocketCoin:"inner-white-coin-1",coverCoin:"inner-black-coin-1"};function Tc(n="freePractice"){return xo[n]||xo.freePractice}function Lh(){return{id:"practice-free",title:"Free Practice",objectiveText:"Shoot freely. Reset the board when you want a fresh rack.",resetToDefault:!0,striker:{x:0,z:H.BASELINE_OFFSET},highlights:[{id:"practice-baseline",type:"baseline",baseline:"bottom"}]}}function kh(){return{id:"practice-pocket-drill",title:"Pocket Drill",objectiveText:"Pocket the highlighted white coin into the lower-right pocket.",activePieceIds:[mt.striker,mt.pocketCoin],placements:{[mt.striker]:{x:0,z:H.BASELINE_OFFSET},[mt.pocketCoin]:{x:1.28,z:1.48}},targetPieceIds:[mt.pocketCoin],targetPocketId:"pocket-4",highlights:[{id:"practice-pocket-coin",type:"piece",pieceId:mt.pocketCoin},{id:"practice-pocket-target",type:"pocket",pocketId:"pocket-4"},{id:"practice-baseline",type:"baseline",baseline:"bottom"}]}}function Dh(){return{id:"practice-queen-cover",title:"Queen Cover Drill",objectiveText:"Pocket the queen, then cover with the highlighted normal coin.",activePieceIds:[mt.striker,mt.queen,mt.coverCoin],placements:{[mt.striker]:{x:0,z:H.BASELINE_OFFSET},[mt.queen]:{x:1.28,z:1.48},[mt.coverCoin]:{x:-1.15,z:1.35}},targetPieceIds:[mt.queen,mt.coverCoin],targetPocketId:"pocket-4",queenRequired:!0,coverPieceId:mt.coverCoin,highlights:[{id:"practice-queen",type:"piece",pieceId:mt.queen,tone:"queen"},{id:"practice-cover-coin",type:"piece",pieceId:mt.coverCoin},{id:"practice-pocket-target",type:"pocket",pocketId:"pocket-4"},{id:"practice-baseline",type:"baseline",baseline:"bottom"}]}}function CS(n="freePractice"){return n==="pocketDrill"?kh():n==="queenCoverDrill"?Dh():Lh()}class RS{constructor({sceneRenderer:e,statsManager:t=null,coachHints:i=null,callbacks:s={}}={}){this.sceneRenderer=e,this.statsManager=t,this.coachHints=i,this.callbacks=s,this.active=!1,this.type="freePractice",this.scenario=null,this.shotsTaken=0,this.pocketedIds=new Set,this.bestStreak=0,this.currentStreak=0,this.queenPocketed=!1,this.coverPocketed=!1,this.status="Choose a practice drill.",this.completedThisRun=!1}start(e="freePractice"){return this.active=!0,this.type=Tc(e).id,this.shotsTaken=0,this.pocketedIds.clear(),this.currentStreak=0,this.queenPocketed=!1,this.coverPocketed=!1,this.completedThisRun=!1,this.applyScenario(),this.status=this.scenario.objectiveText,this.showHintForType(),this.emitChange(),this.getHud()}reset(){return this.active?this.start(this.type):this.start(this.type)}next(){const e=["freePractice","pocketDrill","queenCoverDrill"],t=e[(e.indexOf(this.type)+1)%e.length];return this.start(t)}exit(){this.active=!1,this.sceneRenderer?.clearTrainingScenario?.(),this.coachHints?.clear(),this.status="Practice closed.",this.emitChange()}showHintForType(){this.type==="queenCoverDrill"?this.coachHints?.show("queen"):this.type==="pocketDrill"?this.coachHints?.show("pocket"):this.coachHints?.show("aim")}applyScenario(){this.scenario=CS(this.type),this.sceneRenderer?.applyTrainingScenario?.(this.scenario),this.sceneRenderer?.showTrainingHighlights?.(this.scenario.highlights||[]),this.sceneRenderer?.prepareForTurn?.({baseline:"bottom",enabled:!0,silent:!0,rotateCamera:!1})}handleShotReleased(){this.active&&(this.shotsTaken+=1,this.statsManager?.recordShot(),this.status="Practice shot in motion.",this.emitChange())}handlePiecePocketed(e){!this.active||!e?.id||(this.pocketedIds.add(e.id),e.type==="queen"?(this.queenPocketed=!0,this.status=this.type==="queenCoverDrill"?"Queen pocketed. Now cover with the normal coin.":"Queen pocketed."):e.type==="coin"?(this.coverPocketed=e.id===this.scenario?.coverPieceId||this.coverPocketed,this.currentStreak+=1,this.bestStreak=Math.max(this.bestStreak,this.currentStreak),this.statsManager?.recordPocket(),this.status="Coin pocketed. Nice control."):e.type==="striker"&&(this.currentStreak=0,this.statsManager?.resetCurrentStreak(),this.coachHints?.show("foul",{tone:"warning"}),this.status="Striker pocketed. Reset or try the next shot."),this.emitChange())}handleShotSettled(e={}){if(!this.active)return this.getHud();const t=new Set((e.pocketed||[]).map(i=>i.id));if(e.pocketedCount||(this.currentStreak=0,this.statsManager?.resetCurrentStreak()),this.type==="pocketDrill"){const i=this.scenario?.targetPieceIds?.[0];t.has(i)?(this.status="Pocket drill complete. Try the next setup.",this.markComplete()):(this.status="Missed the target coin. Reset the drill and try again.",this.coachHints?.show("pocket"))}else this.type==="queenCoverDrill"?(t.has(this.scenario?.coverPieceId)&&(this.coverPocketed=!0),this.queenPocketed&&this.coverPocketed?(this.status="Queen covered successfully.",this.markComplete()):(this.status=this.queenPocketed?"Queen needs cover. Aim for the normal coin.":"Pocket the queen first.",this.coachHints?.show("queen",{tone:"warning",message:this.status}))):this.status=`Shot settled. Pocketed ${e.pocketedCount||0}.`;return this.emitChange(),this.getHud()}markComplete(){this.completedThisRun||(this.completedThisRun=!0,this.statsManager?.recordDrillComplete(this.type),this.coachHints?.show("pocket",{tone:"success",message:"Drill complete. Use Next Drill when you are ready."}))}getHud(){if(!this.active)return{practiceActive:!1,practiceTitle:"",practiceStatus:""};const e=Tc(this.type),t=this.statsManager?.getStats?.()||{};return{practiceActive:!0,tutorialActive:!1,practiceTitle:e.label,practiceStatus:this.status,currentTurn:"Practice",currentColor:"Training",matchModeLabel:"Practice / Tutorial",ruleModeLabel:e.label,playerOneName:"Practice",playerTwoName:"Training",playerOneScore:`${this.pocketedIds.size} pocketed`,playerTwoScore:`${Math.max(this.bestStreak,t.bestStreak||0)} best streak`,queenStatus:this.queenPocketed?"Queen pocketed":"Practice",turnNumber:1,shotNumber:this.shotsTaken,shotPower:"Ready",shotPowerRatio:0,foulStatus:"Practice",status:this.status,bannerTone:this.status.includes("complete")||this.status.includes("successfully")?"success":"default"}}emitChange(){this.callbacks.onChange?.(this.getHud())}}const xr={shotsTaken:0,pocketedCount:0,currentStreak:0,bestStreak:0,drillCompletions:{freePractice:0,pocketDrill:0,queenCoverDrill:0}};function Cc(){return typeof window<"u"&&!!window.localStorage}class PS{constructor(e=bi.practiceStats){this.storageKey=e,this.stats=this.load()}load(){if(!Cc())return this.createDefaultStats();try{const e=JSON.parse(window.localStorage.getItem(this.storageKey)||"null");return{...this.createDefaultStats(),...e||{},drillCompletions:{...xr.drillCompletions,...e?.drillCompletions||{}}}}catch{return this.createDefaultStats()}}createDefaultStats(){return{...xr,drillCompletions:{...xr.drillCompletions}}}save(){Cc()&&window.localStorage.setItem(this.storageKey,JSON.stringify(this.stats))}recordShot(){return this.stats.shotsTaken+=1,this.save(),this.getStats()}recordPocket(){return this.stats.pocketedCount+=1,this.stats.currentStreak+=1,this.stats.bestStreak=Math.max(this.stats.bestStreak,this.stats.currentStreak),this.save(),this.getStats()}resetCurrentStreak(){return this.stats.currentStreak=0,this.save(),this.getStats()}recordDrillComplete(e){return this.stats.drillCompletions[e]||(this.stats.drillCompletions[e]=0),this.stats.drillCompletions[e]+=1,this.save(),this.getStats()}reset(){return this.stats=this.createDefaultStats(),this.save(),this.getStats()}getStats(){return{...this.stats,drillCompletions:{...this.stats.drillCompletions}}}}const hs=[{id:"board",title:"Board Intro",instruction:"This is your carrom board. Coins slide flat across the surface.",hintKey:"place"},{id:"placement",title:"Place The Striker",instruction:"Drag the striker left or right on the highlighted baseline.",hintKey:"place"},{id:"aim",title:"Aim",instruction:"Drag from the striker to create an aim line.",hintKey:"aim"},{id:"power",title:"Power",instruction:"Pull farther until the power meter crosses the training mark.",hintKey:"power"},{id:"shoot",title:"Shoot",instruction:"Release to shoot using the real physics system.",hintKey:"power"},{id:"pocket",title:"Pocket Practice",instruction:"Pocket the highlighted coin into the marked pocket.",hintKey:"pocket"},{id:"queen",title:"Queen Cover",instruction:"Pocket the queen, then cover with the highlighted coin.",hintKey:"queen"},{id:"finish",title:"You Are Ready",instruction:"Play a match, challenge the bot, or keep practicing.",hintKey:"pocket"}];function Rc(){return typeof window<"u"&&!!window.localStorage}class AS{constructor({sceneRenderer:e,coachHints:t,callbacks:i={},storageKey:s=bi.tutorialCompleted}={}){this.sceneRenderer=e,this.coachHints=t,this.callbacks=i,this.storageKey=s,this.active=!1,this.stepIndex=0,this.queenPocketed=!1,this.coverPocketed=!1,this.pocketDrillComplete=!1,this.scenarioGroup=""}start(){return this.active=!0,this.stepIndex=0,this.queenPocketed=!1,this.coverPocketed=!1,this.pocketDrillComplete=!1,this.scenarioGroup="",this.applyCurrentScenario(),this.showCurrentHint(),this.emitChange(),this.getHud()}exit({complete:e=!1}={}){e&&this.markCompleted(),this.active=!1,this.sceneRenderer?.clearTrainingScenario?.(),this.coachHints?.clear(),this.emitChange()}next(){return this.active?(this.setStep(this.stepIndex+1),this.getHud()):this.getHud()}setStep(e){this.stepIndex=Math.min(Math.max(e,0),hs.length-1),this.applyCurrentScenario(),this.showCurrentHint(),this.emitChange()}applyCurrentScenario(){if(!this.active)return;const e=this.getCurrentStep(),t=e.id==="pocket"?"pocket":e.id==="queen"?"queen":"basic";if(t===this.scenarioGroup){this.sceneRenderer?.setInputEnabled?.(e.id!=="board"&&e.id!=="finish");return}this.scenarioGroup=t,e.id==="pocket"?this.sceneRenderer?.applyTrainingScenario?.(kh()):e.id==="queen"?(this.queenPocketed=!1,this.coverPocketed=!1,this.sceneRenderer?.applyTrainingScenario?.(Dh())):this.sceneRenderer?.applyTrainingScenario?.(Lh()),this.sceneRenderer?.prepareForTurn?.({baseline:"bottom",enabled:e.id!=="board"&&e.id!=="finish",silent:!0,rotateCamera:!1})}showCurrentHint(){const e=this.getCurrentStep();this.coachHints?.show(e.hintKey,{message:e.instruction})}handlePlacementChanged(){this.advanceIfStep("placement")}handleAimCreated(){this.advanceIfStep("aim")}handlePowerChange(e={}){this.getCurrentStep().id==="power"&&Number(e.ratio)>=.32&&this.next()}handleShotReleased(){this.active&&this.getCurrentStep().id==="shoot"&&this.coachHints?.show("pocket",{message:"Good release. Wait for the shot to settle."})}handlePiecePocketed(e){if(!(!this.active||!e?.id)){if(this.getCurrentStep().id==="pocket"&&e.id===mt.pocketCoin){this.pocketDrillComplete=!0,this.next();return}this.getCurrentStep().id==="queen"&&(e.id===mt.queen&&(this.queenPocketed=!0,this.coachHints?.show("queen",{message:"Queen pocketed. Now cover it with the normal coin.",tone:"warning"})),e.id===mt.coverCoin&&(this.coverPocketed=!0),this.queenPocketed&&this.coverPocketed&&this.next())}}handleShotSettled(e={}){if(!this.active)return this.getHud();const t=this.getCurrentStep(),i=new Set((e.pocketed||[]).map(s=>s.id));return t.id==="shoot"?(this.next(),this.getHud()):(t.id==="pocket"&&i.has(mt.pocketCoin)&&(this.pocketDrillComplete=!0,this.next()),t.id==="queen"&&(i.has(mt.queen)&&(this.queenPocketed=!0),i.has(mt.coverCoin)&&(this.coverPocketed=!0),this.queenPocketed&&this.coverPocketed&&this.next()),this.getHud())}advanceIfStep(e){this.active&&this.getCurrentStep().id===e&&this.next()}markCompleted(){Rc()&&window.localStorage.setItem(this.storageKey,"true")}isCompleted(){return Rc()&&window.localStorage.getItem(this.storageKey)==="true"}getCurrentStep(){return hs[this.stepIndex]||hs[0]}getHud(){if(!this.active)return{tutorialActive:!1,tutorialTitle:"",tutorialInstruction:""};const e=this.getCurrentStep();return{tutorialActive:!0,tutorialStepId:e.id,tutorialStepIndex:this.stepIndex,tutorialStepCount:hs.length,tutorialTitle:e.title,tutorialInstruction:e.instruction,practiceActive:!0,practiceTitle:"Tutorial",practiceStatus:e.instruction,currentTurn:"Tutorial",currentColor:"Training",matchModeLabel:"Practice / Tutorial",ruleModeLabel:e.title,playerOneName:"Tutorial",playerTwoName:"Coach",playerOneScore:`${this.stepIndex+1}/${hs.length}`,playerTwoScore:this.pocketDrillComplete?"Pocket done":"Learning",queenStatus:this.queenPocketed?"Queen pocketed":"Tutorial",turnNumber:1,shotNumber:this.stepIndex+1,shotPower:"Ready",shotPowerRatio:0,foulStatus:"Training",status:e.instruction,bannerTone:e.id==="finish"?"success":"default"}}emitChange(){this.callbacks.onChange?.(this.getHud())}}const Pc=["Local 2P","Vs Bot","Queen cover","Challenges","Cosmetics"];function bt({action:n,label:e,tone:t="secondary",disabled:i=!1,testId:s=""}){return`
    <button
      class="action-btn ${t}"
      type="button"
      data-action="${n}"
      ${s?`data-testid="${s}"`:""}
      ${i?'disabled aria-disabled="true"':""}
    ><span>${e}</span></button>
  `}class IS{render(){return`
      ${this.renderLoading()}
      ${this.renderMainMenu()}
      ${this.renderModeSelect()}
      ${this.renderLocalSetup()}
      ${this.renderPause()}
      ${this.renderRules()}
      ${this.renderSettings()}
      ${this.renderResult()}
      ${this.renderAbout()}
    `}renderLoading(){return`
      <section class="screen" data-screen="loading" data-testid="screen-loading" aria-label="Loading screen">
        <div class="home-card intro-card shimmer-panel">
          <div class="home-hero intro-hero">
            <div class="home-hero-copy">
              <span class="eyebrow">MH Horizon Premium</span>
              <h1>3D Carrom Royale</h1>
              <p class="intro-subtitle">Pocket. Cover. Conquer.</p>
              <p>A standalone premium carrom lounge with local matches, bot play, practice drills, challenges, and cosmetics.</p>
              <div class="gold-line" aria-hidden="true"></div>
              <div class="feature-chip-row" aria-label="Feature highlights">${Pc.map(t=>`<span>${t}</span>`).join("")}</div>
              <div class="home-actions">
                ${bt({action:"main-menu",label:"Start / Continue",tone:"primary",testId:"enter-main-menu"})}
              </div>
            </div>
            <div class="intro-emblem" aria-hidden="true">
              <div class="royale-orbit">
                <span class="orbit-ring ring-one"></span>
                <span class="orbit-ring ring-two"></span>
                <strong>CR</strong>
              </div>
              <div class="brand-signature" aria-label="Powered by MH HORIZON">
                <span class="brand-signature-label">Powered by</span>
                <span class="brand-signature-name">MH HORIZON</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `}renderMainMenu(){return`
      <section class="screen" data-screen="mainMenu" data-testid="screen-main-menu" aria-label="Main menu">
        <div class="home-card menu-panel">
          <div class="home-hero">
            <div class="home-hero-copy">
              <span class="eyebrow">Ivory Royale Lounge</span>
              <h2>3D Carrom Royale</h2>
              <p>A premium 3D carrom experience with smooth striker controls, bot play, challenge drills, queen cover rules, and cinematic ivory-gold visuals.</p>
              <div class="feature-chip-row" aria-label="Feature highlights">${Pc.map(t=>`<span>${t}</span>`).join("")}</div>
              <div class="home-actions">
                ${bt({action:"mode-select",label:"Start Match",tone:"primary",testId:"start-match"})}
                ${bt({action:"rules",label:"Rules",testId:"open-rules-main"})}
                ${bt({action:"settings",label:"Settings",testId:"open-settings-main"})}
                ${bt({action:"about",label:"About / Credits",testId:"open-about"})}
              </div>
            </div>
            <div class="home-hero-stats">
              <div class="home-stat">
                <span class="label">Suite</span>
                <strong>Premium Tabletop</strong>
              </div>
              <div class="home-stat">
                <span class="label">Rules</span>
                <strong>Classic + Free Capture</strong>
              </div>
              <div class="home-stat">
                <span class="label">Solo</span>
                <strong>Bot / Practice / Challenges</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    `}renderModeSelect(){return`
      <section class="screen" data-screen="modeSelect" data-testid="screen-mode-select" aria-label="Mode select">
        <div class="screen-heading">
          <span class="eyebrow">Choose Match Type</span>
          <h2>Select Your Table</h2>
        </div>
        <div class="mode-grid">${Wh.map((t,i)=>{const a={local:"2P",bot:"AI",practice:"DRL",challenges:"STAR",onlinePrivate:"NET",onlinePublic:"Q"}[t.id]||String(i+1);return`
        <article class="mode-select-card ${t.disabled?"is-disabled":"is-available"}">
          <div class="mode-card-emblem" aria-hidden="true">${a}</div>
          <span class="status-pill">${t.status}</span>
          <h3>${t.title}</h3>
          <p>${t.description}</p>
          ${bt({action:t.action||"disabled-mode",label:t.disabled?t.status:"Select",tone:t.disabled?"ghost":"primary",disabled:t.disabled,testId:t.id==="local"?"select-local-mode":""})}
        </article>
      `}).join("")}</div>
        <div class="screen-actions">
          ${bt({action:"main-menu",label:"Back",testId:"mode-back"})}
        </div>
      </section>
    `}renderLocalSetup(){return`
      <section class="screen" data-screen="localSetup" data-testid="screen-local-setup" aria-label="Local match setup">
        <form class="setup-panel home-card" data-form="local-setup">
          <div class="setup-heading">
            <span class="eyebrow">Local Table</span>
            <h2>Match Setup</h2>
            <p>Set the match type, names, coin assignment, and table style.</p>
          </div>
          <div class="option-group" aria-label="Match type selector">
            <span class="option-label">Match Type</span>
            <div class="segmented-control">
              <button type="button" data-choice-group="matchMode" data-choice-value="local2p" class="is-selected">Local 2 Player</button>
              <button type="button" data-choice-group="matchMode" data-choice-value="vsBot">Vs Bot</button>
            </div>
          </div>
          <div class="setup-player-grid">
            <label class="player-setup-card">
              <span class="player-medallion">P1</span>
              <span class="text-field">
                <span data-player-one-label>Player 1</span>
                <input id="playerOneName" data-testid="player-one-name" type="text" maxlength="24" autocomplete="off" placeholder="Player 1" />
              </span>
              <small>Color follows setup</small>
            </label>
            <label class="player-setup-card">
              <span class="player-medallion player-medallion-dark">P2</span>
              <span class="text-field">
                <span data-player-two-label>Player 2</span>
                <input id="playerTwoName" data-testid="player-two-name" type="text" maxlength="24" autocomplete="off" placeholder="Player 2" />
              </span>
              <small data-player-two-helper>Color follows setup</small>
            </label>
          </div>
          <div class="option-group" data-bot-difficulty-section aria-label="Bot difficulty selector" hidden>
            <span class="option-label">Bot Difficulty</span>
            <div class="segmented-control">
              <button type="button" data-choice-group="botDifficulty" data-choice-value="easy">Easy</button>
              <button type="button" data-choice-group="botDifficulty" data-choice-value="normal" class="is-selected">Normal</button>
              <button type="button" data-choice-group="botDifficulty" data-choice-value="hard">Hard</button>
            </div>
          </div>
          <div class="setup-divider" aria-hidden="true"></div>
          <div class="option-group" aria-label="Match rules selector">
            <span class="option-label">Match Rules</span>
            <div class="segmented-control">
              <button type="button" data-choice-group="ruleMode" data-choice-value="classic" class="is-selected">Classic Carrom</button>
              <button type="button" data-choice-group="ruleMode" data-choice-value="freeCapture">Free Capture</button>
            </div>
            <p class="modal-lead" data-rule-mode-helper>Assigned colors, first-pocket, and random color options apply in Classic Carrom.</p>
          </div>
          <div class="option-group" data-coin-side-section aria-label="Coin side selector">
            <span class="option-label">Coin Side</span>
            <div class="segmented-control">
              <button type="button" data-choice-group="coinSide" data-choice-value="p1White" class="is-selected">Player 1 White</button>
              <button type="button" data-choice-group="coinSide" data-choice-value="p1Black">Player 1 Black</button>
              <button type="button" data-choice-group="coinSide" data-choice-value="random">Random</button>
              <button type="button" data-choice-group="coinSide" data-choice-value="firstPocket">Open / First Pocket</button>
            </div>
          </div>
          <div class="option-group" aria-label="Board style selector">
            <span class="option-label">Board Style</span>
            <div class="segmented-control">
              <button type="button" data-choice-group="boardStyle" data-choice-value="ivory" class="is-selected">Ivory Royale Board</button>
              <button type="button" data-choice-group="boardStyle" data-choice-value="wood">Tournament Wood</button>
            </div>
          </div>
          <div class="setup-summary-strip">
            <span>Local Rules</span>
            <strong>Turns, fouls, queen cover, and winner detection are active</strong>
          </div>
          <div class="screen-actions split">
            ${bt({action:"mode-select",label:"Back",testId:"setup-back"})}
            ${bt({action:"start-local-shell-match",label:"<span data-start-match-label>Start Local Match</span>",tone:"primary",testId:"start-local-match"})}
          </div>
        </form>
      </section>
    `}renderPause(){return`
      <section class="screen" data-screen="paused" data-testid="screen-paused" aria-label="Pause panel">
        <div class="modal-panel compact-panel shimmer-panel">
          <span class="eyebrow">Table Hold</span>
          <h2>Match Paused</h2>
          <p class="modal-lead">The local match is held in place while the table waits for your next action.</p>
          <div class="menu-actions stacked">
            ${bt({action:"resume-match",label:"Resume",tone:"primary",testId:"resume-match"})}
            ${bt({action:"restart-match",label:"Restart Match"})}
            ${bt({action:"settings",label:"Settings"})}
            ${bt({action:"rules",label:"Rules"})}
            ${bt({action:"main-menu",label:"Back to Setup",tone:"danger"})}
          </div>
        </div>
      </section>
    `}renderRules(){return`
      <section class="screen" data-screen="rules" data-testid="screen-rules" aria-label="Rules and help">
        <div class="modal-panel wide-panel">
          <span class="eyebrow">Rules / Help</span>
          <h2>How The Table Plays</h2>
          <p class="modal-lead">Place the striker, aim with a pull, pocket your assigned coins, and cover the queen to finish.</p>
          <div class="rules-grid">${Lc.map(t=>`
      <section class="rules-section">
        <h3>${t.title}</h3>
        <p>${t.body}</p>
      </section>
    `).join("")}</div>
          <div class="screen-actions">
            ${bt({action:"return-from-overlay",label:"Back",testId:"rules-back"})}
          </div>
        </div>
      </section>
    `}renderSettings(){return`
      <section class="screen" data-screen="settings" data-testid="screen-settings" aria-label="Settings panel">
        <div class="modal-panel settings-panel">
          <span class="eyebrow">Settings</span>
          <h2>Table Preferences</h2>
          <p class="modal-lead">These preferences persist locally and adjust the table immediately.</p>
          <div class="settings-list">
            <label class="toggle-row">
              <span><strong>Sound</strong><small>Enable generated table cues.</small></span>
              <input type="checkbox" data-setting-toggle="sound" />
            </label>
            <label class="toggle-row">
              <span><strong>Music</strong><small>Stored for future lounge ambience.</small></span>
              <input type="checkbox" data-setting-toggle="music" />
            </label>
            <label class="toggle-row">
              <span><strong>Camera Motion</strong><small>Allow cinematic board movement.</small></span>
              <input type="checkbox" data-setting-toggle="cameraMotion" />
            </label>
            <label class="toggle-row">
              <span><strong>Reduced Effects</strong><small>Calms major animations and VFX.</small></span>
              <input type="checkbox" data-setting-toggle="reducedEffects" />
            </label>
          </div>
          <div class="option-group">
            <span class="option-label">Theme</span>
            <div class="segmented-control" data-setting-group="themeId">${Object.values(ps).map(t=>`
      <button type="button" data-setting-choice="themeId" data-setting-value="${t.id}">${t.label}</button>
    `).join("")}</div>
          </div>
          <div class="option-group">
            <span class="option-label">Quality</span>
            <div class="segmented-control" data-setting-group="quality">
              <button type="button" data-setting-choice="quality" data-setting-value="auto">Auto</button>
              <button type="button" data-setting-choice="quality" data-setting-value="high">High</button>
              <button type="button" data-setting-choice="quality" data-setting-value="balanced">Balanced</button>
              <button type="button" data-setting-choice="quality" data-setting-value="battery">Battery Saver</button>
            </div>
          </div>
          <div class="screen-actions split">
            ${bt({action:"reset-settings",label:"Reset Settings"})}
            ${bt({action:"return-from-overlay",label:"Back",tone:"primary",testId:"settings-back"})}
          </div>
        </div>
      </section>
    `}renderResult(){return`
      <section class="screen" data-screen="result" data-testid="screen-result" aria-label="Match result">
        <div class="modal-panel result-panel shimmer-panel">
          <span class="eyebrow">Match Result</span>
          <div class="winner-seal" aria-hidden="true">WIN</div>
          <h2><span data-result-winner>Player 1</span> <span data-result-outcome>Wins</span></h2>
          <p class="modal-lead"><span data-result-winner-color>White</span> closes the table after a local 2-player match.</p>
          <div class="result-grid">
            <div><span>Final Score</span><strong data-result-score>0 - 0</strong></div>
            <div><span>Colors</span><strong data-result-colors>Player 1: White | Player 2: Black</strong></div>
            <div><span>Queen</span><strong data-result-queen>On board</strong></div>
            <div><span>Turns</span><strong data-result-turns>1</strong></div>
            <div><span>Shots</span><strong data-result-shots>0</strong></div>
          </div>
          <div class="screen-actions split">
            ${bt({action:"rematch-shell",label:"Rematch",tone:"primary",testId:"result-rematch"})}
            ${bt({action:"open-local-setup",label:"Back to Setup",testId:"result-setup"})}
            ${bt({action:"main-menu",label:"Main Menu",testId:"result-menu"})}
          </div>
        </div>
      </section>
    `}renderAbout(){return`
      <section class="screen" data-screen="about" data-testid="screen-about" aria-label="About and credits">
        <div class="modal-panel compact-panel">
          <span class="eyebrow">About / Credits</span>
          <h2>3D Carrom Royale</h2>
          <p class="modal-lead">Standalone premium tabletop experience built for real physics, cinematic shots, bot play, challenge drills, and mobile-friendly local matches.</p>
          <div class="home-doc-card">
            <strong>Visual family</strong>
            <span>Inspired by premium board-game presentation, with its own carrom lounge identity.</span>
          </div>
          <div class="screen-actions">
            ${bt({action:"return-from-overlay",label:"Back",testId:"about-back"})}
          </div>
        </div>
      </section>
    `}}const LS={auto:"Auto",high:"High",balanced:"Balanced",battery:"Battery Saver"},kS={easy:"Easy",normal:"Normal",hard:"Hard"};function DS(){return Object.values(ps).map(n=>`
    <button type="button" data-setting-choice="themeId" data-setting-value="${n.id}" aria-label="Use ${n.label} theme">${n.label}</button>
  `).join("")}function OS(){return Object.entries(LS).map(([n,e])=>`
    <button type="button" data-setting-choice="quality" data-setting-value="${n}" aria-label="Use ${e} quality">${e}</button>
  `).join("")}function NS(){return Lc.map(n=>`
    <section class="rules-section side-rules-card">
      <h3>${n.title}</h3>
      <p>${n.body}</p>
    </section>
  `).join("")}function US(){return Object.values(bs).map(n=>`
    <button type="button" data-choice-group="classicRuleVariant" data-choice-value="${n.id}" aria-label="Use ${n.label} Classic rules">
      <span>${n.label}</span>
      <small>${n.helper}</small>
    </button>
  `).join("")}function FS(){return Object.values(bs).map(n=>`
    <button type="button" data-online-choice-group="classicRuleVariant" data-online-choice-value="${n.id}" aria-label="Use ${n.label} Classic rules online">
      <span>${n.label}</span>
      <small>${n.helper}</small>
    </button>
  `).join("")}function BS(){return[...Object.values(bs).map(n=>`
      <button type="button" data-public-choice-group="classicRuleVariant" data-public-choice-value="${n.id}" aria-label="Search for ${n.label} Classic rules">
        <span>${n.label}</span>
        <small>${n.helper}</small>
      </button>
    `),`
      <button type="button" class="is-selected" data-public-choice-group="classicRuleVariant" data-public-choice-value="any" aria-label="Search any Classic rule style">
        <span>Any</span>
        <small>Match compatible public players faster.</small>
      </button>
    `].join("")}function zS(){return Object.values(xo).map(n=>`
    <button type="button" data-choice-group="practiceType" data-choice-value="${n.id}" aria-label="Use ${n.label}">
      <span>${n.label}</span>
      <small>${n.helper}</small>
    </button>
  `).join("")}function HS(){return Ai.map(n=>`
    <button class="challenge-card" type="button" data-action="select-challenge" data-challenge-id="${n.id}" aria-label="Select ${n.title}">
      <span class="status-pill">${n.difficulty}</span>
      <strong>${n.title}</strong>
      <small>${n.objectiveText}</small>
      <b data-challenge-stars="${n.id}">0 stars</b>
    </button>
  `).join("")}function VS(){return pi.map(n=>`
    <button type="button" data-action="cosmetic-category" data-cosmetic-category="${n.id}" data-cosmetic-category-tab="${n.id}" aria-label="Open ${n.label} cosmetics">
      <span>${n.label}</span>
      <small>${n.description}</small>
    </button>
  `).join("")}function GS(){return pi.flatMap(n=>Er(n.id).map(e=>`
    <button
      class="cosmetic-card"
      type="button"
      data-action="preview-cosmetic"
      data-cosmetic-card
      data-cosmetic-category="${e.category}"
      data-cosmetic-id="${e.id}"
      data-cosmetic-status="${e.status}"
      aria-label="Preview ${e.name}"
    >
      <span class="status-pill">${Fc[e.status]||e.status}</span>
      <strong>${e.name}</strong>
      <small>${e.description}</small>
      <b>${Bc[e.rarity]||e.rarity}</b>
    </button>
  `)).join("")}class qS{render(){return`
      <section class="playing-hud" data-testid="playing-hud" aria-label="Playing HUD">
        <button
          class="hud-toggle"
          type="button"
          data-action="toggle-hud"
          aria-expanded="true"
          aria-controls="carromHudPanel"
          aria-label="Hide side panel"
        >
          <span class="hud-toggle-icon" aria-hidden="true"></span>
          <span class="hud-toggle-label">Hide Panel</span>
        </button>

        <aside id="carromHudPanel" class="hud-panel" aria-label="Match side panel">
          <div class="brand-panel">
            <span class="eyebrow">Premium Match Suite</span>
            <h2>Carrom Royale</h2>
            <p>Set up, play, tune, and review the local table from this premium side panel.</p>
            <div class="brand-signature" aria-label="Powered by MH HORIZON">
              <span class="brand-signature-label">Powered by</span>
              <strong class="brand-signature-name">MH HORIZON</strong>
            </div>
          </div>

          <nav class="side-panel-nav" aria-label="Carrom side panel sections">
            <button class="panel-tab is-active" type="button" data-action="open-local-setup" data-panel-tab="setup" aria-label="Open match setup">Setup</button>
            <button class="panel-tab" type="button" data-action="panel-match" data-panel-tab="match" aria-label="Open match status">Match</button>
            <button class="panel-tab" type="button" data-action="open-practice" data-panel-tab="practice" aria-label="Open practice and tutorial">Practice</button>
            <button class="panel-tab" type="button" data-action="open-challenges" data-panel-tab="challenges" aria-label="Open challenges">Challenges</button>
            <button class="panel-tab" type="button" data-action="open-online" data-panel-tab="online" aria-label="Open online private rooms">Online</button>
            <button class="panel-tab" type="button" data-action="open-public-matchmaking" data-panel-tab="onlinePublic" aria-label="Open public matchmaking">Public</button>
            <button class="panel-tab" type="button" data-action="open-customize" data-panel-tab="customize" aria-label="Open cosmetics customization">Customize</button>
            <button class="panel-tab" type="button" data-action="rules" data-panel-tab="rules" aria-label="Open rules help">Rules</button>
            <button class="panel-tab" type="button" data-action="settings" data-panel-tab="settings" aria-label="Open settings">Settings</button>
          </nav>

          <div class="side-panel-section is-active" data-panel-section="setup">
            <div class="service-card side-setup-card">
              <span class="eyebrow" data-setup-eyebrow>Local 2 Player</span>
              <h3>Match Setup</h3>
              <p>Choose match type, names, and table rules. The panel will auto-hide for play.</p>

              <div class="option-group" aria-label="Match type selector">
                <span class="option-label">Match Type</span>
                <div class="segmented-control">
                  <button type="button" data-choice-group="matchMode" data-choice-value="local2p" class="is-selected" aria-label="Use local two player mode">Local 2 Player</button>
                  <button type="button" data-choice-group="matchMode" data-choice-value="vsBot" aria-label="Use human versus bot mode">Vs Bot</button>
                </div>
              </div>

              <div class="setup-player-grid side-setup-grid">
                <label class="player-setup-card">
                  <span class="player-medallion">P1</span>
                  <span class="text-field">
                    <span data-player-one-label>Player 1</span>
                    <input id="hudPlayerOneName" data-player-name="one" data-testid="player-one-name" type="text" maxlength="24" autocomplete="off" placeholder="Player 1" />
                  </span>
                  <small>Color follows setup</small>
                </label>
                <label class="player-setup-card">
                  <span class="player-medallion player-medallion-dark">P2</span>
                  <span class="text-field">
                    <span data-player-two-label>Player 2</span>
                    <input id="hudPlayerTwoName" data-player-name="two" data-testid="player-two-name" type="text" maxlength="24" autocomplete="off" placeholder="Player 2" />
                  </span>
                  <small data-player-two-helper>Color follows setup</small>
                </label>
              </div>

              <div class="option-group" data-bot-difficulty-section aria-label="Bot difficulty selector" hidden>
                <span class="option-label">Bot Difficulty</span>
                <div class="segmented-control">
                  <button type="button" data-choice-group="botDifficulty" data-choice-value="easy" aria-label="Use Easy Bot difficulty">Easy</button>
                  <button type="button" data-choice-group="botDifficulty" data-choice-value="normal" class="is-selected" aria-label="Use Normal Bot difficulty">Normal</button>
                  <button type="button" data-choice-group="botDifficulty" data-choice-value="hard" aria-label="Use Hard Bot difficulty">Hard</button>
                </div>
              </div>

              <div class="option-group" aria-label="Match rules selector">
                <span class="option-label">Match Rules</span>
                <div class="segmented-control">
                  <button type="button" data-choice-group="ruleMode" data-choice-value="classic" class="is-selected" aria-label="Use classic assigned-color carrom rules">Classic Carrom</button>
                  <button type="button" data-choice-group="ruleMode" data-choice-value="freeCapture" aria-label="Use Free Capture rules where any coin scores">Free Capture</button>
                </div>
                <p class="modal-lead" data-rule-mode-helper>Assigned colors, first-pocket, and random color options apply in Classic Carrom.</p>
              </div>

              <div class="option-group" data-classic-rule-section aria-label="Classic rule style selector">
                <span class="option-label">Classic Rule Style</span>
                <div class="segmented-control segmented-control-cards">
                  ${US()}
                </div>
              </div>

              <div class="option-group" data-coin-side-section aria-label="Coin side selector">
                <span class="option-label">Coin Side</span>
                <div class="segmented-control">
                  <button type="button" data-choice-group="coinSide" data-choice-value="p1White" class="is-selected" aria-label="Assign Player 1 white coins">P1 White</button>
                  <button type="button" data-choice-group="coinSide" data-choice-value="p1Black" aria-label="Assign Player 1 black coins">P1 Black</button>
                  <button type="button" data-choice-group="coinSide" data-choice-value="random" aria-label="Randomize coin colors and use point scoring">Random</button>
                  <button type="button" data-choice-group="coinSide" data-choice-value="firstPocket" aria-label="Leave colors open until the first white or black coin is pocketed">Open / First Pocket</button>
                </div>
              </div>

              <div class="option-group" aria-label="Board style selector">
                <span class="option-label">Board Style</span>
                <div class="segmented-control">
                  <button type="button" data-choice-group="boardStyle" data-choice-value="ivory" class="is-selected" aria-label="Use Ivory Royale board style">Ivory Royale</button>
                  <button type="button" data-choice-group="boardStyle" data-choice-value="wood" aria-label="Use Tournament Wood board style">Tournament Wood</button>
                  <button type="button" data-choice-group="boardStyle" data-choice-value="midnight" aria-label="Use Midnight Gold board style">Midnight Gold</button>
                </div>
              </div>

              <div class="setup-summary-strip side-setup-summary">
                <span data-setup-mode-label>Rules</span>
                <strong data-setup-mode-note>Fixed sides use coin counts. Random enables point scoring.</strong>
              </div>

              <div class="controls-card compact-controls">
                <button class="action-btn primary" type="button" data-action="start-local-shell-match" data-testid="start-local-match"><span data-start-match-label>Start Local Match</span></button>
                <button class="action-btn secondary" type="button" data-action="open-customize" data-testid="open-customize"><span>Customize</span></button>
                <button class="action-btn secondary" type="button" data-action="about" data-testid="open-about"><span>About / Credits</span></button>
              </div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="match">
            <div class="status-card">
              <div class="status-row">
                <span class="label">Mode</span>
                <strong data-hud-match-mode>Local 2 Player</strong>
              </div>
              <div class="status-row" data-hud-bot-row hidden>
                <span class="label">Bot</span>
                <strong><span data-hud-bot-name>Bot</span> <span data-hud-bot-difficulty></span></strong>
              </div>
              <div class="status-row">
                <span class="label">Current Turn</span>
                <strong data-hud-current-turn>Player 1</strong>
              </div>
              <div class="status-row">
                <span class="label">Rule Mode</span>
                <strong data-hud-rule-mode>Classic Carrom</strong>
              </div>
              <div class="status-row" data-hud-due-row hidden>
                <span class="label">Due</span>
                <strong data-hud-due>Clear</strong>
              </div>
              <div class="status-row" data-hud-challenge-row hidden>
                <span class="label">Challenge</span>
                <strong><span data-hud-challenge-title></span> <span data-hud-challenge-shots></span></strong>
              </div>
              <div class="status-row" data-hud-practice-row hidden>
                <span class="label">Practice</span>
                <strong data-hud-practice-title></strong>
              </div>
              <div class="status-row" data-hud-online-row hidden>
                <span class="label">Online</span>
                <strong><span data-hud-online-room></span> <span data-hud-online-connection></span></strong>
              </div>
              <div class="status-row" data-hud-online-timer-row hidden>
                <span class="label">Timer</span>
                <strong data-hud-online-timer>Paused</strong>
              </div>
              <div class="status-row">
                <span class="label">Color</span>
                <strong data-hud-current-color>White</strong>
              </div>
              <div class="status-row">
                <span class="label">Turn / Shot</span>
                <strong><span data-hud-turn>1</span> / <span data-hud-shot>0</span></strong>
              </div>
              <div class="status-row" aria-live="polite">
                <span class="label">State</span>
                <strong data-hud-status>Place striker on the baseline, then drag to aim.</strong>
              </div>
            </div>

            <div class="match-feedback-banner" data-hud-banner data-tone="default" aria-live="polite">Ready for local match.</div>

            <div class="service-card player-card-stack">
              <span class="eyebrow">Players</span>
              <div class="player-hud-card is-active" data-hud-player-card="player-1">
                <span class="player-medallion">P1</span>
                <span>
                  <small data-hud-p1-name>Player 1</small>
                  <strong><span data-hud-p1-score>0/9</span> <span data-hud-p1-score-label>pocketed</span></strong>
                  <b class="point-pill" data-hud-p1-points>0 pts</b>
                  <em data-hud-p1-color>White</em>
                </span>
              </div>
              <div class="player-hud-card" data-hud-player-card="player-2">
                <span class="player-medallion player-medallion-dark">P2</span>
                <span>
                  <small data-hud-p2-name>Player 2</small>
                  <strong><span data-hud-p2-score>0/9</span> <span data-hud-p2-score-label>pocketed</span></strong>
                  <b class="point-pill" data-hud-p2-points>0 pts</b>
                  <em data-hud-p2-color>Black</em>
                </span>
              </div>
            </div>

            <div class="service-card">
              <span class="eyebrow">Table Status</span>
              <div class="meta-grid">
                <div class="meta-row">
                  <span class="label">Queen</span>
                  <strong data-hud-queen>On board</strong>
                </div>
                <div class="meta-row">
                  <span class="label">Remaining</span>
                  <strong><span data-hud-p1-remaining>9</span> / <span data-hud-p2-remaining>9</span></strong>
                </div>
                <div class="meta-row">
                  <span class="label">Foul</span>
                  <strong data-hud-foul>Clear</strong>
                </div>
                <div class="meta-row" data-points-row>
                  <span class="label">Points</span>
                  <strong data-hud-points>Coins mode</strong>
                </div>
                <div class="meta-row">
                  <span class="label">Shot Power</span>
                  <strong data-hud-power>Waiting</strong>
                </div>
                <div class="power-meter" aria-label="Shot power meter">
                  <span class="power-meter-fill" data-hud-power-fill></span>
                </div>
                <div class="meta-row">
                  <span class="label">Stage</span>
                  <strong>Local rules</strong>
                </div>
              </div>
            </div>

            <div class="service-card physics-debug-controls" aria-label="Debug physics controls">
              <span class="eyebrow">Debug Physics</span>
              <div class="controls-card compact-controls">
                <button class="action-btn primary" type="button" data-action="test-physics-shot" data-testid="test-physics-shot"><span>Debug Impulse</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-physics" data-testid="reset-physics"><span>Reset Physics</span></button>
              </div>
            </div>

            <div class="controls-card">
              <button class="action-btn secondary" type="button" data-action="pause" data-testid="pause-match"><span>Pause</span></button>
              <button class="action-btn secondary" type="button" data-action="settings" data-testid="hud-settings"><span>Settings</span></button>
              <button class="action-btn secondary" type="button" data-action="rules" data-testid="hud-rules"><span>Rules</span></button>
              <button class="action-btn danger" type="button" data-action="main-menu" data-testid="hud-menu"><span>Setup</span></button>
              <button class="action-btn danger" type="button" data-action="quit-match" data-testid="quit-match"><span>Quit Match</span></button>
              <button class="action-btn danger" type="button" data-action="leave-online-room" data-online-only hidden><span>Leave Room</span></button>
            </div>

            <button class="dev-result-btn physics-debug-controls" type="button" data-action="debug-result" data-testid="show-result-debug">
              Result Panel
            </button>
          </div>

          <div class="side-panel-section" data-panel-section="practice">
            <div class="service-card">
              <span class="eyebrow">Practice / Tutorial</span>
              <h3>Train The Table</h3>
              <p>Use real physics without match pressure. Reset drills, move to the next setup, or exit back to setup.</p>
              <div class="option-group" aria-label="Practice type selector">
                <span class="option-label">Practice Type</span>
                <div class="segmented-control segmented-control-cards">
                  ${zS()}
                </div>
              </div>
              <div class="match-feedback-banner" data-practice-status data-tone="default">Choose a practice drill.</div>
              <div class="tutorial-card" data-tutorial-card hidden>
                <div class="tutorial-card-head">
                  <span class="eyebrow">Guided Tutorial</span>
                  <b data-tutorial-step>1/8</b>
                </div>
                <strong data-tutorial-title>Board Intro</strong>
                <p data-tutorial-instruction>This is your carrom board.</p>
                <div class="controls-card compact-controls">
                  <button class="action-btn secondary" type="button" data-action="tutorial-next"><span>Next Step</span></button>
                  <button class="action-btn danger" type="button" data-action="tutorial-exit"><span>Exit Tutorial</span></button>
                </div>
                <div class="controls-card compact-controls" data-tutorial-finish-actions hidden>
                  <button class="action-btn primary" type="button" data-action="tutorial-local"><span>Play Local Match</span></button>
                  <button class="action-btn secondary" type="button" data-action="tutorial-bot"><span>Play Vs Bot</span></button>
                  <button class="action-btn secondary" type="button" data-action="tutorial-practice"><span>Practice More</span></button>
                  <button class="action-btn secondary" type="button" data-action="tutorial-menu"><span>Main Menu</span></button>
                </div>
              </div>
              <div class="controls-card compact-controls">
                <button class="action-btn primary" type="button" data-action="start-practice"><span>Start Practice</span></button>
                <button class="action-btn secondary" type="button" data-action="start-tutorial"><span>Start Tutorial</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-practice"><span>Reset Drill</span></button>
                <button class="action-btn secondary" type="button" data-action="next-practice"><span>Next Drill</span></button>
                <button class="action-btn danger" type="button" data-action="exit-practice"><span>Exit Practice</span></button>
              </div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="challenges">
            <div class="service-card">
              <span class="eyebrow">Challenges</span>
              <h3>Solo Shot Trials</h3>
              <p>Complete curated shot objectives, earn stars, and keep progress locally on this device.</p>
              <div class="challenge-grid" data-challenge-list>${HS()}</div>
              <div class="challenge-detail-card" data-challenge-detail>
                <span class="status-pill" data-challenge-detail-difficulty>easy</span>
                <strong data-challenge-detail-title>Easy Pocket I</strong>
                <p data-challenge-detail-objective>Pocket the white coin in 1 shot.</p>
                <small data-challenge-detail-progress>Best: 0 stars</small>
              </div>
              <div class="match-feedback-banner" data-challenge-result data-tone="default">Select a challenge.</div>
              <div class="controls-card compact-controls">
                <button class="action-btn primary" type="button" data-action="start-challenge"><span>Start Challenge</span></button>
                <button class="action-btn secondary" type="button" data-action="retry-challenge"><span>Retry</span></button>
                <button class="action-btn secondary" type="button" data-action="next-challenge"><span>Next</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-challenge-progress"><span>Reset Stars</span></button>
                <button class="action-btn danger" type="button" data-action="exit-challenge"><span>Exit Challenge</span></button>
              </div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="online">
            <div class="service-card online-suite">
              <span class="eyebrow">Online Private</span>
              <h3>Private Room</h3>
              <p>Create a room code or join a friend. Server-owned turns and rules keep both tables synced.</p>

              <div class="online-view is-active" data-online-view="menu">
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="online-show-create"><span>Create Room</span></button>
                  <button class="action-btn secondary" type="button" data-action="online-show-join"><span>Join Room</span></button>
                </div>
              </div>

              <div class="online-view" data-online-view="reconnect">
                <div class="online-room-code-card">
                  <span class="label">Previous Session</span>
                  <strong data-online-reconnect-room>-----</strong>
                  <small>Player: <span data-online-reconnect-player>Player</span></small>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="reconnect-online-session"><span>Reconnect</span></button>
                  <button class="action-btn secondary" type="button" data-action="discard-online-session"><span>Discard Session</span></button>
                </div>
              </div>

              <div class="online-view" data-online-view="create">
                <label class="text-field">
                  <span>Player Name</span>
                  <input id="onlineHostName" data-online-player-name type="text" maxlength="24" autocomplete="off" placeholder="Host" />
                </label>
                <div class="option-group">
                  <span class="option-label">Rules</span>
                  <div class="segmented-control">
                    <button type="button" class="is-selected" data-online-choice-group="ruleMode" data-online-choice-value="classic">Classic</button>
                    <button type="button" data-online-choice-group="ruleMode" data-online-choice-value="freeCapture">Free Capture</button>
                  </div>
                </div>
                <div class="option-group" data-online-classic-section>
                  <span class="option-label">Classic Rule Style</span>
                  <div class="segmented-control segmented-control-cards">
                    ${FS()}
                  </div>
                </div>
                <div class="option-group" data-online-coin-section>
                  <span class="option-label">Coin Side</span>
                  <div class="segmented-control">
                    <button type="button" class="is-selected" data-online-choice-group="coinAssignmentMode" data-online-choice-value="p1White">Host White</button>
                    <button type="button" data-online-choice-group="coinAssignmentMode" data-online-choice-value="p1Black">Host Black</button>
                    <button type="button" data-online-choice-group="coinAssignmentMode" data-online-choice-value="random">Random</button>
                    <button type="button" data-online-choice-group="coinAssignmentMode" data-online-choice-value="firstPocket">Open / First Pocket</button>
                  </div>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="create-online-room"><span>Create Room</span></button>
                  <button class="action-btn secondary" type="button" data-action="online-show-menu"><span>Back</span></button>
                </div>
              </div>

              <div class="online-view" data-online-view="join">
                <label class="text-field">
                  <span>Player Name</span>
                  <input id="onlineGuestName" data-online-join-name type="text" maxlength="24" autocomplete="off" placeholder="Guest" />
                </label>
                <label class="text-field">
                  <span>Room Code</span>
                  <input id="onlineRoomCode" data-online-room-code type="text" maxlength="8" autocomplete="off" placeholder="A7KQ2" />
                </label>
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="join-online-room"><span>Join Room</span></button>
                  <button class="action-btn secondary" type="button" data-action="online-show-menu"><span>Back</span></button>
                </div>
              </div>

              <div class="online-view" data-online-view="lobby">
                <div class="online-room-code-card">
                  <span class="label">Room Code</span>
                  <strong data-online-room-code-label>-----</strong>
                  <button class="action-btn secondary" type="button" data-action="copy-online-room-code"><span>Copy</span></button>
                  <button class="action-btn primary" type="button" data-action="copy-online-room-link"><span>Share Link</span></button>
                </div>
                <div class="status-card compact-status-card">
                  <div class="status-row"><span class="label">Host</span><strong data-online-host>Waiting</strong></div>
                  <div class="status-row"><span class="label">Guest</span><strong data-online-guest>Waiting</strong></div>
                  <div class="status-row"><span class="label">Rules</span><strong data-online-rules>Classic / Casual</strong></div>
                  <div class="status-row"><span class="label">Status</span><strong data-online-status>Lobby</strong></div>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="start-online-match" data-online-host-only><span>Start Match</span></button>
                  <button class="action-btn danger" type="button" data-action="leave-online-room"><span>Leave Room</span></button>
                </div>
              </div>

              <div class="online-view" data-online-view="playing">
                <div class="status-card compact-status-card">
                  <div class="status-row"><span class="label">Room</span><strong data-online-playing-room>-----</strong></div>
                  <div class="status-row"><span class="label">Connection</span><strong data-online-connection>Offline</strong></div>
                  <div class="status-row"><span class="label">Turn</span><strong data-online-turn>Waiting</strong></div>
                  <div class="status-row" data-online-timer-row hidden><span class="label">Timer</span><strong data-online-timer>Paused</strong></div>
                  <div class="status-row" data-online-grace-row hidden><span class="label">Reconnect</span><strong data-online-disconnect-countdown>0:00</strong></div>
                  <div class="status-row" data-online-rematch-row hidden><span class="label">Rematch</span><strong data-online-rematch-status>No rematch request</strong></div>
                  <div class="status-row online-debug-row" data-online-debug-row hidden><span class="label">Debug</span><strong data-online-debug-status>v0 / 0ms</strong></div>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn secondary online-debug-row" type="button" data-action="refresh-online-state" data-online-debug-row hidden><span>Force Snapshot</span></button>
                  <button class="action-btn primary" type="button" data-action="request-online-rematch" hidden><span>Request Rematch</span></button>
                  <button class="action-btn primary" type="button" data-action="accept-online-rematch" data-online-rematch-answer hidden><span>Accept Rematch</span></button>
                  <button class="action-btn secondary" type="button" data-action="decline-online-rematch" data-online-rematch-answer hidden><span>Decline</span></button>
                  <button class="action-btn danger" type="button" data-action="leave-online-room"><span>Leave Room</span></button>
                </div>
              </div>

              <div class="match-feedback-banner" data-online-message data-tone="default">Create or join a private room.</div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="onlinePublic">
            <div class="service-card online-suite public-matchmaking-suite">
              <span class="eyebrow">Online Public</span>
              <h3>Public Matchmaking</h3>
              <p>Find a casual 3D Carrom opponent. Matched games use the same server-owned turns and rules as private rooms.</p>

              <div class="public-view is-active" data-public-view="form">
                <label class="text-field">
                  <span>Display Name</span>
                  <input id="publicPlayerName" data-public-player-name type="text" maxlength="24" autocomplete="off" placeholder="Player" />
                </label>
                <div class="option-group">
                  <span class="option-label">Rule Mode</span>
                  <div class="segmented-control">
                    <button type="button" data-public-choice-group="ruleMode" data-public-choice-value="classic">Classic</button>
                    <button type="button" data-public-choice-group="ruleMode" data-public-choice-value="freeCapture">Free Capture</button>
                    <button type="button" class="is-selected" data-public-choice-group="ruleMode" data-public-choice-value="any">Any</button>
                  </div>
                </div>
                <div class="option-group" data-public-classic-section>
                  <span class="option-label">Classic Rule Style</span>
                  <div class="segmented-control segmented-control-cards">
                    ${BS()}
                  </div>
                </div>
                <div class="option-group" data-public-coin-section>
                  <span class="option-label">Coin Side</span>
                  <div class="segmented-control">
                    <button type="button" class="is-selected" data-public-choice-group="coinAssignmentMode" data-public-choice-value="random">Random</button>
                    <button type="button" data-public-choice-group="coinAssignmentMode" data-public-choice-value="firstPocket">Open / First Pocket</button>
                    <button type="button" data-public-choice-group="coinAssignmentMode" data-public-choice-value="any">Any</button>
                  </div>
                </div>
                <div class="option-group is-disabled">
                  <span class="option-label">Bot Fill</span>
                  <div class="segmented-control">
                    <button type="button" class="is-selected" disabled aria-disabled="true">Coming Soon</button>
                  </div>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="join-public-queue"><span>Find Match</span></button>
                  <button class="action-btn secondary" type="button" data-action="open-online"><span>Private Rooms</span></button>
                  <button class="action-btn secondary" type="button" data-action="open-local-setup"><span>Back</span></button>
                </div>
              </div>

              <div class="public-view" data-public-view="queued">
                <div class="online-room-code-card queue-card">
                  <span class="label">Searching</span>
                  <strong data-public-wait>0:00</strong>
                  <small data-public-preferences>Any Rules</small>
                </div>
                <div class="status-card compact-status-card">
                  <div class="status-row"><span class="label">Players Waiting</span><strong data-public-waiting-count>0</strong></div>
                  <div class="status-row"><span class="label">Connection</span><strong data-public-connection>Connected</strong></div>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn danger" type="button" data-action="cancel-public-queue"><span>Cancel Queue</span></button>
                </div>
              </div>

              <div class="public-view" data-public-view="matched">
                <div class="online-room-code-card queue-card">
                  <span class="label">Match Found</span>
                  <strong data-public-opponent>Opponent</strong>
                  <small>Starting public match...</small>
                </div>
                <div class="status-card compact-status-card">
                  <div class="status-row"><span class="label">Room</span><strong data-public-room>-----</strong></div>
                  <div class="status-row"><span class="label">Rules</span><strong data-public-preferences>Any Rules</strong></div>
                </div>
              </div>

              <div class="match-feedback-banner" data-public-message data-tone="default">Find a casual 3D Carrom opponent.</div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="customize">
            <div class="service-card cosmetic-suite">
              <span class="eyebrow">Cosmetics</span>
              <h3>Customize The Table</h3>
              <p>Preview skins directly on the live 3D carrom scene. Equip saves the loadout on this device.</p>

              <div class="option-group" aria-label="Cosmetic category selector">
                <span class="option-label">Category</span>
                <div class="segmented-control segmented-control-cards cosmetic-category-tabs">
                  ${VS()}
                </div>
              </div>

              <div class="cosmetic-preview-card">
                <span class="status-pill" data-cosmetic-detail-status>Available</span>
                <strong data-cosmetic-detail-name>Ivory Royale</strong>
                <p data-cosmetic-detail-description>Default table loadout.</p>
                <small data-cosmetic-detail-summary>Ivory Royale / Classic Carrom / Ivory Striker / Ivory Lounge / Classic Gold</small>
              </div>

              <div class="cosmetic-grid" data-cosmetic-grid>
                ${GS()}
              </div>

              <div class="match-feedback-banner" data-cosmetic-message data-tone="default">Select a cosmetic to preview it on the live 3D table.</div>
              <div class="controls-card compact-controls">
                <button class="action-btn primary" type="button" data-action="equip-cosmetic"><span>Equip Loadout</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-cosmetics"><span>Reset Default</span></button>
                <button class="action-btn secondary" type="button" data-action="close-customize"><span>Back</span></button>
              </div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="rules">
            <div class="service-card">
              <span class="eyebrow">Rules / Help</span>
              <h3>How The Table Plays</h3>
              <div class="side-rules-list">${NS()}</div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="settings">
            <div class="service-card">
              <span class="eyebrow">Settings</span>
              <h3>Table Preferences</h3>
              <div class="settings-list side-settings-list">
                <label class="toggle-row">
                  <span><strong>Sound</strong><small>Enable generated table cues.</small></span>
                  <input type="checkbox" data-setting-toggle="sound" />
                </label>
                <label class="toggle-row">
                  <span><strong>Music</strong><small>Store lounge ambience preference.</small></span>
                  <input type="checkbox" data-setting-toggle="music" />
                </label>
                <label class="toggle-row">
                  <span><strong>Camera Motion</strong><small>Allow cinematic board movement.</small></span>
                  <input type="checkbox" data-setting-toggle="cameraMotion" />
                </label>
                <label class="toggle-row">
                  <span><strong>Reduced Effects</strong><small>Calm major animations.</small></span>
                  <input type="checkbox" data-setting-toggle="reducedEffects" />
                </label>
              </div>
              <div class="option-group">
                <span class="option-label">Theme</span>
                <div class="segmented-control" data-setting-group="themeId">${DS()}</div>
              </div>
              <div class="option-group">
                <span class="option-label">Quality</span>
                <div class="segmented-control" data-setting-group="quality">
                  ${OS()}
                </div>
              </div>
              <div class="controls-card compact-controls">
                <button class="action-btn secondary" type="button" data-action="open-customize"><span>Customize Board</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-settings"><span>Reset Settings</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-onboarding"><span>Reset Onboarding</span></button>
              </div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="about">
            <div class="service-card">
              <span class="eyebrow">About / Credits</span>
              <h3>3D Carrom Royale</h3>
              <p>Standalone premium tabletop experience built for real physics, bot play, challenge drills, cosmetics, and local carrom.</p>
              <div class="home-doc-card">
                <strong>Visual family</strong>
                <span>Styled with a premium board-game feel while keeping its own carrom lounge identity.</span>
              </div>
              <div class="home-doc-card">
                <strong>Local customization</strong>
                <span>Cosmetic selections are saved locally on this device. Future unlock labels are visual hooks only in this standalone build.</span>
              </div>
            </div>
          </div>
        </aside>

        <div class="top-match-bar">
          <div class="game-topbar-ledger">
            <span class="eyebrow">Live Table</span>
            <div class="match-ledger-row">
              <strong>3D Carrom Royale</strong>
              <span data-topbar-match>Player 1 vs Player 2</span>
            </div>
            <div class="top-score-strip" aria-label="Live scores">
              <div class="top-score-card is-active" data-topbar-player-card="player-1">
                <span data-topbar-p1-name>Player 1</span>
                <strong data-topbar-p1-score>0/9</strong>
                <em data-topbar-p1-color>White</em>
              </div>
              <div class="top-score-card" data-topbar-player-card="player-2">
                <span data-topbar-p2-name>Player 2</span>
                <strong data-topbar-p2-score>0/9</strong>
                <em data-topbar-p2-color>Black</em>
              </div>
              <div class="top-score-card top-score-card-status">
                <span>Turn</span>
                <strong data-topbar-turn>Player 1</strong>
                <em data-topbar-queen>Queen on board</em>
              </div>
            </div>
          </div>
          <div class="game-topbar-actions">
            <button class="action-btn secondary" type="button" data-action="toggle-hud" aria-label="Toggle side panel">Panel</button>
            <button class="action-btn secondary" type="button" data-action="settings" aria-label="Open settings">Settings</button>
            <button class="action-btn secondary" type="button" data-action="rules" aria-label="Open rules">Rules</button>
            <button class="action-btn danger" type="button" data-action="main-menu" aria-label="Return to match setup">Setup</button>
            <button class="action-btn danger" type="button" data-action="quit-match" aria-label="Quit current match">Quit</button>
          </div>
        </div>

        <aside class="coach-hint-card" data-coach-hint data-tone="default" aria-live="polite">
          <span class="eyebrow">Coach</span>
          <p data-coach-message>Pull back from the striker to increase power.</p>
          <button type="button" data-action="dismiss-coach" aria-label="Dismiss coach hint">Dismiss</button>
        </aside>

        <section class="onboarding-overlay" data-onboarding-overlay aria-hidden="true" aria-label="First time onboarding">
          <div class="onboarding-panel shimmer-panel">
            <span class="eyebrow">Learn The Table</span>
            <b data-onboarding-step>1/6</b>
            <h2 data-onboarding-title>Welcome to 3D Carrom Royale</h2>
            <p data-onboarding-body>Learn smooth striker control, queen cover, and premium carrom flow.</p>
            <div class="controls-card compact-controls">
              <button class="action-btn secondary" type="button" data-action="onboarding-prev"><span>Back</span></button>
              <button class="action-btn primary" type="button" data-action="onboarding-next"><span>Next</span></button>
            </div>
            <div class="controls-card compact-controls" data-onboarding-final-actions hidden>
              <button class="action-btn primary" type="button" data-action="onboarding-start-tutorial"><span>Start Tutorial</span></button>
              <button class="action-btn secondary" type="button" data-action="onboarding-start-practice"><span>Practice Mode</span></button>
              <button class="action-btn secondary" type="button" data-action="onboarding-skip"><span>Skip to Menu</span></button>
            </div>
          </div>
        </section>
      </section>
    `}update(e,t){const i=(M,b)=>{const R=e.querySelector(M);R&&(R.textContent=b)},s=String(t.playerOneRemaining??9),a=String(t.playerTwoRemaining??9),r=t.playerOneScore||"0/9",o=t.playerTwoScore||"0/9",l=Number(t.playerOnePoints)||0,c=Number(t.playerTwoPoints)||0,h=t.scoringMode==="points",u=t.ruleMode==="freeCapture",p=t.matchMode==="vsBot",f=t.matchMode==="onlinePrivate"||t.matchMode==="onlinePublic"||!!t.onlineActive,g=!!t.challengeActive,v=!!t.practiceActive,m=t.botDifficultyLabel||kS[t.botDifficulty]||"";i("[data-hud-match-mode]",t.matchModeLabel||(p?"Vs Bot":"Local 2 Player")),i("[data-hud-bot-name]",p?t.playerTwoName||"Bot":""),i("[data-hud-bot-difficulty]",m?`(${m})`:""),i("[data-hud-current-turn]",t.currentTurn),i("[data-hud-rule-mode]",t.ruleModeLabel||"Classic Carrom"),i("[data-hud-due]",t.dueStatus||"Clear"),i("[data-hud-challenge-title]",t.challengeTitle||""),i("[data-hud-challenge-shots]",t.challengeShots?`(${t.challengeShots})`:""),i("[data-hud-practice-title]",t.practiceTitle||""),i("[data-hud-online-room]",t.onlineRoomCode?`Room ${t.onlineRoomCode}`:""),i("[data-hud-online-connection]",t.onlineConnectionStatus||""),i("[data-hud-online-timer]",t.onlineTurnTimer||""),i("[data-hud-current-color]",t.currentColor||"Unassigned"),i("[data-hud-turn]",t.turnNumber||"1"),i("[data-hud-shot]",t.shotNumber||"0"),i("[data-hud-p1-name]",t.playerOneName),i("[data-hud-p2-name]",t.playerTwoName),i("[data-hud-p1-score]",r),i("[data-hud-p2-score]",o),i("[data-hud-p1-score-label]",u?"captured":"pocketed"),i("[data-hud-p2-score-label]",u?"captured":"pocketed"),i("[data-hud-p1-color]",t.playerOneColor||"Unassigned"),i("[data-hud-p2-color]",t.playerTwoColor||"Unassigned"),i("[data-hud-p1-points]",`${l} pts`),i("[data-hud-p2-points]",`${c} pts`),i("[data-hud-p1-remaining]",s),i("[data-hud-p2-remaining]",a),i("[data-hud-foul]",t.foulStatus||"Clear"),i("[data-hud-points]",h?`${l} - ${c}`:"Coins mode"),i("[data-hud-queen]",t.queenStatus),i("[data-hud-power]",t.shotPower),i("[data-topbar-match]",`${t.playerOneName} vs ${t.playerTwoName}`),i("[data-topbar-p1-name]",t.playerOneName||"Player 1"),i("[data-topbar-p2-name]",t.playerTwoName||"Player 2"),i("[data-topbar-p1-score]",h?`${l} pts | ${r}`:`${r} | ${s} left`),i("[data-topbar-p2-score]",h?`${c} pts | ${o}`:`${o} | ${a} left`),i("[data-topbar-p1-color]",t.playerOneColor||"Unassigned"),i("[data-topbar-p2-color]",t.playerTwoColor||"Unassigned"),i("[data-topbar-turn]",t.currentTurn||"Player 1"),i("[data-topbar-queen]",t.queenStatus||"Queen on board"),i("[data-practice-status]",t.practiceStatus||t.status||"Choose a practice drill."),i("[data-challenge-result]",t.challengeResult?`${t.challengeResult} | ${t.status||""}`:t.status||"Select a challenge."),e.querySelectorAll("[data-hud-bot-row]").forEach(M=>{M.hidden=!p,M.classList.toggle("is-visible",p)}),e.querySelectorAll("[data-hud-due-row]").forEach(M=>{const b=!!t.dueStatus;M.hidden=!b,M.classList.toggle("is-visible",b)}),e.querySelectorAll("[data-hud-challenge-row]").forEach(M=>{M.hidden=!g,M.classList.toggle("is-visible",g)}),e.querySelectorAll("[data-hud-practice-row]").forEach(M=>{M.hidden=!v,M.classList.toggle("is-visible",v)}),e.querySelectorAll("[data-hud-online-row]").forEach(M=>{M.hidden=!f,M.classList.toggle("is-visible",f)}),e.querySelectorAll("[data-hud-online-timer-row]").forEach(M=>{const b=f&&!!t.onlineTurnTimer;M.hidden=!b,M.classList.toggle("is-visible",b),M.classList.toggle("is-warning",!!t.onlineTurnTimerLow)}),e.querySelectorAll("[data-online-only]").forEach(M=>{M.hidden=!f,M.classList.toggle("is-visible",f)});const d=e.querySelector("[data-hud-banner]");d&&(d.textContent=t.status||"Ready for local match.",d.dataset.tone=t.bannerTone||"default");const E=e.querySelector("[data-hud-power-fill]");if(E){const M=Math.min(Math.max(Number(t.shotPowerRatio)||0,0),1);E.style.transform=`scaleX(${M})`}e.querySelectorAll("[data-hud-status]").forEach(M=>{M.textContent=t.status}),e.querySelectorAll("[data-hud-player-card], [data-topbar-player-card]").forEach(M=>{const R=M.dataset.hudPlayerCard==="player-1"||M.dataset.topbarPlayerCard==="player-1"?t.currentTurn===t.playerOneName:t.currentTurn===t.playerTwoName;M.classList.toggle("is-active",R)}),e.querySelectorAll("[data-points-row], .point-pill").forEach(M=>{M.classList.toggle("is-visible",h)})}}class WS{constructor({app:e,root:t}){this.app=e,this.root=t,this.overlayController=new IS,this.hudController=new qS,this.sidePanelSection="setup",this.pendingConfirmation=null}init(){this.root.innerHTML=`
      <div class="carrom-shell" data-state="${xe.playing}">
        <canvas id="carromStage" class="carrom-stage" aria-label="Premium 3D carrom board scene"></canvas>
        <div class="backdrop" aria-hidden="true">
          <span class="ambient-glow glow-one"></span>
          <span class="ambient-glow glow-two"></span>
          <span class="ambient-glow glow-three"></span>
        </div>
        <div class="scene-vignette" aria-hidden="true"></div>
        <div class="portrait-hint" aria-live="polite">Portrait supported. Rotate only if you want a wider table view.</div>
        <main class="screen-host">
          ${this.overlayController.render()}
        </main>
        ${this.hudController.render()}
        ${this.renderConfirmationCard()}
      </div>
    `,this.shell=this.root.querySelector(".carrom-shell"),this.canvas=this.root.querySelector("#carromStage"),this.bindEvents()}bindEvents(){this.handleCosmeticClick=e=>{const t=e.target.closest("[data-cosmetic-category-tab]");if(t&&this.root.contains(t)){e.preventDefault(),e.stopPropagation(),this.app.playUiClick?.(),this.app.selectCosmeticCategory?.(t.dataset.cosmeticCategoryTab);return}const i=e.target.closest("[data-cosmetic-card]");i&&this.root.contains(i)&&(e.preventDefault(),e.stopPropagation(),this.app.playUiClick?.(),this.app.previewCosmetic?.(i.dataset.cosmeticCategory,i.dataset.cosmeticId))},this.handleActionClick=e=>{const t=e.target.closest("[data-action]");!t||t.disabled||(e.preventDefault(),this.app.playUiClick?.(),this.handleAction(t.dataset.action,t))},this.handleConfirmationClick=e=>{const t=e.target.closest("[data-confirm-choice]");if(!t||!this.root.contains(t))return;e.preventDefault(),e.stopPropagation(),t.dataset.confirmChoice==="confirm"?this.confirmPendingAction():this.closeConfirmation()},this.handleChoiceClick=e=>{const t=e.target.closest("[data-choice-group]");!t||t.disabled||(e.preventDefault(),this.app.updateLocalSetup(t.dataset.choiceGroup,t.dataset.choiceValue))},this.handleOnlineChoiceClick=e=>{const t=e.target.closest("[data-online-choice-group]");if(!t||t.disabled)return;e.preventDefault();const i=t.dataset.onlineChoiceGroup;this.root.querySelectorAll(`[data-online-choice-group="${i}"]`).forEach(s=>{const a=s===t;s.classList.toggle("is-selected",a),s.setAttribute("aria-pressed",String(a))}),this.updateOnlineRuleVisibility()},this.handlePublicChoiceClick=e=>{const t=e.target.closest("[data-public-choice-group]");if(!t||t.disabled)return;e.preventDefault();const i=t.dataset.publicChoiceGroup;this.root.querySelectorAll(`[data-public-choice-group="${i}"]`).forEach(s=>{const a=s===t;s.classList.toggle("is-selected",a),s.setAttribute("aria-pressed",String(a))}),this.updatePublicRuleVisibility()},this.handleSettingClick=e=>{const t=e.target.closest("[data-setting-choice]");!t||t.disabled||(e.preventDefault(),this.app.updateSetting(t.dataset.settingChoice,t.dataset.settingValue))},this.handleSettingChange=e=>{const t=e.target.closest("[data-setting-toggle]");t&&this.app.updateSetting(t.dataset.settingToggle,t.checked)},this.handleSetupInput=e=>{e.target.matches('#playerOneName, #hudPlayerOneName, [data-player-name="one"]')&&this.app.updateLocalSetup("playerOneName",e.target.value),e.target.matches('#playerTwoName, #hudPlayerTwoName, [data-player-name="two"]')&&this.app.updateLocalSetup("playerTwoName",e.target.value)},this.root.addEventListener("click",this.handleCosmeticClick,!0),this.root.addEventListener("click",this.handleConfirmationClick,!0),this.root.addEventListener("click",this.handleActionClick),this.root.addEventListener("click",this.handleChoiceClick),this.root.addEventListener("click",this.handleOnlineChoiceClick),this.root.addEventListener("click",this.handlePublicChoiceClick),this.root.addEventListener("click",this.handleSettingClick),this.root.addEventListener("change",this.handleSettingChange),this.root.addEventListener("input",this.handleSetupInput)}renderConfirmationCard(){return`
      <section class="confirmation-overlay" data-confirmation-overlay aria-hidden="true" aria-label="Confirm important action">
        <div class="confirmation-card shimmer-panel" role="dialog" aria-modal="true" aria-labelledby="confirmationTitle" aria-describedby="confirmationBody">
          <span class="eyebrow" data-confirmation-eyebrow>Confirm Action</span>
          <h2 id="confirmationTitle" data-confirmation-title>Are you sure?</h2>
          <p id="confirmationBody" data-confirmation-body>This action needs confirmation.</p>
          <div class="confirmation-detail" data-confirmation-detail hidden></div>
          <div class="controls-card compact-controls confirmation-actions">
            <button class="action-btn danger" type="button" data-confirm-choice="confirm"><span data-confirmation-confirm-label>Confirm</span></button>
            <button class="action-btn secondary" type="button" data-confirm-choice="cancel"><span data-confirmation-cancel-label>Cancel</span></button>
          </div>
        </div>
      </section>
    `}handleAction(e,t=null,{confirmed:i=!1}={}){if(!i){const a=this.app.getActionConfirmation?.(e,t)||null;if(a){this.openConfirmation(e,t,a);return}}({"main-menu":()=>this.app.showMainMenu(),"mode-select":()=>this.app.showModeSelect(),"open-local-setup":()=>this.app.showLocalSetup(),"select-vs-bot":()=>this.app.selectMatchMode?.("vsBot"),"select-local2p":()=>this.app.selectMatchMode?.("local2p"),"open-practice":()=>this.app.showPracticePanel?.(),"start-practice":()=>this.app.startPractice?.(this.getLocalSetupValues().practiceType),"start-tutorial":()=>this.app.startTutorial?.(),"tutorial-next":()=>this.app.tutorialNext?.(),"tutorial-exit":()=>this.app.exitTutorial?.(),"tutorial-local":()=>this.app.finishTutorialToLocal?.(),"tutorial-bot":()=>this.app.finishTutorialToBot?.(),"tutorial-practice":()=>this.app.finishTutorialToPractice?.(),"tutorial-menu":()=>this.app.finishTutorialToMenu?.(),"reset-practice":()=>this.app.resetPractice?.(),"next-practice":()=>this.app.nextPracticeDrill?.(),"exit-practice":()=>this.app.exitPractice?.(),"onboarding-next":()=>this.app.onboardingNext?.(),"onboarding-prev":()=>this.app.onboardingPrevious?.(),"onboarding-skip":()=>this.app.skipOnboarding?.(),"onboarding-start-tutorial":()=>this.app.startTutorialFromOnboarding?.(),"onboarding-start-practice":()=>this.app.startPracticeFromOnboarding?.(),"reset-onboarding":()=>this.app.resetOnboarding?.(),"dismiss-coach":()=>this.app.dismissCoachHint?.(),"open-challenges":()=>this.app.showChallengePanel?.(),"open-online":()=>this.app.showOnlinePanel?.(),"open-public-matchmaking":()=>this.app.showPublicMatchmakingPanel?.(),"online-show-menu":()=>this.setOnlineView("menu"),"online-show-create":()=>this.setOnlineView("create"),"online-show-join":()=>this.setOnlineView("join"),"create-online-room":()=>this.app.createOnlineRoom?.(this.getOnlineCreateValues()),"join-online-room":()=>this.app.joinOnlineRoom?.(this.getOnlineJoinValues()),"leave-online-room":()=>this.app.leaveOnlineRoom?.(),"reconnect-online-session":()=>this.app.reconnectOnlineSession?.(),"discard-online-session":()=>this.app.discardOnlineSession?.(),"start-online-match":()=>this.app.startOnlineMatch?.(),"copy-online-room-code":()=>this.app.copyOnlineRoomCode?.(),"copy-online-room-link":()=>this.app.copyOnlineRoomLink?.(),"refresh-online-state":()=>this.app.requestOnlineState?.(),"request-online-rematch":()=>this.app.requestOnlineRematch?.(),"accept-online-rematch":()=>this.app.respondOnlineRematch?.(!0),"decline-online-rematch":()=>this.app.respondOnlineRematch?.(!1),"join-public-queue":()=>this.app.joinPublicQueue?.(this.getPublicQueueValues()),"cancel-public-queue":()=>this.app.cancelPublicQueue?.(),"select-challenge":()=>this.app.selectChallenge?.(t?.dataset.challengeId),"start-challenge":()=>this.app.startChallenge?.(this.getSelectedChallengeId()),"retry-challenge":()=>this.app.retryChallenge?.(),"next-challenge":()=>this.app.nextChallenge?.(),"exit-challenge":()=>this.app.exitChallenge?.(),"reset-challenge-progress":()=>this.app.resetChallengeProgress?.(),"open-customize":()=>this.app.showCustomizePanel?.(),"cosmetic-category":()=>this.app.selectCosmeticCategory?.(t?.dataset.cosmeticCategory),"preview-cosmetic":()=>this.app.previewCosmetic?.(t?.dataset.cosmeticCategory,t?.dataset.cosmeticId),"equip-cosmetic":()=>this.app.equipCosmetics?.(),"reset-cosmetics":()=>this.app.resetCosmetics?.(),"close-customize":()=>this.app.closeCustomizePanel?.(),"panel-match":()=>this.app.showMatchPanel(),"start-local-shell-match":()=>this.app.startLocalShellMatch(),pause:()=>this.app.showPause(),"resume-match":()=>this.app.resumeMatch(),rules:()=>this.app.showRules(),settings:()=>this.app.showSettings(),about:()=>this.app.showAbout(),"debug-result":()=>this.app.showDebugResult(),"toggle-hud":()=>this.app.toggleHudCollapsed(),"quit-match":()=>this.app.quitMatch(),"test-physics-shot":()=>this.app.testPhysicsShot(),"reset-physics":()=>this.app.resetPhysicsScene(),"rematch-shell":()=>this.app.handleResultPrimary?.(),"restart-match":()=>this.app.startLocalShellMatch({preserveSetup:!0}),"return-from-overlay":()=>this.app.returnFromOverlay(),"reset-settings":()=>this.app.resetSettings()})[e]?.()}openConfirmation(e,t,i={}){const s=this.root.querySelector("[data-confirmation-overlay]");if(!s)return;this.pendingConfirmation={action:e,target:t};const a=(o,l)=>{const c=s.querySelector(o);c&&(c.textContent=l)};a("[data-confirmation-eyebrow]",i.eyebrow||"Confirm Action"),a("[data-confirmation-title]",i.title||"Are you sure?"),a("[data-confirmation-body]",i.body||"This action needs confirmation."),a("[data-confirmation-confirm-label]",i.confirmLabel||"Confirm"),a("[data-confirmation-cancel-label]",i.cancelLabel||"Cancel");const r=s.querySelector("[data-confirmation-detail]");if(r){const o=!!i.detail;r.hidden=!o,r.textContent=i.detail||""}s.classList.add("is-visible"),s.setAttribute("aria-hidden","false"),s.querySelector('[data-confirm-choice="cancel"]')?.focus?.({preventScroll:!0})}closeConfirmation(){this.pendingConfirmation=null;const e=this.root.querySelector("[data-confirmation-overlay]");e&&(e.classList.remove("is-visible"),e.setAttribute("aria-hidden","true"))}confirmPendingAction(){const e=this.pendingConfirmation;this.closeConfirmation(),e?.action&&this.handleAction(e.action,e.target,{confirmed:!0})}hasOpenConfirmation(){return!!this.pendingConfirmation}getCanvas(){return this.canvas}getLocalSetupValues(){const e=(t,i)=>this.root.querySelector(`[data-choice-group="${t}"].is-selected`)?.dataset.choiceValue||i;return{playerOneName:this.root.querySelector("#hudPlayerOneName")?.value.trim()||this.root.querySelector("#playerOneName")?.value.trim()||qe.playerOneName,playerTwoName:this.root.querySelector("#hudPlayerTwoName")?.value.trim()||this.root.querySelector("#playerTwoName")?.value.trim()||qe.playerTwoName,matchMode:e("matchMode",qe.matchMode),botDifficulty:e("botDifficulty",qe.botDifficulty),ruleMode:e("ruleMode",qe.ruleMode),classicRuleVariant:e("classicRuleVariant",qe.classicRuleVariant),coinSide:e("coinSide",qe.coinSide),matchType:e("matchType",qe.matchType),practiceType:e("practiceType",qe.practiceType),boardStyle:e("boardStyle",qe.boardStyle)}}getOnlineChoiceValue(e,t=""){return this.root.querySelector(`[data-online-choice-group="${e}"].is-selected`)?.dataset.onlineChoiceValue||t}getPublicChoiceValue(e,t=""){return this.root.querySelector(`[data-public-choice-group="${e}"].is-selected`)?.dataset.publicChoiceValue||t}getOnlineCreateValues(){return{playerName:this.root.querySelector("#onlineHostName")?.value.trim()||this.root.querySelector("#hudPlayerOneName")?.value.trim()||qe.playerOneName,matchConfig:{ruleMode:this.getOnlineChoiceValue("ruleMode","classic"),classicRuleVariant:this.getOnlineChoiceValue("classicRuleVariant",qe.classicRuleVariant),coinAssignmentMode:this.getOnlineChoiceValue("coinAssignmentMode",qe.coinSide)}}}getOnlineJoinValues(){return{playerName:this.root.querySelector("#onlineGuestName")?.value.trim()||this.root.querySelector("#hudPlayerTwoName")?.value.trim()||qe.playerTwoName,roomCode:this.root.querySelector("#onlineRoomCode")?.value.trim()||""}}getPublicQueueValues(){return{playerName:this.root.querySelector("#publicPlayerName")?.value.trim()||this.root.querySelector("#hudPlayerOneName")?.value.trim()||qe.playerOneName,preferences:{ruleMode:this.getPublicChoiceValue("ruleMode","any"),classicRuleVariant:this.getPublicChoiceValue("classicRuleVariant","any"),coinAssignmentMode:this.getPublicChoiceValue("coinAssignmentMode","random"),matchType:"casual",allowBotFill:!1}}}getSelectedChallengeId(){return this.root.querySelector("[data-challenge-id].is-selected")?.dataset.challengeId||this.root.querySelector("[data-challenge-id]")?.dataset.challengeId||""}setState(e){this.shell&&(this.shell.dataset.state=e),this.root.querySelectorAll("[data-screen]").forEach(t=>{t.classList.toggle("is-active",t.dataset.screen===e)})}updateLocalSetup(e){this.root.querySelectorAll('#playerOneName, #hudPlayerOneName, [data-player-name="one"]').forEach(l=>{document.activeElement!==l&&(l.value=e.playerOneName||"")}),this.root.querySelectorAll("#publicPlayerName").forEach(l=>{document.activeElement!==l&&(l.value=e.playerOneName||"")}),this.root.querySelectorAll('#playerTwoName, #hudPlayerTwoName, [data-player-name="two"]').forEach(l=>{document.activeElement!==l&&(l.value=e.playerTwoName||"")});const t={...e,matchMode:e.matchMode||qe.matchMode,botDifficulty:e.botDifficulty||qe.botDifficulty,ruleMode:e.ruleMode||qe.ruleMode,classicRuleVariant:e.classicRuleVariant||qe.classicRuleVariant,practiceType:e.practiceType||qe.practiceType,coinSide:this.normalizeCoinSide(e.coinSide)};this.root.querySelectorAll("[data-choice-group]").forEach(l=>{const c=t[l.dataset.choiceGroup]===l.dataset.choiceValue;l.classList.toggle("is-selected",c),l.setAttribute("aria-pressed",String(c))});const i=this.root.querySelector("[data-setup-mode-label]");i&&(i.textContent=t.matchMode==="vsBot"?"Human vs Bot":t.ruleMode==="freeCapture"?"Free Capture":"Classic Coin Side");const s=this.root.querySelector("[data-setup-mode-note]");if(s){const l={p1White:"Player 1 starts as White; Player 2 plays Black.",p1Black:"Player 1 starts as Black; Player 2 plays White.",random:"Random side mode active: colors are assigned on start and points are shown.",firstPocket:"Open color mode active: the first white or black coin pocketed assigns colors."};s.textContent=t.ruleMode==="freeCapture"?"Pocket any coin. Every captured coin counts for you.":l[t.coinSide]||l.p1White}const a=t.matchMode==="vsBot";this.root.querySelectorAll("[data-setup-eyebrow]").forEach(l=>{l.textContent=a?"Human vs Bot":"Local 2 Player"}),this.root.querySelectorAll("[data-player-one-label]").forEach(l=>{l.textContent=a?"Human Player":"Player 1"}),this.root.querySelectorAll("[data-player-two-label]").forEach(l=>{l.textContent=a?"Bot Name":"Player 2"}),this.root.querySelectorAll("[data-player-two-helper]").forEach(l=>{l.textContent=a?"Bot plays from the top baseline":"Color follows setup"}),this.root.querySelectorAll("[data-start-match-label]").forEach(l=>{l.textContent=a?"Start Vs Bot Match":"Start Local Match"}),this.root.querySelectorAll("[data-bot-difficulty-section]").forEach(l=>{l.hidden=!a,l.classList.toggle("is-disabled",!a),l.querySelectorAll('[data-choice-group="botDifficulty"]').forEach(c=>{c.disabled=!a,c.setAttribute("aria-disabled",String(!a))})}),this.updateCoinSideLabels(a),this.root.querySelectorAll("[data-classic-rule-section]").forEach(l=>{const c=t.ruleMode==="freeCapture";l.hidden=c,l.classList.toggle("is-disabled",c),l.querySelectorAll('[data-choice-group="classicRuleVariant"]').forEach(h=>{h.disabled=c,h.setAttribute("aria-disabled",String(c))})}),this.root.querySelectorAll("[data-coin-side-section]").forEach(l=>{const c=t.ruleMode==="freeCapture";l.hidden=c,l.classList.toggle("is-disabled",c),l.querySelectorAll('[data-choice-group="coinSide"]').forEach(h=>{h.disabled=c,h.setAttribute("aria-disabled",String(c))})}),this.root.querySelectorAll("[data-rule-mode-helper]").forEach(l=>{l.textContent=t.ruleMode==="freeCapture"?"Pocket any coin. Every captured coin counts for you.":"Assigned colors, first-pocket, and random color options apply in Classic Carrom."})}normalizeCoinSide(e){return e==="fixed"?"p1White":e==="black"?"p1Black":e||qe.coinSide}updateCoinSideLabels(e=!1){Object.entries(e?{p1White:"Human White",p1Black:"Human Black",random:"Random",firstPocket:"Open / First Pocket"}:{p1White:"P1 White",p1Black:"P1 Black",random:"Random",firstPocket:"Open / First Pocket"}).forEach(([i,s])=>{this.root.querySelectorAll(`[data-choice-group="coinSide"][data-choice-value="${i}"]`).forEach(a=>{a.textContent=s})})}updateSettings(e){this.root.querySelectorAll("[data-setting-toggle]").forEach(t=>{t.checked=!!e[t.dataset.settingToggle]}),this.root.querySelectorAll("[data-setting-choice]").forEach(t=>{const i=t.dataset.settingChoice,s=String(e[i])===String(t.dataset.settingValue);t.classList.toggle("is-selected",s),t.setAttribute("aria-pressed",String(s))})}updateTheme(e){Object.entries(e.css).forEach(([t,i])=>{document.documentElement.style.setProperty(t,i)}),document.body.dataset.theme=e.id}updateMatch(e){this.hudController.update(this.root,e);const t=this.root.querySelector("[data-result-winner]"),i=this.root.querySelector("[data-result-outcome]"),s=this.root.querySelector("[data-result-winner-color]"),a=this.root.querySelector("[data-result-score]"),r=this.root.querySelector("[data-result-colors]"),o=this.root.querySelector("[data-result-queen]"),l=this.root.querySelector("[data-result-turns]"),c=this.root.querySelector("[data-result-shots]");t&&(t.textContent=e.winnerName||e.playerOneName||"Player 1"),i&&(i.textContent=e.resultOutcome||"Wins"),s&&(s.textContent=e.winnerColor||e.currentColor||"White"),a&&(a.textContent=e.resultScore||`${e.playerOneScore} - ${e.playerTwoScore}`),r&&(r.textContent=e.resultColorSummary||`${e.playerOneName}: ${e.playerOneColor} | ${e.playerTwoName}: ${e.playerTwoColor}`),o&&(o.textContent=e.resultQueenStatus||e.queenStatus||"On board"),l&&(l.textContent=String(e.resultTurns||e.turnNumber||1)),c&&(c.textContent=String(e.resultShots||e.shotNumber||0));const h=this.root.querySelector('[data-action="rematch-shell"] span');h&&(h.textContent=e.matchMode==="onlinePrivate"||e.matchMode==="onlinePublic"?"Request Rematch":"Rematch")}updateChallengePanel(e={}){const t=e.challenges||[],i=e.selectedChallengeId||t[0]?.id||"",s=t.find(l=>l.id===i)||t[0];this.root.querySelectorAll("[data-challenge-id]").forEach(l=>{const c=t.find(p=>p.id===l.dataset.challengeId),h=l.dataset.challengeId===i;l.classList.toggle("is-selected",h),l.setAttribute("aria-pressed",String(h));const u=l.querySelector(`[data-challenge-stars="${l.dataset.challengeId}"]`);u&&c&&(u.textContent=`${c.bestStars||0} star${c.bestStars===1?"":"s"}`)});const a=(l,c)=>{const h=this.root.querySelector(l);h&&(h.textContent=c)};s&&(a("[data-challenge-detail-title]",s.title),a("[data-challenge-detail-difficulty]",s.difficulty),a("[data-challenge-detail-objective]",s.objectiveText),a("[data-challenge-detail-progress]",`Best: ${s.bestStars||0} star${s.bestStars===1?"":"s"}`));const r=e.result,o=this.root.querySelector("[data-challenge-result]");o&&r?(o.textContent=r.completed?`Success: ${r.stars} star${r.stars===1?"":"s"} earned.`:r.failed?`Failed: ${r.message}`:r.message,o.dataset.tone=r.completed?"success":r.failed?"danger":"default"):o&&(o.textContent=s?s.objectiveText:"Select a challenge.",o.dataset.tone="default")}setOnlineView(e="menu"){this.root.querySelectorAll("[data-online-view]").forEach(t=>{const i=t.dataset.onlineView===e;t.classList.toggle("is-active",i),t.hidden=!i}),this.updateOnlineRuleVisibility()}updateOnlineRuleVisibility(){const t=this.getOnlineChoiceValue("ruleMode","classic")!=="freeCapture";this.root.querySelectorAll("[data-online-classic-section], [data-online-coin-section]").forEach(i=>{i.hidden=!t,i.classList.toggle("is-disabled",!t)})}updatePublicRuleVisibility(){const t=this.getPublicChoiceValue("ruleMode","any")==="freeCapture";this.root.querySelectorAll("[data-public-classic-section], [data-public-coin-section]").forEach(i=>{i.hidden=t,i.classList.toggle("is-disabled",t)})}updateOnlinePanel(e={}){const t=e.view||"menu";this.setOnlineView(t);const i=(o,l)=>{const c=this.root.querySelector(o);c&&(c.textContent=l)},s=e.matchConfig||{},a=s.ruleMode==="freeCapture"?"Free Capture":`Classic / ${s.classicRuleVariant||"casual"} / ${s.coinAssignmentMode||"p1White"}`;i("[data-online-room-code-label]",e.roomCode||"-----"),i("[data-online-playing-room]",e.roomCode||"-----"),i("[data-online-host]",e.host?.name||"Waiting"),i("[data-online-guest]",e.guest?.name||"Waiting"),i("[data-online-rules]",a),i("[data-online-status]",e.message||e.roomStatus||"Lobby"),i("[data-online-connection]",e.connectionStatus||"Offline"),i("[data-online-turn]",e.message||"Waiting"),i("[data-online-reconnect-room]",e.reconnectRoomCode||"-----"),i("[data-online-reconnect-player]",e.reconnectPlayerName||"Player"),i("[data-online-timer]",e.turnTimerLabel||"Paused"),i("[data-online-disconnect-countdown]",e.disconnectLabel||"0:00"),i("[data-online-rematch-status]",e.rematchLabel||"No rematch request"),i("[data-online-debug-status]",e.debugLabel||"v0 / 0ms / OK");const r=this.root.querySelector("[data-online-message]");r&&(r.textContent=e.error||e.message||"Create or join a private room.",r.dataset.tone=e.error?"danger":e.status==="playing"?"success":"default"),this.root.querySelectorAll("[data-online-host-only]").forEach(o=>{o.hidden=!e.isHost,o.disabled=!e.canStart,o.setAttribute("aria-disabled",String(!e.canStart))}),this.root.querySelectorAll("[data-online-timer-row]").forEach(o=>{const l=!!e.turnTimerLabel;o.hidden=!l,o.classList.toggle("is-visible",l),o.classList.toggle("is-warning",!!e.turnTimerLow)}),this.root.querySelectorAll("[data-online-grace-row]").forEach(o=>{const l=!!e.disconnectGrace;o.hidden=!l,o.classList.toggle("is-visible",l)}),this.root.querySelectorAll("[data-online-rematch-row]").forEach(o=>{const l=!!(e.rematch&&e.rematch.status!=="idle");o.hidden=!l,o.classList.toggle("is-visible",l)}),this.root.querySelectorAll("[data-online-debug-row]").forEach(o=>{const l=!!this.debugOnline;o.hidden=!l,o.classList.toggle("is-visible",l)}),this.root.querySelectorAll('[data-action="request-online-rematch"]').forEach(o=>{o.hidden=!e.canRequestRematch,o.disabled=!e.canRequestRematch,o.setAttribute("aria-disabled",String(!e.canRequestRematch))}),this.root.querySelectorAll("[data-online-rematch-answer]").forEach(o=>{o.hidden=!e.canAnswerRematch,o.disabled=!e.canAnswerRematch,o.setAttribute("aria-disabled",String(!e.canAnswerRematch))})}updatePublicMatchmakingPanel(e={}){const t=e.view||"form";this.root.querySelectorAll("[data-public-view]").forEach(r=>{const o=r.dataset.publicView===t;r.classList.toggle("is-active",o),r.hidden=!o}),this.updatePublicRuleVisibility();const i=(r,o)=>{const l=this.root.querySelector(r);l&&(l.textContent=o)},s=(r,o)=>{this.root.querySelectorAll(r).forEach(l=>{l.textContent=o})};i("[data-public-wait]",e.waitLabel||"0:00"),i("[data-public-waiting-count]",`${e.playersWaiting||0}`),s("[data-public-preferences]",e.preferencesLabel||"Any Rules"),i("[data-public-opponent]",e.opponentName||"Opponent"),i("[data-public-room]",e.roomCode||"-----"),i("[data-public-connection]",e.connectionStatus||"Offline");const a=this.root.querySelector("[data-public-message]");a&&(a.textContent=e.message||"Find a casual 3D Carrom opponent.",a.dataset.tone=e.tone||"default"),this.root.querySelectorAll('[data-action="join-public-queue"]').forEach(r=>{r.disabled=e.queued||e.matched,r.setAttribute("aria-disabled",String(r.disabled))}),this.root.querySelectorAll('[data-action="cancel-public-queue"]').forEach(r=>{r.disabled=!e.queued,r.setAttribute("aria-disabled",String(r.disabled))})}updateCosmeticsPanel(e={}){const t=e.activeCategory||"board",i=e.selectedItem||{},s=e.equippedLoadout||{},a=e.previewLoadout||{};this.root.querySelectorAll("[data-cosmetic-category-tab]").forEach(l=>{const c=l.dataset.cosmeticCategoryTab===t;l.classList.toggle("is-selected",c),l.setAttribute("aria-pressed",String(c))}),this.root.querySelectorAll("[data-cosmetic-card]").forEach(l=>{const c=l.dataset.cosmeticCategory,h=l.dataset.cosmeticId,u=c===t,p=e.categories?.find(d=>d.id===c),f=p?a[p.loadoutKey]===h:!1,g=p?s[p.loadoutKey]===h:!1,v=e.focusedItemId===h;l.hidden=!u,l.classList.toggle("is-selected",u&&f),l.classList.toggle("is-focused",u&&v),l.classList.toggle("is-equipped",u&&g),l.classList.toggle("is-locked",l.dataset.cosmeticStatus==="locked"),l.classList.toggle("is-coming-soon",l.dataset.cosmeticStatus==="comingSoon"),l.setAttribute("aria-pressed",String(u&&(f||v))),l.setAttribute("aria-disabled",String(l.dataset.cosmeticStatus==="comingSoon"));const m=l.querySelector(".status-pill");m&&(v&&l.dataset.cosmeticStatus==="comingSoon"?m.textContent="Coming Soon":f&&g?m.textContent="Equipped":f?m.textContent="Previewing":g?m.textContent="Equipped":l.dataset.cosmeticStatus==="locked"?m.textContent="Locked":l.dataset.cosmeticStatus==="comingSoon"?m.textContent="Coming Soon":m.textContent="Available")});const r=(l,c)=>{const h=this.root.querySelector(l);h&&(h.textContent=c)};r("[data-cosmetic-detail-status]",`${e.selectedStatusLabel||"Available"} / ${e.selectedRarityLabel||"Common"}`),r("[data-cosmetic-detail-name]",i.name||"Ivory Royale"),r("[data-cosmetic-detail-description]",i.description||"Select a cosmetic to preview the live table."),r("[data-cosmetic-detail-summary]",e.summary||""),r("[data-cosmetic-message]",e.message||"Select a cosmetic to preview it on the live 3D table.");const o=this.root.querySelector("[data-cosmetic-message]");o&&(o.dataset.tone=e.tone||"default"),this.root.querySelectorAll('[data-action="equip-cosmetic"]').forEach(l=>{l.disabled=!e.canEquip,l.setAttribute("aria-disabled",String(!e.canEquip))})}updateOnboarding(e={}){const t=this.root.querySelector("[data-onboarding-overlay]");if(!t)return;const i=!!e.visible;t.classList.toggle("is-visible",i),t.setAttribute("aria-hidden",String(!i));const s=(a,r)=>{const o=t.querySelector(a);o&&(o.textContent=r)};s("[data-onboarding-title]",e.step?.title||"Welcome to 3D Carrom Royale"),s("[data-onboarding-body]",e.step?.body||""),s("[data-onboarding-step]",`${(e.stepIndex||0)+1}/${e.stepCount||1}`),t.querySelectorAll('[data-action="onboarding-prev"]').forEach(a=>{a.disabled=!!e.isFirst}),t.querySelectorAll('[data-action="onboarding-next"]').forEach(a=>{a.hidden=!!e.isLast}),t.querySelectorAll("[data-onboarding-final-actions]").forEach(a=>{a.hidden=!e.isLast})}updateCoachHint(e={}){const t=this.root.querySelector("[data-coach-hint]");if(!t)return;t.classList.toggle("is-visible",!!e.visible),t.dataset.tone=e.tone||"default";const i=t.querySelector("[data-coach-message]");i&&(i.textContent=e.message||"")}updateTutorial(e={}){const t=this.root.querySelector("[data-tutorial-card]");if(!t)return;const i=!!e.tutorialActive;t.classList.toggle("is-active",i),t.hidden=!i;const s=(r,o)=>{const l=t.querySelector(r);l&&(l.textContent=o)};s("[data-tutorial-title]",e.tutorialTitle||"Tutorial"),s("[data-tutorial-step]",`${(e.tutorialStepIndex||0)+1}/${e.tutorialStepCount||1}`),s("[data-tutorial-instruction]",e.tutorialInstruction||"");const a=e.tutorialStepId==="finish";t.querySelectorAll("[data-tutorial-finish-actions]").forEach(r=>{r.hidden=!a}),t.querySelectorAll('[data-action="tutorial-next"]').forEach(r=>{r.hidden=a})}setHudCollapsed(e){this.shell?.classList.toggle("panel-collapsed",!!e);const t=this.root.querySelector('[data-action="toggle-hud"]'),i=t?.querySelector(".hud-toggle-label");!t||!i||(t.setAttribute("aria-expanded",String(!e)),t.setAttribute("aria-label",e?"Show side panel":"Hide side panel"),i.textContent=e?"Show Panel":"Hide Panel")}setSidePanelSection(e="match"){this.sidePanelSection=e,this.root.querySelectorAll("[data-panel-section]").forEach(t=>{t.classList.toggle("is-active",t.dataset.panelSection===e)}),this.root.querySelectorAll("[data-panel-tab]").forEach(t=>{const i=t.dataset.panelTab===e;t.classList.toggle("is-active",i),t.setAttribute("aria-pressed",String(i))})}setDebugPhysics(e){this.shell?.classList.toggle("debug-physics",!!e)}setDebugOnline(e){this.debugOnline=!!e,this.shell?.classList.toggle("debug-online",this.debugOnline)}updateThemeLabels(){const e=Object.values(ps).map(t=>t.label).join(", ");this.root.querySelector("[data-theme-labels]")?.replaceChildren(e)}showVsIntro({leftName:e="Player 1",leftMeta:t="You",rightName:i="Player 2",rightMeta:s="Opponent",modeLabel:a="Online Match",roomCode:r=""}={}){this.hideVsIntro({immediate:!0});const o=document.createElement("div");o.className="vs-intro-overlay",o.setAttribute("role","status");const l=document.createElement("div");l.className="vs-intro-frame";const c=(g,v,m)=>{const d=document.createElement("div");d.className=`vs-intro-player vs-intro-player-${m}`;const E=document.createElement("span");E.className="vs-intro-meta",E.textContent=v;const M=document.createElement("strong");M.textContent=g;const b=document.createElement("span");return b.className="vs-intro-chip",b.textContent=m==="left"?"Your Side":"Opponent Side",d.append(E,M,b),d},h=document.createElement("div");h.className="vs-intro-center";const u=document.createElement("span");u.textContent=a;const p=document.createElement("strong");p.textContent="VS";const f=document.createElement("small");f.textContent=r?`Room ${r}`:"Server synced match",h.append(u,p,f),l.append(c(e,t,"left"),h,c(i,s,"right")),o.append(l),this.shell?.appendChild(o),this.vsIntroOverlay=o,window.requestAnimationFrame(()=>o.classList.add("is-visible")),window.clearTimeout(this.vsIntroTimer),this.vsIntroTimer=window.setTimeout(()=>this.hideVsIntro(),2300)}hideVsIntro({immediate:e=!1}={}){window.clearTimeout(this.vsIntroTimer),this.vsIntroTimer=0;const t=this.vsIntroOverlay;if(t){if(this.vsIntroOverlay=null,e){t.remove();return}t.classList.add("is-leaving"),window.setTimeout(()=>t.remove(),360)}}dispose(){this.hideVsIntro({immediate:!0}),this.handleActionClick&&(this.root.removeEventListener("click",this.handleCosmeticClick,!0),this.root.removeEventListener("click",this.handleConfirmationClick,!0),this.root.removeEventListener("click",this.handleActionClick),this.root.removeEventListener("click",this.handleChoiceClick),this.root.removeEventListener("click",this.handleOnlineChoiceClick),this.root.removeEventListener("click",this.handlePublicChoiceClick),this.root.removeEventListener("click",this.handleSettingClick),this.root.removeEventListener("change",this.handleSettingChange),this.root.removeEventListener("input",this.handleSetupInput))}}class XS{constructor(e){this.root=e,this.handleResize=()=>this.update()}init(){this.update(),window.addEventListener("resize",this.handleResize),window.addEventListener("orientationchange",this.handleResize),window.visualViewport?.addEventListener("resize",this.handleResize)}update(){const e=Math.round(window.visualViewport?.width||window.innerWidth||0),t=Math.round(window.visualViewport?.height||window.innerHeight||0),i=typeof window.matchMedia=="function"?window.matchMedia("(hover: none) and (pointer: coarse)").matches:!1,s=e<=760||i&&t<=620,a=e<=1080||t<=760,r=t>e;this.root.classList.toggle("is-mobile",s),this.root.classList.toggle("is-compact",a),this.root.classList.toggle("is-portrait",r),this.root.classList.toggle("is-landscape",!r)}dispose(){window.removeEventListener("resize",this.handleResize),window.removeEventListener("orientationchange",this.handleResize),window.visualViewport?.removeEventListener("resize",this.handleResize)}}const $o=1;function fn(){return{version:$o,themeId:Eo,sound:!0,music:!0,cameraMotion:!0,reducedEffects:!1,quality:"auto"}}function Ac(){if(typeof window>"u"||!window.localStorage)return fn();try{const n=window.localStorage.getItem(bi.settings);if(!n)return fn();const e=JSON.parse(n);if(!e||typeof e!="object")return fn();const t={...fn(),...e,version:$o};return t.quality=kc.includes(t.quality)?t.quality:"auto",t}catch{return fn()}}function Oh(n){if(!(typeof window>"u"||!window.localStorage))try{window.localStorage.setItem(bi.settings,JSON.stringify({...fn(),...n,version:$o,quality:kc.includes(n.quality)?n.quality:"auto"}))}catch{}}function $S(){const n=fn();return Oh(n),n}function YS(){if(typeof window>"u"||!window.localStorage)return{playerOneName:qe.playerOneName,playerTwoName:qe.playerTwoName};try{const n=window.localStorage.getItem(bi.playerNames),e=n?JSON.parse(n):null;return{playerOneName:e?.playerOneName||qe.playerOneName,playerTwoName:e?.playerTwoName||qe.playerTwoName}}catch{return{playerOneName:qe.playerOneName,playerTwoName:qe.playerTwoName}}}function KS(n){if(!(typeof window>"u"||!window.localStorage))try{window.localStorage.setItem(bi.playerNames,JSON.stringify({playerOneName:n.playerOneName||qe.playerOneName,playerTwoName:n.playerTwoName||qe.playerTwoName}))}catch{}}class jS{constructor({root:e}){this.root=e,this.state=xe.loading,this.returnState=xe.mainMenu,this.hudCollapsed=!1,this.debugPhysics=typeof window<"u"?new URLSearchParams(window.location.search).has("debugPhysics"):!1,this.debugBot=typeof window<"u"?new URLSearchParams(window.location.search).has("debugBot"):!1,this.debugOnline=typeof window<"u"?new URLSearchParams(window.location.search).has("debugOnline"):!1,this.settings=Ac();const t=YS();this.localSetup={...qe,...t},this.match={...Ft,playerOneName:this.localSetup.playerOneName,playerTwoName:this.localSetup.playerTwoName},this.matchStateManager=null,this.botController=null,this.challengeManager=null,this.practiceController=null,this.onboardingManager=null,this.coachHintManager=null,this.practiceStatsManager=null,this.tutorialController=null,this.cosmeticManager=null,this.cosmeticPreviewController=null,this.onlineClient=null,this.onlineRoomController=null,this.onlinePublicQueueController=null,this.onlineSessionManager=null,this.onlineStateSync=null,this.publicQueueTimer=0,this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,this.customizeReturnSection="setup",this.introTimer=0,this.handleResize=()=>this.sceneRenderer?.requestResize?.(),this.handleKeydown=i=>this.handleGlobalKeydown(i)}init(){this.ui=new WS({app:this,root:this.root}),this.ui.init(),this.ui.setDebugPhysics(this.debugPhysics),this.ui.setDebugOnline?.(this.debugOnline),this.responsive=new XS(this.ui.shell),this.responsive.init(),this.audioManager=new Xh(this.settings),this.audioManager.init(),this.applyTheme(this.settings.themeId||Eo,{persist:!1}),this.applySettings({persist:!1}),this.ui.updateLocalSetup(this.localSetup),this.ui.updateSettings(this.settings),this.ui.updateMatch(this.match),this.ui.setHudCollapsed(this.hudCollapsed),this.sceneRenderer=new xS({canvas:this.ui.getCanvas(),root:this.ui.shell,theme:nl(this.settings.themeId),settings:this.settings,debugPhysics:this.debugPhysics,physicsCallbacks:{onShotStarted:()=>{this.updatePhysicsHud("Shot in motion.",{shotPower:"Moving",shotPowerRatio:1})},onPiecePocketed:t=>this.handlePhysicsPocketed(t),onShotSettled:t=>this.handlePhysicsSettled(t),onCollision:t=>this.handlePhysicsCollision(t),onStatus:t=>this.updatePhysicsHud(t)},inputCallbacks:{onStatus:(t,i)=>this.updatePhysicsHud(t,i),onPowerChange:t=>this.handleInputPower(t),onPlacementChanged:t=>this.handleInputPlacementChanged(t),onAimCreated:()=>this.handleInputAimCreated(),onAimUpdated:t=>this.handleInputAimUpdated(t),shouldDeferShotRelease:()=>this.shouldDeferShotRelease(),onShotReleased:t=>this.handleShotReleased(t)}}),this.sceneRenderer.init(),this.sceneRenderer.applySettings(this.settings),this.sceneRenderer.setBoardStyle(this.localSetup.boardStyle),this.cosmeticManager=new cu({sceneRenderer:this.sceneRenderer}),this.cosmeticManager.applyLoadout(),this.cosmeticPreviewController=new hu({cosmeticManager:this.cosmeticManager}),this.ui.updateCosmeticsPanel?.(this.cosmeticPreviewController.getModel()),this.botController=new tu({sceneRenderer:this.sceneRenderer,getMatchStateManager:()=>this.matchStateManager,getAppState:()=>this.state,canRun:()=>this.state===xe.playing&&this.ui?.sidePanelSection!=="customize",debugBot:this.debugBot,callbacks:{onStatus:(t,i)=>this.updatePhysicsHud(t,i),onShotFired:(t,i)=>this.handleBotShotFired(t,i)}}),this.challengeManager=new ru({sceneRenderer:this.sceneRenderer,callbacks:{onChange:(t,i)=>this.handleChallengeChange(t,i),onSuccess:t=>this.handleChallengeResult(t,!0),onFail:t=>this.handleChallengeResult(t,!1)}}),this.onboardingManager=new TS,this.coachHintManager=new ES,this.practiceStatsManager=new PS,this.practiceController=new RS({sceneRenderer:this.sceneRenderer,statsManager:this.practiceStatsManager,coachHints:this.coachHintManager,callbacks:{onChange:t=>this.handlePracticeChange(t)}}),this.tutorialController=new AS({sceneRenderer:this.sceneRenderer,coachHints:this.coachHintManager,callbacks:{onChange:t=>this.handleTutorialChange(t)}}),this.onlineClient=new wd,this.onlineSessionManager=new Pd,this.onlineStateSync=new Ad({sceneRenderer:this.sceneRenderer}),this.onlineRoomController=new Cd({client:this.onlineClient,callbacks:{onChange:t=>this.handleOnlineControllerChange(t),onSession:(t,i)=>this.handleOnlineSession(t,i),onRoomState:t=>this.handleOnlineRoomState(t),onMatchStarted:(t,i)=>this.handleOnlineMatchStarted(t,i),onShotAccepted:(t,i)=>this.handleOnlineShotAccepted(t,i),onShotRejected:(t,i)=>this.handleOnlineShotRejected(t,i),onShotStarted:(t,i)=>this.handleOnlineShotStarted(t,i),onShotSettled:(t,i)=>this.handleOnlineShotSettled(t,i),onMatchState:(t,i)=>this.handleOnlineMatchState(t,i),onMatchFinished:(t,i)=>this.handleOnlineMatchFinished(t,i),onPlayerLeft:(t,i)=>this.handleOnlinePlayerLeft(t,i),onPlayerDisconnected:(t,i)=>this.handleOnlineDisconnectGrace(t,i),onDisconnectGrace:(t,i)=>this.handleOnlineDisconnectGrace(t,i),onDisconnectExpired:(t,i)=>this.handleOnlineDisconnectExpired(t,i),onRoomClosed:(t,i)=>this.handleOnlineRoomClosed(t,i),onPlayerReconnected:(t,i)=>this.handleOnlinePlayerReconnected(t,i),onReconnectAccepted:(t,i)=>this.handleOnlineReconnectAccepted(t,i),onReconnectRejected:(t,i)=>this.handleOnlineReconnectRejected(t,i),onSessionExpired:(t,i)=>this.handleOnlineReconnectRejected(t,i),onTurnTimer:(t,i)=>this.handleOnlineTurnTimer(t,i),onTurnTimeout:(t,i)=>this.handleOnlineTurnTimeout(t,i),onRematchRequested:(t,i)=>this.handleOnlineRematchState(t,i),onRematchDeclined:(t,i)=>this.handleOnlineRematchState(t,i),onRematchStarted:(t,i)=>this.handleOnlineRematchStarted(t,i),onError:(t,i)=>this.handleOnlineError(t,i)}}),this.onlinePublicQueueController=new Ed({client:this.onlineClient,callbacks:{onChange:t=>this.handlePublicQueueChange(t),onQueueJoined:(t,i)=>this.handlePublicQueueJoined(t,i),onQueueStatus:(t,i)=>this.handlePublicQueueStatus(t,i),onQueueCancelled:(t,i)=>this.handlePublicQueueCancelled(t,i),onMatchFound:(t,i)=>this.handlePublicMatchFound(t,i),onError:(t,i)=>this.handlePublicQueueError(t,i)}}),this.ui.updateChallengePanel?.(this.challengeManager.getPanelModel()),this.ui.updateOnlinePanel?.(yt(this.onlineRoomController.state)),this.ui.updatePublicMatchmakingPanel?.(Jt(this.onlinePublicQueueController.state)),window.addEventListener("resize",this.handleResize),window.visualViewport?.addEventListener("resize",this.handleResize),window.addEventListener("keydown",this.handleKeydown),this.showLocalSetup();const e=this.handleIncomingRoomLink();e||this.showSavedOnlineSessionPrompt(),!e&&this.onboardingManager.shouldShow()&&this.showOnboarding()}setState(e){if(!Object.values(xe).includes(e))return;![xe.rules,xe.settings,xe.about].includes(e)&&e!==xe.paused&&(this.returnState=e),this.state=e,this.ui.setState(e),this.sceneRenderer?.setStateFocus(e),this.isCurrentTurnBot()&&this.sceneRenderer?.setInputEnabled(!1)}showLoading(){this.showLocalSetup()}showMainMenu(){this.showLocalSetup()}showModeSelect(){this.showLocalSetup()}showLocalSetup(){this.cancelCosmeticPreviewIfLeaving("setup"),this.endOnlineSession({updateHud:!1}),this.botController?.cancel(),this.exitSoloModes({restoreBoard:!0,updateHud:!1}),this.ui.setSidePanelSection("setup"),this.hudCollapsed=!1,this.ui.setHudCollapsed(!1),this.setState(xe.playing),this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0),this.ui.updateLocalSetup(this.localSetup)}showMatchPanel(){this.cancelCosmeticPreviewIfLeaving("match"),this.ui.setSidePanelSection("match"),this.hudCollapsed=!1,this.ui.setHudCollapsed(!1),this.state!==xe.result&&(this.setState(xe.playing),this.matchStateManager||(this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0)))}startLocalShellMatch({preserveSetup:e=!1}={}){this.endOnlineSession({updateHud:!1}),this.botController?.cancel(),this.exitSoloModes({restoreBoard:!0,updateHud:!1}),e||(this.localSetup={...this.localSetup,...this.ui.getLocalSetupValues()});const t=this.localSetup.matchMode||qe.matchMode,i=this.localSetup.botDifficulty||qe.botDifficulty,s=this.localSetup.playerOneName||qe.playerOneName;let a=this.localSetup.playerTwoName||qe.playerTwoName;t==="vsBot"&&(!a||a===qe.playerTwoName)&&(a=ra(i)),this.localSetup.matchMode=t,this.localSetup.botDifficulty=i,this.localSetup.playerOneName=s,this.localSetup.playerTwoName=a,KS({playerOneName:s,playerTwoName:a}),this.match={...Ft,currentTurn:s,playerOneName:s,playerTwoName:a,matchMode:t,botDifficulty:i,classicRuleVariant:this.localSetup.classicRuleVariant},this.matchStateManager=new Pu({playerOneName:s,playerTwoName:a,matchMode:t,botDifficulty:i,classicRuleVariant:this.localSetup.classicRuleVariant,ruleMode:this.localSetup.ruleMode,coinSide:this.localSetup.coinSide,boardStyle:this.localSetup.boardStyle,matchType:this.localSetup.matchType}),this.sceneRenderer?.setBoardStyle(this.localSetup.boardStyle),this.sceneRenderer?.clearFeedback(),this.sceneRenderer?.setSceneOrbitEnabled(!1),this.sceneRenderer?.resetPhysics(),this.sceneRenderer?.prepareForTurn({baseline:this.matchStateManager.getActiveBaseline(),enabled:!1,silent:!0,rotateCamera:this.shouldRotateCameraForTurn()}),this.match={...this.match,...this.matchStateManager.toHudMatch()},this.ui.updateMatch(this.match),this.setState(xe.playing),this.ui.setSidePanelSection("match"),this.hudCollapsed=!0,this.ui.setHudCollapsed(!0),this.playMatchIntro()}showPause(){this.state===xe.playing&&(this.botController?.pause(),this.returnState=xe.playing,this.setState(xe.paused))}resumeMatch(){if(this.setState(xe.playing),this.isOnlineMatchActive()){this.prepareOnlineTurn({silent:!0});return}this.botController?.resume(),!this.isCurrentTurnBot()&&this.matchStateManager&&this.prepareActiveTurn({silent:!0})}showRules(){this.showSidePanelSection("rules")}showSettings(){this.showSidePanelSection("settings")}showAbout(){this.showSidePanelSection("about")}showCustomizePanel(){this.botController?.pause(),this.customizeReturnSection=this.ui?.sidePanelSection||(this.matchStateManager?"match":"setup");const e=this.cosmeticPreviewController?.open();this.ui.setSidePanelSection("customize"),this.hudCollapsed=!1,this.ui.setHudCollapsed(!1),this.setState(xe.playing),this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!this.matchStateManager),this.ui.updateCosmeticsPanel?.(e),this.updatePhysicsHud("Preview cosmetics on the live 3D table. Equip to save locally.",{bannerTone:"default"})}selectCosmeticCategory(e){this.ui.updateCosmeticsPanel?.(this.cosmeticPreviewController?.setCategory(e))}previewCosmetic(e,t){const i=this.cosmeticPreviewController?.preview(e,t);this.ui.updateCosmeticsPanel?.(i),this.updatePhysicsHud(i?.message||"Cosmetic preview updated.",{bannerTone:i?.tone||"default"})}equipCosmetics(){const e=this.cosmeticPreviewController?.equip();this.ui.updateCosmeticsPanel?.(e),this.updatePhysicsHud(e?.message||"Cosmetic loadout saved.",{bannerTone:e?.tone||"success"})}resetCosmetics(){const e=this.cosmeticPreviewController?.resetToDefault();this.ui.updateCosmeticsPanel?.(e),this.updatePhysicsHud(e?.message||"Default cosmetics restored.",{bannerTone:"success"})}closeCustomizePanel(){const e=this.cosmeticPreviewController?.cancelPreview();this.ui.updateCosmeticsPanel?.(e);const t=this.customizeReturnSection||(this.matchStateManager?"match":"setup");this.showSidePanelSection(t),t==="match"&&this.matchStateManager&&(this.isCurrentTurnBot()?this.botController?.resume():this.prepareActiveTurn({silent:!0}))}cancelCosmeticPreviewIfLeaving(e){this.ui?.sidePanelSection!=="customize"||e==="customize"||this.ui.updateCosmeticsPanel?.(this.cosmeticPreviewController?.cancelPreview?.())}showOnboarding(){const e=this.onboardingManager?.open();this.ui.updateOnboarding?.(e)}onboardingNext(){this.ui.updateOnboarding?.(this.onboardingManager?.next())}onboardingPrevious(){this.ui.updateOnboarding?.(this.onboardingManager?.previous())}skipOnboarding(){this.ui.updateOnboarding?.(this.onboardingManager?.close({markSeen:!0})),this.showLocalSetup()}resetOnboarding(){this.onboardingManager?.reset(),this.ui.updateOnboarding?.(this.onboardingManager?.getViewModel?.()),this.updatePhysicsHud("Onboarding will show on next launch.",{bannerTone:"success"})}startTutorialFromOnboarding(){this.ui.updateOnboarding?.(this.onboardingManager?.close({markSeen:!0})),this.startTutorial()}startPracticeFromOnboarding(){this.ui.updateOnboarding?.(this.onboardingManager?.close({markSeen:!0})),this.showPracticePanel(),this.startPractice("freePractice")}showPracticePanel(){this.cancelCosmeticPreviewIfLeaving("practice"),this.endOnlineSession({updateHud:!1}),this.botController?.cancel(),this.challengeManager?.exitChallenge(),this.matchStateManager=null,this.ui.setSidePanelSection("practice"),this.hudCollapsed=!1,this.ui.setHudCollapsed(!1),this.setState(xe.playing),this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0),this.match={...this.match,...this.practiceController?.getHud?.()},this.ui.updateMatch(this.match)}startPractice(e=this.localSetup.practiceType){this.endOnlineSession({updateHud:!1}),this.botController?.cancel(),this.matchStateManager=null,this.challengeManager?.exitChallenge(),this.tutorialController?.exit(),this.localSetup.practiceType=e||this.localSetup.practiceType,this.ui.updateLocalSetup(this.localSetup),this.sceneRenderer?.setSceneOrbitEnabled(!1);const t=this.practiceController?.start(this.localSetup.practiceType);this.match={...Ft,...t},this.ui.updateMatch(this.match),this.ui.setSidePanelSection("practice"),this.setState(xe.playing)}startTutorial(){this.endOnlineSession({updateHud:!1}),this.botController?.cancel(),this.matchStateManager=null,this.challengeManager?.exitChallenge(),this.practiceController?.exit(),this.sceneRenderer?.setSceneOrbitEnabled(!1);const e=this.tutorialController?.start();this.match={...Ft,...e},this.ui.updateMatch(this.match),this.ui.updateTutorial?.(e),this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.()),this.ui.setSidePanelSection("practice"),this.setState(xe.playing)}tutorialNext(){const e=this.tutorialController?.next();this.match={...this.match,...e},this.ui.updateMatch(this.match),this.ui.updateTutorial?.(e),this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.())}exitTutorial({complete:e=!1}={}){this.tutorialController?.exit({complete:e}),this.ui.updateTutorial?.(this.tutorialController?.getHud?.()),this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.()),e||this.showLocalSetup()}finishTutorialToLocal(){this.exitTutorial({complete:!0}),this.updateLocalSetup("matchMode","local2p"),this.showLocalSetup()}finishTutorialToBot(){this.exitTutorial({complete:!0}),this.updateLocalSetup("matchMode","vsBot"),this.showLocalSetup()}finishTutorialToPractice(){this.exitTutorial({complete:!0}),this.showPracticePanel(),this.startPractice("freePractice")}finishTutorialToMenu(){this.exitTutorial({complete:!0}),this.showLocalSetup()}resetPractice(){const e=this.practiceController?.reset();this.match={...this.match,...e},this.ui.updateMatch(this.match)}nextPracticeDrill(){const e=this.practiceController?.next();this.localSetup.practiceType=this.practiceController?.type||this.localSetup.practiceType,this.match={...this.match,...e},this.ui.updateMatch(this.match),this.ui.updateLocalSetup(this.localSetup)}exitPractice(){this.practiceController?.exit(),this.showLocalSetup()}showChallengePanel(){this.cancelCosmeticPreviewIfLeaving("challenges"),this.endOnlineSession({updateHud:!1}),this.botController?.cancel(),this.practiceController?.exit(),this.tutorialController?.exit(),this.matchStateManager=null,this.ui.setSidePanelSection("challenges"),this.hudCollapsed=!1,this.ui.setHudCollapsed(!1),this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.()),this.setState(xe.playing),this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0)}selectChallenge(e){this.challengeManager?.selectChallenge(e),this.ui.setSidePanelSection("challenges")}startChallenge(e=""){this.endOnlineSession({updateHud:!1}),this.botController?.cancel(),this.practiceController?.exit(),this.tutorialController?.exit(),this.matchStateManager=null,this.sceneRenderer?.setSceneOrbitEnabled(!1);const t=this.challengeManager?.startChallenge(e);this.match={...Ft,...t},this.ui.updateMatch(this.match),this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.()),this.ui.setSidePanelSection("challenges"),this.setState(xe.playing)}retryChallenge(){const e=this.challengeManager?.retryChallenge();this.match={...this.match,...e},this.ui.updateMatch(this.match),this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.())}nextChallenge(){const e=this.challengeManager?.nextChallenge();this.match={...this.match,...e},this.ui.updateMatch(this.match),this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.())}exitChallenge(){this.challengeManager?.exitChallenge(),this.showLocalSetup()}resetChallengeProgress(){this.challengeManager?.resetProgress(),this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.())}exitSoloModes({restoreBoard:e=!1,updateHud:t=!0}={}){const i=!!(this.challengeManager?.active||this.practiceController?.active||this.tutorialController?.active);this.challengeManager?.active&&this.challengeManager.exitChallenge(),this.practiceController?.active&&this.practiceController.exit(),this.tutorialController?.active&&this.tutorialController.exit(),(e||i)&&this.sceneRenderer?.clearTrainingScenario?.(),t&&(this.match={...this.match,challengeActive:!1,practiceActive:!1,tutorialActive:!1,challengeTitle:"",practiceTitle:""},this.ui.updateMatch(this.match),this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.()))}showOnlinePanel(){if(this.match?.matchMode==="onlinePublic"||this.getOnlineMatchState()?.mode==="onlinePublic"){this.showPublicMatchmakingPanel();return}this.cancelCosmeticPreviewIfLeaving("online"),this.stopPublicQueueTimer(),this.botController?.cancel(),this.exitSoloModes({restoreBoard:!0,updateHud:!1}),this.matchStateManager=null,this.ui.setSidePanelSection("online"),this.hudCollapsed=!1,this.ui.setHudCollapsed(!1),this.setState(xe.playing);const e=this.getOnlineMatchState();this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!e||e.status!=="playing"),this.ui.updateOnlinePanel?.(yt(this.onlineRoomController?.state)),e&&this.applyOnlineMatchSnapshot(e,this.onlineRoomController.state,{reconcile:!1,updatePanel:!0})}showPublicMatchmakingPanel(){this.cancelCosmeticPreviewIfLeaving("onlinePublic"),this.botController?.cancel(),this.exitSoloModes({restoreBoard:!0,updateHud:!1}),this.matchStateManager=null,this.ui.setSidePanelSection("onlinePublic"),this.hudCollapsed=!1,this.ui.setHudCollapsed(!1),this.setState(xe.playing);const e=this.getOnlineMatchState();this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!e||e.status!=="playing"),this.ui.updatePublicMatchmakingPanel?.(Jt(this.onlinePublicQueueController?.state)),e?.mode==="onlinePublic"&&this.applyOnlineMatchSnapshot(e,this.onlineRoomController.state,{reconcile:!1,updatePanel:!0})}showSavedOnlineSessionPrompt(){const e=this.onlineSessionManager?.loadSession?.();!e||this.onlineRoomController?.state?.roomCode||(this.onlineRoomController?.showReconnectPrompt(e),this.ui.setSidePanelSection("online"),this.ui.updateOnlinePanel?.(yt(this.onlineRoomController?.state)),this.updatePhysicsHud("Reconnect to your previous online room or discard the saved session.",{bannerTone:"warning"}))}async reconnectOnlineSession(){const e=this.onlineSessionManager?.getReconnectPayload?.();if(!e){this.discardOnlineSession();return}this.cancelCosmeticPreviewIfLeaving("online"),this.botController?.cancel(),this.exitSoloModes({restoreBoard:!0,updateHud:!1}),this.matchStateManager=null,this.ui.setSidePanelSection("online"),this.sceneRenderer?.setInputEnabled(!1);try{await this.onlineRoomController?.reconnectRoom(e)}catch(t){this.handleOnlineReconnectRejected({message:t.message||"Could not reconnect."},this.onlineRoomController?.state)}}discardOnlineSession(){this.onlineSessionManager?.clearSession?.(),this.onlineRoomController?.setState?.({reconnectPrompt:null,message:"Saved online session discarded.",error:""}),this.ui.updateOnlinePanel?.(yt(this.onlineRoomController?.state)),this.updatePhysicsHud("Saved online session discarded.",{bannerTone:"default"})}async joinPublicQueue(e={}){this.cancelCosmeticPreviewIfLeaving("onlinePublic"),this.botController?.cancel(),this.exitSoloModes({restoreBoard:!0,updateHud:!1}),this.matchStateManager=null,this.onlineRoomController?.leaveRoom(),this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0),this.ui.setSidePanelSection("onlinePublic");try{await this.onlinePublicQueueController?.joinQueue(e)}catch(t){this.handlePublicQueueError({message:t.message||"Could not join public queue."},this.onlinePublicQueueController?.state)}}cancelPublicQueue(){this.onlinePublicQueueController?.cancelQueue(),this.stopPublicQueueTimer(),this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0)}handlePublicQueueChange(e={}){this.ui?.updatePublicMatchmakingPanel?.(Jt(e)),e.status==="queued"?this.startPublicQueueTimer():e.status!=="matched"&&this.stopPublicQueueTimer()}handlePublicQueueJoined(e,t={}){this.startPublicQueueTimer(),this.updatePhysicsHud("Searching for public opponent...",{bannerTone:"warning"}),this.ui?.updatePublicMatchmakingPanel?.(Jt(t))}handlePublicQueueStatus(e,t={}){this.ui?.updatePublicMatchmakingPanel?.(Jt(t))}handlePublicQueueCancelled(e,t={}){this.stopPublicQueueTimer(),this.updatePhysicsHud(e?.reason||"Queue cancelled.",{bannerTone:"default"}),this.ui?.updatePublicMatchmakingPanel?.(Jt(t))}async handlePublicMatchFound(e,t={}){this.stopPublicQueueTimer(),this.matchStateManager=null,this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0),await this.onlineRoomController?.connect(),this.onlineRoomController?.adoptMatchedRoom(e),this.onlinePublicQueueController?.readyForMatch(e),this.ui.setSidePanelSection("onlinePublic"),this.ui.updatePublicMatchmakingPanel?.(Jt(t)),this.updatePhysicsHud(`Match found vs ${e?.opponentName||"opponent"}. Starting...`,{matchMode:"onlinePublic",matchModeLabel:"Online Public",onlineActive:!0,onlineConnectionStatus:"Connected",onlineTurnStatus:"Match found",bannerTone:"success"}),this.audioManager?.play("matchStart",{intensity:.65})}handlePublicQueueError(e,t={}){this.stopPublicQueueTimer(),this.updatePhysicsHud(e?.message||"Public matchmaking error.",{bannerTone:"danger"}),this.ui?.updatePublicMatchmakingPanel?.(Jt(t||this.onlinePublicQueueController?.state))}startPublicQueueTimer(){this.publicQueueTimer||(this.publicQueueTimer=window.setInterval(()=>{this.onlinePublicQueueController?.ping?.(),this.ui?.updatePublicMatchmakingPanel?.(Jt(this.onlinePublicQueueController?.state))},1e3))}stopPublicQueueTimer(){window.clearInterval(this.publicQueueTimer),this.publicQueueTimer=0}handleIncomingRoomLink(){if(typeof window>"u")return!1;const e=new URL(window.location.href),t=(e.searchParams.get("room")||e.searchParams.get("carromRoom")||"").trim().toUpperCase();if(!t)return!1;e.searchParams.delete("room"),e.searchParams.delete("carromRoom"),window.history?.replaceState?.({},"",e.toString()),this.showOnlinePanel(),this.ui?.setOnlineView?.("join");const i=this.root?.querySelector?.("#onlineRoomCode");return i&&(i.value=t),window.setTimeout(()=>{this.joinOnlineRoom({playerName:this.localSetup.playerTwoName||qe.playerTwoName,roomCode:t})},250),!0}async createOnlineRoom(e={}){this.cancelCosmeticPreviewIfLeaving("online"),this.onlinePublicQueueController?.cancelQueue?.(),this.stopPublicQueueTimer(),this.botController?.cancel(),this.exitSoloModes({restoreBoard:!0,updateHud:!1}),this.matchStateManager=null,this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0),this.ui.setSidePanelSection("online");try{await this.onlineRoomController?.createRoom(e)}catch(t){this.handleOnlineError({message:t.message||"Could not create online room."},this.onlineRoomController?.state)}}async joinOnlineRoom(e={}){this.cancelCosmeticPreviewIfLeaving("online"),this.onlinePublicQueueController?.cancelQueue?.(),this.stopPublicQueueTimer(),this.botController?.cancel(),this.exitSoloModes({restoreBoard:!0,updateHud:!1}),this.matchStateManager=null,this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0),this.ui.setSidePanelSection("online");try{await this.onlineRoomController?.joinRoom(e)}catch(t){this.handleOnlineError({message:t.message||"Could not join online room."},this.onlineRoomController?.state)}}leaveOnlineRoom(){const e=this.match?.matchMode==="onlinePublic"||this.onlineRoomController?.state?.roomType==="public"||this.onlineRoomController?.state?.roomState?.roomType==="public";this.onlineRoomController?.leaveRoom(),this.onlinePublicQueueController?.cancelQueue?.(),this.onlineSessionManager?.clearSession?.(),this.stopPublicQueueTimer(),this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,this.matchStateManager=null,this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0),this.sceneRenderer?.clearFeedback?.(),this.match={...Ft,status:"Left online room."},this.ui.updateMatch(this.match),e?this.showPublicMatchmakingPanel():this.showOnlinePanel()}startOnlineMatch(){this.onlineRoomController?.startMatch()}requestOnlineRematch(){const e=this.onlineRoomController?.requestRematch?.();this.updatePhysicsHud(e?"Rematch request sent.":"Could not request rematch.",{onlineTurnStatus:e?"Rematch requested":"Rematch unavailable",bannerTone:e?"success":"warning"}),this.ui.updateOnlinePanel?.(yt(this.onlineRoomController?.state))}respondOnlineRematch(e){const t=this.onlineRoomController?.respondRematch?.(e);this.updatePhysicsHud(t?e?"Rematch accepted.":"Rematch declined.":"Could not respond to rematch.",{onlineTurnStatus:e?"Rematch accepted":"Rematch declined",bannerTone:t?e?"success":"warning":"danger"}),this.ui.updateOnlinePanel?.(yt(this.onlineRoomController?.state))}copyOnlineRoomCode(){const e=this.onlineRoomController?.state?.roomCode||"";if(!e){this.updatePhysicsHud("No room code to copy.",{bannerTone:"warning"});return}if(navigator?.clipboard?.writeText){navigator.clipboard.writeText(e).then(()=>{this.updatePhysicsHud(`Room code ${e} copied.`,{bannerTone:"success"})}).catch(()=>{this.updatePhysicsHud(`Room code: ${e}`,{bannerTone:"default"})});return}this.updatePhysicsHud(`Room code: ${e}`,{bannerTone:"default"})}getOnlineRoomLink(){const e=this.onlineRoomController?.state?.roomCode||"";if(!e||typeof window>"u")return"";const t=new URL(window.location.href);return t.searchParams.set("room",e),t.toString()}copyOnlineRoomLink(){const e=this.getOnlineRoomLink();if(!e){this.updatePhysicsHud("No room link to share.",{bannerTone:"warning"});return}if(navigator?.clipboard?.writeText){navigator.clipboard.writeText(e).then(()=>{this.updatePhysicsHud("Room invite link copied.",{bannerTone:"success"})}).catch(()=>{this.updatePhysicsHud(`Room link: ${e}`,{bannerTone:"default"})});return}this.updatePhysicsHud(`Room link: ${e}`,{bannerTone:"default"})}requestOnlineState(){this.debugOnline&&(this.onlineRoomController?.requestRoomState?.(),this.updatePhysicsHud("Requested authoritative online snapshot.",{onlineTurnStatus:"Syncing board",bannerTone:"default"}))}getActionConfirmation(e){const t=!!(this.onlineRoomController?.state?.roomCode||this.onlineRoomController?.state?.roomState||this.onlineRoomController?.state?.matchState||this.match?.matchMode==="onlinePrivate"||this.match?.matchMode==="onlinePublic"),i=this.onlinePublicQueueController?.state?.status==="queued"||!!this.onlinePublicQueueController?.state?.queueId,s=!!(this.matchStateManager&&this.state!==xe.result),a=!!this.practiceController?.active,r=!!this.tutorialController?.active,o=!!this.challengeManager?.active,l=a||r||o,c={eyebrow:"Online Room",title:"Leave online room?",body:"You will disconnect from the current online room and your opponent will be notified.",detail:"Use this only when you are ready to leave the match or lobby.",confirmLabel:"Leave Room",cancelLabel:"Stay"};return e==="quit-match"?t?c:s?{eyebrow:"Quit Match",title:"Quit current match?",body:"The active local match will end and the result screen will open.",detail:"Current board position and turn progress will not continue.",confirmLabel:"Quit Match",cancelLabel:"Keep Playing"}:null:e==="leave-online-room"?t?c:null:e==="cancel-public-queue"?i?{eyebrow:"Public Queue",title:"Cancel matchmaking?",body:"You will leave the public matchmaking queue.",confirmLabel:"Cancel Queue",cancelLabel:"Keep Searching"}:null:["main-menu","open-local-setup","mode-select"].includes(e)?t?c:s?{eyebrow:"Return To Setup",title:"Leave current match?",body:"Returning to setup will stop the current local match.",confirmLabel:"Leave Match",cancelLabel:"Keep Playing"}:l?{eyebrow:"Leave Activity",title:"Exit this activity?",body:"Current practice, tutorial, or challenge progress on the table will be cleared.",confirmLabel:"Exit",cancelLabel:"Stay"}:null:e==="restart-match"&&s?{eyebrow:"Restart Match",title:"Restart this match?",body:"The board, scores, queen state, and current turn will reset.",confirmLabel:"Restart",cancelLabel:"Cancel"}:e==="tutorial-exit"&&r?{eyebrow:"Tutorial",title:"Exit tutorial?",body:"You will return to setup and the current tutorial step will close.",confirmLabel:"Exit Tutorial",cancelLabel:"Continue"}:e==="exit-practice"&&a?{eyebrow:"Practice",title:"Exit practice?",body:"The current drill setup will be cleared.",confirmLabel:"Exit Practice",cancelLabel:"Continue"}:e==="reset-practice"&&a?{eyebrow:"Practice",title:"Reset drill?",body:"The drill pieces and shot state will return to the start.",confirmLabel:"Reset Drill",cancelLabel:"Cancel"}:e==="exit-challenge"&&o?{eyebrow:"Challenge",title:"Exit challenge?",body:"The current challenge attempt will end and the board will return to setup.",confirmLabel:"Exit Challenge",cancelLabel:"Continue"}:e==="reset-challenge-progress"?{eyebrow:"Challenge Progress",title:"Reset all challenge stars?",body:"Saved challenge progress on this device will be cleared.",confirmLabel:"Reset Progress",cancelLabel:"Cancel"}:e==="reset-cosmetics"?{eyebrow:"Cosmetics",title:"Reset cosmetics?",body:"Your equipped board, coin, striker, table, and VFX cosmetics will return to the default loadout.",confirmLabel:"Reset Loadout",cancelLabel:"Cancel"}:e==="reset-settings"?{eyebrow:"Settings",title:"Reset settings?",body:"Theme, sound, camera motion, effects, and quality preferences will return to defaults.",confirmLabel:"Reset Settings",cancelLabel:"Cancel"}:e==="reset-onboarding"?{eyebrow:"Onboarding",title:"Reset onboarding?",body:"The first-time guide will appear again on the next launch.",confirmLabel:"Reset Onboarding",cancelLabel:"Cancel"}:e==="discard-online-session"?{eyebrow:"Online Session",title:"Discard saved session?",body:"The reconnect prompt for the previous online room will be cleared from this device.",confirmLabel:"Discard Session",cancelLabel:"Keep Session"}:null}endOnlineSession({updateHud:e=!0}={}){(this.onlineRoomController?.state?.roomCode||this.onlineRoomController?.state?.matchState||this.onlineRoomController?.state?.roomState||this.onlinePublicQueueController?.state?.queueId||this.onlinePublicQueueController?.state?.status==="queued"||this.match?.matchMode==="onlinePrivate"||this.match?.matchMode==="onlinePublic")&&(this.onlineRoomController?.leaveRoom(),this.onlinePublicQueueController?.cancelQueue?.(),this.onlineSessionManager?.clearSession?.(),this.stopPublicQueueTimer(),this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,e&&(this.match={...Ft,status:"Online room closed."},this.ui?.updateMatch(this.match)))}handleOnlineControllerChange(e={}){if(this.ui?.updateOnlinePanel?.(yt(e)),this.match?.matchMode==="onlinePrivate"||this.match?.matchMode==="onlinePublic"){const t=e.matchState||e.roomState?.matchState||this.getOnlineMatchState();t&&!this.onlineShotActive&&(this.match=this.onlineStateSync?.toHud(t,e)||this.match,this.ui?.updateMatch(this.match))}}handleOnlineSession(e=null,t={}){e?.sessionId&&this.onlineSessionManager?.saveSession?.({...e,matchId:t.matchState?.matchId||t.roomState?.matchState?.matchId||e.matchId||"",mode:t.roomType==="public"||t.roomState?.roomType==="public"?"onlinePublic":e.mode})}handleOnlineRoomState(e={}){this.ui?.updateOnlinePanel?.(yt(e));const t=e.matchState||e.roomState?.matchState||null;if(t&&(this.match?.matchMode==="onlinePrivate"||this.match?.matchMode==="onlinePublic")&&!this.onlineShotActive){this.applyOnlineMatchSnapshot(t,e,{reconcile:!1});return}e.status==="disconnected"&&(this.match?.matchMode==="onlinePrivate"||this.match?.matchMode==="onlinePublic")&&(this.sceneRenderer?.setInputEnabled(!1),this.updatePhysicsHud(e.message||"Opponent left the room.",{onlineConnectionStatus:e.connectionStatus||"Disconnected",onlineTurnStatus:"Room closed",bannerTone:"warning"}))}handleOnlineMatchStarted(e,t={},{showIntro:i=!0}={}){this.botController?.cancel(),this.exitSoloModes({restoreBoard:!0,updateHud:!1}),this.matchStateManager=null,this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,this.onlineSessionManager?.updateSession?.({matchId:e?.matchId||"",roomCode:e?.roomCode||t.roomCode||"",mode:e?.mode||(t.roomType==="public"?"onlinePublic":"onlinePrivate"),playerId:t.playerId||""}),this.sceneRenderer?.clearFeedback?.(),this.sceneRenderer?.setSceneOrbitEnabled(!1),this.match=this.onlineStateSync?.applyMatchState(e,t)||{...Ft,matchMode:e?.mode==="onlinePublic"?"onlinePublic":"onlinePrivate"},this.ui.updateMatch(this.match),this.ui.updateOnlinePanel?.(yt(t)),this.ui.updatePublicMatchmakingPanel?.(Jt(this.onlinePublicQueueController?.state)),this.ui.setSidePanelSection(this.match.matchMode==="onlinePublic"?"onlinePublic":"online"),this.hudCollapsed=!0,this.ui.setHudCollapsed(!0),this.setState(xe.playing),this.audioManager?.play("matchStart"),i&&this.showOnlineVsIntro(e,t),this.sceneRenderer?.vfxManager?.banner?.show?.({eyebrow:this.match.matchModeLabel||"Online",title:"Match Started",detail:this.match.onlineTurnStatus||"Server-owned match state is live.",tone:"success",reduced:this.settings.reducedEffects}),this.prepareOnlineTurn({silent:!0})}handleOnlineReconnectAccepted(e,t={}){this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,this.handleOnlineSession(e.session,t);const i=e.matchState||e.roomState?.matchState||null;if(i){i.status==="finished"?this.applyOnlineMatchSnapshot(i,t,{reconcile:!0}):this.handleOnlineMatchStarted(i,t,{showIntro:!1}),this.updatePhysicsHud("Reconnected to online match.",{onlineConnectionStatus:"Connected",bannerTone:"success"});return}this.ui.updateOnlinePanel?.(yt(t)),this.updatePhysicsHud("Reconnected to online lobby.",{bannerTone:"success"})}handleOnlineReconnectRejected(e,t={}){this.onlineSessionManager?.clearSession?.(),this.sceneRenderer?.setInputEnabled(!1),this.ui.updateOnlinePanel?.(yt(t||this.onlineRoomController?.state)),this.updatePhysicsHud(e?.message||"Online session expired.",{onlineConnectionStatus:"Session expired",bannerTone:"warning"})}handleOnlineShotAccepted(e,t={}){this.onlineShotActive=!0,this.onlineAnimationSettled=!1,this.sceneRenderer?.setInputEnabled(!1),this.updatePhysicsHud("Shot accepted.",{onlineConnectionStatus:t.connectionStatus||"Connected",onlineTurnStatus:"Shot accepted",shotPower:"Queued",shotPowerRatio:.4}),this.ui?.updateOnlinePanel?.(yt(t))}handleOnlineShotRejected(e,t={}){this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,this.audioManager?.play("foul",{intensity:.45}),this.updatePhysicsHud(e?.message||"Shot rejected by server.",{onlineConnectionStatus:t.connectionStatus||"Connected",onlineTurnStatus:"Shot rejected",shotPower:"Ready",shotPowerRatio:0,bannerTone:"danger"}),this.prepareOnlineTurn({silent:!0})}handleOnlineShotStarted(e,t={}){this.onlineShotActive=!0,this.onlineAnimationSettled=!1,this.pendingOnlineSettledPayload=null,this.sceneRenderer?.setSceneOrbitEnabled(!1),this.sceneRenderer?.setInputEnabled(!1);const i=this.sceneRenderer?.applyAuthoritativeShot(e),s=Math.min(Math.max((Number(e?.power)||0)/st.MAX_SHOT_POWER,.35),1);this.updatePhysicsHud("Opponent shooting...",{onlineConnectionStatus:t.connectionStatus||"Connected",onlineTurnStatus:e.playerId===t.playerId?"Shot in motion":"Opponent shooting...",shotPower:"Moving",shotPowerRatio:1}),this.audioManager?.play("shotRelease",{intensity:s}),this.sceneRenderer?.playShotRelease(s),i||(this.onlineAnimationSettled=!0,this.updatePhysicsHud("Waiting for server result...",{onlineTurnStatus:"Syncing",bannerTone:"warning"}))}handleOnlineShotSettled(e,t={}){if(this.pendingOnlineSettledPayload=e,this.ui?.updateOnlinePanel?.(yt(t)),this.onlineAnimationSettled||!this.onlineShotActive){this.applyOnlineSettledPayload(e,t);return}this.updatePhysicsHud("Syncing server result...",{onlineTurnStatus:"Syncing",shotPower:"Syncing",shotPowerRatio:.2})}handleOnlineMatchState(e,t={}){if(e){if(this.onlineShotActive&&!this.onlineAnimationSettled){this.pendingOnlineSettledPayload={matchState:e};return}this.applyOnlineMatchSnapshot(e,t,{reconcile:!this.onlineShotActive})}}handleOnlineMatchFinished(e,t={}){if(this.onlineShotActive&&!this.onlineAnimationSettled){this.pendingOnlineSettledPayload={...e,matchState:e.matchState};return}this.applyOnlineSettledPayload(e,t)}handleOnlinePlayerLeft(e,t={}){this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0),this.updatePhysicsHud(e?.reason||"Opponent left.",{onlineConnectionStatus:t?.connectionStatus||"Player left",onlineTurnStatus:"Room paused",bannerTone:"warning"}),this.ui?.updateOnlinePanel?.(yt(t||this.onlineRoomController?.state))}handleOnlineDisconnectGrace(e,t={}){this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0),this.updatePhysicsHud(e?.message||"Opponent disconnected. Waiting for reconnect...",{onlineConnectionStatus:t?.connectionStatus||"Opponent disconnected",onlineTurnStatus:`Reconnect ${Math.max(0,Math.ceil((Number(e?.remainingMs)||0)/1e3))}s`,bannerTone:"warning"}),this.ui?.updateOnlinePanel?.(yt(t||this.onlineRoomController?.state))}handleOnlineDisconnectExpired(e,t={}){this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,this.onlineSessionManager?.clearSession?.(),this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0),this.updatePhysicsHud(e?.message||"Opponent did not reconnect.",{onlineConnectionStatus:"Room closed",onlineTurnStatus:"Closed",bannerTone:"danger"}),this.ui?.updateOnlinePanel?.(yt(t||this.onlineRoomController?.state))}handleOnlineRoomClosed(e,t={}){this.onlineSessionManager?.clearSession?.(),this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0),this.updatePhysicsHud(e?.reason||"Room closed.",{onlineConnectionStatus:"Room closed",onlineTurnStatus:"Closed",bannerTone:"warning"}),this.ui?.updateOnlinePanel?.(yt(t||this.onlineRoomController?.state))}handleOnlinePlayerReconnected(e,t={}){this.updatePhysicsHud(e?.message||"Player reconnected.",{onlineConnectionStatus:"Connected",bannerTone:"success"}),this.ui?.updateOnlinePanel?.(yt(t||this.onlineRoomController?.state)),this.prepareOnlineTurn({silent:!0})}handleOnlineTurnTimer(e,t={}){if(!(this.match?.matchMode==="onlinePrivate"||this.match?.matchMode==="onlinePublic"))return;const i=this.getOnlineMatchState();i&&!this.onlineShotActive&&(this.match=this.onlineStateSync?.toHud(i,t)||this.match,this.ui?.updateMatch(this.match)),this.ui?.updateOnlinePanel?.(yt(t||this.onlineRoomController?.state))}handleOnlineTurnTimeout(e,t={}){const i=e?.matchState||t?.matchState||null;i&&this.applyOnlineMatchSnapshot(i,t,{reconcile:!1}),this.updatePhysicsHud("Turn timed out.",{onlineTurnStatus:"Turn switched",bannerTone:"warning"})}handleOnlineRematchState(e,t={}){this.sceneRenderer?.setInputEnabled(!1),this.ui?.updateOnlinePanel?.(yt(t||this.onlineRoomController?.state)),this.updatePhysicsHud(t?.message||e?.message||"Rematch status updated.",{onlineTurnStatus:"Rematch",bannerTone:e?.rematch?.status==="declined"?"warning":"success"})}handleOnlineRematchStarted(e,t={}){this.handleOnlineMatchStarted(e.matchState,t),this.updatePhysicsHud("Rematch started.",{onlineConnectionStatus:"Connected",onlineTurnStatus:"Rematch started",bannerTone:"success"})}handleOnlineError(e,t={}){const i=e?.message||"Online room error.";this.updatePhysicsHud(i,{onlineConnectionStatus:t?.connectionStatus||"Online error",onlineTurnStatus:"Error",bannerTone:"danger"}),this.ui?.updateOnlinePanel?.(yt(t||this.onlineRoomController?.state))}handleOnlineShotIntent(e={}){const t=this.getOnlineMatchState(),i=this.onlineRoomController?.state||{},s=this.sceneRenderer?.getBoardSnapshot?.()?.motion||{};if(!this.onlineStateSync?.canLocalPlayerShoot(t,i,s)){this.updatePhysicsHud("Waiting for your online turn.",{onlineTurnStatus:"Opponent turn",shotPower:"Locked",shotPowerRatio:0,bannerTone:"warning"}),this.prepareOnlineTurn({silent:!0});return}if(!this.onlineRoomController?.submitShot({clientShotId:this.createClientShotId(),strikerPosition:e.strikerPosition,direction:e.direction,power:e.power,powerRatio:e.powerRatio})){this.updatePhysicsHud("Could not submit online shot.",{onlineTurnStatus:"Submit failed",bannerTone:"danger"}),this.prepareOnlineTurn({silent:!0});return}this.onlineShotActive=!0,this.onlineAnimationSettled=!1,this.sceneRenderer?.setInputEnabled(!1),this.updatePhysicsHud("Shot sent to server...",{onlineConnectionStatus:i.connectionStatus||"Connected",onlineTurnStatus:"Sending shot...",shotPower:"Queued",shotPowerRatio:Math.max(.15,Number(e.powerRatio)||.4)})}handleOnlineLocalPhysicsSettled(e={}){if(this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload){this.applyOnlineSettledPayload(this.pendingOnlineSettledPayload,this.onlineRoomController?.state||{});return}this.updatePhysicsHud(`Online animation settled. Pocketed: ${e.pocketedCount||0}. Waiting for server...`,{onlineTurnStatus:"Waiting for server",shotPower:"Syncing",shotPowerRatio:.15})}applyOnlineSettledPayload(e={},t=this.onlineRoomController?.state||{}){const i=e.matchState||e;i&&(this.onlineShotActive=!1,this.onlineAnimationSettled=!0,this.pendingOnlineSettledPayload=null,this.sceneRenderer?.clearFeedback?.(),this.applyOnlineMatchSnapshot(i,t,{reconcile:!0}),i.status!=="finished"&&this.updatePhysicsHud(this.match?.status||"Board synced.",{onlineTurnStatus:"Synced",shotPower:"Settled",shotPowerRatio:0}))}applyOnlineMatchSnapshot(e,t=this.onlineRoomController?.state||{},{reconcile:i=!0,updatePanel:s=!0}={}){if(!e)return;const a=this.state===xe.result&&(this.match?.matchMode==="onlinePrivate"||this.match?.matchMode==="onlinePublic");if(this.match=i?this.onlineStateSync?.applyMatchState(e,t):this.onlineStateSync?.toHud(e,t),this.match={...Ft,...this.match},this.ui.updateMatch(this.match),s&&(this.ui.updateOnlinePanel?.(yt(t)),this.ui.updatePublicMatchmakingPanel?.(Jt(this.onlinePublicQueueController?.state))),e.status==="finished"){this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!1),a||this.audioManager?.play("win"),this.setState(xe.result);return}this.setState(xe.playing),this.prepareOnlineTurn({silent:!0})}getOnlineMatchState(){return this.onlineRoomController?.state?.matchState||this.onlineRoomController?.state?.roomState?.matchState||null}isOnlineMatchActive(){const e=this.getOnlineMatchState();return this.match?.matchMode==="onlinePrivate"||this.match?.matchMode==="onlinePublic"||e?.status==="playing"||e?.status==="finished"}shouldDeferShotRelease(){return this.isOnlineMatchActive()}prepareOnlineTurn({silent:e=!0}={}){const t=this.getOnlineMatchState();if(!t||this.state!==xe.playing){this.sceneRenderer?.setInputEnabled(!1);return}const i=this.sceneRenderer?.getBoardSnapshot?.()?.motion||{},s=this.onlineStateSync?.canLocalPlayerShoot(t,this.onlineRoomController?.state||{},i),a=this.onlineStateSync?.getActiveBaseline(t)||"bottom",r=this.onlineStateSync?.getLocalPlayerBaseline(t,this.onlineRoomController?.state||{})||a;this.sceneRenderer?.setSceneOrbitEnabled(!1),this.sceneRenderer?.prepareForTurn({baseline:a,cameraBaseline:r,enabled:s,silent:e,rotateCamera:!0})}showOnlineVsIntro(e={},t={}){const i=e.players||[],s=i.find(r=>r.id===t.playerId)||i[0]||null,a=i.find(r=>r.id!==s?.id)||i[1]||null;this.ui?.showVsIntro?.({leftName:s?.name||"You",leftMeta:s?.id===t.playerId?"You":"Host",rightName:a?.name||"Opponent",rightMeta:"Opponent",modeLabel:e.mode==="onlinePublic"?"Online Public":"Online Private",roomCode:e.roomCode||t.roomCode||""})}createClientShotId(){const e=Math.random().toString(36).slice(2,8);return`client-${Date.now().toString(36)}-${e}`}showSidePanelSection(e){this.cancelCosmeticPreviewIfLeaving(e),this.ui.setSidePanelSection(e),this.hudCollapsed=!1,this.ui.setHudCollapsed(!1),this.state!==xe.result&&(this.setState(xe.playing),!this.matchStateManager||e==="setup"?(this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!0)):e==="customize"?(this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!1)):this.sceneRenderer?.setSceneOrbitEnabled(!1))}openOverlay(e){[xe.rules,xe.settings,xe.about].includes(e)&&([xe.rules,xe.settings,xe.about].includes(this.state)||(this.returnState=this.state===xe.loading?xe.mainMenu:this.state),this.setState(e))}returnFromOverlay(){this.setState(this.returnState||xe.playing)}showDebugResult(){this.debugPhysics&&(this.returnState=xe.playing,this.setState(xe.result))}toggleHudCollapsed(){this.hudCollapsed=!this.hudCollapsed,this.ui.setHudCollapsed(this.hudCollapsed)}testPhysicsShot(){if(!this.debugPhysics||this.state!==xe.playing)return;this.sceneRenderer?.applyDevTestShot()?(this.audioManager?.play("shotRelease"),this.sceneRenderer?.playShotRelease(.8)):this.updatePhysicsHud("Physics is busy or striker is pocketed.",{shotPower:"Waiting"})}quitMatch(){if(this.botController?.cancel(),this.isOnlineMatchActive()){this.leaveOnlineRoom();return}if(!this.matchStateManager){this.showLocalSetup();return}const e=this.matchStateManager.quitCurrentMatch();this.match={...this.match,...e.hud},this.ui.updateMatch(this.match),this.playRuleFeedback(e),this.audioManager?.play("win"),this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!1),this.setState(xe.result)}resetPhysicsScene(){this.debugPhysics&&(this.botController?.cancel(),this.sceneRenderer?.resetPhysics(),this.matchStateManager?(this.matchStateManager.resetMatch({playerOneName:this.localSetup.playerOneName,playerTwoName:this.localSetup.playerTwoName,matchMode:this.localSetup.matchMode,botDifficulty:this.localSetup.botDifficulty,classicRuleVariant:this.localSetup.classicRuleVariant,ruleMode:this.localSetup.ruleMode,coinSide:this.localSetup.coinSide,boardStyle:this.localSetup.boardStyle,matchType:this.localSetup.matchType}),this.prepareActiveTurn({silent:!0}),this.match={...this.match,...this.matchStateManager.toHudMatch([`Match reset. ${this.localSetup.playerOneName||"Player 1"} starts.`])}):this.match={...this.match,queenStatus:Ft.queenStatus,shotPower:Ft.shotPower,shotPowerRatio:Ft.shotPowerRatio,status:"Physics reset. Ready for striker placement."},this.ui.updateMatch(this.match),this.sceneRenderer?.playResetEffect(),this.audioManager?.play("reset"))}handleGlobalKeydown(e){if(e.repeat||this.isEditableTarget(e.target))return;const t=e.key.toLowerCase();if(t==="escape"){e.preventDefault(),this.handleEscapeShortcut();return}if(t==="m"){e.preventDefault(),this.updateSetting("sound",!this.settings.sound);return}if(t==="h"){e.preventDefault(),this.showRules();return}this.debugPhysics&&t==="t"&&(e.preventDefault(),this.testPhysicsShot())}isEditableTarget(e){return!!e?.closest?.('input, textarea, select, [contenteditable="true"]')}handleEscapeShortcut(){if(this.ui?.hasOpenConfirmation?.()){this.ui.closeConfirmation();return}if(this.state===xe.paused){this.resumeMatch();return}if([xe.rules,xe.settings,xe.about].includes(this.state)){this.returnFromOverlay();return}if(this.state===xe.playing){if(this.ui?.sidePanelSection==="customize"){this.closeCustomizePanel();return}if(!this.hudCollapsed){this.hudCollapsed=!0,this.ui.setHudCollapsed(!0);return}this.matchStateManager&&this.showPause()}}handlePhysicsPocketed(e){if(e.type==="striker"?this.audioManager?.play("foul"):e.type==="queen"?this.audioManager?.play("queenPocket"):this.audioManager?.play("pocketCoin"),this.challengeManager?.active){this.challengeManager.handlePiecePocketed(e),this.updatePhysicsHud(`Challenge pocketed: ${e.color} ${e.type}`,{shotPower:"Moving",shotPowerRatio:1});return}if(this.tutorialController?.active){this.tutorialController.handlePiecePocketed(e),this.updatePhysicsHud(`Tutorial pocketed: ${e.color} ${e.type}`,{shotPower:"Moving",shotPowerRatio:1}),this.ui.updateTutorial?.(this.tutorialController.getHud()),this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.());return}if(this.practiceController?.active){this.practiceController.handlePiecePocketed(e),this.updatePhysicsHud(`Practice pocketed: ${e.color} ${e.type}`,{shotPower:"Moving",shotPowerRatio:1});return}if(this.isOnlineMatchActive()){this.updatePhysicsHud(`Online pocketed: ${e.color} ${e.type}`,{shotPower:"Moving",shotPowerRatio:1,onlineTurnStatus:"Shot in motion"});return}if(this.matchStateManager){this.updatePhysicsHud(`Pocketed: ${e.color} ${e.type}`,{shotPower:"Moving",shotPowerRatio:1});return}const t=e.type==="queen"?"Pocketed":this.match.queenStatus;this.updatePhysicsHud(`Pocketed: ${e.color} ${e.type}`,{queenStatus:t,shotPower:"Moving",shotPowerRatio:1})}handlePhysicsSettled(e){if(this.challengeManager?.active){const t=this.challengeManager.handleShotSettled(e);this.match={...this.match,...t},this.ui.updateMatch(this.match),this.ui.updateChallengePanel?.(this.challengeManager.getPanelModel());return}if(this.tutorialController?.active){const t=this.tutorialController.handleShotSettled(e);this.match={...this.match,...t},this.ui.updateMatch(this.match),this.ui.updateTutorial?.(t),this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.()),this.tutorialController.active&&t?.tutorialStepId!=="finish"&&this.sceneRenderer?.prepareForTurn({baseline:"bottom",enabled:!0,silent:!0,rotateCamera:!1});return}if(this.practiceController?.active){const t=this.practiceController.handleShotSettled(e);this.match={...this.match,...t},this.ui.updateMatch(this.match),this.practiceController.active&&this.sceneRenderer?.prepareForTurn({baseline:"bottom",enabled:!0,silent:!0,rotateCamera:!1});return}if(this.isOnlineMatchActive()){this.handleOnlineLocalPhysicsSettled(e);return}if(this.matchStateManager){const t=this.matchStateManager.applyShotSummary(e);if(t.piecesToReturn.forEach(i=>{this.sceneRenderer?.returnPieceToBoard(i.id)}),this.playRuleFeedback(t),this.match={...this.match,...t.hud},this.ui.updateMatch(this.match),t.state.status==="finished"){this.botController?.cancel(),this.audioManager?.play("win"),this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.setSceneOrbitEnabled(!1),this.setState(xe.result);return}this.prepareActiveTurn({baseline:t.activeBaseline,silent:!0});return}this.updatePhysicsHud(`Shot settled. Pocketed: ${e.pocketedCount}`,{shotPower:"Settled",shotPowerRatio:0})}handleInputPower({ratio:e,label:t}){if(this.tutorialController?.active){this.tutorialController.handlePowerChange({ratio:e,label:t});const i=this.tutorialController.getHud();this.match={...this.match,...i},this.ui.updateTutorial?.(i),this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.())}this.match={...this.match,shotPower:t,shotPowerRatio:e},this.ui?.updateMatch(this.match)}handleInputPlacementChanged(e){this.tutorialController?.active&&(this.tutorialController.handlePlacementChanged(e),this.match={...this.match,...this.tutorialController.getHud()},this.ui.updateMatch(this.match),this.ui.updateTutorial?.(this.tutorialController.getHud()),this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.()))}handleInputAimCreated(){this.tutorialController?.active&&(this.tutorialController.handleAimCreated(),this.match={...this.match,...this.tutorialController.getHud()},this.ui.updateMatch(this.match),this.ui.updateTutorial?.(this.tutorialController.getHud()),this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.()))}handleInputAimUpdated(e){if(this.tutorialController?.active){this.tutorialController.handlePowerChange(e);const t=this.tutorialController.getHud();this.match={...this.match,...t},this.ui.updateMatch(this.match),this.ui.updateTutorial?.(t),this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.())}}handleShotReleased(e={}){if(e?.deferred&&this.isOnlineMatchActive()){this.handleOnlineShotIntent(e);return}const t=Number(e?.powerRatio??this.match.shotPowerRatio)||.5;this.challengeManager?.active&&this.challengeManager.handleShotReleased(),this.practiceController?.active&&this.practiceController.handleShotReleased(),this.tutorialController?.active&&(this.tutorialController.handleShotReleased(),this.match={...this.match,...this.tutorialController.getHud()},this.ui.updateTutorial?.(this.tutorialController.getHud()),this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.())),this.updatePhysicsHud("Shot in motion.",{shotPower:"Moving",shotPowerRatio:1}),this.audioManager?.play("shotRelease",{intensity:Math.max(.35,t)}),this.sceneRenderer?.playShotRelease(t)}handleBotShotFired(e,t){const i=Number(e?.powerRatio)||.5;this.updatePhysicsHud(`${t?.name||"Bot"} shot in motion...`,{shotPower:"Moving",shotPowerRatio:1,botStatus:"shooting"}),this.audioManager?.play("shotRelease",{intensity:Math.max(.35,i)}),this.sceneRenderer?.playShotRelease(i)}handlePhysicsCollision(e){this.audioManager?.playCollision(e.intensity)}playMatchIntro(){window.clearTimeout(this.introTimer);const e=this.matchStateManager?.state.players.map(i=>({...i,color:this.matchStateManager?.state.ruleMode==="freeCapture"?"Any Coin":i.color?i.color==="white"?"White":"Black":"Open Colors"}))||[];this.sceneRenderer?.setInputEnabled(!1),this.sceneRenderer?.playMatchIntro(e,{matchMode:this.matchStateManager?.state.matchMode,ruleMode:this.matchStateManager?.state.ruleMode,ruleModeLabel:this.match.ruleModeLabel,classicRuleVariantLabel:this.match.classicRuleVariantLabel,botDifficultyLabel:this.match.botDifficultyLabel}),this.audioManager?.play("matchStart");const t=this.settings.reducedEffects?450:1400;this.introTimer=window.setTimeout(()=>{this.state!==xe.playing||!this.matchStateManager||(this.prepareActiveTurn({silent:!0}),this.sceneRenderer?.setStateFocus(xe.playing),this.sceneRenderer?.playRuleFeedback({ruleResult:{shouldSwitchTurn:!0},activePlayer:this.matchStateManager.getCurrentPlayer()}),this.audioManager?.play("turnChange"))},t)}playRuleFeedback(e){if(this.sceneRenderer?.playRuleFeedback({ruleResult:e.ruleResult,currentPlayer:e.resolvedPlayer,activePlayer:e.activePlayer,winner:e.winner}),!!e.ruleResult){if(e.ruleResult.isFoul){this.audioManager?.play("foul");return}e.ruleResult.queenCovered?this.audioManager?.play("queenCovered"):e.ruleResult.queenReturned?this.audioManager?.play("queenReturned"):e.ruleResult.queenPending?this.audioManager?.play("queenPocket"):e.ruleResult.shouldSwitchTurn?this.audioManager?.play("turnChange"):this.audioManager?.play("turnChange",{intensity:.72})}}handleChallengeChange(e,t){this.ui?.updateChallengePanel?.(e),t?.challengeActive&&(this.match={...this.match,...t},this.ui?.updateMatch(this.match))}handleChallengeResult(e,t){this.audioManager?.play(t?"queenCovered":"foul",{intensity:t?.8:.65}),this.sceneRenderer?.vfxManager?.banner?.show?.({eyebrow:"Challenge",title:t?"Challenge Complete":"Challenge Failed",detail:t?`${e.stars} star${e.stars===1?"":"s"} earned`:e.message,tone:t?"success":"danger",reduced:this.settings.reducedEffects})}handlePracticeChange(e){e?.practiceActive&&(this.match={...this.match,...e},this.ui?.updateMatch(this.match),this.ui?.updateCoachHint?.(this.coachHintManager?.getViewModel?.()))}handleTutorialChange(e){e?.tutorialActive&&(this.match={...this.match,...e},this.ui?.updateMatch(this.match),this.ui?.updateTutorial?.(e),this.ui?.updateCoachHint?.(this.coachHintManager?.getViewModel?.()))}dismissCoachHint(){this.ui?.updateCoachHint?.(this.coachHintManager?.dismiss?.())}playUiClick(){this.audioManager?.play("uiClick",{throttle:.025})}updatePhysicsHud(e,t={}){this.match={...this.match,...t,status:e},this.ui?.updateMatch(this.match)}handleResultPrimary(){if(this.match?.matchMode==="onlinePrivate"||this.match?.matchMode==="onlinePublic"){this.requestOnlineRematch(),this.ui.setSidePanelSection(this.match.matchMode==="onlinePublic"?"onlinePublic":"online");return}this.startLocalShellMatch({preserveSetup:!0})}backToMenu(){this.showLocalSetup()}selectMatchMode(e){this.updateLocalSetup("matchMode",e==="vsBot"?"vsBot":"local2p"),this.showLocalSetup()}updateLocalSetup(e,t){if(!Object.prototype.hasOwnProperty.call(this.localSetup,e))return;const i={...this.localSetup,[e]:t};if(e==="matchMode"&&t==="vsBot"&&(!i.playerTwoName||i.playerTwoName===qe.playerTwoName)&&(i.playerTwoName=ra(i.botDifficulty)),e==="botDifficulty"&&i.matchMode==="vsBot"&&(!i.playerTwoName||["Player 2","Easy Bot","Royal Bot","Master Bot"].includes(i.playerTwoName))&&(i.playerTwoName=ra(t)),this.localSetup=i,e==="boardStyle"){this.sceneRenderer?.setBoardStyle(t),this.cosmeticManager?.applyBoardStyle?.(t)&&this.ui?.sidePanelSection==="customize"&&this.ui.updateCosmeticsPanel?.(this.cosmeticPreviewController?.cancelPreview?.());const a={ivory:"Ivory Royale",wood:"Tournament Wood",midnight:"Midnight Gold"};this.updatePhysicsHud(`${a[t]||"Selected"} board applied.`,{bannerTone:"success"})}this.ui.updateLocalSetup(this.localSetup)}prepareActiveTurn({baseline:e=null,silent:t=!0}={}){if(!this.matchStateManager||this.state!==xe.playing){this.sceneRenderer?.setInputEnabled(!1);return}const i=e||this.matchStateManager.getActiveBaseline(),s=this.isCurrentTurnBot(),a=this.shouldRotateCameraForTurn();this.sceneRenderer?.setSceneOrbitEnabled(!1),this.sceneRenderer?.prepareForTurn({baseline:i,enabled:!s,silent:t,rotateCamera:a}),s&&this.botController?.scheduleTurn({reason:"active-turn"})}isCurrentTurnBot(){return!!this.matchStateManager?.getCurrentPlayer?.()?.isBot}shouldRotateCameraForTurn(){return this.matchStateManager?.state?.matchMode==="local2p"}updateSetting(e,t){Object.prototype.hasOwnProperty.call(this.settings,e)&&(this.settings={...this.settings,[e]:t},e==="themeId"?this.applyTheme(t):this.applySettings())}applyTheme(e,{persist:t=!0}={}){const i=nl(e);this.settings.themeId=i.id,this.ui?.updateTheme(i),this.sceneRenderer?.applyTheme(i),this.ui?.updateSettings(this.settings),t&&this.saveSettings()}applySettings({persist:e=!0}={}){document.body.classList.toggle("app-reduced-effects",!!this.settings.reducedEffects),document.body.dataset.quality=this.settings.quality||"auto",this.sceneRenderer?.applySettings(this.settings),this.audioManager?.updateSettings(this.settings),this.ui?.updateSettings(this.settings),e&&this.saveSettings()}saveSettings(){Oh(this.settings)}loadSettings(){this.settings=Ac(),this.applyTheme(this.settings.themeId,{persist:!1}),this.applySettings({persist:!1})}resetSettings(){this.settings=$S(),this.applyTheme(this.settings.themeId,{persist:!1}),this.applySettings()}dispose(){window.clearTimeout(this.introTimer),this.stopPublicQueueTimer(),this.challengeManager?.exitChallenge(),this.practiceController?.exit(),this.tutorialController?.exit(),this.cosmeticPreviewController?.cancelPreview?.(),this.onlinePublicQueueController?.dispose?.(),this.onlineRoomController?.dispose?.(),this.botController?.dispose(),window.removeEventListener("resize",this.handleResize),window.visualViewport?.removeEventListener("resize",this.handleResize),window.removeEventListener("keydown",this.handleKeydown),this.sceneRenderer?.dispose(),this.responsive?.dispose(),this.audioManager?.dispose(),this.ui?.dispose()}}const Nh=document.querySelector("#app");if(!Nh)throw new Error("3D Carrom Royale requires an #app mount node.");const Uh=new jS({root:Nh});Uh.init();window.__carrom3dRoyale=Uh;
