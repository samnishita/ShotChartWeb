(this["webpackJsonpshot-chart-react"]=this["webpackJsonpshot-chart-react"]||[]).push([[0],{101:function(t,e,c){},102:function(t,e,c){},103:function(t,e,c){"use strict";c.r(e);var n=c(0),a=c.n(n),r=c(14),o=c.n(r),s=(c(64),c(8)),i=(c(65),c(66),c(1));var l=function(){return Object(i.jsxs)("header",{className:"Header",children:[Object(i.jsxs)("div",{class:"header-grid-item",id:"title",children:["Custom NBA Shot Charts ",Object(i.jsx)("span",{id:"versionText",children:"Version 0.0"})]}),Object(i.jsxs)("div",{class:"header-grid-item",id:"date-accuracy",children:[Object(i.jsx)("div",{id:"accuracy-title",children:Object(i.jsx)("u",{children:"Accurate As Of"})}),Object(i.jsx)("div",{id:"accuracy-date",children:"July 3, 2021"})]})]})},u=c(9),d=c.n(u),h=c(13);c(69),c(70);var p=function(t){return Object(i.jsxs)("div",{className:"SearchTypeButtons",children:[Object(i.jsx)("button",{id:"simple-search-button",onClick:t.simpleClickHandler,children:"Simple Search"}),Object(i.jsx)("button",{id:"advanced-search-button",onClick:t.advancedClickHandler,children:"Advanced Search"})]})},f=(c(71),function(t){console.log("Updating ShotPercentageView");var e=0,c=0,n=0,a=0,r="--",o="--",s="--",l="--",u="--",d="--";return t.simpleShotData.simplesearch&&(t.simpleShotData.simplesearch.forEach((function(t){1==t.make&&"2PT Field Goal"===t.shottype?(e++,c++):0==t.make&&"2PT Field Goal"===t.shottype?c++:1==t.make&&"3PT Field Goal"===t.shottype?(n++,a++):a++})),0!==c&&(s=e+"/"+c,l=Number(e/c*100).toFixed(2)+"%"),0!==a&&(u=n+"/"+a,d=Number(n/a*100).toFixed(2)+"%"),c+a!==0&&(r=e+n+"/"+(c+a),o=Number((e+n)/(c+a)*100).toFixed(2)+"%")),Object(i.jsxs)("div",{className:"ShotPercentageView",children:[Object(i.jsx)("p",{className:"percentage-grid-item-title",children:"FG"}),Object(i.jsx)("p",{className:"percentage-grid-item-title",children:"2P"}),Object(i.jsx)("p",{className:"percentage-grid-item-title",children:"3P"}),Object(i.jsx)("p",{className:"percentage-grid-item-content",children:r}),Object(i.jsx)("p",{className:"percentage-grid-item-content",children:s}),Object(i.jsx)("p",{className:"percentage-grid-item-content",children:u}),Object(i.jsx)("p",{className:"percentage-grid-item-content",children:o}),Object(i.jsx)("p",{className:"percentage-grid-item-content",children:l}),Object(i.jsx)("p",{className:"percentage-grid-item-content",children:d})]})}),b=function(t){var e="2020-21",c=Object(n.useState)(e),a=Object(s.a)(c,2),r=a[0],o=a[1],l=Object(n.useState)({id:203932,playerfirstname:"Aaron",playerlastname:"Gordon"}),u=Object(s.a)(l,2),p=u[0],b=u[1],m=Object(n.useState)("Regular Season"),j=Object(s.a)(m,2),g=j[0],y=j[1],x=Object(n.useState)([]),O=Object(s.a)(x,2),v=O[0],w=O[1],k=Object(n.useState)([]),S=Object(s.a)(k,2),C=S[0],E=S[1],N=Object(n.useState)([]),T=Object(s.a)(N,2),B=T[0],L=T[1],D=Object(n.useState)([]),H=Object(s.a)(D,2),I=H[0],R=H[1],_=Object(n.useState)([]),z=Object(s.a)(_,2),A=z[0],V=z[1],P=Object(n.useState)({}),F=Object(s.a)(P,2),G=F[0],W=F[1],q=Object(n.useState)(t.latestSimpleViewType),M=Object(s.a)(q,2),Z=M[0],U=M[1],J=Object(n.useRef)({});J.current=r;var Y=Object(n.useRef)({});Y.current=p;var K=Object(n.useRef)({});K.current=g;var Q=Object(n.useRef)({}),X=Object(n.useRef)({}),$="",tt="";function et(t){return ct.apply(this,arguments)}function ct(){return(ct=Object(h.a)(d.a.mark((function t(e){var c;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("Fetching "+e),t.next=3,fetch(e,{method:"GET"}).then((function(t){return t.json()})).then((function(t){return t})).catch((function(t){return console.log("error",t)}));case 3:return c=t.sent,t.abrupt("return",c);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function nt(){return(nt=Object(h.a)(d.a.mark((function t(){var e;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,et("https://customnbashotcharts.com:8443/shots_request?init=true").then((function(t){t}));case 2:return e=t.sent,t.abrupt("return",e);case 4:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function at(t){return et("https://customnbashotcharts.com:8443/shots_request?activeplayers=".concat(t)).then((function(t){for(var e=[],c=0;c<t.activeplayers.length;c++)e.push({displayname:"".concat(t.activeplayers[c].firstname," ").concat(t.activeplayers[c].lastname).trim(),playerinfo:{id:t.activeplayers[c].id,playerfirstname:t.activeplayers[c].firstname,playerlastname:t.activeplayers[c].lastname}});return e.sort((function(t,e){return t.displayname<e.displayname?-1:t.displayname>e.displayname?1:0})),console.log("getActivePlayersData: "),w(e),e}))}function rt(t,e,c,n){return ot.apply(this,arguments)}function ot(){return(ot=Object(h.a)(d.a.mark((function t(e,c,n,a){var r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,et("https://customnbashotcharts.com:8443/shots_request?singleseasonactivity=true&playerlastname=".concat(a,"&playerfirstname=").concat(n,"&playerid=").concat(c,"&year=").concat(e)).then((function(t){console.log("getSeasonsData()");var e=[];1===t.singleseason[0].preseason&&e.push("Preseason"),1===t.singleseason[0].reg&&e.push("Regular Season"),1===t.singleseason[0].playoffs&&e.push("Playoffs"),e.includes(K.current)||(e.includes("Regular Season")?y("Regular Season"):y(e[e.length-1])),E(e)}));case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function st(){console.log("displayActivePlayers()");var t=[];v.forEach((function(e){t.push(Object(i.jsx)("p",{className:"dropdown-item player-display",playerid:e.playerinfo.id,onClick:function(t){return function(t){return dt.apply(this,arguments)}(t)},children:e.displayname}))})),R(t)}function it(){console.log("displayActiveSeasons()");var t=[];Object.values(C).map((function(e){return t.push(Object(i.jsx)("p",{className:"dropdown-item season-display",onClick:function(t){return function(t){return ht.apply(this,arguments)}(t)},children:e}))})),V(t)}function lt(t){return ut.apply(this,arguments)}function ut(){return(ut=Object(h.a)(d.a.mark((function t(e){var c,n,a;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(console.log("handleYearButtonClick()"),!e.target.classList.contains("year-display")||J.current===e.target.textContent){t.next=9;break}return o(e.target.textContent,console.log("Set selected year to "+e.target.textContent)),t.next=5,at(e.target.textContent);case 5:c=t.sent,n=[],c.forEach((function(t){return n.push(t.displayname)})),n.includes(Y.current.playerfirstname+" "+Y.current.playerlastname)?rt(e.target.textContent,Y.current.id,Y.current.playerfirstname,Y.current.playerlastname):(a=c[0],b({id:a.playerinfo.id,playerfirstname:a.playerinfo.playerfirstname,playerlastname:a.playerinfo.playerlastname}),console.log("Selected Player: "+a.displayname),rt(e.target.textContent,a.playerinfo.id,a.playerinfo.playerfirstname,a.playerinfo.playerlastname));case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function dt(){return(dt=Object(h.a)(d.a.mark((function t(e){return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:console.log("handlePlayerButtonClick()"),e.target.classList.contains("player-display")&&p!==e.target.textContent&&(b({id:e.target.getAttribute("playerid"),playerfirstname:X.current[e.target.getAttribute("playerid")][1],playerlastname:X.current[e.target.getAttribute("playerid")][2]},console.log("Set selected player to "+e.target.textContent)),rt(J.current,Q.current[e.target.textContent][0],Q.current[e.target.textContent][1],Q.current[e.target.textContent][2]));case 2:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function ht(){return(ht=Object(h.a)(d.a.mark((function t(e){return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:console.log("handleSeasonButtonClick()"),e.target.classList.contains("season-display")&&g!==e.target.textContent&&y(e.target.textContent);case 2:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function pt(t){if(!t.target.matches(".dropdown-button")){var e,c=document.getElementsByClassName("dropdown-content");for(e=0;e<c.length;e++){var n=c[e];n.classList.contains("show")&&n.classList.remove("show")}}}function ft(t,e){console.log("handleDDButtonClick()"),pt(t);var c,n=document.getElementsByClassName("dropdown-content");for(c=0;c<n.length;c++){var a=n[c];a.id!==e&&a.classList.remove("show")}document.getElementById(e).classList.toggle("show")}function bt(){return(bt=Object(h.a)(d.a.mark((function e(){var c,n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("runSimpleSearch()"),c="https://customnbashotcharts.com:8443/shots_request?year=".concat(J.current,"&seasontype=").concat(K.current,"&simplesearch=true&playerid=").concat(Y.current.id,"&playerlastname=").concat(Y.current.playerlastname,"&playerfirstname=").concat(Y.current.playerfirstname),console.log("Fetching "+c),e.next=5,fetch(c,{method:"GET"}).then((function(t){return t.json()})).then((function(e){return t.setTitle("".concat(Y.current.playerfirstname," ").concat(Y.current.playerlastname,", ").concat(J.current," ").concat(K.current)),t.updateLatestSimpleSearchData(e),t.updateLatestSimpleViewType(Z),W(e),e})).catch((function(t){return console.log("error",t)}));case 5:return n=e.sent,e.abrupt("return",n);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function mt(t){U(t.target.textContent)}return window.onclick=pt,Object(n.useEffect)((function(){!function(){nt.apply(this,arguments)}(),function(){var t={},e={};return console.log("getInitPlayersData()"),et("https://customnbashotcharts.com:8443/shots_request?initallplayers=true").then((function(c){for(var n=0;n<c.initallplayers.length;n++){var a=[3];a[0]=c.initallplayers[n].id,a[1]=c.initallplayers[n].firstname,a[2]=c.initallplayers[n].lastname,t[(c.initallplayers[n].firstname+" "+c.initallplayers[n].lastname).trim()]=a,e[c.initallplayers[n].id]=a}return $=t,tt=e,Q.current=$,X.current=tt,c}))}().then((function(t){at(e),rt(e,p.id,p.playerfirstname,p.playerlastname)})),function(t){if(0===B.length){console.log("displayAllYears()");for(var e,c=Number(t.substring(0,4)),n=[];c>=1996;)e=(c-1899)%100<10?"0"+(c-1899)%100:""+(c-1899)%100,n.push(Object(i.jsx)("p",{className:"dropdown-item year-display",onClick:function(t){return lt(t)},children:c+"-"+e})),c--;L(n)}}(e)}),[]),Object(n.useEffect)((function(){st()}),[v]),Object(n.useEffect)((function(){it()}),[C]),Object(i.jsxs)("div",{className:"SimpleSearchBox",children:[Object(i.jsx)("div",{className:"search-box-body",children:Object(i.jsxs)("div",{className:"search-box-inner-body",children:[Object(i.jsx)("h6",{children:"Choose your search parameters"}),Object(i.jsxs)("button",{class:"dropdown-button",onClick:function(t){ft(t,"season-dd")},children:[r,Object(i.jsx)("div",{className:"dropdown-content scrollable",id:"season-dd",children:B})]}),Object(i.jsx)("br",{}),Object(i.jsxs)("button",{class:"dropdown-button",onClick:function(t){return ft(t,"player-dd")},children:[p.playerfirstname," ",p.playerlastname,Object(i.jsx)("div",{className:"dropdown-content scrollable",id:"player-dd",children:I})]}),Object(i.jsx)("br",{}),Object(i.jsxs)("button",{class:"dropdown-button",onClick:function(t){return ft(t,"season-type-dd")},children:[g,Object(i.jsx)("div",{className:"dropdown-content",id:"season-type-dd",children:A})]}),Object(i.jsx)("br",{}),Object(i.jsxs)("button",{class:"dropdown-button",id:"view-selector",onClick:function(t){return ft(t,"view-selection-dd")},children:[Z,Object(i.jsxs)("div",{className:"dropdown-content",id:"view-selection-dd",children:[Object(i.jsx)("p",{className:"dropdown-item view-display",onClick:function(t){return mt(t)},children:"Traditional"}),Object(i.jsx)("p",{className:"dropdown-item view-display",onClick:function(t){return mt(t)},children:"Grid"}),Object(i.jsx)("p",{className:"dropdown-item view-display",onClick:function(t){return mt(t)},children:"Zone"}),Object(i.jsx)("p",{className:"dropdown-item view-display",onClick:function(t){return mt(t)},children:"Heat"})]})]}),Object(i.jsx)("button",{id:"run-simple-search-button",onClick:function(t){return function(){return bt.apply(this,arguments)}()},children:"Run It"})]})}),Object(i.jsx)(f,{simpleShotData:G})]})},m=(c(72),c.p+"static/media/newbackcourt.18ebe08e.png"),j=c.p+"static/media/transparent.37e32258.png",g=c(11),y=c.n(g),x=function(t){var e=Object(n.useState)([window.innerHeight,window.innerWidth]),c=Object(s.a)(e,2),a=c[0],r=c[1],o=Object(n.useState)([]),l=Object(s.a)(o,2),u=l[0],p=l[1],f=Object(n.useState)([]),b=Object(s.a)(f,2),x=b[0],O=b[1],v=Object(n.useState)([]),w=Object(s.a)(v,2),k=w[0],S=w[1],C=Object(n.useState)([]),E=Object(s.a)(C,2),N=E[0],T=E[1];function B(t){document.getElementById(t).classList.contains("show")&&document.getElementById(t).classList.toggle("show")}function L(t){document.getElementById(t).classList.contains("show")||document.getElementById(t).classList.toggle("show")}function D(){switch(t.latestSimpleViewType){case"Traditional":"undefined"===typeof t.simpleShotData.simplesearch?(L("transparent-court"),B("trad-court"),B("transparent-court-on-top"),B("gray-background")):(L("trad-court"),B("transparent-court"),B("transparent-court-on-top"),B("gray-background"));break;case"Grid":L("transparent-court"),L("gray-background"),B("trad-court"),B("transparent-court-on-top");break;case"Heat":L("transparent-court"),B("gray-background"),B("trad-court"),B("transparent-court-on-top");break;case"Zone":L("transparent-court-on-top"),B("trad-court"),B("gray-background"),B("transparent-court")}}function H(){a[0]!==window.innerHeight||a[1]!==window.innerWidth?(console.log("Size Not Okay"),console.log("".concat(window.innerHeight,"!=").concat(a[0]," OR ").concat(window.innerWidth,"!=").concat(a[1])),r([window.innerHeight,window.innerWidth],(function(){I(t.latestSimpleViewType)}))):(console.log("Size Okay"),console.log("".concat(window.innerHeight,"=").concat(a[0]," AND ").concat(window.innerWidth,"=").concat(a[1])))}function I(e){switch(console.log("Determining viewtype: "+e),e){case"Traditional":return console.log("Displaying Traditional"),function(){console.log("displayTraditional()");var e=t.simpleShotData.simplesearch,c=[];if(e){var n=document.getElementById("trad-court").clientHeight,a=document.getElementById("trad-court").clientWidth,r=1.1*n,o=1.1*a,s=5*n/470,l=2*n/470;e.forEach((function(t){t.y<=410&&(1===t.make?c.push(Object(i.jsx)(g.Circle,{cx:o/2+t.x*a/500,cy:r/2+t.y*n/470-185*n/470,r:s,fill:"none",stroke:"limegreen",strokeWidth:l})):(c.push(Object(i.jsx)(g.Line,{x1:o/2-s+t.x*a/500,y1:r/2-s+t.y*n/470-185*n/470,x2:o/2+s+t.x*a/500,y2:r/2+s+t.y*n/470-185*n/470,stroke:"red",strokeWidth:l})),c.push(Object(i.jsx)(g.Line,{x1:o/2+s+t.x*a/500,y1:r/2-s+t.y*n/470-185*n/470,x2:o/2-s+t.x*a/500,y2:r/2+s+t.y*n/470-185*n/470,stroke:"red",strokeWidth:l}))))}));var u={position:"absolute",transform:"translate(".concat(-o/2,"px, ").concat(-r/2,"px)")};return D(),Object(i.jsx)("div",{id:"inner-imageview-div",style:u,children:Object(i.jsx)(y.a,{className:"imageview-child",height:r,width:o,children:c})})}return c}();case"Grid":return 0===u.length&&(console.log("Displaying Grid"),function(){if(t.simpleShotData.simplesearch){for(var e={},c=10,n=-55;n<400;n+=c)for(var a=-250;a<250;a+=c){var r={};r.x=a,r.y=n,r.shotinfo=[0,0,0],e["tile_".concat(a,"_").concat(n)]=r}var o=.007,s=t.simpleShotData.simplesearch.filter((function(t){return t.y<=400})),i=t.simpleShotData.simplesearch.length;Object.keys(e).forEach((function(t){var n=e[t].x+5+1.5*c,a=e[t].x+5-1.5*c,r=e[t].y+5+1.5*c,o=e[t].y+5-1.5*c;s.forEach((function(c){c.x<n&&c.x>=a&&c.y<r&&c.y>=o&&(e[t].shotinfo[1]=e[t].shotinfo[1]+1,1===c.make&&(e[t].shotinfo[0]=e[t].shotinfo[0]+1))}))})),Object.values(e).forEach((function(t){0!==t.shotinfo[1]&&(t.shotinfo[2]=t.shotinfo[0]/t.shotinfo[1])}));var l=0,u=0,d=0,h=2,f=0,b=10,m=20,j=0,g={};Object.keys(e).forEach((function(t){e[t].x%b===0&&(e[t].y-5)%b===0&&(u=0,d=0,Object.keys(e).forEach((function(c){j=R(e[t],e[c]),t!==c&&j<m&&(f=e[c].shotinfo[2],u+=f/Math.pow(j,h),d+=1/Math.pow(R(e[t],e[c]),h))})),l=u/d,g[t]=l)}));var y=1,x=45e-5;i*x>1?y=i*x:o=4.1008*Math.pow(i,-.798);var O,v,w=0;0==(w=o*i)&&(w=1);var S=[];Object.keys(e).forEach((function(t){var c=0,n=e[t].shotinfo[1];n<w&&n>y?c=n/w:n>w&&(c=1),O="("+e[t].x+","+e[t].y+")",v=k[O];var a="";a=g[t]>v+.07?"#fc2121":g[t]>v+.05&&g[t]<=v+.07?"#ff6363":g[t]>v+.015&&g[t]<=v+.05?"#ff9c9c":g[t]>v-.015&&g[t]<=v+.015?"white":g[t]>v-.05&&g[t]<=v-.015?"#aed9ff":g[t]>v-.07&&g[t]<=v-.05?"#8bc9ff":"#7babff",S.push({x:e[t].x,y:e[t].y,tileFill:a,squareSide:c})})),p(S)}}()),function(){if(console.log(u.length>0),u.length>0){var t=document.getElementById("transparent-court").clientHeight,e=document.getElementById("transparent-court").clientWidth,c=1.1*t,n=1.1*e,a=e/50,r=[];u.forEach((function(e){var o=e.squareSide*a*.9,s=e.tileFill,l=(e.x+(a-o)/2)*t/470,u=(e.y-175+(a-o)/2)*t/470;0!==o&&r.push(Object(i.jsx)(g.Rect,{x:n/2+l,y:c/2+u-5,width:o,height:o,fill:s,opacity:"0.8"}))}));var o=Object(i.jsx)(y.a,{className:"imageview-child grid-tile",height:c,width:n,children:r});return D(),o}}();case"Zone":return console.log("Displaying Zone"),function(){if(D(),t.simpleShotData.simplesearch){var e=V(),c=[],n="",a=document.getElementById("transparent-court-on-top").clientHeight,r=document.getElementById("transparent-court-on-top").clientWidth,o=1.1*a,s=1.1*r;console.log("height: ".concat(a)),console.log("width: ".concat(r));for(var l=1;l<e.length;l++){if(0===e[l][1])n="rgba(178,178,178, 1)";else{var u=e[l][2]-N[l];u>.06?n="rgba(252,33,33, 1)":u<.06&&u>=.04?n="rgba(255,99,99, 1)":u<.04&&u>=.02?n="rgba(255,156,156, 1)":u<.02&&u>=-.02?n="rgba(178,178,178, 1)":u<-.02&&u>=-.04?n="rgba(145,198,244, 1)":u<-.04&&u>=-.06?n="rgba(86,176,255, 1)":u<-.06&&(n="rgba(35,115,255, 1)")}var d="",h="zone".concat(l),p=s/2,f=o/2,b=F(18),m=(F(16),F(10*b),F(3)),j="rgba(0,0,0,1)";switch(l){case 1:d="m ".concat(p-F(39)," ").concat(f-F(233),"  l ").concat(F(78)," 0 l0 ").concat(F(56)," a").concat(F(4),",").concat(F(3.7)," 0 0,1 ").concat(F(-77),",0 l0 ").concat(F(-56));break;case 2:d="m ".concat(p-F(80)," ").concat(f-F(233)," l ").concat(F(41)," 0 l0 ").concat(F(56)," a").concat(F(4),",").concat(F(3.7)," 0 0,0 ").concat(F(77),",0  l0 ").concat(F(-56)," l").concat(F(40)," 0 l0 ").concat(F(56),"a").concat(F(5),",").concat(F(5.25)," 0 0,1 ").concat(F(-157),",0 l0 ").concat(F(-56));break;case 3:var x=85,O=170;d="m ".concat(p-F(160)," ").concat(f-F(233)," l ").concat(F(81)," 0 l0 ").concat(F(56)," a").concat(F(x),",").concat(F(x)," 0 0,0 ").concat(F(38.7),",").concat(F(71.2)," l").concat(F(-41)," ").concat(F(73)," a").concat(F(O),",").concat(F(O)," 0 0,1 ").concat(F(-78.6)," ").concat(F(-145),"  l0 ").concat(F(-56));break;case 4:var v=85,w=160;d="m ".concat(p-F(40)," ").concat(f-F(105),"  a").concat(F(v),",").concat(F(v)," 0 0,0 ").concat(F(80)," 0 l").concat(F(41)," ").concat(F(71.8)," a").concat(F(w),",").concat(F(w)," 0 0,1 ").concat(F(-162)," 0 l").concat(F(41)," ").concat(F(-73));break;case 5:var k=85,S=170;d="m ".concat(p+F(78)," ").concat(f-F(233)," l ").concat(F(80)," 0 l0 ").concat(F(56)," a").concat(F(S),",").concat(F(S)," 0 0,1 ").concat(F(-77.4)," ").concat(F(143.5)," l").concat(F(-41)," ").concat(F(-72.6)," a").concat(F(k),",").concat(F(k)," 0 0,0 ").concat(F(38.7),",").concat(F(-71.2),"  l0 ").concat(F(-56));break;case 6:var C=200;d="m ".concat(p-F(219)," ").concat(f-F(233),"  l ").concat(F(59)," 0 l0 ").concat(F(56)," a").concat(F(C),",").concat(F(C)," 0 0,0 ").concat(F(24),",").concat(F(88.5)," l").concat(F(-60)," ").concat(F(40),"  a").concat(F(C),",").concat(F(C)," 0 0,1 ").concat(F(-22.75),",").concat(F(-48)," l0 ").concat(F(-137));break;case 7:var E=150,T=230;d="m ".concat(p-F(136)," ").concat(f-F(89),"  a").concat(F(E),",").concat(F(E)," 0 0,0 ").concat(F(80)," ").concat(F(68)," l").concat(F(-22)," ").concat(F(65)," a").concat(F(T),",").concat(F(T)," 0 0,1 ").concat(F(-118)," ").concat(F(-92.5)," l").concat(F(60)," ").concat(F(-40));break;case 8:var B=150,L=230;d="m ".concat(p+F(-57)," ").concat(f-F(21),"  a").concat(F(B),",").concat(F(B)," 0 0,0 ").concat(F(113)," 0 l").concat(F(21.5)," ").concat(F(65)," a").concat(F(L),",").concat(F(L)," 0 0,1 ").concat(F(-155.5)," 0 l").concat(F(22)," ").concat(F(-65)," ");break;case 9:var H=150,I=230;d="m ".concat(p+F(135)," ").concat(f-F(90)," l").concat(F(61)," ").concat(F(42)," a").concat(F(I),",").concat(F(I)," 0 0,1 ").concat(F(-118)," ").concat(F(92.5)," l").concat(F(-22)," ").concat(F(-66)," a").concat(F(H),",").concat(F(H)," 0 0,0 ").concat(F(80)," ").concat(F(-70),"  ");break;case 10:var R=200;d="m ".concat(p+F(158)," ").concat(f-F(233),"  l ").concat(F(60.5)," 0 l0 ").concat(F(137)," a").concat(F(R),",").concat(F(R)," 0 0,1 ").concat(F(-22.75),",").concat(F(48),"  l").concat(F(-60)," ").concat(F(-41.5),"  a").concat(F(R),",").concat(F(R)," 0 0,0 ").concat(F(23),",").concat(F(-88.5)," l0 ").concat(F(-56));break;case 11:d="m ".concat(p-F(248)," ").concat(f-F(233),"  l").concat(F(30)," 0 l0 ").concat(F(137),"l").concat(F(-30)," 0 l0 ").concat(F(-137));break;case 12:var _=220;d="m ".concat(p-F(248)," ").concat(f-F(96)," l").concat(F(30)," 0 a").concat(F(_),",").concat(F(_)," 0 0,0 ").concat(F(129),",").concat(F(136)," l").concat(F(-77)," ").concat(F(193)," l").concat(F(-82)," 0 l0 ").concat(F(-330));break;case 13:var z=245;d="m ".concat(p-F(90)," ").concat(f+F(40),"  a").concat(F(z),",").concat(F(z)," 0 0,0 ").concat(F(179),",0 l").concat(F(77)," ").concat(F(193.5)," l").concat(F(-333)," 0 l").concat(F(77)," ").concat(F(-193));break;case 14:var A=220;d="m ".concat(p+F(219)," ").concat(f-F(96)," l").concat(F(30)," 0 l0 ").concat(F(330)," l").concat(F(-83)," 0 l").concat(F(-77)," ").concat(F(-193.5)," a").concat(F(A),",").concat(F(A)," 0 0,0 ").concat(F(130),",").concat(F(-137),"  ");break;case 15:d="m ".concat(p+F(219)," ").concat(f-F(233),"  l").concat(F(30)," 0 l0 ").concat(F(137),"l").concat(F(-30)," 0 l0 ").concat(F(-137))}c.push(Object(i.jsx)(g.Path,{id:h,d:d,fill:n,stroke:j,strokeWidth:m}))}var P={position:"absolute",transform:"translate(".concat(-s/2,"px, ").concat(-o/2,"px)"),zIndex:0};return Object(i.jsx)("div",{id:"inner-imageview-div",style:P,children:Object(i.jsx)(y.a,{className:"imageview-child",id:"zones-underneath",height:o,width:s,children:c})})}}();case"Heat":return 0===x.length&&(console.log("Displaying Heat"),function(){if(t.simpleShotData.simplesearch){for(var e={},c=-250;c<250;c++)for(var n=-55;n<400;n++)e["tile_".concat(c,"_").concat(n)]={x:c,y:n,shotinfo:[0,0,0]};var a=t.simpleShotData.simplesearch.filter((function(t){return t.y<=400})),r=t.simpleShotData.simplesearch.length;a.forEach((function(t){e["tile_".concat(t.x,"_").concat(t.y)].shotinfo[1]=e["tile_".concat(t.x,"_").concat(t.y)].shotinfo[1]+1,1===t.make&&(e["tile_".concat(t.x,"_").concat(t.y)].shotinfo[0]=e["tile_".concat(t.x,"_").concat(t.y)].shotinfo[0]+1)})),Object.values(e).forEach((function(t){0!==t.shotinfo[1]&&(t.shotinfo[2]=t.shotinfo[0]/t.shotinfo[1])}));var o=0,s=0,i=2,l=15,u=30,d={};Object.keys(e).forEach((function(t){if(e[t].x%l===0&&e[t].y%l===0){o=0,s=0;for(var c=e[t].x-u>=-250?e[t].x-u:-250,n=e[t].x+u<250?e[t].x+u:249,a=e[t].y-u>=-55?e[t].y-u:-55,r=e[t].y+u<400?e[t].y+u:399,h=c;h<=n;h++)for(var p=a;p<=r;p++){var f=R(e[t],e["tile_".concat(h,"_").concat(p)]);f<u&&f>0&&(o+=e["tile_".concat(h,"_").concat(p)].shotinfo[1]*f/Math.pow(f,i),s+=1/Math.pow(f,i))}d[t]=o/s}}));var h=0;Object.values(d).forEach((function(t){t>h&&(h=t)}));var p=[];if(console.log("maxValue: "+h),0!=h){var f=4e-5*r/(h*=500/r)+.3065,b=f/7;Object.keys(d).forEach((function(t){var c="",n="",a=d[t];a>h*(f-6*b)&&(a>h*(f-6*b)&&a<=h*(f-5*b)?(c="#bc53f8",n="1"):a>h*(f-5*b)&&a<=h*(f-4*b)?(c="#dd76ff",n="2"):a>h*(f-4*b)&&a<=h*(f-3*b)?(c="#e696fa",n="3"):a>h*(f-3*b)&&a<=h*(f-2*b)?(c="#c4b8ff",n="4"):a>h*(f-2*b)&&a<=h*(f-1*b)?(c="#6bb2f8",n="5"):a>h*(f-1*b)&&a<=h*f?(c="#62c8ff",n="6"):(c="#90ebff",n="7"),p.push({x:e[t].x,y:e[t].y,color:c,circleArray:n}))})),O(p)}}}()),function(){if(x.length>0){var t=[],e=[],c=[],n=[],a=[],r=[],o=[],s=[],l=document.getElementById("transparent-court").clientHeight,u=document.getElementById("transparent-court").clientWidth,d=1.1*l,h=1.1*u,p=25*l/470;return x.forEach((function(f){var b=h/2+f.x*u/500,m=d/2+f.y*l/470-185*l/470,j=Object(i.jsx)(g.Circle,{cx:b,cy:m,r:p,fill:"url(#grad_".concat(f.x,"_").concat(f.y,")"),stroke:"none",strokeWidth:"3"});switch(f.circleArray){case"1":t.push(j);break;case"2":e.push(j);break;case"3":c.push(j);break;case"4":n.push(j);break;case"5":a.push(j);break;case"6":r.push(j);break;case"7":o.push(j)}var y=Object(i.jsxs)(g.RadialGradient,{id:"grad_".concat(f.x,"_").concat(f.y),cx:b,cy:m,r:p,fx:b,fy:m,gradientUnits:"userSpaceOnUse",children:[Object(i.jsx)(g.Stop,{offset:"0",stopColor:f.color,stopOpacity:"0.8"}),Object(i.jsx)(g.Stop,{offset:"1",stopColor:f.color,stopOpacity:"0"})]});s.push(y)})),D(),Object(i.jsxs)(y.a,{className:"imageview-child",height:1.1*l,width:1.1*u,children:[Object(i.jsx)(g.Defs,{children:s}),t,e,c,n,a,r,o]})}return Object(i.jsx)("div",{})}()}}function R(t,e){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))}function _(){return(_=Object(h.a)(d.a.mark((function t(){var e;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("getGridAverages()"),t.next=3,z("https://customnbashotcharts.com:8443/shots_request?gridaverages=true").then((function(t){var e={};return t.gridaverages.forEach((function(t){return e[t.uniqueid]=t.average})),e}));case 3:return e=t.sent,t.abrupt("return",e);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function z(t){return A.apply(this,arguments)}function A(){return(A=Object(h.a)(d.a.mark((function t(e){var c;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("Fetching "+e),t.next=3,fetch(e,{method:"GET"}).then((function(t){return t.json()})).then((function(t){return t})).catch((function(t){return console.log("error",t)}));case 3:return c=t.sent,t.abrupt("return",c);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function V(){var e=t.simpleShotData.simplesearch;if(e){for(var c=function(t,e){n[t][1]=n[t][1]+1,e&&(n[t][0]=n[t][0]+1)},n=[],a=0;a<16;a++){n.push([0,0,0])}return e.forEach((function(t){switch(t.shotzonebasic){case"Backcourt":break;case"Restricted Area":c(1,t.make);break;case"In The Paint (Non-RA)":switch(t.shotzonearea){case"Left Side(L)":switch(t.shotzonerange){case"8-16 ft.":c(3,t.make)}break;case"Center(C)":switch(t.shotzonerange){case"Less Than 8 ft.":c(2,t.make);break;case"8-16 ft.":c(4,t.make)}break;case"Right Side(R)":switch(t.shotzonerange){case"8-16 ft.":c(5,t.make)}}break;case"Mid-Range":switch(t.shotzonearea){case"Left Side(L)":switch(t.shotzonerange){case"8-16 ft.":c(3,t.make);break;case"16-24 ft.":c(6,t.make)}break;case"Left Side Center(LC)":switch(t.shotzonerange){case"16-24 ft.":c(7,t.make)}break;case"Center(C)":switch(t.shotzonerange){case"8-16 ft.":c(4,t.make);break;case"16-24 ft.":c(8,t.make)}break;case"Right Side Center(RC)":switch(t.shotzonerange){case"16-24 ft.":c(9,t.make)}break;case"Right Side(R)":switch(t.shotzonerange){case"8-16 ft.":c(5,t.make);break;case"16-24 ft.":c(10,t.make)}}break;case"Left Corner 3":c(11,t.make);break;case"Right Corner 3":c(15,t.make);break;case"Above the Break 3":switch(t.shotzonearea){case"Left Side Center(LC)":switch(t.shotzonerange){case"24+ ft.":c(12,t.make)}break;case"Center(C)":switch(t.shotzonerange){case"24+ ft.":c(13,t.make)}break;case"Right Side Center(RC)":switch(t.shotzonerange){case"24+ ft.":c(14,t.make)}}}})),n.forEach((function(t){0!==t[1]&&(t[2]=1*t[0]/t[1])})),n}return Object(i.jsx)("div",{})}function P(){return(P=Object(h.a)(d.a.mark((function t(){var e;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("getZoneAverages()"),t.next=3,z("https://customnbashotcharts.com:8443/shots_request?zoneaverages=true").then((function(t){var e={};return t.zoneaverages.forEach((function(t){return e[t.uniqueid]=t.average})),e}));case 3:return e=t.sent,t.abrupt("return",e);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function F(t){return 0===document.getElementById("transparent-court").clientHeight?t*document.getElementById("transparent-court-on-top").clientHeight/470:t*document.getElementById("transparent-court").clientHeight/470}return Object(n.useEffect)((function(){H()}),[a]),Object(n.useEffect)((function(){window.addEventListener("resize",H),D()}),[]),Object(n.useEffect)((function(){p([]),O([])}),[t.simpleShotData]),Object(n.useEffect)((function(){I(t.latestSimpleViewType)}),[u,x,t.simpleShotData]),console.log("Updating ShotView"),Object(n.useEffect)((function(){(function(){return _.apply(this,arguments)})().then((function(t){return S(t)})),function(){return P.apply(this,arguments)}().then((function(t){return T(t)}))}),[]),Object(i.jsxs)("div",{className:"ShotView",children:[Object(i.jsx)("p",{id:"view-title",children:t.title}),Object(i.jsxs)("div",{id:"imageview-div",children:[Object(i.jsx)("div",{className:"court-image",id:"gray-background",height:null===document.getElementById("transparent-court")?0:document.getElementById("transparent-court").clientHeight,children:Object(i.jsx)(y.a,{height:"100%",width:"100%",children:Object(i.jsx)(g.Rect,{height:"100%",width:"100%",fill:"#505050"})})}),Object(i.jsx)("img",{src:j,className:"court-image",id:"transparent-court"}),Object(i.jsx)("img",{src:m,className:"court-image",id:"trad-court"}),Object(i.jsx)("img",{src:j,className:"court-image",id:"transparent-court-on-top"}),I(t.latestSimpleViewType),function(){if(t.simpleShotData.simplesearch&&"Zone"===t.latestSimpleViewType){for(var e=V(),c=[],n=1.1*document.getElementById("transparent-court-on-top").clientHeight,a=1.1*document.getElementById("transparent-court-on-top").clientWidth,r=F(18),o=F(16),s=F(10*r),l={fontSize:r,margin:"0px"},u={fontSize:o,margin:"0px"},d=1;d<e.length;d++){var h={position:"absolute",width:s,backgroundColor:"transparent",zIndex:1};switch(d){case 1:h.transform="translate(0px,".concat(-F(215),"px)");break;case 2:h.transform="translate(0px,".concat(-F(120),"px)");break;case 3:h.transform="translate(".concat(-F(115),"px,").concat(-F(155),"px)");break;case 4:h.transform="translate(0px,".concat(-F(57),"px)");break;case 5:h.transform="translate(".concat(F(115),"px,").concat(F(-155),"px)");break;case 6:h.transform="translate(".concat(-F(185),"px,").concat(-F(115),"px)");break;case 7:h.transform="translate(".concat(-F(120),"px,").concat(-F(20),"px)");break;case 8:h.transform="translate(0px,".concat(F(20),"px)");break;case 9:h.transform="translate(".concat(F(120),"px,").concat(-F(20),"px)");break;case 10:h.transform="translate(".concat(F(185),"px,").concat(-F(115),"px)");break;case 11:h.transform="translate(".concat(F(-210),"px,").concat(-F(200),"px)");break;case 12:h.transform="translate(".concat(-F(165),"px,").concat(F(70),"px)");break;case 13:h.transform="translate(0px,".concat(F(100),"px)");break;case 14:h.transform="translate(".concat(F(165),"px,").concat(F(70),"px)");break;case 15:h.transform="translate(".concat(F(210),"px,").concat(-F(200),"px)")}var p="0%";0!==e[d][1]&&(p=100*e[d][0]/e[d][1]%1===0?"".concat(Number(e[d][0]/e[d][1]*100).toFixed(0),"%"):"".concat(Number(e[d][0]/e[d][1]*100).toFixed(1),"%")),c.push(Object(i.jsxs)("div",{height:n,width:a,style:h,children:[Object(i.jsx)("p",{className:"labelFrac",style:l,children:"".concat(e[d][0],"/").concat(e[d][1])}),Object(i.jsx)("p",{className:"labelPerc",style:u,children:p})]}))}return c}}()]}),Object(i.jsx)("br",{}),Object(i.jsx)("button",{onClick:function(){return t.updateLatestSimpleViewType("Traditional")},children:"Traditional"}),Object(i.jsx)("button",{onClick:function(){return t.updateLatestSimpleViewType("Grid")},children:"Grid"}),Object(i.jsx)("button",{onClick:function(){return t.updateLatestSimpleViewType("Zone")},children:"Zone"}),Object(i.jsx)("button",{onClick:function(){return t.updateLatestSimpleViewType("Heat")},children:"Heat"})]})};c(101),c(102);var O=function(){return Object(i.jsx)("div",{className:"SelectionViewer",children:"Text Will Go Here"})};var v=function(){function t(t){return Object(i.jsx)("button",{class:"dropdown-button",children:t})}return Object(i.jsxs)("div",{className:"AdvancedSearchBox",children:[Object(i.jsx)("div",{className:"search-box-body",children:Object(i.jsxs)("div",{className:"search-box-inner-body",children:[Object(i.jsx)("h6",{children:"Choose your search parameters"}),Object(i.jsxs)("div",{id:"selection-scrollable",children:[Object(i.jsxs)("p",{children:["Seasons: ",Object(i.jsx)("button",{children:"Begin"})," - ",Object(i.jsx)("button",{children:"End"})]}),Object(i.jsxs)("p",{children:["Players: ",t("Choose Players")]}),Object(i.jsxs)("p",{children:["Season Types: ",t("Choose Season Types")]}),Object(i.jsxs)("p",{children:["Shot Distance (ft.): ",Object(i.jsx)("button",{children:"Begin"})," - ",Object(i.jsx)("button",{children:"End"})]}),Object(i.jsxs)("p",{children:["Shot Success: ",t("Choose Makes or Misses")]}),Object(i.jsxs)("p",{children:["Shot Value: ",t("Choose 2PT or 3PT")]}),Object(i.jsxs)("p",{children:["Shot Types: ",t("Choose Shot Types")]}),Object(i.jsxs)("p",{children:["Shooting Teams: ",t("Choose Teams")]}),Object(i.jsxs)("p",{children:["Home Teams: ",t("Choose Home Teams")]}),Object(i.jsxs)("p",{children:["Away Teams: ",t("Choose Away Teams")]}),Object(i.jsxs)("p",{children:["Court Areas: ",t("Choose Court Areas")]}),Object(i.jsxs)("p",{children:["Sides of Court: ",t("Choose Sides of Court")]})]}),Object(i.jsx)("button",{className:"static-button",children:"Run It"}),Object(i.jsx)("button",{className:"static-button",children:"View Selection"}),Object(i.jsx)("br",{}),Object(i.jsx)("p",{children:"Current Selections: "}),Object(i.jsx)(O,{})]})}),Object(i.jsx)(f,{})]})},w=function(){var t=Object(n.useState)({}),e=Object(s.a)(t,2),c=e[0],a=e[1],r=Object(n.useState)("Traditional"),o=Object(s.a)(r,2),u=o[0],d=o[1],h=Object(n.useState)(""),f=Object(s.a)(h,2),m=f[0],j=f[1],g=Object(n.useRef)({});g.current=u;var y=Object(n.useState)(Object(i.jsx)(b,{updateLatestSimpleSearchData:function(t){a(t,console.log("Updated latest search with"+t))},updateLatestSimpleViewType:function(t){return d(t,console.log("Updated view type with "+t))},latestSimpleViewType:g.current,setTitle:j})),O=Object(s.a)(y,2),w=O[0],k=O[1];return Object(i.jsxs)("div",{className:"App",children:[Object(i.jsx)(l,{}),Object(i.jsxs)("div",{className:"BaseGrid",children:[Object(i.jsxs)("div",{children:[Object(i.jsx)(p,{simpleClickHandler:function(){w!==Object(i.jsx)(b,{})&&k(Object(i.jsx)(b,{}))},advancedClickHandler:function(){w!==Object(i.jsx)(v,{})&&k(Object(i.jsx)(v,{}))}}),w]}),Object(i.jsx)("div",{className:"basegrid-grid-item",id:"shotview-grid-item",children:Object(i.jsx)(x,{simpleShotData:c,updateLatestSimpleViewType:function(t){return d(t,console.log("Updated view type with "+t))},latestSimpleViewType:g.current,title:m})})]})]})},k=function(t){t&&t instanceof Function&&c.e(3).then(c.bind(null,105)).then((function(e){var c=e.getCLS,n=e.getFID,a=e.getFCP,r=e.getLCP,o=e.getTTFB;c(t),n(t),a(t),r(t),o(t)}))};o.a.render(Object(i.jsx)(a.a.StrictMode,{children:Object(i.jsx)(w,{})}),document.getElementById("root")),k()},64:function(t,e,c){},65:function(t,e,c){},66:function(t,e,c){},69:function(t,e,c){},70:function(t,e,c){},71:function(t,e,c){},72:function(t,e,c){}},[[103,1,2]]]);
//# sourceMappingURL=main.888fd269.chunk.js.map