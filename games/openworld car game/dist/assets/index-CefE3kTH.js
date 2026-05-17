(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=1e3,t=1001,n=1002,r=1003,i=1004,a=1005,o=1006,s=1007,c=1008,l=1009,u=1010,d=1011,f=1012,p=1013,m=1014,h=1015,g=1016,_=1017,v=1018,y=1020,b=35902,x=35899,S=1021,C=1022,w=1023,T=1026,E=1027,D=1028,ee=1029,O=1030,k=1031,te=1033,A=33776,j=33777,ne=33778,M=33779,N=35840,re=35841,ie=35842,ae=35843,oe=36196,P=37492,se=37496,ce=37488,F=37489,le=37490,ue=37491,de=37808,fe=37809,pe=37810,me=37811,he=37812,ge=37813,_e=37814,ve=37815,ye=37816,be=37817,xe=37818,Se=37819,Ce=37820,we=37821,Te=36492,Ee=36494,De=36495,Oe=36283,ke=36284,I=36285,Ae=36286,je=2300,Me=2301,L=2302,Ne=2303,R=2400,z=2401,Pe=2402,Fe=3200,Ie=`srgb`,Le=`srgb-linear`,Re=`linear`,ze=`srgb`,Be=7680,Ve=35044,He=2e3;function Ue(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function We(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Ge(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Ke(){let e=Ge(`canvas`);return e.style.display=`block`,e}var qe={},Je=null;function Ye(...e){let t=`THREE.`+e.shift();Je?Je(`log`,t,...e):console.log(t,...e)}function Xe(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function B(...e){e=Xe(e);let t=`THREE.`+e.shift();if(Je)Je(`warn`,t,...e);else{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function V(...e){e=Xe(e);let t=`THREE.`+e.shift();if(Je)Je(`error`,t,...e);else{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Ze(...e){let t=e.join(` `);t in qe||(qe[t]=!0,B(...e))}function Qe(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var $e={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},et=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},tt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),nt=1234567,rt=Math.PI/180,it=180/Math.PI;function at(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(tt[e&255]+tt[e>>8&255]+tt[e>>16&255]+tt[e>>24&255]+`-`+tt[t&255]+tt[t>>8&255]+`-`+tt[t>>16&15|64]+tt[t>>24&255]+`-`+tt[n&63|128]+tt[n>>8&255]+`-`+tt[n>>16&255]+tt[n>>24&255]+tt[r&255]+tt[r>>8&255]+tt[r>>16&255]+tt[r>>24&255]).toLowerCase()}function H(e,t,n){return Math.max(t,Math.min(n,e))}function ot(e,t){return(e%t+t)%t}function st(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ct(e,t,n){return e===t?0:(n-e)/(t-e)}function lt(e,t,n){return(1-n)*e+n*t}function ut(e,t,n,r){return lt(e,t,1-Math.exp(-n*r))}function dt(e,t=1){return t-Math.abs(ot(e,t*2)-t)}function ft(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function pt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function mt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function ht(e,t){return e+Math.random()*(t-e)}function gt(e){return e*(.5-Math.random())}function _t(e){e!==void 0&&(nt=e);let t=nt+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function vt(e){return e*rt}function yt(e){return e*it}function bt(e){return(e&e-1)==0&&e!==0}function xt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function St(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Ct(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:B(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function wt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`Invalid component type.`)}}function Tt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`Invalid component type.`)}}var Et={DEG2RAD:rt,RAD2DEG:it,generateUUID:at,clamp:H,euclideanModulo:ot,mapLinear:st,inverseLerp:ct,lerp:lt,damp:ut,pingpong:dt,smoothstep:ft,smootherstep:pt,randInt:mt,randFloat:ht,randFloatSpread:gt,seededRandom:_t,degToRad:vt,radToDeg:yt,isPowerOfTwo:bt,ceilPowerOfTwo:xt,floorPowerOfTwo:St,setQuaternionFromProperEuler:Ct,normalize:Tt,denormalize:wt},U=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(H(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Dt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:B(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(H(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},W=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(kt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(kt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this.z=H(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this.z=H(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ot.copy(this).projectOnVector(e),this.sub(Ot)}reflect(e){return this.sub(Ot.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(H(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ot=new W,kt=new Dt,G=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(At.makeScale(e,t)),this}rotate(e){return this.premultiply(At.makeRotation(-e)),this}translate(e,t){return this.premultiply(At.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},At=new G,jt=new G().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Mt=new G().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Nt(){let e={enabled:!0,workingColorSpace:Le,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Pt(e.r),e.g=Pt(e.g),e.b=Pt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Ft(e.r),e.g=Ft(e.g),e.b=Ft(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Re:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Ze(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Ze(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Le]:{primaries:t,whitePoint:r,transfer:Re,toXYZ:jt,fromXYZ:Mt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ie},outputColorSpaceConfig:{drawingBufferColorSpace:Ie}},[Ie]:{primaries:t,whitePoint:r,transfer:ze,toXYZ:jt,fromXYZ:Mt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ie}}}),e}var K=Nt();function Pt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Ft(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var It,Lt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{It===void 0&&(It=Ge(`canvas`)),It.width=e.width,It.height=e.height;let t=It.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=It}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Ge(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Pt(i[e]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Pt(t[e]/255)*255):t[e]=Pt(t[e]);return{data:t,width:e.width,height:e.height}}else return B(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Rt=0,zt=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,`id`,{value:Rt++}),this.uuid=at(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Bt(r[t].image)):e.push(Bt(r[t]))}else e=Bt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Bt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Lt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(B(`Texture: Unable to serialize Texture.`),{})}var Vt=0,Ht=new W,Ut=class r extends et{constructor(e=r.DEFAULT_IMAGE,n=r.DEFAULT_MAPPING,i=t,a=t,s=o,u=c,d=w,f=l,p=r.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,`id`,{value:Vt++}),this.uuid=at(),this.name=``,this.source=new zt(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=u,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=f,this.offset=new U(0,0),this.repeat=new U(1,1),this.center=new U(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new G,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ht).x}get height(){return this.source.getSize(Ht).y}get depth(){return this.source.getSize(Ht).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){B(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){B(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(r){if(this.mapping!==300)return r;if(r.applyMatrix3(this.matrix),r.x<0||r.x>1)switch(this.wrapS){case e:r.x-=Math.floor(r.x);break;case t:r.x=r.x<0?0:1;break;case n:Math.abs(Math.floor(r.x)%2)===1?r.x=Math.ceil(r.x)-r.x:r.x-=Math.floor(r.x);break}if(r.y<0||r.y>1)switch(this.wrapT){case e:r.y-=Math.floor(r.y);break;case t:r.y=r.y<0?0:1;break;case n:Math.abs(Math.floor(r.y)%2)===1?r.y=Math.ceil(r.y)-r.y:r.y-=Math.floor(r.y);break}return this.flipY&&(r.y=1-r.y),r}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ut.DEFAULT_IMAGE=null,Ut.DEFAULT_MAPPING=300,Ut.DEFAULT_ANISOTROPY=1;var Wt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this.z=H(this.z,e.z,t.z),this.w=H(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this.z=H(this.z,e,t),this.w=H(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Gt=class extends et{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:o,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Wt(0,0,e,t),this.scissorTest=!1,this.viewport=new Wt(0,0,e,t),this.textures=[];let r=new Ut({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:o,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new zt(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:`dispose`})}},Kt=class extends Gt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},qt=class extends Ut{constructor(e=null,n=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Jt=class extends Ut{constructor(e=null,n=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Yt=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Xt.setFromMatrixColumn(e,0).length(),i=1/Xt.setFromMatrixColumn(e,1).length(),a=1/Xt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Qt,e,$t)}lookAt(e,t,n){let r=this.elements;return nn.subVectors(e,t),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),en.crossVectors(n,nn),en.lengthSq()===0&&(Math.abs(n.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),en.crossVectors(n,nn)),en.normalize(),tn.crossVectors(nn,en),r[0]=en.x,r[4]=tn.x,r[8]=nn.x,r[1]=en.y,r[5]=tn.y,r[9]=nn.y,r[2]=en.z,r[6]=tn.z,r[10]=nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],ee=r[13],O=r[2],k=r[6],te=r[10],A=r[14],j=r[3],ne=r[7],M=r[11],N=r[15];return i[0]=a*x+o*T+s*O+c*j,i[4]=a*S+o*E+s*k+c*ne,i[8]=a*C+o*D+s*te+c*M,i[12]=a*w+o*ee+s*A+c*N,i[1]=l*x+u*T+d*O+f*j,i[5]=l*S+u*E+d*k+f*ne,i[9]=l*C+u*D+d*te+f*M,i[13]=l*w+u*ee+d*A+f*N,i[2]=p*x+m*T+h*O+g*j,i[6]=p*S+m*E+h*k+g*ne,i[10]=p*C+m*D+h*te+g*M,i[14]=p*w+m*ee+h*A+g*N,i[3]=_*x+v*T+y*O+b*j,i[7]=_*S+v*E+y*k+b*ne,i[11]=_*C+v*D+y*te+b*M,i[15]=_*w+v*ee+y*A+b*N,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,ee=d*g-f*h,O=_*ee-v*D+y*E+b*T-x*w+S*C;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/O;return e[0]=(o*ee-s*D+c*E)*k,e[1]=(r*D-n*ee-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*ee-c*w)*k,e[5]=(t*ee-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinant();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Xt.set(r[0],r[1],r[2]).length(),o=Xt.set(r[4],r[5],r[6]).length(),s=Xt.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Zt.copy(this);let c=1/a,l=1/o,u=1/s;return Zt.elements[0]*=c,Zt.elements[1]*=c,Zt.elements[2]*=c,Zt.elements[4]*=l,Zt.elements[5]*=l,Zt.elements[6]*=l,Zt.elements[8]*=u,Zt.elements[9]*=u,Zt.elements[10]*=u,t.setFromRotationMatrix(Zt),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=He,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=He,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Xt=new W,Zt=new Yt,Qt=new W(0,0,0),$t=new W(1,1,1),en=new W,tn=new W,nn=new W,rn=new Yt,an=new Dt,on=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(H(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-H(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(H(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-H(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(H(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-H(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:B(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return rn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return an.setFromEuler(this),this.setFromQuaternion(an,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};on.DEFAULT_ORDER=`XYZ`;var sn=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!=0}},cn=0,ln=new W,un=new Dt,dn=new Yt,fn=new W,pn=new W,mn=new W,hn=new Dt,gn=new W(1,0,0),_n=new W(0,1,0),vn=new W(0,0,1),yn={type:`added`},bn={type:`removed`},xn={type:`childadded`,child:null},Sn={type:`childremoved`,child:null},Cn=class e extends et{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,`id`,{value:cn++}),this.uuid=at(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new W,n=new on,r=new Dt,i=new W(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Yt},normalMatrix:{value:new G}}),this.matrix=new Yt,this.matrixWorld=new Yt,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new sn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return un.setFromAxisAngle(e,t),this.quaternion.multiply(un),this}rotateOnWorldAxis(e,t){return un.setFromAxisAngle(e,t),this.quaternion.premultiply(un),this}rotateX(e){return this.rotateOnAxis(gn,e)}rotateY(e){return this.rotateOnAxis(_n,e)}rotateZ(e){return this.rotateOnAxis(vn,e)}translateOnAxis(e,t){return ln.copy(e).applyQuaternion(this.quaternion),this.position.add(ln.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(gn,e)}translateY(e){return this.translateOnAxis(_n,e)}translateZ(e){return this.translateOnAxis(vn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?fn.copy(e):fn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),pn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(pn,fn,this.up):dn.lookAt(fn,pn,this.up),this.quaternion.setFromRotationMatrix(dn),r&&(dn.extractRotation(r.matrixWorld),un.setFromRotationMatrix(dn),this.quaternion.premultiply(un.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(V(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yn),xn.child=e,this.dispatchEvent(xn),xn.child=null):V(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bn),Sn.child=e,this.dispatchEvent(Sn),Sn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yn),xn.child=e,this.dispatchEvent(xn),xn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pn,e,mn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pn,hn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let e=this.children;for(let t=0,n=e.length;t<n;t++)e[t].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material);if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};Cn.DEFAULT_UP=new W(0,1,0),Cn.DEFAULT_MATRIX_AUTO_UPDATE=!0,Cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var wn=class extends Cn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Tn={type:`move`},En=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position),s=.02,l=.005;c.inputState.pinching&&o>s+l?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=s-l&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Tn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new wn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Dn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},On={h:0,s:0,l:0},kn={h:0,s:0,l:0};function An(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var q=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ie){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,K.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=K.workingColorSpace){return this.r=e,this.g=t,this.b=n,K.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=K.workingColorSpace){if(e=ot(e,1),t=H(t,0,1),n=H(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=An(i,r,e+1/3),this.g=An(i,r,e),this.b=An(i,r,e-1/3)}return K.colorSpaceToWorking(this,r),this}setStyle(e,t=Ie){function n(t){t!==void 0&&parseFloat(t)<1&&B(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:B(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);B(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ie){let n=Dn[e.toLowerCase()];return n===void 0?B(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Pt(e.r),this.g=Pt(e.g),this.b=Pt(e.b),this}copyLinearToSRGB(e){return this.r=Ft(e.r),this.g=Ft(e.g),this.b=Ft(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ie){return K.workingToColorSpace(jn.copy(this),e),Math.round(H(jn.r*255,0,255))*65536+Math.round(H(jn.g*255,0,255))*256+Math.round(H(jn.b*255,0,255))}getHexString(e=Ie){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=K.workingColorSpace){K.workingToColorSpace(jn.copy(this),t);let n=jn.r,r=jn.g,i=jn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4;break}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=K.workingColorSpace){return K.workingToColorSpace(jn.copy(this),t),e.r=jn.r,e.g=jn.g,e.b=jn.b,e}getStyle(e=Ie){K.workingToColorSpace(jn.copy(this),e);let t=jn.r,n=jn.g,r=jn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(On),this.setHSL(On.h+e,On.s+t,On.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(On),e.getHSL(kn);let n=lt(On.h,kn.h,t),r=lt(On.s,kn.s,t),i=lt(On.l,kn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},jn=new q;q.NAMES=Dn;var Mn=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new q(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Nn=class extends Cn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Pn=new W,Fn=new W,In=new W,Ln=new W,Rn=new W,zn=new W,Bn=new W,Vn=new W,Hn=new W,Un=new W,Wn=new Wt,Gn=new Wt,Kn=new Wt,qn=class e{constructor(e=new W,t=new W,n=new W){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Pn.subVectors(e,t),r.cross(Pn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Pn.subVectors(r,t),Fn.subVectors(n,t),In.subVectors(e,t);let a=Pn.dot(Pn),o=Pn.dot(Fn),s=Pn.dot(In),c=Fn.dot(Fn),l=Fn.dot(In),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Ln)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Ln.x),s.addScaledVector(a,Ln.y),s.addScaledVector(o,Ln.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Wn.setScalar(0),Gn.setScalar(0),Kn.setScalar(0),Wn.fromBufferAttribute(e,t),Gn.fromBufferAttribute(e,n),Kn.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Wn,i.x),a.addScaledVector(Gn,i.y),a.addScaledVector(Kn,i.z),a}static isFrontFacing(e,t,n,r){return Pn.subVectors(n,t),Fn.subVectors(e,t),Pn.cross(Fn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Pn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),Pn.cross(Fn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Rn.subVectors(r,n),zn.subVectors(i,n),Vn.subVectors(e,n);let s=Rn.dot(Vn),c=zn.dot(Vn);if(s<=0&&c<=0)return t.copy(n);Hn.subVectors(e,r);let l=Rn.dot(Hn),u=zn.dot(Hn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Rn,a);Un.subVectors(e,i);let f=Rn.dot(Un),p=zn.dot(Un);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(zn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Bn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Bn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Rn,a).addScaledVector(zn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Jn=class{constructor(e=new W(1/0,1/0,1/0),t=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Xn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Xn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Xn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Xn):Xn.fromBufferAttribute(r,t),Xn.applyMatrix4(e.matrixWorld),this.expandByPoint(Xn);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Zn.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Zn.copy(e.boundingBox)),Zn.applyMatrix4(e.matrixWorld),this.union(Zn)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Xn),Xn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ir),ar.subVectors(this.max,ir),Qn.subVectors(e.a,ir),$n.subVectors(e.b,ir),er.subVectors(e.c,ir),tr.subVectors($n,Qn),nr.subVectors(er,$n),rr.subVectors(Qn,er);let t=[0,-tr.z,tr.y,0,-nr.z,nr.y,0,-rr.z,rr.y,tr.z,0,-tr.x,nr.z,0,-nr.x,rr.z,0,-rr.x,-tr.y,tr.x,0,-nr.y,nr.x,0,-rr.y,rr.x,0];return!cr(t,Qn,$n,er,ar)||(t=[1,0,0,0,1,0,0,0,1],!cr(t,Qn,$n,er,ar))?!1:(or.crossVectors(tr,nr),t=[or.x,or.y,or.z],cr(t,Qn,$n,er,ar))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Xn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Xn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Yn=[new W,new W,new W,new W,new W,new W,new W,new W],Xn=new W,Zn=new Jn,Qn=new W,$n=new W,er=new W,tr=new W,nr=new W,rr=new W,ir=new W,ar=new W,or=new W,sr=new W;function cr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){sr.fromArray(e,a);let o=i.x*Math.abs(sr.x)+i.y*Math.abs(sr.y)+i.z*Math.abs(sr.z),s=t.dot(sr),c=n.dot(sr),l=r.dot(sr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var lr=new W,ur=new U,dr=0,fr=class extends et{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,`id`,{value:dr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Ve,this.updateRanges=[],this.gpuType=h,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ur.fromBufferAttribute(this,t),ur.applyMatrix3(e),this.setXY(t,ur.x,ur.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)lr.fromBufferAttribute(this,t),lr.applyMatrix3(e),this.setXYZ(t,lr.x,lr.y,lr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)lr.fromBufferAttribute(this,t),lr.applyMatrix4(e),this.setXYZ(t,lr.x,lr.y,lr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)lr.fromBufferAttribute(this,t),lr.applyNormalMatrix(e),this.setXYZ(t,lr.x,lr.y,lr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)lr.fromBufferAttribute(this,t),lr.transformDirection(e),this.setXYZ(t,lr.x,lr.y,lr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=wt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Tt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=wt(t,this.array)),t}setX(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=wt(t,this.array)),t}setY(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=wt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=wt(t,this.array)),t}setW(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array),r=Tt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array),r=Tt(r,this.array),i=Tt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:`dispose`})}},pr=class extends fr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},mr=class extends fr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},hr=class extends fr{constructor(e,t,n){super(new Float32Array(e),t,n)}},gr=new Jn,_r=new W,vr=new W,yr=class{constructor(e=new W,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?gr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;_r.subVectors(e,this.center);let t=_r.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(_r,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(vr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(_r.copy(e.center).add(vr)),this.expandByPoint(_r.copy(e.center).sub(vr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},br=0,xr=new Yt,Sr=new Cn,Cr=new W,wr=new Jn,Tr=new Jn,Er=new W,Dr=class e extends et{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,`id`,{value:br++}),this.uuid=at(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ue(e)?mr:pr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new G().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return xr.makeRotationFromQuaternion(e),this.applyMatrix4(xr),this}rotateX(e){return xr.makeRotationX(e),this.applyMatrix4(xr),this}rotateY(e){return xr.makeRotationY(e),this.applyMatrix4(xr),this}rotateZ(e){return xr.makeRotationZ(e),this.applyMatrix4(xr),this}translate(e,t,n){return xr.makeTranslation(e,t,n),this.applyMatrix4(xr),this}scale(e,t,n){return xr.makeScale(e,t,n),this.applyMatrix4(xr),this}lookAt(e){return Sr.lookAt(e),Sr.updateMatrix(),this.applyMatrix4(Sr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Cr).negate(),this.translate(Cr.x,Cr.y,Cr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new hr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&B(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Jn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){V(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];wr.setFromBufferAttribute(n),this.morphTargetsRelative?(Er.addVectors(this.boundingBox.min,wr.min),this.boundingBox.expandByPoint(Er),Er.addVectors(this.boundingBox.max,wr.max),this.boundingBox.expandByPoint(Er)):(this.boundingBox.expandByPoint(wr.min),this.boundingBox.expandByPoint(wr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&V(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){V(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new W,1/0);return}if(e){let n=this.boundingSphere.center;if(wr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Tr.setFromBufferAttribute(n),this.morphTargetsRelative?(Er.addVectors(wr.min,Tr.min),wr.expandByPoint(Er),Er.addVectors(wr.max,Tr.max),wr.expandByPoint(Er)):(wr.expandByPoint(Tr.min),wr.expandByPoint(Tr.max))}wr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Er.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Er));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Er.fromBufferAttribute(a,t),o&&(Cr.fromBufferAttribute(e,t),Er.add(Cr)),r=Math.max(r,n.distanceToSquared(Er))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&V(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){V(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv;this.hasAttribute(`tangent`)===!1&&this.setAttribute(`tangent`,new fr(new Float32Array(4*n.count),4));let a=this.getAttribute(`tangent`),o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new W,s[e]=new W;let c=new W,l=new W,u=new W,d=new U,f=new U,p=new U,m=new W,h=new W;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new W,y=new W,b=new W,x=new W;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0)n=new fr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new W,i=new W,a=new W,o=new W,s=new W,c=new W,l=new W,u=new W;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Er.fromBufferAttribute(e,t),Er.normalize(),e.setXYZ(t,Er.x,Er.y,Er.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new fr(a,r,i)}if(this.index===null)return B(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:`dispose`})}},Or=0,kr=class extends et{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,`id`,{value:Or++}),this.uuid=at(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new q(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Be,this.stencilZFail=Be,this.stencilZPass=Be,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){B(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){B(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Ar=new W,jr=new W,Mr=new W,Nr=new W,Pr=new W,Fr=new W,Ir=new W,Lr=class{constructor(e=new W,t=new W(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ar)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ar.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ar.copy(this.origin).addScaledVector(this.direction,t),Ar.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){jr.copy(e).add(t).multiplyScalar(.5),Mr.copy(t).sub(e).normalize(),Nr.copy(this.origin).sub(jr);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Mr),o=Nr.dot(this.direction),s=-Nr.dot(Mr),c=Nr.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0)if(u=a*s-o,d=a*o-s,p=i*l,u>=0)if(d>=-p)if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c);else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(jr).addScaledVector(Mr,d),f}intersectSphere(e,t){Ar.subVectors(e.center,this.origin);let n=Ar.dot(this.direction),r=Ar.dot(Ar)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Ar)!==null}intersectTriangle(e,t,n,r,i){Pr.subVectors(t,e),Fr.subVectors(n,e),Ir.crossVectors(Pr,Fr);let a=this.direction.dot(Ir),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Nr.subVectors(this.origin,e);let s=o*this.direction.dot(Fr.crossVectors(Nr,Fr));if(s<0)return null;let c=o*this.direction.dot(Pr.cross(Nr));if(c<0||s+c>a)return null;let l=-o*Nr.dot(Ir);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Rr=class extends kr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},zr=new Yt,Br=new Lr,Vr=new yr,Hr=new W,Ur=new W,Wr=new W,Gr=new W,Kr=new W,qr=new W,Jr=new W,Yr=new W,J=class extends Cn{constructor(e=new Dr,t=new Rr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){qr.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Kr.fromBufferAttribute(s,e),a?qr.addScaledVector(Kr,r):qr.addScaledVector(Kr.sub(t),r))}t.add(qr)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Vr.copy(n.boundingSphere),Vr.applyMatrix4(i),Br.copy(e.ray).recast(e.near),!(Vr.containsPoint(Br.origin)===!1&&(Br.intersectSphere(Vr,Hr)===null||Br.origin.distanceToSquared(Hr)>(e.far-e.near)**2))&&(zr.copy(i).invert(),Br.copy(e.ray).applyMatrix4(zr),!(n.boundingBox!==null&&Br.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Br)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null)if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Zr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Zr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}else if(s!==void 0)if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Zr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Zr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}};function Xr(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Yr.copy(s),Yr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Yr);return l<n.near||l>n.far?null:{distance:l,point:Yr.clone(),object:e}}function Zr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Ur),e.getVertexPosition(c,Wr),e.getVertexPosition(l,Gr);let u=Xr(e,t,n,r,Ur,Wr,Gr,Jr);if(u){let e=new W;qn.getBarycoord(Jr,Ur,Wr,Gr,e),i&&(u.uv=qn.getInterpolatedAttribute(i,s,c,l,e,new U)),a&&(u.uv1=qn.getInterpolatedAttribute(a,s,c,l,e,new U)),o&&(u.normal=qn.getInterpolatedAttribute(o,s,c,l,e,new W),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new W,materialIndex:0};qn.getNormal(Ur,Wr,Gr,t.normal),u.face=t,u.barycoord=e}return u}var Qr=class extends Ut{constructor(e=null,t=1,n=1,i,a,o,s,c,l=r,u=r,d,f){super(null,o,s,c,l,u,i,a,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},$r=new W,ei=new W,ti=new G,ni=class{constructor(e=new W(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=$r.subVectors(n,t).cross(ei.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta($r),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ti.getNormalMatrix(e),r=this.coplanarPoint($r).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ri=new yr,ii=new U(.5,.5),ai=new W,oi=class{constructor(e=new ni,t=new ni,n=new ni,r=new ni,i=new ni,a=new ni){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=He,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(e){return ri.center.set(0,0,0),ri.radius=.7071067811865476+ii.distanceTo(e.center),ri.applyMatrix4(e.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(ai.x=r.normal.x>0?e.max.x:e.min.x,ai.y=r.normal.y>0?e.max.y:e.min.y,ai.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ai)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},si=class extends Ut{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ci=class extends Ut{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},li=class extends Ut{constructor(e,t,n=m,i,a,o,s=r,c=r,l,u=T,d=1){if(u!==1026&&u!==1027)throw Error(`DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},i,a,o,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new zt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ui=class extends li{constructor(e,t=m,n=301,i,a,o=r,s=r,c,l=T){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,i,a,o,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},di=class extends Ut{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Y=class e extends Dr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new hr(c,3)),this.setAttribute(`normal`,new hr(l,3)),this.setAttribute(`uv`,new hr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new W;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},fi=class e extends Dr{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new W,l=new U;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new hr(a,3)),this.setAttribute(`normal`,new hr(o,3)),this.setAttribute(`uv`,new hr(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},pi=class e extends Dr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new hr(u,3)),this.setAttribute(`normal`,new hr(d,3)),this.setAttribute(`uv`,new hr(f,2));function _(){let a=new W,_=new W,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new U,m=new W,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},mi=class e extends pi{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},hi=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){B(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new U:new W);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new W,r=[],i=[],a=[],o=new W,s=new Yt;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new W)}i[0]=new W,a[0]=new W;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(H(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(H(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},gi=class extends hi{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new U){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},_i=class extends gi{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function vi(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var yi=new W,bi=new W,xi=new vi,Si=new vi,Ci=new vi,wi=class extends hi{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new W){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(bi.subVectors(r[0],r[1]).add(r[0]),c=bi);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(yi.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=yi),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),xi.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Si.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Ci.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(xi.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Si.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Ci.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(xi.calc(s),Si.calc(s),Ci.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new W().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Ti(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function Ei(e,t){let n=1-e;return n*n*t}function Di(e,t){return 2*(1-e)*e*t}function Oi(e,t){return e*e*t}function ki(e,t,n,r){return Ei(e,t)+Di(e,n)+Oi(e,r)}function Ai(e,t){let n=1-e;return n*n*n*t}function ji(e,t){let n=1-e;return 3*n*n*e*t}function Mi(e,t){return 3*(1-e)*e*e*t}function Ni(e,t){return e*e*e*t}function Pi(e,t,n,r,i){return Ai(e,t)+ji(e,n)+Mi(e,r)+Ni(e,i)}var Fi=class extends hi{constructor(e=new U,t=new U,n=new U,r=new U){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new U){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Pi(e,r.x,i.x,a.x,o.x),Pi(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ii=class extends hi{constructor(e=new W,t=new W,n=new W,r=new W){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new W){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Pi(e,r.x,i.x,a.x,o.x),Pi(e,r.y,i.y,a.y,o.y),Pi(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Li=class extends hi{constructor(e=new U,t=new U){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new U){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ri=class extends hi{constructor(e=new W,t=new W){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new W){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new W){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},zi=class extends hi{constructor(e=new U,t=new U,n=new U){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new U){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ki(e,r.x,i.x,a.x),ki(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Bi=class extends hi{constructor(e=new W,t=new W,n=new W){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new W){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ki(e,r.x,i.x,a.x),ki(e,r.y,i.y,a.y),ki(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Vi=class extends hi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new U){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Ti(o,s.x,c.x,l.x,u.x),Ti(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new U().fromArray(n))}return this}},Hi=Object.freeze({__proto__:null,ArcCurve:_i,CatmullRomCurve3:wi,CubicBezierCurve:Fi,CubicBezierCurve3:Ii,EllipseCurve:gi,LineCurve:Li,LineCurve3:Ri,QuadraticBezierCurve:zi,QuadraticBezierCurve3:Bi,SplineCurve:Vi}),Ui=class extends hi{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new Hi[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new Hi[n.type]().fromJSON(n))}return this}},Wi=class extends Ui{constructor(e){super(),this.type=`Path`,this.currentPoint=new U,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Li(this.currentPoint.clone(),new U(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new zi(this.currentPoint.clone(),new U(e,t),new U(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new Fi(this.currentPoint.clone(),new U(e,t),new U(n,r),new U(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new Vi([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new gi(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Gi=class extends Wi{constructor(e){super(e),this.uuid=at(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new Wi().fromJSON(n))}return this}};function Ki(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=qi(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=ea(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return Yi(a,o,n,s,c,l,0),o}function qi(e,t,n,r,i){let a;if(i===wa(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=xa(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=xa(i/r|0,e[i],e[i+1],a);return a&&pa(a,a.next)&&(Sa(a),a=a.next),a}function Ji(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(pa(n,n.next)||fa(n.prev,n,n.next)===0)){if(Sa(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function Yi(e,t,n,r,i,a,o){if(!e)return;!o&&a&&aa(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?Zi(e,r,i,a):Xi(e)){t.push(c.i,e.i,l.i),Sa(e),e=l.next,s=l.next;continue}if(e=l,e===s){o?o===1?(e=Qi(Ji(e),t),Yi(e,t,n,r,i,a,2)):o===2&&$i(e,t,n,r,i,a):Yi(Ji(e),t,n,r,i,a,1);break}}}function Xi(e){let t=e.prev,n=e,r=e.next;if(fa(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&ua(i,s,a,c,o,l,m.x,m.y)&&fa(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Zi(e,t,n,r){let i=e.prev,a=e,o=e.next;if(fa(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=sa(p,m,t,n,r),v=sa(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&ua(s,u,c,d,l,f,y.x,y.y)&&fa(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&ua(s,u,c,d,l,f,b.x,b.y)&&fa(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&ua(s,u,c,d,l,f,y.x,y.y)&&fa(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&ua(s,u,c,d,l,f,b.x,b.y)&&fa(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Qi(e,t){let n=e;do{let r=n.prev,i=n.next.next;!pa(r,i)&&ma(r,n,n.next,i)&&va(r,i)&&va(i,r)&&(t.push(r.i,n.i,i.i),Sa(n),Sa(n.next),n=e=i),n=n.next}while(n!==e);return Ji(n)}function $i(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&da(o,e)){let s=ba(o,e);o=Ji(o,o.next),s=Ji(s,s.next),Yi(o,t,n,r,i,a,0),Yi(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function ea(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=qi(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(ca(o))}i.sort(ta);for(let e=0;e<i.length;e++)n=na(i[e],n);return n}function ta(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function na(e,t){let n=ra(e,t);if(!n)return t;let r=ba(n,e);return Ji(r,r.next),Ji(n,n.next)}function ra(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(pa(e,n))return n;do{if(pa(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&la(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);va(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&ia(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function ia(e,t){return fa(e.prev,e,t.prev)<0&&fa(t.next,e,e.next)<0}function aa(e,t,n,r){let i=e;do i.z===0&&(i.z=sa(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,oa(i)}function oa(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function sa(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function ca(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function la(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function ua(e,t,n,r,i,a,o,s){return!(e===o&&t===s)&&la(e,t,n,r,i,a,o,s)}function da(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!_a(e,t)&&(va(e,t)&&va(t,e)&&ya(e,t)&&(fa(e.prev,e,t.prev)||fa(e,t.prev,t))||pa(e,t)&&fa(e.prev,e,e.next)>0&&fa(t.prev,t,t.next)>0)}function fa(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function pa(e,t){return e.x===t.x&&e.y===t.y}function ma(e,t,n,r){let i=ga(fa(e,t,n)),a=ga(fa(e,t,r)),o=ga(fa(n,r,e)),s=ga(fa(n,r,t));return!!(i!==a&&o!==s||i===0&&ha(e,n,t)||a===0&&ha(e,r,t)||o===0&&ha(n,e,r)||s===0&&ha(n,t,r))}function ha(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function ga(e){return e>0?1:e<0?-1:0}function _a(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&ma(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function va(e,t){return fa(e.prev,e,e.next)<0?fa(e,t,e.next)>=0&&fa(e,e.prev,t)>=0:fa(e,t,e.prev)<0||fa(e,e.next,t)<0}function ya(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function ba(e,t){let n=Ca(e.i,e.x,e.y),r=Ca(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function xa(e,t,n,r){let i=Ca(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Sa(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Ca(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function wa(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Ta=class{static triangulate(e,t,n=2){return Ki(e,t,n)}},Ea=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];Da(e),Oa(n,e);let a=e.length;t.forEach(Da);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,Oa(n,t[e]);let o=Ta.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function Da(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function Oa(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var ka=class e extends Dr{constructor(e=new Gi([new U(.5,.5),new U(-.5,.5),new U(-.5,-.5),new U(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new hr(r,3)),this.setAttribute(`uv`,new hr(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0?!0:t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?Aa:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new W,b=new W,x=new W}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!Ea.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];Ea.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=1e-10;t*t;let n=e[0];for(let t=1;t<=e.length;t++){let r=t%e.length,i=e[r],a=i.x-n.x,o=i.y-n.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(n.x),Math.abs(n.y));if(s<=10000000000000001e-36*c*c){e.splice(r,1),t--;continue}n=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function ee(e,t,n){return t||V(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let O=C.length;function k(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new U(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new U(r/a,i/a)}let te=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),te[e]=k(D[e],D[n],D[r]);let A=[],j,ne=te.concat();for(let e=0,t=E;e<t;e++){let t=w[e];j=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),j[e]=k(t[e],t[r],t[i]);A.push(j),ne=ne.concat(j)}let M;if(p===0)M=Ea.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=ee(D[t],te[t],a);P(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];j=A[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=ee(n[e],j[e],a);P(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}M=Ea.triangulateShape(e,t)}let N=M.length,re=d+f;for(let e=0;e<O;e++){let t=l?ee(C[e],ne[e],re):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),P(x.x,x.y,x.z)):P(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<O;t++){let n=l?ee(C[t],ne[t],re):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),P(x.x,x.y,x.z)):P(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=ee(D[e],te[e],r);P(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];j=A[e];for(let e=0,i=t.length;e<i;e++){let i=ee(t[e],j[e],r);_?P(i.x,i.y+g[s-1].y,g[s-1].x+n):P(i.x,i.y,c+n)}}}ie(),ae();function ie(){let e=r.length/3;if(l){let e=0,t=O*e;for(let e=0;e<N;e++){let n=M[e];se(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=O*e;for(let e=0;e<N;e++){let n=M[e];se(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<N;e++){let t=M[e];se(t[2],t[1],t[0])}for(let e=0;e<N;e++){let t=M[e];se(t[0]+O*s,t[1]+O*s,t[2]+O*s)}}n.addGroup(e,r.length/3-e,0)}function ae(){let e=r.length/3,t=0;oe(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];oe(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function oe(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=O*e,a=O*(e+1);ce(t+r+n,t+i+n,t+i+a,t+r+a)}}}function P(e,t,n){a.push(e),a.push(t),a.push(n)}function se(e,t,i){F(e),F(t),F(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);le(o[0]),le(o[1]),le(o[2])}function ce(e,t,i,a){F(e),F(t),F(a),F(t),F(i),F(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);le(s[0]),le(s[1]),le(s[3]),le(s[1]),le(s[2]),le(s[3])}function F(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function le(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return ja(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Hi[i.type]().fromJSON(i)),new e(r,t.options)}},Aa={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new U(a,o),new U(s,c),new U(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new U(o,1-c),new U(l,1-d),new U(f,1-m),new U(h,1-_)]:[new U(s,1-c),new U(u,1-d),new U(p,1-m),new U(g,1-_)]}};function ja(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var Ma=class e extends Dr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new hr(p,3)),this.setAttribute(`normal`,new hr(m,3)),this.setAttribute(`uv`,new hr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Na=class e extends Dr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new W,d=new W,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=0;f===0&&a===0?v=.5/t:f===n&&s===Math.PI&&(v=-.5/t);for(let n=0;n<=t;n++){let s=n/t;u.x=-e*Math.cos(r+s*i)*Math.sin(a+_*o),u.y=e*Math.cos(a+_*o),u.z=e*Math.sin(r+s*i)*Math.sin(a+_*o),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(s+v,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new hr(p,3)),this.setAttribute(`normal`,new hr(m,3)),this.setAttribute(`uv`,new hr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Pa=class e extends Dr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new W,f=new W,p=new W;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new hr(c,3)),this.setAttribute(`normal`,new hr(l,3)),this.setAttribute(`uv`,new hr(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};function Fa(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(La(i))i.isRenderTargetTexture?(B(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i))if(La(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice();else t[n][r]=i}}return t}function Ia(e){let t={};for(let n=0;n<e.length;n++){let r=Fa(e[n]);for(let e in r)t[e]=r[e]}return t}function La(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Ra(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function za(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:K.workingColorSpace}var Ba={clone:Fa,merge:Ia},Va=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ha=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ua=class extends kr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Va,this.fragmentShader=Ha,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fa(e.uniforms),this.uniformsGroups=Ra(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Wa=class extends Ua{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},X=class extends kr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new q(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new U(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ga=class extends kr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Fe,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ka=class extends kr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function qa(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}var Ja=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`call to abstract method`)}intervalChanged_(){}},Ya=class extends Ja{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:R,endingEnd:R}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case z:i=e,o=2*t-n;break;case Pe:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case z:a=e,s=2*n-t;break;case Pe:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Xa=class extends Ja{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Za=class extends Ja{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Qa=class extends Ja{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.settings||this.DefaultSettings_,u=l.inTangents,d=l.outTangents;if(!u||!d){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let f=o*2,p=e-1;for(let l=0;l!==o;++l){let o=a[c+l],m=a[s+l],h=p*f+l*2,g=d[h],_=d[h+1],v=e*f+l*2,y=u[v],b=u[v+1],x=(n-t)/(r-t),S,C,w,T,E;for(let e=0;e<8;e++){S=x*x,C=S*x,w=1-x,T=w*w,E=T*w;let e=E*t+3*T*x*g+3*w*S*y+C*r-n;if(Math.abs(e)<1e-10)break;let i=3*T*(g-t)+6*w*x*(y-g)+3*S*(r-y);if(Math.abs(i)<1e-10)break;x-=e/i,x=Math.max(0,Math.min(1,x))}i[l]=E*o+3*T*x*_+3*w*S*b+C*m}return i}},$a=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=qa(t,this.TimeBufferType),this.values=qa(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:qa(e.times,Array),values:qa(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Za(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Xa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ya(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Qa(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case je:t=this.InterpolantFactoryMethodDiscrete;break;case Me:t=this.InterpolantFactoryMethodLinear;break;case L:t=this.InterpolantFactoryMethodSmooth;break;case Ne:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t);return B(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return je;case this.InterpolantFactoryMethodLinear:return Me;case this.InterpolantFactoryMethodSmooth:return L;case this.InterpolantFactoryMethodBezier:return Ne}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(V(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(V(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){V(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){V(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&We(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){V(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===L,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0]))if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};$a.prototype.ValueTypeName=``,$a.prototype.TimeBufferType=Float32Array,$a.prototype.ValueBufferType=Float32Array,$a.prototype.DefaultInterpolation=Me;var eo=class extends $a{constructor(e,t,n){super(e,t,n)}};eo.prototype.ValueTypeName=`bool`,eo.prototype.ValueBufferType=Array,eo.prototype.DefaultInterpolation=je,eo.prototype.InterpolantFactoryMethodLinear=void 0,eo.prototype.InterpolantFactoryMethodSmooth=void 0;var to=class extends $a{constructor(e,t,n,r){super(e,t,n,r)}};to.prototype.ValueTypeName=`color`;var no=class extends $a{constructor(e,t,n,r){super(e,t,n,r)}};no.prototype.ValueTypeName=`number`;var ro=class extends Ja{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Dt.slerpFlat(i,0,a,c-o,a,c,s);return i}},io=class extends $a{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new ro(this.times,this.values,this.getValueSize(),e)}};io.prototype.ValueTypeName=`quaternion`,io.prototype.InterpolantFactoryMethodSmooth=void 0;var ao=class extends $a{constructor(e,t,n){super(e,t,n)}};ao.prototype.ValueTypeName=`string`,ao.prototype.ValueBufferType=Array,ao.prototype.DefaultInterpolation=je,ao.prototype.InterpolantFactoryMethodLinear=void 0,ao.prototype.InterpolantFactoryMethodSmooth=void 0;var oo=class extends $a{constructor(e,t,n,r){super(e,t,n,r)}};oo.prototype.ValueTypeName=`vector`;var so=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},co=class{constructor(e){this.manager=e===void 0?so:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};co.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var lo=class extends Cn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new q(e),this.intensity=t}dispose(){this.dispatchEvent({type:`dispose`})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},uo=class extends lo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Cn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new q(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},fo=new Yt,po=new W,mo=new W,ho=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new U(512,512),this.mapType=l,this.map=null,this.mapPass=null,this.matrix=new Yt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new oi,this._frameExtents=new U(1,1),this._viewportCount=1,this._viewports=[new Wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;po.setFromMatrixPosition(e.matrixWorld),t.position.copy(po),mo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(mo),t.updateMatrixWorld(),fo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fo,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===2001||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(fo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},go=new W,_o=new Dt,vo=new W,yo=class extends Cn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Yt,this.projectionMatrix=new Yt,this.projectionMatrixInverse=new Yt,this.coordinateSystem=He,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(go,_o,vo),vo.x===1&&vo.y===1&&vo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(go,_o,vo.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(go,_o,vo),vo.x===1&&vo.y===1&&vo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(go,_o,vo.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},bo=new W,xo=new U,So=new U,Co=class extends yo{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=it*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(rt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return it*2*Math.atan(Math.tan(rt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){bo.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(bo.x,bo.y).multiplyScalar(-e/bo.z),bo.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(bo.x,bo.y).multiplyScalar(-e/bo.z)}getViewSize(e,t){return this.getViewBounds(e,xo,So),t.subVectors(So,xo)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(rt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},wo=class extends yo{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},To=class extends ho{constructor(){super(new wo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Eo=class extends lo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Cn.DEFAULT_UP),this.updateMatrix(),this.target=new Cn,this.shadow=new To}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Do=-90,Oo=1,ko=class extends Cn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Co(Do,Oo,e,t);r.layers=this.layers,this.add(r);let i=new Co(Do,Oo,e,t);i.layers=this.layers,this.add(i);let a=new Co(Do,Oo,e,t);a.layers=this.layers,this.add(a);let o=new Co(Do,Oo,e,t);o.layers=this.layers,this.add(o);let s=new Co(Do,Oo,e,t);s.layers=this.layers,this.add(s);let c=new Co(Do,Oo,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Ao=class extends Co{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},jo=`\\[\\]\\.:\\/`,Mo=RegExp(`[`+jo+`]`,`g`),No=`[^`+jo+`]`,Po=`[^`+jo.replace(`\\.`,``)+`]`,Fo=`((?:WC+[\\/:])*)`.replace(`WC`,No),Io=`(WCOD+)?`.replace(`WCOD`,Po),Lo=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,No),Ro=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,No),zo=RegExp(`^`+Fo+Io+Lo+Ro+`$`),Bo=[`material`,`materials`,`bones`,`map`],Vo=class{constructor(e,t,n){let r=n||Ho.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ho=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Mo,``)}static parseTrackName(e){let t=zo.exec(e);if(t===null)throw Error(`PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Bo.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){B(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){V(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){V(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){V(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){V(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){V(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){V(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){V(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;V(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){V(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){V(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ho.Composite=Vo,Ho.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Ho.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Ho.prototype.GetterByBindingType=[Ho.prototype._getValue_direct,Ho.prototype._getValue_array,Ho.prototype._getValue_arrayElement,Ho.prototype._getValue_toArray],Ho.prototype.SetterByBindingTypeAndVersioning=[[Ho.prototype._setValue_direct,Ho.prototype._setValue_direct_setNeedsUpdate,Ho.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ho.prototype._setValue_array,Ho.prototype._setValue_array_setNeedsUpdate,Ho.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ho.prototype._setValue_arrayElement,Ho.prototype._setValue_arrayElement_setNeedsUpdate,Ho.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ho.prototype._setValue_fromArray,Ho.prototype._setValue_fromArray_setNeedsUpdate,Ho.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Uo=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,B(`Clock: This module has been deprecated. Please use THREE.Timer instead.`)}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});function Wo(e,t,n,r){let i=Go(r);switch(n){case S:return e*t;case D:return e*t/i.components*i.byteLength;case ee:return e*t/i.components*i.byteLength;case O:return e*t*2/i.components*i.byteLength;case k:return e*t*2/i.components*i.byteLength;case C:return e*t*3/i.components*i.byteLength;case w:return e*t*4/i.components*i.byteLength;case te:return e*t*4/i.components*i.byteLength;case A:case j:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ne:case M:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case re:case ae:return Math.max(e,16)*Math.max(t,8)/4;case N:case ie:return Math.max(e,8)*Math.max(t,8)/2;case oe:case P:case ce:case F:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case se:case le:case ue:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case de:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case fe:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case pe:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case me:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case he:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ge:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case _e:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case ve:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case ye:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case be:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case xe:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Se:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ce:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case we:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Te:case Ee:case De:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Oe:case ke:return Math.ceil(e/4)*Math.ceil(t/4)*8;case I:case Ae:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Go(e){switch(e){case l:case u:return{byteLength:1,components:1};case f:case d:case g:return{byteLength:2,components:1};case _:case v:return{byteLength:2,components:4};case m:case p:case h:return{byteLength:4,components:1};case b:case x:return{byteLength:4,components:3}}throw Error(`Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`184`}})),typeof window<`u`&&(window.__THREE__?B(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`184`);function Ko(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function qo(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Z={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
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
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
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
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
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
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
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
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
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
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
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
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
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
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
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
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
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
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
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
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
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
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
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
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
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
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
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
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
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
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
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
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
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
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
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
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
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
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
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
		return 0.5 / max( gv + gl, EPSILON );
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
	vec3 f0 = material.specularColorBlended;
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
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
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
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
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
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
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
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
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
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
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
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
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
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
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
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
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
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
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
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
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
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
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
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
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
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
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
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
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
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
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
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
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
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
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
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
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
}`,depth_frag:`#if DEPTH_PACKING == 3200
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
}`,distance_vert:`#define DISTANCE
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
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
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
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
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
}`,linedashed_frag:`uniform vec3 diffuse;
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
}`,meshbasic_vert:`#include <common>
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
}`,meshbasic_frag:`uniform vec3 diffuse;
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
}`,meshlambert_vert:`#define LAMBERT
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
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,meshmatcap_vert:`#define MATCAP
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
}`,meshmatcap_frag:`#define MATCAP
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
}`,meshnormal_vert:`#define NORMAL
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
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
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
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
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
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,meshphysical_vert:`#define STANDARD
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
}`,meshphysical_frag:`#define STANDARD
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
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
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
}`,meshtoon_vert:`#define TOON
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
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
}`,points_vert:`uniform float size;
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
}`,points_frag:`uniform vec3 diffuse;
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
}`,shadow_vert:`#include <common>
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
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
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
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
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
}`,sprite_frag:`uniform vec3 diffuse;
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
}`},Q={common:{diffuse:{value:new q(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new G},alphaMap:{value:null},alphaMapTransform:{value:new G},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new G}},envmap:{envMap:{value:null},envMapRotation:{value:new G},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new G}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new G}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new G},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new G},normalScale:{value:new U(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new G},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new G}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new G}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new G}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new q(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new W},probesMax:{value:new W},probesResolution:{value:new W}},points:{diffuse:{value:new q(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new G},alphaTest:{value:0},uvTransform:{value:new G}},sprite:{diffuse:{value:new q(16777215)},opacity:{value:1},center:{value:new U(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new G},alphaMap:{value:null},alphaMapTransform:{value:new G},alphaTest:{value:0}}},Jo={basic:{uniforms:Ia([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.fog]),vertexShader:Z.meshbasic_vert,fragmentShader:Z.meshbasic_frag},lambert:{uniforms:Ia([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new q(0)},envMapIntensity:{value:1}}]),vertexShader:Z.meshlambert_vert,fragmentShader:Z.meshlambert_frag},phong:{uniforms:Ia([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new q(0)},specular:{value:new q(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Z.meshphong_vert,fragmentShader:Z.meshphong_frag},standard:{uniforms:Ia([Q.common,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.roughnessmap,Q.metalnessmap,Q.fog,Q.lights,{emissive:{value:new q(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag},toon:{uniforms:Ia([Q.common,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.gradientmap,Q.fog,Q.lights,{emissive:{value:new q(0)}}]),vertexShader:Z.meshtoon_vert,fragmentShader:Z.meshtoon_frag},matcap:{uniforms:Ia([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,{matcap:{value:null}}]),vertexShader:Z.meshmatcap_vert,fragmentShader:Z.meshmatcap_frag},points:{uniforms:Ia([Q.points,Q.fog]),vertexShader:Z.points_vert,fragmentShader:Z.points_frag},dashed:{uniforms:Ia([Q.common,Q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Z.linedashed_vert,fragmentShader:Z.linedashed_frag},depth:{uniforms:Ia([Q.common,Q.displacementmap]),vertexShader:Z.depth_vert,fragmentShader:Z.depth_frag},normal:{uniforms:Ia([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,{opacity:{value:1}}]),vertexShader:Z.meshnormal_vert,fragmentShader:Z.meshnormal_frag},sprite:{uniforms:Ia([Q.sprite,Q.fog]),vertexShader:Z.sprite_vert,fragmentShader:Z.sprite_frag},background:{uniforms:{uvTransform:{value:new G},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Z.background_vert,fragmentShader:Z.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new G}},vertexShader:Z.backgroundCube_vert,fragmentShader:Z.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Z.cube_vert,fragmentShader:Z.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Z.equirect_vert,fragmentShader:Z.equirect_frag},distance:{uniforms:Ia([Q.common,Q.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Z.distance_vert,fragmentShader:Z.distance_frag},shadow:{uniforms:Ia([Q.lights,Q.fog,{color:{value:new q(0)},opacity:{value:1}}]),vertexShader:Z.shadow_vert,fragmentShader:Z.shadow_frag}};Jo.physical={uniforms:Ia([Jo.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new G},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new G},clearcoatNormalScale:{value:new U(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new G},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new G},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new G},sheen:{value:0},sheenColor:{value:new q(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new G},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new G},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new G},transmissionSamplerSize:{value:new U},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new G},attenuationDistance:{value:0},attenuationColor:{value:new q(0)},specularColor:{value:new q(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new G},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new G},anisotropyVector:{value:new U},anisotropyMap:{value:null},anisotropyMapTransform:{value:new G}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag};var Yo={r:0,b:0,g:0},Xo=new Yt,Zo=new G;Zo.set(-1,0,0,0,1,0,0,0,1);function Qo(e,t,n,r,i,a){let o=new q(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new J(new Y(1,1,1),new Ua({name:`BackgroundCubeMaterial`,uniforms:Fa(Jo.backgroundCube.uniforms),vertexShader:Jo.backgroundCube.vertexShader,fragmentShader:Jo.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,`envMap`,{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Xo.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Zo),l.material.toneMapped=K.getTransfer(i.colorSpace)!==ze,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new J(new Ma(2,2),new Ua({name:`BackgroundMaterial`,uniforms:Fa(Jo.background.uniforms),vertexShader:Jo.background.vertexShader,fragmentShader:Jo.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,`map`,{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=K.getTransfer(i.colorSpace)!==ze,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Yo,za(e)),n.buffers.color.setClear(Yo.r,Yo.g,Yo.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function $o(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function es(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function ts(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return!(t!==1023&&r.convert(t)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(B(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&B(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function ns(e){let t=this,n=null,r=0,i=!1,a=!1,o=new ni,s=new G,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var rs=4,is=[.125,.215,.35,.446,.526,.582],as=20,os=256,ss=new wo,cs=new q,ls=null,us=0,ds=0,fs=!1,ps=new W,ms=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=ps}=i;ls=this._renderer.getRenderTarget(),us=this._renderer.getActiveCubeFace(),ds=this._renderer.getActiveMipmapLevel(),fs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xs(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bs(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ls,us,ds),this._renderer.xr.enabled=fs,e.scissorTest=!1,_s(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ls=this._renderer.getRenderTarget(),us=this._renderer.getActiveCubeFace(),ds=this._renderer.getActiveMipmapLevel(),fs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:o,minFilter:o,generateMipmaps:!1,type:g,format:w,colorSpace:Le,depthBuffer:!1},r=gs(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=gs(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=hs(r)),this._blurMaterial=ys(r,e,t),this._ggxMaterial=vs(r,e,t)}return r}_compileMaterial(e){let t=new J(new Dr,e);this._renderer.compile(t,ss)}_sceneToCubeUV(e,t,n,r,i){let a=new Co(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(cs),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new J(new Y,new Rr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(cs),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;_s(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=xs()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bs());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;_s(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,ss)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-rs?n-d+rs:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,_s(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,ss),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,_s(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,ss)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&V(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/(2*as-1),p=i/f,m=isFinite(i)?1+Math.floor(3*p):as;m>as&&B(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${as}`);let h=[],g=0;for(let e=0;e<as;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];_s(t,3*v*(r>_-rs?r-_+rs:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,ss)}};function hs(e){let t=[],n=[],r=[],i=e,a=e-rs+1+is.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-rs?s=is[o-e+rs-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new Dr;h.setAttribute(`position`,new fr(f,3)),h.setAttribute(`uv`,new fr(p,2)),h.setAttribute(`faceIndex`,new fr(m,1)),r.push(new J(h,null)),i>rs&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function gs(e,t,n){let r=new Kt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function _s(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function vs(e,t,n){return new Ua({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:os,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ss(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ys(e,t,n){let r=new Float32Array(as),i=new W(0,1,0);return new Ua({name:`SphericalGaussianBlur`,defines:{n:as,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ss(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function bs(){return new Ua({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Ss(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function xs(){return new Ua({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ss(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ss(){return`

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
	`}var Cs=class extends Kt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new si(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Y(5,5,5),i=new Ua({name:`CubemapFromEquirect`,uniforms:Fa(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new J(r,i),s=t.minFilter;return t.minFilter===1008&&(t.minFilter=o),new ko(1,10,this).update(e,a),t.minFilter=s,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function ws(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304)if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}else{let r=n.image;if(r&&r.height>0){let i=new Cs(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}else return null}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new ms(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new ms(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Ts(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Ze(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Es(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?mr:pr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Ds(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Os(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:V(`WebGLInfo: Unknown draw mode:`,r);break}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function ks(e,t,n){let r=new WeakMap,i=new Wt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let g=new Float32Array(p*m*4*u),_=new qt(g,p,m,u);_.type=h,_.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),g[d+s+0]=i.x,g[d+s+1]=i.y,g[d+s+2]=i.z,g[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),g[d+s+4]=i.x,g[d+s+5]=i.y,g[d+s+6]=i.z,g[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),g[d+s+8]=i.x,g[d+s+9]=i.y,g[d+s+10]=i.z,g[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new U(p,m)},r.set(o,d);function y(){_.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function As(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var js={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Ms(e,t,n,r,i){let a=new Kt(t,n,{type:e,depthBuffer:r,stencilBuffer:i,depthTexture:r?new li(t,n):void 0}),o=new Kt(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}),s=new Dr;s.setAttribute(`position`,new hr([-1,3,0,-1,-1,0,3,-1,0],3)),s.setAttribute(`uv`,new hr([0,2,0,0,2,0],2));let c=new Wa({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),l=new J(s,c),u=new wo(-1,1,1,-1,0,1),d=null,f=null,p=!1,m,h=null,_=[],v=!1;this.setSize=function(e,t){a.setSize(e,t),o.setSize(e,t);for(let n=0;n<_.length;n++){let r=_[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){_=e,v=_.length>0&&_[0].isRenderPass===!0;let t=a.width,n=a.height;for(let e=0;e<_.length;e++){let r=_[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(p||e.toneMapping===0&&_.length===0)return!1;if(h=t,t!==null){let e=t.width,n=t.height;(a.width!==e||a.height!==n)&&this.setSize(e,n)}return v===!1&&e.setRenderTarget(a),m=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return v},this.end=function(e,t){e.toneMapping=m,p=!0;let n=a,r=o;for(let i=0;i<_.length;i++){let a=_[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(d!==e.outputColorSpace||f!==e.toneMapping){d=e.outputColorSpace,f=e.toneMapping,c.defines={},K.getTransfer(d)===`srgb`&&(c.defines.SRGB_TRANSFER=``);let t=js[f];t&&(c.defines[t]=``),c.needsUpdate=!0}c.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(h),e.render(l,u),h=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),s.dispose(),c.dispose()}}var Ns=new Ut,Ps=new li(1,1),Fs=new qt,Is=new Jt,Ls=new si,Rs=[],zs=[],Bs=new Float32Array(16),Vs=new Float32Array(9),Hs=new Float32Array(4);function Us(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Rs[i];if(a===void 0&&(a=new Float32Array(i),Rs[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Ws(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Gs(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Ks(e,t){let n=zs[t];n===void 0&&(n=new Int32Array(t),zs[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function qs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Js(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ws(n,t))return;e.uniform2fv(this.addr,t),Gs(n,t)}}function Ys(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Ws(n,t))return;e.uniform3fv(this.addr,t),Gs(n,t)}}function Xs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ws(n,t))return;e.uniform4fv(this.addr,t),Gs(n,t)}}function Zs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ws(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Gs(n,t)}else{if(Ws(n,r))return;Hs.set(r),e.uniformMatrix2fv(this.addr,!1,Hs),Gs(n,r)}}function Qs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ws(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Gs(n,t)}else{if(Ws(n,r))return;Vs.set(r),e.uniformMatrix3fv(this.addr,!1,Vs),Gs(n,r)}}function $s(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ws(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Gs(n,t)}else{if(Ws(n,r))return;Bs.set(r),e.uniformMatrix4fv(this.addr,!1,Bs),Gs(n,r)}}function ec(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function tc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ws(n,t))return;e.uniform2iv(this.addr,t),Gs(n,t)}}function nc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ws(n,t))return;e.uniform3iv(this.addr,t),Gs(n,t)}}function rc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ws(n,t))return;e.uniform4iv(this.addr,t),Gs(n,t)}}function ic(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function ac(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ws(n,t))return;e.uniform2uiv(this.addr,t),Gs(n,t)}}function oc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ws(n,t))return;e.uniform3uiv(this.addr,t),Gs(n,t)}}function sc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ws(n,t))return;e.uniform4uiv(this.addr,t),Gs(n,t)}}function cc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Ps.compareFunction=n.isReversedDepthBuffer()?518:515,a=Ps):a=Ns,n.setTexture2D(t||a,i)}function lc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Is,i)}function uc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Ls,i)}function dc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Fs,i)}function fc(e){switch(e){case 5126:return qs;case 35664:return Js;case 35665:return Ys;case 35666:return Xs;case 35674:return Zs;case 35675:return Qs;case 35676:return $s;case 5124:case 35670:return ec;case 35667:case 35671:return tc;case 35668:case 35672:return nc;case 35669:case 35673:return rc;case 5125:return ic;case 36294:return ac;case 36295:return oc;case 36296:return sc;case 35678:case 36198:case 36298:case 36306:case 35682:return cc;case 35679:case 36299:case 36307:return lc;case 35680:case 36300:case 36308:case 36293:return uc;case 36289:case 36303:case 36311:case 36292:return dc}}function pc(e,t){e.uniform1fv(this.addr,t)}function mc(e,t){let n=Us(t,this.size,2);e.uniform2fv(this.addr,n)}function hc(e,t){let n=Us(t,this.size,3);e.uniform3fv(this.addr,n)}function gc(e,t){let n=Us(t,this.size,4);e.uniform4fv(this.addr,n)}function _c(e,t){let n=Us(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function vc(e,t){let n=Us(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function yc(e,t){let n=Us(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function bc(e,t){e.uniform1iv(this.addr,t)}function xc(e,t){e.uniform2iv(this.addr,t)}function Sc(e,t){e.uniform3iv(this.addr,t)}function Cc(e,t){e.uniform4iv(this.addr,t)}function wc(e,t){e.uniform1uiv(this.addr,t)}function Tc(e,t){e.uniform2uiv(this.addr,t)}function Ec(e,t){e.uniform3uiv(this.addr,t)}function Dc(e,t){e.uniform4uiv(this.addr,t)}function Oc(e,t,n){let r=this.cache,i=t.length,a=Ks(n,i);Ws(r,a)||(e.uniform1iv(this.addr,a),Gs(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Ps:Ns;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function kc(e,t,n){let r=this.cache,i=t.length,a=Ks(n,i);Ws(r,a)||(e.uniform1iv(this.addr,a),Gs(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Is,a[e])}function Ac(e,t,n){let r=this.cache,i=t.length,a=Ks(n,i);Ws(r,a)||(e.uniform1iv(this.addr,a),Gs(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Ls,a[e])}function jc(e,t,n){let r=this.cache,i=t.length,a=Ks(n,i);Ws(r,a)||(e.uniform1iv(this.addr,a),Gs(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Fs,a[e])}function Mc(e){switch(e){case 5126:return pc;case 35664:return mc;case 35665:return hc;case 35666:return gc;case 35674:return _c;case 35675:return vc;case 35676:return yc;case 5124:case 35670:return bc;case 35667:case 35671:return xc;case 35668:case 35672:return Sc;case 35669:case 35673:return Cc;case 5125:return wc;case 36294:return Tc;case 36295:return Ec;case 36296:return Dc;case 35678:case 36198:case 36298:case 36306:case 35682:return Oc;case 35679:case 36299:case 36307:return kc;case 35680:case 36300:case 36308:case 36293:return Ac;case 36289:case 36303:case 36311:case 36292:return jc}}var Nc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=fc(t.type)}},Pc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Mc(t.type)}},Fc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Ic=/(\w+)(\])?(\[|\.)?/g;function Lc(e,t){e.seq.push(t),e.map[t.id]=t}function Rc(e,t,n){let r=e.name,i=r.length;for(Ic.lastIndex=0;;){let a=Ic.exec(r),o=Ic.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Lc(n,l===void 0?new Nc(s,e,t):new Pc(s,e,t));break}else{let e=n.map[s];e===void 0&&(e=new Fc(s),Lc(n,e)),n=e}}}var zc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Rc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Bc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Vc=37297,Hc=0;function Uc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Wc=new G;function Gc(e){K._getMatrix(Wc,K.workingColorSpace,e);let t=`mat3( ${Wc.elements.map(e=>e.toFixed(4))} )`;switch(K.getTransfer(e)){case Re:return[t,`LinearTransferOETF`];case ze:return[t,`sRGBTransferOETF`];default:return B(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Kc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Uc(e.getShaderSource(t),r)}else return i}function qc(e,t){let n=Gc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Jc={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Yc(e,t){let n=Jc[t];return n===void 0?(B(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Xc=new W;function Zc(){return K.getLuminanceCoefficients(Xc),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Xc.x.toFixed(4)}, ${Xc.y.toFixed(4)}, ${Xc.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Qc(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(tl).join(`
`)}function $c(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function el(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function tl(e){return e!==``}function nl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function rl(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var il=/^[ \t]*#include +<([\w\d./]+)>/gm;function al(e){return e.replace(il,sl)}var ol=new Map;function sl(e,t){let n=Z[t];if(n===void 0){let e=ol.get(t);if(e!==void 0)n=Z[e],B(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`Can not resolve #include <`+t+`>`)}return al(n)}var cl=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ll(e){return e.replace(cl,ul)}function ul(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function dl(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var fl={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function pl(e){return fl[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var ml={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function hl(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:ml[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var gl={302:`ENVMAP_MODE_REFRACTION`};function _l(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:gl[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var vl={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function yl(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:vl[e.combine]||`ENVMAP_BLENDING_NONE`}function bl(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function xl(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=pl(n),l=hl(n),u=_l(n),d=yl(n),f=bl(n),p=Qc(n),m=$c(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(tl).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(tl).join(`
`),_.length>0&&(_+=`
`)):(g=[dl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(tl).join(`
`),_=[dl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Z.tonemapping_pars_fragment,n.toneMapping===0?``:Yc(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Z.colorspace_pars_fragment,qc(`linearToOutputTexel`,n.outputColorSpace),Zc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(tl).join(`
`)),o=al(o),o=nl(o,n),o=rl(o,n),s=al(s),s=nl(s,n),s=rl(s,n),o=ll(o),s=ll(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Bc(i,i.VERTEX_SHADER,y),S=Bc(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.morphTargets===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1)if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Kc(i,x,`vertex`),n=Kc(i,S,`fragment`);V(`THREE.WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}else o===``?(s===``||c===``)&&(u=!1):B(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new zc(i,h),T=el(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Vc)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Hc++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Sl=0,Cl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),i=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new wl(e),t.set(e,n)),n}},wl=class{constructor(e){this.id=Sl++,this.code=e,this.usedTimes=0}};function Tl(e){return e===1030||e===37490||e===36285}function El(e,t,n,r,i,a){let o=new sn,s=new Cl,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&B(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,ee,O,k;if(C){let e=Jo[C];D=e.vertexShader,ee=e.fragmentShader}else D=i.vertexShader,ee=i.fragmentShader,s.update(i),O=s.getVertexShaderID(i),k=s.getFragmentShaderID(i);let te=e.getRenderTarget(),A=e.state.buffers.depth.getReversed(),j=h.isInstancedMesh===!0,ne=h.isBatchedMesh===!0,M=!!i.map,N=!!i.matcap,re=!!x,ie=!!i.aoMap,ae=!!i.lightMap,oe=!!i.bumpMap,P=!!i.normalMap,se=!!i.displacementMap,ce=!!i.emissiveMap,F=!!i.metalnessMap,le=!!i.roughnessMap,ue=i.anisotropy>0,de=i.clearcoat>0,fe=i.dispersion>0,pe=i.iridescence>0,me=i.sheen>0,he=i.transmission>0,ge=ue&&!!i.anisotropyMap,_e=de&&!!i.clearcoatMap,ve=de&&!!i.clearcoatNormalMap,ye=de&&!!i.clearcoatRoughnessMap,be=pe&&!!i.iridescenceMap,xe=pe&&!!i.iridescenceThicknessMap,Se=me&&!!i.sheenColorMap,Ce=me&&!!i.sheenRoughnessMap,we=!!i.specularMap,Te=!!i.specularColorMap,Ee=!!i.specularIntensityMap,De=he&&!!i.transmissionMap,Oe=he&&!!i.thicknessMap,ke=!!i.gradientMap,I=!!i.alphaMap,Ae=i.alphaTest>0,je=!!i.alphaHash,Me=!!i.extensions,L=0;i.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(L=e.toneMapping);let Ne={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:ee,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:ne,batchingColor:ne&&h._colorsTexture!==null,instancing:j,instancingColor:j&&h.instanceColor!==null,instancingMorph:j&&h.morphTexture!==null,outputColorSpace:te===null?e.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:K.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:M,matcap:N,envMap:re,envMapMode:re&&x.mapping,envMapCubeUVHeight:S,aoMap:ie,lightMap:ae,bumpMap:oe,normalMap:P,displacementMap:se,emissiveMap:ce,normalMapObjectSpace:P&&i.normalMapType===1,normalMapTangentSpace:P&&i.normalMapType===0,packedNormalMap:P&&i.normalMapType===0&&Tl(i.normalMap.format),metalnessMap:F,roughnessMap:le,anisotropy:ue,anisotropyMap:ge,clearcoat:de,clearcoatMap:_e,clearcoatNormalMap:ve,clearcoatRoughnessMap:ye,dispersion:fe,iridescence:pe,iridescenceMap:be,iridescenceThicknessMap:xe,sheen:me,sheenColorMap:Se,sheenRoughnessMap:Ce,specularMap:we,specularColorMap:Te,specularIntensityMap:Ee,transmission:he,transmissionMap:De,thicknessMap:Oe,gradientMap:ke,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:I,alphaTest:Ae,alphaHash:je,combine:i.combine,mapUv:M&&m(i.map.channel),aoMapUv:ie&&m(i.aoMap.channel),lightMapUv:ae&&m(i.lightMap.channel),bumpMapUv:oe&&m(i.bumpMap.channel),normalMapUv:P&&m(i.normalMap.channel),displacementMapUv:se&&m(i.displacementMap.channel),emissiveMapUv:ce&&m(i.emissiveMap.channel),metalnessMapUv:F&&m(i.metalnessMap.channel),roughnessMapUv:le&&m(i.roughnessMap.channel),anisotropyMapUv:ge&&m(i.anisotropyMap.channel),clearcoatMapUv:_e&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ve&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&m(i.sheenRoughnessMap.channel),specularMapUv:we&&m(i.specularMap.channel),specularColorMapUv:Te&&m(i.specularColorMap.channel),specularIntensityMapUv:Ee&&m(i.specularIntensityMap.channel),transmissionMapUv:De&&m(i.transmissionMap.channel),thicknessMapUv:Oe&&m(i.thicknessMap.channel),alphaMapUv:I&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(P||ue),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(M||I),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&P===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:A,skinning:h.isSkinnedMesh===!0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:L,decodeVideoTexture:M&&i.map.isVideoTexture===!0&&K.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ce&&i.emissiveMap.isVideoTexture===!0&&K.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Me&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Me&&i.extensions.multiDraw===!0||ne)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ne.vertexUv1s=c.has(1),Ne.vertexUv2s=c.has(2),Ne.vertexUv3s=c.has(3),c.clear(),Ne}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Jo[t];n=Ba.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new xl(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Dl(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Ol(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function kl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Al(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Ol),r.length>1&&r.sort(t||kl),i.length>1&&i.sort(t||kl)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function jl(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Al,e.set(t,[i])):n>=r.length?(i=new Al,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Ml(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new W,color:new q};break;case`SpotLight`:n={position:new W,direction:new W,color:new q,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new W,color:new q,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new W,skyColor:new q,groundColor:new q};break;case`RectAreaLight`:n={color:new q,position:new W,halfWidth:new W,halfHeight:new W};break}return e[t.id]=n,n}}}function Nl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}var Pl=0;function Fl(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Il(e){let t=new Ml,n=Nl(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new W);let i=new W,a=new Yt,o=new Yt;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(Fl);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Q.LTC_FLOAT_1,r.rectAreaLTC2=Q.LTC_FLOAT_2):(r.rectAreaLTC1=Q.LTC_HALF_1,r.rectAreaLTC2=Q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=Pl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function Ll(e){let t=new Il(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Rl(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Ll(e),t.set(n,[a])):r>=i.length?(a=new Ll(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var zl=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Bl=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Vl=[new W(1,0,0),new W(-1,0,0),new W(0,1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1)],Hl=[new W(0,-1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1),new W(0,-1,0),new W(0,-1,0)],Ul=new Yt,Wl=new W,Gl=new W;function Kl(e,t,n){let i=new oi,a=new U,s=new U,c=new Wt,l=new Ga,u=new Ka,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},_=new Ua({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new U},radius:{value:4}},vertexShader:zl,fragmentShader:Bl}),v=_.clone();v.defines.HORIZONTAL_PASS=1;let y=new Dr;y.setAttribute(`position`,new fr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new J(y,_),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,l){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(B(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.state;_.setBlending(0),_.buffers.depth.getReversed()===!0?_.buffers.color.setClear(0,0,0,0):_.buffers.color.setClear(1,1,1,1),_.buffers.depth.setTest(!0),_.setScissorTest(!1);let v=S!==this.type;v&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){B(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;a.copy(p.mapSize);let y=p.getFrameExtents();a.multiply(y),s.copy(p.mapSize),(a.x>f||a.y>f)&&(a.x>f&&(s.x=Math.floor(f/y.x),a.x=s.x*y.x,p.mapSize.x=s.x),a.y>f&&(s.y=Math.floor(f/y.y),a.y=s.y*y.y,p.mapSize.y=s.y));let b=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=b,p.map===null||v===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){B(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new Kt(a.x,a.y,{format:O,type:g,minFilter:o,magFilter:o,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new li(a.x,a.y,h),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=T,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r}else d.isPointLight?(p.map=new Cs(a.x),p.map.depthTexture=new ui(a.x,m)):(p.map=new Kt(a.x,a.y),p.map.depthTexture=new li(a.x,a.y,m)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=T,this.type===1?(p.map.depthTexture.compareFunction=b?518:515,p.map.depthTexture.minFilter=o,p.map.depthTexture.magFilter=o):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r);p.camera.updateProjectionMatrix()}let x=p.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<x;t++){if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);c.set(s.x*n.x,s.y*n.y,s.x*n.z,s.y*n.w),_.viewport(c)}if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Wl.setFromMatrixPosition(d.matrixWorld),e.position.copy(Wl),Gl.copy(e.position),Gl.add(Vl[t]),e.up.copy(Hl[t]),e.lookAt(Gl),e.updateMatrixWorld(),n.makeTranslation(-Wl.x,-Wl.y,-Wl.z),Ul.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(Ul,e.coordinateSystem,e.reversedDepth)}else p.updateMatrices(d);i=p.getFrustum(),E(n,l,p.camera,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,l),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let i=t.update(b);_.defines.VSM_SAMPLES!==n.blurSamples&&(_.defines.VSM_SAMPLES=n.blurSamples,v.defines.VSM_SAMPLES=n.blurSamples,_.needsUpdate=!0,v.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new Kt(a.x,a.y,{format:O,type:g})),_.uniforms.shadow_pass.value=n.map.depthTexture,_.uniforms.resolution.value=n.mapSize,_.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,_,b,null),v.uniforms.shadow_pass.value=n.mapPass.texture,v.uniforms.resolution.value=n.mapSize,v.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,v,b,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:l,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,D)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function E(n,r,a,o,s){if(n.visible===!1)return;if(n.layers.test(r.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||i.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let i=t.update(n),c=n.material;if(Array.isArray(c)){let t=i.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,r,a,i,t,u),e.renderBufferDirect(a,null,i,t,n,u),n.onAfterShadow(e,n,r,a,i,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,r,a,i,t,null),e.renderBufferDirect(a,null,i,t,n,null),n.onAfterShadow(e,n,r,a,i,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)E(c[e],r,a,o,s)}function D(e){e.target.removeEventListener(`dispose`,D);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function ql(e,t){function n(){let t=!1,n=new Wt,r=null,i=new Wt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?F(e.DEPTH_TEST):le(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=$e[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?F(e.STENCIL_TEST):le(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,te=null,A=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,ne=0,M=e.getParameter(e.VERSION);M.indexOf(`WebGL`)===-1?M.indexOf(`OpenGL ES`)!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(M)[1]),j=ne>=2):(ne=parseFloat(/^WebGL (\d)/.exec(M)[1]),j=ne>=1);let N=null,re={},ie=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),oe=new Wt().fromArray(ie),P=new Wt().fromArray(ae);function se(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ce={};ce[e.TEXTURE_2D]=se(e.TEXTURE_2D,e.TEXTURE_2D,1),ce[e.TEXTURE_CUBE_MAP]=se(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[e.TEXTURE_2D_ARRAY]=se(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ce[e.TEXTURE_3D]=se(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),F(e.DEPTH_TEST),o.setFunc(3),_e(!1),ve(1),F(e.CULL_FACE),he(0);function F(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function le(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ue(t,n){return f[t]===n?!1:(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function de(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function fe(t){return h===t?!1:(e.useProgram(t),h=t,!0)}let pe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};pe[103]=e.MIN,pe[104]=e.MAX;let me={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function he(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(le(e.BLEND),g=!1);return}if(g===!1&&(F(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:V(`WebGLState: Invalid blending: `,t);break}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:V(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:V(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:V(`WebGLState: Invalid blending: `,t);break}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(pe[n],pe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(me[r],me[i],me[o],me[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ge(t,n){t.side===2?le(e.CULL_FACE):F(e.CULL_FACE);let r=t.side===1;n&&(r=!r),_e(r),t.blending===1&&t.transparent===!1?he(0):he(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),be(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?F(e.SAMPLE_ALPHA_TO_COVERAGE):le(e.SAMPLE_ALPHA_TO_COVERAGE)}function _e(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ve(t){t===0?le(e.CULL_FACE):(F(e.CULL_FACE),t!==ee&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),ee=t}function ye(t){t!==O&&(j&&e.lineWidth(t),O=t)}function be(t,n,r){t?(F(e.POLYGON_OFFSET_FILL),(k!==n||te!==r)&&(k=n,te=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):le(e.POLYGON_OFFSET_FILL)}function xe(t){t?F(e.SCISSOR_TEST):le(e.SCISSOR_TEST)}function Se(t){t===void 0&&(t=e.TEXTURE0+A-1),N!==t&&(e.activeTexture(t),N=t)}function Ce(t,n,r){r===void 0&&(r=N===null?e.TEXTURE0+A-1:N);let i=re[r];i===void 0&&(i={type:void 0,texture:void 0},re[r]=i),(i.type!==t||i.texture!==n)&&(N!==r&&(e.activeTexture(r),N=r),e.bindTexture(t,n||ce[t]),i.type=t,i.texture=n)}function we(){let t=re[N];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Te(){try{e.compressedTexImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ee(){try{e.compressedTexImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function De(){try{e.texSubImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Oe(){try{e.texSubImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function ke(){try{e.compressedTexSubImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function I(){try{e.compressedTexSubImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ae(){try{e.texStorage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function je(){try{e.texStorage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Me(){try{e.texImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function L(){try{e.texImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ne(t){return d[t]===void 0?e.getParameter(t):d[t]}function R(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function z(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function Pe(t){P.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),P.copy(t))}function Fe(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ie(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Le(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},N=null,re={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,te=null,oe.set(0,0,e.canvas.width,e.canvas.height),P.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:F,disable:le,bindFramebuffer:ue,drawBuffers:de,useProgram:fe,setBlending:he,setMaterial:ge,setFlipSided:_e,setCullFace:ve,setLineWidth:ye,setPolygonOffset:be,setScissorTest:xe,activeTexture:Se,bindTexture:Ce,unbindTexture:we,compressedTexImage2D:Te,compressedTexImage3D:Ee,texImage2D:Me,texImage3D:L,pixelStorei:R,getParameter:Ne,updateUBOMapping:Fe,uniformBlockBinding:Ie,texStorage2D:Ae,texStorage3D:je,texSubImage2D:De,texSubImage3D:Oe,compressedTexSubImage2D:ke,compressedTexSubImage3D:I,scissor:z,viewport:Pe,reset:Le}}function Jl(l,u,d,f,p,m,h){let g=u.has(`WEBGL_multisampled_render_to_texture`)?u.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new U,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):Ge(`canvas`)}function T(e,t,n){let r=1,i=Ne(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1)if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),B(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}else return`data`in e&&B(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e;return e}function D(e){return e.generateMipmaps}function ee(e){l.generateMipmap(e)}function O(e){return e.isWebGLCubeRenderTarget?l.TEXTURE_CUBE_MAP:e.isWebGL3DRenderTarget?l.TEXTURE_3D:e.isWebGLArrayRenderTarget||e.isCompressedArrayTexture?l.TEXTURE_2D_ARRAY:l.TEXTURE_2D}function k(e,t,n,r,i,a=!1){if(e!==null){if(l[e]!==void 0)return l[e];B(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+e+`'`)}let o;r&&(o=u.get(`EXT_texture_norm16`),o||B(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let s=t;if(t===l.RED&&(n===l.FLOAT&&(s=l.R32F),n===l.HALF_FLOAT&&(s=l.R16F),n===l.UNSIGNED_BYTE&&(s=l.R8),n===l.UNSIGNED_SHORT&&o&&(s=o.R16_EXT),n===l.SHORT&&o&&(s=o.R16_SNORM_EXT)),t===l.RED_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.R8UI),n===l.UNSIGNED_SHORT&&(s=l.R16UI),n===l.UNSIGNED_INT&&(s=l.R32UI),n===l.BYTE&&(s=l.R8I),n===l.SHORT&&(s=l.R16I),n===l.INT&&(s=l.R32I)),t===l.RG&&(n===l.FLOAT&&(s=l.RG32F),n===l.HALF_FLOAT&&(s=l.RG16F),n===l.UNSIGNED_BYTE&&(s=l.RG8),n===l.UNSIGNED_SHORT&&o&&(s=o.RG16_EXT),n===l.SHORT&&o&&(s=o.RG16_SNORM_EXT)),t===l.RG_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RG8UI),n===l.UNSIGNED_SHORT&&(s=l.RG16UI),n===l.UNSIGNED_INT&&(s=l.RG32UI),n===l.BYTE&&(s=l.RG8I),n===l.SHORT&&(s=l.RG16I),n===l.INT&&(s=l.RG32I)),t===l.RGB_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGB8UI),n===l.UNSIGNED_SHORT&&(s=l.RGB16UI),n===l.UNSIGNED_INT&&(s=l.RGB32UI),n===l.BYTE&&(s=l.RGB8I),n===l.SHORT&&(s=l.RGB16I),n===l.INT&&(s=l.RGB32I)),t===l.RGBA_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGBA8UI),n===l.UNSIGNED_SHORT&&(s=l.RGBA16UI),n===l.UNSIGNED_INT&&(s=l.RGBA32UI),n===l.BYTE&&(s=l.RGBA8I),n===l.SHORT&&(s=l.RGBA16I),n===l.INT&&(s=l.RGBA32I)),t===l.RGB&&(n===l.UNSIGNED_SHORT&&o&&(s=o.RGB16_EXT),n===l.SHORT&&o&&(s=o.RGB16_SNORM_EXT),n===l.UNSIGNED_INT_5_9_9_9_REV&&(s=l.RGB9_E5),n===l.UNSIGNED_INT_10F_11F_11F_REV&&(s=l.R11F_G11F_B10F)),t===l.RGBA){let e=a?Re:K.getTransfer(i);n===l.FLOAT&&(s=l.RGBA32F),n===l.HALF_FLOAT&&(s=l.RGBA16F),n===l.UNSIGNED_BYTE&&(s=e===`srgb`?l.SRGB8_ALPHA8:l.RGBA8),n===l.UNSIGNED_SHORT&&o&&(s=o.RGBA16_EXT),n===l.SHORT&&o&&(s=o.RGBA16_SNORM_EXT),n===l.UNSIGNED_SHORT_4_4_4_4&&(s=l.RGBA4),n===l.UNSIGNED_SHORT_5_5_5_1&&(s=l.RGB5_A1)}return(s===l.R16F||s===l.R32F||s===l.RG16F||s===l.RG32F||s===l.RGBA16F||s===l.RGBA32F)&&u.get(`EXT_color_buffer_float`),s}function te(e,t){let n;return e?t===null||t===1014||t===1020?n=l.DEPTH24_STENCIL8:t===1015?n=l.DEPTH32F_STENCIL8:t===1012&&(n=l.DEPTH24_STENCIL8,B(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):t===null||t===1014||t===1020?n=l.DEPTH_COMPONENT24:t===1015?n=l.DEPTH_COMPONENT32F:t===1012&&(n=l.DEPTH_COMPONENT16),n}function A(e,t){return D(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function j(e){let t=e.target;t.removeEventListener(`dispose`,j),M(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function ne(e){let t=e.target;t.removeEventListener(`dispose`,ne),re(t)}function M(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&N(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function N(e){let t=f.get(e);l.deleteTexture(t.__webglTexture);let n=e.source,r=S.get(n);delete r[t.__cacheKey],h.memory.textures--}function re(e){let t=f.get(e);if(e.depthTexture&&(e.depthTexture.dispose(),f.remove(e.depthTexture)),e.isWebGLCubeRenderTarget)for(let e=0;e<6;e++){if(Array.isArray(t.__webglFramebuffer[e]))for(let n=0;n<t.__webglFramebuffer[e].length;n++)l.deleteFramebuffer(t.__webglFramebuffer[e][n]);else l.deleteFramebuffer(t.__webglFramebuffer[e]);t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer[e])}else{if(Array.isArray(t.__webglFramebuffer))for(let e=0;e<t.__webglFramebuffer.length;e++)l.deleteFramebuffer(t.__webglFramebuffer[e]);else l.deleteFramebuffer(t.__webglFramebuffer);if(t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer),t.__webglMultisampledFramebuffer&&l.deleteFramebuffer(t.__webglMultisampledFramebuffer),t.__webglColorRenderbuffer)for(let e=0;e<t.__webglColorRenderbuffer.length;e++)t.__webglColorRenderbuffer[e]&&l.deleteRenderbuffer(t.__webglColorRenderbuffer[e]);t.__webglDepthRenderbuffer&&l.deleteRenderbuffer(t.__webglDepthRenderbuffer)}let n=e.textures;for(let e=0,t=n.length;e<t;e++){let t=f.get(n[e]);t.__webglTexture&&(l.deleteTexture(t.__webglTexture),h.memory.textures--),f.remove(n[e])}f.remove(e)}let ie=0;function ae(){ie=0}function oe(){return ie}function P(e){ie=e}function se(){let e=ie;return e>=p.maxTextures&&B(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+p.maxTextures),ie+=1,e}function ce(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function F(e,t){let n=f.get(e);if(e.isVideoTexture&&Me(e),e.isRenderTargetTexture===!1&&e.isExternalTexture!==!0&&e.version>0&&n.__version!==e.version){let r=e.image;if(r===null)B(`WebGLRenderer: Texture marked for update but no image data found.`);else if(r.complete===!1)B(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ye(n,e,t);return}}else e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null);d.bindTexture(l.TEXTURE_2D,n.__webglTexture,l.TEXTURE0+t)}function le(e,t){let n=f.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version){ye(n,e,t);return}else e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null);d.bindTexture(l.TEXTURE_2D_ARRAY,n.__webglTexture,l.TEXTURE0+t)}function ue(e,t){let n=f.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version){ye(n,e,t);return}d.bindTexture(l.TEXTURE_3D,n.__webglTexture,l.TEXTURE0+t)}function de(e,t){let n=f.get(e);if(e.isCubeDepthTexture!==!0&&e.version>0&&n.__version!==e.version){be(n,e,t);return}d.bindTexture(l.TEXTURE_CUBE_MAP,n.__webglTexture,l.TEXTURE0+t)}let fe={[e]:l.REPEAT,[t]:l.CLAMP_TO_EDGE,[n]:l.MIRRORED_REPEAT},pe={[r]:l.NEAREST,[i]:l.NEAREST_MIPMAP_NEAREST,[a]:l.NEAREST_MIPMAP_LINEAR,[o]:l.LINEAR,[s]:l.LINEAR_MIPMAP_NEAREST,[c]:l.LINEAR_MIPMAP_LINEAR},me={512:l.NEVER,519:l.ALWAYS,513:l.LESS,515:l.LEQUAL,514:l.EQUAL,518:l.GEQUAL,516:l.GREATER,517:l.NOTEQUAL};function he(e,t){if(t.type===1015&&u.has(`OES_texture_float_linear`)===!1&&(t.magFilter===1006||t.magFilter===1007||t.magFilter===1005||t.magFilter===1008||t.minFilter===1006||t.minFilter===1007||t.minFilter===1005||t.minFilter===1008)&&B(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),l.texParameteri(e,l.TEXTURE_WRAP_S,fe[t.wrapS]),l.texParameteri(e,l.TEXTURE_WRAP_T,fe[t.wrapT]),(e===l.TEXTURE_3D||e===l.TEXTURE_2D_ARRAY)&&l.texParameteri(e,l.TEXTURE_WRAP_R,fe[t.wrapR]),l.texParameteri(e,l.TEXTURE_MAG_FILTER,pe[t.magFilter]),l.texParameteri(e,l.TEXTURE_MIN_FILTER,pe[t.minFilter]),t.compareFunction&&(l.texParameteri(e,l.TEXTURE_COMPARE_MODE,l.COMPARE_REF_TO_TEXTURE),l.texParameteri(e,l.TEXTURE_COMPARE_FUNC,me[t.compareFunction])),u.has(`EXT_texture_filter_anisotropic`)===!0){if(t.magFilter===1003||t.minFilter!==1005&&t.minFilter!==1008||t.type===1015&&u.has(`OES_texture_float_linear`)===!1)return;if(t.anisotropy>1||f.get(t).__currentAnisotropy){let n=u.get(`EXT_texture_filter_anisotropic`);l.texParameterf(e,n.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(t.anisotropy,p.getMaxAnisotropy())),f.get(t).__currentAnisotropy=t.anisotropy}}}function ge(e,t){let n=!1;e.__webglInit===void 0&&(e.__webglInit=!0,t.addEventListener(`dispose`,j));let r=t.source,i=S.get(r);i===void 0&&(i={},S.set(r,i));let a=ce(t);if(a!==e.__cacheKey){i[a]===void 0&&(i[a]={texture:l.createTexture(),usedTimes:0},h.memory.textures++,n=!0),i[a].usedTimes++;let r=i[e.__cacheKey];r!==void 0&&(i[e.__cacheKey].usedTimes--,r.usedTimes===0&&N(t)),e.__cacheKey=a,e.__webglTexture=i[a].texture}return n}function _e(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ve(e,t,n,r){let i=e.updateRanges;if(i.length===0)d.texSubImage2D(l.TEXTURE_2D,0,0,0,t.width,t.height,n,r,t.data);else{i.sort((e,t)=>e.start-t.start);let a=0;for(let e=1;e<i.length;e++){let n=i[a],r=i[e],o=n.start+n.count,s=_e(r.start,t.width,4),c=_e(n.start,t.width,4);r.start<=o+1&&s===c&&_e(r.start+r.count-1,t.width,4)===s?n.count=Math.max(n.count,r.start+r.count-n.start):(++a,i[a]=r)}i.length=a+1;let o=d.getParameter(l.UNPACK_ROW_LENGTH),s=d.getParameter(l.UNPACK_SKIP_PIXELS),c=d.getParameter(l.UNPACK_SKIP_ROWS);d.pixelStorei(l.UNPACK_ROW_LENGTH,t.width);for(let e=0,a=i.length;e<a;e++){let a=i[e],o=Math.floor(a.start/4),s=Math.ceil(a.count/4),c=o%t.width,u=Math.floor(o/t.width),f=s;d.pixelStorei(l.UNPACK_SKIP_PIXELS,c),d.pixelStorei(l.UNPACK_SKIP_ROWS,u),d.texSubImage2D(l.TEXTURE_2D,0,c,u,f,1,n,r,t.data)}e.clearUpdateRanges(),d.pixelStorei(l.UNPACK_ROW_LENGTH,o),d.pixelStorei(l.UNPACK_SKIP_PIXELS,s),d.pixelStorei(l.UNPACK_SKIP_ROWS,c)}}function ye(e,t,n){let r=l.TEXTURE_2D;(t.isDataArrayTexture||t.isCompressedArrayTexture)&&(r=l.TEXTURE_2D_ARRAY),t.isData3DTexture&&(r=l.TEXTURE_3D);let i=ge(e,t),a=t.source;d.bindTexture(r,e.__webglTexture,l.TEXTURE0+n);let o=f.get(a);if(a.version!==o.__version||i===!0){if(d.activeTexture(l.TEXTURE0+n),!(typeof ImageBitmap<`u`&&t.image instanceof ImageBitmap)){let e=K.getPrimaries(K.workingColorSpace),n=t.colorSpace===``?null:K.getPrimaries(t.colorSpace),r=t.colorSpace===``||e===n?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,r)}d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment);let e=T(t.image,!1,p.maxTextureSize);e=L(t,e);let s=m.convert(t.format,t.colorSpace),c=m.convert(t.type),u=k(t.internalFormat,s,c,t.normalized,t.colorSpace,t.isVideoTexture);he(r,t);let f,h=t.mipmaps,g=t.isVideoTexture!==!0,_=o.__version===void 0||i===!0,v=a.dataReady,y=A(t,e);if(t.isDepthTexture)u=te(t.format===E,t.type),_&&(g?d.texStorage2D(l.TEXTURE_2D,1,u,e.width,e.height):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,null));else if(t.isDataTexture)if(h.length>0){g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data);t.generateMipmaps=!1}else g?(_&&d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height),v&&ve(t,e,s,c)):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,e.data);else if(t.isCompressedTexture)if(t.isCompressedArrayTexture){g&&_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,h[0].width,h[0].height,e.depth);for(let n=0,r=h.length;n<r;n++)if(f=h[n],t.format!==1023)if(s!==null)if(g){if(v)if(t.layerUpdates.size>0){let e=Wo(f.width,f.height,t.format,t.type);for(let r of t.layerUpdates){let t=f.data.subarray(r*e/f.data.BYTES_PER_ELEMENT,(r+1)*e/f.data.BYTES_PER_ELEMENT);d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,r,f.width,f.height,1,s,t)}t.clearLayerUpdates()}else d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,f.data)}else d.compressedTexImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,f.data,0,0);else B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`);else g?v&&d.texSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,c,f.data):d.texImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,s,c,f.data)}else{g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,n=h.length;e<n;e++)f=h[e],t.format===1023?g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data):s===null?B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&d.compressedTexSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,f.data):d.compressedTexImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,f.data)}else if(t.isDataArrayTexture)if(g){if(_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,e.width,e.height,e.depth),v)if(t.layerUpdates.size>0){let n=Wo(e.width,e.height,t.format,t.type);for(let r of t.layerUpdates){let t=e.data.subarray(r*n/e.data.BYTES_PER_ELEMENT,(r+1)*n/e.data.BYTES_PER_ELEMENT);d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,r,e.width,e.height,1,s,c,t)}t.clearLayerUpdates()}else d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)}else d.texImage3D(l.TEXTURE_2D_ARRAY,0,u,e.width,e.height,e.depth,0,s,c,e.data);else if(t.isData3DTexture)g?(_&&d.texStorage3D(l.TEXTURE_3D,y,u,e.width,e.height,e.depth),v&&d.texSubImage3D(l.TEXTURE_3D,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)):d.texImage3D(l.TEXTURE_3D,0,u,e.width,e.height,e.depth,0,s,c,e.data);else if(t.isFramebufferTexture){if(_)if(g)d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height);else{let t=e.width,n=e.height;for(let e=0;e<y;e++)d.texImage2D(l.TEXTURE_2D,e,u,t,n,0,s,c,null),t>>=1,n>>=1}}else if(t.isHTMLTexture){if(`texElementImage2D`in l){let n=l.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),e.parentNode!==n){n.appendChild(e),b.add(t),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}let r=l.RGBA,i=l.RGBA,a=l.UNSIGNED_BYTE;l.texElementImage2D(l.TEXTURE_2D,0,r,i,a,e),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let e=Ne(h[0]);d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height)}for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,s,c,f):d.texImage2D(l.TEXTURE_2D,e,u,s,c,f);t.generateMipmaps=!1}else if(g){if(_){let t=Ne(e);d.texStorage2D(l.TEXTURE_2D,y,u,t.width,t.height)}v&&d.texSubImage2D(l.TEXTURE_2D,0,0,0,s,c,e)}else d.texImage2D(l.TEXTURE_2D,0,u,s,c,e);D(t)&&ee(r),o.__version=a.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function be(e,t,n){if(t.image.length!==6)return;let r=ge(e,t),i=t.source;d.bindTexture(l.TEXTURE_CUBE_MAP,e.__webglTexture,l.TEXTURE0+n);let a=f.get(i);if(i.version!==a.__version||r===!0){d.activeTexture(l.TEXTURE0+n);let e=K.getPrimaries(K.workingColorSpace),o=t.colorSpace===``?null:K.getPrimaries(t.colorSpace),s=t.colorSpace===``||e===o?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,s);let c=t.isCompressedTexture||t.image[0].isCompressedTexture,u=t.image[0]&&t.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!c&&!u?f[e]=T(t.image[e],!0,p.maxCubemapSize):f[e]=u?t.image[e].image:t.image[e],f[e]=L(t,f[e]);let h=f[0],g=m.convert(t.format,t.colorSpace),_=m.convert(t.type),v=k(t.internalFormat,g,_,t.normalized,t.colorSpace),y=t.isVideoTexture!==!0,b=a.__version===void 0||r===!0,x=i.dataReady,S=A(t,h);he(l.TEXTURE_CUBE_MAP,t);let C;if(c){y&&b&&d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let e=0;e<6;e++){C=f[e].mipmaps;for(let n=0;n<C.length;n++){let r=C[n];t.format===1023?y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,_,r.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,g,_,r.data):g===null?B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&d.compressedTexSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,r.data):d.compressedTexImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,r.data)}}}else{if(C=t.mipmaps,y&&b){C.length>0&&S++;let e=Ne(f[0]);d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,e.width,e.height)}for(let e=0;e<6;e++)if(u){y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,f[e].width,f[e].height,g,_,f[e].data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,f[e].width,f[e].height,0,g,_,f[e].data);for(let t=0;t<C.length;t++){let n=C[t].image[e].image;y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,n.width,n.height,g,_,n.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,n.width,n.height,0,g,_,n.data)}}else{y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,g,_,f[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,g,_,f[e]);for(let t=0;t<C.length;t++){let n=C[t];y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,g,_,n.image[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,g,_,n.image[e])}}}D(t)&&ee(l.TEXTURE_CUBE_MAP),a.__version=i.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function xe(e,t,n,r,i,a){let o=m.convert(n.format,n.colorSpace),s=m.convert(n.type),c=k(n.internalFormat,o,s,n.normalized,n.colorSpace),u=f.get(t),p=f.get(n);if(p.__renderTarget=t,!u.__hasExternalTextures){let e=Math.max(1,t.width>>a),n=Math.max(1,t.height>>a);i===l.TEXTURE_3D||i===l.TEXTURE_2D_ARRAY?d.texImage3D(i,a,c,e,n,t.depth,0,o,s,null):d.texImage2D(i,a,c,e,n,0,o,s,null)}d.bindFramebuffer(l.FRAMEBUFFER,e),je(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,r,i,p.__webglTexture,0,Ae(t)):(i===l.TEXTURE_2D||i>=l.TEXTURE_CUBE_MAP_POSITIVE_X&&i<=l.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&l.framebufferTexture2D(l.FRAMEBUFFER,r,i,p.__webglTexture,a),d.bindFramebuffer(l.FRAMEBUFFER,null)}function Se(e,t,n){if(l.bindRenderbuffer(l.RENDERBUFFER,e),t.depthBuffer){let r=t.depthTexture,i=r&&r.isDepthTexture?r.type:null,a=te(t.stencilBuffer,i),o=t.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;je(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Ae(t),a,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Ae(t),a,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,a,t.width,t.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,o,l.RENDERBUFFER,e)}else{let e=t.textures;for(let r=0;r<e.length;r++){let i=e[r],a=m.convert(i.format,i.colorSpace),o=m.convert(i.type),s=k(i.internalFormat,a,o,i.normalized,i.colorSpace);je(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Ae(t),s,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Ae(t),s,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,s,t.width,t.height)}}l.bindRenderbuffer(l.RENDERBUFFER,null)}function Ce(e,t,n){let r=t.isWebGLCubeRenderTarget===!0;if(d.bindFramebuffer(l.FRAMEBUFFER,e),!(t.depthTexture&&t.depthTexture.isDepthTexture))throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);let i=f.get(t.depthTexture);if(i.__renderTarget=t,(!i.__webglTexture||t.depthTexture.image.width!==t.width||t.depthTexture.image.height!==t.height)&&(t.depthTexture.image.width=t.width,t.depthTexture.image.height=t.height,t.depthTexture.needsUpdate=!0),r){if(i.__webglInit===void 0&&(i.__webglInit=!0,t.depthTexture.addEventListener(`dispose`,j)),i.__webglTexture===void 0){i.__webglTexture=l.createTexture(),d.bindTexture(l.TEXTURE_CUBE_MAP,i.__webglTexture),he(l.TEXTURE_CUBE_MAP,t.depthTexture);let e=m.convert(t.depthTexture.format),n=m.convert(t.depthTexture.type),r;t.depthTexture.format===1026?r=l.DEPTH_COMPONENT24:t.depthTexture.format===1027&&(r=l.DEPTH24_STENCIL8);for(let i=0;i<6;i++)l.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,r,t.width,t.height,0,e,n,null)}}else F(t.depthTexture,0);let a=i.__webglTexture,o=Ae(t),s=r?l.TEXTURE_CUBE_MAP_POSITIVE_X+n:l.TEXTURE_2D,c=t.depthTexture.format===1027?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;if(t.depthTexture.format===1026)je(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else if(t.depthTexture.format===1027)je(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else throw Error(`Unknown depthTexture format`)}function we(e){let t=f.get(e),n=e.isWebGLCubeRenderTarget===!0;if(t.__boundDepthTexture!==e.depthTexture){let n=e.depthTexture;if(t.__depthDisposeCallback&&t.__depthDisposeCallback(),n){let e=()=>{delete t.__boundDepthTexture,delete t.__depthDisposeCallback,n.removeEventListener(`dispose`,e)};n.addEventListener(`dispose`,e),t.__depthDisposeCallback=e}t.__boundDepthTexture=n}if(e.depthTexture&&!t.__autoAllocateDepthBuffer)if(n)for(let n=0;n<6;n++)Ce(t.__webglFramebuffer[n],e,n);else{let n=e.texture.mipmaps;n&&n.length>0?Ce(t.__webglFramebuffer[0],e,0):Ce(t.__webglFramebuffer,e,0)}else if(n){t.__webglDepthbuffer=[];for(let n=0;n<6;n++)if(d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[n]),t.__webglDepthbuffer[n]===void 0)t.__webglDepthbuffer[n]=l.createRenderbuffer(),Se(t.__webglDepthbuffer[n],e,!1);else{let r=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,i=t.__webglDepthbuffer[n];l.bindRenderbuffer(l.RENDERBUFFER,i),l.framebufferRenderbuffer(l.FRAMEBUFFER,r,l.RENDERBUFFER,i)}}else{let n=e.texture.mipmaps;if(n&&n.length>0?d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[0]):d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer),t.__webglDepthbuffer===void 0)t.__webglDepthbuffer=l.createRenderbuffer(),Se(t.__webglDepthbuffer,e,!1);else{let n=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,r=t.__webglDepthbuffer;l.bindRenderbuffer(l.RENDERBUFFER,r),l.framebufferRenderbuffer(l.FRAMEBUFFER,n,l.RENDERBUFFER,r)}}d.bindFramebuffer(l.FRAMEBUFFER,null)}function Te(e,t,n){let r=f.get(e);t!==void 0&&xe(r.__webglFramebuffer,e,e.texture,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,0),n!==void 0&&we(e)}function Ee(e){let t=e.texture,n=f.get(e),r=f.get(t);e.addEventListener(`dispose`,ne);let i=e.textures,a=e.isWebGLCubeRenderTarget===!0,o=i.length>1;if(o||(r.__webglTexture===void 0&&(r.__webglTexture=l.createTexture()),r.__version=t.version,h.memory.textures++),a){n.__webglFramebuffer=[];for(let e=0;e<6;e++)if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer[e]=[];for(let r=0;r<t.mipmaps.length;r++)n.__webglFramebuffer[e][r]=l.createFramebuffer()}else n.__webglFramebuffer[e]=l.createFramebuffer()}else{if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer=[];for(let e=0;e<t.mipmaps.length;e++)n.__webglFramebuffer[e]=l.createFramebuffer()}else n.__webglFramebuffer=l.createFramebuffer();if(o)for(let e=0,t=i.length;e<t;e++){let t=f.get(i[e]);t.__webglTexture===void 0&&(t.__webglTexture=l.createTexture(),h.memory.textures++)}if(e.samples>0&&je(e)===!1){n.__webglMultisampledFramebuffer=l.createFramebuffer(),n.__webglColorRenderbuffer=[],d.bindFramebuffer(l.FRAMEBUFFER,n.__webglMultisampledFramebuffer);for(let t=0;t<i.length;t++){let r=i[t];n.__webglColorRenderbuffer[t]=l.createRenderbuffer(),l.bindRenderbuffer(l.RENDERBUFFER,n.__webglColorRenderbuffer[t]);let a=m.convert(r.format,r.colorSpace),o=m.convert(r.type),s=k(r.internalFormat,a,o,r.normalized,r.colorSpace,e.isXRRenderTarget===!0),c=Ae(e);l.renderbufferStorageMultisample(l.RENDERBUFFER,c,s,e.width,e.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+t,l.RENDERBUFFER,n.__webglColorRenderbuffer[t])}l.bindRenderbuffer(l.RENDERBUFFER,null),e.depthBuffer&&(n.__webglDepthRenderbuffer=l.createRenderbuffer(),Se(n.__webglDepthRenderbuffer,e,!0)),d.bindFramebuffer(l.FRAMEBUFFER,null)}}if(a){d.bindTexture(l.TEXTURE_CUBE_MAP,r.__webglTexture),he(l.TEXTURE_CUBE_MAP,t);for(let r=0;r<6;r++)if(t.mipmaps&&t.mipmaps.length>0)for(let i=0;i<t.mipmaps.length;i++)xe(n.__webglFramebuffer[r][i],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,i);else xe(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,0);D(t)&&ee(l.TEXTURE_CUBE_MAP),d.unbindTexture()}else if(o){for(let t=0,r=i.length;t<r;t++){let r=i[t],a=f.get(r),o=l.TEXTURE_2D;(e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(o=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(o,a.__webglTexture),he(o,r),xe(n.__webglFramebuffer,e,r,l.COLOR_ATTACHMENT0+t,o,0),D(r)&&ee(o)}d.unbindTexture()}else{let i=l.TEXTURE_2D;if((e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(i=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(i,r.__webglTexture),he(i,t),t.mipmaps&&t.mipmaps.length>0)for(let r=0;r<t.mipmaps.length;r++)xe(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,i,r);else xe(n.__webglFramebuffer,e,t,l.COLOR_ATTACHMENT0,i,0);D(t)&&ee(i),d.unbindTexture()}e.depthBuffer&&we(e)}function De(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(D(r)){let t=O(e),n=f.get(r).__webglTexture;d.bindTexture(t,n),ee(t),d.unbindTexture()}}}let Oe=[],ke=[];function I(e){if(e.samples>0){if(je(e)===!1){let t=e.textures,n=e.width,r=e.height,i=l.COLOR_BUFFER_BIT,a=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,o=f.get(e),s=t.length>1;if(s)for(let e=0;e<t.length;e++)d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,null),d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,null,0);d.bindFramebuffer(l.READ_FRAMEBUFFER,o.__webglMultisampledFramebuffer);let c=e.texture.mipmaps;c&&c.length>0?d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer[0]):d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer);for(let c=0;c<t.length;c++){if(e.resolveDepthBuffer&&(e.depthBuffer&&(i|=l.DEPTH_BUFFER_BIT),e.stencilBuffer&&e.resolveStencilBuffer&&(i|=l.STENCIL_BUFFER_BIT)),s){l.framebufferRenderbuffer(l.READ_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.RENDERBUFFER,o.__webglColorRenderbuffer[c]);let e=f.get(t[c]).__webglTexture;l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,e,0)}l.blitFramebuffer(0,0,n,r,0,0,n,r,i,l.NEAREST),_===!0&&(Oe.length=0,ke.length=0,Oe.push(l.COLOR_ATTACHMENT0+c),e.depthBuffer&&e.resolveDepthBuffer===!1&&(Oe.push(a),ke.push(a),l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,ke)),l.invalidateFramebuffer(l.READ_FRAMEBUFFER,Oe))}if(d.bindFramebuffer(l.READ_FRAMEBUFFER,null),d.bindFramebuffer(l.DRAW_FRAMEBUFFER,null),s)for(let e=0;e<t.length;e++){d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,o.__webglColorRenderbuffer[e]);let n=f.get(t[e]).__webglTexture;d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,n,0)}d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglMultisampledFramebuffer)}else if(e.depthBuffer&&e.resolveDepthBuffer===!1&&_){let t=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,[t])}}}function Ae(e){return Math.min(p.maxSamples,e.samples)}function je(e){let t=f.get(e);return e.samples>0&&u.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function Me(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function L(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(K.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&B(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):V(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ne(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=se,this.resetTextureUnits=ae,this.getTextureUnits=oe,this.setTextureUnits=P,this.setTexture2D=F,this.setTexture2DArray=le,this.setTexture3D=ue,this.setTextureCube=de,this.rebindTextures=Te,this.setupRenderTarget=Ee,this.updateRenderTargetMipmap=De,this.updateMultisampleRenderTarget=I,this.setupDepthRenderbuffer=we,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=je,this.isReversedDepthBuffer=function(){return d.buffers.depth.getReversed()}}function Yl(e,t){function n(n,r=``){let i,a=K.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===`srgb`)if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491)if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Xl=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Zl=`
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

}`,Ql=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new di(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ua({vertexShader:Xl,fragmentShader:Zl,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new J(new Ma(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},$l=class extends et{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,u=null,d=null,f=null,p=null,h=null,g=typeof XRWebGLBinding<`u`,_=new Ql,v={},b=t.getContextAttributes(),x=null,S=null,C=[],D=[],ee=new U,O=null,k=new Co;k.viewport=new Wt;let te=new Co;te.viewport=new Wt;let A=[k,te],j=new Ao,ne=null,M=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new En,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new En,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new En,C[e]=t),t.getHandSpace()};function N(e){let t=D.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function re(){r.removeEventListener(`select`,N),r.removeEventListener(`selectstart`,N),r.removeEventListener(`selectend`,N),r.removeEventListener(`squeeze`,N),r.removeEventListener(`squeezestart`,N),r.removeEventListener(`squeezeend`,N),r.removeEventListener(`end`,re),r.removeEventListener(`inputsourceschange`,ie);for(let e=0;e<C.length;e++){let t=D[e];t!==null&&(D[e]=null,C[e].disconnect(t))}ne=null,M=null,_.reset();for(let e in v)delete v[e];e.setRenderTarget(x),p=null,f=null,d=null,r=null,S=null,ue.stop(),n.isPresenting=!1,e.setPixelRatio(O),e.setSize(ee.width,ee.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&B(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&B(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return h},this.getSession=function(){return r},this.setSession=async function(u){if(r=u,r!==null){if(x=e.getRenderTarget(),r.addEventListener(`select`,N),r.addEventListener(`selectstart`,N),r.addEventListener(`selectend`,N),r.addEventListener(`squeeze`,N),r.addEventListener(`squeezestart`,N),r.addEventListener(`squeezeend`,N),r.addEventListener(`end`,re),r.addEventListener(`inputsourceschange`,ie),b.xrCompatible!==!0&&await t.makeXRCompatible(),O=e.getPixelRatio(),e.getSize(ee),g&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;b.depth&&(o=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=b.stencil?E:T,a=b.stencil?y:m);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};d=this.getBinding(),f=d.createProjectionLayer(s),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Kt(f.textureWidth,f.textureHeight,{format:w,type:l,depthTexture:new li(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new Kt(p.framebufferWidth,p.framebufferHeight,{format:w,type:l,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ue.setContext(r),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function ie(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=D.indexOf(n);r>=0&&(D[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=D.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=D.length){D.push(n),r=e;break}else if(D[e]===null){D[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let ae=new W,oe=new W;function P(e,t,n){ae.setFromMatrixPosition(t.matrixWorld),oe.setFromMatrixPosition(n.matrixWorld);let r=ae.distanceTo(oe),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function se(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),j.near=te.near=k.near=t,j.far=te.far=k.far=n,(ne!==j.near||M!==j.far)&&(r.updateRenderState({depthNear:j.near,depthFar:j.far}),ne=j.near,M=j.far),j.layers.mask=e.layers.mask|6,k.layers.mask=j.layers.mask&-5,te.layers.mask=j.layers.mask&-3;let i=e.parent,a=j.cameras;se(j,i);for(let e=0;e<a.length;e++)se(a[e],i);a.length===2?P(j,k,te):j.projectionMatrix.copy(k.projectionMatrix),ce(e,j,i)};function ce(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=it*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return j},this.getFoveation=function(){if(!(f===null&&p===null))return s},this.setFoveation=function(e){s=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(j)},this.getCameraTexture=function(e){return v[e]};let F=null;function le(t,i){if(u=i.getViewerPose(c||a),h=i,u!==null){let t=u.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==j.cameras.length&&(j.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=d.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=A[n];o===void 0&&(o=new Co,o.layers.enable(n),o.viewport=new Wt,A[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(j.matrix.copy(o.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale)),i===!0&&j.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&g){d=n.getBinding();let e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&g){e.state.unbindTexture(),d=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new di,v[n]=e);let t=d.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=D[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}F&&F(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),h=null}let ue=new Ko;ue.setAnimationLoop(le),this.setAnimationLoop=function(e){F=e},this.dispose=function(){}}},eu=new Yt,tu=new G;tu.set(-1,0,0,0,1,0,0,0,1);function nu(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,za(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(eu.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(tu),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function ru(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(m(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return V(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let t=0,n=r.length;t<n;t++){let n=Array.isArray(r[t])?r[t]:[r[t]];for(let r=0,i=n.length;r<i;r++){let i=n[r];if(p(i,t,r,a)===!0){let t=i.__offset,n=Array.isArray(i.value)?i.value:[i.value],r=0;for(let a=0;a<n.length;a++){let o=n[a],s=h(o);typeof o==`number`||typeof o==`boolean`?(i.__data[0]=o,e.bufferSubData(e.UNIFORM_BUFFER,t+r,i.__data)):o.isMatrix3?(i.__data[0]=o.elements[0],i.__data[1]=o.elements[1],i.__data[2]=o.elements[2],i.__data[3]=0,i.__data[4]=o.elements[3],i.__data[5]=o.elements[4],i.__data[6]=o.elements[5],i.__data[7]=0,i.__data[8]=o.elements[6],i.__data[9]=o.elements[7],i.__data[10]=o.elements[8],i.__data[11]=0):ArrayBuffer.isView(o)?i.__data.set(new o.constructor(o.buffer,o.byteOffset,i.__data.length)):(o.toArray(i.__data,r),r+=s.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,t,i.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return typeof i==`number`||typeof i==`boolean`?r[a]=i:ArrayBuffer.isView(i)?r[a]=i.slice():r[a]=i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=h(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?B(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):B(`WebGLRenderer: Unsupported uniform value type.`,e),t}function g(t){let n=t.target;n.removeEventListener(`dispose`,g);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:_}}var iu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),au=null;function ou(){return au===null&&(au=new Qr(iu,16,16,O,g),au.name=`DFG_LUT`,au.minFilter=o,au.magFilter=o,au.wrapS=t,au.wrapT=t,au.generateMipmaps=!1,au.needsUpdate=!0),au}var su=class{constructor(e={}){let{canvas:t=Ke(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:u=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:b=l}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);x=n.getContextAttributes().alpha}else x=a;let S=b,C=new Set([te,k,ee]),w=new Set([l,m,f,y,_,v]),T=new Uint32Array(4),E=new Int32Array(4),D=new W,O=null,A=null,j=[],ne=[],M=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let N=this,re=!1,ie=null;this._outputColorSpace=Ie;let ae=0,oe=0,P=null,se=-1,ce=null,F=new Wt,le=new Wt,ue=null,de=new q(0),fe=0,pe=t.width,me=t.height,he=1,ge=null,_e=null,ve=new Wt(0,0,pe,me),ye=new Wt(0,0,pe,me),be=!1,xe=new oi,Se=!1,Ce=!1,we=new Yt,Te=new W,Ee=new Wt,De={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Oe=!1;function ke(){return P===null?he:1}let I=n;function Ae(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:p};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r184`),t.addEventListener(`webglcontextlost`,it,!1),t.addEventListener(`webglcontextrestored`,at,!1),t.addEventListener(`webglcontextcreationerror`,H,!1),I===null){let t=`webgl2`;if(I=Ae(t,e),I===null)throw Ae(t)?Error(`Error creating WebGL context with your selected attributes.`):Error(`Error creating WebGL context.`)}}catch(e){throw V(`WebGLRenderer: `+e.message),e}let je,Me,L,Ne,R,z,Pe,Fe,Le,Re,ze,Be,Ve,Ue,We,Ge,qe,Je,Xe,Ze,$e,et,tt;function nt(){je=new Ts(I),je.init(),$e=new Yl(I,je),Me=new ts(I,je,e,$e),L=new ql(I,je),Me.reversedDepthBuffer&&h&&L.buffers.depth.setReversed(!0),Ne=new Os(I),R=new Dl,z=new Jl(I,je,L,R,Me,$e,Ne),Pe=new ws(N),Fe=new qo(I),et=new $o(I,Fe),Le=new Es(I,Fe,Ne,et),Re=new As(I,Le,Fe,et,Ne),Je=new ks(I,Me,z),We=new ns(R),ze=new El(N,Pe,je,Me,et,We),Be=new nu(N,R),Ve=new jl,Ue=new Rl(je),qe=new Qo(N,Pe,L,Re,x,s),Ge=new Kl(N,Re,Me),tt=new ru(I,Ne,Me,L),Xe=new es(I,je,Ne),Ze=new Ds(I,je,Ne),Ne.programs=ze.programs,N.capabilities=Me,N.extensions=je,N.properties=R,N.renderLists=Ve,N.shadowMap=Ge,N.state=L,N.info=Ne}nt(),S!==1009&&(M=new Ms(S,t.width,t.height,r,i));let rt=new $l(N,I);this.xr=rt,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let e=je.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=je.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return he},this.setPixelRatio=function(e){e!==void 0&&(he=e,this.setSize(pe,me,!1))},this.getSize=function(e){return e.set(pe,me)},this.setSize=function(e,n,r=!0){if(rt.isPresenting){B(`WebGLRenderer: Can't change size while VR device is presenting.`);return}pe=e,me=n,t.width=Math.floor(e*he),t.height=Math.floor(n*he),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),M!==null&&M.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(pe*he,me*he).floor()},this.setDrawingBufferSize=function(e,n,r){pe=e,me=n,he=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(S===1009){V(`THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){B(`THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}M.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(F)},this.getViewport=function(e){return e.copy(ve)},this.setViewport=function(e,t,n,r){e.isVector4?ve.set(e.x,e.y,e.z,e.w):ve.set(e,t,n,r),L.viewport(F.copy(ve).multiplyScalar(he).round())},this.getScissor=function(e){return e.copy(ye)},this.setScissor=function(e,t,n,r){e.isVector4?ye.set(e.x,e.y,e.z,e.w):ye.set(e,t,n,r),L.scissor(le.copy(ye).multiplyScalar(he).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(e){L.setScissorTest(be=e)},this.setOpaqueSort=function(e){ge=e},this.setTransparentSort=function(e){_e=e},this.getClearColor=function(e){return e.copy(qe.getClearColor())},this.setClearColor=function(){qe.setClearColor(...arguments)},this.getClearAlpha=function(){return qe.getClearAlpha()},this.setClearAlpha=function(){qe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(P!==null){let t=P.texture.format;e=C.has(t)}if(e){let e=P.texture.type,t=w.has(e),n=qe.getClearColor(),r=qe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,I.clearBufferuiv(I.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,I.clearBufferiv(I.COLOR,0,E))}else r|=I.COLOR_BUFFER_BIT}t&&(r|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&I.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),ie=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,it,!1),t.removeEventListener(`webglcontextrestored`,at,!1),t.removeEventListener(`webglcontextcreationerror`,H,!1),qe.dispose(),Ve.dispose(),Ue.dispose(),R.dispose(),Pe.dispose(),Re.dispose(),et.dispose(),tt.dispose(),ze.dispose(),rt.dispose(),rt.removeEventListener(`sessionstart`,ft),rt.removeEventListener(`sessionend`,pt),mt.stop()};function it(e){e.preventDefault(),Ye(`WebGLRenderer: Context Lost.`),re=!0}function at(){Ye(`WebGLRenderer: Context Restored.`),re=!1;let e=Ne.autoReset,t=Ge.enabled,n=Ge.autoUpdate,r=Ge.needsUpdate,i=Ge.type;nt(),Ne.autoReset=e,Ge.enabled=t,Ge.autoUpdate=n,Ge.needsUpdate=r,Ge.type=i}function H(e){V(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ot(e){let t=e.target;t.removeEventListener(`dispose`,ot),st(t)}function st(e){ct(e),R.remove(e)}function ct(e){let t=R.get(e).programs;t!==void 0&&(t.forEach(function(e){ze.releaseProgram(e)}),e.isShaderMaterial&&ze.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=De);let o=i.isMesh&&i.matrixWorld.determinant()<0,s=wt(e,t,n,r,i);L.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Le.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;et.setup(i,r,s,n,c);let h,g=Xe;if(c!==null&&(h=Fe.get(c),g=Ze,g.setIndex(h)),i.isMesh)r.wireframe===!0?(L.setLineWidth(r.wireframeLinewidth*ke()),g.setMode(I.LINES)):g.setMode(I.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),L.setLineWidth(e*ke()),i.isLineSegments?g.setMode(I.LINES):i.isLineLoop?g.setMode(I.LINE_LOOP):g.setMode(I.LINE_STRIP)}else i.isPoints?g.setMode(I.POINTS):i.isSprite&&g.setMode(I.TRIANGLES);if(i.isBatchedMesh)if(je.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Fe.get(c).bytesPerElement:1,o=R.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(I,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function lt(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,bt(e,t,n),e.side=0,e.needsUpdate=!0,bt(e,t,n),e.side=2):bt(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),A=Ue.get(n),A.init(t),ne.push(A),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(A.pushLight(e),e.castShadow&&A.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(A.pushLight(e),e.castShadow&&A.pushShadow(e))}),A.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t)if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];lt(a,n,e),r.add(a)}else lt(t,n,e),r.add(t)}),A=ne.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){R.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}je.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let ut=null;function dt(e){ut&&ut(e)}function ft(){mt.stop()}function pt(){mt.start()}let mt=new Ko;mt.setAnimationLoop(dt),typeof self<`u`&&mt.setContext(self),this.setAnimationLoop=function(e){ut=e,rt.setAnimationLoop(e),e===null?mt.stop():mt.start()},rt.addEventListener(`sessionstart`,ft),rt.addEventListener(`sessionend`,pt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){V(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(re===!0)return;ie!==null&&ie.renderStart(e,t);let n=rt.enabled===!0&&rt.isPresenting===!0,r=M!==null&&(P===null||n)&&M.begin(N,P);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),rt.enabled===!0&&rt.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(rt.cameraAutoUpdate===!0&&rt.updateCamera(t),t=rt.getCamera()),e.isScene===!0&&e.onBeforeRender(N,e,t,P),A=Ue.get(e,ne.length),A.init(t),A.state.textureUnits=z.getTextureUnits(),ne.push(A),we.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),xe.setFromProjectionMatrix(we,He,t.reversedDepth),Ce=this.localClippingEnabled,Se=We.init(this.clippingPlanes,Ce),O=Ve.get(e,j.length),O.init(),j.push(O),rt.enabled===!0&&rt.isPresenting===!0){let e=N.xr.getDepthSensingMesh();e!==null&&ht(e,t,-1/0,N.sortObjects)}ht(e,t,0,N.sortObjects),O.finish(),N.sortObjects===!0&&O.sort(ge,_e),Oe=rt.enabled===!1||rt.isPresenting===!1||rt.hasDepthSensing()===!1,Oe&&qe.addToRenderList(O,e),this.info.render.frame++,Se===!0&&We.beginShadows();let i=A.state.shadowsArray;if(Ge.render(i,e,t),Se===!0&&We.endShadows(),this.info.autoReset===!0&&this.info.reset(),(r&&M.hasRenderPass())===!1){let n=O.opaque,r=O.transmissive;if(A.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];_t(n,r,e,a)}Oe&&qe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];gt(O,e,n,n.viewport)}}else r.length>0&&_t(n,r,e,t),Oe&&qe.render(e),gt(O,e,t)}P!==null&&oe===0&&(z.updateMultisampleRenderTarget(P),z.updateRenderTargetMipmap(P)),r&&M.end(N),e.isScene===!0&&e.onAfterRender(N,e,t),et.resetDefaultState(),se=-1,ce=null,ne.pop(),ne.length>0?(A=ne[ne.length-1],z.setTextureUnits(A.state.textureUnits),Se===!0&&We.setGlobalState(N.clippingPlanes,A.state.camera)):A=null,j.pop(),O=j.length>0?j[j.length-1]:null,ie!==null&&ie.renderEnd()};function ht(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)A.pushLightProbeGrid(e);else if(e.isLight)A.pushLight(e),e.castShadow&&A.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||xe.intersectsSprite(e)){r&&Ee.setFromMatrixPosition(e.matrixWorld).applyMatrix4(we);let t=Re.update(e),i=e.material;i.visible&&O.push(e,t,i,n,Ee.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||xe.intersectsObject(e))){let t=Re.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),Ee.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ee.copy(e.boundingSphere.center)),Ee.applyMatrix4(e.matrixWorld).applyMatrix4(we)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&O.push(e,t,s,n,Ee.z,o)}}else i.visible&&O.push(e,t,i,n,Ee.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)ht(i[e],t,n,r)}function gt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;A.setupLightsView(n),Se===!0&&We.setGlobalState(N.clippingPlanes,n),r&&L.viewport(F.copy(r)),i.length>0&&vt(i,t,n),a.length>0&&vt(a,t,n),o.length>0&&vt(o,t,n),L.buffers.depth.setTest(!0),L.buffers.depth.setMask(!0),L.buffers.color.setMask(!0),L.setPolygonOffset(!1)}function _t(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[r.id]===void 0){let e=je.has(`EXT_color_buffer_half_float`)||je.has(`EXT_color_buffer_float`);A.state.transmissionRenderTarget[r.id]=new Kt(1,1,{generateMipmaps:!0,type:e?g:l,minFilter:c,samples:Math.max(4,Me.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:K.workingColorSpace})}let a=A.state.transmissionRenderTarget[r.id],o=r.viewport||F;a.setSize(o.z*N.transmissionResolutionScale,o.w*N.transmissionResolutionScale);let s=N.getRenderTarget(),u=N.getActiveCubeFace(),d=N.getActiveMipmapLevel();N.setRenderTarget(a),N.getClearColor(de),fe=N.getClearAlpha(),fe<1&&N.setClearColor(16777215,.5),N.clear(),Oe&&qe.render(n);let f=N.toneMapping;N.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),A.setupLightsView(r),Se===!0&&We.setGlobalState(N.clippingPlanes,r),vt(e,n,r),z.updateMultisampleRenderTarget(a),z.updateRenderTargetMipmap(a),je.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,yt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(z.updateMultisampleRenderTarget(a),z.updateRenderTargetMipmap(a))}N.setRenderTarget(s,u,d),N.setClearColor(de,fe),p!==void 0&&(r.viewport=p),N.toneMapping=f}function vt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&yt(o,t,n,s,l,c)}}function yt(e,t,n,r,i,a){e.onBeforeRender(N,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(N,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=2):N.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(N,t,n,r,i,a)}function bt(e,t,n){t.isScene!==!0&&(t=De);let r=R.get(e),i=A.state.lights,a=A.state.shadowsArray,o=i.state.version,s=ze.getParameters(e,i.state,a,t,n,A.state.lightProbeGridArray),c=ze.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Pe.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ot),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return St(e,s),d}else s.uniforms=ze.getUniforms(e),ie!==null&&e.isNodeMaterial&&ie.build(e,n,s),e.onBeforeCompile(s,N),d=ze.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=We.uniform),St(e,s),r.needsLights=Et(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=A.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function xt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=zc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function St(e,t){let n=R.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Ct(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function wt(e,t,n,r,i){t.isScene!==!0&&(t=De),z.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=P===null?N.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:K.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Pe.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(h=N.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=R.get(r),y=A.state.lights;if(Se===!0&&(Ce===!0||e!==ce)){let t=e===ce&&r.id===se;We.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==We.numPlanes||v.numIntersection!==We.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=A.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=bt(r,t,i),ie&&r.isNodeMaterial&&ie.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(L.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==se&&(se=r.id,C=!0),v.needsLights){let e=Ct(A.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||ce!==e){L.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(I,`projectionMatrix`,e.projectionMatrix),T.setValue(I,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(I,Te.setFromMatrixPosition(e.matrixWorld)),Me.logarithmicDepthBuffer&&T.setValue(I,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(I,`isOrthographic`,e.isOrthographicCamera===!0),ce!==e&&(ce=e,C=!0,w=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&T.setValue(I,`directionalShadowMap`,y.state.directionalShadowMap,z),y.state.spotShadowMap.length>0&&T.setValue(I,`spotShadowMap`,y.state.spotShadowMap,z),y.state.pointShadowMap.length>0&&T.setValue(I,`pointShadowMap`,y.state.pointShadowMap,z)),i.isSkinnedMesh){T.setOptional(I,i,`bindMatrix`),T.setOptional(I,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(I,`boneTexture`,e.boneTexture,z))}i.isBatchedMesh&&(T.setOptional(I,i,`batchingTexture`),T.setValue(I,`batchingTexture`,i._matricesTexture,z),T.setOptional(I,i,`batchingIdTexture`),T.setValue(I,`batchingIdTexture`,i._indirectTexture,z),T.setOptional(I,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(I,`batchingColorTexture`,i._colorsTexture,z));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&Je.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(I,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=ou()),C){if(T.setValue(I,`toneMappingExposure`,N.toneMappingExposure),v.needsLights&&Tt(E,w),a&&r.fog===!0&&Be.refreshFogUniforms(E,a),Be.refreshMaterialUniforms(E,r,he,me,A.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}zc.upload(I,xt(v),E,z)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(zc.upload(I,xt(v),E,z),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(I,`center`,i.center),T.setValue(I,`modelViewMatrix`,i.modelViewMatrix),T.setValue(I,`normalMatrix`,i.normalMatrix),T.setValue(I,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];tt.update(n,x),tt.bind(n,x)}}return x}function Tt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Et(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ae},this.getActiveMipmapLevel=function(){return oe},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(e,t,n){let r=R.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),R.get(e.texture).__webglTexture=t,R.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=R.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0};let U=I.createFramebuffer();this.setRenderTarget=function(e,t=0,n=0){P=e,ae=t,oe=n;let r=null,i=!1,a=!1;if(e){let o=R.get(e);if(o.__useDefaultFramebuffer!==void 0){L.bindFramebuffer(I.FRAMEBUFFER,o.__webglFramebuffer),F.copy(e.viewport),le.copy(e.scissor),ue=e.scissorTest,L.viewport(F),L.scissor(le),L.setScissorTest(ue),se=-1;return}else if(o.__webglFramebuffer===void 0)z.setupRenderTarget(e);else if(o.__hasExternalTextures)z.rebindTextures(e,R.get(e.texture).__webglTexture,R.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&R.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.`);z.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=R.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&z.useMultisampledRTT(e)===!1?R.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,F.copy(e.viewport),le.copy(e.scissor),ue=e.scissorTest}else F.copy(ve).multiplyScalar(he).floor(),le.copy(ye).multiplyScalar(he).floor(),ue=be;if(n!==0&&(r=U),L.bindFramebuffer(I.FRAMEBUFFER,r)&&L.drawBuffers(e,r),L.viewport(F),L.scissor(le),L.setScissorTest(ue),i){let r=R.get(e.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=R.get(e.textures[t]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=R.get(e.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,t.__webglTexture,n)}se=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=R.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){L.bindFramebuffer(I.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+s),!Me.textureFormatReadable(c)){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!Me.textureTypeReadable(l)){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&I.readPixels(t,n,r,i,$e.convert(c),$e.convert(l),a)}finally{let e=P===null?null:R.get(P).__webglFramebuffer;L.bindFramebuffer(I.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=R.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c)if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){L.bindFramebuffer(I.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+s),!Me.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!Me.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,d),I.bufferData(I.PIXEL_PACK_BUFFER,a.byteLength,I.STREAM_READ),I.readPixels(t,n,r,i,$e.convert(l),$e.convert(u),0);let f=P===null?null:R.get(P).__webglFramebuffer;L.bindFramebuffer(I.FRAMEBUFFER,f);let p=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Qe(I,p,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,d),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,a),I.deleteBuffer(d),I.deleteSync(p),a}else throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;z.setTexture2D(e,0),I.copyTexSubImage2D(I.TEXTURE_2D,n,0,0,o,s,i,a),L.unbindTexture()};let Dt=I.createFramebuffer(),Ot=I.createFramebuffer();this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=$e.convert(t.format),_=$e.convert(t.type),v;t.isData3DTexture?(z.setTexture3D(t,0),v=I.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(z.setTexture2DArray(t,0),v=I.TEXTURE_2D_ARRAY):(z.setTexture2D(t,0),v=I.TEXTURE_2D),L.activeTexture(I.TEXTURE0),L.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,t.flipY),L.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),L.pixelStorei(I.UNPACK_ALIGNMENT,t.unpackAlignment);let y=L.getParameter(I.UNPACK_ROW_LENGTH),b=L.getParameter(I.UNPACK_IMAGE_HEIGHT),x=L.getParameter(I.UNPACK_SKIP_PIXELS),S=L.getParameter(I.UNPACK_SKIP_ROWS),C=L.getParameter(I.UNPACK_SKIP_IMAGES);L.pixelStorei(I.UNPACK_ROW_LENGTH,h.width),L.pixelStorei(I.UNPACK_IMAGE_HEIGHT,h.height),L.pixelStorei(I.UNPACK_SKIP_PIXELS,l),L.pixelStorei(I.UNPACK_SKIP_ROWS,u),L.pixelStorei(I.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=R.get(e),r=R.get(t),h=R.get(n.__renderTarget),g=R.get(r.__renderTarget);L.bindFramebuffer(I.READ_FRAMEBUFFER,h.__webglFramebuffer),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,R.get(e).__webglTexture,i,d+n),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,R.get(t).__webglTexture,a,m+n)),I.blitFramebuffer(l,u,o,s,f,p,o,s,I.DEPTH_BUFFER_BIT,I.NEAREST);L.bindFramebuffer(I.READ_FRAMEBUFFER,null),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||R.has(e)){let n=R.get(e),r=R.get(t);L.bindFramebuffer(I.READ_FRAMEBUFFER,Dt),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,Ot);for(let e=0;e<c;e++)w?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,n.__webglTexture,i),T?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,r.__webglTexture,a),i===0?T?I.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):I.copyTexSubImage2D(v,a,f,p,l,u,o,s):I.blitFramebuffer(l,u,o,s,f,p,o,s,I.COLOR_BUFFER_BIT,I.NEAREST);L.bindFramebuffer(I.READ_FRAMEBUFFER,null),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?I.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?I.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):I.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):I.texSubImage2D(I.TEXTURE_2D,a,f,p,o,s,g,_,h);L.pixelStorei(I.UNPACK_ROW_LENGTH,y),L.pixelStorei(I.UNPACK_IMAGE_HEIGHT,b),L.pixelStorei(I.UNPACK_SKIP_PIXELS,x),L.pixelStorei(I.UNPACK_SKIP_ROWS,S),L.pixelStorei(I.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&I.generateMipmap(v),L.unbindTexture()},this.initRenderTarget=function(e){R.get(e).__webglFramebuffer===void 0&&z.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?z.setTextureCube(e,0):e.isData3DTexture?z.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?z.setTexture2DArray(e,0):z.setTexture2D(e,0),L.unbindTexture()},this.resetState=function(){ae=0,oe=0,P=null,L.reset(),et.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return He}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=K._getDrawingBufferColorSpace(e),t.unpackColorSpace=K._getUnpackColorSpace()}},cu=[{id:`hatchback`,name:`Starter Hatchback`,shortName:`Hatchback`,description:`A balanced city car with forgiving handling and easy drift recovery.`,unlocked:!0,unlockText:`Unlocked`,colors:{body:`#f4d35e`,secondary:`#fff7cf`,glass:`#83c5e8`,accent:`#d49a22`,lights:`#fff6cc`,brake:`#ff3434`},visual:{type:`hatchback`,length:4.1,width:1.85,height:1.55,wheelRadius:.43,wheelWidth:.32,rideHeight:.52,spoiler:`lip`,panelStyle:`friendly-city`,archSize:1.02,rimStyle:`compact`,bodyLayers:3,specialty:[`short-hood`,`tall-cabin`,`smile-bumper`]},stats:{speed:62,acceleration:55,handling:74,braking:68,drift:58,offRoad:52,stability:78},physics:{maxSpeed:31,acceleration:18,braking:23,reverseSpeed:11,steerRate:2.35,grip:8.8,driftGrip:3.6,offRoadGrip:.78,mass:1,boost:12}},{id:`sports-coupe`,name:`Sports Coupe`,shortName:`Coupe`,description:`Low, quick, and playful. Built for sweeping city drifts.`,unlocked:!0,unlockText:`Unlocked`,colors:{body:`#e74c3c`,secondary:`#2f3640`,glass:`#9ee8ff`,accent:`#f6c04f`,lights:`#fff8db`,brake:`#ff2d2d`},visual:{type:`coupe`,length:4.55,width:1.98,height:1.24,wheelRadius:.46,wheelWidth:.36,rideHeight:.46,spoiler:`sport`,panelStyle:`swept-sport`,archSize:1.08,rimStyle:`sport`,bodyLayers:3,specialty:[`side-skirts`,`low-roofline`,`wide-tires`]},stats:{speed:82,acceleration:78,handling:68,braking:65,drift:82,offRoad:40,stability:58},physics:{maxSpeed:40,acceleration:24,braking:22,reverseSpeed:10,steerRate:2.15,grip:7.2,driftGrip:2.25,offRoadGrip:.58,mass:.92,boost:16}},{id:`suv`,name:`SUV`,shortName:`SUV`,description:`Stable, heavy, and confidence inspiring for relaxed city driving.`,unlocked:!0,unlockText:`Unlocked`,colors:{body:`#f6f1e7`,secondary:`#8d99ae`,glass:`#88c8e8`,accent:`#c7a15a`,lights:`#fff9d8`,brake:`#fa2e2e`},visual:{type:`suv`,length:4.9,width:2.16,height:1.92,wheelRadius:.55,wheelWidth:.38,rideHeight:.72,roofRails:!0,panelStyle:`premium-utility`,archSize:1.12,rimStyle:`touring`,bodyLayers:4,specialty:[`roof-rails`,`trunk-mass`,`high-clearance`]},stats:{speed:60,acceleration:46,handling:56,braking:82,drift:38,offRoad:66,stability:90},physics:{maxSpeed:30,acceleration:15,braking:28,reverseSpeed:10,steerRate:1.85,grip:9.8,driftGrip:5.8,offRoadGrip:.86,mass:1.35,boost:9}},{id:`supercar`,name:`Supercar`,shortName:`Supercar`,description:`The fastest Phase 4 car. Sharp, premium, and demanding at speed.`,unlocked:!0,unlockText:`Phase 4 local unlock`,colors:{body:`#1abc9c`,secondary:`#101820`,glass:`#b9f6ff`,accent:`#f4d35e`,lights:`#fff8d8`,brake:`#ff1f3d`},visual:{type:`supercar`,length:4.75,width:2.18,height:1.08,wheelRadius:.48,wheelWidth:.42,rideHeight:.38,spoiler:`wing`,diffuser:!0,panelStyle:`sharp-wedge`,archSize:1.12,rimStyle:`wide-performance`,bodyLayers:4,specialty:[`side-intakes`,`diffuser`,`front-splitter`]},stats:{speed:98,acceleration:94,handling:72,braking:72,drift:72,offRoad:22,stability:48},physics:{maxSpeed:48,acceleration:31,braking:24,reverseSpeed:9,steerRate:2,grip:6.9,driftGrip:2.6,offRoadGrip:.42,mass:.86,boost:22}},{id:`offroad-jeep`,name:`Off-Road Jeep`,shortName:`Jeep`,description:`Raised suspension, rugged tires, and the best grip on grass paths.`,unlocked:!0,unlockText:`Phase 4 local unlock`,colors:{body:`#607d3b`,secondary:`#2f3324`,glass:`#a9d6e5`,accent:`#e4c56a`,lights:`#fff2b6`,brake:`#ff3333`},visual:{type:`jeep`,length:4.35,width:2.04,height:1.88,wheelRadius:.58,wheelWidth:.44,rideHeight:.78,rollCage:!0,spareTire:!0,panelStyle:`rugged-open`,archSize:1.22,rimStyle:`offroad`,bodyLayers:4,specialty:[`roll-cage`,`spare-tire`,`roof-lights`,`fender-flares`]},stats:{speed:58,acceleration:52,handling:62,braking:68,drift:46,offRoad:95,stability:84},physics:{maxSpeed:29,acceleration:17,braking:22,reverseSpeed:12,steerRate:2.08,grip:8.2,driftGrip:4.7,offRoadGrip:1.04,mass:1.18,boost:10}},{id:`classic`,name:`Classic Car`,shortName:`Classic`,description:`A long vintage cruiser with chrome details and smooth momentum.`,unlocked:!0,unlockText:`Unlocked`,colors:{body:`#5f4bb6`,secondary:`#f7efe5`,glass:`#aed9e0`,accent:`#d4af37`,lights:`#fff6c9`,brake:`#f03535`},visual:{type:`classic`,length:5.25,width:1.98,height:1.42,wheelRadius:.48,wheelWidth:.32,rideHeight:.5,chrome:!0,panelStyle:`vintage-long`,archSize:1.06,rimStyle:`classic`,bodyLayers:3,specialty:[`chrome`,`rounded-hood`,`tail-fins`]},stats:{speed:64,acceleration:50,handling:42,braking:60,drift:50,offRoad:38,stability:72},physics:{maxSpeed:32,acceleration:16,braking:20,reverseSpeed:9,steerRate:1.55,grip:8,driftGrip:3.9,offRoadGrip:.62,mass:1.14,boost:8}}],lu=e=>cu.find(t=>t.id===e)??cu[0],uu=[{id:`downtown-dash`,type:`timeTrial`,name:`Downtown Dash`,description:`A clean sprint through the Downtown Core intersections.`,recommendedCar:`Starter Hatchback`,reward:130,xp:145,start:{position:[0,0,26],heading:Math.PI},checkpoints:[[0,-42],[44,-42],[44,42],[0,42],[-44,42],[-44,0],[0,16]],medalTimes:{S:42,Gold:50,Silver:62,Bronze:78}},{id:`highway-blast`,type:`timeTrial`,name:`Highway Blast`,description:`Fast highway markers built for Supercar and Sports Coupe.`,recommendedCar:`Supercar`,reward:155,xp:160,start:{position:[330,0,-172],heading:-Math.PI*.95},checkpoints:[[282,-142],[212,-106],[132,-78],[72,-62],[0,-128],[-185,-272],[-292,-326],[-360,-404]],medalTimes:{S:54,Gold:68,Silver:84,Bronze:108}},{id:`park-loop-run`,type:`timeTrial`,name:`Park Loop Run`,description:`Curved park roads with one soft shortcut.`,recommendedCar:`Off-Road Jeep`,reward:140,xp:150,start:{position:[-40,0,26],heading:-Math.PI*.5},checkpoints:[[-72,24],[-96,52],[-65,62],[-38,26],[-92,36]],medalTimes:{S:38,Gold:48,Silver:61,Bronze:78}},{id:`hill-climb-sprint`,type:`timeTrial`,name:`Hill Climb Sprint`,description:`A handling run up to the scenic viewpoint.`,recommendedCar:`Sports Coupe`,reward:165,xp:175,start:{position:[58,0,92],heading:Math.PI*.28},checkpoints:[[72,104],[94,120],[118,132],[132,136]],medalTimes:{S:32,Gold:40,Silver:52,Bronze:68}},{id:`airport-express-sprint`,type:`timeTrial`,name:`Airport Express Sprint`,description:`A longer expressway run from Downtown Core to Horizon Airport.`,recommendedCar:`Supercar`,reward:190,xp:210,start:{position:[0,0,-48],heading:Math.PI},checkpoints:[[0,-86],[-28,-162],[-92,-214],[-185,-272],[-292,-326],[-344,-366],[-360,-404],[-360,-350]],medalTimes:{S:62,Gold:76,Silver:94,Bronze:118}},{id:`bridge-ring-run`,type:`timeTrial`,name:`Bridge Ring Run`,description:`A high-speed loop across the bridge corridor and highway ring.`,recommendedCar:`Sports Coupe`,reward:205,xp:225,start:{position:[-390,0,-172],heading:Math.PI*.5},checkpoints:[[-330,-172],[-245,-172],[-48,-172],[140,-172],[330,-172],[430,-238],[430,-346],[240,-420],[0,-420],[-240,-420],[-430,-360],[-390,-172]],medalTimes:{S:104,Gold:124,Silver:150,Bronze:184}},{id:`grand-city-cruise`,type:`timeTrial`,name:`Grand City Cruise`,description:`A scenic city-wide cruise linking park, market, residential, and downtown roads.`,recommendedCar:`Classic Car`,reward:175,xp:190,start:{position:[-122,0,34],heading:-Math.PI*.5},checkpoints:[[-206,34],[-146,106],[-58,182],[30,112],[184,74],[108,144],[0,62],[-62,0],[-122,34]],medalTimes:{S:88,Gold:106,Silver:132,Bronze:162}},{id:`scenic-hill-switchback`,type:`timeTrial`,name:`Scenic Hill Switchback`,description:`A longer handling run up the expanded viewpoint road.`,recommendedCar:`Sports Coupe`,reward:180,xp:205,start:{position:[108,0,144],heading:.52},checkpoints:[[150,194],[202,230],[170,258],[130,210],[184,132]],medalTimes:{S:45,Gold:56,Silver:72,Bronze:92}}],du=[{id:`park-loop-drift`,type:`drift`,name:`Park Loop Drift`,description:`Hold clean angle through the park curve.`,recommendedCar:`Sports Coupe`,reward:120,xp:140,start:{position:[-40,0,26],heading:-Math.PI*.5},zone:{center:[-78,44],size:[56,34],rotation:-.45},timer:55,targetScore:1600},{id:`downtown-corner-drift`,type:`drift`,name:`Downtown Corner Drift`,description:`Link the central junction without clipping traffic.`,recommendedCar:`Classic Car`,reward:130,xp:145,start:{position:[-44,0,-20],heading:0},zone:{center:[0,0],size:[74,74],rotation:0},timer:50,targetScore:1450}],fu=[{id:`residential-taxi`,type:`taxi`,name:`Residential Ride`,description:`A smooth passenger ride from the square to City Hall.`,recommendedCar:`Classic Car`,reward:125,xp:145,start:{position:[88,0,58],heading:-Math.PI*.5},timer:105,pickup:[88,58],destination:[24,72],comfortLoss:14,messages:[`Please drive safely.`,`Nice smooth turn.`,`Careful!`,`We are almost there.`]},{id:`market-taxi`,type:`taxi`,name:`Market Pickup`,description:`Pick up near Market Gate and reach the Park Loop calmly.`,recommendedCar:`SUV`,reward:135,xp:150,start:{position:[-66,0,82],heading:Math.PI*.5},timer:100,pickup:[-66,82],destination:[-78,44],comfortLoss:16,messages:[`Please avoid the market vans.`,`That was smooth.`,`Careful!`,`Almost there.`]},{id:`residential-airport-taxi`,type:`taxi`,name:`Residential Airport Taxi`,description:`A smooth longer ride from the local square to Horizon Airport Terminal.`,recommendedCar:`Classic Car`,reward:170,xp:195,start:{position:[184,0,74],heading:-Math.PI*.5},timer:165,pickup:[184,74],destination:[-360,-350],comfortLoss:15,messages:[`Airport terminal, please.`,`Smooth highway merge.`,`Careful near the bridge.`,`We are nearly at departures.`]}],pu=[{id:`standard-parcel`,type:`delivery`,name:`Standard Parcel`,description:`Normal route, normal condition loss.`,recommendedCar:`Starter Hatchback`,reward:120,xp:130,start:{position:[-42,0,-4],heading:Math.PI*.5},timer:105,pickup:[-66,82],destination:[92,58],crashDamage:13,roughDamagePerSecond:1.1,accelerationMultiplier:1},{id:`fragile-box`,type:`delivery`,name:`Fragile Box`,description:`Higher reward, collision-sensitive cargo.`,recommendedCar:`SUV`,reward:150,xp:155,start:{position:[-66,0,82],heading:Math.PI*.5},timer:110,pickup:[-66,82],destination:[24,72],crashDamage:22,roughDamagePerSecond:1.4,accelerationMultiplier:1},{id:`express-food`,type:`delivery`,name:`Express Food`,description:`Stricter timer, higher speed bonus.`,recommendedCar:`Sports Coupe`,reward:145,xp:150,start:{position:[-30,0,82],heading:Math.PI*.5},timer:78,pickup:[-30,82],destination:[120,56],crashDamage:14,roughDamagePerSecond:1,accelerationMultiplier:1},{id:`heavy-cargo`,type:`delivery`,name:`Heavy Cargo`,description:`Heavier load with reduced acceleration.`,recommendedCar:`Off-Road Jeep`,reward:155,xp:160,start:{position:[64,0,30],heading:Math.PI*.2},timer:120,pickup:[64,30],destination:[124,132],crashDamage:15,roughDamagePerSecond:.8,accelerationMultiplier:.82},{id:`industrial-cargo-route`,type:`delivery`,name:`Industrial Cargo Route`,description:`Move heavier cargo from the logistics depot to the airport service road.`,recommendedCar:`Off-Road Jeep`,reward:185,xp:205,start:{position:[360,0,-370],heading:Math.PI*.5},timer:150,pickup:[360,-330],destination:[-274,-360],crashDamage:16,roughDamagePerSecond:.75,accelerationMultiplier:.78},{id:`market-delivery-chain`,type:`delivery`,name:`Market Delivery Chain`,description:`A denser route from Market Street through Downtown to Residential Square.`,recommendedCar:`Starter Hatchback`,reward:165,xp:180,start:{position:[-134,0,182],heading:Math.PI*.5},timer:132,pickup:[-134,182],destination:[184,74],crashDamage:14,roughDamagePerSecond:1,accelerationMultiplier:1}],mu=[{id:`basic-parking`,type:`parking`,name:`Basic Parking`,description:`A fair first parking space in Residential Zone.`,recommendedCar:`Starter Hatchback`,reward:95,xp:115,start:{position:[42,0,-18],heading:-Math.PI*.5},timer:95,zone:{center:[112,58],size:[8,13],rotation:Math.PI*.5,holdTime:2.5}},{id:`reverse-parking`,type:`parking`,name:`Reverse Parking`,description:`Line up gently and back into the marked slot.`,recommendedCar:`Classic Car`,reward:110,xp:130,start:{position:[88,0,22],heading:0},timer:100,zone:{center:[72,44],size:[8,13],rotation:Math.PI,holdTime:2.8}},{id:`tight-market-parking`,type:`parking`,name:`Tight Market Parking`,description:`A careful slot between market barriers.`,recommendedCar:`Starter Hatchback`,reward:120,xp:140,start:{position:[-78,0,82],heading:Math.PI*.5},timer:105,zone:{center:[-8,92],size:[7,12],rotation:Math.PI*.5,holdTime:3}},{id:`hill-parking`,type:`parking`,name:`Hill Parking`,description:`Stop precisely near the viewpoint guardrail.`,recommendedCar:`SUV`,reward:130,xp:145,start:{position:[92,0,116],heading:Math.PI*.5},timer:95,zone:{center:[128,138],size:[8,13],rotation:.2,holdTime:2.8}},{id:`precision-stop`,type:`parking`,name:`Precision Stop`,description:`A short challenge focused on final speed and center accuracy.`,recommendedCar:`SUV`,reward:115,xp:135,start:{position:[44,0,42],heading:-Math.PI*.5},timer:70,zone:{center:[0,42],size:[7,10],rotation:Math.PI*.5,holdTime:2.2}},{id:`airport-parking`,type:`parking`,name:`Airport Parking`,description:`Park cleanly in the airport drop-off bay near the terminal.`,recommendedCar:`SUV`,reward:145,xp:165,start:{position:[-360,0,-404],heading:0},timer:115,zone:{center:[-320,-324],size:[9,15],rotation:Math.PI*.5,holdTime:2.8}}],hu=[...uu,...du,...fu,...pu,...mu],gu={freeDrive:{id:`freeDrive`,type:`freeDrive`,name:`Free Drive`,description:`Explore the city, collect coins, discover landmarks, and enjoy the road.`,reward:0},checkpoint:uu[0],delivery:pu[0],parking:mu[0],drift:du[0],taxi:fu[0],timeTrial:uu[0]},_u=[{rank:`S`,min:900},{rank:`A`,min:700},{rank:`B`,min:480},{rank:`C`,min:0}],vu=e=>e===`freeDrive`?gu.freeDrive:hu.find(t=>t.id===e),yu=e=>_u.find(t=>e>=t.min)?.rank??`C`,bu=(e,t)=>e?.medalTimes?t<=e.medalTimes.S?`S`:t<=e.medalTimes.Gold?`Gold`:t<=e.medalTimes.Silver?`Silver`:t<=e.medalTimes.Bronze?`Bronze`:null:null,xu={version:4,bounds:470,groundSize:960,radarRange:940,highwaySpeedFactor:1.14},Su=[{id:`downtown`,name:`Downtown Core`,center:[0,0],size:[178,172],color:`#d6dee8`,reward:18,xp:30},{id:`park`,name:`Park Loop`,center:[-190,48],size:[178,160],color:`#74b56c`,reward:18,xp:30},{id:`airport`,name:`Airport Zone`,center:[-360,-350],size:[230,196],color:`#c8d4dc`,reward:28,xp:48},{id:`industrial`,name:`Industrial / Logistics Zone`,center:[360,-340],size:[230,184],color:`#b9c0bc`,reward:24,xp:42},{id:`residential`,name:`Residential Zone`,center:[184,74],size:[176,156],color:`#e7d9c4`,reward:18,xp:30},{id:`market`,name:`Market Street`,center:[-58,182],size:[188,118],color:`#eadfc9`,reward:20,xp:34},{id:`hill`,name:`Hill / Viewpoint Road`,center:[170,214],size:[198,140],color:`#c7d7b1`,reward:26,xp:46},{id:`river`,name:`River / Bridge Corridor`,center:[0,-172],size:[760,74],color:`#a6d6e8`,reward:20,xp:34},{id:`highway`,name:`Highway Ring / Expressway System`,center:[0,-420],size:[900,96],color:`#a7b1ba`,reward:22,xp:38}],Cu=[{id:`express-south`,center:[0,-420],size:[880,28],rotation:0,zone:`highway`,roadClass:`highway`,lanes:4,shoulders:!0,median:!0},{id:`express-north`,center:[0,420],size:[860,26],rotation:0,zone:`highway`,roadClass:`highway`,lanes:4,shoulders:!0,median:!0},{id:`express-west`,center:[-430,0],size:[26,840],rotation:0,zone:`highway`,roadClass:`highway`,lanes:4,shoulders:!0,median:!0},{id:`express-east`,center:[430,0],size:[26,840],rotation:0,zone:`highway`,roadClass:`highway`,lanes:4,shoulders:!0,median:!0},{id:`south-west-flyover`,center:[-380,-380],size:[150,24],rotation:.72,zone:`highway`,roadClass:`highway`,lanes:3,shoulders:!0,median:!0},{id:`south-east-flyover`,center:[380,-380],size:[150,24],rotation:-.72,zone:`highway`,roadClass:`highway`,lanes:3,shoulders:!0,median:!0},{id:`north-west-flyover`,center:[-380,380],size:[144,24],rotation:-.7,zone:`highway`,roadClass:`highway`,lanes:3,shoulders:!0,median:!0},{id:`north-east-flyover`,center:[380,380],size:[144,24],rotation:.7,zone:`highway`,roadClass:`highway`,lanes:3,shoulders:!0,median:!0},{id:`downtown-main-ns`,center:[0,0],size:[22,268],rotation:0,zone:`downtown`,roadClass:`boulevard`,lanes:3,median:!0},{id:`downtown-main-ew`,center:[0,0],size:[268,22],rotation:0,zone:`downtown`,roadClass:`boulevard`,lanes:3,median:!0},{id:`downtown-west-grid`,center:[-62,0],size:[15,172],rotation:0,zone:`downtown`,roadClass:`city`,lanes:2},{id:`downtown-east-grid`,center:[62,0],size:[15,172],rotation:0,zone:`downtown`,roadClass:`city`,lanes:2},{id:`downtown-north-grid`,center:[0,62],size:[176,15],rotation:0,zone:`downtown`,roadClass:`city`,lanes:2},{id:`downtown-south-grid`,center:[0,-62],size:[176,15],rotation:0,zone:`downtown`,roadClass:`city`,lanes:2},{id:`city-hall-avenue`,center:[30,102],size:[15,92],rotation:0,zone:`downtown`,roadClass:`city`,lanes:2},{id:`downtown-express-link`,center:[0,-128],size:[24,168],rotation:0,zone:`river`,roadClass:`highway`,lanes:3,shoulders:!0},{id:`river-bridge`,center:[0,-172],size:[330,22],rotation:0,zone:`river`,roadClass:`bridge`,lanes:3,shoulders:!0,median:!0},{id:`park-grand-entry`,center:[-122,34],size:[126,14],rotation:-.08,zone:`park`,roadClass:`scenic`,lanes:2},{id:`park-west-curve`,center:[-206,34],size:[94,13],rotation:-.68,zone:`park`,roadClass:`scenic`,lanes:2},{id:`park-north-curve`,center:[-206,94],size:[120,13],rotation:.38,zone:`park`,roadClass:`scenic`,lanes:2},{id:`park-east-loop`,center:[-146,106],size:[114,13],rotation:-.18,zone:`park`,roadClass:`scenic`,lanes:2},{id:`park-soft-jeep-cut`,center:[-220,72],size:[86,10],rotation:.82,zone:`park`,roadClass:`soft`,soft:!0,lanes:1},{id:`park-highway-ramp`,center:[-236,-70],size:[162,15],rotation:-.58,zone:`park`,roadClass:`ramp`,lanes:2},{id:`airport-entry-road`,center:[-360,-404],size:[26,144],rotation:0,zone:`airport`,roadClass:`airport`,lanes:3,median:!0},{id:`airport-terminal-loop`,center:[-360,-350],size:[170,22],rotation:0,zone:`airport`,roadClass:`airport`,lanes:3},{id:`airport-dropoff`,center:[-360,-324],size:[138,14],rotation:0,zone:`airport`,roadClass:`airport`,lanes:2},{id:`airport-runway-road`,center:[-360,-252],size:[188,18],rotation:0,zone:`airport`,roadClass:`runway`,lanes:2},{id:`airport-service-road`,center:[-274,-360],size:[18,132],rotation:0,zone:`airport`,roadClass:`service`,lanes:1},{id:`industrial-main`,center:[360,-370],size:[186,18],rotation:0,zone:`industrial`,roadClass:`industrial`,lanes:2},{id:`industrial-yard-ns`,center:[360,-330],size:[18,128],rotation:0,zone:`industrial`,roadClass:`industrial`,lanes:2},{id:`industrial-east-yard`,center:[420,-330],size:[16,128],rotation:0,zone:`industrial`,roadClass:`industrial`,lanes:2},{id:`industrial-logistics-loop`,center:[360,-290],size:[164,16],rotation:0,zone:`industrial`,roadClass:`industrial`,lanes:2},{id:`industrial-express-ramp`,center:[348,-398],size:[112,15],rotation:-.28,zone:`industrial`,roadClass:`ramp`,lanes:2},{id:`residential-entry`,center:[112,34],size:[118,13],rotation:.18,zone:`residential`,roadClass:`residential`,lanes:2},{id:`residential-square-x`,center:[184,74],size:[132,13],rotation:0,zone:`residential`,roadClass:`residential`,lanes:2},{id:`residential-square-z`,center:[184,74],size:[13,126],rotation:0,zone:`residential`,roadClass:`residential`,lanes:2},{id:`residential-north-loop`,center:[218,126],size:[108,12],rotation:.15,zone:`residential`,roadClass:`residential`,lanes:2},{id:`residential-highway-link`,center:[260,132],size:[130,13],rotation:1.12,zone:`residential`,roadClass:`ramp`,lanes:2},{id:`market-main`,center:[-58,182],size:[188,13],rotation:0,zone:`market`,roadClass:`market`,lanes:2},{id:`market-north-alley`,center:[-58,214],size:[152,10],rotation:0,zone:`market`,roadClass:`market`,lanes:1},{id:`market-link-south`,center:[-20,126],size:[13,126],rotation:0,zone:`market`,roadClass:`market`,lanes:2},{id:`market-gate-road`,center:[-134,166],size:[13,88],rotation:.1,zone:`market`,roadClass:`market`,lanes:1},{id:`hill-entry`,center:[108,144],size:[118,13],rotation:.52,zone:`hill`,roadClass:`scenic`,lanes:2,elevation:1},{id:`hill-switchback-a`,center:[150,194],size:[112,12],rotation:-.6,zone:`hill`,roadClass:`scenic`,lanes:2,elevation:2.2},{id:`hill-switchback-b`,center:[202,230],size:[108,12],rotation:.58,zone:`hill`,roadClass:`scenic`,lanes:2,elevation:3.2},{id:`hill-viewpoint-loop`,center:[170,258],size:[92,12],rotation:.02,zone:`hill`,roadClass:`scenic`,lanes:2,elevation:4}],wu=[{id:`downtown-airport-ramp-up`,name:`Downtown Expressway Ramp`,zone:`river`,roadClass:`ramp`,kind:`ramp`,center:[0,-104],size:[30,126],rotation:0,lanes:3,startElevation:11.5,endElevation:0,deckThickness:1.45,supportSpacing:24,supportStyle:`paired`,barriers:!0,shoulders:!0,priority:80,signs:[{at:-.18,text:`AIRPORT EXPRESS`}]},{id:`river-landmark-bridge`,name:`River Landmark Bridge`,zone:`river`,roadClass:`bridge`,kind:`bridge`,center:[0,-132],size:[360,34],rotation:0,lanes:4,startElevation:15.5,endElevation:15.5,deckElevation:15.5,deckThickness:2.2,supportSpacing:38,supportStyle:`bridge-pier`,barriers:!0,median:!0,shoulders:!0,priority:98,signs:[{at:0,text:`RIVER BRIDGE`}]},{id:`west-bridge-approach`,name:`West Bridge Approach`,zone:`river`,roadClass:`ramp`,kind:`ramp`,center:[-226,-132],size:[112,30],rotation:0,lanes:3,startElevation:0,endElevation:15.5,deckThickness:1.7,supportSpacing:24,supportStyle:`paired`,barriers:!0,shoulders:!0,priority:88},{id:`east-bridge-approach`,name:`East Bridge Approach`,zone:`river`,roadClass:`ramp`,kind:`ramp`,center:[226,-132],size:[112,30],rotation:0,lanes:3,startElevation:15.5,endElevation:0,deckThickness:1.7,supportSpacing:24,supportStyle:`paired`,barriers:!0,shoulders:!0,priority:88},{id:`airport-expressway-deck`,name:`Airport Elevated Expressway`,zone:`airport`,roadClass:`highway`,kind:`deck`,center:[-112,-196],size:[236,28],rotation:-2.75,lanes:3,startElevation:11.5,endElevation:11.5,deckElevation:11.5,deckThickness:1.65,supportSpacing:30,supportStyle:`paired`,barriers:!0,median:!0,shoulders:!0,priority:86,signs:[{at:.2,text:`TERMINAL ROUTE`}]},{id:`airport-ramp-down`,name:`Airport Descent Ramp`,zone:`airport`,roadClass:`ramp`,kind:`ramp`,center:[-218,-220],size:[30,112],rotation:0,lanes:3,startElevation:11.5,endElevation:0,deckThickness:1.45,supportSpacing:24,supportStyle:`paired`,barriers:!0,shoulders:!0,priority:84,signs:[{at:.28,text:`AIRPORT EXIT`}]},{id:`south-elevated-ring`,name:`South Elevated Highway`,zone:`highway`,roadClass:`highway`,kind:`deck`,center:[0,-272],size:[500,34],rotation:0,lanes:4,startElevation:10.5,endElevation:10.5,deckElevation:10.5,deckThickness:1.75,supportSpacing:34,supportStyle:`paired`,barriers:!0,median:!0,shoulders:!0,priority:72,signs:[{at:-.34,text:`WEST RING`},{at:.34,text:`LOGISTICS EXIT`}]},{id:`east-elevated-ring`,name:`East Elevated Highway`,zone:`highway`,roadClass:`highway`,kind:`deck`,center:[282,-24],size:[32,426],rotation:0,lanes:4,startElevation:10.5,endElevation:10.5,deckElevation:10.5,deckThickness:1.75,supportSpacing:34,supportStyle:`paired`,barriers:!0,median:!0,shoulders:!0,priority:70},{id:`north-elevated-ring`,name:`North Elevated Highway`,zone:`highway`,roadClass:`highway`,kind:`deck`,center:[0,276],size:[456,32],rotation:0,lanes:4,startElevation:9.2,endElevation:9.2,deckElevation:9.2,deckThickness:1.55,supportSpacing:36,supportStyle:`paired`,barriers:!0,median:!0,shoulders:!0,priority:66,signs:[{at:.15,text:`NORTH RING`}]},{id:`south-east-flyover-deck`,name:`Logistics Flyover`,zone:`industrial`,roadClass:`highway`,kind:`flyover`,center:[236,-238],size:[156,28],rotation:-.72,lanes:3,startElevation:10.5,endElevation:10.5,deckElevation:10.5,deckThickness:1.6,supportSpacing:28,supportStyle:`paired`,barriers:!0,shoulders:!0,priority:78},{id:`south-west-flyover-deck`,name:`Airport Flyover`,zone:`airport`,roadClass:`highway`,kind:`flyover`,center:[-236,-238],size:[156,28],rotation:.72,lanes:3,startElevation:10.5,endElevation:10.5,deckElevation:10.5,deckThickness:1.6,supportSpacing:28,supportStyle:`paired`,barriers:!0,shoulders:!0,priority:78},{id:`industrial-exit-ramp`,name:`Industrial Exit Ramp`,zone:`industrial`,roadClass:`ramp`,kind:`ramp`,center:[230,-252],size:[118,24],rotation:-.28,lanes:2,startElevation:10.5,endElevation:0,deckThickness:1.35,supportSpacing:24,supportStyle:`single`,barriers:!0,shoulders:!0,priority:76,signs:[{at:.18,text:`INDUSTRIAL EXIT`}]},{id:`park-highway-onramp`,name:`Park Highway On-Ramp`,zone:`park`,roadClass:`ramp`,kind:`ramp`,center:[-236,-70],size:[176,22],rotation:-.58,lanes:2,startElevation:0,endElevation:9.5,deckThickness:1.35,supportSpacing:24,supportStyle:`single`,barriers:!0,shoulders:!0,priority:74,signs:[{at:.28,text:`MERGE`}]}],Tu=[{id:`downtownExpresswayPath`,name:`Downtown Expressway Curve`,zone:`river`,type:`ramp`,width:28,lanes:3,deckThickness:1.45,supportSpacing:24,supportStyle:`paired`,barriers:!0,shoulders:!0,traffic:!0,priority:130,samples:82,missionTags:[`airport-express-sprint`,`downtown-flyover`],signs:[{index:18,text:`AIRPORT EXPRESS`}],points:[[0,0,-48],[6,1.2,-78],[4,5.8,-118],[-28,10.6,-162],[-92,12.2,-214],[-185,12.2,-272],[-292,12.2,-326]]},{id:`airportConnectorPath`,name:`Airport Connector Ramp`,zone:`airport`,type:`ramp`,width:28,lanes:3,deckThickness:1.45,supportSpacing:24,supportStyle:`paired`,barriers:!0,shoulders:!0,traffic:!0,priority:124,samples:44,missionTags:[`airport-express-sprint`,`airport-taxi`],signs:[{index:26,text:`TERMINAL EXIT`}],points:[[-292,12.2,-326],[-318,11.8,-340],[-344,8.4,-366],[-360,3.2,-396],[-360,0,-404],[-360,0,-372],[-360,0,-350]]},{id:`riverBridgePath`,name:`River Landmark Bridge Path`,zone:`river`,type:`bridge`,width:34,lanes:4,deckThickness:2.2,supportSpacing:42,supportStyle:`bridge-pier`,barriers:!0,median:!0,shoulders:!0,traffic:!0,priority:150,samples:58,missionTags:[`bridge-ring-run`,`bridge-crossing`],signs:[{index:28,text:`RIVER BRIDGE`}],points:[[-390,0,-172],[-330,6.2,-172],[-245,13.2,-172],[-140,15.8,-172],[-48,15.8,-172],[48,15.8,-172],[140,15.8,-172],[245,13.2,-172],[330,6.2,-172],[390,0,-172]]},{id:`southHighwayLoopPath`,name:`Outer Highway Ring`,zone:`highway`,type:`elevated`,width:34,lanes:4,deckThickness:1.75,supportSpacing:34,supportStyle:`paired`,barriers:!0,median:!0,shoulders:!0,traffic:!0,priority:102,closed:!0,samples:168,missionTags:[`bridge-ring-run`,`highway-speed-run`],signs:[{index:28,text:`WEST RING`},{index:72,text:`LOGISTICS EXIT`},{index:128,text:`CITY LOOP`}],points:[[-430,0,-330],[-430,4.8,-382],[-380,10.8,-424],[-245,10.8,-432],[-70,10.8,-426],[120,10.8,-424],[285,10.8,-414],[398,10.8,-350],[430,10.8,-200],[430,10.8,-32],[420,10.8,150],[360,10.8,328],[190,10.8,418],[0,10.8,432],[-190,10.8,418],[-360,10.8,328],[-430,10.8,150],[-430,10.8,-32],[-430,8.2,-188],[-430,3.8,-278]]},{id:`industrialFlyoverPath`,name:`Industrial Flyover Exit`,zone:`industrial`,type:`ramp`,width:24,lanes:2,deckThickness:1.35,supportSpacing:24,supportStyle:`single`,barriers:!0,shoulders:!0,traffic:!0,priority:108,samples:34,missionTags:[`industrial-cargo-route`],signs:[{index:18,text:`INDUSTRIAL EXIT`}],points:[[210,10.8,-420],[282,10.6,-414],[338,7.8,-398],[360,3.4,-382],[360,0,-370]]},{id:`marketExitRampPath`,name:`Market Exit Ramp`,zone:`market`,type:`ramp`,width:22,lanes:2,deckThickness:1.25,supportSpacing:24,supportStyle:`single`,barriers:!0,shoulders:!0,traffic:!1,priority:104,samples:34,missionTags:[`grand-city-cruise`],signs:[{index:12,text:`MARKET EXIT`}],points:[[330,0,-172],[282,4.5,-142],[212,7.8,-106],[132,5,-78],[72,0,-62]]},{id:`hillConnectorPath`,name:`Hill Connector Flyover`,zone:`hill`,type:`ramp`,width:22,lanes:2,deckThickness:1.25,supportSpacing:26,supportStyle:`single`,barriers:!0,shoulders:!0,traffic:!1,priority:96,samples:42,missionTags:[`scenic-hill-switchback`,`hill-to-highway`],signs:[{index:24,text:`VIEWPOINT LINK`}],points:[[184,0,132],[218,2.2,160],[252,5.8,202],[270,8.8,246],[224,9.2,276],[150,9.2,276],[118,5.4,244],[108,0,198]]}],Eu=[{id:`airport-airliner-clearance`,center:[-360,-286],size:[138,86],rotation:Math.PI*.02},{id:`airport-terminal-clearance`,center:[-424,-372],size:[96,42],rotation:0},{id:`river-bridge-clearance`,center:[0,-172],size:[790,54],rotation:0},{id:`south-express-clearance`,center:[0,-420],size:[900,58],rotation:0},{id:`industrial-depot-clearance`,center:[360,-330],size:[210,150],rotation:0}],Du=[{id:`downtown`,position:[0,0,28],heading:Math.PI},{id:`south-express`,position:[0,0,-420],heading:Math.PI*.5},{id:`airport-express-ramp`,position:[-28,0,-162],heading:-2.55},{id:`river-bridge-deck`,position:[-72,0,-172],heading:Math.PI*.5},{id:`airport-elevated-exit`,position:[-360,0,-396],heading:0},{id:`airport`,position:[-360,0,-404],heading:0},{id:`industrial`,position:[360,0,-370],heading:Math.PI*.5},{id:`park`,position:[-122,0,34],heading:-Math.PI*.5},{id:`hill`,position:[108,0,144],heading:.52}],Ou=[{id:`central-tower`,name:`Central Tower`,description:`The glassy centerpiece of Downtown Core.`,position:[24,22],radius:20,reward:35,xp:55},{id:`city-hall`,name:`City Hall`,description:`A cream stone civic landmark near Downtown Core.`,position:[30,112],radius:18,reward:32,xp:52},{id:`park-fountain`,name:`Grand Park Fountain`,description:`A larger fountain plaza inside the expanded Park Loop.`,position:[-190,66],radius:22,reward:32,xp:55},{id:`highway-bridge`,name:`Expressway Bridge`,description:`A long elevated road crossing the river corridor.`,position:[0,-172],radius:24,reward:42,xp:64},{id:`market-gate`,name:`Market Gate`,description:`The bright entry to tighter shop streets.`,position:[-134,182],radius:18,reward:30,xp:50},{id:`residential-square`,name:`Residential Square`,description:`A quieter local square for smooth cruising.`,position:[184,74],radius:18,reward:30,xp:50},{id:`hill-viewpoint`,name:`Hill Viewpoint`,description:`A scenic deck above Mini City.`,position:[170,258],radius:22,reward:45,xp:70},{id:`airport-terminal`,name:`Horizon Airport Terminal`,description:`A sunny airport terminal beside the giant procedural airplane.`,position:[-424,-350],radius:28,reward:48,xp:76},{id:`giant-airplane`,name:`Horizon Airliner`,description:`A huge parked aircraft built from procedural geometry.`,position:[-360,-286],radius:28,reward:52,xp:82},{id:`industrial-depot`,name:`Industrial Depot`,description:`A dense cargo yard with warehouses, containers, and logistics roads.`,position:[360,-330],radius:24,reward:42,xp:64},{id:`river-corridor`,name:`River Bridge Corridor`,description:`A blue water corridor crossed by city bridges and express roads.`,position:[0,-194],radius:24,reward:34,xp:54}],ku=[...[-120,-60,0,60,120].map((e,t)=>({id:`coin-downtown-${t}`,type:`cityCoin`,position:[e,0],value:8,xp:1})),...[-420,-300,-180,-60,60,180,300,420].map((e,t)=>({id:`coin-express-south-${t}`,type:`cityCoin`,position:[e,-420],value:9,xp:2})),...[-420,-300,-180,-60,60,180,300,420].map((e,t)=>({id:`coin-express-north-${t}`,type:`cityCoin`,position:[e,420],value:9,xp:2})),...[-410,-384,-358,-332].map((e,t)=>({id:`coin-airport-${t}`,type:`cityCoin`,position:[e,-324],value:10,xp:2})),...[300,340,380,420].map((e,t)=>({id:`coin-industrial-${t}`,type:`cityCoin`,position:[e,-370],value:10,xp:2})),...[-228,-205,-182,-160,-138].map((e,t)=>({id:`coin-park-${t}`,type:`cityCoin`,position:[e,94],value:8,xp:1})),...[-122,-82,-42,-2,38].map((e,t)=>({id:`coin-market-${t}`,type:`cityCoin`,position:[e,182],value:8,xp:1})),...[150,184,218].map((e,t)=>({id:`coin-residential-${t}`,type:`cityCoin`,position:[e,74],value:8,xp:1})),...[126,158,190,222].map((e,t)=>({id:`coin-hill-${t}`,type:`cityCoin`,position:[e,230+t*8],value:11,xp:2})),{id:`token-airliner`,type:`landmarkToken`,position:[-360,-272],value:70,xp:100,oneTime:!0},{id:`token-industrial`,type:`hiddenWheel`,position:[420,-290],value:60,xp:90,oneTime:!0},{id:`token-bridge`,type:`landmarkToken`,position:[0,-172],value:55,xp:80,oneTime:!0},{id:`token-viewpoint`,type:`hiddenWheel`,position:[172,266],value:60,xp:90,oneTime:!0},{id:`token-market`,type:`hiddenWheel`,position:[-134,214],value:48,xp:76,oneTime:!0}],Au=[{id:`downtown-loop`,zone:`downtown`,speed:8,type:`car`,points:[[-62,-62],[62,-62],[62,62],[-62,62]]},{id:`downtown-boulevard-flow`,zone:`downtown`,speed:8.6,type:`taxi`,points:[[0,-118],[0,118],[62,118],[62,-118]]},{id:`south-express-flow`,zone:`highway`,speed:17,type:`car`,points:[[-430,-420],[-240,-420],[0,-420],[240,-420],[430,-346]]},{id:`airport-expressway-flow`,zone:`highway`,speed:15.5,type:`taxi`,points:[[0,-62],[-28,-162],[-185,-272],[-292,-326],[-360,-404],[-360,-350]]},{id:`river-bridge-flow`,zone:`highway`,speed:16.8,type:`car`,points:[[-390,-172],[-195,-172],[0,-172],[195,-172],[390,-172]]},{id:`north-elevated-flow`,zone:`highway`,speed:15.8,type:`car`,points:[[-420,420],[-160,420],[96,420],[380,380],[430,160]]},{id:`outer-ring-flow`,zone:`highway`,speed:16,type:`car`,points:[[-430,-360],[-430,360],[0,420],[430,360],[430,-360],[0,-420]]},{id:`airport-service-loop`,zone:`airport`,speed:6.8,type:`van`,points:[[-360,-404],[-360,-350],[-274,-350],[-274,-404]]},{id:`industrial-loop`,zone:`industrial`,speed:6.2,type:`delivery-truck`,points:[[290,-370],[430,-370],[430,-290],[290,-290]]},{id:`market-loop`,zone:`market`,speed:5.4,type:`van`,points:[[-134,182],[-58,182],[38,182],[-20,126],[-134,166]]},{id:`residential-loop`,zone:`residential`,speed:6,type:`car`,points:[[122,74],[184,16],[250,74],[218,126],[184,132]]},{id:`park-loop`,zone:`park`,speed:6.6,type:`car`,points:[[-122,34],[-206,34],[-226,94],[-146,106],[-122,34]]},{id:`hill-loop`,zone:`hill`,speed:6.8,type:`car`,points:[[108,144],[150,194],[202,230],[170,258],[130,210]]}],ju=Du[0],Mu=(e,t,n)=>Math.min(n,Math.max(t,e)),Nu=(e,t,n)=>e+(t-e)*Mu(n,0,1),Pu=(e,t,n)=>e===t?0:Mu((n-e)/(t-e),0,1),Fu=(e,t,n,r)=>Nu(e,t,1-Math.exp(-n*r)),Iu=(e,t)=>{let n=(t-e+Math.PI)%(Math.PI*2);return n<0&&(n+=Math.PI*2),n-Math.PI},Lu=(e,t,n,r)=>e+Iu(e,t)*(1-Math.exp(-n*r)),Ru=(e,t)=>{let n=e[0]-t[0],r=e[1]-t[1];return Math.hypot(n,r)},zu=e=>new W(Math.sin(e),0,Math.cos(e)),Bu=e=>{let t=Math.max(0,e),n=Math.floor(t/60),r=Math.floor(t%60),i=Math.floor((t-Math.floor(t))*10);return`${n}:${String(r).padStart(2,`0`)}.${i}`},Vu=(e,t,n,r=0)=>{let i=Math.cos(-r),a=Math.sin(-r),o=e.x-t.x,s=e.z-t.z,c=o*i-s*a,l=o*a+s*i;return Math.abs(c)<=n.x*.5&&Math.abs(l)<=n.z*.5},Hu=class{constructor(e){this.saveManager=e,this.context=null,this.master=null,this.engineOsc=null,this.engineGain=null,this.ambienceOsc=null,this.ambienceGain=null,this.enabled=!1,this.cockpitActive=!1,this.unlock=this.unlock.bind(this),window.addEventListener(`pointerdown`,this.unlock,{once:!0}),window.addEventListener(`keydown`,this.unlock,{once:!0})}unlock(){if(this.enabled)return;let e=window.AudioContext||window.webkitAudioContext;e&&(this.context=new e,this.master=this.context.createGain(),this.master.connect(this.context.destination),this.engineGain=this.context.createGain(),this.engineGain.gain.value=0,this.engineOsc=this.context.createOscillator(),this.engineOsc.type=`sawtooth`,this.engineOsc.frequency.value=80,this.engineOsc.connect(this.engineGain),this.engineGain.connect(this.master),this.engineOsc.start(),this.ambienceGain=this.context.createGain(),this.ambienceGain.gain.value=.02,this.ambienceOsc=this.context.createOscillator(),this.ambienceOsc.type=`sine`,this.ambienceOsc.frequency.value=122,this.ambienceOsc.connect(this.ambienceGain),this.ambienceGain.connect(this.master),this.ambienceOsc.start(),this.enabled=!0,this.applyVolumes())}applyVolumes(){if(!this.enabled)return;let e=this.saveManager.settings;this.master.gain.setTargetAtTime(e.masterVolume,this.context.currentTime,.05),this.ambienceGain.gain.setTargetAtTime(.026*e.ambienceVolume,this.context.currentTime,.08)}updateEngine(e,t,n,r,i=null){if(!this.enabled)return;let a=this.saveManager.settings,o=this.context.currentTime,s=i?.id===`supercar`?1.28:i?.id===`suv`||i?.id===`offroad-jeep`?.82:i?.id===`classic`?.72:i?.id===`sports-coupe`?1.1:.95,c=this.cockpitActive?.88:1,l=this.cockpitActive?.94:1,u=(.018+Mu(e,0,1)*.055+(t?.02:0))*c,d=(72+Mu(e,0,1)*210+(r?80:0))*s*l;this.engineOsc.frequency.setTargetAtTime(d,o,.06),this.engineGain.gain.setTargetAtTime(u*a.engineVolume,o,.06),n&&this.play(`drift`,.16)}setCockpitActive(e){this.cockpitActive=!!e}play(e,t=1){if(!this.enabled)return;let n=this.context.currentTime,r=this.saveManager.settings,i=this.context.createGain(),a=this.context.createOscillator(),o=[`drift`,`tire`,`skid`],s=o.includes(e)?r.tireVolume:r.uiVolume,c=this.cockpitActive&&o.includes(e)?.72:1,l=s*t*c,u={coin:[880,.08,`sine`],checkpoint:[640,.14,`triangle`],complete:[520,.34,`sine`],fail:[128,.32,`sawtooth`],boost:[260,.16,`square`],crash:[92,.16,`sawtooth`],drift:[180,.08,`triangle`],tuning:[740,.12,`triangle`],mastery:[920,.18,`sine`],event:[560,.18,`triangle`],objective:[780,.14,`sine`],pickup:[620,.12,`triangle`],click:[420,.06,`sine`]},[d,f,p]=u[e]??u.click;a.type=p,a.frequency.value=d,i.gain.setValueAtTime(1e-4,n),i.gain.exponentialRampToValueAtTime(Math.max(2e-4,.09*l),n+.012),i.gain.exponentialRampToValueAtTime(1e-4,n+f),a.connect(i),i.connect(this.master),a.start(n),a.stop(n+f+.02)}setMuted(e){this.enabled&&this.master.gain.setTargetAtTime(e?0:this.saveManager.settings.masterVolume,this.context.currentTime,.05)}},Uu={motionLevels:{off:0,low:.45,normal:1},fovOffsets:{low:-4,normal:0,wide:5}},Wu={hatchback:{name:`Compact city cockpit`,visibility:`Wide city windshield`,dashboardStyle:`Rounded digital dashboard`,drivingFeel:`Easy, practical, open view`,camera:{localPosition:[-.22,1.38,.7],lookAhead:13,lookHeight:1.35,fov:68,clearance:.12},motion:{lean:.018,pitch:.016,push:.035,vibration:.006},dashboard:{width:2.08,height:.34,y:-.48,z:-1.08,shape:`rounded`,display:`digital`,accent:`#d4a84f`},wheel:{x:-.34,y:-.29,z:-.72,radius:.25,tube:.018,maxTurn:1.08,spokes:3},windshield:{width:2.34,height:1.22,y:.08,z:-1.25,pillarWidth:.045,tint:.08},materials:{dash:`#444b55`,lower:`#222832`,trim:`#d8c3a1`,display:`#9ee8ff`,frame:`#2b313a`,seat:`#303844`}},"sports-coupe":{name:`Sport coupe cockpit`,visibility:`Lower, tighter windshield`,dashboardStyle:`Analog tach with red accents`,drivingFeel:`Focused and performance-heavy`,camera:{localPosition:[-.26,1.17,.55],lookAhead:15,lookHeight:1.15,fov:70,clearance:.1},motion:{lean:.024,pitch:.021,push:.045,vibration:.008},dashboard:{width:2.16,height:.3,y:-.48,z:-1.02,shape:`sport`,display:`sport-analog`,accent:`#e74c3c`},wheel:{x:-.32,y:-.28,z:-.7,radius:.27,tube:.024,maxTurn:1.18,spokes:3},windshield:{width:2.16,height:.98,y:.03,z:-1.18,pillarWidth:.052,tint:.07},materials:{dash:`#242833`,lower:`#151a22`,trim:`#e74c3c`,display:`#ffd1c9`,frame:`#151820`,seat:`#252a32`}},suv:{name:`High comfort cockpit`,visibility:`Tall broad windshield`,dashboardStyle:`Large practical dash with center screen`,drivingFeel:`Stable high seating position`,camera:{localPosition:[-.24,1.64,.68],lookAhead:12.5,lookHeight:1.62,fov:66,clearance:.14},motion:{lean:.012,pitch:.013,push:.026,vibration:.004},dashboard:{width:2.34,height:.42,y:-.5,z:-1.1,shape:`broad`,display:`center-screen`,accent:`#c7a15a`},wheel:{x:-.36,y:-.27,z:-.73,radius:.3,tube:.024,maxTurn:.95,spokes:4},windshield:{width:2.46,height:1.38,y:.14,z:-1.28,pillarWidth:.06,tint:.075},materials:{dash:`#53585f`,lower:`#252a31`,trim:`#c7a15a`,display:`#a4d7ff`,frame:`#313842`,seat:`#343c47`}},supercar:{name:`Low supercar cockpit`,visibility:`Wide low glass canopy`,dashboardStyle:`Sharp digital speed strip`,drivingFeel:`Aggressive high-speed view`,camera:{localPosition:[-.18,1.02,.52],lookAhead:17,lookHeight:1,fov:74,clearance:.08},motion:{lean:.03,pitch:.018,push:.055,vibration:.01},dashboard:{width:2.28,height:.25,y:-.51,z:-.98,shape:`wedge`,display:`digital-strip`,accent:`#1abc9c`},wheel:{x:-.22,y:-.31,z:-.66,radius:.23,tube:.02,maxTurn:1.28,spokes:2},windshield:{width:2.5,height:.86,y:-.02,z:-1.1,pillarWidth:.045,tint:.065},materials:{dash:`#111820`,lower:`#070b10`,trim:`#1abc9c`,display:`#b9fff2`,frame:`#0b1118`,seat:`#171d25`}},"offroad-jeep":{name:`Rugged trail cockpit`,visibility:`Upright windshield and hood view`,dashboardStyle:`Chunky utility gauges`,drivingFeel:`Tall, tough, all-road posture`,camera:{localPosition:[-.26,1.62,.58],lookAhead:12,lookHeight:1.58,fov:67,clearance:.18},motion:{lean:.017,pitch:.018,push:.03,vibration:.012},dashboard:{width:2.18,height:.38,y:-.48,z:-1.03,shape:`rugged`,display:`rugged-analog`,accent:`#e4c56a`},wheel:{x:-.35,y:-.25,z:-.7,radius:.32,tube:.026,maxTurn:1.02,spokes:4},windshield:{width:2.28,height:1.34,y:.13,z:-1.16,pillarWidth:.075,tint:.06},materials:{dash:`#31362c`,lower:`#171b15`,trim:`#e4c56a`,display:`#f7f2c1`,frame:`#20261d`,seat:`#30372a`}},classic:{name:`Vintage cruiser cockpit`,visibility:`Wide old-school windshield`,dashboardStyle:`Round analog chrome gauges`,drivingFeel:`Warm classic touring feel`,camera:{localPosition:[-.24,1.28,.72],lookAhead:13,lookHeight:1.28,fov:66,clearance:.12},motion:{lean:.014,pitch:.012,push:.026,vibration:.005},dashboard:{width:2.28,height:.36,y:-.49,z:-1.08,shape:`vintage`,display:`classic-round`,accent:`#d4af37`},wheel:{x:-.34,y:-.28,z:-.72,radius:.31,tube:.014,maxTurn:.9,spokes:3},windshield:{width:2.36,height:1.08,y:.06,z:-1.22,pillarWidth:.05,tint:.05},materials:{dash:`#6a4934`,lower:`#302018`,trim:`#d4af37`,display:`#fff2ca`,frame:`#5a3928`,seat:`#8d6547`}}},Gu=e=>Wu[e]??Wu.hatchback,Ku=[{id:`standard`,label:`Standard Chase`,distance:12,height:5.3,lookAhead:7,fov:62},{id:`far`,label:`Far Chase`,distance:18,height:8.2,lookAhead:10,fov:66},{id:`hood`,label:`Hood View`,distance:-1.1,height:1.85,lookAhead:16,fov:72},{id:`cockpit`,label:`Cockpit View`,distance:0,height:1.3,lookAhead:14,fov:68}],qu=Ku.map(e=>e.id),Ju=class{constructor(e,t){this.camera=e,this.saveManager=t;let n=t.settings.cameraMode;this.modeIndex=Math.max(0,qu.indexOf(qu.includes(n)?n:`standard`)),this.lastChaseMode=this.currentMode.id===`cockpit`?`standard`:this.currentMode.id,this.position=new W(0,8,-14),this.target=new W,this.vehicleWorld=new W,this.yaw=0,this.shake=0}nextMode(){let e=Ku[(this.modeIndex+1)%Ku.length].id;return this.setMode(e),this.currentMode.label}setMode(e,t=!0){let n=qu.indexOf(e);return n<0?this.currentMode.label:(this.currentMode.id!==`cockpit`&&e!==`cockpit`&&(this.lastChaseMode=this.currentMode.id),this.modeIndex=n,e!==`cockpit`&&(this.lastChaseMode=e),t&&this.saveManager.updateSettings({cameraMode:this.currentMode.id}),this.currentMode.label)}toggleCockpit(){return this.currentMode.id===`cockpit`?this.setMode(this.lastChaseMode||`standard`):(this.lastChaseMode=this.currentMode.id,this.setMode(`cockpit`))}getMode(){return this.currentMode}get currentMode(){return Ku[this.modeIndex]}update(e,t,n){let r=this.currentMode,i=zu(t.heading),a=t.getWorldPosition?t.getWorldPosition(this.vehicleWorld):this.vehicleWorld.copy(t.mesh?.position??t.position);if(r.id===`cockpit`){this.updateCockpit(e,t,n,a,i);return}this.yaw=Lu(this.yaw,t.heading,r.id===`hood`?18:8.5,e);let o=zu(this.yaw),s=n.speedRatio*(r.id===`hood`?.7:3.2),c=n.elevated?.65:0,l=a.clone().addScaledVector(o,-r.distance-s).add(new W(0,r.height+n.speedRatio*.65+c,0));r.id===`hood`&&l.copy(a).addScaledVector(i,1.55).add(new W(0,r.height+c*.35,0));let u=r.id===`hood`?16:6.5,d=r.id===`hood`?14:5.4,f=1-Math.exp(-u*e);this.position.x+=(l.x-this.position.x)*f,this.position.z+=(l.z-this.position.z)*f,this.position.y=Fu(this.position.y,l.y,d,e),this.target.copy(a).addScaledVector(i,r.lookAhead+n.speedRatio*4).add(new W(0,1.2+c*.25,0)),this.shake=Math.max(this.shake,n.collisionIntensity);let p=this.saveManager.settings.cameraShake,m=p===`normal`?.23:p===`low`?.11:0,h=this.shake*m;this.shake=Math.max(0,this.shake-e*1.8),this.camera.position.copy(this.position),h>.01&&(this.camera.position.x+=(Math.random()-.5)*h,this.camera.position.y+=(Math.random()-.5)*h*.5),this.camera.lookAt(this.target),this.camera.fov=Fu(this.camera.fov,r.fov+n.speedRatio*7,4.6,e),this.camera.updateProjectionMatrix()}updateCockpit(e,t,n,r,i){let a=Gu(t.config?.id),o=a.camera.localPosition,s=new W(i.z,0,-i.x),c=n.elevated?a.camera.clearance+.08:a.camera.clearance,l=r.clone().addScaledVector(s,o[0]).add(new W(0,o[1]+c+.32,0)).addScaledVector(i,o[2]),u=(n.speedRatio??0)*.14;l.addScaledVector(i,u),this.position.x=l.x,this.position.z=l.z,this.position.y=Fu(this.position.y,l.y,24,e),this.target.copy(r).addScaledVector(i,a.camera.lookAhead+(n.speedRatio??0)*4).add(new W(0,a.camera.lookHeight+c*.35,0)),this.shake=Math.max(this.shake,n.collisionIntensity*.55);let d=this.saveManager.settings.cameraShake,f=this.saveManager.settings.cockpitMotion===`off`?0:d===`normal`?.08:d===`low`?.04:0,p=this.shake*f;this.shake=Math.max(0,this.shake-e*2.1),this.camera.position.copy(this.position),p>.005&&(this.camera.position.x+=(Math.random()-.5)*p,this.camera.position.y+=(Math.random()-.5)*p*.45),this.camera.lookAt(this.target);let m=Uu.fovOffsets[this.saveManager.settings.cockpitFov]??0,h=a.camera.fov+m+(n.boosting?3:0)+(n.speedRatio??0)*2.5;this.camera.fov=Fu(this.camera.fov,h,5.5,e),this.camera.updateProjectionMatrix()}},$={HARD_SOLID:`HARD_SOLID`,SLIDE_SOLID:`SLIDE_SOLID`,LOW_SURPASSABLE:`LOW_SURPASSABLE`,SOFT_PASSABLE:`SOFT_PASSABLE`,SOLID_STATIC:`HARD_SOLID`,SOLID_DYNAMIC:`SOLID_DYNAMIC`,ROAD_SURFACE:`ROAD_SURFACE`,SOFT_OBSTACLE:`SOFT_PASSABLE`,TRIGGER_ONLY:`TRIGGER_ONLY`,DECORATIVE_NO_COLLISION:`DECORATIVE_NO_COLLISION`,NO_BUILD_ZONE:`NO_BUILD_ZONE`},Yu={carColliderPadding:.035,staticColliderPadding:.02,trafficColliderPadding:.04,softObstaclePushForce:.18,collisionDamping:.68,wallSlideFriction:.84,bounceFactor:.92,minImpactSpeedForEffect:5.5,softObstaclePassThreshold:3.2,curbClimbHeight:.62,breakerClimbHeight:.45,barrierHardness:.82},Xu={[$.HARD_SOLID]:16731978,[$.SLIDE_SOLID]:16765015,[$.LOW_SURPASSABLE]:6937087,[$.SOFT_PASSABLE]:5628114,[$.SOLID_DYNAMIC]:6806015,[$.ROAD_SURFACE]:8378558,[$.TRIGGER_ONLY]:5088511,[$.NO_BUILD_ZONE]:11832575},Zu=class{constructor(e){this.scene=e,this.cellSize=34,this.colliders=[],this.roadSurfaces=[],this.grid=new Map,this.debugGroup=new wn,this.debugGroup.name=`Collision Debug`,this.debugGroup.visible=!1,this.scene.add(this.debugGroup),this.debugTimer=0,this.lastDebugStats={staticCount:0,roadSurfaceCount:0,nearbyCount:0,currentSurface:`ground`}}addBox(e){let t=e.type??$.HARD_SOLID,n=e.padding??(t===$.SLIDE_SOLID||t===$.HARD_SOLID?Yu.staticColliderPadding:0),r={id:e.id,type:t,center:new U(e.center[0],e.center[1]),size:new U(Math.max(.05,e.size[0]-n*2),Math.max(.05,e.size[1]-n*2)),rotation:e.rotation??0,yMin:e.yMin??0,yMax:e.yMax??8,response:e.response??`block`,metadata:e.metadata??{}};return r.aabb=this.computeAabb(r),this.colliders.push(r),r.type===$.ROAD_SURFACE?this.roadSurfaces.push(r):this.isBlockingType(r.type)&&this.insertIntoGrid(r),this.lastDebugStats.staticCount=this.colliders.filter(e=>this.isBlockingType(e.type)).length,this.lastDebugStats.roadSurfaceCount=this.roadSurfaces.length,r}addRoadSurface(e){return this.addBox({...e,type:$.ROAD_SURFACE,yMin:e.yMin??(e.surfaceHeight??0)-.25,yMax:e.yMax??(e.surfaceHeight??0)+.35,response:`surface`})}resolvePlayer(e,t=.016){let n=e.getCollider(),r=Math.max(n.size.x,n.size.y)*.58+2.2,i=this.queryNearby(n.center,r),a=!1,o=0,s=[];for(let r of i){if(!this.verticalOverlap(n,r))continue;let i=this.testObbOverlap(n,r);if(!i)continue;if(r.type===$.LOW_SURPASSABLE){e.registerLowSurfaceBump?.(r.metadata?.bump??.12,t),e.velocity.multiplyScalar(r.metadata?.slowdown??.96);continue}if(r.type===$.SOFT_PASSABLE){let n=e.velocity.length();e.velocity.multiplyScalar(r.metadata?.slowdown??.93),n>Yu.softObstaclePassThreshold&&e.registerCollisionImpact?.(.12,r.id,t,{quiet:!0});continue}let c=r.type===$.SLIDE_SOLID||r.response===`slide`,l=i.normal.clone().multiplyScalar(i.depth+(c?.006:.012));e.position.x+=l.x,e.position.z+=l.z,n.center.x=e.position.x,n.center.y=e.position.z;let u=new W(i.normal.x,0,i.normal.z),d=e.velocity.dot(u);d<0&&e.velocity.addScaledVector(u,-d*(c?Yu.barrierHardness:Yu.bounceFactor)),e.velocity.multiplyScalar(c?Yu.wallSlideFriction:Yu.collisionDamping);let f=Mu((c?.1:.16)+i.depth*.18+e.velocity.length()*.018,.12,1.05);o=Math.max(o,f),a=!0,s.push(r.id)}return a&&e.registerCollisionImpact(o,s[0],t),{collided:a,intensity:o,count:s.length,ids:s}}resolveTrafficVehicles(e,t){let n=e.getCollider(),r=0;return t.forEach(t=>{let i=t.mesh.userData.dimensions;if(!i)return;let a={id:`traffic-${t.type}`,type:$.SOLID_DYNAMIC,center:new U(t.mesh.position.x,t.mesh.position.z),size:new U(Math.max(.4,i.width*t.mesh.scale.x*.82+Yu.trafficColliderPadding),Math.max(.4,i.length*t.mesh.scale.z*.84+Yu.trafficColliderPadding)),rotation:t.mesh.rotation.y,yMin:t.mesh.position.y-.15,yMax:t.mesh.position.y+i.height*t.mesh.scale.y+1.2};if(!this.verticalOverlap(n,a))return;let o=this.testObbOverlap(n,a);if(!o)return;e.position.x+=o.normal.x*(o.depth+.04),e.position.z+=o.normal.z*(o.depth+.04);let s=new W(o.normal.x,0,o.normal.z),c=e.velocity.dot(s);c<0&&e.velocity.addScaledVector(s,-c*1.05),e.velocity.multiplyScalar(.62),t.mesh.position.x-=o.normal.x*Math.min(o.depth*.28,.5),t.mesh.position.z-=o.normal.z*Math.min(o.depth*.28,.5),t.cooldown=.9,r+=1}),r&&e.registerCollisionImpact(.72,`traffic`,.016),r}findNearestRoadSurface(e,t=null){let n=null,r=1/0,i=t?.surfaceHeight??0,a=!!(t?.elevated||t?.pathId||[`ramp`,`bridge`,`elevated`].includes(t?.surfaceType));return this.roadSurfaces.forEach(t=>{let o=t.metadata.surfaceHeight??0;if(!a&&o>i+4.5)return;let s=t.center.x-e.x,c=t.center.y-e.z,l=Math.hypot(s,c);l<r&&(r=l,n=t)}),n?{id:n.metadata.pathId??n.metadata.routeId??n.id,colliderId:n.id,position:new W(n.center.x,n.metadata.surfaceHeight??0,n.center.y),heading:n.size.x>=n.size.y?(n.rotation??0)+Math.PI*.5:n.rotation??0,surfaceHeight:n.metadata.surfaceHeight??0}:null}updateDebug(e,t,n){if(this.debugGroup.visible=e,!e||(this.debugTimer-=.016,this.debugTimer>0))return;this.debugTimer=.2,this.clearDebug();let r=t?.getCollider(),i=r?this.queryNearby(r.center,90):[],a=r?this.roadSurfaces.filter(e=>e.center.distanceTo(r.center)<95):[],o=r?this.colliders.filter(e=>e.type===$.NO_BUILD_ZONE&&e.center.distanceTo(r.center)<130):[];i.forEach(e=>this.addDebugBox(e)),a.forEach(e=>this.addDebugBox(e)),o.forEach(e=>this.addDebugBox(e)),r&&this.addDebugBox({...r,id:`player`,type:$.SOLID_DYNAMIC}),this.lastDebugStats={staticCount:this.colliders.filter(e=>this.isBlockingType(e.type)).length,roadSurfaceCount:this.roadSurfaces.length,nearbyCount:i.length,clearanceCount:o.length,currentSurface:n?.surfaceId??`ground`,surfaceType:n?.surfaceType??`terrain`,surfaceHeight:n?.surfaceHeight??0}}getDebugStats(){return this.lastDebugStats}clearDebug(){for(;this.debugGroup.children.length;){let e=this.debugGroup.children[0];this.debugGroup.remove(e),e.geometry?.dispose?.(),e.material?.dispose?.()}}addDebugBox(e){let t=e.yMin??0,n=e.yMax??.12,r=Math.max(.12,n-t),i=new J(new Y(e.size.x,r,e.size.y),new Rr({color:Xu[e.type]??16777215,wireframe:!0,transparent:!0,opacity:e.type===$.ROAD_SURFACE?.34:.62}));i.position.set(e.center.x,t+r*.5,e.center.y),i.rotation.y=e.rotation??0,this.debugGroup.add(i)}queryNearby(e,t){let n=new Set,r=Math.floor((e.x-t)/this.cellSize),i=Math.floor((e.x+t)/this.cellSize),a=Math.floor((e.y-t)/this.cellSize),o=Math.floor((e.y+t)/this.cellSize);for(let e=r;e<=i;e+=1)for(let t=a;t<=o;t+=1){let r=this.grid.get(`${e}:${t}`);r&&r.forEach(e=>n.add(e))}return n}insertIntoGrid(e){let t=e.aabb,n=Math.floor(t.minX/this.cellSize),r=Math.floor(t.maxX/this.cellSize),i=Math.floor(t.minZ/this.cellSize),a=Math.floor(t.maxZ/this.cellSize);for(let t=n;t<=r;t+=1)for(let n=i;n<=a;n+=1){let r=`${t}:${n}`;this.grid.has(r)||this.grid.set(r,[]),this.grid.get(r).push(e)}}computeAabb(e){let t=this.getAxes(e.rotation??0),n=e.size.x*.5,r=e.size.y*.5,i=[t.x.clone().multiplyScalar(n).add(t.z.clone().multiplyScalar(r)),t.x.clone().multiplyScalar(n).add(t.z.clone().multiplyScalar(-r)),t.x.clone().multiplyScalar(-n).add(t.z.clone().multiplyScalar(r)),t.x.clone().multiplyScalar(-n).add(t.z.clone().multiplyScalar(-r))].map(t=>t.add(e.center));return{minX:Math.min(...i.map(e=>e.x)),maxX:Math.max(...i.map(e=>e.x)),minZ:Math.min(...i.map(e=>e.y)),maxZ:Math.max(...i.map(e=>e.y))}}testObbOverlap(e,t){let n=this.getAxes(e.rotation??0),r=this.getAxes(t.rotation??0),i=[n.x,n.z,r.x,r.z],a=1/0,o=null;for(let n of i){let r=this.projectObb(e,n),i=this.projectObb(t,n),s=Math.min(r.max,i.max)-Math.max(r.min,i.min);if(s<=0)return null;s<a&&(a=s,o=n.clone())}return e.center.clone().sub(t.center).dot(o)<0&&o.multiplyScalar(-1),{normal:new W(o.x,0,o.y),depth:a}}projectObb(e,t){let n=this.getAxes(e.rotation??0),r=e.center.dot(t),i=Math.abs(n.x.dot(t))*e.size.x*.5+Math.abs(n.z.dot(t))*e.size.y*.5;return{min:r-i,max:r+i}}getAxes(e){return{x:new U(Math.cos(e),Math.sin(e)),z:new U(-Math.sin(e),Math.cos(e))}}verticalOverlap(e,t){return(e.yMin??0)<=(t.yMax??0)&&(e.yMax??2)>=(t.yMin??0)}isBlockingType(e){return e===$.HARD_SOLID||e===$.SLIDE_SOLID||e===$.LOW_SURPASSABLE||e===$.SOFT_PASSABLE}},Qu=class{constructor(e,t,n){this.scene=e,this.effectsManager=t,this.vehicleFactory=n,this.group=new wn,this.group.name=`Mini City Drive City`,this.scene.add(this.group),this.collisionSystem=new Zu(e),this.roadSegments=Cu,this.elevatedRoutes=[],this.roadPaths=this.prepareRoadPaths(Tu),this.legacyElevatedRoutes=[...wu].sort((e,t)=>(t.priority??0)-(e.priority??0)),this.collectibles=[],this.landmarks=Ou,this.currentZoneId=null,this.textures=new Map,this.materials=this.createMaterials()}prepareRoadPaths(e){return e.map(e=>{let t=e.points.map(([e,t,n])=>new W(e,t,n)),n=new wi(t,!!e.closed,`catmullrom`,.35),r=e.samples??Math.max(18,Math.round(t.length*8)),i=n.getPoints(r),a=[],o=0;for(let e=0;e<i.length-1;e+=1){let t=i[e],n=i[e+1],r=Math.hypot(n.x-t.x,n.z-t.z);r<.01||(o+=r,a.push({index:e,a:t,b:n,midpoint:new W((t.x+n.x)*.5,(t.y+n.y)*.5,(t.z+n.z)*.5),heading:Math.atan2(n.x-t.x,n.z-t.z),slope:Math.atan2(n.y-t.y,r),length:r}))}return{...e,controlPoints:t,curve:n,samples:i,segments:a,length:o}}).sort((e,t)=>(t.priority??0)-(e.priority??0))}createMaterials(){return{ground:new X({color:`#b8d884`,roughness:.84}),park:new X({color:`#73b86d`,roughness:.88}),asphalt:new X({color:`#41484e`,roughness:.72}),sidewalk:new X({color:`#d8d1c4`,roughness:.78}),lane:new X({color:`#f6f0dc`,roughness:.48}),crosswalk:new X({color:`#ffffff`,roughness:.42}),glass:new X({color:`#9bd4e6`,roughness:.18,metalness:.12}),buildingA:new X({color:`#d9e0e4`,roughness:.58}),buildingB:new X({color:`#c8d3dc`,roughness:.58}),buildingC:new X({color:`#ebe0cf`,roughness:.62}),trim:new X({color:`#caa76a`,roughness:.34,metalness:.48}),dark:new X({color:`#1f2834`,roughness:.5}),white:new X({color:`#fff8e9`,roughness:.54}),redLight:new X({color:`#d93434`,emissive:`#c51d1d`,emissiveIntensity:.65}),greenLight:new X({color:`#31a96c`,emissive:`#228f56`,emissiveIntensity:.55}),water:new X({color:`#78c7e7`,roughness:.08,metalness:.04,transparent:!0,opacity:.78}),runway:new X({color:`#343a40`,roughness:.68}),concrete:new X({color:`#c9c4b8`,roughness:.78}),bridgeBeam:new X({color:`#8e9699`,roughness:.68,metalness:.06}),barrier:new X({color:`#f1eadc`,roughness:.52}),shadowZone:new X({color:`#8d9a8e`,roughness:.9,transparent:!0,opacity:.32}),containerA:new X({color:`#b45f45`,roughness:.62}),containerB:new X({color:`#4d738f`,roughness:.62}),river:new X({color:`#8ccde8`,roughness:.12,metalness:.02,transparent:!0,opacity:.82})}}build(){this.addGround(),this.addZones(),this.addRoads(),this.addReservedZones(),this.addDowntown(),this.addPark(),this.addHighway(),this.addRiverCorridor(),this.addAirport(),this.addIndustrial(),this.addResidential(),this.addMarket(),this.addHill(),this.addLandmarks(),this.addCollectibles(),this.addParkedCars()}addGround(){let e=new J(new Y(xu.groundSize,.08,xu.groundSize),this.materials.ground);e.position.y=-.05,e.receiveShadow=!0,this.group.add(e)}addZones(){Su.forEach(e=>{if(e.id===`downtown`)return;let t=e.id===`park`?this.materials.park:new X({color:e.color,roughness:.82}),n=new J(new Y(e.size[0],.04,e.size[1]),t);n.position.set(e.center[0],.005,e.center[1]),n.receiveShadow=!0,this.group.add(n)})}registerSolidBox(e,t,n,r,i,a=0,o=5,s={}){this.collisionSystem.addBox({id:e,type:s.type??$.HARD_SOLID,center:[t,n],size:[Math.max(.4,r),Math.max(.4,i)],rotation:a,yMin:s.yMin??0,yMax:s.yMax??o,response:s.response??`block`,metadata:s.metadata??{}})}getRotatedRectProbePoints(e,t,n,r,i=0){let a=n*.5,o=r*.5,s=Math.cos(i),c=Math.sin(i);return[[0,0],[-a,-o],[a,-o],[a,o],[-a,o],[0,-o],[a,0],[0,o],[-a,0]].map(([n,r])=>new W(e+n*s-r*c,0,t+n*c+r*s))}rectsOverlapApprox(e,t,n,r,i,a,o,s,c,l){let u=new W(e,0,t),d=new W(a,0,o),f=new W(n,0,r),p=new W(s,0,c),m=this.getRotatedRectProbePoints(e,t,n,r,i),h=this.getRotatedRectProbePoints(a,o,s,c,l);return m.some(e=>Vu(e,d,p,l))||h.some(e=>Vu(e,u,f,i))}overlapsRoadClearance(e,t,n,r,i=0,a=2.5){let o=n+a*2,s=r+a*2;for(let n of this.roadSegments)if(!n.soft&&this.rectsOverlapApprox(e,t,o,s,i,n.center[0],n.center[1],n.size[0]+a*2,n.size[1]+a*2,n.rotation??0))return!0;let c=Math.hypot(o,s)*.5,l=new W(e,0,t);return this.roadPaths.some(e=>{let t=this.projectPointToPath(e,l,c+a);return!!(t&&t.lateralDistance<e.width*.5+c+a)})}registerRoadSurface(e,t,n,r,i,a=0,o=0,s={}){this.collisionSystem.addRoadSurface({id:e,center:[t,n],size:[r,i],rotation:a,surfaceHeight:o,yMin:o-.28,yMax:o+.38,metadata:{surfaceHeight:o,...s}})}addRoads(){this.roadSegments.forEach(e=>{this.addRoadSegment(e)}),this.addPathRoads()}addReservedZones(){Eu.forEach(e=>{this.collisionSystem.addBox({id:e.id,type:$.NO_BUILD_ZONE,center:e.center,size:e.size,rotation:e.rotation??0,yMin:0,yMax:.12,response:`debug`,metadata:{clearance:!0}})})}addRoadSegment(e){let t=e.soft?new X({color:`#8aae72`,roughness:.9}):e.roadClass===`runway`?this.materials.runway:this.materials.asphalt,n=new J(new Y(e.size[0],.08,e.size[1]),t);n.position.set(e.center[0],.04+(e.elevation??0),e.center[1]),n.rotation.y=e.rotation,n.receiveShadow=!0,this.group.add(n),this.registerRoadSurface(e.id,e.center[0],e.center[1],e.size[0],e.size[1],e.rotation,e.elevation??0,{surfaceType:e.roadClass??`road`,zone:e.zone}),this.addRoadDesign(e),e.showSidewalks&&this.addSidewalk(e),e.forceBarrier&&this.addRoadBarriers(e),(e.elevation??0)>5&&this.addElevatedSupports(e)}addPathRoads(){this.roadPaths.forEach(e=>this.addRoadPath(e))}addRoadPath(e){let t=new J(this.createPathDeckGeometry(e),this.materials.asphalt);t.castShadow=!0,t.receiveShadow=!0,this.group.add(t),e.segments.forEach(t=>{this.registerRoadSurface(`${e.id}-surface-${t.index}`,t.midpoint.x,t.midpoint.z,e.width,t.length+1.5,t.heading,t.midpoint.y,{surfaceType:e.type,zone:e.zone,elevated:t.midpoint.y>2.2,pathId:e.id,pathSegment:t.index}),this.addPathLaneMarks(e,t),e.showBarriers&&this.addPathBarriers(e,t),this.addPathUnderside(e,t),t.index%5==0&&t.midpoint.y>2.2&&this.addPathShadow(e,t)}),this.addPathSupports(e),this.addPathGantrySigns(e)}createPathDeckGeometry(e){let t=[],n=[],r=e.width*.5,i=e.deckThickness??1.25;e.samples.forEach((n,a)=>{let o=e.samples[Math.max(0,a-1)],s=e.samples[Math.min(e.samples.length-1,a+1)],c=Math.atan2(s.x-o.x,s.z-o.z),l=new W(Math.cos(c),0,-Math.sin(c)),u=n.clone().addScaledVector(l,r),d=n.clone().addScaledVector(l,-r);t.push(u.x,u.y,u.z,d.x,d.y,d.z,u.x,u.y-i,u.z,d.x,d.y-i,d.z)});for(let t=0;t<e.samples.length-1;t+=1){let e=t*4,r=(t+1)*4;n.push(e,e+1,r+1,e,r+1,r,e+2,r+2,r+3,e+2,r+3,e+3,e,r,r+2,e,r+2,e+2,e+1,e+3,r+3,e+1,r+3,r+1)}let a=(e.samples.length-1)*4;n.push(0,2,3,0,3,1,a,a+1,a+3,a,a+3,a+2);let o=new Dr;return o.setAttribute(`position`,new hr(t,3)),o.setIndex(n),o.computeVertexNormals(),o}addPathLaneMarks(e,t){let n=Math.min(7.2,t.length*.82);if(this.getPathLaneDividerOffsets(e).forEach(e=>{if(t.index%2!=0)return;let r=this.offsetPathPoint(t.midpoint,t.heading,e),i=new J(new Y(.22,.035,n),this.materials.lane);i.position.set(r.x,t.midpoint.y+.08,r.z),i.rotation.set(-t.slope,t.heading,0),this.group.add(i)}),e.median&&this.isHighwayPath(e)){let n=new J(new Y(.48,.24,t.length+.3),this.materials.trim);n.position.set(t.midpoint.x,t.midpoint.y+.16,t.midpoint.z),n.rotation.set(-t.slope,t.heading,0),this.group.add(n),this.registerSolidBox(`${e.id}-center-divider-${t.index}`,t.midpoint.x,t.midpoint.z,.52,t.length+.42,t.heading,t.midpoint.y+.5,{type:$.SLIDE_SOLID,response:`slide`,yMin:Math.max(0,t.midpoint.y-.08),metadata:{pathId:e.id,centerDivider:!0,pathSegment:t.index}})}else e.median&&this.addPathPaintedCenterLine(t)}addPathPaintedCenterLine(e){if(e.index%2!=0)return;let t=new J(new Y(.16,.026,Math.min(6.8,e.length*.78)),this.materials.trim);t.position.set(e.midpoint.x,e.midpoint.y+.085,e.midpoint.z),t.rotation.set(-e.slope,e.heading,0),this.group.add(t)}addPathBarriers(e,t){e.barriers&&[-1,1].forEach(n=>{let r=this.offsetPathPoint(t.midpoint,t.heading,n*e.width*.5),i=new J(new Y(.62,1.05,t.length+.9),this.materials.barrier);i.position.set(r.x,t.midpoint.y+.55,r.z),i.rotation.set(-t.slope,t.heading,0),i.castShadow=!0,this.group.add(i),this.registerSolidBox(`${e.id}-path-barrier-${t.index}-${n}`,r.x,r.z,.82,t.length+1.1,t.heading,t.midpoint.y+1.9,{type:$.SLIDE_SOLID,response:`slide`,yMin:Math.max(0,t.midpoint.y-.55),metadata:{pathId:e.id,barrier:!0,pathSegment:t.index}})})}addPathUnderside(e,t){if(t.midpoint.y<1.2)return;let n=e.deckThickness??1.25;if([-1,1].forEach(r=>{let i=this.offsetPathPoint(t.midpoint,t.heading,r*(e.width*.5-1.1)),a=new J(new Y(.72,.42,t.length+.6),this.materials.bridgeBeam);a.position.set(i.x,t.midpoint.y-n-.28,i.z),a.rotation.set(-t.slope,t.heading,0),a.castShadow=!0,this.group.add(a)}),t.index%3==0){let r=new J(new Y(e.width*.82,.34,.45),this.materials.bridgeBeam);r.position.set(t.midpoint.x,t.midpoint.y-n-.36,t.midpoint.z),r.rotation.y=t.heading,this.group.add(r)}}addPathSupports(e){let t=e.supportSpacing??30,n=0,r=t*.65;e.segments.forEach(i=>{if(n+=i.length,n<r||i.midpoint.y<2.4)return;r+=t;let a=e.supportStyle===`bridge-pier`||e.type===`bridge`,o=e.supportStyle===`single`?[0]:a?[-e.width*.28,0,e.width*.28]:[-e.width*.26,e.width*.26],s=Math.max(1.2,i.midpoint.y-(e.deckThickness??1.25));o.forEach(t=>{let n=this.offsetPathPoint(i.midpoint,i.heading,t),r=new J(a?new pi(.92,1.12,s,16):new Y(1.45,s,1.45),this.materials.concrete);r.position.set(n.x,s*.5,n.z),r.castShadow=!0,r.receiveShadow=!0,this.group.add(r),this.registerSolidBox(`${e.id}-path-support-${i.index}-${t.toFixed(1)}`,n.x,n.z,a?2.5:1.9,a?2.5:1.9,i.heading,s,{metadata:{pathId:e.id,support:!0}})});let c=new J(new Y(e.width*.68,.6,2.4),this.materials.bridgeBeam);c.position.set(i.midpoint.x,s+.16,i.midpoint.z),c.rotation.y=i.heading,c.castShadow=!0,this.group.add(c)})}addPathGantrySigns(e){e.signs?.forEach(t=>{let n=e.segments[Math.min(e.segments.length-1,Math.max(0,t.index??0))];if(!n)return;let r=new wn;[-1,1].forEach(t=>{let n=new J(new Y(.22,5.8,.22),this.materials.dark);n.position.set(t*e.width*.42,2.9,0),r.add(n)});let i=new J(new Y(e.width*.9,.22,.22),this.materials.dark);i.position.y=5.65,r.add(i);let a=this.createTextBoard(t.text,`Mini City Expressway`,Math.min(10,e.width*.48),1.6);a.position.y=4.9,r.add(a),r.position.set(n.midpoint.x,n.midpoint.y+.15,n.midpoint.z),r.rotation.y=n.heading,this.group.add(r)})}addPathShadow(e,t){let n=new J(new Y(e.width*1.2,.018,t.length+1),this.materials.shadowZone);n.position.set(t.midpoint.x,.03,t.midpoint.z),n.rotation.y=t.heading,this.group.add(n)}getPathLaneDividerOffsets(e){let t=e.lanes??2;return t<=1?[]:e.median?this.isHighwayPath(e)&&t>=4?[-e.width*.25,e.width*.25]:[]:t===2?[0]:t===3?[-e.width*.18,e.width*.18]:[-e.width*.24,e.width*.24]}offsetPathPoint(e,t,n){return new W(e.x+Math.cos(t)*n,e.y,e.z-Math.sin(t)*n)}addElevatedRoutes(){this.elevatedRoutes.forEach(e=>{e.kind===`bridge`?this.addBridgeSpan(e):e.kind===`ramp`?this.addRampDeck(e):this.addElevatedDeck(e),this.addHighwayBarriers(e),this.addShoulderLines(e),this.addMergeMarkings(e),this.addDeckUnderside(e),this.addElevatedSupportsForRoute(e),this.addUnderpassDressing(e),e.signs?.forEach(t=>this.addGantrySign(e,t.at??0,t.text))})}addElevatedDeck(e){this.addRouteDeckAssembly(e,this.materials.asphalt)}addRampDeck(e){this.addRouteDeckAssembly(e,this.materials.asphalt)}addBridgeSpan(e){this.addRouteDeckAssembly(e,this.materials.asphalt),this.addBridgePiers(e)}addRouteDeckAssembly(e,t){let n=this.createRouteSurfaceGroup(e);this.registerRoadSurface(e.id,e.center[0],e.center[1],e.size[0],e.size[1],e.rotation,this.getRouteAverageHeight(e),{surfaceType:e.kind,zone:e.zone,elevated:!0,routeId:e.id});let r=e.deckThickness??1.4,i=new J(new Y(e.size[0],r,e.size[1]),t);i.position.y=-r*.5,i.castShadow=!0,i.receiveShadow=!0,n.surface.add(i);let a=Math.min(5.2,this.getRouteWidth(e)*.34),o=this.isRouteHorizontal(e),s=this.getRouteLength(e);if(this.getLaneDividerOffsets(e).forEach(e=>{let t=Math.max(4,Math.floor(s/18));for(let r=0;r<t;r+=1){if(r%2)continue;let i=-s*.46+r*(s*.92/t),a=new J(new Y(o?7.2:.2,.035,o?.2:7.2),this.materials.lane);a.position.set(o?i:e,.06,o?e:i),n.surface.add(a)}}),[-1,1].forEach(e=>{let t=new J(new Y(o?s*.95:.18,.032,o?.18:s*.95),this.materials.lane);t.position.set(o?0:e*a,.065,o?e*a:0),n.surface.add(t)}),e.median){let e=new J(new Y(o?s*.95:.48,.22,o?.48:s*.95),this.materials.trim);e.position.y=.16,n.surface.add(e)}this.group.add(n.root)}addDeckUnderside(e){let t=this.createRouteSurfaceGroup(e),n=this.isRouteHorizontal(e),r=this.getRouteLength(e),i=this.getRouteWidth(e),a=e.deckThickness??1.4;[-1,1].forEach(e=>{let o=new J(new Y(n?r*.98:.9,.65,n?.9:r*.98),this.materials.bridgeBeam);o.position.set(n?0:e*(i*.5-1.1),-a-.26,n?e*(i*.5-1.1):0),o.castShadow=!0,t.surface.add(o)});let o=Math.max(3,Math.floor(r/34));for(let e=0;e<o;e+=1){let s=-r*.44+e*(r*.88/Math.max(1,o-1)),c=new J(new Y(n?.55:i*.92,.38,n?i*.92:.55),this.materials.bridgeBeam);c.position.set(n?s:0,-a-.35,n?0:s),t.surface.add(c)}this.group.add(t.root)}addHighwayBarriers(e){if(!e.barriers)return;let t=this.createRouteSurfaceGroup(e),n=this.isRouteHorizontal(e),r=this.getRouteLength(e),i=this.getRouteWidth(e);[-1,1].forEach(a=>{let o=new J(new Y(n?r*.98:.58,1.1,n?.58:r*.98),this.materials.barrier);o.position.set(n?0:a*i*.5,.54,n?a*i*.5:0),o.castShadow=!0,t.surface.add(o);let s=new J(new Y(n?r*.96:.18,.18,n?.18:r*.96),this.materials.dark);s.position.set(n?0:a*(i*.5-.15),1.2,n?a*(i*.5-.15):0),t.surface.add(s);let c=this.getRouteWorldPoint(e,0,a*i*.5);if(this.registerSolidBox(`${e.id}-barrier-${a}`,c.x,c.z,n?r*.98:.82,n?.82:r*.98,e.rotation,this.getRouteAverageHeight(e)+2,{yMin:Math.max(0,this.getRouteAverageHeight(e)-.6),metadata:{routeId:e.id,barrier:!0}}),e.kind===`ramp`)for(let t=0;t<4;t+=1){let o=(t+.5)/4,s=-r*.46+o*r*.92,c=this.getRouteHeightAtT(e,o),l=this.getRouteWorldPoint(e,s,a*i*.5);this.registerSolidBox(`${e.id}-ramp-barrier-${a}-${t}`,l.x,l.z,n?r*.23:.82,n?.82:r*.23,e.rotation,c+1.9,{yMin:Math.max(0,c-.55),metadata:{routeId:e.id,barrier:!0,rampSegment:t}})}}),this.group.add(t.root)}addShoulderLines(e){if(!e.shoulders)return;let t=this.createRouteSurfaceGroup(e),n=this.isRouteHorizontal(e),r=this.getRouteLength(e),i=this.getRouteWidth(e);[-1,1].forEach(e=>{let a=new J(new Y(n?r*.92:.14,.035,n?.14:r*.92),this.materials.crosswalk);a.position.set(n?0:e*(i*.5-3.2),.08,n?e*(i*.5-3.2):0),t.surface.add(a)}),this.group.add(t.root)}addMergeMarkings(e){if(e.kind!==`ramp`)return;let t=this.createRouteSurfaceGroup(e),n=this.isRouteHorizontal(e),r=this.getRouteLength(e);for(let e=0;e<4;e+=1){let i=-r*.25+e*8,a=new J(new Y(n?4.6:.16,.04,n?.16:4.6),this.materials.crosswalk);a.position.set(n?i:2.4+e*.45,.1,n?2.4+e*.45:i),a.rotation.y=n?.34:-.34,t.surface.add(a)}this.group.add(t.root)}addElevatedSupportsForRoute(e){let t=this.getRouteLength(e),n=e.supportSpacing??32,r=Math.max(2,Math.floor(t/n));for(let n=0;n<r;n+=1){let i=r===1?.5:n/(r-1),a=-t*.44+i*t*.88,o=this.getRouteHeightAtT(e,a/t+.5);o<2.4||this.addSupportBent(e,a,o)}}addSupportBent(e,t,n){let r=this.getRouteWidth(e),i=Math.max(1.2,n-(e.deckThickness??1.4)),a=e.supportStyle===`bridge-pier`;(e.supportStyle===`single`?[0]:a?[-r*.32,0,r*.32]:[-r*.28,r*.28]).forEach(n=>{let r=this.getRouteWorldPoint(e,t,n),o=new J(a?new pi(.88,1.08,i,16):new Y(1.5,i,1.5),this.materials.concrete);o.position.set(r.x,i*.5,r.z),o.castShadow=!0,o.receiveShadow=!0,this.group.add(o),this.registerSolidBox(`${e.id}-support-${Math.round(t)}-${n.toFixed(1)}`,r.x,r.z,a?2.4:1.9,a?2.4:1.9,e.rotation,i,{metadata:{routeId:e.id,support:!0}});let s=new J(new Y(a?4.2:3,.34,a?3.2:2.6),this.materials.concrete);s.position.set(r.x,.17,r.z),s.rotation.y=e.rotation,this.group.add(s)});let o=this.getRouteWorldPoint(e,t,0),s=new J(new Y(a?r*.82:r*.68,.65,a?3.6:2.4),this.materials.bridgeBeam);s.position.set(o.x,i+.18,o.z),s.rotation.y=e.rotation,s.castShadow=!0,this.group.add(s)}addBridgePiers(e){let t=this.getRouteLength(e);[-.34,0,.34].forEach(n=>{let r=n*t,i=this.getRouteWorldPoint(e,r,0),a=new J(new Y(8.2,3,5.4),this.materials.concrete);a.position.set(i.x,1.5,i.z),a.rotation.y=e.rotation,a.castShadow=!0,this.group.add(a),this.registerSolidBox(`${e.id}-pier-${n}`,i.x,i.z,8.8,5.8,e.rotation,3.4,{metadata:{routeId:e.id,bridgePier:!0}})})}addGantrySign(e,t,n){let r=this.getRouteLength(e),i=Math.max(-.45,Math.min(.45,t))*r,a=this.getRouteWorldPoint(e,i,0),o=this.getRouteHeightAtT(e,i/r+.5),s=new wn,c=this.getRouteWidth(e);[-1,1].forEach(e=>{let t=new J(new Y(.22,5.8,.22),this.materials.dark);t.position.set(e*c*.42,2.9,0),s.add(t)});let l=new J(new Y(c*.92,.22,.22),this.materials.dark);l.position.y=5.65,s.add(l);let u=this.createTextBoard(n,`Mini City Expressway`,Math.min(10,c*.45),1.6);u.position.y=4.9,s.add(u),s.position.set(a.x,o+.15,a.z),s.rotation.y=e.rotation,this.group.add(s)}addUnderpassDressing(e){if(![`bridge`,`deck`,`flyover`].includes(e.kind))return;let t=this.getRouteLength(e),n=this.getRouteWidth(e),r=new J(new Y(this.isRouteHorizontal(e)?t*.92:n*1.25,.018,this.isRouteHorizontal(e)?n*1.25:t*.92),this.materials.shadowZone);r.position.set(e.center[0],.03,e.center[1]),r.rotation.y=e.rotation,this.group.add(r),e.kind===`bridge`&&[-130,0,130].forEach(t=>{let r=this.getRouteWorldPoint(e,t,-n*.72);this.addBillboard(r.x,r.z,`UNDERPASS`,`Bridge clearance`)})}createRouteSurfaceGroup(e){let t=new wn;t.position.set(e.center[0],this.getRouteAverageHeight(e),e.center[1]),t.rotation.y=e.rotation??0;let n=new wn,r=(e.endElevation??e.deckElevation??0)-(e.startElevation??e.deckElevation??0),i=Math.atan2(r,this.getRouteLength(e));return Math.abs(r)>.01&&(this.isRouteHorizontal(e)?n.rotation.z=i:n.rotation.x=-i),t.add(n),{root:t,surface:n}}isRouteHorizontal(e){return e.size[0]>=e.size[1]}getRouteLength(e){return Math.max(e.size[0],e.size[1])}getRouteWidth(e){return Math.min(e.size[0],e.size[1])}getRouteAverageHeight(e){let t=e.startElevation??e.deckElevation??0;return(t+(e.endElevation??e.deckElevation??t))*.5}getRouteHeightAtT(e,t){let n=e.startElevation??e.deckElevation??0,r=e.endElevation??e.deckElevation??n,i=t*t*(3-2*t);return n+(r-n)*i}getRouteLocal(e,t,n=0){let r=e.rotation??0,i=Math.cos(-r),a=Math.sin(-r),o=t.x-e.center[0],s=t.z-e.center[1],c=o*i-s*a,l=o*a+s*i,u=this.isRouteHorizontal(e),d=this.getRouteLength(e),f=this.getRouteWidth(e),p=u?c:l,m=u?l:c;return{x:c,z:l,major:p,minor:m,t:Math.max(0,Math.min(1,p/d+.5)),inside:Math.abs(p)<=d*.5+n&&Math.abs(m)<=f*.5+n}}getRouteWorldPoint(e,t,n=0){let r=this.isRouteHorizontal(e),i=r?t:n,a=r?n:t,o=Math.cos(e.rotation??0),s=Math.sin(e.rotation??0);return new W(e.center[0]+i*o-a*s,0,e.center[1]+i*s+a*o)}getLaneDividerOffsets(e){let t=e.lanes??2;return t<=1||t===2?[0]:t===3?[-3.2,3.2]:[-5.3,5.3]}addRoadDesign(e){e.roadClass===`runway`||e.soft||(this.addLaneLines(e),e.median&&(this.isHighwaySegment(e)?this.addMedian(e):this.addPaintedCenterLine(e)))}isHighwaySegment(e){return e.zone===`highway`||e.roadClass===`highway`||e.roadClass===`bridge`}isHighwayPath(e){return e.zone===`highway`||e.type===`elevated`||e.type===`bridge`}addSidewalk(e){if(e.roadClass===`highway`||e.roadClass===`runway`)return;let t=e.roadClass===`market`?1.8:2.8,n=new J(new Y(e.size[0]+t,.045,e.size[1]+t),this.materials.sidewalk);n.position.set(e.center[0],.012+(e.elevation??0),e.center[1]),n.rotation.y=e.rotation,n.receiveShadow=!0,this.group.add(n)}addLaneLines(e){let t=Math.max(e.size[0],e.size[1]),n=e.size[0]>=e.size[1],r=Math.floor(t/12),i=this.getRoadLaneMarkOffsets(e);if(i.length!==0)for(let t=-r;t<=r;t+=1)t%2==0&&i.forEach(r=>{let i=new J(new Y(n?5.4:.22,.018,n?.22:5.4),this.materials.lane),a=t*6,o=n?Math.cos(e.rotation):-Math.sin(e.rotation),s=n?Math.sin(e.rotation):Math.cos(e.rotation),c=n?-Math.sin(e.rotation):Math.cos(e.rotation),l=n?Math.cos(e.rotation):Math.sin(e.rotation);i.position.set(e.center[0]+o*a+c*r,.097+(e.elevation??0),e.center[1]+s*a+l*r),i.rotation.y=e.rotation,this.group.add(i)})}addPaintedCenterLine(e){let t=Math.max(e.size[0],e.size[1]),n=e.size[0]>=e.size[1],r=Math.floor(t/14);for(let t=-r;t<=r;t+=1){if(t%2!=0)continue;let r=new J(new Y(n?6.2:.16,.022,n?.16:6.2),this.materials.trim),i=t*7,a=n?Math.cos(e.rotation):-Math.sin(e.rotation),o=n?Math.sin(e.rotation):Math.cos(e.rotation);r.position.set(e.center[0]+a*i,.102+(e.elevation??0),e.center[1]+o*i),r.rotation.y=e.rotation,this.group.add(r)}}getRoadLaneMarkOffsets(e){let t=e.lanes??2;if(t<=1)return[];let n=Math.min(e.size[0],e.size[1]);return e.median?this.isHighwaySegment(e)&&t>=4?[-n*.25,n*.25]:[]:t===2?[0]:t===3?[-n*.18,n*.18]:[-n*.24,n*.24]}addMedian(e){let t=e.size[0]>=e.size[1],n=Math.max(e.size[0],e.size[1])*.96,r=new J(new Y(t?n:.46,.2,t?.46:n),this.materials.trim);r.position.set(e.center[0],.15+(e.elevation??0),e.center[1]),r.rotation.y=e.rotation,this.group.add(r),this.registerSolidBox(`${e.id}-center-divider`,e.center[0],e.center[1],t?n:.5,t?.5:n,e.rotation,(e.elevation??0)+.5,{type:$.SLIDE_SOLID,response:`slide`,yMin:Math.max(0,(e.elevation??0)-.05),metadata:{segmentId:e.id,centerDivider:!0}})}addRoadBarriers(e){let t=e.size[0]>=e.size[1],n=t?e.size[1]:e.size[0];[-1,1].forEach(r=>{let i=new J(new Y(t?e.size[0]*.98:.28,.42,t?.28:e.size[1]*.98),this.materials.white),a=r*n*.54,o=t?-Math.sin(e.rotation):Math.cos(e.rotation),s=t?Math.cos(e.rotation):Math.sin(e.rotation);i.position.set(e.center[0]+o*a,.38+(e.elevation??0),e.center[1]+s*a),i.rotation.y=e.rotation,this.group.add(i),this.registerSolidBox(`${e.id}-barrier-${r}`,e.center[0]+o*a,e.center[1]+s*a,t?e.size[0]*.98:.42,t?.42:e.size[1]*.98,e.rotation,(e.elevation??0)+1.35,{type:$.SLIDE_SOLID,response:`slide`,yMin:e.elevation??0,metadata:{segmentId:e.id,barrier:!0}})})}addElevatedSupports(e){let t=e.size[0]>=e.size[1],n=t?e.size[0]:e.size[1],r=Math.max(2,Math.floor(n/44));for(let i=0;i<r;i+=1){let a=r===1?0:(i/(r-1)-.5)*n*.82,o=new J(new Y(2.2,e.elevation+.8,2.2),this.materials.sidewalk);o.position.set(e.center[0]+(t?Math.cos(e.rotation)*a:0),(e.elevation+.8)*.5,e.center[1]+(t?Math.sin(e.rotation)*a:a)),o.castShadow=!0,this.group.add(o),this.registerSolidBox(`${e.id}-support-${i}`,o.position.x,o.position.z,2.6,2.6,e.rotation,e.elevation+.8)}}addCrosswalk(e,t){for(let n=-3;n<=3;n+=1){let r=new J(new Y(.55,.025,7),this.materials.crosswalk);r.position.set(e+n*1.2,.092,t+7.2),this.group.add(r)}}addSpeedBreaker(e,t,n=0){let r=new J(new Y(8.2,.16,.72),this.materials.trim);r.position.set(e,.16,t),r.rotation.y=n,r.castShadow=!0,this.group.add(r),this.registerSolidBox(`speed-breaker-${e}-${t}`,e,t,8.2,.72,n,.22,{type:$.LOW_SURPASSABLE,response:`bump`,metadata:{bump:.13,slowdown:.94}})}addTrafficLight(e,t){let n=new J(new pi(.08,.08,3.2,10),this.materials.dark);n.position.set(e,1.6,t),n.castShadow=!0;let r=new J(new Y(.42,1.08,.28),this.materials.dark);r.position.set(e,3.05,t);let i=new J(new Na(.11,12,8),this.materials.redLight);i.position.set(e,3.28,t+.16);let a=new J(new Na(.11,12,8),this.materials.greenLight);a.position.set(e,2.85,t+.16),this.group.add(n,r,i,a)}addDowntown(){[[-24,-24,11,24],[24,-24,13,34],[-24,24,12,28],[24,24,16,40],[-78,-42,11,22],[78,42,12,28],[-78,42,11,26],[78,-42,12,30],[-118,-18,10,18],[118,18,12,24],[-118,54,10,20],[118,-54,11,22],[-36,92,12,24],[72,92,14,30],[-88,-92,12,22],[88,-92,13,26]].forEach(([e,t,n,r],i)=>{this.addBuilding(e,t,n,r,i%2?this.materials.buildingA:this.materials.buildingB)}),this.addRooftopDetail(24,-24,14,34),this.addRooftopDetail(24,24,14,34),this.addBillboard(8,51,`MINI CITY`,`Free Drive Zone`),this.addBillboard(48,-51,`GAMEHUB`,`Powered by MH Horizon`),this.addCityHall(24,72),this.addPlaza(-24,88),[-112,-62,0,62,112].forEach(e=>this.addBusStop(e,-76)),[-80,-40,40,80].forEach(e=>this.addParkingBay(e,72,0))}addBuilding(e,t,n,r,i){if(this.overlapsRoadClearance(e,t,n,n,0,3.2))return!1;let a=new J(new Y(n,r,n),i);a.position.set(e,r*.5,t),a.castShadow=!0,a.receiveShadow=!0,this.group.add(a),this.registerSolidBox(`building-${e}-${t}`,e,t,n*.94,n*.94,0,r+.25),this.addRooftopDetail(e,t,n,r);let o=Math.floor(r/3.2);for(let r=1;r<o;r+=1)[-1,1].forEach(i=>{let a=new J(new Y(n*.72,.75,.045),this.materials.glass);a.position.set(e,r*3+1.1,t+n*.51*i),this.group.add(a)});return!0}addPark(){this.addParkGate(-122,34),this.addFountain(-190,66),this.addStatue(-168,86);for(let e=0;e<54;e+=1){let t=e/26*Math.PI*2,n=34+e%6*7;this.addTree(-190+Math.cos(t)*n,66+Math.sin(t)*n)}for(let e=0;e<12;e+=1)this.addBench(-245+e*14,28+e%3*28,e%2?Math.PI*.5:0);[[-220,38],[-184,34],[-226,100],[-154,94],[-188,124],[-130,64]].forEach(([e,t])=>this.addFlowerBed(e,t)),this.addWalkingPath(-190,66,62,42),this.addFence(-270,0,130,!0),this.addFence(-104,126,140,!1)}addFountain(e,t){let n=new J(new pi(4.8,5.3,.55,32),this.materials.trim);n.position.set(e,.28,t);let r=new J(new pi(4.2,4.2,.18,32),this.materials.water);r.position.set(e,.66,t);let i=new J(new pi(.22,.42,2.8,18),this.materials.water);i.position.set(e,1.8,t),this.group.add(n,r,i),this.registerSolidBox(`fountain-${e}-${t}`,e,t,8.9,8.9,0,2.6)}addStatue(e,t){let n=new J(new Y(2.2,.8,2.2),this.materials.trim);n.position.set(e,.4,t);let r=new J(new pi(.36,.5,3.2,14),this.materials.white);r.position.set(e,2.3,t),this.group.add(n,r),this.registerSolidBox(`statue-${e}-${t}`,e,t,2.8,2.8,0,4)}addTree(e,t){let n=new J(new pi(.22,.3,1.6,8),this.materials.trim);n.position.set(e,.8,t);let r=new J(new Na(1.25,12,8),this.materials.park);r.position.set(e,2,t),n.castShadow=!0,r.castShadow=!0,this.group.add(n,r)}addBench(e,t,n=0){let r=new J(new Y(2.4,.22,.65),this.materials.trim);r.position.set(e,.58,t),r.rotation.y=n;let i=new J(new Y(2.4,.65,.16),this.materials.trim);i.position.set(e,1,t-.32),i.rotation.y=n,this.group.add(r,i),this.registerSolidBox(`bench-${e}-${t}`,e,t,2.6,.9,n,1.2,{type:$.SOFT_PASSABLE,response:`soft`})}addFence(e,t,n,r){let i=Math.floor(n/4);for(let n=0;n<i;n+=1){let i=new J(new Y(.16,1.1,.16),this.materials.white);i.position.set(e+(r?0:n*4),.55,t+(r?n*4:0)),this.group.add(i)}}addHighway(){this.addBillboard(46,-392,`HIGHWAY RING`,`Long fast routes`),this.addBillboard(-382,-388,`AIRPORT`,`Terminal route`),this.addBillboard(0,-216,`ELEVATED RIVER BRIDGE`,`Tall deck - clear underpass`)}addResidential(){[[126,36],[162,28],[214,30],[248,66],[132,92],[178,112],[226,118],[126,142],[214,148],[258,104]].forEach(([e,t],n)=>{if(this.overlapsRoadClearance(e,t,10,8,0,2.4))return;let r=new J(new Y(10,5.4,8),this.materials.buildingC);r.position.set(e,2.7,t);let i=new J(new mi(7.4,2.4,4),this.materials.trim);i.position.set(e,6.6,t),i.rotation.y=Math.PI*.25,this.group.add(r,i),this.registerSolidBox(`house-${e}-${t}`,e,t,9.6,7.6,0,7),this.addTree(e+(n%2?8:-8),t+8),this.addDriveway(e,t-7),this.addGarden(e+(n%2?-6:6),t+2)}),this.addBusStop(126,48),this.addBusStop(232,104),this.addLocalSquare(184,74),this.addBillboard(184,152,`RESIDENTIAL`,`Calm roads`)}addMarket(){for(let e=0;e<13;e+=1){let t=-142+e*15;if(this.overlapsRoadClearance(t,194,9,8,0,2))continue;let n=new J(new Y(9,5.8,8),e%2?this.materials.buildingC:this.materials.white);n.position.set(t,2.9,194);let r=new J(new Y(9.4,.32,2.2),e%2?this.materials.trim:this.materials.redLight);r.position.set(t,4.1,188.6),this.group.add(n,r),this.registerSolidBox(`market-shop-${t}`,t,194,8.7,7.6,0,6),this.addSign(t,187.2,e%2?`CAFE`:`SHOP`),e%2==0&&this.addMarketStall(t+4,184.2)}this.addMarketGate(-134,182),this.addBillboard(-66,154,`MARKET GATE`,`Dense city route`),[-138,-102,-66,-30,6,42].forEach(e=>this.addStreetLamp(e,166))}addHill(){let e=new J(new Y(190,1.2,128),new X({color:`#bfd1a9`,roughness:.88}));e.position.set(170,.32,214),e.receiveShadow=!0,this.group.add(e),this.addBillboard(170,238,`VIEWPOINT`,`Switchback road`),this.addViewpoint(170,258),[[108,144,.52],[150,194,-.6],[202,230,.58],[170,258,.02]].forEach(([e,t,n])=>{this.addGuardrail(e,t,n),this.addStreetLamp(e-6,t+6)});for(let e=0;e<18;e+=1)this.addTree(96+e%6*28,164+Math.floor(e/6)*38)}addRiverCorridor(){let e=new J(new Y(560,.035,38),this.materials.river);e.position.set(0,.02,-154),this.group.add(e),[-180,-60,80,210].forEach(e=>this.addBillboard(e,-174,`RIVER`,`Bridge corridor`))}addAirport(){this.addAirportArea(),this.addAirportTerminal(-424,-350),this.addAirplane(-360,-286),this.addFence(-456,-442,176,!1),this.addFence(-456,-224,190,!1),this.addBillboard(-422,-370,`HORIZON AIRPORT`,`Terminal - runway - cargo`),[-452,-426,-400,-322,-296].forEach(e=>this.addParkingBay(e,-310,Math.PI*.5))}addIndustrial(){[[292,-334,24,12],[318,-310,30,14],[398,-332,24,12],[300,-258,28,12],[392,-256,34,13]].forEach(([e,t,n,r],i)=>{if(this.overlapsRoadClearance(e,t,n,18,0,2.5))return;let a=new J(new Y(n,r,18),i%2?this.materials.buildingB:this.materials.buildingC);a.position.set(e,r*.5,t),a.castShadow=!0,this.group.add(a),this.registerSolidBox(`warehouse-${e}-${t}`,e,t,n*.96,17.4,0,r+.4);let o=new J(new Y(n*.7,3.2,.18),this.materials.dark);o.position.set(e,2.2,t+9.2),this.group.add(o)});for(let e=0;e<4;e+=1)for(let t=0;t<6;t+=1)this.addContainer(286+t*12,-452+e*8,(e+t)%2?this.materials.containerA:this.materials.containerB);this.addBillboard(360,-260,`INDUSTRIAL DEPOT`,`Cargo routes`),[292,324,356,388,420,452].forEach(e=>this.addStreetLamp(e,-384))}addAirportTerminal(e,t){let n=t-22;if(this.overlapsRoadClearance(e,n,82,18,0,2.5))return;let r=new J(new Y(82,10,18),this.materials.white);r.position.set(e,5,n),r.castShadow=!0;let i=new J(new Y(76,5.2,.2),this.materials.glass);i.position.set(e,5.4,t-12.8);let a=new J(new Y(88,1.2,22),this.materials.trim);a.position.set(e,10.8,n),this.group.add(r,i,a),this.registerSolidBox(`airport-terminal-${e}-${t}`,e,n,80,17.2,0,11.2),[e-32,e,e+32].forEach(e=>this.addBusStop(e,t-8))}addAirplane(e,t){let n=new wn,r=new X({color:`#f8fbff`,roughness:.34,metalness:.14}),i=new X({color:`#caa76a`,roughness:.24,metalness:.42}),a=this.materials.dark,o=this.materials.glass,s=new J(new pi(4.4,4.7,56,24),r);s.rotation.z=Math.PI*.5,s.position.y=8;let c=new J(new Na(4.45,24,12),r);c.scale.x=1.25,c.position.set(30,8,0);let l=new J(new mi(4.5,10,24),r);l.rotation.z=-Math.PI*.5,l.position.set(-33,8,0),n.add(s,c,l);let u=new J(new Y(5.6,1.4,3.8),o);u.position.set(30.5,10.4,0),u.rotation.z=-.18,n.add(u);let d=new Y(34,.55,9);[-1,1].forEach(e=>{let t=new J(d,r);t.position.set(2,7.3,e*10.5),t.rotation.y=e*.18,n.add(t);let i=new J(new pi(1.45,1.45,4.2,16),a);i.rotation.x=Math.PI*.5,i.position.set(5,5.9,e*14.4),n.add(i)});let f=new J(new Y(1.1,10.5,7),r);f.position.set(-27,13.4,0),f.rotation.z=-.16;let p=new J(new Y(13,.45,5.4),r);p.position.set(-27,10,0),n.add(f,p);let m=new J(new Y(48,.22,.32),i);m.position.set(0,8.25,4.72),n.add(m);for(let e=-9;e<=9;e+=1){let t=new J(new Na(.32,8,6),o);t.position.set(e*2.35,9.2,4.46),n.add(t)}[-18,14,24].forEach(e=>{let t=new J(new pi(.22,.22,3.2,8),a);t.position.set(e,4,0);let r=new J(new Pa(.75,.18,8,16),a);r.position.set(e,2.5,0),r.rotation.y=Math.PI*.5,n.add(t,r)}),n.position.set(e,0,t),n.rotation.y=Math.PI*.02,n.scale.setScalar(1.25),this.group.add(n),this.registerSolidBox(`airplane-fuselage-${e}-${t}`,e,t,78,8.8,n.rotation.y,14),this.registerSolidBox(`airplane-left-wing-${e}-${t}`,e+2,t+14.2,38,9.4,n.rotation.y+.18,9),this.registerSolidBox(`airplane-right-wing-${e}-${t}`,e+2,t-14.2,38,9.4,n.rotation.y-.18,9),this.registerSolidBox(`airplane-tail-${e}-${t}`,e-34,t,13.5,9.8,n.rotation.y,18),this.registerSolidBox(`airplane-left-engine-${e}-${t}`,e+5,t+18,5.2,3.4,n.rotation.y,7.5),this.registerSolidBox(`airplane-right-engine-${e}-${t}`,e+5,t-18,5.2,3.4,n.rotation.y,7.5)}addPlaza(e,t){let n=new J(new Y(28,.04,20),this.materials.sidewalk);n.position.set(e,.08,t),this.group.add(n),this.addFountain(e,t)}addParkingBay(e,t,n=0){let r=new J(new Y(11,.02,6),this.materials.sidewalk);r.position.set(e,.09,t),r.rotation.y=n,this.group.add(r);for(let r=-1;r<=1;r+=1){let i=new J(new Y(.08,.02,5.4),this.materials.lane);i.position.set(e+r*3.4,.11,t),i.rotation.y=n,this.group.add(i)}}addParkGate(e,t){[-1,1].forEach(n=>{let r=new J(new Y(1.1,4.4,1.1),this.materials.trim);r.position.set(e+n*6,2.2,t-6),this.group.add(r),this.registerSolidBox(`park-gate-${n}-${e}-${t}`,e+n*6,t-6,1.4,1.4,0,4.8)});let n=this.createTextBoard(`PARK LOOP`,`Scenic drive`,7.8,1.7);n.position.set(e,5.1,t-6),this.group.add(n)}addWalkingPath(e,t,n,r){let i=new J(new Pa(1,.02,8,80),this.materials.sidewalk);i.scale.set(n,1,r),i.rotation.x=Math.PI*.5,i.position.set(e,.1,t),this.group.add(i)}addMarketGate(e,t){[-1,1].forEach(n=>{let r=new J(new Y(1.2,5,1.2),this.materials.trim);r.position.set(e+n*7,2.5,t),this.group.add(r),this.registerSolidBox(`market-gate-${n}-${e}-${t}`,e+n*7,t,1.5,1.5,0,5.4)});let n=this.createTextBoard(`MARKET GATE`,`Shop street`,8,1.7);n.position.set(e,5.5,t),this.group.add(n)}addLocalSquare(e,t){let n=new J(new Y(26,.04,22),this.materials.sidewalk);n.position.set(e,.08,t+20),this.group.add(n),this.addStatue(e,t+20)}addContainer(e,t,n){if(this.overlapsRoadClearance(e,t,10.6,4.8,0,2))return!1;let r=new J(new Y(10,3.2,4.2),n);return r.position.set(e,1.6,t),r.castShadow=!0,this.group.add(r),this.registerSolidBox(`container-${e}-${t}`,e,t,10.6,4.8,0,3.6),!0}addCityHall(e,t){let n=new J(new Y(16,7,10),this.materials.white);n.position.set(e,3.5,t);let r=new J(new Y(18,1.1,11.4),this.materials.trim);r.position.set(e,7.6,t);let i=new wn;for(let n=-2;n<=2;n+=1){let r=new J(new pi(.28,.32,4.4,12),this.materials.trim);r.position.set(e+n*2.2,2.5,t-5.25),i.add(r)}this.group.add(n,r,i),this.registerSolidBox(`city-hall-${e}-${t}`,e,t,18.5,12.2,0,8.4)}addViewpoint(e,t){let n=new J(new pi(7.8,8.5,.55,28),this.materials.sidewalk);n.position.set(e,.76,t),n.receiveShadow=!0;let r=new J(new pi(.35,.5,5.2,16),this.materials.trim);r.position.set(e+1.8,3.2,t-1.5);let i=new J(new Na(.9,16,10),this.materials.glass);i.position.set(e+1.8,6.1,t-1.5),this.group.add(n,r,i),this.registerSolidBox(`viewpoint-deck-${e}-${t}`,e,t,16.5,16.5,0,1.4),this.registerSolidBox(`viewpoint-marker-${e}-${t}`,e+1.8,t-1.5,1.2,1.2,0,6.4);for(let n=0;n<12;n+=1){let r=n/12*Math.PI*2,i=new J(new Y(.14,.72,.14),this.materials.white);i.position.set(e+Math.cos(r)*7.5,1.22,t+Math.sin(r)*7.5),this.group.add(i)}}addRooftopDetail(e,t,n,r){let i=new J(new Y(n*.64,.35,n*.48),this.materials.trim);i.position.set(e,r+.22,t);let a=new J(new pi(.045,.06,2.2,8),this.materials.dark);a.position.set(e+n*.24,r+1.45,t-n*.16),this.group.add(i,a)}addFlowerBed(e,t){let n=new J(new Y(4.4,.18,1.4),this.materials.trim);n.position.set(e,.16,t),this.group.add(n);for(let n=-2;n<=2;n+=1){let r=new J(new Na(.18,8,6),new X({color:n%2?`#f2c66b`:`#ffffff`,roughness:.5}));r.position.set(e+n*.72,.42,t),this.group.add(r)}}addBridgeSupports(e,t){[-18,0,18].forEach(n=>{let r=new J(new Y(2.2,2.4,1.2),this.materials.sidewalk);r.position.set(e+n,.95,t),r.castShadow=!0,this.group.add(r)})}addOverheadSign(e,t,n){let r=new wn;[-1,1].forEach(e=>{let t=new J(new Y(.16,4.8,.16),this.materials.dark);t.position.set(e*17.2,2.4,0),r.add(t)});let i=new J(new Y(35.2,.18,.18),this.materials.dark);i.position.y=4.7,r.add(i);let a=this.createTextBoard(n,`Mini City Drive`,5.4,1.5);a.position.y=4.1,r.add(a),r.position.set(e,0,t-8.8),this.group.add(r)}addAirportArea(){let e=new J(new Y(164,.035,12),this.materials.runway);e.position.set(-360,.07,-252),e.receiveShadow=!0,this.group.add(e);for(let e=-7;e<=7;e+=1)if(e%2==0){let t=new J(new Y(5,.025,.5),this.materials.lane);t.position.set(-360+e*9,.11,-252),this.group.add(t)}[-450,-420,-390].forEach(e=>{if(this.overlapsRoadClearance(e,-454,24,18,0,2.2))return;let t=new J(new Y(24,8.2,18),this.materials.buildingB);t.position.set(e,4.1,-454);let n=new J(new pi(9,9,24,16,1,!1,0,Math.PI),this.materials.trim);n.rotation.z=Math.PI*.5,n.position.set(e,8.2,-454),this.group.add(t,n),this.registerSolidBox(`hangar-${e}`,e,-454,23.6,17.4,0,9.2)}),this.addOverheadSign(-360,-404,`AIRPORT`)}addDriveway(e,t){let n=new J(new Y(5,.035,6),this.materials.sidewalk);n.position.set(e,.06,t),this.group.add(n)}addGarden(e,t){let n=new X({color:`#5f9f58`,roughness:.86});for(let r=0;r<3;r+=1){let i=new J(new Na(.62,10,8),n);i.position.set(e+r*1.1,.62,t+r%2*.7),this.group.add(i)}}addMarketStall(e,t){if(this.overlapsRoadClearance(e,t,3.6,1.8,0,1.6))return;let n=new J(new Y(3.2,1,1.4),this.materials.white);n.position.set(e,.5,t);let r=new J(new Y(3.6,.2,1.8),this.materials.trim);r.position.set(e,1.55,t),this.group.add(n,r),this.registerSolidBox(`market-stall-${e}-${t}`,e,t,3.4,1.6,0,1.7,{type:$.SOFT_PASSABLE,response:`soft`})}addGuardrail(e,t,n){let r=new wn,i=new J(new Y(18,.18,.18),this.materials.white);i.position.y=.9,r.add(i);for(let e=-4;e<=4;e+=1){let t=new J(new Y(.16,.9,.16),this.materials.white);t.position.set(e*2,.45,0),r.add(t)}r.position.set(e,.1,t),r.rotation.y=n,this.group.add(r),this.registerSolidBox(`guardrail-${e}-${t}`,e,t,18.2,.42,n,1.4,{type:$.SLIDE_SOLID,response:`slide`})}addBusStop(e,t){let n=new J(new Y(5.6,.28,2.2),this.materials.glass);n.position.set(e,2.8,t);let r=new J(new Y(3.4,.32,.7),this.materials.trim);r.position.set(e,.75,t),[-1,1].forEach(n=>{let r=new J(new Y(.12,2.5,.12),this.materials.dark);r.position.set(e+n*2.45,1.45,t-.8),this.group.add(r)}),this.group.add(n,r)}addStreetLamp(e,t){let n=new J(new pi(.08,.08,4.6,10),this.materials.dark);n.position.set(e,2.3,t);let r=new J(new Na(.32,12,8),new X({color:`#fff6c2`,emissive:`#fff2a8`,emissiveIntensity:.32}));r.position.set(e,4.68,t+.2),this.group.add(n,r)}addBillboard(e,t,n,r){let i=new J(new Y(.18,3.6,.18),this.materials.dark),a=i.clone();i.position.set(e-2.4,1.8,t),a.position.set(e+2.4,1.8,t);let o=this.createTextBoard(n,r,6.8,2.4);o.position.set(e,3.6,t),this.group.add(i,a,o),this.registerSolidBox(`billboard-post-a-${e}-${t}`,e-2.4,t,.5,.5,0,3.8),this.registerSolidBox(`billboard-post-b-${e}-${t}`,e+2.4,t,.5,.5,0,3.8)}addSign(e,t,n){let r=this.createTextBoard(n,``,3.8,1.1);r.position.set(e,4.6,t),this.group.add(r)}createTextBoard(e,t,n,r){let i=`${e}:${t}`;if(!this.textures.has(i)){let n=document.createElement(`canvas`);n.width=512,n.height=192;let r=n.getContext(`2d`);r.fillStyle=`#fff8ea`,r.fillRect(0,0,n.width,n.height),r.strokeStyle=`#caa76a`,r.lineWidth=10,r.strokeRect(5,5,n.width-10,n.height-10),r.fillStyle=`#202938`,r.font=`700 54px Segoe UI, sans-serif`,r.textAlign=`center`,r.fillText(e,n.width/2,82),t&&(r.fillStyle=`#7b6a45`,r.font=`600 28px Segoe UI, sans-serif`,r.fillText(t,n.width/2,128)),this.textures.set(i,new ci(n))}let a=new Rr({map:this.textures.get(i)});return new J(new Ma(n,r),a)}addLandmarks(){this.landmarks.forEach(e=>{let t=new J(new Pa(e.radius*.52,.09,8,44),new Rr({color:`#f1c764`,transparent:!0,opacity:.55}));t.rotation.x=Math.PI*.5,t.position.set(e.position[0],.13,e.position[1]),this.group.add(t)})}addCollectibles(){ku.forEach((e,t)=>{let n=this.effectsManager.createCoinMesh(),r=e.position,i=this.getSurfaceInfo(new W(r[0],0,r[1]),null,{preferElevated:!0}).surfaceHeight??0;n.userData.baseY=i+1.15,n.position.set(r[0],n.userData.baseY,r[1]),n.userData.id=e.id??`coin-${t}`,n.userData.value=e.value??8,n.userData.xp=e.xp??1,n.userData.type=e.type??`cityCoin`,n.userData.oneTime=!!e.oneTime,n.userData.type!==`cityCoin`&&(n.scale.setScalar(1.28),n.material=n.material.clone(),n.material.color.set(n.userData.type===`hiddenWheel`?`#ffffff`:`#f3c65f`)),this.collectibles.push(n),this.group.add(n)})}addParkedCars(){[[-31,-50,Math.PI*.5,0],[31,50,-Math.PI*.5,1],[-62,75,0,5],[-2,94,Math.PI,2],[72,22,Math.PI*.5,4],[120,45,-Math.PI*.5,3],[-118,-77,Math.PI*.5,1],[118,-99,-Math.PI*.5,0],[-414,-324,Math.PI*.5,2],[-362,-324,Math.PI*.5,4],[-390,-404,0,5],[320,-370,-Math.PI*.5,2],[390,-370,-Math.PI*.5,4],[424,-290,Math.PI,1],[178,126,Math.PI*.5,0],[218,118,-Math.PI*.5,3],[258,82,Math.PI,2],[-130,182,Math.PI*.5,5],[-72,214,-Math.PI*.5,0],[-28,206,Math.PI,1],[-174,38,0,1],[-210,92,Math.PI,2],[-246,54,Math.PI*.5,4],[172,250,Math.PI*.25,3],[198,284,Math.PI*.9,5]].forEach(([e,t,n,r])=>{let i=this.vehicleFactory.createCarMesh(cu[r],{preview:!1});i.position.set(e,0,t),i.rotation.y=n,i.scale.setScalar(.82),i.traverse(e=>{e.isMesh&&(e.castShadow=!0,e.receiveShadow=!0)}),this.group.add(i);let a=cu[r].visual;this.registerSolidBox(`parked-car-${e}-${t}`,e,t,a.width*.72,a.length*.8,n,a.height+a.rideHeight+.35,{type:$.HARD_SOLID,metadata:{parkedCar:!0}})})}update(e){this.collectibles.forEach((t,n)=>{!t.visible&&t.userData.respawnAt&&performance.now()>=t.userData.respawnAt&&(t.visible=!0,t.userData.respawnAt=0),t.visible&&(t.rotation.y+=e*2.6,t.position.y=t.userData.baseY+Math.sin(performance.now()*.003+n)*.16)})}checkCollectibles(e,t,n,r){this.collectibles.forEach(i=>{if(i.visible&&e.distanceTo(i.position)<2){let e=!1;if(e=i.userData.type===`hiddenWheel`||i.userData.type===`landmarkToken`?t.collectHiddenToken(i.userData.id,i.userData.value,i.userData.xp):t.collectCoin(i.userData.id,i.userData.value,i.userData.xp,i.userData.oneTime),e){i.visible=!1,!i.userData.oneTime&&i.userData.type===`cityCoin`&&(i.userData.respawnAt=performance.now()+45e3),n.play(`coin`,.9);let e=i.userData.type===`cityCoin`?`city coins`:`discovery token`;r(`+${i.userData.value} ${e}`)}}})}restoreCollected(e){this.collectibles.forEach(t=>{let n=e.data.discoveries.hiddenTokens[t.userData.id],r=e.data.collectedCoins[t.userData.id];t.visible=!(t.userData.oneTime&&(n||r))})}checkLandmarks(e,t,n,r){this.landmarks.forEach(i=>{Ru([e.x,e.z],i.position)<=i.radius&&t.discoverLandmark(i.id,i.reward,i.xp??45)&&(n.play(`checkpoint`,.8),r(`${i.name} discovered +${i.reward}`))})}checkDistricts(e,t,n,r){let i=this.getZoneAt(e);i.id!==this.currentZoneId&&(this.currentZoneId=i.id,r(i.name),t.discoverDistrict(i.id,i.reward??12,i.xp??24)&&(n.play(`checkpoint`,.55),r(`${i.name} mapped +${i.reward}`)))}getPathSurfaceMatch(e,t=null,n={}){let r=!!n.preferElevated,i=t?this.roadPaths.find(e=>t===e.id||String(t).startsWith(`${e.id}-`)):null;if(i){let t=this.projectPointToPath(i,e,2.8);if(t)return t}let a=null;for(let t of this.roadPaths){if(t===i)continue;let n=this.projectPointToPath(t,e,1.65);n&&(!r&&!i&&n.surfaceHeight>2.2||(!a||(t.priority??0)>(a.path.priority??0)||n.lateralDistance<a.lateralDistance)&&(a=n))}return a}projectPointToPath(e,t,n=1.5){let r=null;for(let i of e.segments){let a=i.b.x-i.a.x,o=i.b.z-i.a.z,s=a*a+o*o;if(s<.01)continue;let c=((t.x-i.a.x)*a+(t.z-i.a.z)*o)/s,l=n/Math.max(1,i.length);if(c<-l||c>1+l)continue;let u=Et.clamp(c,0,1),d=i.a.x+a*u,f=i.a.z+o*u,p=Math.hypot(t.x-d,t.z-f);if(p>e.width*.5+n)continue;let m=Et.lerp(i.a.y,i.b.y,u);(!r||p<r.lateralDistance)&&(r={path:e,segment:i,t:u,surfaceHeight:m,lateralDistance:p,heading:i.heading,slope:i.slope,nearest:new W(d,m,f)})}return r}getSurfaceInfo(e,t=null,n={}){let r=!!n.preferElevated,i=this.getPathSurfaceMatch(e,t,n),a=this.getZoneAt(e);if(i)return{offRoad:!1,zoneName:Su.find(e=>e.id===i.path.zone)?.name??a.name,speedFactor:xu.highwaySpeedFactor,gripFactor:1,accelerationFactor:1,surfaceHeight:i.surfaceHeight,surfaceId:i.path.id,surfaceType:i.path.type,elevated:i.surfaceHeight>2.2,pathId:i.path.id,surfaceHeading:i.heading,surfaceSlope:i.slope};let o=null,s=t?this.elevatedRoutes.find(e=>e.id===t):null;if(s){let t=this.getRouteLocal(s,e,1.8);t.inside&&(o={route:s,surfaceHeight:this.getRouteHeightAtT(s,t.t)})}for(let t of this.elevatedRoutes){if(t===s&&o)continue;let n=this.getRouteLocal(t,e);if(!n.inside)continue;let i=this.getRouteHeightAtT(t,n.t);!r&&!s&&i>2.2||(!o||(t.priority??0)>(o.route.priority??0)||i>o.surfaceHeight)&&(o={route:t,surfaceHeight:i})}if(o)return{offRoad:!1,zoneName:Su.find(e=>e.id===o.route.zone)?.name??a.name,speedFactor:xu.highwaySpeedFactor,gripFactor:1,accelerationFactor:1,surfaceHeight:o.surfaceHeight,surfaceId:o.route.id,surfaceType:o.route.kind,elevated:!0};let c=null;for(let t of this.roadSegments)if(Vu(e,new W(t.center[0],0,t.center[1]),new W(t.size[0],0,t.size[1]),t.rotation)){c=t;break}return c?{offRoad:!1,zoneName:Su.find(e=>e.id===c.zone)?.name??a.name,speedFactor:c.roadClass===`highway`||c.roadClass===`bridge`||c.zone===`highway`?xu.highwaySpeedFactor:c.roadClass===`market`?.92:1,gripFactor:1,accelerationFactor:1,surfaceHeight:c.elevation??0,surfaceId:c.id,surfaceType:c.roadClass??`road`,elevated:!1}:{offRoad:!0,zoneName:a.name,speedFactor:1,gripFactor:1,accelerationFactor:1,surfaceHeight:0,surfaceId:a.id,surfaceType:`terrain`,elevated:!1}}getZoneAt(e){let t=Su[0],n=1/0;for(let r of Su){if(Math.abs(e.x-r.center[0])<=r.size[0]*.5&&Math.abs(e.z-r.center[1])<=r.size[1]*.5)return r;let i=Math.hypot(e.x-r.center[0],e.z-r.center[1]);i<n&&(t=r,n=i)}return t}},$u=new Map,ed=(e,t)=>{let n=`${e}:${JSON.stringify(t)}`;return $u.has(n)||$u.set(n,new X({roughness:.62,metalness:.08,depthTest:!1,depthWrite:!1,...t})),$u.get(n)},td=(e,t)=>{let n=`${e}:${JSON.stringify(t)}`;return $u.has(n)||$u.set(n,new Rr({depthTest:!1,depthWrite:!1,...t})),$u.get(n)},nd=class{constructor(e,t,n){this.scene=e,this.camera=t,this.saveManager=n,this.root=new wn,this.root.name=`Active Procedural Cockpit`,this.root.visible=!1,this.root.renderOrder=1e3,this.scene.add(this.root),this.carId=null,this.config=null,this.rig=null,this.wheel=null,this.gaugeTexture=null,this.gaugeCanvas=null,this.gaugeContext=null,this.lastGaugeSpeed=-1,this.gaugeTimer=0,this.motion={x:0,y:-.04,z:0,pitch:0,roll:0},this.interiorLift=-.04,this.lastForwardSpeed=0,this.accelVisual=0,this.culledVehicle=null,this.cullActive=!1}setCar(e){if(!e||this.carId===e.id)return;this.disposeRig(),this.carId=e.id,this.config=Gu(e.id);let t=this.buildCockpit(e,this.config);this.rig=t.group,this.wheel=t.wheel,this.gaugeCanvas=t.gaugeCanvas,this.gaugeContext=t.gaugeContext,this.gaugeTexture=t.gaugeTexture,this.root.add(this.rig),this.drawGauges(0,0,!1)}update(e,t,n,r){if(!t?.config){this.setVisible(!1);return}this.setCar(t.config);let i=r===`cockpit`;this.setVisible(i),this.syncVehicleCull(t.mesh,i),!(!i||!this.rig)&&(this.syncRootToCamera(),this.updateMotion(e,n),this.updateWheel(e,t,n),this.updateGauges(e,n),this.updateMirrorVisibility())}updatePreview(e,t){this.setCar(t),this.setVisible(!0),this.syncRootToCamera();let n=Math.sin(performance.now()*.0016)*.32,r=42+Math.sin(performance.now()*.001)*18;this.wheel&&(this.wheel.rotation.z=Fu(this.wheel.rotation.z,-n*this.config.wheel.maxTurn,7,e)),this.rig.position.set(0,this.interiorLift,0),this.rig.rotation.set(0,0,0),this.gaugeTimer-=e,this.gaugeTimer<=0&&(this.drawGauges(r,Math.abs(n),!1),this.gaugeTimer=.09),this.updateMirrorVisibility()}setVisible(e){this.root.visible=e}syncRootToCamera(){this.root.position.copy(this.camera.position),this.root.quaternion.copy(this.camera.quaternion)}syncVehicleCull(e,t){this.culledVehicle&&this.culledVehicle!==e&&(this.applyCull(this.culledVehicle,!1),this.culledVehicle=null,this.cullActive=!1),e&&(this.culledVehicle!==e||this.cullActive!==t)&&(this.applyCull(e,t),this.culledVehicle=e,this.cullActive=t)}applyCull(e,t){e.traverse(e=>{e.userData?.firstPersonCull&&(e.visible=!t)})}updateMotion(e,t){let n=Uu.motionLevels[this.saveManager.settings.cockpitMotion]??1,r=this.config.motion,i=t?.speedRatio??0,a=t?.steeringVisual??0,o=t?.inputThrottle??0,s=+!!t?.braking,c=t?.collisionIntensity??0,l=t?.forwardSpeed??0,u=e>0?(l-this.lastForwardSpeed)/e:0;this.lastForwardSpeed=l;let d=Mu(u/22,-1,1),f=o*.42-s*.75;this.accelVisual=Fu(this.accelVisual,Mu(d+f,-1,1),7.5,e);let p=((t?.offRoad?Math.sin(performance.now()*.035)*r.vibration*i:0)+c*.012)*n,m=this.accelVisual*r.push*2.2*n,h=this.accelVisual*r.pitch*1.9*n,g={x:-a*r.lean*.7*n,y:this.interiorLift+p,z:-m,pitch:-h+c*.015*n,roll:-a*r.lean*n};this.motion.x=Fu(this.motion.x,g.x,8,e),this.motion.y=Fu(this.motion.y,g.y,10,e),this.motion.z=Fu(this.motion.z,g.z,8,e),this.motion.pitch=Fu(this.motion.pitch,g.pitch,7,e),this.motion.roll=Fu(this.motion.roll,g.roll,7,e),this.rig.position.set(this.motion.x,this.motion.y,this.motion.z),this.rig.rotation.set(this.motion.pitch,0,this.motion.roll)}updateWheel(e,t,n){if(!this.wheel)return;let r=n?.steeringVisual??t.steerVisual??0,i=n?.collisionIntensity??0,a=Math.sin(performance.now()*.042)*i*.03;this.wheel.rotation.z=Fu(this.wheel.rotation.z,-r*this.config.wheel.maxTurn+a,11,e)}updateGauges(e,t){this.gaugeTimer-=e;let n=t?.speedKmh??0;this.gaugeTimer>0&&Math.abs(n-this.lastGaugeSpeed)<2||(this.drawGauges(n,t?.speedRatio??0,t?.boosting??!1),this.gaugeTimer=.075)}updateMirrorVisibility(){if(!this.rig)return;let e=this.saveManager.settings.mirrorRendering!==`off`;this.rig.traverse(t=>{t.userData?.cockpitMirror&&(t.visible=e)})}drawGauges(e,t,n){if(!this.gaugeContext)return;let r=this.gaugeContext,i=this.gaugeCanvas,a=this.config,o=Mu(Number(this.saveManager.settings.dashboardBrightness??.9),.35,1.2),s=a.dashboard.accent;this.lastGaugeSpeed=e,r.clearRect(0,0,i.width,i.height),r.fillStyle=`#0c1219`,r.fillRect(0,0,i.width,i.height),r.globalAlpha=.14*o,r.fillStyle=s,r.fillRect(0,0,i.width,i.height),r.globalAlpha=1,r.strokeStyle=s,r.lineWidth=4,r.strokeRect(8,8,i.width-16,i.height-16);let c=a.dashboard.display.includes(`analog`)||a.dashboard.display.includes(`round`)?`SPEED`:`KM/H`;if(r.fillStyle=a.materials.display,r.font=`900 48px system-ui, sans-serif`,r.textAlign=`center`,r.fillText(String(Math.round(e)).padStart(3,`0`),i.width*.5,64),r.font=`800 15px system-ui, sans-serif`,r.fillText(c,i.width*.5,86),a.dashboard.display.includes(`analog`)||a.dashboard.display.includes(`round`)){let e=i.width*.22;r.strokeStyle=a.materials.display,r.lineWidth=3,r.beginPath(),r.arc(e,72,34,Math.PI*.72,Math.PI*2.28),r.stroke();let n=Math.PI*.72+Mu(t,0,1)*Math.PI*1.56;r.beginPath(),r.moveTo(e,72),r.lineTo(e+Math.cos(n)*27,72+Math.sin(n)*27),r.strokeStyle=s,r.stroke()}else r.fillStyle=`rgba(255,255,255,0.18)`,r.fillRect(30,102,i.width-60,8),r.fillStyle=n?`#fff7b8`:s,r.fillRect(30,102,(i.width-60)*Mu(t,0,1),8);this.gaugeTexture.needsUpdate=!0}buildCockpit(e,t){let n=new wn;n.name=`${e.name} Cockpit Rig`,n.renderOrder=1e3;let r=this.createMaterials(t);this.addDashboard(n,t,r);let i=this.addSteeringWheel(n,t,r),a=this.addGaugeDisplay(n,t);return this.addWindshield(n,t,r),this.addConsole(n,t,r),this.addSidePanels(n,t,r),this.addSeatHints(n,t,r),this.addMirrorImpressions(n,t,r),this.addCarSpecificAccents(n,e.id,t,r),{group:n,wheel:i,gaugeCanvas:a.canvas,gaugeContext:a.context,gaugeTexture:a.texture}}createMaterials(e){return{dash:ed(`cockpit-dash-${this.carId}`,{color:e.materials.dash}),lower:ed(`cockpit-lower-${this.carId}`,{color:e.materials.lower}),trim:ed(`cockpit-trim-${this.carId}`,{color:e.materials.trim,roughness:.32,metalness:this.carId===`classic`?.62:.28}),frame:ed(`cockpit-frame-${this.carId}`,{color:e.materials.frame}),seat:ed(`cockpit-seat-${this.carId}`,{color:e.materials.seat}),glass:td(`cockpit-glass-${this.carId}`,{color:`#dff8ff`,transparent:!0,opacity:e.windshield.tint})}}addDashboard(e,t,n){let r=new J(new Y(t.dashboard.width,t.dashboard.height,.36),n.dash);r.position.set(0,t.dashboard.y,t.dashboard.z),r.renderOrder=1e3,e.add(r);let i=new J(new Y(t.dashboard.width*.94,.055,.48),n.lower);i.position.set(0,t.dashboard.y+t.dashboard.height*.46,t.dashboard.z-.03),i.rotation.x=-.08,i.renderOrder=1001,e.add(i);let a=new J(new Y(t.dashboard.width*.82,.035,.035),n.trim);a.position.set(0,t.dashboard.y+.08,t.dashboard.z+.205),a.renderOrder=1002,e.add(a)}addSteeringWheel(e,t,n){let r=new wn;r.position.set(t.wheel.x,t.wheel.y,t.wheel.z),r.renderOrder=1004;let i=new J(new Pa(t.wheel.radius,t.wheel.tube,10,42),n.frame);i.renderOrder=1004,r.add(i);for(let e=0;e<t.wheel.spokes;e+=1){let i=new J(new Y(t.wheel.radius*.92,.026,.026),n.trim);i.rotation.z=e/t.wheel.spokes*Math.PI*2,i.renderOrder=1005,r.add(i)}let a=new J(new pi(t.wheel.radius*.24,t.wheel.radius*.24,.045,18),n.trim);return a.rotation.x=Math.PI*.5,a.renderOrder=1006,r.add(a),e.add(r),r}addGaugeDisplay(e,t){let n=document.createElement(`canvas`);n.width=256,n.height=128;let r=n.getContext(`2d`),i=new ci(n),a=new Rr({map:i,transparent:!0,depthTest:!1,depthWrite:!1}),o=new J(new Ma(t.dashboard.display===`digital-strip`?.86:.72,t.dashboard.display===`digital-strip`?.22:.34),a);return o.position.set(t.wheel.x+.36,t.dashboard.y+.1,t.dashboard.z+.205),o.renderOrder=1007,e.add(o),{canvas:n,context:r,texture:i}}addWindshield(e,t,n){let r=t.windshield,i=new J(new Ma(r.width*.86,r.height*.78),n.glass);i.position.set(0,r.y,r.z),i.renderOrder=998,e.add(i),[-1,1].forEach(t=>{let i=new J(new Y(r.pillarWidth,r.height,.05),n.frame);i.position.set(t*r.width*.48,r.y,r.z+.02),i.rotation.z=t*.16,i.renderOrder=1002,e.add(i)});let a=new J(new Y(r.width,r.pillarWidth*1.2,.06),n.frame);a.position.set(0,r.y+r.height*.5,r.z+.02),a.renderOrder=1002,e.add(a)}addConsole(e,t,n){let r=new J(new Y(.34,.3,.36),n.lower);r.position.set(.24,t.dashboard.y-.08,t.dashboard.z+.03),r.rotation.x=-.18,r.renderOrder=1003,e.add(r);let i=new J(new Ma(.24,.13),td(`cockpit-console-screen-${this.carId}`,{color:t.materials.display,transparent:!0,opacity:.82}));i.position.set(.24,t.dashboard.y+.03,t.dashboard.z+.22),i.renderOrder=1008,e.add(i)}addSidePanels(e,t,n){[-1,1].forEach(r=>{let i=new J(new Y(.08,.34,.72),n.lower);i.position.set(r*t.windshield.width*.53,t.dashboard.y-.1,-.74),i.rotation.y=r*.16,i.renderOrder=1e3,e.add(i)})}addSeatHints(e,t,n){let r=new J(new Y(1.55,.18,.42),n.seat);r.position.set(0,-.78,-.18),r.renderOrder=999,e.add(r)}addMirrorImpressions(e,t,n){let r=new J(new Y(.42,.12,.035),n.frame);r.position.set(0,t.windshield.y+t.windshield.height*.35,t.windshield.z+.12),r.renderOrder=1005,r.userData.cockpitMirror=!0,e.add(r),[-1,1].forEach(r=>{let i=new J(new Y(.19,.1,.04),n.frame);i.position.set(r*t.windshield.width*.58,t.dashboard.y+.04,t.windshield.z+.05),i.rotation.y=r*.32,i.renderOrder=1004,i.userData.cockpitMirror=!0,e.add(i)})}addCarSpecificAccents(e,t,n,r){if(t===`offroad-jeep`&&[-1,1].forEach(t=>{let n=new J(new pi(.025,.025,1.1,10),r.frame);n.position.set(t*.74,.18,-.36),n.rotation.z=.2*t,n.renderOrder=1003,e.add(n)}),t===`classic`&&[-.22,.22].forEach(t=>{let i=new J(new Pa(.11,.01,8,24),r.trim);i.position.set(t,n.dashboard.y+.12,n.dashboard.z+.215),i.renderOrder=1008,e.add(i)}),t===`supercar`){let t=new J(new Y(1.42,.035,.035),r.trim);t.position.set(.05,n.dashboard.y+.17,n.dashboard.z+.22),t.renderOrder=1008,e.add(t)}}disposeRig(){this.rig&&(this.root.remove(this.rig),this.rig.traverse(e=>{e.geometry?.dispose?.(),e.material?.map===this.gaugeTexture&&e.material.dispose?.()})),this.rig=null,this.wheel=null,this.gaugeCanvas=null,this.gaugeContext=null,this.gaugeTexture?.dispose?.(),this.gaugeTexture=null}dispose(){this.culledVehicle&&this.applyCull(this.culledVehicle,!1),this.disposeRig(),this.scene.remove(this.root)}},rd=class{constructor(e){this.scene=e,this.effects=[],this.coinGeometry=new Pa(.65,.1,8,22),this.puffGeometry=new Na(.28,8,6),this.materials={coin:new X({color:`#f3c65f`,emissive:`#b88720`,emissiveIntensity:.4,metalness:.6,roughness:.28}),smoke:new Rr({color:`#d7d8d2`,transparent:!0,opacity:.42,depthWrite:!1}),boost:new Rr({color:`#67d9ff`,transparent:!0,opacity:.5,depthWrite:!1}),dust:new Rr({color:`#c8b98a`,transparent:!0,opacity:.34,depthWrite:!1}),spark:new Rr({color:`#ffd36b`,transparent:!0,opacity:.82,depthWrite:!1}),skid:new Rr({color:`#111820`,transparent:!0,opacity:.28,depthWrite:!1})}}createCoinMesh(){let e=new J(this.coinGeometry,this.materials.coin);return e.castShadow=!0,e.userData.baseY=1.15,e}spawnPuff(e,t={}){let n=t.boost?this.materials.boost.clone():this.materials.smoke.clone();t.color&&n.color.set(t.color);let r=new J(this.puffGeometry,n);r.position.copy(e),r.scale.setScalar(t.size??1),this.scene.add(r),this.effects.push({mesh:r,material:n,age:0,life:t.life??.7,velocity:new W((Math.random()-.5)*.5,.45+Math.random()*.25,(Math.random()-.5)*.5)})}spawnDust(e){let t=new J(this.puffGeometry,this.materials.dust.clone());t.position.copy(e),t.scale.setScalar(.72),this.scene.add(t),this.effects.push({mesh:t,material:t.material,age:0,life:.46,velocity:new W((Math.random()-.5)*.8,.35,(Math.random()-.5)*.8)})}spawnSparks(e){for(let t=0;t<5;t+=1){let t=new J(new Y(.08,.08,.42),this.materials.spark.clone());t.position.copy(e),t.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),this.scene.add(t),this.effects.push({mesh:t,material:t.material,age:0,life:.28,velocity:new W((Math.random()-.5)*3,Math.random()*1.7,(Math.random()-.5)*3)})}}spawnSkid(e,t){let n=new J(new Y(.26,.012,1.4),this.materials.skid.clone());n.position.copy(e),n.position.y=.025,n.rotation.y=t,this.scene.add(n),this.effects.push({mesh:n,material:n.material,age:0,life:5.5,velocity:new W})}update(e){for(let t=this.effects.length-1;t>=0;--t){let n=this.effects[t];n.age+=e,n.mesh.position.addScaledVector(n.velocity,e);let r=n.age/n.life;n.mesh.scale.multiplyScalar(1+e*.8),n.material.opacity=Math.max(0,(1-r)*.42),n.age>=n.life&&(this.scene.remove(n.mesh),n.material.dispose(),this.effects.splice(t,1))}}},id=[{id:`morning-traffic`,name:`Morning Traffic Flow`,description:`Downtown and Market traffic feel busier for a short cruise.`,duration:110,rewardCoins:30,rewardXp:45},{id:`park-cruise`,name:`Park Cruise Bonus`,description:`Smooth Park Loop driving earns a gentle XP bonus.`,duration:120,rewardCoins:35,rewardXp:55},{id:`highway-speed`,name:`Expressway Speed Window`,description:`Clean high-speed highway ring driving gives extra mastery.`,duration:90,rewardCoins:40,rewardXp:65},{id:`market-rush`,name:`Market Delivery Rush`,description:`Delivery rewards get a local bonus while the rush is active.`,duration:120,rewardCoins:35,rewardXp:50},{id:`hill-view`,name:`Hill View Challenge`,description:`Reach the viewpoint road cleanly for a scenic reward.`,duration:110,rewardCoins:45,rewardXp:70},{id:`airport-cruise`,name:`Airport Arrival Flow`,description:`Smooth driving around the terminal and service roads earns a local bonus.`,duration:120,rewardCoins:45,rewardXp:70},{id:`industrial-shift`,name:`Industrial Logistics Shift`,description:`Cruise the depot roads cleanly while cargo traffic is active.`,duration:120,rewardCoins:45,rewardXp:68},{id:`clean-streak`,name:`Clean Driving Streak`,description:`Drive without collisions and bank a clean-skill bonus.`,duration:100,rewardCoins:45,rewardXp:70}],ad=[{id:`reach-park-fountain`,label:`Reach the Grand Park Fountain`,target:[-190,66],coins:28,xp:38,masteryXp:50},{id:`reach-airport`,label:`Discover Horizon Airport Terminal`,target:[-360,-350],coins:45,xp:70,masteryXp:80},{id:`cross-bridge`,label:`Cross the Expressway Bridge`,target:[0,-172],coins:38,xp:56,masteryXp:70},{id:`reach-industrial`,label:`Reach Industrial Depot`,target:[360,-330],coins:38,xp:58,masteryXp:70},{id:`clean-900`,label:`Drive 900m without a crash`,cleanDistance:900,coins:55,xp:75,masteryXp:95},{id:`highway-170`,label:`Hit 170 km/h on the Expressway`,zone:`Highway Ring / Expressway System`,speedKmh:170,coins:45,xp:65,masteryXp:80},{id:`collect-10`,label:`Collect 10 city coins`,coinCount:10,coins:40,xp:55,masteryXp:70},{id:`drift-5`,label:`Drift for 5 seconds`,driftSeconds:5,coins:35,xp:50,masteryXp:70}],od=class{constructor(e,t,n={}){this.saveManager=e,this.masteryManager=t,this.callbacks=n,this.eventIndex=0,this.activeEvent=id[0],this.eventTimer=this.activeEvent.duration,this.eventProgress={distance:0,cleanDistance:0,speedTime:0,claimed:!1},this.taskIndex=0,this.activeTask=ad[0],this.taskProgress={cleanDistance:0,coinStart:e.data.stats.totalCoinsCollected,driftSeconds:0}}update(e,t,n,r,i){return r===`freeDrive`?(this.eventTimer-=e,this.eventTimer<=0&&this.rotateEvent(),this.updateEventProgress(e,t,n,i),this.updateTask(e,t,n,i),this.getHudData()):this.getHudData()}rotateEvent(){this.eventIndex=(this.eventIndex+1)%id.length,this.activeEvent=id[this.eventIndex],this.eventTimer=this.activeEvent.duration,this.eventProgress={distance:0,cleanDistance:0,speedTime:0,claimed:!1},this.callbacks.onEvent?.(this.activeEvent)}updateEventProgress(e,t,n,r){if(this.eventProgress.claimed)return;let i=t.collisionIntensity<.08;this.eventProgress.distance+=t.distanceTravelled,this.eventProgress.cleanDistance=i?this.eventProgress.cleanDistance+t.distanceTravelled:0,this.eventProgress.speedTime=t.speedKmh>120&&i?this.eventProgress.speedTime+e:Math.max(0,this.eventProgress.speedTime-e);let a=this.activeEvent.id,o=t.zoneName,s=Ru([n.position.x,n.position.z],[170,258])<16;(a===`morning-traffic`&&[`Downtown Core`,`Market Street`].includes(o)&&this.eventProgress.distance>280||a===`park-cruise`&&o===`Park Loop`&&this.eventProgress.cleanDistance>240||a===`highway-speed`&&o===`Highway Ring / Expressway System`&&this.eventProgress.speedTime>6||a===`market-rush`&&o===`Market Street`&&this.eventProgress.cleanDistance>160||a===`hill-view`&&s||a===`airport-cruise`&&o===`Airport Zone`&&this.eventProgress.cleanDistance>220||a===`industrial-shift`&&o===`Industrial / Logistics Zone`&&this.eventProgress.cleanDistance>220||a===`clean-streak`&&this.eventProgress.cleanDistance>420)&&(this.eventProgress.claimed=!0,this.saveManager.completeCityEvent(a),this.saveManager.addCoins(this.activeEvent.rewardCoins),this.saveManager.addXP(this.activeEvent.rewardXp),this.masteryManager.addXp(r,55,`cityEvent`),this.callbacks.onTaskComplete?.({label:this.activeEvent.name,coins:this.activeEvent.rewardCoins}))}updateTask(e,t,n,r){if(!this.activeTask||this.saveManager.data.freeDriveTasks.completed[this.activeTask.id]){this.nextTask();return}let i=this.activeTask,a=!1;i.target&&(a=Ru([n.position.x,n.position.z],i.target)<9),i.cleanDistance&&(t.collisionIntensity>.1?this.taskProgress.cleanDistance=0:this.taskProgress.cleanDistance+=t.distanceTravelled,a=this.taskProgress.cleanDistance>=i.cleanDistance),i.speedKmh&&(a=t.zoneName===i.zone&&t.speedKmh>=i.speedKmh),i.coinCount&&(a=this.saveManager.data.stats.totalCoinsCollected-this.taskProgress.coinStart>=i.coinCount),i.driftSeconds&&(this.taskProgress.driftSeconds=t.drifting?this.taskProgress.driftSeconds+e:Math.max(0,this.taskProgress.driftSeconds-e*.5),a=this.taskProgress.driftSeconds>=i.driftSeconds),a&&(this.saveManager.completeFreeDriveTask(i.id),this.saveManager.addCoins(i.coins),this.saveManager.addXP(i.xp),this.masteryManager.addXp(r,i.masteryXp,`freeDriveTask`),this.callbacks.onTaskComplete?.(i),this.nextTask())}nextTask(){this.taskIndex=(this.taskIndex+1)%ad.length,this.activeTask=ad[this.taskIndex],this.taskProgress={cleanDistance:0,coinStart:this.saveManager.data.stats.totalCoinsCollected,driftSeconds:0}}getHudData(){return{event:this.activeEvent,eventTime:Math.max(0,this.eventTimer),task:this.activeTask}}},sd=[{id:`city-driver`,name:`City Driver Path`,description:`Relaxed local driving, deliveries, taxi comfort, parking, and city discovery.`,missions:[{id:`career-first-city-ride`,title:`First City Ride`,missionId:`downtown-dash`,required:null,rewardCoins:80,rewardXp:100},{id:`career-parkside-delivery`,title:`Parkside Delivery`,missionId:`standard-parcel`,required:`career-first-city-ride`,rewardCoins:100,rewardXp:120},{id:`career-smooth-taxi`,title:`Smooth Taxi Pickup`,missionId:`residential-taxi`,required:`career-parkside-delivery`,rewardCoins:115,rewardXp:135},{id:`career-market-parking`,title:`Market Parking Test`,missionId:`tight-market-parking`,required:`career-smooth-taxi`,rewardCoins:130,rewardXp:150}]},{id:`pro-driver`,name:`Pro Driver Path`,description:`Skill routes, drift control, clean speed, and hill handling.`,missions:[{id:`career-downtown-dash`,title:`Downtown Dash`,missionId:`downtown-dash`,required:null,rewardCoins:90,rewardXp:115},{id:`career-park-drift`,title:`Park Drift Trial`,missionId:`park-loop-drift`,required:`career-downtown-dash`,rewardCoins:120,rewardXp:145},{id:`career-highway-speed`,title:`Highway Speed Run`,missionId:`highway-blast`,required:`career-park-drift`,rewardCoins:140,rewardXp:160},{id:`career-hill-view`,title:`Hill View Sprint`,missionId:`hill-climb-sprint`,required:`career-highway-speed`,rewardCoins:160,rewardXp:180}]}],cd=Object.fromEntries(sd.flatMap(e=>e.missions.map(t=>[t.id,{...t,pathId:e.id}]))),ld=class{constructor(e,t={}){this.saveManager=e,this.callbacks=t}getPaths(){return sd.map(e=>({...e,missions:e.missions.map(e=>this.getMissionState(e.id))}))}getMissionState(e){let t=cd[e],n=vu(t?.missionId),r=this.saveManager.data.career.completed[e]??null,i=!t?.required||!!this.saveManager.data.career.completed[t.required];return{...t,config:n,completed:r,unlocked:i}}complete(e,t){let n=cd[e];if(!n||!t?.success)return null;let r=this.saveManager.completeCareerMission(e,t),i=[];return r&&(this.saveManager.addCoins(n.rewardCoins),this.saveManager.addXP(n.rewardXp),sd.forEach(t=>{t.missions.forEach(t=>{t.required===e&&i.push(t.title)})}),this.callbacks.onCareerComplete?.(n,i)),{careerMission:n,coins:r?n.rewardCoins:0,xp:r?n.rewardXp:0,unlocked:i}}},ud=[{id:`stock`,name:`Factory Paint`,color:null,unlockLevel:`rookie`},{id:`pearl`,name:`Pearl White`,color:`#f8f3ea`,unlockLevel:`rookie`},{id:`sunburst`,name:`Sunburst Yellow`,color:`#f4d35e`,unlockLevel:`rookie`},{id:`canyon-red`,name:`Canyon Red`,color:`#d94c45`,unlockLevel:`city`},{id:`bay-blue`,name:`Bay Blue`,color:`#3f88c5`,unlockLevel:`city`},{id:`horizon-teal`,name:`Horizon Teal`,color:`#1abc9c`,unlockLevel:`skilled`},{id:`royal-violet`,name:`Royal Violet`,color:`#5f4bb6`,unlockLevel:`pro`}],dd=[{id:`stock`,name:`Factory Accent`,color:null,unlockLevel:`rookie`},{id:`classic-gold`,name:`Classic Gold`,color:`#caa76a`,unlockLevel:`rookie`},{id:`graphite`,name:`Graphite`,color:`#2f3640`,unlockLevel:`city`},{id:`cream`,name:`Cream Stripe`,color:`#fff7cf`,unlockLevel:`city`},{id:`mint`,name:`Mint Detail`,color:`#7fd8be`,unlockLevel:`skilled`}],fd=[{id:`stock`,name:`Factory Wheels`,unlockLevel:`rookie`},{id:`alloy`,name:`Bright Alloy`,unlockLevel:`city`},{id:`sport`,name:`Sport Split-Spoke`,unlockLevel:`skilled`},{id:`offroad`,name:`Rugged Tire`,unlockLevel:`skilled`},{id:`classic`,name:`Chrome Classic`,unlockLevel:`pro`}],pd=[{id:`clean-blue`,name:`Clean Blue`,color:`#67d9ff`,unlockLevel:`rookie`},{id:`sun-gold`,name:`Sun Gold`,color:`#f3c65f`,unlockLevel:`city`},{id:`soft-mint`,name:`Soft Mint`,color:`#6ee7b7`,unlockLevel:`skilled`}],md=[{id:`stock`,name:`Factory Glass`,opacity:.72,unlockLevel:`rookie`},{id:`light`,name:`Light Blue Tint`,opacity:.64,unlockLevel:`city`},{id:`premium`,name:`Premium Smoke Tint`,opacity:.52,unlockLevel:`pro`}],hd={paint:`stock`,accent:`stock`,wheels:`stock`,boostTrail:`clean-blue`,tint:`stock`,plate:`MCD-02`},gd={hatchback:`Best for first drives, parking, and calm route learning.`,"sports-coupe":`Best for drift zones and fast city time trials.`,suv:`Best for taxi comfort, stable delivery runs, and safe cruising.`,supercar:`Best for Highway Blast and S medal attempts.`,"offroad-jeep":`Best for Park Loop shortcuts and rough grass paths.`,classic:`Best for relaxed cruising, smooth taxi rides, and style runs.`},_d=(e,t)=>e.find(e=>e.id===t)??e[0],vd=[{id:`rookie`,name:`Rookie Driver`,minXp:0,nextReward:`City coin starter bonus`},{id:`city`,name:`City Driver`,minXp:320,nextReward:`Warm paint palette and clean boost trail`},{id:`skilled`,name:`Skilled Driver`,minXp:820,nextReward:`Sport accent colors and alloy wheel style`},{id:`pro`,name:`Pro Driver`,minXp:1550,nextReward:`Premium tint and Horizon stripe decals`},{id:`horizon`,name:`Horizon Driver`,minXp:2600,nextReward:`All Phase 4 local cosmetics unlocked`}],yd={coin:1,landmark:45,district:24,hiddenToken:80,missionComplete:120,timeTrialMedal:110,driftScore:.04,cleanDrivingChunk:8,achievement:60},bd=e=>{let t=vd[0];for(let n of vd)e>=n.minXp&&(t=n);let n=vd.findIndex(e=>e.id===t.id),r=vd[n+1]??null;return{...t,index:n,next:r,progress:r?Math.min(1,(e-t.minXp)/(r.minXp-t.minXp)):1}},xd=e=>Math.max(0,vd.findIndex(t=>t.id===e)),Sd=class{constructor(e){this.saveManager=e}isUnlocked(e){return xd(this.saveManager.data.license.levelId)>=xd(e.unlockLevel)}getOptions(){return{paints:ud,accents:dd,wheels:fd,boostTrails:pd,tints:md}}getCarCustomization(e){return this.saveManager.getCustomization(e)}apply(e,t){let n={...this.getCarCustomization(e),...t};return this.saveManager.setCustomization(e,n),n}reset(e){return this.saveManager.resetCustomization(e),{...hd}}resolveVisualColors(e,t=this.getCarCustomization(e.id)){let n=_d(ud,t.paint),r=_d(dd,t.accent),i=_d(pd,t.boostTrail),a=_d(md,t.tint);return{body:n.color??e.colors.body,accent:r.color??e.colors.accent,boostTrail:i.color,tintOpacity:a.opacity}}},Cd=[{title:`Choose Your Car`,copy:`Every Phase 4 car keeps its own handling role. Pick a relaxed cruiser, a drift car, or a fast route specialist.`},{title:`Explore The Districts`,copy:`Drive through named districts, discover landmarks, and fill the City Passport for local coins and license XP.`},{title:`Try Bite-Size Missions`,copy:`Time Trials, Drift Zones, Taxi Rides, Delivery Runs, and Parking Challenges all save best local results.`},{title:`Grow Your License`,copy:`Clean driving, missions, medals, landmarks, and achievements level your local Driving License.`}],wd=[{id:`acceleration`,label:`Acceleration`,stat:`acceleration`,physicsKey:`acceleration`,step:.055},{id:`topSpeed`,label:`Top Speed`,stat:`speed`,physicsKey:`maxSpeed`,step:.045},{id:`braking`,label:`Braking`,stat:`braking`,physicsKey:`braking`,step:.055},{id:`handling`,label:`Handling`,stat:`handling`,physicsKey:`steerRate`,step:.04},{id:`driftGrip`,label:`Drift Grip`,stat:`drift`,physicsKey:`driftGrip`,step:-.045},{id:`offRoadGrip`,label:`Off-Road`,stat:`offRoad`,physicsKey:`offRoadGrip`,step:.045},{id:`stability`,label:`Stability`,stat:`stability`,physicsKey:`grip`,step:.035}],Td={hatchback:{acceleration:4,topSpeed:3,braking:4,handling:5,driftGrip:3,offRoadGrip:3,stability:5},"sports-coupe":{acceleration:5,topSpeed:5,braking:3,handling:4,driftGrip:5,offRoadGrip:2,stability:3},suv:{acceleration:3,topSpeed:3,braking:5,handling:3,driftGrip:2,offRoadGrip:4,stability:5},supercar:{acceleration:5,topSpeed:6,braking:4,handling:4,driftGrip:4,offRoadGrip:1,stability:3},"offroad-jeep":{acceleration:3,topSpeed:2,braking:4,handling:3,driftGrip:3,offRoadGrip:6,stability:5},classic:{acceleration:3,topSpeed:3,braking:3,handling:3,driftGrip:4,offRoadGrip:2,stability:5}},Ed=()=>Object.fromEntries(wd.map(e=>[e.id,0])),Dd=e=>80+e*55,Od=[[`speed`,`Speed`],[`acceleration`,`Acceleration`],[`handling`,`Handling`],[`braking`,`Braking`],[`drift`,`Drift`],[`offRoad`,`Off-Road`],[`stability`,`Stability`]],kd={timeTrial:`Time Trials`,drift:`Drift Zones`,taxi:`Taxi Rides`,delivery:`Deliveries`,parking:`Parking`},Ad=class{constructor(e,t,n,r,i,a,o,s){this.root=e,this.vehicleFactory=t,this.saveManager=n,this.customizationManager=r,this.tuningManager=i,this.masteryManager=a,this.careerManager=o,this.callbacks=s,this.selectedId=n.data.selectedCar,this.infoPanel=`passport`,this.previewMode=`exterior`,this.previewCar=null,this.previewScene=new Nn,this.previewScene.background=new q(`#eaf7ff`),this.previewCamera=new Co(45,1,.1,120),this.previewCamera.position.set(6.6,3.8,8.4),this.previewCamera.lookAt(0,1,0),this.previewRoot=new wn,this.previewScene.add(this.previewRoot),this.cockpitPreview=new nd(this.previewScene,this.previewCamera,this.saveManager),this.createPreviewLighting(),this.createShowroom(),this.buildDom(),this.rebuild()}createPreviewLighting(){let e=new uo(`#ffffff`,`#d6b96d`,1.25);this.previewScene.add(e);let t=new Eo(`#fff0d2`,2.6);t.position.set(-5,9,7),t.castShadow=!0,this.previewScene.add(t);let n=new Eo(`#e8f7ff`,1.1);n.position.set(6,5,-6),this.previewScene.add(n)}createShowroom(){let e=new J(new fi(9.2,64),new X({color:`#f6efe2`,roughness:.45,metalness:.05}));e.rotation.x=-Math.PI*.5,e.receiveShadow=!0,this.previewScene.add(e);let t=new J(new Pa(4.8,.045,8,90),new Rr({color:`#caa76a`,transparent:!0,opacity:.72}));t.rotation.x=Math.PI*.5,t.position.y=.035,this.previewScene.add(t)}buildDom(){this.el=document.createElement(`section`),this.el.className=`garage`,this.el.innerHTML=`
      <aside class="garage__left">
        <p class="eyebrow">Phase 5 / v0.5 - Local only</p>
        <h1>Mini City Drive</h1>
        <p class="garage__copy">Choose a procedural car, then explore the larger city, highway ring, airport, bridges, and dense local districts.</p>
        <div class="garage__brand">GameHub powered by MH Horizon</div>
        <div class="car-list" data-car-list></div>
      </aside>
      <main class="garage__center" aria-label="3D car preview">
        <div></div>
        <div class="garage__brand">WASD drive - Space drift - Shift boost - C camera - V cockpit</div>
      </main>
      <aside class="garage__right">
        <div class="car-detail" data-car-detail></div>
      </aside>
    `,this.root.appendChild(this.el),this.listEl=this.el.querySelector(`[data-car-list]`),this.detailEl=this.el.querySelector(`[data-car-detail]`)}rebuild(){this.renderCarList(),this.renderDetails(),this.rebuildPreview()}renderCarList(){this.listEl.innerHTML=``,cu.forEach(e=>{let t=document.createElement(`button`);t.className=`car-choice${e.id===this.selectedId?` is-selected`:``}`,t.type=`button`,t.innerHTML=`
        <span class="car-choice__swatch" style="background:${e.colors.body}"></span>
        <span>
          <span class="car-choice__name">${e.name}</span>
          <span class="car-choice__meta">${gd[e.id]??e.description}</span>
        </span>
        <span class="car-choice__state">${e.unlockText}</span>
      `,t.addEventListener(`click`,()=>{this.selectedId=e.id,this.saveManager.setSelectedCar(e.id),this.callbacks.onAudioClick(),this.rebuild()}),this.listEl.appendChild(t)})}renderDetails(){let e=lu(this.selectedId),t=this.tuningManager.getEffectiveConfig(e),n=this.masteryManager.getMastery(e.id),r=bd(this.saveManager.data.license.xp);this.detailEl.innerHTML=`
      <p class="eyebrow">Selected car - ${r.name} - ${n.level.name}</p>
      <h2>${e.name}</h2>
      <p>${e.description}</p>
      <p class="garage__copy">${gd[e.id]??`Best for clean city driving.`}</p>
      ${this.renderPreviewControls(e)}
      <div class="license-strip">
        <span>${r.name}</span>
        <span class="stat-track"><span class="stat-fill" style="width:${r.progress*100}%"></span></span>
        <strong>${this.saveManager.data.license.xp} XP</strong>
      </div>
      <div class="stat-list">
        ${Od.map(([e,n])=>`
          <div class="stat-row">
            <span>${n}</span>
            <span class="stat-track"><span class="stat-fill" style="width:${t.stats[e]}%"></span></span>
            <span>${t.stats[e]}</span>
          </div>
        `).join(``)}
      </div>
      <div class="license-strip">
        <span>Mastery</span>
        <span class="stat-track"><span class="stat-fill" style="width:${n.level.progress*100}%"></span></span>
        <strong>${Math.round(n.xp)} XP</strong>
      </div>
      ${this.renderCustomization(e)}
      <div class="garage__actions">
        <button class="primary-button" type="button" data-start-free>Start Free Drive</button>
        <button class="secondary-button" type="button" data-test-drive>Test Drive</button>
        ${this.renderMissionButtons()}
        ${this.renderInfoTabs()}
      </div>
      <div class="garage-info-panel">${this.renderInfoPanel()}</div>
    `,this.bindDetailEvents()}bindDetailEvents(){this.detailEl.querySelector(`[data-start-free]`).addEventListener(`click`,()=>{this.callbacks.onStart(`freeDrive`,this.selectedId)}),this.detailEl.querySelector(`[data-test-drive]`).addEventListener(`click`,()=>{this.callbacks.onTestDrive?.(this.selectedId)}),this.detailEl.querySelectorAll(`[data-preview-mode]`).forEach(e=>{e.addEventListener(`click`,()=>{this.previewMode=e.dataset.previewMode,this.callbacks.onAudioClick(),this.renderDetails(),this.rebuildPreview()})}),this.detailEl.querySelectorAll(`[data-mission]`).forEach(e=>{e.addEventListener(`click`,()=>this.callbacks.onStart(e.dataset.mission,this.selectedId))}),this.detailEl.querySelectorAll(`[data-customize]`).forEach(e=>{e.addEventListener(`change`,()=>{this.customizationManager.apply(this.selectedId,{[e.dataset.customize]:e.value}),this.callbacks.onAudioClick(),this.rebuild()})}),this.detailEl.querySelector(`[data-reset-customization]`)?.addEventListener(`click`,()=>{this.customizationManager.reset(this.selectedId),this.callbacks.onAudioClick(),this.rebuild()}),this.detailEl.querySelectorAll(`[data-info]`).forEach(e=>{e.addEventListener(`click`,()=>{this.infoPanel=e.dataset.info,this.renderDetails()})}),this.detailEl.querySelectorAll(`[data-tune]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=this.tuningManager.upgrade(this.selectedId,e.dataset.tune);this.callbacks.onAudioClick(),this.renderDetails(),t.ok||this.callbacks.onFeedback?.(t.reason)})}),this.detailEl.querySelector(`[data-reset-tuning]`)?.addEventListener(`click`,()=>{this.tuningManager.reset(this.selectedId),this.callbacks.onAudioClick(),this.renderDetails()}),this.detailEl.querySelectorAll(`[data-career]`).forEach(e=>{e.addEventListener(`click`,()=>{e.disabled||this.callbacks.onStartCareer(e.dataset.career,e.dataset.mission,this.selectedId)})})}renderMissionButtons(){return Object.entries(kd).map(([e,t])=>`
      <p class="garage-section-title">${t}</p>
      <div class="mission-buttons">
        ${hu.filter(t=>t.type===e).map(e=>`
          <button class="secondary-button mission-button" type="button" data-mission="${e.id}">
            <span>${e.name}</span><span>${e.recommendedCar}</span>
          </button>
        `).join(``)}
      </div>
    `).join(``)}renderPreviewControls(e){let t=Gu(e.id);return`
      <div class="preview-panel">
        <div class="preview-toggle" role="group" aria-label="Preview mode">
          <button class="mini-button ${this.previewMode===`exterior`?`is-selected`:``}" type="button" data-preview-mode="exterior">Exterior</button>
          <button class="mini-button ${this.previewMode===`interior`?`is-selected`:``}" type="button" data-preview-mode="interior">Interior</button>
        </div>
        <div class="cockpit-feature-list">
          <span>${t.visibility}</span>
          <span>${t.dashboardStyle}</span>
          <span>${t.drivingFeel}</span>
        </div>
      </div>
    `}renderCustomization(e){let t=this.customizationManager.getOptions(),n=this.customizationManager.getCarCustomization(e.id),r=(e,t,r)=>`
      <label class="custom-row">
        <span>${e}</span>
        <select data-customize="${t}">
          ${r.map(e=>{let r=!this.customizationManager.isUnlocked(e);return`<option value="${e.id}" ${n[t]===e.id?`selected`:``} ${r?`disabled`:``}>${e.name}${r?` - ${e.unlockLevel}`:``}</option>`}).join(``)}
        </select>
      </label>
    `;return`
      <div class="custom-panel">
        <p class="garage-section-title">Customization</p>
        ${r(`Paint`,`paint`,t.paints)}
        ${r(`Accent`,`accent`,t.accents)}
        ${r(`Wheels`,`wheels`,t.wheels)}
        ${r(`Boost`,`boostTrail`,t.boostTrails)}
        ${r(`Glass`,`tint`,t.tints)}
        <button class="secondary-button mini-button" type="button" data-reset-customization>Reset customization</button>
      </div>
    `}renderInfoTabs(){return`
      <div class="info-tabs">
        <button class="mini-button" type="button" data-info="career">Career</button>
        <button class="mini-button" type="button" data-info="world">World</button>
        <button class="mini-button" type="button" data-info="mastery">Mastery</button>
        <button class="mini-button" type="button" data-info="tuning">Tuning</button>
        <button class="mini-button" type="button" data-info="passport">Passport</button>
        <button class="mini-button" type="button" data-info="stats">Stats</button>
        <button class="mini-button" type="button" data-info="achievements">Achievements</button>
        <button class="mini-button" type="button" data-info="help">Help</button>
      </div>
    `}renderInfoPanel(){let e=this.saveManager.data,t=lu(this.selectedId);if(this.infoPanel===`career`)return this.renderCareerPanel();if(this.infoPanel===`world`)return this.renderWorldPanel();if(this.infoPanel===`mastery`)return this.renderMasteryPanel(t);if(this.infoPanel===`tuning`)return this.renderTuningPanel(t);if(this.infoPanel===`stats`)return`
        <p class="garage-section-title">Local Stats</p>
        <div class="mini-grid">
          <span>Distance <strong>${Math.round(e.stats.totalDistance)} m</strong></span>
          <span>Coins <strong>${e.totalCoins}</strong></span>
          <span>Missions <strong>${e.stats.missionsCompleted}</strong></span>
          <span>Crashes <strong>${e.stats.totalCrashes}</strong></span>
          <span>Drift <strong>${Math.round(e.stats.totalDriftScore)}</strong></span>
          <span>License <strong>${bd(e.license.xp).name}</strong></span>
        </div>
      `;if(this.infoPanel===`achievements`)return`
        <p class="garage-section-title">Achievements - ${Object.keys(e.achievements).length}</p>
        <div class="passport-list">
          ${[`first-drive`,`first-delivery`,`first-drift`,`first-parking`,`landmark-hunter`,`clean-driver`,`highway-racer`,`smooth-taxi`,`gold-time-trial`,`horizon-driver`].map(t=>`<span class="${e.achievements[t]?`is-unlocked`:``}">${e.achievements[t]?`Unlocked`:`Locked`} - ${t.replaceAll(`-`,` `)}</span>`).join(``)}
        </div>
      `;if(this.infoPanel===`help`)return`
        <p class="garage-section-title">Quick Help</p>
        <div class="passport-list">
          ${Cd.map(e=>`<span><strong>${e.title}</strong><br>${e.copy}</span>`).join(``)}
        </div>
      `;let n=[`central-tower`,`park-fountain`,`highway-bridge`,`market-gate`,`residential-square`,`hill-viewpoint`,`city-hall`,`airport-terminal`,`giant-airplane`,`industrial-depot`,`river-corridor`];return`
      <p class="garage-section-title">City Passport - ${Object.keys(e.discoveries.landmarks).length}/${n.length}</p>
      <div class="passport-list">
        ${n.map(t=>`<span class="${e.discoveries.landmarks[t]?`is-unlocked`:``}">${e.discoveries.landmarks[t]?`Discovered`:`Locked`} - ${t.replaceAll(`-`,` `)}</span>`).join(``)}
      </div>
    `}renderMasteryPanel(e){let t=this.masteryManager.getMastery(e.id),n=Object.entries(t.bestMissions??{}).slice(0,4);return`
      <p class="garage-section-title">Car Mastery - ${t.level.name}</p>
      <div class="license-strip">
        <span>${t.level.name}</span>
        <span class="stat-track"><span class="stat-fill" style="width:${t.level.progress*100}%"></span></span>
        <strong>${Math.round(t.xp)} XP</strong>
      </div>
      <div class="passport-list">
        <span>Next reward: <strong>${t.level.next?.nextReward??`Mastered local badge`}</strong></span>
        <span>Next level: <strong>${t.level.next?.name??`Complete`}</strong></span>
        ${n.length?n.map(([e,t])=>`<span>${e.replaceAll(`-`,` `)} <strong>${t}</strong></span>`).join(``):`<span>No car-specific mission bests yet.</span>`}
      </div>
    `}renderWorldPanel(){return`
      <p class="garage-section-title">Expanded Phase 4 World</p>
      <div class="passport-list">
        <span><strong>Highway Ring</strong><br>Long multi-lane routes, bridges, ramps, and speed trials.</span>
        <span><strong>Airport Zone</strong><br>Terminal roads, runway straight, service loop, hangars, and a huge airliner landmark.</span>
        <span><strong>Industrial Depot</strong><br>Warehouses, cargo yards, containers, and heavy delivery routes.</span>
        <span><strong>Bridge Corridor</strong><br>River crossing and elevated expressway sections for longer drives.</span>
        ${Su.map(e=>`<span>${e.name} <strong>${e.reward} coins</strong></span>`).join(``)}
      </div>
    `}renderTuningPanel(e){let t=this.tuningManager.getTuning(e.id);return`
      <p class="garage-section-title">Vehicle Tuning - ${this.saveManager.data.totalCoins} coins</p>
      <div class="tuning-list">
        ${wd.map(n=>{let r=this.tuningManager.getCategoryState(e.id,n.id),i=t[n.id]??0;return`
            <div class="tuning-row">
              <span>${n.label}</span>
              <span class="stat-track"><span class="stat-fill" style="width:${i/Math.max(1,r.max)*100}%"></span></span>
              <strong>${i}/${r.max}</strong>
              <button class="mini-button" type="button" data-tune="${n.id}" ${r.canUpgrade?``:`disabled`}>${r.canUpgrade?`${r.cost}`:`Max`}</button>
            </div>
          `}).join(``)}
      </div>
      <button class="secondary-button mini-button" type="button" data-reset-tuning>Reset tuning</button>
    `}renderCareerPanel(){return`
      <p class="garage-section-title">Career Mode</p>
      <div class="career-list">
        ${this.careerManager.getPaths().map(e=>`
          <div class="career-path">
            <strong>${e.name}</strong>
            <span>${e.description}</span>
            ${e.missions.map(e=>`
              <button class="secondary-button mission-button" type="button" data-career="${e.id}" data-mission="${e.missionId}" ${e.unlocked?``:`disabled`}>
                <span>${e.title}</span>
                <span>${e.completed?e.completed.medal??`Done`:e.unlocked?`Start`:`Locked`}</span>
              </button>
            `).join(``)}
          </div>
        `).join(``)}
      </div>
    `}rebuildPreview(){this.previewCar&&(this.previewRoot.remove(this.previewCar),this.disposeObject(this.previewCar));let e=lu(this.selectedId),t=this.customizationManager.getCarCustomization(e.id),n=this.customizationManager.resolveVisualColors(e,t);this.previewCar=this.vehicleFactory.createCarMesh(e,{preview:!0,customization:{body:n.body,accent:n.accent,tintOpacity:n.tintOpacity,boostTrail:n.boostTrail,wheelStyle:t.wheels}}),this.previewCar.position.y=.02,this.previewRoot.add(this.previewCar),this.previewCar.visible=this.previewMode===`exterior`,this.cockpitPreview.setVisible(this.previewMode===`interior`)}disposeObject(e){e.traverse(e=>{e.isMesh&&e.geometry?.dispose?.()})}show(){this.el.classList.remove(`is-hidden`),this.rebuild()}hide(){this.el.classList.add(`is-hidden`)}update(e,t){this.el.classList.contains(`is-hidden`)||(this.previewCar&&(this.previewCar.rotation.y+=e*.42,this.previewCar.visible=this.previewMode===`exterior`,this.previewCar.userData.wheels?.forEach(t=>{t.tire.rotation.x+=e*.8})),this.previewMode===`interior`?this.cockpitPreview.updatePreview(e,lu(this.selectedId)):this.cockpitPreview.setVisible(!1),this.previewCamera.aspect=t.width/t.height,this.previewCamera.updateProjectionMatrix())}render(e){e.render(this.previewScene,this.previewCamera)}},jd=e=>JSON.parse(JSON.stringify(e)),Md=class{constructor(e,t={}){this.saveManager=e,this.callbacks=t}getTuning(e){return this.saveManager.getCarTuning(e)}getCategoryState(e,t){let n=wd.find(e=>e.id===t),r=this.getTuning(e),i=Td[e]??{},a=r[t]??0,o=i[t]??3;return{category:n,level:a,max:o,cost:Dd(a),canUpgrade:!!n&&a<o}}upgrade(e,t){let n=this.getCategoryState(e,t);if(!n.category)return{ok:!1,reason:`Unknown tuning category`};if(!n.canUpgrade)return{ok:!1,reason:`Tuning cap reached`};if(!this.saveManager.spendCoins(n.cost))return{ok:!1,reason:`Not enough coins`};let r=this.getTuning(e);return r[t]=n.level+1,this.saveManager.setCarTuning(e,r),this.callbacks.onUpgrade?.(e,n.category,r[t]),{ok:!0,level:r[t],cost:n.cost}}reset(e){this.saveManager.setCarTuning(e,Ed())}getEffectiveConfig(e,t={}){let n=jd(e),r=this.getTuning(e.id);return wd.forEach(e=>{let t=r[e.id]??0;if(!t)return;let i=1+e.step*t,a=e.physicsKey;n.physics[a]=Math.max(.1,n.physics[a]*i),n.stats[e.stat]=Math.min(100,Math.round(n.stats[e.stat]+t*3.6))}),t.accelerationMultiplier&&(n.physics.acceleration*=t.accelerationMultiplier),n.tuning=r,n}},Nd=class{constructor(e){this.root=e,this.keys=new Set,this.once=new Set,this.touchState={accelerate:!1,brake:!1,left:!1,right:!1,handbrake:!1,boost:!1},this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),window.addEventListener(`keydown`,this.onKeyDown),window.addEventListener(`keyup`,this.onKeyUp)}onKeyDown(e){let t=this.normalize(e.key);this.keys.has(t)||this.once.add(t),this.keys.add(t),[`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`Space`].includes(t)&&e.preventDefault()}onKeyUp(e){this.keys.delete(this.normalize(e.key))}normalize(e){return e===` `?`Space`:e.length===1?e.toLowerCase():e}consume(e){let t=this.normalize(e),n=this.once.has(t);return this.once.delete(t),n}isDown(...e){return e.some(e=>this.keys.has(this.normalize(e)))}bindTouchButton(e,t){let n=e=>{this.touchState[t]=e};e.addEventListener(`pointerdown`,t=>{t.preventDefault(),e.setPointerCapture?.(t.pointerId),n(!0)}),e.addEventListener(`pointerup`,()=>n(!1)),e.addEventListener(`pointercancel`,()=>n(!1)),e.addEventListener(`lostpointercapture`,()=>n(!1))}getDrivingInput(){let e=this.isDown(`w`,`ArrowUp`)||this.touchState.accelerate,t=this.isDown(`s`,`ArrowDown`)||this.touchState.brake,n=this.isDown(`a`,`ArrowLeft`)||this.touchState.left,r=this.isDown(`d`,`ArrowRight`)||this.touchState.right;return{throttle:+!!e,brake:+!!t,steer:+!!n+(r?-1:0),handbrake:this.isDown(`Space`)||this.touchState.handbrake,boost:this.isDown(`Shift`)||this.touchState.boost}}dispose(){window.removeEventListener(`keydown`,this.onKeyDown),window.removeEventListener(`keyup`,this.onKeyUp)}},Pd=class{constructor(e,t,n,r=null){this.scene=e,this.saveManager=t,this.audioManager=n,this.surfaceResolver=r,this.group=new wn,this.group.name=`Mission Markers`,this.scene.add(this.group),this.active=null,this.pendingResult=null,this.marker=this.createMarker(`#f0c766`),this.secondaryMarker=this.createMarker(`#5ec6ff`),this.zoneMarker=this.createZoneMarker(`#62d28f`),this.group.add(this.marker,this.secondaryMarker,this.zoneMarker),this.hideMarkers()}createMarker(e){let t=new wn,n=new J(new Pa(3.4,.12,10,54),new Rr({color:e,transparent:!0,opacity:.86}));n.rotation.x=Math.PI*.5;let r=new J(new pi(.12,.12,5.4,12),new Rr({color:e,transparent:!0,opacity:.38}));return r.position.y=2.7,t.add(n,r),t.visible=!1,t}createZoneMarker(e){let t=new wn;return t.userData.material=new Rr({color:e,transparent:!0,opacity:.28}),t.visible=!1,t}rebuildZoneMarker(e,t=`#62d28f`){this.zoneMarker.clear(),this.zoneMarker.userData.material=new Rr({color:t,transparent:!0,opacity:.28});let n=new J(new Y(e.size[0],.08,e.size[1]),this.zoneMarker.userData.material);n.position.y=.12,this.zoneMarker.add(n);let r=new X({color:`#f28f38`,roughness:.5});[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([t,n])=>{let i=new J(new mi(.42,1.1,12),r);i.position.set(t*e.size[0]*.55,.55,n*e.size[1]*.55),i.castShadow=!0,this.zoneMarker.add(i)}),this.zoneMarker.position.set(e.center[0],this.getSurfaceHeightForPoint(e.center)+.02,e.center[1]),this.zoneMarker.rotation.y=e.rotation}getSurfaceHeightForPoint(e){return this.surfaceResolver?.getSurfaceInfo?this.surfaceResolver.getSurfaceInfo(new W(e[0],0,e[1]),null,{preferElevated:!0})?.surfaceHeight??0:0}placePointMarker(e,t,n=.12){e.position.set(t[0],this.getSurfaceHeightForPoint(t)+n,t[1])}hideMarkers(){this.marker.visible=!1,this.secondaryMarker.visible=!1,this.zoneMarker.visible=!1}start(e,t={}){if(this.pendingResult=null,e===`freeDrive`)return this.active=null,this.hideMarkers(),null;let n=vu(e)??gu[e]??gu.timeTrial,r=n.timer??(n.medalTimes?.Bronze??75)+25;return this.active={id:n.id,type:n.type,config:n,timer:r,elapsed:0,phase:[`delivery`,`taxi`].includes(n.type)?`pickup`:`running`,checkpointIndex:0,condition:100,comfort:100,collisions:0,hold:0,score:0,driftScore:0,multiplier:1,comboBreak:``,completed:!1,failed:!1,resets:0,context:t,lastCollisionPulse:0,lastMessagePulse:0},this.updateMarkers(),n.start}noteReset(){this.active&&(this.active.resets+=1)}update(e,t,n){if(!this.active)return this.getFreeDriveHud();let r=this.active;if(r.timer-=e,r.elapsed+=e,r.lastCollisionPulse=Math.max(0,r.lastCollisionPulse-e),r.lastMessagePulse=Math.max(0,r.lastMessagePulse-e),n.collisionIntensity>.35&&r.lastCollisionPulse<=0&&(r.collisions+=1,r.lastCollisionPulse=.8,r.type===`delivery`&&(r.condition=Math.max(0,r.condition-r.config.crashDamage)),r.type===`taxi`&&(r.comfort=Math.max(0,r.comfort-r.config.comfortLoss)),r.type===`drift`&&(r.multiplier=1,r.comboBreak=`Combo broken`)),r.type===`timeTrial`&&this.updateTimeTrial(t,r),r.type===`delivery`&&this.updateDelivery(e,t,n,r),r.type===`parking`&&this.updateParking(e,t,r),r.type===`drift`&&this.updateDrift(e,t,n,r),r.type===`taxi`&&this.updateTaxi(e,t,n,r),this.pendingResult){let e=this.pendingResult;return this.pendingResult=null,{result:e}}return r.timer<=0?r.type===`drift`&&r.driftScore>=r.config.targetScore?this.complete(`Target score reached`):this.fail(`Timer ended`):r.type===`delivery`&&r.condition<=0?this.fail(`Package condition reached 0`):r.type===`taxi`&&r.comfort<=0?this.fail(`Passenger comfort reached 0`):(this.pulseMarkers(e),this.getHudData(t.position))}updateTimeTrial(e,t){let n=t.config.checkpoints[t.checkpointIndex];Ru([e.position.x,e.position.z],n)<5.5&&(this.audioManager.play(`checkpoint`,.9),t.checkpointIndex+=1,t.score+=80,t.checkpointIndex>=t.config.checkpoints.length?this.complete(`Route cleared`):this.updateMarkers())}updateDelivery(e,t,n,r){n.offRoad&&n.speed>8&&(r.condition=Math.max(0,r.condition-r.config.roughDamagePerSecond*e));let i=r.phase===`pickup`?r.config.pickup:r.config.destination;Ru([t.position.x,t.position.z],i)<5.8&&(r.phase===`pickup`?(r.phase=`deliver`,this.audioManager.play(`checkpoint`,.9),this.updateMarkers()):this.complete(`Package delivered`))}updateTaxi(e,t,n,r){!n.drifting&&n.collisionIntensity<.05&&n.speed>4&&n.speed<24&&(r.comfort=Math.min(100,r.comfort+e*1.2),r.score+=e*7);let i=r.phase===`pickup`?r.config.pickup:r.config.destination;if(Ru([t.position.x,t.position.z],i)<5.8&&(r.phase===`pickup`?(r.phase=`ride`,this.audioManager.play(`checkpoint`,.9),r.comboBreak=r.config.messages?.[0]??`Passenger picked up`,this.updateMarkers()):this.complete(`Passenger arrived`)),r.phase===`ride`&&r.lastMessagePulse<=0){let e=r.config.messages??[];e.length&&(r.comboBreak=e[Math.floor(Math.random()*e.length)]),r.lastMessagePulse=9}}updateParking(e,t,n){let r=n.config.zone,i=new W(r.center[0],0,r.center[1]),a=new W(r.size[0],0,r.size[1]),o=Vu(t.position,i,a,r.rotation),s=t.velocity.length(),c=s<2.2,l=Math.abs(Iu(t.heading,r.rotation)),u=l<.58;n.accuracy=Mu(100-t.position.distanceTo(i)*9-l*38-s*7,0,100),o&&c&&u?n.hold+=e:n.hold=Math.max(0,n.hold-e*1.6),n.hold>=r.holdTime&&this.complete(`Parked cleanly`)}updateDrift(e,t,n,r){let i=r.config.zone,a=new W(i.center[0],0,i.center[1]),o=new W(i.size[0],0,i.size[1]),s=Vu(t.position,a,o,i.rotation);if(r.insideZone=s,!s){r.multiplier=Math.max(1,r.multiplier-e*.8);return}if(n.drifting){r.multiplier=Mu(r.multiplier+e*.22,1,4);let t=n.driftScore*(1.8+n.speedRatio*2.2)*r.multiplier;r.driftScore+=t,r.score+=t}else r.multiplier=Math.max(1,r.multiplier-e*.35);r.driftScore>=r.config.targetScore&&this.complete(`Drift target cleared`)}complete(e){if(!this.active||this.active.completed)return this.getHudData();let t=this.active;t.completed=!0;let n=this.createResult(!0,e),r=this.saveManager.recordMission(t.id,n.score,n.coinsEarned,{type:t.type,success:!0,xp:n.xpEarned,medal:n.medal,timeSeconds:t.type===`timeTrial`?t.elapsed:void 0,carId:t.context?.carId,bonusObjectives:n.bonusObjectives});return n.isBest=r.isBest,n.levelUp=r.levelUp,this.audioManager.play(`complete`,1),this.hideMarkers(),this.active=null,this.pendingResult=n,{result:n}}fail(e){if(!this.active||this.active.failed)return this.getHudData();let t=this.createResult(!1,e);return this.audioManager.play(`fail`,1),this.hideMarkers(),this.active=null,this.pendingResult=t,{result:t}}createResult(e,t){let n=this.active,r=Math.max(0,n.timer),i=n.type===`timeTrial`&&e?bu(n.config,n.elapsed):null,a=e?n.config.reward*4:90;a+=r*6,a-=n.collisions*55,n.type===`timeTrial`&&(a+=n.checkpointIndex*80+(i===`S`?240:i===`Gold`?180:i===`Silver`?90:40)),n.type===`delivery`&&(a+=n.condition*4),n.type===`taxi`&&(a+=n.comfort*4),n.type===`parking`&&(a+=(n.accuracy??0)*5),n.type===`drift`&&(a+=n.driftScore*.45);let o=this.evaluateBonusObjectives(n,e),s=o.filter(e=>e.complete).length;a+=s*45,a=Math.max(0,Math.round(a));let c=yu(a),l=e?Math.max(15,Math.round(a/18)+s*4):Math.round(a/40),u=this.saveManager.data.bestScores[n.id]??0,d=e?n.config.xp+Math.round(a/30)+s*10:Math.round((n.config.xp??60)*.25);return{missionId:n.id,missionType:n.type,missionName:n.config.name,routeId:n.id,success:e,reason:t,time:Bu(n.elapsed),remaining:Bu(r),timeSeconds:n.elapsed,score:a,rank:c,medal:i,xpEarned:d,coinsEarned:l,bestBefore:u,isBest:a>u,collisions:n.collisions,condition:Math.round(n.condition),comfort:Math.round(n.comfort),driftScore:Math.round(n.driftScore),bonusObjectives:o,masteryXp:0,newUnlocks:[],checkpointProgress:n.type===`timeTrial`?`${n.checkpointIndex}/${n.config.checkpoints.length}`:null}}evaluateBonusObjectives(e,t){let n=[{id:`no-major-crash`,label:`No major crash`,complete:t&&e.collisions===0},{id:`recommended-car`,label:`Use recommended car: ${e.config.recommendedCar??`Any`}`,complete:t&&(!e.config.recommendedCar||e.context?.carName===e.config.recommendedCar||e.context?.shortName===e.config.recommendedCar)},{id:`no-reset`,label:`Complete without reset`,complete:t&&e.resets===0}];return e.type===`timeTrial`&&n.push({id:`target-time`,label:`Finish under ${Bu(e.config.medalTimes?.Gold??e.timer)}`,complete:t&&e.elapsed<=(e.config.medalTimes?.Gold??1/0)}),e.type===`delivery`&&n.push({id:`condition-80`,label:`Keep package above 80%`,complete:t&&e.condition>=80}),e.type===`taxi`&&n.push({id:`comfort-90`,label:`Keep comfort above 90%`,complete:t&&e.comfort>=90}),e.type===`parking`&&n.push({id:`accuracy-95`,label:`Park with 95% accuracy`,complete:t&&(e.accuracy??0)>=95}),e.type===`drift`&&n.push({id:`drift-target-plus`,label:`Beat drift target by 20%`,complete:t&&e.driftScore>=e.config.targetScore*1.2}),n}updateMarkers(){if(this.hideMarkers(),!this.active)return;let e=this.active;if(e.type===`timeTrial`){let t=e.config.checkpoints[e.checkpointIndex];this.marker.visible=!0,this.placePointMarker(this.marker,t)}if(e.type===`delivery`||e.type===`taxi`){let t=e.config.pickup,n=e.config.destination;this.marker.visible=e.phase===`pickup`,this.placePointMarker(this.marker,t),this.secondaryMarker.visible=e.phase!==`pickup`,this.placePointMarker(this.secondaryMarker,n)}e.type===`parking`&&(this.rebuildZoneMarker(e.config.zone,`#62d28f`),this.zoneMarker.visible=!0),e.type===`drift`&&(this.rebuildZoneMarker(e.config.zone,`#f0c766`),this.zoneMarker.visible=!0)}pulseMarkers(e){[this.marker,this.secondaryMarker,this.zoneMarker].forEach(t=>{if(!t.visible)return;let n=1+Math.sin(performance.now()*.005)*.08;t.scale.setScalar(n),t.rotation.y+=e*.35})}getTargetPosition(){if(!this.active)return null;let e=this.active;return e.type===`timeTrial`?e.config.checkpoints[e.checkpointIndex]:e.type===`delivery`||e.type===`taxi`?e.phase===`pickup`?e.config.pickup:e.config.destination:e.type===`parking`||e.type===`drift`?e.config.zone.center:null}getHudData(e=null){if(!this.active)return this.getFreeDriveHud();let t=this.active,n=this.getTargetPosition(),r=e&&n?Math.round(Ru([e.x,e.z],n)):0,i={active:!0,missionType:t.type,mode:t.config.name,objective:t.config.description,timer:Bu(t.timer),distance:r,condition:null,comfort:null,progress:null,accuracy:null,driftScore:null,multiplier:null,combo:t.comboBreak,target:n};if(t.type===`timeTrial`&&(i.progress=`${t.checkpointIndex+1}/${t.config.checkpoints.length}`,i.objective=`Reach checkpoint ${i.progress}`),t.type===`delivery`&&(i.condition=Mu(t.condition,0,100),i.objective=t.phase===`pickup`?`Collect ${t.config.name}`:`Deliver ${t.config.name}`),t.type===`taxi`&&(i.comfort=Mu(t.comfort,0,100),i.objective=t.phase===`pickup`?`Pick up passenger`:`Drive smoothly to destination`),t.type===`parking`){let e=Mu(t.hold/t.config.zone.holdTime,0,1);i.accuracy=t.accuracy??e*100,i.objective=`Stop aligned inside the parking outline`}return t.type===`drift`&&(i.driftScore=Math.round(t.driftScore),i.multiplier=t.multiplier,i.progress=`${Math.round(t.driftScore)}/${t.config.targetScore}`,i.objective=t.insideZone?`Hold angle inside the drift zone`:`Enter the marked drift zone`),i}getFreeDriveHud(){return{active:!1,missionType:`freeDrive`,mode:`Free Drive`,objective:`Explore districts, collect tokens, discover landmarks, career tasks, or Phase 4 routes.`,timer:null,distance:null,condition:null,comfort:null,progress:null,accuracy:null,driftScore:null,multiplier:null,combo:null,target:null}}},Fd=[{id:`first-drive`,name:`First Drive`,description:`Drive your first 500 meters.`,coins:20,xp:45},{id:`first-delivery`,name:`First Delivery`,description:`Complete any delivery run.`,coins:35,xp:70},{id:`first-drift`,name:`First Drift`,description:`Score 500 total drift points.`,coins:30,xp:70},{id:`first-parking`,name:`First Parking`,description:`Complete a parking challenge.`,coins:30,xp:60},{id:`landmark-hunter`,name:`Landmark Hunter`,description:`Discover five landmarks.`,coins:60,xp:110},{id:`clean-driver`,name:`Clean Driver`,description:`Drive 2 km with calm control.`,coins:50,xp:100},{id:`highway-racer`,name:`Highway Racer`,description:`Earn Gold or better on a highway time trial.`,coins:55,xp:110},{id:`perfect-parking`,name:`Perfect Parking`,description:`Finish parking with A rank or better.`,coins:55,xp:110},{id:`smooth-taxi`,name:`Smooth Taxi`,description:`Complete a taxi ride with 80% comfort or higher.`,coins:55,xp:100},{id:`gold-time-trial`,name:`Gold Time Trial`,description:`Earn a Gold medal on any time trial.`,coins:70,xp:130},{id:`horizon-driver`,name:`Horizon Driver`,description:`Reach the Horizon Driver license level.`,coins:100,xp:0}],Id=class{constructor(e,t={}){this.saveManager=e,this.callbacks=t}evaluate(e={}){let t=[],n=this.saveManager.data,r=Object.keys(n.discoveries.landmarks).length,i=Object.values(n.medals),a=e.missionType??e.type,o={"first-drive":n.stats.totalDistance>=500,"first-delivery":n.stats.deliveriesCompleted>=1||a===`delivery`,"first-drift":n.stats.totalDriftScore>=500||a===`drift`,"first-parking":n.stats.parkingCompleted>=1||a===`parking`,"landmark-hunter":r>=5,"clean-driver":n.stats.totalCleanDistance>=2e3,"highway-racer":[`highway-blast`,`bridge-ring-run`,`airport-express-sprint`].includes(e.routeId)&&[`Gold`,`S`].includes(e.medal),"perfect-parking":a===`parking`&&[`A`,`S`].includes(e.rank),"smooth-taxi":a===`taxi`&&(e.comfort??0)>=80,"gold-time-trial":i.includes(`Gold`)||i.includes(`S`)||[`Gold`,`S`].includes(e.medal),"horizon-driver":n.license.levelId===`horizon`};return Fd.forEach(e=>{if(o[e.id]){let n=this.saveManager.unlockAchievement(e.id);n&&(t.push(n.achievement),this.callbacks.onAchievement?.(n.achievement),n.levelUp&&this.callbacks.onLevelUp?.(n.levelUp,e.name))}}),t}},Ld=[{id:`new`,name:`New`,minXp:0,nextReward:`Factory familiarity`},{id:`familiar`,name:`Familiar`,minXp:260,nextReward:`Car-specific plate badge`},{id:`skilled`,name:`Skilled`,minXp:760,nextReward:`Extra tuning cap`},{id:`expert`,name:`Expert`,minXp:1500,nextReward:`Premium rim finish`},{id:`mastered`,name:`Mastered`,minXp:2600,nextReward:`Mastered local badge`}],Rd={distancePerMeter:.035,cleanDistancePerMeter:.02,driftPoint:.025,missionComplete:150,medalS:180,medalGold:130,medalSilver:80,parkingSuccess:90,deliveryTaxiSuccess:100},zd=e=>{let t=Ld[0];for(let n of Ld)e>=n.minXp&&(t=n);let n=Ld.findIndex(e=>e.id===t.id),r=Ld[n+1]??null;return{...t,index:n,next:r,progress:r?Math.min(1,(e-t.minXp)/(r.minXp-t.minXp)):1}},Bd=class{constructor(e,t={}){this.saveManager=e,this.callbacks=t,this.distanceBuffer={}}getMastery(e){let t=this.saveManager.getCarMastery(e);return{...t,level:zd(t.xp)}}awardDriving(e,t){if(!e||!t)return null;let n=t.collisionIntensity<.05,r=t.distanceTravelled*(Rd.distancePerMeter+(n?Rd.cleanDistancePerMeter:0))+t.driftScore*Rd.driftPoint;if(this.distanceBuffer[e]=(this.distanceBuffer[e]??0)+r,this.distanceBuffer[e]<5)return null;let i=this.distanceBuffer[e];return this.distanceBuffer[e]=0,this.addXp(e,i,`driving`)}awardMission(e,t){if(!e||!t?.success)return null;let n=Rd.missionComplete;return t.medal===`S`&&(n+=Rd.medalS),t.medal===`Gold`&&(n+=Rd.medalGold),t.medal===`Silver`&&(n+=Rd.medalSilver),t.missionType===`parking`&&(n+=Rd.parkingSuccess),(t.missionType===`delivery`||t.missionType===`taxi`)&&(n+=Rd.deliveryTaxiSuccess),n+=Math.min(160,Math.round((t.driftScore??0)*.03)),this.addXp(e,n,`mission`)}addXp(e,t,n=`bonus`){let r=this.getMastery(e).level,i=this.saveManager.addCarMasteryXp(e,t),a=zd(i.xp);return r.id!==a.id&&this.callbacks.onLevelUp?.(e,a,n),{amount:Math.round(t),level:a,totalXp:i.xp}}},Vd=class{constructor(e,t={}){this.saveManager=e,this.callbacks=t}getLicense(){return bd(this.saveManager.data.license.xp)}awardXP(e,t=`Driving XP`){let n=this.saveManager.addXP(e);return n&&this.callbacks.onLevelUp?.(n,t),n}awardCleanDistance(e){let t=Math.floor(this.saveManager.data.stats.totalCleanDistance/500),n=`clean-distance-${t}`;return t>0&&!this.saveManager.data.license.levelUpsSeen[n]?(this.saveManager.data.license.levelUpsSeen[n]=!0,this.awardXP(yd.cleanDrivingChunk,`Clean driving`)):null}},Hd=class{constructor(e){this.saveManager=e,this.lastCrashPulse=0}updateDriving(e,t){let n=t.collisionIntensity<.1&&!t.offRoad;return this.saveManager.addDistance(t.distanceTravelled,n),t.driftScore>.1&&this.saveManager.addDriftScore(t.driftScore),this.lastCrashPulse=Math.max(0,this.lastCrashPulse-e),t.collisionIntensity>.55&&this.lastCrashPulse<=0?(this.saveManager.addCrash(),this.lastCrashPulse=1,!0):!1}},Ud=`mini-city-drive:v0.5`,Wd=`mini-city-drive:v0.4`,Gd=`mini-city-drive:v0.3`,Kd=`mini-city-drive:v0.2`,qd=`mini-city-drive:v0.1`,Jd={masterVolume:.72,engineVolume:.72,tireVolume:.62,uiVolume:.7,ambienceVolume:.42,cameraShake:`normal`,trafficDensity:`low`,visualQuality:`medium`,minimap:!0,uiScale:`normal`,touchControls:`auto`,cameraMode:`standard`,cockpitMotion:`normal`,cockpitHud:`minimal`,cockpitFov:`normal`,mirrorRendering:`geometry`,dashboardBrightness:.9,cockpitHintSeen:!1,debugOverlay:!1},Yd=()=>({version:5,totalCoins:0,selectedCar:`hatchback`,license:{xp:0,levelId:`rookie`,levelUpsSeen:{}},completedMissions:{},bestScores:{},bestTimes:{},medals:{},discoveries:{landmarks:{},districts:{},hiddenTokens:{}},discoveredLandmarks:{},collectedCoins:{},achievements:{},customizations:{},carMastery:{},carTuning:{},career:{completed:{},activeCareerMission:null,pathProgress:{}},bonusObjectives:{},cityEvents:{completed:{},lastEventId:null},freeDriveTasks:{completed:{},activeTaskId:null,progress:{}},debugSettings:{overlay:!1},stats:{totalDistance:0,totalCleanDistance:0,totalCrashes:0,totalDriftScore:0,totalCoinsCollected:0,missionsCompleted:0,deliveriesCompleted:0,taxiRidesCompleted:0,parkingCompleted:0,timeTrialsCompleted:0,driftZonesCompleted:0,favoriteCarUse:{},favoriteCar:`hatchback`,highestLicenseLevel:`rookie`},onboardingComplete:!1,settings:Jd}),Xd=e=>JSON.parse(JSON.stringify(e)),Zd=class{constructor(){this.data=this.load()}load(){try{let e=localStorage.getItem(Ud);if(e)return this.mergeDefaults(JSON.parse(e));let t=localStorage.getItem(Wd);if(t){let e=this.migrateV4(JSON.parse(t));return this.data=e,this.persist(),e}let n=localStorage.getItem(Gd);if(n){let e=this.migrateV3(JSON.parse(n));return this.data=e,this.persist(),e}let r=localStorage.getItem(Kd);if(r){let e=this.migrateV2(JSON.parse(r));return this.data=e,this.persist(),e}let i=localStorage.getItem(qd);if(i){let e=this.migrateV1(JSON.parse(i));return this.data=e,this.persist(),e}}catch{return Yd()}return Yd()}migrateV4(e){return this.mergeDefaults({...e,version:5})}migrateV3(e){return this.mergeDefaults({...e,version:5})}migrateV2(e){return this.mergeDefaults({...e,version:5})}migrateV1(e){let t=Yd();return t.totalCoins=Number(e.totalCoins??0),t.selectedCar=e.selectedCar??t.selectedCar,t.completedMissions={...e.completedMissions??{}},t.bestScores={...e.bestScores??{}},t.discoveries.landmarks={...e.discoveredLandmarks??{}},t.discoveredLandmarks={...e.discoveredLandmarks??{}},t.collectedCoins={...e.collectedCoins??{}},t.stats.totalDistance=Number(e.totalDistance??0),t.stats.totalDriftScore=Number(e.totalDriftScore??0),t.settings=this.normalizeSettings(e.settings??{}),this.mergeDefaults(t)}mergeDefaults(e){let t=Yd(),n={...t,...e,license:{...t.license,...e.license??{}},completedMissions:{...t.completedMissions,...e.completedMissions??{}},bestScores:{...t.bestScores,...e.bestScores??{}},bestTimes:{...t.bestTimes,...e.bestTimes??{}},medals:{...t.medals,...e.medals??{}},discoveries:{landmarks:{...t.discoveries.landmarks,...e.discoveries?.landmarks??e.discoveredLandmarks??{}},districts:{...t.discoveries.districts,...e.discoveries?.districts??{}},hiddenTokens:{...t.discoveries.hiddenTokens,...e.discoveries?.hiddenTokens??{}}},discoveredLandmarks:{...t.discoveredLandmarks,...e.discoveredLandmarks??e.discoveries?.landmarks??{}},collectedCoins:{...t.collectedCoins,...e.collectedCoins??{}},achievements:{...t.achievements,...e.achievements??{}},customizations:{...t.customizations,...e.customizations??{}},carMastery:{...t.carMastery,...e.carMastery??{}},carTuning:{...t.carTuning,...e.carTuning??{}},career:{completed:{...t.career.completed,...e.career?.completed??{}},activeCareerMission:e.career?.activeCareerMission??null,pathProgress:{...t.career.pathProgress,...e.career?.pathProgress??{}}},bonusObjectives:{...t.bonusObjectives,...e.bonusObjectives??{}},cityEvents:{completed:{...t.cityEvents.completed,...e.cityEvents?.completed??{}},lastEventId:e.cityEvents?.lastEventId??null},freeDriveTasks:{completed:{...t.freeDriveTasks.completed,...e.freeDriveTasks?.completed??{}},activeTaskId:e.freeDriveTasks?.activeTaskId??null,progress:{...t.freeDriveTasks.progress,...e.freeDriveTasks?.progress??{}}},debugSettings:{...t.debugSettings,...e.debugSettings??{}},stats:{...t.stats,...e.stats??{}},settings:this.normalizeSettings(e.settings??{})};return n.license.levelId=bd(n.license.xp).id,n.version=5,n.stats.favoriteCar=this.getFavoriteCarFromStats(n.stats.favoriteCarUse,n.selectedCar),n}normalizeSettings(e){let t={...Jd,...e};return typeof t.cameraShake==`boolean`&&(t.cameraShake=t.cameraShake?`normal`:`off`),t.radar!==void 0&&t.minimap===void 0&&(t.minimap=!!t.radar),[`off`,`low`,`medium`,`high`].includes(t.trafficDensity)||(t.trafficDensity=`low`),[`off`,`low`,`normal`].includes(t.cameraShake)||(t.cameraShake=`normal`),[`standard`,`far`,`hood`,`cockpit`].includes(t.cameraMode)||(t.cameraMode=`standard`),[`off`,`low`,`normal`].includes(t.cockpitMotion)||(t.cockpitMotion=`normal`),[`minimal`,`normal`].includes(t.cockpitHud)||(t.cockpitHud=`minimal`),[`low`,`normal`,`wide`].includes(t.cockpitFov)||(t.cockpitFov=`normal`),[`off`,`geometry`].includes(t.mirrorRendering)||(t.mirrorRendering=`geometry`),t.dashboardBrightness=Math.min(1.2,Math.max(.35,Number(t.dashboardBrightness??.9))),t.cockpitHintSeen=!!t.cockpitHintSeen,t}getFavoriteCarFromStats(e,t){let n=t,r=-1;return Object.entries(e??{}).forEach(([e,t])=>{t>r&&(n=e,r=t)}),n}persist(){try{localStorage.setItem(Ud,JSON.stringify(this.data))}catch{}}get settings(){return this.data.settings}updateSettings(e){this.data.settings=this.normalizeSettings({...this.data.settings,...e}),this.data.debugSettings.overlay=!!this.data.settings.debugOverlay,this.persist()}setSelectedCar(e){this.data.selectedCar=e,this.data.stats.favoriteCarUse[e]=(this.data.stats.favoriteCarUse[e]??0)+1,this.data.stats.favoriteCar=this.getFavoriteCarFromStats(this.data.stats.favoriteCarUse,e),this.persist()}getCustomization(e){return{...hd,...this.data.customizations[e]??{}}}setCustomization(e,t){this.data.customizations[e]={...this.getCustomization(e),...t},this.persist()}resetCustomization(e){this.data.customizations[e]=Xd(hd),this.persist()}getCarTuning(e){return{...Ed(),...this.data.carTuning[e]??{}}}setCarTuning(e,t){this.data.carTuning[e]={...this.getCarTuning(e),...t},this.persist()}resetCarTuning(e){this.data.carTuning[e]=Ed(),this.persist()}spendCoins(e){let t=Math.max(0,Math.round(e));return this.data.totalCoins<t?!1:(this.data.totalCoins-=t,this.persist(),!0)}addCoins(e){let t=Math.max(0,Math.round(e));return this.data.totalCoins+=t,this.data.stats.totalCoinsCollected+=t,this.persist(),t}addXP(e){let t=Math.max(0,Math.round(e));if(!t)return null;let n=bd(this.data.license.xp);this.data.license.xp+=t;let r=bd(this.data.license.xp);return this.data.license.levelId=r.id,this.data.stats.highestLicenseLevel=r.id,this.persist(),n.id===r.id?null:r}collectCoin(e,t,n=1,r=!1){return r&&this.data.collectedCoins[e]?!1:(r&&(this.data.collectedCoins[e]=!0),this.addCoins(t),this.addXP(n),!0)}collectHiddenToken(e,t,n){return this.data.discoveries.hiddenTokens[e]?!1:(this.data.discoveries.hiddenTokens[e]=!0,this.addCoins(t),this.addXP(n),this.persist(),!0)}discoverDistrict(e,t,n){return this.data.discoveries.districts[e]?!1:(this.data.discoveries.districts[e]=!0,this.addCoins(t),this.addXP(n),this.persist(),!0)}discoverLandmark(e,t,n){return this.data.discoveries.landmarks[e]?!1:(this.data.discoveries.landmarks[e]=!0,this.data.discoveredLandmarks[e]=!0,this.addCoins(t),this.addXP(n),this.persist(),!0)}addDistance(e,t=!0){let n=Math.max(0,e);this.data.stats.totalDistance+=n,this.data.totalDistance=this.data.stats.totalDistance,t&&(this.data.stats.totalCleanDistance+=n),n>.01&&this.persist()}addCrash(){this.data.stats.totalCrashes+=1,this.persist()}addDriftScore(e){let t=Math.max(0,Math.round(e));this.data.stats.totalDriftScore+=t,this.data.totalDriftScore=this.data.stats.totalDriftScore,this.persist()}getCarMastery(e){return{xp:0,levelUpsSeen:{},bestMissions:{},...this.data.carMastery[e]??{}}}addCarMasteryXp(e,t){let n=Math.max(0,Math.round(t));if(!n)return this.getCarMastery(e);let r=this.getCarMastery(e);return r.xp+=n,this.data.carMastery[e]=r,this.persist(),r}recordCarMissionBest(e,t,n){let r=this.getCarMastery(e);r.bestMissions[t]=Math.max(r.bestMissions[t]??0,Math.round(n)),this.data.carMastery[e]=r,this.persist()}recordMission(e,t,n,r={}){let i=Math.round(t),a=this.data.bestScores[e]??0;if(this.data.completedMissions[e]=(this.data.completedMissions[e]??0)+1,this.data.bestScores[e]=Math.max(a,i),this.data.stats.missionsCompleted+=r.success===!1?0:1,r.type===`delivery`&&(this.data.stats.deliveriesCompleted+=1),r.type===`taxi`&&(this.data.stats.taxiRidesCompleted+=1),r.type===`parking`&&(this.data.stats.parkingCompleted+=1),r.type===`timeTrial`&&(this.data.stats.timeTrialsCompleted+=1),r.type===`drift`&&(this.data.stats.driftZonesCompleted+=1),typeof r.timeSeconds==`number`){let t=this.data.bestTimes[e];this.data.bestTimes[e]=t===void 0?r.timeSeconds:Math.min(t,r.timeSeconds)}r.medal&&(this.data.medals[e]=r.medal),r.bonusObjectives&&(this.data.bonusObjectives[e]=r.bonusObjectives),r.carId&&this.recordCarMissionBest(r.carId,e,t),this.addCoins(n);let o=this.addXP(r.xp??0);return this.persist(),{isBest:i>a,levelUp:o}}completeCareerMission(e,t={}){let n=!!this.data.career.completed[e];return this.data.career.completed[e]={completedAt:Date.now(),medal:t.medal??null,score:Math.round(t.score??0)},this.persist(),!n}completeCityEvent(e){this.data.cityEvents.completed[e]=(this.data.cityEvents.completed[e]??0)+1,this.data.cityEvents.lastEventId=e,this.persist()}completeFreeDriveTask(e){this.data.freeDriveTasks.completed[e]=!0,this.persist()}unlockAchievement(e){if(this.data.achievements[e])return null;let t=Fd.find(t=>t.id===e);if(!t)return null;this.data.achievements[e]={unlockedAt:Date.now()},this.addCoins(t.coins);let n=this.addXP(t.xp);return this.persist(),{achievement:t,levelUp:n}}setOnboardingComplete(e=!0){this.data.onboardingComplete=e,this.persist()}resetProgress(){this.data=Yd(),this.persist()}},Qd=class{constructor(e){this.root=e,this.renderer=new su({antialias:!0,alpha:!1,powerPreference:`high-performance`}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6)),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=2,this.renderer.outputColorSpace=Ie,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.05,e.appendChild(this.renderer.domElement),this.scene=new Nn,this.scene.background=new q(`#bfe9ff`),this.scene.fog=new Mn(`#dff4ff`,190,760),this.camera=new Co(62,1,.1,1200),this.camera.position.set(0,12,-18),this.clock=new Uo,this.size={width:1,height:1},this.buildLighting(),this.buildSky(),this.resize()}buildLighting(){let e=new uo(`#e9f8ff`,`#bfa56e`,1.2);this.scene.add(e);let t=new Eo(`#fff0c8`,2.8);t.position.set(-42,78,38),t.castShadow=!0,t.shadow.mapSize.set(2048,2048),t.shadow.camera.left=-330,t.shadow.camera.right=330,t.shadow.camera.top=330,t.shadow.camera.bottom=-330,t.shadow.camera.near=10,t.shadow.camera.far=520,this.scene.add(t);let n=new Eo(`#d8f3ff`,.8);n.position.set(44,38,-32),this.scene.add(n)}buildSky(){let e=new J(new Na(660,32,16),new Rr({color:`#c6ecff`,side:1}));this.scene.add(e);let t=new Rr({color:`#ffffff`,transparent:!0,opacity:.72,depthWrite:!1}),n=new Na(1,12,8);[[-184,54,-240],[44,60,-292],[260,50,82],[-250,58,154],[8,68,284],[190,62,-210]].forEach((e,r)=>{let i=new wn;for(let e=0;e<5;e+=1){let r=new J(n,t);r.position.set(e*2.2,Math.sin(e)*.45,e%2*.7),r.scale.set(3+e*.4,1.1+e%2*.3,1.4),i.add(r)}i.position.set(e[0],e[1],e[2]),i.rotation.y=r*.4,this.scene.add(i)})}resize(){let e=Math.max(1,this.root.clientWidth),t=Math.max(1,this.root.clientHeight);e===this.size.width&&t===this.size.height||(this.size={width:e,height:t},this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}render(e=this.camera,t=this.scene){this.renderer.render(t,e)}},$d=class{constructor(e,t,n,r=null){this.scene=e,this.vehicleFactory=t,this.saveManager=n,this.cityBuilder=r,this.vehicles=[],this.group=new wn,this.group.name=`Traffic`,this.scene.add(this.group)}build(){if(this.clear(),this.saveManager.settings.trafficDensity===`off`)return;let e=this.saveManager.settings.trafficDensity===`high`?26:this.saveManager.settings.trafficDensity===`medium`?18:11,t=[`compact`,`sedan`,`van`,`taxi`,`small-bus`,`delivery-truck`];for(let n=0;n<e;n+=1){let e=Au[n%Au.length],r=cu[(n+1)%cu.length],i=this.vehicleFactory.createCarMesh(r),a=t[n%t.length],o=a===`small-bus`?1.28:a===`delivery-truck`?1.18:a===`van`?1.08:a===`taxi`?.86:.78;i.scale.setScalar(n%5==0?o*1.06:o);let s=this.findSafePointIndex(e,n%e.points.length),c=e.points[s];i.position.set(c[0],this.getSurfaceHeight(c[0],c[1]),c[1]),this.group.add(i),this.vehicles.push({mesh:i,loop:e,pointIndex:s,speed:e.speed*(.8+n%4*.08),type:a,heading:0,cooldown:0,stuckTimer:0,offset:(n%2?-1:1)*(e.zone===`highway`?2.8:1.9)})}}clear(){this.vehicles.forEach(e=>this.group.remove(e.mesh)),this.vehicles=[]}update(e,t){this.vehicles.forEach(n=>{n.cooldown=Math.max(0,n.cooldown-e);let r=n.mesh.position,i=n.loop.points[(n.pointIndex+1)%n.loop.points.length],a=new W(i[0],0,i[1]).clone().sub(r);if(a.y=0,a.length()<2.4){n.pointIndex=(n.pointIndex+1)%n.loop.points.length;return}a.normalize();let o=Math.atan2(a.x,a.z);n.heading=Lu(n.heading,o,5.5,e);let s=new W(Math.cos(n.heading),0,-Math.sin(n.heading)),c=n.speed*this.getDistrictSpeedFactor(n.loop.zone,n.type),l=Ru([t.position.x,t.position.z],[n.mesh.position.x,n.mesh.position.z]),u=Math.abs(t.mesh.position.y-n.mesh.position.y);l<15&&u<3.2&&(c*=.2),c*=this.getTrafficSpacingFactor(n),n.mesh.position.addScaledVector(a,c*e),n.mesh.position.addScaledVector(s,n.offset*e*.08),n.mesh.position.y=this.getSurfaceHeight(n.mesh.position.x,n.mesh.position.z),n.mesh.rotation.y=n.heading,n.mesh.userData.wheels?.forEach(t=>{t.tire.rotation.x+=n.speed*e*2.1}),n.stuckTimer=l<4&&u<3.2||c<.6?n.stuckTimer+e:Math.max(0,n.stuckTimer-e),n.stuckTimer>2.5&&(this.recycleTraffic(n,t.position),n.stuckTimer=0)})}getDistrictSpeedFactor(e,t){return(e===`highway`?1.22:e===`market`?.68:e===`residential`?.78:e===`airport`?.72:e===`industrial`?.64:1)*(t===`small-bus`||t===`delivery-truck`?.72:t===`taxi`?1.02:1)}getTrafficSpacingFactor(e){let t=1;return this.vehicles.forEach(n=>{if(n===e||n.loop!==e.loop)return;let r=Ru([e.mesh.position.x,e.mesh.position.z],[n.mesh.position.x,n.mesh.position.z]);r>.1&&r<10&&(t=Math.min(t,.42))}),t}recycleTraffic(e,t){let n=0;for(;n<e.loop.points.length;){e.pointIndex=(e.pointIndex+1)%e.loop.points.length;let r=e.loop.points[e.pointIndex];if(Ru([t.x,t.z],r)>28){if(!this.isSpawnPointClear(r[0],r[1])){n+=1;continue}e.mesh.position.set(r[0],0,r[1]),e.mesh.position.y=this.getSurfaceHeight(r[0],r[1]);return}n+=1}}getSurfaceHeight(e,t){return this.cityBuilder?this.cityBuilder.getSurfaceInfo(new W(e,0,t),null,{preferElevated:!0}).surfaceHeight??0:0}findSafePointIndex(e,t=0){for(let n=0;n<e.points.length;n+=1){let r=(t+n)%e.points.length,i=e.points[r];if(this.isSpawnPointClear(i[0],i[1]))return r}return t}isSpawnPointClear(e,t){if(!this.cityBuilder?.collisionSystem)return!0;let n=this.cityBuilder.collisionSystem.queryNearby(new U(e,t),9);for(let r of n)if([$.HARD_SOLID,$.SLIDE_SOLID].includes(r.type)){let n=r.center.x-e,i=r.center.y-t;if(Math.hypot(n,i)<Math.max(r.size.x,r.size.y)*.55+4)return!1}return!0}},ef=class{constructor(e,t,n,r){this.root=e,this.inputManager=t,this.saveManager=n,this.callbacks=r,this.toasts=[],this.buildDom(),this.bind(),this.applySettingsToInputs()}buildDom(){this.layer=document.createElement(`div`),this.layer.className=`screen-layer`,this.layer.innerHTML=`
      <section class="hud is-hidden" data-hud>
        <div class="hud-panel hud-top">
          <div class="speedometer">
            <div class="speedometer__dial"><div class="speedometer__needle" data-speed-needle></div></div>
            <div>
              <div class="speedometer__value" data-speed-value>0</div>
              <div class="speedometer__unit">km/h</div>
            </div>
          </div>
          <div class="objective">
            <div class="objective__title" data-objective-title>Free Drive</div>
            <div class="objective__copy" data-objective-copy>Explore the city.</div>
          </div>
          <div class="hud-stats">
            <div class="hud-stat"><span>Car</span><strong data-car-name>Hatchback</strong></div>
            <div class="hud-stat"><span>Coins</span><strong data-coins>0</strong></div>
            <div class="hud-stat"><span>District</span><strong data-zone>Downtown</strong></div>
            <div class="hud-stat"><span>License</span><strong data-license>Rookie</strong></div>
          </div>
        </div>
        <div class="hud-panel mission-meters" data-meters>
          <div class="meter-row" data-timer-row><span>Timer</span><span class="meter-track"><span class="meter-fill" data-timer-fill></span></span><strong data-timer>--</strong></div>
          <div class="meter-row" data-event-row><span>Event</span><span class="meter-track"><span class="meter-fill" data-event-fill></span></span><strong data-event-name>-</strong></div>
          <div class="meter-row" data-task-row><span>Task</span><span class="meter-track"><span class="meter-fill" data-task-fill></span></span><strong data-task-name>-</strong></div>
          <div class="meter-row"><span>License XP</span><span class="meter-track"><span class="meter-fill" data-license-fill></span></span><strong data-license-xp>0</strong></div>
          <div class="meter-row"><span>Boost</span><span class="meter-track"><span class="meter-fill" data-boost-fill></span></span><strong data-boost>100</strong></div>
          <div class="meter-row is-hidden" data-condition-row><span>Package</span><span class="meter-track"><span class="meter-fill" data-condition-fill></span></span><strong data-condition>100</strong></div>
          <div class="meter-row is-hidden" data-comfort-row><span>Comfort</span><span class="meter-track"><span class="meter-fill" data-comfort-fill></span></span><strong data-comfort>100</strong></div>
          <div class="meter-row is-hidden" data-parking-row><span>Parking</span><span class="meter-track"><span class="meter-fill" data-parking-fill></span></span><strong data-parking>0</strong></div>
          <div class="meter-row is-hidden" data-drift-row><span>Drift</span><span class="meter-track"><span class="meter-fill" data-drift-fill></span></span><strong data-drift>0</strong></div>
        </div>
        <div class="hud-panel radar" data-radar>
          <div class="minimap-label" data-minimap-label>Mini City</div>
          <div class="radar__ring">
            <div class="radar__arrow" data-radar-arrow></div>
            <div class="radar__target" data-radar-target></div>
          </div>
        </div>
        <div class="camera-mode-pill" data-camera-mode>Standard Chase</div>
        <div class="cockpit-assist is-hidden" data-cockpit-assist>Parking assist active - press C for chase view</div>
        <div class="touch-controls">
          <div class="touch-cluster">
            <button class="touch-button" type="button" data-touch="left">A</button>
            <button class="touch-button" type="button" data-touch="right">D</button>
          </div>
          <div class="touch-cluster">
            <button class="touch-button" type="button" data-touch="brake">S</button>
            <button class="touch-button" type="button" data-touch="handbrake">HB</button>
            <button class="touch-button" type="button" data-touch="boost">B</button>
            <button class="touch-button" type="button" data-touch="accelerate">W</button>
          </div>
        </div>
      </section>
      <section class="pause-menu is-hidden" data-pause>
        <div class="pause-menu__panel">
          <p class="eyebrow">Paused</p>
          <h2>Mini City Drive</h2>
          <div class="pause-actions">
            <button class="primary-button" type="button" data-resume>Resume</button>
            <button class="secondary-button" type="button" data-restart>Restart Mission</button>
            <button class="secondary-button" type="button" data-garage>Garage</button>
            <button class="secondary-button" type="button" data-toggle-settings>Settings</button>
            <button class="secondary-button" type="button" data-toggle-controls>Controls</button>
            <button class="secondary-button" type="button" data-main-menu>Main Menu</button>
          </div>
          <div class="settings-panel is-hidden" data-settings-panel>
            <div class="settings-grid">
              <label class="settings-row">Master <input type="range" min="0" max="1" step="0.01" data-setting="masterVolume"></label>
              <label class="settings-row">Engine <input type="range" min="0" max="1" step="0.01" data-setting="engineVolume"></label>
              <label class="settings-row">Tires <input type="range" min="0" max="1" step="0.01" data-setting="tireVolume"></label>
              <label class="settings-row">UI <input type="range" min="0" max="1" step="0.01" data-setting="uiVolume"></label>
              <label class="settings-row">Ambience <input type="range" min="0" max="1" step="0.01" data-setting="ambienceVolume"></label>
              <label class="settings-row">Shake <select data-setting="cameraShake"><option value="off">Off</option><option value="low">Low</option><option value="normal">Normal</option></select></label>
              <label class="settings-row">Traffic <select data-setting="trafficDensity"><option value="off">Off</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
              <label class="settings-row">Quality <select data-setting="visualQuality"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
              <label class="settings-row">Default Camera <select data-setting="cameraMode"><option value="standard">Standard Chase</option><option value="far">Far Chase</option><option value="hood">Hood</option><option value="cockpit">Cockpit</option></select></label>
              <label class="settings-row">Cockpit Motion <select data-setting="cockpitMotion"><option value="off">Off</option><option value="low">Low</option><option value="normal">Normal</option></select></label>
              <label class="settings-row">Cockpit HUD <select data-setting="cockpitHud"><option value="minimal">Minimal</option><option value="normal">Normal</option></select></label>
              <label class="settings-row">Cockpit FOV <select data-setting="cockpitFov"><option value="low">Low</option><option value="normal">Normal</option><option value="wide">Wide</option></select></label>
              <label class="settings-row">Mirrors <select data-setting="mirrorRendering"><option value="geometry">Geometry</option><option value="off">Off</option></select></label>
              <label class="settings-row">Dash Brightness <input type="range" min="0.35" max="1.2" step="0.01" data-setting="dashboardBrightness"></label>
              <label class="settings-row">Minimap <input type="checkbox" data-setting="minimap"></label>
              <label class="settings-row">Debug <input type="checkbox" data-setting="debugOverlay"></label>
              <label class="settings-row">UI Scale <select data-setting="uiScale"><option value="small">Small</option><option value="normal">Normal</option><option value="large">Large</option></select></label>
              <label class="settings-row">Touch <select data-setting="touchControls"><option value="auto">Auto</option><option value="on">On</option><option value="off">Off</option></select></label>
              <button class="secondary-button" type="button" data-reset-progress>Reset Local Progress</button>
            </div>
          </div>
          <div class="controls-panel is-hidden" data-controls-panel>
            <div class="controls-grid">
              <div class="control-chip"><span>Accelerate</span><kbd>W / Up</kbd></div>
              <div class="control-chip"><span>Brake / Reverse</span><kbd>S / Down</kbd></div>
              <div class="control-chip"><span>Steer</span><kbd>A D</kbd></div>
              <div class="control-chip"><span>Handbrake</span><kbd>Space</kbd></div>
              <div class="control-chip"><span>Boost</span><kbd>Shift</kbd></div>
              <div class="control-chip"><span>Camera</span><kbd>C</kbd></div>
              <div class="control-chip"><span>Cockpit toggle</span><kbd>V</kbd></div>
              <div class="control-chip"><span>Reset car</span><kbd>R</kbd></div>
              <div class="control-chip"><span>Pause</span><kbd>Esc</kbd></div>
            </div>
          </div>
        </div>
      </section>
      <section class="result-modal is-hidden" data-result>
        <div class="result-modal__panel">
          <p class="eyebrow" data-result-eyebrow>Mission result</p>
          <h2 data-result-title>Complete</h2>
          <div class="result-summary" data-result-summary></div>
          <div class="result-actions">
            <button class="primary-button" type="button" data-result-retry>Retry</button>
            <button class="secondary-button" type="button" data-result-free>Free Drive</button>
            <button class="secondary-button" type="button" data-result-garage>Garage</button>
            <button class="secondary-button" type="button" data-result-main>Main Menu</button>
          </div>
        </div>
      </section>
      <div class="debug-overlay is-hidden" data-debug></div>
      <div class="toast-stack is-hidden" data-toasts></div>
    `,this.root.appendChild(this.layer),this.hud=this.layer.querySelector(`[data-hud]`),this.pause=this.layer.querySelector(`[data-pause]`),this.result=this.layer.querySelector(`[data-result]`),this.toastsEl=this.layer.querySelector(`[data-toasts]`)}bind(){this.layer.querySelector(`[data-resume]`).addEventListener(`click`,this.callbacks.onResume),this.layer.querySelector(`[data-restart]`).addEventListener(`click`,this.callbacks.onRestart),this.layer.querySelector(`[data-garage]`).addEventListener(`click`,this.callbacks.onGarage),this.layer.querySelector(`[data-main-menu]`).addEventListener(`click`,this.callbacks.onMainMenu),this.layer.querySelector(`[data-toggle-settings]`).addEventListener(`click`,()=>this.togglePanel(`settings`)),this.layer.querySelector(`[data-toggle-controls]`).addEventListener(`click`,()=>this.togglePanel(`controls`)),this.layer.querySelector(`[data-result-retry]`).addEventListener(`click`,this.callbacks.onRetry),this.layer.querySelector(`[data-result-free]`).addEventListener(`click`,()=>this.callbacks.onStartMode(`freeDrive`)),this.layer.querySelector(`[data-result-garage]`).addEventListener(`click`,this.callbacks.onGarage),this.layer.querySelector(`[data-result-main]`).addEventListener(`click`,this.callbacks.onMainMenu),this.layer.querySelector(`[data-reset-progress]`).addEventListener(`click`,()=>{window.confirm(`Reset local Mini City Drive progress on this device?`)&&(this.saveManager.resetProgress(),this.showToast(`Local progress reset`),this.callbacks.onSettingsChanged())}),this.layer.querySelectorAll(`[data-setting]`).forEach(e=>{e.addEventListener(`input`,()=>{let t=e.dataset.setting,n=e.type===`checkbox`?e.checked:e.type===`range`?Number(e.value):e.value;this.saveManager.updateSettings({[t]:n}),this.callbacks.onSettingsChanged()})}),this.layer.querySelectorAll(`[data-touch]`).forEach(e=>{this.inputManager.bindTouchButton(e,e.dataset.touch)})}applySettingsToInputs(){this.layer.querySelectorAll(`[data-setting]`).forEach(e=>{let t=this.saveManager.settings[e.dataset.setting];e.type===`checkbox`?e.checked=!!t:e.value=t})}togglePanel(e){let t=this.layer.querySelector(`[data-settings-panel]`),n=this.layer.querySelector(`[data-controls-panel]`);e===`settings`?(t.classList.toggle(`is-hidden`),n.classList.add(`is-hidden`)):(n.classList.toggle(`is-hidden`),t.classList.add(`is-hidden`))}showHud(){this.hud.classList.remove(`is-hidden`)}hideHud(){this.hud.classList.add(`is-hidden`)}showPause(){this.pause.classList.remove(`is-hidden`)}hidePause(){this.pause.classList.add(`is-hidden`)}showResult(e,t){this.hidePause(),this.result.classList.remove(`is-hidden`),this.layer.querySelector(`[data-result-eyebrow]`).textContent=e.success?`Mission complete`:`Mission failed`,this.layer.querySelector(`[data-result-title]`).textContent=e.success?e.missionName:e.reason;let n=this.layer.querySelector(`[data-result-summary]`);n.innerHTML=`
      <div class="result-tile"><span>Car</span><strong>${t}</strong></div>
      <div class="result-tile"><span>Rank</span><strong>${e.rank}</strong></div>
      <div class="result-tile"><span>Medal</span><strong>${e.medal??`-`}</strong></div>
      <div class="result-tile"><span>Score</span><strong>${e.score}</strong></div>
      <div class="result-tile"><span>Coins</span><strong>+${e.coinsEarned}</strong></div>
      <div class="result-tile"><span>XP</span><strong>+${e.xpEarned??0}</strong></div>
      <div class="result-tile"><span>Mastery</span><strong>+${e.masteryXp??0}</strong></div>
      <div class="result-tile"><span>Time</span><strong>${e.time}</strong></div>
      <div class="result-tile"><span>Best</span><strong>${e.isBest?`New best`:e.bestBefore}</strong></div>
      <div class="result-tile"><span>Bonuses</span><strong>${e.bonusObjectives?.filter(e=>e.complete).length??0}/${e.bonusObjectives?.length??0}</strong></div>
      <div class="result-tile"><span>Unlocks</span><strong>${e.newUnlocks?.length?e.newUnlocks.join(`, `):`-`}</strong></div>
      <div class="result-tile"><span>Achievements</span><strong>${e.achievements?.length?e.achievements.map(e=>e.name).join(`, `):`-`}</strong></div>
    `}hideResult(){this.result.classList.add(`is-hidden`)}update(e,t,n,r,i,a,o=null,s={}){this.root.dataset.uiScale=this.saveManager.settings.uiScale;let c=s.cameraMode===`cockpit`,l=c&&this.saveManager.settings.cockpitHud===`minimal`;this.hud.classList.toggle(`is-cockpit-minimal`,l),this.layer.querySelector(`[data-camera-mode]`).textContent=s.cameraLabel??`Standard Chase`;let u=this.layer.querySelector(`.touch-controls`);u&&(u.style.display=this.saveManager.settings.touchControls===`off`?`none`:this.saveManager.settings.touchControls===`on`?`flex`:``),this.layer.querySelector(`[data-speed-value]`).textContent=e.speedKmh;let d=-118+e.speedRatio*236;this.layer.querySelector(`[data-speed-needle]`).style.transform=`translateX(-50%) rotate(${d}deg)`,this.layer.querySelector(`[data-objective-title]`).textContent=t.mode,this.layer.querySelector(`[data-objective-copy]`).textContent=t.distance?`${t.objective} - ${t.distance}m`:t.objective,this.layer.querySelector(`[data-car-name]`).textContent=r.shortName,this.layer.querySelector(`[data-coins]`).textContent=n.totalCoins,this.layer.querySelector(`[data-zone]`).textContent=e.zoneName;let f=bd(n.license.xp);this.layer.querySelector(`[data-license]`).textContent=f.name.replace(` Driver`,``),this.layer.querySelector(`[data-license-fill]`).style.width=`${f.progress*100}%`,this.layer.querySelector(`[data-license-xp]`).textContent=n.license.xp,this.layer.querySelector(`[data-timer-row]`).classList.toggle(`is-hidden`,!t.timer),t.timer&&(this.layer.querySelector(`[data-timer]`).textContent=t.timer);let p=this.layer.querySelector(`[data-event-row]`),m=this.layer.querySelector(`[data-task-row]`);if(p.classList.toggle(`is-hidden`,t.active||!o?.event),m.classList.toggle(`is-hidden`,t.active||!o?.task),o?.event&&(this.layer.querySelector(`[data-event-name]`).textContent=o.event.name,this.layer.querySelector(`[data-event-fill]`).style.width=`${Math.max(8,o.eventTime/o.event.duration*100)}%`),o?.task&&(this.layer.querySelector(`[data-task-name]`).textContent=o.task.label,this.layer.querySelector(`[data-task-fill]`).style.width=`48%`),this.layer.querySelector(`[data-boost-fill]`).style.width=`${e.boostEnergy*100}%`,this.layer.querySelector(`[data-boost]`).textContent=Math.round(e.boostEnergy*100),this.layer.querySelector(`[data-condition-row]`).classList.toggle(`is-hidden`,t.condition===null),t.condition!==null&&(this.layer.querySelector(`[data-condition-fill]`).style.width=`${t.condition}%`,this.layer.querySelector(`[data-condition]`).textContent=Math.round(t.condition)),this.layer.querySelector(`[data-comfort-row]`).classList.toggle(`is-hidden`,t.comfort===null),t.comfort!==null&&(this.layer.querySelector(`[data-comfort-fill]`).style.width=`${t.comfort}%`,this.layer.querySelector(`[data-comfort]`).textContent=Math.round(t.comfort)),this.layer.querySelector(`[data-parking-row]`).classList.toggle(`is-hidden`,t.accuracy===null),t.accuracy!==null&&(this.layer.querySelector(`[data-parking-fill]`).style.width=`${t.accuracy}%`,this.layer.querySelector(`[data-parking]`).textContent=Math.round(t.accuracy)),this.layer.querySelector(`[data-cockpit-assist]`).classList.toggle(`is-hidden`,!(c&&t.accuracy!==null)),this.layer.querySelector(`[data-drift-row]`).classList.toggle(`is-hidden`,t.driftScore===null),t.driftScore!==null){let e=Number((t.progress??`0/1`).split(`/`)[1]??1);this.layer.querySelector(`[data-drift-fill]`).style.width=`${Math.min(100,t.driftScore/e*100)}%`,this.layer.querySelector(`[data-drift]`).textContent=`${t.driftScore} x${t.multiplier?.toFixed(1)??`1.0`}`}this.updateRadar(i,a,t.target??o?.task?.target??null),this.updateDebug(e,t,s)}updateDebug(e,t,n){let r=this.layer.querySelector(`[data-debug]`),i=!!this.saveManager.settings.debugOverlay;r.classList.toggle(`is-hidden`,!i),i&&(r.innerHTML=`
      <span>FPS est ${Math.round(1/Math.max(.001,n.dt??.016))}</span>
      <span>Traffic ${n.trafficCount??0}</span>
      <span>Coins ${n.collectibleCount??0}</span>
      <span>District ${e.zoneName}</span>
      <span>Mission ${t.mode}</span>
      <span>Camera ${n.cameraLabel??n.cameraMode??`Standard`}</span>
      <span>Surface ${n.collision?.currentSurface??e.surfaceId??`ground`}</span>
      <span>Type ${n.collision?.surfaceType??e.surfaceType??`terrain`} @ ${Number(n.collision?.surfaceHeight??e.surfaceHeight??0).toFixed(1)}</span>
      <span>Colliders ${n.collision?.nearbyCount??0}/${n.collision?.staticCount??0}</span>
      <span>Clearance zones ${n.collision?.clearanceCount??0}</span>
      <span>Hits ${n.collision?.lastCount??e.collisionCount??0} Traffic ${n.collision?.trafficCollisions??0}</span>
    `)}updateRadar(e,t,n){let r=this.layer.querySelector(`[data-radar]`);r.style.display=this.saveManager.settings.minimap?``:`none`,this.layer.querySelector(`[data-minimap-label]`).textContent=this.layer.querySelector(`[data-zone]`).textContent;let i=this.layer.querySelector(`[data-radar-arrow]`);i.style.transform=`translate(-50%, -50%) rotate(${t}rad)`;let a=this.layer.querySelector(`[data-radar-target]`);if(!n){a.style.opacity=`0.25`,a.style.transform=`translate(-50%, -50%)`;return}a.style.opacity=`1`;let o=n[0]-e.x,s=n[1]-e.z,c=Math.min(54,Math.hypot(o,s)*(108/xu.radarRange)),l=Math.atan2(o,s)-t,u=Math.sin(l)*c,d=-Math.cos(l)*c;a.style.transform=`translate(calc(-50% + ${u}px), calc(-50% + ${d}px))`}showToast(e){let t=document.createElement(`div`);t.className=`toast`,t.textContent=e,this.toastsEl.classList.remove(`is-hidden`),this.toastsEl.appendChild(t),window.setTimeout(()=>{t.remove(),this.toastsEl.children.length||this.toastsEl.classList.add(`is-hidden`)},2400)}setPaused(e){e?this.showPause():this.hidePause()}setMissionTime(e){this.layer.querySelector(`[data-timer]`).textContent=Bu(e)}},tf=new W,nf=new W,rf=new W,af=class{constructor(e,t,n,r,i){this.mesh=e,this.config=t,this.cityBuilder=n,this.effectsManager=r,this.audioManager=i,this.position=new W,this.velocity=new W,this.heading=0,this.steerVisual=0,this.wheelSpin=0,this.boostEnergy=1,this.exhaustTimer=0,this.boostTimer=0,this.dustTimer=0,this.skidTimer=0,this.collisionShake=0,this.collisionCooldown=0,this.roadBump=0,this.payloadAccelerationMultiplier=1,this.surfaceHeight=0,this.currentSurfaceId=null,this.currentSurfaceInfo=null,this.lastCollision={collided:!1,count:0,ids:[]},this.lastPosition=new W,this.lastSafePosition=new W,this.lastSafeHeading=0,this.stuckTimer=0,this.telemetry=this.createTelemetry()}createTelemetry(){return{speed:0,speedKmh:0,speedRatio:0,forwardSpeed:0,drifting:!1,braking:!1,boosting:!1,offRoad:!1,zoneName:`Downtown Core`,distanceTravelled:0,driftScore:0,collisionIntensity:0,boostEnergy:1,stuck:!1,elevated:!1,steeringVisual:0,inputSteer:0,inputThrottle:0}}reset(e=[0,0,0],t=0,n=null){this.position.set(e[0],0,e[2]??e[1]??0),this.velocity.set(0,0,0),this.heading=t,this.steerVisual=0,this.wheelSpin=0,this.stuckTimer=0,this.currentSurfaceId=n??this.currentSurfaceId,this.currentSurfaceInfo=this.cityBuilder.getSurfaceInfo(this.position,this.currentSurfaceId,{preferElevated:!!n}),this.currentSurfaceId=this.currentSurfaceInfo.surfaceId,this.surfaceHeight=this.currentSurfaceInfo.surfaceHeight??0,this.lastPosition.copy(this.position),this.lastSafePosition.copy(this.position),this.lastSafeHeading=t,this.syncMesh()}setMissionModifiers(e={}){this.payloadAccelerationMultiplier=e.accelerationMultiplier??1}update(e,t){let n=this.config.physics,r=this.cityBuilder.getSurfaceInfo(this.position,this.currentSurfaceId);this.currentSurfaceId=r.surfaceId;let i=zu(this.heading);tf.copy(i),nf.set(i.z,0,-i.x);let a=this.velocity.dot(tf);this.velocity.dot(nf);let o=this.velocity.length(),s=Math.abs(a)>.7?Math.sign(a):1,c=Mu(o/n.maxSpeed,0,1),l=(.32+c*.92)*(t.handbrake?1.22:1);this.heading+=t.steer*n.steerRate*l*s*e;let u=0,d=t.brake>0&&a>1.1;t.throttle>0&&(u+=n.acceleration*r.accelerationFactor*this.payloadAccelerationMultiplier),t.brake>0&&(u+=d?-n.braking:-n.acceleration*.58);let f=t.boost&&t.throttle>0&&this.boostEnergy>.02&&o>2;f?(u+=n.boost,this.boostEnergy=Mu(this.boostEnergy-e*.28,0,1),this.boostTimer-=e,this.boostTimer<=0&&(this.spawnRearPuffs(!0),this.boostTimer=.055)):this.boostEnergy=Mu(this.boostEnergy+e*.12,0,1),this.velocity.addScaledVector(tf,u*e);let p=this.velocity.dot(tf),m=Fu(this.velocity.dot(nf),0,(t.handbrake?n.driftGrip:n.grip)*r.gripFactor,e);this.velocity.copy(tf).multiplyScalar(p).addScaledVector(nf,m),this.velocity.multiplyScalar(Math.max(0,1-.34*e));let h=n.maxSpeed*r.speedFactor*(f?1.12:1),g=n.reverseSpeed,_=Mu(this.velocity.dot(tf),-g,h),v=Mu(this.velocity.dot(nf),-h*.36,h*.36);this.velocity.copy(tf).multiplyScalar(_).addScaledVector(nf,v),this.lastPosition.copy(this.position),this.position.addScaledVector(this.velocity,e),this.resolveWorldBounds(),this.lastCollision=this.cityBuilder.collisionSystem?.resolvePlayer(this,e)??{collided:!1,count:0,ids:[]},r=this.cityBuilder.getSurfaceInfo(this.position,this.currentSurfaceId),this.currentSurfaceId=r.surfaceId,this.currentSurfaceInfo=r,this.surfaceHeight=Fu(this.surfaceHeight,r.surfaceHeight??0,9.5,e);let y=this.lastPosition.distanceTo(this.position),b=Math.abs(v)*Pu(6,18,o),x=(t.handbrake||b>3.5)&&o>7,S=x?b*e*9:0;return y<.06&&(t.throttle>0||t.brake>0)?this.stuckTimer+=e:this.stuckTimer=Math.max(0,this.stuckTimer-e*1.4),this.exhaustTimer-=e,this.dustTimer-=e,this.skidTimer-=e,(t.throttle>0||o>6)&&this.exhaustTimer<=0&&(this.spawnRearPuffs(!1),this.exhaustTimer=t.throttle>0?.22:.42),r.offRoad&&o>5&&this.dustTimer<=0&&(this.spawnRearDust(),this.dustTimer=.12),x&&this.skidTimer<=0&&(this.spawnSkidMarks(),this.skidTimer=.16),this.updateVisuals(e,t,t.brake>0,f,o,_),this.collisionShake=Math.max(0,this.collisionShake-e*2.4),this.collisionCooldown=Math.max(0,this.collisionCooldown-e),this.syncMesh(),!this.lastCollision.collided&&o<n.maxSpeed*1.05&&(this.lastSafePosition.copy(this.position),this.lastSafeHeading=this.heading),this.telemetry={speed:o,speedKmh:Math.round(o*6.2),speedRatio:c,forwardSpeed:_,drifting:x,braking:d,boosting:f,offRoad:r.offRoad,zoneName:r.zoneName,distanceTravelled:y,driftScore:S,collisionIntensity:this.collisionShake,boostEnergy:this.boostEnergy,stuck:this.stuckTimer>2.5,surfaceId:r.surfaceId,surfaceType:r.surfaceType,surfaceHeight:r.surfaceHeight,elevated:!!r.elevated,collisionCount:this.lastCollision.count,steeringVisual:this.steerVisual,inputSteer:t.steer,inputThrottle:t.throttle},this.audioManager.updateEngine(c,t.throttle>0,x,f,this.config),this.telemetry}updateVisuals(e,t,n,r,i,a){let o=this.config.visual;this.steerVisual=Fu(this.steerVisual,t.steer*.46,10,e),this.wheelSpin+=a*e/Math.max(.1,o.wheelRadius);let s=this.mesh.userData.root;s&&(s.position.y=this.roadBump,s.rotation.z=Fu(s.rotation.z,-t.steer*Mu(i/45,0,1)*.045,8,e),s.rotation.x=Fu(s.rotation.x,n?-.035:t.throttle?.018:0,7,e)),this.roadBump=Fu(this.roadBump,0,8,e),this.mesh.userData.frontWheels?.forEach(e=>{e.rotation.y=this.steerVisual}),this.mesh.userData.wheels?.forEach(e=>{e.tire.rotation.x=this.wheelSpin}),this.mesh.userData.brakeLights?.forEach(e=>{e.material.emissiveIntensity=n?1.45:.12})}syncMesh(){this.mesh.position.copy(this.position),this.mesh.position.y=this.surfaceHeight,this.mesh.rotation.y=this.heading}getWorldPosition(e=new W){return e.copy(this.mesh.position)}spawnRearPuffs(e){this.mesh.userData.exhausts?.forEach(t=>{t.getWorldPosition(rf),this.effectsManager.spawnPuff(rf,{boost:e,color:e?this.mesh.userData.boostTrailColor:null,size:e?.85:.62,life:e?.32:.68})})}spawnRearDust(){this.mesh.userData.wheels?.forEach(e=>{e.axle<0&&(e.pivot.getWorldPosition(rf),this.effectsManager.spawnDust(rf))})}spawnSkidMarks(){this.mesh.userData.wheels?.forEach(e=>{Math.abs(e.axle)>0&&(e.pivot.getWorldPosition(rf),this.effectsManager.spawnSkid(rf,this.heading))})}applyCollision(e,t=1){let n=this.position.clone().sub(e);n.lengthSq()<1e-4&&n.set(1,0,0),n.normalize();let r=(5+t*8)/this.config.physics.mass;this.velocity.addScaledVector(n,r),this.velocity.multiplyScalar(.58),this.collisionShake=Mu(this.collisionShake+t,0,1.5),t>.65&&this.effectsManager.spawnSparks(this.position),this.audioManager.play(`crash`,Mu(t,.3,1))}registerCollisionImpact(e=.45,t=`static`,n=.016,r={}){this.collisionShake=Mu(this.collisionShake+e*.55,0,1.5),this.collisionCooldown<=0&&(!r.quiet&&e>.45&&this.effectsManager.spawnSparks(this.position),r.quiet||this.audioManager.play(`crash`,Mu(e,.25,.95)),this.collisionCooldown=.22+n),this.lastCollision={collided:!0,count:Math.max(1,this.lastCollision?.count??0),ids:[t]}}registerLowSurfaceBump(e=.1,t=.016){this.roadBump=Math.max(this.roadBump,Math.min(e,Yu.curbClimbHeight*.32)),this.collisionShake=Mu(this.collisionShake+e*.18,0,.42),this.collisionCooldown=Math.max(this.collisionCooldown,t)}getCollider(){let e=this.config.visual,t=e.rideHeight+e.height+.55,n=this.getColliderDimensions(e);return{id:`player`,center:new U(this.position.x,this.position.z),size:new U(n.width,n.length),rotation:this.heading,yMin:this.surfaceHeight-.15,yMax:this.surfaceHeight+t}}getColliderDimensions(e){let t={hatchback:{width:.78,length:.82},coupe:{width:.8,length:.84},suv:{width:.82,length:.84},supercar:{width:.83,length:.86},jeep:{width:.84,length:.82},classic:{width:.78,length:.88}}[e.type]??{width:.8,length:.84};return{width:Math.max(.9,e.width*t.width+Yu.carColliderPadding),length:Math.max(1.8,e.length*t.length+Yu.carColliderPadding)}}isInsideParkingZone(e){let t=new W(e.center[0],0,e.center[1]),n=new W(e.size[0],0,e.size[1]);return Vu(this.position,t,n,e.rotation)}resolveWorldBounds(){let e=xu.bounds;(Math.abs(this.position.x)>e||Math.abs(this.position.z)>e)&&(this.position.x=Mu(this.position.x,-e,e),this.position.z=Mu(this.position.z,-e,e),this.velocity.multiplyScalar(.38))}},of=new Map,sf=(e,t)=>{let n=`${e}:${JSON.stringify(t)}`;return of.has(n)||of.set(n,new X(t)),of.get(n)},cf={hatchback:(e,t)=>[[-e*.5,.08],[-e*.42,t*.54],[-e*.22,t*.72],[e*.12,t*.72],[e*.37,t*.48],[e*.5,t*.22],[e*.5,.04]],coupe:(e,t)=>[[-e*.5,.06],[-e*.37,t*.4],[-e*.05,t*.68],[e*.24,t*.62],[e*.47,t*.25],[e*.5,.05]],suv:(e,t)=>[[-e*.5,.08],[-e*.46,t*.67],[-e*.22,t*.82],[e*.28,t*.82],[e*.48,t*.58],[e*.5,.08]],supercar:(e,t)=>[[-e*.5,.05],[-e*.34,t*.34],[-e*.02,t*.68],[e*.22,t*.58],[e*.5,t*.12],[e*.5,.04]],jeep:(e,t)=>[[-e*.5,.06],[-e*.48,t*.66],[-e*.16,t*.78],[e*.28,t*.78],[e*.49,t*.6],[e*.5,.06]],classic:(e,t)=>[[-e*.5,.08],[-e*.43,t*.38],[-e*.1,t*.64],[e*.18,t*.62],[e*.42,t*.36],[e*.5,.08]]},lf=class{constructor(){this.shadowMaterial=sf(`soft-shadow`,{color:`#1a1e25`,transparent:!0,opacity:.22,roughness:1})}createCarMesh(e,t={}){let n=new wn;n.name=e.name;let r=e.visual,i={...e.colors,body:t.customization?.body??e.colors.body,accent:t.customization?.accent??e.colors.accent},a=new wn;n.add(a);let o=sf(`body-${e.id}`,{color:i.body,roughness:.37,metalness:.28}),s=sf(`secondary-${e.id}`,{color:i.secondary,roughness:.42,metalness:.2}),c=sf(`glass-${e.id}`,{color:i.glass,roughness:.08,metalness:.04,transparent:!0,opacity:t.customization?.tintOpacity??.72}),l=sf(`accent-${e.id}`,{color:i.accent,roughness:.24,metalness:.68}),u=sf(`tire`,{color:`#15181d`,roughness:.78,metalness:.04}),d=t.customization?.wheelStyle??`stock`,f=d===`sport`?`#202a38`:d===`classic`?`#f2e7cf`:d===`offroad`?`#9aa36b`:`#d7d9d6`,p=sf(`rim-${d}`,{color:f,roughness:.24,metalness:.76}),m=sf(`lights-${e.id}`,{color:i.lights,emissive:i.lights,emissiveIntensity:.45,roughness:.2}),h=sf(`brake-${e.id}`,{color:i.brake,emissive:i.brake,emissiveIntensity:.1,roughness:.26});this.addProfileBody(a,r,o),this.addLowerTrim(a,r,s,l),this.addHood(a,r,o,l,e.id),this.addGlass(a,r,c,e.id),this.addInteriorHint(a,r,s,e.id),this.addLights(a,r,m,h),this.addHeadlightShapes(a,r,m,e.id),this.addSideMirrors(a,r,s),this.addWheelArches(a,r,s,e.id),this.addPanelLines(a,r,s),this.addLicensePlate(a,r,e.id),this.addUniqueDetails(a,r,e.id,o,s,l,u,p),this.addCarSpecificDetails(a,r,e.id,o,s,l,u,p);let g=this.addWheels(a,r,u,p,d),_=new J(new fi(Math.max(r.width,r.length)*.62,28),this.shadowMaterial);return _.rotation.x=-Math.PI*.5,_.scale.x=r.width/r.length,_.position.y=.015,_.position.z=-.08,n.add(_),n.userData={carId:e.id,root:a,wheels:g.wheels,frontWheels:g.frontWheels,brakeLights:g.brakeLights,exhausts:g.exhausts,boostTrailColor:t.customization?.boostTrail??`#67d9ff`,body:a,dimensions:{length:r.length,width:r.width,height:r.height,radius:Math.max(r.length,r.width)*.54}},t.preview&&(n.scale.setScalar(1.18),n.rotation.y=Math.PI),n}addProfileBody(e,t,n){let r=cf[t.type](t.length,t.height),i=new Gi;i.moveTo(r[0][0],r[0][1]),r.slice(1).forEach(([e,t])=>i.lineTo(e,t)),i.lineTo(r[0][0],r[0][1]);let a=new ka(i,{depth:t.width,bevelEnabled:!0,bevelSegments:2,bevelSize:.055,bevelThickness:.055});a.translate(0,0,-t.width*.5),a.rotateY(-Math.PI*.5),a.computeVertexNormals();let o=new J(a,n);o.castShadow=!0,o.receiveShadow=!0,o.position.y=t.rideHeight,e.add(o)}addLowerTrim(e,t,n,r){let i=new J(new Y(t.width*.96,.18,t.length*.9),n);i.position.set(0,t.rideHeight+.17,-.02),i.castShadow=!0,e.add(i);let a=new J(new Y(t.width*.82,.18,.18),r);a.position.set(0,t.rideHeight+.28,t.length*.5+.04),a.castShadow=!0,e.add(a);let o=a.clone();o.position.z=-t.length*.5-.04,e.add(o)}addHood(e,t,n,r,i){let a=t.length*(i===`classic`?.36:i===`hatchback`?.24:.31),o=new J(new Y(t.width*.78,.035,a),n);o.position.set(0,t.rideHeight+t.height*.6,t.length*.28),o.rotation.x=i===`supercar`?-.08:i===`classic`?.08:-.035,e.add(o);let s=new J(new Y(.035,.04,a*.92),r);s.position.copy(o.position),s.position.y+=.025,e.add(s)}addInteriorHint(e,t,n,r){let i=t.width*.18,a=t.height*.22,o=r===`classic`?-t.length*.05:-t.length*.02;[-1,1].forEach(r=>{let s=new J(new Y(i,a,t.length*.14),n);s.position.set(r*t.width*.18,t.rideHeight+t.height*.6,o),s.userData.firstPersonCull=!0,e.add(s)});let s=new J(new Y(t.width*.5,.08,.12),n);s.position.set(0,t.rideHeight+t.height*.58,t.length*.14);let c=new J(new Pa(.11,.014,8,18),n);c.position.set(-t.width*.16,t.rideHeight+t.height*.62,t.length*.19),c.rotation.x=Math.PI*.5,s.userData.firstPersonCull=!0,c.userData.firstPersonCull=!0,e.add(s,c)}addSideMirrors(e,t,n){[-1,1].forEach(r=>{let i=new J(new Y(.06,.05,.24),n);i.position.set(r*t.width*.47,t.rideHeight+t.height*.68,t.length*.14),i.rotation.y=r*.24;let a=new J(new Y(.18,.11,.08),n);a.position.set(r*t.width*.56,t.rideHeight+t.height*.69,t.length*.18),a.rotation.y=r*.26,e.add(i,a)})}addWheelArches(e,t,n,r){let i=t.length*.33,a=t.width*.53,o=t.wheelRadius*(r===`offroad-jeep`?1.18:1.05);[-1,1].forEach(r=>{[-1,1].forEach(s=>{let c=new J(new Pa(o,.045,8,24),n);c.rotation.y=Math.PI*.5,c.scale.y=.72,c.position.set(r*a,t.wheelRadius+.16,s*i),e.add(c)})})}addPanelLines(e,t,n){[-1,1].forEach(r=>{let i=new J(new Y(.035,.035,t.length*.74),n);i.position.set(r*t.width*.502,t.rideHeight+t.height*.48,-t.length*.02),e.add(i);let a=new J(new Y(.04,t.height*.33,.035),n);a.position.set(r*t.width*.505,t.rideHeight+t.height*.48,-t.length*.04),e.add(a)})}addLicensePlate(e,t,n){let r=sf(`plate-${n}`,{color:`#fffaf0`,roughness:.35,metalness:.05});[-1,1].forEach(n=>{let i=new J(new Y(t.width*.32,.12,.035),r);i.position.set(0,t.rideHeight+t.height*.28,n*t.length*.535),e.add(i)})}addHeadlightShapes(e,t,n,r){r!==`classic`&&[-1,1].forEach(i=>{let a=r===`supercar`||r===`sports-coupe`,o=new J(a?new Y(t.width*.2,.055,.08):new Na(.105,12,8),n);o.position.set(i*t.width*.29,t.rideHeight+t.height*.43,t.length*.545),o.rotation.z=i*(a?.22:0),e.add(o)})}addGlass(e,t,n,r){let i=t.length*(r===`classic`?.42:r===`jeep`?.48:.38),a=t.width*.72,o=t.height*(r===`suv`||r===`jeep`?.34:.28),s=r===`hatchback`||r===`suv`||r===`jeep`?-t.length*.08:-t.length*.04,c=new J(new Y(a,o,i),n);c.position.set(0,t.rideHeight+t.height*.72,s),c.castShadow=!0,c.userData.firstPersonCull=!0,e.add(c);let l=new J(new Y(a*.86,o*.78,.035),n);l.position.set(0,c.position.y-o*.08,s+i*.52),l.rotation.x=-.22,l.userData.firstPersonCull=!0,e.add(l);let u=l.clone();u.position.z=s-i*.52,u.rotation.x=.2,u.userData.firstPersonCull=!0,e.add(u)}addLights(e,t,n,r){let i=t.rideHeight+t.height*.32,a=t.rideHeight+t.height*.32,o=[t.width*.18,.12,.045];[-1,1].forEach(s=>{let c=new J(new Y(...o),n);c.position.set(s*t.width*.31,i,t.length*.51),e.add(c);let l=new J(new Y(...o),r.clone());l.position.set(s*t.width*.31,a,-t.length*.51),e.add(l),e.userData.brakeLights=e.userData.brakeLights??[],e.userData.brakeLights.push(l)})}addWheels(e,t,n,r,i=`stock`){let a=t.length*.33,o=t.width*.52,s=[],c=[],l=e.userData.brakeLights??[],u=[];return[-1,1].forEach(l=>{[-1,1].forEach(u=>{let d=new wn;d.position.set(l*o,t.wheelRadius+.06,u*a);let f=new J(new pi(t.wheelRadius,t.wheelRadius,t.wheelWidth,18),n);f.rotation.z=Math.PI*.5,f.castShadow=!0;let p=new J(new pi(t.wheelRadius*.52,t.wheelRadius*.52,t.wheelWidth*1.04,14),r);if(p.rotation.z=Math.PI*.5,d.add(f,p),i===`sport`||i===`classic`)for(let e=0;e<5;e+=1){let n=new J(new Y(t.wheelRadius*.08,t.wheelWidth*1.08,t.wheelRadius*.76),r);n.rotation.z=Math.PI*.5,n.rotation.y=e/5*Math.PI,d.add(n)}e.add(d),s.push({pivot:d,tire:f,side:l,axle:u}),u>0&&c.push(d)});let d=new J(new pi(.055,.055,.42,10),r);d.rotation.x=Math.PI*.5,d.position.set(l*t.width*.24,t.rideHeight+.14,-t.length*.56),e.add(d),u.push(d)}),{wheels:s,frontWheels:c,brakeLights:l,exhausts:u}}addUniqueDetails(e,t,n,r,i,a,o,s){if(t.spoiler){let n=new wn,r=new J(new Y(t.width*(t.spoiler===`wing`?.94:.72),.08,.2),a);r.position.y=t.rideHeight+t.height*(t.spoiler===`lip`?.58:.78),r.position.z=-t.length*.48,n.add(r),t.spoiler!==`lip`&&[-1,1].forEach(e=>{let a=new J(new Y(.06,.42,.06),i);a.position.set(e*t.width*.31,r.position.y-.22,r.position.z+.02),n.add(a)}),e.add(n)}if(t.roofRails&&[-1,1].forEach(n=>{let r=new J(new Y(.06,.08,t.length*.42),a);r.position.set(n*t.width*.32,t.rideHeight+t.height*1.05,-t.length*.05),e.add(r)}),t.rollCage){[-1,1].forEach(n=>{let r=new J(new Y(.08,t.height*.58,.08),i);r.position.set(n*t.width*.36,t.rideHeight+t.height*.82,-t.length*.04),e.add(r)});let n=new J(new Y(t.width*.82,.08,t.length*.45),i);n.position.set(0,t.rideHeight+t.height*1.1,-t.length*.04),e.add(n)}if(t.spareTire){let n=new J(new Pa(t.wheelRadius*.7,t.wheelRadius*.18,10,20),o);n.rotation.y=Math.PI*.5,n.position.set(0,t.rideHeight+t.height*.45,-t.length*.57),e.add(n)}if(t.diffuser){let n=new J(new Y(t.width*.82,.16,.34),i);n.position.set(0,t.rideHeight+.14,-t.length*.52),n.rotation.x=-.18,e.add(n)}if(t.chrome&&([-1,1].forEach(n=>{let r=new J(new Y(t.width*.9,.12,.12),s);r.position.set(0,t.rideHeight+.3,n*t.length*.54),e.add(r)}),[-1,1].forEach(n=>{let r=new J(new Na(.12,12,8),sf(`classic-lamp-${n}`,{color:`#fff5c2`,emissive:`#fff5c2`,emissiveIntensity:.35}));r.position.set(n*t.width*.24,t.rideHeight+t.height*.42,t.length*.54),e.add(r)})),(n===`supercar`||n===`coupe`)&&[-1,1].forEach(n=>{let r=new J(new Y(.05,.26,.56),i);r.position.set(n*t.width*.51,t.rideHeight+t.height*.36,-t.length*.08),e.add(r)}),n===`hatchback`){let n=new J(new Y(t.width*.5,.045,t.length*.28),a);n.position.set(0,t.rideHeight+t.height*1.02,-t.length*.08),e.add(n)}}addCarSpecificDetails(e,t,n,r,i,a,o,s){if((n===`sports-coupe`||n===`supercar`)&&[-1,1].forEach(n=>{let r=new J(new Y(.08,.12,t.length*.62),a);r.position.set(n*t.width*.54,t.rideHeight+.24,-t.length*.02),e.add(r)}),n===`supercar`){[-1,1].forEach(n=>{let r=new J(new Y(.12,.2,.42),i);r.position.set(n*t.width*.38,t.rideHeight+t.height*.46,-t.length*.22),r.rotation.y=n*-.18,e.add(r)});let n=new J(new Y(t.width*.86,.055,.3),a);n.position.set(0,t.rideHeight+.12,t.length*.58),e.add(n)}if(n===`offroad-jeep`){[-1,1].forEach(n=>{[-1,1].forEach(r=>{let a=new J(new Y(.13,.18,t.length*.2),i);a.position.set(n*t.width*.58,t.rideHeight+t.height*.34,r*t.length*.33),e.add(a)})});for(let n=-2;n<=2;n+=1){let r=new J(new Na(.095,10,8),sf(`jeep-roof-light-${n}`,{color:`#fff2b6`,emissive:`#fff2b6`,emissiveIntensity:.42}));r.position.set(n*.18,t.rideHeight+t.height*1.16,t.length*.2),e.add(r)}}if(n===`suv`){let n=new J(new Y(t.width*.74,t.height*.34,.08),r);n.position.set(0,t.rideHeight+t.height*.48,-t.length*.49),e.add(n)}if(n===`hatchback`){let n=new J(new Y(t.width*.58,.08,.08),a);n.position.set(0,t.rideHeight+t.height*.24,t.length*.56),e.add(n)}if(n===`classic`){let n=new J(new Na(.72,18,10),r);n.scale.set(t.width*.78,.22,t.length*.28),n.position.set(0,t.rideHeight+t.height*.55,t.length*.23),e.add(n),[-1,1].forEach(n=>{let r=new J(new Y(.08,.2,.52),s);r.position.set(n*t.width*.42,t.rideHeight+t.height*.45,-t.length*.38),e.add(r)})}}},uf=class{constructor(e){this.root=e,this.loadingEl=e.querySelector(`#loading-screen`),this.sceneManager=new Qd(e),this.saveManager=new Zd,this.inputManager=new Nd(e),this.audioManager=new Hu(this.saveManager),this.customizationManager=new Sd(this.saveManager),this.tuningManager=new Md(this.saveManager,{onUpgrade:(e,t)=>{this.audioManager.play(`tuning`,.75),this.hudManager?.showToast(`${t.label} tuning applied`)}}),this.masteryManager=new Bd(this.saveManager,{onLevelUp:(e,t)=>{this.audioManager.play(`mastery`,.8),this.hudManager?.showToast(`${lu(e).shortName} mastery: ${t.name}`)}}),this.careerManager=new ld(this.saveManager,{onCareerComplete:(e,t)=>{this.audioManager.play(`objective`,.8),t.length?this.hudManager?.showToast(`Career unlocked: ${t[0]}`):this.hudManager?.showToast(`${e.title} career medal saved`)}}),this.progressionManager=new Vd(this.saveManager,{onLevelUp:e=>this.hudManager?.showToast(`${e.name} license reached`)}),this.achievementManager=new Id(this.saveManager,{onAchievement:e=>this.hudManager?.showToast(`Achievement: ${e.name}`),onLevelUp:e=>this.hudManager?.showToast(`${e.name} license reached`)}),this.statsManager=new Hd(this.saveManager),this.effectsManager=new rd(this.sceneManager.scene),this.vehicleFactory=new lf,this.cityBuilder=new Qu(this.sceneManager.scene,this.effectsManager,this.vehicleFactory),this.trafficSystem=new $d(this.sceneManager.scene,this.vehicleFactory,this.saveManager,this.cityBuilder),this.missionManager=new Pd(this.sceneManager.scene,this.saveManager,this.audioManager,this.cityBuilder),this.cityEventManager=null,this.cameraController=new Ju(this.sceneManager.camera,this.saveManager),this.cockpitManager=new nd(this.sceneManager.scene,this.sceneManager.camera,this.saveManager),this.player=null,this.playerConfig=lu(this.saveManager.data.selectedCar),this.state=`garage`,this.currentMode=`freeDrive`,this.testDrive=!1,this.lastMissionMode=`freeDrive`,this.missionHud=this.missionManager.getFreeDriveHud(),this.phase3Hud=null,this.activeCareerMissionId=null,this.lastTrafficDensity=this.saveManager.settings.trafficDensity,this.frameId=null,this.pausedByBlur=!1,this.cityEventManager=new od(this.saveManager,this.masteryManager,{onEvent:e=>{this.audioManager.play(`event`,.65),this.hudManager?.showToast(e.name)},onTaskComplete:e=>{this.audioManager.play(`objective`,.8),this.hudManager?.showToast(`${e.label} +${e.coins} coins`)}}),this.garageManager=new Ad(e,this.vehicleFactory,this.saveManager,this.customizationManager,this.tuningManager,this.masteryManager,this.careerManager,{onStart:(e,t)=>this.startMode(e,t),onStartCareer:(e,t,n)=>this.startMode(t,n,{careerId:e}),onTestDrive:e=>this.startMode(`freeDrive`,e,{testDrive:!0}),onFeedback:e=>this.hudManager?.showToast(e),onAudioClick:()=>this.audioManager.play(`click`,.6)}),this.hudManager=new ef(e,this.inputManager,this.saveManager,{onResume:()=>this.resume(),onRestart:()=>this.restartCurrentMode(),onGarage:()=>this.openGarage(),onMainMenu:()=>this.openGarage(),onRetry:()=>this.restartCurrentMode(),onStartMode:e=>this.startMode(e,this.saveManager.data.selectedCar),onSettingsChanged:()=>this.applySettings()}),this.onResize=this.onResize.bind(this),this.onBlur=this.onBlur.bind(this),this.onFocus=this.onFocus.bind(this)}start(){this.cityBuilder.build(),this.cityBuilder.restoreCollected(this.saveManager),this.trafficSystem.build(),this.applySettings(),window.addEventListener(`resize`,this.onResize),window.addEventListener(`blur`,this.onBlur),window.addEventListener(`focus`,this.onFocus),this.loadingEl?.classList.add(`is-hidden`),this.garageManager.show(),this.loop()}loop(){this.frameId=window.requestAnimationFrame(()=>this.loop()),this.sceneManager.resize();let e=Math.min(.033,this.sceneManager.clock.getDelta());if(this.state===`garage`){this.garageManager.update(e,this.sceneManager.size),this.garageManager.render(this.sceneManager.renderer);return}this.state===`playing`&&this.updatePlaying(e),this.effectsManager.update(e),this.sceneManager.render()}updatePlaying(e){if(!this.player)return;this.handleHotkeys(),this.audioManager.setCockpitActive(this.cameraController.getMode().id===`cockpit`);let t=this.inputManager.getDrivingInput(),n=this.player.update(e,t);this.cityBuilder.update(e),this.trafficSystem.update(e,this.player);let r=this.cityBuilder.collisionSystem.resolveTrafficVehicles(this.player,this.trafficSystem.vehicles);r&&this.player.syncMesh(),this.cameraController.update(e,this.player,n),this.cockpitManager.update(e,this.player,n,this.cameraController.getMode().id),this.statsManager.updateDriving(e,n),this.progressionManager.awardCleanDistance(n.distanceTravelled),this.masteryManager.awardDriving(this.playerConfig.id,n),this.phase3Hud=this.cityEventManager.update(e,n,this.player,this.currentMode,this.playerConfig.id),this.cityBuilder.checkCollectibles(this.player.position,this.saveManager,this.audioManager,e=>this.hudManager.showToast(e)),this.cityBuilder.checkLandmarks(this.player.position,this.saveManager,this.audioManager,e=>this.hudManager.showToast(e)),this.cityBuilder.checkDistricts(this.player.position,this.saveManager,this.audioManager,e=>this.hudManager.showToast(e)),this.achievementManager.evaluate();let i=this.missionManager.update(e,this.player,n);if(i?.result){this.decorateMissionResult(i.result),this.showResult(i.result);return}this.missionHud=i,n.stuck&&this.hudManager.showToast(`Car reset available with R`),this.cityBuilder.collisionSystem.updateDebug(this.saveManager.settings.debugOverlay,this.player,this.player.currentSurfaceInfo),this.hudManager.update(n,this.missionHud,this.saveManager.data,this.playerConfig,this.player.position,this.player.heading,this.phase3Hud,{dt:e,trafficCount:this.trafficSystem.vehicles.length,collectibleCount:this.cityBuilder.collectibles.filter(e=>e.visible).length,mission:this.currentMode,collision:{...this.cityBuilder.collisionSystem.getDebugStats(),lastCount:this.player.lastCollision?.count??0,trafficCollisions:r},cameraMode:this.cameraController.getMode().id,cameraLabel:this.cameraController.getMode().label,testDrive:!!this.testDrive})}decorateMissionResult(e){if(e.achievements=this.achievementManager.evaluate(e),e.masteryXp=this.masteryManager.awardMission(this.playerConfig.id,e)?.amount??0,this.activeCareerMissionId&&e.success){let t=this.careerManager.complete(this.activeCareerMissionId,e);e.career=t,e.newUnlocks=t?.unlocked??[]}this.activeCareerMissionId=null}handleHotkeys(){if(this.inputManager.consume(`Escape`)){this.pause();return}if(this.inputManager.consume(`c`)){let e=this.cameraController.nextMode();this.showCameraToast(e)}if(this.inputManager.consume(`v`)){let e=this.cameraController.toggleCockpit();this.showCameraToast(e)}if(this.inputManager.consume(`r`)&&(this.missionManager.noteReset(),this.resetPlayerNearRoad(),this.hudManager.showToast(`Vehicle reset`)),this.inputManager.consume(`F3`)||this.inputManager.consume("`")){let e=!this.saveManager.settings.debugOverlay;this.saveManager.updateSettings({debugOverlay:e}),this.hudManager.showToast(e?`Collision debug on`:`Collision debug off`)}}startMode(e,t,n={}){this.audioManager.unlock(),this.audioManager.play(`click`,.65),this.currentMode=e,this.testDrive=!!n.testDrive,e!==`freeDrive`&&(this.lastMissionMode=e),this.activeCareerMissionId=n.careerId??null,this.playerConfig=lu(t??this.saveManager.data.selectedCar),this.saveManager.setSelectedCar(this.playerConfig.id),this.spawnPlayer();let r=null,i=vu(e);e===`freeDrive`?(this.missionManager.start(`freeDrive`),r=ju):r=this.missionManager.start(e,{carId:this.playerConfig.id,carName:this.playerConfig.name,shortName:this.playerConfig.shortName}),this.player.reset(r.position,r.heading),this.player.setMissionModifiers({accelerationMultiplier:i?.accelerationMultiplier??1}),this.missionHud=this.missionManager.getHudData(this.player.position),this.state=`playing`,this.pausedByBlur=!1,this.garageManager.hide(),this.hudManager.hideResult(),this.hudManager.hidePause(),this.hudManager.showHud(),this.audioManager.setMuted(!1);let a=this.activeCareerMissionId?`Career: `:``;this.hudManager.showToast(this.testDrive?`Test Drive started - press C for cockpit`:e===`freeDrive`?`Free Drive started`:`${a}${i?.name??`Mission`} started`)}spawnPlayer(){this.player?.mesh&&(this.cockpitManager.syncVehicleCull(this.player.mesh,!1),this.sceneManager.scene.remove(this.player.mesh));let e=this.customizationManager.getCarCustomization(this.playerConfig.id),t=this.customizationManager.resolveVisualColors(this.playerConfig,e),n=this.tuningManager.getEffectiveConfig(this.playerConfig),r=this.vehicleFactory.createCarMesh(n,{customization:{body:t.body,accent:t.accent,tintOpacity:t.tintOpacity,boostTrail:t.boostTrail,wheelStyle:e.wheels}});r.traverse(e=>{e.isMesh&&(e.castShadow=!0,e.receiveShadow=!0)}),this.sceneManager.scene.add(r),this.player=new af(r,n,this.cityBuilder,this.effectsManager,this.audioManager)}resetPlayerNearRoad(){if(!this.player)return;let e=this.player.position.clone(),t=this.cityBuilder.collisionSystem.findNearestRoadSurface(e,this.player.currentSurfaceInfo),n=t?.position??this.findNearestRoad(e),r=t?.heading??this.player.lastSafeHeading??this.player.heading;this.player.reset([n.x,0,n.z],r,t?.id??null)}findNearestRoad(e){let t=new W(0,0,16),n=1/0;return Du.forEach(r=>{let i=new W(r.position[0],0,r.position[2]),a=i.distanceTo(e);a<n&&(n=a,t=i)}),this.cityBuilder.roadSegments.forEach(r=>{let i=new W(r.center[0],0,r.center[1]),a=i.distanceTo(e);a<n&&(n=a,t=i)}),this.cityBuilder.elevatedRoutes?.forEach(r=>{let i=new W(r.center[0],0,r.center[1]),a=i.distanceTo(e);a<n&&(n=a,t=i)}),t}pause(){this.state===`playing`&&(this.state=`paused`,this.hudManager.setPaused(!0),this.audioManager.setMuted(!0))}resume(){this.state===`paused`&&(this.sceneManager.clock.getDelta(),this.state=`playing`,this.hudManager.setPaused(!1),this.audioManager.setMuted(!1))}restartCurrentMode(){let e=this.currentMode===`freeDrive`?`freeDrive`:this.lastMissionMode;this.startMode(e,this.saveManager.data.selectedCar)}openGarage(){this.state=`garage`,this.testDrive=!1,this.player?.mesh&&this.cockpitManager.syncVehicleCull(this.player.mesh,!1),this.cockpitManager.setVisible(!1),this.hudManager.hideHud(),this.hudManager.hidePause(),this.hudManager.hideResult(),this.audioManager.setMuted(!0),this.audioManager.setCockpitActive(!1),this.garageManager.show()}showCameraToast(e){this.hudManager.showToast(e),this.cameraController.getMode().id===`cockpit`&&!this.saveManager.settings.cockpitHintSeen&&(this.saveManager.updateSettings({cockpitHintSeen:!0}),window.setTimeout(()=>this.hudManager.showToast(`Cockpit view enabled. Press C to switch camera.`),260))}showResult(e){this.state=`result`,this.player?.mesh&&this.cockpitManager.syncVehicleCull(this.player.mesh,!1),this.cockpitManager.setVisible(!1),this.hudManager.showResult(e,this.playerConfig.name),this.audioManager.setMuted(!0)}applySettings(){this.audioManager.applyVolumes(),this.cameraController.setMode(this.saveManager.settings.cameraMode,!1);let e=this.saveManager.settings.visualQuality,t=e===`high`?1.8:e===`low`?1:1.45;this.sceneManager.renderer.setPixelRatio(Math.min(window.devicePixelRatio,t));let n=e!==`low`;this.sceneManager.renderer.shadowMap.enabled=n,this.lastTrafficDensity!==this.saveManager.settings.trafficDensity&&(this.lastTrafficDensity=this.saveManager.settings.trafficDensity,this.trafficSystem.build())}onResize(){this.sceneManager.resize()}onBlur(){this.state===`playing`&&(this.pausedByBlur=!0,this.pause())}onFocus(){this.pausedByBlur&&=(this.hudManager.showToast(`Paused while tab was inactive`),!1)}dispose(){this.frameId&&window.cancelAnimationFrame(this.frameId),window.removeEventListener(`resize`,this.onResize),window.removeEventListener(`blur`,this.onBlur),window.removeEventListener(`focus`,this.onFocus),this.inputManager.dispose()}},df=document.querySelector(`#game-root`),ff=e=>{df.innerHTML=`
    <div class="webgl-error">
      <div class="webgl-error__panel">
        <p class="eyebrow">Mini City Drive</p>
        <h1>WebGL could not start</h1>
        <p>${e}</p>
        <p class="webgl-error__hint">Try a modern browser with hardware acceleration enabled.</p>
      </div>
    </div>
  `};try{if(!window.WebGLRenderingContext)throw Error(`Your browser does not expose WebGL.`);let e=new uf(df);e.start(),window.__MINI_CITY_DRIVE__=e}catch(e){console.error(`[Mini City Drive] startup failed`,e),ff(e?.message??`Unknown renderer startup error.`)}