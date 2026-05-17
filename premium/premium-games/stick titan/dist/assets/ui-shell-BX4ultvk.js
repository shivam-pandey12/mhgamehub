var e=`stick-titan-profile-v1`,t=[50,75,100,125,150,200,300],n=1,r=5,i=null,a=null,o=`session`,s=[{id:`standard`,name:`Standard`,rewardMultiplier:1,unlockLevel:1,description:`Baseline boss duel with the full progression loop active.`,bossHealthMultiplier:1,bossDamageMultiplier:1,bossSpeedMultiplier:1,hazardDamageMultiplier:1,eventCadenceMultiplier:1},{id:`ruthless`,name:`Ruthless`,rewardMultiplier:1.15,unlockLevel:5,description:`The boss hits harder and hazards arrive a little faster.`,bossHealthMultiplier:1.1,bossDamageMultiplier:1.08,bossSpeedMultiplier:1.03,hazardDamageMultiplier:1.05,eventCadenceMultiplier:1.06},{id:`titan`,name:`Titan`,rewardMultiplier:1.3,unlockLevel:15,description:`Boss pressure escalates and arena danger ramps up.`,bossHealthMultiplier:1.22,bossDamageMultiplier:1.16,bossSpeedMultiplier:1.07,hazardDamageMultiplier:1.12,eventCadenceMultiplier:1.12},{id:`cataclysm`,name:`Cataclysm`,rewardMultiplier:1.5,unlockLevel:25,description:`High-damage, high-chaos boss pressure with less recovery.`,bossHealthMultiplier:1.38,bossDamageMultiplier:1.28,bossSpeedMultiplier:1.12,hazardDamageMultiplier:1.22,eventCadenceMultiplier:1.18},{id:`legend`,name:`Legend`,rewardMultiplier:1.75,unlockLevel:40,description:`Full-speed, high-risk endgame challenge tier.`,bossHealthMultiplier:1.55,bossDamageMultiplier:1.4,bossSpeedMultiplier:1.18,hazardDamageMultiplier:1.32,eventCadenceMultiplier:1.26}],c=[{id:`beginner`,name:`Beginner`,minLevel:1,maxLevel:4},{id:`fighter`,name:`Fighter`,minLevel:5,maxLevel:9},{id:`brawler`,name:`Brawler`,minLevel:10,maxLevel:14},{id:`slayer`,name:`Slayer`,minLevel:15,maxLevel:19},{id:`veteran`,name:`Veteran`,minLevel:20,maxLevel:24},{id:`elite`,name:`Elite`,minLevel:25,maxLevel:29},{id:`master`,name:`Master`,minLevel:30,maxLevel:39},{id:`grandmaster`,name:`Grandmaster`,minLevel:40,maxLevel:49},{id:`legend`,name:`Legend`,minLevel:50,maxLevel:null}],l=[{id:`ferocity`,category:`combat`,name:`Ferocity`,description:`+4% direct damage per rank.`,maxRank:5,costBase:120,costStep:35},{id:`tempo`,category:`combat`,name:`Tempo`,description:`+2% attack speed per rank.`,maxRank:5,costBase:110,costStep:30},{id:`breaker`,category:`combat`,name:`Breaker`,description:`+5% hit stun and knockback per rank.`,maxRank:5,costBase:125,costStep:35},{id:`vitality`,category:`survival`,name:`Vitality`,description:`+6 max health per rank.`,maxRank:5,costBase:100,costStep:30},{id:`guard`,category:`survival`,name:`Guard`,description:`-3% incoming damage per rank.`,maxRank:5,costBase:115,costStep:32},{id:`hazard_ward`,category:`survival`,name:`Guard Matrix`,description:`-6% block chip and guard pressure per rank.`,maxRank:5,costBase:95,costStep:28},{id:`rage_flow`,category:`special`,name:`Rage Flow`,description:`+6% Rage gain per rank.`,maxRank:5,costBase:120,costStep:35},{id:`shock_core`,category:`special`,name:`Shock Core`,description:`+6% shockwave radius and damage per rank.`,maxRank:5,costBase:130,costStep:40},{id:`finisher_sense`,category:`special`,name:`Finisher Sense`,description:`+0.15s finisher window per rank.`,maxRank:5,costBase:105,costStep:30}],u=[{id:`quick_fight`,name:`Quick Fight`,description:`Fight a best-of-three duel against a rotating fighter archetype.`,unlockLevel:1,implemented:!0,accentColor:5756927},{id:`boss_battle`,name:`Boss Battle`,description:`Enter a best-of-three boss set against a phase-based arena boss variant.`,unlockLevel:1,implemented:!0,accentColor:16749400},{id:`survival`,name:`Survival Mode`,description:`Clear a five-fight ladder with limited recovery between encounters.`,unlockLevel:10,implemented:!0,accentColor:16736118}],d=[{id:`neon_hangar`,name:`Neon Hangar`,description:`Industrial lane lighting with sharp cyan and ember contrast.`,accentColor:5756927},{id:`sunset_rooftop`,name:`Sunset Rooftop`,description:`Warm skyline staging with reflective rails and dusk haze.`,accentColor:16754270},{id:`temple_court`,name:`Temple Court`,description:`Stone arena framing with gold highlights and deep shadows.`,accentColor:15123050}],f=[{id:`vanguard`,name:`Vanguard`,archetype:`fighter`,unlockLevel:1,description:`Sword and power rushdown with fast guard pressure.`},{id:`striker`,name:`Striker`,archetype:`fighter`,unlockLevel:1,description:`Balanced sword duelist with clean confirms and spacing.`},{id:`ranger`,name:`Ranger`,archetype:`fighter`,unlockLevel:10,description:`Sword and gun spacing specialist with late gun punishes.`},{id:`titan_warden`,name:`Titan Warden`,archetype:`boss`,unlockLevel:1,description:`Power and sword boss built around brutal guard breaks.`},{id:`iron_marshal`,name:`Iron Marshal`,archetype:`boss`,unlockLevel:20,description:`Weapon-rotating boss with disciplined gun pressure.`}],ee=[{id:`titan_cache`,name:`Titan Cache`,description:`Future premium bundle placeholder with a weapon-theme preview and gem pricing.`,gemCost:180,badge:`Coming Soon`},{id:`arena_pass`,name:`Arena Pass`,description:`Reserved for future seasonal premium cosmetics and menu flair.`,gemCost:260,badge:`Coming Soon`},{id:`legend_core`,name:`Legend Core`,description:`High-tier premium showcase card for future prestige offerings.`,gemCost:420,badge:`Coming Soon`}],p=[{id:`classic_azure`,name:`Classic Azure`,primaryColor:4966655,auraColor:10410495,accentColor:16777215,unlockLabel:`Starter skin`},{id:`bronze_volt`,name:`Bronze Volt`,primaryColor:13208138,auraColor:16038775,accentColor:16770493,unlockLabel:`Buy with coins`,coinCost:220},{id:`verdant_wire`,name:`Verdant Wire`,primaryColor:5028206,auraColor:8513184,accentColor:14090207,unlockLabel:`Buy with coins`,coinCost:260},{id:`ember_pulse`,name:`Ember Pulse`,primaryColor:16740170,auraColor:16754796,accentColor:16769224,unlockLabel:`Buy with coins`,coinCost:320},{id:`midnight_drift`,name:`Midnight Drift`,primaryColor:4414093,auraColor:8103423,accentColor:13820927,unlockLabel:`Buy with coins`,coinCost:420},{id:`neon_revenant`,name:`Neon Revenant`,primaryColor:6120703,auraColor:13027839,accentColor:16250879,unlockLabel:`Buy with gems`,gemCost:90,featured:!0},{id:`prism_edge`,name:`Prism Edge`,primaryColor:16735174,auraColor:16761835,accentColor:16773371,unlockLabel:`Buy with gems`,gemCost:130,featured:!0},{id:`void_pulse`,name:`Void Pulse`,primaryColor:2565179,auraColor:11762431,accentColor:15721215,unlockLabel:`Buy with gems`,gemCost:180,featured:!0},{id:`fighter_cobalt`,name:`Fighter Cobalt`,primaryColor:5218559,auraColor:10212607,accentColor:15070207,unlockLabel:`Reach Fighter rank`},{id:`veteran_gold`,name:`Veteran Gold`,primaryColor:16040520,auraColor:16770191,accentColor:16774606,unlockLabel:`Reach Veteran rank`},{id:`master_crimson`,name:`Master Crimson`,primaryColor:13912664,auraColor:16752286,accentColor:16769505,unlockLabel:`Reach Master rank`},{id:`legend_aurora`,name:`Legend Aurora`,primaryColor:7300607,auraColor:12370431,accentColor:15790591,unlockLabel:`Reach Legend rank`},{id:`ivory_ghost`,name:`Ivory Ghost`,primaryColor:15331575,auraColor:16777215,accentColor:14543349,unlockLabel:`Perfect Form achievement`},{id:`blaze_wire`,name:`Blaze Wire`,primaryColor:16743478,auraColor:16759407,accentColor:16772560,unlockLabel:`Speed Hunter achievement`},{id:`static_step`,name:`Static Step`,primaryColor:7657983,auraColor:12055295,accentColor:15203327,unlockLabel:`Hazard Dancer achievement`},{id:`titanfall`,name:`Titanfall`,primaryColor:16735067,auraColor:16755082,accentColor:16769245,unlockLabel:`Clear Cataclysm`},{id:`eclipse`,name:`Eclipse`,primaryColor:2499116,auraColor:10188543,accentColor:14734079,unlockLabel:`Clear Legend`},{id:`solar_static`,name:`Solar Static`,primaryColor:16765544,auraColor:16773554,accentColor:16775131,unlockLabel:`Complete 3 weekly missions`},{id:`sword_virtuoso`,name:`Sword Virtuoso`,primaryColor:9035263,auraColor:14679039,accentColor:16777215,unlockLabel:`Reach sword mastery 10`},{id:`gun_lattice`,name:`Gun Lattice`,primaryColor:16756338,auraColor:16768441,accentColor:16773342,unlockLabel:`Reach gun mastery 10`},{id:`power_core`,name:`Power Core`,primaryColor:16765006,auraColor:16774063,accentColor:16775642,unlockLabel:`Reach power mastery 10`}],m=[{id:`rookie`,name:`Rookie`,unlockLabel:`Starter title`},{id:`untouched`,name:`Untouched`,unlockLabel:`Perfect Form achievement`},{id:`rhythm_breaker`,name:`Rhythm Breaker`,unlockLabel:`Combo Discipline achievement`},{id:`storm_ender`,name:`Storm Ender`,unlockLabel:`Shock Surgeon achievement`},{id:`legend_title`,name:`Legend`,unlockLabel:`Legend Slayer achievement`},{id:`blade_savant`,name:`Blade Savant`,unlockLabel:`Sword mastery 10`},{id:`deadeye_arc`,name:`Deadeye Arc`,unlockLabel:`Gun mastery 10`},{id:`overdrive_anchor`,name:`Overdrive Anchor`,unlockLabel:`Power mastery 10`},{id:`weekbreaker`,name:`Weekbreaker`,unlockLabel:`Complete 2 weekly missions`}],h=[{id:`perfect_form`,name:`Perfect Form`,description:`Win without taking damage.`,rewardCoins:300,rewardSkinId:`ivory_ghost`,rewardTitleId:`untouched`},{id:`speed_hunter`,name:`Speed Hunter`,description:`Win under 180 seconds.`,rewardCoins:250,rewardSkinId:`blaze_wire`},{id:`combo_discipline`,name:`Combo Discipline`,description:`Complete 3 full combo chains in one match.`,rewardCoins:200,rewardTitleId:`rhythm_breaker`},{id:`arsenal_sweep`,name:`Arsenal Sweep`,description:`Deal damage with sword, gun, and power in one win.`,rewardCoins:200},{id:`shock_surgeon`,name:`Shock Surgeon`,description:`Land the decisive phase-3 Rage shockwave.`,rewardCoins:300,rewardTitleId:`storm_ender`},{id:`demolitionist`,name:`Demolitionist`,description:`Break guard 3 times in one match.`,rewardCoins:150},{id:`hazard_dancer`,name:`Hazard Dancer`,description:`Win a tier 2+ match with 3 clean dashes.`,rewardCoins:250,rewardSkinId:`static_step`},{id:`ruthless_victor`,name:`Ruthless Victor`,description:`Clear Cataclysm.`,rewardCoins:400,rewardSkinId:`titanfall`},{id:`legend_slayer`,name:`Legend Slayer`,description:`Clear Legend.`,rewardCoins:800,rewardSkinId:`eclipse`,rewardTitleId:`legend_title`}],g=[{id:`daily_win`,group:`daily`,name:`Daily Duel`,description:`Win 1 match.`,metric:`wins`,target:1,rewardCoins:70,rewardXp:45},{id:`daily_gun_damage`,group:`daily`,name:`Gun Pressure`,description:`Deal 140 gun damage.`,metric:`gun_damage`,target:140,rewardCoins:60,rewardXp:40},{id:`daily_sword_damage`,group:`daily`,name:`Sword Work`,description:`Deal 180 sword damage.`,metric:`sword_damage`,target:180,rewardCoins:55,rewardXp:35},{id:`daily_power_damage`,group:`daily`,name:`Power Surge`,description:`Deal 150 power damage.`,metric:`power_damage`,target:150,rewardCoins:55,rewardXp:35},{id:`daily_combo`,group:`daily`,name:`Combo Rhythm`,description:`Complete 2 full combo chains.`,metric:`full_combos`,target:2,rewardCoins:50,rewardXp:35},{id:`daily_rage`,group:`daily`,name:`Ignition`,description:`Activate Rage once.`,metric:`rage_uses`,target:1,rewardCoins:45,rewardXp:30},{id:`daily_finisher`,group:`daily`,name:`Close It Out`,description:`Use 1 finisher.`,metric:`finishers`,target:1,rewardCoins:80,rewardXp:60},{id:`daily_destroy`,group:`daily`,name:`Guard Breaker`,description:`Break guard 2 times.`,metric:`guard_breaks`,target:2,rewardCoins:50,rewardXp:35},{id:`daily_hazardless`,group:`daily`,name:`Clean Footwork`,description:`Dash 3 times in one session.`,metric:`dashes_used`,target:3,rewardCoins:80,rewardXp:55},{id:`daily_tier_clear`,group:`daily`,name:`Step Up`,description:`Win 1 tier 2+ match.`,metric:`challenge_wins`,target:1,rewardCoins:75,rewardXp:55}],_=[{id:`weekly_wins`,group:`weekly`,name:`Fight Runner`,description:`Win 5 matches.`,metric:`wins`,target:5,rewardCoins:220,rewardXp:150},{id:`weekly_tier_wins`,group:`weekly`,name:`Difficulty Climber`,description:`Win 3 tier 2+ matches.`,metric:`challenge_wins`,target:3,rewardCoins:250,rewardXp:180},{id:`weekly_gun_damage`,group:`weekly`,name:`Suppressive Fire`,description:`Deal 650 gun damage.`,metric:`gun_damage`,target:650,rewardCoins:170,rewardXp:130},{id:`weekly_power_damage`,group:`weekly`,name:`Shock Battery`,description:`Deal 520 power damage.`,metric:`power_damage`,target:520,rewardCoins:170,rewardXp:130},{id:`weekly_combos`,group:`weekly`,name:`Chain Artist`,description:`Complete 8 full combo chains.`,metric:`full_combos`,target:8,rewardCoins:190,rewardXp:140},{id:`weekly_rage`,group:`weekly`,name:`Rage Engine`,description:`Activate Rage 6 times.`,metric:`rage_uses`,target:6,rewardCoins:160,rewardXp:120},{id:`weekly_finishers`,group:`weekly`,name:`Execution Loop`,description:`Use 3 finishers.`,metric:`finishers`,target:3,rewardCoins:200,rewardXp:145},{id:`weekly_destruction`,group:`weekly`,name:`Arena Breaker`,description:`Break guard 10 times.`,metric:`guard_breaks`,target:10,rewardCoins:160,rewardXp:120},{id:`weekly_hazardless`,group:`weekly`,name:`Untouchable Route`,description:`Land 12 juggle hits.`,metric:`juggle_hits`,target:12,rewardCoins:180,rewardXp:135}],v=new Map([...g,..._].map(e=>[e.id,e])),y=new Map(h.map(e=>[e.id,e])),b=new Map(p.map(e=>[e.id,e])),x=new Map(m.map(e=>[e.id,e])),S=new Map(l.map(e=>[e.id,e])),C=new Map(s.map(e=>[e.id,e])),w=new Map(u.map(e=>[e.id,e])),T=new Map(d.map(e=>[e.id,e])),te=new Map(f.map(e=>[e.id,e]));function E(){return{ferocity:0,tempo:0,breaker:0,vitality:0,guard:0,hazard_ward:0,rage_flow:0,shock_core:0,finisher_sense:0}}function ne(){return{sword:{level:1,xp:0,totalXp:0},gun:{level:1,xp:0,totalXp:0},power:{level:1,xp:0,totalXp:0}}}function re(){return{wins:0,losses:0,totalPlaySeconds:0,totalDamageDealt:0,totalDamageTaken:0,totalFinishers:0,totalRageUses:0,totalBarrelsDetonated:0,totalConfirmedHits:0,totalSpecials:0,totalCancels:0,totalAiCountersSeen:0}}function ie(){return{totalMatches:0,totalConfirmedHits:0,totalAttackAttempts:0,totalDrops:0,totalCancels:0,totalAiCountersTriggered:0,recentMatches:[]}}function ae(){return{masterVolume:100,combatVolume:100,uiVolume:100,crowdVolume:70,screenShake:100,difficultyAssist:`standard`}}function D(){return{completed:!1,replayRequested:!1,active:!1,step:0}}function oe(e){return{modeId:`quick_fight`,opponentArchetype:`fighter`,opponentVariantId:`vanguard`,challengeTier:e,presentationMode:`2_5d`,stageVariantId:`neon_hangar`,outcome:null,durationSeconds:0,roundWins:0,roundLosses:0,damageTaken:0,hazardDamageTaken:0,damageByWeapon:{sword:0,gun:0,power:0},weaponsUsed:{sword:!1,gun:!1,power:!1},fullComboChains:0,finisherUsed:!1,barrelsDetonated:0,objectsDestroyed:0,rageActivations:0,shockwaveBossPhase3Kill:!1,guardBreaks:0,successfulBlocks:0,dashesUsed:0,juggleHits:0,launches:0,confirmedHits:0,attackAttempts:0,cancelCount:0,droppedInputs:0,reloadsStarted:0,shotsFired:0,aiCounterTriggers:0,preciseCombos:0,grenadeHits:0,bombHits:0,rageWins:0,tutorialCompleted:!1,comboStarters:{}}}function O(e=new Date){let t=j(e);return{version:r,profileVersion:r,lastUpdated:e.getTime(),coins:0,gems:120,level:1,xp:0,upgradePoints:0,themeMode:`dark`,presentationMode:`2_5d`,menuScreen:`main`,shopSection:`skins`,lastSelectedMode:`quick_fight`,unlockedModes:[`quick_fight`,`boss_battle`],selectedStageId:`neon_hangar`,selectedChallengeTier:`standard`,selectedSkinId:`classic_azure`,selectedTitleId:`rookie`,unlockedOpponentVariants:[`vanguard`,`striker`,`titan_warden`],unlockedSkins:[`classic_azure`],unlockedTitles:[`rookie`],unlockedAchievements:[],unlockedChallengeTiers:[`standard`],upgrades:E(),upgradeCoinsInvested:0,dailyStreak:{lastClaimDate:null,streakCount:0,cycleDay:0},dailyMissionDate:t,weeklyMissionWeek:M(e),dailyMissions:[],weeklyMissions:[],weeklyMilestonesClaimed:[],weaponMastery:ne(),lifetimeStats:re(),analytics:ie(),settings:ae(),tutorialState:D(),showDetailedHowToPlay:!0,debugAnalyticsVisible:!1}}function se(e=new Date){let t=O(e),n=Ie();if(n)try{t=K(JSON.parse(n),e)}catch{t=O(e)}let r=A(t,e);return k(t,{skipCloudSync:!0,preserveTimestamp:!0}),{profile:t,dailyRewardCoins:r}}function ce(e){a=e}function le(e){o=e}function k(t,n={}){n.preserveTimestamp||(t.lastUpdated=Date.now());let r=JSON.stringify(t);if(i=r,typeof window>`u`){!n.skipCloudSync&&a&&Promise.resolve(a(JSON.parse(r)));return}try{if((o===`local`?window.localStorage:window.sessionStorage??window.localStorage).setItem(e,r),o===`session`)try{window.localStorage.removeItem(e)}catch{}else try{window.sessionStorage?.removeItem(e)}catch{}}catch{}!n.skipCloudSync&&a&&Promise.resolve(a(JSON.parse(r)))}function ue(e){let t={app:`stick-titan`,exportVersion:n,exportedAt:new Date().toISOString(),profile:K(JSON.parse(JSON.stringify(e)),new Date)};return JSON.stringify(t,null,2)}function de(e,t=new Date,n={}){let r=JSON.parse(e),i=K((typeof r.app==`string`&&r.app===`stick-titan`?r.profile:r)??{},t);return A(i,t),k(i,n),i}function fe(e=new Date){let t=O(e);return A(t,e),k(t),t}function A(e,t=new Date){return e.version=r,e.profileVersion=r,e.lastUpdated=Y(e.lastUpdated,0,2**53-1,t.getTime()),e.level=Math.max(1,Math.floor(e.level)),e.xp=Math.max(0,Math.floor(e.xp)),e.coins=Math.max(0,Math.floor(e.coins)),e.gems=Math.max(0,Math.floor(e.gems)),e.upgradePoints=Math.max(0,Math.floor(e.upgradePoints)),e.themeMode=e.themeMode===`light`?`light`:`dark`,e.presentationMode=e.presentationMode===`2d`?`2d`:`2_5d`,e.upgrades={...E(),...e.upgrades},e.weaponMastery={...ne(),...e.weaponMastery},e.lifetimeStats={...re(),...e.lifetimeStats},e.analytics={...ie(),...e.analytics,recentMatches:e.analytics?.recentMatches??[]},e.menuScreen=e.menuScreen??`main`,e.shopSection=e.shopSection??`skins`,e.lastSelectedMode=e.lastSelectedMode??`quick_fight`,e.unlockedModes=X(e.unlockedModes,w,[`quick_fight`,`boss_battle`]),e.selectedStageId=T.has(e.selectedStageId)?e.selectedStageId:`neon_hangar`,e.unlockedOpponentVariants=X(e.unlockedOpponentVariants,te,[`vanguard`,`striker`,`titan_warden`]),e.unlockedSkins=X(e.unlockedSkins,b,[`classic_azure`]),e.unlockedTitles=X(e.unlockedTitles,x,[`rookie`]),e.unlockedAchievements=X(e.unlockedAchievements,y),e.unlockedChallengeTiers=X(e.unlockedChallengeTiers,C,[`standard`]),e.settings=q(e.settings),e.tutorialState=J(e.tutorialState),He(e),Ve(e),Be(e),Z(e),We(e,`daily`,t),We(e,`weekly`,t),e.unlockedSkins.includes(e.selectedSkinId)||(e.selectedSkinId=`classic_azure`),e.unlockedTitles.includes(e.selectedTitleId)||(e.selectedTitleId=`rookie`),e.unlockedChallengeTiers.includes(e.selectedChallengeTier)||(e.selectedChallengeTier=`standard`),e.unlockedModes.includes(e.lastSelectedMode)||(e.lastSelectedMode=`quick_fight`),e.showDetailedHowToPlay=e.showDetailedHowToPlay!==!1,e.debugAnalyticsVisible=!!e.debugAnalyticsVisible,Re(e,t)}function j(e){return`${e.getFullYear()}-${`${e.getMonth()+1}`.padStart(2,`0`)}-${`${e.getDate()}`.padStart(2,`0`)}`}function M(e){let t=new Date(e.getFullYear(),e.getMonth(),e.getDate()),n=t.getDay()||7;t.setDate(t.getDate()+4-n);let r=new Date(t.getFullYear(),0,1),i=Math.ceil(((t.getTime()-r.getTime())/864e5+1)/7);return`${t.getFullYear()}-W${`${i}`.padStart(2,`0`)}`}function N(e){return C.get(e)??s[0]}function P(e){return c.find(t=>e>=t.minLevel&&(t.maxLevel===null||e<=t.maxLevel))??c[0]}function F(e){return Math.min(100+25*Math.max(0,e-1),500)}function I(e){return Math.min(60+25*Math.max(0,e-1),260)}function L(e){return e>=30?5:e>=20?4:e>=10?3:e>=5?2:1}function R(e,t){let n=S.get(e);return n?n.costBase+n.costStep*t:0}function z(e){return 1+Math.min(e.dailyStreak.streakCount,7)*.05}function pe(e,t){let n=S.get(t);if(!n)return!1;let r=e.upgrades[t];return r>=n.maxRank||r>=L(e.level)||e.upgradePoints<=0?!1:e.coins>=R(t,r)}function me(e,t){if(!pe(e,t))return!1;let n=e.upgrades[t],r=R(t,n);return e.coins-=r,e.upgradeCoinsInvested+=r,--e.upgradePoints,e.upgrades[t]+=1,k(e),!0}function he(e){let t=Object.values(e.upgrades).reduce((e,t)=>e+t,0);e.coins+=e.upgradeCoinsInvested,e.upgradeCoinsInvested=0,e.upgradePoints+=t,e.upgrades=E(),k(e)}function ge(e,t){let n=b.get(t);if(!n||e.unlockedSkins.includes(t))return!1;if(n.coinCost){if(e.coins<n.coinCost)return!1;e.coins-=n.coinCost}else if(n.gemCost){if(e.gems<n.gemCost)return!1;e.gems-=n.gemCost}else return!1;return e.unlockedSkins.push(t),k(e),!0}function _e(e,t){return e.unlockedSkins.includes(t)?(e.selectedSkinId=t,k(e),!0):!1}function ve(e,t){return e.unlockedTitles.includes(t)?(e.selectedTitleId=t,k(e),!0):!1}function ye(e,t){return e.unlockedChallengeTiers.includes(t)?(e.selectedChallengeTier=t,k(e),!0):!1}function be(e,t){e.menuScreen=t,k(e)}function xe(e,t){e.themeMode=t,k(e)}function Se(e,t){e.presentationMode=t,k(e)}function Ce(e,t){T.has(t)&&(e.selectedStageId=t,k(e))}function we(e,t){e.settings=q({...e.settings,...t}),k(e)}function Te(e){e.tutorialState.replayRequested=!0,e.tutorialState.completed=!1,k(e)}function Ee(e){e.tutorialState.completed=!0,e.tutorialState.replayRequested=!1,e.tutorialState.active=!1,e.tutorialState.step=3,k(e)}function De(e,t){e.showDetailedHowToPlay=t,k(e)}function Oe(e,t){e.debugAnalyticsVisible=t,k(e)}function ke(e,t){e.shopSection=t,e.menuScreen!==`shop`&&(e.menuScreen=`shop`),k(e)}function Ae(e,t){return w.has(t)?(e.lastSelectedMode=t,k(e),!0):!1}function B(e){return w.get(e)??u[0]}function V(e){return T.get(e)??d[0]}function je(e){return te.get(e)??f[0]}function H(e,t){let n=B(t);return e.unlockedModes.includes(t)?n.implemented?`available`:`coming_soon`:`locked`}function U(e){let t=e.weaponMastery.sword.level,n=e.weaponMastery.gun.level,r=e.weaponMastery.power.level;return{maxHealthBonus:e.upgrades.vitality*6,outgoingDamageMultiplier:1+e.upgrades.ferocity*.04,attackSpeedMultiplier:1+e.upgrades.tempo*.02,hitStunMultiplier:1+e.upgrades.breaker*.05,knockbackMultiplier:1+e.upgrades.breaker*.05,incomingDamageMultiplier:Math.max(.7,1-e.upgrades.guard*.03),hazardDamageMultiplier:Math.max(.5,1-e.upgrades.hazard_ward*.06),rageGainMultiplier:1+e.upgrades.rage_flow*.06+r*.05,shockwaveMultiplier:1+e.upgrades.shock_core*.06+r*.04,finisherWindowBonus:e.upgrades.finisher_sense*.15,swordFinisherRangeBonus:t*.05,swordCoinBonus:Math.floor(t/2)*5,gunRecoilMultiplier:Math.max(.62,1-n*.04),gunReloadMultiplier:Math.max(.7,1-n*.03),gunAimMoveMultiplier:1+n*.02,gunStaggerMultiplier:1+n*.03,powerOverdriveBonusSeconds:r*.18,powerBlockingBonusDamage:1+r*.02}}function Me(e){return{timestamp:new Date().toISOString(),modeId:e.modeId,opponentArchetype:e.opponentArchetype,opponentVariantId:e.opponentVariantId,challengeTier:e.challengeTier,presentationMode:e.presentationMode,stageVariantId:e.stageVariantId,outcome:e.outcome??`lose`,durationSeconds:e.durationSeconds,roundWins:e.roundWins,roundLosses:e.roundLosses,hitConfirmRate:e.attackAttempts>0?e.confirmedHits/e.attackAttempts:0,cancelCount:e.cancelCount,droppedInputs:e.droppedInputs,reloadEfficiency:e.reloadsStarted>0?e.shotsFired/e.reloadsStarted:e.shotsFired,aiCountersTriggered:e.aiCounterTriggers,preciseCombos:e.preciseCombos,comboStarters:{...e.comboStarters},weaponUsage:{...e.damageByWeapon}}}function Ne(e,t){let n=e.level,r=e.xp,i=P(e.level),a=new Set(e.unlockedChallengeTiers),o=new Set(e.unlockedSkins),s=new Set(e.unlockedTitles),c=new Set(e.unlockedAchievements),l=N(t.challengeTier),u=Je(e,t,U(e));e.coins+=u.totalCoins,e.lifetimeStats.wins+=+(t.outcome===`win`),e.lifetimeStats.losses+=+(t.outcome===`lose`),e.lifetimeStats.totalPlaySeconds+=t.durationSeconds,e.lifetimeStats.totalDamageDealt+=Object.values(t.damageByWeapon).reduce((e,t)=>e+t,0),e.lifetimeStats.totalDamageTaken+=t.damageTaken,e.lifetimeStats.totalFinishers+=+!!t.finisherUsed,e.lifetimeStats.totalRageUses+=t.rageActivations,e.lifetimeStats.totalBarrelsDetonated+=t.barrelsDetonated,e.lifetimeStats.totalConfirmedHits+=t.confirmedHits,e.lifetimeStats.totalSpecials+=t.comboStarters.special_route??0,e.lifetimeStats.totalCancels+=t.cancelCount,e.lifetimeStats.totalAiCountersSeen+=t.aiCounterTriggers,Ye(e,u.totalXp);let d=Xe(e,t),f=Ze(e,t);for(let t of f)e.coins+=Math.round(t.rewardCoins*z(e)),Ye(e,t.rewardXp);let ee=$e(e,t);for(let t of ee)e.coins+=t.rewardCoins,t.rewardSkinId&&Q(e,t.rewardSkinId),t.rewardTitleId&&$(e,t.rewardTitleId);He(e),Ve(e),Be(e),Z(e),Ue(e);let p=tt(e);for(let t of p.skins)Q(e,t);for(let t of p.titles)$(e,t);let m=e.unlockedChallengeTiers.filter(e=>!a.has(e)).map(N),h=e.unlockedSkins.filter(e=>!o.has(e)).map(W),g=e.unlockedTitles.filter(e=>!s.has(e)).map(Pe),_=e.unlockedAchievements.filter(e=>!c.has(e)).map(Fe),v=Me(t);return e.analytics.totalMatches+=1,e.analytics.totalConfirmedHits+=t.confirmedHits,e.analytics.totalAttackAttempts+=t.attackAttempts,e.analytics.totalDrops+=t.droppedInputs,e.analytics.totalCancels+=t.cancelCount,e.analytics.totalAiCountersTriggered+=t.aiCounterTriggers,e.analytics.recentMatches=[v,...e.analytics.recentMatches].slice(0,20),k(e),{outcome:t.outcome??`lose`,challengeTier:l,rewards:u,missionsCompleted:f,achievementsUnlocked:_,skinsUnlocked:h,titlesUnlocked:g,challengeTiersUnlocked:m,levelBefore:n,levelAfter:e.level,xpBefore:r,xpAfter:e.xp,xpToNext:F(e.level),rankBefore:i,rankAfter:P(e.level),masteryProgress:d,analytics:v}}function W(e){return b.get(e)??p[0]}function Pe(e){return x.get(e)??m[0]}function Fe(e){return y.get(e)??h[0]}function G(e){return v.get(e)??g[0]}function K(e,t){let n=O(t);return{...n,...e,upgrades:{...n.upgrades,...e.upgrades},dailyStreak:{...n.dailyStreak,...e.dailyStreak},weaponMastery:{sword:{...n.weaponMastery.sword,...e.weaponMastery?.sword},gun:{...n.weaponMastery.gun,...e.weaponMastery?.gun},power:{...n.weaponMastery.power,...e.weaponMastery?.power}},lifetimeStats:{...n.lifetimeStats,...e.lifetimeStats},analytics:{...n.analytics,...e.analytics,recentMatches:Array.isArray(e.analytics?.recentMatches)?e.analytics.recentMatches.slice(0,20):[]},settings:q(e.settings),tutorialState:J(e.tutorialState),dailyMissions:Le(e.dailyMissions,`daily`),weeklyMissions:Le(e.weeklyMissions,`weekly`),weeklyMilestonesClaimed:Array.isArray(e.weeklyMilestonesClaimed)?e.weeklyMilestonesClaimed.filter(e=>e===2||e===3):[]}}function Ie(){if(typeof window>`u`)return i;try{let e=window.sessionStorage?.getItem(`stick-titan-profile-v1`)??null;if(e)return i=e,e}catch{}try{let t=window.localStorage.getItem(e);if(t)return i=t,t}catch{}return i}function q(e){let t=ae();return{masterVolume:Y(e?.masterVolume,0,100,t.masterVolume),combatVolume:Y(e?.combatVolume,0,100,t.combatVolume),uiVolume:Y(e?.uiVolume,0,100,t.uiVolume),crowdVolume:Y(e?.crowdVolume,0,100,t.crowdVolume),screenShake:e?.screenShake===0||e?.screenShake===50||e?.screenShake===100?e.screenShake:t.screenShake,difficultyAssist:e?.difficultyAssist===`forgiving`?`forgiving`:`standard`}}function J(e){let t=D();return{completed:!!e?.completed,replayRequested:!!e?.replayRequested,active:!!e?.active,step:e?.step===1||e?.step===2||e?.step===3?e.step:t.step}}function Y(e,t,n,r){return typeof e!=`number`||Number.isNaN(e)?r:Math.min(n,Math.max(t,Math.round(e)))}function Le(e,t){return Array.isArray(e)?e.filter(e=>!!(e&&v.get(e.id)?.group===t)).map(e=>({id:e.id,progress:Math.max(0,Math.floor(e.progress)),completed:!!e.completed})):[]}function X(e,t,n=[]){let r=new Set,i=[];for(let a of e??n)!t.has(a)||r.has(a)||(r.add(a),i.push(a));return i.length===0?[...n]:i}function Re(e,n){let r=j(n);if(e.dailyStreak.lastClaimDate===r)return 0;let i=e.dailyStreak.lastClaimDate,a=i?ze(i,r):null;e.dailyStreak.streakCount=a===1?e.dailyStreak.streakCount+1:1,e.dailyStreak.cycleDay=e.dailyStreak.cycleDay%t.length+1,e.dailyStreak.lastClaimDate=r;let o=t[e.dailyStreak.cycleDay-1];return e.coins+=o,o}function ze(e,t){let n=new Date(`${e}T00:00:00`),r=new Date(`${t}T00:00:00`);return Math.round((r.getTime()-n.getTime())/864e5)}function Be(e){for(let t of s)e.level>=t.unlockLevel&&!e.unlockedChallengeTiers.includes(t.id)&&e.unlockedChallengeTiers.push(t.id)}function Ve(e){for(let t of u)e.level>=t.unlockLevel&&!e.unlockedModes.includes(t.id)&&e.unlockedModes.push(t.id)}function Z(e){for(let t of f)e.level>=t.unlockLevel&&!e.unlockedOpponentVariants.includes(t.id)&&e.unlockedOpponentVariants.push(t.id)}function He(e){e.level>=5&&Q(e,`fighter_cobalt`),e.level>=20&&Q(e,`veteran_gold`),e.level>=30&&Q(e,`master_crimson`),e.level>=50&&Q(e,`legend_aurora`)}function Ue(e){e.weaponMastery.sword.level>=10&&(Q(e,`sword_virtuoso`),$(e,`blade_savant`)),e.weaponMastery.gun.level>=10&&(Q(e,`gun_lattice`),$(e,`deadeye_arc`)),e.weaponMastery.power.level>=10&&(Q(e,`power_core`),$(e,`overdrive_anchor`))}function Q(e,t){e.unlockedSkins.includes(t)||e.unlockedSkins.push(t)}function $(e,t){e.unlockedTitles.includes(t)||e.unlockedTitles.push(t)}function We(e,t,n){let r=t===`daily`?j(n):M(n),i=t===`daily`?`dailyMissionDate`:`weeklyMissionWeek`,a=t===`daily`?`dailyMissions`:`weeklyMissions`;if(e[i]===r&&e[a].length===3)return;let o=t===`daily`?g:_;e[i]=r,e[a]=Ge(o,r).map(e=>({id:e.id,progress:0,completed:!1})),t===`weekly`&&(e.weeklyMilestonesClaimed=[])}function Ge(e,t){let n=new Set,r=Ke(t);for(;n.size<3;)r=qe(r),n.add(r%e.length);return[...n].map(t=>e[t])}function Ke(e){let t=2166136261;for(let n=0;n<e.length;n+=1)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return Math.abs(t>>>0)}function qe(e){return Math.imul(e,1664525)+1013904223>>>0}function Je(e,t,n){let r=t.outcome===`win`?90:35,i=[];t.outcome===`win`&&t.damageTaken<=.001&&i.push({label:`No Damage`,amount:40}),t.outcome===`win`&&t.durationSeconds<=180&&i.push({label:`Quick Kill`,amount:30}),t.fullComboChains>=3&&i.push({label:`Combo Artist`,amount:20}),t.finisherUsed&&i.push({label:`Finisher`,amount:15+n.swordCoinBonus});let a=t.modeId===`survival`?[1,1.1,1.25,1.4,1.6][Math.max(0,Math.min(4,t.roundWins-1))]??1:1,o=N(t.challengeTier).rewardMultiplier*a,s=z(e),c=r+i.reduce((e,t)=>e+t.amount,0),l=Math.round(c*o*s),u=t.outcome===`win`?160:80;return{baseCoins:r,bonusCoins:i,challengeMultiplier:o,streakMultiplier:s,totalCoins:l,baseXp:u,totalXp:Math.round(u*o)}}function Ye(e,t){for(e.xp+=Math.max(0,Math.round(t));e.xp>=F(e.level);)e.xp-=F(e.level),e.level+=1,e.upgradePoints+=1}function Xe(e,t){let n=[];for(let r of[`sword`,`gun`,`power`]){let i=e.weaponMastery[r],a=i.level,o=Math.round(t.damageByWeapon[r]*.22+(t.weaponsUsed[r]?t.outcome===`win`?12:6:0));if(o>0)for(i.totalXp+=o,i.xp+=o;i.level<10&&i.xp>=I(i.level);)i.xp-=I(i.level),i.level+=1;n.push({weapon:r,xpGained:o,levelBefore:a,levelAfter:i.level,xpAfter:i.xp,xpToNext:i.level>=10?0:I(i.level)})}return n}function Ze(e,t){let n=[];for(let r of[e.dailyMissions,e.weeklyMissions])for(let e of r){if(e.completed)continue;let r=G(e.id);e.progress=Math.min(r.target,e.progress+Qe(r,t)),e.completed=e.progress>=r.target,e.completed&&n.push({mission:r,rewardCoins:r.rewardCoins,rewardXp:r.rewardXp})}return n}function Qe(e,t){switch(e.metric){case`wins`:return+(t.outcome===`win`);case`fighter_wins`:return+(t.outcome===`win`&&t.opponentArchetype===`fighter`);case`boss_wins`:return+(t.outcome===`win`&&t.opponentArchetype===`boss`);case`challenge_wins`:return+(t.outcome===`win`&&t.challengeTier!==`standard`);case`sword_damage`:return Math.round(t.damageByWeapon.sword);case`gun_damage`:return Math.round(t.damageByWeapon.gun);case`power_damage`:return Math.round(t.damageByWeapon.power);case`full_combos`:return t.fullComboChains;case`finishers`:return+!!t.finisherUsed;case`rage_uses`:return t.rageActivations;case`objects_destroyed`:return t.objectsDestroyed;case`barrels_detonated`:return t.barrelsDetonated;case`hazardless_wins`:return+(t.outcome===`win`&&t.hazardDamageTaken<=.001);case`guard_breaks`:return t.guardBreaks;case`successful_blocks`:return t.successfulBlocks;case`dashes_used`:return t.dashesUsed;case`juggle_hits`:return t.juggleHits;case`launches`:return t.launches}}function $e(e,t){let n=[];for(let r of h)e.unlockedAchievements.includes(r.id)||et(r.id,t)&&(e.unlockedAchievements.push(r.id),n.push(r));return n}function et(e,t){switch(e){case`perfect_form`:return t.outcome===`win`&&t.damageTaken<=.001;case`speed_hunter`:return t.outcome===`win`&&t.durationSeconds<=180;case`combo_discipline`:return t.fullComboChains>=3;case`arsenal_sweep`:return t.outcome===`win`&&t.weaponsUsed.sword&&t.weaponsUsed.gun&&t.weaponsUsed.power;case`shock_surgeon`:return t.shockwaveBossPhase3Kill;case`demolitionist`:return t.guardBreaks>=3;case`hazard_dancer`:return t.outcome===`win`&&t.challengeTier!==`standard`&&t.dashesUsed>=3;case`ruthless_victor`:return t.outcome===`win`&&t.challengeTier===`cataclysm`;case`legend_slayer`:return t.outcome===`win`&&t.challengeTier===`legend`}}function tt(e){let t=e.weeklyMissions.filter(e=>e.completed).length,n=[],r=[];return t>=2&&!e.weeklyMilestonesClaimed.includes(2)&&(e.weeklyMilestonesClaimed.push(2),r.push(`weekbreaker`)),t>=3&&!e.weeklyMilestonesClaimed.includes(3)&&(e.weeklyMilestonesClaimed.push(3),n.push(`solar_static`)),{skins:n,titles:r}}var nt=class{context=null;masterVolume=1;uiVolume=1;setMix(e){this.masterVolume=Math.max(0,Math.min(1,e.masterVolume/100)),this.uiVolume=Math.max(0,Math.min(1,e.uiVolume/100))}suspend(){this.context&&this.context.state===`running`&&this.context.suspend()}resume(){this.context&&this.context.state===`suspended`&&this.context.resume()}play(e){let t=this.getContext();if(!t)return;t.state===`suspended`&&t.resume();let n=t.currentTime;switch(e){case`hover`:this.tone(t,n,540,.025,`triangle`,.018);break;case`navigation`:this.tone(t,n,420,.05,`triangle`,.03),this.tone(t,n+.045,620,.04,`sine`,.02);break;case`confirm`:this.tone(t,n,640,.04,`triangle`,.035),this.tone(t,n+.04,880,.05,`sine`,.028);break;case`purchase`:this.tone(t,n,380,.06,`square`,.03),this.tone(t,n+.04,760,.08,`triangle`,.035);break;case`upgrade`:this.tone(t,n,460,.05,`triangle`,.03),this.tone(t,n+.04,690,.05,`triangle`,.028),this.tone(t,n+.085,980,.07,`sine`,.024);break;case`reward`:this.tone(t,n,520,.05,`sine`,.035),this.tone(t,n+.055,780,.05,`triangle`,.03),this.tone(t,n+.11,1040,.08,`sine`,.028);break;case`deny`:this.tone(t,n,220,.06,`sawtooth`,.025),this.tone(t,n+.05,180,.08,`square`,.018);break}}getContext(){if(typeof window>`u`)return null;if(this.context)return this.context;let e=window.AudioContext??window.webkitAudioContext;return e?(this.context=new e,this.context):null}tone(e,t,n,r,i,a){let o=a*this.masterVolume*this.uiVolume;if(o<=1e-4)return;let s=e.createOscillator(),c=e.createGain();s.type=i,s.frequency.setValueAtTime(n,t),s.frequency.exponentialRampToValueAtTime(Math.max(80,n*.92),t+r),c.gain.setValueAtTime(1e-4,t),c.gain.exponentialRampToValueAtTime(o,t+.01),c.gain.exponentialRampToValueAtTime(1e-4,t+r),s.connect(c),c.connect(e.destination),s.start(t),s.stop(t+r+.02)}},rt=class{elements;actions=[];uiAudio=new nt;toast;helpOverlay;debugOverlay;onMetaClick=e=>this.handleOverlayClick(e,!1);onResultsClick=e=>this.handleOverlayClick(e,!0);onMetaMouseOver=e=>this.handleOverlayHover(e);onMetaMouseOut=e=>this.handleOverlayHoverOut(e);onResultsMouseOver=e=>this.handleButtonHover(e);metaView=null;renderSignature=``;calloutTimer=0;toastTimer=0;hoveredButton=null;previewHoverCard=null;rewardAnimation={active:!1,time:0,summaryKey:``,coinsPlayed:!1,xpPlayed:!1,bonusPlayed:!1};setAudioMix(e){this.uiAudio.setMix(e)}suspendAudio(){this.uiAudio.suspend()}resumeAudio(){this.uiAudio.resume()}constructor(){this.elements={playerHealth:this.getElement(`player-health`),bossHealth:this.getElement(`boss-health`),bossPhase:this.getElement(`boss-phase`),warningText:this.getElement(`warning-text`),centerMessage:this.getElement(`center-message`),comboCallout:this.getElement(`combo-callout`),finisherPrompt:this.getElement(`finisher-prompt`),statusText:this.getElement(`status-text`),restartText:this.getElement(`restart-text`),modeName:this.getElement(`mode-name`),modeDetail:this.getElement(`mode-detail`),ammoText:this.getElement(`ammo-text`),powerText:this.getElement(`power-text`),rageText:this.getElement(`rage-text`),rageFill:this.getElement(`rage-fill`),rageCooldown:this.getElement(`rage-cooldown`),screenTint:this.getElement(`screen-tint`),hudRoot:this.getElement(`hud`),metaOverlay:this.getElement(`meta-overlay`),resultsOverlay:this.getElement(`results-overlay`)},this.toast=document.createElement(`div`),this.toast.className=`menu-toast hidden`,document.body.append(this.toast),this.helpOverlay=document.createElement(`div`),this.helpOverlay.className=`combat-help-overlay hidden`,document.body.append(this.helpOverlay),this.debugOverlay=document.createElement(`div`),this.debugOverlay.className=`debug-analytics-overlay hidden`,document.body.append(this.debugOverlay),this.elements.metaOverlay.addEventListener(`click`,this.onMetaClick),this.elements.resultsOverlay.addEventListener(`click`,this.onResultsClick),this.elements.metaOverlay.addEventListener(`mouseover`,this.onMetaMouseOver),this.elements.metaOverlay.addEventListener(`mouseout`,this.onMetaMouseOut),this.elements.resultsOverlay.addEventListener(`mouseover`,this.onResultsMouseOver)}dispose(){this.elements.metaOverlay.removeEventListener(`click`,this.onMetaClick),this.elements.resultsOverlay.removeEventListener(`click`,this.onResultsClick),this.elements.metaOverlay.removeEventListener(`mouseover`,this.onMetaMouseOver),this.elements.metaOverlay.removeEventListener(`mouseout`,this.onMetaMouseOut),this.elements.resultsOverlay.removeEventListener(`mouseover`,this.onResultsMouseOver),this.toast.remove(),this.helpOverlay.remove(),this.debugOverlay.remove()}consumeActions(){let e=[...this.actions];return this.actions.length=0,e}updateHealth(e,t){this.elements.playerHealth.style.width=`${Math.round(Math.max(0,Math.min(1,e))*100)}%`,this.elements.bossHealth.style.width=`${Math.round(Math.max(0,Math.min(1,t))*100)}%`}setMatchState(e,t=null){let n=e===`finisher`?`Finisher`:e===`round_intro`?`Round Start`:e===`round_ko`?`KO`:e===`round_score`?`Next Round`:e===`help_pause`?`Paused`:e===`victory_pose`?t===`lose`?`Defeat`:`Victory`:``;this.elements.centerMessage.textContent=n,this.elements.centerMessage.classList.toggle(`hidden`,n.length===0),e===`victory_pose`&&t?this.elements.centerMessage.dataset.result=t:e===`finisher`?this.elements.centerMessage.dataset.result=`finisher`:delete this.elements.centerMessage.dataset.result,this.elements.restartText.classList.toggle(`hidden`,e!==`post_match`)}setStatus(e,t,n,r){let i=e?`Lane duel live.`:r===`2d`?`2D silhouette duel live.`:`2.5D lane locked.`,a=t===`sword`?`Sword pressure online.`:t===`gun`?`Rifle stance ready.`:`Power stance active.`,o=n?` Rage Mode is amplifying your hits.`:``;this.elements.statusText.textContent=`${i} ${a} Move: A/D or arrows or left stick. Jump: Space or A. Block: Shift or LB. Dash: double tap left/right. Light: LMB/J or X. Heavy: RMB/K or Y. Special: L or B. Help: Tab or Start. Debug: \` or Back.${o}`.trim()}setCombatInfo(e,t,n,r,i){this.elements.modeName.textContent=e.toUpperCase(),this.elements.modeDetail.textContent=t,this.elements.ammoText.textContent=n,this.elements.powerText.textContent=r,this.elements.rageText.textContent=i}setBossPhase(e,t){let n=e===null?`${t??`Duel`}: Rival`:e===`phase1`?`Phase 1: Pressure`:e===`phase2`?`Phase 2: Fury`:`Phase 3: Titan`;this.elements.bossPhase.textContent=n}setRage(e,t,n,r){let i=Math.max(0,Math.min(1,e));this.elements.rageFill.style.width=`${Math.round(i*100)}%`,this.elements.rageCooldown.textContent=t?`Rage live${r>0?` | Shockwave ${r.toFixed(1)}s`:` | Shockwave ready`}`:n>0?`Cooldown ${n.toFixed(1)}s`:i>=1?`Press F to ignite`:`Build Rage`}setWarning(e,t){this.elements.warningText.textContent=e,this.elements.warningText.classList.toggle(`hidden`,!t||e.length===0)}setFinisherPrompt(e){this.elements.finisherPrompt.classList.toggle(`hidden`,!e)}setTint(e,t){this.elements.screenTint.style.opacity=`${Math.max(e,t).toFixed(3)}`}setHelpOverlay(e,t,n,r){this.helpOverlay.classList.toggle(`hidden`,!e),e&&(this.helpOverlay.innerHTML=`
      <div class="combat-help-card">
        <span class="eyebrow">Fight Help</span>
        <h2>${r===`2d`?`2D Silhouette Controls`:`2.5D Arena Controls`}</h2>
        <div class="help-grid">
          <div><span>Move / Crouch / Jump</span><strong>A-D / S / Space</strong></div>
          <div><span>Light / Heavy / Special</span><strong>LMB-J / RMB-K / L</strong></div>
          <div><span>Block / Dash</span><strong>Shift / double tap left-right</strong></div>
          <div><span>Weapons</span><strong>1 Sword / 2 Gun / 3 Power</strong></div>
          <div><span>Power / Rage / Shockwave / Finisher</span><strong>E / F / Q / X</strong></div>
          <div><span>Gun Utility / Power Rod</span><strong>Up+L grenade / Down+L bomb / Down+Forward+L lightning</strong></div>
          <div><span>Combos</span><strong>L-L-H, Down+H, Fwd-Fwd+H, Down-Fwd+S</strong></div>
          <div><span>Controller</span><strong>X light / Y heavy / B special / LB block / RT context</strong></div>
          <div><span>Ammo / Utility</span><strong>${t} | ${n}</strong></div>
        </div>
        <p>Tab resumes the match. Backquote toggles the debug combat panel.</p>
      </div>
    `)}setDebugOverlay(e,t){this.debugOverlay.classList.toggle(`hidden`,!e),e&&(this.debugOverlay.innerHTML=t)}flashCallout(e,t){this.elements.comboCallout.textContent=e,this.elements.comboCallout.dataset.tone=t,this.elements.comboCallout.classList.remove(`hidden`),this.calloutTimer=1.1}notifyMenuFeedback(e,t){this.uiAudio.play(e),this.toast.textContent=t,this.toast.classList.remove(`hidden`),this.toast.dataset.tone=e,this.toastTimer=1.8}renderMetaState(e){this.metaView=e;let t=this.buildSignature(e);if(t===this.renderSignature)return;this.renderSignature=t;let n=e.matchState===`hub`,r=e.matchState===`post_match`&&e.summary!==null;if(this.elements.hudRoot.classList.toggle(`hud-hidden`,n||r),this.elements.metaOverlay.classList.toggle(`hidden`,!n),this.elements.resultsOverlay.classList.toggle(`hidden`,!r),n&&(this.elements.metaOverlay.innerHTML=this.renderMenuShell(e),this.focusPrimaryAction(this.elements.metaOverlay,e.profile.menuScreen===`main`?`[data-action="launch-mode"]`:`button`)),r&&e.summary){let t=`${e.summary.outcome}-${e.summary.levelAfter}-${e.summary.rewards.totalCoins}-${e.summary.rewards.totalXp}`;this.rewardAnimation.summaryKey!==t&&(this.rewardAnimation={active:!0,time:0,summaryKey:t,coinsPlayed:!1,xpPlayed:!1,bonusPlayed:!1}),this.elements.resultsOverlay.innerHTML=this.renderRewardShell(e.summary),this.focusPrimaryAction(this.elements.resultsOverlay,`[data-action="play-again"]`),this.updateRewardAnimation()}}tick(e){this.calloutTimer>0&&(this.calloutTimer=Math.max(0,this.calloutTimer-e),this.calloutTimer===0&&this.elements.comboCallout.classList.add(`hidden`)),this.toastTimer>0&&(this.toastTimer=Math.max(0,this.toastTimer-e),this.toastTimer===0&&this.toast.classList.add(`hidden`)),this.rewardAnimation.active&&!this.elements.resultsOverlay.classList.contains(`hidden`)&&(this.rewardAnimation.time+=e,this.updateRewardAnimation())}getElement(e){let t=document.getElementById(e);if(!t)throw Error(`Missing #${e}`);return t}enqueue(e){this.actions.push(e)}handleOverlayClick(e,t){let n=e.target instanceof HTMLElement?e.target.closest(`[data-action]`):null;if(!n)return;let r=n.dataset.action,i=n.dataset.sound??`confirm`;switch(r){case`navigate`:this.enqueue({type:`navigate`,screen:this.readDataset(n,`screen`,`main`)});break;case`open-drawer`:this.enqueue({type:`open_drawer`,drawer:this.readDataset(n,`drawer`,`daily`)});break;case`close-drawer`:this.enqueue({type:`close_drawer`});break;case`set-shop`:this.enqueue({type:`set_shop_section`,section:this.readDataset(n,`section`,`skins`)});break;case`set-skin-filter`:this.enqueue({type:`set_skin_filter`,filter:this.readDataset(n,`filter`,`all`)});break;case`select-mode`:this.enqueue({type:`select_mode`,modeId:this.readDataset(n,`mode`,`quick_fight`)});break;case`launch-mode`:this.enqueue({type:`launch_mode`,modeId:this.readDataset(n,`mode`,`quick_fight`)});break;case`set-challenge`:this.enqueue({type:`set_challenge`,tierId:this.readDataset(n,`tier`,`standard`)});break;case`buy-upgrade`:this.enqueue({type:`buy_upgrade`,nodeId:this.readDataset(n,`node`,`ferocity`)});break;case`reset-upgrades`:this.enqueue({type:`reset_upgrades`});break;case`buy-skin`:this.enqueue({type:`buy_skin`,skinId:this.readDataset(n,`skin`,`classic_azure`)});break;case`select-skin`:this.enqueue({type:`select_skin`,skinId:this.readDataset(n,`skin`,`classic_azure`)});break;case`preview-skin`:this.enqueue({type:`preview_skin`,skinId:this.readDataset(n,`skin`,`classic_azure`)});break;case`select-title`:this.enqueue({type:`select_title`,titleId:this.readDataset(n,`title`,`rookie`)});break;case`set-theme`:this.enqueue({type:`set_theme`,theme:this.readDataset(n,`theme`,`dark`)});break;case`set-presentation`:this.enqueue({type:`set_presentation`,mode:this.readDataset(n,`mode`,`2_5d`)});break;case`set-stage`:this.enqueue({type:`set_stage`,stageId:this.readDataset(n,`stage`,`neon_hangar`)});break;case`update-setting`:this.enqueue({type:`update_setting`,setting:n.dataset.setting??`masterVolume`,value:n.dataset.value??`100`});break;case`replay-tutorial`:this.enqueue({type:`replay_tutorial`});break;case`export-save`:this.enqueue({type:`export_save`});break;case`import-save`:this.enqueue({type:`import_save`});break;case`reset-profile`:this.enqueue({type:`reset_profile`});break;case`continue-guest`:this.enqueue({type:`continue_guest`});break;case`login-google`:this.enqueue({type:`login_google`});break;case`login-email-signin`:{let e=this.readAccountCredentials(n);if(!e){this.notifyMenuFeedback(`deny`,`Enter email and password first.`);return}this.enqueue({type:`login_email_signin`,...e});break}case`login-email-register`:{let e=this.readAccountCredentials(n);if(!e){this.notifyMenuFeedback(`deny`,`Enter email and password first.`);return}this.enqueue({type:`login_email_register`,...e});break}case`logout-user`:this.enqueue({type:`logout_user`});break;case`open-upgrades`:this.enqueue({type:`open_upgrades`});break;case`play-again`:this.enqueue({type:`play_again`});break;case`back-to-hub`:this.enqueue({type:`back_to_hub`});break;case`back-to-profile`:this.enqueue({type:`back_to_profile`});break;case`clear-preview`:this.enqueue({type:`clear_skin_preview`});break;default:return}(!t||r!==`play-again`)&&this.uiAudio.play(i)}handleOverlayHover(e){this.handleButtonHover(e);let t=e.target instanceof HTMLElement?e.target.closest(`[data-preview-skin]`):null;!t||t===this.previewHoverCard||(this.previewHoverCard=t,this.enqueue({type:`preview_skin`,skinId:this.readDataset(t,`previewSkin`,`classic_azure`)}))}handleOverlayHoverOut(e){let t=e.target instanceof HTMLElement?e.target.closest(`[data-preview-skin]`):null;if(!t||!this.previewHoverCard||t!==this.previewHoverCard)return;let n=e instanceof MouseEvent&&e.relatedTarget instanceof Node?e.relatedTarget:null;n&&t.contains(n)||(this.previewHoverCard=null,this.enqueue({type:`clear_skin_preview`}))}handleButtonHover(e){let t=e.target instanceof HTMLElement?e.target.closest(`[data-sound-hover]`):null;!t||t===this.hoveredButton||(this.hoveredButton=t,this.uiAudio.play(`hover`))}buildSignature(e){let{profile:t,summary:n}=e;return JSON.stringify({matchState:e.matchState,menuScreen:t.menuScreen,shopSection:t.shopSection,menuDrawer:e.menuDrawer,previewSkinId:e.previewSkinId,skinFilter:e.skinFilter,dailyRewardCoins:e.dailyRewardCoins,selectedMode:t.lastSelectedMode,selectedChallengeTier:t.selectedChallengeTier,selectedSkinId:t.selectedSkinId,selectedTitleId:t.selectedTitleId,level:t.level,xp:t.xp,coins:t.coins,gems:t.gems,themeMode:t.themeMode,presentationMode:t.presentationMode,selectedStageId:t.selectedStageId,cloudSession:e.cloudSession,settings:t.settings,tutorialState:t.tutorialState,upgradePoints:t.upgradePoints,unlockedModes:t.unlockedModes,unlockedSkins:t.unlockedSkins,unlockedTitles:t.unlockedTitles,unlockedAchievements:t.unlockedAchievements,unlockedChallengeTiers:t.unlockedChallengeTiers,upgrades:t.upgrades,dailyMissions:t.dailyMissions,weeklyMissions:t.weeklyMissions,weeklyMilestonesClaimed:t.weeklyMilestonesClaimed,weaponMastery:t.weaponMastery,lifetimeStats:t.lifetimeStats,summary:n===null?null:{outcome:n.outcome,totalCoins:n.rewards.totalCoins,totalXp:n.rewards.totalXp,levelAfter:n.levelAfter,challengeTier:n.challengeTier.id,achievements:n.achievementsUnlocked.map(e=>e.id),skins:n.skinsUnlocked.map(e=>e.id),titles:n.titlesUnlocked.map(e=>e.id)}})}renderMenuShell(e){let t=P(e.profile.level),n=this.renderMenuScreen(e);return`
      <div class="menu-shell screen-${e.profile.menuScreen}">
        <div class="menu-bg-orb orb-left"></div>
        <div class="menu-bg-orb orb-right"></div>
        <header class="menu-topbar glass-panel">
          <div class="brand-lockup">
            <span class="brand-kicker">Stick Titan</span>
            <strong class="brand-title">Neon Arena Protocol</strong>
          </div>
          <div class="topbar-tools">
            <button class="account-entry" data-action="open-drawer" data-drawer="account" data-sound="navigation" data-sound-hover="1" type="button">
              <span>${e.cloudSession.isLinked?`Cloud Save`:`Login / Save Progress`}</span>
              <strong>${this.getCloudStatusLabel(e.cloudSession)}</strong>
            </button>
            <div class="theme-toggle" role="group" aria-label="Theme">
              ${this.renderThemeButton(e.profile.themeMode,`dark`,`Dark`)}
              ${this.renderThemeButton(e.profile.themeMode,`light`,`Light`)}
            </div>
            <div class="theme-toggle" role="group" aria-label="Visual Mode">
              ${this.renderPresentationButton(e.profile.presentationMode,`2_5d`,`2.5D`)}
              ${this.renderPresentationButton(e.profile.presentationMode,`2d`,`2D`)}
            </div>
          </div>
          <div class="resource-bar">
            <div class="resource-chip coin"><span>Coins</span><strong>${this.formatNumber(e.profile.coins)}</strong></div>
            <div class="resource-chip gem"><span>Gems</span><strong>${this.formatNumber(e.profile.gems)}</strong></div>
            <div class="resource-chip level"><span>Level</span><strong>${e.profile.level} | ${t.name}</strong></div>
          </div>
        </header>
        <div class="menu-layout">
          <aside class="menu-rail">
            <button class="rail-button" data-action="open-drawer" data-drawer="daily" data-sound="navigation" data-sound-hover="1">
              <span class="rail-icon">DAILY</span>
              <span>Daily Rewards</span>
              <strong>${e.dailyRewardCoins>0?`+${e.dailyRewardCoins}`:`Day ${Math.max(e.profile.dailyStreak.cycleDay,1)}`}</strong>
            </button>
            <button class="rail-button" data-action="open-drawer" data-drawer="missions" data-sound="navigation" data-sound-hover="1">
              <span class="rail-icon">TASK</span>
              <span>Missions</span>
              <strong>${this.getCompletedMissionCount(e.profile)}</strong>
            </button>
          </aside>
          <main class="menu-main">
            ${n}
          </main>
        </div>
        ${this.renderDrawer(e)}
      </div>
    `}renderMenuScreen(e){switch(e.profile.menuScreen){case`modes`:return this.renderModesScreen(e.profile);case`shop`:return this.renderShopScreen(e.profile,e.previewSkinId);case`profile`:return this.renderProfileScreen(e.profile);case`settings`:return this.renderSettingsScreen(e.profile,e.cloudSession);case`reward`:return this.renderRewardFallback(e.summary);default:return this.renderMainMenu(e.profile,e.dailyRewardCoins)}}renderRewardFallback(e){return`
      <section class="screen-panel main-panel">
        <div class="panel-copy">
          <span class="eyebrow">Reward Screen</span>
          <h1>Jump Back Into The Arena</h1>
          <p>${e?`${e.outcome===`win`?`Victory secured.`:`Setback logged.`} Open the full reward screen to review unlocks.`:`Match results will appear here after a run.`}</p>
        </div>
        <div class="hero-actions">
          <button class="menu-button primary" data-action="play-again" data-sound="reward" data-sound-hover="1">Play Again</button>
          <button class="menu-button" data-action="open-upgrades" data-sound="navigation" data-sound-hover="1">Upgrade</button>
          <button class="menu-button" data-action="back-to-profile" data-sound="navigation" data-sound-hover="1">Back To Profile</button>
        </div>
      </section>
    `}renderMainMenu(e,t){let n=N(e.selectedChallengeTier),r=B(e.lastSelectedMode),i=m.find(t=>t.id===e.selectedTitleId)?.name??`Rookie`,a=Math.min(e.dailyStreak.streakCount,7)*5;return`
      <section class="screen-panel main-panel home-panel">
        <div class="home-hero glass-panel">
          <div class="hero-copy">
            <span class="eyebrow">Tournament Command</span>
            <h1>Fight Fast. Adapt Hard. Run It Back.</h1>
            <p>The arena stays live behind the shell, but this front end now behaves like a full command deck: clear status, faster choices, and a stronger route back into combat.</p>
          </div>
          <div class="home-chip-row">
            <span class="home-chip accent">Live Arena</span>
            <span class="home-chip">${e.presentationMode===`2d`?`2D Silhouette`:`2.5D Cinematic`}</span>
            <span class="home-chip">${e.themeMode===`light`?`Light Deck`:`Dark Deck`}</span>
          </div>
          <div class="home-signal-grid">
            <article class="home-signal-card">
              <span class="eyebrow">Identity</span>
              <strong>${i}</strong>
              <span>Level ${e.level} operator</span>
            </article>
            <article class="home-signal-card">
              <span class="eyebrow">Mode Focus</span>
              <strong>${r.name}</strong>
              <span>${n.name} tier selected</span>
            </article>
            <article class="home-signal-card">
              <span class="eyebrow">Mission Pulse</span>
              <strong>${this.getCompletedMissionCount(e)}</strong>
              <span>missions complete</span>
            </article>
            <article class="home-signal-card">
              <span class="eyebrow">Streak Bonus</span>
              <strong>+${a}%</strong>
              <span>${t>0?`today +${t} coins`:`reward already claimed`}</span>
            </article>
          </div>
        </div>
        <div class="main-menu-center glass-panel home-command">
          <div class="home-command-head">
            <div class="player-badge">
              <span class="eyebrow">Ready Loadout</span>
              <strong>${r.name}</strong>
              <span>Tier: ${n.name}</span>
              <span>Fast launch is primed</span>
            </div>
            <div class="home-launch-card">
              <span class="eyebrow">Primary Action</span>
              <strong>Quick Fight</strong>
              <span>Press Enter or hit Play to jump straight in.</span>
            </div>
          </div>
          <div class="feature-list tournament-strip home-spotlight-strip">
            <div><strong>Visual Mode</strong><span>${e.presentationMode===`2d`?`Pure side silhouette read`:`Side-view cinematic depth`}</span></div>
            <div><strong>Current Theme</strong><span>${e.themeMode===`light`?`White and golden beige command deck`:`Dark neon command deck`}</span></div>
            <div><strong>Fight Style</strong><span>Light, heavy, special, block, dash, rage, finisher</span></div>
          </div>
          <div class="cta-stack home-cta-stack">
            <button class="menu-button primary big home-primary-button" data-action="launch-mode" data-mode="quick_fight" data-sound="confirm" data-sound-hover="1">Play</button>
            <div class="home-nav-grid">
              <button class="menu-button big home-nav-card" data-action="navigate" data-screen="modes" data-sound="navigation" data-sound-hover="1">
                <strong>Modes</strong>
                <span>Switch between duels, boss runs, and survival.</span>
              </button>
              <button class="menu-button big home-nav-card" data-action="navigate" data-screen="shop" data-sound="navigation" data-sound-hover="1">
                <strong>Shop</strong>
                <span>Review skins, upgrades, and current build value.</span>
              </button>
              <button class="menu-button big home-nav-card" data-action="navigate" data-screen="profile" data-sound="navigation" data-sound-hover="1">
                <strong>Profile</strong>
                <span>Check rank, mastery, achievements, and long-term stats.</span>
              </button>
              <button class="menu-button big home-nav-card" data-action="navigate" data-screen="settings" data-sound="navigation" data-sound-hover="1">
                <strong>Settings</strong>
                <span>Tune visuals, assists, audio, and tutorial replay.</span>
              </button>
            </div>
          </div>
          <div class="home-footer-strip">
            <div><span>Fast Path</span><strong>Enter launches Quick Fight instantly</strong></div>
            <div><span>Current Loop</span><strong>${r.name} | ${n.name}</strong></div>
            <div><span>Readiness</span><strong>${e.dailyMissions.filter(e=>e.completed).length} daily claims primed</strong></div>
          </div>
        </div>
        <div class="main-menu-side home-side-stack">
          <div class="glass-panel home-side-card">
            <span class="eyebrow">Quick Start</span>
            <div class="feature-list">
              <div><strong>Daily Reward</strong><span>${t>0?`Claimed +${t} coins today`:`Next login reward already secured`}</span></div>
              <div><strong>Mission Flow</strong><span>${this.getCompletedMissionCount(e)} missions currently complete</span></div>
              <div><strong>Best Start</strong><span>Play, learn the spacing, then tune in Settings or Shop.</span></div>
            </div>
          </div>
          <div class="glass-panel home-side-card controls-sheet home-controls-deck">
            <strong>How To Play</strong>
            <div><span>Movement</span><span>A / D or arrows, S down, W up, Space jump</span></div>
            <div><span>Attacks</span><span>LMB or J light, RMB or K heavy, L special</span></div>
            <div><span>Defense</span><span>Shift block, double tap left-right dash</span></div>
            <div><span>Weapon Flow</span><span>1 sword, 2 gun, 3 power, R reload</span></div>
            <div><span>Advanced</span><span>F rage, Q shockwave, X finisher, E overdrive</span></div>
            <div><span>Utility Tech</span><span>Up+L grenade, Down+L bomb, Down+Forward+L lightning</span></div>
            <div><span>Match Tools</span><span>Tab help overlay, Backquote debug analytics</span></div>
            <div><span>Core Routes</span><span>L-L-H, Down+H, Forward-Forward+H, Down-Forward+S</span></div>
          </div>
        </div>
      </section>
    `}renderModesScreen(e){let t=u.find(t=>t.id===e.lastSelectedMode)??u[0],n=N(e.selectedChallengeTier),r=H(e,t.id);return`
      <section class="screen-panel modes-panel">
        <div class="screen-header">
          <div>
            <span class="eyebrow">Modes</span>
            <h1>Choose Your Entry Point</h1>
            <p>Quick Fight launches a best-of-three duel, Boss Battle opens the boss set, and Survival runs the full five-fight ladder with carryover recovery.</p>
          </div>
          <button class="menu-button subtle" data-action="navigate" data-screen="main" data-sound="navigation" data-sound-hover="1">Back</button>
        </div>
        <div class="modes-layout">
          <div class="mode-grid">
            ${u.map(n=>this.renderModeCard(e,n.id,n.id===t.id)).join(``)}
          </div>
          <div class="mode-brief glass-panel">
            <span class="eyebrow">Selected Mode</span>
            <h2>${t.name}</h2>
            <p>${t.description}</p>
            ${t.id===`boss_battle`?`
                  <div class="tier-grid">
                    ${s.map(t=>{let n=e.unlockedChallengeTiers.includes(t.id);return`
                        <button
                          class="tier-pill ${t.id===e.selectedChallengeTier?`active`:``}"
                          data-action="set-challenge"
                          data-tier="${t.id}"
                          data-sound="${n?`navigation`:`deny`}"
                          data-sound-hover="1"
                          ${n?``:`disabled`}
                        >
                          <strong>${t.name}</strong>
                          <span>${Math.round(t.rewardMultiplier*100)}% rewards</span>
                        </button>
                      `}).join(``)}
                  </div>
                  <div class="mode-stats">
                    <div><span>Opponent Health</span><strong>${Math.round(n.bossHealthMultiplier*100)}%</strong></div>
                    <div><span>Damage</span><strong>${Math.round(n.bossDamageMultiplier*100)}%</strong></div>
                    <div><span>Guard Pressure</span><strong>${Math.round(n.hazardDamageMultiplier*100)}%</strong></div>
                  </div>
                `:`
                  <div class="mode-stats">
                    <div><span>Current Tier</span><strong>${n.name}</strong></div>
                    <div><span>Reward Multiplier</span><strong>${n.rewardMultiplier.toFixed(2)}x</strong></div>
                    <div><span>Status</span><strong>${r===`available`?`Ready`:r===`locked`?`Unlock at Lv ${t.unlockLevel}`:`Coming Soon`}</strong></div>
                  </div>
                `}
            <div class="section-minihead">
              <span class="eyebrow">Stage Variant</span>
              <strong>${V(e.selectedStageId).name}</strong>
            </div>
            <div class="tier-grid">
              ${d.map(t=>`
                  <button
                    class="tier-pill ${t.id===e.selectedStageId?`active`:``}"
                    data-action="set-stage"
                    data-stage="${t.id}"
                    data-sound="navigation"
                    data-sound-hover="1"
                  >
                    <strong>${t.name}</strong>
                    <span>${t.description}</span>
                  </button>
                `).join(``)}
            </div>
            <div class="hero-actions">
              <button
                class="menu-button primary"
                data-action="launch-mode"
                data-mode="${t.id}"
                data-sound="${r===`available`?`confirm`:`deny`}"
                data-sound-hover="1"
              >
                ${r===`available`?`Launch ${t.name}`:r===`locked`?`Locked`:`Coming Soon`}
              </button>
              <button class="menu-button" data-action="navigate" data-screen="shop" data-sound="navigation" data-sound-hover="1">Tune Loadout</button>
            </div>
          </div>
        </div>
      </section>
    `}renderModeCard(e,t,n){let r=B(t),i=H(e,t),a=i===`available`?`Ready`:i===`locked`?`Lv ${r.unlockLevel}`:`Soon`;return`
      <button
        class="mode-card-modern glass-panel ${n?`selected`:``} availability-${i}"
        data-action="select-mode"
        data-mode="${t}"
        data-sound="${i===`locked`?`deny`:`navigation`}"
        data-sound-hover="1"
      >
        <span class="mode-accent" style="--mode-accent:#${r.accentColor.toString(16).padStart(6,`0`)}"></span>
        <span class="mode-badge">${a}</span>
        <strong>${r.name}</strong>
        <span>${r.description}</span>
      </button>
    `}renderShopScreen(e,t){let n=W(t??e.selectedSkinId);return`
      <section class="screen-panel shop-panel">
        <div class="screen-header">
          <div>
            <span class="eyebrow">Shop</span>
            <h1>Skins, Upgrades, And Premium Preview</h1>
            <p>The live fighter in the background reflects your equipped or selected preview skin. Upgrades stay coin-funded and premium cards remain disabled as a future-ready shell.</p>
          </div>
          <button class="menu-button subtle" data-action="navigate" data-screen="main" data-sound="navigation" data-sound-hover="1">Back</button>
        </div>
        <div class="shop-tabs">
          <button class="shop-tab ${e.shopSection===`skins`?`active`:``}" data-action="set-shop" data-section="skins" data-sound="navigation" data-sound-hover="1">Skins</button>
          <button class="shop-tab ${e.shopSection===`upgrades`?`active`:``}" data-action="set-shop" data-section="upgrades" data-sound="navigation" data-sound-hover="1">Upgrades</button>
          <button class="shop-tab ${e.shopSection===`premium`?`active`:``}" data-action="set-shop" data-section="premium" data-sound="navigation" data-sound-hover="1">Premium</button>
        </div>
        <div class="shop-layout">
          <div class="shop-preview glass-panel" style="--preview-skin:#${n.primaryColor.toString(16).padStart(6,`0`)}; --preview-glow:#${n.auraColor.toString(16).padStart(6,`0`)}">
            <span class="eyebrow">Live Preview</span>
            <h2>${n.name}</h2>
            <p>${n.unlockLabel}</p>
            <div class="preview-swatch"></div>
            <div class="preview-meta">
              <span>${t?`Preview selected`:`Equipped preview`}</span>
              <strong>${e.selectedSkinId===n.id?`Equipped`:`Inspecting`}</strong>
            </div>
            ${t?`<button class="menu-button subtle" data-action="clear-preview" data-sound="navigation" data-sound-hover="1">Return To Equipped</button>`:``}
          </div>
          ${e.shopSection===`skins`?this.renderSkinsSection(e,this.metaView?.skinFilter??`all`):e.shopSection===`upgrades`?this.renderUpgradeSection(e):this.renderPremiumSection(e)}
        </div>
      </section>
    `}renderSkinsSection(e,t){let n=p.filter(n=>{let r=e.unlockedSkins.includes(n.id),i=e.selectedSkinId===n.id;return t===`owned`?r:t===`locked`?!r:t===`equipped`?i:!0});return`
      <div class="shop-content skin-grid-modern">
        <div class="skin-filter-row">
          ${[`all`,`owned`,`locked`,`equipped`].map(e=>`<button class="shop-tab ${t===e?`active`:``}" data-action="set-skin-filter" data-filter="${e}" data-sound="navigation" data-sound-hover="1">${e.toUpperCase()}</button>`).join(``)}
        </div>
        ${n.length===0?`
              <article class="glass-panel empty-state-card">
                <span class="eyebrow">No Skins Here Yet</span>
                <h3>Nothing matches the current filter.</h3>
                <p>Swap the filter to see owned, locked, or equipped looks and keep the preview pinned with the Preview button.</p>
              </article>
            `:``}
        ${n.map(t=>{let n=e.unlockedSkins.includes(t.id),r=e.selectedSkinId===t.id,i=typeof t.coinCost==`number`||typeof t.gemCost==`number`,a=t.coinCost?`${t.coinCost} coins`:t.gemCost?`${t.gemCost} gems`:`Unlock only`,o=this.metaView?.previewSkinId===t.id;return`
            <article
              class="skin-card-modern glass-panel ${n?`owned`:`locked`} ${r?`equipped`:``} ${o?`previewed`:``}"
            >
              <div class="skin-card-top">
                <span class="skin-name">${t.name}</span>
                <span class="skin-price">${o?`Previewing`:n?r?`Equipped`:`Owned`:a}</span>
              </div>
              <div
                class="skin-art"
                style="--skin-main:#${t.primaryColor.toString(16).padStart(6,`0`)}; --skin-glow:#${t.auraColor.toString(16).padStart(6,`0`)};"
              ></div>
              <p>${t.unlockLabel}</p>
              <div class="card-actions">
                <button class="menu-button subtle" data-action="preview-skin" data-skin="${t.id}" data-sound="navigation" data-sound-hover="1">Preview</button>
                ${n?`<button class="menu-button ${r?`subtle`:``}" data-action="select-skin" data-skin="${t.id}" data-sound="${r?`navigation`:`confirm`}" data-sound-hover="1">${r?`Equipped`:`Equip`}</button>`:i?`<button class="menu-button primary" data-action="buy-skin" data-skin="${t.id}" data-sound="purchase" data-sound-hover="1">Buy</button>`:`<button class="menu-button subtle" disabled>Locked Challenge</button>`}
              </div>
            </article>
          `}).join(``)}
      </div>
    `}renderUpgradeSection(e){let t=L(e.level);return`
      <div class="shop-content upgrade-layout">
        <div class="upgrade-preview glass-panel">
          <span class="eyebrow">Character Preview</span>
          <h2>Build Control</h2>
          <p>Upgrade points unlock with level ups. Coin spend is permanent until you free-respec.</p>
          <div class="mode-stats">
            <div><span>Upgrade Points</span><strong>${e.upgradePoints}</strong></div>
            <div><span>Rank Cap</span><strong>${t}/5</strong></div>
            <div><span>Coins</span><strong>${this.formatNumber(e.coins)}</strong></div>
          </div>
          <button class="menu-button subtle" data-action="reset-upgrades" data-sound="navigation" data-sound-hover="1">Free Respec</button>
        </div>
        <div class="upgrade-groups">
          ${[`combat`,`survival`,`special`].map(n=>`
                <section class="upgrade-group glass-panel">
                  <div class="section-minihead">
                    <span class="eyebrow">${n}</span>
                    <strong>${n===`combat`?`Aggression`:n===`survival`?`Durability`:`Special Systems`}</strong>
                  </div>
                  <div class="upgrade-list">
                    ${l.filter(e=>e.category===n).map(n=>{let r=e.upgrades[n.id],i=R(n.id,r),a=r>=t||r>=n.maxRank||e.upgradePoints<=0;return`
                          <article class="upgrade-node">
                            <div class="upgrade-node-head">
                              <div>
                                <strong>${n.name}</strong>
                                <span>${n.description}</span>
                              </div>
                              <div class="upgrade-rank">Lv ${r}/${n.maxRank}</div>
                            </div>
                            <div class="upgrade-node-foot">
                              <span>${this.getNextUpgradeText(n.id,r)} | ${i} coins</span>
                              <button
                                class="menu-button ${a?`subtle`:`primary`}"
                                data-action="buy-upgrade"
                                data-node="${n.id}"
                                data-sound="${a?`deny`:`upgrade`}"
                                data-sound-hover="1"
                                ${a?`disabled`:``}
                              >
                                ${a?`Cap / No Points`:`Upgrade`}
                              </button>
                            </div>
                          </article>
                        `}).join(``)}
                  </div>
                </section>
              `).join(``)}
        </div>
      </div>
    `}renderPremiumSection(e){return`
      <div class="shop-content premium-grid">
        ${ee.map(t=>`
            <article class="premium-card glass-panel">
              <span class="premium-badge">${t.badge}</span>
              <h2>${t.name}</h2>
              <p>${t.description}</p>
              <div class="mode-stats">
                <div><span>Preview Price</span><strong>${t.gemCost} gems</strong></div>
                <div><span>Your Gems</span><strong>${e.gems}</strong></div>
                <div><span>Status</span><strong>Unavailable</strong></div>
              </div>
              <button class="menu-button subtle" disabled>Coming Soon</button>
            </article>
          `).join(``)}
      </div>
    `}renderProfileScreen(e){let t=P(e.level),n=h.length,r=Math.round(e.unlockedAchievements.length/Math.max(n,1)*100);return`
      <section class="screen-panel profile-panel">
        <div class="screen-header">
          <div>
            <span class="eyebrow">Profile</span>
            <h1>${m.find(t=>t.id===e.selectedTitleId)?.name??`Rookie`} Profile</h1>
            <p>Track lifetime stats, mastery progress, challenge advancement, and achievement completion from one place.</p>
          </div>
          <div class="hero-actions">
            <button class="menu-button" data-action="navigate" data-screen="settings" data-sound="navigation" data-sound-hover="1">Settings</button>
            <button class="menu-button subtle" data-action="navigate" data-screen="main" data-sound="navigation" data-sound-hover="1">Back</button>
          </div>
        </div>
        <div class="profile-layout">
          <section class="profile-card glass-panel">
            <span class="eyebrow">Identity</span>
            <h2>Level ${e.level} | ${t.name}</h2>
            <p>Equipped skin: ${W(e.selectedSkinId).name}</p>
            <div class="mode-stats">
              <div><span>Wins</span><strong>${e.lifetimeStats.wins}</strong></div>
              <div><span>Losses</span><strong>${e.lifetimeStats.losses}</strong></div>
              <div><span>Finishers</span><strong>${e.lifetimeStats.totalFinishers}</strong></div>
            </div>
            <div class="progress-line">
              <span>Achievements</span>
              <div class="line-track"><div class="line-fill" style="width:${r}%"></div></div>
              <strong>${r}%</strong>
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Lifetime Stats</span>
            <div class="stats-stack">
              <div><span>Total Play Time</span><strong>${Math.round(e.lifetimeStats.totalPlaySeconds/60)} min</strong></div>
              <div><span>Damage Dealt</span><strong>${this.formatNumber(Math.round(e.lifetimeStats.totalDamageDealt))}</strong></div>
              <div><span>Damage Taken</span><strong>${this.formatNumber(Math.round(e.lifetimeStats.totalDamageTaken))}</strong></div>
              <div><span>Rage Activations</span><strong>${e.lifetimeStats.totalRageUses}</strong></div>
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Weapon Mastery</span>
            <div class="mastery-stack">
              ${[`sword`,`gun`,`power`].map(t=>{let n=e.weaponMastery[t],r=I(n.level),i=n.level>=10?100:Math.round(n.xp/Math.max(r,1)*100);return`
                    <div class="mastery-row">
                      <div>
                        <strong>${t.toUpperCase()}</strong>
                        <span>Level ${n.level}</span>
                      </div>
                      <div class="line-track"><div class="line-fill" style="width:${i}%"></div></div>
                      <strong>${n.level>=10?`MAX`:`${n.xp}/${r}`}</strong>
                    </div>
                  `}).join(``)}
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Challenge Progress</span>
            <div class="stats-stack">
              <div><span>Tiers Unlocked</span><strong>${e.unlockedChallengeTiers.length}/${s.length}</strong></div>
              <div><span>Modes Unlocked</span><strong>${e.unlockedModes.length}/${u.length}</strong></div>
              <div><span>Skins Unlocked</span><strong>${e.unlockedSkins.length}/${p.length}</strong></div>
              <div><span>Titles Unlocked</span><strong>${e.unlockedTitles.length}/${m.length}</strong></div>
            </div>
          </section>
        </div>
      </section>
    `}renderSettingsScreen(e,t){let n=[0,25,50,75,100];return`
      <section class="screen-panel settings-panel">
        <div class="screen-header">
          <div>
            <span class="eyebrow">Settings</span>
            <h1>Fight Control Center</h1>
            <p>Adjust volume, difficulty assists, shake intensity, visuals, and replay the tutorial without leaving the progression shell.</p>
          </div>
          <button class="menu-button subtle" data-action="navigate" data-screen="main" data-sound="navigation" data-sound-hover="1">Back</button>
        </div>
        <div class="profile-layout">
          <section class="profile-card glass-panel">
            <span class="eyebrow">Audio</span>
            <div class="stats-stack">
              ${[[`masterVolume`,`Master`,e.settings.masterVolume],[`combatVolume`,`Combat`,e.settings.combatVolume],[`uiVolume`,`UI`,e.settings.uiVolume],[`crowdVolume`,`Crowd`,e.settings.crowdVolume]].map(([e,t,r])=>`
                    <div class="settings-row">
                      <span>${t}</span>
                      <div class="settings-chip-row">
                        ${n.map(t=>`
                              <button
                                class="shop-tab ${Number(r)===t?`active`:``}"
                                data-action="update-setting"
                                data-setting="${e}"
                                data-value="${t}"
                                data-sound="navigation"
                                data-sound-hover="1"
                              >${t}</button>
                            `).join(``)}
                      </div>
                    </div>
                  `).join(``)}
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Presentation</span>
            <div class="stats-stack">
              <div class="settings-row">
                <span>Theme</span>
                <div class="settings-chip-row">
                  ${this.renderThemeButton(e.themeMode,`dark`,`Dark`)}
                  ${this.renderThemeButton(e.themeMode,`light`,`Light`)}
                </div>
              </div>
              <div class="settings-row">
                <span>Visual Mode</span>
                <div class="settings-chip-row">
                  ${this.renderPresentationButton(e.presentationMode,`2_5d`,`2.5D`)}
                  ${this.renderPresentationButton(e.presentationMode,`2d`,`2D`)}
                </div>
              </div>
              <div class="settings-row">
                <span>Screen Shake</span>
                <div class="settings-chip-row">
                  ${[0,50,100].map(t=>`
                        <button
                          class="shop-tab ${e.settings.screenShake===t?`active`:``}"
                          data-action="update-setting"
                          data-setting="screenShake"
                          data-value="${t}"
                          data-sound="navigation"
                          data-sound-hover="1"
                        >${t}%</button>
                      `).join(``)}
                  </div>
              </div>
              <div class="settings-row">
                <span>Preferred Stage</span>
                <div class="settings-chip-row">
                  ${d.map(t=>`
                      <button
                        class="shop-tab ${e.selectedStageId===t.id?`active`:``}"
                        data-action="set-stage"
                        data-stage="${t.id}"
                        data-sound="navigation"
                        data-sound-hover="1"
                      >${t.name}</button>
                    `).join(``)}
                </div>
              </div>
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Assist + Training</span>
            <div class="stats-stack">
              <div class="settings-row">
                <span>Difficulty Assist</span>
                <div class="settings-chip-row">
                  <button class="shop-tab ${e.settings.difficultyAssist===`standard`?`active`:``}" data-action="update-setting" data-setting="difficultyAssist" data-value="standard" data-sound="navigation" data-sound-hover="1">Standard</button>
                  <button class="shop-tab ${e.settings.difficultyAssist===`forgiving`?`active`:``}" data-action="update-setting" data-setting="difficultyAssist" data-value="forgiving" data-sound="navigation" data-sound-hover="1">Forgiving</button>
                </div>
              </div>
              <div class="settings-row">
                <span>Tutorial</span>
                <div class="settings-chip-row">
                  <button class="menu-button" data-action="replay-tutorial" data-sound="navigation" data-sound-hover="1">Replay Tutorial Fight</button>
                </div>
              </div>
              <div class="settings-row">
                <span>Help Surface</span>
                <div class="settings-chip-row">
                  <button class="shop-tab active">Home + Tab Overlay</button>
                  <button class="shop-tab active">Backquote Debug</button>
                </div>
              </div>
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Account</span>
            ${this.renderAccountPanel(t,!0)}
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Controller Map</span>
            <div class="stats-stack">
              <div><span>Movement</span><strong>Left stick / D-pad</strong></div>
              <div><span>Jump / Light / Heavy / Special</span><strong>A / X / Y / B</strong></div>
              <div><span>Block / Reload</span><strong>LB / RB</strong></div>
              <div><span>Rage / Context</span><strong>LT / RT</strong></div>
              <div><span>Help / Debug</span><strong>Start / Back</strong></div>
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Save Data</span>
            <div class="stats-stack">
              <div><span>Profile Version</span><strong>v${e.profileVersion}</strong></div>
              <div><span>Storage</span><strong>Session save + cloud for linked accounts</strong></div>
              <div><span>Cloud Status</span><strong>${this.getCloudStatusLabel(t)}</strong></div>
            </div>
            <div class="card-actions">
              <button class="menu-button" data-action="export-save" data-sound="confirm" data-sound-hover="1">Export Save</button>
              <button class="menu-button" data-action="import-save" data-sound="navigation" data-sound-hover="1">Import Save</button>
              <button class="menu-button subtle" data-action="reset-profile" data-sound="deny" data-sound-hover="1">Reset Profile</button>
            </div>
          </section>
        </div>
      </section>
    `}renderDrawer(e){if(e.menuDrawer===`none`)return``;if(e.menuDrawer===`daily`){let t=(e.profile.dailyStreak.cycleDay%7||0)+1;return`
        <aside class="drawer-panel glass-panel">
          <div class="drawer-head">
            <div>
              <span class="eyebrow">Daily Rewards</span>
              <h2>Streak ${e.profile.dailyStreak.streakCount} days</h2>
            </div>
            <button class="menu-button subtle" data-action="close-drawer" data-sound="navigation" data-sound-hover="1">Close</button>
          </div>
          <div class="stats-stack">
            <div><span>Today</span><strong>${e.dailyRewardCoins>0?`+${e.dailyRewardCoins} coins`:`Already claimed`}</strong></div>
            <div><span>Next reward</span><strong>Day ${t}</strong></div>
            <div><span>Streak bonus</span><strong>+${Math.min(e.profile.dailyStreak.streakCount,7)*5}% coins</strong></div>
          </div>
        </aside>
      `}return e.menuDrawer===`account`?`
        <aside class="drawer-panel glass-panel">
          <div class="drawer-head">
            <div>
              <span class="eyebrow">Account</span>
              <h2>Cloud Save Access</h2>
            </div>
            <button class="menu-button subtle" data-action="close-drawer" data-sound="navigation" data-sound-hover="1">Close</button>
          </div>
          ${this.renderAccountPanel(e.cloudSession,!1)}
        </aside>
      `:`
      <aside class="drawer-panel glass-panel">
        <div class="drawer-head">
          <div>
            <span class="eyebrow">Missions</span>
            <h2>Daily + Weekly Progress</h2>
          </div>
          <button class="menu-button subtle" data-action="close-drawer" data-sound="navigation" data-sound-hover="1">Close</button>
        </div>
        <div class="drawer-missions">
          ${e.profile.dailyMissions.map(e=>{let t=G(e.id);return`
                <div class="mission-row ${e.completed?`complete`:``}">
                  <div>
                    <strong>${t.name}</strong>
                    <span>${t.description}</span>
                  </div>
                  <strong>${Math.min(e.progress,t.target)}/${t.target}</strong>
                </div>
              `}).join(``)}
          ${e.profile.weeklyMissions.map(e=>{let t=G(e.id);return`
                <div class="mission-row ${e.completed?`complete`:``}">
                  <div>
                    <strong>${t.name}</strong>
                    <span>${t.description}</span>
                  </div>
                  <strong>${Math.min(e.progress,t.target)}/${t.target}</strong>
                </div>
              `}).join(``)}
        </div>
      </aside>
    `}renderRewardShell(e){return`
      <div class="reward-shell glass-panel" data-outcome="${e.outcome}">
        <div class="reward-header">
          <div>
            <span class="eyebrow">Post Match</span>
            <h1>${e.outcome===`win`?`Victory Logged`:`Defeat Logged`}</h1>
            <p>${e.challengeTier.name} tier | ${e.rankAfter.name} rank | ${e.analytics.modeId===`survival`?`Survival ${e.analytics.roundWins}/5`:`Rounds ${e.analytics.roundWins}-${e.analytics.roundLosses}`} | quick replay is one click away.</p>
          </div>
          <div class="results-actions">
            <div class="theme-toggle" role="group" aria-label="Theme">
              ${this.renderThemeButton(this.metaView?.profile.themeMode??`dark`,`dark`,`Dark`)}
              ${this.renderThemeButton(this.metaView?.profile.themeMode??`dark`,`light`,`Light`)}
            </div>
            <div class="theme-toggle" role="group" aria-label="Visual Mode">
              ${this.renderPresentationButton(this.metaView?.profile.presentationMode??`2_5d`,`2_5d`,`2.5D`)}
              ${this.renderPresentationButton(this.metaView?.profile.presentationMode??`2_5d`,`2d`,`2D`)}
            </div>
            <button class="menu-button primary" data-action="play-again" data-sound="reward" data-sound-hover="1">Play Again</button>
            <button class="menu-button" data-action="open-upgrades" data-sound="navigation" data-sound-hover="1">Upgrade</button>
            <button class="menu-button" data-action="back-to-profile" data-sound="navigation" data-sound-hover="1">Back To Profile</button>
            <button class="menu-button subtle" data-action="back-to-hub" data-sound="navigation" data-sound-hover="1">Back To Hub</button>
          </div>
        </div>
        <div class="reward-grid">
          <section class="reward-card accent">
            <span class="eyebrow">Coins</span>
            <strong id="reward-coins-value">0</strong>
            <div class="reward-sublist">
              ${e.rewards.bonusCoins.map(e=>`<span class="reward-bonus hidden" data-bonus-line>${e.label} +${e.amount}</span>`).join(``)}
            </div>
          </section>
          <section class="reward-card accent">
            <span class="eyebrow">XP</span>
            <strong id="reward-xp-value">0</strong>
            <div class="progress-line">
              <span>Level ${e.levelBefore} to ${e.levelAfter}</span>
              <div class="line-track"><div id="reward-level-fill" class="line-fill"></div></div>
              <strong>${e.rankAfter.name}</strong>
            </div>
          </section>
          <section class="reward-card">
            <span class="eyebrow">Mission Progress</span>
            <div class="reward-sublist">
              ${e.missionsCompleted.length>0?e.missionsCompleted.map(e=>`<span>${e.mission.name} +${e.rewardCoins}c / +${e.rewardXp}xp</span>`).join(``):`<span>No mission payout this round.</span>`}
            </div>
          </section>
          <section class="reward-card">
            <span class="eyebrow">Unlocks</span>
            <div class="unlock-list">
              ${this.renderRewardUnlocks(e)}
            </div>
          </section>
          <section class="reward-card">
            <span class="eyebrow">Mastery</span>
            <div class="reward-sublist">
              ${e.masteryProgress.map(e=>`<span>${e.weapon.toUpperCase()} +${e.xpGained} XP | Lv ${e.levelAfter}</span>`).join(``)}
            </div>
          </section>
          <section class="reward-card">
            <span class="eyebrow">Bonuses</span>
            <div class="reward-sublist">
              <span>Base coins ${e.rewards.baseCoins}</span>
              <span>Tier multiplier ${e.rewards.challengeMultiplier.toFixed(2)}x</span>
              <span>Streak multiplier ${e.rewards.streakMultiplier.toFixed(2)}x</span>
              <span>Base XP ${e.rewards.baseXp}</span>
            </div>
          </section>
          <section class="reward-card">
            <span class="eyebrow">Combat Analytics</span>
            <div class="reward-sublist">
              <span>Hit confirm ${(e.analytics.hitConfirmRate*100).toFixed(0)}%</span>
              <span>Cancels ${e.analytics.cancelCount}</span>
              <span>Dropped inputs ${e.analytics.droppedInputs}</span>
              <span>Reload efficiency ${e.analytics.reloadEfficiency.toFixed(1)}</span>
              <span>AI counters ${e.analytics.aiCountersTriggered}</span>
              <span>Opponent ${e.analytics.opponentVariantId.replace(/_/g,` `)}</span>
              <span>Stage ${e.analytics.stageVariantId.replace(/_/g,` `)}</span>
              <span>Visual mode ${e.analytics.presentationMode===`2d`?`2D`:`2.5D`}</span>
            </div>
          </section>
        </div>
      </div>
    `}renderRewardUnlocks(e){let t=[...e.achievementsUnlocked.map(e=>e.name),...e.skinsUnlocked.map(e=>`Skin: ${e.name}`),...e.titlesUnlocked.map(e=>`Title: ${e.name}`),...e.challengeTiersUnlocked.map(e=>`Tier: ${e.name}`)];return t.length>0?t.map(e=>`<span class="unlock-chip">${e}</span>`).join(``):`<span class="unlock-chip muted">No new unlocks this run</span>`}updateRewardAnimation(){if(!this.metaView?.summary)return;let e=this.metaView.summary,t=document.getElementById(`reward-coins-value`),n=document.getElementById(`reward-xp-value`),r=document.getElementById(`reward-level-fill`);if(!t||!n||!r)return;let i=this.rewardAnimation.time,a=Math.max(0,Math.min(1,i/.75)),o=Math.max(0,Math.min(1,(i-.45)/.85)),s=Math.max(0,Math.min(1,(i-.65)/.9));t.textContent=this.formatNumber(Math.round(e.rewards.totalCoins*a)),n.textContent=this.formatNumber(Math.round(e.rewards.totalXp*o)),r.style.width=`${Math.round(s*100)}%`,document.querySelectorAll(`[data-bonus-line]`).forEach((e,t)=>{e.classList.toggle(`hidden`,i<.7+t*.12)}),!this.rewardAnimation.coinsPlayed&&i>=.2&&(this.rewardAnimation.coinsPlayed=!0,this.uiAudio.play(`reward`)),!this.rewardAnimation.xpPlayed&&i>=.65&&(this.rewardAnimation.xpPlayed=!0,this.uiAudio.play(`confirm`)),!this.rewardAnimation.bonusPlayed&&i>=1.05&&(this.rewardAnimation.bonusPlayed=!0,this.uiAudio.play(`navigation`)),i>1.8&&(this.rewardAnimation.active=!1)}getCompletedMissionCount(e){return[...e.dailyMissions,...e.weeklyMissions].filter(e=>e.completed).length}readAccountCredentials(e){let t=e.closest(`[data-auth-scope="account"]`);if(!t)return null;let n=t.querySelector(`input[name="account-email"]`),r=t.querySelector(`input[name="account-password"]`),i=n?.value.trim()??``,a=r?.value??``;return!i||!a?null:{email:i,password:a}}readDataset(e,t,n){return e.dataset[t]??n}renderAccountPanel(e,t){let n=this.getCloudStatusCopy(e);return`
      <div class="account-panel" data-auth-scope="account">
        <div class="stats-stack">
          <div><span>Status</span><strong>${e.authMode===`google`?`Google linked`:e.authMode===`email`?`Email linked`:`Guest session`}</strong></div>
          <div><span>Sync</span><strong>${n}</strong></div>
          <div><span>UID</span><strong>${this.formatUid(e.userId)}</strong></div>
          ${e.email?`<div><span>Email</span><strong>${e.email}</strong></div>`:``}
        </div>
        <p class="account-copy">
          ${e.isLinked?`This account will recover progress from the cloud and no longer depends on a persistent local browser save.`:`Guest play stays in this browser session only. Link Google or email to secure progress in the cloud.`}
        </p>
        ${e.isLinked?`
              <div class="card-actions">
                <button class="menu-button subtle" data-action="logout-user" data-sound="navigation" data-sound-hover="1">Log Out</button>
              </div>
            `:`
              <div class="auth-fields">
                <label class="auth-field">
                  <span>Email</span>
                  <input class="auth-input" type="email" name="account-email" placeholder="pilot@arena.com" autocomplete="email" />
                </label>
                <label class="auth-field">
                  <span>Password</span>
                  <input class="auth-input" type="password" name="account-password" placeholder="Create a password" autocomplete="${t?`current-password`:`new-password`}" />
                </label>
              </div>
              <div class="card-actions auth-actions">
                <button class="menu-button" data-action="continue-guest" data-sound="navigation" data-sound-hover="1">Continue As Guest</button>
                <button class="menu-button" data-action="login-google" data-sound="confirm" data-sound-hover="1">Sign In With Google</button>
                <button class="menu-button" data-action="login-email-signin" data-sound="confirm" data-sound-hover="1">Log In</button>
                <button class="menu-button primary" data-action="login-email-register" data-sound="purchase" data-sound-hover="1">Create Account</button>
              </div>
            `}
      </div>
    `}getCloudStatusLabel(e){return e.syncStatus===`syncing`||e.syncStatus===`signing_in`?`Syncing`:e.syncStatus===`offline`?`Offline fallback`:e.syncStatus===`error`?`Sync issue`:e.isLinked?`Cloud secured`:`Guest mode`}getCloudStatusCopy(e){if(e.lastSyncError)return e.lastSyncError;switch(e.syncStatus){case`syncing`:case`signing_in`:return`Syncing in background`;case`offline`:return`Offline fallback active`;case`error`:return`Cloud unavailable, local save still active`;case`synced`:return e.isLinked?`Cloud synced`:`Guest session only`;default:return e.isLinked?`Cloud ready`:`Session-only guest mode`}}formatUid(e){return e?e.length<=12?e:`${e.slice(0,6)}...${e.slice(-4)}`:`Pending`}renderThemeButton(e,t,n){return`
      <button
        class="theme-button ${e===t?`active`:``}"
        data-action="set-theme"
        data-theme="${t}"
        data-sound="navigation"
        data-sound-hover="1"
        type="button"
      >
        ${n}
      </button>
    `}renderPresentationButton(e,t,n){return`
      <button
        class="theme-button ${e===t?`active`:``}"
        data-action="set-presentation"
        data-mode="${t}"
        data-sound="navigation"
        data-sound-hover="1"
        type="button"
      >
        ${n}
      </button>
    `}getNextUpgradeText(e,t){let n=t+1;switch(e){case`ferocity`:return`Next damage bonus ${n*4}%`;case`tempo`:return`Next attack speed ${n*2}%`;case`breaker`:return`Next hit stun ${n*5}%`;case`vitality`:return`Next max health +${n*6}`;case`guard`:return`Next damage reduction ${n*3}%`;case`hazard_ward`:return`Next guard pressure resist ${n*6}%`;case`rage_flow`:return`Next rage gain ${n*6}%`;case`shock_core`:return`Next shockwave bonus ${n*6}%`;case`finisher_sense`:return`Next finisher window +${(n*.15).toFixed(2)}s`;default:return`Next rank ${n}`}}focusPrimaryAction(e,t){window.requestAnimationFrame(()=>{e.querySelector(t)?.focus()})}formatNumber(e){return new Intl.NumberFormat(`en-US`).format(e)}};export{Se as A,ye as C,Oe as D,ve as E,we as F,Ce as M,ke as N,De as O,xe as P,k as S,_e as T,A as _,ue as a,fe as b,H as c,V as d,de as f,me as g,ge as h,oe as i,le as j,be as k,je as l,Ee as m,Ne as n,N as o,se as p,U as r,B as s,rt as t,W as u,ce as v,Ae as w,he as x,Te as y};