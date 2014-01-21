/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/
 
 Sbi=this.Sbi||{};Sbi.sdk={version:"2.2"};Sbi.sdk.apply=function(d,e,b){if(b){Sbi.sdk.apply(d,b)}if(d&&e&&typeof e=="object"){for(var a in e){d[a]=e[a]}}return d};Sbi.sdk.namespace=function(){var a=arguments,o=null,i,j,d,rt;for(i=0;i<a.length;++i){d=a[i].split(".");rt=d[0];eval("if (typeof "+rt+' == "undefined"){'+rt+" = {};} o = "+rt+";");for(j=1;j<d.length;++j){o[d[j]]=o[d[j]]||{};o=o[d[j]]}}};Sbi.sdk.urlEncode=function(h){if(!h){return""}var c=[];for(var f in h){var e=h[f],b=encodeURIComponent(f);var g=typeof e;if(g=="undefined"){c.push(b,"=&")}else{if(g!="function"&&g!="object"){c.push(b,"=",encodeURIComponent(e),"&")}else{if(e instanceof Array){if(e.length){for(var d=0,a=e.length;d<a;d++){c.push(b,"=",encodeURIComponent(e[d]===undefined?"":e[d]),"&")}}else{c.push(b,"=&")}}}}}c.pop();return c.join("")},Sbi.sdk.urlDecode=function(f,h){if(!f||!f.length){return{}}var d={};var b=f.split("&");var c,a,j;for(var e=0,g=b.length;e<g;e++){c=b[e].split("=");a=decodeURIComponent(c[0]);j=decodeURIComponent(c[1]);if(h!==true){if(typeof d[a]=="undefined"){d[a]=j}else{if(typeof d[a]=="string"){d[a]=[d[a]];d[a].push(j)}else{d[a].push(j)}}}else{d[a]=j}}return d},Sbi.sdk.apply(Function.prototype,{createDelegate:function(c,b,a){var d=this;return function(){var f=b||arguments;if(a===true){f=Array.prototype.slice.call(arguments,0);f=f.concat(b)}else{if(typeof a=="number"){f=Array.prototype.slice.call(arguments,0);var e=[a,0].concat(b);Array.prototype.splice.apply(f,e)}}return d.apply(c||window,f)}},defer:function(c,e,b,a){var d=this.createDelegate(e,b,a);if(c){return setTimeout(d,c)}d();return 0}});Sbi.sdk.namespace("Sbi.sdk.ajax");Sbi.sdk.apply(Sbi.sdk.ajax,{request:function(g,e,a,f,b){if(b){var c=b.headers;if(c){for(var d in c){if(c.hasOwnProperty(d)){this.initHeader(d,c[d],false)}}}if(b.xmlData){this.initHeader("Content-Type","text/xml",false);g="POST";f=b.xmlData}else{if(b.jsonData){this.initHeader("Content-Type","text/javascript",false);g="POST";f=typeof b.jsonData=="object"?Ext.encode(b.jsonData):b.jsonData}}}return this.asyncRequest(g,e,a,f)},serializeForm:function(b){if(typeof b=="string"){b=(document.getElementById(b)||document.forms[b])}var c,a,d,f,g="",k=false;for(var h=0;h<b.elements.length;h++){c=b.elements[h];f=b.elements[h].disabled;a=b.elements[h].name;d=b.elements[h].value;if(!f&&a){switch(c.type){case"select-one":case"select-multiple":for(var e=0;e<c.options.length;e++){if(c.options[e].selected){if(Ext.isIE){g+=encodeURIComponent(a)+"="+encodeURIComponent(c.options[e].attributes.value.specified?c.options[e].value:c.options[e].text)+"&"}else{g+=encodeURIComponent(a)+"="+encodeURIComponent(c.options[e].hasAttribute("value")?c.options[e].value:c.options[e].text)+"&"}}}break;case"radio":case"checkbox":if(c.checked){g+=encodeURIComponent(a)+"="+encodeURIComponent(d)+"&"}break;case"file":case undefined:case"reset":case"button":break;case"submit":if(k==false){g+=encodeURIComponent(a)+"="+encodeURIComponent(d)+"&";k=true}break;default:g+=encodeURIComponent(a)+"="+encodeURIComponent(d)+"&";break}}}g=g.substr(0,g.length-1);return g},headers:{},hasHeaders:false,useDefaultHeader:true,defaultPostHeader:"application/x-www-form-urlencoded",useDefaultXhrHeader:true,defaultXhrHeader:"XMLHttpRequest",hasDefaultHeaders:true,defaultHeaders:{},poll:{},timeout:{},pollInterval:50,transactionId:0,setProgId:function(a){this.activeX.unshift(a)},setDefaultPostHeader:function(a){this.useDefaultHeader=a},setDefaultXhrHeader:function(a){this.useDefaultXhrHeader=a},setPollingInterval:function(a){if(typeof a=="number"&&isFinite(a)){this.pollInterval=a}},createXhrObject:function(f){var d,a;try{a=new XMLHttpRequest();d={conn:a,tId:f}}catch(c){for(var b=0;b<this.activeX.length;++b){try{a=new ActiveXObject(this.activeX[b]);d={conn:a,tId:f};break}catch(c){}}}finally{return d}},getConnectionObject:function(){var b;var c=this.transactionId;try{b=this.createXhrObject(c);if(b){this.transactionId++}}catch(a){}finally{return b}},asyncRequest:function(e,b,d,a){var c=this.getConnectionObject();if(!c){return null}else{c.conn.open(e,b,true);if(this.useDefaultXhrHeader){if(!this.defaultHeaders["X-Requested-With"]){this.initHeader("X-Requested-With",this.defaultXhrHeader,true)}}if(a&&this.useDefaultHeader){this.initHeader("Content-Type",this.defaultPostHeader)}if(this.hasDefaultHeaders||this.hasHeaders){this.setHeader(c)}this.handleReadyState(c,d);c.conn.send(a||null);return c}},handleReadyState:function(b,c){var a=this;if(c&&c.timeout){this.timeout[b.tId]=window.setTimeout(function(){a.abort(b,c,true)},c.timeout)}this.poll[b.tId]=window.setInterval(function(){if(b.conn&&b.conn.readyState==4){window.clearInterval(a.poll[b.tId]);delete a.poll[b.tId];if(c&&c.timeout){window.clearTimeout(a.timeout[b.tId]);delete a.timeout[b.tId]}a.handleTransactionResponse(b,c)}},this.pollInterval)},handleTransactionResponse:function(f,g,a){if(!g){this.releaseObject(f);return}var c,b;try{if(f.conn.status!==undefined&&f.conn.status!=0){c=f.conn.status}else{c=13030}}catch(d){c=13030}if(c>=200&&c<300){b=this.createResponseObject(f,g.argument);if(g.success){if(!g.scope){g.success(b)}else{g.success.apply(g.scope,[b])}}}else{switch(c){case 12002:case 12029:case 12030:case 12031:case 12152:case 13030:b=this.createExceptionObject(f.tId,g.argument,(a?a:false));if(g.failure){if(!g.scope){g.failure(b)}else{g.failure.apply(g.scope,[b])}}break;default:b=this.createResponseObject(f,g.argument);if(g.failure){if(!g.scope){g.failure(b)}else{g.failure.apply(g.scope,[b])}}}}this.releaseObject(f);b=null},createResponseObject:function(a,h){var d={};var k={};try{var c=a.conn.getAllResponseHeaders();var g=c.split("\n");for(var f=0;f<g.length;f++){var b=g[f].indexOf(":");if(b!=-1){k[g[f].substring(0,b)]=g[f].substring(b+2)}}}catch(j){}d.tId=a.tId;d.status=a.conn.status;d.statusText=a.conn.statusText;d.getResponseHeader=k;d.getAllResponseHeaders=c;d.responseText=a.conn.responseText;d.responseXML=a.conn.responseXML;if(typeof h!==undefined){d.argument=h}return d},createExceptionObject:function(h,d,a){var f=0;var g="communication failure";var c=-1;var b="transaction aborted";var e={};e.tId=h;if(a){e.status=c;e.statusText=b}else{e.status=f;e.statusText=g}if(d){e.argument=d}return e},initHeader:function(a,d,c){var b=(c)?this.defaultHeaders:this.headers;if(b[a]===undefined){b[a]=d}else{b[a]=d+","+b[a]}if(c){this.hasDefaultHeaders=true}else{this.hasHeaders=true}},setHeader:function(a){if(this.hasDefaultHeaders){for(var b in this.defaultHeaders){if(this.defaultHeaders.hasOwnProperty(b)){a.conn.setRequestHeader(b,this.defaultHeaders[b])}}}if(this.hasHeaders){for(var b in this.headers){if(this.headers.hasOwnProperty(b)){a.conn.setRequestHeader(b,this.headers[b])}}this.headers={};this.hasHeaders=false}},resetDefaultHeaders:function(){delete this.defaultHeaders;this.defaultHeaders={};this.hasDefaultHeaders=false},abort:function(b,c,a){if(this.isCallInProgress(b)){b.conn.abort();window.clearInterval(this.poll[b.tId]);delete this.poll[b.tId];if(a){delete this.timeout[b.tId]}this.handleTransactionResponse(b,c,true);return true}else{return false}},isCallInProgress:function(a){if(a.conn){return a.conn.readyState!=4&&a.conn.readyState!=0}else{return false}},releaseObject:function(a){a.conn=null;a=null},activeX:["MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"]});Sbi.sdk.namespace("Sbi.sdk.jsonp");Sbi.sdk.apply(Sbi.sdk.jsonp,{timeout:30000,callbackParam:"callback",nocache:true,trans_id:0,asyncRequest:function(f,h,d,a){if(this.head===undefined){this.head=document.getElementsByTagName("head")[0]}if(this.nocache){f+=(f.indexOf("?")!=-1?"&":"?")+"_dc="+(new Date().getTime())}var g=++this.trans_id;var c={id:g,cb:"stcCallback"+g,scriptId:"stcScript"+g,arg:a,url:f,callback:h,scope:d};var e=this;window[c.cb]=function(i){e.handleResponse(i,c)};f+=(f.indexOf("?")!=-1?"&":"?")+this.callbackParam+"="+c.cb;if(this.autoAbort!==false){this.abort()}c.timeoutId=this.handleFailure.defer(this.timeout,this,[c]);var b=document.createElement("script");b.setAttribute("src",f);b.setAttribute("type","text/javascript");b.setAttribute("id",c.scriptId);this.head.appendChild(b);this.trans=c},isLoading:function(){return this.trans?true:false},abort:function(){if(this.isLoading()){this.destroyTrans(this.trans)}},destroyTrans:function(b,a){this.head.removeChild(document.getElementById(b.scriptId));clearTimeout(b.timeoutId);if(a){window[b.cb]=undefined;try{delete window[b.cb]}catch(c){}}else{window[b.cb]=function(){window[b.cb]=undefined;try{delete window[b.cb]}catch(d){}}}},handleResponse:function(c,b){this.trans=false;this.destroyTrans(b,true);var a=c;b.callback.call(b.scope||window,a,b.arg,true)},handleFailure:function(a){this.trans=false;this.destroyTrans(a,false);a.callback.call(a.scope||window,null,a.arg,false)}});Sbi.sdk.namespace("Sbi.sdk.services");Sbi.sdk.apply(Sbi.sdk.services,{services:null,baseUrl:{protocol:"http",host:"localhost",port:"8080",contextPath:"SpagoBI",controllerPath:"servlet/AdapterHTTP"},initServices:function(){this.services={};this.services.authenticate={type:"ACTION",name:"LOGIN_ACTION_WEB",baseParams:{NEW_SESSION:"TRUE"}};this.services.execute={type:"PAGE",name:"ExecuteBIObjectPage",baseParams:{NEW_SESSION:"TRUE",MODALITY:"SINGLE_OBJECT_EXECUTION_MODALITY",IGNORE_SUBOBJECTS_VIEWPOINTS_SNAPSHOTS:"true"}};this.services.executewithext={type:"ACTION",name:"EXECUTE_DOCUMENT_ACTION",baseParams:{NEW_SESSION:"TRUE",IGNORE_SUBOBJECTS_VIEWPOINTS_SNAPSHOTS:"true"}}},setBaseUrl:function(a){Sbi.sdk.apply(this.baseUrl,a||{})},getServiceUrl:function(a,c){var b=null;if(this.services===null){this.initServices()}if(this.services[a]===undefined){alert("ERROR: Service ["+ +"] does not exist")}else{b="";b=this.baseUrl.protocol+"://"+this.baseUrl.host+":"+this.baseUrl.port+"/"+this.baseUrl.contextPath+"/"+this.baseUrl.controllerPath;var e;if(this.services[a].type==="PAGE"){e={PAGE:this.services[a].name}}else{e={ACTION_NAME:this.services[a].name}}Sbi.sdk.apply(e,c||{},this.services[a].baseParams||{});var d=Sbi.sdk.urlEncode(e);b+="?"+d}return b}});Sbi.sdk.namespace("Sbi.sdk.api");Sbi.sdk.apply(Sbi.sdk.api,{elId:0,authenticate:function(a){var b=Sbi.sdk.services.getServiceUrl("authenticate",a.params);Sbi.sdk.jsonp.asyncRequest(b,a.callback.fn,a.callback.scope,a.callback.args)},getDocumentUrl:function(a){var b=null;if(a.documentId===undefined&&a.documentLabel===undefined){alert("ERRORE: at least one beetween documentId and documentLabel attributes must be specifyed");return null}var c=Sbi.sdk.apply({},a.parameters||{});if(a.documentId!==undefined){c.OBJECT_ID=a.documentId}if(a.documentLabel!==undefined){c.OBJECT_LABEL=a.documentLabel}if(a.executionRole!==undefined){c.ROLE=a.executionRole}if(a.displayToolbar!==undefined){c.TOOLBAR_VISIBLE=a.displayToolbar}if(a.displaySliders!==undefined){c.SLIDERS_VISIBLE=a.displaySliders}if(a.theme!==undefined){c.theme=a.theme}if(a.useExtUI===true){b=Sbi.sdk.services.getServiceUrl("executewithext",c)}else{b=Sbi.sdk.services.getServiceUrl("execute",c)}return b},getDocumentHtml:function(a){var c;var b=this.getDocumentUrl(a);a.iframe=a.iframe||{};if(a.iframe.id===undefined){a.iframe.id="sbi-docexec-iframe-"+this.elId;this.elId=this.elId+1}c="";c+="<iframe";c+=' id = "'+a.iframe.id+'" ';c+=' src = "'+b+'" ';if(a.iframe.style!==undefined){c+=' style = "'+a.iframe.style+'" '}if(a.iframe.width!==undefined){c+=' width = "'+a.iframe.width+'" '}if(a.iframe.height!==undefined){c+=' height = "'+a.iframe.height+'" '}c+="></iframe>";return c},injectDocument:function(b){var c=b.target||document.body;if(typeof c==="string"){var a=c;c=document.getElementById(c);if(c===null){c=document.createElement("div");c.setAttribute("id",a);if(b.width!==undefined){c.setAttribute("width",b.width)}if(b.height!==undefined){c.setAttribute("height",b.height)}document.body.appendChild(c)}}b.iframe=b.iframe||{};b.iframe.width=c.getAttribute("width");b.iframe.height=c.getAttribute("height");c.innerHTML=this.getDocumentHtml(b)}});