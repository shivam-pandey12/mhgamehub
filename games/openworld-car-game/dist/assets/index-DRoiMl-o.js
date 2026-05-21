(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const ja="184",pd=0,Lo=1,md=2,Xs=1,Qc=2,Jn=3,Vi=0,zt=1,Ei=2,Ci=0,In=1,Io=2,ko=3,No=4,gd=5,Qi=100,vd=101,_d=102,xd=103,yd=104,Md=200,Sd=201,wd=202,bd=203,jr=204,Jr=205,Ed=206,Td=207,Cd=208,Ad=209,Rd=210,Pd=211,Dd=212,Ld=213,Id=214,Qr=0,ea=1,ta=2,Fn=3,ia=4,na=5,sa=6,ra=7,el=0,kd=1,Nd=2,ui=0,tl=1,il=2,nl=3,Ja=4,sl=5,rl=6,al=7,ol=300,on=301,On=302,ur=303,fr=304,ar=306,aa=1e3,Ti=1001,oa=1002,Dt=1003,Ud=1004,xs=1005,Ut=1006,pr=1007,nn=1008,qt=1009,cl=1010,ll=1011,os=1012,Qa=1013,mi=1014,li=1015,Ri=1016,eo=1017,to=1018,cs=1020,dl=35902,hl=35899,ul=1021,fl=1022,ni=1023,Pi=1026,sn=1027,pl=1028,io=1029,cn=1030,no=1031,so=1033,$s=33776,qs=33777,Ys=33778,Zs=33779,ca=35840,la=35841,da=35842,ha=35843,ua=36196,fa=37492,pa=37496,ma=37488,ga=37489,Js=37490,va=37491,_a=37808,xa=37809,ya=37810,Ma=37811,Sa=37812,wa=37813,ba=37814,Ea=37815,Ta=37816,Ca=37817,Aa=37818,Ra=37819,Pa=37820,Da=37821,La=36492,Ia=36494,ka=36495,Na=36283,Ua=36284,Qs=36285,Fa=36286,Fd=3200,Oa=0,Od=1,zi="",Xt="srgb",er="srgb-linear",tr="linear",ot="srgb",mn=7680,Uo=519,Bd=512,zd=513,Hd=514,ro=515,Gd=516,Vd=517,ao=518,Wd=519,Fo=35044,Oo="300 es",di=2e3,ls=2001;function Xd(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function ir(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function $d(){const s=ir("canvas");return s.style.display="block",s}const Bo={};function zo(...s){const e="THREE."+s.shift();console.log(e,...s)}function ml(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Ne(...s){s=ml(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function tt(...s){s=ml(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function Ba(...s){const e=s.join(" ");e in Bo||(Bo[e]=!0,Ne(...s))}function qd(s,e,t){return new Promise(function(i,n){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:n();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const Yd={[Qr]:ea,[ta]:sa,[ia]:ra,[Fn]:na,[ea]:Qr,[sa]:ta,[ra]:ia,[na]:Fn};class hn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const n=i[e];if(n!==void 0){const r=n.indexOf(t);r!==-1&&n.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const n=i.slice(0);for(let r=0,a=n.length;r<a;r++)n[r].call(this,e);e.target=null}}}const kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ho=1234567;const ns=Math.PI/180,ds=180/Math.PI;function un(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(kt[s&255]+kt[s>>8&255]+kt[s>>16&255]+kt[s>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[t&63|128]+kt[t>>8&255]+"-"+kt[t>>16&255]+kt[t>>24&255]+kt[i&255]+kt[i>>8&255]+kt[i>>16&255]+kt[i>>24&255]).toLowerCase()}function Ke(s,e,t){return Math.max(e,Math.min(t,s))}function oo(s,e){return(s%e+e)%e}function Zd(s,e,t,i,n){return i+(s-e)*(n-i)/(t-e)}function Kd(s,e,t){return s!==e?(t-s)/(e-s):0}function ss(s,e,t){return(1-t)*s+t*e}function jd(s,e,t,i){return ss(s,e,1-Math.exp(-t*i))}function Jd(s,e=1){return e-Math.abs(oo(s,e*2)-e)}function Qd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function eh(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function th(s,e){return s+Math.floor(Math.random()*(e-s+1))}function ih(s,e){return s+Math.random()*(e-s)}function nh(s){return s*(.5-Math.random())}function sh(s){s!==void 0&&(Ho=s);let e=Ho+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function rh(s){return s*ns}function ah(s){return s*ds}function oh(s){return(s&s-1)===0&&s!==0}function ch(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function lh(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function dh(s,e,t,i,n){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+i)/2),d=a((e+i)/2),h=r((e-i)/2),u=a((e-i)/2),f=r((i-e)/2),g=a((i-e)/2);switch(n){case"XYX":s.set(o*d,c*h,c*u,o*l);break;case"YZY":s.set(c*u,o*d,c*h,o*l);break;case"ZXZ":s.set(c*h,c*u,o*d,o*l);break;case"XZX":s.set(o*d,c*g,c*f,o*l);break;case"YXY":s.set(c*f,o*d,c*g,o*l);break;case"ZYZ":s.set(c*g,c*f,o*d,o*l);break;default:Ne("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function Dn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ot(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Go={DEG2RAD:ns,RAD2DEG:ds,generateUUID:un,clamp:Ke,euclideanModulo:oo,mapLinear:Zd,inverseLerp:Kd,lerp:ss,damp:jd,pingpong:Jd,smoothstep:Qd,smootherstep:eh,randInt:th,randFloat:ih,randFloatSpread:nh,seededRandom:sh,degToRad:rh,radToDeg:ah,isPowerOfTwo:oh,ceilPowerOfTwo:ch,floorPowerOfTwo:lh,setQuaternionFromProperEuler:dh,normalize:Ot,denormalize:Dn},xo=class xo{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),n=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*n+e.x,this.y=r*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};xo.prototype.isVector2=!0;let he=xo;class Gn{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,r,a,o){let c=i[n+0],l=i[n+1],d=i[n+2],h=i[n+3],u=r[a+0],f=r[a+1],g=r[a+2],y=r[a+3];if(h!==y||c!==u||l!==f||d!==g){let m=c*u+l*f+d*g+h*y;m<0&&(u=-u,f=-f,g=-g,y=-y,m=-m);let p=1-o;if(m<.9995){const M=Math.acos(m),b=Math.sin(M);p=Math.sin(p*M)/b,o=Math.sin(o*M)/b,c=c*p+u*o,l=l*p+f*o,d=d*p+g*o,h=h*p+y*o}else{c=c*p+u*o,l=l*p+f*o,d=d*p+g*o,h=h*p+y*o;const M=1/Math.sqrt(c*c+l*l+d*d+h*h);c*=M,l*=M,d*=M,h*=M}}e[t]=c,e[t+1]=l,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,n,r,a){const o=i[n],c=i[n+1],l=i[n+2],d=i[n+3],h=r[a],u=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+d*h+c*f-l*u,e[t+1]=c*g+d*u+l*h-o*f,e[t+2]=l*g+d*f+o*u-c*h,e[t+3]=d*g-o*h-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,n=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),d=o(n/2),h=o(r/2),u=c(i/2),f=c(n/2),g=c(r/2);switch(a){case"XYZ":this._x=u*d*h+l*f*g,this._y=l*f*h-u*d*g,this._z=l*d*g+u*f*h,this._w=l*d*h-u*f*g;break;case"YXZ":this._x=u*d*h+l*f*g,this._y=l*f*h-u*d*g,this._z=l*d*g-u*f*h,this._w=l*d*h+u*f*g;break;case"ZXY":this._x=u*d*h-l*f*g,this._y=l*f*h+u*d*g,this._z=l*d*g+u*f*h,this._w=l*d*h-u*f*g;break;case"ZYX":this._x=u*d*h-l*f*g,this._y=l*f*h+u*d*g,this._z=l*d*g-u*f*h,this._w=l*d*h+u*f*g;break;case"YZX":this._x=u*d*h+l*f*g,this._y=l*f*h+u*d*g,this._z=l*d*g-u*f*h,this._w=l*d*h-u*f*g;break;case"XZY":this._x=u*d*h-l*f*g,this._y=l*f*h-u*d*g,this._z=l*d*g+u*f*h,this._w=l*d*h+u*f*g;break;default:Ne("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],n=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],d=t[6],h=t[10],u=i+o+h;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(d-c)*f,this._y=(r-l)*f,this._z=(a-n)*f}else if(i>o&&i>h){const f=2*Math.sqrt(1+i-o-h);this._w=(d-c)/f,this._x=.25*f,this._y=(n+a)/f,this._z=(r+l)/f}else if(o>h){const f=2*Math.sqrt(1+o-i-h);this._w=(r-l)/f,this._x=(n+a)/f,this._y=.25*f,this._z=(c+d)/f}else{const f=2*Math.sqrt(1+h-i-o);this._w=(a-n)/f,this._x=(r+l)/f,this._y=(c+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,n=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,d=t._w;return this._x=i*d+a*o+n*l-r*c,this._y=n*d+a*c+r*o-i*l,this._z=r*d+a*l+i*c-n*o,this._w=a*d-i*o-n*c-r*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,n=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,n=-n,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,t=Math.sin(t*l)/d,this._x=this._x*c+i*t,this._y=this._y*c+n*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+n*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const yo=class yo{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Vo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Vo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*n,this.y=r[1]*t+r[4]*i+r[7]*n,this.z=r[2]*t+r[5]*i+r[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*n+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*n+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*n+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*n+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,n=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*n-o*i),d=2*(o*t-r*n),h=2*(r*i-a*t);return this.x=t+c*l+a*h-o*d,this.y=i+c*d+o*l-r*h,this.z=n+c*h+r*d-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*n,this.y=r[1]*t+r[5]*i+r[9]*n,this.z=r[2]*t+r[6]*i+r[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,n=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=n*c-r*o,this.y=r*a-i*c,this.z=i*o-n*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return mr.copy(this).projectOnVector(e),this.sub(mr)}reflect(e){return this.sub(mr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};yo.prototype.isVector3=!0;let C=yo;const mr=new C,Vo=new Gn,Mo=class Mo{constructor(e,t,i,n,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,c,l)}set(e,t,i,n,r,a,o,c,l){const d=this.elements;return d[0]=e,d[1]=n,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=i,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],d=i[4],h=i[7],u=i[2],f=i[5],g=i[8],y=n[0],m=n[3],p=n[6],M=n[1],b=n[4],w=n[7],D=n[2],E=n[5],P=n[8];return r[0]=a*y+o*M+c*D,r[3]=a*m+o*b+c*E,r[6]=a*p+o*w+c*P,r[1]=l*y+d*M+h*D,r[4]=l*m+d*b+h*E,r[7]=l*p+d*w+h*P,r[2]=u*y+f*M+g*D,r[5]=u*m+f*b+g*E,r[8]=u*p+f*w+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8];return t*a*d-t*o*l-i*r*d+i*o*c+n*r*l-n*a*c}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],h=d*a-o*l,u=o*c-d*r,f=l*r-a*c,g=t*h+i*u+n*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return e[0]=h*y,e[1]=(n*l-d*i)*y,e[2]=(o*i-n*a)*y,e[3]=u*y,e[4]=(d*t-n*c)*y,e[5]=(n*r-o*t)*y,e[6]=f*y,e[7]=(i*c-l*t)*y,e[8]=(a*t-i*r)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-n*l,n*c,-n*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(gr.makeScale(e,t)),this}rotate(e){return this.premultiply(gr.makeRotation(-e)),this}translate(e,t){return this.premultiply(gr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Mo.prototype.isMatrix3=!0;let Ve=Mo;const gr=new Ve,Wo=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xo=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function hh(){const s={enabled:!0,workingColorSpace:er,spaces:{},convert:function(n,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ot&&(n.r=Ai(n.r),n.g=Ai(n.g),n.b=Ai(n.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[r].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ot&&(n.r=kn(n.r),n.g=kn(n.g),n.b=kn(n.b))),n},workingToColorSpace:function(n,r){return this.convert(n,this.workingColorSpace,r)},colorSpaceToWorking:function(n,r){return this.convert(n,r,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===zi?tr:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,r=this.workingColorSpace){return n.fromArray(this.spaces[r].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,r,a){return n.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,r){return Ba("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(n,r)},toWorkingColorSpace:function(n,r){return Ba("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(n,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[er]:{primaries:e,whitePoint:i,transfer:tr,toXYZ:Wo,fromXYZ:Xo,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Xt},outputColorSpaceConfig:{drawingBufferColorSpace:Xt}},[Xt]:{primaries:e,whitePoint:i,transfer:ot,toXYZ:Wo,fromXYZ:Xo,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Xt}}}),s}const Qe=hh();function Ai(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function kn(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let gn;class uh{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{gn===void 0&&(gn=ir("canvas")),gn.width=e.width,gn.height=e.height;const n=gn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),i=gn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ir("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const n=i.getImageData(0,0,e.width,e.height),r=n.data;for(let a=0;a<r.length;a++)r[a]=Ai(r[a]/255)*255;return i.putImageData(n,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ai(t[i]/255)*255):t[i]=Ai(t[i]);return{data:t,width:e.width,height:e.height}}else return Ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let fh=0;class co{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:fh++}),this.uuid=un(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let r;if(Array.isArray(n)){r=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?r.push(vr(n[a].image)):r.push(vr(n[a]))}else r=vr(n);i.url=r}return t||(e.images[this.uuid]=i),i}}function vr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?uh.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Ne("Texture: Unable to serialize Texture."),{})}let ph=0;const _r=new C;class Ft extends hn{constructor(e=Ft.DEFAULT_IMAGE,t=Ft.DEFAULT_MAPPING,i=Ti,n=Ti,r=Ut,a=nn,o=ni,c=qt,l=Ft.DEFAULT_ANISOTROPY,d=zi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ph++}),this.uuid=un(),this.name="",this.source=new co(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new he(0,0),this.repeat=new he(1,1),this.center=new he(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(_r).x}get height(){return this.source.getSize(_r).y}get depth(){return this.source.getSize(_r).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ne(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){Ne(`Texture.setValues(): property '${t}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ol)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case aa:e.x=e.x-Math.floor(e.x);break;case Ti:e.x=e.x<0?0:1;break;case oa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case aa:e.y=e.y-Math.floor(e.y);break;case Ti:e.y=e.y<0?0:1;break;case oa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ft.DEFAULT_IMAGE=null;Ft.DEFAULT_MAPPING=ol;Ft.DEFAULT_ANISOTROPY=1;const So=class So{constructor(e=0,t=0,i=0,n=1){this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,r;const c=e.elements,l=c[0],d=c[4],h=c[8],u=c[1],f=c[5],g=c[9],y=c[2],m=c[6],p=c[10];if(Math.abs(d-u)<.01&&Math.abs(h-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+u)<.1&&Math.abs(h+y)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(l+1)/2,w=(f+1)/2,D=(p+1)/2,E=(d+u)/4,P=(h+y)/4,_=(g+m)/4;return b>w&&b>D?b<.01?(i=0,n=.707106781,r=.707106781):(i=Math.sqrt(b),n=E/i,r=P/i):w>D?w<.01?(i=.707106781,n=0,r=.707106781):(n=Math.sqrt(w),i=E/n,r=_/n):D<.01?(i=.707106781,n=.707106781,r=0):(r=Math.sqrt(D),i=P/r,n=_/r),this.set(i,n,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(h-y)*(h-y)+(u-d)*(u-d));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(h-y)/M,this.z=(u-d)/M,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};So.prototype.isVector4=!0;let xt=So;class mh extends hn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t),this.textures=[];const n={width:e,height:t,depth:i.depth},r=new Ft(n),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Ut,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,r=this.textures.length;n<r;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const n=Object.assign({},e.textures[t].image);this.textures[t].source=new co(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class fi extends mh{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class gl extends Ft{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class gh extends Ft{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const rr=class rr{constructor(e,t,i,n,r,a,o,c,l,d,h,u,f,g,y,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,c,l,d,h,u,f,g,y,m)}set(e,t,i,n,r,a,o,c,l,d,h,u,f,g,y,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=n,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=d,p[10]=h,p[14]=u,p[3]=f,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new rr().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,n=1/vn.setFromMatrixColumn(e,0).length(),r=1/vn.setFromMatrixColumn(e,1).length(),a=1/vn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,n=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(n),l=Math.sin(n),d=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const u=a*d,f=a*h,g=o*d,y=o*h;t[0]=c*d,t[4]=-c*h,t[8]=l,t[1]=f+g*l,t[5]=u-y*l,t[9]=-o*c,t[2]=y-u*l,t[6]=g+f*l,t[10]=a*c}else if(e.order==="YXZ"){const u=c*d,f=c*h,g=l*d,y=l*h;t[0]=u+y*o,t[4]=g*o-f,t[8]=a*l,t[1]=a*h,t[5]=a*d,t[9]=-o,t[2]=f*o-g,t[6]=y+u*o,t[10]=a*c}else if(e.order==="ZXY"){const u=c*d,f=c*h,g=l*d,y=l*h;t[0]=u-y*o,t[4]=-a*h,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*d,t[9]=y-u*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const u=a*d,f=a*h,g=o*d,y=o*h;t[0]=c*d,t[4]=g*l-f,t[8]=u*l+y,t[1]=c*h,t[5]=y*l+u,t[9]=f*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,f=a*l,g=o*c,y=o*l;t[0]=c*d,t[4]=y-u*h,t[8]=g*h+f,t[1]=h,t[5]=a*d,t[9]=-o*d,t[2]=-l*d,t[6]=f*h+g,t[10]=u-y*h}else if(e.order==="XZY"){const u=a*c,f=a*l,g=o*c,y=o*l;t[0]=c*d,t[4]=-h,t[8]=l*d,t[1]=u*h+y,t[5]=a*d,t[9]=f*h-g,t[2]=g*h-f,t[6]=o*d,t[10]=y*h+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(vh,e,_h)}lookAt(e,t,i){const n=this.elements;return Vt.subVectors(e,t),Vt.lengthSq()===0&&(Vt.z=1),Vt.normalize(),ki.crossVectors(i,Vt),ki.lengthSq()===0&&(Math.abs(i.z)===1?Vt.x+=1e-4:Vt.z+=1e-4,Vt.normalize(),ki.crossVectors(i,Vt)),ki.normalize(),ys.crossVectors(Vt,ki),n[0]=ki.x,n[4]=ys.x,n[8]=Vt.x,n[1]=ki.y,n[5]=ys.y,n[9]=Vt.y,n[2]=ki.z,n[6]=ys.z,n[10]=Vt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],d=i[1],h=i[5],u=i[9],f=i[13],g=i[2],y=i[6],m=i[10],p=i[14],M=i[3],b=i[7],w=i[11],D=i[15],E=n[0],P=n[4],_=n[8],T=n[12],N=n[1],R=n[5],F=n[9],X=n[13],q=n[2],k=n[6],G=n[10],B=n[14],ie=n[3],ne=n[7],me=n[11],Se=n[15];return r[0]=a*E+o*N+c*q+l*ie,r[4]=a*P+o*R+c*k+l*ne,r[8]=a*_+o*F+c*G+l*me,r[12]=a*T+o*X+c*B+l*Se,r[1]=d*E+h*N+u*q+f*ie,r[5]=d*P+h*R+u*k+f*ne,r[9]=d*_+h*F+u*G+f*me,r[13]=d*T+h*X+u*B+f*Se,r[2]=g*E+y*N+m*q+p*ie,r[6]=g*P+y*R+m*k+p*ne,r[10]=g*_+y*F+m*G+p*me,r[14]=g*T+y*X+m*B+p*Se,r[3]=M*E+b*N+w*q+D*ie,r[7]=M*P+b*R+w*k+D*ne,r[11]=M*_+b*F+w*G+D*me,r[15]=M*T+b*X+w*B+D*Se,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],n=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],d=e[2],h=e[6],u=e[10],f=e[14],g=e[3],y=e[7],m=e[11],p=e[15],M=c*f-l*u,b=o*f-l*h,w=o*u-c*h,D=a*f-l*d,E=a*u-c*d,P=a*h-o*d;return t*(y*M-m*b+p*w)-i*(g*M-m*D+p*E)+n*(g*b-y*D+p*P)-r*(g*w-y*E+m*P)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],h=e[9],u=e[10],f=e[11],g=e[12],y=e[13],m=e[14],p=e[15],M=t*o-i*a,b=t*c-n*a,w=t*l-r*a,D=i*c-n*o,E=i*l-r*o,P=n*l-r*c,_=d*y-h*g,T=d*m-u*g,N=d*p-f*g,R=h*m-u*y,F=h*p-f*y,X=u*p-f*m,q=M*X-b*F+w*R+D*N-E*T+P*_;if(q===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/q;return e[0]=(o*X-c*F+l*R)*k,e[1]=(n*F-i*X-r*R)*k,e[2]=(y*P-m*E+p*D)*k,e[3]=(u*E-h*P-f*D)*k,e[4]=(c*N-a*X-l*T)*k,e[5]=(t*X-n*N+r*T)*k,e[6]=(m*w-g*P-p*b)*k,e[7]=(d*P-u*w+f*b)*k,e[8]=(a*F-o*N+l*_)*k,e[9]=(i*N-t*F-r*_)*k,e[10]=(g*E-y*w+p*M)*k,e[11]=(h*w-d*E-f*M)*k,e[12]=(o*T-a*R-c*_)*k,e[13]=(t*R-i*T+n*_)*k,e[14]=(y*b-g*D-m*M)*k,e[15]=(d*D-h*b+u*M)*k,this}scale(e){const t=this.elements,i=e.x,n=e.y,r=e.z;return t[0]*=i,t[4]*=n,t[8]*=r,t[1]*=i,t[5]*=n,t[9]*=r,t[2]*=i,t[6]*=n,t[10]*=r,t[3]*=i,t[7]*=n,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),n=Math.sin(t),r=1-i,a=e.x,o=e.y,c=e.z,l=r*a,d=r*o;return this.set(l*a+i,l*o-n*c,l*c+n*o,0,l*o+n*c,d*o+i,d*c-n*a,0,l*c-n*o,d*c+n*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,r,a){return this.set(1,i,r,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){const n=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,d=a+a,h=o+o,u=r*l,f=r*d,g=r*h,y=a*d,m=a*h,p=o*h,M=c*l,b=c*d,w=c*h,D=i.x,E=i.y,P=i.z;return n[0]=(1-(y+p))*D,n[1]=(f+w)*D,n[2]=(g-b)*D,n[3]=0,n[4]=(f-w)*E,n[5]=(1-(u+p))*E,n[6]=(m+M)*E,n[7]=0,n[8]=(g+b)*P,n[9]=(m-M)*P,n[10]=(1-(u+y))*P,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){const n=this.elements;e.x=n[12],e.y=n[13],e.z=n[14];const r=this.determinant();if(r===0)return i.set(1,1,1),t.identity(),this;let a=vn.set(n[0],n[1],n[2]).length();const o=vn.set(n[4],n[5],n[6]).length(),c=vn.set(n[8],n[9],n[10]).length();r<0&&(a=-a),Qt.copy(this);const l=1/a,d=1/o,h=1/c;return Qt.elements[0]*=l,Qt.elements[1]*=l,Qt.elements[2]*=l,Qt.elements[4]*=d,Qt.elements[5]*=d,Qt.elements[6]*=d,Qt.elements[8]*=h,Qt.elements[9]*=h,Qt.elements[10]*=h,t.setFromRotationMatrix(Qt),i.x=a,i.y=o,i.z=c,this}makePerspective(e,t,i,n,r,a,o=di,c=!1){const l=this.elements,d=2*r/(t-e),h=2*r/(i-n),u=(t+e)/(t-e),f=(i+n)/(i-n);let g,y;if(c)g=r/(a-r),y=a*r/(a-r);else if(o===di)g=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===ls)g=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,n,r,a,o=di,c=!1){const l=this.elements,d=2/(t-e),h=2/(i-n),u=-(t+e)/(t-e),f=-(i+n)/(i-n);let g,y;if(c)g=1/(a-r),y=a/(a-r);else if(o===di)g=-2/(a-r),y=-(a+r)/(a-r);else if(o===ls)g=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=h,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};rr.prototype.isMatrix4=!0;let yt=rr;const vn=new C,Qt=new yt,vh=new C(0,0,0),_h=new C(1,1,1),ki=new C,ys=new C,Vt=new C,$o=new yt,qo=new Gn;class Wi{constructor(e=0,t=0,i=0,n=Wi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const n=e.elements,r=n[0],a=n[4],o=n[8],c=n[1],l=n[5],d=n[9],h=n[2],u=n[6],f=n[10];switch(t){case"XYZ":this._y=Math.asin(Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ke(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ke(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,f),this._y=0);break;default:Ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return $o.makeRotationFromQuaternion(e),this.setFromRotationMatrix($o,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return qo.setFromEuler(this),this.setFromQuaternion(qo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Wi.DEFAULT_ORDER="XYZ";class vl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let xh=0;const Yo=new C,_n=new Gn,xi=new yt,Ms=new C,Wn=new C,yh=new C,Mh=new Gn,Zo=new C(1,0,0),Ko=new C(0,1,0),jo=new C(0,0,1),Jo={type:"added"},Sh={type:"removed"},xn={type:"childadded",child:null},xr={type:"childremoved",child:null};class Lt extends hn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xh++}),this.uuid=un(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Lt.DEFAULT_UP.clone();const e=new C,t=new Wi,i=new Gn,n=new C(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new yt},normalMatrix:{value:new Ve}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=Lt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _n.setFromAxisAngle(e,t),this.quaternion.multiply(_n),this}rotateOnWorldAxis(e,t){return _n.setFromAxisAngle(e,t),this.quaternion.premultiply(_n),this}rotateX(e){return this.rotateOnAxis(Zo,e)}rotateY(e){return this.rotateOnAxis(Ko,e)}rotateZ(e){return this.rotateOnAxis(jo,e)}translateOnAxis(e,t){return Yo.copy(e).applyQuaternion(this.quaternion),this.position.add(Yo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zo,e)}translateY(e){return this.translateOnAxis(Ko,e)}translateZ(e){return this.translateOnAxis(jo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ms.copy(e):Ms.set(e,t,i);const n=this.parent;this.updateWorldMatrix(!0,!1),Wn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xi.lookAt(Wn,Ms,this.up):xi.lookAt(Ms,Wn,this.up),this.quaternion.setFromRotationMatrix(xi),n&&(xi.extractRotation(n.matrixWorld),_n.setFromRotationMatrix(xi),this.quaternion.premultiply(_n.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(tt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Jo),xn.child=e,this.dispatchEvent(xn),xn.child=null):tt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Sh),xr.child=e,this.dispatchEvent(xr),xr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xi.multiply(e.parent.matrixWorld)),e.applyMatrix4(xi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Jo),xn.child=e,this.dispatchEvent(xn),xn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wn,e,yh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wn,Mh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,n=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*n,r[13]+=i-r[1]*t-r[5]*i-r[9]*n,r[14]+=n-r[2]*t-r[6]*i-r[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),this.static!==!1&&(n.static=this.static),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(e),n.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));n.material=o}else n.material=r(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];n.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),d=a(e.images),h=a(e.shapes),u=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),h.length>0&&(i.shapes=h),u.length>0&&(i.skeletons=u),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=n,i;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const n=e.children[i];this.add(n.clone())}return this}}Lt.DEFAULT_UP=new C(0,1,0);Lt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class ft extends Lt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const wh={type:"move"};class yr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ft,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ft,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ft,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const y of e.hand.values()){const m=t.getJointPose(y,i),p=this._getHandJoint(l,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],u=d.position.distanceTo(h.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&r!==null&&(n=r),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(wh)))}return o!==null&&(o.visible=n!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ft;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const _l={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ni={h:0,s:0,l:0},Ss={h:0,s:0,l:0};function Mr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class et{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.colorSpaceToWorking(this,t),this}setRGB(e,t,i,n=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Qe.colorSpaceToWorking(this,n),this}setHSL(e,t,i,n=Qe.workingColorSpace){if(e=oo(e,1),t=Ke(t,0,1),i=Ke(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Mr(a,r,e+1/3),this.g=Mr(a,r,e),this.b=Mr(a,r,e-1/3)}return Qe.colorSpaceToWorking(this,n),this}setStyle(e,t=Xt){function i(r){r!==void 0&&parseFloat(r)<1&&Ne("Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ne("Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=n[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ne("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Xt){const i=_l[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ne("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ai(e.r),this.g=Ai(e.g),this.b=Ai(e.b),this}copyLinearToSRGB(e){return this.r=kn(e.r),this.g=kn(e.g),this.b=kn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Xt){return Qe.workingToColorSpace(Nt.copy(this),e),Math.round(Ke(Nt.r*255,0,255))*65536+Math.round(Ke(Nt.g*255,0,255))*256+Math.round(Ke(Nt.b*255,0,255))}getHexString(e=Xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.workingToColorSpace(Nt.copy(this),t);const i=Nt.r,n=Nt.g,r=Nt.b,a=Math.max(i,n,r),o=Math.min(i,n,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const h=a-o;switch(l=d<=.5?h/(a+o):h/(2-a-o),a){case i:c=(n-r)/h+(n<r?6:0);break;case n:c=(r-i)/h+2;break;case r:c=(i-n)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=d,e}getRGB(e,t=Qe.workingColorSpace){return Qe.workingToColorSpace(Nt.copy(this),t),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=Xt){Qe.workingToColorSpace(Nt.copy(this),e);const t=Nt.r,i=Nt.g,n=Nt.b;return e!==Xt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(e,t,i){return this.getHSL(Ni),this.setHSL(Ni.h+e,Ni.s+t,Ni.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ni),e.getHSL(Ss);const i=ss(Ni.h,Ss.h,t),n=ss(Ni.s,Ss.s,t),r=ss(Ni.l,Ss.l,t);return this.setHSL(i,n,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,n=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*n,this.g=r[1]*t+r[4]*i+r[7]*n,this.b=r[2]*t+r[5]*i+r[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nt=new et;et.NAMES=_l;class lo{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new et(e),this.near=t,this.far=i}clone(){return new lo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class xl extends Lt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Wi,this.environmentIntensity=1,this.environmentRotation=new Wi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const ei=new C,yi=new C,Sr=new C,Mi=new C,yn=new C,Mn=new C,Qo=new C,wr=new C,br=new C,Er=new C,Tr=new xt,Cr=new xt,Ar=new xt;class ii{constructor(e=new C,t=new C,i=new C){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),ei.subVectors(e,t),n.cross(ei);const r=n.lengthSq();return r>0?n.multiplyScalar(1/Math.sqrt(r)):n.set(0,0,0)}static getBarycoord(e,t,i,n,r){ei.subVectors(n,t),yi.subVectors(i,t),Sr.subVectors(e,t);const a=ei.dot(ei),o=ei.dot(yi),c=ei.dot(Sr),l=yi.dot(yi),d=yi.dot(Sr),h=a*l-o*o;if(h===0)return r.set(0,0,0),null;const u=1/h,f=(l*c-o*d)*u,g=(a*d-o*c)*u;return r.set(1-f-g,g,f)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,Mi)===null?!1:Mi.x>=0&&Mi.y>=0&&Mi.x+Mi.y<=1}static getInterpolation(e,t,i,n,r,a,o,c){return this.getBarycoord(e,t,i,n,Mi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Mi.x),c.addScaledVector(a,Mi.y),c.addScaledVector(o,Mi.z),c)}static getInterpolatedAttribute(e,t,i,n,r,a){return Tr.setScalar(0),Cr.setScalar(0),Ar.setScalar(0),Tr.fromBufferAttribute(e,t),Cr.fromBufferAttribute(e,i),Ar.fromBufferAttribute(e,n),a.setScalar(0),a.addScaledVector(Tr,r.x),a.addScaledVector(Cr,r.y),a.addScaledVector(Ar,r.z),a}static isFrontFacing(e,t,i,n){return ei.subVectors(i,t),yi.subVectors(e,t),ei.cross(yi).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ei.subVectors(this.c,this.b),yi.subVectors(this.a,this.b),ei.cross(yi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ii.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ii.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,r){return ii.getInterpolation(e,this.a,this.b,this.c,t,i,n,r)}containsPoint(e){return ii.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ii.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,n=this.b,r=this.c;let a,o;yn.subVectors(n,i),Mn.subVectors(r,i),wr.subVectors(e,i);const c=yn.dot(wr),l=Mn.dot(wr);if(c<=0&&l<=0)return t.copy(i);br.subVectors(e,n);const d=yn.dot(br),h=Mn.dot(br);if(d>=0&&h<=d)return t.copy(n);const u=c*h-d*l;if(u<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(i).addScaledVector(yn,a);Er.subVectors(e,r);const f=yn.dot(Er),g=Mn.dot(Er);if(g>=0&&f<=g)return t.copy(r);const y=f*l-c*g;if(y<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(i).addScaledVector(Mn,o);const m=d*g-f*h;if(m<=0&&h-d>=0&&f-g>=0)return Qo.subVectors(r,n),o=(h-d)/(h-d+(f-g)),t.copy(n).addScaledVector(Qo,o);const p=1/(m+y+u);return a=y*p,o=u*p,t.copy(i).addScaledVector(yn,a).addScaledVector(Mn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class ms{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ti.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ti.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ti.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ti):ti.fromBufferAttribute(r,a),ti.applyMatrix4(e.matrixWorld),this.expandByPoint(ti);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ws.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ws.copy(i.boundingBox)),ws.applyMatrix4(e.matrixWorld),this.union(ws)}const n=e.children;for(let r=0,a=n.length;r<a;r++)this.expandByObject(n[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ti),ti.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Xn),bs.subVectors(this.max,Xn),Sn.subVectors(e.a,Xn),wn.subVectors(e.b,Xn),bn.subVectors(e.c,Xn),Ui.subVectors(wn,Sn),Fi.subVectors(bn,wn),$i.subVectors(Sn,bn);let t=[0,-Ui.z,Ui.y,0,-Fi.z,Fi.y,0,-$i.z,$i.y,Ui.z,0,-Ui.x,Fi.z,0,-Fi.x,$i.z,0,-$i.x,-Ui.y,Ui.x,0,-Fi.y,Fi.x,0,-$i.y,$i.x,0];return!Rr(t,Sn,wn,bn,bs)||(t=[1,0,0,0,1,0,0,0,1],!Rr(t,Sn,wn,bn,bs))?!1:(Es.crossVectors(Ui,Fi),t=[Es.x,Es.y,Es.z],Rr(t,Sn,wn,bn,bs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ti).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ti).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Si[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Si[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Si[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Si[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Si[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Si[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Si[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Si[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Si),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Si=[new C,new C,new C,new C,new C,new C,new C,new C],ti=new C,ws=new ms,Sn=new C,wn=new C,bn=new C,Ui=new C,Fi=new C,$i=new C,Xn=new C,bs=new C,Es=new C,qi=new C;function Rr(s,e,t,i,n){for(let r=0,a=s.length-3;r<=a;r+=3){qi.fromArray(s,r);const o=n.x*Math.abs(qi.x)+n.y*Math.abs(qi.y)+n.z*Math.abs(qi.z),c=e.dot(qi),l=t.dot(qi),d=i.dot(qi);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const bt=new C,Ts=new he;let bh=0;class pi extends hn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:bh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Fo,this.updateRanges=[],this.gpuType=li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,r=this.itemSize;n<r;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ts.fromBufferAttribute(this,t),Ts.applyMatrix3(e),this.setXY(t,Ts.x,Ts.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Dn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ot(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Dn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Dn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Dn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Dn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array),n=Ot(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,r){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array),n=Ot(n,this.array),r=Ot(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Fo&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class yl extends pi{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Ml extends pi{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class gt extends pi{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Eh=new ms,$n=new C,Pr=new C;class ho{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Eh.setFromPoints(e).getCenter(i);let n=0;for(let r=0,a=e.length;r<a;r++)n=Math.max(n,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;$n.subVectors(e,this.center);const t=$n.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),n=(i-this.radius)*.5;this.center.addScaledVector($n,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Pr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint($n.copy(e.center).add(Pr)),this.expandByPoint($n.copy(e.center).sub(Pr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Th=0;const Kt=new yt,Dr=new Lt,En=new C,Wt=new ms,qn=new ms,At=new C;class Ht extends hn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Th++}),this.uuid=un(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Xd(e)?Ml:yl)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Ve().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Kt.makeRotationFromQuaternion(e),this.applyMatrix4(Kt),this}rotateX(e){return Kt.makeRotationX(e),this.applyMatrix4(Kt),this}rotateY(e){return Kt.makeRotationY(e),this.applyMatrix4(Kt),this}rotateZ(e){return Kt.makeRotationZ(e),this.applyMatrix4(Kt),this}translate(e,t,i){return Kt.makeTranslation(e,t,i),this.applyMatrix4(Kt),this}scale(e,t,i){return Kt.makeScale(e,t,i),this.applyMatrix4(Kt),this}lookAt(e){return Dr.lookAt(e),Dr.updateMatrix(),this.applyMatrix4(Dr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(En).negate(),this.translate(En.x,En.y,En.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let n=0,r=e.length;n<r;n++){const a=e[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new gt(i,3))}else{const i=Math.min(e.length,t.count);for(let n=0;n<i;n++){const r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&Ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ms);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){tt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){const r=t[i];Wt.setFromBufferAttribute(r),this.morphTargetsRelative?(At.addVectors(this.boundingBox.min,Wt.min),this.boundingBox.expandByPoint(At),At.addVectors(this.boundingBox.max,Wt.max),this.boundingBox.expandByPoint(At)):(this.boundingBox.expandByPoint(Wt.min),this.boundingBox.expandByPoint(Wt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&tt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ho);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){tt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){const i=this.boundingSphere.center;if(Wt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];qn.setFromBufferAttribute(o),this.morphTargetsRelative?(At.addVectors(Wt.min,qn.min),Wt.expandByPoint(At),At.addVectors(Wt.max,qn.max),Wt.expandByPoint(At)):(Wt.expandByPoint(qn.min),Wt.expandByPoint(qn.max))}Wt.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)At.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(At));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)At.fromBufferAttribute(o,l),c&&(En.fromBufferAttribute(e,l),At.add(En)),n=Math.max(n,i.distanceToSquared(At))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&tt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){tt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,n=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pi(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let _=0;_<i.count;_++)o[_]=new C,c[_]=new C;const l=new C,d=new C,h=new C,u=new he,f=new he,g=new he,y=new C,m=new C;function p(_,T,N){l.fromBufferAttribute(i,_),d.fromBufferAttribute(i,T),h.fromBufferAttribute(i,N),u.fromBufferAttribute(r,_),f.fromBufferAttribute(r,T),g.fromBufferAttribute(r,N),d.sub(l),h.sub(l),f.sub(u),g.sub(u);const R=1/(f.x*g.y-g.x*f.y);isFinite(R)&&(y.copy(d).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(R),m.copy(h).multiplyScalar(f.x).addScaledVector(d,-g.x).multiplyScalar(R),o[_].add(y),o[T].add(y),o[N].add(y),c[_].add(m),c[T].add(m),c[N].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let _=0,T=M.length;_<T;++_){const N=M[_],R=N.start,F=N.count;for(let X=R,q=R+F;X<q;X+=3)p(e.getX(X+0),e.getX(X+1),e.getX(X+2))}const b=new C,w=new C,D=new C,E=new C;function P(_){D.fromBufferAttribute(n,_),E.copy(D);const T=o[_];b.copy(T),b.sub(D.multiplyScalar(D.dot(T))).normalize(),w.crossVectors(E,T);const R=w.dot(c[_])<0?-1:1;a.setXYZW(_,b.x,b.y,b.z,R)}for(let _=0,T=M.length;_<T;++_){const N=M[_],R=N.start,F=N.count;for(let X=R,q=R+F;X<q;X+=3)P(e.getX(X+0)),P(e.getX(X+1)),P(e.getX(X+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new pi(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,f=i.count;u<f;u++)i.setXYZ(u,0,0,0);const n=new C,r=new C,a=new C,o=new C,c=new C,l=new C,d=new C,h=new C;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),y=e.getX(u+1),m=e.getX(u+2);n.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,m),d.subVectors(a,r),h.subVectors(n,r),d.cross(h),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,y),l.fromBufferAttribute(i,m),o.add(d),c.add(d),l.add(d),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(y,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)n.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),d.subVectors(a,r),h.subVectors(n,r),d.cross(h),i.setXYZ(u+0,d.x,d.y,d.z),i.setXYZ(u+1,d.x,d.y,d.z),i.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)At.fromBufferAttribute(e,t),At.normalize(),e.setXYZ(t,At.x,At.y,At.z)}toNonIndexed(){function e(o,c){const l=o.array,d=o.itemSize,h=o.normalized,u=new l.constructor(c.length*d);let f=0,g=0;for(let y=0,m=c.length;y<m;y++){o.isInterleavedBufferAttribute?f=c[y]*o.data.stride+o.offset:f=c[y]*d;for(let p=0;p<d;p++)u[g++]=l[f++]}return new pi(u,d,h)}if(this.index===null)return Ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ht,i=this.index.array,n=this.attributes;for(const o in n){const c=n[o],l=e(c,i);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,h=l.length;d<h;d++){const u=l[d],f=e(u,i);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const n={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let h=0,u=l.length;h<u;h++){const f=l[h];d.push(f.toJSON(e.data))}d.length>0&&(n[c]=d,r=!0)}r&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const n=e.attributes;for(const l in n){const d=n[l];this.setAttribute(l,d.clone(t))}const r=e.morphAttributes;for(const l in r){const d=[],h=r[l];for(let u=0,f=h.length;u<f;u++)d.push(h[u].clone(t));this.morphAttributes[l]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,d=a.length;l<d;l++){const h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Ch=0;class gs extends hn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ch++}),this.uuid=un(),this.name="",this.type="Material",this.blending=In,this.side=Vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=jr,this.blendDst=Jr,this.blendEquation=Qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new et(0,0,0),this.blendAlpha=0,this.depthFunc=Fn,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Uo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mn,this.stencilZFail=mn,this.stencilZPass=mn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ne(`Material: parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){Ne(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==In&&(i.blending=this.blending),this.side!==Vi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==jr&&(i.blendSrc=this.blendSrc),this.blendDst!==Jr&&(i.blendDst=this.blendDst),this.blendEquation!==Qi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Fn&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Uo&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==mn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==mn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==mn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=n(e.textures),a=n(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const n=t.length;i=new Array(n);for(let r=0;r!==n;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const wi=new C,Lr=new C,Cs=new C,Oi=new C,Ir=new C,As=new C,kr=new C;class Ah{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,wi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=wi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(wi.copy(this.origin).addScaledVector(this.direction,t),wi.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){Lr.copy(e).add(t).multiplyScalar(.5),Cs.copy(t).sub(e).normalize(),Oi.copy(this.origin).sub(Lr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Cs),o=Oi.dot(this.direction),c=-Oi.dot(Cs),l=Oi.lengthSq(),d=Math.abs(1-a*a);let h,u,f,g;if(d>0)if(h=a*c-o,u=a*o-c,g=r*d,h>=0)if(u>=-g)if(u<=g){const y=1/d;h*=y,u*=y,f=h*(h+a*u+2*o)+u*(a*h+u+2*c)+l}else u=r,h=Math.max(0,-(a*u+o)),f=-h*h+u*(u+2*c)+l;else u=-r,h=Math.max(0,-(a*u+o)),f=-h*h+u*(u+2*c)+l;else u<=-g?(h=Math.max(0,-(-a*r+o)),u=h>0?-r:Math.min(Math.max(-r,-c),r),f=-h*h+u*(u+2*c)+l):u<=g?(h=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+l):(h=Math.max(0,-(a*r+o)),u=h>0?r:Math.min(Math.max(-r,-c),r),f=-h*h+u*(u+2*c)+l);else u=a>0?-r:r,h=Math.max(0,-(a*u+o)),f=-h*h+u*(u+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),n&&n.copy(Lr).addScaledVector(Cs,u),f}intersectSphere(e,t){wi.subVectors(e.center,this.origin);const i=wi.dot(this.direction),n=wi.dot(wi)-i*i,r=e.radius*e.radius;if(n>r)return null;const a=Math.sqrt(r-n),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,u=this.origin;return l>=0?(i=(e.min.x-u.x)*l,n=(e.max.x-u.x)*l):(i=(e.max.x-u.x)*l,n=(e.min.x-u.x)*l),d>=0?(r=(e.min.y-u.y)*d,a=(e.max.y-u.y)*d):(r=(e.max.y-u.y)*d,a=(e.min.y-u.y)*d),i>a||r>n||((r>i||isNaN(i))&&(i=r),(a<n||isNaN(n))&&(n=a),h>=0?(o=(e.min.z-u.z)*h,c=(e.max.z-u.z)*h):(o=(e.max.z-u.z)*h,c=(e.min.z-u.z)*h),i>c||o>n)||((o>i||i!==i)&&(i=o),(c<n||n!==n)&&(n=c),n<0)?null:this.at(i>=0?i:n,t)}intersectsBox(e){return this.intersectBox(e,wi)!==null}intersectTriangle(e,t,i,n,r){Ir.subVectors(t,e),As.subVectors(i,e),kr.crossVectors(Ir,As);let a=this.direction.dot(kr),o;if(a>0){if(n)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Oi.subVectors(this.origin,e);const c=o*this.direction.dot(As.crossVectors(Oi,As));if(c<0)return null;const l=o*this.direction.dot(Ir.cross(Oi));if(l<0||c+l>a)return null;const d=-o*Oi.dot(kr);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Et extends gs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wi,this.combine=el,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ec=new yt,Yi=new Ah,Rs=new ho,tc=new C,Ps=new C,Ds=new C,Ls=new C,Nr=new C,Is=new C,ic=new C,ks=new C;class L extends Lt{constructor(e=new Ht,t=new Et){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,n=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);const o=this.morphTargetInfluences;if(r&&o){Is.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],h=r[c];d!==0&&(Nr.fromBufferAttribute(h,e),a?Is.addScaledVector(Nr,d):Is.addScaledVector(Nr.sub(t),d))}t.add(Is)}return t}raycast(e,t){const i=this.geometry,n=this.material,r=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Rs.copy(i.boundingSphere),Rs.applyMatrix4(r),Yi.copy(e.ray).recast(e.near),!(Rs.containsPoint(Yi.origin)===!1&&(Yi.intersectSphere(Rs,tc)===null||Yi.origin.distanceToSquared(tc)>(e.far-e.near)**2))&&(ec.copy(r).invert(),Yi.copy(e.ray).applyMatrix4(ec),!(i.boundingBox!==null&&Yi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Yi)))}_computeIntersections(e,t,i){let n;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,h=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,y=u.length;g<y;g++){const m=u[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),b=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let w=M,D=b;w<D;w+=3){const E=o.getX(w),P=o.getX(w+1),_=o.getX(w+2);n=Ns(this,p,e,i,l,d,h,E,P,_),n&&(n.faceIndex=Math.floor(w/3),n.face.materialIndex=m.materialIndex,t.push(n))}}else{const g=Math.max(0,f.start),y=Math.min(o.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){const M=o.getX(m),b=o.getX(m+1),w=o.getX(m+2);n=Ns(this,a,e,i,l,d,h,M,b,w),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,y=u.length;g<y;g++){const m=u[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),b=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let w=M,D=b;w<D;w+=3){const E=w,P=w+1,_=w+2;n=Ns(this,p,e,i,l,d,h,E,P,_),n&&(n.faceIndex=Math.floor(w/3),n.face.materialIndex=m.materialIndex,t.push(n))}}else{const g=Math.max(0,f.start),y=Math.min(c.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){const M=m,b=m+1,w=m+2;n=Ns(this,a,e,i,l,d,h,M,b,w),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}}}}function Rh(s,e,t,i,n,r,a,o){let c;if(e.side===zt?c=i.intersectTriangle(a,r,n,!0,o):c=i.intersectTriangle(n,r,a,e.side===Vi,o),c===null)return null;ks.copy(o),ks.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(ks);return l<t.near||l>t.far?null:{distance:l,point:ks.clone(),object:s}}function Ns(s,e,t,i,n,r,a,o,c,l){s.getVertexPosition(o,Ps),s.getVertexPosition(c,Ds),s.getVertexPosition(l,Ls);const d=Rh(s,e,t,i,Ps,Ds,Ls,ic);if(d){const h=new C;ii.getBarycoord(ic,Ps,Ds,Ls,h),n&&(d.uv=ii.getInterpolatedAttribute(n,o,c,l,h,new he)),r&&(d.uv1=ii.getInterpolatedAttribute(r,o,c,l,h,new he)),a&&(d.normal=ii.getInterpolatedAttribute(a,o,c,l,h,new C),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new C,materialIndex:0};ii.getNormal(Ps,Ds,Ls,u.normal),d.face=u,d.barycoord=h}return d}class Ph extends Ft{constructor(e=null,t=1,i=1,n,r,a,o,c,l=Dt,d=Dt,h,u){super(null,a,o,c,l,d,n,r,h,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ur=new C,Dh=new C,Lh=new Ve;class ji{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const n=Ur.subVectors(i,t).cross(Dh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const n=e.delta(Ur),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Lh.getNormalMatrix(e),n=this.coplanarPoint(Ur).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Zi=new ho,Ih=new he(.5,.5),Us=new C;class uo{constructor(e=new ji,t=new ji,i=new ji,n=new ji,r=new ji,a=new ji){this.planes=[e,t,i,n,r,a]}set(e,t,i,n,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=di,i=!1){const n=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],h=r[5],u=r[6],f=r[7],g=r[8],y=r[9],m=r[10],p=r[11],M=r[12],b=r[13],w=r[14],D=r[15];if(n[0].setComponents(l-a,f-d,p-g,D-M).normalize(),n[1].setComponents(l+a,f+d,p+g,D+M).normalize(),n[2].setComponents(l+o,f+h,p+y,D+b).normalize(),n[3].setComponents(l-o,f-h,p-y,D-b).normalize(),i)n[4].setComponents(c,u,m,w).normalize(),n[5].setComponents(l-c,f-u,p-m,D-w).normalize();else if(n[4].setComponents(l-c,f-u,p-m,D-w).normalize(),t===di)n[5].setComponents(l+c,f+u,p+m,D+w).normalize();else if(t===ls)n[5].setComponents(c,u,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zi)}intersectsSprite(e){Zi.center.set(0,0,0);const t=Ih.distanceTo(e.center);return Zi.radius=.7071067811865476+t,Zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zi)}intersectsSphere(e){const t=this.planes,i=e.center,n=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const n=t[i];if(Us.x=n.normal.x>0?e.max.x:e.min.x,Us.y=n.normal.y>0?e.max.y:e.min.y,Us.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(Us)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Sl extends Ft{constructor(e=[],t=on,i,n,r,a,o,c,l,d){super(e,t,i,n,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class wl extends Ft{constructor(e,t,i,n,r,a,o,c,l){super(e,t,i,n,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Bn extends Ft{constructor(e,t,i=mi,n,r,a,o=Dt,c=Dt,l,d=Pi,h=1){if(d!==Pi&&d!==sn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:h};super(u,n,r,a,o,c,d,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new co(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class kh extends Bn{constructor(e,t=mi,i=on,n,r,a=Dt,o=Dt,c,l=Pi){const d={width:e,height:e,depth:1},h=[d,d,d,d,d,d];super(e,e,t,i,n,r,a,o,c,l),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class bl extends Ft{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class W extends Ht{constructor(e=1,t=1,i=1,n=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:r,depthSegments:a};const o=this;n=Math.floor(n),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],h=[];let u=0,f=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,n,a,2),g("x","z","y",1,-1,e,i,-t,n,a,3),g("x","y","z",1,-1,e,t,i,n,r,4),g("x","y","z",-1,-1,e,t,-i,n,r,5),this.setIndex(c),this.setAttribute("position",new gt(l,3)),this.setAttribute("normal",new gt(d,3)),this.setAttribute("uv",new gt(h,2));function g(y,m,p,M,b,w,D,E,P,_,T){const N=w/P,R=D/_,F=w/2,X=D/2,q=E/2,k=P+1,G=_+1;let B=0,ie=0;const ne=new C;for(let me=0;me<G;me++){const Se=me*R-X;for(let Ce=0;Ce<k;Ce++){const $e=Ce*N-F;ne[y]=$e*M,ne[m]=Se*b,ne[p]=q,l.push(ne.x,ne.y,ne.z),ne[y]=0,ne[m]=0,ne[p]=E>0?1:-1,d.push(ne.x,ne.y,ne.z),h.push(Ce/P),h.push(1-me/_),B+=1}}for(let me=0;me<_;me++)for(let Se=0;Se<P;Se++){const Ce=u+Se+k*me,$e=u+Se+k*(me+1),it=u+(Se+1)+k*(me+1),ze=u+(Se+1)+k*me;c.push(Ce,$e,ze),c.push($e,it,ze),ie+=6}o.addGroup(f,ie,T),f+=ie,u+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new W(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class or extends Ht{constructor(e=1,t=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:n},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new C,d=new he;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let h=0,u=3;h<=t;h++,u+=3){const f=i+h/t*n;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),d.x=(a[u]/e+1)/2,d.y=(a[u+1]/e+1)/2,c.push(d.x,d.y)}for(let h=1;h<=t;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new gt(a,3)),this.setAttribute("normal",new gt(o,3)),this.setAttribute("uv",new gt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new or(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class mt extends Ht{constructor(e=1,t=1,i=1,n=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;n=Math.floor(n),r=Math.floor(r);const d=[],h=[],u=[],f=[];let g=0;const y=[],m=i/2;let p=0;M(),a===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(d),this.setAttribute("position",new gt(h,3)),this.setAttribute("normal",new gt(u,3)),this.setAttribute("uv",new gt(f,2));function M(){const w=new C,D=new C;let E=0;const P=(t-e)/i;for(let _=0;_<=r;_++){const T=[],N=_/r,R=N*(t-e)+e;for(let F=0;F<=n;F++){const X=F/n,q=X*c+o,k=Math.sin(q),G=Math.cos(q);D.x=R*k,D.y=-N*i+m,D.z=R*G,h.push(D.x,D.y,D.z),w.set(k,P,G).normalize(),u.push(w.x,w.y,w.z),f.push(X,1-N),T.push(g++)}y.push(T)}for(let _=0;_<n;_++)for(let T=0;T<r;T++){const N=y[T][_],R=y[T+1][_],F=y[T+1][_+1],X=y[T][_+1];(e>0||T!==0)&&(d.push(N,R,X),E+=3),(t>0||T!==r-1)&&(d.push(R,F,X),E+=3)}l.addGroup(p,E,0),p+=E}function b(w){const D=g,E=new he,P=new C;let _=0;const T=w===!0?e:t,N=w===!0?1:-1;for(let F=1;F<=n;F++)h.push(0,m*N,0),u.push(0,N,0),f.push(.5,.5),g++;const R=g;for(let F=0;F<=n;F++){const q=F/n*c+o,k=Math.cos(q),G=Math.sin(q);P.x=T*G,P.y=m*N,P.z=T*k,h.push(P.x,P.y,P.z),u.push(0,N,0),E.x=k*.5+.5,E.y=G*.5*N+.5,f.push(E.x,E.y),g++}for(let F=0;F<n;F++){const X=D+F,q=R+F;w===!0?d.push(q,q+1,X):d.push(q+1,q,X),_+=3}l.addGroup(p,_,w===!0?1:2),p+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class hs extends mt{constructor(e=1,t=1,i=32,n=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,i,n,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:n,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new hs(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class vi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ne("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,n=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(n),t.push(r),n=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let n=0;const r=i.length;let a;t?a=t:a=e*i[r-1];let o=0,c=r-1,l;for(;o<=c;)if(n=Math.floor(o+(c-o)/2),l=i[n]-a,l<0)o=n+1;else if(l>0)c=n-1;else{c=n;break}if(n=c,i[n]===a)return n/(r-1);const d=i[n],u=i[n+1]-d,f=(a-d)/u;return(n+f)/(r-1)}getTangent(e,t){let n=e-1e-4,r=e+1e-4;n<0&&(n=0),r>1&&(r=1);const a=this.getPoint(n),o=this.getPoint(r),c=t||(a.isVector2?new he:new C);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new C,n=[],r=[],a=[],o=new C,c=new yt;for(let f=0;f<=e;f++){const g=f/e;n[f]=this.getTangentAt(g,new C)}r[0]=new C,a[0]=new C;let l=Number.MAX_VALUE;const d=Math.abs(n[0].x),h=Math.abs(n[0].y),u=Math.abs(n[0].z);d<=l&&(l=d,i.set(1,0,0)),h<=l&&(l=h,i.set(0,1,0)),u<=l&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),r[0].crossVectors(n[0],o),a[0].crossVectors(n[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(n[f-1],n[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Ke(n[f-1].dot(n[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(n[f],r[f])}if(t===!0){let f=Math.acos(Ke(r[0].dot(r[e]),-1,1));f/=e,n[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(n[g],f*g)),a[g].crossVectors(n[g],r[g])}return{tangents:n,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class fo extends vi{constructor(e=0,t=0,i=1,n=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=n,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new he){const i=t,n=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=n;for(;r>n;)r-=n;r<Number.EPSILON&&(a?r=0:r=n),this.aClockwise===!0&&!a&&(r===n?r=-n:r=r-n);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),h=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*d-f*h+this.aX,l=u*h+f*d+this.aY}return i.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Nh extends fo{constructor(e,t,i,n,r,a){super(e,t,i,i,n,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function po(){let s=0,e=0,t=0,i=0;function n(r,a,o,c){s=r,e=o,t=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){n(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,h){let u=(a-r)/l-(o-r)/(l+d)+(o-a)/d,f=(o-a)/d-(c-a)/(d+h)+(c-o)/h;u*=d,f*=d,n(a,o,u,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+i*o}}}const nc=new C,sc=new C,Fr=new po,Or=new po,Br=new po;class El extends vi{constructor(e=[],t=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=n}getPoint(e,t=new C){const i=t,n=this.points,r=n.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=n[(o-1)%r]:(sc.subVectors(n[0],n[1]).add(n[0]),l=sc);const h=n[o%r],u=n[(o+1)%r];if(this.closed||o+2<r?d=n[(o+2)%r]:(nc.subVectors(n[r-1],n[r-2]).add(n[r-1]),d=nc),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(h),f),y=Math.pow(h.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(d),f);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),Fr.initNonuniformCatmullRom(l.x,h.x,u.x,d.x,g,y,m),Or.initNonuniformCatmullRom(l.y,h.y,u.y,d.y,g,y,m),Br.initNonuniformCatmullRom(l.z,h.z,u.z,d.z,g,y,m)}else this.curveType==="catmullrom"&&(Fr.initCatmullRom(l.x,h.x,u.x,d.x,this.tension),Or.initCatmullRom(l.y,h.y,u.y,d.y,this.tension),Br.initCatmullRom(l.z,h.z,u.z,d.z,this.tension));return i.set(Fr.calc(c),Or.calc(c),Br.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(new C().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function rc(s,e,t,i,n){const r=(i-e)*.5,a=(n-t)*.5,o=s*s,c=s*o;return(2*t-2*i+r+a)*c+(-3*t+3*i-2*r-a)*o+r*s+t}function Uh(s,e){const t=1-s;return t*t*e}function Fh(s,e){return 2*(1-s)*s*e}function Oh(s,e){return s*s*e}function rs(s,e,t,i){return Uh(s,e)+Fh(s,t)+Oh(s,i)}function Bh(s,e){const t=1-s;return t*t*t*e}function zh(s,e){const t=1-s;return 3*t*t*s*e}function Hh(s,e){return 3*(1-s)*s*s*e}function Gh(s,e){return s*s*s*e}function as(s,e,t,i,n){return Bh(s,e)+zh(s,t)+Hh(s,i)+Gh(s,n)}class Tl extends vi{constructor(e=new he,t=new he,i=new he,n=new he){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new he){const i=t,n=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(as(e,n.x,r.x,a.x,o.x),as(e,n.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Vh extends vi{constructor(e=new C,t=new C,i=new C,n=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new C){const i=t,n=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(as(e,n.x,r.x,a.x,o.x),as(e,n.y,r.y,a.y,o.y),as(e,n.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Cl extends vi{constructor(e=new he,t=new he){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new he){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new he){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Wh extends vi{constructor(e=new C,t=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new C){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new C){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Al extends vi{constructor(e=new he,t=new he,i=new he){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new he){const i=t,n=this.v0,r=this.v1,a=this.v2;return i.set(rs(e,n.x,r.x,a.x),rs(e,n.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Xh extends vi{constructor(e=new C,t=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new C){const i=t,n=this.v0,r=this.v1,a=this.v2;return i.set(rs(e,n.x,r.x,a.x),rs(e,n.y,r.y,a.y),rs(e,n.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Rl extends vi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new he){const i=t,n=this.points,r=(n.length-1)*e,a=Math.floor(r),o=r-a,c=n[a===0?a:a-1],l=n[a],d=n[a>n.length-2?n.length-1:a+1],h=n[a>n.length-3?n.length-1:a+2];return i.set(rc(o,c.x,l.x,d.x,h.x),rc(o,c.y,l.y,d.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(n.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(new he().fromArray(n))}return this}}var za=Object.freeze({__proto__:null,ArcCurve:Nh,CatmullRomCurve3:El,CubicBezierCurve:Tl,CubicBezierCurve3:Vh,EllipseCurve:fo,LineCurve:Cl,LineCurve3:Wh,QuadraticBezierCurve:Al,QuadraticBezierCurve3:Xh,SplineCurve:Rl});class $h extends vi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new za[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),n=this.getCurveLengths();let r=0;for(;r<n.length;){if(n[r]>=i){const a=n[r]-i,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,n=this.curves.length;i<n;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let n=0,r=this.curves;n<r.length;n++){const a=r[n],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const d=c[l];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const n=e.curves[t];this.curves.push(new za[n.type]().fromJSON(n))}return this}}class ac extends $h{constructor(e){super(),this.type="Path",this.currentPoint=new he,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Cl(this.currentPoint.clone(),new he(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,n){const r=new Al(this.currentPoint.clone(),new he(e,t),new he(i,n));return this.curves.push(r),this.currentPoint.set(i,n),this}bezierCurveTo(e,t,i,n,r,a){const o=new Tl(this.currentPoint.clone(),new he(e,t),new he(i,n),new he(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Rl(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,n,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,i,n,r,a),this}absarc(e,t,i,n,r,a){return this.absellipse(e,t,i,i,n,r,a),this}ellipse(e,t,i,n,r,a,o,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+l,t+d,i,n,r,a,o,c),this}absellipse(e,t,i,n,r,a,o,c){const l=new fo(e,t,i,n,r,a,o,c);if(this.curves.length>0){const h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Pl extends ac{constructor(e){super(e),this.uuid=un(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,n=this.holes.length;i<n;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const n=e.holes[t];this.holes.push(new ac().fromJSON(n))}return this}}function qh(s,e,t=2){const i=e&&e.length,n=i?e[0]*t:s.length;let r=Dl(s,0,n,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(i&&(r=Jh(s,e,r,t)),s.length>80*t){o=s[0],c=s[1];let d=o,h=c;for(let u=t;u<n;u+=t){const f=s[u],g=s[u+1];f<o&&(o=f),g<c&&(c=g),f>d&&(d=f),g>h&&(h=g)}l=Math.max(d-o,h-c),l=l!==0?32767/l:0}return us(r,a,t,o,c,l,0),a}function Dl(s,e,t,i,n){let r;if(n===lu(s,e,t,i)>0)for(let a=e;a<t;a+=i)r=oc(a/i|0,s[a],s[a+1],r);else for(let a=t-i;a>=e;a-=i)r=oc(a/i|0,s[a],s[a+1],r);return r&&zn(r,r.next)&&(ps(r),r=r.next),r}function ln(s,e){if(!s)return s;e||(e=s);let t=s,i;do if(i=!1,!t.steiner&&(zn(t,t.next)||vt(t.prev,t,t.next)===0)){if(ps(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function us(s,e,t,i,n,r,a){if(!s)return;!a&&r&&nu(s,i,n,r);let o=s;for(;s.prev!==s.next;){const c=s.prev,l=s.next;if(r?Zh(s,i,n,r):Yh(s)){e.push(c.i,s.i,l.i),ps(s),s=l.next,o=l.next;continue}if(s=l,s===o){a?a===1?(s=Kh(ln(s),e),us(s,e,t,i,n,r,2)):a===2&&jh(s,e,t,i,n,r):us(ln(s),e,t,i,n,r,1);break}}}function Yh(s){const e=s.prev,t=s,i=s.next;if(vt(e,t,i)>=0)return!1;const n=e.x,r=t.x,a=i.x,o=e.y,c=t.y,l=i.y,d=Math.min(n,r,a),h=Math.min(o,c,l),u=Math.max(n,r,a),f=Math.max(o,c,l);let g=i.next;for(;g!==e;){if(g.x>=d&&g.x<=u&&g.y>=h&&g.y<=f&&Qn(n,o,r,c,a,l,g.x,g.y)&&vt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Zh(s,e,t,i){const n=s.prev,r=s,a=s.next;if(vt(n,r,a)>=0)return!1;const o=n.x,c=r.x,l=a.x,d=n.y,h=r.y,u=a.y,f=Math.min(o,c,l),g=Math.min(d,h,u),y=Math.max(o,c,l),m=Math.max(d,h,u),p=Ha(f,g,e,t,i),M=Ha(y,m,e,t,i);let b=s.prevZ,w=s.nextZ;for(;b&&b.z>=p&&w&&w.z<=M;){if(b.x>=f&&b.x<=y&&b.y>=g&&b.y<=m&&b!==n&&b!==a&&Qn(o,d,c,h,l,u,b.x,b.y)&&vt(b.prev,b,b.next)>=0||(b=b.prevZ,w.x>=f&&w.x<=y&&w.y>=g&&w.y<=m&&w!==n&&w!==a&&Qn(o,d,c,h,l,u,w.x,w.y)&&vt(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;b&&b.z>=p;){if(b.x>=f&&b.x<=y&&b.y>=g&&b.y<=m&&b!==n&&b!==a&&Qn(o,d,c,h,l,u,b.x,b.y)&&vt(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;w&&w.z<=M;){if(w.x>=f&&w.x<=y&&w.y>=g&&w.y<=m&&w!==n&&w!==a&&Qn(o,d,c,h,l,u,w.x,w.y)&&vt(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function Kh(s,e){let t=s;do{const i=t.prev,n=t.next.next;!zn(i,n)&&Il(i,t,t.next,n)&&fs(i,n)&&fs(n,i)&&(e.push(i.i,t.i,n.i),ps(t),ps(t.next),t=s=n),t=t.next}while(t!==s);return ln(t)}function jh(s,e,t,i,n,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&au(a,o)){let c=kl(a,o);a=ln(a,a.next),c=ln(c,c.next),us(a,e,t,i,n,r,0),us(c,e,t,i,n,r,0);return}o=o.next}a=a.next}while(a!==s)}function Jh(s,e,t,i){const n=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,c=r<a-1?e[r+1]*i:s.length,l=Dl(s,o,c,i,!1);l===l.next&&(l.steiner=!0),n.push(ru(l))}n.sort(Qh);for(let r=0;r<n.length;r++)t=eu(n[r],t);return t}function Qh(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const i=(s.next.y-s.y)/(s.next.x-s.x),n=(e.next.y-e.y)/(e.next.x-e.x);t=i-n}return t}function eu(s,e){const t=tu(s,e);if(!t)return e;const i=kl(t,s);return ln(i,i.next),ln(t,t.next)}function tu(s,e){let t=e;const i=s.x,n=s.y;let r=-1/0,a;if(zn(s,t))return t;do{if(zn(s,t.next))return t.next;if(n<=t.y&&n>=t.next.y&&t.next.y!==t.y){const h=t.x+(n-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=i&&h>r&&(r=h,a=t.x<t.next.x?t:t.next,h===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let d=1/0;t=a;do{if(i>=t.x&&t.x>=c&&i!==t.x&&Ll(n<l?i:r,n,c,l,n<l?r:i,n,t.x,t.y)){const h=Math.abs(n-t.y)/(i-t.x);fs(t,s)&&(h<d||h===d&&(t.x>a.x||t.x===a.x&&iu(a,t)))&&(a=t,d=h)}t=t.next}while(t!==o);return a}function iu(s,e){return vt(s.prev,s,e.prev)<0&&vt(e.next,s,s.next)<0}function nu(s,e,t,i){let n=s;do n.z===0&&(n.z=Ha(n.x,n.y,e,t,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==s);n.prevZ.nextZ=null,n.prevZ=null,su(n)}function su(s){let e,t=1;do{let i=s,n;s=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||i.z<=a.z)?(n=i,i=i.nextZ,o--):(n=a,a=a.nextZ,c--),r?r.nextZ=n:s=n,n.prevZ=r,r=n;i=a}r.nextZ=null,t*=2}while(e>1);return s}function Ha(s,e,t,i,n){return s=(s-t)*n|0,e=(e-i)*n|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function ru(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function Ll(s,e,t,i,n,r,a,o){return(n-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(n-a)*(i-o)}function Qn(s,e,t,i,n,r,a,o){return!(s===a&&e===o)&&Ll(s,e,t,i,n,r,a,o)}function au(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!ou(s,e)&&(fs(s,e)&&fs(e,s)&&cu(s,e)&&(vt(s.prev,s,e.prev)||vt(s,e.prev,e))||zn(s,e)&&vt(s.prev,s,s.next)>0&&vt(e.prev,e,e.next)>0)}function vt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function zn(s,e){return s.x===e.x&&s.y===e.y}function Il(s,e,t,i){const n=Os(vt(s,e,t)),r=Os(vt(s,e,i)),a=Os(vt(t,i,s)),o=Os(vt(t,i,e));return!!(n!==r&&a!==o||n===0&&Fs(s,t,e)||r===0&&Fs(s,i,e)||a===0&&Fs(t,s,i)||o===0&&Fs(t,e,i))}function Fs(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Os(s){return s>0?1:s<0?-1:0}function ou(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&Il(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function fs(s,e){return vt(s.prev,s,s.next)<0?vt(s,e,s.next)>=0&&vt(s,s.prev,e)>=0:vt(s,e,s.prev)<0||vt(s,s.next,e)<0}function cu(s,e){let t=s,i=!1;const n=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&n<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==s);return i}function kl(s,e){const t=Ga(s.i,s.x,s.y),i=Ga(e.i,e.x,e.y),n=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=n,n.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function oc(s,e,t,i){const n=Ga(s,e,t);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function ps(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Ga(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function lu(s,e,t,i){let n=0;for(let r=e,a=t-i;r<t;r+=i)n+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return n}class du{static triangulate(e,t,i=2){return qh(e,t,i)}}class Ln{static area(e){const t=e.length;let i=0;for(let n=t-1,r=0;r<t;n=r++)i+=e[n].x*e[r].y-e[r].x*e[n].y;return i*.5}static isClockWise(e){return Ln.area(e)<0}static triangulateShape(e,t){const i=[],n=[],r=[];cc(e),lc(i,e);let a=e.length;t.forEach(cc);for(let c=0;c<t.length;c++)n.push(a),a+=t[c].length,lc(i,t[c]);const o=du.triangulate(i,n);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function cc(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function lc(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class mo extends Ht{constructor(e=new Pl([new he(.5,.5),new he(-.5,.5),new he(-.5,-.5),new he(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,n=[],r=[];for(let o=0,c=e.length;o<c;o++){const l=e[o];a(l)}this.setAttribute("position",new gt(n,3)),this.setAttribute("uv",new gt(r,2)),this.computeVertexNormals();function a(o){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,y=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:hu;let b,w=!1,D,E,P,_;if(p){b=p.getSpacedPoints(d),w=!0,u=!1;const J=p.isCatmullRomCurve3?p.closed:!1;D=p.computeFrenetFrames(d,J),E=new C,P=new C,_=new C}u||(m=0,f=0,g=0,y=0);const T=o.extractPoints(l);let N=T.shape;const R=T.holes;if(!Ln.isClockWise(N)){N=N.reverse();for(let J=0,se=R.length;J<se;J++){const Q=R[J];Ln.isClockWise(Q)&&(R[J]=Q.reverse())}}function X(J){const Q=10000000000000001e-36;let xe=J[0];for(let pe=1;pe<=J.length;pe++){const Oe=pe%J.length,A=J[Oe],He=A.x-xe.x,Ae=A.y-xe.y,Be=He*He+Ae*Ae,re=Math.max(Math.abs(A.x),Math.abs(A.y),Math.abs(xe.x),Math.abs(xe.y)),at=Q*re*re;if(Be<=at){J.splice(Oe,1),pe--;continue}xe=A}}X(N),R.forEach(X);const q=R.length,k=N;for(let J=0;J<q;J++){const se=R[J];N=N.concat(se)}function G(J,se,Q){return se||tt("ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(se,Q)}const B=N.length;function ie(J,se,Q){let xe,pe,Oe;const A=J.x-se.x,He=J.y-se.y,Ae=Q.x-J.x,Be=Q.y-J.y,re=A*A+He*He,at=A*Be-He*Ae;if(Math.abs(at)>Number.EPSILON){const S=Math.sqrt(re),v=Math.sqrt(Ae*Ae+Be*Be),O=se.x-He/S,Z=se.y+A/S,ee=Q.x-Be/v,ae=Q.y+Ae/v,de=((ee-O)*Be-(ae-Z)*Ae)/(A*Be-He*Ae);xe=O+A*de-J.x,pe=Z+He*de-J.y;const $=xe*xe+pe*pe;if($<=2)return new he(xe,pe);Oe=Math.sqrt($/2)}else{let S=!1;A>Number.EPSILON?Ae>Number.EPSILON&&(S=!0):A<-Number.EPSILON?Ae<-Number.EPSILON&&(S=!0):Math.sign(He)===Math.sign(Be)&&(S=!0),S?(xe=-He,pe=A,Oe=Math.sqrt(re)):(xe=A,pe=He,Oe=Math.sqrt(re/2))}return new he(xe/Oe,pe/Oe)}const ne=[];for(let J=0,se=k.length,Q=se-1,xe=J+1;J<se;J++,Q++,xe++)Q===se&&(Q=0),xe===se&&(xe=0),ne[J]=ie(k[J],k[Q],k[xe]);const me=[];let Se,Ce=ne.concat();for(let J=0,se=q;J<se;J++){const Q=R[J];Se=[];for(let xe=0,pe=Q.length,Oe=pe-1,A=xe+1;xe<pe;xe++,Oe++,A++)Oe===pe&&(Oe=0),A===pe&&(A=0),Se[xe]=ie(Q[xe],Q[Oe],Q[A]);me.push(Se),Ce=Ce.concat(Se)}let $e;if(m===0)$e=Ln.triangulateShape(k,R);else{const J=[],se=[];for(let Q=0;Q<m;Q++){const xe=Q/m,pe=f*Math.cos(xe*Math.PI/2),Oe=g*Math.sin(xe*Math.PI/2)+y;for(let A=0,He=k.length;A<He;A++){const Ae=G(k[A],ne[A],Oe);Pe(Ae.x,Ae.y,-pe),xe===0&&J.push(Ae)}for(let A=0,He=q;A<He;A++){const Ae=R[A];Se=me[A];const Be=[];for(let re=0,at=Ae.length;re<at;re++){const S=G(Ae[re],Se[re],Oe);Pe(S.x,S.y,-pe),xe===0&&Be.push(S)}xe===0&&se.push(Be)}}$e=Ln.triangulateShape(J,se)}const it=$e.length,ze=g+y;for(let J=0;J<B;J++){const se=u?G(N[J],Ce[J],ze):N[J];w?(P.copy(D.normals[0]).multiplyScalar(se.x),E.copy(D.binormals[0]).multiplyScalar(se.y),_.copy(b[0]).add(P).add(E),Pe(_.x,_.y,_.z)):Pe(se.x,se.y,0)}for(let J=1;J<=d;J++)for(let se=0;se<B;se++){const Q=u?G(N[se],Ce[se],ze):N[se];w?(P.copy(D.normals[J]).multiplyScalar(Q.x),E.copy(D.binormals[J]).multiplyScalar(Q.y),_.copy(b[J]).add(P).add(E),Pe(_.x,_.y,_.z)):Pe(Q.x,Q.y,h/d*J)}for(let J=m-1;J>=0;J--){const se=J/m,Q=f*Math.cos(se*Math.PI/2),xe=g*Math.sin(se*Math.PI/2)+y;for(let pe=0,Oe=k.length;pe<Oe;pe++){const A=G(k[pe],ne[pe],xe);Pe(A.x,A.y,h+Q)}for(let pe=0,Oe=R.length;pe<Oe;pe++){const A=R[pe];Se=me[pe];for(let He=0,Ae=A.length;He<Ae;He++){const Be=G(A[He],Se[He],xe);w?Pe(Be.x,Be.y+b[d-1].y,b[d-1].x+Q):Pe(Be.x,Be.y,h+Q)}}}j(),ve();function j(){const J=n.length/3;if(u){let se=0,Q=B*se;for(let xe=0;xe<it;xe++){const pe=$e[xe];Ue(pe[2]+Q,pe[1]+Q,pe[0]+Q)}se=d+m*2,Q=B*se;for(let xe=0;xe<it;xe++){const pe=$e[xe];Ue(pe[0]+Q,pe[1]+Q,pe[2]+Q)}}else{for(let se=0;se<it;se++){const Q=$e[se];Ue(Q[2],Q[1],Q[0])}for(let se=0;se<it;se++){const Q=$e[se];Ue(Q[0]+B*d,Q[1]+B*d,Q[2]+B*d)}}i.addGroup(J,n.length/3-J,0)}function ve(){const J=n.length/3;let se=0;oe(k,se),se+=k.length;for(let Q=0,xe=R.length;Q<xe;Q++){const pe=R[Q];oe(pe,se),se+=pe.length}i.addGroup(J,n.length/3-J,1)}function oe(J,se){let Q=J.length;for(;--Q>=0;){const xe=Q;let pe=Q-1;pe<0&&(pe=J.length-1);for(let Oe=0,A=d+m*2;Oe<A;Oe++){const He=B*Oe,Ae=B*(Oe+1),Be=se+xe+He,re=se+pe+He,at=se+pe+Ae,S=se+xe+Ae;ke(Be,re,at,S)}}}function Pe(J,se,Q){c.push(J),c.push(se),c.push(Q)}function Ue(J,se,Q){nt(J),nt(se),nt(Q);const xe=n.length/3,pe=M.generateTopUV(i,n,xe-3,xe-2,xe-1);Fe(pe[0]),Fe(pe[1]),Fe(pe[2])}function ke(J,se,Q,xe){nt(J),nt(se),nt(xe),nt(se),nt(Q),nt(xe);const pe=n.length/3,Oe=M.generateSideWallUV(i,n,pe-6,pe-3,pe-2,pe-1);Fe(Oe[0]),Fe(Oe[1]),Fe(Oe[3]),Fe(Oe[1]),Fe(Oe[2]),Fe(Oe[3])}function nt(J){n.push(c[J*3+0]),n.push(c[J*3+1]),n.push(c[J*3+2])}function Fe(J){r.push(J.x),r.push(J.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return uu(t,i,e)}static fromJSON(e,t){const i=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];i.push(o)}const n=e.options.extrudePath;return n!==void 0&&(e.options.extrudePath=new za[n.type]().fromJSON(n)),new mo(i,e.options)}}const hu={generateTopUV:function(s,e,t,i,n){const r=e[t*3],a=e[t*3+1],o=e[i*3],c=e[i*3+1],l=e[n*3],d=e[n*3+1];return[new he(r,a),new he(o,c),new he(l,d)]},generateSideWallUV:function(s,e,t,i,n,r){const a=e[t*3],o=e[t*3+1],c=e[t*3+2],l=e[i*3],d=e[i*3+1],h=e[i*3+2],u=e[n*3],f=e[n*3+1],g=e[n*3+2],y=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(o-d)<Math.abs(a-l)?[new he(a,1-c),new he(l,1-h),new he(u,1-g),new he(y,1-p)]:[new he(o,1-c),new he(d,1-h),new he(f,1-g),new he(m,1-p)]}};function uu(s,e,t){if(t.shapes=[],Array.isArray(s))for(let i=0,n=s.length;i<n;i++){const r=s[i];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Gi extends Ht{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};const r=e/2,a=t/2,o=Math.floor(i),c=Math.floor(n),l=o+1,d=c+1,h=e/o,u=t/c,f=[],g=[],y=[],m=[];for(let p=0;p<d;p++){const M=p*u-a;for(let b=0;b<l;b++){const w=b*h-r;g.push(w,-M,0),y.push(0,0,1),m.push(b/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let M=0;M<o;M++){const b=M+l*p,w=M+l*(p+1),D=M+1+l*(p+1),E=M+1+l*p;f.push(b,w,E),f.push(w,D,E)}this.setIndex(f),this.setAttribute("position",new gt(g,3)),this.setAttribute("normal",new gt(y,3)),this.setAttribute("uv",new gt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gi(e.width,e.height,e.widthSegments,e.heightSegments)}}class Rt extends Ht{constructor(e=1,t=32,i=16,n=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const d=[],h=new C,u=new C,f=[],g=[],y=[],m=[];for(let p=0;p<=i;p++){const M=[],b=p/i;let w=0;p===0&&a===0?w=.5/t:p===i&&c===Math.PI&&(w=-.5/t);for(let D=0;D<=t;D++){const E=D/t;h.x=-e*Math.cos(n+E*r)*Math.sin(a+b*o),h.y=e*Math.cos(a+b*o),h.z=e*Math.sin(n+E*r)*Math.sin(a+b*o),g.push(h.x,h.y,h.z),u.copy(h).normalize(),y.push(u.x,u.y,u.z),m.push(E+w,1-b),M.push(l++)}d.push(M)}for(let p=0;p<i;p++)for(let M=0;M<t;M++){const b=d[p][M+1],w=d[p][M],D=d[p+1][M],E=d[p+1][M+1];(p!==0||a>0)&&f.push(b,w,E),(p!==i-1||c<Math.PI)&&f.push(w,D,E)}this.setIndex(f),this.setAttribute("position",new gt(g,3)),this.setAttribute("normal",new gt(y,3)),this.setAttribute("uv",new gt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Yt extends Ht{constructor(e=1,t=.4,i=12,n=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:n,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),n=Math.floor(n);const c=[],l=[],d=[],h=[],u=new C,f=new C,g=new C;for(let y=0;y<=i;y++){const m=a+y/i*o;for(let p=0;p<=n;p++){const M=p/n*r;f.x=(e+t*Math.cos(m))*Math.cos(M),f.y=(e+t*Math.cos(m))*Math.sin(M),f.z=t*Math.sin(m),l.push(f.x,f.y,f.z),u.x=e*Math.cos(M),u.y=e*Math.sin(M),g.subVectors(f,u).normalize(),d.push(g.x,g.y,g.z),h.push(p/n),h.push(y/i)}}for(let y=1;y<=i;y++)for(let m=1;m<=n;m++){const p=(n+1)*y+m-1,M=(n+1)*(y-1)+m-1,b=(n+1)*(y-1)+m,w=(n+1)*y+m;c.push(p,M,w),c.push(M,b,w)}this.setIndex(c),this.setAttribute("position",new gt(l,3)),this.setAttribute("normal",new gt(d,3)),this.setAttribute("uv",new gt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yt(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}function Hn(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const n=s[t][i];if(dc(n))n.isRenderTargetTexture?(Ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone();else if(Array.isArray(n))if(dc(n[0])){const r=[];for(let a=0,o=n.length;a<o;a++)r[a]=n[a].clone();e[t][i]=r}else e[t][i]=n.slice();else e[t][i]=n}}return e}function Bt(s){const e={};for(let t=0;t<s.length;t++){const i=Hn(s[t]);for(const n in i)e[n]=i[n]}return e}function dc(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function fu(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Nl(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Qe.workingColorSpace}const pu={clone:Hn,merge:Bt};var mu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,gu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class gi extends gs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=mu,this.fragmentShader=gu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Hn(e.uniforms),this.uniformsGroups=fu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?t.uniforms[n]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[n]={type:"m4",value:a.toArray()}:t.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class vu extends gi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class je extends gs{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new et(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Oa,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class _u extends gs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Fd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class xu extends gs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Ul extends Lt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new et(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Fl extends Ul{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Lt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new et(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const zr=new yt,hc=new C,uc=new C;class yu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new he(512,512),this.mapType=qt,this.map=null,this.mapPass=null,this.matrix=new yt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new uo,this._frameExtents=new he(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;hc.setFromMatrixPosition(e.matrixWorld),t.position.copy(hc),uc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(uc),t.updateMatrixWorld(),zr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zr,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===ls||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(zr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Bs=new C,zs=new Gn,ai=new C;class Ol extends Lt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=di,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Bs,zs,ai),ai.x===1&&ai.y===1&&ai.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bs,zs,ai.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Bs,zs,ai),ai.x===1&&ai.y===1&&ai.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bs,zs,ai.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Bi=new C,fc=new he,pc=new he;class $t extends Ol{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ds*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ns*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ds*2*Math.atan(Math.tan(ns*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z),Bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z)}getViewSize(e,t){return this.getViewBounds(e,fc,pc),t.subVectors(pc,fc)}setViewOffset(e,t,i,n,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ns*.5*this.fov)/this.zoom,i=2*t,n=this.aspect*i,r=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*n/c,t-=a.offsetY*i/l,n*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+n,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class go extends Ol{constructor(e=-1,t=1,i=1,n=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=n+t,c=n-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Mu extends yu{constructor(){super(new go(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class nr extends Ul{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Lt.DEFAULT_UP),this.updateMatrix(),this.target=new Lt,this.shadow=new Mu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const Tn=-90,Cn=1;class Su extends Lt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new $t(Tn,Cn,e,t);n.layers=this.layers,this.add(n);const r=new $t(Tn,Cn,e,t);r.layers=this.layers,this.add(r);const a=new $t(Tn,Cn,e,t);a.layers=this.layers,this.add(a);const o=new $t(Tn,Cn,e,t);o.layers=this.layers,this.add(o);const c=new $t(Tn,Cn,e,t);c.layers=this.layers,this.add(c);const l=new $t(Tn,Cn,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,n,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===di)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ls)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,h=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,n),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,n),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,n),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,n),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,n),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,n),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(h,u,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class wu extends $t{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class bu{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Ne("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const wo=class wo{constructor(e,t,i,n){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,n)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,n){const r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=n,this}};wo.prototype.isMatrix2=!0;let mc=wo;function gc(s,e,t,i){const n=Eu(i);switch(t){case ul:return s*e;case pl:return s*e/n.components*n.byteLength;case io:return s*e/n.components*n.byteLength;case cn:return s*e*2/n.components*n.byteLength;case no:return s*e*2/n.components*n.byteLength;case fl:return s*e*3/n.components*n.byteLength;case ni:return s*e*4/n.components*n.byteLength;case so:return s*e*4/n.components*n.byteLength;case $s:case qs:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Ys:case Zs:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case la:case ha:return Math.max(s,16)*Math.max(e,8)/4;case ca:case da:return Math.max(s,8)*Math.max(e,8)/2;case ua:case fa:case ma:case ga:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case pa:case Js:case va:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case _a:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case xa:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case ya:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Ma:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Sa:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case wa:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case ba:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Ea:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Ta:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Ca:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Aa:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Ra:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Pa:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Da:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case La:case Ia:case ka:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Na:case Ua:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Qs:case Fa:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Eu(s){switch(s){case qt:case cl:return{byteLength:1,components:1};case os:case ll:case Ri:return{byteLength:2,components:1};case eo:case to:return{byteLength:2,components:4};case mi:case Qa:case li:return{byteLength:4,components:1};case dl:case hl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ja}}));typeof window<"u"&&(window.__THREE__?Ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ja);function Bl(){let s=null,e=!1,t=null,i=null;function n(r,a){t(r,a),i=s.requestAnimationFrame(n)}return{start:function(){e!==!0&&t!==null&&s!==null&&(i=s.requestAnimationFrame(n),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Tu(s){const e=new WeakMap;function t(o,c){const l=o.array,d=o.usage,h=l.byteLength,u=s.createBuffer();s.bindBuffer(c,u),s.bufferData(c,l,d),o.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=s.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,c,l){const d=c.array,h=c.updateRanges;if(s.bindBuffer(l,o),h.length===0)s.bufferSubData(l,0,d);else{h.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<h.length;f++){const g=h[u],y=h[f];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++u,h[u]=y)}h.length=u+1;for(let f=0,g=h.length;f<g;f++){const y=h[f];s.bufferSubData(l,y.start*d.BYTES_PER_ELEMENT,d,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(s.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:n,remove:r,update:a}}var Cu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Au=`#ifdef USE_ALPHAHASH
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
#endif`,Ru=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Pu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Du=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Lu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Iu=`#ifdef USE_AOMAP
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
#endif`,ku=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Nu=`#ifdef USE_BATCHING
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
#endif`,Uu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Fu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ou=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Bu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,zu=`#ifdef USE_IRIDESCENCE
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
#endif`,Hu=`#ifdef USE_BUMPMAP
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
#endif`,Gu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Vu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Wu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Xu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$u=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,qu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Yu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Zu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Ku=`#define PI 3.141592653589793
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
} // validated`,ju=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ju=`vec3 transformedNormal = objectNormal;
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
#endif`,Qu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ef=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,tf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,nf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,sf="gl_FragColor = linearToOutputTexel( gl_FragColor );",rf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,af=`#ifdef USE_ENVMAP
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
#endif`,of=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,cf=`#ifdef USE_ENVMAP
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
#endif`,lf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,df=`#ifdef USE_ENVMAP
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
#endif`,hf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,uf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ff=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,pf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,mf=`#ifdef USE_GRADIENTMAP
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
}`,gf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_f=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,xf=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,yf=`#ifdef USE_ENVMAP
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
#endif`,Mf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Sf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,bf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ef=`PhysicalMaterial material;
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
#endif`,Tf=`uniform sampler2D dfgLUT;
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
}`,Cf=`
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
#endif`,Af=`#if defined( RE_IndirectDiffuse )
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
#endif`,Rf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Pf=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Df=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Lf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,If=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Nf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Uf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ff=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Of=`#if defined( USE_POINTS_UV )
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
#endif`,Bf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Gf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wf=`#ifdef USE_MORPHTARGETS
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
#endif`,Xf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$f=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,qf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Yf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,jf=`#ifdef USE_NORMALMAP
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
#endif`,Jf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ep=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,tp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ip=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,np=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,sp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,rp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ap=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,op=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,lp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,up=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,fp=`float getShadowMask() {
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
}`,pp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,mp=`#ifdef USE_SKINNING
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
#endif`,gp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vp=`#ifdef USE_SKINNING
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
#endif`,_p=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,xp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,yp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Mp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Sp=`#ifdef USE_TRANSMISSION
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
#endif`,wp=`#ifdef USE_TRANSMISSION
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
#endif`,bp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ep=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ap=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Rp=`uniform sampler2D t2D;
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
}`,Pp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Lp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ip=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kp=`#include <common>
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
}`,Np=`#if DEPTH_PACKING == 3200
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
}`,Up=`#define DISTANCE
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
}`,Fp=`#define DISTANCE
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
}`,Op=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zp=`uniform float scale;
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
}`,Hp=`uniform vec3 diffuse;
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
}`,Gp=`#include <common>
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
}`,Vp=`uniform vec3 diffuse;
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
}`,Wp=`#define LAMBERT
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
}`,Xp=`#define LAMBERT
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
}`,$p=`#define MATCAP
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
}`,qp=`#define MATCAP
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
}`,Yp=`#define NORMAL
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
}`,Zp=`#define NORMAL
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
}`,Kp=`#define PHONG
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
}`,jp=`#define PHONG
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
}`,Jp=`#define STANDARD
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
}`,Qp=`#define STANDARD
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
}`,em=`#define TOON
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
}`,tm=`#define TOON
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
}`,im=`uniform float size;
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
}`,nm=`uniform vec3 diffuse;
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
}`,sm=`#include <common>
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
}`,rm=`uniform vec3 color;
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
}`,am=`uniform float rotation;
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
}`,om=`uniform vec3 diffuse;
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
}`,Ye={alphahash_fragment:Cu,alphahash_pars_fragment:Au,alphamap_fragment:Ru,alphamap_pars_fragment:Pu,alphatest_fragment:Du,alphatest_pars_fragment:Lu,aomap_fragment:Iu,aomap_pars_fragment:ku,batching_pars_vertex:Nu,batching_vertex:Uu,begin_vertex:Fu,beginnormal_vertex:Ou,bsdfs:Bu,iridescence_fragment:zu,bumpmap_pars_fragment:Hu,clipping_planes_fragment:Gu,clipping_planes_pars_fragment:Vu,clipping_planes_pars_vertex:Wu,clipping_planes_vertex:Xu,color_fragment:$u,color_pars_fragment:qu,color_pars_vertex:Yu,color_vertex:Zu,common:Ku,cube_uv_reflection_fragment:ju,defaultnormal_vertex:Ju,displacementmap_pars_vertex:Qu,displacementmap_vertex:ef,emissivemap_fragment:tf,emissivemap_pars_fragment:nf,colorspace_fragment:sf,colorspace_pars_fragment:rf,envmap_fragment:af,envmap_common_pars_fragment:of,envmap_pars_fragment:cf,envmap_pars_vertex:lf,envmap_physical_pars_fragment:yf,envmap_vertex:df,fog_vertex:hf,fog_pars_vertex:uf,fog_fragment:ff,fog_pars_fragment:pf,gradientmap_pars_fragment:mf,lightmap_pars_fragment:gf,lights_lambert_fragment:vf,lights_lambert_pars_fragment:_f,lights_pars_begin:xf,lights_toon_fragment:Mf,lights_toon_pars_fragment:Sf,lights_phong_fragment:wf,lights_phong_pars_fragment:bf,lights_physical_fragment:Ef,lights_physical_pars_fragment:Tf,lights_fragment_begin:Cf,lights_fragment_maps:Af,lights_fragment_end:Rf,lightprobes_pars_fragment:Pf,logdepthbuf_fragment:Df,logdepthbuf_pars_fragment:Lf,logdepthbuf_pars_vertex:If,logdepthbuf_vertex:kf,map_fragment:Nf,map_pars_fragment:Uf,map_particle_fragment:Ff,map_particle_pars_fragment:Of,metalnessmap_fragment:Bf,metalnessmap_pars_fragment:zf,morphinstance_vertex:Hf,morphcolor_vertex:Gf,morphnormal_vertex:Vf,morphtarget_pars_vertex:Wf,morphtarget_vertex:Xf,normal_fragment_begin:$f,normal_fragment_maps:qf,normal_pars_fragment:Yf,normal_pars_vertex:Zf,normal_vertex:Kf,normalmap_pars_fragment:jf,clearcoat_normal_fragment_begin:Jf,clearcoat_normal_fragment_maps:Qf,clearcoat_pars_fragment:ep,iridescence_pars_fragment:tp,opaque_fragment:ip,packing:np,premultiplied_alpha_fragment:sp,project_vertex:rp,dithering_fragment:ap,dithering_pars_fragment:op,roughnessmap_fragment:cp,roughnessmap_pars_fragment:lp,shadowmap_pars_fragment:dp,shadowmap_pars_vertex:hp,shadowmap_vertex:up,shadowmask_pars_fragment:fp,skinbase_vertex:pp,skinning_pars_vertex:mp,skinning_vertex:gp,skinnormal_vertex:vp,specularmap_fragment:_p,specularmap_pars_fragment:xp,tonemapping_fragment:yp,tonemapping_pars_fragment:Mp,transmission_fragment:Sp,transmission_pars_fragment:wp,uv_pars_fragment:bp,uv_pars_vertex:Ep,uv_vertex:Tp,worldpos_vertex:Cp,background_vert:Ap,background_frag:Rp,backgroundCube_vert:Pp,backgroundCube_frag:Dp,cube_vert:Lp,cube_frag:Ip,depth_vert:kp,depth_frag:Np,distance_vert:Up,distance_frag:Fp,equirect_vert:Op,equirect_frag:Bp,linedashed_vert:zp,linedashed_frag:Hp,meshbasic_vert:Gp,meshbasic_frag:Vp,meshlambert_vert:Wp,meshlambert_frag:Xp,meshmatcap_vert:$p,meshmatcap_frag:qp,meshnormal_vert:Yp,meshnormal_frag:Zp,meshphong_vert:Kp,meshphong_frag:jp,meshphysical_vert:Jp,meshphysical_frag:Qp,meshtoon_vert:em,meshtoon_frag:tm,points_vert:im,points_frag:nm,shadow_vert:sm,shadow_frag:rm,sprite_vert:am,sprite_frag:om},ge={common:{diffuse:{value:new et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new he(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new C},probesMax:{value:new C},probesResolution:{value:new C}},points:{diffuse:{value:new et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new et(16777215)},opacity:{value:1},center:{value:new he(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},ci={basic:{uniforms:Bt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:Bt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new et(0)},envMapIntensity:{value:1}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:Bt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new et(0)},specular:{value:new et(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:Bt([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:Bt([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new et(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:Bt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:Bt([ge.points,ge.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:Bt([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:Bt([ge.common,ge.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:Bt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:Bt([ge.sprite,ge.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distance:{uniforms:Bt([ge.common,ge.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distance_vert,fragmentShader:Ye.distance_frag},shadow:{uniforms:Bt([ge.lights,ge.fog,{color:{value:new et(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};ci.physical={uniforms:Bt([ci.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new he(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new he},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new et(0)},specularColor:{value:new et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new he},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};const Hs={r:0,b:0,g:0},cm=new yt,zl=new Ve;zl.set(-1,0,0,0,1,0,0,0,1);function lm(s,e,t,i,n,r){const a=new et(0);let o=n===!0?0:1,c,l,d=null,h=0,u=null;function f(M){let b=M.isScene===!0?M.background:null;if(b&&b.isTexture){const w=M.backgroundBlurriness>0;b=e.get(b,w)}return b}function g(M){let b=!1;const w=f(M);w===null?m(a,o):w&&w.isColor&&(m(w,1),b=!0);const D=s.xr.getEnvironmentBlendMode();D==="additive"?t.buffers.color.setClear(0,0,0,1,r):D==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function y(M,b){const w=f(b);w&&(w.isCubeTexture||w.mapping===ar)?(l===void 0&&(l=new L(new W(1,1,1),new gi({name:"BackgroundCubeMaterial",uniforms:Hn(ci.backgroundCube.uniforms),vertexShader:ci.backgroundCube.vertexShader,fragmentShader:ci.backgroundCube.fragmentShader,side:zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(D,E,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=w,l.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(cm.makeRotationFromEuler(b.backgroundRotation)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(zl),l.material.toneMapped=Qe.getTransfer(w.colorSpace)!==ot,(d!==w||h!==w.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,d=w,h=w.version,u=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new L(new Gi(2,2),new gi({name:"BackgroundMaterial",uniforms:Hn(ci.background.uniforms),vertexShader:ci.background.vertexShader,fragmentShader:ci.background.fragmentShader,side:Vi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(w.colorSpace)!==ot,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(d!==w||h!==w.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,d=w,h=w.version,u=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function m(M,b){M.getRGB(Hs,Nl(s)),t.buffers.color.setClear(Hs.r,Hs.g,Hs.b,b,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,b=1){a.set(M),o=b,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,m(a,o)},render:g,addToRenderList:y,dispose:p}}function dm(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},n=u(null);let r=n,a=!1;function o(R,F,X,q,k){let G=!1;const B=h(R,q,X,F);r!==B&&(r=B,l(r.object)),G=f(R,q,X,k),G&&g(R,q,X,k),k!==null&&e.update(k,s.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,w(R,F,X,q),k!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function c(){return s.createVertexArray()}function l(R){return s.bindVertexArray(R)}function d(R){return s.deleteVertexArray(R)}function h(R,F,X,q){const k=q.wireframe===!0;let G=i[F.id];G===void 0&&(G={},i[F.id]=G);const B=R.isInstancedMesh===!0?R.id:0;let ie=G[B];ie===void 0&&(ie={},G[B]=ie);let ne=ie[X.id];ne===void 0&&(ne={},ie[X.id]=ne);let me=ne[k];return me===void 0&&(me=u(c()),ne[k]=me),me}function u(R){const F=[],X=[],q=[];for(let k=0;k<t;k++)F[k]=0,X[k]=0,q[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:X,attributeDivisors:q,object:R,attributes:{},index:null}}function f(R,F,X,q){const k=r.attributes,G=F.attributes;let B=0;const ie=X.getAttributes();for(const ne in ie)if(ie[ne].location>=0){const Se=k[ne];let Ce=G[ne];if(Ce===void 0&&(ne==="instanceMatrix"&&R.instanceMatrix&&(Ce=R.instanceMatrix),ne==="instanceColor"&&R.instanceColor&&(Ce=R.instanceColor)),Se===void 0||Se.attribute!==Ce||Ce&&Se.data!==Ce.data)return!0;B++}return r.attributesNum!==B||r.index!==q}function g(R,F,X,q){const k={},G=F.attributes;let B=0;const ie=X.getAttributes();for(const ne in ie)if(ie[ne].location>=0){let Se=G[ne];Se===void 0&&(ne==="instanceMatrix"&&R.instanceMatrix&&(Se=R.instanceMatrix),ne==="instanceColor"&&R.instanceColor&&(Se=R.instanceColor));const Ce={};Ce.attribute=Se,Se&&Se.data&&(Ce.data=Se.data),k[ne]=Ce,B++}r.attributes=k,r.attributesNum=B,r.index=q}function y(){const R=r.newAttributes;for(let F=0,X=R.length;F<X;F++)R[F]=0}function m(R){p(R,0)}function p(R,F){const X=r.newAttributes,q=r.enabledAttributes,k=r.attributeDivisors;X[R]=1,q[R]===0&&(s.enableVertexAttribArray(R),q[R]=1),k[R]!==F&&(s.vertexAttribDivisor(R,F),k[R]=F)}function M(){const R=r.newAttributes,F=r.enabledAttributes;for(let X=0,q=F.length;X<q;X++)F[X]!==R[X]&&(s.disableVertexAttribArray(X),F[X]=0)}function b(R,F,X,q,k,G,B){B===!0?s.vertexAttribIPointer(R,F,X,k,G):s.vertexAttribPointer(R,F,X,q,k,G)}function w(R,F,X,q){y();const k=q.attributes,G=X.getAttributes(),B=F.defaultAttributeValues;for(const ie in G){const ne=G[ie];if(ne.location>=0){let me=k[ie];if(me===void 0&&(ie==="instanceMatrix"&&R.instanceMatrix&&(me=R.instanceMatrix),ie==="instanceColor"&&R.instanceColor&&(me=R.instanceColor)),me!==void 0){const Se=me.normalized,Ce=me.itemSize,$e=e.get(me);if($e===void 0)continue;const it=$e.buffer,ze=$e.type,j=$e.bytesPerElement,ve=ze===s.INT||ze===s.UNSIGNED_INT||me.gpuType===Qa;if(me.isInterleavedBufferAttribute){const oe=me.data,Pe=oe.stride,Ue=me.offset;if(oe.isInstancedInterleavedBuffer){for(let ke=0;ke<ne.locationSize;ke++)p(ne.location+ke,oe.meshPerAttribute);R.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let ke=0;ke<ne.locationSize;ke++)m(ne.location+ke);s.bindBuffer(s.ARRAY_BUFFER,it);for(let ke=0;ke<ne.locationSize;ke++)b(ne.location+ke,Ce/ne.locationSize,ze,Se,Pe*j,(Ue+Ce/ne.locationSize*ke)*j,ve)}else{if(me.isInstancedBufferAttribute){for(let oe=0;oe<ne.locationSize;oe++)p(ne.location+oe,me.meshPerAttribute);R.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let oe=0;oe<ne.locationSize;oe++)m(ne.location+oe);s.bindBuffer(s.ARRAY_BUFFER,it);for(let oe=0;oe<ne.locationSize;oe++)b(ne.location+oe,Ce/ne.locationSize,ze,Se,Ce*j,Ce/ne.locationSize*oe*j,ve)}}else if(B!==void 0){const Se=B[ie];if(Se!==void 0)switch(Se.length){case 2:s.vertexAttrib2fv(ne.location,Se);break;case 3:s.vertexAttrib3fv(ne.location,Se);break;case 4:s.vertexAttrib4fv(ne.location,Se);break;default:s.vertexAttrib1fv(ne.location,Se)}}}}M()}function D(){T();for(const R in i){const F=i[R];for(const X in F){const q=F[X];for(const k in q){const G=q[k];for(const B in G)d(G[B].object),delete G[B];delete q[k]}}delete i[R]}}function E(R){if(i[R.id]===void 0)return;const F=i[R.id];for(const X in F){const q=F[X];for(const k in q){const G=q[k];for(const B in G)d(G[B].object),delete G[B];delete q[k]}}delete i[R.id]}function P(R){for(const F in i){const X=i[F];for(const q in X){const k=X[q];if(k[R.id]===void 0)continue;const G=k[R.id];for(const B in G)d(G[B].object),delete G[B];delete k[R.id]}}}function _(R){for(const F in i){const X=i[F],q=R.isInstancedMesh===!0?R.id:0,k=X[q];if(k!==void 0){for(const G in k){const B=k[G];for(const ie in B)d(B[ie].object),delete B[ie];delete k[G]}delete X[q],Object.keys(X).length===0&&delete i[F]}}}function T(){N(),a=!0,r!==n&&(r=n,l(r.object))}function N(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:T,resetDefaultState:N,dispose:D,releaseStatesOfGeometry:E,releaseStatesOfObject:_,releaseStatesOfProgram:P,initAttributes:y,enableAttribute:m,disableUnusedAttributes:M}}function hm(s,e,t){let i;function n(c){i=c}function r(c,l){s.drawArrays(i,c,l),t.update(l,i,1)}function a(c,l,d){d!==0&&(s.drawArraysInstanced(i,c,l,d),t.update(l,i,d))}function o(c,l,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,d);let u=0;for(let f=0;f<d;f++)u+=l[f];t.update(u,i,1)}this.setMode=n,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function um(s,e,t,i){let n;function r(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(P){return!(P!==ni&&i.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const _=P===Ri&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==qt&&i.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==li&&!_)}function c(P){if(P==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const d=c(l);d!==l&&(Ne("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const h=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Ne("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),b=s.getParameter(s.MAX_VARYING_VECTORS),w=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),D=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:b,maxFragmentUniforms:w,maxSamples:D,samples:E}}function fm(s){const e=this;let t=null,i=0,n=!1,r=!1;const a=new ji,o=new Ve,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){const f=h.length!==0||u||i!==0||n;return n=u,i=h.length,f},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,u){t=d(h,u,0)},this.setState=function(h,u,f){const g=h.clippingPlanes,y=h.clipIntersection,m=h.clipShadows,p=s.get(h);if(!n||g===null||g.length===0||r&&!m)r?d(null):l();else{const M=r?0:i,b=M*4;let w=p.clippingState||null;c.value=w,w=d(g,u,b,f);for(let D=0;D!==b;++D)w[D]=t[D];p.clippingState=w,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(h,u,f,g){const y=h!==null?h.length:0;let m=null;if(y!==0){if(m=c.value,g!==!0||m===null){const p=f+y*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,w=f;b!==y;++b,w+=4)a.copy(h[b]).applyMatrix4(M,o),a.normal.toArray(m,w),m[w+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}const Hi=4,vc=[.125,.215,.35,.446,.526,.582],en=20,pm=256,Yn=new go,_c=new et;let Hr=null,Gr=0,Vr=0,Wr=!1;const mm=new C;class xc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,n=100,r={}){const{size:a=256,position:o=mm}=r;Hr=this._renderer.getRenderTarget(),Gr=this._renderer.getActiveCubeFace(),Vr=this._renderer.getActiveMipmapLevel(),Wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,n,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Mc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Hr,Gr,Vr),this._renderer.xr.enabled=Wr,e.scissorTest=!1,An(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===on||e.mapping===On?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Hr=this._renderer.getRenderTarget(),Gr=this._renderer.getActiveCubeFace(),Vr=this._renderer.getActiveMipmapLevel(),Wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:Ri,format:ni,colorSpace:er,depthBuffer:!1},n=yc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yc(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=gm(r)),this._blurMaterial=_m(r,e,t),this._ggxMaterial=vm(r,e,t)}return n}_compileMaterial(e){const t=new L(new Ht,e);this._renderer.compile(t,Yn)}_sceneToCubeUV(e,t,i,n,r){const c=new $t(90,1,t,i),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(_c),h.toneMapping=ui,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(n),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new L(new W,new Et({name:"PMREM.Background",side:zt,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,m=y.material;let p=!1;const M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,p=!0):(m.color.copy(_c),p=!0);for(let b=0;b<6;b++){const w=b%3;w===0?(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[b],r.y,r.z)):w===1?(c.up.set(0,0,l[b]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[b],r.z)):(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[b]));const D=this._cubeSize;An(n,w*D,b>2?D:0,D,D),h.setRenderTarget(n),p&&h.render(y,c),h.render(e,c)}h.toneMapping=f,h.autoClear=u,e.background=M}_textureToCubeUV(e,t){const i=this._renderer,n=e.mapping===on||e.mapping===On;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Mc());const r=n?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;An(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,Yn)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const n=this._lodMeshes.length;for(let r=1;r<n;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const n=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),h=Math.sqrt(l*l-d*d),u=0+l*1.25,f=h*u,{_lodMax:g}=this,y=this._sizeLods[i],m=3*y*(i>g-Hi?i-g+Hi:0),p=4*(this._cubeSize-y);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=g-t,An(r,m,p,3*y,2*y),n.setRenderTarget(r),n.render(o,Yn),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-i,An(e,m,p,3*y,2*y),n.setRenderTarget(e),n.render(o,Yn)}_blur(e,t,i,n,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,n,"latitudinal",r),this._halfBlur(a,e,i,i,n,"longitudinal",r)}_halfBlur(e,t,i,n,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&tt("blur direction must be either latitudinal or longitudinal!");const d=3,h=this._lodMeshes[n];h.material=l;const u=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*en-1),y=r/g,m=isFinite(r)?1+Math.floor(d*y):en;m>en&&Ne(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${en}`);const p=[];let M=0;for(let P=0;P<en;++P){const _=P/y,T=Math.exp(-_*_/2);p.push(T),P===0?M+=T:P<m&&(M+=2*T)}for(let P=0;P<p.length;P++)p[P]=p[P]/M;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:b}=this;u.dTheta.value=g,u.mipInt.value=b-i;const w=this._sizeLods[n],D=3*w*(n>b-Hi?n-b+Hi:0),E=4*(this._cubeSize-w);An(t,D,E,3*w,2*w),c.setRenderTarget(t),c.render(h,Yn)}}function gm(s){const e=[],t=[],i=[];let n=s;const r=s-Hi+1+vc.length;for(let a=0;a<r;a++){const o=Math.pow(2,n);e.push(o);let c=1/o;a>s-Hi?c=vc[a-s+Hi-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),d=-l,h=1+l,u=[d,d,h,d,h,h,d,d,h,h,d,h],f=6,g=6,y=3,m=2,p=1,M=new Float32Array(y*g*f),b=new Float32Array(m*g*f),w=new Float32Array(p*g*f);for(let E=0;E<f;E++){const P=E%3*2/3-1,_=E>2?0:-1,T=[P,_,0,P+2/3,_,0,P+2/3,_+1,0,P,_,0,P+2/3,_+1,0,P,_+1,0];M.set(T,y*g*E),b.set(u,m*g*E);const N=[E,E,E,E,E,E];w.set(N,p*g*E)}const D=new Ht;D.setAttribute("position",new pi(M,y)),D.setAttribute("uv",new pi(b,m)),D.setAttribute("faceIndex",new pi(w,p)),i.push(new L(D,null)),n>Hi&&n--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function yc(s,e,t){const i=new fi(s,e,t);return i.texture.mapping=ar,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function An(s,e,t,i,n){s.viewport.set(e,t,i,n),s.scissor.set(e,t,i,n)}function vm(s,e,t){return new gi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:pm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:cr(),fragmentShader:`

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
		`,blending:Ci,depthTest:!1,depthWrite:!1})}function _m(s,e,t){const i=new Float32Array(en),n=new C(0,1,0);return new gi({name:"SphericalGaussianBlur",defines:{n:en,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:cr(),fragmentShader:`

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
		`,blending:Ci,depthTest:!1,depthWrite:!1})}function Mc(){return new gi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:cr(),fragmentShader:`

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
		`,blending:Ci,depthTest:!1,depthWrite:!1})}function Sc(){return new gi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:cr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ci,depthTest:!1,depthWrite:!1})}function cr(){return`

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
	`}class Hl extends fi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new Sl(n),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},n=new W(5,5,5),r=new gi({name:"CubemapFromEquirect",uniforms:Hn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:zt,blending:Ci});r.uniforms.tEquirect.value=t;const a=new L(n,r),o=t.minFilter;return t.minFilter===nn&&(t.minFilter=Ut),new Su(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,n=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(r)}}function xm(s){let e=new WeakMap,t=new WeakMap,i=null;function n(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===ur||f===fr)if(e.has(u)){const g=e.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const y=new Hl(g.height);return y.fromEquirectangularTexture(s,u),e.set(u,y),u.addEventListener("dispose",l),o(y.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const f=u.mapping,g=f===ur||f===fr,y=f===on||f===On;if(g||y){let m=t.get(u);const p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return i===null&&(i=new xc(s)),m=g?i.fromEquirectangular(u,m):i.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{const M=u.image;return g&&M&&M.height>0||y&&M&&c(M)?(i===null&&(i=new xc(s)),m=g?i.fromEquirectangular(u):i.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",d),m.texture):null}}}return u}function o(u,f){return f===ur?u.mapping=on:f===fr&&(u.mapping=On),u}function c(u){let f=0;const g=6;for(let y=0;y<g;y++)u[y]!==void 0&&f++;return f===g}function l(u){const f=u.target;f.removeEventListener("dispose",l);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function d(u){const f=u.target;f.removeEventListener("dispose",d);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:h}}function ym(s){const e={};function t(i){if(e[i]!==void 0)return e[i];const n=s.getExtension(i);return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const n=t(i);return n===null&&Ba("WebGLRenderer: "+i+" extension not supported."),n}}}function Mm(s,e,t,i){const n={},r=new WeakMap;function a(h){const u=h.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete n[u.id];const f=r.get(u);f&&(e.remove(f),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(h,u){return n[u.id]===!0||(u.addEventListener("dispose",a),n[u.id]=!0,t.memory.geometries++),u}function c(h){const u=h.attributes;for(const f in u)e.update(u[f],s.ARRAY_BUFFER)}function l(h){const u=[],f=h.index,g=h.attributes.position;let y=0;if(g===void 0)return;if(f!==null){const M=f.array;y=f.version;for(let b=0,w=M.length;b<w;b+=3){const D=M[b+0],E=M[b+1],P=M[b+2];u.push(D,E,E,P,P,D)}}else{const M=g.array;y=g.version;for(let b=0,w=M.length/3-1;b<w;b+=3){const D=b+0,E=b+1,P=b+2;u.push(D,E,E,P,P,D)}}const m=new(g.count>=65535?Ml:yl)(u,1);m.version=y;const p=r.get(h);p&&e.remove(p),r.set(h,m)}function d(h){const u=r.get(h);if(u){const f=h.index;f!==null&&u.version<f.version&&l(h)}else l(h);return r.get(h)}return{get:o,update:c,getWireframeAttribute:d}}function Sm(s,e,t){let i;function n(h){i=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function c(h,u){s.drawElements(i,u,r,h*a),t.update(u,i,1)}function l(h,u,f){f!==0&&(s.drawElementsInstanced(i,u,r,h*a,f),t.update(u,i,f))}function d(h,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,h,0,f);let y=0;for(let m=0;m<f;m++)y+=u[m];t.update(y,i,1)}this.setMode=n,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d}function wm(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:tt("WebGLInfo: Unknown draw mode:",a);break}}function n(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:n,update:i}}function bm(s,e,t){const i=new WeakMap,n=new xt;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0;let u=i.get(o);if(u===void 0||u.count!==h){let N=function(){_.dispose(),i.delete(o),o.removeEventListener("dispose",N)};var f=N;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let w=0;g===!0&&(w=1),y===!0&&(w=2),m===!0&&(w=3);let D=o.attributes.position.count*w,E=1;D>e.maxTextureSize&&(E=Math.ceil(D/e.maxTextureSize),D=e.maxTextureSize);const P=new Float32Array(D*E*4*h),_=new gl(P,D,E,h);_.type=li,_.needsUpdate=!0;const T=w*4;for(let R=0;R<h;R++){const F=p[R],X=M[R],q=b[R],k=D*E*4*R;for(let G=0;G<F.count;G++){const B=G*T;g===!0&&(n.fromBufferAttribute(F,G),P[k+B+0]=n.x,P[k+B+1]=n.y,P[k+B+2]=n.z,P[k+B+3]=0),y===!0&&(n.fromBufferAttribute(X,G),P[k+B+4]=n.x,P[k+B+5]=n.y,P[k+B+6]=n.z,P[k+B+7]=0),m===!0&&(n.fromBufferAttribute(q,G),P[k+B+8]=n.x,P[k+B+9]=n.y,P[k+B+10]=n.z,P[k+B+11]=q.itemSize===4?n.w:1)}}u={count:h,texture:_,size:new he(D,E)},i.set(o,u),o.addEventListener("dispose",N)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const y=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(s,"morphTargetBaseInfluence",y),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function Em(s,e,t,i,n){let r=new WeakMap;function a(l){const d=n.render.frame,h=l.geometry,u=e.get(l,h);if(r.get(u)!==d&&(e.update(u),r.set(u,d)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==d&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),r.set(l,d))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==d&&(f.update(),r.set(f,d))}return u}function o(){r=new WeakMap}function c(l){const d=l.target;d.removeEventListener("dispose",c),i.releaseStatesOfObject(d),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:a,dispose:o}}const Tm={[tl]:"LINEAR_TONE_MAPPING",[il]:"REINHARD_TONE_MAPPING",[nl]:"CINEON_TONE_MAPPING",[Ja]:"ACES_FILMIC_TONE_MAPPING",[rl]:"AGX_TONE_MAPPING",[al]:"NEUTRAL_TONE_MAPPING",[sl]:"CUSTOM_TONE_MAPPING"};function Cm(s,e,t,i,n){const r=new fi(e,t,{type:s,depthBuffer:i,stencilBuffer:n,depthTexture:i?new Bn(e,t):void 0}),a=new fi(e,t,{type:Ri,depthBuffer:!1,stencilBuffer:!1}),o=new Ht;o.setAttribute("position",new gt([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new gt([0,2,0,0,2,0],2));const c=new vu({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),l=new L(o,c),d=new go(-1,1,1,-1,0,1);let h=null,u=null,f=!1,g,y=null,m=[],p=!1;this.setSize=function(M,b){r.setSize(M,b),a.setSize(M,b);for(let w=0;w<m.length;w++){const D=m[w];D.setSize&&D.setSize(M,b)}},this.setEffects=function(M){m=M,p=m.length>0&&m[0].isRenderPass===!0;const b=r.width,w=r.height;for(let D=0;D<m.length;D++){const E=m[D];E.setSize&&E.setSize(b,w)}},this.begin=function(M,b){if(f||M.toneMapping===ui&&m.length===0)return!1;if(y=b,b!==null){const w=b.width,D=b.height;(r.width!==w||r.height!==D)&&this.setSize(w,D)}return p===!1&&M.setRenderTarget(r),g=M.toneMapping,M.toneMapping=ui,!0},this.hasRenderPass=function(){return p},this.end=function(M,b){M.toneMapping=g,f=!0;let w=r,D=a;for(let E=0;E<m.length;E++){const P=m[E];if(P.enabled!==!1&&(P.render(M,D,w,b),P.needsSwap!==!1)){const _=w;w=D,D=_}}if(h!==M.outputColorSpace||u!==M.toneMapping){h=M.outputColorSpace,u=M.toneMapping,c.defines={},Qe.getTransfer(h)===ot&&(c.defines.SRGB_TRANSFER="");const E=Tm[u];E&&(c.defines[E]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=w.texture,M.setRenderTarget(y),M.render(l,d),y=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.depthTexture&&r.depthTexture.dispose(),r.dispose(),a.dispose(),o.dispose(),c.dispose()}}const Gl=new Ft,Va=new Bn(1,1),Vl=new gl,Wl=new gh,Xl=new Sl,wc=[],bc=[],Ec=new Float32Array(16),Tc=new Float32Array(9),Cc=new Float32Array(4);function Vn(s,e,t){const i=s[0];if(i<=0||i>0)return s;const n=e*t;let r=wc[n];if(r===void 0&&(r=new Float32Array(n),wc[n]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Tt(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function Ct(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function lr(s,e){let t=bc[e];t===void 0&&(t=new Int32Array(e),bc[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function Am(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Rm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;s.uniform2fv(this.addr,e),Ct(t,e)}}function Pm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;s.uniform3fv(this.addr,e),Ct(t,e)}}function Dm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;s.uniform4fv(this.addr,e),Ct(t,e)}}function Lm(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Ct(t,e)}else{if(Tt(t,i))return;Cc.set(i),s.uniformMatrix2fv(this.addr,!1,Cc),Ct(t,i)}}function Im(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Ct(t,e)}else{if(Tt(t,i))return;Tc.set(i),s.uniformMatrix3fv(this.addr,!1,Tc),Ct(t,i)}}function km(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Ct(t,e)}else{if(Tt(t,i))return;Ec.set(i),s.uniformMatrix4fv(this.addr,!1,Ec),Ct(t,i)}}function Nm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Um(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;s.uniform2iv(this.addr,e),Ct(t,e)}}function Fm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;s.uniform3iv(this.addr,e),Ct(t,e)}}function Om(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;s.uniform4iv(this.addr,e),Ct(t,e)}}function Bm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function zm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;s.uniform2uiv(this.addr,e),Ct(t,e)}}function Hm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;s.uniform3uiv(this.addr,e),Ct(t,e)}}function Gm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;s.uniform4uiv(this.addr,e),Ct(t,e)}}function Vm(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let r;this.type===s.SAMPLER_2D_SHADOW?(Va.compareFunction=t.isReversedDepthBuffer()?ao:ro,r=Va):r=Gl,t.setTexture2D(e||r,n)}function Wm(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||Wl,n)}function Xm(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||Xl,n)}function $m(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||Vl,n)}function qm(s){switch(s){case 5126:return Am;case 35664:return Rm;case 35665:return Pm;case 35666:return Dm;case 35674:return Lm;case 35675:return Im;case 35676:return km;case 5124:case 35670:return Nm;case 35667:case 35671:return Um;case 35668:case 35672:return Fm;case 35669:case 35673:return Om;case 5125:return Bm;case 36294:return zm;case 36295:return Hm;case 36296:return Gm;case 35678:case 36198:case 36298:case 36306:case 35682:return Vm;case 35679:case 36299:case 36307:return Wm;case 35680:case 36300:case 36308:case 36293:return Xm;case 36289:case 36303:case 36311:case 36292:return $m}}function Ym(s,e){s.uniform1fv(this.addr,e)}function Zm(s,e){const t=Vn(e,this.size,2);s.uniform2fv(this.addr,t)}function Km(s,e){const t=Vn(e,this.size,3);s.uniform3fv(this.addr,t)}function jm(s,e){const t=Vn(e,this.size,4);s.uniform4fv(this.addr,t)}function Jm(s,e){const t=Vn(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Qm(s,e){const t=Vn(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function e0(s,e){const t=Vn(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function t0(s,e){s.uniform1iv(this.addr,e)}function i0(s,e){s.uniform2iv(this.addr,e)}function n0(s,e){s.uniform3iv(this.addr,e)}function s0(s,e){s.uniform4iv(this.addr,e)}function r0(s,e){s.uniform1uiv(this.addr,e)}function a0(s,e){s.uniform2uiv(this.addr,e)}function o0(s,e){s.uniform3uiv(this.addr,e)}function c0(s,e){s.uniform4uiv(this.addr,e)}function l0(s,e,t){const i=this.cache,n=e.length,r=lr(t,n);Tt(i,r)||(s.uniform1iv(this.addr,r),Ct(i,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=Va:a=Gl;for(let o=0;o!==n;++o)t.setTexture2D(e[o]||a,r[o])}function d0(s,e,t){const i=this.cache,n=e.length,r=lr(t,n);Tt(i,r)||(s.uniform1iv(this.addr,r),Ct(i,r));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||Wl,r[a])}function h0(s,e,t){const i=this.cache,n=e.length,r=lr(t,n);Tt(i,r)||(s.uniform1iv(this.addr,r),Ct(i,r));for(let a=0;a!==n;++a)t.setTextureCube(e[a]||Xl,r[a])}function u0(s,e,t){const i=this.cache,n=e.length,r=lr(t,n);Tt(i,r)||(s.uniform1iv(this.addr,r),Ct(i,r));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||Vl,r[a])}function f0(s){switch(s){case 5126:return Ym;case 35664:return Zm;case 35665:return Km;case 35666:return jm;case 35674:return Jm;case 35675:return Qm;case 35676:return e0;case 5124:case 35670:return t0;case 35667:case 35671:return i0;case 35668:case 35672:return n0;case 35669:case 35673:return s0;case 5125:return r0;case 36294:return a0;case 36295:return o0;case 36296:return c0;case 35678:case 36198:case 36298:case 36306:case 35682:return l0;case 35679:case 36299:case 36307:return d0;case 35680:case 36300:case 36308:case 36293:return h0;case 36289:case 36303:case 36311:case 36292:return u0}}class p0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=qm(t.type)}}class m0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=f0(t.type)}}class g0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const n=this.seq;for(let r=0,a=n.length;r!==a;++r){const o=n[r];o.setValue(e,t[o.id],i)}}}const Xr=/(\w+)(\])?(\[|\.)?/g;function Ac(s,e){s.seq.push(e),s.map[e.id]=e}function v0(s,e,t){const i=s.name,n=i.length;for(Xr.lastIndex=0;;){const r=Xr.exec(i),a=Xr.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===n){Ac(t,l===void 0?new p0(o,s,e):new m0(o,s,e));break}else{let h=t.map[o];h===void 0&&(h=new g0(o),Ac(t,h)),t=h}}}class Ks{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);v0(o,c,this)}const n=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?n.push(a):r.push(a);n.length>0&&(this.seq=n.concat(r))}setValue(e,t,i,n){const r=this.map[t];r!==void 0&&r.setValue(e,i,n)}setOptional(e,t,i){const n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,n)}}static seqWithValue(e,t){const i=[];for(let n=0,r=e.length;n!==r;++n){const a=e[n];a.id in t&&i.push(a)}return i}}function Rc(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const _0=37297;let x0=0;function y0(s,e){const t=s.split(`
`),i=[],n=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=n;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Pc=new Ve;function M0(s){Qe._getMatrix(Pc,Qe.workingColorSpace,s);const e=`mat3( ${Pc.elements.map(t=>t.toFixed(4))} )`;switch(Qe.getTransfer(s)){case tr:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return Ne("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Dc(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+y0(s.getShaderSource(e),o)}else return r}function S0(s,e){const t=M0(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const w0={[tl]:"Linear",[il]:"Reinhard",[nl]:"Cineon",[Ja]:"ACESFilmic",[rl]:"AgX",[al]:"Neutral",[sl]:"Custom"};function b0(s,e){const t=w0[e];return t===void 0?(Ne("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Gs=new C;function E0(){Qe.getLuminanceCoefficients(Gs);const s=Gs.x.toFixed(4),e=Gs.y.toFixed(4),t=Gs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function T0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(es).join(`
`)}function C0(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function A0(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const r=s.getActiveAttrib(e,n),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function es(s){return s!==""}function Lc(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ic(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const R0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wa(s){return s.replace(R0,D0)}const P0=new Map;function D0(s,e){let t=Ye[e];if(t===void 0){const i=P0.get(e);if(i!==void 0)t=Ye[i],Ne('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Wa(t)}const L0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function kc(s){return s.replace(L0,I0)}function I0(s,e,t,i){let n="";for(let r=parseInt(e);r<parseInt(t);r++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return n}function Nc(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const k0={[Xs]:"SHADOWMAP_TYPE_PCF",[Jn]:"SHADOWMAP_TYPE_VSM"};function N0(s){return k0[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const U0={[on]:"ENVMAP_TYPE_CUBE",[On]:"ENVMAP_TYPE_CUBE",[ar]:"ENVMAP_TYPE_CUBE_UV"};function F0(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":U0[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const O0={[On]:"ENVMAP_MODE_REFRACTION"};function B0(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":O0[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const z0={[el]:"ENVMAP_BLENDING_MULTIPLY",[kd]:"ENVMAP_BLENDING_MIX",[Nd]:"ENVMAP_BLENDING_ADD"};function H0(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":z0[s.combine]||"ENVMAP_BLENDING_NONE"}function G0(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function V0(s,e,t,i){const n=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=N0(t),l=F0(t),d=B0(t),h=H0(t),u=G0(t),f=T0(t),g=C0(r),y=n.createProgram();let m,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(es).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(es).join(`
`),p.length>0&&(p+=`
`)):(m=[Nc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(es).join(`
`),p=[Nc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ui?"#define TONE_MAPPING":"",t.toneMapping!==ui?Ye.tonemapping_pars_fragment:"",t.toneMapping!==ui?b0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,S0("linearToOutputTexel",t.outputColorSpace),E0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(es).join(`
`)),a=Wa(a),a=Lc(a,t),a=Ic(a,t),o=Wa(o),o=Lc(o,t),o=Ic(o,t),a=kc(a),o=kc(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Oo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Oo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=M+m+a,w=M+p+o,D=Rc(n,n.VERTEX_SHADER,b),E=Rc(n,n.FRAGMENT_SHADER,w);n.attachShader(y,D),n.attachShader(y,E),t.index0AttributeName!==void 0?n.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&n.bindAttribLocation(y,0,"position"),n.linkProgram(y);function P(R){if(s.debug.checkShaderErrors){const F=n.getProgramInfoLog(y)||"",X=n.getShaderInfoLog(D)||"",q=n.getShaderInfoLog(E)||"",k=F.trim(),G=X.trim(),B=q.trim();let ie=!0,ne=!0;if(n.getProgramParameter(y,n.LINK_STATUS)===!1)if(ie=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,y,D,E);else{const me=Dc(n,D,"vertex"),Se=Dc(n,E,"fragment");tt("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(y,n.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+k+`
`+me+`
`+Se)}else k!==""?Ne("WebGLProgram: Program Info Log:",k):(G===""||B==="")&&(ne=!1);ne&&(R.diagnostics={runnable:ie,programLog:k,vertexShader:{log:G,prefix:m},fragmentShader:{log:B,prefix:p}})}n.deleteShader(D),n.deleteShader(E),_=new Ks(n,y),T=A0(n,y)}let _;this.getUniforms=function(){return _===void 0&&P(this),_};let T;this.getAttributes=function(){return T===void 0&&P(this),T};let N=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=n.getProgramParameter(y,_0)),N},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=x0++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=D,this.fragmentShader=E,this}let W0=0;class X0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,n=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new $0(e),t.set(e,i)),i}}class $0{constructor(e){this.id=W0++,this.code=e,this.usedTimes=0}}function q0(s){return s===cn||s===Js||s===Qs}function Y0(s,e,t,i,n,r){const a=new vl,o=new X0,c=new Set,l=[],d=new Map,h=i.logarithmicDepthBuffer;let u=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return c.add(_),_===0?"uv":`uv${_}`}function y(_,T,N,R,F,X){const q=R.fog,k=F.geometry,G=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?R.environment:null,B=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,ie=e.get(_.envMap||G,B),ne=ie&&ie.mapping===ar?ie.image.height:null,me=f[_.type];_.precision!==null&&(u=i.getMaxPrecision(_.precision),u!==_.precision&&Ne("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));const Se=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Ce=Se!==void 0?Se.length:0;let $e=0;k.morphAttributes.position!==void 0&&($e=1),k.morphAttributes.normal!==void 0&&($e=2),k.morphAttributes.color!==void 0&&($e=3);let it,ze,j,ve;if(me){const We=ci[me];it=We.vertexShader,ze=We.fragmentShader}else it=_.vertexShader,ze=_.fragmentShader,o.update(_),j=o.getVertexShaderID(_),ve=o.getFragmentShaderID(_);const oe=s.getRenderTarget(),Pe=s.state.buffers.depth.getReversed(),Ue=F.isInstancedMesh===!0,ke=F.isBatchedMesh===!0,nt=!!_.map,Fe=!!_.matcap,J=!!ie,se=!!_.aoMap,Q=!!_.lightMap,xe=!!_.bumpMap,pe=!!_.normalMap,Oe=!!_.displacementMap,A=!!_.emissiveMap,He=!!_.metalnessMap,Ae=!!_.roughnessMap,Be=_.anisotropy>0,re=_.clearcoat>0,at=_.dispersion>0,S=_.iridescence>0,v=_.sheen>0,O=_.transmission>0,Z=Be&&!!_.anisotropyMap,ee=re&&!!_.clearcoatMap,ae=re&&!!_.clearcoatNormalMap,de=re&&!!_.clearcoatRoughnessMap,$=S&&!!_.iridescenceMap,K=S&&!!_.iridescenceThicknessMap,Me=v&&!!_.sheenColorMap,Ee=v&&!!_.sheenRoughnessMap,ue=!!_.specularMap,ce=!!_.specularColorMap,Ge=!!_.specularIntensityMap,qe=O&&!!_.transmissionMap,rt=O&&!!_.thicknessMap,I=!!_.gradientMap,le=!!_.alphaMap,Y=_.alphaTest>0,we=!!_.alphaHash,fe=!!_.extensions;let te=ui;_.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(te=s.toneMapping);const De={shaderID:me,shaderType:_.type,shaderName:_.name,vertexShader:it,fragmentShader:ze,defines:_.defines,customVertexShaderID:j,customFragmentShaderID:ve,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:ke,batchingColor:ke&&F._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&F.instanceColor!==null,instancingMorph:Ue&&F.morphTexture!==null,outputColorSpace:oe===null?s.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:Qe.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:nt,matcap:Fe,envMap:J,envMapMode:J&&ie.mapping,envMapCubeUVHeight:ne,aoMap:se,lightMap:Q,bumpMap:xe,normalMap:pe,displacementMap:Oe,emissiveMap:A,normalMapObjectSpace:pe&&_.normalMapType===Od,normalMapTangentSpace:pe&&_.normalMapType===Oa,packedNormalMap:pe&&_.normalMapType===Oa&&q0(_.normalMap.format),metalnessMap:He,roughnessMap:Ae,anisotropy:Be,anisotropyMap:Z,clearcoat:re,clearcoatMap:ee,clearcoatNormalMap:ae,clearcoatRoughnessMap:de,dispersion:at,iridescence:S,iridescenceMap:$,iridescenceThicknessMap:K,sheen:v,sheenColorMap:Me,sheenRoughnessMap:Ee,specularMap:ue,specularColorMap:ce,specularIntensityMap:Ge,transmission:O,transmissionMap:qe,thicknessMap:rt,gradientMap:I,opaque:_.transparent===!1&&_.blending===In&&_.alphaToCoverage===!1,alphaMap:le,alphaTest:Y,alphaHash:we,combine:_.combine,mapUv:nt&&g(_.map.channel),aoMapUv:se&&g(_.aoMap.channel),lightMapUv:Q&&g(_.lightMap.channel),bumpMapUv:xe&&g(_.bumpMap.channel),normalMapUv:pe&&g(_.normalMap.channel),displacementMapUv:Oe&&g(_.displacementMap.channel),emissiveMapUv:A&&g(_.emissiveMap.channel),metalnessMapUv:He&&g(_.metalnessMap.channel),roughnessMapUv:Ae&&g(_.roughnessMap.channel),anisotropyMapUv:Z&&g(_.anisotropyMap.channel),clearcoatMapUv:ee&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:ae&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:K&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:Me&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&g(_.sheenRoughnessMap.channel),specularMapUv:ue&&g(_.specularMap.channel),specularColorMapUv:ce&&g(_.specularColorMap.channel),specularIntensityMapUv:Ge&&g(_.specularIntensityMap.channel),transmissionMapUv:qe&&g(_.transmissionMap.channel),thicknessMapUv:rt&&g(_.thicknessMap.channel),alphaMapUv:le&&g(_.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(pe||Be),vertexNormals:!!k.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!k.attributes.uv&&(nt||le),fog:!!q,useFog:_.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||k.attributes.normal===void 0&&pe===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Pe,skinning:F.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:Ce,morphTextureStride:$e,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&N.length>0,shadowMapType:s.shadowMap.type,toneMapping:te,decodeVideoTexture:nt&&_.map.isVideoTexture===!0&&Qe.getTransfer(_.map.colorSpace)===ot,decodeVideoTextureEmissive:A&&_.emissiveMap.isVideoTexture===!0&&Qe.getTransfer(_.emissiveMap.colorSpace)===ot,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ei,flipSided:_.side===zt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:fe&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(fe&&_.extensions.multiDraw===!0||ke)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return De.vertexUv1s=c.has(1),De.vertexUv2s=c.has(2),De.vertexUv3s=c.has(3),c.clear(),De}function m(_){const T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(const N in _.defines)T.push(N),T.push(_.defines[N]);return _.isRawShaderMaterial===!1&&(p(T,_),M(T,_),T.push(s.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function p(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapCubeUVHeight),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.morphAttributeCount),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function M(_,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),_.push(a.mask)}function b(_){const T=f[_.type];let N;if(T){const R=ci[T];N=pu.clone(R.uniforms)}else N=_.uniforms;return N}function w(_,T){let N=d.get(T);return N!==void 0?++N.usedTimes:(N=new V0(s,T,_,n),l.push(N),d.set(T,N)),N}function D(_){if(--_.usedTimes===0){const T=l.indexOf(_);l[T]=l[l.length-1],l.pop(),d.delete(_.cacheKey),_.destroy()}}function E(_){o.remove(_)}function P(){o.dispose()}return{getParameters:y,getProgramCacheKey:m,getUniforms:b,acquireProgram:w,releaseProgram:D,releaseShaderCache:E,programs:l,dispose:P}}function Z0(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function i(a){s.delete(a)}function n(a,o,c){s.get(a)[o]=c}function r(){s=new WeakMap}return{has:e,get:t,remove:i,update:n,dispose:r}}function K0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function Uc(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Fc(){const s=[];let e=0;const t=[],i=[],n=[];function r(){e=0,t.length=0,i.length=0,n.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,g,y,m,p){let M=s[e];return M===void 0?(M={id:u.id,object:u,geometry:f,material:g,materialVariant:a(u),groupOrder:y,renderOrder:u.renderOrder,z:m,group:p},s[e]=M):(M.id=u.id,M.object=u,M.geometry=f,M.material=g,M.materialVariant=a(u),M.groupOrder=y,M.renderOrder=u.renderOrder,M.z=m,M.group=p),e++,M}function c(u,f,g,y,m,p){const M=o(u,f,g,y,m,p);g.transmission>0?i.push(M):g.transparent===!0?n.push(M):t.push(M)}function l(u,f,g,y,m,p){const M=o(u,f,g,y,m,p);g.transmission>0?i.unshift(M):g.transparent===!0?n.unshift(M):t.unshift(M)}function d(u,f){t.length>1&&t.sort(u||K0),i.length>1&&i.sort(f||Uc),n.length>1&&n.sort(f||Uc)}function h(){for(let u=e,f=s.length;u<f;u++){const g=s[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:n,init:r,push:c,unshift:l,finish:h,sort:d}}function j0(){let s=new WeakMap;function e(i,n){const r=s.get(i);let a;return r===void 0?(a=new Fc,s.set(i,[a])):n>=r.length?(a=new Fc,r.push(a)):a=r[n],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function J0(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new et};break;case"SpotLight":t={position:new C,direction:new C,color:new et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new et,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new et,groundColor:new et};break;case"RectAreaLight":t={color:new et,position:new C,halfWidth:new C,halfHeight:new C};break}return s[e.id]=t,t}}}function Q0(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let eg=0;function tg(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function ig(s){const e=new J0,t=Q0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new C);const n=new C,r=new yt,a=new yt;function o(l){let d=0,h=0,u=0;for(let T=0;T<9;T++)i.probe[T].set(0,0,0);let f=0,g=0,y=0,m=0,p=0,M=0,b=0,w=0,D=0,E=0,P=0;l.sort(tg);for(let T=0,N=l.length;T<N;T++){const R=l[T],F=R.color,X=R.intensity,q=R.distance;let k=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===cn?k=R.shadow.map.texture:k=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)d+=F.r*X,h+=F.g*X,u+=F.b*X;else if(R.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(R.sh.coefficients[G],X);P++}else if(R.isDirectionalLight){const G=e.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const B=R.shadow,ie=t.get(R);ie.shadowIntensity=B.intensity,ie.shadowBias=B.bias,ie.shadowNormalBias=B.normalBias,ie.shadowRadius=B.radius,ie.shadowMapSize=B.mapSize,i.directionalShadow[f]=ie,i.directionalShadowMap[f]=k,i.directionalShadowMatrix[f]=R.shadow.matrix,M++}i.directional[f]=G,f++}else if(R.isSpotLight){const G=e.get(R);G.position.setFromMatrixPosition(R.matrixWorld),G.color.copy(F).multiplyScalar(X),G.distance=q,G.coneCos=Math.cos(R.angle),G.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),G.decay=R.decay,i.spot[y]=G;const B=R.shadow;if(R.map&&(i.spotLightMap[D]=R.map,D++,B.updateMatrices(R),R.castShadow&&E++),i.spotLightMatrix[y]=B.matrix,R.castShadow){const ie=t.get(R);ie.shadowIntensity=B.intensity,ie.shadowBias=B.bias,ie.shadowNormalBias=B.normalBias,ie.shadowRadius=B.radius,ie.shadowMapSize=B.mapSize,i.spotShadow[y]=ie,i.spotShadowMap[y]=k,w++}y++}else if(R.isRectAreaLight){const G=e.get(R);G.color.copy(F).multiplyScalar(X),G.halfWidth.set(R.width*.5,0,0),G.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=G,m++}else if(R.isPointLight){const G=e.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),G.distance=R.distance,G.decay=R.decay,R.castShadow){const B=R.shadow,ie=t.get(R);ie.shadowIntensity=B.intensity,ie.shadowBias=B.bias,ie.shadowNormalBias=B.normalBias,ie.shadowRadius=B.radius,ie.shadowMapSize=B.mapSize,ie.shadowCameraNear=B.camera.near,ie.shadowCameraFar=B.camera.far,i.pointShadow[g]=ie,i.pointShadowMap[g]=k,i.pointShadowMatrix[g]=R.shadow.matrix,b++}i.point[g]=G,g++}else if(R.isHemisphereLight){const G=e.get(R);G.skyColor.copy(R.color).multiplyScalar(X),G.groundColor.copy(R.groundColor).multiplyScalar(X),i.hemi[p]=G,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ge.LTC_FLOAT_1,i.rectAreaLTC2=ge.LTC_FLOAT_2):(i.rectAreaLTC1=ge.LTC_HALF_1,i.rectAreaLTC2=ge.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=h,i.ambient[2]=u;const _=i.hash;(_.directionalLength!==f||_.pointLength!==g||_.spotLength!==y||_.rectAreaLength!==m||_.hemiLength!==p||_.numDirectionalShadows!==M||_.numPointShadows!==b||_.numSpotShadows!==w||_.numSpotMaps!==D||_.numLightProbes!==P)&&(i.directional.length=f,i.spot.length=y,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=w+D-E,i.spotLightMap.length=D,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=P,_.directionalLength=f,_.pointLength=g,_.spotLength=y,_.rectAreaLength=m,_.hemiLength=p,_.numDirectionalShadows=M,_.numPointShadows=b,_.numSpotShadows=w,_.numSpotMaps=D,_.numLightProbes=P,i.version=eg++)}function c(l,d){let h=0,u=0,f=0,g=0,y=0;const m=d.matrixWorldInverse;for(let p=0,M=l.length;p<M;p++){const b=l[p];if(b.isDirectionalLight){const w=i.directional[h];w.direction.setFromMatrixPosition(b.matrixWorld),n.setFromMatrixPosition(b.target.matrixWorld),w.direction.sub(n),w.direction.transformDirection(m),h++}else if(b.isSpotLight){const w=i.spot[f];w.position.setFromMatrixPosition(b.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(b.matrixWorld),n.setFromMatrixPosition(b.target.matrixWorld),w.direction.sub(n),w.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const w=i.rectArea[g];w.position.setFromMatrixPosition(b.matrixWorld),w.position.applyMatrix4(m),a.identity(),r.copy(b.matrixWorld),r.premultiply(m),a.extractRotation(r),w.halfWidth.set(b.width*.5,0,0),w.halfHeight.set(0,b.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),g++}else if(b.isPointLight){const w=i.point[u];w.position.setFromMatrixPosition(b.matrixWorld),w.position.applyMatrix4(m),u++}else if(b.isHemisphereLight){const w=i.hemi[y];w.direction.setFromMatrixPosition(b.matrixWorld),w.direction.transformDirection(m),y++}}}return{setup:o,setupView:c,state:i}}function Oc(s){const e=new ig(s),t=[],i=[],n=[];function r(u){h.camera=u,t.length=0,i.length=0,n.length=0}function a(u){t.push(u)}function o(u){i.push(u)}function c(u){n.push(u)}function l(){e.setup(t)}function d(u){e.setupView(t,u)}const h={lightsArray:t,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:d,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function ng(s){let e=new WeakMap;function t(n,r=0){const a=e.get(n);let o;return a===void 0?(o=new Oc(s),e.set(n,[o])):r>=a.length?(o=new Oc(s),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const sg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rg=`uniform sampler2D shadow_pass;
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
}`,ag=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],og=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],Bc=new yt,Zn=new C,$r=new C;function cg(s,e,t){let i=new uo;const n=new he,r=new he,a=new xt,o=new _u,c=new xu,l={},d=t.maxTextureSize,h={[Vi]:zt,[zt]:Vi,[Ei]:Ei},u=new gi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new he},radius:{value:4}},vertexShader:sg,fragmentShader:rg}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ht;g.setAttribute("position",new pi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new L(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xs;let p=this.type;this.render=function(E,P,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===Qc&&(Ne("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Xs);const T=s.getRenderTarget(),N=s.getActiveCubeFace(),R=s.getActiveMipmapLevel(),F=s.state;F.setBlending(Ci),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const X=p!==this.type;X&&P.traverse(function(q){q.material&&(Array.isArray(q.material)?q.material.forEach(k=>k.needsUpdate=!0):q.material.needsUpdate=!0)});for(let q=0,k=E.length;q<k;q++){const G=E[q],B=G.shadow;if(B===void 0){Ne("WebGLShadowMap:",G,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;n.copy(B.mapSize);const ie=B.getFrameExtents();n.multiply(ie),r.copy(B.mapSize),(n.x>d||n.y>d)&&(n.x>d&&(r.x=Math.floor(d/ie.x),n.x=r.x*ie.x,B.mapSize.x=r.x),n.y>d&&(r.y=Math.floor(d/ie.y),n.y=r.y*ie.y,B.mapSize.y=r.y));const ne=s.state.buffers.depth.getReversed();if(B.camera._reversedDepth=ne,B.map===null||X===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Jn){if(G.isPointLight){Ne("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new fi(n.x,n.y,{format:cn,type:Ri,minFilter:Ut,magFilter:Ut,generateMipmaps:!1}),B.map.texture.name=G.name+".shadowMap",B.map.depthTexture=new Bn(n.x,n.y,li),B.map.depthTexture.name=G.name+".shadowMapDepth",B.map.depthTexture.format=Pi,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Dt,B.map.depthTexture.magFilter=Dt}else G.isPointLight?(B.map=new Hl(n.x),B.map.depthTexture=new kh(n.x,mi)):(B.map=new fi(n.x,n.y),B.map.depthTexture=new Bn(n.x,n.y,mi)),B.map.depthTexture.name=G.name+".shadowMap",B.map.depthTexture.format=Pi,this.type===Xs?(B.map.depthTexture.compareFunction=ne?ao:ro,B.map.depthTexture.minFilter=Ut,B.map.depthTexture.magFilter=Ut):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Dt,B.map.depthTexture.magFilter=Dt);B.camera.updateProjectionMatrix()}const me=B.map.isWebGLCubeRenderTarget?6:1;for(let Se=0;Se<me;Se++){if(B.map.isWebGLCubeRenderTarget)s.setRenderTarget(B.map,Se),s.clear();else{Se===0&&(s.setRenderTarget(B.map),s.clear());const Ce=B.getViewport(Se);a.set(r.x*Ce.x,r.y*Ce.y,r.x*Ce.z,r.y*Ce.w),F.viewport(a)}if(G.isPointLight){const Ce=B.camera,$e=B.matrix,it=G.distance||Ce.far;it!==Ce.far&&(Ce.far=it,Ce.updateProjectionMatrix()),Zn.setFromMatrixPosition(G.matrixWorld),Ce.position.copy(Zn),$r.copy(Ce.position),$r.add(ag[Se]),Ce.up.copy(og[Se]),Ce.lookAt($r),Ce.updateMatrixWorld(),$e.makeTranslation(-Zn.x,-Zn.y,-Zn.z),Bc.multiplyMatrices(Ce.projectionMatrix,Ce.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Bc,Ce.coordinateSystem,Ce.reversedDepth)}else B.updateMatrices(G);i=B.getFrustum(),w(P,_,B.camera,G,this.type)}B.isPointLightShadow!==!0&&this.type===Jn&&M(B,_),B.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(T,N,R)};function M(E,P){const _=e.update(y);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new fi(n.x,n.y,{format:cn,type:Ri})),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(P,null,_,u,y,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(P,null,_,f,y,null)}function b(E,P,_,T){let N=null;const R=_.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(R!==void 0)N=R;else if(N=_.isPointLight===!0?c:o,s.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const F=N.uuid,X=P.uuid;let q=l[F];q===void 0&&(q={},l[F]=q);let k=q[X];k===void 0&&(k=N.clone(),q[X]=k,P.addEventListener("dispose",D)),N=k}if(N.visible=P.visible,N.wireframe=P.wireframe,T===Jn?N.side=P.shadowSide!==null?P.shadowSide:P.side:N.side=P.shadowSide!==null?P.shadowSide:h[P.side],N.alphaMap=P.alphaMap,N.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,N.map=P.map,N.clipShadows=P.clipShadows,N.clippingPlanes=P.clippingPlanes,N.clipIntersection=P.clipIntersection,N.displacementMap=P.displacementMap,N.displacementScale=P.displacementScale,N.displacementBias=P.displacementBias,N.wireframeLinewidth=P.wireframeLinewidth,N.linewidth=P.linewidth,_.isPointLight===!0&&N.isMeshDistanceMaterial===!0){const F=s.properties.get(N);F.light=_}return N}function w(E,P,_,T,N){if(E.visible===!1)return;if(E.layers.test(P.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&N===Jn)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,E.matrixWorld);const X=e.update(E),q=E.material;if(Array.isArray(q)){const k=X.groups;for(let G=0,B=k.length;G<B;G++){const ie=k[G],ne=q[ie.materialIndex];if(ne&&ne.visible){const me=b(E,ne,T,N);E.onBeforeShadow(s,E,P,_,X,me,ie),s.renderBufferDirect(_,null,X,me,E,ie),E.onAfterShadow(s,E,P,_,X,me,ie)}}}else if(q.visible){const k=b(E,q,T,N);E.onBeforeShadow(s,E,P,_,X,k,null),s.renderBufferDirect(_,null,X,k,E,null),E.onAfterShadow(s,E,P,_,X,k,null)}}const F=E.children;for(let X=0,q=F.length;X<q;X++)w(F[X],P,_,T,N)}function D(E){E.target.removeEventListener("dispose",D);for(const _ in l){const T=l[_],N=E.target.uuid;N in T&&(T[N].dispose(),delete T[N])}}}function lg(s,e){function t(){let I=!1;const le=new xt;let Y=null;const we=new xt(0,0,0,0);return{setMask:function(fe){Y!==fe&&!I&&(s.colorMask(fe,fe,fe,fe),Y=fe)},setLocked:function(fe){I=fe},setClear:function(fe,te,De,We,Mt){Mt===!0&&(fe*=We,te*=We,De*=We),le.set(fe,te,De,We),we.equals(le)===!1&&(s.clearColor(fe,te,De,We),we.copy(le))},reset:function(){I=!1,Y=null,we.set(-1,0,0,0)}}}function i(){let I=!1,le=!1,Y=null,we=null,fe=null;return{setReversed:function(te){if(le!==te){const De=e.get("EXT_clip_control");te?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT),le=te;const We=fe;fe=null,this.setClear(We)}},getReversed:function(){return le},setTest:function(te){te?oe(s.DEPTH_TEST):Pe(s.DEPTH_TEST)},setMask:function(te){Y!==te&&!I&&(s.depthMask(te),Y=te)},setFunc:function(te){if(le&&(te=Yd[te]),we!==te){switch(te){case Qr:s.depthFunc(s.NEVER);break;case ea:s.depthFunc(s.ALWAYS);break;case ta:s.depthFunc(s.LESS);break;case Fn:s.depthFunc(s.LEQUAL);break;case ia:s.depthFunc(s.EQUAL);break;case na:s.depthFunc(s.GEQUAL);break;case sa:s.depthFunc(s.GREATER);break;case ra:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}we=te}},setLocked:function(te){I=te},setClear:function(te){fe!==te&&(fe=te,le&&(te=1-te),s.clearDepth(te))},reset:function(){I=!1,Y=null,we=null,fe=null,le=!1}}}function n(){let I=!1,le=null,Y=null,we=null,fe=null,te=null,De=null,We=null,Mt=null;return{setTest:function(ct){I||(ct?oe(s.STENCIL_TEST):Pe(s.STENCIL_TEST))},setMask:function(ct){le!==ct&&!I&&(s.stencilMask(ct),le=ct)},setFunc:function(ct,_i,si){(Y!==ct||we!==_i||fe!==si)&&(s.stencilFunc(ct,_i,si),Y=ct,we=_i,fe=si)},setOp:function(ct,_i,si){(te!==ct||De!==_i||We!==si)&&(s.stencilOp(ct,_i,si),te=ct,De=_i,We=si)},setLocked:function(ct){I=ct},setClear:function(ct){Mt!==ct&&(s.clearStencil(ct),Mt=ct)},reset:function(){I=!1,le=null,Y=null,we=null,fe=null,te=null,De=null,We=null,Mt=null}}}const r=new t,a=new i,o=new n,c=new WeakMap,l=new WeakMap;let d={},h={},u={},f=new WeakMap,g=[],y=null,m=!1,p=null,M=null,b=null,w=null,D=null,E=null,P=null,_=new et(0,0,0),T=0,N=!1,R=null,F=null,X=null,q=null,k=null;const G=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,ie=0;const ne=s.getParameter(s.VERSION);ne.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(ne)[1]),B=ie>=1):ne.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),B=ie>=2);let me=null,Se={};const Ce=s.getParameter(s.SCISSOR_BOX),$e=s.getParameter(s.VIEWPORT),it=new xt().fromArray(Ce),ze=new xt().fromArray($e);function j(I,le,Y,we){const fe=new Uint8Array(4),te=s.createTexture();s.bindTexture(I,te),s.texParameteri(I,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(I,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let De=0;De<Y;De++)I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY?s.texImage3D(le,0,s.RGBA,1,1,we,0,s.RGBA,s.UNSIGNED_BYTE,fe):s.texImage2D(le+De,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,fe);return te}const ve={};ve[s.TEXTURE_2D]=j(s.TEXTURE_2D,s.TEXTURE_2D,1),ve[s.TEXTURE_CUBE_MAP]=j(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ve[s.TEXTURE_2D_ARRAY]=j(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ve[s.TEXTURE_3D]=j(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),oe(s.DEPTH_TEST),a.setFunc(Fn),xe(!1),pe(Lo),oe(s.CULL_FACE),se(Ci);function oe(I){d[I]!==!0&&(s.enable(I),d[I]=!0)}function Pe(I){d[I]!==!1&&(s.disable(I),d[I]=!1)}function Ue(I,le){return u[I]!==le?(s.bindFramebuffer(I,le),u[I]=le,I===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=le),I===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=le),!0):!1}function ke(I,le){let Y=g,we=!1;if(I){Y=f.get(le),Y===void 0&&(Y=[],f.set(le,Y));const fe=I.textures;if(Y.length!==fe.length||Y[0]!==s.COLOR_ATTACHMENT0){for(let te=0,De=fe.length;te<De;te++)Y[te]=s.COLOR_ATTACHMENT0+te;Y.length=fe.length,we=!0}}else Y[0]!==s.BACK&&(Y[0]=s.BACK,we=!0);we&&s.drawBuffers(Y)}function nt(I){return y!==I?(s.useProgram(I),y=I,!0):!1}const Fe={[Qi]:s.FUNC_ADD,[vd]:s.FUNC_SUBTRACT,[_d]:s.FUNC_REVERSE_SUBTRACT};Fe[xd]=s.MIN,Fe[yd]=s.MAX;const J={[Md]:s.ZERO,[Sd]:s.ONE,[wd]:s.SRC_COLOR,[jr]:s.SRC_ALPHA,[Rd]:s.SRC_ALPHA_SATURATE,[Cd]:s.DST_COLOR,[Ed]:s.DST_ALPHA,[bd]:s.ONE_MINUS_SRC_COLOR,[Jr]:s.ONE_MINUS_SRC_ALPHA,[Ad]:s.ONE_MINUS_DST_COLOR,[Td]:s.ONE_MINUS_DST_ALPHA,[Pd]:s.CONSTANT_COLOR,[Dd]:s.ONE_MINUS_CONSTANT_COLOR,[Ld]:s.CONSTANT_ALPHA,[Id]:s.ONE_MINUS_CONSTANT_ALPHA};function se(I,le,Y,we,fe,te,De,We,Mt,ct){if(I===Ci){m===!0&&(Pe(s.BLEND),m=!1);return}if(m===!1&&(oe(s.BLEND),m=!0),I!==gd){if(I!==p||ct!==N){if((M!==Qi||D!==Qi)&&(s.blendEquation(s.FUNC_ADD),M=Qi,D=Qi),ct)switch(I){case In:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Io:s.blendFunc(s.ONE,s.ONE);break;case ko:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case No:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:tt("WebGLState: Invalid blending: ",I);break}else switch(I){case In:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Io:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case ko:tt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case No:tt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:tt("WebGLState: Invalid blending: ",I);break}b=null,w=null,E=null,P=null,_.set(0,0,0),T=0,p=I,N=ct}return}fe=fe||le,te=te||Y,De=De||we,(le!==M||fe!==D)&&(s.blendEquationSeparate(Fe[le],Fe[fe]),M=le,D=fe),(Y!==b||we!==w||te!==E||De!==P)&&(s.blendFuncSeparate(J[Y],J[we],J[te],J[De]),b=Y,w=we,E=te,P=De),(We.equals(_)===!1||Mt!==T)&&(s.blendColor(We.r,We.g,We.b,Mt),_.copy(We),T=Mt),p=I,N=!1}function Q(I,le){I.side===Ei?Pe(s.CULL_FACE):oe(s.CULL_FACE);let Y=I.side===zt;le&&(Y=!Y),xe(Y),I.blending===In&&I.transparent===!1?se(Ci):se(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const we=I.stencilWrite;o.setTest(we),we&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),A(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?oe(s.SAMPLE_ALPHA_TO_COVERAGE):Pe(s.SAMPLE_ALPHA_TO_COVERAGE)}function xe(I){R!==I&&(I?s.frontFace(s.CW):s.frontFace(s.CCW),R=I)}function pe(I){I!==pd?(oe(s.CULL_FACE),I!==F&&(I===Lo?s.cullFace(s.BACK):I===md?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Pe(s.CULL_FACE),F=I}function Oe(I){I!==X&&(B&&s.lineWidth(I),X=I)}function A(I,le,Y){I?(oe(s.POLYGON_OFFSET_FILL),(q!==le||k!==Y)&&(q=le,k=Y,a.getReversed()&&(le=-le),s.polygonOffset(le,Y))):Pe(s.POLYGON_OFFSET_FILL)}function He(I){I?oe(s.SCISSOR_TEST):Pe(s.SCISSOR_TEST)}function Ae(I){I===void 0&&(I=s.TEXTURE0+G-1),me!==I&&(s.activeTexture(I),me=I)}function Be(I,le,Y){Y===void 0&&(me===null?Y=s.TEXTURE0+G-1:Y=me);let we=Se[Y];we===void 0&&(we={type:void 0,texture:void 0},Se[Y]=we),(we.type!==I||we.texture!==le)&&(me!==Y&&(s.activeTexture(Y),me=Y),s.bindTexture(I,le||ve[I]),we.type=I,we.texture=le)}function re(){const I=Se[me];I!==void 0&&I.type!==void 0&&(s.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function at(){try{s.compressedTexImage2D(...arguments)}catch(I){tt("WebGLState:",I)}}function S(){try{s.compressedTexImage3D(...arguments)}catch(I){tt("WebGLState:",I)}}function v(){try{s.texSubImage2D(...arguments)}catch(I){tt("WebGLState:",I)}}function O(){try{s.texSubImage3D(...arguments)}catch(I){tt("WebGLState:",I)}}function Z(){try{s.compressedTexSubImage2D(...arguments)}catch(I){tt("WebGLState:",I)}}function ee(){try{s.compressedTexSubImage3D(...arguments)}catch(I){tt("WebGLState:",I)}}function ae(){try{s.texStorage2D(...arguments)}catch(I){tt("WebGLState:",I)}}function de(){try{s.texStorage3D(...arguments)}catch(I){tt("WebGLState:",I)}}function $(){try{s.texImage2D(...arguments)}catch(I){tt("WebGLState:",I)}}function K(){try{s.texImage3D(...arguments)}catch(I){tt("WebGLState:",I)}}function Me(I){return h[I]!==void 0?h[I]:s.getParameter(I)}function Ee(I,le){h[I]!==le&&(s.pixelStorei(I,le),h[I]=le)}function ue(I){it.equals(I)===!1&&(s.scissor(I.x,I.y,I.z,I.w),it.copy(I))}function ce(I){ze.equals(I)===!1&&(s.viewport(I.x,I.y,I.z,I.w),ze.copy(I))}function Ge(I,le){let Y=l.get(le);Y===void 0&&(Y=new WeakMap,l.set(le,Y));let we=Y.get(I);we===void 0&&(we=s.getUniformBlockIndex(le,I.name),Y.set(I,we))}function qe(I,le){const we=l.get(le).get(I);c.get(le)!==we&&(s.uniformBlockBinding(le,we,I.__bindingPointIndex),c.set(le,we))}function rt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),d={},h={},me=null,Se={},u={},f=new WeakMap,g=[],y=null,m=!1,p=null,M=null,b=null,w=null,D=null,E=null,P=null,_=new et(0,0,0),T=0,N=!1,R=null,F=null,X=null,q=null,k=null,it.set(0,0,s.canvas.width,s.canvas.height),ze.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:oe,disable:Pe,bindFramebuffer:Ue,drawBuffers:ke,useProgram:nt,setBlending:se,setMaterial:Q,setFlipSided:xe,setCullFace:pe,setLineWidth:Oe,setPolygonOffset:A,setScissorTest:He,activeTexture:Ae,bindTexture:Be,unbindTexture:re,compressedTexImage2D:at,compressedTexImage3D:S,texImage2D:$,texImage3D:K,pixelStorei:Ee,getParameter:Me,updateUBOMapping:Ge,uniformBlockBinding:qe,texStorage2D:ae,texStorage3D:de,texSubImage2D:v,texSubImage3D:O,compressedTexSubImage2D:Z,compressedTexSubImage3D:ee,scissor:ue,viewport:ce,reset:rt}}function dg(s,e,t,i,n,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new he,d=new WeakMap,h=new Set;let u;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(S,v){return g?new OffscreenCanvas(S,v):ir("canvas")}function m(S,v,O){let Z=1;const ee=at(S);if((ee.width>O||ee.height>O)&&(Z=O/Math.max(ee.width,ee.height)),Z<1)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap||typeof VideoFrame<"u"&&S instanceof VideoFrame){const ae=Math.floor(Z*ee.width),de=Math.floor(Z*ee.height);u===void 0&&(u=y(ae,de));const $=v?y(ae,de):u;return $.width=ae,$.height=de,$.getContext("2d").drawImage(S,0,0,ae,de),Ne("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+ae+"x"+de+")."),$}else return"data"in S&&Ne("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),S;return S}function p(S){return S.generateMipmaps}function M(S){s.generateMipmap(S)}function b(S){return S.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:S.isWebGL3DRenderTarget?s.TEXTURE_3D:S.isWebGLArrayRenderTarget||S.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function w(S,v,O,Z,ee,ae=!1){if(S!==null){if(s[S]!==void 0)return s[S];Ne("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let de;Z&&(de=e.get("EXT_texture_norm16"),de||Ne("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=v;if(v===s.RED&&(O===s.FLOAT&&($=s.R32F),O===s.HALF_FLOAT&&($=s.R16F),O===s.UNSIGNED_BYTE&&($=s.R8),O===s.UNSIGNED_SHORT&&de&&($=de.R16_EXT),O===s.SHORT&&de&&($=de.R16_SNORM_EXT)),v===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&($=s.R8UI),O===s.UNSIGNED_SHORT&&($=s.R16UI),O===s.UNSIGNED_INT&&($=s.R32UI),O===s.BYTE&&($=s.R8I),O===s.SHORT&&($=s.R16I),O===s.INT&&($=s.R32I)),v===s.RG&&(O===s.FLOAT&&($=s.RG32F),O===s.HALF_FLOAT&&($=s.RG16F),O===s.UNSIGNED_BYTE&&($=s.RG8),O===s.UNSIGNED_SHORT&&de&&($=de.RG16_EXT),O===s.SHORT&&de&&($=de.RG16_SNORM_EXT)),v===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&($=s.RG8UI),O===s.UNSIGNED_SHORT&&($=s.RG16UI),O===s.UNSIGNED_INT&&($=s.RG32UI),O===s.BYTE&&($=s.RG8I),O===s.SHORT&&($=s.RG16I),O===s.INT&&($=s.RG32I)),v===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&($=s.RGB8UI),O===s.UNSIGNED_SHORT&&($=s.RGB16UI),O===s.UNSIGNED_INT&&($=s.RGB32UI),O===s.BYTE&&($=s.RGB8I),O===s.SHORT&&($=s.RGB16I),O===s.INT&&($=s.RGB32I)),v===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&($=s.RGBA8UI),O===s.UNSIGNED_SHORT&&($=s.RGBA16UI),O===s.UNSIGNED_INT&&($=s.RGBA32UI),O===s.BYTE&&($=s.RGBA8I),O===s.SHORT&&($=s.RGBA16I),O===s.INT&&($=s.RGBA32I)),v===s.RGB&&(O===s.UNSIGNED_SHORT&&de&&($=de.RGB16_EXT),O===s.SHORT&&de&&($=de.RGB16_SNORM_EXT),O===s.UNSIGNED_INT_5_9_9_9_REV&&($=s.RGB9_E5),O===s.UNSIGNED_INT_10F_11F_11F_REV&&($=s.R11F_G11F_B10F)),v===s.RGBA){const K=ae?tr:Qe.getTransfer(ee);O===s.FLOAT&&($=s.RGBA32F),O===s.HALF_FLOAT&&($=s.RGBA16F),O===s.UNSIGNED_BYTE&&($=K===ot?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT&&de&&($=de.RGBA16_EXT),O===s.SHORT&&de&&($=de.RGBA16_SNORM_EXT),O===s.UNSIGNED_SHORT_4_4_4_4&&($=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&($=s.RGB5_A1)}return($===s.R16F||$===s.R32F||$===s.RG16F||$===s.RG32F||$===s.RGBA16F||$===s.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function D(S,v){let O;return S?v===null||v===mi||v===cs?O=s.DEPTH24_STENCIL8:v===li?O=s.DEPTH32F_STENCIL8:v===os&&(O=s.DEPTH24_STENCIL8,Ne("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===mi||v===cs?O=s.DEPTH_COMPONENT24:v===li?O=s.DEPTH_COMPONENT32F:v===os&&(O=s.DEPTH_COMPONENT16),O}function E(S,v){return p(S)===!0||S.isFramebufferTexture&&S.minFilter!==Dt&&S.minFilter!==Ut?Math.log2(Math.max(v.width,v.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?v.mipmaps.length:1}function P(S){const v=S.target;v.removeEventListener("dispose",P),T(v),v.isVideoTexture&&d.delete(v),v.isHTMLTexture&&h.delete(v)}function _(S){const v=S.target;v.removeEventListener("dispose",_),R(v)}function T(S){const v=i.get(S);if(v.__webglInit===void 0)return;const O=S.source,Z=f.get(O);if(Z){const ee=Z[v.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&N(S),Object.keys(Z).length===0&&f.delete(O)}i.remove(S)}function N(S){const v=i.get(S);s.deleteTexture(v.__webglTexture);const O=S.source,Z=f.get(O);delete Z[v.__cacheKey],a.memory.textures--}function R(S){const v=i.get(S);if(S.depthTexture&&(S.depthTexture.dispose(),i.remove(S.depthTexture)),S.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(v.__webglFramebuffer[Z]))for(let ee=0;ee<v.__webglFramebuffer[Z].length;ee++)s.deleteFramebuffer(v.__webglFramebuffer[Z][ee]);else s.deleteFramebuffer(v.__webglFramebuffer[Z]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[Z])}else{if(Array.isArray(v.__webglFramebuffer))for(let Z=0;Z<v.__webglFramebuffer.length;Z++)s.deleteFramebuffer(v.__webglFramebuffer[Z]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let Z=0;Z<v.__webglColorRenderbuffer.length;Z++)v.__webglColorRenderbuffer[Z]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[Z]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const O=S.textures;for(let Z=0,ee=O.length;Z<ee;Z++){const ae=i.get(O[Z]);ae.__webglTexture&&(s.deleteTexture(ae.__webglTexture),a.memory.textures--),i.remove(O[Z])}i.remove(S)}let F=0;function X(){F=0}function q(){return F}function k(S){F=S}function G(){const S=F;return S>=n.maxTextures&&Ne("WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+n.maxTextures),F+=1,S}function B(S){const v=[];return v.push(S.wrapS),v.push(S.wrapT),v.push(S.wrapR||0),v.push(S.magFilter),v.push(S.minFilter),v.push(S.anisotropy),v.push(S.internalFormat),v.push(S.format),v.push(S.type),v.push(S.generateMipmaps),v.push(S.premultiplyAlpha),v.push(S.flipY),v.push(S.unpackAlignment),v.push(S.colorSpace),v.join()}function ie(S,v){const O=i.get(S);if(S.isVideoTexture&&Be(S),S.isRenderTargetTexture===!1&&S.isExternalTexture!==!0&&S.version>0&&O.__version!==S.version){const Z=S.image;if(Z===null)Ne("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Ne("WebGLRenderer: Texture marked for update but image is incomplete");else{Pe(O,S,v);return}}else S.isExternalTexture&&(O.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+v)}function ne(S,v){const O=i.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&O.__version!==S.version){Pe(O,S,v);return}else S.isExternalTexture&&(O.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+v)}function me(S,v){const O=i.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&O.__version!==S.version){Pe(O,S,v);return}t.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+v)}function Se(S,v){const O=i.get(S);if(S.isCubeDepthTexture!==!0&&S.version>0&&O.__version!==S.version){Ue(O,S,v);return}t.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+v)}const Ce={[aa]:s.REPEAT,[Ti]:s.CLAMP_TO_EDGE,[oa]:s.MIRRORED_REPEAT},$e={[Dt]:s.NEAREST,[Ud]:s.NEAREST_MIPMAP_NEAREST,[xs]:s.NEAREST_MIPMAP_LINEAR,[Ut]:s.LINEAR,[pr]:s.LINEAR_MIPMAP_NEAREST,[nn]:s.LINEAR_MIPMAP_LINEAR},it={[Bd]:s.NEVER,[Wd]:s.ALWAYS,[zd]:s.LESS,[ro]:s.LEQUAL,[Hd]:s.EQUAL,[ao]:s.GEQUAL,[Gd]:s.GREATER,[Vd]:s.NOTEQUAL};function ze(S,v){if(v.type===li&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Ut||v.magFilter===pr||v.magFilter===xs||v.magFilter===nn||v.minFilter===Ut||v.minFilter===pr||v.minFilter===xs||v.minFilter===nn)&&Ne("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(S,s.TEXTURE_WRAP_S,Ce[v.wrapS]),s.texParameteri(S,s.TEXTURE_WRAP_T,Ce[v.wrapT]),(S===s.TEXTURE_3D||S===s.TEXTURE_2D_ARRAY)&&s.texParameteri(S,s.TEXTURE_WRAP_R,Ce[v.wrapR]),s.texParameteri(S,s.TEXTURE_MAG_FILTER,$e[v.magFilter]),s.texParameteri(S,s.TEXTURE_MIN_FILTER,$e[v.minFilter]),v.compareFunction&&(s.texParameteri(S,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(S,s.TEXTURE_COMPARE_FUNC,it[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Dt||v.minFilter!==xs&&v.minFilter!==nn||v.type===li&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");s.texParameterf(S,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,n.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function j(S,v){let O=!1;S.__webglInit===void 0&&(S.__webglInit=!0,v.addEventListener("dispose",P));const Z=v.source;let ee=f.get(Z);ee===void 0&&(ee={},f.set(Z,ee));const ae=B(v);if(ae!==S.__cacheKey){ee[ae]===void 0&&(ee[ae]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,O=!0),ee[ae].usedTimes++;const de=ee[S.__cacheKey];de!==void 0&&(ee[S.__cacheKey].usedTimes--,de.usedTimes===0&&N(v)),S.__cacheKey=ae,S.__webglTexture=ee[ae].texture}return O}function ve(S,v,O){return Math.floor(Math.floor(S/O)/v)}function oe(S,v,O,Z){const ae=S.updateRanges;if(ae.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,v.width,v.height,O,Z,v.data);else{ae.sort((Ee,ue)=>Ee.start-ue.start);let de=0;for(let Ee=1;Ee<ae.length;Ee++){const ue=ae[de],ce=ae[Ee],Ge=ue.start+ue.count,qe=ve(ce.start,v.width,4),rt=ve(ue.start,v.width,4);ce.start<=Ge+1&&qe===rt&&ve(ce.start+ce.count-1,v.width,4)===qe?ue.count=Math.max(ue.count,ce.start+ce.count-ue.start):(++de,ae[de]=ce)}ae.length=de+1;const $=t.getParameter(s.UNPACK_ROW_LENGTH),K=t.getParameter(s.UNPACK_SKIP_PIXELS),Me=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,v.width);for(let Ee=0,ue=ae.length;Ee<ue;Ee++){const ce=ae[Ee],Ge=Math.floor(ce.start/4),qe=Math.ceil(ce.count/4),rt=Ge%v.width,I=Math.floor(Ge/v.width),le=qe,Y=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,rt),t.pixelStorei(s.UNPACK_SKIP_ROWS,I),t.texSubImage2D(s.TEXTURE_2D,0,rt,I,le,Y,O,Z,v.data)}S.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,$),t.pixelStorei(s.UNPACK_SKIP_PIXELS,K),t.pixelStorei(s.UNPACK_SKIP_ROWS,Me)}}function Pe(S,v,O){let Z=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Z=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Z=s.TEXTURE_3D);const ee=j(S,v),ae=v.source;t.bindTexture(Z,S.__webglTexture,s.TEXTURE0+O);const de=i.get(ae);if(ae.version!==de.__version||ee===!0){if(t.activeTexture(s.TEXTURE0+O),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){const Y=Qe.getPrimaries(Qe.workingColorSpace),we=v.colorSpace===zi?null:Qe.getPrimaries(v.colorSpace),fe=v.colorSpace===zi||Y===we?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe)}t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment);let K=m(v.image,!1,n.maxTextureSize);K=re(v,K);const Me=r.convert(v.format,v.colorSpace),Ee=r.convert(v.type);let ue=w(v.internalFormat,Me,Ee,v.normalized,v.colorSpace,v.isVideoTexture);ze(Z,v);let ce;const Ge=v.mipmaps,qe=v.isVideoTexture!==!0,rt=de.__version===void 0||ee===!0,I=ae.dataReady,le=E(v,K);if(v.isDepthTexture)ue=D(v.format===sn,v.type),rt&&(qe?t.texStorage2D(s.TEXTURE_2D,1,ue,K.width,K.height):t.texImage2D(s.TEXTURE_2D,0,ue,K.width,K.height,0,Me,Ee,null));else if(v.isDataTexture)if(Ge.length>0){qe&&rt&&t.texStorage2D(s.TEXTURE_2D,le,ue,Ge[0].width,Ge[0].height);for(let Y=0,we=Ge.length;Y<we;Y++)ce=Ge[Y],qe?I&&t.texSubImage2D(s.TEXTURE_2D,Y,0,0,ce.width,ce.height,Me,Ee,ce.data):t.texImage2D(s.TEXTURE_2D,Y,ue,ce.width,ce.height,0,Me,Ee,ce.data);v.generateMipmaps=!1}else qe?(rt&&t.texStorage2D(s.TEXTURE_2D,le,ue,K.width,K.height),I&&oe(v,K,Me,Ee)):t.texImage2D(s.TEXTURE_2D,0,ue,K.width,K.height,0,Me,Ee,K.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){qe&&rt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,le,ue,Ge[0].width,Ge[0].height,K.depth);for(let Y=0,we=Ge.length;Y<we;Y++)if(ce=Ge[Y],v.format!==ni)if(Me!==null)if(qe){if(I)if(v.layerUpdates.size>0){const fe=gc(ce.width,ce.height,v.format,v.type);for(const te of v.layerUpdates){const De=ce.data.subarray(te*fe/ce.data.BYTES_PER_ELEMENT,(te+1)*fe/ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Y,0,0,te,ce.width,ce.height,1,Me,De)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Y,0,0,0,ce.width,ce.height,K.depth,Me,ce.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Y,ue,ce.width,ce.height,K.depth,0,ce.data,0,0);else Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else qe?I&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,Y,0,0,0,ce.width,ce.height,K.depth,Me,Ee,ce.data):t.texImage3D(s.TEXTURE_2D_ARRAY,Y,ue,ce.width,ce.height,K.depth,0,Me,Ee,ce.data)}else{qe&&rt&&t.texStorage2D(s.TEXTURE_2D,le,ue,Ge[0].width,Ge[0].height);for(let Y=0,we=Ge.length;Y<we;Y++)ce=Ge[Y],v.format!==ni?Me!==null?qe?I&&t.compressedTexSubImage2D(s.TEXTURE_2D,Y,0,0,ce.width,ce.height,Me,ce.data):t.compressedTexImage2D(s.TEXTURE_2D,Y,ue,ce.width,ce.height,0,ce.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qe?I&&t.texSubImage2D(s.TEXTURE_2D,Y,0,0,ce.width,ce.height,Me,Ee,ce.data):t.texImage2D(s.TEXTURE_2D,Y,ue,ce.width,ce.height,0,Me,Ee,ce.data)}else if(v.isDataArrayTexture)if(qe){if(rt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,le,ue,K.width,K.height,K.depth),I)if(v.layerUpdates.size>0){const Y=gc(K.width,K.height,v.format,v.type);for(const we of v.layerUpdates){const fe=K.data.subarray(we*Y/K.data.BYTES_PER_ELEMENT,(we+1)*Y/K.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,we,K.width,K.height,1,Me,Ee,fe)}v.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,Me,Ee,K.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ue,K.width,K.height,K.depth,0,Me,Ee,K.data);else if(v.isData3DTexture)qe?(rt&&t.texStorage3D(s.TEXTURE_3D,le,ue,K.width,K.height,K.depth),I&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,Me,Ee,K.data)):t.texImage3D(s.TEXTURE_3D,0,ue,K.width,K.height,K.depth,0,Me,Ee,K.data);else if(v.isFramebufferTexture){if(rt)if(qe)t.texStorage2D(s.TEXTURE_2D,le,ue,K.width,K.height);else{let Y=K.width,we=K.height;for(let fe=0;fe<le;fe++)t.texImage2D(s.TEXTURE_2D,fe,ue,Y,we,0,Me,Ee,null),Y>>=1,we>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in s){const Y=s.canvas;if(Y.hasAttribute("layoutsubtree")||Y.setAttribute("layoutsubtree","true"),K.parentNode!==Y){Y.appendChild(K),h.add(v),Y.onpaint=We=>{const Mt=We.changedElements;for(const ct of h)Mt.includes(ct.image)&&(ct.needsUpdate=!0)},Y.requestPaint();return}const we=0,fe=s.RGBA,te=s.RGBA,De=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,we,fe,te,De,K),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ge.length>0){if(qe&&rt){const Y=at(Ge[0]);t.texStorage2D(s.TEXTURE_2D,le,ue,Y.width,Y.height)}for(let Y=0,we=Ge.length;Y<we;Y++)ce=Ge[Y],qe?I&&t.texSubImage2D(s.TEXTURE_2D,Y,0,0,Me,Ee,ce):t.texImage2D(s.TEXTURE_2D,Y,ue,Me,Ee,ce);v.generateMipmaps=!1}else if(qe){if(rt){const Y=at(K);t.texStorage2D(s.TEXTURE_2D,le,ue,Y.width,Y.height)}I&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Me,Ee,K)}else t.texImage2D(s.TEXTURE_2D,0,ue,Me,Ee,K);p(v)&&M(Z),de.__version=ae.version,v.onUpdate&&v.onUpdate(v)}S.__version=v.version}function Ue(S,v,O){if(v.image.length!==6)return;const Z=j(S,v),ee=v.source;t.bindTexture(s.TEXTURE_CUBE_MAP,S.__webglTexture,s.TEXTURE0+O);const ae=i.get(ee);if(ee.version!==ae.__version||Z===!0){t.activeTexture(s.TEXTURE0+O);const de=Qe.getPrimaries(Qe.workingColorSpace),$=v.colorSpace===zi?null:Qe.getPrimaries(v.colorSpace),K=v.colorSpace===zi||de===$?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);const Me=v.isCompressedTexture||v.image[0].isCompressedTexture,Ee=v.image[0]&&v.image[0].isDataTexture,ue=[];for(let te=0;te<6;te++)!Me&&!Ee?ue[te]=m(v.image[te],!0,n.maxCubemapSize):ue[te]=Ee?v.image[te].image:v.image[te],ue[te]=re(v,ue[te]);const ce=ue[0],Ge=r.convert(v.format,v.colorSpace),qe=r.convert(v.type),rt=w(v.internalFormat,Ge,qe,v.normalized,v.colorSpace),I=v.isVideoTexture!==!0,le=ae.__version===void 0||Z===!0,Y=ee.dataReady;let we=E(v,ce);ze(s.TEXTURE_CUBE_MAP,v);let fe;if(Me){I&&le&&t.texStorage2D(s.TEXTURE_CUBE_MAP,we,rt,ce.width,ce.height);for(let te=0;te<6;te++){fe=ue[te].mipmaps;for(let De=0;De<fe.length;De++){const We=fe[De];v.format!==ni?Ge!==null?I?Y&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,De,0,0,We.width,We.height,Ge,We.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,De,rt,We.width,We.height,0,We.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?Y&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,De,0,0,We.width,We.height,Ge,qe,We.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,De,rt,We.width,We.height,0,Ge,qe,We.data)}}}else{if(fe=v.mipmaps,I&&le){fe.length>0&&we++;const te=at(ue[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,we,rt,te.width,te.height)}for(let te=0;te<6;te++)if(Ee){I?Y&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,ue[te].width,ue[te].height,Ge,qe,ue[te].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,rt,ue[te].width,ue[te].height,0,Ge,qe,ue[te].data);for(let De=0;De<fe.length;De++){const Mt=fe[De].image[te].image;I?Y&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,De+1,0,0,Mt.width,Mt.height,Ge,qe,Mt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,De+1,rt,Mt.width,Mt.height,0,Ge,qe,Mt.data)}}else{I?Y&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Ge,qe,ue[te]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,rt,Ge,qe,ue[te]);for(let De=0;De<fe.length;De++){const We=fe[De];I?Y&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,De+1,0,0,Ge,qe,We.image[te]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+te,De+1,rt,Ge,qe,We.image[te])}}}p(v)&&M(s.TEXTURE_CUBE_MAP),ae.__version=ee.version,v.onUpdate&&v.onUpdate(v)}S.__version=v.version}function ke(S,v,O,Z,ee,ae){const de=r.convert(O.format,O.colorSpace),$=r.convert(O.type),K=w(O.internalFormat,de,$,O.normalized,O.colorSpace),Me=i.get(v),Ee=i.get(O);if(Ee.__renderTarget=v,!Me.__hasExternalTextures){const ue=Math.max(1,v.width>>ae),ce=Math.max(1,v.height>>ae);ee===s.TEXTURE_3D||ee===s.TEXTURE_2D_ARRAY?t.texImage3D(ee,ae,K,ue,ce,v.depth,0,de,$,null):t.texImage2D(ee,ae,K,ue,ce,0,de,$,null)}t.bindFramebuffer(s.FRAMEBUFFER,S),Ae(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Z,ee,Ee.__webglTexture,0,He(v)):(ee===s.TEXTURE_2D||ee>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Z,ee,Ee.__webglTexture,ae),t.bindFramebuffer(s.FRAMEBUFFER,null)}function nt(S,v,O){if(s.bindRenderbuffer(s.RENDERBUFFER,S),v.depthBuffer){const Z=v.depthTexture,ee=Z&&Z.isDepthTexture?Z.type:null,ae=D(v.stencilBuffer,ee),de=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Ae(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,He(v),ae,v.width,v.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,He(v),ae,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,ae,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,de,s.RENDERBUFFER,S)}else{const Z=v.textures;for(let ee=0;ee<Z.length;ee++){const ae=Z[ee],de=r.convert(ae.format,ae.colorSpace),$=r.convert(ae.type),K=w(ae.internalFormat,de,$,ae.normalized,ae.colorSpace);Ae(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,He(v),K,v.width,v.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,He(v),K,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,K,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Fe(S,v,O){const Z=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,S),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ee=i.get(v.depthTexture);if(ee.__renderTarget=v,(!ee.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),Z){if(ee.__webglInit===void 0&&(ee.__webglInit=!0,v.depthTexture.addEventListener("dispose",P)),ee.__webglTexture===void 0){ee.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,ee.__webglTexture),ze(s.TEXTURE_CUBE_MAP,v.depthTexture);const Me=r.convert(v.depthTexture.format),Ee=r.convert(v.depthTexture.type);let ue;v.depthTexture.format===Pi?ue=s.DEPTH_COMPONENT24:v.depthTexture.format===sn&&(ue=s.DEPTH24_STENCIL8);for(let ce=0;ce<6;ce++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,ue,v.width,v.height,0,Me,Ee,null)}}else ie(v.depthTexture,0);const ae=ee.__webglTexture,de=He(v),$=Z?s.TEXTURE_CUBE_MAP_POSITIVE_X+O:s.TEXTURE_2D,K=v.depthTexture.format===sn?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(v.depthTexture.format===Pi)Ae(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,K,$,ae,0,de):s.framebufferTexture2D(s.FRAMEBUFFER,K,$,ae,0);else if(v.depthTexture.format===sn)Ae(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,K,$,ae,0,de):s.framebufferTexture2D(s.FRAMEBUFFER,K,$,ae,0);else throw new Error("Unknown depthTexture format")}function J(S){const v=i.get(S),O=S.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==S.depthTexture){const Z=S.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),Z){const ee=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,Z.removeEventListener("dispose",ee)};Z.addEventListener("dispose",ee),v.__depthDisposeCallback=ee}v.__boundDepthTexture=Z}if(S.depthTexture&&!v.__autoAllocateDepthBuffer)if(O)for(let Z=0;Z<6;Z++)Fe(v.__webglFramebuffer[Z],S,Z);else{const Z=S.texture.mipmaps;Z&&Z.length>0?Fe(v.__webglFramebuffer[0],S,0):Fe(v.__webglFramebuffer,S,0)}else if(O){v.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[Z]),v.__webglDepthbuffer[Z]===void 0)v.__webglDepthbuffer[Z]=s.createRenderbuffer(),nt(v.__webglDepthbuffer[Z],S,!1);else{const ee=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ae=v.__webglDepthbuffer[Z];s.bindRenderbuffer(s.RENDERBUFFER,ae),s.framebufferRenderbuffer(s.FRAMEBUFFER,ee,s.RENDERBUFFER,ae)}}else{const Z=S.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),nt(v.__webglDepthbuffer,S,!1);else{const ee=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ae=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ae),s.framebufferRenderbuffer(s.FRAMEBUFFER,ee,s.RENDERBUFFER,ae)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function se(S,v,O){const Z=i.get(S);v!==void 0&&ke(Z.__webglFramebuffer,S,S.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&J(S)}function Q(S){const v=S.texture,O=i.get(S),Z=i.get(v);S.addEventListener("dispose",_);const ee=S.textures,ae=S.isWebGLCubeRenderTarget===!0,de=ee.length>1;if(de||(Z.__webglTexture===void 0&&(Z.__webglTexture=s.createTexture()),Z.__version=v.version,a.memory.textures++),ae){O.__webglFramebuffer=[];for(let $=0;$<6;$++)if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[$]=[];for(let K=0;K<v.mipmaps.length;K++)O.__webglFramebuffer[$][K]=s.createFramebuffer()}else O.__webglFramebuffer[$]=s.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let $=0;$<v.mipmaps.length;$++)O.__webglFramebuffer[$]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(de)for(let $=0,K=ee.length;$<K;$++){const Me=i.get(ee[$]);Me.__webglTexture===void 0&&(Me.__webglTexture=s.createTexture(),a.memory.textures++)}if(S.samples>0&&Ae(S)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let $=0;$<ee.length;$++){const K=ee[$];O.__webglColorRenderbuffer[$]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[$]);const Me=r.convert(K.format,K.colorSpace),Ee=r.convert(K.type),ue=w(K.internalFormat,Me,Ee,K.normalized,K.colorSpace,S.isXRRenderTarget===!0),ce=He(S);s.renderbufferStorageMultisample(s.RENDERBUFFER,ce,ue,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+$,s.RENDERBUFFER,O.__webglColorRenderbuffer[$])}s.bindRenderbuffer(s.RENDERBUFFER,null),S.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),nt(O.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ae){t.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture),ze(s.TEXTURE_CUBE_MAP,v);for(let $=0;$<6;$++)if(v.mipmaps&&v.mipmaps.length>0)for(let K=0;K<v.mipmaps.length;K++)ke(O.__webglFramebuffer[$][K],S,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+$,K);else ke(O.__webglFramebuffer[$],S,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);p(v)&&M(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let $=0,K=ee.length;$<K;$++){const Me=ee[$],Ee=i.get(Me);let ue=s.TEXTURE_2D;(S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(ue=S.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ue,Ee.__webglTexture),ze(ue,Me),ke(O.__webglFramebuffer,S,Me,s.COLOR_ATTACHMENT0+$,ue,0),p(Me)&&M(ue)}t.unbindTexture()}else{let $=s.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&($=S.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture($,Z.__webglTexture),ze($,v),v.mipmaps&&v.mipmaps.length>0)for(let K=0;K<v.mipmaps.length;K++)ke(O.__webglFramebuffer[K],S,v,s.COLOR_ATTACHMENT0,$,K);else ke(O.__webglFramebuffer,S,v,s.COLOR_ATTACHMENT0,$,0);p(v)&&M($),t.unbindTexture()}S.depthBuffer&&J(S)}function xe(S){const v=S.textures;for(let O=0,Z=v.length;O<Z;O++){const ee=v[O];if(p(ee)){const ae=b(S),de=i.get(ee).__webglTexture;t.bindTexture(ae,de),M(ae),t.unbindTexture()}}}const pe=[],Oe=[];function A(S){if(S.samples>0){if(Ae(S)===!1){const v=S.textures,O=S.width,Z=S.height;let ee=s.COLOR_BUFFER_BIT;const ae=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,de=i.get(S),$=v.length>1;if($)for(let Me=0;Me<v.length;Me++)t.bindFramebuffer(s.FRAMEBUFFER,de.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,de.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);const K=S.texture.mipmaps;K&&K.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let Me=0;Me<v.length;Me++){if(S.resolveDepthBuffer&&(S.depthBuffer&&(ee|=s.DEPTH_BUFFER_BIT),S.stencilBuffer&&S.resolveStencilBuffer&&(ee|=s.STENCIL_BUFFER_BIT)),$){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,de.__webglColorRenderbuffer[Me]);const Ee=i.get(v[Me]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ee,0)}s.blitFramebuffer(0,0,O,Z,0,0,O,Z,ee,s.NEAREST),c===!0&&(pe.length=0,Oe.length=0,pe.push(s.COLOR_ATTACHMENT0+Me),S.depthBuffer&&S.resolveDepthBuffer===!1&&(pe.push(ae),Oe.push(ae),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Oe)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,pe))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),$)for(let Me=0;Me<v.length;Me++){t.bindFramebuffer(s.FRAMEBUFFER,de.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,de.__webglColorRenderbuffer[Me]);const Ee=i.get(v[Me]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,de.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,Ee,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(S.depthBuffer&&S.resolveDepthBuffer===!1&&c){const v=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function He(S){return Math.min(n.maxSamples,S.samples)}function Ae(S){const v=i.get(S);return S.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Be(S){const v=a.render.frame;d.get(S)!==v&&(d.set(S,v),S.update())}function re(S,v){const O=S.colorSpace,Z=S.format,ee=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||O!==er&&O!==zi&&(Qe.getTransfer(O)===ot?(Z!==ni||ee!==qt)&&Ne("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):tt("WebGLTextures: Unsupported texture color space:",O)),v}function at(S){return typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement?(l.width=S.naturalWidth||S.width,l.height=S.naturalHeight||S.height):typeof VideoFrame<"u"&&S instanceof VideoFrame?(l.width=S.displayWidth,l.height=S.displayHeight):(l.width=S.width,l.height=S.height),l}this.allocateTextureUnit=G,this.resetTextureUnits=X,this.getTextureUnits=q,this.setTextureUnits=k,this.setTexture2D=ie,this.setTexture2DArray=ne,this.setTexture3D=me,this.setTextureCube=Se,this.rebindTextures=se,this.setupRenderTarget=Q,this.updateRenderTargetMipmap=xe,this.updateMultisampleRenderTarget=A,this.setupDepthRenderbuffer=J,this.setupFrameBufferTexture=ke,this.useMultisampledRTT=Ae,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function hg(s,e){function t(i,n=zi){let r;const a=Qe.getTransfer(n);if(i===qt)return s.UNSIGNED_BYTE;if(i===eo)return s.UNSIGNED_SHORT_4_4_4_4;if(i===to)return s.UNSIGNED_SHORT_5_5_5_1;if(i===dl)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===hl)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===cl)return s.BYTE;if(i===ll)return s.SHORT;if(i===os)return s.UNSIGNED_SHORT;if(i===Qa)return s.INT;if(i===mi)return s.UNSIGNED_INT;if(i===li)return s.FLOAT;if(i===Ri)return s.HALF_FLOAT;if(i===ul)return s.ALPHA;if(i===fl)return s.RGB;if(i===ni)return s.RGBA;if(i===Pi)return s.DEPTH_COMPONENT;if(i===sn)return s.DEPTH_STENCIL;if(i===pl)return s.RED;if(i===io)return s.RED_INTEGER;if(i===cn)return s.RG;if(i===no)return s.RG_INTEGER;if(i===so)return s.RGBA_INTEGER;if(i===$s||i===qs||i===Ys||i===Zs)if(a===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===$s)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===qs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ys)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Zs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===$s)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===qs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ys)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Zs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ca||i===la||i===da||i===ha)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===ca)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===la)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===da)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ha)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ua||i===fa||i===pa||i===ma||i===ga||i===Js||i===va)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===ua||i===fa)return a===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===pa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===ma)return r.COMPRESSED_R11_EAC;if(i===ga)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Js)return r.COMPRESSED_RG11_EAC;if(i===va)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===_a||i===xa||i===ya||i===Ma||i===Sa||i===wa||i===ba||i===Ea||i===Ta||i===Ca||i===Aa||i===Ra||i===Pa||i===Da)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===_a)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===xa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ya)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ma)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Sa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===wa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ba)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ea)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ta)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ca)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Aa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ra)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Pa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Da)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===La||i===Ia||i===ka)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===La)return a===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ia)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ka)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Na||i===Ua||i===Qs||i===Fa)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Na)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ua)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Qs)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Fa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===cs?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:t}}const ug=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fg=`
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

}`;class pg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new bl(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new gi({vertexShader:ug,fragmentShader:fg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new L(new Gi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class mg extends hn{constructor(e,t){super();const i=this;let n=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,h=null,u=null,f=null,g=null;const y=typeof XRWebGLBinding<"u",m=new pg,p={},M=t.getContextAttributes();let b=null,w=null;const D=[],E=[],P=new he;let _=null;const T=new $t;T.viewport=new xt;const N=new $t;N.viewport=new xt;const R=[T,N],F=new wu;let X=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ve=D[j];return ve===void 0&&(ve=new yr,D[j]=ve),ve.getTargetRaySpace()},this.getControllerGrip=function(j){let ve=D[j];return ve===void 0&&(ve=new yr,D[j]=ve),ve.getGripSpace()},this.getHand=function(j){let ve=D[j];return ve===void 0&&(ve=new yr,D[j]=ve),ve.getHandSpace()};function k(j){const ve=E.indexOf(j.inputSource);if(ve===-1)return;const oe=D[ve];oe!==void 0&&(oe.update(j.inputSource,j.frame,l||a),oe.dispatchEvent({type:j.type,data:j.inputSource}))}function G(){n.removeEventListener("select",k),n.removeEventListener("selectstart",k),n.removeEventListener("selectend",k),n.removeEventListener("squeeze",k),n.removeEventListener("squeezestart",k),n.removeEventListener("squeezeend",k),n.removeEventListener("end",G),n.removeEventListener("inputsourceschange",B);for(let j=0;j<D.length;j++){const ve=E[j];ve!==null&&(E[j]=null,D[j].disconnect(ve))}X=null,q=null,m.reset();for(const j in p)delete p[j];e.setRenderTarget(b),f=null,u=null,h=null,n=null,w=null,ze.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,i.isPresenting===!0&&Ne("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,i.isPresenting===!0&&Ne("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return h===null&&y&&(h=new XRWebGLBinding(n,t)),h},this.getFrame=function(){return g},this.getSession=function(){return n},this.setSession=async function(j){if(n=j,n!==null){if(b=e.getRenderTarget(),n.addEventListener("select",k),n.addEventListener("selectstart",k),n.addEventListener("selectend",k),n.addEventListener("squeeze",k),n.addEventListener("squeezestart",k),n.addEventListener("squeezeend",k),n.addEventListener("end",G),n.addEventListener("inputsourceschange",B),M.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(P),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let oe=null,Pe=null,Ue=null;M.depth&&(Ue=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=M.stencil?sn:Pi,Pe=M.stencil?cs:mi);const ke={colorFormat:t.RGBA8,depthFormat:Ue,scaleFactor:r};h=this.getBinding(),u=h.createProjectionLayer(ke),n.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),w=new fi(u.textureWidth,u.textureHeight,{format:ni,type:qt,depthTexture:new Bn(u.textureWidth,u.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const oe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(n,t,oe),n.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),w=new fi(f.framebufferWidth,f.framebufferHeight,{format:ni,type:qt,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await n.requestReferenceSpace(o),ze.setContext(n),ze.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function B(j){for(let ve=0;ve<j.removed.length;ve++){const oe=j.removed[ve],Pe=E.indexOf(oe);Pe>=0&&(E[Pe]=null,D[Pe].disconnect(oe))}for(let ve=0;ve<j.added.length;ve++){const oe=j.added[ve];let Pe=E.indexOf(oe);if(Pe===-1){for(let ke=0;ke<D.length;ke++)if(ke>=E.length){E.push(oe),Pe=ke;break}else if(E[ke]===null){E[ke]=oe,Pe=ke;break}if(Pe===-1)break}const Ue=D[Pe];Ue&&Ue.connect(oe)}}const ie=new C,ne=new C;function me(j,ve,oe){ie.setFromMatrixPosition(ve.matrixWorld),ne.setFromMatrixPosition(oe.matrixWorld);const Pe=ie.distanceTo(ne),Ue=ve.projectionMatrix.elements,ke=oe.projectionMatrix.elements,nt=Ue[14]/(Ue[10]-1),Fe=Ue[14]/(Ue[10]+1),J=(Ue[9]+1)/Ue[5],se=(Ue[9]-1)/Ue[5],Q=(Ue[8]-1)/Ue[0],xe=(ke[8]+1)/ke[0],pe=nt*Q,Oe=nt*xe,A=Pe/(-Q+xe),He=A*-Q;if(ve.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(He),j.translateZ(A),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Ue[10]===-1)j.projectionMatrix.copy(ve.projectionMatrix),j.projectionMatrixInverse.copy(ve.projectionMatrixInverse);else{const Ae=nt+A,Be=Fe+A,re=pe-He,at=Oe+(Pe-He),S=J*Fe/Be*Ae,v=se*Fe/Be*Ae;j.projectionMatrix.makePerspective(re,at,S,v,Ae,Be),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function Se(j,ve){ve===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ve.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(n===null)return;let ve=j.near,oe=j.far;m.texture!==null&&(m.depthNear>0&&(ve=m.depthNear),m.depthFar>0&&(oe=m.depthFar)),F.near=N.near=T.near=ve,F.far=N.far=T.far=oe,(X!==F.near||q!==F.far)&&(n.updateRenderState({depthNear:F.near,depthFar:F.far}),X=F.near,q=F.far),F.layers.mask=j.layers.mask|6,T.layers.mask=F.layers.mask&-5,N.layers.mask=F.layers.mask&-3;const Pe=j.parent,Ue=F.cameras;Se(F,Pe);for(let ke=0;ke<Ue.length;ke++)Se(Ue[ke],Pe);Ue.length===2?me(F,T,N):F.projectionMatrix.copy(T.projectionMatrix),Ce(j,F,Pe)};function Ce(j,ve,oe){oe===null?j.matrix.copy(ve.matrixWorld):(j.matrix.copy(oe.matrixWorld),j.matrix.invert(),j.matrix.multiply(ve.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ve.projectionMatrix),j.projectionMatrixInverse.copy(ve.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=ds*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(j){c=j,u!==null&&(u.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(j){return p[j]};let $e=null;function it(j,ve){if(d=ve.getViewerPose(l||a),g=ve,d!==null){const oe=d.views;f!==null&&(e.setRenderTargetFramebuffer(w,f.framebuffer),e.setRenderTarget(w));let Pe=!1;oe.length!==F.cameras.length&&(F.cameras.length=0,Pe=!0);for(let Fe=0;Fe<oe.length;Fe++){const J=oe[Fe];let se=null;if(f!==null)se=f.getViewport(J);else{const xe=h.getViewSubImage(u,J);se=xe.viewport,Fe===0&&(e.setRenderTargetTextures(w,xe.colorTexture,xe.depthStencilTexture),e.setRenderTarget(w))}let Q=R[Fe];Q===void 0&&(Q=new $t,Q.layers.enable(Fe),Q.viewport=new xt,R[Fe]=Q),Q.matrix.fromArray(J.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(J.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(se.x,se.y,se.width,se.height),Fe===0&&(F.matrix.copy(Q.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Pe===!0&&F.cameras.push(Q)}const Ue=n.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&y){h=i.getBinding();const Fe=h.getDepthInformation(oe[0]);Fe&&Fe.isValid&&Fe.texture&&m.init(Fe,n.renderState)}if(Ue&&Ue.includes("camera-access")&&y){e.state.unbindTexture(),h=i.getBinding();for(let Fe=0;Fe<oe.length;Fe++){const J=oe[Fe].camera;if(J){let se=p[J];se||(se=new bl,p[J]=se);const Q=h.getCameraImage(J);se.sourceTexture=Q}}}}for(let oe=0;oe<D.length;oe++){const Pe=E[oe],Ue=D[oe];Pe!==null&&Ue!==void 0&&Ue.update(Pe,ve,l||a)}$e&&$e(j,ve),ve.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ve}),g=null}const ze=new Bl;ze.setAnimationLoop(it),this.setAnimationLoop=function(j){$e=j},this.dispose=function(){}}}const gg=new yt,$l=new Ve;$l.set(-1,0,0,0,1,0,0,0,1);function vg(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Nl(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function n(m,p,M,b,w){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),h(m,p)):p.isMeshPhongMaterial?(r(m,p),d(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,w)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),y(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,M,b):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===zt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===zt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const M=e.get(p),b=M.envMap,w=M.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(gg.makeRotationFromEuler(w)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply($l),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,M,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=b*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===zt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){const M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function _g(s,e,t,i){let n={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,b){const w=b.program;i.uniformBlockBinding(M,w)}function l(M,b){let w=n[M.id];w===void 0&&(g(M),w=d(M),n[M.id]=w,M.addEventListener("dispose",m));const D=b.program;i.updateUBOMapping(M,D);const E=e.render.frame;r[M.id]!==E&&(u(M),r[M.id]=E)}function d(M){const b=h();M.__bindingPointIndex=b;const w=s.createBuffer(),D=M.__size,E=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,w),s.bufferData(s.UNIFORM_BUFFER,D,E),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,w),w}function h(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return tt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const b=n[M.id],w=M.uniforms,D=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let E=0,P=w.length;E<P;E++){const _=Array.isArray(w[E])?w[E]:[w[E]];for(let T=0,N=_.length;T<N;T++){const R=_[T];if(f(R,E,T,D)===!0){const F=R.__offset,X=Array.isArray(R.value)?R.value:[R.value];let q=0;for(let k=0;k<X.length;k++){const G=X[k],B=y(G);typeof G=="number"||typeof G=="boolean"?(R.__data[0]=G,s.bufferSubData(s.UNIFORM_BUFFER,F+q,R.__data)):G.isMatrix3?(R.__data[0]=G.elements[0],R.__data[1]=G.elements[1],R.__data[2]=G.elements[2],R.__data[3]=0,R.__data[4]=G.elements[3],R.__data[5]=G.elements[4],R.__data[6]=G.elements[5],R.__data[7]=0,R.__data[8]=G.elements[6],R.__data[9]=G.elements[7],R.__data[10]=G.elements[8],R.__data[11]=0):ArrayBuffer.isView(G)?R.__data.set(new G.constructor(G.buffer,G.byteOffset,R.__data.length)):(G.toArray(R.__data,q),q+=B.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,F,R.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,b,w,D){const E=M.value,P=b+"_"+w;if(D[P]===void 0)return typeof E=="number"||typeof E=="boolean"?D[P]=E:ArrayBuffer.isView(E)?D[P]=E.slice():D[P]=E.clone(),!0;{const _=D[P];if(typeof E=="number"||typeof E=="boolean"){if(_!==E)return D[P]=E,!0}else{if(ArrayBuffer.isView(E))return!0;if(_.equals(E)===!1)return _.copy(E),!0}}return!1}function g(M){const b=M.uniforms;let w=0;const D=16;for(let P=0,_=b.length;P<_;P++){const T=Array.isArray(b[P])?b[P]:[b[P]];for(let N=0,R=T.length;N<R;N++){const F=T[N],X=Array.isArray(F.value)?F.value:[F.value];for(let q=0,k=X.length;q<k;q++){const G=X[q],B=y(G),ie=w%D,ne=ie%B.boundary,me=ie+ne;w+=ne,me!==0&&D-me<B.storage&&(w+=D-me),F.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=w,w+=B.storage}}}const E=w%D;return E>0&&(w+=D-E),M.__size=w,M.__cache={},this}function y(M){const b={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(b.boundary=4,b.storage=4):M.isVector2?(b.boundary=8,b.storage=8):M.isVector3||M.isColor?(b.boundary=16,b.storage=12):M.isVector4?(b.boundary=16,b.storage=16):M.isMatrix3?(b.boundary=48,b.storage=48):M.isMatrix4?(b.boundary=64,b.storage=64):M.isTexture?Ne("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(b.boundary=16,b.storage=M.byteLength):Ne("WebGLRenderer: Unsupported uniform value type.",M),b}function m(M){const b=M.target;b.removeEventListener("dispose",m);const w=a.indexOf(b.__bindingPointIndex);a.splice(w,1),s.deleteBuffer(n[b.id]),delete n[b.id],delete r[b.id]}function p(){for(const M in n)s.deleteBuffer(n[M]);a=[],n={},r={}}return{bind:c,update:l,dispose:p}}const xg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let oi=null;function yg(){return oi===null&&(oi=new Ph(xg,16,16,cn,Ri),oi.name="DFG_LUT",oi.minFilter=Ut,oi.magFilter=Ut,oi.wrapS=Ti,oi.wrapT=Ti,oi.generateMipmaps=!1,oi.needsUpdate=!0),oi}class Mg{constructor(e={}){const{canvas:t=$d(),context:i=null,depth:n=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:u=!1,outputBufferType:f=qt}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const y=f,m=new Set([so,no,io]),p=new Set([qt,mi,os,cs,eo,to]),M=new Uint32Array(4),b=new Int32Array(4),w=new C;let D=null,E=null;const P=[],_=[];let T=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ui,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const N=this;let R=!1,F=null;this._outputColorSpace=Xt;let X=0,q=0,k=null,G=-1,B=null;const ie=new xt,ne=new xt;let me=null;const Se=new et(0);let Ce=0,$e=t.width,it=t.height,ze=1,j=null,ve=null;const oe=new xt(0,0,$e,it),Pe=new xt(0,0,$e,it);let Ue=!1;const ke=new uo;let nt=!1,Fe=!1;const J=new yt,se=new C,Q=new xt,xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pe=!1;function Oe(){return k===null?ze:1}let A=i;function He(x,U){return t.getContext(x,U)}try{const x={alpha:!0,depth:n,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ja}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",De,!1),t.addEventListener("webglcontextcreationerror",We,!1),A===null){const U="webgl2";if(A=He(U,x),A===null)throw He(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw tt("WebGLRenderer: "+x.message),x}let Ae,Be,re,at,S,v,O,Z,ee,ae,de,$,K,Me,Ee,ue,ce,Ge,qe,rt,I,le,Y;function we(){Ae=new ym(A),Ae.init(),I=new hg(A,Ae),Be=new um(A,Ae,e,I),re=new lg(A,Ae),Be.reversedDepthBuffer&&u&&re.buffers.depth.setReversed(!0),at=new wm(A),S=new Z0,v=new dg(A,Ae,re,S,Be,I,at),O=new xm(N),Z=new Tu(A),le=new dm(A,Z),ee=new Mm(A,Z,at,le),ae=new Em(A,ee,Z,le,at),Ge=new bm(A,Be,v),Ee=new fm(S),de=new Y0(N,O,Ae,Be,le,Ee),$=new vg(N,S),K=new j0,Me=new ng(Ae),ce=new lm(N,O,re,ae,g,c),ue=new cg(N,ae,Be),Y=new _g(A,at,Be,re),qe=new hm(A,Ae,at),rt=new Sm(A,Ae,at),at.programs=de.programs,N.capabilities=Be,N.extensions=Ae,N.properties=S,N.renderLists=K,N.shadowMap=ue,N.state=re,N.info=at}we(),y!==qt&&(T=new Cm(y,t.width,t.height,n,r));const fe=new mg(N,A);this.xr=fe,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){const x=Ae.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=Ae.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return ze},this.setPixelRatio=function(x){x!==void 0&&(ze=x,this.setSize($e,it,!1))},this.getSize=function(x){return x.set($e,it)},this.setSize=function(x,U,V=!0){if(fe.isPresenting){Ne("WebGLRenderer: Can't change size while VR device is presenting.");return}$e=x,it=U,t.width=Math.floor(x*ze),t.height=Math.floor(U*ze),V===!0&&(t.style.width=x+"px",t.style.height=U+"px"),T!==null&&T.setSize(t.width,t.height),this.setViewport(0,0,x,U)},this.getDrawingBufferSize=function(x){return x.set($e*ze,it*ze).floor()},this.setDrawingBufferSize=function(x,U,V){$e=x,it=U,ze=V,t.width=Math.floor(x*V),t.height=Math.floor(U*V),this.setViewport(0,0,x,U)},this.setEffects=function(x){if(y===qt){tt("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(x){for(let U=0;U<x.length;U++)if(x[U].isOutputPass===!0){Ne("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(x||[])},this.getCurrentViewport=function(x){return x.copy(ie)},this.getViewport=function(x){return x.copy(oe)},this.setViewport=function(x,U,V,z){x.isVector4?oe.set(x.x,x.y,x.z,x.w):oe.set(x,U,V,z),re.viewport(ie.copy(oe).multiplyScalar(ze).round())},this.getScissor=function(x){return x.copy(Pe)},this.setScissor=function(x,U,V,z){x.isVector4?Pe.set(x.x,x.y,x.z,x.w):Pe.set(x,U,V,z),re.scissor(ne.copy(Pe).multiplyScalar(ze).round())},this.getScissorTest=function(){return Ue},this.setScissorTest=function(x){re.setScissorTest(Ue=x)},this.setOpaqueSort=function(x){j=x},this.setTransparentSort=function(x){ve=x},this.getClearColor=function(x){return x.copy(ce.getClearColor())},this.setClearColor=function(){ce.setClearColor(...arguments)},this.getClearAlpha=function(){return ce.getClearAlpha()},this.setClearAlpha=function(){ce.setClearAlpha(...arguments)},this.clear=function(x=!0,U=!0,V=!0){let z=0;if(x){let H=!1;if(k!==null){const ye=k.texture.format;H=m.has(ye)}if(H){const ye=k.texture.type,Te=p.has(ye),_e=ce.getClearColor(),Re=ce.getClearAlpha(),Le=_e.r,Xe=_e.g,Ze=_e.b;Te?(M[0]=Le,M[1]=Xe,M[2]=Ze,M[3]=Re,A.clearBufferuiv(A.COLOR,0,M)):(b[0]=Le,b[1]=Xe,b[2]=Ze,b[3]=Re,A.clearBufferiv(A.COLOR,0,b))}else z|=A.COLOR_BUFFER_BIT}U&&(z|=A.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),V&&(z|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&A.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(x){x.setRenderer(this),F=x},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",De,!1),t.removeEventListener("webglcontextcreationerror",We,!1),ce.dispose(),K.dispose(),Me.dispose(),S.dispose(),O.dispose(),ae.dispose(),le.dispose(),Y.dispose(),de.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",bo),fe.removeEventListener("sessionend",Eo),Xi.stop()};function te(x){x.preventDefault(),zo("WebGLRenderer: Context Lost."),R=!0}function De(){zo("WebGLRenderer: Context Restored."),R=!1;const x=at.autoReset,U=ue.enabled,V=ue.autoUpdate,z=ue.needsUpdate,H=ue.type;we(),at.autoReset=x,ue.enabled=U,ue.autoUpdate=V,ue.needsUpdate=z,ue.type=H}function We(x){tt("WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function Mt(x){const U=x.target;U.removeEventListener("dispose",Mt),ct(U)}function ct(x){_i(x),S.remove(x)}function _i(x){const U=S.get(x).programs;U!==void 0&&(U.forEach(function(V){de.releaseProgram(V)}),x.isShaderMaterial&&de.releaseShaderCache(x))}this.renderBufferDirect=function(x,U,V,z,H,ye){U===null&&(U=xe);const Te=H.isMesh&&H.matrixWorld.determinant()<0,_e=cd(x,U,V,z,H);re.setMaterial(z,Te);let Re=V.index,Le=1;if(z.wireframe===!0){if(Re=ee.getWireframeAttribute(V),Re===void 0)return;Le=2}const Xe=V.drawRange,Ze=V.attributes.position;let Ie=Xe.start*Le,lt=(Xe.start+Xe.count)*Le;ye!==null&&(Ie=Math.max(Ie,ye.start*Le),lt=Math.min(lt,(ye.start+ye.count)*Le)),Re!==null?(Ie=Math.max(Ie,0),lt=Math.min(lt,Re.count)):Ze!=null&&(Ie=Math.max(Ie,0),lt=Math.min(lt,Ze.count));const St=lt-Ie;if(St<0||St===1/0)return;le.setup(H,z,_e,V,Re);let _t,ht=qe;if(Re!==null&&(_t=Z.get(Re),ht=rt,ht.setIndex(_t)),H.isMesh)z.wireframe===!0?(re.setLineWidth(z.wireframeLinewidth*Oe()),ht.setMode(A.LINES)):ht.setMode(A.TRIANGLES);else if(H.isLine){let It=z.linewidth;It===void 0&&(It=1),re.setLineWidth(It*Oe()),H.isLineSegments?ht.setMode(A.LINES):H.isLineLoop?ht.setMode(A.LINE_LOOP):ht.setMode(A.LINE_STRIP)}else H.isPoints?ht.setMode(A.POINTS):H.isSprite&&ht.setMode(A.TRIANGLES);if(H.isBatchedMesh)if(Ae.get("WEBGL_multi_draw"))ht.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const It=H._multiDrawStarts,be=H._multiDrawCounts,Gt=H._multiDrawCount,st=Re?Z.get(Re).bytesPerElement:1,Zt=S.get(z).currentProgram.getUniforms();for(let ri=0;ri<Gt;ri++)Zt.setValue(A,"_gl_DrawID",ri),ht.render(It[ri]/st,be[ri])}else if(H.isInstancedMesh)ht.renderInstances(Ie,St,H.count);else if(V.isInstancedBufferGeometry){const It=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,be=Math.min(V.instanceCount,It);ht.renderInstances(Ie,St,be)}else ht.render(Ie,St)};function si(x,U,V){x.transparent===!0&&x.side===Ei&&x.forceSinglePass===!1?(x.side=zt,x.needsUpdate=!0,_s(x,U,V),x.side=Vi,x.needsUpdate=!0,_s(x,U,V),x.side=Ei):_s(x,U,V)}this.compile=function(x,U,V=null){V===null&&(V=x),E=Me.get(V),E.init(U),_.push(E),V.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(E.pushLight(H),H.castShadow&&E.pushShadow(H))}),x!==V&&x.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(E.pushLight(H),H.castShadow&&E.pushShadow(H))}),E.setupLights();const z=new Set;return x.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const ye=H.material;if(ye)if(Array.isArray(ye))for(let Te=0;Te<ye.length;Te++){const _e=ye[Te];si(_e,V,H),z.add(_e)}else si(ye,V,H),z.add(ye)}),E=_.pop(),z},this.compileAsync=function(x,U,V=null){const z=this.compile(x,U,V);return new Promise(H=>{function ye(){if(z.forEach(function(Te){S.get(Te).currentProgram.isReady()&&z.delete(Te)}),z.size===0){H(x);return}setTimeout(ye,10)}Ae.get("KHR_parallel_shader_compile")!==null?ye():setTimeout(ye,10)})};let dr=null;function ad(x){dr&&dr(x)}function bo(){Xi.stop()}function Eo(){Xi.start()}const Xi=new Bl;Xi.setAnimationLoop(ad),typeof self<"u"&&Xi.setContext(self),this.setAnimationLoop=function(x){dr=x,fe.setAnimationLoop(x),x===null?Xi.stop():Xi.start()},fe.addEventListener("sessionstart",bo),fe.addEventListener("sessionend",Eo),this.render=function(x,U){if(U!==void 0&&U.isCamera!==!0){tt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;F!==null&&F.renderStart(x,U);const V=fe.enabled===!0&&fe.isPresenting===!0,z=T!==null&&(k===null||V)&&T.begin(N,k);if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),fe.enabled===!0&&fe.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(fe.cameraAutoUpdate===!0&&fe.updateCamera(U),U=fe.getCamera()),x.isScene===!0&&x.onBeforeRender(N,x,U,k),E=Me.get(x,_.length),E.init(U),E.state.textureUnits=v.getTextureUnits(),_.push(E),J.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),ke.setFromProjectionMatrix(J,di,U.reversedDepth),Fe=this.localClippingEnabled,nt=Ee.init(this.clippingPlanes,Fe),D=K.get(x,P.length),D.init(),P.push(D),fe.enabled===!0&&fe.isPresenting===!0){const Te=N.xr.getDepthSensingMesh();Te!==null&&hr(Te,U,-1/0,N.sortObjects)}hr(x,U,0,N.sortObjects),D.finish(),N.sortObjects===!0&&D.sort(j,ve),pe=fe.enabled===!1||fe.isPresenting===!1||fe.hasDepthSensing()===!1,pe&&ce.addToRenderList(D,x),this.info.render.frame++,nt===!0&&Ee.beginShadows();const H=E.state.shadowsArray;if(ue.render(H,x,U),nt===!0&&Ee.endShadows(),this.info.autoReset===!0&&this.info.reset(),(z&&T.hasRenderPass())===!1){const Te=D.opaque,_e=D.transmissive;if(E.setupLights(),U.isArrayCamera){const Re=U.cameras;if(_e.length>0)for(let Le=0,Xe=Re.length;Le<Xe;Le++){const Ze=Re[Le];Co(Te,_e,x,Ze)}pe&&ce.render(x);for(let Le=0,Xe=Re.length;Le<Xe;Le++){const Ze=Re[Le];To(D,x,Ze,Ze.viewport)}}else _e.length>0&&Co(Te,_e,x,U),pe&&ce.render(x),To(D,x,U)}k!==null&&q===0&&(v.updateMultisampleRenderTarget(k),v.updateRenderTargetMipmap(k)),z&&T.end(N),x.isScene===!0&&x.onAfterRender(N,x,U),le.resetDefaultState(),G=-1,B=null,_.pop(),_.length>0?(E=_[_.length-1],v.setTextureUnits(E.state.textureUnits),nt===!0&&Ee.setGlobalState(N.clippingPlanes,E.state.camera)):E=null,P.pop(),P.length>0?D=P[P.length-1]:D=null,F!==null&&F.renderEnd()};function hr(x,U,V,z){if(x.visible===!1)return;if(x.layers.test(U.layers)){if(x.isGroup)V=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(U);else if(x.isLightProbeGrid)E.pushLightProbeGrid(x);else if(x.isLight)E.pushLight(x),x.castShadow&&E.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||ke.intersectsSprite(x)){z&&Q.setFromMatrixPosition(x.matrixWorld).applyMatrix4(J);const Te=ae.update(x),_e=x.material;_e.visible&&D.push(x,Te,_e,V,Q.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||ke.intersectsObject(x))){const Te=ae.update(x),_e=x.material;if(z&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Q.copy(x.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),Q.copy(Te.boundingSphere.center)),Q.applyMatrix4(x.matrixWorld).applyMatrix4(J)),Array.isArray(_e)){const Re=Te.groups;for(let Le=0,Xe=Re.length;Le<Xe;Le++){const Ze=Re[Le],Ie=_e[Ze.materialIndex];Ie&&Ie.visible&&D.push(x,Te,Ie,V,Q.z,Ze)}}else _e.visible&&D.push(x,Te,_e,V,Q.z,null)}}const ye=x.children;for(let Te=0,_e=ye.length;Te<_e;Te++)hr(ye[Te],U,V,z)}function To(x,U,V,z){const{opaque:H,transmissive:ye,transparent:Te}=x;E.setupLightsView(V),nt===!0&&Ee.setGlobalState(N.clippingPlanes,V),z&&re.viewport(ie.copy(z)),H.length>0&&vs(H,U,V),ye.length>0&&vs(ye,U,V),Te.length>0&&vs(Te,U,V),re.buffers.depth.setTest(!0),re.buffers.depth.setMask(!0),re.buffers.color.setMask(!0),re.setPolygonOffset(!1)}function Co(x,U,V,z){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[z.id]===void 0){const Ie=Ae.has("EXT_color_buffer_half_float")||Ae.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[z.id]=new fi(1,1,{generateMipmaps:!0,type:Ie?Ri:qt,minFilter:nn,samples:Math.max(4,Be.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qe.workingColorSpace})}const ye=E.state.transmissionRenderTarget[z.id],Te=z.viewport||ie;ye.setSize(Te.z*N.transmissionResolutionScale,Te.w*N.transmissionResolutionScale);const _e=N.getRenderTarget(),Re=N.getActiveCubeFace(),Le=N.getActiveMipmapLevel();N.setRenderTarget(ye),N.getClearColor(Se),Ce=N.getClearAlpha(),Ce<1&&N.setClearColor(16777215,.5),N.clear(),pe&&ce.render(V);const Xe=N.toneMapping;N.toneMapping=ui;const Ze=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),E.setupLightsView(z),nt===!0&&Ee.setGlobalState(N.clippingPlanes,z),vs(x,V,z),v.updateMultisampleRenderTarget(ye),v.updateRenderTargetMipmap(ye),Ae.has("WEBGL_multisampled_render_to_texture")===!1){let Ie=!1;for(let lt=0,St=U.length;lt<St;lt++){const _t=U[lt],{object:ht,geometry:It,material:be,group:Gt}=_t;if(be.side===Ei&&ht.layers.test(z.layers)){const st=be.side;be.side=zt,be.needsUpdate=!0,Ao(ht,V,z,It,be,Gt),be.side=st,be.needsUpdate=!0,Ie=!0}}Ie===!0&&(v.updateMultisampleRenderTarget(ye),v.updateRenderTargetMipmap(ye))}N.setRenderTarget(_e,Re,Le),N.setClearColor(Se,Ce),Ze!==void 0&&(z.viewport=Ze),N.toneMapping=Xe}function vs(x,U,V){const z=U.isScene===!0?U.overrideMaterial:null;for(let H=0,ye=x.length;H<ye;H++){const Te=x[H],{object:_e,geometry:Re,group:Le}=Te;let Xe=Te.material;Xe.allowOverride===!0&&z!==null&&(Xe=z),_e.layers.test(V.layers)&&Ao(_e,U,V,Re,Xe,Le)}}function Ao(x,U,V,z,H,ye){x.onBeforeRender(N,U,V,z,H,ye),x.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),H.onBeforeRender(N,U,V,z,x,ye),H.transparent===!0&&H.side===Ei&&H.forceSinglePass===!1?(H.side=zt,H.needsUpdate=!0,N.renderBufferDirect(V,U,z,H,x,ye),H.side=Vi,H.needsUpdate=!0,N.renderBufferDirect(V,U,z,H,x,ye),H.side=Ei):N.renderBufferDirect(V,U,z,H,x,ye),x.onAfterRender(N,U,V,z,H,ye)}function _s(x,U,V){U.isScene!==!0&&(U=xe);const z=S.get(x),H=E.state.lights,ye=E.state.shadowsArray,Te=H.state.version,_e=de.getParameters(x,H.state,ye,U,V,E.state.lightProbeGridArray),Re=de.getProgramCacheKey(_e);let Le=z.programs;z.environment=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?U.environment:null,z.fog=U.fog;const Xe=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap;z.envMap=O.get(x.envMap||z.environment,Xe),z.envMapRotation=z.environment!==null&&x.envMap===null?U.environmentRotation:x.envMapRotation,Le===void 0&&(x.addEventListener("dispose",Mt),Le=new Map,z.programs=Le);let Ze=Le.get(Re);if(Ze!==void 0){if(z.currentProgram===Ze&&z.lightsStateVersion===Te)return Po(x,_e),Ze}else _e.uniforms=de.getUniforms(x),F!==null&&x.isNodeMaterial&&F.build(x,V,_e),x.onBeforeCompile(_e,N),Ze=de.acquireProgram(_e,Re),Le.set(Re,Ze),z.uniforms=_e.uniforms;const Ie=z.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Ie.clippingPlanes=Ee.uniform),Po(x,_e),z.needsLights=dd(x),z.lightsStateVersion=Te,z.needsLights&&(Ie.ambientLightColor.value=H.state.ambient,Ie.lightProbe.value=H.state.probe,Ie.directionalLights.value=H.state.directional,Ie.directionalLightShadows.value=H.state.directionalShadow,Ie.spotLights.value=H.state.spot,Ie.spotLightShadows.value=H.state.spotShadow,Ie.rectAreaLights.value=H.state.rectArea,Ie.ltc_1.value=H.state.rectAreaLTC1,Ie.ltc_2.value=H.state.rectAreaLTC2,Ie.pointLights.value=H.state.point,Ie.pointLightShadows.value=H.state.pointShadow,Ie.hemisphereLights.value=H.state.hemi,Ie.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ie.spotLightMatrix.value=H.state.spotLightMatrix,Ie.spotLightMap.value=H.state.spotLightMap,Ie.pointShadowMatrix.value=H.state.pointShadowMatrix),z.lightProbeGrid=E.state.lightProbeGridArray.length>0,z.currentProgram=Ze,z.uniformsList=null,Ze}function Ro(x){if(x.uniformsList===null){const U=x.currentProgram.getUniforms();x.uniformsList=Ks.seqWithValue(U.seq,x.uniforms)}return x.uniformsList}function Po(x,U){const V=S.get(x);V.outputColorSpace=U.outputColorSpace,V.batching=U.batching,V.batchingColor=U.batchingColor,V.instancing=U.instancing,V.instancingColor=U.instancingColor,V.instancingMorph=U.instancingMorph,V.skinning=U.skinning,V.morphTargets=U.morphTargets,V.morphNormals=U.morphNormals,V.morphColors=U.morphColors,V.morphTargetsCount=U.morphTargetsCount,V.numClippingPlanes=U.numClippingPlanes,V.numIntersection=U.numClipIntersection,V.vertexAlphas=U.vertexAlphas,V.vertexTangents=U.vertexTangents,V.toneMapping=U.toneMapping}function od(x,U){if(x.length===0)return null;if(x.length===1)return x[0].texture!==null?x[0]:null;w.setFromMatrixPosition(U.matrixWorld);for(let V=0,z=x.length;V<z;V++){const H=x[V];if(H.texture!==null&&H.boundingBox.containsPoint(w))return H}return null}function cd(x,U,V,z,H){U.isScene!==!0&&(U=xe),v.resetTextureUnits();const ye=U.fog,Te=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?U.environment:null,_e=k===null?N.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:Qe.workingColorSpace,Re=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Le=O.get(z.envMap||Te,Re),Xe=z.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ze=!!V.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Ie=!!V.morphAttributes.position,lt=!!V.morphAttributes.normal,St=!!V.morphAttributes.color;let _t=ui;z.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(_t=N.toneMapping);const ht=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,It=ht!==void 0?ht.length:0,be=S.get(z),Gt=E.state.lights;if(nt===!0&&(Fe===!0||x!==B)){const pt=x===B&&z.id===G;Ee.setState(z,x,pt)}let st=!1;z.version===be.__version?(be.needsLights&&be.lightsStateVersion!==Gt.state.version||be.outputColorSpace!==_e||H.isBatchedMesh&&be.batching===!1||!H.isBatchedMesh&&be.batching===!0||H.isBatchedMesh&&be.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&be.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&be.instancing===!1||!H.isInstancedMesh&&be.instancing===!0||H.isSkinnedMesh&&be.skinning===!1||!H.isSkinnedMesh&&be.skinning===!0||H.isInstancedMesh&&be.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&be.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&be.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&be.instancingMorph===!1&&H.morphTexture!==null||be.envMap!==Le||z.fog===!0&&be.fog!==ye||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==Ee.numPlanes||be.numIntersection!==Ee.numIntersection)||be.vertexAlphas!==Xe||be.vertexTangents!==Ze||be.morphTargets!==Ie||be.morphNormals!==lt||be.morphColors!==St||be.toneMapping!==_t||be.morphTargetsCount!==It||!!be.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(st=!0):(st=!0,be.__version=z.version);let Zt=be.currentProgram;st===!0&&(Zt=_s(z,U,H),F&&z.isNodeMaterial&&F.onUpdateProgram(z,Zt,be));let ri=!1,Di=!1,fn=!1;const ut=Zt.getUniforms(),wt=be.uniforms;if(re.useProgram(Zt.program)&&(ri=!0,Di=!0,fn=!0),z.id!==G&&(G=z.id,Di=!0),be.needsLights){const pt=od(E.state.lightProbeGridArray,H);be.lightProbeGrid!==pt&&(be.lightProbeGrid=pt,Di=!0)}if(ri||B!==x){re.buffers.depth.getReversed()&&x.reversedDepth!==!0&&(x._reversedDepth=!0,x.updateProjectionMatrix()),ut.setValue(A,"projectionMatrix",x.projectionMatrix),ut.setValue(A,"viewMatrix",x.matrixWorldInverse);const Ii=ut.map.cameraPosition;Ii!==void 0&&Ii.setValue(A,se.setFromMatrixPosition(x.matrixWorld)),Be.logarithmicDepthBuffer&&ut.setValue(A,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&ut.setValue(A,"isOrthographic",x.isOrthographicCamera===!0),B!==x&&(B=x,Di=!0,fn=!0)}if(be.needsLights&&(Gt.state.directionalShadowMap.length>0&&ut.setValue(A,"directionalShadowMap",Gt.state.directionalShadowMap,v),Gt.state.spotShadowMap.length>0&&ut.setValue(A,"spotShadowMap",Gt.state.spotShadowMap,v),Gt.state.pointShadowMap.length>0&&ut.setValue(A,"pointShadowMap",Gt.state.pointShadowMap,v)),H.isSkinnedMesh){ut.setOptional(A,H,"bindMatrix"),ut.setOptional(A,H,"bindMatrixInverse");const pt=H.skeleton;pt&&(pt.boneTexture===null&&pt.computeBoneTexture(),ut.setValue(A,"boneTexture",pt.boneTexture,v))}H.isBatchedMesh&&(ut.setOptional(A,H,"batchingTexture"),ut.setValue(A,"batchingTexture",H._matricesTexture,v),ut.setOptional(A,H,"batchingIdTexture"),ut.setValue(A,"batchingIdTexture",H._indirectTexture,v),ut.setOptional(A,H,"batchingColorTexture"),H._colorsTexture!==null&&ut.setValue(A,"batchingColorTexture",H._colorsTexture,v));const Li=V.morphAttributes;if((Li.position!==void 0||Li.normal!==void 0||Li.color!==void 0)&&Ge.update(H,V,Zt),(Di||be.receiveShadow!==H.receiveShadow)&&(be.receiveShadow=H.receiveShadow,ut.setValue(A,"receiveShadow",H.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&U.environment!==null&&(wt.envMapIntensity.value=U.environmentIntensity),wt.dfgLUT!==void 0&&(wt.dfgLUT.value=yg()),Di){if(ut.setValue(A,"toneMappingExposure",N.toneMappingExposure),be.needsLights&&ld(wt,fn),ye&&z.fog===!0&&$.refreshFogUniforms(wt,ye),$.refreshMaterialUniforms(wt,z,ze,it,E.state.transmissionRenderTarget[x.id]),be.needsLights&&be.lightProbeGrid){const pt=be.lightProbeGrid;wt.probesSH.value=pt.texture,wt.probesMin.value.copy(pt.boundingBox.min),wt.probesMax.value.copy(pt.boundingBox.max),wt.probesResolution.value.copy(pt.resolution)}Ks.upload(A,Ro(be),wt,v)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(Ks.upload(A,Ro(be),wt,v),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&ut.setValue(A,"center",H.center),ut.setValue(A,"modelViewMatrix",H.modelViewMatrix),ut.setValue(A,"normalMatrix",H.normalMatrix),ut.setValue(A,"modelMatrix",H.matrixWorld),z.uniformsGroups!==void 0){const pt=z.uniformsGroups;for(let Ii=0,pn=pt.length;Ii<pn;Ii++){const Do=pt[Ii];Y.update(Do,Zt),Y.bind(Do,Zt)}}return Zt}function ld(x,U){x.ambientLightColor.needsUpdate=U,x.lightProbe.needsUpdate=U,x.directionalLights.needsUpdate=U,x.directionalLightShadows.needsUpdate=U,x.pointLights.needsUpdate=U,x.pointLightShadows.needsUpdate=U,x.spotLights.needsUpdate=U,x.spotLightShadows.needsUpdate=U,x.rectAreaLights.needsUpdate=U,x.hemisphereLights.needsUpdate=U}function dd(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return q},this.getRenderTarget=function(){return k},this.setRenderTargetTextures=function(x,U,V){const z=S.get(x);z.__autoAllocateDepthBuffer=x.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),S.get(x.texture).__webglTexture=U,S.get(x.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:V,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(x,U){const V=S.get(x);V.__webglFramebuffer=U,V.__useDefaultFramebuffer=U===void 0};const hd=A.createFramebuffer();this.setRenderTarget=function(x,U=0,V=0){k=x,X=U,q=V;let z=null,H=!1,ye=!1;if(x){const _e=S.get(x);if(_e.__useDefaultFramebuffer!==void 0){re.bindFramebuffer(A.FRAMEBUFFER,_e.__webglFramebuffer),ie.copy(x.viewport),ne.copy(x.scissor),me=x.scissorTest,re.viewport(ie),re.scissor(ne),re.setScissorTest(me),G=-1;return}else if(_e.__webglFramebuffer===void 0)v.setupRenderTarget(x);else if(_e.__hasExternalTextures)v.rebindTextures(x,S.get(x.texture).__webglTexture,S.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){const Xe=x.depthTexture;if(_e.__boundDepthTexture!==Xe){if(Xe!==null&&S.has(Xe)&&(x.width!==Xe.image.width||x.height!==Xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");v.setupDepthRenderbuffer(x)}}const Re=x.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(ye=!0);const Le=S.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Le[U])?z=Le[U][V]:z=Le[U],H=!0):x.samples>0&&v.useMultisampledRTT(x)===!1?z=S.get(x).__webglMultisampledFramebuffer:Array.isArray(Le)?z=Le[V]:z=Le,ie.copy(x.viewport),ne.copy(x.scissor),me=x.scissorTest}else ie.copy(oe).multiplyScalar(ze).floor(),ne.copy(Pe).multiplyScalar(ze).floor(),me=Ue;if(V!==0&&(z=hd),re.bindFramebuffer(A.FRAMEBUFFER,z)&&re.drawBuffers(x,z),re.viewport(ie),re.scissor(ne),re.setScissorTest(me),H){const _e=S.get(x.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+U,_e.__webglTexture,V)}else if(ye){const _e=U;for(let Re=0;Re<x.textures.length;Re++){const Le=S.get(x.textures[Re]);A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0+Re,Le.__webglTexture,V,_e)}}else if(x!==null&&V!==0){const _e=S.get(x.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,_e.__webglTexture,V)}G=-1},this.readRenderTargetPixels=function(x,U,V,z,H,ye,Te,_e=0){if(!(x&&x.isWebGLRenderTarget)){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=S.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re){re.bindFramebuffer(A.FRAMEBUFFER,Re);try{const Le=x.textures[_e],Xe=Le.format,Ze=Le.type;if(x.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+_e),!Be.textureFormatReadable(Xe)){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Be.textureTypeReadable(Ze)){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=x.width-z&&V>=0&&V<=x.height-H&&A.readPixels(U,V,z,H,I.convert(Xe),I.convert(Ze),ye)}finally{const Le=k!==null?S.get(k).__webglFramebuffer:null;re.bindFramebuffer(A.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(x,U,V,z,H,ye,Te,_e=0){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=S.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re)if(U>=0&&U<=x.width-z&&V>=0&&V<=x.height-H){re.bindFramebuffer(A.FRAMEBUFFER,Re);const Le=x.textures[_e],Xe=Le.format,Ze=Le.type;if(x.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+_e),!Be.textureFormatReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Be.textureTypeReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ie=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,Ie),A.bufferData(A.PIXEL_PACK_BUFFER,ye.byteLength,A.STREAM_READ),A.readPixels(U,V,z,H,I.convert(Xe),I.convert(Ze),0);const lt=k!==null?S.get(k).__webglFramebuffer:null;re.bindFramebuffer(A.FRAMEBUFFER,lt);const St=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);return A.flush(),await qd(A,St,4),A.bindBuffer(A.PIXEL_PACK_BUFFER,Ie),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,ye),A.deleteBuffer(Ie),A.deleteSync(St),ye}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(x,U=null,V=0){const z=Math.pow(2,-V),H=Math.floor(x.image.width*z),ye=Math.floor(x.image.height*z),Te=U!==null?U.x:0,_e=U!==null?U.y:0;v.setTexture2D(x,0),A.copyTexSubImage2D(A.TEXTURE_2D,V,0,0,Te,_e,H,ye),re.unbindTexture()};const ud=A.createFramebuffer(),fd=A.createFramebuffer();this.copyTextureToTexture=function(x,U,V=null,z=null,H=0,ye=0){let Te,_e,Re,Le,Xe,Ze,Ie,lt,St;const _t=x.isCompressedTexture?x.mipmaps[ye]:x.image;if(V!==null)Te=V.max.x-V.min.x,_e=V.max.y-V.min.y,Re=V.isBox3?V.max.z-V.min.z:1,Le=V.min.x,Xe=V.min.y,Ze=V.isBox3?V.min.z:0;else{const wt=Math.pow(2,-H);Te=Math.floor(_t.width*wt),_e=Math.floor(_t.height*wt),x.isDataArrayTexture?Re=_t.depth:x.isData3DTexture?Re=Math.floor(_t.depth*wt):Re=1,Le=0,Xe=0,Ze=0}z!==null?(Ie=z.x,lt=z.y,St=z.z):(Ie=0,lt=0,St=0);const ht=I.convert(U.format),It=I.convert(U.type);let be;U.isData3DTexture?(v.setTexture3D(U,0),be=A.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(v.setTexture2DArray(U,0),be=A.TEXTURE_2D_ARRAY):(v.setTexture2D(U,0),be=A.TEXTURE_2D),re.activeTexture(A.TEXTURE0),re.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,U.flipY),re.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),re.pixelStorei(A.UNPACK_ALIGNMENT,U.unpackAlignment);const Gt=re.getParameter(A.UNPACK_ROW_LENGTH),st=re.getParameter(A.UNPACK_IMAGE_HEIGHT),Zt=re.getParameter(A.UNPACK_SKIP_PIXELS),ri=re.getParameter(A.UNPACK_SKIP_ROWS),Di=re.getParameter(A.UNPACK_SKIP_IMAGES);re.pixelStorei(A.UNPACK_ROW_LENGTH,_t.width),re.pixelStorei(A.UNPACK_IMAGE_HEIGHT,_t.height),re.pixelStorei(A.UNPACK_SKIP_PIXELS,Le),re.pixelStorei(A.UNPACK_SKIP_ROWS,Xe),re.pixelStorei(A.UNPACK_SKIP_IMAGES,Ze);const fn=x.isDataArrayTexture||x.isData3DTexture,ut=U.isDataArrayTexture||U.isData3DTexture;if(x.isDepthTexture){const wt=S.get(x),Li=S.get(U),pt=S.get(wt.__renderTarget),Ii=S.get(Li.__renderTarget);re.bindFramebuffer(A.READ_FRAMEBUFFER,pt.__webglFramebuffer),re.bindFramebuffer(A.DRAW_FRAMEBUFFER,Ii.__webglFramebuffer);for(let pn=0;pn<Re;pn++)fn&&(A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,S.get(x).__webglTexture,H,Ze+pn),A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,S.get(U).__webglTexture,ye,St+pn)),A.blitFramebuffer(Le,Xe,Te,_e,Ie,lt,Te,_e,A.DEPTH_BUFFER_BIT,A.NEAREST);re.bindFramebuffer(A.READ_FRAMEBUFFER,null),re.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else if(H!==0||x.isRenderTargetTexture||S.has(x)){const wt=S.get(x),Li=S.get(U);re.bindFramebuffer(A.READ_FRAMEBUFFER,ud),re.bindFramebuffer(A.DRAW_FRAMEBUFFER,fd);for(let pt=0;pt<Re;pt++)fn?A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,wt.__webglTexture,H,Ze+pt):A.framebufferTexture2D(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,wt.__webglTexture,H),ut?A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Li.__webglTexture,ye,St+pt):A.framebufferTexture2D(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Li.__webglTexture,ye),H!==0?A.blitFramebuffer(Le,Xe,Te,_e,Ie,lt,Te,_e,A.COLOR_BUFFER_BIT,A.NEAREST):ut?A.copyTexSubImage3D(be,ye,Ie,lt,St+pt,Le,Xe,Te,_e):A.copyTexSubImage2D(be,ye,Ie,lt,Le,Xe,Te,_e);re.bindFramebuffer(A.READ_FRAMEBUFFER,null),re.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else ut?x.isDataTexture||x.isData3DTexture?A.texSubImage3D(be,ye,Ie,lt,St,Te,_e,Re,ht,It,_t.data):U.isCompressedArrayTexture?A.compressedTexSubImage3D(be,ye,Ie,lt,St,Te,_e,Re,ht,_t.data):A.texSubImage3D(be,ye,Ie,lt,St,Te,_e,Re,ht,It,_t):x.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,ye,Ie,lt,Te,_e,ht,It,_t.data):x.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,ye,Ie,lt,_t.width,_t.height,ht,_t.data):A.texSubImage2D(A.TEXTURE_2D,ye,Ie,lt,Te,_e,ht,It,_t);re.pixelStorei(A.UNPACK_ROW_LENGTH,Gt),re.pixelStorei(A.UNPACK_IMAGE_HEIGHT,st),re.pixelStorei(A.UNPACK_SKIP_PIXELS,Zt),re.pixelStorei(A.UNPACK_SKIP_ROWS,ri),re.pixelStorei(A.UNPACK_SKIP_IMAGES,Di),ye===0&&U.generateMipmaps&&A.generateMipmap(be),re.unbindTexture()},this.initRenderTarget=function(x){S.get(x).__webglFramebuffer===void 0&&v.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?v.setTextureCube(x,0):x.isData3DTexture?v.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?v.setTexture2DArray(x,0):v.setTexture2D(x,0),re.unbindTexture()},this.resetState=function(){X=0,q=0,k=null,re.reset(),le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Qe._getUnpackColorSpace()}}const dn=[{id:"hatchback",name:"Starter Hatchback",shortName:"Hatchback",description:"A balanced city car with forgiving handling and easy drift recovery.",unlocked:!0,unlockText:"Unlocked",colors:{body:"#f4d35e",secondary:"#fff7cf",glass:"#83c5e8",accent:"#d49a22",lights:"#fff6cc",brake:"#ff3434"},visual:{type:"hatchback",length:4.1,width:1.85,height:1.55,wheelRadius:.43,wheelWidth:.32,rideHeight:.52,spoiler:"lip",panelStyle:"friendly-city",archSize:1.02,rimStyle:"compact",bodyLayers:3,specialty:["short-hood","tall-cabin","smile-bumper"]},stats:{speed:62,acceleration:55,handling:74,braking:68,drift:58,offRoad:52,stability:78},physics:{maxSpeed:31,acceleration:18,braking:23,reverseSpeed:11,steerRate:2.35,grip:8.8,driftGrip:3.6,offRoadGrip:.78,mass:1,boost:12}},{id:"sports-coupe",name:"Sports Coupe",shortName:"Coupe",description:"Low, quick, and playful. Built for sweeping city drifts.",unlocked:!0,unlockText:"Unlocked",colors:{body:"#e74c3c",secondary:"#2f3640",glass:"#9ee8ff",accent:"#f6c04f",lights:"#fff8db",brake:"#ff2d2d"},visual:{type:"coupe",length:4.55,width:1.98,height:1.24,wheelRadius:.46,wheelWidth:.36,rideHeight:.46,spoiler:"sport",panelStyle:"swept-sport",archSize:1.08,rimStyle:"sport",bodyLayers:3,specialty:["side-skirts","low-roofline","wide-tires"]},stats:{speed:82,acceleration:78,handling:68,braking:65,drift:82,offRoad:40,stability:58},physics:{maxSpeed:40,acceleration:24,braking:22,reverseSpeed:10,steerRate:2.15,grip:7.2,driftGrip:2.25,offRoadGrip:.58,mass:.92,boost:16}},{id:"suv",name:"SUV",shortName:"SUV",description:"Stable, heavy, and confidence inspiring for relaxed city driving.",unlocked:!0,unlockText:"Unlocked",colors:{body:"#f6f1e7",secondary:"#8d99ae",glass:"#88c8e8",accent:"#c7a15a",lights:"#fff9d8",brake:"#fa2e2e"},visual:{type:"suv",length:4.9,width:2.16,height:1.92,wheelRadius:.55,wheelWidth:.38,rideHeight:.72,roofRails:!0,panelStyle:"premium-utility",archSize:1.12,rimStyle:"touring",bodyLayers:4,specialty:["roof-rails","trunk-mass","high-clearance"]},stats:{speed:60,acceleration:46,handling:56,braking:82,drift:38,offRoad:66,stability:90},physics:{maxSpeed:30,acceleration:15,braking:28,reverseSpeed:10,steerRate:1.85,grip:9.8,driftGrip:5.8,offRoadGrip:.86,mass:1.35,boost:9}},{id:"supercar",name:"Supercar",shortName:"Supercar",description:"The fastest Phase 4 car. Sharp, premium, and demanding at speed.",unlocked:!0,unlockText:"Phase 4 local unlock",colors:{body:"#1abc9c",secondary:"#101820",glass:"#b9f6ff",accent:"#f4d35e",lights:"#fff8d8",brake:"#ff1f3d"},visual:{type:"supercar",length:4.75,width:2.18,height:1.08,wheelRadius:.48,wheelWidth:.42,rideHeight:.38,spoiler:"wing",diffuser:!0,panelStyle:"sharp-wedge",archSize:1.12,rimStyle:"wide-performance",bodyLayers:4,specialty:["side-intakes","diffuser","front-splitter"]},stats:{speed:98,acceleration:94,handling:72,braking:72,drift:72,offRoad:22,stability:48},physics:{maxSpeed:48,acceleration:31,braking:24,reverseSpeed:9,steerRate:2,grip:6.9,driftGrip:2.6,offRoadGrip:.42,mass:.86,boost:22}},{id:"offroad-jeep",name:"Off-Road Jeep",shortName:"Jeep",description:"Raised suspension, rugged tires, and the best grip on grass paths.",unlocked:!0,unlockText:"Phase 4 local unlock",colors:{body:"#607d3b",secondary:"#2f3324",glass:"#a9d6e5",accent:"#e4c56a",lights:"#fff2b6",brake:"#ff3333"},visual:{type:"jeep",length:4.35,width:2.04,height:1.88,wheelRadius:.58,wheelWidth:.44,rideHeight:.78,rollCage:!0,spareTire:!0,panelStyle:"rugged-open",archSize:1.22,rimStyle:"offroad",bodyLayers:4,specialty:["roll-cage","spare-tire","roof-lights","fender-flares"]},stats:{speed:58,acceleration:52,handling:62,braking:68,drift:46,offRoad:95,stability:84},physics:{maxSpeed:29,acceleration:17,braking:22,reverseSpeed:12,steerRate:2.08,grip:8.2,driftGrip:4.7,offRoadGrip:1.04,mass:1.18,boost:10}},{id:"classic",name:"Classic Car",shortName:"Classic",description:"A long vintage cruiser with chrome details and smooth momentum.",unlocked:!0,unlockText:"Unlocked",colors:{body:"#5f4bb6",secondary:"#f7efe5",glass:"#aed9e0",accent:"#d4af37",lights:"#fff6c9",brake:"#f03535"},visual:{type:"classic",length:5.25,width:1.98,height:1.42,wheelRadius:.48,wheelWidth:.32,rideHeight:.5,chrome:!0,panelStyle:"vintage-long",archSize:1.06,rimStyle:"classic",bodyLayers:3,specialty:["chrome","rounded-hood","tail-fins"]},stats:{speed:64,acceleration:50,handling:42,braking:60,drift:50,offRoad:38,stability:72},physics:{maxSpeed:32,acceleration:16,braking:20,reverseSpeed:9,steerRate:1.55,grip:8,driftGrip:3.9,offRoadGrip:.62,mass:1.14,boost:8}}],rn=s=>dn.find(e=>e.id===s)??dn[0],Xa=[{id:"downtown-dash",type:"timeTrial",name:"Downtown Dash",description:"A clean sprint through the Downtown Core intersections.",recommendedCar:"Starter Hatchback",reward:130,xp:145,start:{position:[0,0,26],heading:Math.PI},checkpoints:[[0,-42],[44,-42],[44,42],[0,42],[-44,42],[-44,0],[0,16]],medalTimes:{S:42,Gold:50,Silver:62,Bronze:78}},{id:"highway-blast",type:"timeTrial",name:"Highway Blast",description:"Fast highway markers built for Supercar and Sports Coupe.",recommendedCar:"Supercar",reward:155,xp:160,start:{position:[330,0,-172],heading:-Math.PI*.95},checkpoints:[[282,-142],[212,-106],[132,-78],[72,-62],[0,-128],[-185,-272],[-292,-326],[-360,-404]],medalTimes:{S:54,Gold:68,Silver:84,Bronze:108}},{id:"park-loop-run",type:"timeTrial",name:"Park Loop Run",description:"Curved park roads with one soft shortcut.",recommendedCar:"Off-Road Jeep",reward:140,xp:150,start:{position:[-40,0,26],heading:-Math.PI*.5},checkpoints:[[-72,24],[-96,52],[-65,62],[-38,26],[-92,36]],medalTimes:{S:38,Gold:48,Silver:61,Bronze:78}},{id:"hill-climb-sprint",type:"timeTrial",name:"Hill Climb Sprint",description:"A handling run up to the scenic viewpoint.",recommendedCar:"Sports Coupe",reward:165,xp:175,start:{position:[58,0,92],heading:Math.PI*.28},checkpoints:[[72,104],[94,120],[118,132],[132,136]],medalTimes:{S:32,Gold:40,Silver:52,Bronze:68}},{id:"airport-express-sprint",type:"timeTrial",name:"Airport Express Sprint",description:"A longer expressway run from Downtown Core to Horizon Airport.",recommendedCar:"Supercar",reward:190,xp:210,start:{position:[0,0,-48],heading:Math.PI},checkpoints:[[0,-86],[-28,-162],[-92,-214],[-185,-272],[-292,-326],[-344,-366],[-360,-404],[-360,-350]],medalTimes:{S:62,Gold:76,Silver:94,Bronze:118}},{id:"bridge-ring-run",type:"timeTrial",name:"Bridge Ring Run",description:"A high-speed loop across the bridge corridor and highway ring.",recommendedCar:"Sports Coupe",reward:205,xp:225,start:{position:[-390,0,-172],heading:Math.PI*.5},checkpoints:[[-330,-172],[-245,-172],[-48,-172],[140,-172],[330,-172],[430,-238],[430,-346],[240,-420],[0,-420],[-240,-420],[-430,-360],[-390,-172]],medalTimes:{S:104,Gold:124,Silver:150,Bronze:184}},{id:"grand-city-cruise",type:"timeTrial",name:"Grand City Cruise",description:"A scenic city-wide cruise linking park, market, residential, and downtown roads.",recommendedCar:"Classic Car",reward:175,xp:190,start:{position:[-122,0,34],heading:-Math.PI*.5},checkpoints:[[-206,34],[-146,106],[-58,182],[30,112],[184,74],[108,144],[0,62],[-62,0],[-122,34]],medalTimes:{S:88,Gold:106,Silver:132,Bronze:162}},{id:"scenic-hill-switchback",type:"timeTrial",name:"Scenic Hill Switchback",description:"A longer handling run up the expanded viewpoint road.",recommendedCar:"Sports Coupe",reward:180,xp:205,start:{position:[108,0,144],heading:.52},checkpoints:[[150,194],[202,230],[170,258],[130,210],[184,132]],medalTimes:{S:45,Gold:56,Silver:72,Bronze:92}}],ql=[{id:"park-loop-drift",type:"drift",name:"Park Loop Drift",description:"Hold clean angle through the park curve.",recommendedCar:"Sports Coupe",reward:120,xp:140,start:{position:[-40,0,26],heading:-Math.PI*.5},zone:{center:[-78,44],size:[56,34],rotation:-.45},timer:55,targetScore:1600},{id:"downtown-corner-drift",type:"drift",name:"Downtown Corner Drift",description:"Link the central junction without clipping traffic.",recommendedCar:"Classic Car",reward:130,xp:145,start:{position:[-44,0,-20],heading:0},zone:{center:[0,0],size:[74,74],rotation:0},timer:50,targetScore:1450}],Yl=[{id:"residential-taxi",type:"taxi",name:"Residential Ride",description:"A smooth passenger ride from the square to City Hall.",recommendedCar:"Classic Car",reward:125,xp:145,start:{position:[88,0,58],heading:-Math.PI*.5},timer:105,pickup:[88,58],destination:[24,72],comfortLoss:14,messages:["Please drive safely.","Nice smooth turn.","Careful!","We are almost there."]},{id:"market-taxi",type:"taxi",name:"Market Pickup",description:"Pick up near Market Gate and reach the Park Loop calmly.",recommendedCar:"SUV",reward:135,xp:150,start:{position:[-66,0,82],heading:Math.PI*.5},timer:100,pickup:[-66,82],destination:[-78,44],comfortLoss:16,messages:["Please avoid the market vans.","That was smooth.","Careful!","Almost there."]},{id:"residential-airport-taxi",type:"taxi",name:"Residential Airport Taxi",description:"A smooth longer ride from the local square to Horizon Airport Terminal.",recommendedCar:"Classic Car",reward:170,xp:195,start:{position:[184,0,74],heading:-Math.PI*.5},timer:165,pickup:[184,74],destination:[-360,-350],comfortLoss:15,messages:["Airport terminal, please.","Smooth highway merge.","Careful near the bridge.","We are nearly at departures."]}],Zl=[{id:"standard-parcel",type:"delivery",name:"Standard Parcel",description:"Normal route, normal condition loss.",recommendedCar:"Starter Hatchback",reward:120,xp:130,start:{position:[-42,0,-4],heading:Math.PI*.5},timer:105,pickup:[-66,82],destination:[92,58],crashDamage:13,roughDamagePerSecond:1.1,accelerationMultiplier:1},{id:"fragile-box",type:"delivery",name:"Fragile Box",description:"Higher reward, collision-sensitive cargo.",recommendedCar:"SUV",reward:150,xp:155,start:{position:[-66,0,82],heading:Math.PI*.5},timer:110,pickup:[-66,82],destination:[24,72],crashDamage:22,roughDamagePerSecond:1.4,accelerationMultiplier:1},{id:"express-food",type:"delivery",name:"Express Food",description:"Stricter timer, higher speed bonus.",recommendedCar:"Sports Coupe",reward:145,xp:150,start:{position:[-30,0,82],heading:Math.PI*.5},timer:78,pickup:[-30,82],destination:[120,56],crashDamage:14,roughDamagePerSecond:1,accelerationMultiplier:1},{id:"heavy-cargo",type:"delivery",name:"Heavy Cargo",description:"Heavier load with reduced acceleration.",recommendedCar:"Off-Road Jeep",reward:155,xp:160,start:{position:[64,0,30],heading:Math.PI*.2},timer:120,pickup:[64,30],destination:[124,132],crashDamage:15,roughDamagePerSecond:.8,accelerationMultiplier:.82},{id:"industrial-cargo-route",type:"delivery",name:"Industrial Cargo Route",description:"Move heavier cargo from the logistics depot to the airport service road.",recommendedCar:"Off-Road Jeep",reward:185,xp:205,start:{position:[360,0,-370],heading:Math.PI*.5},timer:150,pickup:[360,-330],destination:[-274,-360],crashDamage:16,roughDamagePerSecond:.75,accelerationMultiplier:.78},{id:"market-delivery-chain",type:"delivery",name:"Market Delivery Chain",description:"A denser route from Market Street through Downtown to Residential Square.",recommendedCar:"Starter Hatchback",reward:165,xp:180,start:{position:[-134,0,182],heading:Math.PI*.5},timer:132,pickup:[-134,182],destination:[184,74],crashDamage:14,roughDamagePerSecond:1,accelerationMultiplier:1}],Kl=[{id:"basic-parking",type:"parking",name:"Basic Parking",description:"A fair first parking space in Residential Zone.",recommendedCar:"Starter Hatchback",reward:95,xp:115,start:{position:[42,0,-18],heading:-Math.PI*.5},timer:95,zone:{center:[112,58],size:[8,13],rotation:Math.PI*.5,holdTime:2.5}},{id:"reverse-parking",type:"parking",name:"Reverse Parking",description:"Line up gently and back into the marked slot.",recommendedCar:"Classic Car",reward:110,xp:130,start:{position:[88,0,22],heading:0},timer:100,zone:{center:[72,44],size:[8,13],rotation:Math.PI,holdTime:2.8}},{id:"tight-market-parking",type:"parking",name:"Tight Market Parking",description:"A careful slot between market barriers.",recommendedCar:"Starter Hatchback",reward:120,xp:140,start:{position:[-78,0,82],heading:Math.PI*.5},timer:105,zone:{center:[-8,92],size:[7,12],rotation:Math.PI*.5,holdTime:3}},{id:"hill-parking",type:"parking",name:"Hill Parking",description:"Stop precisely near the viewpoint guardrail.",recommendedCar:"SUV",reward:130,xp:145,start:{position:[92,0,116],heading:Math.PI*.5},timer:95,zone:{center:[128,138],size:[8,13],rotation:.2,holdTime:2.8}},{id:"precision-stop",type:"parking",name:"Precision Stop",description:"A short challenge focused on final speed and center accuracy.",recommendedCar:"SUV",reward:115,xp:135,start:{position:[44,0,42],heading:-Math.PI*.5},timer:70,zone:{center:[0,42],size:[7,10],rotation:Math.PI*.5,holdTime:2.2}},{id:"airport-parking",type:"parking",name:"Airport Parking",description:"Park cleanly in the airport drop-off bay near the terminal.",recommendedCar:"SUV",reward:145,xp:165,start:{position:[-360,0,-404],heading:0},timer:115,zone:{center:[-320,-324],size:[9,15],rotation:Math.PI*.5,holdTime:2.8}}],jl=[...Xa,...ql,...Yl,...Zl,...Kl],$a={freeDrive:{id:"freeDrive",type:"freeDrive",name:"Free Drive",description:"Explore the city, collect coins, discover landmarks, and enjoy the road.",reward:0},checkpoint:Xa[0],delivery:Zl[0],parking:Kl[0],drift:ql[0],taxi:Yl[0],timeTrial:Xa[0]},Sg=[{rank:"S",min:900},{rank:"A",min:700},{rank:"B",min:480},{rank:"C",min:0}],vo=s=>s==="freeDrive"?$a.freeDrive:jl.find(e=>e.id===s),wg=s=>Sg.find(e=>s>=e.min)?.rank??"C",bg=(s,e)=>s?.medalTimes?e<=s.medalTimes.S?"S":e<=s.medalTimes.Gold?"Gold":e<=s.medalTimes.Silver?"Silver":e<=s.medalTimes.Bronze?"Bronze":null:null,tn={bounds:470,groundSize:960,radarRange:940,highwaySpeedFactor:1.14},Ji=[{id:"downtown",name:"Downtown Core",center:[0,0],size:[178,172],color:"#d6dee8",reward:18,xp:30},{id:"park",name:"Park Loop",center:[-190,48],size:[178,160],color:"#74b56c",reward:18,xp:30},{id:"airport",name:"Airport Zone",center:[-360,-350],size:[230,196],color:"#c8d4dc",reward:28,xp:48},{id:"industrial",name:"Industrial / Logistics Zone",center:[360,-340],size:[230,184],color:"#b9c0bc",reward:24,xp:42},{id:"residential",name:"Residential Zone",center:[184,74],size:[176,156],color:"#e7d9c4",reward:18,xp:30},{id:"market",name:"Market Street",center:[-58,182],size:[188,118],color:"#eadfc9",reward:20,xp:34},{id:"hill",name:"Hill / Viewpoint Road",center:[170,214],size:[198,140],color:"#c7d7b1",reward:26,xp:46},{id:"river",name:"River / Bridge Corridor",center:[0,-172],size:[760,74],color:"#a6d6e8",reward:20,xp:34},{id:"highway",name:"Highway Ring / Expressway System",center:[0,-420],size:[900,96],color:"#a7b1ba",reward:22,xp:38}],Eg=[{id:"express-south",center:[0,-420],size:[880,28],rotation:0,zone:"highway",roadClass:"highway",lanes:4,shoulders:!0,median:!0},{id:"express-north",center:[0,420],size:[860,26],rotation:0,zone:"highway",roadClass:"highway",lanes:4,shoulders:!0,median:!0},{id:"express-west",center:[-430,0],size:[26,840],rotation:0,zone:"highway",roadClass:"highway",lanes:4,shoulders:!0,median:!0},{id:"express-east",center:[430,0],size:[26,840],rotation:0,zone:"highway",roadClass:"highway",lanes:4,shoulders:!0,median:!0},{id:"south-west-flyover",center:[-380,-380],size:[150,24],rotation:.72,zone:"highway",roadClass:"highway",lanes:3,shoulders:!0,median:!0},{id:"south-east-flyover",center:[380,-380],size:[150,24],rotation:-.72,zone:"highway",roadClass:"highway",lanes:3,shoulders:!0,median:!0},{id:"north-west-flyover",center:[-380,380],size:[144,24],rotation:-.7,zone:"highway",roadClass:"highway",lanes:3,shoulders:!0,median:!0},{id:"north-east-flyover",center:[380,380],size:[144,24],rotation:.7,zone:"highway",roadClass:"highway",lanes:3,shoulders:!0,median:!0},{id:"downtown-main-ns",center:[0,0],size:[22,268],rotation:0,zone:"downtown",roadClass:"boulevard",lanes:3,median:!0},{id:"downtown-main-ew",center:[0,0],size:[268,22],rotation:0,zone:"downtown",roadClass:"boulevard",lanes:3,median:!0},{id:"downtown-west-grid",center:[-62,0],size:[15,172],rotation:0,zone:"downtown",roadClass:"city",lanes:2},{id:"downtown-east-grid",center:[62,0],size:[15,172],rotation:0,zone:"downtown",roadClass:"city",lanes:2},{id:"downtown-north-grid",center:[0,62],size:[176,15],rotation:0,zone:"downtown",roadClass:"city",lanes:2},{id:"downtown-south-grid",center:[0,-62],size:[176,15],rotation:0,zone:"downtown",roadClass:"city",lanes:2},{id:"city-hall-avenue",center:[30,102],size:[15,92],rotation:0,zone:"downtown",roadClass:"city",lanes:2},{id:"downtown-express-link",center:[0,-128],size:[24,168],rotation:0,zone:"river",roadClass:"highway",lanes:3,shoulders:!0},{id:"river-bridge",center:[0,-172],size:[330,22],rotation:0,zone:"river",roadClass:"bridge",lanes:3,shoulders:!0,median:!0},{id:"park-grand-entry",center:[-122,34],size:[126,14],rotation:-.08,zone:"park",roadClass:"scenic",lanes:2},{id:"park-west-curve",center:[-206,34],size:[94,13],rotation:-.68,zone:"park",roadClass:"scenic",lanes:2},{id:"park-north-curve",center:[-206,94],size:[120,13],rotation:.38,zone:"park",roadClass:"scenic",lanes:2},{id:"park-east-loop",center:[-146,106],size:[114,13],rotation:-.18,zone:"park",roadClass:"scenic",lanes:2},{id:"park-soft-jeep-cut",center:[-220,72],size:[86,10],rotation:.82,zone:"park",roadClass:"soft",soft:!0,lanes:1},{id:"park-highway-ramp",center:[-236,-70],size:[162,15],rotation:-.58,zone:"park",roadClass:"ramp",lanes:2},{id:"airport-entry-road",center:[-360,-404],size:[26,144],rotation:0,zone:"airport",roadClass:"airport",lanes:3,median:!0},{id:"airport-terminal-loop",center:[-360,-350],size:[170,22],rotation:0,zone:"airport",roadClass:"airport",lanes:3},{id:"airport-dropoff",center:[-360,-324],size:[138,14],rotation:0,zone:"airport",roadClass:"airport",lanes:2},{id:"airport-runway-road",center:[-360,-252],size:[188,18],rotation:0,zone:"airport",roadClass:"runway",lanes:2},{id:"airport-service-road",center:[-274,-360],size:[18,132],rotation:0,zone:"airport",roadClass:"service",lanes:1},{id:"industrial-main",center:[360,-370],size:[186,18],rotation:0,zone:"industrial",roadClass:"industrial",lanes:2},{id:"industrial-yard-ns",center:[360,-330],size:[18,128],rotation:0,zone:"industrial",roadClass:"industrial",lanes:2},{id:"industrial-east-yard",center:[420,-330],size:[16,128],rotation:0,zone:"industrial",roadClass:"industrial",lanes:2},{id:"industrial-logistics-loop",center:[360,-290],size:[164,16],rotation:0,zone:"industrial",roadClass:"industrial",lanes:2},{id:"industrial-express-ramp",center:[348,-398],size:[112,15],rotation:-.28,zone:"industrial",roadClass:"ramp",lanes:2},{id:"residential-entry",center:[112,34],size:[118,13],rotation:.18,zone:"residential",roadClass:"residential",lanes:2},{id:"residential-square-x",center:[184,74],size:[132,13],rotation:0,zone:"residential",roadClass:"residential",lanes:2},{id:"residential-square-z",center:[184,74],size:[13,126],rotation:0,zone:"residential",roadClass:"residential",lanes:2},{id:"residential-north-loop",center:[218,126],size:[108,12],rotation:.15,zone:"residential",roadClass:"residential",lanes:2},{id:"residential-highway-link",center:[260,132],size:[130,13],rotation:1.12,zone:"residential",roadClass:"ramp",lanes:2},{id:"market-main",center:[-58,182],size:[188,13],rotation:0,zone:"market",roadClass:"market",lanes:2},{id:"market-north-alley",center:[-58,214],size:[152,10],rotation:0,zone:"market",roadClass:"market",lanes:1},{id:"market-link-south",center:[-20,126],size:[13,126],rotation:0,zone:"market",roadClass:"market",lanes:2},{id:"market-gate-road",center:[-134,166],size:[13,88],rotation:.1,zone:"market",roadClass:"market",lanes:1},{id:"hill-entry",center:[108,144],size:[118,13],rotation:.52,zone:"hill",roadClass:"scenic",lanes:2,elevation:1},{id:"hill-switchback-a",center:[150,194],size:[112,12],rotation:-.6,zone:"hill",roadClass:"scenic",lanes:2,elevation:2.2},{id:"hill-switchback-b",center:[202,230],size:[108,12],rotation:.58,zone:"hill",roadClass:"scenic",lanes:2,elevation:3.2},{id:"hill-viewpoint-loop",center:[170,258],size:[92,12],rotation:.02,zone:"hill",roadClass:"scenic",lanes:2,elevation:4}],Tg=[{id:"downtown-airport-ramp-up",name:"Downtown Expressway Ramp",zone:"river",roadClass:"ramp",kind:"ramp",center:[0,-104],size:[30,126],rotation:0,lanes:3,startElevation:11.5,endElevation:0,deckThickness:1.45,supportSpacing:24,supportStyle:"paired",barriers:!0,shoulders:!0,priority:80,signs:[{at:-.18,text:"AIRPORT EXPRESS"}]},{id:"river-landmark-bridge",name:"River Landmark Bridge",zone:"river",roadClass:"bridge",kind:"bridge",center:[0,-132],size:[360,34],rotation:0,lanes:4,startElevation:15.5,endElevation:15.5,deckElevation:15.5,deckThickness:2.2,supportSpacing:38,supportStyle:"bridge-pier",barriers:!0,median:!0,shoulders:!0,priority:98,signs:[{at:0,text:"RIVER BRIDGE"}]},{id:"west-bridge-approach",name:"West Bridge Approach",zone:"river",roadClass:"ramp",kind:"ramp",center:[-226,-132],size:[112,30],rotation:0,lanes:3,startElevation:0,endElevation:15.5,deckThickness:1.7,supportSpacing:24,supportStyle:"paired",barriers:!0,shoulders:!0,priority:88},{id:"east-bridge-approach",name:"East Bridge Approach",zone:"river",roadClass:"ramp",kind:"ramp",center:[226,-132],size:[112,30],rotation:0,lanes:3,startElevation:15.5,endElevation:0,deckThickness:1.7,supportSpacing:24,supportStyle:"paired",barriers:!0,shoulders:!0,priority:88},{id:"airport-expressway-deck",name:"Airport Elevated Expressway",zone:"airport",roadClass:"highway",kind:"deck",center:[-112,-196],size:[236,28],rotation:-2.75,lanes:3,startElevation:11.5,endElevation:11.5,deckElevation:11.5,deckThickness:1.65,supportSpacing:30,supportStyle:"paired",barriers:!0,median:!0,shoulders:!0,priority:86,signs:[{at:.2,text:"TERMINAL ROUTE"}]},{id:"airport-ramp-down",name:"Airport Descent Ramp",zone:"airport",roadClass:"ramp",kind:"ramp",center:[-218,-220],size:[30,112],rotation:0,lanes:3,startElevation:11.5,endElevation:0,deckThickness:1.45,supportSpacing:24,supportStyle:"paired",barriers:!0,shoulders:!0,priority:84,signs:[{at:.28,text:"AIRPORT EXIT"}]},{id:"south-elevated-ring",name:"South Elevated Highway",zone:"highway",roadClass:"highway",kind:"deck",center:[0,-272],size:[500,34],rotation:0,lanes:4,startElevation:10.5,endElevation:10.5,deckElevation:10.5,deckThickness:1.75,supportSpacing:34,supportStyle:"paired",barriers:!0,median:!0,shoulders:!0,priority:72,signs:[{at:-.34,text:"WEST RING"},{at:.34,text:"LOGISTICS EXIT"}]},{id:"east-elevated-ring",name:"East Elevated Highway",zone:"highway",roadClass:"highway",kind:"deck",center:[282,-24],size:[32,426],rotation:0,lanes:4,startElevation:10.5,endElevation:10.5,deckElevation:10.5,deckThickness:1.75,supportSpacing:34,supportStyle:"paired",barriers:!0,median:!0,shoulders:!0,priority:70},{id:"north-elevated-ring",name:"North Elevated Highway",zone:"highway",roadClass:"highway",kind:"deck",center:[0,276],size:[456,32],rotation:0,lanes:4,startElevation:9.2,endElevation:9.2,deckElevation:9.2,deckThickness:1.55,supportSpacing:36,supportStyle:"paired",barriers:!0,median:!0,shoulders:!0,priority:66,signs:[{at:.15,text:"NORTH RING"}]},{id:"south-east-flyover-deck",name:"Logistics Flyover",zone:"industrial",roadClass:"highway",kind:"flyover",center:[236,-238],size:[156,28],rotation:-.72,lanes:3,startElevation:10.5,endElevation:10.5,deckElevation:10.5,deckThickness:1.6,supportSpacing:28,supportStyle:"paired",barriers:!0,shoulders:!0,priority:78},{id:"south-west-flyover-deck",name:"Airport Flyover",zone:"airport",roadClass:"highway",kind:"flyover",center:[-236,-238],size:[156,28],rotation:.72,lanes:3,startElevation:10.5,endElevation:10.5,deckElevation:10.5,deckThickness:1.6,supportSpacing:28,supportStyle:"paired",barriers:!0,shoulders:!0,priority:78},{id:"industrial-exit-ramp",name:"Industrial Exit Ramp",zone:"industrial",roadClass:"ramp",kind:"ramp",center:[230,-252],size:[118,24],rotation:-.28,lanes:2,startElevation:10.5,endElevation:0,deckThickness:1.35,supportSpacing:24,supportStyle:"single",barriers:!0,shoulders:!0,priority:76,signs:[{at:.18,text:"INDUSTRIAL EXIT"}]},{id:"park-highway-onramp",name:"Park Highway On-Ramp",zone:"park",roadClass:"ramp",kind:"ramp",center:[-236,-70],size:[176,22],rotation:-.58,lanes:2,startElevation:0,endElevation:9.5,deckThickness:1.35,supportSpacing:24,supportStyle:"single",barriers:!0,shoulders:!0,priority:74,signs:[{at:.28,text:"MERGE"}]}],Cg=[{id:"downtownExpresswayPath",name:"Downtown Expressway Curve",zone:"river",type:"ramp",width:28,lanes:3,deckThickness:1.45,supportSpacing:24,supportStyle:"paired",barriers:!0,shoulders:!0,traffic:!0,priority:130,samples:82,missionTags:["airport-express-sprint","downtown-flyover"],signs:[{index:18,text:"AIRPORT EXPRESS"}],points:[[0,0,-48],[6,1.2,-78],[4,5.8,-118],[-28,10.6,-162],[-92,12.2,-214],[-185,12.2,-272],[-292,12.2,-326]]},{id:"airportConnectorPath",name:"Airport Connector Ramp",zone:"airport",type:"ramp",width:28,lanes:3,deckThickness:1.45,supportSpacing:24,supportStyle:"paired",barriers:!0,shoulders:!0,traffic:!0,priority:124,samples:44,missionTags:["airport-express-sprint","airport-taxi"],signs:[{index:26,text:"TERMINAL EXIT"}],points:[[-292,12.2,-326],[-318,11.8,-340],[-344,8.4,-366],[-360,3.2,-396],[-360,0,-404],[-360,0,-372],[-360,0,-350]]},{id:"riverBridgePath",name:"River Landmark Bridge Path",zone:"river",type:"bridge",width:34,lanes:4,deckThickness:2.2,supportSpacing:42,supportStyle:"bridge-pier",barriers:!0,median:!0,shoulders:!0,traffic:!0,priority:150,samples:58,missionTags:["bridge-ring-run","bridge-crossing"],signs:[{index:28,text:"RIVER BRIDGE"}],points:[[-390,0,-172],[-330,6.2,-172],[-245,13.2,-172],[-140,15.8,-172],[-48,15.8,-172],[48,15.8,-172],[140,15.8,-172],[245,13.2,-172],[330,6.2,-172],[390,0,-172]]},{id:"southHighwayLoopPath",name:"Outer Highway Ring",zone:"highway",type:"elevated",width:34,lanes:4,deckThickness:1.75,supportSpacing:34,supportStyle:"paired",barriers:!0,median:!0,shoulders:!0,traffic:!0,priority:102,closed:!0,samples:168,missionTags:["bridge-ring-run","highway-speed-run"],signs:[{index:28,text:"WEST RING"},{index:72,text:"LOGISTICS EXIT"},{index:128,text:"CITY LOOP"}],points:[[-430,0,-330],[-430,4.8,-382],[-380,10.8,-424],[-245,10.8,-432],[-70,10.8,-426],[120,10.8,-424],[285,10.8,-414],[398,10.8,-350],[430,10.8,-200],[430,10.8,-32],[420,10.8,150],[360,10.8,328],[190,10.8,418],[0,10.8,432],[-190,10.8,418],[-360,10.8,328],[-430,10.8,150],[-430,10.8,-32],[-430,8.2,-188],[-430,3.8,-278]]},{id:"industrialFlyoverPath",name:"Industrial Flyover Exit",zone:"industrial",type:"ramp",width:24,lanes:2,deckThickness:1.35,supportSpacing:24,supportStyle:"single",barriers:!0,shoulders:!0,traffic:!0,priority:108,samples:34,missionTags:["industrial-cargo-route"],signs:[{index:18,text:"INDUSTRIAL EXIT"}],points:[[210,10.8,-420],[282,10.6,-414],[338,7.8,-398],[360,3.4,-382],[360,0,-370]]},{id:"marketExitRampPath",name:"Market Exit Ramp",zone:"market",type:"ramp",width:22,lanes:2,deckThickness:1.25,supportSpacing:24,supportStyle:"single",barriers:!0,shoulders:!0,traffic:!1,priority:104,samples:34,missionTags:["grand-city-cruise"],signs:[{index:12,text:"MARKET EXIT"}],points:[[330,0,-172],[282,4.5,-142],[212,7.8,-106],[132,5,-78],[72,0,-62]]},{id:"hillConnectorPath",name:"Hill Connector Flyover",zone:"hill",type:"ramp",width:22,lanes:2,deckThickness:1.25,supportSpacing:26,supportStyle:"single",barriers:!0,shoulders:!0,traffic:!1,priority:96,samples:42,missionTags:["scenic-hill-switchback","hill-to-highway"],signs:[{index:24,text:"VIEWPOINT LINK"}],points:[[184,0,132],[218,2.2,160],[252,5.8,202],[270,8.8,246],[224,9.2,276],[150,9.2,276],[118,5.4,244],[108,0,198]]}],Ag=[{id:"airport-airliner-clearance",center:[-360,-286],size:[138,86],rotation:Math.PI*.02},{id:"airport-terminal-clearance",center:[-424,-372],size:[96,42],rotation:0},{id:"river-bridge-clearance",center:[0,-172],size:[790,54],rotation:0},{id:"south-express-clearance",center:[0,-420],size:[900,58],rotation:0},{id:"industrial-depot-clearance",center:[360,-330],size:[210,150],rotation:0}],Jl=[{id:"downtown",position:[0,0,28],heading:Math.PI},{id:"south-express",position:[0,0,-420],heading:Math.PI*.5},{id:"airport-express-ramp",position:[-28,0,-162],heading:-2.55},{id:"river-bridge-deck",position:[-72,0,-172],heading:Math.PI*.5},{id:"airport-elevated-exit",position:[-360,0,-396],heading:0},{id:"airport",position:[-360,0,-404],heading:0},{id:"industrial",position:[360,0,-370],heading:Math.PI*.5},{id:"park",position:[-122,0,34],heading:-Math.PI*.5},{id:"hill",position:[108,0,144],heading:.52}],Rg=[{id:"central-tower",name:"Central Tower",description:"The glassy centerpiece of Downtown Core.",position:[24,22],radius:20,reward:35,xp:55},{id:"city-hall",name:"City Hall",description:"A cream stone civic landmark near Downtown Core.",position:[30,112],radius:18,reward:32,xp:52},{id:"park-fountain",name:"Grand Park Fountain",description:"A larger fountain plaza inside the expanded Park Loop.",position:[-190,66],radius:22,reward:32,xp:55},{id:"highway-bridge",name:"Expressway Bridge",description:"A long elevated road crossing the river corridor.",position:[0,-172],radius:24,reward:42,xp:64},{id:"market-gate",name:"Market Gate",description:"The bright entry to tighter shop streets.",position:[-134,182],radius:18,reward:30,xp:50},{id:"residential-square",name:"Residential Square",description:"A quieter local square for smooth cruising.",position:[184,74],radius:18,reward:30,xp:50},{id:"hill-viewpoint",name:"Hill Viewpoint",description:"A scenic deck above Mini City.",position:[170,258],radius:22,reward:45,xp:70},{id:"airport-terminal",name:"Horizon Airport Terminal",description:"A sunny airport terminal beside the giant procedural airplane.",position:[-424,-350],radius:28,reward:48,xp:76},{id:"giant-airplane",name:"Horizon Airliner",description:"A huge parked aircraft built from procedural geometry.",position:[-360,-286],radius:28,reward:52,xp:82},{id:"industrial-depot",name:"Industrial Depot",description:"A dense cargo yard with warehouses, containers, and logistics roads.",position:[360,-330],radius:24,reward:42,xp:64},{id:"river-corridor",name:"River Bridge Corridor",description:"A blue water corridor crossed by city bridges and express roads.",position:[0,-194],radius:24,reward:34,xp:54}],Pg=[...[-120,-60,0,60,120].map((s,e)=>({id:`coin-downtown-${e}`,type:"cityCoin",position:[s,0],value:8,xp:1})),...[-420,-300,-180,-60,60,180,300,420].map((s,e)=>({id:`coin-express-south-${e}`,type:"cityCoin",position:[s,-420],value:9,xp:2})),...[-420,-300,-180,-60,60,180,300,420].map((s,e)=>({id:`coin-express-north-${e}`,type:"cityCoin",position:[s,420],value:9,xp:2})),...[-410,-384,-358,-332].map((s,e)=>({id:`coin-airport-${e}`,type:"cityCoin",position:[s,-324],value:10,xp:2})),...[300,340,380,420].map((s,e)=>({id:`coin-industrial-${e}`,type:"cityCoin",position:[s,-370],value:10,xp:2})),...[-228,-205,-182,-160,-138].map((s,e)=>({id:`coin-park-${e}`,type:"cityCoin",position:[s,94],value:8,xp:1})),...[-122,-82,-42,-2,38].map((s,e)=>({id:`coin-market-${e}`,type:"cityCoin",position:[s,182],value:8,xp:1})),...[150,184,218].map((s,e)=>({id:`coin-residential-${e}`,type:"cityCoin",position:[s,74],value:8,xp:1})),...[126,158,190,222].map((s,e)=>({id:`coin-hill-${e}`,type:"cityCoin",position:[s,230+e*8],value:11,xp:2})),{id:"token-airliner",type:"landmarkToken",position:[-360,-272],value:70,xp:100,oneTime:!0},{id:"token-industrial",type:"hiddenWheel",position:[420,-290],value:60,xp:90,oneTime:!0},{id:"token-bridge",type:"landmarkToken",position:[0,-172],value:55,xp:80,oneTime:!0},{id:"token-viewpoint",type:"hiddenWheel",position:[172,266],value:60,xp:90,oneTime:!0},{id:"token-market",type:"hiddenWheel",position:[-134,214],value:48,xp:76,oneTime:!0}],zc=[{id:"downtown-loop",zone:"downtown",speed:8,type:"car",points:[[-62,-62],[62,-62],[62,62],[-62,62]]},{id:"downtown-boulevard-flow",zone:"downtown",speed:8.6,type:"taxi",points:[[0,-118],[0,118],[62,118],[62,-118]]},{id:"south-express-flow",zone:"highway",speed:17,type:"car",points:[[-430,-420],[-240,-420],[0,-420],[240,-420],[430,-346]]},{id:"airport-expressway-flow",zone:"highway",speed:15.5,type:"taxi",points:[[0,-62],[-28,-162],[-185,-272],[-292,-326],[-360,-404],[-360,-350]]},{id:"river-bridge-flow",zone:"highway",speed:16.8,type:"car",points:[[-390,-172],[-195,-172],[0,-172],[195,-172],[390,-172]]},{id:"north-elevated-flow",zone:"highway",speed:15.8,type:"car",points:[[-420,420],[-160,420],[96,420],[380,380],[430,160]]},{id:"outer-ring-flow",zone:"highway",speed:16,type:"car",points:[[-430,-360],[-430,360],[0,420],[430,360],[430,-360],[0,-420]]},{id:"airport-service-loop",zone:"airport",speed:6.8,type:"van",points:[[-360,-404],[-360,-350],[-274,-350],[-274,-404]]},{id:"industrial-loop",zone:"industrial",speed:6.2,type:"delivery-truck",points:[[290,-370],[430,-370],[430,-290],[290,-290]]},{id:"market-loop",zone:"market",speed:5.4,type:"van",points:[[-134,182],[-58,182],[38,182],[-20,126],[-134,166]]},{id:"residential-loop",zone:"residential",speed:6,type:"car",points:[[122,74],[184,16],[250,74],[218,126],[184,132]]},{id:"park-loop",zone:"park",speed:6.6,type:"car",points:[[-122,34],[-206,34],[-226,94],[-146,106],[-122,34]]},{id:"hill-loop",zone:"hill",speed:6.8,type:"car",points:[[108,144],[150,194],[202,230],[170,258],[130,210]]}],Dg=Jl[0],dt=(s,e,t)=>Math.min(t,Math.max(e,s)),Lg=(s,e,t)=>s+(e-s)*dt(t,0,1),Ig=(s,e,t)=>dt((t-s)/(e-s),0,1),Pt=(s,e,t,i)=>Lg(s,e,1-Math.exp(-t*i)),Ql=(s,e)=>{let t=(e-s+Math.PI)%(Math.PI*2);return t<0&&(t+=Math.PI*2),t-Math.PI},ed=(s,e,t,i)=>s+Ql(s,e)*(1-Math.exp(-t*i)),hi=(s,e)=>{const t=s[0]-e[0],i=s[1]-e[1];return Math.hypot(t,i)},qa=s=>new C(Math.sin(s),0,Math.cos(s)),ts=s=>{const e=Math.max(0,s),t=Math.floor(e/60),i=Math.floor(e%60),n=Math.floor((e-Math.floor(e))*10);return`${t}:${String(i).padStart(2,"0")}.${n}`},Nn=(s,e,t,i=0)=>{const n=Math.cos(-i),r=Math.sin(-i),a=s.x-e.x,o=s.z-e.z,c=a*n-o*r,l=a*r+o*n;return Math.abs(c)<=t.x*.5&&Math.abs(l)<=t.z*.5};class kg{constructor(e){this.saveManager=e,this.context=null,this.master=null,this.engineOsc=null,this.engineGain=null,this.ambienceOsc=null,this.ambienceGain=null,this.enabled=!1,this.cockpitActive=!1,this.unlock=this.unlock.bind(this),window.addEventListener("pointerdown",this.unlock,{once:!0}),window.addEventListener("keydown",this.unlock,{once:!0})}unlock(){if(this.enabled)return;const e=window.AudioContext||window.webkitAudioContext;e&&(this.context=new e,this.master=this.context.createGain(),this.master.connect(this.context.destination),this.engineGain=this.context.createGain(),this.engineGain.gain.value=0,this.engineOsc=this.context.createOscillator(),this.engineOsc.type="sawtooth",this.engineOsc.frequency.value=80,this.engineOsc.connect(this.engineGain),this.engineGain.connect(this.master),this.engineOsc.start(),this.ambienceGain=this.context.createGain(),this.ambienceGain.gain.value=.02,this.ambienceOsc=this.context.createOscillator(),this.ambienceOsc.type="sine",this.ambienceOsc.frequency.value=122,this.ambienceOsc.connect(this.ambienceGain),this.ambienceGain.connect(this.master),this.ambienceOsc.start(),this.enabled=!0,this.applyVolumes())}applyVolumes(){if(!this.enabled)return;const e=this.saveManager.settings;this.master.gain.setTargetAtTime(e.masterVolume,this.context.currentTime,.05),this.ambienceGain.gain.setTargetAtTime(.026*e.ambienceVolume,this.context.currentTime,.08)}updateEngine(e,t,i,n,r=null){if(!this.enabled)return;const a=this.saveManager.settings,o=this.context.currentTime,c=r?.id==="supercar"?1.28:r?.id==="suv"||r?.id==="offroad-jeep"?.82:r?.id==="classic"?.72:r?.id==="sports-coupe"?1.1:.95,l=this.cockpitActive?.88:1,d=this.cockpitActive?.94:1,h=(.018+dt(e,0,1)*.055+(t?.02:0))*l,u=(72+dt(e,0,1)*210+(n?80:0))*c*d;this.engineOsc.frequency.setTargetAtTime(u,o,.06),this.engineGain.gain.setTargetAtTime(h*a.engineVolume,o,.06),i&&this.play("drift",.16)}setCockpitActive(e){this.cockpitActive=!!e}play(e,t=1){if(!this.enabled)return;const i=this.context.currentTime,n=this.saveManager.settings,r=this.context.createGain(),a=this.context.createOscillator(),o=["drift","tire","skid"],c=o.includes(e)?n.tireVolume:n.uiVolume,l=this.cockpitActive&&o.includes(e)?.72:1,d=c*t*l,h={coin:[880,.08,"sine"],checkpoint:[640,.14,"triangle"],complete:[520,.34,"sine"],fail:[128,.32,"sawtooth"],boost:[260,.16,"square"],crash:[92,.16,"sawtooth"],drift:[180,.08,"triangle"],tuning:[740,.12,"triangle"],mastery:[920,.18,"sine"],event:[560,.18,"triangle"],objective:[780,.14,"sine"],pickup:[620,.12,"triangle"],click:[420,.06,"sine"]},[u,f,g]=h[e]??h.click;a.type=g,a.frequency.value=u,r.gain.setValueAtTime(1e-4,i),r.gain.exponentialRampToValueAtTime(Math.max(2e-4,.09*d),i+.012),r.gain.exponentialRampToValueAtTime(1e-4,i+f),a.connect(r),r.connect(this.master),a.start(i),a.stop(i+f+.02)}setMuted(e){this.enabled&&this.master.gain.setTargetAtTime(e?0:this.saveManager.settings.masterVolume,this.context.currentTime,.05)}}const td={motionLevels:{off:0,low:.45,normal:1},fovOffsets:{low:-4,normal:0,wide:5}},Hc={hatchback:{name:"Compact city cockpit",visibility:"Wide city windshield",dashboardStyle:"Rounded digital dashboard",drivingFeel:"Easy, practical, open view",camera:{localPosition:[-.22,1.38,.7],lookAhead:13,lookHeight:1.35,fov:68,clearance:.12},motion:{lean:.018,pitch:.016,push:.035,vibration:.006},dashboard:{width:2.08,height:.34,y:-.48,z:-1.08,shape:"rounded",display:"digital",accent:"#d4a84f"},wheel:{x:-.34,y:-.29,z:-.72,radius:.25,tube:.018,maxTurn:1.08,spokes:3},windshield:{width:2.34,height:1.22,y:.08,z:-1.25,pillarWidth:.045,tint:.08},materials:{dash:"#444b55",lower:"#222832",trim:"#d8c3a1",display:"#9ee8ff",frame:"#2b313a",seat:"#303844"}},"sports-coupe":{name:"Sport coupe cockpit",visibility:"Lower, tighter windshield",dashboardStyle:"Analog tach with red accents",drivingFeel:"Focused and performance-heavy",camera:{localPosition:[-.26,1.17,.55],lookAhead:15,lookHeight:1.15,fov:70,clearance:.1},motion:{lean:.024,pitch:.021,push:.045,vibration:.008},dashboard:{width:2.16,height:.3,y:-.48,z:-1.02,shape:"sport",display:"sport-analog",accent:"#e74c3c"},wheel:{x:-.32,y:-.28,z:-.7,radius:.27,tube:.024,maxTurn:1.18,spokes:3},windshield:{width:2.16,height:.98,y:.03,z:-1.18,pillarWidth:.052,tint:.07},materials:{dash:"#242833",lower:"#151a22",trim:"#e74c3c",display:"#ffd1c9",frame:"#151820",seat:"#252a32"}},suv:{name:"High comfort cockpit",visibility:"Tall broad windshield",dashboardStyle:"Large practical dash with center screen",drivingFeel:"Stable high seating position",camera:{localPosition:[-.24,1.64,.68],lookAhead:12.5,lookHeight:1.62,fov:66,clearance:.14},motion:{lean:.012,pitch:.013,push:.026,vibration:.004},dashboard:{width:2.34,height:.42,y:-.5,z:-1.1,shape:"broad",display:"center-screen",accent:"#c7a15a"},wheel:{x:-.36,y:-.27,z:-.73,radius:.3,tube:.024,maxTurn:.95,spokes:4},windshield:{width:2.46,height:1.38,y:.14,z:-1.28,pillarWidth:.06,tint:.075},materials:{dash:"#53585f",lower:"#252a31",trim:"#c7a15a",display:"#a4d7ff",frame:"#313842",seat:"#343c47"}},supercar:{name:"Low supercar cockpit",visibility:"Wide low glass canopy",dashboardStyle:"Sharp digital speed strip",drivingFeel:"Aggressive high-speed view",camera:{localPosition:[-.18,1.02,.52],lookAhead:17,lookHeight:1,fov:74,clearance:.08},motion:{lean:.03,pitch:.018,push:.055,vibration:.01},dashboard:{width:2.28,height:.25,y:-.51,z:-.98,shape:"wedge",display:"digital-strip",accent:"#1abc9c"},wheel:{x:-.22,y:-.31,z:-.66,radius:.23,tube:.02,maxTurn:1.28,spokes:2},windshield:{width:2.5,height:.86,y:-.02,z:-1.1,pillarWidth:.045,tint:.065},materials:{dash:"#111820",lower:"#070b10",trim:"#1abc9c",display:"#b9fff2",frame:"#0b1118",seat:"#171d25"}},"offroad-jeep":{name:"Rugged trail cockpit",visibility:"Upright windshield and hood view",dashboardStyle:"Chunky utility gauges",drivingFeel:"Tall, tough, all-road posture",camera:{localPosition:[-.26,1.62,.58],lookAhead:12,lookHeight:1.58,fov:67,clearance:.18},motion:{lean:.017,pitch:.018,push:.03,vibration:.012},dashboard:{width:2.18,height:.38,y:-.48,z:-1.03,shape:"rugged",display:"rugged-analog",accent:"#e4c56a"},wheel:{x:-.35,y:-.25,z:-.7,radius:.32,tube:.026,maxTurn:1.02,spokes:4},windshield:{width:2.28,height:1.34,y:.13,z:-1.16,pillarWidth:.075,tint:.06},materials:{dash:"#31362c",lower:"#171b15",trim:"#e4c56a",display:"#f7f2c1",frame:"#20261d",seat:"#30372a"}},classic:{name:"Vintage cruiser cockpit",visibility:"Wide old-school windshield",dashboardStyle:"Round analog chrome gauges",drivingFeel:"Warm classic touring feel",camera:{localPosition:[-.24,1.28,.72],lookAhead:13,lookHeight:1.28,fov:66,clearance:.12},motion:{lean:.014,pitch:.012,push:.026,vibration:.005},dashboard:{width:2.28,height:.36,y:-.49,z:-1.08,shape:"vintage",display:"classic-round",accent:"#d4af37"},wheel:{x:-.34,y:-.28,z:-.72,radius:.31,tube:.014,maxTurn:.9,spokes:3},windshield:{width:2.36,height:1.08,y:.06,z:-1.22,pillarWidth:.05,tint:.05},materials:{dash:"#6a4934",lower:"#302018",trim:"#d4af37",display:"#fff2ca",frame:"#5a3928",seat:"#8d6547"}}},_o=s=>Hc[s]??Hc.hatchback,js=[{id:"standard",label:"Standard Chase",distance:12,height:5.3,lookAhead:7,fov:62},{id:"far",label:"Far Chase",distance:18,height:8.2,lookAhead:10,fov:66},{id:"hood",label:"Hood View",distance:-1.1,height:1.85,lookAhead:16,fov:72},{id:"cockpit",label:"Cockpit View",distance:0,height:1.3,lookAhead:14,fov:68}],qr=js.map(s=>s.id);class Ng{constructor(e,t){this.camera=e,this.saveManager=t;const i=t.settings.cameraMode;this.modeIndex=Math.max(0,qr.indexOf(qr.includes(i)?i:"standard")),this.lastChaseMode=this.currentMode.id==="cockpit"?"standard":this.currentMode.id,this.position=new C(0,8,-14),this.target=new C,this.vehicleWorld=new C,this.yaw=0,this.shake=0}nextMode(){const e=js[(this.modeIndex+1)%js.length].id;return this.setMode(e),this.currentMode.label}setMode(e,t=!0){const i=qr.indexOf(e);return i<0?this.currentMode.label:(this.currentMode.id!=="cockpit"&&e!=="cockpit"&&(this.lastChaseMode=this.currentMode.id),this.modeIndex=i,e!=="cockpit"&&(this.lastChaseMode=e),t&&this.saveManager.updateSettings({cameraMode:this.currentMode.id}),this.currentMode.label)}toggleCockpit(){return this.currentMode.id==="cockpit"?this.setMode(this.lastChaseMode||"standard"):(this.lastChaseMode=this.currentMode.id,this.setMode("cockpit"))}getMode(){return this.currentMode}get currentMode(){return js[this.modeIndex]}update(e,t,i){const n=this.currentMode,r=qa(t.heading),a=t.getWorldPosition?t.getWorldPosition(this.vehicleWorld):this.vehicleWorld.copy(t.mesh?.position??t.position);if(n.id==="cockpit"){this.updateCockpit(e,t,i,a,r);return}this.yaw=ed(this.yaw,t.heading,n.id==="hood"?18:8.5,e);const o=qa(this.yaw),c=i.speedRatio*(n.id==="hood"?.7:3.2),l=i.elevated?.65:0,d=a.clone().addScaledVector(o,-n.distance-c).add(new C(0,n.height+i.speedRatio*.65+l,0));n.id==="hood"&&d.copy(a).addScaledVector(r,1.55).add(new C(0,n.height+l*.35,0));const h=n.id==="hood"?16:6.5,u=n.id==="hood"?14:5.4,f=1-Math.exp(-h*e);this.position.x+=(d.x-this.position.x)*f,this.position.z+=(d.z-this.position.z)*f,this.position.y=Pt(this.position.y,d.y,u,e),this.target.copy(a).addScaledVector(r,n.lookAhead+i.speedRatio*4).add(new C(0,1.2+l*.25,0)),this.shake=Math.max(this.shake,i.collisionIntensity);const g=this.saveManager.settings.cameraShake,y=g==="normal"?.23:g==="low"?.11:0,m=this.shake*y;this.shake=Math.max(0,this.shake-e*1.8),this.camera.position.copy(this.position),m>.01&&(this.camera.position.x+=(Math.random()-.5)*m,this.camera.position.y+=(Math.random()-.5)*m*.5),this.camera.lookAt(this.target),this.camera.fov=Pt(this.camera.fov,n.fov+i.speedRatio*7,4.6,e),this.camera.updateProjectionMatrix()}updateCockpit(e,t,i,n,r){const a=_o(t.config?.id),o=a.camera.localPosition,c=new C(r.z,0,-r.x),l=i.elevated?a.camera.clearance+.08:a.camera.clearance,d=.32,h=n.clone().addScaledVector(c,o[0]).add(new C(0,o[1]+l+d,0)).addScaledVector(r,o[2]),u=(i.speedRatio??0)*.14;h.addScaledVector(r,u),this.position.x=h.x,this.position.z=h.z,this.position.y=Pt(this.position.y,h.y,24,e),this.target.copy(n).addScaledVector(r,a.camera.lookAhead+(i.speedRatio??0)*4).add(new C(0,a.camera.lookHeight+l*.35,0)),this.shake=Math.max(this.shake,i.collisionIntensity*.55);const f=this.saveManager.settings.cameraShake,y=this.saveManager.settings.cockpitMotion==="off"?0:f==="normal"?.08:f==="low"?.04:0,m=this.shake*y;this.shake=Math.max(0,this.shake-e*2.1),this.camera.position.copy(this.position),m>.005&&(this.camera.position.x+=(Math.random()-.5)*m,this.camera.position.y+=(Math.random()-.5)*m*.45),this.camera.lookAt(this.target);const p=td.fovOffsets[this.saveManager.settings.cockpitFov]??0,M=a.camera.fov+p+(i.boosting?3:0)+(i.speedRatio??0)*2.5;this.camera.fov=Pt(this.camera.fov,M,5.5,e),this.camera.updateProjectionMatrix()}}const Je={HARD_SOLID:"HARD_SOLID",SLIDE_SOLID:"SLIDE_SOLID",LOW_SURPASSABLE:"LOW_SURPASSABLE",SOFT_PASSABLE:"SOFT_PASSABLE",SOLID_DYNAMIC:"SOLID_DYNAMIC",ROAD_SURFACE:"ROAD_SURFACE",TRIGGER_ONLY:"TRIGGER_ONLY",NO_BUILD_ZONE:"NO_BUILD_ZONE"},Jt={carColliderPadding:.035,staticColliderPadding:.02,trafficColliderPadding:.04,collisionDamping:.68,wallSlideFriction:.84,bounceFactor:.92,softObstaclePassThreshold:3.2,curbClimbHeight:.62,barrierHardness:.82},Ug={[Je.HARD_SOLID]:16731978,[Je.SLIDE_SOLID]:16765015,[Je.LOW_SURPASSABLE]:6937087,[Je.SOFT_PASSABLE]:5628114,[Je.SOLID_DYNAMIC]:6806015,[Je.ROAD_SURFACE]:8378558,[Je.TRIGGER_ONLY]:5088511,[Je.NO_BUILD_ZONE]:11832575};class Fg{constructor(e){this.scene=e,this.cellSize=34,this.colliders=[],this.roadSurfaces=[],this.grid=new Map,this.debugGroup=new ft,this.debugGroup.name="Collision Debug",this.debugGroup.visible=!1,this.scene.add(this.debugGroup),this.debugTimer=0,this.lastDebugStats={staticCount:0,roadSurfaceCount:0,nearbyCount:0,currentSurface:"ground"}}addBox(e){const t=e.type??Je.HARD_SOLID,i=e.padding??(t===Je.SLIDE_SOLID||t===Je.HARD_SOLID?Jt.staticColliderPadding:0),n={id:e.id,type:t,center:new he(e.center[0],e.center[1]),size:new he(Math.max(.05,e.size[0]-i*2),Math.max(.05,e.size[1]-i*2)),rotation:e.rotation??0,yMin:e.yMin??0,yMax:e.yMax??8,response:e.response??"block",metadata:e.metadata??{}};return n.aabb=this.computeAabb(n),this.colliders.push(n),n.type===Je.ROAD_SURFACE?this.roadSurfaces.push(n):this.isBlockingType(n.type)&&this.insertIntoGrid(n),this.lastDebugStats.staticCount=this.colliders.filter(r=>this.isBlockingType(r.type)).length,this.lastDebugStats.roadSurfaceCount=this.roadSurfaces.length,n}addRoadSurface(e){return this.addBox({...e,type:Je.ROAD_SURFACE,yMin:e.yMin??(e.surfaceHeight??0)-.25,yMax:e.yMax??(e.surfaceHeight??0)+.35,response:"surface"})}resolvePlayer(e,t=.016){const i=e.getCollider(),n=Math.max(i.size.x,i.size.y)*.58+2.2,r=this.queryNearby(i.center,n);let a=!1,o=0;const c=[];for(const l of r){if(!this.verticalOverlap(i,l))continue;const d=this.testObbOverlap(i,l);if(!d)continue;if(l.type===Je.LOW_SURPASSABLE){e.registerLowSurfaceBump?.(l.metadata?.bump??.12,t),e.velocity.multiplyScalar(l.metadata?.slowdown??.96);continue}if(l.type===Je.SOFT_PASSABLE){const m=e.velocity.length();e.velocity.multiplyScalar(l.metadata?.slowdown??.93),m>Jt.softObstaclePassThreshold&&e.registerCollisionImpact?.(.12,l.id,t,{quiet:!0});continue}const h=l.type===Je.SLIDE_SOLID||l.response==="slide",u=d.normal.clone().multiplyScalar(d.depth+(h?.006:.012));e.position.x+=u.x,e.position.z+=u.z,i.center.x=e.position.x,i.center.y=e.position.z;const f=new C(d.normal.x,0,d.normal.z),g=e.velocity.dot(f);g<0&&e.velocity.addScaledVector(f,-g*(h?Jt.barrierHardness:Jt.bounceFactor)),e.velocity.multiplyScalar(h?Jt.wallSlideFriction:Jt.collisionDamping);const y=dt((h?.1:.16)+d.depth*.18+e.velocity.length()*.018,.12,1.05);o=Math.max(o,y),a=!0,c.push(l.id)}return a&&e.registerCollisionImpact(o,c[0],t),{collided:a,intensity:o,count:c.length,ids:c}}resolveTrafficVehicles(e,t){const i=e.getCollider();let n=0;return t.forEach(r=>{const a=r.mesh.userData.dimensions;if(!a)return;const o={id:`traffic-${r.type}`,type:Je.SOLID_DYNAMIC,center:new he(r.mesh.position.x,r.mesh.position.z),size:new he(Math.max(.4,a.width*r.mesh.scale.x*.82+Jt.trafficColliderPadding),Math.max(.4,a.length*r.mesh.scale.z*.84+Jt.trafficColliderPadding)),rotation:r.mesh.rotation.y,yMin:r.mesh.position.y-.15,yMax:r.mesh.position.y+a.height*r.mesh.scale.y+1.2};if(!this.verticalOverlap(i,o))return;const c=this.testObbOverlap(i,o);if(!c)return;e.position.x+=c.normal.x*(c.depth+.04),e.position.z+=c.normal.z*(c.depth+.04);const l=new C(c.normal.x,0,c.normal.z),d=e.velocity.dot(l);d<0&&e.velocity.addScaledVector(l,-d*1.05),e.velocity.multiplyScalar(.62),r.mesh.position.x-=c.normal.x*Math.min(c.depth*.28,.5),r.mesh.position.z-=c.normal.z*Math.min(c.depth*.28,.5),r.cooldown=.9,n+=1}),n&&e.registerCollisionImpact(.72,"traffic",.016),n}findNearestRoadSurface(e,t=null){let i=null,n=1/0;const r=t?.surfaceHeight??0,a=!!(t?.elevated||t?.pathId||["ramp","bridge","elevated"].includes(t?.surfaceType));return this.roadSurfaces.forEach(c=>{const l=c.metadata.surfaceHeight??0;if(!a&&l>r+4.5)return;const d=c.center.x-e.x,h=c.center.y-e.z,u=Math.hypot(d,h);u<n&&(n=u,i=c)}),i?{id:i.metadata.pathId??i.metadata.routeId??i.id,colliderId:i.id,position:new C(i.center.x,i.metadata.surfaceHeight??0,i.center.y),heading:i.size.x>=i.size.y?(i.rotation??0)+Math.PI*.5:i.rotation??0,surfaceHeight:i.metadata.surfaceHeight??0}:null}updateDebug(e,t,i){if(this.debugGroup.visible=e,!e||(this.debugTimer-=.016,this.debugTimer>0))return;this.debugTimer=.2,this.clearDebug();const n=t?.getCollider(),r=n?this.queryNearby(n.center,90):[],a=n?this.roadSurfaces.filter(c=>c.center.distanceTo(n.center)<95):[],o=n?this.colliders.filter(c=>c.type===Je.NO_BUILD_ZONE&&c.center.distanceTo(n.center)<130):[];r.forEach(c=>this.addDebugBox(c)),a.forEach(c=>this.addDebugBox(c)),o.forEach(c=>this.addDebugBox(c)),n&&this.addDebugBox({...n,id:"player",type:Je.SOLID_DYNAMIC}),this.lastDebugStats={staticCount:this.colliders.filter(c=>this.isBlockingType(c.type)).length,roadSurfaceCount:this.roadSurfaces.length,nearbyCount:r.length,clearanceCount:o.length,currentSurface:i?.surfaceId??"ground",surfaceType:i?.surfaceType??"terrain",surfaceHeight:i?.surfaceHeight??0}}getDebugStats(){return this.lastDebugStats}clearDebug(){for(;this.debugGroup.children.length;){const e=this.debugGroup.children[0];this.debugGroup.remove(e),e.geometry?.dispose?.(),e.material?.dispose?.()}}addDebugBox(e){const t=e.yMin??0,i=e.yMax??.12,n=Math.max(.12,i-t),r=new W(e.size.x,n,e.size.y),a=new Et({color:Ug[e.type]??16777215,wireframe:!0,transparent:!0,opacity:e.type===Je.ROAD_SURFACE?.34:.62}),o=new L(r,a);o.position.set(e.center.x,t+n*.5,e.center.y),o.rotation.y=e.rotation??0,this.debugGroup.add(o)}queryNearby(e,t){const i=new Set,n=Math.floor((e.x-t)/this.cellSize),r=Math.floor((e.x+t)/this.cellSize),a=Math.floor((e.y-t)/this.cellSize),o=Math.floor((e.y+t)/this.cellSize);for(let c=n;c<=r;c+=1)for(let l=a;l<=o;l+=1){const d=this.grid.get(`${c}:${l}`);d&&d.forEach(h=>i.add(h))}return i}insertIntoGrid(e){const t=e.aabb,i=Math.floor(t.minX/this.cellSize),n=Math.floor(t.maxX/this.cellSize),r=Math.floor(t.minZ/this.cellSize),a=Math.floor(t.maxZ/this.cellSize);for(let o=i;o<=n;o+=1)for(let c=r;c<=a;c+=1){const l=`${o}:${c}`;this.grid.has(l)||this.grid.set(l,[]),this.grid.get(l).push(e)}}computeAabb(e){const t=this.getAxes(e.rotation??0),i=e.size.x*.5,n=e.size.y*.5,r=[t.x.clone().multiplyScalar(i).add(t.z.clone().multiplyScalar(n)),t.x.clone().multiplyScalar(i).add(t.z.clone().multiplyScalar(-n)),t.x.clone().multiplyScalar(-i).add(t.z.clone().multiplyScalar(n)),t.x.clone().multiplyScalar(-i).add(t.z.clone().multiplyScalar(-n))].map(a=>a.add(e.center));return{minX:Math.min(...r.map(a=>a.x)),maxX:Math.max(...r.map(a=>a.x)),minZ:Math.min(...r.map(a=>a.y)),maxZ:Math.max(...r.map(a=>a.y))}}testObbOverlap(e,t){const i=this.getAxes(e.rotation??0),n=this.getAxes(t.rotation??0),r=[i.x,i.z,n.x,n.z];let a=1/0,o=null;for(const l of r){const d=this.projectObb(e,l),h=this.projectObb(t,l),u=Math.min(d.max,h.max)-Math.max(d.min,h.min);if(u<=0)return null;u<a&&(a=u,o=l.clone())}return e.center.clone().sub(t.center).dot(o)<0&&o.multiplyScalar(-1),{normal:new C(o.x,0,o.y),depth:a}}projectObb(e,t){const i=this.getAxes(e.rotation??0),n=e.center.dot(t),r=Math.abs(i.x.dot(t))*e.size.x*.5+Math.abs(i.z.dot(t))*e.size.y*.5;return{min:n-r,max:n+r}}getAxes(e){return{x:new he(Math.cos(e),Math.sin(e)),z:new he(-Math.sin(e),Math.cos(e))}}verticalOverlap(e,t){return(e.yMin??0)<=(t.yMax??0)&&(e.yMax??2)>=(t.yMin??0)}isBlockingType(e){return e===Je.HARD_SOLID||e===Je.SLIDE_SOLID||e===Je.LOW_SURPASSABLE||e===Je.SOFT_PASSABLE}}class Og{constructor(e,t,i){this.scene=e,this.effectsManager=t,this.vehicleFactory=i,this.group=new ft,this.group.name="Mini City Drive City",this.scene.add(this.group),this.collisionSystem=new Fg(e),this.roadSegments=Eg,this.elevatedRoutes=[],this.roadPaths=this.prepareRoadPaths(Cg),this.legacyElevatedRoutes=[...Tg].sort((n,r)=>(r.priority??0)-(n.priority??0)),this.collectibles=[],this.landmarks=Rg,this.currentZoneId=null,this.textures=new Map,this.materials=this.createMaterials()}prepareRoadPaths(e){return e.map(t=>{const i=t.points.map(([l,d,h])=>new C(l,d,h)),n=new El(i,!!t.closed,"catmullrom",.35),r=t.samples??Math.max(18,Math.round(i.length*8)),a=n.getPoints(r),o=[];let c=0;for(let l=0;l<a.length-1;l+=1){const d=a[l],h=a[l+1],u=Math.hypot(h.x-d.x,h.z-d.z);u<.01||(c+=u,o.push({index:l,a:d,b:h,midpoint:new C((d.x+h.x)*.5,(d.y+h.y)*.5,(d.z+h.z)*.5),heading:Math.atan2(h.x-d.x,h.z-d.z),slope:Math.atan2(h.y-d.y,u),length:u}))}return{...t,controlPoints:i,curve:n,samples:a,segments:o,length:c}}).sort((t,i)=>(i.priority??0)-(t.priority??0))}createMaterials(){return{ground:new je({color:"#b8d884",roughness:.84}),park:new je({color:"#73b86d",roughness:.88}),asphalt:new je({color:"#41484e",roughness:.72}),sidewalk:new je({color:"#d8d1c4",roughness:.78}),lane:new je({color:"#f6f0dc",roughness:.48}),crosswalk:new je({color:"#ffffff",roughness:.42}),glass:new je({color:"#9bd4e6",roughness:.18,metalness:.12}),buildingA:new je({color:"#d9e0e4",roughness:.58}),buildingB:new je({color:"#c8d3dc",roughness:.58}),buildingC:new je({color:"#ebe0cf",roughness:.62}),trim:new je({color:"#caa76a",roughness:.34,metalness:.48}),dark:new je({color:"#1f2834",roughness:.5}),white:new je({color:"#fff8e9",roughness:.54}),redLight:new je({color:"#d93434",emissive:"#c51d1d",emissiveIntensity:.65}),greenLight:new je({color:"#31a96c",emissive:"#228f56",emissiveIntensity:.55}),water:new je({color:"#78c7e7",roughness:.08,metalness:.04,transparent:!0,opacity:.78}),runway:new je({color:"#343a40",roughness:.68}),concrete:new je({color:"#c9c4b8",roughness:.78}),bridgeBeam:new je({color:"#8e9699",roughness:.68,metalness:.06}),barrier:new je({color:"#f1eadc",roughness:.52}),shadowZone:new je({color:"#8d9a8e",roughness:.9,transparent:!0,opacity:.32}),containerA:new je({color:"#b45f45",roughness:.62}),containerB:new je({color:"#4d738f",roughness:.62}),river:new je({color:"#8ccde8",roughness:.12,metalness:.02,transparent:!0,opacity:.82})}}build(){this.addGround(),this.addZones(),this.addRoads(),this.addReservedZones(),this.addDowntown(),this.addPark(),this.addHighway(),this.addRiverCorridor(),this.addAirport(),this.addIndustrial(),this.addResidential(),this.addMarket(),this.addHill(),this.addLandmarks(),this.addCollectibles(),this.addParkedCars()}async buildAsync(e=()=>{}){const t=[["Preparing the ground...",()=>this.addGround()],["Mapping city zones...",()=>this.addZones()],["Laying the roads...",()=>this.addRoadsAsync()],["Reserving safe spaces...",()=>this.addReservedZones()],["Raising downtown...",()=>this.addDowntown()],["Planting the park...",()=>this.addPark()],["Opening the highway...",()=>this.addHighway()],["Shaping the river...",()=>this.addRiverCorridor()],["Opening the airport...",()=>this.addAirport()],["Loading industrial blocks...",()=>this.addIndustrial()],["Loading neighborhoods...",()=>this.addResidential()],["Opening market streets...",()=>this.addMarket()],["Finishing the hill route...",()=>this.addHill()],["Placing landmarks...",()=>this.addLandmarks()],["Scattering city rewards...",()=>this.addCollectibles()],["Parking traffic props...",()=>this.addParkedCars()]];for(const[i,n]of t)e(i),await n(),await this.yieldToBrowser()}yieldToBrowser(){return new Promise(e=>{window.setTimeout(e,0)})}addGround(){const e=new L(new W(tn.groundSize,.08,tn.groundSize),this.materials.ground);e.position.y=-.05,e.receiveShadow=!0,this.group.add(e)}addZones(){Ji.forEach(e=>{if(e.id==="downtown")return;const t=e.id==="park"?this.materials.park:new je({color:e.color,roughness:.82}),i=new L(new W(e.size[0],.04,e.size[1]),t);i.position.set(e.center[0],.005,e.center[1]),i.receiveShadow=!0,this.group.add(i)})}registerSolidBox(e,t,i,n,r,a=0,o=5,c={}){this.collisionSystem.addBox({id:e,type:c.type??Je.HARD_SOLID,center:[t,i],size:[Math.max(.4,n),Math.max(.4,r)],rotation:a,yMin:c.yMin??0,yMax:c.yMax??o,response:c.response??"block",metadata:c.metadata??{}})}getRotatedRectProbePoints(e,t,i,n,r=0){const a=i*.5,o=n*.5,c=Math.cos(r),l=Math.sin(r);return[[0,0],[-a,-o],[a,-o],[a,o],[-a,o],[0,-o],[a,0],[0,o],[-a,0]].map(([d,h])=>new C(e+d*c-h*l,0,t+d*l+h*c))}rectsOverlapApprox(e,t,i,n,r,a,o,c,l,d){const h=new C(e,0,t),u=new C(a,0,o),f=new C(i,0,n),g=new C(c,0,l),y=this.getRotatedRectProbePoints(e,t,i,n,r),m=this.getRotatedRectProbePoints(a,o,c,l,d);return y.some(p=>Nn(p,u,g,d))||m.some(p=>Nn(p,h,f,r))}overlapsRoadClearance(e,t,i,n,r=0,a=2.5){const o=i+a*2,c=n+a*2;for(const h of this.roadSegments)if(!h.soft&&this.rectsOverlapApprox(e,t,o,c,r,h.center[0],h.center[1],h.size[0]+a*2,h.size[1]+a*2,h.rotation??0))return!0;const l=Math.hypot(o,c)*.5,d=new C(e,0,t);return this.roadPaths.some(h=>{const u=this.projectPointToPath(h,d,l+a);return!!(u&&u.lateralDistance<h.width*.5+l+a)})}registerRoadSurface(e,t,i,n,r,a=0,o=0,c={}){this.collisionSystem.addRoadSurface({id:e,center:[t,i],size:[n,r],rotation:a,surfaceHeight:o,yMin:o-.28,yMax:o+.38,metadata:{surfaceHeight:o,...c}})}addRoads(){this.roadSegments.forEach(e=>{this.addRoadSegment(e)}),this.addPathRoads()}async addRoadsAsync(){for(let e=0;e<this.roadSegments.length;e+=1)this.addRoadSegment(this.roadSegments[e]),(e+1)%8===0&&await this.yieldToBrowser();for(const e of this.roadPaths)await this.addRoadPathAsync(e),await this.yieldToBrowser()}addReservedZones(){Ag.forEach(e=>{this.collisionSystem.addBox({id:e.id,type:Je.NO_BUILD_ZONE,center:e.center,size:e.size,rotation:e.rotation??0,yMin:0,yMax:.12,response:"debug",metadata:{clearance:!0}})})}addRoadSegment(e){const t=e.soft?new je({color:"#8aae72",roughness:.9}):e.roadClass==="runway"?this.materials.runway:this.materials.asphalt,i=new L(new W(e.size[0],.08,e.size[1]),t);i.position.set(e.center[0],.04+(e.elevation??0),e.center[1]),i.rotation.y=e.rotation,i.receiveShadow=!0,this.group.add(i),this.registerRoadSurface(e.id,e.center[0],e.center[1],e.size[0],e.size[1],e.rotation,e.elevation??0,{surfaceType:e.roadClass??"road",zone:e.zone}),this.addRoadDesign(e),e.showSidewalks&&this.addSidewalk(e),e.forceBarrier&&this.addRoadBarriers(e),(e.elevation??0)>5&&this.addElevatedSupports(e)}addPathRoads(){this.roadPaths.forEach(e=>this.addRoadPath(e))}addRoadPath(e){const t=new L(this.createPathDeckGeometry(e),this.materials.asphalt);t.castShadow=!0,t.receiveShadow=!0,this.group.add(t),e.segments.forEach(i=>this.addRoadPathSegment(e,i)),this.addPathSupports(e),this.addPathGantrySigns(e)}async addRoadPathAsync(e){const t=new L(this.createPathDeckGeometry(e),this.materials.asphalt);t.castShadow=!0,t.receiveShadow=!0,this.group.add(t);for(let i=0;i<e.segments.length;i+=1)this.addRoadPathSegment(e,e.segments[i]),(i+1)%12===0&&await this.yieldToBrowser();this.addPathSupports(e),this.addPathGantrySigns(e)}addRoadPathSegment(e,t){this.registerRoadSurface(`${e.id}-surface-${t.index}`,t.midpoint.x,t.midpoint.z,e.width,t.length+1.5,t.heading,t.midpoint.y,{surfaceType:e.type,zone:e.zone,elevated:t.midpoint.y>2.2,pathId:e.id,pathSegment:t.index}),this.addPathLaneMarks(e,t),e.showBarriers&&this.addPathBarriers(e,t),this.addPathUnderside(e,t),t.index%5===0&&t.midpoint.y>2.2&&this.addPathShadow(e,t)}createPathDeckGeometry(e){const t=[],i=[],n=e.width*.5,r=e.deckThickness??1.25;e.samples.forEach((c,l)=>{const d=e.samples[Math.max(0,l-1)],h=e.samples[Math.min(e.samples.length-1,l+1)],u=Math.atan2(h.x-d.x,h.z-d.z),f=new C(Math.cos(u),0,-Math.sin(u)),g=c.clone().addScaledVector(f,n),y=c.clone().addScaledVector(f,-n);t.push(g.x,g.y,g.z,y.x,y.y,y.z,g.x,g.y-r,g.z,y.x,y.y-r,y.z)});for(let c=0;c<e.samples.length-1;c+=1){const l=c*4,d=(c+1)*4;i.push(l,l+1,d+1,l,d+1,d,l+2,d+2,d+3,l+2,d+3,l+3,l,d,d+2,l,d+2,l+2,l+1,l+3,d+3,l+1,d+3,d+1)}const a=(e.samples.length-1)*4;i.push(0,2,3,0,3,1,a,a+1,a+3,a,a+3,a+2);const o=new Ht;return o.setAttribute("position",new gt(t,3)),o.setIndex(i),o.computeVertexNormals(),o}addPathLaneMarks(e,t){const i=Math.min(7.2,t.length*.82);if(this.getPathLaneDividerOffsets(e).forEach(n=>{if(t.index%2!==0)return;const r=this.offsetPathPoint(t.midpoint,t.heading,n),a=new L(new W(.22,.035,i),this.materials.lane);a.position.set(r.x,t.midpoint.y+.08,r.z),a.rotation.set(-t.slope,t.heading,0),this.group.add(a)}),e.median&&this.isHighwayPath(e)){const n=new L(new W(.48,.24,t.length+.3),this.materials.trim);n.position.set(t.midpoint.x,t.midpoint.y+.16,t.midpoint.z),n.rotation.set(-t.slope,t.heading,0),this.group.add(n),this.registerSolidBox(`${e.id}-center-divider-${t.index}`,t.midpoint.x,t.midpoint.z,.52,t.length+.42,t.heading,t.midpoint.y+.5,{type:Je.SLIDE_SOLID,response:"slide",yMin:Math.max(0,t.midpoint.y-.08),metadata:{pathId:e.id,centerDivider:!0,pathSegment:t.index}})}else e.median&&this.addPathPaintedCenterLine(t)}addPathPaintedCenterLine(e){if(e.index%2!==0)return;const t=new L(new W(.16,.026,Math.min(6.8,e.length*.78)),this.materials.trim);t.position.set(e.midpoint.x,e.midpoint.y+.085,e.midpoint.z),t.rotation.set(-e.slope,e.heading,0),this.group.add(t)}addPathBarriers(e,t){e.barriers&&[-1,1].forEach(i=>{const n=this.offsetPathPoint(t.midpoint,t.heading,i*e.width*.5),r=new L(new W(.62,1.05,t.length+.9),this.materials.barrier);r.position.set(n.x,t.midpoint.y+.55,n.z),r.rotation.set(-t.slope,t.heading,0),r.castShadow=!0,this.group.add(r),this.registerSolidBox(`${e.id}-path-barrier-${t.index}-${i}`,n.x,n.z,.82,t.length+1.1,t.heading,t.midpoint.y+1.9,{type:Je.SLIDE_SOLID,response:"slide",yMin:Math.max(0,t.midpoint.y-.55),metadata:{pathId:e.id,barrier:!0,pathSegment:t.index}})})}addPathUnderside(e,t){if(t.midpoint.y<1.2)return;const i=e.deckThickness??1.25;if([-1,1].forEach(n=>{const r=this.offsetPathPoint(t.midpoint,t.heading,n*(e.width*.5-1.1)),a=new L(new W(.72,.42,t.length+.6),this.materials.bridgeBeam);a.position.set(r.x,t.midpoint.y-i-.28,r.z),a.rotation.set(-t.slope,t.heading,0),a.castShadow=!0,this.group.add(a)}),t.index%3===0){const n=new L(new W(e.width*.82,.34,.45),this.materials.bridgeBeam);n.position.set(t.midpoint.x,t.midpoint.y-i-.36,t.midpoint.z),n.rotation.y=t.heading,this.group.add(n)}}addPathSupports(e){const t=e.supportSpacing??30;let i=0,n=t*.65;e.segments.forEach(r=>{if(i+=r.length,i<n||r.midpoint.y<2.4)return;n+=t;const a=e.supportStyle==="bridge-pier"||e.type==="bridge",o=e.supportStyle==="single"?[0]:a?[-e.width*.28,0,e.width*.28]:[-e.width*.26,e.width*.26],c=Math.max(1.2,r.midpoint.y-(e.deckThickness??1.25));o.forEach(d=>{const h=this.offsetPathPoint(r.midpoint,r.heading,d),u=new L(a?new mt(.92,1.12,c,16):new W(1.45,c,1.45),this.materials.concrete);u.position.set(h.x,c*.5,h.z),u.castShadow=!0,u.receiveShadow=!0,this.group.add(u),this.registerSolidBox(`${e.id}-path-support-${r.index}-${d.toFixed(1)}`,h.x,h.z,a?2.5:1.9,a?2.5:1.9,r.heading,c,{metadata:{pathId:e.id,support:!0}})});const l=new L(new W(e.width*.68,.6,2.4),this.materials.bridgeBeam);l.position.set(r.midpoint.x,c+.16,r.midpoint.z),l.rotation.y=r.heading,l.castShadow=!0,this.group.add(l)})}addPathGantrySigns(e){e.signs?.forEach(t=>{const i=e.segments[Math.min(e.segments.length-1,Math.max(0,t.index??0))];if(!i)return;const n=new ft;[-1,1].forEach(o=>{const c=new L(new W(.22,5.8,.22),this.materials.dark);c.position.set(o*e.width*.42,2.9,0),n.add(c)});const r=new L(new W(e.width*.9,.22,.22),this.materials.dark);r.position.y=5.65,n.add(r);const a=this.createTextBoard(t.text,"Mini City Expressway",Math.min(10,e.width*.48),1.6);a.position.y=4.9,n.add(a),n.position.set(i.midpoint.x,i.midpoint.y+.15,i.midpoint.z),n.rotation.y=i.heading,this.group.add(n)})}addPathShadow(e,t){const i=new L(new W(e.width*1.2,.018,t.length+1),this.materials.shadowZone);i.position.set(t.midpoint.x,.03,t.midpoint.z),i.rotation.y=t.heading,this.group.add(i)}getPathLaneDividerOffsets(e){const t=e.lanes??2;return t<=1?[]:e.median?this.isHighwayPath(e)&&t>=4?[-e.width*.25,e.width*.25]:[]:t===2?[0]:t===3?[-e.width*.18,e.width*.18]:[-e.width*.24,e.width*.24]}offsetPathPoint(e,t,i){return new C(e.x+Math.cos(t)*i,e.y,e.z-Math.sin(t)*i)}addElevatedRoutes(){this.elevatedRoutes.forEach(e=>{e.kind==="bridge"?this.addBridgeSpan(e):e.kind==="ramp"?this.addRampDeck(e):this.addElevatedDeck(e),this.addHighwayBarriers(e),this.addShoulderLines(e),this.addMergeMarkings(e),this.addDeckUnderside(e),this.addElevatedSupportsForRoute(e),this.addUnderpassDressing(e),e.signs?.forEach(t=>this.addGantrySign(e,t.at??0,t.text))})}addElevatedDeck(e){this.addRouteDeckAssembly(e,this.materials.asphalt)}addRampDeck(e){this.addRouteDeckAssembly(e,this.materials.asphalt)}addBridgeSpan(e){this.addRouteDeckAssembly(e,this.materials.asphalt),this.addBridgePiers(e)}addRouteDeckAssembly(e,t){const i=this.createRouteSurfaceGroup(e);this.registerRoadSurface(e.id,e.center[0],e.center[1],e.size[0],e.size[1],e.rotation,this.getRouteAverageHeight(e),{surfaceType:e.kind,zone:e.zone,elevated:!0,routeId:e.id});const n=e.deckThickness??1.4,r=new L(new W(e.size[0],n,e.size[1]),t);r.position.y=-n*.5,r.castShadow=!0,r.receiveShadow=!0,i.surface.add(r);const a=Math.min(5.2,this.getRouteWidth(e)*.34),o=this.isRouteHorizontal(e),c=this.getRouteLength(e);if(this.getLaneDividerOffsets(e).forEach(d=>{const h=Math.max(4,Math.floor(c/18));for(let u=0;u<h;u+=1){if(u%2)continue;const f=-c*.46+u*(c*.92/h),g=new L(new W(o?7.2:.2,.035,o?.2:7.2),this.materials.lane);g.position.set(o?f:d,.06,o?d:f),i.surface.add(g)}}),[-1,1].forEach(d=>{const h=new L(new W(o?c*.95:.18,.032,o?.18:c*.95),this.materials.lane);h.position.set(o?0:d*a,.065,o?d*a:0),i.surface.add(h)}),e.median){const d=new L(new W(o?c*.95:.48,.22,o?.48:c*.95),this.materials.trim);d.position.y=.16,i.surface.add(d)}this.group.add(i.root)}addDeckUnderside(e){const t=this.createRouteSurfaceGroup(e),i=this.isRouteHorizontal(e),n=this.getRouteLength(e),r=this.getRouteWidth(e),a=e.deckThickness??1.4;[-1,1].forEach(c=>{const l=new L(new W(i?n*.98:.9,.65,i?.9:n*.98),this.materials.bridgeBeam);l.position.set(i?0:c*(r*.5-1.1),-a-.26,i?c*(r*.5-1.1):0),l.castShadow=!0,t.surface.add(l)});const o=Math.max(3,Math.floor(n/34));for(let c=0;c<o;c+=1){const l=-n*.44+c*(n*.88/Math.max(1,o-1)),d=new L(new W(i?.55:r*.92,.38,i?r*.92:.55),this.materials.bridgeBeam);d.position.set(i?l:0,-a-.35,i?0:l),t.surface.add(d)}this.group.add(t.root)}addHighwayBarriers(e){if(!e.barriers)return;const t=this.createRouteSurfaceGroup(e),i=this.isRouteHorizontal(e),n=this.getRouteLength(e),r=this.getRouteWidth(e);[-1,1].forEach(a=>{const o=new L(new W(i?n*.98:.58,1.1,i?.58:n*.98),this.materials.barrier);o.position.set(i?0:a*r*.5,.54,i?a*r*.5:0),o.castShadow=!0,t.surface.add(o);const c=new L(new W(i?n*.96:.18,.18,i?.18:n*.96),this.materials.dark);c.position.set(i?0:a*(r*.5-.15),1.2,i?a*(r*.5-.15):0),t.surface.add(c);const l=this.getRouteWorldPoint(e,0,a*r*.5);if(this.registerSolidBox(`${e.id}-barrier-${a}`,l.x,l.z,i?n*.98:.82,i?.82:n*.98,e.rotation,this.getRouteAverageHeight(e)+2,{yMin:Math.max(0,this.getRouteAverageHeight(e)-.6),metadata:{routeId:e.id,barrier:!0}}),e.kind==="ramp")for(let h=0;h<4;h+=1){const u=(h+.5)/4,f=-n*.46+u*n*.92,g=this.getRouteHeightAtT(e,u),y=this.getRouteWorldPoint(e,f,a*r*.5);this.registerSolidBox(`${e.id}-ramp-barrier-${a}-${h}`,y.x,y.z,i?n*.23:.82,i?.82:n*.23,e.rotation,g+1.9,{yMin:Math.max(0,g-.55),metadata:{routeId:e.id,barrier:!0,rampSegment:h}})}}),this.group.add(t.root)}addShoulderLines(e){if(!e.shoulders)return;const t=this.createRouteSurfaceGroup(e),i=this.isRouteHorizontal(e),n=this.getRouteLength(e),r=this.getRouteWidth(e);[-1,1].forEach(a=>{const o=new L(new W(i?n*.92:.14,.035,i?.14:n*.92),this.materials.crosswalk);o.position.set(i?0:a*(r*.5-3.2),.08,i?a*(r*.5-3.2):0),t.surface.add(o)}),this.group.add(t.root)}addMergeMarkings(e){if(e.kind!=="ramp")return;const t=this.createRouteSurfaceGroup(e),i=this.isRouteHorizontal(e),n=this.getRouteLength(e);for(let r=0;r<4;r+=1){const a=-n*.25+r*8,o=new L(new W(i?4.6:.16,.04,i?.16:4.6),this.materials.crosswalk);o.position.set(i?a:2.4+r*.45,.1,i?2.4+r*.45:a),o.rotation.y=i?.34:-.34,t.surface.add(o)}this.group.add(t.root)}addElevatedSupportsForRoute(e){const t=this.getRouteLength(e),i=e.supportSpacing??32,n=Math.max(2,Math.floor(t/i));for(let r=0;r<n;r+=1){const a=n===1?.5:r/(n-1),o=-t*.44+a*t*.88,c=this.getRouteHeightAtT(e,o/t+.5);c<2.4||this.addSupportBent(e,o,c)}}addSupportBent(e,t,i){const n=this.getRouteWidth(e),r=Math.max(1.2,i-(e.deckThickness??1.4)),a=e.supportStyle==="bridge-pier";(e.supportStyle==="single"?[0]:a?[-n*.32,0,n*.32]:[-n*.28,n*.28]).forEach(d=>{const h=this.getRouteWorldPoint(e,t,d),u=new L(a?new mt(.88,1.08,r,16):new W(1.5,r,1.5),this.materials.concrete);u.position.set(h.x,r*.5,h.z),u.castShadow=!0,u.receiveShadow=!0,this.group.add(u),this.registerSolidBox(`${e.id}-support-${Math.round(t)}-${d.toFixed(1)}`,h.x,h.z,a?2.4:1.9,a?2.4:1.9,e.rotation,r,{metadata:{routeId:e.id,support:!0}});const f=new L(new W(a?4.2:3,.34,a?3.2:2.6),this.materials.concrete);f.position.set(h.x,.17,h.z),f.rotation.y=e.rotation,this.group.add(f)});const c=this.getRouteWorldPoint(e,t,0),l=new L(new W(a?n*.82:n*.68,.65,a?3.6:2.4),this.materials.bridgeBeam);l.position.set(c.x,r+.18,c.z),l.rotation.y=e.rotation,l.castShadow=!0,this.group.add(l)}addBridgePiers(e){const t=this.getRouteLength(e);[-.34,0,.34].forEach(i=>{const n=i*t,r=this.getRouteWorldPoint(e,n,0),a=new L(new W(8.2,3,5.4),this.materials.concrete);a.position.set(r.x,1.5,r.z),a.rotation.y=e.rotation,a.castShadow=!0,this.group.add(a),this.registerSolidBox(`${e.id}-pier-${i}`,r.x,r.z,8.8,5.8,e.rotation,3.4,{metadata:{routeId:e.id,bridgePier:!0}})})}addGantrySign(e,t,i){const n=this.getRouteLength(e),r=Math.max(-.45,Math.min(.45,t))*n,a=this.getRouteWorldPoint(e,r,0),o=this.getRouteHeightAtT(e,r/n+.5),c=new ft,l=this.getRouteWidth(e);[-1,1].forEach(u=>{const f=new L(new W(.22,5.8,.22),this.materials.dark);f.position.set(u*l*.42,2.9,0),c.add(f)});const d=new L(new W(l*.92,.22,.22),this.materials.dark);d.position.y=5.65,c.add(d);const h=this.createTextBoard(i,"Mini City Expressway",Math.min(10,l*.45),1.6);h.position.y=4.9,c.add(h),c.position.set(a.x,o+.15,a.z),c.rotation.y=e.rotation,this.group.add(c)}addUnderpassDressing(e){if(!["bridge","deck","flyover"].includes(e.kind))return;const t=this.getRouteLength(e),i=this.getRouteWidth(e),n=new L(new W(this.isRouteHorizontal(e)?t*.92:i*1.25,.018,this.isRouteHorizontal(e)?i*1.25:t*.92),this.materials.shadowZone);n.position.set(e.center[0],.03,e.center[1]),n.rotation.y=e.rotation,this.group.add(n),e.kind==="bridge"&&[-130,0,130].forEach(r=>{const a=this.getRouteWorldPoint(e,r,-i*.72);this.addBillboard(a.x,a.z,"UNDERPASS","Bridge clearance")})}createRouteSurfaceGroup(e){const t=new ft;t.position.set(e.center[0],this.getRouteAverageHeight(e),e.center[1]),t.rotation.y=e.rotation??0;const i=new ft,n=(e.endElevation??e.deckElevation??0)-(e.startElevation??e.deckElevation??0),r=Math.atan2(n,this.getRouteLength(e));return Math.abs(n)>.01&&(this.isRouteHorizontal(e)?i.rotation.z=r:i.rotation.x=-r),t.add(i),{root:t,surface:i}}isRouteHorizontal(e){return e.size[0]>=e.size[1]}getRouteLength(e){return Math.max(e.size[0],e.size[1])}getRouteWidth(e){return Math.min(e.size[0],e.size[1])}getRouteAverageHeight(e){const t=e.startElevation??e.deckElevation??0,i=e.endElevation??e.deckElevation??t;return(t+i)*.5}getRouteHeightAtT(e,t){const i=e.startElevation??e.deckElevation??0,n=e.endElevation??e.deckElevation??i,r=t*t*(3-2*t);return i+(n-i)*r}getRouteLocal(e,t,i=0){const n=e.rotation??0,r=Math.cos(-n),a=Math.sin(-n),o=t.x-e.center[0],c=t.z-e.center[1],l=o*r-c*a,d=o*a+c*r,h=this.isRouteHorizontal(e),u=this.getRouteLength(e),f=this.getRouteWidth(e),g=h?l:d,y=h?d:l,m=Math.max(0,Math.min(1,g/u+.5));return{x:l,z:d,major:g,minor:y,t:m,inside:Math.abs(g)<=u*.5+i&&Math.abs(y)<=f*.5+i}}getRouteWorldPoint(e,t,i=0){const n=this.isRouteHorizontal(e),r=n?t:i,a=n?i:t,o=Math.cos(e.rotation??0),c=Math.sin(e.rotation??0);return new C(e.center[0]+r*o-a*c,0,e.center[1]+r*c+a*o)}getLaneDividerOffsets(e){const t=e.lanes??2;return t<=1?[0]:t===2?[0]:t===3?[-3.2,3.2]:[-5.3,5.3]}addRoadDesign(e){e.roadClass==="runway"||e.soft||(this.addLaneLines(e),e.median&&(this.isHighwaySegment(e)?this.addMedian(e):this.addPaintedCenterLine(e)))}isHighwaySegment(e){return e.zone==="highway"||e.roadClass==="highway"||e.roadClass==="bridge"}isHighwayPath(e){return e.zone==="highway"||e.type==="elevated"||e.type==="bridge"}addSidewalk(e){if(e.roadClass==="highway"||e.roadClass==="runway")return;const t=e.roadClass==="market"?1.8:2.8,i=new L(new W(e.size[0]+t,.045,e.size[1]+t),this.materials.sidewalk);i.position.set(e.center[0],.012+(e.elevation??0),e.center[1]),i.rotation.y=e.rotation,i.receiveShadow=!0,this.group.add(i)}addLaneLines(e){const t=Math.max(e.size[0],e.size[1]),i=e.size[0]>=e.size[1],n=Math.floor(t/12),r=this.getRoadLaneMarkOffsets(e);if(r.length!==0)for(let a=-n;a<=n;a+=1)a%2===0&&r.forEach(o=>{const c=new L(new W(i?5.4:.22,.018,i?.22:5.4),this.materials.lane),l=a*6,d=i?Math.cos(e.rotation):-Math.sin(e.rotation),h=i?Math.sin(e.rotation):Math.cos(e.rotation),u=i?-Math.sin(e.rotation):Math.cos(e.rotation),f=i?Math.cos(e.rotation):Math.sin(e.rotation);c.position.set(e.center[0]+d*l+u*o,.097+(e.elevation??0),e.center[1]+h*l+f*o),c.rotation.y=e.rotation,this.group.add(c)})}addPaintedCenterLine(e){const t=Math.max(e.size[0],e.size[1]),i=e.size[0]>=e.size[1],n=Math.floor(t/14);for(let r=-n;r<=n;r+=1){if(r%2!==0)continue;const a=new L(new W(i?6.2:.16,.022,i?.16:6.2),this.materials.trim),o=r*7,c=i?Math.cos(e.rotation):-Math.sin(e.rotation),l=i?Math.sin(e.rotation):Math.cos(e.rotation);a.position.set(e.center[0]+c*o,.102+(e.elevation??0),e.center[1]+l*o),a.rotation.y=e.rotation,this.group.add(a)}}getRoadLaneMarkOffsets(e){const t=e.lanes??2;if(t<=1)return[];const i=Math.min(e.size[0],e.size[1]);return e.median?this.isHighwaySegment(e)&&t>=4?[-i*.25,i*.25]:[]:t===2?[0]:t===3?[-i*.18,i*.18]:[-i*.24,i*.24]}addMedian(e){const t=e.size[0]>=e.size[1],i=Math.max(e.size[0],e.size[1])*.96,n=new L(new W(t?i:.46,.2,t?.46:i),this.materials.trim);n.position.set(e.center[0],.15+(e.elevation??0),e.center[1]),n.rotation.y=e.rotation,this.group.add(n),this.registerSolidBox(`${e.id}-center-divider`,e.center[0],e.center[1],t?i:.5,t?.5:i,e.rotation,(e.elevation??0)+.5,{type:Je.SLIDE_SOLID,response:"slide",yMin:Math.max(0,(e.elevation??0)-.05),metadata:{segmentId:e.id,centerDivider:!0}})}addRoadBarriers(e){const t=e.size[0]>=e.size[1],i=t?e.size[1]:e.size[0];[-1,1].forEach(n=>{const r=new L(new W(t?e.size[0]*.98:.28,.42,t?.28:e.size[1]*.98),this.materials.white),a=n*i*.54,o=t?-Math.sin(e.rotation):Math.cos(e.rotation),c=t?Math.cos(e.rotation):Math.sin(e.rotation);r.position.set(e.center[0]+o*a,.38+(e.elevation??0),e.center[1]+c*a),r.rotation.y=e.rotation,this.group.add(r),this.registerSolidBox(`${e.id}-barrier-${n}`,e.center[0]+o*a,e.center[1]+c*a,t?e.size[0]*.98:.42,t?.42:e.size[1]*.98,e.rotation,(e.elevation??0)+1.35,{type:Je.SLIDE_SOLID,response:"slide",yMin:e.elevation??0,metadata:{segmentId:e.id,barrier:!0}})})}addElevatedSupports(e){const t=e.size[0]>=e.size[1],i=t?e.size[0]:e.size[1],n=Math.max(2,Math.floor(i/44));for(let r=0;r<n;r+=1){const a=n===1?0:(r/(n-1)-.5)*i*.82,o=new L(new W(2.2,e.elevation+.8,2.2),this.materials.sidewalk);o.position.set(e.center[0]+(t?Math.cos(e.rotation)*a:0),(e.elevation+.8)*.5,e.center[1]+(t?Math.sin(e.rotation)*a:a)),o.castShadow=!0,this.group.add(o),this.registerSolidBox(`${e.id}-support-${r}`,o.position.x,o.position.z,2.6,2.6,e.rotation,e.elevation+.8)}}addCrosswalk(e,t){for(let i=-3;i<=3;i+=1){const n=new L(new W(.55,.025,7),this.materials.crosswalk);n.position.set(e+i*1.2,.092,t+7.2),this.group.add(n)}}addSpeedBreaker(e,t,i=0){const n=new L(new W(8.2,.16,.72),this.materials.trim);n.position.set(e,.16,t),n.rotation.y=i,n.castShadow=!0,this.group.add(n),this.registerSolidBox(`speed-breaker-${e}-${t}`,e,t,8.2,.72,i,.22,{type:Je.LOW_SURPASSABLE,response:"bump",metadata:{bump:.13,slowdown:.94}})}addTrafficLight(e,t){const i=new L(new mt(.08,.08,3.2,10),this.materials.dark);i.position.set(e,1.6,t),i.castShadow=!0;const n=new L(new W(.42,1.08,.28),this.materials.dark);n.position.set(e,3.05,t);const r=new L(new Rt(.11,12,8),this.materials.redLight);r.position.set(e,3.28,t+.16);const a=new L(new Rt(.11,12,8),this.materials.greenLight);a.position.set(e,2.85,t+.16),this.group.add(i,n,r,a)}addDowntown(){[[-24,-24,11,24],[24,-24,13,34],[-24,24,12,28],[24,24,16,40],[-78,-42,11,22],[78,42,12,28],[-78,42,11,26],[78,-42,12,30],[-118,-18,10,18],[118,18,12,24],[-118,54,10,20],[118,-54,11,22],[-36,92,12,24],[72,92,14,30],[-88,-92,12,22],[88,-92,13,26]].forEach(([t,i,n,r],a)=>{this.addBuilding(t,i,n,r,a%2?this.materials.buildingA:this.materials.buildingB)}),this.addRooftopDetail(24,-24,14,34),this.addRooftopDetail(24,24,14,34),this.addBillboard(8,51,"MINI CITY","Free Drive Zone"),this.addBillboard(48,-51,"GAMEHUB","Powered by MH Horizon"),this.addCityHall(24,72),this.addPlaza(-24,88),[-112,-62,0,62,112].forEach(t=>this.addBusStop(t,-76)),[-80,-40,40,80].forEach(t=>this.addParkingBay(t,72,0))}addBuilding(e,t,i,n,r){if(this.overlapsRoadClearance(e,t,i,i,0,3.2))return!1;const a=new L(new W(i,n,i),r);a.position.set(e,n*.5,t),a.castShadow=!0,a.receiveShadow=!0,this.group.add(a),this.registerSolidBox(`building-${e}-${t}`,e,t,i*.94,i*.94,0,n+.25),this.addRooftopDetail(e,t,i,n);const o=Math.floor(n/3.2);for(let c=1;c<o;c+=1)[-1,1].forEach(l=>{const d=new L(new W(i*.72,.75,.045),this.materials.glass);d.position.set(e,c*3+1.1,t+l*(i*.51)),this.group.add(d)});return!0}addPark(){this.addParkGate(-122,34),this.addFountain(-190,66),this.addStatue(-168,86);for(let e=0;e<54;e+=1){const t=e/26*Math.PI*2,i=34+e%6*7;this.addTree(-190+Math.cos(t)*i,66+Math.sin(t)*i)}for(let e=0;e<12;e+=1)this.addBench(-245+e*14,28+e%3*28,e%2?Math.PI*.5:0);[[-220,38],[-184,34],[-226,100],[-154,94],[-188,124],[-130,64]].forEach(([e,t])=>this.addFlowerBed(e,t)),this.addWalkingPath(-190,66,62,42),this.addFence(-270,0,130,!0),this.addFence(-104,126,140,!1)}addFountain(e,t){const i=new L(new mt(4.8,5.3,.55,32),this.materials.trim);i.position.set(e,.28,t);const n=new L(new mt(4.2,4.2,.18,32),this.materials.water);n.position.set(e,.66,t);const r=new L(new mt(.22,.42,2.8,18),this.materials.water);r.position.set(e,1.8,t),this.group.add(i,n,r),this.registerSolidBox(`fountain-${e}-${t}`,e,t,8.9,8.9,0,2.6)}addStatue(e,t){const i=new L(new W(2.2,.8,2.2),this.materials.trim);i.position.set(e,.4,t);const n=new L(new mt(.36,.5,3.2,14),this.materials.white);n.position.set(e,2.3,t),this.group.add(i,n),this.registerSolidBox(`statue-${e}-${t}`,e,t,2.8,2.8,0,4)}addTree(e,t){const i=new L(new mt(.22,.3,1.6,8),this.materials.trim);i.position.set(e,.8,t);const n=new L(new Rt(1.25,12,8),this.materials.park);n.position.set(e,2,t),i.castShadow=!0,n.castShadow=!0,this.group.add(i,n)}addBench(e,t,i=0){const n=new L(new W(2.4,.22,.65),this.materials.trim);n.position.set(e,.58,t),n.rotation.y=i;const r=new L(new W(2.4,.65,.16),this.materials.trim);r.position.set(e,1,t-.32),r.rotation.y=i,this.group.add(n,r),this.registerSolidBox(`bench-${e}-${t}`,e,t,2.6,.9,i,1.2,{type:Je.SOFT_PASSABLE,response:"soft"})}addFence(e,t,i,n){const r=Math.floor(i/4);for(let a=0;a<r;a+=1){const o=new L(new W(.16,1.1,.16),this.materials.white);o.position.set(e+(n?0:a*4),.55,t+(n?a*4:0)),this.group.add(o)}}addHighway(){this.addBillboard(46,-392,"HIGHWAY RING","Long fast routes"),this.addBillboard(-382,-388,"AIRPORT","Terminal route"),this.addBillboard(0,-216,"ELEVATED RIVER BRIDGE","Tall deck - clear underpass")}addResidential(){[[126,36],[162,28],[214,30],[248,66],[132,92],[178,112],[226,118],[126,142],[214,148],[258,104]].forEach(([t,i],n)=>{if(this.overlapsRoadClearance(t,i,10,8,0,2.4))return;const r=new L(new W(10,5.4,8),this.materials.buildingC);r.position.set(t,2.7,i);const a=new L(new hs(7.4,2.4,4),this.materials.trim);a.position.set(t,6.6,i),a.rotation.y=Math.PI*.25,this.group.add(r,a),this.registerSolidBox(`house-${t}-${i}`,t,i,9.6,7.6,0,7),this.addTree(t+(n%2?8:-8),i+8),this.addDriveway(t,i-7),this.addGarden(t+(n%2?-6:6),i+2)}),this.addBusStop(126,48),this.addBusStop(232,104),this.addLocalSquare(184,74),this.addBillboard(184,152,"RESIDENTIAL","Calm roads")}addMarket(){for(let e=0;e<13;e+=1){const t=-142+e*15;if(this.overlapsRoadClearance(t,194,9,8,0,2))continue;const i=new L(new W(9,5.8,8),e%2?this.materials.buildingC:this.materials.white);i.position.set(t,2.9,194);const n=new L(new W(9.4,.32,2.2),e%2?this.materials.trim:this.materials.redLight);n.position.set(t,4.1,188.6),this.group.add(i,n),this.registerSolidBox(`market-shop-${t}`,t,194,8.7,7.6,0,6),this.addSign(t,187.2,e%2?"CAFE":"SHOP"),e%2===0&&this.addMarketStall(t+4,184.2)}this.addMarketGate(-134,182),this.addBillboard(-66,154,"MARKET GATE","Dense city route"),[-138,-102,-66,-30,6,42].forEach(e=>this.addStreetLamp(e,166))}addHill(){const e=new L(new W(190,1.2,128),new je({color:"#bfd1a9",roughness:.88}));e.position.set(170,.32,214),e.receiveShadow=!0,this.group.add(e),this.addBillboard(170,238,"VIEWPOINT","Switchback road"),this.addViewpoint(170,258),[[108,144,.52],[150,194,-.6],[202,230,.58],[170,258,.02]].forEach(([t,i,n])=>{this.addGuardrail(t,i,n),this.addStreetLamp(t-6,i+6)});for(let t=0;t<18;t+=1)this.addTree(96+t%6*28,164+Math.floor(t/6)*38)}addRiverCorridor(){const e=new L(new W(560,.035,38),this.materials.river);e.position.set(0,.02,-154),this.group.add(e),[-180,-60,80,210].forEach(t=>this.addBillboard(t,-174,"RIVER","Bridge corridor"))}addAirport(){this.addAirportArea(),this.addAirportTerminal(-424,-350),this.addAirplane(-360,-286),this.addFence(-456,-442,176,!1),this.addFence(-456,-224,190,!1),this.addBillboard(-422,-370,"HORIZON AIRPORT","Terminal - runway - cargo"),[-452,-426,-400,-322,-296].forEach(e=>this.addParkingBay(e,-310,Math.PI*.5))}addIndustrial(){[[292,-334,24,12],[318,-310,30,14],[398,-332,24,12],[300,-258,28,12],[392,-256,34,13]].forEach(([t,i,n,r],a)=>{if(this.overlapsRoadClearance(t,i,n,18,0,2.5))return;const o=new L(new W(n,r,18),a%2?this.materials.buildingB:this.materials.buildingC);o.position.set(t,r*.5,i),o.castShadow=!0,this.group.add(o),this.registerSolidBox(`warehouse-${t}-${i}`,t,i,n*.96,17.4,0,r+.4);const c=new L(new W(n*.7,3.2,.18),this.materials.dark);c.position.set(t,2.2,i+9.2),this.group.add(c)});for(let t=0;t<4;t+=1)for(let i=0;i<6;i+=1)this.addContainer(286+i*12,-452+t*8,(t+i)%2?this.materials.containerA:this.materials.containerB);this.addBillboard(360,-260,"INDUSTRIAL DEPOT","Cargo routes"),[292,324,356,388,420,452].forEach(t=>this.addStreetLamp(t,-384))}addAirportTerminal(e,t){const i=t-22;if(this.overlapsRoadClearance(e,i,82,18,0,2.5))return;const n=new L(new W(82,10,18),this.materials.white);n.position.set(e,5,i),n.castShadow=!0;const r=new L(new W(76,5.2,.2),this.materials.glass);r.position.set(e,5.4,t-12.8);const a=new L(new W(88,1.2,22),this.materials.trim);a.position.set(e,10.8,i),this.group.add(n,r,a),this.registerSolidBox(`airport-terminal-${e}-${t}`,e,i,80,17.2,0,11.2),[e-32,e,e+32].forEach(o=>this.addBusStop(o,t-8))}addAirplane(e,t){const i=new ft,n=new je({color:"#f8fbff",roughness:.34,metalness:.14}),r=new je({color:"#caa76a",roughness:.24,metalness:.42}),a=this.materials.dark,o=this.materials.glass,c=new L(new mt(4.4,4.7,56,24),n);c.rotation.z=Math.PI*.5,c.position.y=8;const l=new L(new Rt(4.45,24,12),n);l.scale.x=1.25,l.position.set(30,8,0);const d=new L(new hs(4.5,10,24),n);d.rotation.z=-Math.PI*.5,d.position.set(-33,8,0),i.add(c,l,d);const h=new L(new W(5.6,1.4,3.8),o);h.position.set(30.5,10.4,0),h.rotation.z=-.18,i.add(h);const u=new W(34,.55,9);[-1,1].forEach(m=>{const p=new L(u,n);p.position.set(2,7.3,m*10.5),p.rotation.y=m*.18,i.add(p);const M=new L(new mt(1.45,1.45,4.2,16),a);M.rotation.x=Math.PI*.5,M.position.set(5,5.9,m*14.4),i.add(M)});const f=new L(new W(1.1,10.5,7),n);f.position.set(-27,13.4,0),f.rotation.z=-.16;const g=new L(new W(13,.45,5.4),n);g.position.set(-27,10,0),i.add(f,g);const y=new L(new W(48,.22,.32),r);y.position.set(0,8.25,4.72),i.add(y);for(let m=-9;m<=9;m+=1){const p=new L(new Rt(.32,8,6),o);p.position.set(m*2.35,9.2,4.46),i.add(p)}[-18,14,24].forEach(m=>{const p=new L(new mt(.22,.22,3.2,8),a);p.position.set(m,4,0);const M=new L(new Yt(.75,.18,8,16),a);M.position.set(m,2.5,0),M.rotation.y=Math.PI*.5,i.add(p,M)}),i.position.set(e,0,t),i.rotation.y=Math.PI*.02,i.scale.setScalar(1.25),this.group.add(i),this.registerSolidBox(`airplane-fuselage-${e}-${t}`,e,t,78,8.8,i.rotation.y,14),this.registerSolidBox(`airplane-left-wing-${e}-${t}`,e+2,t+14.2,38,9.4,i.rotation.y+.18,9),this.registerSolidBox(`airplane-right-wing-${e}-${t}`,e+2,t-14.2,38,9.4,i.rotation.y-.18,9),this.registerSolidBox(`airplane-tail-${e}-${t}`,e-34,t,13.5,9.8,i.rotation.y,18),this.registerSolidBox(`airplane-left-engine-${e}-${t}`,e+5,t+18,5.2,3.4,i.rotation.y,7.5),this.registerSolidBox(`airplane-right-engine-${e}-${t}`,e+5,t-18,5.2,3.4,i.rotation.y,7.5)}addPlaza(e,t){const i=new L(new W(28,.04,20),this.materials.sidewalk);i.position.set(e,.08,t),this.group.add(i),this.addFountain(e,t)}addParkingBay(e,t,i=0){const n=new L(new W(11,.02,6),this.materials.sidewalk);n.position.set(e,.09,t),n.rotation.y=i,this.group.add(n);for(let r=-1;r<=1;r+=1){const a=new L(new W(.08,.02,5.4),this.materials.lane);a.position.set(e+r*3.4,.11,t),a.rotation.y=i,this.group.add(a)}}addParkGate(e,t){[-1,1].forEach(n=>{const r=new L(new W(1.1,4.4,1.1),this.materials.trim);r.position.set(e+n*6,2.2,t-6),this.group.add(r),this.registerSolidBox(`park-gate-${n}-${e}-${t}`,e+n*6,t-6,1.4,1.4,0,4.8)});const i=this.createTextBoard("PARK LOOP","Scenic drive",7.8,1.7);i.position.set(e,5.1,t-6),this.group.add(i)}addWalkingPath(e,t,i,n){const r=new L(new Yt(1,.02,8,80),this.materials.sidewalk);r.scale.set(i,1,n),r.rotation.x=Math.PI*.5,r.position.set(e,.1,t),this.group.add(r)}addMarketGate(e,t){[-1,1].forEach(n=>{const r=new L(new W(1.2,5,1.2),this.materials.trim);r.position.set(e+n*7,2.5,t),this.group.add(r),this.registerSolidBox(`market-gate-${n}-${e}-${t}`,e+n*7,t,1.5,1.5,0,5.4)});const i=this.createTextBoard("MARKET GATE","Shop street",8,1.7);i.position.set(e,5.5,t),this.group.add(i)}addLocalSquare(e,t){const i=new L(new W(26,.04,22),this.materials.sidewalk);i.position.set(e,.08,t+20),this.group.add(i),this.addStatue(e,t+20)}addContainer(e,t,i){if(this.overlapsRoadClearance(e,t,10.6,4.8,0,2))return!1;const n=new L(new W(10,3.2,4.2),i);return n.position.set(e,1.6,t),n.castShadow=!0,this.group.add(n),this.registerSolidBox(`container-${e}-${t}`,e,t,10.6,4.8,0,3.6),!0}addCityHall(e,t){const i=new L(new W(16,7,10),this.materials.white);i.position.set(e,3.5,t);const n=new L(new W(18,1.1,11.4),this.materials.trim);n.position.set(e,7.6,t);const r=new ft;for(let a=-2;a<=2;a+=1){const o=new L(new mt(.28,.32,4.4,12),this.materials.trim);o.position.set(e+a*2.2,2.5,t-5.25),r.add(o)}this.group.add(i,n,r),this.registerSolidBox(`city-hall-${e}-${t}`,e,t,18.5,12.2,0,8.4)}addViewpoint(e,t){const i=new L(new mt(7.8,8.5,.55,28),this.materials.sidewalk);i.position.set(e,.76,t),i.receiveShadow=!0;const n=new L(new mt(.35,.5,5.2,16),this.materials.trim);n.position.set(e+1.8,3.2,t-1.5);const r=new L(new Rt(.9,16,10),this.materials.glass);r.position.set(e+1.8,6.1,t-1.5),this.group.add(i,n,r),this.registerSolidBox(`viewpoint-deck-${e}-${t}`,e,t,16.5,16.5,0,1.4),this.registerSolidBox(`viewpoint-marker-${e}-${t}`,e+1.8,t-1.5,1.2,1.2,0,6.4);for(let a=0;a<12;a+=1){const o=a/12*Math.PI*2,c=new L(new W(.14,.72,.14),this.materials.white);c.position.set(e+Math.cos(o)*7.5,1.22,t+Math.sin(o)*7.5),this.group.add(c)}}addRooftopDetail(e,t,i,n){const r=new L(new W(i*.64,.35,i*.48),this.materials.trim);r.position.set(e,n+.22,t);const a=new L(new mt(.045,.06,2.2,8),this.materials.dark);a.position.set(e+i*.24,n+1.45,t-i*.16),this.group.add(r,a)}addFlowerBed(e,t){const i=new L(new W(4.4,.18,1.4),this.materials.trim);i.position.set(e,.16,t),this.group.add(i);for(let n=-2;n<=2;n+=1){const r=new L(new Rt(.18,8,6),new je({color:n%2?"#f2c66b":"#ffffff",roughness:.5}));r.position.set(e+n*.72,.42,t),this.group.add(r)}}addBridgeSupports(e,t){[-18,0,18].forEach(i=>{const n=new L(new W(2.2,2.4,1.2),this.materials.sidewalk);n.position.set(e+i,.95,t),n.castShadow=!0,this.group.add(n)})}addOverheadSign(e,t,i){const n=new ft;[-1,1].forEach(o=>{const c=new L(new W(.16,4.8,.16),this.materials.dark);c.position.set(o*17.2,2.4,0),n.add(c)});const r=new L(new W(35.2,.18,.18),this.materials.dark);r.position.y=4.7,n.add(r);const a=this.createTextBoard(i,"Mini City Drive",5.4,1.5);a.position.y=4.1,n.add(a),n.position.set(e,0,t-8.8),this.group.add(n)}addAirportArea(){const e=new L(new W(164,.035,12),this.materials.runway);e.position.set(-360,.07,-252),e.receiveShadow=!0,this.group.add(e);for(let t=-7;t<=7;t+=1)if(t%2===0){const i=new L(new W(5,.025,.5),this.materials.lane);i.position.set(-360+t*9,.11,-252),this.group.add(i)}[-450,-420,-390].forEach(t=>{if(this.overlapsRoadClearance(t,-454,24,18,0,2.2))return;const i=new L(new W(24,8.2,18),this.materials.buildingB);i.position.set(t,4.1,-454);const n=new L(new mt(9,9,24,16,1,!1,0,Math.PI),this.materials.trim);n.rotation.z=Math.PI*.5,n.position.set(t,8.2,-454),this.group.add(i,n),this.registerSolidBox(`hangar-${t}`,t,-454,23.6,17.4,0,9.2)}),this.addOverheadSign(-360,-404,"AIRPORT")}addDriveway(e,t){const i=new L(new W(5,.035,6),this.materials.sidewalk);i.position.set(e,.06,t),this.group.add(i)}addGarden(e,t){const i=new je({color:"#5f9f58",roughness:.86});for(let n=0;n<3;n+=1){const r=new L(new Rt(.62,10,8),i);r.position.set(e+n*1.1,.62,t+n%2*.7),this.group.add(r)}}addMarketStall(e,t){if(this.overlapsRoadClearance(e,t,3.6,1.8,0,1.6))return;const i=new L(new W(3.2,1,1.4),this.materials.white);i.position.set(e,.5,t);const n=new L(new W(3.6,.2,1.8),this.materials.trim);n.position.set(e,1.55,t),this.group.add(i,n),this.registerSolidBox(`market-stall-${e}-${t}`,e,t,3.4,1.6,0,1.7,{type:Je.SOFT_PASSABLE,response:"soft"})}addGuardrail(e,t,i){const n=new ft,r=new L(new W(18,.18,.18),this.materials.white);r.position.y=.9,n.add(r);for(let a=-4;a<=4;a+=1){const o=new L(new W(.16,.9,.16),this.materials.white);o.position.set(a*2,.45,0),n.add(o)}n.position.set(e,.1,t),n.rotation.y=i,this.group.add(n),this.registerSolidBox(`guardrail-${e}-${t}`,e,t,18.2,.42,i,1.4,{type:Je.SLIDE_SOLID,response:"slide"})}addBusStop(e,t){const i=new L(new W(5.6,.28,2.2),this.materials.glass);i.position.set(e,2.8,t);const n=new L(new W(3.4,.32,.7),this.materials.trim);n.position.set(e,.75,t),[-1,1].forEach(r=>{const a=new L(new W(.12,2.5,.12),this.materials.dark);a.position.set(e+r*2.45,1.45,t-.8),this.group.add(a)}),this.group.add(i,n)}addStreetLamp(e,t){const i=new L(new mt(.08,.08,4.6,10),this.materials.dark);i.position.set(e,2.3,t);const n=new L(new Rt(.32,12,8),new je({color:"#fff6c2",emissive:"#fff2a8",emissiveIntensity:.32}));n.position.set(e,4.68,t+.2),this.group.add(i,n)}addBillboard(e,t,i,n){const r=new L(new W(.18,3.6,.18),this.materials.dark),a=r.clone();r.position.set(e-2.4,1.8,t),a.position.set(e+2.4,1.8,t);const o=this.createTextBoard(i,n,6.8,2.4);o.position.set(e,3.6,t),this.group.add(r,a,o),this.registerSolidBox(`billboard-post-a-${e}-${t}`,e-2.4,t,.5,.5,0,3.8),this.registerSolidBox(`billboard-post-b-${e}-${t}`,e+2.4,t,.5,.5,0,3.8)}addSign(e,t,i){const n=this.createTextBoard(i,"",3.8,1.1);n.position.set(e,4.6,t),this.group.add(n)}createTextBoard(e,t,i,n){const r=`${e}:${t}`;if(!this.textures.has(r)){const o=document.createElement("canvas");o.width=512,o.height=192;const c=o.getContext("2d");c.fillStyle="#fff8ea",c.fillRect(0,0,o.width,o.height),c.strokeStyle="#caa76a",c.lineWidth=10,c.strokeRect(5,5,o.width-10,o.height-10),c.fillStyle="#202938",c.font="700 54px Segoe UI, sans-serif",c.textAlign="center",c.fillText(e,o.width/2,82),t&&(c.fillStyle="#7b6a45",c.font="600 28px Segoe UI, sans-serif",c.fillText(t,o.width/2,128)),this.textures.set(r,new wl(o))}const a=new Et({map:this.textures.get(r)});return new L(new Gi(i,n),a)}addLandmarks(){this.landmarks.forEach(e=>{const t=new L(new Yt(e.radius*.52,.09,8,44),new Et({color:"#f1c764",transparent:!0,opacity:.55}));t.rotation.x=Math.PI*.5,t.position.set(e.position[0],.13,e.position[1]),this.group.add(t)})}addCollectibles(){Pg.forEach((e,t)=>{const i=this.effectsManager.createCoinMesh(),n=e.position,r=this.getSurfaceInfo(new C(n[0],0,n[1]),null,{preferElevated:!0}).surfaceHeight??0;i.userData.baseY=r+1.15,i.position.set(n[0],i.userData.baseY,n[1]),i.userData.id=e.id??`coin-${t}`,i.userData.value=e.value??8,i.userData.xp=e.xp??1,i.userData.type=e.type??"cityCoin",i.userData.oneTime=!!e.oneTime,i.userData.type!=="cityCoin"&&(i.scale.setScalar(1.28),i.material=i.material.clone(),i.material.color.set(i.userData.type==="hiddenWheel"?"#ffffff":"#f3c65f")),this.collectibles.push(i),this.group.add(i)})}addParkedCars(){[[-31,-50,Math.PI*.5,0],[31,50,-Math.PI*.5,1],[-62,75,0,5],[-2,94,Math.PI,2],[72,22,Math.PI*.5,4],[120,45,-Math.PI*.5,3],[-118,-77,Math.PI*.5,1],[118,-99,-Math.PI*.5,0],[-414,-324,Math.PI*.5,2],[-362,-324,Math.PI*.5,4],[-390,-404,0,5],[320,-370,-Math.PI*.5,2],[390,-370,-Math.PI*.5,4],[424,-290,Math.PI,1],[178,126,Math.PI*.5,0],[218,118,-Math.PI*.5,3],[258,82,Math.PI,2],[-130,182,Math.PI*.5,5],[-72,214,-Math.PI*.5,0],[-28,206,Math.PI,1],[-174,38,0,1],[-210,92,Math.PI,2],[-246,54,Math.PI*.5,4],[172,250,Math.PI*.25,3],[198,284,Math.PI*.9,5]].forEach(([t,i,n,r])=>{const a=this.vehicleFactory.createCarMesh(dn[r],{preview:!1});a.position.set(t,0,i),a.rotation.y=n,a.scale.setScalar(.82),a.traverse(c=>{c.isMesh&&(c.castShadow=!0,c.receiveShadow=!0)}),this.group.add(a);const o=dn[r].visual;this.registerSolidBox(`parked-car-${t}-${i}`,t,i,o.width*.72,o.length*.8,n,o.height+o.rideHeight+.35,{type:Je.HARD_SOLID,metadata:{parkedCar:!0}})})}update(e){this.collectibles.forEach((t,i)=>{!t.visible&&t.userData.respawnAt&&performance.now()>=t.userData.respawnAt&&(t.visible=!0,t.userData.respawnAt=0),t.visible&&(t.rotation.y+=e*2.6,t.position.y=t.userData.baseY+Math.sin(performance.now()*.003+i)*.16)})}checkCollectibles(e,t,i,n){this.collectibles.forEach(r=>{if(r.visible&&e.distanceTo(r.position)<2){let a=!1;if(r.userData.type==="hiddenWheel"||r.userData.type==="landmarkToken"?a=t.collectHiddenToken(r.userData.id,r.userData.value,r.userData.xp):a=t.collectCoin(r.userData.id,r.userData.value,r.userData.xp,r.userData.oneTime),a){r.visible=!1,!r.userData.oneTime&&r.userData.type==="cityCoin"&&(r.userData.respawnAt=performance.now()+45e3),i.play("coin",.9);const o=r.userData.type==="cityCoin"?"city coins":"discovery token";n(`+${r.userData.value} ${o}`)}}})}restoreCollected(e){this.collectibles.forEach(t=>{const i=e.data.discoveries.hiddenTokens[t.userData.id],n=e.data.collectedCoins[t.userData.id];t.visible=!(t.userData.oneTime&&(i||n))})}checkLandmarks(e,t,i,n){this.landmarks.forEach(r=>{hi([e.x,e.z],r.position)<=r.radius&&t.discoverLandmark(r.id,r.reward,r.xp??45)&&(i.play("checkpoint",.8),n(`${r.name} discovered +${r.reward}`))})}checkDistricts(e,t,i,n){const r=this.getZoneAt(e);r.id!==this.currentZoneId&&(this.currentZoneId=r.id,n(r.name),t.discoverDistrict(r.id,r.reward??12,r.xp??24)&&(i.play("checkpoint",.55),n(`${r.name} mapped +${r.reward}`)))}getPathSurfaceMatch(e,t=null,i={}){const n=!!i.preferElevated,r=t?this.roadPaths.find(o=>t===o.id||String(t).startsWith(`${o.id}-`)):null;if(r){const o=this.projectPointToPath(r,e,2.8);if(o)return o}let a=null;for(const o of this.roadPaths){if(o===r)continue;const c=this.projectPointToPath(o,e,1.65);c&&(!n&&!r&&c.surfaceHeight>2.2||(!a||(o.priority??0)>(a.path.priority??0)||c.lateralDistance<a.lateralDistance)&&(a=c))}return a}projectPointToPath(e,t,i=1.5){let n=null;for(const r of e.segments){const a=r.b.x-r.a.x,o=r.b.z-r.a.z,c=a*a+o*o;if(c<.01)continue;const l=((t.x-r.a.x)*a+(t.z-r.a.z)*o)/c,d=i/Math.max(1,r.length);if(l<-d||l>1+d)continue;const h=Go.clamp(l,0,1),u=r.a.x+a*h,f=r.a.z+o*h,g=Math.hypot(t.x-u,t.z-f);if(g>e.width*.5+i)continue;const y=Go.lerp(r.a.y,r.b.y,h);(!n||g<n.lateralDistance)&&(n={path:e,segment:r,t:h,surfaceHeight:y,lateralDistance:g,heading:r.heading,slope:r.slope,nearest:new C(u,y,f)})}return n}getSurfaceInfo(e,t=null,i={}){const n=!!i.preferElevated,r=this.getPathSurfaceMatch(e,t,i),a=this.getZoneAt(e);if(r)return{offRoad:!1,zoneName:Ji.find(h=>h.id===r.path.zone)?.name??a.name,speedFactor:tn.highwaySpeedFactor,gripFactor:1,accelerationFactor:1,surfaceHeight:r.surfaceHeight,surfaceId:r.path.id,surfaceType:r.path.type,elevated:r.surfaceHeight>2.2,pathId:r.path.id,surfaceHeading:r.heading,surfaceSlope:r.slope};let o=null;const c=t?this.elevatedRoutes.find(d=>d.id===t):null;if(c){const d=this.getRouteLocal(c,e,1.8);d.inside&&(o={route:c,surfaceHeight:this.getRouteHeightAtT(c,d.t)})}for(const d of this.elevatedRoutes){if(d===c&&o)continue;const h=this.getRouteLocal(d,e);if(!h.inside)continue;const u=this.getRouteHeightAtT(d,h.t);!n&&!c&&u>2.2||(!o||(d.priority??0)>(o.route.priority??0)||u>o.surfaceHeight)&&(o={route:d,surfaceHeight:u})}if(o)return{offRoad:!1,zoneName:Ji.find(h=>h.id===o.route.zone)?.name??a.name,speedFactor:tn.highwaySpeedFactor,gripFactor:1,accelerationFactor:1,surfaceHeight:o.surfaceHeight,surfaceId:o.route.id,surfaceType:o.route.kind,elevated:!0};let l=null;for(const d of this.roadSegments){const h=new C(d.center[0],0,d.center[1]),u=new C(d.size[0],0,d.size[1]);if(Nn(e,h,u,d.rotation)){l=d;break}}if(l){const d=Ji.find(u=>u.id===l.zone)?.name??a.name,h=l.roadClass==="highway"||l.roadClass==="bridge"||l.zone==="highway";return{offRoad:!1,zoneName:d,speedFactor:h?tn.highwaySpeedFactor:l.roadClass==="market"?.92:1,gripFactor:1,accelerationFactor:1,surfaceHeight:l.elevation??0,surfaceId:l.id,surfaceType:l.roadClass??"road",elevated:!1}}return{offRoad:!0,zoneName:a.name,speedFactor:1,gripFactor:1,accelerationFactor:1,surfaceHeight:0,surfaceId:a.id,surfaceType:"terrain",elevated:!1}}getZoneAt(e){let t=Ji[0],i=1/0;for(const n of Ji){if(Math.abs(e.x-n.center[0])<=n.size[0]*.5&&Math.abs(e.z-n.center[1])<=n.size[1]*.5)return n;const a=Math.hypot(e.x-n.center[0],e.z-n.center[1]);a<i&&(t=n,i=a)}return t}}const Un=new Map,Kn=(s,e)=>{const t=`${s}:${JSON.stringify(e)}`;return Un.has(t)||Un.set(t,new je({roughness:.62,metalness:.08,depthTest:!1,depthWrite:!1,...e})),Un.get(t)},Gc=(s,e)=>{const t=`${s}:${JSON.stringify(e)}`;return Un.has(t)||Un.set(t,new Et({depthTest:!1,depthWrite:!1,...e})),Un.get(t)};class id{constructor(e,t,i){this.scene=e,this.camera=t,this.saveManager=i,this.root=new ft,this.root.name="Active Procedural Cockpit",this.root.visible=!1,this.root.renderOrder=1e3,this.scene.add(this.root),this.carId=null,this.config=null,this.rig=null,this.wheel=null,this.gaugeTexture=null,this.gaugeCanvas=null,this.gaugeContext=null,this.lastGaugeSpeed=-1,this.gaugeTimer=0,this.motion={x:0,y:-.04,z:0,pitch:0,roll:0},this.interiorLift=-.04,this.lastForwardSpeed=0,this.accelVisual=0,this.culledVehicle=null,this.cullActive=!1}setCar(e){if(!e||this.carId===e.id)return;this.disposeRig(),this.carId=e.id,this.config=_o(e.id);const t=this.buildCockpit(e,this.config);this.rig=t.group,this.wheel=t.wheel,this.gaugeCanvas=t.gaugeCanvas,this.gaugeContext=t.gaugeContext,this.gaugeTexture=t.gaugeTexture,this.root.add(this.rig),this.drawGauges(0,0,!1)}update(e,t,i,n){if(!t?.config){this.setVisible(!1);return}this.setCar(t.config);const r=n==="cockpit";this.setVisible(r),this.syncVehicleCull(t.mesh,r),!(!r||!this.rig)&&(this.syncRootToCamera(),this.updateMotion(e,i),this.updateWheel(e,t,i),this.updateGauges(e,i),this.updateMirrorVisibility())}updatePreview(e,t){this.setCar(t),this.setVisible(!0),this.syncRootToCamera();const i=Math.sin(performance.now()*.0016)*.32,n=42+Math.sin(performance.now()*.001)*18;this.wheel&&(this.wheel.rotation.z=Pt(this.wheel.rotation.z,-i*this.config.wheel.maxTurn,7,e)),this.rig.position.set(0,this.interiorLift,0),this.rig.rotation.set(0,0,0),this.gaugeTimer-=e,this.gaugeTimer<=0&&(this.drawGauges(n,Math.abs(i),!1),this.gaugeTimer=.09),this.updateMirrorVisibility()}setVisible(e){this.root.visible=e}syncRootToCamera(){this.root.position.copy(this.camera.position),this.root.quaternion.copy(this.camera.quaternion)}syncVehicleCull(e,t){this.culledVehicle&&this.culledVehicle!==e&&(this.applyCull(this.culledVehicle,!1),this.culledVehicle=null,this.cullActive=!1),e&&(this.culledVehicle!==e||this.cullActive!==t)&&(this.applyCull(e,t),this.culledVehicle=e,this.cullActive=t)}applyCull(e,t){e.traverse(i=>{i.userData?.firstPersonCull&&(i.visible=!t)})}updateMotion(e,t){const i=td.motionLevels[this.saveManager.settings.cockpitMotion]??1,n=this.config.motion,r=t?.speedRatio??0,a=t?.steeringVisual??0,o=t?.inputThrottle??0,c=t?.braking?1:0,l=t?.collisionIntensity??0,d=t?.forwardSpeed??0,h=e>0?(d-this.lastForwardSpeed)/e:0;this.lastForwardSpeed=d;const u=dt(h/22,-1,1),f=o*.42-c*.75;this.accelVisual=Pt(this.accelVisual,dt(u+f,-1,1),7.5,e);const y=((t?.offRoad?Math.sin(performance.now()*.035)*n.vibration*r:0)+l*.012)*i,m=this.accelVisual*n.push*2.2*i,p=this.accelVisual*n.pitch*1.9*i,M={x:-a*n.lean*.7*i,y:this.interiorLift+y,z:-m,pitch:-p+l*.015*i,roll:-a*n.lean*i};this.motion.x=Pt(this.motion.x,M.x,8,e),this.motion.y=Pt(this.motion.y,M.y,10,e),this.motion.z=Pt(this.motion.z,M.z,8,e),this.motion.pitch=Pt(this.motion.pitch,M.pitch,7,e),this.motion.roll=Pt(this.motion.roll,M.roll,7,e),this.rig.position.set(this.motion.x,this.motion.y,this.motion.z),this.rig.rotation.set(this.motion.pitch,0,this.motion.roll)}updateWheel(e,t,i){if(!this.wheel)return;const n=i?.steeringVisual??t.steerVisual??0,r=i?.collisionIntensity??0,a=Math.sin(performance.now()*.042)*r*.03;this.wheel.rotation.z=Pt(this.wheel.rotation.z,-n*this.config.wheel.maxTurn+a,11,e)}updateGauges(e,t){this.gaugeTimer-=e;const i=t?.speedKmh??0;this.gaugeTimer>0&&Math.abs(i-this.lastGaugeSpeed)<2||(this.drawGauges(i,t?.speedRatio??0,t?.boosting??!1),this.gaugeTimer=.075)}updateMirrorVisibility(){if(!this.rig)return;const e=this.saveManager.settings.mirrorRendering!=="off";this.rig.traverse(t=>{t.userData?.cockpitMirror&&(t.visible=e)})}drawGauges(e,t,i){if(!this.gaugeContext)return;const n=this.gaugeContext,r=this.gaugeCanvas,a=this.config,o=dt(Number(this.saveManager.settings.dashboardBrightness??.9),.35,1.2),c=a.dashboard.accent;this.lastGaugeSpeed=e,n.clearRect(0,0,r.width,r.height),n.fillStyle="#0c1219",n.fillRect(0,0,r.width,r.height),n.globalAlpha=.14*o,n.fillStyle=c,n.fillRect(0,0,r.width,r.height),n.globalAlpha=1,n.strokeStyle=c,n.lineWidth=4,n.strokeRect(8,8,r.width-16,r.height-16);const l=a.dashboard.display.includes("analog")||a.dashboard.display.includes("round")?"SPEED":"KM/H";if(n.fillStyle=a.materials.display,n.font="900 48px system-ui, sans-serif",n.textAlign="center",n.fillText(String(Math.round(e)).padStart(3,"0"),r.width*.5,64),n.font="800 15px system-ui, sans-serif",n.fillText(l,r.width*.5,86),a.dashboard.display.includes("analog")||a.dashboard.display.includes("round")){const h=r.width*.22,u=72;n.strokeStyle=a.materials.display,n.lineWidth=3,n.beginPath(),n.arc(h,u,34,Math.PI*.72,Math.PI*2.28),n.stroke();const f=Math.PI*.72+dt(t,0,1)*Math.PI*1.56;n.beginPath(),n.moveTo(h,u),n.lineTo(h+Math.cos(f)*27,u+Math.sin(f)*27),n.strokeStyle=c,n.stroke()}else n.fillStyle="rgba(255,255,255,0.18)",n.fillRect(30,102,r.width-60,8),n.fillStyle=i?"#fff7b8":c,n.fillRect(30,102,(r.width-60)*dt(t,0,1),8);this.gaugeTexture.needsUpdate=!0}buildCockpit(e,t){const i=new ft;i.name=`${e.name} Cockpit Rig`,i.renderOrder=1e3;const n=this.createMaterials(t);this.addDashboard(i,t,n);const r=this.addSteeringWheel(i,t,n),a=this.addGaugeDisplay(i,t);return this.addWindshield(i,t,n),this.addConsole(i,t,n),this.addSidePanels(i,t,n),this.addSeatHints(i,t,n),this.addMirrorImpressions(i,t,n),this.addCarSpecificAccents(i,e.id,t,n),{group:i,wheel:r,gaugeCanvas:a.canvas,gaugeContext:a.context,gaugeTexture:a.texture}}createMaterials(e){return{dash:Kn(`cockpit-dash-${this.carId}`,{color:e.materials.dash}),lower:Kn(`cockpit-lower-${this.carId}`,{color:e.materials.lower}),trim:Kn(`cockpit-trim-${this.carId}`,{color:e.materials.trim,roughness:.32,metalness:this.carId==="classic"?.62:.28}),frame:Kn(`cockpit-frame-${this.carId}`,{color:e.materials.frame}),seat:Kn(`cockpit-seat-${this.carId}`,{color:e.materials.seat}),glass:Gc(`cockpit-glass-${this.carId}`,{color:"#dff8ff",transparent:!0,opacity:e.windshield.tint})}}addDashboard(e,t,i){const n=new L(new W(t.dashboard.width,t.dashboard.height,.36),i.dash);n.position.set(0,t.dashboard.y,t.dashboard.z),n.renderOrder=1e3,e.add(n);const r=new L(new W(t.dashboard.width*.94,.055,.48),i.lower);r.position.set(0,t.dashboard.y+t.dashboard.height*.46,t.dashboard.z-.03),r.rotation.x=-.08,r.renderOrder=1001,e.add(r);const a=new L(new W(t.dashboard.width*.82,.035,.035),i.trim);a.position.set(0,t.dashboard.y+.08,t.dashboard.z+.205),a.renderOrder=1002,e.add(a)}addSteeringWheel(e,t,i){const n=new ft;n.position.set(t.wheel.x,t.wheel.y,t.wheel.z),n.renderOrder=1004;const r=new L(new Yt(t.wheel.radius,t.wheel.tube,10,42),i.frame);r.renderOrder=1004,n.add(r);for(let o=0;o<t.wheel.spokes;o+=1){const c=new L(new W(t.wheel.radius*.92,.026,.026),i.trim);c.rotation.z=o/t.wheel.spokes*Math.PI*2,c.renderOrder=1005,n.add(c)}const a=new L(new mt(t.wheel.radius*.24,t.wheel.radius*.24,.045,18),i.trim);return a.rotation.x=Math.PI*.5,a.renderOrder=1006,n.add(a),e.add(n),n}addGaugeDisplay(e,t){const i=document.createElement("canvas");i.width=256,i.height=128;const n=i.getContext("2d"),r=new wl(i),a=new Et({map:r,transparent:!0,depthTest:!1,depthWrite:!1}),o=t.dashboard.display==="digital-strip"?.86:.72,c=t.dashboard.display==="digital-strip"?.22:.34,l=new L(new Gi(o,c),a);return l.position.set(t.wheel.x+.36,t.dashboard.y+.1,t.dashboard.z+.205),l.renderOrder=1007,e.add(l),{canvas:i,context:n,texture:r}}addWindshield(e,t,i){const n=t.windshield,r=new L(new Gi(n.width*.86,n.height*.78),i.glass);r.position.set(0,n.y,n.z),r.renderOrder=998,e.add(r),[-1,1].forEach(o=>{const c=new L(new W(n.pillarWidth,n.height,.05),i.frame);c.position.set(o*n.width*.48,n.y,n.z+.02),c.rotation.z=o*.16,c.renderOrder=1002,e.add(c)});const a=new L(new W(n.width,n.pillarWidth*1.2,.06),i.frame);a.position.set(0,n.y+n.height*.5,n.z+.02),a.renderOrder=1002,e.add(a)}addConsole(e,t,i){const n=new L(new W(.34,.3,.36),i.lower);n.position.set(.24,t.dashboard.y-.08,t.dashboard.z+.03),n.rotation.x=-.18,n.renderOrder=1003,e.add(n);const r=new L(new Gi(.24,.13),Gc(`cockpit-console-screen-${this.carId}`,{color:t.materials.display,transparent:!0,opacity:.82}));r.position.set(.24,t.dashboard.y+.03,t.dashboard.z+.22),r.renderOrder=1008,e.add(r)}addSidePanels(e,t,i){[-1,1].forEach(n=>{const r=new L(new W(.08,.34,.72),i.lower);r.position.set(n*t.windshield.width*.53,t.dashboard.y-.1,-.74),r.rotation.y=n*.16,r.renderOrder=1e3,e.add(r)})}addSeatHints(e,t,i){const n=new L(new W(1.55,.18,.42),i.seat);n.position.set(0,-.78,-.18),n.renderOrder=999,e.add(n)}addMirrorImpressions(e,t,i){const n=new L(new W(.42,.12,.035),i.frame);n.position.set(0,t.windshield.y+t.windshield.height*.35,t.windshield.z+.12),n.renderOrder=1005,n.userData.cockpitMirror=!0,e.add(n),[-1,1].forEach(r=>{const a=new L(new W(.19,.1,.04),i.frame);a.position.set(r*t.windshield.width*.58,t.dashboard.y+.04,t.windshield.z+.05),a.rotation.y=r*.32,a.renderOrder=1004,a.userData.cockpitMirror=!0,e.add(a)})}addCarSpecificAccents(e,t,i,n){if(t==="offroad-jeep"&&[-1,1].forEach(r=>{const a=new L(new mt(.025,.025,1.1,10),n.frame);a.position.set(r*.74,.18,-.36),a.rotation.z=.2*r,a.renderOrder=1003,e.add(a)}),t==="classic"&&[-.22,.22].forEach(r=>{const a=new L(new Yt(.11,.01,8,24),n.trim);a.position.set(r,i.dashboard.y+.12,i.dashboard.z+.215),a.renderOrder=1008,e.add(a)}),t==="supercar"){const r=new L(new W(1.42,.035,.035),n.trim);r.position.set(.05,i.dashboard.y+.17,i.dashboard.z+.22),r.renderOrder=1008,e.add(r)}}disposeRig(){this.rig&&(this.root.remove(this.rig),this.rig.traverse(e=>{e.geometry?.dispose?.(),e.material?.map===this.gaugeTexture&&e.material.dispose?.()})),this.rig=null,this.wheel=null,this.gaugeCanvas=null,this.gaugeContext=null,this.gaugeTexture?.dispose?.(),this.gaugeTexture=null}dispose(){this.culledVehicle&&this.applyCull(this.culledVehicle,!1),this.disposeRig(),this.scene.remove(this.root)}}class Bg{constructor(e){this.scene=e,this.effects=[],this.coinGeometry=new Yt(.65,.1,8,22),this.puffGeometry=new Rt(.28,8,6),this.materials={coin:new je({color:"#f3c65f",emissive:"#b88720",emissiveIntensity:.4,metalness:.6,roughness:.28}),smoke:new Et({color:"#d7d8d2",transparent:!0,opacity:.42,depthWrite:!1}),boost:new Et({color:"#67d9ff",transparent:!0,opacity:.5,depthWrite:!1}),dust:new Et({color:"#c8b98a",transparent:!0,opacity:.34,depthWrite:!1}),spark:new Et({color:"#ffd36b",transparent:!0,opacity:.82,depthWrite:!1}),skid:new Et({color:"#111820",transparent:!0,opacity:.28,depthWrite:!1})}}createCoinMesh(){const e=new L(this.coinGeometry,this.materials.coin);return e.castShadow=!0,e.userData.baseY=1.15,e}spawnPuff(e,t={}){const i=t.boost?this.materials.boost.clone():this.materials.smoke.clone();t.color&&i.color.set(t.color);const n=new L(this.puffGeometry,i);n.position.copy(e),n.scale.setScalar(t.size??1),this.scene.add(n),this.effects.push({mesh:n,material:i,age:0,life:t.life??.7,velocity:new C((Math.random()-.5)*.5,.45+Math.random()*.25,(Math.random()-.5)*.5)})}spawnDust(e){const t=new L(this.puffGeometry,this.materials.dust.clone());t.position.copy(e),t.scale.setScalar(.72),this.scene.add(t),this.effects.push({mesh:t,material:t.material,age:0,life:.46,velocity:new C((Math.random()-.5)*.8,.35,(Math.random()-.5)*.8)})}spawnSparks(e){for(let t=0;t<5;t+=1){const i=new L(new W(.08,.08,.42),this.materials.spark.clone());i.position.copy(e),i.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),this.scene.add(i),this.effects.push({mesh:i,material:i.material,age:0,life:.28,velocity:new C((Math.random()-.5)*3,Math.random()*1.7,(Math.random()-.5)*3)})}}spawnSkid(e,t){const i=new L(new W(.26,.012,1.4),this.materials.skid.clone());i.position.copy(e),i.position.y=.025,i.rotation.y=t,this.scene.add(i),this.effects.push({mesh:i,material:i.material,age:0,life:5.5,velocity:new C})}update(e){for(let t=this.effects.length-1;t>=0;t-=1){const i=this.effects[t];i.age+=e,i.mesh.position.addScaledVector(i.velocity,e);const n=i.age/i.life;i.mesh.scale.multiplyScalar(1+e*.8),i.material.opacity=Math.max(0,(1-n)*.42),i.age>=i.life&&(this.scene.remove(i.mesh),i.material.dispose(),this.effects.splice(t,1))}}}const Yr=[{id:"morning-traffic",name:"Morning Traffic Flow",description:"Downtown and Market traffic feel busier for a short cruise.",duration:110,rewardCoins:30,rewardXp:45},{id:"park-cruise",name:"Park Cruise Bonus",description:"Smooth Park Loop driving earns a gentle XP bonus.",duration:120,rewardCoins:35,rewardXp:55},{id:"highway-speed",name:"Expressway Speed Window",description:"Clean high-speed highway ring driving gives extra mastery.",duration:90,rewardCoins:40,rewardXp:65},{id:"market-rush",name:"Market Delivery Rush",description:"Delivery rewards get a local bonus while the rush is active.",duration:120,rewardCoins:35,rewardXp:50},{id:"hill-view",name:"Hill View Challenge",description:"Reach the viewpoint road cleanly for a scenic reward.",duration:110,rewardCoins:45,rewardXp:70},{id:"airport-cruise",name:"Airport Arrival Flow",description:"Smooth driving around the terminal and service roads earns a local bonus.",duration:120,rewardCoins:45,rewardXp:70},{id:"industrial-shift",name:"Industrial Logistics Shift",description:"Cruise the depot roads cleanly while cargo traffic is active.",duration:120,rewardCoins:45,rewardXp:68},{id:"clean-streak",name:"Clean Driving Streak",description:"Drive without collisions and bank a clean-skill bonus.",duration:100,rewardCoins:45,rewardXp:70}],Zr=[{id:"reach-park-fountain",label:"Reach the Grand Park Fountain",target:[-190,66],coins:28,xp:38,masteryXp:50},{id:"reach-airport",label:"Discover Horizon Airport Terminal",target:[-360,-350],coins:45,xp:70,masteryXp:80},{id:"cross-bridge",label:"Cross the Expressway Bridge",target:[0,-172],coins:38,xp:56,masteryXp:70},{id:"reach-industrial",label:"Reach Industrial Depot",target:[360,-330],coins:38,xp:58,masteryXp:70},{id:"clean-900",label:"Drive 900m without a crash",cleanDistance:900,coins:55,xp:75,masteryXp:95},{id:"highway-170",label:"Hit 170 km/h on the Expressway",zone:"Highway Ring / Expressway System",speedKmh:170,coins:45,xp:65,masteryXp:80},{id:"collect-10",label:"Collect 10 city coins",coinCount:10,coins:40,xp:55,masteryXp:70},{id:"drift-5",label:"Drift for 5 seconds",driftSeconds:5,coins:35,xp:50,masteryXp:70}];class zg{constructor(e,t,i={}){this.saveManager=e,this.masteryManager=t,this.callbacks=i,this.eventIndex=0,this.activeEvent=Yr[0],this.eventTimer=this.activeEvent.duration,this.eventProgress={distance:0,cleanDistance:0,speedTime:0,claimed:!1},this.taskIndex=0,this.activeTask=Zr[0],this.taskProgress={cleanDistance:0,coinStart:e.data.stats.totalCoinsCollected,driftSeconds:0}}update(e,t,i,n,r){return n!=="freeDrive"?this.getHudData():(this.eventTimer-=e,this.eventTimer<=0&&this.rotateEvent(),this.updateEventProgress(e,t,i,r),this.updateTask(e,t,i,r),this.getHudData())}rotateEvent(){this.eventIndex=(this.eventIndex+1)%Yr.length,this.activeEvent=Yr[this.eventIndex],this.eventTimer=this.activeEvent.duration,this.eventProgress={distance:0,cleanDistance:0,speedTime:0,claimed:!1},this.callbacks.onEvent?.(this.activeEvent)}updateEventProgress(e,t,i,n){if(this.eventProgress.claimed)return;const r=t.collisionIntensity<.08;this.eventProgress.distance+=t.distanceTravelled,this.eventProgress.cleanDistance=r?this.eventProgress.cleanDistance+t.distanceTravelled:0,this.eventProgress.speedTime=t.speedKmh>120&&r?this.eventProgress.speedTime+e:Math.max(0,this.eventProgress.speedTime-e);const a=this.activeEvent.id,o=t.zoneName,c=hi([i.position.x,i.position.z],[170,258])<16;(a==="morning-traffic"&&["Downtown Core","Market Street"].includes(o)&&this.eventProgress.distance>280||a==="park-cruise"&&o==="Park Loop"&&this.eventProgress.cleanDistance>240||a==="highway-speed"&&o==="Highway Ring / Expressway System"&&this.eventProgress.speedTime>6||a==="market-rush"&&o==="Market Street"&&this.eventProgress.cleanDistance>160||a==="hill-view"&&c||a==="airport-cruise"&&o==="Airport Zone"&&this.eventProgress.cleanDistance>220||a==="industrial-shift"&&o==="Industrial / Logistics Zone"&&this.eventProgress.cleanDistance>220||a==="clean-streak"&&this.eventProgress.cleanDistance>420)&&(this.eventProgress.claimed=!0,this.saveManager.completeCityEvent(a),this.saveManager.addCoins(this.activeEvent.rewardCoins),this.saveManager.addXP(this.activeEvent.rewardXp),this.masteryManager.addXp(n,55,"cityEvent"),this.callbacks.onTaskComplete?.({label:this.activeEvent.name,coins:this.activeEvent.rewardCoins}))}updateTask(e,t,i,n){if(!this.activeTask||this.saveManager.data.freeDriveTasks.completed[this.activeTask.id]){this.nextTask();return}const r=this.activeTask;let a=!1;r.target&&(a=hi([i.position.x,i.position.z],r.target)<9),r.cleanDistance&&(t.collisionIntensity>.1?this.taskProgress.cleanDistance=0:this.taskProgress.cleanDistance+=t.distanceTravelled,a=this.taskProgress.cleanDistance>=r.cleanDistance),r.speedKmh&&(a=t.zoneName===r.zone&&t.speedKmh>=r.speedKmh),r.coinCount&&(a=this.saveManager.data.stats.totalCoinsCollected-this.taskProgress.coinStart>=r.coinCount),r.driftSeconds&&(this.taskProgress.driftSeconds=t.drifting?this.taskProgress.driftSeconds+e:Math.max(0,this.taskProgress.driftSeconds-e*.5),a=this.taskProgress.driftSeconds>=r.driftSeconds),a&&(this.saveManager.completeFreeDriveTask(r.id),this.saveManager.addCoins(r.coins),this.saveManager.addXP(r.xp),this.masteryManager.addXp(n,r.masteryXp,"freeDriveTask"),this.callbacks.onTaskComplete?.(r),this.nextTask())}nextTask(){this.taskIndex=(this.taskIndex+1)%Zr.length,this.activeTask=Zr[this.taskIndex],this.taskProgress={cleanDistance:0,coinStart:this.saveManager.data.stats.totalCoinsCollected,driftSeconds:0}}getHudData(){return{event:this.activeEvent,eventTime:Math.max(0,this.eventTimer),task:this.activeTask}}}const Ya=[{id:"city-driver",name:"City Driver Path",description:"Relaxed local driving, deliveries, taxi comfort, parking, and city discovery.",missions:[{id:"career-first-city-ride",title:"First City Ride",missionId:"downtown-dash",required:null,rewardCoins:80,rewardXp:100},{id:"career-parkside-delivery",title:"Parkside Delivery",missionId:"standard-parcel",required:"career-first-city-ride",rewardCoins:100,rewardXp:120},{id:"career-smooth-taxi",title:"Smooth Taxi Pickup",missionId:"residential-taxi",required:"career-parkside-delivery",rewardCoins:115,rewardXp:135},{id:"career-market-parking",title:"Market Parking Test",missionId:"tight-market-parking",required:"career-smooth-taxi",rewardCoins:130,rewardXp:150}]},{id:"pro-driver",name:"Pro Driver Path",description:"Skill routes, drift control, clean speed, and hill handling.",missions:[{id:"career-downtown-dash",title:"Downtown Dash",missionId:"downtown-dash",required:null,rewardCoins:90,rewardXp:115},{id:"career-park-drift",title:"Park Drift Trial",missionId:"park-loop-drift",required:"career-downtown-dash",rewardCoins:120,rewardXp:145},{id:"career-highway-speed",title:"Highway Speed Run",missionId:"highway-blast",required:"career-park-drift",rewardCoins:140,rewardXp:160},{id:"career-hill-view",title:"Hill View Sprint",missionId:"hill-climb-sprint",required:"career-highway-speed",rewardCoins:160,rewardXp:180}]}],Vc=Object.fromEntries(Ya.flatMap(s=>s.missions.map(e=>[e.id,{...e,pathId:s.id}])));class Hg{constructor(e,t={}){this.saveManager=e,this.callbacks=t}getPaths(){return Ya.map(e=>({...e,missions:e.missions.map(t=>this.getMissionState(t.id))}))}getMissionState(e){const t=Vc[e],i=vo(t?.missionId),n=this.saveManager.data.career.completed[e]??null,r=!t?.required||!!this.saveManager.data.career.completed[t.required];return{...t,config:i,completed:n,unlocked:r}}complete(e,t){const i=Vc[e];if(!i||!t?.success)return null;const n=this.saveManager.completeCareerMission(e,t),r=[];return n&&(this.saveManager.addCoins(i.rewardCoins),this.saveManager.addXP(i.rewardXp),Ya.forEach(a=>{a.missions.forEach(o=>{o.required===e&&r.push(o.title)})}),this.callbacks.onCareerComplete?.(i,r)),{careerMission:i,coins:n?i.rewardCoins:0,xp:n?i.rewardXp:0,unlocked:r}}}const Wc=[{id:"stock",name:"Factory Paint",color:null,unlockLevel:"rookie"},{id:"pearl",name:"Pearl White",color:"#f8f3ea",unlockLevel:"rookie"},{id:"sunburst",name:"Sunburst Yellow",color:"#f4d35e",unlockLevel:"rookie"},{id:"canyon-red",name:"Canyon Red",color:"#d94c45",unlockLevel:"city"},{id:"bay-blue",name:"Bay Blue",color:"#3f88c5",unlockLevel:"city"},{id:"horizon-teal",name:"Horizon Teal",color:"#1abc9c",unlockLevel:"skilled"},{id:"royal-violet",name:"Royal Violet",color:"#5f4bb6",unlockLevel:"pro"}],Xc=[{id:"stock",name:"Factory Accent",color:null,unlockLevel:"rookie"},{id:"classic-gold",name:"Classic Gold",color:"#caa76a",unlockLevel:"rookie"},{id:"graphite",name:"Graphite",color:"#2f3640",unlockLevel:"city"},{id:"cream",name:"Cream Stripe",color:"#fff7cf",unlockLevel:"city"},{id:"mint",name:"Mint Detail",color:"#7fd8be",unlockLevel:"skilled"}],Gg=[{id:"stock",name:"Factory Wheels",unlockLevel:"rookie"},{id:"alloy",name:"Bright Alloy",unlockLevel:"city"},{id:"sport",name:"Sport Split-Spoke",unlockLevel:"skilled"},{id:"offroad",name:"Rugged Tire",unlockLevel:"skilled"},{id:"classic",name:"Chrome Classic",unlockLevel:"pro"}],$c=[{id:"clean-blue",name:"Clean Blue",color:"#67d9ff",unlockLevel:"rookie"},{id:"sun-gold",name:"Sun Gold",color:"#f3c65f",unlockLevel:"city"},{id:"soft-mint",name:"Soft Mint",color:"#6ee7b7",unlockLevel:"skilled"}],qc=[{id:"stock",name:"Factory Glass",opacity:.72,unlockLevel:"rookie"},{id:"light",name:"Light Blue Tint",opacity:.64,unlockLevel:"city"},{id:"premium",name:"Premium Smoke Tint",opacity:.52,unlockLevel:"pro"}],Za={paint:"stock",accent:"stock",wheels:"stock",boostTrail:"clean-blue",tint:"stock",plate:"MCD-02"},Yc={hatchback:"Best for first drives, parking, and calm route learning.","sports-coupe":"Best for drift zones and fast city time trials.",suv:"Best for taxi comfort, stable delivery runs, and safe cruising.",supercar:"Best for Highway Blast and S medal attempts.","offroad-jeep":"Best for Park Loop shortcuts and rough grass paths.",classic:"Best for relaxed cruising, smooth taxi rides, and style runs."},Vs=(s,e)=>s.find(t=>t.id===e)??s[0],is=[{id:"rookie",name:"Rookie Driver",minXp:0,nextReward:"City coin starter bonus"},{id:"city",name:"City Driver",minXp:320,nextReward:"Warm paint palette and clean boost trail"},{id:"skilled",name:"Skilled Driver",minXp:820,nextReward:"Sport accent colors and alloy wheel style"},{id:"pro",name:"Pro Driver",minXp:1550,nextReward:"Premium tint and Horizon stripe decals"},{id:"horizon",name:"Horizon Driver",minXp:2600,nextReward:"All Phase 4 local cosmetics unlocked"}],Vg={cleanDrivingChunk:8},an=s=>{let e=is[0];for(const n of is)s>=n.minXp&&(e=n);const t=is.findIndex(n=>n.id===e.id),i=is[t+1]??null;return{...e,index:t,next:i,progress:i?Math.min(1,(s-e.minXp)/(i.minXp-e.minXp)):1}},Zc=s=>Math.max(0,is.findIndex(e=>e.id===s));class Wg{constructor(e){this.saveManager=e}isUnlocked(e){return Zc(this.saveManager.data.license.levelId)>=Zc(e.unlockLevel)}getOptions(){return{paints:Wc,accents:Xc,wheels:Gg,boostTrails:$c,tints:qc}}getCarCustomization(e){return this.saveManager.getCustomization(e)}apply(e,t){const n={...this.getCarCustomization(e),...t};return this.saveManager.setCustomization(e,n),n}reset(e){return this.saveManager.resetCustomization(e),{...Za}}resolveVisualColors(e,t=this.getCarCustomization(e.id)){const i=Vs(Wc,t.paint),n=Vs(Xc,t.accent),r=Vs($c,t.boostTrail),a=Vs(qc,t.tint);return{body:i.color??e.colors.body,accent:n.color??e.colors.accent,boostTrail:r.color,tintOpacity:a.opacity}}}const Xg=[{title:"Choose Your Car",copy:"Every Phase 4 car keeps its own handling role. Pick a relaxed cruiser, a drift car, or a fast route specialist."},{title:"Explore The Districts",copy:"Drive through named districts, discover landmarks, and fill the City Passport for local coins and license XP."},{title:"Try Bite-Size Missions",copy:"Time Trials, Drift Zones, Taxi Rides, Delivery Runs, and Parking Challenges all save best local results."},{title:"Grow Your License",copy:"Clean driving, missions, medals, landmarks, and achievements level your local Driving License."}],sr=[{id:"acceleration",label:"Acceleration",stat:"acceleration",physicsKey:"acceleration",step:.055},{id:"topSpeed",label:"Top Speed",stat:"speed",physicsKey:"maxSpeed",step:.045},{id:"braking",label:"Braking",stat:"braking",physicsKey:"braking",step:.055},{id:"handling",label:"Handling",stat:"handling",physicsKey:"steerRate",step:.04},{id:"driftGrip",label:"Drift Grip",stat:"drift",physicsKey:"driftGrip",step:-.045},{id:"offRoadGrip",label:"Off-Road",stat:"offRoad",physicsKey:"offRoadGrip",step:.045},{id:"stability",label:"Stability",stat:"stability",physicsKey:"grip",step:.035}],$g=80,qg={hatchback:{acceleration:4,topSpeed:3,braking:4,handling:5,driftGrip:3,offRoadGrip:3,stability:5},"sports-coupe":{acceleration:5,topSpeed:5,braking:3,handling:4,driftGrip:5,offRoadGrip:2,stability:3},suv:{acceleration:3,topSpeed:3,braking:5,handling:3,driftGrip:2,offRoadGrip:4,stability:5},supercar:{acceleration:5,topSpeed:6,braking:4,handling:4,driftGrip:4,offRoadGrip:1,stability:3},"offroad-jeep":{acceleration:3,topSpeed:2,braking:4,handling:3,driftGrip:3,offRoadGrip:6,stability:5},classic:{acceleration:3,topSpeed:3,braking:3,handling:3,driftGrip:4,offRoadGrip:2,stability:5}},Ka=()=>Object.fromEntries(sr.map(s=>[s.id,0])),Yg=s=>$g+s*55,Zg=[["speed","Speed"],["acceleration","Acceleration"],["handling","Handling"],["braking","Braking"],["drift","Drift"],["offRoad","Off-Road"],["stability","Stability"]],Kg={timeTrial:"Time Trials",drift:"Drift Zones",taxi:"Taxi Rides",delivery:"Deliveries",parking:"Parking"};class jg{constructor(e,t,i,n,r,a,o,c){this.root=e,this.vehicleFactory=t,this.saveManager=i,this.customizationManager=n,this.tuningManager=r,this.masteryManager=a,this.careerManager=o,this.callbacks=c,this.selectedId=i.data.selectedCar,this.infoPanel="passport",this.previewMode="exterior",this.previewCar=null,this.previewScene=new xl,this.previewScene.background=new et("#eaf7ff"),this.previewCamera=new $t(45,1,.1,120),this.previewCamera.position.set(6.6,3.8,8.4),this.previewCamera.lookAt(0,1,0),this.previewRoot=new ft,this.previewScene.add(this.previewRoot),this.cockpitPreview=new id(this.previewScene,this.previewCamera,this.saveManager),this.createPreviewLighting(),this.createShowroom(),this.buildDom(),this.rebuild()}createPreviewLighting(){const e=new Fl("#ffffff","#d6b96d",1.25);this.previewScene.add(e);const t=new nr("#fff0d2",2.6);t.position.set(-5,9,7),t.castShadow=!0,this.previewScene.add(t);const i=new nr("#e8f7ff",1.1);i.position.set(6,5,-6),this.previewScene.add(i)}createShowroom(){const e=new L(new or(9.2,64),new je({color:"#f6efe2",roughness:.45,metalness:.05}));e.rotation.x=-Math.PI*.5,e.receiveShadow=!0,this.previewScene.add(e);const t=new L(new Yt(4.8,.045,8,90),new Et({color:"#caa76a",transparent:!0,opacity:.72}));t.rotation.x=Math.PI*.5,t.position.y=.035,this.previewScene.add(t)}buildDom(){this.el=document.createElement("section"),this.el.className="garage",this.el.innerHTML=`
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
    `,this.root.appendChild(this.el),this.listEl=this.el.querySelector("[data-car-list]"),this.detailEl=this.el.querySelector("[data-car-detail]")}rebuild(){this.renderCarList(),this.renderDetails(),this.rebuildPreview()}renderCarList(){this.listEl.innerHTML="",dn.forEach(e=>{const t=document.createElement("button");t.className=`car-choice${e.id===this.selectedId?" is-selected":""}`,t.type="button",t.innerHTML=`
        <span class="car-choice__swatch" style="background:${e.colors.body}"></span>
        <span>
          <span class="car-choice__name">${e.name}</span>
          <span class="car-choice__meta">${Yc[e.id]??e.description}</span>
        </span>
        <span class="car-choice__state">${e.unlockText}</span>
      `,t.addEventListener("click",()=>{this.selectedId=e.id,this.saveManager.setSelectedCar(e.id),this.callbacks.onAudioClick(),this.rebuild()}),this.listEl.appendChild(t)})}renderDetails(){const e=rn(this.selectedId),t=this.tuningManager.getEffectiveConfig(e),i=this.masteryManager.getMastery(e.id),n=an(this.saveManager.data.license.xp);this.detailEl.innerHTML=`
      <p class="eyebrow">Selected car - ${n.name} - ${i.level.name}</p>
      <h2>${e.name}</h2>
      <p>${e.description}</p>
      <p class="garage__copy">${Yc[e.id]??"Best for clean city driving."}</p>
      ${this.renderPreviewControls(e)}
      <div class="license-strip">
        <span>${n.name}</span>
        <span class="stat-track"><span class="stat-fill" style="width:${n.progress*100}%"></span></span>
        <strong>${this.saveManager.data.license.xp} XP</strong>
      </div>
      <div class="stat-list">
        ${Zg.map(([r,a])=>`
          <div class="stat-row">
            <span>${a}</span>
            <span class="stat-track"><span class="stat-fill" style="width:${t.stats[r]}%"></span></span>
            <span>${t.stats[r]}</span>
          </div>
        `).join("")}
      </div>
      <div class="license-strip">
        <span>Mastery</span>
        <span class="stat-track"><span class="stat-fill" style="width:${i.level.progress*100}%"></span></span>
        <strong>${Math.round(i.xp)} XP</strong>
      </div>
      ${this.renderCustomization(e)}
      <div class="garage__actions">
        <button class="primary-button" type="button" data-start-free>Start Free Drive</button>
        <button class="secondary-button" type="button" data-test-drive>Test Drive</button>
        ${this.renderMissionButtons()}
        ${this.renderInfoTabs()}
      </div>
      <div class="garage-info-panel">${this.renderInfoPanel()}</div>
    `,this.bindDetailEvents()}bindDetailEvents(){this.detailEl.querySelector("[data-start-free]").addEventListener("click",()=>{this.callbacks.onStart("freeDrive",this.selectedId)}),this.detailEl.querySelector("[data-test-drive]").addEventListener("click",()=>{this.callbacks.onTestDrive?.(this.selectedId)}),this.detailEl.querySelectorAll("[data-preview-mode]").forEach(e=>{e.addEventListener("click",()=>{this.previewMode=e.dataset.previewMode,this.callbacks.onAudioClick(),this.renderDetails(),this.rebuildPreview()})}),this.detailEl.querySelectorAll("[data-mission]").forEach(e=>{e.addEventListener("click",()=>this.callbacks.onStart(e.dataset.mission,this.selectedId))}),this.detailEl.querySelectorAll("[data-customize]").forEach(e=>{e.addEventListener("change",()=>{this.customizationManager.apply(this.selectedId,{[e.dataset.customize]:e.value}),this.callbacks.onAudioClick(),this.rebuild()})}),this.detailEl.querySelector("[data-reset-customization]")?.addEventListener("click",()=>{this.customizationManager.reset(this.selectedId),this.callbacks.onAudioClick(),this.rebuild()}),this.detailEl.querySelectorAll("[data-info]").forEach(e=>{e.addEventListener("click",()=>{this.infoPanel=e.dataset.info,this.renderDetails()})}),this.detailEl.querySelectorAll("[data-tune]").forEach(e=>{e.addEventListener("click",()=>{const t=this.tuningManager.upgrade(this.selectedId,e.dataset.tune);this.callbacks.onAudioClick(),this.renderDetails(),t.ok||this.callbacks.onFeedback?.(t.reason)})}),this.detailEl.querySelector("[data-reset-tuning]")?.addEventListener("click",()=>{this.tuningManager.reset(this.selectedId),this.callbacks.onAudioClick(),this.renderDetails()}),this.detailEl.querySelectorAll("[data-career]").forEach(e=>{e.addEventListener("click",()=>{e.disabled||this.callbacks.onStartCareer(e.dataset.career,e.dataset.mission,this.selectedId)})})}renderMissionButtons(){return Object.entries(Kg).map(([e,t])=>`
      <p class="garage-section-title">${t}</p>
      <div class="mission-buttons">
        ${jl.filter(i=>i.type===e).map(i=>`
          <button class="secondary-button mission-button" type="button" data-mission="${i.id}">
            <span>${i.name}</span><span>${i.recommendedCar}</span>
          </button>
        `).join("")}
      </div>
    `).join("")}renderPreviewControls(e){const t=_o(e.id);return`
      <div class="preview-panel">
        <div class="preview-toggle" role="group" aria-label="Preview mode">
          <button class="mini-button ${this.previewMode==="exterior"?"is-selected":""}" type="button" data-preview-mode="exterior">Exterior</button>
          <button class="mini-button ${this.previewMode==="interior"?"is-selected":""}" type="button" data-preview-mode="interior">Interior</button>
        </div>
        <div class="cockpit-feature-list">
          <span>${t.visibility}</span>
          <span>${t.dashboardStyle}</span>
          <span>${t.drivingFeel}</span>
        </div>
      </div>
    `}renderCustomization(e){const t=this.customizationManager.getOptions(),i=this.customizationManager.getCarCustomization(e.id),n=(r,a,o)=>`
      <label class="custom-row">
        <span>${r}</span>
        <select data-customize="${a}">
          ${o.map(c=>{const l=!this.customizationManager.isUnlocked(c);return`<option value="${c.id}" ${i[a]===c.id?"selected":""} ${l?"disabled":""}>${c.name}${l?` - ${c.unlockLevel}`:""}</option>`}).join("")}
        </select>
      </label>
    `;return`
      <div class="custom-panel">
        <p class="garage-section-title">Customization</p>
        ${n("Paint","paint",t.paints)}
        ${n("Accent","accent",t.accents)}
        ${n("Wheels","wheels",t.wheels)}
        ${n("Boost","boostTrail",t.boostTrails)}
        ${n("Glass","tint",t.tints)}
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
    `}renderInfoPanel(){const e=this.saveManager.data,t=rn(this.selectedId);if(this.infoPanel==="career")return this.renderCareerPanel();if(this.infoPanel==="world")return this.renderWorldPanel();if(this.infoPanel==="mastery")return this.renderMasteryPanel(t);if(this.infoPanel==="tuning")return this.renderTuningPanel(t);if(this.infoPanel==="stats")return`
        <p class="garage-section-title">Local Stats</p>
        <div class="mini-grid">
          <span>Distance <strong>${Math.round(e.stats.totalDistance)} m</strong></span>
          <span>Coins <strong>${e.totalCoins}</strong></span>
          <span>Missions <strong>${e.stats.missionsCompleted}</strong></span>
          <span>Crashes <strong>${e.stats.totalCrashes}</strong></span>
          <span>Drift <strong>${Math.round(e.stats.totalDriftScore)}</strong></span>
          <span>License <strong>${an(e.license.xp).name}</strong></span>
        </div>
      `;if(this.infoPanel==="achievements"){const r=["first-drive","first-delivery","first-drift","first-parking","landmark-hunter","clean-driver","highway-racer","smooth-taxi","gold-time-trial","horizon-driver"];return`
        <p class="garage-section-title">Achievements - ${Object.keys(e.achievements).length}</p>
        <div class="passport-list">
          ${r.map(a=>`<span class="${e.achievements[a]?"is-unlocked":""}">${e.achievements[a]?"Unlocked":"Locked"} - ${a.replaceAll("-"," ")}</span>`).join("")}
        </div>
      `}if(this.infoPanel==="help")return`
        <p class="garage-section-title">Quick Help</p>
        <div class="passport-list">
          ${Xg.map(r=>`<span><strong>${r.title}</strong><br>${r.copy}</span>`).join("")}
        </div>
      `;const i=["central-tower","park-fountain","highway-bridge","market-gate","residential-square","hill-viewpoint","city-hall","airport-terminal","giant-airplane","industrial-depot","river-corridor"];return`
      <p class="garage-section-title">City Passport - ${Object.keys(e.discoveries.landmarks).length}/${i.length}</p>
      <div class="passport-list">
        ${i.map(r=>`<span class="${e.discoveries.landmarks[r]?"is-unlocked":""}">${e.discoveries.landmarks[r]?"Discovered":"Locked"} - ${r.replaceAll("-"," ")}</span>`).join("")}
      </div>
    `}renderMasteryPanel(e){const t=this.masteryManager.getMastery(e.id),i=Object.entries(t.bestMissions??{}).slice(0,4);return`
      <p class="garage-section-title">Car Mastery - ${t.level.name}</p>
      <div class="license-strip">
        <span>${t.level.name}</span>
        <span class="stat-track"><span class="stat-fill" style="width:${t.level.progress*100}%"></span></span>
        <strong>${Math.round(t.xp)} XP</strong>
      </div>
      <div class="passport-list">
        <span>Next reward: <strong>${t.level.next?.nextReward??"Mastered local badge"}</strong></span>
        <span>Next level: <strong>${t.level.next?.name??"Complete"}</strong></span>
        ${i.length?i.map(([n,r])=>`<span>${n.replaceAll("-"," ")} <strong>${r}</strong></span>`).join(""):"<span>No car-specific mission bests yet.</span>"}
      </div>
    `}renderWorldPanel(){return`
      <p class="garage-section-title">Expanded Phase 4 World</p>
      <div class="passport-list">
        <span><strong>Highway Ring</strong><br>Long multi-lane routes, bridges, ramps, and speed trials.</span>
        <span><strong>Airport Zone</strong><br>Terminal roads, runway straight, service loop, hangars, and a huge airliner landmark.</span>
        <span><strong>Industrial Depot</strong><br>Warehouses, cargo yards, containers, and heavy delivery routes.</span>
        <span><strong>Bridge Corridor</strong><br>River crossing and elevated expressway sections for longer drives.</span>
        ${Ji.map(e=>`<span>${e.name} <strong>${e.reward} coins</strong></span>`).join("")}
      </div>
    `}renderTuningPanel(e){const t=this.tuningManager.getTuning(e.id);return`
      <p class="garage-section-title">Vehicle Tuning - ${this.saveManager.data.totalCoins} coins</p>
      <div class="tuning-list">
        ${sr.map(i=>{const n=this.tuningManager.getCategoryState(e.id,i.id),r=t[i.id]??0;return`
            <div class="tuning-row">
              <span>${i.label}</span>
              <span class="stat-track"><span class="stat-fill" style="width:${r/Math.max(1,n.max)*100}%"></span></span>
              <strong>${r}/${n.max}</strong>
              <button class="mini-button" type="button" data-tune="${i.id}" ${n.canUpgrade?"":"disabled"}>${n.canUpgrade?`${n.cost}`:"Max"}</button>
            </div>
          `}).join("")}
      </div>
      <button class="secondary-button mini-button" type="button" data-reset-tuning>Reset tuning</button>
    `}renderCareerPanel(){return`
      <p class="garage-section-title">Career Mode</p>
      <div class="career-list">
        ${this.careerManager.getPaths().map(t=>`
          <div class="career-path">
            <strong>${t.name}</strong>
            <span>${t.description}</span>
            ${t.missions.map(i=>`
              <button class="secondary-button mission-button" type="button" data-career="${i.id}" data-mission="${i.missionId}" ${i.unlocked?"":"disabled"}>
                <span>${i.title}</span>
                <span>${i.completed?i.completed.medal??"Done":i.unlocked?"Start":"Locked"}</span>
              </button>
            `).join("")}
          </div>
        `).join("")}
      </div>
    `}rebuildPreview(){this.previewCar&&(this.previewRoot.remove(this.previewCar),this.disposeObject(this.previewCar));const e=rn(this.selectedId),t=this.customizationManager.getCarCustomization(e.id),i=this.customizationManager.resolveVisualColors(e,t);this.previewCar=this.vehicleFactory.createCarMesh(e,{preview:!0,customization:{body:i.body,accent:i.accent,tintOpacity:i.tintOpacity,boostTrail:i.boostTrail,wheelStyle:t.wheels}}),this.previewCar.position.y=.02,this.previewRoot.add(this.previewCar),this.previewCar.visible=this.previewMode==="exterior",this.cockpitPreview.setVisible(this.previewMode==="interior")}disposeObject(e){e.traverse(t=>{t.isMesh&&t.geometry?.dispose?.()})}show(){this.el.classList.remove("is-hidden"),this.rebuild()}hide(){this.el.classList.add("is-hidden")}update(e,t){this.el.classList.contains("is-hidden")||(this.previewCar&&(this.previewCar.rotation.y+=e*.42,this.previewCar.visible=this.previewMode==="exterior",this.previewCar.userData.wheels?.forEach(i=>{i.tire.rotation.x+=e*.8})),this.previewMode==="interior"?this.cockpitPreview.updatePreview(e,rn(this.selectedId)):this.cockpitPreview.setVisible(!1),this.previewCamera.aspect=t.width/t.height,this.previewCamera.updateProjectionMatrix())}render(e){e.render(this.previewScene,this.previewCamera)}}const Jg=s=>JSON.parse(JSON.stringify(s));class Qg{constructor(e,t={}){this.saveManager=e,this.callbacks=t}getTuning(e){return this.saveManager.getCarTuning(e)}getCategoryState(e,t){const i=sr.find(c=>c.id===t),n=this.getTuning(e),r=qg[e]??{},a=n[t]??0,o=r[t]??3;return{category:i,level:a,max:o,cost:Yg(a),canUpgrade:!!i&&a<o}}upgrade(e,t){const i=this.getCategoryState(e,t);if(!i.category)return{ok:!1,reason:"Unknown tuning category"};if(!i.canUpgrade)return{ok:!1,reason:"Tuning cap reached"};if(!this.saveManager.spendCoins(i.cost))return{ok:!1,reason:"Not enough coins"};const n=this.getTuning(e);return n[t]=i.level+1,this.saveManager.setCarTuning(e,n),this.callbacks.onUpgrade?.(e,i.category,n[t]),{ok:!0,level:n[t],cost:i.cost}}reset(e){this.saveManager.setCarTuning(e,Ka())}getEffectiveConfig(e,t={}){const i=Jg(e),n=this.getTuning(e.id);return sr.forEach(r=>{const a=n[r.id]??0;if(!a)return;const o=1+r.step*a,c=r.physicsKey;i.physics[c]=Math.max(.1,i.physics[c]*o),i.stats[r.stat]=Math.min(100,Math.round(i.stats[r.stat]+a*3.6))}),t.accelerationMultiplier&&(i.physics.acceleration*=t.accelerationMultiplier),i.tuning=n,i}}class ev{constructor(e){this.root=e,this.keys=new Set,this.once=new Set,this.touchState={accelerate:!1,brake:!1,left:!1,right:!1,handbrake:!1,boost:!1},this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp)}onKeyDown(e){const t=this.normalize(e.key);this.keys.has(t)||this.once.add(t),this.keys.add(t),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(t)&&e.preventDefault()}onKeyUp(e){this.keys.delete(this.normalize(e.key))}normalize(e){return e===" "?"Space":e.length===1?e.toLowerCase():e}consume(e){const t=this.normalize(e),i=this.once.has(t);return this.once.delete(t),i}isDown(...e){return e.some(t=>this.keys.has(this.normalize(t)))}bindTouchButton(e,t){const i=n=>{this.touchState[t]=n};e.addEventListener("pointerdown",n=>{n.preventDefault(),e.setPointerCapture?.(n.pointerId),i(!0)}),e.addEventListener("pointerup",()=>i(!1)),e.addEventListener("pointercancel",()=>i(!1)),e.addEventListener("lostpointercapture",()=>i(!1))}getDrivingInput(){const e=this.isDown("w","ArrowUp")||this.touchState.accelerate,t=this.isDown("s","ArrowDown")||this.touchState.brake,i=this.isDown("a","ArrowLeft")||this.touchState.left,n=this.isDown("d","ArrowRight")||this.touchState.right;return{throttle:e?1:0,brake:t?1:0,steer:(i?1:0)+(n?-1:0),handbrake:this.isDown("Space")||this.touchState.handbrake,boost:this.isDown("Shift")||this.touchState.boost}}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp)}}class tv{constructor(e,t,i,n=null){this.scene=e,this.saveManager=t,this.audioManager=i,this.surfaceResolver=n,this.group=new ft,this.group.name="Mission Markers",this.scene.add(this.group),this.active=null,this.pendingResult=null,this.marker=this.createMarker("#f0c766"),this.secondaryMarker=this.createMarker("#5ec6ff"),this.zoneMarker=this.createZoneMarker("#62d28f"),this.group.add(this.marker,this.secondaryMarker,this.zoneMarker),this.hideMarkers()}createMarker(e){const t=new ft,i=new L(new Yt(3.4,.12,10,54),new Et({color:e,transparent:!0,opacity:.86}));i.rotation.x=Math.PI*.5;const n=new L(new mt(.12,.12,5.4,12),new Et({color:e,transparent:!0,opacity:.38}));return n.position.y=2.7,t.add(i,n),t.visible=!1,t}createZoneMarker(e){const t=new ft;return t.userData.material=new Et({color:e,transparent:!0,opacity:.28}),t.visible=!1,t}rebuildZoneMarker(e,t="#62d28f"){this.zoneMarker.clear(),this.zoneMarker.userData.material=new Et({color:t,transparent:!0,opacity:.28});const i=new L(new W(e.size[0],.08,e.size[1]),this.zoneMarker.userData.material);i.position.y=.12,this.zoneMarker.add(i);const n=new je({color:"#f28f38",roughness:.5});[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([r,a])=>{const o=new L(new hs(.42,1.1,12),n);o.position.set(r*e.size[0]*.55,.55,a*e.size[1]*.55),o.castShadow=!0,this.zoneMarker.add(o)}),this.zoneMarker.position.set(e.center[0],this.getSurfaceHeightForPoint(e.center)+.02,e.center[1]),this.zoneMarker.rotation.y=e.rotation}getSurfaceHeightForPoint(e){return this.surfaceResolver?.getSurfaceInfo?this.surfaceResolver.getSurfaceInfo(new C(e[0],0,e[1]),null,{preferElevated:!0})?.surfaceHeight??0:0}placePointMarker(e,t,i=.12){e.position.set(t[0],this.getSurfaceHeightForPoint(t)+i,t[1])}hideMarkers(){this.marker.visible=!1,this.secondaryMarker.visible=!1,this.zoneMarker.visible=!1}start(e,t={}){if(this.pendingResult=null,e==="freeDrive")return this.active=null,this.hideMarkers(),null;const i=vo(e)??$a[e]??$a.timeTrial,n=i.timer??(i.medalTimes?.Bronze??75)+25;return this.active={id:i.id,type:i.type,config:i,timer:n,elapsed:0,phase:["delivery","taxi"].includes(i.type)?"pickup":"running",checkpointIndex:0,condition:100,comfort:100,collisions:0,hold:0,score:0,driftScore:0,multiplier:1,comboBreak:"",completed:!1,failed:!1,resets:0,context:t,lastCollisionPulse:0,lastMessagePulse:0},this.updateMarkers(),i.start}noteReset(){this.active&&(this.active.resets+=1)}update(e,t,i){if(!this.active)return this.getFreeDriveHud();const n=this.active;if(n.timer-=e,n.elapsed+=e,n.lastCollisionPulse=Math.max(0,n.lastCollisionPulse-e),n.lastMessagePulse=Math.max(0,n.lastMessagePulse-e),i.collisionIntensity>.35&&n.lastCollisionPulse<=0&&(n.collisions+=1,n.lastCollisionPulse=.8,n.type==="delivery"&&(n.condition=Math.max(0,n.condition-n.config.crashDamage)),n.type==="taxi"&&(n.comfort=Math.max(0,n.comfort-n.config.comfortLoss)),n.type==="drift"&&(n.multiplier=1,n.comboBreak="Combo broken")),n.type==="timeTrial"&&this.updateTimeTrial(t,n),n.type==="delivery"&&this.updateDelivery(e,t,i,n),n.type==="parking"&&this.updateParking(e,t,n),n.type==="drift"&&this.updateDrift(e,t,i,n),n.type==="taxi"&&this.updateTaxi(e,t,i,n),this.pendingResult){const r=this.pendingResult;return this.pendingResult=null,{result:r}}return n.timer<=0?n.type==="drift"&&n.driftScore>=n.config.targetScore?this.complete("Target score reached"):this.fail("Timer ended"):n.type==="delivery"&&n.condition<=0?this.fail("Package condition reached 0"):n.type==="taxi"&&n.comfort<=0?this.fail("Passenger comfort reached 0"):(this.pulseMarkers(e),this.getHudData(t.position))}updateTimeTrial(e,t){const i=t.config.checkpoints[t.checkpointIndex];hi([e.position.x,e.position.z],i)<5.5&&(this.audioManager.play("checkpoint",.9),t.checkpointIndex+=1,t.score+=80,t.checkpointIndex>=t.config.checkpoints.length?this.complete("Route cleared"):this.updateMarkers())}updateDelivery(e,t,i,n){i.offRoad&&i.speed>8&&(n.condition=Math.max(0,n.condition-n.config.roughDamagePerSecond*e));const r=n.phase==="pickup"?n.config.pickup:n.config.destination;hi([t.position.x,t.position.z],r)<5.8&&(n.phase==="pickup"?(n.phase="deliver",this.audioManager.play("checkpoint",.9),this.updateMarkers()):this.complete("Package delivered"))}updateTaxi(e,t,i,n){!i.drifting&&i.collisionIntensity<.05&&i.speed>4&&i.speed<24&&(n.comfort=Math.min(100,n.comfort+e*1.2),n.score+=e*7);const r=n.phase==="pickup"?n.config.pickup:n.config.destination;if(hi([t.position.x,t.position.z],r)<5.8&&(n.phase==="pickup"?(n.phase="ride",this.audioManager.play("checkpoint",.9),n.comboBreak=n.config.messages?.[0]??"Passenger picked up",this.updateMarkers()):this.complete("Passenger arrived")),n.phase==="ride"&&n.lastMessagePulse<=0){const a=n.config.messages??[];a.length&&(n.comboBreak=a[Math.floor(Math.random()*a.length)]),n.lastMessagePulse=9}}updateParking(e,t,i){const n=i.config.zone,r=new C(n.center[0],0,n.center[1]),a=new C(n.size[0],0,n.size[1]),o=Nn(t.position,r,a,n.rotation),c=t.velocity.length(),l=c<2.2,d=Math.abs(Ql(t.heading,n.rotation)),h=d<.58,u=t.position.distanceTo(r);i.accuracy=dt(100-u*9-d*38-c*7,0,100),o&&l&&h?i.hold+=e:i.hold=Math.max(0,i.hold-e*1.6),i.hold>=n.holdTime&&this.complete("Parked cleanly")}updateDrift(e,t,i,n){const r=n.config.zone,a=new C(r.center[0],0,r.center[1]),o=new C(r.size[0],0,r.size[1]),c=Nn(t.position,a,o,r.rotation);if(n.insideZone=c,!c){n.multiplier=Math.max(1,n.multiplier-e*.8);return}if(i.drifting){n.multiplier=dt(n.multiplier+e*.22,1,4);const l=i.driftScore*(1.8+i.speedRatio*2.2)*n.multiplier;n.driftScore+=l,n.score+=l}else n.multiplier=Math.max(1,n.multiplier-e*.35);n.driftScore>=n.config.targetScore&&this.complete("Drift target cleared")}complete(e){if(!this.active||this.active.completed)return this.getHudData();const t=this.active;t.completed=!0;const i=this.createResult(!0,e),n=this.saveManager.recordMission(t.id,i.score,i.coinsEarned,{type:t.type,success:!0,xp:i.xpEarned,medal:i.medal,timeSeconds:t.type==="timeTrial"?t.elapsed:void 0,carId:t.context?.carId,bonusObjectives:i.bonusObjectives});return i.isBest=n.isBest,i.levelUp=n.levelUp,this.audioManager.play("complete",1),this.hideMarkers(),this.active=null,this.pendingResult=i,{result:i}}fail(e){if(!this.active||this.active.failed)return this.getHudData();const t=this.createResult(!1,e);return this.audioManager.play("fail",1),this.hideMarkers(),this.active=null,this.pendingResult=t,{result:t}}createResult(e,t){const i=this.active,n=Math.max(0,i.timer),r=i.type==="timeTrial"&&e?bg(i.config,i.elapsed):null;let a=e?i.config.reward*4:90;a+=n*6,a-=i.collisions*55,i.type==="timeTrial"&&(a+=i.checkpointIndex*80+(r==="S"?240:r==="Gold"?180:r==="Silver"?90:40)),i.type==="delivery"&&(a+=i.condition*4),i.type==="taxi"&&(a+=i.comfort*4),i.type==="parking"&&(a+=(i.accuracy??0)*5),i.type==="drift"&&(a+=i.driftScore*.45);const o=this.evaluateBonusObjectives(i,e),c=o.filter(f=>f.complete).length;a+=c*45,a=Math.max(0,Math.round(a));const l=wg(a),d=e?Math.max(15,Math.round(a/18)+c*4):Math.round(a/40),h=this.saveManager.data.bestScores[i.id]??0,u=e?i.config.xp+Math.round(a/30)+c*10:Math.round((i.config.xp??60)*.25);return{missionId:i.id,missionType:i.type,missionName:i.config.name,routeId:i.id,success:e,reason:t,time:ts(i.elapsed),remaining:ts(n),timeSeconds:i.elapsed,score:a,rank:l,medal:r,xpEarned:u,coinsEarned:d,bestBefore:h,isBest:a>h,collisions:i.collisions,condition:Math.round(i.condition),comfort:Math.round(i.comfort),driftScore:Math.round(i.driftScore),bonusObjectives:o,masteryXp:0,newUnlocks:[],checkpointProgress:i.type==="timeTrial"?`${i.checkpointIndex}/${i.config.checkpoints.length}`:null}}evaluateBonusObjectives(e,t){const i=[{id:"no-major-crash",label:"No major crash",complete:t&&e.collisions===0},{id:"recommended-car",label:`Use recommended car: ${e.config.recommendedCar??"Any"}`,complete:t&&(!e.config.recommendedCar||e.context?.carName===e.config.recommendedCar||e.context?.shortName===e.config.recommendedCar)},{id:"no-reset",label:"Complete without reset",complete:t&&e.resets===0}];return e.type==="timeTrial"&&i.push({id:"target-time",label:`Finish under ${ts(e.config.medalTimes?.Gold??e.timer)}`,complete:t&&e.elapsed<=(e.config.medalTimes?.Gold??1/0)}),e.type==="delivery"&&i.push({id:"condition-80",label:"Keep package above 80%",complete:t&&e.condition>=80}),e.type==="taxi"&&i.push({id:"comfort-90",label:"Keep comfort above 90%",complete:t&&e.comfort>=90}),e.type==="parking"&&i.push({id:"accuracy-95",label:"Park with 95% accuracy",complete:t&&(e.accuracy??0)>=95}),e.type==="drift"&&i.push({id:"drift-target-plus",label:"Beat drift target by 20%",complete:t&&e.driftScore>=e.config.targetScore*1.2}),i}updateMarkers(){if(this.hideMarkers(),!this.active)return;const e=this.active;if(e.type==="timeTrial"){const t=e.config.checkpoints[e.checkpointIndex];this.marker.visible=!0,this.placePointMarker(this.marker,t)}if(e.type==="delivery"||e.type==="taxi"){const t=e.config.pickup,i=e.config.destination;this.marker.visible=e.phase==="pickup",this.placePointMarker(this.marker,t),this.secondaryMarker.visible=e.phase!=="pickup",this.placePointMarker(this.secondaryMarker,i)}e.type==="parking"&&(this.rebuildZoneMarker(e.config.zone,"#62d28f"),this.zoneMarker.visible=!0),e.type==="drift"&&(this.rebuildZoneMarker(e.config.zone,"#f0c766"),this.zoneMarker.visible=!0)}pulseMarkers(e){[this.marker,this.secondaryMarker,this.zoneMarker].forEach(t=>{if(!t.visible)return;const i=1+Math.sin(performance.now()*.005)*.08;t.scale.setScalar(i),t.rotation.y+=e*.35})}getTargetPosition(){if(!this.active)return null;const e=this.active;return e.type==="timeTrial"?e.config.checkpoints[e.checkpointIndex]:e.type==="delivery"||e.type==="taxi"?e.phase==="pickup"?e.config.pickup:e.config.destination:e.type==="parking"||e.type==="drift"?e.config.zone.center:null}getHudData(e=null){if(!this.active)return this.getFreeDriveHud();const t=this.active,i=this.getTargetPosition(),n=e&&i?Math.round(hi([e.x,e.z],i)):0,r={active:!0,missionType:t.type,mode:t.config.name,objective:t.config.description,timer:ts(t.timer),distance:n,condition:null,comfort:null,progress:null,accuracy:null,driftScore:null,multiplier:null,combo:t.comboBreak,target:i};if(t.type==="timeTrial"&&(r.progress=`${t.checkpointIndex+1}/${t.config.checkpoints.length}`,r.objective=`Reach checkpoint ${r.progress}`),t.type==="delivery"&&(r.condition=dt(t.condition,0,100),r.objective=t.phase==="pickup"?`Collect ${t.config.name}`:`Deliver ${t.config.name}`),t.type==="taxi"&&(r.comfort=dt(t.comfort,0,100),r.objective=t.phase==="pickup"?"Pick up passenger":"Drive smoothly to destination"),t.type==="parking"){const a=dt(t.hold/t.config.zone.holdTime,0,1);r.accuracy=t.accuracy??a*100,r.objective="Stop aligned inside the parking outline"}return t.type==="drift"&&(r.driftScore=Math.round(t.driftScore),r.multiplier=t.multiplier,r.progress=`${Math.round(t.driftScore)}/${t.config.targetScore}`,r.objective=t.insideZone?"Hold angle inside the drift zone":"Enter the marked drift zone"),r}getFreeDriveHud(){return{active:!1,missionType:"freeDrive",mode:"Free Drive",objective:"Explore districts, collect tokens, discover landmarks, career tasks, or Phase 4 routes.",timer:null,distance:null,condition:null,comfort:null,progress:null,accuracy:null,driftScore:null,multiplier:null,combo:null,target:null}}}const nd=[{id:"first-drive",name:"First Drive",description:"Drive your first 500 meters.",coins:20,xp:45},{id:"first-delivery",name:"First Delivery",description:"Complete any delivery run.",coins:35,xp:70},{id:"first-drift",name:"First Drift",description:"Score 500 total drift points.",coins:30,xp:70},{id:"first-parking",name:"First Parking",description:"Complete a parking challenge.",coins:30,xp:60},{id:"landmark-hunter",name:"Landmark Hunter",description:"Discover five landmarks.",coins:60,xp:110},{id:"clean-driver",name:"Clean Driver",description:"Drive 2 km with calm control.",coins:50,xp:100},{id:"highway-racer",name:"Highway Racer",description:"Earn Gold or better on a highway time trial.",coins:55,xp:110},{id:"perfect-parking",name:"Perfect Parking",description:"Finish parking with A rank or better.",coins:55,xp:110},{id:"smooth-taxi",name:"Smooth Taxi",description:"Complete a taxi ride with 80% comfort or higher.",coins:55,xp:100},{id:"gold-time-trial",name:"Gold Time Trial",description:"Earn a Gold medal on any time trial.",coins:70,xp:130},{id:"horizon-driver",name:"Horizon Driver",description:"Reach the Horizon Driver license level.",coins:100,xp:0}];class iv{constructor(e,t={}){this.saveManager=e,this.callbacks=t}evaluate(e={}){const t=[],i=this.saveManager.data,n=Object.keys(i.discoveries.landmarks).length,r=Object.values(i.medals),a=e.missionType??e.type,o={"first-drive":i.stats.totalDistance>=500,"first-delivery":i.stats.deliveriesCompleted>=1||a==="delivery","first-drift":i.stats.totalDriftScore>=500||a==="drift","first-parking":i.stats.parkingCompleted>=1||a==="parking","landmark-hunter":n>=5,"clean-driver":i.stats.totalCleanDistance>=2e3,"highway-racer":["highway-blast","bridge-ring-run","airport-express-sprint"].includes(e.routeId)&&["Gold","S"].includes(e.medal),"perfect-parking":a==="parking"&&["A","S"].includes(e.rank),"smooth-taxi":a==="taxi"&&(e.comfort??0)>=80,"gold-time-trial":r.includes("Gold")||r.includes("S")||["Gold","S"].includes(e.medal),"horizon-driver":i.license.levelId==="horizon"};return nd.forEach(c=>{if(o[c.id]){const l=this.saveManager.unlockAchievement(c.id);l&&(t.push(l.achievement),this.callbacks.onAchievement?.(l.achievement),l.levelUp&&this.callbacks.onLevelUp?.(l.levelUp,c.name))}}),t}}const Ws=[{id:"new",name:"New",minXp:0,nextReward:"Factory familiarity"},{id:"familiar",name:"Familiar",minXp:260,nextReward:"Car-specific plate badge"},{id:"skilled",name:"Skilled",minXp:760,nextReward:"Extra tuning cap"},{id:"expert",name:"Expert",minXp:1500,nextReward:"Premium rim finish"},{id:"mastered",name:"Mastered",minXp:2600,nextReward:"Mastered local badge"}],bi={distancePerMeter:.035,cleanDistancePerMeter:.02,driftPoint:.025,missionComplete:150,medalS:180,medalGold:130,medalSilver:80,parkingSuccess:90,deliveryTaxiSuccess:100},Kc=s=>{let e=Ws[0];for(const n of Ws)s>=n.minXp&&(e=n);const t=Ws.findIndex(n=>n.id===e.id),i=Ws[t+1]??null;return{...e,index:t,next:i,progress:i?Math.min(1,(s-e.minXp)/(i.minXp-e.minXp)):1}};class nv{constructor(e,t={}){this.saveManager=e,this.callbacks=t,this.distanceBuffer={}}getMastery(e){const t=this.saveManager.getCarMastery(e);return{...t,level:Kc(t.xp)}}awardDriving(e,t){if(!e||!t)return null;const i=t.collisionIntensity<.05,n=t.distanceTravelled*(bi.distancePerMeter+(i?bi.cleanDistancePerMeter:0)),r=t.driftScore*bi.driftPoint,a=n+r;if(this.distanceBuffer[e]=(this.distanceBuffer[e]??0)+a,this.distanceBuffer[e]<5)return null;const o=this.distanceBuffer[e];return this.distanceBuffer[e]=0,this.addXp(e,o,"driving")}awardMission(e,t){if(!e||!t?.success)return null;let i=bi.missionComplete;return t.medal==="S"&&(i+=bi.medalS),t.medal==="Gold"&&(i+=bi.medalGold),t.medal==="Silver"&&(i+=bi.medalSilver),t.missionType==="parking"&&(i+=bi.parkingSuccess),(t.missionType==="delivery"||t.missionType==="taxi")&&(i+=bi.deliveryTaxiSuccess),i+=Math.min(160,Math.round((t.driftScore??0)*.03)),this.addXp(e,i,"mission")}addXp(e,t,i="bonus"){const n=this.getMastery(e).level,r=this.saveManager.addCarMasteryXp(e,t),a=Kc(r.xp);return n.id!==a.id&&this.callbacks.onLevelUp?.(e,a,i),{amount:Math.round(t),level:a,totalXp:r.xp}}}class sv{constructor(e,t={}){this.saveManager=e,this.callbacks=t}getLicense(){return an(this.saveManager.data.license.xp)}awardXP(e,t="Driving XP"){const i=this.saveManager.addXP(e);return i&&this.callbacks.onLevelUp?.(i,t),i}awardCleanDistance(e){const t=Math.floor(this.saveManager.data.stats.totalCleanDistance/500),i=`clean-distance-${t}`;return t>0&&!this.saveManager.data.license.levelUpsSeen[i]?(this.saveManager.data.license.levelUpsSeen[i]=!0,this.awardXP(Vg.cleanDrivingChunk,"Clean driving")):null}}class rv{constructor(e){this.saveManager=e,this.lastCrashPulse=0}updateDriving(e,t){const i=t.collisionIntensity<.1&&!t.offRoad;return this.saveManager.addDistance(t.distanceTravelled,i),t.driftScore>.1&&this.saveManager.addDriftScore(t.driftScore),this.lastCrashPulse=Math.max(0,this.lastCrashPulse-e),t.collisionIntensity>.55&&this.lastCrashPulse<=0?(this.saveManager.addCrash(),this.lastCrashPulse=1,!0):!1}}const jc="mini-city-drive:v0.5",av="mini-city-drive:v0.4",ov="mini-city-drive:v0.3",cv="mini-city-drive:v0.2",lv="mini-city-drive:v0.1",sd={masterVolume:.72,engineVolume:.72,tireVolume:.62,uiVolume:.7,ambienceVolume:.42,cameraShake:"normal",trafficDensity:"low",visualQuality:"medium",minimap:!0,uiScale:"normal",touchControls:"auto",cameraMode:"standard",cockpitMotion:"normal",cockpitHud:"minimal",cockpitFov:"normal",mirrorRendering:"geometry",dashboardBrightness:.9,cockpitHintSeen:!1,debugOverlay:!1},jn=()=>({version:5,totalCoins:0,selectedCar:"hatchback",license:{xp:0,levelId:"rookie",levelUpsSeen:{}},completedMissions:{},bestScores:{},bestTimes:{},medals:{},discoveries:{landmarks:{},districts:{},hiddenTokens:{}},discoveredLandmarks:{},collectedCoins:{},achievements:{},customizations:{},carMastery:{},carTuning:{},career:{completed:{},activeCareerMission:null,pathProgress:{}},bonusObjectives:{},cityEvents:{completed:{},lastEventId:null},freeDriveTasks:{completed:{},activeTaskId:null,progress:{}},debugSettings:{overlay:!1},stats:{totalDistance:0,totalCleanDistance:0,totalCrashes:0,totalDriftScore:0,totalCoinsCollected:0,missionsCompleted:0,deliveriesCompleted:0,taxiRidesCompleted:0,parkingCompleted:0,timeTrialsCompleted:0,driftZonesCompleted:0,favoriteCarUse:{},favoriteCar:"hatchback",highestLicenseLevel:"rookie"},onboardingComplete:!1,settings:sd}),dv=s=>JSON.parse(JSON.stringify(s));class hv{constructor(){this.data=this.load()}load(){try{const e=localStorage.getItem(jc);if(e)return this.mergeDefaults(JSON.parse(e));const t=localStorage.getItem(av);if(t){const a=this.migrateV4(JSON.parse(t));return this.data=a,this.persist(),a}const i=localStorage.getItem(ov);if(i){const a=this.migrateV3(JSON.parse(i));return this.data=a,this.persist(),a}const n=localStorage.getItem(cv);if(n){const a=this.migrateV2(JSON.parse(n));return this.data=a,this.persist(),a}const r=localStorage.getItem(lv);if(r){const a=this.migrateV1(JSON.parse(r));return this.data=a,this.persist(),a}}catch{return jn()}return jn()}migrateV4(e){return this.mergeDefaults({...e,version:5})}migrateV3(e){return this.mergeDefaults({...e,version:5})}migrateV2(e){return this.mergeDefaults({...e,version:5})}migrateV1(e){const t=jn();return t.totalCoins=Number(e.totalCoins??0),t.selectedCar=e.selectedCar??t.selectedCar,t.completedMissions={...e.completedMissions??{}},t.bestScores={...e.bestScores??{}},t.discoveries.landmarks={...e.discoveredLandmarks??{}},t.discoveredLandmarks={...e.discoveredLandmarks??{}},t.collectedCoins={...e.collectedCoins??{}},t.stats.totalDistance=Number(e.totalDistance??0),t.stats.totalDriftScore=Number(e.totalDriftScore??0),t.settings=this.normalizeSettings(e.settings??{}),this.mergeDefaults(t)}mergeDefaults(e){const t=jn(),i={...t,...e,license:{...t.license,...e.license??{}},completedMissions:{...t.completedMissions,...e.completedMissions??{}},bestScores:{...t.bestScores,...e.bestScores??{}},bestTimes:{...t.bestTimes,...e.bestTimes??{}},medals:{...t.medals,...e.medals??{}},discoveries:{landmarks:{...t.discoveries.landmarks,...e.discoveries?.landmarks??e.discoveredLandmarks??{}},districts:{...t.discoveries.districts,...e.discoveries?.districts??{}},hiddenTokens:{...t.discoveries.hiddenTokens,...e.discoveries?.hiddenTokens??{}}},discoveredLandmarks:{...t.discoveredLandmarks,...e.discoveredLandmarks??e.discoveries?.landmarks??{}},collectedCoins:{...t.collectedCoins,...e.collectedCoins??{}},achievements:{...t.achievements,...e.achievements??{}},customizations:{...t.customizations,...e.customizations??{}},carMastery:{...t.carMastery,...e.carMastery??{}},carTuning:{...t.carTuning,...e.carTuning??{}},career:{completed:{...t.career.completed,...e.career?.completed??{}},activeCareerMission:e.career?.activeCareerMission??null,pathProgress:{...t.career.pathProgress,...e.career?.pathProgress??{}}},bonusObjectives:{...t.bonusObjectives,...e.bonusObjectives??{}},cityEvents:{completed:{...t.cityEvents.completed,...e.cityEvents?.completed??{}},lastEventId:e.cityEvents?.lastEventId??null},freeDriveTasks:{completed:{...t.freeDriveTasks.completed,...e.freeDriveTasks?.completed??{}},activeTaskId:e.freeDriveTasks?.activeTaskId??null,progress:{...t.freeDriveTasks.progress,...e.freeDriveTasks?.progress??{}}},debugSettings:{...t.debugSettings,...e.debugSettings??{}},stats:{...t.stats,...e.stats??{}},settings:this.normalizeSettings(e.settings??{})};return i.license.levelId=an(i.license.xp).id,i.version=5,i.stats.favoriteCar=this.getFavoriteCarFromStats(i.stats.favoriteCarUse,i.selectedCar),i}normalizeSettings(e){const t={...sd,...e};return typeof t.cameraShake=="boolean"&&(t.cameraShake=t.cameraShake?"normal":"off"),t.radar!==void 0&&t.minimap===void 0&&(t.minimap=!!t.radar),["off","low","medium","high"].includes(t.trafficDensity)||(t.trafficDensity="low"),["off","low","normal"].includes(t.cameraShake)||(t.cameraShake="normal"),["standard","far","hood","cockpit"].includes(t.cameraMode)||(t.cameraMode="standard"),["off","low","normal"].includes(t.cockpitMotion)||(t.cockpitMotion="normal"),["minimal","normal"].includes(t.cockpitHud)||(t.cockpitHud="minimal"),["low","normal","wide"].includes(t.cockpitFov)||(t.cockpitFov="normal"),["off","geometry"].includes(t.mirrorRendering)||(t.mirrorRendering="geometry"),t.dashboardBrightness=Math.min(1.2,Math.max(.35,Number(t.dashboardBrightness??.9))),t.cockpitHintSeen=!!t.cockpitHintSeen,t}getFavoriteCarFromStats(e,t){let i=t,n=-1;return Object.entries(e??{}).forEach(([r,a])=>{a>n&&(i=r,n=a)}),i}persist(){try{localStorage.setItem(jc,JSON.stringify(this.data))}catch{}}get settings(){return this.data.settings}updateSettings(e){this.data.settings=this.normalizeSettings({...this.data.settings,...e}),this.data.debugSettings.overlay=!!this.data.settings.debugOverlay,this.persist()}setSelectedCar(e){this.data.selectedCar=e,this.data.stats.favoriteCarUse[e]=(this.data.stats.favoriteCarUse[e]??0)+1,this.data.stats.favoriteCar=this.getFavoriteCarFromStats(this.data.stats.favoriteCarUse,e),this.persist()}getCustomization(e){return{...Za,...this.data.customizations[e]??{}}}setCustomization(e,t){this.data.customizations[e]={...this.getCustomization(e),...t},this.persist()}resetCustomization(e){this.data.customizations[e]=dv(Za),this.persist()}getCarTuning(e){return{...Ka(),...this.data.carTuning[e]??{}}}setCarTuning(e,t){this.data.carTuning[e]={...this.getCarTuning(e),...t},this.persist()}resetCarTuning(e){this.data.carTuning[e]=Ka(),this.persist()}spendCoins(e){const t=Math.max(0,Math.round(e));return this.data.totalCoins<t?!1:(this.data.totalCoins-=t,this.persist(),!0)}addCoins(e){const t=Math.max(0,Math.round(e));return this.data.totalCoins+=t,this.data.stats.totalCoinsCollected+=t,this.persist(),t}addXP(e){const t=Math.max(0,Math.round(e));if(!t)return null;const i=an(this.data.license.xp);this.data.license.xp+=t;const n=an(this.data.license.xp);return this.data.license.levelId=n.id,this.data.stats.highestLicenseLevel=n.id,this.persist(),i.id!==n.id?n:null}collectCoin(e,t,i=1,n=!1){return n&&this.data.collectedCoins[e]?!1:(n&&(this.data.collectedCoins[e]=!0),this.addCoins(t),this.addXP(i),!0)}collectHiddenToken(e,t,i){return this.data.discoveries.hiddenTokens[e]?!1:(this.data.discoveries.hiddenTokens[e]=!0,this.addCoins(t),this.addXP(i),this.persist(),!0)}discoverDistrict(e,t,i){return this.data.discoveries.districts[e]?!1:(this.data.discoveries.districts[e]=!0,this.addCoins(t),this.addXP(i),this.persist(),!0)}discoverLandmark(e,t,i){return this.data.discoveries.landmarks[e]?!1:(this.data.discoveries.landmarks[e]=!0,this.data.discoveredLandmarks[e]=!0,this.addCoins(t),this.addXP(i),this.persist(),!0)}addDistance(e,t=!0){const i=Math.max(0,e);this.data.stats.totalDistance+=i,this.data.totalDistance=this.data.stats.totalDistance,t&&(this.data.stats.totalCleanDistance+=i),i>.01&&this.persist()}addCrash(){this.data.stats.totalCrashes+=1,this.persist()}addDriftScore(e){const t=Math.max(0,Math.round(e));this.data.stats.totalDriftScore+=t,this.data.totalDriftScore=this.data.stats.totalDriftScore,this.persist()}getCarMastery(e){return{xp:0,levelUpsSeen:{},bestMissions:{},...this.data.carMastery[e]??{}}}addCarMasteryXp(e,t){const i=Math.max(0,Math.round(t));if(!i)return this.getCarMastery(e);const n=this.getCarMastery(e);return n.xp+=i,this.data.carMastery[e]=n,this.persist(),n}recordCarMissionBest(e,t,i){const n=this.getCarMastery(e);n.bestMissions[t]=Math.max(n.bestMissions[t]??0,Math.round(i)),this.data.carMastery[e]=n,this.persist()}recordMission(e,t,i,n={}){const r=Math.round(t),a=this.data.bestScores[e]??0;if(this.data.completedMissions[e]=(this.data.completedMissions[e]??0)+1,this.data.bestScores[e]=Math.max(a,r),this.data.stats.missionsCompleted+=n.success===!1?0:1,n.type==="delivery"&&(this.data.stats.deliveriesCompleted+=1),n.type==="taxi"&&(this.data.stats.taxiRidesCompleted+=1),n.type==="parking"&&(this.data.stats.parkingCompleted+=1),n.type==="timeTrial"&&(this.data.stats.timeTrialsCompleted+=1),n.type==="drift"&&(this.data.stats.driftZonesCompleted+=1),typeof n.timeSeconds=="number"){const c=this.data.bestTimes[e];this.data.bestTimes[e]=c===void 0?n.timeSeconds:Math.min(c,n.timeSeconds)}n.medal&&(this.data.medals[e]=n.medal),n.bonusObjectives&&(this.data.bonusObjectives[e]=n.bonusObjectives),n.carId&&this.recordCarMissionBest(n.carId,e,t),this.addCoins(i);const o=this.addXP(n.xp??0);return this.persist(),{isBest:r>a,levelUp:o}}completeCareerMission(e,t={}){const i=!!this.data.career.completed[e];return this.data.career.completed[e]={completedAt:Date.now(),medal:t.medal??null,score:Math.round(t.score??0)},this.persist(),!i}completeCityEvent(e){this.data.cityEvents.completed[e]=(this.data.cityEvents.completed[e]??0)+1,this.data.cityEvents.lastEventId=e,this.persist()}completeFreeDriveTask(e){this.data.freeDriveTasks.completed[e]=!0,this.persist()}unlockAchievement(e){if(this.data.achievements[e])return null;const t=nd.find(n=>n.id===e);if(!t)return null;this.data.achievements[e]={unlockedAt:Date.now()},this.addCoins(t.coins);const i=this.addXP(t.xp);return this.persist(),{achievement:t,levelUp:i}}setOnboardingComplete(e=!0){this.data.onboardingComplete=e,this.persist()}resetProgress(){this.data=jn(),this.persist()}}class uv{constructor(e){this.root=e,this.renderer=new Mg({antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6)),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Qc,this.renderer.outputColorSpace=Xt,this.renderer.toneMapping=Ja,this.renderer.toneMappingExposure=1.05,e.appendChild(this.renderer.domElement),this.scene=new xl,this.scene.background=new et("#bfe9ff"),this.scene.fog=new lo("#dff4ff",190,760),this.camera=new $t(62,1,.1,1200),this.camera.position.set(0,12,-18),this.clock=new bu,this.size={width:1,height:1},this.buildLighting(),this.buildSky(),this.resize()}buildLighting(){const e=new Fl("#e9f8ff","#bfa56e",1.2);this.scene.add(e);const t=new nr("#fff0c8",2.8);t.position.set(-42,78,38),t.castShadow=!0,t.shadow.mapSize.set(2048,2048),t.shadow.camera.left=-330,t.shadow.camera.right=330,t.shadow.camera.top=330,t.shadow.camera.bottom=-330,t.shadow.camera.near=10,t.shadow.camera.far=520,this.scene.add(t);const i=new nr("#d8f3ff",.8);i.position.set(44,38,-32),this.scene.add(i)}buildSky(){const e=new L(new Rt(660,32,16),new Et({color:"#c6ecff",side:zt}));this.scene.add(e);const t=new Et({color:"#ffffff",transparent:!0,opacity:.72,depthWrite:!1}),i=new Rt(1,12,8);[[-184,54,-240],[44,60,-292],[260,50,82],[-250,58,154],[8,68,284],[190,62,-210]].forEach((n,r)=>{const a=new ft;for(let o=0;o<5;o+=1){const c=new L(i,t);c.position.set(o*2.2,Math.sin(o)*.45,o%2*.7),c.scale.set(3+o*.4,1.1+o%2*.3,1.4),a.add(c)}a.position.set(n[0],n[1],n[2]),a.rotation.y=r*.4,this.scene.add(a)})}resize(){const e=Math.max(1,this.root.clientWidth),t=Math.max(1,this.root.clientHeight);e===this.size.width&&t===this.size.height||(this.size={width:e,height:t},this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}render(e=this.camera,t=this.scene){this.renderer.render(t,e)}}class fv{constructor(e,t,i,n=null){this.scene=e,this.vehicleFactory=t,this.saveManager=i,this.cityBuilder=n,this.vehicles=[],this.group=new ft,this.group.name="Traffic",this.scene.add(this.group)}build(){if(this.clear(),this.saveManager.settings.trafficDensity==="off")return;const e=this.saveManager.settings.trafficDensity==="high"?26:this.saveManager.settings.trafficDensity==="medium"?18:11,t=["compact","sedan","van","taxi","small-bus","delivery-truck"];for(let i=0;i<e;i+=1){const n=zc[i%zc.length],r=dn[(i+1)%dn.length],a=this.vehicleFactory.createCarMesh(r),o=t[i%t.length],c=o==="small-bus"?1.28:o==="delivery-truck"?1.18:o==="van"?1.08:o==="taxi"?.86:.78;a.scale.setScalar(i%5===0?c*1.06:c);const l=this.findSafePointIndex(n,i%n.points.length),d=n.points[l];a.position.set(d[0],this.getSurfaceHeight(d[0],d[1]),d[1]),this.group.add(a),this.vehicles.push({mesh:a,loop:n,pointIndex:l,speed:n.speed*(.8+i%4*.08),type:o,heading:0,cooldown:0,stuckTimer:0,offset:(i%2?-1:1)*(n.zone==="highway"?2.8:1.9)})}}clear(){this.vehicles.forEach(e=>this.group.remove(e.mesh)),this.vehicles=[]}update(e,t){this.vehicles.forEach(i=>{i.cooldown=Math.max(0,i.cooldown-e);const n=i.mesh.position,r=i.loop.points[(i.pointIndex+1)%i.loop.points.length],o=new C(r[0],0,r[1]).clone().sub(n);if(o.y=0,o.length()<2.4){i.pointIndex=(i.pointIndex+1)%i.loop.points.length;return}o.normalize();const l=Math.atan2(o.x,o.z);i.heading=ed(i.heading,l,5.5,e);const d=new C(Math.cos(i.heading),0,-Math.sin(i.heading));let h=i.speed*this.getDistrictSpeedFactor(i.loop.zone,i.type);const u=hi([t.position.x,t.position.z],[i.mesh.position.x,i.mesh.position.z]),f=Math.abs(t.mesh.position.y-i.mesh.position.y);u<15&&f<3.2&&(h*=.2),h*=this.getTrafficSpacingFactor(i),i.mesh.position.addScaledVector(o,h*e),i.mesh.position.addScaledVector(d,i.offset*e*.08),i.mesh.position.y=this.getSurfaceHeight(i.mesh.position.x,i.mesh.position.z),i.mesh.rotation.y=i.heading,i.mesh.userData.wheels?.forEach(g=>{g.tire.rotation.x+=i.speed*e*2.1}),i.stuckTimer=u<4&&f<3.2||h<.6?i.stuckTimer+e:Math.max(0,i.stuckTimer-e),i.stuckTimer>2.5&&(this.recycleTraffic(i,t.position),i.stuckTimer=0)})}getDistrictSpeedFactor(e,t){return(e==="highway"?1.22:e==="market"?.68:e==="residential"?.78:e==="airport"?.72:e==="industrial"?.64:1)*(t==="small-bus"||t==="delivery-truck"?.72:t==="taxi"?1.02:1)}getTrafficSpacingFactor(e){let t=1;return this.vehicles.forEach(i=>{if(i===e||i.loop!==e.loop)return;const n=hi([e.mesh.position.x,e.mesh.position.z],[i.mesh.position.x,i.mesh.position.z]);n>.1&&n<10&&(t=Math.min(t,.42))}),t}recycleTraffic(e,t){let i=0;for(;i<e.loop.points.length;){e.pointIndex=(e.pointIndex+1)%e.loop.points.length;const n=e.loop.points[e.pointIndex];if(hi([t.x,t.z],n)>28){if(!this.isSpawnPointClear(n[0],n[1])){i+=1;continue}e.mesh.position.set(n[0],0,n[1]),e.mesh.position.y=this.getSurfaceHeight(n[0],n[1]);return}i+=1}}getSurfaceHeight(e,t){return this.cityBuilder?this.cityBuilder.getSurfaceInfo(new C(e,0,t),null,{preferElevated:!0}).surfaceHeight??0:0}findSafePointIndex(e,t=0){for(let i=0;i<e.points.length;i+=1){const n=(t+i)%e.points.length,r=e.points[n];if(this.isSpawnPointClear(r[0],r[1]))return n}return t}isSpawnPointClear(e,t){if(!this.cityBuilder?.collisionSystem)return!0;const i=this.cityBuilder.collisionSystem.queryNearby(new he(e,t),9);for(const n of i)if([Je.HARD_SOLID,Je.SLIDE_SOLID].includes(n.type)){const r=n.center.x-e,a=n.center.y-t;if(Math.hypot(r,a)<Math.max(n.size.x,n.size.y)*.55+4)return!1}return!0}}class pv{constructor(e,t,i,n){this.root=e,this.inputManager=t,this.saveManager=i,this.callbacks=n,this.toasts=[],this.buildDom(),this.bind(),this.applySettingsToInputs()}buildDom(){this.layer=document.createElement("div"),this.layer.className="screen-layer",this.layer.innerHTML=`
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
    `,this.root.appendChild(this.layer),this.hud=this.layer.querySelector("[data-hud]"),this.pause=this.layer.querySelector("[data-pause]"),this.result=this.layer.querySelector("[data-result]"),this.toastsEl=this.layer.querySelector("[data-toasts]")}bind(){this.layer.querySelector("[data-resume]").addEventListener("click",this.callbacks.onResume),this.layer.querySelector("[data-restart]").addEventListener("click",this.callbacks.onRestart),this.layer.querySelector("[data-garage]").addEventListener("click",this.callbacks.onGarage),this.layer.querySelector("[data-main-menu]").addEventListener("click",this.callbacks.onMainMenu),this.layer.querySelector("[data-toggle-settings]").addEventListener("click",()=>this.togglePanel("settings")),this.layer.querySelector("[data-toggle-controls]").addEventListener("click",()=>this.togglePanel("controls")),this.layer.querySelector("[data-result-retry]").addEventListener("click",this.callbacks.onRetry),this.layer.querySelector("[data-result-free]").addEventListener("click",()=>this.callbacks.onStartMode("freeDrive")),this.layer.querySelector("[data-result-garage]").addEventListener("click",this.callbacks.onGarage),this.layer.querySelector("[data-result-main]").addEventListener("click",this.callbacks.onMainMenu),this.layer.querySelector("[data-reset-progress]").addEventListener("click",()=>{window.confirm("Reset local Mini City Drive progress on this device?")&&(this.saveManager.resetProgress(),this.showToast("Local progress reset"),this.callbacks.onSettingsChanged())}),this.layer.querySelectorAll("[data-setting]").forEach(e=>{e.addEventListener("input",()=>{const t=e.dataset.setting,i=e.type==="checkbox"?e.checked:e.type==="range"?Number(e.value):e.value;this.saveManager.updateSettings({[t]:i}),this.callbacks.onSettingsChanged()})}),this.layer.querySelectorAll("[data-touch]").forEach(e=>{this.inputManager.bindTouchButton(e,e.dataset.touch)})}applySettingsToInputs(){this.layer.querySelectorAll("[data-setting]").forEach(e=>{const t=this.saveManager.settings[e.dataset.setting];e.type==="checkbox"?e.checked=!!t:e.value=t})}togglePanel(e){const t=this.layer.querySelector("[data-settings-panel]"),i=this.layer.querySelector("[data-controls-panel]");e==="settings"?(t.classList.toggle("is-hidden"),i.classList.add("is-hidden")):(i.classList.toggle("is-hidden"),t.classList.add("is-hidden"))}showHud(){this.hud.classList.remove("is-hidden")}hideHud(){this.hud.classList.add("is-hidden")}showPause(){this.pause.classList.remove("is-hidden")}hidePause(){this.pause.classList.add("is-hidden")}showResult(e,t){this.hidePause(),this.result.classList.remove("is-hidden"),this.layer.querySelector("[data-result-eyebrow]").textContent=e.success?"Mission complete":"Mission failed",this.layer.querySelector("[data-result-title]").textContent=e.success?e.missionName:e.reason;const i=this.layer.querySelector("[data-result-summary]");i.innerHTML=`
      <div class="result-tile"><span>Car</span><strong>${t}</strong></div>
      <div class="result-tile"><span>Rank</span><strong>${e.rank}</strong></div>
      <div class="result-tile"><span>Medal</span><strong>${e.medal??"-"}</strong></div>
      <div class="result-tile"><span>Score</span><strong>${e.score}</strong></div>
      <div class="result-tile"><span>Coins</span><strong>+${e.coinsEarned}</strong></div>
      <div class="result-tile"><span>XP</span><strong>+${e.xpEarned??0}</strong></div>
      <div class="result-tile"><span>Mastery</span><strong>+${e.masteryXp??0}</strong></div>
      <div class="result-tile"><span>Time</span><strong>${e.time}</strong></div>
      <div class="result-tile"><span>Best</span><strong>${e.isBest?"New best":e.bestBefore}</strong></div>
      <div class="result-tile"><span>Bonuses</span><strong>${e.bonusObjectives?.filter(n=>n.complete).length??0}/${e.bonusObjectives?.length??0}</strong></div>
      <div class="result-tile"><span>Unlocks</span><strong>${e.newUnlocks?.length?e.newUnlocks.join(", "):"-"}</strong></div>
      <div class="result-tile"><span>Achievements</span><strong>${e.achievements?.length?e.achievements.map(n=>n.name).join(", "):"-"}</strong></div>
    `}hideResult(){this.result.classList.add("is-hidden")}update(e,t,i,n,r,a,o=null,c={}){this.root.dataset.uiScale=this.saveManager.settings.uiScale;const l=c.cameraMode==="cockpit",d=l&&this.saveManager.settings.cockpitHud==="minimal";this.hud.classList.toggle("is-cockpit-minimal",d),this.layer.querySelector("[data-camera-mode]").textContent=c.cameraLabel??"Standard Chase";const h=this.layer.querySelector(".touch-controls");h&&(h.style.display=this.saveManager.settings.touchControls==="off"?"none":this.saveManager.settings.touchControls==="on"?"flex":""),this.layer.querySelector("[data-speed-value]").textContent=e.speedKmh;const u=-118+e.speedRatio*236;this.layer.querySelector("[data-speed-needle]").style.transform=`translateX(-50%) rotate(${u}deg)`,this.layer.querySelector("[data-objective-title]").textContent=t.mode,this.layer.querySelector("[data-objective-copy]").textContent=t.distance?`${t.objective} - ${t.distance}m`:t.objective,this.layer.querySelector("[data-car-name]").textContent=n.shortName,this.layer.querySelector("[data-coins]").textContent=i.totalCoins,this.layer.querySelector("[data-zone]").textContent=e.zoneName;const f=an(i.license.xp);this.layer.querySelector("[data-license]").textContent=f.name.replace(" Driver",""),this.layer.querySelector("[data-license-fill]").style.width=`${f.progress*100}%`,this.layer.querySelector("[data-license-xp]").textContent=i.license.xp,this.layer.querySelector("[data-timer-row]").classList.toggle("is-hidden",!t.timer),t.timer&&(this.layer.querySelector("[data-timer]").textContent=t.timer);const y=this.layer.querySelector("[data-event-row]"),m=this.layer.querySelector("[data-task-row]");if(y.classList.toggle("is-hidden",t.active||!o?.event),m.classList.toggle("is-hidden",t.active||!o?.task),o?.event&&(this.layer.querySelector("[data-event-name]").textContent=o.event.name,this.layer.querySelector("[data-event-fill]").style.width=`${Math.max(8,o.eventTime/o.event.duration*100)}%`),o?.task&&(this.layer.querySelector("[data-task-name]").textContent=o.task.label,this.layer.querySelector("[data-task-fill]").style.width="48%"),this.layer.querySelector("[data-boost-fill]").style.width=`${e.boostEnergy*100}%`,this.layer.querySelector("[data-boost]").textContent=Math.round(e.boostEnergy*100),this.layer.querySelector("[data-condition-row]").classList.toggle("is-hidden",t.condition===null),t.condition!==null&&(this.layer.querySelector("[data-condition-fill]").style.width=`${t.condition}%`,this.layer.querySelector("[data-condition]").textContent=Math.round(t.condition)),this.layer.querySelector("[data-comfort-row]").classList.toggle("is-hidden",t.comfort===null),t.comfort!==null&&(this.layer.querySelector("[data-comfort-fill]").style.width=`${t.comfort}%`,this.layer.querySelector("[data-comfort]").textContent=Math.round(t.comfort)),this.layer.querySelector("[data-parking-row]").classList.toggle("is-hidden",t.accuracy===null),t.accuracy!==null&&(this.layer.querySelector("[data-parking-fill]").style.width=`${t.accuracy}%`,this.layer.querySelector("[data-parking]").textContent=Math.round(t.accuracy)),this.layer.querySelector("[data-cockpit-assist]").classList.toggle("is-hidden",!(l&&t.accuracy!==null)),this.layer.querySelector("[data-drift-row]").classList.toggle("is-hidden",t.driftScore===null),t.driftScore!==null){const D=Number((t.progress??"0/1").split("/")[1]??1);this.layer.querySelector("[data-drift-fill]").style.width=`${Math.min(100,t.driftScore/D*100)}%`,this.layer.querySelector("[data-drift]").textContent=`${t.driftScore} x${t.multiplier?.toFixed(1)??"1.0"}`}this.updateRadar(r,a,t.target??o?.task?.target??null),this.updateDebug(e,t,c)}updateDebug(e,t,i){const n=this.layer.querySelector("[data-debug]"),r=!!this.saveManager.settings.debugOverlay;n.classList.toggle("is-hidden",!r),r&&(n.innerHTML=`
      <span>FPS est ${Math.round(1/Math.max(.001,i.dt??.016))}</span>
      <span>Traffic ${i.trafficCount??0}</span>
      <span>Coins ${i.collectibleCount??0}</span>
      <span>District ${e.zoneName}</span>
      <span>Mission ${t.mode}</span>
      <span>Camera ${i.cameraLabel??i.cameraMode??"Standard"}</span>
      <span>Surface ${i.collision?.currentSurface??e.surfaceId??"ground"}</span>
      <span>Type ${i.collision?.surfaceType??e.surfaceType??"terrain"} @ ${Number(i.collision?.surfaceHeight??e.surfaceHeight??0).toFixed(1)}</span>
      <span>Colliders ${i.collision?.nearbyCount??0}/${i.collision?.staticCount??0}</span>
      <span>Clearance zones ${i.collision?.clearanceCount??0}</span>
      <span>Hits ${i.collision?.lastCount??e.collisionCount??0} Traffic ${i.collision?.trafficCollisions??0}</span>
    `)}updateRadar(e,t,i){const n=this.layer.querySelector("[data-radar]");n.style.display=this.saveManager.settings.minimap?"":"none",this.layer.querySelector("[data-minimap-label]").textContent=this.layer.querySelector("[data-zone]").textContent;const r=this.layer.querySelector("[data-radar-arrow]");r.style.transform=`translate(-50%, -50%) rotate(${t}rad)`;const a=this.layer.querySelector("[data-radar-target]");if(!i){a.style.opacity="0.25",a.style.transform="translate(-50%, -50%)";return}a.style.opacity="1";const o=i[0]-e.x,c=i[1]-e.z,l=Math.min(54,Math.hypot(o,c)*(108/tn.radarRange)),d=Math.atan2(o,c)-t,h=Math.sin(d)*l,u=-Math.cos(d)*l;a.style.transform=`translate(calc(-50% + ${h}px), calc(-50% + ${u}px))`}showToast(e){const t=document.createElement("div");t.className="toast",t.textContent=e,this.toastsEl.classList.remove("is-hidden"),this.toastsEl.appendChild(t),window.setTimeout(()=>{t.remove(),this.toastsEl.children.length||this.toastsEl.classList.add("is-hidden")},2400)}setPaused(e){e?this.showPause():this.hidePause()}setMissionTime(e){this.layer.querySelector("[data-timer]").textContent=ts(e)}}const Ki=new C,Rn=new C,Pn=new C;class mv{constructor(e,t,i,n,r){this.mesh=e,this.config=t,this.cityBuilder=i,this.effectsManager=n,this.audioManager=r,this.position=new C,this.velocity=new C,this.heading=0,this.steerVisual=0,this.wheelSpin=0,this.boostEnergy=1,this.exhaustTimer=0,this.boostTimer=0,this.dustTimer=0,this.skidTimer=0,this.collisionShake=0,this.collisionCooldown=0,this.roadBump=0,this.payloadAccelerationMultiplier=1,this.surfaceHeight=0,this.currentSurfaceId=null,this.currentSurfaceInfo=null,this.lastCollision={collided:!1,count:0,ids:[]},this.lastPosition=new C,this.lastSafePosition=new C,this.lastSafeHeading=0,this.stuckTimer=0,this.telemetry=this.createTelemetry()}createTelemetry(){return{speed:0,speedKmh:0,speedRatio:0,forwardSpeed:0,drifting:!1,braking:!1,boosting:!1,offRoad:!1,zoneName:"Downtown Core",distanceTravelled:0,driftScore:0,collisionIntensity:0,boostEnergy:1,stuck:!1,elevated:!1,steeringVisual:0,inputSteer:0,inputThrottle:0}}reset(e=[0,0,0],t=0,i=null){this.position.set(e[0],0,e[2]??e[1]??0),this.velocity.set(0,0,0),this.heading=t,this.steerVisual=0,this.wheelSpin=0,this.stuckTimer=0,this.currentSurfaceId=i??this.currentSurfaceId,this.currentSurfaceInfo=this.cityBuilder.getSurfaceInfo(this.position,this.currentSurfaceId,{preferElevated:!!i}),this.currentSurfaceId=this.currentSurfaceInfo.surfaceId,this.surfaceHeight=this.currentSurfaceInfo.surfaceHeight??0,this.lastPosition.copy(this.position),this.lastSafePosition.copy(this.position),this.lastSafeHeading=t,this.syncMesh()}setMissionModifiers(e={}){this.payloadAccelerationMultiplier=e.accelerationMultiplier??1}update(e,t){const i=this.config.physics;let n=this.cityBuilder.getSurfaceInfo(this.position,this.currentSurfaceId);this.currentSurfaceId=n.surfaceId;const r=qa(this.heading);Ki.copy(r),Rn.set(r.z,0,-r.x);const a=this.velocity.dot(Ki);this.velocity.dot(Rn);const o=this.velocity.length(),c=Math.abs(a)>.7?Math.sign(a):1,l=dt(o/i.maxSpeed,0,1),d=(.32+l*.92)*(t.handbrake?1.22:1);this.heading+=t.steer*i.steerRate*d*c*e;let h=0;const u=t.brake>0&&a>1.1;t.throttle>0&&(h+=i.acceleration*n.accelerationFactor*this.payloadAccelerationMultiplier),t.brake>0&&(h+=u?-i.braking:-i.acceleration*.58);const f=t.boost&&t.throttle>0&&this.boostEnergy>.02&&o>2;f?(h+=i.boost,this.boostEnergy=dt(this.boostEnergy-e*.28,0,1),this.boostTimer-=e,this.boostTimer<=0&&(this.spawnRearPuffs(!0),this.boostTimer=.055)):this.boostEnergy=dt(this.boostEnergy+e*.12,0,1),this.velocity.addScaledVector(Ki,h*e);const g=this.velocity.dot(Ki),y=this.velocity.dot(Rn),m=(t.handbrake?i.driftGrip:i.grip)*n.gripFactor,p=Pt(y,0,m,e);this.velocity.copy(Ki).multiplyScalar(g).addScaledVector(Rn,p),this.velocity.multiplyScalar(Math.max(0,1-.34*e));const b=i.maxSpeed*n.speedFactor*(f?1.12:1),w=i.reverseSpeed,D=dt(this.velocity.dot(Ki),-w,b),E=dt(this.velocity.dot(Rn),-b*.36,b*.36);this.velocity.copy(Ki).multiplyScalar(D).addScaledVector(Rn,E),this.lastPosition.copy(this.position),this.position.addScaledVector(this.velocity,e),this.resolveWorldBounds(),this.lastCollision=this.cityBuilder.collisionSystem?.resolvePlayer(this,e)??{collided:!1,count:0,ids:[]},n=this.cityBuilder.getSurfaceInfo(this.position,this.currentSurfaceId),this.currentSurfaceId=n.surfaceId,this.currentSurfaceInfo=n,this.surfaceHeight=Pt(this.surfaceHeight,n.surfaceHeight??0,9.5,e);const P=this.lastPosition.distanceTo(this.position),_=Math.abs(E)*Ig(6,18,o),T=(t.handbrake||_>3.5)&&o>7,N=T?_*e*9:0;return P<.06&&(t.throttle>0||t.brake>0)?this.stuckTimer+=e:this.stuckTimer=Math.max(0,this.stuckTimer-e*1.4),this.exhaustTimer-=e,this.dustTimer-=e,this.skidTimer-=e,(t.throttle>0||o>6)&&this.exhaustTimer<=0&&(this.spawnRearPuffs(!1),this.exhaustTimer=t.throttle>0?.22:.42),n.offRoad&&o>5&&this.dustTimer<=0&&(this.spawnRearDust(),this.dustTimer=.12),T&&this.skidTimer<=0&&(this.spawnSkidMarks(),this.skidTimer=.16),this.updateVisuals(e,t,t.brake>0,f,o,D),this.collisionShake=Math.max(0,this.collisionShake-e*2.4),this.collisionCooldown=Math.max(0,this.collisionCooldown-e),this.syncMesh(),!this.lastCollision.collided&&o<i.maxSpeed*1.05&&(this.lastSafePosition.copy(this.position),this.lastSafeHeading=this.heading),this.telemetry={speed:o,speedKmh:Math.round(o*6.2),speedRatio:l,forwardSpeed:D,drifting:T,braking:u,boosting:f,offRoad:n.offRoad,zoneName:n.zoneName,distanceTravelled:P,driftScore:N,collisionIntensity:this.collisionShake,boostEnergy:this.boostEnergy,stuck:this.stuckTimer>2.5,surfaceId:n.surfaceId,surfaceType:n.surfaceType,surfaceHeight:n.surfaceHeight,elevated:!!n.elevated,collisionCount:this.lastCollision.count,steeringVisual:this.steerVisual,inputSteer:t.steer,inputThrottle:t.throttle},this.audioManager.updateEngine(l,t.throttle>0,T,f,this.config),this.telemetry}updateVisuals(e,t,i,n,r,a){const o=this.config.visual;this.steerVisual=Pt(this.steerVisual,t.steer*.46,10,e),this.wheelSpin+=a*e/Math.max(.1,o.wheelRadius);const c=this.mesh.userData.root;c&&(c.position.y=this.roadBump,c.rotation.z=Pt(c.rotation.z,-t.steer*dt(r/45,0,1)*.045,8,e),c.rotation.x=Pt(c.rotation.x,i?-.035:t.throttle?.018:0,7,e)),this.roadBump=Pt(this.roadBump,0,8,e),this.mesh.userData.frontWheels?.forEach(l=>{l.rotation.y=this.steerVisual}),this.mesh.userData.wheels?.forEach(l=>{l.tire.rotation.x=this.wheelSpin}),this.mesh.userData.brakeLights?.forEach(l=>{l.material.emissiveIntensity=i?1.45:.12})}syncMesh(){this.mesh.position.copy(this.position),this.mesh.position.y=this.surfaceHeight,this.mesh.rotation.y=this.heading}getWorldPosition(e=new C){return e.copy(this.mesh.position)}spawnRearPuffs(e){this.mesh.userData.exhausts?.forEach(t=>{t.getWorldPosition(Pn),this.effectsManager.spawnPuff(Pn,{boost:e,color:e?this.mesh.userData.boostTrailColor:null,size:e?.85:.62,life:e?.32:.68})})}spawnRearDust(){this.mesh.userData.wheels?.forEach(e=>{e.axle<0&&(e.pivot.getWorldPosition(Pn),this.effectsManager.spawnDust(Pn))})}spawnSkidMarks(){this.mesh.userData.wheels?.forEach(e=>{Math.abs(e.axle)>0&&(e.pivot.getWorldPosition(Pn),this.effectsManager.spawnSkid(Pn,this.heading))})}applyCollision(e,t=1){const i=this.position.clone().sub(e);i.lengthSq()<1e-4&&i.set(1,0,0),i.normalize();const n=(5+t*8)/this.config.physics.mass;this.velocity.addScaledVector(i,n),this.velocity.multiplyScalar(.58),this.collisionShake=dt(this.collisionShake+t,0,1.5),t>.65&&this.effectsManager.spawnSparks(this.position),this.audioManager.play("crash",dt(t,.3,1))}registerCollisionImpact(e=.45,t="static",i=.016,n={}){this.collisionShake=dt(this.collisionShake+e*.55,0,1.5),this.collisionCooldown<=0&&(!n.quiet&&e>.45&&this.effectsManager.spawnSparks(this.position),n.quiet||this.audioManager.play("crash",dt(e,.25,.95)),this.collisionCooldown=.22+i),this.lastCollision={collided:!0,count:Math.max(1,this.lastCollision?.count??0),ids:[t]}}registerLowSurfaceBump(e=.1,t=.016){this.roadBump=Math.max(this.roadBump,Math.min(e,Jt.curbClimbHeight*.32)),this.collisionShake=dt(this.collisionShake+e*.18,0,.42),this.collisionCooldown=Math.max(this.collisionCooldown,t)}getCollider(){const e=this.config.visual,t=e.rideHeight+e.height+.55,i=this.getColliderDimensions(e);return{id:"player",center:new he(this.position.x,this.position.z),size:new he(i.width,i.length),rotation:this.heading,yMin:this.surfaceHeight-.15,yMax:this.surfaceHeight+t}}getColliderDimensions(e){const i={hatchback:{width:.78,length:.82},coupe:{width:.8,length:.84},suv:{width:.82,length:.84},supercar:{width:.83,length:.86},jeep:{width:.84,length:.82},classic:{width:.78,length:.88}}[e.type]??{width:.8,length:.84};return{width:Math.max(.9,e.width*i.width+Jt.carColliderPadding),length:Math.max(1.8,e.length*i.length+Jt.carColliderPadding)}}isInsideParkingZone(e){const t=new C(e.center[0],0,e.center[1]),i=new C(e.size[0],0,e.size[1]);return Nn(this.position,t,i,e.rotation)}resolveWorldBounds(){const e=tn.bounds;(Math.abs(this.position.x)>e||Math.abs(this.position.z)>e)&&(this.position.x=dt(this.position.x,-e,e),this.position.z=dt(this.position.z,-e,e),this.velocity.multiplyScalar(.38))}}const Kr=new Map,jt=(s,e)=>{const t=`${s}:${JSON.stringify(e)}`;return Kr.has(t)||Kr.set(t,new je(e)),Kr.get(t)},gv={hatchback:(s,e)=>[[-s*.5,.08],[-s*.42,e*.54],[-s*.22,e*.72],[s*.12,e*.72],[s*.37,e*.48],[s*.5,e*.22],[s*.5,.04]],coupe:(s,e)=>[[-s*.5,.06],[-s*.37,e*.4],[-s*.05,e*.68],[s*.24,e*.62],[s*.47,e*.25],[s*.5,.05]],suv:(s,e)=>[[-s*.5,.08],[-s*.46,e*.67],[-s*.22,e*.82],[s*.28,e*.82],[s*.48,e*.58],[s*.5,.08]],supercar:(s,e)=>[[-s*.5,.05],[-s*.34,e*.34],[-s*.02,e*.68],[s*.22,e*.58],[s*.5,e*.12],[s*.5,.04]],jeep:(s,e)=>[[-s*.5,.06],[-s*.48,e*.66],[-s*.16,e*.78],[s*.28,e*.78],[s*.49,e*.6],[s*.5,.06]],classic:(s,e)=>[[-s*.5,.08],[-s*.43,e*.38],[-s*.1,e*.64],[s*.18,e*.62],[s*.42,e*.36],[s*.5,.08]]};class vv{constructor(){this.shadowMaterial=jt("soft-shadow",{color:"#1a1e25",transparent:!0,opacity:.22,roughness:1})}createCarMesh(e,t={}){const i=new ft;i.name=e.name;const n=e.visual,r={...e.colors,body:t.customization?.body??e.colors.body,accent:t.customization?.accent??e.colors.accent},a=new ft;i.add(a);const o=jt(`body-${e.id}`,{color:r.body,roughness:.37,metalness:.28}),c=jt(`secondary-${e.id}`,{color:r.secondary,roughness:.42,metalness:.2}),l=jt(`glass-${e.id}`,{color:r.glass,roughness:.08,metalness:.04,transparent:!0,opacity:t.customization?.tintOpacity??.72}),d=jt(`accent-${e.id}`,{color:r.accent,roughness:.24,metalness:.68}),h=jt("tire",{color:"#15181d",roughness:.78,metalness:.04}),u=t.customization?.wheelStyle??"stock",f=u==="sport"?"#202a38":u==="classic"?"#f2e7cf":u==="offroad"?"#9aa36b":"#d7d9d6",g=jt(`rim-${u}`,{color:f,roughness:.24,metalness:.76}),y=jt(`lights-${e.id}`,{color:r.lights,emissive:r.lights,emissiveIntensity:.45,roughness:.2}),m=jt(`brake-${e.id}`,{color:r.brake,emissive:r.brake,emissiveIntensity:.1,roughness:.26});this.addProfileBody(a,n,o),this.addLowerTrim(a,n,c,d),this.addHood(a,n,o,d,e.id),this.addGlass(a,n,l,e.id),this.addInteriorHint(a,n,c,e.id),this.addLights(a,n,y,m),this.addHeadlightShapes(a,n,y,e.id),this.addSideMirrors(a,n,c),this.addWheelArches(a,n,c,e.id),this.addPanelLines(a,n,c),this.addLicensePlate(a,n,e.id),this.addUniqueDetails(a,n,e.id,o,c,d,h,g),this.addCarSpecificDetails(a,n,e.id,o,c,d,h,g);const p=this.addWheels(a,n,h,g,u),M=new L(new or(Math.max(n.width,n.length)*.62,28),this.shadowMaterial);return M.rotation.x=-Math.PI*.5,M.scale.x=n.width/n.length,M.position.y=.015,M.position.z=-.08,i.add(M),i.userData={carId:e.id,root:a,wheels:p.wheels,frontWheels:p.frontWheels,brakeLights:p.brakeLights,exhausts:p.exhausts,boostTrailColor:t.customization?.boostTrail??"#67d9ff",body:a,dimensions:{length:n.length,width:n.width,height:n.height,radius:Math.max(n.length,n.width)*.54}},t.preview&&(i.scale.setScalar(1.18),i.rotation.y=Math.PI),i}addProfileBody(e,t,i){const n=gv[t.type](t.length,t.height),r=new Pl;r.moveTo(n[0][0],n[0][1]),n.slice(1).forEach(([c,l])=>r.lineTo(c,l)),r.lineTo(n[0][0],n[0][1]);const a=new mo(r,{depth:t.width,bevelEnabled:!0,bevelSegments:2,bevelSize:.055,bevelThickness:.055});a.translate(0,0,-t.width*.5),a.rotateY(-Math.PI*.5),a.computeVertexNormals();const o=new L(a,i);o.castShadow=!0,o.receiveShadow=!0,o.position.y=t.rideHeight,e.add(o)}addLowerTrim(e,t,i,n){const r=new L(new W(t.width*.96,.18,t.length*.9),i);r.position.set(0,t.rideHeight+.17,-.02),r.castShadow=!0,e.add(r);const a=new L(new W(t.width*.82,.18,.18),n);a.position.set(0,t.rideHeight+.28,t.length*.5+.04),a.castShadow=!0,e.add(a);const o=a.clone();o.position.z=-t.length*.5-.04,e.add(o)}addHood(e,t,i,n,r){const a=t.length*(r==="classic"?.36:r==="hatchback"?.24:.31),o=new L(new W(t.width*.78,.035,a),i);o.position.set(0,t.rideHeight+t.height*.6,t.length*.28),o.rotation.x=r==="supercar"?-.08:r==="classic"?.08:-.035,e.add(o);const c=new L(new W(.035,.04,a*.92),n);c.position.copy(o.position),c.position.y+=.025,e.add(c)}addInteriorHint(e,t,i,n){const r=t.width*.18,a=t.height*.22,o=n==="classic"?-t.length*.05:-t.length*.02;[-1,1].forEach(d=>{const h=new L(new W(r,a,t.length*.14),i);h.position.set(d*t.width*.18,t.rideHeight+t.height*.6,o),h.userData.firstPersonCull=!0,e.add(h)});const c=new L(new W(t.width*.5,.08,.12),i);c.position.set(0,t.rideHeight+t.height*.58,t.length*.14);const l=new L(new Yt(.11,.014,8,18),i);l.position.set(-t.width*.16,t.rideHeight+t.height*.62,t.length*.19),l.rotation.x=Math.PI*.5,c.userData.firstPersonCull=!0,l.userData.firstPersonCull=!0,e.add(c,l)}addSideMirrors(e,t,i){[-1,1].forEach(n=>{const r=new L(new W(.06,.05,.24),i);r.position.set(n*t.width*.47,t.rideHeight+t.height*.68,t.length*.14),r.rotation.y=n*.24;const a=new L(new W(.18,.11,.08),i);a.position.set(n*t.width*.56,t.rideHeight+t.height*.69,t.length*.18),a.rotation.y=n*.26,e.add(r,a)})}addWheelArches(e,t,i,n){const r=t.length*.33,a=t.width*.53,o=t.wheelRadius*(n==="offroad-jeep"?1.18:1.05);[-1,1].forEach(c=>{[-1,1].forEach(l=>{const d=new L(new Yt(o,.045,8,24),i);d.rotation.y=Math.PI*.5,d.scale.y=.72,d.position.set(c*a,t.wheelRadius+.16,l*r),e.add(d)})})}addPanelLines(e,t,i){[-1,1].forEach(n=>{const r=new L(new W(.035,.035,t.length*.74),i);r.position.set(n*t.width*.502,t.rideHeight+t.height*.48,-t.length*.02),e.add(r);const a=new L(new W(.04,t.height*.33,.035),i);a.position.set(n*t.width*.505,t.rideHeight+t.height*.48,-t.length*.04),e.add(a)})}addLicensePlate(e,t,i){const n=jt(`plate-${i}`,{color:"#fffaf0",roughness:.35,metalness:.05});[-1,1].forEach(r=>{const a=new L(new W(t.width*.32,.12,.035),n);a.position.set(0,t.rideHeight+t.height*.28,r*t.length*.535),e.add(a)})}addHeadlightShapes(e,t,i,n){n!=="classic"&&[-1,1].forEach(r=>{const a=n==="supercar"||n==="sports-coupe",o=new L(a?new W(t.width*.2,.055,.08):new Rt(.105,12,8),i);o.position.set(r*t.width*.29,t.rideHeight+t.height*.43,t.length*.545),o.rotation.z=r*(a?.22:0),e.add(o)})}addGlass(e,t,i,n){const r=t.length*(n==="classic"?.42:n==="jeep"?.48:.38),a=t.width*.72,o=t.height*(n==="suv"||n==="jeep"?.34:.28),c=n==="hatchback"||n==="suv"||n==="jeep"?-t.length*.08:-t.length*.04,l=new L(new W(a,o,r),i);l.position.set(0,t.rideHeight+t.height*.72,c),l.castShadow=!0,l.userData.firstPersonCull=!0,e.add(l);const d=new L(new W(a*.86,o*.78,.035),i);d.position.set(0,l.position.y-o*.08,c+r*.52),d.rotation.x=-.22,d.userData.firstPersonCull=!0,e.add(d);const h=d.clone();h.position.z=c-r*.52,h.rotation.x=.2,h.userData.firstPersonCull=!0,e.add(h)}addLights(e,t,i,n){const r=t.rideHeight+t.height*.32,a=t.rideHeight+t.height*.32,o=[t.width*.18,.12,.045];[-1,1].forEach(c=>{const l=new L(new W(...o),i);l.position.set(c*t.width*.31,r,t.length*.51),e.add(l);const d=new L(new W(...o),n.clone());d.position.set(c*t.width*.31,a,-t.length*.51),e.add(d),e.userData.brakeLights=e.userData.brakeLights??[],e.userData.brakeLights.push(d)})}addWheels(e,t,i,n,r="stock"){const a=t.length*.33,o=t.width*.52,c=[],l=[],d=e.userData.brakeLights??[],h=[];return[-1,1].forEach(u=>{[-1,1].forEach(g=>{const y=new ft;y.position.set(u*o,t.wheelRadius+.06,g*a);const m=new L(new mt(t.wheelRadius,t.wheelRadius,t.wheelWidth,18),i);m.rotation.z=Math.PI*.5,m.castShadow=!0;const p=new L(new mt(t.wheelRadius*.52,t.wheelRadius*.52,t.wheelWidth*1.04,14),n);if(p.rotation.z=Math.PI*.5,y.add(m,p),r==="sport"||r==="classic")for(let M=0;M<5;M+=1){const b=new L(new W(t.wheelRadius*.08,t.wheelWidth*1.08,t.wheelRadius*.76),n);b.rotation.z=Math.PI*.5,b.rotation.y=M/5*Math.PI,y.add(b)}e.add(y),c.push({pivot:y,tire:m,side:u,axle:g}),g>0&&l.push(y)});const f=new L(new mt(.055,.055,.42,10),n);f.rotation.x=Math.PI*.5,f.position.set(u*t.width*.24,t.rideHeight+.14,-t.length*.56),e.add(f),h.push(f)}),{wheels:c,frontWheels:l,brakeLights:d,exhausts:h}}addUniqueDetails(e,t,i,n,r,a,o,c){if(t.spoiler){const l=new ft,d=new L(new W(t.width*(t.spoiler==="wing"?.94:.72),.08,.2),a);d.position.y=t.rideHeight+t.height*(t.spoiler==="lip"?.58:.78),d.position.z=-t.length*.48,l.add(d),t.spoiler!=="lip"&&[-1,1].forEach(h=>{const u=new L(new W(.06,.42,.06),r);u.position.set(h*t.width*.31,d.position.y-.22,d.position.z+.02),l.add(u)}),e.add(l)}if(t.roofRails&&[-1,1].forEach(l=>{const d=new L(new W(.06,.08,t.length*.42),a);d.position.set(l*t.width*.32,t.rideHeight+t.height*1.05,-t.length*.05),e.add(d)}),t.rollCage){[-1,1].forEach(d=>{const h=new L(new W(.08,t.height*.58,.08),r);h.position.set(d*t.width*.36,t.rideHeight+t.height*.82,-t.length*.04),e.add(h)});const l=new L(new W(t.width*.82,.08,t.length*.45),r);l.position.set(0,t.rideHeight+t.height*1.1,-t.length*.04),e.add(l)}if(t.spareTire){const l=new L(new Yt(t.wheelRadius*.7,t.wheelRadius*.18,10,20),o);l.rotation.y=Math.PI*.5,l.position.set(0,t.rideHeight+t.height*.45,-t.length*.57),e.add(l)}if(t.diffuser){const l=new L(new W(t.width*.82,.16,.34),r);l.position.set(0,t.rideHeight+.14,-t.length*.52),l.rotation.x=-.18,e.add(l)}if(t.chrome&&([-1,1].forEach(l=>{const d=new L(new W(t.width*.9,.12,.12),c);d.position.set(0,t.rideHeight+.3,l*t.length*.54),e.add(d)}),[-1,1].forEach(l=>{const d=new L(new Rt(.12,12,8),jt(`classic-lamp-${l}`,{color:"#fff5c2",emissive:"#fff5c2",emissiveIntensity:.35}));d.position.set(l*t.width*.24,t.rideHeight+t.height*.42,t.length*.54),e.add(d)})),(i==="supercar"||i==="coupe")&&[-1,1].forEach(l=>{const d=new L(new W(.05,.26,.56),r);d.position.set(l*t.width*.51,t.rideHeight+t.height*.36,-t.length*.08),e.add(d)}),i==="hatchback"){const l=new L(new W(t.width*.5,.045,t.length*.28),a);l.position.set(0,t.rideHeight+t.height*1.02,-t.length*.08),e.add(l)}}addCarSpecificDetails(e,t,i,n,r,a,o,c){if((i==="sports-coupe"||i==="supercar")&&[-1,1].forEach(l=>{const d=new L(new W(.08,.12,t.length*.62),a);d.position.set(l*t.width*.54,t.rideHeight+.24,-t.length*.02),e.add(d)}),i==="supercar"){[-1,1].forEach(d=>{const h=new L(new W(.12,.2,.42),r);h.position.set(d*t.width*.38,t.rideHeight+t.height*.46,-t.length*.22),h.rotation.y=d*-.18,e.add(h)});const l=new L(new W(t.width*.86,.055,.3),a);l.position.set(0,t.rideHeight+.12,t.length*.58),e.add(l)}if(i==="offroad-jeep"){[-1,1].forEach(l=>{[-1,1].forEach(d=>{const h=new L(new W(.13,.18,t.length*.2),r);h.position.set(l*t.width*.58,t.rideHeight+t.height*.34,d*t.length*.33),e.add(h)})});for(let l=-2;l<=2;l+=1){const d=new L(new Rt(.095,10,8),jt(`jeep-roof-light-${l}`,{color:"#fff2b6",emissive:"#fff2b6",emissiveIntensity:.42}));d.position.set(l*.18,t.rideHeight+t.height*1.16,t.length*.2),e.add(d)}}if(i==="suv"){const l=new L(new W(t.width*.74,t.height*.34,.08),n);l.position.set(0,t.rideHeight+t.height*.48,-t.length*.49),e.add(l)}if(i==="hatchback"){const l=new L(new W(t.width*.58,.08,.08),a);l.position.set(0,t.rideHeight+t.height*.24,t.length*.56),e.add(l)}if(i==="classic"){const l=new L(new Rt(.72,18,10),n);l.scale.set(t.width*.78,.22,t.length*.28),l.position.set(0,t.rideHeight+t.height*.55,t.length*.23),e.add(l),[-1,1].forEach(d=>{const h=new L(new W(.08,.2,.52),c);h.position.set(d*t.width*.42,t.rideHeight+t.height*.45,-t.length*.38),e.add(h)})}}}class _v{constructor(e){this.root=e,this.loadingEl=e.querySelector("#loading-screen"),this.loadingCopyEl=e.querySelector(".loading-copy"),this.sceneManager=new uv(e),this.saveManager=new hv,this.inputManager=new ev(e),this.audioManager=new kg(this.saveManager),this.customizationManager=new Wg(this.saveManager),this.tuningManager=new Qg(this.saveManager,{onUpgrade:(t,i)=>{this.audioManager.play("tuning",.75),this.hudManager?.showToast(`${i.label} tuning applied`)}}),this.masteryManager=new nv(this.saveManager,{onLevelUp:(t,i)=>{this.audioManager.play("mastery",.8),this.hudManager?.showToast(`${rn(t).shortName} mastery: ${i.name}`)}}),this.careerManager=new Hg(this.saveManager,{onCareerComplete:(t,i)=>{this.audioManager.play("objective",.8),i.length?this.hudManager?.showToast(`Career unlocked: ${i[0]}`):this.hudManager?.showToast(`${t.title} career medal saved`)}}),this.progressionManager=new sv(this.saveManager,{onLevelUp:t=>this.hudManager?.showToast(`${t.name} license reached`)}),this.achievementManager=new iv(this.saveManager,{onAchievement:t=>this.hudManager?.showToast(`Achievement: ${t.name}`),onLevelUp:t=>this.hudManager?.showToast(`${t.name} license reached`)}),this.statsManager=new rv(this.saveManager),this.effectsManager=new Bg(this.sceneManager.scene),this.vehicleFactory=new vv,this.cityBuilder=new Og(this.sceneManager.scene,this.effectsManager,this.vehicleFactory),this.trafficSystem=new fv(this.sceneManager.scene,this.vehicleFactory,this.saveManager,this.cityBuilder),this.missionManager=new tv(this.sceneManager.scene,this.saveManager,this.audioManager,this.cityBuilder),this.cityEventManager=null,this.cameraController=new Ng(this.sceneManager.camera,this.saveManager),this.cockpitManager=new id(this.sceneManager.scene,this.sceneManager.camera,this.saveManager),this.player=null,this.playerConfig=rn(this.saveManager.data.selectedCar),this.state="loading",this.currentMode="freeDrive",this.testDrive=!1,this.lastMissionMode="freeDrive",this.missionHud=this.missionManager.getFreeDriveHud(),this.phase3Hud=null,this.activeCareerMissionId=null,this.lastTrafficDensity=this.saveManager.settings.trafficDensity,this.frameId=null,this.pausedByBlur=!1,this.startupTask=null,this.cityEventManager=new zg(this.saveManager,this.masteryManager,{onEvent:t=>{this.audioManager.play("event",.65),this.hudManager?.showToast(t.name)},onTaskComplete:t=>{this.audioManager.play("objective",.8),this.hudManager?.showToast(`${t.label} +${t.coins} coins`)}}),this.garageManager=new jg(e,this.vehicleFactory,this.saveManager,this.customizationManager,this.tuningManager,this.masteryManager,this.careerManager,{onStart:(t,i)=>this.startMode(t,i),onStartCareer:(t,i,n)=>this.startMode(i,n,{careerId:t}),onTestDrive:t=>this.startMode("freeDrive",t,{testDrive:!0}),onFeedback:t=>this.hudManager?.showToast(t),onAudioClick:()=>this.audioManager.play("click",.6)}),this.hudManager=new pv(e,this.inputManager,this.saveManager,{onResume:()=>this.resume(),onRestart:()=>this.restartCurrentMode(),onGarage:()=>this.openGarage(),onMainMenu:()=>this.openGarage(),onRetry:()=>this.restartCurrentMode(),onStartMode:t=>this.startMode(t,this.saveManager.data.selectedCar),onSettingsChanged:()=>this.applySettings()}),this.onResize=this.onResize.bind(this),this.onBlur=this.onBlur.bind(this),this.onFocus=this.onFocus.bind(this)}start(){return this.startupTask?this.startupTask:(this.loop(),this.startupTask=this.bootstrap(),this.startupTask)}async bootstrap(){await this.yieldToBrowser(),await this.cityBuilder.buildAsync(e=>this.setLoadingCopy(e)),this.setLoadingCopy("Restoring your drive..."),await this.yieldToBrowser(),this.cityBuilder.restoreCollected(this.saveManager),this.trafficSystem.build(),this.applySettings(),window.addEventListener("resize",this.onResize),window.addEventListener("blur",this.onBlur),window.addEventListener("focus",this.onFocus),this.setLoadingCopy("Opening the garage..."),await this.yieldToBrowser(),this.garageManager.show(),this.state="garage",this.loadingEl?.classList.add("is-hidden")}yieldToBrowser(){return new Promise(e=>{window.setTimeout(e,0)})}setLoadingCopy(e){this.loadingCopyEl&&(this.loadingCopyEl.textContent=e)}loop(){this.frameId=window.requestAnimationFrame(()=>this.loop()),this.sceneManager.resize();const e=Math.min(.033,this.sceneManager.clock.getDelta());if(this.state==="loading"){this.effectsManager.update(e),this.sceneManager.render();return}if(this.state==="garage"){this.garageManager.update(e,this.sceneManager.size),this.garageManager.render(this.sceneManager.renderer);return}this.state==="playing"&&this.updatePlaying(e),this.effectsManager.update(e),this.sceneManager.render()}updatePlaying(e){if(!this.player)return;this.handleHotkeys(),this.audioManager.setCockpitActive(this.cameraController.getMode().id==="cockpit");const t=this.inputManager.getDrivingInput(),i=this.player.update(e,t);this.cityBuilder.update(e),this.trafficSystem.update(e,this.player);const n=this.cityBuilder.collisionSystem.resolveTrafficVehicles(this.player,this.trafficSystem.vehicles);n&&this.player.syncMesh(),this.cameraController.update(e,this.player,i),this.cockpitManager.update(e,this.player,i,this.cameraController.getMode().id),this.statsManager.updateDriving(e,i),this.progressionManager.awardCleanDistance(i.distanceTravelled),this.masteryManager.awardDriving(this.playerConfig.id,i),this.phase3Hud=this.cityEventManager.update(e,i,this.player,this.currentMode,this.playerConfig.id),this.cityBuilder.checkCollectibles(this.player.position,this.saveManager,this.audioManager,a=>this.hudManager.showToast(a)),this.cityBuilder.checkLandmarks(this.player.position,this.saveManager,this.audioManager,a=>this.hudManager.showToast(a)),this.cityBuilder.checkDistricts(this.player.position,this.saveManager,this.audioManager,a=>this.hudManager.showToast(a)),this.achievementManager.evaluate();const r=this.missionManager.update(e,this.player,i);if(r?.result){this.decorateMissionResult(r.result),this.showResult(r.result);return}this.missionHud=r,i.stuck&&this.hudManager.showToast("Car reset available with R"),this.cityBuilder.collisionSystem.updateDebug(this.saveManager.settings.debugOverlay,this.player,this.player.currentSurfaceInfo),this.hudManager.update(i,this.missionHud,this.saveManager.data,this.playerConfig,this.player.position,this.player.heading,this.phase3Hud,{dt:e,trafficCount:this.trafficSystem.vehicles.length,collectibleCount:this.cityBuilder.collectibles.filter(a=>a.visible).length,mission:this.currentMode,collision:{...this.cityBuilder.collisionSystem.getDebugStats(),lastCount:this.player.lastCollision?.count??0,trafficCollisions:n},cameraMode:this.cameraController.getMode().id,cameraLabel:this.cameraController.getMode().label,testDrive:!!this.testDrive})}decorateMissionResult(e){e.achievements=this.achievementManager.evaluate(e);const t=this.masteryManager.awardMission(this.playerConfig.id,e);if(e.masteryXp=t?.amount??0,this.activeCareerMissionId&&e.success){const i=this.careerManager.complete(this.activeCareerMissionId,e);e.career=i,e.newUnlocks=i?.unlocked??[]}this.activeCareerMissionId=null}handleHotkeys(){if(this.inputManager.consume("Escape")){this.pause();return}if(this.inputManager.consume("c")){const e=this.cameraController.nextMode();this.showCameraToast(e)}if(this.inputManager.consume("v")){const e=this.cameraController.toggleCockpit();this.showCameraToast(e)}if(this.inputManager.consume("r")&&(this.missionManager.noteReset(),this.resetPlayerNearRoad(),this.hudManager.showToast("Vehicle reset")),this.inputManager.consume("F3")||this.inputManager.consume("`")){const e=!this.saveManager.settings.debugOverlay;this.saveManager.updateSettings({debugOverlay:e}),this.hudManager.showToast(e?"Collision debug on":"Collision debug off")}}startMode(e,t,i={}){this.audioManager.unlock(),this.audioManager.play("click",.65),this.currentMode=e,this.testDrive=!!i.testDrive,e!=="freeDrive"&&(this.lastMissionMode=e),this.activeCareerMissionId=i.careerId??null,this.playerConfig=rn(t??this.saveManager.data.selectedCar),this.saveManager.setSelectedCar(this.playerConfig.id),this.spawnPlayer();let n=null;const r=vo(e);e==="freeDrive"?(this.missionManager.start("freeDrive"),n=Dg):n=this.missionManager.start(e,{carId:this.playerConfig.id,carName:this.playerConfig.name,shortName:this.playerConfig.shortName}),this.player.reset(n.position,n.heading),this.player.setMissionModifiers({accelerationMultiplier:r?.accelerationMultiplier??1}),this.missionHud=this.missionManager.getHudData(this.player.position),this.state="playing",this.pausedByBlur=!1,this.garageManager.hide(),this.hudManager.hideResult(),this.hudManager.hidePause(),this.hudManager.showHud(),this.audioManager.setMuted(!1);const a=this.activeCareerMissionId?"Career: ":"";this.hudManager.showToast(this.testDrive?"Test Drive started - press C for cockpit":e==="freeDrive"?"Free Drive started":`${a}${r?.name??"Mission"} started`)}spawnPlayer(){this.player?.mesh&&(this.cockpitManager.syncVehicleCull(this.player.mesh,!1),this.sceneManager.scene.remove(this.player.mesh));const e=this.customizationManager.getCarCustomization(this.playerConfig.id),t=this.customizationManager.resolveVisualColors(this.playerConfig,e),i=this.tuningManager.getEffectiveConfig(this.playerConfig),n=this.vehicleFactory.createCarMesh(i,{customization:{body:t.body,accent:t.accent,tintOpacity:t.tintOpacity,boostTrail:t.boostTrail,wheelStyle:e.wheels}});n.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),this.sceneManager.scene.add(n),this.player=new mv(n,i,this.cityBuilder,this.effectsManager,this.audioManager)}resetPlayerNearRoad(){if(!this.player)return;const e=this.player.position.clone(),t=this.cityBuilder.collisionSystem.findNearestRoadSurface(e,this.player.currentSurfaceInfo),i=t?.position??this.findNearestRoad(e),n=t?.heading??this.player.lastSafeHeading??this.player.heading;this.player.reset([i.x,0,i.z],n,t?.id??null)}findNearestRoad(e){let t=new C(0,0,16),i=1/0;return Jl.forEach(n=>{const r=new C(n.position[0],0,n.position[2]),a=r.distanceTo(e);a<i&&(i=a,t=r)}),this.cityBuilder.roadSegments.forEach(n=>{const r=new C(n.center[0],0,n.center[1]),a=r.distanceTo(e);a<i&&(i=a,t=r)}),this.cityBuilder.elevatedRoutes?.forEach(n=>{const r=new C(n.center[0],0,n.center[1]),a=r.distanceTo(e);a<i&&(i=a,t=r)}),t}pause(){this.state==="playing"&&(this.state="paused",this.hudManager.setPaused(!0),this.audioManager.setMuted(!0))}resume(){this.state==="paused"&&(this.sceneManager.clock.getDelta(),this.state="playing",this.hudManager.setPaused(!1),this.audioManager.setMuted(!1))}restartCurrentMode(){const e=this.currentMode==="freeDrive"?"freeDrive":this.lastMissionMode;this.startMode(e,this.saveManager.data.selectedCar)}openGarage(){this.state="garage",this.testDrive=!1,this.player?.mesh&&this.cockpitManager.syncVehicleCull(this.player.mesh,!1),this.cockpitManager.setVisible(!1),this.hudManager.hideHud(),this.hudManager.hidePause(),this.hudManager.hideResult(),this.audioManager.setMuted(!0),this.audioManager.setCockpitActive(!1),this.garageManager.show()}showCameraToast(e){this.hudManager.showToast(e),this.cameraController.getMode().id==="cockpit"&&!this.saveManager.settings.cockpitHintSeen&&(this.saveManager.updateSettings({cockpitHintSeen:!0}),window.setTimeout(()=>this.hudManager.showToast("Cockpit view enabled. Press C to switch camera."),260))}showResult(e){this.state="result",this.player?.mesh&&this.cockpitManager.syncVehicleCull(this.player.mesh,!1),this.cockpitManager.setVisible(!1),this.hudManager.showResult(e,this.playerConfig.name),this.audioManager.setMuted(!0)}applySettings(){this.audioManager.applyVolumes(),this.cameraController.setMode(this.saveManager.settings.cameraMode,!1);const e=this.saveManager.settings.visualQuality,t=e==="high"?1.8:e==="low"?1:1.45;this.sceneManager.renderer.setPixelRatio(Math.min(window.devicePixelRatio,t));const i=e!=="low";this.sceneManager.renderer.shadowMap.enabled=i,this.lastTrafficDensity!==this.saveManager.settings.trafficDensity&&(this.lastTrafficDensity=this.saveManager.settings.trafficDensity,this.trafficSystem.build())}onResize(){this.sceneManager.resize()}onBlur(){this.state==="playing"&&(this.pausedByBlur=!0,this.pause())}onFocus(){this.pausedByBlur&&(this.hudManager.showToast("Paused while tab was inactive"),this.pausedByBlur=!1)}dispose(){this.frameId&&window.cancelAnimationFrame(this.frameId),window.removeEventListener("resize",this.onResize),window.removeEventListener("blur",this.onBlur),window.removeEventListener("focus",this.onFocus),this.inputManager.dispose()}}const rd=document.querySelector("#game-root"),Jc=s=>{rd.innerHTML=`
    <div class="webgl-error">
      <div class="webgl-error__panel">
        <p class="eyebrow">Mini City Drive</p>
        <h1>WebGL could not start</h1>
        <p>${s}</p>
        <p class="webgl-error__hint">Try a modern browser with hardware acceleration enabled.</p>
      </div>
    </div>
  `};try{if(!window.WebGLRenderingContext)throw new Error("Your browser does not expose WebGL.");const s=new _v(rd);window.__MINI_CITY_DRIVE__=s,s.start().catch(e=>{s.dispose(),console.error("[Mini City Drive] startup failed",e),Jc(e?.message??"Unknown renderer startup error.")})}catch(s){console.error("[Mini City Drive] startup failed",s),Jc(s?.message??"Unknown renderer startup error.")}
